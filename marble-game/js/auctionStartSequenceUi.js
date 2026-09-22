const ROULETTE_COLORS = Object.freeze([
  "#ff6b6b",
  "#4dabf7",
  "#ffd43b",
  "#69db7c",
]);

function segmentGradient(count) {
  const safeCount = Math.max(1, Math.min(ROULETTE_COLORS.length, Number(count) || 1));
  const step = 100 / safeCount;
  const stops = [];
  for (let index = 0; index < safeCount; index += 1) {
    const color = ROULETTE_COLORS[index];
    stops.push(`${color} ${(index * step).toFixed(3)}% ${((index + 1) * step).toFixed(3)}%`);
  }
  return `conic-gradient(from -90deg, ${stops.join(", ")})`;
}

function initials(name) {
  const value = String(name || "P").trim();
  return value.slice(0, 2).toUpperCase();
}

function winnerName(model) {
  return model.participantCards?.find?.((card) => card.id === model.openingBidderPlayerId)?.name
    ?? "참가자";
}

export function createAuctionStartSequenceView({
  documentObject = document,
  playStartSound = () => {},
  setTimeoutFn = globalThis.setTimeout,
  clearTimeoutFn = globalThis.clearTimeout,
} = {}) {
  const overlay = documentObject.createElement("section");
  overlay.className = "auction-start-sequence";
  overlay.hidden = true;
  overlay.setAttribute("aria-live", "assertive");

  const card = documentObject.createElement("div");
  card.className = "auction-start-sequence__card";

  const eyebrow = documentObject.createElement("span");
  eyebrow.className = "auction-start-sequence__eyebrow";
  eyebrow.textContent = "MARBLE AUCTION";

  const title = documentObject.createElement("strong");
  title.className = "auction-start-sequence__title";

  const subtitle = documentObject.createElement("span");
  subtitle.className = "auction-start-sequence__subtitle";

  const roulette = documentObject.createElement("div");
  roulette.className = "auction-start-sequence__roulette";
  roulette.hidden = true;

  const pointer = documentObject.createElement("span");
  pointer.className = "auction-start-sequence__pointer";
  pointer.setAttribute("aria-hidden", "true");

  const wheel = documentObject.createElement("div");
  wheel.className = "auction-start-sequence__wheel";
  wheel.setAttribute("aria-hidden", "true");

  const legend = documentObject.createElement("div");
  legend.className = "auction-start-sequence__legend";

  const winner = documentObject.createElement("strong");
  winner.className = "auction-start-sequence__winner";
  winner.hidden = true;

  roulette.append(pointer, wheel, legend, winner);
  card.append(eyebrow, title, subtitle, roulette);
  overlay.append(card);
  (documentObject.body ?? documentObject.documentElement).append(overlay);

  let winnerTimer = null;
  let lastNoticeKey = null;
  let lastRouletteKey = null;

  function clearWinnerTimer() {
    if (winnerTimer !== null) clearTimeoutFn?.(winnerTimer);
    winnerTimer = null;
  }

  function renderLegend(cards) {
    legend.replaceChildren(...cards.map((participant, index) => {
      const chip = documentObject.createElement("span");
      chip.className = "auction-start-sequence__legend-chip";
      chip.style.setProperty("--auction-roulette-color", ROULETTE_COLORS[index % ROULETTE_COLORS.length]);
      chip.textContent = participant.name;
      return chip;
    }));
  }

  function renderWheel(cards) {
    const count = Math.max(1, cards.length);
    const angle = 360 / count;
    wheel.style.background = segmentGradient(count);
    wheel.replaceChildren(...cards.map((participant, index) => {
      const label = documentObject.createElement("span");
      label.className = "auction-start-sequence__wheel-label";
      label.style.setProperty("--auction-roulette-label-angle", `${(index + 0.5) * angle}deg`);
      label.textContent = initials(participant.name);
      return label;
    }));
  }

  function render(model) {
    if (!model || !["start_notice", "roulette"].includes(model.stage)) {
      clearWinnerTimer();
      overlay.hidden = true;
      overlay.dataset.stage = "";
      roulette.hidden = true;
      winner.hidden = true;
      return;
    }

    overlay.hidden = false;

    if (model.stage === "start_notice") {
      overlay.dataset.stage = "notice";
      roulette.hidden = true;
      title.textContent = "경매가 곧 시작됩니다!";
      subtitle.textContent = `${model.nodeLabel} · 참가자 ${model.participantCards.length}명`;
      const noticeKey = `${model.nodeId}:${model.deadlineAt}`;
      if (noticeKey !== lastNoticeKey) {
        lastNoticeKey = noticeKey;
        playStartSound();
      }
      return;
    }

    overlay.dataset.stage = "roulette";
    roulette.hidden = false;
    title.textContent = "첫 입찰자를 정합니다";
    subtitle.textContent = "참가자 중 한 명을 룰렛으로 선택합니다";

    const cards = model.participantCards ?? [];
    renderWheel(cards);
    renderLegend(cards);

    const targetIndex = Math.max(0, cards.findIndex((card) => card.id === model.openingBidderPlayerId));
    const segmentAngle = 360 / Math.max(1, cards.length);
    const targetCenter = (targetIndex + 0.5) * segmentAngle;
    const endRotation = 1440 + (360 - targetCenter);
    const rouletteKey = `${model.nodeId}:${model.openingBidderPlayerId}:${model.deadlineAt}`;

    if (rouletteKey !== lastRouletteKey) {
      lastRouletteKey = rouletteKey;
      clearWinnerTimer();
      winner.hidden = true;
      winner.textContent = `첫 입찰 · ${winnerName(model)}`;
      wheel.classList.remove("is-spinning");
      wheel.style.setProperty("--auction-roulette-end", `${endRotation}deg`);
      void wheel.offsetWidth;

      const reducedMotion = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
      if (reducedMotion) {
        wheel.style.transform = `rotate(${endRotation % 360}deg)`;
        winner.hidden = false;
      } else {
        wheel.style.transform = "";
        wheel.classList.add("is-spinning");
        winnerTimer = setTimeoutFn?.(() => {
          winnerTimer = null;
          winner.hidden = false;
        }, 2_650) ?? null;
      }
    }
  }

  return Object.freeze({
    render,
    dispose() {
      clearWinnerTimer();
      overlay.remove();
    },
  });
}
