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
  projectClassicBoardPoint,
  resolveClassicRendererPixelRatio,
} from "./threeClassicMoneyPresentation.js?v=20260915-r1";
import {
  createHudMoneyPresenter,
  syncHudMoneyBalances,
} from "../presentation/moneyPresentation.js?v=20260912-r21";

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

const START_PATH_STEP_MS = 165;
const MODAL_MONEY_FALLBACK_MS = 1400;
const CHOICE_TRANSFER_PREVIEW_TIMEOUT_MS = 3200;
const REST_CELEBRATION_HOLD_MS = 2000;

export function resolveStartCrossingDelay(path, startNodeIds, { reducedMotion = false } = {}) {
  if (reducedMotion) return 0;
  const normalizedPath = Array.isArray(path) ? path : [];
  const starts = startNodeIds instanceof Set ? startNodeIds : new Set(startNodeIds ?? []);
  const startIndex = normalizedPath.findIndex((nodeId) => starts.has(nodeId));
  return startIndex >= 0 ? (startIndex + 1) * START_PATH_STEP_MS : 0;
}

function isRestEvent(event) {
  return event?.type === "REST_ASSIGNED" || event?.type === "TURN_SKIPPED";
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
  const pendingEventLosses = [];
  const pendingTolls = [];
  const reducedMotion = windowObject?.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
  const wait = (ms) => new Promise((resolve) => (windowObject?.setTimeout ?? globalThis.setTimeout)(resolve, ms));
  let rendererTarget = null;
  let latestState = null;
  let boardLayoutByNodeId = new Map();
  let tileModalObserver = null;
  let tollModalObserver = null;
  let choiceActionButton = null;
  let pendingChoiceTransferPreview = null;

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
      return projectClassicBoardPoint([layout.x, layout.y + 0.7, layout.z], viewportRect);
    }
    return null;
  }

  const moneyPresenter = createHudMoneyPresenter({
    documentObject,
    seatByPlayerId: playerSeatById,
    balanceByPlayerId: playerBalanceById,
    resolveBoardPoint: resolveBoardTransferPoint,
    reducedMotion,
    wait,
    requestFrame: typeof windowObject?.requestAnimationFrame === "function"
      ? windowObject.requestAnimationFrame.bind(windowObject)
      : null,
  });

  function reportPresentationError(error, eventType) {
    consoleObject?.error?.("Marble presentation timing failed", { eventType, error });
  }

  function isViewerPlayer(playerId) {
    const seat = playerSeatById.get(playerId);
    const viewerCard = documentObject?.querySelector?.('.player-hud-card[data-viewer="true"]');
    return Number.isInteger(Number(seat))
      && Number(viewerCard?.dataset?.seat) === Number(seat);
  }

  function deferredMoneyPlayerIds() {
    const playerIds = new Set(pendingEventLosses.map(({ event }) => event.playerId));
    for (const { event } of pendingTolls) {
      if (event?.playerId) playerIds.add(event.playerId);
      if (event?.creditorId) playerIds.add(event.creditorId);
    }
    return playerIds;
  }

  function syncPresentationState(state) {
    latestState = state;
    const deferredPlayerIds = deferredMoneyPlayerIds();
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
    syncHudMoneyBalances({ documentObject, seatByPlayerId: playerSeatById, balanceByPlayerId: playerBalanceById });
  }

  function removePendingEntry(collection, entry) {
    const index = collection.indexOf(entry);
    if (index >= 0) collection.splice(index, 1);
    const clearTimeoutFn = windowObject?.clearTimeout ?? globalThis.clearTimeout;
    if (entry?.timerId !== null && entry?.timerId !== undefined) clearTimeoutFn?.(entry.timerId);
  }

  function flushEventLoss(entry) {
    if (!pendingEventLosses.includes(entry)) return;
    removePendingEntry(pendingEventLosses, entry);
    void moneyPresenter.playLossBurst?.(entry.event)
      .catch((error) => reportPresentationError(error, entry.event?.type));
  }

  function flushOpenEventLosses() {
    const modal = documentObject?.querySelector?.("[data-tile-info-modal]");
    if (!modal?.open && !modal?.hasAttribute?.("open")) return;
    for (const entry of [...pendingEventLosses]) flushEventLoss(entry);
  }

  function deferEventLoss(event) {
    const setTimeoutFn = windowObject?.setTimeout ?? globalThis.setTimeout;
    const entry = { event, timerId: null };
    pendingEventLosses.push(entry);
    entry.timerId = setTimeoutFn?.(() => flushEventLoss(entry), MODAL_MONEY_FALLBACK_MS) ?? null;
    flushOpenEventLosses();
  }

  function flushToll(entry) {
    if (!pendingTolls.includes(entry) || entry.flushing) return;
    entry.flushing = true;
    const clearTimeoutFn = windowObject?.clearTimeout ?? globalThis.clearTimeout;
    if (entry.timerId !== null && entry.timerId !== undefined) {
      clearTimeoutFn?.(entry.timerId);
      entry.timerId = null;
    }
    void moneyPresenter.play(entry.event)
      .catch((error) => reportPresentationError(error, entry.event?.type))
      .finally(() => removePendingEntry(pendingTolls, entry));
  }

  function flushOpenTolls() {
    const modal = documentObject?.querySelector?.("[data-toll-notice-modal]");
    if (!modal?.open && !modal?.hasAttribute?.("open")) return;
    for (const entry of [...pendingTolls]) flushToll(entry);
  }

  function deferToll(event) {
    const setTimeoutFn = windowObject?.setTimeout ?? globalThis.setTimeout;
    const entry = { event, timerId: null, flushing: false };
    pendingTolls.push(entry);
    entry.timerId = setTimeoutFn?.(() => flushToll(entry), MODAL_MONEY_FALLBACK_MS) ?? null;
    flushOpenTolls();
  }

  function installModalObservers() {
    if (typeof MutationObserverObject !== "function") return;
    const tileModal = documentObject?.querySelector?.("[data-tile-info-modal]");
    if (tileModal && !tileModalObserver) {
      tileModalObserver = new MutationObserverObject(() => flushOpenEventLosses());
      tileModalObserver.observe(tileModal, { attributes: true, attributeFilter: ["open"] });
    }
    const tollModal = documentObject?.querySelector?.("[data-toll-notice-modal]");
    if (tollModal && !tollModalObserver) {
      tollModalObserver = new MutationObserverObject(() => flushOpenTolls());
      tollModalObserver.observe(tollModal, { attributes: true, attributeFilter: ["open"] });
    }
  }

  function transferPreviewKey(event) {
    return [event?.type, event?.playerId, event?.nodeId, Number(event?.amount) || 0].join("|");
  }

  function clearChoiceTransferPreview() {
    const clearTimeoutFn = windowObject?.clearTimeout ?? globalThis.clearTimeout;
    if (pendingChoiceTransferPreview?.timerId !== null && pendingChoiceTransferPreview?.timerId !== undefined) {
      clearTimeoutFn?.(pendingChoiceTransferPreview.timerId);
    }
    pendingChoiceTransferPreview = null;
  }

  function markChoiceTransferPreview(event) {
    clearChoiceTransferPreview();
    const setTimeoutFn = windowObject?.setTimeout ?? globalThis.setTimeout;
    pendingChoiceTransferPreview = {
      key: transferPreviewKey(event),
      timerId: setTimeoutFn?.(() => { pendingChoiceTransferPreview = null; }, CHOICE_TRANSFER_PREVIEW_TIMEOUT_MS) ?? null,
    };
  }

  function consumeChoiceTransferPreview(event) {
    if (!pendingChoiceTransferPreview || pendingChoiceTransferPreview.key !== transferPreviewKey(event)) return false;
    clearChoiceTransferPreview();
    return true;
  }

  function choiceTransferPreviewEvent() {
    const choice = latestState?.pendingChoice;
    const currentIndex = latestState?.currentPlayerIndex;
    const actor = currentIndex !== null && currentIndex !== undefined && Number.isInteger(Number(currentIndex))
      ? latestState?.players?.[Number(currentIndex)]
      : null;
    const action = choiceActionButton?.dataset?.action;
    if (!choice || !actor?.id || !isViewerPlayer(actor.id) || choiceActionButton?.disabled) return null;
    if (action === "buy" && choice.type === "BUY_PROPERTY") {
      if (Number(actor.money) < Number(choice.price)) return null;
      return { type: "PROPERTY_BOUGHT", playerId: actor.id, nodeId: choice.nodeId, amount: choice.price };
    }
    if (action === "build" && choice.type === "BUILD_PROPERTY") {
      if (Number(actor.money) < Number(choice.cost)) return null;
      return { type: "PROPERTY_BUILT", playerId: actor.id, nodeId: choice.nodeId, amount: choice.cost };
    }
    return null;
  }

  function previewChoiceTransfer() {
    const event = choiceTransferPreviewEvent();
    if (!event || typeof moneyPresenter.playTransfer !== "function") return;
    markChoiceTransferPreview(event);
    void moneyPresenter.playTransfer(event)
      .catch((error) => reportPresentationError(error, event.type));
  }

  function installChoiceTransferPreview() {
    if (choiceActionButton) return;
    choiceActionButton = documentObject?.querySelector?.("[data-tile-info-action]") ?? null;
    choiceActionButton?.addEventListener?.("click", previewChoiceTransfer, true);
  }

  async function playPendingStartDuringMovement(moveEvent) {
    const startEvents = pendingStartEvents.splice(0);
    if (!startEvents.length) return;
    const startNodeIds = new Set(
      (latestState?.board?.nodes ?? []).filter((node) => node?.type === "START").map((node) => node.id),
    );
    const delay = resolveStartCrossingDelay(moveEvent?.path, startNodeIds, { reducedMotion });
    if (delay > 0) await wait(delay);
    for (const event of startEvents) {
      await moneyPresenter.play(event);
    }
  }

  function createRestCelebrationElement(event) {
    const layer = documentObject.createElement("div");
    layer.className = "rest-turn-celebration";
    layer.setAttribute("role", "status");

    const card = documentObject.createElement("div");
    card.className = "rest-turn-celebration-card";

    const eyebrow = documentObject.createElement("span");
    eyebrow.className = "rest-turn-celebration-eyebrow";
    eyebrow.textContent = event?.type === "TURN_SKIPPED" ? "REST TURN" : "ISLAND REST";

    const title = documentObject.createElement("strong");
    title.className = "rest-turn-celebration-title";
    title.textContent = event?.type === "TURN_SKIPPED" ? "무인도 휴식 턴" : "무인도 도착!";

    const detail = documentObject.createElement("b");
    detail.className = "rest-turn-celebration-detail";
    detail.textContent = event?.type === "REST_ASSIGNED"
      ? `${Math.max(1, Number(event?.skipTurns) || 1)}턴 동안 쉬어갑니다`
      : "이번 턴은 이동 없이 휴식합니다";

    const player = latestState?.players?.find?.((candidate) => candidate.id === event?.playerId);
    const caption = documentObject.createElement("span");
    caption.className = "rest-turn-celebration-caption";
    caption.textContent = player?.name ? `${player.name} · 다음 기회를 기다려주세요` : "다음 기회를 기다려주세요";

    card.append(eyebrow, title, detail, caption);
    layer.append(card);
    return layer;
  }

  async function presentRestTurnCelebration(event) {
    if (!documentObject?.createElement || !documentObject?.body?.append) return;
    documentObject.querySelectorAll?.(".rest-turn-celebration").forEach((element) => element.remove());
    const layer = createRestCelebrationElement(event);
    documentObject.body.append(layer);
    await wait(REST_CELEBRATION_HOLD_MS);
    layer.dataset.state = "exit";
    await wait(reducedMotion ? 80 : 180);
    layer.remove();
  }

  return Object.freeze({
    async mount(targetElement) {
      rendererTarget = targetElement;
      const value = await renderer.mount(targetElement);
      installModalObservers();
      installChoiceTransferPreview();
      return value;
    },

    renderState(state) {
      syncPresentationState(state);
      return renderer.renderState(state);
    },

    async playEvent(event) {
      if (event?.type === "START_PASSED") {
        pendingStartEvents.push(event);
        return undefined;
      }
      if (event?.type === "PLAYER_MOVED" && pendingStartEvents.length) {
        const movementPromise = renderer.playEvent(event);
        const salaryPromise = playPendingStartDuringMovement(event);
        const [value] = await Promise.all([movementPromise, salaryPromise]);
        return value;
      }
      if (event?.type === "MONEY_PAID" && event?.reason === "TOLL" && isViewerPlayer(event.playerId)) {
        deferToll(event);
        return undefined;
      }
      if (event?.type === "MONEY_PAID" && event?.reason === "EVENT" && isViewerPlayer(event.playerId)) {
        deferEventLoss(event);
        return undefined;
      }
      if ((event?.type === "PROPERTY_BOUGHT" || event?.type === "PROPERTY_BUILT") && consumeChoiceTransferPreview(event)) {
        return renderer.playEvent({ ...event, presentationTransferPreviewed: true });
      }
      if (isRestEvent(event)) {
        const value = await renderer.playEvent(event);
        await presentRestTurnCelebration(event);
        return value;
      }
      return renderer.playEvent(event);
    },

    dispose() {
      tileModalObserver?.disconnect?.();
      tileModalObserver = null;
      tollModalObserver?.disconnect?.();
      tollModalObserver = null;
      choiceActionButton?.removeEventListener?.("click", previewChoiceTransfer, true);
      choiceActionButton = null;
      clearChoiceTransferPreview();
      for (const entry of [...pendingEventLosses]) removePendingEntry(pendingEventLosses, entry);
      for (const entry of [...pendingTolls]) removePendingEntry(pendingTolls, entry);
      pendingStartEvents.length = 0;
      rendererTarget = null;
      latestState = null;
      boardLayoutByNodeId.clear();
      playerSeatById.clear();
      playerBalanceById.clear();
      renderer.dispose();
    },
  });
}