# 라이어게임 웹앱 기술 설계서

> 기준 문서: `docs/liar-game/requirements.md` v1.0<br>
> 대상 환경: GitHub Pages, Vanilla JavaScript ES Modules, Supabase Auth/PostgreSQL/Realtime<br>
> 범위: 구현 전 기술 설계. 이 문서는 실행 가능한 SQL이나 기능 코드를 포함하지 않는다.

## A. 현재 저장소 분석

### A.1 저장소와 배포 구조

- 루트 `index.html`이 기존 사이트의 진입점인 정적 GitHub Pages 애플리케이션이다.
- npm 빌드 없이 HTML, CSS, Vanilla JavaScript ES Modules로 실행된다.
- Supabase JavaScript Client v2를 CDN 전역 스크립트로 로드한 뒤 `js/app.js`를 실행한다.
- `.nojekyll`이 있으며 기존 앱은 실제 URL path가 아닌 `#/...` 해시 라우팅을 사용한다.
- 현재 로컬에는 `work` 브랜치만 있고 remote 및 `main` ref가 없어, 원격의 최신 `main` 여부는 확인할 수 없다. 본 설계는 현재 HEAD를 기준으로 한다.

따라서 라이어게임은 실제 정적 경로인 `liar-game/index.html`을 별도 진입점으로 두고, 기존 hash router에 라우트를 등록하지 않는다. GitHub Project Pages까지 고려하면 링크는 `/liar-game/` 절대경로보다 `./liar-game/` 상대경로가 안전하다.

### A.2 기존 Supabase 설정

- `js/config.js`가 Supabase URL과 publishable key를 ES Module 상수로 보관한다.
- `js/supabaseClient.js`가 `window.supabase.createClient`로 singleton을 만든다.
- Auth 옵션은 `persistSession`, `autoRefreshToken`, `detectSessionInUrl`, PKCE를 사용한다.
- 브라우저에는 publishable/anon key만 사용하며 `service_role`은 사용하지 않는다.

라이어게임은 URL/key를 루트 설정에서 import하되 클라이언트 인스턴스는 자체 `supabase.js`에서 만든다. 이렇게 하면 같은 origin의 기존 Auth storage를 공유하면서도 기존 앱 생명주기와 결합하지 않는다.

### A.3 기존 Auth와 로그인

- `js/auth.js`는 최초 `getSession()` 후 `onAuthStateChange`를 한 번 등록한다.
- `TOKEN_REFRESHED`, `SIGNED_OUT`, `SIGNED_IN`, `USER_UPDATED`를 처리한다.
- 기존 일반 페이지는 Auth 세션뿐 아니라 `profiles.status`가 `approved`인지도 확인한다.
- 로그인 화면은 물리 `/login`이 아니라 루트 SPA의 `#/login`이다.

라이어게임의 접근 조건은 **유효한 Supabase Auth 로그인 세션 존재**로 확정한다. `profiles.status='approved'`를 비롯한 기존 `profiles` 데이터는 조회하거나 접근 조건으로 사용하지 않는다. 세션이 없으면 접근을 차단하고, 세션이 있으면 라이어게임에 접근할 수 있다.

### A.4 Router, App, 메뉴

- `js/router.js`는 `window.location.hash`만 해석한다.
- `js/app.js`가 기존 라우트와 공통 shell을 조립한다.
- 데스크톱 메뉴는 `js/components/header.js`, 모바일 메뉴는 `js/components/bottomNav.js`에 직접 정의돼 있다.
- 별도 사이드 메뉴 설정 파일은 없다.

`liar-game/index.html`에서 기존 `app.js`, router, CSS, UI, API를 로드하지 않으면 기존 앱이 독립 디렉터리에 직접 영향을 주지 않는다. 공유되는 것은 같은 origin의 Auth/localStorage와 같은 Supabase 프로젝트뿐이다.

### A.5 재사용 범위

| 대상 | 방침 | 이유 |
|---|---|---|
| Supabase URL/key | 재사용 | 설정 불일치 방지 |
| Supabase Auth storage/session | 재사용 | 요구사항의 접근 기반 |
| 루트 `supabaseClient.js` | 직접 재사용하지 않음 | 독립적인 생명주기 필요 |
| `auth.js` | 직접 의존하지 않음 | profiles 및 기존 이벤트와 결합 |
| `router.js`, `app.js` | 사용하지 않음 | 독립 경로 앱 |
| 기존 CSS/UI/API | 사용하지 않음 | 스타일·데이터 경계 유지 |
| 기존 profiles/게시판/활동 데이터 | 사용하지 않음 | 기존 서비스 보호 |

## B. 전체 아키텍처

```text
GitHub Pages /liar-game/
├─ DOM View 계층
├─ Client State Store
├─ Auth/Session Guard
├─ Query Repository
├─ Command/RPC Gateway
└─ Realtime Coordinator
          │
          ▼
Supabase
├─ Auth
├─ PostgreSQL liar_* tables
├─ Transactional RPC functions
└─ Realtime postgres_changes
```

핵심 원칙은 다음과 같다.

1. DB가 권위 있는 상태(source of truth)다.
2. localStorage는 식별과 복구 힌트일 뿐 게임 상태를 저장하지 않는다.
3. Realtime event는 정합성의 근거가 아니라 snapshot 재조회 신호로 사용한다.
4. 여러 행을 바꾸는 작업은 RPC 한 번으로 원자 처리한다.
5. 모든 상태 전이는 현재 상태와 version을 확인하는 compare-and-set 방식으로 수행한다.
6. 만료와 순번은 브라우저 시간이 아니라 DB `now()`를 기준으로 한다.
7. UI 사전 검증과 별개로 DB가 host, participant, 상태, 만료를 다시 검증한다.

원자 RPC가 필요한 작업은 방 생성/참가, game/round 시작, ballot 교체, 투표 마감과 판정, 재투표 생성, 추측 제출, 다음 라운드, 새 게임, 방장 위임, 강제 종료다.

## C. 최종 디렉터리 및 파일 구조

```text
liar-game/
├─ index.html
├─ css/
│  ├─ reset.css
│  ├─ tokens.css
│  └─ style.css
├─ js/
│  ├─ config.js
│  ├─ supabase.js
│  ├─ constants.js
│  ├─ app.js
│  ├─ sessionGuard.js
│  ├─ storage.js
│  ├─ store.js
│  ├─ api.js
│  ├─ commands.js
│  ├─ recovery.js
│  ├─ realtime.js
│  ├─ stateMachine.js
│  ├─ utils.js
│  ├─ views/
│  │  ├─ access.js
│  │  ├─ nickname.js
│  │  ├─ lobby.js
│  │  ├─ room.js
│  │  ├─ setup.js
│  │  ├─ roleReveal.js
│  │  ├─ speaking.js
│  │  ├─ vote.js
│  │  ├─ guess.js
│  │  └─ result.js
│  └─ components/
│     ├─ dialog.js
│     ├─ toast.js
│     ├─ playerList.js
│     └─ roomHeader.js
└─ assets/
```

구현 단계의 DB 산출물은 `supabase/liar-game/` 아래 schema, functions, RLS, Realtime, word seed 단위로 나누는 것을 권장한다. 이 설계서는 실행 가능한 최종 SQL을 작성하지 않는다.

## D. 각 모듈 책임

| 모듈 | 책임 |
|---|---|
| `index.html` | 앱 mount, metadata, CSS, Supabase CDN, app module 로드 |
| `config.js` | 루트 Supabase 공개 설정 재사용, site root 계산 |
| `supabase.js` | 라이어게임 전용 Supabase singleton |
| `constants.js` | 상태, 역할, 승자, 난이도, storage key |
| `app.js` | boot, 최상위 화면 전환, cleanup |
| `sessionGuard.js` | 최초/조작 직전 session 검사, Auth 이벤트 처리 |
| `storage.js` | player key, nickname, current room 검증·저장 |
| `store.js` | auth/room/game/round/snapshot/UI 메모리 상태 |
| `api.js` | SELECT 전용 snapshot/recovery 조회 |
| `commands.js` | mutation RPC wrapper와 중복 제출 차단 |
| `recovery.js` | localStorage에서 현재 화면 복구 |
| `realtime.js` | 방/라운드 channel 생명주기와 재조회 debounce |
| `stateMachine.js` | 상태별 허용 action과 view 결정 |
| `utils.js` | code/nickname/문자열 정규화, 오류 mapping |
| `views/*` | 상태별 DOM 렌더링과 사용자 이벤트 전달 |
| `components/*` | 데이터 접근 없는 재사용 DOM 구성요소 |

## E. 최종 DB 설계

### E.1 공통 규칙

- PK는 `uuid DEFAULT gen_random_uuid()`를 사용한다.
- 시각은 `timestamptz`, DB `now()`를 사용한다.
- `updated_at`은 trigger 또는 RPC에서 갱신한다.
- player의 방 퇴장은 DELETE 대신 `membership_status='left'`로 보존한다.
- 다중 라이어는 `liar_round_players.role`로만 관리하고 중복 `liar_round_liars` 테이블은 만들지 않는다.
- 결과 전용 테이블은 만들지 않고 기존 정규화 테이블과 조회 RPC/view로 구성한다.
- 다중 선택 투표의 원자적 수정과 재투표 이력을 위해 `liar_vote_stages`, `liar_ballots` 두 보조 테이블을 추가한다.

### E.2 `liar_rooms`

| 컬럼 | 형식 및 제약 |
|---|---|
| `id` | `uuid`, PK, NOT NULL, UUID default |
| `room_code` | `varchar(6)`, NOT NULL, UNIQUE, 대문자·숫자 6자 CHECK |
| `status` | `text`, NOT NULL DEFAULT `active`, CHECK `active/expired` |
| `host_player_id` | `uuid`, nullable FK `liar_players.id`, ON DELETE SET NULL |
| `current_game_id` | `uuid`, nullable FK games, ON DELETE SET NULL |
| `current_round_id` | `uuid`, nullable FK rounds, ON DELETE SET NULL |
| `last_activity_at` | `timestamptz`, NOT NULL DEFAULT now() |
| `expires_at` | `timestamptz`, NOT NULL DEFAULT now()+24h |
| `expired_at` | `timestamptz`, nullable |
| `created_at`, `updated_at` | `timestamptz`, NOT NULL DEFAULT now() |
| `version` | `bigint`, NOT NULL DEFAULT 0, CHECK >= 0 |

인덱스는 `(status, expires_at)`, `(last_activity_at)`을 둔다. `host_player_key` 대신 FK가 가능한 player ID를 쓴다. 방 생성 RPC가 room → host player → room host 갱신을 한 트랜잭션으로 수행한다.

### E.3 `liar_players`

| 컬럼 | 형식 및 제약 |
|---|---|
| `id` | `uuid`, PK |
| `room_id` | `uuid`, NOT NULL FK rooms, ON DELETE CASCADE |
| `auth_user_id` | `uuid`, NOT NULL FK auth.users, ON DELETE CASCADE |
| `player_key` | `uuid`, NOT NULL |
| `nickname` | `varchar(20)`, NOT NULL, trim 길이 1~20 CHECK |
| `ready` | `boolean`, NOT NULL DEFAULT false |
| `membership_status` | `text`, NOT NULL DEFAULT active, CHECK active/left |
| `joined_during_round_id` | `uuid`, nullable FK rounds, ON DELETE SET NULL |
| `joined_at`, `updated_at` | `timestamptz`, NOT NULL DEFAULT now() |
| `left_at` | `timestamptz`, nullable |

UNIQUE `(room_id, player_key)`, 권장 UNIQUE `(room_id, auth_user_id)`. 인덱스는 `(room_id, membership_status)`, `(auth_user_id, membership_status)`, `(player_key)`다. 또한 `auth_user_id WHERE membership_status='active'` 부분 UNIQUE 인덱스로 한 Auth 계정에 active membership을 하나만 허용한다. `create_room`/`join_room` RPC는 기존 active membership을 재검증한다. 그 membership의 room이 유효하면 새 방 생성/참가를 거부하지만, `now() >= expires_at`이거나 `status='expired'`이면 기존 membership을 `membership_status='left'`, `ready=false`, `left_at=now()`로 갱신한 뒤 새 room 생성/참가를 허용한다.

`spectator`, `round_participant` boolean은 저장하지 않는다. 현재 round에 `liar_round_players` 행이 있으면 참가자이고, active membership만 있으면 관전자다. 중복 상태 플래그의 모순을 방지한다.

### E.4 `liar_games`

| 컬럼 | 형식 및 제약 |
|---|---|
| `id` | `uuid`, PK |
| `room_id` | `uuid`, NOT NULL FK rooms, CASCADE |
| `game_no` | `integer`, NOT NULL CHECK >= 1 |
| `status` | `text`, DEFAULT setup, CHECK setup/active/finished/force_ended |
| `selected_categories` | `text[]`, NOT NULL, 최소 1개 및 허용 category 검증 |
| `difficulty` | `text`, DEFAULT all, CHECK all/easy/normal/hard |
| `liar_count` | `smallint`, DEFAULT 1, CHECK 1~3 |
| `guess_limit` | `smallint`, DEFAULT 1, CHECK 1~3 |
| `started_at`, `finished_at` | `timestamptz`, nullable |
| `created_at`, `updated_at` | `timestamptz`, NOT NULL DEFAULT now() |

UNIQUE `(room_id, game_no)`, 인덱스 `(room_id, status)`, 방마다 setup/active game 하나만 허용하는 부분 UNIQUE를 둔다. 준비 인원별 liar 상한은 정적 CHECK가 아니라 start round RPC가 검증한다.

### E.5 `liar_rounds`

| 컬럼 | 형식 및 제약 |
|---|---|
| `id` | `uuid`, PK |
| `game_id` | `uuid`, NOT NULL FK games, CASCADE |
| `room_id` | `uuid`, NOT NULL FK rooms, CASCADE |
| `round_no` | `integer`, NOT NULL CHECK >= 1 |
| `status` | `text`, NOT NULL, 상태 enum CHECK |
| `word_id` | `uuid`, NOT NULL FK words, RESTRICT |
| `category_snapshot` | `text`, NOT NULL |
| `word_snapshot` | `text`, NOT NULL |
| `current_speaker_index` | `smallint`, nullable CHECK >= 0 |
| `winner` | `text`, nullable CHECK citizen/liar |
| `capture_succeeded` | `boolean`, nullable |
| `current_vote_stage` | `smallint`, NOT NULL DEFAULT 0 |
| `started_at` | `timestamptz`, NOT NULL DEFAULT now() |
| `finished_at`, `force_ended_at` | `timestamptz`, nullable |
| `created_at`, `updated_at` | `timestamptz`, NOT NULL DEFAULT now() |
| `version` | `bigint`, NOT NULL DEFAULT 0 |

UNIQUE `(game_id, round_no)`. `(room_id, status)`, `(game_id, created_at DESC)` 인덱스와 game당 진행 round 하나만 허용하는 부분 UNIQUE를 둔다. word/category snapshot은 word 사전 변경 후에도 과거 결과를 보존한다.

### E.6 `liar_round_players`

| 컬럼 | 형식 및 제약 |
|---|---|
| `id` | `uuid`, PK |
| `round_id` | `uuid`, NOT NULL FK rounds, CASCADE |
| `player_id` | `uuid`, nullable FK players, ON DELETE SET NULL |
| `nickname_snapshot` | `varchar(20)`, NOT NULL |
| `role` | `text`, NOT NULL CHECK citizen/liar |
| `role_checked_at` | `timestamptz`, nullable |
| `turn_order` | `smallint`, NOT NULL CHECK >= 0 |
| `is_final_suspect` | `boolean`, NOT NULL DEFAULT false |
| `created_at` | `timestamptz`, NOT NULL DEFAULT now() |

UNIQUE `(round_id, player_id)`, `(round_id, turn_order)`. 인덱스는 `(round_id, role)`, `(player_id, round_id)`, final suspect 부분 인덱스다. round 생성 시 `player_id`는 반드시 존재하는 player로 채우고, 이후 연결된 Auth 계정 삭제로 player가 CASCADE 삭제될 때만 NULL이 될 수 있다. 이 경우에도 `nickname_snapshot`, `role`, `turn_order`를 비롯한 round 기록은 그대로 보존한다.

### E.7 `liar_vote_stages` 추가

| 컬럼 | 형식 및 제약 |
|---|---|
| `id` | `uuid`, PK |
| `round_id` | `uuid`, NOT NULL FK rounds, CASCADE |
| `stage_no` | `smallint`, NOT NULL CHECK >= 1 |
| `kind` | `text`, CHECK original/runoff |
| `seats_to_fill` | `smallint`, NOT NULL CHECK >= 1 |
| `candidate_round_player_ids` | `uuid[]`, NOT NULL, 원소는 `liar_round_players.id` |
| `locked_winner_round_player_ids` | `uuid[]`, NOT NULL DEFAULT empty, 원소는 `liar_round_players.id` |
| `status` | `text`, CHECK open/closed |
| `opened_at` | `timestamptz`, NOT NULL |
| `closed_at` | `timestamptz`, nullable |

UNIQUE `(round_id, stage_no)`. 배열에는 FK를 걸 수 없으므로 RPC가 같은 round participant인지 검증한다. 더 엄격한 정규화가 필요해질 때 candidate 연결 테이블로 확장할 수 있다.

### E.8 `liar_ballots` 추가

| 컬럼 | 형식 및 제약 |
|---|---|
| `id` | `uuid`, PK |
| `vote_stage_id` | `uuid`, NOT NULL FK vote stages, CASCADE |
| `voter_round_player_id` | `uuid`, NOT NULL FK `liar_round_players.id`, CASCADE |
| `revision` | `integer`, NOT NULL DEFAULT 1 CHECK >= 1 |
| `submitted_at`, `updated_at` | `timestamptz`, NOT NULL DEFAULT now() |

UNIQUE `(vote_stage_id, voter_round_player_id)`. ballot 행을 제출 완료 기준으로 세어 다중 target rows를 여러 명의 투표로 오인하지 않는다.

### E.9 `liar_votes`

| 컬럼 | 형식 및 제약 |
|---|---|
| `id` | `uuid`, PK |
| `ballot_id` | `uuid`, NOT NULL FK ballots, CASCADE |
| `target_round_player_id` | `uuid`, NOT NULL FK `liar_round_players.id`, CASCADE |
| `created_at`, `updated_at` | `timestamptz`, NOT NULL DEFAULT now() |

UNIQUE `(ballot_id, target_round_player_id)`를 둔다. 이 UNIQUE 인덱스의 선두 `ballot_id`를 ballot별 선택 조회에도 사용하고, target별 역조회용 `(target_round_player_id, ballot_id)` 인덱스를 별도로 둔다. `round_id`, stage, voter는 중복 저장하지 않고 `liar_votes.ballot_id → liar_ballots.vote_stage_id → liar_vote_stages.round_id/stage_no` 및 `liar_ballots.voter_round_player_id`로 조회한다. 따라서 round/stage 집계와 voter 상세 조회도 이 관계를 JOIN하여 수행한다. voter와 target이 다른지, target이 같은 round와 stage의 후보인지, 정확한 선택 수와 stage open 여부인지는 교차 행 CHECK 대신 `submit_ballot` RPC가 검증한다.

### E.10 `liar_guesses`

| 컬럼 | 형식 및 제약 |
|---|---|
| `id` | `uuid`, PK |
| `round_id` | `uuid`, NOT NULL FK rounds, CASCADE |
| `guesser_round_player_id` | `uuid`, NOT NULL FK `liar_round_players.id`, CASCADE |
| `attempt_no` | `smallint`, NOT NULL CHECK 1~3 |
| `guess_text` | `text`, NOT NULL, trim non-empty/길이 CHECK |
| `normalized_guess` | `text`, NOT NULL |
| `is_correct` | `boolean`, NOT NULL |
| `created_at` | `timestamptz`, NOT NULL DEFAULT now() |

UNIQUE `(round_id, attempt_no)`, 인덱스 `(round_id, created_at)`. 팀 공유 횟수를 player별이 아니라 round attempt 번호로 고정한다.

### E.11 `liar_words`

| 컬럼 | 형식 및 제약 |
|---|---|
| `id` | `uuid`, PK |
| `category` | `text`, NOT NULL, 허용 category CHECK |
| `word` | `varchar(100)`, NOT NULL, trim non-empty |
| `normalized_word` | `varchar(100)`, NOT NULL |
| `difficulty` | `text`, NOT NULL CHECK easy/normal/hard |
| `enabled` | `boolean`, NOT NULL DEFAULT true |
| `created_at`, `updated_at` | `timestamptz`, NOT NULL DEFAULT now() |

UNIQUE `(category, normalized_word)`, 부분 인덱스 `(category, difficulty) WHERE enabled`를 둔다. 따라서 같은 category의 동일 정규화 제시어는 difficulty만 달리하여 중복 등록할 수 없다.

### E.12 삭제 정책

ROOM 삭제는 GAME/ROUND/ROUND PLAYERS/VOTE STAGES/BALLOTS/VOTES/GUESSES와 PLAYERS를 CASCADE 삭제한다. player의 일상적인 나가기는 soft leave이며, 물리 삭제는 만료 room 정리 시에만 한다. 예외적으로 Auth 회원 삭제 시 `liar_players.auth_user_id → auth.users`의 ON DELETE CASCADE는 유지하되 `liar_round_players.player_id → liar_players`는 ON DELETE SET NULL이므로, 회원의 player 행이 삭제되어도 기존 round player snapshot과 이에 연결된 투표·추측 기록은 보존된다.

## F. ROOM / GAME / ROUND 관계

```text
ROOM 1 ── N GAME 1 ── N ROUND
                         ├─ ROUND PLAYERS
                         ├─ VOTE STAGES ─ BALLOTS ─ VOTES
                         └─ GUESSES
```

- ROOM은 방 코드, host, 현재 game/round pointer와 만료를 관리한다.
- GAME은 category, difficulty, liar count, guess limit의 불변 설정 snapshot이다.
- ROUND는 실제 한 판의 참가자, 역할, word, 순서, 투표, 추측, 승패를 관리한다.

### 준비 완료자 고정

`start_round` RPC가 room/game을 lock하고 active+ready player를 조회한다. 4~12명과 liar 수를 검증한 뒤 그 사용자만 round players에 복사한다. 역할, turn order, word를 함께 만들고 모든 room player의 ready를 false로 초기화한다. 이후 membership/ready 변경은 현재 round snapshot에 영향을 주지 않는다.

### 진행 중 신규 참가자

진행 중 join은 room membership만 만들고 current round player는 만들지 않는다. UI는 이를 관전자로 판단한다. 다음 WAITING부터 ready를 선택할 수 있다.

### 진행 중 참가자 퇴장

현재 round participant도 게임방 나가기를 선택할 수 있다. 일반 참가자의 퇴장 RPC는 본인의 `liar_players.membership_status='left'`와 `left_at`만 기록하며 기존 라운드 snapshot은 보존한다. host가 직접 나가면 room을 `expired`로 soft-close하고 현재 round/game을 강제 종료한 뒤 모든 active membership을 `left`로 해제한다. 방장 위임은 나가기의 선행 조건이 아니다.

### 다음 라운드와 새 게임

- 다음 라운드: GAME 유지, current round pointer 제거, ready 초기화, 다음 start 시 round 번호 증가.
- 새 게임: 기존 GAME finished, 새 setup GAME 생성, game 번호 증가, 설정 변경 허용, ROOM과 code/host/player 유지.

## G. 게임 상태 머신

`EXPIRED`는 room 상태, `GAME_SETUP`은 game setup 상태, `WAITING`은 진행 round가 없는 준비 상태로 분리한다. `ROLE_REVEAL`부터 `FORCE_ENDED`까지는 round 상태다.

| 상태 | 진입 조건 | 일반 사용자 행동 | 방장 행동 | 다음 상태 | 이전 이동 |
|---|---|---|---|---|---|
| GAME_SETUP | room 생성/새 game draft | 방 보기, 나가기 | 설정 변경·확정 | WAITING | 없음 |
| WAITING | setup 확정/결과 후 다음 준비 | ready, 허용 시 nickname, 나가기 | round 시작, 위임, 새 game | ROLE_REVEAL | 미시작 game만 setup 가능 |
| ROLE_REVEAL | start round 완료 | 역할 확인 | 전원 확인 후 발언 시작, 강제 종료 | SPEAKING | 불가 |
| SPEAKING | 최초 발언 또는 동률 추가 발언 | 순서 확인 | 이전/다음, 마지막 후 종료 | DISCUSSION/RUNOFF_VOTING | 상태 후퇴 불가, index만 이전 |
| DISCUSSION | 설명 종료 | Zoom 토론 | 투표 시작 | VOTING | 불가 |
| VOTING | 원투표 stage open | 제출/수정, 진행률 | 마감 | VOTE_RESULT/RUNOFF/추측/결과 | 불가 |
| VOTE_RESULT | stage 마감/집계 | 결과 확인 | 추가 발언 후 runoff 또는 즉시 runoff | SPEAKING/RUNOFF_VOTING/LIAR_REVEAL/ROUND_RESULT | 불가 |
| RUNOFF_VOTING | 동점 stage open | 후보 대상 제출/수정 | 재투표 마감 | VOTE_RESULT 또는 새 runoff | 불가 |
| LIAR_REVEAL | actual liar set과 정확히 일치 | 검거 성공 안내만 확인 | 라이어 공개 | LIAR_GUESS | 불가 |
| LIAR_GUESS | liar 전체 검거 | liar만 추측 | 강제 종료 | ROUND_RESULT | 불가 |
| ROUND_RESULT | winner 확정 | 결과 확인·방장 대기 | 같은 Room에서 새 game 생성/위임 | GAME_SETUP/WAITING | 불가 |
| FORCE_ENDED | host 강제 종료 | 안내/대기 복귀 | 새 game 준비 | GAME_SETUP | 불가 |
| EXPIRED | DB now >= expires_at | 안내만 | 없음 | 없음 | 불가 |

설정 가능 여부는 상태명보다 `game.started_at IS NULL AND game.status='setup'`으로 판정한다. 같은 GAME의 다음 라운드 WAITING에서는 설정을 잠근다. 일반 상태 후퇴는 금지하며 SPEAKING의 speaker index 감소만 허용한다.

`liar_restart_game(player_key, expected_round_version)`은 `ROUND_RESULT` 전용 lifecycle RPC다. active host membership과 room 만료, winner/finished_at, round version, room의 round/game pointer 및 active Game을 player → room → round → game 순서로 잠가 검증한다. 한 트랜잭션에서 기존 Game을 먼저 `finished` 처리한 뒤 설정 4종을 복사한 다음 번호의 setup Game을 만들고, active player의 ready와 `joined_during_round_id`를 초기화한다. 마지막으로 `current_game_id`를 새 Game으로, `current_round_id`를 null로 바꾸고 room version/활동/만료 시각을 갱신한다. 기존 Game/Round/Vote/Guess 행은 보존한다. 첫 요청 뒤 round pointer가 null이 되므로 이중 클릭의 후속 요청은 실패하며 `(room_id, game_no)` UNIQUE도 이를 방어한다.

Room version 변경은 기존 `state_changed` Broadcast만 사용한다. 각 클라이언트는 snapshot을 다시 읽어 `round=null`, `game.status=setup`을 확인하고 별도 restart 상태나 location reload 없이 setup 화면으로 전환한다.

`start_speaking` RPC는 현재 round의 모든 `liar_round_players.role_checked_at`이 NOT NULL인지 다시 확인한다. 한 명이라도 미확인이면 버튼을 비활성화하고 RPC도 전이를 거부한다. host가 미확인자를 무시하거나 강제로 진행하는 기능은 1차 범위에 포함하지 않는다.

## H. 투표 / 동점 / 추측 설계

### H.1 ballot 제출과 수정

`submit_ballot` RPC는 session/player/round/stage를 확인하고 target 수, 중복, 자기 자신, 후보 범위를 검증한다. ballot row를 lock한 뒤 기존 vote rows를 삭제하고 새 rows를 삽입하며 revision을 증가시킨다. 모든 과정이 한 트랜잭션이므로 중간 상태가 노출되지 않는다. `expected_revision`으로 stale tab 수정을 거부한다.

### H.2 마감과 판정

host의 `close_vote_stage` RPC가 stage를 lock하고 현재 round participant 전원의 ballot 제출을 재검증한다. 제출 수가 참가자 수보다 적으면 마감을 거부하고 UI의 마감 버튼도 비활성화한다. 전원 제출이 확인된 경우에만 stage를 close하고 표를 집계한다. 경계 동점이면 다음 vote stage를 만들고, 아니면 final suspects를 기록하여 actual liar set과 비교한다. 비정상 이탈 등으로 전원 제출이 불가능하면 미제출자를 제외해 마감하지 않고 host의 GAME 전체 강제 종료를 사용한다.

### H.3 경계 동점

- N번째 점수와 같은 동점 그룹 때문에 N명을 확정할 수 없을 때만 runoff한다.
- 이미 확정된 상위 후보는 locked winners로 유지한다.
- 동점 후보만 후보 배열에 넣는다.
- voter는 남은 자리 수(`liar_count - locked winners`)만큼 선택한다.
- stage 번호로 원투표와 모든 재투표 이력을 구분한다.

재투표가 다시 동점이면 방장은 매번 즉시 재투표 또는 모든 기존 참가자의 추가 발언 한 바퀴를 선택한다. 두 방식 모두 round row를 잠근 뒤 동일한 경계 계산으로 다음 open runoff stage를 먼저 한 개만 생성한다. 추가 발언 방식은 round를 `SPEAKING`으로 바꾸고, 마지막 발언에서 그 open stage를 재사용해 `RUNOFF_VOTING`으로 전환한다. 최초 `current_vote_stage=0` 발언만 기존대로 `DISCUSSION`으로 간다. 동점이 해소될 때까지 횟수 제한 없이 반복한다.

### H.4 검거 판정

투표 마감 RPC에서 final suspect set과 role=liar set을 집합 비교한다. 단일/다중 모두 크기와 구성원이 완전히 같을 때만 검거 성공이다. 하나라도 다르면 즉시 liar winner다. 성공하면 `winner=null`, `finished_at=null`인 `LIAR_REVEAL`로 이동한다. 이 상태는 room snapshot에 상태와 비밀이 아닌 `current_vote_stage`만 노출하고 vote snapshot 호출을 허용하지 않으므로 final suspects, tally, locked winner, role, word를 공개하지 않는다. host의 version 검증 `liar_reveal_liars`만 `LIAR_GUESS`로 전환하며 반환값은 round/room version뿐이다.

### H.5 추측과 충돌 방지

`submit_guess` RPC가 round row를 `FOR UPDATE`로 잠근다. 제출자가 현재 round liar인지, 상태와 남은 횟수를 확인한 뒤 count+1 attempt를 배정한다. UNIQUE `(round_id, attempt_no)`가 이중 방어한다. 동시에 제출하면 lock 순서대로 처리되며, 첫 제출이 정답이면 두 번째는 종료된 상태라 거부된다.

정규화는 입력과 정답 모두 Unicode NFC 정규화 → 앞뒤 공백 제거 → 문자열 내부를 포함한 모든 공백 제거 → 정확 문자열 비교 순서다. 개념적으로 JavaScript의 `value.normalize("NFC").trim().replace(/\s+/g, "")`와 같지만 최종 판정은 DB/RPC에서 동일 규칙으로 수행한다. 대소문자는 변환하지 않으며 동의어, 유사어, 의미 기반 또는 AI 판정은 지원하지 않는다. 클라이언트 비교는 안내 용도로만 사용한다.

### H.6 결과

별도 result 테이블 없이 round, game, round players, vote stages, ballots/votes, guesses를 조회한다. `ROUND_RESULT` 이후에만 사용할 수 있는 결과 조회 RPC 또는 view가 `word_snapshot`, 전체 role, 투표 결과와 상세 내역을 조합한다. 여기서 vote의 round/stage/voter는 vote 행의 중복 컬럼이 아니라 `votes → ballots → vote_stages` JOIN으로 얻는다. 원본과 중복되는 영속 결과 테이블은 만들지 않는다.

## I. Supabase Realtime 설계

### I.1 채널

```text
liar-room:{roomId}
liar-round:{roundId}
```

- room channel: rooms, players, games와 rounds의 공개 가능한 변경 신호를 room ID로 구독한다. `liar_rounds`를 구독할 때는 `id`, `room_id`, `status`, `version`처럼 안전한 컬럼만 명시적으로 select하여 `word_snapshot`이 payload에 포함되지 않게 하거나, 별도의 공개 version 변경 이벤트만 구독한 뒤 일반 snapshot RPC를 다시 호출한다.
- round channel: 진행 상태와 공개 가능한 participant 변경 신호, vote stages, guesses를 current round 범위로 구독한다. `liar_round_players`를 구독할 때는 `id`, `round_id`, `nickname_snapshot`, `turn_order`, `role_checked_at`처럼 안전한 컬럼만 명시적으로 select하여 `role`이 payload에 포함되지 않게 하거나, 별도의 공개 version 변경 이벤트만 구독한 뒤 snapshot RPC를 재조회한다. 안전 컬럼 projection을 보장할 수 없다면 진행 중인 `liar_rounds`와 `liar_round_players` base table의 Postgres Changes는 일반 참가자·관전자에게 직접 구독시키지 않는다. ballot은 `round_id` 컬럼이 없으므로 round ID로 직접 필터링하지 않는다.
- votes 개별 row 구독은 이벤트 폭주와 투표 중 정보 노출을 피하기 위해 생략할 수 있다. round/stage version 변경을 통해 결과 snapshot을 재조회한다.

ballot 진행률 구독은 다음 순서를 따른다.

```text
현재 ROUND
→ 현재 open liar_vote_stage 조회
→ current_vote_stage_id 확인
→ liar_ballots WHERE vote_stage_id = current_vote_stage_id 구독
```

이 구독은 `4 / 5명 투표 완료` 같은 제출 인원 snapshot을 갱신하는 신호로만 쓴다. stage가 바뀌면 기존 ballot 구독을 제거하고 새 `vote_stage_id`로 구독한다.

### I.2 이벤트 처리

- room/player 이벤트는 50~150ms debounce 후 room snapshot 재조회.
- round status/version 이벤트는 current round snapshot 전체 재조회.
- speaker index는 즉시 부분 갱신 후 background 확인 가능.
- 투표 중에는 ballot 이벤트를 진행률 snapshot 재조회 신호로만 사용하여 제출 수만 갱신한다. 누가 누구에게 투표했는지, 현재 득표 수, 최다 득표 후보는 공개하지 않는다.
- 화면 상태가 바뀔 때 root view를 바꾸고, 같은 상태에서는 player list/progress/speaker만 부분 갱신한다.
- 입력 중인 nickname, guess, ballot draft는 무관한 Realtime event로 잃지 않는다.

### I.3 중복과 순서 역전 방지

- `activeRoomId`, channel references, generation을 하나만 보관한다.
- 같은 room 재구독은 no-op다.
- 방 이동 시 기존 channel 제거 완료 후 새 channel을 만든다.
- snapshot 요청 sequence와 DB version으로 오래된 응답을 폐기한다.
- 여러 이벤트를 debounce하여 트랜잭션당 한 번 재조회한다.
- Realtime reconnect와 tab visibility 복귀 시 전체 snapshot을 다시 조회한다.

### I.4 정리

나가기, 방 전환, Auth 소실, 만료, app destroy에서 channel을 제거한다. 새로고침 후 recovery 성공 시 새로 한 번만 구독한다.

## J. Auth 및 세션 Guard 설계

### J.1 초기화

동일 Supabase URL/key와 기본 Auth storage를 쓰는 독립 client를 만든다. `getSession()`에서 user가 없으면 로그인 안내를 표시한다. 로그인 버튼은 root SPA의 `#/login`으로 이동해야 하며 project page base path를 계산한다.

접근 guard는 Supabase Auth session 존재만 확인한다. `profiles` 테이블이나 `profiles.status='approved'`는 어떤 화면, recovery, command에서도 접근 조건으로 조회하지 않는다.

### J.2 조작 직전 guard

모든 command는 UI 중복 제출 잠금 → `getSession()` → RPC 순서로 실행한다. session이 없으면 global auth-lost 처리를 실행한다. DB RPC도 `auth.uid()`와 player 소유권을 재검증한다.

### J.3 Auth event

- SIGNED_OUT/session null: command 차단, channel 제거, role/word/draft 메모리 삭제, 로그인 안내.
- TOKEN_REFRESHED: session만 교체하고 화면 유지.
- 같은 user의 반복 SIGNED_IN: no-op.
- 다른 user SIGNED_IN: 기존 player/room context 폐기 후 recovery 재실행.
- USER_UPDATED: session만 갱신.

listener callback에서 긴 DB 작업을 직접 await하지 않고 후속 task로 분리한다.

### J.4 세션 소실 UX

모든 mutation button을 비활성화하고 Realtime을 정리한다. player key/nickname/current room은 재로그인 복구를 위해 유지할 수 있다. 다른 계정으로 로그인하면 기존 membership을 자동 복구하지 않는다.

## K. 새로고침 / 재접속 복구 설계

### K.1 localStorage

```text
liar_player_key
liar_nickname
liar_current_room
```

UUID, nickname 길이, room code 형식을 읽을 때 검증한다. role, word, host, ready, status는 저장하지 않는다.

### K.2 복구 순서

1. Auth 확인.
2. player key 확인/생성.
3. current room 확인.
4. player key + auth user로 snapshot 복구 시도.
5. 실패하면 Auth user 기준 active room 목록 조회.
6. 사용자가 돌아가기를 선택하면 현재 player key로 membership possession 이전.
7. current game/round 및 상태별 snapshot 조회.
8. store를 원자 hydrate.
9. Realtime 구독.
10. state machine으로 view 결정.

round participant가 있으면 해당 화면, membership만 있으면 관전자, round가 없으면 setup/waiting을 표시한다. membership/room이 없거나 expired면 current room을 지우고 lobby로 간다.

복구는 현재 `player_key`로 snapshot을 먼저 조회한다. 실패하면 `liar_get_my_active_rooms()`가 `auth.uid()`만으로 안전한 active room 목록을 반환하고, 사용자가 돌아가기를 선택하면 `liar_resume_room(room_id, player_key)`가 현재 기기의 key로 possession을 이전한다. 기존 기기의 key는 이후 mutation에서 거부된다.

### K.3 재접속 카드

유효 membership이 있으면 즉시 강제 진입하지 않고 lobby에 `[방으로 돌아가기]`를 표시한다. 다른 기기에서도 `auth_user_id`로 membership을 찾되 player key 자체는 노출하지 않는다.

## L. 방 만료 및 예외 처리

### L.1 Soft expiration

별도 서버가 없으므로 접근 시 지연 판정을 기본으로 한다. 모든 room mutation RPC는 `status='expired' OR now() >= expires_at`이면 expired 상태를 기록하고 요청을 거부한다. 단, `create_room`/`join_room` RPC가 호출자의 기존 active membership을 검사할 때 그 membership의 room이 `status='expired'`이거나 `now() >= expires_at`이면, 기존 membership을 `membership_status='left'`, `ready=false`, `left_at=now()`로 처리한 후 새 room 생성/참가를 계속한다. 유효한 주요 게임 동작 성공 시 `last_activity_at=now()`, `expires_at=now()+24h`로 갱신한다.

활동에는 create/join/leave, ready/nickname, 설정/start, role check, speaker, vote, guess, lifecycle, host transfer/force end를 포함한다. 단순 SELECT, Realtime reconnect, 열린 탭 heartbeat는 활동으로 보지 않는다.

### L.2 물리 삭제

1차에서는 `status=expired AND expired_at < now()-7 days`를 삭제 대상으로만 둔다. 추후 Supabase Cron/pg_cron, 운영 SQL 중 하나로 room 단위 CASCADE 정리한다.

### L.3 예외와 race condition

| 상황 | 처리 |
|---|---|
| 방 코드 충돌 | UNIQUE 위반 시 제한된 횟수 재생성 |
| start 직전 ready 변경 | RPC lock 시점 snapshot |
| 12번째 자리 동시 참가 | room lock 후 count 재검증 |
| host 두 탭의 상태 전이 | expected status/version CAS |
| host 위임과 action 경쟁 | room row lock 후 host 재검증 |
| 투표 수정과 마감 | stage row lock, 먼저 commit한 상태 적용 |
| guess 동시 제출 | round lock + attempt UNIQUE |
| new game/next round 경쟁 | room lock + current pointer/version |
| 네트워크 응답 유실 | 재시도 전 snapshot 조회 |
| Realtime 누락 | reconnect/visibility 시 전체 재조회 |

### L.4 방장 위임

room row를 lock하고 현재 caller가 host인지, 대상이 같은 room의 active player인지 검증한 후 `host_player_id` 하나만 갱신한다. room Realtime 이벤트로 즉시 반영한다.

### L.5 강제 종료

강제 종료는 현재 ROUND만이 아니라 현재 GAME 전체를 종료한다. host RPC가 room/game/round를 lock한 뒤 current round를 `FORCE_ENDED`, current game을 `force_ended`로 전이하고 열린 vote stage를 close한다. 모든 player의 ready를 false로 초기화하고 room의 current round pointer를 제거한 다음 새 setup GAME을 생성하여 `GAME_SETUP`으로 복귀한다. ROOM, host, player membership은 유지한다. 강제 종료된 역할/투표/추측 데이터는 삭제하지 않고 변경 불가 이력으로 보존하되 활성 UI/store에서는 제거한다.

## M. RLS 및 권한 설계

- 모든 `liar_*` 테이블에서 RLS 활성화.
- anon 직접 접근 금지, authenticated만 허용.
- 기존 사이트 테이블의 policy/권한은 수정하지 않는다.
- 일반 mutation은 직접 table write보다 RPC로 제한한다.
- 함수 권한은 authenticated만 grant하고 public/anon은 revoke한다.
- SECURITY DEFINER가 필요하면 최소 함수에만 쓰고 `search_path`를 고정한다.
- words 수정은 일반 사용자에게 금지한다.
- player 변경은 `auth_user_id=auth.uid()`와 player key가 모두 일치해야 한다.
- host action은 room host membership을 DB에서 검증한다.
- vote는 round participant, guess는 role=liar인지 검증한다.
- 투표 중 votes 조회는 본인 ballot만 허용하거나 직접 SELECT를 막고 집계 RPC만 제공한다.
- PostgreSQL RLS는 행 접근 제어이며 컬럼 은닉 수단이 아니다. 따라서 진행 중 `liar_rounds.word_snapshot`이나 `liar_round_players.role`이 들어 있는 base table 행을 일반 snapshot 권한으로 직접 SELECT하게 한 뒤 RLS만으로 숨기는 구조를 사용하지 않는다.
- 일반 room/round snapshot RPC 또는 view의 반환 스키마에서 `word_snapshot`과 `role`을 아예 제외한다. 참가자와 관전자 모두 게임 단계, 참가자 ID·nickname snapshot·발언 순서, 현재 발언자, 투표 진행 여부와 공개 가능한 round 안내만 이 경로로 조회한다.
- 자신의 역할 확인 전용 RPC는 `auth.uid()`가 연결된 현재 `liar_players`와 `liar_round_players.player_id`의 소유권을 검증한 뒤 caller 자신의 role만 반환한다. role이 `citizen`일 때만 해당 round의 `word_snapshot`도 반환하고, `liar`에게는 word를 반환하지 않는다. 관전자와 다른 participant의 행은 반환하지 않는다.
- `ROUND_RESULT` 상태 이후에만 허용되는 결과 조회 RPC 또는 view는 상태를 DB에서 재검증하고 참가자·관전자에게 전체 role, 제시어, 투표 결과와 상세 투표 내역을 공개한다. 결과 전용 조회 역시 vote의 round/stage/voter를 `liar_votes → liar_ballots → liar_vote_stages` 관계로 조합한다.
- base table SELECT 권한과 view/RPC 실행 권한은 위 세 조회 경로를 우회할 수 없게 구성하고, Realtime payload에도 진행 중 role/word가 실리지 않게 한다.
- service_role key는 브라우저에 사용하지 않는다.

높은 수준의 비밀 보호보다 기존 데이터 보호와 트랜잭션 정합성에 초점을 맞춘다.

## N. 기존 사이트 수정 예상 범위

이번 설계 단계 이후 실제 연결 시 다음을 최소 수정한다.

1. 기존 사이트에서 라이어게임으로 이동 가능한 일반 anchor 링크 또는 홈 카드를 최소 하나 제공한다.
2. 모바일 `js/components/bottomNav.js` 추가 여부는 기존 사이트 연결 단계에서 최종 결정한다. bottom nav 수정은 선택 사항이며 1차 연결의 필수 범위가 아니다.
3. 기존 `navLink()`는 hash route용이므로 게임 링크에 사용하지 않는다.
4. `window.location.hash='/liar-game/'`가 아니라 실제 anchor navigation을 사용한다.
5. 기존 router route 등록은 수정하지 않는다.

최소 범위는 기존 사이트의 링크 또는 카드다. 모바일 전역 노출이 필요하다고 최종 결정할 때만 bottom nav와 관련 CSS를 수정한다.

## O. 단계별 구현 계획

| 단계 | 목표 | 생성 파일 | 수정 파일 | DB 변경 | 주요 테스트 |
|---|---|---|---|---|---|
| 1 | 최종 정책 검증 | 기술 설계서 | 없음 | 없음 | 상태·권한·투표 규칙 리뷰 |
| 2 | 기본 schema와 words | schema/seed SQL | Supabase 안내 | 있음 | FK/UNIQUE/CHECK/CASCADE |
| 3 | RPC와 RLS | functions/RLS SQL | 없음 | 있음 | anon, host, 소유권, stale 상태 |
| 4 | 독립 shell/Auth guard | HTML/CSS/config/auth/app | 없음 | 없음 | 세션 공유, 비로그인, logout |
| 5 | 닉네임/로비/방 | storage/store/api/commands/views | app | RPC 보정 | create/join/leave/recovery/12명 |
| 6 | 설정/준비 | setup/room views | state/commands | 있음 | 잠금, 4명, liar 상한 |
| 7 | round/역할 | role view | api/state | 있음 | snapshot, random, rollback |
| 8 | 발언/토론 | speaking view | state/commands | 있음 | index 경계, host, 동시 클릭 |
| 9 | 원투표 | vote view | api/store | 있음 | 다중 선택, 수정, 마감 불변 |
| 10 | 재투표/판정 | 없음 | vote/result/state | 있음 | 경계 동점, set 비교 |
| 11 | 추측/결과 | guess/result views | commands/api | 있음 | 공유 횟수, 동시 제출, 결과 |
| 12 | lifecycle/위임/강제 종료 | 없음 | room/result/setup | 있음 | next/new/transfer/force end |
| 13 | Realtime/복구 | realtime | app/store/recovery | publication | 다중 탭, reconnect, stale 응답 |
| 14 | 만료/예외 | expired view | recovery/commands | 있음 | 24h, 7일 대상, 응답 유실 |
| 15 | 기존 사이트 연결 | 없음 | header, 선택적으로 nav/home/CSS | 없음 | 링크/base path/회귀 |
| 16 | 통합 QA | QA checklist | 결함 파일 | 필요 시 | 요구사항 50개, 모바일, 회귀 |

## P. 정책 결정 현황과 남은 확인 사항

### P.1 결정 완료

1. **접근 권한:** 유효한 Supabase Auth session만 확인하며 `profiles`에는 의존하지 않는다.
2. **계정별 active room:** 한 Auth 계정에는 active membership을 하나만 허용한다.
3. **진행 중 명시적 이탈:** 일반 참가자는 membership만 left로 바꾸고 round snapshot을 보존한다. host의 나가기는 방 전체 soft-close, 진행 game/round 강제 종료, 모든 membership 해제를 한 트랜잭션으로 수행한다.
4. **역할 확인:** current round participant 전원의 `role_checked_at` 확인 전에는 SPEAKING으로 전이할 수 없다.
5. **재동점:** 동점이 해소될 때까지 추가 토론과 새 vote stage 재투표를 제한 없이 반복한다. 추첨이나 host 결정은 사용하지 않는다.
6. **투표 마감:** current round participant 전원의 ballot 제출이 필수이며 미제출자가 있으면 UI와 RPC 모두 마감을 허용하지 않는다.
7. **강제 종료:** current ROUND와 GAME 전체를 종료하고 이력은 보존한 채 새 GAME_SETUP으로 복귀한다.
8. **관전자 비밀:** 결과 확정 전에는 시민 제시어, liar 정체, 개별 역할을 공개하지 않으며 결과 후 상세 결과를 공개한다.
9. **정답 비교:** NFC 정규화, trim, 모든 공백 제거 후 대소문자 변환 없는 정확 일치를 DB/RPC가 판정한다.
10. **모바일 메뉴:** bottom nav 포함 여부는 기존 사이트 연결 단계에서 최종 결정하며, 최소 연결 범위는 링크 또는 카드다.
11. **WAITING 설정 잠금:** 최초 setup GAME은 `started_at IS NULL AND status='setup'`인 동안만 설정할 수 있고, 시작된 같은 GAME의 다음 라운드 WAITING에서는 잠근다.
12. **player 복구:** 게임 식별은 `player_key`를 유지하고 `auth_user_id`를 복구와 소유권 검증에 함께 사용한다.
13. **투표 경계:** N번째 선발 경계에 영향을 주는 동점만 runoff하고 locked winner를 제외한 남은 자리 수만 선택한다.
14. **단어·랜덤:** 전체 category는 허용 category 전부를 저장하고, 직전 word는 후보가 둘 이상일 때 제외하며, start RPC 안에서 DB가 무작위 선택한다.

### P.2 구현을 막지 않는 후속 운영 결정

1. **7일 경과 expired ROOM 물리 삭제 실행 수단:** Supabase Cron/pg_cron 또는 운영 작업 중 무엇을 사용할지는 배포·운영 단계에서 정한다. soft expiration과 삭제 대상 기준에는 영향이 없다.
2. **모바일 bottom nav 노출:** 기존 사이트 연결 단계에서 실제 메뉴 구성과 CSS를 검토해 선택한다. 링크 또는 카드 제공만으로 1차 연결 요건은 충족한다.

---

본 설계의 최우선 목표는 독립 웹앱 경계를 유지하면서 DB 트랜잭션, 명시적 상태 머신, snapshot 기반 라운드 참가자, stage 기반 투표, session guard와 Realtime 재조회 전략으로 구현 도중 구조를 다시 뜯어고칠 위험을 줄이는 것이다.
