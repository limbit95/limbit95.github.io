# Liar Game canonical database baseline

This directory defines the reproducible fresh-install baseline for each production release of Liar Game / Drawing Spy.

## v1.0.0

Canonical source manifest:

- `v1.0.0.manifest.json`

Builder:

- `scripts/build-liar-canonical.mjs`

The manifest pins both the **execution order** and the **Git blob SHA** of every SQL source that composes the release. This keeps the historical migration files intact while giving the release one unambiguous installation source.

## Validate the pinned baseline

From the repository root:

```bash
node scripts/build-liar-canonical.mjs --check
```

The command fails if:

- a pinned SQL source is missing;
- a pinned source changed without an intentional baseline update;
- the manifest contains the same source twice;
- a historical-only test migration was accidentally included.

The repository CI runs this check automatically.

## Build one SQL installer

From the repository root:

```bash
node scripts/build-liar-canonical.mjs
```

Output:

```text
supabase/liar-game/canonical/liar-game-v1.0.0-install.sql
```

You can also print the installer to stdout:

```bash
node scripts/build-liar-canonical.mjs --stdout
```

or choose a custom output path:

```bash
node scripts/build-liar-canonical.mjs --output /path/inside/repository/install.sql
```

## Important safety rules

1. The generated installer is for a **fresh Supabase project/database only**.
2. Do **not** run the generated baseline over the existing production Liar Game database.
3. Existing production databases continue to move forward using additive migrations.
4. Do not edit an old release manifest to point at changed SQL. Create a new release baseline (for example v1.1.0) instead.
5. `20260825_temp_two_player_test.sql` and its restore migration are historical test records and are intentionally excluded from the v1.0.0 canonical installer.

## Why the canonical baseline uses pinned source composition

The production database evolved through several safe additive migrations. Rewriting all function bodies and policies into a hand-maintained giant SQL dump would create a second source of truth and make subtle drift more likely.

Instead, the canonical builder:

- freezes the exact files that produced the verified production behavior;
- concatenates them in the tested fresh-install order;
- verifies each source by its Git blob SHA;
- produces a single SQL file when a one-shot installer is needed;
- preserves the historical migrations for audit/debugging.

This makes v1.0.0 reproducible without deleting or mutating migration history.
