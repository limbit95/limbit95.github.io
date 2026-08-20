import { STORAGE_KEYS } from "./constants.js";

const read = (key) => localStorage.getItem(key)?.trim() || "";
export function getPlayerKey() { let key=read(STORAGE_KEYS.playerKey); if(!key){key=crypto.randomUUID();localStorage.setItem(STORAGE_KEYS.playerKey,key);} return key; }
export const getNickname = () => read(STORAGE_KEYS.nickname);
export function setNickname(value){const nickname=value.trim();localStorage.setItem(STORAGE_KEYS.nickname,nickname);return nickname;}
export const getCurrentRoom = () => read(STORAGE_KEYS.room);
export function setCurrentRoom(id){id?localStorage.setItem(STORAGE_KEYS.room,id):localStorage.removeItem(STORAGE_KEYS.room);}
