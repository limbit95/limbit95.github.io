import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createNoThanksLobbyController,
} from "../games/no-thanks/lobbyController.js";
import {
  NO_THANKS_LOBBY_VIEW,
} from "../games/no-thanks/runtimeModel.js";

class FakeDocument extends EventTarget {
  constructor() {
    super();
    this.visibilityState = "visible";
  }
}

function snapshot({
  version = 0,
  status = "waiting",
  readyA = false,
  readyB = false,
  activePlayerId = "host",
  centerCounters = 0,
  counters = 11,
  gamePhase = status === "playing" ? "PLAYING" : null,
  finalScores = null,
  winners = [],
} = {}) {
  return {
    version,
    room: {
      id: "room-1",
      roomCode: "ABC234",
      hostUserId: "host",
      status,
      maxPlayers: 7,
    },
    players: [
      {
        userId: "host",
        displayName: "Host",
        seat: 0,
        isReady: false,
        cards: [],
      },
      {
        userId: "guest-a",
        displayName: "Guest A",
        seat: 1,
        isReady: readyA,
        cards: [],
      },
      {
        userId: "guest-b",
        displayName: "Guest B",
        seat: 2,
        isReady: readyB,
        cards: [],
      },
    ],
    game: status === "playing"
      ? {
        phase: gamePhase,
        turnOrder: ["host", "guest-a", "guest-b"],
        activePlayerId,
        currentCard: gamePhase === "GAME_OVER" ? null : 17,
        centerCounters,
        deckRemaining: gamePhase === "GAME_OVER" ? 0 : 23,
        finalScores,
        winners,
        endReason: gamePhase === "GAME_OVER" ? "LAST_CARD_TAKEN" : null,
      }
      : null,
    viewer: {
      playerId: "guest-a",
      counters: status === "playing" ? counters : null,
    },
  };
}

function fakeAdapter({ activeSnapshot = null } = {}) {
  const calls = [];
  let currentSnapshot = activeSnapshot;
  let invalidationListener = null;
  let unsubscribed = 0;
  let deferredSnapshot = null;

  return {
    calls,
    setSnapshot(next) {
      currentSnapshot = next;
    },
    deferNextSnapshot() {
      let resolve;
      const promise = new Promise((nextResolve) => {
        resolve = nextResolve;
      });
      deferredSnapshot = { promise, resolve };
      return resolve;
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
      if (deferredSnapshot) {
        const pending = deferredSnapshot;
        deferredSnapshot = null;
        return pending.promise;
      }
      return currentSnapshot;
    },
    async setReady(input) {
      calls.push(["setReady", input]);
      currentSnapshot = snapshot({
        version: input.expectedVersion + 1,
        readyA: input.ready === true,
      });
      return currentSnapshot;
    },
    async leaveRoom(input) {
      calls.push(["leaveRoom", input]);
      currentSnapshot = null;
      return { left: true };
    },
    async startGame(input) {
      calls.push(["startGame", input]);
      currentSnapshot = snapshot({
        version: input.expectedVersion + 1,
        status: "playing",
        readyA: true,
        readyB: true,
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

function fakeGameplayAdapter({
  refuseSnapshot = null,
  takeSnapshot = null,
  endSnapshot = null,
} = {}) {
  const calls = [];
  return {
    calls,
    async refuseCard(input) {
      calls.push(["refuseCard", input]);
      return refuseSnapshot ?? snapshot({
        version: input.expectedVersion + 1,
        status: "playing",
        activePlayerId: "guest-b",
        centerCounters: 1,
        counters: 10,
      });
    },
    async takeCard(input) {
      calls.push(["takeCard", input]);
      return takeSnapshot ?? snapshot({
        version: input.expectedVersion + 1,
        status: "playing",
        activePlayerId: "guest-a",
        counters: 11,
      });
    },
    async endGame(input) {
      calls.push(["endGame", input]);
      return endSnapshot ?? snapshot({
        version: input.expectedVersion + 1,
        status: "playing",
        gamePhase: "GAME_OVER",
        activePlayerId: "host",
        finalScores: null,
        winners: [],
      });
    },
  };
}

function createController(adapter, gameplayAdapter = fakeGameplayAdapter()) {
  return createNoThanksLobbyController({
    adapter,
    gameplayAdapter,
    idFactory: () => "action-1",
    windowTarget: new EventTarget(),
    documentTarget: new FakeDocument(),
  });
}

test("No Thanks! lobby initializes to entry without an active room", async () => {
  const adapter = fakeAdapter();
  const controller = createController(adapter);

  await controller.initialize();

  assert.equal(controller.current().view, NO_THANKS_LOBBY_VIEW.ENTRY);
  assert.equal(controller.current().snapshot, null);
  assert.deepEqual(adapter.calls, [["getMyActiveRoom"]]);
});

test("No Thanks! lobby creates and joins rooms without nickname authority", async () => {
  const adapter = fakeAdapter();
  const controller = createController(adapter);

  await controller.createRoom({ maxPlayers: 6 });

  assert.equal(controller.current().view, NO_THANKS_LOBBY_VIEW.WAITING);
  assert.equal(controller.current().snapshot.room.roomCode, "ABC234");
  assert.deepEqual(adapter.calls.slice(0, 3), [
    ["createRoom", { maxPlayers: 6 }],
    ["subscribeInvalidation"],
    ["getLobbySnapshot", { roomId: "room-1" }],
  ]);

  controller.dispose();

  const joinAdapter = fakeAdapter();
  const joinController = createController(joinAdapter);
  await joinController.joinRoom({ roomCode: "ABC234" });

  assert.deepEqual(joinAdapter.calls[0], ["joinRoom", { roomCode: "ABC234" }]);
});

test("No Thanks! lobby sends versioned ready and start actions", async () => {
  const adapter = fakeAdapter({
    activeSnapshot: snapshot({ version: 2, readyB: true }),
  });
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

  adapter.setSnapshot(snapshot({
    version: 3,
    readyA: true,
    readyB: true,
  }));
  await controller.refresh("test-ready");
  await controller.startGame();

  assert.deepEqual(
    adapter.calls.find(([name]) => name === "startGame"),
    ["startGame", {
      roomId: "room-1",
      expectedVersion: 3,
      clientActionId: "action-1",
    }],
  );
  assert.equal(controller.current().view, NO_THANKS_LOBBY_VIEW.PLAYING);
});

test("No Thanks! Realtime invalidation reloads authoritative snapshot", async () => {
  const adapter = fakeAdapter({
    activeSnapshot: snapshot({ version: 1 }),
  });
  const controller = createController(adapter);

  await controller.initialize();
  const before = adapter.calls.filter(([name]) => name === "getLobbySnapshot").length;

  adapter.setSnapshot(snapshot({ version: 2, readyA: true }));
  adapter.invalidate();
  await new Promise((resolve) => setImmediate(resolve));

  const after = adapter.calls.filter(([name]) => name === "getLobbySnapshot").length;
  assert.equal(after, before + 1);
  assert.equal(controller.current().snapshot.version, 2);
  assert.equal(controller.current().snapshot.players[1].isReady, true);
});

test("No Thanks! leaving disposes room tracking and returns to entry", async () => {
  const adapter = fakeAdapter({
    activeSnapshot: snapshot({ version: 5 }),
  });
  const controller = createController(adapter);

  await controller.initialize();
  await controller.leaveRoom();

  assert.deepEqual(
    adapter.calls.find(([name]) => name === "leaveRoom"),
    ["leaveRoom", { roomId: "room-1", expectedVersion: 5 }],
  );
  assert.equal(controller.current().view, NO_THANKS_LOBBY_VIEW.ENTRY);
  assert.equal(controller.current().snapshot, null);
  assert.equal(adapter.unsubscribed(), 1);
});


test("No Thanks! ignores an older refresh that resolves after a newer command snapshot", async () => {
  const adapter = fakeAdapter({
    activeSnapshot: snapshot({ version: 1 }),
  });
  const controller = createController(adapter);

  await controller.initialize();
  const resolveRefresh = adapter.deferNextSnapshot();
  const refreshPromise = controller.refresh("race");

  await new Promise((resolve) => setImmediate(resolve));
  await controller.setReady(true);
  assert.equal(controller.current().snapshot.version, 2);

  resolveRefresh(snapshot({ version: 1 }));
  await refreshPromise;

  assert.equal(controller.current().snapshot.version, 2);
  assert.equal(controller.current().snapshot.players[1].isReady, true);
});


test("No Thanks! controller sends versioned refuse and take gameplay actions", async () => {
  const roomAdapter = fakeAdapter({
    activeSnapshot: snapshot({
      version: 8,
      status: "playing",
      activePlayerId: "guest-a",
    }),
  });
  const gameplayAdapter = fakeGameplayAdapter({
    refuseSnapshot: snapshot({
      version: 9,
      status: "playing",
      activePlayerId: "guest-b",
      centerCounters: 1,
      counters: 10,
    }),
  });
  const controller = createController(roomAdapter, gameplayAdapter);

  await controller.initialize();
  await controller.refuseCard();

  assert.deepEqual(gameplayAdapter.calls[0], ["refuseCard", {
    roomId: "room-1",
    expectedVersion: 8,
    clientActionId: "action-1",
  }]);
  assert.equal(controller.current().snapshot.version, 9);
  assert.equal(controller.current().snapshot.game.centerCounters, 1);

  controller.dispose();

  const takeRoom = fakeAdapter({
    activeSnapshot: snapshot({
      version: 12,
      status: "playing",
      activePlayerId: "guest-a",
      centerCounters: 2,
    }),
  });
  const takeGameplay = fakeGameplayAdapter({
    takeSnapshot: snapshot({
      version: 13,
      status: "playing",
      activePlayerId: "guest-a",
      centerCounters: 0,
      counters: 13,
    }),
  });
  const takeController = createController(takeRoom, takeGameplay);

  await takeController.initialize();
  await takeController.takeCard();

  assert.deepEqual(takeGameplay.calls[0], ["takeCard", {
    roomId: "room-1",
    expectedVersion: 12,
    clientActionId: "action-1",
  }]);
  assert.equal(takeController.current().snapshot.version, 13);
  assert.equal(takeController.current().snapshot.game.activePlayerId, "guest-a");
});

test("No Thanks! controller enters the terminal result view from takeCard", async () => {
  const roomAdapter = fakeAdapter({
    activeSnapshot: snapshot({
      version: 20,
      status: "playing",
      activePlayerId: "guest-a",
    }),
  });
  const gameplayAdapter = fakeGameplayAdapter({
    takeSnapshot: snapshot({
      version: 21,
      status: "playing",
      gamePhase: "GAME_OVER",
      activePlayerId: "guest-a",
      counters: 7,
      finalScores: {
        host: 15,
        "guest-a": 8,
        "guest-b": 8,
      },
      winners: ["guest-a", "guest-b"],
    }),
  });
  const controller = createController(roomAdapter, gameplayAdapter);

  await controller.initialize();
  await controller.takeCard();

  assert.equal(controller.current().view, NO_THANKS_LOBBY_VIEW.GAME_OVER);
  assert.equal(controller.current().snapshot.game.phase, "GAME_OVER");
});


test("No Thanks! controller sends a versioned host termination action", async () => {
  const roomAdapter = fakeAdapter({
    activeSnapshot: snapshot({
      version: 30,
      status: "playing",
      activePlayerId: "guest-a",
    }),
  });
  const gameplayAdapter = fakeGameplayAdapter({
    endSnapshot: snapshot({
      version: 31,
      status: "playing",
      gamePhase: "GAME_OVER",
      activePlayerId: "guest-a",
      finalScores: null,
      winners: [],
    }),
  });
  const controller = createController(roomAdapter, gameplayAdapter);

  await controller.initialize();
  await controller.endGame();

  assert.deepEqual(gameplayAdapter.calls[0], ["endGame", {
    roomId: "room-1",
    expectedVersion: 30,
    clientActionId: "action-1",
  }]);
  assert.equal(controller.current().view, NO_THANKS_LOBBY_VIEW.GAME_OVER);
});
