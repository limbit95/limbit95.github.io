const GAME_BGM_CATALOG = Object.freeze({
  "liar-game": Object.freeze({
    gameId: "liar-game",
    src: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Deadly%20Roulette.mp3",
    title: "Deadly Roulette",
    artist: "Kevin MacLeod",
    isrc: "USUAN1600033",
    sourceUrl: "https://incompetech.com/music/royalty-free/index.html?Search=Search&isrc=USUAN1600033",
    previewUrl: "https://www.youtube.com/watch?v=Hnbv_KNxVo8",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    attribution: '"Deadly Roulette" Kevin MacLeod (incompetech.com)',
    modified: false,
    defaultVolume: 0.35,
    defaultOutputVolume: 0.35,
    loop: true,
  }),
  "the-game": Object.freeze({
    gameId: "the-game",
    src: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Invariance.mp3",
    title: "Invariance",
    artist: "Kevin MacLeod",
    isrc: "USUAN1100847",
    sourceUrl: "https://incompetech.com/music/royalty-free/index.html?Search=Search&isrc=USUAN1100847",
    previewUrl: "https://www.youtube.com/watch?v=CpPQeDIA2S0",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    attribution: '"Invariance" Kevin MacLeod (incompetech.com)',
    modified: false,
    defaultVolume: 0.22,
    loop: true,
  }),
});

export function getGameBgm(gameId) {
  return GAME_BGM_CATALOG[String(gameId ?? "").trim()] ?? null;
}

export function listGameBgms() {
  return Object.values(GAME_BGM_CATALOG);
}
