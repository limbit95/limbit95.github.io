# 스플렌더 웹게임 기술 설계서 v0.2

> 기준 문서: `docs/splendor-game/requirements.md` v0.2  
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
│  ├─ Ruleset
│  ├─ Card/Noble Catalog
│  ├─ Card/Noble Game Instance
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
10. 카드 정의와 게임 중 카드 위치/소유 상태는 분리한다.
11. 게임 상태 전체를 단일 JSON 문서로 저장하지 않는다.
12. 보석처럼 하나의 논리 묶음인 값만 JSONB를 사용한다.

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

카드의 실제 숫자 데이터는 `constants.js`나 `rules.js`에 하드코딩하지 않는다.

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

- 현재 ruleset 식별 정보
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

# H. 데이터 모델 설계 원칙

## H.1 정규화 + JSONB 혼합

전체 게임을 하나의 `state JSONB` 컬럼에 저장하지 않는다.

관계와 상태 전이는 일반 컬럼/테이블로 유지하고, 보석 색 묶음만 JSONB로 저장한다.

JSONB 사용 대상:

```text
card cost       = white/blue/green/red/black
noble requirement = white/blue/green/red/black
bank tokens     = white/blue/green/red/black/gold
player tokens   = white/blue/green/red/black/gold
player bonuses  = white/blue/green/red/black
```

예시:

```json
{
  "white": 1,
  "blue": 0,
  "green": 2,
  "red": 1,
  "black": 0,
  "gold": 1
}
```

장점:

- JavaScript 객체와 구조가 자연스럽게 대응된다.
- 색상 단위 계산 함수를 재사용하기 쉽다.
- 테이블마다 색별 컬럼이 반복되는 것을 줄인다.
- 카드/플레이어/은행의 보석 데이터를 동일한 검증 방식으로 처리할 수 있다.

JSONB 내부 key는 서버에서 허용 목록과 0 이상의 정수 여부를 검증한다.

---

# I. DB 개념 모델

정확한 SQL 타입, 제약조건, 인덱스는 구현 단계에서 확정한다.

## I.1 `splendor_rulesets`

카드와 귀족 데이터 세트의 버전을 정의한다.

개념 필드:

- id
- ruleset key
- version
- name
- status
- created at

상태 후보:

```text
draft
active
retired
```

원칙:

- 새 게임은 `active` 룰셋 중 지정된 기본 룰셋을 사용한다.
- 게임 시작 시 `splendor_games.ruleset_id`에 고정한다.
- 실제 게임에서 사용된 룰셋의 수치 데이터는 직접 수정하지 않는다.
- 변경이 필요하면 새 ruleset을 만든다.

개발 초기에는 테스트 전용 룰셋을 둔다.

## I.2 `splendor_card_catalog`

개발 카드의 정적 정의.

개념 필드:

- id
- ruleset id
- card key
- tier
- bonus color
- prestige
- cost JSONB
- enabled

예시 비용:

```json
{
  "white": 0,
  "blue": 2,
  "green": 1,
  "red": 0,
  "black": 3
}
```

제약 개념:

- tier는 1~3
- bonus color는 일반 보석 5색 중 하나
- prestige는 0 이상의 정수
- cost에는 일반 보석 5색만 존재
- `(ruleset_id, card_key)` unique

## I.3 `splendor_noble_catalog`

귀족 조건 정적 정의.

개념 필드:

- id
- ruleset id
- noble key
- prestige
- requirements JSONB
- enabled

requirements에는 일반 보석 5색만 존재한다.

`(ruleset_id, noble_key)` unique를 둔다.

## I.4 `splendor_rooms`

역할:

- 방 코드
- 방장
- 방 상태
- 현재 게임
- 만료
- version

상태:

```text
waiting
playing
finished
closed
```

## I.5 `splendor_room_players`

역할:

- auth user와 게임 player 연결
- nickname
- player key
- 준비 상태
- room membership
- 접속/이탈 상태

## I.6 `splendor_games`

게임 전체의 권위 상태.

개념 필드:

- id
- room id
- ruleset id
- status
- current seat
- turn number
- turn phase
- bank_tokens JSONB
- final round triggered
- final round trigger seat
- winner resolved
- version
- started at
- finished at

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

`bank_tokens` 예시:

```json
{
  "white": 4,
  "blue": 4,
  "green": 4,
  "red": 4,
  "black": 4,
  "gold": 5
}
```

## I.7 `splendor_game_players`

게임 시작 순간의 좌석과 플레이 상태를 고정한다.

개념 필드:

- id
- game id
- room player id
- seat no
- score
- tokens JSONB
- bonuses JSONB
- purchased card count
- reserved card count
- status / connection hint

게임 도중 방 멤버 정보가 변해도 게임 좌석 순서는 이 테이블을 기준으로 유지한다.

`score`, `bonuses`, `purchased_card_count`, `reserved_card_count`는 snapshot과 규칙 판정을 빠르게 하기 위한 누적 상태다.

이 값들의 근거 데이터는 `splendor_game_cards`, `splendor_game_nobles`이며 관련 값은 반드시 같은 RPC 트랜잭션 안에서 변경한다.

## I.8 `splendor_game_cards`

한 게임에서 카드 한 장의 위치와 소유 상태를 관리한다.

카드 정의 자체는 저장하지 않고 `catalog_card_id`로 카탈로그를 참조한다.

상태:

```text
deck
face_up
reserved
purchased
```

개념 필드:

- id
- game id
- catalog card id
- tier
- shuffled order
- board slot
- state
- reserved player id
- purchased player id
- reserved from hidden deck
- state changed at

이 구조를 사용하면 공개 카드 구매/예약 후 다음 카드 보충과 비공개 예약을 동일한 모델로 처리할 수 있다.

카탈로그는 "무슨 카드인가"를 정의하고 게임 카드는 "이번 게임에서 어디에 있는가"를 정의한다.

## I.9 `splendor_game_nobles`

한 게임에 선택된 귀족 인스턴스.

상태:

```text
available
claimed
```

개념 필드:

- id
- game id
- noble catalog id
- state
- claimed player id
- claimed at

## I.10 `splendor_action_log`

게임의 최근 행동과 mutation idempotency를 보조한다.

개념 필드:

- id
- game id
- turn no
- player id
- action type
- public payload JSONB
- client action id
- created at

비공개 예약 카드 정보는 public payload에 넣지 않는다.

`client_action_id`는 같은 요청이 네트워크 재시도로 중복 처리되는 것을 방지하는 데 사용한다.

---

# J. 테이블 관계 요약

```text
splendor_rulesets
   ├─< splendor_card_catalog
   └─< splendor_noble_catalog

splendor_rooms
   ├─< splendor_room_players
   └─< splendor_games >─ splendor_rulesets
          ├─< splendor_game_players
          ├─< splendor_game_cards >─ splendor_card_catalog
          ├─< splendor_game_nobles >─ splendor_noble_catalog
          └─< splendor_action_log
```

핵심 데이터 계층:

```text
RULESET
   ↓
CATALOG
   ↓
GAME INSTANCE
   ↓
PLAYER / BOARD STATE
```

---

# K. 카드 데이터 버전 정책

카드/귀족 데이터는 DB seed로 투입하되 한 번에 최종 데이터를 확정하지 않는다.

개발 순서:

```text
TEST RULESET
  ↓
규칙 엔진 검증
  ↓
멀티플레이/재접속 검증
  ↓
FINAL RULESET 결정
```

초기 테스트 세트 권장 규모:

- Tier 1: 약 10~15장
- Tier 2: 약 10~15장
- Tier 3: 약 10~15장
- Noble: 약 5~8개

위 수량은 기능 테스트를 위한 권장 범위이며 최종 공개 게임 구성과 무관하다.

최종 데이터 세트가 확정되어도 JavaScript 구조나 게임 상태 테이블은 변경하지 않는다.

---

# L. 게임 시작 트랜잭션

방장이 게임 시작을 요청하면 한 RPC 안에서 다음을 처리한다.

```text
1. Auth / host 검증
2. room waiting 상태 확인
3. active player 2~4명 확인
4. 모든 플레이어 ready 확인
5. 사용할 active ruleset 확정
6. game 생성 + ruleset_id 고정
7. 좌석 순서 랜덤 결정
8. 인원별 bank_tokens 세팅
9. 해당 ruleset card catalog에서 게임 카드 인스턴스 생성
10. tier별 shuffle order 생성
11. 각 tier 4장 face_up 배치
12. 해당 ruleset noble catalog에서 인원수 + 1개 선택
13. game_players 초기화
14. room → playing
15. game → active
16. version 증가
17. snapshot 반환
```

카드/귀족 선택 및 셔플은 클라이언트가 아닌 서버 트랜잭션 안에서 처리한다.

---

# M. 턴 상태 머신

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

# N. 예정 Command RPC

명칭은 구현 시 조정 가능하다.

## N.1 Room

- `splendor_create_room`
- `splendor_join_room`
- `splendor_set_ready`
- `splendor_leave_room`
- `splendor_start_game`

## N.2 Turn Action

- `splendor_take_distinct_tokens`
- `splendor_take_double_token`
- `splendor_reserve_faceup_card`
- `splendor_reserve_hidden_card`
- `splendor_purchase_card`

## N.3 Turn Follow-up

- `splendor_return_excess_tokens`
- `splendor_choose_noble`

## N.4 Lifecycle

- `splendor_rematch`
- `splendor_close_room`

모든 mutation RPC의 공통 입력 후보:

- room/game identifier
- player key 또는 서버에서 확인 가능한 player identifier
- expected version
- client action id

---

# O. RPC 공통 검증 순서

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

# P. 토큰 행동 서버 규칙

## P.1 서로 다른 보석

서버는 다음을 검증한다.

- 금색 제외
- 색 중복 없음
- 요청 수량 1~3
- 공급처 존재 여부
- 가능한 색이 3개 이상인데 임의로 1~2개만 선택하는 정책 여부

기본 구현은 공급처에 획득 가능한 색이 부족한 경우에만 3개 미만 획득을 허용한다.

## P.2 같은 색 2개

- 금색 제외
- 행동 시작 전 공급처 4개 이상
- 정확히 2개 획득

## P.3 10개 제한

행동 결과 토큰 총합이 10을 초과하면 바로 다음 플레이어로 턴을 넘기지 않고 `discard_required` 상태로 전환한다.

---

# Q. 카드 구매 계산

서버 구매 판정은 카탈로그의 `cost JSONB`와 플레이어의 `bonuses JSONB`를 색별로 비교한다.

```text
required(color) = max(card_cost(color) - player_bonus(color), 0)
```

플레이어 일반 토큰으로 먼저 충당한 뒤 전체 부족분의 합이 gold 토큰 이하이면 구매 가능하다.

클라이언트 `rules.js`에서도 동일한 계산을 수행해 UX를 제공할 수 있으나 최종 구매 성공 여부는 RPC 결과만 신뢰한다.

구매 시 원자 처리:

```text
1. 카드 인스턴스 구매 가능 여부 확인
2. catalog에서 cost/bonus/prestige 조회
3. 플레이어 tokens 차감
4. 부족분 gold 차감
5. 사용 토큰 bank_tokens 반환
6. game_card → purchased
7. player bonuses 증가
8. player score 증가
9. purchased_card_count 증가
10. reserved 카드였다면 reserved_card_count 감소
11. 공개 카드였다면 동일 tier 다음 카드 보충
12. 귀족/종료 후처리
13. game version 증가
```

`game_cards`와 `game_players`의 누적 상태는 반드시 같은 트랜잭션에서 갱신한다.

---

# R. 카드 예약 처리

## R.1 공개 카드 예약

```text
face_up card
   ↓
reserved + owner 설정
   ↓
reserved_card_count +1
   ↓
남은 gold가 있으면 player tokens +1 / bank -1
   ↓
동일 tier 다음 카드 face_up
```

## R.2 비공개 덱 예약

```text
tier 선택
   ↓
해당 tier의 다음 deck 카드 instance 선택
   ↓
reserved + owner 설정
   ↓
예약자 snapshot에만 catalog detail 포함
   ↓
다른 플레이어 snapshot에서는 상세 redaction
```

예약 카드가 이미 3장이면 두 예약 RPC 모두 거부한다.

---

# S. 귀족 판정

턴 후처리마다 서버가 남아 있는 귀족 instance와 해당 catalog requirements를 조회해 조건을 계산한다.

- 0개: 다음 단계 진행
- 1개: 자동 획득
- 2개 이상: `noble_choice_required`

귀족 획득 후:

- noble instance → claimed
- claimed player 기록
- player score 증가
- 다시 점수/종료 조건 확인

한 턴에 최대 1개만 획득한다.

---

# T. 종료 및 순위 판정

게임 시작 시 첫 플레이어가 seat 0이 되도록 좌석 순서를 정한다.

```text
seat 0 → seat 1 → ... → seat N-1
```

15점 이상 도달 시:

- 현재 게임을 `final_round` 상태로 표시
- trigger seat 기록
- 현재 seat가 마지막 seat가 아니면 남은 플레이어 턴 진행
- seat N-1의 턴이 끝나면 게임 종료

최종 정렬:

```text
1. score DESC
2. purchased_card_count ASC
3. 동일하면 공동 우승
```

---

# U. Realtime 전략

방마다 하나의 private realtime channel을 사용한다.

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

현재 행동을 수행한 클라이언트는 RPC 성공 응답 snapshot을 즉시 반영하고, 이후 realtime 이벤트가 와도 version 비교 후 불필요한 중복 렌더링을 줄인다.

---

# V. Version / Idempotency

`splendor_games.version`을 게임 상태 변경마다 증가시킨다.

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

# W. 접근 제어 및 비공개 정보

DB RLS와 RPC 모두 참가자 권한을 확인한다.

원칙:

- 해당 room의 active member만 snapshot 조회 가능
- 현재 turn owner만 게임 행동 가능
- 방장만 게임 시작 가능
- 상대 예약 카드 상세 조회 불가
- catalog 자체는 정적 데이터지만 현재 비공개 예약 instance와 catalog의 연결 관계는 상대에게 노출하지 않음
- 클라이언트에서 game/game_player/game_card를 직접 update하지 않음

게임 snapshot RPC가 비공개 정보의 최종 필터 역할을 한다.

---

# X. 재접속 전략

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

# Y. 오류 모델

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
INVALID_RULESET
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

# Z. 모바일/PC UI 방향

## Z.1 Desktop

```text
상단: 상대 플레이어 / 현재 턴
중앙: 귀족 + 카드 3개 tier
하단: 보석 공급처 + 내 상태
우측 또는 하단: 예약 카드 / 행동 로그
```

## Z.2 Mobile

추천 우선순위:

1. 현재 턴
2. 중앙 카드
3. 보석 공급처
4. 내 보너스/토큰
5. 내 예약 카드
6. 상대 요약

카드 상세 비용은 tap으로 확대하는 방식을 검토한다.

---

# AA. 테스트 구조 계획

## AA.1 데이터 모델 테스트

- ruleset별 카드/귀족 분리
- 비활성 ruleset 신규 게임 사용 차단
- 게임 시작 후 ruleset 변경 불가
- cost JSONB 5색 key 검증
- player tokens JSONB 6색 key 검증
- bonus JSONB 5색 key 검증
- catalog와 game instance 연결 무결성
- 다른 ruleset catalog를 잘못 참조하지 않는지 검증

## AA.2 규칙 시나리오

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

## AA.3 트랜잭션 일관성 테스트

카드 구매 중 오류가 발생했을 때 다음 상태가 일부만 반영되지 않아야 한다.

```text
player tokens
bank tokens
card state
player bonus
player score
new face-up card
game version
```

## AA.4 배포 전 문서

구현 후 `docs/splendor-game/`에 다음 문서를 추가할 수 있다.

```text
deployment-checklist.md
final-qa-checklist.md
```

---

# AB. v0.2 확정 결정사항

이번 설계 단계에서 다음을 구현 기준으로 확정한다.

| 항목 | 결정 |
|---|---|
| 카드/귀족 저장 위치 | Supabase DB catalog |
| 데이터 버전 관리 | `splendor_rulesets` |
| 카드 정의와 게임 상태 | catalog / game instance 분리 |
| 카드 비용 | JSONB 5색 묶음 |
| 귀족 요구 조건 | JSONB 5색 묶음 |
| 중앙 보석 | `bank_tokens` JSONB |
| 플레이어 토큰 | `tokens` JSONB |
| 플레이어 영구 보너스 | `bonuses` JSONB |
| 점수/턴/카드 위치 등 | 정규화 컬럼/테이블 |
| 전체 게임 단일 JSON 저장 | 사용하지 않음 |
| 초기 카드 데이터 | 테스트 ruleset 우선 |
| 최종 공개 카드 데이터 | 기능 완성 후 별도 확정 |

이 구조를 기준으로 이후 SQL schema와 RPC를 설계한다.
