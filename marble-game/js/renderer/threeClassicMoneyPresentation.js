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
import {
  createHudMoneyPresenter,
  syncHudMoneyBalances,
} from "../presentation/moneyPresentation.js?v=20260912-r18";

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
  const MutationObserverObject = runtime.MutationObserverObject
    ?? windowObject?.MutationObserver
    ?? globalThis.MutationObserver;
  const renderer = createBaseClassicThreePrototypeRenderer(options, runtime);
  const playerSeatById = new Map();
  const playerBalanceById = new Map();
  const pendingStartEvents = [];
  const presentationQueue = getSharedAnimationQueue("classic-online");
  let playerListObserver = null;
  const moneyPresenter = createHudMoneyPresenter({
    documentObject,
    seatByPlayerId: playerSeatById,
    balanceByPlayerId: playerBalanceById,
    reducedMotion: windowObject?.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true,
    wait: (ms) => new Promise((resolve) => (windowObject?.setTimeout ?? globalThis.setTimeout)(resolve, ms)),
    requestFrame: typeof windowObject?.requestAnimationFrame === "function"
      ? windowObject.requestAnimationFrame.bind(windowObject)
      : null,
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
      PROPERTY_BOUGHT(event) {
        return moneyPresenter.play(event);
      },
      PROPERTY_BUILT(event) {
        return moneyPresenter.play(event);
      },
    },
  });

  function syncVisibleMoney() {
    syncHudMoneyBalances({
      documentObject,
      seatByPlayerId: playerSeatById,
      balanceByPlayerId: playerBalanceById,
    });
  }

  function syncPlayerPresentationState(state) {
    for (const player of state?.players ?? []) {
      playerSeatById.set(player.id, Number(player.seat) || 0);
      if (Number.isFinite(Number(player.money))) {
        playerBalanceById.set(player.id, Number(player.money));
      }
    }
    syncVisibleMoney();
  }

  function installMoneyHudObserver() {
    if (playerListObserver || typeof MutationObserverObject !== "function") return;
    const playerList = documentObject?.querySelector?.("[data-player-list]");
    if (!playerList) return;
    playerListObserver = new MutationObserverObject(() => syncVisibleMoney());
    playerListObserver.observe(playerList, { childList: true });
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
    async mount(targetElement) {
      const value = await renderer.mount(targetElement);
      installMoneyHudObserver();
      syncVisibleMoney();
      return value;
    },

    renderState(state) {
      syncPlayerPresentationState(state);
      return renderer.renderState(state);
    },

    async playEvent(event) {
      if (event?.type === "START_PASSED") {
        pendingStartEvents.push(event);
        return undefined;
      }
      if (moneyDirector.handles(event?.type)) {
        const value = await renderer.playEvent(event);
        await enqueueMoney(event);
        return value;
      }

      const value = await renderer.playEvent(event);
      if (event?.type === "PLAYER_MOVED" && pendingStartEvents.length) {
        const startEvents = pendingStartEvents.splice(0);
        for (const startEvent of startEvents) await enqueueMoney(startEvent);
      }
      return value;
    },

    dispose() {
      playerListObserver?.disconnect?.();
      playerListObserver = null;
      pendingStartEvents.length = 0;
      playerSeatById.clear();
      playerBalanceById.clear();
      renderer.dispose();
    },
  });
}
