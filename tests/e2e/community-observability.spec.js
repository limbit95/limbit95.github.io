import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import path from "node:path";

const localSupabaseUrl = process.env.E2E_LOCAL_SUPABASE_URL;
const localSupabaseAnonKey = process.env.E2E_LOCAL_SUPABASE_ANON_KEY;
const localSupabaseServiceRoleKey = process.env.E2E_LOCAL_SUPABASE_SERVICE_ROLE_KEY;
const memberEmail = process.env.E2E_MEMBER_EMAIL;
const memberPassword = process.env.E2E_MEMBER_PASSWORD;
const memberUserId = process.env.E2E_MEMBER_USER_ID;
const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;

const environmentReady = Boolean(
  localSupabaseUrl
  && localSupabaseAnonKey
  && localSupabaseServiceRoleKey
  && memberEmail
  && memberPassword
  && memberUserId
  && adminEmail
  && adminPassword,
);

const configPath = path.resolve("js", "config.js");
let localConfigSource = null;
const configuredPages = new WeakSet();

async function buildLocalConfigSource() {
  const source = await readFile(configPath, "utf8");
  return source
    .replace(
      /export const SUPABASE_URL = [^;]+;/,
      `export const SUPABASE_URL = ${JSON.stringify(localSupabaseUrl)};`,
    )
    .replace(
      /export const SUPABASE_PUBLISHABLE_KEY = [^;]+;/,
      `export const SUPABASE_PUBLISHABLE_KEY = ${JSON.stringify(localSupabaseAnonKey)};`,
    );
}

async function useLocalSupabase(page) {
  if (configuredPages.has(page)) return;
  localConfigSource ??= await buildLocalConfigSource();
  await page.route(/https?:\/\/[^/]+\/js\/config\.js(?:\?.*)?$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/javascript; charset=utf-8",
      body: localConfigSource,
    });
  });
  configuredPages.add(page);
}

async function login(page, email, password) {
  await useLocalSupabase(page);
  await page.goto("/#/login");
  await expect(page.locator("#login-email")).toBeVisible();
  await page.locator("#login-email").fill(email);
  await page.locator("#login-password").fill(password);
  await page.getByRole("button", { name: "이메일로 로그인" }).click();
  await expect(page).toHaveURL(/#\/$/);
  await expect(page).toHaveTitle("홈 | 청파 같이");
}

async function logout(page) {
  await page.getByRole("button", { name: "로그아웃", exact: true }).click();
  const dialog = page.getByRole("alertdialog");
  await dialog.getByRole("button", { name: "로그아웃", exact: true }).click();
  await expect(page).toHaveURL(/#\/login$/);
}

async function serviceRoleRequest(pathname, options = {}) {
  const response = await fetch(`${localSupabaseUrl}${pathname}`, {
    ...options,
    headers: {
      apikey: localSupabaseServiceRoleKey,
      Authorization: `Bearer ${localSupabaseServiceRoleKey}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${options.method ?? "GET"} ${pathname} failed (${response.status}): ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

test.describe("client error observability", () => {
  test.skip(!environmentReady, "Observability E2E requires the isolated local Supabase environment.");

  test("captures an approved member runtime error and exposes it to the admin log", async ({ page }, testInfo) => {
    const token = `${testInfo.project.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${Date.now()}`;
    const marker = `E2E observability ${token}`;

    await login(page, memberEmail, memberPassword);
    await page.evaluate((message) => {
      window.dispatchEvent(new ErrorEvent("error", {
        message,
        error: new Error(message),
        filename: `${window.location.origin}/assets/build/e2e-observability.js`,
        lineno: 17,
        colno: 9,
      }));
    }, marker);

    let rows = [];
    await expect.poll(async () => {
      rows = await serviceRoleRequest(
        `/rest/v1/client_error_logs?message=eq.${encodeURIComponent(marker)}&select=id,user_id,error_kind,message,route,context`,
      );
      return rows.length;
    }, { timeout: 8_000 }).toBe(1);

    expect(rows[0].user_id).toBe(memberUserId);
    expect(rows[0].error_kind).toBe("runtime");
    expect(rows[0].route).toBe("/");
    expect(rows[0].context?.source).toBe("e2e-observability.js");
    expect(rows[0].context?.line).toBe(17);

    await logout(page);
    await login(page, adminEmail, adminPassword);
    await page.goto("/#/admin/errors");
    await expect(page).toHaveTitle("오류 로그 | 청파 같이");
    await expect(page.getByRole("heading", { name: "오류 로그", exact: true })).toBeVisible();
    await expect(page.getByText(marker, { exact: true })).toBeVisible();
    await expect(page.getByText("E2E 회원", { exact: true })).toBeVisible();

    await serviceRoleRequest(`/rest/v1/client_error_logs?id=eq.${rows[0].id}`, { method: "DELETE" });
  });
});
