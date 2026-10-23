import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createSessionStorage } from "../services/game-platform-vnext/sessionStorage.mjs";
import { SESSION_CONTRACT, sessionCommandHash } from "../services/game-platform-vnext/sessionControl.mjs";

// Scripted I/O, not a PostgreSQL engine, admission oracle or real C/P evidence.
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
function command(overrides = {}) {
  const value = { contract: SESSION_CONTRACT, id: "id-1", session: "s-1", match: "m-1",
    subject: "u-1", kind: "set-ready", payload: { ready: true }, ...overrides };
  return { ...value, payloadHash: sessionCommandHash(value) };
}
const recorded = (cmd) => ({ outcome: "RECORDED", id: cmd.id, payloadHash: cmd.payloadHash,
  session: cmd.session, match: cmd.match, subject: cmd.subject, owner: "owner-1", stream: "stream-1", revision: 1 });
function connection({ operation, commit, rollback, begin, release } = {}) {
  const calls = [];
  const client = {
    calls,
    async query(sql, params) {
      calls.push([sql, params]);
      if (sql.startsWith("BEGIN")) return begin ? begin() : { command: "BEGIN" };
      if (sql === "COMMIT") return commit ? commit() : { command: "COMMIT" };
      if (sql === "ROLLBACK") return rollback ? rollback() : { command: "ROLLBACK" };
      return operation ? operation(sql, params) : { rows: [{ value: recorded(command()) }] };
    },
    async release(error) { calls.push(["release", error]); return release?.(error); },
  };
  return client;
}
const apply = (store, extra = {}) => store.applyReady({ command: command(), owner: "owner-1", expectedRevision: 0, ...extra });

test("storage has no default caller, driver, authority or unsupported command success", async () => {
  assert.throws(() => createSessionStorage(), /explicit exclusive/);
  let acquisitions = 0;
  const store = createSessionStorage({ connect: () => { acquisitions++; throw new Error("Should not connect"); } });
  for (const kind of ["start", "rematch", "terminate", "join"]) await assert.rejects(apply(store, { command: command({ kind }) }), /set-ready/);
  await assert.rejects(apply(store, { command: { ...command(), payloadHash: "wrong" } }), /hash/);
  await assert.rejects(apply(store, { expectedRevision: -1 }), /owner\/revision/);
  await assert.rejects(apply(store, { command: command({ payload: { ready: true, next: {} } }) }), /set-ready/);
  assert.equal(acquisitions, 0);
});

test("one exclusive transaction forwards only stable ready parameters, never proposal.next", async () => {
  const gate = deferred();
  const client = connection({ commit: () => gate.promise });
  let connects = 0;
  const store = createSessionStorage({ connect: async () => { connects++; return client; } });
  const input = command();
  const promise = apply(store, { command: input, next: { revision: 999, members: [] } });
  input.payload.ready = false;
  await new Promise(setImmediate);
  assert.equal(client.calls.length, 3);
  const [sql, params] = client.calls[1];
  assert.match(sql, /storage_ready\(\$1,\$2,\$3,\$4,\$5,\$6,\$7,\$8,\$9\)/);
  assert.deepEqual(params, [SESSION_CONTRACT, "s-1", "m-1", "u-1", "id-1", command().payloadHash, true, "owner-1", 0]);
  assert.equal(connects, 1);
  assert.equal(client.calls.some(([name]) => name === "release"), false);
  gate.resolve({ command: "COMMIT" });
  assert.equal((await promise).outcome, "STORAGE_COMMIT_CONFIRMED");
  assert.deepEqual(client.calls.map(([name]) => name).filter((name) => !name.startsWith("SELECT")),
    ["BEGIN ISOLATION LEVEL READ COMMITTED", "COMMIT", "release"]);
});

test("projection and same-ID lookup preserve scope and do not dispatch a mutation", async () => {
  const clients = [];
  const store = createSessionStorage({ connect: async () => { const c = connection(); clients.push(c); return c; } });
  await store.readCurrent({ session: "s-1", match: "m-1", subject: "u-1", owner: "owner-1" });
  await store.readCommandStatus({ command: command(), owner: "owner-1" });
  assert.match(clients[0].calls[1][0], /storage_current/);
  assert.deepEqual(clients[0].calls[1][1], ["s-1", "m-1", "u-1", "owner-1"]);
  assert.match(clients[1].calls[1][0], /storage_command_status/);
  assert.equal(clients.flatMap((c) => c.calls).some(([sql]) => sql.includes("storage_ready")), false);
});

test("same command concurrent leases retain identity; no client-side dedupe/commit claim", async () => {
  const clients = [];
  const store = createSessionStorage({ connect: async () => { const c = connection(); clients.push(c); return c; } });
  const results = await Promise.all([apply(store), apply(store)]);
  assert.equal(clients.length, 2);
  assert.deepEqual(clients[0].calls[1][1], clients[1].calls[1][1]);
  assert.equal(results.every((r) => r.value.id === "id-1"), true);
  // Both scripted calls were sent. Actual mutation-once is the SQL/DB oracle,
  // not a claim this scripted I/O test can prove.
});

test("storage rejection is rolled back and observed, never coerced to success", async () => {
  for (const reason of ["identity collision", "owner mismatch", "revision mismatch", "terminal", "closed", "missing session", "failure context unknown"]) {
    const error = new Error(reason);
    const c = connection({ operation: () => { throw error; } });
    await assert.rejects(apply(createSessionStorage({ connect: async () => c })), (e) => e === error);
    assert.deepEqual(c.calls.slice(-2).map(([sql]) => sql), ["ROLLBACK", "release"]);
    assert.equal(c.calls.at(-1)[1], error);
    assert.equal(c.calls.some(([sql]) => sql === "COMMIT"), false);
  }
});

test("rollback plus release failure preserves all failures and does not reuse the lease", async () => {
  const op = new Error("operation"), rollback = new Error("rollback"), release = new Error("release");
  const c = connection({ operation: () => { throw op; }, rollback: () => { throw rollback; }, release: () => { throw release; } });
  await assert.rejects(apply(createSessionStorage({ connect: async () => c })), (error) => {
    assert.equal(error instanceof AggregateError, true);
    assert.equal(error.errors[0] instanceof AggregateError, true);
    assert.deepEqual(error.errors[0].errors, [op, rollback]);
    assert.equal(error.errors[1], release);
    return true;
  });
  assert.equal(c.calls.filter(([sql]) => sql === "release").length, 1);
});

test("BEGIN failure discards the client without issuing a mutation or false rollback", async () => {
  const error = new Error("begin lost");
  const c = connection({ begin: () => { throw error; } });
  await assert.rejects(apply(createSessionStorage({ connect: async () => c })), (e) => e === error);
  assert.deepEqual(c.calls.map(([sql]) => sql), ["BEGIN ISOLATION LEVEL READ COMMITTED", "release"]);
  assert.equal(c.calls.at(-1)[1], error);
});

test("COMMIT reply loss stays UNKNOWN; same-ID status lookup never replays the command", async () => {
  const error = new Error("commit reply lost");
  const first = connection({ commit: () => { throw error; } });
  const second = connection({ operation: () => ({ rows: [{ value: { outcome: "UNKNOWN", id: "id-1", payloadHash: command().payloadHash } }] }) });
  const queue = [first, second];
  const store = createSessionStorage({ connect: async () => queue.shift() });
  assert.equal((await apply(store)).outcome, "UNKNOWN");
  assert.equal(first.calls.some(([sql]) => sql === "ROLLBACK"), false);
  assert.equal(first.calls.at(-1)[1], error);
  const lookup = await store.readCommandStatus({ command: command(), owner: "owner-1" });
  assert.equal(lookup.value.outcome, "UNKNOWN");
  assert.match(second.calls[1][0], /storage_command_status/);
  assert.equal(second.calls[1][1][4], "id-1");
  assert.equal(queue.length, 0);
});

test("a ROLLBACK tag or absent COMMIT receipt cannot be reported as commit confirmed", async () => {
  for (const reply of [undefined, { command: "ROLLBACK" }]) {
    const c = connection({ commit: () => reply });
    assert.equal((await apply(createSessionStorage({ connect: async () => c }))).outcome, "UNKNOWN");
    assert.equal(c.calls.some(([sql]) => sql === "ROLLBACK"), false);
  }
});

test("confirmed commit is retained when release fails; cleanup failure remains visible", async () => {
  const cleanup = new Error("release failed");
  const c = connection({ release: () => { throw cleanup; } });
  const result = await apply(createSessionStorage({ connect: async () => c }));
  assert.equal(result.outcome, "STORAGE_COMMIT_CONFIRMED");
  assert.equal(result.cleanupError, cleanup);
});

test("pre-abort acquires nothing; a late acquired lease is released without BEGIN", async () => {
  const controller = new AbortController(); controller.abort(new Error("closed"));
  let calls = 0;
  const store = createSessionStorage({ connect: async () => { calls++; return connection(); } });
  await assert.rejects(apply(store, { signal: controller.signal }), /closed/);
  assert.equal(calls, 0);
  const lease = deferred(), next = new AbortController(), c = connection();
  const p = apply(createSessionStorage({ connect: () => lease.promise }), { signal: next.signal });
  next.abort(new Error("new match")); lease.resolve(c);
  await assert.rejects(p, /new match/);
  assert.deepEqual(c.calls.map(([sql]) => sql), ["release"]);
});

test("abort during a pending operation waits for settlement, rolls back and releases only its own lease", async () => {
  const gate = deferred(), controller = new AbortController();
  const c = connection({ operation: () => gate.promise });
  const p = apply(createSessionStorage({ connect: async () => c }), { signal: controller.signal });
  await new Promise(setImmediate);
  controller.abort(new Error("T01 old match closed"));
  assert.equal(c.calls.some(([sql]) => sql === "release"), false);
  gate.resolve({ rows: [{ value: recorded(command()) }] });
  await assert.rejects(p, /old match closed/);
  assert.deepEqual(c.calls.slice(-2).map(([sql]) => sql), ["ROLLBACK", "release"]);
  assert.equal(c.calls.some(([sql]) => sql === "COMMIT"), false);
});

test("abort after COMMIT dispatch does not pretend rollback or return a late receipt value", async () => {
  const gate = deferred(), controller = new AbortController();
  const c = connection({ commit: () => gate.promise });
  const p = apply(createSessionStorage({ connect: async () => c }), { signal: controller.signal });
  await new Promise(setImmediate);
  controller.abort(new Error("T03 view closed"));
  gate.resolve({ command: "COMMIT" });
  assert.deepEqual(await p, { outcome: "STORAGE_COMMIT_CONFIRMED_CONTEXT_CLOSED" });
  assert.equal(c.calls.some(([sql]) => sql === "ROLLBACK"), false);
});

test("context can close while asynchronous release is pending, including ABA", async () => {
  const gate = deferred(), a = new AbortController();
  const c = connection({ release: () => gate.promise });
  const p = apply(createSessionStorage({ connect: async () => c }), { signal: a.signal });
  await new Promise(setImmediate);
  a.abort(new Error("T02 A to B to A is still a different execution"));
  gate.resolve();
  assert.deepEqual(await p, { outcome: "STORAGE_COMMIT_CONFIRMED_CONTEXT_CLOSED" });
});

test("a broken provider cannot release a client already owned by another call", async () => {
  const gate = deferred();
  const c = connection({ operation: () => gate.promise });
  const store = createSessionStorage({ connect: async () => c });
  const first = apply(store);
  await new Promise(setImmediate);
  await assert.rejects(apply(store), /already leased/);
  assert.equal(c.calls.some(([sql]) => sql === "release"), false);
  gate.resolve({ rows: [{ value: recorded(command()) }] });
  await first;
  assert.equal(c.calls.filter(([sql]) => sql === "release").length, 1);
});

test("malformed primitive result fails before COMMIT and releases with failure", async () => {
  for (const rows of [[], [{ value: null }], [{ value: {} }, { value: {} }]]) {
    const c = connection({ operation: () => ({ rows }) });
    await assert.rejects(apply(createSessionStorage({ connect: async () => c })), /unambiguous/);
    assert.equal(c.calls.some(([sql]) => sql === "COMMIT"), false);
    assert.equal(c.calls.at(-2)[0], "ROLLBACK");
  }
});

const sql = readFileSync(new URL("../supabase/game-platform-vnext/pg-storage-candidate.sql", import.meta.url), "utf8");
test("SQL static ACL contract keeps every primitive internal; not an applied ACL test", () => {
  const code = sql.replace(/--[^\n]*/g, "");
  assert.match(code, /CREATE SCHEMA vnext_private AUTHORIZATION postgres/);
  assert.match(code, /session_user <> 'postgres' OR current_user <> 'postgres'/);
  assert.equal((code.match(/CREATE FUNCTION /g) ?? []).length, 5);
  assert.equal((code.match(/SECURITY INVOKER SET search_path = ''/g) ?? []).length, 5);
  assert.equal((code.match(/ENABLE ROW LEVEL SECURITY/g) ?? []).length, 3);
  assert.match(code, /REVOKE ALL ON ALL FUNCTIONS IN SCHEMA vnext_private\s+FROM PUBLIC, anon, authenticated, service_role, authenticator/);
  assert.doesNotMatch(code, /\bGRANT\b|SECURITY DEFINER|auth\.uid|set_config|CREATE ROLE|INSERT INTO vnext_private\.session_anchors/i);
});

test("SQL static storage contract has stable locking, unique ledger and no bootstrap/next write", () => {
  assert.match(sql, /PRIMARY KEY \(contract, session_id, match_id, subject_id, command_id\)/);
  const ready = sql.slice(sql.indexOf("CREATE FUNCTION vnext_private.storage_ready"), sql.indexOf("CREATE FUNCTION vnext_private.storage_current"));
  assert.ok(ready.indexOf("FOR UPDATE") < ready.indexOf("SELECT * INTO c"));
  assert.ok(ready.indexOf("storage_check_open(s)") < ready.indexOf("UPDATE vnext_private.session_members"));
  assert.match(ready, /c.payload_hash IS DISTINCT FROM p_hash OR c.ready IS DISTINCT FROM p_ready/);
  assert.match(ready, /s.revision <> p_expected_revision/);
  assert.match(sql, /pg_catalog.clock_timestamp\(\) >= p_row.first_failure_at \+ interval '60 seconds'/);
  assert.match(sql, /NOT p_row.failure_context_known/);
  assert.equal((ready.match(/UPDATE vnext_private\./g) ?? []).length, 2);
  assert.equal((ready.match(/INSERT INTO vnext_private\./g) ?? []).length, 1);
  assert.doesNotMatch(ready, /SET (?:owner_id|first_failure_at|terminal_at|terminal_id|closed)|p_next|jsonb_populate/);
  assert.match(sql, /^BEGIN;$/m); assert.match(sql, /^COMMIT;$/m);
});
