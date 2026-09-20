import assert from "node:assert/strict";
import { test } from "node:test";

import {
  installCantStopAudioUnlock,
  playCantStopBlizzardSound,
  playCantStopDiceRollSound,
} from "../games/cant-stop/audio.js";

test("Can't Stop audio helpers are safe when Web Audio is unavailable", async () => {
  assert.doesNotThrow(() => installCantStopAudioUnlock());
  assert.equal(await playCantStopDiceRollSound(), false);
  assert.equal(await playCantStopBlizzardSound(), false);
});
