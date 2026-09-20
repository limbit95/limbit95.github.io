import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createCantStopPairingPresentation,
  resolveCantStopPairingDiceGroups,
} from "../games/cant-stop/pairingPresentation.js";

test("Can't Stop pairing presentation resolves the actual dice groups for each server pairing", () => {
  assert.deepEqual(
    resolveCantStopPairingDiceGroups([1, 2, 3, 4], [3, 7]),
    [
      { dice: [1, 2], sum: 3 },
      { dice: [3, 4], sum: 7 },
    ],
  );
  assert.deepEqual(
    resolveCantStopPairingDiceGroups([1, 2, 3, 4], [4, 6]),
    [
      { dice: [1, 3], sum: 4 },
      { dice: [2, 4], sum: 6 },
    ],
  );
  assert.deepEqual(
    resolveCantStopPairingDiceGroups([1, 2, 3, 4], [5, 5]),
    [
      { dice: [1, 4], sum: 5 },
      { dice: [2, 3], sum: 5 },
    ],
  );
});

test("Can't Stop pairing presentation preserves server legal plans", () => {
  const view = createCantStopPairingPresentation(
    [1, 2, 3, 4],
    [
      { sums: [3, 7], plans: [[3, 7]] },
      { sums: [4, 6], plans: [[4], [6]] },
    ],
  );

  assert.equal(view.length, 2);
  assert.deepEqual(view[0].groups, [
    { dice: [1, 2], sum: 3 },
    { dice: [3, 4], sum: 7 },
  ]);
  assert.deepEqual(view[1].plans, [[4], [6]]);
  assert.ok(Object.isFrozen(view));
  assert.ok(view.every(Object.isFrozen));
});

test("Can't Stop pairing presentation returns null groups if dice are unavailable", () => {
  const view = createCantStopPairingPresentation(null, [
    { sums: [6, 8], plans: [[6, 8]] },
  ]);

  assert.equal(view[0].groups, null);
  assert.deepEqual(view[0].sums, [6, 8]);
});
