import { getGameBgm } from "../../js/game-audio/bgmCatalog.js";
import { createBgmController } from "../../js/game-audio/bgmController.js";
import { mountBgmPlayer } from "../../js/game-audio/bgmPlayer.js";

export const NO_THANKS_BGM_MODE = Object.freeze({
  LOBBY: "lobby",
  PLAYING: "playing",
});

const TRACK_KEY_BY_MODE = Object.freeze({
  [NO_THANKS_BGM_MODE.LOBBY]: "no-thanks-lobby",
  [NO_THANKS_BGM_MODE.PLAYING]: "no-thanks-playing",
});

function normalizeMode(value) {
  return value === NO_THANKS_BGM_MODE.PLAYING
    ? NO_THANKS_BGM_MODE.PLAYING
    : NO_THANKS_BGM_MODE.LOBBY;
}

export function getNoThanksBgmTrack(mode) {
  return getGameBgm(TRACK_KEY_BY_MODE[normalizeMode(mode)]);
}

export function createNoThanksBgmSession({
  controllerFactory = createBgmController,
  playerFactory = mountBgmPlayer,
  mount = globalThis.document?.body ?? null,
} = {}) {
  let controller = null;
  let player = null;
  let mode = NO_THANKS_BGM_MODE.LOBBY;
  let started = false;
  let destroyed = false;
  let transition = Promise.resolve(null);

  function requireTrack(targetMode) {
    const track = getNoThanksBgmTrack(targetMode);
    if (!track) throw new Error(`Missing No Thanks! BGM track for mode: ${targetMode}`);
    return track;
  }

  function start() {
    if (destroyed || started) return transition;

    started = true;
    controller = controllerFactory({ track: requireTrack(mode) });
    player = playerFactory({ controller, mount });
    transition = Promise.resolve(controller.start({ autoplayRequested: true }));
    return transition;
  }

  function setMode(value) {
    mode = normalizeMode(value);
    if (destroyed || !started) return transition;

    transition = transition.then(async () => {
      if (destroyed || !controller) return null;
      const track = requireTrack(mode);
      if (controller.track?.src === track.src) return controller.getState();
      await controller.switchTrack(track, { autoplayRequested: true });
      return controller.getState();
    });

    return transition;
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    player?.destroy?.();
    controller?.destroy?.();
    player = null;
    controller = null;
  }

  return Object.freeze({
    start,
    setMode,
    destroy,
    getMode: () => mode,
    getController: () => controller,
  });
}
