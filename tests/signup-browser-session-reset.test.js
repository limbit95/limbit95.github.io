import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const auth = readFileSync(new URL("../js/auth.js", import.meta.url), "utf8");

const initializeAuthBlock = auth.match(/export async function initializeAuth\(\)[\s\S]*?\n}\n\nexport async function signIn/)?.[0] ?? "";
const verifyOtpBlock = auth.match(/export async function verifySignupEmailCode\(email, code\)[\s\S]*?\n}\n\nexport async function submitSignupApplication/)?.[0] ?? "";
const submitBlock = auth.match(/export async function submitSignupApplication\(metadata\)[\s\S]*?\n}\n\nexport async function verifyEmailToken/)?.[0] ?? "";
const pendingSessionPredicateSource = auth.match(/function isPendingNativeSignupSession\(session\) \{[\s\S]*?\n}/)?.[0] ?? "";

function pendingSessionPredicate(profile) {
  assert.ok(pendingSessionPredicateSource, "pending signup session predicate should exist");
  return new Function(
    "state",
    `${pendingSessionPredicateSource}\nreturn isPendingNativeSignupSession;`,
  )({ profile });
}

const authOtpSession = {
  user: {
    id: "auth-otp-user",
    user_metadata: { signup_flow: "auth_otp" },
  },
};

test("completed auth_otp members keep their restored session even without a browser verification marker", () => {
  const isPendingNativeSignupSession = pendingSessionPredicate({
    id: authOtpSession.user.id,
    status: "approved",
  });

  assert.equal(isPendingNativeSignupSession(authOtpSession), false);
  assert.match(
    initializeAuthBlock,
    /await refreshAuthContext\(data\.session, \{ force: true \}\);[\s\S]*isPendingNativeSignupSession\(data\.session\)/,
  );
});

test("incomplete auth_otp members are reset when the browser verification marker is gone", () => {
  const isPendingNativeSignupSession = pendingSessionPredicate(null);

  assert.equal(isPendingNativeSignupSession(authOtpSession), true);
  assert.match(initializeAuthBlock, /readSignupVerificationSessionUserId\(\) !== data\.session\.user\.id/);
  assert.match(initializeAuthBlock, /supabase\.auth\.signOut\(\{ scope: "local" \}\)/);
});

test("incomplete signup verification only resumes within the current browser session", () => {
  assert.match(auth, /const SIGNUP_VERIFICATION_SESSION_KEY = "cheongpa:signup-verification-session"/);
  assert.match(auth, /window\.sessionStorage\?\.getItem\(SIGNUP_VERIFICATION_SESSION_KEY\)/);
  assert.match(auth, /window\.sessionStorage\?\.setItem\(SIGNUP_VERIFICATION_SESSION_KEY, userId\)/);
  assert.match(auth, /session\.user\.user_metadata\?\.signup_flow === "auth_otp"/);
  assert.match(auth, /session\?\.user[\s\S]*!state\.profile/);

  assert.match(verifyOtpBlock, /rememberSignupVerificationSession\(data\.session\.user\.id\)/);
  assert.match(initializeAuthBlock, /isPendingNativeSignupSession\(data\.session\)/);
  assert.match(initializeAuthBlock, /readSignupVerificationSessionUserId\(\) !== data\.session\.user\.id/);
  assert.match(initializeAuthBlock, /supabase\.auth\.signOut\(\{ scope: "local" \}\)/);
  assert.match(initializeAuthBlock, /clearSignupVerificationSession\(\)/);
  assert.match(initializeAuthBlock, /clearAuthContext\(\{ notify: false \}\)/);
  assert.match(submitBlock, /clearSignupVerificationSession\(\)/);
});
