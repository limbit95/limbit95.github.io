import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const originalWindow = globalThis.window;
globalThis.window = globalThis.window ?? {};
const { createOnlineAuctionUiModel } = await import("../js/onlineAuctionUi.js");
const {
  createOnlineClassicSession,
  getActiveOnlineClassicSession,
} = await import("../js/onlineSession.js?v=20260918-r3");
globalThis.window = originalWindow;

const uiSource = readFileSync(new URL("../js/onlineAuctionUi.js", import.meta.url), "utf8");
const sessionSource = readFileSync(new URL("../js/onlineSession.js", import.meta.url), "utf8");
const controller2dSource = readFileSync(new URL("../js/onlineGameController2d.js", import.meta.url), "utf8");
const auctionV2Sql = readFileSync(
  new URL("../../supabase/marble/20260918220000_marble_auction_v2.sql", import.meta.url),
  "utf8",
);
const cssSource = readFileSync(new URL("../css/auction-ui.css", import.meta.url), "utf8");

function state(pendingChoice, overrides = {}) {
  return {
    currentPlayerIndex: 0,
    players: [
      { id: "p1", name: "A", seat: 0, money: 1500 },
      { id: "p2", name: "B", seat: 1, money: 1200 },
      { id: "p3", name: "C", seat: 2, money: 1100 },
    ],
    board: { nodes: [{ id: "tokyo", label: "도쿄", type: "PROPERTY" }] },
    pendingChoice,
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
    deadlineAt: "2026-09-18T12:00:10Z",
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
    deadlineAt: "2026-09-18T12:00:20Z",
  };
}

function auctionChoice({
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
    participantPlayerIds: ["p2", "p3"],
    auction: {
      type: "PROPERTY_AUCTION",
      nodeId: "tokyo",
      openingBid: 360,
      declinedByPlayerId: "p1",
      eligiblePlayerIds: ["p2", "p3"],
      participantPlayerIds: ["p2", "p3"],
      requesterPlayerId: "p2",
      requestedByPlayerIds: ["p2"],
      bidPlayerIds: ["p2"],
      passedPlayerIds,
      highestBid,
      highestBidderId,
      turnPlayerId,
      turnDeadlineAt: "2026-09-18T12:00:30Z",
      status: "OPEN",
    },
  };
}

test("request UI excludes the declining player and shows the premium opening bid", () => {
  const eligible = createOnlineAuctionUiModel(state(requestChoice()), "p2");
  assert.equal(eligible.stage, "request");
  assert.equal(eligible.basePrice, 240);
  assert.equal(eligible.openingBid, 360);
  assert.equal(eligible.canRequest, true);

  const decliner = createOnlineAuctionUiModel(state(requestChoice()), "p1");
  assert.equal(decliner.eligible, false);
  assert.equal(decliner.canRequest, false);
});

test("recruitment UI supports join and withdrawal while locking requester withdrawal", () => {
  const requester = createOnlineAuctionUiModel(state(recruitmentChoice(["p2", "p3"])), "p2");
  assert.equal(requester.stage, "recruitment");
  assert.equal(requester.requester, true);
  assert.equal(requester.canWithdraw, false);

  const participant = createOnlineAuctionUiModel(state(recruitmentChoice(["p2", "p3"])), "p3");
  assert.equal(participant.participant, true);
  assert.equal(participant.canWithdraw, true);

  const candidate = createOnlineAuctionUiModel(state(recruitmentChoice(["p2"])), "p3");
  assert.equal(candidate.canJoin, true);
});

test("competitive UI only enables bid and pass for the server-selected turn", () => {
  const requester = createOnlineAuctionUiModel(state(auctionChoice()), "p2");
  assert.equal(requester.highestBidderId, "p2");
  assert.equal(requester.minimumBid, 361);
  assert.equal(requester.canBid, false);
  assert.equal(requester.canPass, false);

  const bidder = createOnlineAuctionUiModel(state(auctionChoice()), "p3");
  assert.equal(bidder.isTurn, true);
  assert.equal(bidder.canBid, true);
  assert.equal(bidder.canPass, true);
  assert.equal(bidder.passLabel, "포기");
});

test("Auction v2 UI owns timers, recruitment controls, and auto-purchase result", () => {
  assert.match(uiSource, /session\.advanceAuctionDeadline\(\)/);
  assert.match(uiSource, /session\.getServerNowMs\?\.\(\)/);
  assert.match(uiSource, /session\.joinAuction\(\)/);
  assert.match(uiSource, /session\.withdrawAuction\(\)/);
  assert.match(uiSource, /session\.auctionPass\(\)/);
  assert.match(uiSource, /매입에 성공하셨습니다/);
  assert.match(uiSource, /event\.playerId !== viewerPlayerId/);
  assert.match(cssSource, /data-auction-stage="request"/);
  assert.match(cssSource, /data-auction-stage="recruitment"/);
  assert.match(cssSource, /data-auction-stage="auction"/);
  assert.match(cssSource, /position: fixed/);
  assert.match(cssSource, /top: 50%/);
  assert.match(cssSource, /transform: translate\(-50%, -50%\)/);
  assert.match(cssSource, /max-height: calc\(100dvh - 32px\)/);
  assert.match(cssSource, /overflow-y: auto/);
  assert.match(cssSource, /background:[\s\S]*#172331/);
  assert.match(cssSource, /border-radius: 22px/);
  assert.match(cssSource, /grid-template-areas:[\s\S]*"badge spacer timer"[\s\S]*"title title title"/);
  assert.match(cssSource, /content: "경매 안내"/);
  assert.match(cssSource, /data-auction-stage="auction"[\s\S]*--auction-accent: #ffe29a/);
  assert.match(uiSource, /const modalHost = documentObject\.body \?\? dock/);
  assert.match(uiSource, /modalHost\.prepend\(panel\)/);
});

test("legacy controls and end-turn RPC cannot bypass any Auction v2 stage", () => {
  assert.match(
    controller2dSource,
    /\["AUCTION_REQUEST", "AUCTION_RECRUITMENT", "PROPERTY_AUCTION"\]\.includes\(state\.pendingChoice\?\.type\)/,
  );
  assert.match(
    auctionV2Sql,
    /in \('AUCTION_REQUEST','AUCTION_RECRUITMENT','PROPERTY_AUCTION'\)[\s\S]*?raise exception 'END_TURN_NOT_ALLOWED'/,
  );
});

function snapshot(version, pendingChoice = requestChoice()) {
  return {
    room: { id: "room-1", roomCode: "ABC123", status: "playing", currentGameId: "game-1" },
    game: {
      id: "game-1",
      status: "playing",
      phase: "WAITING_CHOICE",
      turn: 3,
      currentSeat: 0,
      version,
      pendingChoice,
      lastRoll: null,
      lastEvents: [],
      winnerPlayerId: null,
      rulesetVersion: 1,
    },
    players: [
      { id: "p1", userId: "u1", name: "A", seat: 0, positionNodeId: "tokyo", money: 1500, bankrupt: false, skipTurns: 0 },
      { id: "p2", userId: "u2", name: "B", seat: 1, positionNodeId: "start", money: 1200, bankrupt: false, skipTurns: 0 },
      { id: "p3", userId: "u3", name: "C", seat: 2, positionNodeId: "start", money: 1100, bankrupt: false, skipTurns: 0 },
    ],
    properties: { tokyo: { ownerId: null, ownerSeat: null, buildingLevel: 0 } },
    viewerUserId: "u2",
    viewerPlayerId: "p2",
  };
}

function installFakeBrowser() {
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  globalThis.window = {
    setTimeout: () => 1,
    clearTimeout() {},
    addEventListener() {},
    removeEventListener() {},
  };
  globalThis.document = {
    visibilityState: "visible",
    addEventListener() {},
    removeEventListener() {},
  };
  return () => {
    globalThis.window = previousWindow;
    globalThis.document = previousDocument;
  };
}

test("active online session notifies Auction v2 UI on authoritative recruitment state", async () => {
  const restore = installFakeBrowser();
  const observedVersions = [];
  try {
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: snapshot(7),
      api: {
        createActionId: () => "11111111-1111-4111-8111-111111111111",
        subscribeGame: () => () => {},
        getSnapshot: async () => snapshot(8, recruitmentChoice()),
        requestAuction: async () => snapshot(8, recruitmentChoice()),
      },
    });

    assert.equal(getActiveOnlineClassicSession("room-1"), session);
    const unsubscribe = session.subscribeState((nextState) => observedVersions.push(nextState.version));
    await session.requestAuction();
    assert.deepEqual(observedVersions, [8]);
    assert.equal(session.getState().pendingChoice.type, "AUCTION_RECRUITMENT");

    unsubscribe();
    session.dispose();
    assert.equal(getActiveOnlineClassicSession("room-1"), null);
  } finally {
    restore();
  }
});

test("session source maps recruitment participants and exposes Auction v2 actions", () => {
  assert.match(sessionSource, /pendingChoice\.type === "AUCTION_RECRUITMENT"/);
  assert.match(sessionSource, /participantPlayerIds/);
  assert.match(sessionSource, /joinAuction\(\)/);
  assert.match(sessionSource, /withdrawAuction\(\)/);
  assert.match(sessionSource, /advanceAuctionDeadline\(\)/);
});
