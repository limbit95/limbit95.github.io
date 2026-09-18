import { ACTION_TYPES } from "./actions.js";
import {
  DEBT_RECOVERY_STATUS,
  createDebtRecoveryCase,
} from "./liquidation.js";
import {
  createBoardLiquidationCatalog,
  createLiquidationValuePolicy,
} from "./liquidationPolicy.js";
import {
  confirmDebtRecovery,
  createDebtRecoveryLifecycle,
  selectDebtRecoveryAssets,
} from "./debtRecoveryLifecycle.js";
import {
  settleConfirmedDebtRecovery,
} from "./debtRecoverySettlement.js";
import { reducePhase7TradingGameAction } from "./tradeGameEngine.js";
import { TURN_PHASES, transitionPhase } from "./turnMachine.js";
import { requireTheme } from "../themes/themeRegistry.js";

function freezeEvents(events) {
  return Object.freeze(events.map((event) => Object.freeze({ ...event })));
}

function withVersion(state, patch, action) {
  return Object.freeze({
    ...state,
    ...patch,
    version: state.version + 1,
    lastAction: Object.freeze({
      type: action.type,
      playerId: action.playerId ?? null,
    }),
  });
}

function requireDebtRecoveryChoice(state, action) {
  if (state.phase !== TURN_PHASES.WAITING_CHOICE || state.pendingChoice?.type !== "DEBT_RECOVERY") {
    throw new Error("There is no debt recovery choice to resolve.");
  }
  const lifecycle = state.pendingChoice.lifecycle;
  const debtorId = lifecycle?.debtCase?.playerId;
  if (!debtorId) throw new Error("Debt recovery lifecycle is missing.");
  if (action.playerId !== debtorId) {
    throw new Error("Debt recovery must be resolved by the debtor.");
  }
  return lifecycle;
}

function prepareDebtRecovery(state) {
  const pending = state.pendingChoice;
  if (pending?.type !== "DEBT_RECOVERY") return state;

  const theme = requireTheme(state.themeId);
  if (!theme.rules?.liquidation) {
    throw new Error("Theme does not define liquidation rules: " + state.themeId);
  }

  const debtCase = createDebtRecoveryCase({
    playerId: pending.playerId,
    amountDue: pending.amountDue,
    creditorId: pending.creditorId,
    reason: pending.reason,
    players: state.players,
    boardState: state.boardState,
  });
  const policy = createLiquidationValuePolicy(theme.rules.liquidation);
  const catalog = createBoardLiquidationCatalog({
    debtCase,
    board: state.board,
    boardState: state.boardState,
    policy,
  });
  const lifecycle = createDebtRecoveryLifecycle({ debtCase, catalog });

  if (lifecycle.status === DEBT_RECOVERY_STATUS.IMPOSSIBLE) {
    return null;
  }

  return Object.freeze({
    ...state,
    pendingChoice: Object.freeze({
      type: "DEBT_RECOVERY",
      lifecycle,
    }),
    lastEvents: freezeEvents([
      ...state.lastEvents,
      {
        type: "DEBT_RECOVERY_OPENED",
        playerId: debtCase.playerId,
        creditorId: debtCase.creditorId,
        amountDue: debtCase.amountDue,
        shortfall: debtCase.shortfall,
        reason: debtCase.reason,
      },
    ]),
  });
}

function updateDebtRecoverySelection(state, action) {
  const lifecycle = requireDebtRecoveryChoice(state, action);
  const nextLifecycle = selectDebtRecoveryAssets(
    lifecycle,
    action.payload?.assetIds ?? [],
  );

  return withVersion(state, {
    pendingChoice: Object.freeze({
      type: "DEBT_RECOVERY",
      lifecycle: nextLifecycle,
    }),
    lastEvents: freezeEvents([{
      type: "LIQUIDATION_SELECTION_UPDATED",
      playerId: lifecycle.debtCase.playerId,
      selectedAssetIds: nextLifecycle.selectedAssetIds,
      refundTotal: nextLifecycle.plan.refundTotal,
      remainingShortfall: nextLifecycle.plan.remainingShortfall,
      ready: nextLifecycle.status === DEBT_RECOVERY_STATUS.READY,
    }]),
  }, action);
}

function confirmDebtRecoveryChoice(state, action) {
  const lifecycle = requireDebtRecoveryChoice(state, action);
  const confirmed = confirmDebtRecovery(lifecycle);
  const settled = settleConfirmedDebtRecovery({
    lifecycle: confirmed,
    players: state.players,
    boardState: state.boardState,
  });

  let phase = transitionPhase(state.phase, TURN_PHASES.RESOLVING_ACTION);
  phase = transitionPhase(phase, TURN_PHASES.TURN_END);

  return withVersion(state, {
    phase,
    players: settled.players,
    boardState: settled.boardState,
    pendingChoice: null,
    lastEvents: freezeEvents(settled.events),
  }, action);
}

export function reducePhase7LiquidationGameAction(state, action, options = {}) {
  if (!state || typeof state !== "object") throw new TypeError("Game state is required.");
  if (!action || typeof action.type !== "string") throw new TypeError("A marble action is required.");

  if (state.pendingChoice?.type === "DEBT_RECOVERY") {
    if (action.type === ACTION_TYPES.LIQUIDATION_SELECT) {
      return updateDebtRecoverySelection(state, action);
    }
    if (action.type === ACTION_TYPES.LIQUIDATION_CONFIRM) {
      return confirmDebtRecoveryChoice(state, action);
    }
    if (action.type !== ACTION_TYPES.END_GAME) {
      throw new Error("Debt recovery must be resolved before continuing.");
    }
  }

  const deferred = reducePhase7TradingGameAction(state, action, {
    ...options,
    deferDebtRecovery: true,
  });
  if (deferred.pendingChoice?.type !== "DEBT_RECOVERY") {
    return deferred;
  }

  const prepared = prepareDebtRecovery(deferred);
  if (prepared) return prepared;

  // No liquidation plan can cover the debt. Re-run the same deterministic
  // action through the legacy path so existing bankruptcy semantics remain intact.
  return reducePhase7TradingGameAction(state, action, options);
}
