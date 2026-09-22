function freezeAuction(auction) {
  return Object.freeze({
    ...auction,
    eligiblePlayerIds: Object.freeze([...(auction.eligiblePlayerIds ?? [])]),
    participantPlayerIds: Object.freeze([...(auction.participantPlayerIds ?? [])]),
    requestedByPlayerIds: Object.freeze([...(auction.requestedByPlayerIds ?? [])]),
    bidPlayerIds: Object.freeze([...(auction.bidPlayerIds ?? [])]),
    passedPlayerIds: Object.freeze([...(auction.passedPlayerIds ?? [])]),
  });
}

function normalizeOpeningBid(value) {
  const openingBid = Number(value);
  if (!Number.isSafeInteger(openingBid) || openingBid <= 0) {
    throw new Error("Auction opening bid must be a positive integer.");
  }
  return openingBid;
}

function requirePlayer(players, playerId) {
  const player = players.find((candidate) => candidate.id === playerId);
  if (!player) throw new Error(`Unknown auction player: ${playerId}`);
  return player;
}

export const AUCTION_TIMING = Object.freeze({
  voteMs: 15_000,
  startAnnouncementMs: 2_000,
  starterSelectionMs: 3_200,
  starterResultHoldMs: 1_000,
  bidTurnMs: 15_000,
});

export function calculateAuctionOpeningBid(basePrice) {
  const price = Number(basePrice);
  if (!Number.isSafeInteger(price) || price <= 0) {
    throw new Error("Auction base price must be a positive integer.");
  }
  return Math.round(price * 1.5);
}

export function getEligibleAuctionPlayerIds({
  declinedByPlayerId,
  openingBid,
  players,
}) {
  const normalizedOpeningBid = normalizeOpeningBid(openingBid);
  if (!Array.isArray(players) || players.length < 2) {
    throw new Error("Auction requires at least two players.");
  }
  requirePlayer(players, declinedByPlayerId);
  return Object.freeze(players
    .filter((player) => (
      player.id !== declinedByPlayerId
      && player.bankrupt !== true
      && Number(player.money) >= normalizedOpeningBid
    ))
    .map((player) => player.id));
}

export function getPropertyAuctionMinimumBid(auction) {
  if (auction?.type !== "PROPERTY_AUCTION") throw new Error("A property auction is required.");
  return auction.highestBid > 0 ? auction.highestBid + 1 : auction.openingBid;
}

export function getAuctionSurgeThreshold(previousAmount) {
  const amount = Number(previousAmount);
  if (!Number.isSafeInteger(amount) || amount < 0) {
    throw new Error("Previous auction amount must be a non-negative integer.");
  }
  return Math.max(100, Math.ceil(amount * 0.3));
}

export function isAuctionSurgeBid(previousAmount, amount) {
  const previous = Number(previousAmount);
  const next = Number(amount);
  if (!Number.isSafeInteger(next) || next <= previous) return false;
  return next - previous >= getAuctionSurgeThreshold(previous);
}

function getActiveIds(auction) {
  const passed = new Set(auction.passedPlayerIds);
  return auction.participantPlayerIds.filter((playerId) => !passed.has(playerId));
}

function settleAuction(auction) {
  const activeIds = getActiveIds(auction);
  if (!auction.highestBidderId && activeIds.length === 0) {
    return freezeAuction({
      ...auction,
      status: "UNSOLD",
      winnerPlayerId: null,
      winningBid: 0,
      turnPlayerId: null,
      turnDeadlineAt: null,
    });
  }
  if (!auction.highestBidderId && activeIds.length === 1) {
    return freezeAuction({
      ...auction,
      highestBid: auction.openingBid,
      highestBidderId: activeIds[0],
      status: "WON",
      winnerPlayerId: activeIds[0],
      winningBid: auction.openingBid,
      turnPlayerId: null,
      turnDeadlineAt: null,
    });
  }
  if (
    auction.highestBidderId
    && activeIds.length === 1
    && activeIds[0] === auction.highestBidderId
  ) {
    return freezeAuction({
      ...auction,
      status: "WON",
      winnerPlayerId: auction.highestBidderId,
      winningBid: auction.highestBid,
      turnPlayerId: null,
      turnDeadlineAt: null,
    });
  }
  return freezeAuction(auction);
}

function autoPassUnaffordable(auction, players) {
  const minimumBid = getPropertyAuctionMinimumBid(auction);
  const passed = new Set(auction.passedPlayerIds);
  const autoPassedPlayerIds = [];
  for (const playerId of auction.participantPlayerIds) {
    if (playerId === auction.highestBidderId || passed.has(playerId)) continue;
    const player = requirePlayer(players, playerId);
    if (player.bankrupt || Number(player.money) < minimumBid) {
      passed.add(playerId);
      autoPassedPlayerIds.push(playerId);
    }
  }
  return {
    auction: freezeAuction({ ...auction, passedPlayerIds: [...passed] }),
    autoPassedPlayerIds: Object.freeze(autoPassedPlayerIds),
  };
}

function nextTurnPlayerId(auction, afterPlayerId) {
  const participants = auction.participantPlayerIds;
  if (!participants.length) return null;
  const passed = new Set(auction.passedPlayerIds);
  const startIndex = Math.max(0, participants.indexOf(afterPlayerId));
  for (let offset = 1; offset <= participants.length; offset += 1) {
    const candidate = participants[(startIndex + offset) % participants.length];
    if (passed.has(candidate) || candidate === auction.highestBidderId) continue;
    return candidate;
  }
  return null;
}

function prepareNextTurn(auction, players, afterPlayerId) {
  const affordability = autoPassUnaffordable(auction, players);
  let next = settleAuction(affordability.auction);
  if (next.status !== "OPEN") {
    return { auction: next, autoPassedPlayerIds: affordability.autoPassedPlayerIds };
  }
  const turnPlayerId = nextTurnPlayerId(next, afterPlayerId);
  if (!turnPlayerId) {
    next = settleAuction(next);
    return { auction: next, autoPassedPlayerIds: affordability.autoPassedPlayerIds };
  }
  return {
    auction: freezeAuction({ ...next, turnPlayerId }),
    autoPassedPlayerIds: affordability.autoPassedPlayerIds,
  };
}

export function createPropertyAuction({
  nodeId,
  openingBid,
  declinedByPlayerId,
  startingPlayerId = null,
  participantPlayerIds,
  players,
  turnDeadlineAt = null,
}) {
  if (typeof nodeId !== "string" || !nodeId.trim()) throw new Error("Auction property node id is required.");
  if (typeof declinedByPlayerId !== "string" || !declinedByPlayerId.trim()) {
    throw new Error("Auction declining player id is required.");
  }
  const normalizedOpeningBid = normalizeOpeningBid(openingBid);
  const eligiblePlayerIds = getEligibleAuctionPlayerIds({
    declinedByPlayerId,
    openingBid: normalizedOpeningBid,
    players,
  });
  if (!Array.isArray(participantPlayerIds) || participantPlayerIds.length === 0) {
    throw new Error("Auction participants are required.");
  }
  const uniqueParticipants = [...new Set(participantPlayerIds)];
  if (uniqueParticipants.length !== participantPlayerIds.length) {
    throw new Error("Auction participant ids must be unique.");
  }
  if (uniqueParticipants.some((playerId) => !eligiblePlayerIds.includes(playerId))) {
    throw new Error("Auction participants must be eligible.");
  }

  const starter = startingPlayerId ?? uniqueParticipants[0];
  if (!uniqueParticipants.includes(starter)) {
    throw new Error("Auction starting player must be a participant.");
  }

  if (uniqueParticipants.length === 1) {
    return freezeAuction({
      type: "PROPERTY_AUCTION",
      nodeId,
      openingBid: normalizedOpeningBid,
      declinedByPlayerId,
      eligiblePlayerIds,
      participantPlayerIds: uniqueParticipants,
      startingPlayerId: starter,
      requestedByPlayerIds: [],
      bidPlayerIds: [],
      passedPlayerIds: [],
      highestBid: normalizedOpeningBid,
      highestBidderId: starter,
      turnPlayerId: null,
      turnDeadlineAt: null,
      status: "WON",
      winnerPlayerId: starter,
      winningBid: normalizedOpeningBid,
    });
  }

  return freezeAuction({
    type: "PROPERTY_AUCTION",
    nodeId,
    openingBid: normalizedOpeningBid,
    declinedByPlayerId,
    eligiblePlayerIds,
    participantPlayerIds: uniqueParticipants,
    startingPlayerId: starter,
    requestedByPlayerIds: [],
    bidPlayerIds: [],
    passedPlayerIds: [],
    highestBid: 0,
    highestBidderId: null,
    turnPlayerId: starter,
    turnDeadlineAt,
    status: "OPEN",
    winnerPlayerId: null,
    winningBid: 0,
  });
}

export function reducePropertyAuction(auction, players, action) {
  if (auction?.type !== "PROPERTY_AUCTION") throw new Error("A property auction is required.");
  if (auction.status !== "OPEN") throw new Error("Auction is already resolved.");
  if (!Array.isArray(players)) throw new Error("Auction players are required.");

  const playerId = action?.playerId;
  if (playerId !== auction.turnPlayerId) {
    throw new Error("It is not this player's auction turn.");
  }
  if (!auction.participantPlayerIds.includes(playerId)) {
    throw new Error("Player is not participating in this auction.");
  }
  if (auction.passedPlayerIds.includes(playerId)) throw new Error("Player already passed this auction.");

  const player = requirePlayer(players, playerId);
  if (player.bankrupt) throw new Error("Bankrupt players cannot participate in an auction.");

  const events = [];
  let nextAuction = auction;

  if (action?.pass === true) {
    nextAuction = freezeAuction({
      ...auction,
      passedPlayerIds: [...auction.passedPlayerIds, playerId],
      turnPlayerId: null,
      turnDeadlineAt: null,
    });
    events.push({
      type: action?.timeout === true ? "AUCTION_AUTO_PASSED" : "AUCTION_PASSED",
      playerId,
      nodeId: auction.nodeId,
      reason: action?.timeout === true ? "TIMEOUT" : "VOLUNTARY",
    });
  } else {
    const amount = Number(action?.amount);
    const previousAmount = Number(auction.highestBid) || 0;
    const minimumBid = getPropertyAuctionMinimumBid(auction);
    if (!Number.isSafeInteger(amount) || amount < minimumBid) {
      throw new Error(`Auction bid must be at least ${minimumBid}.`);
    }
    if (amount > Number(player.money)) throw new Error("Player cannot afford this auction bid.");
    const increase = amount - previousAmount;
    nextAuction = freezeAuction({
      ...auction,
      bidPlayerIds: auction.bidPlayerIds.includes(playerId)
        ? auction.bidPlayerIds
        : [...auction.bidPlayerIds, playerId],
      highestBid: amount,
      highestBidderId: playerId,
      turnPlayerId: null,
      turnDeadlineAt: null,
    });
    events.push({
      type: "AUCTION_BID_PLACED",
      playerId,
      nodeId: auction.nodeId,
      amount,
      previousAmount,
      increase,
      surge: isAuctionSurgeBid(previousAmount, amount),
    });
  }

  const prepared = prepareNextTurn(nextAuction, players, playerId);
  nextAuction = prepared.auction;
  for (const autoPassedPlayerId of prepared.autoPassedPlayerIds) {
    events.push({
      type: "AUCTION_AUTO_PASSED",
      playerId: autoPassedPlayerId,
      nodeId: auction.nodeId,
      reason: "INSUFFICIENT_GOLD",
    });
  }

  if (
    nextAuction.status === "WON"
    && action?.pass !== true
    && prepared.autoPassedPlayerIds.length > 0
  ) {
    const bidEvent = events.find((event) => event.type === "AUCTION_BID_PLACED");
    events.push({
      type: "AUCTION_DECISIVE_BID",
      playerId,
      nodeId: auction.nodeId,
      amount: nextAuction.winningBid,
      previousAmount: bidEvent?.previousAmount ?? auction.highestBid,
      increase: bidEvent?.increase ?? nextAuction.winningBid - auction.highestBid,
      eliminatedPlayerIds: [...prepared.autoPassedPlayerIds],
    });
  }

  if (nextAuction.status === "WON") {
    events.push({
      type: "AUCTION_WON",
      nodeId: auction.nodeId,
      winnerPlayerId: nextAuction.winnerPlayerId,
      amount: nextAuction.winningBid,
    });
  }

  return Object.freeze({
    auction: nextAuction,
    events: Object.freeze(events.map((event) => Object.freeze(event))),
  });
}

export function getPropertyAuctionSettlement(auction) {
  if (auction?.type !== "PROPERTY_AUCTION") throw new Error("A property auction is required.");
  if (auction.status === "OPEN") return null;
  if (auction.status === "UNSOLD") {
    return Object.freeze({ nodeId: auction.nodeId, winnerPlayerId: null, amount: 0 });
  }
  return Object.freeze({
    nodeId: auction.nodeId,
    winnerPlayerId: auction.winnerPlayerId,
    amount: auction.winningBid,
  });
}
