import pg from "pg";

// Private I/O only. No listener, authority check, SQL install, default config,
// pool, retry, or native client sender. One fresh pg.Client per lease; never reuse.
const claimedClients = new WeakSet();
const required = ["host", "port", "database", "user", "password", "ssl"];
function fault(code, message) { return Object.assign(new Error(message), { code }); }
function duration(value, name) {
  if (!Number.isSafeInteger(value) || value < 1 || value > 2_147_483_647) throw new TypeError(`${name} must be an explicit positive duration.`);
  return value;
}
function configOf(config) {
  if (!config || Object.getPrototypeOf(config) !== Object.prototype
    || Object.keys(config).some((key) => !required.includes(key))
    || required.some((key) => !Object.hasOwn(config, key))) throw new TypeError("Explicit host/port/database/user/password/ssl only; no environment or URL defaults.");
  if (!["host", "database", "user", "password"].every((key) => typeof config[key] === "string" && config[key].length)
    || !Number.isInteger(config.port) || config.port < 1 || config.port > 65535
    || !(config.ssl === false || (config.ssl && config.ssl.rejectUnauthorized === true))) throw new TypeError("Invalid explicit PG connection configuration.");
  // Disable driver query timeout: promise rejection alone need not end wire work.
  return { ...structuredClone(config), query_timeout: 0, connectionTimeoutMillis: 0,
    pipeline: false, sslnegotiation: "postgres",
    application_name: "vnext-private-lease-candidate" };
}

/** Client injection is a driver test port, not an allow/predicate callback.
 * signal closes local I/O; it never proves DB cancellation/rollback or C recovery.
 * Client.end confirmation means local driver teardown, not database outcome.
 */
export function createPgLeaseSource({ config, connectTimeoutMs, queryTimeoutMs, cleanupTimeoutMs, Client = pg.Client } = {}) {
  const settings = configOf(config);
  const connectLimit = duration(connectTimeoutMs, "connectTimeoutMs");
  const queryLimit = duration(queryTimeoutMs, "queryTimeoutMs");
  const cleanupLimit = duration(cleanupTimeoutMs, "cleanupTimeoutMs");
  if (typeof Client !== "function") throw new TypeError("PG Client constructor required.");
  const checkEnvironment = () => {
    if (Object.keys(process.env).some((key) => key.startsWith("PG"))) throw new TypeError("PG environment defaults are not accepted; supply explicit config.");
  };
  checkEnvironment();
  let stopped = false;
  let sequence = 0;
  const active = new Set();
  const trace = [];
  const quarantined = new Set();
  let droppedEvents = 0;
  const emit = (id, event) => {
    if (trace.length === 256) { trace.shift(); droppedEvents++; }
    trace.push(Object.freeze({ lease: id, event, at: performance.now() }));
  };
  async function connect({ signal } = {}) {
    if (stopped || signal?.aborted) throw fault("LEASE_CONTEXT_CLOSED", "Storage I/O context closed.");
    checkEnvironment();
    const raw = new Client(structuredClone(settings));
    if (!raw || typeof raw.connect !== "function" || typeof raw.query !== "function" || typeof raw.end !== "function"
      || typeof raw.on !== "function") throw new TypeError("Invalid PG client.");
    // A broken provider must not close another operation's client.
    if (claimedClients.has(raw)) throw fault("LEASE_ALREADY_CLAIMED", "PG client identity was already claimed.");
    claimedClients.add(raw);
    const id = ++sequence;
    let closing;
    let released = false;
    let poisoned = false;
    let inFlight = false;
    let interrupt;
    let closeError;
    const record = { stop };
    active.add(record);
    emit(id, "created");

    function shutdown() {
      if (closing) return closing;
      poisoned = true;
      emit(id, "close-start");
      closing = new Promise((resolve, reject) => {
        let done = false;
        const finish = (error) => {
          if (done) return;
          done = true;
          clearTimeout(timer);
          signal?.removeEventListener("abort", onAbort);
          active.delete(record);
          if (error) { quarantined.add(id); closeError = fault("LEASE_CLOSE_UNCONFIRMED", "Driver cleanup was not confirmed; client remains quarantined."); emit(id, "close-unconfirmed"); reject(closeError); }
          else { emit(id, "driver-end-confirmed"); resolve(); }
        };
        const timer = setTimeout(() => finish(true), cleanupLimit);
        Promise.resolve().then(() => raw.end()).then(() => finish(), () => finish(true));
      });
      // Keep driver error listener attached: late errors must remain observed.
      closing.catch(() => {});
      return closing;
    }
    function stop(error = fault("LEASE_CONTEXT_CLOSED", "Storage I/O context closed.")) {
      poisoned = true;
      if (interrupt) interrupt(error);
      return shutdown();
    }
    function onAbort() { stop(fault("LEASE_CONTEXT_CLOSED", "Storage I/O context closed.")).catch(() => {}); }
    raw.on("error", () => { emit(id, "driver-error"); stop(fault("LEASE_DRIVER_ERROR", "PG driver error; client quarantined.")).catch(() => {}); });
    signal?.addEventListener("abort", onAbort, { once: true });

    async function perform(work, limit, phase) {
      if (poisoned || released || stopped || signal?.aborted) throw fault("LEASE_CONTEXT_CLOSED", "Storage I/O context closed.");
      if (inFlight) throw fault("LEASE_BUSY", "Only one query may own this lease.");
      inFlight = true;
      emit(id, `${phase}-start`);
      try {
        return await new Promise((resolve, reject) => {
          let done = false;
          const fail = (error) => {
            if (done) return;
            done = true;
            clearTimeout(timer);
            interrupt = undefined;
            poisoned = true;
            // Never return a timed-out wire operation to a pool. There is no pool;
            // wait for teardown or report unconfirmed quarantine, never rollback.
            shutdown().then(() => reject(error), (cleanup) => reject(new AggregateError([error, cleanup], "I/O and driver cleanup failed.")));
          };
          interrupt = fail;
          const timer = setTimeout(() => { emit(id, `${phase}-timeout`); fail(fault("LEASE_IO_TIMEOUT", "PG I/O deadline exceeded; DB outcome is not inferred.")); }, limit);
          Promise.resolve().then(() => {
            if (done) return;
            return work();
          }).then((value) => {
            if (done) { emit(id, `${phase}-late`); return; }
            if (signal?.aborted || stopped) { fail(fault("LEASE_CONTEXT_CLOSED", "Storage I/O context closed.")); return; }
            done = true;
            clearTimeout(timer);
            interrupt = undefined;
            emit(id, `${phase}-complete`);
            resolve(value);
          }, fail);
        });
      } finally { inFlight = false; }
    }

    try {
      await perform(() => raw.connect(), connectLimit, "connect");
      if (poisoned || stopped || signal?.aborted) throw fault("LEASE_CONTEXT_CLOSED", "Storage I/O context closed.");
    }
    catch (error) { await shutdown().catch(() => {}); throw error; }
    return Object.freeze({
      async query(sql, params) {
        if (typeof sql !== "string") throw new TypeError("SQL text required.");
        return perform(() => raw.query(sql, params), queryLimit, "query");
      },
      async release(error) {
        if (released) { if (closeError) throw closeError; return closing; }
        released = true;
        emit(id, error ? "release-error" : "release");
        await stop(fault("LEASE_RELEASED", "Lease released while I/O was pending."));
      },
    });
  }
  return Object.freeze({
    connect,
    async close() {
      stopped = true;
      const outcomes = await Promise.allSettled([...active].map((record) => record.stop()));
      const errors = outcomes.filter((item) => item.status === "rejected").map((item) => item.reason);
      if (quarantined.size && !errors.length) errors.push(fault("LEASE_CLOSE_UNCONFIRMED", "Quarantined driver cleanup remains unconfirmed."));
      if (errors.length) throw new AggregateError(errors, "One or more driver teardowns remain unconfirmed.");
    },
    // No SQL, params, credentials, or driver error payloads enter this trace.
    inspect: () => Object.freeze({ stopped, active: active.size, quarantined: quarantined.size, droppedEvents, events: Object.freeze([...trace]) }),
  });
}
