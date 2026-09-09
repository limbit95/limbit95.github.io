import { getOnlineGameSnapshot, subscribeOnlinePresence } from "./onlineGameApi.js";
import { getOnlineRoomId } from "./onlinePlayRoute.js";

const CONNECTION_LABELS = Object.freeze({
  online: "접속 중",
  offline: "연결 끊김",
  checking: "연결 확인 중",
});

export function connectedPlayerIds(presenceState = {}) {
  const connected = new Set();
  Object.values(presenceState ?? {}).forEach((entries) => {
    if (!Array.isArray(entries)) return;
    entries.forEach((entry) => {
      const playerId = entry?.playerId;
      if (playerId) connected.add(String(playerId));
    });
  });
  return connected;
}

export function playerConnectionState({ playerId, connectedIds, presenceReady, viewerPlayerId, browserOnline = true }) {
  if (String(playerId) === String(viewerPlayerId) && !browserOnline) return "offline";
  if (!presenceReady) return "checking";
  return connectedIds.has(String(playerId)) ? "online" : "offline";
}

export async function setupOnlinePresenceHud({
  windowObject = window,
  documentObject = document,
} = {}) {
  const roomId = getOnlineRoomId(windowObject.location.href);
  if (!roomId) return () => {};

  const playerList = documentObject.querySelector("[data-player-list]");
  if (!playerList) return () => {};

  const snapshot = await getOnlineGameSnapshot(roomId);
  const players = Array.isArray(snapshot?.players) ? snapshot.players : [];
  const viewerPlayerId = snapshot?.viewerPlayerId ?? null;
  if (!viewerPlayerId) return () => {};

  let connectedIds = new Set();
  let presenceReady = false;
  let unsubscribe = null;

  function render() {
    players.forEach((player) => {
      const card = playerList.querySelector(`[data-seat="${Number(player.seat)}"]`);
      if (!card) return;
      const connection = playerConnectionState({
        playerId: player.id,
        connectedIds,
        presenceReady,
        viewerPlayerId,
        browserOnline: windowObject.navigator?.onLine !== false,
      });
      card.dataset.connection = connection;
      let badge = card.querySelector("[data-player-connection]");
      if (!badge) {
        badge = documentObject.createElement("span");
        badge.className = "player-card__connection";
        badge.dataset.playerConnection = "";
        const title = card.querySelector(".player-card__title > div");
        (title ?? card).append(badge);
      }
      badge.textContent = CONNECTION_LABELS[connection];
    });
  }

  const observer = new MutationObserver(render);
  observer.observe(playerList, { childList: true, subtree: true });

  function handleStatus(status) {
    if (["CHANNEL_ERROR", "TIMED_OUT", "CLOSED", "PRESENCE_ERROR"].includes(status)) {
      presenceReady = false;
      render();
    }
  }

  unsubscribe = subscribeOnlinePresence(roomId, {
    playerId: viewerPlayerId,
    onSync(nextPresenceState) {
      connectedIds = connectedPlayerIds(nextPresenceState);
      presenceReady = true;
      render();
    },
    onStatus: handleStatus,
  });

  const handleNetworkChange = () => render();
  windowObject.addEventListener("online", handleNetworkChange);
  windowObject.addEventListener("offline", handleNetworkChange);
  render();

  return () => {
    observer.disconnect();
    unsubscribe?.();
    windowObject.removeEventListener("online", handleNetworkChange);
    windowObject.removeEventListener("offline", handleNetworkChange);
  };
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  setupOnlinePresenceHud().then((dispose) => {
    window.addEventListener("beforeunload", dispose, { once: true });
  }).catch((error) => {
    console.warn("Marble online presence HUD failed to initialize", error);
  });
}
