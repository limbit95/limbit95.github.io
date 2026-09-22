import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const bootstrapSource = readFileSync(new URL("../js/marbleBootstrap.js", import.meta.url), "utf8");
const playWindowSource = readFileSync(new URL("../js/playWindow.js", import.meta.url), "utf8");
const twoDControllerSource = readFileSync(new URL("../js/onlineGameController2d.js", import.meta.url), "utf8");
const controllerSource = readFileSync(new URL("../js/onlineGameController.js", import.meta.url), "utf8");
const sessionSource = readFileSync(new URL("../js/onlineSession.js", import.meta.url), "utf8");
const tradeUiSource = readFileSync(new URL("../js/onlineTradeUi.js", import.meta.url), "utf8");
const liquidationUiSource = readFileSync(new URL("../js/onlineLiquidationUi.js", import.meta.url), "utf8");
const presenceSource = readFileSync(new URL("../js/onlinePresenceHud.js", import.meta.url), "utf8");
const diceStageLazySource = readFileSync(new URL("../js/diceStageOnlineLazy.js", import.meta.url), "utf8");
const moneyRendererSource = readFileSync(new URL("../js/renderer/threeClassicMoneyPresentation.js", import.meta.url), "utf8");
const performanceEntrySource = readFileSync(new URL("../js/renderer/threeClassicPerformanceEntry.js", import.meta.url), "utf8");
const costEntrySource = readFileSync(new URL("../js/renderer/threeClassicCostPresentationEntry.js", import.meta.url), "utf8");
const diagnosticsSource = readFileSync(new URL("../js/renderer/threeClassicPrototypeDiagnostics.js", import.meta.url), "utf8");

test("online Marble boot entry bypasses stale Pages module caches", () => {
  assert.match(indexHtml, /data-marble-build="20260922-r3"/);
  assert.match(indexHtml, /marbleBootstrap\.js\?v=20260922-r3/);
  assert.match(indexHtml, /money-presentation\.css\?v=20260917-r1/);
  assert.match(indexHtml, /toll-loss-layout-polish\.css\?v=20260917-r1/);
  assert.match(indexHtml, /auction-ui\.css\?v=20260922-r1/);
  assert.doesNotMatch(indexHtml, /coin-motion-polish\.css/);
  assert.match(indexHtml, /start-salary-celebration\.css\?v=20260912-r1/);
  assert.match(indexHtml, /presentation-timing\.css\?v=20260916-r2/);
  assert.match(indexHtml, /"\.\/js\/diceStage\.js": "\.\/js\/diceStageOnlineLazy\.js\?v=20260912-r13"/);
  assert.match(indexHtml, /"\.\/js\/onlinePlayRoute\.js": "\.\/js\/onlinePlayRoute\.js\?v=20260911-r11"/);
  assert.match(bootstrapSource, /multiplayerLobby\.js\?v=20260914-r8/);
  assert.match(bootstrapSource, /playWindow\.js\?v=20260922-r3/);
  assert.match(playWindowSource, /ONLINE_BOOT_REVISION = "20260922-r3"/);
  assert.match(playWindowSource, /onlineGameApi\.js/);
  assert.match(playWindowSource, /onlineGameController\.js/);
  assert.match(playWindowSource, /url\.searchParams\.set\("v", ONLINE_BOOT_REVISION\)/);
  assert.match(diceStageLazySource, /diceStage\.js\?implementation=20260911-r12/);
  assert.match(diceStageLazySource, /presentationFoundation\.js\?v=20260912-r13/);
});

test("online recovery and Classic renderer entries bypass stale modules while untouched imports stay pinned", () => {
  assert.match(indexHtml, /"\.\/js\/onlineSession\.js\?v=20260910-r8": "\.\/js\/onlineSession\.js\?v=20260915-r1"/);
  assert.match(controllerSource, /onlineStartup\.js\?v=20260910-r8/);
  assert.match(controllerSource, /onlineSession\.js\?v=20260919-r13/);
  assert.match(twoDControllerSource, /onlineSession\.js\?v=20260919-r13/);
  assert.match(tradeUiSource, /onlineSession\.js\?v=20260919-r13/);
  
  assert.match(liquidationUiSource, /onlineSession\.js\?v=20260919-r13/);
  
  assert.match(controllerSource, /onlinePresenceHud\.js\?v=20260910-r8/);
  assert.match(sessionSource, /onlineGameApi\.js\?v=20260919-r13/);
  assert.match(presenceSource, /onlineGameApi\.js\?v=20260910-r8/);
  assert.equal((sessionSource.match(/onlineGameApi\.js\?v=20260919-r13/g) ?? []).length, 1);

  assert.match(indexHtml, /diceStageOnlineLazy\.js\?v=20260912-r13/);
  assert.match(indexHtml, /onlineStartupVisualBoundary\.js\?v=20260910-r10/);
  assert.match(indexHtml, /threeClassicCostPresentationEntry\.js\?v=20260917-r12/);
  assert.match(indexHtml, /threeClassicPrototypeDiagnostics\.js\?v=20260912-r13\": \"\.\/js\/renderer\/threeClassicPrototypeDiagnostics\.js\?v=20260915-r1/);
  assert.match(indexHtml, /moneyPresentation\.js\?v=20260912-r21\": \"\.\/js\/presentation\/startSalaryMoneyPresentation\.js\?v=20260916-r1/);
  assert.match(indexHtml, /threeClassicMoneyPresentation\.js\?v=20260915-r1\": \"\.\/js\/renderer\/threeClassicMoneyPresentation\.js\?v=20260917-r2/);
  assert.match(costEntrySource, /threeClassicPerformanceEntry\.js\?v=20260917-r8-base/);
  assert.match(costEntrySource, /installFinalCostGuard/);
  assert.match(performanceEntrySource, /threeClassicPrototypeDiagnostics\.js\?v=20260915-r1/);
  assert.match(performanceEntrySource, /threeClassicPresentationTiming\.js\?v=20260916-r1/);
  assert.match(diagnosticsSource, /threeClassicPrototype\.js\?implementation=20260915-r1/);
  assert.match(moneyRendererSource, /MODAL_LANDING_TILE_TYPES = new Set\(\["BONUS", "REST"\]\)/);
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