# Can't Stop Game Spec

> Phase 4에서 Game Platform을 처음 실제 신규 게임에 적용하기 위한 bootstrap 설계 문서입니다.
> 원본 규칙을 장문 복제하지 않고 청파 같이 구현에 필요한 규칙과 기술 결정을 요약합니다.

## Game Overview

- Game id: `cant-stop`
- Designer: Sid Sackson
- Players: 2–4명
- Core loop: 네 개의 주사위를 두 쌍으로 나눠 2–12 열을 전진하고, 현재 턴의 임시 진척을 확정할지 더 굴릴지 선택하는 push-your-luck 게임
- Win condition: 서로 다른 세 개의 열을 먼저 claim한 플레이어가 승리
- Board: 2–12의 11개 열
- Column heights: `2:3, 3:5, 4:7, 5:9, 6:11, 7:13, 8:11, 9:9, 10:7, 11:5, 12:3`

## Rules and Sources

구현 기준은 다음 자료를 교차 확인한다.

- Can't Stop rulebook PDF: https://cdn.1j1ju.com/medias/d8/88/07-cant-stop-rulebook.pdf
- Board Game Arena rules summary: https://boardgamearena.com/gamepanel?game=cantstop
- BoardGameGeek game page: https://boardgamegeek.com/boardgame/41/cant-stop
- Column length cross-check: https://en.wikipedia.org/wiki/Can%27t_Stop_%28board_game%29

현재 구현 기준으로 정리한 핵심 규칙:

1. 턴 시작 시 최대 세 개의 neutral runner를 사용한다.
2. 네 개의 d6를 굴리고, 두 개씩 짝지은 두 합을 하나의 pairing으로 선택한다.
3. 한 roll에는 최대 세 가지 pairing이 존재하며 같은 두 합을 만드는 중복 pairing은 하나의 선택지로 취급할 수 있다.
4. 선택한 pairing의 각 합은 해당 열의 runner를 한 칸 전진시키거나, 빈 runner가 있으면 그 열에 새 runner를 놓는다.
5. 새 runner는 해당 플레이어의 이전 permanent progress 바로 다음 칸에서 시작하며, 이전 진척이 없으면 열의 첫 칸에서 시작한다.
6. 한 턴에 runner가 존재할 수 있는 열은 최대 세 개이며, 이미 세 열을 사용 중이면 새 열을 열 수 없다.
7. 선택한 pairing 안에서 합 하나만 합법적으로 움직일 수 있는 경우 한 번만 전진하는 것은 허용된다. 합법적인 이동을 임의로 버리지는 않는다.
8. 두 합이 같은 열이면 같은 runner를 순차적으로 두 번 전진할 수 있다. 두 번째 이동 시점에 더 전진할 수 없다면 가능한 이동만 적용한다.
9. 이미 claim된 열은 모든 플레이어에게 닫혀 있고 이후 roll의 합으로 사용할 수 없다.
10. runner가 열의 top에 도달한 뒤에도 플레이어는 더 굴릴 수 있지만 그 runner 자체는 더 전진할 수 없다.
11. 어떤 pairing으로도 runner를 하나 이상 합법적으로 전진/배치할 수 없으면 bust다. 해당 턴의 모든 임시 진척을 잃고 다음 플레이어로 넘어간다.
12. 성공적으로 이동한 뒤 플레이어는 다시 굴리거나 stop을 선택한다.
13. stop하면 runner 위치를 자신의 permanent progress로 확정한다. top에 도달한 열은 그 시점에 claim되고 다른 플레이어의 해당 열 진척은 제거된다.
14. 세 번째 열을 claim한 stop 처리와 함께 게임이 종료된다.
15. 다른 플레이어의 permanent marker와 같은 칸을 공유하는 것은 허용한다.

청파 같이 구현에서는 사전 주사위로 선 플레이어를 정하지 않는다. 게임 시작 RPC가 서버에서 플레이어 순서를 한 번 무작위로 확정하고 authoritative game state에 저장한다.

## Product Scope

### Included

- 2–4인 online multiplayer
- 표준 2–12 / 11열 board
- 네 개의 d6와 세 runner
- pairing 선택
- roll again / stop 흐름
- bust
- column claim
- 세 열 claim 승리
- Approved Member 기반 Room/Lobby
- authoritative snapshot / reconnect
- online core 안정화 이후 platform-native Invite

### Deferred

- 고급 통계/확률 힌트
- 관전자 모드
- turn timer
- AI/bot
- 변형 규칙
- 랭킹/전적 시스템
- 고급 3D 연출

### Not planned for initial version

- 원본 판본의 아트워크나 상표 디자인 복제
- Legacy 게임 코드 재사용 또는 마이그레이션

## State Machine

```text
LOBBY
→ TURN_ROLL
→ PAIRING_SELECTION
→ PUSH_OR_STOP
   ├─ roll again → TURN_ROLL
   └─ stop → COMMIT_PROGRESS
                ├─ winner → GAME_OVER
                └─ next player → TURN_ROLL

TURN_ROLL
└─ no legal pairing → BUST → next player → TURN_ROLL
```

- `TURN_ROLL`: 현재 플레이어만 roll intent를 보낼 수 있다.
- `PAIRING_SELECTION`: 서버가 주사위 결과에서 계산한 legal pairing과 그 pairing에 속한 legal move plan만 선택 가능하다.
- `PUSH_OR_STOP`: pairing 적용 이후 현재 플레이어가 다시 roll하거나 stop한다.
- `COMMIT_PROGRESS`: 임시 runner를 permanent progress로 확정하고 claim/win을 계산한다.
- `BUST`: 임시 진척을 폐기하고 permanent state는 유지한다.
- `GAME_OVER`: gameplay action을 더 받지 않는다.

## Domain Model

- `columns`: number, height, claimedBy
- `players`: player id, 서버가 게임 시작 시 무작위로 확정한 turn order, column별 permanent progress, claimed columns
- `turn`: activePlayerId, 최대 세 개의 runner positions, latest dice, legal pairings + legal move plans, phase
- `game`: status, version, winnerId, turn index

pairing은 주사위 인덱스 조합보다 최종 두 합을 canonical form으로 저장한다. 동일한 합 조합은 선택지에서 중복 제거하되, 같은 합 두 개는 `[7, 7]`처럼 두 번의 이동 가능성을 보존한다.

pairing 하나가 항상 하나의 이동 결과를 뜻하지는 않는다. neutral runner 자리가 하나만 남았는데 두 합이 모두 새 열인 경우처럼 두 합을 모두 사용할 수 없지만 각각 하나씩은 사용할 수 있다면, 해당 pairing은 `plans: [[sumA], [sumB]]`처럼 여러 legal move plan을 가진다. 두 합을 모두 사용할 수 있다면 반드시 두 이동을 적용하는 plan만 허용한다.

게임 규칙 계산은 pure deterministic function 중심으로 분리해 같은 입력 snapshot + action이 같은 결과를 만들게 한다.

## Platform Boundary

### SHARED 재사용

- Game Registry
- Approved Member / Access Gate
- Room/Lobby adapter
- Versioned / Idempotent Action envelope
- Snapshot Coordinator
- Reconnect refresh trigger
- Common Game Shell / connection state / roster
- platform-native `game_room` Invite
- DB/Test Contract gate

### GAME-LOCAL 유지

- 11개 column 구조와 높이
- 네 주사위 pairing 계산
- runner 최대 3개 규칙
- legal pairing 계산
- roll / pairing / push / stop / bust 상태 머신
- column claim과 승리 판정
- Can't Stop board UI와 주사위/runner 연출

Can’t Stop 구현 편의를 위해 shared API에 pairing, dice, runner 같은 개념을 추가하지 않는다.

## Authority and Persistence

online version의 최종 권위는 서버 RPC와 DB state다.

서버가 최종 결정하는 항목:

- 실제 주사위 네 개의 결과
- 가능한 pairing 목록과 선택 유효성
- runner 이동 가능 여부
- bust 여부
- stop commit
- column claim
- 승리
- 게임 시작 시 최초 turn order 무작위 확정
- turn 이동
- room/game version 증가

클라이언트는 `roll_dice`, `choose_pairing`, `continue_turn`, `stop_turn` 같은 intent만 보낸다.

`roll_dice`는 클라이언트가 dice 값을 전달하지 않는다. 서버 RPC가 네 개의 d6를 생성하고 현재 authoritative `claimedColumns`, `runners`, `playerProgress`를 기준으로 legal pairing / legal move plan을 계산한다. legal pairing이 하나도 없으면 같은 transaction 안에서 bust 처리와 다음 turn 전환까지 수행한다.

`choose_pairing`은 클라이언트가 `sums`와 실제 적용할 `columns` plan을 선택해 보내되, 서버가 직전 roll snapshot에 저장한 `legalPairings[].plans`와 정확히 일치하는 선택만 허용한다. 서버는 선택된 plan을 다시 simulation해 runner 위치를 계산하고 `PUSH_OR_STOP`으로 전환한다. 같은 `clientActionId`를 다른 pairing payload로 재사용하면 replay로 인정하지 않고 conflict로 거부한다.

`continue_turn`은 `PUSH_OR_STOP`에서 현재 runner를 그대로 유지하고 `latestDice`와 `legalPairings`만 초기화해 같은 active player의 `TURN_ROLL`로 돌아간다.

`stop_turn`은 현재 runner 위치를 active player의 `playerProgress`에 commit한다. top에 도달한 runner는 해당 column을 claim하고 다른 플레이어의 같은 column progress를 삭제한다. active player의 claim이 세 개 이상이면 `GAME_OVER`와 `winnerId`를 기록하고, 아니면 runner/roll 상태를 비운 뒤 다음 player의 `TURN_ROLL`로 전환한다.

state-changing action은 공통 envelope의 `expectedVersion`과 `clientActionId`를 사용한다. 동일 action 재전송은 두 번 적용되지 않아야 하고 같은 version을 기준으로 충돌하는 action은 하나만 authoritative commit되어야 한다.

authoritative snapshot에는 보드, 모든 플레이어의 공개 진척, 현재 runner, 공개된 dice, 현재 phase, turn, claimed columns, winner와 `version`을 포함한다.

Can’t Stop에는 상대에게 숨겨야 하는 hand/role 같은 gameplay private state가 없다. DB/Test Contract의 private-state 시나리오는 "노출될 private gameplay state 자체가 없음"을 명시적으로 검증한다.

Realtime은 snapshot 교체 데이터가 아니라 invalidation 신호로만 사용한다.

Room/Lobby foundation은 다음 game-local DB 객체를 사용한다.

- `public.cant_stop_rooms`: room identity, host, status, max players, authoritative `version`, game state
- `public.cant_stop_room_players`: room membership, seat, nickname, ready state
- `public.cant_stop_room_actions`: `client_action_id` 기반 lobby action replay/idempotency 기록
- public RPC: `cant_stop_create_room`, `cant_stop_join_room`, `cant_stop_get_my_active_room`, `cant_stop_get_lobby_snapshot`, `cant_stop_set_ready`, `cant_stop_leave_room`, `cant_stop_start_game`, `cant_stop_roll_dice`, `cant_stop_choose_pairing`, `cant_stop_continue_turn`, `cant_stop_stop_turn`

브라우저에는 위 테이블의 직접 쓰기 권한을 주지 않는다. 승인회원 RPC가 권한, membership, host, phase, expected version을 검증하고 room row lock 안에서 변경한다. `set_ready`와 `start_game`은 `client_action_id`를 기록해 재전송 시 같은 authoritative snapshot을 반환한다.

Realtime은 `cant_stop_rooms`와 `cant_stop_room_players` 변경만 invalidation으로 구독하고, 실제 렌더 상태는 `cant_stop_get_lobby_snapshot` 또는 후속 authoritative snapshot RPC로 다시 읽는다.

## UI / UX Direction

- Common Game Shell로 제목, 방 정보, 연결 상태, roster, 공통 action 영역을 제공한다.
- 메인 영역은 2–12 열이 산 형태로 올라가는 Can't Stop 전용 board로 구성한다.
- permanent progress와 현재 턴의 temporary runner를 시각적으로 구분한다.
- 현재 roll의 네 주사위와 가능한 pairing 선택지를 함께 보여준다.
- legal pairing이 하나만 존재해도 자동 적용하지 않고 active player가 이동 plan을 명시적으로 선택한다.
- temporary runner와 permanent progress는 서로 다른 marker 스타일로 표시하고 claimed column은 완주자를 함께 표시한다.
- `한 번 더 굴리기`와 `여기서 멈추기`를 turn의 핵심 선택으로 강조한다.
- bust 시 이번 턴에 잃은 임시 진척이 명확히 보이도록 짧은 피드백을 제공한다.
- 모바일에서는 11개 열 전체 판독성을 우선하고 과도한 3D/카메라 조작은 초기 버전에서 사용하지 않는다.
- 원본 상용판의 보드/말 그래픽은 복제하지 않고 청파 같이 고유 시각 디자인을 사용한다.
- online entry는 방 만들기 또는 6자리 코드 참가로 시작하며, waiting room에서 준비 상태와 방장 시작 조건을 명확히 보여준다.
- Room/Lobby Realtime은 화면 상태를 직접 덮어쓰지 않고 authoritative snapshot refresh만 유도한다.
- 소스의 online 흐름 구현과 운영 배포 가능 상태를 구분한다. 운영 Supabase migration과 smoke test가 끝나기 전에는 Registry `online` capability와 게임 목록 노출을 활성화하지 않는다.

## Implementation Plan

1. pure game-local rules engine
   - column constants
   - four-dice pairing enumeration/deduplication
   - legal move 계산
   - runner movement
   - bust / stop / claim / win
   - unit tests
2. 첫 runtime slice
   - Game Registry 등록
   - Access Gate
   - Common Game Shell 기반 최소 board
3. online room foundation
   - game-specific schema/RPC
   - Room/Lobby adapter
   - approved member/host 권한
4. authoritative gameplay actions
   - server dice roll
   - `choose_pairing`
   - `stop_turn`
   - version/idempotency/concurrency
5. DB/Test Contract 10개 시나리오 적용
6. snapshot + Realtime invalidation + reconnect
7. multiplayer UI와 game-specific animations
8. platform-native Invite
9. 멀티클라이언트 / reconnect / stale action 회귀 검증

shared 계약으로 표현되지 않는 요구가 나오면 먼저 game-local로 해결 가능한지 확인한다. 여러 미래 게임에서도 동일한 플랫폼 책임으로 반복되는 경우에만 shared 변경을 계약 테스트와 문서와 함께 수행한다.

## Validation Plan

### Rules

- 4 dice의 세 pairing 생성과 중복 제거
- 동일 합 두 번 이동
- runner 0/1/2/3개 사용 상태
- 세 runner 사용 후 새 열 차단
- closed column 차단
- top runner 추가 이동 차단
- 한 pairing에서 한 이동만 가능한 경우
- legal pairing 없음 → bust
- bust 시 permanent progress 불변
- stop 시 runner commit
- top에서 stop → claim
- claim된 열의 타 플레이어 진척 제거
- 세 번째 claim → game over

### Platform

- Game Registry / capability
- Access Gate
- Room/Lobby adapter
- snapshot stale version 거부
- reconnect refresh
- idempotent action
- DB/Test Contract 10개 시나리오

### Multiplayer regression

- 2/3/4인 turn order
- 서로 같은 칸/열 progress
- player A action이 B/C client에 snapshot으로 반영
- 연속 roll 중 reconnect 후 runner 복원
- stop/claim 직전 stale client action 거부
- bust 직후 reconnect 상태 일치

## Open Questions / Deferred

- GAME_OVER 이후 방 나가기, 같은 멤버 재대결, 새 방 생성 lifecycle은 online gameplay UI가 안정된 뒤 설계한다.
- GAME_OVER에서는 모든 player가 방을 나갈 수 있고, 방장은 같은 room을 waiting으로 되돌려 재대결 준비를 시작할 수 있다.
- 재대결 준비는 기존 active members / seats / room code를 유지하고 ready 상태만 초기화한 뒤 기존 ready/start 흐름을 재사용한다.
- Invite는 shared `game_room` 계약과 사이트 공용 invite infrastructure를 사용한다.
- invite token resolve 이후 실제 참가 권한은 `cant_stop_join_room_by_invite`가 token을 서버에서 다시 검증해 결정한다.
- Invite 소스 연결과 Registry capability 활성화는 분리하며 운영 migration + live smoke test 전에는 `online/invite`를 활성화하지 않는다.
- 초기 board의 최종 시각 테마와 애니메이션 품질은 core rules/authority 검증 이후 확정한다.
