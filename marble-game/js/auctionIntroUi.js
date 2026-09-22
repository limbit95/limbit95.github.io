import { playAuctionStartSound } from "./auctionBidSound.js?v=20260922-r4";

const DEFAULT_AVATAR = "../assets/images/default-avatar.svg";
const SELECTOR_ITEM_WIDTH = 72;
const SELECTOR_ITEM_STEP = 92;
const SELECTOR_CYCLES = 6;

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
  return player?.name || playerId || "플레이어";
}

function normalizeAvatarUrl(url) {
  if (!url) return DEFAULT_AVATAR;
  if (url.startsWith("./assets/")) return `../${url.slice(2)}`;
  return url;
}

async function loadAvatarUrls(state, playerIds) {
  const players = playerIds.map((playerId) => findPlayer(state, playerId)).filter(Boolean);
  const userIds = [...new Set(players.map((player) => player.userId).filter(Boolean))];
  if (!userIds.length) return new Map();

  try {
    const { getPublicProfiles, getSignedAvatarUrl } = await import("../../js/api/profiles.js");
    const profiles = await getPublicProfiles(userIds);
    const avatarEntries = await Promise.all((profiles ?? []).map(async (profile) => [
      profile.id,
      normalizeAvatarUrl(await getSignedAvatarUrl(profile.avatar_path)),
    ]));
    return new Map(avatarEntries);
  } catch {
    return new Map();
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
  announceDetail.textContent = "경매 시작 플레이어를 정한 뒤 바로 시작합니다";
  announce.append(announceEyebrow, announceTitle, announceDetail);

  const selector = documentObject.createElement("div");
  selector.className = "auction-selector";
  selector.hidden = true;
  const selectorTitle = documentObject.createElement("strong");
  selectorTitle.className = "auction-selector__title";
  selectorTitle.textContent = "경매 시작 플레이어를 정합니다";
  const viewport = documentObject.createElement("div");
  viewport.className = "auction-selector__viewport";
  const marker = documentObject.createElement("span");
  marker.className = "auction-selector__marker";
  marker.setAttribute("aria-hidden", "true");
  const track = documentObject.createElement("div");
  track.className = "auction-selector__track";
  viewport.append(track, marker);
  const result = documentObject.createElement("strong");
  result.className = "auction-selector__result";
  selector.append(selectorTitle, viewport, result);

  overlay.append(announce, selector);
  (documentObject.body ?? documentObject.documentElement).append(overlay);
  return { overlay, announce, selector, viewport, track, result };
}

function selectorSequence(playerIds, starterPlayerId) {
  const sequence = [];
  for (let cycle = 0; cycle < SELECTOR_CYCLES; cycle += 1) {
    sequence.push(...playerIds);
  }
  const starterIndex = playerIds.indexOf(starterPlayerId);
  if (starterIndex < 0) return { sequence, targetIndex: Math.max(0, sequence.length - 1) };
  sequence.push(...playerIds.slice(0, starterIndex + 1));
  return { sequence, targetIndex: sequence.length - 1 };
}

function renderSelector(documentObject, elements, state, playerIds, starterPlayerId) {
  const { sequence, targetIndex } = selectorSequence(playerIds, starterPlayerId);
  const nodes = sequence.map((playerId, index) => {
    const player = findPlayer(state, playerId);
    const card = documentObject.createElement("div");
    card.className = "auction-selector__player";
    card.dataset.playerId = playerId;
    if (index === targetIndex) card.dataset.selected = "true";

    const image = documentObject.createElement("img");
    image.className = "auction-selector__avatar";
    image.src = DEFAULT_AVATAR;
    image.alt = "";
    image.width = SELECTOR_ITEM_WIDTH;
    image.height = SELECTOR_ITEM_WIDTH;
    if (player?.userId) image.dataset.userId = player.userId;

    const name = documentObject.createElement("span");
    name.textContent = playerName(state, playerId);
    card.append(image, name);
    return card;
  });

  elements.track.replaceChildren(...nodes);
  elements.track.dataset.spinning = "false";
  elements.track.style.removeProperty("--selector-start");
  elements.track.style.removeProperty("--selector-target");
  elements.result.textContent = `${playerName(state, starterPlayerId)}님부터 경매를 시작합니다!`;
  return targetIndex;
}

function applyAvatarUrls(elements, avatarUrls) {
  elements.track.querySelectorAll("img[data-user-id]").forEach((image) => {
    image.src = avatarUrls.get(image.dataset.userId) ?? DEFAULT_AVATAR;
  });
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
  let avatarLoadKey = null;
  let boundaryTimer = null;
  let playedSoundKey = null;
  let targetIndex = 0;

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

  function startSelectorAnimation(key) {
    if (spinningKey === key) return;
    spinningKey = key;
    const viewportWidth = elements.viewport.getBoundingClientRect?.().width || 340;
    const start = (viewportWidth / 2) - (SELECTOR_ITEM_WIDTH / 2);
    const target = start - (targetIndex * SELECTOR_ITEM_STEP);
    elements.track.style.setProperty("--selector-start", `${start}px`);
    elements.track.style.setProperty("--selector-target", `${target}px`);
    elements.track.dataset.spinning = "false";
    void elements.track.offsetWidth;
    elements.track.dataset.spinning = "true";
  }

  function render(state, onBoundary = () => {}) {
    const pending = state?.pendingChoice;
    const auction = pending?.type === "PROPERTY_AUCTION" ? (pending.auction ?? {}) : null;
    const announcementEndsAt = timeMs(auction?.announcementEndsAt ?? pending?.announcementEndsAt);
    const selectorStopsAt = timeMs(auction?.selectorStopsAt ?? pending?.selectorStopsAt);
    const startsAt = timeMs(auction?.startsAt ?? pending?.startsAt);
    if (
      !auction
      || !Number.isFinite(announcementEndsAt)
      || !Number.isFinite(selectorStopsAt)
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
    const starterPlayerId = auction.starterPlayerId
      ?? pending.starterPlayerId
      ?? auction.turnPlayerId
      ?? null;
    if (!starterPlayerId || !playerIds.includes(starterPlayerId)) {
      hide();
      return false;
    }

    const key = `${pending.nodeId}:${startsAt}:${starterPlayerId}`;
    const phase = now < announcementEndsAt
      ? "announce"
      : now < selectorStopsAt
        ? "selector"
        : "result";

    if (activeKey !== key) {
      activeKey = key;
      spinningKey = null;
      targetIndex = renderSelector(
        documentObject,
        elements,
        state,
        playerIds,
        starterPlayerId,
      );
    }

    if (avatarLoadKey !== key) {
      avatarLoadKey = key;
      void loadAvatarUrls(state, playerIds).then((avatarUrls) => {
        if (activeKey === key) applyAvatarUrls(elements, avatarUrls);
      });
    }

    if (playedSoundKey !== key) {
      playedSoundKey = key;
      playAuctionStartSound();
    }

    elements.overlay.hidden = false;
    elements.overlay.dataset.phase = phase;
    elements.announce.hidden = phase !== "announce";
    elements.selector.hidden = phase === "announce";

    if (phase === "selector") startSelectorAnimation(key);

    clearBoundary();
    const nextBoundary = phase === "announce"
      ? announcementEndsAt
      : phase === "selector"
        ? selectorStopsAt
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
