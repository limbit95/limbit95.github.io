import { getGameBgmByEntryUrl } from "./bgmCatalog.js";

const INTENT_KEY = "cheongpa.gameBgm.intent";
const INTENT_TTL_MS = 5 * 60 * 1000;

function sessionStorageOrNull(storage) {
  if (storage) return storage;
  try {
    return globalThis.sessionStorage ?? null;
  } catch {
    return null;
  }
}

export function writeGameBgmIntent(gameId, {
  storage = null,
  now = Date.now,
} = {}) {
  const normalizedGameId = String(gameId ?? "").trim();
  if (!normalizedGameId) return false;
  const target = sessionStorageOrNull(storage);
  if (!target) return false;

  try {
    target.setItem(INTENT_KEY, JSON.stringify({
      gameId: normalizedGameId,
      autoplayRequested: true,
      createdAt: Number(now()),
    }));
    return true;
  } catch {
    return false;
  }
}

export function consumeGameBgmIntent(gameId, {
  storage = null,
  now = Date.now,
  ttlMs = INTENT_TTL_MS,
} = {}) {
  const target = sessionStorageOrNull(storage);
  if (!target) return null;

  let intent = null;
  try {
    const raw = target.getItem(INTENT_KEY);
    if (raw) intent = JSON.parse(raw);
  } catch {
    intent = null;
  }

  try {
    target.removeItem(INTENT_KEY);
  } catch {
    // Intent is best-effort only.
  }

  if (!intent || intent.gameId !== gameId || intent.autoplayRequested !== true) return null;

  const createdAt = Number(intent.createdAt);
  const age = Number(now()) - createdAt;
  if (!Number.isFinite(createdAt) || age < 0 || age > ttlMs) return null;

  return Object.freeze({
    gameId: intent.gameId,
    autoplayRequested: true,
    createdAt,
  });
}

function isPrimaryUnmodifiedActivation(event) {
  if (event.defaultPrevented) return false;
  if ("button" in event && event.button !== 0) return false;
  return !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export function installGameBgmIntentCapture({
  root = globalThis.document,
  storage = null,
  now = Date.now,
} = {}) {
  if (!root?.addEventListener) return () => {};

  const onClick = (event) => {
    if (!isPrimaryUnmodifiedActivation(event)) return;
    const anchor = event.target?.closest?.("a[href]");
    if (!anchor) return;
    const track = getGameBgmByEntryUrl(anchor.href);
    if (!track) return;
    writeGameBgmIntent(track.gameId, { storage, now });
  };

  root.addEventListener("click", onClick, true);
  return () => root.removeEventListener("click", onClick, true);
}

export const BGM_INTENT_STORAGE_KEY = INTENT_KEY;
export const BGM_INTENT_TTL_MS = INTENT_TTL_MS;
