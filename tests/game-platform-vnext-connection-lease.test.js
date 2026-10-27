import test from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { createPgLeaseSource } from "../services/game-platform-vnext/connectionLease.mjs";
import { createSessionStorage } from "../services/game-platform-vnext/sessionStorage.mjs";
import { SESSION_CONTRACT, sessionCommandHash } from "../services/game-platform-vnext/sessionControl.mjs";

// Offline driver port only: no network, PG engine, ACL, actual A/C/P evidence.
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
const tick = () => new Promise(setImmediate);
const config = { host: "unused.invalid", port: 5432, database: "offline", user: "fixture", password: "secret-never-connect", ssl: false };
function fixture(hooks = {}, options = {}) {
  const clients = [];
  class FakeClient extends EventEmitter {
    constructor(settings) { super(); this.settings = settings; this.calls = []; this.ends = 0; clients.push(this); }
    async connect() { this.calls.push("connect"); return hooks.connect?.(this); }
    async query(sql, params) { this.calls.push(sql); return hooks.query ? hooks.query(sql, params, this) : { command: sql, rows: [{ value: { ok: true } }] }; }
    async end() { this.ends++; return hooks.end?.(this); }
  }
  const source = createPgLeaseSource({ config, connectTimeoutMs: 1000, queryTimeoutMs: 1000, cleanupTimeoutMs: 1000, Client: FakeClient, ...options });
  return { source, clients, FakeClient };
}
const cmd = () => { const c = { contract: SESSION_CONTRACT, id: "same-id", session: "s", match: "m", subject: "u", kind: "set-ready", payload: { ready: true } }; return { ...c, payloadHash: sessionCommandHash(c) }; };
const apply = (source, signal) => createSessionStorage({ connect: source.connect }).applyReady({ command: cmd(), owner: "o", expectedRevision: 0, signal });
const hasCode = (error, code) => error?.code === code || error?.errors?.some((e) => hasCode(e, code));

test("lease rejects missing/URL/environment config before constructing a driver", () => {
  for (const bad of [undefined, {}, { ...config, password: "" }, { ...config, connectionString: "postgres://ignored" }, { ...config, ssl: { rejectUnauthorized: false } }]) {
    assert.throws(() => createPgLeaseSource({ config: bad }), TypeError);
  }
  const prior = process.env.PGHOST;
  try { process.env.PGHOST = "must-not-be-used"; assert.throws(() => fixture(), /environment defaults/); }
  finally { if (prior === undefined) delete process.env.PGHOST; else process.env.PGHOST = prior; }
});

test("source/import is lazy; same transaction uses one fresh client and never reuses it", async () => {
  const { source, clients } = fixture();
  assert.equal(clients.length, 0);
  for (let i = 0; i < 2; i++) assert.equal((await apply(source)).outcome, "STORAGE_COMMIT_CONFIRMED");
  assert.equal(clients.length, 2);
  for (const c of clients) { assert.equal(c.ends, 1); assert.equal(c.calls[1], "BEGIN ISOLATION LEVEL READ COMMITTED"); assert.equal(c.calls.at(-1), "COMMIT"); }
  assert.equal(clients[0].settings.query_timeout, 0);
  assert.equal(clients[0].settings.pipeline, false);
  assert.equal(source.inspect().active, 0);
  assert.equal(JSON.stringify(source.inspect()).includes(config.password), false);
  await source.close();
});

test("query overlap and duplicate release cannot close someone else's fresh client", async () => {
  const gate = deferred();
  const { source, clients } = fixture({ query: () => gate.promise });
  const first = await source.connect(), second = await source.connect();
  const work = first.query("one");
  await assert.rejects(first.query("two"), (e) => e.code === "LEASE_BUSY");
  gate.resolve({ rows: [] }); await work;
  await first.release(); await first.release();
  assert.equal(clients[0].ends, 1); assert.equal(clients[1].ends, 0);
  await second.release(); await source.close();
});

test("same raw client returned by broken constructor is refused without touching active owner", async () => {
  const f = fixture(); const raw = new f.FakeClient(config);
  const source = createPgLeaseSource({ config, connectTimeoutMs: 1000, queryTimeoutMs: 1000, cleanupTimeoutMs: 1000, Client: class { constructor() { return raw; } } });
  const lease = await source.connect();
  await assert.rejects(source.connect(), (e) => e.code === "LEASE_ALREADY_CLAIMED");
  assert.equal(raw.ends, 0); await lease.release();
  await assert.rejects(source.connect(), (e) => e.code === "LEASE_ALREADY_CLAIMED");
  assert.equal(raw.ends, 1); await source.close(); await f.source.close();
});

test("timeout waits for teardown and quarantines late query, never dispatches further SQL", async () => {
  const workGate = deferred(), endGate = deferred();
  const { source, clients } = fixture({ query: () => workGate.promise, end: () => endGate.promise }, { queryTimeoutMs: 15 });
  const lease = await source.connect(); let settled = false;
  const work = lease.query("slow").finally(() => { settled = true; });
  const check = assert.rejects(work, (e) => hasCode(e, "LEASE_IO_TIMEOUT"));
  await new Promise((r) => setTimeout(r, 30));
  assert.equal(settled, false); assert.equal(clients[0].ends, 1);
  await assert.rejects(lease.query("must-not-run"), /closed/);
  endGate.resolve(); await check;
  workGate.resolve({ command: "COMMIT" }); await tick();
  assert.equal(clients[0].calls.includes("must-not-run"), false);
  assert.ok(source.inspect().events.some((e) => e.event === "query-late"));
  await lease.release(); await source.close();
});

test("never-settling teardown is explicit unconfirmed quarantine, not a cleanup PASS", async () => {
  const { source, clients } = fixture({ query: () => new Promise(() => {}), end: () => new Promise(() => {}) }, { queryTimeoutMs: 10, cleanupTimeoutMs: 10 });
  const lease = await source.connect();
  await assert.rejects(lease.query("stuck"), (e) => hasCode(e, "LEASE_CLOSE_UNCONFIRMED") && hasCode(e, "LEASE_IO_TIMEOUT"));
  assert.equal(source.inspect().quarantined, 1);
  await assert.rejects(lease.release(), (e) => e.code === "LEASE_CLOSE_UNCONFIRMED");
  const another = await source.connect();
  assert.equal(clients.length, 2); assert.equal(clients[0].ends, 1);
  const release = assert.rejects(another.release(), /not confirmed/); await release;
  await assert.rejects(source.close(), /unconfirmed/);
});

test("abort during connect tears down late connection without exposing a lease", async () => {
  const gate = deferred(); const controller = new AbortController();
  const { source, clients } = fixture({ connect: () => gate.promise });
  const work = source.connect({ signal: controller.signal });
  const check = assert.rejects(work, (e) => e.code === "LEASE_CONTEXT_CLOSED");
  await tick(); controller.abort(); await check;
  gate.resolve(); await tick();
  assert.equal(clients[0].ends, 1); assert.equal(source.inspect().active, 0);
  await source.close();
});

test("connect timeout closes its own client; source close forbids all future leases", async () => {
  const f = fixture({ connect: () => new Promise(() => {}) }, { connectTimeoutMs: 10 });
  await assert.rejects(f.source.connect(), (e) => hasCode(e, "LEASE_IO_TIMEOUT"));
  assert.equal(f.clients[0].ends, 1); await f.source.close();
  await assert.rejects(f.source.connect(), /closed/);
});

test("source close interrupts in-flight query and observes late rejection", async () => {
  const gate = deferred(); const f = fixture({ query: () => gate.promise });
  const lease = await f.source.connect();
  const result = assert.rejects(lease.query("slow"), /closed/);
  await tick(); await f.source.close(); await result;
  gate.reject(new Error("late-secret")); await tick();
  assert.equal(f.clients[0].ends, 1);
});

test("driver error is observed, closes client, and never includes driver payload in trace", async () => {
  const gate = deferred(); const f = fixture({ query: () => gate.promise });
  const lease = await f.source.connect(); const work = assert.rejects(lease.query("secret-sql"), /driver error/);
  await tick(); f.clients[0].emit("error", new Error("secret-password")); await work;
  f.clients[0].emit("error", new Error("late-driver-error"));
  assert.equal(f.clients[0].ends, 1); assert.equal(JSON.stringify(f.source.inspect()).includes("secret"), false);
  await lease.release(); await f.source.close();
});

test("COMMIT reply failure remains UNKNOWN; same-ID lookup never replays ready", async () => {
  const f = fixture({ query: (sql) => { if (sql === "COMMIT") throw new Error("lost"); return { rows: [{ value: { outcome: "RECORDED", id: cmd().id } }] }; } });
  const result = await apply(f.source);
  assert.equal(result.outcome, "UNKNOWN"); assert.equal(f.clients[0].ends, 1);
  const read = await createSessionStorage({ connect: f.source.connect }).readCommandStatus({ command: cmd(), owner: "o" });
  assert.equal(read.outcome, "UNKNOWN");
  assert.equal(f.clients.flatMap((c) => c.calls).filter((sql) => sql.includes("storage_ready")).length, 1);
  assert.equal(f.clients[1].calls.some((sql) => sql.includes("storage_command_status")), true);
  await f.source.close();
});

test("abort after COMMIT dispatch does not issue rollback or falsely confirm late C", async () => {
  const commit = deferred(), controller = new AbortController();
  const f = fixture({ query: (sql) => sql === "COMMIT" ? commit.promise : { rows: [{ value: { ok: true } }] } });
  const result = apply(f.source, controller.signal);
  while (!f.clients[0]?.calls.includes("COMMIT")) await tick();
  controller.abort(); assert.equal((await result).outcome, "UNKNOWN");
  commit.resolve({ command: "COMMIT" }); await tick();
  assert.equal(f.clients[0].calls.includes("ROLLBACK"), false); await f.source.close();
});

test("abort during release preserves positive COMMIT but hides value", async () => {
  const end = deferred(), controller = new AbortController();
  const f = fixture({ end: () => end.promise }); const work = apply(f.source, controller.signal);
  while (!f.clients[0]?.ends) await tick();
  controller.abort(); end.resolve(); const result = await work;
  assert.equal(result.outcome, "STORAGE_COMMIT_CONFIRMED_CONTEXT_CLOSED"); assert.equal("value" in result, false); await f.source.close();
});

test("cleanup error cannot erase confirmed storage commit", async () => {
  const f = fixture({ end: () => { throw new Error("cleanup"); } });
  const result = await apply(f.source);
  assert.equal(result.outcome, "STORAGE_COMMIT_CONFIRMED");
  assert.equal(result.cleanupError.code, "LEASE_CLOSE_UNCONFIRMED");
  await assert.rejects(f.source.close(), /unconfirmed/);
});

test("error and late completions do not contaminate a concurrently owned lease", async () => {
  const gate = deferred(); const f = fixture({ query: (sql, params, c) => c === f.clients[0] ? gate.promise : { command: "SELECT" } });
  const controller = new AbortController(); const a = await f.source.connect({ signal: controller.signal }), b = await f.source.connect();
  const work = assert.rejects(a.query("a"), /closed/); await tick(); controller.abort(); await work;
  assert.equal((await b.query("b")).command, "SELECT"); assert.equal(f.clients[1].ends, 0);
  gate.resolve({ rows: [] }); await tick(); await b.release(); await a.release(); await f.source.close();
});

test("release during a pending query closes once and observes its late rejection", async () => {
  const gate = deferred(); const f = fixture({ query: () => gate.promise });
  const lease = await f.source.connect(); const work = assert.rejects(lease.query("pending"), (e) => e.code === "LEASE_RELEASED");
  await tick(); await Promise.all([lease.release(), lease.release()]); await work;
  gate.reject(new Error("late")); await tick(); assert.equal(f.clients[0].ends, 1); await f.source.close();
});

test("connect rejection closes only that failed client and preserves the original error", async () => {
  const reason = new Error("offline failure"); const f = fixture({ connect: () => { throw reason; } });
  await assert.rejects(f.source.connect(), (e) => e === reason);
  assert.equal(f.clients[0].ends, 1); assert.equal(f.clients[0].calls.length, 1); await f.source.close();
});

test("source close while acquiring rejects late connect and does not yield a usable lease", async () => {
  const gate = deferred(); const f = fixture({ connect: () => gate.promise });
  const acquisition = assert.rejects(f.source.connect(), /closed/); await tick();
  await f.source.close(); await acquisition; gate.resolve(); await tick();
  assert.equal(f.clients[0].ends, 1); assert.equal(f.source.inspect().active, 0);
});
