export const ROOM_LOBBY_METHODS = Object.freeze([
  "createRoom",
  "joinRoom",
  "getMyActiveRoom",
  "getLobbySnapshot",
  "setReady",
  "leaveRoom",
  "startGame",
  "subscribeInvalidation",
]);

function requireMethod(adapter, method) {
  if (typeof adapter?.[method] !== "function") {
    throw new TypeError(`Room/lobby adapter requires ${method}().`);
  }
  return adapter[method].bind(adapter);
}

export function defineRoomLobbyAdapter(adapter) {
  if (!adapter || typeof adapter !== "object") {
    throw new TypeError("Room/lobby adapter must be an object.");
  }

  const contract = {};
  ROOM_LOBBY_METHODS.forEach((method) => {
    contract[method] = requireMethod(adapter, method);
  });
  return Object.freeze(contract);
}
