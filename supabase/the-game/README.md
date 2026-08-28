# The Game Supabase

온라인 멀티플레이는 기존 청파 같이 Supabase 프로젝트 안에서 `the_game_*` 객체로 격리합니다.

## 적용된 migration

- `20260828005112_create_the_game_multiplayer_lobby`

## 1차 대기방 테이블

### `public.the_game_rooms`

- 6자리 `room_code`
- 방장 `host_user_id`
- 상태: `waiting`, `playing`, `finished`, `closed`
- 최대 인원 1~5명
- 동시성 제어용 `version`
- 생성/수정/만료 시각

### `public.the_game_room_players`

- 방/사용자 연결
- 닉네임
- 좌석 1~5
- 준비 상태
- `active` / `left` 멤버십 상태

한 사용자는 동시에 하나의 활성 The Game 방에만 참여할 수 있습니다.

## 공개 RPC

클라이언트 쓰기는 테이블 직접 INSERT/UPDATE/DELETE가 아니라 다음 RPC로만 처리합니다.

- `the_game_create_room`
- `the_game_join_room`
- `the_game_get_lobby_snapshot`
- `the_game_get_my_active_room`
- `the_game_set_ready`
- `the_game_leave_room`

모든 공개 RPC는 `authenticated`만 실행할 수 있고 함수 내부에서 `auth.uid()`와 `private.is_approved_member()`를 확인합니다.

## RLS / 권한

- 두 테이블 모두 RLS 활성화
- `anon`: 테이블 접근 없음, 공개 RPC 실행 불가
- `authenticated`: 자신이 활성 멤버인 방의 SELECT만 허용
- `authenticated`: 테이블 직접 INSERT/UPDATE/DELETE 불가
- 쓰기 작업은 검증된 RPC에서만 수행
- 방 상태 변경 RPC는 `version`을 사용해 오래된 상태의 동시 변경을 거절

## Realtime

아래 두 테이블을 `supabase_realtime` publication에 등록했습니다.

- `the_game_rooms`
- `the_game_room_players`

클라이언트는 방 ID로 Postgres Changes를 구독하고 변경 이벤트를 받으면 RPC snapshot을 다시 읽습니다. RLS에 의해 해당 방의 활성 멤버만 행을 읽을 수 있습니다.

## 다음 DB 단계

대기방 실제 서버 검증 후 별도 migration으로 다음을 추가합니다.

- 게임 세션/공용 더미 상태
- 플레이어별 비공개 손패
- 덱 상태
- 게임 시작 RPC
- 카드 제출/턴 종료 원자적 RPC
- 재접속용 게임 snapshot
