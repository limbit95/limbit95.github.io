import test from "node:test";
import assert from "node:assert/strict";

import {
  buildMvpAwards,
  createRoundStats,
  recordRoundPlay,
} from "../js/gameStats.js";

test("records reverse, rescue, late, bold, precision, and combo metrics", () => {
  const stats = createRoundStats({ playerCount: 1 });

  const reverseOne = recordRoundPlay(stats, {
    playerIndex: 0,
    card: 70,
    pileDirection: "ascending",
    previousValue: 80,
    turnNumber: 1,
    remainingBefore: 20,
  });
  const reverseTwo = recordRoundPlay(stats, {
    playerIndex: 0,
    card: 60,
    pileDirection: "ascending",
    previousValue: 70,
    turnNumber: 1,
    remainingBefore: 19,
  });
  recordRoundPlay(stats, {
    playerIndex: 0,
    card: 90,
    pileDirection: "ascending",
    previousValue: 60,
    turnNumber: 1,
    remainingBefore: 18,
  });
  recordRoundPlay(stats, {
    playerIndex: 0,
    card: 92,
    pileDirection: "ascending",
    previousValue: 90,
    turnNumber: 2,
    remainingBefore: 17,
  });

  assert.equal(reverseOne.reverse, true);
  assert.equal(reverseOne.rescue, true);
  assert.equal(reverseTwo.reverse, true);

  const player = stats.players[0];
  assert.equal(player.cardsPlayed, 4);
  assert.equal(player.reverseJumps, 2);
  assert.equal(player.rescuePlays, 1);
  assert.equal(player.lateGameCards, 4);
  assert.equal(player.boldPlays, 1);
  assert.equal(player.precisionPlays, 1);
  assert.equal(player.maxReverseCombo, 2);
  assert.equal(player.maxTurnCards, 3);
});

test("builds every MVP category and preserves ties", () => {
  const stats = createRoundStats({
    playerCount: 3,
    nicknames: ["A", "B", "C"],
  });

  Object.assign(stats.players[0], {
    cardsPlayed: 31,
    reverseJumps: 5,
    gapSum: 140,
    gapSamples: 20,
    maxTurnCards: 5,
    lateGameCards: 7,
    rescuePlays: 3,
    boldPlays: 2,
    precisionPlays: 4,
    maxReverseCombo: 3,
  });
  Object.assign(stats.players[1], {
    cardsPlayed: 31,
    reverseJumps: 2,
    gapSum: 72,
    gapSamples: 18,
    maxTurnCards: 4,
    lateGameCards: 4,
    rescuePlays: 1,
    boldPlays: 5,
    precisionPlays: 8,
    maxReverseCombo: 2,
  });
  Object.assign(stats.players[2], {
    cardsPlayed: 20,
    reverseJumps: 1,
    gapSum: 90,
    gapSamples: 15,
    maxTurnCards: 3,
    lateGameCards: 2,
    rescuePlays: 0,
    boldPlays: 1,
    precisionPlays: 2,
    maxReverseCombo: 1,
  });

  const awards = buildMvpAwards(stats);
  assert.deepEqual(
    awards.map((award) => award.code),
    [
      "savior",
      "card-machine",
      "steady-hand",
      "clutch-finisher",
      "chain-player",
      "crisis-manager",
      "bold-player",
      "precision-player",
      "reverse-combo",
    ],
  );

  assert.deepEqual(
    awards.find((award) => award.code === "card-machine").winners.map((winner) => winner.nickname),
    ["A", "B"],
  );
  assert.equal(
    awards.find((award) => award.code === "steady-hand").winners[0].nickname,
    "B",
  );
});
