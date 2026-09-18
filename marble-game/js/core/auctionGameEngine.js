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

function openPropertyAuctionRequest(state, action, options) {
  const current = requirePurchaseDecline(state, action);
  const node = getBoardNode(state.board, state.pendingChoice.nodeId);
  if (!node || node.type !== "PROPERTY") throw new Error("Auction property is missing.");
  if (state.boardState.properties[node.id]?.ownerId) throw new Error("Property is already owned.");

  const openingBid = calculateAuctionOpeningBid(state.pendingChoice.price);
  const eligiblePlayerIds = getEligibleAuctionPlayerIds({
    declinedByPlayerId: current.id,
    openingBid,
    players: state.players,
  });
  const declinedEvent = { type: "CHOICE_DECLINED", playerId: current.id, choiceType: "BUY_PROPERTY" };

  if (eligiblePlayerIds.length === 0) {
    const phase = transitionPhase(state.phase, TURN_PHASES.TURN_END);
    return withVersion(state, {
      phase,
      pendingChoice: null,
      lastEvents: freezeEvents([
        declinedEvent,
        {
          type: "AUCTION_REQUEST_CLOSED",
          nodeId: node.id,
          requestedByPlayerIds: [],
          reason: "NO_ELIGIBLE_PLAYERS",
        },
      ]),
    }, action);
  }

  const requestDeadlineAt = deadlineAt(options, AUCTION_TIMING.requestMs);
  return withVersion(state, {
    pendingChoice: Object.freeze({
      type: "AUCTION_REQUEST",
      nodeId: node.id,
      basePrice: Number(state.pendingChoice.price),
      openingBid,
      declinedByPlayerId: current.id,
      eligiblePlayerIds,
      requestedByPlayerIds: Object.freeze([]),
      deadlineAt: requestDeadlineAt,
    }),
    lastEvents: freezeEvents([
      declinedEvent,
      {
        type: "AUCTION_REQUEST_OPENED",
        nodeId: node.id,
        openingBid,
        declinedByPlayerId: current.id,
        eligiblePlayerIds,
        deadlineAt: requestDeadlineAt,
      },
    ]),
  }, action);
}

function requireAuctionRequestWindow(state) {
  if (state.status !== GAME_STATUS.PLAYING || state.phase !== TURN_PHASES.WAITING_CHOICE) {
    throw new Error(`Auction request is not allowed during ${state.phase}.`);
  }
  if (state.pendingChoice?.type !== "AUCTION_REQUEST") {
    throw new Error("There is no auction request window to resolve.");
  }
  return state.pendingChoice;
}

function requireAuctionRecruitment(state) {
  if (state.status !== GAME_STATUS.PLAYING || state.phase !== TURN_PHASES.WAITING_CHOICE) {
    throw new Error(`Auction recruitment is not allowed during ${state.phase}.`);
  }
  if (state.pendingChoice?.type !== "AUCTION_RECRUITMENT") {
    throw new Error("There is no auction recruitment to resolve.");
  }
  return state.pendingChoice;
}

function requireRecruitmentEligibility(state, recruitment, playerId) {
  if (!recruitment.eligiblePlayerIds.includes(playerId)) {
    throw new Error("Player is not eligible for this auction.");
  }
  const player = state.players.find((candidate) => candidate.id === playerId);
  if (!player || player.bankrupt || Number(player.money) < recruitment.openingBid) {
    throw new Error("Player cannot afford the auction opening bid.");
  }
  return player;
}

function joinRecruitment(state, action, options, { fromRequest = false } = {}) {
  const recruitment = requireAuctionRecruitment(state);
  if (deadlineExpired(recruitment.deadlineAt, options)) throw new Error("Auction recruitment is already closed.");
  requireRecruitmentEligibility(state, recruitment, action.playerId);
  if (recruitment.participantPlayerIds.includes(action.playerId)) {
    throw new Error("Player already joined this auction.");
  }
  const participantPlayerIds = Object.freeze([
    ...recruitment.participantPlayerIds,
    action.playerId,
  ]);
  return withVersion(state, {
    pendingChoice: Object.freeze({
      ...recruitment,
      participantPlayerIds,
    }),
    lastEvents: freezeEvents([{
      type: "AUCTION_PARTICIPANT_JOINED",
      playerId: action.playerId,
      nodeId: recruitment.nodeId,
      source: fromRequest ? "CONCURRENT_REQUEST" : "JOIN",
    }]),
  }, action);
}

function requestPropertyAuction(state, action, options) {
  if (state.pendingChoice?.type === "AUCTION_RECRUITMENT") {
    return joinRecruitment(state, action, options, { fromRequest: true });
  }

  const request = requireAuctionRequestWindow(state);
  if (deadlineExpired(request.deadlineAt, options)) throw new Error("Auction request window is already closed.");
  if (!request.eligiblePlayerIds.includes(action.playerId)) {
    throw new Error("Player is not eligible to request this auction.");
  }
  const requester = state.players.find((player) => player.id === action.playerId);
  if (!requester || requester.bankrupt || Number(requester.money) < request.openingBid) {
    throw new Error("Player cannot afford the auction opening bid.");
  }
  const recruitmentDeadlineAt = deadlineAt(options, AUCTION_TIMING.recruitmentMs);
  return withVersion(state, {
    pendingChoice: Object.freeze({
      type: "AUCTION_RECRUITMENT",
      nodeId: request.nodeId,
      basePrice: request.basePrice,
      openingBid: request.openingBid,
      declinedByPlayerId: request.declinedByPlayerId,
      eligiblePlayerIds: Object.freeze([...request.eligiblePlayerIds]),
      requesterPlayerId: action.playerId,
      requestedByPlayerIds: Object.freeze([action.playerId]),
      participantPlayerIds: Object.freeze([action.playerId]),
      deadlineAt: recruitmentDeadlineAt,
    }),
    lastEvents: freezeEvents([
      { type: "AUCTION_REQUESTED", playerId: action.playerId, nodeId: request.nodeId },
      {
        type: "AUCTION_RECRUITMENT_OPENED",
        nodeId: request.nodeId,
        requesterPlayerId: action.playerId,
        openingBid: request.openingBid,
        deadlineAt: recruitmentDeadlineAt,
      },
    ]),
  }, action);
}

function withdrawRecruitment(state, action, options) {
  const recruitment = requireAuctionRecruitment(state);
  if (deadlineExpired(recruitment.deadlineAt, options)) throw new Error("Auction recruitment is already closed.");
  if (action.playerId === recruitment.requesterPlayerId) {
    throw new Error("Auction requester cannot withdraw from recruitment.");
  }
  if (!recruitment.participantPlayerIds.includes(action.playerId)) {
    throw new Error("Player is not participating in this auction.");
  }
  return withVersion(state, {
    pendingChoice: Object.freeze({
      ...recruitment,
      participantPlayerIds: Object.freeze(
        recruitment.participantPlayerIds.filter((playerId) => playerId !== action.playerId),
      ),
    }),
    lastEvents: freezeEvents([{
      type: "AUCTION_PARTICIPANT_WITHDREW",
      playerId: action.playerId,
      nodeId: recruitment.nodeId,
    }]),
  }, action);
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

function closePropertyAuctionRequest(state, action, options) {
  const request = requireAuctionRequestWindow(state);
  if (action.playerId !== null && action.playerId !== undefined) {
    throw new Error("AUCTION_REQUEST_CLOSE must be performed by the game authority.");
  }
  if (!deadlineExpired(request.deadlineAt, options)) {
    throw new Error("Auction request deadline has not expired.");
  }
  const phase = transitionPhase(state.phase, TURN_PHASES.TURN_END);
  return withVersion(state, {
    phase,
    pendingChoice: null,
    lastEvents: freezeEvents([{
      type: "AUCTION_REQUEST_CLOSED",
      nodeId: request.nodeId,
      requestedByPlayerIds: [],
      reason: "NO_REQUESTS",
    }]),
  }, action);
}

function closeAuctionRecruitment(state, action, options) {
  const recruitment = requireAuctionRecruitment(state);
  if (action.playerId !== null && action.playerId !== undefined) {
    throw new Error("AUCTION_RECRUITMENT_CLOSE must be performed by the game authority.");
  }
  if (!deadlineExpired(recruitment.deadlineAt, options)) {
    throw new Error("Auction recruitment deadline has not expired.");
  }
  const participantPlayerIds = [...recruitment.participantPlayerIds];
  if (participantPlayerIds.length === 1) {
    const auction = createPropertyAuction({
      nodeId: recruitment.nodeId,
      openingBid: recruitment.openingBid,
      declinedByPlayerId: recruitment.declinedByPlayerId,
      requesterPlayerId: recruitment.requesterPlayerId,
      participantPlayerIds,
      players: state.players,
    });
    return settleAuctionWinner(state, action, auction, [{
      type: "AUCTION_RECRUITMENT_CLOSED",
      nodeId: recruitment.nodeId,
      participantPlayerIds,
      reason: "SOLE_PARTICIPANT",
    }, {
      type: "AUCTION_AUTO_PURCHASED",
      nodeId: recruitment.nodeId,
      playerId: recruitment.requesterPlayerId,
      amount: recruitment.openingBid,
    }]);
  }

  const turnDeadline = deadlineAt(options, AUCTION_TIMING.bidTurnMs);
  const auction = createPropertyAuction({
    nodeId: recruitment.nodeId,
    openingBid: recruitment.openingBid,
    declinedByPlayerId: recruitment.declinedByPlayerId,
    requesterPlayerId: recruitment.requesterPlayerId,
    participantPlayerIds,
    players: state.players,
    turnDeadlineAt: turnDeadline,
  });
  const baseEvents = [{
    type: "AUCTION_RECRUITMENT_CLOSED",
    nodeId: recruitment.nodeId,
    participantPlayerIds,
    reason: "COMPETITIVE",
  }, {
    type: "AUCTION_STARTED",
    nodeId: recruitment.nodeId,
    openingBid: recruitment.openingBid,
    requesterPlayerId: recruitment.requesterPlayerId,
    participantPlayerIds,
    highestBidderId: recruitment.requesterPlayerId,
    highestBid: recruitment.openingBid,
  }];

  if (auction.status === "WON") {
    return settleAuctionWinner(state, action, auction, baseEvents);
  }

  return withVersion(state, {
    pendingChoice: Object.freeze({
      type: "PROPERTY_AUCTION",
      nodeId: recruitment.nodeId,
      openingBid: recruitment.openingBid,
      requesterPlayerId: recruitment.requesterPlayerId,
      participantPlayerIds: Object.freeze(participantPlayerIds),
      auction,
    }),
    lastEvents: freezeEvents(baseEvents),
  }, action);
}

function resolvePropertyAuction(state, action, options, { timeout = false } = {}) {
  if (state.status !== GAME_STATUS.PLAYING || state.phase !== TURN_PHASES.WAITING_CHOICE) {
    throw new Error(`AUCTION_BID is not allowed during ${state.phase}.`);
  }
  if (state.pendingChoice?.type !== "PROPERTY_AUCTION") {
    throw new Error("There is no property auction to resolve.");
  }

  const auction = state.pendingChoice.auction;
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

  return settleAuctionWinner(state, action, result.auction, result.events.filter((event) => event.type !== "AUCTION_WON"));
}

export function reducePhase7GameAction(state, action, options = {}) {
  if (
    action?.type === ACTION_TYPES.END_TURN
    && state?.phase === TURN_PHASES.WAITING_CHOICE
    && state?.pendingChoice?.type === "BUY_PROPERTY"
  ) {
    return openPropertyAuctionRequest(state, action, options);
  }

  if (action?.type === ACTION_TYPES.AUCTION_REQUEST) {
    return requestPropertyAuction(state, action, options);
  }

  if (action?.type === ACTION_TYPES.AUCTION_JOIN) {
    return joinRecruitment(state, action, options);
  }

  if (action?.type === ACTION_TYPES.AUCTION_WITHDRAW) {
    return withdrawRecruitment(state, action, options);
  }

  if (action?.type === ACTION_TYPES.AUCTION_REQUEST_CLOSE) {
    return closePropertyAuctionRequest(state, action, options);
  }

  if (action?.type === ACTION_TYPES.AUCTION_RECRUITMENT_CLOSE) {
    return closeAuctionRecruitment(state, action, options);
  }

  if (action?.type === ACTION_TYPES.AUCTION_BID) {
    return resolvePropertyAuction(state, action, options);
  }

  if (action?.type === ACTION_TYPES.AUCTION_BID_TIMEOUT) {
    return resolvePropertyAuction(state, action, options, { timeout: true });
  }

  return reduceGameAction(state, action, options);
}
