const PLAY_QUERY_KEY = "play";
const ONLINE_ROOM_QUERY_KEY = "onlineRoom";
const CLASSIC_PLAY_MODE = "classic";

export function createOnlineClassicPlayUrl(href, roomId) {
  const url = new URL(href);
  url.searchParams.set(PLAY_QUERY_KEY, CLASSIC_PLAY_MODE);
  url.searchParams.set(ONLINE_ROOM_QUERY_KEY, roomId);
  url.searchParams.delete("room");
  return url;
}

export function getOnlineRoomId(href) {
  const url = new URL(href);
  if (url.searchParams.get(PLAY_QUERY_KEY) !== CLASSIC_PLAY_MODE) return null;
  return url.searchParams.get(ONLINE_ROOM_QUERY_KEY) || null;
}

export function enterOnlineClassicPlay(roomId, { locationObject = window.location } = {}) {
  if (!roomId) throw new Error("ROOM_ID_REQUIRED");
  const url = createOnlineClassicPlayUrl(locationObject.href, roomId);
  locationObject.assign(url.href);
}
