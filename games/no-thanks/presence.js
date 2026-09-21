function requireClient(client) {
  if (!client || typeof client.channel !== "function" || typeof client.removeChannel !== "function") {
    throw new TypeError("No Thanks! presence requires a Supabase Realtime client.");
  }
  return client;
}

function requireText(value, field) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(`No Thanks! presence requires ${field}.`);
  }
  return value.trim();
}

function defaultClientId() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `client-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function connectedUserIds(presenceState) {
  const ids = new Set();

  for (const presences of Object.values(presenceState ?? {})) {
    if (!Array.isArray(presences)) continue;
    for (const presence of presences) {
      if (typeof presence?.userId === "string" && presence.userId.trim()) {
        ids.add(presence.userId.trim());
      }
    }
  }

  return Object.freeze([...ids]);
}

export function createNoThanksPresenceAdapter({
  client,
  clientIdFactory = defaultClientId,
  now = () => new Date().toISOString(),
} = {}) {
  const supabase = requireClient(client);
  if (typeof clientIdFactory !== "function" || typeof now !== "function") {
    throw new TypeError("No Thanks! presence factories must be functions.");
  }

  return Object.freeze({
    subscribe({
      roomId,
      userId,
      onSync,
      onStatus = () => {},
    }) {
      const normalizedRoomId = requireText(roomId, "roomId");
      const normalizedUserId = requireText(userId, "userId");
      if (typeof onSync !== "function" || typeof onStatus !== "function") {
        throw new TypeError("No Thanks! presence callbacks must be functions.");
      }

      const clientId = requireText(clientIdFactory(), "clientId");
      let disposed = false;
      const channel = supabase.channel(
        `no-thanks-presence-${normalizedRoomId}`,
        {
          config: {
            presence: {
              key: clientId,
            },
          },
        },
      );

      channel
        .on("presence", { event: "sync" }, () => {
          if (disposed) return;
          onSync(connectedUserIds(channel.presenceState()));
        })
        .subscribe(async (status) => {
          if (disposed) return;

          if (status === "SUBSCRIBED") {
            onStatus("connected");
            const result = await channel.track({
              userId: normalizedUserId,
              onlineAt: now(),
            });
            if (disposed) return;
            if (result !== "ok") onStatus("error");
            return;
          }

          if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            onStatus("error");
            return;
          }

          if (status === "CLOSED") {
            onStatus("offline");
          }
        });

      return () => {
        if (disposed) return;
        disposed = true;
        if (typeof channel.untrack === "function") {
          void channel.untrack();
        }
        void supabase.removeChannel(channel);
      };
    },
  });
}
