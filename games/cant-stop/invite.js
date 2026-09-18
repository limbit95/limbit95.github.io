import {
  createGameRoomInvite,
  getRegisteredGame,
  resolveGameRoomInvite,
} from "../shared/index.js";
import { createInviteClient } from "../../js/invites/inviteApi.js";

export const CANT_STOP_GAME_ID = "cant-stop";
export const CANT_STOP_INVITE_EXPIRY_MINUTES = 360;

function requireClient(client) {
  if (!client || typeof client.rpc !== "function") {
    throw new TypeError("Can't Stop Invite requires a Supabase client.");
  }
  return client;
}

function requireText(value, field) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(`Can't Stop Invite requires ${field}.`);
  }
  return value.trim();
}

function inviteGame(getGame) {
  if (typeof getGame !== "function") {
    throw new TypeError("Can't Stop Invite requires getGame().");
  }
  return getGame(CANT_STOP_GAME_ID);
}

export function isCantStopInviteEnabled({
  getGame = getRegisteredGame,
} = {}) {
  const game = inviteGame(getGame);
  return Boolean(
    game
    && game.platform === "shared"
    && game.capabilities?.online === true
    && game.capabilities?.invite === true
  );
}

export function createCantStopInviteAdapter({
  client,
  getGame = getRegisteredGame,
} = {}) {
  const supabase = requireClient(client);
  const inviteClient = createInviteClient(supabase);

  async function createRoomInvite({
    roomId,
    expiresInMinutes = CANT_STOP_INVITE_EXPIRY_MINUTES,
  }) {
    return createGameRoomInvite(inviteClient, {
      gameId: CANT_STOP_GAME_ID,
      roomId: requireText(roomId, "roomId"),
      expiresInMinutes,
      metadata: {
        source: CANT_STOP_GAME_ID,
      },
    }, {
      getGame,
    });
  }

  async function joinRoomFromInvite({
    token,
    nickname,
  }) {
    const normalizedToken = requireText(token, "token").toLowerCase();
    const parsed = await resolveGameRoomInvite(inviteClient, {
      token: normalizedToken,
      expectedGameId: CANT_STOP_GAME_ID,
    }, {
      getGame,
    });

    const { data, error } = await supabase.rpc("cant_stop_join_room_by_invite", {
      p_invite_token: normalizedToken,
      p_nickname: requireText(nickname, "nickname"),
    });
    if (error) throw error;

    const snapshot = data ?? null;
    if (snapshot?.room?.id !== parsed.roomId) {
      throw new Error("GAME_INVITE_ROOM_MISMATCH");
    }
    return snapshot;
  }

  return Object.freeze({
    enabled: isCantStopInviteEnabled({ getGame }),
    createRoomInvite,
    joinRoomFromInvite,
  });
}
