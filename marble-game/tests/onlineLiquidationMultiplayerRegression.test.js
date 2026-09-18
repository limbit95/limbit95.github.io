import test from "node:test";
import assert from "node:assert/strict";

const originalWindow = globalThis.window;
globalThis.window = globalThis.window ?? {};
const { createOnlineClassicSession } = await import("../js/onlineSession.js");
const { createOnlineGameApi } = await import("../js/onlineGameApi.js");
const { createOnlineLiquidationUiModel } = await import("../js/onlineLiquidationUi.js");
globalThis.window = originalWindow;

function installFakeBrowser() {
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  globalThis.window = {
    setTimeout: () => 1,
    clearTimeout() {},
    addEventListener() {},
    removeEventListener() {},
  };
  globalThis.document = {
    visibilityState: "visible",
    addEventListener() {},
    removeEventListener() {},
  };
  return () => {
    globalThis.window = previousWindow;
    globalThis.document = previousDocument;
  };
}

function flush() {
  return new Promise((resolve) => setImmediate(resolve));
}

function clone(value) {
  return value === null || value === undefined ? value : JSON.parse(JSON.stringify(value));
}

function createHarness() {
  const changes = new Map();
  const snapshotOverrides = new Map();
  const actionCalls = [];
  const server = {
    version: 10,
    phase: "WAITING_CHOICE",
    currentSeat: 0,
    pendingChoice: {
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
        { assetId: "seoul", refund: 260, buildingLevel: 2 },
      ],
      selectedAssetIds: [],
      refundTotal: 0,
      remainingShortfall: 100,
      ready: false,
    },
    lastEvents: [],
    players: [
      { id: "p1", userId: "u1", name: "A", seat: 0, positionNodeId: "singapore", money: 50, bankrupt: false, skipTurns: 0 },
      { id: "p2", userId: "u2", name: "B", seat: 1, positionNodeId: "tokyo", money: 1500, bankrupt: false, skipTurns: 0 },
      { id: "p3", userId: "u3", name: "C", seat: 2, positionNodeId: "start", money: 1200, bankrupt: false, skipTurns: 0 },
    ],
    properties: {
      singapore: { ownerId: "p1", ownerSeat: 0, buildingLevel: 0 },
      seoul: { ownerId: "p1", ownerSeat: 0, buildingLevel: 2 },
      tokyo: { ownerId: "p2", ownerSeat: 1, buildingLevel: 0 },
    },
  };

  function snapshotFor(viewerPlayerId) {
    return {
      room: { id: "room-1", roomCode: "ABC123", status: "playing", currentGameId: "game-1" },
      game: {
        id: "game-1",
        status: "playing",
        phase: server.phase,
        turn: 5,
        currentSeat: server.currentSeat,
        version: server.version,
        pendingChoice: clone(server.pendingChoice),
        pendingTrade: null,
        lastRoll: { dice: [2, 3], total: 5, isDouble: false },
        lastEvents: clone(server.lastEvents),
        winnerPlayerId: null,
        rulesetVersion: 1,
      },
      players: clone(server.players),
      properties: clone(server.properties),
      viewerUserId: server.players.find((player) => player.id === viewerPlayerId)?.userId ?? null,
      viewerPlayerId,
    };
  }

  function assertCommon(params) {
    assert.equal(params.p_room_id, "room-1");
    assert.equal(params.p_expected_version, server.version);
    assert.equal(typeof params.p_client_action_id, "string");
    assert.ok(params.p_client_action_id.length > 0);
  }

  function bump(events) {
    server.version += 1;
    server.lastEvents = events;
  }

  async function executeRpc(viewerPlayerId, name, params = {}) {
    if (name === "marble_get_game_snapshot") {
      return snapshotOverrides.get(viewerPlayerId) ?? snapshotFor(viewerPlayerId);
    }

    assertCommon(params);
    actionCalls.push({ viewerPlayerId, name, ...params });

    if (name === "marble_liquidation_select") {
      assert.equal(viewerPlayerId, "p1");
      assert.equal(server.phase, "WAITING_CHOICE");
      assert.equal(server.pendingChoice?.type, "DEBT_RECOVERY");

      const selectedIds = Array.isArray(params.p_asset_ids) ? params.p_asset_ids : [];
      const catalogById = new Map(server.pendingChoice.catalog.map((asset) => [asset.assetId, asset]));
      const refundTotal = selectedIds.reduce((sum, assetId) => {
        const asset = catalogById.get(assetId);
        if (!asset) throw new Error("LIQUIDATION_ASSET_NOT_AVAILABLE");
        return sum + Number(asset.refund);
      }, 0);
      const availableCash = Number(server.pendingChoice.cash) + refundTotal;
      const remainingShortfall = Math.max(0, Number(server.pendingChoice.amountDue) - availableCash);
      const ready = availableCash >= Number(server.pendingChoice.amountDue);

      server.pendingChoice = {
        ...server.pendingChoice,
        status: ready ? "READY" : "OPEN",
        selectedAssetIds: [...selectedIds],
        refundTotal,
        remainingShortfall,
        ready,
      };
      bump([{
        type: "LIQUIDATION_SELECTION_UPDATED",
        playerId: "p1",
        selectedAssetIds: [...selectedIds],
        refundTotal,
        remainingShortfall,
        ready,
      }]);
      return snapshotFor(viewerPlayerId);
    }

    if (name === "marble_liquidation_confirm") {
      assert.equal(viewerPlayerId, "p1");
      assert.equal(server.pendingChoice?.type, "DEBT_RECOVERY");
      assert.equal(server.pendingChoice.ready, true);

      const choice = server.pendingChoice;
      const catalogById = new Map(choice.catalog.map((asset) => [asset.assetId, asset]));
      const refundTotal = choice.selectedAssetIds.reduce(
        (sum, assetId) => sum + Number(catalogById.get(assetId)?.refund ?? 0),
        0,
      );

      for (const assetId of choice.selectedAssetIds) {
        server.properties[assetId].ownerId = null;
        server.properties[assetId].ownerSeat = null;
        server.properties[assetId].buildingLevel = 0;
      }

      const debtor = server.players.find((player) => player.id === "p1");
      const creditor = server.players.find((player) => player.id === "p2");
      debtor.money = Number(choice.cash) + refundTotal - Number(choice.amountDue);
      creditor.money += Number(choice.amountDue);

      const liquidatedEvents = choice.selectedAssetIds.map((assetId) => ({
        type: "PROPERTY_LIQUIDATED",
        playerId: "p1",
        nodeId: assetId,
        refund: Number(catalogById.get(assetId)?.refund ?? 0),
      }));

      server.pendingChoice = null;
      server.phase = "TURN_END";
      bump([
        ...liquidatedEvents,
        { type: "MONEY_PAID", playerId: "p1", creditorId: "p2", amount: 150, reason: "TOLL" },
        { type: "DEBT_RECOVERED", playerId: "p1", creditorId: "p2", amountDue: 150, refundTotal },
      ]);
      return snapshotFor(viewerPlayerId);
    }

    throw new Error("UNEXPECTED_RPC:" + name);
  }

  function clientFor(viewerPlayerId) {
    return {
      async rpc(name, params) {
        try {
          return { data: await executeRpc(viewerPlayerId, name, params), error: null };
        } catch (error) {
          return { data: null, error };
        }
      },
      channel() {
        let changeHandler = null;
        const channel = {
          on(type, _filter, handler) {
            if (type === "postgres_changes") changeHandler = handler;
            return channel;
          },
          subscribe(statusHandler) {
            changes.set(viewerPlayerId, {
              change: () => changeHandler?.(),
              status: statusHandler,
            });
            statusHandler?.("SUBSCRIBED");
            return channel;
          },
        };
        return channel;
      },
      removeChannel() {
        changes.delete(viewerPlayerId);
      },
    };
  }

  function apiFor(viewerPlayerId) {
    return createOnlineGameApi({ client: clientFor(viewerPlayerId) });
  }

  async function broadcast(...viewerPlayerIds) {
    viewerPlayerIds.forEach((playerId) => changes.get(playerId)?.change?.());
    await flush();
  }

  return {
    actionCalls,
    apiFor,
    broadcast,
    server,
    snapshotFor,
    snapshotOverrides,
  };
}

test("three online clients propagate liquidation selection and settlement consistently", async () => {
  const restore = installFakeBrowser();
  const harness = createHarness();
  const sessions = [];

  try {
    for (const viewerPlayerId of ["p1", "p2", "p3"]) {
      sessions.push(await createOnlineClassicSession({
        roomId: "room-1",
        api: harness.apiFor(viewerPlayerId),
      }));
    }

    const [debtor, creditor, observer] = sessions;

    assert.equal(createOnlineLiquidationUiModel(debtor.getState(), "p1").isDebtor, true);
    assert.equal(createOnlineLiquidationUiModel(creditor.getState(), "p2").isDebtor, false);
    assert.equal(createOnlineLiquidationUiModel(observer.getState(), "p3").isDebtor, false);

    await debtor.selectLiquidation(["singapore"]);
    assert.equal(debtor.getState().version, 11);
    assert.equal(debtor.getState().pendingChoice.ready, true);
    assert.equal(debtor.getState().pendingChoice.refundTotal, 130);

    await harness.broadcast("p2", "p3");
    for (const session of [creditor, observer]) {
      assert.equal(session.getState().version, 11);
      assert.equal(session.getState().pendingChoice.status, "READY");
      assert.deepEqual(session.getState().pendingChoice.selectedAssetIds, ["singapore"]);
    }

    const staleObserverSnapshot = harness.snapshotFor("p3");

    await debtor.confirmLiquidation();
    assert.equal(debtor.getState().version, 12);
    assert.equal(debtor.getState().phase, "TURN_END");
    assert.equal(debtor.getState().pendingChoice, null);
    assert.equal(debtor.getState().players.find((player) => player.id === "p1").money, 30);
    assert.equal(debtor.getState().players.find((player) => player.id === "p2").money, 1650);
    assert.equal(debtor.getState().boardState.properties.singapore.ownerId, null);

    await harness.broadcast("p2", "p3");
    for (const session of [creditor, observer]) {
      assert.equal(session.getState().version, 12);
      assert.equal(session.getState().phase, "TURN_END");
      assert.equal(session.getState().pendingChoice, null);
      assert.equal(session.getState().players.find((player) => player.id === "p1").money, 30);
      assert.equal(session.getState().players.find((player) => player.id === "p2").money, 1650);
      assert.equal(session.getState().boardState.properties.singapore.ownerId, null);
    }

    harness.snapshotOverrides.set("p3", staleObserverSnapshot);
    await harness.broadcast("p3");
    assert.equal(observer.getState().version, 12);
    assert.equal(observer.getState().pendingChoice, null);
    assert.equal(observer.getState().boardState.properties.singapore.ownerId, null);

    assert.deepEqual(
      harness.actionCalls.map((call) => call.p_expected_version),
      [10, 11],
    );
    assert.deepEqual(
      harness.actionCalls.map((call) => call.name),
      ["marble_liquidation_select", "marble_liquidation_confirm"],
    );
    assert.equal(
      new Set(harness.actionCalls.map((call) => call.p_client_action_id)).size,
      harness.actionCalls.length,
    );
  } finally {
    sessions.forEach((session) => session.dispose());
    restore();
  }
});

test("reconnecting observer reconstructs open debt recovery from snapshot alone", async () => {
  const restore = installFakeBrowser();
  const harness = createHarness();
  let session = null;

  try {
    harness.server.version = 21;
    harness.server.pendingChoice = {
      ...harness.server.pendingChoice,
      selectedAssetIds: ["singapore"],
      refundTotal: 130,
      remainingShortfall: 0,
      ready: true,
      status: "READY",
    };

    session = await createOnlineClassicSession({
      roomId: "room-1",
      api: harness.apiFor("p3"),
    });

    assert.equal(session.getState().version, 21);
    assert.equal(session.getState().pendingChoice.type, "DEBT_RECOVERY");
    const model = createOnlineLiquidationUiModel(session.getState(), "p3");
    assert.equal(model.isDebtor, false);
    assert.equal(model.ready, true);
    assert.equal(model.assets.find((asset) => asset.id === "singapore").selected, true);
  } finally {
    session?.dispose();
    restore();
  }
});

test("observer cannot settle debt recovery through the debtor-only UI model", async () => {
  const restore = installFakeBrowser();
  const harness = createHarness();
  let observer = null;

  try {
    observer = await createOnlineClassicSession({
      roomId: "room-1",
      api: harness.apiFor("p3"),
    });

    const model = createOnlineLiquidationUiModel(observer.getState(), "p3");
    assert.equal(model.isDebtor, false);

    await assert.rejects(
      () => observer.selectLiquidation(["singapore"]),
      /p1|UNEXPECTED_RPC|DEBT_RECOVERY_DEBTOR_REQUIRED/i,
    );
  } finally {
    observer?.dispose();
    restore();
  }
});
