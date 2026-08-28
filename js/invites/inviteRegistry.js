const handlers = new Map();

export function registerInviteHandler(targetType, handler) {
  if (!targetType || typeof handler !== "function") throw new TypeError("Invite handler is required.");
  handlers.set(targetType, handler);
  return () => handlers.delete(targetType);
}

export async function dispatchInvite(invite, context = {}) {
  const handler = handlers.get(invite?.target_type);
  if (!handler) throw new Error("UNSUPPORTED_INVITE_TARGET");
  return handler(invite, context);
}

export function hasInviteHandler(targetType) {
  return handlers.has(targetType);
}
