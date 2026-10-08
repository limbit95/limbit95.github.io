# CP-0071 — STEP4B S1·S2 후보 채택 판정

- 2026-10-07 KST. 고정 입력/parent CP0070 `a89363cee72960e8fdbf08b8b2636f4358b207ab`, tree `359d9024260c5df79f0a2be78957645a658553b6`. 시작 PR412 HEAD 일치/추가변경0. 기존 phase4b branch/OPEN Draft/미병합/base integration `3aeae1dfcce7788f88e706dcd49d283b91b67e82` 유지.
- [판단](../artifacts/step-4b-binding-adoption-judgment.md): 최상위 **C**, 현재 pre-check→commit/send 후보는 after-check 정지를 포함하는 무조건5초 요구와 충돌. 모든 대안 불가능/공급자 명시적 비지원 아님. S1 잔여와 S2 한계, 기존 pause 요구/추가 장애 가정을 구분.
- 추천은 운영 장애 범위를 명시하는 실제 정책 변경 제안이며 **미채택**. 장시간 최종 검사 후 정지의 late C/P 위험을 숨기지 않음. D0006/D0007·DECISIONS 보존.
- 다음 담당/작업 하나: 사용자 보장 범위 결정. 동일 Sol 조사·문의 cycle 재개 없음. 승인 뒤에도 S1/집행 배치와 정식 계약 정합화가 필요하며 자동 STEP4B 완료 아님.
- [검증](../artifacts/step-4b-binding-adoption-validation.md). 신규3/수정2 총5경로, 과거/정식/루트계획/코드/SQL/DECISIONS 보존. 로컬 문서/Governance 검사 후 expected-head/non-force 원격 제출과 내용/범위/PR HEAD 확인. SHA/확인 결과는 PR 설명과 최종 보고.
- metadata/실사용자조회/권한변경/문의0. 행동·경합·5초·성능·복구·삭제 NOT_RUN.
- G03 OPEN/BLOCKING; G01/G02/G04/G05 PARTIAL/OPEN; G06 두 Probe 적용만 SCOPED_DESIGN_RESOLVED. STEP4B IN_PROGRESS/전체 완료·구현 HOLD. 다른 목표 불변.
- 정식 반영·구현·실제 시험·job/dump/복원·STEP5A·병합·main 없이 제출 확인 뒤 정지.
