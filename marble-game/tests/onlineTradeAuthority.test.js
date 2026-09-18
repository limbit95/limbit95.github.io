import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const migration = readFileSync(
  new URL("../../supabase/marble/20260918133500_marble_phase7b_trading_authority.sql", import.meta.url),
  "utf8",
);
const apiSource = readFileSync(new URL("../js/onlineGameApi.js", import.meta.url), "utf8");

test("Phase 7B trade RPCs store pendingTrade in authoritative snapshot state", () => {
  assert.match(migration, /add column if not exists pending_trade jsonb/);
  assert.match(migration, /'pendingTrade', v_game\.pending_trade/);
  assert.match(migration, /marble_trade_offer/);
  assert.match(migration, /marble_trade_accept/);
  assert.match(migration, /marble_trade_reject/);
  assert.match(migration, /marble_trade_cancel/);
});

test("trade offer keeps pre-roll timing and current-player authority on the server", () => {
  assert.match(migration, /v_game\.phase <> 'WAITING_ROLL'/);
  assert.match(migration, /v_actor\.seat <> v_game\.current_seat/);
  assert.match(migration, /v_game\.pending_trade is not null/);
  assert.match(migration, /TRADE_ALREADY_OPEN/);
  assert.match(migration, /TRADE_SELF_NOT_ALLOWED/);
});

test("trade settlement revalidates ownership, building state, and balances", () => {
  assert.match(migration, /TRADE_PROPERTY_NOT_OWNED/);
  assert.match(migration, /TRADE_PROPERTY_OWNERSHIP_CHANGED/);
  assert.match(migration, /TRADE_IMPROVED_PROPERTY_NOT_ALLOWED/);
  assert.match(migration, /TRADE_RECIPIENT_INSUFFICIENT_GOLD/);
  assert.match(migration, /update public\.marble_game_players[\s\S]*money = money - v_offered_gold \+ v_requested_gold/);
  assert.match(migration, /update public\.marble_game_properties[\s\S]*set owner_seat = v_actor\.seat/);
});

test("trade RPCs preserve expectedVersion and client action replay contracts", () => {
  assert.match(migration, /marble_action_replay/);
  assert.match(migration, /marble_record_action/);
  assert.match(migration, /VERSION_CONFLICT/);
  assert.match(migration, /p_offer_id::text/);
  assert.match(migration, /TRADE_OFFER_MISMATCH/);
});

test("open trade blocks game progression without redefining marble_roll_dice", () => {
  assert.match(migration, /create trigger marble_guard_open_trade_progress/);
  assert.match(migration, /raise exception 'TRADE_PENDING'/);
  assert.doesNotMatch(migration, /create or replace function public\.marble_roll_dice/);
});

test("trade RPC permissions deny public and anon while allowing authenticated", () => {
  assert.match(migration, /revoke all on function public\.marble_trade_offer[\s\S]*from public, anon/);
  assert.match(migration, /revoke all on function public\.marble_trade_accept[\s\S]*from public, anon/);
  assert.match(migration, /revoke all on function public\.marble_trade_cancel[\s\S]*from public, anon/);
  assert.match(migration, /grant execute on function public\.marble_trade_offer[\s\S]*to authenticated/);
  assert.match(migration, /grant execute on function public\.marble_trade_cancel[\s\S]*to authenticated/);
});

test("online API exposes trade RPC adapters without replacing Phase 7A actions", () => {
  assert.match(apiSource, /marble_trade_offer/);
  assert.match(apiSource, /marble_trade_accept/);
  assert.match(apiSource, /marble_trade_reject/);
  assert.match(apiSource, /marble_trade_cancel/);
  assert.match(apiSource, /marble_auction_bid/);
  assert.match(apiSource, /marble_roll_dice/);
});

test("trade offer defaults offerId to the generated client action id for retry stability", () => {
  assert.match(apiSource, /const actionId = clientActionId \?\? createOnlineActionId\(\)/);
  assert.match(apiSource, /p_offer_id: offerId \?\? actionId/);
});

test("trade cancel is proposer-only and clears the authoritative pending trade", () => {
  assert.match(migration, /v_actor\.room_player_id::text <> v_trade->>'proposerPlayerId'[\s\S]*TRADE_PROPOSER_REQUIRED/);
  assert.match(migration, /'type', 'TRADE_CANCELLED'/);
  assert.match(migration, /marble_record_action\([\s\S]*'trade_cancel'/);
});
