# Signal Room UI Design

## Related Documents

- Functional game design and architecture boundary: `GAME_SPEC.md`
- Development handoff and current implementation status: `DEVELOPMENT.md`
- Post-baseline UI overrides and validation history: `UI_DECISIONS.md`


## Design Research

- Target edition / visual baseline: original Cheongpa Game Platform prototype; no external edition.
- Official / publisher sources: not applicable because this is an original prototype.
- Additional references: general top-down cooperative-action conventions only; no protected layout or art is reproduced.
- 조사한 구성물: player avatar readability, top-down arena boundaries, pressure plates, hazard telegraphing, extraction-zone signaling, HUD hierarchy.
- Source → Observation → Decision:
  - Original prototype brief: four players must read one another instantly → use four high-contrast channel colors and persistent player labels.
  - Cooperative action convention: shared goal must be legible without reading long text → encode current objective in arena lighting, HUD text, plate charge, and extraction state.
  - Browser/canvas constraint: motion quality matters more than large art assets → use procedural geometry, glow, trails, particles, scan lines, and WebAudio feedback.
- 핵심 관찰: the prototype should feel like a compact neon control room rather than a board-game table.
- Last reviewed: 2026-09-26

## Copyright / Asset Usage

- Directly usable: original code-generated geometric shapes, gradients, particles, and procedural audio created for this prototype.
- Recreate / reinterpret: generic cooperative pressure-plate and extraction concepts using original layout and styling.
- Do not use directly: commercial game logos, screenshots, character art, maps, sound effects, music, fonts, or branded UI.
- License / attribution notes: no third-party assets are required for Phase 1.

## Visual Identity

- Primary color: deep blue-black / midnight teal.
- Secondary color: electric cyan.
- Accent color: player channels — cyan, violet, amber, coral.
- Background color: near-black blue with subtle grid and radial light fields.
- Typography direction: system sans-serif with compact uppercase mission labels and large numeric status.
- Symbols / patterns: signal rings, circuit lines, crosshair ticks, energy arcs.
- Material / texture: glass HUD panels + emissive floor lanes.
- Visual keywords: signal lab, coordinated, kinetic, clean neon, readable under motion.

## Page Identity

- 청파 같이 일반 화면에서 게임 공간으로 전환되는 방식: full-viewport dark game frame with a small back-to-games control; general community cards disappear.
- 전체 배경 / frame: dark gradient field with animated ambient grid and edge vignette.
- title / logo treatment: `SIGNAL ROOM` wordmark rendered as text, not an image asset.
- navigation / back-to-games 처리: compact top-left link outside the primary action cluster.
- loading / reconnect / error presentation: local prototype has no network reconnect; runtime errors should fall back to a readable overlay.
- 독립적인 게임 페이지 느낌을 만드는 핵심 요소: large central canvas, mission HUD, animated signal core, player-channel lighting.

## Lobby / Setup Design

- 방 생성 / 참가: not present in local prototype.
- 플레이어 roster: four colored player chips always visible on the entry overlay.
- host / ready 표현: not applicable.
- rules entry: visible before start and available from top HUD during play.
- rules / help presentation: in-game modal using the same glass/neon language, with goal, phase flow, and both control modes.
- start action: two explicit choices — Solo Test and 4P Local.
- invite / room code presentation: not applicable.
- desktop / mobile 배치: desktop prioritizes canvas; mobile supports solo evaluation with on-screen directional controls rather than four-person simultaneous touch.

## Gameplay Layout

- Main board / shared zone: 16:9-ish top-down arena centered in viewport, scaling to available width/height.
- Player zones: no fixed personal panels; identity follows player entities.
- Public / private information: all prototype information is public.
- Primary actions: move; synchronize plates; enter extraction.
- Secondary controls: rules, restart, end session, sound toggle.
- 정보 우선순위: current mission > sync progress/extraction count > timer > controls.
- 실제 보드게임의 공간 구조를 웹으로 옮길 때의 adaptation: not applicable; this is an action-space prototype.

## Components

- Cards: not used.
- Chips / tokens: pressure plates and signal nodes are circular floor components.
- Dice / pieces: four player runners are rounded geometric avatars with channel-colored cores.
- Player panel: minimal HUD chips for status only.
- Buttons: translucent glass with luminous hover/focus rim.
- Modal / dialog: centered dark glass panel with background blur and clear close/start actions.
- Rules visual examples: miniature four-color plate diagram and extraction flow represented with semantic HTML plus color labels.
- Status / toast / event message: short center-top mission callout; stronger full-width feedback only on phase transition.
- Result component: large clear time, hazard-hit count, and replay/exit controls.

## Motion / Interaction

- 핵심 행동 1: player acceleration/deceleration is smoothed; entity leaves a short luminous trail.
- 핵심 행동 2: plate occupancy fills a ring and emits particles; all four active plates create a core-unlock pulse.
- turn transition: not applicable.
- acquire / spend / move feedback: core unlock changes arena lighting and opens extraction with radial shockwave.
- timing 원칙: controls remain responsive; decorative animation never blocks movement.
- server-authoritative state와 presentation의 동기화 기준: local game state drives presentation directly in Phase 1.
- sound / haptic 계획이 있다면: lightweight WebAudio tones for plate lock, hit, unlock, and clear; sound can be disabled.

## Result / Rematch Presentation

- 결과 정보 계층: CLEAR status > completion time > hazard hits.
- winner / draw 표현: cooperative clear; no winner ranking.
- rematch CTA: `다시 플레이`.
- ready 상태 표현: not applicable in local mode.
- host start condition 표현: not applicable.
- leave action: `게임 종료` returns to entry.
- 다음 게임으로 전환되는 presentation: canvas dims and result glass panel fades/slides in.

## Responsive Strategy

- Desktop: game board centered with HUD around it; full keyboard controls.
- Tablet: same board with tighter HUD.
- Mobile: solo evaluation mode only; on-screen D-pad and player selector visible.
- 작은 높이 화면: reduce HUD height and keep canvas dominant without vertical scrolling during play.
- 많은 카드/토큰을 수용하는 방식: not applicable.
- touch / accessibility 고려: visible focus styles, text labels in addition to color, touch D-pad, reduced-motion respect where practical.

## Implementation Plan

1. Build full-screen game-local frame and visual identity.
2. Build entry/rules overlays and mode selection.
3. Build canvas arena, player entities, plates, core, hazards, and extraction.
4. Add trails, particles, transition pulses, procedural sound, and hit feedback.
5. Add result/replay/end-session presentation.
6. Add responsive solo-touch controls and polish.

## Validation Checklist

- [x] 조사 출처와 목표 판본이 기록되어 있다.
- [x] 자산의 직접 사용 / 재구성 / 사용 금지 경계가 기록되어 있다.
- [x] 게임 고유 Visual Identity가 정의되어 있다.
- [x] 일반 청파 같이 페이지와 구별되는 독립적인 game page identity가 있다.
- [x] lobby → gameplay → result/rematch가 하나의 디자인 언어를 유지하도록 설계했다.
- [x] 규칙 안내가 generic 문서 UI로 분리되지 않고 해당 게임의 Visual Identity와 정보 계층을 유지한다.
- [x] 핵심 규칙은 색상 외 텍스트와 상태 라벨로도 이해할 수 있도록 설계했다.
- [x] 핵심 action이 실제 움직임과 공간 협력으로 느껴지도록 설계했다.
- [x] animation timing은 Phase 1 local state와 충돌하지 않는다.
- [x] desktop/mobile에서 평가할 수 있는 입력 전략이 있다.
- [ ] 실제 브라우저 수동 디자인 리뷰는 runtime 구현 후 수행한다.

## Open Questions / Deferred

- Online lobby, latency presentation, reconnect overlays, and remote-player interpolation are deferred.
- Final title/branding can change if the prototype graduates into a production game.
