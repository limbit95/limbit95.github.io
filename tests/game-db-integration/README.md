# Game DB integration foundation

Phase 2-A provides a disposable Supabase integration harness before any stability fix changes existing game RPC/RLS behavior. Phase 2-B extends that harness to the current post-v1.0 Liar schema and uses it to protect the Liar / Drawing Spy entry boundary.

## Current scope

- site baseline and operating migrations required by shared membership helpers
- Liar Game / Drawing Spy v1.0.0 canonical fresh-install baseline plus the checked-in post-canonical v1.1/v1.2/v1.3 migrations
- current checked-in The Game migrations recovered from the operating migration history
- current checked-in Marble additive migrations
- HTTP-level RPC checks for anonymous access, approved-member Liar entry/resume access, room membership, player-key possession, and Marble optimistic version rejection

Drawing Spy is covered by the Liar database baseline because it is a Liar game mode, not a separate application.

The Game migration history is now replayed by `scripts/prepare-game-db-e2e.mjs` in the disposable database. The current foundation assertions still focus on the Liar / Drawing Spy access boundary and Marble lobby/version boundary, so dedicated The Game RPC assertions can be expanded separately without changing existing game behavior.

## Safety boundaries

- The harness only uses `.game-db-e2e`, a disposable local Supabase workdir.
- It never connects to or migrates the production Supabase project.
- Marble runtime/gameplay files are not modified; its migrations are only replayed in the disposable database.
- Liar / Drawing Spy pending, rejected, and suspended accounts cannot create or join rooms; an account suspended after joining cannot rediscover/resume its room through the entry APIs.
- Phase 2-B deliberately does not refactor Liar gameplay RPCs or introduce a broad mid-session revocation mechanism. That would require a separate lifecycle policy and regression pass rather than being hidden inside this narrow access-boundary fix.

## Running

The `Game DB integration` GitHub Actions workflow runs automatically only for relevant game DB/harness pull requests and can also be started manually. It intentionally does not run on every feature-branch push to conserve Actions usage.

The workflow checks out full Git history because the Liar canonical installer resolves immutable pinned Git blobs.
