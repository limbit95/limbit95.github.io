import test from "node:test";
import assert from "node:assert/strict";

import {
  DEBT_RECOVERY_STATUS,
  createDebtRecoveryCase,
  createLiquidationCatalog,
} from "../js/core/liquidation.js";
import {
  confirmDebtRecovery,
  createDebtRecoveryLifecycle,
  getDebtRecoverySettlement,
  selectDebtRecoveryAssets,
} from "../js/core/debtRecoveryLifecycle.js";

function setup({
  cash = 90,
  amountDue = 200,
  refunds = [
    { assetId: "singapore", refund: 70 },
    { assetId: "seoul", refund: 180 },
  ],
} = {}) {
  const debtCase = createDebtRecoveryCase({
    playerId: "a",
    amountDue,
    creditorId: "b",
    reason: "TOLL",
    players: [
      { id: "a", money: cash, bankrupt: false },
      { id: "b", money: 500, bankrupt: false },
    ],
    boardState: {
      properties: {
        singapore: { ownerId: "a", buildingLevel: 0 },
        seoul: { ownerId: "a", buildingLevel: 2 },
      },
    },
  });
  const catalog = createLiquidationCatalog(debtCase, refunds);
  return { debtCase, catalog };
}

test("recoverable debt lifecycle starts open with no automatic asset sale", () => {
  const { debtCase, catalog } = setup();
  const lifecycle = createDebtRecoveryLifecycle({ debtCase, catalog });

  assert.equal(lifecycle.status, DEBT_RECOVERY_STATUS.OPEN);
  assert.deepEqual(lifecycle.selectedAssetIds, []);
  assert.equal(lifecycle.plan.refundTotal, 0);
  assert.equal(lifecycle.plan.canSettle, false);
  assert.equal(lifecycle.settlement, null);
  assert.equal(Object.isFrozen(lifecycle), true);
});

test("unrecoverable debt lifecycle starts impossible", () => {
  const { debtCase, catalog } = setup({
    amountDue: 400,
    refunds: [
      { assetId: "singapore", refund: 20 },
      { assetId: "seoul", refund: 40 },
    ],
  });
  const lifecycle = createDebtRecoveryLifecycle({ debtCase, catalog });

  assert.equal(lifecycle.status, DEBT_RECOVERY_STATUS.IMPOSSIBLE);
  assert.throws(
    () => selectDebtRecoveryAssets(lifecycle, ["singapore"]),
    /Impossible debt recovery/i,
  );
});

test("selection remains open until chosen assets cover the debt", () => {
  const { debtCase, catalog } = setup();
  let lifecycle = createDebtRecoveryLifecycle({ debtCase, catalog });

  lifecycle = selectDebtRecoveryAssets(lifecycle, ["singapore"]);
  assert.equal(lifecycle.status, DEBT_RECOVERY_STATUS.OPEN);
  assert.equal(lifecycle.plan.remainingShortfall, 40);

  lifecycle = selectDebtRecoveryAssets(lifecycle, ["seoul"]);
  assert.equal(lifecycle.status, DEBT_RECOVERY_STATUS.READY);
  assert.equal(lifecycle.plan.remainingShortfall, 0);
  assert.equal(lifecycle.plan.refundTotal, 180);
});

test("ready debt recovery can be confirmed into an immutable settlement instruction", () => {
  const { debtCase, catalog } = setup();
  let lifecycle = createDebtRecoveryLifecycle({ debtCase, catalog });
  lifecycle = selectDebtRecoveryAssets(lifecycle, ["seoul"]);
  lifecycle = confirmDebtRecovery(lifecycle);

  assert.equal(lifecycle.status, DEBT_RECOVERY_STATUS.CONFIRMED);
  assert.deepEqual(lifecycle.settlement, {
    type: "DEBT_RECOVERY_SETTLEMENT",
    playerId: "a",
    creditorId: "b",
    reason: "TOLL",
    amountDue: 200,
    startingCash: 90,
    liquidatedAssetIds: ["seoul"],
    refundTotal: 180,
    cashBeforePayment: 270,
    cashAfterPayment: 70,
  });
  assert.equal(getDebtRecoverySettlement(lifecycle), lifecycle.settlement);
  assert.equal(Object.isFrozen(lifecycle.settlement), true);
});

test("debt recovery cannot be confirmed before selected assets cover the debt", () => {
  const { debtCase, catalog } = setup();
  let lifecycle = createDebtRecoveryLifecycle({ debtCase, catalog });

  assert.throws(
    () => confirmDebtRecovery(lifecycle),
    /only be confirmed when the selected assets cover the debt/i,
  );

  lifecycle = selectDebtRecoveryAssets(lifecycle, ["singapore"]);
  assert.throws(
    () => confirmDebtRecovery(lifecycle),
    /only be confirmed when the selected assets cover the debt/i,
  );
});

test("confirmed debt recovery selection is immutable", () => {
  const { debtCase, catalog } = setup();
  let lifecycle = createDebtRecoveryLifecycle({ debtCase, catalog });
  lifecycle = selectDebtRecoveryAssets(lifecycle, ["seoul"]);
  lifecycle = confirmDebtRecovery(lifecycle);

  assert.throws(
    () => selectDebtRecoveryAssets(lifecycle, ["singapore", "seoul"]),
    /cannot be changed/i,
  );
});

test("over-liquidation is allowed and leftover cash remains with the debtor", () => {
  const { debtCase, catalog } = setup();
  let lifecycle = createDebtRecoveryLifecycle({ debtCase, catalog });
  lifecycle = selectDebtRecoveryAssets(lifecycle, ["singapore", "seoul"]);
  lifecycle = confirmDebtRecovery(lifecycle);

  assert.equal(lifecycle.settlement.refundTotal, 250);
  assert.equal(lifecycle.settlement.cashBeforePayment, 340);
  assert.equal(lifecycle.settlement.cashAfterPayment, 140);
});

test("bank debt without creditor keeps creditor null in settlement", () => {
  const debtCase = createDebtRecoveryCase({
    playerId: "a",
    amountDue: 200,
    creditorId: null,
    reason: "TAX",
    players: [
      { id: "a", money: 50, bankrupt: false },
      { id: "b", money: 500, bankrupt: false },
    ],
    boardState: {
      properties: {
        singapore: { ownerId: "a", buildingLevel: 0 },
      },
    },
  });
  const catalog = createLiquidationCatalog(debtCase, [
    { assetId: "singapore", refund: 200 },
  ]);
  let lifecycle = createDebtRecoveryLifecycle({ debtCase, catalog });
  lifecycle = selectDebtRecoveryAssets(lifecycle, ["singapore"]);
  lifecycle = confirmDebtRecovery(lifecycle);

  assert.equal(lifecycle.settlement.creditorId, null);
  assert.equal(lifecycle.settlement.reason, "TAX");
});
