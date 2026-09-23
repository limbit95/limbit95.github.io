import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const originalWindow = globalThis.window;
globalThis.window = globalThis.window ?? {};
const { createOnlineTradeUiModel } = await import("../js/onlineTradeUi.js");
globalThis.window = originalWindow;

const uiSource = readFileSync(new URL("../js/onlineTradeUi.js", import.meta.url), "utf8");
const playWindowSource = readFileSync(new URL("../js/playWindow.js", import.meta.url), "utf8");
const cssSource = readFileSync(new URL("../css/trade-ui.css", import.meta.url), "utf8");

function state(overrides = {}) {
  return {
    status: "PLAYING",
    phase: "WAITING_ROLL",
    currentPlayerIndex: 0,
    players: [
      { id: "p1", name: "A", seat: 0, money: 1500, bankrupt: false },
      { id: "p2", name: "B", seat: 1, money: 1200, bankrupt: false },
      { id: "p3", name: "C", seat: 2, money: 900, bankrupt: false },
    ],
    board: {
      nodes: [
        { id: "singapore", label: "싱가포르", type: "PROPERTY" },
        { id: "tokyo", label: "도쿄", type: "PROPERTY" },
        { id: "seoul", label: "서울", type: "PROPERTY" },
      ],
    },
    boardState: {
      properties: {
        singapore: { ownerId: "p1", buildingLevel: 0 },
        tokyo: { ownerId: "p2", buildingLevel: 0 },
        seoul: { ownerId: "p1", buildingLevel: 1 },
      },
    },
    pendingTrade: null,
    ...overrides,
  };
}

test("current pre-roll player gets a trade composer with active recipients and unimproved properties", () => {
  const model = createOnlineTradeUiModel(state(), "p1");

  assert.equal(model.mode, "compose");
  assert.equal(model.viewerGold, 1500);
  assert.deepEqual(model.recipients.map((recipient) => recipient.id), ["p2", "p3"]);
  assert.deepEqual(model.offeredProperties, [{ id: "singapore", label: "싱가포르" }]);
});

test("non-current player does not get a composer without an open trade", () => {
  assert.equal(createOnlineTradeUiModel(state(), "p2"), null);
  assert.equal(createOnlineTradeUiModel(state({ phase: "TURN_END" }), "p1"), null);
});

test("open trade is visible to all active players but only the recipient may respond", () => {
  const pendingTrade = {
    type: "PLAYER_TRADE",
    offerId: "trade-1",
    proposerPlayerId: "p1",
    recipientPlayerId: "p2",
    terms: {
      offered: { propertyIds: ["singapore"], gold: 100 },
      requested: { propertyIds: ["tokyo"], gold: 50 },
    },
    status: "OPEN",
  };

  const proposer = createOnlineTradeUiModel(state({ pendingTrade }), "p1");
  const recipient = createOnlineTradeUiModel(state({ pendingTrade }), "p2");
  const observer = createOnlineTradeUiModel(state({ pendingTrade }), "p3");

  assert.equal(proposer.mode, "pending");
  assert.equal(proposer.isProposer, true);
  assert.equal(proposer.canAccept, false);
  assert.equal(proposer.canCancel, true);
  assert.equal(recipient.canAccept, true);
  assert.equal(recipient.canReject, true);
  assert.equal(observer.canAccept, false);
  assert.equal(observer.canCancel, false);
  assert.match(recipient.offeredLabel, /싱가포르/);
  assert.match(recipient.offeredLabel, /100/);
  assert.match(recipient.requestedLabel, /도쿄/);
});

test("trade UI keeps authority in the session and does not add client-side settlement", () => {
  assert.match(uiSource, /session\.offerTrade\(recipientPlayerId, terms\)/);
  assert.match(uiSource, /session\.acceptTrade\(\)/);
  assert.match(uiSource, /session\.rejectTrade\(\)/);
  assert.match(uiSource, /session\.cancelTrade\(\)/);
  assert.doesNotMatch(uiSource, /ownerId\s*=(?!=)/);
  assert.doesNotMatch(uiSource, /player\.money\s*[+-]=/);
  assert.match(uiSource, /buildingLevel \?\? 0\) === 0/);
});

test("online boot attaches trade UI after controller and auction adapters", () => {
  const controllerStart = playWindowSource.indexOf("controllerModule.startOnlineGameController");
  const auctionModule = playWindowSource.indexOf("onlineAuctionUi.js");
  const tradeModule = playWindowSource.indexOf("onlineTradeUi.js");

  assert.ok(controllerStart >= 0);
  assert.ok(auctionModule > controllerStart);
  assert.ok(tradeModule > auctionModule);
  assert.match(playWindowSource, /setupOnlineTradeUi\(\{ roomId: onlineRoomId \}\)/);
  assert.match(playWindowSource, /ONLINE_TRADE_UI_MODULE_TIMEOUT/);
});

test("trade panel includes responsive composer and pending response states", () => {
  assert.match(cssSource, /trade-action-panel__compose/);
  assert.match(cssSource, /trade-action-panel__pending/);
  assert.match(cssSource, /trade-action-panel__responses/);
  assert.match(cssSource, /@media \(max-width: 640px\)/);
});

test("trade UI shares the same canonical onlineSession module instance as controllers", () => {
  assert.match(uiSource, /from "\.\/onlineSession\.js\?v=20260923-r2"/);
});
