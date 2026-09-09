import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const signup = readFileSync(new URL("../js/pages/signup.js", import.meta.url), "utf8");

test("pending signup OTP keeps the requested email and password stable", () => {
  assert.match(signup, /const isAwaitingCode = codeRequested && !isVerified/);
  assert.match(signup, /fields\.email\.input\.disabled = isVerified \|\| isAwaitingCode/);
  assert.match(signup, /fields\.password\.input\.disabled = isVerified \|\| isAwaitingCode/);
  assert.match(signup, /인증을 완료하기 전에는 이메일과 비밀번호를 변경할 수 없습니다/);
});
