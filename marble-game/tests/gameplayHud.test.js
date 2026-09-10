import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { DICE_STAGE_PROFILE, dieFaceNormal, normalizeDiceFace } from "../js/diceStage.js";
import { DEFAULT_PLAYERS, createLocalClassicSession } from "../js/localPlaytest.js";

const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const playWindowCss = readFileSync(new URL("../css/play-window.css", import.meta.url), "utf8");

test("Classic local playtest defaults to four HUD-ready players", () => {
  assert.equal(DEFAULT_PLAYERS.length, 4);
  assert.deepEqual(DEFAULT_PLAYERS.map((player) => player.id), ["player-a", "player-b", "player-c", "player-d"]);
  const session = createLocalClassicSession({ random: () => 0 });
  assert.equal(session.getState().players.length, 4);
});

test("gameplay screen keeps player info, dice and recent history inside the board shell", () => {
  assert.match(indexHtml, /player-hud-layer/);
  assert.match(indexHtml, /data-dice-stage/);
  assert.match(indexHtml, /class="game-history"/);
  assert.doesNotMatch(indexHtml, /playtest-sidebar/);
});

test("tile modal separates inspection confirmation from landing decisions", () => {
  assert.match(indexHtml, /data-tile-info-confirm/);
  assert.match(indexHtml, /data-tile-info-decline/);
  assert.match(indexHtml, /data-tile-info-action/);
});

test("dedicated play window gives the board the full gameplay viewport", () => {
  assert.match(playWindowCss, /\.three-prototype-shell\s*\{[\s\S]*width:\s*100%[\s\S]*height:\s*100%/);
  assert.match(playWindowCss, /\.classic-three-canvas\s*\{[\s\S]*transform:\s*scale\(1\.5\)/);
  assert.match(playWindowCss, /\.two-d-fallback,[\s\S]*display:\s*none/);
});

test("3D dice stage validates faces and uses the compact half-size dice profile", () => {
  assert.equal(normalizeDiceFace(1), 1);
  assert.equal(normalizeDiceFace(6), 6);
  assert.throws(() => normalizeDiceFace(7), RangeError);
  assert.deepEqual(dieFaceNormal(1), [0, 1, 0]);
  assert.deepEqual(dieFaceNormal(6), [0, -1, 0]);
  assert.ok(DICE_STAGE_PROFILE.durationMs >= 700);
  assert.equal(DICE_STAGE_PROFILE.dieSize, 0.59);
  assert.equal(DICE_STAGE_PROFILE.settleHeight, 0.31);
});
