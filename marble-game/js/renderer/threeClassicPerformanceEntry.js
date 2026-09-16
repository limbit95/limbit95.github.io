import * as THREE from "three";
import { installClassicShadowUpdatePolicy } from "./threeClassicPrototypeDiagnostics.js?v=20260915-r1";
import * as presentationTiming from "./threeClassicPresentationTiming.js?v=20260916-r1";
import {
  formatClassicMoneyBalance,
  formatClassicMoneyDelta,
  interpolateMoneyBalance,
  resolveMoneyTransferCoinCount,
  resolveMoneyTransferFlight,
} from "../presentation/moneyPresentation.js?v=20260912-r21";

installClassicShadowUpdatePolicy(THREE);

export * from "./threeClassicPresentationTiming.js?v=20260916-r1";

const PAYMENT_MODAL_FALLBACK_MS = 1600;
const PAYMENT_LOSS_LEAD_IN_MS = 220;
const PAYMENT_LOSS_COUNT_DOWN_MS = 1450;
const PAYMENT_LOSS_SETTLE_MS = 240;
const PAYMENT_TRANSFER_DURATION_MS = 780;

function isLocalPresentationMode(documentObject) {
  const mode = documentObject?.body?.dataset?.marbleBootstrapMode;
  return mode === "local-play" || mode === "full";
}

function markLocalPresentationViewer(documentObject, state, playerId) {
  if (!isLocalPresentationMode(documentObject) || !playerId) return;
  const player = state?.players?.find?.((candidate) => candidate.id === playerId);
  if (!player) return;

  documentObject?.querySelectorAll?.('.player-hud-card[data-viewer="true"]')
    .forEach((card) => delete card.dataset.viewer);
  const card = documentObject?.querySelector?.(`.player-hud-card[data-seat="${Number(player.seat) || 0}"]`);
  if (card?.dataset) card.dataset.viewer = "true";
}

function preserveChoiceTransferLayer(documentObject) {
  const layer = documentObject?.querySelector?.("[data-tile-info-modal] .money-transfer-layer");
  if (!layer || !documentObject?.body?.append) return;
  documentObject.body.append(layer);
}

function findPlayer(state, playerId) {
  return state?.players?.find?.((player) => player.id === playerId) ?? null;
}

function findHudCard(documentObject, state, playerId) {
  const player = findPlayer(state, playerId);
  if (!player) return null;
  return [...(documentObject?.querySelectorAll?.(".player-hud-card") ?? [])]
    .find((card) => Number(card?.dataset?.seat) === Number(player.seat)) ?? null;
}

function isPresentationViewer(documentObject, state, playerId) {
  const player = findPlayer(state, playerId);
  const viewerCard = documentObject?.querySelector?.('.player-hud-card[data-viewer="true"]');
  return Boolean(player && viewerCard && Number(viewerCard.dataset.seat) === Number(player.seat));
}

function resolveBalanceBefore(state, event) {
  const eventBalance = Number(event?.balanceBefore);
  if (Number.isFinite(eventBalance)) return eventBalance;
  const playerBalance = Number(findPlayer(state, event?.playerId)?.money);
  return Number.isFinite(playerBalance) ? playerBalance : Math.max(0, Number(event?.amount) || 0);
}

function elementCenter(element) {
  const rect = element?.getBoundingClientRect?.();
  if (!rect) return null;
  const left = Number(rect.left);
  const top = Number(rect.top);
  const width = Number(rect.width);
  const height = Number(rect.height);
  if (![left, top, width, height].every(Number.isFinite)) return null;
  return { x: left + (width / 2), y: top + (height / 2) };
}

function resolveTransferArc(flight) {
  const endX = Number(flight?.endX) || 0;
  const endY = Number(flight?.endY) || 0;
  const midX = Number(flight?.midX) || (endX * 0.5);
  const midY = Number(flight?.midY) || (endY * 0.5);
  const lift = Math.max(42, (endY * 0.5) - midY);
  const side = Math.min(22, Math.abs(endX) * 0.04) * (endX >= 0 ? 1 : -1);
  return {
    q1X: (endX * 0.28) - side,
    q1Y: (endY * 0.28) - (lift * 0.72),
    midX,
    midY,
    q3X: (endX * 0.76) + (side * 0.35),
    q3Y: (endY * 0.76) - (lift * 0.42),
  };
}

function transferFrames(flight) {
  const arc = resolveTransferArc(flight);
  return [
    { opacity: 0, transform: "translate(-50%, -50%) scale(0.68) rotate(0deg)" },
    { offset: 0.1, opacity: 1, transform: "translate(-50%, -50%) scale(0.98) rotate(70deg)" },
    {
      offset: 0.3,
      opacity: 1,
      transform: `translate(calc(-50% + ${Math.round(arc.q1X)}px), calc(-50% + ${Math.round(arc.q1Y)}px)) scale(1.08) rotate(150deg)`,
    },
    {
      offset: 0.56,
      opacity: 1,
      transform: `translate(calc(-50% + ${Math.round(arc.midX)}px), calc(-50% + ${Math.round(arc.midY)}px)) scale(1.14) rotate(300deg)`,
    },
    {
      offset: 0.82,
      opacity: 1,
      transform: `translate(calc(-50% + ${Math.round(arc.q3X)}px), calc(-50% + ${Math.round(arc.q3Y)}px)) scale(0.96) rotate(470deg)`,
    },
    {
      opacity: 1,
      transform: `translate(calc(-50% + ${Math.round(flight.endX)}px), calc(-50% + ${Math.round(flight.endY)}px)) scale(0.82) rotate(620deg)`,
    },
  ];
}

async function playCoinTransfer({
  documentObject,
  sourceElement,
  destinationElement,
  destinationCard = null,
  amount,
  host,
  reducedMotion,
  wait,
}) {
  const sourcePoint = elementCenter(sourceElement);
  const destinationPoint = elementCenter(destinationElement);
  if (!sourcePoint || !destinationPoint) return;

  if (sourceElement?.dataset) sourceElement.dataset.moneyTransferSource = "true";
  if (reducedMotion || !documentObject?.createElement) {
    if (destinationCard?.dataset) destinationCard.dataset.moneyTransferImpact = "true";
    await wait(180);
    if (sourceElement?.dataset) delete sourceElement.dataset.moneyTransferSource;
    if (destinationCard?.dataset) delete destinationCard.dataset.moneyTransferImpact;
    return;
  }

  const layerHost = host?.append ? host : documentObject?.body;
  if (!layerHost?.append) return;
  const layer = documentObject.createElement("div");
  layer.className = "money-transfer-layer";
  layer.setAttribute("aria-hidden", "true");
  const previousOverflow = layerHost.style?.overflow ?? "";
  if (layerHost.style) layerHost.style.overflow = "visible";
  layerHost.append(layer);

  const coinCount = resolveMoneyTransferCoinCount(amount);
  const animations = [];
  let fallbackNeeded = false;
  for (let index = 0; index < coinCount; index += 1) {
    const flight = resolveMoneyTransferFlight(sourcePoint, destinationPoint, index, coinCount);
    const coin = documentObject.createElement("span");
    coin.className = "money-transfer-coin";
    coin.setAttribute("aria-hidden", "true");
    coin.style.left = `${Math.round(flight.startX)}px`;
    coin.style.top = `${Math.round(flight.startY)}px`;
    layer.append(coin);

    if (typeof coin.animate === "function") {
      const animation = coin.animate(transferFrames(flight), {
        duration: PAYMENT_TRANSFER_DURATION_MS,
        delay: flight.delayMs,
        easing: "cubic-bezier(0.18, 0.78, 0.22, 1)",
        fill: "both",
      });
      animations.push(animation?.finished?.catch?.(() => undefined) ?? Promise.resolve());
    } else {
      fallbackNeeded = true;
      coin.dataset.moneyTransferFallback = "true";
      coin.style.setProperty("--money-transfer-mid-x", `${Math.round(flight.midX)}px`);
      coin.style.setProperty("--money-transfer-mid-y", `${Math.round(flight.midY)}px`);
      coin.style.setProperty("--money-transfer-end-x", `${Math.round(flight.endX)}px`);
      coin.style.setProperty("--money-transfer-end-y", `${Math.round(flight.endY)}px`);
      coin.style.setProperty("--money-transfer-duration", `${PAYMENT_TRANSFER_DURATION_MS}ms`);
      coin.style.setProperty("--money-transfer-delay", `${flight.delayMs}ms`);
    }
  }

  if (fallbackNeeded || animations.length !== coinCount) {
    const lastDelay = Math.max(0, coinCount - 1) * 68;
    await wait(PAYMENT_TRANSFER_DURATION_MS + lastDelay + 100);
  } else {
    await Promise.all(animations);
  }

  if (destinationCard?.dataset) destinationCard.dataset.moneyTransferImpact = "true";
  await wait(220);
  layer.remove();
  if (layerHost.style) layerHost.style.overflow = previousOverflow;
  if (sourceElement?.dataset) delete sourceElement.dataset.moneyTransferSource;
  if (destinationCard?.dataset) delete destinationCard.dataset.moneyTransferImpact;
}

async function animateBalance({
  element,
  fromValue,
  toValue,
  durationMs,
  reducedMotion,
  requestFrame,
  wait,
  onValue = null,
}) {
  if (!element) return;
  element.textContent = formatClassicMoneyBalance(fromValue);
  onValue?.(fromValue);

  if (reducedMotion || fromValue === toValue || typeof requestFrame !== "function") {
    element.textContent = formatClassicMoneyBalance(toValue);
    onValue?.(toValue);
    if (reducedMotion) await wait(180);
    return;
  }

  await new Promise((resolve) => {
    let startedAt = null;
    function frame(timestamp) {
      const currentTimestamp = Number(timestamp);
      const safeTimestamp = Number.isFinite(currentTimestamp) ? currentTimestamp : (startedAt ?? 0);
      if (startedAt === null) startedAt = safeTimestamp;
      const progress = Math.min(1, Math.max(0, (safeTimestamp - startedAt) / durationMs));
      const value = interpolateMoneyBalance(fromValue, toValue, progress);
      element.textContent = formatClassicMoneyBalance(value);
      onValue?.(value);
      if (progress >= 1) {
        resolve();
        return;
      }
      requestFrame(frame);
    }
    requestFrame(frame);
  });
}

function createLossCard(documentObject, label, value, role) {
  const card = documentObject.createElement("div");
  card.className = "payment-loss-flow__card";
  card.dataset.role = role;

  const caption = documentObject.createElement("span");
  caption.textContent = label;
  const amount = documentObject.createElement("strong");
  amount.textContent = value;

  card.append(caption, amount);
  return { card, amount };
}

function createPaymentLossFlow(documentObject, {
  container,
  balanceBefore,
  amount,
  deductionLabel,
  insertBefore = null,
}) {
  if (!container?.append || !documentObject?.createElement) return null;

  container.querySelectorAll?.("[data-payment-loss-flow]").forEach((element) => element.remove());

  const flow = documentObject.createElement("div");
  flow.className = "payment-loss-flow";
  flow.setAttribute("data-payment-loss-flow", "true");
  flow.dataset.state = "ready";

  const before = createLossCard(
    documentObject,
    "차감 전",
    formatClassicMoneyBalance(balanceBefore),
    "before",
  );
  const deduction = createLossCard(
    documentObject,
    deductionLabel,
    formatClassicMoneyDelta(-amount),
    "deduction",
  );
  const remaining = createLossCard(
    documentObject,
    "남은 골드",
    formatClassicMoneyBalance(balanceBefore),
    "remaining",
  );

  const minus = documentObject.createElement("span");
  minus.className = "payment-loss-flow__operator";
  minus.setAttribute("aria-hidden", "true");
  minus.textContent = "−";

  const equals = documentObject.createElement("span");
  equals.className = "payment-loss-flow__operator";
  equals.setAttribute("aria-hidden", "true");
  equals.textContent = "=";

  const meter = documentObject.createElement("span");
  meter.className = "payment-loss-flow__meter";
  meter.setAttribute("aria-hidden", "true");
  const meterFill = documentObject.createElement("i");
  meter.append(meterFill);
  remaining.card.append(meter);

  flow.append(before.card, minus, deduction.card, equals, remaining.card);
  if (insertBefore?.before) insertBefore.before(flow);
  else container.append(flow);

  return {
    flow,
    beforeHost: before.card,
    deductionHost: deduction.card,
    remainingHost: remaining.card,
    remainingElement: remaining.amount,
    meterFill,
  };
}

function removeLegacyTileMoneyRows(stats) {
  for (const row of [...(stats?.children ?? [])]) {
    const label = row.querySelector?.("dt")?.textContent?.trim?.();
    if (["골드 변화", "내 보유 골드", "차감 골드"].includes(label)) row.remove();
  }
}

function prepareTileLossDisplay(documentObject, balanceBefore, amount, deductionLabel) {
  const modal = documentObject?.querySelector?.("[data-tile-info-modal]");
  const stats = documentObject?.querySelector?.("[data-tile-info-stats]");
  if (!modal || !stats?.append) return null;

  removeLegacyTileMoneyRows(stats);
  const display = createPaymentLossFlow(documentObject, {
    container: stats,
    balanceBefore,
    amount,
    deductionLabel,
  });
  return display ? { ...display, modal } : null;
}

function prepareTollLossDisplay(documentObject, balanceBefore, amount) {
  const modal = documentObject?.querySelector?.("[data-toll-notice-modal]");
  const amountCard = documentObject?.querySelector?.(".toll-notice-modal__amount");
  const balanceContainer = documentObject?.querySelector?.(".toll-notice-modal__balance");
  const effect = documentObject?.querySelector?.(".toll-notice-modal__effect");
  if (!modal || !amountCard || !balanceContainer) return null;

  amountCard.hidden = true;
  balanceContainer.hidden = true;

  const display = createPaymentLossFlow(documentObject, {
    container: modal,
    balanceBefore,
    amount,
    deductionLabel: "지불 통행료",
    insertBefore: effect,
  });
  return display ? { ...display, modal } : null;
}

export function createClassicThreePrototypeRenderer(options = {}, runtime = {}) {
  const documentObject = runtime.documentObject ?? globalThis.document;
  const windowObject = runtime.windowObject ?? globalThis.window;
  const consoleObject = runtime.consoleObject ?? globalThis.console;
  const MutationObserverObject = runtime.MutationObserverObject
    ?? windowObject?.MutationObserver
    ?? globalThis.MutationObserver;
  const renderer = presentationTiming.createClassicThreePrototypeRenderer(options, runtime);
  const reducedMotion = windowObject?.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
  const wait = (ms) => new Promise((resolve) => (windowObject?.setTimeout ?? globalThis.setTimeout)(resolve, ms));
  const requestFrame = typeof windowObject?.requestAnimationFrame === "function"
    ? windowObject.requestAnimationFrame.bind(windowObject)
    : null;
  const pendingTolls = [];
  const pendingEventLosses = [];
  const pendingTaxLosses = [];
  let latestState = null;
  let choiceActionButton = null;
  let tollModalObserver = null;
  let eventModalObserver = null;

  function reportPaymentPresentationError(error, eventType) {
    consoleObject?.error?.("Marble payment presentation failed", { eventType, error });
  }

  function removePending(collection, entry) {
    const index = collection.indexOf(entry);
    if (index >= 0) collection.splice(index, 1);
    const clearTimeoutFn = windowObject?.clearTimeout ?? globalThis.clearTimeout;
    if (entry?.timerId !== null && entry?.timerId !== undefined) clearTimeoutFn?.(entry.timerId);
  }

  async function playHudToHudTransfer(event, state, host = null) {
    const payerCard = findHudCard(documentObject, state, event?.playerId);
    const ownerCard = findHudCard(documentObject, state, event?.creditorId);
    if (!payerCard || !ownerCard) return;
    await playCoinTransfer({
      documentObject,
      sourceElement: payerCard,
      destinationElement: ownerCard,
      destinationCard: ownerCard,
      amount: event.amount,
      host,
      reducedMotion,
      wait,
    });
  }

  async function presentUnifiedLoss(entry, kind) {
    const amount = Math.max(0, Number(entry.event?.amount) || 0);
    const balanceBefore = Math.max(0, Number(entry.balanceBefore) || 0);
    const balanceAfter = Math.max(0, balanceBefore - amount);
    const display = kind === "TOLL"
      ? prepareTollLossDisplay(documentObject, balanceBefore, amount)
      : prepareTileLossDisplay(
        documentObject,
        balanceBefore,
        amount,
        kind === "EVENT" ? "이벤트 비용" : "이용 비용",
      );

    if (!display) {
      if (kind === "TOLL") await playHudToHudTransfer(entry.event, latestState ?? entry.state);
      return;
    }

    display.flow.dataset.state = "active";
    await wait(reducedMotion ? 60 : PAYMENT_LOSS_LEAD_IN_MS);

    display.deductionHost.dataset.state = "active";
    display.remainingHost.dataset.moneyLossCounting = "true";

    const stateForTransfer = latestState ?? entry.state;
    const transferPromise = kind === "TOLL"
      ? playHudToHudTransfer(entry.event, stateForTransfer, display.modal)
      : Promise.resolve();

    await Promise.all([
      animateBalance({
        element: display.remainingElement,
        fromValue: balanceBefore,
        toValue: balanceAfter,
        durationMs: PAYMENT_LOSS_COUNT_DOWN_MS,
        reducedMotion,
        requestFrame,
        wait,
        onValue(value) {
          const ratio = balanceBefore > 0 ? Math.max(0, Math.min(1, value / balanceBefore)) : 0;
          display.meterFill?.style?.setProperty("--payment-loss-ratio", String(ratio));
        },
      }),
      transferPromise,
    ]);

    delete display.remainingHost.dataset.moneyLossCounting;
    display.flow.dataset.state = "settled";
    await wait(reducedMotion ? 60 : PAYMENT_LOSS_SETTLE_MS);
  }

  function flushToll(entry) {
    if (!pendingTolls.includes(entry) || entry.flushing) return;
    entry.flushing = true;
    void presentUnifiedLoss(entry, "TOLL")
      .catch((error) => reportPaymentPresentationError(error, entry.event?.type))
      .finally(() => removePending(pendingTolls, entry));
  }

  function flushEventLoss(entry) {
    if (!pendingEventLosses.includes(entry) || entry.flushing) return;
    entry.flushing = true;
    void presentUnifiedLoss(entry, "EVENT")
      .catch((error) => reportPaymentPresentationError(error, entry.event?.type))
      .finally(() => removePending(pendingEventLosses, entry));
  }

  function flushTaxLoss(entry) {
    if (!pendingTaxLosses.includes(entry) || entry.flushing) return;
    entry.flushing = true;
    void presentUnifiedLoss(entry, "TAX")
      .catch((error) => reportPaymentPresentationError(error, entry.event?.type))
      .finally(() => removePending(pendingTaxLosses, entry));
  }

  function flushOpenTolls() {
    const modal = documentObject?.querySelector?.("[data-toll-notice-modal]");
    if (!modal?.open && !modal?.hasAttribute?.("open")) return;
    for (const entry of [...pendingTolls]) flushToll(entry);
  }

  function flushOpenTileLosses() {
    const modal = documentObject?.querySelector?.("[data-tile-info-modal]");
    if (!modal?.open && !modal?.hasAttribute?.("open")) return;
    for (const entry of [...pendingEventLosses]) flushEventLoss(entry);
    for (const entry of [...pendingTaxLosses]) flushTaxLoss(entry);
  }

  function createPendingEntry(event) {
    return {
      event,
      state: latestState,
      balanceBefore: resolveBalanceBefore(latestState, event),
      timerId: null,
      flushing: false,
    };
  }

  function deferToll(event) {
    const setTimeoutFn = windowObject?.setTimeout ?? globalThis.setTimeout;
    const entry = createPendingEntry(event);
    pendingTolls.push(entry);
    entry.timerId = setTimeoutFn?.(() => flushToll(entry), PAYMENT_MODAL_FALLBACK_MS) ?? null;
    flushOpenTolls();
  }

  function deferEventLoss(event) {
    const setTimeoutFn = windowObject?.setTimeout ?? globalThis.setTimeout;
    const entry = createPendingEntry(event);
    pendingEventLosses.push(entry);
    entry.timerId = setTimeoutFn?.(() => flushEventLoss(entry), PAYMENT_MODAL_FALLBACK_MS) ?? null;
    flushOpenTileLosses();
  }

  function deferTaxLoss(event) {
    const setTimeoutFn = windowObject?.setTimeout ?? globalThis.setTimeout;
    const entry = createPendingEntry(event);
    pendingTaxLosses.push(entry);
    entry.timerId = setTimeoutFn?.(() => flushTaxLoss(entry), PAYMENT_MODAL_FALLBACK_MS) ?? null;
    flushOpenTileLosses();
  }

  function installPaymentObservers() {
    if (typeof MutationObserverObject !== "function") return;
    const tollModal = documentObject?.querySelector?.("[data-toll-notice-modal]");
    if (tollModal && !tollModalObserver) {
      tollModalObserver = new MutationObserverObject(() => flushOpenTolls());
      tollModalObserver.observe(tollModal, { attributes: true, attributeFilter: ["open"] });
    }

    const eventModal = documentObject?.querySelector?.("[data-tile-info-modal]");
    if (eventModal && !eventModalObserver) {
      eventModalObserver = new MutationObserverObject(() => flushOpenTileLosses());
      eventModalObserver.observe(eventModal, { attributes: true, attributeFilter: ["open"] });
    }
  }

  function handleChoiceTransferCapture() {
    preserveChoiceTransferLayer(documentObject);
  }

  return Object.freeze({
    async mount(targetElement) {
      const value = await renderer.mount(targetElement);
      choiceActionButton = documentObject?.querySelector?.("[data-tile-info-action]") ?? null;
      choiceActionButton?.addEventListener?.("click", handleChoiceTransferCapture, true);
      installPaymentObservers();
      return value;
    },

    renderState(state) {
      latestState = state;
      const value = renderer.renderState(state);
      const currentPlayer = state?.currentPlayerIndex === null || state?.currentPlayerIndex === undefined
        ? null
        : state?.players?.[Number(state.currentPlayerIndex)] ?? null;
      markLocalPresentationViewer(documentObject, state, currentPlayer?.id);
      return value;
    },

    playEvent(event) {
      markLocalPresentationViewer(documentObject, latestState, event?.playerId);

      if (event?.type === "MONEY_PAID" && event?.reason === "TOLL" && event?.creditorId) {
        if (isPresentationViewer(documentObject, latestState, event.playerId)) {
          deferToll(event);
          return undefined;
        }
        return playHudToHudTransfer(event, latestState)
          .catch((error) => reportPaymentPresentationError(error, event.type));
      }

      if (
        event?.type === "MONEY_PAID"
        && event?.reason === "EVENT"
        && isPresentationViewer(documentObject, latestState, event.playerId)
      ) {
        deferEventLoss(event);
        return undefined;
      }

      if (
        event?.type === "MONEY_PAID"
        && event?.reason !== "EVENT"
        && !event?.creditorId
        && isPresentationViewer(documentObject, latestState, event.playerId)
      ) {
        deferTaxLoss(event);
        return undefined;
      }

      return renderer.playEvent(event);
    },

    dispose() {
      choiceActionButton?.removeEventListener?.("click", handleChoiceTransferCapture, true);
      choiceActionButton = null;
      tollModalObserver?.disconnect?.();
      tollModalObserver = null;
      eventModalObserver?.disconnect?.();
      eventModalObserver = null;
      for (const entry of [...pendingTolls]) removePending(pendingTolls, entry);
      for (const entry of [...pendingEventLosses]) removePending(pendingEventLosses, entry);
      for (const entry of [...pendingTaxLosses]) removePending(pendingTaxLosses, entry);
      latestState = null;
      renderer.dispose();
    },
  });
}
