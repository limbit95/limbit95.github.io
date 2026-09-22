import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const onlineSource = readFileSync(new URL("../js/onlineGameController.js", import.meta.url), "utf8");
const online2dSource = readFileSync(new URL("../js/onlineGameController2d.js", import.meta.url), "utf8");
const localSource = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");
const onlineAuctionUiSource = readFileSync(new URL("../js/onlineAuctionUi.js", import.meta.url), "utf8");
const localAuctionUiSource = readFileSync(new URL("../js/localAuctionUi.js", import.meta.url), "utf8");
const auctionCssSource = readFileSync(new URL("../css/auction-ui.css", import.meta.url), "utf8");
const auctionIntroUiSource = readFileSync(new URL("../js/auctionIntroUi.js", import.meta.url), "utf8");

test("TURN_END is presentation-driven and no longer exposes a manual next-turn button", () => {
  for (const source of [onlineSource, online2dSource, localSource]) {
    assert.match(source, /phase === TURN_PHASES\.TURN_END/);
    assert.match(source, /primaryActionButton\.hidden = true/);
    assert.doesNotMatch(source, /이번 턴 처리가 끝났습니다\.[\s\S]{0,180}다음 턴/);
  }
});

test("online controller advances the authoritative turn after the result hold", () => {
  assert.match(onlineSource, /TURN_RESULT_HOLD_MS = 2400/);
  assert.match(onlineSource, /AUCTION_RESULT_HOLD_MS = 1200/);
  assert.match(onlineSource, /DECISIVE_AUCTION_RESULT_HOLD_MS = 700/);
  assert.match(onlineSource, /async function maybeAutoAdvanceTurn\(state\)/);
  assert.match(onlineSource, /autoAdvancedTurnVersion === state\.version/);
  assert.match(onlineSource, /await session\.endTurn\(\)/);
  assert.match(onlineSource, /latest\.version !== state\.version/);
});

test("purchase and Auction lifecycle results use the shared board notice", () => {
  for (const source of [onlineSource, localSource]) {
    assert.match(source, /event\.type === "PROPERTY_BOUGHT"/);
    assert.match(source, /event\.type === "PROPERTY_BUILT"/);
    assert.match(source, /event\.type === "AUCTION_VOTE_OPENED"/);
    assert.match(source, /event\.type === "AUCTION_VOTE_JOINED"/);
    assert.match(source, /event\.type === "AUCTION_VOTE_PASSED"/);
    assert.match(source, /event\.type === "AUCTION_VOTE_CLOSED"/);
    assert.match(source, /event\.type === "AUCTION_STARTING"/);
    assert.match(source, /event\.type === "AUCTION_PASSED"/);
    assert.match(source, /event\.type === "AUCTION_AUTO_PASSED"/);
    assert.match(source, /경매가 유찰되었습니다/);
  }
});

test("competitive Auction intro announces, spins, holds the result, then names the first bidder", () => {
  assert.match(auctionIntroUiSource, /경매가 곧 시작됩니다!/);
  assert.match(auctionIntroUiSource, /첫 입찰자를 정합니다/);
  assert.match(auctionIntroUiSource, /phase === "roulette" && spinningKey !== key/);
  assert.match(auctionIntroUiSource, /now < rouletteStopsAt/);
  assert.match(auctionIntroUiSource, /now < winnerNoticeAt/);
  assert.match(auctionIntroUiSource, /님이 첫 입찰 순서입니다!/);
  assert.match(auctionIntroUiSource, /playAuctionStartSound\(\)/);
  assert.match(auctionCssSource, /auctionRouletteSpin/);
  assert.match(auctionCssSource, /rotate\(2520deg\)/);
  assert.match(auctionCssSource, /\.auction-intro__winner/);
  for (const source of [onlineSource, localSource]) {
    assert.match(source, /AUCTION_STARTING/);
  }
});

test("shared result notice stays centered without an Auction dialog backdrop", () => {
  for (const source of [onlineAuctionUiSource, localAuctionUiSource]) {
    assert.doesNotMatch(source, /showAuctionUnsoldResult/);
    assert.doesNotMatch(source, /auction-result-modal/);
  }
  assert.match(auctionCssSource, /important-notice\[data-notice-layer="global"\][\s\S]*position: fixed/);
  assert.match(auctionCssSource, /transform: translate\(-50%, -50%\)/);
  assert.match(auctionCssSource, /backdrop-filter: none/);
  assert.doesNotMatch(auctionCssSource, /auction-result-modal::backdrop/);
});

test("Auction resolution notice starts before its follow-up animation", () => {
  for (const source of [onlineSource, localSource]) {
    assert.match(source, /AUCTION_DECISIVE_BID/);
    assert.match(source, /보유 골드보다 높은/);
    assert.match(source, /isAuctionResolutionState\(state\)/);
    assert.match(source, /if \(auctionResolution\) showImportantNotice\(state\)/);
    assert.match(source, /if \(!auctionResolution\) showImportantNotice\(state\)/);
    assert.doesNotMatch(source, /presentDecisiveBidNotice/);
    assert.doesNotMatch(source, /DECISIVE_BID_NOTICE_HOLD_MS/);
  }

  assert.ok(
    onlineSource.indexOf("if (auctionResolution) showImportantNotice(state);")
      < onlineSource.indexOf("if (animate) await animateState(state, { remote });"),
  );
  assert.ok(
    localSource.indexOf("if (auctionResolution) showImportantNotice(state);")
      < localSource.indexOf("await playStateEvents(state);"),
  );
});

test("Auction notices stay above the active Auction panel", () => {
  for (const source of [onlineAuctionUiSource, localAuctionUiSource]) {
    assert.match(source, /auctionOverlayActive/);
  }
  assert.match(auctionCssSource, /data-auction-overlay-active="true"/);
  assert.match(auctionCssSource, /z-index: 5000/);
  assert.match(auctionCssSource, /top: max\(18px, env\(safe-area-inset-top\)\)/);
  for (const source of [onlineSource, localSource]) {
    assert.match(source, /document\.body\.append\(importantNotice\)/);
    assert.match(source, /noticeLayer = "global"/);
  }
});

test("local play mirrors automatic result-to-next-turn progression", () => {
  assert.match(localSource, /async function maybeAutoAdvanceLocalTurn\(state\)/);
  assert.match(localSource, /auctionPurchase[\s\S]*AUCTION_RESULT_HOLD_MS[\s\S]*TURN_RESULT_HOLD_MS/);
  assert.match(localSource, /localSession\.endTurn\(\)/);
  assert.match(localSource, /return maybeAutoAdvanceLocalTurn\(state\)/);
});

test("2D diagnostic mode keeps the same automatic-turn authority boundary", () => {
  assert.match(online2dSource, /async function maybeAutoAdvanceTurn\(state\)/);
  assert.match(online2dSource, /!viewerCanAct\(state\)/);
  assert.match(online2dSource, /await session\.endTurn\(\)/);
});
