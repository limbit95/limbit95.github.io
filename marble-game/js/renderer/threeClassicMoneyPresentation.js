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
} from "../presentation/moneyPresentation.js?v=20260912-r20";

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

function subtractVector(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function dotVector(a, b) {
  return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]);
}

function crossVector(a, b) {
  return [
    (a[1] * b[2]) - (a[2] * b[1]),
    (a[2] * b[0]) - (a[0] * b[2]),
    (a[0] * b[1]) - (a[1] * b[0]),
  ];
}

function normalizeVector(vector) {
  const length = Math.hypot(vector[0], vector[1], vector[2]);
  if (!length) return [0, 0, 0];
  return vector.map((value) => value / length);
}

export function projectClassicBoardPoint(worldPoint, viewportRect) {
  const left = Number(viewportRect?.left);
  const top = Number(viewportRect?.top);
  const width = Number(viewportRect?.width);
  const height = Number(viewportRect?.height);
  if (![left, top, width, height].every(Number.isFinite) || width <= 0 || height <= 0) return null;

  const cameraPosition = CLASSIC_CAMERA_PROFILE.position;
  const cameraTarget = CLASSIC_CAMERA_PROFILE.target;
  const forward = normalizeVector(subtractVector(cameraTarget, cameraPosition));
  const right = normalizeVector(crossVector(forward, [0, 1, 0]));
  const cameraUp = normalizeVector(crossVector(right, forward));
  const relative = subtractVector(worldPoint, cameraTarget);
  const cameraX = dotVector(relative, right);
  const cameraY = dotVector(relative, cameraUp);
  const bounds = createOrthographicBounds(width, height);

  return Object.freeze({
    x: left + (((cameraX - bounds.left) / (bounds.right - bounds.left)) * width),
    y: top + (((bounds.top - cameraY) / (bounds.top - bounds.bottom)) * height),
  });
}

function isEventMoneyEvent(event) {
  return event?.reason === "EVENT"
    && (event?.type === "MONEY_RECEIVED" || event?.type === "MONEY_PAID");
}

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
  const pendingEventMoneyEvents = [];
  const presentationQueue = getSharedAnimationQueue("classic-online");
  let playerListObserver = null;
  let eventModalObserver = null;
  let rendererTarget = null;
  let boardLayoutByNodeId = new Map();

  function resolveBoardViewportRect() {
    const canvas = rendererTarget?.querySelector?.(".classic-three-canvas");
    return canvas?.getBoundingClientRect?.() ?? rendererTarget?.getBoundingClientRect?.() ?? null;
  }

  function resolveBoardTransferPoint(endpoint) {
    const viewportRect = resolveBoardViewportRect();
    if (!viewportRect) return null;

    if (endpoint?.kind === "board-center") {
      return projectClassicBoardPoint([0, 1.85, 0], viewportRect);
    }

    if (endpoint?.kind === "tile") {
      const layout = boardLayoutByNodeId.get(endpoint.nodeId);
      if (!layout) return null;
      return projectClassicBoardPoint([
        layout.x,
        layout.y + 0.7,
        layout.z,
      ], viewportRect);
    }

    return null;
  }

  const moneyPresenter = createHudMoneyPresenter({
    documentObject,
    seatByPlayerId: playerSeatById,
    balanceByPlayerId: playerBalanceById,
    resolveBoardPoint: resolveBoardTransferPoint,
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

  function pendingEventPlayerIds() {
    return new Set(pendingEventMoneyEvents.map(({ event }) => event.playerId));
  }

  function syncPlayerPresentationState(state) {
    const deferredPlayerIds = pendingEventPlayerIds();
    for (const player of state?.players ?? []) {
      playerSeatById.set(player.id, Number(player.seat) || 0);
      if (Number.isFinite(Number(player.money)) && !deferredPlayerIds.has(player.id)) {
        playerBalanceById.set(player.id, Number(player.money));
      }
    }
    if (Array.isArray(state?.board?.nodes)) {
      const layout = createSquareRingLayout(state.board.nodes);
      boardLayoutByNodeId = new Map(layout.map((entry) => [entry.nodeId, entry]));
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

  function removePendingEventMoney(entry) {
    const index = pendingEventMoneyEvents.indexOf(entry);
    if (index >= 0) pendingEventMoneyEvents.splice(index, 1);
    if (entry?.timerId !== null && entry?.timerId !== undefined) {
      (windowObject?.clearTimeout ?? globalThis.clearTimeout)?.(entry.timerId);
    }
  }

  function flushPendingEventMoney({ requireOpenModal = false } = {}) {
    if (!pendingEventMoneyEvents.length) return;
    const modal = documentObject?.querySelector?.("[data-tile-info-modal]");
    if (requireOpenModal && !modal?.open && !modal?.hasAttribute?.("open")) return;
    const entries = [...pendingEventMoneyEvents];
    entries.forEach(removePendingEventMoney);
    for (const { event } of entries) void enqueueMoney(event);
  }

  function deferEventMoney(event) {
    const setTimeoutFn = windowObject?.setTimeout ?? globalThis.setTimeout;
    const entry = { event, timerId: null };
    pendingEventMoneyEvents.push(entry);
    entry.timerId = setTimeoutFn?.(() => {
      if (!pendingEventMoneyEvents.includes(entry)) return;
      removePendingEventMoney(entry);
      void enqueueMoney(event);
    }, 900) ?? null;
  }

  function installEventModalObserver() {
    if (eventModalObserver || typeof MutationObserverObject !== "function") return;
    const modal = documentObject?.querySelector?.("[data-tile-info-modal]");
    if (!modal) return;
    eventModalObserver = new MutationObserverObject(() => {
      if (modal.open || modal.hasAttribute?.("open")) {
        flushPendingEventMoney({ requireOpenModal: true });
      }
    });
    eventModalObserver.observe(modal, { attributes: true, attributeFilter: ["open"] });
  }

  return Object.freeze({
    async mount(targetElement) {
      rendererTarget = targetElement;
      const value = await renderer.mount(targetElement);
      installMoneyHudObserver();
      installEventModalObserver();
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
      if (isEventMoneyEvent(event)) {
        const value = await renderer.playEvent(event);
        deferEventMoney(event);
        return value;
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
      eventModalObserver?.disconnect?.();
      eventModalObserver = null;
      for (const entry of [...pendingEventMoneyEvents]) removePendingEventMoney(entry);
      rendererTarget = null;
      boardLayoutByNodeId.clear();
      pendingStartEvents.length = 0;
      playerSeatById.clear();
      playerBalanceById.clear();
      renderer.dispose();
    },
  });
}
