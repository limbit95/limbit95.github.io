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
  const resources = [];
  const current = () => !closed && isParentCurrent();
  const invalidate = () => { closed = true; };
  async function own(resource, release) {
    callable(release, "Resource release");
    let released;
    // Memoize before invoking external code, including reentrant release callbacks.
    const lease = Object.freeze({ release() {
      released ??= Promise.resolve().then(() => release(resource));
      return released;
    } });
    if (current()) resources.push(lease);
    else await lease.release(); // Late acquisition belongs to this old owner, never a new one.
    return lease;
  }
  function dispose() {
    invalidate();
    disposal ??= Promise.resolve().then(async () => {
      const errors = [];
      // Reverse acquisition order; attempt each independent release even after failure.
      while (resources.length) {
        try { await resources.pop().release(); } catch (error) { errors.push(error); }
      }
      if (errors.length) throw new AggregateError(errors, "Execution resource cleanup failed.");
    });
    return disposal;
  }
  return { current, invalidate, own, dispose };
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
    const task = Object.freeze({
      isCurrent: child.current,
      own: child.own,
      dispose: child.dispose,
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
    tasks.add(child);
    // Internal resource registration is synchronous before own's first possible await.
    void root.own(child, (ownedTask) => ownedTask.dispose());
    return task;
  }

  function advance() {
    if (!root.current()) throw new Error("Cannot advance a disposed execution.");
    boundary = Symbol("execution boundary");
    const previous = [...tasks];
    tasks.clear();
    for (const task of previous) task.invalidate();
    return Promise.allSettled(previous.map((task) => task.dispose())).then((results) => {
      const errors = results.filter((row) => row.status === "rejected").map((row) => row.reason);
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
