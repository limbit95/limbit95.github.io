# STEP5A — 중복 방지 기준

- 상태: **APPROVED_JUDGMENT / FORMAL_RESULT_REVIEW_PENDING**. 사용자는 실제 Astra 핵심 판단과 이번 문서 반영·검증·원격 PR 제출을 명시적으로 승인했다. 정식 결과 최종 검토·STEP5A 완료·integration 병합·main 반영은 남아 있다.
- 직접 반영 입력: [실제 Astra 판단 원본](game-platform-vnext-step5a-astra-judgment.md) §5. 기준 commit `aabb7646c0cdfd6466f2195579dce54689c7b81c`. [원본 식별·source trace](step-5a-source-trace.md), [문서 검증](step-5a-validation.md).
- Sol/Codex는 승인된 판단을 다시 선택하지 않고 아래 원문 절을 그대로 반영했다. [Sol 근거](game-platform-vnext-step5a-evidence.md)는 사실 입력, [앞선 Codex안](game-platform-vnext-step5a-judgment-and-handoff.md)은 실제 Astra 판단보다 아래의 이력이다.
- 아래 원문의 ‘사용자 승인 전’, ‘이번 직접 읽기’, ‘현재 NOT_STARTED’, ‘다음 처리’는 Astra 작성 당시의 상태·행위다. 현재 승인/제출 상태는 이 헤더와 [CURRENT](../CURRENT.md), [CP0079](../checkpoints/CP-0079-step-5a-formal-submitted.md)를 따른다. 원문의 조건·미확인·제한적 보류는 그대로 유효하며 ‘그대로 연결’도 구현 지원 인증이 아니다.
- 행동 시험 **NOT_RUN**, 구현·실행·오픈 의무와 **UNKNOWN** 유지. 기존 Auth·게임 무이관, 계획1.5·STEP4A/4B·CP0075/D0010 유지. 실제 경로/API/수명 기법의 STEP6 동결이나 STEP5B 이후 착수 없음.
- G1~G5는 [선택표 §3](step-5a-common-module-selection.md#3-모든-분류에-적용하는-승인-요구), source ID는 [trace §9](step-5a-source-trace.md#9-source-trace와-추가-읽기-범위)를 참조한다.

## 5. 중복 방지 기준

| 기준 | 적용 판단 |
|---|---|
| 동일 본체의 판정 | 입력·권위·출력·실패·수명 의미가 같은 기능을 여러 곳에서 유지하면 중복이다. 파일명이나 wrapper 개수만으로 판단하지 않음 |
| metadata 출처 | 같은 ID/표시/route의 권위 출처를 두 군데 만들지 않는다. Core 실행 구성은 catalog의 복제본이 아니라 다른 최소 책임 |
| 최종 채택자 | 한 실행/model의 권위 상태·ordering·fresh LIVE·복구 deadline 최종 소유자는 하나. Snapshot/Reconnect/Access Adapter가 각각 독립 상태기를 소유하지 않음 |
| 정상 local 연결 | game ID·nickname/인원 정책·game join·DOM·곡/mode·게임 이벤트 연결은 허용. 도메인·표현은 local 유지 |
| Adapter 상한 | 형태/환경/설정 연결 및 기존 수명 계약의 소비까지. 새 권한·ordering·reconciliation·독자 수명 엔진이 필요하면 해당 owner의 신규 책임으로 명시 |
| 공통 보완 | Invite 등록/표시와 BGM 내부 수명 공백은 원래 공통 본체의 최소 보완 또는 입증 가능한 격리로 해결. 게임마다 수정 복제본을 만들지 않음 |
| 새 책임의 필요성 | 기존 기능이 없거나 의미가 달라 연결만으로 G1~5를 충족하지 못하는 지점을 밝힌다. ‘미구현’만으로 전체 새 엔진을 정당화하지 않음 |
| 현재/신규 병존 | 기존 import/API/RPC·게임 동작은 유지하고 신규 consumer만 새 선택 모델을 소비. 같은 consumer 안의 이중 권위 상태와 이중 파괴권은 금지 |
| 승격·동결 | 실제 반복·필요 근거 없는 Profile/범용 Shell/Sound engine을 만들지 않는다. 경로·클래스·공통 필드·수명 기법 동결은 STEP6 범위 |
| 기존 영향 절차 | 향후 CURRENT/shared 계약 실제 변경에는 기존 Governance의 영향 확인을 적용. MIGRATION_REQUIRED면 기존 게임 이관 대신 vNext 격리 재검토. 이번에 별도 감사 단계를 추가하지 않음 |

