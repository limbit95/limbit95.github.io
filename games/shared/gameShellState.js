export const GAME_CONNECTION_STATE = Object.freeze({
  CONNECTING: "connecting",
  CONNECTED: "connected",
  RECONNECTING: "reconnecting",
  OFFLINE: "offline",
  ERROR: "error",
});

const CONNECTION_PRESENTATION = Object.freeze({
  [GAME_CONNECTION_STATE.CONNECTING]: Object.freeze({
    label: "연결 중",
    message: "게임 서버와 연결하고 있어요.",
    tone: "info",
    busy: true,
  }),
  [GAME_CONNECTION_STATE.CONNECTED]: Object.freeze({
    label: "연결됨",
    message: "게임 상태가 최신 상태예요.",
    tone: "success",
    busy: false,
  }),
  [GAME_CONNECTION_STATE.RECONNECTING]: Object.freeze({
    label: "재연결 중",
    message: "최신 게임 상태를 다시 불러오고 있어요.",
    tone: "warning",
    busy: true,
  }),
  [GAME_CONNECTION_STATE.OFFLINE]: Object.freeze({
    label: "오프라인",
    message: "네트워크 연결을 확인해 주세요.",
    tone: "warning",
    busy: false,
  }),
  [GAME_CONNECTION_STATE.ERROR]: Object.freeze({
    label: "연결 오류",
    message: "게임 상태를 불러오지 못했어요.",
    tone: "danger",
    busy: false,
  }),
});

function nonEmptyText(value, field) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(`Game shell requires a non-empty ${field}.`);
  }
  return value.trim();
}

export function resolveGameConnectionState(connection = {}) {
  const state = connection.state ?? GAME_CONNECTION_STATE.CONNECTING;
  const presentation = CONNECTION_PRESENTATION[state];
  if (!presentation) {
    throw new TypeError(`Unsupported game connection state: ${state}`);
  }

  return Object.freeze({
    state,
    label: connection.label?.trim() || presentation.label,
    message: connection.message?.trim() || presentation.message,
    tone: presentation.tone,
    busy: presentation.busy,
  });
}

export function normalizeGamePlayers(players = [], {
  currentUserId = null,
  hostUserId = null,
} = {}) {
  if (!Array.isArray(players)) {
    throw new TypeError("Game shell players must be an array.");
  }

  const seen = new Set();
  const normalized = players.map((player, index) => {
    if (!player || typeof player !== "object") {
      throw new TypeError("Game shell player must be an object.");
    }

    const id = nonEmptyText(player.id, "player id");
    if (seen.has(id)) {
      throw new TypeError(`Duplicate game shell player id: ${id}`);
    }
    seen.add(id);

    const displayName = nonEmptyText(
      player.displayName ?? player.name ?? `플레이어 ${index + 1}`,
      "player displayName",
    );

    return Object.freeze({
      id,
      displayName,
      avatarUrl: typeof player.avatarUrl === "string" && player.avatarUrl.trim()
        ? player.avatarUrl.trim()
        : null,
      ready: player.ready === true,
      connected: player.connected !== false,
      isHost: id === hostUserId,
      isMe: id === currentUserId,
      seat: Number.isInteger(player.seat) && player.seat >= 0 ? player.seat : index,
    });
  });

  return Object.freeze(normalized);
}
