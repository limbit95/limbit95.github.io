import {
  createClientActionId,
  createReconnectRefreshTriggers,
  createSnapshotCoordinator,
} from "../shared/index.js";
import { NO_THANKS_LOBBY_VIEW } from "./runtimeModel.js";

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
      throw new TypeError(`No Thanks! lobby controller requires adapter.${method}().`);
    }
  }
  return adapter;
}

function lobbyView(snapshot) {
  if (!snapshot?.room) return NO_THANKS_LOBBY_VIEW.ENTRY;
  return snapshot.room.status === "playing"
    ? NO_THANKS_LOBBY_VIEW.PLAYING
    : NO_THANKS_LOBBY_VIEW.WAITING;
}

function freezeState(state) {
  return Object.freeze({ ...state });
}

function errorText(error) {
  return [error?.message, error?.details, error?.hint, error?.code]
    .filter(Boolean)
    .join(" ");
}

export function createNoThanksLobbyController({
  adapter,
  idFactory = createClientActionId,
  onState = () => {},
  onError = () => {},
  windowTarget = globalThis.window,
  documentTarget = globalThis.document,
} = {}) {
  const roomLobby = requireAdapter(adapter);
  if (typeof idFactory !== "function") {
    throw new TypeError("No Thanks! lobby controller requires idFactory().");
  }
  if (typeof onState !== "function" || typeof onError !== "function") {
    throw new TypeError("No Thanks! lobby controller callbacks must be functions.");
  }

  let state = freezeState({
    view: NO_THANKS_LOBBY_VIEW.ENTRY,
    snapshot: null,
    busy: false,
    connection: "connected",
    error: null,
  });
  let coordinator = null;
  let reconnectTriggers = null;
  let trackedRoomId = null;
  let disposed = false;

  function emit(patch = {}) {
    if (disposed) return state;
    state = freezeState({ ...state, ...patch });
    onState(state);
    return state;
  }

  function applySnapshot(snapshot, patch = {}) {
    const currentVersion = state.snapshot?.version;
    const nextVersion = snapshot?.version;
    if (
      snapshot
      && Number.isInteger(currentVersion)
      && Number.isInteger(nextVersion)
      && nextVersion < currentVersion
    ) {
      return state;
    }

    return emit({
      snapshot: snapshot ?? null,
      view: lobbyView(snapshot),
      error: null,
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

  function recoverMissingRoom(error) {
    if (!errorText(error).includes("ROOM_NOT_FOUND")) return false;
    stopTracking();
    applySnapshot(null, { connection: "connected" });
    return true;
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
        if (recoverMissingRoom(error)) return;
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
        if (recoverMissingRoom(error)) return;
        emit({ connection: "error", error });
        onError(error);
      },
    });

    applySnapshot(snapshot, { connection: "connected" });
    await coordinator.start();
    reconnectTriggers.start();
    return state.snapshot;
  }

  async function command(operation) {
    if (disposed) throw new Error("No Thanks! lobby controller has been disposed.");
    if (state.busy) throw new Error("No Thanks! lobby action is already in progress.");

    emit({ busy: true, error: null });
    try {
      return await operation();
    } catch (error) {
      if (!recoverMissingRoom(error)) {
        emit({ error, connection: state.snapshot ? "error" : state.connection });
        onError(error);
      }
      throw error;
    } finally {
      emit({ busy: false });
    }
  }

  async function initialize() {
    return command(async () => {
      const snapshot = await roomLobby.getMyActiveRoom();
      return snapshot ? trackRoom(snapshot) : applySnapshot(null, { connection: "connected" });
    });
  }

  async function createRoom({ maxPlayers = 7 } = {}) {
    return command(async () => {
      const snapshot = await roomLobby.createRoom({ maxPlayers });
      return trackRoom(snapshot);
    });
  }

  async function joinRoom({ roomCode }) {
    return command(async () => {
      const snapshot = await roomLobby.joinRoom({ roomCode });
      return trackRoom(snapshot);
    });
  }

  async function setReady(ready) {
    return command(async () => {
      const snapshot = state.snapshot;
      if (!snapshot?.room?.id) throw new Error("No Thanks! room is not active.");
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
      if (!snapshot?.room?.id) throw new Error("No Thanks! room is not active.");
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

  async function refresh(reason = "manual") {
    if (disposed) throw new Error("No Thanks! lobby controller has been disposed.");

    if (!coordinator) {
      emit({ connection: "reconnecting", error: null });
      try {
        const snapshot = await roomLobby.getMyActiveRoom();
        if (!snapshot) return applySnapshot(null, { connection: "connected" });
        return await trackRoom(snapshot);
      } catch (error) {
        if (recoverMissingRoom(error)) return null;
        emit({ connection: "error", error });
        onError(error);
        throw error;
      }
    }

    emit({ connection: "reconnecting", error: null });
    try {
      const result = await coordinator.refresh(reason);
      emit({ connection: "connected" });
      return result;
    } catch (error) {
      if (recoverMissingRoom(error)) return null;
      emit({ connection: "error", error });
      onError(error);
      throw error;
    }
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
    setReady,
    startGame,
    leaveRoom,
    refresh,
    current,
    dispose,
  });
}
