import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const playWindowSource = readFileSync(new URL("../js/playWindow.js", import.meta.url), "utf8");

test("online Marble boot entry bypasses stale Pages module caches", () => {
  assert.match(indexHtml, /data-marble-build="20260910-r7"/);
  assert.match(indexHtml, /playWindow\.js\?v=20260910-r7/);
  assert.match(playWindowSource, /ONLINE_BOOT_REVISION = "20260910-r7"/);
  assert.match(playWindowSource, /onlineGameApi\.js/);
  assert.match(playWindowSource, /onlineGameController\.js/);
  assert.match(playWindowSource, /url\.searchParams\.set\("v", ONLINE_BOOT_REVISION\)/);
});

test("online Marble boot probes snapshot before loading the controller", () => {
  const snapshotIndex = playWindowSource.indexOf("apiModule.getOnlineGameSnapshot(onlineRoomId)");
  const controllerIndex = playWindowSource.indexOf('versionedModuleUrl("./onlineGameController.js")');
  assert.ok(snapshotIndex >= 0);
  assert.ok(controllerIndex > snapshotIndex);
  assert.match(playWindowSource, /ONLINE_BOOT_TIMEOUT_MS = 8000/);
  assert.match(playWindowSource, /서버 게임 상태 응답이 지연되고 있습니다/);
  assert.match(playWindowSource, /현재 계정이 이 게임의 참가자로 확인되지 않습니다/);
});
