import {
  MVP_CATALOG,
  buildMvpAwards,
  createRoundStats,
  formatMvpValue,
  getMvpDefinition,
  recordRoundPlay,
} from "./gameStats.js";

const TOTAL_NUMBER_CARDS = 98;

let statsApiPromise = null;
let personalOverlay = null;
let personalTrigger = null;
let localRoundStats = null;
let localTurnNumber = 1;
let onlineStatsGameId = null;
let onlineStatsLoading = false;
let syncQueued = false;

function ensureSupabaseLibrary() {
  if (window.supabase?.createClient) return Promise.resolve();

  const existing = document.querySelector("script[data-the-game-supabase]");
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Supabase 라이브러리를 불러오지 못했습니다.")),
        { once: true },
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    script.async = true;
    script.dataset.theGameSupabase = "true";
    script.addEventListener("load", resolve, { once: true });
    script.addEventListener(
      "error",
      () => reject(new Error("Supabase 라이브러리를 불러오지 못했습니다.")),
      { once: true },
    );
    document.head.append(script);
  });
}

async function getStatsApi() {
  statsApiPromise ??= (async () => {
    await ensureSupabaseLibrary();
    return import("./multiplayerApi.js");
  })();
  return statsApiPromise;
}

function winnerNames(award) {
  return (award?.winners ?? [])
    .map((winner) => winner.nickname || (winner.playerIndex !== undefined ? `플레이어 ${winner.playerIndex + 1}` : `플레이어 ${winner.seat ?? 1}`))
    .join(" · ");
}

function createAwardCard(award, featured = false) {
  const definition = getMvpDefinition(award.code);
  if (!definition) return null;

  const card = document.createElement("article");
  card.className = featured ? "round-mvp-feature" : "round-mvp-card";
  card.dataset.mvpCode = award.code;

  const icon = document.createElement("span");
  icon.className = "round-mvp-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = definition.icon;

  const copy = document.createElement("div");
  copy.className = "round-mvp-copy";

  const label = document.createElement("span");
  label.className = "round-mvp-label";
  label.textContent = definition.title;

  const names = document.createElement("strong");
  names.textContent = winnerNames(award);

  const value = document.createElement("span");
  value.className = "round-mvp-value";
  value.textContent = formatMvpValue(award.code, award.winners?.[0]?.value);

  copy.append(label, names, value);
  card.append(icon, copy);
  return card;
}

function renderRoundMvp(container, awards, { loading = false, error = "" } = {}) {
  container.replaceChildren();
  container.hidden = false;

  const header = document.createElement("div");
  header.className = "round-mvp-header";
  const eyebrow = document.createElement("span");
  eyebrow.textContent = "ROUND AWARDS";
  const title = document.createElement("strong");
  title.textContent = "이번 판 MVP";
  header.append(eyebrow, title);
  container.append(header);

  if (loading) {
    const state = document.createElement("p");
    state.className = "round-mvp-state";
    state.textContent = "이번 판 기록을 집계하고 있습니다…";
    container.append(state);
    return;
  }

  if (error) {
    const state = document.createElement("p");
    state.className = "round-mvp-state";
    state.textContent = error;
    container.append(state);
    return;
  }

  if (!Array.isArray(awards) || awards.length === 0) {
    const state = document.createElement("p");
    state.className = "round-mvp-state";
    state.textContent = "이번 판에는 집계할 MVP 기록이 없습니다.";
    container.append(state);
    return;
  }

  const featured = createAwardCard(awards[0], true);
  if (featured) container.append(featured);

  if (awards.length > 1) {
    const grid = document.createElement("div");
    grid.className = "round-mvp-grid";
    for (const award of awards.slice(1)) {
      const card = createAwardCard(award);
      if (card) grid.append(card);
    }
    if (grid.childElementCount > 0) container.append(grid);
  }
}

function ensureLocalMvpContainer() {
  const resultCard = document.querySelector("#result-overlay .result-card");
  if (!resultCard) return null;
  let container = resultCard.querySelector("[data-local-round-mvp]");
  if (container) return container;

  container = document.createElement("section");
  container.className = "round-mvp-section";
  container.dataset.localRoundMvp = "true";
  container.hidden = true;
  const actions = resultCard.querySelector(".result-actions");
  resultCard.insertBefore(container, actions);
  return container;
}

function ensureOnlineMvpContainer() {
  const result = document.querySelector("[data-online-result]");
  if (!result) return null;
  let container = result.querySelector("[data-online-round-mvp]");
  if (container) return container;

  container = document.createElement("section");
  container.className = "round-mvp-section";
  container.dataset.onlineRoundMvp = "true";
  container.hidden = true;
  const note = result.querySelector("[data-online-result-rematch-note]");
  result.insertBefore(container, note);
  return container;
}

function resetLocalStats(playerCount) {
  localRoundStats = Number.isInteger(playerCount) && playerCount > 0
    ? createRoundStats({ playerCount })
    : null;
  localTurnNumber = 1;
  const container = ensureLocalMvpContainer();
  if (container) {
    container.hidden = true;
    container.replaceChildren();
  }
}

function selectedLocalCard() {
  const selected = document.querySelector("#game-screen .number-card.is-selected");
  const value = Number(selected?.dataset.card ?? selected?.textContent);
  return Number.isInteger(value) ? value : null;
}

function currentLocalPlayerIndex() {
  const text = document.querySelector("#turn-label")?.textContent ?? "";
  const match = text.match(/플레이어\s*(\d+)/);
  return match ? Number(match[1]) - 1 : 0;
}

function captureLocalPilePlay(event) {
  if (!localRoundStats) return;
  const pile = event.target.closest("#game-screen [data-pile-id]");
  if (!pile || pile.disabled) return;

  const card = selectedLocalCard();
  if (!Number.isInteger(card)) return;

  const previousValue = Number(pile.querySelector(".pile-value")?.textContent);
  const pileDirection = pile.classList.contains("ascending") ? "ascending" : "descending";
  const playerIndex = currentLocalPlayerIndex();
  const remainingBefore = TOTAL_NUMBER_CARDS - localRoundStats.totalCardsPlayed;

  recordRoundPlay(localRoundStats, {
    playerIndex,
    card,
    pileDirection,
    previousValue: Number.isInteger(previousValue) ? previousValue : null,
    turnNumber: localTurnNumber,
    remainingBefore,
  });
}

function syncLocalResult() {
  const overlay = document.querySelector("#result-overlay");
  const container = ensureLocalMvpContainer();
  if (!overlay || !container) return;

  if (overlay.hidden || !localRoundStats) {
    container.hidden = true;
    delete container.dataset.renderKey;
    return;
  }

  const awards = buildMvpAwards(localRoundStats);
  const renderKey = JSON.stringify(awards);
  if (container.dataset.renderKey === renderKey) return;
  renderRoundMvp(container, awards);
  container.dataset.renderKey = renderKey;
}

async function syncOnlineResult() {
  const result = document.querySelector("[data-online-result]");
  const container = ensureOnlineMvpContainer();
  if (!result || !container) return;

  if (result.hidden) {
    container.hidden = true;
    delete container.dataset.loaded;
    onlineStatsGameId = null;
    return;
  }
  if (container.dataset.loaded === "true" || onlineStatsLoading) return;

  onlineStatsLoading = true;
  renderRoundMvp(container, [], { loading: true });
  try {
    const api = await getStatsApi();
    const active = await api.getMyActiveGame();
    const gameId = active?.game?.id;
    const roomId = active?.room?.id;
    if (!gameId || !roomId || !["won", "lost"].includes(active.game.status)) {
      throw new Error("FINISHED_GAME_NOT_FOUND");
    }

    const stats = await api.getGameStats(roomId);
    renderRoundMvp(container, stats?.mvp ?? []);
    onlineStatsGameId = gameId;
    container.dataset.loaded = "true";
  } catch (error) {
    console.warn("The Game round stats could not be loaded.", error);
    renderRoundMvp(container, [], { error: "이번 판 MVP 기록을 불러오지 못했습니다." });
    container.dataset.loaded = "true";
  } finally {
    onlineStatsLoading = false;
  }
}

function ensurePersonalOverlay() {
  if (personalOverlay) return personalOverlay;

  personalOverlay = document.createElement("div");
  personalOverlay.id = "the-game-stats-overlay";
  personalOverlay.className = "overlay stats-overlay";
  personalOverlay.hidden = true;
  personalOverlay.innerHTML = `
    <section class="overlay-card stats-modal" role="dialog" aria-modal="true" aria-labelledby="the-game-stats-title">
      <header class="stats-modal__header">
        <div>
          <p class="eyebrow">MY RECORD</p>
          <h2 id="the-game-stats-title">내 기록</h2>
        </div>
        <button class="ghost-button stats-modal__close" type="button" data-stats-close>닫기</button>
      </header>
      <div class="stats-modal__content" data-stats-content></div>
    </section>
  `;

  personalOverlay.addEventListener("click", (event) => {
    if (event.target === personalOverlay || event.target.closest("[data-stats-close]")) {
      closePersonalStats();
    }
  });
  document.body.append(personalOverlay);
  return personalOverlay;
}

function statTile(label, value, accent = false) {
  return `
    <div class="personal-stat-tile${accent ? " is-accent" : ""}">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function formatStatNumber(value, fallback = "0") {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString("ko-KR") : fallback;
}

function renderPersonalStats(stats) {
  const content = ensurePersonalOverlay().querySelector("[data-stats-content]");
  const games = Number(stats?.games_played ?? 0);
  const mvpCounts = stats?.mvp_counts ?? {};
  const recent = Array.isArray(stats?.recent_games) ? stats.recent_games : [];
  const averageGap = Number(stats?.average_gap);
  const bestLoss = stats?.best_loss_remaining;

  const awardCards = MVP_CATALOG.map((item) => `
    <article class="personal-award-card${Number(mvpCounts[item.code] ?? 0) > 0 ? " is-earned" : ""}">
      <span class="personal-award-icon" aria-hidden="true">${item.icon}</span>
      <div>
        <strong>${item.title}</strong>
        <span>${item.description}</span>
      </div>
      <b>${formatStatNumber(mvpCounts[item.code] ?? 0)}회</b>
    </article>
  `).join("");

  const recentRows = recent.length > 0
    ? recent.map((game) => {
      const won = game.outcome === "won";
      const date = game.finished_at
        ? new Date(game.finished_at).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" })
        : "";
      return `
        <li class="recent-game-row">
          <span class="recent-game-outcome ${won ? "is-won" : "is-lost"}">${won ? "승리" : "패배"}</span>
          <div>
            <strong>${formatStatNumber(game.cards_played)}장 플레이 · ±10 ${formatStatNumber(game.reverse_jumps)}회</strong>
            <span>${won ? "완전 클리어" : `남은 카드 ${formatStatNumber(game.remaining_cards)}장`}</span>
          </div>
          <time>${date}</time>
        </li>
      `;
    }).join("")
    : `<li class="stats-empty-row">아직 저장된 온라인 플레이 기록이 없습니다.</li>`;

  content.innerHTML = `
    <p class="stats-modal__note">온라인 플레이 · 통계 기능 도입 이후 기록입니다.</p>

    <section class="personal-stat-section">
      <div class="personal-stat-grid personal-stat-grid--primary">
        ${statTile("플레이", `${formatStatNumber(games)}회`)}
        ${statTile("승리", `${formatStatNumber(stats?.wins)}회`, true)}
        ${statTile("승률", `${Number(stats?.win_rate ?? 0).toFixed(1)}%`, true)}
        ${statTile("최고 연승", `${formatStatNumber(stats?.best_win_streak)}회`)}
      </div>
    </section>

    <section class="personal-stat-section">
      <div class="stats-section-heading">
        <span>PERFORMANCE</span>
        <strong>플레이 기록</strong>
      </div>
      <div class="personal-stat-grid">
        ${statTile("총 카드 제출", `${formatStatNumber(stats?.total_cards_played)}장`)}
        ${statTile("총 ±10", `${formatStatNumber(stats?.total_reverse_jumps)}회`)}
        ${statTile("한 판 최고 ±10", `${formatStatNumber(stats?.best_reverse_jumps)}회`)}
        ${statTile("한 턴 최고", `${formatStatNumber(stats?.best_turn_cards)}장`)}
        ${statTile("최대 ±10 콤보", `${formatStatNumber(stats?.best_reverse_combo)}연속`)}
        ${statTile("평균 숫자 간격", Number.isFinite(averageGap) ? averageGap.toFixed(1) : "-")}
        ${statTile("패배 최고 기록", bestLoss === null || bestLoss === undefined ? "-" : `${formatStatNumber(bestLoss)}장 남음`)}
        ${statTile("현재 연승", `${formatStatNumber(stats?.current_win_streak)}회`)}
      </div>
    </section>

    <section class="personal-stat-section">
      <div class="stats-section-heading">
        <span>MVP COLLECTION</span>
        <strong>수상 기록</strong>
      </div>
      <div class="personal-award-grid">${awardCards}</div>
    </section>

    <section class="personal-stat-section">
      <div class="stats-section-heading">
        <span>RECENT 10</span>
        <strong>최근 게임</strong>
      </div>
      <ul class="recent-game-list">${recentRows}</ul>
    </section>
  `;
}

function renderPersonalLoading() {
  const content = ensurePersonalOverlay().querySelector("[data-stats-content]");
  content.innerHTML = `<div class="stats-loading">내 기록을 불러오고 있습니다…</div>`;
}

function renderPersonalError(error) {
  const content = ensurePersonalOverlay().querySelector("[data-stats-content]");
  const authRequired = (error?.message ?? "").includes("AUTH_REQUIRED");
  content.innerHTML = authRequired
    ? `
      <div class="stats-gate">
        <strong>로그인 후 누적 기록을 확인할 수 있습니다.</strong>
        <p>온라인 플레이 기록은 청파 같이 로그인 계정에 저장됩니다.</p>
        <a class="primary-button button-link" href="../#/login">로그인하러 가기</a>
      </div>
    `
    : `
      <div class="stats-gate">
        <strong>내 기록을 불러오지 못했습니다.</strong>
        <p>잠시 후 다시 시도해 주세요.</p>
      </div>
    `;
}

async function openPersonalStats(trigger) {
  personalTrigger = trigger;
  const overlay = ensurePersonalOverlay();
  overlay.hidden = false;
  document.body.classList.add("stats-modal-open");
  renderPersonalLoading();
  overlay.querySelector("[data-stats-close]")?.focus({ preventScroll: true });

  try {
    const api = await getStatsApi();
    renderPersonalStats(await api.getMyStats());
  } catch (error) {
    console.warn("The Game personal stats could not be loaded.", error);
    renderPersonalError(error);
  }
}

function closePersonalStats() {
  if (!personalOverlay || personalOverlay.hidden) return;
  personalOverlay.hidden = true;
  document.body.classList.remove("stats-modal-open");
  personalTrigger?.focus?.({ preventScroll: true });
  personalTrigger = null;
}

function installRecordButton() {
  const modeScreen = document.querySelector("#mode-screen");
  if (!modeScreen) return false;
  if (modeScreen.querySelector("[data-personal-stats-open]")) return true;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "ghost-button record-open-button";
  button.dataset.personalStatsOpen = "true";
  button.innerHTML = `<span>STATS</span><strong>내 기록</strong>`;
  button.addEventListener("click", () => openPersonalStats(button));
  modeScreen.append(button);
  return true;
}

function queueSync() {
  if (syncQueued) return;
  syncQueued = true;
  queueMicrotask(() => {
    syncQueued = false;
    installRecordButton();
    syncLocalResult();
    syncOnlineResult();
  });
}

document.addEventListener("submit", (event) => {
  if (event.target?.id !== "setup-form") return;
  const playerCount = Number(new FormData(event.target).get("player-count"));
  resetLocalStats(playerCount);
}, true);

document.addEventListener("click", (event) => {
  if (event.target.closest("#game-screen [data-pile-id]")) {
    captureLocalPilePlay(event);
    return;
  }

  if (event.target.closest("#end-turn-button") && !event.target.closest("#end-turn-button")?.disabled) {
    localTurnNumber += 1;
    return;
  }

  if (event.target.closest("#restart-button") && localRoundStats) {
    resetLocalStats(localRoundStats.players.length);
    return;
  }

  if (event.target.closest("#setup-button, #quit-button")) {
    localRoundStats = null;
  }
}, true);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && personalOverlay && !personalOverlay.hidden) {
    closePersonalStats();
  }
});

const observer = new MutationObserver(queueSync);
observer.observe(document.body, {
  subtree: true,
  childList: true,
  characterData: true,
  attributes: true,
  attributeFilter: ["hidden"],
});

ensureLocalMvpContainer();
installRecordButton();
queueSync();
