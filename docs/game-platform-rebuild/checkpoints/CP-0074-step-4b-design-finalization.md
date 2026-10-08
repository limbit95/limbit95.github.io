# CP-0074 — STEP4B 구체 설계·정식 계약·계획 정합화

- 2026-10-07. 고정 입력/parent CP0073 `e3aa3feaf945e472d73360d7f580f583b01ce648`, tree `ca40328ddefe2236d6b9ae168cf3f3c08d88d176`. 시작 PR412 HEAD 일치/추가변경0. 기존 branch/OPEN Draft/미병합/base integration `3aeae1dfcce7788f88e706dcd49d283b91b67e82` 유지.
- [구체 설계](../artifacts/step-4b-design-finalization.md): S-A private predicate/전용 EXECUTE·writer guard, S-B DynamoDB 분리 archive/current·generation·삭제/복원, S-C Free서울/Lightsail2GB/Scheduler/Lambda/SNS. native TLS memory BIO/send 선택과 호환·실패·실행 책임 명시. 운영 적용 아님.
- 정식 runtime/security/trace/risks/validation/execution-operations6문서 현 적용 절 및 T/B delta, 루트 계획1.4에 반영. 과거 본문/판단은 이력 보존. D0009 기술 선택 기록, D0006~08 정책 불변.
- **STEP4B 설계 종료 HOLD:** 남은 Z1은 최종 인가 뒤 일반 DB commit 지연의 실제 C deadline이다. D0008 정지 예외로 숨기거나 시험으로만 넘기지 않는다. B5는 저장 불능 시 closed/기록 미확정·재시작60초 초기화/허위 종결/30일 연장 금지이며 전체 저장소 무손실 보장 추가 없음.
- 다음 작업 하나: Z1의 이미 최종 인가된 transaction이 일반 저장 지연으로 늦게 완료될 수 있는 보장 변경을 수용할지 사용자 결정. 변경 추천은 PROPOSED_NOT_ADOPTED. 기술 선택·동일 Sol 조사·공급자 문의·새 감사로 되돌리지 않는다.
- [근거](../artifacts/step-4b-design-finalization-evidence.md)·[검증](../artifacts/step-4b-design-finalization-validation.md). catalog SELECT2개, 실사용자/비밀 조회0, 권한/리소스 변경0. 공식 가격/기능과 설계 추론·UNKNOWN·NOT_RUN 분리.
- 총15문서 경로 신규4/수정11. 로컬 정적 검증 및 expected-head 제출 후 remote exact read-back/tree/PR HEAD 확인. 제출 SHA/최종 검사 수치는 PR 및 최종 보고에 기록.
- G03 OPEN/BLOCKING; G01/G02/G04/G05 PARTIAL/OPEN; G06 두 Probe만 SCOPED_DESIGN_RESOLVED. 설계/실행/오픈 분리, 행동시험 NOT_RUN. 목표/단계22개/STEP6 전 구현 제한 유지.
- 구현·실제 시험·운영 권한 변경·문의·backup job·dump·복원·STEP5A·병합·main 없이 원격 확인 뒤 정지.
