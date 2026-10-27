import test from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { ownRawClient, ownResource, pollObservation, installState, installOriginal, cleanupSchema,
  sourceEvidence, expectSqlstate, expectedSqlstate, judgeCompetition } from "./game-db-integration/vnext-storage-candidate/runnerSupport.mjs";

// Offline only. No pg engine/socket, SQL execution, runCandidate or fault proxy invocation.
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
const tick = () => new Promise(setImmediate);
const sqlError = (code) => Object.assign(new Error("not-recorded-driver-payload"), { code, severity: "ERROR" });
function rawFixture(hooks = {}, options = {}) {
  class Port extends EventEmitter {
    calls = []; ends = 0;
    connect() { this.calls.push("connect"); return hooks.connect?.(); }
    query(sql) { this.calls.push(sql); return hooks.query?.(sql) ?? Promise.resolve({ command: sql }); }
    end() { this.ends++; return hooks.end?.(); }
  }
  const raw = new Port(), events = [];
  const client = ownRawClient(raw, { id: "offline-owner", connectMs: 1000, queryMs: 1000, cleanupMs: 1000,
    emit: (event, values) => events.push({ event, ...values }), ...options });
  return { client, raw, events };
}

test("K1 install reply loss plus confirmed local end never means schema cleanup completed", async () => {
  const f = rawFixture({ query: () => Promise.reject(new Error("lost reply")) });
  const state = installState();
  await assert.rejects(installOriginal(state, f.client, "fixture-install", "fixture-marker"));
  await f.client.end();
  let drops = 0;
  const result = await cleanupSchema(state, { marker: "run", observe: async () => ({ oid: 7, marker: null }), drop: async () => { drops++; } });
  assert.equal(state.dispatched, true); assert.equal(state.successResponse, false);
  assert.equal(f.client.inspect().teardown, "LOCAL_END_CONFIRMED");
  assert.equal(result.status, "INCONCLUSIVE"); assert.equal(drops, 0);
});

test("K1 an absent snapshot cannot settle an unconfirmed installer; no-dispatch does not touch schema", async () => {
  let reads = 0, drops = 0;
  const io = { marker: "run", observe: async () => { reads++; return null; }, drop: async () => { drops++; } };
  assert.equal((await cleanupSchema(installState(), io)).status, "NOT_CREATED_BY_RUN");
  assert.equal(reads, 0);
  const state = { ...installState(), dispatched: true };
  assert.equal((await cleanupSchema(state, io)).status, "INCONCLUSIVE");
  assert.equal(state.presence, "ABSENT"); assert.equal(drops, 0);
});

test("K1 records rollback response separately without inferring an earlier COMMIT was absent", async () => {
  const f = rawFixture({ query: (sql) => sql === "ROLLBACK" ? { command: "ROLLBACK" } : Promise.reject(sqlError("42601")) });
  const state = installState();
  await assert.rejects(installOriginal(state, f.client, "bad-install", "marker"));
  assert.equal(state.rollbackResponse, true); assert.equal(state.successResponse, false);
  assert.equal((await cleanupSchema(state, { observe: async () => null })).status, "INCONCLUSIVE");
  await f.client.end();
});

test("K1 marker failure or mismatched marker cannot authorize name-based DROP", async () => {
  const f = rawFixture({ query: (s) => s === "install" ? [{ command: "BEGIN" }, { command: "COMMIT" }] : Promise.reject(sqlError("42501")) });
  const state = installState();
  await assert.rejects(installOriginal(state, f.client, "install", "marker"));
  assert.equal(state.successResponse, true); assert.equal(state.markerDispatched, true); assert.equal(state.markerResponse, false);
  for (const marker of [null, "other-run"]) {
    const result = await cleanupSchema(state, { marker: "run", observe: async () => ({ oid: 1, marker }), drop: async () => assert.fail("foreign DROP") });
    assert.equal(result.status, "INCONCLUSIVE");
  }
  await f.client.end();
});

test("K1 independent exact marker can resolve a lost marker reply; drop needs absence observation", async () => {
  const state = { ...installState(), dispatched: true, successResponse: true, markerDispatched: true };
  let present = true, drops = 0;
  const result = await cleanupSchema(state, { marker: "run", observe: async () => present ? { oid: 9, marker: "run" } : null,
    drop: async (oid) => { assert.equal(oid, 9); drops++; present = false; } });
  assert.equal(result.status, "OWNED_SCHEMA_REMOVED_ABSENCE_OBSERVED"); assert.equal(drops, 1);
  assert.equal(state.ownership, "EXACT_RUN_MARKER_OBSERVED"); assert.equal(state.presence, "ABSENT");
  assert.equal((await cleanupSchema(state, { marker: "run", observe: async () => ({ oid: 9, marker: "run" }), drop: async () => { throw new Error("lost DROP reply"); } })).status, "INCONCLUSIVE");
});

test("K2 pending observer read is bounded, poisons only its client, and observes late response", async () => {
  const gate = deferred(), f = rawFixture({ query: () => gate.promise }, { queryMs: 10 }), other = rawFixture();
  await assert.rejects(f.client.query("private SQL and parameters"), { code: "ORACLE_INCONCLUSIVE" });
  await assert.rejects(f.client.query("must-not-run"));
  assert.equal(f.raw.ends, 1); assert.equal(f.raw.calls.includes("must-not-run"), false);
  assert.equal((await other.client.query("SELECT")).command, "SELECT"); assert.equal(other.raw.ends, 0);
  gate.resolve({ command: "COMMIT" }); await tick();
  assert.equal(f.client.inspect().late, 1); assert.equal(JSON.stringify(f.events).includes("private SQL"), false);
  await other.client.end();
});

test("K2 cleanup query and never-settling end return unconfirmed; no reuse or cleanup PASS", async () => {
  const f = rawFixture({ query: () => new Promise(() => {}), end: () => new Promise(() => {}) }, { queryMs: 10, cleanupMs: 10 });
  const state = { ...installState(), dispatched: true, successResponse: true };
  assert.equal((await cleanupSchema(state, { observe: () => f.client.query("inventory") })).status, "INCONCLUSIVE");
  assert.equal(f.client.inspect().teardown, "UNCONFIRMED");
  await assert.rejects(f.client.query("next")); await assert.rejects(f.client.end()); assert.equal(f.raw.ends, 1);
});

test("K2 connect deadline and late rejection remain observed", async () => {
  const gate = deferred(), f = rawFixture({ connect: () => gate.promise }, { connectMs: 10 });
  await assert.rejects(f.client.connect()); gate.reject(new Error("late-secret")); await tick();
  assert.equal(f.client.inspect().late, 1); assert.equal(f.raw.ends, 1);
});

test("K2 normal SQL rejection permits owned rollback, but EPIPE/FATAL poison the connection", async () => {
  const f = rawFixture({ query: (s) => s === "bad" ? Promise.reject(sqlError("40001")) : { command: "ROLLBACK" } });
  await assert.rejects(f.client.query("bad"), { code: "40001" });
  assert.equal((await f.client.query("ROLLBACK")).command, "ROLLBACK"); await f.client.end();
  for (const error of [Object.assign(new Error(), { code: "EPIPE" }), { code: "57P01", severity: "FATAL" }]) {
    const p = rawFixture({ query: () => Promise.reject(error) }); await assert.rejects(p.client.query("read"));
    await assert.rejects(p.client.query("next")); assert.equal(p.raw.ends, 1);
  }
});

test("K2 poll passes remaining budget into owned read instead of waiting on an unbounded query", async () => {
  const f = rawFixture({ query: () => new Promise(() => {}) }, { queryMs: 1000 });
  let forwarded;
  await assert.rejects(pollObservation((remaining) => { forwarded = remaining; return f.client.query("read", [], { timeoutMs: remaining }); }, 15));
  assert.ok(forwarded > 0 && forwarded <= 15); assert.equal(f.raw.ends, 1);
});

test("K2 asynchronous driver failure closes pending work, end is idempotent and late errors are observed", async () => {
  const gate = deferred(), f = rawFixture({ query: () => gate.promise });
  const work = assert.rejects(f.client.query("pending")); await tick();
  f.raw.emit("error", new Error("secret")); await work;
  await Promise.all([f.client.end(), f.client.end()]); gate.reject(new Error("late")); await tick();
  assert.equal(f.raw.ends, 1); assert.equal(f.client.inspect().late, 1);
});

test("K2 a timed-out relay start keeps unconfirmed inventory and closes only its late resource", async () => {
  const gate = deferred(); let ends = 0;
  const owner = ownResource(() => gate.promise, { id: "late", startMs: 10, endMs: 10 });
  await assert.rejects(owner.open()); await assert.rejects(owner.close());
  gate.resolve({ close: async () => { ends++; } }); await tick();
  assert.equal(ends, 1); assert.equal(owner.inspect().startup, "UNCONFIRMED");
  assert.equal(owner.inspect().late, 1); assert.equal(owner.inspect().teardown, "LOCAL_CONFIRMED");
});

test("K2 never-settling relay close returns unconfirmed and is not restarted on duplicate cleanup", async () => {
  let ends = 0;
  const owner = ownResource(async () => ({ close: () => { ends++; return new Promise(() => {}); } }), { id: "stuck", startMs: 10, endMs: 10 });
  await owner.open(); await assert.rejects(owner.close()); await assert.rejects(owner.close());
  assert.equal(ends, 1); assert.equal(owner.inspect().teardown, "UNCONFIRMED");
});

function sourcePort({ failClose = false, dropped = 0 } = {}) {
  const events = []; let sequence = 0;
  return {
    async connect() { const lease = ++sequence; events.push({ lease, event: "created", at: 1 }); return { query: async () => ({ rows: [{ pid: 100 + lease }] }), release: async () => {} }; },
    async close() { events.push({ lease: sequence, event: failClose ? "close-unconfirmed" : "driver-end-confirmed", at: 2 }); if (failClose) throw new Error("secret-close"); },
    inspect: () => ({ events: [...events], droppedEvents: dropped, quarantined: failClose ? 1 : 0 }),
  };
}
const command = { contract: "GP-COOP-SESSION/1", session: "fixture", match: "m", subject: "u", id: "c", payloadHash: "h" };
test("K3 captures successful close and failed close, with distinct source IDs for overlapping lease numbers", async () => {
  const registry = sourceEvidence();
  const a = registry.track(sourcePort(), { scenario: "fault", command }), b = registry.track(sourcePort({ failClose: true }), { scenario: "abort" });
  await a.connect(); await b.connect(); await a.close(); await assert.rejects(b.close());
  const data = JSON.parse(JSON.stringify(registry.snapshot()));
  assert.equal(data.length, 2); assert.notEqual(data[0].source, data[1].source);
  assert.equal(data[0].leases[0].lease, 1); assert.equal(data[1].leases[0].lease, 1);
  assert.equal(data[0].leases[0].backendPid, 101); assert.equal(data[0].command.id, "c");
  assert.equal(data[1].diagnostics.quarantined, 1); assert.equal(data[1].close, "UNCONFIRMED");
  assert.equal(data[0].diagnostics.events.at(-1).event, "driver-end-confirmed");
  assert.equal(JSON.stringify(data).includes("secret"), false);
});

test("K3 diagnostic loss is retained and cannot pass source evidence", async () => {
  const registry = sourceEvidence(), a = registry.track(sourcePort({ dropped: 3 }), { scenario: "dropped" });
  await a.connect(); await assert.rejects(a.close(), { code: "ORACLE_INCONCLUSIVE" });
  assert.equal(registry.snapshot()[0].diagnostics.droppedEvents, 3);
});

test("K4 expected rejection excludes transport, timeout, wrong SQLSTATE and cleanup uncertainty", async () => {
  assert.equal(expectedSqlstate(new AggregateError([sqlError("40001"), { code: "LEASE_CONTEXT_CLOSED" }]), "40001"), true);
  for (const error of [sqlError("42501"), { code: "ECONNRESET" }, { code: "LEASE_IO_TIMEOUT" }, new AggregateError([sqlError("40001"), { code: "LEASE_CLOSE_UNCONFIRMED" }])]) {
    assert.equal(expectedSqlstate(error, "40001"), false);
    await assert.rejects(expectSqlstate(() => Promise.reject(error), "40001"));
  }
  await assert.rejects(expectSqlstate(async () => ({ outcome: "UNKNOWN" }), "40001"));
});

function competition() {
  const other = { ...command, id: "d" }, value = { ...command, outcome: "RECORDED", owner: "o", stream: "stream", revision: 1 };
  return { blocked: true, winnerCommand: command, loserCommand: other, winner: { outcome: "STORAGE_COMMIT_CONFIRMED", value },
    loser: { status: "rejected", reason: sqlError("40001") }, cut: { revision: 1, ready: true, commands: 1 },
    winnerStatus: value, loserStatus: { outcome: "UNKNOWN", id: other.id, payloadHash: other.payloadHash } };
}
test("K4 correct cut cannot hide missing lock witness, UNKNOWN winner or unrelated loser rejection", () => {
  assert.doesNotThrow(() => judgeCompetition(competition()));
  for (const change of [{ blocked: false }, { winner: { outcome: "UNKNOWN" } },
    { loser: { status: "fulfilled", value: { outcome: "UNKNOWN" } } }, { loser: { status: "rejected", reason: { code: "ECONNRESET" } } },
    { loser: { status: "rejected", reason: sqlError("22023") } }, { winnerStatus: { ...competition().winnerStatus, id: "different" } },
    { cut: { revision: 2, ready: true, commands: 2 } }]) assert.throws(() => judgeCompetition({ ...competition(), ...change }));
});
