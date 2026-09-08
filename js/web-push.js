import { WEB_PUSH_VAPID_PUBLIC_KEY } from "./config.js";
import { supabase } from "./supabaseClient.js";

const SERVICE_WORKER_PATH = "./push-service-worker.js";
const SERVICE_WORKER_SCOPE = "./";
const PUSH_PREFERENCE_PREFIX = "cheongpa:web-push-preference:";
const restorePromises = new Map();
const restoredUserIds = new Set();

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

  const currentRegistration = await registration();
  const existing = await currentRegistration.pushManager.getSubscription();
  const subscription = existing ?? await currentRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey(WEB_PUSH_VAPID_PUBLIC_KEY),
  });
  await saveSubscription(subscription);
  setPushPreference(userId, "on");
  restoredUserIds.add(userId);
  return subscription;
}

export async function disablePushNotifications(userId) {
  const subscription = await getCurrentPushSubscription();
  if (subscription) {
    let removalError = null;
    try {
      const { error } = await supabase.rpc("remove_own_push_subscription", {
        p_endpoint: subscription.endpoint,
      });
      if (error) throw error;
    } catch (error) {
      removalError = error;
    }
    await subscription.unsubscribe();
    if (removalError) throw removalError;
  }
  setPushPreference(userId, "off");
  restoredUserIds.delete(userId);
  return Boolean(subscription);
}

export async function cleanupPushSubscriptionForSignOut(userId) {
  restoredUserIds.delete(userId);
  const subscription = await getCurrentPushSubscription();
  if (!subscription) return false;

  if (getPushPreference(userId) === null) {
    try {
      const state = await getPushNotificationState();
      if (state.owned) setPushPreference(userId, "on");
    } catch (error) {
      console.warn("Legacy push preference could not be migrated during sign-out.", error);
    }
  }

  let removalError = null;
  try {
    const { error } = await supabase.rpc("remove_own_push_subscription", {
      p_endpoint: subscription.endpoint,
    });
    if (error) throw error;
  } catch (error) {
    removalError = error;
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
}

async function restorePushNotifications(auth) {
  const userId = auth?.user?.id;
  if (!userId || auth.profile?.status !== "approved") return null;

  const capability = getPushCapability();
  if (!capability.supported || capability.requiresIosInstall) return null;
  if (capability.permission !== "granted"
    || !WEB_PUSH_VAPID_PUBLIC_KEY
    || WEB_PUSH_VAPID_PUBLIC_KEY.startsWith("YOUR_")) return null;

  let preference = getPushPreference(userId);
  if (preference === null) {
    const legacyState = await getPushNotificationState();
    if (!legacyState.owned) return null;
    setPushPreference(userId, "on");
    restoredUserIds.add(userId);
    return legacyState.subscription;
  }
  if (preference !== "on") return null;

  const currentRegistration = await registration();
  const existing = await currentRegistration.pushManager.getSubscription();
  const subscription = existing ?? await currentRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey(WEB_PUSH_VAPID_PUBLIC_KEY),
  });
  await saveSubscription(subscription);
  restoredUserIds.add(userId);
  return subscription;
}

export function restorePushNotificationsForAuth(auth) {
  const userId = auth?.user?.id;
  if (!userId || restoredUserIds.has(userId)) return Promise.resolve(null);
  if (restorePromises.has(userId)) return restorePromises.get(userId);

  const restorePromise = restorePushNotifications(auth)
    .finally(() => restorePromises.delete(userId));
  restorePromises.set(userId, restorePromise);
  return restorePromise;
}
