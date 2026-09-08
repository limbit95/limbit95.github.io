import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationPath = "supabase/site/migrations/20260907213921_add_web_push_notifications.sql";
const ownershipMigrationPath = "supabase/site/migrations/20260907213932_secure_push_subscription_ownership.sql";

function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}

async function loadWebPush({ getSubscription, subscribe, rpc, fetch = async () => ({ ok: true, status: 204 }) }) {
  let source = await readFile("js/web-push.js", "utf8");
  source = source
    .replace(/import \{[\s\S]*?\} from "\.\/config\.js";/, `const SUPABASE_PUBLISHABLE_KEY = "key";
const SUPABASE_URL = "https://example.supabase.co";
const WEB_PUSH_VAPID_PUBLIC_KEY = "AQ";`)
    .replace('import { supabase } from "./supabaseClient.js";', "const supabase = globalThis.__webPushSupabase;");
  const subscriptionManager = { getSubscription, subscribe };
  globalThis.window = {
    localStorage: {
      getItem: () => "on",
      setItem: () => {},
    },
    PushManager: function PushManager() {},
    Notification: function Notification() {},
    matchMedia: () => ({ matches: true }),
  };
  globalThis.Notification = { permission: "granted" };
  globalThis.navigator = {
    userAgent: "test",
    serviceWorker: { register: async () => ({ pushManager: subscriptionManager }) },
  };
  globalThis.__webPushSupabase = { rpc };
  globalThis.fetch = fetch;
  return import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}#${Math.random()}`);
}

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
  assert.match(myPage, /enablePushNotifications\(auth\.user\.id\)/);
  assert.match(myPage, /disablePushNotifications\(auth\.user\.id\)/);
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

test("explicit push choices persist an account-scoped preference only after completion", async () => {
  const sql = await readFile(ownershipMigrationPath, "utf8");
  assert.match(sql, /delete from public\.push_subscriptions\s*where user_id = v_user_id and endpoint = p_endpoint/);
  assert.match(sql, /revoke insert, update, delete on table public\.push_subscriptions from authenticated/);

  const source = await readFile("js/web-push.js", "utf8");
  assert.match(source, /PUSH_PREFERENCE_PREFIX = "cheongpa:web-push-preference:"/);
  assert.match(source, /window\.localStorage\.getItem\(preferenceKey\(userId\)\)/);
  assert.match(source, /window\.localStorage\.setItem\(preferenceKey\(userId\), value\)/);
  assert.match(source, /return value === "on" \|\| value === "off" \? value : null/);
  assert.match(source, /Notification\.requestPermission\(\)/);
  assert.match(source, /pushManager\.subscribe/);
  assert.match(source, /rpc\("claim_push_subscription"/);
  assert.match(source, /rpc\("remove_own_push_subscription"/);
  assert.match(source, /await subscription\.unsubscribe\(\)/);
  const enable = source.match(/export async function enablePushNotifications[\s\S]*?\n}/)?.[0];
  const disable = source.match(/export async function disablePushNotifications[\s\S]*?\n}/)?.[0];
  assert.ok(enable.indexOf("await saveSubscription(subscription)") < enable.indexOf('setPushPreference(userId, "on")'));
  assert.ok(disable.indexOf("await subscription.unsubscribe()") < disable.indexOf('setPushPreference(userId, "off")'));
});

test("sign-out bounds push cleanup so a stalled cleanup cannot block auth sign-out", async () => {
  const source = await readFile("js/auth.js", "utf8");
  const helper = source.match(/async function cleanupPushBeforeSignOut[\s\S]*?\n}/)?.[0];
  assert.ok(helper);
  assert.match(source, /PUSH_SIGN_OUT_CLEANUP_TIMEOUT_MS = 3000/);
  assert.match(helper, /cleanupPushSubscriptionForSignOut\(userId, \{ accessToken, isActive \}\)/);
  assert.match(helper, /cleanupActive = true/);
  assert.match(helper, /Promise\.race/);
  assert.match(helper, /window\.setTimeout\(\(\) => resolve\(false\), timeoutMs\)/);
  assert.match(helper, /if \(!completed\) cleanupActive = false/);
  assert.match(helper, /\.catch\(\(error\) =>/);
  const signOut = source.match(/export async function signOut[\s\S]*?\n}/)?.[0];
  assert.ok(signOut);
  assert.match(signOut, /const accessToken = state\.session\?\.access_token \?\? null/);
  assert.match(signOut, /await waitForPushRestoreClaims\(userId\)/);
  assert.match(signOut, /await cleanupPushBeforeSignOut\(userId, accessToken\)/);
  assert.match(signOut, /Timed out cleaning up Push subscription during sign-out/);
  assert.ok(signOut.indexOf("await cleanupPushBeforeSignOut(userId, accessToken)") < signOut.indexOf("await supabase.auth.signOut()"));
});

test("sign-out cleanup preserves preference and unsubscribes even after database failure", async () => {
  const source = await readFile("js/web-push.js", "utf8");
  const cleanup = source.match(/export async function cleanupPushSubscriptionForSignOut[\s\S]*?\n}/)?.[0];
  assert.ok(cleanup);
  assert.doesNotMatch(cleanup, /setPushPreference\(userId, "off"\)/);
  assert.match(cleanup, /removalError = error/);
  assert.match(cleanup, /await subscription\.unsubscribe\(\)/);
  assert.ok(cleanup.indexOf("removalError = error") < cleanup.indexOf("await subscription.unsubscribe()"));
});

test("sign-out cleanup removes ownership with the captured account token", async () => {
  let rpcCalls = 0;
  let removals = 0;
  let unsubscribes = 0;
  const subscription = {
    endpoint: "logout-a",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => { unsubscribes += 1; },
  };
  const webPush = await loadWebPush({
    getSubscription: async () => subscription,
    subscribe: async () => subscription,
    rpc: async () => { rpcCalls += 1; return { error: null }; },
    fetch: async (_url, options) => {
      removals += 1;
      assert.equal(options.headers.Authorization, "Bearer token-a");
      assert.deepEqual(JSON.parse(options.body), { p_endpoint: "logout-a" });
      return { ok: true, status: 204 };
    },
  });

  assert.equal(await webPush.cleanupPushSubscriptionForSignOut("a", {
    accessToken: "token-a",
    isActive: () => true,
  }), true);
  assert.equal(removals, 1);
  assert.equal(rpcCalls, 0);
  assert.equal(unsubscribes, 1);
});

test("a timed-out sign-out cleanup stops before late endpoint side effects", async () => {
  const gate = deferred();
  let active = true;
  let rpcCalls = 0;
  let removals = 0;
  let unsubscribes = 0;
  const subscription = {
    endpoint: "late-a",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => { unsubscribes += 1; },
  };
  const webPush = await loadWebPush({
    getSubscription: async () => { await gate.promise; return subscription; },
    subscribe: async () => subscription,
    rpc: async () => { rpcCalls += 1; return { error: null }; },
    fetch: async () => { removals += 1; return { ok: true, status: 204 }; },
  });
  const cleanup = webPush.cleanupPushSubscriptionForSignOut("a", {
    accessToken: "token-a",
    isActive: () => active,
  });
  active = false;
  gate.resolve();

  assert.equal(await cleanup, false);
  assert.equal(removals, 0);
  assert.equal(rpcCalls, 0);
  assert.equal(unsubscribes, 0);
});

test("automatic restore is approved-only, prompt-free, idempotent, and preference-gated", async () => {
  const source = await readFile("js/web-push.js", "utf8");
  const restore = source.match(/async function restorePushNotifications\(auth, \{ isCurrent, getCurrentUserId \}\)[\s\S]*?\n}/)?.[0];
  assert.match(restore, /auth\.profile\?\.status !== "approved"/);
  assert.match(restore, /capability\.requiresIosInstall/);
  assert.match(restore, /preference !== "on"/);
  assert.match(restore, /capability\.permission !== "granted"/);
  assert.doesNotMatch(restore, /requestPermission/);
  assert.match(restore, /subscription = await currentRegistration\.pushManager\.subscribe/);
  assert.match(restore, /const claimPromise = saveSubscription\(subscription\)[\s\S]*await claimPromise/);
  assert.match(source, /restorePromises\.get\(userId\)/);
  assert.match(source, /restoredUserIds\.has\(userId\)/);
});

test("legacy ownership is the only missing-preference path promoted to on", async () => {
  const source = await readFile("js/web-push.js", "utf8");
  const restore = source.match(/async function restorePushNotifications\(auth, \{ isCurrent, getCurrentUserId \}\)[\s\S]*?\n}/)?.[0];
  assert.match(restore, /preference === null[\s\S]*getPushNotificationState\(\)/);
  assert.match(restore, /if \(!isCurrent\(\) \|\| !legacyState\.owned\) return null/);
  assert.match(restore, /setPushPreference\(userId, "on"\)/);
  assert.doesNotMatch(restore, /permission === "granted"[\s\S]*setPushPreference\(userId, "on"\)/);
});

test("restore starts after complete auth assignment without blocking auth", async () => {
  const source = await readFile("js/auth.js", "utf8");
  const permissions = source.indexOf("state.adminPermissions = new Set");
  const emit = source.indexOf("emit();", permissions);
  const restore = source.indexOf("void restorePushNotificationsForAuth(getAuthState()", emit);
  const authReturn = source.indexOf("return getAuthState();", restore);
  assert.ok(permissions >= 0 && emit > permissions && restore > emit);
  assert.ok(authReturn > restore);
  assert.doesNotMatch(source.slice(emit, authReturn), /await restorePushNotificationsForAuth/);
  assert.match(source.slice(restore, authReturn), /\.catch\(\(error\) =>/);
  assert.match(source, /Push subscription restore failed after authentication/);
  assert.match(source, /restoreEpoch === lifecycleEpoch && state\.user\?\.id === user\.id/);
  assert.match(source, /if \(event === "TOKEN_REFRESHED"\)/);
  assert.match(source, /if \(event === "SIGNED_OUT"\)/);
});

test("stale existing-subscription restore neither claims nor unsubscribes", async () => {
  const gate = deferred();
  let claims = 0;
  let unsubscribes = 0;
  let currentUserId = "a";
  let epoch = 1;
  const subscription = {
    endpoint: "existing",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => { unsubscribes += 1; },
  };
  const webPush = await loadWebPush({
    getSubscription: async () => { await gate.promise; return subscription; },
    subscribe: async () => { throw new Error("unexpected subscribe"); },
    rpc: async () => { claims += 1; return { error: null }; },
  });
  const restore = webPush.restorePushNotificationsForAuth(
    { user: { id: "a" }, profile: { status: "approved" } },
    { isCurrent: () => epoch === 1 && currentUserId === "a", getCurrentUserId: () => currentUserId },
  );
  epoch = 2;
  currentUserId = "b";
  gate.resolve();
  assert.equal(await restore, null);
  assert.equal(claims, 0);
  assert.equal(unsubscribes, 0);
});

test("a newly-created subscription is cleaned up if restore becomes stale before claim", async () => {
  const gate = deferred();
  const started = deferred();
  let claims = 0;
  let unsubscribes = 0;
  let current = true;
  const subscription = {
    endpoint: "new",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => { unsubscribes += 1; },
  };
  const webPush = await loadWebPush({
    getSubscription: async () => null,
    subscribe: async () => { started.resolve(); await gate.promise; return subscription; },
    rpc: async () => { claims += 1; return { error: null }; },
  });
  const restore = webPush.restorePushNotificationsForAuth(
    { user: { id: "a" }, profile: { status: "approved" } },
    { isCurrent: () => current, getCurrentUserId: () => current ? "a" : null },
  );
  await started.promise;
  current = false;
  gate.resolve();
  assert.equal(await restore, null);
  assert.equal(claims, 0);
  assert.equal(unsubscribes, 1);
});

test("a stale same-user promise does not suppress restore after relogin", async () => {
  const firstGate = deferred();
  const firstStarted = deferred();
  let generation = 1;
  let calls = 0;
  let claims = 0;
  const subscription = { endpoint: "endpoint", toJSON: () => ({ keys: {} }), unsubscribe: async () => {} };
  const webPush = await loadWebPush({
    getSubscription: async () => {
      calls += 1;
      if (calls === 1) {
        firstStarted.resolve();
        await firstGate.promise;
      }
      return subscription;
    },
    subscribe: async () => subscription,
    rpc: async () => { claims += 1; return { error: null }; },
  });
  const auth = { user: { id: "a" }, profile: { status: "approved" } };
  const staleRestore = webPush.restorePushNotificationsForAuth(auth, { isCurrent: () => generation === 1 });
  await firstStarted.promise;
  generation = 2;
  const currentRestore = webPush.restorePushNotificationsForAuth(auth, { isCurrent: () => generation === 2 });
  await currentRestore;
  firstGate.resolve();
  await staleRestore;
  assert.equal(claims, 1);
});

test("a newly-created subscription claimed in flight is compensated after logout", async () => {
  const claimGate = deferred();
  const claimStarted = deferred();
  let currentUserId = "a";
  let current = true;
  let removals = 0;
  let unsubscribes = 0;
  const subscription = {
    endpoint: "new-a",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => { unsubscribes += 1; },
  };
  const webPush = await loadWebPush({
    getSubscription: async () => null,
    subscribe: async () => subscription,
    rpc: async (name) => {
      assert.equal(name, "claim_push_subscription");
      claimStarted.resolve();
      await claimGate.promise;
      return { error: null };
    },
    fetch: async (_url, options) => {
      removals += 1;
      assert.equal(options.headers.Authorization, "Bearer token-a");
      assert.deepEqual(JSON.parse(options.body), { p_endpoint: "new-a" });
      return { ok: true, status: 204 };
    },
  });
  const auth = { session: { access_token: "token-a" }, user: { id: "a" }, profile: { status: "approved" } };
  const restore = webPush.restorePushNotificationsForAuth(auth, {
    isCurrent: () => current,
    getCurrentUserId: () => currentUserId,
  });
  await claimStarted.promise;
  current = false;
  currentUserId = null;
  let coordinationFinished = false;
  const coordination = webPush.waitForPushRestoreClaims("a", 1000).then((completed) => {
    coordinationFinished = true;
    return completed;
  });
  await Promise.resolve();
  assert.equal(coordinationFinished, false);
  claimGate.resolve();

  assert.equal(await coordination, true);
  assert.equal(await restore, null);
  assert.equal(removals, 1);
  assert.equal(unsubscribes, 1);
});

test("a stale in-flight claim uses A credentials without disturbing B subscription", async () => {
  const claimGate = deferred();
  const claimStarted = deferred();
  let currentUserId = "a";
  let current = true;
  let removals = 0;
  let unsubscribes = 0;
  const subscription = {
    endpoint: "shared",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => { unsubscribes += 1; },
  };
  const webPush = await loadWebPush({
    getSubscription: async () => subscription,
    subscribe: async () => { throw new Error("unexpected subscribe"); },
    rpc: async () => { claimStarted.resolve(); await claimGate.promise; return { error: null }; },
    fetch: async (_url, options) => {
      removals += 1;
      assert.equal(options.headers.Authorization, "Bearer token-a");
      return { ok: true, status: 204 };
    },
  });
  const restore = webPush.restorePushNotificationsForAuth(
    { session: { access_token: "token-a" }, user: { id: "a" }, profile: { status: "approved" } },
    { isCurrent: () => current, getCurrentUserId: () => currentUserId },
  );
  await claimStarted.promise;
  current = false;
  currentUserId = "b";
  claimGate.resolve();

  assert.equal(await restore, null);
  assert.equal(removals, 1);
  assert.equal(unsubscribes, 0);
});

test("A can restore again after an in-flight stale claim is compensated", async () => {
  const firstClaimGate = deferred();
  const firstClaimStarted = deferred();
  let generation = 1;
  let claims = 0;
  let removals = 0;
  const subscription = { endpoint: "a", toJSON: () => ({ keys: {} }), unsubscribe: async () => {} };
  const webPush = await loadWebPush({
    getSubscription: async () => subscription,
    subscribe: async () => subscription,
    rpc: async () => {
      claims += 1;
      if (claims === 1) {
        firstClaimStarted.resolve();
        await firstClaimGate.promise;
      }
      return { error: null };
    },
    fetch: async () => { removals += 1; return { ok: true, status: 204 }; },
  });
  const auth = { session: { access_token: "token-a" }, user: { id: "a" }, profile: { status: "approved" } };
  const staleRestore = webPush.restorePushNotificationsForAuth(auth, { isCurrent: () => generation === 1 });
  await firstClaimStarted.promise;
  generation = 2;
  firstClaimGate.resolve();
  assert.equal(await staleRestore, null);

  const currentRestore = webPush.restorePushNotificationsForAuth(auth, { isCurrent: () => generation === 2 });
  assert.equal(await currentRestore, subscription);
  assert.equal(claims, 2);
  assert.equal(removals, 1);
});

test("edge function re-reads the notification and limits push delivery", async () => {
  const source = await readFile("supabase/functions/send-web-push/index.ts", "utf8");
  assert.match(source, /notifications\?select=id,user_id,notification_type/);
  assert.match(source, /if \(!PUSH_TYPES\.has\(notification\.notification_type\)\)/);
  assert.match(source, /statusCode === 404 \|\| statusCode === 410/);
  assert.match(source, /Promise\.allSettled/);
  assert.doesNotMatch(source, /PUSH_TYPES[\s\S]*direct_message/);
});
