import test from "node:test";
import assert from "node:assert/strict";

const originalWindow = globalThis.window;
globalThis.window = globalThis.window ?? {};
const {
  createOnlineClassicSession,
  mapOnlineGameSnapshot,
} = await import("../js/onlineSession.js?v=20260919-r13");
globalThis.window = originalWindow;

function voteChoice(participantPlayerIds = [], passedPlayerIds = []) {
  return {
    type: "AUCTION_VOTE",
    nodeId: "tokyo",
    basePrice: 240,
    openingBid: 360,
    declinedByPlayerId: "p1",
    eligiblePlayerIds: ["p2", "p3"],
    participantPlayerIds,
    passedPlayerIds,
    deadlineAt: "2026-09-19T12:00:15Z",
  };
}

function propertyAuctionChoice() {
  return {
    type: "PROPERTY_AUCTION",
    nodeId: "tokyo",
    openingBid: 360,
    openingBidderPlayerId: "p2",
    participantPlayerIds: ["p2", "p3"],
    auction: {
      type: "PROPERTY_AUCTION",
      nodeId: "tokyo",
      openingBid: 360,
      declinedByPlayerId: "p1",
      eligiblePlayerIds: ["p2", "p3"],
      participantPlayerIds: ["p2", "p3"],
      openingBidderPlayerId: "p2",
      bidPlayerIds: ["p2"],
      passedPlayerIds: [],
      highestBid: 360,
      highestBidderId: "p2",
      turnPlayerId: "p3",
      turnDeadlineAt: "2026-09-19T12:00:25Z",
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
  serverNow = "2026-09-19T12:00:00Z",
} = {}) {
  return {
    serverNow,
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

test("snapshot mapping preserves Auction vote decisions and competitive bid order", () => {
  const vote = mapOnlineGameSnapshot(snapshot(8, {
    pendingChoice: voteChoice(["p2"], ["p3"]),
  }));
  assert.equal(vote.pendingChoice.type, "AUCTION_VOTE");
  assert.deepEqual(vote.pendingChoice.participantPlayerIds, ["p2"]);
  assert.deepEqual(vote.pendingChoice.passedPlayerIds, ["p3"]);
  assert.equal(vote.pendingChoice.deadlineAt, "2026-09-19T12:00:15Z");

  const auction = mapOnlineGameSnapshot(snapshot(9, {
    pendingChoice: propertyAuctionChoice(),
  }));
  assert.deepEqual(auction.pendingChoice.auction.participantPlayerIds, ["p2", "p3"]);
  assert.equal(auction.pendingChoice.auction.openingBidderPlayerId, "p2");
  assert.equal(auction.pendingChoice.auction.turnPlayerId, "p3");
});

test("realtime recovery converges a disconnected voter to the latest vote snapshot", async () => {
  const browser = installFakeBrowser();
  let realtimeStatus = null;
  let latestSnapshot = snapshot(7, { pendingChoice: voteChoice() });
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
    latestSnapshot = snapshot(8, { pendingChoice: voteChoice(["p2"]) });

    const recoveryTimer = [...browser.timers.values()].find((timer) => timer.ms === 3000);
    assert.ok(recoveryTimer);
    await recoveryTimer.callback();

    assert.equal(session.getState().version, 8);
    assert.equal(session.getState().pendingChoice.type, "AUCTION_VOTE");
    assert.deepEqual(session.getState().pendingChoice.participantPlayerIds, ["p2"]);
    assert.deepEqual(remoteVersions, [8]);
    session.dispose();
  } finally {
    browser.restore();
  }
});

test("vote session actions preserve versioned idempotent request envelopes", async () => {
  const browser = installFakeBrowser();
  const actionId = "11111111-1111-4111-8111-111111111111";
  const joinCalls = [];
  const passCalls = [];
  try {
    const joinSession = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: snapshot(8, { pendingChoice: voteChoice(), viewerPlayerId: "p2" }),
      api: {
        createActionId: () => actionId,
        subscribeGame: () => () => {},
        joinAuction: async (request) => {
          joinCalls.push(request);
          return snapshot(9, { pendingChoice: voteChoice(["p2"]), viewerPlayerId: "p2" });
        },
      },
    });
    await joinSession.joinAuction();
    assert.deepEqual(joinCalls[0], {
      roomId: "room-1",
      expectedVersion: 8,
      clientActionId: actionId,
    });
    joinSession.dispose();

    const passSession = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: snapshot(8, { pendingChoice: voteChoice(), viewerPlayerId: "p3" }),
      api: {
        createActionId: () => actionId,
        subscribeGame: () => () => {},
        passAuctionVote: async (request) => {
          passCalls.push(request);
          return snapshot(9, { pendingChoice: voteChoice([], ["p3"]), viewerPlayerId: "p3" });
        },
      },
    });
    await passSession.passAuctionVote();
    assert.deepEqual(passCalls[0], {
      roomId: "room-1",
      expectedVersion: 8,
      clientActionId: actionId,
    });
    passSession.dispose();
  } finally {
    browser.restore();
  }
});

test("online session exposes an authoritative server clock independent of local device time", async () => {
  const restore = installFakeBrowser();
  const realDateNow = Date.now;
  try {
    Date.now = () => Date.parse("2026-09-19T11:58:00Z");
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: snapshot(7, { pendingChoice: voteChoice() }),
      api: { subscribeGame: () => () => {} },
    });

    const firstServerNow = session.getServerNowMs();
    assert.ok(Math.abs(firstServerNow - Date.parse("2026-09-19T12:00:00Z")) < 100);

    Date.now = () => Date.parse("2030-01-01T00:00:00Z");
    const afterLocalClockJump = session.getServerNowMs();
    assert.ok(Math.abs(afterLocalClockJump - firstServerNow) < 100);
    session.dispose();
  } finally {
    Date.now = realDateNow;
    restore.restore();
  }
});

test("equal-version refresh resynchronizes the authoritative server clock", async () => {
  const browser = installFakeBrowser();
  try {
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: snapshot(7, {
        pendingChoice: voteChoice(),
        serverNow: "2026-09-19T12:00:00Z",
      }),
      api: {
        subscribeGame: () => () => {},
        getSnapshot: async () => snapshot(7, {
          pendingChoice: voteChoice(),
          serverNow: "2026-09-19T12:00:30Z",
        }),
      },
    });
    await session.refresh();
    assert.ok(Math.abs(session.getServerNowMs() - Date.parse("2026-09-19T12:00:30Z")) < 100);
    session.dispose();
  } finally {
    browser.restore();
  }
});

test("action replay and stale recovery snapshots cannot rewind the server clock", async () => {
  const browser = installFakeBrowser();
  try {
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: snapshot(8, {
        pendingChoice: voteChoice(),
        serverNow: "2026-09-19T12:00:00Z",
      }),
      api: {
        createActionId: () => "22222222-2222-4222-8222-222222222222",
        subscribeGame: () => () => {},
        joinAuction: async () => snapshot(9, {
          pendingChoice: voteChoice(["p2"]),
          serverNow: "2026-09-19T11:55:00Z",
        }),
        getSnapshot: async () => snapshot(7, {
          pendingChoice: voteChoice(),
          serverNow: "2026-09-19T11:50:00Z",
        }),
      },
    });

    const before = session.getServerNowMs();
    await session.joinAuction();
    const afterAction = session.getServerNowMs();
    assert.ok(Math.abs(afterAction - before) < 200);

    await session.refresh();
    assert.equal(session.getState().version, 9);
    const afterStaleRefresh = session.getServerNowMs();
    assert.ok(Math.abs(afterStaleRefresh - before) < 200);
    session.dispose();
  } finally {
    browser.restore();
  }
});
