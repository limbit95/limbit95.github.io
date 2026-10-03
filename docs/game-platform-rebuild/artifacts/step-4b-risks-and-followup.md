# STEP 4B — 미결정·충돌·후속과 제출 경계

- 상태: **정식 STEP4B 제출 산출물 / 사후 감사 대기 / STEP4B IN_PROGRESS**. 가이드4 반영이며 사용자 승인·현행 CURRENT rulebook 변경·Target 동결·구현 지원 완료가 아니다.
- 고정 입력: [Astra 판단 원문](https://github.com/limbit95/limbit95.github.io/blob/ddfa7a5e226fe0c5f62779a19b708ca0802899ce/docs/game-platform-rebuild/artifacts/step-4b-astra-judgment.md), commit `ddfa7a5e226fe0c5f62779a19b708ca0802899ce`, blob `bd4c5b4991921c17d74bd99ef275819e4ae046f5`.
- Work Sol은 아래 판단 본문 전체를 그대로 옮겼다. 선택·보류·사유·조건·미확인·후속 책임을 축약하거나 새로운 선택으로 바꾸지 않았다. J번호는 판단 절, B번호는 [저장소 근거](step-4b-source-trace.md), V번호는 [기존 선택 원문 검토](step-4b-research-verification.md)다.
- [전체 반영 trace](step-4b-contract-source-trace.md), [미결정·충돌·후속](step-4b-risks-and-followup.md), [정식 제출 검증](step-4b-validation.md)을 함께 읽는다. 다른 절 연결은 [모델 품질](step-4b-runtime-sync-contract.md)·[권한/사이트](step-4b-security-site-contract.md)·[실행/운영](step-4b-execution-operations-decisions.md)에서 찾는다.
- 본문의 “이번 판단/미수행/후속 STEP4B”, “정식 반영 필요”는 가이드3 작성 시점의 판단·조건으로 보존했다. 이번 완료는 **가이드4 문서 반영**뿐이다. G01~06은 미해소이며 모델/제품 지원 PASS, STEP4B 전체 완료 또는 후속 구현 허용으로 승격하지 않는다.
- 공식 원문 확인/가격은 가이드3 확인 이력의 재사용이다. 이번 새 browsing·견적·배포·runtime/DB 검증은 수행하지 않았다. 구현 전 제품/가격/버전 확인 조건을 유지한다.

## 현재 미해소 상태

G01~06의 원래 조건·책임·닫힘 기준은 [실행/운영 J12](step-4b-execution-operations-decisions.md)에 원문 전체로 반영했다. 아래 연결표는 탐색용이며 원문 조건을 대체하지 않는다. **모든 게이트 OPEN / 미해소**다. 설계 방식 승인과 실제 지원 검증을 별도로 추적한다.

| 게이트 | 판단/계약 연결 | 이번 상태와 후속 경계 |
|---|---|---|
| G01 품질 목표 | J03/J10/J11/J12/H01/H09 | 수치 미입력; 후속4B 요구·기준 승인 전 비용/성능 충족 판정 금지 |
| G02 handoff/recovery | J02/J03/J04/J12/H01/H02 | 실제SDK/프로토콜·실험계획 미확정; 구현 검증 전 복구 지원 PASS 금지 |
| G03 권한/private | J04/J07/J08/J09/J12/H04~06 | auth bridge·철회/cache/in-flight 미해소; private stream 채택 금지 조건 유지 |
| G04 영속/owner | J02/J04/J12/H07 | durability/RPO/RTO/fencing 미확정; graceful 종료를 crash 복구로 대체 금지 |
| G05 실행/transport/비용 | J10/J11/J12/H09 | 제품/SKU/SDK/배포·견적 미확정; 구현 전 후속4B 선택/보류 갱신 승인 |
| G06 현행 규칙 충돌 | J06/J12/H10 | hostless/roomless 재대결과11개 의무의 적용 검토·필요 상위승인 미수행 |

## 정식 반영과 후속 단계

이번 제출은 승인된 STEP4A 수명과 현행 안전성 의무에 대응하는 설계 초안을 문서화한다. 현행 개발/DB/UI 규칙·Registry·Guard·출시 상태·기존 게임 코드는 변경하지 않는다. 이 반영 자체로 현행 규칙 충돌이 해소되지 않는다. G06에 해당하는 모델을 선택하려면 명시된 상위 검토/영향 감사·승인이 필요하다.

가이드5 사후 감사는 이후 사용자가 지정하는 **이번 정식 최종 PR HEAD**에 고정한다. 입력 판단 SHA와 정식 제출 SHA를 구별한다. 감사에서 source/내용 보존·Core 확대·보드 전제 강제·의무 약화·지원 과장·보류 승격·사이트 권한 공백을 검토해야 한다. 이번에는 감사 결론을 미리 만들지 않는다.

STEP5A 기존 모듈 재사용, STEP5B Result/Publication/Sound 상세, STEP5C 장르 규칙, STEP6 API 동결은 미착수다. 이 문서 연결은 후속 업무를 허가하는 지시가 아니다. G01~06을 STEP6의 이름 선택만으로 해소하거나 모든 공백을 후속 단계로 넘기지 않는다. 다음 행동은 사용자 범위 지정 후 가이드5 사후 감사다.

## 가이드3 입력·판단 방법 원문 보존

이하 두 블록은 가이드3 당시 상태까지 그대로 보존한 이력이다. 당시 “가이드4 미완료”는 이번 현재 상태가 아니며, 현재는 이 헤더·CURRENT·CP0048을 따른다. 설계 보류와 실행 미검증은 여전히 유지된다.

# STEP 4B — Work Astra 핵심 판단

상태: **GUIDE_ORDER_3_JUDGMENT_SUBMITTED / STEP4B IN_PROGRESS**. 2026-10-03 사용자 요청 범위의 설계 판단이며, 정식 산출물 반영·독립 사후 감사·구현·승인이 아니다. 역할은 작업 책임을 뜻한다. 기존 PR412와 STEP4B branch를 이어간다.

입력: [보존 원본](step-4b-auxiliary-research-report.md), [출처 검토 V01~12](step-4b-research-verification.md), [저장소 근거 B01~44](step-4b-source-trace.md), [이번 판단 trace](step-4b-judgment-source-trace.md). 준비 HEAD `ce3426803cc7ac53da3ba38ac908778ae4423b30`, 승인 integration `3aeae1dfcce7788f88e706dcd49d283b91b67e82`. 원본 수신과 별개로 아래 순서대로 판단했다. **채택**은 설계 방향의 선택이며 실행 지원 PASS를 뜻하지 않는다. **보류**는 구현을 막는 조건과 닫힘 증거를 동반한다.


## 충돌 대조와 제출 경계

STEP4A의 생존/현재 의미/권한/순서 및 재검사 계약을 축소하지 않았다. Core에 새 전역 room/host/auth authority를 추가하지 않았고, 7축·선택모델·기존 게임 무이관 원칙을 유지했다. DB 11개 의무는 SQL 필드명과 구별해 계승했다. hostless 초기 시작 조건과 모든 멀티플레이의 현행 host 재대결 조건은 서로 다르므로 G06을 남겼다. 기존 구현 관찰에서 드러난 빈틈은 vNext 검증 조건으로 기록했으며 기존 게임 긴급 수정이나 현재 rulebook 변경으로 확대하지 않았다.

**완료:** 원본 보존·출처/범위/미확인 검토, 필요한 공식 원문 선택 확인, 3A→3B→3C 핵심 판단과 보류/추가 증거/닫힘 조건 제출. **미완료:** G01~06의 제품별 해소·실제 지원 검증, 가이드4 정식 산출물 반영, 가이드5 독립 사후 감사, 사용자 결과 승인. STEP4B 전체는 IN_PROGRESS다.

이번 판단 전체와 진행 기록을 PR412에 보존한 뒤 정지한다. 정식 산출물 반영·구현·STEP5A·병합·main 반영은 진행하지 않는다. 다음 작업은 사용자가 범위를 지정한 뒤에만 진행한다.
