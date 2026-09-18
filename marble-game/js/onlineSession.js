import { GAME_STATUS } from "./core/gameEngine.js";
import { createClassicBoard } from "./themes/classic/board.js";
import {
  bidOnlineAuction,
  buildOnlineProperty,
  buyOnlineProperty,
  closeOnlineAuctionRequest,
  createOnlineActionId,
  declineOnlinePropertyForAuction,
  endOnlineTurn,
  getOnlineGameSnapshot,
  requestOnlineAuction,
  rollOnlineDice,
  subscribeOnlineGame,
  offerOnlineTrade,
  acceptOnlineTrade,
  rejectOnlineTrade,
  cancelOnlineTrade,
} from "./onlineGameApi.js?v=20260918-r1";

const CLASSIC_BOARD = createClassicBoard().toJSON();
const RECOVERY_REFRESH_MS = 3000;
const ACTIVE_ONLINE_SESSIONS = new Map();

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

function freezeStringList(value) {
  return Object.freeze(Array.isArray(value) ? [...value] : []);
}

function freezeAuctionState(auction) {
  if (!auction || typeof auction !== "object") return null;
  return Object.freeze({
    ...auction,
    eligiblePlayerIds: freezeStringList(auction.eligiblePlayerIds),
    requestedByPlayerIds: freezeStringList(auction.requestedByPlayerIds),
    bidPlayerIds: freezeStringList(auction.bidPlayerIds),
    passedPlayerIds: freezeStringList(auction.passedPlayerIds),
  });
}

function freezeTradeSide(side) {
  if (!side || typeof side !== "object") {
    return Object.freeze({ propertyIds: Object.freeze([]), gold: 0 });
  }
  return Object.freeze({
    propertyIds: freezeStringList(side.propertyIds),
    gold: Number(side.gold) || 0,
  });
}

function freezePendingTrade(pendingTrade) {
  if (!pendingTrade || typeof pendingTrade !== "object") return null;
  const terms = pendingTrade.terms && typeof pendingTrade.terms === "object"
    ? Object.freeze({
      offered: freezeTradeSide(pendingTrade.terms.offered),
      requested: freezeTradeSide(pendingTrade.terms.requested),
    })
    : null;
  return Object.freeze({
    ...pendingTrade,
    terms,
  });
}

function freezePendingChoice(pendingChoice) {
  if (!pendingChoice || typeof pendingChoice !== "object") return null;
  if (pendingChoice.type === "AUCTION_REQUEST") {
    return Object.freeze({
      ...pendingChoice,
      eligiblePlayerIds: freezeStringList(pendingChoice.eligiblePlayerIds),
      requestedByPlayerIds: freezeStringList(pendingChoice.requestedByPlayerIds),
    });
  }
  if (pendingChoice.type === "PROPERTY_AUCTION") {
    return Object.freeze({
      ...pendingChoice,
      requestedByPlayerIds: freezeStringList(pendingChoice.requestedByPlayerIds),
      auction: freezeAuctionState(pendingChoice.auction),
    });
  }
  return Object.freeze({ ...pendingChoice });
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
    pendingChoice: freezePendingChoice(snapshot.game.pendingChoice),
    pendingTrade: freezePendingTrade(snapshot.game.pendingTrade),
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

export function getActiveOnlineClassicSession(roomId) {
  if (!roomId) return null;
  return ACTIVE_ONLINE_SESSIONS.get(String(roomId)) ?? null;
}

export function isRetryableOnlineActionError(error) {
  const name = String(error?.name ?? "");
  const message = String(error?.message ?? error ?? "");
  if (name === "TypeError") return true;
  return /(failed to fetch|fetch failed|network(?:error| request)?|load failed|timed? out|connection (?:closed|reset))/i.test(message);
}

export async function createOnlineClassicSession({
  roomId,
  initialSnapshot,
  onRemoteState,
  onConnectionStatus,
  api = {},
} = {}) {
  if (!roomId) throw new Error("ROOM_ID_REQUIRED");

  const getSnapshot = api.getSnapshot ?? getOnlineGameSnapshot;
  const subscribeGame = api.subscribeGame ?? subscribeOnlineGame;
  const createActionId = api.createActionId ?? createOnlineActionId;
  const rollAction = api.roll ?? rollOnlineDice;
  const buyAction = api.buy ?? buyOnlineProperty;
  const buildAction = api.build ?? buildOnlineProperty;
  const endTurnAction = api.endTurn ?? endOnlineTurn;
  const declinePropertyForAuctionAction = api.declinePropertyForAuction ?? declineOnlinePropertyForAuction;
  const requestAuctionAction = api.requestAuction ?? requestOnlineAuction;
  const closeAuctionRequestAction = api.closeAuctionRequest ?? closeOnlineAuctionRequest;
  const bidAuctionAction = api.bidAuction ?? bidOnlineAuction;
  const offerTradeAction = api.offerTrade ?? offerOnlineTrade;
  const acceptTradeAction = api.acceptTrade ?? acceptOnlineTrade;
  const rejectTradeAction = api.rejectTrade ?? rejectOnlineTrade;
  const cancelTradeAction = api.cancelTrade ?? cancelOnlineTrade;

  let snapshot = initialSnapshot ?? await getSnapshot(roomId);
  let state = mapOnlineGameSnapshot(snapshot);
  let unsubscribe = null;
  let disposed = false;
  let refreshing = false;
  let actionInFlight = false;
  let pendingRefresh = false;
  let recoveryTimer = null;
  let realtimeHealthy = false;
  let snapshotRecoveryPending = false;
  let subscriptionReconciled = false;
  let sessionApi = null;
  const stateListeners = new Set();

  function notifyStateListeners(nextState) {
    stateListeners.forEach((listener) => {
      try {
        listener(nextState);
      } catch (error) {
        console.warn("Marble online state listener failed", error);
      }
    });
  }

  function accept(nextSnapshot) {
    const nextState = mapOnlineGameSnapshot(nextSnapshot);
    if (nextState.version < state.version) return state;
    const changed = nextState.version > state.version;
    snapshot = nextSnapshot;
    state = nextState;
    if (changed) notifyStateListeners(state);
    return state;
  }

  async function refresh({ notify = true, forceNotify = false } = {}) {
    if (disposed) return state;
    if (actionInFlight || refreshing) {
      pendingRefresh = true;
      return state;
    }
    refreshing = true;
    try {
      const nextSnapshot = await getSnapshot(roomId);
      const nextVersion = Number(nextSnapshot?.game?.version) || 0;
      const currentVersion = Number(snapshot?.game?.version) || 0;
      if (nextVersion <= currentVersion) {
        if (notify && forceNotify) await onRemoteState?.(state);
        return state;
      }
      const nextState = accept(nextSnapshot);
      if (notify) await onRemoteState?.(nextState);
      return nextState;
    } finally {
      refreshing = false;
      if (pendingRefresh && !actionInFlight && !disposed) {
        pendingRefresh = false;
        refreshWithRecovery({ notify });
      }
    }
  }

  async function notifyCurrentState() {
    if (disposed) return state;
    await onRemoteState?.(state);
    return state;
  }

  function markTransportRecovery(error) {
    realtimeHealthy = false;
    subscriptionReconciled = false;
    onConnectionStatus?.("RECONNECTING", error);
    scheduleRecoveryRefresh();
  }

  function markSnapshotRecovery(error) {
    snapshotRecoveryPending = true;
    onConnectionStatus?.("RECONNECTING", error);
    scheduleRecoveryRefresh();
  }

  function markSnapshotRecovered() {
    if (!snapshotRecoveryPending) return;
    snapshotRecoveryPending = false;
    if (realtimeHealthy) {
      clearRecoveryTimer();
      onConnectionStatus?.("SUBSCRIBED");
    }
  }

  function refreshWithRecovery(options) {
    void refresh(options).catch(markSnapshotRecovery);
  }

  function retrySnapshotRecovery(options) {
    void refresh({ ...options, forceNotify: true })
      .then(markSnapshotRecovered)
      .catch(markSnapshotRecovery);
  }

  async function reconcileAmbiguousAction(expectedVersion) {
    try {
      const latestSnapshot = await getSnapshot(roomId);
      const latestVersion = Number(latestSnapshot?.game?.version) || 0;
      if (latestVersion > Number(expectedVersion)) return accept(latestSnapshot);
    } catch {
      // Keep the original action error as the user-facing failure and let recovery polling retry.
    }
    return null;
  }

  async function run(action) {
    if (actionInFlight) throw new Error("ACTION_IN_PROGRESS");
    actionInFlight = true;
    const expectedVersion = snapshot.game.version;
    const clientActionId = createActionId();
    const request = { roomId, expectedVersion, clientActionId };
    try {
      try {
        return accept(await action(request));
      } catch (error) {
        if (!isRetryableOnlineActionError(error)) throw error;
      }

      try {
        return accept(await action(request));
      } catch (retryError) {
        if (!isRetryableOnlineActionError(retryError)) throw retryError;
        const reconciledState = await reconcileAmbiguousAction(expectedVersion);
        if (reconciledState) return reconciledState;
        markTransportRecovery(retryError);
        throw retryError;
      }
    } finally {
      actionInFlight = false;
      if (pendingRefresh && !disposed) {
        pendingRefresh = false;
        refreshWithRecovery();
      }
    }
  }

  function clearRecoveryTimer() {
    if (recoveryTimer === null) return;
    window.clearTimeout(recoveryTimer);
    recoveryTimer = null;
  }

  function scheduleRecoveryRefresh() {
    if (disposed || recoveryTimer !== null || (realtimeHealthy && !snapshotRecoveryPending)) return;
    recoveryTimer = window.setTimeout(async () => {
      recoveryTimer = null;
      if (disposed || (realtimeHealthy && !snapshotRecoveryPending)) return;
      try {
        await refresh({ forceNotify: true });
        markSnapshotRecovered();
      } catch (error) {
        snapshotRecoveryPending = true;
        onConnectionStatus?.("RECONNECTING", error);
      } finally {
        if (!disposed && (!realtimeHealthy || snapshotRecoveryPending)) scheduleRecoveryRefresh();
      }
    }, RECOVERY_REFRESH_MS);
  }

  function handleRealtimeStatus(status, error) {
    onConnectionStatus?.(status, error);
    if (status === "SUBSCRIBED") {
      realtimeHealthy = true;
      if (snapshotRecoveryPending) {
        subscriptionReconciled = true;
        retrySnapshotRecovery();
        return;
      }
      clearRecoveryTimer();
      if (!subscriptionReconciled) {
        subscriptionReconciled = true;
        refreshWithRecovery();
      }
      return;
    }
    if (["CHANNEL_ERROR", "TIMED_OUT", "CLOSED"].includes(status)) {
      realtimeHealthy = false;
      subscriptionReconciled = false;
      scheduleRecoveryRefresh();
    }
  }

  try {
    unsubscribe = subscribeGame(roomId, {
      channelScope: "session",
      onChange: () => { refreshWithRecovery(); },
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
    refreshWithRecovery();
  };
  const handleOffline = () => {
    realtimeHealthy = false;
    onConnectionStatus?.("OFFLINE");
    scheduleRecoveryRefresh();
  };
  const visibilityDocument = globalThis.document;
  const handleVisibilityChange = () => {
    if (visibilityDocument?.visibilityState !== "visible") return;
    refreshWithRecovery();
  };
  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);
  visibilityDocument?.addEventListener?.("visibilitychange", handleVisibilityChange);

  sessionApi = Object.freeze({
    isOnline: true,
    roomId,
    getState() {
      return state;
    },
    getViewerPlayerId() {
      return snapshot.viewerPlayerId ?? null;
    },
    subscribeState(listener) {
      if (typeof listener !== "function") throw new Error("STATE_LISTENER_REQUIRED");
      stateListeners.add(listener);
      return () => stateListeners.delete(listener);
    },
    refresh,
    notifyCurrentState,
    roll() {
      return run(rollAction);
    },
    buy() {
      return run(buyAction);
    },
    build() {
      return run(buildAction);
    },
    endTurn() {
      return run(endTurnAction);
    },
    declinePropertyForAuction() {
      return run(declinePropertyForAuctionAction);
    },
    requestAuction() {
      return run(requestAuctionAction);
    },
    closeAuctionRequest() {
      return run(closeAuctionRequestAction);
    },
    auctionBid(amount) {
      return run((request) => bidAuctionAction({ ...request, amount, pass: false }));
    },
    auctionPass() {
      return run((request) => bidAuctionAction({ ...request, amount: null, pass: true }));
    },
    offerTrade(recipientPlayerId, terms, offerId = undefined) {
      if (!recipientPlayerId) throw new Error("TRADE_RECIPIENT_REQUIRED");
      return run((request) => offerTradeAction({
        ...request,
        recipientPlayerId,
        terms,
        offerId,
      }));
    },
    acceptTrade() {
      const offerId = state.pendingTrade?.offerId;
      if (!offerId) throw new Error("TRADE_NOT_OPEN");
      return run((request) => acceptTradeAction({ ...request, offerId }));
    },
    rejectTrade() {
      const offerId = state.pendingTrade?.offerId;
      if (!offerId) throw new Error("TRADE_NOT_OPEN");
      return run((request) => rejectTradeAction({ ...request, offerId }));
    },
    cancelTrade() {
      const offerId = state.pendingTrade?.offerId;
      if (!offerId) throw new Error("TRADE_NOT_OPEN");
      return run((request) => cancelTradeAction({ ...request, offerId }));
    },
    dispose() {
      disposed = true;
      realtimeHealthy = false;
      snapshotRecoveryPending = false;
      clearRecoveryTimer();
      unsubscribe?.();
      unsubscribe = null;
      stateListeners.clear();
      if (ACTIVE_ONLINE_SESSIONS.get(String(roomId)) === sessionApi) {
        ACTIVE_ONLINE_SESSIONS.delete(String(roomId));
      }
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      visibilityDocument?.removeEventListener?.("visibilitychange", handleVisibilityChange);
    },
  });
  ACTIVE_ONLINE_SESSIONS.set(String(roomId), sessionApi);
  return sessionApi;
}
