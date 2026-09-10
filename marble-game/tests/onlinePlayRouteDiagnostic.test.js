import test from "node:test";
import assert from "node:assert/strict";

import { createOnlineClassicPlayUrl, enterOnlineClassicPlay } from "../js/onlinePlayRoute.js";

test("online lobby entry forces the strict 2D diagnostic route before the popup can hang", () => {
  const url = createOnlineClassicPlayUrl(
    "https://example.test/marble-game/?room=ABC123",
    "room-uuid",
  );

  assert.equal(url.searchParams.get("play"), "classic");
  assert.equal(url.searchParams.get("onlineRoom"), "room-uuid");
  assert.equal(url.searchParams.get("marbleVisuals"), "2d");
  assert.equal(url.searchParams.has("room"), false);
});

test("enterOnlineClassicPlay navigates to 2D mode without requiring popup URL editing", () => {
  let assignedHref = null;
  enterOnlineClassicPlay("room-uuid", {
    locationObject: {
      href: "https://example.test/marble-game/?room=ABC123",
      assign(href) { assignedHref = href; },
    },
  });

  const assignedUrl = new URL(assignedHref);
  assert.equal(assignedUrl.searchParams.get("marbleVisuals"), "2d");
});
