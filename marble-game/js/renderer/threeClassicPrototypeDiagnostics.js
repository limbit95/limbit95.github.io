import {
  CLASSIC_CAMERA_PROFILE,
  CLASSIC_VISUAL_PROFILE,
  THREE_IMPORT_VERSION,
  createClassicThreePrototypeRenderer as createBaseClassicThreePrototypeRenderer,
  createOrthographicBounds,
  createSquareRingLayout,
  getClassicTileVisual,
} from "./threeClassicPrototype.js?implementation=20260910-r8";
import {
  isOnlineMarbleSession,
  logMarbleRenderStep,
  markOnlineVisualRuntime,
  performanceNow,
} from "../onlineVisualPolicy.js?v=20260910-r10";

export {
  CLASSIC_CAMERA_PROFILE,
  CLASSIC_VISUAL_PROFILE,
  THREE_IMPORT_VERSION,
  createOrthographicBounds,
  createSquareRingLayout,
  getClassicTileVisual,
};

export function createClassicThreePrototypeRenderer(options = {}, {
  documentObject = globalThis.document,
  locationObject = globalThis.location,
  windowObject = globalThis.window,
  performanceObject = globalThis.performance,
  consoleObject = globalThis.console,
  loadThree = () => import("three"),
  createBaseRenderer = createBaseClassicThreePrototypeRenderer,
} = {}) {
  const factoryStartedAt = performanceNow(performanceObject);
  const renderer = createBaseRenderer(options);
  const traceOnlineRenderer = isOnlineMarbleSession({ documentObject, locationObject });
  let initialRenderComplete = false;

  if (traceOnlineRenderer) {
    markOnlineVisualRuntime({ documentObject, locationObject });
    logMarbleRenderStep("renderer-created", {
      startedAt: factoryStartedAt,
      performanceObject,
      consoleObject,
    });
  }

  return Object.freeze({
    async mount(targetElement) {
      if (!traceOnlineRenderer) return renderer.mount(targetElement);

      const mountStartedAt = performanceNow(performanceObject);
      logMarbleRenderStep("mount-start", { performanceObject, consoleObject });

      const importStartedAt = performanceNow(performanceObject);
      await loadThree();
      logMarbleRenderStep("three-import-ready", {
        startedAt: importStartedAt,
        performanceObject,
        consoleObject,
      });

      try {
        const webglStartedAt = performanceNow(performanceObject);
        const value = await renderer.mount(targetElement);
        logMarbleRenderStep("webgl-ready", {
          startedAt: webglStartedAt,
          performanceObject,
          consoleObject,
        });
        logMarbleRenderStep("mount-ready", {
          startedAt: mountStartedAt,
          performanceObject,
          consoleObject,
        });
        return value;
      } catch (error) {
        logMarbleRenderStep("mount-failed", {
          startedAt: mountStartedAt,
          performanceObject,
          consoleObject,
          details: { message: String(error?.message ?? error ?? "") },
        });
        throw error;
      }
    },

    renderState(state) {
      if (!traceOnlineRenderer || initialRenderComplete) return renderer.renderState(state);

      const renderStartedAt = performanceNow(performanceObject);
      logMarbleRenderStep("render-state-start", {
        performanceObject,
        consoleObject,
        details: { initial: true },
      });
      logMarbleRenderStep("build-board-start", {
        performanceObject,
        consoleObject,
        details: { initial: true },
      });

      try {
        const value = renderer.renderState(state);
        const finishedAt = logMarbleRenderStep("build-board-ready", {
          startedAt: renderStartedAt,
          performanceObject,
          consoleObject,
          details: { initial: true, includes: "buildBoard+initial-state-sync" },
        });
        logMarbleRenderStep("render-state-ready", {
          startedAt: renderStartedAt,
          performanceObject,
          consoleObject,
          details: { initial: true },
        });
        if (documentObject?.body?.dataset) {
          documentObject.body.dataset.onlineInitialRenderMs = String(
            Math.round((finishedAt - renderStartedAt) * 10) / 10,
          );
        }
        windowObject?.requestAnimationFrame?.(() => {
          logMarbleRenderStep("first-frame-ready", {
            startedAt: renderStartedAt,
            performanceObject,
            consoleObject,
            details: { initial: true },
          });
        });
        initialRenderComplete = true;
        return value;
      } catch (error) {
        logMarbleRenderStep("render-state-failed", {
          startedAt: renderStartedAt,
          performanceObject,
          consoleObject,
          details: { initial: true, message: String(error?.message ?? error ?? "") },
        });
        throw error;
      }
    },

    playEvent: renderer.playEvent.bind(renderer),
    dispose: renderer.dispose.bind(renderer),
  });
}
