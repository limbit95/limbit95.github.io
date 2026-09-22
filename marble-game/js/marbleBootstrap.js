import "../../js/accessTracker.js";

const BOOTSTRAP_REVISION = "20260923-r2";
const PLAY_QUERY_KEY = "play";
const ONLINE_ROOM_QUERY_KEY = "onlineRoom";
const ONLINE_VISUAL_QUERY_KEY = "marbleVisuals";

export function getMarbleBootstrapMode(href) {
  const url = new URL(href);
  const isClassicPlay = url.searchParams.get(PLAY_QUERY_KEY) === "classic";
  if (!isClassicPlay) return "full";
  if (!url.searchParams.get(ONLINE_ROOM_QUERY_KEY)) return "local-play";
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
    await importModule("./playWindow.js?v=20260923-r2");
    return mode;
  }

  if (mode === "online") {
    await importModule("./playWindow.js?v=20260923-r2");
    await importModule("./diceCharge.js?v=20260910-r12");
    await importModule("./onlineGameExit.js?v=20260910-r13");
    await importModule("./ownershipVisualLoader.js?v=20260910-r10");
    return mode;
  }

  if (mode === "local-play") {
    // Keep the dedicated local play window free from lobby and online lifecycle modules.
    await importModule("./app.js?v=20260923-r2");
    await importModule("./diceCharge.js?v=20260910-r7");
    await importModule("./playWindow.js?v=20260923-r2");
    await importModule("./ownershipVisualLoader.js?v=20260910-r10");
    return mode;
  }

  await importModule("./app.js?v=20260923-r2");
  await importModule("./multiplayerLobby.js?v=20260914-r8");
  await importModule("./diceCharge.js?v=20260910-r7");
  await importModule("./playWindow.js?v=20260923-r2");
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
