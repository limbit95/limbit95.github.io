# The Game Supabase

온라인 멀티플레이는 기존 청파 같이 Supabase 프로젝트 안에서 `the_game_*` 객체로 격리합니다.

## 적용된 migration

- `20260828005112_create_the_game_multiplayer_lobby`
- `20260828011611_the_game_online_game_start`
- `20260828012211_the_game_online_game_security_index_fix`
- `20260828020904_the_game_online_turn_actions`

## 데이터 경계

공개 상태:
- `public.the_game_rooms`
- `public.the_game_room_players`
- `public.the_game_games`
- `public.the_game_game_players`

비공개 상태:
- `private.the_game_draw_piles`: 실제 남은 덱
- `private.the_game_player_hands`: 실제 플레이어 손패
- `private.the_game_action_log`: 카드 제출/턴 종료 idempotency 기록

브라우저에서는 공개 상태만 직접 읽을 수 있습니다. 실제 덱, 다른 플레이어의 카드 숫자, action log는 `anon`과 `authenticated` 모두 직접 SELECT할 수 없고 Realtime에도 등록하지 않습니다. Snapshot RPC는 호출자 자신의 실제 손패만 반환합니다.

## 공개 RPC

대기방:
- `the_game_create_room`
- `the_game_join_room`
- `the_game_get_lobby_snapshot`
- `the_game_get_my_active_room`
- `the_game_set_ready`
- `the_game_leave_room`

게임 시작/복구:
- `the_game_start_game`
- `the_game_get_game_snapshot`
- `the_game_get_my_active_game`

턴 플레이:
- `the_game_play_card`
- `the_game_end_turn`

## 서버 규칙

### 게임 시작

서버가 로그인/승인 회원/방장/방 상태/버전/인원/준비 상태를 검증한 뒤 2~99 카드 98장을 섞습니다. 2인은 7장, 3~5인은 6장을 받습니다.

### 카드 제출

`the_game_play_card`가 다음을 서버에서 검증합니다.

- 진행 중 게임 / 현재 턴 플레이어
- 최신 `expectedVersion`
- 카드가 실제 본인 손패에 존재
- 유효한 공용 더미
- 일반 오름/내림 규칙
- 정확히 10 차이의 ±10 되돌리기
- 중복 `clientActionId`

성공 시 실제 손패, 공개 손패 개수, 공용 더미, 턴 제출 수와 게임 버전을 하나의 트랜잭션에서 갱신합니다.

### 턴 종료

`the_game_end_turn`은 원자적으로 다음을 처리합니다.

1. 덱이 남아 있으면 최소 2장, 덱이 비었으면 최소 1장 제출 여부 검증
2. 현재 플레이어 손패 보충
3. 공개 손패 개수와 남은 덱 개수 갱신
4. 다음 플레이어로 턴 이동
5. 덱 소진 후 손패 0장 플레이어 건너뛰기
6. 턴 번호 증가 / 제출 수 초기화
7. 승리·패배 판정

### 승패

- 남은 덱 + 모든 손패가 0장 → `won`
- 현재 플레이어가 필요한 최소 제출 장수를 더 이상 완성할 수 없음 → `lost`
- 2장 가능 여부는 첫 카드 제출로 바뀐 더미 상태까지 반영해 계산

게임 종료 시 방도 `finished`가 되고 `game.result`에 결과/남은 카드/제출 카드 수/종료 이유가 포함됩니다. 종료 결과도 새로고침 후 복구됩니다.

## 중복 요청 방지

`private.the_game_action_log`의 `(game_id, user_id, client_action_id)`가 유일합니다.

- 동일 요청 재전송 → 기존 응답 반환
- 같은 action ID를 다른 요청 내용으로 재사용 → 거절

빠른 더블탭이나 네트워크 재시도로 같은 카드가 두 번 빠지는 것을 서버에서도 막습니다.

## 게임 중 이탈

게임 진행 중 `the_game_leave_room`은 `GAME_IN_PROGRESS`로 거절합니다. 게임이 끝난 뒤 결과 화면에서 나가면 활성 멤버십을 정리할 수 있습니다.

## Realtime

공개 4개 테이블만 `supabase_realtime` publication에 등록합니다.

- `the_game_rooms`
- `the_game_room_players`
- `the_game_games`
- `the_game_game_players`

게임 화면은 게임/플레이어 변화뿐 아니라 결과 화면에서 다른 참가자가 먼저 나가 발생하는 room version 변화도 구독하고, 이벤트를 받으면 snapshot RPC를 다시 읽습니다.

## 다음 단계

실제 다중 기기 턴 플레이 검증 후:
- 결과 UX polish
- 재대결 / 같은 방 다시 시작
- 네트워크 끊김 UX 보강
- 필요 시 액션 로그 기반 기록/통계 확장
