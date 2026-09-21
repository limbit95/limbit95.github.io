# No Thanks! 개발 진행

> 이 문서는 현재 개발 상태를 다음 작업자나 다음 채팅으로 전달하기 위한 인수인계 문서입니다.
> 게임 규칙과 구현 설계의 기준은 같은 디렉터리의 `GAME_SPEC.md`입니다.

## Current Status

- Phase: Room/Lobby runtime UI
- Status: IN_PROGRESS
- Active branch: `feature/no-thanks-game-phase5-room-ui`
- 마지막 기록: 2026-09-21

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

## Current Work

- Room/Lobby 실제 사용자 흐름과 authoritative snapshot/Realtime invalidation/reconnect 연결을 검증하는 단계입니다.

## Next Work

1. 서버 권위 gameplay RPC의 첫 slice로 `REFUSE_CARD`를 구현합니다.
2. `TAKE_CARD`에서 카드 획득, 중앙 칩 수령, 다음 카드 공개, 같은 플레이어 turn 유지까지 서버에서 처리합니다.
3. 마지막 카드 획득 시 최종 점수와 공동 승자를 서버 snapshot에 확정합니다.
4. gameplay action도 `expected_version + client_action_id` 계약과 private counter 경계를 유지합니다.
5. gameplay UI를 authoritative snapshot에 연결한 뒤 운영 migration/다중 브라우저 검증 전까지 Registry capability는 비활성 상태로 유지합니다.

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
- PLAYING preview: 현재 카드/본인 칩/남은 카드 수만 표시하고 gameplay action은 RPC 구현 전까지 숨김

## Validation

- 완료:
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
  - Game Platform-only PR이므로 개선된 CI 규칙에 따라 무관한 전체 Site static checks는 실행하지 않았습니다.
  - `package.json`에서 게임 플랫폼 관련 검증 명령이 `npm run test:game-platform`임을 확인했습니다.
  - 새 `rules.js`와 단위 테스트 파일에 `node --check`를 실행해 문법 오류가 없음을 확인했습니다.
  - `node --test tests/game-platform-no-thanks-rules.test.js`에 해당하는 동일 파일 구성을 로컬 검증 환경에서 실행했습니다.
  - 규칙 엔진 단위 테스트 12개가 모두 통과했습니다.
  - 실제 브랜치의 `rules.js`, 단위 테스트, 게임 등록부 파일과 로컬 검증 파일의 Git blob SHA가 각각 일치하는지 확인했습니다.
  - 게임 등록부의 `no-thanks` 항목이 `platform: "shared"`이고 모든 기능 활성화 값이 `false`로 해석되는지 확인했습니다.
  - `GAME_SPEC.md`와 `DEVELOPMENT.md`의 필수 섹션을 유지했습니다.
- 이번 단계에서 아직 수행하지 않는 검증:
  - 실제 브라우저 멀티플레이 점검
  - 운영 환경 마이그레이션 검증
- 위 항목은 아직 관련 데이터베이스나 사용자 화면 코드가 없으므로 후속 단계에서 수행합니다.

## Known Issues / Deferred

- 승인회원 접근 제어, Common Game Shell, Room/Lobby DB/RPC와 실제 entry/waiting room UI까지 연결했지만 gameplay action UI는 아직 연결하지 않았습니다.
- Room/Lobby 개발용 migration과 RPC는 추가했지만 운영 환경 적용과 gameplay RPC는 아직 없습니다.
- 게임 등록부에는 등록되어 있지만 모든 기능 활성화 값이 비활성 상태이며 출시된 게임으로 취급하지 않습니다.
- 특수 카드 확장은 기본 규칙 첫 버전 이후 별도 설계가 필요합니다.
- 게임 진행 중 플레이어 이탈, 방장 이탈, 재대결 정책은 서버 권위 방/로비 설계 단계에서 확정합니다.
- 현재 브랜치는 Room/Lobby runtime UI 작업 브랜치이며 `main`에는 직접 병합하지 않습니다.

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
