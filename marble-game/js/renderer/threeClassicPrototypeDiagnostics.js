import {
  CLASSIC_CAMERA_PROFILE,
  CLASSIC_RENDER_PROFILE,
  CLASSIC_VISUAL_PROFILE,
  THREE_IMPORT_VERSION,
  createClassicThreePrototypeRenderer as createBaseClassicThreePrototypeRenderer,
  createOrthographicBounds,
  createSquareRingLayout,
  getClassicTileVisual,
  resolveClassicRendererPixelRatio,
} from "./threeClassicPrototype.js?implementation=20260911-r9";
import {
  isOnlineMarbleSession,
  logMarbleRenderStep,
  markOnlineVisualRuntime,
  performanceNow,
} from "../onlineVisualPolicy.js?v=20260910-r10";

const CLASSIC_SHADOW_POLICY = Symbol.for("marble.classic.shadow-policy");

export {
  CLASSIC_CAMERA_PROFILE,
  CLASSIC_RENDER_PROFILE,
  CLASSIC_VISUAL_PROFILE,
  THREE_IMPORT_VERSION,
  createOrthographicBounds,
  createSquareRingLayout,
  getClassicTileVisual,
  resolveClassicRendererPixelRatio,
};

export function installClassicShadowUpdatePolicy(threeModule) {
  const prototype = threeModule?.WebGLRenderer?.prototype;
  if (!prototype || typeof prototype.render !== "function") return false;
  if (prototype[CLASSIC_SHADOW_POLICY]) return true;

  const render = prototype.render;
  Object.defineProperty(prototype, CLASSIC_SHADOW_POLICY, {
    configurable: false,
    enumerable: false,
    value: true,
    writable: false,
  });

  prototype.render = function renderClassicScene(...args) {
    const canvas = this.domElement;
    const classicCanvas = canvas?.classList?.contains?.("classic-three-canvas") === true;

    if (classicCanvas && this.shadowMap) {
      const refreshRequested = canvas?.dataset?.marbleShadowRefresh === "true";
      if (this.shadowMap.autoUpdate !== false) {
        this.shadowMap.autoUpdate = false;
        this.shadowMap.needsUpdate = true;
      } else if (refreshRequested) {
        this.shadowMap.needsUpdate = true;
      }
      if (refreshRequested && canvas?.dataset) delete canvas.dataset.marbleShadowRefresh;
    }

    return render.apply(this, args);
  };

  return true;
}

function requestClassicShadowRefresh(targetElement) {
  const canvas = targetElement?.querySelector?.(".classic-three-canvas");
  if (canvas?.dataset) canvas.dataset.marbleShadowRefresh = "true";
}

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
  let mountedTarget = null;

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
      mountedTarget = targetElement;

      if (!traceOnlineRenderer) {
        installClassicShadowUpdatePolicy(await loadThree());
        const value = await renderer.mount(targetElement);
        requestClassicShadowRefresh(mountedTarget);
        return value;
      }

      const mountStartedAt = performanceNow(performanceObject);
      logMarbleRenderStep("mount-start", { performanceObject, consoleObject });

      const importStartedAt = performanceNow(performanceObject);
      const threeModule = await loadThree();
      installClassicShadowUpdatePolicy(threeModule);
      logMarbleRenderStep("three-import-ready", {
        startedAt: importStartedAt,
        performanceObject,
        consoleObject,
      });

      try {
        const webglStartedAt = performanceNow(performanceObject);
        const value = await renderer.mount(targetElement);
        requestClassicShadowRefresh(mountedTarget);
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
      if (!traceOnlineRenderer || initialRenderComplete) {
        const value = renderer.renderState(state);
        requestClassicShadowRefresh(mountedTarget);
        return value;
      }

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
        requestClassicShadowRefresh(mountedTarget);
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

    async playEvent(event) {
      const value = await renderer.playEvent(event);
      requestClassicShadowRefresh(mountedTarget);
      return value;
    },

    dispose() {
      mountedTarget = null;
      renderer.dispose();
    },
  });
}
