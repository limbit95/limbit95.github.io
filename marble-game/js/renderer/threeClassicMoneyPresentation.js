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
} from "../presentation/moneyPresentation.js?v=20260912-r21";
import { createClassicTileInfo } from "../tileInfo.js?v=20260912-r21";

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

const MODAL_MONEY_LEAD_IN_MS = 520;
const MODAL_MONEY_FALLBACK_MS = 1400;
const MODAL_LANDING_TILE_TYPES = new Set(["BONUS", "TAX"]);

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

function isModalMoneyEvent(event) {
  if (event?.type === "MONEY_RECEIVED") return ["EVENT", "BONUS"].includes(event?.reason);
  if (event?.type === "MONEY_PAID") return ["EVENT", "TAX"].includes(event?.reason);
  return false;
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
  const pendingModalMoneyEvents = [];
  const presentationQueue = getSharedAnimationQueue("classic-online");
  let playerListObserver = null;
  let moneyModalObserver = null;
  let rendererTarget = null;
  let boardLayoutByNodeId = new Map();
  let latestState = null;

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

  function pendingModalPlayerIds() {
    return new Set(pendingModalMoneyEvents.map(({ event }) => event.playerId));
  }

  function syncPlayerPresentationState(state) {
    latestState = state;
    const deferredPlayerIds = pendingModalPlayerIds();
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

  function isViewerPlayer(playerId) {
    const seat = playerSeatById.get(playerId);
    const viewerCard = documentObject?.querySelector?.('.player-hud-card[data-viewer="true"]');
    return Number.isInteger(Number(seat))
      && Number(viewerCard?.dataset?.seat) === Number(seat);
  }

  function populateLandingMoneyModal(state, nodeId) {
    const modal = documentObject?.querySelector?.("[data-tile-info-modal]");
    const info = createClassicTileInfo(state, nodeId);
    if (!modal || !info) return false;

    const type = documentObject.querySelector?.("[data-tile-info-type]");
    const title = documentObject.querySelector?.("[data-tile-info-title]");
    const summary = documentObject.querySelector?.("[data-tile-info-summary]");
    const stats = documentObject.querySelector?.("[data-tile-info-stats]");
    const effect = documentObject.querySelector?.("[data-tile-info-effect]");
    const confirm = documentObject.querySelector?.("[data-tile-info-confirm]");
    const decline = documentObject.querySelector?.("[data-tile-info-decline]");
    const action = documentObject.querySelector?.("[data-tile-info-action]");
    if (!type || !title || !summary || !stats || !effect) return false;

    type.textContent = info.typeLabel;
    title.textContent = info.title;
    summary.textContent = info.summary;
    effect.textContent = info.effect;
    stats.replaceChildren(...info.stats.map(({ label, value }) => {
      const row = documentObject.createElement("div");
      const term = documentObject.createElement("dt");
      const description = documentObject.createElement("dd");
      term.textContent = label;
      description.textContent = value;
      row.append(term, description);
      return row;
    }));

    modal.dataset.mode = "inspect";
    if (confirm) confirm.hidden = false;
    if (decline) decline.hidden = true;
    if (action) {
      action.hidden = true;
      action.disabled = false;
      action.dataset.action = "";
    }
    if (!modal.open) {
      if (typeof modal.showModal === "function") modal.showModal();
      else modal.setAttribute("open", "");
    }
    return true;
  }

  function openLandingMoneyModal(event) {
    if (event?.type !== "TILE_LANDED" || !isViewerPlayer(event.playerId)) return;
    const node = latestState?.board?.nodes?.find?.((candidate) => candidate.id === event.nodeId);
    if (!node || !MODAL_LANDING_TILE_TYPES.has(node.type)) return;
    populateLandingMoneyModal(latestState, node.id);
  }

  function removePendingModalMoney(entry) {
    const index = pendingModalMoneyEvents.indexOf(entry);
    if (index >= 0) pendingModalMoneyEvents.splice(index, 1);
    const clearTimeoutFn = windowObject?.clearTimeout ?? globalThis.clearTimeout;
    if (entry?.fallbackTimerId !== null && entry?.fallbackTimerId !== undefined) {
      clearTimeoutFn?.(entry.fallbackTimerId);
    }
    if (entry?.modalTimerId !== null && entry?.modalTimerId !== undefined) {
      clearTimeoutFn?.(entry.modalTimerId);
    }
  }

  function flushPendingModalMoney(entry) {
    if (!pendingModalMoneyEvents.includes(entry)) return;
    removePendingModalMoney(entry);
    void enqueueMoney(entry.event);
  }

  function schedulePendingModalMoney({ requireOpenModal = false } = {}) {
    if (!pendingModalMoneyEvents.length) return;
    const modal = documentObject?.querySelector?.("[data-tile-info-modal]");
    if (requireOpenModal && !modal?.open && !modal?.hasAttribute?.("open")) return;
    const setTimeoutFn = windowObject?.setTimeout ?? globalThis.setTimeout;
    const clearTimeoutFn = windowObject?.clearTimeout ?? globalThis.clearTimeout;
    for (const entry of pendingModalMoneyEvents) {
      if (entry.modalTimerId !== null && entry.modalTimerId !== undefined) continue;
      if (entry.fallbackTimerId !== null && entry.fallbackTimerId !== undefined) {
        clearTimeoutFn?.(entry.fallbackTimerId);
        entry.fallbackTimerId = null;
      }
      entry.modalTimerId = setTimeoutFn?.(() => flushPendingModalMoney(entry), MODAL_MONEY_LEAD_IN_MS) ?? null;
    }
  }

  function deferModalMoney(event) {
    const setTimeoutFn = windowObject?.setTimeout ?? globalThis.setTimeout;
    const entry = { event, fallbackTimerId: null, modalTimerId: null };
    pendingModalMoneyEvents.push(entry);
    entry.fallbackTimerId = setTimeoutFn?.(() => flushPendingModalMoney(entry), MODAL_MONEY_FALLBACK_MS) ?? null;

    const modal = documentObject?.querySelector?.("[data-tile-info-modal]");
    if (modal?.open || modal?.hasAttribute?.("open")) {
      schedulePendingModalMoney({ requireOpenModal: true });
    }
  }

  function installMoneyModalObserver() {
    if (moneyModalObserver || typeof MutationObserverObject !== "function") return;
    const modal = documentObject?.querySelector?.("[data-tile-info-modal]");
    if (!modal) return;
    moneyModalObserver = new MutationObserverObject(() => {
      if (modal.open || modal.hasAttribute?.("open")) {
        schedulePendingModalMoney({ requireOpenModal: true });
      }
    });
    moneyModalObserver.observe(modal, { attributes: true, attributeFilter: ["open"] });
  }

  return Object.freeze({
    async mount(targetElement) {
      rendererTarget = targetElement;
      const value = await renderer.mount(targetElement);
      installMoneyHudObserver();
      installMoneyModalObserver();
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
      if (event?.type === "TILE_LANDED") {
        const value = await renderer.playEvent(event);
        openLandingMoneyModal(event);
        return value;
      }
      if (isModalMoneyEvent(event)) {
        const value = await renderer.playEvent(event);
        deferModalMoney(event);
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
      moneyModalObserver?.disconnect?.();
      moneyModalObserver = null;
      for (const entry of [...pendingModalMoneyEvents]) removePendingModalMoney(entry);
      rendererTarget = null;
      latestState = null;
      boardLayoutByNodeId.clear();
      pendingStartEvents.length = 0;
      playerSeatById.clear();
      playerBalanceById.clear();
      renderer.dispose();
    },
  });
}
