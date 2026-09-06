import {
  createRoom,
  getCurrentUser,
  getLobbySnapshot,
  getMyActiveRoom,
  joinRoom,
  leaveRoom,
  setReady,
  subscribeLobby,
} from "./multiplayerApi.js";
import {
  findViewer,
  isViewerHost,
  lobbyReadySummary,
  normalizeNickname,
  normalizeRoomCode,
} from "./multiplayerModel.js";

const root = document.querySelector("[data-multiplayer-entry]");

if (root) {
  const statusBadge = root.querySelector("[data-multiplayer-status]");
  const setup = root.querySelector("[data-multiplayer-setup]");
  const lobby = root.querySelector("[data-multiplayer-lobby]");
  const message = root.querySelector("[data-multiplayer-message]");
  const nicknameInput = root.querySelector("[data-multiplayer-nickname]");
  const maxPlayersSelect = root.querySelector("[data-multiplayer-max-players]");
  const roomCodeInput = root.querySelector("[data-multiplayer-room-code-input]");
  const createButton = root.querySelector("[data-create-room]");
  const joinButton = root.querySelector("[data-join-room]");
  const displayedRoomCode = root.querySelector("[data-room-code]");
  const roomPlayers = root.querySelector("[data-room-players]");
  const roomMeta = root.querySelector("[data-room-meta]");
  const readyButton = root.querySelector("[data-room-ready]");
  const leaveButton = root.querySelector("[data-room-leave]");
  const copyButton = root.querySelector("[data-room-copy]");
  const startHint = root.querySelector("[data-room-start-hint]");

  let snapshot = null;
  let unsubscribeLobby = null;
  let busy = false;

  function setMessage(text, tone = "neutral") {
    message.textContent = text;
    message.dataset.tone = tone;
  }

  function setStatus(text, tone = "neutral") {
    statusBadge.textContent = text;
    statusBadge.dataset.tone = tone;
  }

  function setBusy(nextBusy) {
    busy = nextBusy;
    [createButton, joinButton, readyButton, leaveButton, copyButton]
      .filter(Boolean)
      .forEach((button) => {
        button.disabled = nextBusy;
      });
  }

  function errorCode(error) {
    const messageText = String(error?.message ?? error ?? "");
    const known = [
      "AUTH_REQUIRED",
      "INVALID_NICKNAME",
      "INVALID_PLAYER_COUNT",
      "ACTIVE_ROOM_EXISTS",
      "ROOM_NOT_FOUND",
      "ROOM_FULL",
      "ROOM_NOT_WAITING",
      "VERSION_CONFLICT",
      "NOT_ROOM_MEMBER",
    ];
    return known.find((code) => messageText.includes(code)) ?? null;
  }

  function friendlyError(error) {
    const messageText = String(error?.message ?? error ?? "");
    switch (errorCode(error)) {
      case "AUTH_REQUIRED": return "온라인 플레이는 청파 같이 로그인 후 이용할 수 있어요.";
      case "INVALID_NICKNAME": return "닉네임은 1~20자로 입력해 주세요.";
      case "INVALID_PLAYER_COUNT": return "Classic은 2~4인 방만 만들 수 있어요.";
      case "ACTIVE_ROOM_EXISTS": return "이미 참가 중인 Marble 방이 있어요. 페이지를 새로고침하면 다시 연결합니다.";
      case "ROOM_NOT_FOUND": return "입장할 수 있는 방을 찾지 못했어요. 방 코드를 다시 확인해 주세요.";
      case "ROOM_FULL": return "이미 인원이 가득 찬 방이에요.";
      case "ROOM_NOT_WAITING": return "이미 게임이 시작됐거나 닫힌 방이에요.";
      case "VERSION_CONFLICT": return "다른 플레이어의 변경사항을 먼저 반영했어요. 다시 시도해 주세요.";
      case "NOT_ROOM_MEMBER": return "현재 이 방에 참가한 상태가 아니에요.";
      default:
        if (messageText.includes("Auth session missing")) return "온라인 플레이는 청파 같이 로그인 후 이용할 수 있어요.";
        if (messageText.includes("Supabase client is not ready")) return "온라인 연결 모듈을 불러오지 못했어요. 페이지를 새로고침해 주세요.";
        console.error("Marble multiplayer lobby error", error);
        return "온라인 대기실 처리 중 오류가 발생했어요.";
    }
  }

  function inviteUrl() {
    if (!snapshot?.room?.roomCode) return location.href;
    const url = new URL(location.href);
    url.searchParams.delete("play");
    url.searchParams.set("room", snapshot.room.roomCode);
    return url.href;
  }

  function renderPlayers() {
    roomPlayers.replaceChildren();
    const maxPlayers = snapshot?.room?.maxPlayers ?? 4;
    const playersBySeat = new Map((snapshot?.players ?? []).map((player) => [player.seat, player]));

    for (let seat = 0; seat < maxPlayers; seat += 1) {
      const player = playersBySeat.get(seat);
      const item = document.createElement("li");
      item.className = "multiplayer-player";
      item.dataset.seat = String(seat);
      if (!player) {
        item.dataset.empty = "true";
        item.innerHTML = `<span class="multiplayer-player__token">P${seat + 1}</span><div><strong>자리 비어 있음</strong><span>참가자 대기 중</span></div>`;
      } else {
        const host = player.userId === snapshot.room.hostUserId;
        const viewer = player.userId === snapshot.viewerUserId;
        item.dataset.ready = String(player.isReady === true);
        item.dataset.viewer = String(viewer);
        item.innerHTML = `
          <span class="multiplayer-player__token">P${seat + 1}</span>
          <div>
            <strong>${player.nickname}${viewer ? " · 나" : ""}</strong>
            <span>${host ? "방장" : player.isReady ? "준비 완료" : "준비 중"}</span>
          </div>
          <span class="multiplayer-player__state">${host ? "HOST" : player.isReady ? "READY" : "WAIT"}</span>
        `;
      }
      roomPlayers.append(item);
    }
  }

  function renderLobby() {
    const active = Boolean(snapshot?.room?.id);
    setup.hidden = active;
    lobby.hidden = !active;

    if (!active) {
      setStatus("입장 가능", "ready");
      return;
    }

    displayedRoomCode.textContent = snapshot.room.roomCode;
    const readySummary = lobbyReadySummary(snapshot);
    roomMeta.textContent = `${readySummary.playerCount} / ${snapshot.room.maxPlayers}명 · Classic`;
    renderPlayers();

    const viewer = findViewer(snapshot);
    const host = isViewerHost(snapshot);
    readyButton.hidden = host;
    if (!host && viewer) {
      readyButton.textContent = viewer.isReady ? "준비 취소" : "준비 완료";
      readyButton.dataset.ready = String(viewer.isReady === true);
    }

    if (host) {
      startHint.textContent = readySummary.canStart
        ? "모두 준비됐어요. 다음 하위 단계에서 방장이 실제 게임 시작을 서버에 요청하도록 연결합니다."
        : "2명 이상 참가하고 모든 참가자가 준비하면 게임을 시작할 수 있어요.";
    } else {
      startHint.textContent = "준비 상태는 다른 플레이어 화면에도 실시간으로 반영됩니다.";
    }

    setStatus("실시간 연결", "online");
  }

  async function refreshSnapshot() {
    if (!snapshot?.room?.id) return;
    try {
      snapshot = await getLobbySnapshot(snapshot.room.id);
      renderLobby();
    } catch (error) {
      if (errorCode(error) === "ROOM_NOT_FOUND") {
        snapshot = null;
        unsubscribeLobby?.();
        unsubscribeLobby = null;
        renderLobby();
        setMessage("방 연결이 종료됐어요.", "neutral");
        return;
      }
      setMessage(friendlyError(error), "error");
    }
  }

  function subscribeCurrentLobby() {
    unsubscribeLobby?.();
    unsubscribeLobby = null;
    if (!snapshot?.room?.id) return;
    unsubscribeLobby = subscribeLobby(snapshot.room.id, {
      onChange: refreshSnapshot,
      onStatus(status) {
        if (status === "SUBSCRIBED") setStatus("실시간 연결", "online");
        else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") setStatus("재연결 중", "warning");
      },
    });
  }

  async function acceptSnapshot(nextSnapshot, successMessage) {
    snapshot = nextSnapshot;
    renderLobby();
    subscribeCurrentLobby();
    if (successMessage) setMessage(successMessage, "success");
  }

  async function run(action) {
    if (busy) return;
    setBusy(true);
    try {
      await action();
    } catch (error) {
      if (errorCode(error) === "VERSION_CONFLICT") await refreshSnapshot();
      setMessage(friendlyError(error), "error");
    } finally {
      setBusy(false);
      renderLobby();
    }
  }

  roomCodeInput.addEventListener("input", () => {
    roomCodeInput.value = normalizeRoomCode(roomCodeInput.value);
  });

  nicknameInput.addEventListener("blur", () => {
    nicknameInput.value = normalizeNickname(nicknameInput.value);
  });

  createButton.addEventListener("click", () => run(async () => {
    const nickname = normalizeNickname(nicknameInput.value);
    const nextSnapshot = await createRoom({ nickname, maxPlayers: Number(maxPlayersSelect.value) });
    await acceptSnapshot(nextSnapshot, "온라인 방을 만들었어요. 방 코드를 친구에게 공유해 주세요.");
  }));

  joinButton.addEventListener("click", () => run(async () => {
    const nickname = normalizeNickname(nicknameInput.value);
    const roomCode = normalizeRoomCode(roomCodeInput.value);
    const nextSnapshot = await joinRoom({ roomCode, nickname });
    await acceptSnapshot(nextSnapshot, "방에 참가했어요.");
  }));

  readyButton.addEventListener("click", () => run(async () => {
    const viewer = findViewer(snapshot);
    if (!viewer) return;
    const nextSnapshot = await setReady({
      roomId: snapshot.room.id,
      ready: !viewer.isReady,
      expectedVersion: snapshot.room.version,
    });
    await acceptSnapshot(nextSnapshot);
  }));

  leaveButton.addEventListener("click", () => run(async () => {
    await leaveRoom({ roomId: snapshot.room.id, expectedVersion: snapshot.room.version });
    unsubscribeLobby?.();
    unsubscribeLobby = null;
    snapshot = null;
    renderLobby();
    setMessage("방에서 나왔어요.", "neutral");
  }));

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl());
      setMessage("초대 링크를 복사했어요.", "success");
    } catch {
      setMessage(`방 코드 ${snapshot?.room?.roomCode ?? ""} 를 공유해 주세요.`, "neutral");
    }
  });

  window.addEventListener("beforeunload", () => unsubscribeLobby?.());

  async function init() {
    setStatus("연결 확인 중");
    const requestedCode = normalizeRoomCode(new URLSearchParams(location.search).get("room"));
    if (requestedCode) roomCodeInput.value = requestedCode;

    try {
      const user = await getCurrentUser();
      if (!user) {
        setStatus("로그인 필요", "warning");
        setMessage("온라인 플레이는 청파 같이 로그인 후 이용할 수 있어요. 로컬 테스트 플레이는 그대로 사용할 수 있습니다.", "warning");
        createButton.disabled = true;
        joinButton.disabled = true;
        return;
      }

      const suggestedName = user.user_metadata?.nickname
        || user.user_metadata?.name
        || user.email?.split("@")[0]
        || "플레이어";
      nicknameInput.value = normalizeNickname(suggestedName);

      const activeRoom = await getMyActiveRoom();
      if (activeRoom) {
        await acceptSnapshot(activeRoom, "참가 중이던 Marble 방에 다시 연결했어요.");
      } else {
        renderLobby();
        setMessage(requestedCode ? "닉네임을 확인하고 방 참가를 눌러 주세요." : "방을 만들거나 6자리 방 코드로 참가할 수 있어요.");
      }
    } catch (error) {
      setStatus("연결 오류", "error");
      setMessage(friendlyError(error), "error");
    }
  }

  init();
}
