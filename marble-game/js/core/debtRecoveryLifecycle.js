import {
  DEBT_RECOVERY_STATUS,
  canDebtBeRecovered,
  evaluateLiquidationPlan,
} from "./liquidation.js";

function freezeValue(value) {
  if (Array.isArray(value)) return Object.freeze(value.map((item) => freezeValue(item)));
  if (value && typeof value === "object") {
    return Object.freeze(Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, freezeValue(item)]),
    ));
  }
  return value;
}

function requireLifecycle(lifecycle) {
  if (lifecycle?.type !== "DEBT_RECOVERY_LIFECYCLE") {
    throw new Error("A debt recovery lifecycle is required.");
  }
  return lifecycle;
}

export function createDebtRecoveryLifecycle({
  debtCase,
  catalog,
}) {
  if (debtCase?.type !== "DEBT_RECOVERY") {
    throw new Error("A debt recovery case is required.");
  }
  if (!Array.isArray(catalog)) {
    throw new Error("A liquidation catalog is required.");
  }

  const recoverable = canDebtBeRecovered(debtCase, catalog);
  const initialPlan = evaluateLiquidationPlan(debtCase, catalog, []);

  return freezeValue({
    type: "DEBT_RECOVERY_LIFECYCLE",
    debtCase,
    catalog,
    selectedAssetIds: [],
    plan: initialPlan,
    status: recoverable ? DEBT_RECOVERY_STATUS.OPEN : DEBT_RECOVERY_STATUS.IMPOSSIBLE,
    settlement: null,
  });
}

export function selectDebtRecoveryAssets(lifecycle, selectedAssetIds) {
  const current = requireLifecycle(lifecycle);
  if (current.status === DEBT_RECOVERY_STATUS.CONFIRMED) {
    throw new Error("Confirmed debt recovery cannot be changed.");
  }
  if (current.status === DEBT_RECOVERY_STATUS.IMPOSSIBLE) {
    throw new Error("Impossible debt recovery cannot select assets.");
  }

  const plan = evaluateLiquidationPlan(
    current.debtCase,
    current.catalog,
    selectedAssetIds,
  );

  return freezeValue({
    ...current,
    selectedAssetIds: plan.selectedAssetIds,
    plan,
    status: plan.canSettle ? DEBT_RECOVERY_STATUS.READY : DEBT_RECOVERY_STATUS.OPEN,
    settlement: null,
  });
}

export function confirmDebtRecovery(lifecycle) {
  const current = requireLifecycle(lifecycle);
  if (current.status !== DEBT_RECOVERY_STATUS.READY || !current.plan?.canSettle) {
    throw new Error("Debt recovery can only be confirmed when the selected assets cover the debt.");
  }

  const settlement = freezeValue({
    type: "DEBT_RECOVERY_SETTLEMENT",
    playerId: current.debtCase.playerId,
    creditorId: current.debtCase.creditorId,
    reason: current.debtCase.reason,
    amountDue: current.debtCase.amountDue,
    startingCash: current.debtCase.cash,
    liquidatedAssetIds: current.plan.selectedAssetIds,
    refundTotal: current.plan.refundTotal,
    cashBeforePayment: current.plan.availableCash,
    cashAfterPayment: current.plan.availableCash - current.debtCase.amountDue,
  });

  return freezeValue({
    ...current,
    status: DEBT_RECOVERY_STATUS.CONFIRMED,
    settlement,
  });
}

export function getDebtRecoverySettlement(lifecycle) {
  const current = requireLifecycle(lifecycle);
  if (current.status !== DEBT_RECOVERY_STATUS.CONFIRMED || !current.settlement) {
    throw new Error("Debt recovery settlement is not confirmed.");
  }
  return current.settlement;
}
