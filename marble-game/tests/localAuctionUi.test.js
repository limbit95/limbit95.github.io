import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { createLocalAuctionUiModel } from "../js/localAuctionUi.js";

const appSource = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");
const uiSource = readFileSync(new URL("../js/localAuctionUi.js", import.meta.url), "utf8");
const cssSource = readFileSync(new URL("../css/auction-ui.css", import.meta.url), "utf8");

function state(pendingChoice) {
  return {
    version: 7,
    players: [
      { id: "p1", name: "A", seat: 0, money: 1500 },
      { id: "p2", name: "B", seat: 1, money: 1200 },
      { id: "p3", name: "C", seat: 2, money: 1100 },
    ],
    board: { nodes: [{ id: "tokyo", label: "도쿄", type: "PROPERTY" }] },
    pendingChoice,
    lastEvents: [],
  };
}

function voteChoice(participantPlayerIds = [], passedPlayerIds = []) {
  return {
    type: "AUCTION_VOTE",
    nodeId: "tokyo",
    basePrice: 240,
    openingBid: 360,
    declinedByPlayerId: "p1",
    eligiblePlayerIds: ["p2", "p3"],
    participantPlayerIds,
    passedPlayerIds,
    deadlineAt: 16_000,
  };
}

function auctionChoice({
  participantPlayerIds = ["p2", "p3"],
  passedPlayerIds = [],
  highestBid = 360,
  highestBidderId = "p2",
  turnPlayerId = "p3",
} = {}) {
  return {
    type: "PROPERTY_AUCTION",
    nodeId: "tokyo",
    openingBid: 360,
    openingBidderPlayerId: participantPlayerIds[0],
    participantPlayerIds,
    auction: {
      type: "PROPERTY_AUCTION",
      nodeId: "tokyo",
      openingBid: 360,
      declinedByPlayerId: "p1",
      eligiblePlayerIds: ["p2", "p3"],
      participantPlayerIds,
      openingBidderPlayerId: participantPlayerIds[0],
      bidPlayerIds: [participantPlayerIds[0]],
      passedPlayerIds,
      highestBid,
      highestBidderId,
      turnPlayerId,
      turnDeadlineAt: 22_000,
      status: "OPEN",
    },
  };
}

test("local vote model exposes one-time join/pass actions", () => {
  const undecided = createLocalAuctionUiModel(state(voteChoice()), "p2");
  assert.equal(undecided.stage, "vote");
  assert.equal(undecided.openingBid, 360);
  assert.equal(undecided.canJoin, true);
  assert.equal(undecided.canVotePass, true);
  assert.equal(undecided.decision, null);

  const joined = createLocalAuctionUiModel(state(voteChoice(["p2"])), "p2");
  assert.equal(joined.decision, "JOIN");
  assert.equal(joined.canJoin, false);
  assert.equal(joined.canVotePass, false);

  const passed = createLocalAuctionUiModel(state(voteChoice([], ["p2"])), "p2");
  assert.equal(passed.decision, "PASS");
  assert.equal(passed.canJoin, false);
  assert.equal(passed.canVotePass, false);
});

test("local participant cards preserve join order and first-bid badge", () => {
  const model = createLocalAuctionUiModel(state(voteChoice(["p3", "p2"])), "p2");
  assert.deepEqual(model.participantCards.map((card) => ({
    id: card.id,
    order: card.order,
    openingBidder: card.openingBidder,
  })), [
    { id: "p3", order: 1, openingBidder: true },
    { id: "p2", order: 2, openingBidder: false },
  ]);
  assert.equal(model.participantCount, 2);
  assert.equal(model.waitingCount, 0);
});

test("competitive model only enables bid and pass for current participant", () => {
  const first = createLocalAuctionUiModel(state(auctionChoice()), "p2");
  assert.equal(first.highestBid, 360);
  assert.equal(first.minimumBid, 361);
  assert.equal(first.canBid, false);
  assert.equal(first.canPass, false);

  const current = createLocalAuctionUiModel(state(auctionChoice()), "p3");
  assert.equal(current.isTurn, true);
  assert.equal(current.canBid, true);
  assert.equal(current.canPass, true);
});

test("local Auction UI wires vote, participant cards, bidding, and deadline advancement", () => {
  assert.match(appSource, /setupLocalAuctionUi/);
  assert.match(uiSource, /session\.joinAuction\(selectedPlayerId\)/);
  assert.match(uiSource, /session\.passAuctionVote\(selectedPlayerId\)/);
  assert.doesNotMatch(uiSource, /session\.withdrawAuction\(/);
  assert.doesNotMatch(uiSource, /session\.requestAuction\(/);
  assert.match(uiSource, /첫 입찰/);
  assert.match(uiSource, /입찰 차례/);
  assert.match(uiSource, /AUCTION_BID_PLACED/);
  assert.match(uiSource, /playAuctionBidSound\(\)/);
  assert.match(uiSource, /prepareAuctionBidSound/);
  assert.match(uiSource, /auctionBidSound\.js\?v=20260922-r2/);
  assert.doesNotMatch(uiSource, /showAuctionUnsoldResult/);
  assert.doesNotMatch(uiSource, /auction-result-modal/);
  assert.match(uiSource, /bidEventPlayer\.textContent = playerName\(player\)/);
  assert.match(uiSource, /BID_EVENT_HOLD_MS = 2200/);
  assert.match(uiSource, /renderHighestBid\(model\.highestBid\)/);
  assert.match(uiSource, /elements\.status\.hidden = model\.stage === "auction"/);
  assert.match(uiSource, /elements\.detail\.hidden = model\.stage === "auction"/);
  assert.match(cssSource, /auctionBidEvent/);
  assert.match(cssSource, /auctionBidValueCount/);
  assert.match(uiSource, /15초/);
  assert.match(uiSource, /session\.auctionBid\(selectedPlayerId, amount\)/);
  assert.match(uiSource, /session\.auctionPass\(selectedPlayerId\)/);
  assert.match(uiSource, /session\.advanceAuctionDeadline\(\)/);
  assert.match(uiSource, /const modalHost = documentObject\.body \?\? dock/);
  assert.match(cssSource, /data-auction-stage="vote"/);
  assert.match(cssSource, /auction-action-panel__participants/);
});
