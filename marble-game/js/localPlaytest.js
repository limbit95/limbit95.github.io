import { ACTION_TYPES, createAction } from "./core/actions.js";
import { reducePhase7GameAction } from "./core/auctionGameEngine.js";
import { rollDice } from "./core/dice.js";
import { createInitialGameState } from "./core/gameEngine.js";

export const DEFAULT_PLAYERS = Object.freeze([
  Object.freeze({ id: "player-a", name: "플레이어 A" }),
  Object.freeze({ id: "player-b", name: "플레이어 B" }),
  Object.freeze({ id: "player-c", name: "플레이어 C" }),
  Object.freeze({ id: "player-d", name: "플레이어 D" }),
]);

export function createLocalClassicSession({ players = DEFAULT_PLAYERS, random = Math.random } = {}) {
  if (typeof random !== "function") {
    throw new TypeError("Local playtest random source must be a function.");
  }

  let state = createInitialGameState({ themeId: "classic", players });

  function dispatch(type, payload = {}, playerId = undefined) {
    const current = state.currentPlayerIndex === null ? null : state.players[state.currentPlayerIndex];
    state = reducePhase7GameAction(state, createAction({
      type,
      playerId: playerId === undefined ? (current?.id ?? null) : playerId,
      payload,
    }));
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
    auctionBid(playerId, amount) {
      return dispatch(ACTION_TYPES.AUCTION_BID, { amount }, playerId);
    },
    auctionPass(playerId) {
      return dispatch(ACTION_TYPES.AUCTION_BID, { pass: true }, playerId);
    },
  });
}
