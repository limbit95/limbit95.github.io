# The Game Supabase

온라인 멀티플레이는 기존 청파 같이 Supabase 프로젝트 안에서 `the_game_*` 객체로 격리합니다.

적용 migration:
- `20260828005112_create_the_game_multiplayer_lobby`
- `20260828011611_the_game_online_game_start`
- `20260828012211_the_game_online_game_security_index_fix`
- `20260828020904_the_game_online_turn_actions`

현재 구현 범위는 대기방/준비/게임 시작, 서버 셔플 및 비공개 손패, 카드 제출, 오름·내림/±10 검증, 최소 제출 수, 턴 종료와 손패 보충, 턴 순환, 덱 소진 규칙, 서버 승패 판정, Realtime 동기화, 중복 요청 방지입니다.

실제 덱/손패/action log는 private 스키마에 격리되며 상태 변경은 검증된 RPC에서만 처리합니다. 게임 진행 중 이탈은 차단하고 종료 후 정리합니다.

다음 단계는 실제 다중 기기 수동 검증입니다.
