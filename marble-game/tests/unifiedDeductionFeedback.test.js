import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(
  new URL("../js/renderer/threeClassicUnifiedDeductionEntry.js", import.meta.url),
  "utf8",
);
const css = readFileSync(
  new URL("../css/unified-deduction.css", import.meta.url),
  "utf8",
);
const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("TOLL, EVENT and TAX share the same deduction presentation gate", () => {
  assert.match(source, /\["TOLL", "EVENT", "TAX"\]\.includes\(event\?\.reason\)/);
  assert.match(source, /createDeductionFeedback/);
  assert.match(source, /prepareDeductionDisplay/);
  assert.match(source, /data-unified-deduction-feedback/);
});

test("deduction feedback shows before minus cost equals remaining", () => {
  assert.match(source, /차감 전 보유 골드/);
  assert.match(source, /남은 보유 골드/);
  assert.match(source, /minus\.textContent = "−"/);
  assert.match(source, /equals\.textContent = "="/);
  assert.match(source, /formatClassicMoneyDelta\(-amount\)/);
});

test("only remaining gold counts down and its meter drains with the value", () => {
  assert.match(source, /DEDUCTION_COUNTDOWN_MS = 1600/);
  assert.match(source, /interpolateMoneyBalance\(balanceBefore, balanceAfter, progress\)/);
  assert.match(source, /display\.remainingValue\.textContent = formatClassicMoneyBalance\(value\)/);
  assert.match(source, /value \/ balanceBefore/);
  assert.match(source, /--deduction-meter-progress/);
  assert.doesNotMatch(source, /fromValue: 0/);
});

test("TOLL keeps payer to owner transfer while EVENT and TAX land on the cost card", () => {
  assert.match(source, /entry\.event\?\.reason === "TOLL"/);
  assert.match(source, /destinationElement: ownerCard/);
  assert.match(source, /destinationElement: display\.costCard/);
  assert.match(source, /destinationCard: display\.costCard/);
});

test("deduction visual uses anticipation impact countdown and settle states", () => {
  assert.match(source, /DEDUCTION_ANTICIPATION_MS = 240/);
  assert.match(source, /DEDUCTION_SETTLE_MS = 260/);
  assert.match(source, /dataset\.state = "deducting"/);
  assert.match(source, /dataset\.state = "settled"/);
  assert.match(css, /marble-deduction-cost-impact/);
  assert.match(css, /marble-deduction-result-focus/);
  assert.match(css, /marble-deduction-settle/);
});

test("Marble entry and stylesheet cache keys point at the unified deduction layer", () => {
  assert.match(indexHtml, /unified-deduction\.css\?v=20260917-r1/);
  assert.match(indexHtml, /threeClassicUnifiedDeductionEntry\.js\?v=20260917-r1/);
  assert.match(indexHtml, /data-marble-build="20260917-r1"/);
});
