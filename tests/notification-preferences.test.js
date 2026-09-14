import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationPath = "supabase/site/migrations/20260914060200_notification_preferences_and_activity_updates.sql";
const edgeFunctionPath = "supabase/functions/send-web-push/index.ts";
const notificationsApiPath = "js/api/notifications.js";
const myPagePath = "js/pages/mypage.js";
const headerPath = "js/components/header.js";

test("push preferences separate delivery choices from the in-app notification history", async () => {
  const [sql, api] = await Promise.all([
    readFile(migrationPath, "utf8"),
    readFile(notificationsApiPath, "utf8"),
  ]);

  assert.match(sql, /create table if not exists public\.push_notification_preferences/);
  assert.match(sql, /new_activity_scope[\s\S]*'none'[\s\S]*'interest_only'[\s\S]*'all'/);
  assert.match(sql, /created_activity_participation_enabled boolean not null default true/);
  assert.match(sql, /joined_activity_updates_enabled boolean not null default true/);
  assert.match(sql, /service_notices_enabled boolean not null default true/);
  assert.match(sql, /push_notification_preferences_select_own/);
  assert.match(api, /DEFAULT_PUSH_NOTIFICATION_PREFERENCES/);
  assert.match(api, /getPushNotificationPreferences/);
  assert.match(api, /updatePushNotificationPreferences/);
});

test("important activity changes replace the broad legacy trigger without duplicate notifications", async () => {
  const sql = await readFile(migrationPath, "utf8");

  assert.match(sql, /create or replace function private\.notify_event_change\(\)/);
  assert.match(sql, /drop trigger if exists events_notify_participants on public\.events/);
  assert.match(sql, /new\.category_id is distinct from old\.category_id/);
  assert.match(sql, /new\.event_date is distinct from old\.event_date/);
  assert.match(sql, /new\.start_time is distinct from old\.start_time/);
  assert.match(sql, /new\.end_time is distinct from old\.end_time/);
  assert.match(sql, /new\.location_name is distinct from old\.location_name/);
  assert.match(sql, /new\.location_url is distinct from old\.location_url/);
  assert.match(sql, /new\.status = 'cancelled'/);
  assert.match(sql, /ep\.status in \('joined', 'waitlisted'\)/);
  assert.match(sql, /'event_updated'/);
  assert.match(sql, /'event_cancelled'/);
  assert.doesNotMatch(sql, /new\.title is distinct from old\.title/);
  assert.doesNotMatch(sql, /new\.description is distinct from old\.description/);
  assert.doesNotMatch(sql, /new\.capacity is distinct from old\.capacity/);
});

test("agreed notification types become push candidates without expanding unrelated direct messages", async () => {
  const source = await readFile(edgeFunctionPath, "utf8");

  for (const type of [
    "event_updated",
    "event_cancelled",
    "new_activity",
    "event_participant_joined",
    "event_participant_waitlisted",
    "event_participation_cancelled",
    "join_request_received",
    "service_notice",
  ]) {
    assert.match(source, new RegExp(`"${type}"`));
  }
  assert.doesNotMatch(source, /PUSH_TYPES[\s\S]*direct_message/);
  assert.match(source, /push_notification_preferences\?select=/);
  assert.match(source, /CREATED_ACTIVITY_TYPES\.has\(type\)/);
  assert.match(source, /JOINED_ACTIVITY_TYPES\.has\(type\)/);
  assert.match(source, /newActivityScope === "none"/);
  assert.match(source, /newActivityScope === "all"/);
  assert.match(source, /profile_interests\?select=category_id/);
});

test("important notices create in-app notifications and respect a push preference", async () => {
  const sql = await readFile(migrationPath, "utf8");

  assert.match(sql, /'service_notice'::text/);
  assert.match(sql, /new\.board_type = 'notice'/);
  assert.match(sql, /new\.status = 'published'/);
  assert.match(sql, /new\.is_important = true/);
  assert.match(sql, /'#\/notice\/' \|\| new\.id::text/);
  assert.match(sql, /from public\.profiles p[\s\S]*p\.status = 'approved'/);
});

test("my page exposes the agreed push choices while the bell keeps explicit read controls", async () => {
  const [myPage, header] = await Promise.all([
    readFile(myPagePath, "utf8"),
    readFile(headerPath, "utf8"),
  ]);

  assert.match(myPage, /받지 않음/);
  assert.match(myPage, /관심분야만/);
  assert.match(myPage, /모든 활동/);
  assert.match(myPage, /참여 현황 알림/);
  assert.match(myPage, /중요 변경 및 취소 알림/);
  assert.match(myPage, /중요 공지/);
  assert.match(header, /notification-item__read/);
  assert.match(header, /text: "읽음"/);
  assert.match(header, /stopPropagation\(\)/);
  assert.match(header, /markNotificationRead\(notification\.id\)/);

  const clickHandlerStart = header.indexOf("async function handleNotificationClick");
  const readHandlerStart = header.indexOf("async function handleNotificationRead");
  assert.notEqual(clickHandlerStart, -1);
  assert.notEqual(readHandlerStart, -1);
  assert.match(header.slice(clickHandlerStart, readHandlerStart), /markNotificationRead\(notification\.id\)/);
});
