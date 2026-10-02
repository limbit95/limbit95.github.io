# STEP 4A — 가이드3 판단 제출 검증

범위: 시작 PR411 head `f8bcce80c2942a5c7f8d73a2c3fd41b326729d86` 이후의 판단/원본/기록. 기존 준비 검증이나 STEP3 이력을 덮어쓰지 않는다.

## 실행 검증

- 원본: 사용자 첨부와 보존 파일 bytes 동일, 35368 bytes, SHA256 `7d51370677e5e351a43655e92d07ff8e1e7d2cbc32d2badb7bee1b603f404927`, Git blob `b034af1639ae3c94c80373623f856c48517c0c9d`.
- 고정 source trace 33개 blob/줄 범위와 선택 조항 10개 원문 일치, 새 문서의 E참조 유효 범위 확인.
- 이번 변경 문서 9개 상대 링크90개·표15개 열수·끝 공백, CURRENT 22상태·과거 상세 이력 보존 검증. STEP4A IN_PROGRESS, 후속 단계 NOT_STARTED 유지.
- 순수 `validatePullRequestChanges`로 변경 경로 분류 오류0. **전체 Governance Guard PASS 아님**. 선택 source materialization 환경이며 전체 Git checkout과 저장소 상태 검사를 수행하지 않았다.
- 원격 tree read-back에서 시작 head 대비 CURRENT/분담 수정2 + 원본/판단/원문 검토/검증/CP0033~35 추가7 외 변경·삭제가 없는지 확인한다. 최종 원격 검증 결과는 PR411 설명의 실제 SHA와 사용자 보고에 기록한다.

## 의미 검토

[판단](step-4a-astra-judgment.md) §2~4의 책임 표/금지 의존/규칙 연결과 §5~9의 수명/채택·T01~03 전 경로·roomless/장기 상태·snapshot 공존·회귀/후속을 대조했다. 사고 실험 검토 완료이며 실행 테스트 PASS가 아니다. 조사 [원본](step-4a-auxiliary-research-report.md)과 [선택 원문 검토](step-4a-research-verification.md)를 분리하고 listener 식별 재사용 제한을 판단에 반영했다.

## 미실행

runtime/unit/build/DB/browser/production/전체 Guard **NOT_RUN** — 판단과 기록만 변경하는 범위, 실행 지원 입증 요청이 아니다. package에 lint/typecheck script 없음. CI는 최종 SHA의 workflow/check를 조회하여 결과0이면 **NOT_TRIGGERED**로 보고하며 PASS로 표시하지 않는다.

과거 STEP3 전체 integration 엄격 공백 검사의 조사 원본 Markdown 끝2공백12곳 FAIL은 역사적 기록 그대로다. 이번 변경9문서 공백 검사와 혼동하지 않으며 과거 FAIL을 해소했다고 주장하지 않는다. 가이드4의 정식 반영·검증은 별도 미수행이다.

## 검증 과정의 정정

첫 로컬 hash 검사는 materialization 시 규칙2개와 Guard source 끝에 추가된 개행 때문에 실패했다. 고정 integration 원문을 다시 받아 마지막 개행까지 복원한 뒤 source33/조항10·상대링크90/표15/상태22·보호된 로컬 source hash 검사가 오류0으로 통과했다. 이 세 파일은 원격 변경 대상에 포함하지 않는다. 순수 변경분 분류도 오류0을 재확인했다.
