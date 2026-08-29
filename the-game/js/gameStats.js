export const MVP_CATALOG = Object.freeze([
  {
    code: "savior",
    icon: "🛟",
    title: "구원자",
    description: "±10 되돌리기를 가장 많이 만든 플레이어",
  },
  {
    code: "card-machine",
    icon: "🃏",
    title: "카드 머신",
    description: "가장 많은 카드를 처리한 플레이어",
  },
  {
    code: "steady-hand",
    icon: "🧘",
    title: "안정적인 손",
    description: "가장 작은 평균 간격으로 더미를 관리한 플레이어",
  },
  {
    code: "clutch-finisher",
    icon: "🏁",
    title: "막판 해결사",
    description: "마지막 20장 구간에서 가장 많은 카드를 처리한 플레이어",
  },
  {
    code: "chain-player",
    icon: "🔗",
    title: "연쇄 플레이어",
    description: "한 턴에 가장 많은 카드를 연속으로 내려놓은 플레이어",
  },
  {
    code: "crisis-manager",
    icon: "🧯",
    title: "위기관리 전문가",
    description: "위험해진 더미를 ±10으로 가장 많이 복구한 플레이어",
  },
  {
    code: "bold-player",
    icon: "🎲",
    title: "과감한 승부사",
    description: "25 이상 큰 간격의 플레이를 가장 많이 선택한 플레이어",
  },
  {
    code: "precision-player",
    icon: "🎯",
    title: "정밀 플레이어",
    description: "1~3 차이의 정밀 플레이를 가장 많이 만든 플레이어",
  },
  {
    code: "reverse-combo",
    icon: "🔄",
    title: "되돌리기 콤보",
    description: "한 턴 안에서 ±10을 가장 길게 연속 성공한 플레이어",
  },
  {
    code: "runaway-train",
    icon: "🚂",
    title: "폭주 기관차",
    description: "한 턴에 25 이상 큰 점프를 연속으로 가장 길게 몰아친 플레이어",
  },
  {
    code: "safety-distance",
    icon: "🚧",
    title: "안전거리 미준수",
    description: "±10을 제외한 일반 플레이의 평균 숫자 간격이 가장 큰 플레이어",
  },
  {
    code: "one-hit-too-big",
    icon: "💥",
    title: "한 방이 너무 컸다",
    description: "한 번의 일반 플레이에서 가장 큰 숫자 간격을 만든 플레이어",
  },
  {
    code: "heart-pound",
    icon: "💓",
    title: "심장 쫄깃 담당",
    description: "안전하던 더미를 위험 구간으로 가장 많이 진입시킨 플레이어",
  },
  {
    code: "block-master",
    icon: "🧱",
    title: "길막 장인",
    description: "더미를 90 이상 또는 10 이하의 극단 구간까지 가장 많이 밀어붙인 플레이어",
  },
  {
    code: "reverse-destroyer",
    icon: "🔨",
    title: "되돌리기 파괴왕",
    description: "손에 있던 ±10 카드를 두고 다른 카드를 내서 되돌리기 기회를 가장 많이 없앤 플레이어",
  },
  {
    code: "brake-failure",
    icon: "🚨",
    title: "브레이크 고장",
    description: "이미 위험한 더미에서 10 이상 더 밀어붙인 플레이가 가장 많은 플레이어",
  },
  {
    code: "just-play-it",
    icon: "🤷",
    title: "일단 내고 보자",
    description: "턴의 첫 카드부터 15 이상 크게 점프한 횟수가 가장 많은 플레이어",
  },
  {
    code: "bomb-thrower",
    icon: "🧨",
    title: "폭탄 투척범",
    description: "안전 구간에서 위험 구간으로 넘어갈 때 한 번에 가장 깊게 밀어넣은 플레이어",
  },
  {
    code: "heart-rate",
    icon: "❤️‍🔥",
    title: "팀원 심박수 기여자",
    description: "10~24 차이의 아슬아슬한 중간 점프를 가장 많이 만든 플레이어",
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
    case "runaway-train": return `한 턴 ${safe}연속 폭주`;
    case "safety-distance": return `평균 간격 ${safe.toFixed(1)}`;
    case "one-hit-too-big": return `최대 간격 ${safe}`;
    case "heart-pound": return `위험 진입 ${safe}회`;
    case "block-master": return `극단 구간 ${safe}회`;
    case "reverse-destroyer": return `±10 기회 ${safe}회 소멸`;
    case "brake-failure": return `위험 점프 ${safe}회`;
    case "just-play-it": return `첫 카드 무리수 ${safe}회`;
    case "bomb-thrower": return `위험선 ${safe}칸 초과`;
    case "heart-rate": return `아슬아슬 점프 ${safe}회`;
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
    nonReverseGapSum: 0,
    nonReverseGapSamples: 0,
    maxGap: 0,
    dangerEntries: 0,
    extremeBlocks: 0,
    reverseOpportunitiesWasted: 0,
    dangerousBigJumps: 0,
    recklessOpenings: 0,
    maxDangerOvershoot: 0,
    midRiskPlays: 0,
    currentBoldStreak: 0,
    maxBoldStreak: 0,
    boldStreakTurn: 0,
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
  handCards = [],
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

  const ascending = pileDirection === "ascending";
  const hasPrevious = Number.isInteger(previousValue);
  const gap = hasPrevious ? Math.abs(card - previousValue) : null;
  const reverse = hasPrevious && (
    (ascending && previousValue - card === 10)
    || (!ascending && card - previousValue === 10)
  );
  const rescue = reverse && (
    (ascending && previousValue >= 75)
    || (!ascending && previousValue <= 25)
  );
  const dangerBefore = hasPrevious && (
    (ascending && previousValue >= 75)
    || (!ascending && previousValue <= 25)
  );
  const dangerAfter = (
    (ascending && card >= 75)
    || (!ascending && card <= 25)
  );
  const dangerEntry = hasPrevious && !reverse && !dangerBefore && dangerAfter;
  const extremeBlock = !reverse && (
    (ascending && card >= 90)
    || (!ascending && card <= 10)
  );
  const reverseTarget = hasPrevious
    ? (ascending ? previousValue - 10 : previousValue + 10)
    : null;
  const wastedReverse = !reverse
    && Number.isInteger(reverseTarget)
    && reverseTarget >= 2
    && reverseTarget <= 99
    && Array.isArray(handCards)
    && handCards.includes(reverseTarget);
  const dangerousBigJump = !reverse && dangerBefore && gap >= 10;
  const isTurnOpening = player.turnMarker !== turnNumber;
  const recklessOpening = !reverse && isTurnOpening && gap >= 15;
  const dangerOvershoot = dangerEntry
    ? (ascending ? Math.max(0, card - 75) : Math.max(0, 25 - card))
    : 0;
  const midRiskPlay = !reverse && gap >= 10 && gap <= 24;
  const boldPlay = !reverse && gap >= 25;

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

    if (hasPrevious) {
      player.nonReverseGapSum += gap;
      player.nonReverseGapSamples += 1;
      player.maxGap = Math.max(player.maxGap, gap);
    }
    if (boldPlay) player.boldPlays += 1;
    if (gap >= 1 && gap <= 3) player.precisionPlays += 1;
  }

  if (boldPlay) {
    player.currentBoldStreak = player.boldStreakTurn === turnNumber
      ? player.currentBoldStreak + 1
      : 1;
    player.boldStreakTurn = turnNumber;
    player.maxBoldStreak = Math.max(player.maxBoldStreak, player.currentBoldStreak);
  } else {
    player.currentBoldStreak = 0;
    player.boldStreakTurn = turnNumber;
  }

  if (rescue) player.rescuePlays += 1;
  if (Number.isFinite(remainingBefore) && remainingBefore <= 20) {
    player.lateGameCards += 1;
  }
  if (dangerEntry) player.dangerEntries += 1;
  if (extremeBlock) player.extremeBlocks += 1;
  if (wastedReverse) player.reverseOpportunitiesWasted += 1;
  if (dangerousBigJump) player.dangerousBigJumps += 1;
  if (recklessOpening) player.recklessOpenings += 1;
  if (dangerOvershoot > 0) {
    player.maxDangerOvershoot = Math.max(player.maxDangerOvershoot, dangerOvershoot);
  }
  if (midRiskPlay) player.midRiskPlays += 1;

  return {
    reverse,
    rescue,
    gap,
    dangerEntry,
    extremeBlock,
    wastedReverse,
    dangerousBigJump,
    recklessOpening,
    dangerOvershoot,
    midRiskPlay,
    boldPlay,
  };
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

function awardForAverage(players, code, { selectSum, selectSamples, mode }) {
  const eligible = players.filter((player) => selectSamples(player) >= 3);
  if (eligible.length === 0) return null;
  const averageOf = (player) => selectSum(player) / selectSamples(player);
  const values = eligible.map(averageOf);
  const best = mode === "max" ? Math.max(...values) : Math.min(...values);
  return {
    code,
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
    awardForAverage(players, "steady-hand", {
      selectSum: (player) => player.gapSum,
      selectSamples: (player) => player.gapSamples,
      mode: "min",
    }),
    awardForMax(players, "clutch-finisher", (player) => player.lateGameCards),
    awardForMax(players, "chain-player", (player) => player.maxTurnCards, 2),
    awardForMax(players, "crisis-manager", (player) => player.rescuePlays),
    awardForMax(players, "bold-player", (player) => player.boldPlays),
    awardForMax(players, "precision-player", (player) => player.precisionPlays),
    awardForMax(players, "reverse-combo", (player) => player.maxReverseCombo, 2),
    awardForMax(players, "runaway-train", (player) => player.maxBoldStreak, 2),
    awardForAverage(players, "safety-distance", {
      selectSum: (player) => player.nonReverseGapSum,
      selectSamples: (player) => player.nonReverseGapSamples,
      mode: "max",
    }),
    awardForMax(players, "one-hit-too-big", (player) => player.maxGap, 20),
    awardForMax(players, "heart-pound", (player) => player.dangerEntries),
    awardForMax(players, "block-master", (player) => player.extremeBlocks),
    awardForMax(players, "reverse-destroyer", (player) => player.reverseOpportunitiesWasted),
    awardForMax(players, "brake-failure", (player) => player.dangerousBigJumps),
    awardForMax(players, "just-play-it", (player) => player.recklessOpenings),
    awardForMax(players, "bomb-thrower", (player) => player.maxDangerOvershoot),
    awardForMax(players, "heart-rate", (player) => player.midRiskPlays),
  ].filter(Boolean);
}
