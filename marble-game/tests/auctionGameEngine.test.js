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
  return reduce(createInitialGameState({ players }), ACTION_TYPES.START_GAME);
}

function roll(state, playerId, dice, nowMs = 1_000) {
  return reduce(state, ACTION_TYPES.ROLL_DICE, playerId, { dice }, nowMs);
}

function declinePurchase(state, playerId, nowMs = 1_000) {
  return reduce(state, ACTION_TYPES.END_TURN, playerId, {}, nowMs);
}

test("purchase decline opens one 15 second Auction vote at 150 percent", () => {
  let state = roll(start(), "a", [1, 2]);
  state = declinePurchase(state, "a", 5_000);

  assert.equal(state.phase, TURN_PHASES.WAITING_CHOICE);
  assert.equal(state.pendingChoice.type, "AUCTION_VOTE");
  assert.equal(state.pendingChoice.nodeId, "singapore");
  assert.equal(state.pendingChoice.basePrice, 260);
  assert.equal(state.pendingChoice.openingBid, 390);
  assert.equal(state.pendingChoice.deadlineAt, 20_000);
  assert.equal(state.pendingChoice.openedVersion, state.version);
  assert.deepEqual(state.pendingChoice.eligiblePlayerIds, ["b", "c"]);
  assert.deepEqual(state.pendingChoice.participantPlayerIds, []);
  assert.deepEqual(state.pendingChoice.passedPlayerIds, []);
  assert.equal(state.pendingChoice.declinedByPlayerId, "a");
});

test("join and pass are irreversible one-time Auction votes", () => {
  let state = declinePurchase(roll(start(["a", "b", "c", "d"]), "a", [1, 2]), "a", 1_000);

  state = reduce(state, ACTION_TYPES.AUCTION_JOIN, "b", {}, 2_000);
  assert.deepEqual(state.pendingChoice.participantPlayerIds, ["b"]);

  assert.throws(
    () => reduce(state, ACTION_TYPES.AUCTION_PASS, "b", {}, 2_100),
    /already final/i,
  );

  state = reduce(state, ACTION_TYPES.AUCTION_PASS, "c", {}, 2_200);
  assert.deepEqual(state.pendingChoice.passedPlayerIds, ["c"]);

  assert.throws(
    () => reduce(state, ACTION_TYPES.AUCTION_JOIN, "c", {}, 2_300),
    /already final/i,
  );
});

test("all responded ends voting immediately and preserves join order as bid order", () => {
  let state = declinePurchase(roll(start(["a", "b", "c", "d"]), "a", [1, 2]), "a", 1_000);

  state = reduce(state, ACTION_TYPES.AUCTION_JOIN, "c", {}, 2_000);
  state = reduce(state, ACTION_TYPES.AUCTION_JOIN, "b", {}, 2_100);
  state = reduce(state, ACTION_TYPES.AUCTION_PASS, "d", {}, 2_200);

  assert.equal(state.pendingChoice.type, "PROPERTY_AUCTION");
  assert.deepEqual(state.pendingChoice.participantPlayerIds, ["c", "b"]);
  assert.equal(state.pendingChoice.starterPlayerId, "c");
  assert.equal(state.pendingChoice.auction.highestBidderId, null);
  assert.equal(state.pendingChoice.auction.highestBid, 0);
  assert.equal(state.pendingChoice.auction.turnPlayerId, "c");
  assert.equal(state.pendingChoice.announcementEndsAt, 4_200);
  assert.equal(state.pendingChoice.selectorStopsAt, 7_000);
  assert.equal(state.pendingChoice.selectorResultEndsAt, 7_800);
  assert.equal(state.pendingChoice.startsAt, 7_800);
  assert.equal(state.pendingChoice.auction.turnDeadlineAt, 22_800);
  assert.equal(state.lastEvents.at(-1).type, "AUCTION_STARTING");
});

test("all eligible players joining starts the auction before the vote deadline", () => {
  let state = declinePurchase(roll(start(["a", "b", "c"]), "a", [1, 2]), "a", 1_000);
  state = reduce(state, ACTION_TYPES.AUCTION_JOIN, "b", {}, 2_000);

  assert.equal(state.pendingChoice.type, "AUCTION_VOTE");
  state = reduce(state, ACTION_TYPES.AUCTION_JOIN, "c", {}, 2_100);

  assert.equal(state.pendingChoice.type, "PROPERTY_AUCTION");
  assert.equal(state.pendingChoice.auction.highestBidderId, null);
  assert.equal(state.pendingChoice.auction.turnPlayerId, state.pendingChoice.starterPlayerId);
});

test("two-or-more participants use authority randomness for the starting player", () => {
  let state = declinePurchase(roll(start(["a", "b", "c", "d"]), "a", [1, 2]), "a", 1_000);
  state = reduce(state, ACTION_TYPES.AUCTION_JOIN, "b", {}, 2_000);
  state = reduce(state, ACTION_TYPES.AUCTION_JOIN, "c", {}, 2_100);

  const action = createAction({
    type: ACTION_TYPES.AUCTION_JOIN,
    playerId: "d",
    payload: {},
  });
  state = reducePhase7GameAction(state, action, {
    nowMs: 2_200,
    random: () => 0,
  });

  assert.deepEqual(state.pendingChoice.participantPlayerIds, ["c", "d", "b"]);
  assert.equal(state.pendingChoice.starterPlayerId, "c");
  assert.equal(state.pendingChoice.auction.highestBidderId, null);
  assert.equal(state.pendingChoice.auction.highestBid, 0);
  assert.equal(state.pendingChoice.auction.turnPlayerId, "c");
  assert.equal(state.pendingChoice.announcementEndsAt, 4_200);
  assert.equal(state.pendingChoice.selectorStopsAt, 7_000);
  assert.equal(state.pendingChoice.selectorResultEndsAt, 7_800);
  assert.equal(state.pendingChoice.startsAt, 7_800);
});

test("competitive bids are blocked until the selector window ends", () => {
  let state = declinePurchase(roll(start(["a", "b", "c"]), "a", [1, 2]), "a", 1_000);
  state = reduce(state, ACTION_TYPES.AUCTION_JOIN, "b", {}, 2_000);
  state = reduce(state, ACTION_TYPES.AUCTION_JOIN, "c", {}, 2_100);

  assert.throws(
    () => reduce(state, ACTION_TYPES.AUCTION_BID, "c", { amount: 400 }, 7_699),
    /has not started yet/i,
  );

  state = reduce(state, ACTION_TYPES.AUCTION_BID, "c", { amount: 400 }, 7_700);
  assert.equal(state.pendingChoice.auction.highestBid, 400);
});

test("one join plus all other passes immediately auto-buys at the opening bid", () => {
  let state = declinePurchase(roll(start(["a", "b", "c"]), "a", [1, 2]), "a", 1_000);
  state = reduce(state, ACTION_TYPES.AUCTION_JOIN, "b", {}, 2_000);
  state = reduce(state, ACTION_TYPES.AUCTION_PASS, "c", {}, 2_100);

  assert.equal(state.phase, TURN_PHASES.TURN_END);
  assert.equal(state.pendingChoice, null);
  assert.equal(state.boardState.properties.singapore.ownerId, "b");
  assert.equal(state.players[1].money, 1110);
  assert.equal(state.lastEvents.some((event) => event.type === "AUCTION_AUTO_PURCHASED"), true);
  assert.equal(state.lastEvents.some((event) => (
    event.type === "PROPERTY_BOUGHT"
    && event.playerId === "b"
    && event.amount === 390
  )), true);
});

test("vote deadline converts no-response players to pass and resolves participants", () => {
  let state = declinePurchase(roll(start(["a", "b", "c", "d"]), "a", [1, 2]), "a", 1_000);
  state = reduce(state, ACTION_TYPES.AUCTION_JOIN, "b", {}, 2_000);

  assert.throws(
    () => reduce(state, ACTION_TYPES.AUCTION_VOTE_CLOSE, null, {}, 15_999),
    /deadline has not expired/i,
  );

  state = reduce(state, ACTION_TYPES.AUCTION_VOTE_CLOSE, null, {}, 16_000);
  assert.equal(state.phase, TURN_PHASES.TURN_END);
  assert.equal(state.boardState.properties.singapore.ownerId, "b");
  assert.equal(state.lastEvents.filter((event) => (
    event.type === "AUCTION_VOTE_AUTO_PASSED"
  )).length, 2);
});

test("all pass closes the Auction without an owner", () => {
  let state = declinePurchase(roll(start(["a", "b", "c"]), "a", [1, 2]), "a", 1_000);
  state = reduce(state, ACTION_TYPES.AUCTION_PASS, "b", {}, 2_000);
  state = reduce(state, ACTION_TYPES.AUCTION_PASS, "c", {}, 2_100);

  assert.equal(state.phase, TURN_PHASES.TURN_END);
  assert.equal(state.pendingChoice, null);
  assert.equal(state.boardState.properties.singapore.ownerId, null);
});

test("players unable to afford the opening bid are excluded and do not delay voting", () => {
  let state = roll(start(["a", "b", "c"]), "a", [1, 2]);
  state = Object.freeze({
    ...state,
    players: Object.freeze([
      state.players[0],
      state.players[1],
      Object.freeze({ ...state.players[2], money: 100 }),
    ]),
  });
  state = declinePurchase(state, "a", 1_000);

  assert.deepEqual(state.pendingChoice.eligiblePlayerIds, ["b"]);
  state = reduce(state, ACTION_TYPES.AUCTION_JOIN, "b", {}, 2_000);
  assert.equal(state.phase, TURN_PHASES.TURN_END);
  assert.equal(state.boardState.properties.singapore.ownerId, "b");
});

test("no eligible players ends the turn immediately without opening an empty vote", () => {
  let state = roll(start(["a", "b"]), "a", [1, 2]);
  state = Object.freeze({
    ...state,
    players: Object.freeze([
      state.players[0],
      Object.freeze({ ...state.players[1], money: 100 }),
    ]),
  });
  state = declinePurchase(state, "a", 1_000);

  assert.equal(state.phase, TURN_PHASES.TURN_END);
  assert.equal(state.pendingChoice, null);
  assert.equal(state.boardState.properties.singapore.ownerId, null);
});

test("declining player cannot vote in the Auction", () => {
  const state = declinePurchase(roll(start(), "a", [1, 2]), "a", 1_000);
  assert.deepEqual(state.pendingChoice.eligiblePlayerIds, ["b", "c"]);
  assert.throws(
    () => reduce(state, ACTION_TYPES.AUCTION_JOIN, "a", {}, 2_000),
    /not eligible/i,
  );
});

test("competitive bid timeout still automatically passes the current participant", () => {
  let state = declinePurchase(roll(start(["a", "b", "c"]), "a", [1, 2]), "a", 1_000);
  state = reduce(state, ACTION_TYPES.AUCTION_JOIN, "b", {}, 2_000);
  state = reduce(state, ACTION_TYPES.AUCTION_JOIN, "c", {}, 2_100);

  assert.equal(state.pendingChoice.type, "PROPERTY_AUCTION");
  assert.throws(
    () => reduce(state, ACTION_TYPES.AUCTION_BID_TIMEOUT, null, {}, 22_699),
    /deadline has not expired/i,
  );

  state = reduce(state, ACTION_TYPES.AUCTION_BID_TIMEOUT, null, {}, 22_700);
  assert.equal(state.phase, TURN_PHASES.TURN_END);
  assert.equal(state.boardState.properties.singapore.ownerId, "b");
  assert.equal(state.lastEvents.some((event) => (
    event.type === "AUCTION_AUTO_PASSED"
    && event.playerId === "c"
    && event.reason === "TIMEOUT"
  )), true);
});

test("non-auction actions keep delegating to the stable reducer", () => {
  const state = start(["a", "b"]);
  assert.equal(state.phase, TURN_PHASES.WAITING_ROLL);
  assert.equal(state.currentPlayerIndex, 0);
});
