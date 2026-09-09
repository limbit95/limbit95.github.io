import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  lobbyReadySummary,
  normalizeNickname,
  normalizeRoomCode,
} from "../js/multiplayerModel.js";

const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const multiplayerApiSource = readFileSync(new URL("../js/multiplayerApi.js", import.meta.url), "utf8");
const lobbyMigration = readFileSync(
  new URL("../../supabase/marble/20260906113000_marble_multiplayer_lobby_foundation.sql", import.meta.url),
  "utf8",
);
const permissionsMigration = readFileSync(
  new URL("../../supabase/marble/20260906113200_marble_multiplayer_rpc_permissions.sql", import.meta.url),
  "utf8",
);
const roomCodeGenerationFixMigration = readFileSync(
  new URL("../../supabase/marble/20260906121500_marble_room_code_generation_fix.sql", import.meta.url),
  "utf8",
);

test("Marble multiplayer input helpers normalize room codes and nicknames", () => {
  assert.equal(normalizeRoomCode(" ab12-ef "), "AB12EF");
  assert.equal(normalizeRoomCode("ABCDEF123"), "ABCDEF");
  assert.equal(normalizeNickname("  플레이어 A  "), "플레이어 A");
  assert.equal(normalizeNickname("123456789012345678901234"), "12345678901234567890");
});

test("Classic lobby requires at least two ready players before a game can start", () => {
  const onePlayer = lobbyReadySummary({
    room: { status: "waiting" },
    players: [{ isReady: true }],
  });
  assert.equal(onePlayer.canStart, false);

  const readyLobby = lobbyReadySummary({
    room: { status: "waiting" },
    players: [{ isReady: true }, { isReady: true }],
  });
  assert.equal(readyLobby.canStart, true);

  const playingLobby = lobbyReadySummary({
    room: { status: "playing" },
    players: [{ isReady: true }, { isReady: true }],
  });
  assert.equal(playingLobby.canStart, false);
});

test("Marble page exposes the Phase 5A Supabase lobby entry without removing local play", () => {
  assert.match(indexHtml, /PHASE 5 · MULTIPLAYER FOUNDATION/);
  assert.match(indexHtml, /@supabase\/supabase-js@2/);
  assert.match(indexHtml, /data-multiplayer-entry/);
  assert.match(indexHtml, /data-create-room/);
  assert.match(indexHtml, /data-join-room/);
  assert.match(indexHtml, /data-room-ready/);
  assert.match(indexHtml, /\.\/js\/multiplayerLobby\.js/);
  assert.match(indexHtml, /data-start-playtest/);
});

test("Marble multiplayer API uses isolated RPC names and realtime room tables", () => {
  assert.match(multiplayerApiSource, /marble_create_room/);
  assert.match(multiplayerApiSource, /marble_join_room/);
  assert.match(multiplayerApiSource, /marble_get_my_active_room/);
  assert.match(multiplayerApiSource, /marble_get_lobby_snapshot/);
  assert.match(multiplayerApiSource, /marble_set_ready/);
  assert.match(multiplayerApiSource, /marble_leave_room/);
  assert.match(multiplayerApiSource, /table: "marble_rooms"/);
  assert.match(multiplayerApiSource, /table: "marble_room_players"/);
});

test("Marble lobby migration enforces 2-4 players, RLS and optimistic room versions", () => {
  assert.match(lobbyMigration, /max_players between 2 and 4/);
  assert.match(lobbyMigration, /alter table public\.marble_rooms enable row level security/);
  assert.match(lobbyMigration, /alter table public\.marble_room_players enable row level security/);
  assert.match(lobbyMigration, /VERSION_CONFLICT/);
  assert.match(lobbyMigration, /alter publication supabase_realtime add table public\.marble_rooms/);
  assert.match(lobbyMigration, /alter publication supabase_realtime add table public\.marble_room_players/);
});

test("Marble RPC permission migration keeps security-definer lobby functions away from anon", () => {
  assert.match(permissionsMigration, /revoke all on function public\.marble_create_room\(text, smallint\) from public, anon/);
  assert.match(permissionsMigration, /grant execute on function public\.marble_create_room\(text, smallint\) to authenticated/);
  assert.match(permissionsMigration, /revoke all on function public\.marble_join_room\(text, text\) from public, anon/);
});

test("Marble room code generation qualifies Supabase pgcrypto from the extensions schema", () => {
  assert.match(roomCodeGenerationFixMigration, /extensions\.gen_random_bytes\(4\)/);
  assert.match(roomCodeGenerationFixMigration, /revoke execute on function public\.marble_create_room\(text, smallint\) from anon/);
  assert.match(roomCodeGenerationFixMigration, /grant execute on function public\.marble_create_room\(text, smallint\) to authenticated/);
});
