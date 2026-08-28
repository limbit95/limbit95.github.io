# The Game Supabase

온라인 멀티플레이는 기존 청파 같이 Supabase 프로젝트 안에서 `the_game_*` 객체로 격리합니다.

## 적용된 migration

- `20260828005112_create_the_game_multiplayer_lobby`
- `20260828011611_the_game_online_game_start`
- `20260828012211_the_game_online_game_security_index_fix`
- `20260828020904_the_game_online_turn_actions`

## 현재 온라인 턴 구조

공개 테이블은 `the_game_rooms`, `the_game_room_players`, `the_game_games`, `the_game_game_players`입니다. 실제 덱, 실제 손패, idempotency 로그는 `private` 스키마에 격리되어 브라우저에서 직접 읽을 수 없습니다.

공개 RPC는 대기방/시작/복구 외에 `the_game_play_card`, `the_game_end_turn`을 제공합니다.

서버는 카드 제출 시 현재 턴, 게임 버전, 실제 손패 보유 여부, 오름/내림 규칙, ±10 되돌리기, 중복 action ID를 검증합니다. 턴 종료 시 덱 유무에 따른 최소 제출 수를 확인하고 손패 보충, 덱 감소, 다음 플레이어 이동, 덱 소진 후 빈 손패 플레이어 건너뛰기와 승패 판정을 원자적으로 처리합니다.

승리 조건은 남은 덱과 모든 손패가 0장인 경우입니다. 패배는 현재 플레이어가 이번 턴에 필요한 최소 제출 장수를 더 이상 완성할 수 없을 때 판정하며, 2장 시퀀스 가능성은 첫 카드로 바뀐 더미 상태까지 반영합니다.

`private.the_game_action_log`은 `(game_id, user_id, client_action_id)`를 기준으로 동일 요청 재전송을 한 번만 처리합니다.

게임 진행 중 방 나가기는 서버에서 차단하고, 게임 종료 후 결과 화면에서만 활성 멤버십을 정리합니다. 종료 결과도 새로고침 후 복구됩니다.

Realtime에는 공개 4개 테이블만 등록하며 실제 상태는 이벤트마다 snapshot RPC를 다시 읽어 동기화합니다. 게임 화면에서도 room 변화를 구독해 결과 화면에서 다른 참가자가 먼저 나가더라도 최신 room version을 반영합니다.

## 다음 단계

실제 다중 기기 턴 플레이 검증 후 결과 UX, 재대결, 네트워크 끊김 UX를 다듬습니다.
