const MONEY_EVENT_TYPES = new Set([
  "START_PASSED",
  "MONEY_PAID",
  "MONEY_RECEIVED",
  "PROPERTY_BOUGHT",
  "PROPERTY_BUILT",
]);

function normalizeAmount(value) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

function gainLabel(event) {
  if (event.type === "START_PASSED") return "START 보상";
  if (event.reason === "EVENT") return "이벤트 보상";
  if (event.reason === "BONUS") return "보너스";
  return "획득";
}

function lossLabel(event) {
  if (event.type === "PROPERTY_BOUGHT") return "도시 구매";
  if (event.type === "PROPERTY_BUILT") return "건설 비용";
  if (event.reason === "TOLL") return "통행료 지불";
  if (event.reason === "TAX") return "세금";
  if (event.reason === "EVENT") return "이벤트 지출";
  return "지출";
}

function playerEndpoint(playerId) {
  return Object.freeze({ kind: "player", playerId });
}

function tileEndpoint(nodeId) {
  return Object.freeze({ kind: "tile", nodeId });
}

const BOARD_CENTER_ENDPOINT = Object.freeze({ kind: "board-center" });
const MODAL_MONEY_CARD_ENDPOINT = Object.freeze({ kind: "modal-money-card" });
const DEFAULT_TRANSFER_STAGGER_MS = 68;
const TILE_TRANSFER_STAGGER_MS = 30;

export function createMoneyPresentationPlan(event) {
  if (!MONEY_EVENT_TYPES.has(event?.type)) return [];
  const amount = normalizeAmount(event.amount);
  if (!amount || !event.playerId) return [];

  if (event.type === "START_PASSED" || event.type === "MONEY_RECEIVED") {
    return [{
      playerId: event.playerId,
      tone: "gain",
      signedAmount: amount,
      label: gainLabel(event),
    }];
  }

  const steps = [{
    playerId: event.playerId,
    tone: "loss",
    signedAmount: -amount,
    label: lossLabel(event),
  }];
  if (event.type === "MONEY_PAID" && event.creditorId) {
    steps.push({
      playerId: event.creditorId,
      tone: "gain",
      signedAmount: amount,
      label: event.reason === "TOLL" ? "통행료 수금" : "수금",
    });
  }
  return steps;
}

export function createMoneyPresentationSequence(event) {
  const steps = createMoneyPresentationPlan(event);
  if (!steps.length) return [];
  const amount = normalizeAmount(event?.amount);
  if (!amount) return [];

  const isTollTransfer = event?.type === "MONEY_PAID"
    && event?.reason === "TOLL"
    && event?.creditorId
    && steps.length === 2;

  if (isTollTransfer) {
    return [
      { kind: "money", steps: [steps[0]], holdMs: 520 },
      {
        kind: "transfer",
        from: playerEndpoint(event.playerId),
        to: playerEndpoint(event.creditorId),
        amount,
      },
      { kind: "money", steps: [steps[1]], holdMs: 520 },
    ];
  }

  if ((event?.type === "PROPERTY_BOUGHT" || event?.type === "PROPERTY_BUILT") && event?.nodeId) {
    return [
      { kind: "money", steps, holdMs: 420 },
      {
        kind: "transfer",
        from: playerEndpoint(event.playerId),
        to: tileEndpoint(event.nodeId),
        amount,
      },
    ];
  }

  if (event?.type === "START_PASSED") {
    return [
      {
        kind: "transfer",
        from: BOARD_CENTER_ENDPOINT,
        to: playerEndpoint(event.playerId),
        amount,
      },
      { kind: "money", steps, holdMs: 520 },
    ];
  }

  if (event?.type === "MONEY_RECEIVED" && ["EVENT", "BONUS"].includes(event?.reason)) {
    return [
      {
        kind: "transfer",
        from: MODAL_MONEY_CARD_ENDPOINT,
        to: playerEndpoint(event.playerId),
        amount,
      },
      { kind: "money", steps, holdMs: 520 },
    ];
  }

  if (event?.type === "MONEY_PAID" && ["EVENT", "TAX"].includes(event?.reason)) {
    return [
      { kind: "money", steps, holdMs: 420 },
      {
        kind: "transfer",
        from: playerEndpoint(event.playerId),
        to: MODAL_MONEY_CARD_ENDPOINT,
        amount,
      },
    ];
  }

  return [{ kind: "money", steps }];
}

export function resolveMoneyTransferCoinCount(value) {
  const amount = normalizeAmount(value) ?? 0;
  if (amount >= 1000) return 12;
  if (amount >= 500) return 10;
  if (amount >= 200) return 8;
  return 6;
}

export function resolveMoneyTransferFlight(start, end, index, coinCount) {
  const spread = (index - ((coinCount - 1) / 2)) * 8;
  const startX = Number(start?.x) + spread;
  const startY = Number(start?.y) + ((index % 2 === 0) ? -7 : 7);
  const deltaX = Number(end?.x) - startX;
  const deltaY = Number(end?.y) - startY;
  return Object.freeze({
    startX,
    startY,
    midX: deltaX * 0.5,
    midY: (deltaY * 0.5) - 58 - (index * 4),
    endX: deltaX,
    endY: deltaY,
    delayMs: index * DEFAULT_TRANSFER_STAGGER_MS,
  });
}

export function formatClassicMoneyDelta(value) {
  const amount = Number(value) || 0;
  const sign = amount > 0 ? "+" : amount < 0 ? "−" : "";
  return `${sign}${Math.abs(amount).toLocaleString("ko-KR")} 골드`;
}

export function formatClassicMoneyBalance(value) {
  const amount = Number(value);
  const normalized = Number.isFinite(amount) ? Math.round(amount) : 0;
  return `${normalized.toLocaleString("ko-KR")} 골드`;
}

export function interpolateMoneyBalance(fromValue, toValue, progress) {
  const from = Number(fromValue) || 0;
  const to = Number(toValue) || 0;
  const normalizedProgress = Math.min(1, Math.max(0, Number(progress) || 0));
  const eased = 1 - ((1 - normalizedProgress) ** 3);
  return Math.round(from + ((to - from) * eased));
}

function findHudCard(documentObject, seatByPlayerId, playerId) {
  const seat = seatByPlayerId?.get?.(playerId);
  if (!Number.isInteger(Number(seat))) return null;
  return [...(documentObject?.querySelectorAll?.(".player-hud-card") ?? [])]
    .find((card) => Number(card?.dataset?.seat) === Number(seat)) ?? null;
}

function findHudBalanceElement(card) {
  return card?.querySelector?.("dl div:first-child dd") ?? card?.querySelector?.("dd") ?? null;
}

function findModalMoneyCard(documentObject) {
  const modal = documentObject?.querySelector?.("[data-tile-info-modal][open]");
  if (!modal) return null;
  const rows = [...(modal.querySelectorAll?.("[data-tile-info-stats] > div") ?? [])];
  const element = rows.find((row) => row.querySelector?.("dt")?.textContent?.trim?.() === "골드 변화") ?? null;
  return element ? { element, modal } : null;
}

export function syncHudMoneyBalances({
  documentObject = globalThis.document,
  seatByPlayerId = new Map(),
  balanceByPlayerId = new Map(),
} = {}) {
  for (const [playerId, balance] of balanceByPlayerId.entries()) {
    const card = findHudCard(documentObject, seatByPlayerId, playerId);
    const balanceElement = findHudBalanceElement(card);
    if (balanceElement) balanceElement.textContent = formatClassicMoneyBalance(balance);
  }
}

function createFeedbackElement(documentObject, step) {
  const feedback = documentObject.createElement("div");
  feedback.className = "player-money-feedback";
  feedback.dataset.tone = step.tone;
  feedback.setAttribute("role", "status");
  feedback.setAttribute("aria-label", `${step.label} ${formatClassicMoneyDelta(step.signedAmount)}`);

  const label = documentObject.createElement("span");
  label.textContent = step.label;
  const amount = documentObject.createElement("strong");
  amount.textContent = formatClassicMoneyDelta(step.signedAmount);
  feedback.append(label, amount);
  return feedback;
}

async function animateBalanceElement(element, fromValue, toValue, {
  durationMs,
  reducedMotion,
  requestFrame,
  onValue,
}) {
  if (!element) return;
  if (reducedMotion || fromValue === toValue || typeof requestFrame !== "function") {
    element.textContent = formatClassicMoneyBalance(toValue);
    onValue?.(toValue);
    return;
  }

  element.textContent = formatClassicMoneyBalance(fromValue);
  onValue?.(fromValue);
  await new Promise((resolve) => {
    let startedAt = null;
    function frame(timestamp) {
      const currentTimestamp = Number(timestamp);
      const safeTimestamp = Number.isFinite(currentTimestamp) ? currentTimestamp : (startedAt ?? 0);
      if (startedAt === null) startedAt = safeTimestamp;
      const progress = durationMs <= 0
        ? 1
        : Math.min(1, Math.max(0, (safeTimestamp - startedAt) / durationMs));
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

function elementCenter(element) {
  const rect = element?.getBoundingClientRect?.();
  if (!rect) return null;
  const left = Number(rect.left);
  const top = Number(rect.top);
  const width = Number(rect.width);
  const height = Number(rect.height);
  if (![left, top, width, height].every(Number.isFinite)) return null;
  return {
    x: left + (width / 2),
    y: top + (height / 2),
  };
}

function createTransferCoin(documentObject, flight) {
  const coin = documentObject.createElement("span");
  coin.className = "money-transfer-coin";
  coin.setAttribute("aria-hidden", "true");
  coin.style.left = `${Math.round(flight.startX)}px`;
  coin.style.top = `${Math.round(flight.startY)}px`;
  return coin;
}

function createBoardImpact(documentObject, point) {
  const impact = documentObject.createElement("span");
  impact.className = "money-transfer-board-impact";
  impact.setAttribute("aria-hidden", "true");
  impact.style.left = `${Math.round(point.x)}px`;
  impact.style.top = `${Math.round(point.y)}px`;
  return impact;
}

function transferFrames(flight) {
  return [
    {
      opacity: 0,
      transform: "translate(-50%, -50%) scale(0.68) rotate(0deg)",
    },
    {
      offset: 0.12,
      opacity: 1,
      transform: "translate(-50%, -50%) scale(0.98) rotate(70deg)",
    },
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

function startTransferCoinAnimation(coin, flight, durationMs) {
  if (typeof coin?.animate === "function") {
    const animation = coin.animate(transferFrames(flight), {
      duration: durationMs,
      delay: flight.delayMs,
      easing: "cubic-bezier(0.18, 0.78, 0.22, 1)",
      fill: "both",
    });
    return animation?.finished?.catch?.(() => undefined) ?? Promise.resolve();
  }

  coin.dataset.moneyTransferFallback = "true";
  coin.style.setProperty("--money-transfer-mid-x", `${Math.round(flight.midX)}px`);
  coin.style.setProperty("--money-transfer-mid-y", `${Math.round(flight.midY)}px`);
  coin.style.setProperty("--money-transfer-end-x", `${Math.round(flight.endX)}px`);
  coin.style.setProperty("--money-transfer-end-y", `${Math.round(flight.endY)}px`);
  coin.style.setProperty("--money-transfer-duration", `${durationMs}ms`);
  coin.style.setProperty("--money-transfer-delay", `${flight.delayMs}ms`);
  return null;
}

export function createHudMoneyPresenter({
  documentObject = globalThis.document,
  seatByPlayerId = new Map(),
  balanceByPlayerId = new Map(),
  resolveBoardPoint = () => null,
  reducedMotion = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true,
  wait = (ms) => new Promise((resolve) => globalThis.setTimeout(resolve, ms)),
  requestFrame = typeof globalThis.requestAnimationFrame === "function"
    ? globalThis.requestAnimationFrame.bind(globalThis)
    : null,
  countDurationMs = 520,
  transferDurationMs = 780,
} = {}) {
  function resolveTransferEndpoint(endpoint) {
    if (endpoint?.kind === "player") {
      const card = findHudCard(documentObject, seatByPlayerId, endpoint.playerId);
      return {
        card,
        element: card,
        host: null,
        point: elementCenter(card),
      };
    }
    if (endpoint?.kind === "modal-money-card") {
      const result = findModalMoneyCard(documentObject);
      return {
        card: null,
        element: result?.element ?? null,
        host: result?.modal ?? null,
        point: elementCenter(result?.element),
      };
    }
    const point = resolveBoardPoint(endpoint);
    return {
      card: null,
      element: null,
      host: null,
      point: point && Number.isFinite(Number(point.x)) && Number.isFinite(Number(point.y))
        ? { x: Number(point.x), y: Number(point.y) }
        : null,
    };
  }

  async function presentSteps(steps, holdMs = reducedMotion ? 220 : 760) {
    const active = [];
    const counters = [];
    for (const step of steps) {
      const previousBalance = Number(balanceByPlayerId.get(step.playerId));
      const hasPreviousBalance = Number.isFinite(previousBalance);
      const nextBalance = hasPreviousBalance ? previousBalance + step.signedAmount : null;
      const card = findHudCard(documentObject, seatByPlayerId, step.playerId);

      if (!card) {
        if (nextBalance !== null) balanceByPlayerId.set(step.playerId, nextBalance);
        continue;
      }

      card.querySelectorAll?.(".player-money-feedback").forEach((element) => element.remove());
      const feedback = createFeedbackElement(documentObject, step);
      const balanceElement = findHudBalanceElement(card);
      card.dataset.moneyEffect = step.tone;
      card.append(feedback);
      active.push({ card, feedback, tone: step.tone });

      if (nextBalance !== null && balanceElement) {
        card.dataset.moneyCounting = step.tone;
        counters.push(animateBalanceElement(balanceElement, previousBalance, nextBalance, {
          durationMs: countDurationMs,
          reducedMotion,
          requestFrame,
          onValue(value) {
            balanceByPlayerId.set(step.playerId, value);
          },
        }));
      } else if (nextBalance !== null) {
        balanceByPlayerId.set(step.playerId, nextBalance);
      }
    }
    if (!active.length && !counters.length) return;

    await Promise.all([wait(holdMs), ...counters]);
    for (const { card, feedback, tone } of active) {
      feedback.remove();
      if (card.dataset.moneyEffect === tone) delete card.dataset.moneyEffect;
      if (card.dataset.moneyCounting === tone) delete card.dataset.moneyCounting;
    }
  }

  async function presentTransfer(phase) {
    const source = resolveTransferEndpoint(phase.from);
    const destination = resolveTransferEndpoint(phase.to);
    if (!source.point || !destination.point) return;

    if (source.element) source.element.dataset.moneyTransferSource = "true";
    if (reducedMotion || !documentObject?.body?.append) {
      if (destination.card) destination.card.dataset.moneyTransferImpact = "true";
      await wait(180);
      if (source.element) delete source.element.dataset.moneyTransferSource;
      if (destination.card) delete destination.card.dataset.moneyTransferImpact;
      return;
    }

    const layer = documentObject.createElement("div");
    layer.className = "money-transfer-layer";
    layer.setAttribute("aria-hidden", "true");
    const openModal = documentObject?.querySelector?.("[data-tile-info-modal][open]");
    const layerHost = source.host?.append
      ? source.host
      : openModal?.append
        ? openModal
        : documentObject.body;
    const previousOverflow = layerHost?.style?.overflow ?? "";
    if (layerHost?.style) layerHost.style.overflow = "visible";
    layerHost.append(layer);

    const coinCount = resolveMoneyTransferCoinCount(phase.amount);
    const staggerMs = phase.to?.kind === "tile"
      ? TILE_TRANSFER_STAGGER_MS
      : DEFAULT_TRANSFER_STAGGER_MS;
    const animationPromises = [];
    let usesFallback = false;
    for (let index = 0; index < coinCount; index += 1) {
      const baseFlight = resolveMoneyTransferFlight(source.point, destination.point, index, coinCount);
      const flight = staggerMs === DEFAULT_TRANSFER_STAGGER_MS
        ? baseFlight
        : Object.freeze({ ...baseFlight, delayMs: index * staggerMs });
      const coin = createTransferCoin(documentObject, flight);
      layer.append(coin);
      const animationPromise = startTransferCoinAnimation(coin, flight, transferDurationMs);
      if (animationPromise) animationPromises.push(animationPromise);
      else usesFallback = true;
    }

    const fallbackDuration = transferDurationMs + ((coinCount - 1) * staggerMs) + 100;
    if (usesFallback || animationPromises.length !== coinCount) {
      await wait(fallbackDuration);
    } else {
      await Promise.all(animationPromises);
    }

    if (destination.card) {
      destination.card.dataset.moneyTransferImpact = "true";
    } else {
      layer.append(createBoardImpact(documentObject, destination.point));
    }

    await wait(280);
    layer.remove();
    if (layerHost?.style) layerHost.style.overflow = previousOverflow;
    if (source.element) delete source.element.dataset.moneyTransferSource;
    if (destination.card) delete destination.card.dataset.moneyTransferImpact;
  }

  async function play(event) {
    const sequence = createMoneyPresentationSequence(event);
    if (!sequence.length || !documentObject?.createElement) return;

    for (const phase of sequence) {
      if (phase.kind === "transfer") {
        await presentTransfer(phase);
        continue;
      }
      await presentSteps(phase.steps, reducedMotion ? 220 : (phase.holdMs ?? 760));
    }
  }

  return Object.freeze({ play });
}
