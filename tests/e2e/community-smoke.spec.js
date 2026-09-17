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

test("AD keeps the P layout while presenting O copy", async ({ page }) => {
  const observed = observeBootFailures(page);

  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page).toHaveURL(/#\/gateway$/);
  await expect(page.getByRole("heading", { name: "같이", exact: true })).toBeVisible();
  await expect(page.getByText("닮고, 나누고, 함께 살아가는 청파청년부.")).toBeVisible();
  await expect(page.getByText("약한 이의 곁에 서고 평화를 사랑하는 마음을, 오늘의 삶과 공동체 안에서 이어갑니다.")).toBeVisible();
  await expect(page).toHaveTitle("청파 같이 | Value · Like · Together");

  const chapters = page.locator(".brand-p-chapter");
  await expect(chapters).toHaveCount(3);
  await expect(chapters.nth(0)).toContainText("VALUE");
  await expect(chapters.nth(0)).toContainText("중요하게 여기는 것을 말하고, 세상과 나눕니다.");
  await expect(chapters.nth(1)).toContainText("LIKE");
  await expect(chapters.nth(1)).toContainText("같은 방향을 바라보고, 삶으로 닮아갑니다.");
  await expect(chapters.nth(2)).toContainText("TOGETHER");
  await expect(chapters.nth(2)).toContainText("함께 모이고 움직이며, 공동체의 오늘을 만듭니다.");
  expect(observed.pageErrors).toEqual([]);
});

test("AD Value chapter uses O detail copy and continues to Like", async ({ page }) => {
  const observed = observeBootFailures(page);

  await page.goto("/#/value", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { name: "가치를 나누다" })).toBeVisible();
  await expect(page.getByText("사람의 경험과 생각을 기록하고, 돌봄과 평화를 구체적인 프로젝트와 실천으로 확장합니다.")).toBeVisible();
  await expect(page.getByRole("link", { name: /NEXT CHAPTER 02 \/ LIKE/ })).toContainText("02 / LIKE");
  expect(observed.pageErrors).toEqual([]);
});

test("AD Together chapter hands off to the existing community login", async ({ page }) => {
  const observed = observeBootFailures(page);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.locator(".brand-p-chapter--together a").click();

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
