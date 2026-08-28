const pileValues = new Map();
const animatingPiles = new Set();
let pendingPlacement = null;

const EMPTY_PILE_MARKER = Object.freeze({
  ascending: 0,
  descending: 101,
});

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

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}

function createFlightCard(card, sourceRect) {
  if (!sourceRect || prefersReducedMotion()) return null;

  const sourceLooksLikeCard = sourceRect.width <= 140 && sourceRect.height >= 54;
  const width = sourceLooksLikeCard
    ? Math.min(Math.max(sourceRect.width, 56), 92)
    : 68;
  const height = sourceLooksLikeCard
    ? Math.min(Math.max(sourceRect.height, 72), 112)
    : 96;
  const startLeft = sourceRect.left + (sourceRect.width - width) / 2;
  const startTop = sourceRect.top + (sourceRect.height - height) / 2;

  const flight = document.createElement("div");
  flight.className = "card-flight";
  flight.setAttribute("aria-hidden", "true");
  flight.innerHTML = `
    <div class="card-flight__inner">
      <div class="card-flight__face card-flight__front">${card}</div>
      <div class="card-flight__face card-flight__back"><span>THE<br>GAME</span></div>
    </div>
  `;
  Object.assign(flight.style, {
    left: `${startLeft}px`,
    top: `${startTop}px`,
    width: `${width}px`,
    height: `${height}px`,
  });
  document.body.append(flight);
  return flight;
}

function beginCardLift(card, sourceRect) {
  const flight = createFlightCard(card, sourceRect);
  if (!flight || typeof flight.animate !== "function") return flight;

  const lift = flight.animate([
    { transform: "translate3d(0, 0, 0) scale(1) rotateZ(0deg)" },
    { transform: "translate3d(0, -11px, 0) scale(1.045) rotateZ(-1.2deg)" },
  ], {
    duration: 145,
    easing: "cubic-bezier(0.2, 0.82, 0.24, 1)",
    fill: "forwards",
  });

  lift.finished.then(() => {
    if (!flight.isConnected) return;
    flight.style.transform = "translate3d(0, -11px, 0) scale(1.045) rotateZ(-1.2deg)";
    lift.cancel();
  }).catch(() => {});
  return flight;
}

function removeFlight(flight, animate = true) {
  if (!flight?.isConnected) return;
  if (!animate || typeof flight.animate !== "function") {
    flight.remove();
    return;
  }

  const dismissal = flight.animate([
    { opacity: 1 },
    { opacity: 0, transform: `${flight.style.transform || "translate3d(0, -11px, 0)"} scale(0.96)` },
  ], {
    duration: 120,
    easing: "ease-out",
    fill: "forwards",
  });
  dismissal.finished.finally(() => flight.remove());
}

function clearPendingPlacement({ animate = true } = {}) {
  if (!pendingPlacement) return;
  if (pendingPlacement.timeoutId) clearTimeout(pendingPlacement.timeoutId);
  removeFlight(pendingPlacement.flight, animate);
  pendingPlacement = null;
}

function capturePlacement(event) {
  const button = event.target.closest("[data-pile-id], [data-online-pile-id]");
  if (!button || button.disabled) return;

  const selected = selectedCardForPile(button);
  if (!selected) return;

  const card = Number(selected.textContent);
  if (!Number.isInteger(card)) return;

  clearPendingPlacement({ animate: false });
  const sourceRect = rectSnapshot(selected.getBoundingClientRect());
  const flight = beginCardLift(card, sourceRect);
  const placement = {
    context: pileContext(button),
    pileId: pileId(button),
    card,
    sourceRect,
    flight,
    capturedAt: performance.now(),
    timeoutId: null,
  };
  placement.timeoutId = window.setTimeout(() => {
    if (pendingPlacement === placement) clearPendingPlacement();
  }, 3000);
  pendingPlacement = placement;
}

function currentPlayerSourceRect() {
  const currentPlayer = document.querySelector(".online-game-screen:not([hidden]) .online-game-player.is-current");
  const fallback = document.querySelector(".online-game-screen:not([hidden]) .online-game-players");
  const source = currentPlayer ?? fallback;
  return source ? rectSnapshot(source.getBoundingClientRect()) : null;
}

function sourceForChange(context, id, card) {
  const pendingIsUsable = pendingPlacement
    && pendingPlacement.context === context
    && pendingPlacement.pileId === id
    && pendingPlacement.card === card
    && performance.now() - pendingPlacement.capturedAt < 3000;

  if (pendingIsUsable) {
    const placement = pendingPlacement;
    if (placement.timeoutId) clearTimeout(placement.timeoutId);
    pendingPlacement = null;
    return {
      sourceRect: placement.sourceRect,
      flight: placement.flight,
    };
  }

  return {
    sourceRect: context === "online" ? currentPlayerSourceRect() : null,
    flight: null,
  };
}

function setPileVisualValue(button, valueElement, value) {
  const empty = value === null;
  button.classList.toggle("is-empty-pile", empty);
  valueElement.textContent = empty ? "" : String(value);
}

function readPileVisualValue(button, valueElement) {
  const raw = valueElement.textContent.trim();
  if (!raw) return button.classList.contains("is-empty-pile") ? null : undefined;

  const value = Number(raw);
  if (!Number.isInteger(value)) return undefined;

  const direction = button.classList.contains("ascending") ? "ascending" : "descending";
  if (value === EMPTY_PILE_MARKER[direction]) {
    setPileVisualValue(button, valueElement, null);
    return null;
  }

  button.classList.remove("is-empty-pile");
  return value;
}

async function animateCardFlight({ card, sourceRect, target, existingFlight = null }) {
  if (!sourceRect || !target?.isConnected || prefersReducedMotion() || typeof target.animate !== "function") {
    removeFlight(existingFlight, false);
    return;
  }

  const targetRect = target.getBoundingClientRect();
  if (targetRect.width <= 0 || targetRect.height <= 0) {
    removeFlight(existingFlight, false);
    return;
  }

  const flight = existingFlight?.isConnected ? existingFlight : createFlightCard(card, sourceRect);
  if (!flight) return;
  for (const animation of flight.getAnimations()) animation.cancel();

  const flightRect = flight.getBoundingClientRect();
  const endLeft = targetRect.left + (targetRect.width - flightRect.width) / 2;
  const endTop = targetRect.top + (targetRect.height - flightRect.height) / 2;
  const dx = endLeft - flightRect.left;
  const dy = endTop - flightRect.top;
  const inner = flight.querySelector(".card-flight__inner");

  target.classList.add("is-receiving-card");

  try {
    const pathAnimation = flight.animate([
      { transform: "translate3d(0, -11px, 0) scale(1.045) rotateZ(-1.2deg)", opacity: 1, offset: 0 },
      { transform: `translate3d(${dx * 0.2}px, ${dy * 0.12 - 24}px, 0) scale(1.06) rotateZ(-2deg)`, opacity: 1, offset: 0.22 },
      { transform: `translate3d(${dx * 0.52}px, ${dy * 0.42 - 34}px, 0) scale(1.04) rotateZ(3.2deg)`, opacity: 1, offset: 0.5 },
      { transform: `translate3d(${dx * 0.82}px, ${dy * 0.76 - 18}px, 0) scale(0.99) rotateZ(-1.5deg)`, opacity: 1, offset: 0.78 },
      { transform: `translate3d(${dx}px, ${dy - 6}px, 0) scale(0.94) rotateZ(0.7deg)`, opacity: 1, offset: 0.94 },
      { transform: `translate3d(${dx}px, ${dy}px, 0) scale(0.92) rotateZ(0deg)`, opacity: 1, offset: 1 },
    ], {
      duration: 570,
      easing: "cubic-bezier(0.18, 0.72, 0.2, 1)",
      fill: "forwards",
    });

    const flipAnimation = inner?.animate([
      { transform: "rotateY(0deg) rotateX(0deg)", offset: 0 },
      { transform: "rotateY(0deg) rotateX(1deg)", offset: 0.2 },
      { transform: "rotateY(82deg) rotateX(-3deg)", offset: 0.43 },
      { transform: "rotateY(188deg) rotateX(2deg)", offset: 0.63 },
      { transform: "rotateY(306deg) rotateX(-1deg)", offset: 0.84 },
      { transform: "rotateY(360deg) rotateX(0deg)", offset: 1 },
    ], {
      duration: 570,
      easing: "cubic-bezier(0.3, 0.08, 0.18, 1)",
      fill: "forwards",
    });

    await Promise.all([
      pathAnimation.finished.catch(() => {}),
      flipAnimation?.finished.catch(() => {}) ?? Promise.resolve(),
    ]);

    const settle = flight.animate([
      { opacity: 1, transform: `translate3d(${dx}px, ${dy}px, 0) scale(0.92)` },
      { opacity: 0, transform: `translate3d(${dx}px, ${dy + 2}px, 0) scale(0.9)` },
    ], {
      duration: 95,
      easing: "ease-out",
      fill: "forwards",
    });
    await settle.finished.catch(() => {});
  } finally {
    flight.remove();
    target.classList.remove("is-receiving-card");
  }
}

async function animatePileChange({ button, valueElement, previousValue, nextValue, key }) {
  animatingPiles.add(key);

  const context = pileContext(button);
  const id = pileId(button);
  const source = sourceForChange(context, id, nextValue);

  // MutationObserver runs before the browser paints the new pile number. Keep
  // the previous face visible until the physical-card motion has landed.
  if (valueElement.isConnected) setPileVisualValue(button, valueElement, previousValue);

  await animateCardFlight({
    card: nextValue,
    sourceRect: source.sourceRect,
    target: button,
    existingFlight: source.flight,
  });

  if (valueElement.isConnected) setPileVisualValue(button, valueElement, nextValue);
  animatingPiles.delete(key);
  scanPiles();
}

function scanPiles() {
  const buttons = document.querySelectorAll("[data-pile-id], [data-online-pile-id]");

  for (const button of buttons) {
    const id = pileId(button);
    const valueElement = button.querySelector(".pile-value");
    if (!id || !valueElement) continue;

    const nextValue = readPileVisualValue(button, valueElement);
    if (nextValue === undefined) continue;

    const key = pileKey(button);
    if (!pileValues.has(key)) {
      pileValues.set(key, nextValue);
      continue;
    }

    const previousValue = pileValues.get(key);
    if (previousValue === nextValue || animatingPiles.has(key)) continue;

    pileValues.set(key, nextValue);
    if (nextValue === null) continue;
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
    if (pendingPlacement?.context === "local") clearPendingPlacement({ animate: false });
  }
  if (!online || online.hidden) {
    for (const key of pileValues.keys()) {
      if (key.startsWith("online:")) pileValues.delete(key);
    }
    if (pendingPlacement?.context === "online") clearPendingPlacement({ animate: false });
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
