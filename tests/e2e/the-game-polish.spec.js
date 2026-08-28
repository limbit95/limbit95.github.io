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

async function openMockOnlineGame(page) {
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
}

async function readBoardLayout(page) {
  return page.evaluate(() => {
    const screen = document.querySelector(".online-game-screen:not([hidden])");
    const piles = screen.querySelector("[data-online-piles]");
    const players = screen.querySelector(".online-game-players");
    const handPanel = screen.querySelector(".hand-panel");
    const hand = screen.querySelector(".hand");
    const cards = [...screen.querySelectorAll(".online-number-card")];
    const endTurn = screen.querySelector("[data-online-end-turn]");
    const screenRect = screen.getBoundingClientRect();
    const pilesRect = piles.getBoundingClientRect();
    const handRect = handPanel.getBoundingClientRect();
    const endTurnRect = endTurn.getBoundingClientRect();
    const lastCardRect = cards.at(-1)?.getBoundingClientRect();
    const screenStyle = getComputedStyle(screen);

    return {
      screenRect: { top: screenRect.top, right: screenRect.right, bottom: screenRect.bottom, left: screenRect.left },
      pilesRect: { top: pilesRect.top, right: pilesRect.right, bottom: pilesRect.bottom, left: pilesRect.left },
      handRect: { top: handRect.top, right: handRect.right, bottom: handRect.bottom, left: handRect.left },
      endTurnRect: { top: endTurnRect.top, right: endTurnRect.right, bottom: endTurnRect.bottom, left: endTurnRect.left },
      lastCardRect: lastCardRect
        ? { top: lastCardRect.top, right: lastCardRect.right, bottom: lastCardRect.bottom, left: lastCardRect.left }
        : null,
      playerDisplay: getComputedStyle(players).display,
      playerOverflow: getComputedStyle(players).overflowX,
      handColumns: getComputedStyle(hand).gridTemplateColumns.split(" ").length,
      cardMinHeight: cards[0]?.getBoundingClientRect().height ?? 0,
      endTurnHeight: endTurnRect.height,
      screenVerticalFits: screen.scrollHeight <= screen.clientHeight + 1,
      screenOverflowX: screenStyle.overflowX,
      screenOverflowY: screenStyle.overflowY,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    };
  });
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

  test("keeps piles, full hand, and turn action visible in portrait mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await openMockOnlineGame(page);
    const layout = await readBoardLayout(page);

    expect(layout.playerDisplay).toBe("flex");
    expect(["auto", "scroll"]).toContain(layout.playerOverflow);
    expect(layout.handColumns).toBe(4);
    expect(layout.cardMinHeight).toBeGreaterThanOrEqual(52);
    expect(layout.endTurnHeight).toBeGreaterThanOrEqual(50);
    expect(layout.screenVerticalFits).toBe(true);
    expect(layout.screenOverflowY).toBe("hidden");
    expect(layout.pilesRect.bottom).toBeLessThan(layout.handRect.top);
    expect(layout.handRect.bottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
    expect(layout.endTurnRect.bottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
    expect(layout.lastCardRect?.bottom ?? Infinity).toBeLessThanOrEqual(layout.handRect.bottom + 1);
  });

  test("compresses the portrait board for shorter phones without page scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await openMockOnlineGame(page);
    const layout = await readBoardLayout(page);

    expect(layout.handColumns).toBe(4);
    expect(layout.cardMinHeight).toBeGreaterThanOrEqual(46);
    expect(layout.screenVerticalFits).toBe(true);
    expect(layout.screenOverflowY).toBe("hidden");
    expect(layout.pilesRect.top).toBeGreaterThanOrEqual(-1);
    expect(layout.pilesRect.bottom).toBeLessThan(layout.handRect.top);
    expect(layout.endTurnRect.bottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
  });

  test("moves the hand to a right-side dock in mobile landscape", async ({ page }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await openMockOnlineGame(page);
    const layout = await readBoardLayout(page);

    expect(layout.handColumns).toBe(4);
    expect(layout.screenVerticalFits).toBe(true);
    expect(layout.screenOverflowX).toBe("hidden");
    expect(layout.screenOverflowY).toBe("hidden");
    expect(layout.playerDisplay).toBe("flex");
    expect(["auto", "scroll"]).toContain(layout.playerOverflow);
    expect(layout.screenRect.left).toBeGreaterThanOrEqual(-1);
    expect(layout.screenRect.right).toBeLessThanOrEqual(layout.viewportWidth + 1);
    expect(layout.screenRect.top).toBeGreaterThanOrEqual(-1);
    expect(layout.screenRect.bottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
    expect(layout.pilesRect.right).toBeLessThan(layout.handRect.left);
    expect(layout.handRect.right).toBeLessThanOrEqual(layout.viewportWidth + 1);
    expect(layout.endTurnRect.left).toBeGreaterThanOrEqual(layout.handRect.left - 1);
    expect(layout.endTurnRect.right).toBeLessThanOrEqual(layout.handRect.right + 1);
    expect(layout.endTurnRect.bottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
    expect(layout.lastCardRect?.bottom ?? Infinity).toBeLessThanOrEqual(layout.handRect.bottom + 1);
  });

  test("defines pile feedback and a reduced-motion fallback", async ({ page }) => {
    const cssText = await page.evaluate(async () => fetch("/the-game/css/polish.css").then((response) => response.text()));
    const responsiveCss = await page.evaluate(async () => fetch("/the-game/css/responsive-board.css").then((response) => response.text()));
    expect(cssText).toContain("@keyframes pile-update");
    expect(cssText).toContain("@keyframes reverse-land");
    expect(cssText).toContain("@keyframes new-card");
    expect(cssText).toContain("prefers-reduced-motion: reduce");
    expect(responsiveCss).toContain("orientation: portrait");
    expect(responsiveCss).toContain("orientation: landscape");
    expect(responsiveCss).toContain("100dvh");
  });
});
