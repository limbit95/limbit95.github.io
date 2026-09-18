import { getRegisteredGame } from "./registry.js";

export const GAME_ROOM_INVITE_TARGET = "game_room";
export const GAME_ROOM_INVITE_VERSION = 1;

const GAME_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const INVITE_TOKEN_PATTERN = /^[a-f0-9]{64}$/iu;

function nonEmptyText(value, field) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(`Game invite requires a non-empty ${field}.`);
  }
  return value.trim();
}

function metadataObject(value = {}) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError("Game invite metadata must be an object.");
  }
  return value;
}

function requireInviteClient(inviteClient, method) {
  if (typeof inviteClient?.[method] !== "function") {
    throw new TypeError(`Game invite client requires ${method}().`);
  }
  return inviteClient[method].bind(inviteClient);
}

function requirePlatformInviteGame(gameId, getGame) {
  const normalizedGameId = nonEmptyText(gameId, "gameId");
  if (!GAME_ID_PATTERN.test(normalizedGameId)) {
    throw new TypeError("Game invite gameId must be a lowercase kebab-case slug.");
  }

  const game = getGame(normalizedGameId);
  if (
    !game
    || game.platform !== "shared"
    || game.capabilities?.online !== true
    || game.capabilities?.invite !== true
  ) {
    throw new Error("GAME_INVITE_UNSUPPORTED_GAME");
  }

  return game;
}

function normalizedToken(token) {
  const value = nonEmptyText(token, "token");
  if (!INVITE_TOKEN_PATTERN.test(value)) {
    throw new TypeError("Game invite token must be a 64-character hex token.");
  }
  return value.toLowerCase();
}

export async function createGameRoomInvite(
  inviteClient,
  {
    gameId,
    roomId,
    expiresInMinutes = 360,
    metadata = {},
  },
  {
    getGame = getRegisteredGame,
  } = {},
) {
  const createInvite = requireInviteClient(inviteClient, "createInvite");
  const game = requirePlatformInviteGame(gameId, getGame);
  const targetId = nonEmptyText(roomId, "roomId");

  if (targetId.length > 256) {
    throw new TypeError("Game invite roomId must be 256 characters or fewer.");
  }
  if (!Number.isInteger(expiresInMinutes) || expiresInMinutes < 5 || expiresInMinutes > 43200) {
    throw new TypeError("Game invite expiry must be an integer between 5 and 43200 minutes.");
  }

  const customMetadata = metadataObject(metadata);
  return createInvite({
    targetType: GAME_ROOM_INVITE_TARGET,
    targetId,
    expiresInMinutes,
    metadata: {
      ...customMetadata,
      game_id: game.id,
      platform_version: GAME_ROOM_INVITE_VERSION,
    },
  });
}

export function parseGameRoomInvite(
  invite,
  {
    expectedGameId = null,
    getGame = getRegisteredGame,
  } = {},
) {
  if (!invite || typeof invite !== "object") {
    throw new TypeError("Game room invite must be an object.");
  }
  if (invite.target_type !== GAME_ROOM_INVITE_TARGET) {
    throw new Error("GAME_INVITE_TARGET_MISMATCH");
  }

  const metadata = metadataObject(invite.metadata);
  if (metadata.platform_version !== GAME_ROOM_INVITE_VERSION) {
    throw new Error("GAME_INVITE_VERSION_UNSUPPORTED");
  }

  const game = requirePlatformInviteGame(metadata.game_id, getGame);
  if (expectedGameId != null && game.id !== nonEmptyText(expectedGameId, "expectedGameId")) {
    throw new Error("GAME_INVITE_GAME_MISMATCH");
  }

  const roomId = nonEmptyText(invite.target_id, "roomId");
  return Object.freeze({
    game,
    gameId: game.id,
    roomId,
    version: GAME_ROOM_INVITE_VERSION,
    metadata: Object.freeze({ ...metadata }),
  });
}

export async function resolveGameRoomInvite(
  inviteClient,
  {
    token,
    expectedGameId = null,
  },
  options = {},
) {
  const resolveInvite = requireInviteClient(inviteClient, "resolveInvite");
  const normalized = normalizedToken(token);
  const invite = await resolveInvite(normalized);
  return parseGameRoomInvite(invite, {
    ...options,
    expectedGameId,
  });
}

export function buildGameRoomInviteDestination(
  invite,
  token,
  {
    origin = globalThis.location?.origin,
    getGame = getRegisteredGame,
  } = {},
) {
  const parsed = parseGameRoomInvite(invite, { getGame });
  const normalized = normalizedToken(token);
  const baseOrigin = nonEmptyText(origin, "origin");
  const target = new URL(parsed.game.href, `${baseOrigin.replace(/\/$/u, "")}/`);

  if (target.origin !== new URL(baseOrigin).origin) {
    throw new Error("GAME_INVITE_EXTERNAL_DESTINATION");
  }

  target.searchParams.set("invite", normalized);
  return target.href;
}
