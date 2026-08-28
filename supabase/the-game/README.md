# The Game Supabase

온라인 멀티플레이는 기존 청파 같이 Supabase 프로젝트 안에서 `the_game_*` 객체로 격리합니다.

적용 migration:
- `20260828005112_create_the_game_multiplayer_lobby`
- `20260828011611_the_game_online_game_start`
- `20260828012211_the_game_online_game_security_index_fix`
- `20260828020904_the_game_online_turn_actions`

현재 온라인 게임은 대기방, 서버 셔플/배분, 비공개 손패, 카드 제출, 오름/내림 및 ±10 검증, 최소 제출 수, 턴 종료, 손패 보충, 턴 순환, 덱 소진 규칙, 승패 판정, Realtime 동기화와 중복 요청 방지를 지원합니다.

공개 상태는 `public.the_game_rooms`, `public.the_game_room_players`, `public.the_game_games`, `public.the_game_game_players`에만 두고, 실제 덱/손패/action log는 `private` 스키마에 격리합니다. `anon`과 `authenticated`는 비공개 테이블을 직접 SELECT할 수 없습니다.

`the_game_play_card`와 `the_game_end_turn`이 서버 권위(authoritative) 상태 변경 API입니다. 상태 변경 시 현재 사용자/턴/버전/손패/규칙을 다시 검증합니다. `client_action_id`를 이용해 네트워크 재시도나 더블탭의 중복 처리를 막습니다.

게임 진행 중 이탈은 차단하며 종료 후 결과 화면에서 멤버십을 정리합니다. 종료 결과도 새로고침 후 복구되고, 게임 화면은 room/game/player 공용 상태 변화를 구독한 뒤 snapshot RPC로 상태를 다시 읽습니다.

다음 단계는 실제 다중 기기 턴 플레이 검증 후 결과 UX, 재대결, 네트워크 끊김 UX polish입니다.
