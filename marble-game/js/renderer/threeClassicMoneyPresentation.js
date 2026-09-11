import {
  CLASSIC_CAMERA_PROFILE,
  CLASSIC_RENDER_PROFILE,
  CLASSIC_VISUAL_PROFILE,
  THREE_IMPORT_VERSION,
  createClassicThreePrototypeRenderer as createBaseClassicThreePrototypeRenderer,
  createOrthographicBounds,
  createSquareRingLayout,
  getClassicTileVisual,
  installClassicShadowUpdatePolicy,
  resolveClassicRendererPixelRatio,
} from "./threeClassicPrototypeDiagnostics.js?v=20260912-r13";
import {
  createAnimationDirector,
  getSharedAnimationQueue,
} from "../presentation/presentationFoundation.js?v=20260912-r13";
import { createHudMoneyPresenter } from "../presentation/moneyPresentation.js?v=20260912-r15";

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

export function createClassicThreePrototypeRenderer(options = {}, runtime = {}) {
  const documentObject = runtime.documentObject ?? globalThis.document;
  const windowObject = runtime.windowObject ?? globalThis.window;
  const consoleObject = runtime.consoleObject ?? globalThis.console;
  const renderer = createBaseClassicThreePrototypeRenderer(options, runtime);
  const playerSeatById = new Map();
  const pendingStartEvents = [];
  const presentationQueue = getSharedAnimationQueue("classic-online");
  const moneyPresenter = createHudMoneyPresenter({
    documentObject,
    seatByPlayerId: playerSeatById,
    reducedMotion: windowObject?.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true,
  });
  const moneyDirector = createAnimationDirector({
    presenters: {
      START_PASSED(event) {
        return moneyPresenter.play(event);
      },
      MONEY_PAID(event) {
        return moneyPresenter.play(event);
      },
      MONEY_RECEIVED(event) {
        return moneyPresenter.play(event);
      },
    },
  });

  function syncPlayerSeats(state) {
    for (const player of state?.players ?? []) {
      playerSeatById.set(player.id, Number(player.seat) || 0);
    }
  }

  function reportMoneyPresentationError(error, metadata) {
    consoleObject?.error?.("Marble money presentation failed", {
      eventType: metadata?.eventType ?? null,
      error,
    });
  }

  function enqueueMoney(event) {
    const task = moneyDirector.createTask(event);
    if (!task) return Promise.resolve();
    return presentationQueue.enqueue(task, {
      eventType: event.type,
      onTaskError: reportMoneyPresentationError,
    });
  }

  return Object.freeze({
    mount(targetElement) {
      return renderer.mount(targetElement);
    },

    renderState(state) {
      syncPlayerSeats(state);
      return renderer.renderState(state);
    },

    async playEvent(event) {
      if (event?.type === "START_PASSED") {
        pendingStartEvents.push(event);
        return undefined;
      }
      if (event?.type === "MONEY_PAID" || event?.type === "MONEY_RECEIVED") {
        return enqueueMoney(event);
      }

      const value = await renderer.playEvent(event);
      if (event?.type === "PLAYER_MOVED" && pendingStartEvents.length) {
        const startEvents = pendingStartEvents.splice(0);
        for (const startEvent of startEvents) await enqueueMoney(startEvent);
      }
      return value;
    },

    dispose() {
      pendingStartEvents.length = 0;
      playerSeatById.clear();
      renderer.dispose();
    },
  });
}
