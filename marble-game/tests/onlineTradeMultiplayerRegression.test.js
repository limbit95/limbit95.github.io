import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const originalWindow = globalThis.window;
globalThis.window = globalThis.window ?? {};
const { createOnlineClassicSession } = await import("../js/onlineSession.js");
const { createOnlineGameApi } = await import("../js/onlineGameApi.js");
const { createOnlineTradeUiModel } = await import("../js/onlineTradeUi.js");
globalThis.window = originalWindow;

const authoritySql = readFileSync(
  new URL("../../supabase/marble/20260918133500_marble_phase7b_trading_authority.sql", import.meta.url),
  "utf8",
);

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

function clone(value) {
  return value === null || value === undefined ? value : JSON.parse(JSON.stringify(value));
}

function createHarness() {
  const changes = new Map();
  const snapshotOverrides = new Map();
  const actionCalls = [];
  const server = {
    version: 10,
    phase: "WAITING_ROLL",
    currentSeat: 0,
    pendingTrade: null,
    lastEvents: [],
    players: [
      { id: "p1", userId: "u1", name: "A", seat: 0, positionNodeId: "start", money: 1500, bankrupt: false, skipTurns: 0 },
      { id: "p2", userId: "u2", name: "B", seat: 1, positionNodeId: "start", money: 1200, bankrupt: false, skipTurns: 0 },
      { id: "p3", userId: "u3", name: "C", seat: 2, positionNodeId: "start", money: 1100, bankrupt: false, skipTurns: 0 },
    ],
    properties: {
      singapore: { ownerId: "p1", ownerSeat: 0, buildingLevel: 0 },
      tokyo: { ownerId: "p2", ownerSeat: 1, buildingLevel: 0 },
      seoul: { ownerId: "p3", ownerSeat: 2, buildingLevel: 0 },
    },
  };

  function snapshotFor(viewerPlayerId) {
    return {
      room: { id: "room-1", roomCode: "ABC123", status: "playing", currentGameId: "game-1" },
      game: {
        id: "game-1",
        status: "playing",
        phase: server.phase,
        turn: 4,
        currentSeat: server.currentSeat,
        version: server.version,
        pendingChoice: null,
        pendingTrade: clone(server.pendingTrade),
        lastRoll: null,
        lastEvents: clone(server.lastEvents),
        winnerPlayerId: null,
        rulesetVersion: 1,
      },
      players: clone(server.players),
      properties: clone(server.properties),
      viewerUserId: server.players.find((player) => player.id === viewerPlayerId)?.userId ?? null,
      viewerPlayerId,
    };
  }

  function assertCommon(params) {
    assert.equal(params.p_room_id, "room-1");
    assert.equal(params.p_expected_version, server.version);
    assert.equal(typeof params.p_client_action_id, "string");
    assert.ok(params.p_client_action_id.length > 0);
  }

  function bump(events) {
    server.version += 1;
    server.lastEvents = events;
  }

  async function executeRpc(viewerPlayerId, name, params = {}) {
    if (name === "marble_get_game_snapshot") {
      return snapshotOverrides.get(viewerPlayerId) ?? snapshotFor(viewerPlayerId);
    }

    assertCommon(params);
    actionCalls.push({ viewerPlayerId, name, ...params });

    if (name === "marble_trade_offer") {
      assert.equal(viewerPlayerId, "p1");
      assert.equal(server.phase, "WAITING_ROLL");
      assert.equal(server.currentSeat, 0);
      assert.equal(server.pendingTrade, null);
      assert.equal(params.p_recipient_player_id, "p2");
      server.pendingTrade = {
        type: "PLAYER_TRADE",
        offerId: params.p_offer_id,
        proposerPlayerId: "p1",
        recipientPlayerId: "p2",
        terms: clone(params.p_terms),
        status: "OPEN",
        resolvedByPlayerId: null,
      };
      bump([{
        type: "TRADE_OFFERED",
        offerId: params.p_offer_id,
        proposerPlayerId: "p1",
        recipientPlayerId: "p2",
        terms: clone(params.p_terms),
      }]);
      return snapshotFor(viewerPlayerId);
    }

    if (name === "marble_trade_accept") {
      assert.equal(viewerPlayerId, "p2");
      assert.equal(server.pendingTrade?.offerId, params.p_offer_id);
      const trade = server.pendingTrade;
      const offeredGold = Number(trade.terms.offered?.gold) || 0;
      const requestedGold = Number(trade.terms.requested?.gold) || 0;
      const proposer = server.players.find((player) => player.id === "p1");
      const recipient = server.players.find((player) => player.id === "p2");
      proposer.money = proposer.money - offeredGold + requestedGold;
      recipient.money = recipient.money - requestedGold + offeredGold;
      for (const propertyId of trade.terms.offered?.propertyIds ?? []) {
        server.properties[propertyId].ownerId = "p2";
        server.properties[propertyId].ownerSeat = 1;
      }
      for (const propertyId of trade.terms.requested?.propertyIds ?? []) {
        server.properties[propertyId].ownerId = "p1";
        server.properties[propertyId].ownerSeat = 0;
      }
      server.pendingTrade = null;
      bump([
        { type: "TRADE_ACCEPTED", offerId: params.p_offer_id, proposerPlayerId: "p1", recipientPlayerId: "p2" },
        { type: "TRADE_SETTLED", offerId: params.p_offer_id, proposerPlayerId: "p1", recipientPlayerId: "p2", terms: clone(trade.terms) },
      ]);
      return snapshotFor(viewerPlayerId);
    }

    if (name === "marble_trade_reject") {
      assert.equal(viewerPlayerId, "p2");
      assert.equal(server.pendingTrade?.offerId, params.p_offer_id);
      const trade = server.pendingTrade;
      server.pendingTrade = null;
      bump([{
        type: "TRADE_REJECTED",
        offerId: params.p_offer_id,
        proposerPlayerId: trade.proposerPlayerId,
        recipientPlayerId: trade.recipientPlayerId,
      }]);
      return snapshotFor(viewerPlayerId);
    }

    if (name === "marble_trade_cancel") {
      assert.equal(viewerPlayerId, "p1");
      assert.equal(server.pendingTrade?.offerId, params.p_offer_id);
      const trade = server.pendingTrade;
      server.pendingTrade = null;
      bump([{
        type: "TRADE_CANCELLED",
        offerId: params.p_offer_id,
        proposerPlayerId: trade.proposerPlayerId,
        recipientPlayerId: trade.recipientPlayerId,
      }]);
      return snapshotFor(viewerPlayerId);
    }

    throw new Error("UNEXPECTED_RPC:" + name);
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
            changes.set(viewerPlayerId, {
              change: () => changeHandler?.(),
              status: statusHandler,
            });
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
    viewerPlayerIds.forEach((playerId) => changes.get(playerId)?.change?.());
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

test("three online clients propagate trade offer and authoritative settlement consistently", async () => {
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
    const [proposer, recipient, observer] = sessions;

    const terms = {
      offered: { propertyIds: ["singapore"], gold: 100 },
      requested: { propertyIds: ["tokyo"], gold: 50 },
    };

    await proposer.offerTrade("p2", terms, "11111111-1111-4111-8111-111111111111");
    assert.equal(proposer.getState().version, 11);
    assert.equal(proposer.getState().pendingTrade.offerId, "11111111-1111-4111-8111-111111111111");

    await harness.broadcast("p2", "p3");
    assert.equal(recipient.getState().pendingTrade.recipientPlayerId, "p2");
    assert.equal(observer.getState().pendingTrade.proposerPlayerId, "p1");

    const recipientUi = createOnlineTradeUiModel(recipient.getState(), "p2");
    const observerUi = createOnlineTradeUiModel(observer.getState(), "p3");
    assert.equal(recipientUi.canAccept, true);
    assert.equal(recipientUi.canReject, true);
    assert.equal(observerUi.canAccept, false);

    const staleObserverSnapshot = harness.snapshotFor("p3");

    await recipient.acceptTrade();
    assert.equal(recipient.getState().version, 12);
    assert.equal(recipient.getState().pendingTrade, null);
    assert.equal(recipient.getState().players.find((player) => player.id === "p1").money, 1450);
    assert.equal(recipient.getState().players.find((player) => player.id === "p2").money, 1250);
    assert.equal(recipient.getState().boardState.properties.singapore.ownerId, "p2");
    assert.equal(recipient.getState().boardState.properties.tokyo.ownerId, "p1");

    await harness.broadcast("p1", "p3");
    for (const session of [proposer, observer]) {
      assert.equal(session.getState().version, 12);
      assert.equal(session.getState().pendingTrade, null);
      assert.equal(session.getState().boardState.properties.singapore.ownerId, "p2");
      assert.equal(session.getState().boardState.properties.tokyo.ownerId, "p1");
    }

    harness.snapshotOverrides.set("p3", staleObserverSnapshot);
    await harness.broadcast("p3");
    assert.equal(observer.getState().version, 12);
    assert.equal(observer.getState().boardState.properties.singapore.ownerId, "p2");

    assert.deepEqual(
      harness.actionCalls.map((call) => call.p_expected_version),
      [10, 11],
    );
    assert.equal(
      new Set(harness.actionCalls.map((call) => call.p_client_action_id)).size,
      harness.actionCalls.length,
    );
    assert.equal(harness.actionCalls[0].p_offer_id, "11111111-1111-4111-8111-111111111111");
    assert.equal(harness.actionCalls[1].p_offer_id, "11111111-1111-4111-8111-111111111111");
  } finally {
    sessions.forEach((session) => session.dispose());
    restore();
  }
});

test("trade rejection propagates without changing balances or ownership", async () => {
  const restore = installFakeBrowser();
  const harness = createHarness();
  const sessions = [];

  try {
    const proposer = await createOnlineClassicSession({ roomId: "room-1", api: harness.apiFor("p1") });
    const recipient = await createOnlineClassicSession({ roomId: "room-1", api: harness.apiFor("p2") });
    sessions.push(proposer, recipient);

    const before = clone(harness.server);
    const offerId = "22222222-2222-4222-8222-222222222222";
    await proposer.offerTrade("p2", {
      offered: { propertyIds: ["singapore"], gold: 0 },
      requested: { propertyIds: [], gold: 100 },
    }, offerId);
    await harness.broadcast("p2");

    await recipient.rejectTrade();
    assert.equal(recipient.getState().pendingTrade, null);
    assert.equal(recipient.getState().version, 12);
    assert.equal(harness.server.players[0].money, before.players[0].money);
    assert.equal(harness.server.players[1].money, before.players[1].money);
    assert.equal(harness.server.properties.singapore.ownerId, before.properties.singapore.ownerId);

    await harness.broadcast("p1");
    assert.equal(proposer.getState().pendingTrade, null);
    assert.equal(proposer.getState().version, 12);
  } finally {
    sessions.forEach((session) => session.dispose());
    restore();
  }
});

test("proposer cancellation propagates and releases the pre-roll action lock", async () => {
  const restore = installFakeBrowser();
  const harness = createHarness();
  const sessions = [];

  try {
    const proposer = await createOnlineClassicSession({ roomId: "room-1", api: harness.apiFor("p1") });
    const observer = await createOnlineClassicSession({ roomId: "room-1", api: harness.apiFor("p3") });
    sessions.push(proposer, observer);

    const offerId = "55555555-5555-4555-8555-555555555555";
    await proposer.offerTrade("p2", {
      offered: { gold: 50 },
      requested: { gold: 0 },
    }, offerId);
    await harness.broadcast("p3");
    assert.equal(observer.getState().pendingTrade?.offerId, offerId);

    await proposer.cancelTrade();
    assert.equal(proposer.getState().pendingTrade, null);
    assert.equal(proposer.getState().phase, "WAITING_ROLL");
    assert.deepEqual(proposer.getState().lastEvents.map((event) => event.type), ["TRADE_CANCELLED"]);

    await harness.broadcast("p3");
    assert.equal(observer.getState().pendingTrade, null);
    assert.equal(observer.getState().version, 12);
  } finally {
    sessions.forEach((session) => session.dispose());
    restore();
  }
});

test("reconnecting clients reconstruct an open trade and response UI from snapshot alone", async () => {
  const restore = installFakeBrowser();
  const harness = createHarness();
  let session = null;

  try {
    harness.server.version = 21;
    harness.server.pendingTrade = {
      type: "PLAYER_TRADE",
      offerId: "33333333-3333-4333-8333-333333333333",
      proposerPlayerId: "p1",
      recipientPlayerId: "p2",
      terms: {
        offered: { propertyIds: ["singapore"], gold: 50 },
        requested: { propertyIds: [], gold: 0 },
      },
      status: "OPEN",
      resolvedByPlayerId: null,
    };

    session = await createOnlineClassicSession({
      roomId: "room-1",
      api: harness.apiFor("p2"),
    });

    assert.equal(session.getState().pendingTrade.offerId, "33333333-3333-4333-8333-333333333333");
    const model = createOnlineTradeUiModel(session.getState(), "p2");
    assert.equal(model.mode, "pending");
    assert.equal(model.canAccept, true);
    assert.match(model.offeredLabel, /싱가포르|singapore/);
  } finally {
    session?.dispose();
    restore();
  }
});

test("trade authority contract keeps server-side pending-state and stale-state guards", () => {
  assert.match(authoritySql, /pending_trade jsonb/);
  assert.match(authoritySql, /raise exception 'TRADE_PENDING'/);
  assert.match(authoritySql, /VERSION_CONFLICT/);
  assert.match(authoritySql, /TRADE_OFFER_MISMATCH/);
  assert.match(authoritySql, /TRADE_PROPERTY_OWNERSHIP_CHANGED/);
  assert.match(authoritySql, /TRADE_IMPROVED_PROPERTY_NOT_ALLOWED/);
  assert.match(authoritySql, /update public\.marble_game_players[\s\S]*money = money - v_offered_gold \+ v_requested_gold/);
  assert.match(authoritySql, /update public\.marble_game_properties[\s\S]*set owner_seat = v_actor\.seat/);
});
