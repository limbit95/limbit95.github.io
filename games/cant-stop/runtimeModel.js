import { GAME_ACCESS_REASON } from "../shared/accessGate.js";
import { CANT_STOP_COLUMN_HEIGHTS } from "./rules.js";

export const CANT_STOP_ACCESS_VIEW = Object.freeze({
  READY: "ready",
  AUTHENTICATION_REQUIRED: "authentication_required",
  APPROVAL_REQUIRED: "approval_required",
});

export function resolveCantStopAccessView(access) {
  if (access?.allowed === true) return CANT_STOP_ACCESS_VIEW.READY;
  if (access?.reason === GAME_ACCESS_REASON.AUTHENTICATION_REQUIRED) {
    return CANT_STOP_ACCESS_VIEW.AUTHENTICATION_REQUIRED;
  }
  if (access?.reason === GAME_ACCESS_REASON.APPROVAL_REQUIRED) {
    return CANT_STOP_ACCESS_VIEW.APPROVAL_REQUIRED;
  }
  throw new TypeError("Unsupported Can't Stop access state.");
}

export function createCantStopBoardColumns() {
  return Object.freeze(
    Object.entries(CANT_STOP_COLUMN_HEIGHTS).map(([number, height]) => Object.freeze({
      number: Number(number),
      height,
    })),
  );
}

export function createCantStopShellPlayer(authState) {
  const userId = authState?.user?.id;
  if (typeof userId !== "string" || !userId.trim()) {
    throw new TypeError("Can't Stop shell player requires an authenticated user.");
  }

  const displayName = authState?.profile?.display_name?.trim() || "플레이어";
  return Object.freeze({
    id: userId.trim(),
    displayName,
    connected: true,
    ready: false,
  });
}
