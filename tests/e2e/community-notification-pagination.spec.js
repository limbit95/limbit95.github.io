import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import path from "node:path";

const localSupabaseUrl = process.env.E2E_LOCAL_SUPABASE_URL;
const localSupabaseAnonKey = process.env.E2E_LOCAL_SUPABASE_ANON_KEY;
const localSupabaseServiceRoleKey = process.env.E2E_LOCAL_SUPABASE_SERVICE_ROLE_KEY;
const memberEmail = process.env.E2E_MEMBER_EMAIL;
const memberPassword = process.env.E2E_MEMBER_PASSWORD;
const memberUserId = process.env.E2E_MEMBER_USER_ID;
const activityId = process.env.E2E_ACTIVITY_ID;
const environmentReady = Boolean(
  localSupabaseUrl
  && localSupabaseAnonKey
  && localSupabaseServiceRoleKey
  && memberEmail
  && memberPassword
  && memberUserId
  && activityId,
);

const configPath = path.resolve("js", "config.js");

async function useLocalSupabase(page) {
  const source = await readFile(configPath, "utf8");
  const localConfigSource = source
    .replace(
      /export const SUPABASE_URL = [^;]+;/,
      `export const SUPABASE_URL = ${JSON.stringify(localSupabaseUrl)};`,
    )
    .replace(
      /export const SUPABASE_PUBLISHABLE_KEY = [^;]+;/,
      `export const SUPABASE_PUBLISHABLE_KEY = ${JSON.stringify(localSupabaseAnonKey)};`,
    );
  await page.route(/https?:\/\/[^/]+\/js\/config\.js(?:\?.*)?$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/javascript; charset=utf-8",
      body: localConfigSource,
    });
  });
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

async function login(page) {
  await useLocalSupabase(page);
  await page.goto("/#/login");
  await page.locator("#login-email").fill(memberEmail);
  await page.locator("#login-password").fill(memberPassword);
  await page.getByRole("button", { name: "이메일로 로그인" }).click();
  await expect(page).toHaveURL(/#\/$/);
  await expect(page).toHaveTitle("홈 | 청파 같이");
}

async function createNotificationBatch(token, count = 25) {
  const payload = Array.from({ length: count }, (_, index) => ({
    user_id: memberUserId,
    notification_type: "event_updated",
    kind: "event_updated",
    title: `E2E 페이지 알림 ${token} ${String(index + 1).padStart(2, "0")}`,
    body: `cursor pagination fixture ${index + 1}`,
    event_id: Number(activityId),
    target_path: `#/activities/${activityId}`,
    is_read: false,
    read_at: null,
    dedupe_key: `e2e-pagination:${token}:${index + 1}`,
  }));
  return serviceRoleRequest("/rest/v1/notifications?select=id,title", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(payload),
  });
}

test.describe("notification cursor pagination", () => {
  test.skip(!environmentReady, "Notification pagination E2E requires isolated local Supabase fixtures.");

  test("loads only the first page and appends older notifications on demand", async ({ page }, testInfo) => {
    const token = `${testInfo.project.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${Date.now()}`;
    const created = await createNotificationBatch(token, 25);
    expect(created).toHaveLength(25);

    await login(page);
    await page.getByRole("button", { name: "알림 열기" }).click();
    const panel = page.locator("#notification-panel");
    await expect(panel).toBeVisible();

    const fixtureItems = panel.locator("button.notification-item").filter({ hasText: `E2E 페이지 알림 ${token}` });
    await expect(fixtureItems).toHaveCount(20);
    await expect(panel.getByText(`E2E 페이지 알림 ${token} 25`, { exact: true })).toBeVisible();
    await expect(panel.getByText(`E2E 페이지 알림 ${token} 01`, { exact: true })).toHaveCount(0);

    const loadMore = panel.getByRole("button", { name: "이전 알림 더 보기", exact: true });
    await expect(loadMore).toBeVisible();
    await loadMore.click();

    await expect(fixtureItems).toHaveCount(25);
    await expect(panel.getByText(`E2E 페이지 알림 ${token} 01`, { exact: true })).toBeVisible();
    await expect(panel.getByRole("button", { name: "이전 알림 더 보기", exact: true })).toHaveCount(0);
  });
});
