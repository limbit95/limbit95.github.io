import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationPath = new URL("../supabase/site/migrations/20260917041000_activity_detail_read_model.sql", import.meta.url);
const apiPath = new URL("../js/api/activities.js", import.meta.url);

async function readSources() {
  return Promise.all([
    readFile(migrationPath, "utf8"),
    readFile(apiPath, "utf8"),
  ]);
}

test("activity detail read model keeps approved-member and profile privacy boundaries", async () => {
  const [migration] = await readSources();

  assert.match(migration, /create or replace function public\.get_event_detail_core\(p_event_id bigint\)/i);
  assert.match(migration, /create or replace function public\.get_activity_detail_supplement\(p_event_id bigint\)/i);
  assert.match(migration, /security definer/i);
  assert.match(migration, /set search_path = ''/i);
  assert.match(migration, /v_user_id is null or not private\.is_approved_member\(\)/i);
  assert.match(migration, /organizer\.age_visibility = 'birth_year'/i);
  assert.match(migration, /organizer\.age_visibility = 'age_group'/i);
  assert.match(migration, /profile\.age_visibility = 'birth_year'/i);
  assert.match(migration, /profile\.age_visibility = 'age_group'/i);
  assert.match(migration, /v_user_id in \(request\.from_organizer_id, request\.to_organizer_id\)/i);
  assert.match(migration, /revoke all on function public\.get_event_detail_core\(bigint\)[\s\S]*?from public, anon, authenticated/i);
  assert.match(migration, /grant execute on function public\.get_activity_detail_supplement\(bigint\)[\s\S]*?to authenticated, service_role/i);
});

test("activity API loads detail through two read-model RPCs without stale supplement caching", async () => {
  const [, api] = await readSources();

  assert.match(api, /supabase\.rpc\("get_event_detail_core",\s*\{\s*p_event_id: Number\(eventId\)/);
  assert.match(api, /supabase\.rpc\("get_activity_detail_supplement",\s*\{\s*p_event_id: numericEventId/);
  assert.match(api, /const activityDetailSupplementRequests = new Map\(\)/);
  assert.match(api, /const existingRequest = activityDetailSupplementRequests\.get\(numericEventId\)/);
  assert.match(api, /activityDetailSupplementRequests\.delete\(numericEventId\)/);
  assert.match(api, /supplement\.participants \?\? \[\]/);
  assert.match(api, /supplement\.organizer_history \?\? \[\]/);
  assert.match(api, /supplement\.organizer_transfer_request \?\? null/);
  assert.doesNotMatch(api, /getPublicProfiles/);
  assert.doesNotMatch(api, /get_event_organizer_transfer_request/);
  assert.doesNotMatch(api, /list_event_organizer_history/);
});
