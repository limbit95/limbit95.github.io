export const CLASSIC_ADAPTIVE_RENDER_PROFILE = Object.freeze({
  minScale: 0.55,
  maxScale: 1,
  slowFrameMs: 19.5,
  severeFrameMs: 27,
  recoverFrameMs: 17.4,
  sampleWindowFrames: 30,
  recoverSampleWindows: 4,
  slowStep: 0.12,
  severeStep: 0.2,
  recoverStep: 0.05,
  cooldownMs: 900,
  maxFrameGapMs: 120,
  minPixelRatio: 0.55,
});

const CLASSIC_ADAPTIVE_RENDER_POLICY = Symbol.for("marble.classic.adaptive-render-policy");
const CLASSIC_RENDER_POLICY_REGISTRY = Symbol.for("marble.classic.render-policy-registry");
const CLASSIC_RENDER_POLICY_INTERCEPTOR = Symbol.for("marble.classic.render-policy-interceptor");
const adaptiveRuntimeByRenderer = new WeakMap();

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function resolveAdaptivePixelRatio(basePixelRatio, qualityScale, {
  minPixelRatio = CLASSIC_ADAPTIVE_RENDER_PROFILE.minPixelRatio,
} = {}) {
  const base = Math.max(0.1, Number(basePixelRatio) || 1);
  const scale = clamp(Number(qualityScale) || 1, 0.1, 1);
  return clamp(base * scale, Math.min(minPixelRatio, base), base);
}

export function createAdaptiveRenderBudgetController({
  profile = CLASSIC_ADAPTIVE_RENDER_PROFILE,
} = {}) {
  let scale = profile.maxScale;
  let lastFrameAt = null;
  let lastChangeAt = Number.NEGATIVE_INFINITY;
  let sampledFrameMs = 0;
  let sampledFrames = 0;
  let recoveryWindows = 0;
  let latestAverageFrameMs = 0;

  function snapshot(changed = false) {
    return Object.freeze({
      changed,
      scale,
      averageFrameMs: latestAverageFrameMs,
      fps: latestAverageFrameMs > 0 ? 1000 / latestAverageFrameMs : 0,
    });
  }

  function recordFrame(now) {
    const timestamp = Number(now);
    if (!Number.isFinite(timestamp)) return snapshot();

    if (lastFrameAt === null) {
      lastFrameAt = timestamp;
      return snapshot();
    }

    const frameMs = timestamp - lastFrameAt;
    lastFrameAt = timestamp;
    if (frameMs <= 0 || frameMs > profile.maxFrameGapMs) {
      sampledFrameMs = 0;
      sampledFrames = 0;
      recoveryWindows = 0;
      return snapshot();
    }

    sampledFrameMs += frameMs;
    sampledFrames += 1;
    if (sampledFrames < profile.sampleWindowFrames) return snapshot();

    latestAverageFrameMs = sampledFrameMs / sampledFrames;
    sampledFrameMs = 0;
    sampledFrames = 0;

    if ((timestamp - lastChangeAt) < profile.cooldownMs) return snapshot();

    let nextScale = scale;
    if (latestAverageFrameMs >= profile.severeFrameMs) {
      nextScale -= profile.severeStep;
      recoveryWindows = 0;
    } else if (latestAverageFrameMs >= profile.slowFrameMs) {
      nextScale -= profile.slowStep;
      recoveryWindows = 0;
    } else if (latestAverageFrameMs <= profile.recoverFrameMs) {
      recoveryWindows += 1;
      if (recoveryWindows >= profile.recoverSampleWindows) {
        nextScale += profile.recoverStep;
        recoveryWindows = 0;
      }
    } else {
      recoveryWindows = 0;
    }

    nextScale = clamp(nextScale, profile.minScale, profile.maxScale);
    if (Math.abs(nextScale - scale) < 0.001) return snapshot();

    scale = nextScale;
    lastChangeAt = timestamp;
    return snapshot(true);
  }

  return Object.freeze({
    recordFrame,
    get scale() {
      return scale;
    },
  });
}

function runtimeNow(performanceObject) {
  return Number(performanceObject?.now?.() ?? Date.now());
}

function resolveCssSize(canvas, currentPixelRatio) {
  const pixelRatio = Math.max(0.1, Number(currentPixelRatio) || 1);
  const width = Math.max(1, Number(canvas?.clientWidth) || (Number(canvas?.width) || 1) / pixelRatio);
  const height = Math.max(1, Number(canvas?.clientHeight) || (Number(canvas?.height) || 1) / pixelRatio);
  return { width, height };
}

function writePerformanceDiagnostics(canvas, metrics, pixelRatio, width, height, renderer) {
  if (!canvas?.dataset) return;
  canvas.dataset.marbleRenderScale = metrics.scale.toFixed(2);
  canvas.dataset.marblePixelRatio = pixelRatio.toFixed(2);
  canvas.dataset.marbleFrameMs = metrics.averageFrameMs > 0 ? metrics.averageFrameMs.toFixed(1) : "0";
  canvas.dataset.marbleFps = metrics.fps > 0 ? metrics.fps.toFixed(1) : "0";
  canvas.dataset.marbleRenderPixels = String(Math.round(width * height * pixelRatio * pixelRatio));
  const drawCalls = Number(renderer?.info?.render?.calls);
  if (Number.isFinite(drawCalls)) canvas.dataset.marbleDrawCalls = String(drawCalls);
}

export function installClassicRendererInstanceRenderPolicy(threeModule, policyKey, wrapRender) {
  const prototype = threeModule?.WebGLRenderer?.prototype;
  if (!prototype || typeof wrapRender !== "function") return false;

  let registry = prototype[CLASSIC_RENDER_POLICY_REGISTRY];
  if (!registry) {
    registry = [];
    Object.defineProperty(prototype, CLASSIC_RENDER_POLICY_REGISTRY, {
      configurable: false,
      enumerable: false,
      value: registry,
      writable: false,
    });
  }

  if (!registry.some((entry) => entry.key === policyKey)) {
    registry.push(Object.freeze({ key: policyKey, wrapRender }));
  }

  if (prototype[CLASSIC_RENDER_POLICY_INTERCEPTOR]) return true;

  const descriptor = Object.getOwnPropertyDescriptor(prototype, "render");
  if (typeof descriptor?.value === "function") {
    const originalRender = descriptor.value;
    prototype.render = function renderClassicWithPolicies(...args) {
      let render = originalRender;
      for (const entry of registry) render = entry.wrapRender(this, render);
      Object.defineProperty(this, "render", {
        configurable: true,
        enumerable: false,
        value: render,
        writable: true,
      });
      return render.apply(this, args);
    };
  } else if (!descriptor) {
    Object.defineProperty(prototype, "render", {
      configurable: true,
      enumerable: false,
      get() {
        return undefined;
      },
      set(render) {
        let wrappedRender = render;
        if (typeof render === "function") {
          for (const entry of registry) wrappedRender = entry.wrapRender(this, wrappedRender);
        }
        Object.defineProperty(this, "render", {
          configurable: true,
          enumerable: true,
          value: wrappedRender,
          writable: true,
        });
      },
    });
  } else {
    return false;
  }

  Object.defineProperty(prototype, CLASSIC_RENDER_POLICY_INTERCEPTOR, {
    configurable: false,
    enumerable: false,
    value: true,
    writable: false,
  });
  return true;
}

export function installClassicAdaptiveRenderPolicy(threeModule, {
  resolveBasePixelRatio,
  windowObject = globalThis.window,
  performanceObject = globalThis.performance,
} = {}) {
  if (typeof resolveBasePixelRatio !== "function") return false;

  return installClassicRendererInstanceRenderPolicy(
    threeModule,
    CLASSIC_ADAPTIVE_RENDER_POLICY,
    (renderer, render) => function renderClassicAdaptiveScene(...args) {
      const canvas = this?.domElement ?? renderer?.domElement;
      const classicCanvas = canvas?.classList?.contains?.("classic-three-canvas") === true;
      if (!classicCanvas) return render.apply(this, args);

      const targetRenderer = this ?? renderer;
      let runtime = adaptiveRuntimeByRenderer.get(targetRenderer);
      if (!runtime) {
        runtime = { controller: createAdaptiveRenderBudgetController() };
        adaptiveRuntimeByRenderer.set(targetRenderer, runtime);
      }

      const metrics = runtime.controller.recordFrame(runtimeNow(performanceObject));
      const currentPixelRatio = Number(targetRenderer.getPixelRatio?.()) || 1;
      const { width, height } = resolveCssSize(canvas, currentPixelRatio);
      const basePixelRatio = resolveBasePixelRatio(
        width,
        height,
        Number(windowObject?.devicePixelRatio) || 1,
      );
      const adaptivePixelRatio = resolveAdaptivePixelRatio(basePixelRatio, metrics.scale);

      if (Math.abs(adaptivePixelRatio - currentPixelRatio) >= 0.035) {
        targetRenderer.setPixelRatio?.(adaptivePixelRatio);
      }

      const value = render.apply(this, args);
      writePerformanceDiagnostics(canvas, metrics, adaptivePixelRatio, width, height, targetRenderer);
      return value;
    },
  );
}
