import { playAuctionStartSound } from "./auctionBidSound.js?v=20260922-r4";

const DEFAULT_AVATAR_URL = new URL("../../assets/images/default-avatar.svg", import.meta.url).href;
const SELECTOR_CARD_STEP = 102;
const SELECTOR_CYCLES = 10;
const avatarUrlCache = new Map();

function timeMs(value) {
  if (value === null || value === undefined) return null;
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return numeric;
  const parsed = Date.parse(String(value));
  return Number.isFinite(parsed) ? parsed : null;
}

function findPlayer(state, playerId) {
  return state?.players?.find((player) => player.id === playerId) ?? null;
}

function playerName(state, playerId) {
  const player = findPlayer(state, playerId);
  return player?.name || player?.id || "플레이어";
}

async function resolveAvatarUrl(player) {
  const path = player?.avatarPath;
  if (!path) return DEFAULT_AVATAR_URL;
  if (avatarUrlCache.has(path)) return avatarUrlCache.get(path);

  try {
    const { getSignedAvatarUrl } = await import("../../js/api/profiles.js");
    const url = await getSignedAvatarUrl(path);
    avatarUrlCache.set(path, url || DEFAULT_AVATAR_URL);
    return avatarUrlCache.get(path);
  } catch {
    avatarUrlCache.set(path, DEFAULT_AVATAR_URL);
    return DEFAULT_AVATAR_URL;
  }
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
  announceDetail.textContent = "참가자 중 경매 시작 플레이어를 정합니다";
  announce.append(announceEyebrow, announceTitle, announceDetail);

  const selector = documentObject.createElement("div");
  selector.className = "auction-starter-selector";
  selector.hidden = true;

  const selectorTitle = documentObject.createElement("strong");
  selectorTitle.className = "auction-starter-selector__title";
  selectorTitle.textContent = "경매 시작 플레이어 선택";

  const viewport = documentObject.createElement("div");
  viewport.className = "auction-starter-selector__viewport";
  const centerMark = documentObject.createElement("span");
  centerMark.className = "auction-starter-selector__center";
  centerMark.setAttribute("aria-hidden", "true");
  const track = documentObject.createElement("div");
  track.className = "auction-starter-selector__track";
  viewport.append(track, centerMark);

  const result = documentObject.createElement("strong");
  result.className = "auction-starter-selector__result";

  selector.append(selectorTitle, viewport, result);
  overlay.append(announce, selector);
  (documentObject.body ?? documentObject.documentElement).append(overlay);

  return {
    overlay,
    announce,
    selector,
    viewport,
    track,
    result,
  };
}

function createProfileCard(documentObject, state, playerId, { selected = false } = {}) {
  const player = findPlayer(state, playerId);
  const card = documentObject.createElement("div");
  card.className = "auction-starter-selector__card";
  card.dataset.playerId = playerId;
  if (selected) card.dataset.selected = "true";

  const image = documentObject.createElement("img");
  image.className = "auction-starter-selector__avatar";
  image.src = DEFAULT_AVATAR_URL;
  image.alt = "";
  image.width = 72;
  image.height = 72;

  const label = documentObject.createElement("span");
  label.textContent = playerName(state, playerId);

  card.append(image, label);

  void resolveAvatarUrl(player).then((url) => {
    if (image.isConnected) image.src = url;
  });

  return card;
}

function buildProfileChain(documentObject, elements, state, playerIds, startingPlayerId) {
  const count = Math.max(1, playerIds.length);
  const selectedIndex = Math.max(0, playerIds.indexOf(startingPlayerId));
  const targetIndex = (SELECTOR_CYCLES * count) + selectedIndex;
  const trailingCount = Math.max(count, 3);
  const totalCards = targetIndex + 1 + trailingCount;
  const cards = [];

  for (let index = 0; index < totalCards; index += 1) {
    const playerId = playerIds[index % count];
    cards.push(createProfileCard(documentObject, state, playerId, {
      selected: index === targetIndex,
    }));
  }

  elements.track.replaceChildren(...cards);
  elements.track.dataset.spinning = "false";
  elements.track.dataset.settled = "false";
  elements.result.textContent = `${playerName(state, startingPlayerId)}님부터 경매를 시작합니다!`;

  const viewportWidth = Number(elements.viewport.getBoundingClientRect?.().width) || 380;
  const cardHalf = 44;
  const targetCenter = (targetIndex * SELECTOR_CARD_STEP) + cardHalf;
  const shift = (viewportWidth / 2) - targetCenter;
  elements.track.style.setProperty("--auction-selector-shift", `${shift}px`);
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
    elements.selector.hidden = true;
    elements.announce.hidden = false;
  }

  function render(state, onBoundary = () => {}) {
    const pending = state?.pendingChoice;
    const auction = pending?.type === "PROPERTY_AUCTION" ? (pending.auction ?? {}) : null;
    const announcementEndsAt = timeMs(auction?.announcementEndsAt ?? pending?.announcementEndsAt);
    const selectionStopsAt = timeMs(auction?.selectionStopsAt ?? pending?.selectionStopsAt);
    const startsAt = timeMs(auction?.startsAt ?? pending?.startsAt);

    if (
      !auction
      || !Number.isFinite(announcementEndsAt)
      || !Number.isFinite(selectionStopsAt)
      || !Number.isFinite(startsAt)
    ) {
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
    const startingPlayerId = auction.startingPlayerId
      ?? pending.startingPlayerId
      ?? auction.turnPlayerId
      ?? playerIds[0]
      ?? null;
    const key = `${pending.nodeId}:${startsAt}:${startingPlayerId}`;
    const phase = now < announcementEndsAt
      ? "announce"
      : now < selectionStopsAt
        ? "selecting"
        : "result";

    if (activeKey !== key) {
      activeKey = key;
      spinningKey = null;
      buildProfileChain(
        documentObject,
        elements,
        state,
        playerIds,
        startingPlayerId,
      );
    }

    if (phase === "selecting" && spinningKey !== key) {
      spinningKey = key;
      elements.track.dataset.settled = "false";
      elements.track.dataset.spinning = "false";
      void elements.track.offsetWidth;
      elements.track.dataset.spinning = "true";
    }

    if (phase === "result") {
      elements.track.dataset.spinning = "false";
      elements.track.dataset.settled = "true";
    }

    if (playedSoundKey !== key) {
      playedSoundKey = key;
      playAuctionStartSound();
    }

    elements.overlay.hidden = false;
    elements.overlay.dataset.phase = phase;
    elements.announce.hidden = phase !== "announce";
    elements.selector.hidden = phase === "announce";

    clearBoundary();
    const nextBoundary = phase === "announce"
      ? announcementEndsAt
      : phase === "selecting"
        ? selectionStopsAt
        : startsAt;

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
