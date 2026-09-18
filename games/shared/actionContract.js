const ACTION_TYPE_PATTERN = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/u;

function nonEmptyText(value, field) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(`Game action requires a non-empty ${field}.`);
  }
  return value.trim();
}

function nonNegativeVersion(value) {
  if (!Number.isInteger(value) || value < 0) {
    throw new TypeError("Game action expectedVersion must be a non-negative integer.");
  }
  return value;
}

export function createClientActionId(randomUUID = globalThis.crypto?.randomUUID?.bind(globalThis.crypto)) {
  if (typeof randomUUID !== "function") {
    throw new Error("A client action id generator is required.");
  }
  return nonEmptyText(randomUUID(), "clientActionId");
}

export function createVersionedAction({
  roomId,
  expectedVersion,
  clientActionId,
  actionType,
  payload = {},
}, {
  idFactory = createClientActionId,
} = {}) {
  const normalizedActionType = nonEmptyText(actionType, "actionType");
  if (!ACTION_TYPE_PATTERN.test(normalizedActionType)) {
    throw new TypeError("Game action actionType must be lowercase snake_case.");
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new TypeError("Game action payload must be an object.");
  }

  const actionId = clientActionId == null
    ? idFactory()
    : nonEmptyText(clientActionId, "clientActionId");

  return Object.freeze({
    roomId: nonEmptyText(roomId, "roomId"),
    expectedVersion: nonNegativeVersion(expectedVersion),
    clientActionId: actionId,
    actionType: normalizedActionType,
    payload: Object.freeze({ ...payload }),
  });
}
