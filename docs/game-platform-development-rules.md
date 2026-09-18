# Game Platform Development Rules

이 문서는 청파 같이에서 **새로운 platform-native 게임을 구현하거나 수정할 때 기본적으로 따라야 하는 실행 규칙**이다.

사용자가 매 작업마다 아래 규칙을 다시 설명하지 않아도, 신규 게임 작업은 이 문서를 기본 전제로 진행한다.

`AGENTS.md`의 저장소 전체 작업 규칙은 그대로 적용되며, 이 문서는 Game Platform 영역의 추가 규칙이다. 문서 간 설명이 충돌하거나 현재 코드와 맞지 않는 경우 임의로 해석하지 않고 실제 코드와 테스트를 확인한 뒤 최소 범위로 정리한다.

## 1. 적용 대상

이 규칙은 다음 작업에 적용한다.

- `games/<game-id>/` 아래 새 게임 생성
- 기존 platform-native 게임 기능 추가 또는 수정
- 신규 게임의 Room/Lobby, Invite, Snapshot/Reconnect, Realtime, DB/RPC 연결
- 신규 게임 때문에 `games/shared/`의 공통 계약을 변경하려는 작업

다음 Legacy 게임은 이 규칙으로 강제 마이그레이션하지 않는다.

- Liar Game
- Drawing Spy
- The Game
- Blue Marble / Marble

Legacy의 현재 동작 보호가 우선이며, 신규 플랫폼과 맞추기 위한 이유만으로 Legacy를 수정하지 않는다.

## 2. 규칙 용어

- **MUST**: 신규 platform-native 게임에서 반드시 지켜야 한다.
- **MUST NOT**: 신규 platform-native 게임에서 사용하면 안 된다.
- **SHOULD**: 특별한 이유가 없다면 기본적으로 따른다.
- **GAME-LOCAL**: 해당 게임의 규칙과 구현에 남겨야 하는 영역이다.
- **SHARED**: 게임 규칙과 무관하게 미래 게임에서도 반복되는 플랫폼 책임이다.

## 3. 작업 시작 전

신규 게임 작업자는 소스 수정 전에 다음을 확인해야 한다.

1. 최신 `main`에서 작업 브랜치를 만든다.
2. **이 문서를 필수 실행 기준으로 읽는다.**
3. `games/shared/`의 현재 공통 계약과 관련 테스트를 확인한다.
4. DB/RPC가 포함되면 정식 계약 문서인 `docs/game-platform-db-test-contract.md`를 추가로 확인한다.
5. Legacy 게임 코드를 신규 게임의 기본 구조로 복사하지 않는다.

`docs/game-platform-strategy.md`와 `docs/game-platform-invite-analysis.md`는 플랫폼을 구축한 배경과 결정 과정을 보존하는 참고 문서다. 신규 게임 개발을 시작하기 위한 필수 선행 문서가 아니며, 현재 실행 규칙은 이 문서와 실제 `games/shared/` 코드·테스트를 우선한다.

새 게임의 기본 위치는 다음과 같다.

```text
games/<game-id>/
```

`game-id`는 lowercase kebab-case를 사용하고 Game Registry에도 동일한 ID를 등록한다.

## 3A. 게임별 개발 진행 기록과 채팅 연속성

모든 platform-native 게임은 최초 구현 PR부터 게임 디렉터리 안에 다음 문서를 둔다.

```text
games/<game-id>/DEVELOPMENT.md
```

`DEVELOPMENT.md`는 긴 작업 일지나 commit changelog가 아니라 **다음 작업자가 현재 개발 상태를 즉시 복원하기 위한 단일 인수인계 문서**다.

문서는 최소 다음 섹션을 유지한다.

```text
## Current Status
## Completed
## Current Work
## Next Work
## Decisions
## Validation
## Known Issues / Deferred
```

`Current Status`에는 최소한 현재 Phase, 상태(`IN_PROGRESS` / `COMPLETED` / `BLOCKED`), 현재 작업 브랜치를 기록한다.

### MUST: 작업 시작과 이어서 진행할 때

- 신규 게임의 첫 구현 단계에서 `DEVELOPMENT.md`를 함께 생성한다.
- 기존 게임 개발을 이어갈 때는 소스 수정 전에 해당 게임의 `DEVELOPMENT.md`를 먼저 읽는다.
- `DEVELOPMENT.md`가 진행 중 Phase와 active branch를 가리키면 새 브랜치를 만들기 전에 해당 브랜치가 실제로 존재하고 계속해야 할 작업인지 확인한다.
- 진행 중 Phase를 다른 채팅에서 이어가는 것은 새로운 작업 시작이 아니므로, 정상적인 checkpoint branch가 확인되면 최신 `main`에서 별도 브랜치를 새로 만들지 않고 기존 작업 브랜치를 이어간다.
- 게임별 Phase 브랜치명은 가능하면 game id를 포함해 `feature/game-platform-phase4a-cant-stop-foundation`처럼 다른 채팅에서도 검색 가능하게 유지한다.

### MUST: Phase 완료 시

- Phase 완료 PR에는 `DEVELOPMENT.md` 갱신을 포함한다.
- 완료한 Phase와 검증 결과를 `Completed` / `Validation`에 반영한다.
- 다음 Phase 또는 다음 첫 작업을 `Next Work`에 구체적으로 남긴다.
- 완료되지 않은 항목을 완료한 것처럼 기록하지 않는다.

### MUST: 사용자가 중간 진행 기록을 요청할 때

사용자가 `개발 진행 기록해줘`, `진행상황 기록해줘`, `여기까지 기록해줘`처럼 현재 진행상황 저장을 명시적으로 요청하면 **Phase가 끝나지 않았더라도 즉시 checkpoint를 기록한다.**

이 경우:

1. 현재 Phase 상태를 `IN_PROGRESS`로 유지한다.
2. 마지막으로 실제 완료된 작업과 아직 완료되지 않은 작업을 구분한다.
3. 다음 채팅에서 가장 먼저 수행할 작업을 `Next Work`에 남긴다.
4. 지금까지 실행한 테스트와 아직 실행하지 못한 검증을 `Validation`에 구분해서 기록한다.
5. blocker, 임시 결정, 확인이 필요한 사항은 `Known Issues / Deferred`에 남긴다.
6. `DEVELOPMENT.md` 변경을 현재 작업 브랜치에 commit해 GitHub에서 다음 채팅이 조회할 수 있게 한다.

중간 checkpoint를 남기기 위해 별도의 새 브랜치를 만들거나 Phase를 완료 처리하지 않는다.

### SHOULD: 갱신 빈도

`DEVELOPMENT.md`는 모든 작은 commit마다 갱신하지 않는다. 다음 시점에 갱신하는 것을 기본으로 한다.

- Phase 시작 또는 작업 범위가 확정될 때
- Phase 완료 시
- 사용자가 명시적으로 중간 진행 기록을 요청할 때
- 중요한 아키텍처/게임 규칙 결정이 바뀔 때
- 다음 작업자에게 반드시 전달해야 할 blocker나 known issue가 생길 때

## 4. 플랫폼과 게임 규칙의 경계

### MUST: 플랫폼 책임을 우선 재사용한다

현재 공통 기반에 해당 책임이 있다면 신규 게임이 다시 구현하지 않는다.

- Game Registry
- Approved Member / Access Gate
- Room / Lobby 계약
- Versioned / Idempotent Action envelope
- Snapshot Coordinator
- Reconnect refresh trigger
- Common Game Shell
- connection/player view-state
- platform-native Invite
- DB/Test Contract Gate

### MUST: 게임 규칙은 GAME-LOCAL에 둔다

다음은 각 게임 내부에 남긴다.

- 게임 규칙
- 턴/라운드 상태 머신
- 승리/패배 조건
- 보드, 카드, 주사위 등 도메인 모델
- 게임별 상태와 계산
- 게임 특유의 애니메이션과 연출
- 게임 테마와 시각 표현

### MUST NOT: 한 게임의 특수 규칙을 shared 계약에 넣지 않는다

공통화 기준은 "코드가 비슷해 보이는가"가 아니라 **게임 규칙과 무관하게 동일한 책임인가**이다.

한 게임에서만 필요한 예외를 위해 `games/shared/` API를 복잡하게 만들지 않는다.

## 5. Registry와 capability

신규 게임은 Game Registry에 등록한다.

platform-native 게임은 다음 값을 사용한다.

```text
platform = "shared"
```

실제 제공하는 기능만 capability로 선언한다.

예:

```text
online
local
invite
presence
```

MUST NOT: 구현되지 않은 기능을 capability에 미리 선언하지 않는다.

## 6. Room / Lobby 계약

온라인 platform-native 게임은 `defineRoomLobbyAdapter` 계약을 기준으로 Room/Lobby adapter를 제공한다.

현재 필수 메서드는 다음과 같다.

```text
createRoom
joinRoom
getMyActiveRoom
getLobbySnapshot
setReady
leaveRoom
startGame
subscribeInvalidation
```

각 메서드 내부 구현과 실제 RPC 이름은 게임별로 달라도 된다.

MUST: 방 생성, 참가, 준비, 시작 같은 권한 판정은 서버 RPC가 최종 판단한다.

MUST NOT: UI에서 버튼을 숨기거나 비활성화했다는 이유로 서버 권한 검증을 생략하지 않는다.

## 7. 서버 권위

온라인 게임의 상태 변경은 기본적으로 다음 흐름을 따른다.

```text
Client intent
→ authenticated game-specific RPC
→ auth / approval / membership / role / phase / version validation
→ transaction / row lock when needed
→ authoritative DB state
→ Realtime invalidation
→ authorized snapshot refresh
→ UI render
```

MUST: 클라이언트는 사용자의 **의도(intent)** 를 전달한다.

MUST: 실제 게임 상태 변경 가능 여부와 결과는 서버가 결정한다.

MUST NOT: 클라이언트가 계산한 결과를 검증 없이 authoritative state로 저장하지 않는다.

MUST NOT: Realtime payload 자체를 게임 상태의 최종 진실로 사용하지 않는다.

## 8. Versioned / Idempotent Action

게임 상태를 변경하는 명령은 가능한 한 공통 action envelope를 사용한다.

```text
roomId
expectedVersion
clientActionId
actionType
payload
```

`actionType`은 lowercase snake_case를 사용한다.

MUST: `expectedVersion`으로 stale client action이 최신 상태를 덮어쓰지 못하게 한다.

MUST: `clientActionId`로 중복 클릭, 재전송, 네트워크 retry가 상태를 두 번 진행시키지 못하게 한다.

게임별 RPC와 테이블 이름은 게임 namespace에 남긴다.

MUST NOT: 모든 게임을 하나의 거대한 공통 game-state 테이블이나 공통 gameplay RPC로 합치지 않는다.

## 9. Snapshot / Reconnect / Realtime

authoritative snapshot은 non-negative integer `version`을 가져야 한다.

신규 게임은 `createSnapshotCoordinator`를 기준으로 다음 동작을 유지한다.

- authoritative snapshot 로드
- stale snapshot 거부
- 연속 invalidation refresh coalescing
- 최신 accepted snapshot을 UI에 반영

Reconnect는 이벤트 replay가 아니라 authoritative snapshot 재조회로 복원한다.

브라우저의 다음 복귀 신호에서는 snapshot refresh가 가능해야 한다.

- online
- pageshow
- visibility visible

MUST: Realtime은 **invalidation 신호**로 사용한다.

MUST NOT: Realtime 이벤트 순서나 전달 성공만으로 게임 상태를 복원하지 않는다.

구독과 browser listener는 게임 화면 종료 시 정리할 수 있어야 한다.

## 10. Common Game Shell

신규 게임은 Common Game Shell을 기본 화면 골격으로 사용할 수 있다.

Shell이 담당하는 범위:

- 게임 제목과 설명
- 게임 목록 복귀
- 방 식별 정보
- 연결 / 재연결 / 오프라인 / 오류 상태
- 공통 플레이어 roster
- 메인 게임 영역과 sidebar 기본 배치
- 하단 action 영역

`game-shell.css`는 신규 게임 페이지가 명시적으로 opt-in 한다.

MUST NOT: 공통 Shell을 이유로 게임 고유 보드, 카드, 주사위, 3D, 애니메이션, 테마를 획일화하지 않는다.

## 11. Invite

Invite를 제공하는 신규 게임은 기존 사이트 공통 invite 인프라와 Game Platform Invite 계약을 사용한다.

필수 Registry 조건:

```text
platform === "shared"
capabilities.online === true
capabilities.invite === true
```

공통 포맷:

```text
target_type = game_room
target_id   = <game-specific room id>
metadata    = {
  game_id: "<registry game id>",
  platform_version: 1
}
```

MUST: 이동 목적지는 invite metadata의 임의 URL이 아니라 Game Registry의 `href`에서 결정한다.

MUST: 초대 token resolve 이후에도 실제 참가 권한은 게임별 join RPC가 다시 검증한다.

MUST NOT: 게임마다 별도의 새로운 invite target type이나 전용 invite infrastructure를 만들지 않는다.

## 12. DB / RPC 품질 게이트

신규 온라인 platform-native 게임은 `tests/game-db-integration/platformContract.js`의 공통 계약을 첫 구현부터 적용한다.

게임별 테스트 파일 예:

```text
tests/game-db-integration/<game-id>.test.js
```

최소 필수 시나리오:

1. 익명 사용자의 create + join 차단
2. 미승인 회원의 create + join 차단
3. 승인 회원의 create + join 허용
4. non-member snapshot 차단
5. non-host start 차단
6. stale version 거부
7. duplicate action 중복 적용 방지
8. concurrent conflicting action의 single authoritative commit
9. reconnect 시 authoritative snapshot 복원
10. 다른 플레이어 private state 미노출

private state가 없는 게임도 10번을 생략하지 않고 **노출될 private state가 없음을 검증**한다.

MUST: DB integration은 disposable local Supabase에서 검증한다.

MUST NOT: 테스트를 위해 production Supabase 데이터나 스키마를 직접 변경하지 않는다.

## 13. shared 계약을 변경해야 할 때

신규 게임을 구현하다 현재 플랫폼 계약으로 표현할 수 없는 요구가 발견될 수 있다.

그 경우 다음 순서로 판단한다.

1. 해당 요구가 게임 규칙 자체인지 확인한다.
2. 게임 규칙이면 GAME-LOCAL에 둔다.
3. 게임 규칙과 무관하고 미래의 여러 게임에서도 반복될 플랫폼 책임인지 확인한다.
4. SHARED 책임으로 확인된 경우에만 가장 작은 범위로 공통 계약을 확장한다.
5. shared 변경에는 계약 테스트와 관련 문서 변경을 함께 포함한다.

MUST NOT: 현재 게임을 빠르게 구현하기 위한 편의 때문에 shared에 게임별 예외를 추가하지 않는다.

MUST NOT: 실제 소비자가 없는 미래 기능을 추측해 범용 엔진으로 선행 구현하지 않는다.

## 14. Legacy 경계

신규 게임 개발 중 다음을 기본값으로 한다.

- Legacy 파일을 수정하지 않는다.
- Legacy DB/RPC를 새 게임의 공통 인터페이스로 삼지 않는다.
- Legacy의 중복 코드를 제거하기 위해 신규 게임 작업 범위를 확장하지 않는다.
- Legacy와 신규 게임의 UI 불일치를 이유로 Legacy를 마이그레이션하지 않는다.

Legacy에서 확인된 패턴은 참고 자료일 뿐 신규 플랫폼의 계약이 아니다.

Legacy 변경이 필요해 보이면 현재 신규 게임 PR에 섞지 않고 실제 장애/보안/데이터/동기화 위험인지 별도로 검토한다.

## 15. 신규 게임 구현 순서

특별한 이유가 없다면 다음 순서로 개발한다.

```text
1. 게임 규칙과 상태 머신 정의
2. Game Registry 등록
3. Access Gate 연결
4. 게임별 DB schema / RPC 설계
5. Room/Lobby adapter 구현
6. DB/Test Contract 연결
7. authoritative snapshot 구현
8. Versioned / Idempotent Action 연결
9. Realtime invalidation + reconnect 연결
10. Common Game Shell / player UI 연결
11. Invite 연결 (지원하는 경우)
12. 게임 고유 UI / 애니메이션 / 연출 확장
13. 멀티클라이언트 및 reconnect 회귀 검증
```

이 순서는 게임 고유 시각 연출을 늦추기 위한 강제 단계가 아니라, 네트워크와 권위 모델이 흔들린 상태에서 UI 복잡도를 먼저 키우지 않기 위한 기본 작업 순서다.

## 16. 완료 체크리스트

신규 온라인 게임 PR을 완료하기 전에 다음을 확인한다.

- [ ] `games/<game-id>/`에 게임이 독립적으로 위치한다.
- [ ] `games/<game-id>/DEVELOPMENT.md`가 현재 Phase/브랜치/다음 작업/검증 상태를 반영한다.
- [ ] Registry에 `platform: "shared"`로 등록되어 있다.
- [ ] 실제 구현된 capability만 선언되어 있다.
- [ ] Approved Member / Access Gate를 사용한다.
- [ ] Room/Lobby adapter 계약을 만족한다.
- [ ] 서버 RPC가 권한과 상태 전이를 최종 판정한다.
- [ ] state-changing action이 version/idempotency 경계를 가진다.
- [ ] snapshot version과 stale snapshot 방어가 있다.
- [ ] Realtime은 invalidation으로만 사용한다.
- [ ] reconnect가 authoritative snapshot으로 복원된다.
- [ ] 구독/listener 정리 경로가 있다.
- [ ] Common Game Shell 사용 여부와 게임-local UI 경계가 명확하다.
- [ ] Invite를 제공한다면 `game_room` 계약을 사용한다.
- [ ] DB/Test Contract 필수 시나리오를 모두 구현한다.
- [ ] 다른 플레이어의 private state가 노출되지 않는다.
- [ ] 기존 Legacy 게임을 불필요하게 수정하지 않았다.
- [ ] 관련 unit / DB integration / E2E / build 검증을 실행했다.
- [ ] shared 계약을 변경했다면 테스트와 문서를 함께 갱신했다.

## 17. 문서 권위와 관련 문서

신규 platform-native 게임 구현에서 문서 우선순위는 다음과 같다.

1. **이 문서** — 현재 실행 규칙의 최상위 기준
2. **실제 `games/shared/` 코드와 계약 테스트** — 현재 구현된 계약의 최종 확인
3. **`docs/game-platform-db-test-contract.md`** — DB/RPC 작업 시 적용하는 정식 품질 계약
4. **`games/README.md`** — 현재 shared 모듈과 디렉터리 안내

다음 문서는 **배경/이력 참고용**이며 신규 게임 개발의 필수 선행 문서가 아니다.

- `docs/game-platform-strategy.md`: 플랫폼을 왜 이런 구조로 만들었는지에 대한 전략과 단계 기록
- `docs/game-platform-invite-analysis.md`: Phase 3D 당시 Invite 구조 조사와 결정 과정

배경 문서와 현재 실행 규칙이 다르게 보일 경우 과거 문서를 현재 계약으로 재해석하지 않는다. 현재 규칙서와 실제 코드·테스트를 우선하고, 불일치가 의심되면 별도 문서 정합성 작업으로 다룬다.