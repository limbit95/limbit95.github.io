# No Thanks! UI Decisions

> 이 문서는 No Thanks!의 디자인 개발 진행·변경 의사결정 이력을 보존합니다.
> `UI_DESIGN.md`는 No Thanks!의 초기 디자인 baseline입니다. 개발 시작 후 확정된 이 문서의 최신 non-superseded 결정이 같은 항목에서는 우선하며, 현재 유효 디자인은 baseline + decision overrides로 해석합니다. 기능 기준은 `GAME_SPEC.md`, 기능 개발 진행은 `DEVELOPMENT.md`를 따릅니다.
> 공통 UI 규칙은 `docs/game-platform-ui-rules.md`를 따릅니다.
>
> 이 문서 체계 도입 전 No Thanks!는 여러 UI 수정과 일부 미병합/종료 PR을 거쳤으므로 과거 세부 결정이 완전하게 보존되어 있지 않습니다. 이 baseline에서 누락된 과거 결정을 임의로 복원하지 않으며, 별도 복원 작업에서 실제 main·과거 PR/commit·사용자 결정과 대조해 추가합니다.

## Current Design Track

- Status: PAUSED
- Lifecycle stage: MANUAL_DESIGN_REVIEW (PAUSED)
- Current UI phase / scope: Board UI Phase A–D 이후 detail polish / Phase E 후보는 잠시 중단
- Active branch: main
- Last updated: 2026-09-23
- Initial design baseline: `UI_DESIGN.md`
- Active overrides: 과거 세부 결정 복원 전까지 main runtime에 반영된 사용자 수정은 보존하며, 확인된 후속 결정은 이 문서에 추가
- Next design work: UI 작업 재개 전 과거 세부 디자인 결정 복원 여부를 검토하고, 이후 다른 플레이어 공개 획득 카드 popover 등 남은 UI 항목을 진행합니다.

## Decision Log

- 아직 이 문서 체계 기준으로 복원·확정된 post-baseline 게임 디자인 decision은 없습니다.
- 과거 수동 브라우저 QA와 개발자 피드백으로 실제 반영된 디자인 수정은 별도 복원 작업에서 증거를 확인한 뒤 Decision ID를 부여해 추가합니다.
- 문서 체계 도입 자체는 게임 화면 디자인 결정이 아니므로 Decision Log에 기록하지 않습니다.

## Superseded / Rejected

- 과거의 별도 redesign 제안이나 종료된 PR에 남아 있는 디자인안은 그 자체로 현재 기준이 아닙니다. 복원할 때는 현재 main과 `UI_DESIGN.md`, 실제 사용자 결정과 대조해 살아 있는 결정만 구분합니다.

## Validation History

- 2026-09-23 — 이 문서 추가 자체는 runtime UI를 변경하지 않으므로 신규 브라우저 UI 검증 대상이 아닙니다.

## Open Follow-up

- UI 작업을 다시 시작하기 전에 과거 No Thanks! 관련 PR/commit과 남아 있는 기록을 검토해, 현재 화면에 반영됐지만 문서화되지 않은 중요한 디자인 결정을 선별 복원합니다.
- 디자인 복원 과정에서는 `UI_DESIGN.md` 초기 baseline, main runtime, 확인 가능한 후속 사용자 결정을 함께 대조합니다. 같은 항목의 최신 non-superseded 결정이 baseline보다 우선하며 폐기된 과거안을 되살리지 않습니다.
- Phase E 후보인 다른 플레이어 공개 획득 카드 popover와 후속 polish는 UI 트랙 재개 시 여기서 진행 상태를 추적합니다.
