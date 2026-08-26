import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import path from "node:path";

const localSupabaseUrl = process.env.E2E_LOCAL_SUPABASE_URL;
const localSupabaseAnonKey = process.env.E2E_LOCAL_SUPABASE_ANON_KEY;
const memberEmail = process.env.E2E_MEMBER_EMAIL;
const memberPassword = process.env.E2E_MEMBER_PASSWORD;
const authenticatedEnvironmentReady = Boolean(
  localSupabaseUrl && localSupabaseAnonKey && memberEmail && memberPassword,
);

const configPath = path.resolve("js", "config.js");
let localConfigSource = null;

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
  localConfigSource ??= await buildLocalConfigSource();
  await page.route(/\/js\/config\.js(?:\?.*)?$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/javascript; charset=utf-8",
      body: localConfigSource,
    });
  });
}

async function assertHealthyPage(page, expectedTitle) {
  await expect(page).toHaveTitle(`${expectedTitle} | 청파 같이`);
  await expect(page.locator("#main-content")).toBeVisible();
  await expect(page.locator(".app-initial-loading")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "화면을 불러오지 못했어요" })).toHaveCount(0);
  await expect(page.getByText("앱을 불러오지 못했어요", { exact: true })).toHaveCount(0);
}

test.describe("approved member flow", () => {
  test.skip(!authenticatedEnvironmentReady, "Authenticated E2E requires the isolated local Supabase environment.");

  test("logs in and opens core community routes", async ({ page }) => {
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error));

    await useLocalSupabase(page);
    await page.goto("/#/login");

    await expect(page.locator("#login-email")).toBeVisible();
    await page.locator("#login-email").fill(memberEmail);
    await page.locator("#login-password").fill(memberPassword);
    await page.getByRole("button", { name: "이메일로 로그인" }).click();

    await expect(page).toHaveURL(/#\/$/);
    await assertHealthyPage(page, "홈");

    const routes = [
      ["activities", "활동"],
      ["prayer", "기도 제목"],
      ["notice", "공지사항"],
      ["mypage", "마이페이지"],
    ];

    for (const [route, title] of routes) {
      await page.goto(`/#/${route}`);
      await assertHealthyPage(page, title);
    }

    expect(pageErrors, pageErrors.map((error) => error.stack ?? error.message).join("\n\n")).toEqual([]);
  });
});
