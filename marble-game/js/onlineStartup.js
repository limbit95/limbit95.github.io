export const ONLINE_INITIAL_LOAD_TIMEOUT_MS = 12000;

export function withOnlineStartupTimeout(promise, timeoutMs = ONLINE_INITIAL_LOAD_TIMEOUT_MS, {
  windowObject = globalThis.window,
} = {}) {
  if (!windowObject?.setTimeout || !windowObject?.clearTimeout) return promise;

  let timer = null;
  const timeout = new Promise((_, reject) => {
    timer = windowObject.setTimeout(() => reject(new Error("ONLINE_GAME_LOAD_TIMEOUT")), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timer !== null) windowObject.clearTimeout(timer);
  });
}

export function showOnlineModuleLoadError(error, {
  documentObject = globalThis.document,
} = {}) {
  console.error("Marble online game module failed to load", error);
  const playtestSection = documentObject?.querySelector?.("[data-playtest-section]");
  const gameMessage = documentObject?.querySelector?.("[data-game-message]");
  const primaryActionButton = documentObject?.querySelector?.("[data-primary-action]");
  if (playtestSection) playtestSection.hidden = false;
  if (gameMessage) gameMessage.textContent = "온라인 게임 화면을 불러오지 못했습니다. 페이지를 새로고침해 주세요.";
  if (primaryActionButton) primaryActionButton.hidden = true;
}
