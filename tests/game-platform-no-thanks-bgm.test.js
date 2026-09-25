import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  NO_THANKS_BGM_MODE,
  createNoThanksBgmSession,
  getNoThanksBgmTrack,
} from "../games/no-thanks/bgm.js";

const noThanksIndex = readFileSync(
  new URL("../games/no-thanks/index.html", import.meta.url),
  "utf8",
);
const noThanksMain = readFileSync(
  new URL("../games/no-thanks/main.js", import.meta.url),
  "utf8",
);

test("No Thanks! maps lobby and gameplay to the selected BGM tracks", () => {
  const lobbyTrack = getNoThanksBgmTrack(NO_THANKS_BGM_MODE.LOBBY);
  const playingTrack = getNoThanksBgmTrack(NO_THANKS_BGM_MODE.PLAYING);

  assert.equal(lobbyTrack?.title, "Covert Affair");
  assert.equal(lobbyTrack?.isrc, "USUAN1100795");
  assert.equal(lobbyTrack?.license, "CC BY 4.0");
  assert.match(lobbyTrack?.sourceUrl ?? "", /incompetech\.com/u);

  assert.equal(playingTrack?.title, "Hard Boiled");
  assert.equal(playingTrack?.isrc, "USUAN1700076");
  assert.equal(playingTrack?.license, "CC BY 4.0");
  assert.match(playingTrack?.sourceUrl ?? "", /incompetech\.com/u);
});

test("No Thanks! BGM session switches between lobby and gameplay music", async () => {
  const calls = [];
  let currentTrack = null;
  const controller = {
    get track() {
      return currentTrack;
    },
    async start(options) {
      calls.push(["start", currentTrack?.title, options?.autoplayRequested]);
      return { track: currentTrack };
    },
    async switchTrack(track, options) {
      currentTrack = track;
      calls.push(["switch", currentTrack?.title, options?.autoplayRequested]);
      return true;
    },
    getState() {
      return { track: currentTrack };
    },
    destroy() {
      calls.push(["destroy"]);
    },
  };

  let playerDestroyed = false;
  const session = createNoThanksBgmSession({
    controllerFactory: ({ track }) => {
      currentTrack = track;
      return controller;
    },
    playerFactory: () => ({
      destroy() {
        playerDestroyed = true;
      },
    }),
    mount: {},
  });

  await session.start();
  assert.equal(session.getController()?.track?.title, "Covert Affair");

  await session.setMode(NO_THANKS_BGM_MODE.PLAYING);
  assert.equal(session.getController()?.track?.title, "Hard Boiled");

  await session.setMode(NO_THANKS_BGM_MODE.LOBBY);
  assert.equal(session.getController()?.track?.title, "Covert Affair");

  assert.deepEqual(calls.slice(0, 3), [
    ["start", "Covert Affair", true],
    ["switch", "Hard Boiled", true],
    ["switch", "Covert Affair", true],
  ]);

  session.destroy();
  assert.equal(playerDestroyed, true);
  assert.deepEqual(calls.at(-1), ["destroy"]);
});

test("No Thanks! page wires the shared BGM player to authoritative gameplay state", () => {
  assert.match(noThanksIndex, /game-bgm-player\.css/u);
  assert.match(noThanksMain, /createNoThanksBgmSession/u);
  assert.match(
    noThanksMain,
    /view\?\.gamePhase === "PLAYING"[\s\S]*?NO_THANKS_BGM_MODE\.PLAYING/u,
  );
  assert.match(noThanksMain, /NO_THANKS_BGM_MODE\.LOBBY/u);
  assert.match(noThanksMain, /!event\.persisted\) noThanksBgm\.destroy\(\)/u);
});
