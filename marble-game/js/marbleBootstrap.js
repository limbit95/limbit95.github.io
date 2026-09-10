const BOOTSTRAP_REVISION = "20260910-r10";
const PLAY_QUERY_KEY = "play";
const ONLINE_ROOM_QUERY_KEY = "onlineRoom";
const ONLINE_VISUAL_QUERY_KEY = "marbleVisuals";

export function getMarbleBootstrapMode(href) {
  const url = new URL(href);
  const isOnlineGame = url.searchParams.get(PLAY_QUERY_KEY) === "classic"
    && Boolean(url.searchParams.get(ONLINE_ROOM_QUERY_KEY));
  if (!isOnlineGame) return "full";
  return url.searchParams.get(ONLINE_VISUAL_QUERY_KEY) === "2d" ? "online-2d" : "online";
}

export async function loadMarblePage({
  href = globalThis.location?.href ?? "https://example.invalid/marble-game/",
  documentObject = globalThis.document,
  importModule = (specifier) => import(specifier),
} = {}) {
  const mode = getMarbleBootstrapMode(href);
  if (documentObject?.body?.dataset) {
    documentObject.body.dataset.marbleBootstrapRevision = BOOTSTRAP_REVISION;
    documentObject.body.dataset.marbleBootstrapMode = mode;
  }

  if (mode === "online-2d") {
    // Strict diagnostic path: do not evaluate local app, dice, ownership or other WebGL entry modules.
    await importModule("./playWindow.js?v=20260910-r10");
    return mode;
  }

  if (mode === "online") {
    // Restore isolated gameplay enhancements one at a time after the renderer startup issue is stable.
    await importModule("./playWindow.js?v=20260910-r10");
    await importModule("./diceCharge.js?v=20260910-r12");
    await importModule("./onlineGameExit.js?v=20260910-r13");
    return mode;
  }

  await importModule("./app.js?v=20260910-r7");
  await importModule("./multiplayerLobby.js?v=20260910-r7");
  await importModule("./diceCharge.js?v=20260910-r7");
  await importModule("./playWindow.js?v=20260910-r10");
  await importModule("./onlineGameExit.js?v=20260910-r10");
  await importModule("./ownershipVisualLoader.js?v=20260910-r10");
  return mode;
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  void loadMarblePage().catch((error) => {
    console.error("Marble page bootstrap failed", error);
    document.body.dataset.marbleBootstrapMode = "failed";
  });
}
