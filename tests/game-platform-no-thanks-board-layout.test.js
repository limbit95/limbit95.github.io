import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  getBoardSeatCoordinates,
  getNoThanksCardTone,
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
  assert.match(runtime, /getPublicProfiles/u);
  assert.match(runtime, /getSignedAvatarUrl/u);
  assert.match(runtime, /default-avatar\.svg/u);
  assert.match(runtime, /NO CHIP/u);
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
  assert.match(styles, /\.no-thanks-center-chips__empty-mark/u);
  assert.match(styles, /nth-child\(16\)/u);
  assert.match(styles, /min-height:\s*196px/u);
  assert.match(styles, /width:\s*86px/u);
  assert.match(styles, /\.no-thanks-hand-card:hover/u);
  assert.match(styles, /@keyframes no-thanks-seat-arrive/u);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/u);
});
