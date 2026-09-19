import {
  createClientActionId,
  createReconnectRefreshTriggers,
  createSnapshotCoordinator,
} from "../shared/index.js";

export const CANT_STOP_LOBBY_VIEW = Object.freeze({
  ENTRY: "entry",
  WAITING: "waiting",
  PLAYING: "playing",
});

function requireGameplayAdapter(adapter) {
  const methods = [
    "rollDice",
    "choosePairing",
    "continueTurn",
    "stopTurn",
    "endGame",
    "prepareRematch",
  ];
  for (const method of methods) {
    if (typeof adapter?.[method] !== "function") {
      throw new TypeError(`Can't Stop lobby controller requires gameplayAdapter.${method}().`);
    }
  }
  return adapter;
}

function requireInviteAdapter(adapter) {
  if (typeof adapter?.joinRoomFromInvite !== "function") {
    throw new TypeError("Can't Stop lobby controller requires inviteAdapter.joinRoomFromInvite().");
  }
  return adapter;
}

function requireAdapter(adapter) {
  const methods = [
    "createRoom",
    "joinRoom",
    "getMyActiveRoom",
    "getLobbySnapshot",
    "setReady",
    "leaveRoom",
    "startGame",
    "subscribeInvalidation",
  ];
  for (const method of methods) {
    if (typeof adapter?.[method] !== "function") {
      throw new TypeError(`Can't Stop lobby controller requires adapter.${method}().`);
    }
  }
  return adapter;
}

function lobbyView(snapshot) {
  if (!snapshot?.room) return CANT_STOP_LOBBY_VIEW.ENTRY;
  return snapshot.room.status === "playing"
    ? CANT_STOP_LOBBY_VIEW.PLAYING
    : CANT_STOP_LOBBY_VIEW.WAITING;
}

function freezeState(state) {
  return Object.freeze({ ...state });
}

export function createCantStopLobbyController({
  adapter,
  gameplayAdapter = null,
  inviteAdapter = null,
  idFactory = createClientActionId,
  onState = () => {},
  onError = () => {},
  windowTarget = globalThis.window,
  documentTarget = globalThis.document,
} = {}) {
  const roomLobby = requireAdapter(adapter);
  const gameplay = gameplayAdapter == null ? null : requireGameplayAdapter(gameplayAdapter);
  const invite = inviteAdapter == null ? null : requireInviteAdapter(inviteAdapter);
  if (typeof idFactory !== "function") {
    throw new TypeError("Can't Stop lobby controller requires idFactory().");
  }
  if (typeof onState !== "function" || typeof onError !== "function") {
    throw new TypeError("Can't Stop lobby controller callbacks must be functions.");
  }

  let state = freezeState({
    view: CANT_STOP_LOBBY_VIEW.ENTRY,
    snapshot: null,
    busy: false,
    busyAction: null,
    effect: null,
    connection: "connected",
    error: null,
  });
  let coordinator = null;
  let reconnectTriggers = null;
  let trackedRoomId = null;
  let disposed = false;

  function emit(patch = {}) {
    if (disposed) return state;
    state = freezeState({
      ...state,
      ...patch,
    });
    onState(state);
    return state;
  }

  function deriveSnapshotEffect(previous, next) {
    const previousGame = previous?.game;
    const nextGame = next?.game;
    if (
      previous?.room?.status === "playing"
      && next?.room?.status === "playing"
      && previousGame?.phase === "TURN_ROLL"
      && nextGame?.phase === "TURN_ROLL"
      && previousGame?.activePlayerId
      && nextGame?.activePlayerId
      && previousGame.activePlayerId !== nextGame.activePlayerId
      && Number(next?.version) > Number(previous?.version)
    ) {
      return Object.freeze({
        type: "bust",
        playerId: String(previousGame.activePlayerId),
        version: Number(next.version),
      });
    }
    return null;
  }

  function applySnapshot(snapshot, patch = {}) {
    const hasExplicitEffect = Object.hasOwn(patch, "effect");
    return emit({
      snapshot: snapshot ?? null,
      view: lobbyView(snapshot),
      error: null,
      effect: hasExplicitEffect ? patch.effect : deriveSnapshotEffect(state.snapshot, snapshot),
      ...patch,
    });
  }

  function stopTracking() {
    reconnectTriggers?.stop();
    reconnectTriggers = null;
    coordinator?.dispose();
    coordinator = null;
    trackedRoomId = null;
  }

  async function trackRoom(snapshot) {
    const roomId = snapshot?.room?.id;
    if (typeof roomId !== "string" || !roomId.trim()) {
      stopTracking();
      applySnapshot(null, { connection: "connected" });
      return null;
    }

    if (trackedRoomId === roomId && coordinator) {
      applySnapshot(snapshot, { connection: "connected" });
      return snapshot;
    }

    stopTracking();
    trackedRoomId = roomId;

    coordinator = createSnapshotCoordinator({
      loadSnapshot: () => roomLobby.getLobbySnapshot({ roomId }),
      subscribeInvalidation: roomLobby.subscribeInvalidation,
      onSnapshot: (nextSnapshot) => {
        applySnapshot(nextSnapshot, { connection: "connected" });
      },
      onError: (error) => {
        emit({ connection: "error", error });
        onError(error);
      },
    });

    reconnectTriggers = createReconnectRefreshTriggers({
      refresh: async (reason) => {
        emit({ connection: "reconnecting", error: null });
        const result = await coordinator.refresh(reason);
        emit({ connection: "connected" });
        return result;
      },
      windowTarget,
      documentTarget,
      onError: (error) => {
        emit({ connection: "error", error });
        onError(error);
      },
    });

    applySnapshot(snapshot, { connection: "connected" });
    await coordinator.start();
    reconnectTriggers.start();
    return state.snapshot;
  }

  async function command(operation, busyAction = null) {
    if (disposed) throw new Error("Can't Stop lobby controller has been disposed.");
    if (state.busy) throw new Error("Can't Stop lobby action is already in progress.");

    emit({ busy: true, busyAction, error: null });
    try {
      return await operation();
    } catch (error) {
      emit({ error, connection: state.snapshot ? "error" : state.connection });
      onError(error);
      throw error;
    } finally {
      emit({ busy: false, busyAction: null });
    }
  }

  async function initialize() {
    return command(async () => {
      const snapshot = await roomLobby.getMyActiveRoom();
      if (!snapshot) {
        stopTracking();
        applySnapshot(null, { connection: "connected" });
        return null;
      }
      return trackRoom(snapshot);
    });
  }

  async function createRoom({ nickname, maxPlayers = 4 }) {
    return command(async () => {
      const snapshot = await roomLobby.createRoom({ nickname, maxPlayers });
      return trackRoom(snapshot);
    });
  }

  async function joinRoom({ roomCode, nickname }) {
    return command(async () => {
      const snapshot = await roomLobby.joinRoom({ roomCode, nickname });
      return trackRoom(snapshot);
    });
  }

  async function joinInvite({ token, nickname }) {
    return command(async () => {
      if (!invite) {
        throw new Error("Can't Stop invite adapter is not configured.");
      }
      const joined = await invite.joinRoomFromInvite({ token, nickname });
      const roomId = joined?.room?.id;
      if (typeof roomId !== "string" || !roomId.trim()) {
        throw new Error("Can't Stop invite join returned no room.");
      }
      const snapshot = await roomLobby.getLobbySnapshot({ roomId });
      return trackRoom(snapshot);
    });
  }

  async function setReady(ready) {
    return command(async () => {
      const snapshot = state.snapshot;
      if (!snapshot?.room?.id) throw new Error("Can’t Stop room is not active.");
      const next = await roomLobby.setReady({
        roomId: snapshot.room.id,
        ready: ready === true,
        expectedVersion: Number(snapshot.version),
        clientActionId: idFactory(),
      });
      applySnapshot(next, { connection: "connected" });
      return next;
    });
  }

  async function startGame() {
    return command(async () => {
      const snapshot = state.snapshot;
      if (!snapshot?.room?.id) throw new Error("Can’t Stop room is not active.");
      const next = await roomLobby.startGame({
        roomId: snapshot.room.id,
        expectedVersion: Number(snapshot.version),
        clientActionId: idFactory(),
      });
      applySnapshot(next, { connection: "connected" });
      return next;
    });
  }

  async function leaveRoom() {
    return command(async () => {
      const snapshot = state.snapshot;
      if (!snapshot?.room?.id) return null;
      await roomLobby.leaveRoom({
        roomId: snapshot.room.id,
        expectedVersion: Number(snapshot.version),
      });
      stopTracking();
      applySnapshot(null, { connection: "connected" });
      return null;
    });
  }

  function requireGameplay() {
    if (!gameplay) {
      throw new Error("Can't Stop gameplay adapter is not configured.");
    }
    return gameplay;
  }

  async function gameplayCommand(method, payload = {}) {
    return command(async () => {
      const snapshot = state.snapshot;
      if (!snapshot?.room?.id || snapshot.room.status !== "playing") {
        throw new Error("Can’t Stop game is not active.");
      }
      const previousActivePlayerId = String(snapshot.game?.activePlayerId ?? "");
      const next = await requireGameplay()[method]({
        roomId: snapshot.room.id,
        expectedVersion: Number(snapshot.version),
        clientActionId: idFactory(),
        ...payload,
      });
      const nextActivePlayerId = String(next?.game?.activePlayerId ?? "");
      const busted = method === "rollDice"
        && next?.game?.phase === "TURN_ROLL"
        && previousActivePlayerId
        && nextActivePlayerId
        && previousActivePlayerId !== nextActivePlayerId;
      applySnapshot(next, {
        connection: "connected",
        effect: busted
          ? Object.freeze({
            type: "bust",
            playerId: previousActivePlayerId,
            version: Number(next.version),
          })
          : null,
      });
      return next;
    }, method);
  }

  function rollDice() {
    return gameplayCommand("rollDice");
  }

  function choosePairing({ sums, columns }) {
    return gameplayCommand("choosePairing", { sums, columns });
  }

  function continueTurn() {
    return gameplayCommand("continueTurn");
  }

  function stopTurn() {
    return gameplayCommand("stopTurn");
  }

  function endGame() {
    return gameplayCommand("endGame");
  }

  function prepareRematch() {
    return gameplayCommand("prepareRematch");
  }

  async function refresh(reason = "manual") {
    if (!coordinator) {
      const snapshot = await roomLobby.getMyActiveRoom();
      return snapshot ? trackRoom(snapshot) : applySnapshot(null);
    }
    emit({ connection: "reconnecting", error: null });
    const result = await coordinator.refresh(reason);
    emit({ connection: "connected" });
    return result;
  }

  function current() {
    return state;
  }

  function dispose() {
    if (disposed) return;
    stopTracking();
    disposed = true;
  }

  return Object.freeze({
    initialize,
    createRoom,
    joinRoom,
    joinInvite,
    setReady,
    startGame,
    leaveRoom,
    rollDice,
    choosePairing,
    continueTurn,
    stopTurn,
    endGame,
    prepareRematch,
    refresh,
    current,
    dispose,
  });
}
