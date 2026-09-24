export function orderBoardPlayers(players, currentUserId) {
  const ordered = [...players].sort((left, right) => left.seat - right.seat);
  if (ordered.length === 0) return [];

  const viewerId = String(currentUserId ?? "");
  const viewerIndex = ordered.findIndex((player) => String(player.id) === viewerId);
  const startIndex = viewerIndex >= 0 ? viewerIndex : 0;

  return [
    ...ordered.slice(startIndex),
    ...ordered.slice(0, startIndex),
  ];
}

export function getBoardSeatCoordinates(index, total) {
  const count = Math.max(Number(total) || 0, 1);
  const safeIndex = Math.max(0, Math.min(Number(index) || 0, count - 1));
  const angle = (Math.PI / 2) + ((Math.PI * 2 * safeIndex) / count);
  const centerX = 50;
  const radiusX = 40;
  const radiusY = 39;

  return Object.freeze({
    left: centerX + (Math.cos(angle) * radiusX),
    top: 50 + (Math.sin(angle) * radiusY),
  });
}

export function getNoThanksCardTone(value) {
  const numeric = Number(value);
  if (!Number.isInteger(numeric) || numeric <= 10) return "blue";
  if (numeric <= 18) return "teal";
  if (numeric <= 26) return "yellow";
  return "pink";
}

export function getNoThanksHandOverlap(cardCount) {
  const count = Math.max(0, Number(cardCount) || 0);
  if (count <= 5) return -8;
  if (count <= 9) return -18;
  if (count <= 13) return -28;
  if (count <= 17) return -38;
  if (count <= 21) return -46;
  return -52;
}


export function getNoThanksVisibleChipCount(count, {
  compact = false,
} = {}) {
  const numeric = Number(count);
  if (!Number.isFinite(numeric) || numeric <= 0) return 0;
  return Math.min(Math.floor(numeric), compact ? 7 : 16);
}


export function getNoThanksDeckVisualCount(remaining) {
  const count = Math.max(0, Math.floor(Number(remaining) || 0));
  if (count <= 1) return count;
  if (count <= 3) return 2;
  if (count <= 7) return 3;
  if (count <= 11) return 4;
  if (count <= 15) return 5;
  if (count <= 19) return 6;
  return 7;
}
