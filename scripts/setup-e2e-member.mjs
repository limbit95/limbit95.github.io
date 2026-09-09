import { appendFile } from "node:fs/promises";
import process from "node:process";

const url = process.env.E2E_LOCAL_SUPABASE_URL;
const serviceRoleKey = process.env.E2E_LOCAL_SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.E2E_MEMBER_EMAIL;
const password = process.env.E2E_MEMBER_PASSWORD;
const role = process.env.E2E_MEMBER_ROLE ?? "member";
const outputEnvKey = process.env.E2E_OUTPUT_ENV_KEY ?? "";
const adminPermissions = (process.env.E2E_ADMIN_PERMISSIONS ?? "")
  .split(",")
  .map((permission) => permission.trim())
  .filter(Boolean);

if (!url || !serviceRoleKey) {
  throw new Error("Local Supabase URL and service-role key are required for E2E member setup.");
}
if (!email || !password) {
  throw new Error("E2E member email and password are required.");
}
if (!["member", "admin"].includes(role)) {
  throw new Error(`Unsupported E2E member role: ${role}`);
}
if (outputEnvKey && !/^[A-Z][A-Z0-9_]*$/.test(outputEnvKey)) {
  throw new Error(`Invalid E2E output env key: ${outputEnvKey}`);
}

const adminHeaders = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  "Content-Type": "application/json",
};

async function request(path, options = {}) {
  const response = await fetch(`${url}${path}`, {
    ...options,
    headers: {
      ...adminHeaders,
      ...(options.headers ?? {}),
    },
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${options.method ?? "GET"} ${path} failed (${response.status}): ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

const normalizedEmail = email.trim().toLowerCase();
const user = await request("/auth/v1/admin/users", {
  method: "POST",
  body: JSON.stringify({
    email: normalizedEmail,
    password,
    email_confirm: true,
    user_metadata: {
      display_name: role === "admin" ? "E2E 관리자" : "E2E 회원",
      real_name: role === "admin" ? "E2E 관리자 테스트" : "E2E 테스트",
      birth_year: "1990",
      age_visibility: "private",
      church_group: "E2E",
      request_message: "자동화 테스트 계정",
      privacy_policy_version: "2026-08",
      privacy_consent: true,
      community_rules_version: "2026-09",
      rules_consent: true,
    },
  }),
});

if (!user?.id) {
  throw new Error("Local Auth admin API did not return a user id.");
}

const approvedAt = new Date().toISOString();
await request(`/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}`, {
  method: "PATCH",
  headers: { Prefer: "return=minimal" },
  body: JSON.stringify({ status: "approved", approved_at: approvedAt, role }),
});
await request(`/rest/v1/join_requests?user_id=eq.${encodeURIComponent(user.id)}`, {
  method: "PATCH",
  headers: { Prefer: "return=minimal" },
  body: JSON.stringify({ status: "approved" }),
});

if (role === "admin" && adminPermissions.length) {
  await request("/rest/v1/admin_permissions", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(adminPermissions.map((permission) => ({
      user_id: user.id,
      permission,
    }))),
  });
}

if (outputEnvKey && process.env.GITHUB_ENV) {
  await appendFile(process.env.GITHUB_ENV, `${outputEnvKey}=${user.id}\n`, "utf8");
}

console.log(`Prepared ephemeral approved E2E ${role} ${normalizedEmail} (${user.id}).`);
