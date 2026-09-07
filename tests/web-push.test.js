import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationPath = "supabase/site/migrations/20260907213921_add_web_push_notifications.sql";
const ownershipMigrationPath = "supabase/site/migrations/20260907213932_secure_push_subscription_ownership.sql";

test("participation RPCs create only the three owner notification types", async () => {
  const sql = await readFile(migrationPath, "utf8");
  for (const type of [
    "event_participant_joined",
    "event_participant_waitlisted",
    "event_participation_cancelled",
  ]) {
    assert.match(sql, new RegExp(`'${type}'`));
  }
  assert.match(sql, /if v_event\.created_by <> v_user_id then/g);
  assert.match(sql, /insert into public\.notifications/g);
  assert.match(sql, /raise exception '이미 참여 또는 대기 신청한 활동입니다\.'/);
});

test("push subscription table is private to its authenticated owner", async () => {
  const sql = await readFile(migrationPath, "utf8");
  assert.match(sql, /constraint push_subscriptions_endpoint_unique unique \(endpoint\)/);
  assert.match(sql, /references public\.profiles\(id\) on delete cascade/);
  assert.match(sql, /alter table public\.push_subscriptions enable row level security/);
  assert.match(sql, /revoke all on table public\.push_subscriptions from public, anon, authenticated/);
  assert.equal((sql.match(/\(select auth\.uid\(\)\) = user_id/g) ?? []).length, 5);
});

test("push service worker handles notifications without intercepting fetch", async () => {
  const source = await readFile("push-service-worker.js", "utf8");
  assert.match(source, /addEventListener\("push"/);
  assert.match(source, /addEventListener\("notificationclick"/);
  assert.match(source, /clients\.openWindow\(targetUrl\)/);
  assert.doesNotMatch(source, /addEventListener\(["']fetch["']/);
  assert.doesNotMatch(source, /caches\./);
});

test("client considers a browser subscription enabled only when the current user can read its row", async () => {
  const source = await readFile("js/web-push.js", "utf8");
  assert.match(source, /getPushNotificationState/);
  assert.match(source, /if \(!subscription\) return \{ subscription: null, owned: false \}/);
  assert.match(source, /\.select\("endpoint"\)[\s\S]*\.eq\("endpoint", subscription\.endpoint\)[\s\S]*\.maybeSingle\(\)/);
  assert.match(source, /owned: data\?\.endpoint === subscription\.endpoint/);
  const myPage = await readFile("js/pages/mypage.js", "utf8");
  assert.match(myPage, /pushState\.owned \? "푸시 알림 끄기" : "푸시 알림 받기"/);
  assert.doesNotMatch(myPage, /enablePushNotifications\(auth\.user\.id\)/);
});

test("secure RPC claims an endpoint for auth.uid without accepting a user id", async () => {
  const sql = await readFile(ownershipMigrationPath, "utf8");
  assert.match(sql, /create or replace function public\.claim_push_subscription\(\s*p_endpoint text,\s*p_p256dh text,\s*p_auth text,\s*p_user_agent text default null\s*\)/);
  assert.doesNotMatch(sql, /p_user_id/);
  assert.match(sql, /v_user_id uuid := auth\.uid\(\)/g);
  assert.match(sql, /v_user_id is null or not private\.is_approved_member\(\)/g);
  assert.match(sql, /on conflict \(endpoint\) do update[\s\S]*set user_id = v_user_id/);
  assert.equal((sql.match(/security definer/g) ?? []).length, 2);
  assert.equal((sql.match(/set search_path = ''/g) ?? []).length, 2);
  assert.match(sql, /revoke all on function public\.claim_push_subscription\(text, text, text, text\) from public, anon, authenticated/);
  assert.match(sql, /grant execute on function public\.claim_push_subscription\(text, text, text, text\) to authenticated/);
});

test("push removal is scoped to auth.uid and precedes browser unsubscribe", async () => {
  const sql = await readFile(ownershipMigrationPath, "utf8");
  assert.match(sql, /delete from public\.push_subscriptions\s*where user_id = v_user_id and endpoint = p_endpoint/);
  assert.match(sql, /revoke insert, update, delete on table public\.push_subscriptions from authenticated/);

  const source = await readFile("js/web-push.js", "utf8");
  assert.match(source, /Notification\.requestPermission\(\)/);
  assert.match(source, /pushManager\.subscribe/);
  assert.match(source, /rpc\("claim_push_subscription"/);
  assert.match(source, /rpc\("remove_own_push_subscription"/);
  assert.match(source, /if \(!removed\) return false/);
  assert.match(source, /await subscription\.unsubscribe\(\)/);
  assert.ok(source.indexOf('rpc("remove_own_push_subscription"') < source.indexOf("await subscription.unsubscribe()"));
});

test("explicit sign-out attempts push cleanup without allowing failure to block sign-out", async () => {
  const source = await readFile("js/auth.js", "utf8");
  const cleanup = source.indexOf("await disablePushNotifications()");
  const warning = source.indexOf("console.warn(", cleanup);
  const signOut = source.indexOf("await supabase.auth.signOut()", cleanup);
  assert.ok(cleanup >= 0 && warning > cleanup && signOut > warning);
});

test("edge function re-reads the notification and limits push delivery", async () => {
  const source = await readFile("supabase/functions/send-web-push/index.ts", "utf8");
  assert.match(source, /notifications\?select=id,user_id,notification_type/);
  assert.match(source, /if \(!PUSH_TYPES\.has\(notification\.notification_type\)\)/);
  assert.match(source, /statusCode === 404 \|\| statusCode === 410/);
  assert.match(source, /Promise\.allSettled/);
  assert.doesNotMatch(source, /PUSH_TYPES[\s\S]*direct_message/);
});
