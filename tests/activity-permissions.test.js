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

function auth({ id = "member", categories = [], community = false, system = false } = {}) {
  return {
    user: { id },
    isSystemAdmin: system,
    adminPermissions: new Set(community ? ["community"] : []),
    managerCategoryIds: new Set(categories),
  };
}

test("activity management combines ownership, resource responsibility, and administration", () => {
  const event = { created_by: "owner", category_id: 7 };
  assert.equal(canManageActivityFor(auth({ id: "owner" }), event), true);
  assert.equal(canManageActivityFor(auth({ categories: [7] }), event), true);
  assert.equal(canManageActivityFor(auth({ categories: [8] }), event), false);
  assert.equal(canManageActivityFor(auth({ community: true }), event), true);
  assert.equal(canManageActivityFor(auth({ system: true }), event), true);
});

test("approved routes and activity UI expose ownership-aware single activity management", () => {
  assert.match(app, /route\("\/activities\/new", "활동 등록", "approved"/);
  assert.match(app, /route\("\/activities\/:id\/edit", "활동 수정", "approved"/);
  assert.match(activities, /href: "#\/activities\/new"/);
  assert.match(detail, /canManageActivity\(event\)/);
  assert.match(detail, /removeEvent\(event\.id\)/);
  assert.match(form, /event\?\.created_by === auth\.user\?\.id/);
  assert.match(form, /permissions\.canCreateRecurring \?/);
  assert.match(form, /recurring\.checked \? recurringCategories : categories/);
});

test("member insert policy binds identity, active category, and single activity boundary", () => {
  assert.match(migration, /create policy events_member_insert/);
  assert.match(migration, /private\.is_approved_member\(\)/);
  assert.match(migration, /created_by = \(select auth\.uid\(\)\)/);
  assert.match(migration, /category\.is_active/);
  assert.match(migration, /series_id is null[\s\S]*private\.has_admin_permission\('community'\)[\s\S]*private\.is_category_manager\(category_id\)/);
  assert.doesNotMatch(migration, /create policy [^;]+ for all/i);
});

test("update trigger preserves identity and category transfer boundaries", () => {
  assert.match(migration, /new\.created_by is distinct from old\.created_by/);
  assert.match(migration, /new\.created_at is distinct from old\.created_at/);
  assert.match(migration, /v_is_owner := old\.created_by = v_user_id/);
  assert.match(migration, /new\.status is distinct from old\.status and new\.status <> 'cancelled'/);
  assert.match(migration, /private\.is_category_manager\(old\.category_id\)[\s\S]*private\.is_category_manager\(new\.category_id\)/);
  assert.match(migration, /private\.has_admin_permission\('community'\)/);
});

test("safe removal preserves activities with any participation history", () => {
  assert.match(migration, /create or replace function public\.remove_or_cancel_event/);
  assert.match(migration, /from public\.event_participants participant[\s\S]*participant\.event_id = p_event_id/);
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
