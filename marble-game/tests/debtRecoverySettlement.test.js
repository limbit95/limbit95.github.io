import test from "node:test";
import assert from "node:assert/strict";

import {
  createDebtRecoveryCase,
  createLiquidationCatalog,
} from "../js/core/liquidation.js";
import {
  confirmDebtRecovery,
  createDebtRecoveryLifecycle,
  selectDebtRecoveryAssets,
} from "../js/core/debtRecoveryLifecycle.js";
import {
  settleConfirmedDebtRecovery,
} from "../js/core/debtRecoverySettlement.js";

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

function confirmedLifecycle({
  creditorId = "b",
  reason = "TOLL",
  selectedAssetIds = ["seoul"],
  refunds = [
    { assetId: "singapore", refund: 70 },
    { assetId: "seoul", refund: 180 },
  ],
} = {}) {
  const debtCase = createDebtRecoveryCase({
    playerId: "a",
    amountDue: 200,
    creditorId,
    reason,
    players: players(),
    boardState: boardState(),
  });
  const catalog = createLiquidationCatalog(debtCase, refunds);
  let lifecycle = createDebtRecoveryLifecycle({ debtCase, catalog });
  lifecycle = selectDebtRecoveryAssets(lifecycle, selectedAssetIds);
  return confirmDebtRecovery(lifecycle);
}

test("confirmed debt recovery releases selected property and pays creditor atomically", () => {
  const result = settleConfirmedDebtRecovery({
    lifecycle: confirmedLifecycle(),
    players: players(),
    boardState: boardState(),
  });

  assert.equal(result.players.find((player) => player.id === "a").money, 70);
  assert.equal(result.players.find((player) => player.id === "b").money, 700);
  assert.deepEqual(result.boardState.properties.seoul, {
    ownerId: null,
    buildingLevel: 0,
  });
  assert.deepEqual(result.boardState.properties.singapore, {
    ownerId: "a",
    buildingLevel: 0,
  });
  assert.deepEqual(result.events.map((event) => event.type), [
    "PROPERTY_LIQUIDATED",
    "MONEY_PAID",
    "DEBT_RECOVERED",
  ]);
  assert.equal(result.events[0].refund, 180);
  assert.equal(result.events[0].buildingLevel, 2);
  assert.equal(result.events[1].creditorId, "b");
  assert.equal(result.events[2].remainingCash, 70);
});

test("bank debt removes payment from circulation when creditor is null", () => {
  const result = settleConfirmedDebtRecovery({
    lifecycle: confirmedLifecycle({
      creditorId: null,
      reason: "TAX",
    }),
    players: players(),
    boardState: boardState(),
  });

  assert.equal(result.players.find((player) => player.id === "a").money, 70);
  assert.equal(result.players.find((player) => player.id === "b").money, 500);
  assert.equal(result.events.find((event) => event.type === "MONEY_PAID").creditorId, null);
});

test("settlement revalidates debtor cash before releasing assets", () => {
  assert.throws(
    () => settleConfirmedDebtRecovery({
      lifecycle: confirmedLifecycle(),
      players: players({ a: { money: 91 } }),
      boardState: boardState(),
    }),
    /debtor cash changed/i,
  );
});

test("settlement revalidates property ownership and building level", () => {
  assert.throws(
    () => settleConfirmedDebtRecovery({
      lifecycle: confirmedLifecycle(),
      players: players(),
      boardState: boardState({
        properties: {
          seoul: { ownerId: "c", buildingLevel: 2 },
        },
      }),
    }),
    /ownership changed/i,
  );

  assert.throws(
    () => settleConfirmedDebtRecovery({
      lifecycle: confirmedLifecycle(),
      players: players(),
      boardState: boardState({
        properties: {
          seoul: { ownerId: "a", buildingLevel: 1 },
        },
      }),
    }),
    /building level changed/i,
  );
});

test("settlement revalidates creditor activity", () => {
  assert.throws(
    () => settleConfirmedDebtRecovery({
      lifecycle: confirmedLifecycle(),
      players: players({ b: { bankrupt: true } }),
      boardState: boardState(),
    }),
    /Bankrupt debt recovery creditor/i,
  );
});

test("settlement rejects stale refund catalog drift", () => {
  const lifecycle = confirmedLifecycle();
  const drifted = {
    ...lifecycle,
    catalog: lifecycle.catalog.map((asset) => (
      asset.assetId === "seoul" ? { ...asset, refund: asset.refund + 1 } : asset
    )),
  };

  assert.throws(
    () => settleConfirmedDebtRecovery({
      lifecycle: drifted,
      players: players(),
      boardState: boardState(),
    }),
    /refund total changed/i,
  );
});

test("settlement requires confirmed lifecycle", () => {
  const debtCase = createDebtRecoveryCase({
    playerId: "a",
    amountDue: 200,
    creditorId: "b",
    reason: "TOLL",
    players: players(),
    boardState: boardState(),
  });
  const catalog = createLiquidationCatalog(debtCase, [
    { assetId: "singapore", refund: 70 },
    { assetId: "seoul", refund: 180 },
  ]);
  const lifecycle = createDebtRecoveryLifecycle({ debtCase, catalog });

  assert.throws(
    () => settleConfirmedDebtRecovery({
      lifecycle,
      players: players(),
      boardState: boardState(),
    }),
    /Confirmed debt recovery lifecycle is required/i,
  );
});

test("settlement does not mutate original players or board state", () => {
  const originalPlayers = players();
  const originalBoardState = boardState();

  settleConfirmedDebtRecovery({
    lifecycle: confirmedLifecycle(),
    players: originalPlayers,
    boardState: originalBoardState,
  });

  assert.equal(originalPlayers[0].money, 90);
  assert.equal(originalPlayers[1].money, 500);
  assert.deepEqual(originalBoardState.properties.seoul, {
    ownerId: "a",
    buildingLevel: 2,
  });
});
