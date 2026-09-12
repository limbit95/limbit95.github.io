import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const wrapperSource = readFileSync(new URL("../js/presentation/startSalaryMoneyPresentation.js", import.meta.url), "utf8");
const cssSource = readFileSync(new URL("../css/start-salary-celebration.css", import.meta.url), "utf8");
const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("START salary uses a dedicated celebration before the existing money presenter", () => {
  const startGuardIndex = wrapperSource.indexOf('event?.type === "START_PASSED"');
  const celebrationAwaitIndex = wrapperSource.indexOf("await presentStartSalaryCelebration(event)");
  const basePlayIndex = wrapperSource.indexOf("await basePresenter.play(event)");

  assert.ok(startGuardIndex >= 0);
  assert.ok(celebrationAwaitIndex > startGuardIndex);
  assert.ok(basePlayIndex > celebrationAwaitIndex);
  assert.match(wrapperSource, /한 바퀴 완주!/);
  assert.match(wrapperSource, /START 월급 지급/);
  assert.match(wrapperSource, /완주 보상이 지급됩니다/);
  assert.match(wrapperSource, /1020/);
  assert.match(wrapperSource, /reducedMotion \? 420/);
});

test("START celebration is presentation-only and keeps the base money transfer implementation", () => {
  assert.match(wrapperSource, /createBaseHudMoneyPresenter/);
  assert.match(wrapperSource, /moneyPresentation\.js\?v=20260912-r23-impl/);
  assert.doesNotMatch(wrapperSource, /balanceByPlayerId\.set/);
  assert.doesNotMatch(wrapperSource, /PROPERTY_BOUGHT|PROPERTY_BUILT|MONEY_PAID|MONEY_RECEIVED/);
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

test("Marble import map routes the existing money presenter import through the START celebration wrapper", () => {
  assert.match(indexHtml, /start-salary-celebration\.css\?v=20260912-r1/);
  assert.match(indexHtml, /moneyPresentation\.js\?v=20260912-r21\": \"\.\/js\/presentation\/startSalaryMoneyPresentation\.js\?v=20260912-r24/);
});
