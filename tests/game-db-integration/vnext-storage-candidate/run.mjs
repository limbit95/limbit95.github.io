import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createRequire } from "node:module";
const pg = createRequire(new URL("../../../services/game-platform-vnext/package.json", import.meta.url))("pg");
import { createPgLeaseSource } from "../../../services/game-platform-vnext/connectionLease.mjs";
import { createSessionStorage } from "../../../services/game-platform-vnext/sessionStorage.mjs";
import { SESSION_CONTRACT, sessionCommandHash } from "../../../services/game-platform-vnext/sessionControl.mjs";
import { startCommitFaultProxy } from "./faultProxy.mjs";
import { ownRawClient, ownResource, pollObservation, installState, installOriginal, cleanupSchema,
  sourceEvidence, expectSqlstate, recorded, judgeCompetition, inconclusive } from "./runnerSupport.mjs";

// Candidate only. No test registration, auto provisioning, Auth/role creation,
// runtime GRANT, or operation on a project endpoint. CLI requires --execute.
const root = fileURLToPath(new URL("../../../", import.meta.url));
const sqlPath = path.join(root, "supabase/game-platform-vnext/pg-storage-candidate.sql");
const sqlHash = "07888c2439d00f323d985166e4cdbc14377626c7debba84314a7789badec900b";
const roles = ["anon", "authenticated", "service_role", "authenticator"];
const ddlFunctions = ["storage_owner_only", "storage_check_open", "storage_ready", "storage_current", "storage_command_status"];
const params = (c, revision = 0, owner = "o") => [c.contract, c.session, c.match, c.subject, c.id, c.payloadHash, c.payload.ready, owner, revision];
const readySql = "SELECT vnext_private.storage_ready($1,$2,$3,$4,$5,$6,$7,$8,$9) AS value";
export function validateManifest(m) {
  if (Object.keys(process.env).some((key) => key.startsWith("PG"))) throw new Error("PG environment defaults must be absent.");
  if (m.disposable !== true || m.kind !== "isolated-local-supabase-direct-pg" || m.host !== "127.0.0.1"
    || m.user !== "postgres" || m.ssl !== false || m.allowSqlInstallAndCleanup !== true || m.allowLocalFaultProxy !== true
    || !/^[0-9a-f-]{36}$/.test(m.runId) || m.database !== `vnext_lease_candidate_${m.runId.replaceAll("-", "")}`
    || !Number.isInteger(m.port) || m.port < 1 || m.port > 65535 || !path.isAbsolute(m.passwordFile)
    || !/^[0-9a-f]{40}$/.test(m.gitHead) || !/^sha256:[0-9a-f]{64}$/.test(m.imageDigest)
    || !m.pgVersion || !m.supabaseCliVersion || [m.pgVersion, m.supabaseCliVersion].some((s) => s.includes("REPLACE"))) throw new Error("Concrete isolated-run manifest required.");
  for (const name of ["connectMs", "queryMs", "cleanupMs", "observeMs"]) {
    if (!Number.isSafeInteger(m.timings?.[name]) || m.timings[name] < 100 || m.timings[name] > 60_000) throw new Error("Explicit bounded test timings required.");
  }
  if (m.timings.observeMs <= m.timings.queryMs) throw new Error("Observer budget must exceed query budget.");
}
export async function runCandidate(manifest, output) {
  validateManifest(manifest);
  const actualHead = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
  if (actualHead !== manifest.gitHead || execFileSync("git", ["status", "--porcelain", "--untracked-files=no"], { cwd: root, encoding: "utf8" }).trim()) throw new Error("Candidate HEAD/clean tracked checkout required.");
  const sql = await fs.readFile(sqlPath);
  assert.equal(createHash("sha256").update(sql).digest("hex"), sqlHash);
  const secretInfo = await fs.stat(manifest.passwordFile);
  if ((secretInfo.mode & 0o077) !== 0) throw new Error("Password file must not be group/world accessible.");
  const password = (await fs.readFile(manifest.passwordFile, "utf8")).trimEnd();
  if (!password) throw new Error("Explicit password required.");
  const config = { host: manifest.host, port: manifest.port, database: manifest.database, user: manifest.user, password, ssl: false };
  if (!path.isAbsolute(output) || output.startsWith(root) || path.resolve(output) === path.resolve(manifest.passwordFile)) throw new Error("New evidence file must be outside checkout and separate from password file.");
  const outputFile = await fs.open(output, "wx", 0o600);
  const clients = new Set(), sources = new Set(), proxies = new Set();
  const marker = `vnext-lease-candidate:${manifest.runId}`;
  const result = { status: "RUNNING", scope: "ISOLATED_STORAGE_ONLY", gitHead: actualHead, sqlHash,
    node: process.version, driver: "pg@8.23.1", manifest: Object.fromEntries(["disposable", "kind", "runId", "gitHead", "imageDigest", "supabaseCliVersion", "pgVersion", "host", "port", "database", "user", "ssl", "allowSqlInstallAndCleanup", "allowLocalFaultProxy"].map((key) => [key, manifest[key]])),
    scenarios: [], events: [], actualA: "NOT_RUN", nativeP: "NOT_RUN", cleanup: "NOT_RUN" };
  result.manifest.timings = Object.fromEntries(["connectMs", "queryMs", "cleanupMs", "observeMs"].map((key) => [key, manifest.timings[key]]));
  let currentScenario = "preflight", rawSequence = 0;
  const stamp = (event, values = {}) => result.events.push({ event, scenario: currentScenario, monotonic: performance.now(), wall: new Date().toISOString(), ...values });
  const installation = result.installation = installState();
  const traces = sourceEvidence(stamp);
  async function open(owner = currentScenario) {
    const raw = new pg.Client({ ...config, application_name: "vnext-candidate-observer", pipeline: false,
      connectionTimeoutMillis: manifest.timings.connectMs, statement_timeout: manifest.timings.queryMs,
      lock_timeout: manifest.timings.queryMs, query_timeout: 0 });
    const c = ownRawClient(raw, { id: `raw-${++rawSequence}`, connectMs: manifest.timings.connectMs,
      queryMs: manifest.timings.queryMs, cleanupMs: manifest.timings.cleanupMs,
      emit: (event, values) => stamp(event, { ...values, owner }) });
    clients.add(c);
    await c.connect(); c.identify((await c.query("SELECT pg_backend_pid() pid")).rows[0].pid);
    return c;
  }
  const endRaw = (c) => c.end(); // keep inventory, including already ended/failed clients
  function source(command, overrides = {}) {
    const s = traces.track(createPgLeaseSource({ config: { ...config, ...overrides }, connectTimeoutMs: manifest.timings.connectMs,
      queryTimeoutMs: manifest.timings.queryMs, cleanupTimeoutMs: manifest.timings.cleanupMs }), { scenario: currentScenario, command });
    sources.add(s); return s;
  }
  const poll = (read) => pollObservation(read, manifest.timings.observeMs);
  async function waitForBlock(waiter, blocker, command) {
    const witness = await poll(async (timeoutMs) => {
      const row = (await observer.query("SELECT wait_event_type,pg_blocking_pids(pid) blockers FROM pg_stat_activity WHERE pid=$1", [waiter], { timeoutMs })).rows[0];
      return row?.wait_event_type === "Lock" && row.blockers.includes(blocker) ? row : null;
    });
    stamp("actual-lock-wait", { waiter, blocker, command, witness }); return true;
  }
  async function scenario(name, work) {
    currentScenario = name;
    stamp("scenario-start", { name });
    try { await work(); result.scenarios.push({ name, status: "PASS", claim: "isolated storage/driver only" }); }
    catch (error) { result.scenarios.push({ name, status: error.code === "ORACLE_INCONCLUSIVE" ? "INCONCLUSIVE" : "FAIL", code: error.code ?? "ASSERTION_OR_DRIVER_FAILURE" }); throw error; }
    finally { stamp("scenario-end", { name }); }
  }
  let observer;
  async function seed() {
    const session = `fixture-${randomUUID()}`, match = "m";
    await observer.query("INSERT INTO vnext_private.session_anchors(session_id,match_id,owner_id,stream_id,revision,phase,closed,failure_context_known) VALUES($1,$2,'o','stream',0,'WAITING',false,true)", [session, match]);
    await observer.query("INSERT INTO vnext_private.session_members VALUES($1,$2,'u',false)", [session, match]);
    const c = { contract: SESSION_CONTRACT, session, match, subject: "u", id: randomUUID(), kind: "set-ready", payload: { ready: true } };
    const command = { ...c, payloadHash: sessionCommandHash(c) };
    stamp("fixture-command", { command }); return command;
  }
  async function cut(c, timeoutMs) {
    // One statement snapshot for all three stored effects; not exact commit time.
    const value = (await observer.query("SELECT a.revision::int, m.ready, (SELECT count(*)::int FROM vnext_private.session_commands c WHERE c.session_id=a.session_id AND c.match_id=a.match_id) AS commands FROM vnext_private.session_anchors a JOIN vnext_private.session_members m USING(session_id,match_id) WHERE a.session_id=$1 AND a.match_id=$2", [c.session, c.match], { timeoutMs })).rows[0];
    stamp("independent-cut", { command: c, value }); return value;
  }
  const apply = async (s, c, signal) => {
    const value = await createSessionStorage({ connect: s.connect }).applyReady({ command: c, owner: "o", expectedRevision: 0, signal });
    stamp("storage-outcome", { command: c, outcome: value.outcome, value: value.value }); return value;
  };
  const lookup = async (c) => {
    const value = await createSessionStorage({ connect: source(c).connect }).readCommandStatus({ command: c, owner: "o" });
    assert.equal(value.outcome, "STORAGE_READ_CONFIRMED"); stamp("command-status", { command: c, value: value.value }); return value.value;
  };
  const reject = async (client, values, sqlstate, command, negativeCase) => {
    const value = await expectSqlstate(() => client.query(readySql, values), sqlstate);
    stamp("expected-rejection", { command, negativeCase, ...value }); return value;
  };
  try {
    observer = await open();
    const identity = (await observer.query("SELECT current_database() db,session_user,current_user,current_setting('server_version') version,current_setting('TimeZone') timezone,current_setting('fsync') fsync,current_setting('synchronous_commit') synchronous_commit,current_setting('transaction_isolation') isolation,current_setting('client_connection_check_interval',true) client_connection_check_interval,pg_backend_pid() pid")).rows[0];
    assert.equal(identity.db, manifest.database); assert.equal(identity.session_user, "postgres"); assert.equal(identity.current_user, "postgres"); assert.equal(identity.version, manifest.pgVersion);
    result.environment = identity;
    assert.equal((await observer.query("SELECT count(*)::int n FROM pg_namespace WHERE nspname='vnext_private'")).rows[0].n, 0);
    for (const role of roles) assert.equal((await observer.query("SELECT count(*)::int n FROM pg_roles WHERE rolname=$1", [role])).rows[0].n, 1);
    await scenario("original-sql-install-and-acl", async () => {
      await installOriginal(installation, observer, sql.toString(), "COMMENT ON SCHEMA vnext_private IS '" + marker + "'");
      assert.equal((await observer.query("SELECT obj_description(oid,'pg_namespace') marker FROM pg_namespace WHERE nspname='vnext_private'")).rows[0]?.marker, marker);
      installation.ownership = "EXACT_RUN_MARKER_OBSERVED";
      const funcs = (await observer.query("SELECT p.proname,p.prosecdef,p.proconfig,pg_get_userbyid(p.proowner) owner,p.proacl::text acl FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='vnext_private'")).rows;
      assert.deepEqual(funcs.map((f) => f.proname).sort(), [...ddlFunctions].sort());
      assert.ok(funcs.every((f) => !f.prosecdef && f.owner === "postgres" && f.proconfig?.includes('search_path=""')));
      result.acl = { functions: funcs, tables: (await observer.query("SELECT c.relname,c.relrowsecurity,c.relacl::text acl FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='vnext_private' AND c.relkind='r'")).rows };
      assert.equal(result.acl.tables.length, 3); assert.ok(result.acl.tables.every((t) => t.relrowsecurity));
      for (const role of roles) {
        assert.equal((await observer.query("SELECT has_schema_privilege($1,'vnext_private','USAGE') allowed", [role])).rows[0].allowed, false);
        for (const table of ["session_anchors", "session_members", "session_commands"]) {
          assert.equal((await observer.query("SELECT has_table_privilege($1,$2,'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') allowed", [role, `vnext_private.${table}`])).rows[0].allowed, false);
        }
        const exec = await observer.query("SELECT bool_or(has_function_privilege($1,p.oid,'EXECUTE')) allowed FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='vnext_private'", [role]);
        assert.equal(exec.rows[0].allowed, false);
        const c = await open();
        try {
          await c.query(`SET ROLE "${role}"`);
          for (const statement of ["SELECT * FROM vnext_private.session_anchors", "SELECT vnext_private.storage_owner_only()"])
            await assert.rejects(c.query(statement), (e) => e.code === "42501");
          await c.query("SELECT set_config('request.jwt.claims','{\"role\":\"postgres\"}',false)");
          await assert.rejects(c.query("SELECT vnext_private.storage_owner_only()"), (e) => e.code === "42501");
          stamp("set-role-negative-only", { role }); // not real login evidence
        } finally { await endRaw(c); }
      }
      await assert.rejects(observer.query(sql.toString()), (e) => e.code === "42P06");
      await observer.query("ROLLBACK");
    });
    await scenario("atomic-rollback-and-commit-cuts", async () => {
      const c = await seed(), writer = await open();
      await writer.query("BEGIN"); await writer.query(readySql, params(c));
      assert.deepEqual(await cut(c), { revision: 0, ready: false, commands: 0 });
      await writer.query("ROLLBACK"); assert.deepEqual(await cut(c), { revision: 0, ready: false, commands: 0 });
      await writer.query("BEGIN"); await writer.query(readySql, params(c));
      stamp("commit-dispatch"); await writer.query("COMMIT"); stamp("commit-response");
      assert.deepEqual(await cut(c), { revision: 1, ready: true, commands: 1 }); stamp("independent-commit-effect-observed");
    });
    await scenario("real-anchor-lock-same-id-and-unique-ledger", async () => {
      const c = await seed(), a = await open(), b = await open();
      await a.query("BEGIN"); await a.query(readySql, params(c));
      await b.query("BEGIN"); const pid = (await b.query("SELECT pg_backend_pid() pid")).rows[0].pid;
      const work = b.query(readySql, params(c)); work.catch(() => {});
      await waitForBlock(pid, a.inspect().backendPid, c); await a.query("COMMIT");
      const response = await work; await b.query("COMMIT"); recorded(response.rows[0].value, c);
      stamp("same-id-recorded", { command: c, value: response.rows[0].value });
      assert.deepEqual(await cut(c), { revision: 1, ready: true, commands: 1 });
      await assert.rejects(observer.query("INSERT INTO vnext_private.session_commands SELECT * FROM vnext_private.session_commands WHERE session_id=$1", [c.session]), (e) => e.code === "23505");
    });
    await scenario("same-id-hash-collision-and-competing-revisions", async () => {
      const c = await seed(); const initial = await apply(source(c), c);
      assert.equal(initial.outcome, "STORAGE_COMMIT_CONFIRMED"); recorded(initial.value, c);
      const changed = { ...c, payload: { ready: false } }; changed.payloadHash = sessionCommandHash(changed);
      await reject(observer, params(changed), "22023", changed);
      const d = await seed(), a = await open(), b = await open();
      const other = { ...d, id: randomUUID() };
      await a.query("BEGIN"); const winnerValue = (await a.query(readySql, params(d))).rows[0].value;
      await b.query("BEGIN");
      const pending = b.query(readySql, params(other));
      const loserResult = pending.then((value) => ({ status: "fulfilled", value }), (reason) => ({ status: "rejected", reason }));
      const blocked = await waitForBlock(b.inspect().backendPid, a.inspect().backendPid, other);
      stamp("competing-commit-dispatch", { command: d, backendPid: a.inspect().backendPid });
      const commit = await a.query("COMMIT"); assert.equal(commit.command, "COMMIT");
      const winner = { outcome: "STORAGE_COMMIT_CONFIRMED", value: winnerValue }, loser = await loserResult;
      await b.query("ROLLBACK");
      const winnerStatus = await lookup(d), loserStatus = await lookup(other), value = await cut(d);
      judgeCompetition({ blocked, winner, loser, winnerCommand: d, loserCommand: other, cut: value, winnerStatus, loserStatus });
      stamp("revision-competition", { winnerCommand: d, loserCommand: other, winner, loser: { status: loser.status, expectedSqlstate: "40001" }, winnerStatus, loserStatus, cut: value });
    });
    await scenario("scope-owner-terminal-and-failure-preconditions", async () => {
      const c = await seed();
      for (const [scoped, revision, owner, code, label] of [[{ ...c, session: "missing" }, 0, "o", "22023", "missing-session"], [{ ...c, subject: "outsider" }, 0, "o", "42501", "missing-subject"], [c, 1, "o", "40001", "stale-revision"], [c, 0, "stale", "40001", "stale-owner"]]) await reject(observer, params(scoped, revision, owner), code, scoped, label);
      for (const changes of ["closed=true", "abort_requested=true", "failure_context_known=false", "first_failure_at=clock_timestamp()-interval '60 seconds'", "phase='TERMINAL',terminal_id='terminal',terminal_at=clock_timestamp()"] ) {
        const d = await seed(); await observer.query(`UPDATE vnext_private.session_anchors SET ${changes} WHERE session_id=$1`, [d.session]);
        await reject(observer, params(d), "55000", d);
      }
    });
    await scenario("current-status-cut-and-share-lock", async () => {
      const c = await seed(), reader = await open(), writer = await open(); await apply(source(c), c);
      await reader.query("BEGIN");
      const current = await reader.query("SELECT vnext_private.storage_current($1,$2,'u','o') value", [c.session, c.match]);
      assert.equal(current.rows[0].value.revision, 1);
      stamp("current-projection", { command: c, value: current.rows[0].value, backendPid: reader.inspect().backendPid });
      await writer.query("BEGIN"); const pid = (await writer.query("SELECT pg_backend_pid() pid")).rows[0].pid;
      const waiting = writer.query("SELECT 1 FROM vnext_private.session_anchors WHERE session_id=$1 FOR UPDATE", [c.session]); waiting.catch(() => {});
      await waitForBlock(pid, reader.inspect().backendPid, c);
      await reader.query("COMMIT"); await waiting; await writer.query("ROLLBACK");
      recorded(await lookup(c), c);
    });
    for (const mode of ["drop-reply", "drop-before", "stall"]) await scenario(`actual-commit-fault-${mode}`, async () => {
      const c = await seed(), relayOwner = ownResource(() => startCommitFaultProxy({ port: config.port, mode }), {
        id: `relay-${proxies.size + 1}`, startMs: manifest.timings.connectMs, endMs: manifest.timings.cleanupMs, emit: stamp });
      proxies.add(relayOwner); const proxy = await relayOwner.open();
      const s = source(c, { port: proxy.port });
      const pending = apply(s, c); pending.catch(() => {});
      let fault;
      proxy.intercepted.then((value) => { fault = value; });
      await poll(() => fault); stamp("commit-fault", { ...fault, command: c, backendPid: proxy.backendPid() });
      if (mode === "drop-reply") await poll(async (timeoutMs) => (await cut(c, timeoutMs)).commands === 1);
      const outcome = await pending; assert.equal(outcome.outcome, "UNKNOWN");
      assert.ok(Number.isInteger(proxy.backendPid()));
      await poll(async (timeoutMs) => !(await observer.query("SELECT 1 FROM pg_stat_activity WHERE pid=$1", [proxy.backendPid()], { timeoutMs })).rowCount);
      stamp("backend-absence-observed", { command: c, backendPid: proxy.backendPid() });
      const status = await lookup(c);
      assert.equal(status.outcome, mode === "drop-reply" ? "RECORDED" : "UNKNOWN");
      const expected = mode === "drop-reply" ? { revision: 1, ready: true, commands: 1 } : { revision: 0, ready: false, commands: 0 };
      assert.deepEqual(await cut(c), expected);
      await relayOwner.close(); await s.close();
    });
    await scenario("abort-pending-query-and-fresh-connection", async () => {
      const s = source(null), controller = new AbortController(), lease = await s.connect({ signal: controller.signal });
      const pid = (await lease.query("SELECT pg_backend_pid() pid")).rows[0].pid;
      const slow = lease.query("SELECT pg_sleep(30)"); slow.catch(() => {});
      await poll(async (timeoutMs) => (await observer.query("SELECT wait_event FROM pg_stat_activity WHERE pid=$1", [pid], { timeoutMs })).rows[0]?.wait_event === "PgSleep");
      stamp("active-query-observed", { backendPid: pid });
      controller.abort(); await assert.rejects(slow); await lease.release();
      await poll(async (timeoutMs) => !(await observer.query("SELECT 1 FROM pg_stat_activity WHERE pid=$1", [pid], { timeoutMs })).rowCount);
      stamp("backend-absence-observed", { backendPid: pid });
      const next = await s.connect(), nextPid = (await next.query("SELECT pg_backend_pid() pid")).rows[0].pid;
      assert.notEqual(pid, nextPid); stamp("fresh-backend-observed", { oldPid: pid, nextPid }); await next.release(); await s.close();
    });
    result.status = "STORAGE_CASES_COMPLETED";
    result.remaining = ["actual login for negative roles", "exact C timestamp/WAL oracle", "controlled WAL/crash durability", "driver cleanup failure under OS failure", "late release under actual OS stall", "actual trusted A/current/fence/native P", "full safety11/game/browser/operations"];
  } catch (error) { result.status = "FAILED_OR_INCONCLUSIVE"; result.failureCode = error.code ?? "ASSERTION_OR_DRIVER_FAILURE"; }
  finally {
    const cleanup = [];
    for (const p of proxies) {
      try { await p.close(); } catch { cleanup.push(`proxy-close:${p.inspect().id}`); }
      if (p.inspect().startup !== "LOCAL_CONFIRMED" && !cleanup.includes(`proxy-close:${p.inspect().id}`)) cleanup.push(`proxy-close:${p.inspect().id}`);
    }
    currentScenario = "cleanup";
    for (const s of sources) try { await s.close(); } catch { cleanup.push("source-close-or-evidence-unconfirmed"); }
    for (const c of clients) try { await endRaw(c); } catch { cleanup.push(`client-end:${c.inspect().id}`); }
    let cleaner;
    const schema = await cleanupSchema(installation, {
      marker,
      observe: async () => {
        cleaner ??= await open("schema-cleanup");
        const found = (await cleaner.query("SELECT oid,obj_description(oid,'pg_namespace') marker FROM pg_namespace WHERE nspname='vnext_private'")).rows[0];
        stamp("schema-inventory-observed", { oid: found?.oid ?? null, matchesRunMarker: found?.marker === marker, presence: found ? "PRESENT" : "ABSENT" });
        return found;
      },
      drop: async (oid) => {
        // Recheck the same inventory identity immediately before the owned DROP.
        const found = (await cleaner.query("SELECT oid,obj_description(oid,'pg_namespace') marker FROM pg_namespace WHERE nspname='vnext_private'")).rows[0];
        if (found?.oid !== oid || found?.marker !== marker) throw inconclusive("Owned schema identity changed.");
        await cleaner.query("DROP SCHEMA vnext_private CASCADE");
      },
    });
    if (schema.status === "INCONCLUSIVE") cleanup.push("schema-or-install-outcome-unconfirmed");
    // open() inventories a client even if connection/identity acquisition fails.
    for (const c of clients) try { await endRaw(c); } catch { if (!cleanup.includes(`client-end:${c.inspect().id}`)) cleanup.push(`client-end:${c.inspect().id}`); }
    result.sources = traces.snapshot(); result.rawConnections = [...clients].map((c) => c.inspect());
    result.relays = [...proxies].map((p) => p.inspect());
    result.cleanup = { status: cleanup.length ? "INCONCLUSIVE" : "COMPLETED_OWNED_LOCAL_RESOURCES_ONLY", schema, remaining: cleanup,
      databaseBackendTermination: "ONLY_EXPLICIT_SCENARIO_OBSERVATIONS; LOCAL_END_IS_NOT_DB_TERMINATION",
      externalContainerDatabasePasswordFile: "EXTERNAL_OWNER_CLEANUP_REQUIRED" };
    if (cleanup.length) result.status = "FAILED_OR_INCONCLUSIVE";
    try { await outputFile.writeFile(JSON.stringify(result, null, 2) + "\n"); } finally { await outputFile.close(); }
  }
  return result;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.length !== 6 || process.argv[2] !== "--execute" || process.argv[4] !== "--output") {
    console.error("NOT_RUN: explicit separately authorized --execute MANIFEST --output NEW_RESULT_FILE required."); process.exitCode = 2;
  } else {
    try {
      const result = await runCandidate(JSON.parse(await fs.readFile(process.argv[3], "utf8")), process.argv[5]);
      console.log(JSON.stringify({ status: result.status, cases: result.scenarios.length, actualA: result.actualA, nativeP: result.nativeP }));
      if (result.status !== "STORAGE_CASES_COMPLETED") process.exitCode = 1;
    } catch { console.error("NOT_RUN or preflight failure; no credentials are printed."); process.exitCode = 1; }
  }
}
