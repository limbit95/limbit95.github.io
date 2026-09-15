import { resolveRoute } from "./router.js";

let deferredInstallPrompt = null;
let installedInSession = false;
let serviceWorkerRefreshPromise = null;
let lastServiceWorkerRefreshAt = 0;

const SERVICE_WORKER_REFRESH_MIN_INTERVAL_MS = 60_000;
const PUSH_NOTIFICATION_OPEN_MESSAGE = "push-notification-open";

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

async function refreshRegisteredServiceWorker() {
  if (typeof navigator === "undefined"
    || !("serviceWorker" in navigator)
    || navigator.onLine === false) return false;
  if (serviceWorkerRefreshPromise) return serviceWorkerRefreshPromise;

  const now = Date.now();
  if (now - lastServiceWorkerRefreshAt < SERVICE_WORKER_REFRESH_MIN_INTERVAL_MS) return false;
  lastServiceWorkerRefreshAt = now;

  serviceWorkerRefreshPromise = (async () => {
    const registration = await navigator.serviceWorker.getRegistration("./");
    if (!registration) return false;
    await registration.update();
    return true;
  })()
    .catch((error) => {
      console.warn("Push service worker refresh failed after app resume.", error);
      return false;
    })
    .finally(() => {
      serviceWorkerRefreshPromise = null;
    });

  return serviceWorkerRefreshPromise;
}

function openPushNotificationTarget(targetPath) {
  if (typeof targetPath !== "string" || !targetPath.startsWith("#/")) return;
  if (window.location.hash === targetPath) {
    void resolveRoute();
    return;
  }
  window.location.hash = targetPath;
}

if (typeof window !== "undefined") {
  let refreshPushOnboarding = () => {};
  const scheduleServiceWorkerRefresh = () => {
    void refreshRegisteredServiceWorker();
  };

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    refreshPushOnboarding();
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    installedInSession = true;
    refreshPushOnboarding();
  });

  window.addEventListener("focus", scheduleServiceWorkerRefresh);
  window.addEventListener("online", scheduleServiceWorkerRefresh);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") scheduleServiceWorkerRefresh();
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type !== PUSH_NOTIFICATION_OPEN_MESSAGE) return;
      openPushNotificationTarget(event.data.target_path);
    });
  }

  void import("./push-onboarding.js")
    .then(({ initializePushOnboarding }) => {
      refreshPushOnboarding = initializePushOnboarding({
        getAppInstallMode,
        promptAppInstall,
      });
    })
    .catch((error) => {
      console.warn("Push onboarding could not be initialized.", error);
    });
}
