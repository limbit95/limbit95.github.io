# Game Platform vNext — CURRENT

> 이 파일은 플랫폼 규칙의 CURRENT rulebook이 아니라 `game-platform-vnext` 재구축 작업의 **현재 진행 상태**다.

## 기준

- 실행 계획: `/game_platform_vnext_final_execution_plan.md`
- 계획 개정: **1.3**
- 계획 blob SHA: `e12ef038913eb6d605709b782f1b73f18e0d1253`
- 작업 root-slug: `game-platform-vnext`
- 계획의 이전 대조 기준 main: `c6b1e31b3fefef2c20a7a0f5841c5a16c996a559`
- STEP 0 착수 main: `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09`
- integration 최초 생성 기준 main: `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09`
- vNext integration: `feature/game-platform-vnext-integration`
- 확인한 integration HEAD: `394ae9aada9b99d9fb049fa0a3278f50133f3290`
- integration에 반영된 마지막 승인 STEP: **STEP 0 — PR #404 / merge commit `df43b4a60518ace86f6c5db4344bea81b0d0d4f7`**
- STEP 0 사후 기록 반영: **PR #406 / merge commit `394ae9aada9b99d9fb049fa0a3278f50133f3290`**
- 기준 SHA 이후 변경 감사: `c6b1e31... → STEP 0 착수 main` 사이에는 실행 계획 개정 1.2 파일 1개 추가만 있었고 기존 플랫폼 규칙, `games/shared/`, Registry, Guard, 테스트, 출시 상태 변경은 없었음.
- 개정 1.3 정합화 시점의 main과 integration: **identical**. 이후 각 STEP에서 반복 main 동기화를 기본 절차로 두지 않음.

## 현재 상태

- 현재 단계 경계: **STEP 0 완료 / STEP 1 시작 대기**
- STEP 0 상태: **COMPLETED**
- STEP 1 상태: **NOT_STARTED**
- active STEP branch: **없음 — STEP 0 작업 브랜치는 완료 이력이며 STEP 1 브랜치는 아직 생성하지 않음**
- 완료된 STEP 0 branch: `docs/game-platform-vnext-phase0-bootstrap`
- STEP 0 branch의 integration 기준 SHA: `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09`
- active record-correction branch: `docs/game-platform-vnext-phase0-audit-correction`
- STEP PR: **#404** — MERGED / base `feature/game-platform-vnext-integration` / head `docs/game-platform-vnext-phase0-bootstrap`
- STEP PR integration merge 승인: **승인됨 — 2026-09-30 사용자 검토 후 병합 지시**
- STEP PR integration 반영: **완료 — merge commit `df43b4a60518ace86f6c5db4344bea81b0d0d4f7`**
- integration → main 승인/PR/반영: **없음 / 없음 / 미수행**
- 최신 checkpoint: `checkpoints/CP-0005-step-0-record-audit-correction.md`
- STEP 0 사용자 검토: **통과**
- STEP 0 사후 감사: **아키텍처/Governance 훼손 없음, 기록 정합화 Minor 3건 보완 중**
- 다음 첫 작업: **이 기록 정합화 PR을 검토·승인해 integration에 반영한다. 그 전에는 STEP 1을 시작하지 않는다.**

## 22개 검토 지점

| 단계 | 상태 |
|---|---|
| 0 | COMPLETED |
| 1 | NOT_STARTED |
| 2 | NOT_STARTED |
| 3 | NOT_STARTED |
| 4A | NOT_STARTED |
| 4B | NOT_STARTED |
| 5A | NOT_STARTED |
| 5B | NOT_STARTED |
| 5C | NOT_STARTED |
| 6 | NOT_STARTED |
| 7A1 | NOT_STARTED |
| 7A2 | NOT_STARTED |
| 7A3 | NOT_STARTED |
| 7B | NOT_STARTED |
| 7C | NOT_STARTED |
| 7D | NOT_STARTED |
| 8 | NOT_STARTED |
| 9A | NOT_STARTED |
| 9B | NOT_STARTED |
| 10 | NOT_STARTED |
| 11 | NOT_STARTED |
| 12 | NOT_STARTED |

## 유지해야 할 실행 경계

- 통합 플랫폼 / 기존 규칙 조항별 계승 / 기존 게임 무이관 원칙을 유지한다.
- STEP 6 전에는 실제 vNext 코드 물리 배치를 확정하거나 새 공통 runtime 구현을 시작하지 않는다.
- STEP별 작업은 최신 승인 integration에서 별도 브랜치로 수행하고, STEP PR은 integration을 base로 둔다.
- STEP PR의 integration 병합과 integration → main 반영은 별도의 승인 게이트로 구분한다.
- 사용자가 재구축 중 main에 새 기능을 추가하지 않을 예정이라는 점은 이번 작업의 운영 가정이며 저장소 전체의 개발 금지 규칙으로 확대하지 않는다.
- **STEP 9B 주의:** 추가 구현 허용은 이미 검토된 계약의 구현에 한정한다. 기존 계약으로 표현할 수 없는 새 공통 계약·새 Runtime Model 의미·Core 책임이 필요하면 구현을 확장하지 않고 관련 설계 STEP으로 돌아가 검토하며, 필요한 범위에서 STEP 6 Target 동결 검토를 다시 거친다.
- Game-local이나 Capability는 공통 수명·권한·모델 계약을 우회하기 위한 수단으로 사용하지 않는다.

## STEP 0 검증 요약

- integration 최초 생성: PASS — 실제 최신 main `69a7fcb...`에서 `feature/game-platform-vnext-integration` 생성
- STEP 0 착수 main / integration 최초 생성 main: PASS — 동일 SHA `69a7fcb...`, 두 의미는 기록상 구분
- main ↔ integration 최초 상태: PASS — identical
- PR #404 base/head: PASS — integration ← `docs/game-platform-vnext-phase0-bootstrap`, MERGED / merge commit `df43b4a60518ace86f6c5db4344bea81b0d0d4f7`
- 루트 실행 계획 교체: PASS — 첨부 개정 1.3과 Git blob SHA `e12ef038913eb6d605709b782f1b73f18e0d1253` 일치
- PR diff 범위: PASS — 계획/기록/AGENTS/루트 진입 안내 10개 경로만 변경, 게임 코드·DB/RPC·Registry·Guard·runtime 변경 없음
- 기존 CP-0001 보존: PASS — 개정 1.2 당시 사실 기록으로 수정하지 않음
- 전체 테스트: NOT_RUN — 문서/브랜치 운영 정합화이며 코드·아키텍처 계약 변경 없음
- 새 채팅 관점 기록 탐색 재현: PASS — AGENTS/루트 계획 → 기록 README → integration/CURRENT → 최신 checkpoint/DECISIONS 순서로 STEP 0 완료·STEP 1 미착수·통합 기준선·승인 상태·다음 행동 복원
- 원격 보존: PASS — CP-0002 생성 commit `070ca2e53135dbe73a85c35df34b631050963115` 후 작업 브랜치에서 계획/CURRENT/CP-0001/CP-0002/DECISIONS read-back 확인

## STEP 0 사후 병합 정합화

- PR #404 실제 병합: PASS — 2026-09-30T17:54:59+09:00
- 병합 대상: `feature/game-platform-vnext-integration`
- merge commit: `df43b4a60518ace86f6c5db4344bea81b0d0d4f7`
- 병합 후 integration에서 개정 1.3 계획/CURRENT/CP-0003 조회: PASS
- `main` 반영: 미수행 — 별도 승인 게이트 유지
- STEP 1: NOT_STARTED

## STEP 0 사후 감사 정정

- 감사 판정: **경미한 수정 후 STEP 1 진입 가능**
- 아키텍처/실행 계획 1.3/Governance 훼손: **확인되지 않음**
- D-0004의 미병합 상태 문구: 결정 채택 당시 상태로 정정하고 현재 상태는 CURRENT/checkpoint에서 추적
- PR #406: 사용자 명시적 병합 승인 후 integration에 MERGED / merge commit `394ae9aada9b99d9fb049fa0a3278f50133f3290`
- CP-0001의 “open PR 없음”: 저장소 전체가 아니라 당시 동일 `game-platform-vnext` 작업 계보의 open PR 없음으로 범위를 정정 기록
- 과거 CP-0001~0004는 당시 기록 보존 원칙에 따라 수정하지 않음
- STEP 1 시작 조건: **이 정정 기록이 integration에 반영되고 사용자 별도 시작 지시가 있을 것**
