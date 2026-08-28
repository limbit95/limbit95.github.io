import { test, expect } from "@playwright/test";

async function readRect(locator) {
  return locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };
  });
}

test.describe("The Game lobby layout polish", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/the-game/");
  });

  test("indents the core rule copy beneath its heading", async ({ page }) => {
    const summary = page.locator("#mode-screen .rule-summary");
    const copy = summary.locator("p");

    await expect(summary).toBeVisible();
    await expect(summary).toHaveCSS("text-align", "left");

    const copyPadding = await copy.evaluate((element) => parseFloat(getComputedStyle(element).paddingLeft));
    expect(copyPadding).toBeGreaterThanOrEqual(8);
  });

  test("keeps room code and invite actions aligned on desktop and mobile", async ({ page }) => {
    await page.setViewportSize({ width: 760, height: 700 });
    await page.evaluate(() => {
      const card = document.createElement("section");
      card.className = "room-code-card";
      card.dataset.layoutFixture = "true";
      card.innerHTML = `
        <span>ROOM CODE</span>
        <strong>ABC234</strong>
        <button class="ghost-button" type="button" data-copy-code>코드 복사</button>
        <button class="ghost-button" type="button" data-room-invite>초대 링크 · QR</button>
      `;
      document.querySelector(".app-shell").prepend(card);
    });

    const card = page.locator("[data-layout-fixture]");
    const code = card.locator("strong");
    const copy = card.locator("[data-copy-code]");
    const invite = card.locator("[data-room-invite]");

    const desktopCode = await readRect(code);
    const desktopCopy = await readRect(copy);
    const desktopInvite = await readRect(invite);
    expect(desktopCode.right).toBeLessThan(desktopCopy.left);
    expect(Math.abs(desktopCopy.top - desktopInvite.top)).toBeLessThanOrEqual(1);
    expect(Math.abs(desktopCopy.bottom - desktopInvite.bottom)).toBeLessThanOrEqual(1);

    await page.setViewportSize({ width: 375, height: 700 });

    const mobileCard = await readRect(card);
    const mobileCode = await readRect(code);
    const mobileCopy = await readRect(copy);
    const mobileInvite = await readRect(invite);
    const overflow = await card.evaluate((element) => element.scrollWidth - element.clientWidth);

    expect(mobileCode.bottom).toBeLessThan(mobileCopy.top);
    expect(Math.abs(mobileCopy.top - mobileInvite.top)).toBeLessThanOrEqual(1);
    expect(Math.abs(mobileCopy.width - mobileInvite.width)).toBeLessThanOrEqual(2);
    expect(mobileCopy.left).toBeGreaterThanOrEqual(mobileCard.left);
    expect(mobileInvite.right).toBeLessThanOrEqual(mobileCard.right + 1);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
