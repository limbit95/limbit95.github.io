import { getAuthState, initializeAuth } from "../../js/auth.js";
import { getMyActiveRoom } from "./lobbyApi.js";
import { getGameSnapshot, gameCommands, newClientActionId } from "./gameApi.js";

const app = document.querySelector("#app");
const NORMAL_COLORS = ["white", "blue", "green", "red", "black"];
const ALL_COLORS = [...NORMAL_COLORS, "gold"];
const GEM_LABELS = {
  white: "흰색",
  blue: "파랑",
  green: "초록",
  red: "빨강",
  black: "검정",
  gold: "금",
};

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
globalThis.__splendorPhase6PurchaseEnabled = true;

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

function gameState() {
  return state.snapshot?.game ?? null;
}

function myState() {
  return state.snapshot?.self ?? null;
}

function visibleCards() {
  return Array.isArray(state.snapshot?.cards) ? state.snapshot.cards : [];
}

function selectedCardIdFromDom() {
  return document.querySelector(".dev-card.is-selected[data-card-id]")?.dataset.cardId ?? null;
}

function selectedCard() {
  const id = selectedCardIdFromDom();
  return visibleCards().find((card) => card.instance_id === id) ?? null;
}

function numberAt(source, color) {
  return Math.max(0, Number(source?.[color] || 0));
}

function requiredCost(card, bonuses = {}) {
  return Object.fromEntries(NORMAL_COLORS.map((color) => {
    const cost = numberAt(card?.cost, color);
    const bonus = numberAt(bonuses, color);
    return [color, Math.max(cost - bonus, 0)];
  }));
}

function requiredTotal(card, bonuses = {}) {
  return Object.values(requiredCost(card, bonuses)).reduce((sum, amount) => sum + amount, 0);
}

function resetPayment(card) {
  const me = myState();
  const game = gameState();
  const required = requiredCost(card, me?.bonuses);
  state.paymentCardId = card?.instance_id ?? null;
  state.paymentVersion = Number(game?.version ?? -1);
  state.normalPayment = Object.fromEntries(NORMAL_COLORS.map((color) => [
    color,
    Math.min(required[color], numberAt(me?.tokens, color)),
  ]));
}

function ensurePayment(card) {
  const version = Number(gameState()?.version ?? -1);
  if (!card) {
    state.paymentCardId = null;
    state.paymentVersion = version;
    state.normalPayment = Object.fromEntries(NORMAL_COLORS.map((color) => [color, 0]));
    return;
  }
  if (state.paymentCardId !== card.instance_id || state.paymentVersion !== version) {
    resetPayment(card);
  }
}

function goldNeeded(card) {
  const required = requiredCost(card, myState()?.bonuses);
  return NORMAL_COLORS.reduce((sum, color) => sum + Math.max(required[color] - Number(state.normalPayment[color] || 0), 0), 0);
}

function paymentPayload(card) {
  const payload = Object.fromEntries(ALL_COLORS.map((color) => [color, 0]));
  NORMAL_COLORS.forEach((color) => {
    payload[color] = Number(state.normalPayment[color] || 0);
  });
  payload.gold = goldNeeded(card);
  return payload;
}

function canAct() {
  const me = myState();
  const game = gameState();
  return Boolean(me?.is_current_turn) && game?.turn_phase === "action" && !state.busy;
}

function canAfford(card) {
  if (!card || !myState()) return false;
  const gold = goldNeeded(card);
  if (gold > numberAt(myState().tokens, "gold")) return false;
  const required = requiredCost(card, myState().bonuses);
  return NORMAL_COLORS.every((color) => {
    const paid = Number(state.normalPayment[color] || 0);
    return paid >= 0 && paid <= required[color] && paid <= numberAt(myState().tokens, color);
  });
}

function purchaseButtonLabel(card) {
  const me = myState();
  const game = gameState();
  if (state.busy) return "구매 처리 중…";
  if (!card || !me || !game) return "카드를 먼저 선택하세요";
  if (game.turn_phase === "return_excess") return "먼저 초과 토큰 반환";
  if (!me.is_current_turn) return "내 턴에 구매 가능";
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
  const canDecrease = paid > 0 && currentGold < goldOwned && !state.busy;
  const canIncrease = paid < Math.min(required, owned) && !state.busy;
  const discount = Math.min(original, bonus);

  return `
    <div class="phase6-payment-row">
      <div class="phase6-payment-color">
        ${gemDot(color)}
        <div><strong>${GEM_LABELS[color]}</strong><span>정가 ${original}${discount > 0 ? ` · 할인 ${discount}` : ""} · 실제 ${required}</span></div>
      </div>
      <div class="phase6-owned">보유 <strong>${owned}</strong></div>
      <div class="phase6-stepper" role="group" aria-label="${GEM_LABELS[color]} 결제 수량">
        <button type="button" data-phase6-pay-color="${color}" data-phase6-pay-delta="-1" ${canDecrease ? "" : "disabled"} aria-label="${GEM_LABELS[color]} 대신 금 사용">−</button>
        <strong>${paid}</strong>
        <button type="button" data-phase6-pay-color="${color}" data-phase6-pay-delta="1" ${canIncrease ? "" : "disabled"} aria-label="${GEM_LABELS[color]} 결제 수량 증가">+</button>
      </div>
    </div>
  `;
}

function purchasePanelMarkup(card) {
  const me = myState();
  if (!card || !me) return "";
  ensurePayment(card);
  const required = requiredCost(card, me.bonuses);
  const total = Object.values(required).reduce((sum, amount) => sum + amount, 0);
  const gold = goldNeeded(card);
  const goldOwned = numberAt(me.tokens, "gold");
  const affordable = canAfford(card);
  const discountTotal = NORMAL_COLORS.reduce((sum, color) => {
    const original = numberAt(card.cost, color);
    return sum + Math.min(original, numberAt(me.bonuses, color));
  }, 0);

  const status = affordable
    ? total === 0
      ? "영구 보너스로 무료 구매할 수 있어요."
      : `현재 선택으로 구매 가능 · 금 ${gold}개 사용`
    : `구매 불가 · 필요한 금 ${gold}개 / 보유 ${goldOwned}개`;

  return `
    <div class="phase6-purchase-panel" data-phase6-purchase-panel>
      <div class="phase6-purchase-heading">
        <div>
          <span class="phase6-badge">실제 결제</span>
          <strong>${total}개${discountTotal > 0 ? ` · 영구 보너스로 ${discountTotal}개 할인` : ""}</strong>
        </div>
        <span class="phase6-gold-summary">${gemDot("gold")} 금 자동 사용 <strong>${gold}</strong> / ${goldOwned}</span>
      </div>
      ${total > 0
        ? `<div class="phase6-payment-grid">${NORMAL_COLORS.map((color) => paymentRow(card, color)).join("")}</div>`
        : `<div class="phase6-free-purchase">추가 토큰 지불 없이 구매할 수 있습니다.</div>`}
      <p class="phase6-payment-help">기본값은 일반 보석을 먼저 사용합니다. 일반 보석의 <strong>−</strong>를 누르면 그 1개 대신 금 토큰을 사용합니다.</p>
      <div class="phase6-payment-status ${affordable ? "is-ready" : "is-blocked"}">${escapeHtml(status)}</div>
    </div>
  `;
}

function feedbackMarkup() {
  if (!state.feedback) return "";
  return `<div class="phase6-feedback is-${state.feedbackType}" data-phase6-feedback role="status">${escapeHtml(state.feedback)}</div>`;
}

function enhancePhaseBanner() {
  const banner = document.querySelector(".prototype-banner");
  if (!banner || !document.querySelector(".board-shell")) return;
  const strong = banner.querySelector("strong");
  const badge = banner.querySelector(".prototype-badge");
  if (strong) strong.textContent = "PHASE 6 · FACE-UP PURCHASE";
  if (badge) badge.textContent = "PURCHASE ENGINE";
}

function enhanceSelectionPanel() {
  const box = document.querySelector(".selection-box");
  if (!box) return;
  const card = selectedCard();
  const buttons = box.querySelectorAll(".action-row .button");
  if (!card || buttons.length < 2) {
    box.querySelector("[data-phase6-purchase-panel]")?.remove();
    return;
  }

  ensurePayment(card);
  let panel = box.querySelector("[data-phase6-purchase-panel]");
  const markup = purchasePanelMarkup(card);
  if (panel) {
    panel.outerHTML = markup;
  } else {
    const actionRow = box.querySelector(".action-row");
    actionRow?.insertAdjacentHTML("beforebegin", markup);
  }

  const purchaseButton = box.querySelector(".action-row .button:first-child");
  if (!purchaseButton) return;
  purchaseButton.dataset.phase6Purchase = "true";
  purchaseButton.dataset.cardInstanceId = card.instance_id;
  purchaseButton.disabled = !canAct() || !canAfford(card);
  purchaseButton.textContent = purchaseButtonLabel(card);

  const copy = box.querySelector(".selection-copy");
  if (copy) {
    copy.textContent = "구매하면 지불한 토큰은 공급처로 돌아가고, 카드의 점수와 영구 보너스를 즉시 얻습니다. 공개 자리는 같은 단계 덱에서 보충됩니다.";
  }
}

function injectFeedback() {
  let box = document.querySelector("[data-phase6-feedback]");
  if (!state.feedback) {
    box?.remove();
    return;
  }
  if (!box) {
    const notice = document.querySelector(".board-side > .notice");
    if (!notice) return;
    notice.insertAdjacentHTML("beforebegin", feedbackMarkup());
    return;
  }
  box.className = `phase6-feedback is-${state.feedbackType}`;
  if (box.textContent !== state.feedback) box.textContent = state.feedback;
}

function enhanceDom() {
  if (!document.querySelector(".board-shell") || !state.snapshot) return;
  observer?.disconnect();
  try {
    enhancePhaseBanner();
    enhanceSelectionPanel();
    injectFeedback();
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
    const previousVersion = Number(gameState()?.version ?? -1);
    state.snapshot = await getGameSnapshot(roomId);
    if (previousVersion !== Number(gameState()?.version ?? -1)) {
      state.paymentCardId = null;
    }
    enhanceDom();
  } catch (error) {
    console.warn("[splendor phase6] snapshot refresh failed", error);
  } finally {
    state.fetching = false;
  }
}

function scheduleRefresh(delay = 65) {
  clearTimeout(state.timer);
  state.timer = setTimeout(() => void refreshSnapshot(), delay);
}

function observe() {
  if (!app) return;
  if (!observer) {
    observer = new MutationObserver(() => {
      if (!document.querySelector(".board-shell")) return;
      scheduleRefresh();
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
  const maxNormal = Math.min(required[color], numberAt(me.tokens, color));
  const next = Math.max(0, Math.min(maxNormal, current + delta));
  if (delta < 0 && goldNeeded(card) >= numberAt(me.tokens, "gold")) return;
  state.normalPayment[color] = next;
  enhanceDom();
}

async function purchaseSelected(button) {
  if (state.busy) return;
  const snapshot = state.snapshot;
  const roomId = state.roomId;
  const cardId = button.dataset.cardInstanceId || selectedCardIdFromDom();
  const card = visibleCards().find((item) => item.instance_id === cardId);
  if (!snapshot?.game || !snapshot?.self || !roomId || !card) return;

  ensurePayment(card);
  if (!canAct() || !canAfford(card)) return;

  const expectedVersion = Number(snapshot.game.version);
  const payment = paymentPayload(card);
  const previousScore = Number(snapshot.self.score || 0);
  const previousBonus = numberAt(snapshot.self.bonuses, card.bonus);

  state.busy = true;
  state.feedback = `${card.title} 카드를 구매하고 있습니다…`;
  state.feedbackType = "info";
  enhanceDom();

  try {
    const next = await gameCommands.purchaseFaceup(roomId, cardId, payment, expectedVersion, newClientActionId());
    state.snapshot = next;
    state.paymentCardId = null;
    const scoreGain = Number(next?.players?.find((player) => player.user_id === snapshot.self.user_id)?.score ?? previousScore) - previousScore;
    const bonusAfter = numberAt(next?.players?.find((player) => player.user_id === snapshot.self.user_id)?.bonuses, card.bonus);
    const bonusGain = Math.max(bonusAfter - previousBonus, 0);
    state.feedback = `${card.title} 구매 완료${scoreGain > 0 ? ` · ${scoreGain}점 획득` : ""}${bonusGain > 0 ? ` · ${GEM_LABELS[card.bonus]} 영구 보너스 +${bonusGain}` : ""}. 지불한 토큰은 공급처로 돌아가고 턴이 넘어갔습니다.`;
    state.feedbackType = "success";
    enhanceDom();

    setTimeout(() => {
      const staleCard = document.querySelector(`.dev-card[data-card-id="${cardId}"]`);
      const serverStillShowsCard = visibleCards().some((item) => item.instance_id === cardId);
      if (staleCard && !serverStillShowsCard) window.location.reload();
    }, 1500);
  } catch (error) {
    state.feedback = error?.message ?? "카드를 구매하지 못했습니다.";
    state.feedbackType = "error";
    if (["STATE_CHANGED", "CARD_NOT_AVAILABLE"].includes(error?.code)) {
      await refreshSnapshot();
    }
    enhanceDom();
  } finally {
    state.busy = false;
    enhanceDom();
  }
}

document.addEventListener("click", (event) => {
  const step = event.target.closest("[data-phase6-pay-color]");
  if (step) {
    event.preventDefault();
    adjustPayment(step.dataset.phase6PayColor, Number(step.dataset.phase6PayDelta || 0));
    return;
  }

  const purchaseButton = event.target.closest("[data-phase6-purchase]");
  if (!purchaseButton || purchaseButton.disabled) return;
  event.preventDefault();
  void purchaseSelected(purchaseButton);
});

async function bootstrap() {
  try {
    await initializeAuth();
    const auth = getAuthState();
    if (!auth.isApproved) return;
    observe();
    scheduleRefresh(0);
  } catch (error) {
    console.warn("[splendor phase6] bootstrap failed", error);
  }
}

void bootstrap();
