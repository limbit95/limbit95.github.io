let deferredInstallPrompt = null;
let installedInSession = false;

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

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    installedInSession = true;
  });
}
