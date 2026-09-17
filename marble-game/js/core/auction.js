function freezeAuction(auction) {
  return Object.freeze({
    ...auction,
    eligiblePlayerIds: Object.freeze([...(auction.eligiblePlayerIds ?? [])]),
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

function settleAuction(auction) {
  const passed = new Set(auction.passedPlayerIds);
  const remaining = auction.eligiblePlayerIds.filter((playerId) => !passed.has(playerId));

  if (!auction.highestBidderId && remaining.length === 0) {
    return freezeAuction({ ...auction, status: "UNSOLD", winnerPlayerId: null, winningBid: 0 });
  }

  if (
    auction.highestBidderId
    && remaining.length === 1
    && remaining[0] === auction.highestBidderId
  ) {
    return freezeAuction({
      ...auction,
      status: "WON",
      winnerPlayerId: auction.highestBidderId,
      winningBid: auction.highestBid,
    });
  }

  return freezeAuction(auction);
}

export function createPropertyAuction({ nodeId, openingBid, declinedByPlayerId, players }) {
  if (typeof nodeId !== "string" || !nodeId.trim()) throw new Error("Auction property node id is required.");
  if (typeof declinedByPlayerId !== "string" || !declinedByPlayerId.trim()) {
    throw new Error("Auction declining player id is required.");
  }
  if (!Array.isArray(players) || players.length < 2) throw new Error("Auction requires at least two players.");

  const normalizedOpeningBid = normalizeOpeningBid(openingBid);
  requirePlayer(players, declinedByPlayerId);
  const eligiblePlayerIds = players
    .filter((player) => (
      player.id !== declinedByPlayerId
      && player.bankrupt !== true
      && Number(player.money) >= normalizedOpeningBid
    ))
    .map((player) => player.id);

  return settleAuction(freezeAuction({
    type: "PROPERTY_AUCTION",
    nodeId,
    openingBid: normalizedOpeningBid,
    declinedByPlayerId,
    eligiblePlayerIds,
    passedPlayerIds: [],
    highestBid: 0,
    highestBidderId: null,
    status: "OPEN",
    winnerPlayerId: null,
    winningBid: 0,
  }));
}

export function reducePropertyAuction(auction, players, action) {
  if (auction?.type !== "PROPERTY_AUCTION") throw new Error("A property auction is required.");
  if (auction.status !== "OPEN") throw new Error("Auction is already resolved.");
  if (!Array.isArray(players)) throw new Error("Auction players are required.");

  const playerId = action?.playerId;
  if (!auction.eligiblePlayerIds.includes(playerId)) throw new Error("Player is not eligible for this auction.");
  if (auction.passedPlayerIds.includes(playerId)) throw new Error("Player already passed this auction.");

  const player = requirePlayer(players, playerId);
  if (player.bankrupt) throw new Error("Bankrupt players cannot participate in an auction.");

  if (action?.pass === true) {
    if (auction.highestBidderId === playerId) throw new Error("The current highest bidder cannot pass.");
    const next = settleAuction(freezeAuction({
      ...auction,
      passedPlayerIds: [...auction.passedPlayerIds, playerId],
    }));
    const events = [{ type: "AUCTION_PASSED", playerId, nodeId: auction.nodeId }];
    if (next.status === "UNSOLD") {
      events.push({ type: "AUCTION_ENDED", nodeId: auction.nodeId, winnerPlayerId: null, amount: 0 });
    } else if (next.status === "WON") {
      events.push({ type: "AUCTION_WON", nodeId: auction.nodeId, winnerPlayerId: next.winnerPlayerId, amount: next.winningBid });
    }
    return Object.freeze({ auction: next, events: Object.freeze(events.map((event) => Object.freeze(event))) });
  }

  const amount = Number(action?.amount);
  const minimumBid = auction.highestBid > 0 ? auction.highestBid + 1 : auction.openingBid;
  if (!Number.isSafeInteger(amount) || amount < minimumBid) {
    throw new Error(`Auction bid must be at least ${minimumBid}.`);
  }
  if (amount > Number(player.money)) throw new Error("Player cannot afford this auction bid.");

  const next = settleAuction(freezeAuction({
    ...auction,
    highestBid: amount,
    highestBidderId: playerId,
  }));
  const events = [{ type: "AUCTION_BID_PLACED", playerId, nodeId: auction.nodeId, amount }];
  if (next.status === "WON") {
    events.push({ type: "AUCTION_WON", nodeId: auction.nodeId, winnerPlayerId: next.winnerPlayerId, amount: next.winningBid });
  }
  return Object.freeze({ auction: next, events: Object.freeze(events.map((event) => Object.freeze(event))) });
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
