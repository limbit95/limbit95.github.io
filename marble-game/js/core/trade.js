export const TRADE_STATUS = Object.freeze({
  OPEN: "OPEN",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
});

function freezeValue(value) {
  if (Array.isArray(value)) {
    return Object.freeze(value.map((item) => freezeValue(item)));
  }
  if (value && typeof value === "object") {
    return Object.freeze(Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, freezeValue(item)]),
    ));
  }
  return value;
}

function requireNonEmptyId(value, label) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Trade ${label} is required.`);
  }
  return value;
}

function requireActivePlayer(players, playerId, role) {
  const player = players.find((candidate) => candidate.id === playerId);
  if (!player) throw new Error(`Unknown trade ${role}: ${playerId}`);
  if (player.bankrupt === true) throw new Error(`Bankrupt players cannot be a trade ${role}.`);
  return player;
}

function normalizeTerms(terms) {
  if (!terms || typeof terms !== "object" || Array.isArray(terms)) {
    throw new Error("Trade terms must be an object.");
  }
  if (Object.keys(terms).length === 0) {
    throw new Error("Trade terms cannot be empty.");
  }
  return freezeValue(terms);
}

function freezeProposal(proposal) {
  return Object.freeze({
    ...proposal,
    terms: freezeValue(proposal.terms),
  });
}

export function createTradeProposal({
  offerId,
  proposerPlayerId,
  recipientPlayerId,
  terms,
  players,
}) {
  if (!Array.isArray(players) || players.length < 2) {
    throw new Error("Trade requires at least two players.");
  }

  const normalizedOfferId = requireNonEmptyId(offerId, "offer id");
  const normalizedProposerId = requireNonEmptyId(proposerPlayerId, "proposer player id");
  const normalizedRecipientId = requireNonEmptyId(recipientPlayerId, "recipient player id");

  if (normalizedProposerId === normalizedRecipientId) {
    throw new Error("Players cannot trade with themselves.");
  }

  requireActivePlayer(players, normalizedProposerId, "proposer");
  requireActivePlayer(players, normalizedRecipientId, "recipient");

  return freezeProposal({
    type: "PLAYER_TRADE",
    offerId: normalizedOfferId,
    proposerPlayerId: normalizedProposerId,
    recipientPlayerId: normalizedRecipientId,
    terms: normalizeTerms(terms),
    status: TRADE_STATUS.OPEN,
    resolvedByPlayerId: null,
  });
}

export function reduceTradeProposal(proposal, players, {
  playerId,
  accept = false,
  reject = false,
  cancel = false,
} = {}) {
  if (proposal?.type !== "PLAYER_TRADE") {
    throw new Error("A player trade proposal is required.");
  }
  if (proposal.status !== TRADE_STATUS.OPEN) {
    throw new Error("Trade proposal is already resolved.");
  }
  if (!Array.isArray(players)) {
    throw new Error("Trade players are required.");
  }
  const decisionCount = [accept, reject, cancel].filter(Boolean).length;
  if (decisionCount !== 1) {
    throw new Error("Trade response must accept, reject, or cancel exactly once.");
  }

  if (cancel) {
    if (playerId !== proposal.proposerPlayerId) {
      throw new Error("Only the trade proposer can cancel this proposal.");
    }
    requireActivePlayer(players, proposal.proposerPlayerId, "proposer");
    return Object.freeze({
      proposal: freezeProposal({
        ...proposal,
        status: TRADE_STATUS.CANCELLED,
        resolvedByPlayerId: playerId,
      }),
      events: Object.freeze([Object.freeze({
        type: "TRADE_CANCELLED",
        offerId: proposal.offerId,
        proposerPlayerId: proposal.proposerPlayerId,
        recipientPlayerId: proposal.recipientPlayerId,
      })]),
    });
  }

  if (playerId !== proposal.recipientPlayerId) {
    throw new Error("Only the trade recipient can accept or reject this proposal.");
  }

  requireActivePlayer(players, proposal.proposerPlayerId, "proposer");
  requireActivePlayer(players, proposal.recipientPlayerId, "recipient");

  const status = accept ? TRADE_STATUS.ACCEPTED : TRADE_STATUS.REJECTED;
  const event = Object.freeze({
    type: accept ? "TRADE_ACCEPTED" : "TRADE_REJECTED",
    offerId: proposal.offerId,
    proposerPlayerId: proposal.proposerPlayerId,
    recipientPlayerId: proposal.recipientPlayerId,
  });

  return Object.freeze({
    proposal: freezeProposal({
      ...proposal,
      status,
      resolvedByPlayerId: playerId,
    }),
    events: Object.freeze([event]),
  });
}
