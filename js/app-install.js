let deferredInstallPrompt = null;
let installedInSession = false;
let pushResumeReconcilePromise = null;
let lastPushResumeReconcileAt = 0;

const PUSH_RESUME_RECONCILE_MIN_INTERVAL_MS = 60_000;

export function resolveAppInstallMode({
  userAgent = "",
  platform = "",
  maxTouchPoints = 0,
  standalone = false,
  canPrompt = false,
} = {}) {
  if (standalone) return "installed";
  if (canPrompt) return "prompt";

  const ios = /iPad|iPhone|iPod/i.test(userAgent)
    || (platform === "MacIntel" && Number(maxTouchPoints) > 1);
  if (ios) return "ios-guide";
  if (/Android/i.test(userAgent)) return "android-guide";
  return "unsupported";
}

function isStandaloneDisplayMode() {
  if (installedInSession) return true;
  return window.matchMedia?.("(display-mode: standalone)").matches === true
    || window.navigator.standalone === true;
}

export function getAppInstallMode() {
  if (typeof window === "undefined" || typeof navigator === "undefined") return "unsupported";
  return resolveAppInstallMode({
    userAgent: navigator.userAgent ?? "",
    platform: navigator.platform ?? "",
    maxTouchPoints: navigator.maxTouchPoints ?? 0,
    standalone: isStandaloneDisplayMode(),
    canPrompt: Boolean(deferredInstallPrompt),
  });
}

export async function promptAppInstall() {
  const promptEvent = deferredInstallPrompt;
  if (!promptEvent) return "unavailable";

  deferredInstallPrompt = null;
  await promptEvent.prompt();
  const choice = await promptEvent.userChoice;
  if (choice?.outcome === "accepted") installedInSession = true;
  return choice?.outcome ?? "dismissed";
}

async function reconcilePushAfterResume() {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return false;
  if (pushResumeReconcilePromise) return pushResumeReconcilePromise;

  pushResumeReconcilePromise = (async () => {
    const [{ getAuthState }, { getPushPreference, setPushDesiredAuthContext }] = await Promise.all([
      import("./auth.js"),
      import("./web-push.js"),
    ]);
    const auth = getAuthState();
    const userId = auth.user?.id;
    if (!userId || auth.profile?.status !== "approved") return false;
    if (getPushPreference(userId) !== "on") return false;

    const now = Date.now();
    if (now - lastPushResumeReconcileAt < PUSH_RESUME_RECONCILE_MIN_INTERVAL_MS) return false;
    lastPushResumeReconcileAt = now;

    // Reuse the existing coordinator. It never requests permission here; it
    // only repairs/reclaims this device's subscription when permission is
    // already granted and the user explicitly enabled Push on this device.
    setPushDesiredAuthContext(auth);
    return true;
  })()
    .catch((error) => {
      console.warn("Push subscription reconcile failed after app resume.", error);
      return false;
    })
    .finally(() => {
      pushResumeReconcilePromise = null;
    });

  return pushResumeReconcilePromise;
}

if (typeof window !== "undefined") {
  const schedulePushResumeReconcile = () => {
    void reconcilePushAfterResume();
  };

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    installedInSession = true;
  });

  window.addEventListener("focus", schedulePushResumeReconcile);
  window.addEventListener("online", schedulePushResumeReconcile);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") schedulePushResumeReconcile();
  });
}
