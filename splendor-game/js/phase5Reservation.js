import { getAuthState, initializeAuth } from "../../js/auth.js";
import { getMyActiveRoom } from "./lobbyApi.js";
import { getGameSnapshot, gameCommands, newClientActionId } from "./gameApi.js";

const app = document.querySelector("#app");

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
  feedback: "",
  feedbackType: "info",
  timer: null,
  fetching: false,
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

function renderCosts(cost = {}) {
  return Object.entries(cost)
    .filter(([, amount]) => Number(amount) > 0)
    .map(([color, amount]) => `<span class="cost-chip">${gemDot(color)}${Number(amount)}</span>`)
    .join("");
}

function selectedCardIdFromDom() {
  return document.querySelector(".dev-card.is-selected[data-card-id]")?.dataset.cardId ?? null;
}

function myState() {
  return state.snapshot?.self ?? null;
}

function gameState() {
  return state.snapshot?.game ?? null;
}

function visibleCards() {
  return Array.isArray(state.snapshot?.cards) ? state.snapshot.cards : [];
}

function reservedCards() {
  return Array.isArray(state.snapshot?.reserved_cards) ? state.snapshot.reserved_cards : [];
}

function canReserveSelected(cardId) {
  const me = myState();
  const game = gameState();
  if (!cardId || !me || !game) return false;
  if (state.busy) return false;
  if (!me.is_current_turn || game.turn_phase !== "action") return false;
  if (Number(me.reserved_card_count || 0) >= Number(game.max_reserved || 3)) return false;
  return visibleCards().some((card) => card.instance_id === cardId);
}

function reserveButtonLabel(cardId) {
  const me = myState();
  const game = gameState();
  if (state.busy) return "예약 처리 중…";
  if (!me || !game) return "상태 확인 중…";
  if (game.turn_phase === "return_excess") return "먼저 초과 토큰 반환";
  if (!me.is_current_turn) return "내 턴에 예약 가능";
  if (Number(me.reserved_card_count || 0) >= Number(game.max_reserved || 3)) return `예약 한도 ${Number(game.max_reserved || 3)}장`;
  if (!cardId) return "카드를 먼저 선택하세요";
  return "이 카드 예약하기";
}

function selectedHelpCopy(cardId) {
  const me = myState();
  const game = gameState();
  if (!cardId) return "공개 카드를 선택하면 예약 가능 여부를 확인할 수 있어요.";
  if (!me || !game) return "예약 가능 여부를 확인하고 있습니다.";
  if (game.turn_phase === "return_excess") return "현재는 초과 토큰을 먼저 반환해야 합니다.";
  if (!me.is_current_turn) return "카드 정보는 볼 수 있지만 예약은 자신의 턴에만 할 수 있습니다.";
  if (Number(me.reserved_card_count || 0) >= Number(game.max_reserved || 3)) return `예약 카드는 최대 ${Number(game.max_reserved || 3)}장까지 보유할 수 있습니다.`;
  return "예약하면 이 카드는 내 예약 카드로 이동하고, 같은 단계 덱에 카드가 남아 있으면 빈 자리가 바로 보충됩니다. 금 토큰이 남아 있으면 1개도 함께 받습니다.";
}

function reservedCardMarkup(card) {
  const label = GEM_LABELS[card.bonus] ?? card.bonus;
  return `
    <article class="phase5-reserved-card">
      <div class="phase5-reserved-card__top">
        <span class="phase5-tier">T${Number(card.tier || 0)}</span>
        <strong>${Number(card.prestige || 0)}점</strong>
      </div>
      <h4>${escapeHtml(card.title || "예약 카드")}</h4>
      <p>${gemDot(card.bonus)} ${escapeHtml(label)} 영구 보너스</p>
      <div class="costs">${renderCosts(card.cost)}</div>
      <span class="phase5-private-label">나에게만 카드 내용 표시</span>
    </article>
  `;
}

function reservedPanelMarkup() {
  const me = myState();
  const game = gameState();
  if (!me || !game) return "";
  const cards = reservedCards();
  const max = Number(game.max_reserved || 3);
  return `
    <section class="surface board-section phase5-reserved-panel" data-phase5-reserved-panel>
      <div class="section-heading">
        <h2>🔒 내 예약 카드</h2>
        <span class="section-meta">${cards.length} / ${max}장</span>
      </div>
      ${cards.length
        ? `<div class="phase5-reserved-grid">${cards.map(reservedCardMarkup).join("")}</div>`
        : `<div class="phase5-empty-reserved"><strong>아직 예약한 카드가 없습니다.</strong><p>내 턴에 공개 카드 하나를 선택한 뒤 예약할 수 있어요.</p></div>`}
      <p class="phase5-privacy-note">다른 플레이어에게는 예약한 장수만 보이고 카드 내용은 표시하지 않습니다.</p>
    </section>
  `;
}

function feedbackMarkup() {
  if (!state.feedback) return "";
  return `<div class="phase5-feedback is-${state.feedbackType}" data-phase5-feedback>${escapeHtml(state.feedback)}</div>`;
}

function enhancePhaseBanner() {
  const banner = document.querySelector(".prototype-banner");
  if (!banner) return;
  const strong = banner.querySelector("strong");
  const badge = banner.querySelector(".prototype-badge");
  if (document.querySelector(".board-shell")) {
    if (strong) strong.textContent = "PHASE 5 · CARD RESERVATION";
    if (badge) badge.textContent = "RESERVE ENGINE";
  }
}

function enhanceSelectionPanel() {
  const box = document.querySelector(".selection-box");
  if (!box) return;
  const cardId = selectedCardIdFromDom();
  const buttons = box.querySelectorAll(".action-row .button");
  if (buttons.length < 2) return;

  const purchaseButton = buttons[0];
  const reserveButton = buttons[1];
  purchaseButton.disabled = true;
  purchaseButton.textContent = "구매 · 다음 단계";

  reserveButton.dataset.phase5Reserve = "true";
  if (cardId) reserveButton.dataset.cardInstanceId = cardId;
  else delete reserveButton.dataset.cardInstanceId;
  reserveButton.disabled = !canReserveSelected(cardId);
  reserveButton.textContent = reserveButtonLabel(cardId);

  const copy = box.querySelector(".selection-copy");
  if (copy) copy.textContent = selectedHelpCopy(cardId);
}

function injectReservedPanel() {
  document.querySelector("[data-phase5-reserved-panel]")?.remove();
  const sections = [...document.querySelectorAll(".board-side > .board-section")];
  const mySection = sections.find((section) => section.querySelector("h2")?.textContent?.trim() === "내 상태");
  if (!mySection) return;
  mySection.insertAdjacentHTML("afterend", reservedPanelMarkup());
}

function injectFeedback() {
  document.querySelector("[data-phase5-feedback]")?.remove();
  if (!state.feedback) return;
  const notice = document.querySelector(".board-side > .notice");
  if (notice) notice.insertAdjacentHTML("beforebegin", feedbackMarkup());
}

function enhanceDom() {
  if (!document.querySelector(".board-shell") || !state.snapshot) return;
  observer?.disconnect();
  try {
    enhancePhaseBanner();
    enhanceSelectionPanel();
    injectReservedPanel();
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
    state.snapshot = await getGameSnapshot(roomId);
    enhanceDom();
  } catch (error) {
    console.warn("[splendor phase5] snapshot refresh failed", error);
  } finally {
    state.fetching = false;
  }
}

function scheduleRefresh(delay = 90) {
  clearTimeout(state.timer);
  state.timer = setTimeout(() => void refreshSnapshot(), delay);
}

function observe() {
  if (!app) return;
  if (!observer) {
    observer = new MutationObserver(() => scheduleRefresh());
  }
  observer.observe(app, { childList: true, subtree: true });
}

async function reserveSelectedCard(button) {
  if (state.busy) return;
  const cardId = button.dataset.cardInstanceId || selectedCardIdFromDom();
  const snapshot = state.snapshot;
  const roomId = state.roomId;
  if (!cardId || !snapshot?.game || !snapshot?.self || !roomId) return;

  // Capture values before the base app re-renders.
  const expectedVersion = Number(snapshot.game.version);
  const previousGold = Number(snapshot.self.tokens?.gold || 0);
  const selectedTitle = visibleCards().find((card) => card.instance_id === cardId)?.title || "선택한 카드";

  state.busy = true;
  state.feedback = "카드를 예약하고 있습니다…";
  state.feedbackType = "info";
  enhanceDom();

  try {
    const next = await gameCommands.reserveFaceup(roomId, cardId, expectedVersion, newClientActionId());
    state.snapshot = next;
    const nextGold = Number(next?.self?.tokens?.gold || 0);
    const gotGold = nextGold > previousGold;
    const needsReturn = next?.game?.turn_phase === "return_excess";

    state.feedback = needsReturn
      ? `${selectedTitle} 예약 완료${gotGold ? " · 금 토큰 1개 획득" : ""}. 토큰이 10개를 초과해 초과분을 반환해야 합니다.`
      : `${selectedTitle} 예약 완료${gotGold ? " · 금 토큰 1개 획득" : " · 남은 금 토큰 없음"}. 공개 카드가 보충되고 턴이 넘어갔습니다.`;
    state.feedbackType = "success";
    enhanceDom();

    // The base Phase 4 app normally refreshes through the existing DB Broadcast.
    // If that event is missed, refresh the page only when the old face-up card still remains.
    setTimeout(() => {
      const staleCard = document.querySelector(`.dev-card[data-card-id="${cardId}"]`);
      const serverStillShowsCard = visibleCards().some((card) => card.instance_id === cardId);
      if (staleCard && !serverStillShowsCard) window.location.reload();
    }, 1400);
  } catch (error) {
    state.feedback = error?.message ?? "카드를 예약하지 못했습니다.";
    state.feedbackType = "error";
    if (error?.code === "STATE_CHANGED" || error?.code === "CARD_NOT_AVAILABLE") {
      await refreshSnapshot();
    }
    enhanceDom();
  } finally {
    state.busy = false;
    enhanceDom();
  }
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-phase5-reserve]");
  if (!button || button.disabled) return;
  event.preventDefault();
  void reserveSelectedCard(button);
});

async function bootstrap() {
  try {
    await initializeAuth();
    const auth = getAuthState();
    if (!auth.isApproved) return;
    observe();
    scheduleRefresh(0);
  } catch (error) {
    console.warn("[splendor phase5] bootstrap failed", error);
  }
}

void bootstrap();
