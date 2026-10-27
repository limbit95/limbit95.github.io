import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { gzipSync, gunzipSync } from "node:zlib";

export const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
export const fault = (code) => Object.assign(new Error(code), { code });
const MAX = 64 * 1024 * 1024;
const utf8 = new TextDecoder("utf-8", { fatal: true });
export function safeName(name) {
  if (typeof name !== "string" || !name || /[\\:%\x00-\x1f\x7f]/u.test(name)
    || name.split("/").some((s) => !s || s === "." || s === "..")) throw fault("UNSAFE_ARCHIVE_PATH");
  return name;
}
export function collectTree(root, prefix = "payload") {
  const entries = [];
  function walk(filename, name) {
    safeName(name);
    const st = fs.lstatSync(filename);
    if (st.isSymbolicLink() || (!st.isFile() && !st.isDirectory()) || (st.isFile() && st.nlink !== 1)
      || (st.mode & 0o7000)) throw fault("NON_ORDINARY_PAYLOAD");
    const record = { path: name, type: st.isDirectory() ? "directory" : "file", mode: st.mode & 0o777,
      size: st.isFile() ? st.size : 0 };
    const bytes = st.isFile() ? fs.readFileSync(filename) : Buffer.alloc(0);
    if (st.isFile()) record.sha256 = sha256(bytes);
    entries.push({ ...record, bytes });
    if (st.isDirectory()) for (const child of fs.readdirSync(filename).sort()) walk(path.join(filename, child), name + "/" + child);
  }
  walk(root, prefix);
  return entries;
}
export const inventory = (entries) => entries.map(({ bytes, ...record }) => record);
function textField(header, offset, length, value) {
  const bytes = Buffer.from(value);
  if (bytes.length > length) throw fault("USTAR_FIELD_TOO_LONG");
  bytes.copy(header, offset);
}
function octal(header, offset, length, n) {
  if (!Number.isSafeInteger(n) || n < 0 || n.toString(8).length >= length) throw fault("USTAR_NUMBER_RANGE");
  textField(header, offset, length, n.toString(8).padStart(length - 1, "0") + "\0");
}
export function encodeTar(entries) {
  const parts = [], seen = new Set(); let total = 1024;
  for (const entry of entries) {
    safeName(entry.path);
    if (seen.has(entry.path)) throw fault("DUPLICATE_ARCHIVE_PATH"); seen.add(entry.path);
    if (!["file", "directory"].includes(entry.type)) throw fault("UNSUPPORTED_ARCHIVE_TYPE");
    const bytes = entry.bytes ?? Buffer.alloc(0), header = Buffer.alloc(512);
    if (entry.type === "directory" && bytes.length) throw fault("DIRECTORY_DATA");
    let name = entry.path, prefix = "";
    if (Buffer.byteLength(name) > 100) {
      const splits = [...name.matchAll(/\//gu)].map((m) => m.index).reverse();
      const split = splits.find((i) => Buffer.byteLength(name.slice(0, i)) <= 155 && Buffer.byteLength(name.slice(i + 1)) <= 100);
      if (split === undefined) throw fault("USTAR_PATH_TOO_LONG");
      prefix = name.slice(0, split); name = name.slice(split + 1);
    }
    textField(header, 0, 100, name); textField(header, 345, 155, prefix);
    octal(header, 100, 8, entry.mode); octal(header, 108, 8, 0); octal(header, 116, 8, 0);
    octal(header, 124, 12, bytes.length); octal(header, 136, 12, 0);
    header.fill(32, 148, 156); header[156] = entry.type === "directory" ? 53 : 48;
    textField(header, 257, 6, "ustar\0"); textField(header, 263, 2, "00");
    const checksum = header.reduce((a, b) => a + b, 0);
    textField(header, 148, 8, checksum.toString(8).padStart(6, "0") + "\0 ");
    const padding = Buffer.alloc((512 - bytes.length % 512) % 512);
    total += 512 + bytes.length + padding.length;
    if (total > MAX) throw fault("ARCHIVE_SIZE_LIMIT");
    parts.push(header, bytes, padding);
  }
  return Buffer.concat([...parts, Buffer.alloc(1024)]);
}
function stringAt(header, offset, length) {
  const field = header.subarray(offset, offset + length), end = field.indexOf(0);
  if (end >= 0 && field.subarray(end).some((b) => b !== 0)) throw fault("NON_CANONICAL_USTAR_FIELD");
  return utf8.decode(end >= 0 ? field.subarray(0, end) : field);
}
function numberAt(header, offset, length) {
  const value = header.subarray(offset, offset + length).toString("ascii").replace(/[\0 ]+$/u, "");
  if (!/^[0-7]+$/u.test(value)) throw fault("INVALID_USTAR_NUMBER");
  const n = parseInt(value, 8); if (!Number.isSafeInteger(n)) throw fault("INVALID_USTAR_NUMBER");
  return n;
}
export function decodeTar(tar) {
  if (tar.length > MAX || tar.length % 512) throw fault("INVALID_TAR_SIZE");
  const entries = [], seen = new Map(); let offset = 0;
  while (offset + 512 <= tar.length) {
    const header = tar.subarray(offset, offset + 512);
    if (header.every((b) => b === 0)) {
      if (tar.length - offset < 1024 || tar.subarray(offset).some((b) => b !== 0)) throw fault("INVALID_TAR_END");
      return entries;
    }
    const checksum = numberAt(header, 148, 8), copy = Buffer.from(header); copy.fill(32, 148, 156);
    if (copy.reduce((a, b) => a + b, 0) !== checksum) throw fault("USTAR_CHECKSUM_MISMATCH");
    if (!header.subarray(257, 265).equals(Buffer.from("ustar\0" + "00"))) throw fault("USTAR_ONLY");
    if (header.subarray(157, 257).some((b) => b !== 0) || ![48, 53].includes(header[156])) throw fault("UNSUPPORTED_ARCHIVE_TYPE");
    const prefix = stringAt(header, 345, 155), name = stringAt(header, 0, 100);
    const filename = safeName(prefix ? prefix + "/" + name : name);
    const mode = numberAt(header, 100, 8), size = numberAt(header, 124, 12), type = header[156] === 53 ? "directory" : "file";
    if (mode > 0o777 || (type === "directory" && size)) throw fault("UNSAFE_ARCHIVE_MODE_OR_SIZE");
    if (seen.has(filename)) throw fault("DUPLICATE_ARCHIVE_PATH");
    for (let parent = path.posix.dirname(filename); parent !== "."; parent = path.posix.dirname(parent)) {
      if (seen.get(parent) !== "directory") throw fault("ARCHIVE_PARENT_REQUIRED");
    }
    seen.set(filename, type);
    const end = offset + 512 + size, next = end + (512 - size % 512) % 512;
    if (next > tar.length || tar.subarray(end, next).some((b) => b !== 0)) throw fault("INVALID_TAR_DATA");
    const bytes = Buffer.from(tar.subarray(offset + 512, end));
    entries.push({ path: filename, type, mode, size, ...(type === "file" ? { sha256: sha256(bytes) } : {}), bytes });
    if (entries.length > 10_000) throw fault("ARCHIVE_ENTRY_LIMIT");
    offset = next;
  }
  throw fault("MISSING_TAR_END");
}
export function createArchive(payload, manifest) {
  const bytes = Buffer.from(JSON.stringify(manifest, null, 2) + "\n");
  return gzipSync(encodeTar([...payload, { path: "evidence", type: "directory", mode: 0o700 },
    { path: "evidence/manifest.json", type: "file", mode: 0o600, bytes }]), { level: 9 });
}
export function verifyArchive(archive, expected) {
  if (!expected || sha256(archive) !== expected.archiveSha256) throw fault("ARCHIVE_DIGEST_MISMATCH");
  const entries = decodeTar(gunzipSync(archive, { maxOutputLength: MAX }));
  const internal = entries.find((e) => e.path === "evidence/manifest.json");
  if (!internal || sha256(internal.bytes) !== expected.manifestSha256) throw fault("MANIFEST_DIGEST_MISMATCH");
  const manifest = JSON.parse(internal.bytes);
  if (manifest.scope !== "PRIVATE_LIBRARY_ONLY" || manifest.sourceRevision !== expected.sourceRevision
    || manifest.sourceTree !== expected.sourceTree) throw fault("PACKAGE_REVISION_MISMATCH");
  const payload = entries.filter((e) => e.path === "payload" || e.path.startsWith("payload/"));
  if (JSON.stringify(inventory(payload)) !== JSON.stringify(manifest.files)
    || entries.length !== payload.length + 2) throw fault("PAYLOAD_INVENTORY_MISMATCH");
  if (entries.some((e) => !payload.includes(e) && !["evidence", "evidence/manifest.json"].includes(e.path))) throw fault("EXTRA_ARCHIVE_ENTRY");
  for (const [name, hash] of Object.entries(expected.sourceHashes ?? {})) {
    if (payload.find((e) => e.path === "payload/services/game-platform-vnext/" + name)?.sha256 !== hash) throw fault("SOURCE_PAYLOAD_MISMATCH");
  }
  return { manifest, entries };
}
export function extractNew(entries, destination) {
  // Only entries from verifyArchive; decodeTar validates paths/types/parents before any write.
  if (fs.existsSync(destination)) throw fault("NEW_UNPACK_PATH_REQUIRED");
  fs.mkdirSync(destination, { mode: 0o700 });
  for (const entry of entries) {
    safeName(entry.path);
    const filename = path.join(destination, entry.path);
    if (entry.type === "directory") fs.mkdirSync(filename, { mode: entry.mode });
    else fs.writeFileSync(filename, entry.bytes, { mode: entry.mode, flag: "wx" });
    fs.chmodSync(filename, entry.mode);
  }
}
