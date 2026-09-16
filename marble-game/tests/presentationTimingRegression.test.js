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

test("toll modal counts up first, then slowly deducts while coins move HUD to HUD", () => {
  assert.match(performanceEntrySource, /TOLL_BALANCE_COUNT_UP_MS = 900/);
  assert.match(performanceEntrySource, /TOLL_BALANCE_SETTLE_MS = 280/);
  assert.match(performanceEntrySource, /TOLL_BALANCE_COUNT_DOWN_MS = 1450/);
  assert.match(performanceEntrySource, /fromValue: 0,[\s\S]*toValue: balanceBefore/);
  assert.match(performanceEntrySource, /fromValue: balanceBefore,[\s\S]*toValue: balanceAfter/);
  assert.match(performanceEntrySource, /playHudToHudTransfer\(entry\.event, stateForTransfer, display\.modal\)/);
  assert.match(performanceEntrySource, /deductionElement\.hidden = true/);
  assert.match(performanceEntrySource, /deductionElement\.textContent = ""/);
});

test("viewer EVENT loss moves coins from payer HUD into the centered modal gold card", () => {
  assert.match(performanceEntrySource, /event\?\.reason === "EVENT"/);
  assert.match(performanceEntrySource, /prepareEventLossDisplay/);
  assert.match(performanceEntrySource, /sourceElement: payerCard/);
  assert.match(performanceEntrySource, /destinationElement: display\.balanceHost/);
  assert.match(performanceEntrySource, /host: display\.modal/);
  assert.match(performanceEntrySource, /EVENT_BALANCE_COUNT_DOWN_MS = 760/);
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

test("TAX keeps the existing centered loss presentation while EVENT uses the payment wrapper", () => {
  assert.match(timingSource, /\["EVENT", "TAX"\]\.includes\(event\?\.reason\)/);
  assert.match(performanceEntrySource, /event\?\.reason === "EVENT"/);
  assert.doesNotMatch(performanceEntrySource, /event\?\.reason === "TAX"/);
});

test("REST arrival skips celebration and only the later skipped turn uses it", () => {
  assert.match(timingSource, /function isRestEvent\(event\) \{\s*return event\?\.type === "TURN_SKIPPED";/);
  assert.doesNotMatch(timingSource, /무인도 도착!/);
  assert.match(timingSource, /무인도 휴식 턴/);
  assert.match(timingSource, /REST_CELEBRATION_HOLD_MS = 2000/);
  assert.match(timingSource, /await wait\(REST_CELEBRATION_HOLD_MS\);/);
});
