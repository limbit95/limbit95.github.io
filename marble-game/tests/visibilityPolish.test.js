import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const visibilityCss = readFileSync(new URL("../css/visibility-polish.css", import.meta.url), "utf8");
const diceStageSource = readFileSync(new URL("../js/diceStage.js", import.meta.url), "utf8");
const ownershipOverlaySource = readFileSync(new URL("../js/ownershipOverlay.js", import.meta.url), "utf8");

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

test("ownership overlay exposes a player-colored P1-P4 marker on owned board tiles", () => {
  assert.match(indexHtml, /visibility-polish\.css/);
  assert.match(indexHtml, /ownershipOverlay\.js/);
  assert.match(ownershipOverlaySource, /data-owner-seat/);
  assert.match(ownershipOverlaySource, /createSquareRingLayout/);
  assert.match(ownershipOverlaySource, /badge\.textContent = `P\$\{seat \+ 1\}`/);
  assert.match(visibilityCss, /\.ownership-badge/);
  assert.match(visibilityCss, /--owner-accent/);
});
