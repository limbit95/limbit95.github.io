import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  createOnlineClassicPlayUrl,
  enterOnlineClassicPlay,
  getOnlineRoomId,
  reserveOnlineClassicPlayWindow,
} from "../js/onlinePlayRoute.js";

const lobbySource = readFileSync(new URL("../js/multiplayerLobby.js", import.meta.url), "utf8");

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

test("desktop game start can reserve a popup before the async server start finishes", () => {
  let reservedUrl = null;
  let reservedName = null;
  let navigatedUrl = null;
  const reservedWindow = {
    closed: false,
    location: { replace(url) { navigatedUrl = url; } },
    focus() {},
  };
  const windowObject = {
    innerWidth: 1440,
    matchMedia: () => ({ matches: false }),
    open(url, name) {
      reservedUrl = url;
      reservedName = name;
      return reservedWindow;
    },
  };
  const locationObject = {
    href: "https://example.test/marble-game/?room=ABC123",
    assign: () => assert.fail("reserved desktop popup must not replace the lobby tab"),
  };

  const popupWindow = reserveOnlineClassicPlayWindow({
    windowObject,
    screenObject: { availWidth: 1440, availHeight: 900 },
  });
  const result = enterOnlineClassicPlay("room-started", {
    windowObject,
    locationObject,
    popupWindow,
  });

  assert.equal(reservedUrl, "about:blank");
  assert.equal(reservedName, "marbleClassicPlay");
  assert.equal(result, "popup");
  assert.equal(getOnlineRoomId(navigatedUrl), "room-started");
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

test("blocked desktop popup leaves the lobby tab in place for an explicit retry", () => {
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

  assert.equal(result, "blocked");
  assert.equal(assignedUrl, null);
});

test("realtime game start keeps participants in the lobby until they click the play-window button", () => {
  assert.doesNotMatch(lobbySource, /enterStartedGameIfNeeded/);
  assert.match(lobbySource, /reserveOnlineClassicPlayWindow/);
  assert.match(lobbySource, /게임 플레이 창 열기/);
  assert.match(lobbySource, /게임이 시작됐습니다\. 버튼을 눌러 새 플레이 창에서 이어가 주세요/);
});
