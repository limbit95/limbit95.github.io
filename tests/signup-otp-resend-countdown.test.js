import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const signup = readFileSync(new URL("../js/pages/signup.js", import.meta.url), "utf8");

test("signup OTP resend cooldown is visible and blocks resend until the countdown ends", () => {
  assert.match(signup, /const OTP_RESEND_MS = 60 \* 1000/);
  assert.match(signup, /const resendSeconds = Math\.max\(0, Math\.ceil\(\(resendAt - Date\.now\(\)\) \/ 1000\)\)/);
  assert.match(signup, /disabled: isVerified \|\| resendSeconds > 0/);
  assert.match(signup, /`재전송 \(\$\{resendSeconds\}초\)`/);
  assert.match(signup, /`인증번호 받기 \(\$\{resendSeconds\}초\)`/);
  assert.match(signup, /const resendLeft = Math\.max\(0, Math\.ceil\(\(resendAt - Date\.now\(\)\) \/ 1000\)\)/);
  assert.match(signup, /emailButton\.disabled = currentVerified \|\| resendLeft > 0/);
  assert.match(signup, /`재전송 \(\$\{resendLeft\}초\)`/);
  assert.match(signup, /`인증번호 받기 \(\$\{resendLeft\}초\)`/);
  assert.match(signup, /` · 재전송까지 \$\{resendLeft\}초 남음`/);
  assert.match(signup, /`재전송까지 \$\{resendLeft\}초 남았습니다\.`/);
});

test("signup OTP resend cooldown survives a full browser restart without storing credentials", () => {
  assert.match(signup, /const OTP_RESEND_STORAGE_KEY = "cheongpa:signup-otp-resend-cooldowns"/);
  assert.match(signup, /window\.localStorage/);
  assert.match(signup, /getOtpResendStorageKey\(normalized\)/);
  assert.match(signup, /persistOtpResendAt\(email, resendAt\)/);
  assert.match(signup, /resendAt = getStoredOtpResendAt\(normalized\)/);
  assert.match(signup, /resendAt = getStoredOtpResendAt\(currentEmail\)/);
  assert.match(signup, /`이전에 인증번호를 요청했습니다\. 재전송까지 \$\{resendLeft\}초 남음`/);
  assert.match(signup, /clearStoredOtpResendAt\(email\)/);
  assert.doesNotMatch(signup, /localStorage\.(?:setItem|getItem)\([^\n]*(?:password|verification_code|signup-code)/i);

  const verifyCodeBody = signup.slice(
    signup.indexOf("async function verifyCode"),
    signup.indexOf("function renderMemberInfo"),
  );
  assert.doesNotMatch(verifyCodeBody, /clearStoredOtpResendAt/);
  assert.match(verifyCodeBody, /Keep the last-send cooldown persisted until its natural 60-second expiry/);
});

test("signup OTP countdown interval stops after the signup form leaves the DOM", () => {
  const renderAccountBody = signup.slice(
    signup.indexOf("function renderAccount"),
    signup.indexOf("async function sendCode"),
  );
  // Keep the first tick synchronous, then require the recurring timer to self-clean after SPA route detachment.
  assert.match(renderAccountBody, /refreshResendCooldown = tick;\n    tick\(\);\n    timerId = setInterval\(\(\) => \{/);
  assert.match(renderAccountBody, /if \(!form\.isConnected\) \{/);
  assert.match(renderAccountBody, /clearInterval\(timerId\);\n        timerId = null;\n        refreshResendCooldown = null;\n        return;/);
  assert.doesNotMatch(renderAccountBody, /timerId = setInterval\(tick, 1000\)/);
});
