# Game Platform

이 디렉터리는 앞으로 추가되는 게임을 위한 공통 Game Platform 기반입니다.

## 경계

- 기존 `liar-game/`, `the-game/`, `marble-game/`은 Stable Legacy / WIP 경로를 그대로 유지합니다.
- Phase 3 공통 모듈은 기존 게임을 강제로 마이그레이션하지 않습니다.
- 새 게임은 가능한 한 `games/<game-id>/` 아래에 두고 `games/shared/`의 얇은 공통 계약을 사용합니다.
- 게임 규칙, 턴 상태 머신, 결과 스키마는 각 게임에 남겨 둡니다.

## Phase 3A foundation

- `games/shared/registry.js`: 게임 메타데이터와 capability를 한 곳에서 정의하는 Registry 계약
- `games/shared/accessGate.js`: 인증/승인 상태를 새 게임에서 동일하게 해석하기 위한 Access Gate 계약
- 현재 기존 게임 3개는 Registry에 `platform: "legacy"`로만 등록되어 있으며 런타임 구현은 변경하지 않습니다.
- Can’t Stop을 첫 `platform: "shared"` 소비자로 사용해 이후 Room/Lobby, Snapshot/Reconnect, versioned action 계약을 검증합니다.

서버 권한 검증은 계속 각 게임의 DB/RPC가 최종 권위입니다. 프런트 Access Gate는 UX 경계이며 DB authorization을 대체하지 않습니다.
