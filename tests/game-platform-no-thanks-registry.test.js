import assert from "node:assert/strict";
import { test } from "node:test";

import { getRegisteredGame } from "../games/shared/index.js";

test("No Thanks! registry entry stays shared but inactive until release", () => {
  const noThanks = getRegisteredGame("no-thanks");

  assert.equal(noThanks?.platform, "shared");
  assert.equal(noThanks?.href, "./games/no-thanks/");
  assert.equal(noThanks?.buttonText, "No Thanks! 시작");
  assert.deepEqual(noThanks?.capabilities, {
    online: false,
    local: false,
    invite: false,
    presence: false,
  });
});
