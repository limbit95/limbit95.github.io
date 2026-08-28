const NICKNAME_STORAGE_KEY = "the-game-online-nickname";

let api = null;
let supabaseClient = null;
let onlineGameModule = null;
let views = null;
let snapshot = null;
let unsubscribeLobby = null;
let refreshTimer = null;
let reconnectTimer = null;
let busy = false;
let lobbyOpen = false;
let networkEventsBound = false;

function ensureSupabaseLibrary() {
  if (window.supabase?.createClient) return Promise.resolve();

  const existing = document.querySelector("script[data-the-game-supabase]");
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", () => reject(new Error("Supabase 라이브러리를 불러오지 못했습니다.")), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    script.async = true;
    script.dataset.theGameSupabase = "true";
    script.addEventListener("load", resolve, { once: true });
    script.addEventListener("error", () => reject(new Error("Supabase 라이브러리를 불러오지 못했습니다.")), { once: true });
    document.head.append(script);
  });
}

async function ensureOnlineModules() {
  if (api && supabaseClient) return;
  await ensureSupabaseLibrary();
  const [apiModule, supabaseModule] = await Promise.all([
    import("./multiplayerApi.js"),
    import("./supabase.js"),
  ]);
  api = apiModule;
  supabaseClient = supabaseModule.supabase;
}

async function ensureOnlineGameModule() {
  onlineGameModule ??= await import("./onlineGame.js");
  return onlineGameModule;
}

function createViews() {
  if (views) return views;

  const shell = document.querySelector(".app-shell");
  if (!shell) throw new Error("The Game app shell was not found.");

  const online = document.createElement("section");
  online.id = "online-entry-screen";
  online.className = "screen online-screen";
  online.hidden = true;
  online.innerHTML = `
    <header class="online-header">
      <button class="ghost-button" type="button" data-online-back>← 돌아가기</button>
      <div>
        <p class="eyebrow">ONLINE LOBBY</p>
        <h1>온라인 플레이</h1>
      </div>
    </header>
    <div class="online-status-card" data-online-loading role="status">로그인 상태와 참여 중인 방을 확인하고 있습니다…</div>
    <section class="online-status-card" data-auth-gate hidden>
      <strong>청파 같이 로그인이 필요합니다.</strong>
      <p>온라인 플레이는 로그인한 승인 회원만 사용할 수 있어요. 한 기기 플레이는 로그인 없이도 가능합니다.</p>
      <a class="primary-button button-link" href="../#/login">로그인하러 가기</a>
    </section>
    <div data-online-controls hidden>
      <label class="field-label" for="the-game-online-nickname">게임 닉네임</label>
      <input id="the-game-online-nickname" class="text-input" type="text" maxlength="20" autocomplete="nickname" placeholder="닉네임을 입력하세요">
      <div class="online-action-grid">
        <form class="online-action-card" data-create-room-form>
          <p class="eyebrow">CREATE</p>
          <h2>새 방 만들기</h2>
          <label class="field-label" for="the-game-max-players">최대 인원</label>
          <select id="the-game-max-players" class="text-input" name="max-players">
            <option value="2">2명</option>
            <option value="3" selected>3명</option>
            <option value="4">4명</option>
            <option value="5">5명</option>
          </select>
          <button class="primary-button" type="submit">방 만들기</button>
        </form>
        <form class="online-action-card" data-join-room-form>
          <p class="eyebrow">JOIN</p>
          <h2>방 코드로 참가</h2>
          <label class="field-label" for="the-game-room-code">6자리 방 코드</label>
          <input id="the-game-room-code" class="text-input room-code-input" name="room-code" type="text" maxlength="6" autocomplete="off" placeholder="ABC234">
          <button class="primary-button" type="submit">방 참가하기</button>
        </form>
      </div>
    </div>
    <p class="online-message" data-online-message role="alert" aria-live="polite"></p>
  `;

  const lobby = document.createElement("section");
  lobby.id = "lobby-screen";
  lobby.className = "screen lobby-screen";
  lobby.hidden = true;
  lobby.innerHTML = `
    <header class="lobby-header">
      <div>
        <p class="eyebrow">WAITING ROOM</p>
        <h1>게임 대기방</h1>
      </div>
      <button class="ghost-button" type="button" data-leave-room>방 나가기</button>
    </header>
    <section class="room-code-card" aria-label="방 코드">
      <span>ROOM CODE</span>
      <strong data-room-code>------</strong>
      <button class="ghost-button" type="button" data-copy-code>코드 복사</button>
    </section>
    <div class="lobby-meta">
      <span data-player-count>0 / 3명</span>
      <span data-connection-status>실시간 연결 준비 중</span>
    </div>
    <section class="lobby-players-panel" aria-labelledby="the-game-lobby-players-title">
      <div class="hand-header">
        <div>
          <p class="eyebrow">PLAYERS</p>
          <h2 id="the-game-lobby-players-title">참가자</h2>
        </div>
      </div>
      <ol class="lobby-player-list" data-player-list></ol>
    </section>
    <div class="lobby-actions">
      <button class="primary-button" type="button" data-ready>준비하기</button>
      <button class="primary-button secondary-disabled" type="button" data-start disabled>모두 준비되면 게임 시작</button>
    </div>
    <p class="online-message" data-lobby-message role="alert" aria-live="polite"></p>
  `;

  const firstScreen = shell.querySelector(".screen");
  shell.insertBefore(online, firstScreen);
  shell.insertBefore(lobby, firstScreen);

  views = {
    online,
    lobby,
    loading: online.querySelector("[data-online-loading]"),
    authGate: online.querySelector("[data-auth-gate]"),
    controls: online.querySelector("[data-online-controls]"),
    nickname: online.querySelector("#the-game-online-nickname"),
    createForm: online.querySelector("[data-create-room-form]"),
    joinForm: online.querySelector("[data-join-room-form]"),
    roomCodeInput: online.querySelector("#the-game-room-code"),
    onlineMessage: online.querySelector("[data-online-message]"),
    backButton: online.querySelector("[data-online-back]"),
    roomCode: lobby.querySelector("[data-room-code]"),
    playerCount: lobby.querySelector("[data-player-count]"),
    connectionStatus: lobby.querySelector("[data-connection-status]"),
    playerList: lobby.querySelector("[data-player-list]"),
    readyButton: lobby.querySelector("[data-ready]"),
    startButton: lobby.querySelector("[data-start]"),
    leaveButton: lobby.querySelector("[data-leave-room]"),
    copyButton: lobby.querySelector("[data-copy-code]"),
    lobbyMessage: lobby.querySelector("[data-lobby-message]"),
  };

  bindEvents();
  bindNetworkEvents();
  return views;
}

function setMessage(element, message = "") {
  if (element) element.textContent = message;
}

function friendlyError(error) {
  const message = error?.message ?? String(error ?? "");
  const mappings = [
    ["AUTH_REQUIRED", "온라인 플레이는 로그인한 승인 회원만 사용할 수 있습니다."],
    ["INVALID_NICKNAME", "닉네임은 1~20자로 입력해 주세요."],
    ["INVALID_MAX_PLAYERS", "최대 인원 설정을 확인해 주세요."],
    ["ROOM_NOT_FOUND", "방 코드를 찾을 수 없어요. 코드를 다시 확인해 주세요."],
    ["ROOM_ALREADY_STARTED", "이미 게임이 시작된 방입니다."],
    ["ROOM_FULL", "방의 최대 인원이 모두 찼습니다."],
    ["ACTIVE_ROOM_EXISTS", "이미 참여 중인 더 게임 방이 있습니다. 온라인 플레이를 다시 열어 기존 방으로 복귀해 주세요."],
    ["PLAYER_NOT_MEMBER", "이 방에 참여 중인 플레이어가 아닙니다."],
    ["HOST_REQUIRED", "게임 시작은 방장만 할 수 있습니다."],
    ["INVALID_PLAYER_COUNT", "온라인 게임은 2명 이상이 모여야 시작할 수 있습니다."],
    ["PLAYERS_NOT_READY", "모든 참가자가 준비 완료 상태여야 시작할 수 있습니다."],
    ["STATE_CHANGED", "다른 플레이어의 변경사항이 먼저 반영됐습니다. 최신 상태를 불러왔으니 다시 시도해 주세요."],
  ];

  return mappings.find(([code]) => message.includes(code))?.[1]
    ?? "온라인 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.";
}

function nicknameValue() {
  return views.nickname.value.trim();
}

function saveNickname() {
  const nickname = nicknameValue();
  if (nickname) localStorage.setItem(NICKNAME_STORAGE_KEY, nickname);
  return nickname;
}

function setBusy(nextBusy) {
  busy = nextBusy;
  for (const button of views.online.querySelectorAll("button")) button.disabled = nextBusy;
  views.readyButton.disabled = nextBusy;
  views.leaveButton.disabled = nextBusy;
  views.startButton.disabled = nextBusy || !(snapshot?.room?.can_start && snapshot?.self?.is_host);
}

function closeSubscription() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (unsubscribeLobby) {
    unsubscribeLobby();
    unsubscribeLobby = null;
  }
}

function bindNetworkEvents() {
  if (networkEventsBound) return;
  networkEventsBound = true;

  window.addEventListener("offline", () => {
    if (!lobbyOpen || !views) return;
    views.connectionStatus.textContent = "오프라인 · 네트워크 연결을 기다리는 중";
  });

  window.addEventListener("online", () => {
    if (!lobbyOpen || !views) return;
    views.connectionStatus.textContent = "네트워크 복구 중…";
    scheduleLobbyReconnect(80);
  });
}

function showOnlineEntry() {
  lobbyOpen = false;
  snapshot = null;
  closeSubscription();
  onlineGameModule?.closeOnlineGame?.();
  views.lobby.hidden = true;
  views.online.hidden = false;
  views.loading.hidden = true;
  views.authGate.hidden = true;
  views.controls.hidden = false;
  views.nickname.value = localStorage.getItem(NICKNAME_STORAGE_KEY) ?? views.nickname.value;
  setMessage(views.lobbyMessage);
}

function returnToMode() {
  lobbyOpen = false;
  closeSubscription();
  onlineGameModule?.closeOnlineGame?.();
  views.online.hidden = true;
  views.lobby.hidden = true;
  document.dispatchEvent(new CustomEvent("the-game:return-home"));
}

async function openGame(gameSnapshot) {
  if (!gameSnapshot?.game) return;
  lobbyOpen = false;
  closeSubscription();
  snapshot = null;
  views.online.hidden = true;
  views.lobby.hidden = true;
  const gameModule = await ensureOnlineGameModule();
  gameModule.openOnlineGame({
    api,
    gameSnapshot,
    onReturnToLobby: openLobby,
  });
}

function renderLobby() {
  if (!snapshot?.room || !snapshot?.self) return;

  const { room, self, players = [] } = snapshot;
  views.roomCode.textContent = room.code;
  views.playerCount.textContent = `${room.player_count} / ${room.max_players}명`;
  views.playerList.replaceChildren();

  for (const player of players) {
    const item = document.createElement("li");
    item.className = "lobby-player-item";

    const identity = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = player.nickname;
    identity.append(name);

    if (player.is_host) {
      const hostBadge = document.createElement("span");
      hostBadge.className = "lobby-badge";
      hostBadge.textContent = "방장";
      identity.append(hostBadge);
    }
    if (player.user_id === self.user_id) {
      const meBadge = document.createElement("span");
      meBadge.className = "lobby-badge lobby-badge--muted";
      meBadge.textContent = "나";
      identity.append(meBadge);
    }

    const ready = document.createElement("span");
    ready.className = `ready-state ${player.is_ready ? "is-ready" : ""}`;
    ready.textContent = player.is_ready ? "준비 완료" : "대기 중";

    item.append(identity, ready);
    views.playerList.append(item);
  }

  views.readyButton.textContent = self.is_ready ? "준비 취소" : "준비하기";
  if (self.is_host && room.can_start) {
    views.startButton.textContent = "게임 시작";
  } else if (!self.is_host && room.can_start) {
    views.startButton.textContent = "방장의 게임 시작을 기다리는 중";
  } else {
    views.startButton.textContent = "모두 준비되면 게임 시작";
  }
  views.startButton.disabled = busy || !(self.is_host && room.can_start);
}

function scheduleRefresh() {
  if (refreshTimer) return;
  refreshTimer = window.setTimeout(async () => {
    refreshTimer = null;
    await refreshLobby();
  }, 80);
}

function scheduleLobbyReconnect(delay = 1200) {
  if (!lobbyOpen || reconnectTimer) return;
  reconnectTimer = window.setTimeout(async () => {
    reconnectTimer = null;
    if (!lobbyOpen) return;
    await refreshLobby();
    if (!lobbyOpen || !snapshot?.room?.id) return;
    subscribeCurrentLobby();
  }, delay);
}

async function refreshLobby() {
  if (!snapshot?.room?.id || !api) return;
  const roomId = snapshot.room.id;
  try {
    const next = await api.getLobbySnapshot(roomId);
    if (!next) {
      showOnlineEntry();
      setMessage(views.onlineMessage, "방이 종료되어 온라인 시작 화면으로 돌아왔습니다.");
      return;
    }

    if (next.room?.status === "playing") {
      const gameSnapshot = await api.getGameSnapshot(roomId);
      if (gameSnapshot) await openGame(gameSnapshot);
      return;
    }

    snapshot = next;
    renderLobby();
  } catch (error) {
    const message = error?.message ?? "";
    if (message.includes("PLAYER_NOT_MEMBER") || message.includes("ROOM_NOT_FOUND")) {
      showOnlineEntry();
      setMessage(views.onlineMessage, "방이 종료되어 온라인 시작 화면으로 돌아왔습니다.");
      return;
    }
    setMessage(views.lobbyMessage, friendlyError(error));
  }
}

function subscribeCurrentLobby() {
  if (!lobbyOpen) return;
  if (unsubscribeLobby) {
    unsubscribeLobby();
    unsubscribeLobby = null;
  }

  const roomId = snapshot?.room?.id;
  if (!roomId) return;

  views.connectionStatus.textContent = navigator.onLine === false ? "오프라인 · 네트워크 연결을 기다리는 중" : "실시간 연결 중…";
  unsubscribeLobby = api.subscribeLobby(roomId, {
    onChange: scheduleRefresh,
    onStatus(status) {
      if (!lobbyOpen) return;
      if (status === "SUBSCRIBED") {
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
          reconnectTimer = null;
        }
        views.connectionStatus.textContent = "실시간 연결됨";
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        views.connectionStatus.textContent = "연결이 끊겼습니다 · 재연결 중…";
        scheduleLobbyReconnect();
      } else if (status === "CLOSED") {
        views.connectionStatus.textContent = navigator.onLine === false ? "오프라인 · 네트워크 연결을 기다리는 중" : "실시간 연결 종료됨";
      }
    },
  });
}

function openLobby(nextSnapshot) {
  snapshot = nextSnapshot;
  lobbyOpen = true;
  views.online.hidden = true;
  views.lobby.hidden = false;
  setMessage(views.onlineMessage);
  setMessage(views.lobbyMessage, "같은 멤버로 다시 준비해 주세요.");
  renderLobby();
  subscribeCurrentLobby();
}

async function bootOnline() {
  createViews();
  lobbyOpen = false;
  onlineGameModule?.closeOnlineGame?.();
  views.online.hidden = false;
  views.lobby.hidden = true;
  views.loading.hidden = false;
  views.authGate.hidden = true;
  views.controls.hidden = true;
  setMessage(views.onlineMessage);

  try {
    await ensureOnlineModules();
    const { data, error } = await supabaseClient.auth.getUser();
    if (error || !data.user) {
      views.loading.hidden = true;
      views.authGate.hidden = false;
      return;
    }

    const activeGame = await api.getMyActiveGame();
    if (activeGame) {
      views.loading.hidden = true;
      await openGame(activeGame);
      return;
    }

    const activeRoom = await api.getMyActiveRoom();
    views.loading.hidden = true;
    if (activeRoom) {
      if (activeRoom.room?.status === "playing") {
        const gameSnapshot = await api.getGameSnapshot(activeRoom.room.id);
        if (gameSnapshot) await openGame(gameSnapshot);
        return;
      }
      openLobby(activeRoom);
      return;
    }

    views.controls.hidden = false;
    views.nickname.value = localStorage.getItem(NICKNAME_STORAGE_KEY) ?? "";
  } catch (error) {
    views.loading.hidden = true;
    if ((error?.message ?? "").includes("AUTH_REQUIRED")) {
      views.authGate.hidden = false;
    }
    setMessage(views.onlineMessage, friendlyError(error));
  }
}

async function createRoom(event) {
  event.preventDefault();
  if (busy) return;
  const nickname = saveNickname();
  const maxPlayers = Number(new FormData(views.createForm).get("max-players"));
  if (!nickname) {
    setMessage(views.onlineMessage, "닉네임을 입력해 주세요.");
    return;
  }

  setBusy(true);
  setMessage(views.onlineMessage);
  try {
    const next = await api.createRoom({ nickname, maxPlayers });
    openLobby(next);
  } catch (error) {
    setMessage(views.onlineMessage, friendlyError(error));
  } finally {
    setBusy(false);
  }
}

async function joinRoom(event) {
  event.preventDefault();
  if (busy) return;
  const nickname = saveNickname();
  const roomCode = views.roomCodeInput.value.trim().toUpperCase();
  if (!nickname) {
    setMessage(views.onlineMessage, "닉네임을 입력해 주세요.");
    return;
  }
  if (roomCode.length !== 6) {
    setMessage(views.onlineMessage, "6자리 방 코드를 입력해 주세요.");
    return;
  }

  setBusy(true);
  setMessage(views.onlineMessage);
  try {
    const next = await api.joinRoom({ roomCode, nickname });
    openLobby(next);
  } catch (error) {
    setMessage(views.onlineMessage, friendlyError(error));
  } finally {
    setBusy(false);
  }
}

async function toggleReady() {
  if (busy || !snapshot?.room || !snapshot?.self) return;
  setBusy(true);
  setMessage(views.lobbyMessage);
  try {
    snapshot = await api.setReady({
      roomId: snapshot.room.id,
      ready: !snapshot.self.is_ready,
      expectedVersion: snapshot.room.version,
    });
    renderLobby();
  } catch (error) {
    if ((error?.message ?? "").includes("STATE_CHANGED")) await refreshLobby();
    setMessage(views.lobbyMessage, friendlyError(error));
  } finally {
    setBusy(false);
  }
}

async function startCurrentGame() {
  if (busy || !snapshot?.room || !snapshot?.self?.is_host || !snapshot.room.can_start) return;
  setBusy(true);
  setMessage(views.lobbyMessage, "카드를 섞고 각 플레이어에게 배분하고 있습니다…");
  try {
    const gameSnapshot = await api.startGame({
      roomId: snapshot.room.id,
      expectedVersion: snapshot.room.version,
    });
    await openGame(gameSnapshot);
  } catch (error) {
    if ((error?.message ?? "").includes("STATE_CHANGED")) await refreshLobby();
    setMessage(views.lobbyMessage, friendlyError(error));
  } finally {
    setBusy(false);
  }
}

async function leaveCurrentRoom() {
  if (busy || !snapshot?.room) return;
  setBusy(true);
  setMessage(views.lobbyMessage);
  try {
    await api.leaveRoom({
      roomId: snapshot.room.id,
      expectedVersion: snapshot.room.version,
    });
    showOnlineEntry();
    setMessage(views.onlineMessage, "방에서 나왔습니다.");
  } catch (error) {
    if ((error?.message ?? "").includes("STATE_CHANGED")) await refreshLobby();
    setMessage(views.lobbyMessage, friendlyError(error));
  } finally {
    setBusy(false);
  }
}

async function copyRoomCode() {
  const code = snapshot?.room?.code;
  if (!code) return;
  try {
    await navigator.clipboard.writeText(code);
    setMessage(views.lobbyMessage, "방 코드를 복사했습니다.");
  } catch {
    setMessage(views.lobbyMessage, `방 코드: ${code}`);
  }
}

function bindEvents() {
  views.backButton.addEventListener("click", returnToMode);
  views.createForm.addEventListener("submit", createRoom);
  views.joinForm.addEventListener("submit", joinRoom);
  views.readyButton.addEventListener("click", toggleReady);
  views.startButton.addEventListener("click", startCurrentGame);
  views.leaveButton.addEventListener("click", leaveCurrentRoom);
  views.copyButton.addEventListener("click", copyRoomCode);
  views.roomCodeInput.addEventListener("input", () => {
    views.roomCodeInput.value = views.roomCodeInput.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  });
}

export async function openOnlineLobby() {
  await bootOnline();
}

export function closeOnlineLobby() {
  if (!views) return;
  lobbyOpen = false;
  closeSubscription();
  onlineGameModule?.closeOnlineGame?.();
  views.online.hidden = true;
  views.lobby.hidden = true;
}
