import { readBgmVolume, writeBgmVolume } from "./bgmPreferences.js";

export const BGM_STATE = Object.freeze({
  IDLE: "idle",
  READY: "ready",
  WAITING_FOR_INTERACTION: "waiting-for-interaction",
  PLAYING: "playing",
  PAUSED_BY_USER: "paused-by-user",
  NEEDS_INTERACTION: "needs-interaction",
  ERROR: "error",
});

function createDefaultAudio() {
  if (typeof globalThis.Audio !== "function") {
    throw new Error("BGM requires the browser Audio API.");
  }
  return new globalThis.Audio();
}

function canUseAsInteractionTarget(value) {
  return value && typeof value.addEventListener === "function" && typeof value.removeEventListener === "function";
}

function isPlayerUiEvent(event) {
  return Boolean(event?.target?.closest?.("[data-game-bgm-player]"));
}

function isUsefulKeyboardActivation(event) {
  if (event?.type !== "keydown") return true;
  return event.key === "Enter" || event.key === " ";
}

function mapOutputVolume(volume, defaultVolume, defaultOutputMultiplier) {
  const logicalVolume = Math.min(1, Math.max(0, Number(volume) || 0));
  const pivot = Math.min(1, Math.max(0, Number(defaultVolume) || 0));
  const multiplier = Number.isFinite(Number(defaultOutputMultiplier))
    ? Math.max(0, Number(defaultOutputMultiplier))
    : 1;

  if (multiplier === 1 || pivot <= 0 || logicalVolume <= pivot) {
    return Math.min(1, logicalVolume * multiplier);
  }

  const boostedPivot = Math.min(1, pivot * multiplier);
  if (pivot >= 1 || boostedPivot >= 1) return 1;

  const progress = (logicalVolume - pivot) / (1 - pivot);
  return boostedPivot + ((1 - boostedPivot) * progress);
}

export function createBgmController({
  track,
  audioFactory = createDefaultAudio,
  interactionTarget = globalThis.document,
  storage = null,
} = {}) {
  if (!track?.src || !track?.gameId) {
    throw new TypeError("BGM controller requires a track with gameId and src.");
  }

  const audio = audioFactory();
  audio.src = track.src;
  audio.preload = "auto";
  audio.loop = track.loop !== false;

  const defaultVolume = Number(track.defaultVolume);
  const defaultOutputMultiplier = Number(track.defaultOutputMultiplier);
  let volume = readBgmVolume({ storage, fallback: defaultVolume });

  function applyOutputVolume() {
    audio.volume = mapOutputVolume(volume, defaultVolume, defaultOutputMultiplier);
  }

  applyOutputVolume();

  const listeners = new Set();
  let status = BGM_STATE.IDLE;
  let hasEverPlayed = false;
  let userPaused = false;
  let interactionBound = false;
  let playInFlight = false;
  let destroyed = false;
  let lastError = null;

  function snapshot() {
    return Object.freeze({
      status,
      hasEverPlayed,
      userPaused,
      volume,
      outputVolume: Number(audio.volume),
      interactionBound,
      lastError,
    });
  }

  function emit() {
    const state = snapshot();
    for (const listener of listeners) listener(state);
    return state;
  }

  function setStatus(nextStatus, error = null) {
    status = nextStatus;
    lastError = error;
    return emit();
  }

  function removeInteractionListeners() {
    if (!interactionBound || !canUseAsInteractionTarget(interactionTarget)) return;
    interactionTarget.removeEventListener("pointerdown", onInteraction, true);
    interactionTarget.removeEventListener("keydown", onInteraction, true);
    interactionBound = false;
  }

  function installInteractionListeners() {
    if (
      destroyed
      || hasEverPlayed
      || userPaused
      || interactionBound
      || !canUseAsInteractionTarget(interactionTarget)
    ) return;

    interactionTarget.addEventListener("pointerdown", onInteraction, true);
    interactionTarget.addEventListener("keydown", onInteraction, true);
    interactionBound = true;
  }

  async function tryPlay(source = "automatic") {
    if (destroyed || playInFlight) return false;
    if (userPaused && source !== "player") return false;

    playInFlight = true;
    try {
      await audio.play();
      hasEverPlayed = true;
      userPaused = false;
      removeInteractionListeners();
      setStatus(BGM_STATE.PLAYING);
      return true;
    } catch (error) {
      if (!hasEverPlayed && !userPaused) {
        status = source === "game-start"
          ? BGM_STATE.NEEDS_INTERACTION
          : BGM_STATE.WAITING_FOR_INTERACTION;
        lastError = error;
        installInteractionListeners();
        emit();
      } else {
        setStatus(BGM_STATE.ERROR, error);
      }
      return false;
    } finally {
      playInFlight = false;
    }
  }

  function onInteraction(event) {
    if (destroyed || hasEverPlayed || userPaused || playInFlight) return;
    if (isPlayerUiEvent(event) || !isUsefulKeyboardActivation(event)) return;
    void tryPlay("interaction");
  }

  async function start({ autoplayRequested = false } = {}) {
    if (destroyed) return snapshot();
    setStatus(BGM_STATE.READY);
    if (autoplayRequested) {
      await tryPlay("entry");
    } else {
      setStatus(BGM_STATE.WAITING_FOR_INTERACTION);
      installInteractionListeners();
      emit();
    }
    return snapshot();
  }

  async function notifyGameStarted() {
    if (destroyed || status === BGM_STATE.PLAYING || userPaused || hasEverPlayed) {
      return false;
    }
    return tryPlay("game-start");
  }

  function pauseByUser() {
    if (destroyed) return snapshot();
    userPaused = true;
    removeInteractionListeners();
    try {
      audio.pause();
    } catch {
      // Audio pause is best-effort during teardown or browser interruption.
    }
    return setStatus(BGM_STATE.PAUSED_BY_USER);
  }

  async function playByUser() {
    if (destroyed) return false;
    userPaused = false;
    return tryPlay("player");
  }

  async function toggleByUser() {
    return status === BGM_STATE.PLAYING
      ? (pauseByUser(), false)
      : playByUser();
  }

  function setVolume(value) {
    if (destroyed) return volume;
    volume = writeBgmVolume(value, { storage });
    applyOutputVolume();
    emit();
    return volume;
  }

  function subscribe(listener) {
    if (typeof listener !== "function") return () => {};
    listeners.add(listener);
    listener(snapshot());
    return () => listeners.delete(listener);
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    removeInteractionListeners();
    listeners.clear();
    try {
      audio.pause();
    } catch {
      // No-op.
    }
  }

  return Object.freeze({
    track,
    start,
    notifyGameStarted,
    pauseByUser,
    playByUser,
    toggleByUser,
    setVolume,
    subscribe,
    getState: snapshot,
    destroy,
  });
}
