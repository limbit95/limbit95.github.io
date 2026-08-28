# The Game Supabase

온라인 멀티플레이는 기존 청파 같이 Supabase 프로젝트 안에서 `the_game_*` 객체로 격리합니다.

## 적용된 migration

- `20260828005112_create_the_game_multiplayer_lobby`
- `20260828011611_the_game_online_game_start`
- `20260828012211_the_game_online_game_security_index_fix`
- `20260828020904_the_game_online_turn_actions`

## 현재 구현 범위

### 대기방

`public.the_game_rooms`, `public.the_game_room_players`가 방 코드, 방장, 참가자, 준비 상태와 활성 멤버십을 관리합니다. 한 사용자는 동시에 하나의 활성 The Game 방에만 참여할 수 있습니다.

게임 진행 중에는 서버 RPC가 방 나가기를 거절합니다. 게임이 끝난 뒤 결과 화면에서 나가기를 실행하면 활성 멤버십이 정리됩니다.

### 공개 게임 상태

`public.the_game_games`, `public.the_game_game_players`에는 모든 참가자가 알아도 되는 정보만 저장합니다.

- 게임 상태 / 버전
- 현재 턴 / 턴 번호
- 이번 턴 제출 수
- 남은 덱 개수
- 네 공용 더미의 현재 숫자
- 각 플레이어의 손패 **개수만**

### 비공개 게임 상태

`private.the_game_draw_piles`, `private.the_game_player_hands`는 실제 남은 덱과 실제 플레이어 손패를 저장합니다. `anon`, `authenticated`는 직접 읽을 수 없고 Realtime publication에도 등록하지 않습니다. Snapshot RPC는 호출자의 실제 손패만 반환합니다.

`private.the_game_action_log`는 카드 제출/턴 종료 요청의 idempotency를 보장합니다. `(game_id, user_id, client_action_id)`가 유일하며 동일 요청 재전송은 저장된 응답을 반환하고, 같은 ID를 다른 내용으로 재사용하면 거절합니다.

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

서버가 로그인/승인 회원/방장/방 상태/버전/인원/준비 상태를 다시 검증한 뒤 2~99 카드 98장을 섞습니다. 2인은 7장, 3~5인은 6장을 받습니다.

### 카드 제출

`the_game_play_card`가 다음을 모두 서버에서 검증합니다.

- 진행 중인 게임인지
- 현재 턴 플레이어인지
- `expectedVersion`이 최신인지
- 제출 카드가 본인 실제 손패에 있는지
- 대상이 올바른 공용 더미인지
- 일반 오름/내림 규칙
- 정확히 10 차이의 ±10 되돌리기
- 중복 `clientActionId`

성공 시 실제 손패, 공개 손패 개수, 공용 더미, 이번 턴 제출 수와 게임 버전을 하나의 트랜잭션에서 갱신합니다.

### 턴 종료

`the_game_end_turn`은 다음을 원자적으로 처리합니다.

1. 덱이 남아 있으면 최소 2장, 덱이 비었으면 최소 1장 제출 여부 검증
2. 현재 플레이어 손패를 원래 손패 크기까지 비공개 덱에서 보충
3. `hand_count`, `draw_count` 동기화
4. 다음 플레이어로 턴 이동
5. 덱이 비었을 때 손패 0장 플레이어 건너뛰기
6. 턴 번호 증가 / 턴 제출 수 초기화
7. 승리·패배 판정

### 승패 판정

- 남은 덱 + 모든 손패가 0장 → `won`
- 현재 플레이어가 필요한 최소 제출 장수를 더 이상 완성할 수 없음 → `lost`
- 최소 2장 가능 여부는 첫 카드 제출로 변한 더미 상태까지 시뮬레이션해 판단

게임 종료 시 방도 `finished`가 되고 snapshot에 `outcome`, `remaining_cards`, `cards_played`, `reason`을 담은 `game.result`가 포함됩니다. 결과 상태도 새로고침 후 복구됩니다.

## 권한 / Realtime

- public The Game 테이블은 RLS 활성화
- `anon`: 공개 RPC 실행 불가
- `authenticated`: 참가 중인 방/게임 공개 상태만 SELECT 가능
- 게임 상태 직접 쓰기 차단
- 실제 덱/손패/action log는 `private` 스키마에 격리
- Realtime publication은 public의 `the_game_rooms`, `the_game_room_players`, `the_game_games`, `the_game_game_players`만 포함
- 클라이언트는 Realtime 이벤트를 신호로 사용하고 항상 snapshot RPC를 다시 읽어 화면을 동기화

## 다음 단계

실제 다중 기기 턴 플레이 검증 후:

- 게임 결과 UX 세부 polish
- 재대결 / 같은 방 다시 시작
- 네트워크 끊김 UX 보강
- 필요 시 액션 로그 기반 기록/통계 확장

## 이번 수동 검증 핵심

- 현재 턴 플레이어만 카드 선택 가능
- 카드 선택 시 합법적인 더미만 강조
- 카드 제출이 다른 기기에 실시간 반영
- 덱이 남은 동안 2장 미만이면 턴 종료 불가
- 턴 종료 후 손패 보충 / 덱 감소 / 다음 플레이어 전환
- ±10 되돌리기 표시와 서버 적용
- 새로고침 후 같은 턴과 본인 손패 복구
- 게임 종료 결과가 모든 참가자에게 동기화
- 결과 화면에서 참가자가 순서대로 나가도 room version이 실시간 갱신되어 정상 정리
