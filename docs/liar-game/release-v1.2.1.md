# Liar Game v1.2.1

v1.2.1은 신규 게임 기능이 아니라 **검거 성공 이후 진행 정지 가능성을 제거하는 안정성 패치**다.

## 변경 내용

- 검거 성공으로 `LIAR_REVEAL`에 진입한 뒤 서버 기준 최소 5초가 지나야 공개 전환 가능
- 기존 방장 외에도 **현재 라운드 참가자**가 공개 전환을 완료할 수 있음
- 방장 탭이 절전·일시 중단·네트워크 단절 상태가 되어도 다른 참가자가 동일 전환을 완료 가능
- 여러 참가자가 동시에 전환을 시도해도 round row lock + version 검증으로 한 요청만 상태를 변경
- 다른 참가자는 `STALE_VERSION` / `INVALID_ROUND_STATE`를 받은 뒤 최신 `LIAR_GUESS` 상태로 동기화
- 서버 준비 시간이 약간 남아 있거나 클라이언트 mutation이 잠시 겹친 경우 짧게 재시도
- 관전자는 직접 전환 RPC를 호출하지 않고 Realtime 상태 변경만 따라감

## Production migration

v1.2.0 운영 DB 위에 아래 migration을 추가 적용한다.

```text
supabase/liar-game/migrations/20260828041626_liar_v121_capture_reveal_failover.sql
```

운영 프로젝트에는 `liar_v121_capture_reveal_failover` 이름으로 적용되어 있다.

## 검증 기준

- 비방장 현재 라운드 참가자가 5초 전에 `liar_reveal_liars` 호출 → `REVEAL_NOT_READY`
- 같은 참가자가 5초 후 호출 → `LIAR_GUESS` 전환 성공
- `liars_revealed_at` 설정
- `guess_unlocked_at` 설정
- 테스트 fixture는 transaction rollback으로 운영 데이터에 남기지 않음
- `anon` / `public` 함수 실행 권한 없음
- `authenticated` 실행 권한 유지

## 수동 플레이 회귀 테스트

1. 4명 이상으로 라운드 진행 후 라이어/스파이 검거 성공
2. 5초 검거 성공 카운트다운 정상 표시 확인
3. 방장 탭을 카운트다운 직전 또는 도중에 백그라운드/네트워크 단절 상태로 둠
4. 다른 현재 라운드 참가자 화면에서 공개 단계가 자동 완료되는지 확인
5. 모든 정상 접속 참가자가 동일한 라이어/스파이 공개 화면을 확인하는지 확인
6. 공개 후 공통 추측 잠금 카운트다운이 정상적으로 시작되는지 확인
7. 잠금 종료 후 라이어/스파이만 제시어를 제출할 수 있는지 확인
8. 방장이 정상 접속 중인 기존 흐름도 동일하게 동작하는지 확인

## The Game 브랜치 병합 영향

이 패치는 `liar-game/**`, `supabase/liar-game/**`, `docs/liar-game/**`만 변경한다.
`feature/the-game-v1`이 변경하는 루트 workflow, `index.html`, `js/pages/games.js`, `package.json`, 빌드 산출물 및 `the-game/**`와 파일 경로가 겹치지 않도록 범위를 제한했다.
