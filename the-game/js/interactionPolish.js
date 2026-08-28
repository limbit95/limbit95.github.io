const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const previousPileValues = new Map();
const previousHands = new WeakMap();
let previousTurnKey = "";
let pendingPileKey = "";
let pendingReversePileKey = "";
let pendingPileTimer = null;
let syncQueued = false;

function getPileKey(pile) {
  return pile?.dataset?.onlinePileId || pile?.dataset?.pileId || "";
}

function clearPendingPile() {
  pendingPileKey = "";
  pendingReversePileKey = "";
  if (pendingPileTimer) {
    clearTimeout(pendingPileTimer);
    pendingPileTimer = null;
  }
}

function animateOnce(element, className) {
  if (!element || reduceMotionQuery.matches) return;
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);

  const clear = () => element.classList.remove(className);
  element.addEventListener("animationend", clear, { once: true });
  window.setTimeout(clear, 700);
}

function syncPiles() {
  const piles = document.querySelectorAll(".pile-card[data-pile-id], .pile-card[data-online-pile-id]");
  for (const pile of piles) {
    const key = getPileKey(pile);
    const value = pile.querySelector(".pile-value")?.textContent?.trim() ?? "";
    const scopedKey = `${pile.closest("[data-online-piles]") ? "online" : "local"}:${key}`;
    const previousValue = previousPileValues.get(scopedKey);

    if (previousValue !== undefined && previousValue !== value) {
      animateOnce(pile, pendingReversePileKey === key ? "is-reverse-landed" : "is-updated");
      if (pendingPileKey === key) clearPendingPile();
    }

    previousPileValues.set(scopedKey, value);
  }
}

function syncHands() {
  for (const hand of document.querySelectorAll(".hand")) {
    const cards = [...hand.querySelectorAll(".number-card")];
    const values = new Set(cards.map((card) => card.dataset.onlineCard || card.dataset.card || card.textContent?.trim() || ""));
    const previous = previousHands.get(hand);

    if (previous) {
      for (const card of cards) {
        const value = card.dataset.onlineCard || card.dataset.card || card.textContent?.trim() || "";
        if (!previous.has(value)) animateOnce(card, "is-new-card");
      }
    }

    previousHands.set(hand, values);
  }
}

function syncTurnFeedback() {
  const onlineCurrent = document.querySelector(".online-game-screen:not([hidden]) .online-game-player.is-current");
  const localScreen = document.querySelector("#game-screen:not([hidden])");
  const turnHeading = onlineCurrent
    ? document.querySelector(".online-game-screen:not([hidden]) [data-online-turn]")
    : localScreen?.querySelector("#turn-label");
  const key = onlineCurrent
    ? `online:${onlineCurrent.querySelector("strong")?.textContent?.trim() ?? ""}`
    : turnHeading
      ? `local:${turnHeading.textContent?.trim() ?? ""}`
      : "";

  if (key && previousTurnKey && key !== previousTurnKey) {
    animateOnce(onlineCurrent || turnHeading, "is-turn-entering");
    animateOnce(turnHeading, "is-turn-updated");
  }
  if (key) previousTurnKey = key;
}

function setBadgeState(badge, text, outcome) {
  if (badge.textContent !== text) badge.textContent = text;
  if (badge.dataset.outcome !== outcome) badge.dataset.outcome = outcome;
}

function syncTeamResultBadge() {
  const onlineResult = document.querySelector("[data-online-result]:not([hidden])");
  if (onlineResult) {
    const outcome = onlineResult.dataset.outcome
      || (onlineResult.querySelector("[data-online-result-kicker]")?.textContent?.trim() === "MISSION COMPLETE" ? "won" : "lost");
    let badge = onlineResult.querySelector(".team-result-badge");
    if (!badge) {
      badge = document.createElement("p");
      badge.className = "team-result-badge";
      onlineResult.querySelector("[data-online-result-title]")?.insertAdjacentElement("afterend", badge);
    }
    setBadgeState(badge, outcome === "won" ? "팀 결과 · 협력 성공" : "팀 결과 · 협력 실패", outcome);
  }

  const localOverlay = document.querySelector("#result-overlay:not([hidden])");
  if (localOverlay) {
    const outcome = localOverlay.querySelector("#result-kicker")?.textContent?.trim() === "MISSION COMPLETE" ? "won" : "lost";
    let badge = localOverlay.querySelector(".team-result-badge");
    if (!badge) {
      badge = document.createElement("p");
      badge.className = "team-result-badge";
      localOverlay.querySelector("#result-title")?.insertAdjacentElement("afterend", badge);
    }
    setBadgeState(badge, outcome === "won" ? "팀 결과 · 협력 성공" : "팀 결과 · 협력 실패", outcome);
  }
}

function syncPolish() {
  syncQueued = false;
  syncPiles();
  syncHands();
  syncTurnFeedback();
  syncTeamResultBadge();
}

function queueSync() {
  if (syncQueued) return;
  syncQueued = true;
  queueMicrotask(syncPolish);
}

document.addEventListener("click", (event) => {
  const pile = event.target.closest(".pile-card.is-playable");
  if (!pile || pile.disabled) return;

  clearPendingPile();
  pendingPileKey = getPileKey(pile);
  pendingReversePileKey = pile.classList.contains("is-reverse") ? pendingPileKey : "";
  pendingPileTimer = window.setTimeout(clearPendingPile, 3000);
  pile.classList.add("is-submitting");
}, true);

const observer = new MutationObserver(queueSync);
observer.observe(document.body, {
  subtree: true,
  childList: true,
  characterData: true,
  attributes: true,
  attributeFilter: ["hidden"],
});

document.addEventListener("the-game:return-home", () => {
  previousPileValues.clear();
  previousTurnKey = "";
  clearPendingPile();
});

queueSync();
