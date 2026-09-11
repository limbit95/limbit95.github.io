import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  createMoneyPresentationPlan,
  formatClassicMoneyBalance,
  formatClassicMoneyDelta,
  interpolateMoneyBalance,
} from "../js/presentation/moneyPresentation.js";

const wrapperSource = readFileSync(new URL("../js/renderer/threeClassicMoneyPresentation.js", import.meta.url), "utf8");

test("money presentation maps START and received money to player gains", () => {
  assert.deepEqual(createMoneyPresentationPlan({
    type: "START_PASSED",
    playerId: "p1",
    amount: 200,
  }), [{
    playerId: "p1",
    tone: "gain",
    signedAmount: 200,
    label: "START 보상",
  }]);

  assert.deepEqual(createMoneyPresentationPlan({
    type: "MONEY_RECEIVED",
    playerId: "p2",
    amount: 120,
    reason: "EVENT",
  }), [{
    playerId: "p2",
    tone: "gain",
    signedAmount: 120,
    label: "이벤트 보상",
  }]);
});

test("toll presentation shows payer loss and creditor gain without changing values", () => {
  assert.deepEqual(createMoneyPresentationPlan({
    type: "MONEY_PAID",
    playerId: "payer",
    creditorId: "owner",
    amount: 350,
    reason: "TOLL",
  }), [
    {
      playerId: "payer",
      tone: "loss",
      signedAmount: -350,
      label: "통행료 지불",
    },
    {
      playerId: "owner",
      tone: "gain",
      signedAmount: 350,
      label: "통행료 수금",
    },
  ]);
});

test("tax presentation stays a one-way loss", () => {
  assert.deepEqual(createMoneyPresentationPlan({
    type: "MONEY_PAID",
    playerId: "p1",
    creditorId: null,
    amount: 90,
    reason: "TAX",
  }), [{
    playerId: "p1",
    tone: "loss",
    signedAmount: -90,
    label: "세금",
  }]);
});

test("property purchase and building costs use the same loss presentation path", () => {
  assert.deepEqual(createMoneyPresentationPlan({
    type: "PROPERTY_BOUGHT",
    playerId: "p1",
    amount: 500,
  }), [{
    playerId: "p1",
    tone: "loss",
    signedAmount: -500,
    label: "도시 구매",
  }]);

  assert.deepEqual(createMoneyPresentationPlan({
    type: "PROPERTY_BUILT",
    playerId: "p1",
    amount: 300,
  }), [{
    playerId: "p1",
    tone: "loss",
    signedAmount: -300,
    label: "건설 비용",
  }]);
});

test("money formatting separates signed feedback from authoritative balance display", () => {
  assert.equal(formatClassicMoneyDelta(1200), "+1,200 골드");
  assert.equal(formatClassicMoneyDelta(-450), "−450 골드");
  assert.equal(formatClassicMoneyBalance(1250), "1,250 골드");
});

test("money balance interpolation is monotonic and reaches the authoritative target", () => {
  assert.equal(interpolateMoneyBalance(1000, 500, 0), 1000);
  const halfway = interpolateMoneyBalance(1000, 500, 0.5);
  assert.ok(halfway < 1000);
  assert.ok(halfway > 500);
  assert.equal(interpolateMoneyBalance(1000, 500, 1), 500);

  assert.equal(interpolateMoneyBalance(500, 900, 0), 500);
  assert.ok(interpolateMoneyBalance(500, 900, 0.5) > 500);
  assert.equal(interpolateMoneyBalance(500, 900, 1), 900);
});

test("START reward is deferred until PLAYER_MOVED completes", () => {
  const startIndex = wrapperSource.indexOf('event?.type === "START_PASSED"');
  const moveAwaitIndex = wrapperSource.indexOf("await renderer.playEvent(event)");
  const flushIndex = wrapperSource.indexOf('event?.type === "PLAYER_MOVED" && pendingStartEvents.length');
  assert.ok(startIndex >= 0);
  assert.ok(moveAwaitIndex > startIndex);
  assert.ok(flushIndex > moveAwaitIndex);
  assert.match(wrapperSource, /getSharedAnimationQueue\("classic-online"\)/);
});

test("money wrapper keeps prior HUD balances during animation and covers purchase/build events", () => {
  assert.match(wrapperSource, /playerBalanceById = new Map\(\)/);
  assert.match(wrapperSource, /MutationObserverObject/);
  assert.match(wrapperSource, /syncHudMoneyBalances/);
  assert.match(wrapperSource, /PROPERTY_BOUGHT/);
  assert.match(wrapperSource, /PROPERTY_BUILT/);
  assert.match(wrapperSource, /moneyPresentation\.js\?v=20260912-r16/);
  assert.match(wrapperSource, /threeClassicPrototypeDiagnostics\.js\?v=20260912-r13/);
});
