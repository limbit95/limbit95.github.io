export const CARD_FLIP_DURATION_MS = 620;
export const CARD_REVEAL_PROGRESS = 0.72;
export const CARD_REVEAL_DELAY_MS = Math.round(CARD_FLIP_DURATION_MS * CARD_REVEAL_PROGRESS);
export const NETWORK_REVEAL_LEAD_MS = 650;

export function createPrototypeRevealAt(performanceNowMs) {
  return performanceNowMs + CARD_REVEAL_DELAY_MS;
}

export function toLocalPerformanceRevealAt({
  revealAtServerEpochMs,
  estimatedServerOffsetMs,
  localEpochNowMs,
  localPerformanceNowMs,
}) {
  const estimatedServerNowMs = localEpochNowMs + estimatedServerOffsetMs;
  return localPerformanceNowMs + Math.max(0, revealAtServerEpochMs - estimatedServerNowMs);
}
