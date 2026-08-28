import {
  CARD_MAX,
  CARD_MIN,
  GAME_STATUS,
  HAND_SIZE_BY_PLAYER_COUNT,
  MIN_CARDS_PER_TURN_WITH_DRAW_PILE,
  MIN_CARDS_PER_TURN_WITHOUT_DRAW_PILE,
  PILE_DIRECTION,
  PLAYER_COUNT_MAX,
  PLAYER_COUNT_MIN,
  REVERSE_JUMP,
  STARTING_PILES,
  TOTAL_NUMBER_CARDS,
} from "./constants.js";

function assertPlayerCount(playerCount) {
  if (!Number.isInteger(playerCount) || playerCount < PLAYER_COUNT_MIN || playerCount > PLAYER_COUNT_MAX) {
    throw new RangeError(`playerCount must be an integer between ${PLAYER_COUNT_MIN} and ${PLAYER_COUNT_MAX}.`);
  }
}

function assertCard(card) {
  if (!Number.isInteger(card) || card < CARD_MIN || card > CARD_MAX) {
    throw new RangeError(`card must be an integer between ${CARD_MIN} and ${CARD_MAX}.`);
  }
}

function assertPlaying(state) {
  if (!state || state.status !== GAME_STATUS.PLAYING) {
    throw new Error("The game is not currently in a playable state.");
  }
}

function createResult(outcome, remainingCards, reason) {
  return {
    outcome,
    reason,
    remainingCards,
    cardsPlayed: TOTAL_NUMBER_CARDS - remainingCards,
  };
}

export function createDeck() {
  return Array.from({ length: TOTAL_NUMBER_CARDS }, (_, index) => CARD_MIN + index);
}

export function shuffleDeck(deck, rng = Math.random) {
  if (!Array.isArray(deck)) {
    throw new TypeError("deck must be an array.");
  }
  if (typeof rng !== "function") {
    throw new TypeError("rng must be a function.");
  }

  const shuffled = [...deck];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomValue = rng();
    if (!Number.isFinite(randomValue) || randomValue < 0 || randomValue >= 1) {
      throw new RangeError("rng must return a number greater than or equal to 0 and less than 1.");
    }
    const swapIndex = Math.floor(randomValue * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

export function getHandSize(playerCount) {
  assertPlayerCount(playerCount);
  return HAND_SIZE_BY_PLAYER_COUNT[playerCount];
}

export function createInitialState({ playerCount, rng = Math.random, playerIds } = {}) {
  assertPlayerCount(playerCount);

  if (playerIds !== undefined) {
    if (!Array.isArray(playerIds) || playerIds.length !== playerCount) {
      throw new Error("playerIds must contain exactly one id per player.");
    }
    if (new Set(playerIds).size !== playerIds.length) {
      throw new Error("playerIds must be unique.");
    }
  }

  const handSize = getHandSize(playerCount);
  const drawPile = shuffleDeck(createDeck(), rng);
  const players = Array.from({ length: playerCount }, (_, index) => ({
    id: playerIds?.[index] ?? `player-${index + 1}`,
    hand: [],
  }));

  // Deal round-robin so initialization behaves like a physical deal while
  // keeping all randomness isolated in shuffleDeck.
  for (let round = 0; round < handSize; round += 1) {
    for (const player of players) {
      player.hand.push(drawPile.pop());
    }
  }

  return {
    status: GAME_STATUS.PLAYING,
    playerCount,
    handSize,
    players,
    drawPile,
    piles: STARTING_PILES.map((pile) => ({ ...pile, history: [pile.value] })),
    currentPlayerIndex: 0,
    cardsPlayedThisTurn: 0,
    turnNumber: 1,
    lastMove: null,
    result: null,
  };
}

export function canPlayCard(card, pile) {
  assertCard(card);
  if (!pile || !Number.isInteger(pile.value)) {
    throw new TypeError("pile must contain an integer value.");
  }

  if (pile.direction === PILE_DIRECTION.ASCENDING) {
    return card > pile.value || pile.value - card === REVERSE_JUMP;
  }
  if (pile.direction === PILE_DIRECTION.DESCENDING) {
    return card < pile.value || card - pile.value === REVERSE_JUMP;
  }
  throw new Error(`Unknown pile direction: ${pile.direction}`);
}

export function getPlayablePiles(state, card) {
  assertCard(card);
  return state.piles.filter((pile) => canPlayCard(card, pile));
}

export function getPlayableMoves(state, playerIndex = state.currentPlayerIndex) {
  const player = state.players[playerIndex];
  if (!player) {
    throw new RangeError("playerIndex is out of range.");
  }

  return player.hand.flatMap((card) =>
    getPlayablePiles(state, card).map((pile) => ({
      card,
      pileId: pile.id,
    })),
  );
}

export function getRequiredCardsThisTurn(state) {
  return state.drawPile.length > 0
    ? MIN_CARDS_PER_TURN_WITH_DRAW_PILE
    : MIN_CARDS_PER_TURN_WITHOUT_DRAW_PILE;
}

export function canEndTurn(state) {
  return state.status === GAME_STATUS.PLAYING
    && state.cardsPlayedThisTurn >= getRequiredCardsThisTurn(state);
}

export function getRemainingCardCount(state) {
  return state.drawPile.length + state.players.reduce((sum, player) => sum + player.hand.length, 0);
}

export function evaluateGameState(state) {
  if (state.status !== GAME_STATUS.PLAYING) {
    return state;
  }

  const remainingCards = getRemainingCardCount(state);
  if (remainingCards === 0) {
    return {
      ...state,
      status: GAME_STATUS.WON,
      result: createResult(GAME_STATUS.WON, 0, "all_cards_played"),
    };
  }

  const requiredCards = getRequiredCardsThisTurn(state);
  if (state.cardsPlayedThisTurn < requiredCards && getPlayableMoves(state).length === 0) {
    return {
      ...state,
      status: GAME_STATUS.LOST,
      result: createResult(GAME_STATUS.LOST, remainingCards, "minimum_cards_unplayable"),
    };
  }

  return state;
}

export function playCard(state, { playerIndex = state.currentPlayerIndex, card, pileId } = {}) {
  assertPlaying(state);
  assertCard(card);

  if (playerIndex !== state.currentPlayerIndex) {
    throw new Error("Only the current player can play a card.");
  }

  const player = state.players[playerIndex];
  const cardIndex = player.hand.indexOf(card);
  if (cardIndex === -1) {
    throw new Error(`Player ${player.id} does not hold card ${card}.`);
  }

  const pileIndex = state.piles.findIndex((pile) => pile.id === pileId);
  if (pileIndex === -1) {
    throw new Error(`Unknown pile: ${pileId}`);
  }

  const pile = state.piles[pileIndex];
  if (!canPlayCard(card, pile)) {
    throw new Error(`Card ${card} cannot be played on pile ${pileId}.`);
  }

  const nextHand = [...player.hand];
  nextHand.splice(cardIndex, 1);

  const nextPlayers = state.players.map((candidate, index) => (
    index === playerIndex ? { ...candidate, hand: nextHand } : candidate
  ));

  const nextPiles = state.piles.map((candidate, index) => (
    index === pileIndex
      ? { ...candidate, value: card, history: [...candidate.history, card] }
      : candidate
  ));

  const nextState = {
    ...state,
    players: nextPlayers,
    piles: nextPiles,
    cardsPlayedThisTurn: state.cardsPlayedThisTurn + 1,
    lastMove: {
      playerIndex,
      playerId: player.id,
      card,
      pileId,
      turnNumber: state.turnNumber,
    },
  };

  return evaluateGameState(nextState);
}

export function endTurn(state) {
  assertPlaying(state);
  if (!canEndTurn(state)) {
    throw new Error(`At least ${getRequiredCardsThisTurn(state)} card(s) must be played before ending the turn.`);
  }

  const drawPile = [...state.drawPile];
  const currentPlayer = state.players[state.currentPlayerIndex];
  const refilledHand = [...currentPlayer.hand];

  while (refilledHand.length < state.handSize && drawPile.length > 0) {
    refilledHand.push(drawPile.pop());
  }

  const players = state.players.map((player, index) => (
    index === state.currentPlayerIndex
      ? { ...player, hand: refilledHand }
      : player
  ));

  const nextState = {
    ...state,
    players,
    drawPile,
    currentPlayerIndex: (state.currentPlayerIndex + 1) % state.playerCount,
    cardsPlayedThisTurn: 0,
    turnNumber: state.turnNumber + 1,
  };

  return evaluateGameState(nextState);
}
