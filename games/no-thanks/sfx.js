let sharedAudioContext = null;

function audioContextConstructor() {
  return globalThis.AudioContext ?? globalThis.webkitAudioContext ?? null;
}

function getSharedAudioContext() {
  if (sharedAudioContext) return sharedAudioContext;
  const AudioContextClass = audioContextConstructor();
  if (!AudioContextClass) return null;

  try {
    sharedAudioContext = new AudioContextClass();
  } catch {
    return null;
  }
  return sharedAudioContext;
}

function scheduleTone(context, {
  at,
  type = "sine",
  startFrequency,
  endFrequency,
  peakGain,
  attackMs = 2,
  releaseMs = 80,
}) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const attackAt = at + (attackMs / 1000);
  const endAt = at + (releaseMs / 1000);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(startFrequency, at);
  oscillator.frequency.exponentialRampToValueAtTime(endFrequency, endAt);

  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(peakGain, attackAt);
  gain.gain.exponentialRampToValueAtTime(0.0001, endAt);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(at);
  oscillator.stop(endAt + 0.02);
}

function scheduleCardShuffleBeat(context, at, emphasis = 1) {
  scheduleTone(context, {
    at,
    type: "triangle",
    startFrequency: 1260,
    endFrequency: 420,
    peakGain: 0.018 * emphasis,
    attackMs: 2,
    releaseMs: 105,
  });
  scheduleTone(context, {
    at: at + 0.018,
    type: "sine",
    startFrequency: 260,
    endFrequency: 150,
    peakGain: 0.014 * emphasis,
    attackMs: 3,
    releaseMs: 130,
  });
}

function scheduleCoinHit(context, at, {
  bright = 1,
  gain = 1,
} = {}) {
  scheduleTone(context, {
    at,
    type: "triangle",
    startFrequency: 1720 * bright,
    endFrequency: 820 * bright,
    peakGain: 0.034 * gain,
    attackMs: 2,
    releaseMs: 82,
  });
  scheduleTone(context, {
    at: at + 0.01,
    type: "sine",
    startFrequency: 440,
    endFrequency: 250,
    peakGain: 0.012 * gain,
    attackMs: 3,
    releaseMs: 118,
  });
}

function scheduleOpeningSound(context) {
  const startAt = Number(context.currentTime) + 0.02;

  // Deck and chip setup share one coordinated timeline so two simultaneous
  // visual animations do not create two unrelated, competing sound beds.
  [
    { delayMs: 0, emphasis: 1.05 },
    { delayMs: 430, emphasis: 0.9 },
    { delayMs: 860, emphasis: 0.96 },
    { delayMs: 1290, emphasis: 0.92 },
    { delayMs: 1720, emphasis: 0.98 },
    { delayMs: 2160, emphasis: 1.08 },
  ].forEach(({ delayMs, emphasis }) => {
    scheduleCardShuffleBeat(context, startAt + (delayMs / 1000), emphasis);
  });

  [
    { delayMs: 120, bright: 0.92, gain: 0.8 },
    { delayMs: 315, bright: 1.02, gain: 0.88 },
    { delayMs: 535, bright: 0.96, gain: 0.82 },
    { delayMs: 780, bright: 1.08, gain: 0.9 },
    { delayMs: 1060, bright: 1, gain: 0.82 },
    { delayMs: 1390, bright: 1.12, gain: 0.78 },
  ].forEach(({ delayMs, bright, gain }) => {
    scheduleCoinHit(context, startAt + (delayMs / 1000), { bright, gain });
  });

  scheduleTone(context, {
    at: startAt + 2.42,
    type: "sine",
    startFrequency: 330,
    endFrequency: 220,
    peakGain: 0.018,
    attackMs: 4,
    releaseMs: 210,
  });
}

function scheduleTakeSound(context, chipCount) {
  const startAt = Number(context.currentTime) + 0.01;

  scheduleTone(context, {
    at: startAt,
    type: "triangle",
    startFrequency: 760,
    endFrequency: 210,
    peakGain: 0.034,
    attackMs: 3,
    releaseMs: 240,
  });
  scheduleTone(context, {
    at: startAt + 0.34,
    type: "sine",
    startFrequency: 290,
    endFrequency: 170,
    peakGain: 0.028,
    attackMs: 4,
    releaseMs: 190,
  });

  const safeChipCount = Math.max(0, Math.floor(Number(chipCount) || 0));
  const audibleChipCount = Math.min(7, safeChipCount);
  for (let index = 0; index < audibleChipCount; index += 1) {
    scheduleCoinHit(context, startAt + 0.075 + (index * 0.052), {
      bright: 0.92 + ((index % 3) * 0.08),
      gain: 0.72,
    });
  }
}

function scheduleChipSound(context) {
  const startAt = Number(context.currentTime) + 0.01;
  scheduleCoinHit(context, startAt, { bright: 0.96, gain: 0.52 });
}

function playWithContext(context, schedule) {
  if (!context) return false;

  const play = () => {
    try {
      schedule(context);
    } catch {
      // Sound feedback is optional and must never interrupt gameplay.
    }
  };

  if (context.state === "suspended") {
    try {
      const resume = context.resume?.();
      if (resume?.then) resume.then(play).catch(() => {});
      else play();
    } catch {
      return false;
    }
    return true;
  }

  play();
  return true;
}

export function prepareNoThanksSound() {
  const context = getSharedAudioContext();
  if (!context) return false;

  if (context.state === "suspended") {
    try {
      const resume = context.resume?.();
      resume?.catch?.(() => {});
    } catch {
      return false;
    }
  }

  return true;
}

export function playNoThanksOpeningSound({ context = null } = {}) {
  return playWithContext(
    context ?? getSharedAudioContext(),
    scheduleOpeningSound,
  );
}

export function playNoThanksTakeSound({
  context = null,
  chipCount = 0,
} = {}) {
  return playWithContext(
    context ?? getSharedAudioContext(),
    (audioContext) => scheduleTakeSound(audioContext, chipCount),
  );
}

export function playNoThanksChipSound({ context = null } = {}) {
  return playWithContext(
    context ?? getSharedAudioContext(),
    scheduleChipSound,
  );
}
