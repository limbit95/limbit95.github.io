import test from "node:test";
import assert from "node:assert/strict";

const originalWindow = globalThis.window;
globalThis.window = globalThis.window ?? {};
const {
  createOnlineClassicSession,
  mapOnlineGameSnapshot,
} = await import("../js/onlineSession.js");
globalThis.window = originalWindow;

function trade({
  offerId = "trade-1",
  proposerPlayerId = "p1",
  recipientPlayerId = "p2",
  offeredPropertyIds = ["singapore"],
  offeredGold = 100,
  requestedPropertyIds = ["tokyo"],
  requestedGold = 50,
} = {}) {
  return {
    type: "PLAYER_TRADE",
    offerId,
    proposerPlayerId,
    recipientPlayerId,
    terms: {
      offered: { propertyIds: offeredPropertyIds, gold: offeredGold },
      requested: { propertyIds: requestedPropertyIds, gold: requestedGold },
    },
    status: "OPEN",
    resolvedByPlayerId: null,
  };
}

function snapshot(version, {
  pendingTrade = null,
  viewerPlayerId = "p1",
  playerMoney = { p1: 1500, p2: 1500 },
  properties = {
    singapore: { ownerId: "p1", ownerSeat: 0, buildingLevel: 0 },
    tokyo: { ownerId: "p2", ownerSeat: 1, buildingLevel: 0 },
  },
  lastEvents = [],
} = {}) {
  return {
    room: { id: "room-1", roomCode: "ABC123", status: "playing", currentGameId: "game-1" },
    game: {
      id: "game-1",
      status: "playing",
      phase: "WAITING_ROLL",
      turn: 3,
      currentSeat: 0,
      version,
      pendingChoice: null,
      pendingTrade,
      lastRoll: null,
      lastEvents,
      winnerPlayerId: null,
      rulesetVersion: 1,
    },
    players: [
      { id: "p1", userId: "u1", name: "A", seat: 0, positionNodeId: "start", money: playerMoney.p1, bankrupt: false, skipTurns: 0 },
      { id: "p2", userId: "u2", name: "B", seat: 1, positionNodeId: "start", money: playerMoney.p2, bankrupt: false, skipTurns: 0 },
    ],
    properties,
    viewerUserId: viewerPlayerId === "p2" ? "u2" : "u1",
    viewerPlayerId,
  };
}

function installFakeBrowser() {
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  const timers = new Map();
  let nextTimerId = 1;

  globalThis.window = {
    setTimeout(callback) {
      const id = nextTimerId++;
      timers.set(id, callback);
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
    addEventListener() {},
    removeEventListener() {},
  };
  globalThis.document = {
    visibilityState: "visible",
    addEventListener() {},
    removeEventListener() {},
  };

  return {
    timers,
    restore() {
      globalThis.window = previousWindow;
      globalThis.document = previousDocument;
    },
  };
}

function flush() {
  return new Promise((resolve) => setImmediate(resolve));
}

test("pending trade survives snapshot mapping as immutable nested state", () => {
  const state = mapOnlineGameSnapshot(snapshot(7, { pendingTrade: trade() }));

  assert.equal(state.pendingTrade.offerId, "trade-1");
  assert.equal(state.pendingTrade.proposerPlayerId, "p1");
  assert.equal(state.pendingTrade.recipientPlayerId, "p2");
  assert.deepEqual(state.pendingTrade.terms.offered.propertyIds, ["singapore"]);
  assert.deepEqual(state.pendingTrade.terms.requested.propertyIds, ["tokyo"]);
  assert.equal(Object.isFrozen(state.pendingTrade), true);
  assert.equal(Object.isFrozen(state.pendingTrade.terms), true);
  assert.equal(Object.isFrozen(state.pendingTrade.terms.offered), true);
  assert.equal(Object.isFrozen(state.pendingTrade.terms.offered.propertyIds), true);
});

test("realtime version refresh carries trade open and settlement snapshots", async () => {
  const browser = installFakeBrowser();
  let latestSnapshot = snapshot(10);
  let realtimeChange = null;
  const remoteStates = [];

  try {
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: latestSnapshot,
      onRemoteState(state) {
        remoteStates.push({
          version: state.version,
          offerId: state.pendingTrade?.offerId ?? null,
          singaporeOwner: state.boardState.properties.singapore.ownerId,
        });
      },
      api: {
        async getSnapshot() {
          return latestSnapshot;
        },
        subscribeGame(_roomId, { onChange }) {
          realtimeChange = onChange;
          return () => {};
        },
      },
    });

    latestSnapshot = snapshot(11, { pendingTrade: trade() });
    realtimeChange();
    await flush();

    assert.equal(session.getState().version, 11);
    assert.equal(session.getState().pendingTrade.offerId, "trade-1");

    latestSnapshot = snapshot(12, {
      pendingTrade: null,
      playerMoney: { p1: 1450, p2: 1550 },
      properties: {
        singapore: { ownerId: "p2", ownerSeat: 1, buildingLevel: 0 },
        tokyo: { ownerId: "p1", ownerSeat: 0, buildingLevel: 0 },
      },
      lastEvents: [
        { type: "TRADE_ACCEPTED", offerId: "trade-1" },
        { type: "TRADE_SETTLED", offerId: "trade-1" },
      ],
    });
    realtimeChange();
    await flush();

    assert.equal(session.getState().version, 12);
    assert.equal(session.getState().pendingTrade, null);
    assert.equal(session.getState().boardState.properties.singapore.ownerId, "p2");
    assert.equal(session.getState().players[0].money, 1450);
    assert.deepEqual(remoteStates, [
      { version: 11, offerId: "trade-1", singaporeOwner: "p1" },
      { version: 12, offerId: null, singaporeOwner: "p2" },
    ]);

    session.dispose();
  } finally {
    browser.restore();
  }
});

test("channel recovery restores an open trade from the authoritative snapshot", async () => {
  const browser = installFakeBrowser();
  let latestSnapshot = snapshot(20);
  let realtimeStatus = null;

  try {
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: latestSnapshot,
      api: {
        async getSnapshot() {
          return latestSnapshot;
        },
        subscribeGame(_roomId, { onStatus }) {
          realtimeStatus = onStatus;
          return () => {};
        },
      },
    });

    realtimeStatus("SUBSCRIBED");
    await flush();

    latestSnapshot = snapshot(21, {
      pendingTrade: trade({ offerId: "trade-recovered" }),
    });
    realtimeStatus("CLOSED");
    assert.equal(browser.timers.size, 1);

    const [timerId, recovery] = browser.timers.entries().next().value;
    browser.timers.delete(timerId);
    await recovery();
    await flush();

    assert.equal(session.getState().version, 21);
    assert.equal(session.getState().pendingTrade.offerId, "trade-recovered");

    realtimeStatus("SUBSCRIBED");
    await flush();
    session.dispose();
  } finally {
    browser.restore();
  }
});

test("online session sends trade offer through the shared versioned action path", async () => {
  const browser = installFakeBrowser();
  const calls = [];
  const actionId = "11111111-1111-4111-8111-111111111111";

  try {
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: snapshot(30),
      api: {
        createActionId: () => actionId,
        subscribeGame: () => () => {},
        async offerTrade(request) {
          calls.push(request);
          return snapshot(31, {
            pendingTrade: trade({ offerId: "trade-explicit" }),
          });
        },
      },
    });

    const state = await session.offerTrade(
      "p2",
      {
        offered: { propertyIds: ["singapore"], gold: 100 },
        requested: { propertyIds: ["tokyo"], gold: 50 },
      },
      "trade-explicit",
    );

    assert.equal(state.pendingTrade.offerId, "trade-explicit");
    assert.deepEqual(calls, [{
      roomId: "room-1",
      expectedVersion: 30,
      clientActionId: actionId,
      recipientPlayerId: "p2",
      terms: {
        offered: { propertyIds: ["singapore"], gold: 100 },
        requested: { propertyIds: ["tokyo"], gold: 50 },
      },
      offerId: "trade-explicit",
    }]);

    session.dispose();
  } finally {
    browser.restore();
  }
});

test("recipient trade acceptance retries with the same action identity and offer id", async () => {
  const browser = installFakeBrowser();
  const calls = [];
  const actionId = "22222222-2222-4222-8222-222222222222";

  try {
    let attempt = 0;
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: snapshot(40, {
        viewerPlayerId: "p2",
        pendingTrade: trade({ offerId: "trade-retry" }),
      }),
      api: {
        createActionId: () => actionId,
        subscribeGame: () => () => {},
        async getSnapshot() {
          return snapshot(40, {
            viewerPlayerId: "p2",
            pendingTrade: trade({ offerId: "trade-retry" }),
          });
        },
        async acceptTrade(request) {
          calls.push(request);
          attempt += 1;
          if (attempt === 1) throw new TypeError("Failed to fetch");
          return snapshot(41, {
            viewerPlayerId: "p2",
            pendingTrade: null,
            playerMoney: { p1: 1450, p2: 1550 },
            properties: {
              singapore: { ownerId: "p2", ownerSeat: 1, buildingLevel: 0 },
              tokyo: { ownerId: "p1", ownerSeat: 0, buildingLevel: 0 },
            },
          });
        },
      },
    });

    const state = await session.acceptTrade();

    assert.equal(state.version, 41);
    assert.equal(state.pendingTrade, null);
    assert.equal(calls.length, 2);
    assert.deepEqual(calls[0], {
      roomId: "room-1",
      expectedVersion: 40,
      clientActionId: actionId,
      offerId: "trade-retry",
    });
    assert.deepEqual(calls[1], calls[0]);

    session.dispose();
  } finally {
    browser.restore();
  }
});

test("trade reject uses the current pending offer id and stale snapshots cannot roll state backward", async () => {
  const browser = installFakeBrowser();
  const rejectCalls = [];

  try {
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: snapshot(50, {
        viewerPlayerId: "p2",
        pendingTrade: trade({ offerId: "trade-reject" }),
      }),
      api: {
        createActionId: () => "33333333-3333-4333-8333-333333333333",
        subscribeGame: () => () => {},
        async rejectTrade(request) {
          rejectCalls.push(request);
          return snapshot(51, { viewerPlayerId: "p2", pendingTrade: null });
        },
        async getSnapshot() {
          return snapshot(49, {
            viewerPlayerId: "p2",
            pendingTrade: trade({ offerId: "stale-trade" }),
          });
        },
      },
    });

    await session.rejectTrade();
    assert.equal(session.getState().version, 51);
    assert.equal(session.getState().pendingTrade, null);
    assert.equal(rejectCalls[0].offerId, "trade-reject");

    await session.refresh({ notify: false });
    assert.equal(session.getState().version, 51);
    assert.equal(session.getState().pendingTrade, null);

    session.dispose();
  } finally {
    browser.restore();
  }
});
