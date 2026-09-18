import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { createLocalAuctionUiModel } from "../js/localAuctionUi.js";

const appSource = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");
const uiSource = readFileSync(new URL("../js/localAuctionUi.js", import.meta.url), "utf8");

function state(pendingChoice, overrides = {}) {
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
    ...overrides,
  };
}

function requestChoice() {
  return {
    type: "AUCTION_REQUEST",
    nodeId: "tokyo",
    basePrice: 240,
    openingBid: 360,
    declinedByPlayerId: "p1",
    eligiblePlayerIds: ["p2", "p3"],
    requestedByPlayerIds: [],
    deadlineAt: 11_000,
  };
}

function recruitmentChoice(participantPlayerIds = ["p2"]) {
  return {
    type: "AUCTION_RECRUITMENT",
    nodeId: "tokyo",
    basePrice: 240,
    openingBid: 360,
    declinedByPlayerId: "p1",
    eligiblePlayerIds: ["p2", "p3"],
    requesterPlayerId: "p2",
    requestedByPlayerIds: ["p2"],
    participantPlayerIds,
    deadlineAt: 12_000,
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
    requesterPlayerId: "p2",
    participantPlayerIds,
    auction: {
      type: "PROPERTY_AUCTION",
      nodeId: "tokyo",
      openingBid: 360,
      declinedByPlayerId: "p1",
      eligiblePlayerIds: ["p2", "p3"],
      participantPlayerIds,
      requesterPlayerId: "p2",
      requestedByPlayerIds: ["p2"],
      bidPlayerIds: ["p2"],
      passedPlayerIds,
      highestBid,
      highestBidderId,
      turnPlayerId,
      turnDeadlineAt: 22_000,
      status: "OPEN",
    },
  };
}

test("local request model excludes the declining player and exposes 150 percent opening bid", () => {
  const eligible = createLocalAuctionUiModel(state(requestChoice()), "p2");
  assert.equal(eligible.stage, "request");
  assert.equal(eligible.openingBid, 360);
  assert.equal(eligible.canRequest, true);

  const decliner = createLocalAuctionUiModel(state(requestChoice()), "p1");
  assert.notEqual(decliner.selectedPlayerId, "p1");
  assert.equal(decliner.playerOptions.some((option) => option.id === "p1"), false);
});

test("local recruitment model preserves requester and allows normal participant withdrawal", () => {
  const requester = createLocalAuctionUiModel(state(recruitmentChoice(["p2", "p3"])), "p2");
  assert.equal(requester.stage, "recruitment");
  assert.equal(requester.requester, true);
  assert.equal(requester.canWithdraw, false);
  assert.equal(requester.participantCount, 2);

  const participant = createLocalAuctionUiModel(state(recruitmentChoice(["p2", "p3"])), "p3");
  assert.equal(participant.participant, true);
  assert.equal(participant.canWithdraw, true);
  assert.equal(participant.canJoin, false);
});

test("competitive model only enables bid and pass for the current participant", () => {
  const requester = createLocalAuctionUiModel(state(auctionChoice()), "p2");
  assert.equal(requester.highestBid, 360);
  assert.equal(requester.minimumBid, 361);
  assert.equal(requester.canBid, false);
  assert.equal(requester.canPass, false);

  const current = createLocalAuctionUiModel(state(auctionChoice()), "p3");
  assert.equal(current.isTurn, true);
  assert.equal(current.canBid, true);
  assert.equal(current.canPass, true);
  assert.equal(current.passLabel, "포기");

  const passed = createLocalAuctionUiModel(state(auctionChoice({
    passedPlayerIds: ["p3"],
    turnPlayerId: null,
  })), "p3");
  assert.equal(passed.passed, true);
  assert.equal(passed.canBid, false);
  assert.equal(passed.canPass, false);
  assert.equal(passed.passLabel, "포기 완료");
});

test("local auction UI wires recruitment, bidding, and authoritative deadline advancement", () => {
  assert.match(appSource, /setupLocalAuctionUi/);
  assert.match(uiSource, /session\.requestAuction\(selectedPlayerId\)/);
  assert.match(uiSource, /session\.joinAuction\(selectedPlayerId\)/);
  assert.match(uiSource, /session\.withdrawAuction\(selectedPlayerId\)/);
  assert.match(uiSource, /session\.auctionBid\(selectedPlayerId, amount\)/);
  assert.match(uiSource, /session\.auctionPass\(selectedPlayerId\)/);
  assert.match(uiSource, /session\.advanceAuctionDeadline\(\)/);
  assert.match(uiSource, /매입에 성공하셨습니다/);
});
