import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  createAdaptiveRenderBudgetController,
  installClassicAdaptiveRenderPolicy,
  resolveAdaptivePixelRatio,
} from "../js/renderer/classicRenderPerformance.js";

const diagnosticsSource = readFileSync(
  new URL("../js/renderer/threeClassicPrototypeDiagnostics.js", import.meta.url),
  "utf8",
);

test("adaptive pixel ratio may go below native 1x when a full-screen board exceeds budget", () => {
  assert.equal(resolveAdaptivePixelRatio(1.05, 0.6), 0.63);
  assert.equal(resolveAdaptivePixelRatio(2, 1), 2);
  assert.equal(resolveAdaptivePixelRatio(1, 0.1), 0.55);
});

test("frame budget degrades quickly under sustained slow frames and recovers gradually", () => {
  const profile = {
    minScale: 0.55,
    maxScale: 1,
    slowFrameMs: 20,
    severeFrameMs: 27,
    recoverFrameMs: 17.5,
    sampleWindowFrames: 3,
    recoverSampleWindows: 2,
    slowStep: 0.1,
    severeStep: 0.2,
    recoverStep: 0.05,
    cooldownMs: 0,
    maxFrameGapMs: 120,
    minPixelRatio: 0.55,
  };
  const controller = createAdaptiveRenderBudgetController({ profile });

  controller.recordFrame(0);
  controller.recordFrame(30);
  controller.recordFrame(60);
  const degraded = controller.recordFrame(90);
  assert.equal(degraded.changed, true);
  assert.equal(degraded.scale, 0.8);

  controller.recordFrame(106);
  controller.recordFrame(122);
  controller.recordFrame(138);
  assert.equal(controller.scale, 0.8);
  controller.recordFrame(154);
  controller.recordFrame(170);
  const recovered = controller.recordFrame(186);
  assert.equal(recovered.changed, true);
  assert.ok(Math.abs(recovered.scale - 0.85) < 1e-9);
});

test("Classic WebGL policy wraps instance-owned render and leaves the dice canvas unchanged", () => {
  let now = 0;

  class FakeRenderer {
    constructor(className) {
      this.domElement = {
        clientWidth: 1920,
        clientHeight: 1080,
        width: 1920,
        height: 1080,
        dataset: {},
        classList: { contains: (name) => name === className },
      };
      this.pixelRatio = 1.05;
      this.info = { render: { calls: 180 } };
      this.renderCount = 0;
      this.render = () => {
        this.renderCount += 1;
        return this.renderCount;
      };
    }

    getPixelRatio() {
      return this.pixelRatio;
    }

    setPixelRatio(value) {
      this.pixelRatio = value;
    }
  }

  const threeModule = { WebGLRenderer: FakeRenderer };
  assert.equal(installClassicAdaptiveRenderPolicy(threeModule, {
    resolveBasePixelRatio: () => 1.05,
    windowObject: { devicePixelRatio: 2 },
    performanceObject: { now: () => now },
  }), true);

  const boardRenderer = new FakeRenderer("classic-three-canvas");
  assert.equal(Object.hasOwn(boardRenderer, "render"), true);
  for (let index = 0; index < 65; index += 1) {
    now += 30;
    boardRenderer.render();
  }

  assert.ok(boardRenderer.pixelRatio < 1);
  assert.ok(Number(boardRenderer.domElement.dataset.marbleRenderScale) < 1);
  assert.ok(Number(boardRenderer.domElement.dataset.marbleFps) > 0);
  assert.equal(boardRenderer.domElement.dataset.marbleDrawCalls, "180");

  const diceRenderer = new FakeRenderer("dice-three-canvas");
  const originalRatio = diceRenderer.pixelRatio;
  now += 30;
  diceRenderer.render();
  assert.equal(diceRenderer.pixelRatio, originalRatio);
  assert.deepEqual(diceRenderer.domElement.dataset, {});
});

test("Classic diagnostics installs adaptive and static-shadow policies through the instance interceptor", () => {
  assert.match(diagnosticsSource, /classicRenderPerformance\.js\?v=20260915-r1/);
  assert.match(diagnosticsSource, /installClassicAdaptiveRenderPolicy\(threeModule/);
  assert.match(diagnosticsSource, /installClassicRendererInstanceRenderPolicy\(/);
  assert.match(diagnosticsSource, /shadowMap\.autoUpdate = false/);
  assert.match(diagnosticsSource, /threeClassicPrototype\.js\?implementation=20260915-r1/);
});
