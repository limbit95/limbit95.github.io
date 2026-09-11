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

export function createHudMoneyPresenter({
  documentObject = globalThis.document,
  seatByPlayerId = new Map(),
  balanceByPlayerId = new Map(),
  reducedMotion = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true,
  wait = (ms) => new Promise((resolve) => globalThis.setTimeout(resolve, ms)),
  requestFrame = typeof globalThis.requestAnimationFrame === "function"
    ? globalThis.requestAnimationFrame.bind(globalThis)
    : null,
  countDurationMs = 520,
} = {}) {
  async function play(event) {
    const plan = createMoneyPresentationPlan(event);
    if (!plan.length || !documentObject?.createElement) return;

    const active = [];
    const counters = [];
    for (const step of plan) {
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

    await Promise.all([
      wait(reducedMotion ? 220 : 760),
      ...counters,
    ]);
    for (const { card, feedback, tone } of active) {
      feedback.remove();
      if (card.dataset.moneyEffect === tone) delete card.dataset.moneyEffect;
      if (card.dataset.moneyCounting === tone) delete card.dataset.moneyCounting;
    }
  }

  return Object.freeze({ play });
}
