import { ACTION_TYPES } from "./actions.js";
import { reducePhase7GameAction } from "./auctionGameEngine.js";
import { GAME_STATUS } from "./gameEngine.js";
import { createTradeProposal, reduceTradeProposal } from "./trade.js";
import {
  normalizeTradeSettlementTerms,
  settleAcceptedTrade,
} from "./tradeSettlement.js";
import { TURN_PHASES } from "./turnMachine.js";

function freezeEvents(events) {
  return Object.freeze(events.map((event) => Object.freeze({ ...event })));
}

function withVersion(state, patch, action) {
  return Object.freeze({
    ...state,
    ...patch,
    version: state.version + 1,
    lastAction: Object.freeze({
      type: action.type,
      playerId: action.playerId ?? null,
    }),
  });
}

function requireCurrentPlayerBeforeRoll(state, action) {
  if (state.status !== GAME_STATUS.PLAYING || state.phase !== TURN_PHASES.WAITING_ROLL) {
    throw new Error(`TRADE_OFFER is only allowed during ${TURN_PHASES.WAITING_ROLL}.`);
  }
  const current = state.players[state.currentPlayerIndex];
  if (!current || current.bankrupt) throw new Error("Current player is not active.");
  if (action.playerId !== current.id) {
    throw new Error("TRADE_OFFER must be performed by the current player.");
  }
  return current;
}

function requireTradableProperty(boardState, propertyId, ownerId, label) {
  const property = boardState?.properties?.[propertyId];
  if (!property) throw new Error(`Unknown trade property: ${propertyId}`);
  if (property.ownerId !== ownerId) {
    throw new Error(`Trade ${label} does not own property: ${propertyId}`);
  }
  if (Number(property.buildingLevel ?? 0) > 0) {
    throw new Error(`Improved property cannot be traded yet: ${propertyId}`);
  }
}

function validateOfferAvailability(state, proposal) {
  const terms = normalizeTradeSettlementTerms(proposal.terms);
  const proposer = state.players.find((player) => player.id === proposal.proposerPlayerId);
  const recipient = state.players.find((player) => player.id === proposal.recipientPlayerId);

  if (!proposer || proposer.bankrupt) throw new Error("Trade proposer is not active.");
  if (!recipient || recipient.bankrupt) throw new Error("Trade recipient is not active.");

  for (const propertyId of terms.offered.propertyIds) {
    requireTradableProperty(state.boardState, propertyId, proposer.id, "proposer");
  }
  for (const propertyId of terms.requested.propertyIds) {
    requireTradableProperty(state.boardState, propertyId, recipient.id, "recipient");
  }

  if (Number(proposer.money) < terms.offered.gold) {
    throw new Error("Trade proposer cannot afford offered gold.");
  }
  if (Number(recipient.money) < terms.requested.gold) {
    throw new Error("Trade recipient cannot afford requested gold.");
  }

  return terms;
}

function openTradeProposal(state, action) {
  const current = requireCurrentPlayerBeforeRoll(state, action);
  if (state.pendingTrade) throw new Error("Another trade proposal is already open.");

  const proposal = createTradeProposal({
    offerId: action.payload?.offerId,
    proposerPlayerId: current.id,
    recipientPlayerId: action.payload?.recipientPlayerId,
    terms: action.payload?.terms,
    players: state.players,
  });
  const terms = validateOfferAvailability(state, proposal);

  return withVersion(state, {
    pendingTrade: proposal,
    lastEvents: freezeEvents([{
      type: "TRADE_OFFERED",
      offerId: proposal.offerId,
      proposerPlayerId: proposal.proposerPlayerId,
      recipientPlayerId: proposal.recipientPlayerId,
      terms,
    }]),
  }, action);
}

function acceptTradeProposal(state, action) {
  if (!state.pendingTrade) throw new Error("There is no open trade proposal.");
  const resolved = reduceTradeProposal(state.pendingTrade, state.players, {
    playerId: action.playerId,
    accept: true,
  });
  const settlement = settleAcceptedTrade({
    proposal: resolved.proposal,
    players: state.players,
    boardState: state.boardState,
  });

  return withVersion(state, {
    players: settlement.players,
    boardState: settlement.boardState,
    pendingTrade: null,
    lastEvents: freezeEvents([
      ...resolved.events,
      ...settlement.events,
    ]),
  }, action);
}

function rejectTradeProposal(state, action) {
  if (!state.pendingTrade) throw new Error("There is no open trade proposal.");
  const resolved = reduceTradeProposal(state.pendingTrade, state.players, {
    playerId: action.playerId,
    reject: true,
  });

  return withVersion(state, {
    pendingTrade: null,
    lastEvents: freezeEvents(resolved.events),
  }, action);
}

function cancelTradeProposal(state, action) {
  if (!state.pendingTrade) throw new Error("There is no open trade proposal.");
  const resolved = reduceTradeProposal(state.pendingTrade, state.players, {
    playerId: action.playerId,
    cancel: true,
  });

  return withVersion(state, {
    pendingTrade: null,
    lastEvents: freezeEvents(resolved.events),
  }, action);
}

export function reducePhase7TradingGameAction(state, action) {
  if (!state || typeof state !== "object") throw new TypeError("Game state is required.");
  if (!action || typeof action.type !== "string") throw new TypeError("A marble action is required.");

  if (action.type === ACTION_TYPES.TRADE_ACCEPT) {
    return acceptTradeProposal(state, action);
  }

  if (action.type === ACTION_TYPES.TRADE_REJECT) {
    return rejectTradeProposal(state, action);
  }

  if (action.type === ACTION_TYPES.TRADE_CANCEL) {
    return cancelTradeProposal(state, action);
  }

  if (state.pendingTrade && action.type !== ACTION_TYPES.END_GAME) {
    throw new Error("Open trade proposal must be resolved before continuing.");
  }

  if (action.type === ACTION_TYPES.TRADE_OFFER) {
    return openTradeProposal(state, action);
  }

  return reducePhase7GameAction(state, action);
}
