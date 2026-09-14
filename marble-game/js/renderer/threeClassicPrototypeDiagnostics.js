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
import {
  createAnimationDirector,
  getSharedAnimationQueue,
} from "../presentation/presentationFoundation.js?v=20260912-r13";
import {
  MARBLE_RENDER_RUNTIME_PROFILE,
  isMarbleOverlayMotionActive,
  shouldRenderMarbleFrame,
} from "../presentation/renderRuntimePolicy.js?v=20260914-r2";

const CLASSIC_RENDER_POLICY = Symbol.for("marble.classic.render-policy.v2");
const CLASSIC_PIXEL_RATIO_POLICY = Symbol.for("marble.classic.pixel-ratio-policy");
const CLASSIC_LAST_RENDERED_AT = new WeakMap();
const MARBLE_REQUESTED_PIXEL_RATIO = new WeakMap();
const MARBLE_RENDERER_BY_CANVAS = new WeakMap();
const MARBLE_PIXEL_RATIO_APPLYING = new WeakSet();

export const CLASSIC_RUNTIME_RENDER_PROFILE = Object.freeze({
  maxRenderPixels: 1_800_000,
  motionMaxRenderPixels: 1_100_000,
});

export const DICE_RUNTIME_RENDER_PROFILE = Object.freeze({
  maxRenderPixels: 1_100_000,
});

export {
  CLASSIC_CAMERA_PROFILE,
  CLASSIC_RENDER_PROFILE,
  CLASSIC_VISUAL_PROFILE,
  MARBLE_RENDER_RUNTIME_PROFILE,
  THREE_IMPORT_VERSION,
  createOrthographicBounds,
  createSquareRingLayout,
  getClassicTileVisual,
  resolveClassicRendererPixelRatio,
};

function resolvePixelBudgetRatio(requestedRatio, width, height, maxRenderPixels) {
  const requested = Number(requestedRatio);
  const safeRequested = Number.isFinite(requested) && requested > 0 ? requested : 1;
  const safeWidth = Math.max(1, Number(width) || 1);
  const safeHeight = Math.max(1, Number(height) || 1);
  const budgetRatio = Math.sqrt(maxRenderPixels / (safeWidth * safeHeight));
  return Math.min(safeRequested, budgetRatio);
}

export function resolveClassicRuntimePixelRatio(requestedRatio, width, height, {
  motionActive = false,
} = {}) {
  return resolvePixelBudgetRatio(
    requestedRatio,
    width,
    height,
    motionActive
      ? CLASSIC_RUNTIME_RENDER_PROFILE.motionMaxRenderPixels
      : CLASSIC_RUNTIME_RENDER_PROFILE.maxRenderPixels,
  );
}

export function resolveDiceRuntimePixelRatio(requestedRatio, width, height) {
  return resolvePixelBudgetRatio(
    requestedRatio,
    width,
    height,
    DICE_RUNTIME_RENDER_PROFILE.maxRenderPixels,
  );
}

function isClassicCanvas(canvas) {
  return canvas?.classList?.contains?.("classic-three-canvas") === true;
}

function isDiceCanvas(canvas) {
  return canvas?.classList?.contains?.("dice-three-canvas") === true;
}

function canvasRenderSize(canvas, width = null, height = null) {
  const host = canvas?.parentElement;
  return {
    width: Math.max(1, Number(width) || Number(host?.clientWidth) || Number(canvas?.clientWidth) || 1),
    height: Math.max(1, Number(height) || Number(host?.clientHeight) || Number(canvas?.clientHeight) || 1),
  };
}

function resolveCanvasPixelRatio(canvas, requestedRatio, width, height) {
  if (isClassicCanvas(canvas)) {
    return resolveClassicRuntimePixelRatio(requestedRatio, width, height, {
      motionActive: canvas?.dataset?.marbleMotionActive === "true",
    });
  }
  if (isDiceCanvas(canvas)) {
    return resolveDiceRuntimePixelRatio(requestedRatio, width, height);
  }
  return requestedRatio;
}

export function installClassicPixelRatioPolicy(threeModule) {
  const prototype = threeModule?.WebGLRenderer?.prototype;
  if (!prototype || typeof prototype.setPixelRatio !== "function" || typeof prototype.setSize !== "function") {
    return false;
  }
  if (prototype[CLASSIC_PIXEL_RATIO_POLICY]) return true;

  const setPixelRatio = prototype.setPixelRatio;
  const setSize = prototype.setSize;
  Object.defineProperty(prototype, CLASSIC_PIXEL_RATIO_POLICY, {
    configurable: false,
    enumerable: false,
    value: true,
    writable: false,
  });

  prototype.setPixelRatio = function setMarblePixelRatio(value) {
    MARBLE_REQUESTED_PIXEL_RATIO.set(this, value);
    const canvas = this.domElement;
    const marbleCanvas = isClassicCanvas(canvas) || isDiceCanvas(canvas);
    if (!marbleCanvas || MARBLE_PIXEL_RATIO_APPLYING.has(this)) {
      return setPixelRatio.call(this, value);
    }

    MARBLE_RENDERER_BY_CANVAS.set(canvas, this);
    const size = canvasRenderSize(canvas);
    const resolved = resolveCanvasPixelRatio(canvas, value, size.width, size.height);
    MARBLE_PIXEL_RATIO_APPLYING.add(this);
    try {
      return setPixelRatio.call(this, resolved);
    } finally {
      MARBLE_PIXEL_RATIO_APPLYING.delete(this);
    }
  };

  prototype.setSize = function setMarbleSize(width, height, updateStyle) {
    const canvas = this.domElement;
    const marbleCanvas = isClassicCanvas(canvas) || isDiceCanvas(canvas);
    if (!marbleCanvas || MARBLE_PIXEL_RATIO_APPLYING.has(this)) {
      return setSize.call(this, width, height, updateStyle);
    }

    MARBLE_RENDERER_BY_CANVAS.set(canvas, this);
    const requested = MARBLE_REQUESTED_PIXEL_RATIO.get(this)
      ?? (typeof this.getPixelRatio === "function" ? this.getPixelRatio() : 1);
    const size = canvasRenderSize(canvas, width, height);
    const resolved = resolveCanvasPixelRatio(canvas, requested, size.width, size.height);
    MARBLE_PIXEL_RATIO_APPLYING.add(this);
    try {
      setPixelRatio.call(this, resolved);
      return setSize.call(this, width, height, updateStyle);
    } finally {
      MARBLE_PIXEL_RATIO_APPLYING.delete(this);
    }
  };

  return true;
}

function reapplyClassicPixelBudget(targetElement) {
  const canvas = targetElement?.querySelector?.(".classic-three-canvas");
  const renderer = canvas ? MARBLE_RENDERER_BY_CANVAS.get(canvas) : null;
  if (!canvas || !renderer || typeof renderer.setSize !== "function") return;
  const size = canvasRenderSize(canvas);
  renderer.setSize(size.width, size.height, false);
}

function renderNow(canvas) {
  const windowObject = canvas?.ownerDocument?.defaultView;
  return windowObject?.performance?.now?.()
    ?? globalThis.performance?.now?.()
    ?? Date.now();
}

function isRenderVisible(canvas) {
  return canvas?.ownerDocument?.visibilityState !== "hidden";
}

function requestClassicRender(targetElement, { shadow = false } = {}) {
  const canvas = targetElement?.querySelector?.(".classic-three-canvas");
  if (!canvas?.dataset) return;
  canvas.dataset.marbleRenderForce = "true";
  if (shadow) canvas.dataset.marbleShadowRefresh = "true";
}

function setClassicMotionActive(targetElement, active) {
  const canvas = targetElement?.querySelector?.(".classic-three-canvas");
  if (!canvas?.dataset) return;
  if (active) canvas.dataset.marbleMotionActive = "true";
  else delete canvas.dataset.marbleMotionActive;
  reapplyClassicPixelBudget(targetElement);
}

export function installClassicShadowUpdatePolicy(threeModule) {
  const prototype = threeModule?.WebGLRenderer?.prototype;
  if (!prototype || typeof prototype.render !== "function") return false;
  if (prototype[CLASSIC_RENDER_POLICY]) return true;

  const render = prototype.render;
  Object.defineProperty(prototype, CLASSIC_RENDER_POLICY, {
    configurable: false,
    enumerable: false,
    value: true,
    writable: false,
  });

  prototype.render = function renderClassicScene(...args) {
    const canvas = this.domElement;
    if (!isClassicCanvas(canvas)) return render.apply(this, args);

    const dataset = canvas?.dataset;
    const now = renderNow(canvas);
    const lastRenderedAt = CLASSIC_LAST_RENDERED_AT.get(this) ?? Number.NEGATIVE_INFINITY;
    const force = dataset?.marbleRenderForce === "true" || dataset?.marbleShadowRefresh === "true";
    const motionActive = dataset?.marbleMotionActive === "true";
    const visible = isRenderVisible(canvas);
    const overlayActive = isMarbleOverlayMotionActive();

    if (!shouldRenderMarbleFrame({
      now,
      lastRenderedAt,
      force,
      motionActive,
      overlayActive,
      visible,
    })) {
      return undefined;
    }

    CLASSIC_LAST_RENDERED_AT.set(this, now);
    const refreshRequested = dataset?.marbleShadowRefresh === "true";
    if (this.shadowMap) {
      if (this.shadowMap.autoUpdate !== false) {
        this.shadowMap.autoUpdate = false;
        this.shadowMap.needsUpdate = true;
      } else if (refreshRequested) {
        this.shadowMap.needsUpdate = true;
      }
    }

    try {
      return render.apply(this, args);
    } finally {
      if (dataset) {
        delete dataset.marbleRenderForce;
        if (refreshRequested) delete dataset.marbleShadowRefresh;
      }
    }
  };

  return true;
}

function requestClassicShadowRefresh(targetElement) {
  requestClassicRender(targetElement, { shadow: true });
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
  const presentationQueue = getSharedAnimationQueue("classic-online");
  const presentationDirector = createAnimationDirector({
    presenters: {
      PLAYER_MOVED(event) {
        return renderer.playEvent(event);
      },
    },
  });

  function reportPresentationTaskError(error, metadata) {
    consoleObject?.error?.("Marble presentation task failed", {
      eventType: metadata?.eventType ?? null,
      error,
    });
  }

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
        const threeModule = await loadThree();
        installClassicShadowUpdatePolicy(threeModule);
        installClassicPixelRatioPolicy(threeModule);
        const value = await renderer.mount(targetElement);
        requestClassicShadowRefresh(mountedTarget);
        return value;
      }

      const mountStartedAt = performanceNow(performanceObject);
      logMarbleRenderStep("mount-start", { performanceObject, consoleObject });

      const importStartedAt = performanceNow(performanceObject);
      const threeModule = await loadThree();
      installClassicShadowUpdatePolicy(threeModule);
      installClassicPixelRatioPolicy(threeModule);
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
      const task = presentationDirector.createTask(event);
      if (!task) {
        const value = await renderer.playEvent(event);
        requestClassicShadowRefresh(mountedTarget);
        return value;
      }

      return presentationQueue.enqueue(async () => {
        setClassicMotionActive(mountedTarget, true);
        try {
          return await task();
        } finally {
          setClassicMotionActive(mountedTarget, false);
          requestClassicShadowRefresh(mountedTarget);
        }
      }, {
        eventType: event.type,
        onTaskError: reportPresentationTaskError,
      });
    },

    dispose() {
      setClassicMotionActive(mountedTarget, false);
      mountedTarget = null;
      renderer.dispose();
    },
  });
}
