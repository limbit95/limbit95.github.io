import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { createHash, randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

// Test jobs only. Never connects to PG, runs SQL, or supplies runtime authority.
const SOURCE = "services/game-platform-vnext";
const PREFIX = "game-platform-test-deps-";
const CI_ARGS = ["ci", "--ignore-scripts", "--no-audit", "--no-fund"];
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const fault = (code) => Object.assign(new Error(code), { code });
const inside = (parent, child) => child === parent || child.startsWith(parent + path.sep);
const identity = (stat) => ({ dev: stat.dev, ino: stat.ino });
const same = (a, b) => a?.dev === b?.dev && a?.ino === b?.ino;
function info(filename) {
  try { return fs.lstatSync(filename); } catch (error) { if (error.code === "ENOENT") return null; throw error; }
}
function directory(filename) {
  const stat = info(filename);
  if (!stat?.isDirectory() || stat.isSymbolicLink()) throw fault("REGULAR_DIRECTORY_REQUIRED");
  return identity(stat);
}
function save(state) {
  const temporary = path.join(state.ownerDirectory, "owner.next.json");
  fs.writeFileSync(temporary, JSON.stringify(state, null, 2) + "\n", { mode: 0o600 });
  fs.renameSync(temporary, state.ownerFile);
}
function rootInfo(root) {
  const repository = fs.realpathSync(root);
  const modules = path.join(repository, "node_modules");
  return { repository, modules, modulesIdentity: directory(modules), link: path.join(modules, "pg") };
}
function inputs(repository) {
  const source = path.join(repository, SOURCE);
  const bytes = Object.fromEntries(["package.json", "package-lock.json"].map((name) => [name, fs.readFileSync(path.join(source, name))]));
  const pkg = JSON.parse(bytes["package.json"]), lock = JSON.parse(bytes["package-lock.json"]);
  if (pkg.private !== true || pkg.dependencies?.pg !== "8.23.1" || lock.lockfileVersion !== 3
    || lock.packages?.[""]?.dependencies?.pg !== "8.23.1" || lock.packages?.["node_modules/pg"]?.version !== "8.23.1") throw fault("EXACT_PRIVATE_PG_LOCK_REQUIRED");
  return { bytes, lock, hashes: Object.fromEntries(Object.entries(bytes).map(([name, value]) => [name, hash(value)])) };
}

export function createOwner({ root, tempParent, githubOutput } = {}) {
  const roots = rootInfo(root);
  if (info(roots.link)) throw fault("EXISTING_PG_NOT_OWNED"); // includes dangling links
  const parent = fs.realpathSync(tempParent);
  if (inside(roots.repository, parent)) throw fault("INSTALL_MUST_BE_OUTSIDE_CHECKOUT");
  const source = inputs(roots.repository);
  const ownerDirectory = fs.mkdtempSync(path.join(parent, PREFIX));
  fs.chmodSync(ownerDirectory, 0o700);
  const installDirectory = path.join(ownerDirectory, "install");
  fs.mkdirSync(installDirectory, { mode: 0o700 });
  const state = { schemaVersion: 1, scope: "OFFLINE_TEST_DEPENDENCIES_ONLY", owner: randomUUID(),
    ...roots, ownerDirectory, ownerDirectoryIdentity: directory(ownerDirectory),
    ownerFile: path.join(ownerDirectory, "owner.json"), installDirectory, installIdentity: directory(installDirectory),
    target: path.join(installDirectory, "node_modules/pg"), linkIdentity: null,
    sourceHashes: source.hashes, node: process.version, platform: process.platform, arch: process.arch,
    preparerPid: process.pid, preparation: "PREPARING", cleanup: "PENDING", cleanupAttempts: [], operations: [], installer: { status: "NOT_STARTED" } };
  try {
    save(state);
    // Publish recovery identity BEFORE npm starts; always-cleanup can consume it
    // even when this prepare step fails. The small journal is retained, not shipped.
    if (githubOutput) fs.appendFileSync(githubOutput, `owner=${state.ownerFile}\n`);
    for (const [name, bytes] of Object.entries(source.bytes)) fs.writeFileSync(path.join(installDirectory, name), bytes);
  } catch {
    state.preparation = "FAILED_OR_INTERRUPTED";
    try { save(state); cleanupOwner(state.ownerFile, { root: state.repository }); } catch {}
    throw Object.assign(fault("OWNER_SETUP_FAILED"), { ownerFile: state.ownerFile });
  }
  return state;
}

function groupAlive(pid) {
  if (!Number.isSafeInteger(pid) || pid < 1) return false;
  try { process.kill(-pid, 0); return true; } catch (error) { return error.code !== "ESRCH"; }
}
function processAlive(pid) {
  if (!Number.isSafeInteger(pid) || pid < 1) return false;
  try { process.kill(pid, 0); return true; } catch (error) { return error.code !== "ESRCH"; }
}

// A bounded local child owner. Signals target only this newly spawned process
// group; cleanup from a saved journal NEVER kills a possibly reused PID.
export function runOwnedChild(command, args, { cwd, signal, timeoutMs = 120_000, graceMs = 1_000, capture = false, onSpawn = () => {} } = {}) {
  if (process.platform === "win32") throw fault("POSIX_TEST_JOB_REQUIRED");
  return new Promise((resolve) => {
    if (signal?.aborted) { resolve({ status: "INTERRUPTED_BEFORE_SPAWN" }); return; }
    const child = spawn(command, args, { cwd, detached: true, stdio: ["ignore", capture ? "pipe" : "ignore", "ignore"] });
    let finished = false, stopped = null, output = "", overflow = false;
    let killTimer, endTimer;
    const finish = (record) => {
      if (finished) return;
      finished = true;
      clearTimeout(deadline); clearTimeout(killTimer); clearTimeout(endTimer);
      signal?.removeEventListener("abort", abort);
      child.stdout?.destroy();
      child.unref();
      resolve({ ...record, pid: child.pid ?? null, ...(capture && !overflow ? { stdout: output } : {}) });
    };
    const stop = (reason) => {
      if (finished || stopped) return;
      stopped = reason;
      try { process.kill(-child.pid, "SIGTERM"); } catch {}
      killTimer = setTimeout(() => { try { process.kill(-child.pid, "SIGKILL"); } catch {} }, graceMs);
      endTimer = setTimeout(() => finish({ status: "UNCONFIRMED", reason }), graceMs * 2);
    };
    const abort = () => stop("INTERRUPTED");
    const deadline = setTimeout(() => stop("DEADLINE"), timeoutMs);
    signal?.addEventListener("abort", abort, { once: true });
    child.once("spawn", () => {
      try { onSpawn(child.pid); } catch { stop("OWNER_PERSISTENCE_FAILED"); }
      if (signal?.aborted) abort();
    });
    child.stdout?.on("data", (chunk) => {
      if (output.length + chunk.length > 65_536) { overflow = true; stop("OUTPUT_LIMIT"); }
      else output += chunk.toString();
    });
    child.once("error", () => finish({ status: "SPAWN_FAILED" }));
    child.once("close", (code, endedBySignal) => finish({ status: groupAlive(child.pid) ? "UNCONFIRMED" : stopped ?? "EXITED",
      code, signal: endedBySignal, ...(overflow ? { reason: "OUTPUT_LIMIT" } : {}) }));
  });
}

async function ownedCommand(state, command, args, options) {
  const result = await runOwnedChild(command, args, { ...options, onSpawn(pid) {
    state.installer = { status: "RUNNING", pid }; save(state);
  } });
  state.installer = { ...result }; delete state.installer.stdout;
  state.operations.push({ command: path.basename(command), args: options.capture ? ["VERSION_OR_IMPORT_PROBE"] : args,
    ...state.installer });
  save(state);
  if (result.status !== "EXITED" || result.code !== 0) throw fault("CHILD_FAILED_OR_UNCONFIRMED");
  return result.stdout;
}

async function installLocked(state, { signal }) {
  const version = (await ownedCommand(state, "npm", ["--version"], { cwd: state.installDirectory, signal, timeoutMs: 10_000, capture: true })).trim();
  if (!/^\d+\.\d+\.\d+$/u.test(version)) throw fault("NPM_VERSION_UNCONFIRMED");
  state.npm = version; save(state);
  await ownedCommand(state, "npm", CI_ARGS, { cwd: state.installDirectory, signal });
}

export function installedInventory(installDirectory, lock) {
  const records = [];
  for (const [name, entry] of Object.entries(lock.packages)) {
    if (!name) continue;
    if (!/^node_modules\/(?:@[^/]+\/)?[^/]+$/u.test(name)) throw fault("UNEXPECTED_LOCK_LAYOUT");
    const dir = path.join(installDirectory, name), stat = info(dir);
    if (!stat && entry.optional) { records.push({ path: name, version: entry.version, optional: true, installed: false }); continue; }
    directory(dir);
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, "package.json")));
    if (pkg.version !== entry.version) throw fault("INSTALLED_VERSION_MISMATCH");
    records.push({ path: name, version: pkg.version, optional: entry.optional === true, installed: true, integrity: entry.integrity });
  }
  const actual = fs.readdirSync(path.join(installDirectory, "node_modules")).filter((n) => !n.startsWith("."));
  if (actual.some((n) => !Object.hasOwn(lock.packages, `node_modules/${n}`))) throw fault("UNLOCKED_INSTALLED_PACKAGE");
  return records;
}

async function verifyConsumers(state, signal) {
  // The ESM eval has the SAME directory as connectionLease.mjs. Import its
  // actual module and the actual runner; do not create a Client or runCandidate.
  const program = `
    import pg from 'pg';
    import fs from 'node:fs';
    import { createRequire } from 'node:module';
    import { fileURLToPath, pathToFileURL } from 'node:url';
    const req = createRequire(pathToFileURL(process.cwd() + '/package.json'));
    const lease = await import(pathToFileURL(process.cwd() + '/connectionLease.mjs'));
    const runner = await import(pathToFileURL(${JSON.stringify(path.join(state.repository, "tests/game-db-integration/vnext-storage-candidate/run.mjs"))}));
    console.log(JSON.stringify({ esmEntry: fs.realpathSync(fileURLToPath(import.meta.resolve('pg'))),
      requireEntry: fs.realpathSync(req.resolve('pg')), sameClient: pg.Client === req('pg').Client,
      leaseFactory: typeof lease.createPgLeaseSource, runnerValidator: typeof runner.validateManifest, node: process.version }));
  `;
  const proof = JSON.parse(await ownedCommand(state, process.execPath, ["--input-type=module", "--eval", program],
    { cwd: path.join(state.repository, SOURCE), signal, capture: true, timeoutMs: 10_000 }));
  const target = fs.realpathSync(state.target);
  if (!inside(target, proof.esmEntry) || !inside(target, proof.requireEntry) || proof.sameClient !== true
    || proof.leaseFactory !== "function" || proof.runnerValidator !== "function") throw fault("CONSUMER_RESOLUTION_MISMATCH");
  proof.sourceHashes = Object.fromEntries([`${SOURCE}/connectionLease.mjs`, "tests/game-db-integration/vnext-storage-candidate/run.mjs"]
    .map((name) => [name, hash(fs.readFileSync(path.join(state.repository, name)))]));
  return proof;
}

function readOwner(ownerFile, root) {
  if (!info(ownerFile)?.isFile() || info(ownerFile).isSymbolicLink()) throw fault("REGULAR_OWNER_FILE_REQUIRED");
  const state = JSON.parse(fs.readFileSync(ownerFile));
  const repository = fs.realpathSync(root), ownerDirectory = fs.realpathSync(path.dirname(ownerFile));
  if (state.schemaVersion !== 1 || state.scope !== "OFFLINE_TEST_DEPENDENCIES_ONLY" || !/^[0-9a-f-]{36}$/u.test(state.owner)
    || state.repository !== repository || state.ownerFile !== path.join(ownerDirectory, "owner.json")
    || path.resolve(ownerFile) !== state.ownerFile || state.ownerDirectory !== ownerDirectory
    || inside(repository, ownerDirectory) || !path.basename(ownerDirectory).startsWith(PREFIX)
    || !same(directory(ownerDirectory), state.ownerDirectoryIdentity)
    || state.installDirectory !== path.join(ownerDirectory, "install")
    || state.target !== path.join(state.installDirectory, "node_modules/pg")
    || state.modules !== path.join(repository, "node_modules") || state.link !== path.join(state.modules, "pg")) throw fault("OWNER_IDENTITY_MISMATCH");
  return state;
}

export function cleanupOwner(ownerFile, { root, removeInstall = (directory) => fs.rmSync(directory, { recursive: true }) } = {}) {
  const state = readOwner(ownerFile, root);
  // Completion is history, not the latest diagnostic result (also accept old journals).
  state.cleanupCompleted ||= state.cleanup === "OWNED_LINK_AND_INSTALL_REMOVED_JOURNAL_RETAINED";
  try {
    if (state.cleanupOwnershipLost) throw fault("OWNERSHIP_PREVIOUSLY_LOST");
    if (state.cleanupCompleted
      && (info(state.link) || info(state.installDirectory))) throw fault("RESOURCE_PATH_REAPPEARED");
    if (state.cleanupAuthorityClosed && !state.cleanupCompleted) throw fault("CLEANUP_AUTHORITY_CLOSED");
    if (state.preparation === "PREPARING" && state.preparerPid !== process.pid && processAlive(state.preparerPid)) throw fault("PREPARER_STILL_ACTIVE");
    if (state.installer.status === "RUNNING" || state.installer.status === "UNCONFIRMED"
      || groupAlive(state.installer.pid)) throw fault("CHILD_TERMINATION_UNCONFIRMED");
    if (!state.cleanupCompleted) {
      // Spend this journal's deletion authority BEFORE ownership checks or mutation.
      // Any subsequent error (including a partial removal/type change) leaves it
      // closed. A retry may observe completed absence, never delete again.
      state.cleanupAuthorityClosed = true;
      save(state);
      if (!same(directory(state.modules), state.modulesIdentity)) throw fault("ROOT_MODULES_OWNER_CHANGED");
      const link = info(state.link);
      if (link) {
        if (!link.isSymbolicLink() || !same(identity(link), state.linkIdentity)
          || path.resolve(path.dirname(state.link), fs.readlinkSync(state.link)) !== state.target) throw fault("PG_LINK_OWNER_CHANGED");
        fs.unlinkSync(state.link);
      }
      if (info(state.installDirectory)) {
        if (!same(directory(state.installDirectory), state.installIdentity)) throw fault("INSTALL_OWNER_CHANGED");
        removeInstall(state.installDirectory);
      }
    }
    // Observe path absence too. A later/recreated object has no deletion grant
    // from this owner's old inode, even when it occupies the same name.
    if (info(state.link) || info(state.installDirectory)) throw fault("RESOURCE_PATH_REAPPEARED");
    state.cleanupCompleted = true;
    state.cleanup = "OWNED_LINK_AND_INSTALL_REMOVED_JOURNAL_RETAINED";
    delete state.cleanupCode;
  } catch (error) {
    state.cleanup = "INCONCLUSIVE_EXTERNAL_OWNER_REQUIRED";
    state.cleanupCode = error.code ?? "LOCAL_CLEANUP_FAILED";
    if (["RESOURCE_PATH_REAPPEARED", "PG_LINK_OWNER_CHANGED", "INSTALL_OWNER_CHANGED", "ROOT_MODULES_OWNER_CHANGED", "OWNERSHIP_PREVIOUSLY_LOST"].includes(state.cleanupCode)) state.cleanupOwnershipLost = true;
    state.cleanupAttempts.push({ status: state.cleanup, code: state.cleanupCode }); save(state);
    throw fault("CLEANUP_UNCONFIRMED");
  }
  state.cleanupAttempts.push({ status: state.cleanup });
  save(state); return state;
}

export async function prepare({ root, tempParent = process.env.RUNNER_TEMP ?? os.tmpdir(), githubOutput = process.env.GITHUB_OUTPUT,
  signal, install = installLocked } = {}) {
  if (process.env.NODE_PATH || /--(?:preserve-symlinks|loader|experimental-loader|import|require)/u.test(process.env.NODE_OPTIONS ?? "")) throw fault("STANDARD_MODULE_RESOLUTION_REQUIRED");
  const state = createOwner({ root, tempParent, githubOutput });
  try {
    await install(state, { signal });
    if (signal?.aborted) throw fault("PREPARATION_INTERRUPTED");
    const source = inputs(state.repository);
    if (JSON.stringify(source.hashes) !== JSON.stringify(state.sourceHashes)) throw fault("SOURCE_LOCK_CHANGED");
    for (const [name, digest] of Object.entries(state.sourceHashes)) {
      if (hash(fs.readFileSync(path.join(state.installDirectory, name))) !== digest) throw fault("COPIED_LOCK_CHANGED");
    }
    state.packages = installedInventory(state.installDirectory, source.lock);
    if (!same(directory(state.modules), state.modulesIdentity)) throw fault("ROOT_MODULES_OWNER_CHANGED");
    fs.symlinkSync(state.target, state.link, "dir"); // EEXIST refuses a concurrent foreign link
    state.linkIdentity = identity(fs.lstatSync(state.link)); save(state);
    state.consumers = await verifyConsumers(state, signal);
    if (signal?.aborted) throw fault("PREPARATION_INTERRUPTED");
    state.preparation = "READY_OFFLINE_ONLY"; save(state);
    return state;
  } catch (error) {
    state.preparation = "FAILED_OR_INTERRUPTED";
    state.failureCode = error.code ?? "PREPARATION_FAILED"; save(state);
    try { cleanupOwner(state.ownerFile, { root: state.repository }); } catch {}
    throw Object.assign(fault("PREPARATION_FAILED"), { ownerFile: state.ownerFile });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const controller = new AbortController();
  const interrupt = () => controller.abort();
  process.on("SIGINT", interrupt); process.on("SIGTERM", interrupt);
  try {
    let state;
    if (process.argv.length === 3 && process.argv[2] === "prepare") state = await prepare({ root, signal: controller.signal });
    else if (process.argv.length === 3 && process.argv[2] === "cleanup" && process.env.GAME_PLATFORM_TEST_DEPS_OWNER) {
      state = cleanupOwner(process.env.GAME_PLATFORM_TEST_DEPS_OWNER, { root });
    } else throw fault("EXPLICIT_PREPARE_OR_OWNED_CLEANUP_REQUIRED");
    console.log(JSON.stringify({ scope: state.scope, ownerFile: state.ownerFile, preparation: state.preparation, cleanup: state.cleanup }));
    if (controller.signal.aborted) process.exitCode = 1;
  } catch (error) {
    console.error(JSON.stringify({ status: "FAILED_OR_INCONCLUSIVE", code: error.code ?? "LOCAL_FAILURE", ownerFile: error.ownerFile ?? null }));
    process.exitCode = 1;
  } finally { process.off("SIGINT", interrupt); process.off("SIGTERM", interrupt); }
}
