export const CLASSIC_ADAPTIVE_RENDER_PROFILE = Object.freeze({
  minScale: 0.55,
  maxScale: 1,
  slowFrameMs: 19.5,
  severeFrameMs: 27,
  recoverFrameMs: 17.4,
  sampleWindowFrames: 30,
  recoverSampleWindows: 4,
  slowStep: 0.12,
  severeStep: 0.2,
  recoverStep: 0.05,
  cooldownMs: 900,
  maxFrameGapMs: 120,
  minPixelRatio: 0.55,
});

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function resolveAdaptivePixelRatio(basePixelRatio, qualityScale, {
  minPixelRatio = CLASSIC_ADAPTIVE_RENDER_PROFILE.minPixelRatio,
} = {}) {
  const base = Math.max(0.1, Number(basePixelRatio) || 1);
  const scale = clamp(Number(qualityScale) || 1, 0.1, 1);
  return clamp(base * scale, Math.min(minPixelRatio, base), base);
}

export function createAdaptiveRenderBudgetController({
  profile = CLASSIC_ADAPTIVE_RENDER_PROFILE,
} = {}) {
  let scale = profile.maxScale;
  let lastFrameAt = null;
  let lastChangeAt = Number.NEGATIVE_INFINITY;
  let sampledFrameMs = 0;
  let sampledFrames = 0;
  let recoveryWindows = 0;
  let latestAverageFrameMs = 0;

  function snapshot(changed = false) {
    return Object.freeze({
      changed,
      scale,
      averageFrameMs: latestAverageFrameMs,
      fps: latestAverageFrameMs > 0 ? 1000 / latestAverageFrameMs : 0,
    });
  }

  function recordFrame(now) {
    const timestamp = Number(now);
    if (!Number.isFinite(timestamp)) return snapshot();

    if (lastFrameAt === null) {
      lastFrameAt = timestamp;
      return snapshot();
    }

    const frameMs = timestamp - lastFrameAt;
    lastFrameAt = timestamp;
    if (frameMs <= 0 || frameMs > profile.maxFrameGapMs) {
      sampledFrameMs = 0;
      sampledFrames = 0;
      recoveryWindows = 0;
      return snapshot();
    }

    sampledFrameMs += frameMs;
    sampledFrames += 1;
    if (sampledFrames < profile.sampleWindowFrames) return snapshot();

    latestAverageFrameMs = sampledFrameMs / sampledFrames;
    sampledFrameMs = 0;
    sampledFrames = 0;

    if ((timestamp - lastChangeAt) < profile.cooldownMs) return snapshot();

    let nextScale = scale;
    if (latestAverageFrameMs >= profile.severeFrameMs) {
      nextScale -= profile.severeStep;
      recoveryWindows = 0;
    } else if (latestAverageFrameMs >= profile.slowFrameMs) {
      nextScale -= profile.slowStep;
      recoveryWindows = 0;
    } else if (latestAverageFrameMs <= profile.recoverFrameMs) {
      recoveryWindows += 1;
      if (recoveryWindows >= profile.recoverSampleWindows) {
        nextScale += profile.recoverStep;
        recoveryWindows = 0;
      }
    } else {
      recoveryWindows = 0;
    }

    nextScale = clamp(nextScale, profile.minScale, profile.maxScale);
    if (Math.abs(nextScale - scale) < 0.001) return snapshot();

    scale = nextScale;
    lastChangeAt = timestamp;
    return snapshot(true);
  }

  return Object.freeze({
    recordFrame,
    get scale() {
      return scale;
    },
  });
}
