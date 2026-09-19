import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const v2Migration = readFileSync(
  new URL("../../supabase/marble/20260918220000_marble_auction_v2.sql", import.meta.url),
  "utf8",
);
const voteMigration = readFileSync(
  new URL("../../supabase/marble/20260919122159_marble_auction_vote_flow.sql", import.meta.url),
  "utf8",
);
const apiSource = readFileSync(new URL("../js/onlineGameApi.js", import.meta.url), "utf8");

test("Auction vote authority opens a single 15-second vote at 150 percent", () => {
  assert.match(voteMigration, /round\(v_base_price::numeric \* 1\.5\)::integer/);
  assert.match(voteMigration, /'type','AUCTION_VOTE'/);
  assert.match(voteMigration, /interval '15 seconds'/);
  assert.match(voteMigration, /'participantPlayerIds','\[\]'::jsonb/);
  assert.match(voteMigration, /'passedPlayerIds','\[\]'::jsonb/);
});

test("vote decisions are irreversible and timeout means pass", () => {
  assert.match(voteMigration, /marble_pass_auction_vote/);
  assert.match(voteMigration, /AUCTION_VOTE_ALREADY_FINAL/);
  assert.match(voteMigration, /AUCTION_VOTE_IS_FINAL/);
  assert.match(voteMigration, /AUCTION_VOTE_AUTO_PASSED/);
  assert.match(voteMigration, /reason','TIMEOUT'/);
});

test("all responded immediately resolves without waiting for the vote deadline", () => {
  assert.match(
    voteMigration,
    /jsonb_array_length\(v_participants\) \+ jsonb_array_length\(v_passed\)[\s\S]*?marble_auction_v3_finalize_vote/,
  );
  assert.match(voteMigration, /'ALL_RESPONDED'/);
});

test("first committed participant becomes opening bidder and join order becomes bid order", () => {
  assert.match(voteMigration, /v_opening_bidder := v_participants->>0/);
  assert.match(voteMigration, /'openingBidderPlayerId', v_opening_bidder/);
  assert.match(voteMigration, /'participantPlayerIds', v_participants/);
  assert.match(voteMigration, /'highestBidderId', v_opening_bidder/);
  assert.match(voteMigration, /marble_auction_v2_next_turn/);
});

test("simultaneous vote actions are serialized by the game row and stale client versions are absorbed", () => {
  assert.match(voteMigration, /from public\.marble_games[\s\S]*for update/);
  assert.match(voteMigration, /if v_game\.version < p_expected_version then raise exception 'VERSION_CONFLICT'/);
  assert.match(voteMigration, /v_participants := v_participants \|\| jsonb_build_array\(v_player_id\)/);
});

test("sole participant settlement reuses normal purchase events", () => {
  assert.match(voteMigration, /AUCTION_AUTO_PURCHASED/);
  assert.match(v2Migration, /'type','PROPERTY_BOUGHT'/);
  assert.match(v2Migration, /'reason','AUCTION'/);
  assert.match(v2Migration, /set money = money - v_amount/);
  assert.match(v2Migration, /set owner_seat = v_winner\.seat, building_level = 0/);
});

test("legacy request and recruitment states are normalized into the vote window", () => {
  assert.match(voteMigration, /pending_choice->>'type' in \('AUCTION_REQUEST','AUCTION_RECRUITMENT'\)/);
  assert.match(voteMigration, /'type','AUCTION_VOTE'/);
  assert.match(voteMigration, /deadlineAt',now\(\)\+interval '15 seconds'/);
  assert.match(voteMigration, /participantPlayerIds/);
});

test("Auction vote RPCs keep authentication, replay, fixed search path, and grants", () => {
  assert.match(voteMigration, /private\.marble_action_replay/);
  assert.match(voteMigration, /private\.marble_record_action/);
  assert.match(voteMigration, /auth\.uid\(\)/);
  assert.match(voteMigration, /set search_path = public, private, pg_temp/);
  assert.match(voteMigration, /revoke all on function public\.marble_pass_auction_vote/);
  assert.match(voteMigration, /grant execute on function public\.marble_pass_auction_vote.*authenticated/);
});

test("end turn guard includes Auction vote and competitive auction", () => {
  assert.match(
    voteMigration,
    /in \('AUCTION_REQUEST','AUCTION_RECRUITMENT','AUCTION_VOTE','PROPERTY_AUCTION'\)/,
  );
});

test("online API exposes join/pass/deadline/bid adapters while stable game actions remain", () => {
  assert.match(apiSource, /marble_decline_property_for_auction/);
  assert.match(apiSource, /marble_join_auction/);
  assert.match(apiSource, /marble_pass_auction_vote/);
  assert.match(apiSource, /marble_advance_auction_deadline/);
  assert.match(apiSource, /marble_auction_bid/);
  assert.match(apiSource, /marble_roll_dice/);
  assert.match(apiSource, /marble_end_turn/);
});
