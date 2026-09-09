export const MARBLE_PLAYER_LIMITS = Object.freeze({ min: 2, max: 4, default: 4 });

export function normalizeRoomCode(value) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^A-F0-9]/g, "")
    .slice(0, 6);
}

export function normalizeNickname(value) {
  return String(value ?? "").trim().slice(0, 20);
}

export function findViewer(snapshot) {
  const viewerUserId = snapshot?.viewerUserId;
  if (!viewerUserId) return null;
  return snapshot?.players?.find((player) => player.userId === viewerUserId) ?? null;
}

export function isViewerHost(snapshot) {
  return Boolean(snapshot?.viewerUserId && snapshot?.room?.hostUserId === snapshot.viewerUserId);
}

export function lobbyReadySummary(snapshot) {
  const players = Array.isArray(snapshot?.players) ? snapshot.players : [];
  const minimumMet = players.length >= MARBLE_PLAYER_LIMITS.min;
  const everyoneReady = minimumMet && players.every((player) => player.isReady === true);
  return Object.freeze({
    playerCount: players.length,
    minimumMet,
    everyoneReady,
    canStart: minimumMet && everyoneReady && snapshot?.room?.status === "waiting",
  });
}
