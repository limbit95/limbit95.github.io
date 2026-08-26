import process from "node:process";

const url = process.env.E2E_LOCAL_SUPABASE_URL;
const serviceRoleKey = process.env.E2E_LOCAL_SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.E2E_MEMBER_EMAIL ?? "member.e2e@example.com";
const password = process.env.E2E_MEMBER_PASSWORD ?? "Cheongpa-E2E-2026!";

if (!url || !serviceRoleKey) {
  throw new Error("Local Supabase URL and service-role key are required for E2E member setup.");
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

const user = await request("/auth/v1/admin/users", {
  method: "POST",
  body: JSON.stringify({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      display_name: "E2E 회원",
      real_name: "E2E 테스트",
      birth_year: "1990",
      age_visibility: "private",
      church_group: "E2E",
      request_message: "자동화 테스트 계정",
      privacy_policy_version: "2026-08",
      privacy_consent: true,
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
  body: JSON.stringify({ status: "approved", approved_at: approvedAt }),
});
await request(`/rest/v1/join_requests?user_id=eq.${encodeURIComponent(user.id)}`, {
  method: "PATCH",
  headers: { Prefer: "return=minimal" },
  body: JSON.stringify({ status: "approved" }),
});

console.log(`Prepared ephemeral approved E2E member ${email} (${user.id}).`);
