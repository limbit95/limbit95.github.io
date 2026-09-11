const COMPACT_PLAY_WIDTH = 900;
const PLAY_QUERY_KEY = "play";
const ONLINE_ROOM_QUERY_KEY = "onlineRoom";
const ONLINE_VISUAL_QUERY_KEY = "marbleVisuals";
const CLASSIC_PLAY_MODE = "classic";
const ONLINE_DEFAULT_VISUAL_MODE = "full";
const PLAY_WINDOW_NAME = "marbleClassicPlay";

function shouldUseSameTab({ innerWidth = 0, coarsePointer = false } = {}) {
  return innerWidth <= COMPACT_PLAY_WIDTH || coarsePointer;
}

function buildPopupFeatures({
  availWidth = 1440,
  availHeight = 900,
  availLeft = 0,
  availTop = 0,
} = {}) {
  const width = Math.min(availWidth, Math.max(960, Math.round(availWidth * 0.94)));
  const height = Math.min(availHeight, Math.max(720, Math.round(availHeight * 0.92)));
  const left = availLeft + Math.max(0, Math.round((availWidth - width) / 2));
  const top = availTop + Math.max(0, Math.round((availHeight - height) / 2));

  return [
    "popup=yes",
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
    "resizable=yes",
    "scrollbars=yes",
  ].join(",");
}

function popupEligible(windowObject) {
  const coarsePointer = Boolean(windowObject?.matchMedia?.("(pointer: coarse)")?.matches);
  return typeof windowObject?.open === "function"
    && !shouldUseSameTab({ innerWidth: windowObject?.innerWidth ?? 0, coarsePointer });
}

export function createOnlineClassicPlayUrl(href, roomId) {
  const url = new URL(href);
  url.searchParams.set(PLAY_QUERY_KEY, CLASSIC_PLAY_MODE);
  url.searchParams.set(ONLINE_ROOM_QUERY_KEY, roomId);
  url.searchParams.set(ONLINE_VISUAL_QUERY_KEY, ONLINE_DEFAULT_VISUAL_MODE);
  url.searchParams.delete("room");
  return url;
}

export function getOnlineRoomId(href) {
  const url = new URL(href);
  if (url.searchParams.get(PLAY_QUERY_KEY) !== CLASSIC_PLAY_MODE) return null;
  return url.searchParams.get(ONLINE_ROOM_QUERY_KEY) || null;
}

export function reserveOnlineClassicPlayWindow({
  windowObject = globalThis.window,
  screenObject = globalThis.screen,
} = {}) {
  if (!popupEligible(windowObject)) return null;
  const popup = windowObject.open(
    "about:blank",
    PLAY_WINDOW_NAME,
    buildPopupFeatures(screenObject ?? undefined),
  );
  popup?.focus?.();
  return popup ?? null;
}

export function enterOnlineClassicPlay(roomId, {
  windowObject = globalThis.window,
  locationObject = globalThis.location,
  screenObject = globalThis.screen,
  popupWindow = null,
} = {}) {
  if (!roomId) throw new Error("ROOM_ID_REQUIRED");
  if (!locationObject?.href || typeof locationObject.assign !== "function") {
    throw new Error("PLAY_LOCATION_REQUIRED");
  }

  const url = createOnlineClassicPlayUrl(locationObject.href, roomId);
  const coarsePointer = Boolean(windowObject?.matchMedia?.("(pointer: coarse)")?.matches);

  if (shouldUseSameTab({
    innerWidth: windowObject?.innerWidth ?? 0,
    coarsePointer,
  })) {
    locationObject.assign(url.href);
    return "same-tab";
  }

  if (popupWindow && popupWindow.closed !== true) {
    if (typeof popupWindow.location?.replace === "function") popupWindow.location.replace(url.href);
    else popupWindow.location.href = url.href;
    popupWindow.focus?.();
    return "popup";
  }

  const popup = windowObject?.open?.(
    url.href,
    PLAY_WINDOW_NAME,
    buildPopupFeatures(screenObject ?? undefined),
  );

  if (!popup) return "blocked";

  popup.focus?.();
  return "popup";
}
