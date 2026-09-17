# Game DB integration foundation

Phase 2-A provides a disposable Supabase integration harness before any stability fix changes existing game RPC/RLS behavior.

## Current scope

- site baseline and operating migrations required by shared membership helpers
- Liar Game / Drawing Spy v1.0.0 canonical fresh-install baseline
- current checked-in Marble additive migrations
- HTTP-level RPC checks for anonymous access, room membership, player-key possession, and optimistic version rejection

Drawing Spy is covered by the Liar database baseline because it is a Liar game mode, not a separate application.

The Game is intentionally excluded for now. Its README references initial multiplayer migrations that are not present in the repository, so adding it before the canonical baseline is recovered would create a false sense of reproducibility.

## Safety boundaries

- The harness only uses `.game-db-e2e`, a disposable local Supabase workdir.
- It never connects to or migrates the production Supabase project.
- Marble runtime/gameplay files are not modified; its migrations are only replayed in the disposable database.
- The pending/rejected/suspended membership boundary remains a TODO until Phase 2-C adds the server guard.

## Running

The `Game DB integration` GitHub Actions workflow runs automatically only for relevant game DB/harness pull requests and can also be started manually. It intentionally does not run on every feature-branch push to conserve Actions usage.

The workflow checks out full Git history because the Liar canonical installer resolves immutable pinned Git blobs.
