import test from "node:test";
import { exactPrivateLock } from '../scripts/private-game-dependency-lock.mjs';
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync, gunzipSync } from "node:zlib";
import { collectTree, inventory, createArchive, verifyArchive, extractNew, encodeTar, decodeTar, sha256 } from "../scripts/private-library-archive.mjs";
import { SOURCE_NAMES, SERVICE, readFixedSources, assertNoAncestorPg, buildPackage, bindPublic } from "../scripts/package-game-platform-vnext-private-library.mjs";

// Archive/filesystem contracts only. Actual fixed library bytes, never a fake driver.
// No Client/factory/runner execution, SQL, registry request or socket experiment.
const root = fileURLToPath(new URL("../", import.meta.url));
const json = (x) => JSON.stringify(x, null, 2) + "\n";
function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "vnext-library-archive-contract-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const payload = path.join(directory, "payload"), service = path.join(payload, SERVICE);
  fs.mkdirSync(service, { recursive: true });
  const fixed = readFixedSources(root);
  for (const [n, source] of Object.entries(fixed.sources)) fs.writeFileSync(path.join(service, n), source.bytes, { mode: source.mode });
  const entries = collectTree(payload), manifest = { scope: "PRIVATE_LIBRARY_ONLY", sourceRevision: fixed.sourceRevision,
    sourceTree: fixed.sourceTree, files: inventory(entries) };
  const sourceHashes = Object.fromEntries(Object.entries(fixed.sources).map(([n, s]) => [n, s.sha256]));
  const expected = { sourceRevision: fixed.sourceRevision, sourceTree: fixed.sourceTree, sourceHashes };
  return { directory, payload, service, fixed, entries, manifest, expected };
}
function archive(f, entries = f.entries, manifest = f.manifest) {
  const bytes = createArchive(entries, manifest);
  return { bytes, expected: { ...f.expected, archiveSha256: sha256(bytes), manifestSha256: sha256(Buffer.from(json(manifest))) } };
}
function headerEdit(bytes, edit) {
  const tar = gunzipSync(bytes), header = tar.subarray(0, 512); edit(header);
  header.fill(32, 148, 156);
  header.write(header.reduce((a, b) => a + b, 0).toString(8).padStart(6, "0") + "\0 ", 148, 8, "ascii");
  return tar;
}

test("private archive roundtrip preserves all five fixed inputs and independent unpack modes/bytes", (t) => {
  const f = fixture(t), a = archive(f), checked = verifyArchive(a.bytes, a.expected), dest = path.join(f.directory, "unpack");
  extractNew(checked.entries, dest);
  assert.deepEqual(inventory(collectTree(path.join(dest, "payload"))), f.manifest.files);
  for (const name of SOURCE_NAMES) assert.deepEqual(fs.readFileSync(path.join(dest, "payload", SERVICE, name)), f.fixed.sources[name].bytes);
});
test("private archive requires sessionControl even when a diff-only payload and manifest agree", (t) => {
  const f = fixture(t), entries = f.entries.filter((e) => !e.path.endsWith("/sessionControl.mjs"));
  const a = archive(f, entries, { ...f.manifest, files: inventory(entries) });
  assert.throws(() => verifyArchive(a.bytes, a.expected), { code: "SOURCE_PAYLOAD_MISMATCH" });
});
test("private archive rejects changed exact lock despite internally consistent inventory", (t) => {
  const f = fixture(t), entries = f.entries.map((e) => e.path.endsWith("/package-lock.json")
    ? { ...e, bytes: Buffer.from("{}\n"), size: 3, sha256: sha256(Buffer.from("{}\n")) } : e);
  const a = archive(f, entries, { ...f.manifest, files: inventory(entries) });
  assert.throws(() => verifyArchive(a.bytes, a.expected), { code: "SOURCE_PAYLOAD_MISMATCH" });
});
test("private archive digest and manifest digest are independent trusted receipt inputs", (t) => {
  const f = fixture(t), a = archive(f), changed = Buffer.from(a.bytes); changed[20] ^= 1;
  assert.throws(() => verifyArchive(changed, a.expected), { code: "ARCHIVE_DIGEST_MISMATCH" });
  assert.throws(() => verifyArchive(a.bytes, { ...a.expected, manifestSha256: "0".repeat(64) }), { code: "MANIFEST_DIGEST_MISMATCH" });
});
test("private archive rejects wrong revision or tree without extracting", (t) => {
  const f = fixture(t), a = archive(f);
  for (const field of ["sourceRevision", "sourceTree"]) assert.throws(() => verifyArchive(a.bytes,
    { ...a.expected, [field]: "0".repeat(40) }), { code: "PACKAGE_REVISION_MISMATCH" });
});
test("private archive detects omitted files and unexpected evidence entries", (t) => {
  const f = fixture(t), a = archive(f, f.entries.filter((e) => !e.path.endsWith("/sessionControl.mjs")));
  assert.throws(() => verifyArchive(a.bytes, a.expected), { code: "PAYLOAD_INVENTORY_MISMATCH" });
  const tar = decodeTar(gunzipSync(archive(f).bytes));
  tar.push({ path: "evidence/unexpected", type: "file", mode: 0o600, bytes: Buffer.from("not-shipped") });
  const bytes = gzipSync(encodeTar(tar));
  assert.throws(() => verifyArchive(bytes, { ...archive(f).expected, archiveSha256: sha256(bytes) }), { code: "PAYLOAD_INVENTORY_MISMATCH" });
});
test("private archive rejects traversal and absolute names before filesystem writes", (t) => {
  const f = fixture(t), a = archive(f);
  for (const bad of ["../outside", "/absolute", "payload/../outside", "payload\\outside", "payload/%2e%2e"]) {
    const tar = headerEdit(a.bytes, (h) => { h.fill(0, 0, 100); h.write(bad, 0); });
    assert.throws(() => decodeTar(tar), { code: "UNSAFE_ARCHIVE_PATH" });
  }
});
test("private archive rejects symlink/hardlink/PAX entries rather than following or omitting them", (t) => {
  const f = fixture(t), a = archive(f);
  for (const type of ["1", "2", "x", "g", "L"]) assert.throws(() => decodeTar(headerEdit(a.bytes,
    (h) => { h[156] = type.charCodeAt(0); })), { code: "UNSUPPORTED_ARCHIVE_TYPE" });
});
test("private archive rejects duplicate entries, checksum damage and missing trailer", (t) => {
  const f = fixture(t);
  assert.throws(() => encodeTar([f.entries[0], f.entries[0]]), { code: "DUPLICATE_ARCHIVE_PATH" });
  const tar = encodeTar(f.entries); tar[0] ^= 1;
  assert.throws(() => decodeTar(tar), { code: "USTAR_CHECKSUM_MISMATCH" });
  assert.throws(() => decodeTar(encodeTar(f.entries).subarray(0, -1024)), { code: "MISSING_TAR_END" });
});
test("payload inventory includes hidden metadata but refuses filesystem symlinks and hardlinks", (t) => {
  const f = fixture(t), metadata = path.join(f.service, "node_modules/.package-lock.json");
  fs.mkdirSync(path.dirname(metadata)); fs.writeFileSync(metadata, "{\"fixture\":true}\n");
  assert.ok(collectTree(f.payload).some((e) => e.path.endsWith("/.package-lock.json")));
  fs.symlinkSync(f.service, path.join(f.service, "foreign"));
  assert.throws(() => collectTree(f.payload), { code: "NON_ORDINARY_PAYLOAD" });
  fs.unlinkSync(path.join(f.service, "foreign")); fs.linkSync(metadata, path.join(f.service, "hardlink"));
  assert.throws(() => collectTree(f.payload), { code: "NON_ORDINARY_PAYLOAD" });
});
test("private unpack never replaces an existing path or foreign file", (t) => {
  const f = fixture(t), a = archive(f), dest = path.join(f.directory, "foreign"); fs.mkdirSync(dest);
  fs.writeFileSync(path.join(dest, "owner"), "preserve");
  assert.throws(() => extractNew(verifyArchive(a.bytes, a.expected).entries, dest), { code: "NEW_UNPACK_PATH_REQUIRED" });
  assert.equal(fs.readFileSync(path.join(dest, "owner"), "utf8"), "preserve");
});
test("private unpack requires no pg supply from its root or ancestors", (t) => {
  const f = fixture(t); assertNoAncestorPg(f.directory);
  // Foreign filesystem sentinel, never a driver implementation or import.
  fs.mkdirSync(path.join(f.directory, "node_modules/pg"), { recursive: true });
  assert.throws(() => assertNoAncestorPg(path.join(f.directory, "new-unpack")), { code: "ANCESTOR_PG_SUPPLY" });
});
test("public binding rejects revision and private manifest substitution before publication reads", (t) => {
  const f = fixture(t), id = { sourceRevision: f.fixed.sourceRevision, sourceTree: f.fixed.sourceTree };
  assert.throws(() => bindPublic(root, { ...id, sourceRevision: "wrong" }, id, id), { code: "PUBLIC_PRIVATE_REVISION_MISMATCH" });
  assert.throws(() => bindPublic(root, { ...id, manifestSha256: "wrong" }, id, id), { code: "PRIVATE_MANIFEST_MISMATCH" });
});
test("interrupted package creation retains only its new owner and never claims cleanup or install", async (t) => {
  const f = fixture(t), parent = path.join(f.directory, "jobs"); fs.mkdirSync(parent);
  fs.writeFileSync(path.join(parent, "foreign"), "keep"); const controller = new AbortController(); controller.abort();
  await assert.rejects(buildPackage({ root, outputParent: parent, signal: controller.signal }), (error) => {
    assert.equal(error.code, "PACKAGE_CHILD_FAILED_OR_UNCONFIRMED");
    const owner = JSON.parse(fs.readFileSync(path.join(error.ownerDirectory, "owner.json")));
    assert.equal(owner.status, "FAILED_OR_INCONCLUSIVE");
    assert.equal(owner.child.status, "INTERRUPTED_BEFORE_SPAWN");
    assert.equal(owner.cleanup, "RETAINED_EXTERNAL_OWNER_DISPOSAL_REQUIRED");
    assert.equal(fs.existsSync(path.join(error.ownerDirectory, "private-library.tar.gz")), false);
    return true;
  });
  assert.equal(fs.readFileSync(path.join(parent, "foreign"), "utf8"), "keep");
});

test('private source set includes verifier and rejects changed JOSE or original pg lock entries',()=>{
 const f=readFixedSources(root);assert.ok(SOURCE_NAMES.includes('tokenVerifier.mjs'));
 assert.equal(f.lock.packages['node_modules/jose'].version,'6.2.12');
 const pkg=JSON.parse(f.sources['package.json'].bytes);assert.equal(exactPrivateLock(pkg,f.lock),true);
 for(const name of ['node_modules/jose','node_modules/pg-types']){const lock=structuredClone(f.lock);lock.packages[name].version='0.0.0';assert.equal(exactPrivateLock(pkg,lock),false);}
 const lock=structuredClone(f.lock);lock.packages['node_modules/unexpected']={version:'1.0.0'};assert.equal(exactPrivateLock(pkg,lock),false);
});
