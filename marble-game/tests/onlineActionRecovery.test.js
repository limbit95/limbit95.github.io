import test from "node:test";
import assert from "node:assert/strict";

const originalWindow = globalThis.window;
globalThis.window = globalThis.window ?? {};
const {
  createOnlineClassicSession,
  isRetryableOnlineActionError,
} = await import("../js/onlineSession.js");
globalThis.window = originalWindow;

function snapshot(version, overrides = {}) {
  return {
    room: { id: "room-1", roomCode: "ABC123", status: "playing", currentGameId: "game-1" },
    game: {
      id: "game-1",
      status: "playing",
      phase: "WAITING_ROLL",
      turn: version,
      currentSeat: 0,
      version,
      pendingChoice: null,
      lastRoll: null,
      lastEvents: [],
      winnerPlayerId: null,
      rulesetVersion: 1,
    },
    players: [
      { id: "p1", userId: "u1", name: "A", seat: 0, positionNodeId: "start", money: 1500, bankrupt: false, skipTurns: 0 },
      { id: "p2", userId: "u2", name: "B", seat: 1, positionNodeId: "tokyo", money: 1200, bankrupt: false, skipTurns: 0 },
    ],
    properties: {},
    viewerUserId: "u1",
    viewerPlayerId: "p1",
    ...overrides,
  };
}

function installFakeBrowser() {
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  const windowListeners = new Map();
  const documentListeners = new Map();
  const timers = new Map();
  let nextTimerId = 1;

  globalThis.window = {
    setTimeout(callback) {
      const id = nextTimerId++;
      timers.set(id, callback);
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
    addEventListener(type, listener) {
      windowListeners.set(type, listener);
    },
    removeEventListener(type, listener) {
      if (windowListeners.get(type) === listener) windowListeners.delete(type);
    },
  };
  globalThis.document = {
    visibilityState: "visible",
    addEventListener(type, listener) {
      documentListeners.set(type, listener);
    },
    removeEventListener(type, listener) {
      if (documentListeners.get(type) === listener) documentListeners.delete(type);
    },
  };

  return {
    windowListeners,
    documentListeners,
    timers,
    restore() {
      globalThis.window = previousWindow;
      globalThis.document = previousDocument;
    },
  };
}

function baseApi(overrides = {}) {
  return {
    createActionId: () => "11111111-1111-4111-8111-111111111111",
    subscribeGame: () => () => {},
    getSnapshot: async () => snapshot(3),
    ...overrides,
  };
}

test("transport failures retry one logical action with the same client action id", async () => {
  const browser = installFakeBrowser();
  const requests = [];
  try {
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: snapshot(3),
      api: baseApi({
        getSnapshot: async () => { throw new Error("snapshot should not be needed"); },
        async roll(request) {
          requests.push(request);
          if (requests.length === 1) throw new TypeError("Failed to fetch");
          return snapshot(4);
        },
      }),
    });

    const state = await session.roll();
    assert.equal(state.version, 4);
    assert.equal(requests.length, 2);
    assert.equal(requests[0].clientActionId, requests[1].clientActionId);
    assert.equal(requests[0].expectedVersion, 3);
    assert.equal(requests[1].expectedVersion, 3);
    session.dispose();
  } finally {
    browser.restore();
  }
});

test("ambiguous transport failure reconciles a server-committed action from the latest snapshot", async () => {
  const browser = installFakeBrowser();
  let actionCalls = 0;
  let snapshotCalls = 0;
  try {
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: snapshot(3),
      api: baseApi({
        async roll() {
          actionCalls += 1;
          throw new TypeError("Network request failed");
        },
        async getSnapshot() {
          snapshotCalls += 1;
          return snapshot(4);
        },
      }),
    });

    const state = await session.roll();
    assert.equal(actionCalls, 2);
    assert.equal(snapshotCalls, 1);
    assert.equal(state.version, 4);
    assert.equal(session.getState().version, 4);
    session.dispose();
  } finally {
    browser.restore();
  }
});

test("deterministic server errors are not retried as transport failures", async () => {
  const browser = installFakeBrowser();
  let actionCalls = 0;
  let snapshotCalls = 0;
  try {
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: snapshot(3),
      api: baseApi({
        async roll() {
          actionCalls += 1;
          throw new Error("VERSION_CONFLICT");
        },
        async getSnapshot() {
          snapshotCalls += 1;
          return snapshot(4);
        },
      }),
    });

    await assert.rejects(session.roll(), /VERSION_CONFLICT/);
    assert.equal(actionCalls, 1);
    assert.equal(snapshotCalls, 0);
    session.dispose();
  } finally {
    browser.restore();
  }
});

test("an older action response cannot roll the session state backward", async () => {
  const browser = installFakeBrowser();
  try {
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: snapshot(5),
      api: baseApi({
        roll: async () => snapshot(4),
      }),
    });

    const state = await session.roll();
    assert.equal(state.version, 5);
    assert.equal(session.getState().version, 5);
    session.dispose();
  } finally {
    browser.restore();
  }
});

test("returning to a visible tab refreshes authoritative state and dispose removes the listener", async () => {
  const browser = installFakeBrowser();
  const remoteVersions = [];
  let snapshotCalls = 0;
  try {
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: snapshot(3),
      onRemoteState: async (state) => remoteVersions.push(state.version),
      api: baseApi({
        async getSnapshot() {
          snapshotCalls += 1;
          return snapshot(4);
        },
      }),
    });

    assert.equal(browser.documentListeners.has("visibilitychange"), true);
    browser.documentListeners.get("visibilitychange")();
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(snapshotCalls, 1);
    assert.equal(session.getState().version, 4);
    assert.deepEqual(remoteVersions, [4]);

    session.dispose();
    assert.equal(browser.documentListeners.has("visibilitychange"), false);
  } finally {
    browser.restore();
  }
});

test("retry classification is limited to transport-like failures", () => {
  assert.equal(isRetryableOnlineActionError(new TypeError("Failed to fetch")), true);
  assert.equal(isRetryableOnlineActionError(new Error("NetworkError when attempting to fetch resource")), true);
  assert.equal(isRetryableOnlineActionError(new Error("VERSION_CONFLICT")), false);
  assert.equal(isRetryableOnlineActionError(new Error("NOT_YOUR_TURN")), false);
});
