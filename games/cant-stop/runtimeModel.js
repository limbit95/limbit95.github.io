import { GAME_ACCESS_REASON } from "../shared/accessGate.js";
import {
  CANT_STOP_COLUMN_HEIGHTS,
  CANT_STOP_PHASE,
} from "./rules.js";

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


function gameplayPlayerId(player) {
  return String(player?.userId ?? player?.id ?? "");
}

export function createCantStopGameplayViewModel(snapshot, currentUserId) {
  if (!snapshot?.room || !snapshot?.game || !Array.isArray(snapshot.players)) {
    throw new TypeError("Can't Stop gameplay view requires an authoritative playing snapshot.");
  }

  const game = snapshot.game;
  const viewerId = String(snapshot.viewerUserId ?? currentUserId ?? "");
  const players = snapshot.players.map((player, index) => {
    const seat = Number.isInteger(player.seat) && player.seat >= 0
      ? player.seat
      : index;
    return Object.freeze({
      id: gameplayPlayerId(player),
      displayName: String(player.displayName ?? player.nickname ?? `플레이어 ${index + 1}`),
      index: seat,
    });
  });
  const playerMap = new Map(players.map((player) => [player.id, player]));
  const activePlayerId = String(game.activePlayerId ?? "");
  const activePlayer = playerMap.get(activePlayerId) ?? null;
  const hostUserId = String(snapshot.room.hostUserId ?? "");
  const winnerId = game.winnerId == null ? null : String(game.winnerId);
  const winner = winnerId ? playerMap.get(winnerId) ?? null : null;
  const playerProgress = game.playerProgress ?? {};
  const claimedColumns = game.claimedColumns ?? {};
  const runners = game.runners ?? {};

  const columns = createCantStopBoardColumns().map((column) => {
    const permanentMarkers = players.flatMap((player) => {
      const rawPosition = playerProgress?.[player.id]?.[column.number];
      const position = Number(rawPosition ?? 0);
      if (!Number.isInteger(position) || position < 1 || position > column.height) return [];
      return [Object.freeze({
        playerId: player.id,
        displayName: player.displayName,
        playerIndex: player.index,
        position,
      })];
    });
    const rawRunnerPosition = Number(runners?.[column.number] ?? 0);
    const runner = Number.isInteger(rawRunnerPosition)
      && rawRunnerPosition >= 1
      && rawRunnerPosition <= column.height
      && activePlayer
      ? Object.freeze({
        playerId: activePlayer.id,
        displayName: activePlayer.displayName,
        playerIndex: activePlayer.index,
        position: rawRunnerPosition,
      })
      : null;
    const claimedById = claimedColumns?.[column.number] == null
      ? null
      : String(claimedColumns[column.number]);
    const claimedBy = claimedById ? playerMap.get(claimedById) ?? null : null;

    return Object.freeze({
      ...column,
      permanentMarkers: Object.freeze(permanentMarkers),
      runner,
      claimedById,
      claimedByName: claimedBy?.displayName ?? null,
    });
  });

  const latestDice = Array.isArray(game.latestDice)
    ? Object.freeze(game.latestDice.map(Number))
    : null;
  const legalPairings = Object.freeze(
    (Array.isArray(game.legalPairings) ? game.legalPairings : []).map((pairing) => Object.freeze({
      sums: Object.freeze((pairing.sums ?? []).map(Number)),
      plans: Object.freeze((pairing.plans ?? []).map((plan) =>
        Object.freeze(plan.map(Number)))),
    })),
  );
  const phase = String(game.phase ?? "");
  const endReason = game.endReason == null ? null : String(game.endReason);

  return Object.freeze({
    version: Number(snapshot.version),
    phase,
    currentUserId: viewerId,
    hostUserId,
    isHost: viewerId !== "" && viewerId === hostUserId,
    activePlayerId,
    activePlayerName: activePlayer?.displayName ?? "플레이어",
    isMyTurn: viewerId !== "" && viewerId === activePlayerId,
    winnerId,
    winnerName: winner?.displayName ?? null,
    endReason,
    isManuallyEnded: phase === CANT_STOP_PHASE.GAME_OVER && endReason === "MANUAL",
    latestDice,
    legalPairings,
    columns: Object.freeze(columns),
    canRoll: phase === CANT_STOP_PHASE.TURN_ROLL && viewerId === activePlayerId,
    canChoosePairing: phase === CANT_STOP_PHASE.PAIRING_SELECTION && viewerId === activePlayerId,
    canContinue: phase === CANT_STOP_PHASE.PUSH_OR_STOP && viewerId === activePlayerId,
    canStop: phase === CANT_STOP_PHASE.PUSH_OR_STOP && viewerId === activePlayerId,
    isGameOver: phase === CANT_STOP_PHASE.GAME_OVER,
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
  ["TURN_REQUIRED", "현재 내 턴이 아니에요. 최신 게임 상태를 확인해 주세요."],
  ["INVALID_GAME_PHASE", "지금은 이 행동을 할 수 없는 단계예요."],
  ["ILLEGAL_PAIRING_CHOICE", "선택한 주사위 조합이 더 이상 유효하지 않아요. 최신 상태를 확인해 주세요."],
  ["ACTION_ID_CONFLICT", "같은 요청이 다른 내용으로 재사용됐어요. 다시 시도해 주세요."],
  ["GAME_NOT_PLAYING", "현재 진행 중인 게임이 아니에요."],
  ["GAME_NOT_OVER", "게임이 종료된 뒤에만 재대결을 준비할 수 있어요."],
  ["GAME_END_HOST_REQUIRED", "진행 중인 게임 전체 종료는 방장만 할 수 있어요."],
  ["ROOM_NOT_LEAVABLE", "진행 중인 게임에서는 방을 나갈 수 없어요."],
  ["INVALID_INVITE_TOKEN", "올바르지 않은 초대 링크예요."],
  ["INVITE_NOT_FOUND_OR_EXPIRED", "초대 링크가 만료되었거나 취소되었어요."],
  ["GAME_INVITE_MISMATCH", "Can’t Stop 방 초대 링크가 아니에요."],
  ["GAME_INVITE_ROOM_MISMATCH", "초대 링크의 방 정보가 일치하지 않아요."],
  ["GAME_INVITE_UNSUPPORTED_GAME", "Can’t Stop 초대 기능은 아직 운영 활성화 전이에요."],
]);

export function getCantStopLobbyErrorMessage(error) {
  const source = [error?.message, error?.details, error?.hint, error?.code]
    .filter(Boolean)
    .join(" ");
  const matched = LOBBY_ERROR_MESSAGES.find(([code]) => source.includes(code));
  return matched?.[1] ?? "방 요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.";
}
