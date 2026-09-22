import { ACTION_TYPES } from "./actions.js";
import {
  AUCTION_TIMING,
  calculateAuctionOpeningBid,
  createPropertyAuction,
  getEligibleAuctionPlayerIds,
  getPropertyAuctionSettlement,
  reducePropertyAuction,
} from "./auction.js";
import { GAME_STATUS, reduceGameAction } from "./gameEngine.js";
import { TURN_PHASES, transitionPhase } from "./turnMachine.js";

function freezeEvents(events) {
  return Object.freeze(events.map((event) => Object.freeze({ ...event })));
}

function withVersion(state, patch, action) {
  return Object.freeze({
    ...state,
    ...patch,
    version: state.version + 1,
    lastAction: Object.freeze({ type: action.type, playerId: action.playerId ?? null }),
  });
}

function nowMs(options = {}) {
  const value = Number(options.nowMs ?? Date.now());
  if (!Number.isFinite(value)) throw new Error("Auction clock is invalid.");
  return value;
}

function deadlineAt(options, durationMs) {
  return Math.round(nowMs(options) + durationMs);
}

function deadlineExpired(deadline, options) {
  return Number(deadline) <= nowMs(options);
}

function getBoardNode(board, nodeId) {
  return board.nodes.find((node) => node.id === nodeId) ?? null;
}

function updatePlayer(players, index, patch) {
  const next = [...players];
  next[index] = Object.freeze({ ...next[index], ...patch });
  return next;
}

function updateProperty(boardState, nodeId, patch) {
  return {
    ...boardState,
    properties: {
      ...boardState.properties,
      [nodeId]: Object.freeze({ ...boardState.properties[nodeId], ...patch }),
    },
  };
}

function requirePurchaseDecline(state, action) {
  if (state.status !== GAME_STATUS.PLAYING || state.phase !== TURN_PHASES.WAITING_CHOICE) {
    throw new Error(`END_TURN is not allowed during ${state.phase}.`);
  }
  if (state.pendingChoice?.type !== "BUY_PROPERTY") {
    throw new Error("There is no property purchase to decline.");
  }
  const current = state.players[state.currentPlayerIndex];
  if (!current || current.bankrupt) throw new Error("Current player is not active.");
  if (action.playerId !== current.id) throw new Error("END_TURN must be performed by the current player.");
  return current;
}

function openAuctionVote(state, action, options) {
  const current = requirePurchaseDecline(state, action);
  const node = getBoardNode(state.board, state.pendingChoice.nodeId);
  if (!node || node.type !== "PROPERTY") throw new Error("Auction property is missing.");
  if (state.boardState.properties[node.id]?.ownerId) throw new Error("Property is already owned.");

  const basePrice = Number(state.pendingChoice.price);
  const openingBid = calculateAuctionOpeningBid(basePrice);
  const eligiblePlayerIds = getEligibleAuctionPlayerIds({
    declinedByPlayerId: current.id,
    openingBid,
    players: state.players,
  });
  const declinedEvent = {
    type: "CHOICE_DECLINED",
    playerId: current.id,
    choiceType: "BUY_PROPERTY",
  };

  if (eligiblePlayerIds.length === 0) {
    const phase = transitionPhase(state.phase, TURN_PHASES.TURN_END);
    return withVersion(state, {
      phase,
      pendingChoice: null,
      lastEvents: freezeEvents([
        declinedEvent,
        {
          type: "AUCTION_VOTE_CLOSED",
          nodeId: node.id,
          participantPlayerIds: [],
          passedPlayerIds: [],
          reason: "NO_ELIGIBLE_PLAYERS",
        },
      ]),
    }, action);
  }

  const deadline = deadlineAt(options, AUCTION_TIMING.voteMs);
  return withVersion(state, {
    pendingChoice: Object.freeze({
      type: "AUCTION_VOTE",
      nodeId: node.id,
      basePrice,
      openingBid,
      declinedByPlayerId: current.id,
      eligiblePlayerIds: Object.freeze([...eligiblePlayerIds]),
      participantPlayerIds: Object.freeze([]),
      passedPlayerIds: Object.freeze([]),
      openedVersion: state.version + 1,
      deadlineAt: deadline,
    }),
    lastEvents: freezeEvents([
      declinedEvent,
      {
        type: "AUCTION_VOTE_OPENED",
        nodeId: node.id,
        openingBid,
        declinedByPlayerId: current.id,
        eligiblePlayerIds,
        deadlineAt: deadline,
      },
    ]),
  }, action);
}

function requireAuctionVote(state) {
  if (state.status !== GAME_STATUS.PLAYING || state.phase !== TURN_PHASES.WAITING_CHOICE) {
    throw new Error(`Auction vote is not allowed during ${state.phase}.`);
  }
  if (state.pendingChoice?.type !== "AUCTION_VOTE") {
    throw new Error("There is no auction vote to resolve.");
  }
  return state.pendingChoice;
}

function requireVoteEligibility(state, vote, playerId) {
  if (!vote.eligiblePlayerIds.includes(playerId)) {
    throw new Error("Player is not eligible for this auction.");
  }
  const player = state.players.find((candidate) => candidate.id === playerId);
  if (!player || player.bankrupt || Number(player.money) < vote.openingBid) {
    throw new Error("Player cannot afford the auction opening bid.");
  }
  return player;
}

function hasVoted(vote, playerId) {
  return vote.participantPlayerIds.includes(playerId)
    || vote.passedPlayerIds.includes(playerId);
}

function isVoteComplete(vote) {
  return vote.participantPlayerIds.length + vote.passedPlayerIds.length
    >= vote.eligiblePlayerIds.length;
}

function shuffleAuctionParticipants(playerIds, random) {
  if (typeof random !== "function") return [...playerIds];
  const shuffled = [...playerIds];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const next = Math.max(0, Math.min(index, Math.floor(Number(random()) * (index + 1))));
    [shuffled[index], shuffled[next]] = [shuffled[next], shuffled[index]];
  }
  return shuffled;
}

function settleAuctionWinner(state, action, auction, extraEvents = []) {
  const settlement = getPropertyAuctionSettlement(auction);
  if (!settlement?.winnerPlayerId) throw new Error("Auction winner is missing.");
  let phase = transitionPhase(state.phase, TURN_PHASES.RESOLVING_ACTION);
  let players = [...state.players];
  let boardState = state.boardState;
  const winnerIndex = players.findIndex((player) => player.id === settlement.winnerPlayerId);
  if (winnerIndex < 0) throw new Error("Auction winner is missing.");
  if (players[winnerIndex].money < settlement.amount) throw new Error("Auction winner cannot afford settlement.");
  if (boardState.properties[settlement.nodeId]?.ownerId) throw new Error("Auction property is already owned.");

  players = updatePlayer(players, winnerIndex, {
    money: players[winnerIndex].money - settlement.amount,
  });
  boardState = updateProperty(boardState, settlement.nodeId, {
    ownerId: settlement.winnerPlayerId,
    buildingLevel: 0,
  });
  phase = transitionPhase(phase, TURN_PHASES.TURN_END);
  return withVersion(state, {
    phase,
    players: Object.freeze(players),
    boardState: Object.freeze({ properties: Object.freeze(boardState.properties) }),
    pendingChoice: null,
    lastEvents: freezeEvents([
      ...extraEvents,
      {
        type: "AUCTION_WON",
        nodeId: settlement.nodeId,
        winnerPlayerId: settlement.winnerPlayerId,
        amount: settlement.amount,
      },
      {
        type: "PROPERTY_BOUGHT",
        playerId: settlement.winnerPlayerId,
        nodeId: settlement.nodeId,
        amount: settlement.amount,
        reason: "AUCTION",
      },
    ]),
  }, action);
}

function resolveAuctionVote(state, action, options, {
  reason,
  extraEvents = [],
  timeout = false,
} = {}) {
  const vote = requireAuctionVote(state);
  const participantPlayerIds = [...vote.participantPlayerIds];
  const passedPlayerIds = [...vote.passedPlayerIds];
  const passed = new Set(passedPlayerIds);
  const participants = new Set(participantPlayerIds);
  const events = [...extraEvents];

  if (timeout) {
    for (const playerId of vote.eligiblePlayerIds) {
      if (participants.has(playerId) || passed.has(playerId)) continue;
      passed.add(playerId);
      passedPlayerIds.push(playerId);
      events.push({
        type: "AUCTION_VOTE_AUTO_PASSED",
        playerId,
        nodeId: vote.nodeId,
        reason: "TIMEOUT",
      });
    }
  }

  events.push({
    type: "AUCTION_VOTE_CLOSED",
    nodeId: vote.nodeId,
    participantPlayerIds,
    passedPlayerIds,
    reason,
  });

  if (participantPlayerIds.length === 0) {
    const phase = transitionPhase(state.phase, TURN_PHASES.TURN_END);
    return withVersion(state, {
      phase,
      pendingChoice: null,
      lastEvents: freezeEvents(events),
    }, action);
  }

  const randomizedPlayerIds = participantPlayerIds.length > 1
    ? shuffleAuctionParticipants(participantPlayerIds, options.random)
    : participantPlayerIds;
  const startingPlayerId = randomizedPlayerIds[0];
  const announcementEndsAt = participantPlayerIds.length > 1
    ? deadlineAt(options, AUCTION_TIMING.startAnnouncementMs)
    : null;
  const selectionStopsAt = participantPlayerIds.length > 1
    ? deadlineAt(
      options,
      AUCTION_TIMING.startAnnouncementMs + AUCTION_TIMING.starterSelectionMs,
    )
    : null;
  const startsAt = participantPlayerIds.length > 1
    ? deadlineAt(
      options,
      AUCTION_TIMING.startAnnouncementMs
        + AUCTION_TIMING.starterSelectionMs
        + AUCTION_TIMING.starterResultHoldMs,
    )
    : null;
  const auction = createPropertyAuction({
    nodeId: vote.nodeId,
    openingBid: vote.openingBid,
    declinedByPlayerId: vote.declinedByPlayerId,
    startingPlayerId,
    participantPlayerIds: randomizedPlayerIds,
    players: state.players,
    turnDeadlineAt: participantPlayerIds.length > 1
      ? Number(startsAt) + AUCTION_TIMING.bidTurnMs
      : null,
  });
  const timedAuction = participantPlayerIds.length > 1
    ? Object.freeze({
      ...auction,
      announcementEndsAt,
      selectionStopsAt,
      startsAt,
    })
    : auction;

  if (participantPlayerIds.length === 1 || timedAuction.status === "WON") {
    return settleAuctionWinner(state, action, timedAuction, [
      ...events,
      {
        type: "AUCTION_AUTO_PURCHASED",
        nodeId: vote.nodeId,
        playerId: startingPlayerId,
        amount: vote.openingBid,
      },
    ]);
  }

  return withVersion(state, {
    pendingChoice: Object.freeze({
      type: "PROPERTY_AUCTION",
      nodeId: vote.nodeId,
      openingBid: vote.openingBid,
      startingPlayerId,
      participantPlayerIds: Object.freeze(randomizedPlayerIds),
      announcementEndsAt,
      selectionStopsAt,
      startsAt,
      auction: timedAuction,
    }),
    lastEvents: freezeEvents([
      ...events,
      {
        type: "AUCTION_STARTING",
        nodeId: vote.nodeId,
        openingBid: vote.openingBid,
        startingPlayerId,
        participantPlayerIds: randomizedPlayerIds,
        announcementEndsAt,
        selectionStopsAt,
        startsAt,
      },
    ]),
  }, action);
}

function voteToJoin(state, action, options) {
  const vote = requireAuctionVote(state);
  if (deadlineExpired(vote.deadlineAt, options)) throw new Error("Auction vote is already closed.");
  requireVoteEligibility(state, vote, action.playerId);
  if (hasVoted(vote, action.playerId)) {
    throw new Error("Auction vote is already final for this player.");
  }

  const nextVote = Object.freeze({
    ...vote,
    participantPlayerIds: Object.freeze([
      ...vote.participantPlayerIds,
      action.playerId,
    ]),
  });
  const event = {
    type: "AUCTION_VOTE_JOINED",
    playerId: action.playerId,
    nodeId: vote.nodeId,
    order: nextVote.participantPlayerIds.length,
  };

  if (isVoteComplete(nextVote)) {
    return resolveAuctionVote(
      { ...state, pendingChoice: nextVote },
      action,
      options,
      { reason: "ALL_RESPONDED", extraEvents: [event] },
    );
  }

  return withVersion(state, {
    pendingChoice: nextVote,
    lastEvents: freezeEvents([event]),
  }, action);
}

function voteToPass(state, action, options) {
  const vote = requireAuctionVote(state);
  if (deadlineExpired(vote.deadlineAt, options)) throw new Error("Auction vote is already closed.");
  requireVoteEligibility(state, vote, action.playerId);
  if (hasVoted(vote, action.playerId)) {
    throw new Error("Auction vote is already final for this player.");
  }

  const nextVote = Object.freeze({
    ...vote,
    passedPlayerIds: Object.freeze([
      ...vote.passedPlayerIds,
      action.playerId,
    ]),
  });
  const event = {
    type: "AUCTION_VOTE_PASSED",
    playerId: action.playerId,
    nodeId: vote.nodeId,
    reason: "VOLUNTARY",
  };

  if (isVoteComplete(nextVote)) {
    return resolveAuctionVote(
      { ...state, pendingChoice: nextVote },
      action,
      options,
      { reason: "ALL_RESPONDED", extraEvents: [event] },
    );
  }

  return withVersion(state, {
    pendingChoice: nextVote,
    lastEvents: freezeEvents([event]),
  }, action);
}

function closeAuctionVote(state, action, options) {
  const vote = requireAuctionVote(state);
  if (action.playerId !== null && action.playerId !== undefined) {
    throw new Error("AUCTION_VOTE_CLOSE must be performed by the game authority.");
  }
  if (!deadlineExpired(vote.deadlineAt, options)) {
    throw new Error("Auction vote deadline has not expired.");
  }
  return resolveAuctionVote(state, action, options, {
    reason: "DEADLINE",
    timeout: true,
  });
}

function resolvePropertyAuction(state, action, options, { timeout = false } = {}) {
  if (state.status !== GAME_STATUS.PLAYING || state.phase !== TURN_PHASES.WAITING_CHOICE) {
    throw new Error(`AUCTION_BID is not allowed during ${state.phase}.`);
  }
  if (state.pendingChoice?.type !== "PROPERTY_AUCTION") {
    throw new Error("There is no property auction to resolve.");
  }

  const auction = state.pendingChoice.auction;
  const startsAt = Number(auction.startsAt ?? state.pendingChoice.startsAt);
  if (Number.isFinite(startsAt) && Number(options.nowMs) < startsAt) {
    throw new Error("Auction has not started yet.");
  }
  if (timeout) {
    if (action.playerId !== null && action.playerId !== undefined) {
      throw new Error("AUCTION_BID_TIMEOUT must be performed by the game authority.");
    }
    if (!deadlineExpired(auction.turnDeadlineAt, options)) {
      throw new Error("Auction bid deadline has not expired.");
    }
  } else if (deadlineExpired(auction.turnDeadlineAt, options)) {
    throw new Error("Auction bid deadline has expired.");
  }

  const playerId = timeout ? auction.turnPlayerId : action.playerId;
  const result = reducePropertyAuction(auction, state.players, {
    playerId,
    amount: action.payload?.amount,
    pass: timeout || action.payload?.pass === true,
    timeout,
  });

  if (result.auction.status === "OPEN") {
    const nextAuction = Object.freeze({
      ...result.auction,
      turnDeadlineAt: deadlineAt(options, AUCTION_TIMING.bidTurnMs),
    });
    return withVersion(state, {
      pendingChoice: Object.freeze({
        ...state.pendingChoice,
        auction: nextAuction,
      }),
      lastEvents: freezeEvents(result.events),
    }, action);
  }

  return settleAuctionWinner(
    state,
    action,
    result.auction,
    result.events.filter((event) => event.type !== "AUCTION_WON"),
  );
}

export function reducePhase7GameAction(state, action, options = {}) {
  if (
    action?.type === ACTION_TYPES.END_TURN
    && state?.phase === TURN_PHASES.WAITING_CHOICE
    && state?.pendingChoice?.type === "BUY_PROPERTY"
  ) {
    return openAuctionVote(state, action, options);
  }

  if (action?.type === ACTION_TYPES.AUCTION_JOIN) {
    return voteToJoin(state, action, options);
  }

  if (action?.type === ACTION_TYPES.AUCTION_PASS) {
    return voteToPass(state, action, options);
  }

  if (action?.type === ACTION_TYPES.AUCTION_VOTE_CLOSE) {
    return closeAuctionVote(state, action, options);
  }

  if (action?.type === ACTION_TYPES.AUCTION_BID) {
    return resolvePropertyAuction(state, action, options);
  }

  if (action?.type === ACTION_TYPES.AUCTION_BID_TIMEOUT) {
    return resolvePropertyAuction(state, action, options, { timeout: true });
  }

  return reduceGameAction(state, action, options);
}
