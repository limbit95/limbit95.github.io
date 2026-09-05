import { ACTION_TYPES } from "./actions.js";
import { TURN_PHASES, transitionPhase } from "./turnMachine.js";
import { requireTheme } from "../themes/themeRegistry.js";

export const GAME_STATUS = Object.freeze({
  SETUP: "SETUP",
  PLAYING: "PLAYING",
  FINISHED: "FINISHED",
});

function normalizePlayers(players) {
  if (!Array.isArray(players) || players.length < 2) {
    throw new Error("Marble foundation requires at least two players.");
  }

  const ids = new Set();
  return Object.freeze(players.map((player, index) => {
    const id = typeof player === "string" ? player : player?.id;
    if (typeof id !== "string" || !id.trim()) {
      throw new Error(`Player ${index + 1} requires a non-empty id.`);
    }
    if (ids.has(id)) {
      throw new Error(`Duplicate player id: ${id}`);
    }
    ids.add(id);

    return Object.freeze({
      id,
      seat: index,
      positionNodeId: null,
      ...((typeof player === "object" && player) ? player : {}),
    });
  }));
}

export function createInitialGameState({ themeId = "classic", players }) {
  const theme = requireTheme(themeId);
  if (!theme.engineReady || typeof theme.createBoard !== "function") {
    throw new Error(`Theme is not ready for the game engine yet: ${themeId}`);
  }

  const board = theme.createBoard();
  const normalizedPlayers = normalizePlayers(players).map((player) => Object.freeze({
    ...player,
    positionNodeId: board.startNodeId,
  }));

  return Object.freeze({
    themeId,
    rulesetVersion: 1,
    status: GAME_STATUS.SETUP,
    phase: TURN_PHASES.SETUP,
    turn: 0,
    currentPlayerIndex: null,
    players: Object.freeze(normalizedPlayers),
    board: board.toJSON(),
    themeState: Object.freeze({}),
    version: 0,
    lastAction: null,
  });
}

function withVersion(state, patch, action) {
  return Object.freeze({
    ...state,
    ...patch,
    version: state.version + 1,
    lastAction: Object.freeze({ type: action.type, playerId: action.playerId ?? null }),
  });
}

export function reduceGameAction(state, action) {
  if (!state || typeof state !== "object") {
    throw new TypeError("Game state is required.");
  }
  if (!action || typeof action.type !== "string") {
    throw new TypeError("A marble action is required.");
  }

  if (action.type === ACTION_TYPES.START_GAME) {
    if (state.status !== GAME_STATUS.SETUP || state.phase !== TURN_PHASES.SETUP) {
      throw new Error("Game can only start from SETUP.");
    }
    const turnStartPhase = transitionPhase(state.phase, TURN_PHASES.TURN_START);
    const waitingRollPhase = transitionPhase(turnStartPhase, TURN_PHASES.WAITING_ROLL);
    return withVersion(state, {
      status: GAME_STATUS.PLAYING,
      phase: waitingRollPhase,
      turn: 1,
      currentPlayerIndex: 0,
    }, action);
  }

  if (action.type === ACTION_TYPES.END_GAME) {
    if (state.phase === TURN_PHASES.FINISHED) return state;
    const finishedPhase = transitionPhase(state.phase, TURN_PHASES.FINISHED);
    return withVersion(state, {
      status: GAME_STATUS.FINISHED,
      phase: finishedPhase,
    }, action);
  }

  throw new Error(`Action is reserved for a later Marble phase: ${action.type}`);
}
