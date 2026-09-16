import {
  createClassicThreePrototypeRenderer as createBaseClassicThreePrototypeRenderer,
} from "./threeClassicPerformanceEntry.js?v=20260916-r4-base";
import {
  formatClassicMoneyBalance,
  formatClassicMoneyDelta,
  interpolateMoneyBalance,
  resolveMoneyTransferCoinCount,
  resolveMoneyTransferFlight,
} from "../presentation/moneyPresentation.js?v=20260912-r21";

export * from "./threeClassicPerformanceEntry.js?v=20260916-r4-base";

const DEDUCTION_MODAL_FALLBACK_MS = 1800;
const DEDUCTION_ANTICIPATION_MS = 240;
const DEDUCTION_COUNTDOWN_MS = 1600;
const DEDUCTION_SETTLE_MS = 260;
const DEDUCTION_TRANSFER_DURATION_MS = 820;

function isDeductionEvent(event) {
  return event?.type === "MONEY_PAID" && ["TOLL", "EVENT", "TAX"].includes(event?.reason);
}

function reasonLabel(event) {
  if (event?.reason === "TOLL") return "지불 통행료";
  if (event?.reason === "EVENT") return "이벤트 차감";
  if (event?.reason === "TAX") return "이용료 차감";
  return "차감 골드";
}

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
  if (Number.isFinite(eventBalance)) return Math.max(0, eventBalance);
  const tracked = Number(findPlayer(state, event?.playerId)?.money);
  const amount = Math.max(0, Number(event?.amount) || 0);
  return Number.isFinite(tracked) ? Math.max(0, tracked) : amount;
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

function transferFrames(flight) {
  return [
    { opacity: 0, transform: "translate(-50%, -50%) scale(0.68) rotate(0deg)" },
    { offset: 0.12, opacity: 1, transform: "translate(-50%, -50%) scale(0.98) rotate(70deg)" },
    {
      offset: 0.52,
      opacity: 1,
      transform: `translate(calc(-50% + ${Math.round(flight.midX)}px), calc(-50% + ${Math.round(flight.midY)}px)) scale(1.18) rotate(250deg)`,
    },
    {
      opacity: 1,
      transform: `translate(calc(-50% + ${Math.round(flight.endX)}px), calc(-50% + ${Math.round(flight.endY)}px)) scale(0.84) rotate(560deg)`,
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
        duration: DEDUCTION_TRANSFER_DURATION_MS,
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
      coin.style.setProperty("--money-transfer-duration", `${DEDUCTION_TRANSFER_DURATION_MS}ms`);
      coin.style.setProperty("--money-transfer-delay", `${flight.delayMs}ms`);
    }
  }

  if (fallbackNeeded || animations.length !== coinCount) {
    await wait(DEDUCTION_TRANSFER_DURATION_MS + (Math.max(0, coinCount - 1) * 68) + 100);
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

function createFlowCard(documentObject, className, label, value) {
  const card = documentObject.createElement("div");
  card.className = `deduction-feedback__card ${className}`;
  const term = documentObject.createElement("span");
  term.className = "deduction-feedback__label";
  term.textContent = label;
  const amount = documentObject.createElement("strong");
  amount.className = "deduction-feedback__value";
  amount.textContent = value;
  card.append(term, amount);
  return { card, amount };
}

function createDeductionFeedback(documentObject, {
  modal,
  mount,
  event,
  balanceBefore,
}) {
  if (!modal || !mount?.append || !documentObject?.createElement) return null;
  modal.querySelectorAll?.("[data-unified-deduction-feedback]").forEach((element) => element.remove());

  const amount = Math.max(0, Number(event?.amount) || 0);
  const balanceAfter = Math.max(0, balanceBefore - amount);
  const root = documentObject.createElement("div");
  root.className = "deduction-feedback";
  root.setAttribute("data-unified-deduction-feedback", "true");
  root.dataset.reason = String(event?.reason ?? "COST").toLowerCase();
  root.dataset.state = "ready";

  const before = createFlowCard(
    documentObject,
    "deduction-feedback__card--before",
    "차감 전 보유 골드",
    formatClassicMoneyBalance(balanceBefore),
  );
  const cost = createFlowCard(
    documentObject,
    "deduction-feedback__card--cost",
    reasonLabel(event),
    formatClassicMoneyDelta(-amount),
  );
  const remaining = createFlowCard(
    documentObject,
    "deduction-feedback__card--remaining",
    "남은 보유 골드",
    formatClassicMoneyBalance(balanceBefore),
  );
  cost.card.setAttribute("data-deduction-cost-card", "true");
  remaining.card.setAttribute("data-deduction-remaining-card", "true");

  const minus = documentObject.createElement("span");
  minus.className = "deduction-feedback__operator";
  minus.setAttribute("aria-hidden", "true");
  minus.textContent = "−";
  const equals = documentObject.createElement("span");
  equals.className = "deduction-feedback__operator";
  equals.setAttribute("aria-hidden", "true");
  equals.textContent = "=";

  const meter = documentObject.createElement("span");
  meter.className = "deduction-feedback__meter";
  meter.setAttribute("aria-hidden", "true");
  const meterFill = documentObject.createElement("span");
  meterFill.className = "deduction-feedback__meter-fill";
  meter.append(meterFill);
  remaining.card.append(meter);

  root.append(before.card, minus, cost.card, equals, remaining.card);
  mount.append(root);

  return {
    root,
    costCard: cost.card,
    remainingCard: remaining.card,
    remainingValue: remaining.amount,
    meterFill,
    balanceAfter,
  };
}

function prepareDeductionDisplay(documentObject, event, balanceBefore) {
  if (event?.reason === "TOLL") {
    const modal = documentObject?.querySelector?.("[data-toll-notice-modal]");
    const owner = documentObject?.querySelector?.(".toll-notice-modal__owner");
    const amount = documentObject?.querySelector?.(".toll-notice-modal__amount");
    const balance = documentObject?.querySelector?.(".toll-notice-modal__balance");
    if (!modal || !owner) return null;
    if (amount) amount.hidden = true;
    if (balance) balance.hidden = true;
    let mount = modal.querySelector?.("[data-deduction-mount]");
    if (!mount) {
      mount = documentObject.createElement("div");
      mount.className = "deduction-feedback__mount";
      mount.setAttribute("data-deduction-mount", "true");
      owner.after(mount);
    }
    return {
      modal,
      ...createDeductionFeedback(documentObject, { modal, mount, event, balanceBefore }),
    };
  }

  const modal = documentObject?.querySelector?.("[data-tile-info-modal]");
  const stats = documentObject?.querySelector?.("[data-tile-info-stats]");
  if (!modal || !stats) return null;
  for (const row of [...(stats.children ?? [])]) {
    const label = row.querySelector?.("dt")?.textContent?.trim?.();
    if (["골드 변화", "내 보유 골드", "차감 골드"].includes(label)) row.remove();
  }
  return {
    modal,
    ...createDeductionFeedback(documentObject, { modal, mount: stats, event, balanceBefore }),
  };
}

async function animateDeductionBalance({
  display,
  balanceBefore,
  reducedMotion,
  requestFrame,
  wait,
}) {
  if (!display?.remainingValue) return;
  const balanceAfter = display.balanceAfter;
  display.remainingValue.textContent = formatClassicMoneyBalance(balanceBefore);
  display.meterFill?.style?.setProperty?.("--deduction-meter-progress", "1");

  await wait(reducedMotion ? 60 : DEDUCTION_ANTICIPATION_MS);
  display.root.dataset.state = "deducting";

  if (reducedMotion || balanceBefore === balanceAfter || typeof requestFrame !== "function") {
    display.remainingValue.textContent = formatClassicMoneyBalance(balanceAfter);
    const ratio = balanceBefore > 0 ? balanceAfter / balanceBefore : 0;
    display.meterFill?.style?.setProperty?.("--deduction-meter-progress", String(Math.max(0, Math.min(1, ratio))));
    await wait(reducedMotion ? 120 : DEDUCTION_SETTLE_MS);
    display.root.dataset.state = "settled";
    return;
  }

  await new Promise((resolve) => {
    let startedAt = null;
    function frame(timestamp) {
      const currentTimestamp = Number(timestamp);
      const safeTimestamp = Number.isFinite(currentTimestamp) ? currentTimestamp : (startedAt ?? 0);
      if (startedAt === null) startedAt = safeTimestamp;
      const progress = Math.min(1, Math.max(0, (safeTimestamp - startedAt) / DEDUCTION_COUNTDOWN_MS));
      const value = interpolateMoneyBalance(balanceBefore, balanceAfter, progress);
      display.remainingValue.textContent = formatClassicMoneyBalance(value);
      const ratio = balanceBefore > 0 ? value / balanceBefore : 0;
      display.meterFill?.style?.setProperty?.("--deduction-meter-progress", String(Math.max(0, Math.min(1, ratio))));
      if (progress >= 1) {
        resolve();
        return;
      }
      requestFrame(frame);
    }
    requestFrame(frame);
  });

  display.root.dataset.state = "settled";
  await wait(DEDUCTION_SETTLE_MS);
}

export function createClassicThreePrototypeRenderer(options = {}, runtime = {}) {
  const documentObject = runtime.documentObject ?? globalThis.document;
  const windowObject = runtime.windowObject ?? globalThis.window;
  const consoleObject = runtime.consoleObject ?? globalThis.console;
  const MutationObserverObject = runtime.MutationObserverObject
    ?? windowObject?.MutationObserver
    ?? globalThis.MutationObserver;
  const renderer = createBaseClassicThreePrototypeRenderer(options, runtime);
  const reducedMotion = windowObject?.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
  const wait = (ms) => new Promise((resolve) => (windowObject?.setTimeout ?? globalThis.setTimeout)(resolve, ms));
  const requestFrame = typeof windowObject?.requestAnimationFrame === "function"
    ? windowObject.requestAnimationFrame.bind(windowObject)
    : null;
  const pendingDeductions = [];
  let latestState = null;
  let tileModalObserver = null;
  let tollModalObserver = null;

  function reportError(error, eventType) {
    consoleObject?.error?.("Marble unified deduction presentation failed", { eventType, error });
  }

  function removePending(entry) {
    const index = pendingDeductions.indexOf(entry);
    if (index >= 0) pendingDeductions.splice(index, 1);
    const clearTimeoutFn = windowObject?.clearTimeout ?? globalThis.clearTimeout;
    if (entry?.timerId !== null && entry?.timerId !== undefined) clearTimeoutFn?.(entry.timerId);
  }

  function modalForEvent(event) {
    return event?.reason === "TOLL"
      ? documentObject?.querySelector?.("[data-toll-notice-modal]")
      : documentObject?.querySelector?.("[data-tile-info-modal]");
  }

  function modalIsOpen(modal) {
    return Boolean(modal?.open || modal?.hasAttribute?.("open"));
  }

  async function playContextTransfer(entry, display) {
    const state = latestState ?? entry.state;
    const payerCard = findHudCard(documentObject, state, entry.event?.playerId);
    if (!payerCard) return;

    if (entry.event?.reason === "TOLL") {
      const ownerCard = findHudCard(documentObject, state, entry.event?.creditorId);
      if (!ownerCard) return;
      return playCoinTransfer({
        documentObject,
        sourceElement: payerCard,
        destinationElement: ownerCard,
        destinationCard: ownerCard,
        amount: entry.event.amount,
        host: display.modal,
        reducedMotion,
        wait,
      });
    }

    return playCoinTransfer({
      documentObject,
      sourceElement: payerCard,
      destinationElement: display.costCard,
      destinationCard: display.costCard,
      amount: entry.event.amount,
      host: display.modal,
      reducedMotion,
      wait,
    });
  }

  async function presentDeduction(entry) {
    const balanceBefore = Math.max(0, Number(entry.balanceBefore) || 0);
    const display = prepareDeductionDisplay(documentObject, entry.event, balanceBefore);
    if (!display?.root) {
      return renderer.playEvent(entry.event);
    }

    await Promise.all([
      animateDeductionBalance({
        display,
        balanceBefore,
        reducedMotion,
        requestFrame,
        wait,
      }),
      (async () => {
        await wait(reducedMotion ? 40 : DEDUCTION_ANTICIPATION_MS);
        await playContextTransfer(entry, display);
      })(),
    ]);
  }

  function flushEntry(entry) {
    if (!pendingDeductions.includes(entry) || entry.flushing) return;
    const modal = modalForEvent(entry.event);
    if (!modalIsOpen(modal)) return;
    entry.flushing = true;
    void presentDeduction(entry)
      .catch((error) => reportError(error, entry.event?.type))
      .finally(() => removePending(entry));
  }

  function flushOpenDeductions() {
    for (const entry of [...pendingDeductions]) flushEntry(entry);
  }

  function deferDeduction(event) {
    const setTimeoutFn = windowObject?.setTimeout ?? globalThis.setTimeout;
    const entry = {
      event,
      state: latestState,
      balanceBefore: resolveBalanceBefore(latestState, event),
      timerId: null,
      flushing: false,
    };
    pendingDeductions.push(entry);
    entry.timerId = setTimeoutFn?.(() => {
      if (!pendingDeductions.includes(entry) || entry.flushing) return;
      const modal = modalForEvent(entry.event);
      if (modalIsOpen(modal)) {
        flushEntry(entry);
        return;
      }
      entry.flushing = true;
      Promise.resolve(renderer.playEvent(entry.event))
        .catch((error) => reportError(error, entry.event?.type))
        .finally(() => removePending(entry));
    }, DEDUCTION_MODAL_FALLBACK_MS) ?? null;
    flushEntry(entry);
  }

  function installObservers() {
    if (typeof MutationObserverObject !== "function") return;
    const tileModal = documentObject?.querySelector?.("[data-tile-info-modal]");
    if (tileModal && !tileModalObserver) {
      tileModalObserver = new MutationObserverObject(flushOpenDeductions);
      tileModalObserver.observe(tileModal, { attributes: true, attributeFilter: ["open"] });
    }
    const tollModal = documentObject?.querySelector?.("[data-toll-notice-modal]");
    if (tollModal && !tollModalObserver) {
      tollModalObserver = new MutationObserverObject(flushOpenDeductions);
      tollModalObserver.observe(tollModal, { attributes: true, attributeFilter: ["open"] });
    }
  }

  return Object.freeze({
    async mount(targetElement) {
      const value = await renderer.mount(targetElement);
      installObservers();
      return value;
    },

    renderState(state) {
      latestState = state;
      const currentPlayer = state?.currentPlayerIndex === null || state?.currentPlayerIndex === undefined
        ? null
        : state?.players?.[Number(state.currentPlayerIndex)] ?? null;
      markLocalPresentationViewer(documentObject, state, currentPlayer?.id);
      return renderer.renderState(state);
    },

    playEvent(event) {
      markLocalPresentationViewer(documentObject, latestState, event?.playerId);
      if (isDeductionEvent(event) && isPresentationViewer(documentObject, latestState, event.playerId)) {
        deferDeduction(event);
        return undefined;
      }
      return renderer.playEvent(event);
    },

    dispose() {
      tileModalObserver?.disconnect?.();
      tileModalObserver = null;
      tollModalObserver?.disconnect?.();
      tollModalObserver = null;
      for (const entry of [...pendingDeductions]) removePending(entry);
      pendingDeductions.length = 0;
      latestState = null;
      renderer.dispose();
    },
  });
}
