import assert from "node:assert/strict";
import { test } from "node:test";

import {
  getGameBgm,
  getGameBgmByEntryUrl,
} from "../games/shared/audio/bgmCatalog.js";
import {
  BGM_STATE,
  createBgmController,
} from "../games/shared/audio/bgmController.js";
import {
  BGM_INTENT_STORAGE_KEY,
  consumeGameBgmIntent,
  installGameBgmIntentCapture,
  writeGameBgmIntent,
} from "../games/shared/audio/bgmIntent.js";
import {
  readBgmVolume,
  writeBgmVolume,
} from "../games/shared/audio/bgmPreferences.js";

class MemoryStorage {
  #values = new Map();

  getItem(key) {
    return this.#values.has(key) ? this.#values.get(key) : null;
  }

  setItem(key, value) {
    this.#values.set(key, String(value));
  }

  removeItem(key) {
    this.#values.delete(key);
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

test("BGM catalog maps The Game entry and carries attribution metadata", () => {
  const track = getGameBgm("the-game");
  assert.equal(track?.title, "Invariance");
  assert.equal(track?.artist, "Kevin MacLeod");
  assert.equal(track?.license, "CC BY 4.0");
  assert.equal(getGameBgmByEntryUrl("https://limbit95.github.io/the-game/")?.gameId, "the-game");
  assert.equal(getGameBgmByEntryUrl("https://limbit95.github.io/marble-game/"), null);
});

test("game-list intent capture only records BGM-enabled primary links", () => {
  const storage = new MemoryStorage();
  const root = new FakeInteractionTarget();
  const uninstall = installGameBgmIntentCapture({ root, storage, now: () => 2000 });
  const anchor = {
    href: "https://limbit95.github.io/the-game/",
  };
  const target = {
    closest(selector) {
      return selector === "a[href]" ? anchor : null;
    },
  };

  root.dispatch("click", { target, button: 0, defaultPrevented: false });
  const saved = JSON.parse(storage.getItem(BGM_INTENT_STORAGE_KEY));
  assert.equal(saved.gameId, "the-game");

  uninstall();
  storage.removeItem(BGM_INTENT_STORAGE_KEY);
  root.dispatch("click", { target, button: 0, defaultPrevented: false });
  assert.equal(storage.getItem(BGM_INTENT_STORAGE_KEY), null);
});

test("BGM entry intent is one-shot and expires", () => {
  const storage = new MemoryStorage();
  assert.equal(writeGameBgmIntent("the-game", { storage, now: () => 1000 }), true);
  assert.ok(storage.getItem(BGM_INTENT_STORAGE_KEY));

  const intent = consumeGameBgmIntent("the-game", { storage, now: () => 1500 });
  assert.equal(intent?.autoplayRequested, true);
  assert.equal(consumeGameBgmIntent("the-game", { storage, now: () => 1600 }), null);

  writeGameBgmIntent("the-game", { storage, now: () => 1000 });
  assert.equal(consumeGameBgmIntent("the-game", { storage, now: () => 999999 }), null);
});

test("BGM volume is clamped and persisted", () => {
  const storage = new MemoryStorage();
  assert.equal(writeBgmVolume(0.35, { storage }), 0.35);
  assert.equal(readBgmVolume({ storage }), 0.35);
  assert.equal(writeBgmVolume(4, { storage }), 1);
  assert.equal(writeBgmVolume(-2, { storage }), 0);
});

test("successful entry autoplay never installs global interaction listeners", async () => {
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

test("blocked autoplay retries on natural interaction then permanently removes listeners", async () => {
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

test("user pause after first playback cannot be undone by later game clicks", async () => {
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
