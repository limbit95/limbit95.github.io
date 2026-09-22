# <Game Title> UI Decisions

> 이 문서는 디자인 개발의 진행·변경 의사결정 이력을 보존하는 game-local 기록입니다.
> 현재 따라야 할 최종 디자인 기준은 `UI_DESIGN.md`, 기능 설계는 `GAME_SPEC.md`, 기능 개발 진행은 `DEVELOPMENT.md`를 따릅니다.
> 공통 UI 조사/설계 규칙은 `docs/game-platform-ui-rules.md`를 따릅니다.
>
> 모든 CSS 수치 변경이나 commit을 기록하지 않습니다. 다음 작업자가 현재 UI만 보고는 복원하기 어려운 의미 있는 디자인/interaction 결정, 대안, 변경 이유, 검증 결과를 기록합니다.

## Current Design Track

- Status: <ACTIVE / PAUSED / RELEASED>
- Current UI phase / scope: <현재 디자인 작업 범위>
- Active branch: <branch or main>
- Last updated: <YYYY-MM-DD>
- Current canonical baseline: `UI_DESIGN.md`
- Next design work: <다음 UI 작업, 없으면 없음>

## Decision Log

### YYYY-MM-DD — <decision title>

- Context / trigger: <어떤 문제·피드백·관찰 때문에 결정이 필요했는지>
- Previous / alternatives: <기존안 또는 검토한 대안>
- Decision: <최종 선택>
- Rationale: <선택 이유와 중요 UX 원칙>
- Affected surfaces: <page / lobby / board / component / motion / responsive 등>
- Implementation status: <PLANNED / IN_PROGRESS / IMPLEMENTED / REVERTED / SUPERSEDED>
- Validation: <브라우저/반응형/animation/사용성 확인 결과 또는 미확인>
- Canonical sync: <UI_DESIGN.md 갱신 여부 또는 갱신 불필요 이유>
- Related functional boundary: <필요한 경우 GAME_SPEC.md 기능 규칙 참조>

> 같은 결정을 뒤에서 바꾸더라도 과거 항목을 삭제하지 않습니다. 새 결정 항목을 추가하고 이전 항목은 `SUPERSEDED` 또는 `REVERTED`로 표시합니다.

## Superseded / Rejected

- <폐기된 큰 디자인 방향 또는 반복해서 다시 검토하면 안 되는 대안>
- 단순히 취향이 바뀌었다는 기록보다, 왜 폐기했는지와 어떤 문제가 있었는지를 남깁니다.

## Validation History

- <YYYY-MM-DD — desktop / mobile / multi-browser / animation / accessibility 검증과 결과>
- 기능/DB contract 검증은 `DEVELOPMENT.md`에 기록하고, 여기에는 디자인 품질·interaction·presentation 검증을 기록합니다.

## Open Follow-up

- <아직 구현하지 않았거나 실제 브라우저에서 추가 확인이 필요한 UI 작업>
- <미확정 asset/license/design detail>
- 현재 디자인 기준 자체가 확정되면 `UI_DESIGN.md`에 반영하고 이 항목은 결정 로그로 이동합니다.
