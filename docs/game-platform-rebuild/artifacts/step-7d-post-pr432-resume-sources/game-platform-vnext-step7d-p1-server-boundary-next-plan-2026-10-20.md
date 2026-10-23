# Game Platform vNext STEP7D P1 이후 — server 공개 제외 검사 유지 방안과 다음 최소 작업

작성: 2026-10-20 KST · 담당 **Astra** · 구현 전 판단/전달안.

## 1. 결론과 바로 다음 작업

**P1 결과를 이유로 현재 server 전면 차단을 삭제하지 않는다.** 다음 최소 구현 후보는 기존 publication 검증이 **검사 중인 checkout/revision과 현재 공개 산출물에 결속됐는지 확인하는 준비 작업**이다. production Guard의 server 차단·runtime/model 미지원 판정은 그대로 둔다.

현재 builder에는 exact public 정책·server bytes 별칭·참조·build provenance·실제 출력 bytes 검사가 이미 있다. 새 공개 제외 엔진이나 승인 flag를 만들 필요가 없다. 기존 검증을 재사용하되, 미래 server 변경에서 과거 M의 성공 기록이나 다른 checkout의 manifest를 통과 근거로 사용할 수 없도록 검사 경계를 먼저 준비한다.

**다음 구현 담당: Sol/Codex. 다음 제출 검토: Astra.** §6은 사용자가 실행 범위를 선택할 때 사용할 구체 프롬프트다. 이번에는 계획과 전달 파일만 작성했으며, 소스/Guard/Git/PR/설정/배포를 변경하지 않았다.

고정 M의 P1은 직전 최종 Astra 판단의 **변경 범위 증거 충족/최종 승인 가능** 결론을 유지한다. 이번 “진행하자”로 별도 저장소 승인·완료 기록이나 Guard 해제 권한이 추가됐다고 쓰지 않는다. STEP7D 전체 미완료·모델/Adapter 미착수·vNext 행동 NOT_RUN·운영 UNKNOWN이다.

## 2. 근거와 읽기 한계

재사용한 권위는 직전 `game-platform-vnext-step7d-p1-final-astra-judgment-2026-10-20.md`, 승인된 browser 선행조건 분리 결정, cutover-plan §7 L129~135·§8 및 승인 Target §6.1 L93~102다. 기존 source/build/package/deployment/HTTP 검증과 전체 보존 조건을 재판단하지 않는다.

실제 코드 읽기는 고정 main M과 같은 tree를 갖는 보존 후보 source 사본에 한정했다. 후보 provenance의 sourceRevision은 `3ddf2bd6f7f2ba5b949abd2c27f8eb3cfee07b54`, tree는 `d4f9b568f705a17cca3274f0862d46f5b56b3b76`다. 이를 main M commit identity와 같다고 쓰지 않는다. 다음 세 파일의 로컬 Git blob을 계산하여 보존 provenance의 값과 대조했다.

| 파일 | 보존 blob |
|---|---|
| scripts/check-game-platform-vnext-boundaries.mjs | `66d965f1ea938b3971a63513776f8fa1b1aa127e` |
| scripts/build-site-publication.mjs | `c56fe2c084be9c9db695e4fbf4f52c6f1f34eb96` |
| .github/workflows/site-pages-publication.yml | `b94d80f99804df3145f87bb4bf27850777e43301` |

publication 계약 tests와 보존 integration 준비 사본의 governance 호출부/CI도 필요한 줄만 읽었다. 후자는 현재 integration의 동일성 증거로 쓰지 않는다. 구현 시작 시 실제 integration의 해당 파일과 연결을 확인해야 한다.

초기 `game-platform-vnext-step7d-astra-judgment-2026-10-15.md` 및 `game-platform-vnext-step7d-plan-and-handoff-2026-10-14.md`는 제목 검색과 짧은 제목 검색에서 정확한 원문을 확보하지 못했다. 검색 미확보를 삭제 확정으로 쓰지 않으며, 유사 결과로 원문 전체를 읽었다고 대신하지 않았다. **따라서 이 문서는 선택 모델/transport/session/Adapter 정책의 실행 계획을 새로 확정하지 않는다.** 확보된 P1 cutover 권위와 실제 publication 코드만으로 판단 가능한 준비 범위다. 모델 구현을 재개할 때는 두 원문 또는 승인된 정식 보존본을 먼저 복원해야 한다.

현재 원격/CI/Pages 상태는 이번에 새로 조회하지 않았다. 기준 main M=`0e4089f345c1f0a33c86c96a1f07a9dab484cc2e`, integration=`b59994ce6a8435220229a77b52c136a7e6ad9495`, 실제 배포 run39191903797/attempt1/artifact12160182245는 기존 고정 증거다. 이후 변경은 자동 포함하지 않는다.

## 3. 실제 코드에서 구분해야 하는 경계

| 원문/줄 | 현재 의미·consumer | 최소 대응과 owner |
|---|---|---|
| boundary helper L178~183 | 전체 trackedPaths에 server 경로가 있으면 조건 없이 실패. CLI L226~241은 실제 git ls-files를 사용 | 현재 유지. P1 성공 Boolean/환경변수/이름/문서만으로 예외를 넣지 않음. Guard owner |
| 같은 helper L184~206 | browser→server 참조, 기존 shared barrel→vNext, consumer 계약, server asset output 차단 | 검사 의미 유지. 원문 parser/정상 자산 보존을 다시 구현하지 않음. boundary owner |
| builder L55~80 | 전체 inventory의 server 파일 hash, public 경로/중복/regular/symlink/정책 누락/동일 bytes 별칭 검사 | 기존 로직 재사용. fixture에서 server canary가 제외되는 것은 builder 증거이며 production server 허용이 아님. publication owner |
| builder L93~95 | boundary helper에 **선택된 public 파일만** 전달 | 전체 repository server 차단 CLI와 입력 scope가 다름. 현재 fixture 통과를 CLI 통과로 오해하면 안 됨 |
| builder L96~147 | 정적 참조·scoped moduleMaps·실제 esbuild input/output 공개 정책 연결 | 그대로 유지. hash만 같거나 public 개수만 같은 것으로 대체하지 않음 |
| builder L198~216 | manifest policy/file records 및 실제 출력 bytes를 현재 source와 재비교 | 현재 함수는 manifest.sourceRevision을 직접 대조하지 않음. 향후 Guard 연결 준비에서는 실제 checkout에 대한 결속 검사가 필요 |
| builder CLI L223~226 | build 때 git HEAD를 sourceRevision으로 기록, check는 verifyPublication 호출 | 생성 때 기록된 문자열과 검증 때 실제 HEAD 확인은 다름. fixture용 inventory/revision이 production 우회 입력이 되지 않도록 분리 |
| publication workflow L35~42 | build:assets/committed output → tests/governance/boundary → build/check:publication | 현재 server가 없으므로 정상. 미래 조건부 Guard가 생성된 산출물을 요구하면 현재 순서와 충돌하므로 별도 연결 판단 필요 |
| workflow L49~95 | main publish:true만 public upload, 실제 ZIP/tar/identity 확인 후 deploy 직전 재검사 | 수정 이유 없음. 준비 PR·로컬 산출물을 actual Pages artifact로 쓰지 않음 |

위 sourceRevision 관찰은 **현재 M 배포의 검증 결함 판정이 아니다.** 실제 게시에는 Python artifact verifier의 별도 run/revision 검사와 배포 연결이 있었고, 그 결과는 이미 재사용했다. 이번 쟁점은 미래 Guard가 로컬 publication 검증을 소비하게 될 때 필요한 입력 결속이다. 직접 요구에 legacy ID/f를 새로 부여하지 않는다.

## 4. 권고하는 최소 설계

### 4.1 이번 준비 구현 후보 — 차단 유지

기존 `verifyPublication`과 필요한 내부 함수를 재사용해 **검사 시점 checkout의 publication 검증**을 제공한다. 함수 분리·이름·파일 배치는 Sol/Codex의 정상 구현 선택에 맡긴다. 범용 정책 엔진, 공개 진단 API, 사용자 `allowServer` flag, 성공 문서 탐지, 영구 승인 receipt를 만들지 않는다.

필요 의미는 다음으로 한정한다.

1. production 입력은 실제 checkout/HEAD·실제 tracked inventory에서 읽는다. 외부에서 주입한 fixture revision/inventory를 production 증거로 인정하지 않는다.
2. 생성 manifest의 sourceRevision과 검사 대상 HEAD가 다르거나, 대상 source/policy/build 입력이 생성 이후 바뀌었거나, 검사가 필요한 관련 입력이 읽히지 않으면 실패한다. PR의 합성 merge와 정식 head가 다르면 실제 검사한 revision을 기록하고 둘을 같은 것으로 쓰지 않는다.
3. 해당 실행에서 현재 server source/artifact inventory를 읽고, 기존 exact policy·server path/별칭·정적 참조·build input/output·출력 실제 bytes 검사를 함께 수행한다. 과거 M의 artifact12160182245는 미래 server 변경을 허용하는 receipt가 아니다.
4. production 검증이 clean 입력을 요구할 경우 그 범위와 검증 시점을 명시한다. 생성된 `.site-publication` 같은 예상 출력과 관련 source 변경을 구분하고, 저장소 밖 임의 파일을 탐색하지 않는다. source에 불명확한 변경이 있으면 이전 성공 결과를 재사용하지 않는다.
5. 결과는 **로컬 checkout/publication 검증**으로만 표시한다. remote actual artifact·deploy·browser·server 지원 상태를 PASS로 출력하지 않는다.
6. **boundary helper L180~183의 차단과 기존 CLI 실패 의미는 변경하지 않는다.** fixture canary는 임시 테스트 디렉터리에만 두고 실제 `services/game-platform-vnext/` 파일을 만들지 않는다. model oracle의 빈 모델·runtime/online 차단도 그대로다.

새 signed receipt·자체 attestation 서비스·새 artifact 포맷은 필요하지 않다. 기존 manifest와 actual package 검증을 재사용하며, 새로운 증거 필드가 불가피하면 현재 source를 설명하는 최소 값만 추가하고 기존 소비자 호환성을 검토한다.

### 4.2 실제 server 변경 시의 별도 연결 — 지금 구현하지 않음

나중에 승인된 구체 server 코드가 생길 때에만 Astra가 다음 연결을 판단한다: repository 구조/참조 검사는 항상 유지하고, server 존재 시에는 **같은 변경의 publication 검증을 성공적으로 수행한 경우에 한해서만** 현재의 전면 차단을 어떤 검사로 대체할 수 있는지 검토한다. 자료 누락·다른 revision·정책/bytes/참조 불일치면 차단한다.

이때 실제 공개 제외와 지원 조건은 별개다. integration의 로컬 package/fixture 성공은 main의 실제 배포나 server 운영 지원을 뜻하지 않는다. future main publication에는 그 revision의 actual uploaded artifact 검사·직전 재검사·배포 경계가 계속 필요하며, M에서의 browser 예외를 새 revision에 자동 상속하지 않는다.

현재 builder가 boundary helper를 import하므로 helper가 builder를 정적으로 다시 import하는 단순 연결은 순환 의존을 만들 수 있다. 실제 연결 단계에서 순수 참조 검사와 orchestration의 책임을 필요한 만큼만 분리한다. 준비 단계에서 선제 대규모 재배치하지 않는다.

워크플로의 검사 순서도 실제 연결 때만 조정한다. 어떤 경우에도 오류를 무시하고 build하거나, `continue-on-error`, 임시 Guard skip, 수동 지원 flag로 새 server를 통과시키지 않는다. 기존 독립 governance/boundary 호출부에도 동일한 실패 의미가 도달해야 한다.

## 5. 준비 구현의 검증과 제출 경계

추가할 의미 있는 계약 tests는 다음 정도면 충분하다. 기존 tar 원본경로·format/identity/digest·CSS/HTML parser 회귀는 재사용하고 중복 시험 엔진을 만들지 않는다.

- 일치하는 checkout/revision·exact policy·실제 public bytes의 정상 검증.
- 같은 public bytes라도 다른 revision manifest를 넣으면 실패. sourceRevision 문자열만 고쳐 현재의 실제 source/출력 불일치를 숨길 수 없음.
- 생성 뒤 관련 source/policy/build input/output 변경·누락·읽기 실패를 현재 검사에서 차단.
- 임시 fixture의 server canary는 public 목록/실제 출력에서 제외되고, 별칭/참조/build provenance 유입은 차단. 이 통과와 별개로 **production 경계 함수의 server 존재 차단은 유지됨**을 검증.
- source 검사 실패 뒤 성공 증거를 남기거나 upload/deploy로 이어지지 않음. 기존 실제 workflow의 publish:true gate/identity 순서를 보존.

후속 구현 시 full checkout에서 관련 tests, `npm run test:game-platform`, 기존 governance/boundary, build:assets와 committed output 확인, build/check:publication을 수행한다. main exact382·integration exact384의 목록/bytes 의미를 보존한다. 필요한 기존 CI 결과를 확인하고 fixture/unit/CI와 실제 public artifact를 구분한다. 현재 작업에서는 테스트를 실행하지 않았다.

수정 후보는 기존 builder의 검증부·관련 tests·필요한 최소 안내/현재 기록이다. production boundary 차단문·선택 모델·Auth/API/SQL·Registry/barrel·public 자산·정책 목록을 변경할 이유는 없다. workflow 변경이 새로 필요하면 원인과 최소 diff를 먼저 구분한다. 이 준비 결과만으로 P1 전체/STEP7D 완료·모델 지원을 기록하지 않는다.

## 6. Sol/Codex 전달 프롬프트 — 실행 범위를 선택할 때 사용

다음은 **구체 준비 구현 제안**이며 이번 사용자 “진행하자”를 근거로 이미 실행하지 않았다. 사용자가 아래 범위를 지시하면 작업을 시작할 수 있다.

> Game Platform vNext STEP7D의 server 공개 제외 검사 연결을 위한 최소 준비를 진행해줘. 담당 Sol/Codex. 이 server-boundary-next-plan 전체와 P1 final-astra-judgment, 사용자 browser 선행조건 분리 결정을 먼저 읽어줘. 고정 main M=0e4089f345c1f0a33c86c96a1f07a9dab484cc2e/tree d4f9b568f705a17cca3274f0862d46f5b56b3b76, integration b59994ce6a8435220229a77b52c136a7e6ad9495와 실제 현재 remote/PR/CI·이후 변경을 구분해줘. AGENTS→현재 실행계획→rebuild README→CURRENT→관련 checkpoint를 필요한 범위로 복원해줘.
>
> 이번 구현은 기존 publication 검증을 실제 검사 checkout/revision·현재 source/정책/출력에 결속하는 준비에 한정한다. 기존 builder와 검사를 재사용하고 §4.1/§5의 최소 의미와 계약 tests를 구현해줘. fixture의 주입 입력을 production 증거로 사용하지 마. 판정 결과는 로컬 publication 검증으로만 표시하고 remote artifact/deploy/browser/모델 지원으로 확대하지 마.
>
> production boundary helper의 server 존재 차단 L180~183 및 기존 CLI 실패 의미를 유지해줘. Guard 해제/조건부 허용 연결·새 server 파일·모델/Adapter/runtime/online 구현은 하지 마. §4.2는 향후 실제 server 변경 시의 검토 조건이며 이번 구현 범위가 아니다. 초기 STEP7D 모델 계획 원문이 없는 상태에서 모델 정책을 추정 복원하지 마.
>
> 실제 현재 integration을 읽어 범위를 확인하고, 관련 진행 브랜치가 있으면 충돌 없이 이어가되 없으면 integration base의 이 준비용 브랜치를 사용해줘. main에는 변경을 이식하지 마. 관련 full-checkout 검증·npm run test:game-platform·기존 Guard/CI·build/check:publication과 기존 public bytes 보존을 확인해줘. 최소 현재 기록·commit/push·integration base 검토 PR 제출까지 진행하고 remote head/tree·diff·검증·재검토 인수인계를 남겨 REVIEW_PENDING에서 멈춰줘. 새 의미 충돌은 근거/owner/consumer/영향/최소 보완으로 Astra에 반환해줘.
>
> main exact382/integration exact384·Core 미이식·승인 Target/STEP7B §7 전체·기존 consumer/API/Registry metadata/barrel·게임/Auth/API/SQL·원본/후속 의무를 유지해줘. P1은 고정 M의 변경 범위 증거 판단과 미래 revision 검증을 구분하고 browser/cache/SW UNKNOWN·미완료 후속 의무를 유지해줘. STEP7D 전체 미완료·모델/Adapter 미착수·vNext 행동 NOT_RUN·운영 UNKNOWN으로 멈춰줘. 최종 승인/완료 기록·병합·main 변경·Pages 설정·dispatch/rerun/실제 upload/deploy·새 방문/실제 행동 시험·Guard 해제·전수 감사·외부 운영 재조사는 하지 마.

이 준비 PR은 PR426 등 과거 병합 기록만을 위한 PR이 아니다. 실제 검증부/계약 tests 변경을 검토하는 작업이다. 필요 없는 기록 전용 PR을 추가하지 않는다.

## 7. 보존과 이번 수행

이번에는 실제 보존 코드의 필요한 부분·provenance·기존 판단을 읽고 계획만 작성했다. 새 HTTP/browser/운영 조회·시험0, source/Guard/Git/설정/배포 수정0, 모델/Adapter/server 구현0. 초기 계획 원문 미확보 때문에 모델 구현 계획까지 완료했다고 기재하지 않는다.

승인 Target·STEP7B §7 전체·빈 모델/미구현 미지원·vNext runtime/online 차단·기존 online DB 요구·server 제외 미확인 차단·H1~4/단일채택·복구/안전11/current A/C/P/hostless·미승인 재대결 예외 금지·STEP4A 수명/모든 완료/T01~03·D0010 current delta·STEP5B 결과 revision/producer-consumer/dedup/merge activation·Profile/B01~12/R01~13·D0006~10 비용/성능/log/삭제·탈퇴/backup 복구·원ID/줄/f/baseline/override/manual gates·전체 후속 의무를 유지한다.

기존 실제 public ZIP/identity 보존, 옛 root 정상 artifact 미확보·완전 원복/무중단 미보장·동일 M 재생성과 보관 ZIP 직접 복원 기능 부재를 유지한다. 문서/unit/fixture/Guard/CI/publication 준비 성공은 실제 model/game 지원·행동 PASS가 아니다.

**정지: Astra 경계 준비안 작성 / 구현 미착수 / production Guard 유지 / STEP7D 전체 미완료 / 모델·Adapter 미착수 / browser/cache/SW UNKNOWN·후속 의무 유지 / vNext 행동 NOT_RUN / 운영 UNKNOWN.**
