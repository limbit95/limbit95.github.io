import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const originalWindow = globalThis.window;
globalThis.window = globalThis.window ?? {};
const { createOnlineAuctionUiModel } = await import("../js/onlineAuctionUi.js");
const {
  createOnlineClassicSession,
  getActiveOnlineClassicSession,
} = await import("../js/onlineSession.js?v=20260910-r8");
globalThis.window = originalWindow;

const uiSource = readFileSync(new URL("../js/onlineAuctionUi.js", import.meta.url), "utf8");
const sessionSource = readFileSync(new URL("../js/onlineSession.js", import.meta.url), "utf8");
const playWindowSource = readFileSync(new URL("../js/playWindow.js", import.meta.url), "utf8");
const controller2dSource = readFileSync(new URL("../js/onlineGameController2d.js", import.meta.url), "utf8");
const endTurnGuardSql = readFileSync(
  new URL("../../supabase/marble/20260918105000_marble_phase7a_end_turn_auction_guard.sql", import.meta.url),
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

test("request UI is available to other eligible players while the declining player controls request close", () => {
  const otherPlayer = createOnlineAuctionUiModel(state(requestChoice()), "p2");
  assert.equal(otherPlayer.stage, "request");
  assert.equal(otherPlayer.nodeLabel, "도쿄");
  assert.equal(otherPlayer.canRequest, true);
  assert.equal(otherPlayer.requested, false);
  assert.equal(otherPlayer.canClose, false);
  assert.equal(otherPlayer.openingBid, 240);

  const requested = createOnlineAuctionUiModel(state(requestChoice(["p2"])), "p2");
  assert.equal(requested.canRequest, false);
  assert.equal(requested.requested, true);
  assert.equal(requested.requestCount, 1);

  const decliningPlayer = createOnlineAuctionUiModel(state(requestChoice(["p2"])), "p1");
  assert.equal(decliningPlayer.eligible, false);
  assert.equal(decliningPlayer.canRequest, false);
  assert.equal(decliningPlayer.canClose, true);
});

test("auction UI exposes authoritative minimum bid, highest bidder, balance, and pass restrictions", () => {
  const requesterBeforeBid = createOnlineAuctionUiModel(state(auctionChoice()), "p2");
  assert.equal(requesterBeforeBid.stage, "auction");
  assert.equal(requesterBeforeBid.minimumBid, 240);
  assert.equal(requesterBeforeBid.viewerGold, 1200);
  assert.equal(requesterBeforeBid.canBid, true);
  assert.equal(requesterBeforeBid.canPass, false);
  assert.equal(requesterBeforeBid.passLabel, "첫 입찰 필요");

  const requesterLeading = createOnlineAuctionUiModel(state(auctionChoice({
    bidPlayerIds: ["p2"],
    highestBid: 260,
    highestBidderId: "p2",
  })), "p2");
  assert.equal(requesterLeading.minimumBid, 261);
  assert.equal(requesterLeading.highestBidderName, "B");
  assert.equal(requesterLeading.isHighestBidder, true);
  assert.equal(requesterLeading.canPass, false);
  assert.equal(requesterLeading.passLabel, "최고 입찰 중");

  const competitor = createOnlineAuctionUiModel(state(auctionChoice({
    bidPlayerIds: ["p2"],
    highestBid: 260,
    highestBidderId: "p2",
  })), "p3");
  assert.equal(competitor.canBid, true);
  assert.equal(competitor.canPass, true);

  const passed = createOnlineAuctionUiModel(state(auctionChoice({
    bidPlayerIds: ["p2"],
    passedPlayerIds: ["p3"],
    highestBid: 260,
    highestBidderId: "p2",
  })), "p3");
  assert.equal(passed.passed, true);
  assert.equal(passed.canBid, false);
  assert.equal(passed.canPass, false);
  assert.equal(passed.passLabel, "패스 완료");
});

test("minimal auction UI keeps purchase decline separate from build decline and does not hardcode a request timer", () => {
  assert.match(uiSource, /state\.pendingChoice\?\.type !== "BUY_PROPERTY"/);
  assert.match(uiSource, /session\.declinePropertyForAuction\(\)/);
  assert.match(uiSource, /stopImmediatePropagation\(\)/);
  assert.match(uiSource, /dataset\.auctionStage/);
  assert.match(uiSource, /requestButton\.textContent\s*=/);
  assert.match(uiSource, /bidButton\.textContent\s*=/);
  assert.match(uiSource, /bidInput\.dataset\.auctionBidInput/);
  assert.match(uiSource, /session\.auctionPass\(\)/);
  assert.doesNotMatch(uiSource, /setTimeout/);
  assert.doesNotMatch(uiSource, /5000/);
  assert.match(cssSource, /data-auction-stage="request"/);
  assert.match(cssSource, /data-auction-stage="auction"/);
  assert.match(cssSource, /@media \(max-width: 640px\)/);
});

test("legacy 2D controls and end-turn RPC cannot bypass an active auction", () => {
  assert.match(controller2dSource, /function isAuctionChoice\(state\)/);
  assert.match(controller2dSource, /\["AUCTION_REQUEST", "PROPERTY_AUCTION"\]\.includes\(state\.pendingChoice\?\.type\)/);
  assert.match(
    controller2dSource,
    /if \(isAuctionChoice\(currentState\) && \["decline", "endTurn"\]\.includes\(actionName\)\) return;/,
  );
  assert.match(
    controller2dSource,
    /if \(isAuctionChoice\(state\)\)[\s\S]*?primaryActionButton\.hidden = true;[\s\S]*?secondaryActionButton\) secondaryActionButton\.hidden = true;/,
  );
  assert.match(
    endTurnGuardSql,
    /pending_choice->>'type',''\) in \('AUCTION_REQUEST','PROPERTY_AUCTION'\)[\s\S]*?raise exception 'END_TURN_NOT_ALLOWED'/,
  );
  assert.match(endTurnGuardSql, /v_game\.phase not in \('TURN_END','WAITING_CHOICE'\)/);
});

test("online boot attaches the auction adapter only after the existing game controller is ready", () => {
  const controllerStart = playWindowSource.indexOf("controllerModule.startOnlineGameController");
  const auctionModule = playWindowSource.indexOf("onlineAuctionUi.js");
  assert.ok(controllerStart >= 0);
  assert.ok(auctionModule > controllerStart);
  assert.match(playWindowSource, /setupOnlineAuctionUi\(\{ roomId: onlineRoomId \}\)/);
  assert.match(sessionSource, /getActiveOnlineClassicSession/);
  assert.match(sessionSource, /subscribeState\(listener\)/);
  assert.match(sessionSource, /notifyCurrentState/);
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

test("active online session notifies the auction UI on authoritative action state and unregisters on dispose", async () => {
  const restore = installFakeBrowser();
  const observedVersions = [];
  const presentedVersions = [];
  try {
    const session = await createOnlineClassicSession({
      roomId: "room-1",
      initialSnapshot: snapshot(7),
      onRemoteState(stateValue) {
        presentedVersions.push(stateValue.version);
      },
      api: {
        createActionId: () => "11111111-1111-4111-8111-111111111111",
        subscribeGame: () => () => {},
        getSnapshot: async () => snapshot(8, requestChoice(["p2"])),
        requestAuction: async () => snapshot(8, requestChoice(["p2"])),
      },
    });

    assert.equal(getActiveOnlineClassicSession("room-1"), session);
    const unsubscribe = session.subscribeState((nextState) => observedVersions.push(nextState.version));
    await session.requestAuction();
    assert.deepEqual(observedVersions, [8]);
    await session.notifyCurrentState();
    assert.deepEqual(presentedVersions, [8]);

    unsubscribe();
    session.dispose();
    assert.equal(getActiveOnlineClassicSession("room-1"), null);
  } finally {
    restore();
  }
});
