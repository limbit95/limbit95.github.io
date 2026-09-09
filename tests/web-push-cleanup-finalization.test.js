import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function eventually(assertion, timeoutMs = 500) {
  const deadline = Date.now() + timeoutMs;
  while (true) {
    try {
      assertion();
      return;
    } catch (error) {
      if (Date.now() >= deadline) throw error;
      await delay(5);
    }
  }
}

function defineGlobal(name, value) {
  Object.defineProperty(globalThis, name, {
    value,
    configurable: true,
    writable: true,
  });
}

async function loadWebPush({ getSubscription, subscribe, rpc, fetch, storage }) {
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
  defineGlobal("Notification", { permission: "default" });
  defineGlobal("navigator", {
    userAgent: "test",
    serviceWorker: {
      register: async () => ({ pushManager: { getSubscription, subscribe } }),
    },
  });
  defineGlobal("__webPushSupabase", { rpc });
  defineGlobal("fetch", fetch);
  defineGlobal("__WEB_PUSH_MUTATION_TIMEOUT_MS", 30);
  defineGlobal("__WEB_PUSH_RECONCILE_RETRY_BASE_MS", 1);

  return import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}#${Math.random()}`);
}

test("successful previous-account cleanup finalizes even when another cleanup fails", async () => {
  const storage = new Map([
    ["cheongpa:web-push-preference:a", "off"],
    ["cheongpa:web-push-preference:b", "off"],
    ["cheongpa:web-push-preference:c", "off"],
  ]);
  const attempts = [];
  const subscription = {
    endpoint: "shared-cleanup",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => true,
  };
  const webPush = await loadWebPush({
    storage,
    getSubscription: async () => subscription,
    subscribe: async () => subscription,
    rpc: async () => ({ error: null }),
    fetch: async (_url, options) => {
      const authorization = options.headers.Authorization;
      attempts.push(authorization);
      if (authorization === "Bearer token-b") return { ok: false, status: 503 };
      return { ok: true, status: 204 };
    },
  });

  webPush.setPushDesiredAuthContext({ user: { id: "a" }, profile: { status: "approved" } });
  webPush.setPushDesiredAuthContext(
    { user: { id: "b" }, profile: { status: "approved" } },
    { previousAccessToken: "token-a" },
  );
  webPush.setPushDesiredAuthContext(
    { user: { id: "c" }, profile: { status: "approved" } },
    { previousAccessToken: "token-b" },
  );

  await eventually(() => {
    assert.deepEqual(webPush.getPushCoordinatorSnapshot().pendingCleanupUserIds, ["b"]);
    assert.equal(webPush.getPushCoordinatorSnapshot().reconcileRetryCount, 2);
  });

  assert.equal(
    attempts.filter((value) => value === "Bearer token-a").length,
    1,
    "successful cleanup must not be retried because another account failed",
  );
  assert.equal(
    attempts.filter((value) => value === "Bearer token-b").length,
    3,
    "only the failed cleanup should consume the bounded retry budget",
  );
});
