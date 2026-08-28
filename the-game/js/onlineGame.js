let api = null;
let snapshot = null;
let screen = null;
let unsubscribeGame = null;
let refreshTimer = null;

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
        <span>현재 턴</span>
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
      <p class="online-game-note">이번 단계에서는 카드 배분과 비공개 손패 확인까지만 지원합니다. 카드 제출과 턴 종료는 다음 단계에서 연결됩니다.</p>
    </section>

    <div class="lobby-meta online-game-connection">
      <span data-online-game-connection>실시간 연결 준비 중</span>
      <span>새로고침해도 현재 게임으로 복귀합니다.</span>
    </div>
  `;

  const firstScreen = shell.querySelector(".screen");
  shell.insertBefore(screen, firstScreen);
  screen.querySelector("[data-online-game-close]").addEventListener("click", () => {
    closeOnlineGame();
    document.dispatchEvent(new CustomEvent("the-game:return-home"));
  });

  return screen;
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

function pileMarkup(pile) {
  const arrow = pile.direction === "ascending" ? "↑" : "↓";
  const caption = pile.direction === "ascending" ? "오름차순" : "내림차순";
  return `
    <article class="pile-card ${pile.direction}" aria-label="${caption} ${pile.value}">
      <span class="pile-direction">${arrow}</span>
      <strong class="pile-value">${pile.value}</strong>
      <span class="pile-caption">${caption}</span>
    </article>
  `;
}

function renderPlayers(players, currentSeat, selfUserId) {
  const root = screen.querySelector("[data-online-players]");
  root.replaceChildren();

  for (const player of players) {
    const card = document.createElement("article");
    card.className = `online-game-player ${player.seat === currentSeat ? "is-current" : ""}`;

    const name = document.createElement("strong");
    name.textContent = player.nickname;

    const meta = document.createElement("span");
    const labels = [`${player.hand_count}장`];
    if (player.user_id === selfUserId) labels.push("나");
    if (player.seat === currentSeat) labels.push("현재 턴");
    meta.textContent = labels.join(" · ");

    card.append(name, meta);
    root.append(card);
  }
}

function renderHand(cards) {
  const root = screen.querySelector("[data-online-hand]");
  root.replaceChildren();

  for (const card of [...cards].sort((a, b) => a - b)) {
    const item = document.createElement("div");
    item.className = "number-card online-number-card";
    item.textContent = String(card);
    item.setAttribute("aria-label", `내 카드 ${card}`);
    root.append(item);
  }
}

function render() {
  if (!snapshot?.game || !snapshot?.self) return;

  const { game, self, players = [] } = snapshot;
  const currentPlayer = players.find((player) => player.seat === game.current_seat);
  const turnLabel = self.is_current
    ? "내 턴"
    : `${currentPlayer?.nickname ?? `플레이어 ${game.current_seat}`}의 턴`;

  screen.querySelector("[data-online-turn]").textContent = turnLabel;
  screen.querySelector("[data-online-deck-count]").textContent = String(game.draw_count);
  screen.querySelector("[data-online-turn-progress]").textContent = `${game.turn_number}턴 · 최소 ${game.required_cards}장`;
  screen.querySelector("[data-online-game-message]").textContent = self.is_current
    ? "내 턴입니다. 손패가 다른 플레이어에게 노출되지 않는지 확인해 주세요."
    : "다른 플레이어의 턴입니다. 공용 상태는 실시간으로 동기화됩니다.";
  screen.querySelector("[data-online-piles]").innerHTML = game.piles.map(pileMarkup).join("");
  screen.querySelector("[data-online-hand-count]").textContent = `${self.hand_count}장`;

  renderHand(self.hand ?? []);
  renderPlayers(players, game.current_seat, self.user_id);
}

async function refresh() {
  if (!snapshot?.room?.id || !api) return;
  try {
    const next = await api.getGameSnapshot(snapshot.room.id);
    if (!next) return;
    snapshot = next;
    render();
  } catch (error) {
    screen.querySelector("[data-online-game-message]").textContent = error?.message ?? "게임 상태를 불러오지 못했습니다.";
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

export function openOnlineGame({ api: apiModule, gameSnapshot }) {
  api = apiModule;
  snapshot = gameSnapshot;
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
  if (screen) screen.hidden = true;
}
