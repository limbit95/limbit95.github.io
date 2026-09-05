import test from "node:test";
import assert from "node:assert/strict";

import { createAction, ACTION_TYPES } from "../js/core/actions.js";
import { createBoardGraph } from "../js/core/boardGraph.js";
import { createInitialGameState, GAME_STATUS, reduceGameAction } from "../js/core/gameEngine.js";
import { TURN_PHASES, canTransitionPhase, transitionPhase } from "../js/core/turnMachine.js";
import { getTheme, listThemes } from "../js/themes/themeRegistry.js";
import { createRendererContract } from "../js/renderer/rendererContract.js";

test("theme registry exposes the four planned worlds", () => {
  assert.deepEqual(listThemes().map((theme) => theme.id), ["classic", "space", "ocean", "fantasy"]);
  assert.equal(getTheme("classic").engineReady, true);
  assert.equal(getTheme("classic").playable, true);
  assert.equal(getTheme("space").playable, false);
  assert.equal(getTheme("missing"), null);
});

test("board graph supports directed and bidirectional routes", () => {
  const graph = createBoardGraph({
    startNodeId: "a",
    nodes: [{ id: "a" }, { id: "b" }, { id: "c" }],
    edges: [
      { id: "ab", from: "a", to: "b" },
      { id: "bc", from: "b", to: "c", bidirectional: true },
    ],
  });
  assert.deepEqual(graph.getNeighbors("a").map((route) => route.nodeId), ["b"]);
  assert.deepEqual(graph.getNeighbors("b").map((route) => route.nodeId), ["c"]);
  assert.deepEqual(graph.getNeighbors("c").map((route) => route.nodeId), ["b"]);
});

test("board graph rejects invalid route references", () => {
  assert.throws(() => createBoardGraph({ startNodeId: "a", nodes: [{ id: "a" }], edges: [{ from: "a", to: "missing" }] }), /unknown node/i);
});

test("turn state machine supports skipped turns without opening roll", () => {
  assert.equal(canTransitionPhase(TURN_PHASES.TURN_START, TURN_PHASES.TURN_END), true);
  assert.equal(canTransitionPhase(TURN_PHASES.SETUP, TURN_PHASES.MOVING), false);
  assert.equal(transitionPhase(TURN_PHASES.TURN_END, TURN_PHASES.TURN_START), TURN_PHASES.TURN_START);
  assert.throws(() => transitionPhase(TURN_PHASES.WAITING_ROLL, TURN_PHASES.TURN_END), /Invalid turn phase transition/);
});

test("initial Classic state includes economy and ownership state", () => {
  const state = createInitialGameState({ players: ["a", "b"] });
  assert.equal(state.status, GAME_STATUS.SETUP);
  assert.equal(state.players[0].money, 1500);
  assert.equal(state.players[0].positionNodeId, "start");
  assert.equal(state.board.nodes.length, 20);
  assert.equal(state.boardState.properties.tokyo.ownerId, null);
  assert.equal(state.version, 0);
});

test("START_GAME opens the first roll phase", () => {
  const state = createInitialGameState({ players: ["a", "b"] });
  const started = reduceGameAction(state, createAction({ type: ACTION_TYPES.START_GAME }));
  assert.equal(started.status, GAME_STATUS.PLAYING);
  assert.equal(started.phase, TURN_PHASES.WAITING_ROLL);
  assert.equal(started.turn, 1);
  assert.equal(started.currentPlayerIndex, 0);
});

test("advanced actions remain explicitly blocked", () => {
  const state = reduceGameAction(createInitialGameState({ players: ["a", "b"] }), createAction({ type: ACTION_TYPES.START_GAME }));
  assert.throws(() => reduceGameAction(state, createAction({ type: ACTION_TYPES.TRADE_OFFER, playerId: "a" })), /reserved for a later Marble phase/);
});

test("renderer contract keeps rendering concerns outside the engine", () => {
  const calls = [];
  const renderer = createRendererContract({
    mount(target) { calls.push(["mount", target]); },
    renderState(state) { calls.push(["render", state.version]); },
    playEvent(event) { calls.push(["event", event.type]); },
    dispose() { calls.push(["dispose"]); },
  });
  renderer.mount("canvas");
  renderer.renderState({ version: 2 });
  renderer.playEvent({ type: "MOVE" });
  renderer.dispose();
  assert.deepEqual(calls, [["mount", "canvas"], ["render", 2], ["event", "MOVE"], ["dispose"]]);
});
