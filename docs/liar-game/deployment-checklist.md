# Liar Game Production Deployment Checklist

이 문서는 소스 배포와 Supabase SQL 적용을 운영자가 직접 수행할 때 사용하는 체크리스트다. SQL은 대상 프로젝트와 백업을 확인한 뒤 Supabase SQL Editor 또는 승인된 배포 도구에서 실행한다.

## A. 기존 운영 DB 업데이트

현재 운영 DB에 최신 결과 공개, 제시어 풀, 재투표 발언, Drawing Spy 모드와 획 수 무제한 옵션을 반영하려면 아래 순서로 실행한다.

1. [ ] 운영 DB 백업 또는 복구 지점 확보
2. [ ] 아직 미적용이면 `supabase/liar-game/functions-result.sql` — 검거 실패 5초 지연 자동 공개 RPC + 최신 Result projection
3. [ ] 아직 미적용이면 `supabase/liar-game/migrations/20260824_refresh_word_pool.sql` — `게임/영화드라마` 비활성화 + 남은 12카테고리 확장
4. [ ] 아직 미적용이면 `supabase/liar-game/migrations/20260825_runoff_tied_speakers.sql` — 재투표 전 추가 발언 시 동률 후보만 발언
5. [ ] 아직 미적용이면 `supabase/liar-game/migrations/20260825_drawing_spy_mode.sql` — game mode/drawing settings, DRAWING status, stroke storage/RPC, drawing snapshot 적용
6. [ ] `supabase/liar-game/migrations/20260825_drawing_unlimited_strokes.sql` — Drawing Spy 획 수 무제한 설정/snapshot, v3 settings RPC, unlimited stroke 저장 규칙 적용
7. [ ] `supabase/liar-game/rls.sql` — 최신 Drawing Spy RPC 권한과 drawing table 접근 차단 재적용
8. [ ] 자유 토론 채팅용 Realtime 송신 정책을 아직 적용하지 않았다면 `supabase/liar-game/realtime.sql` 실행
9. [ ] 기본 라이어게임이 기존 흐름 그대로 동작하는지 확인
10. [ ] 그림 스파이 제한 모드에서 최대 획 도달 시 자동 NEXT 확인
11. [ ] 그림 스파이 무제한 모드에서 획 수와 관계없이 계속 그릴 수 있고 시간 종료/완료 버튼으로만 NEXT 되는지 확인
12. [ ] 마지막 그림 차례 종료 후 DISCUSSION → VOTE 흐름 확인
13. [ ] 새로고침 후 기존 그림 획과 무제한 설정이 복구되는지 확인

Drawing Spy 변경은 새 table/column을 migration에서 추가하므로 기존 DB에서 `schema.sql`을 다시 실행하지 않는다.

## B. 빈 Supabase fresh install

현재 기본 `schema.sql`은 Drawing Spy 이전의 base schema를 유지하고 있다. Fresh install에서는 base SQL 이후 최신 migration들을 순서대로 적용한다.

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
11. [ ] `supabase/liar-game/rls.sql`
12. [ ] `supabase/liar-game/realtime.sql`
13. [ ] 설치 후 Production start matrix, 12카테고리, tied-candidate runoff speaking, Drawing Spy 제한/무제한 획 모드를 검증

`20260825_drawing_spy_mode.sql`은 현재 배포된 `liar_get_room_snapshot`을 내부 legacy base로 보존해 Drawing Spy projection을 덧붙인다. `20260825_drawing_unlimited_strokes.sql`은 그 projection을 다시 확장하므로 두 Drawing migration은 위 순서를 유지한다. 이후 `functions-core.sql`이나 `20260825_runoff_tied_speakers.sql`을 다시 실행하지 않는다.

## C. Web deployment and environment

- [ ] Production Supabase URL과 publishable key 설정 확인
- [ ] GitHub Pages 배포 성공 및 asset 404 없음 확인
- [ ] `/liar-game/` 직접 접근 성공
- [ ] 기존 사이트와 로그인 세션 공유 확인
- [ ] 비로그인 직접 접근 차단
- [ ] Supabase private room Realtime subscribe/reconnect 성공
- [ ] 자유 토론 채팅 A→B / B→A 송수신 성공, DB에 채팅 기록이 남지 않는지 확인
- [ ] Drawing Spy 한 획 저장 시 다른 브라우저가 room state refresh 후 같은 그림을 표시하는지 확인
- [ ] authenticated business RPC 성공
- [ ] anon business RPC 및 anon/authenticated base-table 접근 거부
- [ ] `liar_drawing_strokes` 직접 SELECT/INSERT/UPDATE/DELETE 차단 확인
- [ ] 360px 모바일에서 손가락 drawing, timer, limited/unlimited stroke indicator 확인
- [ ] desktop mouse/pointer drawing 확인
- [ ] 최신 Chrome smoke test
- [ ] Safari/iPhone 가능한 범위 확인

## D. Drawing Spy release gate

- [ ] 설정에서 `기본 라이어게임 / 그림 스파이` 전환 가능
- [ ] 그림 시간 5~60초 저장 검증
- [ ] 제한 모드 최대 획 1~10 저장 검증
- [ ] `획 수 무제한` ON/OFF 저장 및 setup 재진입 후 복구
- [ ] 무제한 ON 시 최대 획 입력값은 유지되지만 편집 비활성 상태로 표시
- [ ] 그림 스파이 시민은 제시어 확인
- [ ] 그림 스파이 liar role은 UI에서 `스파이`로 표시
- [ ] 역할 확인 완료 후 방장 `그림 시작`
- [ ] 현재 차례 외 사용자는 canvas readonly
- [ ] pointer down → move → up 전체가 1획으로 저장
- [ ] 제한 모드에서 획 제한 도달 시 자동 NEXT
- [ ] 무제한 모드에서 10획을 넘어도 현재 차례가 유지되는지 확인
- [ ] 무제한 모드에서 시간 종료 또는 `그림 완료`로 NEXT
- [ ] 시간 종료 시 현재 사용자 또는 방장 클라이언트가 자동 NEXT
- [ ] 방장 수동 NEXT 가능
- [ ] 마지막 사용자 종료 시 DISCUSSION으로 전환
- [ ] DISCUSSION에서 완성 그림 유지
- [ ] VOTING에서도 완성 그림 확인 가능
- [ ] reload/reconnect 후 stroke history 복구
- [ ] 다음 라운드에서도 같은 Game Drawing 설정 snapshot 유지
- [ ] 새 게임 생성 시 이전 Drawing mode/time/stroke/unlimited 설정을 복사한 뒤 setup에서 변경 가능

## E. 기존 기능 회귀

- [ ] 기본 라이어게임 ROLE_REVEAL → SPEAKING → DISCUSSION → VOTE 정상
- [ ] 동률 후보 추가 발언 정상
- [ ] 검거 성공 → 수동 라이어 공개 → 추측 정상
- [ ] 검거 실패 → 일회성 countdown → 실제 라이어 공개 정상
- [ ] 승리/패배 시각·음향 효과 정상
- [ ] spectator, leave guard, force end, auth epoch, stale-version recovery 정상
