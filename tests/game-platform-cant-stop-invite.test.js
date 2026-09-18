import assert from "node:assert/strict";
import { test } from "node:test";

import { defineGame } from "../games/shared/registry.js";
import {
  CANT_STOP_GAME_ID,
  CANT_STOP_INVITE_EXPIRY_MINUTES,
  createCantStopInviteAdapter,
  isCantStopInviteEnabled,
} from "../games/cant-stop/invite.js";

const TOKEN = "a".repeat(64);

function enabledGame() {
  return defineGame({
    id: CANT_STOP_GAME_ID,
    icon: "🎲",
    title: "Can’t Stop",
    description: "invite test",
    href: "./games/cant-stop/",
    buttonText: "Can’t Stop",
    capabilities: { online: true, invite: true },
    platform: "shared",
  });
}

function lookup(game) {
  return (gameId) => gameId === game.id ? game : null;
}

function fakeClient(handler) {
  const calls = [];
  return {
    calls,
    async rpc(name, args) {
      calls.push([name, args]);
      return handler(name, args, calls);
    },
  };
}

test("Can't Stop invite remains disabled while Registry online/invite capabilities are false", async () => {
  assert.equal(isCantStopInviteEnabled(), false);

  const client = fakeClient(() => {
    throw new Error("RPC should not run while capability guard rejects invite creation.");
  });
  const adapter = createCantStopInviteAdapter({ client });

  assert.equal(adapter.enabled, false);
  await assert.rejects(
    () => adapter.createRoomInvite({ roomId: "room-1" }),
    /GAME_INVITE_UNSUPPORTED_GAME/u,
  );
  assert.equal(client.calls.length, 0);
});

test("Can't Stop invite creation reuses the shared game_room site invite envelope", async () => {
  const game = enabledGame();
  const client = fakeClient((name, args) => {
    assert.equal(name, "site_invite_create");
    return {
      data: {
        token: TOKEN,
        target_type: args.p_target_type,
      },
      error: null,
    };
  });
  const adapter = createCantStopInviteAdapter({
    client,
    getGame: lookup(game),
  });

  assert.equal(adapter.enabled, true);
  const created = await adapter.createRoomInvite({ roomId: "room-42" });

  assert.equal(created.token, TOKEN);
  assert.deepEqual(client.calls, [
    ["site_invite_create", {
      p_target_type: "game_room",
      p_target_id: "room-42",
      p_expires_in_minutes: CANT_STOP_INVITE_EXPIRY_MINUTES,
      p_metadata: {
        source: CANT_STOP_GAME_ID,
        game_id: CANT_STOP_GAME_ID,
        platform_version: 1,
      },
    }],
  ]);
});

test("Can't Stop invite join resolves the shared invite then sends the token to the game server", async () => {
  const game = enabledGame();
  const snapshot = {
    version: 4,
    room: {
      id: "room-42",
      status: "waiting",
    },
    players: [],
  };
  const client = fakeClient((name, args) => {
    if (name === "site_invite_resolve") {
      return {
        data: {
          token: TOKEN,
          target_type: "game_room",
          target_id: "room-42",
          metadata: {
            game_id: CANT_STOP_GAME_ID,
            platform_version: 1,
          },
        },
        error: null,
      };
    }
    if (name === "cant_stop_join_room_by_invite") {
      return { data: snapshot, error: null };
    }
    throw new Error(`Unexpected RPC: ${name}`);
  });
  const adapter = createCantStopInviteAdapter({
    client,
    getGame: lookup(game),
  });

  const result = await adapter.joinRoomFromInvite({
    token: TOKEN.toUpperCase(),
    nickname: "Alice",
  });

  assert.equal(result, snapshot);
  assert.deepEqual(client.calls, [
    ["site_invite_resolve", { p_token: TOKEN }],
    ["cant_stop_join_room_by_invite", {
      p_invite_token: TOKEN,
      p_nickname: "Alice",
    }],
  ]);
});

test("Can't Stop invite join rejects a server snapshot for a different room", async () => {
  const game = enabledGame();
  const client = fakeClient((name) => {
    if (name === "site_invite_resolve") {
      return {
        data: {
          target_type: "game_room",
          target_id: "room-42",
          metadata: {
            game_id: CANT_STOP_GAME_ID,
            platform_version: 1,
          },
        },
        error: null,
      };
    }
    return {
      data: {
        room: { id: "room-other" },
      },
      error: null,
    };
  });
  const adapter = createCantStopInviteAdapter({
    client,
    getGame: lookup(game),
  });

  await assert.rejects(
    () => adapter.joinRoomFromInvite({
      token: TOKEN,
      nickname: "Alice",
    }),
    /GAME_INVITE_ROOM_MISMATCH/u,
  );
});
