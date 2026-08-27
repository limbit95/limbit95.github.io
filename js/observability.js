import { insertClientErrorLog } from "./api/observability.js";

const ALLOWED_KINDS = new Set(["runtime", "unhandled", "page", "api"]);
const recentFingerprints = new Map();
const DEDUPE_MS = 60_000;
let currentUserId = null;
let approved = false;
let listenersInstalled = false;

export function setObservabilityIdentity(auth) {
  currentUserId = auth?.user?.id ?? null;
  approved = Boolean(currentUserId && auth?.profile?.status === "approved");
}

export function installGlobalErrorObservers() {
  if (listenersInstalled) return;
  listenersInstalled = true;

  window.addEventListener("error", (event) => {
    void reportClientError(event.error ?? event.message, {
      kind: "runtime",
      context: {
        source: fileLabel(event.filename),
        line: event.lineno,
        column: event.colno,
      },
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    void reportClientError(event.reason, { kind: "unhandled" });
  });
}

export async function reportClientError(error, { kind = "runtime", route, context = {} } = {}) {
  if (!approved || !currentUserId) return false;

  const errorKind = ALLOWED_KINDS.has(kind) ? kind : "runtime";
  const message = errorMessage(error).slice(0, 500);
  if (!message) return false;
  const safeRoute = String(route ?? currentRoute()).slice(0, 300) || "/";
  const safeContext = sanitizeContext({
    ...context,
    code: error?.code ?? context?.code,
    online: navigator.onLine,
  });

  const fingerprint = `${errorKind}|${safeRoute}|${message}`;
  const now = Date.now();
  const previous = recentFingerprints.get(fingerprint) ?? 0;
  if (now - previous < DEDUPE_MS) return false;
  recentFingerprints.set(fingerprint, now);
  pruneFingerprints(now);

  try {
    const result = await insertClientErrorLog({
      userId: currentUserId,
      errorKind,
      message,
      route: safeRoute,
      context: safeContext,
    });
    return !result.error;
  } catch {
    return false;
  }
}

function errorMessage(error) {
  if (error instanceof Error) return error.message || error.name;
  if (error && typeof error === "object" && typeof error.message === "string") return error.message;
  return String(error ?? "Unknown client error");
}

function currentRoute() {
  const raw = window.location.hash.replace(/^#/, "").split("?")[0];
  return raw || "/";
}

function fileLabel(value) {
  if (!value) return "";
  try {
    return new URL(value, window.location.href).pathname.split("/").pop() ?? "";
  } catch {
    return String(value).split("/").pop() ?? "";
  }
}

function sanitizeContext(context) {
  const safe = {};
  for (const [rawKey, rawValue] of Object.entries(context ?? {}).slice(0, 12)) {
    const key = String(rawKey).replace(/[^A-Za-z0-9_.-]/g, "_").slice(0, 40);
    if (!key || rawValue === undefined || rawValue === null) continue;
    if (["string", "number", "boolean"].includes(typeof rawValue)) {
      safe[key] = typeof rawValue === "string" ? rawValue.slice(0, 200) : rawValue;
    }
  }
  return safe;
}

function pruneFingerprints(now) {
  for (const [key, timestamp] of recentFingerprints) {
    if (now - timestamp > DEDUPE_MS * 2) recentFingerprints.delete(key);
  }
}
