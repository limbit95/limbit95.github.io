import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const signup = readFileSync(new URL("../js/pages/signup.js", import.meta.url), "utf8");
const auth = readFileSync(new URL("../js/auth.js", import.meta.url), "utf8");
const app = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");
const infrastructure = readFileSync(new URL("../supabase/site/migrations/20260909062324_multistep_signup_verification.sql", import.meta.url), "utf8");
const transition = readFileSync(new URL("../supabase/site/migrations/20260909123000_native_auth_otp_signup.sql", import.meta.url), "utf8");
const enforcement = readFileSync(new URL("../supabase/site/migrations/20260909124500_enforce_native_auth_otp_signup.sql", import.meta.url), "utf8");
const setupE2E = readFileSync(new URL("../scripts/setup-e2e-member.mjs", import.meta.url), "utf8");
const prepareE2E = readFileSync(new URL("../scripts/prepare-e2e-supabase.mjs", import.meta.url), "utf8");

const signupSubmitBlock = signup.match(/form\.addEventListener\("submit"[\s\S]*?\n  \}\);/)?.[0] ?? "";

test("signup remains a four-step flow and only final submit creates the community application", () => {
  assert.match(signup, /const STEP_LABELS = \["약관 동의", "기본 정보", "회원 정보", "최종 확인"\]/);
  assert.match(signup, /form\.addEventListener\("submit"/);
  assert.equal((signup.match(/submitSignupApplication\(/g) ?? []).length, 1);
  assert.doesNotMatch(signup, /completeVerifiedSignup|verificationToken/);
  assert.match(signupSubmitBlock, /submitSignupApplication\(\{/);
});

test("email verification uses native Supabase Auth signup OTP and resend APIs", () => {
  assert.match(auth, /supabase\.auth\.signUp\(\{/);
  assert.match(auth, /data: \{ signup_flow: "auth_otp" \}/);
  assert.match(auth, /supabase\.auth\.resend\(\{[\s\S]*type: "signup"[\s\S]*email/);
  assert.match(auth, /supabase\.auth\.verifyOtp\(\{[\s\S]*email,[\s\S]*token: code,[\s\S]*type: "email"/);
  assert.doesNotMatch(auth, /functions\.invoke\("signup-verification"|invokeSignupVerification/);
  assert.doesNotMatch(auth, /RESEND_API_KEY|SIGNUP_VERIFICATION_PEPPER|SIGNUP_EMAIL_FROM/);
});

test("signup UI keeps six-digit verification, five-minute display and resend cooldown", () => {
  assert.match(signup, /OTP_TTL_MS = 5 \* 60 \* 1000/);
  assert.match(signup, /OTP_RESEND_MS = 60 \* 1000/);
  assert.match(signup, /maxlength: "6"/);
  assert.match(signup, /pattern: "\[0-9\]\{6\}"/);
  assert.match(signup, /verifySignupEmailCode\(email, input\.value\)/);
  assert.match(signup, /resendSignupEmailCode\(email\)/);
  assert.match(signup, /\["비밀번호", "설정됨"\]/);
});

test("native Auth users do not create profiles or join requests until final application", () => {
  assert.match(transition, /v_signup_flow text := nullif\(btrim\(v_metadata ->> 'signup_flow'\), ''\)/);
  assert.match(transition, /if v_signup_flow = 'auth_otp' then[\s\S]*return new;/);
  assert.match(transition, /Legacy frontend compatibility during the staged rollout/);
  assert.match(transition, /insert into public\.profiles/);
  assert.match(transition, /insert into public\.join_requests/);
});

test("final application RPC derives identity and verified email on the server", () => {
  assert.match(transition, /v_user_id uuid := auth\.uid\(\)/);
  assert.match(transition, /from auth\.users u[\s\S]*where u\.id = v_user_id/);
  assert.match(transition, /u\.email_confirmed_at/);
  assert.match(transition, /if v_email_confirmed_at is null then/);
  assert.doesNotMatch(transition, /submit_join_request\([^)]*p_user_id/);
  assert.doesNotMatch(transition, /submit_join_request\([^)]*p_email/);
  assert.match(transition, /values\(v_user_id,v_display_name,v_real_name/);
  assert.match(transition, /v_user_id,v_email,v_real_name/);
});

test("final application is transactional, serialized and idempotent", () => {
  assert.match(transition, /pg_advisory_xact_lock[\s\S]*submit-join:/);
  assert.match(transition, /if v_profile_exists and v_request_exists then[\s\S]*already_submitted', true/);
  assert.match(transition, /if v_profile_exists <> v_request_exists then[\s\S]*가입 신청 데이터 상태가 일치하지 않습니다/);
  assert.match(transition, /return jsonb_build_object\('submitted', true, 'already_submitted', false\)/);
  assert.match(transition, /^begin;[\s\S]*commit;\s*$/);
});

test("required privacy and community rules consents persist but push choice stays UI-only", () => {
  assert.match(transition, /privacy_consent_at,privacy_policy_version,rules_consent_at,community_rules_version/);
  assert.match(transition, /not coalesce\(p_privacy_consent, false\)/);
  assert.match(transition, /not coalesce\(p_rules_consent, false\)/);
  assert.match(signup, /\["푸시 알림 받기", fields\.push_opt_in\.input\.checked/);
  assert.doesNotMatch(signupSubmitBlock, /push_opt_in/);
  assert.doesNotMatch(transition, /push_opt_in/);
  assert.doesNotMatch(auth, /push_opt_in/);
});

test("authenticated users without a profile stay in or return to signup completion", () => {
  assert.match(app, /if \(!auth\.profile\) return "\/signup"/);
  assert.match(app, /routeInfo\.path === "\/signup" && !auth\.profile/);
  assert.match(app, /current === "\/signup" && auth\.user && !auth\.profile/);
  assert.match(signup, /existingAuth\.user && !existingAuth\.profile/);
});

test("historical phase-one migration remains preserved for real-name backfill", () => {
  assert.match(infrastructure, /create table public\.signup_email_challenges/);
  assert.match(infrastructure, /set real_name = nullif\(btrim\(j\.real_name\), ''\)/);
  assert.match(infrastructure, /p\.id = j\.user_id[\s\S]*p\.real_name is null/);
  assert.match(infrastructure, /rules_consent_at/);
  assert.match(infrastructure, /community_rules_version/);
});

test("final enforcement blocks browser bypass but permits explicitly trusted admin-created fixtures", () => {
  assert.match(transition, /Legacy frontend compatibility during the staged rollout/);
  assert.match(enforcement, /Final native Auth OTP enforcement/);
  assert.match(enforcement, /if v_signup_flow = 'auth_otp' then[\s\S]*return new;/);
  assert.match(enforcement, /new\.raw_app_meta_data[\s\S]*community_signup_source/);
  assert.match(enforcement, /new\.email_confirmed_at is null and coalesce\(v_trusted_signup_source, ''\) <> 'admin_create'/);
  assert.doesNotMatch(enforcement, /v_metadata ->> 'community_signup_source'/);
  assert.match(enforcement, /insert into public\.profiles/);
  assert.match(enforcement, /insert into public\.join_requests/);
  assert.match(setupE2E, /email_confirm: true/);
  assert.match(setupE2E, /app_metadata: \{[\s\S]*community_signup_source: "admin_create"/);
});

test("E2E fixtures no longer synthesize custom signup challenges", () => {
  assert.doesNotMatch(setupE2E, /signup_email_challenges|challengeId|verification_token_hash/);
  assert.doesNotMatch(prepareE2E, /e2e_prepare_pending_signup_fixture|signup_email_challenges/);
  assert.match(setupE2E, /community_rules_version: "2026-09"/);
  assert.match(setupE2E, /rules_consent: true/);
});
