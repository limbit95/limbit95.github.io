import { createHash } from "node:crypto";
const stable = (v) => v && typeof v === "object" ? Array.isArray(v) ? `[${v.map(stable).join(",")}]`
  : `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${stable(v[k])}`).join(",")}}` : JSON.stringify(v);
export function exactPrivateLock(pkg, lock) {
  if (pkg.private !== true || pkg.type !== "module" || pkg.dependencies?.pg !== "8.23.1" || pkg.dependencies?.jose !== "6.2.12"
    || Object.keys(pkg.dependencies).sort().join() !== "jose,pg" || lock.lockfileVersion !== 3) return false;
  const p = structuredClone(lock.packages ?? {}), jose = p["node_modules/jose"];
  if (!jose || jose.version !== "6.2.12" || jose.resolved !== "https://registry.npmjs.org/jose/-/jose-6.2.12.tgz"
    || jose.integrity !== "sha512-9NiFmJEex0sy2Dk58j2UGBSHgUs2ypF9eZSu4L6vjOX3Dp96Sw1F3uL+H+D1sx02jZZdzUT0HgvCy59CuvXcWw=="
    || Object.keys(jose.dependencies ?? {}).length || p[""]?.dependencies?.jose !== "6.2.12") return false;
  delete p["node_modules/jose"]; delete p[""].dependencies.jose;
  return createHash("sha256").update(stable(p)).digest("hex") === "f4fcbefd725c854b24b061ef5871caa20bcc852bc13047b61aab0187ba645d87";
}
