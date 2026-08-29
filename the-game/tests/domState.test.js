import test from "node:test";
import assert from "node:assert/strict";

import { setHiddenIfChanged } from "../js/domState.js";

test("setHiddenIfChanged does not rewrite an unchanged hidden state", () => {
  let writes = 0;
  let hidden = true;
  const element = {
    get hidden() {
      return hidden;
    },
    set hidden(value) {
      writes += 1;
      hidden = value;
    },
  };

  assert.equal(setHiddenIfChanged(element, true), false);
  assert.equal(writes, 0);
  assert.equal(hidden, true);

  assert.equal(setHiddenIfChanged(element, false), true);
  assert.equal(writes, 1);
  assert.equal(hidden, false);

  assert.equal(setHiddenIfChanged(element, false), false);
  assert.equal(writes, 1);
});
