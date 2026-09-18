function requireFunction(value, name) {
  if (typeof value !== "function") {
    throw new TypeError(`Snapshot coordinator requires ${name}().`);
  }
  return value;
}

export function snapshotVersion(snapshot) {
  const version = snapshot?.version;
  if (!Number.isInteger(version) || version < 0) {
    throw new TypeError("Authoritative game snapshot requires a non-negative integer version.");
  }
  return version;
}

export function createSnapshotCoordinator({
  loadSnapshot,
  subscribeInvalidation,
  getVersion = snapshotVersion,
  onSnapshot = () => {},
  onError = () => {},
}) {
  const load = requireFunction(loadSnapshot, "loadSnapshot");
  const subscribe = requireFunction(subscribeInvalidation, "subscribeInvalidation");
  const versionOf = requireFunction(getVersion, "getVersion");
  const emitSnapshot = requireFunction(onSnapshot, "onSnapshot");
  const emitError = requireFunction(onError, "onError");

  let currentSnapshot = null;
  let currentVersion = -1;
  let inFlight = null;
  let refreshQueued = false;
  let unsubscribe = null;
  let disposed = false;

  async function runRefresh(reason) {
    let nextReason = reason;
    let lastResult = null;

    do {
      refreshQueued = false;
      const snapshot = await load({ reason: nextReason });
      const version = versionOf(snapshot);

      if (version < currentVersion) {
        lastResult = Object.freeze({
          accepted: false,
          reason: "stale",
          version,
          currentVersion,
          snapshot,
        });
      } else {
        currentSnapshot = snapshot;
        currentVersion = version;
        emitSnapshot(snapshot, { reason: nextReason, version });
        lastResult = Object.freeze({
          accepted: true,
          reason: null,
          version,
          currentVersion,
          snapshot,
        });
      }

      nextReason = "coalesced";
    } while (refreshQueued && !disposed);

    return lastResult;
  }

  function refresh(reason = "manual") {
    if (disposed) {
      return Promise.reject(new Error("Snapshot coordinator has been disposed."));
    }

    if (inFlight) {
      refreshQueued = true;
      return inFlight;
    }

    inFlight = runRefresh(reason)
      .catch((error) => {
        emitError(error, { reason });
        throw error;
      })
      .finally(() => {
        inFlight = null;
      });

    return inFlight;
  }

  async function start({ refreshImmediately = true } = {}) {
    if (disposed) throw new Error("Snapshot coordinator has been disposed.");

    if (!unsubscribe) {
      const stop = subscribe(() => {
        void refresh("invalidation").catch(() => {});
      });
      if (typeof stop !== "function") {
        throw new TypeError("subscribeInvalidation() must return an unsubscribe function.");
      }
      unsubscribe = stop;
    }

    if (!refreshImmediately) return null;
    return refresh("start");
  }

  function stop() {
    unsubscribe?.();
    unsubscribe = null;
    refreshQueued = false;
  }

  function dispose() {
    stop();
    disposed = true;
  }

  function current() {
    return Object.freeze({
      snapshot: currentSnapshot,
      version: currentVersion < 0 ? null : currentVersion,
      refreshing: Boolean(inFlight),
    });
  }

  return Object.freeze({
    start,
    stop,
    dispose,
    refresh,
    current,
  });
}
