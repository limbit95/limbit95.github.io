import { isSupabaseClientReady, supabase } from "../../js/supabaseClient.js";
import { normalizeNickname, normalizeRoomCode } from "./multiplayerModel.js";

function requireClient() {
  if (!isSupabaseClientReady() || !supabase) {
    throw new Error("Supabase client is not ready.");
  }
  return supabase;
}

async function rpc(name, params = {}) {
  const client = requireClient();
  const { data, error } = await client.rpc(name, params);
  if (error) throw error;
  return data;
}

export async function getCurrentUser() {
  const client = requireClient();
  const { data, error } = await client.auth.getUser();
  if (error) throw error;
  return data.user ?? null;
}

export function createRoom({ nickname, maxPlayers = 4 }) {
  return rpc("marble_create_room", {
    p_nickname: normalizeNickname(nickname),
    p_max_players: Number(maxPlayers),
  });
}

export function joinRoom({ roomCode, nickname }) {
  return rpc("marble_join_room", {
    p_room_code: normalizeRoomCode(roomCode),
    p_nickname: normalizeNickname(nickname),
  });
}

export function getMyActiveRoom() {
  return rpc("marble_get_my_active_room");
}

export function getLobbySnapshot(roomId) {
  return rpc("marble_get_lobby_snapshot", { p_room_id: roomId });
}

export function setReady({ roomId, ready, expectedVersion }) {
  return rpc("marble_set_ready", {
    p_room_id: roomId,
    p_ready: Boolean(ready),
    p_expected_version: Number(expectedVersion),
  });
}

export function leaveRoom({ roomId, expectedVersion }) {
  return rpc("marble_leave_room", {
    p_room_id: roomId,
    p_expected_version: Number(expectedVersion),
  });
}

export function subscribeLobby(roomId, { onChange, onStatus } = {}) {
  const client = requireClient();
  const channel = client
    .channel(`marble-lobby:${roomId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "marble_rooms", filter: `id=eq.${roomId}` },
      () => onChange?.(),
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "marble_room_players", filter: `room_id=eq.${roomId}` },
      () => onChange?.(),
    )
    .subscribe((status, error) => onStatus?.(status, error));

  return () => client.removeChannel(channel);
}
