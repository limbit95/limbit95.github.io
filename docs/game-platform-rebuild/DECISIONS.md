# Game Platform vNext Decisions

이 파일은 `game_platform_vnext_final_execution_plan.md` 개정 1.3의 목표를 새로 정의하는 문서가 아니다. 재구축 과정에서 채택·대체·폐기된 결정을 누적 추적한다.

## D-0001 — 하나의 통합 게임 플랫폼

- 상태: **ADOPTED_FROM_PLAN**
- 출처: 실행 계획 개정 1.2 §1~2
- 결정: 신규 게임은 하나의 상위 게임 플랫폼 아키텍처 안에서 개발한다. 장르별 규칙은 하위 규칙이며 장르별 별도 플랫폼/Core를 만들지 않는다.
- STEP 0 변경 여부: 없음.

## D-0002 — 기존 규칙의 조항별 계승

- 상태: **ADOPTED_FROM_PLAN**
- 출처: 실행 계획 개정 1.2 §1, §3
- 결정: 기존 게임 구현 코드는 참고/회귀 대상이지만, 기존 플랫폼 개발 흐름·품질 기준·보드게임 상세 규칙은 적용 범위와 의도를 유지해 조항별로 계승한다.
- STEP 0 변경 여부: 없음.

## D-0003 — 기존 구현 게임 무이관

- 상태: **ADOPTED_FROM_PLAN**
- 출처: 실행 계획 개정 1.2 §1, STEP 8
- 결정: 기존 게임을 vNext 구조에 맞춰 migration하지 않는다. 공유 경계 변경의 영향도는 감사하되, `MIGRATION_REQUIRED`가 나오면 기존 게임을 고치기보다 vNext 격리/스코프/버전 경계를 재검토한다.
- STEP 0 변경 여부: 없음.

## D-0004 — vNext integration 누적 운영

- 상태: **ADOPTED_FROM_PLAN**
- 출처: 실행 계획 개정 1.3 §4, STEP 0 및 사용자 승인
- 결정: vNext 재구축은 `feature/game-platform-vnext-integration`에 사용자 승인된 STEP 결과를 순서대로 누적한다. 각 STEP은 별도 작업 브랜치와 integration base PR을 유지하며, STEP PR의 integration 병합과 최종 integration → main 반영은 별도 승인으로 구분한다.
- 범위: 이번 `game-platform-vnext` 재구축 작업에 한정한다. 저장소 전체의 신규 기능 개발 금지나 일반 브랜치 Governance로 확대하지 않는다.
- 기준선: integration 최초 생성 기준 main은 `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09`.
- STEP 0 적용 당시: 기존 `docs/game-platform-vnext-phase0-bootstrap`과 PR #404를 유지하고 PR base를 integration으로 변경했다. 개정 1.3 채택 당시 STEP 0은 미병합 상태였으며, 이후의 실제 진행·승인·병합 상태는 `CURRENT.md`와 checkpoint에서 추적한다.

## STEP 0 메모

사전 검토에서 확인한 STEP 9B 실행 주의사항은 **새 아키텍처 결정이 아니므로 이 결정 목록에 별도 decision으로 추가하지 않는다.** 해당 내용은 `CURRENT.md`와 STEP 0 checkpoint에서 실행 계획 1.3의 기존 규칙을 적용할 때의 해석상 경계로 보존한다.
