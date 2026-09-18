import { ACTION_TYPES, createAction } from "./core/actions.js";
import { reducePhase7LiquidationGameAction } from "./core/liquidationGameEngine.js";
import { rollDice } from "./core/dice.js";
import { createInitialGameState } from "./core/gameEngine.js";

export const DEFAULT_PLAYERS = Object.freeze([
  Object.freeze({ id: "player-a", name: "플레이어 A" }),
  Object.freeze({ id: "player-b", name: "플레이어 B" }),
  Object.freeze({ id: "player-c", name: "플레이어 C" }),
  Object.freeze({ id: "player-d", name: "플레이어 D" }),
]);

export function createLocalClassicSession({
  players = DEFAULT_PLAYERS,
  random = Math.random,
  clock = Date.now,
} = {}) {
  if (typeof random !== "function") {
    throw new TypeError("Local playtest random source must be a function.");
  }
  if (typeof clock !== "function") {
    throw new TypeError("Local playtest clock must be a function.");
  }

  let state = createInitialGameState({ themeId: "classic", players });

  function dispatch(type, payload = {}, playerId = undefined) {
    const current = state.currentPlayerIndex === null ? null : state.players[state.currentPlayerIndex];
    state = reducePhase7LiquidationGameAction(state, createAction({
      type,
      playerId: playerId === undefined ? (current?.id ?? null) : playerId,
      payload,
    }), { nowMs: Number(clock()) });
    return state;
  }

  return Object.freeze({
    getState() {
      return state;
    },
    start() {
      return dispatch(ACTION_TYPES.START_GAME);
    },
    roll() {
      const result = rollDice(random);
      return dispatch(ACTION_TYPES.ROLL_DICE, { dice: result.dice });
    },
    buy() {
      return dispatch(ACTION_TYPES.BUY_TILE);
    },
    build() {
      return dispatch(ACTION_TYPES.BUILD);
    },
    endTurn() {
      return dispatch(ACTION_TYPES.END_TURN);
    },
    requestAuction(playerId) {
      return dispatch(ACTION_TYPES.AUCTION_REQUEST, {}, playerId);
    },
    closeAuctionRequest() {
      return dispatch(ACTION_TYPES.AUCTION_REQUEST_CLOSE, {}, null);
    },
    joinAuction(playerId) {
      return dispatch(ACTION_TYPES.AUCTION_JOIN, {}, playerId);
    },
    withdrawAuction(playerId) {
      return dispatch(ACTION_TYPES.AUCTION_WITHDRAW, {}, playerId);
    },
    closeAuctionRecruitment() {
      return dispatch(ACTION_TYPES.AUCTION_RECRUITMENT_CLOSE, {}, null);
    },
    auctionBid(playerId, amount) {
      return dispatch(ACTION_TYPES.AUCTION_BID, { amount }, playerId);
    },
    auctionPass(playerId) {
      return dispatch(ACTION_TYPES.AUCTION_BID, { pass: true }, playerId);
    },
    auctionTimeout() {
      return dispatch(ACTION_TYPES.AUCTION_BID_TIMEOUT, {}, null);
    },
    advanceAuctionDeadline() {
      if (state.pendingChoice?.type === "AUCTION_REQUEST") {
        return dispatch(ACTION_TYPES.AUCTION_REQUEST_CLOSE, {}, null);
      }
      if (state.pendingChoice?.type === "AUCTION_RECRUITMENT") {
        return dispatch(ACTION_TYPES.AUCTION_RECRUITMENT_CLOSE, {}, null);
      }
      if (state.pendingChoice?.type === "PROPERTY_AUCTION") {
        return dispatch(ACTION_TYPES.AUCTION_BID_TIMEOUT, {}, null);
      }
      throw new Error("AUCTION_DEADLINE_NOT_ACTIVE");
    },
    offerTrade(recipientPlayerId, terms, offerId) {
      return dispatch(ACTION_TYPES.TRADE_OFFER, {
        offerId,
        recipientPlayerId,
        terms,
      });
    },
    acceptTrade(playerId) {
      return dispatch(ACTION_TYPES.TRADE_ACCEPT, {}, playerId);
    },
    rejectTrade(playerId) {
      return dispatch(ACTION_TYPES.TRADE_REJECT, {}, playerId);
    },
    cancelTrade(playerId) {
      return dispatch(ACTION_TYPES.TRADE_CANCEL, {}, playerId);
    },
    selectLiquidation(assetIds) {
      return dispatch(ACTION_TYPES.LIQUIDATION_SELECT, { assetIds });
    },
    confirmLiquidation() {
      return dispatch(ACTION_TYPES.LIQUIDATION_CONFIRM);
    },
  });
}
