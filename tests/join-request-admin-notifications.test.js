import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const migrationPath = "supabase/site/migrations/20260913115928_join_request_admin_notifications.sql";
const cleanupMigrationPath = "supabase/site/migrations/20260914024000_remove_legacy_signup_email_verification.sql";
const edgeFunctionPath = "supabase/functions/send-web-push/index.ts";
const emailModulePath = "supabase/functions/_shared/email.ts";
const emailTemplatesPath = "supabase/functions/_shared/email-templates.ts";
const emailLayoutPath = "supabase/functions/_shared/email-layout.ts";
const authPath = "js/auth.js";

test("join requests notify the system admin and members-permission admins", async () => {
  const sql = await readFile(migrationPath, "utf8");

  assert.match(sql, /'join_request_received'::text/);
  assert.match(sql, /after insert on public\.join_requests/);
  assert.match(sql, /p\.role = 'system_admin'/);
  assert.match(sql, /p\.role = 'admin'[\s\S]*ap\.permission = 'members'/);
  assert.match(sql, /p\.status = 'approved'/);
  assert.match(sql, /'#\/admin\/approvals\?status=pending'/);
  assert.match(sql, /'join_request:' \|\| new\.user_id::text/);
  assert.match(sql, /on conflict \(user_id, dedupe_key\)[\s\S]*do nothing/);
});

test("join request notifications allow route-only targets", async () => {
  const sql = await readFile(migrationPath, "utf8");
  assert.match(sql, /notification_target_check[\s\S]*target_path is not null/);
});

test("join request email delivery goes through the shared email system", async () => {
  const [source, email, templates, layout] = await Promise.all([
    readFile(edgeFunctionPath, "utf8"),
    readFile(emailModulePath, "utf8"),
    readFile(emailTemplatesPath, "utf8"),
    readFile(emailLayoutPath, "utf8"),
  ]);

  assert.match(source, /import \{ sendUserEmail \} from "\.\.\/_shared\/email\.ts"/);
  assert.match(source, /template: "join_request_received"/);
  assert.match(source, /await sendUserEmail\(/);
  assert.match(source, /email\.failed > 0 \? 502 : 200/);
  assert.doesNotMatch(source, /api\.resend\.com/);
  assert.doesNotMatch(source, /SIGNUP_EMAIL_FROM/);
  assert.doesNotMatch(source, /auth\/v1\/admin\/users/);

  assert.match(email, /import nodemailer from "npm:nodemailer@9\.1\.1"/);
  assert.match(email, /const SMTP_HOST = "smtp\.gmail\.com"/);
  assert.match(email, /const SMTP_PORT = 465/);
  assert.match(email, /secure: true/);
  assert.match(email, /SMTP_USERNAME/);
  assert.match(email, /SMTP_PASSWORD/);
  assert.match(email, /SMTP_FROM/);
  assert.match(email, /auth\/v1\/admin\/users\/\$\{encodeURIComponent\(userId\)\}/);
  assert.match(email, /createSmtpTransport/);
  assert.match(email, /transport\.sendMail\(/);
  assert.match(email, /messageId: messageIdFor\(idempotencyKey\)/);
  assert.match(email, /X-Cheongpa-Idempotency-Key/);
  assert.match(email, /renderEmailTemplate/);
  assert.match(email, /html: rendered\.html/);
  assert.match(email, /text: rendered\.text/);
  assert.doesNotMatch(email, /api\.resend\.com/i);
  assert.doesNotMatch(email, /RESEND_API_KEY/);
  assert.doesNotMatch(email, /SIGNUP_EMAIL_FROM/);

  assert.match(templates, /EmailTemplateId = "join_request_received"/);
  assert.match(templates, /renderServiceEmailLayout/);
  assert.match(templates, /case "join_request_received"/);
  assert.match(templates, /가입 신청 확인하기/);
  assert.match(templates, /관리자 페이지에서 가입 신청 정보를 확인하고 처리해주세요/);

  assert.match(layout, /export function renderServiceEmailLayout/);
  assert.match(layout, /export function escapeHtml/);
  assert.match(layout, /<html lang="ko">/);
  assert.match(layout, /청파 같이/);
  assert.match(layout, /role="presentation"/);
  assert.match(layout, /action\.url/);
  assert.match(layout, /footerNote/);
  assert.doesNotMatch(layout, /<style[\s>]/i);
});

test("shared email failures keep explicit and safe SMTP diagnostics", async () => {
  const email = await readFile(emailModulePath, "utf8");

  assert.match(email, /REQUIRED_PROVIDER_SECRETS = \["SMTP_USERNAME", "SMTP_PASSWORD", "SMTP_FROM"\]/);
  assert.match(email, /reason: "EMAIL_NOT_CONFIGURED", missing/);
  assert.match(email, /function smtpErrorDetails\(error: unknown\)/);
  assert.match(email, /providerStatus: providerStatus \?\? null/);
  assert.match(email, /providerCode: providerCode \|\| null/);
  assert.match(email, /reason: providerCode \? `SMTP_\$\{providerCode\}` : "SMTP_DELIVERY_FAILED"/);
  assert.doesNotMatch(email, /console\.error\([^;]*\{[^}]*SMTP_PASSWORD[^}]*\}\s*\)/);
  assert.doesNotMatch(email, /console\.error\([^;]*\{[^}]*\brecipient\b[^}]*\}\s*\)/);
});

test("legacy custom signup email verification is removed in favor of Supabase Auth OTP", async () => {
  const [cleanupSql, authSource] = await Promise.all([
    readFile(cleanupMigrationPath, "utf8"),
    readFile(authPath, "utf8"),
  ]);

  assert.match(authSource, /supabase\.auth\.signInWithOtp\(/);
  assert.match(authSource, /supabase\.auth\.verifyOtp\(/);
  assert.doesNotMatch(authSource, /supabase\.auth\.signUp\(/);
  assert.doesNotMatch(authSource, /export async function signUp\(/);
  assert.match(cleanupSql, /drop function if exists public\.create_signup_email_challenge/);
  assert.match(cleanupSql, /drop function if exists public\.record_signup_email_failure/);
  assert.match(cleanupSql, /drop function if exists public\.verify_signup_email_challenge/);
  assert.match(cleanupSql, /drop function if exists public\.claim_signup_email_challenge/);
  assert.match(cleanupSql, /drop table if exists public\.signup_email_challenges/);
  await assert.rejects(access("supabase/functions/signup-verification/index.ts"));
});
