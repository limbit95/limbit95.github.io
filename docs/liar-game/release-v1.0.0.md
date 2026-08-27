# Liar Game / Drawing Spy v1.0.0

## Release status

**Production baseline: PASS**

This baseline freezes the first production-complete version of the Liar Game and Drawing Spy modes after the Phase 1~4 gameplay upgrades, final DB/RLS hardening, CI checks, and multi-device play testing.

A dedicated Git branch named `release/liar-game-v1.0.0` is the immutable reference point for this baseline. Future features should be developed from `main` while production regressions can always be compared against this branch.

## Included game modes

### Classic Liar Game

- 4~12 ready players, with at least 2 citizens
- 1~3 liars
- configurable speaking timer and discussion timer
- category reveal option for liars
- optional multi-liar teammate reveal
- multi-select voting for multi-liar games
- cutoff-tie runoff voting with tied-candidate extra speaking
- delayed individual ballot disclosure until final result
- shared hidden-team word guesses with normalized aliases
- balanced-but-random liar assignment across repeated rounds
- no immediate word reuse while unused eligible words remain

### Drawing Spy

- server-synchronized 3 → 2 → 1 → DRAW countdown
- 5~60 second drawing timer
- 1~10 stroke limit or unlimited-stroke mode
- responsive 900×600 logical shared canvas
- live private Realtime stroke broadcast while drawing
- durable vector stroke persistence and reload reconstruction
- fluid local drawing while completed strokes are queued for DB persistence
- tied-candidate runoff drawing: 10 seconds / 1 stroke each
- host-adjustable drawing difficulty between rounds
- completed drawing visible during discussion, voting, guessing, and result
- stroke-by-stroke drawing replay in result

## Shared production features

- Supabase Auth session guard and account-switch protection
- private room-state Realtime invalidation with DB snapshots as source of truth
- private discussion chat; chat becomes server-blocked when timed discussion expires
- spectator projections without participant secrets leaking through base tables
- role recall during allowed phases
- one-time failed-capture identity reveal countdown
- result sound/motion effects with reduced-motion handling
- Game-level citizen vs hidden-team score
- round history and fun stats: most suspected, survival leader, comeback leader
- 12 active categories / 600 active words
- guess aliases and whitespace/case normalization
- host force-end, leave guards, stale-version recovery

## Security baseline

- `liar_*` base tables have RLS enabled and expose no direct client rows.
- Normal business access is through projected `SECURITY DEFINER` RPCs.
- Anonymous execution is denied for Liar Game business RPCs.
- Only `liar_update_game_settings_v4` is exposed for full Game settings updates; settings v1/v2/v3 remain historical implementation details without client EXECUTE permission.
- Discussion and drawing Realtime broadcasts use private topics and server-side send/receive policy helpers.

## Canonical database source

The canonical v1 database baseline is defined by:

- `supabase/liar-game/canonical/v1.0.0.manifest.json`
- `scripts/build-liar-canonical.mjs`

The manifest pins the exact ordered SQL source files and Git blob SHAs that compose v1.0.0. Running the builder produces a deterministic single SQL installer without changing historical migrations.

See `supabase/liar-game/canonical/README.md` for usage.

## Release gates completed

- JavaScript syntax check: PASS
- Liar Game ES module link check: PASS
- Site integrity check: PASS
- GitHub Pages deployment: PASS
- Production DB integrity checks: PASS
- RLS / RPC execution boundary checks: PASS
- 12 categories / 600 enabled words check: PASS
- Classic Liar full-flow play test: PASS
- Drawing Spy full-flow / live drawing / runoff play test: PASS
- Phase 4 cumulative stats play test: PASS

## Change policy after v1.0.0

Do not modify this release branch for normal feature development. New features belong on `main` and should be accompanied by a new migration or an intentional v1.1+ canonical baseline update. Historical migrations are retained for auditability; the canonical manifest is the preferred fresh-install source for this release.
