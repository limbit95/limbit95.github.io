import test from "node:test";
import assert from "node:assert/strict";

import {
  DICE_CHARGE_PROFILE,
  chargeStrengthAtElapsed,
  chargeValueAtElapsed,
} from "../js/diceCharge.js";
import { normalizeRollStrength, rollAnimationProfile } from "../js/diceStage.js";

test("dice charge oscillates from low to high and back down", () => {
  assert.ok(chargeValueAtElapsed(0) < 0.01);
  assert.ok(chargeValueAtElapsed(DICE_CHARGE_PROFILE.cycleMs / 2) > 0.99);
  assert.ok(chargeValueAtElapsed(DICE_CHARGE_PROFILE.cycleMs) < 0.01);
  assert.ok(chargeStrengthAtElapsed(DICE_CHARGE_PROFILE.cycleMs / 2) > 0.95);
});

test("dice visual strength changes animation energy without changing dice faces", () => {
  assert.equal(normalizeRollStrength(-1), 0);
  assert.equal(normalizeRollStrength(2), 1);
  const weak = rollAnimationProfile(0.2);
  const strong = rollAnimationProfile(0.95);
  assert.ok(strong.durationMs > weak.durationMs);
  assert.ok(strong.throwHeight > weak.throwHeight);
  assert.ok(strong.spinMultiplier > weak.spinMultiplier);
  assert.ok(strong.bounceHeight > weak.bounceHeight);
});
