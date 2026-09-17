import test from "node:test";
import assert from "node:assert/strict";

import {
  createPropertyAuction,
  getPropertyAuctionSettlement,
  reducePropertyAuction,
} from "../js/core/auction.js";

function players(overrides = {}) {
  return ["a", "b", "c", "d"].map((id, seat) => ({
    id,
    seat,
    money: 1500,
    bankrupt: false,
    ...(overrides[id] ?? {}),
  }));
}

test("property auction excludes the declining, bankrupt and unaffordable players", () => {
  const auction = createPropertyAuction({
    nodeId: "singapore",
    openingBid: 260,
    declinedByPlayerId: "a",
    players: players({ c: { bankrupt: true }, d: { money: 200 } }),
  });

  assert.equal(auction.type, "PROPERTY_AUCTION");
  assert.equal(auction.status, "OPEN");
  assert.deepEqual(auction.eligiblePlayerIds, ["b"]);
  assert.equal(auction.openingBid, 260);
});

test("auction bid enforces opening price, current high bid and player balance", () => {
  const initial = createPropertyAuction({
    nodeId: "singapore",
    openingBid: 260,
    declinedByPlayerId: "a",
    players: players(),
  });

  assert.throws(
    () => reducePropertyAuction(initial, players(), { playerId: "a", amount: 300 }),
    /not eligible/i,
  );
  assert.throws(
    () => reducePropertyAuction(initial, players(), { playerId: "b", amount: 259 }),
    /at least 260/i,
  );

  const first = reducePropertyAuction(initial, players(), { playerId: "b", amount: 300 });
  assert.equal(first.auction.highestBid, 300);
  assert.equal(first.auction.highestBidderId, "b");
  assert.equal(first.events[0].type, "AUCTION_BID_PLACED");

  assert.throws(
    () => reducePropertyAuction(first.auction, players(), { playerId: "c", amount: 300 }),
    /at least 301/i,
  );
  assert.throws(
    () => reducePropertyAuction(first.auction, players({ c: { money: 320 } }), { playerId: "c", amount: 400 }),
    /cannot afford/i,
  );
});

test("passed players cannot re-enter and the highest bidder cannot pass", () => {
  const initial = createPropertyAuction({
    nodeId: "singapore",
    openingBid: 260,
    declinedByPlayerId: "a",
    players: players(),
  });
  const first = reducePropertyAuction(initial, players(), { playerId: "b", amount: 300 });
  const second = reducePropertyAuction(first.auction, players(), { playerId: "c", pass: true });

  assert.deepEqual(second.auction.passedPlayerIds, ["c"]);
  assert.throws(
    () => reducePropertyAuction(second.auction, players(), { playerId: "c", amount: 350 }),
    /already passed/i,
  );
  assert.throws(
    () => reducePropertyAuction(second.auction, players(), { playerId: "b", pass: true }),
    /highest bidder cannot pass/i,
  );
});

test("auction resolves to the highest bidder after every rival passes", () => {
  const initial = createPropertyAuction({
    nodeId: "singapore",
    openingBid: 260,
    declinedByPlayerId: "a",
    players: players(),
  });
  const first = reducePropertyAuction(initial, players(), { playerId: "b", amount: 300 });
  const second = reducePropertyAuction(first.auction, players(), { playerId: "c", pass: true });
  const final = reducePropertyAuction(second.auction, players(), { playerId: "d", pass: true });

  assert.equal(final.auction.status, "WON");
  assert.equal(final.auction.winnerPlayerId, "b");
  assert.equal(final.auction.winningBid, 300);
  assert.equal(final.events.at(-1).type, "AUCTION_WON");
  assert.deepEqual(getPropertyAuctionSettlement(final.auction), {
    nodeId: "singapore",
    winnerPlayerId: "b",
    amount: 300,
  });
});

test("auction ends unsold when every eligible player passes before a bid", () => {
  const participantState = players({ d: { money: 200 } });
  const initial = createPropertyAuction({
    nodeId: "singapore",
    openingBid: 260,
    declinedByPlayerId: "a",
    players: participantState,
  });
  const first = reducePropertyAuction(initial, participantState, { playerId: "b", pass: true });
  const final = reducePropertyAuction(first.auction, participantState, { playerId: "c", pass: true });

  assert.equal(final.auction.status, "UNSOLD");
  assert.equal(final.events.at(-1).type, "AUCTION_ENDED");
  assert.deepEqual(getPropertyAuctionSettlement(final.auction), {
    nodeId: "singapore",
    winnerPlayerId: null,
    amount: 0,
  });
});

test("auction with no eligible bidders is immediately unsold", () => {
  const participantState = players({ b: { money: 100 }, c: { bankrupt: true }, d: { money: 200 } });
  const auction = createPropertyAuction({
    nodeId: "singapore",
    openingBid: 260,
    declinedByPlayerId: "a",
    players: participantState,
  });

  assert.equal(auction.status, "UNSOLD");
  assert.deepEqual(getPropertyAuctionSettlement(auction), {
    nodeId: "singapore",
    winnerPlayerId: null,
    amount: 0,
  });
});
