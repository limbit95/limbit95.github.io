# CP0117 — STEP7D JWT 부분 소스 integration 병합·재개 기록

2026-10-29 KST. Sol/Codex, 실제 모델 gpt-6.1-sol-wm. 문서 기록 전용이며 STEP7D 완료/지원 승인이 아니다. 기록 기준 integration **2c3f5ba2ef223f2011009c42bc321c68b4bff9c4**, tree **e6e00bfdfbb8c549c7d86f47be4c731317dfbc0f**.

## 1. 실제 병합과 기록 관계

- [PR436](https://github.com/limbit95/limbit95.github.io/pull/436)은 Astra의 부분 결과 수용·integration 병합 권고 뒤 사용자 `진행하자` 승인으로 병합됐다. 이전 B는 b53562baaaa429f6b37a311edfacc7d775994f67, 제출 head는 e76a262367995cc751a1eca1428a36cc1358e9bb, 실제 merge는 위2c3f5ba다. merge parents는 B와 제출 head 순서이며 실제 integration ref와 일치했다.
- 검토 local829dae94675efdf08462911c35a7306f027d421d, 제출e76a262, PR CI 합성 mergee46de3447f5a9014c8dffaf94bdfc82960aa381b와 실제 merge2c3f5ba는 treee6e00bf…가 같고 commit/실행 receipt는 각각 별개다. 원격 Git commit 조회와10파일 patch의 고정 B 원문 적용 bytes 대조는 Astra 검토 증거다.
- 선행 [PR434](https://github.com/limbit95/limbit95.github.io/pull/434)는 B로 병합된 private PG lease/격리 runner/dependency/library 부분 소스다. PR432도 integration에 반영됐다. 현재 안내의 CP0114 미병합 문구는 당시 이력으로 분리한다.
- [PR435](https://github.com/limbit95/limbit95.github.io/pull/435)는 OPEN/미병합이며 headcc4ac0bebd707f563736f1897e693e7cb3611b89의4문서다. 그 [CP0116 원문](https://github.com/limbit95/limbit95.github.io/blob/cc4ac0bebd707f563736f1897e693e7cb3611b89/docs/game-platform-rebuild/checkpoints/CP-0116-step-7d-private-library-integration-merged.md)을 고정 이력으로 참조한다. PR435의 source/문서를 자동 이식·병합·닫기하지 않는다. PR433/H의 별도 이력도 유지한다.
- main은 별도0e4089f345c1f0a33c86c96a1f07a9dab484cc2e로 PR436 병합 때 불변 확인했다. 이번 기록은 main/배포 승인이 아니다. 기록 branch는 docs/game-platform-vnext-phase7d-pr436-merge-record, base는2c3f5ba이며 기록 자신의 실제 head/tree/PR은 Git/제출 receipt에서 확인한다.

## 2. 반영된 범위와 증거

PR436의 B 대비10파일/+241/-16은 비공개 tokenVerifier·offline 계약·좁은 문서, private exact jose6.2.12와 lock, pg/jose 표준 해석·owned link·one-attempt cleanup 및 package source/lock/import inventory의 승인된 최소 확장이다. 기존 pg8.23.1·14개 lock entry·root browser package/lock·원SQL/lease/wrapper·archive 엔진·Guard/policy/workflow는 보존했다. 실제 서명 검증이며 fake verification 성공으로 대체하지 않는다.

명시 issuer/audience·ES256·로컬 public JWKS·clock으로 sub/session_id/exp를 검증한다. VERIFIED_TOKEN_CLAIMS는 current 허가/A/C/P/DB caller permit이 아니다. 반환 전 expiry/context 재검사와 외부 예외 무조회·내부 고정 분류를 포함한다. JOSE 만료 예외는 TOKEN_VERIFICATION_REJECTED, 내부 최종 만료는 TOKEN_EXPIRED이며 만료 거절은 유지한다. 운영 issuer/key/알고리즘·rotation 호환은 미입증이다.

- local829dae9: Node22.23.4/npm11.9.0, 관련61/61·전체560/560, 관련 프로젝트 명령/Guard/governance/publication 성공. 원문 명령·완전 summary·patch/bundle은 [후보 증거](https://chatgpt.com/library?file_id=libfile_7f37bc8b077c819191bc09f066a91871&account_id=personal)에 있다.
- PR CI는 합성 mergee46de34에서 governance40698054200(Node22.23.3/npm10.9.9)·static40698054238(Node22.23.4/npm10.9.9) 전체560/560, publication40698054246(Node22.23.4/npm10.9.9)39/39 및 LOCAL_CHECKOUT_PUBLICATION385였다. 모두 success, 시험 fail/cancelled/skipped/todo0. 실제 public artifact upload/검증·deploy는 skipped다. 두 dependency cleanup receipt는 그 CI owner의 관측이며 이후 외부 잔존 부재나 OS 종료 보증이 아니다.
- 이 결과는 실제 merge2c3f5ba나 새 문서 head의 신규 시험이 아니다. [제출·CI 원문](https://chatgpt.com/library?file_id=libfile_e92e39eab32481918ac47852ff8221ed&account_id=personal), [Astra 최종 검토](https://chatgpt.com/library?file_id=libfile_9f7529a2532c8191af2f0ef73d4f857a&account_id=personal), [실제 병합 receipt](https://chatgpt.com/library?file_id=libfile_943bd9a7d460819197e07a59446f785b&account_id=personal)를 구분한다. 과거 PR434/4a966·4677/916d/ce1d/7049/E1~3 receipt도 기존 revision에 귀속한다.

## 3. 미입증과 보존 의무

실제 DB 시험은 사용자 보류로 **NOT_RUN**, 새 배포용 private archive/unpack도 **NOT_RUN**이다. 기존14package archive는 새 후보 인증이 아니다. DB PASS/전체S1/운영 설정 확인/PR435 병합을 독립 verifier의 선행조건으로 만들지 않는다. production token/key·운영 Auth/DB 조회·remote JWKS·HTTP/WSS listener·runtime GRANT·current 허가·storage 호출·native P는 이번 기록에서 실행하지 않는다.

실제 current predicate·전용 caller·잠금 뒤 같은 transaction finalizer·writer fence·A/C/P/nativeP/ingress 전체·bootstrap/admission·최초60초/terminal·start/rematch·Adapter는 여전히 미구현/미입증이다. 검증 claims 복사/freeze는 최종 허가나 악성 동일 process 격리가 아니다. 운영 미확인은 fail-closed다.

public-binding **UNKNOWN_OPAQUE_EDGES/exit1** 및 고정 source의12직접 target 제한 해석을 유지한다. community58inputs/45outputs/warnings0·local publication385·raw alias 부재를 전체 동적/전이 graph·browser/cache/SW·actual 배포artifact/전체 공개 제외 PASS로 승격하지 않는다. integration385/main382·public385 source/output/I bytes·serverpublic0·Core main 미이식·고정M P1 비상속과 원SQL hash07888c2439d00f323d985166e4cdbc14377626c7debba84314a7789badec900b·services 밖 SQL 별도 제외는 기존 증거/범위로 보존한다.

새·옛 보존 package/CI 자원과 옛 소유불명3경로/4677manifest-only 잔여의 INCONCLUSIVE_EXTERNAL_OWNER_REQUIRED·원인/내용/owner UNKNOWN 유지. 재관측/삭제하지 않으며 이름/oldinode/완료journal로 닫힌 삭제 권한을 복구하지 않는다.

원본 [Astra 범위 판단](https://chatgpt.com/library?file_id=libfile_68682d217590819199ea22a1ad147bf1&account_id=personal) §8 전체와 [STEP7B §7 전체](../artifacts/game-platform-vnext-step7b-plan-and-handoff.md#7-반드시-유지할-조건), 승인 Target/currentA/C/P/D0010/안전11/H1~4/단일채택·복구/hostless·미승인재대결예외금지/consumer/원본/원ID·줄·f 및 최신public/private library Astra·handoff·CI-R1·dependency plan 원문의 조건/예외/강도/후속 의무를 유지한다. STEP5B 정정/producer-consumer/여섯dedup/NEW/Profile/B01~12/R01~13/원3232·305부모·16행58분할/L/H/I·49 비승격/DEV271·251과 기록/삭제/탈퇴/backup/복원/비용/운영 의무도 축소하지 않는다. 이 요약이 원문을 대체하지 않는다.

## 4. 다음 작업과 이번 검증 범위

**다음 기술 담당은 Astra**다. 원본 판단§5와 실제 새 integration의 verifier/기존 비인가 service 경계를 입력으로 trusted caller/current predicate·writer fence의 다음 최소 연결 및 필요한 실제 설정 입력을 판단한다. 이미 완료한 JWT 오류 보완·helper/lease/SQL/K1~K4/CI-R1/게임/Auth를 재감사하지 않으며 DB/production 설정 부재를 독립 verifier의 새 blocker로 바꾸지 않는다. 운영 원장/identity/외부 generation/키 출처를 가정하지 않는다. 판단만으로 runtime 구현·GRANT·운영 조회·전체S2/S3·main/배포를 허용하지 않는다.

현재 기록 담당은 Sol/Codex다. 이4개 Markdown의 diff/상대 파일 링크·다른 tracked bytes 보존을 확인하고 별도 integration-base 기록 PR로 제출한다. 새 install/test/build/DB/browser/native/운영 실행은 하지 않는다. 기록 PR의 실제 head/tree/자동 CI는 해당 Git/Actions receipt로 별도 확인한다. 기록 PR 병합은 사용자 별도 승인 게이트다.

**STEP7D IN_PROGRESS / JWT 부분 소스 INTEGRATION_MERGED / 실제 지원 미입증 / vNext 행동 NOT_RUN / 운영·browser/cache/SW UNKNOWN / production runtime·actual 배포artifact·채택·공개 제외 전체 OPEN**.
