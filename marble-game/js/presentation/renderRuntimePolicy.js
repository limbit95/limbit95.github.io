export const MARBLE_RENDER_RUNTIME_PROFILE = Object.freeze({
  idleFps: 20,
  idleFrameIntervalMs: 50,
});

export function shouldRenderMarbleFrame({
  now,
  lastRenderedAt = Number.NEGATIVE_INFINITY,
  force = false,
  motionActive = false,
  visible = true,
  idleFrameIntervalMs = MARBLE_RENDER_RUNTIME_PROFILE.idleFrameIntervalMs,
} = {}) {
  if (!visible) return false;
  if (force || motionActive) return true;

  const current = Number(now);
  const previous = Number(lastRenderedAt);
  const interval = Math.max(0, Number(idleFrameIntervalMs) || 0);
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return true;
  return current - previous >= interval;
}
