import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { createLocalAuctionUiModel } from "../js/localAuctionUi.js";

const appSource = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");
const uiSource = readFileSync(new URL("../js/localAuctionUi.js", import.meta.url), "utf8");

function state(pendingChoice) {
  return {
    players: [
      { id: "p1", name: "A", seat: 0, money: 1500 },
      { id: "p2", name: "B", seat: 1, money: 1200 },
      { id: "p3", name: "C", seat: 2, money: 1100 },
    ],
    board: { nodes: [{ id: "tokyo", label: "도쿄", type: "PROPERTY" }] },
    pendingChoice,
  };
}

function requestChoice(requestedByPlayerIds = []) {
  return {
    type: "AUCTION_REQUEST",
    nodeId: "tokyo",
    openingBid: 240,
    declinedByPlayerId: "p1",
    eligiblePlayerIds: ["p2", "p3"],
    requestedByPlayerIds,
  };
}

function auctionChoice({
  requestedByPlayerIds = ["p2"],
  bidPlayerIds = [],
  passedPlayerIds = [],
  highestBid = 0,
  highestBidderId = null,
} = {}) {
  return {
    type: "PROPERTY_AUCTION",
    nodeId: "tokyo",
    openingBid: 240,
    requestedByPlayerIds,
    auction: {
      type: "PROPERTY_AUCTION",
      nodeId: "tokyo",
      openingBid: 240,
      declinedByPlayerId: "p1",
      eligiblePlayerIds: ["p2", "p3"],
      requestedByPlayerIds,
      bidPlayerIds,
      passedPlayerIds,
      highestBid,
      highestBidderId,
      status: "OPEN",
    },
  };
}

test("local auction request model lets each eligible shared-screen player request and authority close", () => {
  const initial = createLocalAuctionUiModel(state(requestChoice()), "p2");
  assert.equal(initial.stage, "request");
  assert.equal(initial.selectedPlayerId, "p2");
  assert.equal(initial.selectedPlayerName, "B");
  assert.equal(initial.canRequest, true);
  assert.equal(initial.canClose, true);
  assert.equal(initial.requestCount, 0);

  const requested = createLocalAuctionUiModel(state(requestChoice(["p2"])), "p2");
  assert.equal(requested.requested, true);
  assert.equal(requested.canRequest, false);
  assert.equal(requested.requestCount, 1);

  const other = createLocalAuctionUiModel(state(requestChoice(["p2"])), "p3");
  assert.equal(other.selectedPlayerId, "p3");
  assert.equal(other.canRequest, true);
});

test("local auction model preserves first-bid, highest-bidder, pass, and balance restrictions", () => {
  const requester = createLocalAuctionUiModel(state(auctionChoice()), "p2");
  assert.equal(requester.stage, "auction");
  assert.equal(requester.minimumBid, 240);
  assert.equal(requester.canBid, true);
  assert.equal(requester.canPass, false);
  assert.equal(requester.passLabel, "첫 입찰 필요");

  const leader = createLocalAuctionUiModel(state(auctionChoice({
    bidPlayerIds: ["p2"],
    highestBid: 260,
    highestBidderId: "p2",
  })), "p2");
  assert.equal(leader.minimumBid, 261);
  assert.equal(leader.isHighestBidder, true);
  assert.equal(leader.canPass, false);

  const competitor = createLocalAuctionUiModel(state(auctionChoice({
    bidPlayerIds: ["p2"],
    highestBid: 260,
    highestBidderId: "p2",
  })), "p3");
  assert.equal(competitor.canBid, true);
  assert.equal(competitor.canPass, true);

  const passed = createLocalAuctionUiModel(state(auctionChoice({
    bidPlayerIds: ["p2"],
    passedPlayerIds: ["p3"],
    highestBid: 260,
    highestBidderId: "p2",
  })), "p3");
  assert.equal(passed.canBid, false);
  assert.equal(passed.canPass, false);
  assert.equal(passed.passLabel, "패스 완료");
});

test("local playtest wires Phase 7A session methods to a production auction UI caller", () => {
  assert.match(appSource, /setupLocalAuctionUi/);
  assert.match(appSource, /localAuctionUi\?\.render\(state\)/);
  assert.match(appSource, /localAuctionUi = setupLocalAuctionUi\(/);
  assert.match(uiSource, /session\.requestAuction\(selectedPlayerId\)/);
  assert.match(uiSource, /session\.closeAuctionRequest\(\)/);
  assert.match(uiSource, /session\.auctionBid\(selectedPlayerId, amount\)/);
  assert.match(uiSource, /session\.auctionPass\(selectedPlayerId\)/);
});
