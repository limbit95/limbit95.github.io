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

function scheduleAuctionStartSound(context) {
  const startAt = Number(context.currentTime) + 0.01;
  const notes = [
    { delayMs: 0, frequency: 392, peakGain: 0.042, releaseMs: 180 },
    { delayMs: 115, frequency: 523.25, peakGain: 0.048, releaseMs: 210 },
    { delayMs: 235, frequency: 659.25, peakGain: 0.052, releaseMs: 260 },
  ];

  notes.forEach((note) => {
    scheduleTone(context, {
      at: startAt + (note.delayMs / 1000),
      type: "sine",
      startFrequency: note.frequency,
      endFrequency: note.frequency * 0.985,
      peakGain: note.peakGain,
      attackMs: 6,
      releaseMs: note.releaseMs,
    });
  });

  scheduleTone(context, {
    at: startAt + 0.34,
    type: "triangle",
    startFrequency: 240,
    endFrequency: 118,
    peakGain: 0.06,
    attackMs: 4,
    releaseMs: 150,
  });
}

function scheduleAuctionBidSound(context) {
  const startAt = Number(context.currentTime) + 0.01;
  const coinHits = [
    { delayMs: 0, startFrequency: 1320, endFrequency: 760, peakGain: 0.045, releaseMs: 72 },
    { delayMs: 46, startFrequency: 1680, endFrequency: 940, peakGain: 0.05, releaseMs: 76 },
    { delayMs: 92, startFrequency: 1460, endFrequency: 820, peakGain: 0.048, releaseMs: 74 },
    { delayMs: 138, startFrequency: 1940, endFrequency: 1080, peakGain: 0.052, releaseMs: 80 },
    { delayMs: 188, startFrequency: 1580, endFrequency: 900, peakGain: 0.046, releaseMs: 78 },
  ];

  // A quick metallic coin-counting cascade, closer to money changing hands than a gavel strike.
  coinHits.forEach((coin) => {
    scheduleTone(context, {
      at: startAt + (coin.delayMs / 1000),
      type: "triangle",
      startFrequency: coin.startFrequency,
      endFrequency: coin.endFrequency,
      peakGain: coin.peakGain,
      attackMs: 2,
      releaseMs: coin.releaseMs,
    });
  });

  scheduleTone(context, {
    at: startAt + 0.02,
    type: "sine",
    startFrequency: 420,
    endFrequency: 250,
    peakGain: 0.025,
    attackMs: 3,
    releaseMs: 230,
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

export function playAuctionStartSound({ context = null } = {}) {
  const audioContext = context ?? getSharedAudioContext();
  if (!audioContext) return false;

  const play = () => {
    try {
      scheduleAuctionStartSound(audioContext);
    } catch {
      // Auction start audio is optional and must never interrupt game flow.
    }
  };

  if (audioContext.state === "suspended") {
    try {
      const resume = audioContext.resume?.();
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
