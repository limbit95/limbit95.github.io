let api = null;
let snapshot = null;
let screen = null;
let unsubscribeGame = null;
let refreshTimer = null;
let selectedCard = null;
let busy = false;
let notice = "";

function ensureScreen() {
  if (screen) return screen;

  const shell = document.querySelector(".app-shell");
  if (!shell) throw new Error("The Game app shell was not found.");

  screen = document.createElement("section");
  screen.id = "online-game-screen";
  screen.className = "screen online-game-screen";
  screen.hidden = true;
  screen.innerHTML = `
    <header class="game-header online-game-header">
      <div>
        <p class="eyebrow">ONLINE GAME</p>
        <h1 data-online-turn>게임 준비 중</h1>
      </div>
      <div class="header-actions">
        <div class="deck-counter" aria-label="남은 덱">
          <span>DECK</span>
          <strong data-online-deck-count>0</strong>
        </div>
        <button class="ghost-button" type="button" data-online-game-close>화면 닫기</button>
      </div>
    </header>

    <section class="turn-progress" aria-live="polite">
      <div>
        <span>현재 진행</span>
        <strong data-online-turn-progress>1턴 · 최소 2장</strong>
      </div>
      <p data-online-game-message>게임 상태를 불러오고 있습니다.</p>
    </section>

    <section class="pile-grid" aria-label="공용 카드 더미" data-online-piles></section>

    <section class="online-game-players" aria-label="온라인 참가자" data-online-players></section>

    <section class="hand-panel" aria-labelledby="online-hand-title">
      <div class="hand-header">
        <div>
          <p class="eyebrow">YOUR CARDS</p>
          <h2 id="online-hand-title">내 카드</h2>
        </div>
        <span class="hand-count" data-online-hand-count>0장</span>
      </div>
      <div class="hand" data-online-hand></div>
      <p class="online-game-note" data-online-hand-note>내 턴에는 카드를 선택한 뒤 놓을 수 있는 더미를 눌러주세요.</p>
    </section>

    <div class="online-game-actions" data-online-actions>
      <button class="primary-button end-turn-button" type="button" data-online-end-turn disabled>최소 장수를 채우면 턴 종료</button>
    </div>

    <section class="online-result-card" data-online-result hidden aria-live="polite">
      <p class="eyebrow" data-online-result-kicker>RESULT</p>
      <h2 data-online-result-title>게임 종료</h2>
      <p data-online-result-message></p>
      <div class="result-score">
        <span>남은 카드</span>
        <strong data-online-result-remaining>0</strong>
      </div>
      <button class="primary-button" type="button" data-online-result-exit>게임 종료하고 나가기</button>
    </section>

    <div class="lobby-meta online-game-connection">
      <span data-online-game-connection>실시간 연결 준비 중</span>
      <span>새로고침해도 현재 게임으로 복귀합니다.</span>
    </div>
  `;

  const firstScreen = shell.querySelector(".screen");
  shell.insertBefore(screen, firstScreen);
  bindEvents();
  return screen;
}

function bindEvents() {
  screen.querySelector("[data-online-game-close]").addEventListener("click", () => {
    closeOnlineGame();
    document.dispatchEvent(new CustomEvent("the-game:return-home"));
  });

  screen.querySelector("[data-online-hand]").addEventListener("click", (event) => {
    const button = event.target.closest("[data-online-card]");
    if (!button || button.disabled || busy) return;
    const card = Number(button.dataset.onlineCard);
    selectedCard = selectedCard === card ? null : card;
    notice = "";
    render();
  });

  screen.querySelector("[data-online-piles]").addEventListener("click", (event) => {
    const button = event.target.closest("[data-online-pile-id]");
    if (!button || button.disabled || busy) return;
    submitSelectedCard(button.dataset.onlinePileId);
  });

  screen.querySelector("[data-online-end-turn]").addEventListener("click", endCurrentTurn);
  screen.querySelector("[data-online-result-exit]").addEventListener("click", leaveFinishedGame);
}

function closeSubscription() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
  if (unsubscribeGame) {
    unsubscribeGame();
    unsubscribeGame = null;
  }
}

function friendlyError(error) {
  const message = error?.message ?? String(error ?? "");
  const mappings = [
    ["AUTH_REQUIRED", "로그인 상태를 확인해 주세요."],
    ["PLAYER_NOT_MEMBER", "이 게임에 참여 중인 플레이어가 아닙니다."],
    ["GAME_NOT_FOUND", "진행 중인 게임을 찾을 수 없습니다."],
    ["GAME_NOT_PLAYING", "이미 종료된 게임입니다."],
    ["NOT_YOUR_TURN", "현재 내 턴이 아닙니다."],
    ["CARD_NOT_IN_HAND", "내 손패에 없는 카드입니다. 최신 상태를 다시 불러옵니다."],
    ["CARD_NOT_PLAYABLE", "선택한 카드는 그 더미에 놓을 수 없습니다."],
    ["MINIMUM_NOT_MET", "이번 턴의 최소 제출 장수를 먼저 채워 주세요."],
    ["STATE_CHANGED", "다른 변경사항이 먼저 반영됐습니다. 최신 상태로 다시 맞췄습니다."],
    ["CLIENT_ACTION_REUSED", "중복 요청을 안전하게 차단했습니다. 최신 상태를 다시 확인해 주세요."],
    ["GAME_IN_PROGRESS", "게임 진행 중에는 방에서 나갈 수 없습니다."],
  ];

  return mappings.find(([code]) => message.includes(code))?.[1]
    ?? "온라인 게임 요청을 처리하지 못했습니다. 최신 상태를 확인해 주세요.";
}

function isPlaying() {
  return snapshot?.game?.status === "playing";
}

function isMyTurn() {
  return isPlaying() && snapshot?.self?.is_current === true;
}

function canPlayCard(card, pile) {
  if (!Number.isInteger(card) || !pile) return false;
  if (pile.direction === "ascending") {
    return card > pile.value || pile.value - card === 10;
  }
  if (pile.direction === "descending") {
    return card < pile.value || card - pile.value === 10;
  }
  return false;
}

function isReverseJump(card, pile) {
  if (pile.direction === "ascending") return pile.value - card === 10;
  if (pile.direction === "descending") return card - pile.value === 10;
  return false;
}

function renderPlayers(players, currentSeat, selfUserId) {
  const root = screen.querySelector("[data-online-players]");
  root.replaceChildren();

  for (const player of players) {
    const card = document.createElement("article");
    card.className = `online-game-player ${player.seat === currentSeat && isPlaying() ? "is-current" : ""}`;

    const name = document.createElement("strong");
    name.textContent = player.nickname;

    const meta = document.createElement("span");
    const labels = [`${player.hand_count}장`];
    if (player.user_id === selfUserId) labels.push("나");
    if (player.seat === currentSeat && isPlaying()) labels.push("현재 턴");
    meta.textContent = labels.join(" · ");

    card.append(name, meta);
    root.append(card);
  }
}

function renderHand(cards) {
  const root = screen.querySelector("[data-online-hand]");
  root.replaceChildren();
  const interactive = isMyTurn() && !busy;

  for (const card of [...cards].sort((a, b) => a - b)) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = `number-card online-number-card ${selectedCard === card ? "is-selected" : ""}`;
    item.textContent = String(card);
    item.dataset.onlineCard = String(card);
    item.disabled = !interactive;
    item.setAttribute("aria-label", `내 카드 ${card}${selectedCard === card ? ", 선택됨" : ""}`);
    root.append(item);
  }
}

function renderPiles(piles) {
  const root = screen.querySelector("[data-online-piles]");
  root.replaceChildren();

  for (const pile of piles) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `pile-card ${pile.direction}`;
    button.dataset.onlinePileId = pile.id;

    const playable = isMyTurn()
      && selectedCard !== null
      && canPlayCard(selectedCard, pile)
      && !busy;
    const reverse = playable && isReverseJump(selectedCard, pile);
    button.classList.toggle("is-playable", playable);
    button.classList.toggle("is-reverse", reverse);
    button.disabled = !playable;

    const arrow = pile.direction === "ascending" ? "↑" : "↓";
    const caption = pile.direction === "ascending" ? "오름차순" : "내림차순";
    button.innerHTML = `
      <span class="pile-direction">${arrow}</span>
      <strong class="pile-value">${pile.value}</strong>
      <span class="pile-caption">${caption}</span>
    `;
    button.setAttribute(
      "aria-label",
      playable
        ? `${caption} ${pile.value} 더미에 ${selectedCard} 놓기${reverse ? ", 10 되돌리기" : ""}`
        : `${caption} ${pile.value} 더미`,
    );

    root.append(button);
  }
}

function defaultMessage() {
  const { game, self, players = [] } = snapshot;
  if (game.status === "won") return "모든 카드를 내려놓았습니다. 협력 성공!";
  if (game.status === "lost") return "현재 플레이어가 필요한 최소 장수를 더 이상 낼 수 없어 게임이 종료됐습니다.";

  if (!self.is_current) {
    const current = players.find((player) => player.seat === game.current_seat);
    return `${current?.nickname ?? `플레이어 ${game.current_seat}`}의 플레이를 기다리고 있습니다.`;
  }

  const remainingRequired = Math.max(0, game.required_cards - game.cards_played_this_turn);
  if (remainingRequired > 0) {
    return `내 턴입니다. 최소 ${remainingRequired}장을 더 내려놓아야 턴을 종료할 수 있습니다.`;
  }
  return "최소 제출 장수를 채웠습니다. 더 내려놓거나 턴을 종료할 수 있습니다.";
}

function renderResult(game) {
  const result = screen.querySelector("[data-online-result]");
  const actions = screen.querySelector("[data-online-actions]");
  const finished = game.status === "won" || game.status === "lost";
  result.hidden = !finished;
  actions.hidden = finished;

  if (!finished) return;

  const won = game.status === "won";
  screen.querySelector("[data-online-result-kicker]").textContent = won ? "MISSION COMPLETE" : "GAME OVER";
  screen.querySelector("[data-online-result-title]").textContent = won ? "모든 카드를 내려놓았습니다!" : "이번 게임은 여기까지";
  screen.querySelector("[data-online-result-message]").textContent = won
    ? "네 개의 더미에 2부터 99까지의 카드를 모두 내려놓는 데 성공했습니다."
    : `총 ${game.result?.cards_played ?? 0}장을 내려놓았습니다. 다음 게임에서는 ±10 되돌리기를 더 적극적으로 활용해 보세요.`;
  screen.querySelector("[data-online-result-remaining]").textContent = String(game.result?.remaining_cards ?? game.remaining_cards ?? 0);
  screen.querySelector("[data-online-result-exit]").disabled = busy;
}

function render() {
  if (!snapshot?.game || !snapshot?.self) return;
  ensureScreen();

  const { game, self, players = [] } = snapshot;
  const currentPlayer = players.find((player) => player.seat === game.current_seat);

  if (!isMyTurn() || !(self.hand ?? []).includes(selectedCard)) {
    selectedCard = null;
  }

  const turnLabel = game.status === "won"
    ? "게임 성공!"
    : game.status === "lost"
      ? "게임 종료"
      : self.is_current
        ? "내 턴"
        : `${currentPlayer?.nickname ?? `플레이어 ${game.current_seat}`}의 턴`;

  screen.querySelector("[data-online-turn]").textContent = turnLabel;
  screen.querySelector("[data-online-deck-count]").textContent = String(game.draw_count);
  screen.querySelector("[data-online-turn-progress]").textContent = game.status === "playing"
    ? `${game.turn_number}턴 · ${game.cards_played_this_turn}/${game.required_cards}장 제출`
    : `총 ${game.result?.cards_played ?? (98 - game.remaining_cards)}장 제출`;
  screen.querySelector("[data-online-game-message]").textContent = notice || defaultMessage();
  screen.querySelector("[data-online-hand-count]").textContent = `${self.hand_count}장`;
  screen.querySelector("[data-online-hand-note]").textContent = isMyTurn()
    ? selectedCard === null
      ? "카드를 선택하면 놓을 수 있는 더미가 강조됩니다."
      : `${selectedCard} 카드를 선택했습니다. 강조된 더미를 눌러 제출하세요.`
    : isPlaying()
      ? "다른 플레이어의 턴에는 내 손패를 확인만 할 수 있습니다."
      : "게임이 종료되었습니다.";

  renderPiles(game.piles ?? []);
  renderHand(self.hand ?? []);
  renderPlayers(players, game.current_seat, self.user_id);

  const endTurnButton = screen.querySelector("[data-online-end-turn]");
  endTurnButton.disabled = busy || !isMyTurn() || !game.can_end_turn;
  const remainingRequired = Math.max(0, game.required_cards - game.cards_played_this_turn);
  endTurnButton.textContent = game.can_end_turn && isMyTurn()
    ? "턴 종료 · 손패 보충"
    : isMyTurn()
      ? `${remainingRequired}장 더 내면 턴 종료 가능`
      : "현재 플레이어의 턴을 기다리는 중";

  renderResult(game);
}

async function refresh() {
  if (!snapshot?.room?.id || !api) return;
  try {
    const next = await api.getGameSnapshot(snapshot.room.id);
    if (!next) return;
    snapshot = next;
    render();
  } catch (error) {
    notice = friendlyError(error);
    render();
  }
}

function scheduleRefresh() {
  if (refreshTimer) return;
  refreshTimer = window.setTimeout(async () => {
    refreshTimer = null;
    await refresh();
  }, 80);
}

function subscribe() {
  closeSubscription();
  const gameId = snapshot?.game?.id;
  if (!gameId) return;

  const connection = screen.querySelector("[data-online-game-connection]");
  connection.textContent = "실시간 연결 중…";
  unsubscribeGame = api.subscribeGame({
    gameId,
    onChange: scheduleRefresh,
    onStatus(status) {
      if (status === "SUBSCRIBED") connection.textContent = "실시간 연결됨";
      else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") connection.textContent = "연결 재확인 필요";
      else if (status === "CLOSED") connection.textContent = "연결 종료됨";
    },
  });
}

async function submitSelectedCard(pileId) {
  if (busy || selectedCard === null || !isMyTurn()) return;
  const pile = snapshot.game.piles.find((candidate) => candidate.id === pileId);
  if (!pile || !canPlayCard(selectedCard, pile)) return;

  const card = selectedCard;
  busy = true;
  notice = `${card} 카드를 제출하고 있습니다…`;
  render();

  try {
    snapshot = await api.playCard({
      roomId: snapshot.room.id,
      card,
      pileId,
      expectedVersion: snapshot.game.version,
      clientActionId: crypto.randomUUID(),
    });
    selectedCard = null;
    notice = "";
  } catch (error) {
    if ((error?.message ?? "").includes("STATE_CHANGED") || (error?.message ?? "").includes("CARD_NOT_IN_HAND")) {
      await refresh();
    }
    notice = friendlyError(error);
  } finally {
    busy = false;
    render();
  }
}

async function endCurrentTurn() {
  if (busy || !isMyTurn() || !snapshot.game.can_end_turn) return;

  busy = true;
  selectedCard = null;
  notice = "턴을 종료하고 손패를 보충하고 있습니다…";
  render();

  try {
    snapshot = await api.endTurn({
      roomId: snapshot.room.id,
      expectedVersion: snapshot.game.version,
      clientActionId: crypto.randomUUID(),
    });
    notice = "";
  } catch (error) {
    if ((error?.message ?? "").includes("STATE_CHANGED")) await refresh();
    notice = friendlyError(error);
  } finally {
    busy = false;
    render();
  }
}

async function leaveFinishedGame() {
  if (busy || isPlaying() || !snapshot?.room) return;
  busy = true;
  notice = "게임 방을 정리하고 있습니다…";
  render();

  try {
    await api.leaveRoom({
      roomId: snapshot.room.id,
      expectedVersion: snapshot.room.version,
    });
    closeOnlineGame();
    document.dispatchEvent(new CustomEvent("the-game:return-home"));
  } catch (error) {
    if ((error?.message ?? "").includes("STATE_CHANGED")) await refresh();
    notice = friendlyError(error);
    busy = false;
    render();
  }
}

export function openOnlineGame({ api: apiModule, gameSnapshot }) {
  api = apiModule;
  snapshot = gameSnapshot;
  selectedCard = null;
  busy = false;
  notice = "";
  ensureScreen();

  for (const candidate of document.querySelectorAll(".app-shell > .screen")) {
    candidate.hidden = candidate !== screen;
  }

  screen.hidden = false;
  render();
  subscribe();
}

export function closeOnlineGame() {
  closeSubscription();
  selectedCard = null;
  busy = false;
  notice = "";
  if (screen) screen.hidden = true;
}
