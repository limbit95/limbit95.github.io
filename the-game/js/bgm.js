import { getGameBgm } from "../../games/shared/audio/bgmCatalog.js";
import { createBgmController } from "../../games/shared/audio/bgmController.js";
import { consumeGameBgmIntent } from "../../games/shared/audio/bgmIntent.js";
import { mountBgmPlayer } from "../../games/shared/audio/bgmPlayer.js";

const track = getGameBgm("the-game");

if (track) {
  const controller = createBgmController({ track });
  mountBgmPlayer({ controller });

  const intent = consumeGameBgmIntent(track.gameId);
  void controller.start({
    autoplayRequested: intent?.autoplayRequested === true,
  });

  document.addEventListener("the-game:game-started", () => {
    void controller.notifyGameStarted();
  });

  window.addEventListener("pagehide", () => controller.destroy(), { once: true });
}
