# CP-0058 — STEP4B 보존·복구 추천안 사용자 채택

- 2026-10-05 19:39 KST. 사용자 “추천안”에 따라 직전 세 항목 UQ1~3의 추천 방향을 채택 기록.
- 입력/시작 HEAD CP0057 `4e2a351ed7958d3d8eecb4ca9b47347c6aedf0be` 일치. PR412 OPEN/Draft/미병합, 기존 branch/base 유지. integration `3aeae1dfcce7788f88e706dcd49d283b91b67e82`.
- [결정 원본](../artifacts/step-4b-retention-recovery-user-decisions.md): 최초 종결부터30일/탈퇴 본인 식별 연결 제거, 발견 후24h 수동 복구 목표/대응 가능 시간 명시, 최근7일 복구점 요구. 대응 요일/시간 값은 미확인.
- 30일 삭제 우선, 7일 full dump 추가 보존 예외 승인 아님. 복원성/삭제/권한 rollback·RPO24h 실제 지원은 미검증. 정책 채택만으로 게이트 해소하지 않음.
- 결정 원본·이 checkpoint 신규2/CURRENT 수정1의3경로만. 이전 CP0057까지·정식6문서·코드/규칙/계획/DECISIONS 보존.
- G03 OPEN/BLOCKING, G01/G02/G04/G05 PARTIAL/OPEN, G06 두 Probe 적용 판단만 해소. STEP4B IN_PROGRESS/구현 HOLD, 실행 NOT_RUN.
- 다음: Sol 실제 writer/지원 경계/quota/backup 및 시험·복원·삭제 명세 준비는 별도 후속 요청 범위. 예산 충돌UQ4는 실견적 후, 제품/알고리즘 선택 확대 없음.
- 원격 보존/3파일 read-back·실제 SHA는 제출 후 PR412본문에 기록. 이번 결정 보존 뒤 정지. 정식반영·구현·STEP5A·병합·main 없음.
