import test from "node:test";
import assert from "node:assert/strict";

import { BELL_TARGET } from "../js/constants.js";
import { FruitBellGame, findBellFruit, getVisibleFruitTotals } from "../js/gameEngine.js";

const zeroRng = () => 0;

function makePlayers() {
  return [
    { id: "p1", name: "나" },
    { id: "p2", name: "봇 1" },
  ];
}

test("게임 시작 시 모든 카드를 플레이어에게 나눠 준다", () => {
  const game = new FruitBellGame({ players: makePlayers(), rng: zeroRng });
  const state = game.start();
  const total = state.players.reduce((sum, player) => sum + player.drawCount, 0);
  assert.equal(total, 48);
  assert.equal(state.players[0].drawCount, 24);
  assert.equal(state.players[1].drawCount, 24);
});

test("현재 차례의 플레이어만 카드를 뒤집을 수 있다", () => {
  const game = new FruitBellGame({ players: makePlayers(), rng: zeroRng });
  game.start();
  assert.throws(() => game.flipCard("p2"), /현재 차례/);
  const result = game.flipCard("p1");
  assert.ok(result.card);
  assert.equal(result.state.activePlayerId, "p2");
});

test("보이는 카드 중 동일 과일 합계가 정확히 5면 종 조건이 성립한다", () => {
  const players = [
    { faceUpPile: [{ fruit: "banana", count: 2 }] },
    { faceUpPile: [{ fruit: "banana", count: 3 }] },
    { faceUpPile: [{ fruit: "lime", count: 4 }] },
  ];
  assert.equal(getVisibleFruitTotals(players).banana, BELL_TARGET);
  assert.equal(findBellFruit(players), "banana");
});

test("정답 종을 치면 공개된 카드 더미를 획득한다", () => {
  const game = new FruitBellGame({ players: makePlayers(), rng: zeroRng });
  game.started = true;
  game.players[0].drawPile = [{ id: "a", fruit: "lime", count: 1 }];
  game.players[1].drawPile = [{ id: "b", fruit: "plum", count: 1 }];
  game.players[0].faceUpPile = [{ id: "c", fruit: "banana", count: 2 }];
  game.players[1].faceUpPile = [{ id: "d", fruit: "banana", count: 3 }];

  const result = game.ringBell("p1");
  assert.equal(result.correct, true);
  assert.equal(result.collectedCount, 2);
  assert.equal(game.players[0].faceUpPile.length, 0);
  assert.equal(game.players[1].faceUpPile.length, 0);
  assert.equal(game.players[0].drawPile.length, 3);
});

test("오답 종은 다른 플레이어에게 카드를 한 장씩 지불한다", () => {
  const game = new FruitBellGame({ players: makePlayers(), rng: zeroRng });
  game.started = true;
  game.players[0].drawPile = [
    { id: "a", fruit: "lime", count: 1 },
    { id: "b", fruit: "lime", count: 2 },
  ];
  game.players[1].drawPile = [{ id: "c", fruit: "plum", count: 1 }];
  game.players[0].faceUpPile = [{ id: "d", fruit: "banana", count: 2 }];
  game.players[1].faceUpPile = [{ id: "e", fruit: "banana", count: 2 }];

  const result = game.ringBell("p1");
  assert.equal(result.correct, false);
  assert.equal(result.penaltyCount, 1);
  assert.equal(game.players[0].drawPile.length, 1);
  assert.equal(game.players[1].drawPile.length, 2);
});
