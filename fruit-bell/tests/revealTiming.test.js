import test from "node:test";
import assert from "node:assert/strict";
import {
  CARD_REVEAL_DELAY_MS,
  createPrototypeRevealAt,
  toLocalPerformanceRevealAt,
} from "../js/revealTiming.js";

test("prototype reveal uses one shared deterministic delay", () => {
  assert.equal(createPrototypeRevealAt(1000), 1000 + CARD_REVEAL_DELAY_MS);
});

test("server reveal time maps consistently despite different client clock skew", () => {
  const revealAtServerEpochMs = 20_000;
  const clientA = toLocalPerformanceRevealAt({
    revealAtServerEpochMs,
    estimatedServerOffsetMs: 500,
    localEpochNowMs: 19_000,
    localPerformanceNowMs: 3_000,
  });
  const clientB = toLocalPerformanceRevealAt({
    revealAtServerEpochMs,
    estimatedServerOffsetMs: -700,
    localEpochNowMs: 20_200,
    localPerformanceNowMs: 8_000,
  });

  assert.equal(clientA - 3_000, 500);
  assert.equal(clientB - 8_000, 500);
});
