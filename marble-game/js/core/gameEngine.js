import { ACTION_TYPES } from "./actions.js";
import { normalizeDice } from "./dice.js";
import { moveAlongBoard } from "./movement.js";
import { TURN_PHASES, transitionPhase } from "./turnMachine.js";
import { requireTheme } from "../themes/themeRegistry.js";

export const GAME_STATUS = Object.freeze({ SETUP: "SETUP", PLAYING: "PLAYING", FINISHED: "FINISHED" });

function freezeEvents(events) { return Object.freeze(events.map((event) => Object.freeze({ ...event }))); }

function normalizePlayers(players, initialMoney) {
  if (!Array.isArray(players) || players.length < 2) throw new Error("Marble requires at least two players.");
  const ids = new Set();
  return players.map((player, index) => {
    const id = typeof player === "string" ? player : player?.id;
    if (typeof id !== "string" || !id.trim()) throw new Error(`Player ${index + 1} requires a non-empty id.`);
    if (ids.has(id)) throw new Error(`Duplicate player id: ${id}`);
    ids.add(id);
    return Object.freeze({
      id,
      seat: index,
      positionNodeId: null,
      money: initialMoney,
      bankrupt: false,
      skipTurns: 0,
      ...((typeof player === "object" && player) ? player : {}),
    });
  });
}

function createPropertyState(board) {
  return Object.fromEntries(board.nodes.filter((node) => node.type === "PROPERTY")
    .map((node) => [node.id, Object.freeze({ ownerId: null, buildingLevel: 0 })]));
}

export function createInitialGameState({ themeId = "classic", players }) {
  const theme = requireTheme(themeId);
  if (!theme.engineReady || typeof theme.createBoard !== "function" || !theme.rules) {
    throw new Error(`Theme is not ready for the game engine yet: ${themeId}`);
  }
  const board = theme.createBoard();
  const normalizedPlayers = normalizePlayers(players, theme.rules.initialMoney).map((player) => Object.freeze({
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
    boardState: Object.freeze({ properties: Object.freeze(createPropertyState(board)) }),
    themeState: Object.freeze({ eventCursor: 0 }),
    pendingChoice: null,
    lastRoll: null,
    lastEvents: Object.freeze([]),
    winnerPlayerId: null,
    version: 0,
    lastAction: null,
  });
}

function withVersion(state, patch, action) {
  return Object.freeze({ ...state, ...patch, version: state.version + 1,
    lastAction: Object.freeze({ type: action.type, playerId: action.playerId ?? null }) });
}

function requirePlayingTurn(state, action, phase) {
  if (state.status !== GAME_STATUS.PLAYING || state.phase !== phase) throw new Error(`${action.type} is not allowed during ${state.phase}.`);
  const current = state.players[state.currentPlayerIndex];
  if (!current || current.bankrupt) throw new Error("Current player is not active.");
  if (action.playerId !== current.id) throw new Error(`${action.type} must be performed by the current player.`);
  return current;
}

function updatePlayer(players, index, patch) {
  const next = [...players];
  next[index] = Object.freeze({ ...next[index], ...patch });
  return next;
}

function updateProperty(boardState, nodeId, patch) {
  return { ...boardState, properties: { ...boardState.properties,
    [nodeId]: Object.freeze({ ...boardState.properties[nodeId], ...patch }) } };
}

function releasePlayerProperties(boardState, playerId) {
  const properties = Object.fromEntries(Object.entries(boardState.properties).map(([nodeId, propertyState]) => [
    nodeId,
    propertyState.ownerId === playerId ? Object.freeze({ ownerId: null, buildingLevel: 0 }) : propertyState,
  ]));
  return { ...boardState, properties };
}

function activePlayers(players) { return players.filter((player) => !player.bankrupt); }

function settleBankruptcy(draft, playerIndex, creditorId, events) {
  const player = draft.players[playerIndex];
  const remainingCash = Math.max(0, player.money);
  let players = [...draft.players];
  if (creditorId && remainingCash > 0) {
    const creditorIndex = players.findIndex((candidate) => candidate.id === creditorId);
    if (creditorIndex >= 0) players = updatePlayer(players, creditorIndex, { money: players[creditorIndex].money + remainingCash });
  }
  players = updatePlayer(players, playerIndex, { money: 0, bankrupt: true });
  draft.players = players;
  draft.boardState = releasePlayerProperties(draft.boardState, player.id);
  events.push({ type: "PLAYER_BANKRUPT", playerId: player.id, creditorId: creditorId ?? null });
}

function chargePlayer(draft, playerIndex, amount, creditorId, events, reason) {
  const player = draft.players[playerIndex];
  if (player.money < amount) {
    settleBankruptcy(draft, playerIndex, creditorId, events);
    return false;
  }
  draft.players = updatePlayer(draft.players, playerIndex, { money: player.money - amount });
  if (creditorId) {
    const creditorIndex = draft.players.findIndex((candidate) => candidate.id === creditorId);
    draft.players = updatePlayer(draft.players, creditorIndex, { money: draft.players[creditorIndex].money + amount });
  }
  events.push({ type: "MONEY_PAID", playerId: player.id, creditorId: creditorId ?? null, amount, reason });
  return true;
}

function finishOrTurnEnd(draft, events) {
  const remaining = activePlayers(draft.players);
  if (remaining.length <= 1) {
    draft.phase = transitionPhase(draft.phase, TURN_PHASES.FINISHED);
    draft.status = GAME_STATUS.FINISHED;
    draft.winnerPlayerId = remaining[0]?.id ?? null;
    draft.pendingChoice = null;
    events.push({ type: "GAME_FINISHED", winnerPlayerId: draft.winnerPlayerId });
    return;
  }
  draft.phase = transitionPhase(draft.phase, TURN_PHASES.TURN_END);
  draft.pendingChoice = null;
}

function getBoardNode(board, nodeId) { return board.nodes.find((node) => node.id === nodeId) ?? null; }

function resolveClassicLanding(draft, playerIndex, theme, events) {
  const player = draft.players[playerIndex];
  const node = getBoardNode(draft.board, player.positionNodeId);
  if (!node) throw new Error(`Landing node is missing: ${player.positionNodeId}`);
  events.push({ type: "TILE_LANDED", playerId: player.id, nodeId: node.id, tileType: node.type });

  if (node.type === "PROPERTY") {
    const propertyState = draft.boardState.properties[node.id];
    if (!propertyState.ownerId) {
      draft.phase = transitionPhase(draft.phase, TURN_PHASES.WAITING_CHOICE);
      draft.pendingChoice = Object.freeze({ type: "BUY_PROPERTY", nodeId: node.id, price: node.price });
      return;
    }
    if (propertyState.ownerId === player.id) {
      if (propertyState.buildingLevel < node.maxBuildingLevel && player.money >= node.buildCost) {
        draft.phase = transitionPhase(draft.phase, TURN_PHASES.WAITING_CHOICE);
        draft.pendingChoice = Object.freeze({ type: "BUILD_PROPERTY", nodeId: node.id, cost: node.buildCost });
      } else finishOrTurnEnd(draft, events);
      return;
    }
    const toll = node.tollByLevel[propertyState.buildingLevel];
    chargePlayer(draft, playerIndex, toll, propertyState.ownerId, events, "TOLL");
    finishOrTurnEnd(draft, events);
    return;
  }

  if (node.type === "BONUS") {
    draft.players = updatePlayer(draft.players, playerIndex, { money: player.money + node.amount });
    events.push({ type: "MONEY_RECEIVED", playerId: player.id, amount: node.amount, reason: "BONUS" });
    finishOrTurnEnd(draft, events);
    return;
  }
  if (node.type === "TAX") {
    chargePlayer(draft, playerIndex, node.amount, null, events, "TAX");
    finishOrTurnEnd(draft, events);
    return;
  }
  if (node.type === "REST") {
    draft.players = updatePlayer(draft.players, playerIndex, { skipTurns: player.skipTurns + node.skipTurns });
    events.push({ type: "REST_ASSIGNED", playerId: player.id, skipTurns: node.skipTurns });
    finishOrTurnEnd(draft, events);
    return;
  }
  if (node.type === "EVENT") {
    const card = theme.rules.events[draft.themeState.eventCursor % theme.rules.events.length];
    draft.themeState = { ...draft.themeState, eventCursor: draft.themeState.eventCursor + 1 };
    events.push({ type: "EVENT_DRAWN", playerId: player.id, eventId: card.id, label: card.label });
    if (card.type === "BONUS") {
      draft.players = updatePlayer(draft.players, playerIndex, { money: player.money + card.amount });
      events.push({ type: "MONEY_RECEIVED", playerId: player.id, amount: card.amount, reason: "EVENT" });
    } else if (card.type === "TAX") chargePlayer(draft, playerIndex, card.amount, null, events, "EVENT");
    finishOrTurnEnd(draft, events);
    return;
  }
  finishOrTurnEnd(draft, events);
}

function advanceTurn(draft, events) {
  let phase = draft.phase;
  let index = draft.currentPlayerIndex;
  let turn = draft.turn;
  const maxChecks = draft.players.length * 2;
  for (let checked = 0; checked < maxChecks; checked += 1) {
    phase = transitionPhase(phase, TURN_PHASES.TURN_START);
    index = (index + 1) % draft.players.length;
    turn += 1;
    const candidate = draft.players[index];
    if (candidate.bankrupt) {
      phase = transitionPhase(phase, TURN_PHASES.TURN_END);
      continue;
    }
    if (candidate.skipTurns > 0) {
      draft.players = updatePlayer(draft.players, index, { skipTurns: candidate.skipTurns - 1 });
      events.push({ type: "TURN_SKIPPED", playerId: candidate.id });
      phase = transitionPhase(phase, TURN_PHASES.TURN_END);
      continue;
    }
    phase = transitionPhase(phase, TURN_PHASES.WAITING_ROLL);
    draft.phase = phase;
    draft.currentPlayerIndex = index;
    draft.turn = turn;
    draft.pendingChoice = null;
    return;
  }
  throw new Error("Unable to find the next active Marble player.");
}

export function reduceGameAction(state, action) {
  if (!state || typeof state !== "object") throw new TypeError("Game state is required.");
  if (!action || typeof action.type !== "string") throw new TypeError("A marble action is required.");
  const theme = requireTheme(state.themeId);

  if (action.type === ACTION_TYPES.START_GAME) {
    if (state.status !== GAME_STATUS.SETUP || state.phase !== TURN_PHASES.SETUP) throw new Error("Game can only start from SETUP.");
    const turnStartPhase = transitionPhase(state.phase, TURN_PHASES.TURN_START);
    const waitingRollPhase = transitionPhase(turnStartPhase, TURN_PHASES.WAITING_ROLL);
    return withVersion(state, { status: GAME_STATUS.PLAYING, phase: waitingRollPhase, turn: 1, currentPlayerIndex: 0,
      lastEvents: freezeEvents([{ type: "GAME_STARTED", playerId: state.players[0].id }]) }, action);
  }

  if (action.type === ACTION_TYPES.ROLL_DICE) {
    requirePlayingTurn(state, action, TURN_PHASES.WAITING_ROLL);
    const dice = normalizeDice(action.payload.dice);
    const total = dice[0] + dice[1];
    const events = [{ type: "DICE_ROLLED", playerId: action.playerId, dice, total }];
    const draft = { ...state, players: [...state.players],
      boardState: { ...state.boardState, properties: { ...state.boardState.properties } },
      themeState: { ...state.themeState }, phase: transitionPhase(state.phase, TURN_PHASES.ROLLING),
      pendingChoice: null, lastRoll: Object.freeze({ dice, total, isDouble: dice[0] === dice[1] }) };
    draft.phase = transitionPhase(draft.phase, TURN_PHASES.MOVING);
    const playerIndex = state.currentPlayerIndex;
    const movement = moveAlongBoard(state.board, state.players[playerIndex].positionNodeId, total);
    let money = state.players[playerIndex].money;
    if (movement.passedStartCount > 0) {
      const salary = movement.passedStartCount * theme.rules.startSalary;
      money += salary;
      events.push({ type: "START_PASSED", playerId: action.playerId, count: movement.passedStartCount, amount: salary });
    }
    draft.players = updatePlayer(draft.players, playerIndex, { positionNodeId: movement.toNodeId, money });
    events.push({ type: "PLAYER_MOVED", playerId: action.playerId, fromNodeId: movement.fromNodeId, toNodeId: movement.toNodeId, path: movement.path });
    draft.phase = transitionPhase(draft.phase, TURN_PHASES.RESOLVING_TILE);
    resolveClassicLanding(draft, playerIndex, theme, events);
    return withVersion(state, { status: draft.status, phase: draft.phase, players: Object.freeze(draft.players),
      boardState: Object.freeze({ properties: Object.freeze(draft.boardState.properties) }),
      themeState: Object.freeze(draft.themeState), pendingChoice: draft.pendingChoice, lastRoll: draft.lastRoll,
      lastEvents: freezeEvents(events), winnerPlayerId: draft.winnerPlayerId }, action);
  }

  if (action.type === ACTION_TYPES.BUY_TILE) {
    const current = requirePlayingTurn(state, action, TURN_PHASES.WAITING_CHOICE);
    if (state.pendingChoice?.type !== "BUY_PROPERTY") throw new Error("There is no property purchase to resolve.");
    const node = getBoardNode(state.board, state.pendingChoice.nodeId);
    const propertyState = state.boardState.properties[node.id];
    if (propertyState.ownerId) throw new Error("Property is already owned.");
    if (current.money < node.price) throw new Error("Player cannot afford this property.");
    let phase = transitionPhase(state.phase, TURN_PHASES.RESOLVING_ACTION);
    const players = updatePlayer(state.players, state.currentPlayerIndex, { money: current.money - node.price });
    const boardState = updateProperty(state.boardState, node.id, { ownerId: current.id, buildingLevel: 0 });
    phase = transitionPhase(phase, TURN_PHASES.TURN_END);
    return withVersion(state, { phase, players: Object.freeze(players),
      boardState: Object.freeze({ properties: Object.freeze(boardState.properties) }), pendingChoice: null,
      lastEvents: freezeEvents([{ type: "PROPERTY_BOUGHT", playerId: current.id, nodeId: node.id, amount: node.price }]) }, action);
  }

  if (action.type === ACTION_TYPES.BUILD) {
    const current = requirePlayingTurn(state, action, TURN_PHASES.WAITING_CHOICE);
    if (state.pendingChoice?.type !== "BUILD_PROPERTY") throw new Error("There is no building choice to resolve.");
    const node = getBoardNode(state.board, state.pendingChoice.nodeId);
    const propertyState = state.boardState.properties[node.id];
    if (propertyState.ownerId !== current.id) throw new Error("Player does not own this property.");
    if (propertyState.buildingLevel >= node.maxBuildingLevel) throw new Error("Property is already fully developed.");
    if (current.money < node.buildCost) throw new Error("Player cannot afford this building.");
    let phase = transitionPhase(state.phase, TURN_PHASES.RESOLVING_ACTION);
    const players = updatePlayer(state.players, state.currentPlayerIndex, { money: current.money - node.buildCost });
    const nextLevel = propertyState.buildingLevel + 1;
    const boardState = updateProperty(state.boardState, node.id, { buildingLevel: nextLevel });
    phase = transitionPhase(phase, TURN_PHASES.TURN_END);
    return withVersion(state, { phase, players: Object.freeze(players),
      boardState: Object.freeze({ properties: Object.freeze(boardState.properties) }), pendingChoice: null,
      lastEvents: freezeEvents([{ type: "PROPERTY_BUILT", playerId: current.id, nodeId: node.id, buildingLevel: nextLevel, amount: node.buildCost }]) }, action);
  }

  if (action.type === ACTION_TYPES.END_TURN) {
    if (state.status !== GAME_STATUS.PLAYING || ![TURN_PHASES.TURN_END, TURN_PHASES.WAITING_CHOICE].includes(state.phase)) {
      throw new Error(`END_TURN is not allowed during ${state.phase}.`);
    }
    const current = state.players[state.currentPlayerIndex];
    if (action.playerId !== current.id) throw new Error("END_TURN must be performed by the current player.");
    const events = [];
    const draft = { ...state, players: [...state.players], phase: state.phase, pendingChoice: state.pendingChoice };
    if (draft.phase === TURN_PHASES.WAITING_CHOICE) {
      events.push({ type: "CHOICE_DECLINED", playerId: current.id, choiceType: state.pendingChoice?.type ?? null });
      draft.phase = transitionPhase(draft.phase, TURN_PHASES.TURN_END);
      draft.pendingChoice = null;
    }
    advanceTurn(draft, events);
    return withVersion(state, { phase: draft.phase, currentPlayerIndex: draft.currentPlayerIndex, turn: draft.turn,
      players: Object.freeze(draft.players), pendingChoice: null, lastEvents: freezeEvents(events) }, action);
  }

  if (action.type === ACTION_TYPES.END_GAME) {
    if (state.phase === TURN_PHASES.FINISHED) return state;
    const finishedPhase = transitionPhase(state.phase, TURN_PHASES.FINISHED);
    return withVersion(state, { status: GAME_STATUS.FINISHED, phase: finishedPhase, pendingChoice: null }, action);
  }

  throw new Error(`Action is reserved for a later Marble phase: ${action.type}`);
}
