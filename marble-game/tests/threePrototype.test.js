import test from "node:test";
import assert from "node:assert/strict";

import {
  CLASSIC_CAMERA_PROFILE,
  CLASSIC_VISUAL_PROFILE,
  createOrthographicBounds,
  createSquareRingLayout,
  getClassicTileVisual,
  THREE_IMPORT_VERSION,
} from "../js/renderer/threeClassicPrototype.js";

function nodes(count) {
  return Array.from({ length: count }, (_, index) => ({ id: `node-${index}` }));
}

test("3D square-ring layout keeps all 32 Classic nodes on unique positions", () => {
  const layout = createSquareRingLayout(nodes(32));
  assert.equal(layout.length, 32);
  const positions = new Set(layout.map((entry) => `${entry.x.toFixed(4)}:${entry.z.toFixed(4)}`));
  assert.equal(positions.size, 32);
  assert.deepEqual(
    Object.fromEntries(["south", "east", "north", "west"].map((side) => [
      side,
      layout.filter((entry) => entry.side === side).length,
    ])),
    { south: 8, east: 8, north: 8, west: 8 },
  );
});

test("3D layout still fits a 40-tile future Classic board without overlap positions", () => {
  const layout = createSquareRingLayout(nodes(40));
  const positions = new Set(layout.map((entry) => `${entry.x.toFixed(4)}:${entry.z.toFixed(4)}`));
  assert.equal(layout.length, 40);
  assert.equal(positions.size, 40);
  assert.ok(layout.every((entry) => entry.tileLength >= 1.5));
});

test("Classic renderer keeps the fixed orthographic quarter-view camera", () => {
  assert.equal(CLASSIC_CAMERA_PROFILE.projection, "orthographic");
  assert.equal(CLASSIC_CAMERA_PROFILE.interaction, "fixed");
  assert.equal(CLASSIC_CAMERA_PROFILE.view, "quarter");
  assert.deepEqual(CLASSIC_CAMERA_PROFILE.position, [18, 24, 22]);
  assert.ok(CLASSIC_CAMERA_PROFILE.baseViewSize >= 34);
});

test("orthographic bounds keep the board scale stable across aspect ratios", () => {
  const landscape = createOrthographicBounds(1600, 900);
  const portrait = createOrthographicBounds(390, 844);

  assert.equal(landscape.top - landscape.bottom, CLASSIC_CAMERA_PROFILE.baseViewSize);
  assert.equal(portrait.right - portrait.left, CLASSIC_CAMERA_PROFILE.baseViewSize);
  assert.ok(portrait.top - portrait.bottom > CLASSIC_CAMERA_PROFILE.baseViewSize);
});

test("visual foundation defines a bright toy-city style and keeps 30+ tile intent", () => {
  assert.equal(CLASSIC_VISUAL_PROFILE.style, "bright-toy-city");
  assert.ok(CLASSIC_VISUAL_PROFILE.boardMinimumTiles >= 30);
  assert.equal(CLASSIC_VISUAL_PROFILE.regions.length, 4);
  assert.ok(CLASSIC_VISUAL_PROFILE.palette.sky > 0);
  assert.ok(CLASSIC_VISUAL_PROFILE.palette.boardBase > 0);
});

test("Classic board gives tile cards more depth and limits unused center space", () => {
  assert.ok(CLASSIC_VISUAL_PROFILE.tileDepth >= 3);
  assert.ok(CLASSIC_VISUAL_PROFILE.centerInsetSize <= 16);
  assert.ok(CLASSIC_VISUAL_PROFILE.labelScale[0] >= 3);
  assert.ok(CLASSIC_VISUAL_PROFILE.labelScale[1] >= 1.2);
});

test("Classic property visuals vary by region and landmark archetype", () => {
  const tokyo = getClassicTileVisual({ id: "tokyo", type: "PROPERTY" }, 1);
  const paris = getClassicTileVisual({ id: "paris", type: "PROPERTY" }, 11);
  const rio = getClassicTileVisual({ id: "rio", type: "PROPERTY" }, 17);
  const dubai = getClassicTileVisual({ id: "dubai", type: "PROPERTY" }, 28);

  assert.equal(tokyo.region, "east");
  assert.equal(tokyo.landmark, "pagoda");
  assert.equal(paris.region, "europe");
  assert.equal(paris.landmark, "needle");
  assert.equal(rio.region, "america");
  assert.equal(rio.landmark, "arch");
  assert.equal(dubai.region, "world");
  assert.equal(dubai.landmark, "spire");
  assert.notEqual(tokyo.color, paris.color);
  assert.notEqual(paris.color, dubai.color);
});

test("special Classic tiles have dedicated toy props", () => {
  assert.equal(getClassicTileVisual({ id: "start", type: "START" }, 0).landmark, "start");
  assert.equal(getClassicTileVisual({ id: "event", type: "EVENT" }, 2).landmark, "balloon");
  assert.equal(getClassicTileVisual({ id: "tax", type: "TAX" }, 5).landmark, "airport");
  assert.equal(getClassicTileVisual({ id: "bonus", type: "BONUS" }, 13).landmark, "gift");
  assert.equal(getClassicTileVisual({ id: "rest", type: "REST" }, 8).landmark, "umbrella");
});

test("Three.js renderer is pinned to an explicit browser module version", () => {
  assert.match(THREE_IMPORT_VERSION, /^\d+\.\d+\.\d+$/);
});
