import test from "node:test";
import assert from "node:assert/strict";

import { ACTION_TYPES, createAction } from "../js/core/actions.js";
import { createInitialGameState } from "../js/core/gameEngine.js";
import { reducePhase7TradingGameAction } from "../js/core/tradeGameEngine.js";
import { TURN_PHASES } from "../js/core/turnMachine.js";

function dispatch(state, type, playerId = null, payload = {}) {
  return reducePhase7TradingGameAction(
    state,
    createAction({ type, playerId, payload }),
  );
}

function start(players = ["a", "b", "c"]) {
  return dispatch(
    createInitialGameState({ players }),
    ACTION_TYPES.START_GAME,
  );
}

function withProperties(state, patches) {
  const properties = { ...state.boardState.properties };
  for (const [propertyId, patch] of Object.entries(patches)) {
    properties[propertyId] = Object.freeze({
      ...properties[propertyId],
      ...patch,
    });
  }
  return Object.freeze({
    ...state,
    boardState: Object.freeze({
      ...state.boardState,
      properties: Object.freeze(properties),
    }),
  });
}

function openTrade(state, {
  proposerPlayerId = "a",
  recipientPlayerId = "b",
  offerId = "trade-1",
  terms = {
    offered: { propertyIds: ["singapore"], gold: 100 },
    requested: { propertyIds: ["seoul"], gold: 50 },
  },
} = {}) {
  return dispatch(state, ACTION_TYPES.TRADE_OFFER, proposerPlayerId, {
    offerId,
    recipientPlayerId,
    terms,
  });
}

test("current player can open one trade before rolling without changing turn phase", () => {
  let state = start();
  state = withProperties(state, {
    singapore: { ownerId: "a", buildingLevel: 0 },
    seoul: { ownerId: "b", buildingLevel: 0 },
  });

  state = openTrade(state);

  assert.equal(state.phase, TURN_PHASES.WAITING_ROLL);
  assert.equal(state.currentPlayerIndex, 0);
  assert.equal(state.pendingTrade.status, "OPEN");
  assert.equal(state.pendingTrade.proposerPlayerId, "a");
  assert.equal(state.pendingTrade.recipientPlayerId, "b");
  assert.equal(state.lastEvents[0].type, "TRADE_OFFERED");
});

test("trade offer is limited to current player before rolling", () => {
  let state = start();
  state = withProperties(state, {
    singapore: { ownerId: "a", buildingLevel: 0 },
  });

  assert.throws(
    () => openTrade(state, {
      proposerPlayerId: "b",
      terms: { offered: { gold: 100 } },
    }),
    /current player/i,
  );

  state = dispatch(state, ACTION_TYPES.ROLL_DICE, "a", { dice: [1, 2] });
  assert.throws(
    () => openTrade(state, {
      terms: { offered: { gold: 100 } },
    }),
    /only allowed during WAITING_ROLL/i,
  );
});

test("recipient acceptance settles property and gold while preserving the current turn", () => {
  let state = start();
  state = withProperties(state, {
    singapore: { ownerId: "a", buildingLevel: 0 },
    seoul: { ownerId: "b", buildingLevel: 0 },
  });

  state = openTrade(state);
  const versionBeforeAccept = state.version;
  state = dispatch(state, ACTION_TYPES.TRADE_ACCEPT, "b");

  assert.equal(state.version, versionBeforeAccept + 1);
  assert.equal(state.phase, TURN_PHASES.WAITING_ROLL);
  assert.equal(state.currentPlayerIndex, 0);
  assert.equal(state.pendingTrade, null);
  assert.equal(state.players.find((player) => player.id === "a").money, 1450);
  assert.equal(state.players.find((player) => player.id === "b").money, 1550);
  assert.equal(state.boardState.properties.singapore.ownerId, "b");
  assert.equal(state.boardState.properties.seoul.ownerId, "a");
  assert.deepEqual(state.lastEvents.map((event) => event.type), [
    "TRADE_ACCEPTED",
    "TRADE_SETTLED",
  ]);
});

test("recipient rejection clears the proposal without changing assets or turn", () => {
  let state = start();
  state = withProperties(state, {
    singapore: { ownerId: "a", buildingLevel: 0 },
  });
  const beforeMoney = state.players.map((player) => player.money);

  state = openTrade(state, {
    terms: { offered: { propertyIds: ["singapore"] } },
  });
  state = dispatch(state, ACTION_TYPES.TRADE_REJECT, "b");

  assert.equal(state.pendingTrade, null);
  assert.equal(state.phase, TURN_PHASES.WAITING_ROLL);
  assert.equal(state.currentPlayerIndex, 0);
  assert.deepEqual(state.players.map((player) => player.money), beforeMoney);
  assert.equal(state.boardState.properties.singapore.ownerId, "a");
  assert.deepEqual(state.lastEvents.map((event) => event.type), ["TRADE_REJECTED"]);
});

test("open trade blocks normal game actions and a second offer until resolved", () => {
  let state = start();
  state = withProperties(state, {
    singapore: { ownerId: "a", buildingLevel: 0 },
  });
  state = openTrade(state, {
    terms: { offered: { propertyIds: ["singapore"] } },
  });

  assert.throws(
    () => dispatch(state, ACTION_TYPES.ROLL_DICE, "a", { dice: [1, 2] }),
    /must be resolved before continuing/i,
  );
  assert.throws(
    () => openTrade(state, {
      recipientPlayerId: "c",
      offerId: "trade-2",
      terms: { offered: { gold: 50 } },
    }),
    /must be resolved before continuing/i,
  );

  state = dispatch(state, ACTION_TYPES.TRADE_REJECT, "b");
  state = dispatch(state, ACTION_TYPES.ROLL_DICE, "a", { dice: [1, 2] });
  assert.equal(state.pendingTrade, null);
  assert.notEqual(state.phase, TURN_PHASES.WAITING_ROLL);
});

test("trade offer validates current ownership, balance and improved-property boundary", () => {
  let state = start();
  state = withProperties(state, {
    singapore: { ownerId: "b", buildingLevel: 0 },
    tokyo: { ownerId: "a", buildingLevel: 1 },
  });

  assert.throws(
    () => openTrade(state, {
      terms: { offered: { propertyIds: ["singapore"] } },
    }),
    /does not own property/i,
  );
  assert.throws(
    () => openTrade(state, {
      terms: { offered: { gold: 2000 } },
    }),
    /cannot afford offered gold/i,
  );
  assert.throws(
    () => openTrade(state, {
      terms: { offered: { propertyIds: ["tokyo"] } },
    }),
    /Improved property cannot be traded yet/i,
  );
});

test("acceptance revalidates stale ownership instead of trusting the original offer", () => {
  let state = start();
  state = withProperties(state, {
    singapore: { ownerId: "a", buildingLevel: 0 },
  });
  state = openTrade(state, {
    terms: { offered: { propertyIds: ["singapore"] } },
  });

  state = withProperties(state, {
    singapore: { ownerId: "c", buildingLevel: 0 },
  });

  assert.throws(
    () => dispatch(state, ACTION_TYPES.TRADE_ACCEPT, "b"),
    /does not own property/i,
  );
});

test("Phase 7A auction flow still delegates through the trading reducer", () => {
  let state = start(["a", "b"]);
  state = dispatch(state, ACTION_TYPES.ROLL_DICE, "a", { dice: [1, 2] });
  assert.equal(state.pendingChoice.type, "BUY_PROPERTY");

  state = dispatch(state, ACTION_TYPES.END_TURN, "a");
  assert.equal(state.phase, TURN_PHASES.WAITING_CHOICE);
  assert.equal(state.pendingChoice.type, "AUCTION_REQUEST");
});
