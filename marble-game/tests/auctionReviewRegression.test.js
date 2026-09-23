import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const introSource = readFileSync(
  path.join(repositoryRoot, "marble-game", "js", "auctionIntroUi.js"),
  "utf8",
);
const migrationSource = readFileSync(
  path.join(
    repositoryRoot,
    "supabase",
    "marble",
    "20260923120000_marble_auction_all_pass_review_fix.sql",
  ),
  "utf8",
);

test("Marble auction selector reuses expiring profile avatar URLs and centers the selected item", () => {
  assert.match(introSource, /getSignedAvatarUrl/);
  assert.doesNotMatch(introSource, /avatarUrlCache/);
  assert.match(introSource, /const offset = Math\.max\(0, targetIndex \* step\);/);
  assert.doesNotMatch(
    introSource,
    /targetIndex \* step\) - \(\(viewportWidth - itemWidth\) \/ 2\)/,
  );
});

test("Marble no-bid all-pass state closes in both manual and deadline server paths", () => {
  assert.match(
    migrationSource,
    /CREATE OR REPLACE FUNCTION public\.marble_auction_bid[\s\S]*v_remaining = 0 and v_highest_bidder is null[\s\S]*phase='TURN_END'[\s\S]*pending_choice=null/,
  );
  assert.match(
    migrationSource,
    /CREATE OR REPLACE FUNCTION public\.marble_advance_auction_deadline[\s\S]*v_remaining=0 and v_auction->>'highestBidderId' is null[\s\S]*phase='TURN_END'[\s\S]*pending_choice=null/,
  );
  assert.match(
    migrationSource,
    /grant execute on function public\.marble_auction_bid\(uuid,bigint,uuid,integer,boolean\)[\s\S]*to authenticated, service_role/,
  );
  assert.match(
    migrationSource,
    /grant execute on function public\.marble_advance_auction_deadline\(uuid,bigint,uuid\)[\s\S]*to authenticated, service_role/,
  );
});
