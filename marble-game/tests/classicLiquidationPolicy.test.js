import test from "node:test";
import assert from "node:assert/strict";

import { createDebtRecoveryCase } from "../js/core/liquidation.js";
import {
  calculatePropertyLiquidationRefund,
  createBoardLiquidationCatalog,
  createLiquidationValuePolicy,
} from "../js/core/liquidationPolicy.js";
import { CLASSIC_NODES } from "../js/themes/classic/board.js";
import { CLASSIC_RULES } from "../js/themes/classic/rules.js";

function classicPolicy() {
  return createLiquidationValuePolicy(CLASSIC_RULES.liquidation);
}

test("Classic Phase 7C initial liquidation policy refunds 50% of land and building investment", () => {
  assert.deepEqual(CLASSIC_RULES.liquidation, {
    propertyRefundBps: 5000,
    buildingRefundBps: 5000,
  });

  const singapore = CLASSIC_NODES.find((node) => node.id === "singapore");
  const result = calculatePropertyLiquidationRefund({
    node: singapore,
    propertyState: { ownerId: "a", buildingLevel: 2 },
    policy: classicPolicy(),
  });

  assert.equal(result.purchasePrice, 260);
  assert.equal(result.propertyRefund, 130);
  assert.equal(result.buildingInvestment, 260);
  assert.equal(result.buildingRefund, 130);
  assert.equal(result.refund, 260);
});

test("Classic liquidation policy keeps undeveloped property refund independent of building rate", () => {
  const tokyo = CLASSIC_NODES.find((node) => node.id === "tokyo");
  const result = calculatePropertyLiquidationRefund({
    node: tokyo,
    propertyState: { ownerId: "a", buildingLevel: 0 },
    policy: classicPolicy(),
  });

  assert.equal(result.propertyRefund, 120);
  assert.equal(result.buildingRefund, 0);
  assert.equal(result.refund, 120);
});

test("Classic debt recovery catalog derives deterministic refunds from current board state", () => {
  const boardState = {
    properties: {
      singapore: { ownerId: "a", buildingLevel: 0 },
      seoul: { ownerId: null, buildingLevel: 0 },
      london: { ownerId: "a", buildingLevel: 2 },
    },
  };

  const debt = createDebtRecoveryCase({
    playerId: "a",
    amountDue: 500,
    creditorId: "b",
    reason: "TOLL",
    players: [
      { id: "a", money: 100, bankrupt: false },
      { id: "b", money: 800, bankrupt: false },
    ],
    boardState,
  });

  const catalog = createBoardLiquidationCatalog({
    debtCase: debt,
    board: { nodes: CLASSIC_NODES },
    boardState,
    policy: classicPolicy(),
  });

  assert.deepEqual(catalog, [
    { assetId: "singapore", refund: 130, buildingLevel: 0 },
    { assetId: "london", refund: 400, buildingLevel: 2 },
  ]);
});
