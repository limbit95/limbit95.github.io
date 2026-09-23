import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const originalWindow = globalThis.window;
globalThis.window = globalThis.window ?? {};
const { createOnlineLiquidationUiModel } = await import("../js/onlineLiquidationUi.js");
globalThis.window = originalWindow;

const uiSource = readFileSync(new URL("../js/onlineLiquidationUi.js", import.meta.url), "utf8");
const playWindowSource = readFileSync(new URL("../js/playWindow.js", import.meta.url), "utf8");
const cssSource = readFileSync(new URL("../css/liquidation-ui.css", import.meta.url), "utf8");

function state(overrides = {}) {
  return {
    status: "PLAYING",
    phase: "WAITING_CHOICE",
    currentPlayerIndex: 0,
    players: [
      { id: "p1", name: "A", seat: 0, money: 80, bankrupt: false },
      { id: "p2", name: "B", seat: 1, money: 1500, bankrupt: false },
      { id: "p3", name: "C", seat: 2, money: 1200, bankrupt: false },
    ],
    board: {
      nodes: [
        { id: "singapore", label: "싱가포르", type: "PROPERTY" },
        { id: "seoul", label: "서울", type: "PROPERTY" },
      ],
    },
    pendingChoice: {
      type: "DEBT_RECOVERY",
      status: "OPEN",
      playerId: "p1",
      creditorId: "p2",
      reason: "TOLL",
      amountDue: 300,
      cash: 80,
      shortfall: 220,
      catalog: [
        { assetId: "singapore", refund: 130, buildingLevel: 0 },
        { assetId: "seoul", refund: 260, buildingLevel: 2 },
      ],
      selectedAssetIds: ["singapore"],
      refundTotal: 130,
      remainingShortfall: 90,
      ready: false,
    },
    ...overrides,
  };
}

test("debtor sees authoritative liquidation assets and current debt progress", () => {
  const model = createOnlineLiquidationUiModel(state(), "p1");

  assert.equal(model.debtorPlayerId, "p1");
  assert.equal(model.debtorName, "A");
  assert.equal(model.creditorName, "B");
  assert.equal(model.amountDue, 300);
  assert.equal(model.cash, 80);
  assert.equal(model.shortfall, 220);
  assert.equal(model.refundTotal, 130);
  assert.equal(model.remainingShortfall, 90);
  assert.equal(model.ready, false);
  assert.equal(model.isDebtor, true);
  assert.deepEqual(model.assets, [
    { id: "singapore", label: "싱가포르", refund: 130, buildingLevel: 0, selected: true },
    { id: "seoul", label: "서울", refund: 260, buildingLevel: 2, selected: false },
  ]);
});

test("observers see debt recovery state but cannot act as the debtor", () => {
  const model = createOnlineLiquidationUiModel(state(), "p3");

  assert.equal(model.isDebtor, false);
  assert.equal(model.debtorName, "A");
  assert.equal(model.creditorName, "B");
  assert.equal(model.assets.length, 2);
});

test("ready authoritative choice enables settlement state in the model", () => {
  const pendingChoice = {
    ...state().pendingChoice,
    status: "READY",
    selectedAssetIds: ["seoul"],
    refundTotal: 260,
    remainingShortfall: 0,
    ready: true,
  };
  const model = createOnlineLiquidationUiModel(state({ pendingChoice }), "p1");

  assert.equal(model.ready, true);
  assert.equal(model.refundTotal, 260);
  assert.equal(model.remainingShortfall, 0);
  assert.equal(model.assets.find((asset) => asset.id === "seoul").selected, true);
});

test("non debt-recovery state does not render liquidation UI", () => {
  assert.equal(createOnlineLiquidationUiModel(state({ pendingChoice: null }), "p1"), null);
  assert.equal(
    createOnlineLiquidationUiModel(state({ pendingChoice: { type: "BUY_PROPERTY" } }), "p1"),
    null,
  );
});

test("liquidation UI delegates selection and confirmation to the online session only", () => {
  assert.match(uiSource, /session\.selectLiquidation\(assetIds\)/);
  assert.match(uiSource, /session\.confirmLiquidation\(\)/);
  assert.doesNotMatch(uiSource, /ownerId\s*=(?!=)/);
  assert.doesNotMatch(uiSource, /player\.money\s*[+-]=/);
});

test("liquidation UI shares canonical onlineSession singleton with the online controllers", () => {
  assert.match(uiSource, /from "\.\/onlineSession\.js\?v=20260923-r2"/);
});

test("online boot attaches liquidation UI after auction and trade adapters", () => {
  const controllerStart = playWindowSource.indexOf("controllerModule.startOnlineGameController");
  const auctionModule = playWindowSource.indexOf("onlineAuctionUi.js");
  const tradeModule = playWindowSource.indexOf("onlineTradeUi.js");
  const liquidationModule = playWindowSource.indexOf("onlineLiquidationUi.js");

  assert.ok(controllerStart >= 0);
  assert.ok(auctionModule > controllerStart);
  assert.ok(tradeModule > auctionModule);
  assert.ok(liquidationModule > tradeModule);
  assert.match(playWindowSource, /setupOnlineLiquidationUi\(\{ roomId: onlineRoomId \}\)/);
  assert.match(playWindowSource, /ONLINE_LIQUIDATION_UI_MODULE_TIMEOUT/);
});

test("liquidation panel includes responsive asset and action layouts", () => {
  assert.match(cssSource, /liquidation-action-panel__assets/);
  assert.match(cssSource, /liquidation-action-panel__asset/);
  assert.match(cssSource, /liquidation-action-panel__actions/);
  assert.match(cssSource, /@media \(max-width: 640px\)/);
});
