import test from "node:test";
import assert from "node:assert/strict";

import { getMarbleBootstrapMode, loadMarblePage } from "../js/marbleBootstrap.js";

function documentStub() {
  return { body: { dataset: {} } };
}

test("strict online 2D bootstrap evaluates only the play-window entry", async () => {
  const imports = [];
  const documentObject = documentStub();
  const mode = await loadMarblePage({
    href: "https://example.test/marble-game/?play=classic&onlineRoom=room-1&marbleVisuals=2d",
    documentObject,
    async importModule(specifier) { imports.push(specifier); return {}; },
  });

  assert.equal(mode, "online-2d");
  assert.deepEqual(imports, ["./playWindow.js?v=20260910-r10"]);
  assert.equal(documentObject.body.dataset.marbleBootstrapMode, "online-2d");
  assert.equal(documentObject.body.dataset.marbleBootstrapRevision, "20260910-r10");
});

test("normal online bootstrap skips the local playtest graph", async () => {
  const imports = [];
  const mode = await loadMarblePage({
    href: "https://example.test/marble-game/?play=classic&onlineRoom=room-1&marbleVisuals=main",
    documentObject: documentStub(),
    async importModule(specifier) { imports.push(specifier); return {}; },
  });

  assert.equal(mode, "online");
  assert.deepEqual(imports, [
    "./playWindow.js?v=20260910-r10",
    "./onlineGameExit.js?v=20260910-r10",
    "./ownershipVisualLoader.js?v=20260910-r10",
  ]);
  assert.equal(imports.some((specifier) => specifier.includes("app.js")), false);
  assert.equal(imports.some((specifier) => specifier.includes("diceCharge.js")), false);
});

test("lobby and local routes keep the existing full module graph", async () => {
  const imports = [];
  const mode = await loadMarblePage({
    href: "https://example.test/marble-game/",
    documentObject: documentStub(),
    async importModule(specifier) { imports.push(specifier); return {}; },
  });

  assert.equal(getMarbleBootstrapMode("https://example.test/marble-game/"), "full");
  assert.equal(mode, "full");
  assert.deepEqual(imports, [
    "./app.js?v=20260910-r7",
    "./multiplayerLobby.js?v=20260910-r7",
    "./diceCharge.js?v=20260910-r7",
    "./playWindow.js?v=20260910-r10",
    "./onlineGameExit.js?v=20260910-r10",
    "./ownershipVisualLoader.js?v=20260910-r10",
  ]);
});
