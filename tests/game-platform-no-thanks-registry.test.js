import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { getRegisteredGame } from "../games/shared/index.js";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

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


test("No Thanks! stays off the public games page before release activation", () => {
  const gamesPage = readFileSync(
    path.join(repositoryRoot, "js", "pages", "games.js"),
    "utf8",
  );

  assert.doesNotMatch(gamesPage, /href: "\.\/games\/no-thanks\/"/u);
});
