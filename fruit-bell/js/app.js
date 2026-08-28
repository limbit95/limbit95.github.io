import { FRUIT_BY_ID } from "./constants.js";
import { FruitBellGame } from "./gameEngine.js";
import {
  ANIMAL_AVATARS,
  AVATAR_ACTIONS,
  AVATAR_EMOTIONS,
  createAvatarState,
  getAnimalAvatar,
  resetAvatarPose,
  setAvatarAction,
  updateGaze,
} from "./avatarSystem.js";

const PLAYER_ID = "local-player";
const BOT_NAMES = ["모모", "두부", "콩이"];
const BOT_REACTION_MS = [520, 680, 840];

const elements = {
  lobby: document.querySelector("#avatar-lobby"),
  animalGrid: document.querySelector("#animal-grid"),
  startButton: document.querySelector("#start-game"),
  game: document.querySelector("#game-screen"),
  stage: document.querySelector("#game-stage"),
  table: document.querySelector("#player-table"),
  bell: document.querySelector("#bell-button"),
  status: document.querySelector("#game-status"),
  fruitTotals: document.querySelector("#fruit-totals"),
  restartButton: document.querySelector("#restart-game"),
};

let selectedAnimalId = ANIMAL_AVATARS[0].id;
let game = null;
let avatarStates = new Map();
let timers = new Set();

function renderAnimalChoices() {
  elements.animalGrid.replaceChildren();
  ANIMAL_AVATARS.forEach((animal) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "animal-choice";
    button.dataset.selected = String(animal.id === selectedAnimalId);
    button.setAttribute("aria-pressed", String(animal.id === selectedAnimalId));
    button.innerHTML = `
      <span class="animal-choice__preview" aria-hidden="true">${animal.emoji}</span>
      <span class="animal-choice__name">${animal.name}</span>
    `;
    button.addEventListener("click", () => {
      selectedAnimalId = animal.id;
      renderAnimalChoices();
    });
    elements.animalGrid.append(button);
  });
}

function buildPlayers() {
  const remainingAnimals = ANIMAL_AVATARS.filter((animal) => animal.id !== selectedAnimalId);
  const configs = [
    { id: PLAYER_ID, name: "나", animalId: selectedAnimalId, isBot: false },
    ...BOT_NAMES.map((name, index) => ({
      id: `bot-${index + 1}`,
      name,
      animalId: remainingAnimals[index % remainingAnimals.length].id,
      isBot: true,
    })),
  ];

  avatarStates = new Map(
    configs.map((player) => [
      player.id,
      createAvatarState({ playerId: player.id, animalId: player.animalId }),
    ]),
  );

  return configs;
}

function startGame() {
  clearTimers();
  const players = buildPlayers();
  game = new FruitBellGame({ players });
  game.start();
  elements.lobby.hidden = true;
  elements.game.hidden = false;
  elements.stage.focus({ preventScroll: true });
  updateStatus("카드를 보고 종을 노려보세요. 내 차례에는 카드 더미를 클릭합니다.");
  render();
  continueFlow();
}

function restartGame() {
  clearTimers();
  game = null;
  avatarStates = new Map();
  elements.game.hidden = true;
  elements.lobby.hidden = false;
  renderAnimalChoices();
}

function render() {
  if (!game) return;
  const state = game.snapshot();
  renderPlayers(state);
  renderFruitTotals(state);
  elements.bell.disabled = Boolean(state.winnerId);
  elements.bell.dataset.ready = String(Boolean(state.bellFruit));

  if (state.winnerId) {
    const winner = state.players.find((player) => player.id === state.winnerId);
    updateStatus(`${winner?.name || "플레이어"} 승리! 다시 시작해 다른 동물도 골라보세요.`);
  }
}

function renderPlayers(state) {
  elements.table.replaceChildren();
  state.players.forEach((player, index) => {
    const avatarState = avatarStates.get(player.id) || createAvatarState({ playerId: player.id });
    const animal = getAnimalAvatar(avatarState.animalId);
    const seat = document.createElement("section");
    seat.className = "player-seat";
    seat.dataset.seat = String(index);
    seat.dataset.playerId = player.id;
    seat.dataset.active = String(state.activePlayerId === player.id);
    seat.dataset.out = String(player.isOut);

    const cardMarkup = player.visibleCard ? renderFruitCard(player.visibleCard) : renderEmptyCard();
    const isLocalTurn = player.id === PLAYER_ID && state.activePlayerId === PLAYER_ID && !state.winnerId;
    const deckControl = isLocalTurn
      ? `<button type="button" class="deck-stack deck-stack--active" data-action="flip" aria-label="내 카드 뒤집기"><span>${player.drawCount}</span></button>`
      : `<div class="deck-stack" aria-label="남은 카드 ${player.drawCount}장"><span>${player.drawCount}</span></div>`;

    seat.innerHTML = `
      <div class="avatar-shell avatar-shell--${animal.tone}" data-avatar-player="${player.id}" data-avatar-action="${avatarState.action}" data-avatar-emotion="${avatarState.emotion}" style="--gaze-x:${avatarState.gazeX};--gaze-y:${avatarState.gazeY};">
        <div class="avatar-shadow"></div>
        <div class="avatar-body">
          <div class="avatar-head" aria-hidden="true">${animal.emoji}</div>
          <div class="avatar-hand avatar-hand--right"></div>
        </div>
        <span class="avatar-name">${player.name} · ${animal.name}</span>
      </div>
      <div class="player-cards">
        ${deckControl}
        ${cardMarkup}
      </div>
    `;

    const flipButton = seat.querySelector('[data-action="flip"]');
    flipButton?.addEventListener("click", () => handleFlip(PLAYER_ID));
    elements.table.append(seat);
  });
}

function renderFruitCard(card) {
  const fruit = FRUIT_BY_ID[card.fruit];
  const icons = Array.from({ length: card.count }, () => `<span>${fruit?.emoji || "●"}</span>`).join("");
  return `
    <div class="fruit-card" data-fruit="${card.fruit}" aria-label="${fruit?.label || card.fruit} ${card.count}개">
      <div class="fruit-card__icons">${icons}</div>
      <strong>${card.count}</strong>
    </div>
  `;
}

function renderEmptyCard() {
  return '<div class="fruit-card fruit-card--empty" aria-label="아직 공개된 카드 없음"><span>?</span></div>';
}

function renderFruitTotals(state) {
  elements.fruitTotals.replaceChildren();
  Object.entries(FRUIT_BY_ID).forEach(([fruitId, fruit]) => {
    const total = state.visibleTotals[fruitId] || 0;
    const item = document.createElement("div");
    item.className = "fruit-total";
    item.dataset.hit = String(total === 5);
    item.innerHTML = `<span aria-hidden="true">${fruit.emoji}</span><strong>${total}</strong>`;
    item.setAttribute("aria-label", `${fruit.label} 합계 ${total}`);
    elements.fruitTotals.append(item);
  });
}

function handleFlip(playerId) {
  if (!game || game.winnerId) return;
  clearTimers();
  try {
    const result = game.flipCard(playerId);
    setAction(playerId, AVATAR_ACTIONS.FLIP_CARD, AVATAR_EMOTIONS.FOCUSED, 380);
    const fruit = FRUIT_BY_ID[result.card.fruit];
    updateStatus(`${fruit?.label || "과일"} ${result.card.count}개가 나왔습니다.`);
    render();
    continueFlow();
  } catch (error) {
    updateStatus(error.message);
  }
}

function handleBell(playerId) {
  if (!game || game.winnerId) return;
  clearTimers();
  try {
    setAction(playerId, AVATAR_ACTIONS.RING_BELL, AVATAR_EMOTIONS.FOCUSED, 420);
    const result = game.ringBell(playerId);
    if (result.correct) {
      const fruit = FRUIT_BY_ID[result.fruit];
      updateStatus(`${playerName(playerId)} 성공! ${fruit?.label || "과일"} 합계 5를 잡아 ${result.collectedCount}장을 가져갑니다.`);
      schedule(() => setAction(playerId, AVATAR_ACTIONS.CELEBRATE, AVATAR_EMOTIONS.HAPPY, 700), 260);
    } else {
      updateStatus(`${playerName(playerId)} 오답! 조건이 아닌데 종을 쳐 ${result.penaltyCount}장을 나눠 줍니다.`);
      schedule(() => setAction(playerId, AVATAR_ACTIONS.MISS, AVATAR_EMOTIONS.EMBARRASSED, 650), 220);
    }
    render();
    schedule(continueFlow, 900);
  } catch (error) {
    updateStatus(error.message);
  }
}

function continueFlow() {
  if (!game || game.winnerId) {
    render();
    return;
  }

  const state = game.snapshot();
  if (state.bellFruit) {
    scheduleBotBellRace(state);
    return;
  }

  const activeIndex = state.players.findIndex((player) => player.id === state.activePlayerId);
  const active = state.players[activeIndex];
  if (!active || active.id === PLAYER_ID) return;

  updateStatus(`${active.name}의 차례입니다.`);
  schedule(() => {
    if (!game || game.winnerId || game.snapshot().activePlayerId !== active.id) return;
    try {
      const result = game.flipCard(active.id);
      setAction(active.id, AVATAR_ACTIONS.FLIP_CARD, AVATAR_EMOTIONS.FOCUSED, 380);
      const fruit = FRUIT_BY_ID[result.card.fruit];
      updateStatus(`${active.name}이 ${fruit?.label || "과일"} ${result.card.count}개를 뒤집었습니다.`);
      render();
      continueFlow();
    } catch (error) {
      updateStatus(error.message);
    }
  }, 720 + Math.floor(Math.random() * 420));
}

function scheduleBotBellRace(state) {
  const bots = state.players.filter((player) => player.id !== PLAYER_ID && !player.isOut);
  bots.forEach((bot, index) => {
    schedule(() => {
      if (!game || game.winnerId || !game.snapshot().bellFruit) return;
      handleBell(bot.id);
    }, BOT_REACTION_MS[index % BOT_REACTION_MS.length] + Math.floor(Math.random() * 170));
  });
  updateStatus("같은 과일의 합계가 5! 스페이스바 또는 종을 먼저 누르세요.");
}

function setAction(playerId, action, emotion, resetAfter = 0) {
  const current = avatarStates.get(playerId);
  if (!current) return;
  avatarStates.set(playerId, setAvatarAction(current, action, emotion));
  applyAvatarState(playerId);

  if (resetAfter > 0) {
    schedule(() => {
      const latest = avatarStates.get(playerId);
      if (!latest) return;
      avatarStates.set(playerId, resetAvatarPose(latest));
      applyAvatarState(playerId);
    }, resetAfter);
  }
}

function applyAvatarState(playerId) {
  const node = document.querySelector(`[data-avatar-player="${playerId}"]`);
  const state = avatarStates.get(playerId);
  if (!node || !state) return;
  node.dataset.avatarAction = state.action;
  node.dataset.avatarEmotion = state.emotion;
  node.style.setProperty("--gaze-x", String(state.gazeX));
  node.style.setProperty("--gaze-y", String(state.gazeY));
}

function updateLocalGaze(event) {
  if (!game) return;
  const rect = elements.stage.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const gazeX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const gazeY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
  const current = avatarStates.get(PLAYER_ID);
  if (!current) return;
  avatarStates.set(PLAYER_ID, updateGaze(current, gazeX, gazeY));
  applyAvatarState(PLAYER_ID);
}

function playerName(playerId) {
  return game?.players.find((player) => player.id === playerId)?.name || "플레이어";
}

function updateStatus(message) {
  elements.status.textContent = message;
}

function schedule(callback, delay) {
  const timer = window.setTimeout(() => {
    timers.delete(timer);
    callback();
  }, delay);
  timers.add(timer);
  return timer;
}

function clearTimers() {
  timers.forEach((timer) => window.clearTimeout(timer));
  timers.clear();
}

function onKeyDown(event) {
  if (event.code !== "Space" || event.repeat || elements.game.hidden) return;
  const target = event.target;
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return;
  event.preventDefault();
  handleBell(PLAYER_ID);
}

elements.startButton.addEventListener("click", startGame);
elements.restartButton.addEventListener("click", restartGame);
elements.bell.addEventListener("click", () => handleBell(PLAYER_ID));
elements.stage.addEventListener("pointermove", updateLocalGaze);
document.addEventListener("keydown", onKeyDown);

renderAnimalChoices();
