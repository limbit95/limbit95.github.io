# The Game Supabase

온라인 멀티플레이는 기존 청파 같이 Supabase 프로젝트 안에서 `the_game_*` 객체로 격리합니다.

적용 migration:
- `20260828005112_create_the_game_multiplayer_lobby`
- `20260828011611_the_game_online_game_start`
- `20260828012211_the_game_online_game_security_index_fix`
- `20260828020904_the_game_online_turn_actions`
- `20260828023047_the_game_active_game_exit`
- `20260828025201_the_game_rematch_flow`
- `20260828173213_the_game_pile_setup_settings`
- `20260828173606_the_game_settings_rpc_permissions`
- `20260828215256_the_game_blank_starting_cards`
- `20260828215438_the_game_blank_card_snapshot_markers`

현재 온라인 구현은 대기방, 게임 시작/배분, 비공개 손패, 카드 제출, 오름/내림 및 ±10 검증, 최소 제출 수, 턴 종료/손패 보충, 턴 순환, 덱 소진 규칙, 승패 판정, Realtime 동기화, 중복 요청 방지까지 포함합니다.

게임 시작 전 방장은 네 더미를 유지한 채 시작 카드를 `1·1·100·100`, `1·빈 카드·100·100`, `1·1·100·빈 카드`, `1·빈 카드·100·빈 카드` 중에서 선택할 수 있습니다. 기본값은 기존과 동일한 `1·1·100·100`입니다. 빈 카드는 첫 번째로 놓이는 2~99 숫자를 그대로 받아 기준값을 만든 뒤 해당 더미의 오름차순 또는 내림차순 규칙을 이어갑니다.

실제 덱·손패·action log는 private 스키마에 격리되고, 상태 변경은 인증된 RPC가 서버에서 다시 검증합니다.

진행 중 게임은 화면의 `게임 종료`를 통해 명시적으로 중단할 수 있습니다. 서버는 게임을 `abandoned`로 구분하고 방을 `closed` 처리한 뒤 모든 참가자의 활성 방 멤버십과 해당 게임의 비공개 손패·덱·action log를 정리합니다. 따라서 종료 직후 모든 참가자는 새 방을 생성하거나 다른 방에 참가할 수 있습니다. 다른 참가자 화면은 Realtime 갱신 후 활성 멤버십이 사라진 것을 감지하면 플레이 방식 선택 화면으로 돌아갑니다.

정상적으로 승리/패배한 게임에서는 방장이 `같은 멤버로 재대결`을 선택할 수 있습니다. `the_game_prepare_rematch` RPC는 종료된 게임과 방장 권한, 방 버전을 다시 검증한 뒤 기존 방과 활성 멤버를 유지하고 모두의 준비 상태를 해제합니다. 이전 게임의 private 손패·덱·action log는 정리되고 방은 `waiting` 상태로 돌아가므로 전원이 다시 준비한 뒤 새로 셔플된 게임을 시작합니다. 비방장 참가자도 room Realtime 변경을 감지하여 같은 대기방으로 자동 이동합니다.

로비와 게임 화면은 Realtime 채널의 `CHANNEL_ERROR`/`TIMED_OUT` 및 브라우저 `offline`/`online` 이벤트를 감지합니다. 연결이 복구되면 최신 snapshot을 다시 읽고 채널을 재구독하여 턴, 더미, 덱, 손패 개수, 준비 상태를 서버 상태에 맞춥니다.

현재 단계는 재대결/재연결을 포함한 실제 다중 기기 수동 검증 대기 상태입니다.
