import { getAuthState, initializeAuth } from "../../js/auth.js";
import { getMyActiveRoom } from "./lobbyApi.js";
import { getGameSnapshot, gameCommands, newClientActionId } from "./gameApi.js";

const app = document.querySelector("#app");
const NORMAL_COLORS = ["white", "blue", "green", "red", "black"];
const ALL_COLORS = [...NORMAL_COLORS, "gold"];
const GEM_LABELS = { white: "흰색", blue: "파랑", green: "초록", red: "빨강", black: "검정", gold: "금" };

const state = {
  roomId: null,
  snapshot: null,
  busy: false,
  fetching: false,
  timer: null,
  feedback: "",
  feedbackType: "info",
  paymentCardId: null,
  paymentVersion: null,
  normalPayment: Object.fromEntries(NORMAL_COLORS.map((color) => [color, 0])),
};

let observer = null;

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function gemDot(color) {
  return `<span class="gem-dot gem--${escapeHtml(color)}" aria-hidden="true"></span>`;
}

function gameState() { return state.snapshot?.game ?? null; }
function myState() { return state.snapshot?.self ?? null; }
function visibleCards() { return Array.isArray(state.snapshot?.cards) ? state.snapshot.cards : []; }
function numberAt(source, color) { return Math.max(0, Number(source?.[color] || 0)); }

function selectedCardIdFromDom() {
  return document.querySelector(".dev-card.is-selected[data-card-id]")?.dataset.cardId ?? null;
}

function selectedCard() {
  const id = selectedCardIdFromDom();
  return visibleCards().find((card) => card.instance_id === id) ?? null;
}

function requiredCost(card, bonuses = {}) {
  return Object.fromEntries(NORMAL_COLORS.map((color) => [
    color,
    Math.max(numberAt(card?.cost, color) - numberAt(bonuses, color), 0),
  ]));
}

function resetPayment(card) {
  const me = myState();
  const required = requiredCost(card, me?.bonuses);
  state.paymentCardId = card?.instance_id ?? null;
  state.paymentVersion = Number(gameState()?.version ?? -1);
  state.normalPayment = Object.fromEntries(NORMAL_COLORS.map((color) => [
    color,
    Math.min(required[color], numberAt(me?.tokens, color)),
  ]));
}

function ensurePayment(card) {
  const version = Number(gameState()?.version ?? -1);
  if (!card) return;
  if (state.paymentCardId !== card.instance_id || state.paymentVersion !== version) resetPayment(card);
}

function goldNeeded(card) {
  const required = requiredCost(card, myState()?.bonuses);
  return NORMAL_COLORS.reduce(
    (sum, color) => sum + Math.max(required[color] - Number(state.normalPayment[color] || 0), 0),
    0,
  );
}

function paymentPayload(card) {
  const result = Object.fromEntries(ALL_COLORS.map((color) => [color, 0]));
  NORMAL_COLORS.forEach((color) => { result[color] = Number(state.normalPayment[color] || 0); });
  result.gold = goldNeeded(card);
  return result;
}

function canAct() {
  return Boolean(myState()?.is_current_turn) && gameState()?.turn_phase === "action" && !state.busy;
}

function canAfford(card) {
  const me = myState();
  if (!card || !me) return false;
  if (goldNeeded(card) > numberAt(me.tokens, "gold")) return false;
  const required = requiredCost(card, me.bonuses);
  return NORMAL_COLORS.every((color) => {
    const paid = Number(state.normalPayment[color] || 0);
    return paid >= 0 && paid <= required[color] && paid <= numberAt(me.tokens, color);
  });
}

function purchaseLabel(card) {
  if (state.busy) return "구매 처리 중…";
  if (!card) return "카드를 먼저 선택하세요";
  if (gameState()?.turn_phase === "return_excess") return "먼저 초과 토큰 반환";
  if (!myState()?.is_current_turn) return "내 턴에 구매 가능";
  if (!canAfford(card)) return "보석이 부족합니다";
  return "이 카드 구매하기";
}

function paymentRow(card, color) {
  const me = myState();
  const original = numberAt(card.cost, color);
  if (original <= 0) return "";
  const bonus = numberAt(me?.bonuses, color);
  const required = Math.max(original - bonus, 0);
  const paid = Number(state.normalPayment[color] || 0);
  const owned = numberAt(me?.tokens, color);
  const currentGold = goldNeeded(card);
  const goldOwned = numberAt(me?.tokens, "gold");
  const discount = Math.min(original, bonus);
  const canMinus = paid > 0 && currentGold < goldOwned && !state.busy;
  const canPlus = paid < Math.min(required, owned) && !state.busy;

  return `
    <div class="phase6-payment-row">
      <div class="phase6-payment-color">
        ${gemDot(color)}
        <div><strong>${GEM_LABELS[color]}</strong><span>정가 ${original}${discount ? ` · 할인 ${discount}` : ""} · 실제 ${required}</span></div>
      </div>
      <div class="phase6-owned">보유 <strong>${owned}</strong></div>
      <div class="phase6-stepper">
        <button type="button" data-phase6v2-pay="${color}" data-delta="-1" ${canMinus ? "" : "disabled"}>−</button>
        <strong>${paid}</strong>
        <button type="button" data-phase6v2-pay="${color}" data-delta="1" ${canPlus ? "" : "disabled"}>+</button>
      </div>
    </div>`;
}

function panelMarkup(card) {
  const me = myState();
  ensurePayment(card);
  const required = requiredCost(card, me?.bonuses);
  const total = Object.values(required).reduce((sum, amount) => sum + amount, 0);
  const gold = goldNeeded(card);
  const goldOwned = numberAt(me?.tokens, "gold");
  const discount = NORMAL_COLORS.reduce(
    (sum, color) => sum + Math.min(numberAt(card.cost, color), numberAt(me?.bonuses, color)),
    0,
  );
  const ready = canAct() && canAfford(card);

  return `
    <div class="phase6-purchase-panel" data-phase6v2-panel data-card-id="${escapeHtml(card.instance_id)}">
      <div class="phase6-purchase-heading">
        <div><span class="phase6-badge">공개 카드 구매</span><strong>실제 결제 ${total}개${discount ? ` · 보너스 할인 ${discount}개` : ""}</strong></div>
        <span class="phase6-gold-summary">${gemDot("gold")} 금 <strong>${gold}</strong> / 보유 ${goldOwned}</span>
      </div>
      ${total
        ? `<div class="phase6-payment-grid">${NORMAL_COLORS.map((color) => paymentRow(card, color)).join("")}</div>`
        : `<div class="phase6-free-purchase">영구 보너스만으로 무료 구매할 수 있습니다.</div>`}
      <p class="phase6-payment-help">기본은 일반 보석 우선 결제입니다. <strong>−</strong>를 누르면 해당 일반 보석 1개 대신 금 1개를 사용합니다.</p>
      <div class="phase6-payment-status ${ready ? "is-ready" : "is-blocked"}">${ready ? "현재 결제로 구매할 수 있습니다." : purchaseLabel(card)}</div>
      <button class="button button--primary button--block" type="button" data-phase6v2-purchase data-card-id="${escapeHtml(card.instance_id)}" ${ready ? "" : "disabled"}>${purchaseLabel(card)}</button>
    </div>`;
}

function feedbackMarkup() {
  return state.feedback
    ? `<div class="phase6-feedback is-${state.feedbackType}" data-phase6v2-feedback role="status">${escapeHtml(state.feedback)}</div>`
    : "";
}

function enhanceDom() {
  if (!state.snapshot || !document.querySelector(".board-shell")) return;
  observer?.disconnect();
  try {
    const banner = document.querySelector(".prototype-banner");
    if (banner) banner.hidden = true;

    const box = document.querySelector(".selection-box");
    const card = selectedCard();
    if (box) {
      const legacyPurchase = box.querySelector(".action-row .button:first-child");
      if (legacyPurchase) legacyPurchase.hidden = true;

      const existing = box.querySelector("[data-phase6v2-panel]");
      if (!card) {
        existing?.remove();
        state.paymentCardId = null;
      } else {
        ensurePayment(card);
        const markup = panelMarkup(card);
        if (existing) existing.outerHTML = markup;
        else box.querySelector(".action-row")?.insertAdjacentHTML("beforebegin", markup);
      }
    }

    let feedback = document.querySelector("[data-phase6v2-feedback]");
    if (!state.feedback) feedback?.remove();
    else if (!feedback) document.querySelector(".board-side > .notice")?.insertAdjacentHTML("beforebegin", feedbackMarkup());
    else {
      feedback.className = `phase6-feedback is-${state.feedbackType}`;
      feedback.textContent = state.feedback;
    }
  } finally {
    observe();
  }
}

async function resolveRoomId() {
  if (state.roomId) return state.roomId;
  const active = await getMyActiveRoom();
  state.roomId = active?.room?.id ?? null;
  return state.roomId;
}

async function refreshSnapshot() {
  if (state.fetching || !document.querySelector(".board-shell")) return;
  state.fetching = true;
  try {
    const roomId = await resolveRoomId();
    if (!roomId) return;
    const oldVersion = Number(gameState()?.version ?? -1);
    state.snapshot = await getGameSnapshot(roomId);
    if (oldVersion !== Number(gameState()?.version ?? -1)) state.paymentCardId = null;
    enhanceDom();
  } catch (error) {
    console.warn("[splendor phase6 v2] snapshot refresh failed", error);
  } finally {
    state.fetching = false;
  }
}

function scheduleRefresh(delay = 70) {
  clearTimeout(state.timer);
  state.timer = setTimeout(() => void refreshSnapshot(), delay);
}

function observe() {
  if (!app) return;
  if (!observer) {
    observer = new MutationObserver(() => {
      if (!document.querySelector(".board-shell")) return;
      const cardId = selectedCardIdFromDom();
      const panel = document.querySelector("[data-phase6v2-panel]");
      if (cardId !== state.paymentCardId || (cardId && !panel) || (!cardId && panel)) scheduleRefresh();
    });
  }
  observer.observe(app, { childList: true, subtree: true });
}

function adjustPayment(color, delta) {
  const card = selectedCard();
  const me = myState();
  if (!card || !me || !NORMAL_COLORS.includes(color) || state.busy) return;
  ensurePayment(card);
  const required = requiredCost(card, me.bonuses);
  const current = Number(state.normalPayment[color] || 0);
  const max = Math.min(required[color], numberAt(me.tokens, color));
  if (delta < 0 && goldNeeded(card) >= numberAt(me.tokens, "gold")) return;
  state.normalPayment[color] = Math.max(0, Math.min(max, current + delta));
  enhanceDom();
}

async function purchase(cardId) {
  if (state.busy) return;
  const card = visibleCards().find((item) => item.instance_id === cardId);
  const snapshot = state.snapshot;
  if (!card || !snapshot?.game || !snapshot?.self || !state.roomId) return;
  ensurePayment(card);
  if (!canAct() || !canAfford(card)) return;

  const payment = paymentPayload(card);
  const expectedVersion = Number(snapshot.game.version);
  const beforeScore = Number(snapshot.self.score || 0);
  const beforeBonus = numberAt(snapshot.self.bonuses, card.bonus);

  state.busy = true;
  state.feedback = `${card.title} 카드를 구매하고 있습니다…`;
  state.feedbackType = "info";
  enhanceDom();

  try {
    const next = await gameCommands.purchaseFaceup(state.roomId, card.id ?? card.instance_id, payment, expectedVersion, newClientActionId());
    state.snapshot = next;
    state.paymentCardId = null;
    const meAfter = next?.players?.find((player) => player.user_id === snapshot.self.user_id);
    const scoreGain = Number(meAfter?.score ?? beforeScore) - beforeScore;
    const bonusGain = Math.max(numberAt(meAfter?.bonuses, card.bonus) - beforeBonus, 0);
    state.feedback = `${card.title} 구매 완료${scoreGain ? ` · ${scoreGain}점 획득` : ""}${bonusGain ? ` · ${GEM_LABELS[card.bonus]} 영구 보너스 +${bonusGain}` : ""}. 턴이 넘어갔습니다.`;
    state.feedbackType = "success";
    enhanceDom();

    setTimeout(() => {
      if (document.querySelector(`.dev-card[data-card-id="${cardId}"]`) && !visibleCards().some((item) => item.instance_id === cardId)) {
        window.location.reload();
      }
    }, 1500);
  } catch (error) {
    state.feedback = error?.message ?? "카드를 구매하지 못했습니다.";
    state.feedbackType = "error";
    if (["STATE_CHANGED", "CARD_NOT_AVAILABLE"].includes(error?.code)) await refreshSnapshot();
    enhanceDom();
  } finally {
    state.busy = false;
    enhanceDom();
  }
}

document.addEventListener("click", (event) => {
  const step = event.target.closest("[data-phase6v2-pay]");
  if (step) {
    event.preventDefault();
    adjustPayment(step.dataset.phase6v2Pay, Number(step.dataset.delta || 0));
    return;
  }
  const button = event.target.closest("[data-phase6v2-purchase]");
  if (!button || button.disabled) return;
  event.preventDefault();
  void purchase(button.dataset.cardId);
});

async function bootstrap() {
  try {
    await initializeAuth();
    if (!getAuthState().isApproved) return;
    observe();
    scheduleRefresh(0);
  } catch (error) {
    console.warn("[splendor phase6 v2] bootstrap failed", error);
  }
}

void bootstrap();
