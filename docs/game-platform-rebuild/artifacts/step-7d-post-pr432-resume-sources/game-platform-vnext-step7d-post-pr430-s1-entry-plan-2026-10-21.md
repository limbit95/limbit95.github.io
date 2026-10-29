# STEP7D — PR430 병합 후 S1 진입 범위와 다음 구현 후보 준비

2026-10-21 KST · 판단 역할 **Astra** · 저장소 밖 전달 문서.

## 1. 결론과 다음 담당

**다음은 Sol/Codex가 S1의 실제 저빈도 제어·단일 채택/복구 구현 후보와 그 후보에 필요한 publication 경계 변경안을 함께 준비하는 작업이다.** 단독 Guard 완화 PR, PR429 준비 재구현, 빈 server 파일 선생성은 권고하지 않는다.

현재 S0 문서 결과는 승인·integration 병합됐다. 그러나 server-boundary-next-plan §4.2가 요구하는 **실제 server 변경의 같은 revision/source/policy/output**은 아직 없다. 따라서 이번 판단으로 production server Guard를 조건부 허용으로 바꾸거나 모델 구현 PR을 곧바로 지원 결과로 제출할 수 있다고 판정하지 않는다.

권고하는 다음 작은 실행 범위는 **저장소 밖 구현 후보 patch/bundle 준비와 임시 full checkout의 오프라인 계약/게시 검증까지**다. 실제 source 후보를 갖춘 뒤 Astra가 §4.2·public 경로/정책 diff를 한 번에 검토할 수 있게 한다. 이 후보 준비를 사용자가 허용하면 §7 프롬프트를 사용한다. 지금은 소스/Guard/정책/Git/PR을 수정하지 않았다.

이 작업 구분은 공식 STEP나 새로운 legacy ID가 아니다. S0의 A→S1→S2/S3 순서와 기존 명시된 경계를 실행 가능한 크기로 나눈 제안이다. 실제 코드가 없는 일반 준비 엔진을 추가하자는 뜻이 아니다.

**STEP7D 미완료 / 모델·Adapter 미착수 / vNext 행동 NOT_RUN / 운영 UNKNOWN / browser·cache·SW UNKNOWN**.

## 2. 병합 사실·현재 기준·이력 구분

| 구분 | 실제 확인값 |
|---|---|
| PR430 | merged=true, 2026-10-21 **07:00:13 KST**, head `61994eebcc3c2fc026e1e14be7ca66ecf5ea11e6` |
| 현재 integration / 새 고정 입력 | **`e987d38829334bd6435a5a74b1fbf9f3851cbaa0`** |
| integration tree | **`272fafcfcd357c41f962984803fb1eb2a2e2cf82`** |
| merge 부모 | `bb037653ca81bb294aafa16c248030ccc7eb7a87` + `61994eebcc3c2fc026e1e14be7ca66ecf5ea11e6` |
| 별도 main M | **`0e4089f345c1f0a33c86c96a1f07a9dab484cc2e`** / tree **`d4f9b568f705a17cca3274f0862d46f5b56b3b76`** |
| 조회 시 이후 변경 | integration/main 모두 위 값. 자동 포함한 변경 없음 |
| 로컬 읽기 사본 | `c9b26b7fa8f3fdb7fc3b386379aa3e9c8c1e6abd`, tree272faf… / clean. merge commit identity와 다름 |

CP0110·CURRENT·README의 미병합 표시는 승인 기록 당시 상태다. 현재 Git의 실제 merge와 구분하며 CP0110을 소급 수정하지 않는다. 다음 정상 작업에서 CURRENT/README 현재 진입만 필요한 만큼 정합화한다. PR430 병합 기록만을 위한 PR은 만들지 않는다.

승인 head의 문서 내용은 동일 tree의 로컬 사본으로 읽고 PR/Git으로 현재 기준을 확인했다. 실제 integration merge에서 새 unit/행동 시험을 실행했다는 증거로 쓰지 않는다.

## 3. 재사용한 근거와 현재 검사 연결

- 승인 S0 `step-7d-coop-session-contract.md` §1~8, 특히 L121~136의 실제 경로/정책 예상과 후속 분리.
- 보존 Astra restart 판단의 새 제안 지위·접근 A·owner·S1~3·검증/보존 조건, S0 최종 검토·approved-handoff 및 CP0110 승인 범위.
- server-boundary-next-plan §4.1/4.2. §4.1 checkout 결속은 PR429에서 끝났으며 재구현하지 않는다. §4.2의 실제 server 허용 연결은 아직 판단 대상이다.
- 승인 Target §2.1/6.1/6.2, I2/I3, 현재 MO/CA·D0010 및 STEP7B §7 전체는 재판단하지 않는다.

이번에 실제 builder/helper/governance 호출부와 package/workflow 연결 중 필요한 부분만 읽었다. 전수 source/SQL 감사·외부 운영 재조사는 하지 않았다. 초기 2026-10-14/15 두 STEP7D 원문은 여전히 미확보이며 재검색·추정 복원을 하지 않았다.

| 현재 코드/줄 | 현재 consumer·제약 | 다음 변경안에서 필요한 최소 대응 / owner |
|---|---|---|
| `scripts/check-game-platform-vnext-boundaries.mjs` L178~183 | server root의 tracked 파일 존재 자체를 거부. CLI와 governance가 실제 repository 검사를 소비 | 실제 server source가 있는 후보에서만 §4.2 대체 검사 diff 제시. source 존재 자체를 통과 조건으로 삼지 않음 / boundary·publication owner |
| builder L6, L136~138 | builder가 helper를 import하고 public 파일 집합의 참조/경계를 검사 | helper→builder 정적 역참조를 그대로 추가하면 순환 가능. 순수 검사와 checkout orchestration의 필요한 최소 분리만 후보 diff로 제시 / 검사 owner |
| builder L26~56, L286~303 | 실제 root/HEAD/index/worktree·source/policy/output·마지막 재검사에 결속. fixture 주입은 production 경로 아님 | PR429 기능 그대로 재사용. 과거 manifest/문서/flag에 의한 승인 경로 추가 금지 / publication owner |
| builder L119~121 | exact policy에 없는 새 browser runtime asset을 거부 | 실제 선택 모듈의 경로·closure·bytes delta에 해당하는 policy diff만 제시 / browser model·publication owner |
| publication workflow L35~42 | 현재 Guard 후 build/check 순서. 별도 governance도 boundary를 호출 | 실제 server 후보로 발생하는 순서 문제만 최소 연결안에 포함. 독립 CLI/governance에 같은 fail-closed 의미 도달. skip/continue-on-error 금지 / CI·Guard owner |
| model oracle selection L69~73 + 빈 models | 미등록 모델/조합 거부 | 후보 unit 성공으로 등록/지원 flag를 추가하지 않음 / model oracle owner |

이 표는 새 결함 판정이나 과거 준비 승인의 번복이 아니다. 실제 server/browser 변경에 필요한 연결 범위다. 직접 사용자 요구에 legacy ID/f를 새로 만들지 않았다.

## 4. S1 후보의 최소 의미·경로·지원 경계

| 범위 | 다음 구현 후보에 포함할 것 | 포함/주장하지 않을 것 |
|---|---|---|
| client 단일 채택/복구 | authorized current-state의 한 owner, 현재 context/revision·initial/live race·quiet loss·gap/overflow·ACK loss/중복 처리와 Core의 단일 동기 반영 연결 | 독립 Snapshot/Reconnect 엔진, 실제 권한을 fixture/client 판정으로 대체, 신규 게임 runtime 진입/지원 등록 |
| 저빈도 제어/backend | membership·ready/start/rematch·command identity/hash·terminal/current 조회의 실제 필요한 부분과 PG finalizer 경계. 실제 command/owner/권한/현재성 책임을 코드·미구현 목록으로 명시 | PG를 연속 상태 전체에 적용, memory apply를 C로 표현, 기능 없는 no-op 서버/empty server를 공개 제외 근거로 사용 |
| 첫 제품에서 미정인 조건 | 초기 start 등 실제 승인 조건을 찾을 수 있는 범위만 구현. 미확인 전이는 명시 미구현/거부와 필요한 입력을 반환 | 가짜 hostless/ready/start/재대결 예외로 공백을 채우기, 미구현인데 성공 ACK 반환 |
| transport/native P | S1에 실제 포함할 최소 연결과 미구현인 native 경계를 정확히 분리. SDK/언어/버전은 필요한 기능에 한해 선택 근거 제시 | WSS 후보를 자동 production 선정으로 기록, Node write/자동 flush/앱 queue를 P로 부르기, 미구현 native P를 mock으로 PASS |
| Core·Adapter | 기존 Core API 소비. 모델 호출과 site 정책/실제 admission 책임 분리 | Core 재작성/공개 API 변경, site Auth/게임/API/SQL 이관, 필요하지 않은 S3 기능 선제 연결 |
| H1~3 | 다음 모델의 의존 여부와 실제 본체 owner를 기록. 선택하지 않았으면 미지원/후속 | wrapper만 추가해 BGM 내부 Audio/DOM·old disposer·handler/dialog late 완료를 해결했다고 선언 |

불완전한 후보는 구현된 부분과 미구현 부분을 명확히 제출할 수 있다. 전체 S1 완료·실제 online 지원·STEP7D 완료로 제출해서는 안 된다. 실제 DB/native 환경 증거가 없는 부분은 NOT_RUN/미입증이다. 정상 함수명·자료구조·테스트 기법·최소 파일 분할은 구현 담당이 정한다.

| 경로/예상 변경 | 현재 → 후보 영향 | 원칙 |
|---|---|---|
| `games/shared/vnext/models/coopSession.js` 등 실제 필요한 최소 model 파일 | browser 항목 증가. 직접 후보1파일만이면384→385이나 closure가 확정한 수를 사용 | 기존384 항목/bytes는 의도한 변경 외 보존. 숫자 맞추려고 합치거나 기존 항목 삭제 금지 |
| `games/shared/vnext/adapters/siteSession.js` | 필요할 때 추가 +1. S3까지 필요 없으면 지금 생성하지 않음 | S1에 반드시2파일/386으로 미리 고정하지 않음. main382·Core 미이식은 별개로 불변 |
| `services/game-platform-vnext/` 실제 저빈도 backend source | public +0이어야 함. 현재 production Guard는 거부 | 실제 후보 source와 제외/참조/bytes·provenance 검사를 함께 검토. 빈 canary/폴더명/.gitignore/flag는 증거 아님 |
| 신규 DB 지원물 | 기존 `supabase/` 관리·배포 경계 안에서 실제 모델이 필요한 위치/권한/migration 후보만 | 기존 SQL 무이관, 실제 DB 적용/운영 변경 없음. CLI·권한·배포 요구는 구현 시 관련 범위만 확인 |
| tests/scripts/workflow/policy | 의미 있는 계약 + 실제 경계 연결에 필요한 최소 diff | tests/docs에 production 구현 숨기기 금지. PR429/tar/parser/identity 엔진 반복 제작 금지 |

현재 이 표의 파일/patch를 생성하지 않았다. **main382/integration384/public bytes와 Guard는 지금 불변**이다. 후보에서의 정책 증분·server 연결은 다음 별도 허용·검토 대상이지 이번 승인 결과가 아니다.

## 5. 후보 검증과 Astra가 볼 실제 패키지

다음 후보 준비가 허용되면 복구 가능한 원본과 분리한 임시 full checkout에서만 작업한다. 실제 Git base/후보 HEAD/tree를 기록한다. checkout 검증은 그 실제 local revision으로 수행하며 fixture revision/inventory를 주입해 성공시키지 않는다. 로컬 후보 결과는 remote artifact/deploy/browser/모델 지원으로 승격하지 않는다.

제출할 최소 자료:

1. base e987d388…에 대한 실제 patch, 파일 목록·해당 source 역할·추가 의존성/명시적 미구현, local 후보 HEAD/tree.
2. 실제 public 후보 path/size/hash/closure·policy revision diff, 기존384 bytes 보존/의도 변경 목록. server source/artifact가 public에 없는 실제 source/output 비교.
3. Guard 대체 후보의 call graph와 CLI/governance/workflow 순서 diff. 누락·오염·다른 revision/dirty 입력·검증 실패는 모두 차단하며 새 성공 evidence를 남기지 않음.
4. initial/live·quiet last loss·gap/overflow·same seq/different owner/view·ACK loss/동일 ID/hash·T01~03/late cleanup의 의미 있는 offline 계약 결과. fixture는 fixture라고 표시.
5. publication/Guard 회귀 및 full checkout의 관련 기존 검증 결과. 실제 DB/native/browser/두 client 미실행 항목·필요 환경을 각각 표시.

실제 package 바깥의 alias/reference/build 유입 검사는 기존 것을 재사용한다. 기존 계약을 모두 다시 감사하거나 운영을 재조사하지 않는다. 후보가 §4.2의 의미를 만족하지 못하면 단독 Guard 완화로 우회하지 말고 원문/줄·consumer·owner·영향·최소 보완을 반환한다.

**Astra 검토가 다음에 판단할 범위**는 이 실제 후보의 server 제외 연결·신규 browser 경로/정책 범위 및 S1 부분 구현의 승인 의미 일치다. 오늘 이 일반 계획만으로 실제 후보가 적합하다고 사전 판정하지 않는다. 후보 검토 후 사용자가 허용한 범위에서만 기존 정식 Git 절차/검토 PR로 진행한다.

## 6. 사용자 결정 범위와 미완료 의무

지금 사용자가 다음으로 허용할 구체 범위는 **§4~5의 저장소 밖 S1 구현 후보 패키지 준비·임시 full checkout 오프라인 검증**이다. 이것은 기존 branch/integration/main 변경·commit/push·PR·Guard 활성화·실제 DB/browser/배포 허용을 포함하지 않는다. 임시 후보에서 실제 HEAD 결속을 검증하는 local commit만 그 후보 준비 범위로 명시한다.

이 제한은 새 스킬 승인 게이트가 아니다. S0 계약 L123~136·CP0110·server-boundary-next-plan §4.2가 분리한 실제 server/정책 변경 범위를 구체 검토 가능하게 만드는 제안이다. 승인 provider/운영/Target/A/C/P·D0010/재대결 정책을 다시 선택하는 질문은 하지 않는다.

안전11·current A/C/P 전체·DB online 요구·H1~4/단일 채택/복구·초기 hostless와 미승인 재대결 예외 금지, 빈 모델/미구현 조합 미지원·runtime/online 차단을 유지한다. S2의 연속 authority/취소 손실·시간 정책 및 S3의 실제 선택 기능은 자동 실행하지 않는다.

fixed M/run39191903797/attempt1/actual public artifact12160182245는 별도 P1 판단이다. 이번 새 integration/candidate 공개 증거가 아니다. browser actual bytes/옛 cache/SW UNKNOWN·신규 게임 loaded bytes·미래 server 공개 제외·원복/삭제/복구/비용 전체 후속 의무 유지. 기존 소비자/원본/과거 승인/원ID·줄·f·STEP7B §7 전체를 보존한다.

## 7. 다음 Sol/Codex 실행 프롬프트 — 사용자가 이 범위를 지시할 때

```text
Game Platform vNext STEP7D S1의 실제 저빈도 제어·단일 채택/복구 구현 후보를 준비해줘.
담당 Sol/Codex. post-pr430-s1-entry-plan 전체와 승인 S0 계약/보존 Astra 판단,
server-boundary-next-plan §4.2·CP0110의 승인/보존 범위를 먼저 읽어줘.

고정 integration e987d38829334bd6435a5a74b1fbf9f3851cbaa0 /
tree272fafcfcd357c41f962984803fb1eb2a2e2cf82와 별도 main M을 구분해줘.
현재 remote/PR430 실제 병합·이후 변경부터 확인하고 자동 포함하지 마.

이번은 저장소 밖 후보 patch/bundle과 독립 임시 full checkout 검증만 허용한다.
원본 checkout/branch·integration/main·remote는 변경하지 말고 commit/push·PR을 만들지 마.
검사 checkout 결속에 필요한 임시 후보 local Git commit은 허용하되
실제 base/HEAD/tree와 LOCAL_CHECKOUT_PUBLICATION 결과만 기록해줘.

S0 §1~4의 저빈도 session/control·command identity/hash·terminal/current-state와
단일 채택/복구의 실제 필요한 최소 부분을 구현 후보로 작성해줘.
Core 단일 동기 반영·실제 backend admission·A/실제 DB commit C/native P를 구별해줘.
PG를 연속 상태 전체로 확대하거나 memory apply/ACK를 C로 부르지 마.
미정 start/재대결 조건이나 실제 caller/권한을 no-op/fake 성공으로 채우지 말고
구현된 부분·미구현·필요 입력을 정확히 분리해줘. 함수/자료구조/최소 분할은 정상 선택에 맡긴다.

실제 server source 후보와 같은 변경의 공개 제외 연결 diff를 함께 제시해줘.
기존 builder/PR429 checkout 검증을 재사용하고 순수 참조 검사·검증 orchestration의
최소 분리, 독립 CLI/governance/workflow의 동일 fail-closed 의미를 유지해줘.
새 server만으로 통과, allow flag, 문서/fixture/과거 M artifact 허용, Guard skip은 금지한다.
정식 production Guard는 바꾸지 말고 후보 패키지의 대체 검사안을 Astra 검토 대상으로 남겨줘.

새 browser 경로/closure에 필요한 policy 최소 diff와 path/type/size/hash·revision,
기존384 bytes 보존/의도 변경과 server public+0 실제 source/output 근거를 남겨줘.
main382/정식 integration384·Core 미이식은 유지한다. 지원/oracle 등록·신규 게임 runtime은 추가하지 마.
initial/live·quiet/gap/overflow·ACK loss/중복·다른 owner/view·T01~03·late cleanup과
오염/다른 revision/검증 실패 차단의 의미 있는 계약을 검증해줘.
관련 publication/Game Platform/Guard 검증은 후보 checkout에서만 수행하고
fixture 주입을 production 증거로 쓰지 마. PR429 준비·전수 source/SQL 감사는 반복하지 마.

실제 DB/native/browser/audio/두 client/운영 시험·설정·dispatch/rerun/upload/deploy는 하지 마.
H1~3 무보완 wrapper 지원·H4 가짜 연결·기존 consumer/API/Registry metadata/barrel·SQL 이관은 금지한다.
승인 Target/STEP7B §7 전체/current A/C/P/D0010/안전11/hostless와 미승인 재대결 예외 금지,
fixed M의 별도 P1 판단·browser/cache/SW UNKNOWN·전체 후속 의무를 유지해줘.

원본 저장소 밖에 patch/bundle·실제 후보 head/tree·검증·미구현·최소 허용 diff와
Astra 검토 인수인계를 남기고 멈춰줘. 상위 의미 변경 필요 시 원문/줄·consumer·owner·영향·
최소 보완·사용자 결정 범위를 반환하고 직접 요구의 legacy ID/f를 만들지 마.
후보 코드를 작성했다면 '후보 구현 작성/정식 반영 없음/실제 지원 미입증'으로 정확히 기록하고,
STEP7D 미완료·vNext 행동 NOT_RUN·운영 UNKNOWN을 유지해줘.
```

이 프롬프트는 다음 후보 준비 범위의 제안이며 현재 실행된 명령이 아니다. 후보 검토 후 정식 구현 반영·PR 제출 허용은 별도다.

## 8. 이번 수행 사실

실제 remote/PR430 병합 및 merge tree 확인, 승인 S0/CP0110·기존 보존 근거와 builder/helper/호출부의 필요한 읽기,
이 다음 범위·프롬프트 작성만 수행했다. 저장소 수정·새 branch/commit/push/PR·Guard/policy/workflow 변경·
server/model/Adapter 파일 생성·새 unit/DB/browser/행동 시험·운영/외부 재조사·배포는 하지 않았다.

**S0_DOCUMENT_RESULT_APPROVED / PR430 INTEGRATION_MERGED / S1 실제 변경 패키지 미작성 /
STEP7D 미완료 / 모델·Adapter 미착수 / vNext 행동 NOT_RUN / 운영 UNKNOWN / browser·cache·SW UNKNOWN**.
