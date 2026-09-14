export const MARBLE_RENDER_RUNTIME_PROFILE = Object.freeze({
  idleFps: 20,
  idleFrameIntervalMs: 50,
});

export const MARBLE_OVERLAY_EVENT_TYPES = Object.freeze(new Set([
  "DICE_ROLLED",
  "START_PASSED",
  "MONEY_PAID",
  "MONEY_RECEIVED",
  "PROPERTY_BOUGHT",
  "PROPERTY_BUILT",
]));

let overlayMotionCount = 0;

export function isMarbleOverlayEventType(eventType) {
  return MARBLE_OVERLAY_EVENT_TYPES.has(String(eventType ?? ""));
}

export function beginMarbleOverlayMotion() {
  overlayMotionCount += 1;
  return overlayMotionCount;
}

export function endMarbleOverlayMotion() {
  overlayMotionCount = Math.max(0, overlayMotionCount - 1);
  return overlayMotionCount;
}

export function isMarbleOverlayMotionActive() {
  return overlayMotionCount > 0;
}

export function shouldRenderMarbleFrame({
  now,
  lastRenderedAt = Number.NEGATIVE_INFINITY,
  force = false,
  motionActive = false,
  overlayActive = false,
  visible = true,
  idleFrameIntervalMs = MARBLE_RENDER_RUNTIME_PROFILE.idleFrameIntervalMs,
} = {}) {
  if (!visible) return false;
  if (overlayActive && !motionActive) return false;
  if (force || motionActive) return true;

  const current = Number(now);
  const previous = Number(lastRenderedAt);
  const interval = Math.max(0, Number(idleFrameIntervalMs) || 0);
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return true;
  return current - previous >= interval;
}
