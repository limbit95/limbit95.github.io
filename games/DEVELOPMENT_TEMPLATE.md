# <Game Title> Development

> 이 문서는 기능 개발 상태를 다음 작업자/채팅으로 전달하는 인수인계 문서입니다. 긴 changelog 대신 현재 기능 상태와 다음 행동을 유지합니다.
>
> 게임 규칙과 기능 설계의 기준은 같은 디렉터리의 `GAME_SPEC.md`입니다. UI는 `UI_DESIGN.md`의 소스 개발 전 baseline과 `UI_DECISIONS.md`의 최신 non-superseded override를 함께 적용합니다. 이 문서에는 UI 세부 변경사를 중복 기록하지 않고 기능 구현·검증 상태와 release 관점의 상위 UI 트랙 상태만 참조합니다.
> 공통 UI 조사/설계 규칙은 `docs/game-platform-ui-rules.md`를 따릅니다.

## Current Status

- Phase: <phase>
- Status: IN_PROGRESS
- Active branch: <branch>
- Last checkpoint: <YYYY-MM-DD / commit if available>

## Completed

- 기능: <GAME_SPEC.md 기준 실제로 완료된 기능/규칙/DB 작업>
- Design track reference: <필요한 경우 UI_DECISIONS.md의 현재 UI 단계/결정 항목 링크 또는 요약>

## Current Work

- 기능: <현재 진행 중이며 아직 완료되지 않은 기능 작업>
- Design track reference: <UI 작업이 병행 중이면 UI_DECISIONS.md의 현재 항목을 참조>

## Next Work

> 설계 계획을 복제하지 않고 현재 작업에서 바로 수행할 구체적인 행동만 기록합니다.

- <다음 채팅/작업자가 가장 먼저 수행할 기능/DB/플랫폼 작업>
- UI 작업 자체의 다음 행동은 `UI_DECISIONS.md`의 현재 디자인 트랙에 기록하고 여기에는 중복 복제하지 않습니다.

## Decisions

- <확정된 게임 규칙/기능 아키텍처 결정>
- UI/presentation의 개발 시작 후 결정은 `UI_DECISIONS.md`에 기록하며 `UI_DESIGN.md` baseline을 현재 화면에 맞춰 재작성하지 않습니다.

## Validation

- Functional / contract: <실행 완료 기능·규칙·DB·contract 검증>
- Design validation reference: <release 판단에 필요한 경우 UI_DECISIONS.md의 브라우저/반응형/animation 검증 기록 참조>
- Pending: <아직 실행하지 못한 기능 검증>

## Known Issues / Deferred

- <기능 blocker / known issue / 보류 사항, 없으면 없음>
- UI 설계와 실제 구현의 차이, 미확정 asset/license, 후속 visual polish는 `UI_DECISIONS.md`에서 추적합니다.

## Release closeout 안내

게임을 production에 공개해 `Status: RELEASED`로 전환할 때는 이 안내 섹션을 실제 날짜가 있는 다음 형식의 release 기록으로 교체합니다.

```text
## Release — YYYY-MM-DD

- production activation / migration 요약
- 현재 Registry capability
- 핵심 검증 결과
- 유지보수 baseline 및 남은 관찰 항목
```

`RELEASED` 상태에서는 `Active branch: main`을 사용하고, 과거 feature branch를 현재 기준으로 남기지 않습니다.
