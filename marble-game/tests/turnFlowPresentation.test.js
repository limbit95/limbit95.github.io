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

test("competitive Auction start uses a timed announcement and roulette before bid controls", () => {
  assert.match(auctionIntroUiSource, /경매가 곧 시작됩니다!/);
  assert.match(auctionIntroUiSource, /첫 입찰자를 정합니다/);
  assert.match(auctionIntroUiSource, /phase === "roulette" && spinningKey !== key/);
  assert.match(auctionIntroUiSource, /playAuctionStartSound\(\)/);
  assert.match(auctionCssSource, /auctionRouletteSpin/);
  for (const source of [onlineSource, localSource]) {
    assert.match(source, /AUCTION_STARTING/);
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

test("decisive Auction bid notice is concise and precedes purchase animation", () => {
  for (const source of [onlineSource, localSource]) {
    assert.match(source, /AUCTION_DECISIVE_BID/);
    assert.match(source, /보유 골드보다 높은/);
    assert.match(source, /await presentDecisiveBidNotice\(state, event\)/);
    assert.match(source, /DECISIVE_BID_NOTICE_HOLD_MS = 2000/);
    assert.match(source, /AUCTION_BID_PLACED/);
    assert.match(source, /event\.surge === true/);
    assert.match(source, /큰 폭의 입찰!/);
    assert.doesNotMatch(source, /승부를 결정했습니다![\s\S]{0,100}더 이상 입찰할 수 없어/);
  }
});

test("local play mirrors automatic result-to-next-turn progression", () => {
  assert.match(localSource, /async function maybeAutoAdvanceLocalTurn\(state\)/);
  assert.match(localSource, /await wait\(TURN_RESULT_HOLD_MS\)/);
  assert.match(localSource, /localSession\.endTurn\(\)/);
  assert.match(localSource, /void maybeAutoAdvanceLocalTurn\(state\)/);
});

test("2D diagnostic mode keeps the same automatic-turn authority boundary", () => {
  assert.match(online2dSource, /async function maybeAutoAdvanceTurn\(state\)/);
  assert.match(online2dSource, /!viewerCanAct\(state\)/);
  assert.match(online2dSource, /await session\.endTurn\(\)/);
});
