import test from "node:test";
import assert from "node:assert/strict";

import {
  ONLINE_VISUAL_MODES,
  resolveOnlineVisualMode,
  shouldDeferOnlineDiceRenderer,
  shouldStartOnlineDiceRenderer,
  shouldStartOnlineMainRenderer,
  shouldStartOwnershipRenderer,
} from "../js/onlineVisualPolicy.js";
import { runOptionalEnhancement } from "../js/onlineStartupVisualBoundary.js";
import { createClassicThreePrototypeRenderer } from "../js/renderer/threeClassicPrototypeDiagnostics.js";
import { createThreeDiceStage } from "../js/diceStageOnlineLazy.js";

function context(search = "?onlineRoom=room-1") {
  return {
    documentObject: { body: { dataset: { sessionMode: "online" } } },
    locationObject: { search },
  };
}

function quietConsole() {
  return { info() {}, warn() {}, error() {} };
}

test("online visual modes isolate WebGL startup without changing local Classic defaults", () => {
  const onlineDefault = context();
  const online2d = context("?onlineRoom=room-1&marbleVisuals=2d");
  const onlineFull = context("?onlineRoom=room-1&marbleVisuals=full");
  const local = {
    documentObject: { body: { dataset: { sessionMode: "local" } } },
    locationObject: { search: "?play=classic" },
  };

  assert.equal(resolveOnlineVisualMode(onlineDefault), ONLINE_VISUAL_MODES.MAIN);
  assert.equal(resolveOnlineVisualMode(online2d), ONLINE_VISUAL_MODES.TWO_D);
  assert.equal(resolveOnlineVisualMode(onlineFull), ONLINE_VISUAL_MODES.FULL);
  assert.equal(resolveOnlineVisualMode(local), ONLINE_VISUAL_MODES.FULL);

  assert.equal(shouldStartOnlineMainRenderer(online2d), false);
  assert.equal(shouldStartOwnershipRenderer(onlineDefault), false);
  assert.equal(shouldStartOwnershipRenderer(onlineFull), true);
  assert.equal(shouldStartOwnershipRenderer(local), true);
  assert.equal(shouldDeferOnlineDiceRenderer(onlineDefault), true);
  assert.equal(shouldStartOnlineDiceRenderer(online2d), false);
  assert.equal(shouldStartOnlineDiceRenderer(onlineDefault), true);
});

test("online main renderer waits through two animation frames so the 2D state can paint first", async () => {
  const frames = [];
  const timers = new Map();
  let nextTimer = 1;
  let taskRan = false;
  const { documentObject, locationObject } = context();
  const windowObject = {
    requestAnimationFrame(callback) {
      frames.push(callback);
      return frames.length;
    },
    setTimeout(callback) {
      const id = nextTimer++;
      timers.set(id, callback);
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
  };
  let now = 0;
  const performanceObject = { now: () => ++now };

  const resultPromise = runOptionalEnhancement(async () => {
    taskRan = true;
    return "mounted";
  }, {
    timeoutCode: "ONLINE_RENDERER_TIMEOUT",
    windowObject,
    documentObject,
    locationObject,
    performanceObject,
    consoleObject: quietConsole(),
  });

  await Promise.resolve();
  assert.equal(taskRan, false);
  assert.equal(frames.length, 1);

  frames.shift()(1);
  await Promise.resolve();
  assert.equal(taskRan, false);
  assert.equal(frames.length, 1);

  frames.shift()(2);
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(await resultPromise, "mounted");
  assert.equal(taskRan, true);
  assert.equal(documentObject.body.dataset.onlinePaintReady, "true");
  assert.equal(documentObject.body.dataset.onlineVisualMode, "main");
  assert.equal(timers.size, 0);
});

test("2D diagnostic mode never invokes the main renderer task", async () => {
  const { documentObject, locationObject } = context("?onlineRoom=room-1&marbleVisuals=2d");
  let taskCalls = 0;
  let failure = null;
  const windowObject = {
    setTimeout() { return 1; },
    clearTimeout() {},
  };

  const result = await runOptionalEnhancement(async () => {
    taskCalls += 1;
    return "unexpected";
  }, {
    timeoutCode: "ONLINE_RENDERER_TIMEOUT",
    windowObject,
    documentObject,
    locationObject,
    consoleObject: quietConsole(),
    onFailed(error) { failure = error; },
  });

  assert.equal(result, null);
  assert.equal(taskCalls, 0);
  assert.match(String(failure?.message), /ONLINE_RENDERER_DIAGNOSTIC_DISABLED/);
  assert.equal(documentObject.body.dataset.onlineVisualMode, "2d");
});

test("online dice mount is deferred until a real roll and is fully disabled in 2D mode", async () => {
  const defaultContext = context();
  let replacementCalls = 0;
  const defaultTarget = {
    dataset: {},
    replaceChildren() { replacementCalls += 1; },
  };
  const defaultStage = createThreeDiceStage({
    ...defaultContext,
    consoleObject: quietConsole(),
  });

  await defaultStage.mount(defaultTarget);
  assert.equal(replacementCalls, 0);
  assert.equal(defaultContext.documentObject.body.dataset.onlineDiceRenderer, "deferred");
  assert.equal(defaultTarget.dataset.rendererState, "deferred");
  await defaultStage.playRoll([1, 6]);
  assert.equal(replacementCalls, 1);
  assert.equal(defaultContext.documentObject.body.dataset.onlineDiceRenderer, "ready");
  defaultStage.dispose();

  const twoDContext = context("?onlineRoom=room-1&marbleVisuals=2d");
  let twoDReplacementCalls = 0;
  const twoDTarget = {
    dataset: {},
    replaceChildren() { twoDReplacementCalls += 1; },
  };
  const twoDStage = createThreeDiceStage({
    ...twoDContext,
    consoleObject: quietConsole(),
  });
  await twoDStage.mount(twoDTarget);
  await twoDStage.playRoll([2, 5]);
  assert.equal(twoDReplacementCalls, 0);
  assert.equal(twoDContext.documentObject.body.dataset.onlineDiceRenderer, "disabled");
  twoDStage.dispose();
});

test("renderer diagnostics isolate Three import, WebGL mount, synchronous board build, and first paint", async () => {
  const { documentObject, locationObject } = context();
  const frames = [];
  const logs = [];
  let now = 0;
  const performanceObject = { now: () => ++now };
  const consoleObject = { info(message, payload) { logs.push({ message, payload }); } };
  const target = { dataset: {} };
  let threeImports = 0;
  const renderer = createClassicThreePrototypeRenderer({}, {
    documentObject,
    locationObject,
    windowObject: {
      requestAnimationFrame(callback) {
        frames.push(callback);
        return frames.length;
      },
    },
    performanceObject,
    consoleObject,
    async loadThree() { threeImports += 1; return {}; },
  });

  await renderer.mount(target);
  const firstState = { version: 1 };
  renderer.renderState(firstState);
  const secondState = { version: 2 };
  renderer.renderState(secondState);

  assert.equal(threeImports, 1);
  assert.equal(target.dataset.baseMounted, "true");
  assert.equal(firstState.rendered, true);
  assert.equal(secondState.rendered, true);
  assert.equal(frames.length, 1);
  assert.ok(Number(documentObject.body.dataset.onlineInitialRenderMs) >= 0);

  const steps = logs.map((entry) => entry.message);
  for (const expected of [
    "renderer-created",
    "mount-start",
    "three-import-ready",
    "webgl-ready",
    "mount-ready",
    "render-state-start",
    "build-board-start",
    "build-board-ready",
    "render-state-ready",
  ]) {
    assert.ok(steps.some((step) => step.includes(expected)), `missing ${expected}`);
  }
  assert.equal(steps.filter((step) => step.includes("build-board-start")).length, 1);
  assert.equal(steps.some((step) => step.includes("first-frame-ready")), false);

  frames.shift()(80);
  assert.equal(logs.some((entry) => entry.message.includes("first-frame-ready")), true);
});
