# The Game Supabase

온라인 멀티플레이는 기존 청파 같이 Supabase 프로젝트 안에서 `the_game_*` 객체로 격리합니다.

적용 migration:
- `20260828005112_create_the_game_multiplayer_lobby`
- `20260828011611_the_game_online_game_start`
- `20260828012211_the_game_online_game_security_index_fix`
- `20260828020904_the_game_online_turn_actions`
- `20260828023047_the_game_active_game_exit`

현재 온라인 구현은 대기방, 게임 시작/배분, 비공개 손패, 카드 제출, 오름/내림 및 ±10 검증, 최소 제출 수, 턴 종료/손패 보충, 턴 순환, 덱 소진 규칙, 승패 판정, Realtime 동기화, 중복 요청 방지까지 포함합니다.

실제 덱·손패·action log는 private 스키마에 격리되고, 상태 변경은 인증된 RPC가 서버에서 다시 검증합니다.

진행 중 게임은 화면의 `게임 종료`를 통해 명시적으로 중단할 수 있습니다. 서버는 게임을 `abandoned`로 구분하고 방을 `closed` 처리한 뒤 모든 참가자의 활성 방 멤버십과 해당 게임의 비공개 손패·덱·action log를 정리합니다. 따라서 종료 직후 모든 참가자는 새 방을 생성하거나 다른 방에 참가할 수 있습니다. 다른 참가자 화면은 Realtime 갱신 후 활성 멤버십이 사라진 것을 감지하면 플레이 방식 선택 화면으로 돌아갑니다.

현재 단계는 실제 다중 기기 수동 검증 대기 상태입니다.
