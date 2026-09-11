function normalizePresenters(presenters) {
  const entries = presenters instanceof Map
    ? [...presenters.entries()]
    : Object.entries(presenters ?? {});
  const registry = new Map();

  for (const [eventType, presenter] of entries) {
    if (typeof presenter !== "function") {
      throw new TypeError(`Presentation handler for ${eventType} must be a function.`);
    }
    registry.set(eventType, presenter);
  }

  return registry;
}

export function createAnimationDirector({ presenters = {} } = {}) {
  const registry = normalizePresenters(presenters);

  return Object.freeze({
    handles(eventType) {
      return registry.has(eventType);
    },

    createTask(event, context = {}) {
      const presenter = registry.get(event?.type);
      if (!presenter) return null;
      return () => presenter(event, context);
    },
  });
}

export function createAnimationQueue({ onTaskError = null } = {}) {
  let tail = Promise.resolve();
  let pendingCount = 0;

  function enqueue(task, metadata = {}) {
    if (typeof task !== "function") {
      throw new TypeError("Animation queue task must be a function.");
    }

    pendingCount += 1;
    const run = async () => {
      try {
        return await task();
      } catch (error) {
        try {
          onTaskError?.(error, metadata);
        } catch {
          // Presentation diagnostics must never turn a visual failure into gameplay failure.
        }
        return undefined;
      } finally {
        pendingCount -= 1;
      }
    };

    const next = tail.then(run, run);
    tail = next;
    return next;
  }

  async function drain() {
    await tail;
  }

  return Object.freeze({
    enqueue,
    drain,
    get size() {
      return pendingCount;
    },
  });
}
