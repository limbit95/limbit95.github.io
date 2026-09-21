import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const page = readFileSync(
  new URL("../games/no-thanks/index.html", import.meta.url),
  "utf8",
);
const runtime = readFileSync(
  new URL("../games/no-thanks/main.js", import.meta.url),
  "utf8",
);
const styles = readFileSync(
  new URL("../games/no-thanks/styles.css", import.meta.url),
  "utf8",
);

test("No Thanks! entry explicitly opts into the shared Game Shell", () => {
  assert.match(page, /\.\.\/shared\/game-shell\.css/u);
  assert.match(page, /\.\/main\.js/u);
  assert.match(runtime, /createGameShell/u);
  assert.match(runtime, /GAME_CONNECTION_STATE/u);
});

test("No Thanks! entry is protected by the approved-member Access Gate", () => {
  assert.match(runtime, /createGameAccessGate/u);
  assert.match(runtime, /initializeAuth/u);
  assert.match(runtime, /getAuthState/u);
  assert.match(runtime, /subscribeAuth/u);
  assert.match(runtime, /GAME_ACCESS_REASON\.AUTHENTICATION_REQUIRED/u);
  assert.match(runtime, /GAME_ACCESS_REASON\.APPROVAL_REQUIRED/u);
});

test("No Thanks! entry uses the site profile nickname without game-local nickname input", () => {
  assert.match(runtime, /profile\?\.display_name/u);
  assert.doesNotMatch(runtime, /prompt\s*\(/u);
  assert.doesNotMatch(runtime, /nickname|닉네임 입력|이름 입력/iu);
  assert.doesNotMatch(page, /<input\b/iu);
});

test("No Thanks! minimal shell exposes rules without pretending multiplayer is active", () => {
  assert.match(runtime, /게임 규칙 보기/u);
  assert.match(runtime, /방\/로비 연결은 다음 단계/u);
  assert.match(runtime, /방 생성·참가와 실제 멀티플레이는 다음 서버 단계/u);
  assert.match(styles, /\.no-thanks-rules/u);
});
