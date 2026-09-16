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
const timingCssSource = readFileSync(
  new URL("../css/presentation-timing.css", import.meta.url),
  "utf8",
);

test("toll modal only counts the remaining balance down while coins move HUD to HUD", () => {
  assert.doesNotMatch(performanceEntrySource, /TOLL_BALANCE_COUNT_UP_MS/);
  assert.doesNotMatch(performanceEntrySource, /TOLL_BALANCE_SETTLE_MS/);
  assert.match(performanceEntrySource, /TOLL_BALANCE_COUNT_DOWN_MS = 1450/);
  assert.match(performanceEntrySource, /fromValue: balanceBefore,[\s\S]*toValue: balanceAfter/);
  assert.match(performanceEntrySource, /playHudToHudTransfer\(entry\.event, stateForTransfer, display\.modal\)/);
  assert.match(performanceEntrySource, /ensureTollFlowLayout/);
  assert.match(performanceEntrySource, /balanceLabel\.textContent = "보유 골드"/);
  assert.match(performanceEntrySource, /arrow\.textContent = "→"/);
  assert.match(timingCssSource, /\.toll-notice-modal__payment-flow/);
  assert.match(timingCssSource, /animation-duration: 1450ms/);
});

test("viewer EVENT loss moves coins from payer HUD into the deduction gold card", () => {
  assert.match(performanceEntrySource, /event\?\.reason === "EVENT"/);
  assert.match(performanceEntrySource, /prepareEventLossDisplay/);
  assert.match(performanceEntrySource, /sourceElement: payerCard/);
  assert.match(performanceEntrySource, /destinationElement: display\.deductionHost/);
  assert.match(performanceEntrySource, /host: display\.modal/);
  assert.match(performanceEntrySource, /EVENT_BALANCE_COUNT_DOWN_MS = 760/);
});

test("viewer TAX loss moves coins from payer HUD into the existing gold-change card", () => {
  assert.match(performanceEntrySource, /event\?\.reason === "TAX"/);
  assert.match(performanceEntrySource, /pendingTaxLosses/);
  assert.match(performanceEntrySource, /findGoldChangeDisplay/);
  assert.match(performanceEntrySource, /=== "골드 변화"/);
  assert.match(performanceEntrySource, /destinationElement: display\.goldChangeHost/);
  assert.match(performanceEntrySource, /deferTaxLoss\(event\)/);
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
