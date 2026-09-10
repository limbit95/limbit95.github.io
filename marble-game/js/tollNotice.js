import { CLASSIC_RULES } from "./themes/classic/rules.js";
import { formatThemeMoney } from "./themes/money.js";

function playerLabel(player) {
  return player?.name || player?.id || "플레이어";
}

function money(value, options = {}) {
  return formatThemeMoney(value, CLASSIC_RULES.currency, options);
}

function latestEvent(state, predicate) {
  for (let index = state.lastEvents.length - 1; index >= 0; index -= 1) {
    const event = state.lastEvents[index];
    if (predicate(event)) return event;
  }
  return null;
}

export function createClassicTollNotice(state) {
  if (!state?.board?.nodes || !Array.isArray(state.lastEvents)) return null;

  const landed = latestEvent(state, (event) => event.type === "TILE_LANDED" && event.nodeId);
  if (!landed) return null;

  const node = state.board.nodes.find((candidate) => candidate.id === landed.nodeId);
  if (!node || node.type !== "PROPERTY") return null;

  const payer = state.players.find((player) => player.id === landed.playerId);
  const propertyState = state.boardState?.properties?.[node.id];
  const owner = propertyState?.ownerId
    ? state.players.find((player) => player.id === propertyState.ownerId)
    : null;

  if (!payer || !owner || owner.id === payer.id) return null;

  const level = Math.max(0, Number(propertyState.buildingLevel) || 0);
  const expectedToll = Array.isArray(node.tollByLevel)
    ? node.tollByLevel[Math.min(level, node.tollByLevel.length - 1)]
    : 0;
  const paidEvent = latestEvent(state, (event) => (
    event.type === "MONEY_PAID"
    && event.reason === "TOLL"
    && event.playerId === payer.id
    && event.creditorId === owner.id
  ));
  const bankruptcyEvent = latestEvent(state, (event) => (
    event.type === "PLAYER_BANKRUPT"
    && event.playerId === payer.id
    && event.creditorId === owner.id
  ));
  const amount = Number.isFinite(paidEvent?.amount) ? paidEvent.amount : expectedToll;
  const balanceAfter = Math.max(0, Number(payer.money) || 0);
  const balanceBefore = Number.isFinite(paidEvent?.balanceBefore)
    ? paidEvent.balanceBefore
    : paidEvent
      ? balanceAfter + amount
      : Number.isFinite(bankruptcyEvent?.balanceBefore)
        ? bankruptcyEvent.balanceBefore
        : null;

  return Object.freeze({
    city: node.label,
    payerName: playerLabel(payer),
    ownerName: playerLabel(owner),
    ownerSeat: Number(owner.seat) || 0,
    amount,
    amountLabel: money(amount),
    deductionLabel: money(-amount, { signed: true }),
    balanceBefore,
    balanceBeforeLabel: balanceBefore === null ? "보유 골드 부족" : money(balanceBefore),
    balanceAfter,
    balanceAfterLabel: money(balanceAfter),
    effect: `현재 건물 ${level}단계 기준 통행료가 ${playerLabel(owner)}에게 적용됩니다.`,
    paid: Boolean(paidEvent),
  });
}
