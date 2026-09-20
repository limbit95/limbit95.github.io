let audioContext = null;
let unlockInstalled = false;

function getAudioContext() {
  if (audioContext) return audioContext;
  if (typeof window === "undefined") return null;

  const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
  if (typeof AudioContextClass !== "function") return null;

  audioContext = new AudioContextClass();
  return audioContext;
}

async function ensureRunningContext() {
  const context = getAudioContext();
  if (!context) return null;

  if (context.state === "suspended") {
    try {
      await context.resume();
    } catch {
      return null;
    }
  }
  return context.state === "running" ? context : null;
}

function createNoiseBuffer(context, durationSeconds) {
  const length = Math.max(1, Math.floor(context.sampleRate * durationSeconds));
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const channel = buffer.getChannelData(0);
  let seed = 0x51f15e;

  for (let index = 0; index < length; index += 1) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    channel[index] = ((seed / 0xffffffff) * 2 - 1) * 0.9;
  }
  return buffer;
}

function scheduleDiceClack(context, when, pitch, volume) {
  const source = context.createBufferSource();
  source.buffer = createNoiseBuffer(context, 0.065);

  const filter = context.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(pitch, when);
  filter.Q.setValueAtTime(1.7, when);

  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(volume, when + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.06);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);

  source.start(when);
  source.stop(when + 0.065);
}

export function installCantStopAudioUnlock() {
  if (unlockInstalled || typeof document === "undefined") return;
  unlockInstalled = true;

  const unlock = () => {
    void ensureRunningContext();
  };

  document.addEventListener("pointerdown", unlock, { once: true, passive: true });
  document.addEventListener("keydown", unlock, { once: true });
}

export async function playCantStopDiceRollSound() {
  const context = await ensureRunningContext();
  if (!context) return false;

  const start = context.currentTime + 0.01;
  const pattern = [
    [0.00, 1180, 0.09],
    [0.09, 860, 0.082],
    [0.17, 1380, 0.076],
    [0.27, 940, 0.071],
    [0.38, 1240, 0.065],
    [0.52, 790, 0.057],
    [0.66, 1090, 0.049],
  ];

  for (const [offset, pitch, volume] of pattern) {
    scheduleDiceClack(context, start + offset, pitch, volume);
  }
  return true;
}

export async function playCantStopBlizzardSound() {
  const context = await ensureRunningContext();
  if (!context) return false;

  const start = context.currentTime + 0.01;
  const duration = 1.75;
  const noise = context.createBufferSource();
  noise.buffer = createNoiseBuffer(context, duration);

  const highpass = context.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.setValueAtTime(520, start);

  const lowpass = context.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.setValueAtTime(4300, start);
  lowpass.frequency.exponentialRampToValueAtTime(1900, start + duration);

  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.085, start + 0.18);
  gain.gain.setValueAtTime(0.075, start + 0.72);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  const rumble = context.createOscillator();
  rumble.type = "sine";
  rumble.frequency.setValueAtTime(82, start);
  rumble.frequency.exponentialRampToValueAtTime(54, start + 1.1);

  const rumbleGain = context.createGain();
  rumbleGain.gain.setValueAtTime(0.0001, start);
  rumbleGain.gain.exponentialRampToValueAtTime(0.022, start + 0.14);
  rumbleGain.gain.exponentialRampToValueAtTime(0.0001, start + 1.25);

  noise.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(gain);
  gain.connect(context.destination);

  rumble.connect(rumbleGain);
  rumbleGain.connect(context.destination);

  noise.start(start);
  noise.stop(start + duration);
  rumble.start(start);
  rumble.stop(start + 1.3);

  return true;
}
