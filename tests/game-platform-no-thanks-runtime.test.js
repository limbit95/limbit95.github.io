import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createNoThanksLobbyViewModel,
  getNoThanksLobbyErrorMessage,
} from "../games/no-thanks/runtimeModel.js";

function snapshot() {
  return {
    version: 7,
    room: {
      id: "room-1",
      roomCode: "ABC234",
      hostUserId: "host",
      status: "waiting",
      maxPlayers: 7,
    },
    players: [
      {
        userId: "host",
        displayName: "Host",
        seat: 0,
        isReady: false,
        cards: [],
      },
      {
        userId: "guest-a",
        displayName: "Guest A",
        seat: 1,
        isReady: true,
        cards: [12],
      },
      {
        userId: "guest-b",
        displayName: "Guest B",
        seat: 2,
        isReady: true,
        cards: [19, 20],
      },
    ],
    game: null,
    viewer: {
      playerId: "guest-a",
      counters: null,
    },
  };
}

test("No Thanks! lobby view derives start eligibility from authoritative roster", () => {
  const view = createNoThanksLobbyViewModel(snapshot(), "guest-a");

  assert.equal(view.roomCode, "ABC234");
  assert.equal(view.version, 7);
  assert.equal(view.playerCount, 3);
  assert.equal(view.isHost, false);
  assert.equal(view.isReady, true);
  assert.equal(view.canStart, true);
  assert.deepEqual(view.players[2].cards, [19, 20]);
});

test("No Thanks! lobby view exposes only viewer counter field supplied by snapshot", () => {
  const source = snapshot();
  source.room.status = "playing";
  source.viewer.counters = 11;
  source.game = {
    phase: "PLAYING",
    activePlayerId: "host",
    currentCard: 27,
    deckRemaining: 23,
  };

  const view = createNoThanksLobbyViewModel(source, "guest-a");

  assert.equal(view.viewerCounters, 11);
  assert.equal(view.currentCard, 27);
  assert.equal(view.deckRemaining, 23);
  assert.equal(
    view.players.some((player) => Object.hasOwn(player, "counters")),
    false,
  );
});

test("No Thanks! lobby errors map server contract failures to recovery copy", () => {
  assert.match(
    getNoThanksLobbyErrorMessage({ message: "VERSION_CONFLICT" }),
    /최신 상태/u,
  );
  assert.match(
    getNoThanksLobbyErrorMessage({ message: "PLAYER_COUNT_REQUIRED" }),
    /최소 3명/u,
  );
  assert.match(
    getNoThanksLobbyErrorMessage({ message: "ROOM_FULL" }),
    /인원이 모두 찼/u,
  );
});


test("No Thanks! gameplay view exposes turn and legal action state without other counters", () => {
  const source = snapshot();
  source.room.status = "playing";
  source.viewer.counters = 4;
  source.game = {
    phase: "PLAYING",
    turnOrder: ["host", "guest-a", "guest-b"],
    activePlayerId: "guest-a",
    currentCard: 27,
    centerCounters: 3,
    deckRemaining: 12,
    winners: [],
    finalScores: null,
  };

  const view = createNoThanksLobbyViewModel(source, "guest-a");

  assert.equal(view.isMyTurn, true);
  assert.equal(view.canRefuse, true);
  assert.equal(view.canTake, true);
  assert.equal(view.centerCounters, 3);
  assert.equal(view.activePlayerDisplayName, "Guest A");

  source.viewer.counters = 0;
  const forcedTake = createNoThanksLobbyViewModel(source, "guest-a");
  assert.equal(forcedTake.canRefuse, false);
  assert.equal(forcedTake.canTake, true);
});

test("No Thanks! result view sorts final scores and preserves joint winners", () => {
  const source = snapshot();
  source.room.status = "playing";
  source.viewer.counters = 5;
  source.game = {
    phase: "GAME_OVER",
    turnOrder: ["host", "guest-a", "guest-b"],
    activePlayerId: "guest-a",
    currentCard: null,
    centerCounters: 0,
    deckRemaining: 0,
    endReason: "LAST_CARD_TAKEN",
    finalScores: {
      host: 17,
      "guest-a": 9,
      "guest-b": 9,
    },
    winners: ["guest-a", "guest-b"],
  };

  const view = createNoThanksLobbyViewModel(source, "guest-a");

  assert.equal(view.gamePhase, "GAME_OVER");
  assert.deepEqual(view.winners, ["guest-a", "guest-b"]);
  assert.deepEqual(
    view.scoreboard.map(({ id, score, winner }) => ({ id, score, winner })),
    [
      { id: "guest-a", score: 9, winner: true },
      { id: "guest-b", score: 9, winner: true },
      { id: "host", score: 17, winner: false },
    ],
  );
  assert.equal(
    view.players.some((player) => Object.hasOwn(player, "counters")),
    false,
  );
});

test("No Thanks! gameplay errors explain turn and forced-take boundaries", () => {
  assert.match(
    getNoThanksLobbyErrorMessage({ message: "TURN_REQUIRED" }),
    /다른 플레이어/u,
  );
  assert.match(
    getNoThanksLobbyErrorMessage({ message: "TAKE_REQUIRED" }),
    /반드시 가져/u,
  );
});


test("No Thanks! presence marks disconnected host and active player without changing legal state", () => {
  const source = snapshot();
  source.room.status = "playing";
  source.viewer.counters = 7;
  source.game = {
    phase: "PLAYING",
    turnOrder: ["host", "guest-a", "guest-b"],
    activePlayerId: "host",
    currentCard: 18,
    centerCounters: 2,
    deckRemaining: 9,
    winners: [],
    finalScores: null,
  };

  const view = createNoThanksLobbyViewModel(source, "guest-a", {
    presenceReady: true,
    onlinePlayerIds: ["guest-a", "guest-b"],
  });

  assert.equal(view.hostConnected, false);
  assert.equal(view.activePlayerConnected, false);
  assert.equal(view.allPlayersConnected, false);
  assert.deepEqual(view.disconnectedPlayerNames, ["Host"]);
  assert.equal(view.canTake, false);
  assert.equal(view.players.find((player) => player.id === "host")?.connected, false);
});

test("No Thanks! presence never becomes an authoritative start rule", () => {
  const source = snapshot();

  const view = createNoThanksLobbyViewModel(source, "guest-a", {
    presenceReady: true,
    onlinePlayerIds: ["guest-a", "guest-b"],
  });

  assert.equal(view.hostConnected, false);
  assert.equal(view.canStart, true);
});
