# STEP4B — CP0075 결정 반영·설계 종료 조건 검증

2026-10-07 KST. 고정 입력 CP0074 `abf44a4c0269cf69173ea5881d8697c948fab8db`, tree `4f076b178ce55de17a98c03eebd9daba6d4919fe`. 시작/제출 전 PR HEAD 대조, 추가 변경은 입력과 분리한다. [결정/종료 조건](step-4b-z1-decision-and-design-closeout.md).

- 사용자 채택 Z1을 D0010으로 추가하고 실제 C 완료 보장의 부분 변경임을 명시한다. 최종 인가·착수 A는 같은 DB finalizer/transaction의 보호 저장 진입이며 ingress allow/BEGIN/enqueue는 아니다. 새 retry/별도 transaction·P에는 예외를 상속하지 않는다.
- known expiry 전에 A를 지난 동일 transaction의 늦은 C만 수용한다. 초기 무권한/인지 실패 후 새 허가·무기한 사전 permit 금지, P5초·60초·각 재연결5초와 D0008 구분 유지.
- CP0074 S-A~C와 B5를 재선택/재조사하지 않는다. 필수 설계 잔여 Z1은 정책 반영으로 해소하며 실행 통과로 표시하지 않는다. 설계 산출물 완료, 계획§4.2 사용자 검토 때문에 단계 REVIEW_PENDING. COMPLETED·병합/오픈 승인은 아님.
- 정식6문서의 CP0075 적용 절, 계획1.5, README/CURRENT/DECISIONS/분담, 신규 결정·검증·CP0075가 변경 범위다. 과거 판단/시험 명세/checkpoint는 blob 불변, 정식6문서 기존 본문은 새 적용 절 뒤 보존한다.
- 문서 검사: 입력 tree 대비 허용 경로, 링크/표/공백, CURRENT22단계·4B REVIEW_PENDING·5A 이후 NOT_STARTED, 계획 blob/단계 순서, Governance repository-state/document-policy/이번diff/누적diff. 부분 checkout의 순수 검사이며 전체 CLI/사이트 행동 시험으로 표시하지 않는다.
- 원격 제출은 고정 parent와 expected-head/non-force로 진행하고 변경 파일 exact read-back·tree 변경 범위·PR HEAD/body/base/OPEN Draft/미병합을 확인한다. 완료 수치와 제출 SHA는 PR 및 최종 보고에 남긴다.
- 운영 metadata/가격/지원 문서 재조회0, 실사용자/비밀 조회0, 운영 변경0. 권한 경합/성능/복구/삭제 및 모든 행동 시험 NOT_RUN. 정적 검사를 행동 증거로 사용하지 않는다.
- 구현·구매·권한 변경·문의·job/dump/복원·STEP5A·병합·main 미수행. 제출 확인 뒤 정지한다.
