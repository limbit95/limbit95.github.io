import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const signup = readFileSync(new URL("../js/pages/signup.js", import.meta.url), "utf8");

test("signup OTP resend cooldown is visible and blocks resend until the countdown ends", () => {
  assert.match(signup, /const OTP_RESEND_MS = 60 \* 1000/);
  assert.match(signup, /const resendSeconds = Math\.max\(0, Math\.ceil\(\(resendAt - Date\.now\(\)\) \/ 1000\)\)/);
  assert.match(signup, /disabled: isVerified \|\| \(codeRequested && resendSeconds > 0\)/);
  assert.match(signup, /`재전송 \(\$\{resendSeconds\}초\)`/);
  assert.match(signup, /const resendLeft = Math\.max\(0, Math\.ceil\(\(resendAt - Date\.now\(\)\) \/ 1000\)\)/);
  assert.match(signup, /emailButton\.disabled = resendLeft > 0/);
  assert.match(signup, /`재전송 \(\$\{resendLeft\}초\)`/);
  assert.match(signup, /` · 재전송까지 \$\{resendLeft\}초 남음`/);
  assert.match(signup, /`재전송까지 \$\{resendLeft\}초 남았습니다\.`/);
  assert.match(signup, /resendAt = Date\.now\(\) \+ OTP_RESEND_MS/);
});
