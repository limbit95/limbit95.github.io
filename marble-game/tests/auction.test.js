import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateAuctionOpeningBid,
  createPropertyAuction,
  getAuctionSurgeThreshold,
  getPropertyAuctionMinimumBid,
  getPropertyAuctionSettlement,
  isAuctionSurgeBid,
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

test("auction vote flow opening bid is 150 percent with integer rounding", () => {
  assert.equal(calculateAuctionOpeningBid(260), 390);
  assert.equal(calculateAuctionOpeningBid(333), 500);
});

test("auction starts with the selected starter's actual turn and no synthetic bid", () => {
  const auction = createPropertyAuction({
    nodeId: "singapore",
    openingBid: 390,
    declinedByPlayerId: "a",
    starterPlayerId: "b",
    participantPlayerIds: ["b", "c", "d"],
    players: players(),
    turnDeadlineAt: 20_000,
  });

  assert.equal(auction.status, "OPEN");
  assert.deepEqual(auction.participantPlayerIds, ["b", "c", "d"]);
  assert.equal(auction.starterPlayerId, "b");
  assert.equal(auction.highestBid, 0);
  assert.equal(auction.highestBidderId, null);
  assert.deepEqual(auction.bidPlayerIds, []);
  assert.equal(auction.turnPlayerId, "b");
  assert.equal(auction.turnDeadlineAt, 20_000);
  assert.equal(getPropertyAuctionMinimumBid(auction), 390);
});

test("single-participant auction core does not synthesize a bid", () => {
  const auction = createPropertyAuction({
    nodeId: "singapore",
    openingBid: 390,
    declinedByPlayerId: "a",
    starterPlayerId: "b",
    participantPlayerIds: ["b"],
    players: players(),
  });

  assert.equal(auction.status, "OPEN");
  assert.equal(auction.highestBid, 0);
  assert.equal(auction.highestBidderId, null);
  assert.equal(auction.turnPlayerId, "b");
  assert.equal(getPropertyAuctionSettlement(auction), null);
});

test("only the current auction turn player may bid or pass", () => {
  const initial = createPropertyAuction({
    nodeId: "singapore",
    openingBid: 390,
    declinedByPlayerId: "a",
    starterPlayerId: "b",
    participantPlayerIds: ["b", "c", "d"],
    players: players(),
  });

  assert.throws(
    () => reducePropertyAuction(initial, players(), { playerId: "d", amount: 400 }),
    /not this player's auction turn/i,
  );

  const first = reducePropertyAuction(initial, players(), { playerId: "b", amount: 400 });
  assert.equal(first.auction.highestBidderId, "b");
  assert.equal(first.auction.highestBid, 400);
  assert.equal(first.auction.turnPlayerId, "c");
  assert.equal(first.events[0].type, "AUCTION_BID_PLACED");
  assert.equal(first.events[0].surge, false);
});

test("pass removes participants in turn order and all-pass resolves unsold", () => {
  const initial = createPropertyAuction({
    nodeId: "singapore",
    openingBid: 390,
    declinedByPlayerId: "a",
    starterPlayerId: "b",
    participantPlayerIds: ["b", "c", "d"],
    players: players(),
  });

  const first = reducePropertyAuction(initial, players(), { playerId: "b", pass: true });
  assert.deepEqual(first.auction.passedPlayerIds, ["b"]);
  assert.equal(first.auction.turnPlayerId, "c");

  const second = reducePropertyAuction(first.auction, players(), { playerId: "c", pass: true });
  assert.equal(second.auction.turnPlayerId, "d");

  const final = reducePropertyAuction(second.auction, players(), { playerId: "d", pass: true });
  assert.equal(final.auction.status, "UNSOLD");
  assert.equal(final.auction.winnerPlayerId, null);
  assert.equal(final.auction.winningBid, 0);
});

test("players who cannot afford the next minimum bid are auto-passed", () => {
  const participantState = players({ d: { money: 400 } });
  const initial = createPropertyAuction({
    nodeId: "singapore",
    openingBid: 390,
    declinedByPlayerId: "a",
    starterPlayerId: "b",
    participantPlayerIds: ["b", "c", "d"],
    players: participantState,
  });

  const first = reducePropertyAuction(initial, participantState, { playerId: "b", amount: 400 });
  assert.deepEqual(first.auction.passedPlayerIds, ["d"]);
  assert.equal(first.auction.turnPlayerId, "c");
  assert.equal(first.events.some((event) => (
    event.type === "AUCTION_AUTO_PASSED"
    && event.playerId === "d"
    && event.reason === "INSUFFICIENT_GOLD"
  )), true);
});

test("a bid above every remaining opponent's gold settles at the submitted final amount", () => {
  const participantState = players({
    b: { money: 1200 },
    c: { money: 500 },
  });
  const initial = createPropertyAuction({
    nodeId: "singapore",
    openingBid: 390,
    declinedByPlayerId: "a",
    starterPlayerId: "c",
    participantPlayerIds: ["b", "c"],
    players: participantState,
  });

  const first = reducePropertyAuction(initial, participantState, { playerId: "c", amount: 400 });
  assert.equal(first.auction.highestBid, 400);
  assert.equal(first.auction.turnPlayerId, "b");

  const final = reducePropertyAuction(first.auction, participantState, { playerId: "b", amount: 600 });
  assert.equal(final.auction.status, "WON");
  assert.equal(final.auction.winnerPlayerId, "b");
  assert.equal(final.auction.winningBid, 600);
  assert.deepEqual(getPropertyAuctionSettlement(final.auction), {
    nodeId: "singapore",
    winnerPlayerId: "b",
    amount: 600,
  });

  const bid = final.events.find((event) => event.type === "AUCTION_BID_PLACED");
  assert.deepEqual(
    {
      amount: bid.amount,
      previousAmount: bid.previousAmount,
      increase: bid.increase,
      surge: bid.surge,
    },
    { amount: 600, previousAmount: 400, increase: 200, surge: true },
  );

  const decisive = final.events.find((event) => event.type === "AUCTION_DECISIVE_BID");
  assert.deepEqual(decisive, {
    type: "AUCTION_DECISIVE_BID",
    playerId: "b",
    nodeId: "singapore",
    amount: 600,
    previousAmount: 400,
    increase: 200,
    eliminatedPlayerIds: ["c"],
  });
});

test("large-bid threshold requires both meaningful absolute and relative movement", () => {
  assert.equal(getAuctionSurgeThreshold(360), 108);
  assert.equal(getAuctionSurgeThreshold(1000), 300);
  assert.equal(isAuctionSurgeBid(360, 467), false);
  assert.equal(isAuctionSurgeBid(360, 468), true);
  assert.equal(isAuctionSurgeBid(1000, 1200), false);
  assert.equal(isAuctionSurgeBid(1000, 1300), true);
});

test("timeout pass uses the same irreversible pass rule", () => {
  const initial = createPropertyAuction({
    nodeId: "singapore",
    openingBid: 390,
    declinedByPlayerId: "a",
    starterPlayerId: "c",
    participantPlayerIds: ["b", "c"],
    players: players(),
  });

  const result = reducePropertyAuction(initial, players(), {
    playerId: "c",
    pass: true,
    timeout: true,
  });

  assert.equal(result.auction.status, "OPEN");
  assert.equal(result.auction.turnPlayerId, "b");
  assert.deepEqual(result.auction.passedPlayerIds, ["c"]);
  assert.equal(result.events[0].type, "AUCTION_AUTO_PASSED");
  assert.equal(result.events[0].reason, "TIMEOUT");
});
