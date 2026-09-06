import test from "node:test";
import assert from "node:assert/strict";

import {
  buildPopupFeatures,
  createClassicPlayUrl,
  getPopupRect,
  isClassicPlayUrl,
  launchClassicPlay,
  shouldUseSameTab,
} from "../js/playWindow.js";

test("Classic play URL keeps the page and adds play mode", () => {
  const url = createClassicPlayUrl("https://example.test/marble-game/?source=games");

  assert.equal(url.pathname, "/marble-game/");
  assert.equal(url.searchParams.get("source"), "games");
  assert.equal(url.searchParams.get("play"), "classic");
  assert.equal(isClassicPlayUrl(url.href), true);
});

test("compact or coarse-pointer devices stay in the current tab", () => {
  assert.equal(shouldUseSameTab({ innerWidth: 900, coarsePointer: false }), true);
  assert.equal(shouldUseSameTab({ innerWidth: 1200, coarsePointer: true }), true);
  assert.equal(shouldUseSameTab({ innerWidth: 1200, coarsePointer: false }), false);
});

test("popup rectangle uses most of the available desktop screen", () => {
  const rect = getPopupRect({
    availWidth: 1920,
    availHeight: 1080,
    availLeft: 100,
    availTop: 20,
  });

  assert.equal(rect.width, 1805);
  assert.equal(rect.height, 994);
  assert.ok(rect.left >= 100);
  assert.ok(rect.top >= 20);
  assert.ok(rect.left + rect.width <= 2020);
  assert.ok(rect.top + rect.height <= 1100);

  const features = buildPopupFeatures({ availWidth: 1920, availHeight: 1080 });
  assert.match(features, /popup=yes/);
  assert.match(features, /resizable=yes/);
  assert.match(features, /scrollbars=yes/);
});

test("desktop launch opens and focuses a dedicated play window", () => {
  let openedUrl = null;
  let focused = false;
  const popup = { focus: () => { focused = true; } };
  const locationObject = {
    href: "https://example.test/marble-game/",
    assign: () => assert.fail("desktop popup should not navigate the current tab"),
  };
  const windowObject = {
    innerWidth: 1440,
    matchMedia: () => ({ matches: false }),
    open: (url) => {
      openedUrl = url;
      return popup;
    },
  };

  const result = launchClassicPlay({
    windowObject,
    locationObject,
    screenObject: { availWidth: 1440, availHeight: 900 },
  });

  assert.equal(result, "popup");
  assert.equal(isClassicPlayUrl(openedUrl), true);
  assert.equal(focused, true);
});

test("blocked popup falls back to the current tab", () => {
  let assignedUrl = null;
  const locationObject = {
    href: "https://example.test/marble-game/",
    assign: (url) => { assignedUrl = url; },
  };
  const windowObject = {
    innerWidth: 1440,
    matchMedia: () => ({ matches: false }),
    open: () => null,
  };

  const result = launchClassicPlay({
    windowObject,
    locationObject,
    screenObject: { availWidth: 1440, availHeight: 900 },
  });

  assert.equal(result, "same-tab");
  assert.equal(isClassicPlayUrl(assignedUrl), true);
});
