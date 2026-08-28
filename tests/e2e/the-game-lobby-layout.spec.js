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

  test("centers the core rule copy with balanced sentence indentation", async ({ page }) => {
    const summary = page.locator("#mode-screen .rule-summary");
    const copy = summary.locator("p");

    await expect(summary).toBeVisible();
    await expect(summary).toHaveCSS("text-align", "center");
    await expect(copy).toHaveCSS("text-align", "center");

    const summaryRect = await readRect(summary);
    const copyRect = await readRect(copy);
    const leftInset = copyRect.left - summaryRect.left;
    const rightInset = summaryRect.right - copyRect.right;

    expect(copyRect.width).toBeLessThan(summaryRect.width);
    expect(leftInset).toBeGreaterThanOrEqual(9);
    expect(rightInset).toBeGreaterThanOrEqual(9);
    expect(Math.abs(leftInset - rightInset)).toBeLessThanOrEqual(2);
    await expect(page.getByRole("button", { name: "게임 규칙", exact: true })).toBeVisible();
  });

  test("opens and closes the detailed game rules modal", async ({ page }) => {
    const openButton = page.getByRole("button", { name: "게임 규칙", exact: true });
    await openButton.click();

    const dialog = page.getByRole("dialog", { name: "게임 규칙" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "게임 목표" })).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "±10 되돌리기" })).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "승리와 패배" })).toBeVisible();
    await expect(dialog).toContainText("1명은 8장, 2명은 7장, 3~5명은 각자 6장");
    await expect(dialog).toContainText("뽑기 덱에 카드가 남아 있는 동안에는 한 턴에 최소 2장");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(openButton).toBeFocused();
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
