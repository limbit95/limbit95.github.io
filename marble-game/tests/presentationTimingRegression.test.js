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

test("toll presentation keeps payer and creditor balances deferred until modal counting settles", () => {
  assert.match(timingSource, /if \(!pendingTolls\.includes\(entry\) \|\| entry\.flushing\) return;/);
  assert.match(timingSource, /entry\.flushing = true;/);
  assert.match(timingSource, /const entry = \{ event, timerId: null, flushing: false \};/);
  assert.match(timingSource, /presentModalLoss\(entry\.event\)/);
  assert.match(timingSource, /playTollCreditorGain\(entry\.event\)/);
  assert.match(
    timingSource,
    /Promise\.all\(\[[\s\S]*presentModalLoss\(entry\.event\)[\s\S]*playTollCreditorGain\(entry\.event\)[\s\S]*\]\)[\s\S]*\.finally\(\(\) => removePendingEntry\(pendingTolls, entry\)\)/,
  );
});

test("viewer modal losses count current gold down instead of running the HUD loss presenter", () => {
  assert.match(timingSource, /async function presentModalLoss\(event\)/);
  assert.match(timingSource, /async function animateModalLossBalance/);
  assert.match(timingSource, /interpolateMoneyBalance\(fromValue, toValue, progress\)/);
  assert.match(timingSource, /prepareTileModalLossDisplay/);
  assert.match(timingSource, /prepareTollModalLossDisplay/);
  assert.doesNotMatch(timingSource, /playLossBurst\?\.\(entry\.event\)/);
});

test("local Marble play marks the active event player as the presentation viewer", () => {
  assert.match(performanceEntrySource, /mode === "local-play" \|\| mode === "full"/);
  assert.match(performanceEntrySource, /markLocalPresentationViewer/);
  assert.match(performanceEntrySource, /\.player-hud-card\[data-viewer="true"\]/);
  assert.match(performanceEntrySource, /\.player-hud-card\[data-seat=/);
  assert.match(performanceEntrySource, /markLocalPresentationViewer\(documentObject, latestState, event\?\.playerId\)/);
  assert.match(performanceEntrySource, /return renderer\.playEvent\(event\)/);
});

test("REST arrival skips celebration and only the later skipped turn uses it", () => {
  assert.match(timingSource, /function isRestEvent\(event\) \{\s*return event\?\.type === "TURN_SKIPPED";/);
  assert.doesNotMatch(timingSource, /무인도 도착!/);
  assert.match(timingSource, /무인도 휴식 턴/);
  assert.match(timingSource, /REST_CELEBRATION_HOLD_MS = 2000/);
  assert.match(timingSource, /await wait\(REST_CELEBRATION_HOLD_MS\);/);
});
