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

function scheduleFilteredNoise(context, {
  at,
  durationMs,
  peakGain,
  filterType = "bandpass",
  startFrequency,
  endFrequency,
  q = 0.8,
}) {
  const frameCount = Math.max(1, Math.round(context.sampleRate * (durationMs / 1000)));
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const samples = buffer.getChannelData(0);

  for (let index = 0; index < samples.length; index += 1) {
    samples[index] = (Math.random() * 2) - 1;
  }

  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  const endAt = at + (durationMs / 1000);

  source.buffer = buffer;
  filter.type = filterType;
  filter.frequency.setValueAtTime(startFrequency, at);
  filter.frequency.exponentialRampToValueAtTime(endFrequency, endAt);
  filter.Q.setValueAtTime(q, at);

  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(peakGain, at + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, endAt);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  source.start(at);
  source.stop(endAt + 0.02);
}

function scheduleCardSlide(context, at) {
  // Broad filtered noise reads as cardstock sliding across a tabletop,
  // avoiding the pitched "boing" character of an oscillator-only cue.
  scheduleFilteredNoise(context, {
    at,
    durationMs: 285,
    peakGain: 0.084,
    filterType: "bandpass",
    startFrequency: 2100,
    endFrequency: 780,
    q: 0.72,
  });
  scheduleFilteredNoise(context, {
    at: at + 0.245,
    durationMs: 78,
    peakGain: 0.044,
    filterType: "bandpass",
    startFrequency: 1350,
    endFrequency: 620,
    q: 0.9,
  });
}

function scheduleCardShuffleBeat(context, at, emphasis = 1) {
  scheduleFilteredNoise(context, {
    at,
    durationMs: 105,
    peakGain: 0.024 * emphasis,
    filterType: "bandpass",
    startFrequency: 2350,
    endFrequency: 980,
    q: 0.78,
  });
  scheduleFilteredNoise(context, {
    at: at + 0.045,
    durationMs: 78,
    peakGain: 0.016 * emphasis,
    filterType: "bandpass",
    startFrequency: 1550,
    endFrequency: 720,
    q: 0.9,
  });
}

function scheduleChipStackHit(context, at, {
  weight = 1,
  pitch = 1,
} = {}) {
  // Short dry impact + tiny high-frequency edge gives a plastic chip
  // landing on a stack: "착", not a metallic coin jingle.
  scheduleFilteredNoise(context, {
    at,
    durationMs: 42,
    peakGain: 0.021 * weight,
    filterType: "bandpass",
    startFrequency: 2200 * pitch,
    endFrequency: 1050 * pitch,
    q: 1.05,
  });
  scheduleTone(context, {
    at: at + 0.004,
    type: "triangle",
    startFrequency: 520 * pitch,
    endFrequency: 235 * pitch,
    peakGain: 0.021 * weight,
    attackMs: 1,
    releaseMs: 54,
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
    { delayMs: 620, pitch: 0.94, weight: 0.72 },
    { delayMs: 760, pitch: 1.02, weight: 0.78 },
    { delayMs: 900, pitch: 0.98, weight: 0.74 },
    { delayMs: 1040, pitch: 1.06, weight: 0.8 },
    { delayMs: 1180, pitch: 1, weight: 0.74 },
    { delayMs: 1320, pitch: 1.08, weight: 0.7 },
  ].forEach(({ delayMs, pitch, weight }) => {
    scheduleChipStackHit(context, startAt + (delayMs / 1000), { pitch, weight });
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

  scheduleCardSlide(context, startAt);

  const safeChipCount = Math.max(0, Math.floor(Number(chipCount) || 0));
  const audibleChipCount = Math.min(8, safeChipCount);
  const landingAt = startAt + 0.39;
  for (let index = 0; index < audibleChipCount; index += 1) {
    scheduleChipStackHit(context, landingAt + (index * 0.05), {
      pitch: 0.94 + ((index % 3) * 0.05),
      weight: 1.44 + ((index % 2) * 0.16),
    });
  }
}

function scheduleChipSound(context, travelMs = 620) {
  const startAt = Number(context.currentTime) + 0.01;
  const safeTravelMs = Math.max(0, Number(travelMs) || 0);

  if (safeTravelMs > 0) {
    // A dry sliding texture follows the chip's flight, then the stack impact
    // lands just before the 620ms refuse animation completes: "스윽 → 착".
    scheduleFilteredNoise(context, {
      at: startAt,
      durationMs: Math.max(120, safeTravelMs - 90),
      peakGain: 0.03,
      filterType: "bandpass",
      startFrequency: 1650,
      endFrequency: 610,
      q: 0.7,
    });
    scheduleFilteredNoise(context, {
      at: startAt + 0.07,
      durationMs: Math.max(90, safeTravelMs - 180),
      peakGain: 0.017,
      filterType: "bandpass",
      startFrequency: 980,
      endFrequency: 430,
      q: 0.82,
    });
  }

  const landingAt = startAt + (safeTravelMs > 0
    ? Math.max(0, safeTravelMs - 30) / 1000
    : 0);
  scheduleChipStackHit(context, landingAt, { pitch: 0.98, weight: 1.05 });
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

export function playNoThanksChipSound({
  context = null,
  travelMs = 620,
} = {}) {
  return playWithContext(
    context ?? getSharedAudioContext(),
    (audioContext) => scheduleChipSound(audioContext, travelMs),
  );
}
