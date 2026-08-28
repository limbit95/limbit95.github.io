import { test, expect } from "@playwright/test";

test.describe("The Game local prototype", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/the-game/");
  });

  test("starts a three-player game with the original pile and hand setup", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "THE GAME" })).toBeVisible();
    await page.getByRole("button", { name: "게임 시작" }).click();

    await expect(page.getByRole("heading", { name: "플레이어 1의 턴" })).toBeVisible();
    await expect(page.locator("#hand .number-card")).toHaveCount(6);
    await expect(page.locator("[data-pile-id='ascending-1'] .pile-value")).toHaveText("1");
    await expect(page.locator("[data-pile-id='ascending-2'] .pile-value")).toHaveText("1");
    await expect(page.locator("[data-pile-id='descending-1'] .pile-value")).toHaveText("100");
    await expect(page.locator("[data-pile-id='descending-2'] .pile-value")).toHaveText("100");
    await expect(page.locator("#deck-count")).toHaveText("80");
  });

  test("plays two cards, ends the turn, and protects the next player's hand", async ({ page }) => {
    await page.getByRole("button", { name: "게임 시작" }).click();

    const firstCard = page.locator("#hand .number-card").first();
    await firstCard.click();
    await expect(page.locator(".pile-card.is-playable")).toHaveCount(4);
    await page.locator(".pile-card.is-playable").first().click();

    await expect(page.locator("#played-count")).toHaveText("1");
    await expect(page.locator("#hand .number-card")).toHaveCount(5);
    await expect(page.locator("#end-turn-button")).toBeDisabled();

    await page.locator("#hand .number-card").first().click();
    await expect(page.locator(".pile-card.is-playable").first()).toBeVisible();
    await page.locator(".pile-card.is-playable").first().click();

    await expect(page.locator("#played-count")).toHaveText("2");
    await expect(page.locator("#end-turn-button")).toBeEnabled();
    await page.locator("#end-turn-button").click();

    await expect(page.locator("#pass-overlay")).toBeVisible();
    await expect(page.getByRole("heading", { name: "플레이어 2 차례" })).toBeVisible();
    await expect(page.locator("#hand .number-card")).toHaveCount(0);

    await page.getByRole("button", { name: "내 카드 보기" }).click();
    await expect(page.locator("#pass-overlay")).toBeHidden();
    await expect(page.getByRole("heading", { name: "플레이어 2의 턴" })).toBeVisible();
    await expect(page.locator("#hand .number-card")).toHaveCount(6);
    await expect(page.locator("#deck-count")).toHaveText("78");
  });
});
