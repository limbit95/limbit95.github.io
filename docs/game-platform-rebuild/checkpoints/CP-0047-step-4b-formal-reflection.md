# CP-0047 — STEP4B 가이드4 정식 반영

- 사용자 2026-10-04 KST 요청: 핵심 판단 SHA `ddfa7a5e226fe0c5f62779a19b708ca0802899ce`를 입력으로 판단 전체·선택/보류 사유·G01~06 조건 정식 반영만
- 실제 원격 복원: PR412 OPEN/Draft/merged=false, head가 입력 SHA와 일치. base/integration `feature/game-platform-vnext-integration` @`3aeae1dfcce7788f88e706dcd49d283b91b67e82`; 기존 branch 유지
- [이전 CP0046](CP-0046-step-4b-judgment-submitted.md), AGENTS/계획1.3/기록README/CURRENT/DECISIONS·고정 판단 원문을 재조회. 로컬117파일과 실제tree941 entries/truncated=false의 blob 일치
- 판단 원문은 불변. J01~06 [모델 품질](../artifacts/step-4b-runtime-sync-contract.md), J07~09 [권한/사이트](../artifacts/step-4b-security-site-contract.md), J10~13 [실행/운영](../artifacts/step-4b-execution-operations-decisions.md), 입력/충돌/당시 제출 경계는 [미결정/후속](../artifacts/step-4b-risks-and-followup.md)로 전체 반영
- 원문 전체5블록·J13절·G6행·H10행·11안전성 대응과 선택/보류 조건을 [trace](../artifacts/step-4b-contract-source-trace.md)로 추적; 축약 재판단 없음
- 미해소: G01~06 OPEN, 제품/SDK/배포/transport/비용 미확정, 실제 지원 검증 미수행
- 이 CP는 반영 과정 이력이며 정식 제출 상태/정지는 [CP0048](CP-0048-step-4b-formal-submitted.md)에 기록. 가이드5 감사·구현·STEP5A·병합·main 미수행
