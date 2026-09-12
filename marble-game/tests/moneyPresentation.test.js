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
const tileInfoSource = readFileSync(new URL("../js/tileInfo.js", import.meta.url), "utf8");
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

test("toll presentation sequences payer loss, HUD transfer, then owner gain", () => {
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
      from: { kind: "player", playerId: "payer" },
      to: { kind: "player", playerId: "owner" },
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

test("property purchase and building send player coins to the authoritative event tile", () => {
  for (const [type, label] of [
    ["PROPERTY_BOUGHT", "도시 구매"],
    ["PROPERTY_BUILT", "건설 비용"],
  ]) {
    assert.deepEqual(createMoneyPresentationSequence({
      type,
      playerId: "p1",
      nodeId: "seoul",
      amount: 500,
    }), [
      {
        kind: "money",
        steps: [{
          playerId: "p1",
          tone: "loss",
          signedAmount: -500,
          label,
        }],
        holdMs: 420,
      },
      {
        kind: "transfer",
        from: { kind: "player", playerId: "p1" },
        to: { kind: "tile", nodeId: "seoul" },
        amount: 500,
      },
    ]);
  }
});

test("only START salary flies from board center to the receiving HUD", () => {
  const start = createMoneyPresentationSequence({
    type: "START_PASSED",
    playerId: "p1",
    amount: 200,
  });
  assert.deepEqual(start[0], {
    kind: "transfer",
    from: { kind: "board-center" },
    to: { kind: "player", playerId: "p1" },
    amount: 200,
  });
  assert.equal(start[1].kind, "money");
});

test("event and bonus rewards fly from the visible modal gold-change card to the receiving HUD", () => {
  for (const reason of ["EVENT", "BONUS"]) {
    const sequence = createMoneyPresentationSequence({
      type: "MONEY_RECEIVED",
      playerId: "p2",
      amount: 150,
      reason,
    });
    assert.deepEqual(sequence[0], {
      kind: "transfer",
      from: { kind: "modal-money-card" },
      to: { kind: "player", playerId: "p2" },
      amount: 150,
    });
    assert.equal(sequence[1].kind, "money");
  }
});

test("event and tax costs count down before coins leave the player HUD for board center", () => {
  for (const reason of ["EVENT", "TAX"]) {
    const sequence = createMoneyPresentationSequence({
      type: "MONEY_PAID",
      playerId: "p2",
      amount: 180,
      reason,
    });
    assert.equal(sequence[0].kind, "money");
    assert.deepEqual(sequence[1], {
      kind: "transfer",
      from: { kind: "player", playerId: "p2" },
      to: { kind: "board-center" },
      amount: 180,
    });
  }
});

test("transfer coin count is doubled while staying bounded", () => {
  assert.equal(resolveMoneyTransferCoinCount(50), 6);
  assert.equal(resolveMoneyTransferCoinCount(250), 8);
  assert.equal(resolveMoneyTransferCoinCount(700), 10);
  assert.equal(resolveMoneyTransferCoinCount(2000), 12);
});

test("transfer flight creates a visible arced route with staggered coins", () => {
  const first = resolveMoneyTransferFlight({ x: 100, y: 100 }, { x: 900, y: 600 }, 0, 8);
  const last = resolveMoneyTransferFlight({ x: 100, y: 100 }, { x: 900, y: 600 }, 7, 8);
  assert.ok(first.endX > 700);
  assert.ok(first.endY > 400);
  assert.ok(first.midY < first.endY / 2);
  assert.equal(first.delayMs, 0);
  assert.equal(last.delayMs, 476);
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

test("modal money waits after the result modal opens and preserves the prior HUD balance", () => {
  assert.match(wrapperSource, /pendingModalMoneyEvents/);
  assert.match(wrapperSource, /isModalMoneyEvent\(event\)/);
  assert.match(wrapperSource, /MODAL_MONEY_LEAD_IN_MS = 520/);
  assert.match(wrapperSource, /MODAL_MONEY_FALLBACK_MS = 1400/);
  assert.match(wrapperSource, /attributeFilter: \["open"\]/);
  assert.match(wrapperSource, /deferredPlayerIds\.has\(player\.id\)/);
  assert.match(wrapperSource, /schedulePendingModalMoney\(\{ requireOpenModal: true \}\)/);
  assert.match(moneySource, /modal-money-card/);
  assert.match(moneySource, /골드 변화/);
  assert.match(moneySource, /layerHost\?\.style\) layerHost\.style\.overflow = "visible"/);
  assert.match(moneySource, /\[data-tile-info-modal\]\[open\]/);
});

test("bonus and tax landings use the shared result modal gold-change card", () => {
  assert.match(wrapperSource, /MODAL_LANDING_TILE_TYPES = new Set\(\["BONUS", "TAX"\]\)/);
  assert.match(wrapperSource, /populateLandingMoneyModal/);
  assert.match(wrapperSource, /createClassicTileInfo/);
  assert.match(wrapperSource, /\.\.\/tileInfo\.js\?v=20260912-r21/);
  assert.match(tileInfoSource, /typeLabel: "보너스"[\s\S]*label: "골드 변화"/);
  assert.match(tileInfoSource, /typeLabel: "비용"[\s\S]*label: "골드 변화"/);
});

test("money transfer VFX resolves board points and keeps the visible larger coin styling", () => {
  assert.match(wrapperSource, /moneyPresentation\.js\?v=20260912-r21/);
  assert.match(wrapperSource, /resolveBoardTransferPoint/);
  assert.match(wrapperSource, /projectClassicBoardPoint/);
  assert.match(wrapperSource, /createSquareRingLayout\(state\.board\.nodes\)/);
  assert.match(moneySource, /coin\.animate\(transferFrames\(flight\)/);
  assert.match(moneySource, /transferDurationMs = 780/);
  assert.match(moneySource, /money-transfer-board-impact/);
  assert.match(cssSource, /\.money-transfer-layer/);
  assert.match(cssSource, /z-index: 2147483000/);
  assert.match(cssSource, /width: 30px/);
  assert.match(cssSource, /height: 30px/);
  assert.match(cssSource, /data-money-transfer-fallback="true"/);
  assert.match(cssSource, /content: "G"/);
  assert.match(cssSource, /\.money-transfer-board-impact/);
});
