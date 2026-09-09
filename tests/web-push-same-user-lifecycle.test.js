import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

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

test("same-account relogin keeps an older stale restore from deleting the newer context", async () => {
  const firstClaimGate = deferred();
  const firstClaimStarted = deferred();
  let generation = 1;
  let getSubscriptionCalls = 0;
  let claims = 0;
  let removals = 0;
  let unsubscribes = 0;
  const subscription = {
    endpoint: "same-a",
    toJSON: () => ({ keys: {} }),
    unsubscribe: async () => { unsubscribes += 1; },
  };
  const webPush = await loadWebPush({
    getSubscription: async () => {
      getSubscriptionCalls += 1;
      return getSubscriptionCalls === 1 ? null : subscription;
    },
    subscribe: async () => subscription,
    rpc: async () => {
      claims += 1;
      if (claims === 1) {
        firstClaimStarted.resolve();
        await firstClaimGate.promise;
      }
      return { error: null };
    },
    fetch: async () => {
      removals += 1;
      return { ok: true, status: 204 };
    },
  });

  const auth = {
    session: { access_token: "token-a" },
    user: { id: "a" },
    profile: { status: "approved" },
  };
  webPush.setPushAuthContextVersion("a", 1);
  const staleRestore = webPush.restorePushNotificationsForAuth(auth, {
    isCurrent: () => generation === 1,
    getCurrentUserId: () => "a",
  });
  await firstClaimStarted.promise;

  generation = 2;
  webPush.setPushAuthContextVersion("a", 2);
  const currentRestore = webPush.restorePushNotificationsForAuth(auth, {
    isCurrent: () => generation === 2,
    getCurrentUserId: () => "a",
  });
  assert.equal(await currentRestore, subscription);

  firstClaimGate.resolve();
  assert.equal(await staleRestore, null);
  assert.equal(claims, 2);
  assert.equal(removals, 0);
  assert.equal(unsubscribes, 0);
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
