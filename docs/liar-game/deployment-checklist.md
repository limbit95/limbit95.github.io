# Liar Game Production Deployment Checklist

이 문서는 소스 배포와 Supabase SQL 적용을 운영자가 직접 수행할 때 사용하는 체크리스트다. SQL은 대상 프로젝트와 백업을 확인한 뒤 Supabase SQL Editor 또는 승인된 배포 도구에서 실행한다.

## A. 기존 운영 DB 업데이트

현재 운영 DB에 최신 결과 공개 흐름, 제시어 풀, 재투표 발언 규칙을 반영하려면 아래 순서로 실행한다.

1. [ ] 운영 DB 백업 또는 복구 지점 확보
2. [ ] `supabase/liar-game/functions-result.sql` — 검거 실패 5초 지연 자동 공개 RPC + 최신 Result projection
3. [ ] `supabase/liar-game/rls.sql` — 즉시 결과 공개 RPC 차단 + 자동 공개 RPC 권한 반영
4. [ ] `supabase/liar-game/migrations/20260824_refresh_word_pool.sql` — `게임/영화드라마` 비활성화, 현재 설정 정리, 남은 12카테고리 각 20개 추가
5. [ ] `supabase/liar-game/migrations/20260825_runoff_tied_speakers.sql` — 재투표 전 추가 발언 시 동률 후보만 발언하도록 snapshot/NEXT/PREVIOUS/종료 판정 갱신
6. [ ] 자유 토론 채팅용 Realtime 송신 정책을 아직 적용하지 않았다면 `supabase/liar-game/realtime.sql` 실행
7. [ ] `게임`, `영화드라마`가 새 게임 설정 화면에서 보이지 않는지 확인
8. [ ] 각 남은 카테고리에 활성 제시어가 50개씩 존재하는지 확인
9. [ ] 검거 실패 시 5초 이전 자동 공개 RPC가 `RESULT_REVEAL_COUNTDOWN_ACTIVE`로 거부되는지 확인
10. [ ] 동률 후 `발언 후 재투표`를 선택했을 때 동률 후보만 발언 순서에 나타나는지 확인

이번 변경에는 table/column 추가가 없으므로 `schema.sql` 재실행은 필요 없다.

## B. 빈 Supabase fresh install

현재 `schema.sql`에는 `show_category_to_liar`, `liars_revealed_at`, `LIAR_REVEAL`/`FORCE_ENDED` 상태 등 기존 migration 결과가 포함되어 있다. 다만 기본 `seed.sql`은 과거 14카테고리 원본 seed를 보존하므로, 최신 12카테고리 Production 풀을 만들기 위해 word-pool migration을 한 번 적용한다.

다음 순서로 실행한다.

1. [ ] `supabase/liar-game/schema.sql` — extension, tables, constraints, indexes, triggers/helpers
2. [ ] `supabase/liar-game/seed.sql` — base word seed
3. [ ] `supabase/liar-game/functions-core.sql` — room/game/round lifecycle와 snapshot RPC
4. [ ] `supabase/liar-game/functions-vote.sql` — ballot, vote close, runoff RPC
5. [ ] `supabase/liar-game/migrations/20260825_runoff_tied_speakers.sql` — runoff speaking을 동률 후보 subset 기준으로 최종 override
6. [ ] `supabase/liar-game/functions-guess.sql` — shared liar guess RPC
7. [ ] `supabase/liar-game/functions-result.sql` — detailed result + timed failed-capture reveal RPC
8. [ ] `supabase/liar-game/migrations/20260824_refresh_word_pool.sql` — 최종 12카테고리 validation과 확장 word pool 적용
9. [ ] `supabase/liar-game/rls.sql` — base-table 차단과 authenticated RPC 권한
10. [ ] `supabase/liar-game/realtime.sql` — private state invalidation + ephemeral discussion chat authorization
11. [ ] 설치 후 schema/RPC 권한, 12카테고리 word pool, Production start matrix, tied-candidate runoff speaking을 검증

기존 `20260821_*` migration들은 현재 `schema.sql`에 반영된 과거 변경이므로 fresh install에서 중복 적용하지 않는다. `20260824_refresh_word_pool.sql`과 `20260825_runoff_tied_speakers.sql`은 현재 base seed/core를 최신 Production 동작으로 정리하기 위해 위 순서에서 적용한다.

## C. Web deployment and environment

- [ ] Production Supabase URL과 publishable key 설정 확인
- [ ] GitHub Pages 배포 성공 및 asset 404 없음 확인
- [ ] `/liar-game/` 직접 접근 성공
- [ ] 기존 사이트와 로그인 세션 공유 확인
- [ ] 비로그인 직접 접근이 차단되고 로그인 경로로 안내되는지 확인
- [ ] 홈의 `🎭 라이어 게임` 링크가 `./liar-game/`으로 정상 진입하는지 확인
- [ ] Supabase Realtime private channel subscribe/reconnect 성공
- [ ] 자유 토론 채팅 A→B / B→A 송수신 성공 및 DB game table에 채팅 기록이 남지 않는지 확인
- [ ] authenticated business RPC 성공
- [ ] anon business RPC 및 anon/authenticated base-table 접근 거부
- [ ] 360px 모바일 viewport에서 setup, game, countdown, result 전체 확인
- [ ] desktop viewport에서 전체 흐름 확인
- [ ] 최신 Chrome에서 smoke test 완료
- [ ] Safari/iPhone에서 가능한 범위의 smoke test 완료 또는 미확인 사유 기록

## D. Release gate and rollback

- [ ] 검거 성공 → 방장 `라이어 공개` 버튼 → LIAR_GUESS 흐름 확인
- [ ] 검거 실패 → 5초 전체화면 countdown → 실제 라이어 이름 공개 → `결과 화면 보기` 흐름 확인
- [ ] 같은 검거 실패 결과에서 새로고침해도 countdown overlay가 다시 표시되지 않는지 확인
- [ ] overlay 종료 후 실제 라이어 카드가 `공개 대기`가 아니라 실제 닉네임을 표시하는지 확인
- [ ] 승리/패배 시각 효과와 Web Audio 효과가 결과 화면 진입 시 정상 재생되는지 확인
- [ ] 원 투표 동률 → `발언 후 재투표` 선택 → 동률 후보만 1번부터 다시 번호가 매겨져 발언하는지 확인
- [ ] 동률 후보가 아닌 참가자는 `다음 발언자` 권한을 갖지 않는지 확인
- [ ] 마지막 동률 후보 발언 후 방장이 `발언 종료`하면 바로 `RUNOFF_VOTING`으로 이동하는지 확인
- [ ] `final-qa-checklist.md`의 Production, gameplay, recovery, security 항목 결과 기록
- [ ] 배포 commit과 적용한 SQL 파일 checksum/시각 기록
- [ ] 오류 로그와 Realtime 연결 상태 모니터링 담당자 지정
- [ ] 문제 발생 시 이전 정적 commit으로 되돌리고 DB는 백업 또는 검증된 이전 function/migration 상태로 복원할 절차 확인
