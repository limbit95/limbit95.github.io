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
import {
  BGM_STATE,
  createBgmController,
} from "../js/game-audio/bgmController.js";

class MemoryStorage {
  #values = new Map();

  getItem(key) {
    return this.#values.has(key) ? this.#values.get(key) : null;
  }

  setItem(key, value) {
    this.#values.set(key, String(value));
  }
}

class FakeInteractionTarget {
  listeners = new Map();

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(listener);
  }

  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
  }

  listenerCount(type) {
    return this.listeners.get(type)?.size ?? 0;
  }
}

class FakeAudio {
  src = "";
  preload = "";
  loop = false;
  volume = 1;
  playCalls = 0;
  pauseCalls = 0;

  play() {
    this.playCalls += 1;
    return Promise.resolve();
  }

  pause() {
    this.pauseCalls += 1;
  }
}

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

test("shared BGM controller switches Can't Stop tracks without resetting user playback ownership", async () => {
  const audio = new FakeAudio();
  const interactions = new FakeInteractionTarget();
  const controller = createBgmController({
    track: getCantStopBgmTrack(CANT_STOP_BGM_MODE.LOBBY),
    audioFactory: () => audio,
    interactionTarget: interactions,
    storage: new MemoryStorage(),
  });

  await controller.start({ autoplayRequested: true });
  assert.equal(controller.getState().track?.title, "Frozen Star");
  assert.equal(controller.getState().hasEverPlayed, true);
  assert.equal(audio.playCalls, 1);

  await controller.switchTrack(getCantStopBgmTrack(CANT_STOP_BGM_MODE.PLAYING));
  assert.equal(controller.getState().track?.title, "Mountain Emperor");
  assert.equal(controller.getState().status, BGM_STATE.PLAYING);
  assert.equal(controller.getState().hasEverPlayed, true);
  assert.equal(audio.playCalls, 2);
  assert.equal(interactions.listenerCount("pointerdown"), 0);

  controller.pauseByUser();
  const callsAfterPause = audio.playCalls;

  await controller.switchTrack(getCantStopBgmTrack(CANT_STOP_BGM_MODE.LOBBY));
  assert.equal(controller.getState().track?.title, "Frozen Star");
  assert.equal(controller.getState().status, BGM_STATE.PAUSED_BY_USER);
  assert.equal(controller.getState().userPaused, true);
  assert.equal(audio.playCalls, callsAfterPause);
  assert.equal(interactions.listenerCount("pointerdown"), 0);
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
