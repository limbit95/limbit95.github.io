const VOLUME_KEY = "cheongpa.gameBgm.volume";
const DEFAULT_VOLUME = 0.22;

function storageOrNull(storage) {
  if (storage) return storage;
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function clampBgmVolume(value, fallback = DEFAULT_VOLUME) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(1, Math.max(0, number));
}

export function readBgmVolume({ storage = null, fallback = DEFAULT_VOLUME } = {}) {
  const target = storageOrNull(storage);
  if (!target) return clampBgmVolume(fallback, DEFAULT_VOLUME);
  try {
    const saved = target.getItem(VOLUME_KEY);
    return saved == null
      ? clampBgmVolume(fallback, DEFAULT_VOLUME)
      : clampBgmVolume(saved, fallback);
  } catch {
    return clampBgmVolume(fallback, DEFAULT_VOLUME);
  }
}

export function writeBgmVolume(value, { storage = null } = {}) {
  const volume = clampBgmVolume(value);
  const target = storageOrNull(storage);
  if (target) {
    try {
      target.setItem(VOLUME_KEY, String(volume));
    } catch {
      // Storage can be unavailable in privacy-restricted browser contexts.
    }
  }
  return volume;
}

export const BGM_PREFERENCE_KEYS = Object.freeze({
  volume: VOLUME_KEY,
});
