import {
  DICE_STAGE_PROFILE,
  createThreeDiceStage as createBaseThreeDiceStage,
  dieFaceNormal,
  normalizeDiceFace,
  normalizeRollStrength,
  rollAnimationProfile,
} from "./diceStage.js?implementation=20260910-r8";
import {
  logMarbleRenderStep,
  markOnlineVisualRuntime,
  performanceNow,
  shouldDeferOnlineDiceRenderer,
  shouldStartOnlineDiceRenderer,
} from "./onlineVisualPolicy.js?v=20260910-r9";

export {
  DICE_STAGE_PROFILE,
  dieFaceNormal,
  normalizeDiceFace,
  normalizeRollStrength,
  rollAnimationProfile,
};

export function createThreeDiceStage(options = {}) {
  const {
    documentObject = globalThis.document,
    locationObject = globalThis.location,
    performanceObject = globalThis.performance,
    consoleObject = globalThis.console,
    ...stageOptions
  } = options;
  const baseStage = createBaseThreeDiceStage(stageOptions);
  if (!shouldDeferOnlineDiceRenderer({ documentObject, locationObject })) return baseStage;

  markOnlineVisualRuntime({ documentObject, locationObject });
  const diceEnabled = shouldStartOnlineDiceRenderer({ documentObject, locationObject });
  let target = null;
  let mounted = false;
  let disposed = false;
  let mountPromise = null;

  function setStatus(status) {
    if (documentObject?.body?.dataset) documentObject.body.dataset.onlineDiceRenderer = status;
    if (target?.dataset) target.dataset.rendererState = status;
  }

  async function ensureMounted() {
    if (disposed || mounted) return mounted ? baseStage : null;
    if (!diceEnabled || !target) return null;
    if (mountPromise) return mountPromise;

    const startedAt = performanceNow(performanceObject);
    setStatus("loading");
    logMarbleRenderStep("dice-mount-start", { performanceObject, consoleObject });
    mountPromise = Promise.resolve(baseStage.mount(target)).then(() => {
      if (disposed) {
        baseStage.dispose?.();
        return null;
      }
      mounted = true;
      setStatus("ready");
      logMarbleRenderStep("dice-mount-ready", {
        startedAt,
        performanceObject,
        consoleObject,
      });
      return baseStage;
    }).catch((error) => {
      setStatus("failed");
      consoleObject?.error?.("Marble online lazy 3D dice stage failed to initialize", error);
      return null;
    }).finally(() => {
      mountPromise = null;
    });
    return mountPromise;
  }

  return Object.freeze({
    async mount(targetElement) {
      if (!targetElement || typeof targetElement.replaceChildren !== "function") {
        throw new TypeError("Dice stage mount target is required.");
      }
      target = targetElement;
      disposed = false;
      setStatus(diceEnabled ? "deferred" : "disabled");
      logMarbleRenderStep(diceEnabled ? "dice-deferred" : "dice-disabled", { performanceObject, consoleObject });
      return null;
    },

    showReady() {
      if (mounted) baseStage.showReady?.();
    },

    async playRoll(values, rollOptions = {}) {
      const stage = await ensureMounted();
      if (!stage) return;
      try {
        await stage.playRoll(values, rollOptions);
      } catch (error) {
        setStatus("failed");
        consoleObject?.error?.("Marble online 3D dice animation failed", error);
      }
    },

    hide() {
      if (mounted) baseStage.hide?.();
    },

    dispose() {
      disposed = true;
      if (mounted) baseStage.dispose?.();
      mounted = false;
      target = null;
      setStatus("disposed");
    },
  });
}
