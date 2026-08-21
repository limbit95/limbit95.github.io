import { STORAGE_KEYS } from "./constants.js";

let currentUserId = null;
const legacyKeys = Object.values(STORAGE_KEYS);

export function setStorageUser(userId) {
  currentUserId = userId || null;
}

function scopedKey(base) {
  if (!currentUserId) throw new Error("AUTH_REQUIRED");
  return `${base}:${currentUserId}`;
}

const read = (base) => localStorage.getItem(scopedKey(base))?.trim() || "";

export function regeneratePlayerKey() {
  const key = crypto.randomUUID();
  localStorage.setItem(scopedKey(STORAGE_KEYS.playerKey), key);
  return key;
}

export function getPlayerKey() {
  const key = read(STORAGE_KEYS.playerKey) || regeneratePlayerKey();
  legacyKeys.forEach((legacyKey) => localStorage.removeItem(legacyKey));
  return key;
}
export const getNickname = () => read(STORAGE_KEYS.nickname);
export function setNickname(value) {
  const nickname = value.trim();
  localStorage.setItem(scopedKey(STORAGE_KEYS.nickname), nickname);
  return nickname;
}
export const getCurrentRoom = () => read(STORAGE_KEYS.room);
export function setCurrentRoom(id) {
  const key = scopedKey(STORAGE_KEYS.room);
  id ? localStorage.setItem(key, id) : localStorage.removeItem(key);
}