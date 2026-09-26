export const WORLD = Object.freeze({ width: 1280, height: 720 });
export const SYNC_HOLD_MS = 2200;

export const PLAYER_DEFINITIONS = Object.freeze([
  Object.freeze({ id: "p1", label: "P1", name: "Cyan", color: "#53e8ff", spawn: Object.freeze({ x: 500, y: 610 }) }),
  Object.freeze({ id: "p2", label: "P2", name: "Violet", color: "#9b7bff", spawn: Object.freeze({ x: 590, y: 610 }) }),
  Object.freeze({ id: "p3", label: "P3", name: "Amber", color: "#ffc85a", spawn: Object.freeze({ x: 690, y: 610 }) }),
  Object.freeze({ id: "p4", label: "P4", name: "Coral", color: "#ff748f", spawn: Object.freeze({ x: 780, y: 610 }) }),
]);

export const PLATE_DEFINITIONS = Object.freeze([
  Object.freeze({ id: "plate-p1", playerId: "p1", x: 190, y: 170, radius: 42 }),
  Object.freeze({ id: "plate-p2", playerId: "p2", x: 1090, y: 170, radius: 42 }),
  Object.freeze({ id: "plate-p3", playerId: "p3", x: 190, y: 530, radius: 42 }),
  Object.freeze({ id: "plate-p4", playerId: "p4", x: 1090, y: 530, radius: 42 }),
]);

export const EXTRACTION_ZONE = Object.freeze({ x: 520, y: 76, width: 240, height: 94 });

export function createInitialRunState(startedAt = 0) {
  return {
    phase: "sync",
    syncProgressMs: 0,
    coreUnlocked: false,
    extractedCount: 0,
    hazardHits: 0,
    startedAt,
    endedAt: null,
  };
}

export function pointInCircle(point, circle, padding = 0) {
  const dx = point.x - circle.x;
  const dy = point.y - circle.y;
  const radius = Math.max(0, circle.radius - padding);
  return (dx * dx) + (dy * dy) <= radius * radius;
}

export function pointInRect(point, rect, padding = 0) {
  return point.x >= rect.x + padding
    && point.x <= rect.x + rect.width - padding
    && point.y >= rect.y + padding
    && point.y <= rect.y + rect.height - padding;
}

export function computePlateOccupancy(players, plates = PLATE_DEFINITIONS) {
  const byId = new Map(players.map((player) => [player.id, player]));
  return plates.map((plate) => {
    const player = byId.get(plate.playerId);
    return Boolean(player && pointInCircle(player, plate, 8));
  });
}

export function countExtractedPlayers(players, zone = EXTRACTION_ZONE) {
  return players.filter((player) => pointInRect(player, zone, player.radius ?? 0)).length;
}

export function updateObjectiveState(state, {
  deltaMs,
  allPlatesActive,
  extractedCount,
  now,
}) {
  const next = { ...state, extractedCount };
  if (state.phase === "sync") {
    next.syncProgressMs = allPlatesActive
      ? Math.min(SYNC_HOLD_MS, state.syncProgressMs + Math.max(0, deltaMs))
      : Math.max(0, state.syncProgressMs - Math.max(0, deltaMs) * 1.8);

    if (next.syncProgressMs >= SYNC_HOLD_MS) {
      next.phase = "extraction";
      next.coreUnlocked = true;
      next.syncProgressMs = SYNC_HOLD_MS;
    }
  } else if (state.phase === "extraction" && extractedCount >= PLAYER_DEFINITIONS.length) {
    next.phase = "cleared";
    next.endedAt = now;
  }
  return next;
}

export function formatElapsed(ms) {
  const safe = Math.max(0, ms || 0);
  const minutes = Math.floor(safe / 60000);
  const seconds = Math.floor((safe % 60000) / 1000);
  const tenths = Math.floor((safe % 1000) / 100);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
}
