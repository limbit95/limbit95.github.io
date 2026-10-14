import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createExecutionScope } from '../games/shared/vnext/core/executionScope.js';
import { createExecutionBindings } from '../games/shared/vnext/core/executionBindings.js';
import { GAME_REGISTRY, getRegisteredGame } from '../games/shared/registry.js';

function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function fixture() {
  const metadata = Object.freeze({ id: 'fixture' });
  const model = Object.freeze({ contract: 'fixture/1', isApplicable: () => true });
  const bindings = createExecutionBindings({ lookupGame: (id) => id === metadata.id ? metadata : null,
    resolveModel: (contract) => contract === model.contract ? model : null });
  return { metadata, model, bindings };
}
const completions = ['success', 'error', 'null', 'finally', 'cleanup', 'leave', 'effect', 'followup'];

for (const scenario of [
  { name: 'T01 same room, new match', from: { room: 'A', match: 1 }, to: [{ room: 'A', match: 2 }] },
  { name: 'T02 A to B to A', from: { room: 'A' }, to: [{ room: 'B' }, { room: 'A' }] },
  { name: 'T03 role/view/user transition', from: { user: 'one', role: 'player', view: 'private' },
    to: [{ user: 'two', role: 'spectator', view: 'public' }] },
  { name: 'roomless run/view transition', from: { run: 1, view: 'local' }, to: [{ run: 2, view: 'local' }] },
]) test(scenario.name + ' isolates every completion path and old cleanup', async () => {
  let context = scenario.from;
  const scope = createExecutionScope({ isApplicable: (input) => input.context === context });
  const old = scope.capture(context);
  const incoming = deferred();
  const state = { marks: [], busy: true };
  let oldReleased = 0, newReleased = 0;
  await old.own('old', () => { oldReleased++; });
  const late = incoming.promise.then(() => {
    for (const kind of completions) assert.equal(old.commit({ kind }, () => state.marks.push(kind)), false);
  });
  for (const next of scenario.to) { context = next; await scope.advance(); }
  const current = scope.capture(context);
  await current.own('new', () => { newReleased++; });
  incoming.resolve(); await late; await old.dispose();
  assert.deepEqual(state, { marks: [], busy: true });
  assert.equal(oldReleased, 1); assert.equal(newReleased, 0);
  for (const kind of completions) assert.equal(current.commit({ kind }, () => state.marks.push(kind)), true);
  assert.deepEqual(state.marks, completions);
  await scope.dispose(); assert.equal(newReleased, 1);
});

test('awaited success/rejection/finally cannot overwrite a newer execution', async () => {
  const scope = createExecutionScope({ isApplicable: () => true });
  const task = scope.capture(); const pending = deferred(); const marks = [];
  const consumer = (async () => {
    try { const value = await pending.promise; task.commit(value, () => marks.push('success')); }
    catch (error) { task.commit(error, () => marks.push('error')); }
    finally { task.commit(null, () => marks.push('finally')); await task.dispose(); }
  })();
  await scope.advance(); pending.reject(new Error('old private error')); await consumer;
  assert.deepEqual(marks, []); await scope.dispose();
});

test('model applicability is required, evaluated at each commit, and may reject ordering or permission', async () => {
  let authorized = true; let currentVersion = 5;
  const scope = createExecutionScope({ isApplicable: ({ completion }) => authorized && completion.version >= currentVersion });
  const task = scope.capture(); let state = 0;
  assert.equal(task.commit({ version: 4 }, () => state++), false);
  assert.equal(task.commit({ version: 5 }, () => state++), true);
  authorized = false;
  assert.equal(task.commit({ version: 99 }, () => state++), false);
  assert.equal(state, 1); await scope.dispose();
  const unsupported = createExecutionScope();
  assert.equal(unsupported.capture().commit({}, () => state++), false); await unsupported.dispose();
});

test('reentrant applicability transition or disposal is checked before application', async () => {
  for (const mode of ['advance', 'dispose', 'task-dispose']) {
    let scope, task, cleanup; let changed = false;
    scope = createExecutionScope({ isApplicable: () => {
      cleanup = mode === 'task-dispose' ? task.dispose() : scope[mode](); return true;
    } });
    task = scope.capture();
    assert.equal(task.commit({}, () => { changed = true; }), false);
    assert.equal(changed, false); await cleanup; await scope.dispose();
  }
});

test('asynchronous work stays outside the atomic application and is rechecked after await', async () => {
  const scope = createExecutionScope({ isApplicable: () => true }); const task = scope.capture();
  let changed = false;
  assert.throws(() => task.commit({}, async () => { changed = true; }), /synchronous/);
  assert.equal(changed, false);
  const pending = deferred();
  const work = pending.promise.then((value) => task.commit(value, () => { changed = true; }));
  const cleanup = scope.advance(); pending.resolve(1); assert.equal(await work, false);
  await cleanup; await scope.dispose();
});

test('current authoritative/authorized revalidation can admit older data without reviving its old task', async () => {
  let context = { view: 'old' }; let authoritative = false;
  const scope = createExecutionScope({ isApplicable: (input) => input.context === context && authoritative });
  const old = scope.capture(context); const data = { issued: 'earlier', value: 7 }; let state;
  context = { view: 'current' }; await scope.advance();
  assert.equal(old.commit(data, () => { state = data.value; }), false);
  const current = scope.capture(context);
  assert.equal(current.commit(data, () => { state = data.value; }), false);
  authoritative = true;
  assert.equal(current.commit(data, () => { state = data.value; }), true);
  assert.equal(state, 7); assert.equal(old.isCurrent(), false); await scope.dispose();
});

test('dispose invalidates before cleanup, releases in reverse order and memoizes reentrant/repeated releases', async () => {
  const scope = createExecutionScope({ isApplicable: () => true }); const task = scope.capture(); const order = [];
  const gate = deferred(); let lease;
  await task.own('first', (value) => order.push(value));
  lease = await task.own('second', async (value) => {
    assert.equal(task.commit({}, () => assert.fail('disposed commit')), false);
    assert.equal(lease.release(), lease.release()); order.push(value); await gate.promise;
  });
  const first = scope.dispose(); assert.equal(first, scope.dispose()); assert.equal(task.isCurrent(), false);
  gate.resolve(); await first; await task.dispose();
  assert.deepEqual(order, ['second', 'first']);
  assert.throws(() => scope.capture(), /disposed/); assert.throws(() => scope.advance(), /disposed/);
});

test('independent cleanup failures are aggregated without reactivation or successful-release duplication', async () => {
  const scope = createExecutionScope({ isApplicable: () => true }); const task = scope.capture(); const attempted = [];
  await task.own('a', (value) => attempted.push(value));
  await task.own('b', (value) => { attempted.push(value); throw new Error('b failed'); });
  await task.own('c', (value) => attempted.push(value));
  await assert.rejects(scope.dispose(), AggregateError); await assert.rejects(scope.dispose(), AggregateError);
  assert.deepEqual(attempted, ['c', 'b', 'a']); assert.equal(task.isCurrent(), false);
});

test('late resource acquisition after disposal is cleaned by its captured owner, including observable failure', async () => {
  const scope = createExecutionScope(); const task = scope.capture(); const late = deferred(); const releases = [];
  const acquire = late.promise.then((resource) => task.own(resource, (owned) => releases.push(owned)));
  await scope.dispose(); late.resolve('old'); await acquire; assert.deepEqual(releases, ['old']);
  await assert.rejects(task.own('failed', () => { throw new Error('late release failed'); }), /late release failed/);
});

test('two executions release only their own shared-resource usage rights', async () => {
  const a = createExecutionScope(); const b = createExecutionScope(); const site = { uses: new Set(['a', 'b']), destroyed: false };
  await a.own('a', (right) => site.uses.delete(right)); await b.own('b', (right) => site.uses.delete(right));
  await a.dispose(); assert.deepEqual([...site.uses], ['b']); assert.equal(site.destroyed, false);
  await b.dispose(); assert.equal(site.uses.size, 0);
});

test('default execution model resolution remains unsupported and existing Registry metadata is unchanged', async () => {
  const before = JSON.stringify(GAME_REGISTRY); const bindings = createExecutionBindings();
  bindings.register('cant-stop', { modelContract: 'unimplemented/1', initialize: () => assert.fail('unsupported init') });
  await assert.rejects(bindings.start('cant-stop'), /Unsupported selected model/);
  assert.equal(JSON.stringify(GAME_REGISTRY), before);
  assert.throws(() => bindings.register('absent', { modelContract: 'fixture/1', initialize() {} }), /Unknown registered/);
  assert.throws(() => bindings.register('cant-stop', { title: 'duplicate metadata' }), /metadata stays/);
});

test('composition returns original metadata and selected-model handle without copying the catalog', async () => {
  const { metadata, model, bindings } = fixture();
  bindings.register('fixture', { modelContract: 'fixture/1', initialize: ({ metadata: m, model: selected, scope }) => {
    assert.equal(m, metadata); assert.equal(selected, model); return scope.capture();
  } });
  const run = await bindings.start('fixture'); assert.equal(run.metadata, metadata);
  assert.equal(run.value.commit({}, () => {}), true); await run.dispose();
});

test('duplicate/malformed registrations and wrong model revision are rejected before initialization', async () => {
  const { bindings } = fixture(); const initialize = () => assert.fail('unsupported init');
  bindings.register('fixture', { modelContract: 'fixture/2', initialize });
  assert.throws(() => bindings.register('fixture', { modelContract: 'fixture/1', initialize }), /Duplicate/);
  await assert.rejects(bindings.start('fixture'), /Unsupported/);
  const b = fixture().bindings;
  for (const modelContract of ['', 'latest', 'fixture/0', 'fixture/1junk']) {
    assert.throws(() => b.register('fixture', { modelContract, initialize }), /explicit model revision/);
  }
});

test('registration replacement invalidates old executions and old disposer cannot remove a new binding', async () => {
  const { bindings } = fixture(); const released = [];
  const oldLease = bindings.register('fixture', { modelContract: 'fixture/1', initialize: async ({ scope }) => {
    await scope.own('old', (x) => released.push(x)); return scope.capture();
  } });
  const old = await bindings.start('fixture');
  const newLease = bindings.register('fixture', { modelContract: 'fixture/1', initialize: ({ scope }) => scope.capture() }, { replace: true });
  assert.equal(old.value.commit({}, () => assert.fail('old execution')), false);
  await newLease.previousDisposal; await oldLease.dispose();
  const next = await bindings.start('fixture'); assert.equal(next.value.commit({}, () => {}), true);
  assert.deepEqual(released, ['old']); await newLease.dispose();
  assert.equal(next.value.isCurrent(), false); await assert.rejects(bindings.start('fixture'), /No current/);
});

test('partial initialization failure cleans only acquired resources and reports cleanup failure separately', async () => {
  const { bindings } = fixture(); const released = [];
  bindings.register('fixture', { modelContract: 'fixture/1', initialize: async ({ scope }) => {
    await scope.own('acquired', (x) => released.push(x));
    await scope.own('failed-cleanup', () => { throw new Error('cleanup failed'); });
    throw new Error('initialize failed');
  } });
  await assert.rejects(bindings.start('fixture'), (error) => {
    assert.ok(error instanceof AggregateError); assert.equal(error.errors[0].message, 'initialize failed');
    assert.ok(error.errors[1] instanceof AggregateError); return true;
  });
  assert.deepEqual(released, ['acquired']);
});

test('replacement during awaited initialization cannot activate an old run and its late resource is released', async () => {
  const { bindings } = fixture(); const pending = deferred(); const released = [];
  bindings.register('fixture', { modelContract: 'fixture/1', initialize: async ({ scope }) => {
    await pending.promise; await scope.own('late', (x) => released.push(x)); return 'old';
  } });
  const oldStart = bindings.start('fixture');
  const next = bindings.register('fixture', { modelContract: 'fixture/1', initialize: () => 'new' }, { replace: true });
  pending.resolve(); await assert.rejects(oldStart, /changed during initialization/);
  assert.deepEqual(released, ['late']); await next.previousDisposal;
  const run = await bindings.start('fixture'); assert.equal(run.value, 'new'); await next.dispose();
});

test('reentrant model resolution or applicability replacement never commits under an old binding', async () => {
  const metadata = Object.freeze({ id: 'fixture' }); let bindings; let replacement; let resolveReentrantly = false;
  const config = { modelContract: 'fixture/1', initialize: ({ scope }) => scope.capture() };
  const model = { contract: 'fixture/1', isApplicable: () => {
    replacement = bindings.register('fixture', config, { replace: true }); return true;
  } };
  bindings = createExecutionBindings({ lookupGame: () => metadata, resolveModel: () => {
    if (resolveReentrantly) replacement = bindings.register('fixture', config, { replace: true }); return model;
  } });
  bindings.register('fixture', config); const run = await bindings.start('fixture');
  assert.equal(run.value.commit({}, () => assert.fail('reentrant application')), false);
  await replacement.previousDisposal;
  resolveReentrantly = true; await assert.rejects(bindings.start('fixture'), /changed during model resolution/);
  await replacement.previousDisposal; await replacement.dispose();
});

test('metadata identity change is not accepted as the same execution', async () => {
  let metadata = Object.freeze({ id: 'fixture' });
  const bindings = createExecutionBindings({ lookupGame: () => metadata,
    resolveModel: () => ({ contract: 'fixture/1', isApplicable: () => true }) });
  const lease = bindings.register('fixture', { modelContract: 'fixture/1', initialize: ({ scope }) => scope.capture() });
  const run = await bindings.start('fixture'); metadata = Object.freeze({ id: 'fixture' });
  assert.equal(run.value.commit({}, () => assert.fail('changed metadata')), false); await lease.dispose();
});

test('context cleanup failure does not revive old work or prevent a fresh current task', async () => {
  const scope = createExecutionScope({ isApplicable: () => true }); const old = scope.capture();
  await old.own('old', () => { throw new Error('old cleanup'); });
  await assert.rejects(scope.advance(), AggregateError);
  const current = scope.capture();
  assert.equal(old.commit({}, () => assert.fail('old commit')), false);
  assert.equal(current.commit({}, () => {}), true);
  await assert.rejects(scope.dispose(), AggregateError);
  assert.equal(current.isCurrent(), false);
});

test('model unknown/false/throw and async applicability never act as authorization', async () => {
  for (const policy of [() => undefined, () => 'allowed', () => false, () => { throw new Error('unknown policy'); }]) {
    const scope = createExecutionScope({ isApplicable: policy }); const task = scope.capture(); let changed = false;
    try { assert.equal(task.commit({}, () => { changed = true; }), false); }
    catch (error) { assert.equal(error.message, 'unknown policy'); }
    assert.equal(changed, false); await scope.dispose();
  }
  assert.throws(() => createExecutionScope({ isApplicable: async () => true }), /synchronous/);
  const metadata = Object.freeze({ id: 'fixture' });
  const bindings = createExecutionBindings({ lookupGame: () => metadata,
    resolveModel: () => ({ contract: 'fixture/1', isApplicable: async () => true }) });
  bindings.register('fixture', { modelContract: 'fixture/1', initialize: () => assert.fail('async model') });
  await assert.rejects(bindings.start('fixture'), /Unsupported/);
});

test('Registry lookup uses the original metadata reference even in a fixture-only composition', async () => {
  const model = { contract: 'fixture/1', isApplicable: () => true };
  const bindings = createExecutionBindings({ resolveModel: () => model });
  const registration = bindings.register('cant-stop', { modelContract: 'fixture/1', initialize: () => null });
  const run = await bindings.start('cant-stop'); assert.equal(run.metadata, getRegisteredGame('cant-stop'));
  await run.dispose(); await registration.dispose();
});

test('documented small Core example executes the real implementation without a production model', async () => {
  const { readFileSync } = await import('node:fs');
  const { execFileSync } = await import('node:child_process');
  const guide = readFileSync(new URL('../games/README.md', import.meta.url), 'utf8');
  const source = guide.match(/<!-- STEP7C_CORE_EXAMPLE -->[\s\S]*?```js\n([\s\S]*?)```/u)?.[1];
  assert.ok(source);
  const result = execFileSync(process.execPath, ['--input-type=module'], {
    cwd: new URL('../', import.meta.url), input: source, encoding: 'utf8',
  });
  assert.deepEqual(JSON.parse(result), { shown: 7, acceptedOld: false });
});
