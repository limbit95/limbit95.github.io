# Game Platform vNext 재구축 진행 기록

이 디렉토리는 `game_platform_vnext_final_execution_plan.md` 개정 1.5(1.3의 integration 운영 계승)에 따른 **플랫폼 재구축 작업의 인수인계 기록**이다.

현재 인수인계는 [CURRENT](CURRENT.md)와 [CP0096](checkpoints/CP-0096-step-7a3-result-approved.md)다. STEP7A3 **COMPLETED / DESIGN_RESULT_APPROVED / FORMAL_RESULT_APPROVED / INTEGRATION_NOT_MERGED**. 사용자 승인 기준 PR #421 head 73839aea65679278888f26facc593f9c1180b5ad. 승인·완료 기록만 같은 STEP7A3 브랜치에 보존하며 PR OPEN / merged=false다.

마지막 승인 integration 반영은 STEP7A2이며 integration 4dbe77010dec444f6e37e3c570e75dd5d9c6308a / main 69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09 유지. STEP6 승인/동결/병합·STEP7A1 완료/병합 유지. 행동 **NOT_RUN**·실행/운영 **UNKNOWN**·기존 구현/실행/오픈 후속 의무 유지. 다음 첫 작업은 사용자의 PR #421 integration 병합 여부 별도 결정이다. 병합·main·다음 단계는 진행하지 않는다.

### CP0095 제출 당시 진입 설명 이력

현재 인수인계는[CURRENT](CURRENT.md)와[CP0095](checkpoints/CP-0095-step-7a3-formal-submitted.md)다. STEP7A2 COMPLETED/FORMAL_RESULT_APPROVED/INTEGRATION_MERGED,PR420실제 merge 4dbe77010dec444f6e37e3c570e75dd5d9c6308a·승인최종tree/ref확인. CP0094 미병합은당시이력. STEP6승인/동결·STEP7A1완료/병합유지.

STEP7A3 **REVIEW_PENDING / FORMAL_RESULT_REVIEW_PENDING**. [RT1~6](../game-platform-realtime-coop-rules.md)·R01~13/공통owner·진입/네템플릿/최소Guard반영. [대응](artifacts/step-7a3-clause-correspondence.md),[trace](artifacts/step-7a3-source-trace.md),[게임영향](artifacts/step-7a3-game-impact.md),[검증/최종검토](artifacts/step-7a3-validation.md). 원본/기존게임·BO보존,행동NOT_RUN·UNKNOWN·구현/실행/오픈후속의무유지. 다음첫작업은사용자의정식결과최종검토하나. 완료/해당PR병합/main/7B이후진행없음.

### CP0094 저장 당시 진입 이력

현재 인수인계는 [CURRENT](CURRENT.md)와 [CP0094](checkpoints/CP-0094-step-7a2-result-approved.md)다. STEP7A2 **COMPLETED / DESIGN_RESULT_APPROVED / FORMAL_RESULT_APPROVED / INTEGRATION_NOT_MERGED**. 사용자 승인 기준 PR #420 head b1643c5b1d0ea86cd9ec5fef39a0e1ca996ce61a. 승인·완료 기록만 같은 STEP7A2 브랜치에 보존하며 PR OPEN / merged=false다.

마지막 승인 integration 반영은 STEP7A1이며 integration 41c5b167e19a55095ea57732527a6947b48e7efe / main69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09 유지. 행동 **NOT_RUN**·실행/운영 **UNKNOWN**·기존 구현/실행/오픈 후속 의무 유지. 다음 첫 작업은 사용자의 PR #420 integration 병합 여부 별도 결정이다. 병합·main·다음 단계는 진행하지 않는다.

### CP0093 제출 당시 진입 설명 이력

현재 인수인계는 [CURRENT](CURRENT.md)와 [CP0093](checkpoints/CP-0093-step-7a2-formal-submitted.md)다. STEP7A1 COMPLETED/FORMAL_RESULT_APPROVED/INTEGRATION_MERGED, PR419 merge 41c5b167e19a55095ea57732527a6947b48e7efe 실제 확인. CP0092 미병합은 당시 이력이다. STEP6승인/동결/병합 유지.

STEP7A2 **REVIEW_PENDING / FORMAL_RESULT_REVIEW_PENDING**. [BO1~4](../game-platform-board-rules.md)·진입/네템플릿·최소Guard를 같이 반영했다. [조항대응](artifacts/step-7a2-clause-correspondence.md), [trace](artifacts/step-7a2-source-trace.md), [Registry영향도](artifacts/step-7a2-game-impact.md), [검증/최종검토](artifacts/step-7a2-validation.md). 기존게임/원본보존·행동NOT_RUN/UNKNOWN·후속의무유지. 다음 첫작업은 사용자 정식결과최종검토 하나다. 완료/병합/main/7A3이후 진행 없음.

### CP0092 저장 당시 진입 이력

현재 인수인계는 [CURRENT](CURRENT.md)와 [CP0092](checkpoints/CP-0092-step-7a1-result-approved.md)다. STEP7A1 **COMPLETED / DESIGN_RESULT_APPROVED / FORMAL_RESULT_APPROVED / INTEGRATION_NOT_MERGED**. 사용자 승인 기준은 PR #419 head `bc4e9f6559cd12bc215d409105ccc2e921d99b46`다. 승인·완료 기록만 같은 PR 브랜치에 원격 보존하며 PR은 OPEN / merged=false다. 마지막 승인 integration 반영은 STEP6이며 integration `90f14ceb3e609267aa559980994a07eacb0160f3`와 main은 유지한다. 행동 **NOT_RUN**·운영 **UNKNOWN** 및 구현/실행/오픈 후속 의무 유지. 다음 첫 작업은 사용자의 PR #419 integration 병합 여부 별도 결정이다. 병합·main·다음 단계는 진행하지 않는다.

### CP0091 제출 당시 진입 설명 이력

현재인수인계는[CURRENT](CURRENT.md)와[CP0091](checkpoints/CP-0091-step-7a1-formal-submitted.md)다. STEP6승인/동결/병합및PR418기록merge `90f14ceb3e609267aa559980994a07eacb0160f3` 실제확인. STEP7A1 **REVIEW_PENDING / FORMAL_RESULT_REVIEW_PENDING**, AR/CO/LI/MO/CA본문·기존GV/진입/네템플릿·최소Guard/관련테스트를함께반영했다. [조항대응](artifacts/step-7a1-clause-correspondence.md), [trace](artifacts/step-7a1-source-trace.md), [게임영향도](artifacts/step-7a1-game-impact.md), [검증/최종검토](artifacts/step-7a1-validation.md). 다음첫작업은사용자의정식결과최종검토하나다. 행동NOT_RUN·UNKNOWN·후속의무유지. 병합/main/7A2이후미수행.

아래CP0090이전의진입설명은당시이력이며현재상태는위포인터와실제Git을따른다. 원문/기존consumer를이관하거나검토대기를현재승인으로확대하지않는다.

### CP0090 당시 진입 설명 이력

현재 인수인계는 [CURRENT](CURRENT.md)와 [CP0090](checkpoints/CP-0090-step-6-integration-merged.md)다. 마지막 승인 integration 반영은 STEP6 **COMPLETED / DESIGN_RESULT_APPROVED / TARGET_FROZEN / INTEGRATION_MERGED**. PR417 merged=true / merge `1a950b06ac895028330587dc53fae151b981123a` / final head `487fc8111a98d8f9966e58303b3f85cd81c8fc33`, 실제 부모·승인 tree 일치·integration ref를 확인했다. CP0087~89의 OPEN/미병합은 당시 이력이다.

STEP6 정식 결과는 사용자가 PR #417 head `1f52c47335d741c68126187d32ad5b87b8fbdb8d`를 기준으로 승인하여 **COMPLETED / DESIGN_RESULT_APPROVED / TARGET_FROZEN**이다. 승인·완료 기록만 같은 STEP6 branch/PR에 원격 보존한다. PR417 **CLOSED / merged=true / INTEGRATION_MERGED**, merge `1a950b06ac895028330587dc53fae151b981123a`. 이번 병합과 사후 기록은 사용자 별도 승인을 적용했다. 실제 권위 전환·구현·행동 PASS·지원/오픈 완료가 아니다. hostless multiplayer 재대결 예외는 승인하지 않았으며 후속 의무를 유지한다. [Target](artifacts/step-6-target-architecture.md), [전수계승/ID·f](artifacts/step-6-clause-destinations.md), [세요청추적](artifacts/step-6-request-traces.md), [Slice/검증/후속의무](artifacts/step-6-slices-and-verification.md), [원본/승인/source trace](artifacts/step-6-source-trace.md), [문서검증/최종검토](artifacts/step-6-validation.md). 세원본identity/bytes/hash와Astra조건·제한·미확인보존, 새핵심판단/별도감사없음.

병합 후 기록 branch `docs/game-platform-vnext-phase6-merge-record` / 검토 PR base `feature/game-platform-vnext-integration`. PR417 승인 head·merge SHA와 기록 PR의 최종 head/원격 증거를 구분한다. 다음 첫 작업은 **사용자의 병합 기록 PR 검토·integration 반영 여부 결정**이다. 이번에는 PR417 병합·증거 기록 뒤 정지하며 사후 기록 PR 병합·main·STEP7은 진행하지 않는다. 행동 NOT_RUN·UNKNOWN·구현/실행/오픈 의무와 기존게임/Auth/API/SQL 무이관, 실제 rulebook/AGENTS/Guard 전환 미수행을 유지한다.

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


## CP0084 저장 당시 인수인계 안내 — 병합 전 이력 보존

현재 인수인계는 [CURRENT](CURRENT.md)와 [CP0084](checkpoints/CP-0084-step-5b-integration-merge-approved.md)다. STEP5A **COMPLETED / DESIGN_RESULT_APPROVED / INTEGRATION_MERGED**, PR414 merge `3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0` 실제 확인. [CP0081](checkpoints/CP-0081-step-5a-integration-merge-approved.md)의 미병합/검토대기는 당시 이력이다.

STEP5B 정식 결과는 2026-10-10 08:41:52 KST 사용자 승인으로 **COMPLETED / DESIGN_RESULT_APPROVED**다. 승인 대상 PR415 최종 제출 HEAD `23c10191c1e4c07103f6aabde8a5c94746a3b12a`. 승인·완료 기록만 같은 STEP 브랜치/PR에 원격 보존한다. PR415 integration 병합은 2026-10-10 11:42:41 KST 별도 사용자 승인 대상이며 실제 최종 merged/merge SHA·승인 head 반영은 PR/Git에서 확인한다. merged/승인 head tree 반영 확인 시 STEP5B INTEGRATION_MERGED·마지막 승인 반영 STEP5B, phase5b branch는 종료 이력이다. main·STEP5C 이후는 미승인·미수행. 행동 NOT_RUN·UNKNOWN·구현/실행/오픈 의무와 main 별도 게이트 유지. 정식 산출물 헤더/CP0082의 REVIEW_PENDING은 제출 당시 이력이며 현재 승인/병합 복원은 CURRENT/CP0084와 실제 PR415/Git을 따른다.

STEP5B 정식 산출물: [책임별 3분류·최소 계약](artifacts/step-5b-contract-boundaries.md), [중복/Probe/확장 기준](artifacts/step-5b-duplication-and-extension.md), [호환·수명·검증 owner/보류](artifacts/step-5b-compatibility-lifetime-verification.md), [고정 입력/source trace·세 원본](artifacts/step-5b-source-trace.md), [문서 검증·다음 전달](artifacts/step-5b-validation.md). 작업 branch `docs/game-platform-vnext-phase5b-extension-boundaries`, PR base integration; 실제 PR 번호·head/원격 증거는 해당 branch의 PR/Git에서 조회한다. 다음 첫 작업은 사용자의 STEP5C 계획 준비 착수 여부 결정이다. 이번에는 PR415 병합·확인·기록만 수행하며 다음 단계는 시작하지 않는다.

승인 STEP5A 산출물은 보존한다: [선택표](artifacts/step-5a-common-module-selection.md), [중복 기준](artifacts/step-5a-duplication-prevention.md), [owner/보류](artifacts/step-5a-compatibility-lifetime-verification.md), [source trace](artifacts/step-5a-source-trace.md), [검증](artifacts/step-5a-validation.md).


## CP0087 당시 진입 상태 이력

현재 인수인계는 [CURRENT](CURRENT.md)와 [CP0087](checkpoints/CP-0087-step-5c-integration-merge-approved.md)다. 마지막 승인 integration 반영은 STEP5B **COMPLETED / DESIGN_RESULT_APPROVED / INTEGRATION_MERGED**, PR415 merge `2751e9241a3debbd40506fa1b2ea7e688dfe0140` 실제 확인. CP0084/과거 OPEN·HOLD·검토대기는 당시 이력과 유효 결정·실제 Git을 함께 읽는다.

STEP5C 정식 결과는 2026-10-11 21:28:08 KST 사용자 승인으로 **COMPLETED / DESIGN_RESULT_APPROVED**다. 승인 대상 PR #416 제출 head `3488b8c39bd848f14229754ad215fc1586eca986`. 승인·완료 기록만 같은 STEP5C branch/PR에 원격 보존한다. PR416 OPEN / merged=false / INTEGRATION_NOT_MERGED. CP0085·정식 산출물의 REVIEW_PENDING은 제출 당시 이력이며 승인 산출물/세 원본은 재작성하지 않는다. [보드 계승/조건](artifacts/step-5c-board-rule-succession.md), [첫 비보드 규칙](artifacts/step-5c-realtime-coop-spatial-rules.md), [둘째 Probe/연결/추가/의무](artifacts/step-5c-genre-model-connections.md), [원본/승인/trace](artifacts/step-5c-source-trace.md), [문서 검증·최종 검토](artifacts/step-5c-validation.md). 세 원본 identity/bytes 보존. branch `docs/game-platform-vnext-phase5c-genre-rule-design` / PR base integration. 실제 번호·최종 head/원격 증거는 해당 PR/Git에서 조회한다.

2026-10-11 21:32:21 KST 사용자 ‘승인할게’로 PR416 integration 병합·확인·기록만 허용됐다. 이 기록은 병합 전 저장이다. PR416 merged/merge parents·승인 최종 head tree/integration ref 증거가 확인되면 STEP5C INTEGRATION_MERGED·마지막 승인 반영 STEP5C로 복원하며 과거 OPEN/미병합은 당시 이력이다. 다음 첫 작업은 **사용자의 STEP6 계획 준비 착수 여부 결정 하나**다. main·STEP6 계획/조사/동결 및 이후는 미허용·미수행. NOT_RUN/UNKNOWN·구현/실행/오픈·STEP6/7 전수 목적지/권위전환 의무 유지. 기존게임 무이관, 현재 rulebook/Guard·계획/DECISIONS/STEP1~5B/과거 checkpoint 보존. main/STEP6 별도 게이트.


## STEP6 정식 결과 승인 기록 — CP0089

승인 대상 PR #417 head `1f52c47335d741c68126187d32ad5b87b8fbdb8d`. Target 설계 동결·승인·완료 기록만 허용됐다. CP0088·정식 산출물/세 원본의 REVIEW_PENDING·승인 대기는 제출 당시 이력이며 원본/정식 본문을 덮어쓰지 않는다. 현재 상태는 CURRENT/CP0089와 실제 PR/Git을 따른다. STEP7 미착수·병합/main 미수행, 행동 NOT_RUN·UNKNOWN·후속 의무 유지.

### STEP6 제출 당시 상태 이력

STEP6는사용자§9.1여섯묶음전체핵심판단승인과정식반영/문서검증/integration base 검토PR제출허용뒤 **REVIEW_PENDING / APPROVED_JUDGMENT / FORMAL_RESULT_REVIEW_PENDING**으로제출한다. [Target](artifacts/step-6-target-architecture.md), [전수계승/ID·f](artifacts/step-6-clause-destinations.md), [세요청추적](artifacts/step-6-request-traces.md), [Slice/검증/후속의무](artifacts/step-6-slices-and-verification.md), [원본/승인/source trace](artifacts/step-6-source-trace.md), [문서검증/최종검토](artifacts/step-6-validation.md). 세원본identity/bytes/hash와Astra조건·제한·미확인보존, 새핵심판단/별도감사없음.

## STEP6 integration 병합 확인 — CP0090

PR417 merged=true, 승인 head `487fc8111a98d8f9966e58303b3f85cd81c8fc33`, merge `1a950b06ac895028330587dc53fae151b981123a`, 2026-10-13 07:29:41 KST. 현재 승인 integration은 STEP6까지 반영됐다. 실제 merge tree가 승인 final head tree와 동일함을 확인했고, main은 그대로다. 아래 과거 CP0089 상태와 artifacts의 승인대기/미병합은 당시 이력이며 원본을 덮어쓰지 않는다. 기록 PR은 별도 검토·병합 게이트, STEP7 미착수 및 NOT_RUN/UNKNOWN·후속 의무 유지.

### CP0089 당시 진입 상태 이력

현재 인수인계는 [CURRENT](CURRENT.md)와 [CP0089](checkpoints/CP-0089-step-6-design-result-approved.md)다. 마지막 승인 integration 반영 STEP5C **COMPLETED / DESIGN_RESULT_APPROVED / INTEGRATION_MERGED**, PR416 merge `f34f4f180e14ea36847b9740dea43de2f1325e56` / final head `fe1d627f5c6fa39c1f540fcf17dfad22fdd82e18` 실제확인. CP0087의OPEN·미병합은당시이력이다.

STEP6 정식 결과는 사용자가 PR #417 head `1f52c47335d741c68126187d32ad5b87b8fbdb8d`를 기준으로 승인하여 **COMPLETED / DESIGN_RESULT_APPROVED / TARGET_FROZEN**이다. 승인·완료 기록만 같은 STEP6 branch/PR에 원격 보존한다. PR417 **OPEN / merged=false / INTEGRATION_NOT_MERGED**. 실제 권위 전환·구현·행동 PASS·지원/오픈 완료가 아니다. hostless multiplayer 재대결 예외는 승인하지 않았으며 후속 의무를 유지한다. [Target](artifacts/step-6-target-architecture.md), [전수계승/ID·f](artifacts/step-6-clause-destinations.md), [세요청추적](artifacts/step-6-request-traces.md), [Slice/검증/후속의무](artifacts/step-6-slices-and-verification.md), [원본/승인/source trace](artifacts/step-6-source-trace.md), [문서검증/최종검토](artifacts/step-6-validation.md). 세원본identity/bytes/hash와Astra조건·제한·미확인보존, 새핵심판단/별도감사없음.

branch `docs/game-platform-vnext-phase6-target-architecture` / PR #417 base `feature/game-platform-vnext-integration`. 승인 대상 head와 기록 후 최종 head/원격 read-back은 해당 PR/Git 설명에서 구분한다. 다음 첫 작업은 **사용자의 PR #417 integration 병합 여부 결정**이다. 이번에는 기록 보존 뒤 정지한다. 병합·main·STEP7은 별도 게이트다. 행동 NOT_RUN·UNKNOWN·구현/실행/오픈 의무·기존게임/Auth/API/SQL 무이관. 실제 rulebook/AGENTS/Guard 전환·제안 runtime 경로 생성 없음.
