# Can't Stop Development

> 현재 개발 상태를 다음 작업자/채팅으로 전달하는 인수인계 문서입니다.
> 게임 규칙과 기능 설계의 기준은 같은 디렉터리의 `GAME_SPEC.md`, UI/presentation 설계의 기준은 `UI_DESIGN.md`입니다.

## Current Status

- Phase: Phase 4
- Status: RELEASED
- Active branch: main
- Last checkpoint: 2026-09-23

## Release Baseline

- v1 source of truth는 `main`이며 Can’t Stop 관련 개발/임시 브랜치는 release closeout 과정에서 정리했다.
- Game Registry는 `platform: "shared"`, `online=true`, `invite=true`, `local=false`, `presence=false` 상태다.
- 사이트 게임 목록에서 Can’t Stop을 정식 노출하고 `./games/cant-stop/` 경로로 진입한다.
- 운영 Supabase에는 v1에 필요한 room/gameplay/invite/manual-end/profile-nickname/active-leave/2-player leave migration이 적용되어 있다.
- 이후 Can’t Stop 변경은 과거 Phase 4 브랜치를 재사용하지 않고 최신 `main`에서 새 `fix/*` 또는 `feature/*` 브랜치를 만든다.

## Completed

- 2026-09-23 BGM polish: page entry/entry/waiting/rematch waiting에는 `Frozen Star`, authoritative `PLAYING` 상태에는 `Mountain Emperor`를 적용했다. 기존 공통 BGM Player와 저장 volume/pause 정책을 재사용하고 dice/blizzard Web Audio SFX는 분리 유지했다.
- 2026-09-22 Game Platform UI 규칙 도입에 맞춰 현재 v1의 Visual Identity, page/lobby/gameplay/result-rematch presentation 기준을 `UI_DESIGN.md`에 소급 문서화했다. runtime 동작은 변경하지 않았다.
- 최신 Game Platform 규칙과 shared 계약을 확인했다.
- 당시 신규 게임 초기 세팅에 `GAME_SPEC.md`를 의무화하는 bootstrap 규칙 방향을 확정했다. 현재 플랫폼 기준은 `GAME_SPEC.md` + `UI_DESIGN.md` + `DEVELOPMENT.md` 3문서 bootstrap이다.
- Can't Stop 원본 규칙을 여러 공개 규칙 자료로 교차 확인했다.
- 2–12 column, four-dice pairing, three-runner, push/stop, bust, claim, three-column win 규칙을 구현 기준으로 정리했다.
- Game Platform의 SHARED 책임과 Can't Stop GAME-LOCAL 책임을 분리했다.
- online authoritative action / snapshot / reconnect / DB contract 적용 계획을 작성했다.
- 당시 Game Platform Governance Guard에 `GAME_SPEC.md` 필수 섹션 검증과 문서-only bootstrap 상태를 추가했다. 현재 Governance는 `UI_DESIGN.md` 필수 섹션까지 함께 검증한다.
- 신규 game directory에 runtime 파일이 추가되는 순간 Registry가 필요하도록 회귀 테스트를 추가했다.
- deterministic rules engine을 추가해 2–12 column, dice pairing, runner 이동, bust, stop, claim, win을 game-local로 구현했다.
- pairing만으로 이동이 하나로 결정되지 않는 경우를 legal move plan으로 표현하도록 규칙 모델을 고정했다.
- server-random turn order를 rules engine 입력으로 받고 client-local randomness는 사용하지 않도록 했다.
- rules engine 초기 구현 단계에서는 Game Registry에 `cant-stop`을 `platform: "shared"`로 등록하되 미구현 capability를 false로 유지했고, v1 release에서 검증된 `online`/`invite`만 true로 활성화했다.
- rules engine 핵심 경계 13개 unit test를 추가했다.
- 기존 사이트 auth source를 Game Platform Access Gate에 연결해 로그인/승인회원 접근 경계를 적용했다.
- 승인회원에게 Common Game Shell과 현재 사용자 roster를 표시하는 최소 runtime을 추가했다.
- rules engine의 2–12 column 높이를 재사용하는 11열 보드 골격을 추가했다.
- 미승인/비로그인 사용자는 각각 승인 상태/로그인 화면으로 안내하고 gameplay shell은 렌더링하지 않는다.
- Room/Lobby 구현 전 단계에서는 Registry capability를 선행 활성화하지 않았고, 실제 Room/Lobby·DB 계약이 연결된 뒤에도 production 검증 전까지 비활성 상태를 유지했다.
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
- gameplay 구현 단계에서는 운영 Supabase migration과 Registry 활성화를 분리해 진행했고, production migration·권한 검증 후 별도 activation 단계에서 `online`/`invite`와 게임 목록 노출을 켰다.
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
- gameplay adapter를 기존 lobby controller에 주입해 `rollDice / choosePairing / continueTurn / stopTurn`을 같은 busy/error/snapshot 흐름으로 연결했다.
- authoritative gameplay view model을 추가해 UI가 규칙을 다시 계산하지 않고 server snapshot의 dice, legal pairings, runners, permanent progress, claims, winner를 렌더링하게 했다.
- 실제 board에 네 주사위, legal pairing/plan 선택, temporary runner, player별 permanent marker, claimed column을 표시한다.
- `TURN_ROLL`에서는 active player에게 서버 주사위 굴리기, `PUSH_OR_STOP`에서는 한 번 더 굴리기/멈추기 action을 노출한다.
- `GAME_OVER`에서는 authoritative winner와 최종 claim 상태를 표시한다.
- legal pairing이 하나만 있어도 자동 commit하지 않고 사용자가 명시적으로 이동 plan 버튼을 눌러 확정하도록 초기 UX를 고정했다.
- runtime/controller 단위 테스트에 gameplay view mapping과 versioned gameplay command wiring을 추가했다.
- GAME_OVER 상태에서만 `cant_stop_leave_room`을 허용하도록 확장해 종료 후 active membership을 해제할 수 있게 했다.
- 방장 전용 `cant_stop_prepare_rematch` RPC를 추가해 같은 room code / active members / seats를 유지한 채 room을 `waiting`으로 되돌리고 game state를 초기화한다.
- 재대결 준비 시 방장만 ready=true, 나머지 active player는 ready=false로 초기화하고 기존 ready/start flow를 그대로 재사용한다.
- GAME_OVER에서 방장이 나가면 기존 seat 순서 기준 다음 player에게 host를 승계하고, 새 host가 재대결 준비를 수행할 수 있게 했다.
- 재대결 준비 시 room expiry를 8시간 연장한다.
- GAME_OVER UI에서 방장에게 `같은 방에서 재대결`, 모든 player에게 `방 나가기` action을 노출한다.
- disposable Supabase 테스트에 GAME_OVER leave 후 새 방 생성, rematch reset/restart, active-game guard, host-only rematch, host succession을 추가했다.
- 멀티클라이언트/reconnect 검증에서 GAME_OVER → rematch lobby → 재접속 → 재시작, host leave → host succession → 재접속 흐름을 추가 검증했고 DB integration run #116까지 통과했다.
- platform-native Invite용 `createCantStopInviteAdapter`를 추가해 공용 `game_room` envelope과 Registry capability guard를 재사용한다.
- Invite 공유는 사이트 공용 `site_invite_create` + `inviteShare` 링크/QR UI를 그대로 사용하도록 연결했다.
- 초대 진입은 `?invite=<token>`을 다시 resolve하고 expected game id를 검증한 뒤 Can’t Stop 서버 참가 RPC로 넘긴다.
- `cant_stop_join_room_by_invite` RPC는 서버에서 같은 token을 다시 `site_invite_resolve`하고 target type / game id / platform version / room id를 재검증한 뒤에만 waiting room 참가를 허용한다.
- revoked/mismatched invite 및 server/client room parity를 테스트로 고정했다.
- Invite 소스 구현 단계에서는 Registry `online/invite` capability를 비활성으로 유지했고, production migration과 권한/회귀 검증이 끝난 v1 activation에서 두 capability를 활성화했다.

## Current Work

- v1 release baseline 위에서 상태별 BGM maintenance PR을 검증 중이다. core rules / DB / RPC / Registry capability는 변경하지 않는다.
- Can’t Stop v1 기능 개발, 규칙 감사, 운영 DB 반영, Game Registry 활성화, 게임 목록 노출, 최종 인수인계 문서 정리까지 완료했다.
- Can’t Stop 자체는 유지보수 단계로 전환했다. 현재 진행 중인 필수 기능 작업은 없다.
- Can’t Stop에서 얻은 첫 platform-native 실전 피드백은 Game Platform 규칙/거버넌스에 환류하며, 이후 게임에서 공통성이 다시 검증될 때 shared 계약을 확장한다.

## Next Work

- 실제 플레이에서 `Frozen Star` → `Mountain Emperor` 전환 체감과 BGM/SFX 상대 음량을 관찰하고 필요할 때 game-local polish로 조정한다.
- 실제 사용자 플레이에서 발견되는 UX/안정성 문제는 v1.1 이후 유지보수 작업으로 분리한다.
- 2~4인 다중 브라우저 exploratory playtest는 자동 회귀 검증과 별개인 post-release 관찰 항목으로 계속 수행할 수 있다.
- 특히 remote bust audio는 브라우저 autoplay 정책 때문에 사용자 상호작용 전에는 소리가 제한될 수 있으므로 실사용에서 확인한다.
- core rules / server-authoritative contract / production migrations는 v1 release baseline으로 유지한다.

## Decisions

- BGM은 Game Platform shared contract로 올리지 않고 site-level `js/game-audio/` utility를 game-local presentation에서 소비한다. entry/waiting/rematch waiting은 `Frozen Star`, authoritative room `playing`은 `Mountain Emperor`로 고정한다. 사용자 pause는 상태 전환보다 우선한다.
- 공식 로드맵 단계명은 `Phase 4`를 사용하며 임의의 `Phase 4A`를 만들지 않는다.
- Can’t Stop은 기존 게임을 복사하지 않고 `games/cant-stop/`에서 처음부터 platform-native로 개발한다.
- bootstrap 당시에는 `GAME_SPEC.md`와 `DEVELOPMENT.md`만 두는 기준을 사용했으나, 현재 신규 게임 공통 기준은 `GAME_SPEC.md` + `UI_DESIGN.md` + `DEVELOPMENT.md` 세 문서다. Can't Stop은 release baseline을 보존하면서 현재 UI 기준을 `UI_DESIGN.md`에 소급 문서화했다.
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
- gameplay UI는 authoritative snapshot을 표시할 뿐 dice/pairing/runner 결과를 client에서 재계산해 truth로 사용하지 않는다.
- legal pairing이 정확히 하나여도 자동 적용하지 않고 active player가 명시적으로 plan을 선택해 commit한다.
- 재대결은 즉시 새 게임을 강제 시작하지 않고 GAME_OVER room을 waiting으로 되돌린 뒤 기존 ready/start 계약을 다시 사용한다.
- 진행 중 비방장 플레이어는 자신의 턴에 방 나가기가 가능하다. 3~4인 게임은 2명 이상 남으면 계속 진행하고, 2인 게임의 비방장 이탈은 승자 없이 `PLAYER_LEFT` GAME_OVER로 종료한다. 진행 중 방장은 게임 종료 흐름을 사용한다.
- Invite는 반드시 shared `game_room` 계약을 사용하고 game-local target type을 새로 만들지 않는다.
- client invite resolve는 라우팅/UX 검증이고 최종 room 참가 권한은 서버 `cant_stop_join_room_by_invite`가 token을 다시 검증해 결정한다.
- Invite 소스가 구현되어도 Registry `online/invite` capability는 운영 migration + smoke test가 끝날 때까지 false로 유지한다.
- 게임 로비의 닉네임 입력/변경 UI는 제거하고 사이트 프로필 닉네임을 사용한다. Can’t Stop DB는 room player nickname 저장 시 `profiles.display_name`을 강제해 client override를 authoritative 값으로 사용하지 않는다.

## Validation

- 상태별 BGM catalog / controller track switching / Can’t Stop mode mapping 자동 회귀 테스트를 추가했다. 최종 CI 결과는 이 PR 검증 후 갱신한다.
- PR #327 최종 기능 브랜치: Game Platform Governance / Site static checks / Game DB integration SUCCESS 후 main 병합 완료.
- 규칙 감사: JS rules engine + 운영 Supabase legal pairing/stop 계산 + 정식 기본 규칙을 대조했고 core gameplay 차이 없음.
- active leave 회귀: 4→3, 3→2 계속 진행 / 2→1 PLAYER_LEFT GAME_OVER / out-of-turn leave 거부 / active host leave 거부 / 이탈자 progress·claim·runner 정리 / replacement 재대결 재시작 검증 완료.
- production migration 검증: profile nickname authority, active-turn leave, two-player leave GAME_OVER 함수/권한/제약 확인 완료.
- PR #331 activation: Game Platform Governance SUCCESS, Site static checks SUCCESS, Community E2E smoke SUCCESS, Community authenticated E2E SUCCESS.
- PR #331 merge commit: `9225b3a22b4170f3f183de7915a9cc2edbf8f1a3`.
- PR #332에서 RELEASED 상태의 최종 인수인계 문서를 main에 반영했다.
- 게임 목록 카드 정렬/설명 UI 후속 PR #334~#336은 Site static checks / Community E2E smoke / Community authenticated E2E를 통과한 뒤 main에 반영됐다.

## Known Issues / Deferred

- v1 출시를 막는 known issue는 현재 없다.
- 실제 다중 브라우저 live smoke는 자동 회귀 검증과 별개로 사용자 관점에서 한 번 더 수행하면 좋다.
- Web Audio 기반 remote bust 사운드는 브라우저 autoplay 정책에 따라 해당 탭에서 사용자 상호작용 전에는 재생되지 않을 수 있다.
- Supabase security/performance advisor에는 프로젝트 전체에 이미 존재하던 경고가 남아 있다. 이번 Can’t Stop migration으로 anon EXECUTE가 새로 노출된 것은 확인되지 않았다.
- Can’t Stop Registry capability는 현재 `online=true`, `invite=true`, `local=false`, `presence=false`다.

## Release — 2026-09-21

- PR #327을 main에 병합했다. merge commit: `0fa282901d5be8b0d1bdb0d25beba7d5d4764a7e`.
- 운영 Supabase에 Can’t Stop room/gameplay/manual-end/profile-nickname/active-leave/2-player leave GAME_OVER migration까지 반영했다.
- production migration history:
  - `20260919140250 cant_stop_manual_end`
  - `20260920143502 cant_stop_profile_nickname`
  - `20260920143513 cant_stop_active_turn_leave`
  - `20260920150002 cant_stop_two_player_leave_game_over`
- 2인 게임에서 비방장이 자신의 턴에 나가면 승자 없이 `PLAYER_LEFT` GAME_OVER가 되고, 남은 방장은 재대결을 눌러 1인 waiting room으로 돌아간 뒤 새 플레이어 참가 후 다시 시작한다.
- PR #331에서 Game Registry `online=true`, `invite=true`를 활성화하고 사이트 게임 목록에 Can’t Stop 카드를 노출했다.
- PR #331은 main에 병합 완료했다. merge commit: `9225b3a22b4170f3f183de7915a9cc2edbf8f1a3`.
- 공용 `game_room` invite entry가 Registry의 Can’t Stop 경로를 통해 `./games/cant-stop/?invite=...`로 연결된다.
- v1 기준 사용자 흐름:
  - 승인회원 + 사이트 프로필 닉네임으로 방 생성/코드 참가/초대 참가
  - waiting board preview + profile avatar + ready tint + host start
  - server-random turn order, server-generated 4d6, authoritative pairing/runner/progress/claim
  - push/stop, 4초 bust presentation, Web Audio dice/blizzard sound
  - host manual game end, non-host own-turn leave, reconnect/snapshot recovery
  - GAME_OVER rematch / leave
- 규칙 감사 결과 기본 Can’t Stop 규칙과 core gameplay 구현은 일치하며, 의도적 digital adaptation은 시작 순서를 서버 랜덤 turn order로 정하는 부분이다.
- release closeout 시점에 Can’t Stop 관련 개발/임시 브랜치를 정리했고 최종 기준 브랜치를 `main`으로 고정했다.
- Can’t Stop은 Game Platform의 첫 production platform-native 기준 사례이며, 이 구현에서 확인한 release/document/feedback 규칙을 공통 플랫폼 규칙으로 환류한다.
