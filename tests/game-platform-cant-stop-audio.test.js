import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  installCantStopAudioUnlock,
  playCantStopBlizzardSound,
  playCantStopDiceRollSound,
} from "../games/cant-stop/audio.js";
import {
  CANT_STOP_BGM_MODE,
  createCantStopBgmSession,
  getCantStopBgmTrack,
} from "../games/cant-stop/bgm.js";

const cantStopIndex = readFileSync(
  new URL("../games/cant-stop/index.html", import.meta.url),
  "utf8",
);
const cantStopApp = readFileSync(
  new URL("../games/cant-stop/app.js", import.meta.url),
  "utf8",
);

test("Can't Stop audio helpers are safe when Web Audio is unavailable", async () => {
  assert.doesNotThrow(() => installCantStopAudioUnlock());
  assert.equal(await playCantStopDiceRollSound(), false);
  assert.equal(await playCantStopBlizzardSound(), false);
});


test("Can't Stop maps lobby and gameplay to verified BGM tracks", () => {
  const lobbyTrack = getCantStopBgmTrack(CANT_STOP_BGM_MODE.LOBBY);
  const playingTrack = getCantStopBgmTrack(CANT_STOP_BGM_MODE.PLAYING);

  assert.equal(lobbyTrack?.title, "Frozen Star");
  assert.equal(lobbyTrack?.isrc, "USUAN1100356");
  assert.equal(lobbyTrack?.license, "CC BY 4.0");
  assert.match(lobbyTrack?.sourceUrl ?? "", /incompetech\.com/u);

  assert.equal(playingTrack?.title, "Mountain Emperor");
  assert.equal(playingTrack?.isrc, "USUAN1700012");
  assert.equal(playingTrack?.license, "CC BY 4.0");
  assert.match(playingTrack?.sourceUrl ?? "", /incompetech\.com/u);
});

test("Can't Stop BGM session switches from lobby music to gameplay music and back", async () => {
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
  const session = createCantStopBgmSession({
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
  assert.equal(session.getController()?.track?.title, "Frozen Star");

  await session.setMode(CANT_STOP_BGM_MODE.PLAYING);
  assert.equal(session.getController()?.track?.title, "Mountain Emperor");

  await session.setMode(CANT_STOP_BGM_MODE.LOBBY);
  assert.equal(session.getController()?.track?.title, "Frozen Star");

  assert.deepEqual(calls.slice(0, 3), [
    ["start", "Frozen Star", true],
    ["switch", "Mountain Emperor", true],
    ["switch", "Frozen Star", true],
  ]);

  session.destroy();
  assert.equal(playerDestroyed, true);
  assert.deepEqual(calls.at(-1), ["destroy"]);
});

test("Can't Stop page wires the shared BGM player and authoritative playing-state switch", () => {
  assert.match(cantStopIndex, /game-bgm-player\.css/u);
  assert.match(cantStopApp, /createCantStopBgmSession/u);
  assert.match(
    cantStopApp,
    /state\.view === CANT_STOP_LOBBY_VIEW\.PLAYING[\s\S]*?CANT_STOP_BGM_MODE\.PLAYING/u,
  );
  assert.match(cantStopApp, /cantStopBgm\.destroy\(\)/u);
});
