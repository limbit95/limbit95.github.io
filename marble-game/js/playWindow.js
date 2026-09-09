import { getOnlineRoomId } from "./onlinePlayRoute.js";
import { showOnlineModuleLoadError } from "./onlineStartup.js";

const COMPACT_PLAY_WIDTH = 900;
const PLAY_QUERY_KEY = "play";
const ONLINE_ROOM_QUERY_KEY = "onlineRoom";
const CLASSIC_PLAY_MODE = "classic";
const PLAY_WINDOW_NAME = "marbleClassicPlay";

export function createClassicPlayUrl(href) {
  const url = new URL(href);
  url.searchParams.set(PLAY_QUERY_KEY, CLASSIC_PLAY_MODE);
  url.searchParams.delete(ONLINE_ROOM_QUERY_KEY);
  return url;
}

export function isClassicPlayUrl(href) {
  return new URL(href).searchParams.get(PLAY_QUERY_KEY) === CLASSIC_PLAY_MODE;
}

export function shouldUseSameTab({ innerWidth = 0, coarsePointer = false } = {}) {
  return innerWidth <= COMPACT_PLAY_WIDTH || coarsePointer;
}

export function getPopupRect({
  availWidth = 1440,
  availHeight = 900,
  availLeft = 0,
  availTop = 0,
} = {}) {
  const width = Math.min(availWidth, Math.max(960, Math.round(availWidth * 0.94)));
  const height = Math.min(availHeight, Math.max(720, Math.round(availHeight * 0.92)));

  return {
    width,
    height,
    left: availLeft + Math.max(0, Math.round((availWidth - width) / 2)),
    top: availTop + Math.max(0, Math.round((availHeight - height) / 2)),
  };
}

export function buildPopupFeatures(screenLike = {}) {
  const rect = getPopupRect(screenLike);
  return [
    "popup=yes",
    `width=${rect.width}`,
    `height=${rect.height}`,
    `left=${rect.left}`,
    `top=${rect.top}`,
    "resizable=yes",
    "scrollbars=yes",
  ].join(",");
}

export function launchClassicPlay({
  windowObject = window,
  locationObject = window.location,
  screenObject = window.screen,
} = {}) {
  const playUrl = createClassicPlayUrl(locationObject.href);
  const coarsePointer = Boolean(windowObject.matchMedia?.("(pointer: coarse)")?.matches);

  if (shouldUseSameTab({ innerWidth: windowObject.innerWidth, coarsePointer })) {
    locationObject.assign(playUrl.href);
    return "same-tab";
  }

  const popup = windowObject.open(
    playUrl.href,
    PLAY_WINDOW_NAME,
    buildPopupFeatures(screenObject),
  );

  if (!popup) {
    locationObject.assign(playUrl.href);
    return "same-tab";
  }

  popup.focus?.();
  return "popup";
}

function updateEntryNote() {
  if (document.body.dataset.theme !== "classic") return;

  const startButton = document.querySelector("[data-start-playtest]");
  const note = document.querySelector("[data-playtest-entry-note]");
  if (startButton && !startButton.disabled) startButton.textContent = "Classic 플레이 창 열기";
  if (note) {
    note.textContent = "데스크톱에서는 넓은 별도 플레이 창으로 열립니다. 모바일 또는 팝업 차단 시 현재 탭에서 진행합니다.";
  }
}

function leavePlayMode() {
  if (window.opener && !window.opener.closed) {
    window.close();
    return;
  }

  const lobbyUrl = new URL(window.location.href);
  lobbyUrl.searchParams.delete(PLAY_QUERY_KEY);
  lobbyUrl.searchParams.delete(ONLINE_ROOM_QUERY_KEY);
  window.location.assign(lobbyUrl.href);
}

function setupLobbyLauncher(startButton) {
  startButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    launchClassicPlay();
  }, true);

  const themeGrid = document.querySelector("[data-theme-grid]");
  themeGrid?.addEventListener("click", () => queueMicrotask(updateEntryNote));
  queueMicrotask(updateEntryNote);
}

function setupDedicatedPlayMode(startButton) {
  const onlineRoomId = getOnlineRoomId(window.location.href);
  document.body.dataset.playMode = "window";
  document.body.dataset.sessionMode = onlineRoomId ? "online" : "local";
  document.title = onlineRoomId ? "Marble Classic · Online" : "Marble Classic · Play";

  const exitButton = document.querySelector("[data-exit-play]");
  if (exitButton) {
    exitButton.hidden = false;
    exitButton.addEventListener("click", leavePlayMode);
  }

  if (onlineRoomId) {
    void import("./onlineGameController.js").catch((error) => {
      showOnlineModuleLoadError(error);
    });
    return;
  }

  window.setTimeout(() => {
    startButton.click();
    document.querySelector("[data-playtest-section]")?.scrollIntoView({ block: "start" });
  }, 0);
}

export function setupPlayWindow() {
  const startButton = document.querySelector("[data-start-playtest]");
  if (!startButton) return;

  if (isClassicPlayUrl(window.location.href)) {
    setupDedicatedPlayMode(startButton);
  } else {
    setupLobbyLauncher(startButton);
  }
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  setupPlayWindow();
}
