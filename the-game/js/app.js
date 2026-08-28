import {
  canEndTurn,
  canPlayCard,
  createInitialState,
  endTurn,
  getRequiredCardsThisTurn,
  playCard,
} from "./gameEngine.js";
import { GAME_STATUS, PILE_DIRECTION, REVERSE_JUMP } from "./constants.js";

const shell = document.querySelector(".app-shell");
const setupScreen = document.querySelector("#setup-screen");
const gameScreen = document.querySelector("#game-screen");
const setupForm = document.querySelector("#setup-form");
const turnLabel = document.querySelector("#turn-label");
const deckCount = document.querySelector("#deck-count");
const playedCount = document.querySelector("#played-count");
const requiredCount = document.querySelector("#required-count");
const statusMessage = document.querySelector("#status-message");
const hand = document.querySelector("#hand");
const handCount = document.querySelector("#hand-count");
const pileButtons = [...document.querySelectorAll("[data-pile-id]")];
const endTurnButton = document.querySelector("#end-turn-button");
const quitButton = document.querySelector("#quit-button");
const passOverlay = document.querySelector("#pass-overlay");
const passTitle = document.querySelector("#pass-title");
const passConfirmButton = document.querySelector("#pass-confirm-button");
const resultOverlay = document.querySelector("#result-overlay");
const resultKicker = document.querySelector("#result-kicker");
const resultTitle = document.querySelector("#result-title");
const resultMessage = document.querySelector("#result-message");
const remainingCount = document.querySelector("#remaining-count");
const restartButton = document.querySelector("#restart-button");
const setupButton = document.querySelector("#setup-button");

let state = null;
let selectedCard = null;
let handLocked = false;
let onlineLobbyModule = null;

function createModeScreen() {
  const existing = document.querySelector("#mode-screen");
  if (existing) return existing;
  if (!shell || !setupScreen) throw new Error("The Game setup shell was not found.");

  const screen = document.createElement("section");
  screen.id = "mode-screen";
  screen.className = "screen setup-screen";
  screen.innerHTML = `
    <div class="title-mark" aria-hidden="true">☠</div>
    <p class="eyebrow">COOPERATIVE CARD GAME</p>
    <h1>THE GAME</h1>
    <p class="setup-copy">모두 함께 2부터 99까지의 카드를 네 개의 더미에 전부 내려놓으세요.</p>
    <div class="mode-grid" aria-label="플레이 방식 선택">
      <button class="mode-card" type="button" data-online-mode>
        <span class="mode-card__icon" aria-hidden="true">🌐</span>
        <strong>온라인 플레이</strong>
        <span>각자 휴대폰으로 같은 방에 접속해서 플레이합니다.</span>
      </button>
      <button class="mode-card" type="button" data-local-mode>
        <span class="mode-card__icon" aria-hidden="true">📱</span>
        <strong>한 기기 플레이</strong>
        <span>한 화면을 돌아가며 넘겨서 로컬로 플레이합니다.</span>
      </button>
    </div>
    <p id="mode-message" class="online-message" role="alert" aria-live="polite"></p>
    <a class="back-link" href="../#/games">← 게임 목록으로</a>
    <div class="rule-summary">
      <strong>핵심 규칙</strong>
      <p>오름차순은 큰 수, 내림차순은 작은 수를 놓습니다. 정확히 10 차이면 반대 방향으로 되돌릴 수 있습니다.</p>
    </div>
  `;

  shell.insertBefore(screen, setupScreen);
  return screen;
}

const modeScreen = createModeScreen();
const localModeButton = modeScreen.querySelector("[data-local-mode]");
const onlineModeButton = modeScreen.querySelector("[data-online-mode]");
const modeMessage = modeScreen.querySelector("#mode-message");

const localBackButton = document.createElement("button");
localBackButton.type = "button";
localBackButton.className = "ghost-button full-width-button";
localBackButton.textContent = "플레이 방식 다시 선택";
setupForm.append(localBackButton);

function getCurrentPlayer() {
  return state?.players[state.currentPlayerIndex] ?? null;
}

function isReverseJump(card, pile) {
  if (pile.direction === PILE_DIRECTION.ASCENDING) {
    return pile.value - card === REVERSE_JUMP;
  }
  return card - pile.value === REVERSE_JUMP;
}

function resetLocalState() {
  state = null;
  selectedCard = null;
  handLocked = false;
  gameScreen.hidden = true;
  setupScreen.hidden = true;
  passOverlay.hidden = true;
  resultOverlay.hidden = true;
}

function showMode() {
  resetLocalState();
  onlineLobbyModule?.closeOnlineLobby?.();
  modeScreen.hidden = false;
  modeMessage.textContent = "";
}

function showSetup() {
  resetLocalState();
  modeScreen.hidden = true;
  setupScreen.hidden = false;
}

async function showOnline() {
  resetLocalState();
  modeScreen.hidden = true;
  modeMessage.textContent = "";
  try {
    onlineLobbyModule ??= await import("./onlineLobby.js");
    await onlineLobbyModule.openOnlineLobby();
  } catch (error) {
    modeScreen.hidden = false;
    modeMessage.textContent = error instanceof Error
      ? error.message
      : "온라인 플레이 화면을 불러오지 못했습니다.";
  }
}

function startGame(playerCount) {
  state = createInitialState({ playerCount });
  selectedCard = null;
  handLocked = false;
  modeScreen.hidden = true;
  setupScreen.hidden = true;
  gameScreen.hidden = false;
  passOverlay.hidden = true;
  resultOverlay.hidden = true;
  render();
}

function renderPiles() {
  for (const button of pileButtons) {
    const pileId = button.dataset.pileId;
    const pile = state.piles.find((candidate) => candidate.id === pileId);
    const value = button.querySelector(".pile-value");
    value.textContent = pile.value;

    const playable = !handLocked
      && selectedCard !== null
      && canPlayCard(selectedCard, pile);

    button.classList.toggle("is-playable", playable);
    button.classList.toggle("is-reverse", playable && isReverseJump(selectedCard, pile));
    button.disabled = !playable;

    if (playable) {
      const reverseText = isReverseJump(selectedCard, pile) ? ", 10 되돌리기 가능" : "";
      button.setAttribute("aria-label", `${pile.value} 더미에 ${selectedCard} 놓기${reverseText}`);
    } else {
      button.setAttribute("aria-label", `${pile.value} 더미`);
    }
  }
}

function renderHand() {
  const player = getCurrentPlayer();
  hand.replaceChildren();
  handCount.textContent = `${player.hand.length}장`;

  if (handLocked) {
    const locked = document.createElement("div");
    locked.className = "hand-locked";
    locked.textContent = "다음 플레이어가 준비되면 카드를 확인할 수 있습니다.";
    hand.append(locked);
    return;
  }

  const sortedHand = [...player.hand].sort((a, b) => a - b);
  for (const card of sortedHand) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "number-card";
    button.textContent = card;
    button.dataset.card = String(card);
    button.classList.toggle("is-selected", selectedCard === card);
    button.setAttribute("aria-pressed", String(selectedCard === card));
    button.addEventListener("click", () => {
      selectedCard = selectedCard === card ? null : card;
      render();
    });
    hand.append(button);
  }
}

function renderStatus() {
  if (handLocked) {
    statusMessage.textContent = "다음 플레이어에게 화면을 넘겨주세요.";
    return;
  }

  const required = getRequiredCardsThisTurn(state);
  const remainingRequired = Math.max(0, required - state.cardsPlayedThisTurn);

  if (selectedCard !== null) {
    const playablePiles = state.piles.filter((pile) => canPlayCard(selectedCard, pile));
    if (playablePiles.length > 0) {
      statusMessage.textContent = `${selectedCard} 카드를 놓을 더미를 선택하세요.`;
    } else {
      statusMessage.textContent = `${selectedCard} 카드는 현재 어느 더미에도 놓을 수 없습니다.`;
    }
    return;
  }

  if (remainingRequired > 0) {
    statusMessage.textContent = `턴을 끝내려면 최소 ${remainingRequired}장을 더 내려놓아야 합니다.`;
  } else {
    statusMessage.textContent = "턴을 종료하거나 카드를 더 내려놓을 수 있습니다.";
  }
}

function renderResult() {
  if (state.status === GAME_STATUS.PLAYING) {
    resultOverlay.hidden = true;
    return;
  }

  const won = state.status === GAME_STATUS.WON;
  resultKicker.textContent = won ? "MISSION COMPLETE" : "GAME OVER";
  resultTitle.textContent = won ? "모든 카드를 내려놓았습니다!" : "더 이상 진행할 수 없습니다";
  resultMessage.textContent = won
    ? "협력 성공! 숫자 카드 98장을 모두 처리했습니다."
    : "현재 플레이어가 이번 턴의 최소 제출 수를 채울 수 없어 게임이 종료되었습니다.";
  remainingCount.textContent = String(state.result?.remainingCards ?? 0);
  resultOverlay.hidden = false;
}

function render() {
  if (!state) return;

  turnLabel.textContent = `플레이어 ${state.currentPlayerIndex + 1}의 턴`;
  deckCount.textContent = String(state.drawPile.length);
  playedCount.textContent = String(state.cardsPlayedThisTurn);
  requiredCount.textContent = String(getRequiredCardsThisTurn(state));

  renderPiles();
  renderHand();
  renderStatus();

  endTurnButton.disabled = handLocked || !canEndTurn(state);
  const minimum = getRequiredCardsThisTurn(state);
  endTurnButton.textContent = canEndTurn(state)
    ? "턴 종료"
    : `턴 종료 (${state.cardsPlayedThisTurn}/${minimum})`;

  if (state.status !== GAME_STATUS.PLAYING) {
    selectedCard = null;
    handLocked = true;
  }
  renderResult();
}

function playSelectedCard(pileId) {
  if (!state || handLocked || selectedCard === null) return;

  const pile = state.piles.find((candidate) => candidate.id === pileId);
  if (!pile || !canPlayCard(selectedCard, pile)) return;

  try {
    state = playCard(state, { card: selectedCard, pileId });
    selectedCard = null;
    render();
  } catch (error) {
    statusMessage.textContent = error instanceof Error ? error.message : String(error);
  }
}

setupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(setupForm);
  const playerCount = Number(data.get("player-count"));
  startGame(playerCount);
});

localModeButton.addEventListener("click", showSetup);
onlineModeButton.addEventListener("click", showOnline);
localBackButton.addEventListener("click", showMode);
document.addEventListener("the-game:return-home", showMode);

for (const button of pileButtons) {
  button.addEventListener("click", () => playSelectedCard(button.dataset.pileId));
}

endTurnButton.addEventListener("click", () => {
  if (!state || !canEndTurn(state)) return;

  try {
    state = endTurn(state);
    selectedCard = null;

    if (state.status === GAME_STATUS.PLAYING && state.playerCount > 1) {
      handLocked = true;
      passTitle.textContent = `플레이어 ${state.currentPlayerIndex + 1} 차례`;
      passOverlay.hidden = false;
    }

    render();
  } catch (error) {
    statusMessage.textContent = error instanceof Error ? error.message : String(error);
  }
});

passConfirmButton.addEventListener("click", () => {
  handLocked = false;
  passOverlay.hidden = true;
  render();
});

quitButton.addEventListener("click", showMode);
setupButton.addEventListener("click", showSetup);
restartButton.addEventListener("click", () => {
  if (!state) return;
  startGame(state.playerCount);
});

showMode();
