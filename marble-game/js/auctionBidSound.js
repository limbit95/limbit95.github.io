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
  type,
  startFrequency,
  endFrequency,
  peakGain,
  attackMs,
  releaseMs,
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

function scheduleAuctionBidSound(context) {
  const startAt = Number(context.currentTime) + 0.01;

  // Short wooden body + crisp top click: a compact gavel-like bid cue.
  scheduleTone(context, {
    at: startAt,
    type: "triangle",
    startFrequency: 210,
    endFrequency: 92,
    peakGain: 0.16,
    attackMs: 5,
    releaseMs: 180,
  });
  scheduleTone(context, {
    at: startAt,
    type: "square",
    startFrequency: 980,
    endFrequency: 360,
    peakGain: 0.035,
    attackMs: 2,
    releaseMs: 55,
  });
}

export function prepareAuctionBidSound() {
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

export function playAuctionBidSound({ context = null } = {}) {
  const audioContext = context ?? getSharedAudioContext();
  if (!audioContext) return false;

  const play = () => {
    try {
      scheduleAuctionBidSound(audioContext);
    } catch {
      // Audio feedback is optional and must never interrupt auction flow.
    }
  };

  if (audioContext.state === "suspended") {
    try {
      const resume = audioContext.resume?.();
      if (resume?.then) {
        resume.then(play).catch(() => {});
      } else {
        play();
      }
    } catch {
      return false;
    }
    return true;
  }

  play();
  return true;
}
