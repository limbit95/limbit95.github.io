import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import path from "node:path";

const localSupabaseUrl = process.env.E2E_LOCAL_SUPABASE_URL;
const localSupabaseAnonKey = process.env.E2E_LOCAL_SUPABASE_ANON_KEY;
const memberEmail = process.env.E2E_MEMBER_EMAIL;
const memberPassword = process.env.E2E_MEMBER_PASSWORD;
const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;
const activityId = process.env.E2E_ACTIVITY_ID;
const authenticatedEnvironmentReady = Boolean(
  localSupabaseUrl
  && localSupabaseAnonKey
  && memberEmail
  && memberPassword
  && adminEmail
  && adminPassword,
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
  await page.route(/https?:\/\/[^/]+\/js\/config\.js(?:\?.*)?$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/javascript; charset=utf-8",
      body: localConfigSource,
    });
  });
}

async function login(page, email, password) {
  await useLocalSupabase(page);
  await page.goto("/#/login");
  await expect(page.locator("#login-email")).toBeVisible();
  await page.locator("#login-email").fill(email);
  await page.locator("#login-password").fill(password);
  await page.getByRole("button", { name: "이메일로 로그인" }).click();
  await expect(page).toHaveURL(/#\/$/);
  await assertHealthyPage(page, "홈");
}

async function assertHealthyPage(page, expectedTitle) {
  await expect(page).toHaveTitle(`${expectedTitle} | 청파 같이`);
  await expect(page.locator("#main-content")).toBeVisible();
  await expect(page.locator(".app-initial-loading")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "화면을 불러오지 못했어요" })).toHaveCount(0);
  await expect(page.getByText("앱을 불러오지 못했어요", { exact: true })).toHaveCount(0);
}

function collectPageErrors(page) {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error));
  return pageErrors;
}

function collectJavaScriptRequests(page) {
  const requests = new Set();
  page.on("request", (request) => {
    try {
      const pathname = new URL(request.url()).pathname;
      if (pathname.includes("/js/")) requests.add(pathname);
    } catch {
      // Ignore non-standard URLs emitted by the browser.
    }
  });
  return requests;
}

function expectNoPageErrors(pageErrors) {
  expect(
    pageErrors,
    pageErrors.map((error) => error.stack ?? error.message).join("\n\n"),
  ).toEqual([]);
}

test.describe("approved member flow", () => {
  test.skip(!authenticatedEnvironmentReady, "Authenticated E2E requires the isolated local Supabase environment.");

  test("does not eagerly load unrelated route or API modules at startup", async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    const jsRequests = collectJavaScriptRequests(page);
    await login(page, memberEmail, memberPassword);

    expect(jsRequests.has("/js/pages/login.js")).toBe(true);
    expect(jsRequests.has("/js/pages/home.js")).toBe(true);
    expect(jsRequests.has("/js/api.js"), "the broad API facade should not be in the initial graph").toBe(false);

    const unrelatedStartupModules = [
      "/js/pages/activityForm.js",
      "/js/pages/postDetail.js",
      "/js/pages/postForm.js",
      "/js/pages/mypage.js",
      "/js/pages/admin.js",
      "/js/pages/admin/dashboard.js",
      "/js/pages/admin/approvals.js",
      "/js/pages/admin/members.js",
      "/js/pages/admin/managers.js",
      "/js/pages/admin/categories.js",
    ];
    for (const modulePath of unrelatedStartupModules) {
      expect(jsRequests.has(modulePath), `${modulePath} should be lazy-loaded`).toBe(false);
    }

    expectNoPageErrors(pageErrors);
  });

  test("logs in and opens core community routes", async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    await login(page, memberEmail, memberPassword);

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

    expectNoPageErrors(pageErrors);
  });

  test("joins and cancels an activity through the real participation RPC", async ({ page }) => {
    test.skip(!activityId, "Write-path E2E requires the isolated activity fixture.");
    const pageErrors = collectPageErrors(page);
    await login(page, memberEmail, memberPassword);

    await page.goto(`/#/activities/${activityId}`);
    await assertHealthyPage(page, "활동 상세");
    await expect(page.getByRole("heading", { name: "E2E 참여 테스트 활동", exact: true })).toBeVisible();

    await page.getByRole("button", { name: "🙌 참여 신청하기" }).click();
    const joinDialog = page.getByRole("alertdialog");
    await expect(joinDialog).toBeVisible();
    await joinDialog.getByRole("button", { name: "참여 신청", exact: true }).click();
    await expect(page.getByRole("button", { name: "참여 취소", exact: true })).toBeVisible();

    await page.getByRole("button", { name: "참여 취소", exact: true }).click();
    const cancelDialog = page.getByRole("alertdialog");
    await expect(cancelDialog).toBeVisible();
    await cancelDialog.getByRole("button", { name: "참여 취소", exact: true }).click();
    await expect(page.getByRole("button", { name: "🙌 참여 신청하기" })).toBeVisible();

    expectNoPageErrors(pageErrors);
  });

  test("enters the Liar Game lobby shell and returns to the game list", async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    await login(page, memberEmail, memberPassword);

    await page.goto("/#/games");
    await assertHealthyPage(page, "게임");
    await page.getByRole("link", { name: "라이어 게임 시작" }).click();

    await expect(page).toHaveURL(/\/liar-game\/$/);
    const welcome = page.locator("#liar-welcome");
    const gameNavigation = page.getByRole("navigation", { name: "라이어 게임 이동" });
    await expect(welcome.getByRole("heading", { name: "라이어 게임", exact: true })).toBeVisible();
    await expect(welcome.getByRole("button", { name: "게임 로비 열기" })).toBeVisible();
    await expect(welcome.getByRole("link", { name: "게임 목록으로" })).toBeVisible();
    await expect(gameNavigation).toBeHidden();

    await welcome.getByRole("button", { name: "게임 로비 열기" }).click();
    await expect(welcome).toBeHidden();
    await expect(gameNavigation).toBeVisible();
    await expect(gameNavigation.getByRole("button", { name: "처음으로" })).toBeVisible();
    await expect(gameNavigation.getByRole("link", { name: "게임 목록으로" })).toBeVisible();

    await gameNavigation.getByRole("button", { name: "처음으로" }).click();
    await expect(gameNavigation).toBeHidden();
    await expect(welcome.getByRole("button", { name: "게임 로비 열기" })).toBeVisible();

    await welcome.getByRole("link", { name: "게임 목록으로" }).click();
    await expect(page).toHaveURL(/\/#\/games$/);
    await assertHealthyPage(page, "게임");

    expectNoPageErrors(pageErrors);
  });
});

test.describe("admin flow", () => {
  test.skip(!authenticatedEnvironmentReady, "Authenticated E2E requires the isolated local Supabase environment.");

  test("opens every admin route without runtime contract errors", async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    await login(page, adminEmail, adminPassword);

    const routes = [
      ["admin", "관리자 대시보드"],
      ["admin/approvals", "가입 신청 관리"],
      ["admin/members", "회원 관리"],
      ["admin/managers", "활동 담당자 관리"],
      ["admin/categories", "활동 카테고리 관리"],
    ];

    for (const [route, title] of routes) {
      await page.goto(`/#/${route}`);
      await assertHealthyPage(page, title);
      await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
    }

    expectNoPageErrors(pageErrors);
  });
});
