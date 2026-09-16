import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  createMoneyPresentationPlan,
  createMoneyPresentationSequence,
  formatClassicMoneyBalance,
  formatClassicMoneyDelta,
  interpolateMoneyBalance,
  resolveMoneyBurstVector,
  resolveMoneyTransferCoinCount,
  resolveMoneyTransferFlight,
} from "../js/presentation/moneyPresentation.js";

const wrapperSource = readFileSync(new URL("../js/renderer/threeClassicMoneyPresentation.js", import.meta.url), "utf8");
const timingSource = readFileSync(new URL("../js/renderer/threeClassicPresentationTiming.js", import.meta.url), "utf8");
const moneySource = readFileSync(new URL("../js/presentation/moneyPresentation.js", import.meta.url), "utf8");
const tileInfoSource = readFileSync(new URL("../js/tileInfo.js", import.meta.url), "utf8");
const cssSource = readFileSync(new URL("../css/money-presentation.css", import.meta.url), "utf8");
const timingCssSource = readFileSync(new URL("../css/presentation-timing.css", import.meta.url), "utf8");

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

test("toll presentation bursts payer coins and keeps the authoritative owner gain", () => {
  const sequence = createMoneyPresentationSequence({
    type: "MONEY_PAID",
    playerId: "payer",
    creditorId: "owner",
    amount: 350,
    reason: "TOLL",
  });
  assert.deepEqual(sequence[0], {
    kind: "burst",
    playerId: "payer",
    amount: 350,
  });
  assert.equal(sequence.some((phase) => phase.kind === "transfer"), false);
  assert.equal(sequence[1].steps[0].signedAmount, -350);
  assert.equal(sequence[2].steps[0].signedAmount, 350);
  assert.equal(sequence[2].steps[0].playerId, "owner");
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
        durationMs: 520,
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

test("event and tax costs keep the generic one-way loss presentation", () => {
  for (const reason of ["EVENT", "TAX"]) {
    const sequence = createMoneyPresentationSequence({
      type: "MONEY_PAID",
      playerId: "p2",
      amount: 180,
      reason,
    });
    assert.deepEqual(sequence[0], { kind: "burst", playerId: "p2", amount: 180 });
    assert.equal(sequence[1].kind, "money");
    assert.equal(sequence.some((phase) => phase.kind === "transfer"), false);
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

test("event loss burst scatters coins upward with staggered directions", () => {
  const first = resolveMoneyBurstVector(0, 8);
  const last = resolveMoneyBurstVector(7, 8);
  assert.ok(first.apexY < 0);
  assert.ok(last.apexY < 0);
  assert.ok(first.endY > 0);
  assert.ok(last.endY > 0);
  assert.equal(first.delayMs, 0);
  assert.equal(last.delayMs, 238);
  assert.notEqual(Math.sign(first.endX), Math.sign(last.endX));
  assert.match(moneySource, /playLossBurst/);
  assert.match(moneySource, /presentBurst\(event\.playerId, event\.amount\)/);
  assert.match(timingCssSource, /\.money-burst-layer/);
  assert.match(timingCssSource, /marble-money-burst-flight/);
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

test("START reward begins at the START path crossing while PLAYER_MOVED continues", () => {
  assert.match(timingSource, /resolveStartCrossingDelay/);
  assert.match(timingSource, /normalizedPath\.findIndex\(\(nodeId\) => starts\.has\(nodeId\)\)/);
  assert.match(timingSource, /\(startIndex \+ 1\) \* START_PATH_STEP_MS/);
  assert.match(timingSource, /const movementPromise = renderer\.playEvent\(event\)/);
  assert.match(timingSource, /const salaryPromise = playPendingStartDuringMovement\(event\)/);
  assert.match(timingSource, /Promise\.all\(\[movementPromise, salaryPromise\]\)/);
  assert.match(timingSource, /await moneyPresenter\.play\(event\)/);
});

test("purchase clicks preview the transfer immediately and suppress duplicate authoritative transfer", () => {
  assert.match(timingSource, /\[data-tile-info-action\]/);
  assert.match(timingSource, /addEventListener\?\.\("click", previewChoiceTransfer, true\)/);
  assert.match(timingSource, /moneyPresenter\.playTransfer\(event\)/);
  assert.match(timingSource, /presentationTransferPreviewed: true/);
  assert.match(moneySource, /const skipTransfer = event\?\.presentationTransferPreviewed === true/);
});

test("viewer toll payment counts down in the toll modal while preserving creditor gain feedback", () => {
  assert.match(timingSource, /pendingTolls/);
  assert.match(timingSource, /\[data-toll-notice-modal\]/);
  assert.match(timingSource, /flushOpenTolls/);
  assert.match(timingSource, /presentModalLoss\(entry\.event\)/);
  assert.match(timingSource, /playTollCreditorGain\(entry\.event\)/);
  assert.match(timingSource, /\[data-toll-balance-before\]/);
  assert.match(timingSource, /\[data-toll-deduction\]/);
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
  assert.match(moneySource, /\[data-tile-info-modal\]\[open\], \[data-toll-notice-modal\]\[open\]/);
});

test("viewer event and tax deductions count down inside the centered info modal", () => {
  assert.match(timingSource, /\["EVENT", "TAX"\]\.includes\(event\?\.reason\)/);
  assert.match(timingSource, /prepareTileModalLossDisplay/);
  assert.match(timingSource, /"내 보유 골드"/);
  assert.match(timingSource, /"차감 골드"/);
  assert.match(timingSource, /animateModalLossBalance/);
  assert.match(timingSource, /interpolateMoneyBalance/);
  assert.match(timingCssSource, /marble-modal-money-loss-balance/);
  assert.match(timingCssSource, /marble-modal-money-loss-deduction/);
});

test("only skipped REST turns use a center celebration while REST landing stays modal-only", () => {
  assert.match(timingSource, /return event\?\.type === "TURN_SKIPPED"/);
  assert.doesNotMatch(timingSource, /REST_ASSIGNED" \|\| event\?\.type === "TURN_SKIPPED"/);
  assert.doesNotMatch(timingSource, /무인도 도착!/);
  assert.match(timingSource, /무인도 휴식 턴/);
  assert.match(timingSource, /presentRestTurnCelebration\(event\)/);
  assert.match(timingCssSource, /\.rest-turn-celebration/);
  assert.match(timingCssSource, /marble-rest-turn-card-in/);
  assert.match(timingSource, /REST_CELEBRATION_HOLD_MS = 2000/);
});

test("bonus, tax and REST landings use the shared result information modal", () => {
  assert.match(wrapperSource, /MODAL_LANDING_TILE_TYPES = new Set\(\["BONUS", "TAX", "REST"\]\)/);
  assert.match(wrapperSource, /populateLandingMoneyModal/);
  assert.match(wrapperSource, /createClassicTileInfo/);
  assert.match(wrapperSource, /\.\.\/tileInfo\.js\?v=20260912-r21/);
  assert.match(tileInfoSource, /typeLabel: "보너스"[\s\S]*label: "골드 변화"/);
  assert.match(tileInfoSource, /typeLabel: "비용"[\s\S]*label: "골드 변화"/);
  assert.match(tileInfoSource, /typeLabel: "무인도"/);
});

test("money transfer VFX resolves board points and keeps the visible larger coin styling", () => {
  assert.match(timingSource, /moneyPresentation\.js\?v=20260912-r21/);
  assert.match(timingSource, /resolveBoardTransferPoint/);
  assert.match(timingSource, /projectClassicBoardPoint/);
  assert.match(timingSource, /createSquareRingLayout\(state\.board\.nodes\)/);
  assert.match(moneySource, /coin\.animate\(transferFrames\(flight\)/);
  assert.match(moneySource, /transferDurationMs = 780/);
  assert.match(moneySource, /TILE_TRANSFER_DURATION_MS = 520/);
  assert.match(moneySource, /money-transfer-board-impact/);
  assert.match(cssSource, /\.money-transfer-layer/);
  assert.match(cssSource, /z-index: 2147483000/);
  assert.match(cssSource, /width: 30px/);
  assert.match(cssSource, /height: 30px/);
  assert.match(cssSource, /data-money-transfer-fallback="true"/);
  assert.match(cssSource, /content: "G"/);
  assert.match(cssSource, /\.money-transfer-board-impact/);
});
