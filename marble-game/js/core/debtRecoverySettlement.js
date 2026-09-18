import {
  DEBT_RECOVERY_STATUS,
} from "./liquidation.js";
import {
  getDebtRecoverySettlement,
} from "./debtRecoveryLifecycle.js";

function freezeValue(value) {
  if (Array.isArray(value)) return Object.freeze(value.map((item) => freezeValue(item)));
  if (value && typeof value === "object") {
    return Object.freeze(Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, freezeValue(item)]),
    ));
  }
  return value;
}

function requirePlayer(players, playerId, role) {
  const index = players.findIndex((player) => player.id === playerId);
  if (index < 0) {
    throw new Error(`Debt recovery ${role} is missing from players.`);
  }
  const player = players[index];
  if (player.bankrupt === true) {
    throw new Error(`Bankrupt debt recovery ${role} cannot settle debt.`);
  }
  return { player, index };
}

function updatePlayer(players, index, patch) {
  const next = [...players];
  next[index] = Object.freeze({ ...next[index], ...patch });
  return next;
}

export function settleConfirmedDebtRecovery({
  lifecycle,
  players,
  boardState,
}) {
  if (
    lifecycle?.type !== "DEBT_RECOVERY_LIFECYCLE"
    || lifecycle.status !== DEBT_RECOVERY_STATUS.CONFIRMED
  ) {
    throw new Error("Confirmed debt recovery lifecycle is required.");
  }
  if (!Array.isArray(players)) {
    throw new Error("Debt recovery players are required.");
  }
  if (!boardState?.properties || typeof boardState.properties !== "object") {
    throw new Error("Debt recovery board state is required.");
  }

  const settlement = getDebtRecoverySettlement(lifecycle);
  const debtor = requirePlayer(players, settlement.playerId, "debtor");
  const creditor = settlement.creditorId
    ? requirePlayer(players, settlement.creditorId, "creditor")
    : null;

  if (Number(debtor.player.money) !== settlement.startingCash) {
    throw new Error("Debt recovery debtor cash changed before settlement.");
  }

  const catalogById = new Map(lifecycle.catalog.map((asset) => [asset.assetId, asset]));
  const debtAssetById = new Map(lifecycle.debtCase.ownedAssets.map((asset) => [asset.assetId, asset]));

  let refundTotal = 0;
  const properties = { ...boardState.properties };
  const liquidationEvents = [];

  for (const assetId of settlement.liquidatedAssetIds) {
    const catalogAsset = catalogById.get(assetId);
    const debtAsset = debtAssetById.get(assetId);
    const property = properties[assetId];

    if (!catalogAsset || !debtAsset || !property) {
      throw new Error(`Debt recovery asset is missing at settlement: ${assetId}`);
    }
    if (property.ownerId !== settlement.playerId) {
      throw new Error(`Debt recovery asset ownership changed before settlement: ${assetId}`);
    }
    if (Number(property.buildingLevel ?? 0) !== Number(debtAsset.buildingLevel ?? 0)) {
      throw new Error(`Debt recovery asset building level changed before settlement: ${assetId}`);
    }

    refundTotal += catalogAsset.refund;
    properties[assetId] = Object.freeze({
      ...property,
      ownerId: null,
      buildingLevel: 0,
    });
    liquidationEvents.push(Object.freeze({
      type: "PROPERTY_LIQUIDATED",
      playerId: settlement.playerId,
      nodeId: assetId,
      refund: catalogAsset.refund,
      buildingLevel: Number(debtAsset.buildingLevel ?? 0),
    }));
  }

  if (refundTotal !== settlement.refundTotal) {
    throw new Error("Debt recovery refund total changed before settlement.");
  }

  const cashBeforePayment = settlement.startingCash + refundTotal;
  if (cashBeforePayment !== settlement.cashBeforePayment) {
    throw new Error("Debt recovery cash-before-payment contract changed.");
  }
  if (cashBeforePayment < settlement.amountDue) {
    throw new Error("Debt recovery settlement no longer covers the debt.");
  }

  let nextPlayers = [...players];
  nextPlayers = updatePlayer(nextPlayers, debtor.index, {
    money: cashBeforePayment - settlement.amountDue,
  });

  if (creditor) {
    nextPlayers = updatePlayer(nextPlayers, creditor.index, {
      money: Number(creditor.player.money) + settlement.amountDue,
    });
  }

  const events = [
    ...liquidationEvents,
    Object.freeze({
      type: "MONEY_PAID",
      playerId: settlement.playerId,
      creditorId: settlement.creditorId,
      amount: settlement.amountDue,
      reason: settlement.reason,
    }),
    Object.freeze({
      type: "DEBT_RECOVERED",
      playerId: settlement.playerId,
      creditorId: settlement.creditorId,
      amountDue: settlement.amountDue,
      refundTotal,
      remainingCash: cashBeforePayment - settlement.amountDue,
      liquidatedAssetIds: Object.freeze([...settlement.liquidatedAssetIds]),
    }),
  ];

  return freezeValue({
    players: nextPlayers,
    boardState: {
      ...boardState,
      properties,
    },
    events,
  });
}
