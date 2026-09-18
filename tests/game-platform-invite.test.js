import assert from "node:assert/strict";
import { test } from "node:test";

import {
  GAME_ROOM_INVITE_TARGET,
  GAME_ROOM_INVITE_VERSION,
  buildGameRoomInviteDestination,
  createGameRoomInvite,
  defineGame,
  parseGameRoomInvite,
  resolveGameRoomInvite,
} from "../games/shared/index.js";

const TOKEN = "a".repeat(64);

function sharedGame(overrides = {}) {
  return defineGame({
    id: "cant-stop",
    title: "Can’t Stop",
    href: "./games/cant-stop/",
    icon: "🎲",
    description: "플랫폼 검증용 게임",
    buttonText: "게임 시작",
    capabilities: { online: true, invite: true },
    platform: "shared",
    ...overrides,
  });
}

function lookup(game) {
  return (gameId) => gameId === game.id ? game : null;
}

test("platform invite creation reuses site invite infrastructure with a stable game_room envelope", async () => {
  const game = sharedGame();
  const calls = [];
  const inviteClient = {
    async createInvite(input) {
      calls.push(input);
      return { token: TOKEN };
    },
  };

  const result = await createGameRoomInvite(inviteClient, {
    gameId: game.id,
    roomId: "room-42",
    expiresInMinutes: 180,
    metadata: {
      campaign: "friends",
      game_id: "must-not-win",
      platform_version: 999,
    },
  }, {
    getGame: lookup(game),
  });

  assert.deepEqual(result, { token: TOKEN });
  assert.deepEqual(calls, [{
    targetType: GAME_ROOM_INVITE_TARGET,
    targetId: "room-42",
    expiresInMinutes: 180,
    metadata: {
      campaign: "friends",
      game_id: "cant-stop",
      platform_version: GAME_ROOM_INVITE_VERSION,
    },
  }]);
});

test("platform invite parsing accepts only shared online games that opted into invite", () => {
  const game = sharedGame();
  const parsed = parseGameRoomInvite({
    target_type: GAME_ROOM_INVITE_TARGET,
    target_id: "room-42",
    metadata: {
      game_id: game.id,
      platform_version: GAME_ROOM_INVITE_VERSION,
    },
  }, {
    getGame: lookup(game),
  });

  assert.equal(parsed.game, game);
  assert.equal(parsed.gameId, "cant-stop");
  assert.equal(parsed.roomId, "room-42");

  const legacy = sharedGame({
    id: "legacy-copy",
    platform: "legacy",
  });
  assert.throws(
    () => parseGameRoomInvite({
      target_type: GAME_ROOM_INVITE_TARGET,
      target_id: "room-1",
      metadata: {
        game_id: legacy.id,
        platform_version: GAME_ROOM_INVITE_VERSION,
      },
    }, {
      getGame: lookup(legacy),
    }),
    /GAME_INVITE_UNSUPPORTED_GAME/u,
  );

  const noInvite = sharedGame({
    id: "no-invite",
    capabilities: { online: true, invite: false },
  });
  assert.throws(
    () => parseGameRoomInvite({
      target_type: GAME_ROOM_INVITE_TARGET,
      target_id: "room-1",
      metadata: {
        game_id: noInvite.id,
        platform_version: GAME_ROOM_INVITE_VERSION,
      },
    }, {
      getGame: lookup(noInvite),
    }),
    /GAME_INVITE_UNSUPPORTED_GAME/u,
  );
});

test("platform invite resolution validates the expected game before exposing a room target", async () => {
  const game = sharedGame();
  const inviteClient = {
    async resolveInvite(token) {
      assert.equal(token, TOKEN);
      return {
        target_type: GAME_ROOM_INVITE_TARGET,
        target_id: "room-42",
        metadata: {
          game_id: game.id,
          platform_version: GAME_ROOM_INVITE_VERSION,
        },
      };
    },
  };

  const resolved = await resolveGameRoomInvite(inviteClient, {
    token: TOKEN.toUpperCase(),
    expectedGameId: "cant-stop",
  }, {
    getGame: lookup(game),
  });

  assert.equal(resolved.roomId, "room-42");

  await assert.rejects(
    resolveGameRoomInvite(inviteClient, {
      token: TOKEN,
      expectedGameId: "other-game",
    }, {
      getGame: lookup(game),
    }),
    /GAME_INVITE_GAME_MISMATCH/u,
  );
});

test("platform invite routing uses Registry href and never trusts a destination from invite metadata", () => {
  const game = sharedGame();
  const destination = buildGameRoomInviteDestination({
    target_type: GAME_ROOM_INVITE_TARGET,
    target_id: "room-42",
    metadata: {
      game_id: game.id,
      platform_version: GAME_ROOM_INVITE_VERSION,
      destination: "https://example.com/phish",
    },
  }, TOKEN, {
    origin: "https://cheongpagachi.com",
    getGame: lookup(game),
  });

  assert.equal(
    destination,
    `https://cheongpagachi.com/games/cant-stop/?invite=${TOKEN}`,
  );
});

test("platform invite rejects unsupported versions and malformed tokens", async () => {
  const game = sharedGame();

  assert.throws(
    () => parseGameRoomInvite({
      target_type: GAME_ROOM_INVITE_TARGET,
      target_id: "room-42",
      metadata: {
        game_id: game.id,
        platform_version: 2,
      },
    }, {
      getGame: lookup(game),
    }),
    /GAME_INVITE_VERSION_UNSUPPORTED/u,
  );

  await assert.rejects(
    resolveGameRoomInvite({
      resolveInvite() {
        throw new Error("should not be called");
      },
    }, {
      token: "not-a-token",
      expectedGameId: game.id,
    }, {
      getGame: lookup(game),
    }),
    /64-character hex token/u,
  );
});
