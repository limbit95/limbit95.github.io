# No Thanks! 개발 진행

> 이 문서는 현재 개발 상태를 다음 작업자나 다음 채팅으로 전달하기 위한 인수인계 문서입니다.
> 게임 규칙과 구현 설계의 기준은 같은 디렉터리의 `GAME_SPEC.md`입니다.

## Current Status

- Phase: Board UI redesign — Phase A–D
- Status: IN_PROGRESS
- Active branch: `feature/no-thanks-board-ui-phase1-a-d`
- 마지막 기록: 2026-09-22

## Completed

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
- No Thanks! migration을 disposable Game DB integration harness에 포함하고 플랫폼 필수 10개 시나리오 테스트를 추가했습니다.
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
- 재대결은 terminal state를 같은 room에서 reset하지 않고, 방장이 결과방을 닫은 뒤 같은 최대 인원의 새 방을 만드는 방식으로 확정했습니다.
- 새 게임 방 생성 시 기존 참가자는 새 방 코드로 다시 참가하도록 명시해 오래된 action/version/private state가 재사용되지 않도록 했습니다.
- Presence lifecycle, 다중 탭 user merge, offline→online refresh, result-room→fresh-room 재대결 정책에 대한 회귀 테스트를 추가했습니다.
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

- 보드 UI 개편 Phase A에서 WAITING/PLAYING의 공통 대형 직사각형 보드판과 내부 원형/타원형 테이블, 현재 카드/중앙 칩/draw deck 오브젝트를 구현했습니다.
- 공통 Game Shell 자체는 수정하지 않고 No Thanks! 전용 `no-thanks-shell--board` 상태에서 기존 우측 대형 roster를 숨겨 다른 게임 영향 범위를 차단했습니다.
- Phase B에서 서버 seat/turn order는 그대로 두고 viewer 기준으로 시각 배열만 회전하여 본인 좌석을 항상 6시 방향에 두는 3–7인 동적 좌표 계산을 구현했습니다.
- WAITING에서는 방장을 기본 착석 처리하고 일반 플레이어 ready 전환을 감지해 짧은 착석 애니메이션을 적용했으며 reduced-motion에서는 애니메이션을 제거합니다.
- Phase C에서 방 코드, 인원, ready, connection/reconnect, host 상태를 표시하는 compact HUD를 보드 내부 우측 상단에 구현했습니다.
- 6–7인 좌석은 HUD safe area를 확보하도록 보드 중심과 가로 반지름을 보정했습니다.
- Phase D에서 보드 하단 동일 폭 개인 패널에 본인 정확한 칩 수/칩 cluster, 오름차순 보유 카드, 핵심 gameplay action을 통합했습니다.
- 보유 카드는 개수에 따라 수평 겹침 폭을 조정하고 blue/teal/yellow/pink-red 계열 색상, 좌상단/우하단 숫자, hover/focus 상승·확대 인터랙션을 적용했습니다.
- 좌표/카드 색상/손패 겹침 계산을 game-local `boardLayout.js` 순수 유틸로 분리해 3–7인 viewer 6시 고정과 좌표 유일성을 자동 검증할 수 있게 했습니다.
- 공개 프로필 avatar는 기존 승인회원 전용 `get_public_member_profiles_by_ids` RPC와 signed avatar URL 유틸을 재사용하고, 미설정/실패 시 `default-avatar.svg`로 fallback 하도록 구현했습니다.
- 좌석 닉네임 텍스트를 원형 avatar로 교체하고 현재 turn은 avatar 외곽 강조 + 작은 TURN badge로 유지했습니다.
- 개인 칩은 정확한 숫자를 유지하면서 시각 pile은 최대 16개까지 렌더해 보유량에 따른 풍성함을 강화했습니다.
- 중앙 칩 0개 상태는 0이 적힌 가짜 칩 대신 `NO CHIP` 텍스트 상태로 변경했습니다.
- HUD Presence 비연결 문구를 `자리이탈`로 변경했습니다.
- 좌석 avatar에 clipping frame을 추가해 원형 외곽 ring 안에서 이미지가 항상 보존되도록 수정했습니다.
- 원형 테이블 좌우 폭을 더 넓히고 개인 칩 열을 데스크톱 96px 기준으로 축소해 보유 카드 영역을 확장했습니다.
- 개인/중앙 칩은 동일한 38px 붉은 textured token 스타일을 사용하도록 통일했습니다.
- PLAYING 핵심 액션을 개인 패널에서 테이블로 이동했습니다. 현재 카드를 직접 클릭해 가져오고, 오른쪽 칩 더미 아래 버튼으로 칩 1개를 내도록 연결했습니다.
- 남은 deck 장수는 1–7개 시각 layer 단계로 축약해 실제 남은 장수가 줄어들수록 deck stack도 점진적으로 얕아지도록 구현했습니다.
- authoritative snapshot 변화에 맞춰 `REFUSE_CARD` 후 직전 active seat에서 중앙 칩으로 날아가는 연출과 `TAKE_CARD` 후 draw deck에서 새 current card가 들어오는 연출을 추가했습니다.
- 개인 패널 내 칩 열을 192px로 다시 넓히고 PLAYING의 현재 차례 하단 안내 문구는 제거했습니다.
- 기존 shell footer의 게임 규칙/새로고침/게임 종료 액션을 board mode에서는 개인 패널 오른쪽 2열 tool grid로 이동했습니다.
- 현재 active seat는 기본 82px 대비 164px로 2배 확대해 현재 차례를 시각적으로 우선 표시합니다.
- 원형 테이블을 보드 정중앙(left 50%)으로 이동하고 최대 폭 80% / 1180px, 높이 78%로 확대했으며 seat 좌표도 centerX 50 기준으로 재조정했습니다.
- 중앙 칩 cluster/count/action 사이 간격을 소폭 늘려 각 요소가 붙어 보이지 않도록 정리했습니다.
- 칩 이동 animation은 22px token을 사용하고 DOM geometry를 측정해 acting seat에서 실제 center chip target으로 이동하도록 보정했습니다.
- The Game `cardMotion.js`의 moving-card + 3D flip 패턴을 참고해 새 카드가 deck 위치에서 current card 위치까지 이동하면서 뒷면에서 앞면으로 rotateY 되는 구조로 개선했습니다.

## Current Work

- Phase A–D 소스 구현과 자동 검증을 완료했고 PR #364에서 리뷰 중입니다.
- UI 개편은 game-local 표현 계층만 변경하고 기존 DB/RPC/server authority/private-state/reconnect 계약은 변경하지 않습니다.
- Phase A–D 후속 디테일 조정에 이어 테이블 직접 조작 UX, red chip skin, dynamic deck depth, avatar clipping, snapshot 기반 card/chip 이동 애니메이션까지 반영했습니다.

## Next Work

1. Phase A–D PR의 Game Platform governance에서 JavaScript syntax, module link, `npm run test:game-platform`, boundary guard를 통과시킵니다.
2. PR 검토 후 실제 데스크톱 브라우저에서 3–7인 좌석/HUD 겹침, 보드 높이, 개인 패널 카드 겹침을 수동 시각 QA합니다.
3. Phase E에서 다른 플레이어의 공개 획득 카드 popover를 좌석 근처 control로 추가합니다.
4. Phase F 잔여 범위로 카드/중앙 칩이 획득 플레이어 쪽으로 이동하는 후속 애니메이션과 실제 브라우저 타이밍을 추가 조정합니다.
5. 기존 `RELEASE_CHECKLIST.md`의 Presence/reconnect 운영 브라우저 gate와 Registry capability activation은 UI 후속 단계와 별도로 계속 유지합니다.

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
- 재대결: 같은 room reset 대신 결과방 종료 후 새 room 생성
- 재대결 참가: 새 room code를 공유하고 참가자가 다시 join
- 자동 multi-client 검증: disposable Supabase에서 독립 auth session 3개/7개를 실제 RPC client로 취급
- 3인 자동 시나리오: 전원 snapshot privacy 확인 + full refuse cycle + reconnect snapshot + 자연 종료
- 7인 자동 시나리오: 전원 snapshot privacy 확인 + full refuse cycle + private counter 독립성 + take/reconnect
- 실제 browser Presence 검증: CI Actions 비용을 늘리는 별도 browser/Supabase workflow를 만들지 않고 release 직전 manual gate로 유지
- release gate 기록: `games/no-thanks/RELEASE_CHECKLIST.md`
- WAITING/PLAYING 보드 구조: 동일한 대형 게임 보드와 원형/타원형 테이블을 유지하고 상태 전환 시 공간 구조를 교체하지 않음
- 좌석 방향: 서버 seat 값을 변경하지 않고 viewer 기준 화면 배열만 회전해 본인을 항상 6시 방향에 표시
- 좌석 기본 정보: 닉네임 + 현재 차례만 노출하고 ready/connection/host 상세는 보드 HUD로 분리
- 개인 패널: 본인의 정확한 칩과 보유 카드를 보드 바로 아래 동일 폭 영역에 유지하고, PLAYING refuse/take 핵심 action은 테이블 오브젝트 직접 조작으로 이동
- 보유 카드 UI: 오름차순 + 수평 겹침 + 값 구간별 색상 + 좌상단/우하단 숫자 + hover/focus raise
- 후속 UI 범위: 공개 카드 popover는 Phase E, Phase F 중 take 결과 카드/칩 → player 이동 연출은 잔여 범위로 유지

## Validation

- 완료:
  - Board UI Phase A–D PR #364의 최신 Game Platform governance run #287이 성공했습니다. 중간 run #286은 테이블 액션 이동 전의 오래된 shell 문구 계약 때문에 실패했으며 테스트를 새 UI 계약으로 갱신한 뒤 전체 통과했습니다.
  - 최신 코드 HEAD에서 Game Platform JavaScript syntax check가 통과했습니다.
  - site ↔ `games/shared` module link check가 통과했습니다.
  - 신규 3–7인 좌석/6시 고정/카드 겹침 계약 테스트를 포함한 `npm run test:game-platform` 전체가 통과했습니다.
  - Game Platform Governance Guard가 통과해 shared/DB/RPC 경계 변경이 없음을 확인했습니다.
  - PR 전 실제 브랜치 파일 기반 추가 검증에서 3/4/5/6/7인 좌표 유일성, viewer 6시 고정, authoritative seat 보존, 카드 tone/hand overlap, Phase A–D DOM/CSS 계약과 CSS brace balance를 확인했습니다.
  - 디테일 조정 후 브랜치 파일 기반 검증에서 3–7인 확대 좌석 좌표, 800px 보드 규격, 16개 personal chip cap / 7개 compact chip cap, 공개 프로필 avatar fallback, `NO CHIP`, HUD `자리이탈`, 확대 카드/개인 패널 CSS 계약과 brace balance를 확인했습니다.
  - 테이블 직접 조작 후 정적 검증에서 main.js syntax, 3–7인 좌석 bounds, 단계형 deck layer(15→5, 11→4, 7→3, 1→1), avatar clipping frame, red chip skin, current-card click/center-chip refuse action, card-deal/chip-flight animation 계약과 CSS brace balance를 확인했습니다.
  - 중앙 정렬 pass 후 정적 검증에서 3–7인 viewer 좌석 x=50 / 6시 고정, active avatar 164px, personal chip 192px, panel tool relocation, PLAYING 하단 turn message 제거, measured chip flight, 3D card flip front/back contract와 CSS brace balance를 확인했습니다.
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
  - Presence lifecycle, 다중 탭 user merge, offline→online refresh, fresh-room rematch를 포함한 `npm run test:game-platform` 전체 계약 테스트가 통과했습니다.
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
  - `GAME_SPEC.md`와 `DEVELOPMENT.md`의 필수 섹션을 유지했습니다.
- 이번 단계에서 아직 수행하지 않는 검증:
  - 승인회원 계정의 운영 create/join/snapshot/gameplay 브라우저 smoke test
  - 실제 데스크톱/모바일 브라우저의 Presence/reconnect 멀티플레이 점검
- 운영 Supabase migration, 권한/RLS/private-state 비노출, Realtime publication 구조 검증은 완료했습니다. 남은 항목은 실제 브라우저 동작 확인입니다.

## Known Issues / Deferred

- 승인회원 접근 제어부터 Room/Lobby, server-authoritative gameplay action, 자연 종료와 방장 수동 종료 UI까지 연결했습니다.
- Room/Lobby, gameplay, Realtime publication, private helper permission hardening migration을 운영 Supabase에 적용했습니다.
- 게임 등록부에는 등록되어 있지만 모든 기능 활성화 값이 비활성 상태이며 출시된 게임으로 취급하지 않습니다.
- 특수 카드 확장은 기본 규칙 첫 버전 이후 별도 설계가 필요합니다.
- 비정상 disconnect, 방장 연결 상실, 재대결 정책은 Phase 7에서 확정했고 3인·7인 독립 서버 세션 자동 검증까지 Phase 8에서 추가했습니다. 실제 브라우저 Presence/모바일 복귀 검증은 release manual gate로 남아 있습니다.
- 현재 브랜치는 보드 UI Phase A–D 작업 브랜치이며 `main`에는 직접 병합하지 않습니다.
- Phase A–D 자동 계약은 통과했지만 실제 3–7인 데스크톱 브라우저에서 좌석/HUD 간격과 카드 손패 밀도를 눈으로 확인하는 시각 QA는 PR 후속 확인 항목입니다.
- 다른 플레이어 공개 카드 popover(Phase E)는 아직 포함하지 않습니다. Phase F는 refuse chip → center와 next-card reveal까지만 구현했으며, 획득 카드/중앙 칩 → player 이동 연출은 후속으로 남아 있습니다.

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
