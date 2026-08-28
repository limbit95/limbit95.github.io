const pileValues = new Map();
const animatingPiles = new Set();
let pendingPlacement = null;

function pileContext(button) {
  return button.closest("#game-screen") ? "local" : "online";
}

function pileId(button) {
  return button.dataset.pileId ?? button.dataset.onlinePileId ?? "";
}

function pileKey(button) {
  return `${pileContext(button)}:${pileId(button)}`;
}

function rectSnapshot(rect) {
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
}

function selectedCardForPile(button) {
  const selector = button.dataset.onlinePileId
    ? "[data-online-hand] .online-number-card.is-selected"
    : "#hand .number-card.is-selected";
  return document.querySelector(selector);
}

function capturePlacement(event) {
  const button = event.target.closest("[data-pile-id], [data-online-pile-id]");
  if (!button || button.disabled) return;

  const selected = selectedCardForPile(button);
  if (!selected) return;

  const card = Number(selected.textContent);
  if (!Number.isInteger(card)) return;

  pendingPlacement = {
    context: pileContext(button),
    pileId: pileId(button),
    card,
    sourceRect: rectSnapshot(selected.getBoundingClientRect()),
    capturedAt: performance.now(),
  };
}

function currentPlayerSourceRect() {
  const currentPlayer = document.querySelector(".online-game-screen:not([hidden]) .online-game-player.is-current");
  const fallback = document.querySelector(".online-game-screen:not([hidden]) .online-game-players");
  const source = currentPlayer ?? fallback;
  return source ? rectSnapshot(source.getBoundingClientRect()) : null;
}

function sourceRectForChange(context, id, card) {
  const pendingIsUsable = pendingPlacement
    && pendingPlacement.context === context
    && pendingPlacement.pileId === id
    && pendingPlacement.card === card
    && performance.now() - pendingPlacement.capturedAt < 5000;

  if (pendingIsUsable) {
    const sourceRect = pendingPlacement.sourceRect;
    pendingPlacement = null;
    return sourceRect;
  }

  return context === "online" ? currentPlayerSourceRect() : null;
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}

async function animateCardFlight({ card, sourceRect, target }) {
  if (!sourceRect || !target?.isConnected || prefersReducedMotion() || typeof target.animate !== "function") {
    return;
  }

  const targetRect = target.getBoundingClientRect();
  if (targetRect.width <= 0 || targetRect.height <= 0) return;

  const sourceLooksLikeCard = sourceRect.width <= 140 && sourceRect.height >= 54;
  const width = sourceLooksLikeCard
    ? Math.min(Math.max(sourceRect.width, 56), 92)
    : 68;
  const height = sourceLooksLikeCard
    ? Math.min(Math.max(sourceRect.height, 72), 112)
    : 96;
  const startLeft = sourceRect.left + (sourceRect.width - width) / 2;
  const startTop = sourceRect.top + (sourceRect.height - height) / 2;
  const endLeft = targetRect.left + (targetRect.width - width) / 2;
  const endTop = targetRect.top + (targetRect.height - height) / 2;
  const dx = endLeft - startLeft;
  const dy = endTop - startTop;

  const flight = document.createElement("div");
  flight.className = "number-card card-flight";
  flight.textContent = String(card);
  flight.setAttribute("aria-hidden", "true");
  Object.assign(flight.style, {
    left: `${startLeft}px`,
    top: `${startTop}px`,
    width: `${width}px`,
    height: `${height}px`,
  });
  document.body.append(flight);
  target.classList.add("is-receiving-card");

  try {
    const animation = flight.animate([
      { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
      {
        transform: `translate3d(${dx * 0.58}px, ${dy * 0.52 - 18}px, 0) scale(0.96)`,
        opacity: 1,
        offset: 0.62,
      },
      { transform: `translate3d(${dx}px, ${dy}px, 0) scale(0.9)`, opacity: 0.92 },
    ], {
      duration: 360,
      easing: "cubic-bezier(0.22, 0.8, 0.2, 1)",
      fill: "forwards",
    });
    await animation.finished.catch(() => {});
  } finally {
    flight.remove();
    target.classList.remove("is-receiving-card");
  }
}

async function animatePileChange({ button, valueElement, previousValue, nextValue, key }) {
  animatingPiles.add(key);

  const context = pileContext(button);
  const id = pileId(button);
  const sourceRect = sourceRectForChange(context, id, nextValue);

  // MutationObserver runs before the next browser paint. Restoring the old
  // number here prevents a remote play from looking like an instant swap.
  if (valueElement.isConnected) valueElement.textContent = String(previousValue);

  await animateCardFlight({ card: nextValue, sourceRect, target: button });

  if (valueElement.isConnected) valueElement.textContent = String(nextValue);
  animatingPiles.delete(key);
  scanPiles();
}

function scanPiles() {
  const buttons = document.querySelectorAll("[data-pile-id], [data-online-pile-id]");

  for (const button of buttons) {
    const id = pileId(button);
    const valueElement = button.querySelector(".pile-value");
    if (!id || !valueElement) continue;

    const nextValue = Number(valueElement.textContent);
    if (!Number.isInteger(nextValue)) continue;

    const key = pileKey(button);
    const previousValue = pileValues.get(key);
    if (previousValue === undefined) {
      pileValues.set(key, nextValue);
      continue;
    }

    if (previousValue === nextValue || animatingPiles.has(key)) continue;

    pileValues.set(key, nextValue);
    void animatePileChange({ button, valueElement, previousValue, nextValue, key });
  }
}

function clearHiddenContexts() {
  const local = document.querySelector("#game-screen");
  const online = document.querySelector("#online-game-screen");
  if (!local || local.hidden) {
    for (const key of pileValues.keys()) {
      if (key.startsWith("local:")) pileValues.delete(key);
    }
  }
  if (!online || online.hidden) {
    for (const key of pileValues.keys()) {
      if (key.startsWith("online:")) pileValues.delete(key);
    }
  }
}

document.addEventListener("click", capturePlacement, true);

const observer = new MutationObserver(() => {
  clearHiddenContexts();
  scanPiles();
});
observer.observe(document.body, {
  subtree: true,
  childList: true,
  characterData: true,
  attributes: true,
  attributeFilter: ["hidden"],
});

scanPiles();
