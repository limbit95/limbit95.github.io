import { expect, test } from "@playwright/test";

function observeBootFailures(page) {
  const pageErrors = [];
  const failedScripts = [];

  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  page.on("requestfailed", (request) => {
    const url = request.url();
    if (request.resourceType() === "script" || url.includes("/js/")) {
      failedScripts.push(`${url} :: ${request.failure()?.errorText ?? "request failed"}`);
    }
  });

  return { pageErrors, failedScripts };
}

async function expectHealthyLoginBoot(page, observed) {
  await expect(page).toHaveURL(/#\/login$/);
  await expect(page.getByRole("heading", { name: "다시 만나 반가워요" })).toBeVisible();
  await expect(page.getByRole("button", { name: "이메일로 로그인" })).toBeVisible();
  await expect(page.locator(".app-initial-loading")).toHaveCount(0);
  await expect(page.getByText("앱을 불러오지 못했어요")).toHaveCount(0);
  expect(observed.pageErrors).toEqual([]);
  expect(observed.failedScripts).toEqual([]);
}

test("AB quiet editorial gateway loads with Value Like Together narrative order", async ({ page }) => {
  const observed = observeBootFailures(page);

  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page).toHaveURL(/#\/gateway$/);
  await expect(page.getByRole("heading", { name: "같이", exact: true })).toBeVisible();
  await expect(page.getByText("AB / QUIET EDITORIAL")).toBeVisible();
  await expect(page.getByText("같은 가치를 바라보고, 같이 닮아가며, 같이 살아가는 청파청년부.")).toBeVisible();
  await expect(page).toHaveTitle("청파 같이 | Value · Like · Together");

  const navLinks = page.locator(".brand-ab-nav > a");
  await expect(navLinks).toHaveCount(3);
  await expect(navLinks.nth(0)).toContainText("VALUE");
  await expect(navLinks.nth(1)).toContainText("LIKE");
  await expect(navLinks.nth(2)).toContainText("TOGETHER");
  await expect(page.getByRole("link", { name: "가치를 나누다 자세히 보기" })).toBeVisible();
  expect(observed.pageErrors).toEqual([]);
});

test("Value Like Together detail pages keep the intended next meaning flow", async ({ page }) => {
  await page.goto("/#/value", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "가치를 나누다" })).toBeVisible();
  await expect(page.locator(".brand-ab-detail__next")).toContainText("LIKE");

  await page.locator(".brand-ab-detail__next").click();
  await expect(page).toHaveURL(/#\/like$/);
  await expect(page.getByRole("heading", { name: "같이 닮다" })).toBeVisible();
  await expect(page.locator(".brand-ab-detail__next")).toContainText("TOGETHER");
});

test("Together public chapter hands off to the existing login app", async ({ page }) => {
  const observed = observeBootFailures(page);

  await page.goto("/#/together", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "같이 하다" })).toBeVisible();
  await expect(page.getByText("이제 실제 ‘같이’로 들어가 볼까요?")).toBeVisible();
  await page.getByRole("link", { name: "커뮤니티 들어가기" }).click();

  await expectHealthyLoginBoot(page, observed);
});

test("protected community route redirects an unauthenticated visitor to login", async ({ page }) => {
  const observed = observeBootFailures(page);

  await page.goto("/#/mypage", { waitUntil: "domcontentloaded" });

  await expectHealthyLoginBoot(page, observed);
});

test("login form exposes client-side validation without leaving the page", async ({ page }) => {
  const observed = observeBootFailures(page);

  await page.goto("/#/login", { waitUntil: "domcontentloaded" });
  await expectHealthyLoginBoot(page, observed);

  await page.getByRole("button", { name: "이메일로 로그인" }).click();

  await expect(page.getByText("올바른 이메일 주소를 입력해 주세요.")).toBeVisible();
  await expect(page.getByText("비밀번호는 8자 이상 입력해 주세요.")).toBeVisible();
  await expect(page).toHaveURL(/#\/login$/);
  expect(observed.pageErrors).toEqual([]);
});
