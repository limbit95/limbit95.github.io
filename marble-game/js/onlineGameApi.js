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
  const bytes = new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes);
  else for (let index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((value) => value.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
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

export function forfeitOnlineGame(options) {
  return gameAction("marble_forfeit_game", options);
}

export function subscribeOnlineGame(roomId, { onChange, onStatus, channelScope = "session" } = {}) {
  const client = requireClient();
  const channel = client
    .channel(`marble-game:${roomId}:${channelScope}:${actionId()}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "marble_games", filter: `room_id=eq.${roomId}` },
      () => onChange?.(),
    )
    .subscribe((status, error) => onStatus?.(status, error));

  return () => client.removeChannel(channel);
}

export function subscribeOnlinePresence(roomId, { playerId, onSync, onStatus } = {}) {
  if (!playerId) throw new Error("PLAYER_ID_REQUIRED");
  const client = requireClient();
  const channel = client
    .channel(`marble-presence:${roomId}`, {
      config: { presence: { key: String(playerId) } },
    })
    .on("presence", { event: "sync" }, () => onSync?.(channel.presenceState()))
    .subscribe(async (status, error) => {
      onStatus?.(status, error);
      if (status !== "SUBSCRIBED") return;
      try {
        await channel.track({
          playerId: String(playerId),
          onlineAt: new Date().toISOString(),
        });
      } catch (trackError) {
        onStatus?.("PRESENCE_ERROR", trackError);
      }
    });

  return () => client.removeChannel(channel);
}
