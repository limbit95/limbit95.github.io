import { GAME_STATUS } from "./core/gameEngine.js";
import { TURN_PHASES } from "./core/turnMachine.js";
import { createOnlineClassicSession, isOnlineViewerTurn } from "./onlineSession.js?v=20260910-r8";
import { markOnlineVisualRuntime } from "./onlineVisualPolicy.js?v=20260910-r10";
import { CLASSIC_RULES } from "./themes/classic/rules.js";
import { formatThemeMoney } from "./themes/money.js";

let startController = null;

export async function startOnlineGameController(options = {}) {
  if (!startController) throw new Error("ONLINE_2D_CONTROLLER_UNAVAILABLE");
  return startController(options);
}

const playtestSection = document.querySelector("[data-playtest-section]");
const boardElement = document.querySelector("[data-classic-board]");
const boardCenter = boardElement?.querySelector(".board-center");
const fallbackElement = document.querySelector(".two-d-fallback");
const playerList = document.querySelector("[data-player-list]");
const turnLabel = document.querySelector("[data-turn-label]");
const gameMessage = document.querySelector("[data-game-message]");
const primaryActionButton = document.querySelector("[data-primary-action]");
const secondaryActionButton = document.querySelector("[data-secondary-action]");
const eventLog = document.querySelector("[data-event-log]");

let session = null;
let interactionLocked = false;
let choiceDeclinedPending = false;
let eventHistory = [];

function money(value, options = {}) {
  return formatThemeMoney(value, CLASSIC_RULES.currency, options);
}

function playerName(player) {
  return player?.name || player?.id || "플레이어";
}

function currentPlayer(state) {
  return state.currentPlayerIndex === null ? null : state.players[state.currentPlayerIndex];
}

function viewerCanAct(state) {
  return Boolean(session && isOnlineViewerTurn(state, session.getViewerPlayerId()));
}

function boardGridMetrics(count) {
  const sideLength = Math.ceil(count / 4);
  return { sideLength, gridSize: sideLength + 1 };
}

function boardGridPosition(index, count) {
  const { sideLength, gridSize } = boardGridMetrics(count);
  if (index < sideLength) return { row: gridSize, column: index + 1 };
  if (index < sideLength * 2) return { row: gridSize - (index - sideLength), column: gridSize };
  if (index < sideLength * 3) return { row: 1, column: gridSize - (index - sideLength * 2) };
  return { row: 1 + (index - sideLength * 3), column: 1 };
}

function findNode(state, nodeId) {
  return state.board.nodes.find((node) => node.id === nodeId) ?? null;
}

function renderStateBoard(state) {
  if (!boardElement || !boardCenter) return;
  boardElement.querySelectorAll(".board-tile").forEach((tile) => tile.remove());
  const { gridSize } = boardGridMetrics(state.board.nodes.length);
  boardElement.style.setProperty("--board-grid-size", String(gridSize));
  boardCenter.style.gridRow = `2 / ${gridSize}`;
  boardCenter.style.gridColumn = `2 / ${gridSize}`;

  state.board.nodes.forEach((node, index) => {
    const position = boardGridPosition(index, state.board.nodes.length);
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
    if (node.type === "PROPERTY") {
      const owner = propertyState?.ownerId
        ? state.players.find((player) => player.id === propertyState.ownerId)
        : null;
      meta.textContent = owner
        ? `${playerName(owner)} · 건물 ${propertyState.buildingLevel}`
        : money(node.price);
    } else if (node.type === "BONUS") meta.textContent = money(node.amount, { signed: true });
    else if (node.type === "TAX") meta.textContent = money(-node.amount, { signed: true });
    else if (node.type === "REST") meta.textContent = `${node.skipTurns}턴 휴식`;
    else if (node.type === "EVENT") meta.textContent = "이벤트";
    else if (node.type === "START") meta.textContent = "출발";

    const tokens = document.createElement("div");
    tokens.className = "board-tile__tokens";
    state.players
      .filter((player) => !player.bankrupt && player.positionNodeId === node.id)
      .forEach((player) => {
        const token = document.createElement("span");
        token.className = "player-token";
        token.dataset.seat = String(player.seat);
        token.textContent = `P${player.seat + 1}`;
        token.title = playerName(player);
        tokens.append(token);
      });

    tile.append(title, meta, tokens);
    boardElement.append(tile);
  });
}

function renderPlayers(state) {
  if (!playerList) return;
  const viewerPlayerId = session?.getViewerPlayerId();
  playerList.replaceChildren(...state.players.slice(0, 4).map((player, index) => {
    const card = document.createElement("article");
    card.className = "player-card player-hud-card";
    card.dataset.seat = String(player.seat);
    card.dataset.hudSlot = player.id === viewerPlayerId ? "bottom-right" : index === 0 ? "top-left" : "top-right";
    if (state.currentPlayerIndex === index && state.status === GAME_STATUS.PLAYING) card.dataset.current = "true";
    if (player.id === viewerPlayerId) card.dataset.viewer = "true";
    if (player.bankrupt) card.dataset.bankrupt = "true";
    const properties = Object.values(state.boardState.properties)
      .filter((property) => property.ownerId === player.id).length;
    const stateLabel = player.bankrupt
      ? "파산"
      : state.currentPlayerIndex === index && state.status === GAME_STATUS.PLAYING
        ? "현재 차례"
        : "대기";
    card.innerHTML = `
      <div class="player-card__title">
        <span class="player-token" data-seat="${player.seat}">P${player.seat + 1}</span>
        <div><strong>${playerName(player)}${player.id === viewerPlayerId ? " · 나" : ""}</strong><span class="player-card__state">${stateLabel}</span></div>
      </div>
      <dl>
        <div><dt>보유 골드</dt><dd>${money(player.money)}</dd></div>
        <div><dt>소유 도시</dt><dd>${properties}곳</dd></div>
      </dl>
    `;
    return card;
  }));
}

function renderActionControls(state) {
  if (!primaryActionButton || !turnLabel || !gameMessage) return;
  const current = currentPlayer(state);
  primaryActionButton.hidden = false;
  primaryActionButton.disabled = interactionLocked;
  primaryActionButton.dataset.action = "";
  if (secondaryActionButton) {
    secondaryActionButton.hidden = true;
    secondaryActionButton.disabled = interactionLocked;
    secondaryActionButton.dataset.action = "";
  }

  if (state.status === GAME_STATUS.FINISHED) {
    const winner = state.players.find((player) => player.id === state.winnerPlayerId);
    turnLabel.textContent = winner ? `${playerName(winner)} 승리` : "게임 종료";
    gameMessage.textContent = winner ? `${playerName(winner)}이(가) 마지막까지 생존했습니다.` : "게임이 종료되었습니다.";
    primaryActionButton.hidden = true;
    return;
  }

  turnLabel.textContent = current ? `${playerName(current)} · ${state.turn}턴` : "-";
  if (!viewerCanAct(state)) {
    primaryActionButton.hidden = true;
    gameMessage.textContent = `${playerName(current)}의 차례를 기다리고 있습니다.`;
    return;
  }

  if (state.phase === TURN_PHASES.WAITING_ROLL) {
    gameMessage.textContent = interactionLocked ? "서버 결과를 처리하고 있습니다." : "2D 진단 모드 · 내 차례입니다.";
    primaryActionButton.textContent = "주사위 굴리기";
    primaryActionButton.dataset.action = "roll";
    return;
  }

  if (state.phase === TURN_PHASES.WAITING_CHOICE && choiceDeclinedPending) {
    gameMessage.textContent = "선택을 건너뛰었습니다. 다음 턴으로 넘겨 주세요.";
    primaryActionButton.textContent = "다음 턴";
    primaryActionButton.dataset.action = "endTurn";
    return;
  }

  if (state.phase === TURN_PHASES.WAITING_CHOICE) {
    const pendingChoice = state.pendingChoice;
    const actor = currentPlayer(state);
    if (pendingChoice?.type === "BUY_PROPERTY") {
      const canAfford = Boolean(actor && actor.money >= pendingChoice.price);
      primaryActionButton.textContent = canAfford ? `구매하기 · ${money(pendingChoice.price)}` : "골드 부족";
      primaryActionButton.dataset.action = "buy";
      primaryActionButton.disabled = interactionLocked || !canAfford;
    } else if (pendingChoice?.type === "BUILD_PROPERTY") {
      const canAfford = Boolean(actor && actor.money >= pendingChoice.cost);
      primaryActionButton.textContent = canAfford ? `건설하기 · ${money(pendingChoice.cost)}` : "골드 부족";
      primaryActionButton.dataset.action = "build";
      primaryActionButton.disabled = interactionLocked || !canAfford;
    } else {
      primaryActionButton.hidden = true;
    }
    if (secondaryActionButton) {
      secondaryActionButton.hidden = false;
      secondaryActionButton.textContent = "건너뛰기";
      secondaryActionButton.dataset.action = "decline";
    }
    gameMessage.textContent = "도시 행동을 선택해 주세요.";
    return;
  }

  if (state.phase === TURN_PHASES.TURN_END) {
    gameMessage.textContent = interactionLocked ? "서버 결과를 처리하고 있습니다." : "이번 턴 처리가 끝났습니다.";
    primaryActionButton.textContent = "다음 턴";
    primaryActionButton.dataset.action = "endTurn";
    return;
  }

  primaryActionButton.hidden = true;
  gameMessage.textContent = "게임 상태를 처리하고 있습니다.";
}

function eventText(state, event) {
  const player = state.players.find((candidate) => candidate.id === event.playerId);
  const label = player ? playerName(player) : "게임";
  const node = event.nodeId ? findNode(state, event.nodeId) : null;
  switch (event.type) {
    case "GAME_STARTED": return "온라인 게임 시작";
    case "DICE_ROLLED": return `${label} · ${event.dice.join(" + ")} = ${event.total}`;
    case "PLAYER_MOVED": return `${label} · ${findNode(state, event.toNodeId)?.label ?? event.toNodeId} 이동`;
    case "PROPERTY_BOUGHT": return `${label} · ${node?.label ?? event.nodeId} 구매`;
    case "PROPERTY_BUILT": return `${label} · ${node?.label ?? event.nodeId} 건물 ${event.buildingLevel}단계`;
    case "PLAYER_BANKRUPT": return `${label} · 파산`;
    case "GAME_FINISHED": return "게임 종료";
    default: return event.type;
  }
}

function appendEvents(state) {
  state.lastEvents.forEach((event) => eventHistory.push(eventText(state, event)));
  eventHistory = eventHistory.slice(-10);
  if (!eventLog) return;
  eventLog.replaceChildren(...[...eventHistory].reverse().map((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    return item;
  }));
}

function renderUi(state, { appendHistory = false } = {}) {
  if (appendHistory) appendEvents(state);
  renderStateBoard(state);
  renderPlayers(state);
  renderActionControls(state);
}

function connectionStatus(status) {
  document.body.dataset.onlineConnection = String(status || "").toLowerCase();
  if (!gameMessage) return;
  if (status === "OFFLINE") gameMessage.textContent = "연결이 끊겼습니다. 재연결을 기다리는 중입니다.";
  else if (["RECONNECTING", "CHANNEL_ERROR", "TIMED_OUT"].includes(status)) gameMessage.textContent = "온라인 게임을 다시 연결하는 중입니다.";
}

async function runAction(actionName) {
  if (!session || interactionLocked || !viewerCanAct(session.getState())) return;
  if (actionName === "decline") {
    choiceDeclinedPending = true;
    renderActionControls(session.getState());
    return;
  }

  interactionLocked = true;
  renderActionControls(session.getState());
  try {
    let state;
    if (actionName === "roll") state = await session.roll();
    else if (actionName === "buy") state = await session.buy();
    else if (actionName === "build") state = await session.build();
    else if (actionName === "endTurn") state = await session.endTurn();
    else return;
    if (actionName === "endTurn") choiceDeclinedPending = false;
    renderUi(state, { appendHistory: true });
  } catch (error) {
    const message = String(error?.message ?? error ?? "");
    if (message.includes("VERSION_CONFLICT") || message.includes("NOT_YOUR_TURN")) {
      choiceDeclinedPending = false;
      await session.refresh({ notify: false });
      renderUi(session.getState());
      gameMessage.textContent = "최신 게임 상태를 다시 반영했습니다.";
    } else if (message.includes("INSUFFICIENT_GOLD")) {
      gameMessage.textContent = "보유 골드가 부족합니다. 건너뛰기를 선택해 주세요.";
    } else {
      console.error("Marble online 2D action failed", error);
      gameMessage.textContent = "온라인 게임 액션 처리 중 오류가 발생했습니다.";
    }
  } finally {
    interactionLocked = false;
    if (session) renderActionControls(session.getState());
  }
}

primaryActionButton?.addEventListener("click", (event) => {
  const action = event.currentTarget.dataset.action;
  if (action) void runAction(action);
});
secondaryActionButton?.addEventListener("click", (event) => {
  const action = event.currentTarget.dataset.action;
  if (action) void runAction(action);
});

async function init({
  roomId,
  initialSnapshot,
  createSession = createOnlineClassicSession,
} = {}) {
  if (!roomId || !initialSnapshot) throw new Error("ONLINE_2D_BOOT_INPUT_INVALID");
  if (!playtestSection || !boardElement || !gameMessage || !primaryActionButton) {
    throw new Error("ONLINE_2D_REQUIRED_DOM_MISSING");
  }

  document.body.dataset.sessionMode = "online";
  document.body.dataset.onlineRenderer = "disabled";
  document.body.dataset.onlineDiceRenderer = "disabled";
  document.body.dataset.onlineOwnershipRenderer = "disabled";
  document.body.dataset.onlineOptionalEnhancements = "disabled";
  markOnlineVisualRuntime();
  playtestSection.hidden = false;
  if (fallbackElement) {
    fallbackElement.open = true;
    fallbackElement.hidden = false;
  }

  gameMessage.textContent = "2D 진단 모드로 온라인 게임 상태를 불러오는 중입니다.";
  interactionLocked = true;
  session = await createSession({
    roomId,
    initialSnapshot,
    onRemoteState: async (state) => {
      if (state.phase !== TURN_PHASES.WAITING_CHOICE || !viewerCanAct(state)) choiceDeclinedPending = false;
      renderUi(state, { appendHistory: true });
    },
    onConnectionStatus: connectionStatus,
  });

  eventHistory = [];
  choiceDeclinedPending = false;
  const state = session.getState();
  renderUi(state, { appendHistory: true });
  document.body.dataset.onlineBootStage = "ui-ready";
  interactionLocked = false;
  renderActionControls(state);
  fallbackElement?.scrollIntoView?.({ block: "start" });
}

window.addEventListener("beforeunload", () => session?.dispose?.());
startController = init;
