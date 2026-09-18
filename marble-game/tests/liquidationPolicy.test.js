import test from "node:test";
import assert from "node:assert/strict";

import {
  createDebtRecoveryCase,
} from "../js/core/liquidation.js";
import {
  LIQUIDATION_ROUNDING,
  calculatePropertyLiquidationRefund,
  createBoardLiquidationCatalog,
  createLiquidationValuePolicy,
} from "../js/core/liquidationPolicy.js";

function policy(overrides = {}) {
  return createLiquidationValuePolicy({
    propertyRefundBps: 5000,
    buildingRefundBps: 5000,
    ...overrides,
  });
}

function propertyNode(overrides = {}) {
  return {
    id: "singapore",
    type: "PROPERTY",
    price: 260,
    buildCost: 130,
    maxBuildingLevel: 3,
    ...overrides,
  };
}

function debtCase() {
  return createDebtRecoveryCase({
    playerId: "a",
    amountDue: 300,
    creditorId: "b",
    reason: "TOLL",
    players: [
      { id: "a", money: 50, bankrupt: false },
      { id: "b", money: 500, bankrupt: false },
    ],
    boardState: {
      properties: {
        singapore: { ownerId: "a", buildingLevel: 0 },
        seoul: { ownerId: "a", buildingLevel: 2 },
      },
    },
  });
}

test("liquidation policy stores integer basis points without choosing game-specific defaults", () => {
  const valuePolicy = policy();

  assert.deepEqual(valuePolicy, {
    propertyRefundBps: 5000,
    buildingRefundBps: 5000,
    rounding: LIQUIDATION_ROUNDING.FLOOR,
  });
  assert.equal(Object.isFrozen(valuePolicy), true);
});

test("liquidation policy rejects invalid rates and unsupported rounding modes", () => {
  assert.throws(
    () => policy({ propertyRefundBps: -1 }),
    /between 0 and 10000/i,
  );
  assert.throws(
    () => policy({ buildingRefundBps: 10001 }),
    /between 0 and 10000/i,
  );
  assert.throws(
    () => policy({ propertyRefundBps: 12.5 }),
    /between 0 and 10000/i,
  );
  assert.throws(
    () => policy({ rounding: "ROUND" }),
    /Unsupported liquidation rounding mode/i,
  );
});

test("property liquidation refund separates land and building investment deterministically", () => {
  const result = calculatePropertyLiquidationRefund({
    node: propertyNode(),
    propertyState: { ownerId: "a", buildingLevel: 2 },
    policy: policy(),
  });

  assert.deepEqual(result, {
    assetId: "singapore",
    purchasePrice: 260,
    propertyRefund: 130,
    buildingLevel: 2,
    buildCost: 130,
    buildingInvestment: 260,
    buildingRefund: 130,
    refund: 260,
  });
});

test("basis-point refund uses floor rounding for integer gold", () => {
  const result = calculatePropertyLiquidationRefund({
    node: propertyNode({ price: 101, buildCost: 33 }),
    propertyState: { ownerId: "a", buildingLevel: 1 },
    policy: policy({
      propertyRefundBps: 3333,
      buildingRefundBps: 6667,
    }),
  });

  assert.equal(result.propertyRefund, 33);
  assert.equal(result.buildingRefund, 22);
  assert.equal(result.refund, 55);
});

test("property liquidation validates node, numeric state and maximum building level", () => {
  assert.throws(
    () => calculatePropertyLiquidationRefund({
      node: { ...propertyNode(), type: "TAX" },
      propertyState: { buildingLevel: 0 },
      policy: policy(),
    }),
    /requires a property node/i,
  );

  assert.throws(
    () => calculatePropertyLiquidationRefund({
      node: propertyNode(),
      propertyState: { buildingLevel: 4 },
      policy: policy(),
    }),
    /exceeds property maximum/i,
  );

  assert.throws(
    () => calculatePropertyLiquidationRefund({
      node: propertyNode({ buildCost: -1 }),
      propertyState: { buildingLevel: 0 },
      policy: policy(),
    }),
    /building cost must be a non-negative integer/i,
  );
});

test("board liquidation catalog converts debtor-owned board assets into refund entries", () => {
  const debt = debtCase();
  const board = {
    nodes: [
      propertyNode(),
      propertyNode({ id: "seoul", price: 400, buildCost: 150 }),
    ],
  };
  const boardState = {
    properties: {
      singapore: { ownerId: "a", buildingLevel: 0 },
      seoul: { ownerId: "a", buildingLevel: 2 },
    },
  };

  const catalog = createBoardLiquidationCatalog({
    debtCase: debt,
    board,
    boardState,
    policy: policy(),
  });

  assert.deepEqual(catalog, [
    { assetId: "singapore", refund: 130, buildingLevel: 0 },
    { assetId: "seoul", refund: 350, buildingLevel: 2 },
  ]);
});

test("board liquidation catalog fails closed when debt assets drift from board state", () => {
  const debt = debtCase();

  assert.throws(
    () => createBoardLiquidationCatalog({
      debtCase: debt,
      board: { nodes: [propertyNode()] },
      boardState: {
        properties: {
          singapore: { ownerId: "a", buildingLevel: 0 },
        },
      },
      policy: policy(),
    }),
    /missing from board state: seoul/i,
  );
});
