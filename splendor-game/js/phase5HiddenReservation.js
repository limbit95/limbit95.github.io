import { getAuthState, initializeAuth } from "../../js/auth.js";
import { getMyActiveRoom } from "./lobbyApi.js";
import { getGameSnapshot, gameCommands, newClientActionId } from "./gameApi.js";

const app = document.querySelector("#app");

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
let originMarkQueued = false;

function gameState() {
  return state.snapshot?.game ?? null;
}

function myState() {
  return state.snapshot?.self ?? null;
}

function deckCount(tier) {
  return Number(state.snapshot?.decks?.[String(tier)] ?? 0);
}

function reservedCards() {
  return Array.isArray(state.snapshot?.reserved_cards) ? state.snapshot.reserved_cards : [];
}

function canReserveTier(tier) {
  const game = gameState();
  const me = myState();
  if (!game || !me || state.busy) return false;
  if (game.turn_phase !== "action" || !me.is_current_turn) return false;
  if (Number(me.reserved_card_count || 0) >= Number(game.max_reserved || 3)) return false;
  return deckCount(tier) > 0;
}

function reserveTierLabel(tier) {
  const game = gameState();
  const me = myState();
  if (state.busy) return "예약 처리 중…";
  if (!game || !me) return "상태 확인 중…";
  if (game.turn_phase === "return_excess") return "먼저 초과 토큰 반환";
  if (!me.is_current_turn) return "내 턴에 덱 예약 가능";
  if (Number(me.reserved_card_count || 0) >= Number(game.max_reserved || 3)) {
    return `예약 한도 ${Number(game.max_reserved || 3)}장`;
  }
  if (deckCount(tier) <= 0) return "덱이 비었습니다";
  return `🂠 덱에서 예약 · ${deckCount(tier)}장`;
}

function tierFromRow(row) {
  const title = row.querySelector(".section-heading h3")?.textContent?.trim() ?? "";
  const match = title.match(/^([123])단계/);
  return match ? Number(match[1]) : null;
}

function findTierRow(tier) {
  return [...document.querySelectorAll(".tier-row")].find((row) => tierFromRow(row) === Number(tier)) ?? null;
}

function enhanceTierControls() {
  const rows = [...document.querySelectorAll(".tier-row")];
  rows.forEach((row) => {
    const tier = tierFromRow(row);
    const heading = row.querySelector(".section-heading");
    if (!tier || !heading) return;

    let control = heading.querySelector("[data-phase5-hidden-control]");
    if (!control) {
      control = document.createElement("div");
      control.className = "phase5-hidden-control";
      control.dataset.phase5HiddenControl = String(tier);
      control.innerHTML = `<button class="button button--secondary phase5-hidden-reserve-button" type="button" data-phase5-hidden-reserve data-tier="${tier}"></button>`;
      heading.appendChild(control);
    }

    const button = control.querySelector("[data-phase5-hidden-reserve]");
    if (!button) return;
    const nextLabel = reserveTierLabel(tier);
    if (button.textContent !== nextLabel) button.textContent = nextLabel;
    button.disabled = !canReserveTier(tier);
    button.dataset.tier = String(tier);
    button.title = deckCount(tier) > 0
      ? `${tier}단계 덱의 맨 위 카드를 확인하지 않고 예약합니다.`
      : `${tier}단계 덱에 남은 카드가 없습니다.`;
  });
}

function markHiddenReservationOrigins() {
  originMarkQueued = false;
  const cards = reservedCards();
  const elements = [...document.querySelectorAll(".phase5-reserved-grid .phase5-reserved-card")];
  if (!elements.length || !cards.length) return;

  elements.forEach((element, index) => {
    element.querySelector("[data-phase5-hidden-origin]")?.remove();
    if (!cards[index]?.reserved_hidden) return;
    const label = document.createElement("span");
    label.className = "phase5-hidden-origin";
    label.dataset.phase5HiddenOrigin = "true";
    label.textContent = "🂠 덱 뒷면에서 예약";
    element.appendChild(label);
  });
}

function feedbackMarkup() {
  if (!state.feedback) return "";
  const className = state.feedbackType === "error" ? "is-error" : state.feedbackType === "success" ? "is-success" : "is-info";
  return `<div class="phase5-hidden-feedback ${className}" data-phase5-hidden-feedback role="status"></div>`;
}

function injectFeedback() {
  let box = document.querySelector("[data-phase5-hidden-feedback]");
  if (!state.feedback) {
    box?.remove();
    return;
  }
  if (!box) {
    const notice = document.querySelector(".board-side > .notice");
    if (!notice) return;
    notice.insertAdjacentHTML("beforebegin", feedbackMarkup());
    box = document.querySelector("[data-phase5-hidden-feedback]");
  }
  if (!box) return;
  box.classList.toggle("is-error", state.feedbackType === "error");
  box.classList.toggle("is-success", state.feedbackType === "success");
  box.classList.toggle("is-info", state.feedbackType === "info");
  if (box.textContent !== state.feedback) box.textContent = state.feedback;
}

function enhanceDom() {
  if (!document.querySelector(".board-shell") || !state.snapshot) return;
  observer?.disconnect();
  try {
    enhanceTierControls();
    injectFeedback();
    markHiddenReservationOrigins();
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
    console.warn("[splendor phase5 hidden] snapshot refresh failed", error);
  } finally {
    state.fetching = false;
  }
}

function scheduleRefresh(delay = 80) {
  clearTimeout(state.timer);
  state.timer = setTimeout(() => void refreshSnapshot(), delay);
}

function observe() {
  if (!app) return;
  if (!observer) {
    observer = new MutationObserver(() => {
      if (!document.querySelector(".board-shell")) return;
      const tierCount = document.querySelectorAll(".tier-row").length;
      const controlCount = document.querySelectorAll("[data-phase5-hidden-control]").length;
      if (tierCount > 0 && controlCount < tierCount) {
        scheduleRefresh();
        return;
      }

      const hiddenCount = reservedCards().filter((card) => card.reserved_hidden).length;
      const markedCount = document.querySelectorAll("[data-phase5-hidden-origin]").length;
      if (hiddenCount > markedCount && !originMarkQueued) {
        originMarkQueued = true;
        queueMicrotask(markHiddenReservationOrigins);
      }
    });
  }
  observer.observe(app, { childList: true, subtree: true });
}

async function reserveHiddenTier(button) {
  if (state.busy) return;
  const tier = Number(button.dataset.tier);
  const snapshot = state.snapshot;
  const roomId = state.roomId;
  if (![1, 2, 3].includes(tier) || !snapshot?.game || !snapshot?.self || !roomId) return;

  const expectedVersion = Number(snapshot.game.version);
  const previousGold = Number(snapshot.self.tokens?.gold || 0);
  const previousDeck = deckCount(tier);

  state.busy = true;
  state.feedback = `${tier}단계 덱의 맨 위 카드를 예약하고 있습니다…`;
  state.feedbackType = "info";
  enhanceDom();

  try {
    const next = await gameCommands.reserveHidden(roomId, tier, expectedVersion, newClientActionId());
    state.snapshot = next;
    const nextGold = Number(next?.self?.tokens?.gold || 0);
    const gotGold = nextGold > previousGold;
    const needsReturn = next?.game?.turn_phase === "return_excess";

    state.feedback = needsReturn
      ? `${tier}단계 뒷면 카드 예약 완료${gotGold ? " · 금 토큰 1개 획득" : ""}. 토큰이 10개를 초과해 초과분을 반환해야 합니다.`
      : `${tier}단계 뒷면 카드 예약 완료${gotGold ? " · 금 토큰 1개 획득" : " · 남은 금 토큰 없음"}. 덱이 ${previousDeck}장 → ${Math.max(previousDeck - 1, 0)}장으로 줄고 턴이 넘어갔습니다.`;
    state.feedbackType = "success";
    enhanceDom();

    setTimeout(() => {
      const row = findTierRow(tier);
      const meta = row?.querySelector(".section-meta")?.textContent ?? "";
      const expectedDeck = deckCount(tier);
      if (row && !meta.includes(`덱 ${expectedDeck}장`)) window.location.reload();
    }, 1500);
  } catch (error) {
    state.feedback = error?.message ?? "덱에서 카드를 예약하지 못했습니다.";
    state.feedbackType = "error";
    if (error?.code === "STATE_CHANGED" || error?.code === "DECK_EMPTY") {
      await refreshSnapshot();
    }
    enhanceDom();
  } finally {
    state.busy = false;
    enhanceDom();
  }
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-phase5-hidden-reserve]");
  if (!button || button.disabled) return;
  event.preventDefault();
  void reserveHiddenTier(button);
});

async function bootstrap() {
  try {
    await initializeAuth();
    const auth = getAuthState();
    if (!auth.isApproved) return;
    observe();
    scheduleRefresh(0);
  } catch (error) {
    console.warn("[splendor phase5 hidden] bootstrap failed", error);
  }
}

void bootstrap();
