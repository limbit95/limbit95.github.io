# CP-0063 — STEP4B G03 집중 지원 근거

- 2026-10-06 KST. 고정 입력/시작 PR HEAD CP0062 `89a0a013a1e6324b205a37abee1d450a1ce78179` 일치, 추가 변경 0. 기존 branch `docs/game-platform-vnext-phase4b-evidence-preparation`, PR412 OPEN/Draft/미병합, base `feature/game-platform-vnext-integration`, integration `3aeae1dfcce7788f88e706dcd49d283b91b67e82` 유지.
- [G03 집중 근거](../artifacts/step-4b-g03-focused-support-evidence.md): Q1 명시적 JWT 철회 제약 확인; Q2 모든 R와 최종 C/P 지원 계약 미확보; Q3 필요한 답변/버전/writer/관측점/실행 자료 특정. F63-01~12/M63-01~05로 확인 수준을 구분했다.
- 공급자 공개 소스의 /user session 부재 거절 정의를 추가 확보했다. 이는 managed 설치 버전·전체 만료 조건·최종 외부 C/P fence 보장이 아니다. getUser/getClaims/getSession의 지원 범위를 구별한다. 반복 fingerprint/운영 metadata 재조회 0, 문의 초안만 작성/미전송.
- [검증](../artifacts/step-4b-g03-focused-support-validation.md). 신규 3/수정 2 총 5경로만 제출한다. 과거 판단/감사/명세/checkpoint/metadata·DECISIONS·정식 산출물·코드/SQL 보존. 실제 채택/변경 결정 없음. 역할명은 작업 성격이며 별도 모델/독립 감사 인증이 아니다.
- 다음 Astra: 현재 후보의 채택 가능/HOLD 또는 목표를 유지한 구체적 구조 대안을 판정한다. 지원 답변이 필요하면 M63-01/02로 특정하고 같은 자료 수집을 반복하지 않는다. 알고리즘·제품 선택을 사용자에게 전가하지 않는다. 구현/경합 시험은 별도 허용 단계다.
- A안 안전성·저빈도 DB 우선 및 확정 품질/비용/모바일/보존/복구/삭제 요구 유지. 권한 불명 즉시 보호 입력/정보 제공 차단 → 판 일시정지 → 최초 장애부터 60초 내 복구 실패 중단; 인가 유예 아님.
- G03 OPEN/BLOCKING, G01/G02/G04/G05 PARTIAL/OPEN, G06 두 Probe 적용 판단만 SCOPED_DESIGN_RESOLVED. STEP4B IN_PROGRESS / 전체 완료·구현 HOLD. 행동 시험 NOT_RUN.
- 실제 제출 SHA·원격 5파일 exact 대조·전체 tree/PR HEAD/body/자동 CI 확인 결과는 제출 후 PR412 설명과 최종 보고에 기록한다. 정식 반영·구현·실제 시험·권한 변경·job/dump/복원·STEP5A·병합·main 없이 제출/확인 뒤 정지한다.
