export function normalizeDice(dice) {
  if (!Array.isArray(dice) || dice.length !== 2) throw new TypeError("Classic roll requires two dice.");
  const values = dice.map((value) => Number(value));
  if (values.some((value) => !Number.isInteger(value) || value < 1 || value > 6)) throw new RangeError("Each die must be an integer from 1 to 6.");
  return Object.freeze(values);
}

export function rollDice(random = Math.random) {
  if (typeof random !== "function") throw new TypeError("Dice random source must be a function.");
  const die = () => Math.floor(random() * 6) + 1;
  const dice = Object.freeze([die(), die()]);
  return Object.freeze({ dice, total: dice[0] + dice[1], isDouble: dice[0] === dice[1] });
}
