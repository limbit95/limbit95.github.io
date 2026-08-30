import test from "node:test";
import assert from "node:assert/strict";

import {
  MVP_CATALOG,
  buildMvpAwards,
  createRoundStats,
  recordRoundPlay,
} from "../js/gameStats.js";

test("uses descriptive icons for every MVP category", () => {
  assert.equal(MVP_CATALOG.length, 19);
  assert.ok(MVP_CATALOG.every((item) => item.icon && !["◆", "◎", "◇", "▲", "·", "≋"].includes(item.icon)));
});

test("records reverse, rescue, late, bold, precision, combo, and mischievous metrics", () => {
  const stats = createRoundStats({ playerCount: 1 });

  const reverseOne = recordRoundPlay(stats, {
    playerIndex: 0,
    card: 70,
    pileDirection: "ascending",
    previousValue: 80,
    turnNumber: 1,
    remainingBefore: 20,
    handCards: [70, 90],
  });
  const reverseTwo = recordRoundPlay(stats, {
    playerIndex: 0,
    card: 60,
    pileDirection: "ascending",
    previousValue: 70,
    turnNumber: 1,
    remainingBefore: 19,
    handCards: [60, 90],
  });
  const risky = recordRoundPlay(stats, {
    playerIndex: 0,
    card: 90,
    pileDirection: "ascending",
    previousValue: 60,
    turnNumber: 1,
    remainingBefore: 18,
    handCards: [50, 90],
  });
  recordRoundPlay(stats, {
    playerIndex: 0,
    card: 92,
    pileDirection: "ascending",
    previousValue: 90,
    turnNumber: 2,
    remainingBefore: 17,
    handCards: [92],
  });

  assert.equal(reverseOne.reverse, true);
  assert.equal(reverseOne.rescue, true);
  assert.equal(reverseTwo.reverse, true);
  assert.equal(risky.wastedReverse, true);
  assert.equal(risky.dangerEntry, true);
  assert.equal(risky.extremeBlock, true);
  assert.equal(risky.dangerOvershoot, 15);

  const player = stats.players[0];
  assert.equal(player.cardsPlayed, 4);
  assert.equal(player.reverseJumps, 2);
  assert.equal(player.rescuePlays, 1);
  assert.equal(player.lateGameCards, 4);
  assert.equal(player.boldPlays, 1);
  assert.equal(player.precisionPlays, 1);
  assert.equal(player.maxReverseCombo, 2);
  assert.equal(player.maxTurnCards, 3);
  assert.equal(player.maxGap, 30);
  assert.equal(player.dangerEntries, 1);
  assert.equal(player.extremeBlocks, 2);
  assert.equal(player.reverseOpportunitiesWasted, 1);
  assert.equal(player.maxDangerOvershoot, 15);
});

test("separates mischievous metrics by distinct play patterns", () => {
  const stats = createRoundStats({ playerCount: 1 });

  recordRoundPlay(stats, {
    playerIndex: 0,
    card: 30,
    pileDirection: "ascending",
    previousValue: 1,
    turnNumber: 1,
    remainingBefore: 60,
    handCards: [30],
  });
  recordRoundPlay(stats, {
    playerIndex: 0,
    card: 60,
    pileDirection: "ascending",
    previousValue: 30,
    turnNumber: 1,
    remainingBefore: 59,
    handCards: [20, 60],
  });
  recordRoundPlay(stats, {
    playerIndex: 0,
    card: 78,
    pileDirection: "ascending",
    previousValue: 60,
    turnNumber: 1,
    remainingBefore: 58,
    handCards: [50, 78],
  });
  recordRoundPlay(stats, {
    playerIndex: 0,
    card: 90,
    pileDirection: "ascending",
    previousValue: 78,
    turnNumber: 2,
    remainingBefore: 57,
    handCards: [90],
  });

  const player = stats.players[0];
  assert.equal(player.maxBoldStreak, 2);
  assert.equal(player.recklessOpenings, 1);
  assert.equal(player.dangerEntries, 1);
  assert.equal(player.dangerousBigJumps, 1);
  assert.equal(player.midRiskPlays, 2);
  assert.equal(player.extremeBlocks, 1);
  assert.equal(player.maxDangerOvershoot, 3);
});

test("builds all nineteen MVP categories and preserves ties", () => {
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
    nonReverseGapSum: 120,
    nonReverseGapSamples: 10,
    maxGap: 35,
    dangerEntries: 2,
    extremeBlocks: 1,
    reverseOpportunitiesWasted: 1,
    dangerousBigJumps: 1,
    recklessOpenings: 1,
    maxDangerOvershoot: 5,
    midRiskPlays: 3,
    maxBoldStreak: 2,
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
    nonReverseGapSum: 220,
    nonReverseGapSamples: 10,
    maxGap: 45,
    dangerEntries: 1,
    extremeBlocks: 3,
    reverseOpportunitiesWasted: 2,
    dangerousBigJumps: 3,
    recklessOpenings: 2,
    maxDangerOvershoot: 12,
    midRiskPlays: 4,
    maxBoldStreak: 3,
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
    nonReverseGapSum: 135,
    nonReverseGapSamples: 9,
    maxGap: 30,
    dangerEntries: 4,
    extremeBlocks: 2,
    reverseOpportunitiesWasted: 4,
    dangerousBigJumps: 2,
    recklessOpenings: 5,
    maxDangerOvershoot: 20,
    midRiskPlays: 6,
    maxBoldStreak: 2,
  });

  const awards = buildMvpAwards(stats);
  assert.deepEqual(
    awards.map((award) => award.code),
    MVP_CATALOG.map((item) => item.code),
  );

  assert.deepEqual(
    awards.find((award) => award.code === "card-machine").winners.map((winner) => winner.nickname),
    ["A", "B"],
  );
  assert.equal(awards.find((award) => award.code === "steady-hand").winners[0].nickname, "B");
  assert.equal(awards.find((award) => award.code === "runaway-train").winners[0].nickname, "B");
  assert.equal(awards.find((award) => award.code === "safety-distance").winners[0].nickname, "B");
  assert.equal(awards.find((award) => award.code === "heart-pound").winners[0].nickname, "C");
  assert.equal(awards.find((award) => award.code === "reverse-destroyer").winners[0].nickname, "C");
  assert.equal(awards.find((award) => award.code === "bomb-thrower").winners[0].nickname, "C");
});
