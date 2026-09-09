import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function defineGlobal(name, value) {
  Object.defineProperty(globalThis, name, {
    value,
    configurable: true,
    writable: true,
  });
}

async function loadWebPush({
  permission = "granted",
  requestPermission = null,
  getSubscription = async () => null,
  subscribe = async () => null,
  rpc = async () => ({ error: null }),
  fetch = async () => ({ ok: true, status: 204 }),
  storage = new Map(),
} = {}) {
  let source = await readFile("js/web-push.js", "utf8");
  source = source
    .replace(/import \{[\s\S]*?\} from "\.\/config\.js";/, `const SUPABASE_PUBLISHABLE_KEY = "key";\nconst SUPABASE_URL = "https://example.supabase.co";\nconst WEB_PUSH_VAPID_PUBLIC_KEY = "AQ";`)
    .replace('import { supabase } from "./supabaseClient.js";', "const supabase = globalThis.__webPushSupabase;");

  defineGlobal("window", {
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
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
    serviceWorker: {
      register: async () => ({ pushManager: { getSubscription, subscribe } }),
    },
  });
  defineGlobal("__webPushSupabase", {
    rpc,
    from: () => ({
      select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }) }),
    }),
  });
  defineGlobal("fetch", fetch);
  defineGlobal("__WEB_PUSH_MUTATION_TIMEOUT_MS", 30);
  defineGlobal("__WEB_PUSH_RECONCILE_RETRY_BASE_MS", 1);

  return import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}#${Math.random()}`);
}

test("PR74 review keeps retry and cleanup authority invariants", async () => {
  const source = await readFile("js/web-push.js", "utf8");
  const coalesceIndex = source.indexOf("if (reconcileScheduled?.revision === revision) return;");
  const retryChargeIndex = source.indexOf("if (isRetry) reconcileRetries.set(revision, retryCount + 1);");
  const cleanupStart = source.indexOf("export async function cleanupPushSubscriptionForSignOut");
  const cleanupObligation = source.indexOf("addCleanupObligation(userId, accessToken);", cleanupStart);
  const clearAuth = source.indexOf("currentPushAuthContext = {", cleanupStart);

  assert.match(source, /const authorityRevision = reconcileRevision \?\? desiredPushState\.revision;/);
  assert.ok(coalesceIndex >= 0 && retryChargeIndex > coalesceIndex, "retry budget must be charged after coalescing");
  assert.match(source, /let ownershipClaimSequence = 0;/);
  assert.match(source, /claimWatermark:/);
  assert.match(source, /staleClaimsAtStart/);
  assert.ok(cleanupObligation >= 0 && clearAuth > cleanupObligation, "logout must preserve cleanup authority before clearing push auth");
});

test("explicit push actions require the exact current auth context", async () => {
  let rpcCalls = 0;
  let subscribes = 0;
  const webPush = await loadWebPush({
    subscribe: async () => { subscribes += 1; return null; },
    rpc: async () => { rpcCalls += 1; return { error: null }; },
  });

  await assert.rejects(webPush.enablePushNotifications("a"), /로그인 상태가 변경/);
  await assert.rejects(webPush.disablePushNotifications("a"), /로그인 상태가 변경/);
  assert.equal(subscribes, 0);
  assert.equal(rpcCalls, 0);
});

test("permission prompt cannot complete explicit ON after account switch", async () => {
  const promptStarted = deferred();
  const prompt = deferred();
  const storage = new Map([
    ["cheongpa:web-push-preference:a", "off"],
    ["cheongpa:web-push-preference:b", "off"],
  ]);
  let claims = 0;
  let subscribes = 0;
  const webPush = await loadWebPush({
    permission: "default",
    storage,
    requestPermission: async () => {
      promptStarted.resolve();
      const result = await prompt.promise;
      Notification.permission = result;
      return result;
    },
    subscribe: async () => {
      subscribes += 1;
      return { endpoint: "stale", toJSON: () => ({ keys: {} }), unsubscribe: async () => true };
    },
    rpc: async (name) => {
      if (name === "claim_push_subscription") claims += 1;
      return { error: null };
    },
  });

  webPush.setPushAuthContextVersion("a", 1);
  webPush.setPushDesiredAuthContext({ user: { id: "a" }, profile: { status: "approved" } });
  const enabling = webPush.enablePushNotifications("a");
  await promptStarted.promise;

  webPush.setPushAuthContextVersion("a", null);
  webPush.setPushAuthContextVersion("b", 2);
  webPush.setPushDesiredAuthContext(
    { user: { id: "b" }, profile: { status: "approved" } },
    { previousAccessToken: "token-a" },
  );
  prompt.resolve("granted");

  await assert.rejects(enabling, /로그인 상태가 변경/);
  await delay(10);
  assert.equal(subscribes, 0);
  assert.equal(claims, 0);
  assert.equal(storage.get("cheongpa:web-push-preference:a"), "off");
  assert.equal(storage.get("cheongpa:web-push-preference:b"), "off");
});

test("same-account lifecycle replacement invalidates a pending explicit ON", async () => {
  const promptStarted = deferred();
  const prompt = deferred();
  const storage = new Map([["cheongpa:web-push-preference:a", "off"]]);
  let claims = 0;
  const webPush = await loadWebPush({
    permission: "default",
    storage,
    requestPermission: async () => {
      promptStarted.resolve();
      const result = await prompt.promise;
      Notification.permission = result;
      return result;
    },
    rpc: async (name) => {
      if (name === "claim_push_subscription") claims += 1;
      return { error: null };
    },
  });
  const auth = { user: { id: "a" }, profile: { status: "approved" } };

  webPush.setPushAuthContextVersion("a", 1);
  webPush.setPushDesiredAuthContext(auth);
  const enabling = webPush.enablePushNotifications("a");
  await promptStarted.promise;

  webPush.setPushAuthContextVersion("a", 2);
  webPush.setPushDesiredAuthContext(auth);
  prompt.resolve("granted");

  await assert.rejects(enabling, /로그인 상태가 변경/);
  await delay(10);
  assert.equal(claims, 0);
  assert.equal(storage.get("cheongpa:web-push-preference:a"), "off");
  assert.equal(webPush.getPushCoordinatorSnapshot().authContext.contextVersion, 2);
});

test("account switch during subscribe reconciles the orphan browser subscription", async () => {
  const subscribeStarted = deferred();
  const subscribeGate = deferred();
  const storage = new Map([
    ["cheongpa:web-push-preference:a", "off"],
    ["cheongpa:web-push-preference:b", "off"],
  ]);
  let subscriptionExists = false;
  let claims = 0;
  let unsubscribes = 0;
  let oldAccountCleanupCalls = 0;
  const subscription = {
    endpoint: "shared",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => {
      unsubscribes += 1;
      subscriptionExists = false;
      return true;
    },
  };

  const webPush = await loadWebPush({
    storage,
    getSubscription: async () => subscriptionExists ? subscription : null,
    subscribe: async () => {
      subscribeStarted.resolve();
      await subscribeGate.promise;
      subscriptionExists = true;
      return subscription;
    },
    rpc: async (name) => {
      if (name === "claim_push_subscription") claims += 1;
      return { error: null };
    },
    fetch: async () => {
      oldAccountCleanupCalls += 1;
      return { ok: true, status: 204 };
    },
  });

  webPush.setPushAuthContextVersion("a", 1);
  webPush.setPushDesiredAuthContext({ user: { id: "a" }, profile: { status: "approved" } });
  const enabling = webPush.enablePushNotifications("a");
  await subscribeStarted.promise;

  webPush.setPushAuthContextVersion("a", null);
  webPush.setPushAuthContextVersion("b", 2);
  webPush.setPushDesiredAuthContext(
    { user: { id: "b" }, profile: { status: "approved" } },
    { previousAccessToken: "token-a" },
  );
  subscribeGate.resolve();

  await assert.rejects(enabling, /로그인 상태가 변경/);
  await delay(50);
  assert.equal(claims, 0);
  assert.equal(subscriptionExists, false);
  assert.ok(unsubscribes >= 1);
  assert.ok(oldAccountCleanupCalls >= 1);
  assert.equal(webPush.getPushCoordinatorSnapshot().authContext.userId, "b");
});

test("stale automatic restore cannot issue a post-switch ownership claim", async () => {
  const subscribeStarted = deferred();
  const subscribeGate = deferred();
  const storage = new Map([
    ["cheongpa:web-push-preference:a", "on"],
    ["cheongpa:web-push-preference:b", "off"],
  ]);
  let subscriptionExists = false;
  let claims = 0;
  let unsubscribes = 0;
  const subscription = {
    endpoint: "restore-shared",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => {
      unsubscribes += 1;
      subscriptionExists = false;
      return true;
    },
  };
  const webPush = await loadWebPush({
    storage,
    getSubscription: async () => subscriptionExists ? subscription : null,
    subscribe: async () => {
      subscribeStarted.resolve();
      await subscribeGate.promise;
      subscriptionExists = true;
      return subscription;
    },
    rpc: async (name) => {
      if (name === "claim_push_subscription") claims += 1;
      return { error: null };
    },
  });

  let current = true;
  const authA = { user: { id: "a" }, profile: { status: "approved" } };
  webPush.setPushAuthContextVersion("a", 1);
  webPush.setPushDesiredAuthContext(authA);
  const restoring = webPush.restorePushNotificationsForAuth(authA, {
    isCurrent: () => current,
    getCurrentUserId: () => current ? "a" : "b",
  });
  await subscribeStarted.promise;

  current = false;
  webPush.setPushAuthContextVersion("a", null);
  webPush.setPushAuthContextVersion("b", 2);
  webPush.setPushDesiredAuthContext(
    { user: { id: "b" }, profile: { status: "approved" } },
    { previousAccessToken: "token-a" },
  );
  subscribeGate.resolve();

  assert.equal(await restoring, null);
  await delay(50);
  assert.equal(claims, 0);
  assert.equal(subscriptionExists, false);
  assert.ok(unsubscribes >= 1);
});
