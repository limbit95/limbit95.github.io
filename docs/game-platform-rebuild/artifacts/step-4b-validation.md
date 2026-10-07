# STEP 4B — 가이드4 정식 반영 검증

## CP0075 현재 적용 검증

[CP0075 검증](step-4b-z1-closeout-validation.md)과 [결정/설계 종료 확인](step-4b-z1-decision-and-design-closeout.md)을 현재 범위로 적용한다. D0010·A/C/P 구분·정식6문서·계획1.5·기록 및14경로의 내용/범위/원격 일치를 검증한다. CP0074와 아래 과거 PASS/HOLD/줄번호는 당시 이력이다.

설계 산출물 완료/STEP4B REVIEW_PENDING, Z1 SCOPED_DESIGN_RESOLVED. 사용자 결과 검토·병합 승인은 별도다. 행동 시험 NOT_RUN이며 문서/정적 검사로 실행·오픈을 승인하지 않는다. 이번 새 가격/metadata/공급자 조사와 운영 변경은 없다.

## CP0074 현재 정식 검증 범위

[새 검증 기록](step-4b-design-finalization-validation.md)과 [구체 설계](step-4b-design-finalization.md)를 적용한다. 아래 PASS/NOT_RUN/당시 원문 줄번호는 가이드4 이력이며 CP0074의 행동 시험 결과가 아니다.

검사 대상은 정식6문서의 현재 적용 절, 구체 설계/근거/검증/CP0074, DECISIONS/CURRENT/분담, 계획1.4·기록 README다. 기존 원문 블록은 보존하고 추가 적용 절로 supersedes 관계를 명시한다. 원격 입력 tree 대비 허용 경로·링크/표/공백·22단계 상태·Governance 검사와 read-back을 수행한다.

실제R/commit C/send P·clock 오차를 계측하지 않았으므로 권한·5초·성능·복원·삭제는 모두 NOT_RUN이다. Z1은 필수 설계 잔여, 실행/배포 manifest와 비용 측정은 별도다. 새 lookup metadata는 SELECT2개이며 전수 writer/원자 snapshot/운영 적용 증거가 아니다. 이번 검증은 STEP4B 완료나 오픈 승인이 아니다.

## 최초 정식 반영 이력 — 이하 원문 보존

검증 대상은 정식 설계 문서와 진행 기록이다. 고정 입력 SHA `ddfa7a5e226fe0c5f62779a19b708ca0802899ce`, 판단 blob `bd4c5b4991921c17d74bd99ef275819e4ae046f5`. 후속 독립 사후 감사·실제 제품/보안/복구 지원 검증과 구별한다.

## 재현과 검사 범위

1. PR412 OPEN/Draft/미병합·기존 head/base, 승인 integration과 CURRENT/CP0046을 재조회한다. 이번 입력 HEAD/tree에 로컬117파일 blob을 대조했다.
2. [반영 trace](step-4b-contract-source-trace.md)의5블록을 입력에서 분리하고 정식 문서의 같은 본문과 UTF-8/개행 포함 exact equality·SHA256을 비교한다. 서로 겹치지 않는 블록을 다시 조합하면 입력 전체와 일치해야 한다. 각 J01~13의 제목/본문/표도 개별 exact 비교한다.
3. J12의 G01~06과 J13의 H01~10 모든 행, J06의11안전성 행을 그대로 반영했는지 확인한다. 미결정 문서의6게이트는 OPEN이며 제품/transport/배포·가격·성능/복구를 새로 확정하지 않는다.
4. 문서의 끝개행·공백·상대 파일 링크·표 열·source/target 줄 범위를 검사한다. 원본 조사와 판단·기존 검토/trace·과거checkpoint는 새 변경 대상에서 제외하고 blob 동일성을 검사한다.
5. B01~44/36source파일·Governance22입력 blob을 실제 HEAD inventory와 대조한다. CURRENT22상태는 4A COMPLETED, 4B IN_PROGRESS, 5A 이후 NOT_STARTED여야 한다.
6. 전체 원격 inventory와 기존 Registry/문서 입력으로 Governance 순수함수 RepositoryState·DocumentPolicy·PullRequestChanges(이번10경로·PR누적 범위)를 실행한다.
7. 원격 제출 후 이번10파일 exact read-back·tree 변경 경로/blob/mode/type·integration 불변·PR 상태를 재조회한다. 이 문서/CP0048까지 포함한 최종 SHA·tree·실제 결과와 CI는 PR본문과 제출 응답에 고정 기록한다.

## 로컬 검증 결과

**PASS / 오류0.** 입력 전체5블록·J01~13 exact 보존, G01~06·H01~10·11안전성 행 보존 확인. 문서10개·링크146·표13·CURRENT22상태 검사 통과. B44개/36source파일·Governance22입력 blob 일치, 허용10경로 외 기존 로컬115파일 불변. 이번10경로·PR누적24경로의 Governance state/policy/change 분류 오류0. 원본 조사 77,818 bytes와 SHA256 `270c224ff0e2c75f64c77fd9360b4bf79bfd538a3f1828a2157756d4a7b01f5d` 보존.

## 미실행·지원 해석

- runtime/unit/build/DB/browser/production·부하·철회 경합·장애 주입: **NOT_RUN**. 코드 변경 없는 가이드4 반영이며 H01~10은 향후 oracle다. source상 경계 관찰을 실제 정보 유출 재현이나 보안 PASS로 바꾸지 않는다.
- full checkout·Git 수집·Governance Guard CLI: **NOT_RUN**. 부분 materialization/원격 inventory와 순수함수 검증이다. git clean·전체 테스트 PASS로 표현하지 않는다.
- 새 외부 공식 원문/가격/SDK 확인·프로젝트 견적: **NOT_RUN**. 가이드3의 V01~12 선택 확인/판본 한계를 보존한다. 구현 전 재확인 조건은 유지한다.
- 독립 사후 감사: **NOT_STARTED**. 반영 completeness 검증은 감사 결론을 대체하지 않는다. G01~06 OPEN, 정식 승인·STEP4B 전체 완료·지원 완료·구현 착수 승인이 아니다.

원격 보존과 검증 확인 후 정지한다. 사후 감사·구현·STEP5A·병합·main 반영 미수행.
