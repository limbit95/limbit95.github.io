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
  getSubscription = async () => null,
  subscribe = async () => null,
  rpc = async () => ({ error: null }),
  fetch = async () => ({ ok: true, status: 204 }),
  storage = new Map(),
  permission = "granted",
  requestPermission = null,
}) {
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
    serviceWorker: { register: async () => ({ pushManager: { getSubscription, subscribe } }) },
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

test("permission prompt cannot complete explicit ON after account switch", async () => {
  const permissionGate = deferred();
  const permissionStarted = deferred();
  const storage = new Map([
    ["cheongpa:web-push-preference:a", "off"],
    ["cheongpa:web-push-preference:b", "off"],
  ]);
  let subscribes = 0;
  let claims = 0;

  const webPush = await loadWebPush({
    storage,
    permission: "default",
    requestPermission: async () => {
      permissionStarted.resolve();
      await permissionGate.promise;
      Notification.permission = "granted";
      return "granted";
    },
    subscribe: async () => {
      subscribes += 1;
      return { endpoint: "stale-a", toJSON: () => ({ keys: {} }), unsubscribe: async () => true };
    },
    rpc: async (name) => {
      if (name === "claim_push_subscription") claims += 1;
      return { error: null };
    },
  });

  webPush.setPushAuthContextVersion("a", 1);
  webPush.setPushDesiredAuthContext({ user: { id: "a" }, profile: { status: "approved" } });
  const enabling = webPush.enablePushNotifications("a");
  await permissionStarted.promise;

  webPush.setPushAuthContextVersion("a", null);
  webPush.setPushAuthContextVersion("b", 2);
  webPush.setPushDesiredAuthContext(
    { user: { id: "b" }, profile: { status: "approved" } },
    { previousAccessToken: "token-a" },
  );
  permissionGate.resolve();

  await assert.rejects(enabling, /로그인 상태가 변경되었습니다/);
  await delay(10);
  assert.equal(subscribes, 0);
  assert.equal(claims, 0);
  assert.equal(storage.get("cheongpa:web-push-preference:a"), "off");
  assert.equal(storage.get("cheongpa:web-push-preference:b"), "off");
  const snapshot = webPush.getPushCoordinatorSnapshot();
  assert.equal(snapshot.authContext.userId, "b");
  assert.equal(snapshot.desiredState.userId, "b");
  assert.equal(snapshot.desiredState.preference, "off");
  assert.equal(snapshot.explicitIntent, null);
});

test("explicit push APIs reject a stale user id before mutating shared push state", async () => {
  const storage = new Map([
    ["cheongpa:web-push-preference:a", "on"],
    ["cheongpa:web-push-preference:b", "off"],
  ]);
  let subscribes = 0;
  let rpcCalls = 0;
  const webPush = await loadWebPush({
    storage,
    subscribe: async () => {
      subscribes += 1;
      return { endpoint: "stale-call", toJSON: () => ({ keys: {} }), unsubscribe: async () => true };
    },
    rpc: async () => {
      rpcCalls += 1;
      return { error: null };
    },
  });

  webPush.setPushAuthContextVersion("b", 2);
  webPush.setPushDesiredAuthContext({ user: { id: "b" }, profile: { status: "approved" } });

  await assert.rejects(webPush.enablePushNotifications("a"), /로그인 상태가 변경되었습니다/);
  await assert.rejects(webPush.disablePushNotifications("a"), /로그인 상태가 변경되었습니다/);
  await delay(10);
  assert.equal(subscribes, 0);
  assert.equal(rpcCalls, 0);
  assert.equal(storage.get("cheongpa:web-push-preference:a"), "on");
  assert.equal(storage.get("cheongpa:web-push-preference:b"), "off");
});

test("account switch after subscribe starts prevents the stale ON claim", async () => {
  const subscribeGate = deferred();
  const subscribeStarted = deferred();
  const storage = new Map([
    ["cheongpa:web-push-preference:a", "off"],
    ["cheongpa:web-push-preference:b", "off"],
  ]);
  let subscriptionExists = false;
  let claims = 0;
  let removes = 0;
  const subscription = {
    endpoint: "switch-during-subscribe",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => { subscriptionExists = false; return true; },
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
      if (name === "remove_own_push_subscription") removes += 1;
      return { error: null };
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

  assert.equal(await enabling, null);
  await delay(20);
  assert.equal(claims, 0);
  assert.equal(storage.get("cheongpa:web-push-preference:a"), "off");
  assert.equal(storage.get("cheongpa:web-push-preference:b"), "off");
  assert.equal(webPush.getPushCoordinatorSnapshot().authContext.userId, "b");
  assert.ok(removes >= 0);
});
