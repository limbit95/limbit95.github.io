import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const signup = readFileSync(new URL("../js/pages/signup.js", import.meta.url), "utf8");
const edge = readFileSync(new URL("../supabase/functions/signup-verification/index.ts", import.meta.url), "utf8");
const migration = readFileSync(new URL("../supabase/site/migrations/20260909120000_multistep_signup_verification.sql", import.meta.url), "utf8");

test("signup is a four-step flow and only the final submit completes signup", () => {
  assert.match(signup, /const STEP_LABELS = \["약관 동의", "기본 정보", "회원 정보", "최종 확인"\]/);
  assert.equal((signup.match(/completeVerifiedSignup\(/g) ?? []).length, 1);
  assert.match(signup, /form\.addEventListener\("submit"/);
  assert.match(signup, /\[1, 2, 3\]\.every\(validateStep\)/);
});

test("required agreements and verified email gate navigation and final submission", () => {
  assert.match(signup, /!fields\.privacy_consent\.input\.checked/);
  assert.match(signup, /!fields\.rules_consent\.input\.checked/);
  assert.match(signup, /!verificationToken \|\| verifiedEmail !== fields\.email\.input\.value/);
  assert.match(signup, /normalized !== verifiedEmail\) invalidateVerification/);
});

test("server challenge hashes secrets, expires codes, throttles requests, and atomically consumes verification", () => {
  assert.match(edge, /CODE_TTL_MS = 5 \* 60 \* 1000/);
  assert.match(edge, /crypto\.subtle\.digest\("SHA-256"/);
  assert.doesNotMatch(migration, /\bcode\s+text/i);
  assert.match(edge, /emailCount \?\? 0\) >= 3/);
  assert.match(edge, /failed_attempts >= 5/);
  assert.match(edge, /\.is\("consumed_at", null\)\.select\("id"\)\.maybeSingle/);
  assert.match(edge, /email_confirm: true/);
});

test("database trigger independently requires both consents and verified-email server metadata", () => {
  assert.match(migration, /not v_privacy_consent or not v_rules_consent or not v_email_verified/);
  assert.match(migration, /alter table public\.signup_email_challenges enable row level security/);
  assert.match(migration, /revoke all on table public\.signup_email_challenges from public, anon, authenticated/);
  assert.match(migration, /p\.real_name/);
});

test("signup does not connect the push opt-in to browser Web Push APIs", () => {
  assert.doesNotMatch(signup, /Notification\.requestPermission|PushSubscription|push_subscriptions|web-push/);
});
