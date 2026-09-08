import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  ADMIN_PERMISSION,
  ASSIGNABLE_ADMIN_PERMISSIONS,
  hasAdminPermission,
} from "../js/permissions.js";

test("system administrators implicitly have every administrative permission", () => {
  assert.equal(hasAdminPermission({ isSystemAdmin: true, adminPermissions: new Set() }, ADMIN_PERMISSION.SYSTEM), true);
});

test("administrators only have explicitly assigned areas", () => {
  const auth = { isSystemAdmin: false, adminPermissions: new Set([ADMIN_PERMISSION.MEMBERS]) };
  assert.equal(hasAdminPermission(auth, ADMIN_PERMISSION.MEMBERS), true);
  assert.equal(hasAdminPermission(auth, ADMIN_PERMISSION.GAMES), false);
});

test("permission and system administration are not assignable", () => {
  const keys = ASSIGNABLE_ADMIN_PERMISSIONS.map(({ key }) => key);
  assert.equal(keys.includes(ADMIN_PERMISSION.PERMISSIONS), false);
  assert.equal(keys.includes(ADMIN_PERMISSION.SYSTEM), false);
});

test("database migration enforces request-level and singleton boundaries", () => {
  const migration = readFileSync(new URL("../supabase/site/migrations/20260908090000_add_admin_permission_system.sql", import.meta.url), "utf8");
  assert.match(migration, /private\.has_admin_permission\('members'\)/);
  assert.match(migration, /private\.has_admin_permission\('community'\)/);
  assert.match(migration, /private\.has_admin_permission\('operations'\)/);
  assert.match(migration, /profiles_single_system_admin_idx/);
  assert.match(migration, /if not private\.is_system_admin\(\)/);
  assert.match(migration, /revoke all on function public\.bootstrap_system_admin\(uuid\) from public, anon, authenticated/);
  assert.match(migration, /event_series_community_admin_all/);
  assert.match(migration, /private\.has_admin_permission\('community'\) or private\.is_category_manager/);
  assert.match(migration, /events_community_admin_all/);
  assert.match(migration, /client_error_logs_select_operations_admin/);
  assert.match(migration, /app\.allow_member_admin_update/);
  assert.match(migration, /function private\.protect_comment_identity\(\)/);
  assert.match(migration, /function private\.protect_creator_identity\(\)/);
  assert.match(migration, /delete from public\.admin_permissions where user_id = p_user_id/);
  assert.doesNotMatch(migration, /마지막 관리자의 권한은 회수할 수 없습니다/);
  assert.doesNotMatch(migration, /마지막 관리자는 이용 정지할 수 없습니다/);
});
