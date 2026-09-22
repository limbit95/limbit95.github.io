import { getGameBgm } from "../../js/game-audio/bgmCatalog.js";
import { createBgmController } from "../../js/game-audio/bgmController.js";
import { mountBgmPlayer } from "../../js/game-audio/bgmPlayer.js";

const track = getGameBgm("the-game");

if (track) {
  const controller = createBgmController({ track });
  mountBgmPlayer({ controller });

  void controller.start({ autoplayRequested: true });

  document.addEventListener("the-game:game-started", () => {
    void controller.notifyGameStarted();
  });

  window.addEventListener("pagehide", () => controller.destroy(), { once: true });
}
