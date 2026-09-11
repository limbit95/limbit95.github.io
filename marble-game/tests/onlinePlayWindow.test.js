import test from "node:test";
import assert from "node:assert/strict";

import {
  createOnlineClassicPlayUrl,
  enterOnlineClassicPlay,
  getOnlineRoomId,
} from "../js/onlinePlayRoute.js";

test("online Classic play URL keeps room identity in dedicated play mode", () => {
  const url = createOnlineClassicPlayUrl(
    "https://example.test/marble-game/?room=ABC123&source=games",
    "room-uuid",
  );

  assert.equal(url.searchParams.get("play"), "classic");
  assert.equal(url.searchParams.get("onlineRoom"), "room-uuid");
  assert.equal(url.searchParams.get("marbleVisuals"), "full");
  assert.equal(url.searchParams.has("room"), false);
  assert.equal(getOnlineRoomId(url.href), "room-uuid");
});

test("desktop online entry opens the large Classic play popup without replacing the lobby tab", () => {
  let openedUrl = null;
  let openedName = null;
  let openedFeatures = null;
  let focused = false;
  const locationObject = {
    href: "https://example.test/marble-game/?room=ABC123",
    assign: () => assert.fail("desktop online play should use the Classic popup"),
  };
  const windowObject = {
    innerWidth: 1440,
    matchMedia: () => ({ matches: false }),
    open(url, name, features) {
      openedUrl = url;
      openedName = name;
      openedFeatures = features;
      return { focus: () => { focused = true; } };
    },
  };

  const result = enterOnlineClassicPlay("room-uuid", {
    windowObject,
    locationObject,
    screenObject: { availWidth: 1920, availHeight: 1080, availLeft: 0, availTop: 0 },
  });

  assert.equal(result, "popup");
  assert.equal(getOnlineRoomId(openedUrl), "room-uuid");
  assert.equal(openedName, "marbleClassicPlay");
  assert.match(openedFeatures, /popup=yes/);
  assert.match(openedFeatures, /width=1805/);
  assert.match(openedFeatures, /height=994/);
  assert.equal(focused, true);
});

test("compact online entry keeps the existing mobile same-tab behavior", () => {
  let assignedUrl = null;
  const locationObject = {
    href: "https://example.test/marble-game/",
    assign(url) { assignedUrl = url; },
  };
  const windowObject = {
    innerWidth: 430,
    matchMedia: () => ({ matches: true }),
    open: () => assert.fail("mobile online play should not open a popup"),
  };

  const result = enterOnlineClassicPlay("room-mobile", {
    windowObject,
    locationObject,
    screenObject: { availWidth: 430, availHeight: 932 },
  });

  assert.equal(result, "same-tab");
  assert.equal(getOnlineRoomId(assignedUrl), "room-mobile");
});

test("blocked desktop popup preserves the existing safe same-tab fallback", () => {
  let assignedUrl = null;
  const locationObject = {
    href: "https://example.test/marble-game/",
    assign(url) { assignedUrl = url; },
  };
  const windowObject = {
    innerWidth: 1440,
    matchMedia: () => ({ matches: false }),
    open: () => null,
  };

  const result = enterOnlineClassicPlay("room-fallback", {
    windowObject,
    locationObject,
    screenObject: { availWidth: 1440, availHeight: 900 },
  });

  assert.equal(result, "same-tab");
  assert.equal(getOnlineRoomId(assignedUrl), "room-fallback");
});
