import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { createOnlineClassicPlayUrl, getOnlineRoomId } from "../js/onlinePlayRoute.js";

globalThis.window = {};
const { mapOnlineGameSnapshot, isOnlineViewerTurn } = await import("../js/onlineSession.js");
delete globalThis.window;

const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const bootstrapSource = readFileSync(new URL("../js/marbleBootstrap.js", import.meta.url), "utf8");
const lobbySource = readFileSync(new URL("../js/multiplayerLobby.js", import.meta.url), "utf8");
const apiSource = readFileSync(new URL("../js/onlineGameApi.js", import.meta.url), "utf8");
const controllerSource = readFileSync(new URL("../js/onlineGameController.js", import.meta.url), "utf8");
const exitSource = readFileSync(new URL("../js/onlineGameExit.js", import.meta.url), "utf8");
const playWindowSource = readFileSync(new URL("../js/playWindow.js", import.meta.url), "utf8");
const visibilityCss = readFileSync(new URL("../css/visibility-polish.css", import.meta.url), "utf8");
const gameEndCss = readFileSync(new URL("../css/online-game-controls.css", import.meta.url), "utf8");
const gameStartMigration = readFileSync(
  new URL("../../supabase/marble/20260906114753_marble_online_game_start.sql", import.meta.url),
  "utf8",
);
const turnActionsMigration = readFileSync(
  new URL("../../supabase/marble/20260906114947_marble_online_turn_actions.sql", import.meta.url),
  "utf8",
);
const reconnectMigration = readFileSync(
  new URL("../../supabase/marble/20260906115151_marble_online_reconnect_hardening.sql", import.meta.url),
  "utf8",
);
const gameEndMigration = readFileSync(
  new URL("../../supabase/marble/20260906150500_marble_online_game_end.sql", import.meta.url),
  "utf8",
);

function snapshot(overrides = {}) {
  return {
    room: { id: "room-1", roomCode: "ABC123", status: "playing", version: 3, currentGameId: "game-1" },
    game: {
      id: "game-1",
      status: "playing",
      phase: "WAITING_ROLL",
      turn: 4,
      currentSeat: 1,
      version: 7,
      pendingChoice: null,
      lastRoll: null,
      lastEvents: [],
      winnerPlayerId: null,
      rulesetVersion: 1,
    },
    players: [
      { id: "p1", userId: "u1", name: "A", seat: 0, positionNodeId: "start", money: 1500, bankrupt: false, skipTurns: 0 },
      { id: "p2", userId: "u2", name: "B", seat: 1, positionNodeId: "tokyo", money: 1200, bankrupt: false, skipTurns: 0 },
    ],
    properties: { tokyo: { ownerId: "p2", ownerSeat: 1, buildingLevel: 2 } },
    viewerUserId: "u2",
    viewerPlayerId: "p2",
    ...overrides,
  };
}

test("online snapshot maps server state into the existing Classic renderer state", () => {
  const state = mapOnlineGameSnapshot(snapshot());
  assert.equal(state.board.nodes.length, 32);
  assert.equal(state.currentPlayerIndex, 1);
  assert.equal(state.players[1].positionNodeId, "tokyo");
  assert.equal(state.boardState.properties.tokyo.ownerId, "p2");
  assert.equal(state.boardState.properties.tokyo.buildingLevel, 2);
  assert.equal(state.status, "PLAYING");
  assert.equal(isOnlineViewerTurn(state, "p2"), true);
  assert.equal(isOnlineViewerTurn(state, "p1"), false);
});

test("abandoned online game maps to a finished client state", () => {
  const abandoned = snapshot();
  abandoned.game = {
    ...abandoned.game,
    status: "abandoned",
    phase: "FINISHED",
    lastEvents: [{ type: "GAME_ABANDONED", playerId: "p2" }],
  };

  const state = mapOnlineGameSnapshot(abandoned);
  assert.equal(state.status, "FINISHED");
  assert.equal(state.phase, "FINISHED");
});

test("online play route keeps Classic play mode and room identity", () => {
  const url = createOnlineClassicPlayUrl("https://example.com/marble-game/?room=ABC123", "room-uuid");
  assert.equal(url.searchParams.get("play"), "classic");
  assert.equal(url.searchParams.get("onlineRoom"), "room-uuid");
  assert.equal(url.searchParams.has("room"), false);
  assert.equal(getOnlineRoomId(url.href), "room-uuid");
});

test("Phase 5B exposes host start and server-authoritative action RPCs", () => {
  assert.match(indexHtml, /data-room-start/);
  assert.match(lobbySource, /startOnlineGame/);
  assert.match(lobbySource, /enterOnlineClassicPlay/);
  assert.match(apiSource, /marble_start_game/);
  assert.match(apiSource, /marble_roll_dice/);
  assert.match(apiSource, /marble_buy_property/);
  assert.match(apiSource, /marble_build_property/);
  assert.match(apiSource, /marble_end_turn/);
  assert.match(apiSource, /table: "marble_games"/);
  assert.match(playWindowSource, /onlineGameController\.js/);
  assert.match(controllerSource, /createOnlineClassicSession/);
  assert.match(controllerSource, /getViewerPlayerId/);
  assert.match(controllerSource, /viewerCanAct/);
  assert.match(controllerSource, /createClassicTollNotice/);
});

test("online game can be explicitly ended and return every client to a fresh lobby", () => {
  assert.match(indexHtml, /data-online-game-controls/);
  assert.match(indexHtml, /data-end-online-game/);
  assert.match(indexHtml, /data-game-end-modal/);
  assert.match(bootstrapSource, /onlineGameExit\.js/);
  assert.match(apiSource, /marble_end_game/);
  assert.match(exitSource, /endOnlineGame/);
  assert.match(exitSource, /GAME_ABANDONED/);
  assert.match(exitSource, /GAME_SESSION_CLOSED/);
  assert.match(exitSource, /url\.searchParams\.delete\("onlineRoom"\)/);
  assert.match(exitSource, /새 방을 만들 수 있습니다/);
  assert.match(gameEndCss, /\.game-end-button/);
  assert.match(gameEndCss, /\.game-end-modal/);
  assert.match(gameEndMigration, /create or replace function public\.marble_end_game/);
  assert.match(gameEndMigration, /status = 'abandoned'/);
  assert.match(gameEndMigration, /set status = 'closed'/);
  assert.match(gameEndMigration, /grant execute on function public\.marble_end_game\(uuid,bigint\) to authenticated/);
});

test("online HUD anchors the viewer bottom-right and fills other corners in order", () => {
  assert.match(controllerSource, /OTHER_HUD_SLOTS = Object\.freeze\(\["top-left", "top-right", "bottom-left"\]\)/);
  assert.match(controllerSource, /slots\.set\(viewer\.id, "bottom-right"\)/);
  assert.match(controllerSource, /card\.dataset\.hudSlot = slots\.get\(player\.id\)/);
  assert.match(visibilityCss, /data-hud-slot="top-left"/);
  assert.match(visibilityCss, /data-hud-slot="top-right"/);
  assert.match(visibilityCss, /data-hud-slot="bottom-left"/);
  assert.match(visibilityCss, /data-hud-slot="bottom-right"/);
});

test("online dice result gets a readable pause before authoritative movement", () => {
  assert.match(indexHtml, /data-move-count-pop/);
  assert.match(controllerSource, /MOVE_COUNT_HOLD_MS = 1200/);
  assert.match(controllerSource, /await stage\?\.playRoll\(event\.dice\);/);
  assert.match(controllerSource, /await showMoveCount\([\s\S]*state\.lastRoll\?\.total\)/);
  assert.match(controllerSource, /`\$\{Number\(total\)\}칸 이동!`/);
});

test("online landing UX shows event results and stages skip before next turn", () => {
  assert.match(controllerSource, /landedNode\?\.type === "EVENT"/);
  assert.match(controllerSource, /openTileInfo\(state, landing\.nodeId, \{ source: "landing" \}\)/);
  assert.match(controllerSource, /let choiceDeclinedPending = false/);
  assert.match(controllerSource, /choiceDeclinedPending = true;\s*closeTileInfo\(\{ force: true \}\);\s*renderActionControls/);
  assert.match(controllerSource, /건너뛰기를 선택했습니다\. 다음 턴을 눌러 차례를 넘겨 주세요/);
});

test("online choice modal prevents unaffordable buys from closing the game flow", () => {
  assert.match(controllerSource, /actor\.money >= state\.pendingChoice\.price/);
  assert.match(controllerSource, /tileInfoActionButton\.disabled = !canAfford/);
  assert.match(controllerSource, /골드 부족 · \$\{money\(state\.pendingChoice\.price\)\} 필요/);
  assert.match(controllerSource, /message\.includes\("INSUFFICIENT_GOLD"\)/);
  assert.match(controllerSource, /if \(!isChoiceAction\) closeTileInfo/);
});

test("authoritative server migrations keep dice and turn decisions on Supabase", () => {
  assert.match(gameStartMigration, /create table public\.marble_games/);
  assert.match(gameStartMigration, /create or replace function public\.marble_start_game/);
  assert.match(gameStartMigration, /alter publication supabase_realtime add table public\.marble_games/);
  assert.match(turnActionsMigration, /floor\(random\(\)\*6\)\+1/);
  assert.match(turnActionsMigration, /NOT_YOUR_TURN/);
  assert.match(turnActionsMigration, /marble_action_log/);
  assert.match(turnActionsMigration, /marble_buy_property/);
  assert.match(turnActionsMigration, /marble_build_property/);
  assert.match(turnActionsMigration, /marble_end_turn/);
  assert.match(reconnectMigration, /marble_get_my_active_game/);
  assert.match(reconnectMigration, /GAME_IN_PROGRESS/);
});
