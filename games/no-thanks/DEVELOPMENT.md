# No Thanks! 개발 진행

> 이 문서는 현재 개발 상태를 다음 작업자나 다음 채팅으로 전달하기 위한 인수인계 문서입니다.
> 게임 규칙과 기능 설계의 기준은 같은 디렉터리의 `GAME_SPEC.md`입니다. UI/presentation은 `UI_DESIGN.md` adoption baseline과 `UI_DECISIONS.md`의 최신 non-superseded override를 함께 적용합니다. 이 문서에 이미 남아 있는 UI Phase 기록은 과거 인수인계 이력으로 보존하되 이후 세부 UI 이력은 `UI_DECISIONS.md`에 기록합니다.

## Current Status

- Phase: Release readiness — functional/operational gates pending; design track은 `UI_DECISIONS.md`에서 별도 PAUSED
- Status: IN_PROGRESS
- Active branch: `main` (현재 구현 브랜치 없음; 이 checkpoint가 main에 반영된 뒤 handoff baseline으로 사용)
- Phase A–D merge baseline: `66531c7820285b37dc8d1e2961156ab95560758f`
- 마지막 기록: 2026-09-23

## Completed

- Board UI Phase A–D 작업 PR #364 (`feature/no-thanks-board-ui-phase1-a-d`)을 최신 `main`과 충돌 없이 재동기화한 뒤 2026-09-22에 병합했습니다. 병합 commit은 `66531c7820285b37dc8d1e2961156ab95560758f`입니다.
- WAITING / PLAYING 공통 대형 board scene, 3–7인 viewer 6시 기준 좌석 회전, compact HUD, site profile avatar, 실제 타원 table border 중심선 기반 좌석 geometry를 현재 main baseline으로 확정했습니다.
- 개인 패널의 `내 보유 칩`, 정확한 own chip count/cluster, 오름차순 획득 카드, 동적 overlap, corner number, top-only hover/focus를 구현했습니다.
- TAKE_CARD presentation은 중앙 공개 카드 → 내 보유 카드, 중앙 칩 batch → 내 보유 칩, 이후 draw deck → 다음 current card 순서로 handoff하도록 구현했습니다.
- TAKE 카드/칩 landing과 다음 deal lifecycle을 분리해 same-snapshot rerender 중 획득 카드가 잠깐 사라지거나 이전 카드가 다시 숨겨지는 race condition을 수정했습니다.
- 카드 landing 대상은 generic hidden slot이 아니라 `data-card-value` 기준 최신 DOM으로 한정하고, `takeCardLanded / takeChipsLanded` 상태 이후에는 authoritative final hand/chip state를 유지하도록 했습니다.
- deal presentation lifecycle을 `started → running → completed`로 관리하고 실제 landing 전까지 current card를 `is-awaiting-deal`로 숨겨 새 카드와 flight card가 겹치는 문제를 막았습니다.
- `roomId:version:currentCard:deckRemaining` 기반 `lastSettledDealKey`를 기록해 브라우저 최소화/다른 탭 이동 후 `visibilitychange / pageshow` refresh가 발생해도 이미 공개 완료된 카드의 deal animation이 재생되지 않도록 수정했습니다.
- 중앙 칩 획득은 TAKE 시점 center count를 고정 batch로 소비하고 약 620ms + 26ms stagger의 단일 Web Animation batch로 처리해 중복/추가 칩처럼 보이는 tail 현상을 정리했습니다.
- draw deck → current card는 약 760ms fixed flight/flip + 약 130ms settle/handoff로 유지하며, 실제 current card DOM은 landing 시점에만 공개합니다.
- Phase A–D 작업 동안 기능/DB authority와 same-room rematch lifecycle은 기존 main 구현을 보존했고, UI/presentation 결정은 `UI_DESIGN.md`에 반영했습니다.


- 최신 `main` `fda8e2294356...`의 Game Platform Development/UI 규칙과 No Thanks! same-room rematch lifecycle을 현재 UI 작업 브랜치에 통합했습니다.
- 당시 UI_DESIGN 중심 규칙에 따라 UI/presentation 결정을 `UI_DESIGN.md`에 정리했고, #364에서 중복 추가했던 rematch migration/옛 rematch error 계약은 최신 main 구현을 따르도록 제거했습니다. 현재는 해당 문서를 adoption baseline으로 보존하고 후속 결정은 `UI_DECISIONS.md`가 담당합니다.
- WAITING / PLAYING 공통 대형 board scene, 중앙 타원 table, 3–7인 viewer 6시 고정 표현 회전, compact HUD, site profile avatar 좌석을 구현했습니다.
- 개인 패널에 정확한 내 칩 수와 visual chip cluster, 오름차순 보유 카드, 동적 overlap, corner number, top-only hover/focus를 구현했습니다.
- 현재 카드 직접 클릭으로 take, 중앙 `칩 1개 내기`로 refuse를 수행하며 기존 server-authoritative gameplay action 계약을 그대로 사용합니다.
- draw deck → current card 공개는 약 760ms fixed flight/flip + 약 130ms landing handoff로 구성했고, chip 제출은 약 780ms flight + 100ms dwell 뒤 중앙 pile/count를 반영합니다.
- take/refuse 성공 경로는 silent busy lock을 사용해 authoritative result snapshot 기준 전체 render를 1회로 줄였습니다.
- main의 GAME_OVER host succession / same-room rematch / replacement 참가 가능 계약은 UI 변경보다 우선해 그대로 유지했습니다.

- Game Platform 공통 재대결 규칙에 맞춰 새 room 생성 방식 대신 기존 room/player context를 유지하는 authoritative rematch lifecycle로 전환했습니다.
- `no_thanks_prepare_rematch` RPC가 GAME_OVER → waiting reset, private state/획득 카드 초기화, ready/start 재사용을 처리하도록 추가했습니다.
- GAME_OVER에서 방장이 나가면 남은 active player에게 host를 승계하도록 terminal leave 정책을 보완했습니다.
- rematch lifecycle을 Game Platform DB/Test Contract 필수 시나리오로 승격하고 Can't Stop / No Thanks!가 각각 자기 RPC로 계약을 증명하도록 통합 테스트를 추가했습니다.

- Game Platform UI 규칙 도입에 맞춰 No Thanks!의 원본 디자인 조사 방향, Visual Identity, 카드/칩 layout, motion, result/rematch, responsive 구현 기준을 `UI_DESIGN.md`에 분리해 관리하기 시작했습니다.
- 규칙 엔진 재정렬 PR #347이 병합된 최신 `main` (`049493f8...`)을 기준으로 Phase 3 작업 브랜치를 생성했습니다.
- 기존 #343/#344의 공통 foundation 전체 Registry 목록/개수 고정 변경은 새 Game Platform 규칙에 맞지 않아 가져오지 않았습니다.
- 저장소 `AGENTS.md`와 게임 플랫폼 신규 게임 개발 규칙을 확인했습니다.
- `games/shared/`의 공통 계약과 데이터베이스 통합 검증 계약을 확인했습니다.
- AMIGO 공식 No Thanks! 영문 규칙서를 기준으로 첫 버전 규칙을 확정했습니다.
- 첫 버전은 3–7인 기본 규칙으로 구현하며 2024년 재판의 22장 특수 카드 확장은 후속 개발 단계로 분리했습니다.
- 공식 규칙의 보유 칩 비공개 원칙을 사용자별 비공개 스냅샷 요구사항에 반영했습니다.
- 온라인 환경의 선 플레이어는 서버가 무작위로 결정하도록 확정했습니다.
- 전체 게임 종료 권한은 방장만 가지도록 확정했습니다.
- `games/no-thanks/rules.js`에 순수 규칙 엔진을 구현했습니다.
- 3–5인 11개, 6인 9개, 7인 7개의 시작 칩 계산을 구현했습니다.
- 서버가 준비한 24장 카드 구성을 검증하고 첫 공개 카드와 남은 카드 상태를 초기화하도록 구현했습니다.
- 카드 거절 시 칩 1개 차감, 중앙 칩 증가, 다음 플레이어 이동을 구현했습니다.
- 보유 칩이 0개라면 카드 거절을 허용하지 않고 카드 가져오기만 가능하도록 구현했습니다.
- 카드 가져오기 시 중앙 칩을 획득하고 같은 플레이어가 다음 카드도 계속 처리하도록 구현했습니다.
- 연속된 숫자 묶음에서는 가장 낮은 숫자만 합산하고 남은 칩 수를 차감하는 점수 계산을 구현했습니다.
- 마지막 카드 획득 시 최종 점수와 공동 승자를 계산하고 `GAME_OVER`로 전환하도록 구현했습니다.
- 규칙 엔진이 입력 상태를 직접 변경하지 않고 새 상태를 반환하도록 구현했습니다.
- 규칙 엔진 단위 테스트 12개를 추가했습니다.
- 실행 코드가 시작됨에 따라 게임 등록부에 `no-thanks`를 등록했습니다.
- No Thanks! Registry/capability 검증은 공통 foundation이 아니라 게임별 `tests/game-platform-no-thanks-registry.test.js`에서 수행하도록 새 구조에 맞췄습니다.
- 아직 실제 제공 전이므로 `online`, `local`, `invite`, `presence` 기능은 모두 비활성 상태로 유지했습니다.
- `games/no-thanks/index.html`에 신규 게임 전용 entry page를 추가하고 shared `game-shell.css`를 명시적으로 opt-in 했습니다.
- `createGameAccessGate`를 사이트 `initializeAuth / getAuthState / subscribeAuth`와 연결해 로그인/승인회원 경계를 적용했습니다.
- 승인된 사용자만 Common Game Shell을 볼 수 있고, 미로그인/미승인 사용자는 사이트 공통 로그인/승인 상태 화면으로 이동할 수 있게 했습니다.
- 게임별 닉네임 입력을 만들지 않고 사이트 프로필의 `display_name`만 플레이어 표시 이름으로 사용하도록 연결했습니다.
- 프로필 닉네임이 누락된 경우 임시 이름을 생성하지 않고 마이페이지 확인을 안내합니다.
- 아직 방/로비 서버가 없으므로 방 생성·참가·게임 시작 기능을 노출하지 않고 준비 화면임을 명시했습니다.
- 플레이 전과 화면 하단에서 다시 열 수 있는 No Thanks! 기본 규칙 dialog를 추가했습니다.
- No Thanks! entry/shell 전용 정적 계약 테스트를 추가했습니다.
- 최신 `main` 커밋 `220bf820...`에서 Phase 4 작업 브랜치를 생성했습니다.
- `no_thanks_rooms / no_thanks_room_players / no_thanks_room_actions / no_thanks_room_private_state` DB foundation을 추가했습니다.
- 3–7인 create/join/snapshot/ready/leave/start RPC와 explicit grant/RLS 경계를 추가했습니다.
- 방 생성/참가 시 클라이언트 닉네임을 받지 않고 서버가 승인된 사이트 프로필 `display_name`을 확정하도록 구현했습니다.
- start RPC가 최소 3명, 방장 권한, non-host ready 상태, expected version을 서버에서 검증하도록 구현했습니다.
- start 시 서버가 turn order와 3–35 카드 순서를 무작위 확정하고 첫 공개 카드만 public state에 노출하도록 구현했습니다.
- 남은 23장, 제외된 9장, 플레이어별 칩 수는 별도 private table에 저장하고 authenticated select/Reatime 대상에서 제외했습니다.
- snapshot은 호출자 자신의 칩 수만 `viewer.counters`로 합성하도록 구현했습니다.
- ready/start에 `client_action_id` + request payload를 기록해 동일 요청 replay는 같은 snapshot을 반환하고 다른 payload 재사용은 거부하도록 구현했습니다.
- shared `defineRoomLobbyAdapter` 계약에 맞는 `createNoThanksRoomLobbyAdapter`를 추가했습니다.
- 당시 No Thanks! migration을 disposable Game DB integration harness에 포함하고 플랫폼 필수 10개 시나리오 테스트를 추가했습니다. 이후 same-room rematch 계약이 추가되어 현재 테스트는 11개 필수 시나리오를 구현합니다.
- Phase 4 PR #353 head를 부모로 별도 Phase 5 브랜치를 생성해 DB foundation과 runtime 연결 변경을 분리했습니다.
- No Thanks! entry에 Supabase browser client를 로드하고 `createNoThanksRoomLobbyAdapter`를 실제 runtime에 연결했습니다.
- 방 만들기에서 최대 인원을 3–7명으로 선택하고, 코드 참가에서는 6자리 방 코드만 입력하도록 사용자 흐름을 추가했습니다.
- 게임별 닉네임 입력은 추가하지 않았고 서버가 사이트 프로필 `display_name`을 확정하는 기존 권한 경계를 유지했습니다.
- waiting room에서 authoritative snapshot의 room code, 인원, ready 상태, host를 Common Game Shell roster에 연결했습니다.
- 일반 플레이어는 준비/준비 취소를, 방장은 최소 3명 + 일반 플레이어 전원 ready일 때만 게임 시작을 요청하도록 연결했습니다.
- shared `createSnapshotCoordinator`와 `createReconnectRefreshTriggers`를 사용해 Realtime payload는 invalidation으로만 소비하고 RPC snapshot을 다시 읽도록 구현했습니다.
- online/pageshow/visibility 복귀 시 최신 snapshot을 다시 조회하고, host가 waiting room을 닫아 `ROOM_NOT_FOUND`가 되면 다른 참가자도 entry로 복귀하도록 처리했습니다.
- 게임 시작 후 서버가 확정한 첫 카드, 본인 칩 수, 남은 카드 수를 읽기 전용 preview로 표시하고 `REFUSE_CARD / TAKE_CARD` UI는 아직 노출하지 않았습니다.
- No Thanks! 전용 lobby controller/runtime model 테스트를 추가하고 기존 shell 계약 테스트를 online lobby 단계에 맞게 갱신했습니다.
- 최신 `main` 커밋 `f47bf8bbb9d016c706b1c289cf4081646ddbabcd`에서 Phase 6 작업 브랜치를 생성했습니다.
- 기존 Room/Lobby foundation migration을 수정하지 않고 후속 gameplay migration `20260922055300_no_thanks_gameplay_actions.sql`을 추가했습니다.
- game-local `no_thanks_play_action` RPC가 `refuse_card / take_card / end_game`을 서버 권위로 처리하도록 구현했습니다.
- gameplay action도 `expected_version + client_action_id`를 사용하고 room/private state를 transaction 안에서 잠가 stale/duplicate/concurrent action을 방어합니다.
- `REFUSE_CARD`에서 현재 차례와 private counter를 서버가 검증하고 칩 1개 차감, 중앙 칩 증가, 다음 플레이어 이동을 구현했습니다.
- `TAKE_CARD`에서 공개 카드 획득, 중앙 칩 수령, private draw deck의 다음 카드 공개, 같은 플레이어 turn 유지를 구현했습니다.
- 마지막 카드 획득 시 공개 카드와 private counter를 기준으로 연속 카드 점수, 최종 점수, 공동 승자를 서버에서 계산해 `GAME_OVER / LAST_CARD_TAKEN`을 확정합니다.
- 방장 전용 `END_GAME`을 추가하고 확인 dialog 뒤 서버가 방장 권한을 다시 검증해 `GAME_OVER / HOST_TERMINATED`으로 전환하도록 구현했습니다. 수동 종료 시 최종 점수와 승자는 계산하지 않습니다.
- 자연 종료 또는 방장 수동 종료 후에는 결과방에서 참가자가 안전하게 leave할 수 있도록 terminal leave 경계를 확장했습니다.
- `createNoThanksGameplayAdapter`를 추가하고 shared Room/Lobby 계약은 변경하지 않은 채 game-local controller에 gameplay command만 연결했습니다.
- 실제 플레이 화면에 현재 카드, 중앙 칩, 본인 칩, 남은 카드, 모든 플레이어의 공개 획득 카드와 현재 차례를 표시하도록 연결했습니다.
- 내 차례에서만 거절/가져오기 버튼을 활성화하고, 본인 칩이 0개라면 거절 버튼을 비활성화해 강제 가져오기 상태를 명확히 표시합니다.
- 자연 종료 결과 화면에 최종 점수와 공동 승자를 표시하고, 방장 수동 종료는 별도 종료 사유를 표시하도록 구현했습니다.
- gameplay adapter/controller/runtime/shell 정적 테스트와 disposable Supabase gameplay DB integration 시나리오를 추가했습니다.
- 동일 `client_action_id` gameplay 요청이 동시에 두 번 도착하는 경우에도 room lock 획득 후 action row를 다시 확인해 첫 authoritative snapshot으로 수렴하도록 idempotency 경계를 보강했습니다.
- concurrent duplicate retry가 둘 다 동일 snapshot을 반환하고 room version은 한 번만 증가하는 disposable DB integration 회귀 테스트를 추가했습니다.
- 최신 `main` 커밋 `20bdc844d5bf3012dad38146814a09ae6e057257`에서 Phase 7 안정화 브랜치를 생성했습니다.
- Supabase Realtime Presence를 사용하는 game-local `createNoThanksPresenceAdapter`를 추가했습니다.
- Presence key는 브라우저 client 단위로 생성하고 payload에는 `userId / onlineAt`만 전송해 게임 상태나 비공개 칩 정보를 싣지 않도록 했습니다.
- 같은 사용자가 여러 탭으로 접속한 경우 Presence state를 user id 기준으로 합쳐 한 명의 온라인 사용자로 표시하도록 구현했습니다.
- Presence는 온라인/오프라인 UI 표시 전용이며 ready/start/turn/action 권한의 authoritative 조건에는 사용하지 않도록 분리했습니다.
- 브라우저 `offline` 이벤트에서는 게임 상태를 변경하지 않고 connection banner만 오프라인으로 전환하며, `online / pageshow / visibility` 복귀 시 기존 shared reconnect refresh 경로로 authoritative snapshot을 다시 조회합니다.
- 브라우저 종료·네트워크 단절 시 membership/turn/host 권한을 유지하고 재접속 시 기존 active room snapshot으로 복원하는 정책을 확정했습니다.
- 방장이 연결을 잃어도 자동 방장 위임이나 자동 게임 종료를 하지 않고, 현재 차례 플레이어가 끊겨도 turn을 유지해 재접속 후 이어서 진행하도록 UI 안내를 추가했습니다.
- roster에 Presence 기반 `재접속 대기` 상태와 현재 차례 표시를 연결했습니다.
- 재대결은 같은 room code와 active membership을 유지하면서 public/private gameplay state를 초기화하고 waiting/ready 상태로 돌아가는 방식으로 변경했습니다.
- 재대결 준비는 host-only authoritative RPC이며 version/client_action_id 경계를 사용하고, 이전 private deck/counter와 획득 카드를 초기화합니다.
- GAME_OVER에서 방장이 이탈하면 다음 active seat로 host를 승계해 남은 참가자의 재대결 흐름을 유지합니다.
- Presence lifecycle, 다중 탭 user merge, offline→online refresh, same-room rematch/reconnect 정책에 대한 회귀 테스트를 유지·확장했습니다.
- 최신 `main` 커밋 `2454e5e9d8a76a26002f794f8338255b62aababb`에서 Phase 8 검증 브랜치를 생성했습니다.
- disposable Supabase에서 3개의 독립 승인회원 인증 세션이 같은 room에 참가해 각자 비공개 칩 snapshot을 받고, 세 플레이어가 한 번씩 거절한 뒤 자연 종료까지 진행하는 다중 클라이언트 통합 시나리오를 추가했습니다.
- 3인 시나리오에서 명시적 leave 없이 `get_my_active_room`으로 재접속했을 때 최신 room/version/turn/center counter가 복원되는지 검증하도록 했습니다.
- disposable Supabase에서 7개의 독립 승인회원 인증 세션이 모두 참가·준비·시작하고, 일곱 플레이어가 한 번씩 거절해 full turn cycle을 만든 뒤 각 viewer의 private counter가 6으로 독립 유지되는지 검증하는 시나리오를 추가했습니다.
- 7인 시나리오에서 7개 중앙 칩을 현재 플레이어가 가져간 뒤 본인 칩이 13으로 계산되고 같은 플레이어가 turn을 유지하는지 검증하도록 했습니다.
- 3인·7인 모두 다른 플레이어 counter가 public player snapshot에 노출되지 않는지 반복 검증하도록 했습니다.
- 자동 검증과 실제 브라우저/운영 검증을 분리한 `games/no-thanks/RELEASE_CHECKLIST.md`를 추가했습니다.
- 실제 브라우저 Presence join/leave, 모바일 background 복귀, host/active-player disconnect는 자동 DB 테스트가 대체하지 않는 manual release gate로 명시했습니다.
- 운영 Supabase 프로젝트와 main의 `SUPABASE_URL`이 동일한 프로젝트를 가리키는 것을 확인했습니다.
- 운영 DB에 `no_thanks_room_lobby_foundation`과 `no_thanks_gameplay_actions` migration을 순서대로 적용했습니다.
- 브라우저 Realtime invalidation을 위해 공개 테이블 `no_thanks_rooms / no_thanks_room_players`만 `supabase_realtime` publication에 등록하는 migration을 추가·적용했습니다.
- `no_thanks_room_actions / no_thanks_room_private_state`는 Realtime publication에 포함하지 않았습니다.
- 운영 권한 검증에서 anon의 create/play RPC 실행이 차단되고 authenticated만 허용되는 것을 확인했습니다.
- private state table은 anon/authenticated SELECT가 모두 차단되고 공개 room/player table은 RLS가 활성화된 것을 확인했습니다.
- 내부 `private.no_thanks_snapshot` helper가 authenticated에 기본 EXECUTE 권한을 가지고 있는 것을 발견해, private helper 권한 hardening migration을 추가·적용했습니다.
- hardening 후 snapshot/generate/profile/card-score helper는 anon/authenticated 직접 실행이 차단되고, RLS에 필요한 `private.no_thanks_is_room_member`만 authenticated에 유지되는 것을 확인했습니다.
- 운영 적용 후 Supabase security/performance advisor를 다시 실행해 No Thanks! 관련 신규 critical/error 항목이 없음을 확인했습니다.

## Current Work

- Phase A–D 구현과 안정화는 PR #364 병합으로 완료했으며, 해당 UI 세부 이력은 과거 기록으로 보존합니다.
- 아직 게임을 `RELEASED`로 전환하지 않았으며 기능/운영 관점에서는 Registry capability 활성화와 실제 운영 브라우저 release gate가 남아 있습니다.
- 디자인 트랙은 `UI_DECISIONS.md`의 `MANUAL_DESIGN_REVIEW (PAUSED)` 상태가 기준이며, 이 문서에서 Phase E나 visual polish 세부 TODO를 중복 관리하지 않습니다.
- 다음 구현 시작 전 No Thanks! 관련 진행 중 game-id 브랜치를 먼저 확인합니다. 명확한 진행 중 checkpoint/implementation 브랜치가 있으면 그 브랜치를 이어가고, 없다면 종료된 `feature/no-thanks-board-ui-phase1-a-d`를 재사용하지 않고 최신 `main`에서 새 브랜치를 생성합니다.

## Next Work

1. 다음 기능/운영 작업 시작 시 최신 `main`, 이 `DEVELOPMENT.md`, `GAME_SPEC.md`, `RELEASE_CHECKLIST.md`와 No Thanks! 관련 진행 중 game-id 브랜치를 먼저 확인합니다. UI 작업이 포함되면 `UI_DESIGN.md` adoption baseline과 `UI_DECISIONS.md`의 최신 decision을 추가로 확인합니다.
2. `RELEASE_CHECKLIST.md`의 same-room rematch / Presence / reconnect / 운영 브라우저 smoke gate를 완료합니다.
3. production 상태와 게임별 DB/Test Contract, 권한 경계가 release 기준과 일치하는지 최종 확인합니다.
4. 남은 release blocker가 없을 때 실제 제공할 `online` / `presence` capability만 Registry에서 활성화하고 사용자 노출 경로를 검증합니다. `invite`는 별도 구현·검증 전까지 비활성으로 유지합니다.
5. 디자인 closeout 상태는 `UI_DECISIONS.md`에서 확인한 뒤 기능/운영 gate와 함께 release closeout 여부를 판단합니다.

## Decisions

- 게임 식별자: `no-thanks`
- 지원 인원: 3–7명
- 첫 버전 규칙: 기본 규칙만 구현
- 숫자 카드: 3–35
- 카드 준비: 33장 중 9장을 비공개로 제외하고 24장을 사용
- 규칙 엔진의 초기 카드 입력: 서버가 이미 확정한 24장 순서를 전달
- 규칙 엔진 내부에서 난수 생성: 하지 않음
- 시작 칩: 3–5인 11개, 6인 9개, 7인 7개
- 플레이어 보유 칩 수: 다른 플레이어에게 비공개
- 현재 카드 위에 쌓인 칩 수: 공개
- 각 플레이어가 획득한 숫자 카드: 공개
- 카드를 가져간 뒤에는 같은 플레이어가 다음 카드도 계속 선택
- 카드를 거절하면 다음 플레이어로 차례 이동
- 칩이 0개라면 현재 카드를 반드시 가져가야 함
- 점수 계산: 연속 숫자 묶음의 가장 낮은 숫자만 합산하고 남은 칩 수를 차감
- 최저 점수 동점: 공동 승리
- 선 플레이어: 서버가 무작위 결정
- 카드 섞기, 제외 카드, 공개 순서, 칩 사용 가능 여부, 최종 점수는 서버가 최종 판단
- 특수 카드: 후속 개발로 보류
- 게임 내부 닉네임 입력 또는 변경 기능: 제공하지 않음
- 전체 게임 종료 권한: 방장만 가능
- 게임 등록부 기능 상태: 현재 모두 비활성
- Access Gate: shared `createGameAccessGate` 사용
- 사용자 표시 이름: 사이트 프로필 `display_name`만 사용
- Common Game Shell: shared `createGameShell` 사용
- 현재 entry 단계의 플레이어 표시: 승인된 현재 사용자 1명만 접속 계정으로 표시
- 방 생성/코드 참가/준비/방장 시작 UI: Room/Lobby RPC에 연결 완료
- 게임 규칙 안내: game-local dialog로 제공하며 entry와 Shell action에서 다시 열 수 있음
- Room/Lobby DB namespace: `no_thanks_*` game-local 객체 사용
- 방 최대 인원: 생성 시 3–7명 범위에서 서버 검증
- 방 생성/참가 표시 이름: 클라이언트 입력 없이 서버가 `profiles.display_name` 사용
- room 공개 state와 카드/칩 private state를 물리적으로 별도 table로 분리
- Realtime invalidation: 공개 room/player table만 구독하고 private table은 구독하지 않음
- 게임 시작 조건: 방장 호출 + 3명 이상 + non-host 전원 ready
- 시작 시 서버 난수: turn order와 33장 카드 순서를 서버에서 생성
- 공개 카드: 24장 중 첫 카드만 snapshot 공개, 남은 23장/제외 9장은 private
- 초기 칩 수: 3–5인 11, 6인 9, 7인 7을 서버 private state에 저장
- Room/Lobby runtime 상태: shared Snapshot Coordinator + reconnect refresh trigger 사용
- Realtime payload 사용 방식: 화면 state로 직접 사용하지 않고 authoritative snapshot 재조회 신호로만 사용
- entry 입력: 최대 인원 + 방 코드만 제공하고 game-local 닉네임 입력은 제공하지 않음
- waiting room 방장 ready: 별도 버튼 없이 준비 완료로 간주하며 일반 플레이어 전원 ready를 시작 조건으로 계산
- PLAYING UI: 현재 카드/중앙 칩/본인 칩/남은 카드/공개 획득 카드 표시와 서버 권위 거절/가져오기 action 연결
- gameplay RPC: shared 계약을 확장하지 않고 game-local `no_thanks_play_action` 하나에서 `refuse_card / take_card / end_game` 처리
- gameplay mutation: room version, active player, private counter/deck을 서버 transaction에서 최종 검증
- 자연 종료: 마지막 카드 획득 시 서버가 `GAME_OVER / LAST_CARD_TAKEN`, 최종 점수와 공동 승자를 확정
- 수동 종료: 방장 확인 dialog + 서버 방장 권한 검증 후 `GAME_OVER / HOST_TERMINATED`, 점수/승자 미계산
- 결과방 이탈: GAME_OVER에서 허용하고 진행 중 PLAYING에서는 일반 leave를 차단
- 연결 끊김 정책: 비정상 disconnect는 leave가 아니며 membership/turn/host 권한을 유지
- Presence 용도: 접속 상태 표시 전용이며 server authorization이나 gameplay legality 판정에는 사용하지 않음
- Presence payload: `userId / onlineAt`만 사용하고 game state/private counter는 포함하지 않음
- 다중 탭: client별 Presence key를 사용하고 동일 user id는 온라인 1명으로 합산
- 방장 disconnect: 자동 위임·자동 종료 없음, 재접속 시 기존 방장 권한 유지
- 현재 차례 플레이어 disconnect: turn을 다른 사용자에게 넘기지 않고 재접속을 기다림
- browser offline: local connection UI만 offline으로 표시하고 서버 state는 변경하지 않음
- reconnect: `online / pageshow / visibility` 이벤트에서 authoritative snapshot 재조회
- 재대결: GAME_OVER에서 host가 같은 room을 waiting으로 reset하고 기존 active membership / room code 유지
- 재대결 참가: 일반 플레이어 ready 재설정 후 기존 start flow 재사용, 이탈자가 있으면 같은 room code로 replacement/rejoin 가능
- 자동 multi-client 검증: disposable Supabase에서 독립 auth session 3개/7개를 실제 RPC client로 취급
- 3인 자동 시나리오: 전원 snapshot privacy 확인 + full refuse cycle + reconnect snapshot + 자연 종료
- 7인 자동 시나리오: 전원 snapshot privacy 확인 + full refuse cycle + private counter 독립성 + take/reconnect
- 실제 browser Presence 검증: CI Actions 비용을 늘리는 별도 browser/Supabase workflow를 만들지 않고 release 직전 manual gate로 유지
- release gate 기록: `games/no-thanks/RELEASE_CHECKLIST.md`

## Validation

- 완료:
  - Phase A–D 최종 브랜치 head `71ac396077628e53bebe1bbbc862c1c7383f64b9`를 당시 최신 main과 동기화한 상태에서 PR #364가 mergeable / behind 0임을 확인했습니다.
  - 최종 브랜치에서 Game Platform JavaScript syntax, shared module link, Game Platform contract tests, Governance Guard와 `build-assets`가 모두 통과했습니다.
  - PR #364 병합 후 main commit `66531c7820285b37dc8d1e2961156ab95560758f`에서 `build`, 전체 `site-checks`, `report-build-status`, `deploy`가 모두 성공했습니다.
  - 병합 후 전체 site-checks에서 Game Platform contracts뿐 아니라 The Game rules, Marble foundation, Web Push/signup/admin/activity 권한 검사, module/link/file-integrity 검사까지 성공했습니다.
  - Phase 3 작업 브랜치를 관리자 후보 조회 안정화 PR #348까지 반영된 최신 `main` 커밋 `049493f8964f2424a7669290ae733d6e388c799b`에 다시 동기화했습니다.
  - 기존 #344의 공통 foundation 전체 Registry ID/개수 고정 변경을 폐기하고 No Thanks! Registry 검증을 게임별 테스트로 분리했습니다.
  - PR #347은 최신 `main` 동기화 전 Game Platform governance를 통과했고, 동기화 후 동일 검증을 다시 수행합니다.
  - Game Platform JavaScript syntax check, 사이트 ↔ `games/shared` module link check, `npm run test:game-platform`, Governance Guard가 모두 통과했습니다.
  - Phase 3 PR #349에서 신규 `index.html / main.js / styles.css`의 JavaScript syntax와 module link 검증이 통과했습니다.
  - `tests/game-platform-no-thanks-shell.test.js`를 포함한 `npm run test:game-platform` 전체 계약 테스트가 통과했습니다.
  - Access Gate의 인증 필요/승인 필요 사유를 runtime에서 명시적으로 분기하고 알 수 없는 접근 상태는 별도 오류 화면으로 처리하도록 보완했습니다.
  - 최신 Phase 3 head의 Game Platform Governance Guard가 통과했습니다.
  - Phase 4 Room/Lobby adapter 정적 계약 테스트와 private-state 경계 테스트가 `npm run test:game-platform`에서 통과했습니다.
  - disposable Supabase에서 No Thanks! migration을 replay하고 플랫폼 DB/Test Contract 10개 시나리오를 모두 통과했습니다.
  - 첫 DB integration 실행에서 seat 빈자리 계산 alias가 모호해 join 시 `seat = null`이 되는 문제를 발견했고, `generate_series ... as s(seat)`로 명시해 수정한 뒤 재검증했습니다.
  - 수정 후 Game DB integration의 No Thanks! 시나리오와 기존 게임 DB integration 전체가 성공했습니다.
  - 최신 Phase 4 code head에서 Site static checks와 Game Platform governance가 모두 성공했습니다.
  - Phase 5 stacked PR #354에서 No Thanks! lobby controller/runtime model/shell 계약 테스트를 포함한 `npm run test:game-platform`이 통과했습니다.
  - Phase 5 최신 code head의 Game Platform JavaScript syntax, site ↔ `games/shared` module link, Governance Guard가 모두 통과했습니다.
  - Phase 5는 DB/schema 변경이 없으므로 disposable Game DB integration은 #353에서 검증된 Room/Lobby foundation 결과를 그대로 전제로 하며 별도 DB workflow는 실행되지 않았습니다.
  - Phase 5는 `games/**`와 `tests/game-platform-*.test.js` 범위만 변경해 CI 경계 정책에 따라 전체 Site static checks는 실행하지 않았습니다.
  - PR #354 자동 리뷰에서 command 응답보다 늦게 도착한 stale refresh가 최신 ready/start 상태를 덮을 수 있는 race condition을 발견했고, 현재 렌더 snapshot보다 낮은 version은 game-local controller에서 거부하도록 수정했습니다.
  - stale refresh가 command의 최신 snapshot을 덮지 못하는 회귀 테스트를 추가했습니다.
  - 방장 waiting-room 이탈은 전체 대기실을 닫는 파괴적 동작이므로 즉시 RPC를 호출하지 않고 명시적 `방 닫기` 확인 dialog를 거치도록 수정했습니다.
  - No Thanks! standalone HTML에 남아 있던 literal `\\n` 문자를 실제 줄바꿈으로 수정하고 회귀 테스트를 추가했습니다.
  - 위 리뷰 수정이 포함된 최신 head에서도 JavaScript syntax, shared module link, `npm run test:game-platform`, Governance Guard가 모두 성공했습니다.
  - Phase 6 PR #356에서 server-authoritative gameplay adapter/controller/runtime/shell 계약을 포함한 Game Platform governance가 성공했습니다.
  - Phase 6 변경을 포함한 Site static checks 전체 회귀 검증이 성공했습니다.
  - disposable Supabase에서 Room/Lobby foundation + gameplay migration을 순서대로 replay하고 기존 플랫폼 필수 시나리오와 추가 gameplay 시나리오가 모두 성공했습니다.
  - gameplay DB 검증에서 active-player refuse, private counter 감소, center counter 증가, turn 이동, take 후 중앙 칩 수령과 same-player turn 유지, concurrent conflict single commit, 마지막 카드 점수/공동 승자, host-only manual termination, terminal leave를 확인했습니다.
  - `p_expected_version = null` 직접 RPC 호출도 `VERSION_CONFLICT`로 거부되는 것을 검증했습니다.
  - 동일 `client_action_id`의 concurrent duplicate retry가 동일 authoritative snapshot으로 수렴하고 version을 두 번 증가시키지 않는 것을 검증했습니다.
  - Phase 7 PR #358의 최신 code head에서 Game Platform JavaScript syntax가 통과했습니다.
  - Phase 7 PR #358의 site ↔ `games/shared` module link 검증이 통과했습니다.
  - Presence lifecycle, 다중 탭 user merge, offline→online refresh를 포함한 당시 Phase 7 `npm run test:game-platform` 전체 계약 테스트가 통과했습니다.
  - same-room rematch, terminal host succession, replacement restart를 포함한 최신 `npm run test:game-platform`이 통과했습니다.
  - 최신 Site static checks가 통과했습니다.
  - isolated Supabase Game DB integration에서 No Thanks! same-room rematch 계약과 기존 Can't Stop rematch 계약이 모두 통과했습니다.
  - Game Platform Governance Guard가 통과했습니다.
  - Phase 7은 DB schema/RPC를 변경하지 않아 disposable Game DB integration은 실행 대상이 아닙니다. 서버 DB 경계는 Phase 6의 성공 결과를 그대로 유지합니다.
  - 최신 main 대비 뒤처짐 없이 PR #358이 mergeable 상태임을 확인했습니다.
  - 운영 DB migration history에 `no_thanks_room_lobby_foundation / no_thanks_gameplay_actions / no_thanks_realtime_publication / no_thanks_private_helper_permissions`가 기록된 것을 확인했습니다.
  - 운영 DB에서 `no_thanks_rooms / no_thanks_room_players / no_thanks_room_actions / no_thanks_room_private_state` RLS 활성 상태를 확인했습니다.
  - authenticated는 공개 room/player SELECT와 public RPC 실행 권한만 가지며 private-state SELECT와 private snapshot helper 실행은 차단된 것을 확인했습니다.
  - Realtime publication에는 공개 room/player 두 테이블만 등록된 것을 확인했습니다.
  - Game Platform-only PR이므로 개선된 CI 규칙에 따라 무관한 전체 Site static checks는 실행하지 않았습니다.
  - `package.json`에서 게임 플랫폼 관련 검증 명령이 `npm run test:game-platform`임을 확인했습니다.
  - 새 `rules.js`와 단위 테스트 파일에 `node --check`를 실행해 문법 오류가 없음을 확인했습니다.
  - `node --test tests/game-platform-no-thanks-rules.test.js`에 해당하는 동일 파일 구성을 로컬 검증 환경에서 실행했습니다.
  - 규칙 엔진 단위 테스트 12개가 모두 통과했습니다.
  - 실제 브랜치의 `rules.js`, 단위 테스트, 게임 등록부 파일과 로컬 검증 파일의 Git blob SHA가 각각 일치하는지 확인했습니다.
  - 게임 등록부의 `no-thanks` 항목이 `platform: "shared"`이고 모든 기능 활성화 값이 `false`로 해석되는지 확인했습니다.
  - 당시 `GAME_SPEC.md`와 `DEVELOPMENT.md`의 필수 섹션을 유지했습니다. 이후 플랫폼 규칙은 `UI_DESIGN.md`와 `UI_DECISIONS.md`를 추가한 네 문서 체계로 발전했습니다.
- 이번 단계에서 아직 수행하지 않는 검증:
  - 승인회원 계정의 운영 create/join/snapshot/gameplay 브라우저 smoke test
  - 실제 데스크톱/모바일 브라우저의 Presence/reconnect 멀티플레이 점검
- 운영 Supabase migration, 권한/RLS/private-state 비노출, Realtime publication 구조 검증은 완료했습니다. 남은 항목은 실제 브라우저 동작 확인입니다.

## Known Issues / Deferred

- Game Platform 공통 재대결 규칙 영향도 감사에서 확인된 `MIGRATION_REQUIRED` 항목은 이번 same-room rematch 구현으로 해소했습니다.

- 승인회원 접근 제어부터 Room/Lobby, server-authoritative gameplay action, 자연 종료와 방장 수동 종료 UI까지 연결했습니다.
- Room/Lobby, gameplay, Realtime publication, private helper permission hardening migration을 운영 Supabase에 적용했습니다.
- 게임 등록부에는 등록되어 있지만 모든 기능 활성화 값이 비활성 상태이며 출시된 게임으로 취급하지 않습니다.
- 특수 카드 확장은 기본 규칙 첫 버전 이후 별도 설계가 필요합니다.
- 비정상 disconnect와 Presence 정책은 Phase 7~8에서 검증했습니다. 재대결 정책은 Game Platform 공통 규칙에 맞춰 same-room lifecycle로 변경했고 자동 DB/contract 검증을 완료했습니다. 실제 브라우저 Presence/모바일 복귀/rematch 검증은 release manual gate로 남아 있습니다.
- Phase A–D 구현 브랜치는 이미 PR #364로 main에 병합됐으며 후속 구현에서는 해당 종료 브랜치를 재사용하지 않습니다. 다음 구현 시에는 먼저 No Thanks! 관련 진행 중 브랜치 존재 여부를 확인합니다.

## Release closeout 안내

게임을 운영 환경에 공개해 `Status: RELEASED`로 전환할 때는 이 안내 부분을 실제 날짜가 있는 출시 기록으로 교체합니다.

```text
## Release — YYYY-MM-DD

- 운영 환경 기능 활성화와 마이그레이션 요약
- 현재 게임 등록부 기능 상태
- 핵심 검증 결과
- 유지보수 기준과 남은 확인 사항
```

`RELEASED` 상태에서는 `Active branch: main`을 사용하고, 과거 작업 브랜치를 현재 기준으로 남기지 않습니다.
