import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const lobbySource = readFileSync(new URL("../js/multiplayerLobby.js", import.meta.url), "utf8");

test("restored playing room stays in lobby until the player chooses resume or end", () => {
  assert.match(lobbySource, /let suppressPlayingAutoEnter = false/);
  assert.match(lobbySource, /suppressPlayingAutoEnter = activeRoom\.room\.status === "playing"/);
  assert.match(lobbySource, /if \(suppressPlayingAutoEnter\) return false/);
  assert.match(lobbySource, /startButton\.textContent = "게임 이어가기"/);
  assert.match(lobbySource, /leaveButton\.textContent = "진행 중 게임 종료"/);
});

test("active game recovery can end the server game without entering the play page", () => {
  assert.match(lobbySource, /getOnlineGameSnapshot/);
  assert.match(lobbySource, /endOnlineGame/);
  assert.match(lobbySource, /async function endCurrentGame\(\)/);
  assert.match(lobbySource, /진행 중이던 게임을 종료했습니다/);
});
