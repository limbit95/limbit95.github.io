import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const migrationPath = "supabase/site/migrations/20260913115928_join_request_admin_notifications.sql";
const cleanupMigrationPath = "supabase/site/migrations/20260914075722_remove_legacy_signup_email_verification.sql";
const edgeFunctionPath = "supabase/functions/send-web-push/index.ts";
const emailModulePath = "supabase/functions/_shared/email.ts";
const emailTransportPath = "supabase/functions/_shared/email-transport.ts";
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

test("join request email delivery goes through provider-neutral shared orchestration", async () => {
  const [source, email, transport, templates, layout] = await Promise.all([
    readFile(edgeFunctionPath, "utf8"),
    readFile(emailModulePath, "utf8"),
    readFile(emailTransportPath, "utf8"),
    readFile(emailTemplatesPath, "utf8"),
    readFile(emailLayoutPath, "utf8"),
  ]);

  assert.match(source, /import \{ sendUserEmail \} from "\.\.\/_shared\/email\.ts"/);
  assert.match(source, /template: "join_request_received"/);
  assert.match(source, /sendUserEmail\(/);
  assert.match(source, /const pushResultsPromise = Promise\.allSettled/);
  assert.match(source, /const emailPromise = EMAIL_TYPES\.has/);
  assert.match(source, /const \[results, email\] = await Promise\.all\(\[pushResultsPromise, emailPromise\]\)/);
  assert.match(source, /email\.failed > 0 \? 502 : 200/);
  assert.doesNotMatch(source, /nodemailer|smtp\.gmail\.com|SMTP_USERNAME|SMTP_PASSWORD|SMTP_FROM/i);
  assert.doesNotMatch(source, /api\.resend\.com|RESEND_API_KEY|SIGNUP_EMAIL_FROM/i);
  assert.doesNotMatch(source, /auth\/v1\/admin\/users/);

  assert.match(email, /from "\.\/email-transport\.ts"/);
  assert.match(email, /renderEmailTemplate/);
  assert.match(email, /sendRenderedEmail/);
  assert.match(email, /auth\/v1\/admin\/users\/\$\{encodeURIComponent\(userId\)\}/);
  assert.match(email, /reason: "EMAIL_RENDER_FAILED"/);
  assert.doesNotMatch(email, /nodemailer|smtp\.gmail\.com|SMTP_USERNAME|SMTP_PASSWORD|SMTP_FROM/i);
  assert.doesNotMatch(email, /api\.resend\.com|RESEND_API_KEY|SIGNUP_EMAIL_FROM/i);

  assert.match(transport, /import nodemailer from "npm:nodemailer@9\.1\.1"/);
  assert.match(transport, /const SMTP_HOST = "smtp\.gmail\.com"/);
  assert.match(transport, /const SMTP_PORT = 465/);
  assert.match(transport, /secure: true/);
  assert.match(transport, /SMTP_USERNAME/);
  assert.match(transport, /SMTP_PASSWORD/);
  assert.match(transport, /SMTP_FROM/);
  assert.match(transport, /export type RenderedEmailMessage/);
  assert.match(transport, /transport\.sendMail\(/);
  assert.match(transport, /messageId: messageIdFor\(idempotencyKey\)/);
  assert.match(transport, /X-Cheongpa-Idempotency-Key/);
  assert.match(transport, /subject: rendered\.subject/);
  assert.match(transport, /html: rendered\.html/);
  assert.match(transport, /text: rendered\.text/);
  assert.doesNotMatch(transport, /email-templates\.ts/);
  assert.doesNotMatch(transport, /api\.resend\.com|RESEND_API_KEY|SIGNUP_EMAIL_FROM/i);

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
  const [email, transport] = await Promise.all([
    readFile(emailModulePath, "utf8"),
    readFile(emailTransportPath, "utf8"),
  ]);

  assert.match(transport, /REQUIRED_TRANSPORT_SECRETS = \["SMTP_USERNAME", "SMTP_PASSWORD", "SMTP_FROM"\]/);
  assert.match(transport, /reason: "EMAIL_NOT_CONFIGURED", missing/);
  assert.match(transport, /function smtpErrorDetails\(error: unknown\)/);
  assert.match(transport, /providerStatus: providerStatus \?\? null/);
  assert.match(transport, /providerCode: providerCode \|\| null/);
  assert.match(transport, /reason: providerCode \? `SMTP_\$\{providerCode\}` : "SMTP_DELIVERY_FAILED"/);
  assert.doesNotMatch(transport, /console\.error\([^;]*\{[^}]*SMTP_PASSWORD[^}]*\}\s*\)/);
  assert.doesNotMatch(transport, /console\.error\([^;]*\{[^}]*\bto\b[^}]*\}\s*\)/);
  assert.doesNotMatch(email, /console\.error\([^;]*\{[^}]*\bemail\b[^}]*\}\s*\)/);
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
