# No Thanks! 게임 명세

> 이 문서는 No Thanks!가 어떤 게임이며 청파 같이에서 어떤 규칙과 구조로 구현할지 정의하는 게임별 설계 기준입니다.
> 실제 개발 진행 상황은 같은 디렉터리의 `DEVELOPMENT.md`에서 관리합니다.

## Game Overview

- 게임 식별자: `no-thanks`
- 디자이너: Thorsten Gimmler
- 지원 인원: 3–7명
- 목표 방식: 온라인 멀티플레이
- 핵심 진행: 현재 공개된 숫자 카드를 칩 1개를 내고 거절하거나, 카드와 그 위에 쌓인 칩을 함께 가져오는 선택을 반복합니다.
- 승리 조건: 마지막 카드가 가져가진 뒤 숫자 카드 점수에서 남은 칩을 뺀 최종 점수가 가장 낮은 플레이어가 승리합니다.
- 기본 카드 구성: 3–35의 숫자 카드 33장 중 무작위 9장을 제외하고 24장을 사용합니다.

## Rules and Sources

구현 기준은 다음 자료를 우선 사용합니다.

- AMIGO 공식 영문 규칙서: https://blog.amigo-spiele.de/content/ap/rule/02455-GB-AmigoRule.pdf
- AMIGO 공식 제품 페이지: https://www.amigo-spiele.de/no-thanks_2455_1247
- Board Game Arena 규칙 요약: https://en.doc.boardgamearena.com/Gamehelpnothanks

현재 첫 버전에 적용할 기본 규칙은 다음과 같습니다.

1. 3–5인은 각 11개, 6인은 각 9개, 7인은 각 7개의 칩으로 시작합니다.
2. 각 플레이어가 가진 칩 개수는 게임이 끝날 때까지 다른 플레이어에게 공개하지 않습니다.
3. 3–35의 숫자 카드 33장을 섞고 9장을 보지 않은 채 제외합니다. 남은 24장을 실제 게임에 사용합니다.
4. 현재 차례의 플레이어는 공개된 카드를 가져가거나 칩 1개를 내고 거절할 수 있습니다.
5. 카드를 거절하면 칩 1개가 현재 카드 위의 공개 칩 더미에 추가되고 차례는 다음 플레이어에게 넘어갑니다.
6. 칩이 하나도 없는 플레이어는 거절할 수 없으며 현재 카드를 반드시 가져가야 합니다.
7. 현재 카드를 가져가면 카드 위에 쌓인 모든 칩도 함께 가져갑니다.
8. 카드를 가져간 플레이어가 다음 카드를 공개하며 같은 플레이어가 다시 선택합니다. 즉 카드를 가져가는 행동 자체로는 차례가 끝나지 않습니다.
9. 마지막 카드를 누군가 가져가는 순간 게임이 끝납니다.
10. 단독 숫자 카드는 적힌 값만큼 점수가 됩니다.
11. 연속된 숫자 카드 묶음은 가장 낮은 숫자 하나만 점수에 포함합니다.
12. 최종 점수는 숫자 카드 점수 합에서 남은 칩 수를 뺀 값입니다.
13. 최종 점수가 가장 낮은 플레이어가 승리합니다.
14. 최저 점수가 동점이면 해당 플레이어들은 공동 승리합니다.

### 온라인 구현에 따른 조정

공식 규칙의 선 플레이어 결정은 "가장 최근에 No thanks!라고 말한 사람"이지만 온라인 환경에서는 적용하기 어렵기 때문에 청파 같이 첫 버전에서는 서버가 게임 시작 시 플레이 순서를 한 번 무작위로 확정합니다.

게임 중 다른 플레이어의 보유 칩 수는 공식 규칙대로 비공개로 유지합니다. 현재 공개 카드 위에 쌓인 칩 수와 각 플레이어가 획득한 숫자 카드는 모든 플레이어에게 공개합니다.

사용자용 규칙 안내는 로비와 실제 플레이 화면에서 다시 열 수 있는 모달로 제공합니다. 처음 플레이하는 사용자도 목표, 시작 칩 수, 9장 제외, 거절과 카드 가져오기, 칩이 없을 때의 강제 수락, 연속 숫자 점수 계산, 남은 칩 차감, 공동 승리를 이해할 수 있는 수준으로 설명합니다.

## Product Scope

### 이번 버전에 포함

- 3–7인 온라인 멀티플레이
- 기본 규칙
- 3–35 숫자 카드
- 무작위 9장 비공개 제외
- 인원별 초기 칩 수
- 플레이어별 보유 칩 수 비공개 처리
- 카드 거절
- 카드 가져오기
- 현재 카드 위의 공개 칩 더미
- 연속 숫자 묶음 점수 계산
- 최종 점수와 공동 승리
- 서버 기준 재접속 상태 복원
- 상세 게임 규칙 모달
- 진행 중 세션의 안전한 종료와 이탈 경로

### 후속 개발로 보류

- 2024년 AMIGO 재판에 포함된 22장 특수 카드 확장
- Board Game Arena의 Tactical Variant
- 플레이 기록과 전적
- 관전자 모드
- 인공지능 플레이어
- 별도 애니메이션과 사운드 완성도 개선
- 운영 환경 기능 활성화

### 첫 버전에서 제외

- 기존 Legacy 게임 구조 복사
- 클라이언트가 카드 섞기, 카드 뽑기, 점수 계산, 칩 사용 가능 여부를 최종 판단하는 구조
- 게임별 닉네임 입력 또는 변경 화면
- 다른 플레이어의 정확한 보유 칩 수 공개

## State Machine

### 방 진행 상태

- `ENTRY`: 승인회원 진입
- `WAITING`: 방 생성 또는 참가, 3–7명 구성, 준비 상태 관리
- `PLAYING`: 서버가 관리하는 게임 진행
- `GAME_OVER`: 마지막 카드 수락 또는 수동 종료로 게임 종료
- `POST_GAME`: 결과 확인 후 방 나가기 또는 재대결 흐름

현재 공통 방/로비 계약에서 사용하는 준비 완료와 방장 시작 흐름을 첫 버전에 그대로 사용합니다.

### 실제 게임 진행 상태

`PLAYING` 안에서는 불필요하게 세부 단계를 늘리지 않고 다음 상태를 유지합니다.

- `currentCard`: 현재 공개 카드
- `centerCounters`: 현재 카드 위에 쌓인 공개 칩 수
- `activePlayerId`: 현재 선택권을 가진 플레이어
- `deckRemaining`: 아직 공개되지 않은 카드 수

가능한 행동은 다음과 같습니다.

- `REFUSE_CARD`
  - 조건: 현재 차례의 플레이어이며 본인 칩이 1개 이상 남아 있어야 합니다.
  - 결과: 본인 칩 1개 감소, `centerCounters` 1개 증가, 차례가 다음 플레이어에게 넘어갑니다.
- `TAKE_CARD`
  - 조건: 현재 차례의 플레이어여야 합니다.
  - 결과: `currentCard`를 플레이어가 획득한 공개 카드에 추가하고 `centerCounters`만큼 본인 칩이 증가합니다.
  - 남은 카드가 있으면 서버가 다음 카드를 공개하며 현재 플레이어가 계속 선택합니다.
  - 마지막 카드였다면 최종 점수를 계산하고 `GAME_OVER`로 전환합니다.
- `END_GAME`
  - 조건: 방장만 요청할 수 있습니다.
  - 결과: 서버가 방장 여부와 현재 게임 상태를 검증한 뒤 전체 게임을 종료 상태로 전환합니다.

보유 칩이 0개라면 `REFUSE_CARD`는 사용할 수 없고 `TAKE_CARD`만 허용합니다.

## Domain Model

서버가 관리하는 게임 상태의 핵심 구조는 다음과 같습니다.

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

현재 사용자에게만 제공하는 비공개 상태는 다음과 같습니다.

```text
viewer
  playerId
  counters
```

서버 내부에서만 유지할 상태는 다음과 같습니다.

```text
drawDeck[]
playerCounters{}
excludedCards[] 또는 이에 준하는 비공개 상태
```

클라이언트는 앞으로 뽑힐 카드 순서나 제외된 카드 목록을 미리 알 수 없어야 합니다.

### 점수 계산

숫자 카드를 오름차순으로 정렬한 뒤 각 연속 숫자 묶음의 첫 숫자만 합산합니다.

예시는 다음과 같습니다.

```text
보유 카드 = [3, 10, 11, 12, 20]
카드 점수 = 3 + 10 + 20 = 33
남은 칩 = 5
최종 점수 = 28
```

동일한 최저 점수를 기록한 플레이어가 여러 명이면 공동 승리로 처리합니다.

## Platform Boundary

### SHARED

다음 책임은 기존 공통 게임 플랫폼을 재사용합니다.

- 게임 등록부
- 승인회원 접근 제어
- 공통 게임 화면 골격
- 방/로비 계약
- 버전과 중복 요청 방지 정보를 포함하는 행동 요청 규격
- 스냅샷 조정 기능
- 재접속 시 새로고침 처리
- 연결 상태와 플레이어 표시 상태
- 게임 초대 기능
- 데이터베이스 통합 검증 계약

게임 초대 기능은 실제 구현과 운영 검증이 끝난 뒤에만 활성화합니다.

### GAME-LOCAL

다음 책임은 No Thanks! 내부에 둡니다.

- 카드 구성과 섞기
- 9장 제외
- 인원별 초기 칩 수 계산
- 공개 카드와 카드 위 칩 더미
- 카드 거절과 가져오기 가능 여부
- 플레이어별 비공개 칩 상태
- 차례 이동
- 연속 숫자 묶음 점수 계산
- 최종 점수와 공동 승리
- No Thanks! 전용 카드와 획득 카드 화면
- 게임 고유 애니메이션과 사운드

현재 공통 계약을 변경하지 않고 구현하는 것을 기본으로 합니다.

## Authority and Persistence

첫 온라인 버전은 서버가 최종 판단하는 구조로 구현합니다.

서버가 최종 결정해야 하는 항목은 다음과 같습니다.

- 방 참가 여부와 준비 상태, 게임 시작 조건
- 플레이 순서
- 카드 섞기
- 제외되는 9장
- 카드가 공개되는 순서
- 현재 공개 카드
- 각 플레이어의 보유 칩 수
- 카드 거절 가능 여부
- 현재 카드 위의 칩 수
- 카드 가져오기 결과
- 다음 차례
- 최종 점수와 승자
- 방장 전용 수동 게임 종료

상태를 변경하는 요청은 기본적으로 다음 값을 사용합니다.

```text
room_id
expected_version
client_action_id
action payload
```

서버는 방 단위 잠금과 트랜잭션 안에서 방 참가 여부, 현재 차례, 게임 상태, `expected_version`, `client_action_id`를 검증한 뒤 상태를 한 번만 반영합니다.

### 스냅샷 공개 범위

모든 참여자에게 공개하는 상태:

- 방 정보와 버전, 진행 상태
- 플레이 순서
- 현재 차례의 플레이어
- 현재 공개 카드
- 현재 카드 위에 쌓인 칩 수
- 남은 카드 수
- 모든 플레이어가 획득한 공개 숫자 카드
- 게임 종료 후 최종 점수와 승자

현재 사용자에게만 공개하는 상태:

- 본인의 정확한 보유 칩 수

공개하지 않는 상태:

- 다른 플레이어의 정확한 보유 칩 수
- 아직 공개되지 않은 카드 순서
- 제외된 9장 목록

실시간 이벤트는 상태 변경을 알리는 신호로만 사용하고, 최종 상태는 서버의 권위 있는 스냅샷을 다시 조회해 확인합니다.

Room/Lobby foundation은 다음 game-local DB 객체를 사용합니다.

- `public.no_thanks_rooms`: room identity, host, waiting/playing/closed 상태, 최대 인원, authoritative `version`, 공개 `game_state`
- `public.no_thanks_room_players`: active membership, 사이트 프로필 `display_name`, seat, ready, 공개 획득 카드
- `public.no_thanks_room_actions`: `client_action_id` 기반 ready/start/gameplay replay와 payload conflict 검증
- `public.no_thanks_room_private_state`: 남은 draw deck, 제외된 9장, 플레이어별 비공개 칩 수
- public RPC: `no_thanks_create_room`, `no_thanks_join_room`, `no_thanks_get_my_active_room`, `no_thanks_get_lobby_snapshot`, `no_thanks_set_ready`, `no_thanks_leave_room`, `no_thanks_start_game`, `no_thanks_play_action`, `no_thanks_prepare_rematch`

브라우저는 위 테이블을 직접 수정하지 않고 승인회원 RPC만 호출합니다. 특히 `no_thanks_room_private_state`에는 authenticated select 권한을 주지 않으며 Realtime 구독 대상에서도 제외합니다. 공개 room/player 변경은 invalidation 신호로만 사용하고, 실제 화면 상태는 RPC snapshot을 다시 조회해 복원합니다.

게임 시작 시 서버가 3–7명 조건과 방장/ready 상태를 검증한 뒤 turn order와 3–35 카드 순서를 무작위로 확정합니다. 24장 중 첫 카드만 공개 `game_state`에 두고 남은 23장, 제외된 9장, 모든 플레이어의 칩 수는 private state에 유지합니다. snapshot은 호출자 자신의 칩 수만 `viewer.counters`로 합성하며 다른 플레이어의 칩 수와 미공개 카드 순서는 반환하지 않습니다.

게임 진행 중 `REFUSE_CARD`, `TAKE_CARD`, `END_GAME`은 game-local `no_thanks_play_action` RPC가 처리합니다. 모든 요청은 `expected_version`과 `client_action_id`를 받아 room/private state를 같은 트랜잭션에서 잠그고, 현재 차례·보유 칩·방장 권한·중복 요청 여부를 서버가 최종 판정합니다.

- `REFUSE_CARD`: 현재 플레이어만 가능하며 private counter를 1개 차감하고 공개 중앙 칩을 1개 늘린 뒤 다음 플레이어로 차례를 이동합니다.
- `TAKE_CARD`: 현재 플레이어가 공개 카드를 획득하고 중앙 칩을 private counter에 더합니다. 남은 private deck의 다음 카드만 공개하며 같은 플레이어가 계속 선택합니다.
- 마지막 카드 `TAKE_CARD`: 공개 획득 카드와 private counter로 최종 점수를 서버에서 계산하고 `GAME_OVER / LAST_CARD_TAKEN`과 공동 승자를 authoritative snapshot에 확정합니다.
- `END_GAME`: 방장만 가능하며 확인 UI를 거친 뒤 `GAME_OVER / HOST_TERMINATED`로 전환합니다. 수동 종료는 최종 점수와 승자를 계산하지 않습니다.
- `GAME_OVER` 이후에는 참가자가 결과를 확인한 뒤 안전하게 세션에서 이탈할 수 있습니다.

### Disconnect / Presence / Reconnect 정책

- 브라우저 종료, 네트워크 단절, 모바일 백그라운드 진입 같은 비정상 연결 끊김은 `leave`로 취급하지 않습니다.
- 연결이 끊겨도 room membership, host ownership, turn, 공개/비공개 game state는 서버에 그대로 유지합니다.
- 현재 차례 플레이어의 연결이 끊겨도 자동으로 turn을 넘기지 않습니다. 해당 사용자가 재접속하면 authoritative snapshot을 다시 받아 같은 turn에서 이어서 진행합니다.
- 방장의 연결이 끊겨도 다른 사용자에게 방장 권한을 자동 위임하지 않으며 게임도 자동 종료하지 않습니다.
- Supabase Realtime Presence는 roster의 온라인/오프라인 표시용 보조 신호로만 사용합니다. Presence 결과는 ready/start/action 권한이나 server-authoritative game rule 판정에 사용하지 않습니다.
- Presence payload에는 `userId`와 접속 시각만 포함하고, 닉네임·카드·칩·turn state 같은 게임 데이터는 넣지 않습니다.
- 동일 사용자가 여러 탭으로 접속할 수 있으므로 각 브라우저 client는 고유 Presence key를 사용하고 UI에서는 user id 기준으로 접속 여부를 합칩니다.
- `online`, `pageshow`, visible 복귀 시 최종 화면 상태는 Presence가 아니라 snapshot RPC 재조회로 복원합니다.

### 재대결 정책

재대결은 종료된 게임의 참가자와 좌석을 유지한 채 같은 room을 다시 WAITING 상태로 전환합니다.

- 방장만 `GAME_OVER` 결과 화면에서 재대결 준비를 요청할 수 있습니다.
- `no_thanks_prepare_rematch` RPC가 room lock, host, expected version, GAME_OVER 상태, 기존 turn order 참가자가 모두 active인지 서버에서 검증합니다.
- 재대결 준비 시 room id / room code / host / active membership / seat는 유지합니다.
- 모든 active player의 `is_ready`를 false로, 획득 카드를 빈 배열로 초기화합니다.
- 이전 게임의 private draw deck / excluded cards / counters row를 삭제하고 room `game_state`를 null로 초기화합니다.
- room은 `waiting`으로 전환되고 version은 증가합니다. 일반 플레이어가 다시 준비 완료하면 기존 `no_thanks_start_game` 계약으로 다음 게임을 시작합니다.
- 이전 게임의 action 기록은 삭제하지 않고 새 `client_action_id`를 사용해 다음 게임의 action과 구분합니다.
- 결과 화면에서 이미 나간 참가자가 있으면 같은 멤버 재대결을 허용하지 않고 새 방 생성을 안내합니다.

## UI / UX Direction

- WAITING과 PLAYING은 서로 다른 화면으로 교체하지 않고 동일한 대형 게임 보드 공간을 사용합니다.
- 데스크톱에서는 공통 사이트 여백만 남기고 게임 보드가 가로 폭 대부분을 사용하며, 보드와 하단 개인 패널이 핵심 플레이 화면의 중심이 됩니다.
- 보드 중앙에는 원형/타원형 테이블을 두고 현재 공개 카드, 남은 카드 더미, 중앙 칩을 배치합니다. 이 영역은 후속 카드/칩 이벤트 애니메이션의 무대로도 사용합니다.
- 3–7인 플레이어 좌석은 테이블 둘레 좌표를 동적으로 계산합니다. 서버의 실제 seat/turn order는 변경하지 않고 화면 배열만 회전하여 현재 viewer의 좌석을 항상 6시 방향에 고정합니다.
- 좌석 본체에는 닉네임과 현재 차례 여부만 기본 노출하며, current turn 강조로 좌석 크기나 좌표가 흔들리지 않게 합니다.
- WAITING에서도 방장은 기본 착석 상태로 표시하고 일반 플레이어는 ready 완료 시 좌석에 들어오는 짧은 착석 애니메이션을 사용합니다. reduced-motion 환경에서는 이를 최소화합니다.
- 기존 우측 대형 player roster 대신 보드 내부 우측 상단의 compact HUD에서 방 코드, 현재/최대 인원, ready, connection/reconnect, host 상태를 표시합니다.
- 보드 바로 아래에는 같은 폭의 개인 패널을 두고 본인의 정확한 칩 수, 시각적 칩 cluster, 본인 공개 획득 카드, 현재 가능한 핵심 액션을 한 곳에 모읍니다.
- 본인 카드가 많아져도 개인 패널 높이가 계속 커지지 않도록 카드를 수평으로 겹쳐 배치합니다. 카드 수가 많을수록 겹침 폭을 늘리되 왼쪽 상단 숫자는 계속 읽을 수 있게 합니다.
- 카드 색상은 숫자 구간에 따라 blue / teal / yellow / pink-red 계열을 사용하고 숫자는 왼쪽 상단과 오른쪽 하단에 표시합니다.
- 개인 패널 카드 hover/focus 시 해당 카드를 위로 올리고 확대하여 겹친 손패에서도 개별 카드를 확인할 수 있게 합니다.
- 플레이 핵심 액션은 테이블 오브젝트 자체에 연결합니다. 현재 공개 카드를 직접 클릭하면 `TAKE_CARD`, 오른쪽 공개 칩 더미 아래 `칩 1개 내기`를 누르면 `REFUSE_CARD`를 호출하며, 본인 turn/칩 보유 여부에 대한 기존 server-authoritative 가능 조건은 그대로 유지합니다.
- 게임 규칙, server authority, room version, client action id, 공개/비공개 state 경계, Realtime invalidation, Presence authorization, reconnect 경계는 유지합니다. 재대결 정책은 같은 참가자를 유지하는 same-room WAITING reset으로 명시 변경했습니다.
- 데스크톱 보드 높이는 별도 660px 상한 근거가 없어 800px 기준으로 확장하고 원형 테이블, 현재 카드, draw deck, 중앙 오브젝트도 같은 방향으로 확대합니다.
- 테이블 둘레 좌석은 닉네임 텍스트 대신 사이트 공개 프로필의 원형 avatar를 사용합니다. avatar 미설정 또는 signed URL 조회 실패 시 사이트 기본 사람 아이콘을 사용하고 닉네임은 HUD와 접근성 label에서 유지합니다.
- 중앙 칩이 0개일 때는 가짜 칩에 숫자 0을 표시하지 않고 `NO CHIP` 빈 상태로 표현합니다.
- 개인 패널의 칩 cluster는 정확한 보유 수와 별개로 최대 16개까지 시각 칩을 겹쳐 표시해 보유량 증가가 더 풍성하게 느껴지게 합니다.
- PLAYING 개인 패널에서는 핵심 액션 버튼을 제거하고 내 칩/보유 카드 중심의 2열 구조로 단순화합니다. 내 칩 열은 기존보다 크게 줄이고, 카드 영역은 그만큼 넓게 사용합니다.
- 보드 HUD의 Presence 비연결 상태 표시는 사용자 경험상 `자리이탈`로 표현합니다.
- 플레이어 avatar는 별도 원형 clipping frame 안에 넣어 프로필 이미지가 외곽 ring을 침범하지 않게 합니다.
- 실제 컴포넌트 감각에 맞춰 칩은 붉은 계열의 다중 ring/highlight 질감으로 표현하고 개인/중앙 칩 모두 동일한 시각 크기를 사용합니다.
- draw deck의 시각 카드 수는 실제 남은 장수를 그대로 복제하지 않고 1–7장의 단계형 depth로 축약합니다. 12–15장은 5장, 8–11장은 4장처럼 남은 카드가 줄수록 겹쳐 보이는 layer도 단계적으로 감소합니다.
- PLAYING 개인 패널의 내 칩 열은 192px 기준으로 조정하고, 게임 규칙/새로고침/게임 종료 같은 보조 액션은 페이지 하단 footer 대신 개인 패널 오른쪽 compact grid에 둡니다.
- PLAYING 개인 패널에서는 현재 차례 안내 문구를 별도로 반복하지 않고 보드 좌석과 상단 상태 메시지로만 전달합니다.
- 현재 차례 플레이어의 원형 avatar seat는 기본 좌석의 2배 크기로 확대해 turn 인지를 우선합니다.
- 원형 테이블과 좌석 배치는 HUD 보정 오프셋 없이 보드의 수평/수직 중앙을 기준으로 배치합니다. HUD와 실제 좌석 충돌이 확인되면 인원별 보정은 후속 시각 QA에서 다룹니다.
- 현재 차례 플레이어의 avatar seat는 기본 좌석보다 약 30%만 확대하고, 각 좌석 아래에는 사이트 프로필 닉네임을 compact label로 표시합니다.
- 좌석 중심은 원형 테이블 경계보다 소폭 바깥쪽에 두어 원형 테두리를 살짝 걸치면서 좌석 대부분이 테이블 밖에 보이도록 배치합니다.
- 개인 패널 오른쪽 보조 액션은 한 행에 한 버튼씩 세로로 배치합니다.
- 개인 패널/보유 카드 영역의 상하 여백을 소폭 늘리고, 보유 카드 hover/focus는 scale/z-index 우선 노출 대신 카드 자체의 `top`만 충분히 위로 이동해 좌상단 숫자가 드러나도록 합니다.
- 중앙 칩 cluster / 공개 개수 / refuse 버튼 사이의 세로 간격을 테이블 여유 공간에 맞춰 더 분리합니다.
- 게임 종료 화면에서 방장은 `재대결`을 눌러 같은 참가자·좌석을 유지한 WAITING 대기실로 전환할 수 있습니다.
- `REFUSE_CARD` 연출은 행동 플레이어 avatar 중심에서 작은 red chip이 실제 중앙 chip cluster 위치로 이동하도록 렌더 후 geometry를 측정합니다.
- snapshot 반영 직후 `busy=false`로 다시 렌더되는 같은-version 화면이 animation DOM을 제거하지 않도록 presentation effect를 최종 DOM의 motion 시작 시점까지 보존합니다.
- 중앙 chip count는 1개 이상일 때만 표시하며, 0개 상태는 `NO CHIP`과 refuse action만 남깁니다.
- next-card reveal은 draw deck의 visual layer를 건드리지 않고, The Game과 동일한 handoff 원칙을 사용합니다. 현재 렌더된 덱 최상단 카드 위치에서 별도의 fixed flight card를 생성해 경로 이동과 3D flip을 독립 수행하고, 도착 프레임에서 실제 current-card를 노출한 뒤 flight card를 짧게 settle/fade하여 끊김 없는 연결을 만듭니다. 덱 layer 수는 `getNoThanksDeckVisualCount()`의 남은 카드 단계 규칙으로만 줄어듭니다.
- refuse chip flight는 이동 중 거의 완전한 opacity를 유지하고 26px token / 약 780ms 경로로 조정해 출발 avatar부터 center pile까지 시선으로 추적할 수 있게 합니다.
- refuse 결과 snapshot이 먼저 도착해도 중앙 pile/count는 flight가 끝날 때까지 직전 개수를 유지하고, chip이 도착한 animation end 시점에만 최종 pile/count로 handoff합니다.
- PLAYING gameplay command는 중복 실행 방지를 위한 busy lock은 유지하되 RPC 전 busy-only 전체 render는 생략하고, authoritative result snapshot에 `busy=false`를 함께 적용해 성공 경로를 한 번의 전체 render로 줄입니다. 클릭한 카드/칩 버튼은 DOM에서 즉시 disabled 처리합니다.
- 다음 카드 공개는 `The Game`의 card flight 원리처럼 이동 경로와 3D front/back face를 분리하고, draw deck 위치에서 중앙까지 이동하며 `rotateY`로 뒷면에서 앞면으로 뒤집히는 연출을 사용합니다.
- 다른 플레이어 공개 카드 popover는 후속 Phase E로 유지합니다. Phase F 중 `REFUSE_CARD` 시 직전 active seat에서 중앙 칩 더미로 칩이 이동하는 연출과 `TAKE_CARD` 후 draw deck에서 새 공개 카드가 들어오는 연출은 구현했고, 카드/중앙 칩이 획득 플레이어 쪽으로 이동하는 추가 연출은 후속으로 남깁니다.
- 로비와 실제 플레이 화면 모두 `게임 규칙` 진입점을 유지합니다.
- 사이트 프로필 닉네임을 사용하며 게임 안에서 별도의 닉네임 입력이나 변경 기능을 제공하지 않습니다.
- 게임 전체 종료는 방장에게만 제공하며, 확인 화면을 거친 뒤 서버가 방장 권한을 다시 검증하고 최종 상태를 변경합니다.
- 현재 차례 플레이어가 오프라인이면 자동 진행하지 않고 재접속 후 이어지며, 방장이 오프라인이어도 자동 위임 또는 자동 종료가 발생하지 않습니다.
- 결과 화면의 재대결은 같은 room의 참가자·좌석을 유지하고 ready/game/private state만 초기화하는 정책을 사용합니다.

## Implementation Plan

1. 초기 설계
   - `GAME_SPEC.md`
   - `DEVELOPMENT.md`
2. 순수 규칙 엔진
   - 인원별 시작 칩 계산
   - 카드 거절 처리
   - 카드 가져오기 처리
   - 차례 이동
   - 연속 숫자 묶음 점수 계산
   - 공동 승리 처리
   - 게임 종료 전환
   - 단위 테스트
3. 승인회원 접근 제어와 공통 게임 화면의 최소 실행 코드
4. 방/로비 데이터베이스 및 RPC 기반 구성
   - 3–7명 참가
   - 준비 완료와 방장 시작
   - 서버에서 플레이 순서와 카드 순서 초기화
   - 데이터베이스 통합 검증 계약
5. 실제 방/로비 사용자 흐름
6. 서버 권위 게임 행동 RPC
   - 카드 거절
   - 카드 가져오기와 다음 카드 공개
   - 최종 점수 계산
7. 비공개 상태 보호, 재접속, 실시간 변경 감지
8. 상세 규칙 모달, 게임 종료, 게임 후 화면
9. 게임 초대
10. 운영 마이그레이션, 다중 사용자 점검, 기능 활성화
11. 출시 마무리와 게임 플랫폼 회고

## Validation Plan

- 게임 규칙 단위 테스트
  - 인원별 시작 칩 수
  - 칩이 0개일 때 카드 가져오기 강제
  - 거절 시 본인 칩 감소, 중앙 칩 증가, 다음 차례 이동
  - 카드 가져오기 시 중앙 칩 획득, 현재 플레이어 유지
  - 마지막 카드 획득 후 게임 종료
  - 연속 숫자 묶음 점수 계산
  - 떨어져 있는 숫자 묶음의 개별 점수 계산
  - 남은 칩 수 차감
  - 공동 승리
  - 입력 상태를 직접 변경하지 않는지 확인
- 게임 플랫폼 공통 계약과 관리 규칙 검증
- 데이터베이스 통합 계약의 필수 시나리오 10개 검증
- 다른 플레이어의 칩 수가 노출되지 않는지 확인
- 미공개 카드 순서와 제외 카드가 노출되지 않는지 확인
- 오래된 버전 요청, 같은 요청의 중복 전송, 동시 요청 충돌 검증
- 재접속 시 서버 상태 복원 검증
- disposable Supabase에서 3개 독립 인증 세션의 자연 종료까지 다중 클라이언트 검증
- disposable Supabase에서 7개 독립 인증 세션의 full refuse cycle, private counter 격리, take/reconnect 검증
- 실제 브라우저 Presence join/leave, host/active-player reconnect, 모바일 background/foreground는 release manual gate로 검증
- 모바일과 데스크톱에서 규칙 모달과 행동 버튼 배치 확인
- release gate 전체 상태는 `RELEASE_CHECKLIST.md`에서 추적

## Open Questions / Deferred

- 특수 카드 확장은 기본 규칙 첫 버전을 출시한 뒤 별도 단계에서 검토합니다.
- 명시적 leave는 WAITING 또는 GAME_OVER에서만 허용하고 PLAYING 중 비정상 disconnect는 membership을 유지합니다.
- 방장 비정상 disconnect는 권한 위임이나 자동 종료 없이 재접속을 기다리는 정책으로 확정했습니다. 명시적 `게임 종료`만 방장 전용 서버 액션으로 처리합니다.
- 재대결은 같은 room에서 기존 참가자·좌석을 유지한 채 WAITING 상태로 초기화하는 방식으로 확정했습니다.
- 운영 환경에서 초대 기능을 활성화하는 시점은 마이그레이션, 데이터베이스 통합 검증, 실제 멀티플레이 점검 이후로 미룹니다.
