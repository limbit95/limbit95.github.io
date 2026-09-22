import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { createNoThanksGameplayAdapter } from "../games/no-thanks/gameplay.js";

const migration = readFileSync(
  new URL(
    "../supabase/no-thanks/20260922055300_no_thanks_gameplay_actions.sql",
    import.meta.url,
  ),
  "utf8",
);
const rematchMigration = readFileSync(
  new URL(
    "../supabase/no-thanks/20260922170000_no_thanks_rematch_lobby.sql",
    import.meta.url,
  ),
  "utf8",
);

function fakeClient() {
  const calls = [];
  return {
    calls,
    async rpc(name, args) {
      calls.push([name, args]);
      return {
        data: {
          version: args.p_expected_version + 1,
          room: { id: args.p_room_id, status: "playing" },
        },
        error: null,
      };
    },
  };
}

test("No Thanks! gameplay adapter maps refuse/take intents to one game-local RPC", async () => {
  const client = fakeClient();
  const adapter = createNoThanksGameplayAdapter({ client });

  await adapter.refuseCard({
    roomId: "room-1",
    expectedVersion: 4,
    clientActionId: "refuse-1",
  });
  await adapter.takeCard({
    roomId: "room-1",
    expectedVersion: 5,
    clientActionId: "take-1",
  });
  await adapter.endGame({
    roomId: "room-1",
    expectedVersion: 6,
    clientActionId: "end-1",
  });
  await adapter.prepareRematch({
    roomId: "room-1",
    expectedVersion: 7,
    clientActionId: "rematch-1",
  });

  assert.deepEqual(client.calls, [
    ["no_thanks_play_action", {
      p_room_id: "room-1",
      p_action_type: "refuse_card",
      p_expected_version: 4,
      p_client_action_id: "refuse-1",
    }],
    ["no_thanks_play_action", {
      p_room_id: "room-1",
      p_action_type: "take_card",
      p_expected_version: 5,
      p_client_action_id: "take-1",
    }],
    ["no_thanks_play_action", {
      p_room_id: "room-1",
      p_action_type: "end_game",
      p_expected_version: 6,
      p_client_action_id: "end-1",
    }],
    ["no_thanks_prepare_rematch", {
      p_room_id: "room-1",
      p_expected_version: 7,
      p_client_action_id: "rematch-1",
    }],
  ]);
});

test("No Thanks! gameplay migration keeps actions versioned, idempotent, and server-authoritative", () => {
  assert.match(migration, /p_expected_version bigint/u);
  assert.match(migration, /p_client_action_id text/u);
  assert.match(migration, /VERSION_CONFLICT/u);
  assert.match(migration, /ACTION_CONFLICT/u);
  assert.match(migration, /TURN_REQUIRED/u);
  assert.match(migration, /TAKE_REQUIRED/u);
  assert.match(migration, /HOST_REQUIRED/u);
  assert.match(migration, /HOST_TERMINATED/u);
  assert.match(migration, /for update/u);
  assert.match(migration, /no_thanks_room_private_state/u);
  assert.match(migration, /player_counters/u);
  assert.match(migration, /draw_deck/u);
});

test("No Thanks! gameplay migration calculates terminal scores without exposing private counters", () => {
  assert.match(migration, /private\.no_thanks_card_score/u);
  assert.match(migration, /GAME_OVER/u);
  assert.match(migration, /LAST_CARD_TAKEN/u);
  assert.match(migration, /finalScores/u);
  assert.match(migration, /winners/u);
  assert.doesNotMatch(migration, /grant select on table public\.no_thanks_room_private_state to authenticated/u);
});


test("No Thanks! rematch migration preserves membership while resetting game state", () => {
  assert.match(rematchMigration, /create or replace function public\.no_thanks_prepare_rematch/u);
  assert.match(rematchMigration, /HOST_REQUIRED/u);
  assert.match(rematchMigration, /REMATCH_NOT_READY/u);
  assert.match(rematchMigration, /REMATCH_PLAYERS_CHANGED/u);
  assert.match(rematchMigration, /set is_ready = false,[\s\S]*?cards = '\{\}'::integer\[\]/u);
  assert.match(rematchMigration, /delete from public\.no_thanks_room_private_state/u);
  assert.match(rematchMigration, /set status = 'waiting',[\s\S]*?game_state = null/u);
  assert.doesNotMatch(rematchMigration, /membership_status = 'left'/u);
});
