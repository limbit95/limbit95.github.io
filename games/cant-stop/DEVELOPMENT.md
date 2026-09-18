# Can't Stop Development

> 현재 개발 상태를 다음 작업자/채팅으로 전달하는 인수인계 문서입니다.
> 게임 규칙과 구현 설계의 기준은 같은 디렉터리의 `GAME_SPEC.md`입니다.

## Current Status

- Phase: Phase 4
- Status: IN_PROGRESS
- Active branch: feature/game-platform-phase4-cant-stop-push-stop
- Last checkpoint: 2026-09-18

## Completed

- 최신 Game Platform 규칙과 shared 계약을 확인했다.
- 신규 게임 초기 세팅에 `GAME_SPEC.md`를 의무화하는 bootstrap 규칙 방향을 확정했다.
- Can't Stop 원본 규칙을 여러 공개 규칙 자료로 교차 확인했다.
- 2–12 column, four-dice pairing, three-runner, push/stop, bust, claim, three-column win 규칙을 구현 기준으로 정리했다.
- Game Platform의 SHARED 책임과 Can't Stop GAME-LOCAL 책임을 분리했다.
- online authoritative action / snapshot / reconnect / DB contract 적용 계획을 작성했다.
- Game Platform Governance Guard에 `GAME_SPEC.md` 필수 섹션 검증과 문서-only bootstrap 상태를 추가했다.
- 신규 game directory에 runtime 파일이 추가되는 순간 Registry가 필요하도록 회귀 테스트를 추가했다.
- deterministic rules engine을 추가해 2–12 column, dice pairing, runner 이동, bust, stop, claim, win을 game-local로 구현했다.
- pairing만으로 이동이 하나로 결정되지 않는 경우를 legal move plan으로 표현하도록 규칙 모델을 고정했다.
- server-random turn order를 rules engine 입력으로 받고 client-local randomness는 사용하지 않도록 했다.
- rules engine 시작과 함께 Game Registry에 `cant-stop`을 `platform: "shared"`로 등록하되 아직 구현되지 않은 online/local/invite/presence capability는 모두 false로 유지했다.
- rules engine 핵심 경계 13개 unit test를 추가했다.
- 기존 사이트 auth source를 Game Platform Access Gate에 연결해 로그인/승인회원 접근 경계를 적용했다.
- 승인회원에게 Common Game Shell과 현재 사용자 roster를 표시하는 최소 runtime을 추가했다.
- rules engine의 2–12 column 높이를 재사용하는 11열 보드 골격을 추가했다.
- 미승인/비로그인 사용자는 각각 승인 상태/로그인 화면으로 안내하고 gameplay shell은 렌더링하지 않는다.
- Room/Lobby가 아직 없으므로 Registry의 online/local/invite/presence capability는 모두 false로 유지한다.
- runtime model 및 실제 `app.js` syntax/index wiring 검증 테스트를 추가했다.
- Can’t Stop 전용 `cant_stop_rooms`, `cant_stop_room_players`, `cant_stop_room_actions` DB foundation을 추가했다.
- 승인회원 전용 create/join/snapshot/ready/leave/start RPC와 명시적 RLS/grant 경계를 추가했다.
- room row lock + `expected_version`으로 충돌을 직렬화하고, `client_action_id` action replay로 ready/start 재전송 idempotency를 구현했다.
- 게임 시작 시 서버가 turn order를 무작위로 확정해 authoritative `game_state`에 저장하도록 구현했다.
- `createCantStopRoomLobbyAdapter`를 Shared `defineRoomLobbyAdapter` 계약에 연결하고 Realtime Postgres Changes를 invalidation 신호로만 사용하도록 구현했다.
- Game DB integration harness가 Can’t Stop migration을 disposable Supabase에 replay하도록 확장했다.
- `tests/game-db-integration/cant-stop.test.js`에 플랫폼 필수 10개 DB 시나리오를 등록했다.
- 기존 DB integration workflow에 `supabase/cant-stop/**/*.sql` 경로만 추가했으며 별도 workflow는 만들지 않았다.
- 승인회원 runtime에 방 만들기 / 코드 참가 / 준비 / 준비 취소 / 방장 시작 / 나가기 사용자 흐름을 연결했다.
- authoritative lobby snapshot을 Common Game Shell roster와 room label에 연결했다.
- Shared Snapshot Coordinator를 lobby에도 적용해 Realtime payload는 invalidation으로만 소비하고 RPC snapshot을 다시 읽도록 했다.
- online/pageshow/visibility 복귀 시 authoritative lobby snapshot을 다시 불러오도록 reconnect refresh trigger를 연결했다.
- 게임 시작 snapshot을 받으면 서버 확정 turn order 상태를 유지한 채 기존 보드 골격 화면으로 전환한다.
- 운영 Supabase에는 migration을 적용하지 않았으므로 Registry `online` capability와 게임 목록 노출은 계속 보류한다.
- authoritative gameplay 첫 slice로 `cant_stop_roll_dice` RPC를 추가했다.
- 클라이언트는 dice 값을 전달하지 않고 room/version/action id intent만 보내며 서버가 4d6를 생성한다.
- 서버가 현재 claimed column / runner / permanent progress를 기준으로 legal pairing과 legal move plan을 계산한다.
- 첫 roll SQL 결과를 JS rules engine `enumeratePairings()`와 대조하는 DB parity 검증을 추가했다.
- 동일 `client_action_id` roll 재전송은 최초 dice/pairing snapshot을 그대로 반환하며 version을 다시 증가시키지 않는다.
- non-active player roll과 stale version roll을 서버에서 거부하도록 검증했다.
- game start state에 플레이어별 permanent progress를 위한 `playerProgress` authoritative 필드를 추가했다.
- gameplay client adapter `createCantStopGameplayAdapter`를 추가했으며 client가 임의 dice/random 값을 전달하지 못하는 계약 테스트를 추가했다.
- authoritative `cant_stop_choose_pairing` RPC를 추가해 서버 snapshot의 `legalPairings[].plans`에 존재하는 선택만 허용한다.
- 선택된 legal move plan을 서버 `cant_stop_simulate_plan`으로 다시 계산해 authoritative `runners`에 반영하고 phase를 `PUSH_OR_STOP`으로 전환한다.
- `choose_pairing`도 room row lock + `expected_version` + `client_action_id` replay 계약을 적용했다.
- pairing action에는 `request_payload`를 기록해 같은 action id를 다른 sums/plan으로 재사용하면 `ACTION_ID_CONFLICT`로 거부한다.
- gameplay adapter에 `choosePairing()`을 추가하고 sums 2개 / plan 1~2개 / 2~12 범위를 client shape 경계에서 검증한다.
- disposable Supabase 테스트에 JS rules engine `applyPairingChoice()`와 서버 runner 결과 parity, illegal choice 무변경, stale/non-active 거부, replay payload conflict 검증을 추가했다.
- authoritative `cant_stop_continue_turn` RPC를 추가해 `PUSH_OR_STOP`에서 runner는 유지하고 dice/pairing만 지운 뒤 같은 플레이어의 `TURN_ROLL`로 복귀하도록 구현했다.
- authoritative `cant_stop_stop_turn` RPC를 추가해 runner를 active player의 permanent progress로 commit하고 다음 플레이어로 넘기도록 구현했다.
- stop 시 top runner는 column claim으로 확정하고 다른 플레이어의 해당 column progress를 제거하도록 구현했다.
- stop 결과 active player의 claimed column이 3개 이상이면 `GAME_OVER`와 `winnerId`를 authoritative state에 기록한다.
- continue/stop 모두 room row lock + `expected_version` + `client_action_id` idempotency 계약을 적용했다.
- 같은 `PUSH_OR_STOP` version에 continue/stop이 동시에 들어오면 하나만 commit되고 다른 하나는 `VERSION_CONFLICT`가 되도록 DB regression을 추가했다.
- gameplay adapter에 `continueTurn()`, `stopTurn()` intent를 추가했다.
- disposable Supabase fixture를 사용해 JS `continueTurn()/stopTurn()` parity, permanent progress commit, claim, 상대 progress 제거, 3번째 claim 승리를 결정적으로 검증한다.

## Current Work

- authoritative `continue_turn` / `stop_turn`과 permanent progress / claim / win transition을 disposable Supabase에서 검증한다.

## Next Work

- gameplay controller/UI에 `roll_dice → choose_pairing → continue_turn/stop_turn` authoritative flow를 연결한다.
- board에 latest dice, legal pairing 선택, temporary runner, permanent progress, claimed column, winner 표현을 연결한다.
- GAME_OVER 이후 방 나가기 / 재매칭 lifecycle을 설계해 완료된 게임이 사용자를 active room에 영구 고정하지 않도록 한다.
- 운영 Supabase migration 적용 및 실제 배포 검증 전까지 Registry `online` capability는 false로 유지한다.

## Decisions

- 공식 로드맵 단계명은 `Phase 4`를 사용하며 임의의 `Phase 4A`를 만들지 않는다.
- Can’t Stop은 기존 게임을 복사하지 않고 `games/cant-stop/`에서 처음부터 platform-native로 개발한다.
- bootstrap 상태에서는 `GAME_SPEC.md`와 `DEVELOPMENT.md`만 두고 Registry에 노출하지 않는다.
- game-specific dice/pairing/runner 규칙은 `games/shared/`로 올리지 않는다.
- online gameplay의 주사위 결과와 상태 전이는 최종적으로 서버가 authoritative하게 결정한다.
- 첫 플레이어는 사전 주사위 없이 게임 시작 RPC가 서버에서 turn order를 무작위로 한 번 확정하고 authoritative state에 저장하는 방식으로 결정한다.
- pairing에서 두 합을 모두 사용할 수 있으면 두 이동을 모두 적용해야 하며, 둘 다 쓸 수 없지만 각각 하나씩 가능한 경우에는 legal move plan으로 어느 한 합을 사용할지 명시적으로 선택한다.
- Game Registry 등록 시점에는 아직 실제 제공하지 않는 capability를 선행 선언하지 않는다.
- 최소 runtime은 기존 청파 같이 auth module을 직접 재구현하지 않고 Shared Access Gate adapter로 소비한다.
- Common Game Shell은 공통 header/status/roster/layout까지만 담당하고 11열 보드 표현은 Can’t Stop GAME-LOCAL로 유지한다.
- Room/Lobby DB는 공통 gameplay 테이블을 만들지 않고 `cant_stop_*` namespace를 유지한다.
- 브라우저는 room/player 테이블을 직접 수정하지 않고 승인회원 RPC만 호출한다.
- Realtime payload는 최종 truth로 사용하지 않고 room/player 변경을 snapshot refresh invalidation으로만 사용한다.
- Registry `online` capability는 소스 구현만으로 활성화하지 않고 운영 Supabase migration과 배포 smoke test까지 완료된 시점에 true로 전환한다.
- lobby Realtime payload는 상태 자체로 렌더링하지 않고 Shared Snapshot Coordinator refresh trigger로만 사용한다.
- 방 생성/참가/ready/start/leave 결과는 모두 RPC가 반환한 authoritative snapshot을 기준으로 렌더링한다.
- `choose_pairing`은 client가 임의 이동을 제안하는 API가 아니라 서버가 이미 발행한 legal pairing + legal move plan 중 하나를 선택하는 intent다.
- idempotency key가 같아도 action payload가 달라지면 같은 요청으로 간주하지 않고 conflict로 거부한다.
- `continue_turn`은 현재 turn의 runner를 유지하고 공개된 dice/pairing만 초기화한 뒤 같은 active player가 다시 roll하게 한다.
- `stop_turn`은 runner 위치를 permanent progress로 commit한 뒤 claim/win을 계산하며 승자가 없으면 다음 player의 `TURN_ROLL`로 넘긴다.
- 3번째 claim 승리 시 room status는 당장 닫지 않고 `game.phase = GAME_OVER`를 authoritative final state로 유지해 reconnect가 최종 결과를 복구할 수 있게 한다.

## Validation

- Completed: 이전 bootstrap / rules-engine / runtime-shell / Room-Lobby / lobby-ui / roll-dice / choose-pairing 검증
- Completed: choose-pairing authority/parity DB integration — run #81 SUCCESS
- Pending: `npm run test:game-platform` on push-stop PR
- Pending: Game Platform Governance Guard on push-stop PR
- Pending: Site static checks on push-stop PR
- Pending: Game DB integration continue/stop/claim/win tests on disposable Supabase

## Known Issues / Deferred

- Room/Lobby 사용자 흐름은 소스에 연결됐지만 운영 Supabase에는 Can’t Stop migration을 적용하지 않았다.
- authoritative core action인 `roll_dice`, `choose_pairing`, `continue_turn`, `stop_turn`은 구현됐지만 아직 gameplay UI가 이를 호출하지 않는다.
- Registry에는 platform identity만 등록했고 `online` capability는 운영 migration + smoke test 전까지 false로 유지한다.
- GAME_OVER final snapshot은 유지되지만 완료된 게임에서 나가 새 방을 만들 수 있는 post-game lifecycle은 아직 구현하지 않았다.
- 게임 목록 UI는 아직 Can’t Stop을 노출하지 않는다.
- legal pairing이 정확히 하나일 때 UI가 자동 적용할지 확인 버튼을 보여줄지는 후속 UX 단계에서 결정한다.
