import assert from "node:assert/strict";
import { test } from "node:test";

import {
  ROOM_LOBBY_METHODS,
  createReconnectRefreshTriggers,
  createSnapshotCoordinator,
  createVersionedAction,
  defineRoomLobbyAdapter,
} from "../games/shared/index.js";

test("room/lobby adapter enforces the shared platform surface and preserves adapter context", async () => {
  const calls = [];
  const adapter = {
    prefix: "cant_stop",
    async createRoom(input) { calls.push([this.prefix, "createRoom", input]); },
    async joinRoom(input) { calls.push([this.prefix, "joinRoom", input]); },
    async getMyActiveRoom() { calls.push([this.prefix, "getMyActiveRoom"]); },
    async getLobbySnapshot(input) { calls.push([this.prefix, "getLobbySnapshot", input]); },
    async setReady(input) { calls.push([this.prefix, "setReady", input]); },
    async leaveRoom(input) { calls.push([this.prefix, "leaveRoom", input]); },
    async startGame(input) { calls.push([this.prefix, "startGame", input]); },
    subscribeInvalidation(listener) {
      calls.push([this.prefix, "subscribeInvalidation"]);
      return () => listener;
    },
  };

  const contract = defineRoomLobbyAdapter(adapter);
  assert.deepEqual(Object.keys(contract), ROOM_LOBBY_METHODS);

  await contract.createRoom({ maxPlayers: 4 });
  assert.deepEqual(calls[0], ["cant_stop", "createRoom", { maxPlayers: 4 }]);

  assert.throws(
    () => defineRoomLobbyAdapter({}),
    /createRoom/u,
  );
});

test("versioned actions require room, version and idempotency identity", () => {
  const action = createVersionedAction({
    roomId: "room-1",
    expectedVersion: 7,
    actionType: "choose_pairing",
    payload: { pairingIndex: 2 },
  }, {
    idFactory: () => "action-123",
  });

  assert.deepEqual(action, {
    roomId: "room-1",
    expectedVersion: 7,
    clientActionId: "action-123",
    actionType: "choose_pairing",
    payload: { pairingIndex: 2 },
  });
  assert.ok(Object.isFrozen(action));
  assert.ok(Object.isFrozen(action.payload));

  assert.throws(
    () => createVersionedAction({
      roomId: "room-1",
      expectedVersion: -1,
      actionType: "roll",
    }, { idFactory: () => "action-1" }),
    /non-negative integer/u,
  );

  assert.throws(
    () => createVersionedAction({
      roomId: "room-1",
      expectedVersion: 0,
      actionType: "Choose Pairing",
    }, { idFactory: () => "action-1" }),
    /lowercase snake_case/u,
  );
});

test("snapshot coordinator coalesces invalidations and keeps the newest authoritative version", async () => {
  let loadCount = 0;
  let resolveFirst;
  const acceptedVersions = [];

  const coordinator = createSnapshotCoordinator({
    loadSnapshot: async () => {
      loadCount += 1;
      if (loadCount === 1) {
        return new Promise((resolve) => {
          resolveFirst = resolve;
        });
      }
      return { version: 2, roomId: "room-1" };
    },
    subscribeInvalidation: () => () => {},
    onSnapshot: (snapshot) => acceptedVersions.push(snapshot.version),
  });

  const first = coordinator.refresh("manual");
  const coalesced = coordinator.refresh("invalidation");
  assert.equal(first, coalesced);

  resolveFirst({ version: 1, roomId: "room-1" });
  const result = await first;

  assert.equal(loadCount, 2);
  assert.equal(result.version, 2);
  assert.deepEqual(acceptedVersions, [1, 2]);
  assert.deepEqual(coordinator.current(), {
    snapshot: { version: 2, roomId: "room-1" },
    version: 2,
    refreshing: false,
  });

  coordinator.dispose();
});

test("snapshot coordinator rejects stale snapshots without overwriting current state", async () => {
  const snapshots = [
    { version: 4, marker: "new" },
    { version: 3, marker: "stale" },
  ];
  const coordinator = createSnapshotCoordinator({
    loadSnapshot: async () => snapshots.shift(),
    subscribeInvalidation: () => () => {},
  });

  assert.equal((await coordinator.refresh()).accepted, true);
  const stale = await coordinator.refresh();

  assert.equal(stale.accepted, false);
  assert.equal(stale.reason, "stale");
  assert.deepEqual(coordinator.current().snapshot, { version: 4, marker: "new" });
  coordinator.dispose();
});

test("snapshot coordinator subscribes to invalidation and unsubscribes on stop", async () => {
  let listener = null;
  let unsubscribed = false;
  let version = 0;

  const coordinator = createSnapshotCoordinator({
    loadSnapshot: async () => ({ version: ++version }),
    subscribeInvalidation(next) {
      listener = next;
      return () => {
        unsubscribed = true;
        listener = null;
      };
    },
  });

  await coordinator.start();
  assert.equal(coordinator.current().version, 1);

  listener();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(coordinator.current().version, 2);

  coordinator.stop();
  assert.equal(unsubscribed, true);
});

class FakeDocument extends EventTarget {
  visibilityState = "hidden";
}

test("reconnect refresh triggers authoritative refresh on browser return signals", async () => {
  const windowTarget = new EventTarget();
  const documentTarget = new FakeDocument();
  const reasons = [];

  const triggers = createReconnectRefreshTriggers({
    refresh: async (reason) => {
      reasons.push(reason);
    },
    windowTarget,
    documentTarget,
  });

  triggers.start();
  windowTarget.dispatchEvent(new Event("online"));
  windowTarget.dispatchEvent(new Event("pageshow"));
  documentTarget.dispatchEvent(new Event("visibilitychange"));
  documentTarget.visibilityState = "visible";
  documentTarget.dispatchEvent(new Event("visibilitychange"));
  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(reasons, ["online", "pageshow", "visibility"]);

  triggers.stop();
  windowTarget.dispatchEvent(new Event("online"));
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(reasons, ["online", "pageshow", "visibility"]);
});
