import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { ACTION_TYPES } from "../js/core/actions.js";
import { createInitialGameState, GAME_STATUS, reduceGameAction } from "../js/core/gameEngine.js";
import { TURN_PHASES } from "../js/core/turnMachine.js";

const costEntrySource = readFileSync(
  new URL("../js/renderer/threeClassicCostPresentationEntry.js", import.meta.url),
  "utf8",
);
const coinCssSource = readFileSync(new URL("../css/coin-motion-polish.css", import.meta.url), "utf8");
const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("owned property still offers BUILD_PROPERTY when current gold is below build cost", () => {
  const initial = createInitialGameState({
    players: [{ id: "p1" }, { id: "p2" }],
  });
  const players = initial.players.map((player, index) => Object.freeze({
    ...player,
    positionNodeId: index === 0 ? "event-east" : player.positionNodeId,
    money: index === 0 ? 0 : player.money,
  }));
  const properties = {
    ...initial.boardState.properties,
    sydney: Object.freeze({ ownerId: "p1", buildingLevel: 0 }),
  };
  const state = Object.freeze({
    ...initial,
    status: GAME_STATUS.PLAYING,
    phase: TURN_PHASES.WAITING_ROLL,
    turn: 1,
    currentPlayerIndex: 0,
    players: Object.freeze(players),
    boardState: Object.freeze({ properties: Object.freeze(properties) }),
  });

  const next = reduceGameAction(state, {
    type: ACTION_TYPES.ROLL_DICE,
    playerId: "p1",
    payload: { dice: [1, 1] },
  });

  assert.equal(next.phase, TURN_PHASES.WAITING_CHOICE);
  assert.deepEqual(next.pendingChoice, {
    type: "BUILD_PROPERTY",
    nodeId: "sydney",
    cost: 140,
  });
  assert.equal(next.players[0].money, 0);
});

test("cost landing entry explicitly opens TAX tile modal before shared deduction presentation", () => {
  assert.match(costEntrySource, /event\?\.type !== "TILE_LANDED" \|\| event\?\.tileType !== "TAX"/);
  assert.match(costEntrySource, /createClassicTileInfo\(state, event\.nodeId\)/);
  assert.match(costEntrySource, /modal\.showModal\(\)/);
  assert.match(costEntrySource, /threeClassicPerformanceEntry\.js\?v=20260917-r5-base/);
});

test("coin transfers use a strong hop and full spin while keeping reduced-motion fallback", () => {
  assert.match(coinCssSource, /translate: 0 -118px/);
  assert.match(coinCssSource, /translate: 0 -132px/);
  assert.match(coinCssSource, /rotate: 390deg/);
  assert.match(coinCssSource, /rotate: 720deg/);
  assert.match(coinCssSource, /prefers-reduced-motion: reduce/);
  assert.match(indexHtml, /coin-motion-polish\.css\?v=20260917-r1/);
  assert.match(indexHtml, /threeClassicCostPresentationEntry\.js\?v=20260917-r6/);
  assert.match(indexHtml, /data-marble-build="20260917-r6"/);
});
