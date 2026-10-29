# CP0116 — STEP7D private PG lease/library 부분 소스 integration 병합 기록

작성일 2026-10-28 KST. 담당 Sol/Codex. 저장 직전 integration HEAD b53562baaaa429f6b37a311edfacc7d775994f67. 이 기록은 루트 계획 개정1.6 §4.3의 병합 상태 확정 자동 기록이다. STEP7D는 IN_PROGRESS이며 전체 완료/지원 승인이 아니다.

## 1. 실제 원격 상태와 승인

- 사용자는 PR 제출 승인을 먼저 주었고, PR434 integration 병합 여부 설명 및 AGENTS 별도 승인 규정을 확인한 뒤 `오키 진행하자`로 해당 병합을 승인했다. 이후 `이어서 진행하자`에 따라 실제 상태를 재개했다. main 반영/배포 승인으로 확대하지 않는다.
- PR434 closed/merged=true. base `feature/game-platform-vnext-integration`, 이전 I `ec8bb5e113346681ed3d38b23fd54de07de60765`; 제출 head `8f310a938390736d3570955d290a89a6e4738010`; actual merge `b53562baaaa429f6b37a311edfacc7d775994f67`.
- merge 부모는 I와 제출 head 순서이며 actual integration ref와 일치한다. tree는 `3ee5c5e22b4d1df24a0c97efd06d340989a1b2ea`다. 현재 main은 별도 M `0e4089f345c1f0a33c86c96a1f07a9dab484cc2e`로 변경하지 않았다.
- Git CLI push 인증 실패 뒤 사용자가 동일 source/tree의 새 제출 commit을 승인했다. 원래 검토 후보4a966와 새 제출8f310/실제 merge b535는 다른 commit이며 tree만 동일하다. 원본 bundle/ZIP/ref를 덮어쓰지 않았다.
- 문서 H `a29bdde19251cee8ac1931eaf3080e1a4dea2cb1`의 PR433은 OPEN/미병합이다. CP0115와 당시 입력은 [고정 H 재개 기록](https://github.com/limbit95/limbit95.github.io/blob/a29bdde19251cee8ac1931eaf3080e1a4dea2cb1/docs/game-platform-rebuild/checkpoints/CP-0115-step-7d-post-pr432-resume-checkpoint.md)에서 읽는다. 이 기록은 H의13문서/별도 입력 원문을 자동 이식하거나 PR433을 닫지 않는다.
- PR432는 실제 merge I로 병합됐다. CURRENT/README의 CP0114 미병합 표기는 당시 이력으로 구분한다. 기록 branch `docs/game-platform-vnext-phase7d-pr434-merge-record`, base b535. 기록 commit 자신의 SHA를 미리 쓰지 않으며 실제 head/tree/PR은 Git에서 확인한다.

## 2. 실제 구현과 미구현

PR434의 I 대비22파일/+2595/-2는 private connection lease, storage의 signal 전달, 격리 저장부 runner와 support, exact dependency 준비/one-attempt cleanup 및 두 검사 workflow 연결, private library archive helper와 offline 계약/후보 설명이다. 기존 root browser package/lock·원 SQL·기존 consumer/Auth/게임·Guard/policy/publication/Pages/DB workflow를 변경하지 않았다.

현재 private library 부분 후보 승인 가능·필수 소스 보완0, K1~K4/CI-R1 판단과 public 제한 source 해석 수용·새 핵심 충돌0·필수 문서/소스 보완0은 기존 검토 판단이다. 이 기록은 다시 승인받는 조건을 만들지 않는다. 제출/병합 승인은 해당 부분 소스 반영이며 전체 S1·STEP7D·production 지원 결과 승인이 아니다.

실제 trusted caller/current predicate·external generation/writer fence·post-lock fresh A·bootstrap/admission·최초60초/abort/terminal 전체·start/rematch·native P/연속 authority·site Adapter는 여전히 미구현/미입증이다. test runner를 production entry로 승격하지 않는다. library artifact와 아직 없는 runnable production runtime/actual 배포 artifact를 구분한다.

## 3. revision별 증거 — 재실행/상속 아님

- 새 제출 head8f310의 자동 PR CI: static40481156257 / governance40481156062 / publication40481156338, 모두 completed/success/attempt1. actual checkout은 합성 merge `e030dd8aa64f26921efe55f2f42c61752ad6e247`/동일 tree3ee5다. 실제 integration merge b535와 구분하며 b535 자체 시험으로 쓰지 않는다. dispatch/rerun 없이 기존 등록 workflow가 실행됐다.
- 실제 CI Node v22.23.3/npm10.9.9. static/governance의 Game Platform532/532, publication39/39·LOCAL_CHECKOUT_PUBLICATION385, exact dependency prepare/cleanup success를 job122111516611/122111516195/122111517169 로그에서 확인했다. deploy job은 SKIPPED다. actual Pages artifact/DB/OS fault/production packaging 인증이 아니다.
- 과거4a966 local Node22.23.4/npm11.9.0: 전체532/관련89/신규14/module78/local385. 21명령=20exit0+bind-private-public1exit1/UNKNOWN_OPAQUE_EDGES. WIPexit130/summary부재→WIP14→최종532/89, UNKNOWN 중단/finally cleanup→같은 source preservation만 재개를 유지한다.
- archive133059bytes/SHA256 `268bdecc12af572773568fdaf0d37493fcef4574db617c2609ae608ee581626c`, manifestSHA256 `9492518173ffb11163fabe3b906b3ddefbcc442141ec9ce4586374868544d718`; payload144files/34dirs/전체tar180entries·source5 unchanged·14locked packages·독립 unpack/import는4a966 당시 local 기록이다. 프로젝트 검증 입력 제외와 vendored test/config/native JS 전수 보존을 구분한다.
- E3:4677의518/75/new6/dependency19/module78/local385는 Node22.23.4/npm11.9.0. 916d512/69/13/npm10.9.9, ce1d511/68,7049실패, 초기Node22.15 불완전/Node24fallback 및 E1/E2는 각각 당시 receipt다. preservation.correctionBase=cde8는 누적 기준, 최소4파일 correction base는4677이다. 원본을 덮어쓰지 않는다.
- candidate chain:4a966/tree3ee5 ←4677/treebd3ad51ae7265efa6e872f0896d73df9197d0326 ←916d/treec5be03fc50a2d1f57b2e4f34a9b64d45b4b94e50; cde8/tree4dfd03911e85855bd016e0b13efbb92c6a105e8c와811/tree792a568d576a40679de60bdda38629b4befa08e4 및 ce1d/7049 receipt는 별도 이력이다. 정확한 full commit은 PR434 원본 bundle 이력에서 조회한다.

## 4. 보류·UNKNOWN과 원문 의무

실제 격리 Supabase DB 시험은 사용자가 미검증으로 남기기로 해 NOT_RUN이다. Docker/native 환경 재시도·기존 offline suite 반복을 이번 기록의 선행 조건으로 추가하지 않는다. ACL/RLS/negative login·atomic C·동시성·COMMIT응답유실·backend/OScleanup/late·WAL/crash·정밀 C·caller/current/fence/native P는 실제 후속 증거가 필요하다. runtime postgres/GRANT/no-op/fake allow로 채우지 않는다.

public-binding UNKNOWN_OPAQUE_EDGES/exit1 유지. 기본 page/default importer의 bootstrap6path/8specifier+playWindow6path, 합계12직접 public target의 고정blob/manifest/policy 대응과 직접 remap 부재만 source 해석으로 수용했다. query는 branch 선택이며 임의path 공급이 아니다. callback 일반성·전이remap/CDN·모든 전이graph/arbitrarytransform·실제browser/HTTP/cache/SW/배포artifact까지 확대하지 않는다. community58inputs/45outputs/warnings0에는 Marble 입력이 없다. literal reference verifier는 함수반환값 evaluator가 아니며 raw alias0은 전체 transform 비유입 PASS가 아니다.

새 package/CI 보존 자원 및 옛 소유 불명3경로/4677manifest-only 잔여는 재관측·삭제하지 않았다. 종합 INCONCLUSIVE_EXTERNAL_OWNER_REQUIRED, contents/원인/외부owner UNKNOWN 유지. 이름/old inode/완료 journal로 닫힌 삭제 권한을 복구하지 않는다.

원 SQL bytes/hash pin `07888c2439d00f323d985166e4cdbc14377626c7debba84314a7789badec900b`·services 밖 SQL 별도 제외·integration385/main382/public385 source/output/I bytes/server public0/Core main 미이식은 기존 범위/증거로 유지한다. fixed M P1을 새 revision에 상속하지 않는다.

승인 Target·[STEP7B 계획 §7 전체](../artifacts/game-platform-vnext-step7b-plan-and-handoff.md#7-반드시-유지할-조건)·current A/C/P/D0010·안전11/H1~4·단일 채택/복구·hostless/미승인 재대결 예외 금지·consumer/원본/원ID·줄·f의 원문/조건/예외/강도/후속 의무를 축소하지 않는다. 최신 public/private library Astra검토§7·결정§9·handoff§9·CI-R1 Astra§7·dependency plan§8의 원본은 당시 전달 자료로 보존하며 이 요약으로 대체하지 않는다. 기존 lease/SQL/F1~3/F1-R1/K1~K4/CI-R1/fresh dependency/기존 게임을 재감사하지 않는다.

## 5. 다음 최소 범위와 검증

현재 Sol 작업은 이 병합 상태 기록/진입 정합화만이다. 신규 runtime 구현/새 제품 결정은 없다. 다음 기술 작업 담당은 Astra: 기존 [S0 계약](../artifacts/step-7d-coop-session-contract.md) §2/§6/§8과 실제 sessionControl/sessionStorage의 비인가 경계를 입력으로 trusted caller/current predicate·writer fence를 연결할 첫 최소 범위만 판단한다. SQL의 installer-only 저장 primitive와 runtime admission을 구분하고, 없는 production host/subject 신뢰원/current 원장/외부 generation 공급원을 가정하지 않는다. 실제 입력이 없으면 필요한 최소 입력만 반환한다. 함수명/자료구조/분할은 동결하지 않는다. 이 기록은 전체 S2/S3·DB 시험·runtime GRANT·지원 등록·main/배포 승인이 아니다.

문서 전용4파일의 diff·로컬 상대 링크·기존 source/SQL/policy bytes 보존을 확인한다. 새 test/build/install/DB/native/browser/게임/운영 실행은 하지 않는다. 새 기록 head의 자동 CI가 발생하면 실제 Git/Actions 결과로만 구분한다. 본 기록 PR은 사용자 검토 대기이며 자동 병합하지 않는다.

STEP7D 미완료·실제 지원 미입증·vNext 행동 NOT_RUN·운영 UNKNOWN·browser/cache/SW UNKNOWN·production runtime/actual 배포 artifact/채택·공개 제외 전체 OPEN.
