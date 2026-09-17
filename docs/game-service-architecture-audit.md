# 게임 서비스 아키텍처 감사 보고서

- 감사 일자: 2026-09-17
- 대상 저장소: `limbit95/limbit95.github.io`
- 감사 기준 커밋: `ef4a211456000db531ed108147f27776f5e19a34`
- 감사 방식: Read-only source, Git history, SQL, test/CI 구조 검토

> 감사 환경의 `.git/FETCH_HEAD`는 위 커밋을 `main`으로 기록하고 있었지만, 외부 GitHub
> 연결이 CONNECT 403으로 차단되어 원격 `main`의 HEAD를 별도로 재조회하지는 못했다.
> 따라서 이 보고서는 컨테이너에 마지막으로 fetch된 `main` 스냅샷을 기준으로 한다.

## 1. Executive Summary

### 핵심 결론

| 질문 | 결론 |
| --- | --- |
| 현재 구조로 게임을 계속 추가할 수 있는가? | 기술적으로 가능하지만, 현재의 게임별 독립 구현을 20개 이상 그대로 복제하면 인증, Realtime, 재접속, DB migration, 테스트 방식의 편차가 커진다. |
| 지금 안정화가 필요한가? | 필요하다. 다만 전면 리팩터링이 아니라 권한 경계, 진행 중 연결 끊김 정책, DB 재현 가능성, 실제 Supabase 통합 테스트를 우선 보강해야 한다. |
| 기존 게임을 반드시 마이그레이션해야 하는가? | 아니다. 현재 URL과 DB namespace를 유지하는 것이 더 안전하며, 특히 Marble은 가장 마지막 선택적 후보로 두어야 한다. |
| 신규 Game Platform이 필요한가? | 필요하다. 단 범용 Game Engine이 아니라 인증, room/lobby, snapshot/reconnect, versioned action, Realtime invalidation, 테스트 계약을 제공하는 얇은 플랫폼이어야 한다. |
| Can't Stop을 첫 검증 게임으로 사용할 수 있는가? | 가능하다. 기존 게임을 먼저 이식하지 않고 신규 플랫폼 계약을 검증하는 첫 게임으로 사용하는 것이 적절하다. |

현재 게임 서비스는 하나의 공통 플랫폼이 아니라 세 계열이 병존한다.

1. **Liar Game + Drawing Spy**: 하나의 room/round state machine을 공유하고 private
   Broadcast와 RPC snapshot을 사용한다.
2. **The Game**: 로컬 순수 규칙 엔진과 서버 권위 온라인 게임을 분리하고 PostgreSQL
   Changes를 invalidation 신호로 사용한다.
3. **Marble**: 로컬 엔진, theme/rules, renderer, presentation, online session이 가장
   명시적으로 분리되어 있고 action replay, polling fallback, Presence까지 갖춘다.

가장 안전한 방향은 기존 세 게임과 Drawing Spy의 위치를 유지하고, 신규 `games/`
영역에서 Can't Stop부터 얇은 플랫폼 계약을 검증하는 것이다. 기존 게임의 일괄 이동,
DB 통합, 공통 phase/state 강제는 안정성 목표에 반한다.

## 2. Current Repository Map

### 게임 프론트엔드

```text
liar-game/
├── index.html
├── VERSION
├── css/
└── js/
    ├── app.js
    ├── api.js
    ├── commands.js
    ├── realtime.js
    ├── sessionGuard.js
    ├── storage.js
    ├── store.js
    ├── discussionChat.js
    ├── drawingBoard.js
    ├── drawingReplay.js
    └── views/

the-game/
├── index.html
├── README.md
├── css/
├── js/
│   ├── app.js
│   ├── gameEngine.js
│   ├── multiplayerApi.js
│   ├── onlineLobby.js
│   ├── onlineGame.js
│   └── playerStats.js
└── tests/

marble-game/
├── index.html
├── README.md
├── ANIMATION_DESIGN.md
├── css/
├── js/
│   ├── core/
│   ├── themes/
│   ├── renderer/
│   ├── presentation/
│   ├── multiplayerApi.js
│   ├── onlineGameApi.js
│   ├── onlineSession.js
│   └── onlineGameController.js
└── tests/
```

Drawing Spy는 별도 애플리케이션이 아니라 Liar Game의 `game_mode = drawing_spy` 변형이다.
setup, room, player, round, vote, result 생명주기를 Liar와 공유하고 drawing phase와 stroke
처리만 확장한다.

### 게임 허브와 초대

- `js/pages/games.js`: Liar, The Game, Marble 카드와 공개 URL
- `css/games.css`: 게임 허브 스타일
- `invite.html`: 공통 초대 진입 페이지
- `js/invites/inviteEntry.js`: 현재 The Game 초대 redirect 등록
- `js/invites/inviteRegistry.js`: target type별 handler registry
- `js/invites/inviteApi.js`: 초대 조회 API
- `css/invite-share.css`: 초대 UI 공통 스타일

공개 URL은 `./liar-game/`, `./the-game/`, `./marble-game/`로 직접 등록되어 있다. The
Game 초대 진입점도 `/the-game/` 절대 경로를 생성하므로 디렉터리 이름은 이미 외부
계약의 일부다.

### Supabase

```text
supabase/
├── liar-game/
│   ├── schema.sql
│   ├── seed.sql
│   ├── rls.sql
│   ├── realtime.sql
│   ├── functions-core.sql
│   ├── functions-vote.sql
│   ├── functions-guess.sql
│   ├── functions-result.sql
│   ├── functions-runtime-overrides.sql
│   ├── migrations/
│   └── canonical/
├── the-game/
│   ├── README.md
│   └── 20260828... / 20260829... 후속 migration
└── marble/
    └── 20260906... migration 세트
```

Liar는 schema, RLS, Realtime, functions, migrations, canonical installer를 모두 저장한다.
Marble은 lobby foundation부터 game end까지 순차 migration을 저장한다. The Game은
README에 초기 multiplayer migration 여섯 개를 명시하지만 해당 SQL 파일들이 저장소에
없고 후속 migration만 남아 있다.

### 테스트, 빌드, CI

- `package.json`
  - `npm run build:assets`
  - `npm run test:e2e`
  - `npm run test:the-game`
  - `npm run test:marble`
- `scripts/check-liar-modules.mjs`: Liar ES module link 검사
- `scripts/build-liar-canonical.mjs`: Liar canonical SQL manifest 검사/생성
- `scripts/check-site.mjs`: 사이트 정적 구조 및 import 검사
- `.github/workflows/site-static-checks.yml`: 게임 JS syntax, The Game/Marble tests,
  Liar module/canonical 검사
- `.github/workflows/community-e2e-smoke.yml`: Playwright 전체 smoke
- `.github/workflows/community-authenticated-e2e.yml`: local Supabase 기반 community E2E

따라서 게임 소스는 특정 단일 디렉터리 아래에 모여 있지 않다. 프론트엔드, Supabase,
root tests, docs, scripts, GitHub Actions에 분산되어 있다.

## 3. Game-by-Game Architecture

### 3.1 Liar Game

#### Room, Player, Host, Lobby

- `liar_rooms`: room status, host, current game/round, expiry, version
- `liar_players`: `auth_user_id`, browser possession token인 `player_key`, nickname, ready,
  membership status
- `liar_games`: setup/active/finished/force-ended 단위
- `liar_rounds`: 현재 phase와 round version
- 사용자당 활성 membership 하나, room당 open game 하나, game당 진행 round 하나를 partial
  unique index로 제한한다.

방 생성은 `auth.uid()` 확인, 사용자 단위 advisory lock, 기존 활성 membership 확인,
room/player/game 생성, host와 version 설정을 한 transaction에서 수행한다. 참가도 room row를
`FOR UPDATE`로 잠근 뒤 정원과 membership을 검사한다.

#### Ready, Start, State, Phase

모든 중요한 변경은 `liar-game/js/commands.js`에서 RPC로 보낸다. 클라이언트는 다음과 같은
round status에 따라 view만 선택한다.

```text
ROLE_REVEAL
SPEAKING
DRAWING
DISCUSSION
VOTING
RUNOFF_VOTING
VOTE_RESULT
LIAR_REVEAL
LIAR_GUESS
ROUND_RESULT
```

host 또는 현재 참가자 권한, expected room/round version, phase 조건은 서버 RPC에서 다시
검사한다.

#### Realtime과 Reconnect

- `liar_rooms.version` 변경 trigger가 private Broadcast `state_changed`를 보낸다.
- 클라이언트는 Broadcast payload를 source of truth로 사용하지 않고 snapshot RPC를 다시
  호출한다.
- active room membership, expiry, topic 일치 여부를 `realtime.messages` policy에서 검사한다.
- refresh는 in-flight/queued 방식으로 직렬화한다.
- `online` 및 visible 복귀 시 snapshot을 갱신한다.
- player key 충돌 시 key를 한 번 재생성하여 resume한다.

#### Leave, Disconnect, End, Restart

- host가 명시적으로 나가면 진행 round/game과 room을 종료하고 전체 membership을 정리한다.
- 일반 round 참가자는 진행 중 임의 이탈이 제한된다.
- next round, restart, force end RPC가 별도로 존재한다.
- 단순 네트워크 단절은 leave가 아니며 host/current player 자동 승계 또는 timeout은 없다.

#### 평가

- 서버 권위와 version locking: **GREEN**
- 승인 회원 권한 경계: **RED**
- host/current participant disconnect 복구: **RED**
- 실행형 DB/phase 회귀 테스트: **RED**
- 현재 디렉터리와 CSS 구조: **GREEN, 유지**

### 3.2 Drawing Spy

Drawing Spy는 Liar의 독립 배포물이 아니라 같은 상태 머신의 게임 모드다.

| 개념 | 구현 |
| --- | --- |
| Room / Player / Host / Lobby / Ready | Liar와 동일 |
| Game Start | Liar round start + drawing 설정 snapshot |
| Current Player | 현재 drawing/speaking index에 대응하는 drawer |
| Phase | `DRAWING` 후 `DISCUSSION`, vote, result |
| Game State | Liar round + persisted drawing strokes |
| Realtime | room invalidation Broadcast + live stroke Broadcast |
| Presence | 없음 |
| Reconnect | Liar snapshot + drawing replay |
| Disconnect | current drawer 자동 skip 없음 |
| Leave / End / Restart / Result | Liar와 동일 |

stroke는 authoritative RPC로 저장하고 live stroke fragment만 Broadcast한다. Broadcast 송신
권한도 현재 DRAWING phase, current drawer, 제한 시간에 맞는지 서버에서 검사한다. 따라서
live packet 손실이 authoritative drawing state 손실과 같지는 않다.

Drawing Spy를 별도 폴더로 분리하면 room, round, UI, CSS, RPC를 복제하거나 복잡한 cross-app
dependency를 만들게 된다. **현재 Liar 내부 mode로 유지해야 한다.**

### 3.3 The Game

#### 로컬 게임

- `gameEngine.js`: deck, hand, pile, ±10, minimum play, turn, win/loss 순수 규칙
- `app.js`: 한 기기 UI와 pass-device 흐름
- Room, Realtime, Presence, reconnect 개념은 없다.

#### 온라인 Room과 State

확인되는 데이터 개념은 다음과 같다.

- `the_game_rooms`, `the_game_room_players`
- `the_game_games`: status, version, current seat, turn, pile values, draw count
- `the_game_game_players`: seat, hand count, 통계
- private player hands, draw pile, action log

게임 시작은 room row를 잠그고 expected version, host, player count, ready를 검사한 다음 서버가
shuffle/deal한다. 각 사용자의 private hand만 본인 snapshot에 포함한다.

#### Realtime과 Reconnect

- rooms, room players, games, game players의 PostgreSQL Changes를 구독한다.
- change event는 snapshot RPC 재조회 신호로만 사용한다.
- 새로고침 시 active game을 먼저 찾고, 없으면 active room을 찾는다.
- channel error, timeout, offline/online 후 snapshot 갱신과 재구독을 수행한다.
- Presence는 사용하지 않는다.

#### 중복과 경쟁 조건

카드 제출과 턴 종료는 expected version과 `client_action_id`를 받으며 server action log를
사용한다. UI busy guard도 중복 클릭을 줄인다. 다만 Marble처럼 하나의 논리 action ID를
유지한 transport retry/reconcile coordinator는 없다. response 유실 시 Realtime refresh로
최종 상태를 회복할 수 있으나 사용자에게 실패와 commit 사이의 모호성이 남을 수 있다.

#### 평가

- 순수 규칙 엔진 분리: **GREEN**
- 서버 shuffle/private hand/RPC 권위: **GREEN**
- Realtime invalidation과 새로고침 복귀: **GREEN**
- 누락된 초기 DB migration과 fresh install 재현성: **RED**
- current player disconnect 정지 가능성: **RED**
- transport retry 표준화: **YELLOW, 신규 게임부터 우선**

### 3.4 Marble

#### Room, Player, Host, Lobby

- `marble_rooms`, `marble_room_players`
- expected room version을 사용하는 ready, leave, start RPC
- waiting/finished 상태에서 host 이탈 시 다음 seat로 host 승계
- 진행 중 일반 leave는 `GAME_IN_PROGRESS`로 차단

#### Game State와 Phase

- `marble_games`: status, phase, current seat, turn, pending choice JSON, last roll JSON,
  last events JSON, winner, version
- `marble_game_players`: position, money, bankruptcy, skipped turns
- `marble_game_properties`: owner, building level
- private Classic nodes/rules와 action log

phase는 `WAITING_ROLL`, `WAITING_CHOICE`, `TURN_END`, `FINISHED`다. 주사위, 이동, 통행료,
event, 매입/건설, 파산, 다음 player 결정은 서버 RPC가 수행하며 renderer는 snapshot을 표현한다.

#### Realtime, Presence, Reconnect

- lobby는 room/player PostgreSQL Changes를 구독한다.
- game은 `marble_games` Changes를 구독하고 snapshot을 다시 읽는다.
- `marble-presence:${roomId}`에서 player ID를 track하지만 표시 목적으로만 사용한다.
- channel 장애 시 3초 polling fallback을 사용한다.
- online/offline/visibility 복귀를 처리한다.
- 늦게 도착한 낮은 version snapshot을 거부한다.
- dispose 시 subscription과 browser listener를 해제한다.

#### Idempotency

- expected game version과 `client_action_id`
- room/game row `FOR UPDATE`
- private action log replay
- transport 오류 시 같은 action ID로 한 번 재시도
- 응답이 계속 모호하면 최신 snapshot version으로 commit 여부 확인

현재 게임들 중 가장 강한 action/reconnect 패턴이다.

#### 주요 위험

`marble_end_game`은 host가 아니라 모든 active game member가 호출할 수 있다. 호출되면 진행
게임을 `abandoned`로 만들고 전체 room을 `closed`로 전환한다. UI 실수나 악의적 참가자 한
명이 전체 게임을 중단할 수 있는 실제 장애 경로다.

#### 평가

- 상태 권위, concurrency, retry, reconnect: **GREEN**
- Presence 격리: **GREEN**
- 전체 게임 종료 권한: **RED**
- 승인 회원 권한 경계: **RED**
- 공통화/이동: **DO NOT TOUCH**

## 4. Cross-Game Comparison

| 개념 | Liar | Drawing Spy | The Game | Marble |
| --- | --- | --- | --- | --- |
| Room | `liar_rooms` | Liar 공유 | `the_game_rooms` | `marble_rooms` |
| Player | auth user + player key | Liar 공유 | auth user + seat | auth user + room player |
| Host | player ID | Liar 공유 | user ID | user ID |
| Lobby / Ready | 있음 | 공유 | 있음 | 있음 |
| Game Start | host RPC | host RPC | host RPC, server deal | host RPC |
| Game State | game/round 정규화 | Liar + strokes | game rows + private hand/deck | game/player/property + 일부 JSON |
| Current Player | speaker/drawer index | drawer | current seat | current seat |
| Phase | 상세 round status | `DRAWING` 포함 | status + turn counters | 명시적 phase |
| Realtime | private Broadcast | + stroke Broadcast | Postgres Changes | Postgres Changes |
| Presence | 없음 | 없음 | 없음 | 있음 |
| Reconnect | active room + snapshot | + drawing replay | active game/room + snapshot | snapshot + polling fallback |
| Disconnect 처리 | 자동 처리 없음 | 자동 skip 없음 | 자동 처리 없음 | offline 표시만 제공 |
| Leave | host leave 전체 종료 | 동일 | 상태별 leave/close | active leave 차단 |
| End / Restart | round/game RPC | 동일 | result/rematch/close | finish/abandon |
| Result | round result/stats | 동일 | result/MVP/stats | winner/events |

실제로 의미가 같은 반복은 auth session, room code, host/ready, optimistic version, snapshot 복원,
Realtime invalidation, active room recovery, leave/end, network recovery다. 각 게임의 phase, turn,
result, rule state는 이름이 비슷해도 의미가 달라 공통 engine으로 올려서는 안 된다.

## 5. Supabase / Realtime Architecture

### 서버 권위

세 온라인 게임 모두 중요한 게임 상태를 browser의 직접 table update가 아니라 RPC로 변경한다.
이 원칙은 유지해야 한다.

```text
Client command
  → authenticated RPC
  → membership/role/phase/version 검증
  → row lock과 transaction
  → authoritative DB state
  → Realtime invalidation
  → authorized snapshot refresh
  → UI render
```

### RLS와 private state

- **Liar**: public game table의 직접 권한을 revoke하고 snapshot RPC로만 word, role, vote,
  guess, drawing history를 반환한다.
- **The Game**: private hand/deck/action log 사용이 문서화되어 있으나 초기 schema/RLS SQL이
  누락되어 최종 policy 전체를 저장소만으로 증명할 수 없다.
- **Marble**: public room/game/player/property에 membership RLS가 있고 private node/action log를
  사용한다.

### 승인 회원 경계

The Game의 확인 가능한 RPC는 `private.is_approved_member()`를 검사한다. Liar create/join과
Marble room/game RPC는 주로 `auth.uid()`와 game membership만 검사한다. 게임 hub가 승인
회원 route에 있더라도 직접 URL 또는 RPC 호출은 별도 보안 경계다. 서비스 정책이 승인된
청파 같이 회원만 게임을 사용할 수 있다는 것이라면 Liar와 Marble은 실제 권한 결함이다.

### Realtime 원칙

Realtime payload 자체를 source of truth로 쓰지 않고 invalidation으로만 사용해야 한다.

```text
Realtime event
  → local snapshot invalidate
  → authorized snapshot RPC
  → version compare
  → render
```

현재 세 게임 모두 대체로 이 방향을 따른다. 플랫폼은 하나의 transport를 강제하지 말고
`subscribeInvalidation(roomId, callback)` 같은 계약만 제공하는 편이 적절하다.

## 6. Repository Layout Risk

### 공통 영향

기존 게임을 `games/` 아래로 이동하는 것은 단순 파일 정리가 아니라 배포 URL 변경이다.

- GitHub Pages public URL과 bookmark
- 게임 허브 href
- 기존 초대 링크
- HTML/CSS/JS 상대 경로
- dynamic import와 cache-busted module URL
- popup/play-window URL
- E2E의 절대 URL
- CI path filter와 static checker 경로
- 외부에 공유된 방 링크

### 게임별 이동 위험

| 게임 | 위험도 | 근거 | 권고 |
| --- | --- | --- | --- |
| Liar | High | hub URL, HTML assets, CI path, module checker, public bookmark | 현재 위치 유지 |
| Drawing Spy | Critical | 독립 폴더 이동이 아니라 Liar state machine/UI/SQL 분해가 필요 | 분리 금지 |
| The Game | High | hub와 invite의 `/the-game/`, Playwright URL, relative CSS, dynamic imports | 현재 위치 유지, 이동 시 영구 redirect 필요 |
| Marble | Critical | root shared imports, popup/query boot, versioned imports, renderer/presentation/test graph | 이동 및 공통화 금지 |

신규 `games/` 디렉터리는 legacy를 옮기는 목적이 아니라 신규 게임을 위한 표준 영역으로
도입할 수 있다.

```text
# 기존 안정 경로
liar-game/
the-game/
marble-game/

# 신규 플랫폼
games/
├── shared/
│   ├── registry/
│   ├── auth/
│   ├── room/
│   ├── realtime/
│   └── testing/
├── cant-stop/
└── future-games/
```

## 7. Shared Platform Candidates

다음 후보는 두 개 이상의 게임에서 책임과 의미가 실제로 반복되며 게임별 예외가 상대적으로
적다.

### 7.1 Game Registry

```js
{
  id,
  title,
  href,
  icon,
  description,
  capabilities: { online, local, invite, presence }
}
```

신규 게임부터 registry에 등록하되 기존 게임 내부 import를 registry에 종속시키지 않는다.

### 7.2 Approved-member Auth Gate

- Supabase session 확인
- 승인 회원 여부 확인
- 로그인 return target
- sign-out/user-change cleanup

게임 규칙과 무관하고 모든 온라인 게임에서 의미가 같다.

### 7.3 Room/Lobby Contract

공통 구현보다 공통 interface가 적합하다.

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

각 게임은 독립 RPC prefix와 table을 유지한다.

### 7.4 Snapshot/Reconnect Coordinator

- refresh coalescing
- Realtime status
- online/offline/visibility refresh
- polling fallback
- stale version 거부
- dispose lifecycle

Marble을 참고 구현으로 삼을 수 있지만 기존 게임에 강제 이식하지 않는다.

### 7.5 Versioned Idempotent Action

신규 상태 변경 action은 기본적으로 다음을 사용한다.

```text
room_id
expected_version
client_action_id
```

서버 action log가 같은 action의 replay 또는 명시적 duplicate rejection을 제공해야 한다.

### 7.6 공통 DB Contract Tests

- anon denied
- authenticated but unapproved denied
- approved member allowed
- non-member snapshot denied
- non-host start denied
- stale version rejected
- duplicate action safely replayed/rejected
- concurrent action에서 정확히 하나만 성공
- reconnect가 authoritative snapshot 복구
- private player state 비노출

### 공통화하지 않을 대상

- 공통 `games` table 하나에 모든 state JSON 저장
- 공통 phase enum/turn machine/result schema
- Liar round와 Marble turn 통합
- 기존 RPC/table prefix 변경
- Marble engine을 모든 게임의 base class로 사용
- Drawing Spy를 독립 app으로 분리

## 8. Technical Debt

### The Game DB 이력 불완전

초기 lobby, online start, security/index, turn action, exit, rematch migration이 README에만 있고
SQL 파일은 없다. 이로 인해 fresh install, RLS 검증, disaster recovery, 후속 migration 적용을
저장소만으로 재현할 수 없다.

운영 DB를 변경하지 않고 read-only catalog dump와 migration history를 대조한 뒤, 누락
historical migration을 복원하거나 fresh environment 전용 canonical baseline을 만드는 것이
최소 대응이다.

### Liar 실행형 테스트 부재

Liar는 가장 복잡한 phase/RPC 집합을 보유하지만 전용 unit/integration test가 없다. 현재
보호막은 JS syntax, module linking, canonical blob 검증 중심이므로 동시 vote, runoff,
drawing race, reconnect transition, role/word privacy를 실제로 실행하지 않는다.

### SQL 테스트의 한계

Marble의 많은 테스트는 높은 가치가 있지만 일부는 migration source 문자열을 검사하는
contract test다. 실제 PostgreSQL transaction, RLS, Realtime publication을 실행하는 통합
테스트를 대체하지 않는다.

### 문서 drift

The Game root README의 개발 상태 일부는 현재 online gameplay/rematch/stats 구현보다 오래된
설명을 포함한다. 운영 판단에는 실제 코드와 `supabase/the-game/README.md`를 함께 봐야 한다.

### 인증 구현 편차

- Liar: 자체 config/client/session guard
- The Game: 자체 config/client와 CDN lazy loading
- Marble: root `js/supabaseClient.js` 재사용

20개 게임에서 이 편차가 반복되면 SDK/security fix의 누락 가능성이 커진다. 신규 게임부터
얇은 auth client/gate를 표준화할 가치가 있다.

### CSS 누적

Liar는 phase별 stylesheet와 override stylesheet가 순서 의존적으로 누적되어 있다. 정돈
가치는 있으나 현재 장애 근거는 부족하므로 기존 Liar CSS 통합은 **GREEN, 유지**다.

## 9. Stability Risks

### RED-1: Liar/Marble 승인 회원 권한 경계

**원인:** server RPC가 승인 상태보다 `auth.uid()`와 room membership만 검사한다.

**영향:** 승인 대기, 거절, 정지 계정이 직접 URL/RPC로 게임을 이용하거나 room/Realtime
resource를 사용할 가능성이 있다.

**최소 대응:** 운영 정책을 먼저 확인하고, 실제 정책이 승인 회원 전용이면 public entry
RPC에 guard를 추가한다. 적용 전에 permission regression test를 작성한다.

### RED-2: The Game schema 재현 불가

**영향:** 신규 환경 구성 실패, RLS/grant 감사 불가, 장애 복구 runbook 불완전.

**최소 대응:** 운영 DB를 재적용하지 말고 canonical baseline과 verification SQL을 복원한다.

### RED-3: 진행 중 disconnect로 게임 정지

- Liar host disconnect
- Drawing Spy current drawer disconnect
- The Game current seat disconnect
- Marble current player disconnect

모두 자동 승계/skip/timeout 정책이 없다. Presence가 있는 Marble도 표시만 하고 상태를 변경하지
않는다.

**최소 대응:** reconnect grace period, host/admin takeover, turn timeout, unanimous abort,
forfeit 정책을 게임별로 먼저 결정한다. 플랫폼은 heartbeat/presence/timeout primitive만
제공하고 결과 규칙은 게임이 소유한다.

### RED-4: Marble 전체 종료 권한

모든 active member가 전체 game을 abandoned로 만들고 room을 닫을 수 있다.

**최소 대응 후보:** host-only, 전원 동의, 명시적 forfeit 중 제품 정책을 결정한 뒤 RPC guard
하나를 최소 수정한다. Marble 전반 리팩터링은 필요하지 않다.

### RED-5: 실제 게임 DB 통합 검증 부재

authenticated Supabase CI는 community fixture와 community specs 중심이며, 게임 migration과
다중 client race를 실제 local Postgres에서 검증하지 않는다. 게임 platform 작업 전에 최소
DB integration suite가 필요하다.

## 10. GREEN / YELLOW / RED Matrix

| 영역 | 문제/상태 | 영향 게임 | 위험도 | 분류 | 권장 대응 |
| --- | --- | --- | --- | --- | --- |
| Authorization | 승인 회원 검증 없이 authenticated 사용자 허용 가능 | Liar, Drawing Spy, Marble | High | RED | 정책 확인 후 RPC guard 최소 보강 |
| DB Reproducibility | 초기 multiplayer migration 누락 | The Game | High | RED | 운영 변경 없이 canonical baseline 복원 |
| Disconnect | current player/host 단절 시 진행 정지 | 모든 온라인 게임 | High | RED | timeout/takeover 정책 결정 |
| Game End Permission | 모든 member가 전체 game abandon 가능 | Marble | High | RED | 종료 권한 정책 후 RPC 최소 수정 |
| Test Safety | phase/RPC 실행 테스트 부재 | Liar, Drawing Spy | High | RED | DB integration/regression test 선행 |
| Test Safety | 실제 Postgres/RLS/concurrency 검증 제한 | The Game, Marble | High | RED | local Supabase game suite |
| Realtime | event를 invalidation으로 사용 | 모든 온라인 게임 | Low | GREEN | 유지 |
| Server Authority | 핵심 mutation을 RPC에서 검증 | 모든 온라인 게임 | Low | GREEN | 유지 |
| Concurrency | row lock + expected version | 모든 온라인 게임 | Low | GREEN | 유지 |
| Idempotency | action replay와 same-ID retry | Marble | Low | GREEN | 신규 플랫폼 참고 모델 |
| Idempotency | client transport retry 계약이 약함 | The Game | Medium | YELLOW | 신규 게임부터 coordinator 적용 |
| Presence | 실제 Presence 없음 | Liar, Drawing Spy, The Game | Medium | YELLOW | 정책 필요 시 도입 |
| Presence | 표시 기능으로 격리 | Marble | Low | GREEN | 권위 판단에 사용하지 않고 유지 |
| Repository | 게임별 root directory 분산 | 전체 | Medium | YELLOW | 기존 유지, 신규 게임부터 개선 |
| Repository | 기존 게임 일괄 이동 | 전체 | High | RED | 수행하지 않음 |
| Drawing Spy | Liar 내부 mode | Drawing Spy | Low | GREEN | 유지 |
| CSS | override stylesheet 누적 | Liar | Low | GREEN | 장애 근거 없으므로 유지 |
| Architecture | engine/renderer/presentation 분리 | Marble | Low | GREEN | 보호 |
| Architecture | local engine/online controller 분리 | The Game | Low | GREEN | 유지 |
| URL | public path 하드코딩 | 전체 | Medium | YELLOW | 경로를 안정 계약으로 취급 |
| Shared Platform | 범용 Game Engine 부재 | 전체 | Low | GREEN | 만들 필요 없음 |
| Shared Platform | auth/room/reconnect 계약 부재 | 신규 게임 | Medium | YELLOW | Can't Stop부터 적용 |
| CI | The Game/Marble Node tests | 해당 게임 | Low | GREEN | 유지 |
| CI | Liar module/canonical 검사만 존재 | Liar | Medium | YELLOW | 실행형 DB 테스트 추가 |
| CI | authenticated multi-client game E2E 부재 | 모든 온라인 게임 | High | RED | platform 개발 전 smoke 구축 |

GREEN은 구조가 이상적이라는 의미가 아니라, 현재 정상 동작을 위험에 빠뜨리면서 굳이 수정할
필요가 없다는 의미다.

## 11. Recommended Target Architecture

### Option A: 기존 게임까지 모두 통합

```text
games/
├── shared/
├── liar-game/
├── drawing-spy/
├── the-game/
├── marble-game/
└── cant-stop/
```

| 항목 | 평가 |
| --- | --- |
| 안정성 | 낮음 |
| 변경 범위 | 매우 큼 |
| 유지보수성 | 장기 개선 가능, 초기 비용 큼 |
| 확장성 | 높을 가능성 |
| 회귀 위험 | Critical |

public URL, relative import, CI path, invite, popup route, CSS 순서와 state machine 분리까지
영향을 받는다. 현재는 권장하지 않는다.

### Option B: 기존 게임 유지 + 신규 게임만 신규 플랫폼

```text
liar-game/
the-game/
marble-game/

games/
├── shared/
│   ├── registry/
│   ├── auth/
│   ├── room/
│   ├── realtime/
│   └── testing/
├── cant-stop/
└── future-games/
```

| 항목 | 평가 |
| --- | --- |
| 안정성 | 가장 높음 |
| 변경 범위 | 작음 |
| 유지보수성 | legacy/new 이중 기준 관리 필요 |
| 확장성 | 높음 |
| 회귀 위험 | 낮음 |

안정성 우선의 기본안이다. `shared`는 신규 게임만 사용하고 기존 게임이 새 platform에
역방향 의존하지 않도록 한다.

### Option C: 일부 안전한 게임만 단계 이전

1. Can't Stop으로 platform 검증
2. 신규 게임 2~3개 추가
3. The Game의 room/reconnect adapter만 선택적으로 검토
4. Liar는 실제 필요가 생길 때만 검토
5. Marble은 마지막 또는 영구 legacy 유지

| 항목 | 평가 |
| --- | --- |
| 안정성 | 중간 |
| 변경 범위 | 단계별 통제 가능 |
| 유지보수성 | 검증 후 개선 가능 |
| 확장성 | 높음 |
| 회귀 위험 | 중간 |

Option B를 먼저 검증한 뒤 선택할 수 있는 장기안이다. 일부 이전 상태가 영구 혼합 구조가 될
수 있다는 비용을 명시적으로 받아들여야 한다.

## 12. Recommended Work Phases

### Phase 0 — Read-only Audit

- 이 보고서 작성
- 운영 DB catalog와 repository migration history의 추가 read-only 비교

### Phase 1 — 위험 확인과 재현

1. 승인 대기/정지 사용자로 Liar/Marble RPC 접근 확인
2. Marble 일반 참가자의 `end_game` 권한 확인
3. The Game 운영 schema와 누락 migration 대조
4. current player disconnect 시나리오 기록
5. 게임별 정상 reconnect baseline 기록

### Phase 2 — RED 항목 최소 안정화

1. 회귀 테스트 안전장치
2. The Game canonical DB baseline
3. 승인 회원 server guard
4. Marble end-game permission
5. 운영 장애가 확인된 disconnect/abandon 처리

기존 UI, URL, 폴더, DB 이름은 유지한다.

### Phase 3 — 신규 Game Platform Foundation

포함:

- game registry
- approved auth gate
- room/lobby interface
- snapshot/reconnect coordinator
- invalidation subscription interface
- action ID/version contract
- error normalization
- DB/test harness

제외:

- 공통 game engine
- 공통 phase/state JSON/result schema
- 기존 게임 adapter 강제 구현

### Phase 4 — Can't Stop

게임 전용 상태:

```text
dice
pairing choices
columns
temporary runners
secured markers
bust
current player
phase
```

플랫폼 책임:

```text
room
player
host
ready
start
snapshot
reconnect
invalidation
idempotent action
leave/end
```

### Phase 5 — Platform 검증

- 실제 2~4 client E2E
- duplicate click
- ambiguous network failure
- refresh/reconnect
- host/current player disconnect
- stale version race
- mobile background/foreground
- permission boundary

### Phase 6 — 신규 게임 지속 추가

두 번째 신규 게임에서 shared layer가 같은 의미로 실제 재사용되는지 확인한다. 예외가 늘면
abstraction을 축소한다.

### Optional — 기존 게임 선택적 마이그레이션

- 운영 장애나 유지보수 비용이 입증된 부분만 adapter 단위로 검토
- public URL과 DB namespace 유지
- Marble은 마지막
- Drawing Spy 분리는 제외

## 13. Before Can't Stop Checklist

### MUST BEFORE CAN'T STOP

- [ ] 신규 게임 approved-member 정책 확정
- [ ] Room/Player/Host/Ready 최소 계약 정의
- [ ] `expected_version + client_action_id` mutation 계약 정의
- [ ] snapshot을 authoritative state로 삼는 원칙 확정
- [ ] Realtime을 invalidation으로 사용하는 원칙 확정
- [ ] active room/game reconnect 규칙 정의
- [ ] host/current-player disconnect와 grace period 정책 결정
- [ ] leave, forfeit, abort, room close 의미 구분
- [ ] private player state 비노출 계약 마련
- [ ] local Supabase RLS/RPC integration test harness 마련
- [ ] concurrent/duplicate action 테스트 마련
- [ ] game registry와 public URL naming convention 결정
- [ ] migration naming, baseline, fresh-install verification 규칙 결정
- [ ] 신규 게임 CI path와 최소 test command 결정

### CAN WAIT

- [ ] 기존 Liar client의 공통 reconnect helper 이전
- [ ] Liar/The Game Presence 도입
- [ ] 기존 게임 error code 통일
- [ ] 기존 게임 공통 UI component화
- [ ] 기존 CSS 정리
- [ ] 기존 게임 metadata의 registry 이전
- [ ] The Game client의 Marble형 transport retry 도입
- [ ] 기존 게임 invite 지원 확대
- [ ] 기존 게임의 선택적 adapter 작성

### DO NOT TOUCH

- [ ] Marble 디렉터리 이동
- [ ] Marble renderer/presentation을 플랫폼 공통 코드로 흡수
- [ ] Drawing Spy를 Liar에서 분리
- [ ] 기존 게임 DB table/RPC prefix 통합
- [ ] 모든 게임 state를 단일 JSON schema로 통합
- [ ] 기존 public URL 삭제
- [ ] Liar CSS 전체 병합/재작성
- [ ] Can't Stop 전에 기존 게임 선행 마이그레이션
- [ ] 운영 migration 재실행
- [ ] 안정성 근거 없는 repository 미관 정리

## 감사 시 수행한 검증

| 명령 | 결과 |
| --- | --- |
| `npm run test:the-game` | 20개 통과 |
| `npm run test:marble` | 186개 통과 |
| `node --experimental-vm-modules scripts/check-liar-modules.mjs` | 33개 module link 통과 |
| `node scripts/build-liar-canonical.mjs --check` | v1.0.0, 20개 pinned blob 확인 |
| `node scripts/check-site.mjs` | 69개 site JS 및 정적 계약 통과 |
| `node --check` 대상 게임/사이트 JS | 통과 |

`npm run test:e2e`는 Playwright artifact 생성 가능성과 실제 게임 Supabase backend를 검증하지
않는 mock 중심 구성 때문에 Read-only 감사에서 실행하지 않았다. `npm run build:assets`도
generated asset을 작업 트리에 다시 쓸 수 있어 실행하지 않았다.

## 최종 권고

1. 기존 세 public game 경로와 Drawing Spy 결합 구조를 유지한다.
2. RED 항목은 폴더 재배치가 아니라 권한, 재현성, disconnect 정책, 통합 테스트 중심으로
   최소 안정화한다.
3. 신규 `games/`는 legacy 이동 대상이 아니라 Can't Stop부터 시작하는 신규 표준 영역으로
   사용한다.
4. shared platform은 auth, room, versioned action, snapshot, reconnect, Realtime invalidation,
   test contract만 담당한다.
5. Marble은 reference implementation으로 참고하되 migration target으로 삼지 않는다.
6. Can't Stop 이후 두 번째 신규 게임에서도 동일 책임의 반복이 확인되기 전까지 shared
   abstraction을 확대하지 않는다.
