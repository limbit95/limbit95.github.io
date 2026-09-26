# Signal Room Development

## Related Documents

- Functional design and prototype boundaries: `GAME_SPEC.md`
- Initial UI / presentation baseline: `UI_DESIGN.md`
- Post-baseline UI decisions and validation history: `UI_DECISIONS.md`


## Current Status

- Phase: Phase 1 — local top-down prototype
- Status: IN_PROGRESS
- Active branch: `feature/topdown-prototype-phase1-signal-room`
- Goal: prove the playable quality and architectural value of a four-player top-down cooperative game before expanding the shared Game Platform.

## Completed

- Prototype scope fixed as local-first and game-local.
- No Supabase or shared runtime expansion is required for Phase 1.
- Four-document bootstrap baseline created before runtime implementation.

## Current Work

- Implement playable canvas prototype.
- Add local 4-player mode and one-person evaluation mode.
- Add cooperative pressure-plate -> extraction objective.
- Add visual/audio feedback and lightweight hazard gameplay.
- Register the game as `platform: shared` with only `local` capability.

## Next Work

1. Complete runtime and game-specific tests.
2. Run Game Platform validation.
3. Review the actual prototype quality with the developer.
4. Decide whether to stop, polish the prototype, or open a separate architecture discussion for online realtime support.

## Decisions

- Do not modify `games/shared/` in this experimental phase.
- Do not add DB/RPC/Supabase Realtime.
- Do not predeclare online/invite/presence capability.
- Do not copy a commercial game's level, artwork, name, or exact mechanics.
- Use local simulation to evaluate movement, game feel, cooperation, canvas presentation, and whether a realtime-game runtime is worth pursuing.
- Provide solo evaluation controls so one developer can inspect all mechanics without gathering four players.

## Validation

- Pending runtime implementation.
- Pending `npm run test:game-platform`.
- Browser/manual presentation review pending.

## Known Issues / Deferred

- Keyboard ghosting can limit simultaneous key combinations in local four-player mode on some keyboards.
- Online network synchronization and reconnect are outside Phase 1.
- Multiple stages and persistent results are outside Phase 1.
