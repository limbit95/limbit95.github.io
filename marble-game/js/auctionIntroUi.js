import { supabase } from "../../js/supabaseClient.js";
import { playAuctionStartSound } from "./auctionBidSound.js?v=20260922-r4";

const AVATAR_BUCKET = "avatars";
const CHAIN_REPEAT_COUNT = 6;
const AVATAR_SIGNED_URL_TTL_SECONDS = 600;
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

function playerName(player, fallbackId = null) {
  return player?.name || fallbackId || "플레이어";
}

function playerInitial(player, fallbackId = null) {
  return playerName(player, fallbackId).trim().slice(0, 1).toUpperCase() || "P";
}

async function signedAvatarUrl(avatarPath) {
  if (!avatarPath || !supabase?.storage) return null;
  if (!avatarUrlCache.has(avatarPath)) {
    avatarUrlCache.set(avatarPath, (async () => {
      const { data, error } = await supabase.storage
        .from(AVATAR_BUCKET)
        .createSignedUrl(avatarPath, AVATAR_SIGNED_URL_TTL_SECONDS);
      if (error) return null;
      return data?.signedUrl ?? null;
    })());
  }
  return avatarUrlCache.get(avatarPath);
}

function hydrateAvatarImage(image, fallback, avatarPath) {
  if (!avatarPath) return;
  void signedAvatarUrl(avatarPath).then((url) => {
    if (!url || !image.isConnected) return;
    image.src = url;
    image.hidden = false;
    fallback.hidden = true;
  });
}

function createProfileItem(documentObject, state, playerId, index) {
  const player = findPlayer(state, playerId);
  const item = documentObject.createElement("div");
  item.className = "auction-selector__profile";
  item.dataset.playerId = playerId;
  item.style.setProperty("--selector-seat", String(Number(player?.seat) || index));

  const avatar = documentObject.createElement("div");
  avatar.className = "auction-selector__avatar";
  const image = documentObject.createElement("img");
  image.alt = "";
  image.hidden = true;
  const fallback = documentObject.createElement("span");
  fallback.className = "auction-selector__avatar-fallback";
  fallback.textContent = playerInitial(player, playerId);
  avatar.append(image, fallback);

  const name = documentObject.createElement("span");
  name.className = "auction-selector__name";
  name.textContent = playerName(player, playerId);

  item.append(avatar, name);
  hydrateAvatarImage(image, fallback, player?.avatarPath);
  return item;
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
  announceDetail.textContent = "경매 시작 플레이어를 정합니다";
  announce.append(announceEyebrow, announceTitle, announceDetail);

  const selector = documentObject.createElement("div");
  selector.className = "auction-selector";
  selector.hidden = true;

  const selectorTitle = documentObject.createElement("strong");
  selectorTitle.className = "auction-selector__title";
  selectorTitle.textContent = "경매 시작 플레이어 추첨";

  const viewport = documentObject.createElement("div");
  viewport.className = "auction-selector__viewport";
  const focus = documentObject.createElement("span");
  focus.className = "auction-selector__focus";
  focus.setAttribute("aria-hidden", "true");
  const track = documentObject.createElement("div");
  track.className = "auction-selector__track";
  viewport.append(track, focus);

  const result = documentObject.createElement("strong");
  result.className = "auction-selector__result";

  selector.append(selectorTitle, viewport, result);
  overlay.append(announce, selector);
  (documentObject.body ?? documentObject.documentElement).append(overlay);
  return { overlay, announce, selector, viewport, track, result };
}

function buildChain(documentObject, elements, state, playerIds, starterPlayerId) {
  const chain = [];
  for (let repeat = 0; repeat < CHAIN_REPEAT_COUNT; repeat += 1) {
    chain.push(...playerIds);
  }

  let targetIndex = chain.length - 1;
  while (targetIndex > 0 && chain[targetIndex] !== starterPlayerId) {
    targetIndex -= 1;
  }

  const profiles = chain.map((playerId, index) => (
    createProfileItem(documentObject, state, playerId, index)
  ));
  profiles[targetIndex]?.setAttribute("data-selected", "true");
  elements.track.replaceChildren(...profiles);

  const starter = findPlayer(state, starterPlayerId);
  elements.result.textContent = `${playerName(starter, starterPlayerId)}님부터 경매를 시작합니다!`;
  elements.track.dataset.spinning = "false";
  elements.track.dataset.targetIndex = String(targetIndex);

  return targetIndex;
}

function startChainAnimation(elements, targetIndex) {
  const item = elements.track.querySelector(".auction-selector__profile");
  if (!item) return;
  const itemWidth = item.getBoundingClientRect().width;
  const trackStyle = getComputedStyle(elements.track);
  const gap = Number.parseFloat(trackStyle.columnGap || trackStyle.gap || "0") || 0;
  const step = itemWidth + gap;
  const viewportWidth = elements.viewport.getBoundingClientRect().width;
  const offset = Math.max(0, (targetIndex * step) - ((viewportWidth - itemWidth) / 2));
  elements.track.style.setProperty("--selector-target-x", `${-offset}px`);
  elements.track.dataset.spinning = "false";
  void elements.track.offsetWidth;
  elements.track.dataset.spinning = "true";
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
  let targetIndex = null;

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
    const selectorStopsAt = timeMs(auction?.selectorStopsAt ?? pending?.selectorStopsAt);
    const selectorResultEndsAt = timeMs(
      auction?.selectorResultEndsAt
        ?? pending?.selectorResultEndsAt
        ?? auction?.startsAt
        ?? pending?.startsAt,
    );
    const startsAt = timeMs(auction?.startsAt ?? pending?.startsAt);

    if (
      !auction
      || !Number.isFinite(announcementEndsAt)
      || !Number.isFinite(selectorStopsAt)
      || !Number.isFinite(selectorResultEndsAt)
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
      ?? playerIds[0]
      ?? null;
    const key = `${pending.nodeId}:${startsAt}:${starterPlayerId}`;
    const phase = now < announcementEndsAt
      ? "announce"
      : now < selectorStopsAt
        ? "selector"
        : "result";

    if (activeKey !== key) {
      activeKey = key;
      spinningKey = null;
      targetIndex = buildChain(documentObject, elements, state, playerIds, starterPlayerId);
    }

    if (phase === "selector" && spinningKey !== key && Number.isInteger(targetIndex)) {
      spinningKey = key;
      startChainAnimation(elements, targetIndex);
    }

    if (playedSoundKey !== key) {
      playedSoundKey = key;
      playAuctionStartSound();
    }

    elements.overlay.hidden = false;
    elements.overlay.dataset.phase = phase;
    elements.track.dataset.result = phase === "result" ? "true" : "false";
    elements.announce.hidden = phase !== "announce";
    elements.selector.hidden = phase === "announce";

    clearBoundary();
    const nextBoundary = phase === "announce"
      ? announcementEndsAt
      : phase === "selector"
        ? selectorStopsAt
        : selectorResultEndsAt;
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
