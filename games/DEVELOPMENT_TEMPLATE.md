# <Game Title> Development

> 이 문서는 현재 개발 상태를 다음 작업자/채팅으로 전달하는 인수인계 문서입니다. 긴 changelog 대신 현재 상태와 다음 행동을 유지합니다.
>
> 게임 규칙과 기능 설계의 기준은 같은 디렉터리의 `GAME_SPEC.md`, UI/presentation 설계의 기준은 `UI_DESIGN.md`이며, 이 문서는 두 설계를 실제로 어디까지 구현했는지를 추적합니다.
> 공통 Game Platform 개발 규칙은 `docs/game-platform-development-rules.md`, UI 조사/설계 규칙은 `docs/game-platform-ui-rules.md`를 따릅니다.

## Current Status

- Phase: <phase>
- Status: IN_PROGRESS
- Active branch: <branch>
- Last checkpoint: <YYYY-MM-DD / commit if available>

## Completed

- 기능: <GAME_SPEC.md 기준 실제로 완료된 기능/규칙/DB 작업>
- UI / presentation: <UI_DESIGN.md 기준 실제로 완료된 화면/Visual Identity/motion/responsive 작업>

## Current Work

- 기능: <현재 진행 중이며 아직 완료되지 않은 기능 작업>
- UI / presentation: <현재 진행 중이며 아직 완료되지 않은 UI 작업>

## Next Work

> 설계 계획을 복제하지 않고 현재 작업에서 바로 수행할 구체적인 행동만 기록합니다.

- <다음 채팅/작업자가 가장 먼저 수행할 작업>
- 기능/DB/UI 중 어떤 설계를 이어가는 작업인지 알 수 있게 기록합니다.

## Decisions

- <확정된 게임 규칙/아키텍처/UI 설계 결정>
- UI 방향이 바뀌었다면 `UI_DESIGN.md`도 현재 설계에 맞게 갱신했는지 기록합니다.

## Validation

- Functional / contract: <실행 완료 기능·규칙·DB·contract 검증>
- UI / browser: <실행 완료 UI·반응형·animation·다중 브라우저 검증>
- Pending: <아직 실행하지 못한 검증>

## Known Issues / Deferred

- <blocker / known issue / 보류 사항, 없으면 없음>
- UI 설계와 실제 구현의 차이, 미확정 asset/license, 후속 visual polish가 있다면 함께 기록합니다.

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
