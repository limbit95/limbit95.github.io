# <Game Title> Game Spec

> 이 문서는 이 게임이 무엇이며 청파 같이에서 어떤 규칙과 구조로 구현할지 정의하는 game-local 설계 기준입니다.
> 구현 진행상황은 같은 디렉터리의 `DEVELOPMENT.md`에서 관리합니다.

## Game Overview

- Game id: <lowercase-kebab-case>
- Players: <supported player count>
- Core loop: <한 문장>
- Win condition: <한 문장>

## Rules and Sources

- <공식 규칙서 / 퍼블리셔 / 신뢰 가능한 규칙 출처>
- <출처마다 구현에 필요한 규칙 차이 또는 버전 차이를 기록>
- 원문을 장문 복제하지 않고 구현에 필요한 사실과 해석만 요약합니다.

## Product Scope

- Included: <이번 제품에서 지원할 규칙/모드>
- Deferred: <후속으로 미룰 규칙/모드>
- Not planned: <명시적 제외>

## State Machine

- <LOBBY → ... → GAME_OVER>
- 각 상태에서 가능한 action과 전이 조건을 기록합니다.

## Domain Model

- <보드/카드/주사위/말/플레이어 상태 등>
- deterministic 계산에 필요한 핵심 데이터 구조를 기록합니다.

## Platform Boundary

- SHARED: <Registry / Access Gate / Room-Lobby / Snapshot / Reconnect / Invite 등 재사용 항목>
- GAME-LOCAL: <게임 규칙, 상태 머신, 도메인 계산, 전용 UI>
- shared 계약 확장이 필요해 보이는 항목은 실제 공통 책임인지 확인 전까지 GAME-LOCAL로 둡니다.

## Authority and Persistence

- 서버가 최종 결정해야 하는 action과 난수 결과
- authoritative snapshot에 포함할 public/private state
- version / idempotency / transaction 경계
- reconnect 시 복원 기준

## UI / UX Direction

- 공통 Shell 사용 범위
- 게임 고유 보드/카드/주사위/애니메이션 방향
- 모바일/데스크톱 상호작용 기준

## Implementation Plan

1. <첫 구현 slice>
2. <다음 slice>
3. <온라인/DB/snapshot/realtime/UI 순서>

## Validation Plan

- 게임 규칙 unit test
- Game Platform contract test
- online인 경우 DB/Test Contract
- multiplayer / reconnect / stale action 회귀
- 필요한 수동 브라우저 검증

## Open Questions / Deferred

- <아직 확정하지 않은 규칙/UX/기술 결정, 없으면 없음>
