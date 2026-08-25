# Liar Game Production Deployment Checklist

이 문서는 Liar Game / Drawing Spy의 현재 운영 기준 배포 순서와 회귀 테스트를 정리한다.

## A. 기존 운영 DB 업데이트

현재 운영 DB에는 2026-08-26 Drawing Spy Phase 1까지 적용되어 있다. 다른 환경을 같은 버전으로 올릴 때는 미적용 항목만 순서대로 실행한다.

1. [ ] 운영 DB 백업 또는 복구 지점 확보
2. [ ] `supabase/liar-game/functions-result.sql` — 검거 실패 5초 지연 공개 + Result projection
3. [ ] `supabase/liar-game/migrations/20260824_refresh_word_pool.sql` — 12카테고리 + word pool 확장
4. [ ] `supabase/liar-game/migrations/20260825_runoff_tied_speakers.sql` — 기본 라이어게임 동률 후보 추가 발언
5. [ ] `supabase/liar-game/migrations/20260825_drawing_spy_mode.sql` — Drawing Spy 기본 모드/공동 그림판
6. [ ] `supabase/liar-game/migrations/20260825_drawing_unlimited_strokes.sql` — 획 수 무제한
7. [ ] `supabase/liar-game/migrations/20260826_drawing_spy_phase1.sql` — 재투표 추가 그림, stage-aware strokes, 다음 라운드 그림 설정
8. [ ] `supabase/liar-game/functions-runtime-overrides.sql` — 최신 runtime 함수 정의 최종 확정
9. [ ] `supabase/liar-game/rls.sql` — 최신 RPC 권한/테이블 접근 경계 재적용
10. [ ] 필요 시 `supabase/liar-game/realtime.sql` — private room state + discussion chat 정책

`schema.sql`, `functions-core.sql`, `functions-vote.sql`은 기존 운영 DB 업데이트용으로 재실행하지 않는다. 과거 base 함수와 현재 migration 함수가 함께 존재하기 때문에 maintenance 후에는 항상 `functions-runtime-overrides.sql` → `rls.sql` 순서로 최종 정의를 확정한다.

## B. 빈 Supabase fresh install

1. [ ] `supabase/liar-game/schema.sql`
2. [ ] `supabase/liar-game/seed.sql`
3. [ ] `supabase/liar-game/functions-core.sql`
4. [ ] `supabase/liar-game/functions-vote.sql`
5. [ ] `supabase/liar-game/migrations/20260825_runoff_tied_speakers.sql`
6. [ ] `supabase/liar-game/functions-guess.sql`
7. [ ] `supabase/liar-game/functions-result.sql`
8. [ ] `supabase/liar-game/migrations/20260824_refresh_word_pool.sql`
9. [ ] `supabase/liar-game/migrations/20260825_drawing_spy_mode.sql`
10. [ ] `supabase/liar-game/migrations/20260825_drawing_unlimited_strokes.sql`
11. [ ] `supabase/liar-game/migrations/20260826_drawing_spy_phase1.sql`
12. [ ] `supabase/liar-game/functions-runtime-overrides.sql`
13. [ ] `supabase/liar-game/rls.sql`
14. [ ] `supabase/liar-game/realtime.sql`

`functions-runtime-overrides.sql`은 base SQL과 migration이 모두 끝난 뒤 실행한다. 이 파일은 12카테고리 validator, Drawing Spy start/snapshot, 기본 라이어게임 동률 후보 speaking 로직 등 현재 runtime 기준을 마지막으로 다시 확정한다.

## C. 공통 release gate

- [ ] Production Supabase URL / publishable key 확인
- [ ] GitHub Pages asset 404 없음
- [ ] `/liar-game/` 직접 접근 성공
- [ ] 기존 로그인 세션 공유 / 비로그인 접근 차단
- [ ] private room Realtime subscribe/reconnect 성공
- [ ] authenticated business RPC 성공
- [ ] anon business RPC 및 base-table 직접 접근 거부
- [ ] 최소 4명 ready / 최소 시민 2명 정책 유지
- [ ] 12카테고리만 설정 가능
- [ ] 기본 라이어게임 ROLE_REVEAL → SPEAKING → DISCUSSION → VOTE 정상
- [ ] 검거 성공 → 공개 → 제시어 추측 정상
- [ ] 검거 실패 → 일회성 5초 countdown → 실제 라이어/스파이 공개 정상
- [ ] 승리/패배 시각·음향 효과 정상
- [ ] spectator / leave guard / force end / stale-version recovery 정상

## D. Drawing Spy 기본 흐름

- [ ] `기본 라이어게임 / 그림 스파이` 전환 가능
- [ ] 그림 시간 5~60초
- [ ] 제한 획 1~10
- [ ] 획 수 무제한 ON/OFF
- [ ] 역할 확인 후 방장 `그림 시작`
- [ ] 현재 차례만 canvas 입력 가능
- [ ] pointer down → move → up = 1획
- [ ] 제한 모드 최대 획 도달 시 자동 NEXT
- [ ] 무제한 모드는 시간 종료/완료 버튼으로 NEXT
- [ ] 마지막 사람 종료 → DISCUSSION
- [ ] DISCUSSION / VOTING에서 완성 그림 유지
- [ ] reload/reconnect 후 stroke history 복구
- [ ] 모바일 drawing 전용 wide layout 정상

## E. Drawing Spy Phase 1 release gate

### E-1. 동률 후보 추가 그림

- [ ] Drawing Spy에서 cutoff 동률 발생
- [ ] 결과 화면에 `추가 그림 후 재투표` / `바로 재투표` 표시
- [ ] `추가 그림 후 재투표` 선택 시 status=`DRAWING`
- [ ] **동률 boundary 후보만** 그림 순서에 표시
- [ ] 후보 상대 순서는 기존 `turn_order` 유지
- [ ] 추가 그림은 원래 설정과 무관하게 **1인 10초 · 1획**
- [ ] 비동률 참가자는 canvas readonly
- [ ] 마지막 동률 후보의 1획/완료/시간종료 후 **DISCUSSION 없이 RUNOFF_VOTING**
- [ ] 재투표가 다시 동률이면 새 후보 subset으로 동일 흐름 반복
- [ ] 동일 참가자가 여러 runoff stage에 다시 포함되어도 새 획 저장 가능
- [ ] `liar_drawing_strokes.drawing_stage_no`로 최초 그림/추가 그림이 분리됨
- [ ] 기본 라이어게임의 `동률 후보 추가 발언`은 기존대로 유지

### E-2. 라운드별 그림 난이도

- [ ] 라운드 결과 후 `다음 라운드 준비` 이동
- [ ] Drawing Spy 방장에게 `다음 라운드 그림 난이도` 폼 표시
- [ ] 그림 시간 / 최대 획 / 무제한만 수정 가능
- [ ] 카테고리 / 스파이 수 / 추측 횟수 등 Game 핵심 설정은 잠금 유지
- [ ] 저장 즉시 모든 클라이언트에 최신 값 표시
- [ ] 다음 라운드 시작 시 변경값이 round snapshot으로 고정
- [ ] 이미 끝난 이전 라운드의 그림 규칙/그림 데이터는 변하지 않음

### E-3. 추측 / 결과 / 리플레이

- [ ] 스파이 검거 성공 후 마지막 제시어 추측 화면에 **최종 공동 그림** 표시
- [ ] 시민 화면에서도 같은 최종 그림 표시
- [ ] 최종 결과 화면에 공동 그림 표시
- [ ] `그림 과정 다시 보기` 버튼 표시
- [ ] replay가 최초 그림 → runoff 추가 그림 stage 순으로 재생
- [ ] 각 획마다 해당 참가자 nickname 표시
- [ ] 진행 획 수 표시
- [ ] `다시 재생` / `처음부터` 정상
- [ ] `prefers-reduced-motion` 환경에서도 기능은 유지하되 빠르게 표시

## F. DB introspection gate

- [ ] `liar_drawing_strokes.drawing_stage_no` 존재
- [ ] unique key가 `(round_id,drawing_stage_no,round_player_id,stroke_no)` 포함
- [ ] `liar_start_runoff_speaking`이 Drawing Spy에서는 DRAWING, classic에서는 SPEAKING
- [ ] Drawing Spy runoff submit/advance 최종 상태가 RUNOFF_VOTING
- [ ] snapshot에 `drawing_stage_no`, `candidate_round_player_ids`, 모든 stage stroke 포함
- [ ] `liar_update_next_round_drawing_settings` authenticated EXECUTE 허용
- [ ] 위 RPC anon EXECUTE 거부
- [ ] `liar_validate_settings`에 `게임`, `영화드라마` 없음

## G. 다음 개발 단계 (아직 미적용)

Phase 2 후보는 차례 시작 3-2-1, 효과음/진동, 모바일 sticky turn HUD, 그리는 중인 선 Realtime Broadcast, DB 저장 지연과 canvas 입력 분리다. 이 항목들은 Phase 1 실사용 검증 후 진행한다.
