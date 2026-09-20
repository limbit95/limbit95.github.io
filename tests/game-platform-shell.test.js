import assert from "node:assert/strict";
import { test } from "node:test";

import {
  GAME_CONNECTION_STATE,
  normalizeGamePlayers,
  resolveGameConnectionState,
} from "../games/shared/index.js";

test("game shell connection states expose stable platform presentation", () => {
  assert.deepEqual(resolveGameConnectionState({
    state: GAME_CONNECTION_STATE.RECONNECTING,
  }), {
    state: "reconnecting",
    label: "재연결 중",
    message: "최신 게임 상태를 다시 불러오고 있어요.",
    tone: "warning",
    busy: true,
  });

  assert.deepEqual(resolveGameConnectionState({
    state: GAME_CONNECTION_STATE.ERROR,
    message: "방 정보를 다시 불러오지 못했어요.",
  }), {
    state: "error",
    label: "연결 오류",
    message: "방 정보를 다시 불러오지 못했어요.",
    tone: "danger",
    busy: false,
  });

  assert.throws(
    () => resolveGameConnectionState({ state: "stalled" }),
    /Unsupported game connection state/u,
  );
});

test("game shell player normalization is game-rule agnostic", () => {
  const players = normalizeGamePlayers([
    {
      id: "user-1",
      displayName: "청파",
      ready: true,
      connected: true,
      seat: 2,
    },
    {
      id: "user-2",
      name: "같이",
      connected: false,
    },
  ], {
    currentUserId: "user-1",
    hostUserId: "user-2",
  });

  assert.deepEqual(players, [
    {
      id: "user-1",
      displayName: "청파",
      avatarUrl: null,
      ready: true,
      connected: true,
      isHost: false,
      isMe: true,
      seat: 2,
    },
    {
      id: "user-2",
      displayName: "같이",
      avatarUrl: null,
      ready: false,
      connected: false,
      isHost: true,
      isMe: false,
      seat: 1,
    },
  ]);

  assert.ok(Object.isFrozen(players));
  assert.ok(Object.isFrozen(players[0]));
});

test("game shell player normalization rejects duplicate platform identities", () => {
  assert.throws(
    () => normalizeGamePlayers([
      { id: "same-user", displayName: "A" },
      { id: "same-user", displayName: "B" },
    ]),
    /Duplicate game shell player id/u,
  );
});


test("game shell player normalization preserves optional status, turn, and accent presentation", () => {
  const [player] = normalizeGamePlayers([
    {
      id: "user-1",
      displayName: "청파",
      connected: true,
      statusLabel: "게임 중",
      turnLabel: "현재 턴",
      accent: "#1e90ff",
    },
  ], {
    currentUserId: "user-1",
    hostUserId: "user-1",
  });

  assert.equal(player.statusLabel, "게임 중");
  assert.equal(player.turnLabel, "현재 턴");
  assert.equal(player.accent, "#1e90ff");
  assert.equal(player.isMe, true);
  assert.equal(player.isHost, true);
});
