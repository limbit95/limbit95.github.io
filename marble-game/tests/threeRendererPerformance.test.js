import test from "node:test";
import assert from "node:assert/strict";

import {
  CLASSIC_RENDER_PROFILE,
  resolveClassicRendererPixelRatio,
} from "../js/renderer/threeClassicPrototype.js";
import {
  CLASSIC_RUNTIME_RENDER_PROFILE,
  DICE_RUNTIME_RENDER_PROFILE,
  installClassicPixelRatioPolicy,
  resolveClassicRuntimePixelRatio,
  resolveDiceRuntimePixelRatio,
} from "../js/renderer/threeClassicPrototypeDiagnostics.js";

test("Classic renderer keeps full 2x density on mobile-sized idle boards", () => {
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

test("Classic runtime lowers motion fill-rate below idle fill-rate", () => {
  const width = 1920;
  const height = 1080;
  const baseRatio = resolveClassicRendererPixelRatio(width, height, 2);
  const idleRatio = resolveClassicRuntimePixelRatio(baseRatio, width, height);
  const motionRatio = resolveClassicRuntimePixelRatio(baseRatio, width, height, { motionActive: true });
  const idlePixels = width * height * (idleRatio ** 2);
  const motionPixels = width * height * (motionRatio ** 2);

  assert.ok(idleRatio <= baseRatio);
  assert.ok(motionRatio < idleRatio);
  assert.ok(idlePixels <= CLASSIC_RUNTIME_RENDER_PROFILE.maxRenderPixels + 1);
  assert.ok(motionPixels <= CLASSIC_RUNTIME_RENDER_PROFILE.motionMaxRenderPixels + 1);
});

test("dice overlay keeps mobile density but caps full-screen desktop fill-rate", () => {
  assert.equal(resolveDiceRuntimePixelRatio(1.5, 430, 932), 1.5);

  const width = 1920;
  const height = 1080;
  const ratio = resolveDiceRuntimePixelRatio(1.5, width, height);
  const renderedPixels = width * height * (ratio ** 2);
  assert.ok(ratio < 1.5);
  assert.ok(renderedPixels <= DICE_RUNTIME_RENDER_PROFILE.maxRenderPixels + 1);
});

test("runtime pixel policy adapts Classic motion and late-bound dice canvases only", () => {
  class FakeRenderer {
    constructor({ canvasClass = "", width = 1920, height = 1080 } = {}) {
      this.domElement = {
        className: canvasClass,
        classList: {
          contains: (name) => this.domElement.className.split(/\s+/).includes(name),
        },
        dataset: {},
        parentElement: { clientWidth: width, clientHeight: height },
        clientWidth: width,
        clientHeight: height,
      };
      this.pixelRatio = 1;
      this.width = width;
      this.height = height;
    }

    setPixelRatio(value) {
      this.pixelRatio = value;
      return value;
    }

    getPixelRatio() {
      return this.pixelRatio;
    }

    setSize(width, height) {
      this.width = width;
      this.height = height;
      return this;
    }
  }

  assert.equal(installClassicPixelRatioPolicy({ WebGLRenderer: FakeRenderer }), true);

  const classic = new FakeRenderer({ canvasClass: "classic-three-canvas" });
  classic.setPixelRatio(2);
  const idleRatio = classic.pixelRatio;
  assert.ok(idleRatio < 1);

  classic.domElement.dataset.marbleMotionActive = "true";
  classic.setSize(1920, 1080, false);
  assert.ok(classic.pixelRatio < idleRatio);

  const dice = new FakeRenderer();
  dice.setPixelRatio(1.5);
  assert.equal(dice.pixelRatio, 1.5);
  dice.domElement.className = "dice-three-canvas";
  dice.setSize(1920, 1080, false);
  assert.ok(dice.pixelRatio < 1.5);
  assert.ok((1920 * 1080 * (dice.pixelRatio ** 2)) <= DICE_RUNTIME_RENDER_PROFILE.maxRenderPixels + 1);

  const other = new FakeRenderer({ canvasClass: "other-three-canvas" });
  other.setPixelRatio(2);
  other.setSize(1920, 1080, false);
  assert.equal(other.pixelRatio, 2);
});

test("base Classic pixel-ratio helper retains its existing one-pixel floor", () => {
  assert.equal(resolveClassicRendererPixelRatio(3840, 2160, 2), 1);
});
