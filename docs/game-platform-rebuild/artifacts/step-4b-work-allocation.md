# STEP 4B — 작업 분담과 정지 경계

작업 계보 `game-platform-vnext`. [PR412](https://github.com/limbit95/limbit95.github.io/pull/412), 승인 기준 `3aeae1dfcce7788f88e706dcd49d283b91b67e82`, branch `docs/game-platform-vnext-phase4b-evidence-preparation`. 역할 명칭은 가이드 책임을 뜻하며 별도 모델 실행 인증이 아니다.

| 순서 | 담당/상태 | 수행/미완료 |
|---|---|---|
| 1 | Work Sol/Codex PREPARATION_COMPLETE | CP0044 제출 보존 |
| 2 | 일반 Sol5.6 RESEARCH_RECEIVED_REVIEWED | 첨부 원본 byte 보존·출처/범위/미확인 검토; 별도 모델 실행 이력 미인증 |
| 3A | Work Astra JUDGMENT_SUBMITTED | J01~06 권위·순서·중복·handoff·복구·11개 안전성 |
| 3B | Work Astra JUDGMENT_SUBMITTED | J07~09 private·권한 시점/철회·사이트 책임 |
| 3C | Work Astra JUDGMENT_SUBMITTED | J10~13 실행 방향·제품/transport/운영비용 보류·G01~06·검증 oracle |
| 4 | Work Sol FORMAL_SUBMITTED_AUDIT_PENDING | 판단 전체5블록/13절·G01~06·H01~10 정식6문서 반영/검증 |
| 5 | Work Astra AUDIT_SUBMITTED | 고정 d2819c0 대상 재판정: 문서 정합성 PASS, 새 finding0, G01~06 OPEN/전체 완료 HOLD |
| 6/7 | 보완/사용자 NOT_STARTED | finding 대응·결과/integration 병합 승인 |

## 가이드5 제출 당시 기록

[판단 전체](step-4b-astra-judgment.md)는 입력 SHA `ddfa7a5e226fe0c5f62779a19b708ca0802899ce`로 보존. **정식 제출/고정 감사 대상 SHA `d2819c02db31f8b4f426d99b8a26c02e622ac46f`**, 감사 기록 추가 SHA와 구별한다. [감사 보고서](step-4b-post-audit.md), [감사 검증](step-4b-post-audit-validation.md), [최신 CP0049](../checkpoints/CP-0049-step-4b-post-audit.md).

가이드5 사후 감사 제출 완료와 STEP4B 전체 완료는 다르다. 문서 반영·계약 정합성 PASS, 새 수정 요구 finding0이다. G01~06 OPEN·제품/transport/배포 미확정·실제 지원 미검증으로 전체 완료/구현 착수는 HOLD다. 기존 가이드4 제출물의 사후 감사 대기 표기는 고정 대상 당시 이력으로 보존한다.

이번 사용자 허용은 사후 감사와 결과/진행 기록 원격 제출까지다. 제출 후 정지하고 사용자 검토·후속 범위 지정을 기다린다. 산출물 보완·구현·STEP5A·병합·main 미수행.

## G01~06 설계 보완 — 요구/질문 준비

[요구 검토](step-4b-requirements-review.md)·[결정 질문](step-4b-decision-questions.md)·[CP0050](../checkpoints/CP-0050-step-4b-decision-questions.md). 사용자 추가 요청에 따라 G01/G06의 확정 요구와 미정 선택지를 구별한 질문 준비만 완료했다. 가이드3/4/5 과거 제출 상태와 감사 결론은 보존한다.

Q01~07 전부 UNANSWERED, 추천안 미채택, G01~06 OPEN. 다음은 사용자 답변 후 후속 설계 범위 지정이다. 이번 질문 제출 뒤 정지하며 구현·STEP5A·병합·main 미수행이다.

## 사용자 결정과 후속 설계 판단 — 2026-10-04

[사용자 결정](step-4b-user-decisions.md)을 `244fc33a3b58765821a15aa831ecd0ed1f7b645f`로 먼저 보존했다. [후속 판단](step-4b-followup-judgment.md)은 G01/G06 → G02 → G03 → G04 → G05 순서로 제출한다. [공식 근거·비용](step-4b-followup-sources-cost.md), [검증](step-4b-followup-validation.md), [CP0052](../checkpoints/CP-0052-step-4b-followup-judgment.md). 위 UNANSWERED는 CP0050 당시 이력이다.

G01/G02/G04/G05 PARTIAL/OPEN, G03 OPEN/BLOCKING, G06 두 Probe 적용만 SCOPED_DESIGN_RESOLVED. 전체 STEP4B/구현 HOLD. 담당 명칭은 역할 구분이며 이번 별도 모델/독립 감사 실행 증명이 아니다. 정식반영·구현·STEP5A·병합·main 없이 제출 뒤 정지.

## G03 후속 판단 — 2026-10-04

[권한 경계 판단](step-4b-authorization-boundary-judgment.md)·[근거](step-4b-authorization-boundary-evidence.md)·[검증](step-4b-authorization-boundary-validation.md)·[CP0053](../checkpoints/CP-0053-step-4b-authorization-boundary.md). 입력 ffd536e 고정. G03 두 안 비교→G02/G04 정합화→G01/G05 증거를 제출했다. 한국 중심·Probe1 최소 종료 기록 사용자 선택 추가. A 참조안/저빈도 우선, B 조건부 HOLD; G03 OPEN/BLOCKING과 전체 완료 HOLD 유지. 정식반영·구현·STEP5A·병합·main 없이 정지. 이전 제출/감사는 당시 이력이다.

## 구현 전 조건·사용자 결정 구체화 — 2026-10-04

[조건·질문](step-4b-preimplementation-conditions.md)·[근거/비용](step-4b-preimplementation-evidence.md)·[검증](step-4b-preimplementation-validation.md)·[CP0054](../checkpoints/CP-0054-step-4b-preimplementation-conditions.md). 고정 입력1218136/CP0053. 사이트 소스153파일 확인과 A의 writer/보호연산 조건, G02/G04 상태 전이, G01 수치 후보, G05 제품·지역·가격, Q01~06을 제출한다.

G03 OPEN/BLOCKING, G01/G02/G04/G05 PARTIAL/OPEN, G06 두Probe 범위 판단만 해소 유지. 추천 미채택/실행NOT_RUN/전체완료HOLD. 다음은 사용자 정책·자료 확인 후 Sol 근거 수집→Astra 핵심 판단 역할로 이어가되 별도 요청 범위에서 수행한다. 정식반영·구현·STEP5A·병합·main 미수행. 이번 역할 표기는 별도 모델 실행 인증이 아니다.

## 추가 결정 선보존·Sol 근거 준비 — 2026-10-05

고정 입력 CP0054 / `c51d74f06caa2e8d76b2ba206e9446e749864126`. [추가 결정](step-4b-additional-user-decisions.md)·[CP0055](../checkpoints/CP-0055-step-4b-additional-decisions.md)을 `2e0f4dd092f6d96c9e0e7051660d4538d8f7fce4`로 먼저 원격 보존하고 exact read-back했다.

| 담당 | 상태 | 다음 책임 |
|---|---|---|
| Work Sol | EVIDENCE_PREPARED_FOR_ASTRA | [G03 지원/미확인](step-4b-free-seoul-authorization-evidence.md)·[Free 서울 비용/backup](step-4b-free-seoul-cost-backup-evidence.md)·[검증](step-4b-free-seoul-evidence-validation.md)·[CP0056](../checkpoints/CP-0056-step-4b-free-seoul-evidence.md) 원격 제출 후 정지 |
| Work Astra | FOLLOWUP_NOT_STARTED | 최종 제출 SHA 고정 후 외부 C/P·Auth 철회 경계, pause/terminal/restore 정합성, Free/비용/backup 조합 핵심 판단 |
| 후속 구현/시험 담당 | NOT_STARTED/HOLD | 별도 허용 범위에서 실 적용 SQL·SDK·경합·부하·모바일·restore 증거 확보. 이번 작업에서는 실행하지 않음 |

사용자 목표 채택과 실제 지원 완료를 분리한다. G03 OPEN/BLOCKING, G01/G02/G04/G05 PARTIAL/OPEN, G06 두 Probe 적용 판단만 해소 유지. 이 역할 표기는 Astra 모델/독립 감사 실행 인증이 아니다. 정식반영·구현·STEP5A·병합·main 미수행.

## Free 서울 핵심 설계 후속 판단 — 2026-10-05

입력 CP0056 / `0faf2f48b52b4dcaaa0e616a79c34b89ced7583c` 고정, 시작 PR HEAD 일치. [후속 판단](step-4b-free-seoul-design-judgment.md)·[근거/계산](step-4b-free-seoul-design-evidence.md)·[검증](step-4b-free-seoul-design-validation.md)·[CP0057](../checkpoints/CP-0057-step-4b-free-seoul-design-judgment.md).

| 담당 성격 | 상태 | 다음 책임 |
|---|---|---|
| Astra 구조 판단 | FOLLOWUP_DESIGN_JUDGMENT_SUBMITTED | A 기준 유지, 외부 C/P·managed Auth 미증명에 따른 HOLD, pause/기록/복원/삭제와 품질·비용 조건 정합화 |
| 사용자 정책 | DECISION_PENDING | UQ1 기산/탈퇴 연결·UQ2 복구운영·UQ3 복구점 이력. 추천 미채택, UQ4는 실견적 후 |
| Sol 근거 준비 | NEXT_NOT_STARTED | 운영 writer/GRANT·SDK 버전·지원 경계·quota/backup 범위 및 시험/복원/삭제 명세. 읽기 전용 범위 |
| 구현·실행 시험 | NOT_STARTED/HOLD | 별도 허용 단계에서만 수행. 공통 runtime 선행 구현 금지 |

역할 명칭은 작업 성격이며 별도 모델/독립 감사 실행 인증이 아니다. G03 OPEN/BLOCKING, G01/G02/G04/G05 PARTIAL/OPEN, G06 두 Probe 적용 판단만 해소 유지. 전체 STEP4B IN_PROGRESS/구현 HOLD. 이번 판단 제출 후 정지하며 정식반영·구현·STEP5A·병합·main 없음.

## G03 읽기 전용 근거·시험/복원/삭제 명세 — 2026-10-05

고정 입력 CP0058 `882bc485d1b45cf40b9eb4dbc18a724de01440dc`, 시작 PR HEAD 일치. [CP0059](../checkpoints/CP-0059-step-4b-support-specification.md)·[근거](step-4b-support-readonly-evidence.md)·[시험](step-4b-verification-specification.md)·[복원/삭제/비용](step-4b-recovery-deletion-cost-specification.md)·[검증](step-4b-support-specification-validation.md).

| 담당 성격 | 현재 상태 | 다음 책임 |
|---|---|---|
| Sol 근거·명세 | SUPPORT_SPECIFICATION_PREPARED | 연결metadata 읽기 및 공식 지원/미확인·T01~14/B01~07 준비 제출 후 정지. 행동·복구 시험 미실행 |
| Astra 핵심 판단 | FOLLOWUP_NOT_STARTED | 외부C/P/R·egress fence·복원 현재권한·삭제/7일복구점·RPO 일정/품질/비용 조건 판단. 기술 선택을 사용자에게 전가하지 않음 |
| 사용자 운영 정보 | INFORMATION_PENDING | 대응 요일/시간,가능한 비밀없는quota/청구/기존소비,지원 단말 목록. UQ1~3 CP0058채택 유지 |
| 구현·시험 담당 | NOT_STARTED/HOLD | 별도 허용 단계에서 명세/고정버전·실제경합/부하/모바일/복구/삭제/비용 증거 확보 |

위 과거 상태는 당시 이력으로 보존. 역할명은 성격이며 별도 모델/독립 감사 실행 인증 아님. G03 OPEN/BLOCKING·G01/02/04/05 PARTIAL/OPEN·G06 두Probe 적용 판단만 해소, STEP4B IN_PROGRESS/구현 HOLD. 이번 제출 뒤 정지하며 정식반영·구현·실제시험·STEP5A·병합·main 없음.

## CP0059 지원 근거 기반 핵심 판단 — 2026-10-06

입력 CP0059 `8af1029ab1aefeda1081b86e8d83faa2509a13d9`, 시작HEAD일치. [CP0060](../checkpoints/CP-0060-step-4b-support-design-judgment.md)·[판단](step-4b-support-design-judgment.md)·[명세보완](step-4b-support-specification-amendments.md)·[근거/비용](step-4b-support-design-evidence.md)·[검증](step-4b-support-design-validation.md).

| 담당 성격 | 상태 | 다음 책임 |
|---|---|---|
| Astra 구조 판단 | SUPPORT_DESIGN_JUDGMENT_SUBMITTED | A/DB저빈도유지·독립R/외부C/P한계·T/B보완·archive/주기조건부추천 제출뒤정지 |
| Sol 증거 확보 | NEXT_NOT_STARTED | 실제writer/actor·exactSDK/Auth/CLI·공식최종경계지원·meter/운영시간/단말·사본inventory/consistent cut. 문의전송미허용 |
| 사용자 운영 정보 | INFORMATION_PENDING | 구체대응요일/시간·공백대응,가능한비밀없는meter/청구·지원단말. 확정정책재질문없음 |
| 구현·실제 시험 | NOT_STARTED/HOLD | 별도허용단계에서관측점/고정버전·T01~14/B01~07실행증거. STEP6전runtime선행구현금지 |

과거분담은당시이력보존. 역할명은작업성격이며별도모델/독립감사인증아님. G03 OPEN/BLOCKING·G01/02/04/05 PARTIAL/OPEN·G06두Probe적용판단만해소. STEP4B IN_PROGRESS/구현HOLD. 정식반영·구현·실제시험·STEP5A·병합·main없이제출뒤정지.
