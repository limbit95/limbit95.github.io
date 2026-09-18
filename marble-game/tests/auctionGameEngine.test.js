import test from "node:test";
import assert from "node:assert/strict";

import { ACTION_TYPES, createAction } from "../js/core/actions.js";
import { createInitialGameState } from "../js/core/gameEngine.js";
import { reducePhase7GameAction } from "../js/core/auctionGameEngine.js";
import { TURN_PHASES } from "../js/core/turnMachine.js";

function reduce(state, type, playerId = null, payload = {}, nowMs = 1_000) {
  return reducePhase7GameAction(
    state,
    createAction({ type, playerId, payload }),
    { nowMs },
  );
}

function start(players = ["a", "b", "c"]) {
  return reduce(
    createInitialGameState({ players }),
    ACTION_TYPES.START_GAME,
  );
}

function roll(state, playerId, dice, nowMs = 1_000) {
  return reduce(state, ACTION_TYPES.ROLL_DICE, playerId, { dice }, nowMs);
}

function declinePurchase(state, playerId, nowMs = 1_000) {
  return reduce(state, ACTION_TYPES.END_TURN, playerId, {}, nowMs);
}

test("purchase decline opens a 10 second request window at 150 percent price", () => {
  let state = roll(start(), "a", [1, 2]);
  state = declinePurchase(state, "a", 5_000);

  assert.equal(state.phase, TURN_PHASES.WAITING_CHOICE);
  assert.equal(state.pendingChoice.type, "AUCTION_REQUEST");
  assert.equal(state.pendingChoice.nodeId, "singapore");
  assert.equal(state.pendingChoice.basePrice, 260);
  assert.equal(state.pendingChoice.openingBid, 390);
  assert.equal(state.pendingChoice.deadlineAt, 15_000);
  assert.deepEqual(state.pendingChoice.eligiblePlayerIds, ["b", "c"]);
  assert.equal(state.pendingChoice.declinedByPlayerId, "a");
});

test("requester immediately opens recruitment and later concurrent requests become ordered participants", () => {
  let state = declinePurchase(roll(start(["a", "b", "c", "d"]), "a", [1, 2]), "a", 1_000);

  state = reduce(state, ACTION_TYPES.AUCTION_REQUEST, "b", {}, 2_000);
  assert.equal(state.pendingChoice.type, "AUCTION_RECRUITMENT");
  assert.equal(state.pendingChoice.requesterPlayerId, "b");
  assert.deepEqual(state.pendingChoice.participantPlayerIds, ["b"]);
  assert.equal(state.pendingChoice.deadlineAt, 12_000);

  state = reduce(state, ACTION_TYPES.AUCTION_REQUEST, "c", {}, 2_100);
  assert.deepEqual(state.pendingChoice.participantPlayerIds, ["b", "c"]);
  assert.equal(state.lastEvents[0].source, "CONCURRENT_REQUEST");

  state = reduce(state, ACTION_TYPES.AUCTION_JOIN, "d", {}, 2_200);
  assert.deepEqual(state.pendingChoice.participantPlayerIds, ["b", "c", "d"]);
});

test("normal participants may withdraw during recruitment but requester may not", () => {
  let state = declinePurchase(roll(start(["a", "b", "c"]), "a", [1, 2]), "a", 1_000);
  state = reduce(state, ACTION_TYPES.AUCTION_REQUEST, "b", {}, 2_000);
  state = reduce(state, ACTION_TYPES.AUCTION_JOIN, "c", {}, 2_100);

  assert.throws(
    () => reduce(state, ACTION_TYPES.AUCTION_WITHDRAW, "b", {}, 2_200),
    /requester cannot withdraw/i,
  );

  state = reduce(state, ACTION_TYPES.AUCTION_WITHDRAW, "c", {}, 2_200);
  assert.deepEqual(state.pendingChoice.participantPlayerIds, ["b"]);
});

test("request window still lasts 10 seconds when nobody can afford the opening bid", () => {
  let state = roll(start(["a", "b"]), "a", [1, 2]);
  state = Object.freeze({
    ...state,
    players: Object.freeze([
      state.players[0],
      Object.freeze({ ...state.players[1], money: 100 }),
    ]),
  });
  state = declinePurchase(state, "a", 1_000);

  assert.equal(state.pendingChoice.type, "AUCTION_REQUEST");
  assert.deepEqual(state.pendingChoice.eligiblePlayerIds, []);
  assert.equal(state.pendingChoice.deadlineAt, 11_000);

  state = reduce(state, ACTION_TYPES.AUCTION_REQUEST_CLOSE, null, {}, 11_000);
  assert.equal(state.phase, TURN_PHASES.TURN_END);
  assert.equal(state.pendingChoice, null);
  assert.equal(state.boardState.properties.singapore.ownerId, null);
});

test("request deadline with no request ends the auction flow and keeps the property unsold", () => {
  let state = declinePurchase(roll(start(), "a", [1, 2]), "a", 1_000);

  assert.throws(
    () => reduce(state, ACTION_TYPES.AUCTION_REQUEST_CLOSE, null, {}, 10_999),
    /deadline has not expired/i,
  );

  state = reduce(state, ACTION_TYPES.AUCTION_REQUEST_CLOSE, null, {}, 11_000);
  assert.equal(state.phase, TURN_PHASES.TURN_END);
  assert.equal(state.pendingChoice, null);
  assert.equal(state.boardState.properties.singapore.ownerId, null);
});

test("sole recruitment participant automatically buys at opening bid with normal purchase event", () => {
  let state = declinePurchase(roll(start(["a", "b"]), "a", [1, 2]), "a", 1_000);
  state = reduce(state, ACTION_TYPES.AUCTION_REQUEST, "b", {}, 2_000);

  state = reduce(state, ACTION_TYPES.AUCTION_RECRUITMENT_CLOSE, null, {}, 12_000);

  assert.equal(state.phase, TURN_PHASES.TURN_END);
  assert.equal(state.pendingChoice, null);
  assert.equal(state.boardState.properties.singapore.ownerId, "b");
  assert.equal(state.players[1].money, 1110);
  assert.equal(state.lastEvents.some((event) => event.type === "AUCTION_AUTO_PURCHASED"), true);
  assert.equal(state.lastEvents.some((event) => (
    event.type === "PROPERTY_BOUGHT"
    && event.playerId === "b"
    && event.amount === 390
    && event.reason === "AUCTION"
  )), true);
});

test("competitive recruitment starts with requester auto-bid and participant join order", () => {
  let state = declinePurchase(roll(start(["a", "b", "c", "d"]), "a", [1, 2]), "a", 1_000);
  state = reduce(state, ACTION_TYPES.AUCTION_REQUEST, "b", {}, 2_000);
  state = reduce(state, ACTION_TYPES.AUCTION_JOIN, "c", {}, 2_100);
  state = reduce(state, ACTION_TYPES.AUCTION_JOIN, "d", {}, 2_200);

  state = reduce(state, ACTION_TYPES.AUCTION_RECRUITMENT_CLOSE, null, {}, 12_000);

  assert.equal(state.pendingChoice.type, "PROPERTY_AUCTION");
  assert.equal(state.pendingChoice.auction.highestBidderId, "b");
  assert.equal(state.pendingChoice.auction.highestBid, 390);
  assert.deepEqual(state.pendingChoice.auction.participantPlayerIds, ["b", "c", "d"]);
  assert.equal(state.pendingChoice.auction.turnPlayerId, "c");
  assert.equal(state.pendingChoice.auction.turnDeadlineAt, 22_000);

  state = reduce(state, ACTION_TYPES.AUCTION_BID, "c", { amount: 400 }, 13_000);
  assert.equal(state.pendingChoice.auction.highestBidderId, "c");
  assert.equal(state.pendingChoice.auction.turnPlayerId, "d");
  assert.equal(state.pendingChoice.auction.turnDeadlineAt, 23_000);
});

test("bid timeout automatically passes the current participant", () => {
  let state = declinePurchase(roll(start(["a", "b", "c"]), "a", [1, 2]), "a", 1_000);
  state = reduce(state, ACTION_TYPES.AUCTION_REQUEST, "b", {}, 2_000);
  state = reduce(state, ACTION_TYPES.AUCTION_JOIN, "c", {}, 2_100);
  state = reduce(state, ACTION_TYPES.AUCTION_RECRUITMENT_CLOSE, null, {}, 12_000);

  assert.throws(
    () => reduce(state, ACTION_TYPES.AUCTION_BID_TIMEOUT, null, {}, 21_999),
    /deadline has not expired/i,
  );

  state = reduce(state, ACTION_TYPES.AUCTION_BID_TIMEOUT, null, {}, 22_000);
  assert.equal(state.phase, TURN_PHASES.TURN_END);
  assert.equal(state.boardState.properties.singapore.ownerId, "b");
  assert.equal(state.lastEvents.some((event) => (
    event.type === "AUCTION_AUTO_PASSED"
    && event.playerId === "c"
    && event.reason === "TIMEOUT"
  )), true);
});

test("declining player never becomes eligible for request, recruitment, or bidding", () => {
  let state = declinePurchase(roll(start(), "a", [1, 2]), "a", 1_000);
  assert.deepEqual(state.pendingChoice.eligiblePlayerIds, ["b", "c"]);
  assert.throws(
    () => reduce(state, ACTION_TYPES.AUCTION_REQUEST, "a", {}, 2_000),
    /not eligible/i,
  );
});

test("non-auction actions keep delegating to the stable reducer", () => {
  const state = start(["a", "b"]);
  assert.equal(state.phase, TURN_PHASES.WAITING_ROLL);
  assert.equal(state.currentPlayerIndex, 0);
});
