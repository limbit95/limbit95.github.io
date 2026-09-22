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

test("competitive Auction intro uses the authoritative profile-chain starter selector", () => {
  assert.match(auctionIntroUiSource, /경매가 곧 시작됩니다!/);
  assert.match(auctionIntroUiSource, /경매 시작 플레이어를 정합니다/);
  assert.match(auctionIntroUiSource, /phase === "selector"/);
  assert.match(auctionIntroUiSource, /now < selectorStopsAt/);
  assert.match(auctionIntroUiSource, /starterPlayerId/);
  assert.match(auctionIntroUiSource, /님부터 경매를 시작합니다!/);
  assert.match(auctionIntroUiSource, /getPublicProfiles/);
  assert.match(auctionIntroUiSource, /getSignedAvatarUrl/);
  assert.match(auctionIntroUiSource, /playAuctionStartSound\(\)/);
  assert.match(auctionCssSource, /\.auction-selector/);
  assert.match(auctionCssSource, /auctionSelectorChain/);
  assert.doesNotMatch(auctionCssSource, /\.auction-roulette/);
  assert.doesNotMatch(auctionIntroUiSource, /첫 입찰/);
  for (const source of [onlineSource, localSource]) {
    assert.match(source, /AUCTION_STARTING/);
    assert.match(source, /시작 플레이어 추첨/);
  }
});

test("shared result notice stays centered without an Auction dialog backdrop", () => {
  for (const source of [onlineAuctionUiSource, localAuctionUiSource]) {
    assert.doesNotMatch(source, /showAuctionUnsoldResult/);
    assert.doesNotMatch(source, /auction-result-modal/);
  }
  assert.match(auctionCssSource, /\.important-notice,[\s\S]*top: 50%/);
  assert.match(auctionCssSource, /transform: translate\(-50%, -50%\)/);
  assert.match(auctionCssSource, /backdrop-filter: none/);
  assert.doesNotMatch(auctionCssSource, /auction-result-modal::backdrop/);
});

test("Auction resolution notice appears concurrently with its follow-up animation", () => {
  for (const source of [onlineSource, localSource]) {
    assert.match(source, /AUCTION_DECISIVE_BID/);
    assert.match(source, /보유 골드보다 높은/);
    assert.match(source, /isAuctionResolutionState\(state\)/);
    assert.match(source, /if \(auctionResolution\) showImportantNotice\(state\)/);
    assert.match(source, /if \(!auctionResolution\) showImportantNotice\(state\)/);
    assert.doesNotMatch(source, /presentDecisiveBidNotice/);
    assert.doesNotMatch(source, /DECISIVE_BID_NOTICE_HOLD_MS/);
  }
});

test("Auction notices sit immediately above the active Auction panel", () => {
  for (const source of [onlineAuctionUiSource, localAuctionUiSource]) {
    assert.match(source, /auctionOverlayActive/);
    assert.match(source, /syncAuctionNoticeAnchor/);
    assert.match(source, /getBoundingClientRect/);
    assert.match(source, /rect\.top - 10/);
  }
  assert.match(auctionCssSource, /data-auction-overlay-active="true"/);
  assert.match(auctionCssSource, /--auction-notice-top/);
  assert.match(auctionCssSource, /z-index: 3200/);
  assert.doesNotMatch(auctionCssSource, /top: max\(18px, env\(safe-area-inset-top\)\)/);
});

test("Auction runtime removes legacy first-bidder presentation residue", () => {
  for (const source of [onlineAuctionUiSource, localAuctionUiSource, auctionIntroUiSource]) {
    assert.doesNotMatch(source, /첫 입찰/);
    assert.doesNotMatch(source, /openingBidder/);
  }
  assert.doesNotMatch(auctionCssSource, /auction-action-panel__first-bid/);
});

test("bid popup stays compact so the highest-bid metric remains visible", () => {
  assert.match(auctionCssSource, /max-width: min\(286px, calc\(100% - 36px\)\)/);
  assert.match(auctionCssSource, /right: 18px/);
  assert.match(auctionCssSource, /font-size: clamp\(1\.3rem, 4vw, 1\.6rem\)/);
  for (const source of [onlineAuctionUiSource, localAuctionUiSource]) {
    assert.match(source, /renderHighestBid\(model\.highestBid > 0 \? model\.highestBid : model\.openingBid\)/);
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
