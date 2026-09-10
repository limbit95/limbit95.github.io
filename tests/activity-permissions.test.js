import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { canManageActivityFor } from "../js/permissions.js";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const migration = read("../supabase/site/migrations/20260910090000_member_owned_activity_management.sql");
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

test("activity management combines standalone ownership, resource responsibility, and administration", () => {
  const standalone = { series_id: null, created_by: "owner", category_id: 7 };
  const recurring = { series_id: 13, created_by: "owner", category_id: 7 };
  assert.equal(canManageActivityFor(auth({ id: "owner" }), standalone), true);
  assert.equal(canManageActivityFor(auth({ id: "owner" }), recurring), false);
  assert.equal(canManageActivityFor(auth({ categories: [7] }), recurring), true);
  assert.equal(canManageActivityFor(auth({ categories: [8] }), standalone), false);
  assert.equal(canManageActivityFor(auth({ community: true }), recurring), true);
  assert.equal(canManageActivityFor(auth({ system: true }), recurring), true);
});

test("approved routes and activity UI expose ownership-aware single activity management", () => {
  assert.match(app, /route\("\/activities\/new", "활동 등록", "approved"/);
  assert.match(app, /route\("\/activities\/:id\/edit", "활동 수정", "approved"/);
  assert.match(activities, /href: "#\/activities\/new"/);
  assert.match(detail, /canManageActivity\(event\)/);
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

test("safe removal preserves recurring occurrences and activities with operational history", () => {
  assert.match(migration, /create or replace function public\.remove_or_cancel_event/);
  assert.match(
    migration,
    /v_event\.series_id is null[\s\S]*v_event\.created_by = v_user_id/,
  );
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
