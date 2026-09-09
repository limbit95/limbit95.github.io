import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const appSource = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");
const visibilityCss = readFileSync(new URL("../css/visibility-polish.css", import.meta.url), "utf8");
const diceStageSource = readFileSync(new URL("../js/diceStage.js", import.meta.url), "utf8");
const ownershipVisualSource = readFileSync(new URL("../js/themes/classic/ownershipVisual.js", import.meta.url), "utf8");

test("settled 3D dice survive the movement hide request", () => {
  assert.match(diceStageSource, /let preserveNextHide = false/);
  assert.match(diceStageSource, /setSettled\(faces\);\s*preserveNextHide = true/);
  assert.match(diceStageSource, /if \(preserveNextHide\) \{\s*preserveNextHide = false;\s*return;/);
});

test("dedicated play window uses substantially larger player and status HUDs", () => {
  assert.match(visibilityCss, /width:\s*clamp\(320px,\s*25vw,\s*440px\)/);
  assert.match(visibilityCss, /min-height:\s*138px/);
  assert.match(visibilityCss, /player-token[\s\S]*width:\s*58px[\s\S]*height:\s*58px/);
  assert.match(visibilityCss, /game-status-hud[\s\S]*width:\s*min\(620px,\s*46vw\)/);
  assert.match(visibilityCss, /important-notice[\s\S]*font-size:\s*1\.18rem/);
});

test("Classic ownership flag sits on the tile accent strip while edge trim stays outside", () => {
  assert.match(indexHtml, /themes\/classic\/ownershipVisual\.js/);
  assert.match(ownershipVisualSource, /style:\s*"accent-strip-flag-and-edge-trim"/);
  assert.match(ownershipVisualSource, /outerEdgeZ = entry\.tileDepth \* 0\.47/);
  assert.match(ownershipVisualSource, /accentStripZ = -\(entry\.tileDepth \* 0\.38\)/);
  assert.match(ownershipVisualSource, /pole\.position\.set\(flagX, 0\.9, accentStripZ\)/);
  assert.match(ownershipVisualSource, /flagPanel\.position\.set\([\s\S]*accentStripZ\)/);
  assert.match(visibilityCss, /\.classic-ownership-three-canvas/);
});

test("tile details and toll notices keep the board visible without a dim backdrop", () => {
  assert.match(indexHtml, /data-toll-notice-modal/);
  assert.match(appSource, /createClassicTollNotice/);
  assert.match(appSource, /if \(tollNotice\) \{\s*openTollNotice\(tollNotice\)/);
  assert.match(visibilityCss, /\.tile-info-modal::backdrop,[\s\S]*\.toll-notice-modal::backdrop[\s\S]*background:\s*transparent/);
  assert.match(visibilityCss, /\.tile-info-modal__stats[\s\S]*grid-template-columns:\s*repeat\(2/);
});

test("dice result pauses with a centered move-count pop before piece movement", () => {
  assert.match(indexHtml, /data-move-count-pop/);
  assert.match(appSource, /MOVE_COUNT_HOLD_MS = 1200/);
  assert.match(appSource, /await showMoveCount\(/);
  assert.match(appSource, /`\$\{Number\(total\)\}칸 이동!`/);
  assert.match(visibilityCss, /\.move-count-pop/);
  assert.match(visibilityCss, /@keyframes marble-move-count-pop/);
});

test("toll notice exposes balance before, deduction and balance after", () => {
  assert.match(indexHtml, /data-toll-balance-before/);
  assert.match(indexHtml, /data-toll-deduction/);
  assert.match(indexHtml, /data-toll-balance-after/);
  assert.match(appSource, /notice\.balanceBeforeLabel/);
  assert.match(appSource, /notice\.deductionLabel/);
  assert.match(appSource, /notice\.balanceAfterLabel/);
  assert.match(visibilityCss, /\.toll-notice-modal__balance/);
});

test("roll action exposes a centered hold-to-charge control", () => {
  assert.match(indexHtml, /data-board-action-dock/);
  assert.match(indexHtml, /data-dice-charge/);
  assert.match(indexHtml, /diceCharge\.js/);
  assert.match(visibilityCss, /board-action-dock\[data-roll-ready="true"\][\s\S]*top:\s*50%/);
  assert.match(visibilityCss, /dice-charge__track/);
});
