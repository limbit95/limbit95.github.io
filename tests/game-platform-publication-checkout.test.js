import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { verifyCheckoutPublication } from "../scripts/build-site-publication.mjs";

function fixture(t, extra = {}) {
  const root = mkdtempSync(path.join(os.tmpdir(), "publication-checkout-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const put = (name, bytes) => { mkdirSync(path.dirname(path.join(root, name)), { recursive: true }); writeFileSync(path.join(root, name), bytes); };
  const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  const files = { "index.html": '<script type="module" src="./js/app.js"></script>', "js/app.js": "export const value = 1;" };
  for (const [name, bytes] of Object.entries({ ...files, ...extra })) put(name, bytes);
  put("scripts/site-publication-files.json", JSON.stringify({ schemaVersion: 1, files: Object.keys(files) }));
  put(".gitignore", ".site-publication/\nassets/ignored.js\nservices/game-platform-vnext/ignored.bin\n");
  for (const name of ["build-site-publication.mjs", "check-game-platform-vnext-boundaries.mjs"]) {
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

test("current server inventory participates in exclusion checks while the independent production Guard still blocks it", (t) => {
  const name = "services/game-platform-vnext/canary.bin"; const f = fixture(t, { [name]: "SERVER_CANARY" });
  assert.equal(verifyCheckoutPublication(f.root).files, 2);
  assert.equal(existsSync(path.join(f.root, ".site-publication/public", name)), false);
  const guard = spawnSync(process.execPath, [path.join(f.root, "scripts/check-game-platform-vnext-boundaries.mjs")], { cwd: f.root, encoding: "utf8" });
  assert.equal(guard.status, 1); assert.match(guard.stderr, /exclusion is unverified/);
  f.put(name, "changed server only"); assert.throws(() => verifyCheckoutPublication(f.root), /must match HEAD/);
  f.commit(); assert.throws(() => verifyCheckoutPublication(f.root), /manifest revision/);
  f.put("js/app.js", "changed server only"); f.commit();
  const failedBuild = f.cli(); assert.notEqual(failedBuild.status, 0); assert.match(failedBuild.stderr, /alias a tracked server/);
  assert.notEqual(JSON.parse(readFileSync(f.manifestPath)).sourceRevision, f.git("rev-parse", "HEAD"));
});

test("actual output tampering fails and a failed dirty-source build leaves no new success manifest", (t) => {
  const f = fixture(t); f.put(".site-publication/public/js/app.js", "tampered");
  assert.throws(() => verifyCheckoutPublication(f.root), /bytes changed/);
  rmSync(path.join(f.root, ".site-publication"), { recursive: true }); f.put("js/app.js", "dirty input");
  const result = f.cli(); assert.equal(result.status, 1); assert.equal(result.stdout, "");
  assert.equal(existsSync(f.manifestPath), false);
});
