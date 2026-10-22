import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { verifyCheckoutPublication, verifyPublication } from "../scripts/build-site-publication.mjs";
import { runGovernanceCheck } from "../scripts/check-game-platform-governance.mjs";

function fixture(t, extra = {}) {
  const root = mkdtempSync(path.join(os.tmpdir(), "publication-checkout-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const put = (name, bytes) => { mkdirSync(path.dirname(path.join(root, name)), { recursive: true }); writeFileSync(path.join(root, name), bytes); };
  const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  const files = { "index.html": '<script type="module" src="./js/app.js"></script>', "js/app.js": "export const value = 1;" };
  for (const [name, bytes] of Object.entries({ ...files, ...extra })) put(name, bytes);
  put("scripts/site-publication-files.json", JSON.stringify({ schemaVersion: 1, files: Object.keys(files) }));
  put(".gitignore", ".site-publication/\nassets/ignored.js\nservices/game-platform-vnext/ignored.bin\n");
  for (const name of ["build-site-publication.mjs", "check-game-platform-vnext-boundaries.mjs", "game-platform-vnext-boundary-rules.mjs"]) {
    copyFileSync(new URL(`../scripts/${name}`, import.meta.url), path.join(root, "scripts", name));
  }
  git("init", "-q"); git("config", "user.name", "Publication fixture"); git("config", "user.email", "fixture@example.invalid");
  const commit = () => { git("add", "."); git("commit", "-qm", "fixture revision"); return git("rev-parse", "HEAD"); };
  const revision = commit();
  const cli = (...args) => spawnSync(process.execPath, [path.join(root, "scripts/build-site-publication.mjs"), ...args], { cwd: root, encoding: "utf8" });
  const build = cli(); assert.equal(build.status, 0, build.stderr);
  const manifestPath = path.join(root, ".site-publication/manifest.json");
  const editManifest = (edit) => { const value = JSON.parse(readFileSync(manifestPath)); edit(value); writeFileSync(manifestPath, JSON.stringify(value)); };
  return { root, put, git, commit, revision, cli, manifestPath, editManifest };
}

test("production check binds actual Git HEAD, exact source and generated output; fixture options cannot override it", (t) => {
  const f = fixture(t);
  const result = verifyCheckoutPublication(f.root, { inventory: [], sourceRevision: "fixture-only" });
  assert.equal(result.kind, "LOCAL_CHECKOUT_PUBLICATION"); assert.equal(result.sourceRevision, f.revision); assert.equal(result.files, 2);
  assert.equal(f.cli("--check").status, 0);
  assert.notEqual(f.cli("--check", "--source-revision=fixture-only").status, 0);
  assert.throws(() => verifyCheckoutPublication(path.join(f.root, "js")), /repository root/);
});

test("unchanged public bytes from a different revision fail until assembled for the actual new checkout", (t) => {
  const f = fixture(t); f.put("docs/note.md", "non-public revision change"); const next = f.commit();
  assert.notEqual(next, f.revision);
  assert.throws(() => verifyCheckoutPublication(f.root), /manifest revision/);
  assert.equal(f.cli().status, 0); assert.equal(verifyCheckoutPublication(f.root).sourceRevision, next);
});

test("forged revision cannot hide tracked or assume-unchanged source edits, even with matching output and file hash", (t) => {
  const f = fixture(t); const bytes = "export const value = 2;";
  f.git("update-index", "--assume-unchanged", "js/app.js");
  f.put("js/app.js", bytes); f.put(".site-publication/public/js/app.js", bytes);
  f.editManifest((m) => {
    m.sourceRevision = f.revision;
    const file = m.files.find((item) => item.path === "js/app.js");
    file.size = Buffer.byteLength(bytes); file.sha256 = createHash("sha256").update(bytes).digest("hex");
  });
  assert.throws(() => verifyCheckoutPublication(f.root), /does not match HEAD/);
  assert.notEqual(f.cli("--check").status, 0);
});

test("staged changes, policy changes, missing inputs and changed build inputs fail closed", (t) => {
  for (const name of ["js/app.js", "scripts/site-publication-files.json", "index.template.html", "scripts/build-community-assets.mjs"]) {
    const f = fixture(t, { "index.template.html": "template", "scripts/build-community-assets.mjs": "// build input" });
    f.put(name, "changed"); f.git("add", name);
    assert.throws(() => verifyCheckoutPublication(f.root), /must match HEAD/);
  }
  const f = fixture(t); rmSync(path.join(f.root, "js/app.js"));
  assert.throws(() => verifyCheckoutPublication(f.root), /must match HEAD/);
});

test("new untracked and ignored public/server inputs are not hidden by the policy or ignore rules", (t) => {
  for (const name of ["js/new.js", "assets/ignored.js", "services/game-platform-vnext/new.bin", "services/game-platform-vnext/ignored.bin"]) {
    const f = fixture(t); f.put(name, "CANARY");
    assert.throws(() => verifyCheckoutPublication(f.root), /Untracked publication input/);
  }
});

test("current server inventory exclusion is required by the candidate independent checkout Guard", (t) => {
  const name = "services/game-platform-vnext/canary.bin"; const f = fixture(t, { [name]: "SERVER_CANARY" });
  assert.equal(verifyCheckoutPublication(f.root).files, 2);
  assert.equal(existsSync(path.join(f.root, ".site-publication/public", name)), false);
  const guard = spawnSync(process.execPath, [path.join(f.root, "scripts/check-game-platform-vnext-boundaries.mjs")], { cwd: f.root, encoding: "utf8" });
  assert.equal(guard.status, 0, guard.stderr);
  f.put(".site-publication/public/js/app.js", "tampered");
  const badGuard = spawnSync(process.execPath, [path.join(f.root, "scripts/check-game-platform-vnext-boundaries.mjs")], { cwd: f.root, encoding: "utf8" });
  assert.equal(badGuard.status, 1); assert.match(badGuard.stderr, /exclusion failed/);
  assert.equal(f.cli().status, 0);
  f.put(name, "changed server only"); assert.throws(() => verifyCheckoutPublication(f.root), /must match HEAD/);
  f.commit(); assert.throws(() => verifyCheckoutPublication(f.root), /manifest revision/);
  f.put("js/app.js", "changed server only"); f.commit();
  const failedBuild = f.cli(); assert.notEqual(failedBuild.status, 0); assert.match(failedBuild.stderr, /alias a tracked server/);
  assert.notEqual(JSON.parse(readFileSync(f.manifestPath)).sourceRevision, f.git("rev-parse", "HEAD"));
});

test("candidate server Guard requires current proof, not presence, CLI flags or an old manifest", (t) => {
  const f = fixture(t, { "services/game-platform-vnext/session.mjs": "export const candidate = 1;", "tests/game-platform-vnext-model-oracles.json": '{"models":[]}' });
  const guard = (...args) => spawnSync(process.execPath, [path.join(f.root, "scripts/check-game-platform-vnext-boundaries.mjs"), ...args], { cwd: f.root, encoding: "utf8" });
  rmSync(path.join(f.root, ".site-publication"), { recursive: true });
  assert.equal(guard().status, 1); assert.equal(guard("--allow-server").status, 1);
  assert.match(runGovernanceCheck({ repositoryRoot: f.root }).join("\n"), /Server publication exclusion failed/);
  assert.equal(f.cli().status, 0); assert.equal(guard().status, 0);
  f.put("docs/next.md", "different revision"); f.commit();
  assert.equal(guard().status, 1); assert.match(guard().stderr, /manifest revision/);
});

test("candidate independent Guard rejects hidden server/rules edits and does not print success", (t) => {
  for (const name of ["services/game-platform-vnext/session.mjs", "scripts/game-platform-vnext-boundary-rules.mjs"]) {
    const f = fixture(t, { "services/game-platform-vnext/session.mjs": "export const candidate = 1;" });
    const original = readFileSync(path.join(f.root, name), "utf8");
    f.git("update-index", "--assume-unchanged", name); f.put(name, original + "\n// hidden tracked input change\n");
    const guard = spawnSync(process.execPath, [path.join(f.root, "scripts/check-game-platform-vnext-boundaries.mjs")], { cwd: f.root, encoding: "utf8" });
    assert.equal(guard.status, 1); assert.equal(guard.stdout, ""); assert.match(guard.stderr, /does not match HEAD/);
  }
});

test("F1 independent CLI and governance cannot hide server inputs by removing the index entry or leaving them untracked/ignored", (t) => {
  for (const mode of ["index-removed", "untracked", "ignored"]) {
    const name = `services/game-platform-vnext/${mode === "ignored" ? "ignored.bin" : "session.mjs"}`;
    const f = fixture(t, { "tests/game-platform-vnext-model-oracles.json": '{"models":[]}',
      ...(mode === "index-removed" ? { [name]: "export const ready = true;" } : {}) });
    if (mode === "index-removed") f.git("rm", "--cached", name);
    else f.put(name, "unreviewed server bytes");
    rmSync(path.join(f.root, ".site-publication"), { recursive: true });
    const guard = spawnSync(process.execPath, [path.join(f.root, "scripts/check-game-platform-vnext-boundaries.mjs")], { cwd: f.root, encoding: "utf8" });
    assert.equal(guard.status, 1, mode); assert.equal(guard.stdout, "", mode);
    assert.match(guard.stderr, /Server publication exclusion failed/, mode);
    assert.match(runGovernanceCheck({ repositoryRoot: f.root }).join("\n"), /Server publication exclusion failed/, mode);
  }
});

test("F1 normal no-server inspection needs no publication receipt, but a symlinked server root cannot hide inputs", (t) => {
  const f = fixture(t, { "tests/game-platform-vnext-model-oracles.json": '{"models":[]}' });
  rmSync(path.join(f.root, ".site-publication"), { recursive: true });
  const guard = () => spawnSync(process.execPath, [path.join(f.root, "scripts/check-game-platform-vnext-boundaries.mjs")], { cwd: f.root, encoding: "utf8" });
  assert.equal(guard().status, 0);
  assert.doesNotMatch(runGovernanceCheck({ repositoryRoot: f.root }).join("\n"), /Server publication exclusion failed/);
  mkdirSync(path.join(f.root, "services/game-platform-vnext"), { recursive: true });
  assert.equal(guard().status, 0); // Empty directory is not an exclusion certificate or a server input.
  rmSync(path.join(f.root, "services/game-platform-vnext"), { recursive: true });
  symlinkSync(path.join(f.root, "js"), path.join(f.root, "services/game-platform-vnext"), "dir");
  assert.equal(guard().status, 1); assert.equal(guard().stdout, "");
  assert.match(runGovernanceCheck({ repositoryRoot: f.root }).join("\n"), /Server publication exclusion failed/);
});

// A matching fixture manifest deliberately isolates root validation from stale/missing evidence.
// It is not a production checkout/publication receipt.
function trackedRootFixture(t, name, kind) {
  const f = fixture(t, { "tests/game-platform-vnext-model-oracles.json": '{"models":[]}' });
  mkdirSync(path.dirname(path.join(f.root, name)), { recursive: true });
  if (kind === "symlink") symlinkSync(path.join(f.root, "js"), path.join(f.root, name), "dir");
  else f.put(name, "not a server directory");
  const revision = f.commit();
  assert.match(f.git("ls-tree", "HEAD", "--", name), kind === "symlink" ? /^120000 / : /^100644 /);
  f.editManifest((manifest) => { manifest.sourceRevision = revision; });
  assert.equal(verifyPublication(f.root).files, 2); // Public bytes/policy are otherwise valid.
  assert.equal(f.git("status", "--porcelain"), "");
  return f;
}

function assertRootRejected(f, error) {
  const evidence = readFileSync(f.manifestPath);
  const output = readFileSync(path.join(f.root, ".site-publication/public/js/app.js"));
  assert.throws(() => verifyCheckoutPublication(f.root), error);
  for (const args of [[], ["--check"]]) {
    const result = f.cli(...args);
    assert.equal(result.status, 1); assert.equal(result.stdout, ""); assert.match(result.stderr, error);
  }
  const guard = spawnSync(process.execPath, [path.join(f.root, "scripts/check-game-platform-vnext-boundaries.mjs")], { cwd: f.root, encoding: "utf8" });
  assert.equal(guard.status, 1); assert.equal(guard.stdout, ""); assert.match(guard.stderr, error);
  assert.match(runGovernanceCheck({ repositoryRoot: f.root }).join("\n"), error);
  assert.deepEqual(readFileSync(f.manifestPath), evidence);
  assert.deepEqual(readFileSync(path.join(f.root, ".site-publication/public/js/app.js")), output);
}

test("F1-R1 tracked exact server root symlink/file cannot use an otherwise matching public manifest", (t) => {
  for (const kind of ["symlink", "file"]) {
    const f = trackedRootFixture(t, "services/game-platform-vnext", kind);
    assertRootRejected(f, /Unsafe server input directory: services\/game-platform-vnext/);
  }
});

test("F1-R1 tracked services parent symlink/file is rejected before following it", (t) => {
  for (const kind of ["symlink", "file"]) {
    const f = trackedRootFixture(t, "services", kind);
    assertRootRejected(f, /Unsafe server input directory: services/);
  }
});

test("F1-R1 missing assume-unchanged tracked root cannot turn into a successful no-server checkout", (t) => {
  for (const name of ["services", "services/game-platform-vnext"]) {
    for (const kind of ["symlink", "file"]) {
      const f = trackedRootFixture(t, name, kind);
      f.git("update-index", "--assume-unchanged", name); rmSync(path.join(f.root, name));
      assert.equal(f.git("diff", "--name-only"), "");
      assertRootRejected(f, /ENOENT/);
    }
  }
});

test("F1-R1 unreadable server directory fails build/check and independent guards despite tracked server entries", (t) => {
  const f = fixture(t, { "services/game-platform-vnext/session.mjs": "export const ready = true;",
    "tests/game-platform-vnext-model-oracles.json": '{"models":[]}' });
  const directory = path.join(f.root, "services/game-platform-vnext"), readdir = fs.readdirSync;
  const evidence = readFileSync(f.manifestPath);
  t.mock.method(fs, "readdirSync", function(filename, ...args) {
    if (path.resolve(String(filename)) === directory) throw Object.assign(new Error("EACCES: server directory unreadable"), { code: "EACCES" });
    return readdir.call(this, filename, ...args);
  });
  assert.throws(() => verifyCheckoutPublication(f.root), /EACCES/);
  assert.match(runGovernanceCheck({ repositoryRoot: f.root }).join("\n"), /EACCES/);
  const hook = path.join(f.root, "tests/deny-server-directory.cjs");
  f.put("tests/deny-server-directory.cjs", `
    const fs = require("node:fs"), path = require("node:path"), readdir = fs.readdirSync;
    const directory = path.join(process.cwd(), "services/game-platform-vnext");
    fs.readdirSync = function(filename, ...args) {
      if (path.resolve(String(filename)) === directory) throw Object.assign(new Error("EACCES: server directory unreadable"), { code: "EACCES" });
      return readdir.call(this, filename, ...args);
    };
  `);
  for (const [script, args] of [["build-site-publication.mjs", []], ["build-site-publication.mjs", ["--check"]], ["check-game-platform-vnext-boundaries.mjs", []]]) {
    const result = spawnSync(process.execPath, ["--require", hook, path.join(f.root, "scripts", script), ...args], { cwd: f.root, encoding: "utf8" });
    assert.equal(result.status, 1); assert.equal(result.stdout, ""); assert.match(result.stderr, /EACCES/);
  }
  assert.deepEqual(readFileSync(f.manifestPath), evidence);
});

test("candidate CI builds before independent server boundary and retains guarded deployment", () => {
  const publication = readFileSync(new URL("../.github/workflows/site-pages-publication.yml", import.meta.url), "utf8");
  const governance = readFileSync(new URL("../.github/workflows/game-platform-governance.yml", import.meta.url), "utf8");
  assert.ok(publication.indexOf("- run: npm run build:publication") < publication.indexOf("- run: node scripts/check-game-platform-vnext-boundaries.mjs"));
  assert.ok(governance.indexOf("- run: npm run build:publication") < governance.indexOf("run: node scripts/check-game-platform-vnext-boundaries.mjs"));
  assert.match(governance, /scripts\/game-platform-vnext-boundary-rules.mjs/);
  assert.equal(publication.includes("continue-on-error"), false);
});

test("actual output tampering fails and a failed dirty-source build leaves no new success manifest", (t) => {
  const f = fixture(t); f.put(".site-publication/public/js/app.js", "tampered");
  assert.throws(() => verifyCheckoutPublication(f.root), /bytes changed/);
  rmSync(path.join(f.root, ".site-publication"), { recursive: true }); f.put("js/app.js", "dirty input");
  const result = f.cli(); assert.equal(result.status, 1); assert.equal(result.stdout, "");
  assert.equal(existsSync(f.manifestPath), false);
});

test("F1 staged and worktree edits cannot cancel each other in production build or check", (t) => {
  const f = fixture(t); const original = readFileSync(path.join(f.root, "js/app.js"));
  const evidence = readFileSync(f.manifestPath);
  f.put("js/app.js", "export const value = 2;"); f.git("add", "js/app.js"); f.put("js/app.js", original);
  assert.equal(f.git("diff", "--name-only", "HEAD", "--"), "");
  assert.equal(f.git("diff", "--cached", "--name-only", "HEAD", "--"), "js/app.js");
  for (const args of [[], ["--check"]]) {
    const result = f.cli(...args); assert.equal(result.status, 1); assert.equal(result.stdout, "");
    assert.match(result.stderr, /must match HEAD/);
  }
  assert.throws(() => verifyCheckoutPublication(f.root), /must match HEAD/);
  assert.deepEqual(readFileSync(f.manifestPath), evidence);
});

// Test-only deterministic interleavings; production has no hook/override input.
function interruptedBuild(f, mode) {
  const hook = path.join(f.root, "tests/interleave.cjs");
  f.put("tests/interleave.cjs", `
    const fs = require("node:fs"), path = require("node:path");
    const rename = fs.renameSync, read = fs.readFileSync, write = fs.writeFileSync;
    const mode = ${JSON.stringify(mode)}, root = process.cwd();
    let installed = false, fired = false;
    function interrupt() {
      if (fired) return;
      fired = true;
      const name = mode === "output" ? ".site-publication/public/js/app.js"
        : mode === "final-checkout" ? "docs/note.md" : "js/app.js";
      write(path.join(root, name), "changed during publication");
    }
    fs.renameSync = function(from, to) {
      const result = rename.call(this, from, to);
      if (String(to) === path.join(root, ".site-publication/manifest.json")) {
        installed = true;
        if (mode !== "final-checkout") interrupt();
      }
      return result;
    };
    fs.readFileSync = function(filename, ...args) {
      const result = read.call(this, filename, ...args);
      if (installed && mode === "final-checkout"
        && String(filename) === path.join(root, ".site-publication/public/js/app.js")) interrupt();
      return result;
    };
  `);
  return spawnSync(process.execPath, ["--require", hook, path.join(f.root, "scripts/build-site-publication.mjs")], { cwd: f.root, encoding: "utf8" });
}

test("F2 a first build failing after manifest installation leaves no new public tree or success evidence", (t) => {
  for (const mode of ["source", "output"]) {
    const f = fixture(t); rmSync(path.join(f.root, ".site-publication"), { recursive: true });
    const result = interruptedBuild(f, mode);
    assert.equal(result.status, 1); assert.equal(result.stdout, "");
    assert.match(result.stderr, mode === "source" ? /must match HEAD/ : /bytes changed/);
    assert.equal(existsSync(f.manifestPath), false);
    assert.equal(existsSync(path.join(f.root, ".site-publication/public")), false);
    assert.deepEqual(readdirSync(path.join(f.root, ".site-publication")), []);
  }
});

test("F2 a failed replacement restores the previous evidence and public bytes, including final checkout failure", (t) => {
  for (const mode of ["source", "final-checkout"]) {
    const f = fixture(t, { "docs/note.md": "original note" });
    const evidence = readFileSync(f.manifestPath);
    const oldPublic = readFileSync(path.join(f.root, ".site-publication/public/js/app.js"));
    f.put("js/app.js", "export const value = 2;"); const next = f.commit();
    const result = interruptedBuild(f, mode);
    assert.equal(result.status, 1); assert.equal(result.stdout, ""); assert.match(result.stderr, /must match HEAD/);
    assert.deepEqual(readFileSync(f.manifestPath), evidence);
    assert.deepEqual(readFileSync(path.join(f.root, ".site-publication/public/js/app.js")), oldPublic);
    assert.notEqual(JSON.parse(readFileSync(f.manifestPath)).sourceRevision, next);
    assert.deepEqual(readdirSync(path.join(f.root, ".site-publication")).sort(), ["manifest.json", "public"]);
  }
});

test("F2 read-only failed check preserves the existing evidence and output without repairing them", (t) => {
  const f = fixture(t); f.put(".site-publication/public/js/app.js", "tampered");
  const evidence = readFileSync(f.manifestPath);
  const result = f.cli("--check"); assert.equal(result.status, 1); assert.equal(result.stdout, "");
  assert.match(result.stderr, /bytes changed/);
  assert.deepEqual(readFileSync(f.manifestPath), evidence);
  assert.equal(readFileSync(path.join(f.root, ".site-publication/public/js/app.js"), "utf8"), "tampered");
});
