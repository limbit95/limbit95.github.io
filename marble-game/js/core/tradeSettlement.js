function freezeValue(value) {
  if (Array.isArray(value)) return Object.freeze(value.map((item) => freezeValue(item)));
  if (value && typeof value === "object") {
    return Object.freeze(Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, freezeValue(item)]),
    ));
  }
  return value;
}

function normalizeGold(value, label) {
  const gold = value == null ? 0 : Number(value);
  if (!Number.isSafeInteger(gold) || gold < 0) {
    throw new Error(`Trade ${label} gold must be a non-negative integer.`);
  }
  return gold;
}

function normalizePropertyIds(value, label) {
  if (value == null) return Object.freeze([]);
  if (!Array.isArray(value)) throw new Error(`Trade ${label} property ids must be an array.`);
  const ids = value.map((id) => {
    if (typeof id !== "string" || !id.trim()) {
      throw new Error(`Trade ${label} property ids must be non-empty strings.`);
    }
    return id;
  });
  if (new Set(ids).size !== ids.length) {
    throw new Error(`Trade ${label} property ids must be unique.`);
  }
  return Object.freeze(ids);
}

function normalizeSide(value, label) {
  if (value == null) return Object.freeze({ propertyIds: Object.freeze([]), gold: 0 });
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Trade ${label} terms must be an object.`);
  }
  return Object.freeze({
    propertyIds: normalizePropertyIds(value.propertyIds, label),
    gold: normalizeGold(value.gold, label),
  });
}

export function normalizeTradeSettlementTerms(terms) {
  if (!terms || typeof terms !== "object" || Array.isArray(terms)) {
    throw new Error("Trade settlement terms must be an object.");
  }

  const offered = normalizeSide(terms.offered, "offered");
  const requested = normalizeSide(terms.requested, "requested");
  const assetCount = offered.propertyIds.length + requested.propertyIds.length;
  if (assetCount === 0 && offered.gold === 0 && requested.gold === 0) {
    throw new Error("Trade settlement must exchange at least one asset.");
  }

  const overlap = offered.propertyIds.find((propertyId) => requested.propertyIds.includes(propertyId));
  if (overlap) throw new Error(`Trade property cannot be offered and requested at the same time: ${overlap}`);

  return Object.freeze({ offered, requested });
}

function requireParticipant(players, playerId, role) {
  const index = players.findIndex((player) => player.id === playerId);
  if (index < 0) throw new Error(`Trade ${role} is missing from players.`);
  const player = players[index];
  if (player.bankrupt === true) throw new Error(`Bankrupt trade ${role} cannot settle a trade.`);
  return { player, index };
}

function requireOwnedTradableProperty(boardState, propertyId, ownerId, label) {
  const property = boardState?.properties?.[propertyId];
  if (!property) throw new Error(`Unknown trade property: ${propertyId}`);
  if (property.ownerId !== ownerId) {
    throw new Error(`Trade ${label} does not own property: ${propertyId}`);
  }
  if (Number(property.buildingLevel ?? 0) > 0) {
    throw new Error(`Improved property cannot be traded yet: ${propertyId}`);
  }
  return property;
}

function updatePlayer(players, index, patch) {
  const next = [...players];
  next[index] = Object.freeze({ ...next[index], ...patch });
  return next;
}

export function settleAcceptedTrade({
  proposal,
  players,
  boardState,
}) {
  if (proposal?.type !== "PLAYER_TRADE") throw new Error("A player trade proposal is required.");
  if (proposal.status !== "ACCEPTED") throw new Error("Trade must be accepted before settlement.");
  if (!Array.isArray(players)) throw new Error("Trade players are required.");
  if (!boardState?.properties || typeof boardState.properties !== "object") {
    throw new Error("Trade board state is required.");
  }

  const terms = normalizeTradeSettlementTerms(proposal.terms);
  const proposer = requireParticipant(players, proposal.proposerPlayerId, "proposer");
  const recipient = requireParticipant(players, proposal.recipientPlayerId, "recipient");

  for (const propertyId of terms.offered.propertyIds) {
    requireOwnedTradableProperty(boardState, propertyId, proposer.player.id, "proposer");
  }
  for (const propertyId of terms.requested.propertyIds) {
    requireOwnedTradableProperty(boardState, propertyId, recipient.player.id, "recipient");
  }

  if (Number(proposer.player.money) < terms.offered.gold) {
    throw new Error("Trade proposer cannot afford offered gold.");
  }
  if (Number(recipient.player.money) < terms.requested.gold) {
    throw new Error("Trade recipient cannot afford requested gold.");
  }

  let nextPlayers = [...players];
  nextPlayers = updatePlayer(nextPlayers, proposer.index, {
    money: proposer.player.money - terms.offered.gold + terms.requested.gold,
  });
  nextPlayers = updatePlayer(nextPlayers, recipient.index, {
    money: recipient.player.money - terms.requested.gold + terms.offered.gold,
  });

  const properties = { ...boardState.properties };
  for (const propertyId of terms.offered.propertyIds) {
    properties[propertyId] = Object.freeze({
      ...properties[propertyId],
      ownerId: recipient.player.id,
    });
  }
  for (const propertyId of terms.requested.propertyIds) {
    properties[propertyId] = Object.freeze({
      ...properties[propertyId],
      ownerId: proposer.player.id,
    });
  }

  const events = [
    Object.freeze({
      type: "TRADE_SETTLED",
      offerId: proposal.offerId,
      proposerPlayerId: proposer.player.id,
      recipientPlayerId: recipient.player.id,
      terms,
    }),
  ];

  return Object.freeze({
    players: Object.freeze(nextPlayers),
    boardState: Object.freeze({
      ...boardState,
      properties: Object.freeze(properties),
    }),
    events: Object.freeze(events),
  });
}
