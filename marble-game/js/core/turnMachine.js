export const TURN_PHASES = Object.freeze({
  SETUP: "SETUP",
  TURN_START: "TURN_START",
  WAITING_ROLL: "WAITING_ROLL",
  ROLLING: "ROLLING",
  MOVING: "MOVING",
  RESOLVING_TILE: "RESOLVING_TILE",
  WAITING_CHOICE: "WAITING_CHOICE",
  RESOLVING_ACTION: "RESOLVING_ACTION",
  TURN_END: "TURN_END",
  FINISHED: "FINISHED",
});

const TRANSITIONS = Object.freeze({
  [TURN_PHASES.SETUP]: Object.freeze([TURN_PHASES.TURN_START, TURN_PHASES.FINISHED]),
  [TURN_PHASES.TURN_START]: Object.freeze([TURN_PHASES.WAITING_ROLL, TURN_PHASES.FINISHED]),
  [TURN_PHASES.WAITING_ROLL]: Object.freeze([TURN_PHASES.ROLLING, TURN_PHASES.FINISHED]),
  [TURN_PHASES.ROLLING]: Object.freeze([TURN_PHASES.MOVING, TURN_PHASES.FINISHED]),
  [TURN_PHASES.MOVING]: Object.freeze([TURN_PHASES.RESOLVING_TILE, TURN_PHASES.FINISHED]),
  [TURN_PHASES.RESOLVING_TILE]: Object.freeze([
    TURN_PHASES.WAITING_CHOICE,
    TURN_PHASES.RESOLVING_ACTION,
    TURN_PHASES.TURN_END,
    TURN_PHASES.FINISHED,
  ]),
  [TURN_PHASES.WAITING_CHOICE]: Object.freeze([
    TURN_PHASES.RESOLVING_ACTION,
    TURN_PHASES.TURN_END,
    TURN_PHASES.FINISHED,
  ]),
  [TURN_PHASES.RESOLVING_ACTION]: Object.freeze([
    TURN_PHASES.RESOLVING_TILE,
    TURN_PHASES.WAITING_CHOICE,
    TURN_PHASES.TURN_END,
    TURN_PHASES.FINISHED,
  ]),
  [TURN_PHASES.TURN_END]: Object.freeze([TURN_PHASES.TURN_START, TURN_PHASES.FINISHED]),
  [TURN_PHASES.FINISHED]: Object.freeze([]),
});

export function isTurnPhase(value) {
  return Object.values(TURN_PHASES).includes(value);
}

export function canTransitionPhase(from, to) {
  if (!isTurnPhase(from) || !isTurnPhase(to)) return false;
  return TRANSITIONS[from].includes(to);
}

export function transitionPhase(currentPhase, nextPhase) {
  if (!isTurnPhase(currentPhase)) {
    throw new Error(`Unknown current turn phase: ${currentPhase}`);
  }
  if (!isTurnPhase(nextPhase)) {
    throw new Error(`Unknown next turn phase: ${nextPhase}`);
  }
  if (!canTransitionPhase(currentPhase, nextPhase)) {
    throw new Error(`Invalid turn phase transition: ${currentPhase} -> ${nextPhase}`);
  }
  return nextPhase;
}
