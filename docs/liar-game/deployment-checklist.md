# Liar Game Production Deployment Checklist

이 문서는 Liar Game / Drawing Spy **v1.2.0 Production** 기준 배포 순서와 회귀 테스트를 정리한다.

v1.0 canonical 기준은 `docs/liar-game/release-v1.0.0.md`, fresh install canonical 기준은 `supabase/liar-game/canonical/`을 사용하고, v1.1/v1.2는 아래 additive migration을 이어서 적용한다.

## A. 기존 운영 DB 업데이트

기존 운영 DB는 **canonical fresh installer를 다시 실행하지 않는다.** 이미 배포된 DB는 미적용 migration만 순서대로 적용한다.

1. [ ] 운영 DB 백업 또는 복구 지점 확보
2. [ ] `supabase/liar-game/functions-result.sql` — 검거 실패 5초 지연 공개 + Result projection
3. [ ] `supabase/liar-game/migrations/20260824_refresh_word_pool.sql` — 현재 12카테고리 word pool
4. [ ] `supabase/liar-game/migrations/20260825_runoff_tied_speakers.sql` — 기본 라이어게임 동률 후보 추가 발언
5. [ ] `supabase/liar-game/migrations/20260825_drawing_spy_mode.sql` — Drawing Spy 기본 모드/공동 그림판
6. [ ] `supabase/liar-game/migrations/20260825_drawing_unlimited_strokes.sql` — 획 수 무제한
7. [ ] `supabase/liar-game/migrations/20260826_drawing_spy_phase1.sql` — 재투표 추가 그림, stage-aware strokes, 다음 라운드 그림 설정
8. [ ] `supabase/liar-game/functions-runtime-overrides.sql` — 이전 base 함수의 runtime 기준 재확정
9. [ ] `supabase/liar-game/migrations/20260826_drawing_spy_phase2.sql` — 3초 준비 카운트, fluid drawing persistence
10. [ ] `supabase/liar-game/migrations/20260826_gameplay_phase3.sql` — 공통 타이머, alias, 중복 방지, 역할 균형, 투표 상세 지연 공개
11. [ ] `supabase/liar-game/migrations/20260826_phase3_guess_normalize_fix.sql` — 공백/영문 대소문자 정규화 보강
12. [ ] `supabase/liar-game/migrations/20260826_phase3_polish.sql` — 자유토론 종료 후 Realtime 채팅 송신 차단
13. [ ] `supabase/liar-game/migrations/20260826_gameplay_phase4_stats.sql` — Game 스코어/누적 재미 통계 RPC
14. [ ] `supabase/liar-game/rls.sql` — 최신 RPC 권한/테이블 접근 경계
15. [ ] `supabase/liar-game/realtime.sql` — private room/chat/drawing Broadcast 정책
16. [ ] `supabase/liar-game/migrations/20260826_final_production_cleanup.sql` — 구형 settings v1/v2/v3 RPC client 권한 차단
17. [ ] `supabase/liar-game/migrations/20260827_custom_word_packs.sql` — v1.1 커스텀 제시어 팩 + settings v5
18. [ ] `supabase/liar-game/migrations/20260828_01_hint_coins_v12.sql` — v1.2 힌트 코인/상점 기반
19. [ ] `supabase/liar-game/migrations/20260828_02_role_randomization_and_cumulative_suspicion.sql` — 가중 역할 선정 + 누적 의심 통계
20. [ ] `supabase/liar-game/migrations/20260828_03_start_with_settings.sql` — 설정 적용 + 라운드 시작 원자 처리
21. [ ] `supabase/liar-game/migrations/20260828_04_result_stats_and_player_order.sql` — 참가 순서/결과 재미 통계 최종화
22. [ ] `supabase/liar-game/migrations/20260828_05_guess_gate_and_drawing_misses.sql` — 검거 성공 후 추측 잠금 + 0획 timeout 기록
23. [ ] `supabase/liar-game/migrations/20260828_06_drawing_miss_fk_indexes.sql` — drawing miss FK 인덱스
24. [ ] `supabase/liar-game/migrations/20260828_07_hint_reward_cap_fix.sql` — 99P 상한 실제 적립량 결과 반영

`schema.sql`, `functions-core.sql`, `functions-vote.sql`은 기존 운영 DB에 다시 실행하지 않는다. `functions-runtime-overrides.sql` 역시 운영 중 임의 재실행하지 않는다. 부득이하게 재적용할 경우 **그 뒤의 Phase 2 → Phase 3 → normalize fix → phase3 polish → Phase 4 → 최신 RLS/Realtime → final cleanup → v1.1 → v1.2 순서를 다시 보장**해야 한다.

> 운영 DB에는 v1.1/v1.2가 `liar_hint_coins_v12`, `liar_v12_start_with_settings` 같은 과거 migration 이름으로 이미 적용되어 있을 수 있다. **파일명이 다르다는 이유만으로 20260828 migration을 무조건 재실행하지 말고**, `supabase_migrations.schema_migrations`와 실제 함수/테이블/트리거 상태를 먼저 확인한다. 20260828_01~07은 저장소에서 v1.2 배포 순서를 재현하기 위한 정식 경로다.

## B. 빈 Supabase fresh install — v1.2.0 권장 경로

v1.0 canonical installer로 기반을 만든 뒤 v1.1/v1.2 additive migration을 순서대로 적용한다.

1. [ ] 저장소 루트에서 canonical source 고정 상태 확인

```bash
node scripts/build-liar-canonical.mjs --check
```

2. [ ] 단일 v1.0 installer 생성

```bash
node scripts/build-liar-canonical.mjs
```

생성 파일:

```text
supabase/liar-game/canonical/liar-game-v1.0.0-install.sql
```

3. [ ] **빈 Supabase 프로젝트**에 생성된 v1.0 installer를 한 번 실행
4. [ ] 설치 직후 `supabase/liar-game/canonical/verify-v1.0.0.sql` 실행
5. [ ] 결과 JSON의 최상위 `pass`가 `true`인지 확인
6. [ ] `supabase/liar-game/migrations/20260827_custom_word_packs.sql` 적용
7. [ ] `supabase/liar-game/migrations/20260828_01_hint_coins_v12.sql` 적용
8. [ ] `supabase/liar-game/migrations/20260828_02_role_randomization_and_cumulative_suspicion.sql` 적용
9. [ ] `supabase/liar-game/migrations/20260828_03_start_with_settings.sql` 적용
10. [ ] `supabase/liar-game/migrations/20260828_04_result_stats_and_player_order.sql` 적용
11. [ ] `supabase/liar-game/migrations/20260828_05_guess_gate_and_drawing_misses.sql` 적용
12. [ ] `supabase/liar-game/migrations/20260828_06_drawing_miss_fk_indexes.sql` 적용
13. [ ] `supabase/liar-game/migrations/20260828_07_hint_reward_cap_fix.sql` 적용
14. [ ] Section C 이하의 release gate / 실제 플레이 테스트 수행

> canonical installer는 v1.0 fresh base 전용이다. 기존 운영 DB에는 실행하지 않는다.

### B-1. Canonical installer 구성 원본

`supabase/liar-game/canonical/v1.0.0.manifest.json`이 v1.0 파일 순서와 Git blob SHA를 고정한다. CI에서도 manifest hash 검사를 수행하므로 v1.0 기준 SQL이 조용히 변경되는 것을 막는다. v1.1/v1.2는 위 additive migration 순서를 별도로 따른다.

### B-2. 수동 분해 설치 순서 — 디버깅/복구 참고용

canonical builder를 사용할 수 없는 환경에서만 아래 순서를 사용한다.

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
14. [ ] `supabase/liar-game/migrations/20260826_gameplay_phase3.sql`
15. [ ] `supabase/liar-game/migrations/20260826_phase3_guess_normalize_fix.sql`
16. [ ] `supabase/liar-game/migrations/20260826_phase3_polish.sql`
17. [ ] `supabase/liar-game/migrations/20260826_gameplay_phase4_stats.sql`
18. [ ] `supabase/liar-game/rls.sql`
19. [ ] `supabase/liar-game/realtime.sql`
20. [ ] `supabase/liar-game/migrations/20260826_final_production_cleanup.sql`
21. [ ] `supabase/liar-game/migrations/20260827_custom_word_packs.sql`
22. [ ] `supabase/liar-game/migrations/20260828_01_hint_coins_v12.sql`
23. [ ] `supabase/liar-game/migrations/20260828_02_role_randomization_and_cumulative_suspicion.sql`
24. [ ] `supabase/liar-game/migrations/20260828_03_start_with_settings.sql`
25. [ ] `supabase/liar-game/migrations/20260828_04_result_stats_and_player_order.sql`
26. [ ] `supabase/liar-game/migrations/20260828_05_guess_gate_and_drawing_misses.sql`
27. [ ] `supabase/liar-game/migrations/20260828_06_drawing_miss_fk_indexes.sql`
28. [ ] `supabase/liar-game/migrations/20260828_07_hint_reward_cap_fix.sql`

> `20260825_temp_two_player_test.sql`과 `20260825_z_restore_production_player_minimum.sql`은 과거 테스트 이력용이다. fresh install에는 포함하지 않는다.

## C. 공통 release gate

- [ ] Production Supabase URL / publishable key 확인
- [ ] GitHub Pages asset 404 없음
- [ ] `/liar-game/` 직접 접근 성공
- [ ] 기존 로그인 세션 공유 / 비로그인 접근 차단
- [ ] Liar Game JS syntax + ES module link CI PASS
- [ ] canonical SQL manifest CI PASS
- [ ] private room Realtime subscribe/reconnect 성공
- [ ] authenticated business RPC 성공
- [ ] anon business RPC 및 base-table 직접 접근 거부
- [ ] 최소 4명 ready / 최소 시민 2명 정책 유지
- [ ] UI/runtime 설정은 현재 12카테고리만 허용
- [ ] 기본 라이어게임 ROLE_REVEAL → SPEAKING → DISCUSSION → VOTE 정상
- [ ] 그림 스파이 ROLE_REVEAL → DRAWING → DISCUSSION → VOTE 정상
- [ ] 검거 성공 → 공개 → 제시어 추측 정상
- [ ] 검거 실패 → 일회성 5초 countdown → 실제 라이어/스파이 공개 정상
- [ ] spectator / leave guard / force end / stale-version recovery 정상

## D. Drawing Spy 기본 흐름

- [ ] `기본 라이어게임 / 그림 스파이` 전환 가능
- [ ] 그림 시간 5~60초
- [ ] 제한 획 1~10 / 획 수 무제한 ON/OFF
- [ ] 역할 확인 후 방장 `그림 시작`
- [ ] 그림 차례 트랙에서 현재/다음/전체 순서 식별 가능
- [ ] 현재 차례만 canvas 입력 가능
- [ ] pointer down → move → up = 1획
- [ ] 제한 모드 최대 획 도달 시 자동 NEXT
- [ ] 무제한 모드는 시간 종료/완료 버튼으로 NEXT
- [ ] 마지막 사람 종료 → DISCUSSION
- [ ] DISCUSSION / VOTING에서 완성 그림 유지
- [ ] reload/reconnect 후 완료된 stroke history 복구
- [ ] 모바일 drawing 전용 wide layout + sticky HUD 정상

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

### F-2. Fluid drawing / Realtime

- [ ] 한 획 RPC 저장 중에도 다음 획을 로컬 Canvas에 바로 그릴 수 있음
- [ ] 획 저장은 클라이언트에서 순차 queue 처리
- [ ] 제한 획 수는 DB 응답 대기 중에도 로컬에서 초과 입력 방지
- [ ] 일반 획 저장은 round/room version을 올리지 않음
- [ ] 최대 획 도달 / 수동 완료 / 시간 종료 때 authoritative state 전환
- [ ] 다른 기기에서 선이 그려지는 동안 live Broadcast로 표시
- [ ] 완료된 획만 `liar_drawing_strokes`에 영구 저장
- [ ] current drawer + DRAWING + active time window만 live send 허용

## G. Gameplay Phase 3 release gate

### G-1. 게임 템포 / 채팅

- [ ] 기본 라이어 발언 시간 `무제한 / 15 / 30 / 45 / 60초`
- [ ] 자유토론 `무제한 / 60 / 90 / 120 / 180초`
- [ ] 발언 NEXT/PREVIOUS/RESTART 시 서버 기준 시간이 새로 시작
- [ ] 제한 발언 시간이 끝나면 다음 사람으로 진행
- [ ] 자유토론 종료 후 자동 투표하지 않음
- [ ] 자유토론 종료 즉시 textarea/전송 버튼 잠김
- [ ] 자유토론 종료 후 Realtime RLS도 chat Broadcast INSERT 거부
- [ ] 무제한 자유토론은 투표 시작 전까지 채팅 가능

### G-2. 투표 심리전

- [ ] VOTE_RESULT에서는 득표수 / 동률 후보만 공개
- [ ] voter → target 개인별 상세는 live vote snapshot에서 null
- [ ] 재투표 전 개발자 도구에서도 개인별 ballot detail 확인 불가
- [ ] 최종 ROUND_RESULT에서 모든 단계 개인별 상세 공개

### G-3. 제시어 / 추측

- [ ] 같은 Game에서는 미사용 eligible word 우선
- [ ] eligible word를 모두 소진한 뒤에만 재사용
- [ ] 영문 대소문자 및 공백 무시 (`PC 방` = `pc방`)
- [ ] alias 정답 허용 (`PC방` → `피시방/피씨방` 등)
- [ ] 현재 활성 word pool은 12카테고리 × 50 = 600개

### G-4. 연속 라운드 역할 / 다중 라이어

- [ ] 같은 Game에서 직전 3개 정상 종료 라운드에 모두 참여해 3회 연속 라이어/스파이였던 참가자만 다음 라운드 가중치 0.35
- [ ] 그 외 참가자는 가중치 1.0이며, 페널티 참가자도 제외되지 않아 다시 선정될 수 있음
- [ ] 설정된 라이어/스파이 수만큼 중복 없이 정확히 선정
- [ ] `서로 정체 알기` OFF 시 teammate 정보 없음
- [ ] ON + 라이어/스파이 2명 이상이면 역할 확인/재확인에 teammate nickname 표시
- [ ] 시민에게 teammate 정보 노출 없음

## H. Gameplay Phase 4 / v1.2 stats release gate

- [ ] 결과 화면에 현재 Game `시민 : 라이어/스파이` 누적 스코어 표시
- [ ] 다음 라운드 준비에서도 동일 Game 누적 스코어 유지
- [ ] 완료된 라운드만 스코어/라운드 기록에 포함
- [ ] 가장 많이 의심받은 참가자 = 각 정상 종료 라운드의 closed vote stage 합계 → 같은 game_id 전체 누적
- [ ] 라이어 헌터/단골 등 v1.2 재미 통계가 정상 종료 라운드 기준으로 집계
- [ ] 5초 신원 공개 전 현재 라운드 통계로 정체가 새지 않음
- [ ] `새 게임 · 설정 변경` 후 새로운 `game_id`에서 통계 0부터 시작
- [ ] 모바일에서 재미 통계 카드가 1열로 읽기 좋게 표시

## I. v1.2 힌트 / 추측 / 설정 release gate

- [ ] 같은 game_id에서 라이어/스파이 패배 시 실제 적립 가능 잔액만큼 최대 +1P
- [ ] 99P 보유 상태에서는 보상 이벤트 delta=0, 결과 화면도 +1P를 잘못 표시하지 않음
- [ ] 라운드 시작 시 3P 이상 보유한 라이어/스파이는 카테고리 강제 비공개
- [ ] 힌트 가격 `글자 수 1P / 카테고리 2P / 첫 글자 3P`
- [ ] 같은 라운드 동일 힌트 중복 구매 차단
- [ ] 힌트 구매 RPC 성공 후 후속 role refresh 실패가 구매 실패로 표시되지 않음
- [ ] 설정 변경 중 서버 저장 요청 없음; `게임 시작` 시 draft 전체를 원자적으로 적용
- [ ] 시작 실패 시 설정/room version/current_round_id 모두 rollback
- [ ] 검거 성공 후 모든 참가자가 같은 공개 화면을 본 뒤 8초 후 추측 가능
- [ ] 그림 시간이 끝날 때 0획이면 drawing miss를 중복 없이 1회 기록

## J. DB / Security introspection gate

- [ ] 모든 `liar_*` base table RLS enabled
- [ ] authenticated / anon의 base table SELECT/INSERT/UPDATE/DELETE 직접 권한 없음
- [ ] business RPC는 authenticated만 실행 가능, anon 거부
- [ ] room/vote legacy base snapshot helper 직접 EXECUTE 거부
- [ ] `liar_update_game_settings` v1/v2/v3/v4 authenticated EXECUTE 거부
- [ ] `liar_update_game_settings_v5` 및 `liar_start_round_with_settings_v12`만 현재 설정 경로로 사용
- [ ] `liar_drawing_strokes.drawing_stage_no` 존재 및 stage-aware unique key 유지
- [ ] `liar_drawing_misses` RLS + 직접 CRUD 차단 + FK 인덱스 유지
- [ ] Drawing live send helper가 current drawer + DRAWING + active time window 검증
- [ ] `liar_get_vote_snapshot`이 중간 ballot detail을 숨김
- [ ] `liar_get_round_result_v12` 최종 vote history/힌트 reward projection 유지
- [ ] `liar_normalize_guess_text(' PC 방 ') = 'pc방'`
- [ ] Realtime SELECT/INSERT policy는 private room/chat/drawing helper를 통해서만 허용

### 역사 데이터 호환성 주의

DB의 `liar_words.category`, `liar_games.selected_categories`, `liar_rounds.category_snapshot` CHECK constraint에는 과거 `게임`, `영화드라마`가 역사 데이터 호환을 위해 남아 있을 수 있다. 해당 word들은 **enabled=false**이며 현재 UI와 `liar_validate_settings`는 12카테고리만 허용한다. 과거 기록을 파괴하지 않기 위해 production cleanup에서 이 historical constraint를 억지로 축소하지 않는다.

## K. Final Playtest

Static/DB QA가 모두 통과한 뒤 실제 4명 이상, 가능하면 2개 이상의 물리 기기에서 최종 회귀 테스트한다.

- [ ] 기본 라이어게임 1라운드 전체 진행
- [ ] 그림 스파이 1라운드 전체 진행
- [ ] 기본 라이어게임 동률 → 추가 발언 → 재투표
- [ ] 그림 스파이 동률 → 10초/1획 추가 그림 → 재투표
- [ ] 자유토론 시간 종료 → 채팅 잠금 → 방장 투표 시작
- [ ] 다중 라이어 teammate ON/OFF
- [ ] 결과 5초 공개 연출 및 제시어 추측
- [ ] v1.2 스코어/재미 통계 누적
- [ ] 힌트 구매 후 역할 재확인/다음 상태 동기화
- [ ] 다음 라운드 준비 후 통계·같은 game_id 힌트 코인 유지
- [ ] 새 Game 시작 후 통계·힌트 코인 초기화
- [ ] 그림 실시간 선 공유 + refresh/reconnect 후 완료 획 복원
- [ ] 모바일 그림 순서 트랙/current-next 강조 확인
- [ ] 네트워크 재연결/백그라운드 복귀 시 최신 snapshot 회복
