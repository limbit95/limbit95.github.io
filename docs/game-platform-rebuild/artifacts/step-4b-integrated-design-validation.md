# STEP4B — CP0073 통합 설계 판단 검증

2026-10-07 KST. 입력 CP0072 `2a48b3d1d3c5ffe7a64675051181b2efa6c86c81`, tree `3c4110fc543e90286ff6c9ec7a07d3e40ddb9b62`. 시작 PR412 HEAD 일치/추가변경0. [통합 판단](step-4b-integrated-design-judgment.md).

- D0006~08 적용. CP0071 당시 C 판정은 보존하고 무조건 상한 반례를 새 요구의 불가능으로 재사용하지 않음. 기본 장애와 승인된 after-check 정지 예외를 구별, 일반 지연 사후 예외/percentile 전환 없음.
- 결론 조건부 채택 가능과 전체 설계 승인 전 S-A~C를 분리. 미확보 current predicate/최소권한/cascade·복원독립원천·제품/전체예산 조건을 E01~04 시험으로 넘겨 완료 처리하지 않음.
- native TLS memory BIO→앱 ciphertext queue→nonblocking send는 제한된 신규 구체 추천. 공식 BIO/send 기능과 조합 설계 추론/지원 미검증을 구분. 기존 Node write를 final P로 가정하지 않음. partial send/연결 종료·old gate 격리·clock/trace 한계 명시.
- 새 정책/제품/주기 채택 없음, DECISIONS 그대로. 최종 조건부 추천이며 운영 적용/실행 성공 아님. 추가 사용자 질문0, 운영조회/실사용자조회/권한변경/문의0.
- Supabase Sessions/PG GRANT/Node net 및 신규 바인딩에 필요한 OpenSSL BIO/Linux send 공식 문서를 제한 확인. 기존 가격/metadata 반복 조사 없음. 조회일과 출처는 판단 §6.
- 정식변경 범위에 execution-operations J10~13을 추가 특정: 기존 J12 gate와 다른 정식 문서의 충돌을 방지하기 위함. 이번 파일은 보존. 원본 T/B 명세는 후속 amendment 연결, 과거 source hash 재작성 없음.
- 신규3/수정2 총5경로: 판단/검증/CP0073, CURRENT/분담. 과거 기록·DECISIONS·정식 산출물·루트계획·코드/SQL fixed tree blob 불변 검사.
- 링크/표/공백/CURRENT22상태·Governance state/policy/이번diff/누적diff 검사. 결과 수치와 원격 exact read-back/tree diff는 PR 설명에 기록.
- 행동·5초·권한경합·성능·복구·삭제 NOT_RUN. 문서/정적 CI로 행동 통과 표시 없음. 실제 R/P·clock/trace 부족은 INCONCLUSIVE, 승인된 정지 한계는 별도 결과이지 PASS 아님.
- expected-head/non-force 제출 후 원격5파일 내용·변경범위·PR HEAD/body/base/상태 일치 확인. self-reference 없이 제출 SHA를 PR 설명·최종 보고에 기록.

G03 OPEN/BLOCKING; G01/G02/G04/G05 PARTIAL/OPEN; G06 두 Probe 적용만 SCOPED_DESIGN_RESOLVED. STEP4B IN_PROGRESS/전체 완료·구현 HOLD. 다음 Sol 정식 정합화는 별도 작업이며 이번 자동 진행 없음.
