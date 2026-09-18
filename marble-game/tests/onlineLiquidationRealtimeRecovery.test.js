import test from "node:test";
import assert from "node:assert/strict";

const originalWindow = globalThis.window;
globalThis.window = globalThis.window ?? {};
const {
  createOnlineClassicSession,
  mapOnlineGameSnapshot,
} = await import("../js/onlineSession.js");
globalThis.window = originalWindow;

function debtChoice(overrides = {}) {
  return {
    type: "DEBT_RECOVERY",
    status: "OPEN",
    playerId: "p1",
    creditorId: "p2",
    amountDue: 150,
    reason: "TOLL",
    cash: 50,
    shortfall: 100,
    catalog: [
      { assetId: "singapore", refund: 130, buildingLevel: 0 },
    ],
    selectedAssetIds: [],
    refundTotal: 0,
    remainingShortfall: 100,
    ready: false,
    ...overrides,
  };
}

function snapshot(version, {
  pendingChoice = debtChoice(),
  phase = "WAITING_CHOICE",
  playerMoney = { p1: 50, p2: 1500 },
  singaporeOwner = "p1",
  lastEvents = [],
} = {}) {
  return {
    room: { id: "room-1", roomCode: "ABC123", status: "playing", currentGameId: "game-1" },
    game: {
      id: "game-1",
      status: "playing",
      phase,
      turn: 3,
      currentSeat: 0,
      version,
      pendingChoice,
      pendingTrade: null,
      lastRoll: { dice: [2, 3], total: 5, isDouble: false },
      lastEvents,
      winnerPlayerId: null,
      rulesetVersion: 1,
    },
    players: [
      { id: "p1", userId: "u1", name: "A", seat: 0, positionNodeId: "singapore", money: playerMoney.p1, bankrupt: false, skipTurns: 0 },
      { id: "p2", userId: "u2", name: "B", seat: 1, positionNodeId: "tokyo", money: playerMoney.p2, bankrupt: false, skipTurns: 0 },
    ],
    properties: {
      singapore: { ownerId: singaporeOwner, ownerSeat: singaporeOwner ? 0 : null, buildingLevel: 0 },
    },
    viewerUserId: "u1",
    viewerPlayerId: "p1",
  };
}

function installFakeBrowser() {
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
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
    addEventListener() {},
    removeEventListener() {},
  };
  globalThis.document = {
    visibilityState: "visible",
    addEventListener() {},
    removeEventListener() {},
  };

  return {
    timers,
    restore() {
      globalThis.window = previousWindow;
      globalThis.document = previousDocument;
    },
  };
}

function flush() {
  return new Promise((resolve) => setImmediate(resolve));
}

test("debt recovery snapshot maps nested catalog and selection immutably", () => {
  const state = mapOnlineGameSnapshot(snapshot(10));

  assert.equal(state.pendingChoice.type, "DEBT_RECOVERY");
  assert.equal(state.pendingChoice.catalog[0].assetId, "singapore");
  assert.equal(state.pendingChoice.catalog[0].refund, 130);
  assert.deepEqual(state.pendingChoice.selectedAssetIds, []);
  assert.equal(Object.isFrozen(state.pendingChoice), true);
  assert.equal(Object.isFrozen(state.pendingChoice.catalog), true);
  assert.equal(Object.isFrozen(state.pendingChoice.catalog[0]), true);
  assert.equal(Object.isFrozen(state.pendingChoice.selectedAssetIds), true);
});

test("online liquidation selection uses shared versioned action identity", async () => {
  const browser = installFakeBrowser();
  const calls = [];
  const actionId = "66666666-6666-4666-8666-666666666666";

  try {
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: snapshot(20),
      api: {
        createActionId: () => actionId,
        subscribeGame: () => () => {},
        async selectLiquidation(request) {
          calls.push(request);
          return snapshot(21, {
            pendingChoice: debtChoice({
              status: "READY",
              selectedAssetIds: ["singapore"],
              refundTotal: 130,
              remainingShortfall: 0,
              ready: true,
            }),
          });
        },
      },
    });

    const state = await session.selectLiquidation(["singapore"]);

    assert.equal(state.version, 21);
    assert.equal(state.pendingChoice.ready, true);
    assert.deepEqual(calls, [{
      roomId: "room-1",
      expectedVersion: 20,
      clientActionId: actionId,
      assetIds: ["singapore"],
    }]);

    session.dispose();
  } finally {
    browser.restore();
  }
});

test("online liquidation confirm settles through authoritative snapshot", async () => {
  const browser = installFakeBrowser();

  try {
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: snapshot(30, {
        pendingChoice: debtChoice({
          status: "READY",
          selectedAssetIds: ["singapore"],
          refundTotal: 130,
          remainingShortfall: 0,
          ready: true,
        }),
      }),
      api: {
        createActionId: () => "77777777-7777-4777-8777-777777777777",
        subscribeGame: () => () => {},
        async confirmLiquidation() {
          return snapshot(31, {
            pendingChoice: null,
            phase: "TURN_END",
            playerMoney: { p1: 30, p2: 1650 },
            singaporeOwner: null,
            lastEvents: [
              { type: "PROPERTY_LIQUIDATED", nodeId: "singapore" },
              { type: "MONEY_PAID", amount: 150 },
              { type: "DEBT_RECOVERED", amountDue: 150 },
            ],
          });
        },
      },
    });

    const state = await session.confirmLiquidation();

    assert.equal(state.pendingChoice, null);
    assert.equal(state.phase, "TURN_END");
    assert.equal(state.players[0].money, 30);
    assert.equal(state.players[1].money, 1650);
    assert.equal(state.boardState.properties.singapore.ownerId, null);

    session.dispose();
  } finally {
    browser.restore();
  }
});

test("realtime and reconnect recovery restore latest debt recovery snapshot", async () => {
  const browser = installFakeBrowser();
  let latestSnapshot = snapshot(40, { pendingChoice: null, phase: "WAITING_ROLL" });
  let realtimeChange = null;
  let realtimeStatus = null;

  try {
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: latestSnapshot,
      api: {
        async getSnapshot() {
          return latestSnapshot;
        },
        subscribeGame(_roomId, { onChange, onStatus }) {
          realtimeChange = onChange;
          realtimeStatus = onStatus;
          return () => {};
        },
      },
    });

    latestSnapshot = snapshot(41);
    realtimeChange();
    await flush();
    assert.equal(session.getState().pendingChoice.type, "DEBT_RECOVERY");

    latestSnapshot = snapshot(42, {
      pendingChoice: debtChoice({
        status: "READY",
        selectedAssetIds: ["singapore"],
        refundTotal: 130,
        remainingShortfall: 0,
        ready: true,
      }),
    });
    realtimeStatus("CLOSED");
    const [timerId, recovery] = browser.timers.entries().next().value;
    browser.timers.delete(timerId);
    await recovery();
    await flush();

    assert.equal(session.getState().version, 42);
    assert.equal(session.getState().pendingChoice.status, "READY");
    assert.deepEqual(session.getState().pendingChoice.selectedAssetIds, ["singapore"]);

    session.dispose();
  } finally {
    browser.restore();
  }
});

test("stale liquidation snapshot cannot roll settled state backward", async () => {
  const browser = installFakeBrowser();
  let latestSnapshot = snapshot(51, {
    pendingChoice: null,
    phase: "TURN_END",
    playerMoney: { p1: 30, p2: 1650 },
    singaporeOwner: null,
  });

  try {
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: latestSnapshot,
      api: {
        subscribeGame: () => () => {},
        async getSnapshot() {
          return snapshot(50);
        },
      },
    });

    await session.refresh({ notify: false });
    assert.equal(session.getState().version, 51);
    assert.equal(session.getState().pendingChoice, null);
    assert.equal(session.getState().boardState.properties.singapore.ownerId, null);

    session.dispose();
  } finally {
    browser.restore();
  }
});
