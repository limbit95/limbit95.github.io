import { createHash } from "node:crypto";

export const SESSION_CONTRACT = "GP-COOP-SESSION/1";
const text = (value) => typeof value === "string" && value.length > 0;
function canonical(value) {
  if (value === null || typeof value === "boolean" || typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" && Number.isFinite(value)) return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && Object.getPrototypeOf(value) === Object.prototype) {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  throw new TypeError("Command data must be finite JSON.");
}
/** Hash is scoped to command meaning, not client-supplied property order. */
export function sessionCommandHash(command) {
  return createHash("sha256").update(canonical({ contract: command.contract, session: command.session,
    match: command.match, subject: command.subject, kind: command.kind, payload: command.payload })).digest("hex");
}

/** Pure server-side write proposal. This is NOT actual admission, A, C, a durable ledger or P.
 * A future trusted finalizer must verify caller/current predicate after locks in its actual PG transaction,
 * enforce command ID/hash uniqueness and owner fencing, then store and observe actual commit.
 */
export function prepareSessionCommand(state, command) {
  if (command?.contract !== SESSION_CONTRACT || !text(command.id) || !text(command.subject)
    || !text(state?.owner) || !Number.isSafeInteger(state.revision) || state.revision < 0
    || !Array.isArray(state.members) || command.session !== state.session || command.match !== state.match) {
    throw new Error("Invalid command/state scope.");
  }
  const hash = sessionCommandHash(command);
  if (command.payloadHash !== hash) throw new Error("Command payload hash mismatch.");
  if (state.phase === "TERMINAL") throw new Error("Terminal session is immutable; rematch admission is unimplemented.");
  if (!state.members.some((member) => member.id === command.subject)) throw new Error("Subject is not a session member.");
  if (command.kind !== "set-ready") throw new Error(`Unimplemented command policy: ${command.kind}. No start/rematch/terminal success is synthesized.`);
  if (state.phase !== "WAITING" || typeof command.payload?.ready !== "boolean"
    || Object.keys(command.payload).some((key) => key !== "ready")) throw new Error("Ready command requires waiting phase and a boolean payload.");
  if (state.revision === Number.MAX_SAFE_INTEGER) throw new Error("Session revision exhausted.");
  const next = structuredClone(state);
  next.revision += 1;
  next.members = next.members.map((member) => member.id === command.subject ? { ...member, ready: command.payload.ready } : member);
  return { kind: "SESSION_WRITE_PROPOSAL", owner: state.owner, expectedRevision: state.revision,
    command: { id: command.id, payloadHash: hash, session: command.session, match: command.match, subject: command.subject }, next };
}

/** Resolve an already-loaded ledger record without mutating/reexecuting it. Fresh response P is still mandatory. */
export function inspectSessionCommand(record, command) {
  const payloadHash = sessionCommandHash(command);
  if (command.payloadHash !== payloadHash) throw new Error("Command payload hash mismatch.");
  if (!record) return { outcome: "UNKNOWN", id: command.id, payloadHash };
  if (record.id !== command.id || record.session !== command.session || record.match !== command.match
    || record.subject !== command.subject || record.payloadHash !== payloadHash) throw new Error("Stored command identity collision.");
  return { outcome: "RECORDED", record: structuredClone(record) };
}
