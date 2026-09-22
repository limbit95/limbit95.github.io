import test from "node:test";
import assert from "node:assert/strict";

import { getMarbleBootstrapMode, loadMarblePage } from "../js/marbleBootstrap.js";

function documentStub() {
  return { body: { dataset: {} } };
}

test("bootstrap classifies lobby, local play, online and 2D online independently", () => {
  assert.equal(getMarbleBootstrapMode("https://example.test/marble-game/"), "full");
  assert.equal(getMarbleBootstrapMode("https://example.test/marble-game/?play=classic"), "local-play");
  assert.equal(getMarbleBootstrapMode("https://example.test/marble-game/?play=classic&onlineRoom=room-1"), "online");
  assert.equal(getMarbleBootstrapMode("https://example.test/marble-game/?play=classic&onlineRoom=room-1&marbleVisuals=2d"), "online-2d");
});

test("dedicated local play loads only local gameplay modules", async () => {
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
    "./app.js?v=20260922-r6",
    "./diceCharge.js?v=20260910-r7",
    "./playWindow.js?v=20260922-r6",
    "./ownershipVisualLoader.js?v=20260910-r10",
  ]);
  assert.equal(imports.some((value) => value.includes("multiplayerLobby")), false);
  assert.equal(imports.some((value) => value.includes("onlineGameExit")), false);
  assert.equal(documentObject.body.dataset.marbleBootstrapRevision, "20260922-r6");
});
