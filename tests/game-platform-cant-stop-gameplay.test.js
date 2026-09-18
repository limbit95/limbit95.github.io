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
