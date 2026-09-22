# No Thanks! 개발 인수인계 — 2026-09-22

> 새 채팅이나 다음 작업자가 현재 상태를 빠르게 이어받기 위한 요약 문서입니다.
> 규칙/아키텍처의 상세 기준은 `GAME_SPEC.md`, 누적 개발 이력은 `DEVELOPMENT.md`, 출시 게이트는 `RELEASE_CHECKLIST.md`를 기준으로 합니다.

## 1. 현재 기준점

- 저장소: `limbit95/limbit95.github.io`
- 최신 main 기준 커밋: `3116e3cda3523d1f2863d15f50f9f5e075ed2535`
- 게임 ID: `no-thanks`
- 지원 인원: 3–7명
- 현재 단계: **운영 DB 준비 완료 / 실제 브라우저 수동 QA 대기**
- Registry capability: **아직 비활성**
- 게임 목록 일반 공개: **아직 하지 않음**
- invite: **아직 비활성**
- production Supabase migration: **적용 완료**

다음 작업을 시작할 때는 반드시 최신 `main`을 다시 확인하고 별도 작업 브랜치를 생성합니다.

## 2. 현재 사용자 흐름

현재 main에는 다음 사용자 흐름이 구현되어 있습니다.

1. 승인회원 Access Gate 통과
2. No Thanks! entry 진입
3. 새 방 생성 또는 6자리 방 코드 참가
4. 3–7명 로비 구성
5. 일반 플레이어 준비 / 준비 취소
6. 방장 게임 시작
7. 서버가 turn order와 카드 순서를 무작위 결정
8. 실제 플레이
   - 거절하기
   - 카드 가져오기
   - 칩 0개일 때 강제 가져오기
   - 현재 카드 / 중앙 칩 / 내 칩 / 남은 카드 / 획득 카드 표시
9. 마지막 카드 획득 시 서버가 최종 점수와 공동 승자를 계산
10. 방장 수동 게임 종료 가능
11. 결과 화면
12. 방장이 새 게임 방 생성 가능
13. 기존 참가자는 새 방 코드로 다시 참가

## 3. 서버 권위 / 보안 경계

게임 상태 변경은 클라이언트가 직접 테이블을 수정하지 않고 RPC를 통해서만 수행합니다.

주요 public RPC:

- `no_thanks_create_room`
- `no_thanks_join_room`
- `no_thanks_get_my_active_room`
- `no_thanks_get_lobby_snapshot`
- `no_thanks_set_ready`
- `no_thanks_leave_room`
- `no_thanks_start_game`
- `no_thanks_play_action`

상태 변경 요청은 기본적으로 다음 경계를 사용합니다.

- `room_id`
- `expected_version`
- `client_action_id`
- action payload

서버는 room/private state를 transaction 안에서 잠그고 room membership, 현재 turn, 방장 권한, version, duplicate action을 검증합니다.

### 공개 상태

- room 정보 / version
- 현재 게임 phase
- turn order
- active player
- current card
- center counters
- deck remaining
- 각 플레이어 공개 획득 카드
- GAME_OVER 이후 final scores / winners

### 현재 사용자에게만 공개

- 본인의 정확한 보유 칩 수 (`viewer.counters`)

### 비공개 서버 상태

- 다른 플레이어의 정확한 칩 수
- 남은 draw deck 실제 순서
- 제외된 9장

## 4. DB 구조

운영 Supabase에는 다음 객체가 적용되어 있습니다.

- `public.no_thanks_rooms`
- `public.no_thanks_room_players`
- `public.no_thanks_room_actions`
- `public.no_thanks_room_private_state`

주요 migration:

- `20260921225000_no_thanks_room_lobby_foundation.sql`
- `20260922055300_no_thanks_gameplay_actions.sql`
- `20260922060000_no_thanks_realtime_publication.sql`
- `20260922060100_no_thanks_private_helper_permissions.sql`

운영 Supabase migration history에도 다음이 적용되어 있습니다.

- `no_thanks_room_lobby_foundation`
- `no_thanks_gameplay_actions`
- `no_thanks_realtime_publication`
- `no_thanks_private_helper_permissions`

### 권한 상태

- anon create/gameplay RPC 실행: 차단
- authenticated public RPC 실행: 허용
- private-state table anon/authenticated SELECT: 차단
- room/player/action/private-state RLS: 활성
- `private.no_thanks_snapshot` 등 내부 helper의 클라이언트 직접 EXECUTE: 차단
- RLS에 필요한 `private.no_thanks_is_room_member`만 authenticated helper 권한 유지

## 5. Realtime / Presence / reconnect 정책

Realtime `postgres_changes`는 authoritative state 자체가 아니라 **변경 알림 신호**로만 사용합니다.

`supabase_realtime` publication에는 다음 공개 테이블만 등록되어 있습니다.

- `no_thanks_rooms`
- `no_thanks_room_players`

다음은 publication에 포함하지 않습니다.

- `no_thanks_room_actions`
- `no_thanks_room_private_state`

최종 화면 상태는 항상 RPC snapshot을 다시 조회해 복원합니다.

Presence 정책:

- Presence는 roster 온라인/오프라인 표시용
- Presence는 ready/start/turn/action 권한 판정에 사용하지 않음
- Presence payload는 `userId / onlineAt`만 사용
- 동일 사용자의 여러 탭은 user id 기준으로 온라인 1명으로 합산

disconnect 정책:

- 브라우저 종료 / 네트워크 단절은 leave가 아님
- membership / host ownership / turn 유지
- active player가 끊겨도 turn 자동 이동 없음
- host가 끊겨도 자동 위임/자동 게임 종료 없음
- 재접속 시 `get_my_active_room` + authoritative snapshot으로 복원
- stale room tracker callback이 새 rematch room을 덮지 못하도록 generation guard 적용

## 6. 재대결 정책

같은 room의 terminal state를 reset하지 않습니다.

1. GAME_OVER 결과방에서 방장이 `새 게임 방 만들기` 선택
2. 기존 결과방 종료
3. 같은 최대 인원의 새 room 생성
4. 새 room code 발급
5. 기존 참가자들은 새 code로 다시 참가

이전 game의 version / client_action_id / private deck / counter state를 새 게임에서 재사용하지 않습니다.

## 7. 자동 검증 완료 범위

다음 자동 검증은 main 반영 전 모두 통과했습니다.

### Game Platform

- JavaScript syntax
- site ↔ `games/shared` module link
- `npm run test:game-platform`
- Governance Guard
- Site static checks

### Room/Lobby DB contract

- anonymous create/join 차단
- unapproved create/join 차단
- approved create/join 허용
- non-member snapshot 차단
- 방장 start 권한
- stale version 거부
- duplicate action idempotency
- concurrent action single commit
- reconnect authoritative snapshot
- private state 비노출

### Gameplay

- active-player refuse
- private counter 감소
- center counter 증가
- turn 이동
- take 후 중앙 칩 획득
- same-player turn 유지
- 마지막 카드 자연 종료
- 연속 카드 점수 계산
- 공동 승자
- 방장 수동 종료
- GAME_OVER terminal leave
- null `expected_version` 거부
- conflicting concurrency
- 동일 `client_action_id` concurrent duplicate retry → 동일 snapshot / version 1회 증가

### Multi-client disposable Supabase

3인:

- 독립 승인회원 session 3개
- 참가 / 준비 / 시작
- 각자 초기 칩 11
- full refuse cycle
- reconnect snapshot
- 자연 종료
- 최종 점수 / 승자 일치

7인:

- 독립 승인회원 session 7개
- 참가 / 준비 / 시작
- 각자 초기 칩 7
- full refuse cycle
- 모든 viewer private counter 6
- 한 사용자가 중앙 칩 7개 획득 후 actor=13 / 나머지=6
- 각 viewer가 자기 counter만 정확히 받는지 재검증
- 다른 player counter / playerCounters 비노출
- same-player turn 유지
- reconnect snapshot

## 8. 운영 Supabase Advisor 확인

운영 적용 전/후 Security / Performance Advisor를 확인했습니다.

현재 No Thanks! 관련 주요 남은 항목:

- `no_thanks_room_actions`, `no_thanks_room_private_state`
  - RLS enabled + policy 없음
  - **의도적인 deny-all direct-table boundary**
- authenticated 대상 `SECURITY DEFINER` public RPC
  - **의도된 API surface**
  - 함수 내부에서 승인회원 / room / turn / version / action id 검증
- 일부 FK covering index / unused index INFO
  - 브라우저 QA를 막는 항목 아님
  - release hardening에서 재검토 가능

No Thanks! 관련 신규 critical/error 수준 Advisor 문제는 확인되지 않았습니다.

## 9. 지금 사용자가 직접 해야 할 수동 QA

현재 main 배포 + 운영 Supabase에서 바로 테스트 가능합니다.

최소 3개 서로 다른 승인회원 계정을 사용합니다.

### 기본 smoke test

- [ ] 방 생성
- [ ] 방 코드 참가
- [ ] 준비 / 준비 취소
- [ ] 방장 게임 시작
- [ ] 거절하기
- [ ] 카드 가져오기
- [ ] 중앙 칩 반영
- [ ] 내 칩 수 반영
- [ ] 다른 플레이어 칩 수가 숫자로 보이지 않는지 확인
- [ ] turn 이동
- [ ] 카드 가져온 플레이어 turn 유지
- [ ] 자연 종료
- [ ] 점수 / 승자 확인
- [ ] 결과방 나가기
- [ ] 새 게임 방 만들기 / 새 코드 참가

### reconnect / Presence

- [ ] active player 브라우저 종료
- [ ] 다른 화면에서 `재접속 대기` 표시
- [ ] turn 자동 이동이 일어나지 않음
- [ ] 같은 계정 재접속 후 기존 turn 복원
- [ ] host 브라우저 종료
- [ ] host 자동 위임 없음
- [ ] 자동 게임 종료 없음
- [ ] host 재접속 후 권한 유지
- [ ] 동일 사용자 2개 탭 → roster에서 사용자 1명으로 취급
- [ ] offline → online 복귀
- [ ] 모바일 background → foreground 복귀

가능하면 마지막에 7인 실제 브라우저/프로필 조합도 확인합니다.

전체 체크리스트 기준은 `RELEASE_CHECKLIST.md`입니다.

## 10. 수동 QA 후 다음 단계

수동 QA에서 문제가 발견되면:

1. 새 채팅에서 최신 `main` 확인
2. 별도 bugfix 브랜치 생성
3. 재현 조건 기록
4. 최소 수정
5. 관련 regression test 추가
6. CI 확인
7. PR 생성
8. 사용자 승인 후 main 병합
9. 다시 수동 QA

수동 QA가 전부 통과하면:

1. `RELEASE_CHECKLIST.md` manual browser gate 완료 기록
2. 필요 시 운영 DB 최종 smoke test
3. Registry capability 활성화
   - `online`
   - 검증 완료 시 `presence`
4. 게임 목록에 No Thanks! 정식 노출
5. invite는 별도 구현/검증 전까지 비활성
6. 출시 후 첫 실제 세션 오류/로그 점검
7. Game Platform 회고 및 반복된 game-independent 책임의 shared 승격 여부 검토

## 11. 주요 병합 PR 이력

- #347 — pure rules engine / Registry 재개
- #353 — Room/Lobby DB + RPC foundation
- #354 — Room/Lobby runtime UI
- #356 — server-authoritative gameplay actions
- #358 — multiplayer reconnect / Presence / rematch stability
- #359 — 3인·7인 multi-client integration verification
- #360 — production DB readiness / Realtime publication / private helper permission hardening

위 PR들은 모두 main에 병합되었습니다.

## 12. 새 채팅에서 시작할 때 권장 첫 요청

다음과 같이 시작하면 현재 단계에서 바로 이어갈 수 있습니다.

`No Thanks! 수동 브라우저 QA 결과를 바탕으로 다음 작업을 진행하자. 먼저 최신 main과 games/no-thanks/HANDOFF.md, RELEASE_CHECKLIST.md를 확인하고 별도 작업 브랜치에서 시작해줘.`
