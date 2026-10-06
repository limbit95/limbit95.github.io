# CP-0069 — STEP4B CP0068 기준 G03 단일 설계 보완

- 고정 입력/parent CP0068 `f05043d8cb950eeda13a3decb10684669c04b887`, tree `ca52bcd565a2c0245c584db92a6e4eace26d05a4`. 2026-10-07 KST 시작 PR412 HEAD 일치/추가변경0. 기존 branch/OPEN Draft/미병합/base integration `3aeae1dfcce7788f88e706dcd49d283b91b67e82` 유지.
- [D0006/D0007](../DECISIONS.md) 적용. [설계 보완](../artifacts/step-4b-g03-practical-design-review.md): 기존 Auth/게임 보존·vNext DB 권위 C·통제 transport P를 조건부 추천. 외부 R 최대5초·신선도 시작점·실패 즉시 차단·재개/duplicate/owner/복원·T01~14 delta를 한 번 정리.
- 설계 논리 정리와 전체 승인 구분. S1 실제 predicate/최소권한/사이트 writer fence 연결, S2 deadline을 집행하는 DB finalizer/transport·old gate 수단이 설계 필수 부족. 마지막 확인 뒤 pause→늦은 C/P를 나중 시험으로 넘기지 않음. NOT_RUN만으로 전체 HOLD한 것이 아님.
- 공급자 문의/반복 자료 준비를 기본 경로로 재개하지 않는다. 다음 담당 Sol의 한 작업은 **S1/S2 실행 경계 바인딩 명세**. 구체 대응표와 가능/불가 판정으로 종료, 제품/알고리즘 정책 결정을 사용자에게 떠넘기지 않음.
- 이번 추가 사용자 정책 결정/제품·주기 채택 없음, DECISIONS 보존. 정식 계약/trace/risks/validation·계획1.3 정합화는 별도 후속 반영 범위. 과거 판단/감사/명세/checkpoint 보존.
- G03 OPEN/BLOCKING; G01/G02/G04/G05 PARTIAL/OPEN; G06 두 Probe 적용만 SCOPED_DESIGN_RESOLVED. STEP4B IN_PROGRESS/전체 완료·구현 HOLD. 설계 승인과 오픈 blocker는 분리하며 실행 지원 완료 주장은 없음.

## 검증·제출

- [검증 기록](../artifacts/step-4b-g03-practical-design-validation.md). 변경5경로: CURRENT/작업 분담 수정2, 보완/검증/이 checkpoint 신규3. 다른 blob/mode/type·DECISIONS/정식 산출물/루트 계획/코드/SQL 보존.
- 제출 전 링크/표/공백/22상태·허용 diff·Governance 검증, 제출 후 원격5파일·tree diff·PR HEAD/base/상태 일치 확인. 실제 결과/SHA는 PR 설명 및 최종 보고에 남김.
- 행동/경합/5초/성능/복구/삭제 NOT_RUN. 운영 metadata 재조회0. 정식 반영·구현·실제 시험·권한 변경·문의·job/dump/복원·STEP5A·병합·main 없이 원격 제출 확인 뒤 정지.
