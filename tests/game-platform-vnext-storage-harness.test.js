import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { validateManifest } from "./game-db-integration/vnext-storage-candidate/run.mjs";

// Preflight/CLI only. No runCandidate invocation, net server, query, or database.
const valid = () => ({ disposable: true, kind: "isolated-local-supabase-direct-pg", runId: "12345678-1234-1234-1234-123456789abc", gitHead: "a".repeat(40),
  imageDigest: "sha256:" + "b".repeat(64), pgVersion: "fixture-version", supabaseCliVersion: "fixture-version", host: "127.0.0.1", port: 54322,
  database: "vnext_lease_candidate_12345678123412341234123456789abc", user: "postgres", passwordFile: "/outside/private/password", ssl: false,
  timings: { connectMs: 1000, queryMs: 1000, cleanupMs: 1000, observeMs: 2000 }, allowSqlInstallAndCleanup: true, allowLocalFaultProxy: true });

test("unconfigured CLI refuses execution, not a skipped/passing DB scenario", () => {
  assert.throws(() => execFileSync(process.execPath, ["tests/game-db-integration/vnext-storage-candidate/run.mjs"], { encoding: "utf8", stdio: "pipe" }),
    (e) => e.status === 2 && /NOT_RUN/.test(e.stderr));
});

test("candidate manifest refuses project endpoints/default DB/unscoped cleanup", () => {
  assert.doesNotThrow(() => validateManifest(valid()));
  for (const change of [{ host: "db.project.supabase.co" }, { host: "localhost" }, { database: "postgres" }, { user: "service_role" },
    { disposable: false }, { allowSqlInstallAndCleanup: false }, { allowLocalFaultProxy: false }, { imageDigest: "unconfirmed" }, { gitHead: "latest" },
    { timings: { ...valid().timings, queryMs: 0 } }]) assert.throws(() => validateManifest({ ...valid(), ...change }));
});

test("example remains unconfigured; DB tests are nested outside automatic flat discovery", () => {
  const example = JSON.parse(readFileSync("tests/game-db-integration/vnext-storage-candidate/manifest.example.json"));
  assert.throws(() => validateManifest(example));
  const workflow = readFileSync(".github/workflows/game-db-integration.yml", "utf8");
  assert.equal(workflow.includes("vnext-storage-candidate/run.mjs"), false);
});
