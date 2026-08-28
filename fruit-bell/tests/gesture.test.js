import test from "node:test";
import assert from "node:assert/strict";
import { getFlipGestureProgress, isUpwardFlipGesture } from "../js/gesture.js";

test("upward drag with held click is accepted", () => {
  assert.equal(isUpwardFlipGesture({ startX: 320, startY: 520, endX: 330, endY: 430, durationMs: 280 }), true);
});

test("short or sideways movements are rejected", () => {
  assert.equal(isUpwardFlipGesture({ startX: 320, startY: 520, endX: 325, endY: 490, durationMs: 250 }), false);
  assert.equal(isUpwardFlipGesture({ startX: 320, startY: 520, endX: 410, endY: 455, durationMs: 250 }), false);
});

test("gesture must look like a deliberate card flip, not a long hold", () => {
  assert.equal(isUpwardFlipGesture({ startX: 320, startY: 520, endX: 320, endY: 430, durationMs: 1200 }), false);
  assert.equal(isUpwardFlipGesture({ startX: 320, startY: 520, endX: 320, endY: 430, durationMs: 25 }), false);
});

test("gesture progress is clamped for hand preview animation", () => {
  assert.equal(getFlipGestureProgress(500, 500), 0);
  assert.equal(getFlipGestureProgress(500, 471), 0.5);
  assert.equal(getFlipGestureProgress(500, 400), 1);
});
