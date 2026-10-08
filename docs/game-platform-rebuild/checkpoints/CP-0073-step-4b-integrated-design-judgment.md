# CP-0073 — STEP4B D0008 적용 통합 설계 판단

- 2026-10-07 KST. 고정 입력/parent CP0072 `2a48b3d1d3c5ffe7a64675051181b2efa6c86c81`, tree `3c4110fc543e90286ff6c9ec7a07d3e40ddb9b62`. 시작 PR412 HEAD 일치/추가변경0. 기존 branch/OPEN Draft/미병합/base integration `3aeae1dfcce7788f88e706dcd49d283b91b67e82` 유지.
- [통합 판단](../artifacts/step-4b-integrated-design-judgment.md): **조건부 채택 가능**, 기존 Auth+primary DB C+단일 통제 gate. native TLS memory BIO/nonblocking send 추천 후보·writer/owner·장애 범위/관측 연결. 완성 제품/운영 적용/상한 실행 보장 아님.
- D0008 정지 한계와 기본 장애 FAIL/관측불명 INCONCLUSIVE를 분리. CP0071 과거 C 판정 보존. 정확한 설계 승인 전 조건 S-A current predicate/최소권한/writer/cascade, S-B 복원독립원천/삭제·journal, S-C 제품/총비용 배치가 남음. E01~04 실행 의무와 구분.
- 다음 담당/작업 하나 **Sol/Codex 정식 계약·계획 정합화**. execution-operations J10~13까지 정확한 후속 범위 지정, 미해결조건 유지. 정합화만으로 STEP4B 완료 약속 없음. 동일 자료수집/문의/포괄감사 기본 경로 없음.
- [검증](../artifacts/step-4b-integrated-design-validation.md). 신규3/수정2 총5경로, 판단/검증/CP0073 추가·CURRENT/분담 갱신. 과거/DECISIONS/정식/계획/코드/SQL 보존. 로컬 검사 후 expected-head/non-force 제출·원격 내용/범위/HEAD 확인, SHA/수치는 PR/최종 보고.
- G03 OPEN/BLOCKING; G01/G02/G04/G05 PARTIAL/OPEN; G06 두 Probe 적용만 SCOPED_DESIGN_RESOLVED. STEP4B IN_PROGRESS/전체 완료·구현 HOLD. 행동 NOT_RUN. 다른 목표 불변.
- 공식 문서의 필요한 지원 기능만 제한 확인. 운영조회/실사용자조회/권한변경/문의0. 정식반영·구현·실제시험·job/dump/복원·STEP5A·병합·main 없이 원격 확인 뒤 정지.
