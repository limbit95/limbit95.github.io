import { SESSION_CONTRACT, sessionCommandHash } from "./sessionControl.mjs";

// Internal storage candidate, not an admission endpoint. No driver, connection
// string, network listener, runtime caller, default pool or transport is wired.
// The SQL candidate permits only its installation owner; runtime remains closed.
const leased = new WeakSet();
const text = (value) => typeof value === "string" && value.length > 0;
const queries = {
  ready: "SELECT vnext_private.storage_ready($1,$2,$3,$4,$5,$6,$7,$8,$9) AS value",
  current: "SELECT vnext_private.storage_current($1,$2,$3,$4) AS value",
  status: "SELECT vnext_private.storage_command_status($1,$2,$3,$4,$5,$6,$7,$8) AS value",
};
function abort(signal) { if (signal?.aborted) throw signal.reason ?? new Error("Storage context aborted."); }
function commandData(value) {
  const command = structuredClone(value);
  if (command?.contract !== SESSION_CONTRACT || ![command.id, command.session, command.match, command.subject].every(text)
    || command.kind !== "set-ready" || typeof command.payload?.ready !== "boolean"
    || Object.keys(command.payload).some((key) => key !== "ready")) throw new TypeError("Only a scoped set-ready storage command is implemented.");
  if (command.payloadHash !== sessionCommandHash(command)) throw new TypeError("Command payload hash mismatch.");
  return command;
}
function row(result) {
  if (result?.rows?.length !== 1 || !result.rows[0].value || typeof result.rows[0].value !== "object") {
    throw new Error("Storage primitive returned no unambiguous result.");
  }
  return structuredClone(result.rows[0].value);
}

/** connect must lease one exclusive query()/release(error) client, not pool.query.
 * It is a storage I/O port, never an allow/predicate callback. There is no
 * default authority implementation or runtime installer in this candidate.
 * Query promises must settle before release; abort does not prove rollback/C.
 */
export function createSessionStorage({ connect } = {}) {
  if (typeof connect !== "function") throw new TypeError("An explicit exclusive storage connection lease is required.");
  async function run(sql, params, signal, mutation) {
    abort(signal);
    const client = await connect();
    if (!client || (typeof client !== "object" && typeof client !== "function")
      || typeof client.release !== "function") throw new TypeError("Invalid exclusive storage lease.");
    // A broken lease provider must not release someone else's active client.
    if (leased.has(client)) throw new Error("Storage connection is already leased.");
    leased.add(client);
    let began = false;
    let commitStarted = false;
    let confirmed = false;
    let failure;
    let outcome;
    try {
      if (typeof client.query !== "function") throw new TypeError("Storage client requires query().");
      abort(signal);
      await client.query("BEGIN ISOLATION LEVEL READ COMMITTED");
      began = true;
      abort(signal);
      const value = row(await client.query(sql, params));
      abort(signal);
      commitStarted = true;
      const receipt = await client.query("COMMIT");
      if (receipt?.command !== "COMMIT") throw new Error("No positive COMMIT confirmation.");
      confirmed = true;
      outcome = signal?.aborted
        ? { outcome: "STORAGE_COMMIT_CONFIRMED_CONTEXT_CLOSED" }
        : { outcome: mutation ? "STORAGE_COMMIT_CONFIRMED" : "STORAGE_READ_CONFIRMED", value };
    } catch (error) {
      failure = error;
      if (commitStarted && !confirmed) {
        // Never auto-replay or report rollback after a possibly committed call.
        outcome = { outcome: "UNKNOWN", error };
      } else if (began) {
        try { await client.query("ROLLBACK"); }
        catch (cleanupError) { failure = new AggregateError([error, cleanupError], "Storage failure and rollback failure."); }
      }
    } finally {
      // Even a successful rollback after an error discards the suspect lease.
      try { await client.release(failure); }
      catch (cleanupError) {
        if (outcome) outcome.cleanupError = cleanupError;
        else failure = new AggregateError(failure ? [failure, cleanupError] : [cleanupError], "Storage cleanup failed.");
      } finally { leased.delete(client); }
    }
    // release itself may await; a context invalidated there must not receive a
    // late projection/receipt value either. A confirmed commit is not undone.
    if (confirmed && signal?.aborted) return {
      outcome: "STORAGE_COMMIT_CONFIRMED_CONTEXT_CLOSED",
      ...(outcome?.cleanupError ? { cleanupError: outcome.cleanupError } : {}),
    };
    if (outcome) return outcome;
    throw failure;
  }
  return Object.freeze({
    async applyReady({ command: input, owner, expectedRevision, signal } = {}) {
      const command = commandData(input);
      if (!text(owner) || !Number.isSafeInteger(expectedRevision) || expectedRevision < 0) throw new TypeError("Expected owner/revision required.");
      return run(queries.ready, [command.contract, command.session, command.match, command.subject,
        command.id, command.payloadHash, command.payload.ready, owner, expectedRevision], signal, true);
    },
    async readCurrent({ session, match, subject, owner, signal } = {}) {
      if (![session, match, subject, owner].every(text)) throw new TypeError("Storage projection scope required.");
      return run(queries.current, [session, match, subject, owner], signal, false);
    },
    async readCommandStatus({ command: input, owner, signal } = {}) {
      const command = commandData(input);
      if (!text(owner)) throw new TypeError("Current storage owner required.");
      return run(queries.status, [command.contract, command.session, command.match, command.subject,
        command.id, command.payloadHash, command.payload.ready, owner], signal, false);
    },
  });
}
