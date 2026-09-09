import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { withOnlineStartupTimeout } from "../js/onlineStartup.js";

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
