import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const migration = read("../supabase/site/migrations/20260915010600_activity_organizer_history_detail_push.sql");
const api = read("../js/api/activityOrganizerHistory.js");
const detail = read("../js/pages/activityDetail.js");
const pushFunction = read("../supabase/functions/send-web-push/index.ts");
const styles = read("../css/activity-detail.css");
const mypage = read("../js/pages/mypage.js");

test("approved members can read transfer-only organizer history for an activity", () => {
  assert.match(migration, /create or replace function public\.list_event_organizer_history/);
  assert.match(migration, /not private\.is_approved_member\(\)/);
  assert.match(migration, /history\.change_type = 'transfer'/);
  assert.match(migration, /order by history\.changed_at desc, history\.id desc/);
  assert.match(migration, /grant execute on function public\.list_event_organizer_history\(bigint\) to authenticated, service_role/);
});

test("activity detail shows organizer change history only when transfers exist", () => {
  assert.match(api, /supabase\.rpc\("list_event_organizer_history"/);
  assert.match(detail, /listEventOrganizerHistory\(event\.id\)/);
  assert.match(detail, /organizerHistory\.length \? el\("button"/);
  assert.match(detail, /text: "변경 내역"/);
  assert.match(detail, /title: "주최자 변경 내역"/);
  assert.match(detail, /previous_organizer_name/);
  assert.match(detail, /organizer_name/);
  assert.match(styles, /\.activity-organizer-history__item/);
});

test("organizer transfer creates a dedicated notification for the new organizer", () => {
  assert.match(migration, /'event_organizer_changed'::text/);
  assert.match(migration, /event_organizer_history_notify_new_organizer/);
  assert.match(migration, /new\.organizer_id,[\s\S]*'event_organizer_changed'/);
  assert.match(migration, /활동의 주최자로 지정되었습니다/);
  assert.match(migration, /'event_organizer_changed:' \|\| new\.id::text/);
});

test("organizer transfer push bypasses My Page category preferences but still uses active subscriptions", () => {
  assert.match(pushFunction, /"event_organizer_changed"/);
  assert.match(pushFunction, /const ALWAYS_PUSH_TYPES = new Set\(\["join_request_received", "event_organizer_changed"\]\)/);
  assert.match(pushFunction, /if \(ALWAYS_PUSH_TYPES\.has\(type\)\) return true/);
  assert.match(pushFunction, /push_subscriptions\?select=id,endpoint,p256dh,auth&user_id=eq\./);
});


test("My Page explains mandatory organizer transfer push", () => {
  assert.match(mypage, /주최자 지정 알림은 아래 종류 설정과 관계없이 전달/);
  assert.match(mypage, /주최자 지정 알림은 알림 종류 설정과 관계없이 받습니다/);
});
