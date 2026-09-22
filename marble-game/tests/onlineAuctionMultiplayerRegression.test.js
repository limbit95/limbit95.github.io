import test from "node:test";
import assert from "node:assert/strict";

const originalWindow = globalThis.window;
globalThis.window = globalThis.window ?? {};
const { createOnlineClassicSession } = await import("../js/onlineSession.js?v=20260923-r1");
const { createOnlineGameApi } = await import("../js/onlineGameApi.js");
const { createOnlineAuctionUiModel } = await import("../js/onlineAuctionUi.js");
globalThis.window = originalWindow;

function installFakeBrowser() {
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  globalThis.window = {
    setTimeout: () => 1,
    clearTimeout() {},
    addEventListener() {},
    removeEventListener() {},
  };
  globalThis.document = {
    visibilityState: "visible",
    addEventListener() {},
    removeEventListener() {},
  };
  return () => {
    globalThis.window = previousWindow;
    globalThis.document = previousDocument;
  };
}

function flush() {
  return new Promise((resolve) => setImmediate(resolve));
}

function createHarness() {
  const changes = new Map();
  const actionCalls = [];
  const server = {
    version: 3,
    phase: "WAITING_CHOICE",
    currentSeat: 0,
    pendingChoice: { type: "BUY_PROPERTY", nodeId: "tokyo", price: 240 },
    ownerId: null,
    players: [
      { id: "p1", userId: "u1", name: "A", seat: 0, positionNodeId: "tokyo", money: 1500, bankrupt: false, skipTurns: 0 },
      { id: "p2", userId: "u2", name: "B", seat: 1, positionNodeId: "start", money: 1200, bankrupt: false, skipTurns: 0 },
      { id: "p3", userId: "u3", name: "C", seat: 2, positionNodeId: "start", money: 1100, bankrupt: false, skipTurns: 0 },
    ],
    lastEvents: [],
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function voteChoice(participants = [], passed = []) {
    return {
      type: "AUCTION_VOTE",
      nodeId: "tokyo",
      basePrice: 240,
      openingBid: 360,
      declinedByPlayerId: "p1",
      eligiblePlayerIds: ["p2", "p3"],
      participantPlayerIds: participants,
      passedPlayerIds: passed,
      deadlineAt: "2026-09-19T12:00:15Z",
    };
  }

  function auctionChoice() {
    return {
      type: "PROPERTY_AUCTION",
      nodeId: "tokyo",
      openingBid: 360,
      starterPlayerId: "p3",
      participantPlayerIds: ["p3", "p2"],
      auction: {
        type: "PROPERTY_AUCTION",
        nodeId: "tokyo",
        openingBid: 360,
        declinedByPlayerId: "p1",
        eligiblePlayerIds: ["p2", "p3"],
        participantPlayerIds: ["p3", "p2"],
        starterPlayerId: "p3",
        bidPlayerIds: [],
        passedPlayerIds: [],
        highestBid: 0,
        highestBidderId: null,
        turnPlayerId: "p3",
        turnDeadlineAt: "2026-09-19T12:00:25Z",
        status: "OPEN",
      },
    };
  }

  function snapshotFor(viewerPlayerId) {
    return {
      serverNow: "2026-09-19T12:00:00Z",
      room: { id: "room-1", roomCode: "ABC123", status: "playing", currentGameId: "game-1" },
      game: {
        id: "game-1",
        status: "playing",
        phase: server.phase,
        turn: 3,
        currentSeat: server.currentSeat,
        version: server.version,
        pendingChoice: server.pendingChoice ? clone(server.pendingChoice) : null,
        lastRoll: null,
        lastEvents: clone(server.lastEvents),
        winnerPlayerId: null,
        rulesetVersion: 1,
      },
      players: clone(server.players),
      properties: {
        tokyo: {
          ownerId: server.ownerId,
          ownerSeat: server.players.find((player) => player.id === server.ownerId)?.seat ?? null,
          buildingLevel: 0,
        },
      },
      viewerUserId: server.players.find((player) => player.id === viewerPlayerId)?.userId ?? null,
      viewerPlayerId,
    };
  }

  function record(params) {
    assert.equal(params.p_room_id, "room-1");
    assert.equal(typeof params.p_client_action_id, "string");
    actionCalls.push({ ...params });
  }

  async function executeRpc(viewerPlayerId, name, params = {}) {
    if (name === "marble_get_game_snapshot") return snapshotFor(viewerPlayerId);
    record(params);

    if (name === "marble_decline_property_for_auction") {
      assert.equal(viewerPlayerId, "p1");
      assert.equal(params.p_expected_version, 3);
      server.version = 4;
      server.pendingChoice = voteChoice();
      server.lastEvents = [{ type: "AUCTION_VOTE_OPENED", nodeId: "tokyo" }];
      return snapshotFor(viewerPlayerId);
    }

    if (name === "marble_join_auction" && viewerPlayerId === "p2") {
      assert.equal(params.p_expected_version, 4);
      server.version = 5;
      server.pendingChoice = voteChoice(["p2"]);
      server.lastEvents = [{ type: "AUCTION_VOTE_JOINED", playerId: "p2", order: 1 }];
      return snapshotFor(viewerPlayerId);
    }

    if (name === "marble_join_auction" && viewerPlayerId === "p3") {
      // p3 deliberately still has version 4. Server-side row locking absorbs this
      // stale vote because the Auction vote is still open and p3 is undecided.
      assert.equal(params.p_expected_version, 4);
      assert.equal(server.version, 5);
      server.version = 6;
      server.pendingChoice = auctionChoice();
      server.lastEvents = [{
        type: "AUCTION_STARTING",
        starterPlayerId: "p3",
        participantPlayerIds: ["p3", "p2"],
      }];
      return snapshotFor(viewerPlayerId);
    }

    if (name === "marble_auction_bid" && viewerPlayerId === "p3") {
      assert.equal(params.p_expected_version, 6);
      assert.equal(params.p_pass, false);
      assert.equal(params.p_amount, 360);
      server.version = 7;
      server.pendingChoice.auction.highestBid = 360;
      server.pendingChoice.auction.highestBidderId = "p3";
      server.pendingChoice.auction.bidPlayerIds = ["p3"];
      server.pendingChoice.auction.turnPlayerId = "p2";
      server.lastEvents = [{ type: "AUCTION_BID_PLACED", playerId: "p3", nodeId: "tokyo", amount: 360 }];
      return snapshotFor(viewerPlayerId);
    }

    if (name === "marble_auction_bid" && viewerPlayerId === "p2") {
      assert.equal(params.p_expected_version, 7);
      assert.equal(params.p_pass, true);
      server.version = 8;
      server.phase = "TURN_END";
      server.pendingChoice = null;
      server.ownerId = "p3";
      server.players.find((player) => player.id === "p3").money -= 360;
      server.lastEvents = [
        { type: "AUCTION_PASSED", playerId: "p2", nodeId: "tokyo" },
        { type: "AUCTION_WON", winnerPlayerId: "p3", nodeId: "tokyo", amount: 360 },
        { type: "PROPERTY_BOUGHT", playerId: "p3", nodeId: "tokyo", amount: 360, reason: "AUCTION" },
      ];
      return snapshotFor(viewerPlayerId);
    }

    throw new Error(`UNEXPECTED_RPC:${name}`);
  }

  function apiFor(viewerPlayerId) {
    const client = {
      async rpc(name, params) {
        try {
          return { data: await executeRpc(viewerPlayerId, name, params), error: null };
        } catch (error) {
          return { data: null, error };
        }
      },
      channel() {
        let changeHandler = null;
        const channel = {
          on(type, _filter, handler) {
            if (type === "postgres_changes") changeHandler = handler;
            return channel;
          },
          subscribe(statusHandler) {
            changes.set(viewerPlayerId, () => changeHandler?.());
            statusHandler?.("SUBSCRIBED");
            return channel;
          },
        };
        return channel;
      },
      removeChannel() {
        changes.delete(viewerPlayerId);
      },
    };
    return createOnlineGameApi({ client });
  }

  async function broadcast(...viewerPlayerIds) {
    viewerPlayerIds.forEach((playerId) => changes.get(playerId)?.());
    await flush();
  }

  return { actionCalls, apiFor, broadcast, server, snapshotFor };
}

test("randomly selected starter owns the actual first auction turn across clients", async () => {
  const restore = installFakeBrowser();
  const harness = createHarness();
  const sessions = [];

  try {
    for (const viewerPlayerId of ["p1", "p2", "p3"]) {
      sessions.push(await createOnlineClassicSession({
        roomId: "room-1",
        api: harness.apiFor(viewerPlayerId),
      }));
    }
    const [decliner, firstJoiner, staleJoiner] = sessions;

    await decliner.declinePropertyForAuction();
    await harness.broadcast("p2", "p3");
    assert.equal(firstJoiner.getState().pendingChoice.type, "AUCTION_VOTE");
    assert.equal(createOnlineAuctionUiModel(decliner.getState(), "p1").eligible, false);

    await firstJoiner.joinAuction();
    assert.deepEqual(firstJoiner.getState().pendingChoice.participantPlayerIds, ["p2"]);

    // Do not broadcast p2's vote to p3. p3 votes from stale version 4.
    await staleJoiner.joinAuction();
    assert.equal(staleJoiner.getState().pendingChoice.type, "PROPERTY_AUCTION");
    assert.deepEqual(staleJoiner.getState().pendingChoice.participantPlayerIds, ["p3", "p2"]);
    assert.equal(staleJoiner.getState().pendingChoice.auction.starterPlayerId, "p3");
    assert.equal(staleJoiner.getState().pendingChoice.auction.highestBid, 0);
    assert.equal(staleJoiner.getState().pendingChoice.auction.highestBidderId, null);
    assert.equal(staleJoiner.getState().pendingChoice.auction.turnPlayerId, "p3");

    await harness.broadcast("p1", "p2");
    const firstJoinerUi = createOnlineAuctionUiModel(firstJoiner.getState(), "p2");
    const selectedStarterUi = createOnlineAuctionUiModel(staleJoiner.getState(), "p3");
    assert.deepEqual(firstJoinerUi.participantCards.map((card) => card.id), ["p3", "p2"]);
    assert.equal("openingBidder" in firstJoinerUi.participantCards[0], false);
    assert.equal(firstJoinerUi.isTurn, false);
    assert.equal(firstJoinerUi.canBid, false);
    assert.equal(selectedStarterUi.isTurn, true);
    assert.equal(selectedStarterUi.canBid, true);

    await staleJoiner.auctionBid(360);
    await harness.broadcast("p2");
    assert.equal(createOnlineAuctionUiModel(firstJoiner.getState(), "p2").canPass, true);

    await firstJoiner.auctionPass();
    assert.equal(firstJoiner.getState().phase, "TURN_END");
    assert.equal(firstJoiner.getState().boardState.properties.tokyo.ownerId, "p3");
    assert.equal(firstJoiner.getState().players.find((player) => player.id === "p3").money, 740);

    await harness.broadcast("p1", "p3");
    assert.equal(staleJoiner.getState().version, 8);
    assert.equal(staleJoiner.getState().boardState.properties.tokyo.ownerId, "p3");

    assert.deepEqual(
      harness.actionCalls.map((call) => call.p_expected_version),
      [3, 4, 4, 6, 7],
    );
  } finally {
    sessions.forEach((session) => session.dispose());
    restore();
  }
});

test("reconnecting snapshot reconstructs vote and participant order without local history", async () => {
  const restore = installFakeBrowser();
  const harness = createHarness();
  try {
    harness.server.version = 5;
    harness.server.pendingChoice = {
      type: "AUCTION_VOTE",
      nodeId: "tokyo",
      basePrice: 240,
      openingBid: 360,
      declinedByPlayerId: "p1",
      eligiblePlayerIds: ["p2", "p3"],
      participantPlayerIds: ["p3"],
      passedPlayerIds: [],
      deadlineAt: "2026-09-19T12:00:15Z",
    };
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      api: harness.apiFor("p2"),
    });
    const model = createOnlineAuctionUiModel(session.getState(), "p2");
    assert.equal(model.stage, "vote");
    assert.deepEqual(model.participantCards.map((card) => card.id), ["p3"]);
    assert.equal("openingBidder" in model.participantCards[0], false);
    session.dispose();
  } finally {
    restore();
  }
});
