import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const migration = readFileSync(
  new URL("../../supabase/marble/20260918220000_marble_auction_v2.sql", import.meta.url),
  "utf8",
);
const legacyCompatMigration = readFileSync(
  new URL(
    "../../supabase/marble/20260918224500_marble_auction_v2_legacy_request_compat.sql",
    import.meta.url,
  ),
  "utf8",
);
const apiSource = readFileSync(new URL("../js/onlineGameApi.js", import.meta.url), "utf8");

test("Auction v2 authority exposes server time and defines the 150 percent request and recruitment lifecycle", () => {
  assert.match(migration, /'serverNow', now\(\)/);
  assert.match(migration, /round\(v_base_price::numeric \* 1\.5\)::integer/);
  assert.match(migration, /'type','AUCTION_REQUEST'/);
  assert.match(migration, /'type','AUCTION_RECRUITMENT'/);
  assert.match(migration, /interval '10 seconds'/);
  assert.match(migration, /marble_join_auction/);
  assert.match(migration, /marble_withdraw_auction/);
  assert.match(migration, /AUCTION_REQUESTER_WITHDRAW_NOT_ALLOWED/);
});

test("concurrent request losers are absorbed into recruitment in server commit order", () => {
  assert.match(migration, /v_type='AUCTION_RECRUITMENT'/);
  assert.match(migration, /CONCURRENT_REQUEST/);
  assert.match(migration, /v_participants := v_participants \|\| jsonb_build_array\(v_player_id\)/);
  assert.match(migration, /v_game\.version < p_expected_version/);
});

test("competitive auction is ordered, timed, and auto-removes unaffordable participants", () => {
  assert.match(migration, /marble_auction_v2_next_turn/);
  assert.match(migration, /participantPlayerIds/);
  assert.match(migration, /turnPlayerId/);
  assert.match(migration, /turnDeadlineAt/);
  assert.match(migration, /AUCTION_AUTO_PASSED/);
  assert.match(migration, /INSUFFICIENT_GOLD/);
  assert.match(migration, /reason','TIMEOUT/);
  assert.match(migration, /v_minimum := case when v_highest>0 then v_highest\+1/);
});

test("requester auto-bid and sole participant settlement reuse normal purchase events", () => {
  assert.match(migration, /'bidPlayerIds',jsonb_build_array\(v_requester\)/);
  assert.match(migration, /'highestBid',v_opening/);
  assert.match(migration, /'highestBidderId',v_requester/);
  assert.match(migration, /AUCTION_AUTO_PURCHASED/);
  assert.match(migration, /'type','PROPERTY_BOUGHT'/);
  assert.match(migration, /'reason','AUCTION'/);
  assert.match(migration, /set money = money - v_amount/);
  assert.match(migration, /set owner_seat = v_winner\.seat, building_level = 0/);
});

test("Auction v2 RPCs keep replay/version validation and protected execution grants", () => {
  assert.match(migration, /private\.marble_action_replay/);
  assert.match(migration, /private\.marble_record_action/);
  assert.match(migration, /VERSION_CONFLICT/);
  assert.match(migration, /for update/);
  assert.match(migration, /revoke all on function public\.marble_join_auction/);
  assert.match(migration, /grant execute on function public\.marble_join_auction.*authenticated/);
  assert.match(migration, /revoke all on function public\.marble_advance_auction_deadline/);
});

test("online API exposes Auction v2 RPC adapters without replacing stable game actions", () => {
  assert.match(apiSource, /marble_decline_property_for_auction/);
  assert.match(apiSource, /marble_request_auction/);
  assert.match(apiSource, /marble_join_auction/);
  assert.match(apiSource, /marble_withdraw_auction/);
  assert.match(apiSource, /marble_advance_auction_deadline/);
  assert.match(apiSource, /marble_auction_bid/);
  assert.match(apiSource, /marble_roll_dice/);
  assert.match(apiSource, /marble_end_turn/);
});


test("Auction v2 legacy request compatibility upgrades only pre-v2 unrequested windows", () => {
  assert.match(legacyCompatMigration, /pending_choice->>'type' = 'AUCTION_REQUEST'/);
  assert.match(legacyCompatMigration, /not \(pending_choice \? 'basePrice'\)/);
  assert.match(legacyCompatMigration, /not \(pending_choice \? 'deadlineAt'\)/);
  assert.match(legacyCompatMigration, /requestedByPlayerIds/);
  assert.match(legacyCompatMigration, /jsonb_array_length/);
  assert.match(legacyCompatMigration, /round\(v_base_price::numeric \* 1\.5\)::integer/);
  assert.match(legacyCompatMigration, /interval '10 seconds'/);
  assert.match(legacyCompatMigration, /gp\.money >= v_opening_bid/);
  assert.match(legacyCompatMigration, /version = version \+ 1/);
});
