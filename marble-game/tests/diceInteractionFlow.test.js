import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { DICE_OVERLAY_VIEW, createDiceOverlayBounds } from "../js/diceOverlayView.js";

const playWindowCss = readFileSync(new URL("../css/play-window.css", import.meta.url), "utf8");
const diceChargeSource = readFileSync(new URL("../js/diceCharge.js", import.meta.url), "utf8");
const diceStageSource = readFileSync(new URL("../js/diceStage.js", import.meta.url), "utf8");

test("play window removes redundant top controls and dice status text", () => {
  assert.match(playWindowCss, /\.playtest-heading__actions\s*\{\s*display:\s*none/);
  assert.match(playWindowCss, /\.board-action-dock \.dice-summary\s*\{\s*display:\s*none/);
  assert.match(playWindowCss, /body\[data-play-mode="window"\] \.playtest-heading\s*\{\s*display:\s*none/);
});

test("roll and next-turn actions share the centered board control slot", () => {
  assert.match(diceChargeSource, /action === "roll" \|\| action === "endTurn"/);
  assert.match(diceChargeSource, /dock\.dataset\.centered = String\(centered\)/);
  assert.match(playWindowCss, /\.board-action-dock\[data-centered="true"\][\s\S]*top:\s*50%/);
  assert.match(playWindowCss, /action-button\[data-action="endTurn"\]/);
});

test("dice wait on the board and use a staged throw, landing bounce, and orientation settle", () => {
  assert.match(diceChargeSource, /diceStageElement\.dataset\.ready = String\(rollReady\)/);
  assert.match(diceStageSource, /function showReadyDice\(\)/);
  assert.match(diceStageSource, /if \(target\.dataset\.ready === "true"\) showReadyDice\(\)/);
  assert.match(diceStageSource, /const starts = dice\.map/);
  assert.match(diceStageSource, /const flightProgress = Math\.min\(1, progress \/ motion\.flightRatio\)/);
  assert.match(diceStageSource, /const travelProgress = smoothstep01\(flightProgress\)/);
  assert.match(diceStageSource, /const landingBounce = landingProgress > 0/);
  assert.match(diceStageSource, /const orientationBlend = smoothstep01\(landingProgress\)/);
  assert.match(diceStageSource, /die\.quaternion\.slerp\(finalRotations\[index\], orientationBlend\)/);
  assert.doesNotMatch(diceStageSource, /const eased = 1 - \(\(1 - progress\) \*\* 3\)/);
  assert.doesNotMatch(diceStageSource, /motion\.horizontalSpread \+ 0\.55/);
});

test("dice render through a transparent full-board orthographic overlay instead of a small clipped viewport", () => {
  assert.equal(DICE_OVERLAY_VIEW.projection, "orthographic");
  const bounds = createDiceOverlayBounds(1600, 900);
  assert.equal(bounds.top, DICE_OVERLAY_VIEW.baseViewSize / 2);
  assert.equal(bounds.bottom, -(DICE_OVERLAY_VIEW.baseViewSize / 2));
  assert.ok(bounds.right > bounds.top);
  assert.match(diceStageSource, /new THREE\.OrthographicCamera/);
  assert.doesNotMatch(diceStageSource, /new THREE\.PerspectiveCamera/);
  assert.match(playWindowCss, /body\[data-play-mode="window"\] \.dice-three-stage[\s\S]*inset:\s*0[\s\S]*width:\s*100%[\s\S]*height:\s*100%[\s\S]*transform:\s*none/);
});
