import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const apiSource = readFileSync(new URL("../js/onlineGameApi.js", import.meta.url), "utf8");
const sessionSource = readFileSync(new URL("../js/onlineSession.js", import.meta.url), "utf8");
const exitSource = readFileSync(new URL("../js/onlineGameExit.js", import.meta.url), "utf8");

test("online game realtime subscribers use isolated channel topics", () => {
  assert.match(apiSource, /channelScope = "session"/);
  assert.match(apiSource, /marble-game:\$\{roomId\}:\$\{channelScope\}:\$\{actionId\(\)\}/);
  assert.match(sessionSource, /channelScope: "session"/);
  assert.match(exitSource, /channelScope: "exit"/);
});

test("online game snapshot remains usable if realtime setup throws synchronously", () => {
  assert.match(sessionSource, /try \{\s*unsubscribe = subscribeGame/);
  assert.match(sessionSource, /catch \(error\) \{/);
  assert.match(sessionSource, /onConnectionStatus\?\.\("CHANNEL_ERROR", error\)/);
  assert.match(sessionSource, /scheduleRecoveryRefresh\(\)/);
});
