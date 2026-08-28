import test from "node:test";
import assert from "node:assert/strict";
import { BELL_TARGET, FruitBellGame, createDeck, visibleTotals } from "../js/gameEngine.js";

const players = [
  { id: "p1", name: "A", animalId: "fox" },
  { id: "p2", name: "B", animalId: "rabbit" },
  { id: "p3", name: "C", animalId: "bear" },
  { id: "p4", name: "D", animalId: "cat" },
];

function zeroRng() { return 0; }

test("deck contains 36 cards and supported counts", () => {
  const deck = createDeck(zeroRng);
  assert.equal(deck.length, 36);
  assert.ok(deck.every((card) => card.count >= 1 && card.count <= BELL_TARGET));
});

test("only the active player can flip", () => {
  const game = new FruitBellGame({ players, rng: zeroRng });
  game.start();
  assert.throws(() => game.flipCard("p2"), /내 차례/);
  const result = game.flipCard("p1");
  assert.ok(result.card);
  assert.equal(result.state.activePlayerId, "p2");
});

test("visible totals only count the top face-up card", () => {
  const totals = visibleTotals([
    { faceUpPile: [{ fruit: "lime", count: 4 }, { fruit: "lime", count: 2 }] },
    { faceUpPile: [{ fruit: "lime", count: 3 }] },
    { faceUpPile: [{ fruit: "banana", count: 1 }] },
  ]);
  assert.deepEqual(totals, { lime: 5, banana: 1 });
});

test("correct bell collects every face-up pile", () => {
  const game = new FruitBellGame({ players, rng: zeroRng });
  game.start();
  game.players[0].faceUpPile = [{ id: "a", fruit: "lime", count: 2 }];
  game.players[1].faceUpPile = [{ id: "b", fruit: "lime", count: 3 }];
  game.players[2].faceUpPile = [{ id: "c", fruit: "banana", count: 1 }];
  const before = game.players[0].drawPile.length;
  const result = game.ringBell("p1");
  assert.equal(result.correct, true);
  assert.equal(result.fruit, "lime");
  assert.equal(result.collectedCount, 3);
  assert.equal(game.players[0].drawPile.length, before + 3);
  assert.ok(game.players.every((player) => player.faceUpPile.length === 0));
});

test("wrong bell gives penalty cards to opponents", () => {
  const game = new FruitBellGame({ players, rng: zeroRng });
  game.start();
  const before = game.players[0].drawPile.length;
  const result = game.ringBell("p1");
  assert.equal(result.correct, false);
  assert.equal(result.penaltyCount, 3);
  assert.equal(game.players[0].drawPile.length, before - 3);
});
