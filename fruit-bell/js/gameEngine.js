export const FRUITS = [
  { id: "strawberry", label: "딸기", color: 0xe94f64, emoji: "🍓" },
  { id: "banana", label: "바나나", color: 0xf6cb4b, emoji: "🍌" },
  { id: "lime", label: "라임", color: 0x79c95a, emoji: "🍋‍🟩" },
  { id: "plum", label: "자두", color: 0x7655c7, emoji: "🟣" },
];

export const BELL_TARGET = 5;
const CARD_COUNTS = [1, 1, 1, 2, 2, 3, 3, 4, 5];

function shuffle(items, rng = Math.random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function normalizeTurnOrder(playerCount, turnOrder) {
  const natural = Array.from({ length: playerCount }, (_, index) => index);
  if (!turnOrder) return natural;
  if (!Array.isArray(turnOrder) || turnOrder.length !== playerCount) {
    throw new Error("턴 순서는 모든 플레이어 자리를 한 번씩 포함해야 합니다.");
  }
  const normalized = turnOrder.map(Number);
  const valid = normalized.every((index) => Number.isInteger(index) && index >= 0 && index < playerCount)
    && new Set(normalized).size === playerCount;
  if (!valid) throw new Error("턴 순서가 올바르지 않습니다.");
  return normalized;
}

export function createDeck(rng = Math.random) {
  let serial = 0;
  const deck = [];
  FRUITS.forEach((fruit) => {
    CARD_COUNTS.forEach((count) => {
      serial += 1;
      deck.push({ id: `${fruit.id}-${serial}`, fruit: fruit.id, count });
    });
  });
  return shuffle(deck, rng);
}

function topCard(player) {
  return player.faceUpPile[player.faceUpPile.length - 1] || null;
}

export function visibleTotals(players) {
  return players.reduce((totals, player) => {
    const card = topCard(player);
    if (!card) return totals;
    totals[card.fruit] = (totals[card.fruit] || 0) + card.count;
    return totals;
  }, {});
}

export function bellFruit(players) {
  const totals = visibleTotals(players);
  return Object.entries(totals).find(([, total]) => total === BELL_TARGET)?.[0] || null;
}

export class FruitBellGame {
  constructor({ players = [], rng = Math.random, turnOrder = null } = {}) {
    if (players.length < 2) throw new Error("최소 2명의 플레이어가 필요합니다.");
    this.rng = rng;
    this.players = players.map((player, index) => ({
      id: player.id || `player-${index + 1}`,
      name: player.name || `플레이어 ${index + 1}`,
      animalId: player.animalId || "fox",
      drawPile: [],
      faceUpPile: [],
      isOut: false,
    }));
    this.turnOrder = normalizeTurnOrder(this.players.length, turnOrder);
    this.activePlayerIndex = this.turnOrder[0] ?? 0;
    this.started = false;
    this.winnerId = null;
    this.lastEvent = null;
  }

  start() {
    const deck = createDeck(this.rng);
    deck.forEach((card, index) => this.players[index % this.players.length].drawPile.push(card));
    this.started = true;
    return this.snapshot();
  }

  snapshot() {
    return {
      started: this.started,
      activePlayerId: this.players[this.activePlayerIndex]?.id || null,
      winnerId: this.winnerId,
      bellFruit: bellFruit(this.players),
      visibleTotals: visibleTotals(this.players),
      lastEvent: this.lastEvent,
      players: this.players.map((player) => ({
        id: player.id,
        name: player.name,
        animalId: player.animalId,
        drawCount: player.drawPile.length,
        faceUpCount: player.faceUpPile.length,
        visibleCard: topCard(player),
        isOut: player.isOut,
      })),
    };
  }

  flipCard(playerId) {
    this.#assertPlayable();
    const player = this.players[this.activePlayerIndex];
    if (!player || player.id !== playerId) throw new Error("지금은 내 차례가 아닙니다.");
    if (!player.drawPile.length) throw new Error("뒤집을 카드가 없습니다.");

    const card = player.drawPile.shift();
    player.faceUpPile.push(card);
    this.lastEvent = { type: "flip", playerId, card };
    this.#refreshOutState();
    this.#advanceTurn();
    return { card, state: this.snapshot() };
  }

  ringBell(playerId) {
    this.#assertPlayable();
    const playerIndex = this.players.findIndex((candidate) => candidate.id === playerId);
    const player = this.players[playerIndex];
    if (!player || player.isOut) throw new Error("종을 칠 수 없는 상태입니다.");

    const targetFruit = bellFruit(this.players);
    if (targetFruit) {
      const collected = [];
      this.players.forEach((candidate) => collected.push(...candidate.faceUpPile.splice(0)));
      player.drawPile.push(...shuffle(collected, this.rng));
      this.activePlayerIndex = playerIndex;
      this.lastEvent = { type: "bell-correct", playerId, fruit: targetFruit, collectedCount: collected.length };
      this.#refreshOutState();
      this.#resolveWinner();
      return { correct: true, fruit: targetFruit, collectedCount: collected.length, state: this.snapshot() };
    }

    const penaltyTransfers = [];
    this.#indicesAfter(playerIndex).forEach((recipientIndex) => {
      const recipient = this.players[recipientIndex];
      if (!recipient || recipient.id === playerId || recipient.isOut) return;
      const penaltyCard = player.drawPile.shift();
      if (!penaltyCard) return;
      recipient.drawPile.push(penaltyCard);
      penaltyTransfers.push({
        fromPlayerId: playerId,
        toPlayerId: recipient.id,
        cardId: penaltyCard.id,
      });
    });

    if (player.drawPile.length === 0) player.isOut = true;
    this.lastEvent = {
      type: "bell-wrong",
      playerId,
      penaltyCount: penaltyTransfers.length,
      penaltyTransfers,
      eliminated: player.isOut,
    };
    this.#refreshOutState();
    if (!this.#resolveWinner() && this.players[this.activePlayerIndex]?.isOut) this.#advanceTurn();
    return {
      correct: false,
      penaltyCount: penaltyTransfers.length,
      penaltyTransfers,
      eliminated: player.isOut,
      state: this.snapshot(),
    };
  }

  #indicesAfter(playerIndex) {
    const orderPosition = this.turnOrder.indexOf(playerIndex);
    if (orderPosition < 0) return [];
    const result = [];
    for (let offset = 1; offset < this.turnOrder.length; offset += 1) {
      result.push(this.turnOrder[(orderPosition + offset) % this.turnOrder.length]);
    }
    return result;
  }

  #advanceTurn() {
    if (this.#resolveWinner()) return;
    for (const index of this.#indicesAfter(this.activePlayerIndex)) {
      if (!this.players[index].isOut && this.players[index].drawPile.length) {
        this.activePlayerIndex = index;
        return;
      }
    }
    this.#resolveWinner();
  }

  #refreshOutState() {
    this.players.forEach((player) => {
      if (player.isOut) return;
      player.isOut = player.drawPile.length === 0 && player.faceUpPile.length === 0;
    });
  }

  #resolveWinner() {
    const contenders = this.players.filter((player) => !player.isOut);
    if (contenders.length === 1) {
      this.winnerId = contenders[0].id;
      return true;
    }
    return false;
  }

  #assertPlayable() {
    if (!this.started) throw new Error("게임을 먼저 시작해 주세요.");
    if (this.winnerId) throw new Error("게임이 이미 종료되었습니다.");
  }
}
