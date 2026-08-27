import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");
const DEFAULT_MANIFEST = "supabase/liar-game/canonical/v1.0.0.manifest.json";
const GIT_SHA_RE = /^[0-9a-f]{40}$/u;

function parseArgs(argv) {
  const options = { manifest: DEFAULT_MANIFEST, check: false, stdout: false, output: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--check") options.check = true;
    else if (arg === "--stdout") options.stdout = true;
    else if (arg === "--manifest") options.manifest = argv[++index];
    else if (arg === "--output") options.output = argv[++index];
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

function gitBlobSha(buffer) {
  const prefix = Buffer.from(`blob ${buffer.byteLength}\0`, "utf8");
  return crypto.createHash("sha1").update(prefix).update(buffer).digest("hex");
}

function resolveInsideRepo(relativePath) {
  if (!relativePath || path.isAbsolute(relativePath)) throw new Error(`Invalid repository path: ${relativePath}`);
  const absolute = path.resolve(REPO_ROOT, relativePath);
  const relative = path.relative(REPO_ROOT, absolute);
  if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`Path escapes repository root: ${relativePath}`);
  return absolute;
}

async function readManifest(relativePath) {
  const absolute = resolveInsideRepo(relativePath);
  const parsed = JSON.parse(await fs.readFile(absolute, "utf8"));
  if (parsed?.format !== 1) throw new Error(`Unsupported manifest format: ${parsed?.format}`);
  if (!parsed.version || !Array.isArray(parsed.files) || parsed.files.length === 0) throw new Error("Canonical manifest is incomplete.");
  return parsed;
}

async function readPinnedBlob(entry) {
  if (!GIT_SHA_RE.test(entry.blobSha)) throw new Error(`Invalid Git blob SHA for ${entry.path}: ${entry.blobSha}`);

  // Release manifests are immutable even after main moves on. Prefer the exact
  // historical Git blob, so a v1.0 installer remains reproducible after v1.1+
  // edits the same source paths.
  try {
    const buffer = execFileSync("git", ["cat-file", "blob", entry.blobSha], {
      cwd: REPO_ROOT,
      encoding: null,
      maxBuffer: 16 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"],
    });
    if (gitBlobSha(buffer) !== entry.blobSha) throw new Error(`Git returned an unexpected blob for ${entry.path}`);
    return buffer;
  } catch (gitError) {
    // Zip/source exports may not contain .git. They can still build a release
    // if the working-tree file is exactly the pinned blob.
    try {
      const current = await fs.readFile(resolveInsideRepo(entry.path));
      if (gitBlobSha(current) === entry.blobSha) return current;
    } catch {}

    throw new Error(
      `Pinned canonical blob is unavailable: ${entry.path} (${entry.blobSha}).\n` +
      "Use a full Git clone/fetch (GitHub Actions uses fetch-depth: 0) or check out the matching release branch.",
      { cause: gitError },
    );
  }
}

async function build(manifest, manifestPath) {
  const seen = new Set();
  const chunks = [];

  for (const [index, entry] of manifest.files.entries()) {
    if (!entry?.path || !entry?.blobSha) throw new Error(`Manifest entry ${index + 1} is missing path/blobSha.`);
    if (seen.has(entry.path)) throw new Error(`Duplicate canonical source: ${entry.path}`);
    seen.add(entry.path);

    const buffer = await readPinnedBlob(entry);
    const text = buffer.toString("utf8").replace(/\s+$/u, "");
    chunks.push([
      "",
      "-- ============================================================================",
      `-- BEGIN CANONICAL SOURCE ${index + 1}/${manifest.files.length}: ${entry.path}`,
      `-- PINNED GIT BLOB: ${entry.blobSha}`,
      "-- ============================================================================",
      text,
      "-- ============================================================================",
      `-- END CANONICAL SOURCE: ${entry.path}`,
      "-- ============================================================================",
      "",
    ].join("\n"));
  }

  for (const excluded of manifest.excludedHistoricalFiles || []) {
    if (seen.has(excluded)) throw new Error(`Historical-only file must not be in canonical installer: ${excluded}`);
  }

  const header = [
    `-- Liar Game / Drawing Spy canonical fresh installer v${manifest.version}`,
    "-- GENERATED FROM IMMUTABLE GIT BLOBS. Do not hand-edit.",
    `-- Manifest: ${manifestPath}`,
    "-- This installer is intended for a fresh Supabase project/database only.",
    "-- Never run it over an existing production Liar Game database.",
    "",
  ].join("\n");

  return `${header}${chunks.join("")}`;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const manifest = await readManifest(options.manifest);
  const installer = await build(manifest, options.manifest);

  if (options.check) {
    console.log(`Liar Game canonical manifest v${manifest.version}: ${manifest.files.length} pinned Git blobs OK`);
    return;
  }

  if (options.stdout) {
    process.stdout.write(installer);
    return;
  }

  const outputRelative = options.output || manifest.output;
  if (!outputRelative) throw new Error("Manifest does not define an output path.");
  const output = resolveInsideRepo(outputRelative);
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, installer, "utf8");
  console.log(`Wrote ${path.relative(REPO_ROOT, output)} (${Buffer.byteLength(installer, "utf8")} bytes)`);
}

main().catch((error) => {
  console.error(error?.stack || error);
  process.exitCode = 1;
});
