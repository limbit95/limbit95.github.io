import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  createAnimationDirector,
  createAnimationQueue,
  getSharedAnimationQueue,
} from "../js/presentation/presentationFoundation.js";
import {
  isMarbleOverlayMotionActive,
} from "../js/presentation/renderRuntimePolicy.js?v=20260914-r2";

const controllerSource = readFileSync(new URL("../js/onlineGameController.js", import.meta.url), "utf8");
const rendererSource = readFileSync(new URL("../js/renderer/threeClassicPrototype.js", import.meta.url), "utf8");
const diagnosticsSource = readFileSync(new URL("../js/renderer/threeClassicPrototypeDiagnostics.js", import.meta.url), "utf8");
const diceStageLazySource = readFileSync(new URL("../js/diceStageOnlineLazy.js", import.meta.url), "utf8");

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

test("overlay presentation tasks own and release the shared GPU budget", async () => {
  const queue = createAnimationQueue();
  let overlayDuringDice = false;
  let overlayDuringMove = true;

  await queue.enqueue(async () => {
    overlayDuringDice = isMarbleOverlayMotionActive();
  }, { eventType: "DICE_ROLLED" });
  assert.equal(overlayDuringDice, true);
  assert.equal(isMarbleOverlayMotionActive(), false);

  await queue.enqueue(async () => {
    overlayDuringMove = isMarbleOverlayMotionActive();
  }, { eventType: "PLAYER_MOVED" });
  assert.equal(overlayDuringMove, false);
  assert.equal(isMarbleOverlayMotionActive(), false);
});

test("animation queue isolates failed presentation tasks and releases GPU ownership", async () => {
  const errors = [];
  const steps = [];
  const queue = createAnimationQueue({
    onTaskError(error, metadata) {
      errors.push([error.message, metadata.eventType]);
    },
  });

  queue.enqueue(() => {
    assert.equal(isMarbleOverlayMotionActive(), true);
    throw new Error("DICE_PRESENTATION_FAILED");
  }, { eventType: "DICE_ROLLED" });
  queue.enqueue(() => {
    steps.push("after-failure");
  }, { eventType: "TILE_LANDED" });

  await queue.drain();
  assert.deepEqual(errors, [["DICE_PRESENTATION_FAILED", "DICE_ROLLED"]]);
  assert.deepEqual(steps, ["after-failure"]);
  assert.equal(isMarbleOverlayMotionActive(), false);
});

test("animation queue supports task-specific error isolation on a shared queue", async () => {
  const errors = [];
  const queue = getSharedAnimationQueue("test-task-errors");
  await queue.enqueue(() => {
    throw new Error("DICE_PRESENTATION_FAILED");
  }, {
    eventType: "DICE_ROLLED",
    onTaskError(error, metadata) {
      errors.push([error.message, metadata.eventType]);
    },
  });
  assert.deepEqual(errors, [["DICE_PRESENTATION_FAILED", "DICE_ROLLED"]]);
  assert.equal(isMarbleOverlayMotionActive(), false);
});

test("shared animation queues reuse the same named runtime", () => {
  const first = getSharedAnimationQueue("classic-online-test");
  const second = getSharedAnimationQueue("classic-online-test");
  const other = getSharedAnimationQueue("other-test");
  assert.equal(first, second);
  assert.notEqual(first, other);
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

test("Classic dice and movement use the shared presentation queue without changing motion profiles", () => {
  assert.match(diagnosticsSource, /getSharedAnimationQueue\("classic-online"\)/);
  assert.match(diagnosticsSource, /PLAYER_MOVED/);
  assert.match(diagnosticsSource, /presentationQueue\.enqueue/);
  assert.match(diagnosticsSource, /motionMaxRenderPixels: 1_100_000/);
  assert.match(diceStageLazySource, /getSharedAnimationQueue\("classic-online"\)/);
  assert.match(diceStageLazySource, /DICE_ROLLED/);
  assert.match(diceStageLazySource, /beginMarbleOverlayMotion\(\)/);
  assert.match(diceStageLazySource, /stage\.playRoll\(event\.dice, event\.rollOptions\)/);
  assert.match(diceStageLazySource, /diceStage\.js\?implementation=20260911-r12/);
  assert.match(rendererSource, /for \(const nodeId of event\.path\)/);
  assert.match(rendererSource, /tweenToken\(token, destination, reducedMotion \? 0 : 165\)/);
});

test("online snapshot and stale-version replay guards remain authoritative", () => {
  assert.match(controllerSource, /if \(state\.version <= lastAnimatedVersion\)/);
  assert.match(controllerSource, /lastAnimatedVersion = state\.version;/);
  assert.match(controllerSource, /threeRenderer\?\.renderState\(state\);/);
  assert.match(controllerSource, /renderUi\(state, \{ renderThree: !animate \}\);/);
});
