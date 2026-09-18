import { execFileSync } from "node:child_process";
import { copyFile, mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const repositoryRoot = process.cwd();
const workdirName = process.env.GAME_DB_E2E_WORKDIR ?? ".game-db-e2e";
const workRoot = path.join(repositoryRoot, workdirName, "supabase");
const migrationsRoot = path.join(workRoot, "migrations");
const siteRoot = path.join(repositoryRoot, "supabase", "site");
const liarRoot = path.join(repositoryRoot, "supabase", "liar-game");
const theGameRoot = path.join(repositoryRoot, "supabase", "the-game");
const marbleRoot = path.join(repositoryRoot, "supabase", "marble");
const cantStopRoot = path.join(repositoryRoot, "supabase", "cant-stop");
const productionPendingSiteMigrations = new Set([
  "20260909124500_enforce_native_auth_otp_signup.sql",
]);

const liarPostCanonicalMigrations = [
  "20260827_custom_word_packs.sql",
  "20260828_01_hint_coins_v12.sql",
  "20260828_02_role_randomization_and_cumulative_suspicion.sql",
  "20260828_03_start_with_settings.sql",
  "20260828_04_result_stats_and_player_order.sql",
  "20260828_05_guess_gate_and_drawing_misses.sql",
  "20260828_06_drawing_miss_fk_indexes.sql",
  "20260828_07_hint_reward_cap_fix.sql",
  "20260828041626_liar_v121_capture_reveal_failover.sql",
  "20260828223226_liar_expanded_mvp_stats_v13.sql",
  "20260828224040_liar_expanded_mvp_mutual_rival_fix.sql",
  "20260828224614_liar_expanded_mvp_hint_privacy_fix.sql",
  "20260917124500_liar_approved_member_entry_guard.sql",
];

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
await assertDirectory(path.join(liarRoot, "migrations"));
await assertDirectory(theGameRoot);
await assertDirectory(marbleRoot);
await assertDirectory(cantStopRoot);
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

// Keep the shared site baseline aligned with production; pending site migrations are not replayed here.
const operatingMigrations = (await readdir(path.join(siteRoot, "migrations")))
  .filter((name) => /^\d{14}_.+\.sql$/u.test(name) && !productionPendingSiteMigrations.has(name))
  .sort((a, b) => a.localeCompare(b));

for (const filename of operatingMigrations) {
  await copyFile(
    path.join(siteRoot, "migrations", filename),
    path.join(migrationsRoot, filename),
  );
}

// Liar / Drawing Spy has an immutable v1.0.0 fresh-install baseline. Build it
// from pinned Git blobs, then replay the checked-in post-v1.0 migrations in the
// same logical release order used by the production upgrade path.
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

for (const [index, filename] of liarPostCanonicalMigrations.entries()) {
  const source = path.join(liarRoot, "migrations", filename);
  const info = await stat(source).catch(() => null);
  if (!info?.isFile()) {
    throw new Error(`Required post-canonical Liar migration is missing: ${filename}`);
  }
  const migrationName = `${syntheticTimestamp("2097-02-01T00:00:00Z", index)}_liar_${filename.replace(/^\d{8,14}_/u, "")}`;
  await copyFile(source, path.join(migrationsRoot, migrationName));
}

// The Game keeps its historical SQL files directly under supabase/the-game.
// Replay every checked-in migration in filename order against the disposable DB.
const theGameMigrations = (await readdir(theGameRoot))
  .filter((name) => /^\d{14}_.+\.sql$/u.test(name))
  .sort((a, b) => a.localeCompare(b));

for (const [index, filename] of theGameMigrations.entries()) {
  const migrationName = `${syntheticTimestamp("2097-06-01T00:00:00Z", index)}_the_game_${filename.replace(/^\d{14}_/u, "")}`;
  await copyFile(
    path.join(theGameRoot, filename),
    path.join(migrationsRoot, migrationName),
  );
}

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

// Can’t Stop is the first platform-native Phase 4 consumer.
// Replay every checked-in migration into the same disposable database so its
// mandatory platform DB contract can exercise the real RPC/RLS boundary.
const cantStopMigrations = (await readdir(cantStopRoot))
  .filter((name) => /^\d{14}_.+\.sql$/u.test(name))
  .sort((a, b) => a.localeCompare(b));

for (const [index, filename] of cantStopMigrations.entries()) {
  const migrationName = `${syntheticTimestamp("2098-07-01T00:00:00Z", index)}_cant_stop_${filename.replace(/^\d{14}_/u, "")}`;
  await copyFile(
    path.join(cantStopRoot, filename),
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
  `Prepared game DB integration schema: ${baselineFiles.length} site baseline + ${operatingMigrations.length} site migrations + 1 Liar canonical baseline + ${liarPostCanonicalMigrations.length} post-canonical Liar migrations + ${theGameMigrations.length} The Game migrations + ${marbleMigrations.length} Marble migrations + ${cantStopMigrations.length} Can’t Stop migrations.`,
);
