import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  getBoardSeatCoordinates,
  getNoThanksCardTone,
  getNoThanksDeckVisualCount,
  getNoThanksHandOverlap,
  getNoThanksVisibleChipCount,
  orderBoardPlayers,
} from "../games/no-thanks/boardLayout.js";

const runtime = readFileSync(
  new URL("../games/no-thanks/main.js", import.meta.url),
  "utf8",
);
const styles = readFileSync(
  new URL("../games/no-thanks/styles.css", import.meta.url),
  "utf8",
);

test("No Thanks! board rotates presentation so the viewer stays at six o'clock", () => {
  const players = Array.from({ length: 7 }, (_, seat) => ({
    id: "player-" + String(seat),
    seat,
  }));
  const rotated = orderBoardPlayers(players, "player-4");

  assert.equal(rotated[0].id, "player-4");
  assert.deepEqual(
    rotated.map((player) => player.seat),
    [4, 5, 6, 0, 1, 2, 3],
    "visual rotation must preserve authoritative seat values",
  );

  for (let count = 3; count <= 7; count += 1) {
    const coordinates = Array.from(
      { length: count },
      (_, index) => getBoardSeatCoordinates(index, count),
    );
    const viewer = coordinates[0];
    const maxTop = Math.max(...coordinates.map((position) => position.top));

    assert.ok(
      Math.abs(viewer.top - maxTop) < 0.000001,
      String(count) + "-player viewer seat must be the bottom-most seat",
    );
    assert.ok(
      Math.abs(viewer.left - 50) < 0.000001,
      String(count) + "-player viewer seat must stay horizontally centered",
    );
    assert.equal(
      new Set(coordinates.map((position) => (
        position.left.toFixed(4) + ":" + position.top.toFixed(4)
      ))).size,
      count,
      String(count) + "-player seats must have distinct circular positions",
    );
    coordinates.forEach((position) => {
      assert.ok(position.left >= 0 && position.left <= 100);
      assert.ok(position.top >= 0 && position.top <= 100);
    });
  }
});

test("No Thanks! hand presentation keeps card colors and overlap bounded", () => {
  assert.equal(getNoThanksCardTone(3), "blue");
  assert.equal(getNoThanksCardTone(11), "teal");
  assert.equal(getNoThanksCardTone(19), "yellow");
  assert.equal(getNoThanksCardTone(35), "pink");

  assert.equal(getNoThanksHandOverlap(3), -8);
  assert.equal(getNoThanksHandOverlap(8), -18);
  assert.equal(getNoThanksHandOverlap(13), -30);
  assert.equal(getNoThanksHandOverlap(18), -40);
  assert.equal(getNoThanksHandOverlap(24), -50);

  assert.equal(getNoThanksVisibleChipCount(0), 0);
  assert.equal(getNoThanksVisibleChipCount(6), 6);
  assert.equal(getNoThanksVisibleChipCount(11), 11);
  assert.equal(getNoThanksVisibleChipCount(24), 16);
  assert.equal(getNoThanksVisibleChipCount(24, { compact: true }), 7);

  assert.equal(getNoThanksDeckVisualCount(0), 0);
  assert.equal(getNoThanksDeckVisualCount(1), 1);
  assert.equal(getNoThanksDeckVisualCount(3), 2);
  assert.equal(getNoThanksDeckVisualCount(7), 3);
  assert.equal(getNoThanksDeckVisualCount(11), 4);
  assert.equal(getNoThanksDeckVisualCount(15), 5);
  assert.equal(getNoThanksDeckVisualCount(19), 6);
  assert.equal(getNoThanksDeckVisualCount(24), 7);
});

test("No Thanks! Phase A-D board UI keeps board, HUD, seat, and personal panel contracts", () => {
  assert.match(runtime, /no-thanks-game-board/u);
  assert.match(runtime, /no-thanks-round-table/u);
  assert.match(runtime, /getBoardSeatCoordinates/u);
  assert.match(runtime, /no-thanks-board-hud/u);
  assert.match(runtime, /no-thanks-my-panel/u);
  assert.match(runtime, /no-thanks-hand-card/u);
  assert.match(runtime, /no-thanks-number-card__corner--top/u);
  assert.match(runtime, /no-thanks-number-card__corner--bottom/u);
  assert.match(runtime, /no-thanks-seat__avatar/u);
  assert.match(runtime, /no-thanks-seat__name/u);
  assert.match(runtime, /getPublicProfiles/u);
  assert.match(runtime, /getSignedAvatarUrl/u);
  assert.match(runtime, /default-avatar\.svg/u);
  assert.match(runtime, /NO CHIP/u);
  assert.match(runtime, /createCenterChipAction/u);
  assert.match(runtime, /count > 0[\s\S]*?no-thanks-center-chips__count/u);
  assert.match(runtime, /createDrawDeck\(view\)/u);
  assert.match(runtime, /deck\?\.querySelector\("span:last-child"\) \?\? deck/u);
  assert.match(runtime, /function createDealFlight/u);
  assert.match(runtime, /className = "no-thanks-card-flight"/u);
  assert.match(runtime, /flight\.animate\(/u);
  assert.match(runtime, /duration:\s*760/u);
  assert.match(runtime, /offset:\s*\.22[\s\S]*?offset:\s*\.5[\s\S]*?offset:\s*\.78[\s\S]*?offset:\s*\.94/u);
  assert.match(runtime, /inner\.animate\(/u);
  assert.match(runtime, /landingTarget\?\.classList\.remove\("is-awaiting-deal"\)/u);
  assert.match(runtime, /event\.currentTarget\.classList\.add\("is-submitting"\)/u);
  assert.match(runtime, /카드를 눌러 가져오기/u);
  assert.match(runtime, /칩 1개 내기/u);
  assert.match(runtime, /readBoardTransitionEffects/u);
  assert.match(runtime, /no-thanks-chip-flight/u);
  assert.match(runtime, /chipPreviousCount/u);
  assert.match(runtime, /displayCount: effects\.chipFromPlayerId \? effects\.chipPreviousCount : null/u);
  assert.match(runtime, /commitCenterChipLanding\(board\)/u);
  assert.match(runtime, /setTimeout\([\s\S]*?commitCenterChipLanding\(board\)[\s\S]*?,\s*100\)/u);
  assert.match(runtime, /syncBoardAnimationGeometry/u);
  assert.match(runtime, /boardPresentationEffect/u);
  assert.match(runtime, /boardPresentationEffect\.started = true/u);
  assert.match(runtime, /no-thanks-table-card__inner/u);
  assert.match(runtime, /boardMode \? \[\] : lobbyActions/u);
  assert.match(runtime, /no-thanks-panel-tools/u);
  assert.doesNotMatch(runtime, /no-thanks-my-panel__message no-thanks-my-panel__message--playing/u);
  assert.doesNotMatch(runtime, /function createPlayingPrimaryActions/u);
  assert.match(runtime, /자리이탈/u);
  assert.match(runtime, /is-arriving/u);
  assert.match(runtime, /lobbyController\.refuseCard\(\)/u);
  assert.match(runtime, /lobbyController\.takeCard\(\)/u);

  assert.match(styles, /\.no-thanks-shell--board \.game-platform-shell__sidebar\s*\{[\s\S]*?display:\s*none/u);
  assert.match(styles, /\.no-thanks-game-board/u);
  assert.match(styles, /\.no-thanks-round-table/u);
  assert.match(styles, /\.no-thanks-board-hud/u);
  assert.match(styles, /\.no-thanks-my-panel/u);
  assert.match(styles, /height:\s*800px/u);
  assert.match(styles, /\.no-thanks-seat__avatar/u);
  assert.match(styles, /\.no-thanks-seat__avatar-frame/u);
  assert.match(styles, /width:\s*min\(80%,\s*1180px\)/u);
  assert.match(styles, /\.no-thanks-center-chips__empty-mark/u);
  assert.match(styles, /background:[\s\S]*?#d94a3f/u);
  assert.doesNotMatch(styles, /\.no-thanks-draw-deck__stack\.is-dealing span:last-child[\s\S]*?opacity:\s*0/u);
  assert.match(styles, /\.no-thanks-table-card\.is-awaiting-deal[\s\S]*?opacity:\s*0/u);
  assert.match(styles, /\.no-thanks-card-flight\s*\{[\s\S]*?position:\s*fixed/u);
  assert.match(styles, /\.no-thanks-card-flight\[data-tone="pink"\]/u);
  assert.match(styles, /animation-duration:\s*\.78s/u);
  assert.match(styles, /@keyframes no-thanks-chip-flight-to-pile/u);
  assert.match(styles, /@keyframes no-thanks-chip-flight-to-pile[\s\S]*?100%\s*\{[\s\S]*?opacity:\s*1/u);
  assert.match(styles, /\.no-thanks-center-chips__visual/u);
  assert.match(styles, /rotateY\(180deg\)/u);
  assert.match(styles, /grid-template-columns:\s*192px\s+minmax\(0,\s*1fr\)/u);
  assert.match(styles, /\.no-thanks-seat\.is-active\s*\{[\s\S]*?width:\s*107px[\s\S]*?height:\s*107px/u);
  assert.match(styles, /\.no-thanks-panel-tools\s*\{[\s\S]*?grid-template-columns:\s*1fr/u);
  assert.match(styles, /nth-child\(16\)/u);
  assert.match(styles, /min-height:\s*220px/u);
  assert.match(styles, /width:\s*86px/u);
  assert.match(styles, /\.no-thanks-hand-card:hover/u);
  assert.match(styles, /top:\s*-24px/u);
  assert.doesNotMatch(styles, /z-index:\s*80\s*!important/u);
  assert.match(
    styles,
    /@media \(max-width: 760px\)[\s\S]*?\.no-thanks-board-hud__badge,[\s\S]*?display:\s*inline-flex/u,
  );
  assert.match(styles, /@keyframes no-thanks-seat-arrive/u);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/u);
});
