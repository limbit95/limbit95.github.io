import assert from "node:assert/strict";
import { test } from "node:test";

import { ROOM_LOBBY_METHODS } from "../games/shared/roomLobbyContract.js";
import { createCantStopRoomLobbyAdapter } from "../games/cant-stop/roomLobby.js";

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

test("Can't Stop Room/Lobby adapter exposes the complete shared contract", () => {
  const client = fakeClient();
  const adapter = createCantStopRoomLobbyAdapter({ client });
  assert.deepEqual(Object.keys(adapter), ROOM_LOBBY_METHODS);
});

test("Can't Stop Room/Lobby adapter maps room RPC arguments without client authority", async () => {
  const client = fakeClient();
  const adapter = createCantStopRoomLobbyAdapter({ client });

  await adapter.createRoom({ nickname: "Alice", maxPlayers: 4 });
  await adapter.joinRoom({ roomCode: "abC234", nickname: "Bob" });
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
    ["cant_stop_create_room", { p_nickname: "Alice", p_max_players: 4 }],
    ["cant_stop_join_room", { p_room_code: "ABC234", p_nickname: "Bob" }],
    ["cant_stop_set_ready", {
      p_room_id: "room-1",
      p_ready: true,
      p_expected_version: 3,
      p_client_action_id: "ready-action",
    }],
    ["cant_stop_start_game", {
      p_room_id: "room-1",
      p_expected_version: 4,
      p_client_action_id: "start-action",
    }],
  ]);
});

test("Can't Stop Room/Lobby adapter tracks authoritative room before Realtime invalidation", async () => {
  const client = fakeClient();
  const adapter = createCantStopRoomLobbyAdapter({ client });

  await adapter.getLobbySnapshot({ roomId: "room-1" });

  let invalidations = 0;
  const unsubscribe = adapter.subscribeInvalidation(() => {
    invalidations += 1;
  });

  assert.equal(client.subscriptions.length, 1);
  const [channel] = client.subscriptions;
  assert.equal(channel.name, "cant-stop-room-room-1");
  assert.deepEqual(
    channel.registrations.map(({ type, filter }) => ({ type, filter })),
    [
      {
        type: "postgres_changes",
        filter: {
          event: "*",
          schema: "public",
          table: "cant_stop_rooms",
          filter: "id=eq.room-1",
        },
      },
      {
        type: "postgres_changes",
        filter: {
          event: "*",
          schema: "public",
          table: "cant_stop_room_players",
          filter: "room_id=eq.room-1",
        },
      },
    ],
  );

  channel.registrations[0].listener({ new: { version: 2 } });
  assert.equal(invalidations, 1);

  unsubscribe();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(client.removed[0], channel);
});

test("Can't Stop Room/Lobby adapter clears room subscription identity after leaving", async () => {
  const client = fakeClient();
  const adapter = createCantStopRoomLobbyAdapter({ client });

  await adapter.getLobbySnapshot({ roomId: "room-1" });
  client.setRpcResult(null);
  await adapter.leaveRoom({ roomId: "room-1", expectedVersion: 2 });

  assert.throws(
    () => adapter.subscribeInvalidation(() => {}),
    /active room before subscription/u,
  );
});

test("Can't Stop Room/Lobby adapter rejects invalid versions before RPC calls", async () => {
  const client = fakeClient();
  const adapter = createCantStopRoomLobbyAdapter({ client });

  await assert.rejects(
    () => adapter.setReady({
      roomId: "room-1",
      ready: true,
      expectedVersion: -1,
      clientActionId: "bad-version",
    }),
    /non-negative integer/u,
  );
  assert.equal(client.calls.length, 0);
});
