import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const presenceSource = readFileSync(new URL("../js/onlinePresenceHud.js", import.meta.url), "utf8");

test("presence observer watches only player-card replacement, not its own badge mutations", () => {
  assert.match(presenceSource, /observer\.observe\(playerList, \{ childList: true \}\)/);
  assert.doesNotMatch(presenceSource, /observer\.observe\(playerList, \{ childList: true, subtree: true \}\)/);
});

test("presence badge text update is idempotent", () => {
  assert.match(presenceSource, /const label = CONNECTION_LABELS\[connection\]/);
  assert.match(presenceSource, /else if \(badge\.textContent !== label\)/);
});
