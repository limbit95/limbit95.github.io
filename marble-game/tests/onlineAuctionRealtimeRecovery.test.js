import test from "node:test";
import assert from "node:assert/strict";

const originalWindow = globalThis.window;
globalThis.window = globalThis.window ?? {};
const {
  createOnlineClassicSession,
  mapOnlineGameSnapshot,
} = await import("../js/onlineSession.js");
globalThis.window = originalWindow;

function auctionRequestChoice(requestedByPlayerIds = []) {
  return {
    type: "AUCTION_REQUEST",
    nodeId: "tokyo",
    openingBid: 240,
    declinedByPlayerId: "p1",
    eligiblePlayerIds: ["p2", "p3"],
    requestedByPlayerIds,
  };
}

function propertyAuctionChoice({
  requestedByPlayerIds = ["p2"],
  bidPlayerIds = [],
  passedPlayerIds = [],
  highestBid = 0,
  highestBidderId = null,
} = {}) {
  return {
    type: "PROPERTY_AUCTION",
    nodeId: "tokyo",
    openingBid: 240,
    requestedByPlayerIds,
    auction: {
      type: "PROPERTY_AUCTION",
      nodeId: "tokyo",
      openingBid: 240,
      declinedByPlayerId: "p1",
      eligiblePlayerIds: ["p2", "p3"],
      requestedByPlayerIds,
      bidPlayerIds,
      passedPlayerIds,
      highestBid,
      highestBidderId,
      status: "OPEN",
      winnerPlayerId: null,
      winningBid: 0,
    },
  };
}

function snapshot(version, {
  pendingChoice = null,
  viewerPlayerId = "p2",
  lastEvents = [],
} = {}) {
  return {
    room: { id: "room-1", roomCode: "ABC123", status: "playing", currentGameId: "game-1" },
    game: {
      id: "game-1",
      status: "playing",
      phase: pendingChoice ? "WAITING_CHOICE" : "WAITING_ROLL",
      turn: 3,
      currentSeat: 0,
      version,
      pendingChoice,
      lastRoll: null,
      lastEvents,
      winnerPlayerId: null,
      rulesetVersion: 1,
    },
    players: [
      { id: "p1", userId: "u1", name: "A", seat: 0, positionNodeId: "tokyo", money: 1500, bankrupt: false, skipTurns: 0 },
      { id: "p2", userId: "u2", name: "B", seat: 1, positionNodeId: "start", money: 1200, bankrupt: false, skipTurns: 0 },
      { id: "p3", userId: "u3", name: "C", seat: 2, positionNodeId: "start", money: 1100, bankrupt: false, skipTurns: 0 },
    ],
    properties: { tokyo: { ownerId: null, ownerSeat: null, buildingLevel: 0 } },
    viewerUserId: viewerPlayerId === "p1" ? "u1" : viewerPlayerId === "p3" ? "u3" : "u2",
    viewerPlayerId,
  };
}

function installFakeBrowser() {
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  const windowListeners = new Map();
  const documentListeners = new Map();
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
    addEventListener(type, listener) {
      windowListeners.set(type, listener);
    },
    removeEventListener(type, listener) {
      if (windowListeners.get(type) === listener) windowListeners.delete(type);
    },
  };
  globalThis.document = {
    visibilityState: "visible",
    addEventListener(type, listener) {
      documentListeners.set(type, listener);
    },
    removeEventListener(type, listener) {
      if (documentListeners.get(type) === listener) documentListeners.delete(type);
    },
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

test("auction request and active auction snapshots survive reconnect mapping without mutable nested state", () => {
  const requestState = mapOnlineGameSnapshot(snapshot(7, { pendingChoice: auctionRequestChoice(["p2"]) }));
  assert.equal(requestState.pendingChoice.type, "AUCTION_REQUEST");
  assert.deepEqual(requestState.pendingChoice.eligiblePlayerIds, ["p2", "p3"]);
  assert.deepEqual(requestState.pendingChoice.requestedByPlayerIds, ["p2"]);
  assert.equal(Object.isFrozen(requestState.pendingChoice), true);
  assert.equal(Object.isFrozen(requestState.pendingChoice.eligiblePlayerIds), true);
  assert.equal(Object.isFrozen(requestState.pendingChoice.requestedByPlayerIds), true);

  const auctionState = mapOnlineGameSnapshot(snapshot(8, {
    pendingChoice: propertyAuctionChoice({
      requestedByPlayerIds: ["p2", "p3"],
      bidPlayerIds: ["p2"],
      passedPlayerIds: ["p3"],
      highestBid: 260,
      highestBidderId: "p2",
    }),
  }));
  assert.equal(auctionState.pendingChoice.type, "PROPERTY_AUCTION");
  assert.equal(auctionState.pendingChoice.auction.highestBid, 260);
  assert.equal(auctionState.pendingChoice.auction.highestBidderId, "p2");
  assert.equal(Object.isFrozen(auctionState.pendingChoice.auction), true);
  assert.equal(Object.isFrozen(auctionState.pendingChoice.auction.bidPlayerIds), true);
  assert.equal(Object.isFrozen(auctionState.pendingChoice.auction.passedPlayerIds), true);
});

test("realtime game-version refresh carries auction request and active auction state to every session", async () => {
  const browser = installFakeBrowser();
  let realtimeChange = null;
  let realtimeStatus = null;
  let latestSnapshot = snapshot(3, {
    pendingChoice: { type: "BUY_PROPERTY", nodeId: "tokyo", price: 240 },
  });
  const remoteChoices = [];

  try {
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: latestSnapshot,
      onRemoteState(state) {
        remoteChoices.push(state.pendingChoice?.type ?? null);
      },
      api: {
        async getSnapshot() {
          return latestSnapshot;
        },
        subscribeGame(_roomId, { onChange, onStatus }) {
          realtimeChange = onChange;
          realtimeStatus = onStatus;
          return () => {};
        },
      },
    });

    realtimeStatus("SUBSCRIBED");
    await flush();
    assert.deepEqual(remoteChoices, []);

    latestSnapshot = snapshot(4, { pendingChoice: auctionRequestChoice([]) });
    realtimeChange();
    await flush();
    assert.equal(session.getState().version, 4);
    assert.equal(session.getState().pendingChoice.type, "AUCTION_REQUEST");

    latestSnapshot = snapshot(5, { pendingChoice: propertyAuctionChoice() });
    realtimeChange();
    await flush();
    assert.equal(session.getState().version, 5);
    assert.equal(session.getState().pendingChoice.type, "PROPERTY_AUCTION");
    assert.deepEqual(remoteChoices, ["AUCTION_REQUEST", "PROPERTY_AUCTION"]);

    session.dispose();
  } finally {
    browser.restore();
  }
});

test("channel recovery refreshes the latest in-progress auction snapshot before resubscribe", async () => {
  const browser = installFakeBrowser();
  let realtimeStatus = null;
  let latestSnapshot = snapshot(5, { pendingChoice: propertyAuctionChoice() });
  const remoteVersions = [];

  try {
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: latestSnapshot,
      onRemoteState(state) {
        remoteVersions.push(state.version);
      },
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

    latestSnapshot = snapshot(6, {
      pendingChoice: propertyAuctionChoice({
        bidPlayerIds: ["p2"],
        highestBid: 260,
        highestBidderId: "p2",
      }),
      lastEvents: [{ type: "AUCTION_BID_PLACED", playerId: "p2", nodeId: "tokyo", amount: 260 }],
    });
    realtimeStatus("CLOSED");
    assert.equal(browser.timers.size, 1);

    const [timerId, recovery] = browser.timers.entries().next().value;
    browser.timers.delete(timerId);
    await recovery();
    await flush();

    assert.equal(session.getState().version, 6);
    assert.equal(session.getState().pendingChoice.auction.highestBid, 260);
    assert.equal(session.getState().pendingChoice.auction.highestBidderId, "p2");
    assert.deepEqual(remoteVersions, [6]);
    assert.equal(browser.timers.size, 1);

    realtimeStatus("SUBSCRIBED");
    await flush();
    assert.equal(browser.timers.size, 0);
    session.dispose();
  } finally {
    browser.restore();
  }
});

test("online session exposes non-turn auction request and bid actions through the same versioned action recovery path", async () => {
  const browser = installFakeBrowser();
  const actionId = "11111111-1111-4111-8111-111111111111";
  let latestSnapshot = snapshot(7, { pendingChoice: auctionRequestChoice([]) });
  const requestCalls = [];
  const bidCalls = [];

  try {
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: latestSnapshot,
      api: {
        createActionId: () => actionId,
        subscribeGame: () => () => {},
        async getSnapshot() {
          return latestSnapshot;
        },
        async requestAuction(request) {
          requestCalls.push(request);
          latestSnapshot = snapshot(8, { pendingChoice: auctionRequestChoice(["p2"]) });
          return latestSnapshot;
        },
        async bidAuction(request) {
          bidCalls.push(request);
          latestSnapshot = snapshot(10, {
            pendingChoice: propertyAuctionChoice({
              requestedByPlayerIds: ["p2"],
              bidPlayerIds: ["p2"],
              highestBid: 260,
              highestBidderId: "p2",
            }),
          });
          return latestSnapshot;
        },
      },
    });

    const requested = await session.requestAuction();
    assert.equal(requested.version, 8);
    assert.deepEqual(requestCalls, [{ roomId: "room-1", expectedVersion: 7, clientActionId: actionId }]);

    latestSnapshot = snapshot(9, { pendingChoice: propertyAuctionChoice({ requestedByPlayerIds: ["p2"] }) });
    await session.refresh({ notify: false });
    const bid = await session.auctionBid(260);
    assert.equal(bid.version, 10);
    assert.deepEqual(bidCalls, [{
      roomId: "room-1",
      expectedVersion: 9,
      clientActionId: actionId,
      amount: 260,
      pass: false,
    }]);
    assert.equal(typeof session.declinePropertyForAuction, "function");
    assert.equal(typeof session.closeAuctionRequest, "function");
    assert.equal(typeof session.auctionPass, "function");
    session.dispose();
  } finally {
    browser.restore();
  }
});
