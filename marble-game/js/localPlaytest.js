import { ACTION_TYPES, createAction } from "./core/actions.js";
import { rollDice } from "./core/dice.js";
import { createInitialGameState, reduceGameAction } from "./core/gameEngine.js";

const DEFAULT_PLAYERS = Object.freeze([
  Object.freeze({ id: "player-a", name: "플레이어 A" }),
  Object.freeze({ id: "player-b", name: "플레이어 B" }),
]);

export function createLocalClassicSession({ players = DEFAULT_PLAYERS, random = Math.random } = {}) {
  if (typeof random !== "function") {
    throw new TypeError("Local playtest random source must be a function.");
  }

  let state = createInitialGameState({ themeId: "classic", players });

  function dispatch(type, payload = {}) {
    const current = state.currentPlayerIndex === null ? null : state.players[state.currentPlayerIndex];
    state = reduceGameAction(state, createAction({
      type,
      playerId: current?.id ?? null,
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
  });
}
