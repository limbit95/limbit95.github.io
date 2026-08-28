import { supabase } from "./supabase.js";

async function rpc(name, params = {}) {
  const { data, error } = await supabase.rpc(name, params);
  if (error) throw error;
  return data;
}

export function createRoom({ nickname, maxPlayers }) {
  return rpc("the_game_create_room", {
    p_nickname: nickname,
    p_max_players: maxPlayers,
  });
}

export function joinRoom({ roomCode, nickname }) {
  return rpc("the_game_join_room", {
    p_room_code: roomCode,
    p_nickname: nickname,
  });
}

export function getMyActiveRoom() {
  return rpc("the_game_get_my_active_room");
}

export function getLobbySnapshot(roomId) {
  return rpc("the_game_get_lobby_snapshot", { p_room_id: roomId });
}

export function setReady({ roomId, ready, expectedVersion }) {
  return rpc("the_game_set_ready", {
    p_room_id: roomId,
    p_ready: ready,
    p_expected_version: expectedVersion,
  });
}

export function leaveRoom({ roomId, expectedVersion }) {
  return rpc("the_game_leave_room", {
    p_room_id: roomId,
    p_expected_version: expectedVersion,
  });
}

export function startGame({ roomId, expectedVersion }) {
  return rpc("the_game_start_game", {
    p_room_id: roomId,
    p_expected_version: expectedVersion,
  });
}

export function getGameSnapshot(roomId) {
  return rpc("the_game_get_game_snapshot", { p_room_id: roomId });
}

export function getMyActiveGame() {
  return rpc("the_game_get_my_active_game");
}

export function playCard({ roomId, card, pileId, expectedVersion, clientActionId }) {
  return rpc("the_game_play_card", {
    p_room_id: roomId,
    p_card: card,
    p_pile_id: pileId,
    p_expected_version: expectedVersion,
    p_client_action_id: clientActionId,
  });
}

export function endTurn({ roomId, expectedVersion, clientActionId }) {
  return rpc("the_game_end_turn", {
    p_room_id: roomId,
    p_expected_version: expectedVersion,
    p_client_action_id: clientActionId,
  });
}

export function closeGame({ roomId, expectedRoomVersion, expectedGameVersion }) {
  return rpc("the_game_close_game", {
    p_room_id: roomId,
    p_expected_room_version: expectedRoomVersion,
    p_expected_game_version: expectedGameVersion,
  });
}

export function subscribeLobby(roomId, { onChange, onStatus } = {}) {
  const channel = supabase
    .channel(`the-game-lobby:${roomId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "the_game_rooms", filter: `id=eq.${roomId}` },
      () => onChange?.(),
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "the_game_room_players", filter: `room_id=eq.${roomId}` },
      () => onChange?.(),
    )
    .subscribe((status, error) => onStatus?.(status, error));

  return () => supabase.removeChannel(channel);
}

export function subscribeGame({ gameId, roomId, onChange, onStatus } = {}) {
  const channel = supabase
    .channel(`the-game-play:${gameId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "the_game_games", filter: `id=eq.${gameId}` },
      () => onChange?.(),
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "the_game_game_players", filter: `game_id=eq.${gameId}` },
      () => onChange?.(),
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "the_game_rooms", filter: `id=eq.${roomId}` },
      () => onChange?.(),
    )
    .subscribe((status, error) => onStatus?.(status, error));

  return () => supabase.removeChannel(channel);
}
