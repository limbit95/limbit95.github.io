# Game Platform

이 디렉터리는 앞으로 추가되는 게임을 위한 공통 Game Platform 기반입니다.

신규 platform-native 게임을 구현하거나 수정할 때는 [Game Platform Development Rules](../docs/game-platform-development-rules.md)와 [Game Platform UI Design Rules](../docs/game-platform-ui-rules.md)를 **필수 실행 기준**으로 먼저 확인합니다. 사용자가 매 작업마다 플랫폼 규칙이나 UI 조사/설계를 다시 설명하지 않아도 두 문서를 기본 전제로 적용합니다.

[Game Platform Strategy](../docs/game-platform-strategy.md)는 플랫폼 구축 배경과 Legacy 정책을 이해하기 위한 참고 문서이며, 신규 게임의 현재 실행 규칙보다 우선하지 않습니다.

## 경계

- 기존 `liar-game/`, `the-game/`, `marble-game/`은 기존 경로와 런타임을 유지합니다.
- Drawing Spy는 Liar Game 내부 모드이므로 별도 루트로 이동하지 않습니다.
- 기존 게임은 새 플랫폼 기능이나 공통 레이아웃을 강제로 적용하지 않습니다.
- 새 게임은 가능한 한 `games/<game-id>/` 아래에 두고 `games/shared/`의 공통 계약을 사용합니다.
- 신규 게임은 runtime 구현 전에 `games/GAME_SPEC_TEMPLATE.md`와 `games/UI_DESIGN_TEMPLATE.md`를 기준으로 `games/<game-id>/GAME_SPEC.md`와 `games/<game-id>/UI_DESIGN.md`를 만들고, 게임 규칙·제품 범위·상태 머신·플랫폼 경계뿐 아니라 원본 디자인 조사·Visual Identity·독립 페이지 경험·자산 사용 경계·UI 구현 계획을 먼저 정리합니다.
- `GAME_SPEC.md`, `UI_DESIGN.md`, `DEVELOPMENT.md`만 존재하는 bootstrap 디렉터리는 미완성 게임 노출을 막기 위해 Registry 등록 전 상태로 둘 수 있습니다. runtime 파일을 추가하는 순간 Registry 규칙이 적용됩니다.
- 각 platform-native 게임은 `GAME_SPEC.md`를 기능 설계 기준, `UI_DESIGN.md`를 UI/presentation 설계 기준, `DEVELOPMENT.md`를 두 설계의 실제 구현 진행상태를 추적하는 인수인계 문서로 관리합니다.
- 게임 진행 checkpoint의 명시적 트리거는 사용자의 요청 문장에 `디벨롭 파일에`라는 표현이 포함된 경우다. 이 표현이 명시된 경우에만 사용자 요청을 repository checkpoint 명령으로 해석해 해당 `DEVELOPMENT.md`를 갱신·commit합니다. `디벨롭 파일에`가 없는 일반적인 새 채팅용 정리·문서·요약 요청은 이 규칙의 checkpoint 트리거가 아닙니다.
- 게임 규칙, 턴 상태 머신, 승패 조건, 게임별 Visual Identity·레이아웃·애니메이션은 각 게임에 남겨 둡니다.
- 멀티플레이 게임은 게임 종료 후 동일 room/player context에서 재대결 준비 상태로 전환하고, 참여자 준비 완료 후 방장이 다시 시작할 수 있는 흐름을 기본 제품 요구사항으로 설계합니다. 내부 RPC/adapter 공통화는 별도 근거 없이 강제하지 않습니다.

## Released game lifecycle

출시가 끝난 platform-native 게임의 `DEVELOPMENT.md`는 `Status: RELEASED`, `Active branch: main`과 날짜가 있는 release 기록을 유지합니다.

후속 수정은 종료된 feature 브랜치를 재사용하지 않고 최신 `main`에서 새 브랜치로 시작합니다. 구현 중 발견한 플랫폼 교훈은 [Game Platform Development Rules](../docs/game-platform-development-rules.md)의 release feedback loop에 따라 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 다시 분류합니다.

특정 platform-native 게임의 구현을 다른 신규 게임의 기준 사례로 삼지 않습니다. 현재 공통 계약과 규칙 문서, 템플릿을 기준으로 시작하고 게임별 구현은 해당 게임 디렉터리 안의 `GAME_SPEC.md`, `UI_DESIGN.md`, `DEVELOPMENT.md`에서 정의합니다.
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