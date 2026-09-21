export const NO_THANKS_PHASE = Object.freeze({
  PLAYING: "PLAYING",
  GAME_OVER: "GAME_OVER",
});

export const NO_THANKS_ACTION = Object.freeze({
  REFUSE_CARD: "REFUSE_CARD",
  TAKE_CARD: "TAKE_CARD",
});

export const NO_THANKS_MIN_PLAYERS = 3;
export const NO_THANKS_MAX_PLAYERS = 7;
export const NO_THANKS_CARD_MIN = 3;
export const NO_THANKS_CARD_MAX = 35;
export const NO_THANKS_EXCLUDED_CARD_COUNT = 9;
export const NO_THANKS_PLAY_CARD_COUNT = 24;

function nonEmptyPlayerId(value) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError("No Thanks! player ids must be non-empty strings.");
  }
  return value.trim();
}

function assertPlayerCount(playerCount) {
  if (!Number.isInteger(playerCount)
    || playerCount < NO_THANKS_MIN_PLAYERS
    || playerCount > NO_THANKS_MAX_PLAYERS) {
    throw new TypeError("No Thanks! requires 3 through 7 players.");
  }
}

function assertCard(card) {
  if (!Number.isInteger(card) || card < NO_THANKS_CARD_MIN || card > NO_THANKS_CARD_MAX) {
    throw new TypeError("No Thanks! cards must be integers from 3 through 35.");
  }
}

function normalizeCards(cards, { expectedLength = null } = {}) {
  if (!Array.isArray(cards)) {
    throw new TypeError("No Thanks! cards must be an array.");
  }
  if (expectedLength != null && cards.length !== expectedLength) {
    throw new TypeError(`No Thanks! requires exactly ${expectedLength} prepared cards.`);
  }

  const normalized = cards.map((card) => {
    assertCard(card);
    return card;
  });
  if (new Set(normalized).size !== normalized.length) {
    throw new TypeError("No Thanks! cards must not contain duplicates.");
  }
  return normalized;
}

function cloneState(state) {
  return {
    ...state,
    players: state.players.map((player) => ({
      ...player,
      cards: [...player.cards],
    })),
    playerCounters: { ...state.playerCounters },
    turnOrder: [...state.turnOrder],
    drawDeck: [...state.drawDeck],
    winners: [...state.winners],
    finalScores: state.finalScores ? { ...state.finalScores } : null,
  };
}

function assertPlaying(state) {
  if (state.phase !== NO_THANKS_PHASE.PLAYING) {
    throw new Error("No Thanks! actions are only available while the game is playing.");
  }
}

function activePlayer(state) {
  const player = state.players.find((candidate) => candidate.id === state.activePlayerId);
  if (!player) throw new Error("No Thanks! state has no active player.");
  return player;
}

function activeCounterCount(state) {
  const count = state.playerCounters[state.activePlayerId];
  if (!Number.isInteger(count) || count < 0) {
    throw new Error("No Thanks! state has an invalid active-player counter count.");
  }
  return count;
}

function finalScoresFor(state) {
  return Object.fromEntries(
    state.players.map((player) => [
      player.id,
      calculateFinalScore(player.cards, state.playerCounters[player.id]),
    ]),
  );
}

function winnerIdsFrom(finalScores, turnOrder) {
  const scores = Object.values(finalScores);
  const lowestScore = Math.min(...scores);
  return turnOrder.filter((playerId) => finalScores[playerId] === lowestScore);
}

export function calculateInitialCounters(playerCount) {
  assertPlayerCount(playerCount);
  if (playerCount <= 5) return 11;
  if (playerCount === 6) return 9;
  return 7;
}

export function calculateCardScore(cards) {
  const sorted = normalizeCards(cards).sort((left, right) => left - right);
  let score = 0;

  sorted.forEach((card, index) => {
    if (index === 0 || card !== sorted[index - 1] + 1) {
      score += card;
    }
  });

  return score;
}

export function calculateFinalScore(cards, counters) {
  if (!Number.isInteger(counters) || counters < 0) {
    throw new TypeError("No Thanks! counter count must be a non-negative integer.");
  }
  return calculateCardScore(cards) - counters;
}

export function createInitialGameState({ playerIds, turnOrder, drawDeck }) {
  if (!Array.isArray(playerIds)) {
    throw new TypeError("No Thanks! player ids must be an array.");
  }
  assertPlayerCount(playerIds.length);

  const normalizedPlayers = playerIds.map(nonEmptyPlayerId);
  if (new Set(normalizedPlayers).size !== normalizedPlayers.length) {
    throw new TypeError("No Thanks! player ids must be unique.");
  }

  if (!Array.isArray(turnOrder) || turnOrder.length !== normalizedPlayers.length) {
    throw new TypeError("No Thanks! requires a complete server-selected turn order.");
  }
  const normalizedOrder = turnOrder.map(nonEmptyPlayerId);
  if (new Set(normalizedOrder).size !== normalizedOrder.length
    || normalizedOrder.some((playerId) => !normalizedPlayers.includes(playerId))) {
    throw new TypeError("No Thanks! turn order must contain each player exactly once.");
  }

  const preparedDeck = normalizeCards(drawDeck, { expectedLength: NO_THANKS_PLAY_CARD_COUNT });
  const initialCounters = calculateInitialCounters(normalizedPlayers.length);

  return {
    phase: NO_THANKS_PHASE.PLAYING,
    players: normalizedPlayers.map((id) => ({ id, cards: [] })),
    playerCounters: Object.fromEntries(
      normalizedPlayers.map((id) => [id, initialCounters]),
    ),
    turnOrder: normalizedOrder,
    turnIndex: 0,
    activePlayerId: normalizedOrder[0],
    currentCard: preparedDeck[0],
    centerCounters: 0,
    drawDeck: preparedDeck.slice(1),
    deckRemaining: preparedDeck.length - 1,
    excludedCount: NO_THANKS_EXCLUDED_CARD_COUNT,
    finalScores: null,
    winners: [],
    endReason: null,
  };
}

export function getLegalActions(state) {
  if (state.phase !== NO_THANKS_PHASE.PLAYING) return [];

  return activeCounterCount(state) > 0
    ? [NO_THANKS_ACTION.REFUSE_CARD, NO_THANKS_ACTION.TAKE_CARD]
    : [NO_THANKS_ACTION.TAKE_CARD];
}

export function refuseCard(state) {
  assertPlaying(state);
  if (activeCounterCount(state) <= 0) {
    throw new Error("No Thanks! cannot refuse a card without a counter.");
  }

  const next = cloneState(state);
  next.playerCounters[next.activePlayerId] -= 1;
  next.centerCounters += 1;
  next.turnIndex = (next.turnIndex + 1) % next.turnOrder.length;
  next.activePlayerId = next.turnOrder[next.turnIndex];
  return next;
}

export function takeCard(state) {
  assertPlaying(state);
  const next = cloneState(state);
  const player = activePlayer(next);
  const takenCard = next.currentCard;

  assertCard(takenCard);
  player.cards = [...player.cards, takenCard].sort((left, right) => left - right);
  next.playerCounters[player.id] += next.centerCounters;
  next.centerCounters = 0;

  if (next.drawDeck.length > 0) {
    next.currentCard = next.drawDeck[0];
    next.drawDeck = next.drawDeck.slice(1);
    next.deckRemaining = next.drawDeck.length;
    return next;
  }

  next.currentCard = null;
  next.deckRemaining = 0;
  next.phase = NO_THANKS_PHASE.GAME_OVER;
  next.endReason = "LAST_CARD_TAKEN";
  next.finalScores = finalScoresFor(next);
  next.winners = winnerIdsFrom(next.finalScores, next.turnOrder);
  return next;
}
