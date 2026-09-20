export const CANT_STOP_COLUMN_HEIGHTS = Object.freeze({
  2: 3,
  3: 5,
  4: 7,
  5: 9,
  6: 11,
  7: 13,
  8: 11,
  9: 9,
  10: 7,
  11: 5,
  12: 3,
});

export const CANT_STOP_PHASE = Object.freeze({
  TURN_ROLL: "TURN_ROLL",
  PAIRING_SELECTION: "PAIRING_SELECTION",
  PUSH_OR_STOP: "PUSH_OR_STOP",
  GAME_OVER: "GAME_OVER",
});

const PAIRING_INDEXES = Object.freeze([
  Object.freeze([[0, 1], [2, 3]]),
  Object.freeze([[0, 2], [1, 3]]),
  Object.freeze([[0, 3], [1, 2]]),
]);

function nonEmptyPlayerId(value) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError("Can't Stop player ids must be non-empty strings.");
  }
  return value.trim();
}

function assertDice(dice) {
  if (!Array.isArray(dice) || dice.length !== 4) {
    throw new TypeError("Can't Stop rolls require exactly four dice.");
  }
  dice.forEach((die) => {
    if (!Number.isInteger(die) || die < 1 || die > 6) {
      throw new TypeError("Can't Stop dice values must be integers from 1 through 6.");
    }
  });
}

function normalizedPairing(sumA, sumB) {
  return sumA <= sumB ? [sumA, sumB] : [sumB, sumA];
}

function sameNumberArray(left, right) {
  return Array.isArray(left)
    && Array.isArray(right)
    && left.length === right.length
    && left.every((value, index) => value === right[index]);
}

function activePlayer(state) {
  const player = state.players.find((candidate) => candidate.id === state.activePlayerId);
  if (!player) throw new Error("Can't Stop state has no active player.");
  return player;
}

function cloneState(state) {
  return {
    ...state,
    players: state.players.map((player) => ({
      ...player,
      progress: { ...player.progress },
    })),
    turnOrder: [...state.turnOrder],
    claimedColumns: { ...state.claimedColumns },
    runners: { ...state.runners },
    latestDice: state.latestDice ? [...state.latestDice] : null,
    legalPairings: state.legalPairings.map((pairing) => ({
      sums: [...pairing.sums],
      plans: pairing.plans.map((plan) => [...plan]),
    })),
  };
}

function progressAt(player, column) {
  return Number(player.progress[column] ?? 0);
}

function runnerCount(runners) {
  return Object.keys(runners).length;
}

function canAdvanceColumn(state, runners, column) {
  if (state.claimedColumns[column] != null) return false;

  const player = activePlayer(state);
  const current = runners[column] ?? progressAt(player, column);
  if (current >= CANT_STOP_COLUMN_HEIGHTS[column]) return false;

  const hasRunner = runners[column] != null;
  if (!hasRunner && runnerCount(runners) >= 3) return false;
  return true;
}

function advanceColumn(state, runners, column) {
  const player = activePlayer(state);
  const current = runners[column] ?? progressAt(player, column);
  return {
    ...runners,
    [column]: current + 1,
  };
}

function simulatePlan(state, columns) {
  let runners = { ...state.runners };
  for (const column of columns) {
    if (!canAdvanceColumn(state, runners, column)) return null;
    runners = advanceColumn(state, runners, column);
  }
  return runners;
}

function legalPlansFromCandidates(state, candidates) {
  const seenResults = new Set();
  const plans = [];

  for (const plan of candidates) {
    const runners = simulatePlan(state, plan);
    if (!runners) continue;
    const resultKey = Object.entries(runners)
      .sort(([left], [right]) => Number(left) - Number(right))
      .map(([column, position]) => `${column}:${position}`)
      .join("|");
    if (seenResults.has(resultKey)) continue;
    seenResults.add(resultKey);
    plans.push(plan);
  }

  return plans;
}

function clearRollState(state) {
  return {
    ...state,
    latestDice: null,
    legalPairings: [],
  };
}

function nextPlayerState(state) {
  const nextTurnIndex = (state.turnIndex + 1) % state.turnOrder.length;
  return {
    ...clearRollState(state),
    phase: CANT_STOP_PHASE.TURN_ROLL,
    turnIndex: nextTurnIndex,
    activePlayerId: state.turnOrder[nextTurnIndex],
    runners: {},
  };
}

export function createInitialGameState({ playerIds, turnOrder }) {
  if (!Array.isArray(playerIds) || playerIds.length < 2 || playerIds.length > 4) {
    throw new TypeError("Can't Stop requires 2 through 4 players.");
  }

  const normalizedPlayers = playerIds.map(nonEmptyPlayerId);
  if (new Set(normalizedPlayers).size !== normalizedPlayers.length) {
    throw new TypeError("Can't Stop player ids must be unique.");
  }

  if (!Array.isArray(turnOrder) || turnOrder.length !== normalizedPlayers.length) {
    throw new TypeError("Can't Stop requires a complete server-selected turn order.");
  }
  const normalizedOrder = turnOrder.map(nonEmptyPlayerId);
  if (new Set(normalizedOrder).size !== normalizedOrder.length
    || normalizedOrder.some((playerId) => !normalizedPlayers.includes(playerId))) {
    throw new TypeError("Can't Stop turn order must contain each player exactly once.");
  }

  return {
    phase: CANT_STOP_PHASE.TURN_ROLL,
    players: normalizedPlayers.map((id) => ({ id, progress: {} })),
    turnOrder: normalizedOrder,
    turnIndex: 0,
    activePlayerId: normalizedOrder[0],
    claimedColumns: {},
    runners: {},
    latestDice: null,
    legalPairings: [],
    winnerId: null,
  };
}

export function enumeratePairings(dice) {
  assertDice(dice);
  const pairings = PAIRING_INDEXES.map(([[a, b], [c, d]]) =>
    normalizedPairing(dice[a] + dice[b], dice[c] + dice[d]));

  const seen = new Set();
  return pairings.filter((pairing) => {
    const key = pairing.join(":");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getLegalMovePlans(state, pairing) {
  if (!Array.isArray(pairing) || pairing.length !== 2) {
    throw new TypeError("Can't Stop pairings require exactly two sums.");
  }
  const sums = pairing.map((sum) => {
    if (!Number.isInteger(sum) || CANT_STOP_COLUMN_HEIGHTS[sum] == null) {
      throw new TypeError("Can't Stop pairing sums must be integers from 2 through 12.");
    }
    return sum;
  });

  const [first, second] = sums;
  const fullCandidates = first === second
    ? [[first, second]]
    : [[first, second], [second, first]];
  const fullPlans = legalPlansFromCandidates(state, fullCandidates);
  if (fullPlans.length) return fullPlans;

  const singleCandidates = first === second ? [[first]] : [[first], [second]];
  return legalPlansFromCandidates(state, singleCandidates);
}

export function getLegalPairings(state, dice) {
  return enumeratePairings(dice)
    .map((sums) => ({ sums, plans: getLegalMovePlans(state, sums) }))
    .filter((pairing) => pairing.plans.length > 0);
}

export function resolveRoll(state, dice) {
  if (state.phase !== CANT_STOP_PHASE.TURN_ROLL) {
    throw new Error("Can't Stop can only resolve a roll during TURN_ROLL.");
  }
  assertDice(dice);

  const legalPairings = getLegalPairings(state, dice);
  if (!legalPairings.length) {
    return nextPlayerState(cloneState(state));
  }

  const next = cloneState(state);
  next.phase = CANT_STOP_PHASE.PAIRING_SELECTION;
  next.latestDice = [...dice];
  next.legalPairings = legalPairings.map((pairing) => ({
    sums: [...pairing.sums],
    plans: pairing.plans.map((plan) => [...plan]),
  }));
  return next;
}

export function applyPairingChoice(state, { sums, columns }) {
  if (state.phase !== CANT_STOP_PHASE.PAIRING_SELECTION) {
    throw new Error("Can't Stop can only choose a pairing during PAIRING_SELECTION.");
  }

  const pairing = state.legalPairings.find((candidate) => sameNumberArray(candidate.sums, sums));
  const plan = pairing?.plans.find((candidate) => sameNumberArray(candidate, columns));
  if (!plan) throw new Error("Can't Stop pairing choice is not legal for the current roll.");

  const runners = simulatePlan(state, plan);
  if (!runners) throw new Error("Can't Stop pairing choice became invalid.");

  const next = cloneState(state);
  next.runners = runners;
  next.phase = CANT_STOP_PHASE.PUSH_OR_STOP;
  next.legalPairings = [];
  return next;
}

export function continueTurn(state) {
  if (state.phase !== CANT_STOP_PHASE.PUSH_OR_STOP) {
    throw new Error("Can't Stop can only continue after applying a pairing.");
  }
  return {
    ...clearRollState(cloneState(state)),
    phase: CANT_STOP_PHASE.TURN_ROLL,
  };
}

export function bustTurn(state) {
  if (state.phase === CANT_STOP_PHASE.GAME_OVER) {
    throw new Error("Can't Stop cannot bust after GAME_OVER.");
  }
  return nextPlayerState(cloneState(state));
}

export function stopTurn(state) {
  if (state.phase !== CANT_STOP_PHASE.PUSH_OR_STOP) {
    throw new Error("Can't Stop can only stop after applying a pairing.");
  }

  const next = cloneState(state);
  const player = activePlayer(next);
  const completedColumns = [];

  for (const [rawColumn, position] of Object.entries(next.runners)) {
    const column = Number(rawColumn);
    player.progress[column] = position;
    if (position === CANT_STOP_COLUMN_HEIGHTS[column]) {
      completedColumns.push(column);
    }
  }

  completedColumns.forEach((column) => {
    next.claimedColumns[column] = player.id;
    next.players.forEach((candidate) => {
      if (candidate.id !== player.id) delete candidate.progress[column];
    });
  });

  const claimedCount = Object.values(next.claimedColumns)
    .filter((playerId) => playerId === player.id)
    .length;

  next.runners = {};
  next.latestDice = null;
  next.legalPairings = [];

  if (claimedCount >= 3) {
    next.phase = CANT_STOP_PHASE.GAME_OVER;
    next.winnerId = player.id;
    return next;
  }

  return nextPlayerState(next);
}
