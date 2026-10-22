import assert from "node:assert/strict";
import test from "node:test";
import { createCoopSession } from "../games/shared/vnext/models/coopSession.js";
import { SESSION_CONTRACT, sessionCommandHash, prepareSessionCommand, inspectSessionCommand } from "../services/game-platform-vnext/sessionControl.mjs";

const context = (match = "m1", overrides = {}) => ({ session: "s1", match, user: "u1", view: "v1", role: "player", ...overrides });
const state = (ctx = context(), revision = 1, overrides = {}) => ({ contract: SESSION_CONTRACT,
  context: ctx, owner: "owner1", stream: "stream1", revision, terminal: false, state: { ready: false }, ...overrides });
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
async function flush() { for (let i = 0; i < 40; i += 1) await Promise.resolve(); }
function clock() {
  let serial = 0;
  const timeouts = new Map(), intervals = new Map();
  return { timeouts, intervals,
    setTimeout(fn) { const id = ++serial; timeouts.set(id, fn); return id; }, clearTimeout(id) { timeouts.delete(id); },
    setInterval(fn) { const id = ++serial; intervals.set(id, fn); return id; }, clearInterval(id) { intervals.delete(id); },
    quiet() { for (const fn of [...intervals.values()]) fn(); },
    expire() { for (const [id, fn] of [...timeouts]) { timeouts.delete(id); fn(); } } };
}
function harness(options = {}) {
  const timers = clock(), events = [], stops = [], reads = [], notices = [];
  const model = createCoopSession({ quietMs: 100, timeoutMs: 50, timers,
    readCurrent(ctx, info) { reads.push({ ctx, ...info }); return state(ctx); },
    observe(ctx, event) { events.push(event); return () => stops.push(ctx); },
    onState(value) { notices.push(value); }, ...options });
  return { model, timers, events, stops, reads, notices };
}
const command = (id = "cmd1") => ({ id, payloadHash: "server-must-check-this-hash", payload: { ready: true } });

test("initial read never wins over invalidation during the read; full refresh is coalesced", async () => {
  const old = deferred(); let reads = 0;
  const h = harness({ readCurrent: (ctx) => ++reads === 1 ? old.promise : state(ctx, 2) });
  const connected = h.model.activate(context()); await flush();
  h.events[0]({ revision: 2, arbitraryPayload: "not adopted" }); old.resolve(state(context(), 1));
  assert.equal(await connected, true); assert.equal(reads, 2);
  assert.equal(h.model.getState().snapshot.revision, 2); await h.model.dispose();
});
test("quiet reconciliation detects the last lost notification without another event", async () => {
  let revision = 1; const h = harness({ readCurrent: (ctx) => state(ctx, revision) });
  await h.model.activate(context()); revision = 2; h.timers.quiet(); await flush();
  assert.equal(h.model.getState().snapshot.revision, 2); await h.model.dispose();
});
test("gap/overflow signals block input and replace the full state rather than applying event payload", async () => {
  const current = deferred(); let calls = 0;
  const h = harness({ readCurrent: (ctx) => ++calls === 1 ? state(ctx) : current.promise });
  await h.model.activate(context()); h.events[0]({ kind: "overflow", revision: 999, state: { ready: true } }); await flush();
  assert.equal(h.model.getState().phase, "RECOVERING");
  await assert.rejects(h.model.submit(command()), /require current/);
  current.resolve(state(context(), 5)); await flush();
  assert.equal(h.model.getState().snapshot.revision, 5); await h.model.dispose();
});
test("bounded repeated invalidation produces visible failure instead of an endless initial spinner", async () => {
  let event; const h = harness({ maxRefreshes: 2, observe(ctx, fn) { event = fn; return () => {}; },
    readCurrent(ctx) { event(); return state(ctx); } });
  assert.equal(await h.model.activate(context()), false);
  assert.equal(h.model.getState().phase, "DEGRADED"); assert.match(h.model.getState().error.message, /overflow/); await h.model.dispose();
});
test("same revision conflicting contents and foreign owner/view cannot be adopted", async () => {
  for (const invalid of [state(context(), 1, { state: { ready: true } }), state(context(), 2, { owner: "old" }), state(context("m1", { view: "other" }), 2)]) {
    let reads = 0; const h = harness({ readCurrent: (ctx) => ++reads === 1 ? state(ctx) : invalid });
    await h.model.activate(context()); assert.equal(await h.model.reconcile(), false);
    assert.equal(h.model.getState().snapshot, null); assert.equal(h.model.getState().phase, "DEGRADED"); await h.model.dispose();
  }
});
test("duplicate full state retains adopted value identity and is not a new command/effect", async () => {
  const h = harness(); await h.model.activate(context()); const first = h.model.getState().snapshot;
  await h.model.reconcile(); assert.equal(h.model.getState().snapshot, first); await h.model.dispose();
});
test("T01 new match, T02 A-B-A and T03 user/role/view changes reject all old read completions", async () => {
  for (const next of [context("m2"), context("m1", { user: "u2", role: "spectator", view: "v2" }), "ABA"]) {
    const old = deferred(); let calls = 0;
    const h = harness({ readCurrent: (ctx) => ++calls === 1 ? old.promise : state(ctx, 2) });
    const initial = h.model.activate(context()); await flush();
    if (next === "ABA") { await h.model.activate(context("m2")); await h.model.activate(context()); }
    else await h.model.activate(next);
    old.resolve(state(context(), 999)); await initial; await flush();
    assert.equal(h.model.getState().snapshot.revision, 2); assert.notEqual(h.model.getState().phase, "DEGRADED");
    await h.model.dispose();
  }
});
test("late observer acquired after dispose is released by its old owner; repeated dispose shares completion", async () => {
  const observer = deferred(); let released = 0;
  const h = harness({ observe: () => observer.promise }); const initial = h.model.activate(context()); await flush();
  const a = h.model.dispose(), b = h.model.dispose(); assert.equal(a, b); await a;
  observer.resolve(() => { released += 1; }); await initial; await flush();
  assert.equal(released, 1); assert.equal(h.model.getState().phase, "DISPOSED");
});
test("observer and current-read timeout are visible; late response cannot reopen a disposed model", async () => {
  for (const observerStall of [true, false]) {
    const stalled = deferred(); const h = harness(observerStall ? { observe: () => stalled.promise } : { readCurrent: () => stalled.promise });
    const initial = h.model.activate(context()); await flush(); h.timers.expire(); await initial;
    assert.equal(h.model.getState().phase, "DEGRADED"); await h.model.dispose();
    stalled.resolve(observerStall ? () => {} : state()); await flush();
    assert.equal(h.model.getState().phase, "DISPOSED");
  }
});
test("synchronous consumer reentrancy cannot resurrect disposed state or recurse without bound", async () => {
  let model; let noticed = 0;
  const h = harness({ onState(value) { noticed += 1; if (value.phase === "LIVE") void model.dispose(); else void model.reconcile("reentrant"); } });
  model = h.model; await model.activate(context());
  assert.equal(model.getState().phase, "DISPOSED"); assert.ok(noticed < 5); await model.dispose();
});

test("F2 LIVE notification reentry drains a new full read without a quiet tick before reporting success", async () => {
  for (const source of ["reconcile", "observer"]) {
    let model, h, reentered = false, reads = 0, nested;
    const refreshed = deferred();
    h = harness({ readCurrent(ctx) { reads += 1; return reads === 1 ? state(ctx, 1) : refreshed.promise; },
      onState(value) {
        if (value.phase === "LIVE" && !reentered) {
          reentered = true;
          if (source === "observer") h.events[0]();
          else nested = model.reconcile("LIVE consumer invalidation");
        }
      } });
    model = h.model; let settled = false;
    const initial = model.activate(context()).then((result) => { settled = true; return result; });
    await flush();
    assert.equal(reads, 2, source); assert.equal(settled, false, source);
    assert.equal(model.getState().phase, "RECOVERING", source);
    refreshed.resolve(state(context(), 2));
    assert.equal(await initial, true); if (nested) assert.equal(await nested, true);
    assert.equal(model.getState().phase, "LIVE"); assert.equal(model.getState().snapshot.revision, 2);
    await model.dispose();
  }
});

test("F2 repeated LIVE reentry reaches the existing overflow bound and reports failure", async () => {
  let model, reads = 0;
  const h = harness({ maxRefreshes: 2, readCurrent(ctx) { reads += 1; return state(ctx, reads); },
    onState(value) { if (value.phase === "LIVE") void model.reconcile("again"); } });
  model = h.model;
  assert.equal(await model.activate(context()), false);
  assert.equal(reads, 2); assert.equal(model.getState().phase, "DEGRADED");
  assert.match(model.getState().error.message, /overflow/); await model.dispose();
});

test("F2 LIVE callback context replacement cannot report the old activation as current success", async () => {
  let model, replacement;
  const h = harness({ onState(value) {
    if (value.phase === "LIVE" && value.snapshot.context.match === "m1") replacement = model.activate(context("m2"));
  } });
  model = h.model;
  assert.equal(await model.activate(context()), false);
  assert.equal(await replacement, true); assert.equal(model.getState().snapshot.context.match, "m2");
  await model.dispose();
});
test("terminal snapshot stays terminal under events/quiet loss and rejects commands", async () => {
  const h = harness({ readCurrent: (ctx) => state(ctx, 1, { terminal: true }) });
  await h.model.activate(context()); h.events[0](); h.timers.quiet(); await flush();
  assert.equal(h.model.getState().phase, "TERMINAL"); await assert.rejects(h.model.submit(command()), /No current/); await h.model.dispose();
});

test("F3 terminal execution cannot be reopened by same-context activation at lower or higher revisions", async () => {
  for (const revision of [0, 99]) {
    let calls = 0;
    const h = harness({ readCurrent(ctx) { calls += 1; return calls === 1 ? state(ctx, 5, { terminal: true }) : state(ctx, revision); } });
    await h.model.activate(context());
    await assert.rejects(h.model.activate(context()), /Terminal execution/);
    assert.equal(calls, 1); assert.equal(h.model.getState().phase, "TERMINAL");
    assert.equal(h.model.getState().snapshot.revision, 5); await h.model.dispose();
  }
});

test("F3 terminal session/match knowledge survives view/user/role changes and A-B-A within this model instance", async () => {
  let calls = 0;
  const h = harness({ readCurrent(ctx) { calls += 1; return state(ctx, calls, { terminal: ctx.match === "m1" }); } });
  await h.model.activate(context());
  for (const next of [context("m1", { view: "other" }), context("m1", { user: "other", role: "spectator" })]) {
    await assert.rejects(h.model.activate(next), /Terminal execution/);
  }
  assert.equal(await h.model.activate(context("m2")), true);
  await assert.rejects(h.model.activate(context()), /Terminal execution/);
  assert.equal(calls, 2); assert.equal(h.model.getState().snapshot.context.match, "m2");
  await h.model.dispose();
});

test("F3 a different session or match remains distinct; tombstones are not backend admission or durable storage", async () => {
  const h = harness({ readCurrent: (ctx) => state(ctx, 1, { terminal: ctx.session === "s1" && ctx.match === "m1" }) });
  await h.model.activate(context());
  assert.equal(await h.model.activate(context("m1", { session: "s2" })), true);
  assert.equal(h.model.getState().snapshot.context.session, "s2");
  assert.equal(await h.model.activate(context("m2")), true);
  assert.equal(h.model.getState().snapshot.context.match, "m2"); await h.model.dispose();
});
test("ordinary callback returning a promise is visibly unsupported and rejection is observed", async () => {
  const h = harness({ onState(value) { if (value.phase === "LIVE") return Promise.reject(new Error("async callback failed")); } });
  assert.equal(await h.model.activate(context()), false);
  assert.equal(h.model.getState().phase, "DEGRADED"); assert.match(h.model.getState().error.message, /must not return a promise/);
  await h.model.dispose();
});
test("cleanup failure remains observable after other independent resources release", async () => {
  const h = harness({ observe: () => () => { throw new Error("stop failed"); } }); await h.model.activate(context());
  await assert.rejects(h.model.dispose(), /cleanup failed/); assert.equal(h.timers.intervals.size, 0);
});
test("ACK loss retains same command identity; lookup does not replay mutation and ACK cannot supply state", async () => {
  let submits = 0, lookups = 0;
  const h = harness({ submitCommand() { submits += 1; throw new Error("ACK lost"); },
    readCommandStatus(ctx, input) { lookups += 1; assert.equal(input.id, "cmd1"); return { committed: true, snapshot: state(ctx, 999) }; } });
  await h.model.activate(context()); const input = command();
  assert.equal((await h.model.submit(input)).outcome, "UNKNOWN");
  await assert.rejects(h.model.submit(input), /status lookup/);
  await assert.rejects(h.model.lookupCommand({ ...input, payload: { ready: false } }), /conflict/);
  assert.equal((await h.model.lookupCommand(input)).outcome, "RESPONSE");
  assert.equal(submits, 1); assert.equal(lookups, 1); assert.equal(h.model.getState().snapshot.revision, 1); await h.model.dispose();
});
test("in-flight command old success/error cannot reflect into a new match", async () => {
  for (const fail of [false, true]) {
    const ack = deferred(); const h = harness({ submitCommand: () => ack.promise });
    await h.model.activate(context()); const pending = h.model.submit(command()); await flush();
    await h.model.activate(context("new")); if (fail) ack.reject(new Error("old failure")); else ack.resolve({ ack: true });
    await pending; assert.equal(h.model.getState().snapshot.context.match, "new"); assert.equal(h.model.getState().phase, "LIVE"); await h.model.dispose();
  }
});

const serverState = () => ({ session: "s1", match: "m1", owner: "owner1", revision: 7, phase: "WAITING", members: [{ id: "u1", ready: false }, { id: "u2", ready: false }] });
function serverCommand(kind = "set-ready") {
  const command = { contract: SESSION_CONTRACT, id: "c1", session: "s1", match: "m1", subject: "u1", kind, payload: { ready: true } };
  return { ...command, payloadHash: sessionCommandHash(command) };
}
test("server candidate computes a scoped immutable ready write proposal; it is never commit/admission", () => {
  const original = serverState(), cmd = serverCommand(); const result = prepareSessionCommand(original, cmd);
  assert.equal(result.kind, "SESSION_WRITE_PROPOSAL"); assert.equal(result.expectedRevision, 7);
  assert.equal(result.next.members[0].ready, true); assert.equal(result.next.members[1].ready, false);
  assert.equal(original.members[0].ready, false); assert.equal(result.next.revision, 8); assert.equal(result.committed, undefined);
});
test("server candidate rejects malformed hashes, foreign contexts/nonmembers and terminal mutation", () => {
  const s = serverState(), c = serverCommand();
  assert.throws(() => prepareSessionCommand(s, { ...c, payloadHash: "forged" }), /hash/);
  assert.throws(() => prepareSessionCommand(s, { ...c, match: "old" }), /scope/);
  const outsider = { ...c, subject: "other" }; outsider.payloadHash = sessionCommandHash(outsider);
  assert.throws(() => prepareSessionCommand(s, outsider), /not a session member/);
  assert.throws(() => prepareSessionCommand({ ...s, phase: "TERMINAL" }, c), /Terminal/);
});
test("unresolved start/rematch/terminal/caller policy never returns a fabricated success", () => {
  for (const kind of ["start", "rematch", "terminate", "join"]) assert.throws(() => prepareSessionCommand(serverState(), serverCommand(kind)), /Unimplemented command policy/);
});
test("ledger inspection preserves UNKNOWN and same-ID collisions; it does not execute a duplicate", () => {
  const c = serverCommand(); assert.equal(inspectSessionCommand(null, c).outcome, "UNKNOWN");
  const record = { id: c.id, payloadHash: c.payloadHash, session: c.session, match: c.match, subject: c.subject, outcome: "DB_RECORDED" };
  assert.deepEqual(inspectSessionCommand(record, c).record, record);
  assert.throws(() => inspectSessionCommand({ ...record, payloadHash: "other" }, c), /collision/);
  assert.throws(() => inspectSessionCommand({ ...record, subject: "other" }, c), /collision/);
});
