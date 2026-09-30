# Game Platform vNext — CURRENT

> 이 파일은 플랫폼 규칙의 CURRENT rulebook이 아니라 `game-platform-vnext` 재구축 작업의 **현재 진행 상태**다.

## 기준

- 실행 계획: `/game_platform_vnext_final_execution_plan.md`
- 계획 개정: **1.2**
- 계획 blob SHA: `cbfbe00a4ce66805e40f097b64f670911b4edeb1`
- 작업 root-slug: `game-platform-vnext`
- 계획의 이전 대조 기준 main: `c6b1e31b3fefef2c20a7a0f5841c5a16c996a559`
- STEP 0 착수 main: `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09`
- 기준 SHA 이후 변경: 실행 계획 개정 1.2 파일 1개 추가만 확인. 기존 플랫폼 규칙, `games/shared/`, Registry, Guard, 테스트, 출시 상태 변경은 해당 compare 범위에서 없음.

## 현재 상태

- 현재 STEP: **STEP 0 — 기준선 고정과 진행 기록 체계 구축**
- 상태: **REVIEW_PENDING**
- active branch: `docs/game-platform-vnext-phase0-bootstrap`
- PR: **#404** — OPEN / 사용자 검토 대기
- 최신 checkpoint: `checkpoints/CP-0001-step-0.md`
- 사용자 검토: 대기
- main merge: 미승인 / 미수행
- 다음 첫 작업: **STEP 0 산출물과 PR을 사용자가 검토한다. STEP 1은 시작하지 않는다.**

## 22개 검토 지점

| 단계 | 상태 |
|---|---|
| 0 | REVIEW_PENDING |
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
- **STEP 9B 주의:** 추가 구현 허용은 이미 검토된 계약의 구현에 한정한다. 기존 계약으로 표현할 수 없는 새 공통 계약·새 Runtime Model 의미·Core 책임이 필요하면 구현을 확장하지 않고 관련 설계 STEP으로 돌아가 검토하며, 필요한 범위에서 STEP 6 Target 동결 검토를 다시 거친다.
- Game-local이나 Capability는 공통 수명·권한·모델 계약을 우회하기 위한 수단으로 사용하지 않는다.

## STEP 0 검증 요약

- 최신 main과 계획 기준 SHA compare: 확인
- 착수 시 open PR: 없음; STEP 0 PR #404 생성
- 기존 `game-platform-vnext` 브랜치: 없음
- 변경 범위: 문서/기록/재개 안내만
- 게임 코드/DB/RPC/runtime/아키텍처 계약 수정: 없음
- 전체 테스트: 미실행 — 문서 전용 bootstrap이므로 `AGENTS.md` 규칙에 따라 불필요한 전체 테스트를 실행하지 않음
- 새 채팅 관점 기록 탐색 재현: PASS — AGENTS → 계획 → 기록 README → CURRENT → CP-0001 → DECISIONS 순서로 현재 STEP/브랜치/PR/다음 행동 복원
- 원격 보존: PASS — 작업 브랜치와 PR #404에서 CURRENT/checkpoint read-back 확인
