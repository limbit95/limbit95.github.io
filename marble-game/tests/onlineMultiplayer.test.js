import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { mapOnlineGameSnapshot, isOnlineViewerTurn } from "../js/onlineSession.js";
import { createOnlineClassicPlayUrl, getOnlineRoomId } from "../js/onlinePlayRoute.js";

const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const lobbySource = readFileSync(new URL("../js/multiplayerLobby.js", import.meta.url), "utf8");
const apiSource = readFileSync(new URL("../js/onlineGameApi.js", import.meta.url), "utf8");
const appSource = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");

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
  assert.match(appSource, /createOnlineClassicSession/);
  assert.match(appSource, /getViewerPlayerId/);
});
