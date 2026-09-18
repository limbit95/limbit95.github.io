# Game Platform

이 디렉터리는 앞으로 추가되는 게임을 위한 공통 Game Platform 기반입니다.

전체 전략과 Legacy 정책은 [Game Platform Strategy](../docs/game-platform-strategy.md)를 기준으로 합니다.

## 경계

- 기존 `liar-game/`, `the-game/`, `marble-game/`은 기존 경로와 런타임을 유지합니다.
- Drawing Spy는 Liar Game 내부 모드이므로 별도 루트로 이동하지 않습니다.
- 기존 게임은 새 플랫폼 기능이나 공통 레이아웃을 강제로 적용하지 않습니다.
- 새 게임은 가능한 한 `games/<game-id>/` 아래에 두고 `games/shared/`의 공통 계약을 사용합니다.
- 게임 규칙, 턴 상태 머신, 승패 조건, 게임별 애니메이션은 각 게임에 남겨 둡니다.

## Phase 3 foundation

- `registry.js`: 게임 메타데이터와 capability Registry
- `accessGate.js`: 인증/승인회원 Access Gate
- `roomLobbyContract.js`: 방 생성/참가/준비/시작 등 Room/Lobby adapter 계약
- `snapshotCoordinator.js`: authoritative snapshot refresh, stale version 거부, invalidation coalescing
- `reconnectRefresh.js`: online/pageshow/visibility 복귀 시 snapshot refresh trigger
- `actionContract.js`: `expectedVersion` + `clientActionId`를 포함하는 versioned/idempotent action envelope
- `gameShellState.js`: 연결 상태와 플레이어 표시용 공통 view-state 계약
- `gameShell.js`: 신규 게임용 공통 화면 골격, 연결 상태, 플레이어 roster
- `game-shell.css`: 신규 게임이 명시적으로 opt-in 하는 공통 Shell 스타일

공통 계약은 새 게임을 위한 기준입니다. 기존 게임을 이 구조로 마이그레이션하기 위한 호환 계층으로 사용하지 않습니다.

`game-shell.css`는 전역 사이트 CSS에 자동으로 포함하지 않습니다. 신규 게임 페이지가 필요할 때 직접 로드하며, Legacy 게임과 기존 커뮤니티 화면에는 적용하지 않습니다.

서버 권한 검증과 게임 상태 판정은 계속 각 게임의 DB/RPC가 최종 권위입니다. 프런트 공통 모듈은 DB authorization을 대체하지 않습니다.
