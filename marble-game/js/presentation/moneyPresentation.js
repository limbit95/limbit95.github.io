const MONEY_EVENT_TYPES = new Set(["START_PASSED", "MONEY_PAID", "MONEY_RECEIVED"]);

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
  if (event.creditorId) {
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

function findHudCard(documentObject, seatByPlayerId, playerId) {
  const seat = seatByPlayerId?.get?.(playerId);
  if (!Number.isInteger(Number(seat))) return null;
  return [...(documentObject?.querySelectorAll?.(".player-hud-card") ?? [])]
    .find((card) => Number(card?.dataset?.seat) === Number(seat)) ?? null;
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

export function createHudMoneyPresenter({
  documentObject = globalThis.document,
  seatByPlayerId = new Map(),
  reducedMotion = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true,
  wait = (ms) => new Promise((resolve) => globalThis.setTimeout(resolve, ms)),
} = {}) {
  async function play(event) {
    const plan = createMoneyPresentationPlan(event);
    if (!plan.length || !documentObject?.createElement) return;

    const active = [];
    for (const step of plan) {
      const card = findHudCard(documentObject, seatByPlayerId, step.playerId);
      if (!card) continue;
      card.querySelectorAll?.(".player-money-feedback").forEach((element) => element.remove());
      const feedback = createFeedbackElement(documentObject, step);
      card.dataset.moneyEffect = step.tone;
      card.append(feedback);
      active.push({ card, feedback, tone: step.tone });
    }
    if (!active.length) return;

    await wait(reducedMotion ? 220 : 760);
    for (const { card, feedback, tone } of active) {
      feedback.remove();
      if (card.dataset.moneyEffect === tone) delete card.dataset.moneyEffect;
    }
  }

  return Object.freeze({ play });
}
