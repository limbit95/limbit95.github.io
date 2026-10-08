# STEP 4B — 핵심 판단 제출 검증

대상은 가이드 순서3 판단/기록이다. 정식 산출물·제품 구현 검증과 구별한다. 입력 HEAD `ce3426803cc7ac53da3ba38ac908778ae4423b30`, integration `3aeae1dfcce7788f88e706dcd49d283b91b67e82`.

## 확인 항목

- 첨부 원본과 repository 보존본 byte 일치: 77,818 bytes, SHA256 `270c224ff0e2c75f64c77fd9360b4bf79bfd538a3f1828a2157756d4a7b01f5d`, blob `389c424beec332da935e08766529edb0485622c3`
- 복원 시 로컬110파일과 원격 tree blob 일치; 필수 진행6문서 재조회. 기존 준비 B01~44/36source파일 및 Governance22입력의 원격 blob 동일성 대조
- 판단 J01~13, 선택 원문 V01~12, G01~06, H01~10, STEP4A T01~03와 비동기/정리 경계, 현행11개 안전성 대응 연결 확인
- 이번 변경9경로(신규7/수정2), PR 누적16경로. 문서 내부 상대 파일 링크·표 열·끝개행·공백 검사. 보존 원본의 기존 표현/서식은 수정하지 않음
- CURRENT22상태: 4A COMPLETED, 4B IN_PROGRESS, 5A 이후 NOT_STARTED. 과거checkpoint 보존. 조사 수신CP0045와 핵심 판단CP0046 구별
- 실제 inventory/기존 Registry와 문서 입력으로 Governance 순수함수 RepositoryState·DocumentPolicy·PullRequestChanges(이번/누적 범위) 검사
- 원격 제출 후 변경9파일 exact read-back, 입력 HEAD 대비 허용 경로 외 blob/mode/type 불변, integration 불변, PR OPEN/Draft/미병합 여부를 재검증. 실제 SHA와 검사 결과는 PR본문/제출 응답에 고정 기록

## 로컬 검증 결과

**PASS / 오류0.** 이번9경로·누적16경로, 생성/갱신 문서의 링크152·표13 검사 통과. 보존 원본은 byte 동일성을 검사하고 서식 교정 대상에서 제외했다. 근거44개/36파일과 Governance22입력 blob 일치, 허용9경로 외 기존 로컬108파일 불변. CURRENT22상태와 J01~13/G01~06/H01~10 연결 확인. Governance 네 분류 결과(state/policy/이번변경/누적변경) 오류0.

## 미실행과 해석 제한

runtime/unit/build/DB/browser/production·부하·보안 경합·장애 주입: **NOT_RUN**. 코드 변경 없는 판단 제출이며 H01~10은 향후 검증 계획이다. 가격표 확인은 프로젝트 견적이나 운영 적합성 검증이 아니다. 이번 확인은 공식 원문 선택 범위에 한정한다.

전체 checkout 및 Governance CLI: **NOT_RUN**. 부분 materialization과 원격 전체 inventory를 사용한 문서/순수함수 검증이다. git clean·전체 테스트 PASS로 표현하지 않는다. 최종 SHA CI는 조회 결과 그대로 PR에 기록하고 필요 없는 workflow를 수동 유발하지 않는다.

정식 반영·구현·STEP5A·병합·main·production 작업 없음. 최종 원격 제출/검증 뒤 정지한다.
