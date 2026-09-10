import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { runOptionalEnhancement, withOnlineStartupTimeout } from "../js/onlineStartup.js";

const controllerSource = readFileSync(new URL("../js/onlineGameController.js", import.meta.url), "utf8");
const playWindowSource = readFileSync(new URL("../js/playWindow.js", import.meta.url), "utf8");

test("online game renders authoritative state before starting optional 3D visuals", () => {
  const sessionIndex = controllerSource.indexOf("session = await withOnlineStartupTimeout(createOnlineClassicSession");
  const renderIndex = controllerSource.indexOf("renderUi(state, { renderThree: false })", sessionIndex);
  const rendererIndex = controllerSource.indexOf("void ensureRenderer();", renderIndex);
  const diceIndex = controllerSource.indexOf("void ensureDiceStage();", renderIndex);

  assert.ok(sessionIndex >= 0);
  assert.ok(renderIndex > sessionIndex);
  assert.ok(rendererIndex > renderIndex);
  assert.ok(diceIndex > renderIndex);
  assert.match(controllerSource, /let threeRendererInit = null/);
  assert.match(controllerSource, /let diceStageInit = null/);
});

test("pending and rejected renderers degrade without rejecting the game startup", async () => {
  const callbacks = [];
  const fakeWindow = {
    setTimeout(callback) {
      queueMicrotask(callback);
      return 1;
    },
    clearTimeout() {},
  };

  const pendingResult = await runOptionalEnhancement(() => new Promise(() => {}), {
    timeoutMs: 1,
    timeoutCode: "RENDERER_TIMEOUT",
    windowObject: fakeWindow,
    onFailed: (error) => callbacks.push(error.message),
  });
  const rejectedResult = await runOptionalEnhancement(() => Promise.reject(new Error("WEBGL_FAILED")), {
    windowObject: {
      setTimeout() { return 2; },
      clearTimeout() {},
    },
    onFailed: (error) => callbacks.push(error.message),
  });

  assert.equal(pendingResult, null);
  assert.equal(rejectedResult, null);
  assert.deepEqual(callbacks, ["RENDERER_TIMEOUT", "WEBGL_FAILED"]);
});

test("optional renderer readiness is reported independently", async () => {
  let readyValue = null;
  const timers = new Map();
  let timerId = 0;
  const fakeWindow = {
    setTimeout(callback) {
      const id = ++timerId;
      timers.set(id, callback);
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
  };
  const renderer = { mounted: true };
  const result = await runOptionalEnhancement(() => Promise.resolve(renderer), {
    windowObject: fakeWindow,
    onReady: (value) => { readyValue = value; },
  });
  assert.equal(result, renderer);
  assert.equal(readyValue, renderer);
  assert.equal(timers.size, 0);
});

test("bootstrap snapshot creates a usable session without a duplicate snapshot RPC", async () => {
  const originalWindow = globalThis.window;
  const listeners = new Map();
  globalThis.window = {
    setTimeout() { return 1; },
    clearTimeout() {},
    addEventListener(type, listener) { listeners.set(type, listener); },
    removeEventListener(type) { listeners.delete(type); },
  };
  let snapshotCalls = 0;
  const { createOnlineClassicSession } = await import("../js/onlineSession.js");
  const snapshot = {
    room: { id: "room-1" },
    game: {
      id: "game-1",
      status: "PLAYING",
      phase: "WAITING_ROLL",
      currentSeat: 0,
      turn: 1,
      version: 3,
    },
    viewerPlayerId: "player-a",
    players: [
      { id: "player-a", userId: "user-a", name: "A", seat: 0, positionNodeId: "start", money: 2000000 },
      { id: "player-b", userId: "user-b", name: "B", seat: 1, positionNodeId: "start", money: 2000000 },
    ],
    properties: {},
  };

  try {
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: snapshot,
      api: {
        async getSnapshot() { snapshotCalls += 1; return snapshot; },
        subscribeGame(_roomId, { onStatus }) {
          onStatus("SUBSCRIBED");
          return () => {};
        },
      },
    });
    assert.equal(snapshotCalls, 0);
    assert.equal(session.getState().players.length, 2);
    assert.equal(session.getState().version, 3);
    assert.equal(session.getViewerPlayerId(), "player-a");
    session.dispose();

    const degradedSession = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: snapshot,
      api: {
        async getSnapshot() { snapshotCalls += 1; return snapshot; },
        subscribeGame() { throw new Error("REALTIME_UNAVAILABLE"); },
      },
    });
    assert.equal(degradedSession.getState().version, 3);
    assert.equal(snapshotCalls, 0);
    degradedSession.dispose();
  } finally {
    globalThis.window = originalWindow;
  }
});

test("the authoritative snapshot remains the only required session boundary", async () => {
  const originalWindow = globalThis.window;
  globalThis.window = globalThis.window ?? {};
  const { createOnlineClassicSession } = await import("../js/onlineSession.js");
  await assert.rejects(
    createOnlineClassicSession({
      roomId: "room-1",
      api: {
        getSnapshot: async () => { throw new Error("SNAPSHOT_FAILED"); },
      },
    }),
    /SNAPSHOT_FAILED/,
  );
  globalThis.window = originalWindow;
});

test("online startup timeout prevents an endless initial loading state", async () => {
  const timers = new Map();
  let nextTimer = 1;
  const fakeWindow = {
    setTimeout(callback) {
      const id = nextTimer++;
      timers.set(id, callback);
      queueMicrotask(callback);
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
  };

  await assert.rejects(
    withOnlineStartupTimeout(new Promise(() => {}), 1, { windowObject: fakeWindow }),
    /ONLINE_GAME_LOAD_TIMEOUT/,
  );
});

test("play window surfaces versioned online controller loading failures", () => {
  assert.match(playWindowSource, /versionedModuleUrl\("\.\/onlineGameController\.js"\)/);
  assert.match(playWindowSource, /"ONLINE_CONTROLLER_MODULE"/);
  assert.match(playWindowSource, /게임 화면 모듈 연결이 지연되고 있습니다/);
  assert.match(playWindowSource, /document\.body\.dataset\.onlineBootStage = "failed"/);
});
