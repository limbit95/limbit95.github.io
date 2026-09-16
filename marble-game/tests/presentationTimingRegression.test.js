import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const timingSource = readFileSync(
  new URL("../js/renderer/threeClassicPresentationTiming.js", import.meta.url),
  "utf8",
);
const performanceEntrySource = readFileSync(
  new URL("../js/renderer/threeClassicPerformanceEntry.js", import.meta.url),
  "utf8",
);
const moneyCssSource = readFileSync(
  new URL("../css/money-presentation.css", import.meta.url),
  "utf8",
);

test("TOLL, EVENT and cost payments share one before-minus-cost-equals-remaining loss flow", () => {
  assert.match(performanceEntrySource, /function createPaymentLossFlow/);
  assert.match(performanceEntrySource, /"차감 전"/);
  assert.match(performanceEntrySource, /minus\.textContent = "−"/);
  assert.match(performanceEntrySource, /equals\.textContent = "="/);
  assert.match(performanceEntrySource, /"남은 골드"/);
  assert.match(performanceEntrySource, /presentUnifiedLoss\(entry, "TOLL"\)/);
  assert.match(performanceEntrySource, /presentUnifiedLoss\(entry, "EVENT"\)/);
  assert.match(performanceEntrySource, /presentUnifiedLoss\(entry, "TAX"\)/);
});

test("all payment losses count only the remaining balance down with a proportional meter", () => {
  assert.match(performanceEntrySource, /PAYMENT_LOSS_COUNT_DOWN_MS = 1450/);
  assert.match(performanceEntrySource, /element: display\.remainingElement/);
  assert.match(performanceEntrySource, /fromValue: balanceBefore,[\s\S]*toValue: balanceAfter/);
  assert.match(performanceEntrySource, /value \/ balanceBefore/);
  assert.match(performanceEntrySource, /--payment-loss-ratio/);
  assert.doesNotMatch(performanceEntrySource, /fromValue: 0,[\s\S]*toValue: balanceBefore/);
});

test("EVENT and cost modals keep the deduction flow focused without coin transfers", () => {
  assert.match(performanceEntrySource, /const transferPromise = kind === "TOLL"[\s\S]*playHudToHudTransfer\(entry\.event, stateForTransfer, display\.modal\)[\s\S]*: Promise\.resolve\(\)/);
  assert.doesNotMatch(performanceEntrySource, /destinationElement: display\.deductionHost/);
  assert.match(performanceEntrySource, /kind === "EVENT" \? "이벤트 비용" : "이용 비용"/);
  assert.match(performanceEntrySource, /deductionLabel: "지불 통행료"/);
});

test("generic non-creditor MONEY_PAID costs use the same cost modal flow", () => {
  assert.match(performanceEntrySource, /event\?\.type === "MONEY_PAID"/);
  assert.match(performanceEntrySource, /event\?\.reason !== "EVENT"/);
  assert.match(performanceEntrySource, /!event\?\.creditorId/);
  assert.match(performanceEntrySource, /deferTaxLoss\(event\)/);
});

test("toll coin transfer uses a low multi-point arc instead of a single straight midpoint", () => {
  assert.match(performanceEntrySource, /function resolveTransferArc/);
  assert.match(performanceEntrySource, /q1X:/);
  assert.match(performanceEntrySource, /q1Y:/);
  assert.match(performanceEntrySource, /q3X:/);
  assert.match(performanceEntrySource, /q3Y:/);
  assert.match(performanceEntrySource, /offset: 0\.3/);
  assert.match(performanceEntrySource, /offset: 0\.56/);
  assert.match(performanceEntrySource, /offset: 0\.82/);
  assert.match(performanceEntrySource, /rotate\(620deg\)/);
});

test("unified deduction visual emphasizes source cost countdown and settled result", () => {
  assert.match(moneyCssSource, /\.payment-loss-flow \{/);
  assert.match(moneyCssSource, /grid-template-columns: minmax\(0, 1fr\) auto minmax\(0, 0\.92fr\) auto minmax\(0, 1fr\)/);
  assert.match(moneyCssSource, /\.payment-loss-flow__card\[data-role="before"\]/);
  assert.match(moneyCssSource, /\.payment-loss-flow__card\[data-role="deduction"\]/);
  assert.match(moneyCssSource, /\.payment-loss-flow__card\[data-role="remaining"\]/);
  assert.match(moneyCssSource, /marble-payment-loss-deduction-impact/);
  assert.match(moneyCssSource, /marble-payment-loss-count-focus/);
  assert.match(moneyCssSource, /marble-payment-loss-settle/);
  assert.match(moneyCssSource, /scaleX\(var\(--payment-loss-ratio, 1\)\)/);
});

test("local Marble play marks the active event player as the presentation viewer", () => {
  assert.match(performanceEntrySource, /mode === "local-play" \|\| mode === "full"/);
  assert.match(performanceEntrySource, /markLocalPresentationViewer/);
  assert.match(performanceEntrySource, /\.player-hud-card\[data-viewer="true"\]/);
  assert.match(performanceEntrySource, /\.player-hud-card\[data-seat=/);
  assert.match(performanceEntrySource, /markLocalPresentationViewer\(documentObject, latestState, event\?\.playerId\)/);
});

test("purchase transfer layer survives the choice modal closing after click", () => {
  assert.match(performanceEntrySource, /function preserveChoiceTransferLayer/);
  assert.match(performanceEntrySource, /\[data-tile-info-modal\] \.money-transfer-layer/);
  assert.match(performanceEntrySource, /documentObject\.body\.append\(layer\)/);
  assert.match(performanceEntrySource, /addEventListener\?\.\("click", handleChoiceTransferCapture, true\)/);
  assert.match(performanceEntrySource, /removeEventListener\?\.\("click", handleChoiceTransferCapture, true\)/);
});

test("REST arrival skips celebration and only the later skipped turn uses it", () => {
  assert.match(timingSource, /function isRestEvent\(event\) \{\s*return event\?\.type === "TURN_SKIPPED";/);
  assert.doesNotMatch(timingSource, /무인도 도착!/);
  assert.match(timingSource, /무인도 휴식 턴/);
  assert.match(timingSource, /REST_CELEBRATION_HOLD_MS = 2000/);
  assert.match(timingSource, /await wait\(REST_CELEBRATION_HOLD_MS\);/);
});
