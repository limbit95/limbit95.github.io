# Liar Game Production Deployment Checklist

이 문서는 소스 배포와 Supabase SQL 적용을 운영자가 직접 수행할 때 사용하는 체크리스트다. SQL은 대상 프로젝트와 백업을 확인한 뒤 Supabase SQL Editor 또는 승인된 배포 도구에서 실행한다.

## A. 기존 운영 DB 업데이트

이번 Production transition에서 변경된 DB 동작은 최소 준비 완료 인원을 3명에서 4명으로 변경한 `liar_start_round`뿐이다.

1. [ ] 운영 DB 백업 또는 복구 지점 확보
2. [ ] `supabase/liar-game/functions-core.sql` 전체를 다시 실행해 core function 정의 갱신
3. [ ] `liar_start_round`가 ready 3을 `NOT_ENOUGH_READY_PLAYERS`로 거부하는지 확인
4. [ ] ready 4 / liar 3을 `INVALID_LIAR_COUNT`로 거부하고 ready 5 / liar 3은 허용하는지 확인

이번 전환에는 signature, RLS, schema, Realtime 변경이 없다. 따라서 `schema.sql`, `rls.sql`, `realtime.sql`, migration 및 다른 functions 파일을 재실행하지 않는다.

## B. 빈 Supabase fresh install

현재 `schema.sql`에는 14개 category constraints, `show_category_to_liar`, `liars_revealed_at`, `LIAR_REVEAL`/`FORCE_ENDED` 상태 등 `migrations/`의 결과가 이미 포함되어 있다. 빈 DB에서는 migration을 별도로 중복 실행하지 않는다.

다음 순서로 실행한다.

1. [ ] `supabase/liar-game/schema.sql` — extension, tables, constraints, indexes, triggers/helpers
2. [ ] `supabase/liar-game/functions-core.sql` — room/game/round lifecycle와 snapshot RPC
3. [ ] `supabase/liar-game/functions-vote.sql` — ballot, vote close, runoff RPC
4. [ ] `supabase/liar-game/functions-guess.sql` — shared liar guess RPC
5. [ ] `supabase/liar-game/functions-result.sql` — detailed result RPC
6. [ ] `supabase/liar-game/rls.sql` — base-table 차단과 authenticated RPC 권한
7. [ ] `supabase/liar-game/realtime.sql` — private Realtime authorization/publication 설정
8. [ ] `supabase/liar-game/seed.sql` — 14개 category word seed
9. [ ] 설치 후 schema/RPC 권한과 Production start matrix를 검증

`migrations/*.sql`은 과거 schema로 설치된 기존 DB를 단계적으로 올릴 때만 사용한다. 현재 `schema.sql`로 만든 빈 DB에는 적용하지 않는다.

## C. Web deployment and environment

- [ ] Production Supabase URL과 publishable key 설정 확인
- [ ] GitHub Pages 배포 성공 및 asset 404 없음 확인
- [ ] `/liar-game/` 직접 접근 성공
- [ ] 기존 사이트와 로그인 세션 공유 확인
- [ ] 비로그인 직접 접근이 차단되고 로그인 경로로 안내되는지 확인
- [ ] 홈의 `🎭 라이어 게임` 링크가 `./liar-game/`으로 정상 진입하는지 확인
- [ ] Supabase Realtime private channel subscribe/reconnect 성공
- [ ] authenticated business RPC 성공
- [ ] anon business RPC 및 anon/authenticated base-table 접근 거부
- [ ] 360px 모바일 viewport에서 setup, game, result 전체 확인
- [ ] desktop viewport에서 전체 흐름 확인
- [ ] 최신 Chrome에서 smoke test 완료
- [ ] Safari/iPhone에서 가능한 범위의 smoke test 완료 또는 미확인 사유 기록

## D. Release gate and rollback

- [ ] `final-qa-checklist.md`의 Production, gameplay, recovery, security 항목 결과 기록
- [ ] 배포 commit과 적용한 SQL 파일 checksum/시각 기록
- [ ] 오류 로그와 Realtime 연결 상태 모니터링 담당자 지정
- [ ] 문제 발생 시 이전 정적 commit으로 되돌리고, DB는 백업 또는 검증된 이전 `functions-core.sql` 정의로 복원할 절차 확인
