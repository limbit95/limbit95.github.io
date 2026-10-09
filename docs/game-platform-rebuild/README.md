# Game Platform vNext 재구축 진행 기록

이 디렉토리는 `game_platform_vnext_final_execution_plan.md` 개정 1.5(1.3의 integration 운영 계승)에 따른 **플랫폼 재구축 작업의 인수인계 기록**이다.

현재 인수인계는 [CURRENT](CURRENT.md)와 [CP0082](checkpoints/CP-0082-step-5b-formal-submitted.md)다. STEP5A **COMPLETED / DESIGN_RESULT_APPROVED / INTEGRATION_MERGED**, PR414 merge `3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0` 실제 확인. [CP0081](checkpoints/CP-0081-step-5a-integration-merge-approved.md)의 미병합/검토대기는 당시 이력이다.

STEP5B는 Astra §9.1 핵심 판단 승인과 정식 문서 반영·검증·원격 PR 제출 허용에 따라 **REVIEW_PENDING / APPROVED_JUDGMENT / FORMAL_RESULT_REVIEW_PENDING**으로 제출한다. 정식 결과 최종 승인/완료·integration 병합·main·STEP5C 이후는 남아 있다. 행동 NOT_RUN·UNKNOWN·구현/실행/오픈 의무와 main 별도 게이트 유지.

STEP5B 정식 산출물: [책임별 3분류·최소 계약](artifacts/step-5b-contract-boundaries.md), [중복/Probe/확장 기준](artifacts/step-5b-duplication-and-extension.md), [호환·수명·검증 owner/보류](artifacts/step-5b-compatibility-lifetime-verification.md), [고정 입력/source trace·세 원본](artifacts/step-5b-source-trace.md), [문서 검증·다음 전달](artifacts/step-5b-validation.md). 작업 branch `docs/game-platform-vnext-phase5b-extension-boundaries`, PR base integration; 실제 PR 번호·head/원격 증거는 해당 branch의 PR/Git에서 조회한다. 다음 첫 작업은 사용자 정식 결과 최종 검토다.

승인 STEP5A 산출물은 보존한다: [선택표](artifacts/step-5a-common-module-selection.md), [중복 기준](artifacts/step-5a-duplication-prevention.md), [owner/보류](artifacts/step-5a-compatibility-lifetime-verification.md), [source trace](artifacts/step-5a-source-trace.md), [검증](artifacts/step-5a-validation.md).

게임별 `DEVELOPMENT.md` / `UI_DECISIONS.md` checkpoint와 별개이며, 이 디렉토리의 기록은 기존 게임의 기능·디자인 상태를 대신하지 않는다.

## 단일 기준과 읽기 순서

새 채팅이나 새 작업자는 다음 순서로 복원한다.

1. 루트 `AGENTS.md`
2. 루트 `game_platform_vnext_final_execution_plan.md`
3. 이 `README.md`
4. `CURRENT.md`
5. `CURRENT.md`가 가리키는 최신 `checkpoints/CP-....md`
6. 필요 시 `DECISIONS.md`
7. 현재 단계가 연결한 `artifacts/` 산출물과 관련 source/test

정식 저장소 기준은 `main`, vNext 누적 통합 기준은 `feature/game-platform-vnext-integration`이다. 재개 시 **integration의 CURRENT/마지막 반영 승인 STEP → 현재 STEP 브랜치·PR → 최신 checkpoint** 순서로 실제 Git 상태를 대조한다. STEP 0이 아직 integration에 병합되지 않은 초기 상태라면 `docs/game-platform-vnext-phase0-bootstrap`과 PR #404의 기록을 사용한다. `main`의 기록이나 최근 수정 시각만으로 마지막 vNext 상태를 확정하지 않는다.

## 사용자 명령

### `작업 진행 기록하자`

현재 플랫폼 재구축 작업을 완료 처리하지 않고 중간 checkpoint로 저장한다.

- 완료/미완료
- 현재 결정과 유지할 경계
- 검증/미실행
- 유효 브랜치/PR
- 다음 첫 작업
- 원격 보존 여부

를 기록하고, `CURRENT.md` 포인터를 함께 갱신한다.

### `다시 이어서 시작하자`

과거 채팅 기억에 의존하지 않고 위 읽기 순서와 실제 Git 상태를 대조한다. 검토/승인 대기 상태를 승인으로 간주하지 않으며, 기록에서 허용된 미완료 작업 또는 승인된 다음 STEP만 진행한다.

## 브랜치 탐색 기준

- 정식 저장소 기준: `main`
- vNext 누적 통합 기준: `feature/game-platform-vnext-integration`
- 작업 root-slug: `game-platform-vnext`
- STEP별 작업 브랜치는 최신 승인 integration에서 분기하고 PR base를 integration으로 둔다.
- 현재 STEP 0은 integration 생성 전에 시작했으므로 기존 `docs/game-platform-vnext-phase0-bootstrap` 계보를 유지하고 PR #404의 base만 integration으로 정합화했다.
- 채팅방 변경만으로 새 브랜치를 만들지 않는다.
- 유효한 미완료 STEP 브랜치가 있으면 그 브랜치를 이어간다.
- 작업·기록을 `main`이나 integration에 직접 commit/push하지 않는다.
- STEP PR의 integration 병합과 integration → main 반영은 서로 다른 승인 게이트이며 어느 쪽도 사용자 명시적 승인 없이 merge하지 않는다.
- 이번 integration 운영은 vNext 재구축에 한정하며 저장소 전체의 다른 작업 Governance로 확대하지 않는다.

## 기록 파일

- `CURRENT.md`: 현재 상태의 단일 요약
- `DECISIONS.md`: 누적 결정과 대체 관계
- `checkpoints/`: 단계 시작/완료/중간 기록
- `artifacts/`: 감사표, 계승표, matrix, Target 설계, 중요 검증 근거

루트 실행 계획이 목표·범위·순서·통과 기준을 소유한다. 이 디렉토리의 기록은 계획을 묵시적으로 변경하지 않는다.
