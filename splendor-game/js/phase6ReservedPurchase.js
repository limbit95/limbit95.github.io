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
  selectedCardId: null,
  paymentVersion: null,
  normalPayment: Object.fromEntries(NORMAL_COLORS.map((color) => [color, 0])),
  busy: false,
  fetching: false,
  timer: null,
  feedback: "",
  feedbackType: "info",
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

function numberAt(source, color) {
  return Math.max(0, Number(source?.[color] || 0));
}

function gameState() {
  return state.snapshot?.game ?? null;
}

function myState() {
  return state.snapshot?.self ?? null;
}

function reservedCards() {
  return Array.isArray(state.snapshot?.reserved_cards) ? state.snapshot.reserved_cards : [];
}

function selectedCard() {
  return reservedCards().find((card) => card.instance_id === state.selectedCardId) ?? null;
}

function requiredCost(card, bonuses = {}) {
  return Object.fromEntries(NORMAL_COLORS.map((color) => [
    color,
    Math.max(numberAt(card?.cost, color) - numberAt(bonuses, color), 0),
  ]));
}

function resetPayment(card) {
  const required = requiredCost(card, myState()?.bonuses);
  state.paymentVersion = Number(gameState()?.version ?? -1);
  state.normalPayment = Object.fromEntries(NORMAL_COLORS.map((color) => [
    color,
    Math.min(required[color], numberAt(myState()?.tokens, color)),
  ]));
}

function ensurePayment(card) {
  if (!card) return;
  const version = Number(gameState()?.version ?? -1);
  if (state.paymentVersion !== version) resetPayment(card);
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
  NORMAL_COLORS.forEach((color) => {
    result[color] = Number(state.normalPayment[color] || 0);
  });
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
  if (!card) return "예약 카드를 선택하세요";
  if (gameState()?.turn_phase === "return_excess") return "먼저 초과 토큰 반환";
  if (!myState()?.is_current_turn) return "내 턴에 구매 가능";
  if (!canAfford(card)) return "보석이 부족합니다";
  return "이 예약 카드 구매하기";
}

function paymentRow(card, color) {
  const original = numberAt(card.cost, color);
  if (original <= 0) return "";

  const me = myState();
  const bonus = numberAt(me?.bonuses, color);
  const required = Math.max(original - bonus, 0);
  const paid = Number(state.normalPayment[color] || 0);
  const owned = numberAt(me?.tokens, color);
  const goldOwned = numberAt(me?.tokens, "gold");
  const currentGold = goldNeeded(card);
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
        <button type="button" data-phase62-pay="${color}" data-delta="-1" ${canMinus ? "" : "disabled"}>−</button>
        <strong>${paid}</strong>
        <button type="button" data-phase62-pay="${color}" data-delta="1" ${canPlus ? "" : "disabled"}>+</button>
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
  const source = card.reserved_hidden ? "덱 뒷면에서 예약한 카드" : "공개 상태에서 예약한 카드";

  return `
    <section class="surface board-section phase62-reserved-purchase-panel" data-phase62-panel>
      <div class="section-heading">
        <h2>🛒 예약 카드 구매</h2>
        <span class="section-meta">내 예약 카드만 구매 가능</span>
      </div>
      <div class="phase62-card-summary">
        <div>
          <span class="phase6-badge">T${Number(card.tier || 0)} · ${escapeHtml(source)}</span>
          <h3>${escapeHtml(card.title || "예약 카드")}</h3>
          <p>${Number(card.prestige || 0)}점 · ${gemDot(card.bonus)} ${escapeHtml(GEM_LABELS[card.bonus] ?? card.bonus)} 영구 보너스</p>
        </div>
        <button class="phase62-close" type="button" data-phase62-close aria-label="예약 카드 구매 패널 닫기">×</button>
      </div>
      <div class="phase6-purchase-panel phase62-payment-box">
        <div class="phase6-purchase-heading">
          <div><span class="phase6-badge">예약 카드 실제 결제</span><strong>실제 결제 ${total}개${discount ? ` · 보너스 할인 ${discount}개` : ""}</strong></div>
          <span class="phase6-gold-summary">${gemDot("gold")} 금 <strong>${gold}</strong> / 보유 ${goldOwned}</span>
        </div>
        ${total
          ? `<div class="phase6-payment-grid">${NORMAL_COLORS.map((color) => paymentRow(card, color)).join("")}</div>`
          : `<div class="phase6-free-purchase">영구 보너스만으로 무료 구매할 수 있습니다.</div>`}
        <p class="phase6-payment-help">공개 카드 구매와 같은 결제 규칙입니다. 기본은 일반 보석 우선이며, <strong>−</strong>를 누르면 그 일반 보석 대신 금을 사용합니다.</p>
        <div class="phase6-payment-status ${ready ? "is-ready" : "is-blocked"}">${ready ? "현재 결제로 이 예약 카드를 구매할 수 있습니다." : purchaseLabel(card)}</div>
        <button class="button button--primary button--block" type="button" data-phase62-purchase data-card-id="${escapeHtml(card.instance_id)}" ${ready ? "" : "disabled"}>${purchaseLabel(card)}</button>
      </div>
      <p class="phase62-rule-note">예약 카드는 이미 공개 자리에서 빠졌기 때문에 구매해도 공개 카드나 덱 장수는 변하지 않습니다. 내 예약 수만 1장 줄고 구매 카드 수가 1장 늘어납니다.</p>
    </section>`;
}

function feedbackMarkup() {
  return state.feedback
    ? `<div class="phase6-feedback is-${state.feedbackType}" data-phase62-feedback role="status">${escapeHtml(state.feedback)}</div>`
    : "";
}

function markReservedCards() {
  const cards = reservedCards();
  const elements = [...document.querySelectorAll(".phase5-reserved-card")];
  elements.forEach((element, index) => {
    const card = cards[index];
    element.classList.toggle("is-purchase-selected", Boolean(card && card.instance_id === state.selectedCardId));
    element.classList.toggle("is-purchase-clickable", Boolean(card));
    if (card) {
      element.dataset.phase62CardIndex = String(index);
      element.setAttribute("role", "button");
      element.setAttribute("tabindex", "0");
      element.setAttribute("aria-label", `${card.title || "예약 카드"} 구매 정보 열기`);
    } else {
      delete element.dataset.phase62CardIndex;
      element.removeAttribute("role");
      element.removeAttribute("tabindex");
      element.removeAttribute("aria-label");
    }
  });
}

function injectPanel() {
  const existing = document.querySelector("[data-phase62-panel]");
  const card = selectedCard();
  if (!card) {
    existing?.remove();
    return;
  }

  ensurePayment(card);
  const markup = panelMarkup(card);
  if (existing) {
    existing.outerHTML = markup;
    return;
  }

  const reservedPanel = document.querySelector("[data-phase5-reserved-panel]");
  if (reservedPanel) reservedPanel.insertAdjacentHTML("afterend", markup);
}

function injectFeedback() {
  let box = document.querySelector("[data-phase62-feedback]");
  if (!state.feedback) {
    box?.remove();
    return;
  }
  if (!box) {
    document.querySelector(".board-side > .notice")?.insertAdjacentHTML("beforebegin", feedbackMarkup());
    return;
  }
  box.className = `phase6-feedback is-${state.feedbackType}`;
  box.textContent = state.feedback;
}

function enhanceDom() {
  if (!state.snapshot || !document.querySelector(".board-shell")) return;
  observer?.disconnect();
  try {
    markReservedCards();
    injectPanel();
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

function renderedGameVersion() {
  const text = document.querySelector(".board-topbar .subtle")?.textContent ?? "";
  const match = text.match(/게임 v(\d+)/);
  return match ? Number(match[1]) : null;
}

async function refreshSnapshot() {
  if (state.fetching || !document.querySelector(".board-shell")) return;
  state.fetching = true;
  try {
    const roomId = await resolveRoomId();
    if (!roomId) return;
    const previousVersion = Number(gameState()?.version ?? -1);
    state.snapshot = await getGameSnapshot(roomId);
    const nextVersion = Number(gameState()?.version ?? -1);
    if (previousVersion !== nextVersion) state.paymentVersion = null;
    if (state.selectedCardId && !selectedCard()) state.selectedCardId = null;
    enhanceDom();
  } catch (error) {
    console.warn("[splendor phase6 reserved] snapshot refresh failed", error);
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
      const domVersion = renderedGameVersion();
      const snapshotVersion = Number(gameState()?.version ?? -1);
      if (domVersion !== null && domVersion !== snapshotVersion) {
        scheduleRefresh();
        return;
      }
      queueMicrotask(() => {
        if (document.querySelector(".board-shell")) {
          markReservedCards();
          if (state.selectedCardId && !document.querySelector("[data-phase62-panel]")) injectPanel();
        }
      });
    });
  }
  observer.observe(app, { childList: true, subtree: true });
}

function selectReservedCardByElement(element) {
  const index = Number(element?.dataset.phase62CardIndex);
  const card = Number.isInteger(index) ? reservedCards()[index] : null;
  if (!card) return;
  state.selectedCardId = card.instance_id;
  state.paymentVersion = null;
  state.feedback = "";
  resetPayment(card);
  enhanceDom();
  document.querySelector("[data-phase62-panel]")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
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

async function purchaseReserved(cardId) {
  if (state.busy) return;
  const card = reservedCards().find((item) => item.instance_id === cardId);
  const snapshot = state.snapshot;
  if (!card || !snapshot?.game || !snapshot?.self || !state.roomId) return;
  ensurePayment(card);
  if (!canAct() || !canAfford(card)) return;

  const expectedVersion = Number(snapshot.game.version);
  const payment = paymentPayload(card);
  const beforeScore = Number(snapshot.self.score || 0);
  const beforeBonus = numberAt(snapshot.self.bonuses, card.bonus);
  const beforeReserved = Number(snapshot.self.reserved_card_count || 0);

  state.busy = true;
  state.feedback = `${card.title} 예약 카드를 구매하고 있습니다…`;
  state.feedbackType = "info";
  enhanceDom();

  try {
    const next = await gameCommands.purchaseReserved(
      state.roomId,
      card.instance_id,
      payment,
      expectedVersion,
      newClientActionId(),
    );
    state.snapshot = next;
    state.selectedCardId = null;
    state.paymentVersion = null;

    const meAfter = next?.players?.find((player) => player.user_id === snapshot.self.user_id);
    const scoreGain = Number(meAfter?.score ?? beforeScore) - beforeScore;
    const bonusGain = Math.max(numberAt(meAfter?.bonuses, card.bonus) - beforeBonus, 0);
    const reservedAfter = Number(meAfter?.reserved_card_count ?? Math.max(beforeReserved - 1, 0));

    state.feedback = `${card.title} 예약 카드 구매 완료${scoreGain ? ` · ${scoreGain}점 획득` : ""}${bonusGain ? ` · ${GEM_LABELS[card.bonus]} 영구 보너스 +${bonusGain}` : ""}. 예약 ${beforeReserved}장 → ${reservedAfter}장, 턴이 넘어갔습니다.`;
    state.feedbackType = "success";
    enhanceDom();

    setTimeout(() => {
      const stale = [...document.querySelectorAll(".phase5-reserved-card h4")]
        .some((title) => title.textContent?.trim() === card.title);
      if (stale && !reservedCards().some((item) => item.instance_id === card.instance_id)) window.location.reload();
    }, 1500);
  } catch (error) {
    state.feedback = error?.message ?? "예약 카드를 구매하지 못했습니다.";
    state.feedbackType = "error";
    if (["STATE_CHANGED", "RESERVED_CARD_NOT_AVAILABLE"].includes(error?.code)) await refreshSnapshot();
    enhanceDom();
  } finally {
    state.busy = false;
    enhanceDom();
  }
}

document.addEventListener("click", (event) => {
  const step = event.target.closest("[data-phase62-pay]");
  if (step) {
    event.preventDefault();
    event.stopPropagation();
    adjustPayment(step.dataset.phase62Pay, Number(step.dataset.delta || 0));
    return;
  }

  const purchaseButton = event.target.closest("[data-phase62-purchase]");
  if (purchaseButton && !purchaseButton.disabled) {
    event.preventDefault();
    event.stopPropagation();
    void purchaseReserved(purchaseButton.dataset.cardId);
    return;
  }

  if (event.target.closest("[data-phase62-close]")) {
    event.preventDefault();
    state.selectedCardId = null;
    state.paymentVersion = null;
    enhanceDom();
    return;
  }

  const reservedCard = event.target.closest(".phase5-reserved-card[data-phase62-card-index]");
  if (reservedCard) selectReservedCardByElement(reservedCard);
});

document.addEventListener("keydown", (event) => {
  if (!["Enter", " "].includes(event.key)) return;
  const reservedCard = event.target.closest(".phase5-reserved-card[data-phase62-card-index]");
  if (!reservedCard) return;
  event.preventDefault();
  selectReservedCardByElement(reservedCard);
});

async function bootstrap() {
  try {
    await initializeAuth();
    if (!getAuthState().isApproved) return;
    observe();
    scheduleRefresh(0);
  } catch (error) {
    console.warn("[splendor phase6 reserved] bootstrap failed", error);
  }
}

void bootstrap();
