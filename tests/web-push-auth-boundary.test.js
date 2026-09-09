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

async function loadWebPush({ requestPermission, rpc, subscribe, getSubscription, storage }) {
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
  defineGlobal("Notification", {
    permission: "default",
    requestPermission,
  });
  defineGlobal("navigator", {
    userAgent: "test",
    serviceWorker: {
      register: async () => ({ pushManager: { subscribe, getSubscription } }),
    },
  });
  defineGlobal("__webPushSupabase", {
    rpc,
    from: () => ({
      select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }) }),
    }),
  });
  defineGlobal("fetch", async () => ({ ok: true, status: 204 }));
  defineGlobal("__WEB_PUSH_MUTATION_TIMEOUT_MS", 30);
  defineGlobal("__WEB_PUSH_RECONCILE_RETRY_BASE_MS", 1);

  return import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}#${Math.random()}`);
}

test("permission prompt cannot publish A push intent after auth switches to B", async () => {
  const prompt = deferred();
  const storage = new Map([
    ["cheongpa:web-push-preference:a", "off"],
    ["cheongpa:web-push-preference:b", "off"],
  ]);
  let claims = 0;
  let subscribes = 0;
  const subscription = {
    endpoint: "shared",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => true,
  };
  const webPush = await loadWebPush({
    storage,
    requestPermission: async () => {
      const permission = await prompt.promise;
      Notification.permission = permission;
      return permission;
    },
    getSubscription: async () => null,
    subscribe: async () => { subscribes += 1; return subscription; },
    rpc: async (name) => {
      if (name === "claim_push_subscription") claims += 1;
      return { error: null };
    },
  });

  webPush.setPushAuthContextVersion("a", 1);
  webPush.setPushDesiredAuthContext({ user: { id: "a" }, profile: { status: "approved" } });
  const enabling = webPush.enablePushNotifications("a");

  webPush.setPushAuthContextVersion("a", null);
  webPush.setPushAuthContextVersion("b", 2);
  webPush.setPushDesiredAuthContext(
    { user: { id: "b" }, profile: { status: "approved" } },
    { previousAccessToken: "token-a" },
  );
  prompt.resolve("granted");

  await assert.rejects(enabling, /로그인 상태가 변경/);
  assert.equal(claims, 0);
  assert.equal(subscribes, 0);
  assert.equal(storage.get("cheongpa:web-push-preference:a"), "off");
  assert.equal(storage.get("cheongpa:web-push-preference:b"), "off");
  const snapshot = webPush.getPushCoordinatorSnapshot();
  assert.equal(snapshot.authContext.userId, "b");
  assert.equal(snapshot.explicitIntent, null);
});

test("permission prompt cannot survive a same-account auth lifecycle change", async () => {
  const prompt = deferred();
  const storage = new Map([["cheongpa:web-push-preference:a", "off"]]);
  let claims = 0;
  const webPush = await loadWebPush({
    storage,
    requestPermission: async () => {
      const permission = await prompt.promise;
      Notification.permission = permission;
      return permission;
    },
    getSubscription: async () => null,
    subscribe: async () => ({ endpoint: "a", toJSON: () => ({ keys: {} }), unsubscribe: async () => true }),
    rpc: async (name) => {
      if (name === "claim_push_subscription") claims += 1;
      return { error: null };
    },
  });

  const auth = { user: { id: "a" }, profile: { status: "approved" } };
  webPush.setPushAuthContextVersion("a", 1);
  webPush.setPushDesiredAuthContext(auth);
  const enabling = webPush.enablePushNotifications("a");

  webPush.setPushAuthContextVersion("a", 2);
  webPush.setPushDesiredAuthContext(auth);
  prompt.resolve("granted");

  await assert.rejects(enabling, /로그인 상태가 변경/);
  assert.equal(claims, 0);
  assert.equal(storage.get("cheongpa:web-push-preference:a"), "off");
});

test("stale explicit OFF for A is rejected while B is current", async () => {
  const storage = new Map([
    ["cheongpa:web-push-preference:a", "on"],
    ["cheongpa:web-push-preference:b", "off"],
  ]);
  let removals = 0;
  let unsubscribes = 0;
  const subscription = {
    endpoint: "shared",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => { unsubscribes += 1; return true; },
  };
  const webPush = await loadWebPush({
    storage,
    requestPermission: async () => "granted",
    getSubscription: async () => subscription,
    subscribe: async () => subscription,
    rpc: async (name) => {
      if (name === "remove_own_push_subscription") removals += 1;
      return { error: null };
    },
  });

  Notification.permission = "granted";
  webPush.setPushAuthContextVersion("b", 2);
  webPush.setPushDesiredAuthContext({ user: { id: "b" }, profile: { status: "approved" } });

  await assert.rejects(webPush.disablePushNotifications("a"), /로그인 상태가 변경/);
  assert.equal(removals, 0);
  assert.equal(unsubscribes, 0);
  assert.equal(storage.get("cheongpa:web-push-preference:a"), "on");
  assert.equal(storage.get("cheongpa:web-push-preference:b"), "off");
});
