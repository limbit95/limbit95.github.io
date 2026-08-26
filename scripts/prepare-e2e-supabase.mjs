import { copyFile, mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const repositoryRoot = process.cwd();
const sourceRoot = path.join(repositoryRoot, "supabase", "site");
const workRoot = path.join(repositoryRoot, ".e2e-supabase", "supabase");
const migrationsRoot = path.join(workRoot, "migrations");

async function assertDirectory(directory) {
  const info = await stat(directory).catch(() => null);
  if (!info?.isDirectory()) {
    throw new Error(`Required directory is missing: ${directory}`);
  }
}

await assertDirectory(path.join(sourceRoot, "baseline"));
await assertDirectory(path.join(sourceRoot, "migrations"));
await assertDirectory(workRoot);

await rm(migrationsRoot, { recursive: true, force: true });
await mkdir(migrationsRoot, { recursive: true });

const baselineFiles = (await readdir(path.join(sourceRoot, "baseline")))
  .filter((name) => name.endsWith(".sql"))
  .sort((a, b) => a.localeCompare(b));

for (const [index, filename] of baselineFiles.entries()) {
  const minute = String(index).padStart(2, "0");
  const migrationName = `2026082400${minute}00_${filename}`;
  await copyFile(
    path.join(sourceRoot, "baseline", filename),
    path.join(migrationsRoot, migrationName),
  );
}

const operatingMigrations = (await readdir(path.join(sourceRoot, "migrations")))
  .filter((name) => /^\d{14}_.+\.sql$/.test(name))
  .sort((a, b) => a.localeCompare(b));

for (const filename of operatingMigrations) {
  await copyFile(
    path.join(sourceRoot, "migrations", filename),
    path.join(migrationsRoot, filename),
  );
}

await copyFile(path.join(sourceRoot, "seed.sql"), path.join(workRoot, "seed.sql"));

console.log(
  `Prepared isolated community Supabase schema: ${baselineFiles.length} baseline + ${operatingMigrations.length} operating migrations.`,
);
