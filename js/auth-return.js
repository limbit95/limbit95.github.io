const STORAGE_KEY = "community:return-target";

export function sanitizeReturnTarget(value) {
  if (!value || typeof value !== "string") return null;
  try {
    const url = new URL(value, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    const target = `${url.pathname}${url.search}${url.hash}`;
    if (!target.startsWith("/") || target.includes("\0")) return null;
    if (url.hash.startsWith("#/login")) return null;
    return target;
  } catch {
    return null;
  }
}

export function currentReturnTarget() {
  return sanitizeReturnTarget(`${window.location.pathname}${window.location.search}${window.location.hash}`);
}

export function rememberReturnTarget(value) {
  const target = sanitizeReturnTarget(value);
  if (!target) return null;
  window.sessionStorage.setItem(STORAGE_KEY, target);
  return target;
}

export function peekReturnTarget() {
  return sanitizeReturnTarget(window.sessionStorage.getItem(STORAGE_KEY));
}

export function clearReturnTarget() {
  window.sessionStorage.removeItem(STORAGE_KEY);
}

export function buildLoginHref(value = currentReturnTarget()) {
  const target = sanitizeReturnTarget(value);
  const suffix = target ? `?returnTo=${encodeURIComponent(target)}` : "";
  return `${window.location.origin}/#/login${suffix}`;
}

export function redirectToReturnTarget(value = peekReturnTarget()) {
  const target = sanitizeReturnTarget(value);
  if (!target) return false;
  clearReturnTarget();
  window.location.replace(new URL(target, window.location.origin).href);
  return true;
}

function captureLoginQuery() {
  const raw = window.location.hash.replace(/^#/, "");
  const [path, query = ""] = raw.split("?");
  if (path !== "/login") return;
  const target = new URLSearchParams(query).get("returnTo");
  if (target) rememberReturnTarget(target);
}

captureLoginQuery();
window.addEventListener("hashchange", captureLoginQuery);
window.addEventListener("app:auth-changed", (event) => {
  if (event.detail?.event !== "SIGNED_IN" || !peekReturnTarget()) return;
  event.stopImmediatePropagation();
  redirectToReturnTarget();
});
