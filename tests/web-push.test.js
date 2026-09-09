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

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
async function eventually(assertion, timeoutMs = 500) {
  const deadline = Date.now() + timeoutMs;
  while (true) {
    try { assertion(); return; } catch (error) {
      if (Date.now() >= deadline) throw error;
      await delay(5);
    }
  }
}

function section(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  assert.ok(start >= 0, `Missing source marker: ${startMarker}`);
  const end = endMarker ? source.indexOf(endMarker, start) : source.length;
  assert.ok(!endMarker || end > start, `Missing source marker: ${endMarker}`);
  return source.slice(start, end);
}

function defineGlobal(name, value) {
  Object.defineProperty(globalThis, name, {
    value,
    configurable: true,
    writable: true,
  });
}

async function loadWebPush({
  getSubscription,
  subscribe,
  rpc,
  fetch = async () => ({ ok: true, status: 204 }),
  preference = "on",
  storage = null,
  from = () => ({
    select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }) }),
  }),
  permission = "granted",
  requestPermission = null,
  mutationTimeoutMs = 30,
  retryBaseMs = 1,
}) {
  let source = await readFile("js/web-push.js", "utf8");
  source = source
    .replace(/import \{[\s\S]*?\} from "\.\/config\.js";/, `const SUPABASE_PUBLISHABLE_KEY = "key";
const SUPABASE_URL = "https://example.supabase.co";
const WEB_PUSH_VAPID_PUBLIC_KEY = "AQ";`)
    .replace('import { supabase } from "./supabaseClient.js";', "const supabase = globalThis.__webPushSupabase;");

  const subscriptionManager = { getSubscription, subscribe };
  defineGlobal("window", {
    localStorage: {
      getItem: (key) => storage ? storage.get(key) ?? null : preference,
      setItem: (key, value) => storage?.set(key, value),
    },
    PushManager: function PushManager() {},
    Notification: function Notification() {},
    matchMedia: () => ({ matches: true }),
  });
  const notification = { permission };
  notification.requestPermission = requestPermission ?? (async () => notification.permission);
  defineGlobal("Notification", notification);
  defineGlobal("navigator", {
    userAgent: "test",
    serviceWorker: { register: async () => ({ pushManager: subscriptionManager }) },
  });
  defineGlobal("__webPushSupabase", { rpc, from });
  defineGlobal("fetch", fetch);
  defineGlobal("__WEB_PUSH_MUTATION_TIMEOUT_MS", mutationTimeoutMs);
  defineGlobal("__WEB_PUSH_RECONCILE_RETRY_BASE_MS", retryBaseMs);

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

test("client enabled state requires current-user endpoint ownership", async () => {
  const source = await readFile("js/web-push.js", "utf8");
  assert.match(source, /if \(!subscription\) return \{ subscription: null, owned: false \}/);
  assert.match(source, /\.select\("endpoint"\)[\s\S]*\.eq\("endpoint", subscription\.endpoint\)[\s\S]*\.maybeSingle\(\)/);
  assert.match(source, /owned: data\?\.endpoint === subscription\.endpoint/);

  const myPage = await readFile("js/pages/mypage.js", "utf8");
  assert.match(myPage, /pushState\.owned \? "푸시 알림 끄기" : "푸시 알림 받기"/);
  assert.match(myPage, /enablePushNotifications\(auth\.user\.id\)/);
  assert.match(myPage, /disablePushNotifications\(auth\.user\.id\)/);
});

test("secure push RPCs are scoped to auth.uid", async () => {
  const sql = await readFile(ownershipMigrationPath, "utf8");
  assert.match(sql, /create or replace function public\.claim_push_subscription\(\s*p_endpoint text,\s*p_p256dh text,\s*p_auth text,\s*p_user_agent text default null\s*\)/);
  assert.doesNotMatch(sql, /p_user_id/);
  assert.match(sql, /v_user_id uuid := auth\.uid\(\)/g);
  assert.match(sql, /delete from public\.push_subscriptions\s*where user_id = v_user_id and endpoint = p_endpoint/);
  assert.match(sql, /revoke insert, update, delete on table public\.push_subscriptions from authenticated/);
  assert.match(sql, /grant execute on function public\.claim_push_subscription\(text, text, text, text\) to authenticated/);
});

test("explicit push choices persist preference only after successful subscription work", async () => {
  const source = await readFile("js/web-push.js", "utf8");
  assert.match(source, /PUSH_PREFERENCE_PREFIX = "cheongpa:web-push-preference:"/);
  const enable = section(
    source,
    "export async function enablePushNotifications",
    "\nexport async function disablePushNotifications",
  );
  const disable = section(
    source,
    "export async function disablePushNotifications",
    "\nexport async function cleanupPushSubscriptionForSignOut",
  );
  assert.ok(enable.indexOf("await saveSubscription(subscription)") < enable.indexOf('setPushPreference(userId, "on")'));
  assert.ok(disable.indexOf("await subscription.unsubscribe()") < disable.indexOf('setPushPreference(userId, "off")'));
});

test("sign-out bounds push work before calling Supabase sign-out", async () => {
  const source = await readFile("js/auth.js", "utf8");
  const helper = section(source, "async function cleanupPushBeforeSignOut", "\nexport async function signOut");
  const signOut = section(source, "export async function signOut", "\nexport function canManageCategory");
  assert.match(source, /PUSH_SIGN_OUT_CLEANUP_TIMEOUT_MS = 3000/);
  assert.match(helper, /Promise\.race/);
  assert.match(helper, /window\.setTimeout\(\(\) => resolve\(false\), timeoutMs\)/);
  assert.match(helper, /if \(!completed\) cleanupActive = false/);
  assert.match(signOut, /await waitForPushRestoreClaims\(userId\)/);
  assert.match(signOut, /await cleanupPushBeforeSignOut\(userId, accessToken\)/);
  assert.ok(signOut.indexOf("await cleanupPushBeforeSignOut(userId, accessToken)") < signOut.indexOf("await supabase.auth.signOut()"));
});

test("sign-out cleanup preserves preference and still attempts browser unsubscribe after removal failure", async () => {
  const source = await readFile("js/web-push.js", "utf8");
  const cleanup = section(
    source,
    "export async function cleanupPushSubscriptionForSignOut",
    "\nasync function restorePushNotifications",
  );
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

test("timed-out sign-out cleanup stops before late endpoint side effects", async () => {
  const gate = deferred();
  let active = true;
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
    rpc: async () => ({ error: null }),
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
  assert.equal(unsubscribes, 0);
});

test("automatic restore is approved-only, prompt-free, and preference-gated", async () => {
  const source = await readFile("js/web-push.js", "utf8");
  const restore = section(
    source,
    "async function restorePushNotifications(auth, { isCurrent, getCurrentUserId })",
    "\nexport function restorePushNotificationsForAuth",
  );
  assert.match(restore, /auth\.profile\?\.status !== "approved"/);
  assert.match(restore, /capability\.requiresIosInstall/);
  assert.match(restore, /capability\.permission !== "granted"/);
  assert.match(restore, /preference !== "on"/);
  assert.doesNotMatch(restore, /requestPermission/);
  assert.match(restore, /claimSubscription\(userId, desired\.contextVersion, subscription\)/);
});

test("legacy ownership is the only missing-preference path promoted to on", async () => {
  const source = await readFile("js/web-push.js", "utf8");
  const restore = section(
    source,
    "async function restorePushNotifications(auth, { isCurrent, getCurrentUserId })",
    "\nexport function restorePushNotificationsForAuth",
  );
  assert.match(restore, /preference === null[\s\S]*getPushNotificationState\(\)/);
  assert.match(restore, /desiredPushState\.revision !== requestRevision/);
  assert.match(restore, /if \(!legacyState\.owned\)/);
  assert.match(restore, /preference = "on"/);
});

test("restore starts after auth assignment without blocking authentication", async () => {
  const source = await readFile("js/auth.js", "utf8");
  const permissions = source.indexOf("state.adminPermissions = new Set");
  const emit = source.indexOf("emit();", permissions);
  const restore = source.indexOf("void restorePushNotificationsForAuth(getAuthState()", emit);
  const authReturn = source.indexOf("return getAuthState();", restore);
  assert.ok(permissions >= 0 && emit > permissions && restore > emit && authReturn > restore);
  assert.doesNotMatch(source.slice(emit, authReturn), /await restorePushNotificationsForAuth/);
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

test("device coordinator serializes restore/OFF/ON and latest intent wins", async () => {
  for (const finalIntent of ["off", "on"]) {
    const claimGate = deferred();
    const claimStarted = deferred();
    const storage = new Map([["cheongpa:web-push-preference:a", "on"]]);
    let subscriptionExists = true;
    let owner = null;
    let activeMutations = 0;
    let maximumMutations = 0;
    const subscription = {
      endpoint: "shared",
      toJSON: () => ({ keys: {} }),
      unsubscribe: async () => { subscriptionExists = false; },
    };
    let claims = 0;
    const webPush = await loadWebPush({
      storage,
      getSubscription: async () => subscriptionExists ? subscription : null,
      subscribe: async () => { subscriptionExists = true; return subscription; },
      rpc: async (name) => {
        activeMutations += 1;
        maximumMutations = Math.max(maximumMutations, activeMutations);
        if (name === "claim_push_subscription") {
          claims += 1;
          if (claims === 1) { claimStarted.resolve(); await claimGate.promise; }
          owner = "a";
        } else owner = null;
        activeMutations -= 1;
        return { error: null };
      },
    });
    const auth = { user: { id: "a" }, profile: { status: "approved" } };
    const restore = webPush.restorePushNotificationsForAuth(auth);
    await claimStarted.promise;
    const off = webPush.disablePushNotifications("a");
    const on = finalIntent === "on" ? webPush.enablePushNotifications("a") : null;
    claimGate.resolve();
    await Promise.all([restore, off, on]);

    assert.equal(storage.get("cheongpa:web-push-preference:a"), finalIntent);
    assert.equal(subscriptionExists, finalIntent === "on");
    assert.equal(owner, finalIntent === "on" ? "a" : null);
    assert.equal(maximumMutations, 1);
  }
});

test("pending OFF cleanup cannot erase a newer explicit ON", async () => {
  const removeGate = deferred();
  const removeStarted = deferred();
  const storage = new Map([["cheongpa:web-push-preference:a", "on"]]);
  let owner = "a";
  let subscriptionExists = true;
  const subscription = {
    endpoint: "shared",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => { subscriptionExists = false; },
  };
  const webPush = await loadWebPush({
    storage,
    getSubscription: async () => subscriptionExists ? subscription : null,
    subscribe: async () => { subscriptionExists = true; return subscription; },
    rpc: async (name) => {
      if (name === "remove_own_push_subscription") {
        removeStarted.resolve(); await removeGate.promise; owner = null;
      } else owner = "a";
      return { error: null };
    },
  });
  const off = webPush.disablePushNotifications("a");
  await removeStarted.promise;
  const on = webPush.enablePushNotifications("a");
  removeGate.resolve();
  await Promise.all([off, on]);

  assert.equal(storage.get("cheongpa:web-push-preference:a"), "on");
  assert.equal(subscriptionExists, true);
  assert.equal(owner, "a");
});

test("account switching and logout cleanup converge on the current account", async () => {
  const gate = deferred();
  const started = deferred();
  const storage = new Map([
    ["cheongpa:web-push-preference:a", "on"],
    ["cheongpa:web-push-preference:b", "on"],
  ]);
  let currentUser = "a";
  let owner = null;
  let subscriptionExists = true;
  let claims = 0;
  const subscription = { endpoint: "shared", toJSON: () => ({ keys: {} }), unsubscribe: async () => { subscriptionExists = false; } };
  const webPush = await loadWebPush({
    storage,
    getSubscription: async () => subscriptionExists ? subscription : null,
    subscribe: async () => { subscriptionExists = true; return subscription; },
    rpc: async (name) => {
      if (name === "claim_push_subscription") {
        const claimUser = currentUser;
        claims += 1;
        if (claims === 1) { started.resolve(); await gate.promise; }
        owner = claimUser;
      } else owner = null;
      return { error: null };
    },
  });
  const restoreA = webPush.restorePushNotificationsForAuth(
    { user: { id: "a" }, profile: { status: "approved" } },
    { isCurrent: () => currentUser === "a", getCurrentUserId: () => currentUser },
  );
  await started.promise;
  currentUser = "b";
  const restoreB = webPush.restorePushNotificationsForAuth(
    { user: { id: "b" }, profile: { status: "approved" } },
    { isCurrent: () => currentUser === "b", getCurrentUserId: () => currentUser },
  );
  gate.resolve();
  await Promise.all([restoreA, restoreB]);
  assert.equal(owner, "b");
  assert.equal(subscriptionExists, true);
  assert.equal(storage.get("cheongpa:web-push-preference:b"), "on");
});

test("auth lifecycle makes OFF and ineligible account switches authoritative after a late claim", async () => {
  for (const nextAuth of [
    { user: { id: "b" }, profile: { status: "approved" } },
    { user: { id: "b" }, profile: { status: "pending" } },
    null,
  ]) {
    const claimGate = deferred();
    const claimStarted = deferred();
    const storage = new Map([
      ["cheongpa:web-push-preference:a", "on"],
      ["cheongpa:web-push-preference:b", "off"],
    ]);
    let currentUser = "a";
    let owner = null;
    let subscriptionExists = true;
    const subscription = { endpoint: "shared", toJSON: () => ({ keys: {} }), unsubscribe: async () => { subscriptionExists = false; } };
    const webPush = await loadWebPush({
      storage,
      getSubscription: async () => subscriptionExists ? subscription : null,
      subscribe: async () => { subscriptionExists = true; return subscription; },
      rpc: async (name) => {
        if (name === "claim_push_subscription") { claimStarted.resolve(); await claimGate.promise; owner = "a"; }
        else owner = null;
        return { error: null };
      },
      fetch: async () => { owner = null; return { ok: true, status: 204 }; },
    });
    const oldRestore = webPush.restorePushNotificationsForAuth(
      { user: { id: "a" }, profile: { status: "approved" } },
      { isCurrent: () => currentUser === "a" },
    ).catch(() => null);
    await claimStarted.promise;
    currentUser = nextAuth?.user?.id ?? null;
    webPush.setPushDesiredAuthContext(nextAuth, { previousAccessToken: "token-a" });
    await delay(45);
    claimGate.resolve();
    await oldRestore;
    await eventually(() => {
      assert.equal(owner, null);
      assert.equal(subscriptionExists, false);
    });
    assert.equal(storage.get("cheongpa:web-push-preference:a"), "on");
    if (nextAuth) assert.equal(storage.get("cheongpa:web-push-preference:b"), "off");
  }
});

test("a hanging restore lease cannot permanently block later OFF or ON intents", async () => {
  for (const finalIntent of ["off", "on"]) {
    const started = deferred();
    const storage = new Map([["cheongpa:web-push-preference:a", "on"]]);
    let owner = null;
    let subscriptionExists = true;
    let claims = 0;
    const subscription = { endpoint: "hang", toJSON: () => ({ keys: {} }), unsubscribe: async () => { subscriptionExists = false; } };
    const webPush = await loadWebPush({ storage,
      getSubscription: async () => subscriptionExists ? subscription : null,
      subscribe: async () => { subscriptionExists = true; return subscription; },
      rpc: async (name) => {
        if (name === "claim_push_subscription" && ++claims === 1) { started.resolve(); return new Promise(() => {}); }
        owner = name === "claim_push_subscription" ? "a" : null;
        return { error: null };
      },
    });
    void webPush.restorePushNotificationsForAuth({ user: { id: "a" }, profile: { status: "approved" } }).catch(() => {});
    await started.promise;
    if (finalIntent === "off") await webPush.disablePushNotifications("a");
    else await webPush.enablePushNotifications("a");
    assert.equal(storage.get("cheongpa:web-push-preference:a"), finalIntent);
    assert.equal(subscriptionExists, finalIntent === "on");
    assert.equal(owner, finalIntent === "on" ? "a" : null);
  }
});

test("late timed-out remove and unsubscribe are repaired from the latest ON intent", async () => {
  for (const hangingStep of ["remove", "unsubscribe"]) {
    const gate = deferred();
    const started = deferred();
    const storage = new Map([["cheongpa:web-push-preference:a", "on"]]);
    let owner = "a";
    let subscriptionExists = true;
    const makeSubscription = () => ({ endpoint: "late", toJSON: () => ({ keys: {} }), unsubscribe: async () => {
      if (hangingStep === "unsubscribe") { started.resolve(); await gate.promise; }
      subscriptionExists = false;
    } });
    const webPush = await loadWebPush({ storage,
      getSubscription: async () => subscriptionExists ? makeSubscription() : null,
      subscribe: async () => { subscriptionExists = true; return makeSubscription(); },
      rpc: async (name) => {
        if (name === "remove_own_push_subscription") {
          if (hangingStep === "remove") { started.resolve(); await gate.promise; }
          owner = null;
        } else owner = "a";
        return { error: null };
      },
    });
    void webPush.disablePushNotifications("a").catch(() => {});
    await started.promise;
    await delay(40);
    await webPush.enablePushNotifications("a");
    gate.resolve();
    await eventually(() => {
      assert.equal(owner, "a");
      assert.equal(subscriptionExists, true);
    });
    assert.equal(storage.get("cheongpa:web-push-preference:a"), "on");
  }
});

test("legacy lookup cannot override explicit OFF or OFF then ON", async () => {
  for (const finalIntent of ["off", "on"]) {
    const lookupGate = deferred();
    const lookupStarted = deferred();
    const storage = new Map();
    let owner = "a";
    let subscriptionExists = true;
    const subscription = { endpoint: "legacy", toJSON: () => ({ keys: {} }), unsubscribe: async () => { subscriptionExists = false; } };
    const webPush = await loadWebPush({
      storage,
      preference: null,
      getSubscription: async () => subscriptionExists ? subscription : null,
      subscribe: async () => { subscriptionExists = true; return subscription; },
      from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => {
        lookupStarted.resolve(); await lookupGate.promise; return { data: { endpoint: "legacy" }, error: null };
      } }) }) }),
      rpc: async (name) => { owner = name === "claim_push_subscription" ? "a" : null; return { error: null }; },
    });
    const restore = webPush.restorePushNotificationsForAuth({ user: { id: "a" }, profile: { status: "approved" } });
    await lookupStarted.promise;
    const off = webPush.disablePushNotifications("a");
    const on = finalIntent === "on" ? webPush.enablePushNotifications("a") : null;
    lookupGate.resolve();
    await Promise.all([restore, off, on]);
    assert.equal(storage.get("cheongpa:web-push-preference:a"), finalIntent);
    assert.equal(subscriptionExists, finalIntent === "on");
    assert.equal(owner, finalIntent === "on" ? "a" : null);
  }
});

test("failed explicit mutations do not commit successful preferences", async () => {
  const onStorage = new Map();
  const subscription = { endpoint: "failure", toJSON: () => ({ keys: {} }), unsubscribe: async () => true };
  const on = await loadWebPush({ storage: onStorage, preference: null, getSubscription: async () => subscription, subscribe: async () => subscription,
    rpc: async () => ({ error: new Error("claim failed") }) });
  await assert.rejects(on.enablePushNotifications("a"), /claim failed/);
  assert.equal(onStorage.has("cheongpa:web-push-preference:a"), false);

  const offStorage = new Map([["cheongpa:web-push-preference:a", "on"]]);
  const off = await loadWebPush({ storage: offStorage, getSubscription: async () => subscription, subscribe: async () => subscription,
    rpc: async () => ({ error: new Error("remove failed") }) });
  await assert.rejects(off.disablePushNotifications("a"), /remove failed/);
  assert.equal(offStorage.get("cheongpa:web-push-preference:a"), "on");
  await delay(20); // allow the bounded reconciliation budgets to drain
});

test("legacy null auth publication waits for ownership before choosing ON or OFF", async () => {
  for (const owned of [true, false]) {
    const lookupGate = deferred();
    const lookupStarted = deferred();
    const storage = new Map();
    let owner = owned ? "a" : null;
    let subscriptionExists = true;
    let removals = 0;
    const subscription = { endpoint: "legacy-auth", toJSON: () => ({ keys: {} }), unsubscribe: async () => { subscriptionExists = false; } };
    const webPush = await loadWebPush({ storage, preference: null,
      getSubscription: async () => subscriptionExists ? subscription : null,
      subscribe: async () => subscription,
      from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => {
        lookupStarted.resolve(); await lookupGate.promise;
        return { data: owned ? { endpoint: "legacy-auth" } : null, error: null };
      } }) }) }),
      rpc: async (name) => {
        if (name === "remove_own_push_subscription") { removals += 1; owner = null; }
        else owner = "a";
        return { error: null };
      },
    });
    const auth = { user: { id: "a" }, profile: { status: "approved" } };
    webPush.setPushDesiredAuthContext(auth);
    const restore = webPush.restorePushNotificationsForAuth(auth);
    await lookupStarted.promise;
    await delay(10);
    assert.equal(removals, 0, "unknown preference must not trigger destructive OFF");
    lookupGate.resolve();
    await restore;
    await delay(10);
    assert.equal(storage.get("cheongpa:web-push-preference:a") ?? null, owned ? "on" : null);
    assert.equal(subscriptionExists, owned);
    assert.equal(owner, owned ? "a" : null);
    assert.equal(webPush.getPushCoordinatorSnapshot().explicitIntent, null);
  }
});

test("same-user auth refresh cannot replace a pending explicit choice", async () => {
  for (const intent of ["off", "on"]) {
    const gate = deferred();
    const started = deferred();
    const storage = new Map([["cheongpa:web-push-preference:a", intent === "off" ? "on" : "off"]]);
    let owner = intent === "off" ? "a" : null;
    let subscriptionExists = true;
    const subscription = { endpoint: "refresh", toJSON: () => ({ keys: {} }), unsubscribe: async () => { subscriptionExists = false; } };
    const webPush = await loadWebPush({ storage,
      getSubscription: async () => subscriptionExists ? subscription : null,
      subscribe: async () => { subscriptionExists = true; return subscription; },
      rpc: async (name) => {
        started.resolve(); await gate.promise;
        owner = name === "claim_push_subscription" ? "a" : null;
        return { error: null };
      },
    });
    const auth = { user: { id: "a" }, profile: { status: "approved" } };
    webPush.setPushAuthContextVersion("a", 1);
    webPush.setPushDesiredAuthContext(auth);
    const mutation = intent === "off" ? webPush.disablePushNotifications("a") : webPush.enablePushNotifications("a");
    await started.promise;
    webPush.setPushDesiredAuthContext(auth);
    assert.equal(webPush.getPushCoordinatorSnapshot().explicitIntent.preference, intent);
    gate.resolve();
    await mutation;
    assert.equal(storage.get("cheongpa:web-push-preference:a"), intent);
    assert.equal(owner, intent === "on" ? "a" : null);
    assert.equal(subscriptionExists, intent === "on");
  }
});

test("permission grant refreshes eligibility before explicit ON is resolved", async () => {
  const storage = new Map();
  let subscription = null;
  let owner = null;
  const created = {
    endpoint: "permission-grant",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => { subscription = null; },
  };
  const webPush = await loadWebPush({
    storage,
    permission: "default",
    requestPermission: async () => {
      Notification.permission = "granted";
      return "granted";
    },
    getSubscription: async () => subscription,
    subscribe: async () => { subscription = created; return created; },
    rpc: async (name) => {
      owner = name === "claim_push_subscription" ? "a" : null;
      return { error: null };
    },
  });
  webPush.setPushDesiredAuthContext({ user: { id: "a" }, profile: { status: "approved" } });
  const offRevision = webPush.getPushCoordinatorSnapshot().desiredState.revision;

  assert.equal(await webPush.enablePushNotifications("a"), created);
  await eventually(() => assert.equal(owner, "a"));
  const snapshot = webPush.getPushCoordinatorSnapshot();
  assert.equal(snapshot.authContext.eligible, true);
  assert.equal(snapshot.desiredState.preference, "on");
  assert.ok(snapshot.desiredState.revision > offRevision);
  assert.equal(storage.get("cheongpa:web-push-preference:a"), "on");
  assert.equal(subscription, created);
  assert.equal(snapshot.explicitIntent, null);
});

test("a timed-out explicit claim keeps old-account cleanup until its late settlement", async () => {
  const claimGate = deferred();
  const claimStarted = deferred();
  const storage = new Map([
    ["cheongpa:web-push-preference:a", "on"],
    ["cheongpa:web-push-preference:b", "off"],
  ]);
  let owner = null;
  let subscriptionExists = true;
  const subscription = {
    endpoint: "explicit-late-claim",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => { subscriptionExists = false; },
  };
  const webPush = await loadWebPush({
    storage,
    getSubscription: async () => subscriptionExists ? subscription : null,
    subscribe: async () => subscription,
    rpc: async (name) => {
      if (name === "claim_push_subscription") {
        claimStarted.resolve();
        await claimGate.promise;
        owner = "a";
      } else owner = null;
      return { error: null };
    },
    fetch: async () => { owner = null; return { ok: true, status: 204 }; },
  });
  webPush.setPushDesiredAuthContext({ user: { id: "a" }, profile: { status: "approved" } });
  const enabling = webPush.enablePushNotifications("a");
  await claimStarted.promise;
  await assert.rejects(enabling, /timed out/);
  webPush.setPushDesiredAuthContext(
    { user: { id: "b" }, profile: { status: "approved" } },
    { previousAccessToken: "token-a" },
  );
  assert.deepEqual(webPush.getPushCoordinatorSnapshot().pendingCleanupUserIds, ["a"]);
  assert.equal(webPush.getPushCoordinatorSnapshot().inFlightOwnershipClaims.length, 1);

  claimGate.resolve();
  await eventually(() => {
    const snapshot = webPush.getPushCoordinatorSnapshot();
    assert.equal(owner, null);
    assert.deepEqual(snapshot.pendingCleanupUserIds, []);
    assert.deepEqual(snapshot.inFlightOwnershipClaims, []);
    assert.equal(snapshot.desiredState.userId, "b");
    assert.equal(snapshot.desiredState.preference, "off");
    assert.equal(subscriptionExists, false);
  });
});

test("previous-account cleanup retries immediate REST failure with bounded backoff", async () => {
  const storage = new Map([
    ["cheongpa:web-push-preference:a", "on"],
    ["cheongpa:web-push-preference:b", "off"],
  ]);
  let attempts = 0;
  let owner = "a";
  let subscriptionExists = true;
  const subscription = {
    endpoint: "cleanup-retry",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => { subscriptionExists = false; },
  };
  const webPush = await loadWebPush({
    storage,
    getSubscription: async () => subscriptionExists ? subscription : null,
    subscribe: async () => subscription,
    rpc: async () => ({ error: null }),
    fetch: async () => {
      attempts += 1;
      if (attempts === 1) return { ok: false, status: 503 };
      owner = null;
      return { ok: true, status: 204 };
    },
  });
  webPush.setPushDesiredAuthContext({ user: { id: "a" }, profile: { status: "approved" } });
  webPush.setPushDesiredAuthContext(
    { user: { id: "b" }, profile: { status: "approved" } },
    { previousAccessToken: "token-a" },
  );

  await eventually(() => {
    assert.equal(attempts, 2);
    assert.equal(owner, null);
    assert.equal(subscriptionExists, false, "safe browser cleanup must continue after DB failure");
    assert.deepEqual(webPush.getPushCoordinatorSnapshot().pendingCleanupUserIds, []);
  });
  assert.ok(webPush.getPushCoordinatorSnapshot().reconcileRetryCount <= 2);
});

test("exhausted cleanup keeps its obligation and a new revision gets a fresh retry budget", async () => {
  const storage = new Map([
    ["cheongpa:web-push-preference:a", "on"],
    ["cheongpa:web-push-preference:b", "off"],
  ]);
  let attempts = 0;
  const subscription = {
    endpoint: "cleanup-exhausted",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => true,
  };
  const webPush = await loadWebPush({
    storage,
    getSubscription: async () => subscription,
    subscribe: async () => subscription,
    rpc: async () => ({ error: null }),
    fetch: async () => { attempts += 1; return { ok: false, status: 503 }; },
  });
  webPush.setPushDesiredAuthContext({ user: { id: "a" }, profile: { status: "approved" } });
  webPush.setPushDesiredAuthContext(
    { user: { id: "b" }, profile: { status: "approved" } },
    { previousAccessToken: "token-a" },
  );
  await eventually(() => {
    assert.equal(webPush.getPushCoordinatorSnapshot().reconcileRetryCount, 2);
    assert.equal(attempts, 3);
  });
  const exhaustedAttempts = attempts;
  await delay(20);
  assert.equal(attempts, exhaustedAttempts, "exhausted revision must not spin");
  assert.deepEqual(webPush.getPushCoordinatorSnapshot().pendingCleanupUserIds, ["a"]);

  webPush.setPushAuthContextVersion("b", 2);
  webPush.setPushDesiredAuthContext({ user: { id: "b" }, profile: { status: "approved" } });
  await eventually(() => {
    assert.equal(webPush.getPushCoordinatorSnapshot().reconcileRetryCount, 2);
    assert.equal(attempts, exhaustedAttempts + 3);
  });
  assert.ok(attempts > exhaustedAttempts, "new authority revision must receive a fresh budget");
  assert.deepEqual(webPush.getPushCoordinatorSnapshot().pendingCleanupUserIds, ["a"]);
});

test("an immediate unsubscribe failure is retried to OFF convergence", async () => {
  const storage = new Map([["cheongpa:web-push-preference:a", "off"]]);
  let subscriptionExists = true;
  let unsubscribes = 0;
  const subscription = {
    endpoint: "unsubscribe-retry",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => {
      unsubscribes += 1;
      if (unsubscribes === 1) throw new Error("unsubscribe failed");
      subscriptionExists = false;
    },
  };
  const webPush = await loadWebPush({
    storage,
    getSubscription: async () => subscriptionExists ? subscription : null,
    subscribe: async () => subscription,
    rpc: async () => ({ error: null }),
  });
  webPush.setPushDesiredAuthContext({ user: { id: "a" }, profile: { status: "approved" } });
  await eventually(() => {
    assert.equal(unsubscribes, 2);
    assert.equal(subscriptionExists, false);
    assert.equal(webPush.getPushCoordinatorSnapshot().desiredState.preference, "off");
  });
});

test("an auth refresh preserves old-account cleanup until a late claim is repaired", async () => {
  const claimGate = deferred();
  const claimStarted = deferred();
  const storage = new Map([["cheongpa:web-push-preference:a", "on"], ["cheongpa:web-push-preference:b", "off"]]);
  let owner = null;
  const subscription = { endpoint: "cleanup", toJSON: () => ({ keys: {} }), unsubscribe: async () => true };
  const webPush = await loadWebPush({ storage, getSubscription: async () => subscription, subscribe: async () => subscription,
    rpc: async (name) => {
      if (name === "claim_push_subscription") { claimStarted.resolve(); await claimGate.promise; owner = "a"; }
      else owner = null;
      return { error: null };
    },
    fetch: async () => { owner = null; return { ok: true, status: 204 }; },
  });
  webPush.setPushDesiredAuthContext({ user: { id: "a" }, profile: { status: "approved" } });
  const restore = webPush.restorePushNotificationsForAuth({ user: { id: "a" }, profile: { status: "approved" } }).catch(() => null);
  await claimStarted.promise;
  const authB = { user: { id: "b" }, profile: { status: "approved" } };
  webPush.setPushDesiredAuthContext(authB, { previousAccessToken: "token-a" });
  webPush.setPushDesiredAuthContext(authB);
  assert.deepEqual(webPush.getPushCoordinatorSnapshot().pendingCleanupUserIds, ["a"]);
  await delay(40);
  claimGate.resolve();
  await restore;
  await eventually(() => assert.equal(owner, null));
  assert.deepEqual(webPush.getPushCoordinatorSnapshot().pendingCleanupUserIds, []);
});

test("rapid A to B to C switching retains both captured cleanup obligations", async () => {
  const storage = new Map([
    ["cheongpa:web-push-preference:a", "on"],
    ["cheongpa:web-push-preference:b", "off"],
    ["cheongpa:web-push-preference:c", "off"],
  ]);
  const removedTokens = [];
  const subscription = { endpoint: "rapid-switch", toJSON: () => ({ keys: {} }), unsubscribe: async () => true };
  const webPush = await loadWebPush({ storage, getSubscription: async () => subscription, subscribe: async () => subscription,
    rpc: async () => ({ error: null }),
    fetch: async (_url, options) => {
      removedTokens.push(options.headers.Authorization);
      return { ok: true, status: 204 };
    },
  });
  webPush.setPushDesiredAuthContext({ user: { id: "a" }, profile: { status: "approved" } });
  webPush.setPushDesiredAuthContext({ user: { id: "b" }, profile: { status: "approved" } }, { previousAccessToken: "token-a" });
  webPush.setPushDesiredAuthContext({ user: { id: "c" }, profile: { status: "approved" } }, { previousAccessToken: "token-b" });
  assert.deepEqual(webPush.getPushCoordinatorSnapshot().pendingCleanupUserIds, ["a", "b"]);
  await eventually(() => assert.deepEqual(webPush.getPushCoordinatorSnapshot().pendingCleanupUserIds, []));
  assert.deepEqual(removedTokens.sort(), ["Bearer token-a", "Bearer token-b"]);
  assert.equal(webPush.getPushCoordinatorSnapshot().desiredState.userId, "c");
  assert.equal(webPush.getPushCoordinatorSnapshot().desiredState.preference, "off");
});

test("reconcile late-completion retries are bounded per revision and reset for a new revision", async () => {
  const storage = new Map([["cheongpa:web-push-preference:a", "on"]]);
  let calls = 0;
  const subscription = { endpoint: "slow", toJSON: () => ({ keys: {} }), unsubscribe: async () => true };
  const webPush = await loadWebPush({ storage, getSubscription: async () => subscription, subscribe: async () => subscription,
    rpc: async () => { calls += 1; await delay(40); return { error: null }; },
  });
  const auth = { user: { id: "a" }, profile: { status: "approved" } };
  webPush.setPushDesiredAuthContext(auth);
  await delay(180);
  const firstRevisionCalls = calls;
  assert.ok(firstRevisionCalls <= 3, `expected at most 3 attempts, got ${firstRevisionCalls}`);
  assert.equal(webPush.getPushCoordinatorSnapshot().reconcileRetryCount, 2);
  webPush.setPushDesiredAuthContext(null);
  await delay(50);
  assert.ok(calls > firstRevisionCalls, "a new revision receives a fresh retry budget");
});

test("a late settlement coalesces with an already scheduled retry without spending its budget", async () => {
  const firstClaim = deferred();
  const firstStarted = deferred();
  const storage = new Map([["cheongpa:web-push-preference:a", "on"]]);
  let claims = 0;
  const subscription = { endpoint: "retry-coalesce", toJSON: () => ({ keys: {} }), unsubscribe: async () => true };
  const webPush = await loadWebPush({
    storage,
    mutationTimeoutMs: 15,
    retryBaseMs: 30,
    getSubscription: async () => subscription,
    subscribe: async () => subscription,
    rpc: async (name) => {
      if (name !== "claim_push_subscription") return { error: null };
      claims += 1;
      if (claims === 1) { firstStarted.resolve(); await firstClaim.promise; }
      if (claims === 2) return { error: new Error("retry one failed") };
      return { error: null };
    },
  });

  webPush.setPushDesiredAuthContext({ user: { id: "a" }, profile: { status: "approved" } });
  await firstStarted.promise;
  await eventually(() => assert.equal(webPush.getPushCoordinatorSnapshot().reconcileRetryCount, 1));
  firstClaim.resolve();
  await delay(5); // late completion requests the same retry during its backoff
  assert.equal(webPush.getPushCoordinatorSnapshot().reconcileRetryCount, 1);
  await eventually(() => {
    const snapshot = webPush.getPushCoordinatorSnapshot();
    assert.equal(claims, 3);
    assert.equal(snapshot.reconcileRetryCount, 2);
    assert.equal(snapshot.reconcileRetryRunCount, 2);
  }, 1000);
});

test("current claims after a cleanup watermark cannot bypass bounded cleanup retries", async () => {
  const storage = new Map([
    ["cheongpa:web-push-preference:a", "on"],
    ["cheongpa:web-push-preference:b", "off"],
  ]);
  let cleanupAttempts = 0;
  let currentClaims = 0;
  const subscription = { endpoint: "watermark", toJSON: () => ({ keys: {} }), unsubscribe: async () => true };
  const webPush = await loadWebPush({
    storage,
    getSubscription: async () => subscription,
    subscribe: async () => subscription,
    fetch: async () => { cleanupAttempts += 1; return { ok: false, status: 401 }; },
    rpc: async (name) => {
      if (name === "claim_push_subscription") currentClaims += 1;
      return { error: null };
    },
  });
  const approved = (id) => ({ user: { id }, profile: { status: "approved" } });
  webPush.setPushDesiredAuthContext(approved("a"));
  webPush.setPushDesiredAuthContext(approved("b"), { previousAccessToken: "token-a" });
  webPush.setPushDesiredAuthContext(approved("a"), { previousAccessToken: "token-b" });

  await eventually(() => {
    const snapshot = webPush.getPushCoordinatorSnapshot();
    assert.equal(snapshot.reconcileRetryCount, 2);
    assert.equal(snapshot.reconcileRetryRunCount, 2);
    assert.equal(cleanupAttempts, 6);
    assert.equal(currentClaims, 3);
    assert.deepEqual(snapshot.pendingCleanupUserIds, ["a", "b"]);
    assert.ok(snapshot.cleanupObligations.every((cleanup) => cleanup.claimWatermark < snapshot.ownershipClaimSequence));
  });
  await delay(30);
  assert.equal(cleanupAttempts, 6, "current claim settlement must not create an unbudgeted loop");
});

test("sign-out timeout retains the captured cleanup obligation for later convergence", async () => {
  const removalGate = deferred();
  const removalStarted = deferred();
  const storage = new Map([["cheongpa:web-push-preference:a", "on"]]);
  let active = true;
  let owner = "a";
  let subscriptionExists = true;
  let removals = 0;
  const subscription = {
    endpoint: "logout-obligation",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => { subscriptionExists = false; },
  };
  const webPush = await loadWebPush({
    storage,
    mutationTimeoutMs: 15,
    getSubscription: async () => subscriptionExists ? subscription : null,
    subscribe: async () => subscription,
    rpc: async () => ({ error: null }),
    fetch: async () => {
      removals += 1;
      if (removals === 1) { removalStarted.resolve(); await removalGate.promise; }
      owner = null;
      return { ok: true, status: 204 };
    },
  });
  webPush.setPushDesiredAuthContext({ user: { id: "a" }, profile: { status: "approved" } });
  const cleanup = webPush.cleanupPushSubscriptionForSignOut("a", {
    accessToken: "token-a",
    isActive: () => active,
  });
  await removalStarted.promise;
  await assert.rejects(cleanup, /timed out/);
  active = false; // auth sign-out has continued and cleared its lifecycle
  assert.deepEqual(webPush.getPushCoordinatorSnapshot().pendingCleanupUserIds, ["a"]);
  assert.equal(storage.get("cheongpa:web-push-preference:a"), "on");

  removalGate.resolve();
  await eventually(() => {
    const snapshot = webPush.getPushCoordinatorSnapshot();
    assert.equal(owner, null);
    assert.equal(subscriptionExists, false);
    assert.deepEqual(snapshot.pendingCleanupUserIds, []);
    assert.equal(snapshot.authContext.userId, null);
  });
  assert.equal(storage.get("cheongpa:web-push-preference:a"), "on");
});

test("a pre-sign-out claim that succeeds late is removed with the retained token", async () => {
  const claimGate = deferred();
  const claimStarted = deferred();
  const storage = new Map([["cheongpa:web-push-preference:a", "on"]]);
  let owner = null;
  let removalAttempts = 0;
  const subscription = { endpoint: "logout-late-claim", toJSON: () => ({ keys: {} }), unsubscribe: async () => true };
  const webPush = await loadWebPush({
    storage,
    mutationTimeoutMs: 15,
    getSubscription: async () => subscription,
    subscribe: async () => subscription,
    rpc: async (name) => {
      if (name === "claim_push_subscription") {
        claimStarted.resolve();
        await claimGate.promise;
        owner = "a";
      }
      return { error: null };
    },
    fetch: async () => { removalAttempts += 1; owner = null; return { ok: true, status: 204 }; },
  });
  const auth = { user: { id: "a" }, profile: { status: "approved" } };
  webPush.setPushDesiredAuthContext(auth);
  await claimStarted.promise;
  const cleanup = webPush.cleanupPushSubscriptionForSignOut("a", { accessToken: "token-a" });
  await cleanup;
  assert.deepEqual(webPush.getPushCoordinatorSnapshot().pendingCleanupUserIds, ["a"]);

  claimGate.resolve();
  await eventually(() => {
    assert.equal(owner, null);
    assert.ok(removalAttempts >= 2, "late claim requires a post-settlement cleanup pass");
    assert.deepEqual(webPush.getPushCoordinatorSnapshot().pendingCleanupUserIds, []);
  });
  assert.equal(storage.get("cheongpa:web-push-preference:a"), "on");
});

test("sign-out still unsubscribes after immediate DB failure and retries the obligation", async () => {
  const storage = new Map([["cheongpa:web-push-preference:a", "on"]]);
  let attempts = 0;
  let subscriptionExists = true;
  const subscription = {
    endpoint: "logout-remove-retry",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => { subscriptionExists = false; },
  };
  const webPush = await loadWebPush({
    storage,
    getSubscription: async () => subscriptionExists ? subscription : null,
    subscribe: async () => subscription,
    rpc: async () => ({ error: null }),
    fetch: async () => {
      attempts += 1;
      return attempts === 1 ? { ok: false, status: 503 } : { ok: true, status: 204 };
    },
  });
  webPush.setPushDesiredAuthContext({ user: { id: "a" }, profile: { status: "approved" } });
  await assert.rejects(
    webPush.cleanupPushSubscriptionForSignOut("a", { accessToken: "token-a" }),
    /cleanup failed/,
  );
  assert.equal(subscriptionExists, false);
  assert.deepEqual(webPush.getPushCoordinatorSnapshot().pendingCleanupUserIds, ["a"]);

  // The auth publication remains non-blocking and supplies a future convergence pass.
  webPush.setPushDesiredAuthContext(null, { previousAccessToken: "token-a" });
  await eventually(() => {
    assert.equal(attempts, 2);
    assert.deepEqual(webPush.getPushCoordinatorSnapshot().pendingCleanupUserIds, []);
  });
  assert.equal(storage.get("cheongpa:web-push-preference:a"), "on");
});

test("edge function re-reads notification, filters push types, and removes invalid subscriptions", async () => {
  const source = await readFile("supabase/functions/send-web-push/index.ts", "utf8");
  assert.match(source, /notifications\?select=id,user_id,notification_type/);
  assert.match(source, /if \(!PUSH_TYPES\.has\(notification\.notification_type\)\)/);
  assert.match(source, /statusCode === 404 \|\| statusCode === 410/);
  assert.match(source, /Promise\.allSettled/);
  assert.doesNotMatch(source, /PUSH_TYPES[\s\S]*direct_message/);
});

test("stale late completion keeps a follow-up while latest reconcile is running", async () => {
  const oldUnsubscribeGate = deferred();
  const oldUnsubscribeStarted = deferred();
  const latestClaimGate = deferred();
  const latestClaimStarted = deferred();
  const storage = new Map([["cheongpa:web-push-preference:a", "off"]]);
  let subscription = null;
  let owner = null;
  let claimCalls = 0;

  const oldSubscription = {
    endpoint: "old-endpoint",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => {
      oldUnsubscribeStarted.resolve();
      await oldUnsubscribeGate.promise;
      if (subscription === oldSubscription) subscription = null;
      return true;
    },
  };
  const freshSubscription = {
    endpoint: "fresh-endpoint",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => {
      if (subscription === freshSubscription) subscription = null;
      return true;
    },
  };
  subscription = oldSubscription;

  const webPush = await loadWebPush({
    storage,
    mutationTimeoutMs: 15,
    retryBaseMs: 100,
    getSubscription: async () => subscription,
    subscribe: async () => {
      subscription = freshSubscription;
      return freshSubscription;
    },
    rpc: async (name, args) => {
      if (name === "remove_own_push_subscription") {
        owner = null;
        return { error: null };
      }
      if (name === "claim_push_subscription") {
        claimCalls += 1;
        if (claimCalls === 1) {
          latestClaimStarted.resolve();
          await latestClaimGate.promise;
        }
        owner = args.p_endpoint;
      }
      return { error: null };
    },
  });

  webPush.setPushDesiredAuthContext({ user: { id: "a" }, profile: { status: "approved" } });
  await oldUnsubscribeStarted.promise;
  await delay(20);

  storage.set("cheongpa:web-push-preference:a", "on");
  webPush.setPushAuthContextVersion("a", 1);
  webPush.setPushDesiredAuthContext({ user: { id: "a" }, profile: { status: "approved" } });
  await latestClaimStarted.promise;

  oldUnsubscribeGate.resolve();
  await delay(5);
  latestClaimGate.resolve();

  await eventually(() => {
    const snapshot = webPush.getPushCoordinatorSnapshot();
    assert.equal(snapshot.desiredState.preference, "on");
    assert.equal(subscription, freshSubscription);
    assert.equal(owner, "fresh-endpoint");
    assert.equal(snapshot.reconcileFollowUp, null);
    assert.ok(claimCalls >= 2, "a follow-up reconcile must recreate and reclaim the endpoint");
  }, 1000);
});

test("renewed same-account cleanup advances watermark over newer claims", async () => {
  const claimGate = deferred();
  const claimStarted = deferred();
  const storage = new Map([["cheongpa:web-push-preference:a", "off"]]);
  let subscription = null;
  let owner = null;
  let cleanupCalls = 0;

  const subscriptionObject = {
    endpoint: "renewed-watermark",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => {
      subscription = null;
      return true;
    },
  };
  subscription = subscriptionObject;

  const webPush = await loadWebPush({
    storage,
    mutationTimeoutMs: 15,
    getSubscription: async () => subscription,
    subscribe: async () => {
      subscription = subscriptionObject;
      return subscriptionObject;
    },
    rpc: async (name) => {
      if (name === "claim_push_subscription") {
        claimStarted.resolve();
        await claimGate.promise;
        owner = "a";
      }
      return { error: null };
    },
    fetch: async () => {
      cleanupCalls += 1;
      if (cleanupCalls === 1) return { ok: false, status: 503 };
      owner = null;
      return { ok: true, status: 204 };
    },
  });

  webPush.setPushDesiredAuthContext({ user: { id: "a" }, profile: { status: "approved" } });
  await assert.rejects(
    webPush.cleanupPushSubscriptionForSignOut("a", { accessToken: "old-token" }),
    /cleanup failed/,
  );
  const firstWatermark = webPush.getPushCoordinatorSnapshot().cleanupObligations[0].claimWatermark;

  storage.set("cheongpa:web-push-preference:a", "on");
  webPush.setPushAuthContextVersion("a", 2);
  webPush.setPushDesiredAuthContext({ user: { id: "a" }, profile: { status: "approved" } });
  await claimStarted.promise;
  const pendingClaim = webPush.getPushCoordinatorSnapshot().inFlightOwnershipClaims[0];
  assert.ok(pendingClaim.sequence > firstWatermark);

  const secondCleanup = webPush.cleanupPushSubscriptionForSignOut("a", { accessToken: "new-token" });
  await eventually(() => {
    const obligation = webPush.getPushCoordinatorSnapshot().cleanupObligations[0];
    assert.equal(obligation.claimWatermark, pendingClaim.sequence);
  });

  await secondCleanup;
  assert.deepEqual(webPush.getPushCoordinatorSnapshot().pendingCleanupUserIds, ["a"]);
  claimGate.resolve();
  await eventually(() => {
    assert.equal(owner, null);
    assert.deepEqual(webPush.getPushCoordinatorSnapshot().pendingCleanupUserIds, []);
  });
});

test("cleanup started with stale claim requires post-settlement removal", async () => {
  const claimGate = deferred();
  const claimStarted = deferred();
  const cleanupResponseGate = deferred();
  const cleanupStarted = deferred();
  const storage = new Map([
    ["cheongpa:web-push-preference:a", "on"],
    ["cheongpa:web-push-preference:b", "off"],
  ]);
  let owner = null;
  let cleanupCalls = 0;
  let subscriptionExists = true;
  const subscription = {
    endpoint: "cleanup-race",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => {
      subscriptionExists = false;
      return true;
    },
  };

  const webPush = await loadWebPush({
    storage,
    mutationTimeoutMs: 15,
    retryBaseMs: 100,
    getSubscription: async () => subscriptionExists ? subscription : null,
    subscribe: async () => subscription,
    rpc: async (name) => {
      if (name === "claim_push_subscription") {
        claimStarted.resolve();
        await claimGate.promise;
        owner = "a";
      }
      return { error: null };
    },
    fetch: async () => {
      cleanupCalls += 1;
      owner = null;
      if (cleanupCalls === 1) {
        cleanupStarted.resolve();
        await cleanupResponseGate.promise;
      }
      return { ok: true, status: 204 };
    },
  });

  webPush.setPushDesiredAuthContext({ user: { id: "a" }, profile: { status: "approved" } });
  await claimStarted.promise;
  webPush.setPushDesiredAuthContext(
    { user: { id: "b" }, profile: { status: "approved" } },
    { previousAccessToken: "token-a" },
  );
  await cleanupStarted.promise;

  claimGate.resolve();
  await eventually(() => assert.equal(owner, "a"));
  cleanupResponseGate.resolve();

  await eventually(() => {
    assert.ok(cleanupCalls >= 2, "a second authenticated cleanup must run after stale claim settles");
    assert.equal(owner, null);
    assert.deepEqual(webPush.getPushCoordinatorSnapshot().pendingCleanupUserIds, []);
  }, 1000);
});

test("late explicit mutation uses captured revision after latest retry exhaustion", async () => {
  const oldRemoveGate = deferred();
  const oldRemoveStarted = deferred();
  const storage = new Map([["cheongpa:web-push-preference:a", "on"]]);
  let owner = "a";
  let claimAttempts = 0;
  let removalCalls = 0;
  let subscriptionExists = true;
  const subscription = {
    endpoint: "captured-revision",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => {
      subscriptionExists = false;
      return true;
    },
  };

  const webPush = await loadWebPush({
    storage,
    mutationTimeoutMs: 15,
    retryBaseMs: 1,
    getSubscription: async () => subscriptionExists ? subscription : null,
    subscribe: async () => subscription,
    rpc: async (name) => {
      if (name === "claim_push_subscription") {
        claimAttempts += 1;
        if (claimAttempts === 1) {
          owner = "a";
          return { error: null };
        }
        if (claimAttempts <= 4) return { error: new Error("transient claim failure") };
        owner = "a";
        return { error: null };
      }
      if (name === "remove_own_push_subscription") {
        removalCalls += 1;
        if (removalCalls === 1) {
          oldRemoveStarted.resolve();
          await oldRemoveGate.promise;
        }
        owner = null;
      }
      return { error: null };
    },
  });

  webPush.setPushDesiredAuthContext({ user: { id: "a" }, profile: { status: "approved" } });
  await eventually(() => assert.equal(claimAttempts, 1));

  const disabling = webPush.disablePushNotifications("a");
  await oldRemoveStarted.promise;
  await assert.rejects(disabling, /timed out/);

  await eventually(() => {
    const snapshot = webPush.getPushCoordinatorSnapshot();
    assert.equal(snapshot.desiredState.preference, "on");
    assert.equal(snapshot.reconcileRetryCount, 2);
    assert.equal(claimAttempts, 4);
  });

  oldRemoveGate.resolve();
  await eventually(() => {
    assert.equal(owner, "a");
    assert.ok(claimAttempts >= 5, "stale late completion must trigger latest-state repair");
    assert.equal(subscriptionExists, true);
    assert.equal(storage.get("cheongpa:web-push-preference:a"), "on");
  }, 1000);
});
