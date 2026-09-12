import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const bootstrapSource = readFileSync(new URL("../js/marbleBootstrap.js", import.meta.url), "utf8");
const playWindowSource = readFileSync(new URL("../js/playWindow.js", import.meta.url), "utf8");
const twoDControllerSource = readFileSync(new URL("../js/onlineGameController2d.js", import.meta.url), "utf8");
const controllerSource = readFileSync(new URL("../js/onlineGameController.js", import.meta.url), "utf8");
const sessionSource = readFileSync(new URL("../js/onlineSession.js", import.meta.url), "utf8");
const presenceSource = readFileSync(new URL("../js/onlinePresenceHud.js", import.meta.url), "utf8");
const diceStageLazySource = readFileSync(new URL("../js/diceStageOnlineLazy.js", import.meta.url), "utf8");
const moneyRendererSource = readFileSync(new URL("../js/renderer/threeClassicMoneyPresentation.js", import.meta.url), "utf8");

test("online Marble boot entry bypasses stale Pages module caches", () => {
  assert.match(indexHtml, /data-marble-build="20260910-r10"/);
  assert.match(indexHtml, /marbleBootstrap\.js\?v=20260910-r10/);
  assert.match(indexHtml, /money-presentation\.css\?v=20260912-r19/);
  assert.match(indexHtml, /start-salary-celebration\.css\?v=20260912-r1/);
  assert.match(indexHtml, /"\.\/js\/diceStage\.js": "\.\/js\/diceStageOnlineLazy\.js\?v=20260912-r13"/);
  assert.match(indexHtml, /"\.\/js\/onlinePlayRoute\.js": "\.\/js\/onlinePlayRoute\.js\?v=20260911-r11"/);
  assert.match(bootstrapSource, /playWindow\.js\?v=20260910-r10/);
  assert.match(playWindowSource, /ONLINE_BOOT_REVISION = "20260910-r10"/);
  assert.match(playWindowSource, /onlineGameApi\.js/);
  assert.match(playWindowSource, /onlineGameController\.js/);
  assert.match(playWindowSource, /url\.searchParams\.set\("v", ONLINE_BOOT_REVISION\)/);
  assert.match(diceStageLazySource, /diceStage\.js\?implementation=20260911-r12/);
  assert.match(diceStageLazySource, /presentationFoundation\.js\?v=20260912-r13/);
});

test("online recovery session bypasses stale modules while untouched core imports stay pinned", () => {
  assert.match(indexHtml, /"\.\/js\/onlineSession\.js\?v=20260910-r8": "\.\/js\/onlineSession\.js\?v=20260910-r9"/);
  assert.match(controllerSource, /onlineStartup\.js\?v=20260910-r8/);
  assert.match(controllerSource, /onlineSession\.js\?v=20260910-r8/);
  assert.match(twoDControllerSource, /onlineSession\.js\?v=20260910-r8/);
  assert.match(controllerSource, /onlinePresenceHud\.js\?v=20260910-r8/);
  assert.match(sessionSource, /onlineGameApi\.js\?v=20260910-r9/);
  assert.match(presenceSource, /onlineGameApi\.js\?v=20260910-r8/);
  assert.equal((sessionSource.match(/onlineGameApi\.js\?v=20260910-r9/g) ?? []).length, 1);

  assert.match(indexHtml, /diceStageOnlineLazy\.js\?v=20260912-r13/);
  assert.match(indexHtml, /onlineStartupVisualBoundary\.js\?v=20260910-r10/);
  assert.match(indexHtml, /threeClassicMoneyPresentation\.js\?v=20260912-r21/);
  assert.match(indexHtml, /moneyPresentation\.js\?v=20260912-r21\": \"\.\/js\/presentation\/startSalaryMoneyPresentation\.js\?v=20260912-r24/);
  assert.match(moneyRendererSource, /threeClassicPrototypeDiagnostics\.js\?v=20260912-r13/);
  assert.match(moneyRendererSource, /moneyPresentation\.js\?v=20260912-r21/);
  assert.match(moneyRendererSource, /tileInfo\.js\?v=20260912-r21/);
  assert.match(bootstrapSource, /ownershipVisualLoader\.js\?v=20260910-r10/);
});

test("online Marble boot probes snapshot before loading the controller", () => {
  const snapshotIndex = playWindowSource.indexOf("apiModule.getOnlineGameSnapshot(onlineRoomId)");
  const controllerIndex = playWindowSource.indexOf("getOnlineControllerPath(window.location.href)");
  assert.ok(snapshotIndex >= 0);
  assert.ok(controllerIndex > snapshotIndex);
  assert.match(playWindowSource, /ONLINE_BOOT_TIMEOUT_MS = 8000/);
  assert.match(playWindowSource, /서버 게임 상태 응답이 지연되고 있습니다/);
  assert.match(playWindowSource, /현재 계정이 이 게임의 참가자로 확인되지 않습니다/);
});

test("2D diagnostic boot uses a dedicated controller with no renderer, dice, ownership or presence imports", () => {
  assert.match(playWindowSource, /onlineGameController2d\.js/);
  assert.match(bootstrapSource, /mode === "online-2d"/);
  assert.doesNotMatch(twoDControllerSource, /three/i);
  assert.doesNotMatch(twoDControllerSource, /diceStage/);
  assert.doesNotMatch(twoDControllerSource, /ownershipVisual/);
  assert.doesNotMatch(twoDControllerSource, /onlinePresenceHud/);
  assert.match(twoDControllerSource, /onlineRenderer = "disabled"/);
  assert.match(twoDControllerSource, /onlineDiceRenderer = "disabled"/);
});
