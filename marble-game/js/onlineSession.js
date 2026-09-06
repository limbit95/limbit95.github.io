import { GAME_STATUS } from "./core/gameEngine.js";
import { createClassicBoard } from "./themes/classic/board.js";
import {
  buildOnlineProperty,
  buyOnlineProperty,
  endOnlineTurn,
  getOnlineGameSnapshot,
  rollOnlineDice,
  subscribeOnlineGame,
} from "./onlineGameApi.js";

const CLASSIC_BOARD = createClassicBoard().toJSON();

function freezeProperties(properties = {}) {
  return Object.freeze(Object.fromEntries(
    CLASSIC_BOARD.nodes
      .filter((node) => node.type === "PROPERTY")
      .map((node) => {
        const property = properties[node.id] ?? {};
        return [node.id, Object.freeze({
          ownerId: property.ownerId ?? null,
          buildingLevel: Number(property.buildingLevel) || 0,
        })];
      }),
  ));
}

export function mapOnlineGameSnapshot(snapshot) {
  if (!snapshot?.room?.id || !snapshot?.game?.id) throw new Error("GAME_SNAPSHOT_INVALID");

  const players = Object.freeze((snapshot.players ?? []).map((player) => Object.freeze({
    id: player.id,
    userId: player.userId,
    name: player.name,
    seat: Number(player.seat),
    positionNodeId: player.positionNodeId,
    money: Number(player.money),
    bankrupt: player.bankrupt === true,
    skipTurns: Number(player.skipTurns) || 0,
  })));
  const currentPlayerIndex = players.findIndex((player) => player.seat === Number(snapshot.game.currentSeat));
  const status = String(snapshot.game.status ?? "").toUpperCase();

  return Object.freeze({
    themeId: "classic",
    rulesetVersion: Number(snapshot.game.rulesetVersion) || 1,
    status: status === GAME_STATUS.FINISHED ? GAME_STATUS.FINISHED : GAME_STATUS.PLAYING,
    phase: snapshot.game.phase,
    turn: Number(snapshot.game.turn) || 1,
    currentPlayerIndex: currentPlayerIndex >= 0 ? currentPlayerIndex : null,
    players,
    board: CLASSIC_BOARD,
    boardState: Object.freeze({ properties: freezeProperties(snapshot.properties) }),
    themeState: Object.freeze({}),
    pendingChoice: snapshot.game.pendingChoice ?? null,
    lastRoll: snapshot.game.lastRoll ?? null,
    lastEvents: Object.freeze(Array.isArray(snapshot.game.lastEvents) ? snapshot.game.lastEvents : []),
    winnerPlayerId: snapshot.game.winnerPlayerId ?? null,
    version: Number(snapshot.game.version) || 0,
    lastAction: null,
  });
}

export function isOnlineViewerTurn(state, viewerPlayerId) {
  if (!state || !viewerPlayerId || state.currentPlayerIndex === null) return false;
  return state.players[state.currentPlayerIndex]?.id === viewerPlayerId;
}

export async function createOnlineClassicSession({ roomId, onRemoteState, onConnectionStatus } = {}) {
  if (!roomId) throw new Error("ROOM_ID_REQUIRED");

  let snapshot = await getOnlineGameSnapshot(roomId);
  let state = mapOnlineGameSnapshot(snapshot);
  let unsubscribe = null;
  let disposed = false;
  let refreshing = false;
  let actionInFlight = false;
  let pendingRefresh = false;

  function accept(nextSnapshot) {
    snapshot = nextSnapshot;
    state = mapOnlineGameSnapshot(nextSnapshot);
    return state;
  }

  async function refresh({ notify = true } = {}) {
    if (disposed) return state;
    if (actionInFlight) {
      pendingRefresh = true;
      return state;
    }
    if (refreshing) return state;
    refreshing = true;
    try {
      const nextSnapshot = await getOnlineGameSnapshot(roomId);
      const nextVersion = Number(nextSnapshot?.game?.version) || 0;
      const currentVersion = Number(snapshot?.game?.version) || 0;
      if (nextVersion <= currentVersion) return state;
      const nextState = accept(nextSnapshot);
      if (notify) await onRemoteState?.(nextState);
      return nextState;
    } finally {
      refreshing = false;
    }
  }

  async function run(action) {
    if (actionInFlight) throw new Error("ACTION_IN_PROGRESS");
    actionInFlight = true;
    try {
      const nextSnapshot = await action({
        roomId,
        expectedVersion: snapshot.game.version,
      });
      return accept(nextSnapshot);
    } finally {
      actionInFlight = false;
      if (pendingRefresh && !disposed) {
        pendingRefresh = false;
        void refresh();
      }
    }
  }

  unsubscribe = subscribeOnlineGame(roomId, {
    onChange: () => { void refresh(); },
    onStatus: onConnectionStatus,
  });

  const handleOnline = () => {
    onConnectionStatus?.("RECONNECTING");
    void refresh().then(() => onConnectionStatus?.("SUBSCRIBED"));
  };
  const handleOffline = () => onConnectionStatus?.("OFFLINE");
  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return Object.freeze({
    isOnline: true,
    roomId,
    getState() {
      return state;
    },
    getViewerPlayerId() {
      return snapshot.viewerPlayerId ?? null;
    },
    refresh,
    roll() {
      return run(rollOnlineDice);
    },
    buy() {
      return run(buyOnlineProperty);
    },
    build() {
      return run(buildOnlineProperty);
    },
    endTurn() {
      return run(endOnlineTurn);
    },
    dispose() {
      disposed = true;
      unsubscribe?.();
      unsubscribe = null;
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    },
  });
}
