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

### Rules Audit — 2026-09-20

정식 기본 규칙과 pure JS rules engine, 운영 Supabase의 `private.cant_stop_legal_pairings` / `private.cant_stop_commit_stop` 계산을 대조했다.

감사에서 확인한 엣지 케이스:

- runner 두 개 사용 중이고 남은 한 자리로 두 새 열 중 하나만 열 수 있을 때 두 single plan을 모두 허용
- runner 두 개 사용 중이며 기존 열 + 새 열을 함께 움직일 수 있으면 두 이동을 모두 강제
- runner 세 개를 이미 사용 중이면 새 열은 막고 기존 runner 이동만 허용
- 한 합이 claim된 열이면 다른 합만 합법적으로 움직일 수 있을 때 single move 허용
- 같은 합 두 번에서 정상까지 한 칸만 남았으면 가능한 한 칸만 이동
- runner가 이미 정상에 있어 더 못 움직여도 다른 합이 합법이면 다른 합 이동 허용
- 모든 가능한 합이 정상/runner 제한/claim으로 막히면 bust
- 정상 도달은 즉시 claim이 아니며 stop 전 bust 시 해당 정상 도달도 소멸
- 한 번의 stop에서 여러 열을 동시에 claim 가능
- 기존 두 claim + 두 동시 claim처럼 세 개를 넘어도 `claimedCount >= 3`으로 즉시 승리
- claim 전에는 서로 다른 플레이어의 permanent marker가 같은 칸에 공존 가능
- claim 시에만 다른 플레이어의 해당 열 progress 제거

감사 결과 core gameplay 규칙 차이는 발견되지 않았다. 정식 규칙서와 다른 의도적 digital adaptation은 **게임 시작 순서 결정**뿐이다. 규칙서는 선 플레이어를 별도 방식으로 정한 뒤 좌석 순서로 진행하지만, 청파 같이 버전은 온라인 좌석에 물리적 의미가 없으므로 서버가 전체 turn order를 한 번 무작위 확정하고 이후 그 순서를 순환한다. 이 차이는 pairing / runner / bust / stop / claim / 승리 규칙에는 영향을 주지 않는다.

사용자용 규칙은 `rulesHelp.js`의 상세 가이드를 로비와 실제 플레이 화면에서 modal로 제공한다. 처음 플레이하는 사용자가 외부 검색 없이 목표, 열 높이, 주사위 pairing, runner 제한, stop, bust, claim, 승리, 수동 종료까지 이해할 수 있는 수준을 유지한다.

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
- 로비/플레이 중 상세 게임 규칙 modal
- 방장 권한의 authoritative 수동 게임 종료
- 설산 등반 테마 보드, 2.5D 주사위 롤링, bust 미끄러짐 피드백

### Deferred

- 고급 통계/확률 힌트
- 관전자 모드
- turn timer
- AI/bot
- 변형 규칙
- 랭킹/전적 시스템
- 물리 엔진 기반 고급 3D 주사위/보드 연출

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

TURN_ROLL / PAIRING_SELECTION / PUSH_OR_STOP
└─ host manual end → GAME_OVER(endReason = MANUAL, winnerId = null)
```

- `TURN_ROLL`: 현재 플레이어만 roll intent를 보낼 수 있다.
- `PAIRING_SELECTION`: 서버가 주사위 결과에서 계산한 legal pairing과 그 pairing에 속한 legal move plan만 선택 가능하다.
- `PUSH_OR_STOP`: pairing 적용 이후 현재 플레이어가 다시 roll하거나 stop한다.
- `COMMIT_PROGRESS`: 임시 runner를 permanent progress로 확정하고 claim/win을 계산한다.
- `BUST`: 임시 진척을 폐기하고 permanent state는 유지한다.
- `GAME_OVER`: 일반 gameplay action을 더 받지 않는다. 승리 종료 또는 방장 수동 종료 뒤 leave/rematch lifecycle로 이동한다.

## Domain Model

- `columns`: number, height, claimedBy
- `players`: player id, 서버가 게임 시작 시 무작위로 확정한 turn order, column별 permanent progress, claimed columns
- `turn`: activePlayerId, 최대 세 개의 runner positions, latest dice, legal pairings + legal move plans, phase
- `game`: status, version, winnerId, endReason, endedById, turn index

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

- 방 생성/참가 시 표시할 플레이어 닉네임은 클라이언트 입력값이 아니라 사이트 `profiles.display_name`으로 확정
- 실제 주사위 네 개의 결과
- 가능한 pairing 목록과 선택 유효성
- runner 이동 가능 여부
- bust 여부
- stop commit
- column claim
- 승리
- 게임 시작 시 최초 turn order 무작위 확정
- turn 이동
- 방장 수동 게임 종료 권한과 terminal state
- room/game version 증가

클라이언트는 `roll_dice`, `choose_pairing`, `continue_turn`, `stop_turn`, `end_game` 같은 intent만 보낸다.

`roll_dice`는 클라이언트가 dice 값을 전달하지 않는다. 서버 RPC가 네 개의 d6를 생성하고 현재 authoritative `claimedColumns`, `runners`, `playerProgress`를 기준으로 legal pairing / legal move plan을 계산한다. legal pairing이 하나도 없으면 같은 transaction 안에서 bust 처리와 다음 turn 전환까지 수행한다.

`choose_pairing`은 클라이언트가 `sums`와 실제 적용할 `columns` plan을 선택해 보내되, 서버가 직전 roll snapshot에 저장한 `legalPairings[].plans`와 정확히 일치하는 선택만 허용한다. 서버는 선택된 plan을 다시 simulation해 runner 위치를 계산하고 `PUSH_OR_STOP`으로 전환한다. 같은 `clientActionId`를 다른 pairing payload로 재사용하면 replay로 인정하지 않고 conflict로 거부한다.

`continue_turn`은 `PUSH_OR_STOP`에서 현재 runner를 그대로 유지하고 `latestDice`와 `legalPairings`만 초기화해 같은 active player의 `TURN_ROLL`로 돌아간다.

`stop_turn`은 현재 runner 위치를 active player의 `playerProgress`에 commit한다. top에 도달한 runner는 해당 column을 claim하고 다른 플레이어의 같은 column progress를 삭제한다. active player의 claim이 세 개 이상이면 `GAME_OVER`와 `winnerId`를 기록하고, 아니면 runner/roll 상태를 비운 뒤 다음 player의 `TURN_ROLL`로 전환한다.

`end_game`은 진행 중 게임의 방장만 호출할 수 있다. 서버는 현재 room/version/member/host를 다시 검증하고 `GAME_OVER`, `winnerId = null`, `endReason = MANUAL`을 기록한다. 종료 뒤에는 기존 GAME_OVER leave/rematch 흐름을 그대로 재사용한다.

state-changing action은 공통 envelope의 `expectedVersion`과 `clientActionId`를 사용한다. 동일 action 재전송은 두 번 적용되지 않아야 하고 같은 version을 기준으로 충돌하는 action은 하나만 authoritative commit되어야 한다.

authoritative snapshot에는 보드, 모든 플레이어의 공개 진척, 현재 runner, 공개된 dice, 현재 phase, turn, claimed columns, winner와 `version`을 포함한다.

Can’t Stop에는 상대에게 숨겨야 하는 hand/role 같은 gameplay private state가 없다. DB/Test Contract의 private-state 시나리오는 "노출될 private gameplay state 자체가 없음"을 명시적으로 검증한다.

Realtime은 snapshot 교체 데이터가 아니라 invalidation 신호로만 사용한다.

클라이언트의 시각 연출은 authoritative snapshot을 변경하지 않는다. 주사위 roll이나 bust처럼 짧은 presentation이 필요한 경우 서버 응답 snapshot을 잠시 보류하고 기존 snapshot으로 애니메이션을 끝낸 뒤 최신 snapshot을 화면에 적용한다. 서버 결과 자체를 지연하거나 재계산하지 않으며, presentation 완료 후에는 항상 가장 최신 authoritative snapshot으로 수렴한다.

Room/Lobby foundation은 다음 game-local DB 객체를 사용한다.

- `public.cant_stop_rooms`: room identity, host, status, max players, authoritative `version`, game state
- `public.cant_stop_room_players`: room membership, seat, nickname, ready state
- `public.cant_stop_room_actions`: `client_action_id` 기반 lobby action replay/idempotency 기록
- public RPC: `cant_stop_create_room`, `cant_stop_join_room`, `cant_stop_join_room_by_invite`, `cant_stop_get_my_active_room`, `cant_stop_get_lobby_snapshot`, `cant_stop_set_ready`, `cant_stop_leave_room`, `cant_stop_start_game`, `cant_stop_roll_dice`, `cant_stop_choose_pairing`, `cant_stop_continue_turn`, `cant_stop_stop_turn`, `cant_stop_end_game`, `cant_stop_prepare_rematch`

브라우저에는 위 테이블의 직접 쓰기 권한을 주지 않는다. 승인회원 RPC가 권한, membership, host, phase, expected version을 검증하고 room row lock 안에서 변경한다. `set_ready`와 `start_game`은 `client_action_id`를 기록해 재전송 시 같은 authoritative snapshot을 반환한다.

Realtime은 `cant_stop_rooms`와 `cant_stop_room_players` 변경만 invalidation으로 구독하고, 실제 렌더 상태는 `cant_stop_get_lobby_snapshot` 또는 후속 authoritative snapshot RPC로 다시 읽는다.

## UI / UX Direction

- Common Game Shell로 제목, 방 정보, 연결 상태, roster, 공통 action 영역을 제공한다.
- 메인 영역은 2–12 열이 산 형태로 올라가는 Can't Stop 전용 board로 구성하고, 상용판 아트를 복제하지 않은 고유 설산/빙설 테마를 사용한다.
- permanent progress와 현재 턴의 temporary runner를 시각적으로 구분한다. 최대 4명의 player는 seat별 고유 고대비 색상을 사용해 검은 track 위에서도 말의 소유자를 빠르게 구분할 수 있게 한다.
- 현재 roll의 네 주사위와 가능한 pairing 선택지는 보드 위에 삽입하지 않고 오른쪽 sidebar의 전용 dice/route panel에서 함께 보여준다.
- dice/route panel은 게임 phase가 바뀌어도 높이를 유지해 board playfield가 위아래로 흔들리지 않게 한다. 플레이 중에는 별도 현재 턴 정보 카드를 두지 않고 이 패널이 sidebar 정보 영역을 주로 사용한다.
- 플레이어 roster는 대기 중의 준비 상태를 게임 시작 후 `게임 중`으로 전환하고, 연결이 끊기면 `연결 끊김`을 표시한다. active player는 고유 player color의 `현재 턴` badge와 card accent로 강조한다. 각 player card에는 현재 차지한 열 수를 `완주 N/3`으로 함께 표시한다.
- pairing 선택 시 실제 네 주사위가 어떤 두 쌍으로 묶여 각 열의 합을 만드는지 mini-dice → column number 형태로 설명하고, 서버가 허용한 legal move plan만 선택 버튼으로 노출한다.
- 주사위는 오른쪽 sidebar 하단의 전용 2.5D dice stage에서 굴러가는 움직임을 보여주며 최종 숫자는 authoritative server snapshot만 표시한다. 주사위 눈금은 폰트 glyph에 의존하지 않고 3×3 pip face로 그려 작은 화면에서도 값이 즉시 읽혀야 한다.
- 턴의 첫 roll에는 `주사위 굴리기` 하나만 노출한다. pairing 이동 이후 PUSH OR STOP에서는 같은 dice card 안에 왼쪽 `주사위 굴리기`, 오른쪽 `멈추기`를 나란히 배치한다. 어느 단계에서든 roll 요청이 진행 중이면 두 버튼을 숨기고 폭 전체의 비활성 `주사위 굴리는 중…` 버튼 하나만 보여 layout clipping을 방지한다. 계속 굴리기는 client에서 authoritative `continue_turn` 결과 version을 사용해 곧바로 `roll_dice`를 이어 호출하되 중간 TURN_ROLL snapshot은 화면에 노출하지 않아 한 번의 사용자 클릭/한 번의 roll presentation으로 진행한다.
- dice roll에는 짧은 clatter 효과음을, bust에는 눈보라/바람 효과음을 Web Audio로 제공한다. 효과음 재생 실패는 게임 진행을 막지 않는다.
- legal pairing이 하나만 존재해도 자동 적용하지 않고 active player가 이동 plan을 명시적으로 선택한다.
- temporary runner와 permanent progress는 서로 다른 marker 스타일로 표시하고 claimed column은 완주자를 함께 표시한다.
- `한 번 더 굴리기`와 `여기서 멈추기`를 turn의 핵심 선택으로 강조한다.
- bust 시 runner가 산 정상 기준 좌우 경사 방향으로 미끄러지고, 말 주변의 눈가루와 짧은 눈사태/powder 연출을 함께 보여줘 설산 등반 실패의 재미를 강화한다. 눈보라 전경 입자는 선형 streak가 아니라 크기가 다른 둥근 눈덩이/눈가루 particle로 표현한다. 눈/runner 연출 자체는 짧게 끝내되 결과 안내 카드는 보드 중앙에서 약 4초 유지해 사용자가 내용을 읽을 시간을 보장한다. actor의 local RPC 응답과 다른 player의 Realtime refresh 모두 동일한 bust presentation을 끝까지 보여준 뒤 다음 snapshot으로 전환한다.
- 로비/플레이 중 언제든 상세 규칙 modal을 열 수 있다.
- 진행 중 방장은 확인 dialog를 거쳐 전체 게임을 수동 종료할 수 있고, 종료 결과는 모든 클라이언트의 authoritative GAME_OVER snapshot으로 동기화한다.
- 모바일에서는 11개 열 전체 판독성을 우선하고 과도한 3D/카메라 조작은 초기 버전에서 사용하지 않는다.
- 원본 상용판의 보드/말 그래픽은 복제하지 않고 청파 같이 고유 시각 디자인을 사용한다.
- online entry는 방 만들기 또는 6자리 코드 참가로 시작하며, waiting room에서 준비 상태와 방장 시작 조건을 명확히 보여준다.
- entry lobby에는 닉네임 입력/변경 UI를 두지 않는다. 로그인한 승인회원의 사이트 프로필 닉네임을 그대로 사용하며 닉네임 변경과 중복 검사는 마이페이지의 공통 프로필 흐름에서만 수행한다.
- entry 화면은 정상 연결 상태 카드를 별도로 노출하지 않고 새 방 만들기 / 코드 참가 두 행동에 집중한다. 규칙 보기는 오른쪽 온라인 플레이 안내 카드 하단에 둔다.
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
- 현재 설산/2.5D 주사위/bust 연출은 첫 폴리싱 기준이며 실제 멀티브라우저 playtest 후 세부 속도·크기·강도를 조정한다.


- 정상적인 connected gameplay에서는 상단 연결 상태 카드를 숨겨 플레이 화면을 단순화한다. reconnect/error 상태에서는 해당 배너를 다시 노출해 필요한 연결 정보만 보여준다.
- gameplay phase card는 eyebrow와 굵은 핵심 제목만 표시하고 그 아래의 보조 설명 문구는 사용하지 않는다. ROLL / CHOOSE / PUSH OR STOP 모두 동일한 정보 밀도를 유지한다.
- PUSH OR STOP phase는 선택 자체가 명확하므로 구현 설명 문구를 추가하지 않고 행동 제목과 실제 버튼에 집중한다.
- bust 결과 안내 카드는 보드 중앙에서 설산/빙설 palette의 옅은 gradient surface, 좌측 accent, 절제된 shadow를 사용하고 텍스트는 좌측 정렬해 읽기 쉽도록 한다.
