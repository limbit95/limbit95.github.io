# Liar Game Production Deployment Checklist

이 문서는 Liar Game / Drawing Spy의 현재 운영 기준 배포 순서와 회귀 테스트를 정리한다.

## A. 기존 운영 DB 업데이트

현재 운영 DB에는 2026-08-26 Drawing Spy Phase 2까지 적용되어 있다. 다른 환경을 같은 버전으로 올릴 때는 미적용 항목만 순서대로 실행한다.

1. [ ] 운영 DB 백업 또는 복구 지점 확보
2. [ ] `supabase/liar-game/functions-result.sql` — 검거 실패 5초 지연 공개 + Result projection
3. [ ] `supabase/liar-game/migrations/20260824_refresh_word_pool.sql` — 12카테고리 + word pool 확장
4. [ ] `supabase/liar-game/migrations/20260825_runoff_tied_speakers.sql` — 기본 라이어게임 동률 후보 추가 발언
5. [ ] `supabase/liar-game/migrations/20260825_drawing_spy_mode.sql` — Drawing Spy 기본 모드/공동 그림판
6. [ ] `supabase/liar-game/migrations/20260825_drawing_unlimited_strokes.sql` — 획 수 무제한
7. [ ] `supabase/liar-game/migrations/20260826_drawing_spy_phase1.sql` — 재투표 추가 그림, stage-aware strokes, 다음 라운드 그림 설정
8. [ ] `supabase/liar-game/functions-runtime-overrides.sql` — 기존 base/migration 중복 함수의 runtime 기준 재확정
9. [ ] `supabase/liar-game/migrations/20260826_drawing_spy_phase2.sql` — 3초 준비 카운트, 획 저장/Canvas 입력 분리
10. [ ] `supabase/liar-game/rls.sql` — 최신 RPC 권한/테이블 접근 경계 재적용
11. [ ] `supabase/liar-game/realtime.sql` — private room/chat + Drawing live stroke Broadcast 정책

`schema.sql`, `functions-core.sql`, `functions-vote.sql`은 기존 운영 DB 업데이트용으로 재실행하지 않는다. 현재 Phase 2 migration이 Drawing 함수의 최종 정의이므로 `functions-runtime-overrides.sql`을 다시 실행해야 할 일이 생기면 **반드시 그 뒤에 `20260826_drawing_spy_phase2.sql`을 다시 적용**한다.

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
13. [ ] `supabase/liar-game/migrations/20260826_drawing_spy_phase2.sql`
14. [ ] `supabase/liar-game/rls.sql`
15. [ ] `supabase/liar-game/realtime.sql`

## C. 공통 release gate

- [ ] Production Supabase URL / publishable key 확인
- [ ] GitHub Pages asset 404 없음
- [ ] `/liar-game/` 직접 접근 성공
- [ ] 기존 로그인 세션 공유 / 비로그인 접근 차단
- [ ] Liar Game JS syntax + ES module link CI PASS
- [ ] private room Realtime subscribe/reconnect 성공
- [ ] authenticated business RPC 성공
- [ ] anon business RPC 및 base-table 직접 접근 거부
- [ ] 최소 4명 ready / 최소 시민 2명 정책 유지
- [ ] 12카테고리만 설정 가능
- [ ] 기본 라이어게임 ROLE_REVEAL → SPEAKING → DISCUSSION → VOTE 정상
- [ ] 검거 성공 → 공개 → 제시어 추측 정상
- [ ] 검거 실패 → 일회성 5초 countdown → 실제 라이어/스파이 공개 정상
- [ ] spectator / leave guard / force end / stale-version recovery 정상

## D. Drawing Spy 기본 흐름

- [ ] `기본 라이어게임 / 그림 스파이` 전환 가능
- [ ] 그림 시간 5~60초
- [ ] 제한 획 1~10 / 획 수 무제한 ON/OFF
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
- [ ] `추가 그림 후 재투표` 선택 시 동률 boundary 후보만 DRAWING
- [ ] 후보 상대 순서는 기존 `turn_order` 유지
- [ ] 추가 그림은 원래 설정과 무관하게 **1인 10초 · 1획**
- [ ] 마지막 후보 종료 후 DISCUSSION 없이 RUNOFF_VOTING
- [ ] 재투표가 다시 동률이면 새 후보 subset으로 동일 흐름 반복
- [ ] 동일 참가자가 여러 runoff stage에 포함되어도 stage별 획 저장 가능
- [ ] 기본 라이어게임의 동률 후보 추가 발언은 기존대로 유지

### E-2. 라운드별 그림 난이도

- [ ] 다음 라운드 준비에서 방장만 그림 시간 / 최대 획 / 무제한 수정 가능
- [ ] Game 핵심 설정은 잠금 유지
- [ ] 다음 라운드 시작 시 변경값이 round snapshot으로 고정

### E-3. 추측 / 결과 / 리플레이

- [ ] 마지막 제시어 추측 화면에 최종 공동 그림 표시
- [ ] 최종 결과 화면에 공동 그림 표시
- [ ] `그림 과정 다시 보기` 정상
- [ ] 최초 그림 → runoff 추가 그림 순으로 재생
- [ ] 참가자 nickname / 진행 획 수 표시
- [ ] reduced-motion 환경에서도 기능 유지

## F. Drawing Spy Phase 2 release gate

### F-1. 서버 동기화 카운트다운

- [ ] 모든 최초/다음/재투표 그림 차례가 **3 → 2 → 1 → DRAW!** 후 시작
- [ ] 카운트다운 3초는 실제 그림 제한시간에서 차감되지 않음
- [ ] 카운트다운 중 Canvas 입력 차단
- [ ] 서버 RPC도 `drawing_turn_started_at` 이전 획 저장 거부
- [ ] 현재 그림 차례 사용자에게 tick 효과음 / DRAW 효과음 시도
- [ ] 지원 기기에서는 DRAW 시 진동
- [ ] 본인 차례 진입 시 그림판 위치로 자동 이동

### F-2. 모바일 진행 HUD

- [ ] 720px 이하에서 sticky HUD 표시
- [ ] 현재 그림 사용자 / 남은 시간 / 획 수가 스크롤 중에도 확인 가능
- [ ] 데스크톱에서는 기존 상단 badge UI 유지

### F-3. Fluid drawing persistence

- [ ] 한 획 RPC 저장 중에도 다음 획을 로컬 Canvas에 바로 그릴 수 있음
- [ ] 획 저장은 클라이언트에서 순차 queue 처리
- [ ] 제한 획 수는 DB 응답 대기 중에도 로컬에서 초과 입력 방지
- [ ] 일반 획 저장은 round/room version을 올리지 않아 Canvas 전체 re-render가 발생하지 않음
- [ ] 최대 획 도달 / 수동 완료 / 시간 종료 때만 authoritative state version 갱신
- [ ] reload/reconnect 시 DB에 저장된 모든 완료 획 복구

### F-4. Live stroke Broadcast

- [ ] 다른 기기에서 손가락/마우스가 움직이는 동안 선이 실시간으로 보임
- [ ] Broadcast payload는 DB에 저장하지 않음
- [ ] 완료된 획은 기존 `liar_drawing_strokes`에 영구 저장
- [ ] `liar-drawing:<room_id>` private topic 사용
- [ ] active room member만 receive 가능
- [ ] **현재 DRAWING 차례 사용자만 send 가능**
- [ ] 3초 준비 전 / 제한시간 종료 후 send 정책 거부
- [ ] runoff에서는 현재 동률 후보 차례만 send 가능

## G. DB introspection gate

- [ ] `liar_drawing_strokes.drawing_stage_no` 존재
- [ ] unique key가 `(round_id,drawing_stage_no,round_player_id,stroke_no)` 포함
- [ ] start / runoff / next drawing turn이 `now() + interval '3 seconds'`
- [ ] `liar_submit_drawing_stroke` non-finishing path에 round version update 없음
- [ ] non-finishing path room update는 activity/expiry만 갱신하고 version 유지
- [ ] Drawing live send helper가 current drawer + DRAWING + active time window 검증
- [ ] authenticated Drawing RPC/Realtime helper EXECUTE 허용
- [ ] anon Drawing RPC/Realtime helper EXECUTE 거부

## H. 다음 개발 단계

Phase 3는 기본 라이어게임과 공통 게임성을 다듬는다. 우선 후보는 투표 상세 공개 시점, 발언/자유토론 타이머, 제시어 alias, Game 내 제시어 중복 방지, 역할 균형 랜덤이다.
