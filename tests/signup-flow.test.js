import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const signup = readFileSync(new URL("../js/pages/signup.js", import.meta.url), "utf8");
const auth = readFileSync(new URL("../js/auth.js", import.meta.url), "utf8");
const app = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");
const ui = readFileSync(new URL("../js/ui.js", import.meta.url), "utf8");
const componentsCss = readFileSync(new URL("../css/components.css", import.meta.url), "utf8");
const infrastructure = readFileSync(new URL("../supabase/site/migrations/20260909062324_multistep_signup_verification.sql", import.meta.url), "utf8");
const transition = readFileSync(new URL("../supabase/site/migrations/20260909094910_native_auth_otp_signup.sql", import.meta.url), "utf8");
const enforcement = readFileSync(new URL("../supabase/site/migrations/20260909124500_enforce_native_auth_otp_signup.sql", import.meta.url), "utf8");
const existingEmailGuard = readFileSync(new URL("../supabase/site/migrations/20260909221237_signup_existing_email_guard.sql", import.meta.url), "utf8");
const setupE2E = readFileSync(new URL("../scripts/setup-e2e-member.mjs", import.meta.url), "utf8");
const prepareE2E = readFileSync(new URL("../scripts/prepare-e2e-supabase.mjs", import.meta.url), "utf8");

const signupSubmitBlock = signup.match(/form\.addEventListener\("submit"[\s\S]*?\n  \}\);/)?.[0] ?? "";
const sendCodeBlock = signup.match(/async function sendCode\(\)[\s\S]*?\n  \}/)?.[0] ?? "";

test("signup uses the combined three-step flow and only final submit creates the community application", () => {
  assert.match(signup, /const STEP_LABELS = \["약관 동의", "회원 정보", "최종 확인"\]/);
  assert.match(signup, /form\.addEventListener\("submit"/);
  assert.equal((signup.match(/submitSignupApplication\(/g) ?? []).length, 1);
  assert.doesNotMatch(signup, /completeVerifiedSignup|verificationToken/);
  assert.match(signupSubmitBlock, /submitSignupApplication\(\{/);
});

test("email verification uses native passwordless Supabase OTP with signup metadata", () => {
  assert.match(auth, /supabase\.auth\.signInWithOtp\(\{/);
  assert.match(auth, /shouldCreateUser: true/);
  assert.match(auth, /data: \{ signup_flow: "auth_otp" \}/);
  assert.match(auth, /export async function requestSignupEmailCode\(email\)[\s\S]*assertSignupEmailAvailable\(email\)[\s\S]*sendSignupEmailCode\(email\)/);
  assert.match(auth, /export async function resendSignupEmailCode\(email\)[\s\S]*assertSignupEmailAvailable\(email\)[\s\S]*sendSignupEmailCode\(email\)/);
  assert.match(auth, /supabase\.auth\.verifyOtp\(\{[\s\S]*email,[\s\S]*token: code,[\s\S]*type: "email"/);
  assert.doesNotMatch(auth, /functions\.invoke\("signup-verification"|invokeSignupVerification/);
  assert.doesNotMatch(auth, /RESEND_API_KEY|SIGNUP_VERIFICATION_PEPPER|SIGNUP_EMAIL_FROM/);
});

test("registered emails are blocked before OTP is sent and guided to account recovery", () => {
  assert.match(auth, /supabase\.rpc\("get_signup_email_status", \{ p_email: email \}\)/);
  assert.match(auth, /if \(data === "registered"\)/);
  assert.match(auth, /registeredError\.code = "signup_email_registered"/);
  assert.match(signup, /error\?\.code === "signup_email_registered"/);
  assert.match(signup, /이미 가입되어 있는 이메일입니다/);
  assert.match(signup, /기존 계정으로 로그인해 주세요/);
  assert.match(signup, /href: "#\/login", text: "로그인하기"/);
  assert.match(signup, /href: "#\/forgot-password", text: "비밀번호 찾기"/);
  assert.match(existingEmailGuard, /create or replace function public\.get_signup_email_status\(p_email text\)/);
  assert.match(existingEmailGuard, /exists\(select 1 from public\.profiles p where p\.id = v_user_id\)/);
  assert.match(existingEmailGuard, /exists\(select 1 from public\.join_requests j where j\.user_id = v_user_id\)/);
  assert.match(existingEmailGuard, /coalesce\(v_signup_flow, ''\) <> 'auth_otp'/);
  assert.match(existingEmailGuard, /return 'available'/);
  assert.match(existingEmailGuard, /grant execute on function public\.get_signup_email_status\(text\) to anon/);
});

test("signup OTP request only requires email and password is set after verification", () => {
  assert.match(sendCodeBlock, /requestSignupEmailCode\(email\)/);
  assert.match(sendCodeBlock, /resendSignupEmailCode\(email\)/);
  assert.doesNotMatch(sendCodeBlock, /validatePassword|fields\.password\.input\.value/);
  assert.match(signup, /fields\.password\.input\.disabled = !isVerified/);
  assert.match(signup, /fields\.password_confirm\.input\.disabled = !isVerified/);
  assert.match(signup, /if \(isVerified\) \{[\s\S]*fields\.password\.root,[\s\S]*fields\.password_confirm\.root/);
  assert.match(signup, /const password = fields\.password\.input\.value/);
  assert.match(signup, /await updatePassword\(password\)/);
  assert.match(signup, /if \(!validatePassword\(fields\.password\.input\.value\)\)/);
  assert.match(signup, /fields\.password\.input\.value !== fields\.password_confirm\.input\.value/);
});

test("verified auth-only signup sessions resume at member-info step after reload", () => {
  assert.match(signup, /const existingVerifiedEmail = existingAuth\.user && !existingAuth\.profile/);
  assert.match(signup, /let step = existingVerifiedEmail \? 2 : 1/);
  assert.match(signup, /if \(existingVerifiedEmail\) \{[\s\S]*fields\.email\.input\.value = existingVerifiedEmail/);
  assert.match(signup, /fields\.privacy_consent\.input\.checked = true/);
  assert.match(signup, /fields\.rules_consent\.input\.checked = true/);
});

test("signup member-info renderer keeps nullable nodes out and aligns action with email input", () => {
  assert.match(signup, /el\("div", \{ className: "signup-email-row" \}, \[fields\.email\.input, emailButton\]\)/);
  assert.match(signup, /panel\.replaceChildren\(\.\.\.memberChildren\.filter\(Boolean\)\)/);
  assert.doesNotMatch(signup, /panel\.replaceChildren\(\s*emailRow,[\s\S]*\?[^:]+:\s*null/);
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

test("busy actions block the app with a full-screen processing overlay", () => {
  assert.match(ui, /const busyRequests = new Map\(\)/);
  assert.match(ui, /className: "global-loading"/);
  assert.match(ui, /formOrButton\.querySelectorAll\("button"\)/);
  assert.match(ui, /document\.getElementById\("app"\)\?\.setAttribute\("inert", ""\)/);
  assert.match(ui, /document\.getElementById\("app"\)\?\.removeAttribute\("inert"\)/);
  assert.match(componentsCss, /\.global-loading \{[\s\S]*position: fixed;[\s\S]*inset: 0;[\s\S]*z-index: 3000/);
  assert.match(signup, /인증번호를 보내고 있어요…/);
  assert.match(signup, /인증번호를 확인하고 있어요…/);
});

test("native Auth users do not create profiles or join requests until final application", () => {
  assert.match(transition, /v_signup_flow text := nullif\(btrim\(v_metadata ->> 'signup_flow'\), ''\)/);
  assert.match(transition, /if v_signup_flow = 'auth_otp' then[\s\S]*return new;/);
  assert.match(transition, /Legacy frontend compatibility during the staged rollout/);
  assert.match(transition, /insert into public\.profiles/);
  assert.match(transition, /insert into public\.join_requests/);
});

test("historical final application RPC derives identity and verified email on the server", () => {
  assert.match(transition, /v_user_id uuid := auth\.uid\(\)/);
  assert.match(transition, /from auth\.users u[\s\S]*where u\.id = v_user_id/);
  assert.match(transition, /u\.email_confirmed_at/);
  assert.match(transition, /if v_email_confirmed_at is null then/);
  assert.doesNotMatch(transition, /submit_join_request\([^)]*p_user_id/);
  assert.doesNotMatch(transition, /submit_join_request\([^)]*p_email/);
  assert.match(transition, /values\(v_user_id,v_display_name,v_real_name/);
  assert.match(transition, /v_user_id,v_email,v_real_name/);
});

test("historical final application remains transactional, serialized and idempotent", () => {
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

test("auth-only signup sessions can return to login while explicit signup still resumes", () => {
  assert.match(app, /if \(!auth\.profile\) return "\/login"/);
  assert.match(app, /if \(!auth\.profile && \["\/signup", "\/login"\]\.includes\(routeInfo\.path\)\) return true/);
  assert.match(app, /if \(\["\/signup", "\/login"\]\.includes\(current\) && auth\.user && !auth\.profile\) return/);
  assert.match(signup, /existingAuth\.user && !existingAuth\.profile/);
});

test("historical phase-one migration remains preserved for real-name backfill", () => {
  assert.match(infrastructure, /create table public\.signup_email_challenges/);
  assert.match(infrastructure, /set real_name = nullif\(btrim\(j\.real_name\), ''\)/);
  assert.match(infrastructure, /p\.id = j\.user_id[\s\S]*p\.real_name is null/);
  assert.match(infrastructure, /rules_consent_at/);
  assert.match(infrastructure, /community_rules_version/);
});

test("final enforcement makes submit_join_request the only community-application creation path", () => {
  assert.match(enforcement, /create or replace function private\.handle_new_auth_user\(\)/);
  assert.match(enforcement, /if new\.email is null then/);
  assert.match(enforcement, /return new;/);
  assert.doesNotMatch(enforcement, /raw_user_meta_data|raw_app_meta_data|signup_flow/);
  assert.doesNotMatch(enforcement, /insert into public\.profiles|insert into public\.join_requests/);
  assert.match(enforcement, /^begin;[\s\S]*commit;\s*$/);
});

test("E2E fixtures create community rows explicitly after Auth user creation", () => {
  assert.doesNotMatch(setupE2E, /signup_email_challenges|challengeId|verification_token_hash/);
  assert.doesNotMatch(prepareE2E, /e2e_prepare_pending_signup_fixture|signup_email_challenges/);
  assert.match(setupE2E, /\/rest\/v1\/profiles\?on_conflict=id/);
  assert.match(setupE2E, /\/rest\/v1\/join_requests\?on_conflict=user_id/);
  assert.match(setupE2E, /community_rules_version: "2026-09"/);
  assert.match(setupE2E, /rules_consent_at: approvedAt/);
});
