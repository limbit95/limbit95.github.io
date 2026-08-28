# The Game Supabase

온라인 멀티플레이는 기존 청파 같이 Supabase 프로젝트 안에서 `the_game_*` 객체로 격리합니다.

## 적용된 migration

- `20260828005112_create_the_game_multiplayer_lobby`
- `20260828011611_the_game_online_game_start`
- `20260828012211_the_game_online_game_security_index_fix`

## 대기방

### `public.the_game_rooms`

- 6자리 `room_code`
- 방장 `host_user_id`
- 상태: `waiting`, `playing`, `finished`, `closed`
- 최대 인원 1~5명
- 현재 게임 `current_game_id`
- 동시성 제어용 `version`
- 생성/수정/만료 시각

### `public.the_game_room_players`

- 방/사용자 연결
- 닉네임
- 좌석 1~5
- 준비 상태
- `active` / `left` 멤버십 상태

한 사용자는 동시에 하나의 활성 The Game 방에만 참여할 수 있습니다.

## 온라인 게임 시작 상태

### 공개 상태: `public.the_game_games`

모든 게임 참가자가 알아도 되는 상태만 저장합니다.

- 게임/방 연결
- 게임 상태와 버전
- 현재 턴 좌석 / 턴 번호
- 이번 턴 제출 수
- 남은 덱 **개수만** 저장
- 네 공용 더미의 현재 숫자
- 시작/수정/종료 시각

### 공개 상태: `public.the_game_game_players`

- 게임 참가자 / 좌석 / 닉네임
- 각 참가자의 **손패 개수만** 저장
- 다른 플레이어 카드의 실제 숫자는 저장하지 않음

### 비공개 상태: `private.the_game_draw_piles`

- 서버가 관리하는 실제 남은 덱 카드 배열
- `anon`, `authenticated` 직접 SELECT 권한 없음
- Realtime publication에 등록하지 않음

### 비공개 상태: `private.the_game_player_hands`

- 플레이어별 실제 카드 숫자 배열
- `anon`, `authenticated` 직접 SELECT 권한 없음
- Realtime publication에 등록하지 않음
- 게임 snapshot RPC가 `auth.uid()` 본인 손패만 반환
- `user_id` FK 조회/삭제 경로를 위한 인덱스 적용

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

`the_game_start_game`은 다음 조건을 서버에서 다시 검증합니다.

- 로그인한 승인 회원
- 방장만 실행 가능
- 방 상태가 `waiting`
- 요청 `version`이 최신 상태와 일치
- 2명 이상 참가
- 모든 참가자가 준비 완료

검증 후 서버에서 2~99 카드 98장을 섞고 인원수에 맞게 손패를 배분합니다. 2인은 7장, 3~5인은 6장을 받습니다.

## RLS / 권한

- 모든 `public.the_game_*` 테이블은 RLS 활성화
- `anon`: 테이블 접근 없음, 공개 RPC 실행 불가
- `authenticated`: 자신이 참여 중인 방/게임의 공개 상태 SELECT만 허용
- `authenticated`: 게임 상태 테이블 직접 INSERT/UPDATE/DELETE 불가
- 쓰기 작업은 검증된 RPC에서만 수행
- 상태 변경 RPC는 `version`을 사용해 오래된 동시 변경을 거절
- 실제 덱/손패는 `private` 스키마에 두어 Data API 표면에서 분리
- RLS 게임 멤버 판별 helper는 `authenticated` 정책 평가에 필요한 실행 권한만 부여

## Realtime

대기방:

- `the_game_rooms`
- `the_game_room_players`

게임 공용 상태:

- `the_game_games`
- `the_game_game_players`

클라이언트는 Postgres Changes 이벤트를 신호로만 사용하고, 실제 화면 상태는 항상 검증된 snapshot RPC를 다시 읽어 갱신합니다.

`private.the_game_draw_piles`, `private.the_game_player_hands`는 Realtime에 등록하지 않습니다.

## 다음 DB 단계

게임 시작/배분 실제 서버 검증 후 별도 migration으로 다음을 추가합니다.

- 카드 제출 원자적 RPC
- ±10 되돌리기 서버 검증
- 턴 최소 제출 수 검증
- 턴 종료 / 손패 보충
- 덱 소진 후 1장 규칙
- 손패 0장 플레이어 건너뛰기
- 서버 승패 판정
- 카드 액션 중복 요청 방지 / 재접속 동기화
