import test from "node:test";
import assert from "node:assert/strict";

import { ACTION_TYPES, createAction } from "../js/core/actions.js";
import { rollDice } from "../js/core/dice.js";
import { createInitialGameState, GAME_STATUS, reduceGameAction } from "../js/core/gameEngine.js";
import { moveAlongBoard } from "../js/core/movement.js";
import { TURN_PHASES } from "../js/core/turnMachine.js";

function start(players = ["a", "b"]) {
  return reduceGameAction(createInitialGameState({ players }), createAction({ type: ACTION_TYPES.START_GAME }));
}
function roll(state, playerId, dice) {
  return reduceGameAction(state, createAction({ type: ACTION_TYPES.ROLL_DICE, playerId, payload: { dice } }));
}
function endTurn(state, playerId) {
  return reduceGameAction(state, createAction({ type: ACTION_TYPES.END_TURN, playerId }));
}

test("dice helper produces two bounded dice", () => {
  const values = [0, 0.999];
  let index = 0;
  assert.deepEqual(rollDice(() => values[index++]).dice, [1, 6]);
});

test("Classic movement records a renderer-friendly path and salary when passing start", () => {
  const initial = createInitialGameState({ players: ["a", "b"] });
  const movement = moveAlongBoard(initial.board, "vancouver", 3);
  assert.deepEqual(movement.path, ["honolulu", "start", "tokyo"]);
  assert.equal(movement.passedStartCount, 1);
});

test("landing on an unowned property opens a purchase choice", () => {
  let state = roll(start(), "a", [1, 1]);
  assert.equal(state.players[0].positionNodeId, "event-east");
  assert.equal(state.phase, TURN_PHASES.TURN_END);
  state = endTurn(state, "a");
  state = roll(state, "b", [1, 2]);
  assert.equal(state.players[1].positionNodeId, "singapore");
  assert.equal(state.phase, TURN_PHASES.WAITING_CHOICE);
  assert.equal(state.pendingChoice.type, "BUY_PROPERTY");
});

test("buying a property deducts money and records ownership", () => {
  let state = roll(start(), "a", [1, 2]);
  const before = state.players[0].money;
  const price = state.pendingChoice.price;
  state = reduceGameAction(state, createAction({ type: ACTION_TYPES.BUY_TILE, playerId: "a" }));
  assert.equal(state.boardState.properties.singapore.ownerId, "a");
  assert.equal(state.players[0].money, before - price);
  assert.equal(state.phase, TURN_PHASES.TURN_END);
});

test("building action upgrades owned property and charges build cost", () => {
  let state = roll(start(), "a", [1, 2]);
  state = reduceGameAction(state, createAction({ type: ACTION_TYPES.BUY_TILE, playerId: "a" }));
  state = endTurn(state, "a");
  state = roll(state, "b", [1, 1]);
  state = endTurn(state, "b");
  const prepared = {
    ...state,
    phase: TURN_PHASES.WAITING_CHOICE,
    currentPlayerIndex: 0,
    pendingChoice: Object.freeze({ type: "BUILD_PROPERTY", nodeId: "singapore", cost: 130 }),
    boardState: { properties: { ...state.boardState.properties, singapore: Object.freeze({ ownerId: "a", buildingLevel: 0 }) } },
  };
  const money = prepared.players[0].money;
  const built = reduceGameAction(prepared, createAction({ type: ACTION_TYPES.BUILD, playerId: "a" }));
  assert.equal(built.boardState.properties.singapore.buildingLevel, 1);
  assert.equal(built.players[0].money, money - 130);
});

test("opponent landing on owned property pays toll", () => {
  let state = roll(start(), "a", [1, 2]);
  state = reduceGameAction(state, createAction({ type: ACTION_TYPES.BUY_TILE, playerId: "a" }));
  state = endTurn(state, "a");
  state = roll(state, "b", [1, 2]);
  assert.equal(state.players[0].money, 1500 - 260 + 30);
  assert.equal(state.players[1].money, 1500 - 30);
  assert.equal(state.phase, TURN_PHASES.TURN_END);
});

test("special event cards rotate deterministically", () => {
  const state = roll(start(), "a", [1, 1]);
  assert.equal(state.players[0].money, 1620);
  assert.equal(state.themeState.eventCursor, 1);
  assert.equal(state.lastEvents.some((event) => event.type === "EVENT_DRAWN"), true);
});

test("rest tile causes the next turn to be skipped", () => {
  let state = roll(start(), "a", [4, 4]);
  assert.equal(state.players[0].skipTurns, 1);
  state = endTurn(state, "a");
  state = roll(state, "b", [1, 1]);
  state = endTurn(state, "b");
  assert.equal(state.currentPlayerIndex, 1);
  assert.equal(state.players[0].skipTurns, 0);
  assert.equal(state.lastEvents.some((event) => event.type === "TURN_SKIPPED"), true);
});

test("insolvent toll payment bankrupts player and ends a two-player game", () => {
  let state = roll(start(), "a", [1, 2]);
  state = reduceGameAction(state, createAction({ type: ACTION_TYPES.BUY_TILE, playerId: "a" }));
  state = endTurn(state, "a");
  state = Object.freeze({ ...state, players: Object.freeze([state.players[0], Object.freeze({ ...state.players[1], money: 10 })]) });
  state = roll(state, "b", [1, 2]);
  assert.equal(state.players[1].bankrupt, true);
  assert.equal(state.status, GAME_STATUS.FINISHED);
  assert.equal(state.winnerPlayerId, "a");
  assert.equal(state.phase, TURN_PHASES.FINISHED);
});
