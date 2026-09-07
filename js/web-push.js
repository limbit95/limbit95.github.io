import { WEB_PUSH_VAPID_PUBLIC_KEY } from "./config.js";
import { supabase } from "./supabaseClient.js";

const SERVICE_WORKER_PATH = "./push-service-worker.js";
const SERVICE_WORKER_SCOPE = "./";

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

async function saveSubscription(subscription, userId) {
  const json = subscription.toJSON();
  const { error } = await supabase.from("push_subscriptions").upsert({
    user_id: userId,
    endpoint: subscription.endpoint,
    p256dh: json.keys?.p256dh,
    auth: json.keys?.auth,
    user_agent: navigator.userAgent || null,
  }, { onConflict: "endpoint" });
  if (error) throw error;
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
  await saveSubscription(subscription, userId);
  return subscription;
}

export async function disablePushNotifications() {
  const subscription = await getCurrentPushSubscription();
  if (!subscription) return false;
  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("endpoint", subscription.endpoint);
  if (error) throw error;
  await subscription.unsubscribe();
  return true;
}
