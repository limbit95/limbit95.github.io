# Can't Stop Development

> 현재 개발 상태를 다음 작업자/채팅으로 전달하는 인수인계 문서입니다.
> 게임 규칙과 구현 설계의 기준은 같은 디렉터리의 `GAME_SPEC.md`입니다.

## Current Status

- Phase: Phase 4
- Status: IN_PROGRESS
- Active branch: feature/game-platform-phase4-cant-stop-bootstrap
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

## Current Work

- 이번 bootstrap PR에서는 gameplay runtime과 Game Registry 등록을 아직 시작하지 않는다.

## Next Work

- bootstrap 규칙/가드 PR이 안정화되면 `GAME_SPEC.md` 기준으로 pure Can't Stop rules engine과 unit test부터 구현한다.
- 첫 runtime 파일을 추가하는 변경에서 Game Registry 등록을 함께 추가한다.
- rules engine 이후 Access Gate → Room/Lobby → DB/RPC → DB/Test Contract → snapshot/reconnect 순서로 online foundation을 연결한다.

## Decisions

- 공식 로드맵 단계명은 `Phase 4`를 사용하며 임의의 `Phase 4A`를 만들지 않는다.
- Can’t Stop은 기존 게임을 복사하지 않고 `games/cant-stop/`에서 처음부터 platform-native로 개발한다.
- bootstrap 상태에서는 `GAME_SPEC.md`와 `DEVELOPMENT.md`만 두고 Registry에 노출하지 않는다.
- game-specific dice/pairing/runner 규칙은 `games/shared/`로 올리지 않는다.
- online gameplay의 주사위 결과와 상태 전이는 최종적으로 서버가 authoritative하게 결정한다.

## Validation

- Completed: 원본 규칙 PDF, Board Game Arena, BoardGameGeek 및 column 자료를 교차 확인
- Pending: `npm run test:game-platform` (현재 실행 환경에서 GitHub 네트워크 clone이 불가해 PR CI로 검증)
- Pending: Game Platform Governance Guard PR CI
- Pending: PR CI

## Known Issues / Deferred

- 첫 플레이어 결정 방식을 원본의 사전 dice roll로 유지할지 server-random turn order로 단순화할지 아직 확정하지 않았다.
- rules engine/runtime/DB/UI는 아직 구현하지 않았다.
- Game Registry 등록과 capability 선언은 runtime 구현 시작 시점까지 의도적으로 보류한다.
