import { BELL_TARGET, CARD_COUNTS, FRUITS, MAX_PLAYERS, MIN_PLAYERS } from "./constants.js";

function clampPlayerCount(count) {
  const numeric = Number(count);
  if (!Number.isFinite(numeric)) return MIN_PLAYERS;
  return Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, Math.trunc(numeric)));
}

function shuffle(items, rng = Math.random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function createDeck(rng = Math.random) {
  const cards = [];
  let serial = 0;

  FRUITS.forEach((fruit) => {
    CARD_COUNTS.forEach((count) => {
      serial += 1;
      cards.push({
        id: `${fruit.id}-${count}-${serial}`,
        fruit: fruit.id,
        count,
      });
    });
  });

  return shuffle(cards, rng);
}

function visibleCard(player) {
  return player.faceUpPile[player.faceUpPile.length - 1] || null;
}

export function getVisibleFruitTotals(players) {
  return players.reduce((totals, player) => {
    const card = visibleCard(player);
    if (!card) return totals;
    totals[card.fruit] = (totals[card.fruit] || 0) + card.count;
    return totals;
  }, {});
}

export function findBellFruit(players) {
  const totals = getVisibleFruitTotals(players);
  return Object.entries(totals).find(([, total]) => total === BELL_TARGET)?.[0] || null;
}

export class FruitBellGame {
  constructor({ players = [], rng = Math.random } = {}) {
    const count = clampPlayerCount(players.length || MIN_PLAYERS);
    this.rng = rng;
    this.players = Array.from({ length: count }, (_, index) => ({
      id: players[index]?.id || `player-${index + 1}`,
      name: players[index]?.name || `플레이어 ${index + 1}`,
      drawPile: [],
      faceUpPile: [],
      isOut: false,
    }));
    this.activePlayerIndex = 0;
    this.round = 1;
    this.winnerId = null;
    this.lastEvent = null;
    this.started = false;
  }

  start() {
    const deck = createDeck(this.rng);
    deck.forEach((card, index) => {
      this.players[index % this.players.length].drawPile.push(card);
    });
    this.started = true;
    this._refreshOutState();
    return this.snapshot();
  }

  snapshot() {
    return {
      started: this.started,
      round: this.round,
      activePlayerId: this.players[this.activePlayerIndex]?.id || null,
      winnerId: this.winnerId,
      bellFruit: findBellFruit(this.players),
      visibleTotals: getVisibleFruitTotals(this.players),
      lastEvent: this.lastEvent,
      players: this.players.map((player) => ({
        id: player.id,
        name: player.name,
        drawCount: player.drawPile.length,
        faceUpCount: player.faceUpPile.length,
        visibleCard: visibleCard(player),
        isOut: player.isOut,
      })),
    };
  }

  flipCard(playerId) {
    this._assertPlayable();
    const player = this.players[this.activePlayerIndex];
    if (!player || player.id !== playerId) {
      throw new Error("현재 차례의 플레이어만 카드를 뒤집을 수 있습니다.");
    }
    if (!player.drawPile.length) {
      throw new Error("뒤집을 카드가 없습니다.");
    }

    const card = player.drawPile.shift();
    player.faceUpPile.push(card);
    this.lastEvent = { type: "flip", playerId, card };
    this._refreshOutState();
    this._advanceTurn();
    return { card, state: this.snapshot() };
  }

  ringBell(playerId) {
    this._assertPlayable();
    const ringer = this.players.find((player) => player.id === playerId);
    if (!ringer || ringer.isOut) {
      throw new Error("종을 칠 수 없는 플레이어입니다.");
    }

    const bellFruit = findBellFruit(this.players);
    if (bellFruit) {
      const collected = [];
      this.players.forEach((player) => {
        collected.push(...player.faceUpPile.splice(0));
      });
      ringer.drawPile.push(...shuffle(collected, this.rng));
      this.round += 1;
      this.lastEvent = {
        type: "bell-correct",
        playerId,
        fruit: bellFruit,
        collectedCount: collected.length,
      };
      this.activePlayerIndex = this.players.findIndex((player) => player.id === playerId);
      this._refreshOutState();
      this._resolveWinner();
      return { correct: true, fruit: bellFruit, collectedCount: collected.length, state: this.snapshot() };
    }

    const penaltyRecipients = this.players.filter((player) => player.id !== playerId && !player.isOut);
    let penaltyCount = 0;
    penaltyRecipients.forEach((recipient) => {
      const penaltyCard = ringer.drawPile.shift();
      if (!penaltyCard) return;
      recipient.drawPile.push(penaltyCard);
      penaltyCount += 1;
    });

    this.lastEvent = { type: "bell-wrong", playerId, penaltyCount };
    this._refreshOutState();
    this._resolveWinner();
    return { correct: false, penaltyCount, state: this.snapshot() };
  }

  _advanceTurn() {
    if (this._resolveWinner()) return;

    for (let offset = 1; offset <= this.players.length; offset += 1) {
      const index = (this.activePlayerIndex + offset) % this.players.length;
      if (this.players[index].drawPile.length > 0 && !this.players[index].isOut) {
        this.activePlayerIndex = index;
        return;
      }
    }

    this._resolveWinner(true);
  }

  _refreshOutState() {
    this.players.forEach((player) => {
      player.isOut = player.drawPile.length === 0 && player.faceUpPile.length === 0;
    });
  }

  _resolveWinner(forceFromDrawPiles = false) {
    const contenders = this.players.filter((player) => !player.isOut);
    if (contenders.length === 1) {
      this.winnerId = contenders[0].id;
      return true;
    }

    if (forceFromDrawPiles) {
      const drawable = this.players.filter((player) => player.drawPile.length > 0 && !player.isOut);
      if (drawable.length === 1) {
        this.winnerId = drawable[0].id;
        return true;
      }
      if (drawable.length === 0 && contenders.length > 0) {
        const ranked = [...contenders].sort(
          (left, right) => (right.drawPile.length + right.faceUpPile.length) - (left.drawPile.length + left.faceUpPile.length),
        );
        this.winnerId = ranked[0].id;
        return true;
      }
    }

    return false;
  }

  _assertPlayable() {
    if (!this.started) throw new Error("게임을 먼저 시작해 주세요.");
    if (this.winnerId) throw new Error("이미 게임이 종료되었습니다.");
  }
}
