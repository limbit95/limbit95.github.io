# No Thanks! Game Spec

> 이 문서는 No Thanks!가 무엇이며 청파 같이에서 어떤 규칙과 구조로 구현할지 정의하는 game-local 설계 기준입니다.
> 구현 진행상황은 같은 디렉터리의 `DEVELOPMENT.md`에서 관리합니다.

## Game Overview

- Game id: `no-thanks`
- Designer: Thorsten Gimmler
- Players: 3–7명
- Target mode: online multiplayer
- Core loop: 현재 공개된 숫자 카드를 칩 1개를 내고 거절하거나, 카드와 그 위에 쌓인 칩을 함께 가져오는 선택을 반복하는 카드 게임
- Win condition: 마지막 카드가 가져가진 뒤 숫자 카드 점수에서 남은 칩을 뺀 최종 점수가 가장 낮은 플레이어가 승리
- Base deck: 3–35의 숫자 카드 33장 중 무작위 9장을 제외하고 24장 사용

## Rules and Sources

구현 기준은 다음 자료를 우선 사용합니다.

- AMIGO official English rulebook: https://blog.amigo-spiele.de/content/ap/rule/02455-GB-AmigoRule.pdf
- AMIGO product page: https://www.amigo-spiele.de/no-thanks_2455_1247
- Board Game Arena rules summary (secondary cross-check): https://en.doc.boardgamearena.com/Gamehelpnothanks

현재 v1에서 적용할 기본 규칙:

1. 3–5인은 각 11개, 6인은 각 9개, 7인은 각 7개의 counter로 시작한다.
2. 각 플레이어가 가진 counter 개수는 게임이 끝날 때까지 다른 플레이어에게 공개하지 않는다.
3. 3–35의 숫자 카드 33장을 섞고 9장을 보지 않은 채 제외한다. 남은 24장이 draw deck이다.
4. 현재 차례의 플레이어는 공개된 카드를 가져가거나 counter 1개를 내고 거절할 수 있다.
5. 카드를 거절하면 counter 1개가 현재 카드 위의 공개 pile에 추가되고 차례는 다음 플레이어에게 넘어간다.
6. counter가 하나도 없는 플레이어는 거절할 수 없으며 현재 카드를 반드시 가져가야 한다.
7. 현재 카드를 가져가면 카드 위에 쌓인 모든 counter도 함께 가져간다.
8. 카드를 가져간 플레이어가 다음 카드를 공개하며 같은 플레이어가 다시 선택한다. 즉, 카드를 가져가는 행동 자체로는 차례가 끝나지 않는다.
9. 마지막 카드를 누군가 가져가는 순간 게임이 끝난다.
10. 단독 숫자 카드는 적힌 값만큼 점수가 된다.
11. 연속된 숫자 카드 묶음은 가장 낮은 숫자 하나만 점수에 포함한다.
12. 최종 점수는 숫자 카드 점수 합에서 남은 counter 수를 뺀 값이다.
13. 최종 점수가 가장 낮은 플레이어가 승리한다.
14. 최저 점수가 동점이면 해당 플레이어들은 공동 승리한다.

### Digital adaptation

공식 규칙의 선 플레이어 결정은 "가장 최근에 No thanks!라고 말한 사람"이지만 온라인 좌석에는 물리적 맥락이 없으므로 청파 같이 v1에서는 서버가 게임 시작 시 turn order를 한 번 무작위로 확정합니다.

게임 중 다른 플레이어의 보유 counter 수는 공식 규칙대로 비공개로 유지합니다. 현재 공개 카드 위에 쌓인 counter 수와 각 플레이어가 획득한 숫자 카드는 모든 플레이어에게 공개합니다.

사용자용 규칙 안내는 로비와 실제 플레이 화면에서 다시 열 수 있는 modal을 기본으로 합니다. 목표, 시작 counter, 9장 제외, 거절/수락, counter가 없을 때의 강제 수락, 연속 숫자 scoring, 남은 counter 감점, 공동 승리를 처음 플레이하는 사용자도 이해할 수 있게 설명합니다.

## Product Scope

### Included

- 3–7인 online multiplayer
- classic base game
- 3–35 number deck
- 무작위 9장 비공개 제외
- 인원별 초기 counter 수
- counter 보유량 private state
- pass/refuse action
- take-card action
- 카드 위 공개 counter pile
- 연속 숫자 chain scoring
- final score 및 공동 승리
- authoritative reconnect snapshot
- 상세 게임 규칙 modal
- 진행 중 세션의 안전한 종료/이탈 경로

### Deferred

- 2024 AMIGO 재판에 포함된 22장 special-card expansion
- Board Game Arena의 Tactical Variant
- 플레이 기록/전적
- 관전자 모드
- AI player
- 별도 애니메이션/사운드 polish
- production capability activation

### Not planned for v1

- Legacy 게임 구조 복사
- 클라이언트가 deck shuffle, draw card, score, chip legality를 최종 결정하는 구조
- 게임별 nickname 입력/변경 UI
- 다른 플레이어의 정확한 counter 수 공개

## State Machine

### Room lifecycle

- `ENTRY`: 승인회원 진입
- `WAITING`: room 생성/참가, 3–7명 구성, 준비 상태 관리
- `PLAYING`: authoritative game state 진행
- `GAME_OVER`: 마지막 카드 수락 또는 수동 종료로 terminal
- `POST_GAME`: 결과 확인 후 leave/rematch 흐름

현재 shared Room/Lobby 계약의 ready + host start lifecycle을 v1에서 사용합니다.

### Gameplay lifecycle

`PLAYING` 안에서 별도 복잡한 phase를 늘리지 않고 다음 authoritative state를 유지합니다.

- `currentCard`: 현재 공개 카드
- `centerCounters`: 현재 카드 위에 쌓인 공개 counter 수
- `activePlayerId`: 현재 선택권을 가진 플레이어
- `deckRemaining`: 아직 공개되지 않은 카드 수

가능한 action:

- `REFUSE_CARD`
  - 조건: active player이며 own counters > 0
  - 결과: own counters -1, centerCounters +1, active player를 다음 좌석으로 이동
- `TAKE_CARD`
  - 조건: active player
  - 결과: currentCard를 플레이어 공개 tableau에 추가, centerCounters를 own counters에 더함
  - draw deck이 남았으면 서버가 다음 카드를 공개하고 active player는 그대로 유지
  - 마지막 카드였다면 final score를 계산하고 `GAME_OVER`
- `END_GAME`
  - host 등 명시된 권한에 따라 서버가 terminal state로 전환

counter가 0이면 `REFUSE_CARD`는 legal action이 아니고 `TAKE_CARD`만 허용합니다.

## Domain Model

authoritative game state의 핵심 모델:

```text
game
  phase
  turnOrder[]
  activePlayerId
  currentCard
  centerCounters
  deckRemaining
  excludedCount
  players{
    playerId
    cards[]
  }
  winners[]
  finalScores{}
  endReason
```

private snapshot의 플레이어별 모델:

```text
viewer
  playerId
  counters
```

서버 내부에만 유지할 상태:

```text
drawDeck[]
playerCounters{}
excludedCards[] 또는 이에 준하는 비공개 상태
```

클라이언트는 draw order나 제외 카드 목록을 미리 알 수 없어야 합니다.

### Deterministic scoring

숫자 카드를 오름차순으로 정렬한 뒤 각 연속 chain의 첫 숫자만 합산합니다.

예:

```text
cards = [3, 10, 11, 12, 20]
card score = 3 + 10 + 20 = 33
counters = 5
final score = 28
```

동일 최저 점수는 공동 승리로 처리합니다.

## Platform Boundary

### SHARED

- Game Registry
- Approved Member / Access Gate
- Common Game Shell
- Room/Lobby contract
- versioned / idempotent action envelope
- Snapshot Coordinator
- reconnect refresh trigger
- connection/player view-state
- platform-native Invite (실제 구현/운영 검증 후 capability activation)
- DB/Test Contract

### GAME-LOCAL

- deck 구성과 shuffle
- 9장 제외
- 인원별 초기 counter 계산
- 공개 카드 및 center counter pile
- refuse / take legality
- hidden counter state
- turn advancement
- consecutive-chain scoring
- final score / 공동 승리
- No Thanks! 전용 카드/tableau UI
- 게임 특유 애니메이션/사운드

현재 shared 계약 변경 없이 구현하는 것을 기본으로 합니다.

## Authority and Persistence

online v1은 서버 authoritative 구조로 구현합니다.

서버가 최종 결정해야 하는 항목:

- room membership / ready / start 조건
- turn order
- deck shuffle
- 제외되는 9장
- draw order
- current card
- player counter count
- refuse 가능 여부
- center counter pile
- take 결과
- turn advancement
- final score / winners
- manual termination

상태 변경 action은 기본적으로 다음 경계를 사용합니다.

```text
room_id
expected_version
client_action_id
action payload
```

서버는 room row lock과 transaction 안에서 membership, active player, phase, expected version, idempotency를 검증한 뒤 상태를 한 번만 commit합니다.

### Snapshot privacy

public snapshot:

- room / version / status
- turn order
- active player
- current card
- centerCounters
- deckRemaining
- 모든 플레이어의 공개 tableau
- 게임 종료 후 final score / winners

viewer-private snapshot:

- 현재 로그인 플레이어 자신의 정확한 counter 수

MUST NOT:

- 다른 플레이어의 counter 수
- 아직 공개되지 않은 draw order
- 제외된 9장 목록

Realtime은 invalidation 신호로만 사용하고 최종 상태는 authoritative snapshot으로 다시 조회합니다.

## UI / UX Direction

- Common Game Shell을 사용합니다.
- desktop에서는 중앙에 현재 카드와 counter pile을 크게 두고, 좌우/하단에 player tableau와 roster를 배치합니다.
- mobile에서는 현재 카드/선택 action을 첫 화면에 우선 배치하고 player tableau는 세로 흐름으로 정리합니다.
- 자신의 counter 수는 명확히 표시하지만 다른 플레이어의 counter 수는 숫자로 노출하지 않습니다.
- 현재 카드 위의 counter pile 수는 모든 플레이어에게 공개합니다.
- action은 핵심 두 개만 강조합니다.
  - `거절하기 (-1)`
  - `카드 가져오기 (+쌓인 칩)`
- counter가 0이면 거절 버튼을 숨기거나 disabled 처리하되 서버 검증은 그대로 유지합니다.
- 획득한 숫자 카드는 연속 chain이 즉시 보이도록 정렬/그룹화합니다.
- 로비/플레이 중 모두 `게임 규칙` 진입점을 유지합니다.
- 사이트 프로필 닉네임을 사용하고 game-local nickname 입력 UI를 두지 않습니다.
- destructive 게임 종료는 확인 UI + server-authoritative terminal state로 처리합니다.

## Implementation Plan

1. Bootstrap
   - `GAME_SPEC.md`
   - `DEVELOPMENT.md`
2. Deterministic rules engine
   - initial counter calculation
   - take/refuse transition
   - turn progression
   - chain scoring / ties
   - game-over transition
   - unit tests
3. Access Gate + Common Game Shell 최소 runtime
4. Room/Lobby DB/RPC foundation
   - 3–7명
   - ready / host start
   - authoritative turn order / deck initialization
   - DB/Test Contract
5. Runtime lobby flow
6. Authoritative gameplay RPC
   - refuse card
   - take card / server draw
   - final scoring
7. Snapshot privacy / reconnect / realtime invalidation
8. 상세 rules modal / game exit / post-game
9. Invite
10. production migration / multiplayer smoke / capability activation
11. release closeout + platform feedback loop

## Validation Plan

- game-local rules unit tests
  - player-count counter setup
  - zero-counter forced take
  - refuse decrements own counter / increments center pile / advances turn
  - take transfers center counters / keeps active player
  - last-card game over
  - consecutive-chain scoring
  - disconnected chains
  - counter deduction
  - tie winners
  - input state immutability
- Game Platform contract / governance tests
- DB/Test Contract 10개 mandatory scenario
- hidden counter privacy regression
- draw order / excluded cards non-exposure regression
- stale version / duplicate action / concurrent action regression
- reconnect authoritative snapshot
- 3인 / 7인 browser multiplayer smoke
- mobile/desktop rules modal 및 action layout 수동 검증

## Open Questions / Deferred

- special-card expansion은 classic v1 release 뒤 별도 Phase에서 검토합니다.
- game in-progress player leave 정책은 Room/Lobby 및 gameplay DB 설계 단계에서 게임 규칙과 플랫폼 안전성을 함께 검토해 확정합니다.
- host가 PLAYING 중 떠나는 경우의 host transfer 또는 terminal 정책은 아직 확정하지 않습니다.
- rematch에서 동일 room을 재사용할지 새 authoritative game state만 초기화할지는 post-game 단계에서 확정합니다.
- production에서 invite capability를 켜는 시점은 migration, DB contract, 실제 multiplayer smoke 이후로 미룹니다.
