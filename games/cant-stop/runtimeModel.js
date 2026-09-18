import { GAME_ACCESS_REASON } from "../shared/accessGate.js";
import { CANT_STOP_COLUMN_HEIGHTS } from "./rules.js";

export const CANT_STOP_ACCESS_VIEW = Object.freeze({
  READY: "ready",
  AUTHENTICATION_REQUIRED: "authentication_required",
  APPROVAL_REQUIRED: "approval_required",
});

export function resolveCantStopAccessView(access) {
  if (access?.allowed === true) return CANT_STOP_ACCESS_VIEW.READY;
  if (access?.reason === GAME_ACCESS_REASON.AUTHENTICATION_REQUIRED) {
    return CANT_STOP_ACCESS_VIEW.AUTHENTICATION_REQUIRED;
  }
  if (access?.reason === GAME_ACCESS_REASON.APPROVAL_REQUIRED) {
    return CANT_STOP_ACCESS_VIEW.APPROVAL_REQUIRED;
  }
  throw new TypeError("Unsupported Can't Stop access state.");
}

export function createCantStopBoardColumns() {
  return Object.freeze(
    Object.entries(CANT_STOP_COLUMN_HEIGHTS).map(([number, height]) => Object.freeze({
      number: Number(number),
      height,
    })),
  );
}

export function createCantStopShellPlayer(authState) {
  const userId = authState?.user?.id;
  if (typeof userId !== "string" || !userId.trim()) {
    throw new TypeError("Can't Stop shell player requires an authenticated user.");
  }

  const displayName = authState?.profile?.display_name?.trim() || "플레이어";
  return Object.freeze({
    id: userId.trim(),
    displayName,
    connected: true,
    ready: false,
  });
}


export function createCantStopLobbyViewModel(snapshot, currentUserId) {
  if (!snapshot?.room || !Array.isArray(snapshot.players)) {
    throw new TypeError("Can't Stop lobby view requires an authoritative room snapshot.");
  }

  const viewerId = snapshot.viewerUserId ?? currentUserId;
  const viewer = snapshot.players.find((player) => player.userId === viewerId || player.id === viewerId);
  if (!viewer) {
    throw new TypeError("Can't Stop lobby snapshot does not include the current player.");
  }

  const players = snapshot.players.map((player, index) => Object.freeze({
    id: String(player.userId ?? player.id),
    displayName: String(player.displayName ?? player.nickname ?? `플레이어 ${index + 1}`),
    ready: player.isReady === true,
    connected: player.connected !== false,
    seat: Number.isInteger(player.seat) ? player.seat : index,
  }));

  return Object.freeze({
    roomId: String(snapshot.room.id),
    roomCode: String(snapshot.room.roomCode),
    status: String(snapshot.room.status),
    version: Number(snapshot.version),
    maxPlayers: Number(snapshot.room.maxPlayers),
    playerCount: Number(snapshot.room.playerCount ?? players.length),
    canStart: snapshot.room.canStart === true,
    hostUserId: String(snapshot.room.hostUserId),
    currentUserId: String(viewerId),
    isHost: String(snapshot.room.hostUserId) === String(viewerId),
    isReady: viewer.isReady === true,
    players: Object.freeze(players),
  });
}

const LOBBY_ERROR_MESSAGES = Object.freeze([
  ["ROOM_NOT_FOUND", "방을 찾을 수 없거나 이미 시작된 방이에요."],
  ["ROOM_FULL", "방 인원이 모두 찼어요."],
  ["ACTIVE_ROOM_EXISTS", "이미 참여 중인 Can’t Stop 방이 있어요."],
  ["VERSION_CONFLICT", "방 상태가 방금 변경됐어요. 최신 상태를 다시 불러와 주세요."],
  ["HOST_REQUIRED", "방장만 게임을 시작할 수 있어요."],
  ["PLAYERS_NOT_READY", "모든 플레이어가 준비한 뒤 시작할 수 있어요."],
  ["INVALID_PLAYER_COUNT", "게임 시작에는 2명 이상이 필요해요."],
  ["ROOM_NOT_WAITING", "이미 시작되었거나 종료된 방이에요."],
  ["NOT_ROOM_MEMBER", "현재 이 방의 참여자가 아니에요."],
  ["AUTH_REQUIRED", "승인회원만 Can’t Stop 온라인 방을 이용할 수 있어요."],
]);

export function getCantStopLobbyErrorMessage(error) {
  const source = [error?.message, error?.details, error?.hint, error?.code]
    .filter(Boolean)
    .join(" ");
  const matched = LOBBY_ERROR_MESSAGES.find(([code]) => source.includes(code));
  return matched?.[1] ?? "방 요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.";
}
