import test from "node:test";
import assert from "node:assert/strict";

import { ACTION_TYPES, createAction } from "../js/core/actions.js";
import { createInitialGameState, GAME_STATUS, reduceGameAction } from "../js/core/gameEngine.js";
import { reducePhase7LiquidationGameAction } from "../js/core/liquidationGameEngine.js";
import { DEBT_RECOVERY_STATUS } from "../js/core/liquidation.js";
import { TURN_PHASES } from "../js/core/turnMachine.js";

function action(type, playerId = null, payload = {}) {
  return createAction({ type, playerId, payload });
}

function start() {
  return reducePhase7LiquidationGameAction(
    createInitialGameState({ players: ["a", "b"] }),
    action(ACTION_TYPES.START_GAME),
  );
}

function preparePlayerBTurn({
  money = 10,
  ownedAssetId = "london",
  ownedBuildingLevel = 0,
  eventCursor = 0,
} = {}) {
  const state = start();
  const players = Object.freeze([
    state.players[0],
    Object.freeze({
      ...state.players[1],
      money,
      positionNodeId: "start",
    }),
  ]);
  const properties = {
    ...state.boardState.properties,
    singapore: Object.freeze({ ownerId: "a", buildingLevel: 0 }),
  };
  if (ownedAssetId) {
    properties[ownedAssetId] = Object.freeze({
      ownerId: "b",
      buildingLevel: ownedBuildingLevel,
    });
  }

  return Object.freeze({
    ...state,
    phase: TURN_PHASES.WAITING_ROLL,
    currentPlayerIndex: 1,
    turn: 2,
    players,
    boardState: Object.freeze({
      properties: Object.freeze(properties),
    }),
    themeState: Object.freeze({ eventCursor }),
    pendingChoice: null,
    lastEvents: Object.freeze([]),
  });
}

function roll(state, dice) {
  return reducePhase7LiquidationGameAction(
    state,
    action(ACTION_TYPES.ROLL_DICE, "b", { dice }),
  );
}

test("Phase 7C wrapper opens debt recovery instead of immediate toll bankruptcy when recovery is possible", () => {
  const before = preparePlayerBTurn();
  const beforeVersion = before.version;
  const state = roll(before, [1, 2]);

  assert.equal(state.version, beforeVersion + 1);
  assert.equal(state.phase, TURN_PHASES.WAITING_CHOICE);
  assert.equal(state.pendingChoice.type, "DEBT_RECOVERY");
  assert.equal(state.pendingChoice.lifecycle.status, DEBT_RECOVERY_STATUS.OPEN);
  assert.equal(state.pendingChoice.lifecycle.debtCase.playerId, "b");
  assert.equal(state.pendingChoice.lifecycle.debtCase.amountDue, 30);
  assert.equal(state.pendingChoice.lifecycle.debtCase.creditorId, "a");
  assert.equal(state.pendingChoice.lifecycle.debtCase.shortfall, 20);
  assert.equal(state.players[1].bankrupt, false);
  assert.equal(state.players[1].money, 10);
  assert.equal(state.boardState.properties.london.ownerId, "b");
  assert.deepEqual(
    state.lastEvents.slice(-2).map((event) => event.type),
    ["DEBT_PAYMENT_REQUIRED", "DEBT_RECOVERY_OPENED"],
  );
});

test("legacy base reducer still keeps immediate bankruptcy semantics without Phase 7C opt-in", () => {
  const before = preparePlayerBTurn({ ownedAssetId: null });
  const state = reduceGameAction(
    before,
    action(ACTION_TYPES.ROLL_DICE, "b", { dice: [1, 2] }),
  );

  assert.equal(state.players[1].bankrupt, true);
  assert.equal(state.status, GAME_STATUS.FINISHED);
  assert.equal(state.winnerPlayerId, "a");
});

test("debt recovery selection becomes ready and confirm liquidates property then pays toll", () => {
  let state = roll(preparePlayerBTurn(), [1, 2]);

  state = reducePhase7LiquidationGameAction(
    state,
    action(ACTION_TYPES.LIQUIDATION_SELECT, "b", { assetIds: ["london"] }),
  );
  assert.equal(state.pendingChoice.lifecycle.status, DEBT_RECOVERY_STATUS.READY);
  assert.equal(state.pendingChoice.lifecycle.plan.refundTotal, 200);
  assert.equal(state.pendingChoice.lifecycle.plan.remainingShortfall, 0);

  state = reducePhase7LiquidationGameAction(
    state,
    action(ACTION_TYPES.LIQUIDATION_CONFIRM, "b"),
  );

  assert.equal(state.phase, TURN_PHASES.TURN_END);
  assert.equal(state.pendingChoice, null);
  assert.equal(state.players[0].money, 1530);
  assert.equal(state.players[1].money, 180);
  assert.deepEqual(state.boardState.properties.london, {
    ownerId: null,
    buildingLevel: 0,
  });
  assert.deepEqual(state.lastEvents.map((event) => event.type), [
    "PROPERTY_LIQUIDATED",
    "MONEY_PAID",
    "DEBT_RECOVERED",
  ]);
});

test("debt recovery blocks normal game actions and non-debtor selection", () => {
  const state = roll(preparePlayerBTurn(), [1, 2]);

  assert.throws(
    () => reducePhase7LiquidationGameAction(
      state,
      action(ACTION_TYPES.END_TURN, "b"),
    ),
    /Debt recovery must be resolved/i,
  );

  assert.throws(
    () => reducePhase7LiquidationGameAction(
      state,
      action(ACTION_TYPES.LIQUIDATION_SELECT, "a", { assetIds: ["london"] }),
    ),
    /must be resolved by the debtor/i,
  );
});

test("insufficient selection remains open and cannot be confirmed", () => {
  const prepared = preparePlayerBTurn({
    ownedAssetId: "tokyo",
    money: 1,
  });
  let state = roll(prepared, [1, 2]);

  // Tokyo refund is 120, so use a manually lower-value selection scenario by
  // raising the toll through the creditor property building level.
  const higherTollState = Object.freeze({
    ...prepared,
    boardState: Object.freeze({
      properties: Object.freeze({
        ...prepared.boardState.properties,
        singapore: Object.freeze({ ownerId: "a", buildingLevel: 3 }),
      }),
    }),
  });
  state = roll(higherTollState, [1, 2]);
  assert.equal(state.pendingChoice.lifecycle.debtCase.amountDue, 210);

  state = reducePhase7LiquidationGameAction(
    state,
    action(ACTION_TYPES.LIQUIDATION_SELECT, "b", { assetIds: ["tokyo"] }),
  );
  assert.equal(state.pendingChoice.lifecycle.status, DEBT_RECOVERY_STATUS.OPEN);
  assert.equal(state.pendingChoice.lifecycle.plan.remainingShortfall, 89);

  assert.throws(
    () => reducePhase7LiquidationGameAction(
      state,
      action(ACTION_TYPES.LIQUIDATION_CONFIRM, "b"),
    ),
    /selected assets cover the debt/i,
  );
});

test("unrecoverable debt falls back to existing bankruptcy behavior", () => {
  const state = roll(preparePlayerBTurn({ ownedAssetId: null }), [1, 2]);

  assert.equal(state.pendingChoice, null);
  assert.equal(state.players[1].bankrupt, true);
  assert.equal(state.status, GAME_STATUS.FINISHED);
  assert.equal(state.winnerPlayerId, "a");
  assert.equal(state.boardState.properties.singapore.ownerId, "a");
  assert.equal(state.lastEvents.some((event) => event.type === "PLAYER_BANKRUPT"), true);
  assert.equal(state.lastEvents.some((event) => event.type === "DEBT_RECOVERY_OPENED"), false);
});

test("bank TAX debt opens recovery and confirmation removes payment from circulation", () => {
  let state = roll(preparePlayerBTurn(), [2, 3]);

  assert.equal(state.pendingChoice.lifecycle.debtCase.reason, "TAX");
  assert.equal(state.pendingChoice.lifecycle.debtCase.creditorId, null);
  assert.equal(state.pendingChoice.lifecycle.debtCase.amountDue, 120);

  state = reducePhase7LiquidationGameAction(
    state,
    action(ACTION_TYPES.LIQUIDATION_SELECT, "b", { assetIds: ["london"] }),
  );
  state = reducePhase7LiquidationGameAction(
    state,
    action(ACTION_TYPES.LIQUIDATION_CONFIRM, "b"),
  );

  assert.equal(state.players[0].money, 1500);
  assert.equal(state.players[1].money, 90);
  assert.equal(state.lastEvents.find((event) => event.type === "MONEY_PAID").creditorId, null);
});

test("EVENT tax debt also enters the same recovery lifecycle", () => {
  let state = roll(preparePlayerBTurn({ eventCursor: 1 }), [1, 1]);

  assert.equal(state.pendingChoice.type, "DEBT_RECOVERY");
  assert.equal(state.pendingChoice.lifecycle.debtCase.reason, "EVENT");
  assert.equal(state.pendingChoice.lifecycle.debtCase.amountDue, 90);
  assert.equal(state.pendingChoice.lifecycle.debtCase.creditorId, null);
  assert.equal(state.themeState.eventCursor, 2);
  assert.equal(state.lastEvents.some((event) => event.type === "EVENT_DRAWN"), true);
});
