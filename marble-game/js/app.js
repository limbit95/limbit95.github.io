import { GAME_STATUS } from "./core/gameEngine.js";
import { TURN_PHASES } from "./core/turnMachine.js";
import { createThreeDiceStage } from "./diceStage.js";
import { createLocalClassicSession } from "./localPlaytest.js";
import { createClassicThreePrototypeRenderer } from "./renderer/threeClassicPrototype.js";
import { createClassicTileInfo } from "./tileInfo.js";
import { CLASSIC_RULES } from "./themes/classic/rules.js";
import { formatThemeMoney } from "./themes/money.js";
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
const boardCenter = boardElement.querySelector(".board-center");
const threeStageElement = document.querySelector("[data-three-stage]");
const threeStatus = document.querySelector("[data-three-status]");
const diceStageElement = document.querySelector("[data-dice-stage]");
const playerList = document.querySelector("[data-player-list]");
const turnLabel = document.querySelector("[data-turn-label]");
const diceSummary = document.querySelector("[data-dice-summary]");
const gameMessage = document.querySelector("[data-game-message]");
const primaryActionButton = document.querySelector("[data-primary-action]");
const secondaryActionButton = document.querySelector("[data-secondary-action]");
const eventLog = document.querySelector("[data-event-log]");
const importantNotice = document.querySelector("[data-important-notice]");
const tileInfoModal = document.querySelector("[data-tile-info-modal]");
const tileInfoType = document.querySelector("[data-tile-info-type]");
const tileInfoTitle = document.querySelector("[data-tile-info-title]");
const tileInfoSummary = document.querySelector("[data-tile-info-summary]");
const tileInfoStats = document.querySelector("[data-tile-info-stats]");
const tileInfoEffect = document.querySelector("[data-tile-info-effect]");
const tileInfoCloseButton = document.querySelector("[data-tile-info-close]");
const tileInfoConfirmButton = document.querySelector("[data-tile-info-confirm]");
const tileInfoDeclineButton = document.querySelector("[data-tile-info-decline]");
const tileInfoActionButton = document.querySelector("[data-tile-info-action]");

let selectedThemeId = "classic";
let localSession = null;
let eventHistory = [];
let threeRenderer = null;
let threeRendererReady = false;
let threeRendererInit = null;
let diceStage = null;
let diceStageReady = false;
let diceStageInit = null;
let interactionLocked = false;
let tileInfoChoiceAction = null;
let importantNoticeTimer = null;

function money(value, options = {}) {
  return formatThemeMoney(value, CLASSIC_RULES.currency, options);
}

function statusLabel(theme) {
  if (theme.status === "core") return "3D PROTOTYPE";
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
    foundationNote.textContent = "Classic은 2~4인 HUD와 중앙 3D 주사위, 상황별 모달을 보드 화면 안에 통합하는 단계입니다.";
    startPlaytestButton.disabled = false;
    startPlaytestButton.textContent = "Classic 2.5D 테스트 플레이 시작";
    playtestEntryNote.textContent = "보드를 화면 중심에 크게 배치하고 플레이어 정보와 게임 액션을 보드 위 HUD로 확인합니다.";
  } else {
    foundationNote.textContent = "테마 구조는 등록되어 있으며 Classic 2.5D 기반을 검증한 뒤 차례대로 구현합니다.";
    startPlaytestButton.disabled = true;
    startPlaytestButton.textContent = `${theme.name} 준비 중`;
    playtestEntryNote.textContent = "현재 플레이테스트는 Classic 테마만 사용할 수 있습니다.";
  }

  themeGrid.querySelectorAll("[data-theme-id]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.themeId === selectedThemeId));
  });
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

function playerName(player) {
  return player.name || player.id;
}

function playerMarker(player) {
  return `P${(Number(player.seat) || 0) + 1}`;
}

function propertyMeta(state, node) {
  if (node.type !== "PROPERTY") return "";
  const propertyState = state.boardState.properties[node.id];
  if (!propertyState.ownerId) return money(node.price);
  const owner = state.players.find((player) => player.id === propertyState.ownerId);
  return `${playerName(owner)} · 건물 ${propertyState.buildingLevel}`;
}

function tileMeta(node) {
  if (node.type === "BONUS") return money(node.amount, { signed: true });
  if (node.type === "TAX") return money(-node.amount, { signed: true });
  if (node.type === "REST") return `${node.skipTurns}턴 휴식`;
  if (node.type === "EVENT") return "이벤트";
  if (node.type === "START") return "출발";
  return "";
}

function resetTileInfoActions() {
  tileInfoChoiceAction = null;
  tileInfoModal.dataset.mode = "inspect";
  tileInfoConfirmButton.hidden = false;
  tileInfoDeclineButton.hidden = true;
  tileInfoActionButton.hidden = true;
  tileInfoActionButton.dataset.action = "";
}

function closeTileInfo({ force = false } = {}) {
  if (!tileInfoModal) return;
  if (!force && tileInfoModal.dataset.mode === "choice") return;
  if (typeof tileInfoModal.close === "function" && tileInfoModal.open) tileInfoModal.close();
  else tileInfoModal.removeAttribute("open");
  resetTileInfoActions();
}

function configureTileInfoChoice(state, nodeId, source) {
  resetTileInfoActions();
  if (source !== "landing") return;
  if (state.phase !== TURN_PHASES.WAITING_CHOICE) return;
  if (state.pendingChoice?.nodeId !== nodeId) return;

  const pendingChoice = state.pendingChoice;
  tileInfoModal.dataset.mode = "choice";
  tileInfoConfirmButton.hidden = true;
  tileInfoDeclineButton.hidden = false;
  tileInfoActionButton.hidden = false;

  if (pendingChoice.type === "BUY_PROPERTY") {
    tileInfoChoiceAction = "buy";
    tileInfoActionButton.dataset.action = "buy";
    tileInfoActionButton.textContent = `구매하기 · ${money(pendingChoice.price)}`;
  } else if (pendingChoice.type === "BUILD_PROPERTY") {
    tileInfoChoiceAction = "build";
    tileInfoActionButton.dataset.action = "build";
    tileInfoActionButton.textContent = `건설하기 · ${money(pendingChoice.cost)}`;
  } else {
    resetTileInfoActions();
  }
}

function openTileInfo(state, nodeId, { source = "inspect" } = {}) {
  if (!tileInfoModal) return;
  const info = createClassicTileInfo(state, nodeId);
  if (!info) return;

  tileInfoType.textContent = info.typeLabel;
  tileInfoTitle.textContent = info.title;
  tileInfoSummary.textContent = info.summary;
  tileInfoEffect.textContent = info.effect;
  tileInfoStats.replaceChildren(...info.stats.map(({ label, value }) => {
    const row = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label;
    description.textContent = value;
    row.append(term, description);
    return row;
  }));

  configureTileInfoChoice(state, nodeId, source);

  if (tileInfoModal.open) return;
  if (typeof tileInfoModal.showModal === "function") tileInfoModal.showModal();
  else tileInfoModal.setAttribute("open", "");
}

function latestLandedNodeId(state) {
  for (let index = state.lastEvents.length - 1; index >= 0; index -= 1) {
    const event = state.lastEvents[index];
    if (event.type === "TILE_LANDED" && event.nodeId) return event.nodeId;
  }
  return null;
}

function renderBoard(state) {
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
    meta.textContent = node.type === "PROPERTY" ? propertyMeta(state, node) : tileMeta(node);

    const tokens = document.createElement("div");
    tokens.className = "board-tile__tokens";
    state.players.filter((player) => !player.bankrupt && player.positionNodeId === node.id).forEach((player) => {
      const token = document.createElement("span");
      token.className = "player-token";
      token.dataset.seat = String(player.seat);
      token.textContent = playerMarker(player);
      token.title = playerName(player);
      tokens.append(token);
    });

    tile.append(title, meta, tokens);
    boardElement.append(tile);
  });
}

function renderPlayers(state) {
  playerList.replaceChildren(...state.players.slice(0, 4).map((player, index) => {
    const card = document.createElement("article");
    card.className = "player-card player-hud-card";
    card.dataset.seat = String(player.seat);
    if (state.currentPlayerIndex === index && state.status === GAME_STATUS.PLAYING) card.dataset.current = "true";
    if (player.bankrupt) card.dataset.bankrupt = "true";

    const properties = Object.values(state.boardState.properties)
      .filter((propertyState) => propertyState.ownerId === player.id).length;
    const stateLabel = player.bankrupt
      ? "파산"
      : state.currentPlayerIndex === index && state.status === GAME_STATUS.PLAYING
        ? "현재 차례"
        : "대기";

    card.innerHTML = `
      <div class="player-card__title">
        <span class="player-token" data-seat="${player.seat}">${playerMarker(player)}</span>
        <div>
          <strong>${playerName(player)}</strong>
          <span class="player-card__state">${stateLabel}</span>
        </div>
      </div>
      <dl>
        <div><dt>보유 골드</dt><dd>${money(player.money)}</dd></div>
        <div><dt>소유 도시</dt><dd>${properties}곳</dd></div>
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
    case "GAME_STARTED": return "게임 시작";
    case "DICE_ROLLED": return `${playerLabel} · ${event.dice.join(" + ")} = ${event.total}`;
    case "START_PASSED": return `${playerLabel} · 출발 보너스 ${money(event.amount)}`;
    case "PLAYER_MOVED": return `${playerLabel} · ${findNode(state, event.toNodeId)?.label ?? event.toNodeId} 이동`;
    case "PROPERTY_BOUGHT": return `${playerLabel} · ${node?.label ?? event.nodeId} 구매 ${money(event.amount)}`;
    case "PROPERTY_BUILT": return `${playerLabel} · ${node?.label ?? event.nodeId} 건물 ${event.buildingLevel}단계`;
    case "MONEY_PAID": return `${playerLabel} · ${event.reason === "TOLL" ? "통행료" : "지출"} ${money(event.amount)}`;
    case "MONEY_RECEIVED": return `${playerLabel} · ${money(event.amount)} 획득`;
    case "EVENT_DRAWN": return `${playerLabel} · ${event.label}`;
    case "REST_ASSIGNED": return `${playerLabel} · ${event.skipTurns}턴 휴식`;
    case "TURN_SKIPPED": return `${playerLabel} · 휴식으로 턴 건너뜀`;
    case "CHOICE_DECLINED": return `${playerLabel} · 선택 건너뜀`;
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
  eventHistory = eventHistory.slice(-10);
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
  primaryActionButton.disabled = interactionLocked;
  primaryActionButton.dataset.action = "";

  if (state.status === GAME_STATUS.FINISHED) {
    const winner = state.players.find((player) => player.id === state.winnerPlayerId);
    turnLabel.textContent = winner ? `${playerName(winner)} 승리` : "게임 종료";
    gameMessage.textContent = winner ? `${playerName(winner)}이(가) 마지막까지 생존했습니다.` : "게임이 종료되었습니다.";
    diceSummary.textContent = "게임 종료";
    primaryActionButton.textContent = "게임 종료";
    primaryActionButton.disabled = true;
    return;
  }

  turnLabel.textContent = current ? `${playerName(current)} · ${state.turn}턴` : "-";
  const rolling = interactionLocked && state.lastEvents.some((event) => event.type === "DICE_ROLLED");
  diceSummary.textContent = rolling
    ? "주사위가 굴러가는 중…"
    : state.lastRoll
      ? `🎲 ${state.lastRoll.dice[0]} + ${state.lastRoll.dice[1]} = ${state.lastRoll.total}`
      : "주사위를 굴려주세요";

  if (state.phase === TURN_PHASES.WAITING_ROLL) {
    gameMessage.textContent = interactionLocked ? "연출을 재생하고 있습니다." : `${playerName(current)}의 차례입니다.`;
    primaryActionButton.textContent = "주사위 굴리기";
    primaryActionButton.dataset.action = "roll";
    return;
  }

  if (state.phase === TURN_PHASES.WAITING_CHOICE) {
    gameMessage.textContent = `${playerName(current)}의 선택을 기다리고 있습니다.`;
    primaryActionButton.hidden = true;
    return;
  }

  if (state.phase === TURN_PHASES.TURN_END) {
    gameMessage.textContent = interactionLocked ? "연출을 재생하고 있습니다." : "이번 턴 처리가 끝났습니다.";
    primaryActionButton.textContent = "다음 턴";
    primaryActionButton.dataset.action = "endTurn";
    return;
  }

  primaryActionButton.hidden = true;
  gameMessage.textContent = "게임 상태를 처리하고 있습니다.";
}

function renderPlaytest({ renderThree = true } = {}) {
  if (!localSession) return;
  const state = localSession.getState();
  renderBoard(state);
  renderPlayers(state);
  renderActionControls(state);
  renderEventLog();
  if (renderThree && threeRendererReady) threeRenderer.renderState(state);
}

function setInteractionLocked(locked) {
  interactionLocked = locked;
  if (localSession) renderActionControls(localSession.getState());
}

function importantEventMessage(state) {
  for (let index = state.lastEvents.length - 1; index >= 0; index -= 1) {
    const event = state.lastEvents[index];
    if (event.type === "GAME_FINISHED") {
      const winner = state.players.find((player) => player.id === event.winnerPlayerId);
      return winner ? `${playerName(winner)} 승리!` : "게임 종료";
    }
    if (event.type === "PLAYER_BANKRUPT") {
      const player = state.players.find((candidate) => candidate.id === event.playerId);
      return `${player ? playerName(player) : "플레이어"}이(가) 파산했습니다.`;
    }
    if (event.type === "EVENT_DRAWN") {
      const player = state.players.find((candidate) => candidate.id === event.playerId);
      return `${player ? playerName(player) : "플레이어"} · ${event.label}`;
    }
  }
  return null;
}

function showImportantNotice(state) {
  const message = importantEventMessage(state);
  if (!message || !importantNotice) return;
  window.clearTimeout(importantNoticeTimer);
  importantNotice.textContent = message;
  importantNotice.hidden = false;
  importantNoticeTimer = window.setTimeout(() => {
    importantNotice.hidden = true;
  }, 2400);
}

async function ensureThreeRenderer() {
  if (threeRendererReady) return threeRenderer;
  if (threeRendererInit) return threeRendererInit;

  threeStatus.textContent = "2.5D 보드를 불러오는 중입니다…";
  threeStageElement.dataset.loading = "true";

  threeRenderer = createClassicThreePrototypeRenderer({
    onTileSelect(nodeId) {
      if (!localSession) return;
      const state = localSession.getState();
      if (state.phase === TURN_PHASES.WAITING_CHOICE) return;
      openTileInfo(state, nodeId, { source: "inspect" });
    },
  });

  threeRendererInit = threeRenderer.mount(threeStageElement)
    .then(() => {
      threeRendererReady = true;
      threeStageElement.dataset.loading = "false";
      threeStatus.textContent = "고정 쿼터뷰 · 타일 클릭/터치";
      if (localSession) threeRenderer.renderState(localSession.getState());
      return threeRenderer;
    })
    .catch((error) => {
      threeRendererReady = false;
      threeStageElement.dataset.loading = "false";
      threeStageElement.dataset.error = "true";
      threeStatus.textContent = "2.5D 보드를 불러오지 못했습니다. 아래 2D 상태 보드로 규칙 테스트는 계속할 수 있습니다.";
      console.error("Marble 2.5D prototype failed to initialize.", error);
      return null;
    });

  return threeRendererInit;
}

async function ensureDiceStage() {
  if (diceStageReady) return diceStage;
  if (diceStageInit) return diceStageInit;

  diceStage = createThreeDiceStage();
  diceStageInit = diceStage.mount(diceStageElement)
    .then(() => {
      diceStageReady = true;
      return diceStage;
    })
    .catch((error) => {
      diceStageReady = false;
      console.error("Marble 3D dice stage failed to initialize.", error);
      return null;
    });
  return diceStageInit;
}

async function playStateEvents(state) {
  for (const event of state.lastEvents) {
    if (event.type === "DICE_ROLLED") {
      const stage = await ensureDiceStage();
      await stage?.playRoll(event.dice);
    }
    if (event.type === "PLAYER_MOVED") diceStage?.hide();
    if (threeRendererReady) await threeRenderer.playEvent(event);
  }
  if (threeRendererReady) threeRenderer.renderState(state);
}

async function runSessionAction(actionName) {
  if (!localSession || interactionLocked || !actionName) return;

  try {
    if (tileInfoModal?.dataset.mode === "choice") closeTileInfo({ force: true });

    if (actionName === "roll") localSession.roll();
    else if (actionName === "buy") localSession.buy();
    else if (actionName === "build") localSession.build();
    else if (actionName === "endTurn") localSession.endTurn();
    else return;

    const state = localSession.getState();
    appendEvents(state);
    setInteractionLocked(true);
    renderPlaytest({ renderThree: false });
    await playStateEvents(state);
    showImportantNotice(state);

    const landedNodeId = latestLandedNodeId(state);
    if (landedNodeId) openTileInfo(state, landedNodeId, { source: "landing" });
  } catch (error) {
    gameMessage.textContent = error instanceof Error ? error.message : "게임 액션 처리 중 오류가 발생했습니다.";
  } finally {
    setInteractionLocked(false);
  }
}

function startLocalPlaytest() {
  closeTileInfo({ force: true });
  diceStage?.hide();
  localSession = createLocalClassicSession();
  eventHistory = [];
  localSession.start();
  appendEvents(localSession.getState());
  playtestSection.hidden = false;
  renderPlaytest();
  void ensureThreeRenderer();
  void ensureDiceStage();
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
primaryActionButton.addEventListener("click", () => { void runSessionAction(primaryActionButton.dataset.action); });
tileInfoCloseButton?.addEventListener("click", () => closeTileInfo());
tileInfoConfirmButton?.addEventListener("click", () => closeTileInfo());
tileInfoDeclineButton?.addEventListener("click", () => {
  closeTileInfo({ force: true });
  void runSessionAction("endTurn");
});
tileInfoActionButton?.addEventListener("click", () => {
  const action = tileInfoChoiceAction || tileInfoActionButton.dataset.action;
  closeTileInfo({ force: true });
  void runSessionAction(action);
});
tileInfoModal?.addEventListener("cancel", (event) => {
  if (tileInfoModal.dataset.mode === "choice") event.preventDefault();
});

renderThemeCards();
renderSelectedTheme();
