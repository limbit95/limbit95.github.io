# STEP4B — CP0074 정식 설계 반영 검증

2026-10-07. 고정 입력/parent CP0073 `e3aa3feaf945e472d73360d7f580f583b01ce648`, tree `ca40328ddefe2236d6b9ae168cf3f3c08d88d176`. 시작 PR412 HEAD 일치/추가변경0. [설계](step-4b-design-finalization.md)·[근거](step-4b-design-finalization-evidence.md).

- 사용자가 이번에 허용한 핵심 선택·정식6문서·루트 계획 개정1.4를 반영했다. D0009는 설계 수단 선택이며 D0006~08 정책 변경/리소스 구매/실행 승인이 아니다.
- S-A는 관측 ACL/RLS를 반영한 고정 definer 및 runtime 전용 EXECUTE, 전체 DML guard/관리 writer·Auth cascade의 분리를 명세했다. 두 catalog SELECT는 독립 관측이며 전수 writer/원자 snapshot/운영 적용 증거가 아니다. 실사용자/비밀·토큰 조회 없음.
- S-B는 구체 외부 transaction generation·분리 기록/link·삭제/현재권한·12h cut/검증/재시도·닫힌 복원을 선택했다. 전체 저장소 동시 상실까지 무손실 의무를 추가하지 않고, B5에 t0 초기화/허위 terminal/30일 연장 금지·범위 밖 손실 보고를 명시했다.
- S-C는 Free서울/Lightsail2GB/DynamoDB/Scheduler/Lambda/SNS를 선택했다. 환율/세금/기타USD4는 민감도/예산 설정이며 실청구 아니다. 가격/공급자 기능과 현재 계정·실제 지원을 분리했다.
- 최종 상태 **STEP4B IN_PROGRESS / DESIGN_FINALIZATION_HOLD**. Z1은 실제 PG commit의 일반 지연 경계다. D0008 장시간 실행 정지와 같다고 바꾸지 않았다. 정책 변경 후보는 PROPOSED_NOT_ADOPTED. NOT_RUN만을 이유로 HOLD하지 않았다.
- 신규4/수정11 총15경로: 설계/근거/검증/CP0074, 정식6문서, 계획, 기록 README, DECISIONS, CURRENT, 분담. 기존 정식6문서 원문은 현 적용 절 뒤 역사로 보존. 과거 checkpoint/판단/명세·코드/SQL·현재 rulebook은 입력 blob과 불변 비교한다.
- 정적 검증 범위: Markdown 링크/표/공백, CURRENT22상태, 계획 blob 및 단계 순서/STEP6 전 구현 제한, Governance repository-state/document-policy/이번diff/누적PRdiff. 부분 materialization 환경이므로 전체 CLI/전체 사이트 시험 실행이라고 하지 않는다. 실제 결과 수치는 원격 제출 설명에 기록한다.
- 권한·5초·성능·복구·삭제 행동 시험은 **NOT_RUN**. R/C/P 관측·clock·trace 누락은 INCONCLUSIVE. 문서 검사나 CI 성공으로 행동 PASS를 주장하지 않는다.
- expected-head/non-force로 기존 branch 제출 후15파일 exact read-back·tree 범위·PR HEAD/base/OPEN Draft/미병합을 확인한다. 제출 SHA 및 완료 수치는 self-reference 없이 PR/최종 보고에 남긴다.
- 구현·운영 권한 변경·문의·job/dump/복원·STEP5A·병합·main 수행 없음. 제출 확인 후 정지한다.
