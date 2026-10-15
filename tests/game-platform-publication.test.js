import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { buildPublication, verifyPublication } from "../scripts/build-site-publication.mjs";

function fixture(t, extra = {}) {
  const root = mkdtempSync(path.join(os.tmpdir(), "site-publication-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const sources = {
    "index.html": '<link href="./css/site.css" rel="stylesheet"><script type="module" src="./js/app.js"></script>',
    "css/site.css": 'body { background: url("../assets/icon.svg"); }',
    "js/app.js": 'import "./lib.js";',
    "js/lib.js": 'export const value = 1;',
    "assets/icon.svg": '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
    "manifest.webmanifest": JSON.stringify({ start_url: "/#/", icons: [{ src: "/assets/icon.svg" }] }),
    "games/fixture/index.html": '<script type="module" src="../../js/app.js"></script>',
    "CNAME": "example.invalid\n",
    ".nojekyll": "\n",
    ...extra,
  };
  for (const [filename, source] of Object.entries(sources)) put(root, filename, source);
  const files = Object.keys(sources).filter((name) => !name.startsWith("services/") && !name.startsWith("docs/") && !name.startsWith("tests/"));
  const inventory = Object.keys(sources).map((filename) => ({ path: filename, mode: "100644" }));
  const policy = { schemaVersion: 1, files };
  const savePolicy = () => put(root, "scripts/site-publication-files.json", JSON.stringify(policy));
  savePolicy();
  return { root, inventory, policy, savePolicy, output: path.join(root, ".site-publication/public") };
}
function put(root, name, value) { const target = path.join(root, name); mkdirSync(path.dirname(target), { recursive: true }); writeFileSync(target, value); }

test("publication preserves exact static paths/bytes and excludes tracked server/docs/test canaries", (t) => {
  const f = fixture(t, { "services/game-platform-vnext/marker.bin": "SERVER_CANARY", "docs/history.md": "history", "tests/private.test.js": "test-only" });
  const manifest = buildPublication(f.root, { inventory: f.inventory, sourceRevision: "fixture-only" });
  assert.equal(manifest.sourceRevision, "fixture-only");
  assert.deepEqual(manifest.files.map((item) => item.path).sort(), [...f.policy.files].sort());
  assert.ok(manifest.files.every((item) => item.path === item.source && item.sha256.length === 64));
  for (const name of f.policy.files) assert.deepEqual(readFileSync(path.join(f.root, name)), readFileSync(path.join(f.output, name)));
  assert.equal(verifyPublication(f.root, { inventory: f.inventory }).files, f.policy.files.length);
  assert.equal(buildPublication(f.root, { inventory: f.inventory }).files.length, f.policy.files.length);
});

test("publication rejects server paths in the explicit public policy", (t) => {
  const f = fixture(t, { "services/game-platform-vnext/marker.js": "SERVER_ONLY" });
  f.policy.files.push("services/game-platform-vnext/marker.js"); f.savePolicy();
  assert.throws(() => buildPublication(f.root, { inventory: f.inventory }), /Forbidden/);
});

test("publication rejects renamed public bytes identical to a tracked server artifact", (t) => {
  const f = fixture(t, { "services/game-platform-vnext/marker.bin": "SERVER_ONLY", "assets/renamed.js": "SERVER_ONLY" });
  assert.throws(() => buildPublication(f.root, { inventory: f.inventory }), /alias a tracked server/);
});

test("publication rejects a browser reference to an excluded server source", (t) => {
  const f = fixture(t, { "js/lib.js": 'export { value } from "../services/game-platform-vnext/marker.js";', "services/game-platform-vnext/marker.js": "export const value = 2;" });
  assert.throws(() => buildPublication(f.root, { inventory: f.inventory }), /Browser\/server boundary violation/);
});

test("publication requires explicit review of newly tracked runtime assets", (t) => {
  const f = fixture(t); put(f.root, "js/new.js", "new module"); f.inventory.push({ path: "js/new.js", mode: "100644" });
  assert.throws(() => buildPublication(f.root, { inventory: f.inventory }), /Unlisted public input/);
});

test("publication fails for a missing selected source or broken browser import", (t) => {
  const f = fixture(t); rmSync(path.join(f.root, "assets/icon.svg"));
  assert.throws(() => buildPublication(f.root, { inventory: f.inventory }), /ENOENT/);
  put(f.root, "assets/icon.svg", "icon"); put(f.root, "js/app.js", 'import "./missing.js";');
  assert.throws(() => buildPublication(f.root, { inventory: f.inventory }), /Missing public reference/);
});

test("publication rejects policy traversal, encoded paths, archives, maps, and duplicates", (t) => {
  const f = fixture(t);
  for (const name of ["../outside.js", "assets/%2e%2e/server.js", "assets/server.zip", "assets/server.js.map", "index.html"]) {
    f.policy.files.push(name); f.savePolicy();
    assert.throws(() => buildPublication(f.root, { inventory: f.inventory }), /Unsafe|Forbidden/);
    f.policy.files.pop();
  }
});

test("publication never follows source or parent-directory symlinks", (t) => {
  const f = fixture(t); rmSync(path.join(f.root, "js/lib.js")); symlinkSync("app.js", path.join(f.root, "js/lib.js"));
  assert.throws(() => buildPublication(f.root, { inventory: f.inventory }), /symlinks/);
  rmSync(path.join(f.root, "js"), { recursive: true }); mkdirSync(path.join(f.root, "elsewhere"));
  put(f.root, "elsewhere/app.js", "app"); put(f.root, "elsewhere/lib.js", "lib"); symlinkSync("elsewhere", path.join(f.root, "js"));
  assert.throws(() => buildPublication(f.root, { inventory: f.inventory }), /symlinks/);
});

test("publication verification rejects changed, added, and removed output bytes", (t) => {
  const f = fixture(t); buildPublication(f.root, { inventory: f.inventory });
  put(f.output, "index.html", "tampered"); assert.throws(() => verifyPublication(f.root, { inventory: f.inventory }), /bytes changed/);
  buildPublication(f.root, { inventory: f.inventory }); put(f.output, "assets/injected.js", "injected");
  assert.throws(() => verifyPublication(f.root, { inventory: f.inventory }), /inventory/);
  rmSync(path.join(f.output, "assets/injected.js")); rmSync(path.join(f.output, "js/lib.js"));
  assert.throws(() => verifyPublication(f.root, { inventory: f.inventory }), /inventory/);
});

test("publication verification rejects an unchanged file count with forged provenance", (t) => {
  const f = fixture(t); buildPublication(f.root, { inventory: f.inventory });
  const name = path.join(f.root, ".site-publication/manifest.json"); const evidence = JSON.parse(readFileSync(name));
  evidence.files[0].source = "services/game-platform-vnext/server.js"; writeFileSync(name, JSON.stringify(evidence));
  assert.throws(() => verifyPublication(f.root, { inventory: f.inventory }), /provenance/);
});

test("publication verification detects source changes after assembly", (t) => {
  const f = fixture(t); buildPublication(f.root, { inventory: f.inventory }); put(f.root, "js/lib.js", "export const value = 3;");
  assert.throws(() => verifyPublication(f.root, { inventory: f.inventory }), /bytes changed/);
});

test("publication rejects symlinked output and symlinked state root", (t) => {
  const f = fixture(t); buildPublication(f.root, { inventory: f.inventory }); rmSync(f.output, { recursive: true });
  symlinkSync(path.join(f.root, "games"), f.output);
  assert.throws(() => verifyPublication(f.root, { inventory: f.inventory }), /Unsafe publish root/);
  assert.throws(() => buildPublication(f.root, { inventory: f.inventory }), /Unsafe existing/);
  rmSync(path.join(f.root, ".site-publication"), { recursive: true }); symlinkSync(path.join(f.root, "games"), path.join(f.root, ".site-publication"));
  assert.throws(() => buildPublication(f.root, { inventory: f.inventory }), /state directory/);
});

test("publication requires real bundle inputs and outputs in the exact public set", (t) => {
  const f = fixture(t, { "assets/build/manifest.json": JSON.stringify({ entry: "js/app.js", outputs: ["js/app.js"] }) });
  assert.throws(() => buildPublication(f.root, { inventory: f.inventory }), /esbuild input/);
  put(f.root, "assets/build/manifest.json", JSON.stringify({ entry: "js/app.js", inputs: ["services/game-platform-vnext/hidden.js"], outputs: ["js/app.js"] }));
  assert.throws(() => buildPublication(f.root, { inventory: f.inventory }), /Bundle input outside/);
  put(f.root, "assets/build/manifest.json", JSON.stringify({ entry: "js/app.js", inputs: ["js/app.js"], outputs: ["assets/build/missing.js"] }));
  assert.throws(() => buildPublication(f.root, { inventory: f.inventory }), /Missing public bundle output/);
});

test("publication refuses an evidence symlink without changing its target", (t) => {
  const f = fixture(t); put(f.root, "outside.json", "UNCHANGED");
  mkdirSync(path.join(f.root, ".site-publication"));
  symlinkSync("../outside.json", path.join(f.root, ".site-publication/manifest.json"));
  assert.throws(() => buildPublication(f.root, { inventory: f.inventory }), /evidence must/);
  assert.equal(readFileSync(path.join(f.root, "outside.json"), "utf8"), "UNCHANGED");
});

test("publication resolves bare modules only inside the declared browser entry boundary", (t) => {
  const f = fixture(t, {
    "marble-game/index.html": '<script type="importmap">{"imports":{"engine":"./js/engine.js"}}</script><script type="module" src="./js/main.js"></script>',
    "marble-game/js/main.js": 'import "engine";',
    "marble-game/js/engine.js": 'export const engine = true;',
  });
  f.policy.moduleMaps = [{ entry: "marble-game/index.html", moduleRoot: "marble-game/js/" }]; f.savePolicy();
  buildPublication(f.root, { inventory: f.inventory });
  put(f.root, "js/app.js", 'import "engine";');
  assert.throws(() => buildPublication(f.root, { inventory: f.inventory }), /Unresolved browser module/);
  put(f.root, "js/app.js", 'import "./lib.js";');
  put(f.root, "marble-game/index.html", '<script type="importmap">{"imports":{"engine":"./js/missing.js"}}</script>');
  assert.throws(() => buildPublication(f.root, { inventory: f.inventory }), /Missing public reference/);
});

test("publication verification rejects a symlink inside the public artifact", (t) => {
  const f = fixture(t); buildPublication(f.root, { inventory: f.inventory });
  rmSync(path.join(f.output, "js/lib.js")); symlinkSync("app.js", path.join(f.output, "js/lib.js"));
  assert.throws(() => verifyPublication(f.root, { inventory: f.inventory }), /Symlink in publish tree/);
});

test("Pages workflow permits deployment only on explicit main dispatch and uploads the verified directory", () => {
  const workflow = readFileSync(new URL("../.github/workflows/site-pages-publication.yml", import.meta.url), "utf8");
  assert.match(workflow, /default: false/);
  const gate = "github.event_name == 'workflow_dispatch' && inputs.publish == true && github.ref == 'refs/heads/main'";
  assert.equal(workflow.split(gate).length - 1, 2);
  assert.match(workflow, /needs: prepare/);
  assert.match(workflow, /path: \.site-publication\/public\n/);
  assert.doesNotMatch(workflow, /pull_request_target:|\n  push:|path: ['"]?\.['"]?\s*\n/);
  assert.ok(workflow.indexOf("npm run check:publication") < workflow.indexOf("actions/upload-pages-artifact@"));
  assert.match(workflow, /artifact_name: github-pages/);
});
