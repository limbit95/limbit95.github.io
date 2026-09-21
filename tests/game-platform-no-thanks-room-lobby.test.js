import assert from "node:assert/strict";
import { test } from "node:test";

import { ROOM_LOBBY_METHODS } from "../games/shared/roomLobbyContract.js";
import { createNoThanksRoomLobbyAdapter } from "../games/no-thanks/roomLobby.js";

function fakeClient() {
  const calls = [];
  const subscriptions = [];
  const removed = [];
  let rpcResult = {
    version: 0,
    room: { id: "room-1", roomCode: "ABC234", version: 0 },
    players: [],
  };

  return {
    calls,
    subscriptions,
    removed,
    setRpcResult(value) {
      rpcResult = value;
    },
    async rpc(name, args) {
      calls.push([name, args]);
      return { data: rpcResult, error: null };
    },
    channel(name) {
      const registrations = [];
      const channel = {
        name,
        registrations,
        on(type, filter, listener) {
          registrations.push({ type, filter, listener });
          return this;
        },
        subscribe() {
          subscriptions.push(this);
          return this;
        },
      };
      return channel;
    },
    async removeChannel(channel) {
      removed.push(channel);
      return "ok";
    },
  };
}

test("No Thanks! Room/Lobby adapter exposes the complete shared contract", () => {
  const client = fakeClient();
  const adapter = createNoThanksRoomLobbyAdapter({ client });
  assert.deepEqual(Object.keys(adapter), ROOM_LOBBY_METHODS);
});

test("No Thanks! Room/Lobby adapter sends no client nickname authority", async () => {
  const client = fakeClient();
  const adapter = createNoThanksRoomLobbyAdapter({ client });

  await adapter.createRoom({ maxPlayers: 7 });
  await adapter.joinRoom({ roomCode: "abC234" });
  await adapter.setReady({
    roomId: "room-1",
    ready: true,
    expectedVersion: 3,
    clientActionId: "ready-action",
  });
  await adapter.startGame({
    roomId: "room-1",
    expectedVersion: 4,
    clientActionId: "start-action",
  });

  assert.deepEqual(client.calls, [
    ["no_thanks_create_room", { p_max_players: 7 }],
    ["no_thanks_join_room", { p_room_code: "ABC234" }],
    ["no_thanks_set_ready", {
      p_room_id: "room-1",
      p_ready: true,
      p_expected_version: 3,
      p_client_action_id: "ready-action",
    }],
    ["no_thanks_start_game", {
      p_room_id: "room-1",
      p_expected_version: 4,
      p_client_action_id: "start-action",
    }],
  ]);
});

test("No Thanks! Room/Lobby adapter constrains player count before RPC", async () => {
  const client = fakeClient();
  const adapter = createNoThanksRoomLobbyAdapter({ client });

  await assert.rejects(
    () => adapter.createRoom({ maxPlayers: 2 }),
    /3 through 7/u,
  );
  await assert.rejects(
    () => adapter.createRoom({ maxPlayers: 8 }),
    /3 through 7/u,
  );
  assert.equal(client.calls.length, 0);
});

test("No Thanks! Room/Lobby adapter subscribes only to public invalidation tables", async () => {
  const client = fakeClient();
  const adapter = createNoThanksRoomLobbyAdapter({ client });

  await adapter.getLobbySnapshot({ roomId: "room-1" });

  let invalidations = 0;
  const unsubscribe = adapter.subscribeInvalidation(() => {
    invalidations += 1;
  });

  assert.equal(client.subscriptions.length, 1);
  const [channel] = client.subscriptions;
  assert.equal(channel.name, "no-thanks-room-room-1");
  assert.deepEqual(
    channel.registrations.map(({ type, filter }) => ({ type, filter })),
    [
      {
        type: "postgres_changes",
        filter: {
          event: "*",
          schema: "public",
          table: "no_thanks_rooms",
          filter: "id=eq.room-1",
        },
      },
      {
        type: "postgres_changes",
        filter: {
          event: "*",
          schema: "public",
          table: "no_thanks_room_players",
          filter: "room_id=eq.room-1",
        },
      },
    ],
  );
  assert.equal(
    channel.registrations.some(({ filter }) => filter.table === "no_thanks_room_private_state"),
    false,
  );

  channel.registrations[0].listener({});
  assert.equal(invalidations, 1);

  unsubscribe();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(client.removed[0], channel);
});

test("No Thanks! Room/Lobby adapter clears subscription identity after leaving", async () => {
  const client = fakeClient();
  const adapter = createNoThanksRoomLobbyAdapter({ client });

  await adapter.getLobbySnapshot({ roomId: "room-1" });
  client.setRpcResult(null);
  await adapter.leaveRoom({ roomId: "room-1", expectedVersion: 2 });

  assert.throws(
    () => adapter.subscribeInvalidation(() => {}),
    /active room before subscription/u,
  );
});
