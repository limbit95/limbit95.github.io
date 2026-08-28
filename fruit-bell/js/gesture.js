export const FLIP_GESTURE = Object.freeze({
  minimumUpwardDistance: 58,
  maximumDuration: 900,
  minimumDuration: 70,
  verticalDominance: 1.12,
});

export function getFlipGestureProgress(startY, currentY) {
  const distance = Math.max(0, startY - currentY);
  return Math.min(1, distance / FLIP_GESTURE.minimumUpwardDistance);
}

export function isUpwardFlipGesture({ startX, startY, endX, endY, durationMs }) {
  const upwardDistance = startY - endY;
  const horizontalDistance = Math.abs(endX - startX);
  return durationMs >= FLIP_GESTURE.minimumDuration
    && durationMs <= FLIP_GESTURE.maximumDuration
    && upwardDistance >= FLIP_GESTURE.minimumUpwardDistance
    && upwardDistance >= horizontalDistance * FLIP_GESTURE.verticalDominance;
}
