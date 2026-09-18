export const DEBT_RECOVERY_STATUS = Object.freeze({
  OPEN: "OPEN",
  READY: "READY",
  IMPOSSIBLE: "IMPOSSIBLE",
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

function requireId(value, label) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Debt recovery ${label} is required.`);
  }
  return value;
}

function requireMoney(value, label) {
  const money = Number(value);
  if (!Number.isSafeInteger(money) || money < 0) {
    throw new Error(`Debt recovery ${label} must be a non-negative integer.`);
  }
  return money;
}

function requirePlayer(players, playerId) {
  if (!Array.isArray(players)) throw new Error("Debt recovery players are required.");
  const player = players.find((candidate) => candidate.id === playerId);
  if (!player) throw new Error(`Unknown debt recovery player: ${playerId}`);
  if (player.bankrupt === true) throw new Error("Bankrupt players cannot enter debt recovery.");
  return player;
}

function ownedAssets(boardState, playerId) {
  const properties = boardState?.properties;
  if (!properties || typeof properties !== "object") {
    throw new Error("Debt recovery board state is required.");
  }

  return Object.entries(properties)
    .filter(([, property]) => property?.ownerId === playerId)
    .map(([assetId, property]) => freezeValue({
      assetId,
      buildingLevel: Number(property?.buildingLevel ?? 0),
    }));
}

export function createDebtRecoveryCase({
  playerId,
  amountDue,
  creditorId = null,
  reason = null,
  players,
  boardState,
}) {
  const normalizedPlayerId = requireId(playerId, "player id");
  const normalizedAmountDue = requireMoney(amountDue, "amount due");
  if (normalizedAmountDue <= 0) {
    throw new Error("Debt recovery amount due must be greater than zero.");
  }

  const player = requirePlayer(players, normalizedPlayerId);
  const cash = requireMoney(player.money, "player cash");
  if (cash >= normalizedAmountDue) {
    throw new Error("Debt recovery is only required when cash is insufficient.");
  }

  if (creditorId !== null) {
    const normalizedCreditorId = requireId(creditorId, "creditor id");
    if (normalizedCreditorId === normalizedPlayerId) {
      throw new Error("Debt recovery creditor cannot be the debtor.");
    }
    requirePlayer(players, normalizedCreditorId);
  }

  const assets = ownedAssets(boardState, normalizedPlayerId);
  return freezeValue({
    type: "DEBT_RECOVERY",
    playerId: normalizedPlayerId,
    amountDue: normalizedAmountDue,
    creditorId,
    reason,
    cash,
    shortfall: normalizedAmountDue - cash,
    ownedAssets: assets,
    status: assets.length > 0 ? DEBT_RECOVERY_STATUS.OPEN : DEBT_RECOVERY_STATUS.IMPOSSIBLE,
  });
}

export function createLiquidationCatalog(debtCase, assets) {
  if (debtCase?.type !== "DEBT_RECOVERY") {
    throw new Error("A debt recovery case is required.");
  }
  if (!Array.isArray(assets)) {
    throw new Error("Liquidation assets must be an array.");
  }

  const ownedIds = new Set(debtCase.ownedAssets.map((asset) => asset.assetId));
  const seen = new Set();
  const normalized = assets.map((asset) => {
    const assetId = requireId(asset?.assetId, "asset id");
    if (!ownedIds.has(assetId)) {
      throw new Error(`Liquidation asset is not owned by the debtor: ${assetId}`);
    }
    if (seen.has(assetId)) {
      throw new Error(`Liquidation asset is duplicated: ${assetId}`);
    }
    seen.add(assetId);

    const refund = requireMoney(asset?.refund, "refund");
    if (refund <= 0) {
      throw new Error("Liquidation refund must be greater than zero.");
    }

    const owned = debtCase.ownedAssets.find((candidate) => candidate.assetId === assetId);
    return freezeValue({
      assetId,
      refund,
      buildingLevel: owned.buildingLevel,
    });
  });

  return Object.freeze(normalized);
}

export function evaluateLiquidationPlan(debtCase, catalog, selectedAssetIds) {
  if (debtCase?.type !== "DEBT_RECOVERY") {
    throw new Error("A debt recovery case is required.");
  }
  if (!Array.isArray(catalog)) {
    throw new Error("A liquidation catalog is required.");
  }
  if (!Array.isArray(selectedAssetIds)) {
    throw new Error("Selected liquidation assets must be an array.");
  }

  const catalogById = new Map(catalog.map((asset) => [asset.assetId, asset]));
  const seen = new Set();
  const selected = selectedAssetIds.map((assetId) => {
    const normalizedId = requireId(assetId, "selected asset id");
    if (seen.has(normalizedId)) {
      throw new Error(`Selected liquidation asset is duplicated: ${normalizedId}`);
    }
    seen.add(normalizedId);
    const asset = catalogById.get(normalizedId);
    if (!asset) {
      throw new Error(`Selected liquidation asset is not available: ${normalizedId}`);
    }
    return asset;
  });

  const refundTotal = selected.reduce((sum, asset) => sum + asset.refund, 0);
  const availableCash = debtCase.cash + refundTotal;
  const remainingShortfall = Math.max(0, debtCase.amountDue - availableCash);
  const canSettle = remainingShortfall === 0;

  return freezeValue({
    type: "LIQUIDATION_PLAN",
    playerId: debtCase.playerId,
    selectedAssetIds: selected.map((asset) => asset.assetId),
    refundTotal,
    availableCash,
    amountDue: debtCase.amountDue,
    remainingShortfall,
    canSettle,
    status: canSettle ? DEBT_RECOVERY_STATUS.READY : DEBT_RECOVERY_STATUS.OPEN,
  });
}

export function canDebtBeRecovered(debtCase, catalog) {
  if (debtCase?.status === DEBT_RECOVERY_STATUS.IMPOSSIBLE) return false;
  const fullPlan = evaluateLiquidationPlan(
    debtCase,
    catalog,
    catalog.map((asset) => asset.assetId),
  );
  return fullPlan.canSettle;
}
