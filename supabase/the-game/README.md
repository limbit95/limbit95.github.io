# The Game Supabase

온라인 멀티플레이는 기존 청파 같이 Supabase 프로젝트 안에서 `the_game_*` 객체로 격리합니다.

현재 적용 migration:
- `20260828005112_create_the_game_multiplayer_lobby`
- `20260828011611_the_game_online_game_start`
- `20260828012211_the_game_online_game_security_index_fix`
- `20260828020904_the_game_online_turn_actions`

현재 단계에서는 실제 온라인 턴 플레이까지 구현되어 있습니다. 서버가 카드 제출 규칙, 최소 제출 수, 턴 종료/손패 보충, 다음 플레이어, 덱 소진 규칙, 승패, 중복 요청을 권위적으로 검증합니다. 실제 덱/손패/action log는 private 스키마에 격리되고, 브라우저에는 본인 손패와 공용 상태만 반환됩니다.

Realtime은 공용 room/game/player 변경을 신호로 사용하고 snapshot RPC를 다시 읽어 모든 기기의 상태를 맞춥니다. 게임 진행 중 방 나가기는 막고, 종료 뒤 결과 화면에서 정리할 수 있습니다.

현재 단계는 실제 다중 기기 수동 검증 대기 상태입니다.
