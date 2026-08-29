import { FruitBellGame, FRUITS } from "./gameEngine.js";
import { getFlipGestureProgress, isUpwardFlipGesture } from "./gesture.js";
import { ANIMALS } from "./avatarFactory.js";
import { FruitBellScene } from "./scene.js";
import { FruitBellPresentationController } from "./presentationController.js";
import { createPrototypeRevealAt } from "./revealTiming.js";

const LOCAL_ID = "local-player";
const BOT_NAMES = ["모모", "두부", "콩이"];
const BOT_REACTIONS = [760, 930, 1080];

const elements = {
  lobby: document.querySelector("#game-lobby"),
  animalGrid: document.querySelector("#animal-grid"),
  start: document.querySelector("#start-button"),
  game: document.querySelector("#game-view"),
  canvas: document.querySelector("#game-canvas"),
  status: document.querySelector("#status-text"),
  turn: document.querySelector("#turn-label"),
  totals: document.querySelector("#fruit-totals"),
  playerList: document.querySelector("#player-list"),
  reset: document.querySelector("#reset-button"),
  gestureHint: document.querySelector("#gesture-hint"),
  bellHint: document.querySelector("#bell-hint"),
};

let selectedAnimalId = ANIMALS[0].id;
let game = null;
let scene = null;
let presentation = null;
let players = [];
let gesture = null;
let flipLocked = false;
let bellInputEnabled = true;
let timers = new Set();
let flowGeneration = 0;
let audioContext = null;

function renderAnimalChoices() {
  elements.animalGrid.replaceChildren();
  ANIMALS.forEach((animal) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "animal-option";
    button.dataset.selected = String(animal.id === selectedAnimalId);
    button.setAttribute("aria-pressed", String(animal.id === selectedAnimalId));
    button.innerHTML = `
      <span class="animal-option__face" data-animal="${animal.id}" aria-hidden="true"></span>
      <strong>${animal.label}</strong>
    `;
    button.addEventListener("click", () => {
      selectedAnimalId = animal.id;
      renderAnimalChoices();
    });
    elements.animalGrid.append(button);
  });
}

function buildPlayers() {
  const opponents = ANIMALS.filter((animal) => animal.id !== selectedAnimalId).slice(0, 3);
  return [
    { id: LOCAL_ID, name: "나", animalId: selectedAnimalId },
    ...BOT_NAMES.map((name, index) => ({
      id: `bot-${index + 1}`,
      name,
      animalId: opponents[index % opponents.length].id,
    })),
  ];
}

function startGame() {
  clearTimers();
  flowGeneration += 1;
  players = buildPlayers();
  game = new FruitBellGame({ players });
  const snapshot = game.start();
  if (!scene) {
    scene = new FruitBellScene(elements.canvas);
    presentation = new FruitBellPresentationController(scene);
  }
  scene.configurePlayers(players);
  scene.syncSnapshot(snapshot);
  elements.lobby.hidden = true;
  elements.game.hidden = false;
  elements.canvas.focus({ preventScroll: true });
  flipLocked = false;
  bellInputEnabled = true;
  setStatus("내 차례입니다. 카드 더미를 잡고 위로 넘겨보세요.");
  renderHud(snapshot);
  continueFlow();
}

function resetGame() {
  clearTimers();
  flowGeneration += 1;
  game = null;
  players = [];
  gesture = null;
  flipLocked = false;
  bellInputEnabled = true;
  elements.game.hidden = true;
  elements.lobby.hidden = false;
  renderAnimalChoices();
}

function renderHud(snapshot = game?.snapshot()) {
  if (!snapshot) return;
  const active = snapshot.players.find((player) => player.id === snapshot.activePlayerId);
  elements.turn.textContent = snapshot.winnerId
    ? "게임 종료"
    : active?.id === LOCAL_ID
      ? "내 차례"
      : `${active?.name || "상대"} 차례`;

  elements.totals.replaceChildren();
  FRUITS.forEach((fruit) => {
    const total = snapshot.visibleTotals[fruit.id] || 0;
    const item = document.createElement("div");
    item.className = "fruit-total";
    item.dataset.hit = String(total === 5);
    item.innerHTML = `<span>${fruit.emoji}</span><strong>${total}</strong>`;
    item.setAttribute("aria-label", `${fruit.label} 합계 ${total}`);
    elements.totals.append(item);
  });

  elements.playerList.replaceChildren();
  snapshot.players.forEach((player) => {
    const config = players.find((candidate) => candidate.id === player.id);
    const animal = ANIMALS.find((candidate) => candidate.id === config?.animalId);
    const row = document.createElement("div");
    row.className = "player-row";
    row.dataset.active = String(player.id === snapshot.activePlayerId);
    row.dataset.out = String(player.isOut);
    row.innerHTML = `
      <span class="player-row__dot" data-animal="${animal?.id || "fox"}"></span>
      <span>${player.name}${player.isOut ? " · 탈락" : ""}</span>
      <strong>${player.drawCount}장</strong>
    `;
    elements.playerList.append(row);
  });

  const localTurn = snapshot.activePlayerId === LOCAL_ID && !snapshot.winnerId;
  elements.gestureHint.dataset.active = String(localTurn && !flipLocked);
  elements.bellHint.dataset.active = String(Boolean(snapshot.bellFruit));
}

function setStatus(message) {
  elements.status.textContent = message;
}

function continueFlow() {
  if (!game) return;
  const snapshot = game.snapshot();
  renderHud(snapshot);
  if (snapshot.winnerId) {
    const winner = snapshot.players.find((player) => player.id === snapshot.winnerId);
    setStatus(`${winner?.name || "플레이어"} 승리!`);
    return;
  }

  if (snapshot.bellFruit) {
    setStatus("과일 합계 5! 왼손으로 스페이스바를 먼저 누르세요!");
    scheduleBotBellRace(snapshot);
    return;
  }

  const active = snapshot.players.find((player) => player.id === snapshot.activePlayerId);
  if (!active) return;
  if (active.id === LOCAL_ID) {
    setStatus("내 차례입니다. 카드 더미를 좌클릭한 채 위로 넘기세요.");
    return;
  }
  scheduleBotFlip(active);
}

function revealFlipResult(result, generation, playerName) {
  if (!game || generation !== flowGeneration) return;
  const fruit = FRUITS.find((candidate) => candidate.id === result.card.fruit);
  renderHud(result.state);
  bellInputEnabled = true;

  if (result.state.bellFruit) {
    setStatus("과일 합계 5! 왼손으로 스페이스바를 먼저 누르세요!");
    scheduleBotBellRace(result.state);
    return;
  }

  setStatus(`${playerName} ${fruit?.label || "과일"} ${result.card.count}개 공개!`);
}

function settleFlipResult(result, generation) {
  if (!game || generation !== flowGeneration) return;
  scene.syncSnapshot(result.state);
  flipLocked = false;
  if (!result.state.bellFruit) {
    bellInputEnabled = true;
    continueFlow();
  }
}

function handleLocalFlip() {
  if (!game || flipLocked) return;
  const snapshot = game.snapshot();
  if (snapshot.activePlayerId !== LOCAL_ID || snapshot.winnerId) {
    scene?.resetLocalFlipPreview();
    setStatus("지금은 내 차례가 아닙니다.");
    return;
  }

  clearTimers();
  flowGeneration += 1;
  const generation = flowGeneration;
  flipLocked = true;
  bellInputEnabled = false;
  try {
    const result = game.flipCard(LOCAL_ID);
    scene.syncDeckCounts(result.state);
    setStatus("카드를 뒤집는 중입니다…");
    scene.playLocalFlip(result.card, {
      revealAt: createPrototypeRevealAt(performance.now()),
      onReveal: () => revealFlipResult(result, generation, "내 카드:"),
      onSettled: () => settleFlipResult(result, generation),
    });
  } catch (error) {
    flipLocked = false;
    bellInputEnabled = true;
    scene.resetLocalFlipPreview();
    setStatus(error.message);
  }
}

function scheduleBotFlip(player) {
  const generation = flowGeneration;
  setStatus(`${player.name}이 카드를 집어 들고 있습니다…`);
  schedule(() => {
    if (!game || generation !== flowGeneration) return;
    if (game.snapshot().activePlayerId !== player.id) return;
    bellInputEnabled = false;
    try {
      const result = game.flipCard(player.id);
      scene.syncDeckCounts(result.state);
      setStatus(`${player.name}이 카드를 뒤집는 중입니다…`);
      scene.playOpponentFlip(player.id, result.card, {
        revealAt: createPrototypeRevealAt(performance.now()),
        onReveal: () => revealFlipResult(result, generation, `${player.name}:`),
        onSettled: () => settleFlipResult(result, generation),
      });
    } catch (error) {
      bellInputEnabled = true;
      setStatus(error.message);
    }
  }, 950 + Math.floor(Math.random() * 420));
}

function scheduleBotBellRace(snapshot) {
  const generation = flowGeneration;
  snapshot.players
    .filter((player) => player.id !== LOCAL_ID && !player.isOut)
    .forEach((player, index) => {
      schedule(() => {
        if (!game || generation !== flowGeneration || !game.snapshot().bellFruit) return;
        handleBell(player.id);
      }, BOT_REACTIONS[index % BOT_REACTIONS.length] + Math.floor(Math.random() * 190));
    });
}

function handleBell(playerId) {
  if (!game || !bellInputEnabled || game.snapshot().winnerId) return;
  const beforeState = game.snapshot();
  clearTimers();
  flowGeneration += 1;
  const generation = flowGeneration;
  bellInputEnabled = false;
  flipLocked = false;
  try {
    const result = game.ringBell(playerId);
    const player = players.find((candidate) => candidate.id === playerId);
    if (playerId === LOCAL_ID) scene.playLocalBell(result.correct);
    else scene.playOpponentBell(playerId, result.correct);
    playBellSound(result.correct);

    if (result.correct) {
      const fruit = FRUITS.find((candidate) => candidate.id === result.fruit);
      setStatus(`${player?.name || "플레이어"} 성공! ${fruit?.label || "과일"} 합계 5를 먼저 잡았습니다.`);
      schedule(() => {
        if (!game || generation !== flowGeneration) return;
        scene.playCollectionToWinner(beforeState, result.state, playerId, () => {
          if (!game || generation !== flowGeneration) return;
          renderHud(result.state);
          bellInputEnabled = true;
          continueFlow();
        });
      }, 210);
      return;
    }

    if (result.eliminated) {
      setStatus(`${player?.name || "플레이어"} 오답! 패널티로 카드가 없어져 탈락했습니다.`);
    } else {
      setStatus(`${player?.name || "플레이어"} 오답! 너무 일찍 종을 쳤습니다.`);
    }

    schedule(() => {
      if (!game || generation !== flowGeneration) return;
      scene.syncSnapshot(result.state);
      renderHud(result.state);
      bellInputEnabled = true;
      continueFlow();
    }, 720);
  } catch (error) {
    bellInputEnabled = true;
    setStatus(error.message);
    continueFlow();
  }
}

function ensureAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  audioContext ||= new AudioContextClass();
  if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
  return audioContext;
}

function playDeskBell(context, when) {
  const master = context.createGain();
  master.gain.setValueAtTime(0.8, when);
  master.connect(context.destination);

  const partials = [
    [930, 0.25, 0.78],
    [1378, 0.19, 0.66],
    [1886, 0.13, 0.56],
    [2525, 0.085, 0.44],
    [3260, 0.045, 0.34],
  ];

  partials.forEach(([frequency, level, decay], index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = index < 2 ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(frequency, when);
    oscillator.detune.setValueAtTime((index - 2) * 2.7, when);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(level, when + 0.003 + index * 0.001);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + decay);
    oscillator.connect(gain).connect(master);
    oscillator.start(when);
    oscillator.stop(when + decay + 0.04);
  });

  const noiseLength = Math.max(1, Math.floor(context.sampleRate * 0.026));
  const buffer = context.createBuffer(1, noiseLength, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) {
    const envelope = 1 - index / data.length;
    data[index] = (Math.random() * 2 - 1) * envelope;
  }
  const impact = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  impact.buffer = buffer;
  filter.type = "highpass";
  filter.frequency.setValueAtTime(1600, when);
  gain.gain.setValueAtTime(0.12, when);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.04);
  impact.connect(filter).connect(gain).connect(master);
  impact.start(when);
}

function playWrongCue(context, when) {
  [0, 0.13].forEach((offset, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(index === 0 ? 310 : 225, when + offset);
    oscillator.frequency.exponentialRampToValueAtTime(index === 0 ? 255 : 180, when + offset + 0.11);
    gain.gain.setValueAtTime(0.0001, when + offset);
    gain.gain.exponentialRampToValueAtTime(0.075, when + offset + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + offset + 0.12);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(when + offset);
    oscillator.stop(when + offset + 0.13);
  });
}

function playBellSound(correct) {
  try {
    const context = ensureAudioContext();
    if (!context) return;
    const when = context.currentTime + 0.005;
    playDeskBell(context, when);
    if (!correct) playWrongCue(context, when + 0.12);
  } catch {
    // Audio is presentation-only; gameplay must continue if the browser blocks it.
  }
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

function canvasPoint(event) {
  const rect = elements.canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
    y: ((event.clientY - rect.top) / rect.height) * 2 - 1,
  };
}

function onPointerDown(event) {
  if (!game || event.button !== 0 || flipLocked || elements.game.hidden) return;
  if (game.snapshot().activePlayerId !== LOCAL_ID) return;
  if (!scene.isPointerOverLocalDeck(event.clientX, event.clientY)) return;
  event.preventDefault();
  gesture = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    startTime: performance.now(),
  };
  elements.canvas.setPointerCapture(event.pointerId);
  elements.canvas.dataset.dragging = "true";
  setStatus("카드를 잡았습니다. 클릭을 유지한 채 위로 넘기세요.");
}

function onPointerMove(event) {
  if (!scene) return;
  if (gesture && gesture.pointerId === event.pointerId) {
    event.preventDefault();
    scene.previewLocalFlip(getFlipGestureProgress(gesture.startY, event.clientY));
    return;
  }
  const point = canvasPoint(event);
  scene.setLookOffset(point.x, point.y);
}

function finishGesture(event) {
  if (!gesture || gesture.pointerId !== event.pointerId) return;
  const completed = isUpwardFlipGesture({
    startX: gesture.startX,
    startY: gesture.startY,
    endX: event.clientX,
    endY: event.clientY,
    durationMs: performance.now() - gesture.startTime,
  });
  if (elements.canvas.hasPointerCapture(event.pointerId)) elements.canvas.releasePointerCapture(event.pointerId);
  gesture = null;
  elements.canvas.dataset.dragging = "false";
  if (completed) handleLocalFlip();
  else {
    scene.resetLocalFlipPreview();
    setStatus("조금 더 위쪽으로 카드를 넘겨주세요.");
  }
}

function onKeyDown(event) {
  if (event.code !== "Space" || event.repeat || elements.game.hidden) return;
  const target = event.target;
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return;
  event.preventDefault();
  handleBell(LOCAL_ID);
}

elements.start.addEventListener("click", startGame);
elements.reset.addEventListener("click", resetGame);
elements.canvas.addEventListener("pointerdown", onPointerDown);
elements.canvas.addEventListener("pointermove", onPointerMove);
elements.canvas.addEventListener("pointerup", finishGesture);
elements.canvas.addEventListener("pointercancel", finishGesture);
elements.canvas.addEventListener("pointerleave", (event) => {
  if (!gesture) scene?.setLookOffset(0, 0);
  if (gesture && !elements.canvas.hasPointerCapture(event.pointerId)) finishGesture(event);
});
document.addEventListener("keydown", onKeyDown);

renderAnimalChoices();
