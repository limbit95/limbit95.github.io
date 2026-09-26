# Signal Room Game Spec

## Related Documents

- Development handoff and current implementation status: `DEVELOPMENT.md`
- Initial UI / presentation baseline: `UI_DESIGN.md`
- Post-baseline UI decisions and validation history: `UI_DECISIONS.md`


> Status: experimental platform-native prototype

## Game Overview

- Game id: `signal-room`
- Players: 4 local players; one-person evaluation mode is also provided so the prototype can be reviewed without four people present.
- Core loop: four runners move through a compact top-down arena, synchronize on color-linked pressure plates, unlock the signal core, then gather in the extraction zone.
- Win condition: activate all four signal plates long enough to unlock the core, then move all four players into the extraction zone.

## Rules and Sources

- This is an original prototype created for Cheongpa Game Platform validation, not an adaptation of an existing commercial game.
- Genre references are limited to broad cooperative-action patterns: simultaneous movement, pressure-plate coordination, shared objectives, and short retry loops.
- No third-party art, music, logos, levels, text, or protected game assets are copied.
- User-facing rules are included in the game entry overlay and can be reopened during play.

## Product Scope

- Included:
  - top-down movement and wall collision
  - four distinct player entities
  - local four-player keyboard mode
  - solo evaluation mode that lets one reviewer switch between all four players
  - four pressure plates with simultaneous hold requirement
  - core-unlock phase and extraction phase
  - moving hazard beams with respawn feedback
  - timer, mission HUD, procedural sound effects, particles, screen feedback
  - restart, end-session, result, and replay flows
- Deferred:
  - Supabase room/lobby
  - online realtime synchronization
  - authoritative server simulation
  - reconnect/presence
  - multiple stages and matchmaking
- Not planned in this prototype:
  - player-vs-player combat
  - rigid-body pushing/stacking
  - jump/gravity/platformer physics
  - persistent score/ranking

## State Machine

`ENTRY -> PLAYING_SYNC -> PLAYING_EXTRACTION -> CLEARED -> ENTRY`

- ENTRY: rules and control mode are visible; no gameplay timer runs.
- PLAYING_SYNC: players move, avoid hazards, and hold the four signal plates.
- PLAYING_EXTRACTION: all plates have been synchronized; the extraction gate is active.
- CLEARED: all four players are inside extraction; result overlay offers replay or exit.
- Restart returns to PLAYING_SYNC with deterministic spawn/objective reset.
- End session returns to ENTRY without modifying any server state because this prototype is local-only.

## Domain Model

- Player: id, color, spawn, position, radius, movement input, hit cooldown.
- Arena: axis-aligned wall rectangles and playable bounds.
- Plate: id, linked player color, center, radius, occupied/charged state.
- Hazard: moving beam with deterministic path and collision bounds.
- Objective:
  - `syncProgress`: continuous hold duration while all plates are correctly occupied.
  - `coreUnlocked`: becomes true when syncProgress reaches threshold.
  - `extractedPlayers`: players currently inside extraction zone.
- Presentation-only particles and trails never decide gameplay state.

## Platform Boundary

- SHARED:
  - Game Registry metadata/capability declaration.
  - Existing site game-list entry route.
  - Existing repository lifecycle, documentation, validation, and PR rules.
- GAME-LOCAL:
  - realtime frame loop
  - local input routing
  - collision and hazard simulation
  - pressure-plate and extraction rules
  - canvas renderer, particles, audio, overlays, HUD
- No `games/shared/` runtime contract is modified in this prototype.
- A future online version must be treated as a separate architecture step rather than forcing current board-game snapshot/action contracts onto frame-by-frame movement.

## Authority and Persistence

- Prototype authority is local browser memory only.
- No Supabase tables, RPCs, migrations, Realtime channels, or persisted records are added.
- The browser game loop is authoritative for this experimental local mode.
- If an online phase is approved later, movement/input synchronization, simulation ownership, sequence/tick handling, reconnect, and stale packet protection must be explicitly designed before enabling `online` capability.

## UI / UX Direction

- The prototype uses a dark signal-lab visual identity with luminous cyan, violet, amber, and coral player channels.
- The canvas occupies the visual center; HUD and overlays are game-local rather than a generic site card layout.
- A start overlay explains the goal and controls before play.
- Rules/help remains reachable during play.
- An explicit End Session action returns to entry.
- Result presentation continues the same visual identity and provides replay.

## Implementation Plan

1. Create game-local docs and register the local-only prototype.
2. Implement pure objective/state helpers.
3. Implement canvas runtime: movement, collisions, plates, hazards, extraction.
4. Add game-local visual presentation, procedural audio, particles, and responsive controls.
5. Add Registry and route exposure plus game-specific contract tests.
6. Validate syntax, Game Platform tests, and browser behavior where the available environment permits.

## Validation Plan

- Registry test: shared platform entry, local capability true, online/invite/presence false.
- Runtime model tests: initial state and objective transition helpers.
- Existing `npm run test:game-platform`.
- Browser checks:
  - desktop layout
  - solo evaluation mode
  - local 4-player input mapping
  - plate synchronization
  - hazard reset
  - extraction clear/replay
  - rules and end-session overlays
  - narrow-screen layout

## Open Questions / Deferred

- Whether a future online action game should use Supabase Broadcast directly or a dedicated realtime game server is intentionally deferred.
- Whether a reusable realtime runtime belongs in `games/shared/` is intentionally deferred until this and at least one additional realtime-style game expose the same responsibility.
