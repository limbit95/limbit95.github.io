# No Thanks! UI Decisions

> 이 문서는 No Thanks!의 디자인 개발 진행·변경 의사결정 이력을 보존합니다.
> 현재 적용할 UI/presentation 기준은 `UI_DESIGN.md`, 기능 기준은 `GAME_SPEC.md`, 기능 개발 진행은 `DEVELOPMENT.md`를 따릅니다.
> 공통 UI 규칙은 `docs/game-platform-ui-rules.md`를 따릅니다.
>
> 이 문서 체계 도입 전 No Thanks!는 여러 UI 수정과 일부 미병합/종료 PR을 거쳤으므로 과거 세부 결정이 완전하게 보존되어 있지 않습니다. 이 baseline에서 누락된 과거 결정을 임의로 복원하지 않으며, 별도 복원 작업에서 실제 main·과거 PR/commit·사용자 결정과 대조해 추가합니다.

## Current Design Track

- Status: PAUSED
- Current UI phase / scope: Board UI Phase A–D 이후 detail polish / Phase E 후보는 잠시 중단
- Active branch: main
- Last updated: 2026-09-23
- Current canonical baseline: `UI_DESIGN.md`
- Next design work: UI 작업 재개 전 과거 세부 디자인 결정 복원 여부를 검토하고, 이후 다른 플레이어 공개 획득 카드 popover 등 남은 UI 항목을 진행합니다.

## Decision Log

### 2026-09-23 — UI decision history를 별도 문서로 분리

- Context / trigger: 실제 UI 개발 과정에서 세밀한 사용자 피드백과 디자인 수정이 반복됐지만, 최종 `UI_DESIGN.md`와 기능 중심 `DEVELOPMENT.md`만으로는 그 결정 이유와 폐기된 대안을 충분히 복원하기 어려웠습니다.
- Previous / alternatives: 디자인 진행 이력을 `DEVELOPMENT.md`에 계속 누적하거나 `UI_DESIGN.md`를 changelog처럼 사용하는 방식을 검토할 수 있었습니다.
- Decision: 현재 canonical 디자인 기준은 `UI_DESIGN.md`에 유지하고, 디자인 개발 진행·변경 배경·대안·결정 이유·검증 이력은 `UI_DECISIONS.md`로 분리합니다.
- Rationale: 기능 개발 기록과 디자인 이력을 분리하면서도 과거의 중요한 사용자 의도를 잃지 않기 위해서입니다.
- Affected surfaces: 문서 관리 전반
- Implementation status: IMPLEMENTED
- Validation: 문서/거버넌스 검증 대상
- Canonical sync: 현재 디자인 자체를 변경하지 않으므로 `UI_DESIGN.md` 내용 변경은 불필요합니다.
- Related functional boundary: `GAME_SPEC.md`와 `DEVELOPMENT.md`의 기능 책임은 유지합니다.

## Superseded / Rejected

- 과거의 별도 redesign 제안이나 종료된 PR에 남아 있는 디자인안은 그 자체로 현재 기준이 아닙니다. 복원할 때는 현재 main과 `UI_DESIGN.md`, 실제 사용자 결정과 대조해 살아 있는 결정만 구분합니다.

## Validation History

- 2026-09-23 — 이 문서 추가 자체는 runtime UI를 변경하지 않으므로 신규 브라우저 UI 검증 대상이 아닙니다.

## Open Follow-up

- UI 작업을 다시 시작하기 전에 과거 No Thanks! 관련 PR/commit과 남아 있는 기록을 검토해, 현재 화면에 반영됐지만 문서화되지 않은 중요한 디자인 결정을 선별 복원합니다.
- 디자인 복원 과정에서도 현재 canonical 결과는 `UI_DESIGN.md`와 main runtime을 우선하며, 폐기된 과거안을 현재 규칙으로 되살리지 않습니다.
- Phase E 후보인 다른 플레이어 공개 획득 카드 popover와 후속 polish는 UI 트랙 재개 시 여기서 진행 상태를 추적합니다.
