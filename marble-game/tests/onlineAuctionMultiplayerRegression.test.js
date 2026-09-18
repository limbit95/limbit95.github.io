import test from "node:test";
import assert from "node:assert/strict";

const originalWindow = globalThis.window;
globalThis.window = globalThis.window ?? {};
const { createOnlineClassicSession } = await import("../js/onlineSession.js?v=20260918-r3");
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
  const snapshotOverrides = new Map();
  const actionCalls = [];
  const server = {
    version: 3,
    phase: "WAITING_CHOICE",
    currentSeat: 0,
    pendingChoice: { type: "BUY_PROPERTY", nodeId: "tokyo", price: 240 },
    ownerId: null,
    lastEvents: [],
    players: [
      { id: "p1", userId: "u1", name: "A", seat: 0, positionNodeId: "tokyo", money: 1500, bankrupt: false, skipTurns: 0 },
      { id: "p2", userId: "u2", name: "B", seat: 1, positionNodeId: "start", money: 1200, bankrupt: false, skipTurns: 0 },
      { id: "p3", userId: "u3", name: "C", seat: 2, positionNodeId: "start", money: 1100, bankrupt: false, skipTurns: 0 },
    ],
  };

  function clone(value) {
    return value === null || value === undefined ? value : JSON.parse(JSON.stringify(value));
  }

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

  function recruitmentChoice(participants = ["p2"]) {
    return {
      type: "AUCTION_RECRUITMENT",
      nodeId: "tokyo",
      basePrice: 240,
      openingBid: 360,
      declinedByPlayerId: "p1",
      eligiblePlayerIds: ["p2", "p3"],
      requesterPlayerId: "p2",
      requestedByPlayerIds: ["p2"],
      participantPlayerIds: participants,
      deadlineAt: "2026-09-18T12:00:20Z",
    };
  }

  function propertyAuctionChoice() {
    return {
      type: "PROPERTY_AUCTION",
      nodeId: "tokyo",
      openingBid: 360,
      requesterPlayerId: "p2",
      participantPlayerIds: ["p2", "p3"],
      auction: {
        type: "PROPERTY_AUCTION",
        nodeId: "tokyo",
        openingBid: 360,
        declinedByPlayerId: "p1",
        eligiblePlayerIds: ["p2", "p3"],
        participantPlayerIds: ["p2", "p3"],
        requesterPlayerId: "p2",
        requestedByPlayerIds: ["p2"],
        bidPlayerIds: ["p2"],
        passedPlayerIds: [],
        highestBid: 360,
        highestBidderId: "p2",
        turnPlayerId: "p3",
        turnDeadlineAt: "2026-09-18T12:00:30Z",
        status: "OPEN",
        winnerPlayerId: null,
        winningBid: 0,
      },
    };
  }

  function snapshotFor(viewerPlayerId) {
    return {
      room: { id: "room-1", roomCode: "ABC123", status: "playing", currentGameId: "game-1" },
      game: {
        id: "game-1",
        status: "playing",
        phase: server.phase,
        turn: 3,
        currentSeat: server.currentSeat,
        version: server.version,
        pendingChoice: clone(server.pendingChoice),
        lastRoll: null,
        lastEvents: clone(server.lastEvents),
        winnerPlayerId: null,
        rulesetVersion: 1,
      },
      players: clone(server.players),
      properties: {
        tokyo: {
          ownerId: server.ownerId,
          ownerSeat: server.ownerId === "p2" ? 1 : null,
          buildingLevel: 0,
        },
      },
      viewerUserId: server.players.find((player) => player.id === viewerPlayerId)?.userId ?? null,
      viewerPlayerId,
    };
  }

  function assertEnvelope(params) {
    assert.equal(params.p_room_id, "room-1");
    assert.equal(params.p_expected_version, server.version);
    assert.equal(typeof params.p_client_action_id, "string");
    actionCalls.push({ ...params });
  }

  async function executeRpc(viewerPlayerId, name, params = {}) {
    if (name === "marble_get_game_snapshot") {
      return snapshotOverrides.get(viewerPlayerId) ?? snapshotFor(viewerPlayerId);
    }
    assertEnvelope(params);

    if (name === "marble_decline_property_for_auction") {
      assert.equal(viewerPlayerId, "p1");
      server.version += 1;
      server.pendingChoice = requestChoice();
      server.lastEvents = [{ type: "AUCTION_REQUEST_OPENED", nodeId: "tokyo" }];
      return snapshotFor(viewerPlayerId);
    }

    if (name === "marble_request_auction") {
      assert.equal(viewerPlayerId, "p2");
      server.version += 1;
      server.pendingChoice = recruitmentChoice(["p2"]);
      server.lastEvents = [{ type: "AUCTION_RECRUITMENT_OPENED", requesterPlayerId: "p2" }];
      return snapshotFor(viewerPlayerId);
    }

    if (name === "marble_join_auction") {
      assert.equal(viewerPlayerId, "p3");
      server.version += 1;
      server.pendingChoice = recruitmentChoice(["p2", "p3"]);
      server.lastEvents = [{ type: "AUCTION_PARTICIPANT_JOINED", playerId: "p3" }];
      return snapshotFor(viewerPlayerId);
    }

    if (name === "marble_advance_auction_deadline") {
      server.version += 1;
      server.pendingChoice = propertyAuctionChoice();
      server.lastEvents = [{
        type: "AUCTION_STARTED",
        requesterPlayerId: "p2",
        highestBidderId: "p2",
        highestBid: 360,
      }];
      return snapshotFor(viewerPlayerId);
    }

    if (name === "marble_auction_bid") {
      assert.equal(viewerPlayerId, "p3");
      assert.equal(params.p_pass, true);
      assert.equal(params.p_amount, null);
      server.version += 1;
      server.phase = "TURN_END";
      server.pendingChoice = null;
      server.ownerId = "p2";
      server.players.find((player) => player.id === "p2").money -= 360;
      server.lastEvents = [
        { type: "AUCTION_PASSED", playerId: "p3", nodeId: "tokyo" },
        { type: "AUCTION_WON", winnerPlayerId: "p2", nodeId: "tokyo", amount: 360 },
        { type: "PROPERTY_BOUGHT", playerId: "p2", nodeId: "tokyo", amount: 360, reason: "AUCTION" },
      ];
      return snapshotFor(viewerPlayerId);
    }

    throw new Error(`UNEXPECTED_RPC:${name}`);
  }

  function clientFor(viewerPlayerId) {
    return {
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
  }

  function apiFor(viewerPlayerId) {
    return createOnlineGameApi({ client: clientFor(viewerPlayerId) });
  }

  async function broadcast(...viewerPlayerIds) {
    viewerPlayerIds.forEach((playerId) => changes.get(playerId)?.());
    await flush();
  }

  return {
    actionCalls,
    apiFor,
    broadcast,
    server,
    snapshotFor,
    snapshotOverrides,
  };
}

test("three clients converge through request, recruitment, requester auto-bid, and final settlement", async () => {
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
    const [decliner, requester, participant] = sessions;

    await decliner.declinePropertyForAuction();
    await harness.broadcast("p2", "p3");
    assert.equal(requester.getState().pendingChoice.type, "AUCTION_REQUEST");
    const declinerRequestUi = createOnlineAuctionUiModel(decliner.getState(), "p1");
    assert.equal(declinerRequestUi.eligible, false);
    assert.equal(declinerRequestUi.canRequest, false);

    await requester.requestAuction();
    assert.equal(requester.getState().pendingChoice.type, "AUCTION_RECRUITMENT");
    assert.deepEqual(requester.getState().pendingChoice.participantPlayerIds, ["p2"]);
    await harness.broadcast("p1", "p3");

    await participant.joinAuction();
    assert.deepEqual(participant.getState().pendingChoice.participantPlayerIds, ["p2", "p3"]);
    await harness.broadcast("p1", "p2");

    await decliner.advanceAuctionDeadline();
    assert.equal(decliner.getState().pendingChoice.type, "PROPERTY_AUCTION");
    assert.equal(decliner.getState().pendingChoice.auction.highestBidderId, "p2");
    assert.equal(decliner.getState().pendingChoice.auction.highestBid, 360);
    assert.equal(decliner.getState().pendingChoice.auction.turnPlayerId, "p3");
    await harness.broadcast("p2", "p3");

    const requesterUi = createOnlineAuctionUiModel(requester.getState(), "p2");
    const participantUi = createOnlineAuctionUiModel(participant.getState(), "p3");
    assert.equal(requesterUi.canBid, false);
    assert.equal(participantUi.canPass, true);
    assert.equal(participantUi.minimumBid, 361);

    const staleRequesterSnapshot = harness.snapshotFor("p2");
    await participant.auctionPass();
    assert.equal(participant.getState().phase, "TURN_END");
    assert.equal(participant.getState().boardState.properties.tokyo.ownerId, "p2");
    assert.equal(participant.getState().players.find((player) => player.id === "p2").money, 840);

    await harness.broadcast("p1", "p2");
    assert.equal(requester.getState().version, 8);
    assert.equal(requester.getState().boardState.properties.tokyo.ownerId, "p2");

    harness.snapshotOverrides.set("p2", staleRequesterSnapshot);
    await harness.broadcast("p2");
    assert.equal(requester.getState().version, 8);
    assert.equal(requester.getState().boardState.properties.tokyo.ownerId, "p2");

    assert.deepEqual(harness.actionCalls.map((call) => call.p_expected_version), [3, 4, 5, 6, 7]);
    assert.equal(
      new Set(harness.actionCalls.map((call) => call.p_client_action_id)).size,
      harness.actionCalls.length,
    );
  } finally {
    sessions.forEach((session) => session.dispose());
    restore();
  }
});

test("reconnecting snapshots reconstruct recruitment and ordered bidding without local history", async () => {
  const restore = installFakeBrowser();
  const harness = createHarness();
  const sessions = [];

  try {
    harness.server.version = 6;
    harness.server.pendingChoice = {
      type: "AUCTION_RECRUITMENT",
      nodeId: "tokyo",
      basePrice: 240,
      openingBid: 360,
      declinedByPlayerId: "p1",
      eligiblePlayerIds: ["p2", "p3"],
      requesterPlayerId: "p2",
      requestedByPlayerIds: ["p2"],
      participantPlayerIds: ["p2", "p3"],
      deadlineAt: "2026-09-18T12:00:20Z",
    };
    const recruitmentSession = await createOnlineClassicSession({
      roomId: "room-1",
      api: harness.apiFor("p3"),
    });
    sessions.push(recruitmentSession);
    assert.deepEqual(recruitmentSession.getState().pendingChoice.participantPlayerIds, ["p2", "p3"]);

    harness.server.version = 7;
    harness.server.pendingChoice = {
      type: "PROPERTY_AUCTION",
      nodeId: "tokyo",
      openingBid: 360,
      requesterPlayerId: "p2",
      participantPlayerIds: ["p2", "p3"],
      auction: {
        type: "PROPERTY_AUCTION",
        nodeId: "tokyo",
        openingBid: 360,
        declinedByPlayerId: "p1",
        eligiblePlayerIds: ["p2", "p3"],
        participantPlayerIds: ["p2", "p3"],
        requesterPlayerId: "p2",
        requestedByPlayerIds: ["p2"],
        bidPlayerIds: ["p2"],
        passedPlayerIds: [],
        highestBid: 360,
        highestBidderId: "p2",
        turnPlayerId: "p3",
        turnDeadlineAt: "2026-09-18T12:00:30Z",
        status: "OPEN",
      },
    };
    const auctionSession = await createOnlineClassicSession({
      roomId: "room-1",
      api: harness.apiFor("p3"),
    });
    sessions.push(auctionSession);
    const model = createOnlineAuctionUiModel(auctionSession.getState(), "p3");
    assert.equal(model.stage, "auction");
    assert.equal(model.highestBid, 360);
    assert.equal(model.minimumBid, 361);
    assert.equal(model.isTurn, true);
  } finally {
    sessions.forEach((session) => session.dispose());
    restore();
  }
});
