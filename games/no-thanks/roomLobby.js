import { defineRoomLobbyAdapter } from "../shared/index.js";

function requireClient(client) {
  if (!client || typeof client.rpc !== "function" || typeof client.channel !== "function") {
    throw new TypeError("No Thanks! Room/Lobby requires a Supabase client.");
  }
  if (typeof client.removeChannel !== "function") {
    throw new TypeError("No Thanks! Room/Lobby requires removeChannel().");
  }
  return client;
}

function requireText(value, field) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(`No Thanks! Room/Lobby requires ${field}.`);
  }
  return value.trim();
}

function requireVersion(value) {
  if (!Number.isInteger(value) || value < 0) {
    throw new TypeError("No Thanks! Room/Lobby expectedVersion must be a non-negative integer.");
  }
  return value;
}

function requirePlayerLimit(value) {
  if (!Number.isInteger(value) || value < 3 || value > 7) {
    throw new TypeError("No Thanks! Room/Lobby maxPlayers must be an integer from 3 through 7.");
  }
  return value;
}

async function callRpc(client, name, args = {}) {
  const { data, error } = await client.rpc(name, args);
  if (error) throw error;
  return data ?? null;
}

export function createNoThanksRoomLobbyAdapter({
  client,
} = {}) {
  const supabase = requireClient(client);
  let activeRoomId = null;

  function rememberRoom(snapshot) {
    const roomId = snapshot?.room?.id;
    activeRoomId = typeof roomId === "string" && roomId.trim() ? roomId.trim() : null;
    return snapshot;
  }

  return defineRoomLobbyAdapter({
    async createRoom({
      maxPlayers = 7,
    } = {}) {
      const snapshot = await callRpc(supabase, "no_thanks_create_room", {
        p_max_players: requirePlayerLimit(maxPlayers),
      });
      return rememberRoom(snapshot);
    },

    async joinRoom({
      roomCode,
    }) {
      const snapshot = await callRpc(supabase, "no_thanks_join_room", {
        p_room_code: requireText(roomCode, "roomCode").toUpperCase(),
      });
      return rememberRoom(snapshot);
    },

    async getMyActiveRoom() {
      const snapshot = await callRpc(supabase, "no_thanks_get_my_active_room");
      return rememberRoom(snapshot);
    },

    async getLobbySnapshot({
      roomId,
    }) {
      const snapshot = await callRpc(supabase, "no_thanks_get_lobby_snapshot", {
        p_room_id: requireText(roomId, "roomId"),
      });
      return rememberRoom(snapshot);
    },

    async setReady({
      roomId,
      ready,
      expectedVersion,
      clientActionId,
    }) {
      const snapshot = await callRpc(supabase, "no_thanks_set_ready", {
        p_room_id: requireText(roomId, "roomId"),
        p_ready: ready === true,
        p_expected_version: requireVersion(expectedVersion),
        p_client_action_id: requireText(clientActionId, "clientActionId"),
      });
      return rememberRoom(snapshot);
    },

    async leaveRoom({
      roomId,
      expectedVersion,
    }) {
      const normalizedRoomId = requireText(roomId, "roomId");
      const result = await callRpc(supabase, "no_thanks_leave_room", {
        p_room_id: normalizedRoomId,
        p_expected_version: requireVersion(expectedVersion),
      });
      if (activeRoomId === normalizedRoomId) activeRoomId = null;
      return result;
    },

    async startGame({
      roomId,
      expectedVersion,
      clientActionId,
    }) {
      const snapshot = await callRpc(supabase, "no_thanks_start_game", {
        p_room_id: requireText(roomId, "roomId"),
        p_expected_version: requireVersion(expectedVersion),
        p_client_action_id: requireText(clientActionId, "clientActionId"),
      });
      return rememberRoom(snapshot);
    },

    subscribeInvalidation(listener) {
      if (typeof listener !== "function") {
        throw new TypeError("No Thanks! Room/Lobby invalidation listener must be a function.");
      }
      const roomId = requireText(activeRoomId, "active room before subscription");
      const notify = () => listener();

      const channel = supabase
        .channel(`no-thanks-room-${roomId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "no_thanks_rooms",
            filter: `id=eq.${roomId}`,
          },
          notify,
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "no_thanks_room_players",
            filter: `room_id=eq.${roomId}`,
          },
          notify,
        )
        .subscribe();

      return () => {
        void supabase.removeChannel(channel);
      };
    },
  });
}
