import test from "node:test";
import assert from "node:assert/strict";

import {
  CLASSIC_CAMERA_PROFILE,
  createOrthographicBounds,
  createSquareRingLayout,
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

test("Classic prototype uses a fixed orthographic quarter-view camera", () => {
  assert.equal(CLASSIC_CAMERA_PROFILE.projection, "orthographic");
  assert.equal(CLASSIC_CAMERA_PROFILE.interaction, "fixed");
  assert.equal(CLASSIC_CAMERA_PROFILE.view, "quarter");
  assert.deepEqual(CLASSIC_CAMERA_PROFILE.position, [18, 24, 22]);
});

test("orthographic bounds keep the board scale stable across aspect ratios", () => {
  const landscape = createOrthographicBounds(1600, 900);
  const portrait = createOrthographicBounds(390, 844);

  assert.equal(landscape.top - landscape.bottom, CLASSIC_CAMERA_PROFILE.baseViewSize);
  assert.equal(portrait.right - portrait.left, CLASSIC_CAMERA_PROFILE.baseViewSize);
  assert.ok(portrait.top - portrait.bottom > CLASSIC_CAMERA_PROFILE.baseViewSize);
});

test("Three.js prototype is pinned to an explicit browser module version", () => {
  assert.match(THREE_IMPORT_VERSION, /^\d+\.\d+\.\d+$/);
});
