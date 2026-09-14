import test from "node:test";
import assert from "node:assert/strict";

function gameSnapshot(version = 3) {
  return {
    room: { id: "room-1" },
    game: {
      id: "game-1",
      status: "PLAYING",
      phase: "WAITING_ROLL",
      currentSeat: 0,
      turn: version - 2,
      version,
    },
    viewerPlayerId: "player-b",
    players: [
      { id: "player-a", userId: "user-a", name: "A", seat: 0, positionNodeId: "start", money: 2000000 },
      { id: "player-b", userId: "user-b", name: "B", seat: 1, positionNodeId: "start", money: 2000000 },
    ],
    properties: {},
  };
}

test("remote snapshot failure starts recovery polling even while realtime stays subscribed", async () => {
  const originalWindow = globalThis.window;
  const timers = new Map();
  const listeners = new Map();
  let nextTimerId = 0;
  globalThis.window = {
    setTimeout(callback) {
      const id = ++nextTimerId;
      timers.set(id, callback);
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    removeEventListener(type) {
      listeners.delete(type);
    },
  };

  let realtimeChange = null;
  let realtimeStatus = null;
  let latestSnapshot = gameSnapshot(3);
  let failNextSnapshot = false;
  let snapshotCalls = 0;
  const connectionStatuses = [];

  try {
    const { createOnlineClassicSession } = await import("../js/onlineSession.js");
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: gameSnapshot(3),
      onConnectionStatus(status) {
        connectionStatuses.push(status);
      },
      api: {
        async getSnapshot() {
          snapshotCalls += 1;
          if (failNextSnapshot) {
            failNextSnapshot = false;
            throw new TypeError("Failed to fetch");
          }
          return latestSnapshot;
        },
        subscribeGame(_roomId, { onChange, onStatus }) {
          realtimeChange = onChange;
          realtimeStatus = onStatus;
          return () => {};
        },
      },
    });

    realtimeStatus("SUBSCRIBED");
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(snapshotCalls, 1);
    assert.equal(session.getState().version, 3);
    assert.equal(timers.size, 0);

    latestSnapshot = gameSnapshot(4);
    failNextSnapshot = true;
    realtimeChange();
    await new Promise((resolve) => setImmediate(resolve));

    assert.equal(snapshotCalls, 2);
    assert.equal(session.getState().version, 3);
    assert.equal(connectionStatuses.at(-1), "RECONNECTING");
    assert.equal(timers.size, 1);

    const [timerId, recovery] = timers.entries().next().value;
    timers.delete(timerId);
    await recovery();
    await new Promise((resolve) => setImmediate(resolve));

    assert.equal(snapshotCalls, 3);
    assert.equal(session.getState().version, 4);
    assert.equal(connectionStatuses.at(-1), "SUBSCRIBED");
    assert.equal(timers.size, 0);

    session.dispose();
  } finally {
    globalThis.window = originalWindow;
  }
});
