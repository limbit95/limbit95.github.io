import { formatThemeMoney } from "./themes/money.js";
import { CLASSIC_RULES } from "./themes/classic/rules.js";

function playerLabel(player) {
  return player?.name || player?.id || "없음";
}

function money(value, options = {}) {
  return formatThemeMoney(value, CLASSIC_RULES.currency, options);
}

function latestEvent(state, predicate) {
  for (let index = state.lastEvents?.length - 1; index >= 0; index -= 1) {
    const event = state.lastEvents[index];
    if (predicate(event)) return event;
  }
  return null;
}

function propertyInfo(state, node) {
  const propertyState = state.boardState?.properties?.[node.id] ?? { ownerId: null, buildingLevel: 0 };
  const owner = propertyState.ownerId
    ? state.players.find((player) => player.id === propertyState.ownerId)
    : null;
  const level = Math.max(0, Number(propertyState.buildingLevel) || 0);
  const toll = Array.isArray(node.tollByLevel)
    ? node.tollByLevel[Math.min(level, node.tollByLevel.length - 1)]
    : null;

  const stats = [
    { label: "구매가", value: money(node.price) },
    { label: level > 0 ? "현재 통행료" : "기본 통행료", value: Number.isFinite(toll) ? money(toll) : "-" },
    { label: "소유자", value: owner ? playerLabel(owner) : "미소유" },
    { label: "건물", value: `${level} / ${node.maxBuildingLevel ?? 3} 단계` },
  ];

  if (Number.isFinite(node.buildCost)) {
    stats.push({ label: "건설 비용", value: level < (node.maxBuildingLevel ?? 3) ? money(node.buildCost) : "최대 단계" });
  }

  return {
    title: node.label,
    typeLabel: "도시",
    summary: owner ? `${playerLabel(owner)}이(가) 소유한 도시입니다.` : "아직 소유자가 없는 도시입니다.",
    effect: owner
      ? "다른 플레이어가 도착하면 현재 건물 단계에 따른 통행료를 소유자에게 지불합니다."
      : "도착한 플레이어는 조건을 충족하면 이 도시를 구매할 수 있습니다.",
    stats,
  };
}

function eventInfo(state, node) {
  const landed = latestEvent(state, (event) => event.type === "TILE_LANDED" && event.nodeId === node.id);
  const drawn = landed
    ? latestEvent(state, (event) => event.type === "EVENT_DRAWN" && event.playerId === landed.playerId)
    : null;

  if (!drawn) {
    return {
      title: node.label,
      typeLabel: "이벤트",
      summary: "도착하면 세계 여행 이벤트가 발생합니다.",
      effect: "보너스 또는 비용 등 Classic 이벤트 중 하나가 적용됩니다.",
      stats: [{ label: "효과", value: "랜덤 이벤트" }],
    };
  }

  const moneyEvent = latestEvent(state, (event) => (
    event.playerId === landed.playerId
    && event.reason === "EVENT"
    && ["MONEY_RECEIVED", "MONEY_PAID"].includes(event.type)
  ));
  const bankrupt = latestEvent(state, (event) => event.type === "PLAYER_BANKRUPT" && event.playerId === landed.playerId);
  const stats = [{ label: "이벤트", value: drawn.label }];

  if (moneyEvent?.type === "MONEY_RECEIVED") {
    stats.push({ label: "골드 변화", value: money(moneyEvent.amount, { signed: true }) });
  } else if (moneyEvent?.type === "MONEY_PAID") {
    stats.push({ label: "골드 변화", value: money(-moneyEvent.amount, { signed: true }) });
  } else if (bankrupt) {
    stats.push({ label: "결과", value: "보유 골드 부족 · 파산" });
  }

  return {
    title: node.label,
    typeLabel: "이벤트",
    summary: drawn.label,
    effect: bankrupt
      ? "이벤트 비용을 감당할 골드가 부족해 파산 처리되었습니다."
      : "이번 이벤트 결과가 즉시 현재 플레이어에게 적용되었습니다.",
    stats,
  };
}

export function createClassicTileInfo(state, nodeId, { startSalary = CLASSIC_RULES.startSalary } = {}) {
  if (!state?.board?.nodes) throw new TypeError("Marble state with board nodes is required.");
  const node = state.board.nodes.find((candidate) => candidate.id === nodeId);
  if (!node) return null;

  if (node.type === "PROPERTY") return propertyInfo(state, node);

  if (node.type === "BONUS") {
    return {
      title: node.label,
      typeLabel: "보너스",
      summary: `도착 시 ${money(node.amount)}를 받습니다.`,
      effect: "즉시 보너스 금액이 현재 플레이어의 자금에 추가됩니다.",
      stats: [{ label: "획득", value: money(node.amount, { signed: true }) }],
    };
  }

  if (node.type === "TAX") {
    return {
      title: node.label,
      typeLabel: "비용",
      summary: `도착 시 ${money(node.amount)}를 지불합니다.`,
      effect: "즉시 비용이 현재 플레이어의 자금에서 차감됩니다.",
      stats: [{ label: "지불", value: money(-node.amount, { signed: true }) }],
    };
  }

  if (node.type === "REST") {
    return {
      title: node.label,
      typeLabel: "휴식",
      summary: `도착하면 다음 ${node.skipTurns}턴을 쉽니다.`,
      effect: "지정된 횟수만큼 자신의 턴이 자동으로 건너뛰어집니다.",
      stats: [{ label: "휴식", value: `${node.skipTurns}턴` }],
    };
  }

  if (node.type === "EVENT") return eventInfo(state, node);

  if (node.type === "START") {
    return {
      title: node.label,
      typeLabel: "출발",
      summary: `한 바퀴를 통과할 때마다 ${money(startSalary)}를 받습니다.`,
      effect: "Classic 보드의 출발 지점이며 완주 보너스 기준점입니다.",
      stats: [{ label: "통과 보너스", value: money(startSalary, { signed: true }) }],
    };
  }

  return {
    title: node.label,
    typeLabel: node.type,
    summary: "특수 타일입니다.",
    effect: "이 타일의 규칙 효과가 적용됩니다.",
    stats: [],
  };
}
