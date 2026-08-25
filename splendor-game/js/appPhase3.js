import { getAuthState, initializeAuth } from "../../js/auth.js";
import { getLobbySnapshot, getMyActiveRoom, lobbyCommands } from "./lobbyApi.js";
import { getGameSnapshot, gameCommands } from "./gameApi.js";
import { subscribeRoomRealtime, unsubscribeRoomRealtime } from "./realtime.js";

const app = document.querySelector("#app");

const GEM_META = {
  white: { label: "흰색", className: "gem--white" },
  blue: { label: "파랑", className: "gem--blue" },
  green: { label: "초록", className: "gem--green" },
  red: { label: "빨강", className: "gem--red" },
  black: { label: "검정", className: "gem--black" },
  gold: { label: "금", className: "gem--gold" },
};

const NORMAL_GEMS = ["white", "blue", "green", "red", "black"];

const state = {
  screen: "welcome",
  nickname: "",
  joinCode: "",
  room: null,
  game: null,
  busy: false,
  error: "",
  realtimeStatus: "closed",
  selectedCardId: null,
  notice: "게임 시작과 초기 보드 세팅은 실제 서버 데이터입니다. 턴 행동은 다음 단계에서 연결합니다.",
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function initials(name = "?") {
  return Array.from(String(name).trim())[0] ?? "?";
}

function gemDot(color) {
  const meta = GEM_META[color] ?? GEM_META.blue;
  return `<span class="gem-dot ${meta.className}" aria-label="${meta.label}"></span>`;
}

function renderCosts(cost = {}) {
  return Object.entries(cost)
    .filter(([, amount]) => Number(amount) > 0)
    .map(([color, amount]) => `<span class="cost-chip">${gemDot(color)}${Number(amount)}</span>`)
    .join("");
}

function roomInfo() {
  return state.room?.room ?? null;
}

function selfRoomInfo() {
  return state.room?.self ?? null;
}

function roomPlayers() {
  return Array.isArray(state.room?.players) ? state.room.players : [];
}

function gameInfo() {
  return state.game?.game ?? null;
}

function gamePlayers() {
  return Array.isArray(state.game?.players) ? state.game.players : [];
}

function selfGameInfo() {
  return state.game?.self ?? null;
}

function visibleCards() {
  return Array.isArray(state.game?.cards) ? state.game.cards : [];
}

function nobles() {
  return Array.isArray(state.game?.nobles) ? state.game.nobles : [];
}

function selectedCard() {
  return visibleCards().find((card) => card.instance_id === state.selectedCardId) ?? null;
}

function phaseBanner(mode = "lobby") {
  const board = mode === "board";
  return `
    <div class="prototype-banner">
      <span><strong>${board ? "PHASE 3 · LIVE GAME SETUP" : "PHASE 3 · LIVE LOBBY"}</strong> · ${board ? "카드·귀족·보석·선 플레이어가 서버에서 생성됩니다" : "방/준비 상태가 Supabase와 실시간 동기화됩니다"}</span>
      <span class="prototype-badge">${board ? "SERVER SETUP" : "DB CONNECTED"}</span>
    </div>
  `;
}

function errorBox() {
  return state.error ? `<div class="lobby-error" role="alert">${escapeHtml(state.error)}</div>` : "";
}

function welcomeView() {
  return `
    ${phaseBanner()}
    <section class="surface hero">
      <div class="hero-copy">
        <p class="eyebrow">GEM ENGINE · MULTIPLAYER</p>
        <h1>스플렌더</h1>
        <p class="hero-description">승인된 회원끼리 방을 만들고 실제 서버에서 카드 덱, 귀족, 보석 공급량과 선 플레이어까지 세팅할 수 있습니다. 구매·예약·보석 획득은 다음 단계에서 연결합니다.</p>
        <div class="hero-actions">
          <button class="button button--primary" type="button" data-go="lobby">게임 로비 열기</button>
          <a class="button button--secondary" href="../#/games">게임 목록으로</a>
        </div>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <div class="gem-orbit">
          <div class="gem-orbit__center">♛</div>
          <span class="orbit-gem gem--white"></span>
          <span class="orbit-gem gem--blue"></span>
          <span class="orbit-gem gem--green"></span>
          <span class="orbit-gem gem--red"></span>
          <span class="orbit-gem gem--black"></span>
        </div>
      </div>
    </section>
  `;
}

function lobbyView() {
  return `
    ${phaseBanner()}
    <header class="page-header">
      <div>
        <p class="eyebrow">STEP 1 · LIVE LOBBY</p>
        <h1 class="page-title">게임 로비</h1>
        <p class="subtle">닉네임은 사이트 프로필과 별도로 사용할 수 있고, 한 번에 하나의 스플렌더 방에만 참가할 수 있습니다.</p>
      </div>
      <button class="button button--ghost" type="button" data-go="welcome">처음으로</button>
    </header>
    ${errorBox()}
    <section class="lobby-profile surface panel">
      <div>
        <span class="badge">GAME IDENTITY</span>
        <h2>게임 닉네임</h2>
        <p class="panel-copy">방을 만들거나 참가할 때 사용할 이름입니다.</p>
      </div>
      <label class="field-label">닉네임
        <input class="input" id="nickname-input" maxlength="20" autocomplete="off" value="${escapeHtml(state.nickname)}" ${state.busy ? "disabled" : ""}>
      </label>
    </section>
    <section class="flow-grid lobby-flow-grid">
      <article class="surface panel">
        <span class="badge">HOST</span>
        <h2>새 게임방 만들기</h2>
        <p class="panel-copy">최대 4명이 참가할 수 있는 비공개 방을 만들고 6자리 코드를 공유합니다.</p>
        <button class="button button--primary button--block" type="button" data-create-room ${state.busy ? "disabled" : ""}>${state.busy ? "처리 중…" : "새 방 만들기"}</button>
      </article>
      <article class="surface panel">
        <span class="badge">JOIN</span>
        <h2>방 코드로 참가</h2>
        <p class="panel-copy">방장에게 받은 6자리 코드를 입력하세요.</p>
        <input class="input room-code-input" id="room-code-input" type="text" maxlength="6" autocomplete="off" placeholder="예: A7KM2Q" value="${escapeHtml(state.joinCode)}" ${state.busy ? "disabled" : ""}>
        <button class="button button--secondary button--block" type="button" data-join-room ${state.busy ? "disabled" : ""}>${state.busy ? "처리 중…" : "방 참가하기"}</button>
      </article>
    </section>
  `;
}

function realtimeLabel() {
  const labels = {
    connecting: ["연결 중", "is-connecting"],
    subscribed: ["실시간 연결", "is-online"],
    error: ["연결 오류", "is-error"],
    closed: ["연결 종료", ""],
  };
  const [label, className] = labels[state.realtimeStatus] ?? labels.closed;
  return `<span class="realtime-status ${className}"><span></span>${label}</span>`;
}

function livePlayerRows() {
  const self = selfRoomInfo();
  return roomPlayers().map((player) => `
    <li class="player-row live-player-row${player.user_id === self?.user_id ? " is-self" : ""}">
      <div class="player-identity">
        <span class="avatar">${escapeHtml(initials(player.nickname))}</span>
        <div>
          <strong>${escapeHtml(player.nickname)}${player.is_host ? " · 방장" : ""}${player.user_id === self?.user_id ? " · 나" : ""}</strong>
          <p class="subtle">좌석 ${player.seat}</p>
        </div>
      </div>
      <span class="ready ${player.is_ready ? "is-ready" : "is-waiting"}">${player.is_ready ? "✓ 준비 완료" : "준비 중"}</span>
    </li>
  `).join("");
}

function startConditionCopy(room) {
  if (room.player_count < 2) return "게임 시작에는 최소 2명이 필요합니다.";
  if (!room.all_ready) return "모든 참가자가 준비 완료해야 합니다.";
  return "게임 시작 조건을 모두 충족했습니다.";
}

function roomView() {
  const snapshot = state.room;
  if (!snapshot?.room || !snapshot?.self) {
    return `${phaseBanner()}<section class="surface loading-card"><p>대기방 상태를 불러오고 있습니다…</p></section>`;
  }

  const room = snapshot.room;
  const self = snapshot.self;
  return `
    ${phaseBanner()}
    <header class="page-header room-page-header">
      <div>
        <p class="eyebrow">STEP 2 · LIVE ROOM</p>
        <h1 class="page-title">대기방 · ${escapeHtml(room.code)}</h1>
        <div class="room-header-meta">${realtimeLabel()}<span>플레이어 ${room.player_count} / ${room.max_players}</span><span>v${room.version}</span></div>
      </div>
      <button class="button button--ghost" type="button" data-leave-room ${state.busy ? "disabled" : ""}>방 나가기</button>
    </header>
    ${errorBox()}
    <section class="room-code-card surface">
      <div>
        <span class="badge">ROOM CODE</span>
        <strong class="room-code-value">${escapeHtml(room.code)}</strong>
        <p>친구에게 이 코드를 공유하면 같은 방으로 참가할 수 있어요.</p>
      </div>
      <button class="button button--secondary" type="button" data-copy-code>코드 복사</button>
    </section>
    <section class="room-layout live-room-layout">
      <article class="surface panel">
        <div class="section-heading">
          <h2>플레이어</h2>
          <span class="section-meta">${room.player_count} / ${room.max_players}</span>
        </div>
        <ul class="player-list">${livePlayerRows()}</ul>
      </article>
      <aside class="surface panel room-control-panel">
        <span class="badge">MY STATUS</span>
        <h2>${self.is_ready ? "준비 완료" : "게임 준비"}</h2>
        <p class="panel-copy">준비 상태와 닉네임 변경은 다른 참가자 화면에도 실시간으로 반영됩니다.</p>
        <label class="field-label">내 닉네임
          <div class="inline-field">
            <input class="input" id="room-nickname-input" maxlength="20" autocomplete="off" value="${escapeHtml(self.nickname)}" ${state.busy ? "disabled" : ""}>
            <button class="button button--secondary" type="button" data-update-nickname ${state.busy ? "disabled" : ""}>변경</button>
          </div>
        </label>
        <button class="button ${self.is_ready ? "button--secondary" : "button--primary"} button--block" type="button" data-toggle-ready ${state.busy ? "disabled" : ""}>${self.is_ready ? "준비 취소" : "준비 완료"}</button>
        <div class="start-status ${room.can_start ? "is-ready" : ""}">
          <strong>${room.can_start ? "✓ 시작 조건 충족" : "시작 조건 확인 중"}</strong>
          <span>${startConditionCopy(room)}</span>
        </div>
        ${self.is_host ? `
          <button class="button button--primary button--block" type="button" data-start-game ${room.can_start && !state.busy ? "" : "disabled"}>${state.busy ? "게임 준비 중…" : "게임 시작"}</button>
          <p class="room-footnote">서버가 덱을 셔플하고 공개 카드·귀족·보석을 한 번에 세팅합니다.</p>
        ` : `<p class="room-footnote">방장이 게임을 시작하면 자동으로 게임판으로 이동합니다.</p>`}
      </aside>
    </section>
  `;
}

function nobleCard(noble) {
  return `
    <article class="noble">
      <div class="noble__top">
        <strong>${escapeHtml(noble.title || "귀족")}</strong>
        <span class="prestige">${Number(noble.prestige || 0)}</span>
      </div>
      <div class="requirements">${renderCosts(noble.requirements)}</div>
    </article>
  `;
}

function developmentCard(card) {
  const selected = state.selectedCardId === card.instance_id ? " is-selected" : "";
  const meta = GEM_META[card.bonus] ?? GEM_META.blue;
  return `
    <button class="dev-card${selected}" type="button"
      data-card-id="${escapeHtml(card.instance_id)}"
      data-card-key="${escapeHtml(card.card_key)}"
      data-card-tier="${Number(card.tier)}"
      data-card-bonus="${escapeHtml(card.bonus)}"
      data-card-title="${escapeHtml(card.title || "개발 카드")}"
      data-image-path="${escapeHtml(card.image_path || "")}"
      aria-label="${escapeHtml(card.title || "개발 카드")}"
      aria-pressed="${state.selectedCardId === card.instance_id}">
      <div class="dev-card__top">
        <span class="prestige">${Number(card.prestige || 0)}</span>
        <span class="bonus-gem ${meta.className}" title="${meta.label} 영구 보너스"></span>
      </div>
      <p class="card-tier">TIER ${Number(card.tier)}</p>
      <div class="costs">${renderCosts(card.cost)}</div>
    </button>
  `;
}

function tierRows() {
  const deckCounts = state.game?.decks ?? {};
  return [3, 2, 1].map((tier) => {
    const cards = visibleCards().filter((card) => Number(card.tier) === tier).sort((a, b) => Number(a.slot) - Number(b.slot));
    return `
      <div class="tier-row">
        <div class="section-heading">
          <h3>${tier}단계 개발 카드</h3>
          <span class="section-meta">공개 ${cards.length}장 · 덱 ${Number(deckCounts[String(tier)] ?? 0)}장</span>
        </div>
        <div class="card-row">${cards.map(developmentCard).join("")}</div>
      </div>
    `;
  }).join("");
}

function tokenDisplay(color, count) {
  const meta = GEM_META[color] ?? GEM_META.blue;
  return `
    <button class="token-button" type="button" disabled>
      <span class="token-gem ${meta.className}">${Number(count || 0)}</span>
      <span><strong>${meta.label}</strong><span class="token-count">턴 행동은 다음 단계</span></span>
    </button>
  `;
}

function playerSummary() {
  const me = selfGameInfo();
  return gamePlayers().map((player) => `
    <li class="player-row${player.user_id === me?.user_id ? " is-self" : ""}">
      <div class="player-identity">
        <span class="avatar">${escapeHtml(initials(player.nickname))}</span>
        <div>
          <strong>${escapeHtml(player.nickname)}${player.is_current_turn ? " · 현재 턴" : ""}${player.user_id === me?.user_id ? " · 나" : ""}</strong>
          <p class="subtle">카드 ${Number(player.purchased_card_count || 0)} · 예약 ${Number(player.reserved_card_count || 0)}</p>
        </div>
      </div>
      <span class="prestige">${Number(player.score || 0)}</span>
    </li>
  `).join("");
}

function totalTokens(tokens = {}) {
  return Object.values(tokens).reduce((sum, value) => sum + Number(value || 0), 0);
}

function bonusList(bonuses = {}) {
  return NORMAL_GEMS.map((color) => `<div class="bonus-item">${gemDot(color)}<span>${Number(bonuses[color] || 0)}</span></div>`).join("");
}

function selectionPanel() {
  const card = selectedCard();
  if (!card) {
    return `
      <div class="selection-box">
        <p class="selection-title">카드를 선택해보세요</p>
        <p class="selection-copy">지금 보이는 카드와 비용은 서버가 실제로 셔플해 공개한 테스트 룰셋 데이터입니다.</p>
      </div>
    `;
  }
  return `
    <div class="selection-box">
      <p class="selection-title">${escapeHtml(card.title)} · ${Number(card.prestige)}점 · ${GEM_META[card.bonus]?.label ?? card.bonus} 보너스</p>
      <div class="costs">${renderCosts(card.cost)}</div>
      <p class="selection-copy">구매와 예약은 다음 Phase에서 서버 RPC로 연결합니다.</p>
      <div class="action-row">
        <button class="button button--primary" type="button" disabled>구매 · 다음 Phase</button>
        <button class="button button--secondary" type="button" disabled>예약 · 다음 Phase</button>
      </div>
    </div>
  `;
}

function boardView() {
  const game = gameInfo();
  const me = selfGameInfo();
  if (!game || !me) {
    return `${phaseBanner("board")}<section class="surface loading-card"><p>게임 상태를 불러오고 있습니다…</p></section>`;
  }
  const currentPlayer = gamePlayers().find((player) => player.is_current_turn);
  const bank = game.bank_tokens ?? {};
  return `
    ${phaseBanner("board")}
    <section class="board-shell">
      <header class="surface board-topbar">
        <div>
          <p class="eyebrow">STEP 3 · LIVE GAME BOARD</p>
          <h1 class="page-title">스플렌더 · ${escapeHtml(game.room_code)}</h1>
          <p class="subtle">테스트 룰셋 ${escapeHtml(game.ruleset_key)} · 목표 ${Number(game.target_score)}점 · 게임 v${Number(game.version)}</p>
        </div>
        <div class="turn-info"><span class="turn-dot"></span><strong>${escapeHtml(currentPlayer?.nickname || "플레이어")}님의 턴 · ${Number(game.turn_no)}턴</strong></div>
        <a class="button button--ghost" href="../#/games">게임 목록</a>
      </header>
      ${errorBox()}

      <div class="board-layout">
        <div class="board-main">
          <section class="surface board-section">
            <div class="section-heading"><h2>👑 귀족</h2><span class="section-meta">${nobles().length}명 선택됨</span></div>
            <div class="noble-row">${nobles().map(nobleCard).join("")}</div>
          </section>

          <section class="surface board-section tier-stack">
            ${tierRows()}
          </section>

          <section class="surface board-section">
            <div class="section-heading"><h2>💎 보석 공급처</h2><span class="section-meta">인원수 기준 실제 초기 수량</span></div>
            <div class="token-bank">${Object.entries(bank).map(([color, count]) => tokenDisplay(color, count)).join("")}</div>
          </section>
        </div>

        <aside class="board-side">
          <section class="surface board-section">
            <div class="section-heading"><h2>플레이어</h2><span class="section-meta">${gamePlayers().length}명</span></div>
            <ul class="player-list">${playerSummary()}</ul>
          </section>

          <section class="surface board-section">
            <div class="section-heading"><h2>내 상태</h2><span class="section-meta">${escapeHtml(me.nickname)}</span></div>
            <div class="stat-grid">
              <div class="stat"><strong>${Number(me.score || 0)}</strong><span>점수</span></div>
              <div class="stat"><strong>${totalTokens(me.tokens)}</strong><span>토큰</span></div>
              <div class="stat"><strong>${Number(me.reserved_card_count || 0)}</strong><span>예약</span></div>
            </div>
            <div class="bonus-list">${bonusList(me.bonuses)}</div>
          </section>

          <section class="surface board-section">
            <div class="section-heading"><h2>선택한 카드</h2><span class="section-meta">서버 공개 카드</span></div>
            ${selectionPanel()}
          </section>

          <p class="notice">${escapeHtml(state.notice)}</p>
        </aside>
      </div>
    </section>
  `;
}

function render() {
  const views = {
    welcome: welcomeView,
    lobby: lobbyView,
    room: roomView,
    board: boardView,
  };
  app.innerHTML = (views[state.screen] ?? welcomeView)();
  bindEvents();
}

function syncLobbyInputs() {
  const nickname = app.querySelector("#nickname-input");
  if (nickname) state.nickname = nickname.value.trim();
  const code = app.querySelector("#room-code-input");
  if (code) state.joinCode = code.value.trim().toUpperCase();
}

async function withBusy(action) {
  if (state.busy) return;
  syncLobbyInputs();
  state.busy = true;
  state.error = "";
  render();
  try {
    await action();
  } catch (error) {
    if (error?.code === "STATE_CHANGED" && roomInfo()?.id) {
      try {
        await refreshState();
      } catch {
        // Keep original error if the refresh also fails.
      }
    }
    state.error = error?.message ?? "요청을 처리하지 못했습니다.";
  } finally {
    state.busy = false;
    render();
  }
}

async function loadGameForRoom(roomId) {
  state.game = await getGameSnapshot(roomId);
  state.screen = "board";
}

async function attachRoom(snapshot) {
  state.room = snapshot;
  state.error = "";
  if (snapshot?.self?.nickname) state.nickname = snapshot.self.nickname;

  if (snapshot?.room?.status === "playing") {
    await loadGameForRoom(snapshot.room.id);
  } else {
    state.game = null;
    state.screen = "room";
  }
  render();

  if (snapshot?.room?.id) {
    await subscribeRoomRealtime(snapshot.room.id, () => void refreshState(), (status) => {
      state.realtimeStatus = status;
      if (state.screen === "room" || state.screen === "board") render();
    });
  }
}

async function refreshState() {
  const roomId = roomInfo()?.id;
  if (!roomId) return;
  try {
    const snapshot = await getLobbySnapshot(roomId);
    if (!snapshot) throw Object.assign(new Error("방이 종료되었습니다."), { code: "ROOM_NOT_FOUND" });
    state.room = snapshot;
    if (snapshot.self?.nickname) state.nickname = snapshot.self.nickname;

    if (snapshot.room?.status === "playing") {
      state.game = await getGameSnapshot(roomId);
      state.screen = "board";
    } else {
      state.game = null;
      state.screen = "room";
    }
    render();
  } catch (error) {
    if (["PLAYER_NOT_MEMBER", "ROOM_NOT_FOUND"].includes(error?.code)) {
      await unsubscribeRoomRealtime();
      state.room = null;
      state.game = null;
      state.screen = "lobby";
      state.realtimeStatus = "closed";
    }
    state.error = error?.message ?? "게임 상태를 갱신하지 못했습니다.";
    render();
  }
}

function bindEvents() {
  app.querySelectorAll("[data-go]").forEach((button) => {
    button.addEventListener("click", () => {
      state.screen = button.dataset.go;
      state.error = "";
      render();
    });
  });

  app.querySelector("#room-code-input")?.addEventListener("input", (event) => {
    event.target.value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  });

  app.querySelector("[data-create-room]")?.addEventListener("click", () => withBusy(async () => {
    const snapshot = await lobbyCommands.createRoom(state.nickname);
    await attachRoom(snapshot);
  }));

  app.querySelector("[data-join-room]")?.addEventListener("click", () => withBusy(async () => {
    const snapshot = await lobbyCommands.joinRoom(state.joinCode, state.nickname);
    await attachRoom(snapshot);
  }));

  app.querySelector("[data-toggle-ready]")?.addEventListener("click", () => withBusy(async () => {
    const room = roomInfo();
    const self = selfRoomInfo();
    state.room = await lobbyCommands.setReady(room.id, !self.is_ready, room.version);
  }));

  app.querySelector("[data-update-nickname]")?.addEventListener("click", () => {
    const nextNickname = app.querySelector("#room-nickname-input")?.value?.trim() ?? "";
    void withBusy(async () => {
      const room = roomInfo();
      state.room = await lobbyCommands.updateNickname(room.id, nextNickname, room.version);
      state.nickname = state.room?.self?.nickname ?? state.nickname;
    });
  });

  app.querySelector("[data-start-game]")?.addEventListener("click", () => withBusy(async () => {
    const room = roomInfo();
    state.game = await gameCommands.start(room.id, room.version);
    state.room = await getLobbySnapshot(room.id);
    state.screen = "board";
    state.notice = "초기 게임판이 서버에서 생성되었습니다. 보석 획득·구매·예약은 다음 Phase에서 연결합니다.";
  }));

  app.querySelector("[data-copy-code]")?.addEventListener("click", async () => {
    const code = roomInfo()?.code;
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      state.error = "";
      state.notice = `방 코드 ${code}를 복사했습니다.`;
    } catch {
      state.error = `복사하지 못했습니다. 방 코드: ${code}`;
    }
    render();
  });

  app.querySelector("[data-leave-room]")?.addEventListener("click", () => {
    if (!window.confirm("현재 스플렌더 방에서 나갈까요? 방장이라면 다음 참가자에게 방장이 넘어갑니다.")) return;
    void withBusy(async () => {
      const room = roomInfo();
      await lobbyCommands.leaveRoom(room.id, room.version);
      await unsubscribeRoomRealtime();
      state.room = null;
      state.game = null;
      state.screen = "lobby";
      state.realtimeStatus = "closed";
    });
  });

  app.querySelectorAll("[data-card-id]").forEach((cardButton) => {
    cardButton.addEventListener("click", () => {
      state.selectedCardId = state.selectedCardId === cardButton.dataset.cardId ? null : cardButton.dataset.cardId;
      render();
    });
  });
}

async function bootstrap() {
  try {
    await initializeAuth();
    const auth = getAuthState();
    if (!auth.isApproved) return;

    state.nickname = auth.profile?.display_name?.trim()
      || auth.user?.email?.split("@")[0]
      || "플레이어";

    const activeRoom = await getMyActiveRoom();
    if (activeRoom?.room?.id) {
      await attachRoom(activeRoom);
    } else {
      render();
    }
  } catch (error) {
    state.error = error?.message ?? "스플렌더를 초기화하지 못했습니다.";
    state.screen = "lobby";
    render();
  }
}

void bootstrap();
