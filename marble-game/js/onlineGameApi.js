import { isSupabaseClientReady, supabase } from "../../js/supabaseClient.js";

function requireClient() {
  if (!isSupabaseClientReady() || !supabase) throw new Error("Supabase client is not ready.");
  return supabase;
}

async function rpc(name, params = {}) {
  const client = requireClient();
  const { data, error } = await client.rpc(name, params);
  if (error) throw error;
  return data;
}

function actionId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function startOnlineGame({ roomId, expectedVersion }) {
  return rpc("marble_start_game", {
    p_room_id: roomId,
    p_expected_version: Number(expectedVersion),
  });
}

export function getOnlineGameSnapshot(roomId) {
  return rpc("marble_get_game_snapshot", { p_room_id: roomId });
}

export function getMyActiveOnlineGame() {
  return rpc("marble_get_my_active_game");
}

function gameAction(name, { roomId, expectedVersion }) {
  return rpc(name, {
    p_room_id: roomId,
    p_expected_version: Number(expectedVersion),
    p_client_action_id: actionId(),
  });
}

export function rollOnlineDice(options) {
  return gameAction("marble_roll_dice", options);
}

export function buyOnlineProperty(options) {
  return gameAction("marble_buy_property", options);
}

export function buildOnlineProperty(options) {
  return gameAction("marble_build_property", options);
}

export function endOnlineTurn(options) {
  return gameAction("marble_end_turn", options);
}

export function subscribeOnlineGame(roomId, { onChange, onStatus } = {}) {
  const client = requireClient();
  const channel = client
    .channel(`marble-game:${roomId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "marble_games", filter: `room_id=eq.${roomId}` },
      () => onChange?.(),
    )
    .subscribe((status, error) => onStatus?.(status, error));

  return () => client.removeChannel(channel);
}
