import { test, expect } from "@playwright/test";

test.describe("The Game record modal and lobby cleanup", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/the-game/");
  });

  test("keeps the Recent 10 footer fully reachable on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 700 });
    await page.evaluate(() => {
      const overlay = document.createElement("div");
      overlay.className = "overlay stats-overlay";
      overlay.dataset.recordModalFixture = "true";
      overlay.innerHTML = `
        <section class="overlay-card stats-modal">
          <header class="stats-modal__header">
            <div>
              <p class="eyebrow">MY RECORD</p>
              <h2>내 기록</h2>
            </div>
            <button class="ghost-button stats-modal__close" type="button">닫기</button>
          </header>
          <div class="stats-modal__content">
            <section class="personal-stat-section">
              <div class="personal-stat-grid">
                ${Array.from({ length: 12 }, (_, index) => `
                  <div class="personal-stat-tile"><span>기록 ${index + 1}</span><strong>${index + 1}</strong></div>
                `).join("")}
              </div>
            </section>
            <section class="personal-stat-section">
              <div class="stats-section-heading"><span>RECENT 10</span><strong>최근 게임</strong></div>
              <ul class="recent-game-list">
                ${Array.from({ length: 10 }, (_, index) => `
                  <li class="recent-game-row">
                    <span class="recent-game-outcome is-won">승리</span>
                    <div><strong>${index + 1}번째 게임</strong><span>완전 클리어</span></div>
                    <time>9.13.</time>
                  </li>
                `).join("")}
              </ul>
            </section>
          </div>
        </section>
      `;
      document.body.append(overlay);
    });

    const modal = page.locator("[data-record-modal-fixture] .stats-modal");
    const content = modal.locator(".stats-modal__content");
    const lastRow = modal.locator(".recent-game-row").last();

    await expect(modal).toBeVisible();
    const metrics = await content.evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    }));
    expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);

    await content.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });

    const bottomGap = await content.evaluate((element) => {
      const contentRect = element.getBoundingClientRect();
      const lastRect = element.querySelector(".recent-game-row:last-child").getBoundingClientRect();
      return contentRect.bottom - lastRect.bottom;
    });
    expect(bottomGap).toBeGreaterThanOrEqual(12);

    const modalOverflow = await modal.evaluate((element) => element.scrollHeight - element.clientHeight);
    expect(modalOverflow).toBeLessThanOrEqual(1);
    await expect(lastRow).toBeVisible();
  });

  test("does not load the removed lobby game settings module", async ({ page }) => {
    await expect(page.locator('script[src="./js/gameSettings.js"]')).toHaveCount(0);
  });
});
