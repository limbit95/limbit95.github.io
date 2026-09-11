import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  createAnimationDirector,
  createAnimationQueue,
} from "../js/presentation/presentationFoundation.js";

const controllerSource = readFileSync(new URL("../js/onlineGameController.js", import.meta.url), "utf8");
const rendererSource = readFileSync(new URL("../js/renderer/threeClassicPrototype.js", import.meta.url), "utf8");
const diagnosticsSource = readFileSync(new URL("../js/renderer/threeClassicPrototypeDiagnostics.js", import.meta.url), "utf8");

test("animation queue runs presentation tasks serially", async () => {
  const steps = [];
  let releaseFirst;
  const queue = createAnimationQueue();

  const first = queue.enqueue(async () => {
    steps.push("first:start");
    await new Promise((resolve) => { releaseFirst = resolve; });
    steps.push("first:end");
  });
  const second = queue.enqueue(async () => {
    steps.push("second");
  });

  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(steps, ["first:start"]);
  assert.equal(queue.size, 2);

  releaseFirst();
  await Promise.all([first, second]);
  assert.deepEqual(steps, ["first:start", "first:end", "second"]);
  assert.equal(queue.size, 0);
});

test("animation queue isolates failed presentation tasks", async () => {
  const errors = [];
  const steps = [];
  const queue = createAnimationQueue({
    onTaskError(error, metadata) {
      errors.push([error.message, metadata.eventType]);
    },
  });

  queue.enqueue(() => {
    throw new Error("MOVE_PRESENTATION_FAILED");
  }, { eventType: "PLAYER_MOVED" });
  queue.enqueue(() => {
    steps.push("after-failure");
  }, { eventType: "TILE_LANDED" });

  await queue.drain();
  assert.deepEqual(errors, [["MOVE_PRESENTATION_FAILED", "PLAYER_MOVED"]]);
  assert.deepEqual(steps, ["after-failure"]);
});

test("animation director maps only registered semantic events", async () => {
  const calls = [];
  const director = createAnimationDirector({
    presenters: {
      PLAYER_MOVED(event, context) {
        calls.push([event.playerId, context.stateVersion]);
      },
    },
  });

  assert.equal(director.handles("PLAYER_MOVED"), true);
  assert.equal(director.handles("DICE_ROLLED"), false);
  const task = director.createTask(
    { type: "PLAYER_MOVED", playerId: "p1" },
    { stateVersion: 7 },
  );
  assert.equal(typeof task, "function");
  await task();
  assert.deepEqual(calls, [["p1", 7]]);
  assert.equal(director.createTask({ type: "DICE_ROLLED" }), null);
});

test("Classic PLAYER_MOVED uses the presentation foundation without changing movement timing", () => {
  assert.match(diagnosticsSource, /createAnimationDirector/);
  assert.match(diagnosticsSource, /createAnimationQueue/);
  assert.match(diagnosticsSource, /PLAYER_MOVED/);
  assert.match(diagnosticsSource, /presentationQueue\.enqueue/);
  assert.match(rendererSource, /for \(const nodeId of event\.path\)/);
  assert.match(rendererSource, /tweenToken\(token, destination, reducedMotion \? 0 : 165\)/);
});

test("online snapshot and stale-version replay guards remain authoritative", () => {
  assert.match(controllerSource, /if \(state\.version <= lastAnimatedVersion\)/);
  assert.match(controllerSource, /lastAnimatedVersion = state\.version;/);
  assert.match(controllerSource, /threeRenderer\?\.renderState\(state\);/);
  assert.match(controllerSource, /renderUi\(state, \{ renderThree: !animate \}\);/);
});
