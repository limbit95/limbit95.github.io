import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationPath = "supabase/site/migrations/20260913115928_join_request_admin_notifications.sql";
const edgeFunctionPath = "supabase/functions/send-web-push/index.ts";

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

test("join request delivery reuses web push and Resend for the admin recipient", async () => {
  const source = await readFile(edgeFunctionPath, "utf8");

  assert.match(source, /"join_request_received"/);
  assert.match(source, /EMAIL_TYPES = new Set\(\["join_request_received"\]\)/);
  assert.match(source, /auth\/v1\/admin\/users\/\$\{encodeURIComponent\(userId\)\}/);
  assert.match(source, /RESEND_API_KEY/);
  assert.match(source, /SIGNUP_EMAIL_FROM/);
  assert.match(source, /to: \[email\]/);
  assert.match(source, /Idempotency-Key/);
  assert.match(source, /adminTargetUrl/);
  assert.match(source, /await sendAdminEmail\(notification\)/);
});

test("join request email misconfiguration is explicit and does not look successful", async () => {
  const source = await readFile(edgeFunctionPath, "utf8");

  assert.match(source, /EMAIL_SECRET_NAMES = \["RESEND_API_KEY", "SIGNUP_EMAIL_FROM"\]/);
  assert.match(source, /missingEmailSecrets\(\)/);
  assert.match(source, /reason: "EMAIL_NOT_CONFIGURED", missing/);
  assert.match(source, /email\.failed > 0 \? 502 : 200/);
});

test("Resend failures expose only safe provider diagnostics", async () => {
  const source = await readFile(edgeFunctionPath, "utf8");

  assert.match(source, /providerCode = String\(providerError\?\.name \?\? providerError\?\.code/);
  assert.match(source, /reason: `RESEND_\$\{response\.status\}`/);
  assert.doesNotMatch(source, /console\.error\([^\n]*RESEND_API_KEY/);
});
