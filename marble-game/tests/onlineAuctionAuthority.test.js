import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const migration = readFileSync(
  new URL("../../supabase/marble/20260917213000_marble_phase7a_auction_authority.sql", import.meta.url),
  "utf8",
);
const apiSource = readFileSync(new URL("../js/onlineGameApi.js", import.meta.url), "utf8");

test("Phase 7A auction RPCs keep request gating server-authoritative", () => {
  assert.match(migration, /marble_decline_property_for_auction/);
  assert.match(migration, /'type','AUCTION_REQUEST'/);
  assert.match(migration, /'reason','NO_ELIGIBLE_PLAYERS'/);
  assert.match(migration, /marble_request_auction/);
  assert.match(migration, /AUCTION_ALREADY_REQUESTED/);
  assert.match(migration, /marble_close_auction_request/);
  assert.match(migration, /case when jsonb_array_length\(v_requested\)>0 then 'REQUESTED' else 'NO_REQUESTS'/);
  assert.match(migration, /'type','PROPERTY_AUCTION'/);
});

test("auction requests and bids use versioning, replay protection, and server validation", () => {
  assert.match(migration, /marble_action_replay/);
  assert.match(migration, /marble_record_action/);
  assert.match(migration, /VERSION_CONFLICT/);
  assert.match(migration, /for update/);
  assert.match(migration, /gp\.money>=v_opening_bid/);
  assert.match(migration, /AUCTION_REQUESTER_BID_REQUIRED/);
  assert.match(migration, /p_amount>v_actor\.money/);
});

test("auction settlement updates money and ownership in the same authoritative RPC", () => {
  assert.match(migration, /update public\.marble_game_players set money=money-v_highest/);
  assert.match(migration, /update public\.marble_game_properties set owner_seat=v_winner\.seat, building_level=0/);
  assert.match(migration, /'type','PROPERTY_BOUGHT'/);
  assert.match(migration, /set phase='TURN_END', pending_choice=null/);
});

test("online API exposes auction RPC adapters without replacing existing Phase 6 actions", () => {
  assert.match(apiSource, /marble_decline_property_for_auction/);
  assert.match(apiSource, /marble_request_auction/);
  assert.match(apiSource, /marble_close_auction_request/);
  assert.match(apiSource, /marble_auction_bid/);
  assert.match(apiSource, /marble_roll_dice/);
  assert.match(apiSource, /marble_end_turn/);
});
