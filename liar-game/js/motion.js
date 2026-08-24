// UI-only render history. This module has no store, API, or persistence dependency.
let previous = null;

const animateOnce = (element, className) => {
  if (!element) return;
  element.classList.add(className);
  element.addEventListener("animationend", () => element.classList.remove(className), { once: true });
};

const snapshot = (state) => {
  const round = state.snapshot?.round;
  return {
    roundId: round?.id ?? null,
    status: round?.status ?? null,
    speakerIndex: round?.current_speaker_index ?? null,
    guessCount: Array.isArray(state.guessState?.guesses) ? state.guessState.guesses.length : 0,
    hadRole: Boolean(state.myRole && state.myRoleRoundId === round?.id),
  };
};

export function applyPostRenderMotion(root, state) {
  const current = snapshot(state);
  if (!previous) { previous = current; return; }
  const sameRound = previous.roundId === current.roundId;

  if (sameRound && previous.status && current.status !== previous.status)
    animateOnce(root.querySelector("[data-game-stage]"), "motion-stage-enter");

  if (sameRound && !previous.hadRole && current.hadRole) {
    const card = root.querySelector("[data-role-flip-card]");
    if (card) {
      card.classList.remove("is-revealed");
      requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add("is-revealed")));
    }
  }

  if (sameRound && previous.speakerIndex !== current.speakerIndex)
    animateOnce(root.querySelector("[data-current-speaker]"), "motion-speaker-change");

  if (sameRound && current.status === "VOTE_RESULT" && previous.status !== "VOTE_RESULT") {
    root.querySelectorAll("[data-vote-result-row]").forEach((row, index) => {
      row.style.setProperty("--motion-delay", `${Math.min(index, 6) * 50}ms`);
      animateOnce(row, "motion-result-row");
    });
    animateOnce(root.querySelector("[data-vote-details]"), "motion-detail-enter");
  }

  if (sameRound && current.status === "LIAR_GUESS" && current.guessCount > previous.guessCount)
    animateOnce(root.querySelector("[data-guess-history-item]:last-child"), "motion-guess-added");

  if (sameRound && current.status === "ROUND_RESULT" && previous.status !== "ROUND_RESULT") {
    animateOnce(root.querySelector("[data-result-title]"), "motion-winner-enter");
    root.querySelectorAll("[data-result-section]").forEach((section, index) => {
      section.style.setProperty("--motion-delay", `${Math.min(index, 5) * 45}ms`);
      animateOnce(section, "motion-result-section");
    });
  }
  previous = current;
}
