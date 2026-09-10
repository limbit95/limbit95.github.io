export const DICE_OVERLAY_VIEW = Object.freeze({
  projection: "orthographic",
  baseViewSize: 13.5,
  position: Object.freeze([18, 24, 22]),
  target: Object.freeze([0, 1.25, 0]),
});

export function createDiceOverlayBounds(width, height, baseViewSize = DICE_OVERLAY_VIEW.baseViewSize) {
  const safeWidth = Math.max(1, Number(width) || 1);
  const safeHeight = Math.max(1, Number(height) || 1);
  const aspect = safeWidth / safeHeight;
  const verticalSize = aspect >= 1 ? baseViewSize : baseViewSize / aspect;
  const horizontalSize = verticalSize * aspect;

  return Object.freeze({
    left: -horizontalSize / 2,
    right: horizontalSize / 2,
    top: verticalSize / 2,
    bottom: -verticalSize / 2,
  });
}
