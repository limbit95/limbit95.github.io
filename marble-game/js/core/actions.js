export const ACTION_TYPES = Object.freeze({
  START_GAME: "START_GAME",
  ROLL_DICE: "ROLL_DICE",
  CHOOSE_PATH: "CHOOSE_PATH",
  BUY_TILE: "BUY_TILE",
  BUILD: "BUILD",
  UPGRADE: "UPGRADE",
  AUCTION_BID: "AUCTION_BID",
  TRADE_OFFER: "TRADE_OFFER",
  TRADE_ACCEPT: "TRADE_ACCEPT",
  TRADE_REJECT: "TRADE_REJECT",
  USE_ITEM: "USE_ITEM",
  USE_REACTION: "USE_REACTION",
  JOIN_EVENT: "JOIN_EVENT",
  END_TURN: "END_TURN",
  END_GAME: "END_GAME",
});

const ACTION_TYPE_SET = new Set(Object.values(ACTION_TYPES));

export function isActionType(type) {
  return ACTION_TYPE_SET.has(type);
}

export function createAction({ type, playerId = null, payload = {}, clientActionId = null }) {
  if (!isActionType(type)) {
    throw new Error(`Unknown marble action type: ${type}`);
  }
  if (payload === null || typeof payload !== "object" || Array.isArray(payload)) {
    throw new TypeError("Action payload must be an object.");
  }

  return Object.freeze({
    type,
    playerId,
    payload: Object.freeze({ ...payload }),
    clientActionId,
  });
}
