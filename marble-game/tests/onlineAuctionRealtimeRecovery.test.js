import test from "node:test";
import assert from "node:assert/strict";

const originalWindow = globalThis.window;
globalThis.window = globalThis.window ?? {};
const {
  createOnlineClassicSession,
  mapOnlineGameSnapshot,
} = await import("../js/onlineSession.js?v=20260918-r3");
globalThis.window = originalWindow;

function requestChoice() {
  return {
    type: "AUCTION_REQUEST",
    nodeId: "tokyo",
    basePrice: 240,
    openingBid: 360,
    declinedByPlayerId: "p1",
    eligiblePlayerIds: ["p2", "p3"],
    requestedByPlayerIds: [],
    deadlineAt: "2026-09-18T12:00:10Z",
  };
}

function recruitmentChoice(participantPlayerIds = ["p2"]) {
  return {
    type: "AUCTION_RECRUITMENT",
    nodeId: "tokyo",
    basePrice: 240,
    openingBid: 360,
    declinedByPlayerId: "p1",
    eligiblePlayerIds: ["p2", "p3"],
    requesterPlayerId: "p2",
    requestedByPlayerIds: ["p2"],
    participantPlayerIds,
    deadlineAt: "2026-09-18T12:00:20Z",
  };
}

function propertyAuctionChoice({
  participantPlayerIds = ["p2", "p3"],
  passedPlayerIds = [],
  highestBid = 360,
  highestBidderId = "p2",
  turnPlayerId = "p3",
} = {}) {
  return {
    type: "PROPERTY_AUCTION",
    nodeId: "tokyo",
    openingBid: 360,
    requesterPlayerId: "p2",
    participantPlayerIds,
    auction: {
      type: "PROPERTY_AUCTION",
      nodeId: "tokyo",
      openingBid: 360,
      declinedByPlayerId: "p1",
      eligiblePlayerIds: ["p2", "p3"],
      participantPlayerIds,
      requesterPlayerId: "p2",
      requestedByPlayerIds: ["p2"],
      bidPlayerIds: ["p2"],
      passedPlayerIds,
      highestBid,
      highestBidderId,
      turnPlayerId,
      turnDeadlineAt: "2026-09-18T12:00:30Z",
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
  let nextTimerId = 1;
  const timers = new Map();
  globalThis.window = {
    setTimeout(callback, ms) {
      const id = nextTimerId++;
      timers.set(id, { callback, ms });
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

test("snapshot mapping preserves Auction v2 recruitment order and bid deadline for reconnect", () => {
  const recruitment = mapOnlineGameSnapshot(snapshot(8, {
    pendingChoice: recruitmentChoice(["p2", "p3"]),
  }));
  assert.equal(recruitment.pendingChoice.type, "AUCTION_RECRUITMENT");
  assert.deepEqual(recruitment.pendingChoice.participantPlayerIds, ["p2", "p3"]);
  assert.equal(recruitment.pendingChoice.deadlineAt, "2026-09-18T12:00:20Z");

  const auction = mapOnlineGameSnapshot(snapshot(9, {
    pendingChoice: propertyAuctionChoice(),
  }));
  assert.deepEqual(auction.pendingChoice.auction.participantPlayerIds, ["p2", "p3"]);
  assert.equal(auction.pendingChoice.auction.turnPlayerId, "p3");
  assert.equal(auction.pendingChoice.auction.turnDeadlineAt, "2026-09-18T12:00:30Z");
});

test("realtime recovery converges a disconnected request client to recruitment snapshot", async () => {
  const browser = installFakeBrowser();
  let realtimeStatus = null;
  let latestSnapshot = snapshot(7, { pendingChoice: requestChoice() });
  const remoteVersions = [];

  try {
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: latestSnapshot,
      onRemoteState(state) {
        remoteVersions.push(state.version);
      },
      api: {
        subscribeGame(_roomId, { onStatus }) {
          realtimeStatus = onStatus;
          return () => {};
        },
        async getSnapshot() {
          return latestSnapshot;
        },
      },
    });

    realtimeStatus("CHANNEL_ERROR", new Error("network"));
    latestSnapshot = snapshot(8, { pendingChoice: recruitmentChoice(["p2", "p3"]) });

    const recoveryTimer = [...browser.timers.values()].find((timer) => timer.ms === 3000);
    assert.ok(recoveryTimer);
    await recoveryTimer.callback();

    assert.equal(session.getState().version, 8);
    assert.equal(session.getState().pendingChoice.type, "AUCTION_RECRUITMENT");
    assert.deepEqual(session.getState().pendingChoice.participantPlayerIds, ["p2", "p3"]);
    assert.deepEqual(remoteVersions, [8]);
    session.dispose();
  } finally {
    browser.restore();
  }
});

test("Auction v2 online session actions keep the versioned idempotent request envelope", async () => {
  const browser = installFakeBrowser();
  const actionId = "11111111-1111-4111-8111-111111111111";
  let latestSnapshot = snapshot(8, { pendingChoice: recruitmentChoice(["p2"]) });
  const joinCalls = [];
  const withdrawCalls = [];
  const deadlineCalls = [];

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
        async joinAuction(request) {
          joinCalls.push(request);
          latestSnapshot = snapshot(9, { pendingChoice: recruitmentChoice(["p2", "p3"]) });
          return latestSnapshot;
        },
        async withdrawAuction(request) {
          withdrawCalls.push(request);
          latestSnapshot = snapshot(10, { pendingChoice: recruitmentChoice(["p2"]) });
          return latestSnapshot;
        },
        async advanceAuctionDeadline(request) {
          deadlineCalls.push(request);
          latestSnapshot = snapshot(11, { pendingChoice: propertyAuctionChoice() });
          return latestSnapshot;
        },
      },
    });

    // Viewer p2 is the requester; use action path contract directly through a p3-style snapshot.
    session.dispose();

    const participantSession = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: snapshot(8, {
        pendingChoice: recruitmentChoice(["p2"]),
        viewerPlayerId: "p3",
      }),
      api: {
        createActionId: () => actionId,
        subscribeGame: () => () => {},
        async getSnapshot() {
          return latestSnapshot;
        },
        async joinAuction(request) {
          joinCalls.push(request);
          latestSnapshot = snapshot(9, {
            pendingChoice: recruitmentChoice(["p2", "p3"]),
            viewerPlayerId: "p3",
          });
          return latestSnapshot;
        },
        async withdrawAuction(request) {
          withdrawCalls.push(request);
          latestSnapshot = snapshot(10, {
            pendingChoice: recruitmentChoice(["p2"]),
            viewerPlayerId: "p3",
          });
          return latestSnapshot;
        },
        async advanceAuctionDeadline(request) {
          deadlineCalls.push(request);
          latestSnapshot = snapshot(11, {
            pendingChoice: propertyAuctionChoice(),
            viewerPlayerId: "p3",
          });
          return latestSnapshot;
        },
      },
    });

    await participantSession.joinAuction();
    await participantSession.withdrawAuction();
    await participantSession.advanceAuctionDeadline();

    assert.deepEqual(joinCalls.at(-1), {
      roomId: "room-1",
      expectedVersion: 8,
      clientActionId: actionId,
    });
    assert.deepEqual(withdrawCalls.at(-1), {
      roomId: "room-1",
      expectedVersion: 9,
      clientActionId: actionId,
    });
    assert.deepEqual(deadlineCalls.at(-1), {
      roomId: "room-1",
      expectedVersion: 10,
      clientActionId: actionId,
    });
    participantSession.dispose();
  } finally {
    browser.restore();
  }
});
