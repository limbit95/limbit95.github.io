import { GAME_STATUS } from "./core/gameEngine.js";
import "./onlinePresenceHud.js";
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
const RECOVERY_REFRESH_MS = 3000;

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
  const finished = status === GAME_STATUS.FINISHED || status === "ABANDONED";

  return Object.freeze({
    themeId: "classic",
    rulesetVersion: Number(snapshot.game.rulesetVersion) || 1,
    status: finished ? GAME_STATUS.FINISHED : GAME_STATUS.PLAYING,
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
  let recoveryTimer = null;
  let realtimeHealthy = false;

  function accept(nextSnapshot) {
    snapshot = nextSnapshot;
    state = mapOnlineGameSnapshot(nextSnapshot);
    return state;
  }

  async function refresh({ notify = true } = {}) {
    if (disposed) return state;
    if (actionInFlight || refreshing) {
      pendingRefresh = true;
      return state;
    }
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
      if (pendingRefresh && !actionInFlight && !disposed) {
        pendingRefresh = false;
        void refresh({ notify });
      }
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

  function clearRecoveryTimer() {
    if (recoveryTimer === null) return;
    window.clearTimeout(recoveryTimer);
    recoveryTimer = null;
  }

  function scheduleRecoveryRefresh() {
    if (disposed || realtimeHealthy || recoveryTimer !== null) return;
    recoveryTimer = window.setTimeout(async () => {
      recoveryTimer = null;
      if (disposed || realtimeHealthy) return;
      try {
        await refresh();
      } catch (error) {
        onConnectionStatus?.("RECONNECTING", error);
      } finally {
        if (!disposed && !realtimeHealthy) scheduleRecoveryRefresh();
      }
    }, RECOVERY_REFRESH_MS);
  }

  function handleRealtimeStatus(status, error) {
    onConnectionStatus?.(status, error);
    if (status === "SUBSCRIBED") {
      realtimeHealthy = true;
      clearRecoveryTimer();
      void refresh().catch(() => {});
      return;
    }
    if (["CHANNEL_ERROR", "TIMED_OUT", "CLOSED"].includes(status)) {
      realtimeHealthy = false;
      scheduleRecoveryRefresh();
    }
  }

  try {
    unsubscribe = subscribeOnlineGame(roomId, {
      channelScope: "session",
      onChange: () => { void refresh(); },
      onStatus: handleRealtimeStatus,
    });
  } catch (error) {
    realtimeHealthy = false;
    onConnectionStatus?.("CHANNEL_ERROR", error);
    scheduleRecoveryRefresh();
  }

  const handleOnline = () => {
    realtimeHealthy = false;
    onConnectionStatus?.("RECONNECTING");
    scheduleRecoveryRefresh();
    void refresh().catch((error) => onConnectionStatus?.("RECONNECTING", error));
  };
  const handleOffline = () => {
    realtimeHealthy = false;
    onConnectionStatus?.("OFFLINE");
    scheduleRecoveryRefresh();
  };
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
      realtimeHealthy = false;
      clearRecoveryTimer();
      unsubscribe?.();
      unsubscribe = null;
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    },
  });
}
