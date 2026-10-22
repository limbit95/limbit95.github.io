import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sourceModuleEdges, validateVnextBoundaries } from "./game-platform-vnext-boundary-rules.mjs";

const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const POLICY = "scripts/site-publication-files.json";
const STATE = ".site-publication";
const SERVER = "services/game-platform-vnext/";
const SERVER_DIRECTORIES = ["services", SERVER.slice(0, -1)];
const PUBLIC_ROOTS = /^(?:assets|css|js|games|liar-game|the-game|marble-game)\//u;
const ROOT_FILES = new Set([".nojekyll", "CNAME", "index.html", "activity-link.html", "brand-gateway-ae.html", "invite.html", "manifest.webmanifest", "push-service-worker.js", "apple-touch-icon.png"]);
const PUBLIC_EXTENSION = /\.(?:[cm]?js|html|css|json|webmanifest|png|svg|jpe?g|webp|gif|ico|woff2?|ttf|mp3|ogg|wav|mp4|webm)$/iu;
const CHECKOUT_TOOLS = [POLICY, "index.template.html", "package.json", "package-lock.json",
  "scripts/build-community-assets.mjs", "scripts/build-site-publication.mjs",
  "scripts/check-game-platform-vnext-boundaries.mjs", "scripts/game-platform-vnext-boundary-rules.mjs", "scripts/verify-site-publication-artifact.py"];
const CHECKOUT_ROOTS = ["assets", "css", "js", "games", "liar-game", "the-game", "marble-game", SERVER, ...ROOT_FILES, ...CHECKOUT_TOOLS];

const serverInput = (filename) => filename.startsWith(SERVER) || SERVER_DIRECTORIES.includes(filename);
function publicationInput(filename) {
  return publicPath(filename) || serverInput(filename) || CHECKOUT_TOOLS.includes(filename);
}

// Production evidence always reads Git itself; fixture inventory/revision options
// on the lower-level assembly functions are not checkout verification inputs.
function checkoutGit(root) {
  const git = (args) => execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  if (fs.realpathSync(root) !== fs.realpathSync(git(["rev-parse", "--show-toplevel"]).trim())) {
    throw new Error("Publication checkout must be the repository root.");
  }
  return git;
}

// Shared by discovery and production checkout inspection; never follow a root symlink.
function serverDirectoryEntries(root) {
  for (const name of SERVER_DIRECTORIES) {
    const stat = fs.lstatSync(path.join(root, name), { throwIfNoEntry: false });
    if (!stat) return [];
    if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error(`Unsafe server input directory: ${name}`);
  }
  return fs.readdirSync(path.join(root, SERVER));
}

// Discovery only: the presence of any of these inputs REQUIRES verification;
// it never constitutes evidence of exclusion. Inspect actual roots even when Git has entries.
export function hasServerPublicationInputs(root) {
  const git = checkoutGit(root);
  const entries = serverDirectoryEntries(root);
  // Includes untracked/ignored entries, even though neither is in the index.
  // An empty, ordinary directory alone is not a server source/artifact.
  const tracked = [git(["ls-tree", "-r", "--name-only", "-z", "HEAD", "--", ...SERVER_DIRECTORIES]),
    git(["ls-files", "-z", "--", ...SERVER_DIRECTORIES])].join("\0").split("\0");
  return tracked.some(serverInput) || entries.length > 0;
}

function readCheckout(root) {
  const git = checkoutGit(root);
  serverDirectoryEntries(root);
  const sourceRevision = git(["rev-parse", "HEAD"]).trim();
  // Reject staged/unstaged tracked changes, not generated ignored output.
  if (git(["diff", "--cached", "--name-only", "HEAD", "--"]).trim()
    || git(["diff", "--name-only", "--"]).trim()) throw new Error("Publication checkout must match HEAD (tracked changes).");
  const inventory = trackedInventory(root);
  const tree = new Map(git(["ls-tree", "-r", "-z", "HEAD"]).split("\0").filter(Boolean).map((entry) => {
    const tab = entry.indexOf("\t");
    const [mode, type, sha] = entry.slice(0, tab).split(" ");
    return [entry.slice(tab + 1), { mode, type, sha }];
  }));
  for (const { path: filename, mode } of inventory.filter((entry) => publicationInput(entry.path))) {
    const expected = tree.get(filename);
    const bytes = regularFile(root, filename);
    const sha = createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
    if (expected?.type !== "blob" || expected.mode !== mode || expected.sha !== sha) {
      throw new Error(`Publication input does not match HEAD: ${filename}`);
    }
  }
  // Include ignored candidates under the public/server roots; do not inspect
  // node_modules, browser profiles, or arbitrary files outside this checkout.
  const untracked = [git(["ls-files", "--others", "--exclude-standard", "-z"]),
    git(["ls-files", "--others", "--ignored", "--exclude-standard", "-z", "--", ...CHECKOUT_ROOTS])]
    .join("\0").split("\0").filter((filename) => filename && publicationInput(filename));
  if (untracked.length) throw new Error(`Untracked publication input: ${untracked.join(", ")}`);
  if (git(["rev-parse", "HEAD"]).trim() !== sourceRevision) throw new Error("Publication checkout revision changed during inspection.");
  return { sourceRevision, inventory };
}

function safePath(value) {
  if (typeof value !== "string" || !value || value.includes("\\") || value.includes("%")
    || value.startsWith("/") || value.includes(":") || value.includes("\0")
    || value.split("/").some((part) => !part || part === "." || part === "..")) {
    throw new Error(`Unsafe publication path: ${value}`);
  }
  return value;
}

function publicPath(filename) {
  if (ROOT_FILES.has(filename) || filename === "liar-game/VERSION") return true;
  return PUBLIC_ROOTS.test(filename) && PUBLIC_EXTENSION.test(filename)
    && !filename.split("/").some((part) => part.startsWith(".") || ["tests", "test", "fixtures", "node_modules"].includes(part));
}

// Never follow a symlink, including one in a parent directory.
function regularFile(root, filename) {
  let target = root;
  const parts = safePath(filename).split("/");
  for (let i = 0; i < parts.length; i++) {
    target = path.join(target, parts[i]);
    const stat = fs.lstatSync(target);
    if (stat.isSymbolicLink() || (i < parts.length - 1 ? !stat.isDirectory() : !stat.isFile())) {
      throw new Error(`Publication requires a regular file without symlinks: ${filename}`);
    }
  }
  return fs.readFileSync(target);
}

function trackedInventory(root) {
  return execFileSync("git", ["ls-files", "--stage", "-z"], { cwd: root, encoding: "utf8" })
    .split("\0").filter(Boolean).map((entry) => {
      const [meta, filename] = entry.split("\t");
      const [mode, , stage] = meta.split(" ");
      if (stage !== "0") throw new Error(`Unmerged publication input: ${filename}`);
      return { path: filename, mode };
    });
}

function loadInputs(root, inventory) {
  const policyBytes = regularFile(root, POLICY);
  const policy = JSON.parse(policyBytes);
  if (policy.schemaVersion !== 1 || !Array.isArray(policy.files) || !policy.files.length) throw new Error("Invalid publication file policy.");
  const files = new Map();
  const entries = new Map(inventory.map((entry) => [safePath(entry.path), entry.mode]));
  const serverHashes = new Set();
  for (const [filename, mode] of entries) {
    if (filename.startsWith(SERVER)) {
      if (!/^100(?:644|755)$/u.test(mode)) throw new Error(`Non-regular server source: ${filename}`);
      serverHashes.add(digest(regularFile(root, filename)));
    }
  }
  for (const filename of policy.files) {
    safePath(filename);
    if (!publicPath(filename) || files.has(filename)) throw new Error(`Forbidden or duplicate public file: ${filename}`);
    if (!/^100(?:644|755)$/u.test(entries.get(filename) ?? "")) throw new Error(`Public file must be tracked and regular: ${filename}`);
    const bytes = regularFile(root, filename);
    if (serverHashes.has(digest(bytes))) throw new Error(`Public bytes alias a tracked server source/artifact: ${filename}`);
    files.set(filename, bytes);
  }
  // A newly tracked runtime asset must be reviewed into the exact file list.
  for (const filename of entries.keys()) {
    if (publicPath(filename) && !files.has(filename)) throw new Error(`Unlisted public input: ${filename}`);
  }
  return { files, policy, policySha256: digest(policyBytes) };
}

function localTarget(filename, reference) {
  if (!reference || reference.startsWith("#") || /^(?:[a-z][a-z\d+.-]*:|\/\/)/iu.test(reference)) return null;
  let clean;
  try { clean = decodeURIComponent(reference.split(/[?#]/u, 1)[0]); } catch { throw new Error(`Invalid URL in ${filename}`); }
  if (!clean) return null;
  const target = path.posix.normalize(clean.startsWith("/") ? clean.slice(1) : path.posix.join(path.posix.dirname(filename), clean));
  if (target.startsWith("../") || target === ".." || target.includes("\\")) throw new Error(`Reference escapes publication: ${filename} -> ${reference}`);
  return target === "." || target === "./" || target === "" ? "index.html" : target.endsWith("/") ? target + "index.html" : target;
}

function validateFiles(files, policy) {
  const sources = Object.fromEntries([...files].map(([filename, bytes]) => [filename, bytes.toString("utf8")]));
  const errors = validateVnextBoundaries({ files: sources, trackedPaths: [...files.keys()], assetOutputs: [...files.keys()] });
  const requireTarget = (filename, reference) => {
    const target = localTarget(filename, reference);
    if (target && !files.has(target) && !files.has(target + "/index.html")) errors.push(`Missing public reference: ${filename} -> ${reference}`);
  };
  const moduleMaps = (policy.moduleMaps ?? []).map(({ entry, moduleRoot }) => {
    safePath(entry); safePath(moduleRoot.replace(/\/$/u, ""));
    if (!entry.endsWith(".html") || !files.has(entry) || !moduleRoot.startsWith(path.posix.dirname(entry) + "/")) throw new Error("Invalid scoped import-map entry.");
    const source = files.get(entry).toString("utf8");
    const text = source.match(/<script\b[^>]*\btype=["']importmap["'][^>]*>([\s\S]*?)<\/script\s*>/iu)?.[1];
    if (!text) throw new Error(`Missing declared import map: ${entry}`);
    const map = JSON.parse(text);
    if (!map.imports || map.scopes) throw new Error(`Unsupported import-map shape: ${entry}`);
    for (const reference of Object.values(map.imports)) {
      if (typeof reference !== "string") throw new Error(`Invalid import-map target: ${entry}`);
      requireTarget(entry, reference);
    }
    return { entry, moduleRoot, imports: map.imports };
  });
  for (const [filename, bytes] of files) {
    const source = bytes.toString("utf8");
    if (/\.[cm]?js$/iu.test(filename)) {
      for (const ref of sourceModuleEdges(source)) {
        if (ref.startsWith(".") || ref.startsWith("/")) requireTarget(filename, ref);
        else if (!/^[a-z][a-z\d+.-]*:/iu.test(ref)) {
          const binding = moduleMaps.filter((map) => filename.startsWith(map.moduleRoot)).sort((a, b) => b.moduleRoot.length - a.moduleRoot.length)[0];
          if (!binding?.imports[ref]) errors.push(`Unresolved browser module: ${filename} -> ${ref}`);
        }
      }
    }
    if (/\.(?:html|css)$/iu.test(filename)) {
      const clean = source.replace(/<!--[\s\S]*?-->|\/\*[\s\S]*?\*\//gu, "");
      for (const match of clean.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']|url\(\s*["']?([^)'"\s]+)|@import\s*["']([^"']+)["']/giu)) {
        requireTarget(filename, match[1] ?? match[2] ?? match[3]);
      }
    }
    if (filename.endsWith(".webmanifest")) {
      const manifest = JSON.parse(source);
      for (const item of [...(manifest.icons ?? []), ...(manifest.screenshots ?? [])]) requireTarget(filename, item.src);
      requireTarget(filename, manifest.start_url);
    }
  }
  // Persisted esbuild inputs connect committed bundles to approved browser sources.
  if (files.has("assets/build/manifest.json")) {
    const bundle = JSON.parse(files.get("assets/build/manifest.json"));
    if (!Array.isArray(bundle.inputs) || !bundle.inputs.length || !Array.isArray(bundle.outputs)) errors.push("Bundle manifest must record actual esbuild input/output paths.");
    for (const input of bundle.inputs ?? []) {
      if (typeof input !== "string" || !files.has(input) || !publicPath(input)) errors.push(`Bundle input outside public source policy: ${input}`);
    }
    for (const output of bundle.outputs ?? []) if (!files.has(output)) errors.push(`Missing public bundle output: ${output}`);
    if (!files.has(bundle.entry)) errors.push("Missing public bundle entry.");
  }
  if (errors.length) throw new Error([...new Set(errors)].join("\n"));
}

function outputPaths(root) {
  const state = path.join(root, STATE);
  if (fs.existsSync(state) && (!fs.lstatSync(state).isDirectory() || fs.lstatSync(state).isSymbolicLink())) throw new Error("Publication state directory cannot be a symlink or file.");
  const evidence = path.join(state, "manifest.json");
  const evidenceStat = fs.lstatSync(evidence, { throwIfNoEntry: false });
  if (evidenceStat && (!evidenceStat.isFile() || evidenceStat.isSymbolicLink())) throw new Error("Publication evidence must be a regular file.");
  return { state, output: path.join(state, "public"), evidence };
}

function walkOutput(directory, prefix = "") {
  const files = new Map();
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = prefix + entry.name;
    const target = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symlink in publish tree: ${filename}`);
    if (entry.isDirectory()) for (const pair of walkOutput(target, filename + "/")) files.set(...pair);
    else if (entry.isFile()) files.set(filename, fs.readFileSync(target));
    else throw new Error(`Non-regular publish output: ${filename}`);
  }
  return files;
}

function writePublication(root, { inventory, sourceRevision }, verify) {
  const { files, policy, policySha256 } = loadInputs(root, inventory);
  validateFiles(files, policy); // No output mutation until all source validation passes.
  const { state, output, evidence } = outputPaths(root);
  fs.mkdirSync(state, { recursive: true });
  if (fs.existsSync(output) && (!fs.lstatSync(output).isDirectory() || fs.lstatSync(output).isSymbolicLink())) throw new Error("Unsafe existing publish output.");
  // Only replace a generated tree with its own evidence, never an arbitrary directory.
  if (fs.existsSync(output) && !fs.existsSync(evidence)) throw new Error("Refusing to overwrite an unmanaged publish directory.");
  const staging = fs.mkdtempSync(path.join(state, "staging-"));
  const candidate = path.join(staging, "public");
  const candidateEvidence = path.join(staging, "manifest.json");
  const previousOutput = path.join(staging, "previous-public");
  const previousEvidence = path.join(staging, "previous-manifest.json");
  let savedOutput = false, savedEvidence = false, installedOutput = false, installedEvidence = false;
  let preserveRecovery = false;
  try {
    for (const [filename, bytes] of files) {
      const target = path.join(candidate, filename);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, bytes);
    }
    const manifest = { schemaVersion: 1, sourceRevision, policySha256, files: [...files].sort(([a], [b]) => a.localeCompare(b)).map(([filename, bytes]) => ({ path: filename, source: filename, size: bytes.length, sha256: digest(bytes) })) };
    fs.writeFileSync(candidateEvidence, JSON.stringify(manifest, null, 2) + "\n");
    // Keep the previous managed pair until all production checkout checks finish.
    if (fs.existsSync(output)) { fs.renameSync(output, previousOutput); savedOutput = true; }
    if (fs.existsSync(evidence)) { fs.renameSync(evidence, previousEvidence); savedEvidence = true; }
    fs.renameSync(candidate, output); installedOutput = true;
    fs.renameSync(candidateEvidence, evidence); installedEvidence = true;
    verify();
    return manifest;
  } catch (error) {
    try {
      if (installedEvidence) fs.rmSync(evidence, { force: true });
      if (installedOutput) fs.rmSync(output, { force: true, recursive: true });
      if (savedOutput) fs.renameSync(previousOutput, output);
      if (savedEvidence) fs.renameSync(previousEvidence, evidence);
    } catch (recoveryError) {
      preserveRecovery = true;
      throw new AggregateError([error, recoveryError], `Publication failed; recovery inputs retained at ${staging}`, { cause: error });
    }
    throw error;
  } finally {
    if (!preserveRecovery) fs.rmSync(staging, { force: true, recursive: true });
  }
}

export function buildPublication(root, { inventory = trackedInventory(root), sourceRevision = null } = {}) {
  return writePublication(root, { inventory, sourceRevision }, () => verifyPublication(root, { inventory }));
}

export function verifyPublication(root, { inventory = trackedInventory(root) } = {}) {
  const { files, policy, policySha256 } = loadInputs(root, inventory);
  validateFiles(files, policy);
  const { output, evidence } = outputPaths(root);
  // Check the output root itself as well as every descendant.
  if (fs.lstatSync(output).isSymbolicLink() || !fs.lstatSync(output).isDirectory()) throw new Error("Unsafe publish root.");
  const manifest = JSON.parse(regularFile(root, STATE + "/manifest.json"));
  const actual = walkOutput(output);
  if (manifest.schemaVersion !== 1 || manifest.policySha256 !== policySha256 || !Array.isArray(manifest.files)
    || manifest.files.length !== files.size || actual.size !== files.size) throw new Error("Publish inventory/policy changed.");
  const seen = new Set();
  for (const item of manifest.files) {
    if (seen.has(item.path) || item.path !== item.source || !files.has(item.path) || !actual.has(item.path)) throw new Error("Publish provenance mismatch.");
    seen.add(item.path);
    const bytes = files.get(item.path);
    if (item.size !== bytes.length || item.sha256 !== digest(bytes) || !bytes.equals(actual.get(item.path))) throw new Error(`Publish bytes changed: ${item.path}`);
  }
  validateFiles(actual, policy);
  return { files: files.size, output, evidence };
}

export function verifyCheckoutPublication(root) {
  const checkout = readCheckout(root);
  const manifest = JSON.parse(regularFile(root, STATE + "/manifest.json"));
  if (manifest.sourceRevision !== checkout.sourceRevision) throw new Error("Publication manifest revision does not match checkout HEAD.");
  const result = verifyPublication(root, { inventory: checkout.inventory });
  if (readCheckout(root).sourceRevision !== checkout.sourceRevision) throw new Error("Publication checkout revision changed during verification.");
  return { kind: "LOCAL_CHECKOUT_PUBLICATION", sourceRevision: checkout.sourceRevision, ...result };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.slice(2).some((arg) => arg !== "--check")) throw new Error("Usage: node scripts/build-site-publication.mjs [--check]");
    const root = process.cwd();
    if (process.argv.includes("--check")) console.log(JSON.stringify(verifyCheckoutPublication(root)));
    else {
      const checkout = readCheckout(root);
      const manifest = writePublication(root, checkout, () => verifyCheckoutPublication(root));
      console.log(`Prepared ${manifest.files.length} local checkout public files; evidence: ${STATE}/manifest.json (not a deployment).`);
    }
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
