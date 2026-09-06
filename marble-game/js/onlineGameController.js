import { GAME_STATUS } from "./core/gameEngine.js";
import { TURN_PHASES } from "./core/turnMachine.js";
import { createThreeDiceStage } from "./diceStage.js";
import { createOnlineClassicSession, isOnlineViewerTurn } from "./onlineSession.js";
import { getOnlineRoomId } from "./onlinePlayRoute.js";
import { createClassicThreePrototypeRenderer } from "./renderer/threeClassicPrototype.js";
import { createClassicTileInfo } from "./tileInfo.js";
import { createClassicTollNotice } from "./tollNotice.js";
import { CLASSIC_RULES } from "./themes/classic/rules.js";
import { formatThemeMoney } from "./themes/money.js";

const onlineRoomId = getOnlineRoomId(window.location.href);

if (onlineRoomId) {
  const playtestSection = document.querySelector("[data-playtest-section]");
  const boardElement = document.querySelector("[data-classic-board]");
  const boardCenter = boardElement?.querySelector(".board-center");
  const threeStageElement = document.querySelector("[data-three-stage]");
  const threeStatus = document.querySelector("[data-three-status]");
  const diceStageElement = document.querySelector("[data-dice-stage]");
  const playerList = document.querySelector("[data-player-list]");
  const turnLabel = document.querySelector("[data-turn-label]");
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
  const tollNoticeModal = document.querySelector("[data-toll-notice-modal]");
  const tollCity = document.querySelector("[data-toll-city]");
  const tollOwner = document.querySelector("[data-toll-owner]");
  const tollOwnerSeat = document.querySelector("[data-toll-owner-seat]");
  const tollAmount = document.querySelector("[data-toll-amount]");
  const tollEffect = document.querySelector("[data-toll-effect]");
  const tollConfirmButton = document.querySelector("[data-toll-confirm]");

  const OWNER_COLORS = Object.freeze(["#61b8ff", "#ff8c9f", "#ffd55a", "#8bd48a"]);
  let session = null;
  let threeRenderer = null;
  let threeRendererReady = false;
  let diceStage = null;
  let diceStageReady = false;
  let interactionLocked = false;
  let tileInfoChoiceAction = null;
  let eventHistory = [];
  let importantNoticeTimer = null;
  let lastAnimatedVersion = 0;

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
        ${player.bankrupt ? '<span class="bankrupt-label">파산</span>' : ""}
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
    if (secondaryActionButton) secondaryActionButton.hidden = true;

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
      gameMessage.textContent = state.phase === TURN_PHASES.WAITING_CHOICE
        ? `${playerName(current)}이(가) 선택 중입니다.`
        : `${playerName(current)}의 차례를 기다리고 있습니다.`;
      return;
    }

    if (state.phase === TURN_PHASES.WAITING_ROLL) {
      gameMessage.textContent = interactionLocked ? "서버 결과를 처리하고 있습니다." : "내 차례입니다.";
      primaryActionButton.textContent = "주사위 굴리기";
      primaryActionButton.dataset.action = "roll";
      return;
    }
    if (state.phase === TURN_PHASES.WAITING_CHOICE) {
      gameMessage.textContent = "도시 행동을 선택해 주세요.";
      primaryActionButton.hidden = true;
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
      case "START_PASSED": return `${label} · 출발 보너스 ${money(event.amount)}`;
      case "PLAYER_MOVED": return `${label} · ${findNode(state, event.toNodeId)?.label ?? event.toNodeId} 이동`;
      case "PROPERTY_BOUGHT": return `${label} · ${node?.label ?? event.nodeId} 구매 ${money(event.amount)}`;
      case "PROPERTY_BUILT": return `${label} · ${node?.label ?? event.nodeId} 건물 ${event.buildingLevel}단계`;
      case "MONEY_PAID": return `${label} · ${event.reason === "TOLL" ? "통행료" : "지출"} ${money(event.amount)}`;
      case "MONEY_RECEIVED": return `${label} · ${money(event.amount)} 획득`;
      case "EVENT_DRAWN": return `${label} · ${event.label}`;
      case "REST_ASSIGNED": return `${label} · ${event.skipTurns}턴 휴식`;
      case "TURN_SKIPPED": return `${label} · 휴식으로 턴 건너뜀`;
      case "CHOICE_DECLINED": return `${label} · 선택 건너뜀`;
      case "PLAYER_BANKRUPT": return `${label} · 파산`;
      case "GAME_FINISHED": {
        const winner = state.players.find((candidate) => candidate.id === event.winnerPlayerId);
        return `${winner ? playerName(winner) : "승자 없음"} · 게임 승리`;
      }
      case "TILE_LANDED": return `${label} · ${node?.label ?? event.nodeId} 도착`;
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

  function resetTileActions() {
    tileInfoChoiceAction = null;
    if (!tileInfoModal) return;
    tileInfoModal.dataset.mode = "inspect";
    tileInfoConfirmButton.hidden = false;
    tileInfoDeclineButton.hidden = true;
    tileInfoActionButton.hidden = true;
    tileInfoActionButton.dataset.action = "";
  }

  function closeTileInfo({ force = false } = {}) {
    if (!tileInfoModal) return;
    if (!force && tileInfoModal.dataset.mode === "choice") return;
    if (tileInfoModal.open && typeof tileInfoModal.close === "function") tileInfoModal.close();
    else tileInfoModal.removeAttribute("open");
    resetTileActions();
  }

  function closeTollNotice() {
    if (!tollNoticeModal) return;
    if (tollNoticeModal.open && typeof tollNoticeModal.close === "function") tollNoticeModal.close();
    else tollNoticeModal.removeAttribute("open");
  }

  function openTileInfo(state, nodeId, { source = "inspect" } = {}) {
    if (!tileInfoModal) return;
    const info = createClassicTileInfo(state, nodeId);
    if (!info) return;
    closeTollNotice();
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
    resetTileActions();
    if (source === "landing" && viewerCanAct(state) && state.phase === TURN_PHASES.WAITING_CHOICE && state.pendingChoice?.nodeId === nodeId) {
      tileInfoModal.dataset.mode = "choice";
      tileInfoConfirmButton.hidden = true;
      tileInfoDeclineButton.hidden = false;
      tileInfoActionButton.hidden = false;
      if (state.pendingChoice.type === "BUY_PROPERTY") {
        tileInfoChoiceAction = "buy";
        tileInfoActionButton.dataset.action = "buy";
        tileInfoActionButton.textContent = `구매하기 · ${money(state.pendingChoice.price)}`;
      } else if (state.pendingChoice.type === "BUILD_PROPERTY") {
        tileInfoChoiceAction = "build";
        tileInfoActionButton.dataset.action = "build";
        tileInfoActionButton.textContent = `건설하기 · ${money(state.pendingChoice.cost)}`;
      }
    }
    if (!tileInfoModal.open) {
      if (typeof tileInfoModal.showModal === "function") tileInfoModal.showModal();
      else tileInfoModal.setAttribute("open", "");
    }
  }

  function openTollNotice(notice) {
    if (!notice || !tollNoticeModal) return;
    closeTileInfo({ force: true });
    tollCity.textContent = notice.city;
    tollOwner.textContent = notice.ownerName;
    tollOwnerSeat.textContent = `P${notice.ownerSeat + 1}`;
    tollOwnerSeat.style.setProperty("--toll-owner", OWNER_COLORS[notice.ownerSeat] ?? OWNER_COLORS[0]);
    tollAmount.textContent = notice.amountLabel;
    tollEffect.textContent = notice.effect;
    if (!tollNoticeModal.open) {
      if (typeof tollNoticeModal.showModal === "function") tollNoticeModal.showModal();
      else tollNoticeModal.setAttribute("open", "");
    }
  }

  function showLandingOutcome(state) {
    const landing = [...state.lastEvents].reverse().find((event) => event.type === "TILE_LANDED" && event.nodeId);
    if (!landing || landing.playerId !== session?.getViewerPlayerId()) return;
    const toll = createClassicTollNotice(state);
    if (toll) {
      openTollNotice(toll);
      return;
    }
    if (state.phase === TURN_PHASES.WAITING_CHOICE && viewerCanAct(state)) {
      openTileInfo(state, landing.nodeId, { source: "landing" });
    }
  }

  function showImportantNotice(state) {
    if (!importantNotice) return;
    let text = null;
    for (let index = state.lastEvents.length - 1; index >= 0; index -= 1) {
      const event = state.lastEvents[index];
      if (event.type === "GAME_FINISHED") {
        const winner = state.players.find((player) => player.id === event.winnerPlayerId);
        text = winner ? `${playerName(winner)} 승리!` : "게임 종료";
        break;
      }
      if (event.type === "PLAYER_BANKRUPT") {
        const player = state.players.find((candidate) => candidate.id === event.playerId);
        text = `${playerName(player)}이(가) 파산했습니다.`;
        break;
      }
      if (event.type === "EVENT_DRAWN") {
        const player = state.players.find((candidate) => candidate.id === event.playerId);
        text = `${playerName(player)} · ${event.label}`;
        break;
      }
    }
    if (!text) return;
    window.clearTimeout(importantNoticeTimer);
    importantNotice.textContent = text;
    importantNotice.hidden = false;
    importantNoticeTimer = window.setTimeout(() => { importantNotice.hidden = true; }, 2400);
  }

  function renderUi(state, { renderThree = true } = {}) {
    renderStateBoard(state);
    renderPlayers(state);
    renderActionControls(state);
    if (renderThree && threeRendererReady) threeRenderer.renderState(state);
  }

  async function ensureRenderer() {
    if (threeRendererReady) return threeRenderer;
    threeRenderer = createClassicThreePrototypeRenderer({
      onTileSelect(nodeId) {
        if (!session) return;
        const state = session.getState();
        if (state.phase === TURN_PHASES.WAITING_CHOICE && viewerCanAct(state)) return;
        openTileInfo(state, nodeId, { source: "inspect" });
      },
    });
    threeStatus.textContent = "온라인 2.5D 보드를 불러오는 중입니다…";
    await threeRenderer.mount(threeStageElement);
    threeRendererReady = true;
    threeStatus.textContent = "온라인 동기화 · 고정 쿼터뷰";
    return threeRenderer;
  }

  async function ensureDiceStage() {
    if (diceStageReady) return diceStage;
    diceStage = createThreeDiceStage();
    await diceStage.mount(diceStageElement);
    diceStageReady = true;
    return diceStage;
  }

  async function animateState(state, { remote = false } = {}) {
    if (state.version <= lastAnimatedVersion) {
      threeRenderer?.renderState(state);
      return;
    }
    lastAnimatedVersion = state.version;
    for (const event of state.lastEvents) {
      if (event.type === "DICE_ROLLED") {
        const stage = await ensureDiceStage();
        if (remote) diceStageElement.dataset.rollStrength = "0.550";
        await stage?.playRoll(event.dice);
      }
      if (event.type === "PLAYER_MOVED") diceStage?.hide();
      if (threeRendererReady) await threeRenderer.playEvent(event);
    }
    threeRenderer?.renderState(state);
  }

  function connectionStatus(status) {
    document.body.dataset.onlineConnection = String(status || "").toLowerCase();
    if (!gameMessage) return;
    if (status === "OFFLINE") gameMessage.textContent = "연결이 끊겼습니다. 재연결을 기다리는 중입니다.";
    else if (["RECONNECTING", "CHANNEL_ERROR", "TIMED_OUT"].includes(status)) gameMessage.textContent = "온라인 게임을 다시 연결하는 중입니다.";
  }

  async function applyState(state, { animate = true, remote = false } = {}) {
    appendEvents(state);
    renderUi(state, { renderThree: !animate });
    if (animate) await animateState(state, { remote });
    showImportantNotice(state);
    showLandingOutcome(state);
    renderActionControls(state);
  }

  async function runAction(actionName) {
    if (!session || interactionLocked || !viewerCanAct(session.getState())) return;
    closeTileInfo({ force: true });
    closeTollNotice();
    interactionLocked = true;
    renderActionControls(session.getState());
    try {
      let state;
      if (actionName === "roll") state = await session.roll();
      else if (actionName === "buy") state = await session.buy();
      else if (actionName === "build") state = await session.build();
      else if (actionName === "endTurn") state = await session.endTurn();
      else return;
      await applyState(state, { animate: true, remote: false });
    } catch (error) {
      const message = String(error?.message ?? error ?? "");
      if (message.includes("VERSION_CONFLICT")) {
        await session.refresh();
        renderUi(session.getState());
        gameMessage.textContent = "다른 플레이어의 최신 상태를 반영했습니다. 다시 시도해 주세요.";
      } else if (message.includes("NOT_YOUR_TURN")) {
        await session.refresh();
        renderUi(session.getState());
        gameMessage.textContent = "현재 다른 플레이어의 차례입니다.";
      } else {
        console.error("Marble online action failed", error);
        gameMessage.textContent = "온라인 게임 액션 처리 중 오류가 발생했습니다.";
      }
    } finally {
      interactionLocked = false;
      if (session) renderActionControls(session.getState());
    }
  }

  primaryActionButton?.addEventListener("click", (event) => {
    if (!event.currentTarget.dataset.action) return;
    void runAction(event.currentTarget.dataset.action);
  });
  tileInfoCloseButton?.addEventListener("click", () => closeTileInfo());
  tileInfoConfirmButton?.addEventListener("click", () => closeTileInfo());
  tileInfoDeclineButton?.addEventListener("click", () => {
    closeTileInfo({ force: true });
    void runAction("endTurn");
  });
  tileInfoActionButton?.addEventListener("click", () => {
    const action = tileInfoChoiceAction || tileInfoActionButton.dataset.action;
    closeTileInfo({ force: true });
    void runAction(action);
  });
  tollConfirmButton?.addEventListener("click", closeTollNotice);

  async function init() {
    if (!playtestSection) return;
    playtestSection.hidden = false;
    document.body.dataset.sessionMode = "online";
    gameMessage.textContent = "온라인 게임 상태를 불러오는 중입니다.";
    interactionLocked = true;
    try {
      await ensureRenderer();
      await ensureDiceStage();
      session = await createOnlineClassicSession({
        roomId: onlineRoomId,
        onRemoteState: async (state) => {
          if (interactionLocked) {
            renderUi(state);
            return;
          }
          interactionLocked = true;
          try {
            await applyState(state, { animate: true, remote: true });
          } finally {
            interactionLocked = false;
            renderActionControls(state);
          }
        },
        onConnectionStatus: connectionStatus,
      });
      eventHistory = [];
      const state = session.getState();
      lastAnimatedVersion = state.version;
      appendEvents(state);
      renderUi(state);
      if (state.phase === TURN_PHASES.WAITING_CHOICE) showLandingOutcome(state);
      playtestSection.scrollIntoView({ block: "start" });
    } catch (error) {
      console.error("Marble online game failed to initialize", error);
      gameMessage.textContent = "온라인 게임을 불러오지 못했습니다. 대기실에서 다시 접속해 주세요.";
      primaryActionButton.hidden = true;
    } finally {
      interactionLocked = false;
      if (session) renderActionControls(session.getState());
    }
  }

  window.addEventListener("beforeunload", () => session?.dispose?.());
  void init();
}
