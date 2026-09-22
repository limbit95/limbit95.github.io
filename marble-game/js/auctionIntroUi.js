import { supabase } from "../../js/supabaseClient.js";
import { playAuctionStartSound } from "./auctionBidSound.js?v=20260922-r4";

const AVATAR_TTL_SECONDS = 600;
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

function playerInitial(state, playerId) {
  return playerName(state, playerId).trim().slice(0, 1).toUpperCase() || "P";
}

async function signedAvatarUrl(path) {
  if (!path || !supabase?.storage) return null;
  if (avatarUrlCache.has(path)) return avatarUrlCache.get(path);
  try {
    const { data, error } = await supabase.storage.from("avatars").createSignedUrl(path, AVATAR_TTL_SECONDS);
    const url = error ? null : (data?.signedUrl ?? null);
    avatarUrlCache.set(path, url);
    return url;
  } catch {
    avatarUrlCache.set(path, null);
    return null;
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
  const eyebrow = documentObject.createElement("span");
  eyebrow.className = "auction-intro__eyebrow";
  eyebrow.textContent = "AUCTION";
  const announceTitle = documentObject.createElement("strong");
  announceTitle.textContent = "경매가 곧 시작됩니다!";
  const announceDetail = documentObject.createElement("span");
  announceDetail.textContent = "경매 시작 순서를 정합니다";
  announce.append(eyebrow, announceTitle, announceDetail);

  const selector = documentObject.createElement("div");
  selector.className = "auction-selector";
  selector.hidden = true;
  const selectorTitle = documentObject.createElement("strong");
  selectorTitle.className = "auction-selector__title";
  selectorTitle.textContent = "경매 시작 플레이어 선정";
  const viewport = documentObject.createElement("div");
  viewport.className = "auction-selector__viewport";
  const marker = documentObject.createElement("span");
  marker.className = "auction-selector__marker";
  marker.setAttribute("aria-hidden", "true");
  marker.textContent = "▼";
  const track = documentObject.createElement("div");
  track.className = "auction-selector__track";
  viewport.append(marker, track);
  const result = documentObject.createElement("strong");
  result.className = "auction-selector__result";
  selector.append(selectorTitle, viewport, result);

  overlay.append(announce, selector);
  (documentObject.body ?? documentObject.documentElement).append(overlay);
  return { overlay, announce, selector, track, result };
}

function avatarCard(documentObject, state, playerId, repeatedIndex) {
  const player = findPlayer(state, playerId);
  const card = documentObject.createElement("div");
  card.className = "auction-selector__player";
  card.dataset.playerId = playerId;
  card.dataset.repeatIndex = String(repeatedIndex);

  const visual = documentObject.createElement("span");
  visual.className = "auction-selector__avatar";
  const fallback = documentObject.createElement("span");
  fallback.className = "auction-selector__avatar-fallback";
  fallback.textContent = playerInitial(state, playerId);
  visual.append(fallback);

  const name = documentObject.createElement("span");
  name.className = "auction-selector__name";
  name.textContent = playerName(state, playerId);
  card.append(visual, name);

  if (player?.avatarPath) {
    void signedAvatarUrl(player.avatarPath).then((url) => {
      if (!url || !card.isConnected) return;
      const img = documentObject.createElement("img");
      img.alt = "";
      img.src = url;
      img.decoding = "async";
      visual.prepend(img);
      fallback.hidden = true;
    });
  }
  return card;
}

function renderSelector(documentObject, elements, state, playerIds, starterPlayerId) {
  const loops = 7;
  const sequence = [];
  for (let loop = 0; loop < loops; loop += 1) {
    playerIds.forEach((playerId) => sequence.push(playerId));
  }
  sequence.push(starterPlayerId);

  elements.track.replaceChildren(...sequence.map((playerId, index) => (
    avatarCard(documentObject, state, playerId, index)
  )));
  void elements.track.offsetWidth;
  const firstCard = elements.track.firstElementChild;
  const finalCard = elements.track.lastElementChild;
  const targetOffset = firstCard && finalCard
    ? -(finalCard.offsetLeft - firstCard.offsetLeft)
    : 0;
  elements.track.style.setProperty("--selector-target-x", `${targetOffset}px`);
  elements.result.textContent = `${playerName(state, starterPlayerId)}님부터 경매를 시작합니다`;
}

export function createAuctionIntroPresenter({
  documentObject = document,
  clock = Date.now,
  setTimeoutFn = globalThis.setTimeout,
  clearTimeoutFn = globalThis.clearTimeout,
} = {}) {
  const elements = createOverlay(documentObject);
  let activeKey = null;
  let animatedKey = null;
  let playedSoundKey = null;
  let boundaryTimer = null;

  function clearBoundary() {
    if (boundaryTimer !== null) clearTimeoutFn?.(boundaryTimer);
    boundaryTimer = null;
  }

  function hide() {
    clearBoundary();
    elements.overlay.hidden = true;
    elements.overlay.dataset.phase = "";
    elements.announce.hidden = false;
    elements.selector.hidden = true;
  }

  function render(state, onBoundary = () => {}) {
    const pending = state?.pendingChoice;
    const auction = pending?.type === "PROPERTY_AUCTION" ? (pending.auction ?? {}) : null;
    const announcementEndsAt = timeMs(auction?.announcementEndsAt ?? pending?.announcementEndsAt);
    const selectorStopsAt = timeMs(auction?.selectorStopsAt ?? pending?.selectorStopsAt);
    const startsAt = timeMs(auction?.startsAt ?? pending?.startsAt);
    if (!auction || !Number.isFinite(announcementEndsAt) || !Number.isFinite(selectorStopsAt) || !Number.isFinite(startsAt)) {
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
    const starterPlayerId = auction.starterPlayerId ?? pending.starterPlayerId ?? playerIds[0] ?? null;
    if (!starterPlayerId || playerIds.length < 2) {
      hide();
      return false;
    }

    const key = `${pending.nodeId}:${startsAt}:${starterPlayerId}`;
    const phase = now < announcementEndsAt
      ? "announce"
      : now < selectorStopsAt
        ? "select"
        : "result";

    if (activeKey !== key) {
      activeKey = key;
      animatedKey = null;
      renderSelector(documentObject, elements, state, playerIds, starterPlayerId);
      elements.track.dataset.running = "false";
    }
    if (phase === "select" && animatedKey !== key) {
      animatedKey = key;
      elements.track.dataset.running = "false";
      void elements.track.offsetWidth;
      elements.track.dataset.running = "true";
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
      : phase === "select"
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
