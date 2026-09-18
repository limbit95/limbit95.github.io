# Can't Stop Development

> 현재 개발 상태를 다음 작업자/채팅으로 전달하는 인수인계 문서입니다.
> 게임 규칙과 구현 설계의 기준은 같은 디렉터리의 `GAME_SPEC.md`입니다.

## Current Status

- Phase: Phase 4
- Status: IN_PROGRESS
- Active branch: feature/game-platform-phase4-cant-stop-runtime-shell
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

## Current Work

- Access Gate + Common Game Shell 최소 runtime 변경에 대한 repository-level Game Platform 검증을 진행한다.

## Next Work

- game-specific Room/Lobby와 DB/RPC foundation을 설계하고 `defineRoomLobbyAdapter` 계약을 연결한다.
- online capability는 실제 Room/Lobby와 DB/Test Contract가 연결되는 변경에서만 true로 전환한다.
- 이후 authoritative dice/action → snapshot/reconnect → Realtime invalidation 순서로 확장한다.

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

## Validation

- Completed: 이전 bootstrap / rules-engine Game Platform governance 및 Site static checks
- Completed: rules engine unit test — 13/13 PASS
- Pending: `npm run test:game-platform` on runtime-shell PR
- Pending: Game Platform Governance Guard on runtime-shell PR
- Pending: Site static checks on runtime-shell PR

## Known Issues / Deferred

- 현재 보드는 구조 확인용이며 주사위/runner/permanent marker 인터랙션은 아직 연결하지 않았다.
- Room/Lobby / DB-RPC / authoritative gameplay / Realtime은 아직 구현하지 않았다.
- Registry에는 platform identity만 등록했고 capability는 실제 기능이 연결될 때 단계적으로 true로 전환한다.
- 게임 목록 UI는 아직 Can’t Stop을 노출하지 않는다.
- legal pairing이 정확히 하나일 때 UI가 자동 적용할지 확인 버튼을 보여줄지는 후속 UX 단계에서 결정한다.
