import { createLiquidationCatalog } from "./liquidation.js";

export const LIQUIDATION_ROUNDING = Object.freeze({
  FLOOR: "FLOOR",
});

function freezeValue(value) {
  if (Array.isArray(value)) return Object.freeze(value.map((item) => freezeValue(item)));
  if (value && typeof value === "object") {
    return Object.freeze(Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, freezeValue(item)]),
    ));
  }
  return value;
}

function requireBasisPoints(value, label) {
  const bps = Number(value);
  if (!Number.isSafeInteger(bps) || bps < 0 || bps > 10000) {
    throw new Error(`Liquidation ${label} must be an integer between 0 and 10000 basis points.`);
  }
  return bps;
}

function requireNonNegativeInteger(value, label) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 0) {
    throw new Error(`Liquidation ${label} must be a non-negative integer.`);
  }
  return number;
}

function applyBasisPoints(amount, bps) {
  return Math.floor((amount * bps) / 10000);
}

export function createLiquidationValuePolicy({
  propertyRefundBps,
  buildingRefundBps,
  rounding = LIQUIDATION_ROUNDING.FLOOR,
}) {
  if (rounding !== LIQUIDATION_ROUNDING.FLOOR) {
    throw new Error(`Unsupported liquidation rounding mode: ${rounding}`);
  }

  return freezeValue({
    propertyRefundBps: requireBasisPoints(propertyRefundBps, "property refund"),
    buildingRefundBps: requireBasisPoints(buildingRefundBps, "building refund"),
    rounding,
  });
}

export function calculatePropertyLiquidationRefund({
  node,
  propertyState,
  policy,
}) {
  if (node?.type !== "PROPERTY") {
    throw new Error("Liquidation refund requires a property node.");
  }
  if (!propertyState || typeof propertyState !== "object") {
    throw new Error("Liquidation refund requires property state.");
  }
  if (!policy || typeof policy !== "object") {
    throw new Error("Liquidation refund policy is required.");
  }

  const purchasePrice = requireNonNegativeInteger(node.price, "property price");
  const buildCost = requireNonNegativeInteger(node.buildCost, "building cost");
  const buildingLevel = requireNonNegativeInteger(propertyState.buildingLevel ?? 0, "building level");

  if (
    Number.isSafeInteger(node.maxBuildingLevel)
    && buildingLevel > node.maxBuildingLevel
  ) {
    throw new Error("Liquidation building level exceeds property maximum.");
  }

  const propertyRefund = applyBasisPoints(purchasePrice, policy.propertyRefundBps);
  const buildingInvestment = buildCost * buildingLevel;
  const buildingRefund = applyBasisPoints(buildingInvestment, policy.buildingRefundBps);

  return freezeValue({
    assetId: node.id,
    purchasePrice,
    propertyRefund,
    buildingLevel,
    buildCost,
    buildingInvestment,
    buildingRefund,
    refund: propertyRefund + buildingRefund,
  });
}

export function createBoardLiquidationCatalog({
  debtCase,
  board,
  boardState,
  policy,
}) {
  if (debtCase?.type !== "DEBT_RECOVERY") {
    throw new Error("A debt recovery case is required.");
  }
  if (!Array.isArray(board?.nodes)) {
    throw new Error("Liquidation board nodes are required.");
  }
  if (!boardState?.properties || typeof boardState.properties !== "object") {
    throw new Error("Liquidation board state is required.");
  }

  const entries = debtCase.ownedAssets.map(({ assetId }) => {
    const node = board.nodes.find((candidate) => candidate.id === assetId);
    const propertyState = boardState.properties[assetId];
    if (!node || !propertyState) {
      throw new Error(`Liquidation asset is missing from board state: ${assetId}`);
    }
    return calculatePropertyLiquidationRefund({ node, propertyState, policy });
  });

  return createLiquidationCatalog(
    debtCase,
    entries.map(({ assetId, refund }) => ({ assetId, refund })),
  );
}
