import assert from "node:assert/strict";
import { test } from "node:test";

import {
  NO_THANKS_ACTION,
  NO_THANKS_PHASE,
  calculateCardScore,
  calculateFinalScore,
  calculateInitialCounters,
  createInitialGameState,
  getLegalActions,
  refuseCard,
  takeCard,
} from "../games/no-thanks/rules.js";

const PREPARED_DECK = Object.freeze(
  Array.from({ length: 24 }, (_, index) => index + 3),
);

function gameState() {
  return createInitialGameState({
    playerIds: ["alice", "bob", "cara"],
    turnOrder: ["bob", "cara", "alice"],
    drawDeck: PREPARED_DECK,
  });
}

test("No Thanks! starts with the official counter count for each player count", () => {
  assert.equal(calculateInitialCounters(3), 11);
  assert.equal(calculateInitialCounters(4), 11);
  assert.equal(calculateInitialCounters(5), 11);
  assert.equal(calculateInitialCounters(6), 9);
  assert.equal(calculateInitialCounters(7), 7);
  assert.throws(() => calculateInitialCounters(2), /3 through 7 players/u);
  assert.throws(() => calculateInitialCounters(8), /3 through 7 players/u);
});

test("No Thanks! initial state uses only the server-selected turn order and prepared deck", () => {
  const state = gameState();

  assert.equal(state.phase, NO_THANKS_PHASE.PLAYING);
  assert.deepEqual(state.turnOrder, ["bob", "cara", "alice"]);
  assert.equal(state.activePlayerId, "bob");
  assert.equal(state.currentCard, 3);
  assert.deepEqual(state.drawDeck, PREPARED_DECK.slice(1));
  assert.equal(state.deckRemaining, 23);
  assert.equal(state.excludedCount, 9);
  assert.deepEqual(state.playerCounters, {
    alice: 11,
    bob: 11,
    cara: 11,
  });
});

test("No Thanks! initial state rejects an incomplete or duplicate prepared deck", () => {
  assert.throws(() => createInitialGameState({
    playerIds: ["alice", "bob", "cara"],
    turnOrder: ["alice", "bob", "cara"],
    drawDeck: PREPARED_DECK.slice(0, 23),
  }), /exactly 24 prepared cards/u);

  const duplicateDeck = [...PREPARED_DECK];
  duplicateDeck[23] = duplicateDeck[22];
  assert.throws(() => createInitialGameState({
    playerIds: ["alice", "bob", "cara"],
    turnOrder: ["alice", "bob", "cara"],
    drawDeck: duplicateDeck,
  }), /must not contain duplicates/u);
});

test("No Thanks! refusing spends one counter, grows the center pile, and advances the turn", () => {
  const state = gameState();
  const before = structuredClone(state);

  const refused = refuseCard(state);

  assert.deepEqual(state, before);
  assert.equal(refused.playerCounters.bob, 10);
  assert.equal(refused.centerCounters, 1);
  assert.equal(refused.activePlayerId, "cara");
  assert.equal(refused.turnIndex, 1);
  assert.equal(refused.currentCard, 3);
  assert.equal(refused.deckRemaining, 23);
});

test("No Thanks! wraps the turn order after the last player refuses", () => {
  let state = gameState();
  state = refuseCard(state);
  state = refuseCard(state);
  state = refuseCard(state);

  assert.equal(state.activePlayerId, "bob");
  assert.equal(state.turnIndex, 0);
  assert.equal(state.centerCounters, 3);
});

test("No Thanks! forces a take when the active player has no counters", () => {
  const state = gameState();
  state.playerCounters.bob = 0;

  assert.deepEqual(getLegalActions(state), [NO_THANKS_ACTION.TAKE_CARD]);
  assert.throws(() => refuseCard(state), /cannot refuse a card without a counter/u);
});

test("No Thanks! exposes both actions while the active player still has counters", () => {
  assert.deepEqual(getLegalActions(gameState()), [
    NO_THANKS_ACTION.REFUSE_CARD,
    NO_THANKS_ACTION.TAKE_CARD,
  ]);
});

test("No Thanks! taking a card collects the center pile and keeps the active player", () => {
  const state = gameState();
  state.centerCounters = 4;
  const before = structuredClone(state);

  const taken = takeCard(state);

  assert.deepEqual(state, before);
  assert.deepEqual(taken.players.find((player) => player.id === "bob").cards, [3]);
  assert.equal(taken.playerCounters.bob, 15);
  assert.equal(taken.centerCounters, 0);
  assert.equal(taken.activePlayerId, "bob");
  assert.equal(taken.turnIndex, 0);
  assert.equal(taken.currentCard, 4);
  assert.equal(taken.deckRemaining, 22);
});

test("No Thanks! card score counts only the lowest card of each consecutive chain", () => {
  assert.equal(calculateCardScore([3, 10, 11, 12, 20]), 33);
  assert.equal(calculateCardScore([20, 12, 10, 3, 11]), 33);
  assert.equal(calculateCardScore([5, 6, 9, 10, 11, 30]), 44);
});

test("No Thanks! final score subtracts remaining counters and may be negative", () => {
  assert.equal(calculateFinalScore([3, 10, 11, 12, 20], 5), 28);
  assert.equal(calculateFinalScore([3, 4], 5), -2);
});

test("No Thanks! taking the final card ends the game and supports tied winners", () => {
  const state = gameState();
  state.players.find((player) => player.id === "alice").cards = [10];
  state.players.find((player) => player.id === "bob").cards = [6];
  state.players.find((player) => player.id === "cara").cards = [12];
  state.playerCounters = { alice: 0, bob: 0, cara: 0 };
  state.currentCard = 4;
  state.drawDeck = [];
  state.deckRemaining = 0;

  const finished = takeCard(state);

  assert.equal(finished.phase, NO_THANKS_PHASE.GAME_OVER);
  assert.equal(finished.currentCard, null);
  assert.equal(finished.deckRemaining, 0);
  assert.equal(finished.endReason, "LAST_CARD_TAKEN");
  assert.deepEqual(finished.players.find((player) => player.id === "bob").cards, [4, 6]);
  assert.deepEqual(finished.finalScores, {
    alice: 10,
    bob: 10,
    cara: 12,
  });
  assert.deepEqual(finished.winners, ["bob", "alice"]);
  assert.deepEqual(getLegalActions(finished), []);
});

test("No Thanks! cannot accept gameplay actions after game over", () => {
  const state = gameState();
  state.phase = NO_THANKS_PHASE.GAME_OVER;

  assert.throws(() => refuseCard(state), /only available while the game is playing/u);
  assert.throws(() => takeCard(state), /only available while the game is playing/u);
});
