import { getGameBgm } from "../../js/game-audio/bgmCatalog.js";
import { createBgmController } from "../../js/game-audio/bgmController.js";
import { mountBgmPlayer } from "../../js/game-audio/bgmPlayer.js";

export const THE_GAME_BGM_MODE = Object.freeze({
  LOBBY: "lobby",
  PLAYING: "playing",
});

const TRACK_KEY_BY_MODE = Object.freeze({
  [THE_GAME_BGM_MODE.LOBBY]: "the-game-lobby",
  [THE_GAME_BGM_MODE.PLAYING]: "the-game",
});

function normalizeMode(value) {
  return value === THE_GAME_BGM_MODE.PLAYING
    ? THE_GAME_BGM_MODE.PLAYING
    : THE_GAME_BGM_MODE.LOBBY;
}

export function getTheGameBgmTrack(mode) {
  return getGameBgm(TRACK_KEY_BY_MODE[normalizeMode(mode)]);
}

export function createTheGameBgmSession({
  controllerFactory = createBgmController,
  playerFactory = mountBgmPlayer,
  mount = globalThis.document?.body ?? null,
} = {}) {
  let controller = null;
  let player = null;
  let mode = THE_GAME_BGM_MODE.LOBBY;
  let started = false;
  let destroyed = false;
  let transition = Promise.resolve(null);

  function requireTrack(targetMode) {
    const track = getTheGameBgmTrack(targetMode);
    if (!track) throw new Error(`Missing The Game BGM track for mode: ${targetMode}`);
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

      const played = await controller.switchTrack(track, { autoplayRequested: true });
      if (
        !played
        && mode === THE_GAME_BGM_MODE.PLAYING
        && controller.getState().hasEverPlayed === false
        && controller.getState().userPaused === false
      ) {
        await controller.notifyGameStarted();
      }
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

if (typeof document !== "undefined" && typeof window !== "undefined") {
  const session = createTheGameBgmSession();

  const enterLobby = () => {
    void session.setMode(THE_GAME_BGM_MODE.LOBBY);
  };
  const enterGame = () => {
    void session.setMode(THE_GAME_BGM_MODE.PLAYING);
  };

  document.addEventListener("the-game:lobby-entered", enterLobby);
  document.addEventListener("the-game:return-home", enterLobby);
  document.addEventListener("the-game:game-started", enterGame);

  void session.start();

  window.addEventListener("pagehide", () => {
    document.removeEventListener("the-game:lobby-entered", enterLobby);
    document.removeEventListener("the-game:return-home", enterLobby);
    document.removeEventListener("the-game:game-started", enterGame);
    session.destroy();
  }, { once: true });
}
