import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const originalWindow = globalThis.window;
globalThis.window = globalThis.window ?? {};
const { createOnlineAuctionUiModel } = await import("../js/onlineAuctionUi.js");
const {
  createOnlineClassicSession,
  getActiveOnlineClassicSession,
} = await import("../js/onlineSession.js?v=20260919-r13");
globalThis.window = originalWindow;

const uiSource = readFileSync(new URL("../js/onlineAuctionUi.js", import.meta.url), "utf8");
const sessionSource = readFileSync(new URL("../js/onlineSession.js", import.meta.url), "utf8");
const controller2dSource = readFileSync(new URL("../js/onlineGameController2d.js", import.meta.url), "utf8");
const auctionVoteSql = readFileSync(
  new URL("../../supabase/marble/20260919122159_marble_auction_vote_flow.sql", import.meta.url),
  "utf8",
);
const cssSource = readFileSync(new URL("../css/auction-ui.css", import.meta.url), "utf8");
const bidTimingSql = readFileSync(
  new URL("../../supabase/marble/20260921143453_marble_auction_bid_turn_15s.sql", import.meta.url),
  "utf8",
);
const decisiveBidSql = readFileSync(
  new URL("../../supabase/marble/20260922041409_marble_auction_decisive_bid_feedback.sql", import.meta.url),
  "utf8",
);
const auctionStartSql = readFileSync(
  new URL("../../supabase/marble/20260922114345_marble_auction_start_roulette.sql", import.meta.url),
  "utf8",
);
const auctionIntroPacingSql = readFileSync(
  new URL("../../supabase/marble/20260922124800_marble_auction_intro_pacing.sql", import.meta.url),
  "utf8",
);

function state(pendingChoice) {
  return {
    currentPlayerIndex: 0,
    players: [
      { id: "p1", name: "A", seat: 0, money: 1500 },
      { id: "p2", name: "B", seat: 1, money: 1200 },
      { id: "p3", name: "C", seat: 2, money: 1100 },
    ],
    board: { nodes: [{ id: "tokyo", label: "도쿄", type: "PROPERTY" }] },
    pendingChoice,
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
    deadlineAt: "2026-09-19T12:00:15Z",
  };
}

function auctionChoice() {
  return {
    type: "PROPERTY_AUCTION",
    nodeId: "tokyo",
    openingBid: 360,
    openingBidderPlayerId: "p2",
    participantPlayerIds: ["p2", "p3"],
    auction: {
      type: "PROPERTY_AUCTION",
      nodeId: "tokyo",
      openingBid: 360,
      declinedByPlayerId: "p1",
      eligiblePlayerIds: ["p2", "p3"],
      participantPlayerIds: ["p2", "p3"],
      openingBidderPlayerId: "p2",
      bidPlayerIds: ["p2"],
      passedPlayerIds: [],
      highestBid: 360,
      highestBidderId: "p2",
      turnPlayerId: "p3",
      turnDeadlineAt: "2026-09-19T12:00:25Z",
      status: "OPEN",
    },
  };
}

test("vote UI exposes irreversible join/pass state and 15-second deadline", () => {
  const undecided = createOnlineAuctionUiModel(state(voteChoice()), "p2");
  assert.equal(undecided.stage, "vote");
  assert.equal(undecided.openingBid, 360);
  assert.equal(undecided.canJoin, true);
  assert.equal(undecided.canVotePass, true);

  const joined = createOnlineAuctionUiModel(state(voteChoice(["p2"])), "p2");
  assert.equal(joined.decision, "JOIN");
  assert.equal(joined.canJoin, false);
  assert.equal(joined.canVotePass, false);

  const passed = createOnlineAuctionUiModel(state(voteChoice([], ["p2"])), "p2");
  assert.equal(passed.decision, "PASS");
  assert.equal(passed.canJoin, false);
  assert.equal(passed.canVotePass, false);
});

test("vote UI explains insufficient gold with a disabled single action", () => {
  const poorState = state({
    ...voteChoice(),
    eligiblePlayerIds: ["p2"],
  });
  poorState.players[2] = { ...poorState.players[2], money: 100 };

  const model = createOnlineAuctionUiModel(poorState, "p3");
  assert.equal(model.eligible, false);
  assert.equal(model.insufficientGold, true);
  assert.equal(model.canJoin, false);
  assert.equal(model.canVotePass, false);
});

test("participant cards expose authoritative join order and first bidder", () => {
  const model = createOnlineAuctionUiModel(state(voteChoice(["p3", "p2"])), "p2");
  assert.deepEqual(model.participantCards.map((card) => [card.id, card.order, card.openingBidder]), [
    ["p3", 1, true],
    ["p2", 2, false],
  ]);
});

test("competitive UI keeps the participant order visible and turn-scoped controls", () => {
  const first = createOnlineAuctionUiModel(state(auctionChoice()), "p2");
  assert.equal(first.highestBidderId, "p2");
  assert.equal(first.minimumBid, 361);
  assert.equal(first.canBid, false);

  const bidder = createOnlineAuctionUiModel(state(auctionChoice()), "p3");
  assert.equal(bidder.isTurn, true);
  assert.equal(bidder.canBid, true);
  assert.equal(bidder.canPass, true);
  assert.deepEqual(bidder.participantCards.map((card) => card.id), ["p2", "p3"]);
});

test("Auction vote UI uses shared modal language and viewport portal", () => {
  assert.match(uiSource, /session\.passAuctionVote\(\)/);
  assert.doesNotMatch(uiSource, /session\.withdrawAuction\(\)/);
  assert.match(uiSource, /경매 참가/);
  assert.match(uiSource, /경매 포기/);
  assert.match(uiSource, /보유 골드 부족/);
  assert.doesNotMatch(uiSource, /showAuctionUnsoldResult/);
  assert.doesNotMatch(uiSource, /auction-result-modal/);
  assert.match(uiSource, /첫 입찰/);
  assert.match(uiSource, /입찰 차례/);
  assert.match(uiSource, /AUCTION_BID_PLACED/);
  assert.match(uiSource, /playAuctionBidSound\(\)/);
  assert.match(uiSource, /prepareAuctionBidSound/);
  assert.match(uiSource, /createAuctionIntroPresenter/);
  assert.match(uiSource, /auctionIntroUi\.js\?v=20260922-r1/);
  assert.match(uiSource, /auctionBidSound\.js\?v=20260922-r4/);
  assert.match(uiSource, /bidEventPlayer\.textContent = playerName\(player\)/);
  assert.match(uiSource, /bidEventAmount\.textContent = money\(event\.amount\)/);
  assert.match(uiSource, /BID_EVENT_HOLD_MS = 2200/);
  assert.match(uiSource, /HIGHEST_BID_COUNT_MS = 700/);
  assert.match(uiSource, /renderHighestBid\(model\.highestBid\)/);
  assert.match(uiSource, /bidEvent\.dataset\.surge = event\.surge === true/);
  assert.match(uiSource, /elements\.status\.hidden = model\.stage === "auction"/);
  assert.match(uiSource, /elements\.detail\.hidden = model\.stage === "auction"/);
  assert.doesNotMatch(uiSource, /현재 최고 입찰자 \$\{model\.highestBidderName/);
  assert.match(cssSource, /data-current-turn="true"/);
  assert.match(cssSource, /auctionBidPaddleRaise/);
  assert.match(cssSource, /auctionBidValueCount/);
  assert.match(cssSource, /auctionSurgeBidEvent/);
  assert.match(cssSource, /\.auction-intro/);
  assert.match(cssSource, /\.auction-roulette/);
  assert.match(cssSource, /auctionRouletteSpin/);
  assert.match(cssSource, /큰 폭의 입찰/);
  assert.match(cssSource, /content: " · 입찰"/);
  assert.match(cssSource, /body\[data-play-mode="window"\] \.important-notice/);
  assert.match(uiSource, /15초/);
  assert.match(uiSource, /session\.advanceAuctionDeadline\(\)/);
  assert.match(uiSource, /session\.getServerNowMs\?\.\(\)/);
  assert.match(uiSource, /const modalHost = documentObject\.body \?\? dock/);
  assert.match(cssSource, /data-auction-stage="vote"/);
  assert.match(cssSource, /#172331/);
  assert.match(cssSource, /auction-action-panel__participants/);
  assert.match(cssSource, /data-single-action="true"/);
});

test("server migration keeps every competitive bid turn at 15 seconds", () => {
  assert.equal((bidTimingSql.match(/interval '15 seconds'/g) ?? []).length, 3);
  assert.doesNotMatch(bidTimingSql, /interval '10 seconds'/);
  assert.match(bidTimingSql, /private\.marble_auction_v3_finalize_vote/);
  assert.match(bidTimingSql, /public\.marble_auction_bid/);
  assert.match(bidTimingSql, /public\.marble_advance_auction_deadline/);
});

test("server Auction start migration randomizes the first bidder and gates bidding until roulette completes", () => {
  assert.match(auctionStartSql, /AUCTION_STARTING/);
  assert.match(auctionStartSql, /order by random\(\)/);
  assert.match(auctionStartSql, /v_starts_at \+ interval '15 seconds'/);
  assert.match(auctionStartSql, /AUCTION_NOT_STARTED/);
  assert.match(auctionIntroPacingSql, /interval '2 seconds'/);
  assert.match(auctionIntroPacingSql, /interval '5\.2 seconds'/);
  assert.match(auctionIntroPacingSql, /interval '7\.2 seconds'/);
  assert.match(auctionIntroPacingSql, /interval '9\.2 seconds'/);
  assert.match(auctionIntroPacingSql, /rouletteStopsAt/);
  assert.match(auctionIntroPacingSql, /winnerNoticeAt/);
});

test("server decisive-bid migration settles at the submitted amount and emits feedback metadata", () => {
  assert.match(decisiveBidSql, /jsonb_set\(v_auction,'\{highestBid\}',to_jsonb\(p_amount\)\)/);
  assert.match(decisiveBidSql, /AUCTION_DECISIVE_BID/);
  assert.match(decisiveBidSql, /previousAmount/);
  assert.match(decisiveBidSql, /increase/);
  assert.match(decisiveBidSql, /greatest\(100, ceil\(v_previous_highest::numeric \* 0\.30\)/);
});

test("legacy controls cannot bypass Auction vote or competitive auction", () => {
  assert.match(
    controller2dSource,
    /"AUCTION_VOTE", "PROPERTY_AUCTION"/,
  );
  assert.match(
    auctionVoteSql,
    /in \('AUCTION_REQUEST','AUCTION_RECRUITMENT','AUCTION_VOTE','PROPERTY_AUCTION'\)/,
  );
});

function snapshot(version, pendingChoice = voteChoice()) {
  return {
    serverNow: "2026-09-19T12:00:00Z",
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

test("active online session maps Auction vote participant updates", async () => {
  const restore = installFakeBrowser();
  const observedVersions = [];
  try {
    const joinedSnapshot = snapshot(8, voteChoice(["p2"]));
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: snapshot(7),
      api: {
        createActionId: () => "11111111-1111-4111-8111-111111111111",
        subscribeGame: () => () => {},
        getSnapshot: async () => joinedSnapshot,
        joinAuction: async () => joinedSnapshot,
      },
    });

    assert.equal(getActiveOnlineClassicSession("room-1"), session);
    const unsubscribe = session.subscribeState((nextState) => observedVersions.push(nextState.version));
    await session.joinAuction();
    assert.deepEqual(observedVersions, [8]);
    assert.equal(session.getState().pendingChoice.type, "AUCTION_VOTE");
    assert.deepEqual(session.getState().pendingChoice.participantPlayerIds, ["p2"]);

    unsubscribe();
    session.dispose();
  } finally {
    restore();
  }
});

test("session maps vote lists and exposes pass action", () => {
  assert.match(sessionSource, /pendingChoice\.type === "AUCTION_VOTE"/);
  assert.match(sessionSource, /participantPlayerIds/);
  assert.match(sessionSource, /passedPlayerIds/);
  assert.match(sessionSource, /joinAuction\(\)/);
  assert.match(sessionSource, /passAuctionVote\(\)/);
  assert.match(sessionSource, /advanceAuctionDeadline\(\)/);
});
