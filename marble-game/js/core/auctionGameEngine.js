import { ACTION_TYPES } from "./actions.js";
import {
  createPropertyAuction,
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

function beginPropertyAuction(state, action) {
  const current = requirePurchaseDecline(state, action);
  const node = getBoardNode(state.board, state.pendingChoice.nodeId);
  if (!node || node.type !== "PROPERTY") throw new Error("Auction property is missing.");
  if (state.boardState.properties[node.id]?.ownerId) throw new Error("Property is already owned.");

  const auction = createPropertyAuction({
    nodeId: node.id,
    openingBid: state.pendingChoice.price,
    declinedByPlayerId: current.id,
    players: state.players,
  });
  const events = [
    { type: "CHOICE_DECLINED", playerId: current.id, choiceType: "BUY_PROPERTY" },
    {
      type: "AUCTION_STARTED",
      playerId: current.id,
      nodeId: node.id,
      openingBid: auction.openingBid,
      eligiblePlayerIds: auction.eligiblePlayerIds,
    },
  ];

  if (auction.status === "UNSOLD") {
    const advanced = reduceGameAction(state, action);
    return Object.freeze({
      ...advanced,
      lastEvents: freezeEvents([
        ...events,
        { type: "AUCTION_ENDED", nodeId: node.id, winnerPlayerId: null, amount: 0 },
      ]),
    });
  }

  return withVersion(state, {
    pendingChoice: Object.freeze({
      type: "PROPERTY_AUCTION",
      nodeId: node.id,
      openingBid: auction.openingBid,
      auction,
    }),
    lastEvents: freezeEvents(events),
  }, action);
}

function resolvePropertyAuction(state, action) {
  if (state.status !== GAME_STATUS.PLAYING || state.phase !== TURN_PHASES.WAITING_CHOICE) {
    throw new Error(`AUCTION_BID is not allowed during ${state.phase}.`);
  }
  if (state.pendingChoice?.type !== "PROPERTY_AUCTION") {
    throw new Error("There is no property auction to resolve.");
  }

  const result = reducePropertyAuction(state.pendingChoice.auction, state.players, {
    playerId: action.playerId,
    amount: action.payload?.amount,
    pass: action.payload?.pass === true,
  });

  if (result.auction.status === "OPEN") {
    return withVersion(state, {
      pendingChoice: Object.freeze({
        ...state.pendingChoice,
        auction: result.auction,
      }),
      lastEvents: freezeEvents(result.events),
    }, action);
  }

  const settlement = getPropertyAuctionSettlement(result.auction);
  let phase = transitionPhase(state.phase, TURN_PHASES.RESOLVING_ACTION);
  let players = [...state.players];
  let boardState = state.boardState;
  const events = [...result.events];

  if (settlement?.winnerPlayerId) {
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
    events.push({
      type: "PROPERTY_BOUGHT",
      playerId: settlement.winnerPlayerId,
      nodeId: settlement.nodeId,
      amount: settlement.amount,
      reason: "AUCTION",
    });
  }

  phase = transitionPhase(phase, TURN_PHASES.TURN_END);
  return withVersion(state, {
    phase,
    players: Object.freeze(players),
    boardState: Object.freeze({ properties: Object.freeze(boardState.properties) }),
    pendingChoice: null,
    lastEvents: freezeEvents(events),
  }, action);
}

export function reducePhase7GameAction(state, action) {
  if (
    action?.type === ACTION_TYPES.END_TURN
    && state?.phase === TURN_PHASES.WAITING_CHOICE
    && state?.pendingChoice?.type === "BUY_PROPERTY"
  ) {
    return beginPropertyAuction(state, action);
  }

  if (action?.type === ACTION_TYPES.AUCTION_BID) {
    return resolvePropertyAuction(state, action);
  }

  return reduceGameAction(state, action);
}
