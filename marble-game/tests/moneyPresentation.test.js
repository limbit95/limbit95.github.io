import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  createMoneyPresentationPlan,
  createMoneyPresentationSequence,
  formatClassicMoneyBalance,
  formatClassicMoneyDelta,
  interpolateMoneyBalance,
  resolveMoneyTransferCoinCount,
  resolveMoneyTransferFlight,
} from "../js/presentation/moneyPresentation.js";

const wrapperSource = readFileSync(new URL("../js/renderer/threeClassicMoneyPresentation.js", import.meta.url), "utf8");
const moneySource = readFileSync(new URL("../js/presentation/moneyPresentation.js", import.meta.url), "utf8");
const cssSource = readFileSync(new URL("../css/money-presentation.css", import.meta.url), "utf8");

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

test("toll presentation sequences payer loss, transfer VFX, then owner gain", () => {
  assert.deepEqual(createMoneyPresentationSequence({
    type: "MONEY_PAID",
    playerId: "payer",
    creditorId: "owner",
    amount: 350,
    reason: "TOLL",
  }), [
    {
      kind: "money",
      steps: [{
        playerId: "payer",
        tone: "loss",
        signedAmount: -350,
        label: "통행료 지불",
      }],
      holdMs: 520,
    },
    {
      kind: "transfer",
      fromPlayerId: "payer",
      toPlayerId: "owner",
      amount: 350,
    },
    {
      kind: "money",
      steps: [{
        playerId: "owner",
        tone: "gain",
        signedAmount: 350,
        label: "통행료 수금",
      }],
      holdMs: 520,
    },
  ]);
});

test("non-toll money events do not create transfer VFX phases", () => {
  const sequence = createMoneyPresentationSequence({
    type: "PROPERTY_BOUGHT",
    playerId: "p1",
    amount: 500,
  });
  assert.equal(sequence.length, 1);
  assert.equal(sequence[0].kind, "money");
  assert.equal(sequence.some((phase) => phase.kind === "transfer"), false);
});

test("transfer coin count stays intentionally bounded", () => {
  assert.equal(resolveMoneyTransferCoinCount(50), 3);
  assert.equal(resolveMoneyTransferCoinCount(250), 4);
  assert.equal(resolveMoneyTransferCoinCount(700), 5);
  assert.equal(resolveMoneyTransferCoinCount(2000), 6);
});

test("transfer flight creates a visible arced route with staggered coins", () => {
  const first = resolveMoneyTransferFlight({ x: 100, y: 100 }, { x: 900, y: 600 }, 0, 4);
  const last = resolveMoneyTransferFlight({ x: 100, y: 100 }, { x: 900, y: 600 }, 3, 4);
  assert.ok(first.endX > 700);
  assert.ok(first.endY > 400);
  assert.ok(first.midY < first.endY / 2);
  assert.equal(first.delayMs, 0);
  assert.equal(last.delayMs, 192);
  assert.notEqual(first.startX, last.startX);
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

test("money transfer VFX uses runtime flight animation and keeps purchase/build coverage", () => {
  assert.match(wrapperSource, /moneyPresentation\.js\?v=20260912-r18/);
  assert.match(wrapperSource, /PROPERTY_BOUGHT/);
  assert.match(wrapperSource, /PROPERTY_BUILT/);
  assert.match(moneySource, /coin\.animate\(transferFrames\(flight\)/);
  assert.match(moneySource, /transferDurationMs = 760/);
  assert.match(moneySource, /moneyTransferSource/);
  assert.match(moneySource, /moneyTransferFallback/);
  assert.match(cssSource, /\.money-transfer-layer/);
  assert.match(cssSource, /z-index: 2147483000/);
  assert.match(cssSource, /width: 22px/);
  assert.match(cssSource, /data-money-transfer-fallback="true"/);
  assert.match(cssSource, /content: "G"/);
  assert.match(cssSource, /data-money-transfer-impact/);
});
