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

function auction(state, playerId, payload) {
  return reducePhase7GameAction(
    state,
    createAction({ type: ACTION_TYPES.AUCTION_BID, playerId, payload }),
  );
}

test("declining an unowned property starts an auction without advancing the turn", () => {
  let state = roll(start(), "a", [1, 2]);
  assert.equal(state.pendingChoice.type, "BUY_PROPERTY");

  state = declinePurchase(state, "a");

  assert.equal(state.phase, TURN_PHASES.WAITING_CHOICE);
  assert.equal(state.currentPlayerIndex, 0);
  assert.equal(state.pendingChoice.type, "PROPERTY_AUCTION");
  assert.equal(state.pendingChoice.nodeId, "singapore");
  assert.equal(state.pendingChoice.openingBid, 260);
  assert.deepEqual(state.pendingChoice.auction.eligiblePlayerIds, ["b", "c"]);
  assert.equal(state.lastEvents.some((event) => event.type === "CHOICE_DECLINED"), true);
  assert.equal(state.lastEvents.some((event) => event.type === "AUCTION_STARTED"), true);
});

test("auction bid and final pass settle ownership and winner gold", () => {
  let state = declinePurchase(roll(start(), "a", [1, 2]), "a");
  state = auction(state, "b", { amount: 260 });

  assert.equal(state.phase, TURN_PHASES.WAITING_CHOICE);
  assert.equal(state.pendingChoice.auction.highestBidderId, "b");
  assert.equal(state.pendingChoice.auction.highestBid, 260);

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

test("all eligible players can pass to leave the property unsold", () => {
  let state = declinePurchase(roll(start(), "a", [1, 2]), "a");
  state = auction(state, "b", { pass: true });
  state = auction(state, "c", { pass: true });

  assert.equal(state.phase, TURN_PHASES.TURN_END);
  assert.equal(state.pendingChoice, null);
  assert.equal(state.boardState.properties.singapore.ownerId, null);
  assert.equal(state.lastEvents.some((event) => (
    event.type === "AUCTION_ENDED"
    && event.winnerPlayerId === null
  )), true);
});

test("a sole eligible bidder wins as soon as the opening bid is placed", () => {
  let state = roll(start(["a", "b"]), "a", [1, 2]);
  state = declinePurchase(state, "a");

  assert.deepEqual(state.pendingChoice.auction.eligiblePlayerIds, ["b"]);

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
