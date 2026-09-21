import assert from "node:assert/strict";
import { test } from "node:test";

import { createNoThanksPresenceAdapter } from "../games/no-thanks/presence.js";

function fakeClient() {
  const removed = [];
  let channel = null;

  return {
    removed,
    get channelInstance() {
      return channel;
    },
    channel(name, options) {
      const handlers = new Map();
      channel = {
        name,
        options,
        handlers,
        tracked: [],
        untracked: 0,
        state: {},
        on(type, filter, listener) {
          handlers.set(`${type}:${filter.event}`, listener);
          return this;
        },
        subscribe(callback) {
          this.subscribeCallback = callback;
          return this;
        },
        presenceState() {
          return this.state;
        },
        async track(payload) {
          this.tracked.push(payload);
          return "ok";
        },
        async untrack() {
          this.untracked += 1;
          return "ok";
        },
      };
      return channel;
    },
    async removeChannel(value) {
      removed.push(value);
      return "ok";
    },
  };
}

test("No Thanks! presence tracks one lightweight payload per browser client", async () => {
  const client = fakeClient();
  const statuses = [];
  const adapter = createNoThanksPresenceAdapter({
    client,
    clientIdFactory: () => "client-1",
    now: () => "2026-09-22T00:00:00.000Z",
  });

  const unsubscribe = adapter.subscribe({
    roomId: "room-1",
    userId: "guest-a",
    onSync: () => {},
    onStatus: (status) => statuses.push(status),
  });

  const channel = client.channelInstance;
  assert.equal(channel.name, "no-thanks-presence-room-1");
  assert.deepEqual(channel.options, {
    config: {
      presence: {
        key: "client-1",
      },
    },
  });

  await channel.subscribeCallback("SUBSCRIBED");

  assert.deepEqual(channel.tracked, [{
    userId: "guest-a",
    onlineAt: "2026-09-22T00:00:00.000Z",
  }]);
  assert.deepEqual(statuses, ["connected"]);

  unsubscribe();
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(channel.untracked, 1);
  assert.equal(client.removed[0], channel);
});

test("No Thanks! presence merges multiple tabs into unique connected user ids", () => {
  const client = fakeClient();
  let synced = null;
  const adapter = createNoThanksPresenceAdapter({
    client,
    clientIdFactory: () => "client-2",
  });

  adapter.subscribe({
    roomId: "room-1",
    userId: "guest-a",
    onSync: (userIds) => {
      synced = userIds;
    },
  });

  const channel = client.channelInstance;
  channel.state = {
    "tab-a": [
      { userId: "guest-a", onlineAt: "one" },
    ],
    "tab-b": [
      { userId: "guest-a", onlineAt: "two" },
    ],
    "tab-c": [
      { userId: "host", onlineAt: "three" },
    ],
  };

  channel.handlers.get("presence:sync")();

  assert.deepEqual([...synced].sort(), ["guest-a", "host"]);
});

test("No Thanks! presence reports channel failures without publishing game state", async () => {
  const client = fakeClient();
  const statuses = [];
  const adapter = createNoThanksPresenceAdapter({
    client,
    clientIdFactory: () => "client-3",
    now: () => "fixed",
  });

  adapter.subscribe({
    roomId: "room-1",
    userId: "guest-a",
    onSync: () => {},
    onStatus: (status) => statuses.push(status),
  });

  const channel = client.channelInstance;
  await channel.subscribeCallback("SUBSCRIBED");
  await channel.subscribeCallback("CHANNEL_ERROR");

  assert.equal(Object.hasOwn(channel.tracked[0], "displayName"), false);
  assert.equal(Object.hasOwn(channel.tracked[0], "counters"), false);
  assert.deepEqual(statuses, ["connected", "error"]);
});
