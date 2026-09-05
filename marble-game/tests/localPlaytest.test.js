import test from "node:test";
import assert from "node:assert/strict";

import { GAME_STATUS } from "../js/core/gameEngine.js";
import { TURN_PHASES } from "../js/core/turnMachine.js";
import { createLocalClassicSession } from "../js/localPlaytest.js";

test("local Classic session can start, buy a property, and advance turn", () => {
  const values = [0, 0.2];
  let index = 0;
  const session = createLocalClassicSession({ random: () => values[index++ % values.length] });

  let state = session.start();
  assert.equal(state.status, GAME_STATUS.PLAYING);
  assert.equal(state.phase, TURN_PHASES.WAITING_ROLL);
  assert.equal(state.currentPlayerIndex, 0);

  state = session.roll();
  assert.equal(state.lastRoll.total, 3);
  assert.equal(state.players[0].positionNodeId, "singapore");
  assert.equal(state.pendingChoice.type, "BUY_PROPERTY");

  state = session.buy();
  assert.equal(state.boardState.properties.singapore.ownerId, "player-a");
  assert.equal(state.phase, TURN_PHASES.TURN_END);

  state = session.endTurn();
  assert.equal(state.currentPlayerIndex, 1);
  assert.equal(state.phase, TURN_PHASES.WAITING_ROLL);
});
