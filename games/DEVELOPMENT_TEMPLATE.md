# <Game Title> Development

> 이 문서는 현재 개발 상태를 다음 작업자/채팅으로 전달하는 인수인계 문서입니다. 긴 changelog 대신 현재 상태와 다음 행동을 유지합니다.
>
> 게임 규칙과 구현 설계의 기준은 같은 디렉터리의 `GAME_SPEC.md`이며, 이 문서는 그 설계를 실제로 어디까지 구현했는지를 추적합니다.

## Current Status

- Phase: <phase>
- Status: IN_PROGRESS
- Active branch: <branch>
- Last checkpoint: <YYYY-MM-DD / commit if available>

## Completed

- <실제로 완료된 작업>

## Current Work

- <현재 진행 중이며 아직 완료되지 않은 작업>

## Next Work

- <다음 채팅/작업자가 가장 먼저 수행할 작업>

## Decisions

- <확정된 게임 규칙/아키텍처 결정>

## Validation

- Completed: <실행 완료 검증>
- Pending: <아직 실행하지 못한 검증>

## Known Issues / Deferred

- <blocker / known issue / 보류 사항, 없으면 없음>

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
