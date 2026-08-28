import { test, expect } from "@playwright/test";

const roomId = "33333333-3333-4333-8333-333333333333";
const gameId = "44444444-4444-4444-8444-444444444444";
const hostUserId = "11111111-1111-4111-8111-111111111111";
const guestUserId = "22222222-2222-4222-8222-222222222222";

function finishedSnapshot({ selfUserId = hostUserId, status = "lost" } = {}) {
  return {
    room: {
      id: roomId,
      code: "ABC234",
      status: "finished",
      version: 9,
      host_user_id: hostUserId,
    },
    game: {
      id: gameId,
      status,
      version: 31,
      hand_size: 7,
      current_seat: 1,
      turn_number: 14,
      cards_played_this_turn: 0,
      required_cards: 2,
      can_end_turn: false,
      draw_count: 12,
      remaining_cards: 23,
      piles: [
        { id: "ascending-1", direction: "ascending", value: 71 },
        { id: "ascending-2", direction: "ascending", value: 84 },
        { id: "descending-1", direction: "descending", value: 28 },
        { id: "descending-2", direction: "descending", value: 19 },
      ],
      result: {
        outcome: status,
        remaining_cards: 23,
        cards_played: 75,
        reason: status === "won" ? "all_cards_played" : "minimum_cards_unplayable",
      },
    },
    self: {
      user_id: selfUserId,
      nickname: selfUserId === hostUserId ? "방장" : "참가자",
      seat: selfUserId === hostUserId ? 1 : 2,
      hand: [42, 57],
      hand_count: 2,
      is_current: selfUserId === hostUserId,
    },
    players: [
      { user_id: hostUserId, nickname: "방장", seat: 1, hand_count: 2, is_current: true },
      { user_id: guestUserId, nickname: "참가자", seat: 2, hand_count: 3, is_current: false },
    ],
  };
}

function lobbySnapshot() {
  return {
    room: {
      id: roomId,
      code: "ABC234",
      status: "waiting",
      version: 10,
      host_user_id: hostUserId,
      max_players: 2,
      player_count: 2,
      all_ready: false,
      can_start: false,
    },
    self: {
      user_id: hostUserId,
      nickname: "방장",
      seat: 1,
      is_ready: false,
      is_host: true,
    },
    players: [
      { user_id: hostUserId, nickname: "방장", seat: 1, is_ready: false, is_host: true },
      { user_id: guestUserId, nickname: "참가자", seat: 2, is_ready: false, is_host: false },
    ],
  };
}

test.describe("The Game rematch and reconnect polish", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/the-game/");
  });

  test("host sees an explicit loss result and can prepare a rematch", async ({ page }) => {
    await page.evaluate(async ({ snapshot, nextLobby }) => {
      const module = await import("/the-game/js/onlineGame.js");
      window.__rematchCall = null;
      window.__returnedLobby = null;

      const api = {
        subscribeGame: ({ onStatus }) => {
          onStatus?.("SUBSCRIBED");
          return () => {};
        },
        getGameSnapshot: async () => structuredClone(snapshot),
        getLobbySnapshot: async () => structuredClone(nextLobby),
        prepareRematch: async (params) => {
          window.__rematchCall = params;
          return structuredClone(nextLobby);
        },
        leaveRoom: async () => ({ left: true }),
        closeGame: async () => ({ closed: true }),
      };

      module.openOnlineGame({
        api,
        gameSnapshot: structuredClone(snapshot),
        onReturnToLobby: (lobby) => {
          window.__returnedLobby = lobby;
        },
      });
    }, { snapshot: finishedSnapshot(), nextLobby: lobbySnapshot() });

    await expect(page.getByRole("dialog", { name: "게임 패배 결과" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "패배" })).toBeVisible();
    await expect(page.locator("[data-online-result-played]")).toHaveText("75");
    await expect(page.locator("[data-online-result-remaining]")).toHaveText("23");
    await expect(page.locator("[data-online-result-turns]")).toHaveText("14");

    const rematchButton = page.getByRole("button", { name: "같은 멤버로 재대결" });
    await expect(rematchButton).toBeEnabled();
    await rematchButton.click();

    await expect.poll(async () => page.evaluate(() => window.__rematchCall)).toEqual({
      roomId,
      expectedVersion: 9,
    });
    await expect.poll(async () => page.evaluate(() => window.__returnedLobby?.room?.status)).toBe("waiting");
    await expect.poll(async () => page.evaluate(() => window.__returnedLobby?.players?.every((player) => player.is_ready === false))).toBe(true);
  });

  test("non-host waits for the host and follows the realtime rematch transition", async ({ page }) => {
    await page.evaluate(async ({ snapshot, nextLobby }) => {
      const module = await import("/the-game/js/onlineGame.js");
      window.__returnedLobby = null;
      window.__gameChange = null;

      const api = {
        subscribeGame: ({ onChange, onStatus }) => {
          window.__gameChange = onChange;
          onStatus?.("SUBSCRIBED");
          return () => {};
        },
        getGameSnapshot: async () => null,
        getLobbySnapshot: async () => structuredClone(nextLobby),
        prepareRematch: async () => {
          throw new Error("HOST_REQUIRED");
        },
        leaveRoom: async () => ({ left: true }),
        closeGame: async () => ({ closed: true }),
      };

      module.openOnlineGame({
        api,
        gameSnapshot: structuredClone(snapshot),
        onReturnToLobby: (lobby) => {
          window.__returnedLobby = lobby;
        },
      });
    }, { snapshot: finishedSnapshot({ selfUserId: guestUserId }), nextLobby: lobbySnapshot() });

    const rematchButton = page.getByRole("button", { name: "방장의 재대결 선택을 기다리는 중" });
    await expect(rematchButton).toBeDisabled();

    await page.evaluate(() => window.__gameChange?.());
    await expect.poll(async () => page.evaluate(() => window.__returnedLobby?.room?.status)).toBe("waiting");
  });

  test("shows offline state and resubscribes after the network returns", async ({ page }) => {
    await page.evaluate(async ({ snapshot }) => {
      const module = await import("/the-game/js/onlineGame.js");
      window.__subscribeCount = 0;

      const api = {
        subscribeGame: ({ onStatus }) => {
          window.__subscribeCount += 1;
          onStatus?.("SUBSCRIBED");
          return () => {};
        },
        getGameSnapshot: async () => structuredClone(snapshot),
        getLobbySnapshot: async () => null,
        prepareRematch: async () => null,
        leaveRoom: async () => ({ left: true }),
        closeGame: async () => ({ closed: true }),
      };

      module.openOnlineGame({ api, gameSnapshot: structuredClone(snapshot) });
    }, { snapshot: finishedSnapshot() });

    await expect(page.locator("[data-online-game-connection]")).toHaveText("실시간 연결됨");
    await page.evaluate(() => window.dispatchEvent(new Event("offline")));
    await expect(page.locator("[data-online-game-connection]")).toContainText("오프라인");

    await page.evaluate(() => window.dispatchEvent(new Event("online")));
    await expect.poll(async () => page.evaluate(() => window.__subscribeCount)).toBeGreaterThan(1);
    await expect(page.locator("[data-online-game-connection]")).toHaveText("실시간 연결됨");
  });
});
