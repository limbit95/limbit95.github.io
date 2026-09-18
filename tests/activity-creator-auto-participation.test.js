import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const migration = read("../supabase/site/migrations/20260914151803_activity_creator_auto_participation.sql");
const removalCompatMigration = read("../supabase/site/migrations/20260914151812_activity_creator_auto_participation_removal_compat.sql");
const ownerDeleteMigration = read("../supabase/site/migrations/20260914154042_restore_activity_owner_clean_delete.sql");
const participationRpc = read("../supabase/site/baseline/10_participation_rpc.sql");

test("activity creator is auto-joined atomically by an events insert trigger", () => {
  assert.match(migration, /create or replace function private\.auto_join_event_creator\(\)/);
  assert.match(migration, /security definer/);
  assert.match(migration, /set search_path = ''/);
  assert.match(migration, /v_user_id uuid := auth\.uid\(\)/);
  assert.match(migration, /new\.created_by is distinct from v_user_id/);
  assert.match(migration, /insert into public\.event_participants/);
  assert.match(migration, /new\.id,\s*v_user_id,\s*'joined',\s*now\(\)/);
  assert.match(migration, /create trigger events_auto_join_creator\s*after insert on public\.events/);
  assert.match(migration, /for each row execute function private\.auto_join_event_creator\(\)/);
});

test("system admin is the only activity creator excluded from automatic participation", () => {
  assert.match(migration, /private\.is_system_admin\(\)/);
  assert.doesNotMatch(migration, /private\.has_admin_permission\('community'\)/);
  assert.doesNotMatch(migration, /private\.is_category_manager\(/);
});

test("automatic creator participation uses joined status and remains cancellable through the existing domain RPC", () => {
  assert.match(migration, /'joined'/);
  assert.doesNotMatch(migration, /'waitlisted'/);
  assert.match(participationRpc, /create or replace function public\.cancel_event_participation\(p_event_id bigint\)/);
  assert.match(participationRpc, /where ep\.event_id = p_event_id[\s\S]*ep\.user_id = v_user_id/);
  assert.match(participationRpc, /set status = 'cancelled',[\s\S]*cancelled_at = now\(\)/);
});

test("creator auto-participation alone does not count as activity history for removal", () => {
  assert.match(removalCompatMigration, /create or replace function public\.remove_or_cancel_event\(p_event_id bigint\)/);
  assert.match(
    ownerDeleteMigration,
    /participant\.event_id = p_event_id\s*and participant\.user_id <> v_event\.created_by/,
  );
  assert.match(ownerDeleteMigration, /delete from public\.events where id = p_event_id/);
});

test("latest removal policy lets a standalone creator clean up only mutable activities", () => {
  assert.match(ownerDeleteMigration, /private\.has_admin_permission\('community'\)/);
  assert.match(ownerDeleteMigration, /private\.is_category_manager\(v_event\.category_id\)/);
  assert.match(
    ownerDeleteMigration,
    /v_event\.series_id is null\s*and v_event\.created_by = v_user_id\s*and v_event\.status in \('scheduled', 'closed'\)/,
  );
  assert.match(ownerDeleteMigration, /이 활동을 삭제할 권한이 없습니다\./);
});

test("trigger applies to every inserted event so recurring occurrences receive the same creator policy", () => {
  assert.match(migration, /after insert on public\.events/);
  assert.doesNotMatch(migration, /series_id is null/);
});

test("trigger function cannot be invoked directly by browser roles", () => {
  assert.match(
    migration,
    /revoke all on function private\.auto_join_event_creator\(\)\s*from public, anon, authenticated/,
  );
});
