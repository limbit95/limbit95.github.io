import { GAME_STATUS } from "./core/gameEngine.js";
import { TURN_PHASES } from "./core/turnMachine.js";
import { createLocalClassicSession } from "./localPlaytest.js";
import { listThemes, requireTheme } from "./themes/themeRegistry.js";

const themeGrid = document.querySelector("[data-theme-grid]");
const themeTitle = document.querySelector("[data-theme-title]");
const themeName = document.querySelector("[data-theme-name]");
const themeDescription = document.querySelector("[data-theme-description]");
const themeFeatures = document.querySelector("[data-theme-features]");
const themeStatus = document.querySelector("[data-theme-status]");
const foundationNote = document.querySelector("[data-foundation-note]");
const startPlaytestButton = document.querySelector("[data-start-playtest]");
const playtestEntryNote = document.querySelector("[data-playtest-entry-note]");
const playtestSection = document.querySelector("[data-playtest-section]");
const resetPlaytestButton = document.querySelector("[data-reset-playtest]");
const boardElement = document.querySelector("[data-classic-board]");
const playerList = document.querySelector("[data-player-list]");
const turnLabel = document.querySelector("[data-turn-label]");
const diceSummary = document.querySelector("[data-dice-summary]");
const gameMessage = document.querySelector("[data-game-message]");
const primaryActionButton = document.querySelector("[data-primary-action]");
const secondaryActionButton = document.querySelector("[data-secondary-action]");
const eventLog = document.querySelector("[data-event-log]");

let selectedThemeId = "classic";
let localSession = null;
let eventHistory = [];

function statusLabel(theme) {
  if (theme.status === "core") return "CORE READY";
  if (theme.status === "foundation") return "FOUNDATION";
  return "PLANNED";
}

function renderThemeCards() {
  themeGrid.replaceChildren();

  listThemes().forEach((theme) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-card";
    button.dataset.themeId = theme.id;
    button.setAttribute("aria-pressed", String(theme.id === selectedThemeId));
    button.innerHTML = `
      <span class="theme-card__icon" aria-hidden="true">${theme.icon}</span>
      <span class="theme-card__copy">
        <span class="theme-card__eyebrow">${theme.name.toUpperCase()}</span>
        <strong>${theme.title}</strong>
        <span>${theme.description}</span>
      </span>
      <span class="theme-card__status">${statusLabel(theme)}</span>
    `;
    themeGrid.append(button);
  });
}

function renderSelectedTheme() {
  const theme = requireTheme(selectedThemeId);
  document.body.dataset.theme = theme.id;
  themeName.textContent = theme.name.toUpperCase();
  themeTitle.textContent = theme.title;
  themeDescription.textContent = theme.description;
  themeStatus.textContent = statusLabel(theme);
  themeFeatures.replaceChildren(...theme.highlights.map((feature) => {
    const item = document.createElement("li");
    item.textContent = feature;
    return item;
  }));

  if (theme.id === "classic" && theme.playable) {
    foundationNote.textContent = "Classic 핵심 규칙이 연결되어 있습니다. 아래 버튼으로 2인 로컬 수동 테스트를 시작할 수 있습니다.";
    startPlaytestButton.disabled = false;
    startPlaytestButton.textContent = "Classic 테스트 플레이 시작";
    playtestEntryNote.textContent = "브라우저 한 화면에서 2인 로컬 규칙 테스트를 진행합니다. 온라인 동기화는 아직 적용되지 않습니다.";
  } else {
    foundationNote.textContent = "테마 구조는 등록되어 있으며 공통 엔진과 3D 기반을 검증한 뒤 차례대로 구현합니다.";
    startPlaytestButton.disabled = true;
    startPlaytestButton.textContent = `${theme.name} 준비 중`;
    playtestEntryNote.textContent = "현재 수동 플레이테스트는 Classic 테마만 사용할 수 있습니다.";
  }

  themeGrid.querySelectorAll("[data-theme-id]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.themeId === selectedThemeId));
  });
}

function boardGridPosition(index) {
  if (index <= 5) return { row: 6, column: index + 1 };
  if (index <= 10) return { row: 11 - index, column: 6 };
  if (index <= 15) return { row: 1, column: 16 - index };
  return { row: index - 14, column: 1 };
}

function findNode(state, nodeId) {
  return state.board.nodes.find((node) => node.id === nodeId) ?? null;
}

function playerName(player) {
  return player.name || player.id;
}

function propertyMeta(state, node) {
  if (node.type !== "PROPERTY") return "";
  const propertyState = state.boardState.properties[node.id];
  if (!propertyState.ownerId) return `M ${node.price}`;
  const owner = state.players.find((player) => player.id === propertyState.ownerId);
  return `${playerName(owner)} · 건물 ${propertyState.buildingLevel}`;
}

function tileMeta(node) {
  if (node.type === "BONUS") return `+ M ${node.amount}`;
  if (node.type === "TAX") return `- M ${node.amount}`;
  if (node.type === "REST") return `${node.skipTurns}턴 휴식`;
  if (node.type === "EVENT") return "이벤트";
  if (node.type === "START") return "출발";
  return "";
}

function renderBoard(state) {
  boardElement.querySelectorAll(".board-tile").forEach((tile) => tile.remove());

  state.board.nodes.forEach((node, index) => {
    const position = boardGridPosition(index);
    const tile = document.createElement("div");
    tile.className = "board-tile";
    tile.dataset.tileType = node.type;
    tile.style.gridRow = String(position.row);
    tile.style.gridColumn = String(position.column);

    const propertyState = state.boardState.properties[node.id];
    if (propertyState?.ownerId) {
      const owner = state.players.find((player) => player.id === propertyState.ownerId);
      tile.dataset.ownerSeat = String(owner?.seat ?? "");
    }

    const title = document.createElement("strong");
    title.className = "board-tile__title";
    title.textContent = node.label;

    const meta = document.createElement("span");
    meta.className = "board-tile__meta";
    meta.textContent = node.type === "PROPERTY" ? propertyMeta(state, node) : tileMeta(node);

    const tokens = document.createElement("div");
    tokens.className = "board-tile__tokens";
    state.players.filter((player) => !player.bankrupt && player.positionNodeId === node.id).forEach((player) => {
      const token = document.createElement("span");
      token.className = "player-token";
      token.dataset.seat = String(player.seat);
      token.textContent = player.seat === 0 ? "A" : "B";
      token.title = playerName(player);
      tokens.append(token);
    });

    tile.append(title, meta, tokens);
    boardElement.append(tile);
  });
}

function renderPlayers(state) {
  playerList.replaceChildren(...state.players.map((player, index) => {
    const card = document.createElement("article");
    card.className = "player-card";
    card.dataset.seat = String(player.seat);
    if (state.currentPlayerIndex === index && state.status === GAME_STATUS.PLAYING) card.dataset.current = "true";
    if (player.bankrupt) card.dataset.bankrupt = "true";

    const properties = Object.values(state.boardState.properties).filter((propertyState) => propertyState.ownerId === player.id).length;
    const location = findNode(state, player.positionNodeId)?.label ?? "-";
    card.innerHTML = `
      <div class="player-card__title">
        <span class="player-token" data-seat="${player.seat}">${player.seat === 0 ? "A" : "B"}</span>
        <strong>${playerName(player)}</strong>
      </div>
      <dl>
        <div><dt>자금</dt><dd>M ${player.money}</dd></div>
        <div><dt>현재 위치</dt><dd>${location}</dd></div>
        <div><dt>소유 도시</dt><dd>${properties}</dd></div>
      </dl>
      ${player.bankrupt ? '<span class="bankrupt-label">파산</span>' : ""}
    `;
    return card;
  }));
}

function eventText(state, event) {
  const player = state.players.find((candidate) => candidate.id === event.playerId);
  const playerLabel = player ? playerName(player) : "게임";
  const node = event.nodeId ? findNode(state, event.nodeId) : null;

  switch (event.type) {
    case "GAME_STARTED": return "게임을 시작했습니다.";
    case "DICE_ROLLED": return `${playerLabel} · 주사위 ${event.dice.join(" + ")} = ${event.total}`;
    case "START_PASSED": return `${playerLabel} · 출발 통과 보너스 M ${event.amount}`;
    case "PLAYER_MOVED": return `${playerLabel} · ${findNode(state, event.fromNodeId)?.label ?? event.fromNodeId} → ${findNode(state, event.toNodeId)?.label ?? event.toNodeId}`;
    case "PROPERTY_BOUGHT": return `${playerLabel} · ${node?.label ?? event.nodeId} 구매 M ${event.amount}`;
    case "PROPERTY_BUILT": return `${playerLabel} · ${node?.label ?? event.nodeId} 건물 ${event.buildingLevel}단계`;
    case "MONEY_PAID": return `${playerLabel} · ${event.reason === "TOLL" ? "통행료" : "지출"} M ${event.amount}`;
    case "MONEY_RECEIVED": return `${playerLabel} · 보너스 M ${event.amount}`;
    case "EVENT_DRAWN": return `${playerLabel} · ${event.label}`;
    case "REST_ASSIGNED": return `${playerLabel} · 다음 ${event.skipTurns}턴 휴식`;
    case "TURN_SKIPPED": return `${playerLabel} · 휴식으로 턴 건너뜀`;
    case "CHOICE_DECLINED": return `${playerLabel} · 선택을 건너뜀`;
    case "PLAYER_BANKRUPT": return `${playerLabel} · 파산`;
    case "GAME_FINISHED": {
      const winner = state.players.find((candidate) => candidate.id === event.winnerPlayerId);
      return `${winner ? playerName(winner) : "승자 없음"} · 게임 승리`;
    }
    case "TILE_LANDED": return `${playerLabel} · ${node?.label ?? event.nodeId} 도착`;
    default: return event.type;
  }
}

function appendEvents(state) {
  state.lastEvents.forEach((event) => {
    eventHistory.push(eventText(state, event));
  });
  eventHistory = eventHistory.slice(-18);
}

function renderEventLog() {
  const visible = [...eventHistory].reverse();
  eventLog.replaceChildren(...visible.map((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    return item;
  }));
}

function currentPlayer(state) {
  return state.currentPlayerIndex === null ? null : state.players[state.currentPlayerIndex];
}

function renderActionControls(state) {
  const current = currentPlayer(state);
  primaryActionButton.hidden = false;
  secondaryActionButton.hidden = true;
  primaryActionButton.disabled = false;
  primaryActionButton.dataset.action = "";
  secondaryActionButton.dataset.action = "";

  if (state.status === GAME_STATUS.FINISHED) {
    const winner = state.players.find((player) => player.id === state.winnerPlayerId);
    turnLabel.textContent = winner ? `${playerName(winner)} 승리` : "게임 종료";
    gameMessage.textContent = winner ? `${playerName(winner)}이(가) 마지막까지 생존했습니다.` : "게임이 종료되었습니다.";
    primaryActionButton.textContent = "게임 종료";
    primaryActionButton.disabled = true;
    return;
  }

  turnLabel.textContent = current ? `${playerName(current)} · ${state.turn}턴` : "-";
  diceSummary.textContent = state.lastRoll
    ? `🎲 ${state.lastRoll.dice[0]} + ${state.lastRoll.dice[1]} = ${state.lastRoll.total}`
    : "주사위를 굴려주세요";

  if (state.phase === TURN_PHASES.WAITING_ROLL) {
    gameMessage.textContent = `${playerName(current)}의 차례입니다.`;
    primaryActionButton.textContent = "주사위 굴리기";
    primaryActionButton.dataset.action = "roll";
    return;
  }

  if (state.phase === TURN_PHASES.WAITING_CHOICE) {
    const node = findNode(state, state.pendingChoice?.nodeId);
    if (state.pendingChoice?.type === "BUY_PROPERTY") {
      gameMessage.textContent = `${node?.label ?? "도시"}을(를) M ${state.pendingChoice.price}에 구매할까요?`;
      primaryActionButton.textContent = `구매하기 · M ${state.pendingChoice.price}`;
      primaryActionButton.dataset.action = "buy";
    } else if (state.pendingChoice?.type === "BUILD_PROPERTY") {
      gameMessage.textContent = `${node?.label ?? "도시"}에 건물을 M ${state.pendingChoice.cost}로 올릴까요?`;
      primaryActionButton.textContent = `건설하기 · M ${state.pendingChoice.cost}`;
      primaryActionButton.dataset.action = "build";
    }
    secondaryActionButton.hidden = false;
    secondaryActionButton.textContent = "건너뛰기";
    secondaryActionButton.dataset.action = "endTurn";
    return;
  }

  if (state.phase === TURN_PHASES.TURN_END) {
    gameMessage.textContent = "이번 턴 처리가 끝났습니다.";
    primaryActionButton.textContent = "다음 턴";
    primaryActionButton.dataset.action = "endTurn";
    return;
  }

  primaryActionButton.textContent = state.phase;
  primaryActionButton.disabled = true;
  gameMessage.textContent = "게임 상태를 처리하고 있습니다.";
}

function renderPlaytest() {
  if (!localSession) return;
  const state = localSession.getState();
  renderBoard(state);
  renderPlayers(state);
  renderActionControls(state);
  renderEventLog();
}

function runSessionAction(actionName) {
  if (!localSession) return;
  try {
    if (actionName === "roll") localSession.roll();
    else if (actionName === "buy") localSession.buy();
    else if (actionName === "build") localSession.build();
    else if (actionName === "endTurn") localSession.endTurn();
    appendEvents(localSession.getState());
    renderPlaytest();
  } catch (error) {
    gameMessage.textContent = error instanceof Error ? error.message : "게임 액션 처리 중 오류가 발생했습니다.";
  }
}

function startLocalPlaytest() {
  localSession = createLocalClassicSession();
  eventHistory = [];
  localSession.start();
  appendEvents(localSession.getState());
  playtestSection.hidden = false;
  renderPlaytest();
  playtestSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

themeGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-theme-id]");
  if (!button) return;
  selectedThemeId = button.dataset.themeId;
  renderSelectedTheme();
});

startPlaytestButton.addEventListener("click", startLocalPlaytest);
resetPlaytestButton.addEventListener("click", startLocalPlaytest);
primaryActionButton.addEventListener("click", () => runSessionAction(primaryActionButton.dataset.action));
secondaryActionButton.addEventListener("click", () => runSessionAction(secondaryActionButton.dataset.action));

renderThemeCards();
renderSelectedTheme();
