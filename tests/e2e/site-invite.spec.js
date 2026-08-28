import { test, expect } from "@playwright/test";

const TOKEN = "a".repeat(64);

test.describe("site-wide invite links", () => {
  test("accepts only same-origin return targets", async ({ page }) => {
    await page.goto("/");
    const result = await page.evaluate(async () => {
      const module = await import("/js/auth-return.js");
      return {
        internal: module.sanitizeReturnTarget("/the-game/?invite=test"),
        hash: module.sanitizeReturnTarget("/#/activities/12"),
        external: module.sanitizeReturnTarget("https://example.com/phish"),
        loginLoop: module.sanitizeReturnTarget("/#/login?returnTo=x"),
      };
    });
    expect(result).toEqual({
      internal: "/the-game/?invite=test",
      hash: "/#/activities/12",
      external: null,
      loginLoop: null,
    });
  });

  test("preserves an invite target when a signed-out user is sent to login", async ({ page }) => {
    await page.goto(`/invite.html?token=${TOKEN}`);
    await expect.poll(() => page.url()).toContain("#/login?returnTo=");
    const stored = await page.evaluate(() => sessionStorage.getItem("community:return-target"));
    expect(stored).toBe(`/invite.html?token=${TOKEN}`);
    expect(decodeURIComponent(page.url())).toContain(`/invite.html?token=${TOKEN}`);
  });

  test("builds a common invite QR dialog", async ({ page }) => {
    await page.goto("/the-game/");
    await page.evaluate(async (token) => {
      const { createInviteShareDialog } = await import("/js/invites/inviteShare.js");
      const share = createInviteShareDialog({ token, title: "테스트 초대" });
      window.__inviteShare = share;
      await share.open();
    }, TOKEN);
    await expect(page.getByRole("heading", { name: "테스트 초대" })).toBeVisible();
    await expect(page.locator(".invite-share-qr canvas")).toBeVisible();
    await expect(page.locator(".invite-share-input")).toHaveValue(new RegExp(`/invite\\.html\\?token=${TOKEN}$`));
  });

  test("The Game invite keeps the standalone destination through login", async ({ page }) => {
    await page.goto(`/the-game/?invite=${TOKEN}`);
    const authLink = page.locator("[data-auth-gate] a");
    await expect(authLink).toBeVisible({ timeout: 15000 });
    const href = await authLink.getAttribute("href");
    expect(decodeURIComponent(href)).toContain(`/the-game/?invite=${TOKEN}`);
  });
});
