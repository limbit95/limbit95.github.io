const GAME_BGM_CATALOG = Object.freeze({
  "the-game": Object.freeze({
    gameId: "the-game",
    entryPath: "/the-game/",
    src: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Invariance.mp3",
    title: "Invariance",
    artist: "Kevin MacLeod",
    sourceUrl: "https://incompetech.com/music/royalty-free/index.html?Search=Search&isrc=USUAN1100847",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    attribution: '"Invariance" Kevin MacLeod (incompetech.com)',
    modified: false,
    defaultVolume: 0.22,
    loop: true,
  }),
});

function normalizePathname(value) {
  if (typeof value !== "string" || !value) return "";
  try {
    return new URL(value, "https://cheongpa.invalid").pathname.replace(/\/+$/u, "/");
  } catch {
    return "";
  }
}

export function getGameBgm(gameId) {
  return GAME_BGM_CATALOG[String(gameId ?? "").trim()] ?? null;
}

export function listGameBgms() {
  return Object.values(GAME_BGM_CATALOG);
}

export function getGameBgmByEntryUrl(url) {
  const pathname = normalizePathname(url);
  if (!pathname) return null;
  return listGameBgms().find((track) => pathname.endsWith(track.entryPath)) ?? null;
}
