import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { getRegisteredGame } from "../games/shared/index.js";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("No Thanks! registry entry declares released shared capabilities", () => {
  const noThanks = getRegisteredGame("no-thanks");

  assert.equal(noThanks?.platform, "shared");
  assert.equal(noThanks?.href, "./games/no-thanks/");
  assert.equal(noThanks?.buttonText, "No Thanks! 시작");
  assert.deepEqual(noThanks?.capabilities, {
    online: true,
    local: false,
    invite: false,
    presence: true,
  });
});

test("main games page exposes No Thanks! as a playable card", () => {
  const gamesPage = readFileSync(
    path.join(repositoryRoot, "js", "pages", "games.js"),
    "utf8",
  );

  assert.match(gamesPage, /title: "No Thanks!"/u);
  assert.match(gamesPage, /href: "\\.\/games\/no-thanks\/"?/u);
  assert.match(gamesPage, /buttonText: "No Thanks! 시작"/u);
});
