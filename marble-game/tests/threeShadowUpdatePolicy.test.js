import test from "node:test";
import assert from "node:assert/strict";

import { installClassicShadowUpdatePolicy } from "../js/renderer/threeClassicPrototypeDiagnostics.js";

test("Classic renderer freezes automatic shadow rebuilding after the first frame", () => {
  let renderCalls = 0;
  class FakeWebGLRenderer {}
  FakeWebGLRenderer.prototype.render = function render() {
    renderCalls += 1;
  };

  assert.equal(installClassicShadowUpdatePolicy({ WebGLRenderer: FakeWebGLRenderer }), true);

  const renderer = {
    domElement: {
      classList: { contains: (name) => name === "classic-three-canvas" },
      dataset: {},
    },
    shadowMap: { autoUpdate: true, needsUpdate: false },
  };

  FakeWebGLRenderer.prototype.render.call(renderer, {}, {});

  assert.equal(renderCalls, 1);
  assert.equal(renderer.shadowMap.autoUpdate, false);
  assert.equal(renderer.shadowMap.needsUpdate, true);
});

test("Classic shadow policy allows an explicit one-frame refresh", () => {
  class FakeWebGLRenderer {}
  FakeWebGLRenderer.prototype.render = function render() {};
  installClassicShadowUpdatePolicy({ WebGLRenderer: FakeWebGLRenderer });

  const renderer = {
    domElement: {
      classList: { contains: (name) => name === "classic-three-canvas" },
      dataset: { marbleShadowRefresh: "true" },
    },
    shadowMap: { autoUpdate: false, needsUpdate: false },
  };

  FakeWebGLRenderer.prototype.render.call(renderer, {}, {});

  assert.equal(renderer.shadowMap.needsUpdate, true);
  assert.equal(renderer.domElement.dataset.marbleShadowRefresh, undefined);
});

test("shadow optimization ignores non-Marble WebGL renderers", () => {
  class FakeWebGLRenderer {}
  FakeWebGLRenderer.prototype.render = function render() {};
  installClassicShadowUpdatePolicy({ WebGLRenderer: FakeWebGLRenderer });

  const renderer = {
    domElement: {
      classList: { contains: () => false },
      dataset: {},
    },
    shadowMap: { autoUpdate: true, needsUpdate: false },
  };

  FakeWebGLRenderer.prototype.render.call(renderer, {}, {});

  assert.equal(renderer.shadowMap.autoUpdate, true);
  assert.equal(renderer.shadowMap.needsUpdate, false);
});
