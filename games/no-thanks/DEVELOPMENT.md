# No Thanks! 개발 진행

> 이 문서는 현재 개발 상태를 다음 작업자나 다음 채팅으로 전달하기 위한 인수인계 문서입니다.
> 게임 규칙과 구현 설계의 기준은 같은 디렉터리의 `GAME_SPEC.md`입니다.

## Current Status

- Phase: Room/Lobby DB + RPC foundation
- Status: IN_PROGRESS
- Active branch: `feature/no-thanks-game-phase4-db-lobby`
- 마지막 기록: 2026-09-21

## Completed

- Access Gate + Common Game Shell PR #349 이후 Marble PR #350까지 반영된 최신 `main` (`5cfddb55...`)을 기준으로 Phase 4 Room/Lobby 작업 브랜치를 동기화했습니다.
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
- No Thanks! 전용 `no_thanks_rooms / room_players / room_private_players / room_secrets / room_actions` DB foundation을 추가했습니다.
- 승인회원 전용 create/join/snapshot/ready/leave/start RPC와 명시적 RLS/grant 경계를 추가했습니다.
- create/join RPC는 클라이언트 닉네임을 받지 않고 사이트 프로필 `display_name`을 서버에서 직접 확정합니다.
- 공개 room state와 private counter/secret deck을 물리적으로 분리해 direct table read로 비공개 상태가 노출되지 않도록 했습니다.
- room row lock + `expected_version`으로 충돌을 직렬화하고 `client_action_id` replay로 ready/start 재전송 idempotency를 구현했습니다.
- 게임 시작 시 서버가 3–7명 조건, host, 전원 ready를 검증하고 turn order, 전체 카드 셔플, 초기 칩 수를 authoritative하게 확정합니다.
- `createNoThanksRoomLobbyAdapter`를 shared `defineRoomLobbyAdapter` 계약에 연결하고 Realtime Postgres Changes를 room/player invalidation 신호로만 사용하도록 구현했습니다.
- disposable Game DB integration harness에 No Thanks! migration을 replay하도록 추가하고 플랫폼 필수 10개 DB 시나리오 테스트를 등록했습니다.

## Current Work

- Room/Lobby DB/RPC foundation과 adapter 구현을 완료하고 disposable Supabase DB contract 및 repository-level 검증을 진행하는 단계입니다.

## Next Work

1. 실제 entry 화면에 방 생성/참가/ready/start 사용자 흐름을 연결합니다.
2. Room/Lobby snapshot을 Common Game Shell roster와 상태 안내에 연결합니다.
3. snapshot coordinator + reconnect refresh를 연결합니다.
4. 실제 Room/Lobby 사용자 경로가 검증된 뒤에만 Registry `online` capability 활성화를 검토합니다.
5. 이후 카드 거절/가져오기 gameplay RPC와 private counter mutation을 구현합니다.

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
- 방 생성/참가/게임 시작 UI: DB/RPC 구현 전에는 노출하지 않음
- 게임 규칙 안내: game-local dialog로 제공하며 entry와 Shell action에서 다시 열 수 있음
- Room/Lobby DB namespace: `no_thanks_*`
- 방 정원: 생성 시 3–7명 범위에서 서버 검증
- Room identity 표시 이름: 클라이언트 입력 금지, 서버가 승인회원 `profiles.display_name` 사용
- 공개 game state와 보유 칩/미공개 카드 상태: 별도 테이블로 분리
- authenticated direct SELECT: 공개 `rooms / room_players`에만 허용하고 private player/secret/action table에는 허용하지 않음
- 게임 시작 시 서버가 turn order와 33장 전체 셔플을 생성하고 첫 카드만 공개
- Realtime: `no_thanks_rooms / no_thanks_room_players` 변경을 invalidation으로만 구독
- Room/Lobby adapter: shared `defineRoomLobbyAdapter` contract 사용

## Validation

- 완료:
  - Phase 4 작업 브랜치를 최신 `main` 커밋 `5cfddb55f34c3d4d2568b19aed50842268dddeda`에 동기화한 뒤 No Thanks! 변경만 다시 적용했습니다.
  - 기존 #344의 공통 foundation 전체 Registry ID/개수 고정 변경을 폐기하고 No Thanks! Registry 검증을 게임별 테스트로 분리했습니다.
  - PR #347은 최신 `main` 동기화 전 Game Platform governance를 통과했고, 동기화 후 동일 검증을 다시 수행합니다.
  - Game Platform JavaScript syntax check, 사이트 ↔ `games/shared` module link check, `npm run test:game-platform`, Governance Guard가 모두 통과했습니다.
  - Phase 3 PR #349에서 신규 `index.html / main.js / styles.css`의 JavaScript syntax와 module link 검증이 통과했습니다.
  - `tests/game-platform-no-thanks-shell.test.js`를 포함한 `npm run test:game-platform` 전체 계약 테스트가 통과했습니다.
  - Access Gate의 인증 필요/승인 필요 사유를 runtime에서 명시적으로 분기하고 알 수 없는 접근 상태는 별도 오류 화면으로 처리하도록 보완했습니다.
  - 최신 Phase 3 head의 Game Platform Governance Guard가 통과했습니다.
  - Game Platform-only PR이므로 개선된 CI 규칙에 따라 무관한 전체 Site static checks는 실행하지 않았습니다.
  - `package.json`에서 게임 플랫폼 관련 검증 명령이 `npm run test:game-platform`임을 확인했습니다.
  - 새 `rules.js`와 단위 테스트 파일에 `node --check`를 실행해 문법 오류가 없음을 확인했습니다.
  - `node --test tests/game-platform-no-thanks-rules.test.js`에 해당하는 동일 파일 구성을 로컬 검증 환경에서 실행했습니다.
  - 규칙 엔진 단위 테스트 12개가 모두 통과했습니다.
  - 실제 브랜치의 `rules.js`, 단위 테스트, 게임 등록부 파일과 로컬 검증 파일의 Git blob SHA가 각각 일치하는지 확인했습니다.
  - 게임 등록부의 `no-thanks` 항목이 `platform: "shared"`이고 모든 기능 활성화 값이 `false`로 해석되는지 확인했습니다.
  - `GAME_SPEC.md`와 `DEVELOPMENT.md`의 필수 섹션을 유지했습니다.
- 이번 단계에서 아직 수행하지 않는 검증:
  - 데이터베이스 통합 테스트
  - 실제 브라우저 멀티플레이 점검
  - 운영 환경 마이그레이션 검증
- 위 항목은 아직 관련 데이터베이스나 사용자 화면 코드가 없으므로 후속 단계에서 수행합니다.

## Known Issues / Deferred

- Room/Lobby DB/RPC와 adapter는 구현했지만 아직 실제 entry UI가 adapter를 소비하지 않아 사용자용 방 생성/참가 화면은 없습니다.
- Room/Lobby migration은 저장소와 disposable DB 검증용으로 추가했으며 운영 Supabase에는 아직 적용하지 않았습니다.
- 게임 등록부에는 등록되어 있지만 모든 기능 활성화 값이 비활성 상태이며 출시된 게임으로 취급하지 않습니다.
- 특수 카드 확장은 기본 규칙 첫 버전 이후 별도 설계가 필요합니다.
- 게임 진행 중 플레이어 이탈, 방장 이탈, 재대결 정책은 서버 권위 방/로비 설계 단계에서 확정합니다.
- 현재 브랜치는 Room/Lobby DB + RPC foundation 작업 브랜치이며 `main`에는 직접 병합하지 않습니다.

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
