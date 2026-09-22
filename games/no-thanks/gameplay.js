function requireClient(client) {
  if (!client || typeof client.rpc !== "function") {
    throw new TypeError("No Thanks! gameplay requires a Supabase client.");
  }
  return client;
}

function requireText(value, field) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(`No Thanks! gameplay requires ${field}.`);
  }
  return value.trim();
}

function requireVersion(value) {
  if (!Number.isInteger(value) || value < 0) {
    throw new TypeError("No Thanks! gameplay expectedVersion must be a non-negative integer.");
  }
  return value;
}

async function callAction(client, {
  roomId,
  actionType,
  expectedVersion,
  clientActionId,
}) {
  const { data, error } = await client.rpc("no_thanks_play_action", {
    p_room_id: requireText(roomId, "roomId"),
    p_action_type: actionType,
    p_expected_version: requireVersion(expectedVersion),
    p_client_action_id: requireText(clientActionId, "clientActionId"),
  });
  if (error) throw error;
  return data ?? null;
}

export function createNoThanksGameplayAdapter({
  client,
} = {}) {
  const supabase = requireClient(client);

  return Object.freeze({
    refuseCard({
      roomId,
      expectedVersion,
      clientActionId,
    }) {
      return callAction(supabase, {
        roomId,
        actionType: "refuse_card",
        expectedVersion,
        clientActionId,
      });
    },

    takeCard({
      roomId,
      expectedVersion,
      clientActionId,
    }) {
      return callAction(supabase, {
        roomId,
        actionType: "take_card",
        expectedVersion,
        clientActionId,
      });
    },

    endGame({
      roomId,
      expectedVersion,
      clientActionId,
    }) {
      return callAction(supabase, {
        roomId,
        actionType: "end_game",
        expectedVersion,
        clientActionId,
      });
    },

    async prepareRematch({
      roomId,
      expectedVersion,
      clientActionId,
    }) {
      const { data, error } = await supabase.rpc("no_thanks_prepare_rematch", {
        p_room_id: requireText(roomId, "roomId"),
        p_expected_version: requireVersion(expectedVersion),
        p_client_action_id: requireText(clientActionId, "clientActionId"),
      });
      if (error) throw error;
      return data ?? null;
    },
  });
}
