# Game Platform

이 디렉터리는 앞으로 추가되는 게임을 위한 공통 Game Platform 기반입니다.

신규 platform-native 게임을 구현하거나 수정할 때는 [Game Platform Development Rules](../docs/game-platform-development-rules.md)를 **필수 실행 기준**으로 먼저 확인합니다. 사용자가 매 작업마다 플랫폼 규칙을 다시 설명하지 않아도 이 문서를 기본 전제로 적용합니다.

[Game Platform Strategy](../docs/game-platform-strategy.md)는 플랫폼 구축 배경과 Legacy 정책을 이해하기 위한 참고 문서이며, 신규 게임의 현재 실행 규칙보다 우선하지 않습니다.

## 경계

- 기존 `liar-game/`, `the-game/`, `marble-game/`은 기존 경로와 런타임을 유지합니다.
- Drawing Spy는 Liar Game 내부 모드이므로 별도 루트로 이동하지 않습니다.
- 기존 게임은 새 플랫폼 기능이나 공통 레이아웃을 강제로 적용하지 않습니다.
- 새 게임은 가능한 한 `games/<game-id>/` 아래에 두고 `games/shared/`의 공통 계약을 사용합니다.
- 신규 게임은 runtime 구현 전에 `games/GAME_SPEC_TEMPLATE.md`를 기준으로 `games/<game-id>/GAME_SPEC.md`를 만들고, 게임 규칙·제품 범위·상태 머신·플랫폼 경계·구현 계획을 먼저 정리합니다.
- `GAME_SPEC.md`와 `DEVELOPMENT.md`만 존재하는 bootstrap 디렉터리는 미완성 게임 노출을 막기 위해 Registry 등록 전 상태로 둘 수 있습니다. runtime 파일을 추가하는 순간 Registry 규칙이 적용됩니다.
- 각 platform-native 게임은 `games/<game-id>/DEVELOPMENT.md`를 두고 현재 Phase, active branch, 완료/진행 중 작업, 다음 작업, 결정사항, 검증, known issue를 기록합니다.
- Phase 완료 시와 사용자가 중간 checkpoint 기록을 요청할 때 `DEVELOPMENT.md`를 갱신합니다.
- 게임 규칙, 턴 상태 머신, 승패 조건, 게임별 애니메이션은 각 게임에 남겨 둡니다.

## Released reference game

Can’t Stop(`games/cant-stop/`)은 Game Platform 기반으로 처음부터 구현해 production까지 출시한 첫 platform-native 기준 사례입니다.

- `GAME_SPEC.md`: v1의 규칙/권위/플랫폼 경계 기준
- `DEVELOPMENT.md`: `RELEASED / main` 기준 release baseline과 유지보수 인수인계
- `tests/game-db-integration/cant-stop.test.js`: Phase 3E DB/Test Contract의 첫 실제 소비 사례

출시가 끝난 게임의 `DEVELOPMENT.md`는 과거 feature 브랜치를 active branch로 남기지 않습니다. 후속 수정은 최신 `main`에서 새 브랜치로 시작하며, 구현 중 발견한 플랫폼 교훈은 [Game Platform Development Rules](../docs/game-platform-development-rules.md)의 release feedback loop에 따라 다시 분류합니다.

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
- `gameInvite.js`: site invite 인프라를 재사용하는 platform-native `game_room` 초대 계약

공통 계약은 새 게임을 위한 기준입니다. 기존 게임을 이 구조로 마이그레이션하기 위한 호환 계층으로 사용하지 않습니다.

`game-shell.css`는 전역 사이트 CSS에 자동으로 포함하지 않습니다. 신규 게임 페이지가 필요할 때 직접 로드하며, Legacy 게임과 기존 커뮤니티 화면에는 적용하지 않습니다.

서버 권한 검증과 게임 상태 판정은 계속 각 게임의 DB/RPC가 최종 권위입니다. 프런트 공통 모듈은 DB authorization을 대체하지 않습니다.

Invite 영향 분석과 Legacy 경계는 [Game Platform Invite Analysis](../docs/game-platform-invite-analysis.md)를 참고합니다.