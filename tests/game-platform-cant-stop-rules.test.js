import assert from "node:assert/strict";
import { test } from "node:test";

import {
  CANT_STOP_COLUMN_HEIGHTS,
  CANT_STOP_PHASE,
  applyPairingChoice,
  continueTurn,
  createInitialGameState,
  enumeratePairings,
  getLegalMovePlans,
  resolveRoll,
  stopTurn,
} from "../games/cant-stop/rules.js";

function gameState() {
  return createInitialGameState({
    playerIds: ["alice", "bob", "cara"],
    turnOrder: ["bob", "cara", "alice"],
  });
}

function activePlayer(state) {
  return state.players.find((player) => player.id === state.activePlayerId);
}

test("Can't Stop initial state uses the server-selected turn order without local randomness", () => {
  const state = gameState();
  assert.deepEqual(state.turnOrder, ["bob", "cara", "alice"]);
  assert.equal(state.activePlayerId, "bob");
  assert.equal(state.phase, CANT_STOP_PHASE.TURN_ROLL);
});

test("Can't Stop four dice produce three canonical pairings and remove duplicates", () => {
  assert.deepEqual(enumeratePairings([1, 2, 3, 4]), [
    [3, 7],
    [4, 6],
    [5, 5],
  ]);
  assert.deepEqual(enumeratePairings([1, 1, 1, 1]), [[2, 2]]);
});

test("Can't Stop pairing advances both sums when both moves are legal", () => {
  assert.deepEqual(getLegalMovePlans(gameState(), [6, 8]), [[6, 8]]);
});

test("Can't Stop same-sum pairing advances the same runner twice when possible", () => {
  const rolled = resolveRoll(gameState(), [3, 4, 3, 4]);
  const pairing = rolled.legalPairings.find((candidate) =>
    candidate.sums[0] === 7 && candidate.sums[1] === 7);

  assert.deepEqual(pairing.plans, [[7, 7]]);

  const moved = applyPairingChoice(rolled, { sums: [7, 7], columns: [7, 7] });
  assert.equal(moved.runners[7], 2);
});

test("Can't Stop same-sum pairing uses one move when the second step would exceed the top", () => {
  const state = gameState();
  activePlayer(state).progress[7] = CANT_STOP_COLUMN_HEIGHTS[7] - 1;
  assert.deepEqual(getLegalMovePlans(state, [7, 7]), [[7]]);
});

test("Can't Stop exposes alternative one-step plans when one neutral runner slot remains", () => {
  const state = gameState();
  state.runners = { 2: 1, 3: 1 };
  assert.deepEqual(getLegalMovePlans(state, [4, 5]), [[4], [5]]);
});

test("Can't Stop moves an existing runner but cannot open a fourth runner column", () => {
  const state = gameState();
  state.runners = { 2: 1, 3: 1, 4: 1 };
  assert.deepEqual(getLegalMovePlans(state, [2, 5]), [[2]]);
});

test("Can't Stop claimed columns cannot receive runners", () => {
  const state = gameState();
  state.claimedColumns[7] = "alice";
  assert.deepEqual(getLegalMovePlans(state, [7, 7]), []);
});

test("Can't Stop legal roll and pairing choice preserve temporary progress across another roll", () => {
  const state = gameState();
  const before = structuredClone(state);
  const rolled = resolveRoll(state, [1, 2, 3, 4]);

  assert.deepEqual(state, before);
  assert.equal(rolled.phase, CANT_STOP_PHASE.PAIRING_SELECTION);
  assert.deepEqual(rolled.latestDice, [1, 2, 3, 4]);

  const moved = applyPairingChoice(rolled, { sums: [3, 7], columns: [3, 7] });
  assert.deepEqual(moved.runners, { 3: 1, 7: 1 });
  assert.equal(moved.phase, CANT_STOP_PHASE.PUSH_OR_STOP);

  const continued = continueTurn(moved);
  assert.equal(continued.phase, CANT_STOP_PHASE.TURN_ROLL);
  assert.deepEqual(continued.runners, { 3: 1, 7: 1 });
  assert.equal(continued.latestDice, null);
});

test("Can't Stop bust discards temporary runners and keeps permanent progress", () => {
  const state = gameState();
  activePlayer(state).progress[6] = 4;
  state.runners = {
    2: CANT_STOP_COLUMN_HEIGHTS[2],
    3: CANT_STOP_COLUMN_HEIGHTS[3],
    4: CANT_STOP_COLUMN_HEIGHTS[4],
  };

  const busted = resolveRoll(state, [3, 3, 4, 4]);
  assert.equal(busted.activePlayerId, "cara");
  assert.equal(busted.phase, CANT_STOP_PHASE.TURN_ROLL);
  assert.deepEqual(busted.runners, {});
  assert.equal(busted.players.find((player) => player.id === "bob").progress[6], 4);
});

test("Can't Stop stopping commits runner progress and advances to the next player", () => {
  const state = gameState();
  state.phase = CANT_STOP_PHASE.PUSH_OR_STOP;
  state.runners = { 6: 5, 8: 3 };

  const stopped = stopTurn(state);
  const bob = stopped.players.find((player) => player.id === "bob");
  assert.deepEqual(bob.progress, { 6: 5, 8: 3 });
  assert.equal(stopped.activePlayerId, "cara");
  assert.deepEqual(stopped.runners, {});
});

test("Can't Stop stopping at the top claims a column and clears opponents' progress", () => {
  const state = gameState();
  state.phase = CANT_STOP_PHASE.PUSH_OR_STOP;
  state.runners = { 2: CANT_STOP_COLUMN_HEIGHTS[2] };
  state.players.find((player) => player.id === "alice").progress[2] = 2;
  state.players.find((player) => player.id === "cara").progress[2] = 1;

  const stopped = stopTurn(state);
  assert.equal(stopped.claimedColumns[2], "bob");
  assert.equal(stopped.players.find((player) => player.id === "alice").progress[2], undefined);
  assert.equal(stopped.players.find((player) => player.id === "cara").progress[2], undefined);
  assert.equal(stopped.players.find((player) => player.id === "bob").progress[2], 3);
});

test("Can't Stop claiming a third column ends the game without advancing the turn", () => {
  const state = gameState();
  state.phase = CANT_STOP_PHASE.PUSH_OR_STOP;
  state.claimedColumns = { 2: "bob", 3: "bob" };
  state.runners = { 4: CANT_STOP_COLUMN_HEIGHTS[4] };

  const stopped = stopTurn(state);
  assert.equal(stopped.phase, CANT_STOP_PHASE.GAME_OVER);
  assert.equal(stopped.winnerId, "bob");
  assert.equal(stopped.activePlayerId, "bob");
});
