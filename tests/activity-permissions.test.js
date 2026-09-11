import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  canCancelActivityFor,
  canDeleteActivityFor,
  canEditActivityFor,
  canManageActivityFor,
} from "../js/permissions.js";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const migration = read("../supabase/site/migrations/20260910050634_member_owned_activity_management.sql");
const capabilityMigration = read("../supabase/site/migrations/20260911102000_member_activity_capability_boundaries.sql");
const form = read("../js/pages/activityForm.js");
const detail = read("../js/pages/activityDetail.js");
const activities = read("../js/pages/activities.js");
const app = read("../js/app.js");
const authSource = read("../js/auth.js");

function auth({ id = "member", categories = [], community = false, system = false } = {}) {
  return {
    user: { id },
    isSystemAdmin: system,
    adminPermissions: new Set(community ? ["community"] : []),
    managerCategoryIds: new Set(categories),
  };
}

function activity({
  seriesId = null,
  creator = "owner",
  categoryId = 7,
  status = "scheduled",
} = {}) {
  return {
    series_id: seriesId,
    created_by: creator,
    category_id: categoryId,
    status,
  };
}

test("activity capabilities separate member edit/cancel from operator deletion", () => {
  const owner = auth({ id: "owner" });
  const manager = auth({ categories: [7] });
  const community = auth({ community: true });
  const system = auth({ system: true });
  const scheduled = activity();
  const closed = activity({ status: "closed" });
  const cancelled = activity({ status: "cancelled" });
  const completed = activity({ status: "completed" });
  const recurring = activity({ seriesId: 13 });

  assert.equal(canEditActivityFor(owner, scheduled), true);
  assert.equal(canEditActivityFor(owner, closed), true);
  assert.equal(canEditActivityFor(owner, cancelled), false);
  assert.equal(canEditActivityFor(owner, completed), false);
  assert.equal(canEditActivityFor(owner, recurring), false);
  assert.equal(canManageActivityFor(owner, scheduled), true);
  assert.equal(canManageActivityFor(owner, cancelled), false);

  assert.equal(canCancelActivityFor(owner, scheduled), true);
  assert.equal(canCancelActivityFor(owner, closed), true);
  assert.equal(canCancelActivityFor(owner, cancelled), false);
  assert.equal(canCancelActivityFor(owner, completed), false);
  assert.equal(canCancelActivityFor(owner, recurring), false);

  assert.equal(canDeleteActivityFor(owner, scheduled), false);
  assert.equal(canDeleteActivityFor(manager, scheduled), true);
  assert.equal(canDeleteActivityFor(manager, recurring), false);
  assert.equal(canDeleteActivityFor(community, scheduled), true);
  assert.equal(canDeleteActivityFor(system, scheduled), true);

  assert.equal(canEditActivityFor(manager, recurring), true);
  assert.equal(canCancelActivityFor(manager, recurring), true);
  assert.equal(canEditActivityFor(auth({ categories: [8] }), scheduled), false);
  assert.equal(canEditActivityFor(community, recurring), true);
  assert.equal(canEditActivityFor(system, recurring), true);
});

test("approved routes and activity UI expose ownership-aware single activity management", () => {
  assert.match(app, /route\("\/activities\/new", "활동 등록", "approved"/);
  assert.match(app, /route\("\/activities\/:id\/edit", "활동 수정", "approved"/);
  assert.match(activities, /href: "#\/activities\/new"/);
  assert.match(detail, /canEditActivityFor\(auth, event\)/);
  assert.match(detail, /canCancelActivityFor\(auth, event\)/);
  assert.match(detail, /canDeleteActivityFor\(auth, event\)/);
  assert.match(detail, /permissions\.canDelete \? el\("button"/);
  assert.match(detail, /removeEvent\(event\.id\)/);
  assert.match(form, /event\?\.created_by === auth\.user\?\.id/);
  assert.match(form, /permissions\.canCreateRecurring \?/);
  assert.match(form, /form\.recurring\?\.checked === true/);
  assert.match(form, /category\.is_active === false \? " \(비활성\)"/);
  assert.doesNotMatch(authSource, /managerCategoryIds[\s\S]*\.eq\("is_active", true\)/);
});

test("member insert policy binds identity, active category, and recurring series integrity", () => {
  assert.match(migration, /create policy events_member_insert/);
  assert.match(migration, /private\.is_approved_member\(\)/);
  assert.match(migration, /created_by = \(select auth\.uid\(\)\)/);
  assert.match(migration, /category\.is_active/);
  assert.match(
    migration,
    /series_id is null[\s\S]*private\.has_admin_permission\('community'\)[\s\S]*private\.is_category_manager\(category_id\)[\s\S]*from public\.event_series series[\s\S]*series\.id = series_id[\s\S]*series\.category_id = category_id/,
  );
  assert.doesNotMatch(migration, /create policy [^;]+ for all/i);
});

test("update boundary keeps ownership standalone and recurring occurrences manager-only", () => {
  assert.match(migration, /new\.created_by is distinct from old\.created_by/);
  assert.match(migration, /new\.created_at is distinct from old\.created_at/);
  assert.match(migration, /\(series_id is null and created_by = \(select auth\.uid\(\)\)\)/);
  assert.match(migration, /v_is_owner := old\.series_id is null and old\.created_by = v_user_id/);
  assert.match(migration, /new\.series_id is distinct from old\.series_id/);
  assert.match(migration, /반복 활동 연결은 생성 후 변경할 수 없습니다/);
  assert.match(
    migration,
    /old\.series_id is not null[\s\S]*new\.category_id is distinct from old\.category_id[\s\S]*반복 활동 일정의 카테고리는 개별 변경할 수 없습니다/,
  );
  assert.match(
    migration,
    /if old\.series_id is not null then[\s\S]*if not private\.is_category_manager\(old\.category_id\)/,
  );
  assert.match(migration, /new\.status is distinct from old\.status and new\.status <> 'cancelled'/);
  assert.match(migration, /private\.is_category_manager\(old\.category_id\)[\s\S]*private\.is_category_manager\(new\.category_id\)/);
  assert.match(migration, /private\.has_admin_permission\('community'\)/);
  assert.match(migration, /new\.category_id is distinct from old\.category_id and not exists/);
  assert.match(migration, /create or replace function private\.enforce_event_series_management_boundary/);
  assert.match(
    migration,
    /new\.category_id is distinct from old\.category_id[\s\S]*반복 활동 카테고리는 생성 후 변경할 수 없습니다/,
  );
});

test("terminal member-owned activities are read-only unless the owner is also an operator", () => {
  assert.match(capabilityMigration, /create or replace function private\.enforce_member_activity_terminal_read_only/);
  assert.match(capabilityMigration, /old\.series_id is null/);
  assert.match(capabilityMigration, /old\.created_by = v_user_id/);
  assert.match(capabilityMigration, /old\.status in \('cancelled', 'completed'\)/);
  assert.match(capabilityMigration, /not private\.has_admin_permission\('community'\)/);
  assert.match(capabilityMigration, /not private\.is_category_manager\(old\.category_id\)/);
});

test("physical removal is reserved for category or community operators", () => {
  assert.match(capabilityMigration, /create or replace function public\.remove_or_cancel_event/);
  assert.match(
    capabilityMigration,
    /if not \(\s*private\.has_admin_permission\('community'\)\s*or private\.is_category_manager\(v_event\.category_id\)\s*\) then/,
  );
  assert.doesNotMatch(
    capabilityMigration,
    /v_event\.series_id is null[\s\S]*v_event\.created_by = v_user_id/,
  );
  assert.match(capabilityMigration, /if v_event\.series_id is not null or exists/);
  assert.match(capabilityMigration, /update public\.events set status = 'cancelled'/);
  assert.match(capabilityMigration, /delete from public\.events where id = p_event_id/);
  assert.match(capabilityMigration, /grant execute on function public\.remove_or_cancel_event\(bigint\) to authenticated/);
});

test("safe removal preserves recurring occurrences and activities with operational history", () => {
  assert.match(migration, /create or replace function public\.remove_or_cancel_event/);
  assert.match(migration, /if v_event\.series_id is not null or exists/);
  assert.match(migration, /from public\.event_participants participant[\s\S]*participant\.event_id = p_event_id/);
  assert.match(migration, /from public\.notifications notification[\s\S]*notification\.event_id = p_event_id/);
  assert.match(migration, /from public\.date_polls poll[\s\S]*poll\.result_event_id = p_event_id/);
  assert.match(migration, /update public\.events set status = 'cancelled'/);
  assert.match(migration, /delete from public\.events where id = p_event_id/);
  assert.match(migration, /revoke all on function public\.remove_or_cancel_event\(bigint\) from public, anon, authenticated/);
  assert.match(migration, /grant execute on function public\.remove_or_cancel_event\(bigint\) to authenticated/);
});

test("recurring activity authorization remains manager-only at UI and database layers", () => {
  assert.match(form, /auth\.managerCategoryIds\.has\(Number\(category\.id\)\)/);
  assert.doesNotMatch(migration, /drop policy if exists event_series/);
  assert.doesNotMatch(migration, /create or replace function public\.create_recurring_event/);
});
