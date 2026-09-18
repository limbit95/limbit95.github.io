import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const originalWindow = globalThis.window;
globalThis.window = globalThis.window ?? {};
const { createOnlineClassicSession } = await import("../js/onlineSession.js");
const { createOnlineGameApi } = await import("../js/onlineGameApi.js");
const { createOnlineAuctionUiModel } = await import("../js/onlineAuctionUi.js");
globalThis.window = originalWindow;

const authoritySql = readFileSync(
  new URL("../../supabase/marble/20260917213000_marble_phase7a_auction_authority.sql", import.meta.url),
  "utf8",
);

function requestChoice(requestedByPlayerIds = []) {
  return {
    type: "AUCTION_REQUEST",
    nodeId: "tokyo",
    openingBid: 240,
    declinedByPlayerId: "p1",
    eligiblePlayerIds: ["p2", "p3"],
    requestedByPlayerIds,
  };
}

function auctionChoice({
  bidPlayerIds = [],
  passedPlayerIds = [],
  highestBid = 0,
  highestBidderId = null,
} = {}) {
  return {
    type: "PROPERTY_AUCTION",
    nodeId: "tokyo",
    openingBid: 240,
    requestedByPlayerIds: ["p2"],
    auction: {
      type: "PROPERTY_AUCTION",
      nodeId: "tokyo",
      openingBid: 240,
      declinedByPlayerId: "p1",
      eligiblePlayerIds: ["p2", "p3"],
      requestedByPlayerIds: ["p2"],
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
    players: [
      { id: "p1", userId: "u1", name: "A", seat: 0, positionNodeId: "tokyo", money: 1500, bankrupt: false, skipTurns: 0 },
      { id: "p2", userId: "u2", name: "B", seat: 1, positionNodeId: "start", money: 1200, bankrupt: false, skipTurns: 0 },
      { id: "p3", userId: "u3", name: "C", seat: 2, positionNodeId: "start", money: 1100, bankrupt: false, skipTurns: 0 },
    ],
  };

  function clone(value) {
    return value === null || value === undefined ? value : JSON.parse(JSON.stringify(value));
  }

  function snapshotFor(viewerPlayerId) {
    const snapshot = {
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
        lastEvents: [],
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
    return snapshot;
  }

  function assertExpectedVersion(params) {
    assert.equal(params.p_room_id, "room-1");
    assert.equal(params.p_expected_version, server.version);
    assert.equal(typeof params.p_client_action_id, "string");
    assert.ok(params.p_client_action_id.length > 0);
    actionCalls.push({ ...params });
  }

  async function executeRpc(viewerPlayerId, name, params = {}) {
    if (name === "marble_get_game_snapshot") {
      assert.equal(params.p_room_id, "room-1");
      return snapshotOverrides.get(viewerPlayerId) ?? snapshotFor(viewerPlayerId);
    }

    assertExpectedVersion(params);
    if (name === "marble_decline_property_for_auction") {
      assert.equal(viewerPlayerId, "p1");
      server.version += 1;
      server.pendingChoice = requestChoice();
      return snapshotFor(viewerPlayerId);
    }
    if (name === "marble_request_auction") {
      assert.equal(viewerPlayerId, "p2");
      server.version += 1;
      server.pendingChoice = requestChoice(["p2"]);
      return snapshotFor(viewerPlayerId);
    }
    if (name === "marble_close_auction_request") {
      assert.equal(viewerPlayerId, "p1");
      server.version += 1;
      server.pendingChoice = server.pendingChoice.requestedByPlayerIds.length > 0
        ? auctionChoice()
        : null;
      server.phase = server.pendingChoice ? "WAITING_CHOICE" : "TURN_END";
      return snapshotFor(viewerPlayerId);
    }
    if (name === "marble_auction_bid") {
      if (viewerPlayerId === "p1") {
        throw new Error("AUCTION_PLAYER_NOT_ELIGIBLE");
      }
      if (
        viewerPlayerId === "p2"
        && params.p_pass === true
        && !server.pendingChoice.auction.bidPlayerIds.includes("p2")
      ) {
        throw new Error("AUCTION_REQUESTER_BID_REQUIRED");
      }
      if (viewerPlayerId === "p2") {
        assert.equal(params.p_pass, false);
        assert.equal(params.p_amount, 240);
        server.version += 1;
        server.pendingChoice = auctionChoice({
          bidPlayerIds: ["p2"],
          highestBid: 240,
          highestBidderId: "p2",
        });
        return snapshotFor(viewerPlayerId);
      }
      assert.equal(viewerPlayerId, "p3");
      assert.equal(params.p_pass, true);
      assert.equal(params.p_amount, null);
      server.version += 1;
      server.phase = "TURN_END";
      server.pendingChoice = null;
      server.ownerId = "p2";
      server.players.find((player) => player.id === "p2").money -= 240;
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
    changes,
    server,
    snapshotFor,
    snapshotOverrides,
  };
}

test("three online clients preserve the request-gated auction flow through authoritative actions and realtime refreshes", async () => {
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
    const [decliner, requester, otherBidder] = sessions;

    await decliner.declinePropertyForAuction();
    assert.equal(decliner.getState().version, 4);
    assert.equal(decliner.getState().pendingChoice.type, "AUCTION_REQUEST");
    await harness.broadcast("p2", "p3");
    assert.equal(requester.getState().pendingChoice.type, "AUCTION_REQUEST");
    assert.equal(otherBidder.getState().pendingChoice.type, "AUCTION_REQUEST");

    await requester.requestAuction();
    assert.deepEqual(requester.getState().pendingChoice.requestedByPlayerIds, ["p2"]);
    await harness.broadcast("p1", "p3");
    assert.deepEqual(decliner.getState().pendingChoice.requestedByPlayerIds, ["p2"]);

    await decliner.closeAuctionRequest();
    assert.equal(decliner.getState().version, 6);
    assert.equal(decliner.getState().pendingChoice.type, "PROPERTY_AUCTION");
    await harness.broadcast("p2", "p3");

    const requesterUi = createOnlineAuctionUiModel(requester.getState(), "p2");
    const declinerUi = createOnlineAuctionUiModel(decliner.getState(), "p1");
    assert.equal(requesterUi.minimumBid, 240);
    assert.equal(requesterUi.canPass, false);
    assert.equal(requesterUi.requesterNeedsFirstBid, true);
    assert.equal(declinerUi.eligible, false);
    assert.equal(declinerUi.canBid, false);

    await assert.rejects(() => requester.auctionPass(), /AUCTION_REQUESTER_BID_REQUIRED/);
    assert.equal(requester.getState().version, 6);

    await requester.auctionBid(240);
    assert.equal(requester.getState().version, 7);
    assert.equal(requester.getState().pendingChoice.auction.highestBidderId, "p2");
    const staleRequesterSnapshot = harness.snapshotFor("p2");
    await harness.broadcast("p1", "p3");

    const otherUi = createOnlineAuctionUiModel(otherBidder.getState(), "p3");
    assert.equal(otherUi.minimumBid, 241);
    assert.equal(otherUi.canPass, true);

    await otherBidder.auctionPass();
    assert.equal(otherBidder.getState().version, 8);
    assert.equal(otherBidder.getState().phase, "TURN_END");
    assert.equal(otherBidder.getState().pendingChoice, null);
    assert.equal(otherBidder.getState().boardState.properties.tokyo.ownerId, "p2");
    assert.equal(otherBidder.getState().players.find((player) => player.id === "p2").money, 960);
    await harness.broadcast("p1", "p2");
    assert.equal(requester.getState().version, 8);
    assert.equal(requester.getState().boardState.properties.tokyo.ownerId, "p2");
    assert.equal(decliner.getState().phase, "TURN_END");

    harness.snapshotOverrides.set("p2", staleRequesterSnapshot);
    await harness.broadcast("p2");
    assert.equal(requester.getState().version, 8);
    assert.equal(requester.getState().boardState.properties.tokyo.ownerId, "p2");

    assert.deepEqual(harness.actionCalls.map((call) => call.p_expected_version), [3, 4, 5, 6, 6, 7]);
    assert.equal(
      new Set(harness.actionCalls.map((call) => call.p_client_action_id)).size,
      harness.actionCalls.length,
    );
  } finally {
    sessions.forEach((session) => session.dispose());
    restore();
  }
});

test("closing an unrequested auction window propagates TURN_END without starting an auction", async () => {
  const restore = installFakeBrowser();
  const harness = createHarness();
  const sessions = [];

  try {
    const decliner = await createOnlineClassicSession({
      roomId: "room-1",
      api: harness.apiFor("p1"),
    });
    const observer = await createOnlineClassicSession({
      roomId: "room-1",
      api: harness.apiFor("p2"),
    });
    sessions.push(decliner, observer);

    await decliner.declinePropertyForAuction();
    await harness.broadcast("p2");
    assert.equal(observer.getState().pendingChoice.type, "AUCTION_REQUEST");
    assert.deepEqual(observer.getState().pendingChoice.requestedByPlayerIds, []);

    await decliner.closeAuctionRequest();
    assert.equal(decliner.getState().version, 5);
    assert.equal(decliner.getState().phase, "TURN_END");
    assert.equal(decliner.getState().pendingChoice, null);
    assert.equal(decliner.getState().boardState.properties.tokyo.ownerId, null);

    await harness.broadcast("p2");
    assert.equal(observer.getState().version, 5);
    assert.equal(observer.getState().phase, "TURN_END");
    assert.equal(observer.getState().pendingChoice, null);
    assert.equal(observer.getState().boardState.properties.tokyo.ownerId, null);
  } finally {
    sessions.forEach((session) => session.dispose());
    restore();
  }
});

test("the declining player remains ineligible for authoritative auction bids", async () => {
  const restore = installFakeBrowser();
  const harness = createHarness();
  let session = null;

  try {
    harness.server.version = 6;
    harness.server.pendingChoice = auctionChoice();
    session = await createOnlineClassicSession({
      roomId: "room-1",
      api: harness.apiFor("p1"),
    });

    const model = createOnlineAuctionUiModel(session.getState(), "p1");
    assert.equal(model.eligible, false);
    assert.equal(model.canBid, false);
    await assert.rejects(() => session.auctionBid(240), /AUCTION_PLAYER_NOT_ELIGIBLE/);
    assert.equal(session.getState().version, 6);
  } finally {
    session?.dispose();
    restore();
  }
});

test("a reconnecting client reconstructs AUCTION_REQUEST and PROPERTY_AUCTION UI from snapshots alone", async () => {
  const restore = installFakeBrowser();
  const harness = createHarness();
  const sessions = [];

  try {
    harness.server.version = 4;
    harness.server.pendingChoice = requestChoice(["p2"]);
    const requestSession = await createOnlineClassicSession({
      roomId: "room-1",
      api: harness.apiFor("p3"),
    });
    sessions.push(requestSession);
    const requestUi = createOnlineAuctionUiModel(requestSession.getState(), "p3");
    assert.equal(requestUi.stage, "request");
    assert.equal(requestUi.canRequest, true);
    assert.equal(requestUi.requestCount, 1);
    requestSession.dispose();

    harness.server.version = 7;
    harness.server.pendingChoice = auctionChoice({
      bidPlayerIds: ["p2"],
      highestBid: 260,
      highestBidderId: "p2",
    });
    const auctionSession = await createOnlineClassicSession({
      roomId: "room-1",
      api: harness.apiFor("p3"),
    });
    sessions.push(auctionSession);
    const auctionUi = createOnlineAuctionUiModel(auctionSession.getState(), "p3");
    assert.equal(auctionUi.stage, "auction");
    assert.equal(auctionUi.highestBid, 260);
    assert.equal(auctionUi.minimumBid, 261);
    assert.equal(auctionUi.highestBidderName, "B");
    assert.equal(auctionUi.canPass, true);
  } finally {
    sessions.forEach((session) => session.dispose());
    restore();
  }
});

test("production RPC adapters keep the authoritative procedure names and parameter contract", () => {
  const apiSource = readFileSync(new URL("../js/onlineGameApi.js", import.meta.url), "utf8");
  assert.match(apiSource, /createOnlineGameApi/);
  assert.match(apiSource, /marble_decline_property_for_auction/);
  assert.match(apiSource, /marble_request_auction/);
  assert.match(apiSource, /marble_close_auction_request/);
  assert.match(apiSource, /marble_auction_bid/);
  assert.match(apiSource, /p_expected_version/);
  assert.match(apiSource, /p_client_action_id/);
  assert.match(apiSource, /p_amount/);
  assert.match(apiSource, /p_pass/);
});

test("authoritative SQL keeps the multiplayer restrictions exercised by the regression suite", () => {
  assert.match(authoritySql, /gp\.seat<>v_actor\.seat/);
  assert.match(authoritySql, /jsonb_array_length\(v_requested\)=0/);
  assert.match(authoritySql, /set phase='TURN_END', pending_choice=null/);
  assert.match(authoritySql, /'type','PROPERTY_AUCTION'/);
  assert.match(authoritySql, /v_minimum := case when v_highest>0 then v_highest\+1 else v_opening end/);
  assert.match(authoritySql, /AUCTION_BID_TOO_LOW/);
  assert.match(authoritySql, /INSUFFICIENT_GOLD/);
  assert.match(authoritySql, /AUCTION_HIGHEST_BIDDER_CANNOT_PASS/);
  assert.match(authoritySql, /\(v_requested \? v_player_id\) and not \(v_bids \? v_player_id\).*AUCTION_REQUESTER_BID_REQUIRED/s);
  assert.match(authoritySql, /private\.marble_action_replay/);
  assert.match(authoritySql, /VERSION_CONFLICT/);
  const replayBeforeVersionChecks = authoritySql.match(
    /private\.marble_action_replay[\s\S]*?VERSION_CONFLICT/g,
  ) ?? [];
  assert.equal(replayBeforeVersionChecks.length, 4);
  assert.match(authoritySql, /update public\.marble_game_players set money=money-v_highest/);
  assert.match(authoritySql, /update public\.marble_game_properties set owner_seat=v_winner\.seat, building_level=0/);
});
