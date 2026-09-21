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
