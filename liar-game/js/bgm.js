import { getGameBgm } from "../../js/game-audio/bgmCatalog.js";
import { createBgmController } from "../../js/game-audio/bgmController.js";
import { mountBgmPlayer } from "../../js/game-audio/bgmPlayer.js";

const track = getGameBgm("liar-game");

if (track) {
  const controller = createBgmController({ track });
  const player = mountBgmPlayer({ controller });

  void controller.start({ autoplayRequested: true });

  window.addEventListener("pagehide", () => {
    player?.destroy();
    controller.destroy();
  }, { once: true });
}
