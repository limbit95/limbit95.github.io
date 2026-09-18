import test from "node:test";
import assert from "node:assert/strict";

import {
  DEBT_RECOVERY_STATUS,
  canDebtBeRecovered,
  createDebtRecoveryCase,
  createLiquidationCatalog,
  evaluateLiquidationPlan,
} from "../js/core/liquidation.js";

function players(overrides = {}) {
  return [
    { id: "a", money: 90, bankrupt: false, ...(overrides.a ?? {}) },
    { id: "b", money: 500, bankrupt: false, ...(overrides.b ?? {}) },
    { id: "c", money: 700, bankrupt: false, ...(overrides.c ?? {}) },
  ];
}

function boardState(overrides = {}) {
  return {
    properties: {
      singapore: { ownerId: "a", buildingLevel: 0 },
      seoul: { ownerId: "a", buildingLevel: 2 },
      tokyo: { ownerId: "b", buildingLevel: 0 },
      ...(overrides.properties ?? {}),
    },
  };
}

function debtCase(overrides = {}) {
  return createDebtRecoveryCase({
    playerId: "a",
    amountDue: 200,
    creditorId: "b",
    reason: "TOLL",
    players: players(),
    boardState: boardState(),
    ...overrides,
  });
}

test("debt recovery case records shortfall and owned assets without inventing sale values", () => {
  const debt = debtCase();

  assert.equal(debt.type, "DEBT_RECOVERY");
  assert.equal(debt.cash, 90);
  assert.equal(debt.amountDue, 200);
  assert.equal(debt.shortfall, 110);
  assert.equal(debt.status, DEBT_RECOVERY_STATUS.OPEN);
  assert.deepEqual(debt.ownedAssets, [
    { assetId: "singapore", buildingLevel: 0 },
    { assetId: "seoul", buildingLevel: 2 },
  ]);
  assert.equal(Object.isFrozen(debt), true);
  assert.equal(Object.isFrozen(debt.ownedAssets), true);
});

test("debt recovery is unnecessary when current cash already covers payment", () => {
  assert.throws(
    () => debtCase({ amountDue: 80 }),
    /only required when cash is insufficient/i,
  );
});

test("debt recovery rejects bankrupt debtors, unknown creditors and self-creditors", () => {
  assert.throws(
    () => debtCase({ players: players({ a: { bankrupt: true } }) }),
    /Bankrupt players cannot enter debt recovery/i,
  );
  assert.throws(
    () => debtCase({ creditorId: "missing" }),
    /Unknown debt recovery player/i,
  );
  assert.throws(
    () => debtCase({ creditorId: "a" }),
    /creditor cannot be the debtor/i,
  );
});

test("debt recovery without owned assets is immediately impossible", () => {
  const debt = debtCase({
    boardState: boardState({
      properties: {
        singapore: { ownerId: null, buildingLevel: 0 },
        seoul: { ownerId: "b", buildingLevel: 0 },
      },
    }),
  });

  assert.equal(debt.status, DEBT_RECOVERY_STATUS.IMPOSSIBLE);
  assert.deepEqual(debt.ownedAssets, []);
});

test("liquidation catalog accepts explicit externally supplied refund values", () => {
  const catalog = createLiquidationCatalog(debtCase(), [
    { assetId: "singapore", refund: 70 },
    { assetId: "seoul", refund: 180 },
  ]);

  assert.deepEqual(catalog, [
    { assetId: "singapore", refund: 70, buildingLevel: 0 },
    { assetId: "seoul", refund: 180, buildingLevel: 2 },
  ]);
  assert.equal(Object.isFrozen(catalog), true);
});

test("liquidation catalog rejects unowned, duplicate and non-positive refund entries", () => {
  const debt = debtCase();

  assert.throws(
    () => createLiquidationCatalog(debt, [{ assetId: "tokyo", refund: 100 }]),
    /not owned by the debtor/i,
  );
  assert.throws(
    () => createLiquidationCatalog(debt, [
      { assetId: "singapore", refund: 50 },
      { assetId: "singapore", refund: 60 },
    ]),
    /duplicated/i,
  );
  assert.throws(
    () => createLiquidationCatalog(debt, [{ assetId: "singapore", refund: 0 }]),
    /greater than zero/i,
  );
});

test("liquidation plan reports whether selected assets can cover the debt", () => {
  const debt = debtCase();
  const catalog = createLiquidationCatalog(debt, [
    { assetId: "singapore", refund: 70 },
    { assetId: "seoul", refund: 180 },
  ]);

  const partial = evaluateLiquidationPlan(debt, catalog, ["singapore"]);
  assert.equal(partial.refundTotal, 70);
  assert.equal(partial.availableCash, 160);
  assert.equal(partial.remainingShortfall, 40);
  assert.equal(partial.canSettle, false);
  assert.equal(partial.status, DEBT_RECOVERY_STATUS.OPEN);

  const enough = evaluateLiquidationPlan(debt, catalog, ["seoul"]);
  assert.equal(enough.refundTotal, 180);
  assert.equal(enough.availableCash, 270);
  assert.equal(enough.remainingShortfall, 0);
  assert.equal(enough.canSettle, true);
  assert.equal(enough.status, DEBT_RECOVERY_STATUS.READY);
});

test("liquidation plan rejects unavailable and duplicate selected assets", () => {
  const debt = debtCase();
  const catalog = createLiquidationCatalog(debt, [
    { assetId: "singapore", refund: 70 },
    { assetId: "seoul", refund: 180 },
  ]);

  assert.throws(
    () => evaluateLiquidationPlan(debt, catalog, ["tokyo"]),
    /not available/i,
  );
  assert.throws(
    () => evaluateLiquidationPlan(debt, catalog, ["seoul", "seoul"]),
    /duplicated/i,
  );
});

test("full catalog can determine whether recovery is possible without mutating game state", () => {
  const debt = debtCase();

  assert.equal(
    canDebtBeRecovered(debt, createLiquidationCatalog(debt, [
      { assetId: "singapore", refund: 40 },
      { assetId: "seoul", refund: 50 },
    ])),
    false,
  );

  assert.equal(
    canDebtBeRecovered(debt, createLiquidationCatalog(debt, [
      { assetId: "singapore", refund: 40 },
      { assetId: "seoul", refund: 80 },
    ])),
    true,
  );

  assert.equal(boardState().properties.singapore.ownerId, "a");
});
