# The Game Supabase

온라인 멀티플레이는 기존 청파 같이 Supabase 프로젝트 안에서 `the_game_*` 객체로 격리합니다.

현재 적용된 The Game migration은 다음과 같습니다.

- `20260828005112_create_the_game_multiplayer_lobby`
- `20260828011611_the_game_online_game_start`
- `20260828012211_the_game_online_game_security_index_fix`
- `20260828020904_the_game_online_turn_actions`

현재 구현 범위는 대기방, 서버 셔플/배분, 비공개 손패, 카드 제출, 오름/내림 및 ±10 검증, 최소 제출 수, 턴 종료, 손패 보충, 턴 순환, 덱 소진 규칙, 승패 판정, Realtime 동기화와 중복 요청 방지입니다.

실제 덱/손패/action log는 `private` 스키마에 격리하고, 상태 변경은 검증된 RPC에서만 수행합니다. 게임 진행 중 이탈은 차단하며 게임 종료 뒤 결과 화면에서 정리합니다.

다음 단계는 실제 다중 기기 턴 플레이 검증 후 결과 UX, 재대결, 네트워크 끊김 UX polish입니다.
