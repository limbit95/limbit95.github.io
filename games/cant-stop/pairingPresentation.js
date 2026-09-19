const PAIRING_INDEXES = Object.freeze([
  Object.freeze([[0, 1], [2, 3]]),
  Object.freeze([[0, 2], [1, 3]]),
  Object.freeze([[0, 3], [1, 2]]),
]);

function sameSums(left, right) {
  if (!Array.isArray(left) || !Array.isArray(right) || left.length !== 2 || right.length !== 2) {
    return false;
  }
  return left[0] === right[0] && left[1] === right[1]
    || left[0] === right[1] && left[1] === right[0];
}

export function resolveCantStopPairingDiceGroups(dice, sums) {
  if (!Array.isArray(dice) || dice.length !== 4 || !Array.isArray(sums) || sums.length !== 2) {
    return null;
  }

  for (const pairing of PAIRING_INDEXES) {
    const groups = pairing.map(([a, b]) => ({
      dice: [Number(dice[a]), Number(dice[b])],
      sum: Number(dice[a]) + Number(dice[b]),
    }));
    if (sameSums(groups.map((group) => group.sum), sums.map(Number))) {
      if (groups[0].sum !== Number(sums[0]) && groups[1].sum === Number(sums[0])) {
        groups.reverse();
      }
      return groups.map((group) => Object.freeze({
        dice: Object.freeze([...group.dice]),
        sum: group.sum,
      }));
    }
  }

  return null;
}

export function createCantStopPairingPresentation(latestDice, legalPairings) {
  if (!Array.isArray(legalPairings)) return Object.freeze([]);

  return Object.freeze(legalPairings.map((pairing, index) => Object.freeze({
    id: `pairing-${index + 1}`,
    sums: Object.freeze([...(pairing?.sums ?? [])].map(Number)),
    groups: resolveCantStopPairingDiceGroups(latestDice, pairing?.sums ?? []),
    plans: Object.freeze((pairing?.plans ?? []).map((plan) => Object.freeze([...plan].map(Number)))),
  })));
}
