import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}

function defineGlobal(name, value) {
  Object.defineProperty(globalThis, name, {
    value,
    configurable: true,
    writable: true,
  });
}

async function loadWebPush({ getSubscription, subscribe, rpc, fetch = async () => ({ ok: true, status: 204 }) }) {
  let source = await readFile("js/web-push.js", "utf8");
  source = source
    .replace(/import \{[\s\S]*?\} from "\.\/config\.js";/, `const SUPABASE_PUBLISHABLE_KEY = "key";
const SUPABASE_URL = "https://example.supabase.co";
const WEB_PUSH_VAPID_PUBLIC_KEY = "AQ";`)
    .replace('import { supabase } from "./supabaseClient.js";', "const supabase = globalThis.__webPushSupabase;");
  const subscriptionManager = { getSubscription, subscribe };
  defineGlobal("window", {
    localStorage: {
      getItem: () => "on",
      setItem: () => {},
    },
    PushManager: function PushManager() {},
    Notification: function Notification() {},
    matchMedia: () => ({ matches: true }),
  });
  defineGlobal("Notification", { permission: "granted" });
  defineGlobal("navigator", {
    userAgent: "test",
    serviceWorker: { register: async () => ({ pushManager: subscriptionManager }) },
  });
  defineGlobal("__webPushSupabase", { rpc });
  defineGlobal("fetch", fetch);
  return import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}#${Math.random()}`);
}

async function loadAuthForSignOut({
  cleanupPushSubscriptionForSignOut,
  waitForPushRestoreClaims = async () => true,
  authSignOut,
}) {
  let source = await readFile("js/auth.js", "utf8");
  source = source
    .replace('import { supabase } from "./supabaseClient.js";', "const supabase = globalThis.__authSupabase;")
    .replace('import { PROFILE_STATUS } from "./constants.js";', 'const PROFILE_STATUS = { APPROVED: "approved" };')
    .replace(/import \{[\s\S]*?\} from "\.\/web-push\.js";/, `const {
  cleanupPushSubscriptionForSignOut,
  restorePushNotificationsForAuth,
  setPushDesiredAuthContext,
  setPushAuthContextVersion,
  waitForPushRestoreClaims,
} = globalThis.__authPushMocks;`)
    .replace('import { ROLE, hasAdminPermission } from "./permissions.js";', `const ROLE = { ADMIN: "ADMIN", SYSTEM_ADMIN: "SYSTEM_ADMIN" };
const hasAdminPermission = () => false;`)
    .replace("const PUSH_SIGN_OUT_CLEANUP_TIMEOUT_MS = 3000;", "const PUSH_SIGN_OUT_CLEANUP_TIMEOUT_MS = 5;");

  defineGlobal("window", {
    setTimeout,
    clearTimeout,
    dispatchEvent: () => {},
  });
  defineGlobal("__authSupabase", {
    auth: { signOut: authSignOut },
  });
  defineGlobal("__authPushMocks", {
    cleanupPushSubscriptionForSignOut,
    restorePushNotificationsForAuth: async () => null,
    setPushDesiredAuthContext: () => {},
    setPushAuthContextVersion: () => {},
    waitForPushRestoreClaims,
  });
  return import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}#${Math.random()}`);
}

test("same-account relogin is serialized behind the older lifecycle", async () => {
  const gate = deferred();
  const started = deferred();
  let generation = 1;
  let claims = 0;
  const subscription = { endpoint: "same-a", toJSON: () => ({ keys: {} }), unsubscribe: async () => {} };
  const webPush = await loadWebPush({ getSubscription: async () => subscription, subscribe: async () => subscription, rpc: async () => {
    claims += 1; if (claims === 1) { started.resolve(); await gate.promise; } return { error: null };
  } });
  const auth = { user: { id: "a" }, profile: { status: "approved" } };
  webPush.setPushAuthContextVersion("a", 1);
  const oldRestore = webPush.restorePushNotificationsForAuth(auth, { isCurrent: () => generation === 1, getCurrentUserId: () => "a" });
  await started.promise;
  generation = 2;
  webPush.setPushAuthContextVersion("a", 2);
  const newRestore = webPush.restorePushNotificationsForAuth(auth, { isCurrent: () => generation === 2, getCurrentUserId: () => "a" });
  gate.resolve();
  assert.equal(await oldRestore, null);
  assert.equal(await newRestore, subscription);
  assert.equal(claims, 2);
});

test("persisted ON preference recreates the browser subscription after relogin", async () => {
  let subscribes = 0;
  let claims = 0;
  const subscription = {
    endpoint: "restored-a",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => {},
  };
  const webPush = await loadWebPush({
    getSubscription: async () => null,
    subscribe: async () => { subscribes += 1; return subscription; },
    rpc: async () => { claims += 1; return { error: null }; },
  });
  const auth = { user: { id: "a" }, profile: { status: "approved" } };
  webPush.setPushAuthContextVersion("a", 2);

  assert.equal(await webPush.restorePushNotificationsForAuth(auth, {
    isCurrent: () => true,
    getCurrentUserId: () => "a",
  }), subscription);
  assert.equal(subscribes, 1);
  assert.equal(claims, 1);
});

test("mypage keeps persisted ON intent visible while relogin restore catches up", async () => {
  const source = await readFile("js/pages/mypage.js", "utf8");
  assert.match(source, /getPushPreference\(auth\.user\.id\)/);
  assert.match(source, /return pushPreference === "on" \|\| \(pushPreference === null && pushState\.owned\)/);
  assert.match(source, /restorePushNotificationsForAuth\(auth/);
  assert.match(source, /저장된 푸시 알림 설정을 이 기기에 다시 연결하고 있습니다\./);
  assert.match(source, /pushPreference = "off"/);
  assert.match(source, /pushPreference = "on"/);
});

test("restore claim coordination times out instead of blocking forever", async () => {
  const claimGate = deferred();
  const claimStarted = deferred();
  const subscription = {
    endpoint: "pending-a",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => {},
  };
  const webPush = await loadWebPush({
    getSubscription: async () => subscription,
    subscribe: async () => subscription,
    rpc: async () => {
      claimStarted.resolve();
      await claimGate.promise;
      return { error: null };
    },
  });

  const restore = webPush.restorePushNotificationsForAuth(
    {
      session: { access_token: "token-a" },
      user: { id: "a" },
      profile: { status: "approved" },
    },
    {
      isCurrent: () => true,
      getCurrentUserId: () => "a",
    },
  );
  await claimStarted.promise;

  assert.equal(await webPush.waitForPushRestoreClaims("a", 5), false);
  claimGate.resolve();
  assert.equal(await restore, subscription);
});

test("sign-out cleanup is tied to the exact auth lifecycle, not only the user id", async () => {
  const source = await readFile("js/auth.js", "utf8");
  const helper = source.match(/async function cleanupPushBeforeSignOut[\s\S]*?\n}/)?.[0];
  assert.ok(helper);
  assert.match(helper, /const cleanupEpoch = lifecycleEpoch/);
  assert.match(helper, /cleanupEpoch === lifecycleEpoch/);
  assert.match(source, /setPushAuthContextVersion\(user\.id, epoch\)/);
  assert.match(source, /setPushAuthContextVersion\(previousUserId, null\)/);
});

test("a hanging push cleanup cannot prevent Supabase sign-out", async () => {
  let cleanupStarted = false;
  let authSignOutCalls = 0;
  const auth = await loadAuthForSignOut({
    cleanupPushSubscriptionForSignOut: async () => {
      cleanupStarted = true;
      await new Promise(() => {});
    },
    authSignOut: async () => {
      authSignOutCalls += 1;
      return { error: null };
    },
  });

  const outcome = await Promise.race([
    auth.signOut().then(() => "signed-out"),
    new Promise((resolve) => setTimeout(() => resolve("blocked"), 100)),
  ]);

  assert.equal(cleanupStarted, true);
  assert.equal(outcome, "signed-out");
  assert.equal(authSignOutCalls, 1);
});
