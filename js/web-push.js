import {
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_URL,
  WEB_PUSH_VAPID_PUBLIC_KEY,
} from "./config.js";
import { supabase } from "./supabaseClient.js";

const SERVICE_WORKER_PATH = "./push-service-worker.js";
const SERVICE_WORKER_SCOPE = "./";
const PUSH_PREFERENCE_PREFIX = "cheongpa:web-push-preference:";
const restorePromises = new Map();
const restoredUserIds = new Set();
const inFlightRestoreClaims = new Map();
const authContextVersions = new Map();
let pushMutationQueue = Promise.resolve();
// Authority order: current auth lifecycle, latest explicit intent, persisted
// preference, then observed browser/DB state. Observed state never becomes the
// desired state except for the guarded one-time legacy migration.
let desiredPushState = { revision: 0, userId: null, contextVersion: null, preference: "off" };

// Device state is shared by every account.  All subscription/ownership writes
// therefore pass through this queue; a rejected operation must not poison it.
function enqueuePushMutation(operation) {
  const result = pushMutationQueue.then(operation, operation);
  pushMutationQueue = result.catch(() => {});
  return result;
}

function updateDesiredPushState(userId, preference) {
  desiredPushState = {
    revision: desiredPushState.revision + 1,
    userId: userId ?? null,
    contextVersion: userId ? authContextVersions.get(userId) : null,
    preference,
  };
  return desiredPushState;
}

function isDesired(snapshot) {
  return desiredPushState.revision === snapshot.revision
    && desiredPushState.userId === snapshot.userId
    && desiredPushState.contextVersion === snapshot.contextVersion
    && desiredPushState.preference === snapshot.preference;
}

function preferenceKey(userId) {
  return `${PUSH_PREFERENCE_PREFIX}${userId}`;
}

export function getPushPreference(userId) {
  if (!userId) return null;
  try {
    const value = window.localStorage.getItem(preferenceKey(userId));
    return value === "on" || value === "off" ? value : null;
  } catch (error) {
    console.warn("Push preference could not be read.", error);
    return null;
  }
}

function setPushPreference(userId, value) {
  if (!userId) return false;
  try {
    window.localStorage.setItem(preferenceKey(userId), value);
    return true;
  } catch (error) {
    console.warn("Push preference could not be saved.", error);
    return false;
  }
}

export function setPushAuthContextVersion(userId, version) {
  if (!userId) return;
  if (version === null || version === undefined) {
    authContextVersions.delete(userId);
    return;
  }
  authContextVersions.set(userId, version);
}

function applicationServerKey(value) {
  const padding = "=".repeat((4 - value.length % 4) % 4);
  const base64 = (value + padding).replaceAll("-", "+").replaceAll("_", "/");
  const bytes = atob(base64);
  return Uint8Array.from(bytes, (character) => character.charCodeAt(0));
}

export function getPushCapability() {
  const supported = typeof window !== "undefined"
    && "serviceWorker" in navigator
    && "PushManager" in window
    && "Notification" in window;
  const ios = supported && /iPad|iPhone|iPod/.test(navigator.userAgent)
    && !window.MSStream;
  const standalone = !ios
    || window.matchMedia("(display-mode: standalone)").matches
    || navigator.standalone === true;
  return {
    supported,
    permission: supported ? Notification.permission : "unsupported",
    requiresIosInstall: ios && !standalone,
  };
}

async function registration() {
  return navigator.serviceWorker.register(SERVICE_WORKER_PATH, { scope: SERVICE_WORKER_SCOPE });
}

export async function getCurrentPushSubscription() {
  const capability = getPushCapability();
  if (!capability.supported || capability.requiresIosInstall) return null;
  const currentRegistration = await registration();
  return currentRegistration.pushManager.getSubscription();
}

async function saveSubscription(subscription) {
  const json = subscription.toJSON();
  const { error } = await supabase.rpc("claim_push_subscription", {
    p_endpoint: subscription.endpoint,
    p_p256dh: json.keys?.p256dh,
    p_auth: json.keys?.auth,
    p_user_agent: navigator.userAgent || null,
  });
  if (error) throw error;
}

async function removeSubscriptionWithAccessToken(subscription, accessToken) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/remove_own_push_subscription`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_endpoint: subscription.endpoint }),
  });
  if (!response.ok) throw new Error(`Push subscription cleanup failed (${response.status}).`);
}

function trackRestoreClaim(userId, claimPromise) {
  const claims = inFlightRestoreClaims.get(userId) ?? new Set();
  claims.add(claimPromise);
  inFlightRestoreClaims.set(userId, claims);
  const untrack = () => {
    claims.delete(claimPromise);
    if (!claims.size) inFlightRestoreClaims.delete(userId);
  };
  claimPromise.then(untrack, untrack);
}

export async function waitForPushRestoreClaims(userId, timeoutMs = 3000) {
  const claims = inFlightRestoreClaims.get(userId);
  if (!claims?.size) return true;
  let timeoutId;
  const completed = await Promise.race([
    Promise.allSettled([...claims]).then(() => true),
    new Promise((resolve) => {
      timeoutId = setTimeout(() => resolve(false), timeoutMs);
    }),
  ]);
  if (timeoutId) clearTimeout(timeoutId);
  return completed;
}

export async function getPushNotificationState() {
  const subscription = await getCurrentPushSubscription();
  if (!subscription) return { subscription: null, owned: false };
  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("endpoint")
    .eq("endpoint", subscription.endpoint)
    .maybeSingle();
  if (error) throw error;
  return { subscription, owned: data?.endpoint === subscription.endpoint };
}

export async function enablePushNotifications(userId) {
  const capability = getPushCapability();
  if (!capability.supported) throw new Error("이 브라우저는 푸시 알림을 지원하지 않습니다.");
  if (capability.requiresIosInstall) throw new Error("iPhone에서는 청파 같이를 홈 화면에 추가한 뒤 푸시 알림을 사용할 수 있습니다.");
  if (capability.permission === "denied") throw new Error("브라우저 설정에서 청파 같이의 알림 권한을 허용해 주세요.");
  if (!WEB_PUSH_VAPID_PUBLIC_KEY || WEB_PUSH_VAPID_PUBLIC_KEY.startsWith("YOUR_")) {
    throw new Error("푸시 알림 서버 설정이 아직 완료되지 않았습니다.");
  }

  const permission = capability.permission === "granted"
    ? "granted"
    : await Notification.requestPermission();
  if (permission !== "granted") throw new Error("알림 권한이 허용되지 않았습니다.");

  const desired = updateDesiredPushState(userId, "on");
  return enqueuePushMutation(async () => {
    if (!isDesired(desired)) return null;
    const currentRegistration = await registration();
    const existing = await currentRegistration.pushManager.getSubscription();
    const subscription = existing ?? await currentRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey(WEB_PUSH_VAPID_PUBLIC_KEY),
    });
    await saveSubscription(subscription);
    if (isDesired(desired)) {
      setPushPreference(userId, "on");
      restoredUserIds.add(userId);
    }
    return isDesired(desired) ? subscription : null;
  });
}

export async function disablePushNotifications(userId) {
  const desired = updateDesiredPushState(userId, "off");
  return enqueuePushMutation(async () => {
    if (!isDesired(desired)) return false;
    const subscription = await getCurrentPushSubscription();
    if (subscription) {
      const { error } = await supabase.rpc("remove_own_push_subscription", {
        p_endpoint: subscription.endpoint,
      });
      if (error) throw error;
      // A newer ON waits behind this operation.  Do not unsubscribe the shared
      // device endpoint when that is now the authoritative desired state.
      if (isDesired(desired)) await subscription.unsubscribe();
    }
    if (isDesired(desired)) {
      setPushPreference(userId, "off");
      restoredUserIds.delete(userId);
    }
    return Boolean(subscription) && isDesired(desired);
  });
}

export async function cleanupPushSubscriptionForSignOut(userId, {
  accessToken = null,
  isActive = () => true,
} = {}) {
  const desired = updateDesiredPushState(null, "off");
  restoredUserIds.delete(userId);
  return enqueuePushMutation(async () => {
    const subscription = await getCurrentPushSubscription();
    if (!subscription || !isActive()) return false;

    if (getPushPreference(userId) === null) {
      try {
        const state = await getPushNotificationState();
        if (isActive() && state.owned) setPushPreference(userId, "on");
      } catch (error) {
        console.warn("Legacy push preference could not be migrated during sign-out.", error);
      }
    }
    if (!isActive()) return false;

    let removalError = null;
    try {
      if (accessToken) {
        await removeSubscriptionWithAccessToken(subscription, accessToken);
      } else {
        const { error } = await supabase.rpc("remove_own_push_subscription", {
          p_endpoint: subscription.endpoint,
        });
        if (error) throw error;
      }
    } catch (error) {
      removalError = error;
    }

    if (!isActive() || !isDesired(desired)) {
      if (removalError) throw removalError;
      return true;
    }

    let unsubscribeError = null;
    try {
      await subscription.unsubscribe();
    } catch (error) {
      unsubscribeError = error;
    }
    if (removalError) throw removalError;
    if (unsubscribeError) throw unsubscribeError;
    return true;
  });
}

async function restorePushNotifications(auth, { isCurrent, getCurrentUserId }) {
  const userId = auth?.user?.id;
  if (!userId || auth.profile?.status !== "approved" || !isCurrent()) return null;

  const capability = getPushCapability();
  if (!capability.supported || capability.requiresIosInstall) return null;
  if (capability.permission !== "granted"
    || !WEB_PUSH_VAPID_PUBLIC_KEY
    || WEB_PUSH_VAPID_PUBLIC_KEY.startsWith("YOUR_")) return null;

  const requestRevision = desiredPushState.revision;
  let preference = getPushPreference(userId);
  if (!isCurrent()) return null;
  if (preference === null) {
    const legacyState = await getPushNotificationState();
    if (!isCurrent() || desiredPushState.revision !== requestRevision || !legacyState.owned) return null;
    preference = "on";
  }
  if (preference !== "on") return null;
  const desired = updateDesiredPushState(userId, "on");
  return enqueuePushMutation(async () => {
    if (!isCurrent() || !isDesired(desired)) return null;
    const currentRegistration = await registration();
    const existing = await currentRegistration.pushManager.getSubscription();
    const subscription = existing ?? await currentRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey(WEB_PUSH_VAPID_PUBLIC_KEY),
    });
    const claimPromise = saveSubscription(subscription);
    trackRestoreClaim(userId, claimPromise);
    await claimPromise;
    // Stale work never compensates destructively. A queued newer intent is the
    // only operation allowed to decide the endpoint's eventual state.
    if (!isCurrent() || !isDesired(desired)) return null;
    setPushPreference(userId, "on");
    restoredUserIds.add(userId);
    return subscription;
  });
}

export function restorePushNotificationsForAuth(auth, {
  isCurrent = () => true,
  getCurrentUserId = () => auth?.user?.id,
} = {}) {
  const userId = auth?.user?.id;
  if (!userId || !isCurrent() || restoredUserIds.has(userId)) return Promise.resolve(null);
  const pendingRestore = restorePromises.get(userId);
  if (pendingRestore?.isCurrent()) return pendingRestore.promise;

  const restorePromise = restorePushNotifications(auth, { isCurrent, getCurrentUserId })
    .finally(() => {
      if (restorePromises.get(userId)?.promise === restorePromise) restorePromises.delete(userId);
    });
  restorePromises.set(userId, { promise: restorePromise, isCurrent });
  return restorePromise;
}
