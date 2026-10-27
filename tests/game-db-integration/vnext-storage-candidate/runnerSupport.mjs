// TEST ONLY. No driver/default config, sockets, authority or SQL installation on import.
import assert from "node:assert/strict";

export const inconclusive = (reason) => Object.assign(new Error(reason), { code: "ORACLE_INCONCLUSIVE" });
const codes = (e) => Array.isArray(e?.errors) ? e.errors.flatMap(codes) : [e?.code ?? "UNCLASSIFIED"];
export function expectedSqlstate(error, expected) {
  const leaves = codes(error);
  // The storage wrapper may try ROLLBACK on a lease already discarded after SQL error.
  // Transport/timeout/cleanup-unconfirmed errors never count as expected rejection.
  return leaves.includes(expected) && leaves.every((code) => code === expected || code === "LEASE_CONTEXT_CLOSED");
}
export async function expectSqlstate(work, expected) {
  try { await work(); } catch (error) {
    if (!expectedSqlstate(error, expected)) throw inconclusive("Expected SQLSTATE was not unambiguously observed.");
    return { status: "rejected", sqlstate: expected };
  }
  throw Object.assign(new Error("Expected storage rejection did not occur."), { code: "ORACLE_ASSERTION" });
}
export function recorded(value, command) {
  assert.equal(value?.outcome, "RECORDED");
  for (const key of ["id", "session", "match", "subject"]) assert.equal(value[key], command[key]);
  assert.equal(value.payloadHash, command.payloadHash);
  assert.equal(value.owner, "o"); assert.equal(value.stream, "stream"); assert.equal(value.revision, 1);
  return value;
}
export function judgeCompetition({ blocked, winner, loser, winnerCommand, loserCommand, cut, winnerStatus, loserStatus }) {
  if (!blocked) throw inconclusive("Actual competing lock wait was not observed.");
  assert.notEqual(winnerCommand.id, loserCommand.id);
  assert.equal(winner?.outcome, "STORAGE_COMMIT_CONFIRMED");
  recorded(winner.value, winnerCommand);
  if (loser?.status !== "rejected" || !expectedSqlstate(loser.reason, "40001")) throw inconclusive("Revision conflict was not observed.");
  assert.deepEqual(cut, { revision: 1, ready: true, commands: 1 });
  recorded(winnerStatus, winnerCommand);
  assert.equal(loserStatus?.outcome, "UNKNOWN");
  assert.equal(loserStatus.id, loserCommand.id); assert.equal(loserStatus.payloadHash, loserCommand.payloadHash);
}

// A local watchdog is not proof of server cancellation/rollback/backend termination.
// Deadline expiry poisons this owner's raw client and requests bounded local end.
export function ownRawClient(raw, { id, connectMs, queryMs, cleanupMs, emit = () => {} }) {
  let closing, poisoned = false, busy = false, interrupt;
  const state = { id, backendPid: null, teardown: "NOT_REQUESTED", poisoned: false, late: 0 };
  const event = (phase, values = {}) => emit("raw-io", { raw: id, backendPid: state.backendPid, phase, ...values });
  function end() {
    if (closing) return closing;
    poisoned = state.poisoned = true; state.teardown = "PENDING";
    const pendingInterrupt = interrupt;
    event("end-dispatch");
    closing = new Promise((resolve, reject) => {
      let done = false;
      const finish = (ok) => {
        if (done) { state.late++; event("end-late"); return; }
        done = true; clearTimeout(timer);
        state.teardown = ok ? "LOCAL_END_CONFIRMED" : "UNCONFIRMED";
        event(ok ? "end-response" : "end-unconfirmed");
        if (ok) resolve(); else reject(inconclusive("Raw connection teardown unconfirmed."));
      };
      const timer = setTimeout(() => finish(false), cleanupMs);
      Promise.resolve().then(() => raw.end()).then(() => finish(true), () => finish(false));
    });
    closing.catch(() => {});
    pendingInterrupt?.(inconclusive("Raw connection owner closed."));
    return closing;
  }
  async function perform(work, ms, phase) {
    if (poisoned) throw inconclusive("Raw connection cannot be reused.");
    if (busy) throw new Error("Raw connection already has an owner operation.");
    busy = true; event(`${phase}-dispatch`);
    try {
      return await new Promise((resolve, reject) => {
        let done = false;
        const failClosed = (reason) => {
          if (done) return;
          done = true; clearTimeout(timer); interrupt = undefined;
          poisoned = state.poisoned = true;
          end().then(() => reject(reason), () => reject(inconclusive("Raw I/O and teardown unconfirmed.")));
        };
        interrupt = failClosed;
        const timer = setTimeout(() => { event(`${phase}-deadline`); failClosed(inconclusive("Raw I/O deadline; database outcome unconfirmed.")); }, ms);
        Promise.resolve().then(() => { if (!done) return work(); }).then((value) => {
          if (done) { state.late++; event(`${phase}-late`); return; }
          done = true; clearTimeout(timer); interrupt = undefined; event(`${phase}-response`); resolve(value);
        }, (error) => {
          if (done) { state.late++; event(`${phase}-late-error`); return; }
          // SQL responses are settled driver work; explicit owner may ROLLBACK.
          // Non-SQL/connection failures are never reusable.
          if (error?.severity !== "ERROR" || !/^[0-9A-Z]{5}$/.test(error?.code ?? "") || error.code.startsWith("08")) { failClosed(inconclusive("Raw transport failed.")); return; }
          done = true; clearTimeout(timer); interrupt = undefined;
          event(`${phase}-sql-error`, { sqlstate: error.code }); reject(error);
        });
      });
    } finally { busy = false; }
  }
  raw.on("error", () => { event("driver-error"); end().catch(() => {}); });
  return Object.freeze({
    connect: () => perform(() => raw.connect(), connectMs, "connect"),
    query(sql, params, { timeoutMs = queryMs } = {}) {
      // Fixed phase names only; never put caller SQL/params into evidence.
      const phase = sql === "COMMIT" ? "commit" : sql === "ROLLBACK" ? "rollback" : sql.startsWith("BEGIN") ? "begin"
        : sql.includes("CREATE SCHEMA vnext_private") ? "install" : sql.startsWith("COMMENT ON SCHEMA") ? "marker"
        : sql.startsWith("DROP SCHEMA") ? "schema-drop" : sql.includes("storage_ready(") ? "ready"
        : sql.includes("storage_command_status(") ? "status" : sql.includes("storage_current(") ? "current" : "query";
      return perform(() => raw.query(sql, params), Math.max(1, Math.min(queryMs, timeoutMs)), phase);
    },
    end,
    identify(pid) { assert.ok(Number.isInteger(pid)); state.backendPid = pid; event("backend-identified"); },
    inspect: () => ({ ...state }),
  });
}

export async function pollObservation(read, observeMs) {
  const until = performance.now() + observeMs;
  do {
    const remaining = until - performance.now();
    if (remaining <= 0) break;
    // read must forward remaining to its owned raw query's local deadline.
    const value = await read(remaining);
    if (value) return value;
    await new Promise((resolve) => setTimeout(resolve, Math.min(10, Math.max(0, until - performance.now()))));
  } while (performance.now() < until);
  throw inconclusive("Observation budget exhausted.");
}

// Test relay lifecycle only. Inventory the owner BEFORE starting async listen.
// A late-created relay is closed by this owner, not abandoned or reassigned.
export function ownResource(start, { id, startMs, endMs, emit = () => {} }) {
  let resource, opening, ending, stopped = false;
  const state = { id, startup: "NOT_REQUESTED", teardown: "NOT_REQUESTED", late: 0 };
  function bounded(work, ms, phase, late) {
    state[phase] = "PENDING";
    return new Promise((resolve, reject) => {
      let done = false;
      const timer = setTimeout(() => { done = true; state[phase] = "UNCONFIRMED"; emit("resource-deadline", { id, phase }); reject(inconclusive("Relay lifecycle unconfirmed.")); }, ms);
      Promise.resolve().then(work).then((value) => {
        if (done) { state.late++; emit("resource-late", { id, phase }); late?.(value); return; }
        done = true; clearTimeout(timer); state[phase] = "LOCAL_CONFIRMED"; resolve(value);
      }, () => {
        if (done) { state.late++; return; }
        done = true; clearTimeout(timer); state[phase] = "UNCONFIRMED"; reject(inconclusive("Relay lifecycle failed."));
      });
    });
  }
  function end(value) {
    if (!ending) ending = bounded(() => value.close(), endMs, "teardown");
    ending.catch(() => {}); return ending;
  }
  return {
    open() {
      if (stopped) return Promise.reject(inconclusive("Relay owner closed."));
      if (!opening) {
        state.startup = "PENDING";
        opening = bounded(start, startMs, "startup", (value) => { resource = value; end(value).catch(() => {}); })
          .then(async (value) => { resource = value; if (stopped) { await end(value); throw inconclusive("Late relay context closed."); } return value; });
      }
      return opening;
    },
    close() {
      stopped = true;
      if (!resource) { state.teardown = "UNCONFIRMED"; return Promise.reject(inconclusive("Relay creation/cleanup inventory unconfirmed.")); }
      return end(resource);
    },
    inspect: () => ({ ...state }),
  };
}

export const installState = () => ({ dispatched: false, successResponse: false, rollbackResponse: false, markerDispatched: false, markerResponse: false, presence: "NOT_OBSERVED", ownership: "UNCONFIRMED" });
export async function installOriginal(state, client, sql, markerSql) {
  state.dispatched = true;
  let response;
  try { response = await client.query(sql); }
  catch (error) {
    // Diagnostic only. ROLLBACK is never proof that an earlier COMMIT did not occur.
    try { state.rollbackResponse = (await client.query("ROLLBACK"))?.command === "ROLLBACK"; } catch {}
    throw error;
  }
  assert.equal((Array.isArray(response) ? response.at(-1) : response)?.command, "COMMIT");
  state.successResponse = true;
  state.markerDispatched = true;
  await client.query(markerSql); state.markerResponse = true;
}
export async function cleanupSchema(state, { observe, drop, marker }) {
  if (!state.dispatched) return { status: "NOT_CREATED_BY_RUN" };
  try {
    const found = await observe();
    state.presence = found ? "PRESENT" : "ABSENT";
    // An absent schema while an unconfirmed installer could still act is not cleanup proof.
    if (!state.successResponse) throw inconclusive("Install outcome remains unconfirmed; external owner must resolve inventory.");
    if (!found) return { status: "ABSENCE_OBSERVED" };
    if (!state.markerDispatched || found.marker !== marker) throw inconclusive("Schema ownership unconfirmed; no DROP authorized.");
    state.ownership = "EXACT_RUN_MARKER_OBSERVED";
    await drop(found.oid);
    if (await observe()) throw inconclusive("Schema absence not observed after DROP.");
    state.presence = "ABSENT";
    return { status: "OWNED_SCHEMA_REMOVED_ABSENCE_OBSERVED" };
  } catch { return { status: "INCONCLUSIVE", remaining: "schema-or-install-outcome; EXTERNAL_OWNER_REQUIRED" }; }
}

const scopeOf = (c) => c ? Object.fromEntries(["contract", "session", "match", "subject", "id", "payloadHash"].map((k) => [k, c[k]])) : null;
export function sourceEvidence(emit = () => {}) {
  const entries = [];
  function track(source, { scenario, command } = {}) {
    const entry = { source: `source-${entries.length + 1}`, scenario, command: scopeOf(command), leases: [], diagnostics: null, close: "NOT_REQUESTED" };
    entries.push(entry);
    let closing;
    function capture() { entry.diagnostics = source.inspect(); return entry.diagnostics; }
    const tracked = {
      async connect(options) {
        const before = source.inspect().events.filter((e) => e.event === "created").at(-1)?.lease;
        const pending = source.connect(options);
        const created = source.inspect().events.filter((e) => e.event === "created").at(-1)?.lease;
        const leaseId = created !== before ? created : null;
        const record = { lease: leaseId, backendPid: null }; entry.leases.push(record);
        let lease;
        try {
          lease = await pending;
          const pid = (await lease.query("SELECT pg_backend_pid() pid")).rows[0].pid;
          assert.ok(Number.isInteger(pid)); record.backendPid = pid;
          emit("lease-backend", { source: entry.source, scenario, command: entry.command, ...record });
          return lease;
        } catch (error) { if (lease) await lease.release(error).catch(() => {}); throw error; }
        finally { capture(); }
      },
      close() {
        if (!closing) closing = (async () => {
          try { await source.close(); entry.close = "LOCAL_END_CONFIRMED"; }
          catch (error) { entry.close = "UNCONFIRMED"; throw error; }
          finally { capture(); }
          if (entry.diagnostics.droppedEvents || entry.diagnostics.quarantined || entry.leases.some((l) => l.lease === null)) throw inconclusive("Source trace incomplete or cleanup unconfirmed.");
        })();
        return closing;
      },
      capture,
    };
    entry.capture = capture;
    return tracked;
  }
  return { track, snapshot: () => entries.map((item) => { item.capture(); const { capture, ...entry } = item; return structuredClone(entry); }) };
}
