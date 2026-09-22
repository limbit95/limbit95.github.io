import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { getGameBgm } from "../../js/game-audio/bgmCatalog.js";
import {
  THE_GAME_BGM_MODE,
  createTheGameBgmSession,
  getTheGameBgmTrack,
} from "../js/bgm.js";
import {
  BGM_STATE,
  createBgmController,
} from "../../js/game-audio/bgmController.js";
import {
  readBgmVolume,
  writeBgmVolume,
} from "../../js/game-audio/bgmPreferences.js";

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

  dispatch(type, event = {}) {
    for (const listener of this.listeners.get(type) ?? []) {
      listener({ type, target: null, ...event });
    }
  }
}

class FakeAudio {
  src = "";
  preload = "";
  loop = false;
  volume = 1;
  playCalls = 0;
  pauseCalls = 0;
  outcomes = [];

  play() {
    this.playCalls += 1;
    const outcome = this.outcomes.shift();
    if (outcome instanceof Error) return Promise.reject(outcome);
    return Promise.resolve();
  }

  pause() {
    this.pauseCalls += 1;
  }
}

async function flush() {
  await Promise.resolve();
  await new Promise((resolve) => setImmediate(resolve));
}

test("The Game BGM catalog carries verified lobby and gameplay attribution metadata", () => {
  const lobbyTrack = getTheGameBgmTrack(THE_GAME_BGM_MODE.LOBBY);
  const gameplayTrack = getTheGameBgmTrack(THE_GAME_BGM_MODE.PLAYING);

  assert.equal(lobbyTrack?.title, "Constance");
  assert.equal(lobbyTrack?.artist, "Kevin MacLeod");
  assert.equal(lobbyTrack?.isrc, "USUAN1100850");
  assert.equal(lobbyTrack?.license, "CC BY 4.0");
  assert.equal(lobbyTrack?.defaultVolume, 0.7);
  assert.equal(lobbyTrack?.defaultOutputVolume, 0.6);
  assert.match(lobbyTrack?.sourceUrl ?? "", /incompetech\.com/u);

  assert.equal(gameplayTrack?.title, "Invariance");
  assert.equal(gameplayTrack?.artist, "Kevin MacLeod");
  assert.equal(gameplayTrack?.isrc, "USUAN1100847");
  assert.equal(gameplayTrack?.license, "CC BY 4.0");
  assert.equal(gameplayTrack?.defaultVolume, 0.7);
  assert.equal(gameplayTrack?.defaultOutputVolume, 0.6);
  assert.match(gameplayTrack?.sourceUrl ?? "", /incompetech\.com/u);
  assert.equal(gameplayTrack?.previewUrl, "https://www.youtube.com/watch?v=CpPQeDIA2S0");
  assert.equal(getGameBgm("missing"), null);
});

test("BGM volume is clamped and persisted", () => {
  const storage = new MemoryStorage();
  assert.equal(writeBgmVolume(0.35, { storage }), 0.35);
  assert.equal(readBgmVolume({ storage }), 0.35);
  assert.equal(writeBgmVolume(4, { storage }), 1);
  assert.equal(writeBgmVolume(-2, { storage }), 0);
});

test("BGM default slider and output volume are mapped independently", () => {
  const audio = new FakeAudio();
  const controller = createBgmController({
    track: getGameBgm("the-game"),
    audioFactory: () => audio,
    interactionTarget: new FakeInteractionTarget(),
    storage: new MemoryStorage(),
  });

  assert.equal(controller.getState().volume, 0.7);
  assert.equal(controller.getState().outputVolume, 0.6);
  assert.equal(audio.volume, 0.6);

  controller.setVolume(0.35);
  assert.equal(controller.getState().volume, 0.35);
  assert.equal(controller.getState().outputVolume, 0.3);
  assert.equal(audio.volume, 0.3);

  controller.setVolume(1);
  assert.equal(controller.getState().volume, 1);
  assert.equal(controller.getState().outputVolume, 1);
  assert.equal(audio.volume, 1);
});

test("The Game BGM session switches between lobby and gameplay tracks", async () => {
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
    async notifyGameStarted() {
      calls.push(["notifyGameStarted"]);
      return true;
    },
    getState() {
      return {
        track: currentTrack,
        hasEverPlayed: true,
        userPaused: false,
      };
    },
    destroy() {
      calls.push(["destroy"]);
    },
  };

  let playerDestroyed = false;
  const session = createTheGameBgmSession({
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
  assert.equal(session.getController()?.track?.title, "Constance");

  await session.setMode(THE_GAME_BGM_MODE.PLAYING);
  assert.equal(session.getController()?.track?.title, "Invariance");

  await session.setMode(THE_GAME_BGM_MODE.LOBBY);
  assert.equal(session.getController()?.track?.title, "Constance");

  assert.deepEqual(calls.slice(0, 3), [
    ["start", "Constance", true],
    ["switch", "Invariance", true],
    ["switch", "Constance", true],
  ]);

  session.destroy();
  assert.equal(playerDestroyed, true);
  assert.deepEqual(calls.at(-1), ["destroy"]);
});

test("The Game runtime emits and consumes lobby/game BGM presentation events", () => {
  const bgmSource = readFileSync(new URL("../js/bgm.js", import.meta.url), "utf8");
  const appSource = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");
  const lobbySource = readFileSync(new URL("../js/onlineLobby.js", import.meta.url), "utf8");

  assert.match(bgmSource, /the-game:lobby-entered/u);
  assert.match(bgmSource, /the-game:game-started/u);
  assert.match(appSource, /announceLobbyEntered\("mode"\)/u);
  assert.match(appSource, /announceLobbyEntered\("local-setup"\)/u);
  assert.match(lobbySource, /detail: \{ mode: "online-lobby" \}/u);
});

test("successful page-entry autoplay never installs global interaction listeners", async () => {
  const audio = new FakeAudio();
  const interactions = new FakeInteractionTarget();
  const controller = createBgmController({
    track: getGameBgm("the-game"),
    audioFactory: () => audio,
    interactionTarget: interactions,
    storage: new MemoryStorage(),
  });

  await controller.start({ autoplayRequested: true });

  assert.equal(controller.getState().status, BGM_STATE.PLAYING);
  assert.equal(controller.getState().hasEverPlayed, true);
  assert.equal(interactions.listenerCount("pointerdown"), 0);
  assert.equal(interactions.listenerCount("keydown"), 0);
  assert.equal(audio.playCalls, 1);
});

test("blocked page-entry autoplay retries on natural interaction then removes listeners", async () => {
  const audio = new FakeAudio();
  audio.outcomes.push(new Error("NotAllowedError"));
  const interactions = new FakeInteractionTarget();
  const controller = createBgmController({
    track: getGameBgm("the-game"),
    audioFactory: () => audio,
    interactionTarget: interactions,
    storage: new MemoryStorage(),
  });

  await controller.start({ autoplayRequested: true });
  assert.equal(controller.getState().status, BGM_STATE.WAITING_FOR_INTERACTION);
  assert.equal(interactions.listenerCount("pointerdown"), 1);

  interactions.dispatch("pointerdown");
  await flush();

  assert.equal(controller.getState().status, BGM_STATE.PLAYING);
  assert.equal(audio.playCalls, 2);
  assert.equal(interactions.listenerCount("pointerdown"), 0);
  assert.equal(interactions.listenerCount("keydown"), 0);
});

test("user pause after first playback cannot be undone by later game interactions", async () => {
  const audio = new FakeAudio();
  const interactions = new FakeInteractionTarget();
  const controller = createBgmController({
    track: getGameBgm("the-game"),
    audioFactory: () => audio,
    interactionTarget: interactions,
    storage: new MemoryStorage(),
  });

  await controller.start({ autoplayRequested: true });
  controller.pauseByUser();
  const callsAfterPause = audio.playCalls;

  interactions.dispatch("pointerdown");
  interactions.dispatch("keydown", { key: "Enter" });
  await flush();

  assert.equal(controller.getState().status, BGM_STATE.PAUSED_BY_USER);
  assert.equal(controller.getState().userPaused, true);
  assert.equal(audio.playCalls, callsAfterPause);
  assert.equal(interactions.listenerCount("pointerdown"), 0);
  assert.equal(interactions.listenerCount("keydown"), 0);
});

test("authoritative game start retries only while music has never played", async () => {
  const audio = new FakeAudio();
  audio.outcomes.push(new Error("NotAllowedError"), new Error("NotAllowedError"));
  const interactions = new FakeInteractionTarget();
  const controller = createBgmController({
    track: getGameBgm("the-game"),
    audioFactory: () => audio,
    interactionTarget: interactions,
    storage: new MemoryStorage(),
  });

  await controller.start({ autoplayRequested: true });
  assert.equal(await controller.notifyGameStarted(), false);
  assert.equal(controller.getState().status, BGM_STATE.NEEDS_INTERACTION);
  assert.equal(interactions.listenerCount("pointerdown"), 1);

  interactions.dispatch("pointerdown");
  await flush();
  assert.equal(controller.getState().status, BGM_STATE.PLAYING);

  controller.pauseByUser();
  const callsAfterPause = audio.playCalls;
  assert.equal(await controller.notifyGameStarted(), false);
  assert.equal(audio.playCalls, callsAfterPause);
});
