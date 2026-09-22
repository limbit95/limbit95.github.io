# No Thanks! Release Readiness Checklist

이 문서는 No Thanks!를 실제 서비스 기능으로 활성화하기 전 마지막 검증 게이트를 추적합니다.

## Automated gates

- [x] 순수 규칙 엔진 단위 테스트
- [x] 승인회원 Access Gate / Common Game Shell 계약 테스트
- [x] Room/Lobby DB/RPC 플랫폼 필수 계약
- [x] private counter / draw deck / excluded card 비노출 검증
- [x] gameplay stale version / duplicate / concurrent conflict 검증
- [x] 자연 종료 점수 / 공동 승자 / 방장 수동 종료 검증
- [x] reconnect snapshot authoritative 복원 검증
- [x] Presence lifecycle / 다중 탭 user merge 계약 테스트
- [x] 3개 독립 인증 세션 자연 종료 통합 검증
- [x] 7개 독립 인증 세션 full refuse cycle / private counter 격리 통합 검증

## Rematch / post-game

- [ ] 자연 종료 후 방장이 `재대결 준비`를 누르면 room code와 참가자 context가 유지된 채 waiting 상태로 돌아간다.
- [ ] 일반 플레이어 ready를 다시 완료한 뒤 방장이 같은 room에서 새 게임을 시작할 수 있다.
- [ ] 재대결 준비 상태에서 새로고침/재접속해도 같은 room의 authoritative waiting snapshot을 복원한다.
- [ ] GAME_OVER에서 방장이 나가면 남은 active player에게 host가 승계되고 새 host가 재대결 준비를 실행할 수 있다.
- [ ] 결과방에서 이탈한 플레이어가 있어 최소 인원 미만이면 새 참가자 또는 이탈자가 같은 room code로 참가한 뒤 다시 시작할 수 있다.

## Manual browser gates

아래 항목은 자동 DB 통합 테스트가 대체하지 않습니다.

- [ ] 데스크톱 3개 실제 브라우저/프로필에서 방 생성 → 참가 → 준비 → 시작 → 자연 종료
- [ ] 실제 7개 클라이언트에서 roster와 현재 차례 표시 확인
- [ ] 현재 차례 플레이어 브라우저 종료 → 다른 클라이언트에서 `재접속 대기` 확인 → 재접속 후 같은 turn 복원
- [ ] 방장 브라우저 종료 → 자동 위임/자동 종료가 발생하지 않는지 확인 → 방장 재접속 후 권한 복원
- [ ] 동일 사용자의 2개 탭 접속 시 Presence가 사용자 1명으로 표시되는지 확인
- [ ] 모바일 백그라운드 → foreground 복귀 시 authoritative snapshot 재조회 확인
- [ ] 네트워크 offline → online 복귀 시 connection banner와 최신 snapshot 복원 확인
- [ ] 결과방에서 재대결 준비 → 같은 room code와 참가자 맥락 유지 → ready 재설정 → 방장 재시작 확인

## Design closeout gate

- [ ] `UI_DESIGN.md` adoption baseline과 `UI_DECISIONS.md`의 최신 non-superseded decision을 함께 확인
- [ ] 수동 디자인 리뷰에서 확정된 수정이 코드에만 남고 `UI_DECISIONS.md`에 누락되지 않았는지 확인
- [ ] 남은 UI 항목을 release blocker와 post-release follow-up으로 구분
- [ ] `UI_DECISIONS.md / Current Design Track`에 release 가능 상태를 명확히 기록

## Production database gates

- [x] 운영 DB migration 적용 순서 재확인
- [x] Room/Lobby foundation 운영 migration 적용
- [x] Gameplay actions 운영 migration 적용
- [x] 공개 room/player 테이블만 Supabase Realtime publication에 등록
- [x] private helper 함수 EXECUTE 권한을 `PUBLIC / anon / authenticated`에서 회수하고 RLS helper만 authenticated에 유지
- [x] 운영 적용 직전/직후 Supabase security/performance advisor 확인
- [ ] 운영 migration 적용 후 승인회원 create/join/snapshot/gameplay 브라우저 smoke test
- [x] private table이 authenticated SELECT 및 Realtime publication에 노출되지 않는지 운영 환경 재확인
- [x] public gameplay/create RPC execute 권한이 authenticated에만 허용되는지 운영 환경 재확인

운영 migration history:
- `no_thanks_room_lobby_foundation`
- `no_thanks_gameplay_actions`
- `no_thanks_realtime_publication`
- `no_thanks_private_helper_permissions`

Advisor에서 No Thanks! 관련으로 남는 항목 중 `no_thanks_room_actions / no_thanks_room_private_state`의 RLS-without-policy는 직접 table access를 막는 의도적인 deny-all 경계입니다. public `SECURITY DEFINER` RPC 경고는 authenticated 사용자에게 의도적으로 노출한 API이며 각 함수가 승인회원/room/turn/version 권한을 서버에서 다시 검증합니다. FK covering index 2건은 현재 QA 차단 이슈가 아닌 INFO 항목으로 release hardening에서 재검토합니다.

## Activation gates

다음 항목은 위 manual browser / production DB gate가 모두 끝난 후 별도 PR에서 진행합니다.

- [ ] Registry `online: true` 활성화
- [ ] 필요 시 `presence: true` 활성화
- [ ] 게임 목록에 사용자용 서비스 상태로 노출
- [ ] invite 기능은 별도 구현/검증 전까지 비활성 유지
- [ ] release 후 첫 실제 세션 로그/오류 모니터링

## Release rule

자동 테스트가 통과해도 manual browser gate와 production DB gate가 남아 있으면 No Thanks!를 출시 완료로 간주하지 않습니다.
