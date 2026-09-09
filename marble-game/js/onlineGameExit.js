import {
  endOnlineGame,
  getOnlineGameSnapshot,
  subscribeOnlineGame,
} from "./onlineGameApi.js";
import { getOnlineRoomId } from "./onlinePlayRoute.js";

const onlineRoomId = typeof window !== "undefined" ? getOnlineRoomId(window.location.href) : null;
const END_EVENTS = new Set(["GAME_ABANDONED", "GAME_SESSION_CLOSED"]);
const RETURN_DELAY_MS = 900;

function errorText(error) {
  return String(error?.message ?? error ?? "");
}

function hasEndEvent(snapshot) {
  return Array.isArray(snapshot?.game?.lastEvents)
    && snapshot.game.lastEvents.some((event) => END_EVENTS.has(event?.type));
}

function lobbyUrl(href) {
  const url = new URL(href);
  url.searchParams.delete("play");
  url.searchParams.delete("onlineRoom");
  url.searchParams.delete("room");
  return url;
}

if (onlineRoomId) {
  const controls = document.querySelector("[data-online-game-controls]");
  const endButton = document.querySelector("[data-end-online-game]");
  const modal = document.querySelector("[data-game-end-modal]");
  const cancelButton = document.querySelector("[data-game-end-cancel]");
  const confirmButton = document.querySelector("[data-game-end-confirm]");
  const gameMessage = document.querySelector("[data-game-message]");

  let busy = false;
  let redirectTimer = null;
  let unsubscribe = null;

  function setBusy(nextBusy) {
    busy = nextBusy;
    if (endButton) endButton.disabled = nextBusy;
    if (cancelButton) cancelButton.disabled = nextBusy;
    if (confirmButton) {
      confirmButton.disabled = nextBusy;
      confirmButton.textContent = nextBusy ? "종료 중…" : "게임 종료";
    }
  }

  function closeModal() {
    if (!modal) return;
    if (modal.open && typeof modal.close === "function") modal.close();
    else modal.removeAttribute("open");
  }

  function openModal() {
    if (!modal || busy) return;
    if (!modal.open && typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");
  }

  function returnToLobby() {
    window.location.assign(lobbyUrl(window.location.href).href);
  }

  function scheduleLobbyReturn(message) {
    closeModal();
    setBusy(true);
    if (gameMessage && message) gameMessage.textContent = message;
    if (redirectTimer !== null) return;
    redirectTimer = window.setTimeout(returnToLobby, RETURN_DELAY_MS);
  }

  async function latestSnapshot() {
    return getOnlineGameSnapshot(onlineRoomId);
  }

  async function checkRemoteEnd() {
    try {
      const snapshot = await latestSnapshot();
      if (hasEndEvent(snapshot)) {
        scheduleLobbyReturn("게임이 종료되었습니다. 로비로 돌아갑니다.");
      }
    } catch (error) {
      const message = errorText(error);
      if (!message.includes("GAME_NOT_FOUND") && !message.includes("NOT_ROOM_MEMBER")) {
        console.warn("Marble game end sync check failed", error);
      }
    }
  }

  async function requestGameEnd() {
    if (busy) return;
    setBusy(true);
    try {
      let snapshot = await latestSnapshot();
      if (!hasEndEvent(snapshot)) {
        try {
          snapshot = await endOnlineGame({
            roomId: onlineRoomId,
            expectedVersion: snapshot.game.version,
          });
        } catch (error) {
          if (!errorText(error).includes("VERSION_CONFLICT")) throw error;
          snapshot = await latestSnapshot();
          if (!hasEndEvent(snapshot)) {
            snapshot = await endOnlineGame({
              roomId: onlineRoomId,
              expectedVersion: snapshot.game.version,
            });
          }
        }
      }
      scheduleLobbyReturn("게임을 종료했습니다. 새 방을 만들 수 있습니다.");
    } catch (error) {
      console.error("Marble online game end failed", error);
      setBusy(false);
      if (gameMessage) gameMessage.textContent = "게임 종료 처리 중 오류가 발생했습니다. 다시 시도해 주세요.";
    }
  }

  if (controls && endButton && modal && cancelButton && confirmButton) {
    controls.hidden = false;
    endButton.addEventListener("click", openModal);
    cancelButton.addEventListener("click", closeModal);
    confirmButton.addEventListener("click", () => { void requestGameEnd(); });
    modal.addEventListener("cancel", (event) => {
      if (busy) event.preventDefault();
      else closeModal();
    });

    try {
      unsubscribe = subscribeOnlineGame(onlineRoomId, {
        onChange: () => { void checkRemoteEnd(); },
      });
    } catch (error) {
      console.warn("Marble game end realtime subscription failed", error);
    }

    window.addEventListener("beforeunload", () => unsubscribe?.(), { once: true });
  }
}
