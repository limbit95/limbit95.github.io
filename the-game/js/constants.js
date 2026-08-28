export const PLAYER_COUNT_MIN = 1;
export const PLAYER_COUNT_MAX = 5;

export const CARD_MIN = 2;
export const CARD_MAX = 99;
export const TOTAL_NUMBER_CARDS = CARD_MAX - CARD_MIN + 1;

export const PILE_DIRECTION = Object.freeze({
  ASCENDING: "ascending",
  DESCENDING: "descending",
});

export const GAME_STATUS = Object.freeze({
  PLAYING: "playing",
  WON: "won",
  LOST: "lost",
});

export const STARTING_PILES = Object.freeze([
  Object.freeze({ id: "ascending-1", direction: PILE_DIRECTION.ASCENDING, value: 1 }),
  Object.freeze({ id: "ascending-2", direction: PILE_DIRECTION.ASCENDING, value: 1 }),
  Object.freeze({ id: "descending-1", direction: PILE_DIRECTION.DESCENDING, value: 100 }),
  Object.freeze({ id: "descending-2", direction: PILE_DIRECTION.DESCENDING, value: 100 }),
]);

export const HAND_SIZE_BY_PLAYER_COUNT = Object.freeze({
  1: 8,
  2: 7,
  3: 6,
  4: 6,
  5: 6,
});

export const MIN_CARDS_PER_TURN_WITH_DRAW_PILE = 2;
export const MIN_CARDS_PER_TURN_WITHOUT_DRAW_PILE = 1;
export const REVERSE_JUMP = 10;
