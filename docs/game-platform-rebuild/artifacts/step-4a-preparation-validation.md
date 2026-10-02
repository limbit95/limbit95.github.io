# STEP 4A — 준비 검증과 한계

범위: Work Sol 모델별1번, 문서 준비. 고정 baseline `ad7655a051f0dbb13444eec6f469f6f98f9794f4`. 정식 수명 계약·실행 안전성 검증 아님.

## 실행 결과

| 검사 | 결과 | 실제 확인 내용 |
|---|---|---|
| 원격 상태 복원 | PASS | integration ref·PR410 merged·최종head compare ahead1/behind0/files0, vNext branches7개와 열린 PR4개 대조 |
| source trace | PASS | 33개 위치의 Git blob hash·원격 tree SHA 일치 및 줄범위 확인. 최초 검사에서 끝 빈줄을 포함한6범위 오류를 정정 후 재실행 |
| STEP1 조항 | PASS | 선택10행의 ID/원문/강도/분류/조건/후속 포함 전체 byte 일치·각1회 |
| 준비 링크·표 | PASS | 처음8파일 상대링크74개 존재(고정 원격 tree+이번 예정 파일), 표10개 열 정합. 최종 제출기록 포함 수치는 CP0032/read-back 참조 |
| CURRENT 상태·이력 | PASS | 22개 상태/0~3완료/4A IN_PROGRESS/후속 NOT_STARTED·과거 상세 절 불변 |
| 이번 공백 | PASS | 신규 문서 끝공백 없음·CURRENT 신규/교체 줄 확인. 과거 STEP3 전체 공백 FAIL을 이번 PASS로 대체하지 않음 |
| 원격 보호범위·tree·PR | 제출 후 확인 | CURRENT+이번 신규 문서만 tree 변경, blob 내용/branch HEAD/PR base·head·Draft read-back은CP0032 |
| Governance PR 변경 분류 | PASS | 실제 기존 validatePullRequestChanges 함수에9변경·동일 gameDirectories 대입, errors0. 전체 Guard와 구분 |
| 기존 Governance Guard | NOT_RUN | full checkout이 아닌 선택 source materialization. 순수 PR 변경 분류 검사는 별도 실행하며 전체 Guard PASS로 확대하지 않음 |
| runtime/unit/build/DB/browser/production | NOT_RUN | 코드·실행 계약·현재 규칙 변경 없는 문서 준비. 실제 T01~03 실행 없음 |
| lint/typecheck | NOT_AVAILABLE | package.json에 script 없음 |
| 원격 CI | 제출 후 조회 | 해당 SHA의 workflows/check-runs0은 NOT_TRIGGERED; CI PASS와 구분 |

## 재현

1. 고정 baseline Git tree와 source content를 조회해 `sha1("blob " + byteLength + NUL + UTF8content)`를 비교한다. trace 각 줄범위를 확인한다.
2. trace 선택10행을 승인 STEP1 platform 계승표의 동일 ID 전체 행과 비교한다.
3. 이번 Markdown의 상대 경로를 baseline tree+이번 제출 경로에 대조하고 fenced code 밖 table 열수를 확인한다.
4. CURRENT의22상태와 기존 '유지해야 할 실행 경계' 이후 역사 절의 byte 불변을 확인한다.
5. 최종 tree의 path→mode/type/blob map을 baseline과 비교해 허용 경로만 바뀌었는지 확인하고 이번 텍스트 끝공백을 검사한다.
6. branch ref·PR head와base/Draft/merged 및 workflows/check-runs를 최종 SHA에서 별도로 조회한다.

로컬 clone은 인증 credential 부재로 실패했다. GitHub 연결 API가 source 읽기와 tree/commit/ref/PR 저장을 수행한다. 로컬git clean·실제 fetch·전체 checkout·Guard 실행 결과를 꾸미지 않는다. 사고 실험의 준비는 실행 PASS가 아니다.
