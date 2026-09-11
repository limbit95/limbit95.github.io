import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const lobbySource = readFileSync(new URL("../js/multiplayerLobby.js", import.meta.url), "utf8");

test("restored playing room stays in lobby until the player opens the play window or ends the game", () => {
  assert.match(lobbySource, /if \(snapshot\.room\.status === "playing"\)/);
  assert.match(lobbySource, /startButton\.textContent = "게임 플레이 창 열기"/);
  assert.match(lobbySource, /게임이 시작됐습니다\. 버튼을 눌러 새 플레이 창에서 이어가 주세요/);
  assert.match(lobbySource, /enterOnlineClassicPlay\(roomId, \{ popupWindow: reservedPlayWindow \}\)/);
  assert.match(lobbySource, /leaveButton\.textContent = "진행 중 게임 종료"/);
});

test("active game recovery can end the server game without entering the play page", () => {
  assert.match(lobbySource, /getOnlineGameSnapshot/);
  assert.match(lobbySource, /endOnlineGame/);
  assert.match(lobbySource, /async function endCurrentGame\(\)/);
  assert.match(lobbySource, /진행 중이던 게임을 종료했습니다/);
});
