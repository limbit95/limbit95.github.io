import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const apiSource = readFileSync(new URL("../js/onlineGameApi.js", import.meta.url), "utf8");
const sessionSource = readFileSync(new URL("../js/onlineSession.js", import.meta.url), "utf8");
const presenceSource = readFileSync(new URL("../js/onlinePresenceHud.js", import.meta.url), "utf8");
const controlsCss = readFileSync(new URL("../css/online-game-controls.css", import.meta.url), "utf8");

test("online presence uses one shared room topic and tracks the current player", () => {
  assert.match(apiSource, /channel\(`marble-presence:\$\{roomId\}`/);
  assert.match(apiSource, /presence: \{ key: String\(playerId\) \}/);
  assert.match(apiSource, /channel\.track\(\{/);
  assert.match(apiSource, /playerId: String\(playerId\)/);
});

test("presence HUD distinguishes connected, disconnected, and checking players", () => {
  assert.match(presenceSource, /online: "접속 중"/);
  assert.match(presenceSource, /offline: "연결 끊김"/);
  assert.match(presenceSource, /checking: "연결 확인 중"/);
  assert.match(presenceSource, /card\.dataset\.connection = connection/);
  assert.match(controlsCss, /data-connection="offline"/);
  assert.match(controlsCss, /player-card__connection/);
});

test("online session falls back to snapshot refresh while realtime is recovering", () => {
  assert.match(sessionSource, /RECOVERY_REFRESH_MS = 3000/);
  assert.match(sessionSource, /function scheduleRecoveryRefresh\(\)/);
  assert.match(sessionSource, /\["CHANNEL_ERROR", "TIMED_OUT", "CLOSED"\]\.includes\(status\)/);
  assert.match(sessionSource, /if \(status === "SUBSCRIBED"\) \{\s*clearRecoveryTimer\(\)/);
  assert.match(sessionSource, /const handleOffline = \(\) => \{\s*onConnectionStatus\?\.\("OFFLINE"\);\s*scheduleRecoveryRefresh\(\)/);
  assert.match(sessionSource, /dispose\(\) \{\s*disposed = true;\s*clearRecoveryTimer\(\)/);
});
