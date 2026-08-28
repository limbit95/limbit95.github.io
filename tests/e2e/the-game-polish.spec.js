import { test, expect } from "@playwright/test";

const roomId = "55555555-5555-4555-8555-555555555555";
const gameId = "66666666-6666-4666-8666-666666666666";
const selfUserId = "77777777-7777-4777-8777-777777777777";

function onlineSnapshot() {
  return {
    room: {
      id: roomId,
      code: "MOB234",
      status: "playing",
      version: 3,
      host_user_id: selfUserId,
    },
    game: {
      id: gameId,
      status: "playing",
      version: 5,
      hand_size: 7,
      current_seat: 1,
      turn_number: 2,
      cards_played_this_turn: 0,
      required_cards: 2,
      can_end_turn: false,
      draw_count: 84,
      remaining_cards: 98,
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
      hand: [8, 16, 27, 41, 55, 72, 91],
      hand_count: 7,
      is_current: true,
    },
    players: [
      { user_id: selfUserId, nickname: "나", seat: 1, hand_count: 7, is_current: true },
      { user_id: "88888888-8888-4888-8888-888888888888", nickname: "둘", seat: 2, hand_count: 7, is_current: false },
      { user_id: "99999999-9999-4999-8999-999999999999", nickname: "셋", seat: 3, hand_count: 6, is_current: false },
      { user_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", nickname: "넷", seat: 4, hand_count: 6, is_current: false },
      { user_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", nickname: "다섯", seat: 5, hand_count: 6, is_current: false },
    ],
  };
}

test.describe("The Game interaction polish", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/the-game/");
  });

  test("labels cooperative results as a team outcome", async ({ page }) => {
    await page.evaluate(() => {
      const overlay = document.querySelector("#result-overlay");
      overlay.hidden = false;
      document.querySelector("#result-kicker").textContent = "GAME OVER";
      document.querySelector("#result-title").textContent = "패배";
    });

    const badge = page.locator("#result-overlay .team-result-badge");
    await expect(badge).toHaveText("팀 결과 · 협력 실패");

    await page.evaluate(() => {
      document.querySelector("#result-kicker").textContent = "MISSION COMPLETE";
    });
    await expect(badge).toHaveText("팀 결과 · 협력 성공");
  });

  test("uses the compact mobile online layout and large touch targets", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.evaluate(async ({ snapshot }) => {
      const module = await import("/the-game/js/onlineGame.js");
      const api = {
        subscribeGame: ({ onStatus }) => {
          onStatus?.("SUBSCRIBED");
          return () => {};
        },
        getGameSnapshot: async () => structuredClone(snapshot),
        getLobbySnapshot: async () => null,
        playCard: async () => structuredClone(snapshot),
        endTurn: async () => structuredClone(snapshot),
        prepareRematch: async () => null,
        leaveRoom: async () => ({ left: true }),
        closeGame: async () => ({ closed: true }),
      };
      module.openOnlineGame({ api, gameSnapshot: structuredClone(snapshot) });
    }, { snapshot: onlineSnapshot() });

    const layout = await page.evaluate(() => {
      const players = document.querySelector(".online-game-players");
      const hand = document.querySelector(".online-game-screen .hand");
      const card = document.querySelector(".online-game-screen .online-number-card");
      const endTurn = document.querySelector("[data-online-end-turn]");
      return {
        playerDisplay: getComputedStyle(players).display,
        playerOverflow: getComputedStyle(players).overflowX,
        handColumns: getComputedStyle(hand).gridTemplateColumns.split(" ").length,
        cardHeight: card.getBoundingClientRect().height,
        endTurnHeight: endTurn.getBoundingClientRect().height,
        pageFits: document.documentElement.scrollWidth <= window.innerWidth + 1,
      };
    });

    expect(layout.playerDisplay).toBe("flex");
    expect(["auto", "scroll"]).toContain(layout.playerOverflow);
    expect(layout.handColumns).toBe(4);
    expect(layout.cardHeight).toBeGreaterThanOrEqual(76);
    expect(layout.endTurnHeight).toBeGreaterThanOrEqual(52);
    expect(layout.pageFits).toBe(true);
  });

  test("provides pile update feedback and a reduced-motion fallback", async ({ page }) => {
    const cssText = await page.evaluate(async () => fetch("/the-game/css/polish.css").then((response) => response.text()));
    expect(cssText).toContain("prefers-reduced-motion: reduce");

    await page.waitForTimeout(50);
    await page.evaluate(() => {
      document.querySelector('[data-pile-id="ascending-1"] .pile-value').textContent = "12";
    });
    await expect(page.locator('[data-pile-id="ascending-1"]')).toHaveClass(/is-updated/);
  });
});
