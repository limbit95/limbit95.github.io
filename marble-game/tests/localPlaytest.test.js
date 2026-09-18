import test from "node:test";
import assert from "node:assert/strict";

import { GAME_STATUS } from "../js/core/gameEngine.js";
import { TURN_PHASES } from "../js/core/turnMachine.js";
import { createLocalClassicSession } from "../js/localPlaytest.js";

test("local Classic session can start, buy a property, and advance turn", () => {
  const values = [0, 0.2];
  let index = 0;
  const session = createLocalClassicSession({ random: () => values[index++ % values.length] });

  let state = session.start();
  assert.equal(state.status, GAME_STATUS.PLAYING);
  assert.equal(state.phase, TURN_PHASES.WAITING_ROLL);
  assert.equal(state.currentPlayerIndex, 0);

  state = session.roll();
  assert.equal(state.lastRoll.total, 3);
  assert.equal(state.players[0].positionNodeId, "singapore");
  assert.equal(state.pendingChoice.type, "BUY_PROPERTY");

  state = session.buy();
  assert.equal(state.boardState.properties.singapore.ownerId, "player-a");
  assert.equal(state.phase, TURN_PHASES.TURN_END);

  state = session.endTurn();
  assert.equal(state.currentPlayerIndex, 1);
  assert.equal(state.phase, TURN_PHASES.WAITING_ROLL);
});

test("local Classic session completes the request-gated auction flow and advances turn", () => {
  const values = [0, 0.2];
  let index = 0;
  const session = createLocalClassicSession({ random: () => values[index++ % values.length] });

  let state = session.start();
  state = session.roll();
  assert.equal(state.pendingChoice.type, "BUY_PROPERTY");

  state = session.endTurn();
  assert.equal(state.phase, TURN_PHASES.WAITING_CHOICE);
  assert.equal(state.pendingChoice.type, "AUCTION_REQUEST");
  assert.deepEqual(state.pendingChoice.requestedByPlayerIds, []);

  state = session.requestAuction("player-b");
  assert.deepEqual(state.pendingChoice.requestedByPlayerIds, ["player-b"]);

  state = session.closeAuctionRequest();
  assert.equal(state.pendingChoice.type, "PROPERTY_AUCTION");
  assert.deepEqual(state.pendingChoice.auction.requestedByPlayerIds, ["player-b"]);

  state = session.auctionBid("player-b", 260);
  assert.equal(state.pendingChoice.auction.highestBidderId, "player-b");

  state = session.auctionPass("player-c");
  state = session.auctionPass("player-d");
  assert.equal(state.phase, TURN_PHASES.TURN_END);
  assert.equal(state.pendingChoice, null);
  assert.equal(state.boardState.properties.singapore.ownerId, "player-b");
  assert.equal(state.players[1].money, 1240);

  state = session.endTurn();
  assert.equal(state.currentPlayerIndex, 1);
  assert.equal(state.phase, TURN_PHASES.WAITING_ROLL);
});

test("local Classic session ends the turn without opening an auction when nobody requests it", () => {
  const values = [0, 0.2];
  let index = 0;
  const session = createLocalClassicSession({ random: () => values[index++ % values.length] });

  let state = session.start();
  state = session.roll();
  state = session.endTurn();
  state = session.closeAuctionRequest();

  assert.equal(state.phase, TURN_PHASES.TURN_END);
  assert.equal(state.pendingChoice, null);
  assert.equal(state.boardState.properties.singapore.ownerId, null);

  state = session.endTurn();
  assert.equal(state.currentPlayerIndex, 1);
  assert.equal(state.phase, TURN_PHASES.WAITING_ROLL);
});


test("local Classic session can propose, accept, and settle a pre-roll trade", () => {
  const values = [0, 0.2];
  let index = 0;
  const session = createLocalClassicSession({ random: () => values[index++ % values.length] });

  let state = session.start();
  state = session.roll();
  state = session.buy();
  state = session.endTurn();

  assert.equal(state.currentPlayerIndex, 1);
  assert.equal(state.phase, TURN_PHASES.WAITING_ROLL);
  assert.equal(state.boardState.properties.singapore.ownerId, "player-a");

  state = session.offerTrade(
    "player-a",
    {
      offered: { gold: 100 },
      requested: { propertyIds: ["singapore"] },
    },
    "local-trade-1",
  );

  assert.equal(state.pendingTrade.status, "OPEN");
  assert.equal(state.pendingTrade.proposerPlayerId, "player-b");
  assert.equal(state.pendingTrade.recipientPlayerId, "player-a");

  state = session.acceptTrade("player-a");

  assert.equal(state.pendingTrade, null);
  assert.equal(state.phase, TURN_PHASES.WAITING_ROLL);
  assert.equal(state.currentPlayerIndex, 1);
  assert.equal(state.boardState.properties.singapore.ownerId, "player-b");
  assert.equal(state.players.find((player) => player.id === "player-a").money, 1340);
  assert.equal(state.players.find((player) => player.id === "player-b").money, 1400);
  assert.deepEqual(state.lastEvents.map((event) => event.type), [
    "TRADE_ACCEPTED",
    "TRADE_SETTLED",
  ]);
});

test("local Classic session rejects a trade and resumes the same pre-roll turn", () => {
  const session = createLocalClassicSession();

  let state = session.start();
  state = session.offerTrade(
    "player-b",
    { offered: { gold: 100 } },
    "local-trade-2",
  );

  assert.throws(
    () => session.roll(),
    /must be resolved before continuing/i,
  );

  state = session.rejectTrade("player-b");
  assert.equal(state.pendingTrade, null);
  assert.equal(state.phase, TURN_PHASES.WAITING_ROLL);
  assert.equal(state.currentPlayerIndex, 0);
  assert.deepEqual(state.lastEvents.map((event) => event.type), ["TRADE_REJECTED"]);
});

test("local Classic proposer can cancel an unanswered trade and continue the turn", () => {
  const session = createLocalClassicSession();

  let state = session.start();
  state = session.offerTrade(
    "player-b",
    { offered: { gold: 50 } },
    "local-trade-cancel",
  );

  assert.throws(
    () => session.cancelTrade("player-b"),
    /Only the trade proposer/i,
  );

  state = session.cancelTrade("player-a");
  assert.equal(state.pendingTrade, null);
  assert.equal(state.phase, TURN_PHASES.WAITING_ROLL);
  assert.equal(state.currentPlayerIndex, 0);
  assert.deepEqual(state.lastEvents.map((event) => event.type), ["TRADE_CANCELLED"]);
});
