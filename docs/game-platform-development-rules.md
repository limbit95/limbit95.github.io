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
4. `games/GAME_SPEC_TEMPLATE.md`와 `games/DEVELOPMENT_TEMPLATE.md`를 기준으로 초기 문서를 준비한다.
5. DB/RPC가 포함되면 정식 계약 문서인 `docs/game-platform-db-test-contract.md`를 추가로 확인한다.
6. Legacy 게임 코드를 신규 게임의 기본 구조로 복사하지 않는다.

`docs/game-platform-strategy.md`와 `docs/game-platform-invite-analysis.md`는 플랫폼을 구축한 배경과 결정 과정을 보존하는 참고 문서다. 신규 게임 개발을 시작하기 위한 필수 선행 문서가 아니며, 현재 실행 규칙은 이 문서와 실제 `games/shared/` 코드·테스트를 우선한다.

새 게임의 기본 위치는 다음과 같다.

```text
games/<game-id>/
```

`game-id`는 lowercase kebab-case를 사용하고 Game Registry에도 동일한 ID를 등록한다.

## 3A. 신규 게임 초기 세팅과 GAME_SPEC

사용자가 `새 게임 만들자`, `<게임명> 개발 시작하자`처럼 신규 게임 개발을 요청하면 gameplay/runtime 코드부터 작성하지 않는다. 먼저 게임 자체와 구현 경계를 복원할 수 있는 bootstrap 문서를 만든다.

기본 순서는 다음과 같다.

1. 게임의 원본 규칙과 구성요소를 조사한다.
2. 이번 웹게임에서 지원할 인원, 규칙 버전/변형, online/local 범위와 제외 범위를 정한다.
3. `games/<game-id>/GAME_SPEC.md`를 생성해 게임 규칙과 구현 설계를 기록한다.
4. `games/<game-id>/DEVELOPMENT.md`를 생성해 현재 작업 상태와 다음 작업을 기록한다.
5. 규칙 해석이 불명확한 항목은 임의로 확정하지 않고 `Open Questions / Deferred`에 남긴다.
6. 위 문서가 최소 기준을 충족한 뒤 게임 규칙 엔진, Registry, DB/RPC, UI 등 실제 구현을 시작한다.

공개된 기존 보드게임을 웹게임으로 구현하는 경우 공식 규칙서, 퍼블리셔 자료 또는 신뢰 가능한 규칙 문서를 우선 확인한다. `GAME_SPEC.md`에는 사용한 출처와 구현상 해석 결정을 남긴다. 규칙 원문을 장문 복제하지 않고 구현에 필요한 사실과 결정만 요약한다.

### MUST: GAME_SPEC의 역할

`GAME_SPEC.md`는 **이 게임이 무엇이며 청파 같이에서 어떻게 구현할지 정의하는 game-local 설계 기준**이다. 최소 다음 섹션을 유지한다.

```text
## Game Overview
## Rules and Sources
## Product Scope
## State Machine
## Domain Model
## Platform Boundary
## Authority and Persistence
## UI / UX Direction
## Implementation Plan
## Validation Plan
## Open Questions / Deferred
```

게임 규칙, 상태 머신, 도메인 모델 또는 구현 경계가 바뀌면 현재 설계와 일치하도록 `GAME_SPEC.md`를 갱신한다. 작은 commit 내역을 쌓는 changelog로 사용하지 않는다.

### MUST: bootstrap 상태와 Registry 노출 경계

신규 게임은 설계를 먼저 확정하기 위해 `games/<game-id>/`에 다음 두 파일만 존재하는 **bootstrap 상태**를 가질 수 있다.

```text
GAME_SPEC.md
DEVELOPMENT.md
```

이 bootstrap 상태에서는 아직 Game Registry에 등록하지 않아도 된다. 미완성 게임이 게임 목록이나 실제 서비스 경로에 노출되는 것을 막기 위한 예외다.

다음 중 하나라도 시작하면 bootstrap 상태가 끝난다.

- `index.html`, JavaScript, CSS 등 실제 game runtime 파일 추가
- 게임 전용 asset 또는 실행 모듈 추가
- 실제 플레이 가능한 화면/엔진 구현 시작

bootstrap 상태가 끝나는 PR에서는 같은 변경 범위 안에서 Game Registry 등록을 추가하고 실제 구현된 capability만 선언한다.

MUST NOT: 구현 예정이라는 이유만으로 `online`, `invite`, `presence` 같은 capability를 미리 선언하지 않는다.

## 3B. 게임별 개발 진행 기록과 채팅 연속성

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

`Current Status`에는 최소한 현재 Phase, 상태(`IN_PROGRESS` / `BLOCKED` / `RELEASED`), 현재 작업 브랜치를 기록한다. 전체 게임이 production에 공개된 상태는 `COMPLETED` 대신 `RELEASED`를 사용하고, 개별 Phase 완료 사실은 `Completed`에 기록한다.

### MUST: 작업 시작과 이어서 진행할 때

- 신규 게임의 첫 구현 단계에서 `DEVELOPMENT.md`를 함께 생성한다.
- 기존 게임 개발을 이어갈 때는 소스 수정 전에 해당 게임의 `DEVELOPMENT.md`를 먼저 읽는다.
- `DEVELOPMENT.md`가 진행 중 Phase와 active branch를 가리키면 새 브랜치를 만들기 전에 해당 브랜치가 실제로 존재하고 계속해야 할 작업인지 확인한다.
- 진행 중 Phase를 다른 채팅에서 이어가는 것은 새로운 작업 시작이 아니므로, 정상적인 checkpoint branch가 확인되면 최신 `main`에서 별도 브랜치를 새로 만들지 않고 기존 작업 브랜치를 이어간다.
- 게임별 Phase 브랜치명은 가능하면 game id와 작업 범위를 포함해 `feature/game-platform-<phase>-<game-id>-<scope>`처럼 다른 채팅에서도 검색 가능한 형태로 유지한다.

### MUST: Phase 완료 시

- Phase 완료 PR에는 `DEVELOPMENT.md` 갱신을 포함한다.
- 완료한 Phase와 검증 결과를 `Completed` / `Validation`에 반영한다.
- 다음 Phase 또는 다음 첫 작업을 `Next Work`에 구체적으로 남긴다.
- 완료되지 않은 항목을 완료한 것처럼 기록하지 않는다.

### MUST: 게임 출시 및 release closeout 시

첫 production 공개는 구현 완료와 별개의 lifecycle 단계로 다룬다.

1. 게임 runtime과 필요한 DB migration이 main에 들어갈 수 있는 상태인지 확인한다.
2. production migration이 필요한 게임은 실제 적용 이력과 RLS/grant/RPC 권한 경계를 검증한다.
3. Registry capability는 **소스가 존재한다는 이유만으로** 활성화하지 않는다. 실제 제공 가능한 기능만 activation PR에서 켠다.
4. 관련 unit / Game Platform / DB integration / E2E / build 검증을 통과하고 알려진 release blocker가 없어야 한다.
5. 사람 중심 다중 브라우저 exploratory playtest가 자동 검증으로 대체되지 않는 위험을 발견하면 수행한다. 다만 correctness를 자동/운영 계약으로 충분히 검증했고 남은 항목이 UX 관찰 수준이라면 post-release follow-up으로 명시할 수 있다.
6. 사용자에게 노출한 뒤 `DEVELOPMENT.md`를 `Status: RELEASED`, `Active branch: main`으로 갱신하고 날짜가 있는 `## Release — YYYY-MM-DD` 기록에 activation, production migration, 주요 검증, 현재 capability를 남긴다.
7. `Completed`의 과거 중간 상태가 현재 상태처럼 읽히지 않도록 "당시/초기 단계"임을 명시하거나 진행 로그로 이동한다.
8. 통합·대체된 stacked PR은 close하고 release에 흡수된 작업/임시 브랜치는 정리한다.
9. 이후 수정은 종료된 Phase 브랜치를 재사용하지 않고 최신 `main`에서 새 `fix/*` 또는 `feature/*` 브랜치로 시작한다.

`RELEASED`는 "더 이상 개선하지 않는다"는 뜻이 아니라 **현재 production baseline이 main으로 확정됐다는 뜻**이다.

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

### MUST: 출시 후 플랫폼 피드백 루프를 수행한다

각 platform-native 게임을 출시한 뒤 구현 과정에서 나온 결정을 다음 세 종류로 다시 분류한다.

1. **SHARED 후보** — 인증, 권한, room/lobby, snapshot/reconnect, version/idempotency, invite, 공통 identity처럼 게임 규칙과 무관하게 반복될 플랫폼 책임
2. **GAME-LOCAL 유지** — 규칙, 상태 머신, 플레이 중 이탈 정책의 게임별 의미, 보드/주사위/연출처럼 해당 게임의 도메인 책임
3. **RELEASE-OPERATIONS 규칙** — production migration, capability activation, 문서 closeout, PR/브랜치 정리처럼 개발 lifecycle 책임

첫 게임 한 번에서 편리했다는 이유만으로 SHARED 후보를 즉시 공통 API로 승격하지 않는다. 다음 게임에서도 같은 책임이 반복되거나 플랫폼 경계상 명백히 공통인 경우에만 shared 코드/계약을 확장하며, 그때 계약 테스트와 이 규칙 문서를 함께 갱신한다.

### MUST: 모든 신규 게임 release 뒤 플랫폼 회고를 수행한다

Game Platform 규칙은 한 번 완성하고 고정하는 규칙집이 아니다. 신규 platform-native 게임을 실제로 구현하고 출시할 때마다 **그 게임에서 드러난 구조적 마찰을 근거로 갱신하는 살아 있는 개발 기준**으로 유지한다.

release closeout에서는 최소한 다음 질문을 다시 검토한다.

1. 기존 shared 계약을 그대로 재사용할 수 있었는가?
2. 게임마다 다시 구현한 코드나 판단이 있었는가?
3. 공통 책임인데 game-local workaround로 우회한 부분이 있었는가?
4. 기존 규칙이 불필요하게 복잡하거나 실제 개발 흐름을 방해한 부분이 있었는가?
5. 반대로 규칙이 부족해 파일 위치, 권위 모델, DB 경계, release 절차가 흔들린 부분이 있었는가?
6. 새 게임 추가로 탐색해야 할 경로·문서·예외가 불필요하게 늘어나지는 않았는가?
7. 다음 게임 개발자가 이전 게임의 내부 구현을 읽지 않고도 플랫폼 계약만으로 시작할 수 있는가?

문제가 확인되면 단순히 문서에 예외를 하나 더 붙이는 것으로 끝내지 않는다. 먼저 기존 규칙을 단순화하거나 공통 계약을 정돈해서 **게임 수가 늘어도 구조 이해 비용과 신규 개발 시간이 비례해서 증가하지 않도록** 한다.

플랫폼 개선의 목표는 코드량 자체를 줄이는 것이 아니라 다음을 유지하는 것이다.

- 같은 종류의 파일과 책임이 예측 가능한 위치에 있다.
- 같은 플랫폼 문제는 같은 방식으로 해결한다.
- 새 게임이 기존 게임의 세부 구현을 복사하지 않아도 된다.
- 공통 변경의 영향 범위와 검증 방법을 빠르게 찾을 수 있다.
- 게임 수가 늘어도 한 게임을 추가하기 위해 읽고 판단해야 하는 범위가 급격히 커지지 않는다.

따라서 **일관성 없는 빠른 구현보다 반복 가능한 구조를 우선**한다. 다만 미래를 추측한 과도한 추상화도 같은 비용을 만들 수 있으므로, 실제 신규 게임에서 반복해서 확인된 문제를 근거로 최소 범위에서 규칙과 shared 계약을 개선한다.

## 5. Registry와 capability

신규 게임의 bootstrap 문서 단계에서는 Registry 등록을 유예할 수 있다. 실제 runtime 구현을 시작하는 순간 Game Registry에 등록한다.

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

### MUST: 구현 완료와 production activation을 구분한다

`online`, `invite`, `presence` 같은 capability가 true라는 것은 코드 파일이 존재한다는 뜻이 아니라 **현재 배포 환경에서 사용자에게 제공할 준비가 끝났다는 선언**이다.

online capability를 활성화하기 전에는 최소한 다음을 확인한다.

- 필요한 production migration 적용 여부
- RLS / grant / RPC authorization 경계
- 해당 게임의 DB/Test Contract
- stale version / idempotency / reconnect 등 관련 회귀
- 실제 entry route와 Registry href
- release blocker 부재

Invite를 활성화한다면 shared `game_room` routing과 서버-side token 재검증까지 확인한다.

### MUST: Registry 테스트 책임을 분리한다

Legacy 보호 테스트는 보호 대상 Legacy 게임의 존재와 핵심 계약을 명시적으로 검증할 수 있다.

공통 Game Platform 테스트는 Registry의 전체 게임 개수나 전체 ID 목록을 고정하지 않는다. 신규 platform-native 게임이 추가될 때마다 공통 foundation 테스트의 기대 배열이나 고정 길이를 수정하는 구조를 만들지 않는다.

개별 platform-native 게임의 Registry 설정과 capability, 실제 사용자 노출 상태는 해당 게임의 테스트가 검증한다. Registry ID 중복, shared 경로, runtime 등록 여부처럼 게임 수와 무관한 불변조건은 공통 계약 또는 Governance Guard가 검증한다.

이 분리의 목적은 Legacy 보호 강도를 낮추는 것이 아니라, 보호 대상과 확장 가능한 신규 게임의 테스트 책임을 분리해 게임 수 증가가 공통 테스트 수정량 증가로 이어지지 않게 하는 것이다.

전체 사람이 직접 플레이하는 exploratory smoke는 자동 검증을 대체하지 않는다. 반대로 자동/운영 계약이 충분히 검증된 상태에서 남은 위험이 presentation·브라우저 정책 같은 관찰 항목뿐이라면 해당 항목을 `Known Issues / Deferred`에 남기고 post-release에서 확인할 수 있다.

## 6. Room / Session 계약

온라인 멀티플레이가 room/session 개념을 사용하는 경우 기존 shared Room/Lobby 계약을 우선 검토한다.

플랫폼이 공통으로 보장해야 하는 책임은 특정 보드게임의 준비 방식이 아니라 다음과 같은 **세션 경계**다.

- 세션 생성 또는 참가
- 현재 사용자가 속한 활성 세션 확인
- 권한이 적용된 authoritative snapshot 조회
- 안전한 세션 이탈
- 상태 변경을 감지해 snapshot refresh를 유도하는 invalidation 구독

현재 `defineRoomLobbyAdapter` 구현은 다음 surface를 제공한다.

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

`setReady`와 `startGame`은 현재 shared 구현에서 검증된 lifecycle이지만 **모든 미래 게임의 보편 규칙으로 간주하지 않는다.** 전원 ready가 없거나, 자동 시작하거나, host가 없거나, 다른 방식으로 세션이 시작되는 게임에 억지로 빈 메서드나 가짜 의미를 추가하지 않는다.

새 게임의 자연스러운 lifecycle이 현재 adapter와 맞지 않으면:

1. game-local workaround로 shared 계약을 우회하지 않는다.
2. 현재 adapter를 그대로 강제하기 위해 의미 없는 method를 구현하지 않는다.
3. 실제 반복 가능한 플랫폼 책임인지 검토한 뒤 shared 계약을 가장 작은 범위로 확장하거나 분리한다.
4. 계약 변경 시 관련 contract test와 이 문서를 함께 갱신한다.

현재 adapter를 그대로 사용하는 게임은 해당 surface 전체를 구현해야 하며, 각 메서드 내부 구현과 실제 RPC 이름은 게임별로 달라도 된다.

MUST: 세션 생성/참가/준비/시작 등 상태 전이가 존재한다면 해당 권한과 조건은 서버가 최종 판단한다.

MUST NOT: UI에서 버튼을 숨기거나 비활성화했다는 이유로 서버 권한 검증을 생략하지 않는다.
## 6A. 플레이어 닉네임 / 로비 정체성

사이트 계정으로 참가하는 platform-native 멀티플레이 게임에서 플레이어 표시 이름은 **사이트 계정 프로필의 확정 닉네임**을 사용한다.

- MUST: 세션 생성/참가/초대 등 플레이어 identity가 확정되는 모든 진입 경로에서 현재 로그인 사용자의 프로필 닉네임을 사용한다.
- MUST: 닉네임의 생성·변경·중복 검사는 마이페이지 등 사이트 공통 프로필 흐름에서만 수행한다.
- MUST NOT: 게임별 entry/lobby 화면에 닉네임 입력, 임시 닉네임, 게임별 닉네임 변경 UI를 제공하지 않는다.
- MUST NOT: 게임 참가 요청의 임의 client payload를 authoritative 닉네임으로 신뢰하지 않는다.
- SHOULD: 게임별 서버 RPC는 가능한 경우 `auth.uid()`에 연결된 프로필의 닉네임을 직접 조회해 room member 표시 이름을 확정한다.
- 기존 호환성 때문에 RPC에 nickname 파라미터가 남아 있더라도 서버는 해당 값을 표시 이름의 권위로 사용하지 않는다.

이 규칙의 목적은 게임마다 다른 이름을 사용하는 것을 막고, 사이트에서 중복 검사를 거쳐 확정한 하나의 커뮤니티 정체성을 모든 게임에서 일관되게 사용하는 것이다.

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

## 10A. 게임 규칙 안내와 게임 종료

모든 platform-native 게임은 처음 플레이하는 사용자가 외부 검색 없이 게임을 이해하고 안전하게 세션을 끝낼 수 있어야 한다.

### MUST: 게임 규칙 안내

- 사용자가 플레이를 시작하기 전에 접근 가능한 entry/setup 화면(로비가 있는 게임은 로비 포함)에서 항상 **게임 규칙 보기**에 접근할 수 있어야 한다.
- 규칙 안내는 처음 플레이하는 사용자가 읽고 바로 플레이할 수 있을 정도로 목표, 구성요소, 턴 순서, 가능한 선택, 실패/패널티, 종료/승리 조건, 대표 예시를 충분히 설명한다.
- 공개된 기존 보드게임은 공식 규칙서, 퍼블리셔 자료 또는 신뢰 가능한 규칙 출처를 먼저 확인하고 구현 규칙과 사용자 안내가 같은 해석을 사용해야 한다.
- 규칙이 짧거나 중간 분량이면 modal/dialog를 사용할 수 있고, 내용이 길거나 예시·도표가 많으면 game-local 전용 규칙 페이지를 사용한다.
- 규칙 원문을 장문 복제하지 않고 출처를 남긴 뒤 웹게임에 필요한 사실과 해석을 상세히 재구성한다.
- 실제 플레이 중에도 규칙 안내를 다시 열 수 있는 경로를 유지하는 것을 기본값으로 한다.

### MUST: 게임 종료 / 세션 이탈

- 지속되는 플레이 세션을 갖는 게임은 진행 중인 세션을 끝낼 수 있는 명시적 **게임 종료** 또는 이에 준하는 안전한 종료 경로를 제공한다.
- 온라인 멀티플레이에서 게임 전체를 종료하는 권한은 게임별로 명확히 정의하며, 다른 플레이어의 세션에 영향을 주는 종료는 서버가 최종 권한을 검증한다.
- 파괴적 종료는 확인 modal/dialog를 거쳐 오조작을 방지한다.
- 종료 후 모든 클라이언트가 authoritative snapshot 또는 명시적 terminal state로 동일한 결과를 복구할 수 있어야 한다.
- 종료된 사용자가 active session에 영구히 묶이지 않도록 해당 게임에 필요한 leave, restart/rematch, entry return 등의 후속 경로를 정의한다.
- 브라우저를 닫거나 단순히 다른 페이지로 이동하는 것을 authoritative 게임 종료로 간주하지 않는다.

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
5. 게임 시작 조건/권한의 server-side 검증
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
1. 원본 규칙/출처 조사와 제품 범위 결정
2. GAME_SPEC.md + DEVELOPMENT.md bootstrap
3. 게임 규칙과 상태 머신 구현 및 unit test
4. 첫 runtime 구현과 함께 Game Registry 등록
5. Access Gate 연결
6. 게임별 DB schema / RPC 설계
7. Room/Session adapter 연결 (해당 lifecycle을 사용하는 경우)
8. DB/Test Contract 연결 (online인 경우)
9. authoritative snapshot 구현 (stateful online인 경우)
10. Versioned / Idempotent Action 연결 (상태 변경 action이 있는 경우)
11. Realtime invalidation + reconnect 연결 (online realtime을 사용하는 경우)
12. Common Game Shell / player UI 연결 (필요한 공통 surface만)
13. Invite 연결 (지원하는 경우)
14. 게임 고유 UI / 애니메이션 / 연출 확장
15. 멀티클라이언트 및 reconnect 회귀 검증
16. production migration / 권한 경계 검증
17. Registry capability activation + 게임 목록/entry 노출
18. RELEASED 문서 closeout
19. stacked PR / 작업 브랜치 정리
20. 구현 피드백을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 재분류
```

이 순서는 게임 고유 시각 연출을 늦추기 위한 강제 단계가 아니라, 네트워크와 권위 모델이 흔들린 상태에서 UI 복잡도를 먼저 키우지 않기 위한 기본 작업 순서다. 16~20은 첫 공개 또는 큰 release에서 수행하는 closeout 단계이며, 작은 유지보수 수정에서는 변경 범위에 필요한 항목만 적용한다.

## 16. 완료 체크리스트

신규 온라인 게임 PR을 완료하기 전에 다음을 확인한다.

- [ ] `games/<game-id>/`에 게임이 독립적으로 위치한다.
- [ ] `games/<game-id>/GAME_SPEC.md`가 현재 게임 규칙, 구현 범위, 상태 머신, 플랫폼 경계를 반영한다.
- [ ] `games/<game-id>/DEVELOPMENT.md`가 현재 Phase/브랜치/다음 작업/검증 상태를 반영한다.
- [ ] Registry에 `platform: "shared"`로 등록되어 있다.
- [ ] 실제 구현된 capability만 선언되어 있다.
- [ ] Approved Member / Access Gate를 사용한다.
- [ ] room/session 기반 online 게임이라면 현재 shared adapter가 lifecycle에 맞는지 확인하고, 맞지 않으면 의미 없는 method를 추가하지 않고 계약 확장 여부를 검토했다.
- [ ] 사이트 계정 기반 multiplayer라면 게임별 entry/lobby에서 닉네임을 따로 만들지 않고 사이트 프로필 닉네임을 사용한다.
- [ ] 서버 RPC가 권한과 상태 전이를 최종 판정한다.
- [ ] state-changing action이 version/idempotency 경계를 가진다.
- [ ] snapshot version과 stale snapshot 방어가 있다.
- [ ] Realtime은 invalidation으로만 사용한다.
- [ ] reconnect가 authoritative snapshot으로 복원된다.
- [ ] 구독/listener 정리 경로가 있다.
- [ ] 플레이 시작 전 entry/setup 화면에서 상세 게임 규칙을 확인할 수 있고 플레이 중에도 다시 접근할 수 있다.
- [ ] 진행 중 세션을 안전하게 끝낼 수 있는 게임 종료 경로와 종료 후 복구/이탈 흐름이 있다.
- [ ] Common Game Shell 사용 여부와 게임-local UI 경계가 명확하다.
- [ ] Invite를 제공한다면 `game_room` 계약을 사용한다.
- [ ] DB/Test Contract 필수 시나리오를 모두 구현한다.
- [ ] 다른 플레이어의 private state가 노출되지 않는다.
- [ ] 기존 Legacy 게임을 불필요하게 수정하지 않았다.
- [ ] 관련 unit / DB integration / E2E / build 검증을 실행했다.
- [ ] shared 계약을 변경했다면 테스트와 문서를 함께 갱신했다.

### RELEASED closeout

- [ ] production DB 변경이 있다면 적용 이력과 권한 경계를 확인했다.
- [ ] 사용자에게 제공할 capability만 true로 활성화했다.
- [ ] 게임 목록/entry/invite 등 실제 노출 경로를 확인했다.
- [ ] `DEVELOPMENT.md`가 `Status: RELEASED`, `Active branch: main`, 날짜가 있는 `## Release — YYYY-MM-DD` 기록을 가진다.
- [ ] 현재 상태와 모순되는 개발 중 문구를 정리했다.
- [ ] 통합되거나 대체된 PR을 닫고 불필요한 작업/임시 브랜치를 정리했다.
- [ ] 이후 유지보수는 최신 `main`에서 새 브랜치로 시작한다.
- [ ] 이번 게임에서 얻은 교훈을 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 분류하고 필요한 플랫폼 문서/계약에 환류했다.

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