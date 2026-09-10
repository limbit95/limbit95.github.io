import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const auth = readFileSync(new URL("../js/auth.js", import.meta.url), "utf8");
const app = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");

const initializeAuthBlock = auth.match(/export async function initializeAuth\(\)[\s\S]*?\n}\n\nexport async function signIn/)?.[0] ?? "";
const getAuthStateBlock = auth.match(/export function getAuthState\(\) \{[\s\S]*?\n}\n\nexport function subscribeAuth/)?.[0] ?? "";
const channelBlock = auth.match(/function getSignupVerificationChannel\(\) \{[\s\S]*?\n}\n\nasync function restoreSignupVerificationSessionFromActiveTab/)?.[0] ?? "";
const restoreBlock = auth.match(/async function restoreSignupVerificationSessionFromActiveTab\(userId\) \{[\s\S]*?\n}\n\nfunction emit/)?.[0] ?? "";
const verifyOtpBlock = auth.match(/export async function verifySignupEmailCode\(email, code\)[\s\S]*?\n}\n\nexport async function submitSignupApplication/)?.[0] ?? "";
const submitBlock = auth.match(/export async function submitSignupApplication\(metadata\)[\s\S]*?\n}\n\nexport async function verifyEmailToken/)?.[0] ?? "";
const pendingSessionPredicateSource = auth.match(/function isPendingNativeSignupSession\(session\) \{[\s\S]*?\n}/)?.[0] ?? "";
const authDestinationBlock = app.match(/function authDestination\(auth = getAuthState\(\)\) \{[\s\S]*?\n}/)?.[0] ?? "";

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

test("completed auth_otp members keep their restored session without signup verification state", () => {
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

test("reopened incomplete signup keeps Supabase session but hides it until OTP is verified again", () => {
  const isPendingNativeSignupSession = pendingSessionPredicate(null);

  assert.equal(isPendingNativeSignupSession(authOtpSession), true);
  assert.match(getAuthStateBlock, /hidePendingSignupSession = isPendingNativeSignupSession\(state\.session\)/);
  assert.match(getAuthStateBlock, /session: visibleSession,[\s\S]*user: visibleUser/);
  assert.match(getAuthStateBlock, /isAuthenticated: Boolean\(visibleUser\)/);
  assert.doesNotMatch(initializeAuthBlock, /supabase\.auth\.signOut/);
  assert.doesNotMatch(initializeAuthBlock, /clearAuthContext\(\{ notify: false \}\)/);
});

test("active signup tab shares only verification state with another tab", () => {
  assert.match(auth, /const SIGNUP_VERIFICATION_CHANNEL_NAME = "cheongpa:signup-verification-channel"/);
  assert.match(channelBlock, /typeof window\.BroadcastChannel !== "function"\) return null/);
  assert.match(channelBlock, /new window\.BroadcastChannel\(SIGNUP_VERIFICATION_CHANNEL_NAME\)/);
  assert.match(channelBlock, /state\.user\?\.id !== message\.userId/);
  assert.match(channelBlock, /isPendingNativeSignupSession\(state\.session\)/);
  assert.match(channelBlock, /hasSignupVerificationSession\(message\.userId\)/);
  assert.match(channelBlock, /postMessage\(\{[\s\S]*type: "response",[\s\S]*requestId: message\.requestId,[\s\S]*userId: message\.userId/);
  assert.match(restoreBlock, /postMessage\(\{ type: "request", requestId, userId \}\)/);
  assert.match(restoreBlock, /rememberSignupVerificationSession\(userId\)/);
  assert.doesNotMatch(channelBlock, /password|display_name|real_name|birth_year|request_message/);
  assert.doesNotMatch(restoreBlock, /password|display_name|real_name|birth_year|request_message/);
});

test("active signup verification resumes signup when a new tab opens the site root", () => {
  assert.match(authDestinationBlock, /if \(!auth\.user\) return "\/login"/);
  assert.match(
    authDestinationBlock,
    /!auth\.profile && auth\.user\.user_metadata\?\.signup_flow === "auth_otp"\) return "\/signup"/,
  );
});

test("signup verification remains tab-scoped when no active tab responds", () => {
  assert.match(auth, /const SIGNUP_VERIFICATION_SESSION_KEY = "cheongpa:signup-verification-session"/);
  assert.match(auth, /window\.sessionStorage\?\.getItem\(SIGNUP_VERIFICATION_SESSION_KEY\)/);
  assert.match(auth, /window\.sessionStorage\?\.setItem\(SIGNUP_VERIFICATION_SESSION_KEY, userId\)/);
  assert.match(auth, /const SIGNUP_VERIFICATION_SYNC_TIMEOUT_MS = 200/);
  assert.match(restoreBlock, /window\.setTimeout\(\(\) => finish\(false\), SIGNUP_VERIFICATION_SYNC_TIMEOUT_MS\)/);
  assert.match(initializeAuthBlock, /restoreSignupVerificationSessionFromActiveTab\(data\.session\.user\.id\)/);
  assert.match(verifyOtpBlock, /rememberSignupVerificationSession\(data\.session\.user\.id\)/);
  assert.match(submitBlock, /clearSignupVerificationSession\(\)/);
});
