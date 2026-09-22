# Can't Stop UI Decisions

> 이 문서는 Can't Stop의 디자인 개발 진행·변경 의사결정 이력을 보존합니다.
> `UI_DESIGN.md`는 Can't Stop v1의 디자인 baseline입니다. 이후 확정된 이 문서의 최신 non-superseded 결정이 같은 항목에서는 우선하며, 현재 유효 디자인은 baseline + decision overrides로 해석합니다. 기능 기준은 `GAME_SPEC.md`, 기능 개발 진행은 `DEVELOPMENT.md`를 따릅니다.
> 공통 UI 규칙은 `docs/game-platform-ui-rules.md`를 따릅니다.
>
> 이 문서 체계 도입 이전의 모든 UI 변경사를 소급해 꾸며내지 않습니다. 현재 release baseline은 `UI_DESIGN.md`와 main runtime을 기준으로 하며, 이후 의미 있는 디자인 결정부터 이 문서에 누적합니다.

## Current Design Track

- Status: RELEASED
- Current UI phase / scope: v1 release baseline 유지, 필요 시 post-release polish
- Active branch: main
- Last updated: 2026-09-23
- Initial design baseline: `UI_DESIGN.md`
- Active overrides: 없음
- Next design work: 없음. 새 UI 작업이 시작되면 최신 main에서 별도 브랜치를 사용합니다.

## Decision Log

### 2026-09-23 — UI decision history tracking 도입

- Context / trigger: Game Platform 문서를 기능 기준/진행과 디자인 기준/진행으로 분리해 디자인 의사결정 맥락을 보존할 필요가 생겼습니다.
- Previous / alternatives: 기존에는 `UI_DESIGN.md`와 `DEVELOPMENT.md`에 현재 기준과 구현 이력이 함께 섞일 수 있었습니다.
- Decision: 현재 디자인 기준은 `UI_DESIGN.md`, 이후의 의미 있는 디자인 변경·대안·검증 이력은 이 문서에서 관리합니다.
- Rationale: release baseline을 흔들지 않으면서 다음 작업자가 디자인 결정의 이유를 복원할 수 있게 합니다.
- Affected surfaces: 문서 관리
- Implementation status: IMPLEMENTED
- Validation: 문서/거버넌스 검증 대상
- Baseline relation: 문서 관리 방식만 변경하며 기존 `UI_DESIGN.md` baseline과 release runtime을 변경하지 않습니다.
- Related functional boundary: `GAME_SPEC.md` 및 `DEVELOPMENT.md`의 기능 책임은 유지합니다.

## Superseded / Rejected

- 없음. 과거 UI 변경사는 이 문서 도입만으로 소급 재구성하지 않습니다.

## Validation History

- 2026-09-23 — 이 문서 추가 자체는 runtime UI를 변경하지 않으므로 신규 브라우저 UI 검증 대상이 아닙니다.

## Open Follow-up

- 후속 UI 개선이 시작되면 사용자 피드백, 대안, 최종 결정, 구현 상태와 실제 브라우저 검증을 이 문서에 기록합니다.
