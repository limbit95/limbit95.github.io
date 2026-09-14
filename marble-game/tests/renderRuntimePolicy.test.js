import test from "node:test";
import assert from "node:assert/strict";

import {
  MARBLE_RENDER_RUNTIME_PROFILE,
  beginMarbleOverlayMotion,
  endMarbleOverlayMotion,
  isMarbleOverlayEventType,
  isMarbleOverlayMotionActive,
  shouldRenderMarbleFrame,
} from "../js/presentation/renderRuntimePolicy.js";
import { installClassicShadowUpdatePolicy } from "../js/renderer/threeClassicPrototypeDiagnostics.js";

test("Marble render runtime keeps idle WebGL work below full refresh rate", () => {
  const interval = MARBLE_RENDER_RUNTIME_PROFILE.idleFrameIntervalMs;
  assert.equal(interval, 50);
  assert.equal(shouldRenderMarbleFrame({ now: 0, lastRenderedAt: Number.NEGATIVE_INFINITY }), true);
  assert.equal(shouldRenderMarbleFrame({ now: interval - 1, lastRenderedAt: 0 }), false);
  assert.equal(shouldRenderMarbleFrame({ now: interval, lastRenderedAt: 0 }), true);
});

test("overlay VFX owns the GPU budget while board motion keeps priority", () => {
  assert.equal(shouldRenderMarbleFrame({
    now: 100,
    lastRenderedAt: 0,
    force: true,
    overlayActive: true,
  }), false);
  assert.equal(shouldRenderMarbleFrame({
    now: 100,
    lastRenderedAt: 0,
    force: true,
    motionActive: true,
    overlayActive: true,
  }), true);
});

test("overlay motion tracking is ref-counted and classifies presentation events", () => {
  assert.equal(isMarbleOverlayMotionActive(), false);
  assert.equal(isMarbleOverlayEventType("DICE_ROLLED"), true);
  assert.equal(isMarbleOverlayEventType("MONEY_PAID"), true);
  assert.equal(isMarbleOverlayEventType("PLAYER_MOVED"), false);

  beginMarbleOverlayMotion();
  beginMarbleOverlayMotion();
  assert.equal(isMarbleOverlayMotionActive(), true);
  endMarbleOverlayMotion();
  assert.equal(isMarbleOverlayMotionActive(), true);
  endMarbleOverlayMotion();
  assert.equal(isMarbleOverlayMotionActive(), false);
  endMarbleOverlayMotion();
  assert.equal(isMarbleOverlayMotionActive(), false);
});

test("active motion and forced state refreshes bypass the idle frame budget", () => {
  assert.equal(shouldRenderMarbleFrame({ now: 16, lastRenderedAt: 0, motionActive: true }), true);
  assert.equal(shouldRenderMarbleFrame({ now: 16, lastRenderedAt: 0, force: true }), true);
  assert.equal(shouldRenderMarbleFrame({
    now: 100,
    lastRenderedAt: 0,
    force: true,
    motionActive: true,
    visible: false,
  }), false);
});

test("Classic WebGL render policy throttles idle frames but preserves movement frames", () => {
  let now = 0;
  let renderCalls = 0;
  const ownerDocument = {
    visibilityState: "visible",
    defaultView: { performance: { now: () => now } },
  };

  class FakeRenderer {
    constructor() {
      this.domElement = {
        classList: { contains: (name) => name === "classic-three-canvas" },
        dataset: {},
        ownerDocument,
      };
      this.shadowMap = { autoUpdate: true, needsUpdate: false };
    }

    render() {
      renderCalls += 1;
      return renderCalls;
    }
  }

  assert.equal(installClassicShadowUpdatePolicy({ WebGLRenderer: FakeRenderer }), true);
  const renderer = new FakeRenderer();

  assert.equal(renderer.render(), 1);
  now = 16;
  assert.equal(renderer.render(), undefined);
  assert.equal(renderCalls, 1);

  now = 50;
  assert.equal(renderer.render(), 2);

  renderer.domElement.dataset.marbleMotionActive = "true";
  now = 66;
  assert.equal(renderer.render(), 3);

  delete renderer.domElement.dataset.marbleMotionActive;
  renderer.domElement.dataset.marbleRenderForce = "true";
  now = 82;
  assert.equal(renderer.render(), 4);
  assert.equal(renderer.domElement.dataset.marbleRenderForce, undefined);

  ownerDocument.visibilityState = "hidden";
  renderer.domElement.dataset.marbleRenderForce = "true";
  now = 132;
  assert.equal(renderer.render(), undefined);
  assert.equal(renderCalls, 4);
});
