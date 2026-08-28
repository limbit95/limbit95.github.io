import test from "node:test";
import assert from "node:assert/strict";

import {
  canEndTurn,
  canPlayCard,
  createDeck,
  createInitialState,
  endTurn,
  evaluateGameState,
  getHandSize,
  getRemainingCardCount,
  getRequiredCardsThisTurn,
  playCard,
} from "../js/gameEngine.js";
import { GAME_STATUS, PILE_DIRECTION } from "../js/constants.js";

const zeroRng = () => 0;

function createState(overrides = {}) {
  return {
    status: GAME_STATUS.PLAYING,
    playerCount: 1,
    handSize: 8,
    players: [{ id: "player-1", hand: [20, 30] }],
    drawPile: [],
    piles: [
      { id: "ascending-1", direction: PILE_DIRECTION.ASCENDING, value: 1, history: [1] },
      { id: "ascending-2", direction: PILE_DIRECTION.ASCENDING, value: 1, history: [1] },
      { id: "descending-1", direction: PILE_DIRECTION.DESCENDING, value: 100, history: [100] },
      { id: "descending-2", direction: PILE_DIRECTION.DESCENDING, value: 100, history: [100] },
    ],
    currentPlayerIndex: 0,
    cardsPlayedThisTurn: 0,
    turnNumber: 1,
    lastMove: null,
    result: null,
    ...overrides,
  };
}

test("createDeck creates every number card from 2 through 99 exactly once", () => {
  const deck = createDeck();

  assert.equal(deck.length, 98);
  assert.equal(deck[0], 2);
  assert.equal(deck.at(-1), 99);
  assert.equal(new Set(deck).size, 98);
});

test("hand size follows the original 1-5 player rules", () => {
  assert.equal(getHandSize(1), 8);
  assert.equal(getHandSize(2), 7);
  assert.equal(getHandSize(3), 6);
  assert.equal(getHandSize(4), 6);
  assert.equal(getHandSize(5), 6);
});

test("initial state deals the correct hand size without duplicate or missing cards", () => {
  for (let playerCount = 1; playerCount <= 5; playerCount += 1) {
    const state = createInitialState({ playerCount, rng: zeroRng });
    const allNumberCards = [...state.drawPile, ...state.players.flatMap((player) => player.hand)];

    assert.equal(state.players.length, playerCount);
    assert.ok(state.players.every((player) => player.hand.length === getHandSize(playerCount)));
    assert.equal(allNumberCards.length, 98);
    assert.equal(new Set(allNumberCards).size, 98);
    assert.equal(Math.min(...allNumberCards), 2);
    assert.equal(Math.max(...allNumberCards), 99);
  }
});

test("ascending piles allow larger cards and the exact -10 reverse jump", () => {
  const pile = { direction: PILE_DIRECTION.ASCENDING, value: 37 };

  assert.equal(canPlayCard(38, pile), true);
  assert.equal(canPlayCard(80, pile), true);
  assert.equal(canPlayCard(27, pile), true);
  assert.equal(canPlayCard(36, pile), false);
  assert.equal(canPlayCard(26, pile), false);
  assert.equal(canPlayCard(37, pile), false);
});

test("descending piles allow smaller cards and the exact +10 reverse jump", () => {
  const pile = { direction: PILE_DIRECTION.DESCENDING, value: 63 };

  assert.equal(canPlayCard(62, pile), true);
  assert.equal(canPlayCard(20, pile), true);
  assert.equal(canPlayCard(73, pile), true);
  assert.equal(canPlayCard(64, pile), false);
  assert.equal(canPlayCard(74, pile), false);
  assert.equal(canPlayCard(63, pile), false);
});

test("playing a card updates only the returned state and preserves the source state", () => {
  const state = createState();
  const next = playCard(state, { card: 20, pileId: "ascending-1" });

  assert.deepEqual(state.players[0].hand, [20, 30]);
  assert.equal(state.piles[0].value, 1);
  assert.deepEqual(next.players[0].hand, [30]);
  assert.equal(next.piles[0].value, 20);
  assert.deepEqual(next.piles[0].history, [1, 20]);
  assert.equal(next.cardsPlayedThisTurn, 1);
  assert.equal(next.lastMove.card, 20);
});

test("a turn requires two cards while the draw pile still contains cards", () => {
  const state = createState({
    handSize: 3,
    players: [{ id: "player-1", hand: [20, 30, 40] }],
    drawPile: [50, 60, 70],
  });

  const afterOne = playCard(state, { card: 20, pileId: "ascending-1" });
  assert.equal(getRequiredCardsThisTurn(afterOne), 2);
  assert.equal(canEndTurn(afterOne), false);
  assert.throws(() => endTurn(afterOne), /At least 2 card/);

  const afterTwo = playCard(afterOne, { card: 30, pileId: "ascending-1" });
  assert.equal(canEndTurn(afterTwo), true);

  const nextTurn = endTurn(afterTwo);
  assert.equal(nextTurn.players[0].hand.length, 3);
  assert.equal(nextTurn.drawPile.length, 1);
  assert.equal(nextTurn.cardsPlayedThisTurn, 0);
  assert.equal(nextTurn.turnNumber, 2);
});

test("after the draw pile is empty only one card is required per turn", () => {
  const state = createState({
    players: [{ id: "player-1", hand: [20, 30] }],
    drawPile: [],
  });

  assert.equal(getRequiredCardsThisTurn(state), 1);
  const afterOne = playCard(state, { card: 20, pileId: "ascending-1" });
  assert.equal(canEndTurn(afterOne), true);
});

test("the game is lost when the current player cannot reach the minimum play requirement", () => {
  const blocked = createState({
    handSize: 1,
    players: [{ id: "player-1", hand: [50] }],
    drawPile: [70],
    piles: [
      { id: "ascending-1", direction: PILE_DIRECTION.ASCENDING, value: 90, history: [1, 90] },
      { id: "ascending-2", direction: PILE_DIRECTION.ASCENDING, value: 91, history: [1, 91] },
      { id: "descending-1", direction: PILE_DIRECTION.DESCENDING, value: 10, history: [100, 10] },
      { id: "descending-2", direction: PILE_DIRECTION.DESCENDING, value: 11, history: [100, 11] },
    ],
  });

  const evaluated = evaluateGameState(blocked);
  assert.equal(evaluated.status, GAME_STATUS.LOST);
  assert.equal(evaluated.result.reason, "minimum_cards_unplayable");
  assert.equal(evaluated.result.remainingCards, 2);
});

test("the game is lost immediately when one legal card exists but no legal two-card sequence exists", () => {
  const blocked = createState({
    handSize: 2,
    players: [{ id: "player-1", hand: [80, 50] }],
    drawPile: [70],
    piles: [
      { id: "ascending-1", direction: PILE_DIRECTION.ASCENDING, value: 90, history: [1, 90] },
      { id: "ascending-2", direction: PILE_DIRECTION.ASCENDING, value: 91, history: [1, 91] },
      { id: "descending-1", direction: PILE_DIRECTION.DESCENDING, value: 10, history: [100, 10] },
      { id: "descending-2", direction: PILE_DIRECTION.DESCENDING, value: 11, history: [100, 11] },
    ],
  });

  const evaluated = evaluateGameState(blocked);
  assert.equal(evaluated.status, GAME_STATUS.LOST);
  assert.equal(evaluated.result.reason, "minimum_cards_unplayable");
  assert.equal(evaluated.result.remainingCards, 3);
});

test("a valid two-card sequence prevents an early loss", () => {
  const playable = createState({
    handSize: 2,
    players: [{ id: "player-1", hand: [80, 85] }],
    drawPile: [70],
    piles: [
      { id: "ascending-1", direction: PILE_DIRECTION.ASCENDING, value: 90, history: [1, 90] },
      { id: "ascending-2", direction: PILE_DIRECTION.ASCENDING, value: 91, history: [1, 91] },
      { id: "descending-1", direction: PILE_DIRECTION.DESCENDING, value: 10, history: [100, 10] },
      { id: "descending-2", direction: PILE_DIRECTION.DESCENDING, value: 11, history: [100, 11] },
    ],
  });

  const evaluated = evaluateGameState(playable);
  assert.equal(evaluated.status, GAME_STATUS.PLAYING);
});

test("players with no cards are skipped once the draw pile is empty", () => {
  const state = createState({
    playerCount: 3,
    handSize: 6,
    players: [
      { id: "player-1", hand: [20] },
      { id: "player-2", hand: [] },
      { id: "player-3", hand: [30] },
    ],
    drawPile: [],
  });

  const afterPlay = playCard(state, { card: 20, pileId: "ascending-1" });
  const nextTurn = endTurn(afterPlay);

  assert.equal(nextTurn.status, GAME_STATUS.PLAYING);
  assert.equal(nextTurn.currentPlayerIndex, 2);
  assert.equal(nextTurn.players[1].hand.length, 0);
});

test("the last active player keeps taking turns after the others finish", () => {
  const state = createState({
    playerCount: 3,
    handSize: 6,
    players: [
      { id: "player-1", hand: [20, 30] },
      { id: "player-2", hand: [] },
      { id: "player-3", hand: [] },
    ],
    drawPile: [],
  });

  const afterPlay = playCard(state, { card: 20, pileId: "ascending-1" });
  const nextTurn = endTurn(afterPlay);

  assert.equal(nextTurn.status, GAME_STATUS.PLAYING);
  assert.equal(nextTurn.currentPlayerIndex, 0);
  assert.deepEqual(nextTurn.players[0].hand, [30]);
});

test("playing the final remaining card wins immediately", () => {
  const state = createState({
    players: [{ id: "player-1", hand: [20] }],
    drawPile: [],
  });

  const won = playCard(state, { card: 20, pileId: "ascending-1" });

  assert.equal(won.status, GAME_STATUS.WON);
  assert.equal(won.result.remainingCards, 0);
  assert.equal(won.result.cardsPlayed, 98);
  assert.equal(getRemainingCardCount(won), 0);
});

test("a player cannot play a card owned by another turn", () => {
  const state = createState({
    playerCount: 2,
    handSize: 7,
    players: [
      { id: "player-1", hand: [20] },
      { id: "player-2", hand: [30] },
    ],
  });

  assert.throws(
    () => playCard(state, { playerIndex: 1, card: 30, pileId: "ascending-1" }),
    /Only the current player/,
  );
});
