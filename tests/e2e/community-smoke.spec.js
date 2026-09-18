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

test("AG layered horizon gateway loads before the community app", async ({ page }) => {
  const observed = observeBootFailures(page);

  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page).toHaveURL(/#\/gateway$/);
  await expect(page.getByRole("heading", { name: "같이", level: 1 })).toBeVisible();
  await expect(page.locator(".brand-ag-hero__lines")).toBeVisible();
  await expect(page.getByText("같은 가치를 바라보고, 같이 닮아가며, 같이 살아가는 청파청년부.")).toBeVisible();
  await expect(page.locator(".brand-ag-shell")).toBeVisible();
  await expect(page.getByRole("heading", { name: "다시 만나 반가워요" })).toHaveCount(0);
  expect(observed.pageErrors).toEqual([]);
  expect(observed.failedScripts).toEqual([]);
});

test("AG gateway keeps VALUE LIKE TOGETHER layer order", async ({ page }) => {
  await page.goto("/#/gateway", { waitUntil: "domcontentloaded" });

  const layers = page.locator(".brand-ag-layer");
  await expect(layers).toHaveCount(3);
  await expect(layers.nth(0).getByText("VALUE", { exact: true }).last()).toBeVisible();
  await expect(layers.nth(1).getByText("LIKE", { exact: true }).last()).toBeVisible();
  await expect(layers.nth(2).getByText("TOGETHER", { exact: true }).last()).toBeVisible();
});

test("AG layer activation follows the viewport horizon line", async ({ page }) => {
  await page.goto("/#/gateway", { waitUntil: "domcontentloaded" });

  const shell = page.locator(".brand-ag-shell");
  const layers = page.locator(".brand-ag-layer");
  const directions = ["value", "like", "together"];

  for (let index = 0; index < directions.length; index += 1) {
    await layers.nth(index).evaluate((layer) => {
      const horizon = layer.querySelector(".brand-ag-layer__horizon") || layer;
      const rect = horizon.getBoundingClientRect();
      const center = window.scrollY + rect.top + rect.height / 2;
      window.scrollTo(0, Math.max(0, center - window.innerHeight * .5));
    });
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await expect(shell).toHaveAttribute("data-active-direction", directions[index]);
    await expect(layers.nth(index)).toHaveAttribute("data-active", "true");
  }
});

test("AG public details preserve the narrative handoff", async ({ page }) => {
  await page.goto("/#/value", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "가치를 나누다", level: 1 })).toBeVisible();
  await expect(page.getByText("NEXT HORIZON · 02 / LIKE")).toBeVisible();

  await page.goto("/#/like", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "같이 닮다", level: 1 })).toBeVisible();
  await expect(page.getByText("NEXT HORIZON · 03 / TOGETHER")).toBeVisible();
});

test("Together public horizon hands off to the existing login app", async ({ page }) => {
  const observed = observeBootFailures(page);

  await page.goto("/#/together", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "같이 하다", level: 1 })).toBeVisible();
  await page.getByRole("link", { name: /청파 같이 시작하기/ }).click();

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
