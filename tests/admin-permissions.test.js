import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  ADMIN_PERMISSION,
  ASSIGNABLE_ADMIN_PERMISSIONS,
  hasAdminPermission,
} from "../js/permissions.js";

const permissionMigration = readFileSync(
  new URL("../supabase/site/migrations/20260908090000_add_admin_permission_system.sql", import.meta.url),
  "utf8",
);

function policySql(name) {
  return permissionMigration.match(new RegExp(`create policy ${name} [\\s\\S]*?;`))?.[0];
}

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
  const migration = permissionMigration;
  assert.match(migration, /private\.has_admin_permission\('members'\)/);
  assert.match(migration, /private\.has_admin_permission\('community'\)/);
  assert.match(migration, /private\.has_admin_permission\('operations'\)/);
  assert.match(migration, /profiles_single_system_admin_idx/);
  assert.match(migration, /if not private\.is_system_admin\(\)/);
  assert.match(migration, /revoke all on function public\.bootstrap_system_admin\(uuid\) from public, anon, authenticated/);
  assert.match(migration, /event_series_community_admin_insert/);
  assert.match(migration, /private\.has_admin_permission\('community'\) or private\.is_category_manager/);
  assert.match(migration, /events_community_admin_insert/);
  assert.match(migration, /client_error_logs_select_operations_admin/);
  assert.match(migration, /app\.allow_member_admin_update/);
  assert.match(migration, /function private\.protect_comment_identity\(\)/);
  assert.match(migration, /function private\.protect_creator_identity\(\)/);
  assert.match(migration, /delete from public\.admin_permissions where user_id = p_user_id/);
  assert.doesNotMatch(migration, /마지막 관리자의 권한은 회수할 수 없습니다/);
  assert.doesNotMatch(migration, /마지막 관리자는 이용 정지할 수 없습니다/);
});

test("scoped administrator inserts preserve ownership and publication invariants", () => {
  const inserts = [
    ["event_series_community_admin_insert", /created_by = \(select auth\.uid\(\)\)/],
    ["events_community_admin_insert", /created_by = \(select auth\.uid\(\)\)/],
    ["date_polls_operations_admin_insert", /created_by = \(select auth\.uid\(\)\)/],
    ["posts_community_admin_insert", /author_id = \(select auth\.uid\(\)\)/],
    ["comments_community_admin_insert", /author_id = \(select auth\.uid\(\)\)/],
  ];

  for (const [name, identityInvariant] of inserts) {
    const policy = policySql(name);
    assert.ok(policy, `${name} must exist`);
    assert.match(policy, /for insert/);
    assert.match(policy, /private\.is_approved_member\(\)/);
    assert.match(policy, identityInvariant);
  }

  assert.match(policySql("posts_community_admin_insert"), /status = 'published'/);
  assert.match(policySql("posts_community_admin_insert"), /board_type in \('free', 'notice'\)/);
  assert.match(policySql("comments_community_admin_insert"), /status = 'published'/);
});

test("scoped administrator write policies do not use FOR ALL", () => {
  const unsafePolicyNames = [
    "event_series_community_admin_all",
    "events_community_admin_all",
    "date_polls_operations_admin_all",
    "posts_community_admin_all",
    "comments_community_admin_all",
  ];

  for (const name of unsafePolicyNames) {
    assert.doesNotMatch(permissionMigration, new RegExp(`create policy ${name}\\b`));
  }

  for (const prefix of [
    "event_series_community_admin",
    "events_community_admin",
    "date_polls_operations_admin",
    "posts_community_admin",
    "comments_community_admin",
  ]) {
    assert.ok(policySql(`${prefix}_insert`), `${prefix} must have an INSERT policy`);
    assert.ok(policySql(`${prefix}_update`), `${prefix} must have an UPDATE policy`);
    assert.ok(policySql(`${prefix}_delete`), `${prefix} must have a DELETE policy`);
  }
});

test("invite revocation keeps creator access and requires operations for cross-user access", () => {
  const migration = permissionMigration;
  const revokeFunction = migration.match(
    /create or replace function public\.site_invite_revoke\(p_token text\)[\s\S]*?\n\$\$;/,
  )?.[0];

  assert.ok(revokeFunction, "site_invite_revoke must be redefined by the permission migration");
  assert.match(revokeFunction, /created_by = auth\.uid\(\)/);
  assert.match(revokeFunction, /or private\.has_admin_permission\('operations'\)/);
  assert.doesNotMatch(revokeFunction, /private\.is_admin\(\)/);

  assert.equal(hasAdminPermission({ isSystemAdmin: true, adminPermissions: new Set() }, ADMIN_PERMISSION.OPERATIONS), true);
  assert.equal(hasAdminPermission({ isSystemAdmin: false, adminPermissions: new Set([ADMIN_PERMISSION.OPERATIONS]) }, ADMIN_PERMISSION.OPERATIONS), true);
  assert.equal(hasAdminPermission({ isSystemAdmin: false, adminPermissions: new Set([ADMIN_PERMISSION.COMMUNITY]) }, ADMIN_PERMISSION.OPERATIONS), false);
  assert.equal(hasAdminPermission({ isSystemAdmin: false, adminPermissions: new Set([ADMIN_PERMISSION.MEMBERS]) }, ADMIN_PERMISSION.OPERATIONS), false);
  assert.equal(hasAdminPermission({ isSystemAdmin: false, adminPermissions: new Set() }, ADMIN_PERMISSION.OPERATIONS), false);
});

test("creator identity protection keeps community and operations boundaries separate", () => {
  const migration = permissionMigration;
  const creatorProtection = migration.match(
    /create or replace function private\.protect_creator_identity\(\)[\s\S]*?end; \$\$;/,
  )?.[0];
  const permissionHelper = migration.match(
    /create or replace function private\.has_admin_permission\(p_permission text\)[\s\S]*?\n\$\$;/,
  )?.[0];

  assert.ok(creatorProtection, "creator identity trigger function must exist");
  assert.match(creatorProtection, /when 'events' then 'community'/);
  assert.match(creatorProtection, /when 'event_series' then 'community'/);
  assert.match(creatorProtection, /when 'date_polls' then 'operations'/);
  assert.match(creatorProtection, /not private\.has_admin_permission\(v_required_permission\)/);
  assert.doesNotMatch(creatorProtection, /private\.is_category_manager/);
  assert.doesNotMatch(
    creatorProtection,
    /not private\.has_admin_permission\('community'\)[\s\S]*and not private\.has_admin_permission\('operations'\)/,
  );

  assert.ok(permissionHelper, "permission helper must exist");
  assert.match(permissionHelper, /select private\.is_system_admin\(\) or/);
});
