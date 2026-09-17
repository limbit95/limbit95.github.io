import test from "node:test";
import assert from "node:assert/strict";

import { ACTION_TYPES, createAction } from "../js/core/actions.js";
import { createInitialGameState } from "../js/core/gameEngine.js";
import { reducePhase7GameAction } from "../js/core/auctionGameEngine.js";
import { TURN_PHASES } from "../js/core/turnMachine.js";

function start(players = ["a", "b", "c"]) {
  return reducePhase7GameAction(
    createInitialGameState({ players }),
    createAction({ type: ACTION_TYPES.START_GAME }),
  );
}

function roll(state, playerId, dice) {
  return reducePhase7GameAction(
    state,
    createAction({ type: ACTION_TYPES.ROLL_DICE, playerId, payload: { dice } }),
  );
}

function declinePurchase(state, playerId) {
  return reducePhase7GameAction(
    state,
    createAction({ type: ACTION_TYPES.END_TURN, playerId }),
  );
}

function requestAuction(state, playerId) {
  return reducePhase7GameAction(
    state,
    createAction({ type: ACTION_TYPES.AUCTION_REQUEST, playerId }),
  );
}

function closeAuctionRequest(state) {
  return reducePhase7GameAction(
    state,
    createAction({ type: ACTION_TYPES.AUCTION_REQUEST_CLOSE }),
  );
}

function openAuction(state, requesterId = "b") {
  return closeAuctionRequest(requestAuction(state, requesterId));
}

function auction(state, playerId, payload) {
  return reducePhase7GameAction(
    state,
    createAction({ type: ACTION_TYPES.AUCTION_BID, playerId, payload }),
  );
}

test("declining an unowned property opens an auction request window without starting the auction", () => {
  let state = roll(start(), "a", [1, 2]);
  assert.equal(state.pendingChoice.type, "BUY_PROPERTY");

  state = declinePurchase(state, "a");

  assert.equal(state.phase, TURN_PHASES.WAITING_CHOICE);
  assert.equal(state.currentPlayerIndex, 0);
  assert.equal(state.pendingChoice.type, "AUCTION_REQUEST");
  assert.equal(state.pendingChoice.nodeId, "singapore");
  assert.equal(state.pendingChoice.openingBid, 260);
  assert.deepEqual(state.pendingChoice.eligiblePlayerIds, ["b", "c"]);
  assert.deepEqual(state.pendingChoice.requestedByPlayerIds, []);
  assert.equal(state.lastEvents.some((event) => event.type === "CHOICE_DECLINED"), true);
  assert.equal(state.lastEvents.some((event) => event.type === "AUCTION_REQUEST_OPENED"), true);
  assert.equal(state.lastEvents.some((event) => event.type === "AUCTION_STARTED"), false);
});

test("closing an auction request window without requests ends the turn without opening an auction", () => {
  let state = declinePurchase(roll(start(), "a", [1, 2]), "a");
  state = closeAuctionRequest(state);

  assert.equal(state.phase, TURN_PHASES.TURN_END);
  assert.equal(state.currentPlayerIndex, 0);
  assert.equal(state.pendingChoice, null);
  assert.equal(state.boardState.properties.singapore.ownerId, null);
  assert.equal(state.lastEvents.some((event) => (
    event.type === "AUCTION_REQUEST_CLOSED"
    && event.reason === "NO_REQUESTS"
  )), true);
  assert.equal(state.lastEvents.some((event) => event.type === "AUCTION_STARTED"), false);

  state = reducePhase7GameAction(
    state,
    createAction({ type: ACTION_TYPES.END_TURN, playerId: "a" }),
  );
  assert.equal(state.phase, TURN_PHASES.WAITING_ROLL);
  assert.equal(state.currentPlayerIndex, 1);
});

test("an explicit request is recorded and the auction starts only when the request window closes", () => {
  let state = declinePurchase(roll(start(), "a", [1, 2]), "a");
  state = requestAuction(state, "b");

  assert.equal(state.pendingChoice.type, "AUCTION_REQUEST");
  assert.deepEqual(state.pendingChoice.requestedByPlayerIds, ["b"]);
  assert.equal(state.lastEvents.some((event) => event.type === "AUCTION_REQUESTED"), true);
  assert.equal(state.lastEvents.some((event) => event.type === "AUCTION_STARTED"), false);

  state = closeAuctionRequest(state);

  assert.equal(state.phase, TURN_PHASES.WAITING_CHOICE);
  assert.equal(state.pendingChoice.type, "PROPERTY_AUCTION");
  assert.deepEqual(state.pendingChoice.requestedByPlayerIds, ["b"]);
  assert.deepEqual(state.pendingChoice.auction.requestedByPlayerIds, ["b"]);
  assert.deepEqual(state.pendingChoice.auction.eligiblePlayerIds, ["b", "c"]);
  assert.equal(state.lastEvents.some((event) => event.type === "AUCTION_REQUEST_CLOSED"), true);
  assert.equal(state.lastEvents.some((event) => event.type === "AUCTION_STARTED"), true);
});

test("the declining player cannot request the auction and duplicate requests are rejected", () => {
  let state = declinePurchase(roll(start(), "a", [1, 2]), "a");

  assert.throws(
    () => requestAuction(state, "a"),
    /not eligible to request this auction/,
  );

  state = requestAuction(state, "b");
  assert.throws(
    () => requestAuction(state, "b"),
    /already requested this auction/,
  );
});

test("an auction requester cannot pass before placing a bid", () => {
  let state = declinePurchase(roll(start(), "a", [1, 2]), "a");
  state = openAuction(state, "b");

  assert.throws(
    () => auction(state, "b", { pass: true }),
    /must place a bid before passing/,
  );

  state = auction(state, "c", { pass: true });
  assert.deepEqual(state.pendingChoice.auction.passedPlayerIds, ["c"]);
});

test("auction bid and final pass settle ownership and winner gold after a request", () => {
  let state = declinePurchase(roll(start(), "a", [1, 2]), "a");
  state = openAuction(state, "b");
  state = auction(state, "b", { amount: 260 });

  assert.equal(state.phase, TURN_PHASES.WAITING_CHOICE);
  assert.equal(state.pendingChoice.auction.highestBidderId, "b");
  assert.equal(state.pendingChoice.auction.highestBid, 260);
  assert.deepEqual(state.pendingChoice.auction.bidPlayerIds, ["b"]);

  state = auction(state, "c", { pass: true });

  assert.equal(state.phase, TURN_PHASES.TURN_END);
  assert.equal(state.pendingChoice, null);
  assert.equal(state.boardState.properties.singapore.ownerId, "b");
  assert.equal(state.players.find((player) => player.id === "b").money, 1240);
  assert.equal(state.lastEvents.some((event) => event.type === "AUCTION_WON"), true);
  assert.equal(state.lastEvents.some((event) => (
    event.type === "PROPERTY_BOUGHT"
    && event.playerId === "b"
    && event.reason === "AUCTION"
  )), true);
});

test("non-requesters may pass after a requested auction opens", () => {
  let state = declinePurchase(roll(start(), "a", [1, 2]), "a");
  state = openAuction(state, "b");
  state = auction(state, "c", { pass: true });

  assert.equal(state.phase, TURN_PHASES.WAITING_CHOICE);
  assert.deepEqual(state.pendingChoice.auction.passedPlayerIds, ["c"]);
  assert.equal(state.boardState.properties.singapore.ownerId, null);
});

test("multiple requesters each carry the bid commitment into the auction", () => {
  let state = declinePurchase(roll(start(["a", "b", "c", "d"]), "a", [1, 2]), "a");
  state = requestAuction(state, "b");
  state = requestAuction(state, "c");
  state = closeAuctionRequest(state);

  assert.deepEqual(state.pendingChoice.auction.requestedByPlayerIds, ["b", "c"]);
  assert.throws(
    () => auction(state, "c", { pass: true }),
    /must place a bid before passing/,
  );

  state = auction(state, "b", { amount: 260 });
  state = auction(state, "c", { amount: 261 });
  state = auction(state, "b", { pass: true });
  assert.deepEqual(state.pendingChoice.auction.bidPlayerIds, ["b", "c"]);
  assert.deepEqual(state.pendingChoice.auction.passedPlayerIds, ["b"]);
});

test("a sole eligible bidder wins after requesting and placing the opening bid", () => {
  let state = roll(start(["a", "b"]), "a", [1, 2]);
  state = declinePurchase(state, "a");

  assert.deepEqual(state.pendingChoice.eligiblePlayerIds, ["b"]);

  state = requestAuction(state, "b");
  state = closeAuctionRequest(state);
  state = auction(state, "b", { amount: 260 });

  assert.equal(state.phase, TURN_PHASES.TURN_END);
  assert.equal(state.boardState.properties.singapore.ownerId, "b");
  assert.equal(state.players[1].money, 1240);
});

test("non-auction actions keep delegating to the stable Phase 6 reducer", () => {
  const state = start(["a", "b"]);
  assert.equal(state.phase, TURN_PHASES.WAITING_ROLL);
  assert.equal(state.currentPlayerIndex, 0);
});
