import { test, expect } from "@playwright/test";

test.describe("The Game local prototype", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/the-game/");
  });

  test("offers online and one-device play modes", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "THE GAME" })).toBeVisible();
    await expect(page.getByRole("button", { name: /온라인 플레이/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /한 기기 플레이/ })).toBeVisible();
  });

  test("loads the online game screen controller as a browser module", async ({ page }) => {
    const exportedTypes = await page.evaluate(async () => {
      const module = await import("/the-game/js/onlineGame.js");
      return {
        openOnlineGame: typeof module.openOnlineGame,
        closeOnlineGame: typeof module.closeOnlineGame,
      };
    });

    expect(exportedTypes).toEqual({
      openOnlineGame: "function",
      closeOnlineGame: "function",
    });
  });

  test("selects online cards, submits them, and ends the turn", async ({ page }) => {
    await page.evaluate(async () => {
      const module = await import("/the-game/js/onlineGame.js");
      const selfUserId = "11111111-1111-4111-8111-111111111111";
      const otherUserId = "22222222-2222-4222-8222-222222222222";
      const roomId = "33333333-3333-4333-8333-333333333333";
      const gameId = "44444444-4444-4444-8444-444444444444";

      let current = {
        room: { id: roomId, status: "playing", version: 4 },
        game: {
          id: gameId,
          status: "playing",
          version: 0,
          hand_size: 3,
          current_seat: 1,
          turn_number: 1,
          cards_played_this_turn: 0,
          required_cards: 2,
          can_end_turn: false,
          draw_count: 10,
          remaining_cards: 16,
          piles: [
            { id: "ascending-1", direction: "ascending", value: 1 },
            { id: "ascending-2", direction: "ascending", value: 1 },
            { id: "descending-1", direction: "descending", value: 100 },
            { id: "descending-2", direction: "descending", value: 100 },
          ],
          result: null,
        },
        self: {
          user_id: selfUserId,
          nickname: "나",
          seat: 1,
          hand: [6, 26, 30],
          hand_count: 3,
          is_current: true,
        },
        players: [
          { user_id: selfUserId, nickname: "나", seat: 1, hand_count: 3, is_current: true },
          { user_id: otherUserId, nickname: "상대", seat: 2, hand_count: 3, is_current: false },
        ],
      };

      window.__theGameOnlineCalls = [];
      const api = {
        getGameSnapshot: async () => structuredClone(current),
        subscribeGame: ({ onStatus }) => {
          onStatus?.("SUBSCRIBED");
          return () => {};
        },
        playCard: async ({ card, pileId, expectedVersion }) => {
          window.__theGameOnlineCalls.push({ type: "play", card, pileId, expectedVersion });
          const pile = current.game.piles.find((candidate) => candidate.id === pileId);
          pile.value = card;
          current.self.hand = current.self.hand.filter((candidate) => candidate !== card);
          current.self.hand_count -= 1;
          current.players[0].hand_count -= 1;
          current.game.cards_played_this_turn += 1;
          current.game.version += 1;
          current.game.can_end_turn = current.game.cards_played_this_turn >= 2;
          return structuredClone(current);
        },
        endTurn: async ({ expectedVersion }) => {
          window.__theGameOnlineCalls.push({ type: "end", expectedVersion });
          current.game.version += 1;
          current.game.current_seat = 2;
          current.game.turn_number = 2;
          current.game.cards_played_this_turn = 0;
          current.game.can_end_turn = false;
          current.game.draw_count = 8;
          current.self.hand = [6, 44, 55];
          current.self.hand_count = 3;
          current.self.is_current = false;
          current.players[0].hand_count = 3;
          current.players[0].is_current = false;
          current.players[1].is_current = true;
          return structuredClone(current);
        },
        leaveRoom: async () => ({ left: true }),
      };

      module.openOnlineGame({ api, gameSnapshot: structuredClone(current) });
    });

    await expect(page.getByRole("heading", { name: "내 턴" })).toBeVisible();
    await expect(page.locator("[data-online-end-turn]")).toBeDisabled();

    await page.getByRole("button", { name: "내 카드 26" }).click();
    await expect(page.locator("[data-online-pile-id].is-playable")).toHaveCount(4);
    await page.getByRole("button", { name: /오름차순 1 더미에 26 놓기/ }).first().click();

    await expect(page.locator("[data-online-turn-progress]")).toHaveText("1턴 · 1/2장 제출");
    await expect(page.getByRole("button", { name: "내 카드 26" })).toHaveCount(0);
    await expect(page.locator("[data-online-end-turn]")).toBeDisabled();

    await page.getByRole("button", { name: "내 카드 30" }).click();
    await page.getByRole("button", { name: /오름차순 26 더미에 30 놓기/ }).click();

    await expect(page.locator("[data-online-turn-progress]")).toHaveText("1턴 · 2/2장 제출");
    await expect(page.locator("[data-online-end-turn]")).toBeEnabled();
    await page.locator("[data-online-end-turn]").click();

    await expect(page.getByRole("heading", { name: "상대의 턴" })).toBeVisible();
    await expect(page.locator("[data-online-deck-count]")).toHaveText("8");
    await expect(page.locator("[data-online-hand-count]")).toHaveText("3장");
    await expect(page.locator("[data-online-end-turn]")).toBeDisabled();

    const calls = await page.evaluate(() => window.__theGameOnlineCalls);
    expect(calls).toEqual([
      { type: "play", card: 26, pileId: "ascending-1", expectedVersion: 0 },
      { type: "play", card: 30, pileId: "ascending-1", expectedVersion: 1 },
      { type: "end", expectedVersion: 2 },
    ]);
  });

  test("starts a three-player one-device game with the original pile and hand setup", async ({ page }) => {
    await page.getByRole("button", { name: /한 기기 플레이/ }).click();
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
    await page.getByRole("button", { name: /한 기기 플레이/ }).click();
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
