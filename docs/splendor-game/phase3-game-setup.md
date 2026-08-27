# Splendor Phase 3 — 실제 게임 시작 / 초기 세팅

## 목표

Phase 2에서 검증한 실시간 대기방을 실제 게임 상태로 전환한다.

```text
대기방
  ↓ 방장 게임 시작
서버 트랜잭션
  ├─ 참가자/준비/버전 검증
  ├─ 게임 생성
  ├─ 플레이어 상태 고정
  ├─ 카드 티어별 셔플
  ├─ 각 티어 4장 공개
  ├─ 귀족 인원수+1명 선택
  ├─ 인원수별 보석 공급량 설정
  └─ 선 플레이어 랜덤 선정
  ↓
모든 참가자가 동일한 서버 Snapshot으로 게임판 진입
```

## 이번 Phase에 포함된 기능

- `splendor_start_game` 실제 RPC
- 방장만 시작 가능
- 방 상태/room version 잠금 및 검증
- 2~4명 + 전원 준비 조건 서버 재검증
- 한 방당 하나의 게임만 생성
- `splendor-test-v1` 룰셋 고정
- 카드 catalog / game instance 분리
- 티어별 서버 셔플
- 각 티어 공개 카드 4장
- 남은 덱 장수 Snapshot 제공
- 귀족 `플레이어 수 + 1`명 무작위 선택
- 2인 일반 보석 4개씩 / 3인 5개씩 / 4인 7개씩
- 금 토큰 5개
- 실제 참가자 좌석 중 선 플레이어 무작위 선정
- 플레이어 초기 점수/토큰/보너스 0
- 방 상태 `waiting → playing`
- Realtime 방 Broadcast를 통해 다른 참가자도 자동으로 게임판 진입
- 새로고침/재접속 시 `playing` 방이면 실제 게임 Snapshot 복구

## 테스트 룰셋

현재 `splendor-test-v1`은 엔진 검증을 위한 자체 데이터다.

- 1단계 카드 10장
- 2단계 카드 10장
- 3단계 카드 10장
- 귀족 6명

카드명, 비용, 점수 등은 구현 검증을 위해 작성한 테스트 데이터이며 공식 Splendor 카드 catalog를 복제한 것이 아니다.

공식 일러스트/최종 카드 데이터 이슈와 게임 엔진 개발은 분리한다. 추후 최종 룰셋이 정해지면 catalog만 교체하고 게임 인스턴스/턴 엔진 구조는 유지한다.

## 데이터 모델

### Catalog

- `splendor_rulesets`
- `splendor_card_catalog`
- `splendor_noble_catalog`

### Game State

- `splendor_games`
- `splendor_game_players`
- `splendor_game_cards`
- `splendor_game_nobles`

Catalog와 실제 게임 인스턴스를 분리하여 한 게임에서 사용된 카드의 위치와 소유자를 별도로 관리한다.

## 비공개 정보 보호

`splendor_game_cards`는 브라우저에서 직접 SELECT하지 않는다.

이유:

- 덱 순서가 노출되면 다음 카드 예측 가능
- 추후 뒷면 예약 카드 정보가 다른 참가자에게 노출될 수 있음

따라서 브라우저는 `splendor_get_game_snapshot` RPC만 사용하고, 서버는 현재 공개해도 되는 카드만 Snapshot에 포함한다.

현재 Snapshot에는 `location = face_up`인 카드만 포함된다.

## 게임 시작 검증

`public.splendor_start_game(room_id, expected_version)`은 한 트랜잭션에서 다음을 검증한다.

1. 로그인 여부
2. 승인 회원 여부
3. 방 존재/만료 여부
4. 요청 room version 일치
5. 방 상태가 `waiting`
6. 요청자가 방장인지
7. 현재 방 참가자인지
8. 이미 생성된 게임이 없는지
9. 참가자 수가 2~4명인지
10. 모든 참가자가 준비 완료인지
11. 룰셋이 존재하는지
12. 티어별 공개 가능한 카드가 4장 이상인지
13. 귀족이 `플레이어 수+1` 이상인지

검증이 하나라도 실패하면 게임 일부만 생성되는 것이 아니라 전체 트랜잭션이 실패한다.

## Realtime

게임 시작 시 `splendor_rooms.version`이 증가하면서 기존 Phase 2의 private Broadcast가 발생한다.

다른 참가자는 Broadcast 자체를 게임 상태로 신뢰하지 않고 다음 순서로 처리한다.

```text
state_changed 수신
  ↓
Lobby Snapshot 재조회
  ↓
room.status == playing
  ↓
Game Snapshot 재조회
  ↓
게임판 렌더링
```

이 방식으로 모든 브라우저가 DB를 Source of Truth로 사용한다.

## 검증 결과

롤백 트랜잭션으로 실제 `splendor_start_game`을 호출하여 확인했다.

| 인원 | 일반 보석/색 | 금 | 공개 카드 | 귀족 | 티어별 남은 덱 |
|---|---:|---:|---:|---:|---:|
| 2명 | 4 | 5 | 12 | 3 | 6 / 6 / 6 |
| 3명 | 5 | 5 | 12 | 4 | 6 / 6 / 6 |
| 4명 | 7 | 5 | 12 | 5 | 6 / 6 / 6 |

선 플레이어가 실제 참가 좌석 중 무작위로 선택되고, 방 상태가 `playing`으로 전환되는 것도 확인했다.

테스트용 방과 게임 데이터는 모두 rollback했다.

## 다음 Phase

Phase 4에서는 실제 턴 행동을 구현한다.

우선순위:

1. 서로 다른 보석 최대 3개 획득
2. 같은 색 보석 2개 획득 조건
3. 턴 종료 및 다음 플레이어 이동
4. 토큰 10개 초과 반환 처리
5. 공개 카드 예약 + 금 토큰 지급
6. 덱 맨 위 비공개 예약
7. 카드 구매 비용/영구 보너스 계산
8. 구매/예약 후 공개 카드 자동 보충
9. 모든 행동의 expected game version / idempotency 적용

귀족 획득, 15점 최종 라운드, 승리 판정은 이후 턴 행동 기반이 안정된 다음 연결한다.
