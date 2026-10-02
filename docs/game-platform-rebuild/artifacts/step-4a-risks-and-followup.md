# STEP 4A — 충돌·회귀와 후속 미결정

- 상태: **정식 STEP4A 제출 산출물 / 검토 대기**. 가이드4 반영이며 사용자 승인·CURRENT 실행 규칙 변경·Target 동결·구현 지원 완료가 아니다.
- 직접 반영 입력: [Astra 판단 원문](step-4a-astra-judgment.md), 고정 commit `36ca5e0f7b4c37efedde8ba4b4ad0b55a2b3c3cd`, blob `b471f4c3c6a45976f2a08008d2263102886c6959`.
- Work Sol은 판단을 새로 결정하지 않고 아래 원문 절을 그대로 반영했다. 조건·제한·미확인·후속 책임을 보존했다.
- 추적: [정식 반영 trace](step-4a-contract-source-trace.md), [검증/재현](step-4a-validation.md). E번호는 S4A-E번호이고 S번호는 [Astra 선택 원문 검토](step-4a-research-verification.md)의 조사 출처다. Sol이 외부 원문을 이번에 재확인했다고 주장하지 않는다.
- 본문 원문의 “이번 미수행”, “3B에서 확인한다”, “IN_PROGRESS” 등은 **가이드3 작성 당시의 상태/분석 순서**로 보존했다. 현재 가이드4 반영 상태는 이 헤더·CURRENT·최신 checkpoint를 따른다. 본문의 가이드4 후속 행은 이번 반영 범위이고 그 밖의 후속은 미착수다.
- 사고 실험과 source 관찰은 실행 테스트 PASS가 아니다. 책임/채택의 의미 초안이며 구체 API·필드·물리 경로·모델 지원은 확정하지 않는다.

## 9. 충돌·회귀·후속 미결정

**3A↔3B 충돌 검토:** Core가 공통 유효 수명 의무를 소유하고 모델이 맥락 의미를 제공하며 소비자가 반영을 집행하는 배정으로 T01~03을 설명할 수 있다. viewer 경계는 보편 관전 기능을 추가한 것이 아니라 권한/정보 범위가 바뀌는 모델의 적용 조건이다. cleanup 안전성은 계획의 기존 공통 정리 의무를 구체화한 것이다. Core에 Room/host/DB/단일 tick/글로벌 current state/새 필수 필드를 추가하지 않았다.

**회귀 판단:** 새 필수 Core 전제 미발견, STEP2 즉시 회귀 불필요. 이는 승인 STEP3 판단과 일치한다. 후속 설계에서 선택표7축으로 표현 불가, 공통 수명 안전성 누락, 모든 게임에 새로운 전제 필요, hostless/비DB 의무를 면제해야만 성립하는 경우에는 STEP2 및 관련 규칙 판단을 다시 검토한다. 현행 §6과 §10B의 적용 조건은 합쳐 지우지 않는다. STEP3 S3-R01~07은 해결 완료로 닫지 않는다.

| 후속 | 남겨 두는 결정·필요 증거 |
|---|---|
| 가이드4 | 이 판단 전체의 조건/제한/미확인까지 정식 책임·수명 산출물에 반영하고 trace·diff·Governance를 검증. 이번에는 미수행 |
| 4B | 권위/권한 검사 시점, ordering·동등 version·중복·initial/live·복구·private/전송/캐시, backend 취소/비용, 비DB 의무의 동등 안전성 |
| 5A | 현행 coordinator/controller/adapter의 각 경로와 owner 분리 검토, 그대로 연결/Adapter/새 구현/local/보류 |
| 5B | Result 확정·정정·소비, Publication, Sound와 사이트 공용 자원 상세 |
| 5C | 관전/장르별 전환 UX·실제 적용 조건·테스트 요구 |
| 6 | 논리 계약의 정확한 API·필드·버전·물리 경로·문서 권위·최소 계약/보류·Target 동결 |
| 구현 단계 | 부분 초기화/cleanup 실패·반복 dispose·늦은 자원 획득·A→B→A·동등 version private 응답·모든 결과 경로의 실행 검증 |

**가이드3 핵심 판단 완료.** 책임 표·의존 금지·규칙 연결·수명/채택 조건·T01~03·roomless/장기 상태·기존 snapshot 공존·회귀/후속을 판단했다. 자료 수신을 완료 근거로 삼지 않았다. STEP4A 전체는 IN_PROGRESS이며 가이드4 정식 반영·STEP4B·최종 감사·결과 승인·병합은 수행하지 않는다.
