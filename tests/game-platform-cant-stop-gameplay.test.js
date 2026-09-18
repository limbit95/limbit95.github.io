import assert from "node:assert/strict";
import { test } from "node:test";

import { createCantStopGameplayAdapter } from "../games/cant-stop/gameplay.js";

function fakeClient({ result = null, error = null } = {}) {
  const calls = [];
  return {
    calls,
    async rpc(name, args) {
      calls.push([name, args]);
      return { data: result, error };
    },
  };
}

test("Can't Stop gameplay rollDice sends intent without client-provided dice", async () => {
  const client = fakeClient({
    result: {
      version: 4,
      game: {
        phase: "PAIRING_SELECTION",
        latestDice: [1, 2, 3, 4],
      },
    },
  });
  const adapter = createCantStopGameplayAdapter({ client });

  const snapshot = await adapter.rollDice({
    roomId: "room-1",
    expectedVersion: 3,
    clientActionId: "roll-1",
  });

  assert.equal(snapshot.version, 4);
  assert.deepEqual(client.calls, [
    ["cant_stop_roll_dice", {
      p_room_id: "room-1",
      p_expected_version: 3,
      p_client_action_id: "roll-1",
    }],
  ]);
  assert.equal(
    Object.keys(client.calls[0][1]).some((key) => /dice|random/iu.test(key)),
    false,
  );
});

test("Can't Stop gameplay rollDice rejects invalid versions before RPC", async () => {
  const client = fakeClient();
  const adapter = createCantStopGameplayAdapter({ client });

  await assert.rejects(
    () => adapter.rollDice({
      roomId: "room-1",
      expectedVersion: -1,
      clientActionId: "roll-1",
    }),
    /non-negative integer/u,
  );
  assert.equal(client.calls.length, 0);
});

test("Can't Stop gameplay rollDice surfaces authoritative RPC errors", async () => {
  const rpcError = new Error("TURN_REQUIRED");
  const client = fakeClient({ error: rpcError });
  const adapter = createCantStopGameplayAdapter({ client });

  await assert.rejects(
    () => adapter.rollDice({
      roomId: "room-1",
      expectedVersion: 4,
      clientActionId: "roll-1",
    }),
    /TURN_REQUIRED/u,
  );
});


test("Can't Stop gameplay choosePairing sends only the selected server-issued sums and plan", async () => {
  const client = fakeClient({
    result: {
      version: 5,
      game: {
        phase: "PUSH_OR_STOP",
        runners: { 3: 1, 7: 1 },
      },
    },
  });
  const adapter = createCantStopGameplayAdapter({ client });

  const snapshot = await adapter.choosePairing({
    roomId: "room-1",
    sums: [3, 7],
    columns: [3, 7],
    expectedVersion: 4,
    clientActionId: "pairing-1",
  });

  assert.equal(snapshot.version, 5);
  assert.deepEqual(client.calls, [
    ["cant_stop_choose_pairing", {
      p_room_id: "room-1",
      p_sums: [3, 7],
      p_columns: [3, 7],
      p_expected_version: 4,
      p_client_action_id: "pairing-1",
    }],
  ]);
});

test("Can't Stop gameplay choosePairing accepts a single-column legal move plan", async () => {
  const client = fakeClient({ result: { version: 6 } });
  const adapter = createCantStopGameplayAdapter({ client });

  await adapter.choosePairing({
    roomId: "room-1",
    sums: [4, 5],
    columns: [4],
    expectedVersion: 5,
    clientActionId: "pairing-single",
  });

  assert.deepEqual(client.calls[0][1].p_columns, [4]);
});

test("Can't Stop gameplay choosePairing rejects malformed client plans before RPC", async () => {
  const client = fakeClient();
  const adapter = createCantStopGameplayAdapter({ client });

  await assert.rejects(
    () => adapter.choosePairing({
      roomId: "room-1",
      sums: [3],
      columns: [3],
      expectedVersion: 4,
      clientActionId: "bad-pairing",
    }),
    /exactly 2 columns/u,
  );

  await assert.rejects(
    () => adapter.choosePairing({
      roomId: "room-1",
      sums: [3, 7],
      columns: [1, 7],
      expectedVersion: 4,
      clientActionId: "bad-plan",
    }),
    /integers from 2 to 12/u,
  );

  assert.equal(client.calls.length, 0);
});


test("Can't Stop gameplay continueTurn sends only the versioned roll-again intent", async () => {
  const client = fakeClient({ result: { version: 8, game: { phase: "TURN_ROLL" } } });
  const adapter = createCantStopGameplayAdapter({ client });

  const snapshot = await adapter.continueTurn({
    roomId: "room-1",
    expectedVersion: 7,
    clientActionId: "continue-1",
  });

  assert.equal(snapshot.version, 8);
  assert.deepEqual(client.calls, [
    ["cant_stop_continue_turn", {
      p_room_id: "room-1",
      p_expected_version: 7,
      p_client_action_id: "continue-1",
    }],
  ]);
});

test("Can't Stop gameplay stopTurn sends only the versioned stop intent", async () => {
  const client = fakeClient({ result: { version: 9, game: { phase: "TURN_ROLL" } } });
  const adapter = createCantStopGameplayAdapter({ client });

  const snapshot = await adapter.stopTurn({
    roomId: "room-1",
    expectedVersion: 8,
    clientActionId: "stop-1",
  });

  assert.equal(snapshot.version, 9);
  assert.deepEqual(client.calls, [
    ["cant_stop_stop_turn", {
      p_room_id: "room-1",
      p_expected_version: 8,
      p_client_action_id: "stop-1",
    }],
  ]);
});

test("Can't Stop gameplay push/stop intents reject invalid versions before RPC", async () => {
  const client = fakeClient();
  const adapter = createCantStopGameplayAdapter({ client });

  await assert.rejects(
    () => adapter.continueTurn({
      roomId: "room-1",
      expectedVersion: -1,
      clientActionId: "continue-bad",
    }),
    /non-negative integer/u,
  );

  await assert.rejects(
    () => adapter.stopTurn({
      roomId: "room-1",
      expectedVersion: -1,
      clientActionId: "stop-bad",
    }),
    /non-negative integer/u,
  );

  assert.equal(client.calls.length, 0);
});
