import {
  forfeitOnlineGame,
  getOnlineGameSnapshot,
  subscribeOnlineGame,
} from "./onlineGameApi.js";
import { getOnlineRoomId } from "./onlinePlayRoute.js";

const onlineRoomId = typeof window !== "undefined" ? getOnlineRoomId(window.location.href) : null;
const GLOBAL_END_EVENTS = new Set(["GAME_ABANDONED", "GAME_SESSION_CLOSED"]);
const RETURN_DELAY_MS = 900;

function errorText(error) {
  return String(error?.message ?? error ?? "");
}

function hasEvent(snapshot, eventType) {
  return Array.isArray(snapshot?.game?.lastEvents)
    && snapshot.game.lastEvents.some((event) => event?.type === eventType);
}

function hasGlobalEndEvent(snapshot) {
  return Array.isArray(snapshot?.game?.lastEvents)
    && snapshot.game.lastEvents.some((event) => GLOBAL_END_EVENTS.has(event?.type));
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
  const playerList = document.querySelector("[data-player-list]");

  let busy = false;
  let redirectTimer = null;
  let unsubscribe = null;
  let lastForfeitVersion = null;

  function setBusy(nextBusy) {
    busy = nextBusy;
    if (endButton) endButton.disabled = nextBusy;
    if (cancelButton) cancelButton.disabled = nextBusy;
    if (confirmButton) {
      confirmButton.disabled = nextBusy;
      confirmButton.textContent = nextBusy ? "처리 중…" : "기권 후 나가기";
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

  function renderForfeitedPlayers(snapshot) {
    if (!playerList) return;
    (snapshot?.players ?? [])
      .filter((player) => player?.forfeited === true)
      .forEach((player) => {
        const card = playerList.querySelector(`.player-card[data-seat="${Number(player.seat)}"]`);
        if (!card) return;
        card.dataset.forfeited = "true";
        const stateLabel = card.querySelector(".player-card__state");
        const bankruptLabel = card.querySelector(".bankrupt-label");
        if (stateLabel) stateLabel.textContent = "기권";
        if (bankruptLabel) bankruptLabel.textContent = "기권";
      });
  }

  function showRemoteForfeit(snapshot) {
    const event = [...(snapshot?.game?.lastEvents ?? [])]
      .reverse()
      .find((candidate) => candidate?.type === "PLAYER_FORFEITED");
    const version = Number(snapshot?.game?.version) || 0;
    if (!event || version === lastForfeitVersion) return;
    lastForfeitVersion = version;
    const player = (snapshot?.players ?? []).find((candidate) => candidate?.id === event.playerId);
    if (gameMessage && player?.name) {
      gameMessage.textContent = `${player.name}이(가) 기권했습니다. 남은 플레이어가 게임을 계속합니다.`;
    }
  }

  async function latestSnapshot() {
    return getOnlineGameSnapshot(onlineRoomId);
  }

  async function syncLifecycleState() {
    try {
      const snapshot = await latestSnapshot();
      renderForfeitedPlayers(snapshot);
      showRemoteForfeit(snapshot);
      if (hasGlobalEndEvent(snapshot)) {
        scheduleLobbyReturn("게임 세션이 종료되었습니다. 로비로 돌아갑니다.");
      }
    } catch (error) {
      const message = errorText(error);
      if (!message.includes("GAME_NOT_FOUND") && !message.includes("NOT_ROOM_MEMBER")) {
        console.warn("Marble game lifecycle sync check failed", error);
      }
    }
  }

  async function requestGameExit() {
    if (busy) return;
    setBusy(true);
    try {
      let snapshot = await latestSnapshot();
      try {
        snapshot = await forfeitOnlineGame({
          roomId: onlineRoomId,
          expectedVersion: snapshot.game.version,
        });
      } catch (error) {
        if (!errorText(error).includes("VERSION_CONFLICT")) throw error;
        snapshot = await latestSnapshot();
        snapshot = await forfeitOnlineGame({
          roomId: onlineRoomId,
          expectedVersion: snapshot.game.version,
        });
      }

      scheduleLobbyReturn(hasEvent(snapshot, "PLAYER_FORFEITED")
        ? "기권 처리되었습니다. 남은 플레이어는 게임을 계속합니다."
        : "게임에서 나왔습니다. 로비로 돌아갑니다.");
    } catch (error) {
      const message = errorText(error);
      if (message.includes("NOT_ROOM_MEMBER")) {
        scheduleLobbyReturn("이미 게임에서 나간 상태입니다. 로비로 돌아갑니다.");
        return;
      }
      console.error("Marble online game exit failed", error);
      setBusy(false);
      if (gameMessage) gameMessage.textContent = "게임 나가기 처리 중 오류가 발생했습니다. 다시 시도해 주세요.";
    }
  }

  if (controls && endButton && modal && cancelButton && confirmButton) {
    controls.hidden = false;
    endButton.addEventListener("click", openModal);
    cancelButton.addEventListener("click", closeModal);
    confirmButton.addEventListener("click", () => { void requestGameExit(); });
    modal.addEventListener("cancel", (event) => {
      if (busy) event.preventDefault();
      else closeModal();
    });

    try {
      unsubscribe = subscribeOnlineGame(onlineRoomId, {
        channelScope: "exit",
        onChange: () => { void syncLifecycleState(); },
      });
      void syncLifecycleState();
    } catch (error) {
      console.warn("Marble game lifecycle realtime subscription failed", error);
    }

    window.addEventListener("beforeunload", () => unsubscribe?.(), { once: true });
  }
}
