export const FRUITS = Object.freeze([
  { id: "strawberry", label: "딸기", emoji: "🍓" },
  { id: "banana", label: "바나나", emoji: "🍌" },
  { id: "lime", label: "라임", emoji: "🍋" },
  { id: "plum", label: "자두", emoji: "🟣" },
]);

export const FRUIT_BY_ID = Object.freeze(
  Object.fromEntries(FRUITS.map((fruit) => [fruit.id, fruit])),
);

export const CARD_COUNTS = Object.freeze([1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 5, 5]);
export const BELL_TARGET = 5;
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 4;
