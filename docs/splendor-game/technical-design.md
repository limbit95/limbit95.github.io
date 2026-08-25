# 스플렌더 웹게임 기술 설계서 v0.1

> 기준 문서: `docs/splendor-game/requirements.md` v0.1  
> 상태: 구현 전 구조 설계 초안  
> 대상 환경: GitHub Pages + Vanilla JavaScript ES Modules + Supabase  
> 주의: 본 문서는 향후 생성할 소스와 DB의 구조만 정의하며 실제 HTML/CSS/JS/SQL 파일은 아직 생성하지 않는다.

---

# A. 기존 저장소 기준 설계 방향

## A.1 기존 패턴

현재 저장소는 루트 정적 사이트와 `liar-game/` 독립 게임 디렉터리가 분리되어 있다.

스플렌더도 같은 방식으로 루트 SPA에 직접 결합하지 않고 물리 경로를 가진 독립 웹앱으로 둔다.

예정 URL:

```text
./splendor-game/
```

기존 사이트에서는 향후 게임 목록 영역에 스플렌더 진입 링크만 추가한다.

## A.2 재사용 범위

| 대상 | 방침 |
|---|---|
| Supabase 프로젝트 | 재사용 |
| Supabase Auth 세션 | 재사용 |
| URL / publishable key | 재사용 |
| 기존 SPA Router | 사용하지 않음 |
| 기존 공통 UI | 직접 의존하지 않음 |
| 라이어게임 JS | 직접 import하지 않음 |
| 라이어게임 DB | 사용하지 않음 |
| 라이어게임 설계 패턴 | 참고 및 동일 원칙 적용 |

게임 간 코드 공유가 필요해지면 추후 `games/shared/` 같은 공통 계층을 별도 검토하며, v1에서는 성급하게 공통화를 진행하지 않는다.

---

# B. 전체 아키텍처

```text
GitHub Pages
└─ /splendor-game/
   ├─ View / DOM Rendering
   ├─ Client State Store
   ├─ Session Guard
   ├─ Query API
   ├─ Command RPC Gateway
   ├─ Client-side Rule Hints
   └─ Realtime Coordinator
             │
             ▼
Supabase
├─ Auth
├─ PostgreSQL
│  ├─ Room / Player
│  ├─ Game State
│  ├─ Card/Noble Catalog
│  ├─ Card/Noble Instances
│  └─ Action Log
├─ Transactional RPC
└─ Realtime invalidation
```

핵심 원칙:

1. DB가 게임 상태의 source of truth다.
2. 브라우저 상태는 화면 렌더링과 사용자 입력을 위한 캐시다.
3. 게임 규칙 최종 검증은 RPC에서 수행한다.
4. Realtime은 최신 상태가 변경됐다는 신호로 사용한다.
5. Realtime 이벤트를 받은 클라이언트는 서버 snapshot을 다시 조회한다.
6. 여러 행을 동시에 변경하는 게임 행동은 한 트랜잭션에서 처리한다.
7. 각 mutation은 현재 턴, 상태, version을 다시 검증한다.
8. 비공개 예약 카드 정보는 서버 응답 단계에서 권한별로 분리한다.
9. 새로고침 후에도 서버 snapshot으로 복구 가능해야 한다.

---

# C. 향후 최종 소스 디렉터리 구조

아래 구조를 구현 기준안으로 사용한다.

```text
splendor-game/
├─ index.html
├─ css/
│  ├─ reset.css
│  ├─ tokens.css
│  └─ style.css
├─ assets/
│  ├─ icons/
│  └─ images/
└─ js/
   ├─ app.js
   ├─ api.js
   ├─ commands.js
   ├─ config.js
   ├─ constants.js
   ├─ realtime.js
   ├─ rules.js
   ├─ selectors.js
   ├─ sessionGuard.js
   ├─ storage.js
   ├─ store.js
   ├─ supabase.js
   ├─ motion.js
   └─ views/
      ├─ access.js
      ├─ nickname.js
      ├─ lobby.js
      ├─ room.js
      ├─ board.js
      ├─ card.js
      ├─ tokenBank.js
      ├─ playerPanel.js
      ├─ reservePanel.js
      ├─ discardDialog.js
      ├─ nobleChoiceDialog.js
      ├─ reconnect.js
      └─ result.js
```

DB 산출물은 향후 다음 경계로 구성한다.

```text
supabase/splendor-game/
├─ schema.sql
├─ functions/
├─ policies.sql
├─ realtime.sql
├─ seed.sql
└─ migrations/
```

현재 단계에서는 위 실제 디렉터리와 소스 파일을 만들지 않고 문서에서만 구조를 확정한다.

---

# D. JavaScript 모듈 책임

| 모듈 | 책임 |
|---|---|
| `app.js` | 앱 boot, 현재 snapshot에 따른 view 결정, 전역 이벤트 조정 |
| `config.js` | Supabase 공개 설정 및 앱 설정 |
| `supabase.js` | 스플렌더 전용 Supabase client 생성 |
| `sessionGuard.js` | 최초 진입 및 mutation 직전 Auth 세션 검증 |
| `storage.js` | player key, nickname, current room 복구 힌트 |
| `store.js` | 현재 snapshot, UI pending 상태, connection 상태 관리 |
| `api.js` | room/game snapshot 및 개인 비공개 정보 조회 |
| `commands.js` | 게임 mutation RPC 호출과 중복 클릭 방지 |
| `realtime.js` | room 전용 realtime channel 구독과 snapshot refresh 조정 |
| `constants.js` | game status, turn phase, token color, storage key, UI 문구 |
| `rules.js` | 클라이언트 UX용 사전 계산 및 규칙 안내. 최종 판정은 하지 않음 |
| `selectors.js` | snapshot에서 화면용 파생 데이터 계산 |
| `motion.js` | 카드/턴/결과 전환 애니메이션과 reduced-motion 처리 |
| `views/*` | 상태별 DOM 렌더링과 화면 단위 이벤트 연결 |

---

# E. View 구조

## E.1 `access.js`

- 로그인 세션 확인 중
- 로그인 필요
- 세션 만료

## E.2 `nickname.js`

- 게임 닉네임 입력/변경

## E.3 `lobby.js`

- 방 만들기
- 방 코드 입력
- 최근 방 복구

## E.4 `room.js`

- 방 코드
- 방장 표시
- 플레이어 2~4명
- 준비 상태
- 게임 시작
- 방 나가기

## E.5 `board.js`

게임 진행 화면 전체 레이아웃을 담당한다.

내부 영역:

```text
[귀족]

[3단계 카드 4장]
[2단계 카드 4장]
[1단계 카드 4장]

[보석 공급처]

[상대 플레이어 요약]

[내 플레이어 패널]
[내 예약 카드]

[현재 턴 / 행동 안내]
```

## E.6 `card.js`

개발 카드 1장을 렌더링한다.

표시 요소:

- 레벨
- 보너스 색
- 명성 점수
- 구매 비용
- 현재 플레이어 기준 실질 필요 비용
- 구매 가능 상태

공개 카드와 자신의 예약 카드에서 재사용한다.

## E.7 `tokenBank.js`

- 공급처 토큰 수량
- 선택 상태
- 현재 가능한 토큰 획득 행동 안내

## E.8 `playerPanel.js`

- 닉네임
- 점수
- 토큰 수
- 색상별 영구 보너스
- 구매 카드 수
- 예약 카드 수
- 현재 턴 표시

## E.9 `discardDialog.js`

토큰이 10개를 초과한 경우 반납 토큰 선택을 강제한다.

## E.10 `nobleChoiceDialog.js`

동시에 여러 귀족 조건을 충족했을 때 1명을 선택한다.

## E.11 `result.js`

- 최종 순위
- 점수
- 구매 카드 수
- 공동 우승 여부
- 재경기/방 종료 선택

---

# F. 클라이언트 상태 구조

클라이언트 Store는 다음 개념을 가진다.

```text
session
identity
room
players
game
board
selfPrivate
ui
connection
```

세부 의미:

| 상태 | 설명 |
|---|---|
| `session` | Supabase Auth 세션 |
| `identity` | player key, nickname |
| `room` | 방 상태와 방장 |
| `players` | 플레이어 공개 상태 |
| `game` | 턴, 단계, 점수, 게임 종료 상태 |
| `board` | 보석 공급처, 공개 카드, 공개 귀족 |
| `selfPrivate` | 자신의 예약 카드 상세 |
| `ui` | 선택 중 토큰, modal, loading, pending action |
| `connection` | realtime 연결 및 snapshot 갱신 상태 |

`store.js`에는 DB의 완전한 복사본을 영구 저장하지 않는다.

---

# G. 서버 Snapshot 설계

클라이언트는 여러 테이블을 직접 조립하기보다 서버가 제공하는 snapshot RPC를 중심으로 동작한다.

예정 조회 API 개념:

- `splendor_get_lobby_snapshot`
- `splendor_get_room_snapshot`
- `splendor_get_game_snapshot`

게임 snapshot은 호출자의 권한에 따라 데이터를 필터링한다.

공개 가능:

- 공개 개발 카드
- 공개 귀족
- 보석 공급량
- 플레이어 점수
- 플레이어 토큰 수
- 영구 보너스
- 예약 카드 장수
- 구매 카드 수
- 현재 턴
- 최근 행동 로그

자신에게만 공개:

- 자신의 예약 카드 상세 정보

다른 플레이어에게 비공개:

- 비공개 덱에서 예약한 카드의 카드 ID/비용/점수/색

---

# H. DB 개념 모델

정확한 컬럼과 SQL은 구현 단계에서 확정한다.

## H.1 `splendor_rooms`

역할:

- 방 코드
- 방장
- 방 상태
- 현재 게임
- 만료
- version

주요 상태:

```text
waiting
playing
finished
closed
```

## H.2 `splendor_room_players`

역할:

- auth user와 게임 player 연결
- nickname
- player key
- 준비 상태
- room membership
- 접속/이탈 상태

## H.3 `splendor_games`

게임 전체의 권위 상태.

예정 개념 필드:

- room id
- status
- current player/seat
- turn number
- turn phase
- version
- bank white/blue/green/red/black/gold
- final round triggered
- winner resolved
- started/finished time

게임 상태:

```text
setup
active
final_round
finished
aborted
```

턴 단계:

```text
action
discard_required
noble_choice_required
```

## H.4 `splendor_game_players`

게임 시작 순간의 좌석과 플레이 상태를 고정한다.

예정 개념 필드:

- game id
- player id
- seat no
- score
- token white/blue/green/red/black/gold
- bonus white/blue/green/red/black
- purchased card count
- reserved card count
- connection hint

게임 도중 방 멤버 정보가 변해도 게임 좌석 순서는 이 테이블을 기준으로 유지한다.

## H.5 `splendor_card_catalog`

개발 카드의 정적 정의.

개념 필드:

- card key
- tier
- bonus color
- prestige
- cost white/blue/green/red/black
- enabled

공식 카드 수치 사용 여부가 최종 확정된 후 seed 데이터를 작성한다.

## H.6 `splendor_noble_catalog`

귀족 조건 정적 정의.

개념 필드:

- noble key
- prestige
- required bonus white/blue/green/red/black
- enabled

## H.7 `splendor_game_cards`

한 게임에서 카드 한 장의 위치와 소유 상태를 관리한다.

개념 상태:

```text
deck
face_up
reserved
purchased
```

주요 정보:

- game id
- catalog card id
- tier
- shuffled order
- board slot
- state
- reserved player id
- purchased player id
- reserved from hidden deck 여부
- state changed at

이 구조를 사용하면 공개 카드 구매/예약 후 다음 카드 보충과 비공개 예약을 같은 모델로 처리할 수 있다.

## H.8 `splendor_game_nobles`

한 게임에 선택된 귀족 인스턴스.

상태:

```text
available
claimed
```

주요 정보:

- game id
- noble catalog id
- claimed player id
- claimed at

## H.9 `splendor_action_log`

게임의 최근 행동과 mutation idempotency를 보조한다.

개념 필드:

- game id
- turn no
- player id
- action type
- public payload
- client action id
- created at

비공개 예약 카드 정보는 public payload에 넣지 않는다.

`client_action_id`는 같은 요청이 네트워크 재시도로 중복 처리되는 것을 방지하는 데 사용한다.

---

# I. 게임 시작 트랜잭션

방장이 게임 시작을 요청하면 한 RPC 안에서 다음을 처리한다.

```text
1. Auth / host 검증
2. room waiting 상태 확인
3. active player 2~4명 확인
4. 모든 플레이어 ready 확인
5. game 생성
6. 좌석 순서 랜덤 결정
7. 인원별 보석 공급량 세팅
8. card catalog에서 게임 카드 인스턴스 생성
9. tier별 shuffle order 생성
10. 각 tier 4장 face_up 배치
11. 인원수 + 1개의 귀족 선택
12. game_players 초기화
13. room → playing
14. game → active
15. version 증가
16. snapshot 반환
```

카드/귀족 선택 및 셔플은 클라이언트가 아닌 서버 트랜잭션 안에서 처리한다.

---

# J. 턴 상태 머신

기본 턴 흐름:

```text
ACTION
  │
  ├─ 토큰 획득
  ├─ 카드 예약
  └─ 카드 구매
        │
        ▼
토큰 > 10 ?
  │ YES
  ▼
DISCARD_REQUIRED
  │
  └─ 필요한 만큼 반납
        │
        ▼
귀족 조건 확인
  │
  ├─ 0명 → 턴 종료
  ├─ 1명 → 자동 획득 → 턴 종료
  └─ 2명 이상
         ▼
NOBLE_CHOICE_REQUIRED
         │
         └─ 1명 선택
              ▼
            턴 종료
```

턴 종료 시:

1. 점수 재계산/검증
2. 15점 종료 트리거 확인
3. final round 여부 확인
4. 게임 종료 또는 다음 seat로 이동
5. version 증가
6. Realtime invalidation 발생

---

# K. 예정 Command RPC

명칭은 구현 시 조정 가능하다.

## K.1 Room

- `splendor_create_room`
- `splendor_join_room`
- `splendor_set_ready`
- `splendor_leave_room`
- `splendor_start_game`

## K.2 Turn Action

- `splendor_take_distinct_tokens`
- `splendor_take_double_token`
- `splendor_reserve_faceup_card`
- `splendor_reserve_hidden_card`
- `splendor_purchase_card`

## K.3 Turn Follow-up

- `splendor_return_excess_tokens`
- `splendor_choose_noble`

## K.4 Lifecycle

- `splendor_rematch`
- `splendor_close_room`

모든 mutation RPC의 공통 입력 후보:

- room/game identifier
- player key 또는 서버에서 확인 가능한 player identifier
- expected version
- client action id

---

# L. RPC 공통 검증 순서

모든 게임 행동은 최소한 다음 순서로 검증한다.

```text
Auth session
    ↓
room membership
    ↓
game active 여부
    ↓
player가 현재 turn owner인지
    ↓
turn phase가 해당 행동을 허용하는지
    ↓
expected version 일치
    ↓
행동별 규칙 검증
    ↓
DB 변경
    ↓
후처리
    ↓
version 증가
    ↓
commit
```

UI가 버튼을 비활성화했더라도 서버 검증을 생략하지 않는다.

---

# M. 토큰 행동 서버 규칙

## M.1 서로 다른 보석

서버는 다음을 검증한다.

- 금색 제외
- 색 중복 없음
- 요청 수량 1~3
- 공급처 존재 여부
- 가능한 색이 3개 이상인데 임의로 1~2개만 선택하는 정책 여부

기본 구현은 공식 규칙에 맞춰 공급처에 획득 가능한 색이 부족한 경우에만 3개 미만 획득을 허용하는 방향으로 한다.

## M.2 같은 색 2개

- 금색 제외
- 행동 시작 전 공급처 4개 이상
- 정확히 2개 획득

## M.3 10개 제한

행동 결과 토큰 총합이 10을 초과하면 바로 다음 플레이어로 턴을 넘기지 않고 `discard_required` 상태로 전환한다.

---

# N. 카드 구매 계산

서버 구매 판정은 색별로 다음 개념을 사용한다.

```text
required(color) = max(card_cost(color) - player_bonus(color), 0)
```

플레이어 일반 토큰으로 먼저 충당한 뒤 전체 부족분의 합이 gold 토큰 이하이면 구매 가능하다.

클라이언트 `rules.js`에서도 동일한 계산을 수행해 UX를 제공할 수 있으나 최종 구매 성공 여부는 RPC 결과만 신뢰한다.

구매 시 원자 처리:

```text
1. 카드 구매 가능 여부 확인
2. 일반 토큰 차감
3. 부족분 gold 차감
4. 사용 토큰 bank 반환
5. card → purchased
6. player bonus 증가
7. prestige 증가
8. purchased card count 증가
9. 공개 카드였다면 동일 tier 다음 카드 보충
10. 귀족/종료 후처리
```

---

# O. 카드 예약 처리

## O.1 공개 카드 예약

```text
face_up card
   ↓
reserved + owner 설정
   ↓
예약 장수 +1
   ↓
남은 gold가 있으면 1개 지급
   ↓
동일 tier 다음 카드 face_up
```

## O.2 비공개 덱 예약

```text
tier 선택
   ↓
해당 tier의 다음 deck 카드 선택
   ↓
reserved + owner 설정
   ↓
다른 플레이어 snapshot에서는 card detail redaction
```

예약 카드가 이미 3장이면 두 예약 RPC 모두 거부한다.

---

# P. 귀족 판정

턴 후처리마다 서버가 남아 있는 귀족 중 조건 충족 여부를 계산한다.

- 0개: 다음 단계 진행
- 1개: 자동 획득
- 2개 이상: `noble_choice_required`

귀족 획득 후:

- noble → claimed
- player score 증가
- 다시 점수/종료 조건 확인

한 턴에 최대 1개만 획득한다.

---

# Q. 종료 및 순위 판정

게임 시작 시 첫 플레이어가 seat 0이 되도록 좌석 순서를 정한다.

따라서 한 라운드는 항상 다음 구조다.

```text
seat 0 → seat 1 → ... → seat N-1
```

15점 이상 도달 시:

- 현재 게임을 `final_round` 상태로 표시
- 현재 seat가 마지막 seat가 아니면 남은 플레이어 턴 진행
- seat N-1의 턴이 끝나면 게임 종료

최종 정렬:

```text
1. prestige DESC
2. purchased development count ASC
3. 동일하면 공동 우승
```

---

# R. Realtime 전략

방마다 하나의 private realtime channel을 사용한다.

예정 개념:

```text
splendor-room:{room_id}
```

Realtime payload 자체를 권위 상태로 사용하지 않는다.

```text
DB mutation commit
    ↓
realtime invalidation
    ↓
각 client debounce
    ↓
get_game_snapshot()
    ↓
store replace
    ↓
rerender
```

이 방식은 이벤트 유실이나 순서 변경이 발생해도 최종 DB 상태로 복구하기 쉽다.

현재 행동을 수행한 클라이언트는 RPC 성공 응답 snapshot을 즉시 반영하고, 이후 realtime 이벤트가 와도 version 비교 후 불필요한 중복 렌더링을 줄인다.

---

# S. Version / Idempotency

`splendor_games.version`을 상태 변경마다 증가시킨다.

클라이언트 command는 자신이 본 `expected_version`을 전달한다.

서버 version이 다르면 다음과 같이 처리한다.

```text
STATE_CHANGED
최신 게임 상태를 다시 불러와 주세요.
```

또한 각 command는 `client_action_id`를 전달해 동일 요청 재전송을 구분한다.

목표:

- 더블 클릭 방지
- 느린 네트워크 중복 제출 방지
- 서로 다른 탭에서 같은 계정으로 조작 시 충돌 방지
- 이미 사라진 카드 구매 방지

---

# T. 접근 제어 및 비공개 정보

DB RLS와 RPC 모두 참가자 권한을 확인한다.

원칙:

- 해당 room의 active member만 snapshot 조회 가능
- 현재 turn owner만 게임 행동 가능
- 방장만 게임 시작 가능
- 상대 예약 카드 상세 조회 불가
- catalog를 직접 알아도 현재 비공개 예약 카드와 연결되는 instance 정보는 알 수 없어야 함
- 클라이언트에서 game table을 직접 update하지 않음

게임 snapshot RPC가 비공개 정보의 최종 필터 역할을 한다.

---

# U. 재접속 전략

페이지 진입 순서:

```text
Auth 확인
  ↓
localStorage identity 확인
  ↓
current room 힌트 확인
  ↓
서버 membership 조회
  ↓
유효하면 room/game snapshot 복구
  ↓
realtime 재구독
```

localStorage room 정보가 오래됐거나 서버 membership과 다르면 서버를 기준으로 정리한다.

---

# V. 오류 모델

RPC 오류 코드는 화면 문구와 분리해 관리한다.

예정 오류 코드:

```text
AUTH_REQUIRED
ROOM_NOT_FOUND
ROOM_FULL
ROOM_ALREADY_STARTED
PLAYER_NOT_MEMBER
NOT_HOST
NOT_YOUR_TURN
INVALID_TURN_PHASE
STATE_CHANGED
INVALID_TOKEN_SELECTION
TOKEN_SUPPLY_SHORTAGE
DOUBLE_TOKEN_NOT_ALLOWED
TOKEN_DISCARD_REQUIRED
RESERVE_LIMIT_REACHED
CARD_NOT_AVAILABLE
CARD_NOT_OWNED
INSUFFICIENT_RESOURCES
NOBLE_CHOICE_REQUIRED
GAME_FINISHED
```

`constants.js`에서 사용자용 한국어 메시지로 매핑한다.

---

# W. 모바일/PC UI 방향

## W.1 Desktop

한 화면에서 중앙 게임판과 플레이어 정보를 최대한 함께 확인한다.

추천 레이아웃:

```text
상단: 상대 플레이어 / 현재 턴
중앙: 귀족 + 카드 3개 tier
하단: 보석 공급처 + 내 상태
우측 또는 하단: 예약 카드 / 행동 로그
```

## W.2 Mobile

모든 정보를 한 번에 축소하지 않는다.

추천 우선순위:

1. 현재 턴
2. 중앙 카드
3. 보석 공급처
4. 내 보너스/토큰
5. 내 예약 카드
6. 상대 요약

카드 상세 비용은 tap으로 확대하는 방식을 검토한다.

---

# X. 테스트 구조 계획

별도 테스트 프레임워크를 도입하지 않는 현재 프로젝트 특성을 고려해 다음 방식으로 검증한다.

## X.1 규칙 시나리오

문서 기반 수동 테스트 케이스를 먼저 작성한다.

필수 항목:

- 2/3/4인 초기 토큰 수
- 공개 카드 4장 유지
- 같은 색 2개 조건
- 일반 보석 3색 선택
- 금 토큰 예약 지급
- 예약 3장 제한
- 비공개 예약 정보 은닉
- 카드 할인 계산
- 금 토큰 부족분 대체
- 무료 카드 구매
- 토큰 10개 반납
- 귀족 1개 자동 획득
- 귀족 복수 선택
- 15점 종료 라운드
- 동점 판정
- 동시에 같은 카드 클릭
- 새로고침 복구

## X.2 배포 전 문서

구현 후 `docs/splendor-game/`에 다음 문서를 추가할 수 있다.

```text
deployment-checklist.md
final-qa-checklist.md
```

현재 단계에서는 생성하지 않는다.

---

# Y. 구현 순서 제안

## Phase 0 — 현재 단계

- 요구사항 정의
- 기술 구조 정의
- 사용자 검토

## Phase 1 — DB 설계

- catalog 모델
- room/player/game 모델
- RLS
- snapshot RPC 설계
- mutation RPC 설계

## Phase 2 — 게임 Core

- 방 생성/참가
- 게임 초기화
- 턴 상태 머신
- 토큰 행동
- 예약/구매
- 귀족
- 종료 판정

## Phase 3 — Frontend

- 접근/로비/방
- 보드 UI
- 카드 UI
- 행동 선택
- 반납/귀족 dialog

## Phase 4 — Realtime / Recovery

- realtime invalidation
- version conflict
- reconnect
- refresh recovery

## Phase 5 — QA

- 2인/3인/4인 시나리오
- 동시성
- 모바일
- 세션 만료
- 게임 종료

---

# Z. 현재 설계에서 사용자 검토가 필요한 결정

실제 구현 전에 아래 항목을 확정한다.

| 항목 | 현재 제안 |
|---|---|
| 앱 경로 | `splendor-game/` |
| 문서 경로 | `docs/splendor-game/` |
| DB 경로 | `supabase/splendor-game/` |
| 지원 인원 | 2~4명 |
| 인증 | 기존 Supabase Auth 세션 |
| 상태 권위 | Supabase DB |
| 실시간 | Realtime → snapshot 재조회 |
| 턴 동시성 | game version + client action id |
| 카드 예약 | 공개/비공개 모두 지원 |
| 첫 플레이어 | 랜덤 |
| 게임 종료 | 15점 이상 → 현재 라운드 완료 |
| 동점 | 카드 구매 수가 적은 사람 우선, 이후 공동 승리 |
| 확장판 | v1 제외 |
| 공식 이미지 | 사용하지 않는 방향 |
| 카드 데이터 | 최종 검토 후 결정 |
| 게임 중 포기 | 추후 정책 확정 |

---

# 변경 승인 원칙

본 설계 문서 및 향후 소스는 작업 브랜치에서 먼저 작성한다.

변경 완료 후 다음 정보를 사용자에게 보고한다.

- 생성/수정 파일
- 핵심 변경 내용
- 기술적 결정
- 미확정 사항
- main 반영 시 영향 범위

사용자가 **"반영하자"**라고 명시적으로 승인하기 전에는 `main` 브랜치에 머지하지 않는다.
