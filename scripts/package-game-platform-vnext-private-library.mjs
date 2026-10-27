import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { runOwnedChild, installedInventory } from "./prepare-game-platform-vnext-test-deps.mjs";
import { verifyCheckoutPublication } from "./build-site-publication.mjs";
import { collectTree, inventory, createArchive, verifyArchive, extractNew, sha256, fault } from "./private-library-archive.mjs";

export const SERVICE = "services/game-platform-vnext";
export const SOURCE_NAMES = Object.freeze(["connectionLease.mjs", "sessionStorage.mjs", "sessionControl.mjs", "package.json", "package-lock.json"]);
const json = (o) => JSON.stringify(o, null, 2) + "\n";
const inside = (parent, child) => child === parent || child.startsWith(parent + path.sep);
const git = (root, ...args) => execFileSync("git", ["--no-optional-locks", ...args], { cwd: root });
const identity = (p) => { const s = fs.lstatSync(p); return { dev: s.dev, ino: s.ino }; };
function standardEnvironment() {
  if (process.versions.node.split(".")[0] !== "22" || process.env.NODE_PATH
    || /--(?:preserve-symlinks|loader|experimental-loader|import|require)/u.test((process.env.NODE_OPTIONS ?? "") + " " + process.execArgv.join(" "))) throw fault("STANDARD_NODE22_REQUIRED");
}
export function readFixedSources(root) {
  root = fs.realpathSync(root);
  const sourceRevision = git(root, "rev-parse", "HEAD").toString().trim();
  const sourceTree = git(root, "rev-parse", "HEAD^{tree}").toString().trim();
  if (git(root, "status", "--porcelain", "--untracked-files=no").length) throw fault("CLEAN_TRACKED_SOURCE_REQUIRED");
  const sources = {};
  for (const name of SOURCE_NAMES) {
    const relative = SERVICE + "/" + name, filename = path.join(root, relative);
    for (let p = filename; p !== root; p = path.dirname(p)) {
      if (fs.lstatSync(p).isSymbolicLink()) throw fault("SOURCE_SYMLINK");
    }
    const st = fs.lstatSync(filename), bytes = fs.readFileSync(filename);
    if (!st.isFile() || !bytes.equals(git(root, "show", sourceRevision + ":" + relative))) throw fault("SOURCE_HEAD_MISMATCH");
    sources[name] = { bytes, sha256: sha256(bytes), size: bytes.length, mode: st.mode & 0o777 };
  }
  const pkg = JSON.parse(sources["package.json"].bytes), lock = JSON.parse(sources["package-lock.json"].bytes);
  if (pkg.private !== true || pkg.type !== "module" || pkg.dependencies?.pg !== "8.23.1"
    || lock.lockfileVersion !== 3 || lock.packages?.[""]?.dependencies?.pg !== "8.23.1"
    || lock.packages?.["node_modules/pg"]?.version !== "8.23.1"
    || Object.keys(lock.packages).length !== 15 || Object.hasOwn(lock.packages, "node_modules/pg-native")) throw fault("EXACT_EXISTING_LOCK_REQUIRED");
  return { sourceRevision, sourceTree, sources, lock };
}
export function assertNoAncestorPg(directory) {
  for (let p = path.resolve(directory);; p = path.dirname(p)) {
    if (fs.lstatSync(path.join(p, "node_modules/pg"), { throwIfNoEntry: false })) throw fault("ANCESTOR_PG_SUPPLY");
    if (p === path.dirname(p)) break;
  }
}
function executable(name) {
  for (const p of (process.env.PATH ?? "").split(path.delimiter)) {
    const filename = path.join(p, name);
    try { fs.accessSync(filename, fs.constants.X_OK); return { path: filename, realpath: fs.realpathSync(filename) }; } catch {}
  }
  throw fault("EXECUTABLE_NOT_FOUND");
}
async function command(owner, commandPath, args, { cwd, signal, capture = false, timeoutMs = 120_000 } = {}) {
  const result = await runOwnedChild(commandPath, args, { cwd, signal, capture, timeoutMs, onSpawn(pid) {
    owner.child = { status: "RUNNING", pid }; saveOwner(owner);
  } });
  const { stdout, ...record } = result;
  owner.child = record; owner.operations.push({ command: path.basename(commandPath), kind: capture ? "VERSION_OR_IMPORT" : "LOCK_INSTALL", ...record }); saveOwner(owner);
  if (result.status !== "EXITED" || result.code !== 0) throw fault("PACKAGE_CHILD_FAILED_OR_UNCONFIRMED");
  return stdout;
}
function saveOwner(owner) { fs.writeFileSync(path.join(owner.directory, "owner.json"), json(owner), { mode: 0o600 }); }
function probeProgram(packageRoot, runner) {
  return `
    import fs from 'node:fs'; import path from 'node:path'; import pg from 'pg';
    import { createRequire } from 'node:module'; import { fileURLToPath, pathToFileURL } from 'node:url';
    const root = ${JSON.stringify(packageRoot)}, req = createRequire(pathToFileURL(root+'/package.json'));
    const lease = await import(pathToFileURL(root+'/connectionLease.mjs'));
    const storage = await import(pathToFileURL(root+'/sessionStorage.mjs'));
    const control = await import(pathToFileURL(root+'/sessionControl.mjs'));
    ${runner ? `const runner = await import(pathToFileURL(${JSON.stringify(runner)}));` : ""}
    console.log(JSON.stringify({ node: process.version,
      esmEntry: fs.realpathSync(fileURLToPath(import.meta.resolve('pg'))), requireEntry: fs.realpathSync(req.resolve('pg')),
      sameClient: pg.Client === req('pg').Client,
      exports: [typeof lease.createPgLeaseSource, typeof storage.createSessionStorage, typeof control.sessionCommandHash],
      ${runner ? "runnerExport: typeof runner.runCandidate," : ""}
      sourceRealpaths: ['connectionLease.mjs','sessionStorage.mjs','sessionControl.mjs'].map(n=>fs.realpathSync(path.join(root,n))) }));
  `;
}
export async function verifyImports(owner, packageRoot, root, signal) {
  standardEnvironment(); assertNoAncestorPg(path.dirname(packageRoot));
  const pgRoot = fs.realpathSync(path.join(packageRoot, "node_modules/pg"));
  if (!inside(packageRoot, pgRoot)) throw fault("PG_ESCAPES_UNPACK");
  const overlay = path.join(owner.directory, "validation-overlay"); fs.mkdirSync(overlay, { mode: 0o700 });
  fs.symlinkSync(path.join(path.dirname(packageRoot)), path.join(overlay, "services"), "dir");
  const runnerDir = path.join(overlay, "tests/game-db-integration/vnext-storage-candidate"); fs.mkdirSync(runnerDir, { recursive: true });
  const overlaySources = [];
  for (const n of ["run.mjs", "faultProxy.mjs", "runnerSupport.mjs"]) {
    const relative = "tests/game-db-integration/vnext-storage-candidate/" + n;
    const bytes = git(root, "show", owner.sourceRevision + ":" + relative);
    fs.writeFileSync(path.join(runnerDir, n), bytes, { flag: "wx", mode: 0o600 });
    overlaySources.push({ path: relative, sha256: sha256(bytes) });
  }
  const records = [];
  for (const runner of [null, path.join(runnerDir, "run.mjs")]) {
    const record = JSON.parse(await command(owner, process.execPath, ["--input-type=module", "--eval", probeProgram(packageRoot, runner)],
      { cwd: packageRoot, signal, capture: true, timeoutMs: 10_000 }));
    if (![record.esmEntry, record.requireEntry].every((p) => inside(pgRoot, p)) || !record.sameClient
      || record.exports.some((x) => x !== "function") || (runner && record.runnerExport !== "function")
      || !record.sourceRealpaths.every((p) => inside(packageRoot, p))) throw fault("UNPACK_IMPORT_RESOLUTION_MISMATCH");
    records.push(record);
  }
  return { scope: "IMPORT_ONLY_NO_CLIENT_FACTORY_OR_DB", records, overlaySources, overlayShipped: false,
    overlayServicesTarget: fs.realpathSync(path.join(overlay, "services")), ancestorPg: "ABSENT", globalFallback: "NOT_USED_RESOLVED_UNPACK_ONLY" };
}
export async function buildPackage({ root, outputParent, signal } = {}) {
  standardEnvironment(); root = fs.realpathSync(root);
  const fixed = readFixedSources(root), parent = fs.realpathSync(outputParent);
  if (inside(root, parent)) throw fault("PACKAGE_OUTPUT_MUST_BE_OUTSIDE_CHECKOUT");
  assertNoAncestorPg(parent);
  const directory = fs.mkdtempSync(path.join(parent, "vnext-private-library-")); fs.chmodSync(directory, 0o700);
  const owner = { schemaVersion: 1, scope: "PRIVATE_LIBRARY_PACKAGE_JOB", directory, identity: identity(directory),
    sourceRevision: fixed.sourceRevision, sourceTree: fixed.sourceTree, status: "BUILDING", child: { status: "NOT_STARTED" },
    resources: [], operations: [], cleanup: "RETAINED_EXTERNAL_OWNER_DISPOSAL_REQUIRED" };
  saveOwner(owner);
  try {
    const stage = path.join(directory, "stage"), payload = path.join(stage, "payload"), service = path.join(payload, SERVICE);
    fs.mkdirSync(service, { recursive: true }); owner.resources.push({ kind: "stage", path: stage, identity: identity(stage) }); saveOwner(owner);
    for (const [n, input] of Object.entries(fixed.sources)) fs.writeFileSync(path.join(service, n), input.bytes, { mode: input.mode, flag: "wx" });
    const npm = executable("npm"), npmVersion = (await command(owner, npm.path, ["--version"], { cwd: service, signal, capture: true, timeoutMs: 10_000 })).trim();
    if (!/^\d+\.\d+\.\d+$/u.test(npmVersion)) throw fault("ACTUAL_NPM_VERSION_REQUIRED");
    owner.environment = { node: process.version, npm: npmVersion, nodeExecutable: fs.realpathSync(process.execPath), npmExecutable: npm,
      platform: process.platform, arch: process.arch, osRelease: os.release(), libc: process.report.getReport().header.glibcVersionRuntime ?? "UNKNOWN" }; saveOwner(owner);
    await command(owner, npm.path, ["ci", "--ignore-scripts", "--no-audit", "--no-fund"], { cwd: service, signal });
    if (signal?.aborted) throw fault("PACKAGE_INTERRUPTED");
    for (const [n, input] of Object.entries(fixed.sources)) if (sha256(fs.readFileSync(path.join(service, n))) !== input.sha256) throw fault("SOURCE_OR_LOCK_CHANGED");
    const packages = installedInventory(service, fixed.lock), entries = collectTree(payload);
    const prefix = "payload/" + SERVICE;
    if (entries.some((e) => !["payload", "payload/services", prefix].includes(e.path)
      && !SOURCE_NAMES.some((n) => e.path === prefix + "/" + n)
      && e.path !== prefix + "/node_modules" && !e.path.startsWith(prefix + "/node_modules/"))) throw fault("UNDECLARED_PAYLOAD_INPUT");
    const sourceHashes = Object.fromEntries(Object.entries(fixed.sources).map(([n, r]) => [n, r.sha256]));
    const manifest = { schemaVersion: 1, scope: "PRIVATE_LIBRARY_ONLY", sourceRevision: fixed.sourceRevision, sourceTree: fixed.sourceTree,
      builder: { helperSha256: sha256(fs.readFileSync(fileURLToPath(import.meta.url))), archiveHelperSha256: sha256(fs.readFileSync(new URL("./private-library-archive.mjs", import.meta.url))) },
      environment: owner.environment, installArgs: ["ci", "--ignore-scripts", "--no-audit", "--no-fund"], sourceHashes, packages,
      files: inventory(entries), runtimeEntry: "ABSENT", actualDB: "NOT_RUN", support: "UNPROVEN" };
    const archive = createArchive(entries, manifest), archiveFile = path.join(directory, "private-library.tar.gz");
    fs.writeFileSync(archiveFile, archive, { flag: "wx", mode: 0o600 });
    const expected = { sourceRevision: fixed.sourceRevision, sourceTree: fixed.sourceTree, sourceHashes,
      archiveSha256: sha256(archive), manifestSha256: sha256(Buffer.from(json(manifest))) };
    const verified = verifyArchive(fs.readFileSync(archiveFile), expected), unpack = path.join(directory, "unpack");
    assertNoAncestorPg(directory); extractNew(verified.entries, unpack);
    owner.resources.push({ kind: "unpack", path: unpack, identity: identity(unpack) }); saveOwner(owner);
    if (JSON.stringify(inventory(collectTree(path.join(unpack, "payload")))) !== JSON.stringify(manifest.files)) throw fault("UNPACK_BYTES_OR_MODE_MISMATCH");
    const imports = await verifyImports(owner, path.join(unpack, "payload", SERVICE), root, signal);
    if (JSON.stringify(inventory(collectTree(path.join(unpack, "payload")))) !== JSON.stringify(manifest.files)) throw fault("UNPACK_CHANGED_BY_PROBE");
    if (readFixedSources(root).sourceRevision !== fixed.sourceRevision) throw fault("SOURCE_REVISION_CHANGED");
    const receipt = { ...expected, scope: "LOCAL_PRIVATE_LIBRARY_ARTIFACT_ONLY", archiveFile, manifestFile: path.join(directory, "manifest.json"),
      environment: owner.environment, imports, unpackFiles: manifest.files.length, exactUnpack: true,
      payloadContainsTestsSqlCredentialsCiArtifacts: false, publicExclusion: "NOT_BOUND_YET", runtimeArtifact: "ABSENT",
      productionAdoption: "OPEN", actualDB: "NOT_RUN", supportPass: false, resources: "RETAINED_EXTERNAL_OWNER_DISPOSAL_REQUIRED" };
    fs.writeFileSync(receipt.manifestFile, json(manifest), { flag: "wx", mode: 0o600 });
    fs.writeFileSync(path.join(directory, "receipt.json"), json(receipt), { flag: "wx", mode: 0o600 });
    owner.status = "LOCAL_ARCHIVE_AND_IMPORTS_VERIFIED"; saveOwner(owner); return { directory, receipt };
  } catch (error) {
    owner.status = "FAILED_OR_INCONCLUSIVE"; owner.code = error.code ?? "LOCAL_PACKAGE_FAILURE"; saveOwner(owner);
    throw Object.assign(fault(owner.code), { ownerDirectory: directory });
  }
}

// Execute the original build source unchanged plus an export-only observation.
// No duplicated build options/plugins or modified repository builder.
export async function capturePublicBuild(root) {
  root = fs.realpathSync(root);
  const fixed = readFixedSources(root), filename = path.join(root, "scripts/build-community-assets.mjs");
  const source = fs.readFileSync(filename, "utf8"), appended = "\nexport { result };\n";
  const req = createRequire(path.join(root, "package.json"));
  const module = new vm.SourceTextModule(source + appended, { identifier: pathToFileURL(filename).href });
  await module.link(async (specifier) => {
    const exports = specifier === "esbuild" ? req("esbuild") : await import(specifier);
    const names = [...new Set([...Object.keys(exports), "default"])];
    return new vm.SyntheticModule(names, function () { for (const n of names) this.setExport(n, n === "default" ? exports.default ?? exports : exports[n]); });
  });
  if (path.resolve(process.cwd()) !== root) throw fault("BUILD_CWD_MISMATCH");
  await module.evaluate();
  const result = module.namespace.result, outputs = Object.keys(result.metafile.outputs).map((p) => ({ path: p, sha256: sha256(fs.readFileSync(path.join(root, p))) }));
  return { sourceRevision: fixed.sourceRevision, sourceTree: fixed.sourceTree, builderSha256: sha256(Buffer.from(source)),
    observer: "EXPORT_ONLY_APPEND_TO_ORIGINAL_SOURCE", appended, executedSourceSha256: sha256(Buffer.from(source + appended)),
    esbuildVersion: req("esbuild").version, esbuildEntry: req.resolve("esbuild"), metafile: result.metafile, warnings: result.warnings, outputs };
}
export function bindPublic(root, receipt, manifest, capture) {
  root = fs.realpathSync(root);
  const fixed = readFixedSources(root);
  for (const item of [receipt, manifest, capture]) if (item.sourceRevision !== fixed.sourceRevision || item.sourceTree !== fixed.sourceTree) throw fault("PUBLIC_PRIVATE_REVISION_MISMATCH");
  if (receipt.manifestSha256 !== sha256(Buffer.from(json(manifest)))) throw fault("PRIVATE_MANIFEST_MISMATCH");
  for (const [name, source] of Object.entries(fixed.sources)) {
    if (manifest.sourceHashes?.[name] !== source.sha256 || receipt.sourceHashes?.[name] !== source.sha256
      || manifest.files?.find((f) => f.path === "payload/" + SERVICE + "/" + name)?.sha256 !== source.sha256) throw fault("PRIVATE_SOURCE_HEAD_MISMATCH");
  }
  if (capture.builderSha256 !== sha256(fs.readFileSync(path.join(root, "scripts/build-community-assets.mjs")))) throw fault("BUILD_PROVENANCE_MISMATCH");
  verifyCheckoutPublication(root); // Existing Guard consumer, unchanged.
  const publicBytes = fs.readFileSync(path.join(root, ".site-publication/manifest.json")), pub = JSON.parse(publicBytes);
  const policyBytes = fs.readFileSync(path.join(root, "scripts/site-publication-files.json"));
  if (pub.sourceRevision !== fixed.sourceRevision || pub.policySha256 !== sha256(policyBytes)) throw fault("PUBLIC_POLICY_OR_REVISION_MISMATCH");
  const approved = new Set(pub.files.map((f) => f.path)), bundle = JSON.parse(fs.readFileSync(path.join(root, "assets/build/manifest.json")));
  const inputs = Object.keys(capture.metafile.inputs), outputs = Object.keys(capture.metafile.outputs);
  if (JSON.stringify([...inputs].sort()) !== JSON.stringify([...bundle.inputs].sort()) || JSON.stringify([...outputs].sort()) !== JSON.stringify([...bundle.outputs].sort())) throw fault("BUNDLE_PROVENANCE_MISMATCH");
  const inputRecords = inputs.map((p) => {
    const absolute = fs.realpathSync(path.resolve(root, p));
    if (!inside(root, absolute) || !approved.has(p) || p.startsWith("services/") || p.includes("node_modules")) throw fault("PRIVATE_OR_UNAPPROVED_BUILD_INPUT");
    return { path: p, realpath: absolute, sha256: sha256(fs.readFileSync(absolute)) };
  });
  for (const out of capture.outputs) if (sha256(fs.readFileSync(path.join(root, out.path))) !== out.sha256 || pub.files.find((f) => f.path === out.path)?.sha256 !== out.sha256) throw fault("CAPTURED_OUTPUT_BYTES_CHANGED");
  const aliases = [], privateHashes = new Set(manifest.files.filter((f) => f.type === "file").map((f) => f.sha256));
  for (const f of pub.files) if (privateHashes.has(f.sha256) || f.path.startsWith("services/") || f.path.includes("node_modules")) aliases.push(f.path);
  if (aliases.length) throw fault("PRIVATE_PUBLIC_RAW_ALIAS");
  const opaque = [];
  // Conservative lexical observations only, not a general JavaScript evaluator.
  for (const f of pub.files.filter((f) => /\.[cm]?js$/u.test(f.path))) {
    const source = fs.readFileSync(path.join(root, f.source), "utf8");
    if (/\bimport\s*\(\s*(?![\s"'`])|\beval\s*\(|\bnew\s+Function\b/u.test(source)) opaque.push(f.path);
  }
  if (capture.warnings.length) opaque.push("BUILD_WARNINGS_REQUIRE_REVIEW");
  return { scope: "LOCAL_DECLARED_PUBLIC_SOURCE_AND_EXACT_OUTPUT_ONLY", sourceRevision: fixed.sourceRevision, sourceTree: fixed.sourceTree,
    archiveSha256: receipt.archiveSha256, privateManifestSha256: receipt.manifestSha256, publicManifestSha256: sha256(publicBytes), policySha256: pub.policySha256,
    publicFiles: pub.files.length, privateFilesAndDirectories: manifest.files.length, buildInputRecords: inputRecords,
    buildCaptureSha256: sha256(Buffer.from(json(capture))), privateRawAliases: aliases,
    status: opaque.length ? "UNKNOWN_OPAQUE_EDGES" : "DECLARED_BUILD_CLOSURE_AND_LOCAL_BYTES_VERIFIED",
    opaqueEdges: opaque, arbitraryEvalOrUnmodeledTransform: "NOT_CERTIFIED", existingReferenceBoundary: "EXISTING_CHECKOUT_VERIFIER_PASSED",
    actualPagesArtifactDeploy: "NOT_RUN", productionRuntimeAndAdoption: "OPEN", supportPass: false };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL("../", import.meta.url)), controller = new AbortController();
  const interrupt = () => controller.abort(); process.on("SIGTERM", interrupt); process.on("SIGINT", interrupt);
  try {
    if (process.argv[2] === "--output-parent" && process.argv.length === 4) console.log(json(await buildPackage({ root, outputParent: process.argv[3], signal: controller.signal })));
    else if (process.argv[2] === "--capture-public-build" && process.argv.length === 4) fs.writeFileSync(process.argv[3], json(await capturePublicBuild(root)), { flag: "wx", mode: 0o600 });
    else if (process.argv[2] === "--bind-public" && process.argv.length === 5) {
      const directory = path.resolve(process.argv[3]), receipt = JSON.parse(fs.readFileSync(path.join(directory, "receipt.json"))), manifest = JSON.parse(fs.readFileSync(path.join(directory, "manifest.json")));
      verifyArchive(fs.readFileSync(path.join(directory, "private-library.tar.gz")), receipt);
      const binding = bindPublic(root, receipt, manifest, JSON.parse(fs.readFileSync(process.argv[4])));
      fs.writeFileSync(path.join(directory, "public-binding.json"), json(binding), { flag: "wx", mode: 0o600 });
      if (binding.status === "UNKNOWN_OPAQUE_EDGES") process.exitCode = 1;
    } else throw fault("EXPLICIT_PACKAGE_OPERATION_REQUIRED");
  } catch (error) { console.error(json({ status: "FAILED_OR_INCONCLUSIVE", code: error.code ?? "LOCAL_FAILURE", ownerDirectory: error.ownerDirectory ?? null })); process.exitCode = 1; }
  finally { process.off("SIGTERM", interrupt); process.off("SIGINT", interrupt); }
}
