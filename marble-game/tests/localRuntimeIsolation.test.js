import test from "node:test";
import assert from "node:assert/strict";

import { getMarbleBootstrapMode, loadMarblePage } from "../js/marbleBootstrap.js";

function documentStub() {
  return { body: { dataset: {} } };
}

test("dedicated local play has its own bootstrap mode", () => {
  assert.equal(
    getMarbleBootstrapMode("https://example.test/marble-game/?play=classic"),
    "local-play",
  );
});

test("local play does not evaluate multiplayer or online lifecycle modules", async () => {
  const imports = [];
  const documentObject = documentStub();
  const mode = await loadMarblePage({
    href: "https://example.test/marble-game/?play=classic",
    documentObject,
    async importModule(specifier) {
      imports.push(specifier);
      return {};
    },
  });

  assert.equal(mode, "local-play");
  assert.deepEqual(imports, [
    "./app.js?v=20260919-r12",
    "./diceCharge.js?v=20260910-r7",
    "./playWindow.js?v=20260919-r12",
    "./ownershipVisualLoader.js?v=20260910-r10",
  ]);
  assert.equal(imports.some((specifier) => specifier.includes("multiplayerLobby")), false);
  assert.equal(imports.some((specifier) => specifier.includes("onlineGameExit")), false);
  assert.equal(imports.some((specifier) => specifier.includes("onlineSession")), false);
  assert.equal(documentObject.body.dataset.marbleBootstrapMode, "local-play");
});
