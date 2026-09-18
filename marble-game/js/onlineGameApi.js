import { isSupabaseClientReady, supabase } from "../../js/supabaseClient.js";

function requireClient() {
  if (!isSupabaseClientReady() || !supabase) throw new Error("Supabase client is not ready.");
  return supabase;
}

async function rpcWithClient(client, name, params = {}) {
  const { data, error } = await client.rpc(name, params);
  if (error) throw error;
  return data;
}

async function rpc(name, params = {}) {
  return rpcWithClient(requireClient(), name, params);
}

export function createOnlineActionId() {
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

export function endOnlineGame({ roomId, expectedVersion }) {
  return rpc("marble_end_game", {
    p_room_id: roomId,
    p_expected_version: Number(expectedVersion),
  });
}

function gameActionWithRpc(callRpc, name, { roomId, expectedVersion, clientActionId } = {}) {
  return callRpc(name, {
    p_room_id: roomId,
    p_expected_version: Number(expectedVersion),
    p_client_action_id: clientActionId ?? createOnlineActionId(),
  });
}

function gameAction(name, options) {
  return gameActionWithRpc(rpc, name, options);
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

export function declineOnlinePropertyForAuction(options) {
  return gameAction("marble_decline_property_for_auction", options);
}

export function requestOnlineAuction(options) {
  return gameAction("marble_request_auction", options);
}

export function closeOnlineAuctionRequest(options) {
  return gameAction("marble_close_auction_request", options);
}

function bidAuctionWithRpc(callRpc, { roomId, expectedVersion, clientActionId, amount = null, pass = false } = {}) {
  return callRpc("marble_auction_bid", {
    p_room_id: roomId,
    p_expected_version: Number(expectedVersion),
    p_client_action_id: clientActionId ?? createOnlineActionId(),
    p_amount: amount === null ? null : Number(amount),
    p_pass: pass === true,
  });
}

export function bidOnlineAuction(options) {
  return bidAuctionWithRpc(rpc, options);
}

function offerTradeWithRpc(callRpc, {
  roomId,
  expectedVersion,
  clientActionId,
  offerId,
  recipientPlayerId,
  terms,
} = {}) {
  const actionId = clientActionId ?? createOnlineActionId();
  return callRpc("marble_trade_offer", {
    p_room_id: roomId,
    p_expected_version: Number(expectedVersion),
    p_client_action_id: actionId,
    p_offer_id: offerId ?? actionId,
    p_recipient_player_id: recipientPlayerId,
    p_terms: terms,
  });
}

export function offerOnlineTrade(options) {
  return offerTradeWithRpc(rpc, options);
}

function resolveTradeWithRpc(callRpc, name, {
  roomId,
  expectedVersion,
  clientActionId,
  offerId,
} = {}) {
  return callRpc(name, {
    p_room_id: roomId,
    p_expected_version: Number(expectedVersion),
    p_client_action_id: clientActionId ?? createOnlineActionId(),
    p_offer_id: offerId,
  });
}

export function acceptOnlineTrade(options) {
  return resolveTradeWithRpc(rpc, "marble_trade_accept", options);
}

export function rejectOnlineTrade(options) {
  return resolveTradeWithRpc(rpc, "marble_trade_reject", options);
}

export function cancelOnlineTrade(options) {
  return resolveTradeWithRpc(rpc, "marble_trade_cancel", options);
}

function selectLiquidationWithRpc(callRpc, {
  roomId,
  expectedVersion,
  clientActionId,
  assetIds = [],
} = {}) {
  return callRpc("marble_liquidation_select", {
    p_room_id: roomId,
    p_expected_version: Number(expectedVersion),
    p_client_action_id: clientActionId ?? createOnlineActionId(),
    p_asset_ids: Array.isArray(assetIds) ? assetIds : [],
  });
}

export function selectOnlineLiquidation(options) {
  return selectLiquidationWithRpc(rpc, options);
}

export function confirmOnlineLiquidation(options) {
  return gameActionWithRpc(rpc, "marble_liquidation_confirm", options);
}

function subscribeOnlineGameWithClient(client, roomId, { onChange, onStatus, channelScope = "session" } = {}) {
  const channel = client
    .channel(`marble-game:${roomId}:${channelScope}:${createOnlineActionId()}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "marble_games", filter: `room_id=eq.${roomId}` },
      () => onChange?.(),
    )
    .subscribe((status, error) => onStatus?.(status, error));

  return () => client.removeChannel(channel);
}

export function subscribeOnlineGame(roomId, options) {
  return subscribeOnlineGameWithClient(requireClient(), roomId, options);
}

export function createOnlineGameApi({ client } = {}) {
  if (!client?.rpc || !client?.channel || !client?.removeChannel) {
    throw new Error("SUPABASE_CLIENT_REQUIRED");
  }
  const callRpc = (name, params) => rpcWithClient(client, name, params);
  return Object.freeze({
    createActionId: createOnlineActionId,
    getSnapshot(roomId) {
      return callRpc("marble_get_game_snapshot", { p_room_id: roomId });
    },
    declinePropertyForAuction(options) {
      return gameActionWithRpc(callRpc, "marble_decline_property_for_auction", options);
    },
    requestAuction(options) {
      return gameActionWithRpc(callRpc, "marble_request_auction", options);
    },
    closeAuctionRequest(options) {
      return gameActionWithRpc(callRpc, "marble_close_auction_request", options);
    },
    bidAuction(options) {
      return bidAuctionWithRpc(callRpc, options);
    },
    offerTrade(options) {
      return offerTradeWithRpc(callRpc, options);
    },
    acceptTrade(options) {
      return resolveTradeWithRpc(callRpc, "marble_trade_accept", options);
    },
    rejectTrade(options) {
      return resolveTradeWithRpc(callRpc, "marble_trade_reject", options);
    },
    cancelTrade(options) {
      return resolveTradeWithRpc(callRpc, "marble_trade_cancel", options);
    },
    selectLiquidation(options) {
      return selectLiquidationWithRpc(callRpc, options);
    },
    confirmLiquidation(options) {
      return gameActionWithRpc(callRpc, "marble_liquidation_confirm", options);
    },
    subscribeGame(roomId, options) {
      return subscribeOnlineGameWithClient(client, roomId, options);
    },
  });
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
