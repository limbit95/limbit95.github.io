import test from "node:test";
import assert from "node:assert/strict";

import {
  CLASSIC_RENDER_PROFILE,
  resolveClassicRendererPixelRatio,
} from "../js/renderer/threeClassicPrototype.js";
import {
  CLASSIC_RUNTIME_RENDER_PROFILE,
  installClassicPixelRatioPolicy,
  resolveClassicRuntimePixelRatio,
} from "../js/renderer/threeClassicPrototypeDiagnostics.js";

test("Classic renderer keeps full 2x density on mobile-sized boards", () => {
  assert.equal(resolveClassicRendererPixelRatio(430, 932, 3), 2);
  assert.equal(resolveClassicRuntimePixelRatio(2, 430, 932), 2);
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

test("Classic runtime policy lowers large viewport fill-rate without changing small-screen density", () => {
  const desktopWidth = 1920;
  const desktopHeight = 1080;
  const baseRatio = resolveClassicRendererPixelRatio(desktopWidth, desktopHeight, 2);
  const runtimeRatio = resolveClassicRuntimePixelRatio(baseRatio, desktopWidth, desktopHeight);
  const renderedPixels = desktopWidth * desktopHeight * (runtimeRatio ** 2);

  assert.ok(runtimeRatio < baseRatio);
  assert.ok(runtimeRatio < 1);
  assert.ok(renderedPixels <= CLASSIC_RUNTIME_RENDER_PROFILE.maxRenderPixels + 1);
  assert.equal(resolveClassicRuntimePixelRatio(2, 430, 932), 2);
});

test("Classic runtime pixel-ratio policy only affects the Classic WebGL canvas", () => {
  class FakeRenderer {
    constructor({ classic, width = 1920, height = 1080 }) {
      this.domElement = {
        classList: { contains: (name) => classic && name === "classic-three-canvas" },
        parentElement: { clientWidth: width, clientHeight: height },
        clientWidth: width,
        clientHeight: height,
      };
      this.pixelRatio = null;
    }

    setPixelRatio(value) {
      this.pixelRatio = value;
      return value;
    }
  }

  assert.equal(installClassicPixelRatioPolicy({ WebGLRenderer: FakeRenderer }), true);

  const classic = new FakeRenderer({ classic: true });
  classic.setPixelRatio(2);
  assert.ok(classic.pixelRatio < 1);

  const other = new FakeRenderer({ classic: false });
  other.setPixelRatio(2);
  assert.equal(other.pixelRatio, 2);
});

test("base Classic pixel-ratio helper retains its existing one-pixel floor", () => {
  assert.equal(resolveClassicRendererPixelRatio(3840, 2160, 2), 1);
});
