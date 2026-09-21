import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { getRegisteredGame } from "../games/shared/index.js";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("Can't Stop registry entry declares released shared capabilities", () => {
  const cantStop = getRegisteredGame("cant-stop");

  assert.equal(cantStop?.platform, "shared");
  assert.equal(cantStop?.href, "./games/cant-stop/");
  assert.deepEqual(cantStop?.capabilities, {
    online: true,
    local: false,
    invite: true,
    presence: false,
  });
  assert.equal(cantStop?.buttonText, "Can’t Stop 시작");
});

test("main games page exposes Can't Stop as a playable card", () => {
  const gamesPage = readFileSync(
    path.join(repositoryRoot, "js", "pages", "games.js"),
    "utf8",
  );

  assert.match(gamesPage, /title: "Can’t Stop"/u);
  assert.match(gamesPage, /href: "\.\/games\/cant-stop\/"?/u);
  assert.match(gamesPage, /buttonText: "Can’t Stop 시작"/u);
});
