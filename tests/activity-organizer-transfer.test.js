import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const migration = read("../supabase/site/migrations/20260914213436_activity_organizer_transfer_production_fix.sql");
const detail = read("../js/pages/activityDetail.js");
const api = read("../js/api/activities.js");
const styles = read("../css/activity-detail.css");

test("organizer transfer is restricted to the current organizer and joined participants", () => {
  assert.match(migration, /create or replace function public\.transfer_event_organizer/);
  assert.match(migration, /v_event\.created_by <> v_user_id/);
  assert.match(migration, /v_new_organizer_status <> 'joined'/);
  assert.match(migration, /set_config\('app\.allow_event_organizer_transfer', 'true', true\)/);
  assert.match(migration, /update public\.events[\s\S]*set created_by = p_new_organizer_id/);
  assert.match(
    migration,
    /grant execute on function public\.transfer_event_organizer\(bigint, uuid, boolean\)[\s\S]*to authenticated, service_role/,
  );
  assert.match(migration, /notify pgrst, 'reload schema'/);
});

test("organizer cannot leave while another confirmed participant remains", () => {
  assert.match(
    migration,
    /v_event\.created_by = v_user_id[\s\S]*other_participant\.status = 'joined'[\s\S]*먼저 주최자를 변경해야 합니다/,
  );
  assert.match(migration, /if p_leave_current then[\s\S]*perform public\.cancel_event_participation\(p_event_id\)/);
});

test("organizer migration preserves participant cancellation notifications", () => {
  assert.match(migration, /v_actor_name text/);
  assert.match(migration, /event_participation_cancelled/);
  assert.match(migration, /format\('#\/activities\/%s', p_event_id\)/);
});

test("activity detail exposes organizer card, crown, and leave handoff flow", () => {
  assert.match(detail, /organizerMeta\(event, organizerAvatarUrl, canTransferOrganizer, participants, root\)/);
  assert.match(detail, /activity-detail__meta-label", text: "주최자"/);
  assert.match(detail, /participant-person__organizer-crown/);
  assert.match(detail, /text: "👑"/);
  assert.match(detail, /leaveAfterTransfer: true/);
  assert.match(detail, /주최자를 먼저 변경해주세요/);
  assert.match(detail, /넘기고 참여 취소/);
});

test("activity API resolves organizer profile and exposes transfer RPC", () => {
  assert.match(api, /getPublicProfiles\(\[withSummary\.created_by\]\)/);
  assert.match(api, /organizer: organizer \?\? null/);
  assert.match(api, /export async function transferEventOrganizer/);
  assert.match(api, /supabase\.rpc\("transfer_event_organizer"/);
});

test("organizer presentation includes crown and transfer layouts", () => {
  assert.match(styles, /\.activity-detail__organizer-value/);
  assert.match(styles, /\.participant-person__organizer-crown/);
  assert.match(styles, /\.activity-organizer-transfer__person/);
});
