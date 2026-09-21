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

test("AE design preview stays isolated from the live app entry", async ({ page }) => {
  const observed = observeBootFailures(page);

  await page.goto("/brand-gateway-compare.html", { waitUntil: "domcontentloaded" });

  await expect(page).toHaveURL(/\/brand-gateway-compare\.html#\/gateway$/);
  await expect(page.getByRole("heading", { name: "같이", level: 1 })).toBeVisible();
  await expect(page.locator(".brand-ae-weave")).toBeVisible();
  await expect(page.getByText("같은 가치를 바라보고, 같이 닮아가며, 같이 살아가는 청파청년부.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "다시 만나 반가워요" })).toHaveCount(0);
  expect(observed.pageErrors).toEqual([]);
  expect(observed.failedScripts).toEqual([]);
});

test("AE preview keeps VALUE LIKE TOGETHER paths without changing the live root", async ({ page }) => {
  await page.goto("/brand-gateway-compare.html#/gateway", { waitUntil: "domcontentloaded" });

  const stops = page.locator(".brand-ae-stop");
  await expect(stops).toHaveCount(3);
  await expect(stops.nth(0).getByText("VALUE", { exact: true })).toBeVisible();
  await expect(stops.nth(1).getByText("LIKE", { exact: true })).toBeVisible();
  await expect(stops.nth(2).getByText("TOGETHER", { exact: true })).toBeVisible();

  await page.goto("/brand-gateway-compare.html#/value");
  await expect(page.getByRole("heading", { name: "가치를 나누다", level: 1 })).toBeVisible();

  await page.goto("/");
  await expect(page).toHaveURL(/#\/login$/);
  await expect(page.getByRole("heading", { name: "다시 만나 반가워요" })).toBeVisible();
});

test("guest app boots and redirects to login without module failures", async ({ page }) => {
  const observed = observeBootFailures(page);

  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expectHealthyLoginBoot(page, observed);
  await expect(page).toHaveTitle(/로그인 \| 청파 같이/);
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
