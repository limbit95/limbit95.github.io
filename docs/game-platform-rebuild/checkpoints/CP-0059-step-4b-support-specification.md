# CP-0059 — STEP4B G03 지원 근거·시험/복원/삭제 명세 준비

- 2026-10-05 KST. 고정 입력/시작 PR HEAD CP0058 `882bc485d1b45cf40b9eb4dbc18a724de01440dc` 일치. PR412 OPEN/Draft/미병합, 기존 branch/base 유지. integration `3aeae1dfcce7788f88e706dcd49d283b91b67e82`.
- [지원/운영 근거](../artifacts/step-4b-support-readonly-evidence.md)·[metadata 원본](../artifacts/step-4b-operational-metadata-snapshot.json): Supabase 연결에서 Free·서울·PG17.6, 선택 함수/trigger/GRANT/RLS/FK/session read권한 확인. SELECT10개·12함수 정의, 회원/Auth 행·비밀정보 조회 없음. 실제 전수 writer/C/P/R 지원·SDK patch·월quota 미확인.
- [시험 명세](../artifacts/step-4b-verification-specification.md) T01~14와 CP0054 E01~12 연결. 사건 주입·C/P/R/owner/command/view/revision·합격조건·trace·담당 준비. 행동/부하/모바일 시험 NOT_RUN.
- [복원·삭제·비용](../artifacts/step-4b-recovery-deletion-cost-specification.md) B01~07,7일복구점/30일삭제/탈퇴/새incarnation/현재권한/RPO/RTO 명세와 부하별분리비용. 알고리즘 미선택·dump/job/restore 미수행. 운영시간·사용량 UNKNOWN.
- [검증](../artifacts/step-4b-support-specification-validation.md). 신규6/수정2 총8경로. CURRENT/분담만 진행사항 갱신, 과거 판단/감사/checkpoint·정식6문서·코드/SQL/계획/DECISIONS 보존.
- G03 OPEN/BLOCKING, G01/G02/G04/G05 PARTIAL/OPEN, G06 두Probe 적용만 SCOPED_DESIGN_RESOLVED. STEP4B IN_PROGRESS/전체완료·구현 HOLD. 실행 증거로 해소한 gate 없음.
- 다음은 Astra 핵심 지원/순서·fence·복원권한/삭제·주기/비용 판단. 사용자 필요한 정보만 대응시간/비밀없는usage·청구/단말목록. 실제 구현/시험은 별도 허용 단계.
- 원격 exact content/blob 대조와 실제 제출SHA는 PR412본문에 기록. 이번 제출 뒤 정지. 정식반영·구현·실제시험·STEP5A·병합·main 미수행.
