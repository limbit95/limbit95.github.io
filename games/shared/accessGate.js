export const GAME_ACCESS_REASON = Object.freeze({
  AUTHENTICATION_REQUIRED: "authentication_required",
  APPROVAL_REQUIRED: "approval_required",
});

export function resolveApprovedMemberAccess(authState) {
  if (!authState?.isAuthenticated || !authState?.user?.id) {
    return Object.freeze({
      allowed: false,
      reason: GAME_ACCESS_REASON.AUTHENTICATION_REQUIRED,
      userId: null,
    });
  }

  if (!authState.isApproved) {
    return Object.freeze({
      allowed: false,
      reason: GAME_ACCESS_REASON.APPROVAL_REQUIRED,
      userId: authState.user.id,
    });
  }

  return Object.freeze({
    allowed: true,
    reason: null,
    userId: authState.user.id,
  });
}

function requireFunction(value, name) {
  if (typeof value !== "function") {
    throw new TypeError(`Game access gate requires ${name}().`);
  }
  return value;
}

export function createGameAccessGate({
  initialize,
  getState,
  subscribe,
}) {
  const initializeAuth = requireFunction(initialize, "initialize");
  const getAuthState = requireFunction(getState, "getState");
  const subscribeAuth = requireFunction(subscribe, "subscribe");

  return Object.freeze({
    async initialize() {
      const initializedState = await initializeAuth();
      return resolveApprovedMemberAccess(initializedState ?? getAuthState());
    },

    current() {
      return resolveApprovedMemberAccess(getAuthState());
    },

    subscribe(listener) {
      if (typeof listener !== "function") {
        throw new TypeError("Game access gate subscriber must be a function.");
      }

      listener(resolveApprovedMemberAccess(getAuthState()));
      return subscribeAuth((authState) => {
        listener(resolveApprovedMemberAccess(authState));
      });
    },
  });
}
