import assert from "node:assert/strict";
import { test } from "node:test";

import {
  CANT_STOP_LOBBY_VIEW,
  createCantStopLobbyController,
} from "../games/cant-stop/lobbyController.js";

class FakeDocument extends EventTarget {
  visibilityState = "visible";
}

function snapshot({
  version = 0,
  status = "waiting",
  canStart = false,
  ready = false,
} = {}) {
  return {
    version,
    room: {
      id: "room-1",
      roomCode: "ABC234",
      hostUserId: "alice",
      status,
      version,
      maxPlayers: 4,
      playerCount: 2,
      allReady: canStart,
      canStart,
    },
    players: [
      {
        id: "alice",
        userId: "alice",
        displayName: "Alice",
        nickname: "Alice",
        seat: 0,
        isReady: true,
        connected: true,
        isHost: true,
      },
      {
        id: "bob",
        userId: "bob",
        displayName: "Bob",
        nickname: "Bob",
        seat: 1,
        isReady: ready,
        connected: true,
        isHost: false,
      },
    ],
    game: status === "playing" ? { phase: "TURN_ROLL" } : null,
    viewerUserId: "bob",
  };
}

function fakeAdapter({ activeSnapshot = null } = {}) {
  const calls = [];
  let currentSnapshot = activeSnapshot;
  let invalidationListener = null;
  let unsubscribed = 0;

  return {
    calls,
    setSnapshot(next) {
      currentSnapshot = next;
    },
    invalidate() {
      invalidationListener?.();
    },
    unsubscribed() {
      return unsubscribed;
    },
    async createRoom(input) {
      calls.push(["createRoom", input]);
      currentSnapshot = snapshot({ version: 0 });
      return currentSnapshot;
    },
    async joinRoom(input) {
      calls.push(["joinRoom", input]);
      currentSnapshot = snapshot({ version: 1 });
      return currentSnapshot;
    },
    async getMyActiveRoom() {
      calls.push(["getMyActiveRoom"]);
      return currentSnapshot;
    },
    async getLobbySnapshot(input) {
      calls.push(["getLobbySnapshot", input]);
      return currentSnapshot;
    },
    async setReady(input) {
      calls.push(["setReady", input]);
      currentSnapshot = snapshot({
        version: input.expectedVersion + 1,
        canStart: input.ready === true,
        ready: input.ready === true,
      });
      return currentSnapshot;
    },
    async leaveRoom(input) {
      calls.push(["leaveRoom", input]);
      currentSnapshot = null;
      return null;
    },
    async startGame(input) {
      calls.push(["startGame", input]);
      currentSnapshot = snapshot({
        version: input.expectedVersion + 1,
        status: "playing",
        canStart: true,
        ready: true,
      });
      return currentSnapshot;
    },
    subscribeInvalidation(listener) {
      calls.push(["subscribeInvalidation"]);
      invalidationListener = listener;
      return () => {
        invalidationListener = null;
        unsubscribed += 1;
      };
    },
  };
}

function createController(adapter, states = []) {
  return createCantStopLobbyController({
    adapter,
    idFactory: () => "action-1",
    onState: (state) => states.push(state),
    windowTarget: new EventTarget(),
    documentTarget: new FakeDocument(),
  });
}

test("Can't Stop lobby controller initializes to entry when no active room exists", async () => {
  const adapter = fakeAdapter();
  const states = [];
  const controller = createController(adapter, states);

  await controller.initialize();

  assert.equal(controller.current().view, CANT_STOP_LOBBY_VIEW.ENTRY);
  assert.equal(controller.current().snapshot, null);
  assert.equal(controller.current().busy, false);
  assert.deepEqual(adapter.calls, [["getMyActiveRoom"]]);
});

test("Can't Stop lobby controller creates a room and starts authoritative snapshot tracking", async () => {
  const adapter = fakeAdapter();
  const controller = createController(adapter);

  await controller.createRoom({ nickname: "Alice", maxPlayers: 4 });

  assert.equal(controller.current().view, CANT_STOP_LOBBY_VIEW.WAITING);
  assert.equal(controller.current().snapshot.room.roomCode, "ABC234");
  assert.deepEqual(adapter.calls.slice(0, 3), [
    ["createRoom", { nickname: "Alice", maxPlayers: 4 }],
    ["subscribeInvalidation"],
    ["getLobbySnapshot", { roomId: "room-1" }],
  ]);
});

test("Can't Stop lobby controller sends versioned ready and start actions", async () => {
  const adapter = fakeAdapter({ activeSnapshot: snapshot({ version: 2 }) });
  const controller = createController(adapter);

  await controller.initialize();
  await controller.setReady(true);

  assert.deepEqual(
    adapter.calls.find(([name]) => name === "setReady"),
    ["setReady", {
      roomId: "room-1",
      ready: true,
      expectedVersion: 2,
      clientActionId: "action-1",
    }],
  );
  assert.equal(controller.current().snapshot.version, 3);

  await controller.startGame();
  assert.deepEqual(
    adapter.calls.find(([name]) => name === "startGame"),
    ["startGame", {
      roomId: "room-1",
      expectedVersion: 3,
      clientActionId: "action-1",
    }],
  );
  assert.equal(controller.current().view, CANT_STOP_LOBBY_VIEW.PLAYING);
  assert.equal(controller.current().snapshot.version, 4);
});

test("Can't Stop lobby controller treats Realtime as invalidation and reloads the snapshot", async () => {
  const adapter = fakeAdapter({ activeSnapshot: snapshot({ version: 1 }) });
  const controller = createController(adapter);

  await controller.initialize();
  const beforeReloads = adapter.calls.filter(([name]) => name === "getLobbySnapshot").length;

  adapter.setSnapshot(snapshot({ version: 2, ready: true }));
  adapter.invalidate();
  await new Promise((resolve) => setImmediate(resolve));

  const afterReloads = adapter.calls.filter(([name]) => name === "getLobbySnapshot").length;
  assert.equal(afterReloads, beforeReloads + 1);
  assert.equal(controller.current().snapshot.version, 2);
  assert.equal(controller.current().snapshot.players[1].isReady, true);
});

test("Can't Stop lobby controller leaves the room and disposes room subscriptions", async () => {
  const adapter = fakeAdapter({ activeSnapshot: snapshot({ version: 5 }) });
  const controller = createController(adapter);

  await controller.initialize();
  await controller.leaveRoom();

  assert.deepEqual(
    adapter.calls.find(([name]) => name === "leaveRoom"),
    ["leaveRoom", { roomId: "room-1", expectedVersion: 5 }],
  );
  assert.equal(controller.current().view, CANT_STOP_LOBBY_VIEW.ENTRY);
  assert.equal(controller.current().snapshot, null);
  assert.equal(adapter.unsubscribed(), 1);
});
