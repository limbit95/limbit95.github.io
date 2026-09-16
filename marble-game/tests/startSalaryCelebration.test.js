import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { resolvePacedMoneyWait } from "../js/presentation/startSalaryMoneyPresentation.js";

const wrapperSource = readFileSync(new URL("../js/presentation/startSalaryMoneyPresentation.js", import.meta.url), "utf8");
const cssSource = readFileSync(new URL("../css/start-salary-celebration.css", import.meta.url), "utf8");
const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("START salary launches the celebration and existing money presenter together", () => {
  const startGuardIndex = wrapperSource.indexOf('event?.type === "START_PASSED"');
  const parallelIndex = wrapperSource.indexOf("await Promise.all([");

  assert.ok(startGuardIndex >= 0);
  assert.ok(parallelIndex > startGuardIndex);
  assert.match(wrapperSource, /presentStartSalaryCelebration\(event\),[\s\S]*startPresenter\.play\(event\),/);
  assert.match(wrapperSource, /한 바퀴 완주!/);
  assert.match(wrapperSource, /START 월급 지급/);
  assert.match(wrapperSource, /완주 보상이 지급됩니다/);
  assert.match(wrapperSource, /1020/);
  assert.match(wrapperSource, /reducedMotion \? 420/);
});

test("non-START money pacing shortens pre-transfer waits without changing START timing", () => {
  assert.equal(resolvePacedMoneyWait(420), 300);
  assert.equal(resolvePacedMoneyWait(520), 400);
  assert.equal(resolvePacedMoneyWait(1020), 1020);
  assert.equal(resolvePacedMoneyWait(180), 180);
  assert.match(wrapperSource, /PACED_MONEY_COUNT_DURATION_MS = 360/);
  assert.match(wrapperSource, /await pacedPresenter\.play\(event\)/);
  assert.match(wrapperSource, /startPresenter\.play\(event\)/);
});

test("START celebration is presentation-only and keeps the base money transfer implementation", () => {
  assert.match(wrapperSource, /createBaseHudMoneyPresenter/);
  assert.match(wrapperSource, /moneyPresentation\.js\?v=20260916-r1-impl/);
  assert.doesNotMatch(wrapperSource, /balanceByPlayerId\.set/);
  assert.doesNotMatch(wrapperSource, /PROPERTY_BOUGHT|PROPERTY_BUILT|MONEY_PAID|MONEY_RECEIVED/);
});

test("START wrapper forwards transfer-only and event-loss presentation helpers", () => {
  assert.match(wrapperSource, /function playTransfer\(event\)/);
  assert.match(wrapperSource, /pacedPresenter\.playTransfer\?\.\(event\)/);
  assert.match(wrapperSource, /function playLossBurst\(event\)/);
  assert.match(wrapperSource, /pacedPresenter\.playLossBurst\?\.\(event\)/);
});

test("START celebration has visible center-screen styling and reduced-motion fallback", () => {
  assert.match(cssSource, /\.start-salary-celebration \{/);
  assert.match(cssSource, /position: fixed/);
  assert.match(cssSource, /place-items: center/);
  assert.match(cssSource, /z-index: 2147482990/);
  assert.match(cssSource, /marble-start-salary-card-in/);
  assert.match(cssSource, /marble-start-salary-halo/);
  assert.match(cssSource, /marble-start-salary-sparkle/);
  assert.match(cssSource, /prefers-reduced-motion: reduce/);
});

test("Marble import map routes the existing money presenter import through the current START wrapper", () => {
  assert.match(indexHtml, /start-salary-celebration\.css\?v=20260912-r1/);
  assert.match(indexHtml, /presentation-timing\.css\?v=20260916-r2/);
  assert.match(indexHtml, /moneyPresentation\.js\?v=20260912-r21\": \"\.\/js\/presentation\/startSalaryMoneyPresentation\.js\?v=20260916-r1/);
  assert.match(indexHtml, /threeClassicPerformanceEntry\.js\?v=20260917-r5/);
});
