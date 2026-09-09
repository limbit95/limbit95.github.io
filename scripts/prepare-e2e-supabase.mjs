import { copyFile, mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
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

// Test-only bootstrap permissions and fixture support. These objects exist only
// inside the disposable local Supabase stack. The browser never receives
// service_role; Node setup scripts use it only to create deterministic fixtures
// and verify DB state. The pending-* helper still passes through the production
// AFTER INSERT enforcement trigger; this BEFORE trigger only prepares the trusted
// challenge row and newly-required rules metadata for that isolated fixture.
await writeFile(
  path.join(migrationsRoot, "20990101000000_e2e_bootstrap_privileges.sql"),
  [
    "grant all privileges on all tables in schema public to service_role;",
    "grant usage, select on all sequences in schema public to service_role;",
    "",
    "create or replace function public.e2e_prepare_pending_signup_fixture()",
    "returns trigger",
    "language plpgsql security definer set search_path = ''",
    "as $$",
    "begin",
    "  if lower(coalesce(new.email, '')) like 'pending-%@example.com' then",
    "    new.raw_user_meta_data := coalesce(new.raw_user_meta_data, '{}'::jsonb)",
    "      || jsonb_build_object('community_rules_version', 'e2e', 'rules_consent', true);",
    "    if not exists (select 1 from public.signup_email_challenges where auth_user_id = new.id) then",
    "      insert into public.signup_email_challenges(",
    "        email, code_hash, request_ip_hash, expires_at, verified_at,",
    "        verification_token_hash, auth_user_id, consumed_at",
    "      ) values (",
    "        lower(new.email), 'e2e-pending-code', 'e2e-pending-ip',",
    "        pg_catalog.clock_timestamp() + interval '5 minutes',",
    "        pg_catalog.clock_timestamp(), 'e2e-pending-token', new.id, pg_catalog.clock_timestamp()",
    "      );",
    "    end if;",
    "  end if;",
    "  return new;",
    "end;",
    "$$;",
    "drop trigger if exists a_e2e_prepare_pending_signup_fixture on auth.users;",
    "create trigger a_e2e_prepare_pending_signup_fixture",
    "before insert on auth.users",
    "for each row execute function public.e2e_prepare_pending_signup_fixture();",
    "",
  ].join("\n"),
  "utf8",
);

await copyFile(path.join(sourceRoot, "seed.sql"), path.join(workRoot, "seed.sql"));

console.log(
  `Prepared isolated community Supabase schema: ${baselineFiles.length} baseline + ${operatingMigrations.length} operating migrations + E2E bootstrap.`,
);
