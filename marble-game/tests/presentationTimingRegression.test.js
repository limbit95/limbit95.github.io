import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const timingSource = readFileSync(
  new URL("../js/renderer/threeClassicPresentationTiming.js", import.meta.url),
  "utf8",
);

test("toll presentation keeps payer and creditor balances deferred until presentation settles", () => {
  assert.match(timingSource, /if \(!pendingTolls\.includes\(entry\) \|\| entry\.flushing\) return;/);
  assert.match(timingSource, /entry\.flushing = true;/);
  assert.match(timingSource, /const entry = \{ event, timerId: null, flushing: false \};/);
  assert.match(
    timingSource,
    /moneyPresenter\.play\(entry\.event\)[\s\S]*\.finally\(\(\) => removePendingEntry\(pendingTolls, entry\)\)/,
  );

  const flushStart = timingSource.indexOf("function flushToll(entry)");
  const flushEnd = timingSource.indexOf("function flushOpenTolls()", flushStart);
  const flushSource = timingSource.slice(flushStart, flushEnd);
  assert.ok(flushStart >= 0 && flushEnd > flushStart);
  assert.equal(flushSource.includes("removePendingEntry(pendingTolls, entry);\n    void moneyPresenter.play"), false);
});

test("rest notification keeps the readable hold duration under reduced motion", () => {
  assert.match(timingSource, /REST_CELEBRATION_HOLD_MS = 2000/);
  assert.match(timingSource, /await wait\(REST_CELEBRATION_HOLD_MS\);/);
  assert.doesNotMatch(timingSource, /reducedMotion \? 900 : REST_CELEBRATION_HOLD_MS/);
});
