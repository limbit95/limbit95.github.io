import { getAuthState, initializeAuth } from "../../js/auth.js";
import { getLobbySnapshot, getMyActiveRoom, lobbyCommands } from "./lobbyApi.js";
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

const DEMO_NOBLES = [
  { id: "n1", prestige: 3, requirements: { white: 4, blue: 4, black: 4 } },
  { id: "n2", prestige: 3, requirements: { green: 3, red: 3, black: 3 } },
  { id: "n3", prestige: 3, requirements: { white: 4, green: 4, red: 4 } },
  { id: "n4", prestige: 3, requirements: { blue: 3, green: 3, black: 3 } },
  { id: "n5", prestige: 3, requirements: { white: 3, blue: 3, red: 3 } },
];

const DEMO_CARDS = {
  3: [
    { id: "t3-1", tier: 3, bonus: "blue", prestige: 4, cost: { white: 3, green: 6, black: 3 } },
    { id: "t3-2", tier: 3, bonus: "red", prestige: 5, cost: { blue: 3, green: 3, black: 6 } },
    { id: "t3-3", tier: 3, bonus: "white", prestige: 4, cost: { blue: 7 } },
    { id: "t3-4", tier: 3, bonus: "black", prestige: 3, cost: { white: 3, blue: 3, red: 5, green: 3 } },
  ],
  2: [
    { id: "t2-1", tier: 2, bonus: "green", prestige: 2, cost: { white: 2, blue: 3, red: 2 } },
    { id: "t2-2", tier: 2, bonus: "black", prestige: 1, cost: { blue: 4, green: 2, red: 1 } },
    { id: "t2-3", tier: 2, bonus: "white", prestige: 2, cost: { green: 5, red: 3 } },
    { id: "t2-4", tier: 2, bonus: "blue", prestige: 1, cost: { white: 2, green: 2, red: 3 } },
  ],
  1: [
    { id: "t1-1", tier: 1, bonus: "red", prestige: 0, cost: { white: 1, blue: 1, green: 1, black: 1 } },
    { id: "t1-2", tier: 1, bonus: "blue", prestige: 0, cost: { green: 2, red: 1, black: 2 } },
    { id: "t1-3", tier: 1, bonus: "white", prestige: 1, cost: { blue: 4 } },
    { id: "t1-4", tier: 1, bonus: "green", prestige: 0, cost: { white: 2, blue: 1, red: 1, black: 1 } },
  ],
};

const MY_BONUSES = { white: 2, blue: 1, green: 3, red: 1, black: 1 };

const state = {
  screen: "welcome",
  nickname: "",
  joinCode: "",
  room: null,
  busy: false,
  error: "",
  realtimeStatus: "closed",
  selectedCardId: null,
  selectedTokens: new Set(),
  notice: "로비는 실제 Supabase와 연결됐습니다. 게임판의 카드 행동은 아직 UI 미리보기입니다.",
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
  return Array.from(name.trim())[0] ?? "?";
}

function gemDot(color) {
  const meta = GEM_META[color];
  return `<span class="gem-dot ${meta.className}" aria-label="${meta.label}"></span>`;
}

function renderCosts(cost = {}) {
  return Object.entries(cost)
    .filter(([, amount]) => amount > 0)
    .map(([color, amount]) => `<span class="cost-chip">${gemDot(color)}${amount}</span>`)
    .join("");
}

function allCards() {
  return Object.values(DEMO_CARDS).flat();
}

function selectedCard() {
  return allCards().find((card) => card.id === state.selectedCardId) ?? null;
}

function roomSnapshot() {
  return state.room;
}

function roomInfo() {
  return roomSnapshot()?.room ?? null;
}

function selfInfo() {
  return roomSnapshot()?.self ?? null;
}

function roomPlayers() {
  return Array.isArray(roomSnapshot()?.players) ? roomSnapshot().players : [];
}

function phaseBanner(mode = "lobby") {
  const board = mode === "board";
  return `
    <div class="prototype-banner">
      <span><strong>${board ? "PHASE 2 · BOARD PREVIEW" : "PHASE 2 · LIVE LOBBY"}</strong> · ${board ? "로비는 실데이터, 게임 행동은 다음 단계" : "방/참가자/준비 상태가 Supabase와 실시간 동기화됩니다"}</span>
      <span class="prototype-badge">${board ? "ENGINE PENDING" : "DB CONNECTED"}</span>
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
        <p class="hero-description">승인된 사이트 회원끼리 방을 만들고 실시간으로 준비 상태를 맞출 수 있습니다. 카드 구매·예약과 실제 턴 엔진은 다음 개발 단계에서 연결합니다.</p>
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
        <p class="subtle">닉네임은 사이트 프로필과 다르게 사용할 수 있고, 한 번에 하나의 스플렌더 방에만 참가할 수 있습니다.</p>
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
  return roomPlayers().map((player) => `
    <li class="player-row live-player-row${player.user_id === selfInfo()?.user_id ? " is-self" : ""}">
      <div class="player-identity">
        <span class="avatar">${escapeHtml(initials(player.nickname))}</span>
        <div>
          <strong>${escapeHtml(player.nickname)}${player.is_host ? " · 방장" : ""}${player.user_id === selfInfo()?.user_id ? " · 나" : ""}</strong>
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
  return "게임을 시작할 수 있는 준비 조건을 모두 충족했습니다.";
}

function roomView() {
  const snapshot = roomSnapshot();
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
          <button class="button button--primary button--block" type="button" data-board-preview ${room.can_start && !state.busy ? "" : "disabled"}>게임판 UI 미리보기</button>
          <p class="room-footnote">※ 실제 서버 게임 시작/카드 셔플은 다음 단계에서 이 버튼에 연결합니다.</p>
        ` : `<p class="room-footnote">방장이 시작 조건을 확인한 뒤 게임을 시작하게 됩니다.</p>`}
      </aside>
    </section>
  `;
}

function nobleCard(noble) {
  return `
    <article class="noble">
      <div class="noble__top">
        <strong>귀족</strong>
        <span class="prestige">${noble.prestige}</span>
      </div>
      <div class="requirements">${renderCosts(noble.requirements)}</div>
    </article>
  `;
}

function developmentCard(card) {
  const selected = state.selectedCardId === card.id ? " is-selected" : "";
  const meta = GEM_META[card.bonus];
  return `
    <button class="dev-card${selected}" type="button" data-card-id="${card.id}" aria-pressed="${state.selectedCardId === card.id}">
      <div class="dev-card__top">
        <span class="prestige">${card.prestige}</span>
        <span class="bonus-gem ${meta.className}" title="${meta.label} 영구 보너스"></span>
      </div>
      <p class="card-tier">TIER ${card.tier}</p>
      <div class="costs">${renderCosts(card.cost)}</div>
    </button>
  `;
}

function tierRows() {
  return [3, 2, 1].map((tier) => `
    <div class="tier-row">
      <div class="section-heading">
        <h3>${tier}단계 개발 카드</h3>
        <span class="section-meta">공개 4장</span>
      </div>
      <div class="card-row">${DEMO_CARDS[tier].map(developmentCard).join("")}</div>
    </div>
  `).join("");
}

function demoBank() {
  const count = roomInfo()?.player_count ?? 3;
  const normal = count <= 2 ? 4 : count === 3 ? 5 : 7;
  return { white: normal, blue: normal, green: normal, red: normal, black: normal, gold: 5 };
}

function tokenButton(color, count) {
  const meta = GEM_META[color];
  const selected = state.selectedTokens.has(color) ? " is-selected" : "";
  return `
    <button class="token-button${selected}" type="button" data-token="${color}" ${color === "gold" ? "disabled" : ""}>
      <span class="token-gem ${meta.className}">${count}</span>
      <span><strong>${meta.label}</strong><span class="token-count">${color === "gold" ? "예약 시 획득" : "선택 가능"}</span></span>
    </button>
  `;
}

function boardPlayers() {
  const players = roomPlayers();
  if (!players.length) {
    return [
      { nickname: "플레이어 1", seat: 1 },
      { nickname: "플레이어 2", seat: 2 },
      { nickname: "플레이어 3", seat: 3 },
    ];
  }
  return players;
}

function playerSummary() {
  return boardPlayers().map((player, index) => `
    <li class="player-row">
      <div class="player-identity">
        <span class="avatar">${escapeHtml(initials(player.nickname))}</span>
        <div>
          <strong>${escapeHtml(player.nickname)}${index === 0 ? " · 현재 턴" : ""}</strong>
          <p class="subtle">카드 ${Math.max(5, 8 - index)} · 예약 ${index % 3}</p>
        </div>
      </div>
      <span class="prestige">${Math.max(1, 7 - index * 2)}</span>
    </li>
  `).join("");
}

function selectionPanel() {
  const card = selectedCard();
  if (!card) {
    return `
      <div class="selection-box">
        <p class="selection-title">카드를 선택해보세요</p>
        <p class="selection-copy">카드 이미지를 눌러 비용과 보너스를 확인할 수 있습니다. 구매/예약은 아직 데모입니다.</p>
      </div>
    `;
  }

  return `
    <div class="selection-box">
      <p class="selection-title">${card.tier}단계 · ${GEM_META[card.bonus].label} 보너스 · ${card.prestige}점</p>
      <div class="costs">${renderCosts(card.cost)}</div>
      <div class="action-row">
        <button class="button button--primary" type="button" data-prototype-action="purchase">구매</button>
        <button class="button button--secondary" type="button" data-prototype-action="reserve">예약</button>
      </div>
    </div>
  `;
}

function boardView() {
  const bank = demoBank();
  const playerCount = roomInfo()?.player_count ?? 3;
  const nobles = DEMO_NOBLES.slice(0, Math.min(DEMO_NOBLES.length, playerCount + 1));
  const tokenSelection = [...state.selectedTokens].map((color) => GEM_META[color].label).join(" · ") || "선택 없음";
  const code = roomInfo()?.code ?? "PREVIEW";
  const firstPlayer = boardPlayers()[0]?.nickname ?? "플레이어";
  const me = selfInfo()?.nickname ?? state.nickname ?? "플레이어";
  return `
    ${phaseBanner("board")}
    <section class="board-shell">
      <header class="surface board-topbar">
        <div>
          <p class="eyebrow">STEP 3 · BOARD PREVIEW</p>
          <h1 class="page-title">스플렌더 · ${escapeHtml(code)}</h1>
        </div>
        <div class="turn-info"><span class="turn-dot"></span><strong>${escapeHtml(firstPlayer)}님의 턴</strong></div>
        <button class="button button--ghost" type="button" data-back-room>대기방으로</button>
      </header>

      <div class="board-layout">
        <div class="board-main">
          <section class="surface board-section">
            <div class="section-heading"><h2>👑 귀족</h2><span class="section-meta">${playerCount}인 기준 ${nobles.length}명</span></div>
            <div class="noble-row">${nobles.map(nobleCard).join("")}</div>
          </section>

          <section class="surface board-section tier-stack">
            ${tierRows()}
          </section>

          <section class="surface board-section">
            <div class="section-heading"><h2>💎 보석 공급처</h2><span class="section-meta">선택: ${tokenSelection}</span></div>
            <div class="token-bank">${Object.entries(bank).map(([color, count]) => tokenButton(color, count)).join("")}</div>
          </section>
        </div>

        <aside class="board-side">
          <section class="surface board-section">
            <div class="section-heading"><h2>플레이어</h2><span class="section-meta">${playerCount}명</span></div>
            <ul class="player-list">${playerSummary()}</ul>
          </section>

          <section class="surface board-section">
            <div class="section-heading"><h2>내 상태</h2><span class="section-meta">${escapeHtml(me)}</span></div>
            <div class="stat-grid">
              <div class="stat"><strong>7</strong><span>점수</span></div>
              <div class="stat"><strong>5</strong><span>토큰</span></div>
              <div class="stat"><strong>1</strong><span>예약</span></div>
            </div>
            <div class="bonus-list">
              ${Object.entries(MY_BONUSES).map(([color, count]) => `<div class="bonus-item">${gemDot(color)}<span>${count}</span></div>`).join("")}
            </div>
          </section>

          <section class="surface board-section">
            <div class="section-heading"><h2>선택한 카드</h2><span class="section-meta">UI 미리보기</span></div>
            ${selectionPanel()}
          </section>

          <p class="notice" id="prototype-notice">${escapeHtml(state.notice)}</p>
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
        state.room = await getLobbySnapshot(roomInfo().id);
      } catch {
        // Keep the original state-change message if refresh also fails.
      }
    }
    state.error = error?.message ?? "요청을 처리하지 못했습니다.";
  } finally {
    state.busy = false;
    render();
  }
}

async function attachRoom(snapshot) {
  state.room = snapshot;
  state.screen = "room";
  state.error = "";
  if (snapshot?.self?.nickname) state.nickname = snapshot.self.nickname;
  render();
  if (snapshot?.room?.id) {
    await subscribeRoomRealtime(snapshot.room.id, () => void refreshLobby(), (status) => {
      state.realtimeStatus = status;
      if (state.screen === "room") render();
    });
  }
}

async function refreshLobby() {
  const roomId = roomInfo()?.id;
  if (!roomId) return;
  try {
    const snapshot = await getLobbySnapshot(roomId);
    if (!snapshot) throw Object.assign(new Error("방이 종료되었습니다."), { code: "ROOM_NOT_FOUND" });
    state.room = snapshot;
    if (snapshot.self?.nickname) state.nickname = snapshot.self.nickname;
    if (state.screen === "room") render();
  } catch (error) {
    if (["PLAYER_NOT_MEMBER", "ROOM_NOT_FOUND"].includes(error?.code)) {
      await unsubscribeRoomRealtime();
      state.room = null;
      state.screen = "lobby";
      state.realtimeStatus = "closed";
    }
    state.error = error?.message ?? "방 상태를 갱신하지 못했습니다.";
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
    const self = selfInfo();
    state.room = await lobbyCommands.setReady(room.id, !self.is_ready, room.version);
  }));

  app.querySelector("[data-update-nickname]")?.addEventListener("click", () => {
    const nickname = app.querySelector("#room-nickname-input")?.value?.trim() ?? "";
    void withBusy(async () => {
      const room = roomInfo();
      state.room = await lobbyCommands.updateNickname(room.id, nickname, room.version);
      state.nickname = state.room?.self?.nickname ?? state.nickname;
    });
  });

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
      state.screen = "lobby";
      state.realtimeStatus = "closed";
      state.notice = "방에서 나왔습니다.";
    });
  });

  app.querySelector("[data-board-preview]")?.addEventListener("click", () => {
    if (!roomInfo()?.can_start) return;
    state.screen = "board";
    state.error = "";
    state.notice = "로비/준비 상태는 실제 데이터입니다. 카드 구매·예약·턴 진행은 아직 UI 미리보기입니다.";
    render();
  });

  app.querySelector("[data-back-room]")?.addEventListener("click", () => {
    state.screen = state.room ? "room" : "lobby";
    render();
  });

  app.querySelectorAll("[data-card-id]").forEach((cardButton) => {
    cardButton.addEventListener("click", () => {
      state.selectedCardId = state.selectedCardId === cardButton.dataset.cardId ? null : cardButton.dataset.cardId;
      state.notice = state.selectedCardId
        ? "카드를 선택했습니다. 구매/예약 RPC는 다음 게임 엔진 단계에서 연결합니다."
        : "카드 선택을 해제했습니다.";
      render();
    });
  });

  app.querySelectorAll("[data-token]").forEach((tokenButtonElement) => {
    tokenButtonElement.addEventListener("click", () => {
      const color = tokenButtonElement.dataset.token;
      if (state.selectedTokens.has(color)) {
        state.selectedTokens.delete(color);
      } else if (state.selectedTokens.size < 3) {
        state.selectedTokens.add(color);
      } else {
        state.notice = "UI 미리보기에서는 서로 다른 보석을 최대 3개까지 선택할 수 있습니다.";
      }
      render();
    });
  });

  app.querySelectorAll("[data-prototype-action]").forEach((button) => {
    button.addEventListener("click", () => {
      state.notice = button.dataset.prototypeAction === "purchase"
        ? "구매 기능은 다음 단계에서 실제 비용·보너스·금 토큰 계산 RPC와 함께 연결합니다."
        : "예약 기능은 다음 단계에서 예약 한도와 금 토큰 지급 RPC와 함께 연결합니다.";
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
    state.error = error?.message ?? "스플렌더 로비를 초기화하지 못했습니다.";
    state.screen = "lobby";
    render();
  }
}

void bootstrap();