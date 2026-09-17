import { execFileSync } from "node:child_process";
import { copyFile, mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const repositoryRoot = process.cwd();
const workdirName = process.env.GAME_DB_E2E_WORKDIR ?? ".game-db-e2e";
const workRoot = path.join(repositoryRoot, workdirName, "supabase");
const migrationsRoot = path.join(workRoot, "migrations");
const siteRoot = path.join(repositoryRoot, "supabase", "site");
const marbleRoot = path.join(repositoryRoot, "supabase", "marble");

async function assertDirectory(directory) {
  const info = await stat(directory).catch(() => null);
  if (!info?.isDirectory()) {
    throw new Error(`Required directory is missing: ${directory}`);
  }
}

function formatTimestamp(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate()),
    pad(date.getUTCHours()),
    pad(date.getUTCMinutes()),
    pad(date.getUTCSeconds()),
  ].join("");
}

function syntheticTimestamp(baseIso, index) {
  return formatTimestamp(new Date(Date.parse(baseIso) + index * 60_000));
}

await assertDirectory(path.join(siteRoot, "baseline"));
await assertDirectory(path.join(siteRoot, "migrations"));
await assertDirectory(marbleRoot);
await assertDirectory(workRoot);

await rm(migrationsRoot, { recursive: true, force: true });
await mkdir(migrationsRoot, { recursive: true });

const baselineFiles = (await readdir(path.join(siteRoot, "baseline")))
  .filter((name) => name.endsWith(".sql"))
  .sort((a, b) => a.localeCompare(b));

for (const [index, filename] of baselineFiles.entries()) {
  const minute = String(index).padStart(2, "0");
  const migrationName = `2026082400${minute}00_${filename}`;
  await copyFile(
    path.join(siteRoot, "baseline", filename),
    path.join(migrationsRoot, migrationName),
  );
}

const operatingMigrations = (await readdir(path.join(siteRoot, "migrations")))
  .filter((name) => /^\d{14}_.+\.sql$/u.test(name))
  .sort((a, b) => a.localeCompare(b));

for (const filename of operatingMigrations) {
  await copyFile(
    path.join(siteRoot, "migrations", filename),
    path.join(migrationsRoot, filename),
  );
}

// Liar / Drawing Spy already has an immutable canonical fresh-install baseline.
// Build it from its pinned Git blobs instead of copying today's working-tree SQL,
// so this harness exercises the same reproducible source used by the game release.
const liarInstallerRelative = path.join(
  workdirName,
  "supabase",
  "migrations",
  "20970101000000_liar_game_v1_0_0.sql",
);
execFileSync(
  process.execPath,
  ["scripts/build-liar-canonical.mjs", "--output", liarInstallerRelative],
  { cwd: repositoryRoot, stdio: "inherit" },
);

// Marble is still under active development. The harness only replays its checked-in
// additive migrations into a disposable database; it does not alter Marble runtime code.
const marbleMigrations = (await readdir(marbleRoot))
  .filter((name) => /^\d{14}_.+\.sql$/u.test(name))
  .sort((a, b) => a.localeCompare(b));

for (const [index, filename] of marbleMigrations.entries()) {
  const migrationName = `${syntheticTimestamp("2098-01-01T00:00:00Z", index)}_marble_${filename.replace(/^\d{14}_/u, "")}`;
  await copyFile(
    path.join(marbleRoot, filename),
    path.join(migrationsRoot, migrationName),
  );
}

// Test-only bootstrap permissions for deterministic fixture creation and inspection.
// Browser/game clients never receive service_role.
await writeFile(
  path.join(migrationsRoot, "20990101000000_game_db_e2e_bootstrap.sql"),
  [
    "grant all privileges on all tables in schema public to service_role;",
    "grant usage, select on all sequences in schema public to service_role;",
    "",
  ].join("\n"),
  "utf8",
);

await copyFile(path.join(siteRoot, "seed.sql"), path.join(workRoot, "seed.sql"));

console.log(
  `Prepared game DB integration schema: ${baselineFiles.length} site baseline + ${operatingMigrations.length} site migrations + 1 Liar canonical baseline + ${marbleMigrations.length} Marble migrations.`,
);
