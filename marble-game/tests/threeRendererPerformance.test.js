import test from "node:test";
import assert from "node:assert/strict";

import {
  CLASSIC_RENDER_PROFILE,
  resolveClassicRendererPixelRatio,
} from "../js/renderer/threeClassicPrototype.js";

test("Classic renderer keeps full 2x density on mobile-sized boards", () => {
  assert.equal(resolveClassicRendererPixelRatio(430, 932, 3), 2);
});

test("Classic renderer caps large desktop boards by the render pixel budget", () => {
  const width = 1440;
  const height = 900;
  const ratio = resolveClassicRendererPixelRatio(width, height, 2);
  const renderedPixels = width * height * (ratio ** 2);

  assert.ok(ratio >= 1);
  assert.ok(ratio < 2);
  assert.ok(renderedPixels <= CLASSIC_RENDER_PROFILE.maxRenderPixels + 1);
});

test("Classic renderer never drops below one CSS pixel per device pixel", () => {
  assert.equal(resolveClassicRendererPixelRatio(3840, 2160, 2), 1);
});
