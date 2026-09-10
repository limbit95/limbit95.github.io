import {
  logMarbleRenderStep,
  markOnlineVisualRuntime,
  performanceNow,
  shouldStartOnlineMainRenderer,
  waitForBrowserPaint,
} from "./onlineVisualPolicy.js?v=20260910-r10";

export const ONLINE_INITIAL_LOAD_TIMEOUT_MS = 12000;

export function withOnlineStartupTimeout(promise, timeoutMs = ONLINE_INITIAL_LOAD_TIMEOUT_MS, {
  windowObject = globalThis.window,
} = {}) {
  if (!windowObject?.setTimeout || !windowObject?.clearTimeout) return promise;

  let timer = null;
  const timeout = new Promise((_, reject) => {
    timer = windowObject.setTimeout(() => reject(new Error("ONLINE_GAME_LOAD_TIMEOUT")), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timer !== null) windowObject.clearTimeout(timer);
  });
}

export async function runOptionalEnhancement(task, {
  timeoutMs = 5000,
  timeoutCode = "OPTIONAL_ENHANCEMENT_TIMEOUT",
  windowObject = globalThis.window,
  documentObject = globalThis.document,
  locationObject = globalThis.location,
  performanceObject = globalThis.performance,
  consoleObject = globalThis.console,
  onReady,
  onFailed,
  onLateReady,
} = {}) {
  let timer = null;
  let timedOut = false;
  const isMainRenderer = timeoutCode === "ONLINE_RENDERER_TIMEOUT";
  const taskPromise = Promise.resolve().then(async () => {
    if (isMainRenderer) {
      const mode = markOnlineVisualRuntime({ documentObject, locationObject });
      if (!shouldStartOnlineMainRenderer({ documentObject, locationObject })) {
        logMarbleRenderStep("main-renderer-disabled", {
          performanceObject,
          consoleObject,
          details: { mode },
        });
        throw new Error("ONLINE_RENDERER_DIAGNOSTIC_DISABLED");
      }

      const paintStartedAt = performanceNow(performanceObject);
      if (documentObject?.body?.dataset) {
        documentObject.body.dataset.onlineRendererGate = "paint-wait";
        documentObject.body.dataset.onlinePaintFrame = "0";
      }
      logMarbleRenderStep("paint-wait-start", {
        performanceObject,
        consoleObject,
        details: { mode },
      });
      await waitForBrowserPaint({
        windowObject,
        onFrame(frame) {
          if (documentObject?.body?.dataset) documentObject.body.dataset.onlinePaintFrame = String(frame);
          logMarbleRenderStep(`paint-frame-${frame}`, {
            performanceObject,
            consoleObject,
            details: { mode },
          });
        },
      });
      if (documentObject?.body?.dataset) {
        documentObject.body.dataset.onlinePaintReady = "true";
        documentObject.body.dataset.onlineRendererGate = "released";
      }
      logMarbleRenderStep("2d-paint-ready", {
        startedAt: paintStartedAt,
        performanceObject,
        consoleObject,
        details: { mode },
      });
      logMarbleRenderStep("renderer-task-dispatch", {
        performanceObject,
        consoleObject,
        details: { mode },
      });

      return task();
    }
    return task();
  });
  const timeout = new Promise((_, reject) => {
    timer = windowObject.setTimeout(() => {
      timedOut = true;
      reject(new Error(timeoutCode));
    }, timeoutMs);
  });
  void taskPromise.then((value) => {
    if (timedOut) onLateReady?.(value);
  }, () => {});
  try {
    const value = await Promise.race([taskPromise, timeout]);
    onReady?.(value);
    return value;
  } catch (error) {
    onFailed?.(error);
    return null;
  } finally {
    if (timer !== null) windowObject.clearTimeout(timer);
  }
}

export function showOnlineModuleLoadError(error, {
  documentObject = globalThis.document,
} = {}) {
  console.error("Marble online game module failed to load", error);
  const playtestSection = documentObject?.querySelector?.("[data-playtest-section]");
  const gameMessage = documentObject?.querySelector?.("[data-game-message]");
  const primaryActionButton = documentObject?.querySelector?.("[data-primary-action]");
  if (playtestSection) playtestSection.hidden = false;
  if (gameMessage) gameMessage.textContent = "온라인 게임 화면을 불러오지 못했습니다. 페이지를 새로고침해 주세요.";
  if (primaryActionButton) primaryActionButton.hidden = true;
}
