# Splendor Phase 2 — Live Lobby

## 범위

Phase 2에서는 게임 엔진에 들어가기 전 실제 멀티플레이 로비를 Supabase에 연결한다.

구현 범위:

- 기존 사이트 Supabase Auth / `profiles.status = approved` 재사용
- 게임 닉네임 입력
- 6자리 방 코드 생성
- 방 코드 참가
- 최대 4명 제한
- 한 사용자는 동시에 하나의 활성 스플렌더 방만 참가
- 플레이어 좌석 관리
- 준비 / 준비 취소
- 게임 중 사용할 닉네임 변경
- room version 기반 stale mutation 방지
- 활성 방 자동 복구
- private Realtime Broadcast 기반 invalidation + snapshot 재조회
- 방 나가기
- 대기방 방장 이탈 시 자동 승계
- 시작 조건 계산

아직 포함하지 않는 범위:

- `splendor_games` 생성
- 실제 게임 시작 트랜잭션
- ruleset/card/noble catalog
- 카드 셔플 및 공개 카드 세팅
- 보석/구매/예약/귀족/종료 RPC
- 게임 상태 Realtime

## DB

### `splendor_rooms`

대기방 자체를 저장한다.

핵심 필드:

- `id`
- `room_code`
- `host_user_id`
- `status`
- `max_players`
- `ruleset_key`
- `version`
- `expires_at`

현재 기본 만료 시간은 **생성 시점 + 8시간**이다.

### `splendor_room_players`

방 참가자를 저장한다.

핵심 필드:

- `room_id`
- `user_id`
- `nickname`
- `seat`
- `is_ready`
- `membership_status`

한 사용자가 여러 활성 방에 동시에 존재하지 않도록 partial unique index를 둔다.

## RPC

읽기:

- `splendor_get_my_active_room`
- `splendor_get_lobby_snapshot`

명령:

- `splendor_create_room`
- `splendor_join_room`
- `splendor_set_ready`
- `splendor_update_nickname`
- `splendor_leave_room`

변경 명령은 room `version`을 기준으로 최신 상태 여부를 검사한다. 버전이 다르면 `STATE_CHANGED`를 반환하고 클라이언트가 최신 snapshot을 다시 가져온다.

## 시작 조건

현재 로비 snapshot의 `can_start`는 다음 조건을 모두 만족할 때 true다.

1. 방 상태가 `waiting`
2. 활성 참가자가 2~4명
3. 모든 활성 참가자가 `is_ready = true`

Phase 2 UI에서는 이 조건만 실제 데이터로 표시하며, 실제 게임 생성/카드 셔플은 다음 단계에서 구현한다.

## 방장 이탈

대기방에서 방장이 나가면:

1. 남은 활성 참가자를 `seat`, `joined_at` 순으로 정렬
2. 가장 앞선 참가자를 새 방장으로 지정
3. 남은 참가자가 없으면 방을 `closed` 처리

게임 시작 후 이탈/포기 정책은 별도 게임 라이프사이클 단계에서 정의한다.

## Realtime

기존 라이어게임과 같은 private Broadcast 패턴을 사용한다.

```text
room/player mutation
      ↓
splendor_rooms.version + 1
      ↓
DB trigger
      ↓
private broadcast: splendor-room:{room_id}
      ↓
room member client
      ↓
splendor_get_lobby_snapshot 재조회
```

Broadcast payload를 권위 상태로 사용하지 않고 **invalidation 신호**로만 사용한다. 실제 화면 상태는 항상 snapshot RPC에서 다시 읽는다.

## 보안

- 승인 회원만 RPC 사용 가능
- RLS 활성화
- 방 참가자만 해당 room/player 행 SELECT 가능
- direct INSERT / UPDATE / DELETE는 브라우저 역할에서 차단
- Realtime topic 역시 현재 활성 방 멤버만 수신 가능
- 모든 public RPC는 내부에서 인증/승인/멤버십을 다시 검증

## 검증 결과

트랜잭션 테스트에서 다음 흐름을 확인했다.

```text
승인 회원 A 방 생성
→ 승인 회원 B 코드 참가
→ A 준비 완료
→ B 준비 완료
→ player_count = 2
→ all_ready = true
→ can_start = true
```

테스트 데이터는 트랜잭션 종료 시 rollback하여 실제 방 데이터는 남기지 않았다.
