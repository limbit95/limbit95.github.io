# The Game Supabase

온라인 멀티플레이는 기존 청파 같이 Supabase 프로젝트 안에서 `the_game_*` 객체로 격리합니다.

적용 migration:
- `20260828005112_create_the_game_multiplayer_lobby`
- `20260828011611_the_game_online_game_start`
- `20260828012211_the_game_online_game_security_index_fix`
- `20260828020904_the_game_online_turn_actions`

현재 구현 범위:
- 대기방 / 준비 / 게임 시작
- 서버 셔플 및 손패 배분
- 실제 덱/손패 private 격리
- 카드 제출과 오름/내림·±10 서버 검증
- 덱 유무에 따른 최소 제출 수
- 턴 종료 / 손패 보충 / 다음 플레이어
- 덱 소진 후 빈 손패 플레이어 건너뛰기
- 서버 승패 판정
- Realtime snapshot 동기화
- `client_action_id` 기반 중복 요청 방지
- 게임 진행 중 이탈 차단 / 종료 후 정리

다음 단계는 실제 다중 기기 턴 플레이 검증 후 결과 UX, 재대결, 네트워크 끊김 UX polish입니다.
