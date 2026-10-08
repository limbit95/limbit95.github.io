# STEP4B — CP0071 후보 채택 판단 검증

2026-10-07 KST. 입력 CP0070 `a89363cee72960e8fdbf08b8b2636f4358b207ab`, tree `359d9024260c5df79f0a2be78957645a658553b6`. 시작 PR412 HEAD 일치/추가변경0. [판단](step-4b-binding-adoption-judgment.md).

- 최상위 C는 primary pre-check→PG commit/Node/native send와 정지 모델에 한정. 모든 대안 불가능·공급자 명시적 비지원·실패 시험 실행으로 확대하지 않음.
- S1 조건부 연결/필수 부족과 S2 구조적 시간 경계 분리. 공급자 종합 SLA를 앱 구현의 필수 전제로 만들지 않음.
- process pause의 기존 요구와 whole-host/backend 등 확대 가정 구분. 추천 운영 범위 예외는 실질 정책 변경/미채택. 기존 D0006/D0007과 DECISIONS 그대로.
- 권한 조회 완료부터 freshness 재기산, known expiry 추가5초, 확인 실패 뒤 유예, 재연결5초와 외부철회5초 혼동 없음. 정책 후보의 in-progress 잔여 위험을 expiry/60초에도 숨기지 않음.
- 신규3/수정2 총5경로: 판단/검증/CP0071, CURRENT/분담. 과거 기록·정식 산출물·루트 계획·코드/SQL/DECISIONS 불변을 fixed tree blob 비교로 검사.
- 로컬 링크/표/공백/22상태·Governance state/policy/이번diff/누적diff 검사. 수치와 원격 exact read-back/tree diff 결과는 제출 PR 설명에 기록.
- 신규 운영 조회0·실사용자조회0·권한변경0·문의0. 기존 CP0070 공식 자료만 사용; 동일 조사 반복 없음.
- 행동·5초·경합·성능·복구·삭제 **NOT_RUN**. 정적 검사/자동 CI는 행동 시험 증거 아님.
- expected-head/non-force 제출 후 원격5파일 내용·범위·PR HEAD/body/base/상태 확인. 제출 SHA는 self-reference를 만들지 않고 PR 설명/최종 보고에 기록.

G03 OPEN/BLOCKING; G01/G02/G04/G05 PARTIAL/OPEN; G06 두 Probe 적용만 SCOPED_DESIGN_RESOLVED. STEP4B IN_PROGRESS/전체 완료·구현 HOLD. 다음은 사용자 보장 범위 결정 하나, 이후 작업 자동 진행 없음.
