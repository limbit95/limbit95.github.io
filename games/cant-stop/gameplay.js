function requireClient(client) {
  if (!client || typeof client.rpc !== "function") {
    throw new TypeError("Can't Stop gameplay requires a Supabase client.");
  }
  return client;
}

function requireText(value, field) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(`Can't Stop gameplay requires ${field}.`);
  }
  return value.trim();
}

function requireVersion(value) {
  if (!Number.isInteger(value) || value < 0) {
    throw new TypeError("Can't Stop gameplay expectedVersion must be a non-negative integer.");
  }
  return value;
}

function requireColumns(value, field, { exactLength = null } = {}) {
  if (!Array.isArray(value) || value.length < 1 || value.length > 2) {
    throw new TypeError(`Can't Stop gameplay ${field} must contain one or two columns.`);
  }
  if (exactLength !== null && value.length !== exactLength) {
    throw new TypeError(`Can't Stop gameplay ${field} must contain exactly ${exactLength} columns.`);
  }
  if (!value.every((column) => Number.isInteger(column) && column >= 2 && column <= 12)) {
    throw new TypeError(`Can't Stop gameplay ${field} columns must be integers from 2 to 12.`);
  }
  return [...value];
}

async function callRpc(client, name, args) {
  const { data, error } = await client.rpc(name, args);
  if (error) throw error;
  return data ?? null;
}

export function createCantStopGameplayAdapter({ client } = {}) {
  const supabase = requireClient(client);

  return Object.freeze({
    async rollDice({
      roomId,
      expectedVersion,
      clientActionId,
    }) {
      return callRpc(supabase, "cant_stop_roll_dice", {
        p_room_id: requireText(roomId, "roomId"),
        p_expected_version: requireVersion(expectedVersion),
        p_client_action_id: requireText(clientActionId, "clientActionId"),
      });
    },

    async choosePairing({
      roomId,
      sums,
      columns,
      expectedVersion,
      clientActionId,
    }) {
      return callRpc(supabase, "cant_stop_choose_pairing", {
        p_room_id: requireText(roomId, "roomId"),
        p_sums: requireColumns(sums, "sums", { exactLength: 2 }),
        p_columns: requireColumns(columns, "columns"),
        p_expected_version: requireVersion(expectedVersion),
        p_client_action_id: requireText(clientActionId, "clientActionId"),
      });
    },

    async continueTurn({
      roomId,
      expectedVersion,
      clientActionId,
    }) {
      return callRpc(supabase, "cant_stop_continue_turn", {
        p_room_id: requireText(roomId, "roomId"),
        p_expected_version: requireVersion(expectedVersion),
        p_client_action_id: requireText(clientActionId, "clientActionId"),
      });
    },

    async stopTurn({
      roomId,
      expectedVersion,
      clientActionId,
    }) {
      return callRpc(supabase, "cant_stop_stop_turn", {
        p_room_id: requireText(roomId, "roomId"),
        p_expected_version: requireVersion(expectedVersion),
        p_client_action_id: requireText(clientActionId, "clientActionId"),
      });
    },

    async prepareRematch({
      roomId,
      expectedVersion,
      clientActionId,
    }) {
      return callRpc(supabase, "cant_stop_prepare_rematch", {
        p_room_id: requireText(roomId, "roomId"),
        p_expected_version: requireVersion(expectedVersion),
        p_client_action_id: requireText(clientActionId, "clientActionId"),
      });
    },
  });
}
