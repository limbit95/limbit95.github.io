export const MVP_CATALOG = Object.freeze([
  {
    code: "savior",
    icon: "↩",
    title: "구원자",
    description: "±10 되돌리기를 가장 많이 만든 플레이어",
  },
  {
    code: "card-machine",
    icon: "◆",
    title: "카드 머신",
    description: "가장 많은 카드를 처리한 플레이어",
  },
  {
    code: "steady-hand",
    icon: "◎",
    title: "안정적인 손",
    description: "가장 작은 평균 간격으로 더미를 관리한 플레이어",
  },
  {
    code: "clutch-finisher",
    icon: "⚡",
    title: "막판 해결사",
    description: "마지막 20장 구간에서 가장 많은 카드를 처리한 플레이어",
  },
  {
    code: "chain-player",
    icon: "≋",
    title: "연쇄 플레이어",
    description: "한 턴에 가장 많은 카드를 연속으로 내려놓은 플레이어",
  },
  {
    code: "crisis-manager",
    icon: "◇",
    title: "위기관리 전문가",
    description: "위험해진 더미를 ±10으로 가장 많이 복구한 플레이어",
  },
  {
    code: "bold-player",
    icon: "▲",
    title: "과감한 승부사",
    description: "25 이상 큰 간격의 플레이를 가장 많이 선택한 플레이어",
  },
  {
    code: "precision-player",
    icon: "·",
    title: "정밀 플레이어",
    description: "1~3 차이의 정밀 플레이를 가장 많이 만든 플레이어",
  },
  {
    code: "reverse-combo",
    icon: "↺",
    title: "되돌리기 콤보",
    description: "한 턴 안에서 ±10을 가장 길게 연속 성공한 플레이어",
  },
]);

const CATALOG_BY_CODE = new Map(MVP_CATALOG.map((item) => [item.code, item]));

export function getMvpDefinition(code) {
  return CATALOG_BY_CODE.get(code) ?? null;
}

export function formatMvpValue(code, value) {
  const numeric = Number(value);
  const safe = Number.isFinite(numeric) ? numeric : 0;
  switch (code) {
    case "savior": return `${safe}회 되돌리기`;
    case "card-machine": return `${safe}장 플레이`;
    case "steady-hand": return `평균 간격 ${safe.toFixed(1)}`;
    case "clutch-finisher": return `막판 ${safe}장 처리`;
    case "chain-player": return `한 턴 ${safe}장`;
    case "crisis-manager": return `위기 복구 ${safe}회`;
    case "bold-player": return `큰 점프 ${safe}회`;
    case "precision-player": return `정밀 플레이 ${safe}회`;
    case "reverse-combo": return `최대 ${safe}연속`;
    default: return String(safe);
  }
}

function createPlayerStat(playerIndex, nickname) {
  return {
    playerIndex,
    nickname: nickname || `플레이어 ${playerIndex + 1}`,
    cardsPlayed: 0,
    reverseJumps: 0,
    gapSum: 0,
    gapSamples: 0,
    maxTurnCards: 0,
    lateGameCards: 0,
    rescuePlays: 0,
    boldPlays: 0,
    precisionPlays: 0,
    currentTurnCards: 0,
    turnMarker: 0,
    currentReverseCombo: 0,
    maxReverseCombo: 0,
    reverseComboTurn: 0,
  };
}

export function createRoundStats({ playerCount, nicknames = [] } = {}) {
  if (!Number.isInteger(playerCount) || playerCount < 1) {
    throw new RangeError("playerCount must be a positive integer.");
  }

  return {
    totalCardsPlayed: 0,
    players: Array.from(
      { length: playerCount },
      (_, index) => createPlayerStat(index, nicknames[index]),
    ),
  };
}

export function recordRoundPlay(roundStats, {
  playerIndex,
  card,
  pileDirection,
  previousValue,
  turnNumber,
  remainingBefore,
} = {}) {
  const player = roundStats?.players?.[playerIndex];
  if (!player) throw new RangeError("playerIndex is out of range.");
  if (!Number.isInteger(card)) throw new TypeError("card must be an integer.");
  if (pileDirection !== "ascending" && pileDirection !== "descending") {
    throw new Error(`Unknown pile direction: ${pileDirection}`);
  }
  if (!Number.isInteger(turnNumber) || turnNumber < 1) {
    throw new RangeError("turnNumber must be a positive integer.");
  }

  const hasPrevious = Number.isInteger(previousValue);
  const gap = hasPrevious ? Math.abs(card - previousValue) : null;
  const reverse = hasPrevious && (
    (pileDirection === "ascending" && previousValue - card === 10)
    || (pileDirection === "descending" && card - previousValue === 10)
  );
  const rescue = reverse && (
    (pileDirection === "ascending" && previousValue >= 75)
    || (pileDirection === "descending" && previousValue <= 25)
  );

  player.cardsPlayed += 1;
  roundStats.totalCardsPlayed += 1;

  if (player.turnMarker === turnNumber) {
    player.currentTurnCards += 1;
  } else {
    player.turnMarker = turnNumber;
    player.currentTurnCards = 1;
  }
  player.maxTurnCards = Math.max(player.maxTurnCards, player.currentTurnCards);

  if (hasPrevious) {
    player.gapSum += gap;
    player.gapSamples += 1;
  }

  if (reverse) {
    player.reverseJumps += 1;
    player.currentReverseCombo = player.reverseComboTurn === turnNumber
      ? player.currentReverseCombo + 1
      : 1;
    player.reverseComboTurn = turnNumber;
    player.maxReverseCombo = Math.max(player.maxReverseCombo, player.currentReverseCombo);
  } else {
    player.currentReverseCombo = 0;
    player.reverseComboTurn = turnNumber;
    if (gap >= 25) player.boldPlays += 1;
    if (gap >= 1 && gap <= 3) player.precisionPlays += 1;
  }

  if (rescue) player.rescuePlays += 1;
  if (Number.isFinite(remainingBefore) && remainingBefore <= 20) {
    player.lateGameCards += 1;
  }

  return { reverse, rescue, gap };
}

function awardForMax(players, code, selector, minimum = 1) {
  const values = players.map(selector);
  const best = Math.max(...values);
  if (!Number.isFinite(best) || best < minimum) return null;
  return {
    code,
    winners: players
      .filter((player) => selector(player) === best)
      .map((player) => ({
        playerIndex: player.playerIndex,
        nickname: player.nickname,
        value: best,
      })),
  };
}

function steadyHandAward(players) {
  const eligible = players.filter((player) => player.gapSamples >= 3);
  if (eligible.length === 0) return null;
  const averageOf = (player) => player.gapSum / player.gapSamples;
  const best = Math.min(...eligible.map(averageOf));
  return {
    code: "steady-hand",
    winners: eligible
      .filter((player) => Math.abs(averageOf(player) - best) < 1e-9)
      .map((player) => ({
        playerIndex: player.playerIndex,
        nickname: player.nickname,
        value: Math.round(best * 10) / 10,
      })),
  };
}

export function buildMvpAwards(roundStats) {
  const players = roundStats?.players ?? [];
  if (players.length === 0) return [];

  return [
    awardForMax(players, "savior", (player) => player.reverseJumps),
    awardForMax(players, "card-machine", (player) => player.cardsPlayed),
    steadyHandAward(players),
    awardForMax(players, "clutch-finisher", (player) => player.lateGameCards),
    awardForMax(players, "chain-player", (player) => player.maxTurnCards, 2),
    awardForMax(players, "crisis-manager", (player) => player.rescuePlays),
    awardForMax(players, "bold-player", (player) => player.boldPlays),
    awardForMax(players, "precision-player", (player) => player.precisionPlays),
    awardForMax(players, "reverse-combo", (player) => player.maxReverseCombo, 2),
  ].filter(Boolean);
}
