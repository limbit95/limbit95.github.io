import { createExecutionScope } from "../core/executionScope.js";

const CONTRACT = "GP-COOP-SESSION/1";
const CONTEXT_KEYS = ["session", "match", "user", "view", "role"];
const text = (value) => typeof value === "string" && value.length > 0;
function copy(value) {
  const result = JSON.parse(canonical(value));
  function freeze(item) {
    if (item && typeof item === "object") { Object.values(item).forEach(freeze); Object.freeze(item); }
    return item;
  }
  return freeze(result);
}
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && Object.getPrototypeOf(value) === Object.prototype) return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  if (value === null || ["string", "boolean"].includes(typeof value) || (typeof value === "number" && Number.isFinite(value))) return JSON.stringify(value);
  throw new TypeError("Finite JSON data required.");
}
const sameContext = (a, b) => CONTEXT_KEYS.every((key) => a?.[key] === b?.[key]);
const executionIdentity = (context) => canonical([context.session, context.match]);

/** Candidate client ownership only. readCurrent must eventually be a trusted backend projection.
 * No Auth, native P, wire adapter, Registry admission or production model registration is supplied.
 * Notifications invalidate; only a fresh full read can become current state.
 */
export function createCoopSession({ readCurrent, observe, submitCommand, readCommandStatus,
  onState = () => {}, quietMs, timeoutMs, maxRefreshes = 8, maxCommands = 64,
  timers = globalThis } = {}) {
  for (const fn of [readCurrent, observe, onState]) if (typeof fn !== "function") throw new TypeError("Current-state reader, observer and synchronous state consumer are required.");
  if (onState.constructor?.name === "AsyncFunction") throw new TypeError("State consumer must be synchronous.");
  for (const n of [quietMs, timeoutMs, maxRefreshes, maxCommands]) if (!Number.isSafeInteger(n) || n <= 0) throw new TypeError("Explicit positive timing/bounds are required.");
  let closed = false;
  let generation = 0;
  let current;
  let status = Object.freeze({ phase: "DETACHED", snapshot: null, error: null });
  let disposal;
  let notifying = false;
  // A terminal execution cannot reopen through view/user/owner reconnection.
  // Instance-local tombstones only; no durable backend/admission guarantee.
  const terminalExecutions = new Set();
  function notify() {
    if (notifying) return true;
    const before = generation;
    notifying = true;
    try {
      const result = onState(status);
      if (result && typeof result.then === "function") {
        Promise.resolve(result).catch(() => {}); // Observe failure; asynchronous state consumers remain unsupported.
        throw new TypeError("State consumer must not return a promise.");
      }
      return true;
    } catch (error) {
      if (before === generation && !closed) status = Object.freeze({
        phase: current?.terminal ? "TERMINAL" : "DEGRADED", snapshot: current?.terminal ? status.snapshot : null, error });
      return false;
    } finally { notifying = false; }
  }
  const scope = createExecutionScope({ isApplicable: ({ context }) => !closed && current === context && context.generation === generation });
  function publish(phase, snapshot = null, error = null) {
    status = Object.freeze({ phase, snapshot, error });
    notify(); // No model application writes after calling external code.
  }
  const active = (run) => !closed && current === run && run.task.isCurrent();
  function block(run, reason) {
    if (active(run) && !run.terminal) publish("RECOVERING", null, reason);
  }
  function reject(run, error) {
    if (active(run) && !run.terminal) publish("DEGRADED", null, error);
  }
  async function call(run, invoke) {
    const abort = new AbortController();
    const lease = await run.task.own(abort, (controller) => controller.abort());
    if (!active(run)) return undefined;
    let timer;
    let abortListener;
    try {
      const cancelled = new Promise((_, fail) => {
        abortListener = () => fail(new Error("Session request invalidated."));
        abort.signal.addEventListener("abort", abortListener, { once: true });
        timer = timers.setTimeout(() => fail(new Error("Session request timeout.")), timeoutMs);
      });
      // Promise.race observes late rejection too; late resolution never adopts directly.
      return await Promise.race([Promise.resolve().then(() => invoke(abort.signal)), cancelled]);
    } finally {
      timers.clearTimeout(timer);
      abort.signal.removeEventListener("abort", abortListener);
      await lease.release();
    }
  }
  function snapshot(run, value) {
    if (value?.contract !== CONTRACT || !sameContext(value.context, run.context)
      || !text(value.owner) || !text(value.stream) || !Number.isSafeInteger(value.revision) || value.revision < 0
      || typeof value.terminal !== "boolean" || !value.state || typeof value.state !== "object") {
      throw new Error("Invalid current-state scope/revision.");
    }
    const next = copy(value);
    const fingerprint = canonical(next);
    const old = run.last;
    if (old) {
      if (next.owner !== old.value.owner || next.stream !== old.value.stream) throw new Error("Owner/stream changed; activate a new current context.");
      if (next.revision < old.value.revision) throw new Error("Current-state revision regressed.");
      if (next.revision === old.value.revision && fingerprint !== old.fingerprint) throw new Error("Conflicting content at the same revision.");
      if (next.revision === old.value.revision) return old; // Revalidation keeps the same adopted value identity.
    }
    return { value: next, fingerprint };
  }
  function reconcile(reason = "current") {
    const run = current;
    if (!run || !active(run) || run.terminal) return Promise.resolve(false);
    run.ticket += 1;
    block(run, reason);
    if (!active(run)) return Promise.resolve(false); // onState may reenter/dispose.
    if (run.refresh) return run.refresh;
    run.refresh = Promise.resolve().then(async () => {
      try {
        await call(run, () => run.ready);
        for (let attempt = 0; active(run) && attempt < maxRefreshes; attempt += 1) {
          const ticket = run.ticket;
          const value = await call(run, (signal) => readCurrent(run.context, { signal }));
          if (!active(run)) return false;
          if (ticket !== run.ticket) continue; // An invalidation during the read requires another read.
          const next = snapshot(run, value);
          const applied = run.task.commit(next, () => {
            run.last = next;
            run.terminal = next.value.terminal;
            if (run.terminal) terminalExecutions.add(run.execution);
            status = Object.freeze({ phase: run.terminal ? "TERMINAL" : "LIVE", snapshot: next.value, error: null });
          });
          if (applied && active(run)) {
            const notified = notify();
            if (run.terminal) {
              await run.task.dispose();
              return notified && !closed && current === run;
            }
            if (!notified || !active(run)) return false;
            // A synchronous consumer may invalidate after adoption. The same
            // bounded owner must drain that ticket before reporting readiness.
            if (ticket !== run.ticket) continue;
            return status.phase === "LIVE";
          }
          return false;
        }
        if (active(run)) throw new Error("Current-state invalidation overflow.");
        return false;
      } catch (error) { reject(run, error); return false; }
      finally { run.refresh = null; }
    });
    return run.refresh;
  }
  async function activate(context) {
    if (closed) throw new Error("Session model disposed.");
    if (!CONTEXT_KEYS.every((key) => text(context?.[key]))) throw new TypeError("Explicit session/match/user/view/role context required.");
    const execution = executionIdentity(context);
    if (terminalExecutions.has(execution)) throw new Error("Terminal execution cannot be activated again in this model instance.");
    generation += 1;
    const cleanup = scope.advance(); // Synchronous invalidation; independent old cleanup is awaited/observed.
    const run = { generation, execution, context: copy(context), ticket: 0, refresh: null, last: null, terminal: false, commands: new Map() };
    current = run;
    run.task = scope.capture(run);
    run.ready = Promise.resolve().then(async () => {
      const stop = await observe(run.context, () => { if (active(run)) void reconcile("notification"); });
      if (typeof stop !== "function") throw new TypeError("Observer must return its own disposer.");
      await run.task.own(stop, (release) => release()); // Late observer acquisition is released by its old owner.
      if (!active(run)) throw new Error("Observer acquired for an old context.");
      const timer = timers.setInterval(() => { if (active(run)) void reconcile("quiet"); }, quietMs);
      await run.task.own(timer, (id) => timers.clearInterval(id));
    });
    // Observe rejection immediately, including cleanup failure, while initial read waits for readiness.
    const result = reconcile("initial");
    try { await cleanup; } catch (error) { reject(run, error); throw error; }
    return result;
  }
  async function command(input, lookup = false) {
    const run = current;
    if (!run || !active(run) || run.terminal) throw new Error("No current command context.");
    if (!text(input?.id) || !text(input?.payloadHash) || !input.payload) throw new TypeError("Command ID/hash/payload required.");
    const identity = canonical(copy(input));
    let entry = run.commands.get(input.id);
    if (entry && entry.identity !== identity) throw new Error("Command identity/hash conflict.");
    if (entry?.pending) return entry.pending;
    if (!lookup && entry) throw new Error("Existing command requires same-ID status lookup; no automatic replay.");
    if (!lookup && status.phase !== "LIVE") throw new Error("Protected commands require current state.");
    if (!entry) {
      if (lookup) throw new Error("No retained command identity.");
      if (run.commands.size >= maxCommands) throw new Error("Command ledger bound reached; reconcile explicitly.");
      entry = { identity, input: copy(input), pending: null };
      run.commands.set(input.id, entry);
    }
    const invoke = lookup ? readCommandStatus : submitCommand;
    if (typeof invoke !== "function") throw new Error("Command transport/status lookup unimplemented.");
    block(run, lookup ? "command-status" : "command");
    if (!active(run)) throw new Error("Command context invalidated.");
    entry.pending = (async () => {
      let receipt;
      try {
        receipt = await call(run, (signal) => invoke(run.context, entry.input, { signal }));
        if (!active(run)) return { outcome: "OLD_CONTEXT" };
        // An ACK is never state, C, P or an adoption permit.
        return { outcome: "RESPONSE", receipt: copy(receipt) };
      } catch (error) {
        if (active(run)) reject(run, error);
        return { outcome: "UNKNOWN", error };
      } finally {
        entry.pending = null;
        if (active(run)) await reconcile("command-current");
      }
    })();
    return entry.pending;
  }
  function dispose() {
    if (disposal) return disposal;
    closed = true; generation += 1;
    terminalExecutions.clear();
    disposal = scope.dispose();
    status = Object.freeze({ phase: "DISPOSED", snapshot: null, error: null });
    return disposal;
  }
  return Object.freeze({ activate, reconcile, submit: (input) => command(input),
    lookupCommand: (input) => command(input, true), getState: () => status, dispose });
}
