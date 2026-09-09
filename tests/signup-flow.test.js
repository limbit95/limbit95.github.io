import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const signup = readFileSync(new URL("../js/pages/signup.js", import.meta.url), "utf8");
const auth = readFileSync(new URL("../js/auth.js", import.meta.url), "utf8");
const edge = readFileSync(new URL("../supabase/functions/signup-verification/index.ts", import.meta.url), "utf8");
const infrastructure = readFileSync(new URL("../supabase/site/migrations/20260909120000_multistep_signup_verification.sql", import.meta.url), "utf8");
const enforcement = readFileSync(new URL("../supabase/site/migrations/20260909123000_enforce_verified_signup.sql", import.meta.url), "utf8");

const combinedMigration = `${infrastructure}\n${enforcement}`;

test("signup is a four-step flow and only the final submit completes signup", () => {
  assert.match(signup, /const STEP_LABELS = \["약관 동의", "기본 정보", "회원 정보", "최종 확인"\]/);
  assert.equal((signup.match(/completeVerifiedSignup\(/g) ?? []).length, 1);
  assert.match(signup, /form\.addEventListener\("submit"/);
  assert.match(signup, /\[1, 2, 3\]\.every\(validateStep\)/);
});

test("required agreements and verified token gate final submission", () => {
  assert.match(signup, /!fields\.privacy_consent\.input\.checked/);
  assert.match(signup, /!fields\.rules_consent\.input\.checked/);
  assert.match(signup, /!verificationToken \|\| verifiedEmail !== fields\.email\.input\.value/);
  assert.match(edge, /\.eq\("verification_token_hash", tokenHash\)/);
  assert.match(edge, /\.gte\("verified_at", validSince\)/);
  assert.match(edge, /if \(!challenge\) return fail\("EMAIL_NOT_VERIFIED"/);
  assert.match(edge, /if \(challenge\.consumed_at\)/);
});

test("caller-controlled user metadata cannot bypass verified signup", () => {
  assert.doesNotMatch(enforcement, /raw_user_meta_data[^\n]*signup_email_verified|v_metadata ->> 'signup_email_verified'/);
  assert.match(enforcement, /new\.raw_app_meta_data ->> 'signup_verification_challenge_id'/);
  assert.match(enforcement, /c\.id = v_challenge_id and c\.email = lower\(new\.email\)/);
  assert.match(enforcement, /c\.verified_at is not null and c\.consumed_at is not null/);
  assert.match(edge, /app_metadata: \{ signup_verification_challenge_id: challenge\.id \}/);
  assert.doesNotMatch(edge, /signup_email_verified/);
});

test("code failure and success transitions are atomic and capped at five", () => {
  assert.match(infrastructure, /set failed_attempts = failed_attempts \+ 1/);
  assert.match(infrastructure, /and failed_attempts < 5[\s\S]*returning failed_attempts into v_attempts/);
  assert.match(infrastructure, /and code_hash = p_code_hash[\s\S]*and expires_at >[\s\S]*and failed_attempts < 5/);
  assert.match(edge, /rpc\("record_signup_email_failure"/);
  assert.match(edge, /rpc\("verify_signup_email_challenge"/);
  assert.match(edge, /CODE_TTL_MS = 5 \* 60 \* 1000/);
});

test("challenge creation rate limits are serialized in the database", () => {
  assert.match(infrastructure, /pg_advisory_xact_lock[\s\S]*signup-email:/);
  assert.match(infrastructure, /pg_advisory_xact_lock[\s\S]*signup-ip:/);
  assert.match(infrastructure, />= 3[\s\S]*>= 10[\s\S]*SIGNUP_RATE_LIMITED/);
  assert.match(edge, /rpc\("create_signup_email_challenge"/);
});

test("verification is consumed once and retry recovers a completed account", () => {
  assert.match(edge, /\.is\("consumed_at", null\)\.select\("id"\)\.maybeSingle/);
  assert.match(edge, /existingSession[\s\S]*recovered: true/);
  assert.match(edge, /sign_in_required: true/);
  assert.match(edge, /email_confirm: true/);
});

test("completed signup routes according to whether sign-in is required", () => {
  assert.match(signup, /const result = await completeVerifiedSignup\(/);
  assert.match(signup, /if \(result\.sign_in_required === true\)[\s\S]*가입 신청은 정상적으로 완료되었습니다[\s\S]*#\/login/);
  assert.match(signup, /가입 신청이 완료되었습니다\. 관리자의 승인을 기다려 주세요\.[\s\S]*#\/pending/);
  assert.match(auth, /if \(data\?\.session\?\.access_token && data\?\.session\?\.refresh_token\) \{[\s\S]*supabase\.auth\.setSession\(data\.session\)[\s\S]*refreshAuthContext\(sessionData\.session/);
});

test("signup persists profiles, real names and consent but no push preference", () => {
  assert.match(enforcement, /insert into public\.profiles\(id,display_name,real_name/);
  assert.match(enforcement, /insert into public\.join_requests/);
  assert.match(enforcement, /privacy_consent_at,privacy_policy_version,rules_consent_at,community_rules_version/);
  assert.doesNotMatch(combinedMigration, /push_opt_in/);
  assert.doesNotMatch(edge, /push_opt_in/);
  assert.doesNotMatch(signup.match(/metadata: \{[\s\S]*?\n        \},/)?.[0] ?? "", /push_opt_in/);
  assert.match(signup, /\["푸시 알림 받기", fields\.push_opt_in\.input\.checked/);
  assert.doesNotMatch(signup, /Notification\.requestPermission|PushSubscription|push_subscriptions|web-push/);
});

test("existing real names are backfilled without overwriting profiles", () => {
  assert.match(infrastructure, /set real_name = nullif\(btrim\(j\.real_name\), ''\)/);
  assert.match(infrastructure, /p\.id = j\.user_id[\s\S]*p\.real_name is null/);
  assert.match(infrastructure, /p\.status='approved'/);
  assert.match(infrastructure, /if not private\.is_approved_member\(\)/);
  assert.doesNotMatch(infrastructure, /set (email|request_message|admin_note)\s*=/);
});

test("challenge RPCs and table are service-role only", () => {
  assert.match(infrastructure, /alter table public\.signup_email_challenges enable row level security/);
  assert.match(infrastructure, /revoke all on table public\.signup_email_challenges from public, anon, authenticated/);
  for (const signature of [
    "create_signup_email_challenge\\(text,text,text,timestamptz\\)",
    "record_signup_email_failure\\(uuid\\)",
    "verify_signup_email_challenge\\(uuid,text,text\\)",
  ]) {
    assert.match(infrastructure, new RegExp(`revoke all on function public\\.${signature} from public, anon, authenticated`));
    assert.match(infrastructure, new RegExp(`grant execute on function public\\.${signature} to service_role`));
  }
});

test("rollout keeps the old trigger until the final enforcement migration", () => {
  assert.match(infrastructure, /Backward-compatible trigger for the rollout window/);
  assert.doesNotMatch(infrastructure, /raw_app_meta_data ->> 'signup_verification_challenge_id'/);
  assert.match(enforcement, /Phase 4: apply only after signup-verification and the new frontend are deployed/);
  assert.match(enforcement, /create or replace function private\.handle_new_auth_user/);
});
