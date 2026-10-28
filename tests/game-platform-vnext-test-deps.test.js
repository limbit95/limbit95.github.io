import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { createPgLeaseSource } from "../services/game-platform-vnext/connectionLease.mjs";
import { validateManifest } from "./game-db-integration/vnext-storage-candidate/run.mjs";
import { createOwner, cleanupOwner, prepare, installedInventory, runOwnedChild } from "../scripts/prepare-game-platform-vnext-test-deps.mjs";

// Offline file/process ownership contracts. No fake PG driver, registry request,
// Client instance, DB/socket/SQL, runCandidate, or production authority.
const repository = fileURLToPath(new URL("../", import.meta.url));
const source = path.join(repository, "services/game-platform-vnext");
function fixture(t) {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "vnext-deps-contract-"));
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  const root = path.join(base, "checkout"), tempParent = path.join(base, "external");
  fs.mkdirSync(path.join(root, "node_modules"), { recursive: true });
  fs.mkdirSync(path.join(root, "services/game-platform-vnext"), { recursive: true });
  fs.mkdirSync(tempParent);
  for (const name of ["package.json", "package-lock.json"]) fs.copyFileSync(path.join(source, name), path.join(root, "services/game-platform-vnext", name));
  return { root, tempParent, githubOutput: path.join(base, "github-output") };
}
const journal = (state) => JSON.parse(fs.readFileSync(state.ownerFile));
function write(state) { fs.writeFileSync(state.ownerFile, JSON.stringify(state)); }
function ownedLink(state) {
  // Empty filesystem target for ownership/cleanup only; never loaded as a driver.
  fs.mkdirSync(state.target, { recursive: true }); fs.symlinkSync(state.target, state.link, "dir");
  const stat = fs.lstatSync(state.link); state.linkIdentity = { dev: stat.dev, ino: stat.ino }; write(state);
}

test("dependency owner refuses checkout-local staging and symlinked root modules", (t) => {
  const f = fixture(t);
  assert.throws(() => createOwner({ ...f, tempParent: f.root }), { code: "INSTALL_MUST_BE_OUTSIDE_CHECKOUT" });
  fs.rmdirSync(path.join(f.root, "node_modules")); fs.symlinkSync(f.tempParent, path.join(f.root, "node_modules"));
  assert.throws(() => createOwner(f), { code: "REGULAR_DIRECTORY_REQUIRED" });
  assert.deepEqual(fs.readdirSync(f.tempParent), []);
});

test("dependency preparation preserves existing directories and dangling pg links", (t) => {
  const f = fixture(t), link = path.join(f.root, "node_modules/pg");
  fs.mkdirSync(link); fs.writeFileSync(path.join(link, "foreign"), "owner");
  assert.throws(() => createOwner(f), { code: "EXISTING_PG_NOT_OWNED" });
  assert.equal(fs.readFileSync(path.join(link, "foreign"), "utf8"), "owner");
  fs.rmSync(link, { recursive: true }); fs.symlinkSync(path.join(f.tempParent, "absent"), link);
  assert.throws(() => createOwner(f), { code: "EXISTING_PG_NOT_OWNED" });
  assert.equal(fs.readlinkSync(link), path.join(f.tempParent, "absent"));
});

test("exact pin mismatch cannot start installation or allocate a stage", async (t) => {
  const f = fixture(t), filename = path.join(f.root, "services/game-platform-vnext/package.json");
  fs.writeFileSync(filename, fs.readFileSync(filename, "utf8").replace('"8.23.1"', '"^8.23.1"'));
  let calls = 0;
  await assert.rejects(prepare({ ...f, install: async () => { calls++; } }), { code: "EXACT_PRIVATE_PG_LOCK_REQUIRED" });
  assert.equal(calls, 0); assert.deepEqual(fs.readdirSync(f.tempParent), []);
});

test("installer failure has an early recovery output, exact copied bytes and owned cleanup", async (t) => {
  const f = fixture(t); let state;
  await assert.rejects(prepare({ ...f, install: async (s) => {
    state = s;
    assert.equal(fs.readFileSync(f.githubOutput, "utf8"), `owner=${s.ownerFile}\n`);
    for (const name of ["package.json", "package-lock.json"]) assert.deepEqual(fs.readFileSync(path.join(s.installDirectory, name)), fs.readFileSync(path.join(source, name)));
    throw Object.assign(new Error("do-not-record-credential-payload"), { code: "OFFLINE_INSTALL_FAILURE" });
  } }), { code: "PREPARATION_FAILED" });
  assert.equal(journal(state).preparation, "FAILED_OR_INTERRUPTED");
  assert.equal(journal(state).cleanup, "OWNED_LINK_AND_INSTALL_REMOVED_JOURNAL_RETAINED");
  assert.equal(fs.existsSync(state.installDirectory), false); assert.equal(fs.existsSync(state.link), false);
  assert.equal(fs.readFileSync(state.ownerFile, "utf8").includes("do-not-record-credential-payload"), false);
});

test("failure writing Actions output cleans owned install and retains recoverable journal", (t) => {
  const f = fixture(t);
  assert.throws(() => createOwner({ ...f, githubOutput: f.tempParent }), { code: "OWNER_SETUP_FAILED" });
  const dirs = fs.readdirSync(f.tempParent); assert.equal(dirs.length, 1);
  const state = JSON.parse(fs.readFileSync(path.join(f.tempParent, dirs[0], "owner.json")));
  assert.equal(state.preparation, "FAILED_OR_INTERRUPTED");
  assert.equal(state.cleanup, "OWNED_LINK_AND_INSTALL_REMOVED_JOURNAL_RETAINED");
});

test("cleanup removes only its proven link and install; other root dependencies survive", (t) => {
  const f = fixture(t), state = createOwner(f);
  fs.writeFileSync(path.join(f.root, "node_modules", "other-owner"), "keep"); ownedLink(state);
  assert.equal(cleanupOwner(state.ownerFile, { root: f.root }).cleanup, "OWNED_LINK_AND_INSTALL_REMOVED_JOURNAL_RETAINED");
  assert.equal(fs.existsSync(state.installDirectory), false);
  assert.equal(fs.readFileSync(path.join(f.root, "node_modules", "other-owner"), "utf8"), "keep");
  assert.equal(cleanupOwner(state.ownerFile, { root: f.root }).cleanup, "OWNED_LINK_AND_INSTALL_REMOVED_JOURNAL_RETAINED");
});

test("foreign/replaced link and uncertain creation gap retain install with INCONCLUSIVE", (t) => {
  const f = fixture(t), state = createOwner(f); ownedLink(state);
  fs.unlinkSync(state.link); fs.symlinkSync(f.tempParent, state.link);
  assert.throws(() => cleanupOwner(state.ownerFile, { root: f.root }), { code: "CLEANUP_UNCONFIRMED" });
  assert.equal(journal(state).cleanup, "INCONCLUSIVE_EXTERNAL_OWNER_REQUIRED");
  assert.equal(fs.existsSync(state.installDirectory), true); assert.equal(fs.readlinkSync(state.link), f.tempParent);
  fs.unlinkSync(state.link); fs.symlinkSync(state.target, state.link); state.linkIdentity = null; write(state);
  assert.throws(() => cleanupOwner(state.ownerFile, { root: f.root }), { code: "CLEANUP_UNCONFIRMED" });
  assert.equal(fs.lstatSync(state.link).isSymbolicLink(), true);
});

test("cleanup response needs observed absence; a recreated path is never deleted by old ownership", (t) => {
  const f = fixture(t), state = createOwner(f); ownedLink(state);
  assert.throws(() => cleanupOwner(state.ownerFile, { root: f.root, removeInstall(dir) {
    fs.rmSync(dir, { recursive: true }); fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, "new-owner"), "must-survive");
  } }), { code: "CLEANUP_UNCONFIRMED" });
  assert.equal(journal(state).cleanupCode, "RESOURCE_PATH_REAPPEARED");
  assert.equal(journal(state).cleanup, "INCONCLUSIVE_EXTERNAL_OWNER_REQUIRED");
  assert.throws(() => cleanupOwner(state.ownerFile, { root: f.root }), { code: "CLEANUP_UNCONFIRMED" });
  assert.equal(fs.readFileSync(path.join(state.installDirectory, "new-owner"), "utf8"), "must-survive");
  const f2 = fixture(t), second = createOwner(f2), done = cleanupOwner(second.ownerFile, { root: f2.root });
  fs.mkdirSync(done.installDirectory); fs.writeFileSync(path.join(done.installDirectory, "new-owner"), "after-completion");
  // Even an inode/dev collision cannot renew an already completed deletion grant.
  const replacement = fs.statSync(done.installDirectory); done.installIdentity = { dev: replacement.dev, ino: replacement.ino }; write(done);
  assert.throws(() => cleanupOwner(done.ownerFile, { root: f2.root }), { code: "CLEANUP_UNCONFIRMED" });
  assert.equal(fs.readFileSync(path.join(done.installDirectory, "new-owner"), "utf8"), "after-completion");
});

test("cleanup refuses root ownership change and forged cross-checkout journal", (t) => {
  const f = fixture(t), state = createOwner(f);
  fs.renameSync(state.modules, state.modules + "-original"); fs.mkdirSync(state.modules);
  assert.throws(() => cleanupOwner(state.ownerFile, { root: f.root }), { code: "CLEANUP_UNCONFIRMED" });
  assert.equal(fs.existsSync(state.installDirectory), true);
  assert.throws(() => cleanupOwner(state.ownerFile, { root: f.tempParent }), { code: "OWNER_IDENTITY_MISMATCH" });
});

test("partial cleanup failure permanently closes even a removed link's reused identity", (t) => {
  const f = fixture(t), state = createOwner(f); ownedLink(state);
  assert.throws(() => cleanupOwner(state.ownerFile, { root: f.root, removeInstall() {
    assert.equal(fs.existsSync(state.link), false);
    assert.equal(journal(state).cleanupAuthorityClosed, true); // persisted before removal
    throw Object.assign(new Error("fixture-only"), { code: "EACCES" });
  } }), { code: "CLEANUP_UNCONFIRMED" });
  const failed = journal(state);
  assert.equal(failed.cleanupCode, "EACCES");
  assert.equal(failed.cleanupCompleted, false);
  assert.equal(failed.cleanupAuthorityClosed, true);
  // Deterministically model reused identity, not filesystem allocation timing.
  ownedLink(failed);
  fs.writeFileSync(path.join(failed.target, "foreign"), "keep-after-partial-failure");
  for (let i = 0; i < 2; i++) {
    assert.throws(() => cleanupOwner(state.ownerFile, { root: f.root }), { code: "CLEANUP_UNCONFIRMED" });
    assert.equal(journal(state).cleanupCode, "CLEANUP_AUTHORITY_CLOSED");
    assert.equal(fs.readlinkSync(state.link), state.target);
    assert.equal(fs.readFileSync(path.join(state.target, "foreign"), "utf8"), "keep-after-partial-failure");
  }
});

test("completed cleanup survives a later child diagnostic and never renews deletion authority", (t) => {
  const f = fixture(t), state = createOwner(f);
  const done = cleanupOwner(state.ownerFile, { root: f.root });
  // Exercise migration of an old completed journal as well as the new history.
  delete done.cleanupCompleted; delete done.cleanupAuthorityClosed;
  done.installer = { status: "UNCONFIRMED" }; write(done);
  assert.throws(() => cleanupOwner(state.ownerFile, { root: f.root }), { code: "CLEANUP_UNCONFIRMED" });
  const refused = journal(state);
  assert.equal(refused.cleanupCode, "CHILD_TERMINATION_UNCONFIRMED");
  assert.equal(refused.cleanupCompleted, true);
  assert.equal(refused.cleanup, "INCONCLUSIVE_EXTERNAL_OWNER_REQUIRED");
  refused.installer = { status: "EXITED" };
  fs.mkdirSync(refused.installDirectory);
  fs.writeFileSync(path.join(refused.installDirectory, "foreign"), "keep-after-diagnostic");
  const stat = fs.statSync(refused.installDirectory);
  refused.installIdentity = { dev: stat.dev, ino: stat.ino }; write(refused);
  for (let i = 0; i < 2; i++) {
    assert.throws(() => cleanupOwner(state.ownerFile, { root: f.root }), { code: "CLEANUP_UNCONFIRMED" });
    assert.equal(journal(state).cleanupCompleted, true);
    assert.equal(fs.readFileSync(path.join(state.installDirectory, "foreign"), "utf8"), "keep-after-diagnostic");
  }
});

for (const resource of ["modules", "installDirectory"]) {
  for (const kind of ["symlink", "file"]) {
    test(`cleanup closes ownership after ${resource} becomes a ${kind}`, (t) => {
      const f = fixture(t), state = createOwner(f); ownedLink(state);
      const location = state[resource], original = location + "-original";
      fs.renameSync(location, original);
      if (kind === "symlink") fs.symlinkSync(original, location);
      else fs.writeFileSync(location, "foreign-replacement");
      assert.throws(() => cleanupOwner(state.ownerFile, { root: f.root }), { code: "CLEANUP_UNCONFIRMED" });
      assert.equal(journal(state).cleanupCode, "REGULAR_DIRECTORY_REQUIRED");
      assert.equal(journal(state).cleanupAuthorityClosed, true);
      if (kind === "symlink") assert.equal(fs.readlinkSync(location), original);
      else assert.equal(fs.readFileSync(location, "utf8"), "foreign-replacement");
      // Restore even the exact original inode: observed ownership loss stays closed.
      fs.unlinkSync(location); fs.renameSync(original, location);
      fs.writeFileSync(path.join(location, "foreign"), "keep-after-type-change");
      const persisted = journal(state);
      if (!fs.existsSync(state.link)) ownedLink(persisted);
      for (let i = 0; i < 2; i++) {
        assert.throws(() => cleanupOwner(state.ownerFile, { root: f.root }), { code: "CLEANUP_UNCONFIRMED" });
        assert.equal(journal(state).cleanupCode, "CLEANUP_AUTHORITY_CLOSED");
        assert.equal(fs.readFileSync(path.join(location, "foreign"), "utf8"), "keep-after-type-change");
        assert.equal(fs.readlinkSync(state.link), state.target);
      }
    });
  }
}

test("deadline and explicit interruption never become successful child completion", async () => {
  const timed = await runOwnedChild(process.execPath, ["-e", "setInterval(() => {}, 1000)"], { timeoutMs: 100, graceMs: 100 });
  assert.notEqual(timed.status, "EXITED"); assert.equal(timed.status, "DEADLINE");
  const controller = new AbortController(); controller.abort();
  const interrupted = await runOwnedChild(process.execPath, ["-e", "process.exit(0)"], { signal: controller.signal });
  assert.equal(interrupted.status, "INTERRUPTED_BEFORE_SPAWN");
});

test("saved cleanup never kills a live installer and may retry after its observed exit", async (t) => {
  const f = fixture(t), state = createOwner(f), controller = new AbortController();
  const child = await runOwnedChild(process.execPath, ["-e", "setInterval(() => {}, 1000)"], { signal: controller.signal, timeoutMs: 1000, graceMs: 100,
    onSpawn(pid) {
      state.installer = { status: "RUNNING", pid }; write(state);
      assert.throws(() => cleanupOwner(state.ownerFile, { root: f.root }), { code: "CLEANUP_UNCONFIRMED" });
      assert.equal(journal(state).cleanupCode, "CHILD_TERMINATION_UNCONFIRMED");
      controller.abort();
    } });
  assert.equal(child.status, "INTERRUPTED");
  state.installer = child; write(state);
  assert.equal(cleanupOwner(state.ownerFile, { root: f.root }).cleanup, "OWNED_LINK_AND_INSTALL_REMOVED_JOURNAL_RETAINED");
});

test("real installed pg and transitive lock inventory serve both actual import consumers", () => {
  const req = createRequire(path.join(source, "package.json")), realPg = fs.realpathSync(path.join(repository, "node_modules/pg"));
  assert.equal(pg.Client, req("pg").Client);
  assert.equal(typeof createPgLeaseSource, "function"); assert.equal(typeof validateManifest, "function");
  assert.equal(fs.realpathSync(req.resolve("pg")).startsWith(realPg + path.sep), true);
  const lock = JSON.parse(fs.readFileSync(path.join(source, "package-lock.json")));
  const installed = installedInventory(path.dirname(path.dirname(realPg)), lock);
  assert.equal(installed.find((r) => r.path === "node_modules/pg").version, "8.23.1");
  assert.equal(installed.filter((r) => !r.optional).every((r) => r.installed), true);
  const altered = structuredClone(lock); altered.packages["node_modules/pg-types"].version = "0.0.0";
  assert.throws(() => installedInventory(path.dirname(path.dirname(realPg)), altered), { code: "INSTALLED_VERSION_MISMATCH" });
});

test("both full-test workflows prepare after root ci and always clean without narrowing tests", () => {
  for (const filename of ["game-platform-governance.yml", "site-static-checks.yml"]) {
    const workflow = fs.readFileSync(path.join(repository, ".github/workflows", filename), "utf8");
    const rootCi = workflow.indexOf("run: npm ci --no-audit --no-fund"), prepareAt = workflow.indexOf("run: node scripts/prepare-game-platform-vnext-test-deps.mjs prepare");
    assert.ok(rootCi > 0 && prepareAt > rootCi);
    assert.equal(workflow.indexOf("run: npm ci --no-audit --no-fund", rootCi + 1), -1);
    assert.ok(workflow.indexOf("run: npm run test:game-platform") > prepareAt);
    assert.ok(workflow.indexOf("run: npm run build:assets") > prepareAt);
    assert.match(workflow, /if: \$\{\{ always\(\) && steps\.private-test-deps\.outputs\.owner != '' \}\}/u);
    assert.match(workflow, /GAME_PLATFORM_TEST_DEPS_OWNER: \$\{\{ steps\.private-test-deps\.outputs\.owner \}\}/u);
    assert.ok(workflow.indexOf("run: node scripts/prepare-game-platform-vnext-test-deps.mjs cleanup") > workflow.indexOf("run: npm run test:game-platform"));
  }
  const governance = fs.readFileSync(path.join(repository, ".github/workflows/game-platform-governance.yml"), "utf8");
  assert.match(governance.split("jobs:")[0], /- "scripts\/prepare-game-platform-vnext-test-deps\.mjs"/u);
  assert.match(governance, /timeout-minutes: 5/u);
  assert.match(governance, /--base "\$\{\{ github\.event\.pull_request\.base\.sha \}\}"/u);
});

test('jose existing dangling link is refused before allocation', (t)=>{
 const f=fixture(t), link=path.join(f.root,'node_modules/jose');fs.symlinkSync(path.join(f.tempParent,'absent'),link);
 assert.throws(()=>createOwner(f),{code:'EXISTING_JOSE_NOT_OWNED'});assert.deepEqual(fs.readdirSync(f.tempParent),[]);
});
test('jose creation gap preserves both links and install without spending another deletion attempt', (t)=>{
 const f=fixture(t),s=createOwner(f);ownedLink(s);fs.symlinkSync(s.joseTarget,s.joseLink);
 assert.throws(()=>cleanupOwner(s.ownerFile,{root:f.root}),{code:'CLEANUP_UNCONFIRMED'});
 assert.equal(fs.lstatSync(s.link).isSymbolicLink(),true);assert.equal(fs.existsSync(s.installDirectory),true);
 assert.throws(()=>cleanupOwner(s.ownerFile,{root:f.root}),{code:'CLEANUP_UNCONFIRMED'});
});
test('both owned dependency links clean once; later jose replacement survives', (t)=>{
 const f=fixture(t),s=createOwner(f);ownedLink(s);fs.symlinkSync(s.joseTarget,s.joseLink);const st=fs.lstatSync(s.joseLink);s.joseIdentity={dev:st.dev,ino:st.ino};write(s);
 cleanupOwner(s.ownerFile,{root:f.root});assert.equal(fs.existsSync(s.joseLink),false);
 fs.symlinkSync(f.tempParent,s.joseLink);assert.throws(()=>cleanupOwner(s.ownerFile,{root:f.root}),{code:'CLEANUP_UNCONFIRMED'});assert.equal(fs.readlinkSync(s.joseLink),f.tempParent);
});
