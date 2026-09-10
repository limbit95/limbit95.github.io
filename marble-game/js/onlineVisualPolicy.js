export const ONLINE_VISUAL_REVISION = "20260910-r9";
export const ONLINE_VISUAL_QUERY_KEY = "marbleVisuals";
export const ONLINE_VISUAL_MODES = Object.freeze({
  TWO_D: "2d",
  MAIN: "main",
  FULL: "full",
});

function getSearchParams(locationObject = globalThis.location) {
  const search = typeof locationObject?.search === "string" ? locationObject.search : "";
  return new URLSearchParams(search);
}

export function isOnlineMarbleSession({
  documentObject = globalThis.document,
  locationObject = globalThis.location,
} = {}) {
  if (documentObject?.body?.dataset?.sessionMode === "online") return true;
  return getSearchParams(locationObject).has("onlineRoom");
}

export function resolveOnlineVisualMode({
  documentObject = globalThis.document,
  locationObject = globalThis.location,
} = {}) {
  if (!isOnlineMarbleSession({ documentObject, locationObject })) return ONLINE_VISUAL_MODES.FULL;
  const requested = getSearchParams(locationObject).get(ONLINE_VISUAL_QUERY_KEY);
  return Object.values(ONLINE_VISUAL_MODES).includes(requested)
    ? requested
    : ONLINE_VISUAL_MODES.MAIN;
}

export function shouldStartOnlineMainRenderer(options = {}) {
  return resolveOnlineVisualMode(options) !== ONLINE_VISUAL_MODES.TWO_D;
}

export function shouldStartOwnershipRenderer(options = {}) {
  if (!isOnlineMarbleSession(options)) return true;
  return resolveOnlineVisualMode(options) === ONLINE_VISUAL_MODES.FULL;
}

export function shouldStartOnlineDiceRenderer(options = {}) {
  if (!isOnlineMarbleSession(options)) return true;
  return resolveOnlineVisualMode(options) !== ONLINE_VISUAL_MODES.TWO_D;
}

export function shouldDeferOnlineDiceRenderer(options = {}) {
  return isOnlineMarbleSession(options);
}

export function markOnlineVisualRuntime({
  documentObject = globalThis.document,
  locationObject = globalThis.location,
} = {}) {
  if (!documentObject?.body?.dataset) return resolveOnlineVisualMode({ documentObject, locationObject });
  const mode = resolveOnlineVisualMode({ documentObject, locationObject });
  documentObject.body.dataset.onlineVisualRevision = ONLINE_VISUAL_REVISION;
  documentObject.body.dataset.onlineVisualMode = mode;
  return mode;
}

export function performanceNow(performanceObject = globalThis.performance) {
  return typeof performanceObject?.now === "function" ? performanceObject.now() : Date.now();
}

export function logMarbleRenderStep(step, {
  startedAt = null,
  performanceObject = globalThis.performance,
  consoleObject = globalThis.console,
  details = {},
} = {}) {
  const now = performanceNow(performanceObject);
  const payload = { revision: ONLINE_VISUAL_REVISION, ...details };
  if (Number.isFinite(startedAt)) payload.elapsedMs = Math.round((now - startedAt) * 10) / 10;
  consoleObject?.info?.(`[MarbleRender] ${step}`, payload);
  return now;
}

export function waitForBrowserPaint({ windowObject = globalThis.window } = {}) {
  if (typeof windowObject?.requestAnimationFrame !== "function") return Promise.resolve();
  return new Promise((resolve) => {
    windowObject.requestAnimationFrame(() => {
      windowObject.requestAnimationFrame(resolve);
    });
  });
}
