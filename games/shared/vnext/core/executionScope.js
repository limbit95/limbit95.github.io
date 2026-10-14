function callable(value, label) {
  if (typeof value !== "function") throw new TypeError(`${label} must be a function.`);
}

function synchronous(value, label) {
  callable(value, label);
  if (value.constructor?.name === "AsyncFunction") throw new TypeError(`${label} must be synchronous.`);
}

function owner(isParentCurrent = () => true) {
  let closed = false;
  let disposal;
  const resources = new Set();
  const errors = [];
  const current = () => !closed && isParentCurrent();
  const invalidate = () => { closed = true; };
  function track(resource, release) {
    callable(release, "Resource release");
    let released;
    const tracked = current();
    function settled(error) {
      resources.delete(lease);
      // Keep failure evidence, not completed resource/callback ownership.
      if (error && tracked) errors.push(error.reason);
      resource = release = undefined;
    }
    // Memoize before invoking external code, including reentrant release callbacks.
    const lease = Object.freeze({ release() {
      released ??= Promise.resolve().then(() => release(resource)).then(
        (value) => { settled(); return value; },
        (reason) => { settled({ reason }); throw reason; },
      );
      return released;
    } });
    if (tracked) resources.add(lease);
    return lease;
  }
  async function own(resource, release) {
    const lease = track(resource, release);
    if (!current()) await lease.release(); // Late acquisition stays with its old owner.
    return lease;
  }
  function dispose() {
    invalidate();
    disposal ??= Promise.resolve().then(async () => {
      // Reverse acquisition order; attempt each independent release even after failure.
      for (const lease of [...resources].reverse()) {
        try { await lease.release(); } catch { /* track recorded this failure once. */ }
      }
      if (errors.length) throw new AggregateError(errors, "Execution resource cleanup failed.");
    });
    return disposal;
  }
  return { current, invalidate, track, own, dispose };
}

/** Local ownership only. The selected model supplies current context/authorization/ordering. */
export function createExecutionScope({ isApplicable = () => false } = {}) {
  synchronous(isApplicable, "Model applicability");
  const root = owner();
  let boundary = Symbol("execution boundary");
  const tasks = new Set();

  function capture(context) {
    if (!root.current()) throw new Error("Cannot capture a disposed execution.");
    const capturedBoundary = boundary;
    const child = owner(() => root.current() && boundary === capturedBoundary);
    let lease;
    const owned = { invalidate: child.invalidate, dispose() {
      child.invalidate();
      return lease.release();
    } };
    lease = root.track(child, async (ownedTask) => {
      try { await ownedTask.dispose(); } finally { tasks.delete(owned); }
    });
    tasks.add(owned);
    const task = Object.freeze({
      isCurrent: child.current,
      own: child.own,
      dispose: owned.dispose,
      commit(completion, apply) {
        synchronous(apply, "Completion application");
        if (!child.current()) return false;
        const accepted = isApplicable({ context, completion });
        // A policy callback may synchronously change context or dispose this execution.
        if (accepted !== true || !child.current()) return false;
        const result = apply(completion);
        if (result != null && typeof result.then === "function") {
          throw new TypeError("Completion application must not return a promise; commit again after awaiting outside it.");
        }
        return true;
      },
    });
    return task;
  }

  function advance() {
    if (!root.current()) throw new Error("Cannot advance a disposed execution.");
    boundary = Symbol("execution boundary");
    const previous = [...tasks];
    for (const task of previous) task.invalidate();
    return Promise.resolve().then(async () => {
      const errors = [];
      for (const task of previous.reverse()) {
        try { await task.dispose(); } catch (error) { errors.push(error); }
      }
      if (errors.length) throw new AggregateError(errors, "Previous execution context cleanup failed.");
    });
  }

  function dispose() {
    root.invalidate();
    for (const task of tasks) task.invalidate();
    return root.dispose();
  }

  return Object.freeze({ isCurrent: root.current, capture, advance, own: root.own, dispose });
}
