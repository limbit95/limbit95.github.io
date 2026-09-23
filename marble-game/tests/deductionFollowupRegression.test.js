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
const moneyRendererSource = readFileSync(
  new URL("../js/renderer/threeClassicMoneyPresentation.js", import.meta.url),
  "utf8",
);
const tollLayoutCssSource = readFileSync(
  new URL("../css/toll-loss-layout-polish.css", import.meta.url),
  "utf8",
);
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

test("local TAX presentation leaves modal ownership to app and forwards MONEY_PAID to shared loss presenter", () => {
  assert.match(costEntrySource, /function isLocalPresentationMode\(documentObject\)/);
  assert.match(costEntrySource, /mode === "local-play" \|\| mode === "full"/);
  assert.match(costEntrySource, /function scheduleCostTileModal\(event\) \{\s*if \(isLocalPresentationMode\(documentObject\)\) return;/);
  assert.match(costEntrySource, /!isLocalPresentationMode\(documentObject\)[\s\S]*event\?\.type === "MONEY_PAID"[\s\S]*event\?\.reason === "TAX"/);
  assert.match(costEntrySource, /const value = await renderer\.playEvent\(event\);/);
  assert.match(costEntrySource, /event\?\.type === "TILE_LANDED" && event\?\.tileType === "TAX"/);
  assert.match(costEntrySource, /threeClassicPerformanceEntry\.js\?v=20260917-r8-base/);
});

test("final TAX modal guard replaces any legacy gold-change row with shared deduction flow", () => {
  assert.match(costEntrySource, /function hasLegacyCostRow\(stats\)/);
  assert.match(costEntrySource, /=== "골드 변화"/);
  assert.match(costEntrySource, /function presentRenderedLegacyCost\(\)/);
  assert.match(costEntrySource, /type\?\.textContent\?\.trim\?\.\(\) !== "비용"/);
  assert.match(costEntrySource, /createCostLossFlow\([\s\S]*context\.balanceBefore,[\s\S]*context\.amount/);
  assert.match(costEntrySource, /costStatsObserver\.observe\(stats, \{ childList: true, subtree: true \}\)/);
  assert.match(costEntrySource, /costStatsObserver\.observe\(modal, \{ attributes: true, attributeFilter: \["open"\] \}\)/);
  assert.match(costEntrySource, /installFinalCostGuard\(\)/);
});

test("TAX is not opened early by the inner money renderer", () => {
  assert.match(moneyRendererSource, /MODAL_LANDING_TILE_TYPES = new Set\(\["BONUS", "REST"\]\)/);
  assert.doesNotMatch(moneyRendererSource, /MODAL_LANDING_TILE_TYPES = new Set\(\[[^\]]*"TAX"/);
  assert.match(indexHtml, /threeClassicMoneyPresentation\.js\?v=20260917-r2/);
});

test("toll deduction cards use equal columns and centered symmetric spacing", () => {
  assert.match(tollLayoutCssSource, /width: min\(540px, calc\(100vw - 32px\)\)/);
  assert.match(tollLayoutCssSource, /grid-template-columns: minmax\(0, 1fr\) 20px minmax\(0, 1fr\) 20px minmax\(0, 1fr\)/);
  assert.match(tollLayoutCssSource, /padding: 14px 10px 13px/);
  assert.match(tollLayoutCssSource, /justify-items: center/);
  assert.match(tollLayoutCssSource, /text-align: center/);
  assert.match(tollLayoutCssSource, /white-space: nowrap/);
  assert.match(indexHtml, /toll-loss-layout-polish\.css\?v=20260917-r1/);
  assert.doesNotMatch(indexHtml, /coin-motion-polish\.css/);
  assert.match(indexHtml, /threeClassicCostPresentationEntry\.js\?v=20260917-r12/);
  assert.match(indexHtml, /data-marble-build="20260923-r2"/);
});