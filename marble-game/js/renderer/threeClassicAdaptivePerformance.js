import {
  CLASSIC_CAMERA_PROFILE,
  CLASSIC_RENDER_PROFILE,
  CLASSIC_VISUAL_PROFILE,
  THREE_IMPORT_VERSION,
  createClassicThreePrototypeRenderer as createPresentationRenderer,
  createOrthographicBounds,
  createSquareRingLayout,
  getClassicTileVisual,
  installClassicShadowUpdatePolicy,
  resolveClassicRendererPixelRatio,
} from "./threeClassicMoneyPresentation.js?v=20260912-r21";
import {
  createAdaptiveRenderBudgetController,
  resolveAdaptivePixelRatio,
} from "./classicRenderPerformance.js?v=20260914-r1";

const CLASSIC_ADAPTIVE_RENDER_POLICY = Symbol.for("marble.classic.adaptive-render-policy");
const adaptiveRuntimeByRenderer = new WeakMap();

export {
  CLASSIC_CAMERA_PROFILE,
  CLASSIC_RENDER_PROFILE,
  CLASSIC_VISUAL_PROFILE,
  THREE_IMPORT_VERSION,
  createOrthographicBounds,
  createSquareRingLayout,
  getClassicTileVisual,
  installClassicShadowUpdatePolicy,
  resolveClassicRendererPixelRatio,
};

function rendererNow(performanceObject) {
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

export function installClassicAdaptiveRenderPolicy(threeModule, {
  windowObject = globalThis.window,
  performanceObject = globalThis.performance,
} = {}) {
  const prototype = threeModule?.WebGLRenderer?.prototype;
  if (!prototype || typeof prototype.render !== "function") return false;
  if (prototype[CLASSIC_ADAPTIVE_RENDER_POLICY]) return true;

  const render = prototype.render;
  Object.defineProperty(prototype, CLASSIC_ADAPTIVE_RENDER_POLICY, {
    configurable: false,
    enumerable: false,
    value: true,
    writable: false,
  });

  prototype.render = function renderClassicAdaptiveScene(...args) {
    const canvas = this.domElement;
    const classicCanvas = canvas?.classList?.contains?.("classic-three-canvas") === true;
    if (!classicCanvas) return render.apply(this, args);

    let runtime = adaptiveRuntimeByRenderer.get(this);
    if (!runtime) {
      runtime = { controller: createAdaptiveRenderBudgetController() };
      adaptiveRuntimeByRenderer.set(this, runtime);
    }

    const metrics = runtime.controller.recordFrame(rendererNow(performanceObject));
    const currentPixelRatio = Number(this.getPixelRatio?.()) || 1;
    const { width, height } = resolveCssSize(canvas, currentPixelRatio);
    const basePixelRatio = resolveClassicRendererPixelRatio(
      width,
      height,
      Number(windowObject?.devicePixelRatio) || 1,
    );
    const adaptivePixelRatio = resolveAdaptivePixelRatio(basePixelRatio, metrics.scale);

    if (Math.abs(adaptivePixelRatio - currentPixelRatio) >= 0.035) {
      this.setPixelRatio?.(adaptivePixelRatio);
    }

    const value = render.apply(this, args);
    writePerformanceDiagnostics(canvas, metrics, adaptivePixelRatio, width, height, this);
    return value;
  };

  return true;
}

export function createClassicThreePrototypeRenderer(options = {}, runtime = {}) {
  const renderer = createPresentationRenderer(options, runtime);
  const loadThree = runtime.loadThree ?? (() => import("three"));

  return Object.freeze({
    async mount(targetElement) {
      installClassicAdaptiveRenderPolicy(await loadThree(), {
        windowObject: runtime.windowObject ?? globalThis.window,
        performanceObject: runtime.performanceObject ?? globalThis.performance,
      });
      return renderer.mount(targetElement);
    },

    renderState(state) {
      return renderer.renderState(state);
    },

    playEvent(event) {
      return renderer.playEvent(event);
    },

    dispose() {
      renderer.dispose();
    },
  });
}
