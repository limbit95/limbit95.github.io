import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const onlineSource = readFileSync(new URL("../js/onlineGameController.js", import.meta.url), "utf8");
const online2dSource = readFileSync(new URL("../js/onlineGameController2d.js", import.meta.url), "utf8");
const localSource = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");

test("TURN_END is presentation-driven and no longer exposes a manual next-turn button", () => {
  for (const source of [onlineSource, online2dSource, localSource]) {
    assert.match(source, /phase === TURN_PHASES\.TURN_END/);
    assert.match(source, /primaryActionButton\.hidden = true/);
    assert.doesNotMatch(source, /이번 턴 처리가 끝났습니다\.[\s\S]{0,180}다음 턴/);
  }
});

test("online controller advances the authoritative turn after the result hold", () => {
  assert.match(onlineSource, /TURN_RESULT_HOLD_MS = 1800/);
  assert.match(onlineSource, /async function maybeAutoAdvanceTurn\(state\)/);
  assert.match(onlineSource, /autoAdvancedTurnVersion === state\.version/);
  assert.match(onlineSource, /await session\.endTurn\(\)/);
  assert.match(onlineSource, /latest\.version !== state\.version/);
});

test("purchase, build, auction decline, and unsold results feed the shared board notice", () => {
  assert.match(onlineSource, /event\.type === "PROPERTY_BOUGHT"/);
  assert.match(onlineSource, /구입했습니다/);
  assert.match(onlineSource, /event\.type === "PROPERTY_BUILT"/);
  assert.match(onlineSource, /건물을 건설했습니다/);
  assert.match(onlineSource, /event\.type === "AUCTION_VOTE_OPENED"/);
  assert.match(onlineSource, /구입을 포기했습니다/);
  assert.match(onlineSource, /event\.type === "AUCTION_VOTE_CLOSED"/);
  assert.match(onlineSource, /경매가 유찰되었습니다/);
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
