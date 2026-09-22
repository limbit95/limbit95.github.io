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

test("local Classic session completes the 15 second Auction vote flow", () => {
  const values = [0, 0.2];
  let index = 0;
  let now = 1_000;
  const session = createLocalClassicSession({
    random: () => values[index++ % values.length],
    clock: () => now,
  });

  let state = session.start();
  state = session.roll();
  assert.equal(state.pendingChoice.type, "BUY_PROPERTY");

  state = session.endTurn();
  assert.equal(state.phase, TURN_PHASES.WAITING_CHOICE);
  assert.equal(state.pendingChoice.type, "AUCTION_VOTE");
  assert.equal(state.pendingChoice.openingBid, 390);
  assert.equal(state.pendingChoice.deadlineAt, 16_000);

  now = 2_000;
  state = session.joinAuction("player-b");
  assert.deepEqual(state.pendingChoice.participantPlayerIds, ["player-b"]);

  now = 2_500;
  state = session.passAuctionVote("player-d");
  assert.deepEqual(state.pendingChoice.passedPlayerIds, ["player-d"]);

  now = 3_000;
  state = session.joinAuction("player-c");
  assert.equal(state.pendingChoice.type, "PROPERTY_AUCTION");
  assert.deepEqual(state.pendingChoice.participantPlayerIds, ["player-c", "player-b"]);
  assert.equal(state.pendingChoice.auction.highestBidderId, "player-c");
  assert.equal(state.pendingChoice.auction.highestBid, 390);
  assert.equal(state.pendingChoice.auction.turnPlayerId, "player-b");
  assert.equal(state.pendingChoice.announcementEndsAt, 5_000);
  assert.equal(state.pendingChoice.rouletteStopsAt, 8_200);
  assert.equal(state.pendingChoice.winnerNoticeAt, 10_200);
  assert.equal(state.pendingChoice.startsAt, 12_200);

  now = 12_200;
  state = session.auctionPass("player-b");
  assert.equal(state.phase, TURN_PHASES.TURN_END);
  assert.equal(state.pendingChoice, null);
  assert.equal(state.boardState.properties.singapore.ownerId, "player-c");
  assert.equal(state.players[2].money, 1110);

  state = session.endTurn();
  assert.equal(state.currentPlayerIndex, 1);
  assert.equal(state.phase, TURN_PHASES.WAITING_ROLL);
});

test("local Classic session treats Auction vote timeout as pass", () => {
  const values = [0, 0.2];
  let index = 0;
  let now = 1_000;
  const session = createLocalClassicSession({
    random: () => values[index++ % values.length],
    clock: () => now,
  });

  let state = session.start();
  state = session.roll();
  state = session.endTurn();
  assert.equal(state.pendingChoice.type, "AUCTION_VOTE");

  now = 16_000;
  state = session.advanceAuctionDeadline();

  assert.equal(state.phase, TURN_PHASES.TURN_END);
  assert.equal(state.pendingChoice, null);
  assert.equal(state.boardState.properties.singapore.ownerId, null);
  assert.equal(
    state.lastEvents.filter((event) => event.type === "AUCTION_VOTE_AUTO_PASSED").length,
    3,
  );

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


test("local Classic session exposes Phase 7C liquidation actions through the runtime adapter", () => {
  const session = createLocalClassicSession();
  const state = session.start();

  assert.equal(state.phase, TURN_PHASES.WAITING_ROLL);
  assert.equal(typeof session.selectLiquidation, "function");
  assert.equal(typeof session.confirmLiquidation, "function");

  assert.throws(
    () => session.selectLiquidation(["singapore"]),
    /reserved for a later Marble phase|debt recovery/i,
  );
  assert.throws(
    () => session.confirmLiquidation(),
    /reserved for a later Marble phase|debt recovery/i,
  );
});
