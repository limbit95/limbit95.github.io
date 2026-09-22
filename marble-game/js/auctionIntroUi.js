import { playAuctionStartSound } from "./auctionBidSound.js?v=20260922-r4";

const ROULETTE_COLORS = Object.freeze([
  "#ff6b6b",
  "#ffd43b",
  "#69db7c",
  "#4dabf7",
  "#9775fa",
  "#f783ac",
]);

function timeMs(value) {
  if (value === null || value === undefined) return null;
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return numeric;
  const parsed = Date.parse(String(value));
  return Number.isFinite(parsed) ? parsed : null;
}

function playerName(state, playerId) {
  return state?.players?.find((player) => player.id === playerId)?.name || playerId || "플레이어";
}

function createOverlay(documentObject) {
  const overlay = documentObject.createElement("section");
  overlay.className = "auction-intro";
  overlay.hidden = true;
  overlay.setAttribute("aria-live", "assertive");
  overlay.setAttribute("aria-atomic", "true");

  const announce = documentObject.createElement("div");
  announce.className = "auction-intro__announce";
  const announceEyebrow = documentObject.createElement("span");
  announceEyebrow.className = "auction-intro__eyebrow";
  announceEyebrow.textContent = "AUCTION";
  const announceTitle = documentObject.createElement("strong");
  announceTitle.textContent = "경매가 곧 시작됩니다!";
  const announceDetail = documentObject.createElement("span");
  announceDetail.textContent = "첫 입찰자를 정한 뒤 바로 경매를 시작합니다";
  announce.append(announceEyebrow, announceTitle, announceDetail);

  const roulette = documentObject.createElement("div");
  roulette.className = "auction-roulette";
  roulette.hidden = true;
  const rouletteTitle = documentObject.createElement("strong");
  rouletteTitle.className = "auction-roulette__title";
  rouletteTitle.textContent = "첫 입찰자를 정합니다";
  const wheelWrap = documentObject.createElement("div");
  wheelWrap.className = "auction-roulette__wheel-wrap";
  const pointer = documentObject.createElement("span");
  pointer.className = "auction-roulette__pointer";
  pointer.textContent = "▼";
  const wheel = documentObject.createElement("div");
  wheel.className = "auction-roulette__wheel";
  const hub = documentObject.createElement("span");
  hub.className = "auction-roulette__hub";
  hub.textContent = "BID";
  wheel.append(hub);
  wheelWrap.append(pointer, wheel);
  const result = documentObject.createElement("span");
  result.className = "auction-roulette__result";
  roulette.append(rouletteTitle, wheelWrap, result);

  overlay.append(announce, roulette);
  (documentObject.body ?? documentObject.documentElement).append(overlay);
  return { overlay, announce, roulette, wheel, result };
}

function renderWheel(documentObject, elements, state, playerIds, openingBidderPlayerId) {
  const count = Math.max(1, playerIds.length);
  const segment = 360 / count;
  const gradient = playerIds.map((_, index) => {
    const start = index * segment;
    const end = (index + 1) * segment;
    return `${ROULETTE_COLORS[index % ROULETTE_COLORS.length]} ${start}deg ${end}deg`;
  }).join(", ");
  elements.wheel.style.background = `conic-gradient(from -90deg, ${gradient})`;
  elements.wheel.querySelectorAll(".auction-roulette__label").forEach((label) => label.remove());

  playerIds.forEach((playerId, index) => {
    const angle = (index * segment) + (segment / 2);
    const label = documentObject.createElement("span");
    label.className = "auction-roulette__label";
    label.style.setProperty("--roulette-angle", `${angle}deg`);
    label.textContent = playerName(state, playerId);
    elements.wheel.append(label);
  });

  elements.result.textContent = `${playerName(state, openingBidderPlayerId)} · 첫 입찰`;
}

export function createAuctionIntroPresenter({
  documentObject = document,
  clock = Date.now,
  setTimeoutFn = globalThis.setTimeout,
  clearTimeoutFn = globalThis.clearTimeout,
} = {}) {
  const elements = createOverlay(documentObject);
  let activeKey = null;
  let spinningKey = null;
  let boundaryTimer = null;
  let playedSoundKey = null;

  function clearBoundary() {
    if (boundaryTimer !== null) clearTimeoutFn?.(boundaryTimer);
    boundaryTimer = null;
  }

  function hide() {
    clearBoundary();
    elements.overlay.hidden = true;
    elements.overlay.dataset.phase = "";
    elements.roulette.hidden = true;
    elements.announce.hidden = false;
  }

  function render(state, onBoundary = () => {}) {
    const pending = state?.pendingChoice;
    const auction = pending?.type === "PROPERTY_AUCTION" ? (pending.auction ?? {}) : null;
    const announcementEndsAt = timeMs(auction?.announcementEndsAt ?? pending?.announcementEndsAt);
    const startsAt = timeMs(auction?.startsAt ?? pending?.startsAt);
    if (!auction || !Number.isFinite(announcementEndsAt) || !Number.isFinite(startsAt)) {
      hide();
      activeKey = null;
      return false;
    }

    const now = Number(clock());
    if (!Number.isFinite(now) || now >= startsAt) {
      hide();
      return false;
    }

    const playerIds = [...(auction.participantPlayerIds ?? pending.participantPlayerIds ?? [])];
    const openingBidderPlayerId = auction.openingBidderPlayerId
      ?? pending.openingBidderPlayerId
      ?? playerIds[0]
      ?? null;
    const key = `${pending.nodeId}:${startsAt}:${openingBidderPlayerId}`;
    const phase = now < announcementEndsAt ? "announce" : "roulette";

    if (activeKey !== key) {
      activeKey = key;
      spinningKey = null;
      renderWheel(documentObject, elements, state, playerIds, openingBidderPlayerId);
      elements.wheel.dataset.spinning = "false";
    }

    if (phase === "roulette" && spinningKey !== key) {
      spinningKey = key;
      elements.wheel.dataset.spinning = "false";
      void elements.wheel.offsetWidth;
      elements.wheel.dataset.spinning = "true";
    }

    if (playedSoundKey !== key) {
      playedSoundKey = key;
      playAuctionStartSound();
    }

    elements.overlay.hidden = false;
    elements.overlay.dataset.phase = phase;
    elements.announce.hidden = phase !== "announce";
    elements.roulette.hidden = phase !== "roulette";

    clearBoundary();
    const nextBoundary = phase === "announce" ? announcementEndsAt : startsAt;
    boundaryTimer = setTimeoutFn?.(() => {
      boundaryTimer = null;
      onBoundary();
    }, Math.max(0, nextBoundary - now)) ?? null;
    return true;
  }

  return Object.freeze({
    render,
    hide,
    dispose() {
      clearBoundary();
      elements.overlay.remove();
    },
  });
}
