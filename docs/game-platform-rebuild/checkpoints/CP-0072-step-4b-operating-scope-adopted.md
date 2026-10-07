# CP-0072 — STEP4B 운영 장애 범위 사용자 결정 보존

- 2026-10-07 KST. 고정 입력/parent CP0071 `ef4676cedccbe23205f687fe958d82cf3ad24f00`, tree `9bdcb6638923aa33db7e5ff0bd1314a14fb6b702`. 시작 PR412 HEAD 일치/추가변경0. 기존 branch/OPEN Draft/미병합/base integration `3aeae1dfcce7788f88e706dcd49d283b91b67e82` 유지.
- [사용자 결정/후속 범위](../artifacts/step-4b-operating-scope-user-decision.md)와 [D0008](../DECISIONS.md): CP0071 선택1 명시 채택. 예외 없는5초를명시한 운영 범위로 변경, 최종 검사 후 장시간 정지의 late C/P 및 expiry/인지 실패/60초 한계 수용. 의도적 유예·새 무권한 허가·일반 장애 사후 예외·percentile 전환 아님.
- D0007 부분 대체, D0006/다른 기본 보호 유지. D0001~07 원문과 CP0071 당시 C 판단·과거 명세 보존. 제품/알고리즘/주기/Auth 교체·정확한 운영 기술 경계 자동 채택 없음.
- 다음 담당 **Astra**, 작업 하나: S1·writer/cascade·DB/gate·old owner·운영 범위와기존 게이트 설계 잔여/실행 의무 및 정식 계약/계획 정합화 범위 통합 판단. 동일 Sol 조사/문의 기본 경로 없음.
- [검증](../artifacts/step-4b-operating-scope-decision-validation.md). 신규3/수정3 총6경로, 결정/검증/CP0072 추가·DECISIONS/CURRENT/분담 갱신. 로컬 검사 후 expected-head/non-force 제출 및 원격 내용/범위/PR HEAD 확인; SHA/결과는 PR 설명·최종 보고에 기록.
- G03 OPEN/BLOCKING; G01/G02/G04/G05 PARTIAL/OPEN; G06 두 Probe 적용만 SCOPED_DESIGN_RESOLVED. STEP4B IN_PROGRESS/전체 완료·구현 HOLD. 실행/오픈 승인 없음, 행동 NOT_RUN. 다른 목표 불변.
- 추가조사·운영조회·권한변경·문의0. 정식 산출물/루트계획/코드/SQL 불변. 정식반영·구현·실제 시험·job/dump/복원·STEP5A·병합·main 없이 원격 확인 뒤 정지.
