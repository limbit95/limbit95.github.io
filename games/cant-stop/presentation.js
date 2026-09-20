export const CANT_STOP_PRESENTATION_TIMINGS = Object.freeze({
  rollCycleMs: 900,
  rollMinimumMs: 900,
  bustMs: 1250,
});

function snapshotVersion(state) {
  const value = Number(state?.snapshot?.version);
  return Number.isFinite(value) ? value : null;
}

function isBustEffect(state) {
  return state?.effect?.type === "bust";
}

export function createCantStopPresentationCoordinator({
  onPresent,
  now = () => Date.now(),
  schedule = (callback, delay) => setTimeout(callback, delay),
  cancel = (timer) => clearTimeout(timer),
  timings = CANT_STOP_PRESENTATION_TIMINGS,
} = {}) {
  if (typeof onPresent !== "function") {
    throw new TypeError("Can't Stop presentation coordinator requires onPresent().");
  }

  let disposed = false;
  let presentedState = null;
  let rollBaseState = null;
  let queuedRollState = null;
  let rollStartedAt = 0;
  let rollTimer = null;
  let bustTimer = null;
  let bustTargetState = null;

  function clearTimer(name) {
    const timer = name === "roll" ? rollTimer : bustTimer;
    if (timer != null) cancel(timer);
    if (name === "roll") rollTimer = null;
    else bustTimer = null;
  }

  function present(state) {
    if (disposed) return;
    presentedState = state;
    onPresent(state);
  }

  function clearRollState() {
    clearTimer("roll");
    rollBaseState = null;
    queuedRollState = null;
    rollStartedAt = 0;
  }

  function finishBust(finalState, baseState) {
    clearTimer("bust");
    const baseSnapshot = baseState?.snapshot;
    if (!baseSnapshot) {
      bustTargetState = null;
      present({ ...finalState, effect: null });
      return;
    }

    bustTargetState = finalState;
    present({
      ...finalState,
      snapshot: baseSnapshot,
      busy: false,
      busyAction: null,
      effect: finalState.effect,
    });

    bustTimer = schedule(() => {
      bustTimer = null;
      const target = bustTargetState ?? finalState;
      bustTargetState = null;
      present({
        ...target,
        effect: null,
      });
    }, timings.bustMs);
  }

  function releaseQueuedRoll() {
    rollTimer = null;
    const finalState = queuedRollState;
    const baseState = rollBaseState;
    clearRollState();
    if (!finalState) return;

    if (isBustEffect(finalState)) {
      finishBust(finalState, baseState);
      return;
    }

    present({
      ...finalState,
      effect: null,
    });
  }

  function nextRollBoundaryDelay() {
    const elapsed = Math.max(0, now() - rollStartedAt);
    const minimum = Math.max(timings.rollMinimumMs, timings.rollCycleMs);
    const boundary = Math.max(
      minimum,
      Math.ceil(elapsed / timings.rollCycleMs) * timings.rollCycleMs,
    );
    return Math.max(0, boundary - elapsed);
  }

  function queueRollResult(state) {
    const queuedVersion = snapshotVersion(queuedRollState);
    const incomingVersion = snapshotVersion(state);
    const keepQueuedBust = isBustEffect(queuedRollState)
      && !isBustEffect(state)
      && queuedVersion != null
      && queuedVersion === incomingVersion;

    queuedRollState = keepQueuedBust
      ? { ...state, effect: queuedRollState.effect }
      : state;
    clearTimer("roll");
    rollTimer = schedule(releaseQueuedRoll, nextRollBoundaryDelay());
  }

  function receive(state) {
    if (disposed) return;

    if (bustTimer != null && bustTargetState) {
      const targetVersion = snapshotVersion(bustTargetState);
      const incomingVersion = snapshotVersion(state);
      if (incomingVersion != null && targetVersion != null && incomingVersion >= targetVersion) {
        bustTargetState = isBustEffect(state)
          ? state
          : { ...state, effect: bustTargetState.effect };
        return;
      }
    }

    const rolling = state?.busyAction === "rollDice";
    if (rolling && !rollBaseState) {
      rollBaseState = state;
      rollStartedAt = now();
      present(state);
      return;
    }

    if (rolling && rollBaseState) {
      const baseVersion = snapshotVersion(rollBaseState);
      const incomingVersion = snapshotVersion(state);
      if (incomingVersion === baseVersion || incomingVersion == null) {
        return;
      }
      queueRollResult(state);
      return;
    }

    if (rollBaseState) {
      queueRollResult(state);
      return;
    }

    if (
      isBustEffect(state)
      && presentedState?.snapshot
      && snapshotVersion(state) !== snapshotVersion(presentedState)
    ) {
      finishBust(state, presentedState);
      return;
    }

    clearTimer("bust");
    present(state);
  }

  function current() {
    return presentedState;
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    clearTimer("roll");
    clearTimer("bust");
    rollBaseState = null;
    queuedRollState = null;
    presentedState = null;
  }

  return Object.freeze({
    receive,
    current,
    dispose,
  });
}
