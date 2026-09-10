import { getOnlineGameSnapshot, subscribeOnlinePresence } from "./onlineGameApi.js?v=20260910-r8";
import { getOnlineRoomId } from "./onlinePlayRoute.js";

const PRESENCE_HUD_REVISION = "20260910-r11";
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
  roomId: suppliedRoomId,
  initialSnapshot,
} = {}) {
  const roomId = suppliedRoomId ?? getOnlineRoomId(windowObject.location.href);
  if (!roomId) return () => {};

  const playerList = documentObject.querySelector("[data-player-list]");
  if (!playerList) return () => {};

  const snapshot = initialSnapshot ?? await getOnlineGameSnapshot(roomId);
  const players = Array.isArray(snapshot?.players) ? snapshot.players : [];
  const viewerPlayerId = snapshot?.viewerPlayerId ?? null;
  if (!viewerPlayerId) return () => {};

  if (documentObject.body?.dataset) {
    documentObject.body.dataset.onlinePresenceRevision = PRESENCE_HUD_REVISION;
    documentObject.body.dataset.onlinePresenceHud = "loading";
  }
  console.info("[MarbleRender] presence-hud-start", { revision: PRESENCE_HUD_REVISION });

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
      const label = CONNECTION_LABELS[connection];
      let badge = card.querySelector("[data-player-connection]");
      if (!badge) {
        badge = documentObject.createElement("span");
        badge.className = "player-card__connection";
        badge.dataset.playerConnection = "";
        badge.textContent = label;
        const title = card.querySelector(".player-card__title > div");
        (title ?? card).append(badge);
      } else if (badge.textContent !== label) {
        badge.textContent = label;
      }
    });
  }

  const observer = new MutationObserver(render);
  observer.observe(playerList, { childList: true });

  function handleStatus(status) {
    if (["CHANNEL_ERROR", "TIMED_OUT", "CLOSED", "PRESENCE_ERROR"].includes(status)) {
      presenceReady = false;
      render();
    }
  }

  try {
    unsubscribe = subscribeOnlinePresence(roomId, {
      playerId: viewerPlayerId,
      onSync(nextPresenceState) {
        connectedIds = connectedPlayerIds(nextPresenceState);
        presenceReady = true;
        render();
      },
      onStatus: handleStatus,
    });
  } catch (error) {
    handleStatus("PRESENCE_ERROR");
    console.warn("Marble online presence HUD failed to subscribe", error);
  }

  const handleNetworkChange = () => render();
  windowObject.addEventListener("online", handleNetworkChange);
  windowObject.addEventListener("offline", handleNetworkChange);
  render();
  if (documentObject.body?.dataset) documentObject.body.dataset.onlinePresenceHud = "ready";
  console.info("[MarbleRender] presence-hud-ready", { revision: PRESENCE_HUD_REVISION });

  return () => {
    observer.disconnect();
    unsubscribe?.();
    windowObject.removeEventListener("online", handleNetworkChange);
    windowObject.removeEventListener("offline", handleNetworkChange);
    if (documentObject.body?.dataset) documentObject.body.dataset.onlinePresenceHud = "disposed";
  };
}
