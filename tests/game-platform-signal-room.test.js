import test from "node:test";
import assert from "node:assert/strict";

import { getRegisteredGame } from "../games/shared/registry.js";
import {
  SYNC_HOLD_MS,
  PLAYER_DEFINITIONS,
  PLATE_DEFINITIONS,
  EXTRACTION_ZONE,
  createInitialRunState,
  computePlateOccupancy,
  countExtractedPlayers,
  updateObjectiveState,
  formatElapsed,
} from "../games/signal-room/runtimeModel.js";

test("Signal Room registry exposes only the implemented local capability", () => {
  const game = getRegisteredGame("signal-room");
  assert.ok(game);
  assert.equal(game.platform, "shared");
  assert.equal(game.href, "./games/signal-room/");
  assert.deepEqual(game.capabilities, {
    online: false,
    local: true,
    invite: false,
    presence: false,
  });
});

test("Signal Room starts in sync phase", () => {
  const state = createInitialRunState(1000);
  assert.equal(state.phase, "sync");
  assert.equal(state.coreUnlocked, false);
  assert.equal(state.syncProgressMs, 0);
  assert.equal(state.startedAt, 1000);
});

test("matching players activate all four signal plates", () => {
  const players = PLAYER_DEFINITIONS.map((player, index) => ({
    ...player,
    x: PLATE_DEFINITIONS[index].x,
    y: PLATE_DEFINITIONS[index].y,
    radius: 22,
  }));
  assert.deepEqual(computePlateOccupancy(players), [true, true, true, true]);
});

test("continuous full sync unlocks extraction", () => {
  const next = updateObjectiveState(createInitialRunState(0), {
    deltaMs: SYNC_HOLD_MS,
    allPlatesActive: true,
    extractedCount: 0,
    now: SYNC_HOLD_MS,
  });
  assert.equal(next.phase, "extraction");
  assert.equal(next.coreUnlocked, true);
  assert.equal(next.syncProgressMs, SYNC_HOLD_MS);
});

test("all four players inside extraction clear the run", () => {
  const players = PLAYER_DEFINITIONS.map((player, index) => ({
    ...player,
    x: EXTRACTION_ZONE.x + 45 + index * 45,
    y: EXTRACTION_ZONE.y + EXTRACTION_ZONE.height / 2,
    radius: 10,
  }));
  assert.equal(countExtractedPlayers(players), 4);
  const state = {
    ...createInitialRunState(0),
    phase: "extraction",
    coreUnlocked: true,
    syncProgressMs: SYNC_HOLD_MS,
  };
  const cleared = updateObjectiveState(state, {
    deltaMs: 16,
    allPlatesActive: false,
    extractedCount: 4,
    now: 9000,
  });
  assert.equal(cleared.phase, "cleared");
  assert.equal(cleared.endedAt, 9000);
});

test("Signal Room elapsed time formatting stays compact", () => {
  assert.equal(formatElapsed(0), "00:00.0");
  assert.equal(formatElapsed(65432), "01:05.4");
});
