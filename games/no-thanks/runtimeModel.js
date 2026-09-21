export const NO_THANKS_LOBBY_VIEW = Object.freeze({
  ENTRY: "entry",
  WAITING: "waiting",
  PLAYING: "playing",
  GAME_OVER: "game_over",
});

function playerId(player) {
  return String(player?.userId ?? player?.id ?? "");
}

export function createNoThanksLobbyViewModel(snapshot, currentUserId) {
  if (!snapshot?.room || !Array.isArray(snapshot.players)) {
    throw new TypeError("No Thanks! lobby view requires an authoritative room snapshot.");
  }

  const viewerId = String(snapshot.viewer?.playerId ?? currentUserId ?? "");
  const players = snapshot.players.map((player, index) => Object.freeze({
    id: playerId(player),
    displayName: String(player.displayName ?? `플레이어 ${index + 1}`),
    ready: player.isReady === true,
    connected: player.connected !== false,
    seat: Number.isInteger(player.seat) && player.seat >= 0 ? player.seat : index,
    cards: Object.freeze(
      Array.isArray(player.cards)
        ? player.cards.map(Number).filter(Number.isInteger)
        : [],
    ),
  }));
  const viewer = players.find((player) => player.id === viewerId);
  if (!viewer) {
    throw new TypeError("No Thanks! lobby snapshot does not include the current player.");
  }

  const hostUserId = String(snapshot.room.hostUserId ?? "");
  const nonHostReady = players
    .filter((player) => player.id !== hostUserId)
    .every((player) => player.ready);

  const gamePhase = String(snapshot.game?.phase ?? "");
  const activePlayerId = snapshot.game?.activePlayerId == null
    ? null
    : String(snapshot.game.activePlayerId);
  const viewerCounters = Number.isInteger(snapshot.viewer?.counters)
    ? snapshot.viewer.counters
    : null;
  const finalScores = snapshot.game?.finalScores
    && typeof snapshot.game.finalScores === "object"
    ? snapshot.game.finalScores
    : null;
  const winnerIds = Array.isArray(snapshot.game?.winners)
    ? snapshot.game.winners.map(String)
    : [];
  const scoreboard = finalScores
    ? players
      .map((player) => ({
        id: player.id,
        displayName: player.displayName,
        score: Number(finalScores[player.id]),
        winner: winnerIds.includes(player.id),
        seat: player.seat,
      }))
      .filter((player) => Number.isFinite(player.score))
      .sort((left, right) => left.score - right.score || left.seat - right.seat)
    : [];

  return Object.freeze({
    roomId: String(snapshot.room.id),
    roomCode: String(snapshot.room.roomCode),
    status: String(snapshot.room.status),
    version: Number(snapshot.version),
    maxPlayers: Number(snapshot.room.maxPlayers),
    playerCount: players.length,
    currentUserId: viewerId,
    hostUserId,
    isHost: hostUserId === viewerId,
    isReady: viewer.ready,
    canStart: players.length >= 3 && players.length <= 7 && nonHostReady,
    gamePhase,
    viewerCounters,
    currentCard: Number.isInteger(snapshot.game?.currentCard)
      ? snapshot.game.currentCard
      : null,
    deckRemaining: Number.isInteger(snapshot.game?.deckRemaining)
      ? snapshot.game.deckRemaining
      : null,
    centerCounters: Number.isInteger(snapshot.game?.centerCounters)
      ? snapshot.game.centerCounters
      : 0,
    activePlayerId,
    activePlayerDisplayName: players.find((player) => player.id === activePlayerId)?.displayName ?? null,
    isMyTurn: gamePhase === "PLAYING" && activePlayerId === viewerId,
    canRefuse: gamePhase === "PLAYING"
      && activePlayerId === viewerId
      && Number.isInteger(viewerCounters)
      && viewerCounters > 0,
    canTake: gamePhase === "PLAYING" && activePlayerId === viewerId,
    winners: Object.freeze(winnerIds),
    finalScores: finalScores ? Object.freeze({ ...finalScores }) : null,
    scoreboard: Object.freeze(scoreboard.map((entry) => Object.freeze(entry))),
    endReason: snapshot.game?.endReason ?? null,
    players: Object.freeze(players),
  });
}

const LOBBY_ERROR_MESSAGES = Object.freeze([
  ["ROOM_NOT_FOUND", "방을 찾을 수 없거나 더 이상 참여 중인 방이 아니에요."],
  ["ROOM_FULL", "방 인원이 모두 찼어요."],
  ["ACTIVE_ROOM_EXISTS", "이미 참여 중인 No Thanks! 방이 있어요."],
  ["INVALID_PLAYER_LIMIT", "최대 인원은 3명부터 7명 사이로 선택해 주세요."],
  ["VERSION_CONFLICT", "방 상태가 방금 변경됐어요. 최신 상태를 다시 불러와 주세요."],
  ["HOST_REQUIRED", "방장만 게임을 시작할 수 있어요."],
  ["PLAYER_COUNT_REQUIRED", "게임을 시작하려면 최소 3명이 필요해요."],
  ["PLAYERS_NOT_READY", "모든 일반 플레이어가 준비한 뒤 시작할 수 있어요."],
  ["ACTION_CONFLICT", "같은 요청이 다른 내용으로 재사용됐어요. 다시 시도해 주세요."],
  ["INVALID_ACTION_ID", "요청 식별자를 만들지 못했어요. 다시 시도해 주세요."],
  ["AUTH_REQUIRED", "승인회원만 No Thanks! 온라인 방을 이용할 수 있어요."],
  ["TURN_REQUIRED", "지금은 다른 플레이어의 차례예요."],
  ["TAKE_REQUIRED", "보유 칩이 없어 현재 카드를 반드시 가져와야 해요."],
  ["GAME_NOT_PLAYING", "이미 끝났거나 아직 시작되지 않은 게임이에요."],
  ["GAME_STATE_REQUIRED", "게임 상태를 불러오지 못했어요. 최신 상태를 다시 확인해 주세요."],
  ["INVALID_GAME_ACTION", "지원하지 않는 게임 동작이에요."],
  ["GAME_IN_PROGRESS", "게임 진행 중에는 방을 나갈 수 없어요."],
]);

export function getNoThanksLobbyErrorMessage(error) {
  const source = [error?.message, error?.details, error?.hint, error?.code]
    .filter(Boolean)
    .join(" ");
  const matched = LOBBY_ERROR_MESSAGES.find(([code]) => source.includes(code));
  return matched?.[1] ?? "방 요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.";
}
