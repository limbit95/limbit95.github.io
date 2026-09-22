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
  roomId = "room-1",
  roomCode = "ABC234",
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
      id: roomId,
      roomCode,
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

function fakeAdapter({
  activeSnapshot = null,
  createdSnapshot = null,
} = {}) {
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
      currentSnapshot = createdSnapshot ?? snapshot({ version: 0 });
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

test("No Thanks! gameplay commands render only the authoritative result snapshot", async () => {
  const roomAdapter = fakeAdapter({
    activeSnapshot: snapshot({
      version: 14,
      status: "playing",
      activePlayerId: "guest-a",
    }),
  });
  const emissions = [];
  const controller = createNoThanksLobbyController({
    adapter: roomAdapter,
    gameplayAdapter: fakeGameplayAdapter({
      takeSnapshot: snapshot({
        version: 15,
        status: "playing",
        activePlayerId: "guest-a",
        centerCounters: 0,
        counters: 12,
      }),
    }),
    idFactory: () => "fast-action",
    windowTarget: new EventTarget(),
    documentTarget: new FakeDocument(),
    onState: (state) => emissions.push({
      version: state.snapshot?.version ?? null,
      busy: state.busy,
    }),
  });

  await controller.initialize();
  emissions.length = 0;

  await controller.takeCard();

  assert.deepEqual(emissions, [{
    version: 15,
    busy: false,
  }]);
  assert.equal(controller.current().busy, false);
  assert.equal(controller.current().snapshot.version, 15);
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


function fakePresenceAdapter() {
  const calls = [];
  let handlers = null;
  let unsubscribed = 0;

  return {
    calls,
    sync(userIds) {
      handlers?.onSync(userIds);
    },
    status(value) {
      handlers?.onStatus(value);
    },
    unsubscribed() {
      return unsubscribed;
    },
    subscribe(input) {
      calls.push(["subscribe", {
        roomId: input.roomId,
        userId: input.userId,
      }]);
      handlers = input;
      return () => {
        handlers = null;
        unsubscribed += 1;
      };
    },
  };
}

test("No Thanks! presence updates connectivity without mutating authoritative snapshot", async () => {
  const roomAdapter = fakeAdapter({
    activeSnapshot: snapshot({
      version: 4,
      status: "playing",
      activePlayerId: "host",
    }),
  });
  const presenceAdapter = fakePresenceAdapter();
  const windowTarget = new EventTarget();
  const controller = createNoThanksLobbyController({
    adapter: roomAdapter,
    gameplayAdapter: fakeGameplayAdapter(),
    presenceAdapter,
    idFactory: () => "presence-action",
    windowTarget,
    documentTarget: new FakeDocument(),
  });

  await controller.initialize();

  assert.deepEqual(presenceAdapter.calls[0], ["subscribe", {
    roomId: "room-1",
    userId: "guest-a",
  }]);

  presenceAdapter.sync(["guest-a", "guest-b"]);

  assert.equal(controller.current().presence.ready, true);
  assert.deepEqual(
    [...controller.current().presence.onlinePlayerIds].sort(),
    ["guest-a", "guest-b"],
  );
  assert.equal(controller.current().snapshot.version, 4);

  windowTarget.dispatchEvent(new Event("offline"));
  assert.equal(controller.current().connection, "offline");

  roomAdapter.setSnapshot(snapshot({
    version: 5,
    status: "playing",
    activePlayerId: "host",
  }));
  windowTarget.dispatchEvent(new Event("online"));
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(controller.current().connection, "connected");
  assert.equal(controller.current().snapshot.version, 5);

  controller.dispose();
  assert.equal(presenceAdapter.unsubscribed(), 1);
});

test("No Thanks! rematch policy closes the result room and creates a fresh room", async () => {
  const roomAdapter = fakeAdapter({
    activeSnapshot: snapshot({
      version: 40,
      status: "playing",
      gamePhase: "GAME_OVER",
      finalScores: {
        host: 8,
        "guest-a": 10,
        "guest-b": 12,
      },
      winners: ["host"],
    }),
  });
  const controller = createController(roomAdapter);

  await controller.initialize();
  await controller.createRematchRoom();

  assert.deepEqual(
    roomAdapter.calls.find(([name]) => name === "leaveRoom"),
    ["leaveRoom", {
      roomId: "room-1",
      expectedVersion: 40,
    }],
  );
  assert.deepEqual(
    roomAdapter.calls.find(([name]) => name === "createRoom"),
    ["createRoom", { maxPlayers: 7 }],
  );
  assert.equal(controller.current().view, NO_THANKS_LOBBY_VIEW.WAITING);
  assert.equal(controller.current().snapshot.version, 0);
});


test("No Thanks! rematch ignores a late snapshot from the closed result room", async () => {
  const oldResult = snapshot({
    version: 40,
    roomId: "room-old",
    roomCode: "OLD234",
    status: "playing",
    gamePhase: "GAME_OVER",
    finalScores: {
      host: 8,
      "guest-a": 10,
      "guest-b": 12,
    },
    winners: ["host"],
  });
  const freshRoom = snapshot({
    version: 0,
    roomId: "room-new",
    roomCode: "NEW234",
  });
  const roomAdapter = fakeAdapter({
    activeSnapshot: oldResult,
    createdSnapshot: freshRoom,
  });
  const controller = createController(roomAdapter);

  await controller.initialize();

  const resolveOldRefresh = roomAdapter.deferNextSnapshot();
  const oldRefresh = controller.refresh("old-result-race");
  await new Promise((resolve) => setImmediate(resolve));

  await controller.createRematchRoom();

  assert.equal(controller.current().snapshot.room.id, "room-new");
  assert.equal(controller.current().snapshot.version, 0);
  assert.equal(controller.current().view, NO_THANKS_LOBBY_VIEW.WAITING);

  resolveOldRefresh(oldResult);
  await oldRefresh;

  assert.equal(controller.current().snapshot.room.id, "room-new");
  assert.equal(controller.current().snapshot.room.roomCode, "NEW234");
  assert.equal(controller.current().snapshot.version, 0);
  assert.equal(controller.current().view, NO_THANKS_LOBBY_VIEW.WAITING);
});
