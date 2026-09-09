import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_TTL_MS = 5 * 60 * 1000;
const TOKEN_TTL_MS = 30 * 60 * 1000;

function env(name: string) { return String(Deno.env.get(name) ?? "").trim(); }
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
}
function fail(error: string, message: string, status = 400) { return json({ error, message }, status); }
function normalizeEmail(value: unknown) { return String(value ?? "").trim().toLocaleLowerCase("en-US"); }
function randomDigits() {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return String(new DataView(bytes.buffer).getUint32(0) % 1_000_000).padStart(6, "0");
}
function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}
async function digest(value: string) {
  const data = new TextEncoder().encode(`${env("SIGNUP_VERIFICATION_PEPPER")}:${value}`);
  return [...new Uint8Array(await crypto.subtle.digest("SHA-256", data))].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
function ip(request: Request) { return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown"; }
function admin() { return createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false, autoRefreshToken: false } }); }

async function emailAlreadyRegistered(client: ReturnType<typeof admin>, email: string) {
  const { data: joins } = await client.from("join_requests").select("user_id").ilike("email", email).limit(1);
  if (joins?.length) return true;
  for (let page = 1; page <= 5; page += 1) {
    const { data, error } = await client.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    if (data.users.some((user) => user.email?.toLocaleLowerCase("en-US") === email)) return true;
    if (data.users.length < 200) break;
  }
  return false;
}

async function requestCode(request: Request, body: Record<string, unknown>) {
  const email = normalizeEmail(body.email);
  if (!EMAIL_PATTERN.test(email) || email.length > 320) return fail("INVALID_EMAIL", "올바른 이메일 주소를 입력해 주세요.");
  const client = admin();
  // 별도 cron 없이도 단기 challenge와 요청 IP hash가 오래 남지 않도록 정리한다.
  await client.from("signup_email_challenges").delete().lt("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
  if (await emailAlreadyRegistered(client, email)) return fail("EMAIL_EXISTS", "이미 가입했거나 가입 신청에 사용된 이메일입니다.", 409);
  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const ipHash = await digest(ip(request));
  const [{ count: emailCount }, { count: ipCount }] = await Promise.all([
    client.from("signup_email_challenges").select("id", { count: "exact", head: true }).eq("email", email).gte("created_at", since),
    client.from("signup_email_challenges").select("id", { count: "exact", head: true }).eq("request_ip_hash", ipHash).gte("created_at", since),
  ]);
  if ((emailCount ?? 0) >= 3 || (ipCount ?? 0) >= 10) return fail("RATE_LIMITED", "인증 요청이 너무 많습니다. 15분 후 다시 시도해 주세요.", 429);
  const code = randomDigits();
  const expiresAt = new Date(Date.now() + CODE_TTL_MS).toISOString();
  const { data: inserted, error } = await client.from("signup_email_challenges").insert({ email, code_hash: await digest(`${email}:${code}`), request_ip_hash: ipHash, expires_at: expiresAt }).select("id").single();
  if (error) throw error;
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { authorization: `Bearer ${env("RESEND_API_KEY")}`, "content-type": "application/json" }, body: JSON.stringify({ from: env("SIGNUP_EMAIL_FROM"), to: [email], subject: "[청파 같이] 이메일 인증번호", html: `<p>청파 같이 회원가입 인증번호입니다.</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</p><p>인증번호는 5분 동안 유효합니다. 본인이 요청하지 않았다면 이 메일을 무시하세요.</p>` }) });
  if (!response.ok) {
    await client.from("signup_email_challenges").delete().eq("id", inserted.id);
    throw new Error(`EMAIL_DELIVERY_${response.status}`);
  }
  return json({ expires_at: expiresAt, retry_after: 60 });
}

async function verifyCode(body: Record<string, unknown>) {
  const email = normalizeEmail(body.email);
  const code = String(body.code ?? "").trim();
  if (!EMAIL_PATTERN.test(email) || !/^\d{6}$/.test(code)) return fail("INVALID_CODE", "인증번호를 확인해 주세요.");
  const client = admin();
  const { data: rows, error } = await client.from("signup_email_challenges").select("id,code_hash,expires_at,verified_at,failed_attempts").eq("email", email).is("consumed_at", null).order("created_at", { ascending: false }).limit(1);
  if (error) throw error;
  const challenge = rows?.[0];
  if (!challenge) return fail("CHALLENGE_NOT_FOUND", "인증번호를 먼저 요청해 주세요.", 404);
  if (challenge.verified_at) return fail("ALREADY_VERIFIED", "이미 인증이 완료되었습니다.", 409);
  if (Date.parse(challenge.expires_at) <= Date.now()) return fail("CODE_EXPIRED", "인증번호가 만료되었습니다. 재전송해 주세요.", 410);
  if (challenge.failed_attempts >= 5) return fail("TOO_MANY_ATTEMPTS", "인증 시도 횟수를 초과했습니다. 새 인증번호를 요청해 주세요.", 429);
  if (await digest(`${email}:${code}`) !== challenge.code_hash) {
    await client.from("signup_email_challenges").update({ failed_attempts: challenge.failed_attempts + 1 }).eq("id", challenge.id);
    return fail("INVALID_CODE", "인증번호가 올바르지 않습니다.");
  }
  const token = randomToken();
  const { error: updateError } = await client.from("signup_email_challenges").update({ verified_at: new Date().toISOString(), verification_token_hash: await digest(token) }).eq("id", challenge.id).is("verified_at", null);
  if (updateError) throw updateError;
  return json({ verification_token: token });
}

async function completeSignup(body: Record<string, unknown>) {
  const email = normalizeEmail(body.email);
  const password = String(body.password ?? "");
  const token = String(body.verification_token ?? "");
  const metadata = typeof body.metadata === "object" && body.metadata ? body.metadata as Record<string, unknown> : {};
  if (!EMAIL_PATTERN.test(email) || password.length < 8 || !token) return fail("INVALID_SIGNUP", "필수 가입 정보를 확인해 주세요.");
  if (metadata.privacy_consent !== true || metadata.rules_consent !== true) return fail("CONSENT_REQUIRED", "필수 약관 동의가 필요합니다.");
  const required = ["display_name", "real_name", "birth_year", "age_visibility", "church_group", "request_message", "privacy_policy_version", "community_rules_version"];
  if (required.some((key) => !String(metadata[key] ?? "").trim())) return fail("INVALID_SIGNUP", "필수 가입 정보를 확인해 주세요.");
  const client = admin();
  if (await emailAlreadyRegistered(client, email)) return fail("EMAIL_EXISTS", "이미 가입했거나 가입 신청에 사용된 이메일입니다.", 409);
  const tokenHash = await digest(token);
  const validSince = new Date(Date.now() - TOKEN_TTL_MS).toISOString();
  const { data: rows, error } = await client.from("signup_email_challenges").select("id").eq("email", email).eq("verification_token_hash", tokenHash).not("verified_at", "is", null).gte("verified_at", validSince).is("consumed_at", null).limit(1);
  if (error) throw error;
  const challenge = rows?.[0];
  if (!challenge) return fail("EMAIL_NOT_VERIFIED", "이메일 인증이 유효하지 않습니다. 다시 인증해 주세요.", 403);
  const consumedAt = new Date().toISOString();
  const { data: claimed } = await client.from("signup_email_challenges").update({ consumed_at: consumedAt }).eq("id", challenge.id).is("consumed_at", null).select("id").maybeSingle();
  if (!claimed) return fail("VERIFICATION_USED", "이미 사용된 이메일 인증입니다.", 409);
  const { data, error: createError } = await client.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { ...metadata, signup_email_verified: true } });
  if (createError) {
    await client.from("signup_email_challenges").update({ consumed_at: null }).eq("id", challenge.id).eq("consumed_at", consumedAt);
    throw createError;
  }
  const { data: session, error: sessionError } = await client.auth.signInWithPassword({ email, password });
  if (sessionError) throw sessionError;
  return json({ user: { id: data.user.id, email: data.user.email }, session: session.session });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (request.method !== "POST") return fail("METHOD_NOT_ALLOWED", "POST 요청만 지원합니다.", 405);
  if (["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "SIGNUP_VERIFICATION_PEPPER", "RESEND_API_KEY", "SIGNUP_EMAIL_FROM"].some((name) => !env(name))) return fail("SERVER_NOT_CONFIGURED", "이메일 인증 서비스 설정이 필요합니다.", 503);
  try {
    const body = await request.json();
    if (body.action === "request") return await requestCode(request, body);
    if (body.action === "verify") return await verifyCode(body);
    if (body.action === "signup") return await completeSignup(body);
    return fail("INVALID_ACTION", "지원하지 않는 요청입니다.");
  } catch (error) {
    console.error("signup-verification failed", error instanceof Error ? error.message : "UNKNOWN_ERROR");
    return fail("INTERNAL_ERROR", "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.", 500);
  }
});
