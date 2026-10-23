# Game Platform vNext STEP7D — PR431 병합 후 S1 backend 경계와 다음 최소 Slice 판단

2026-10-22 KST · 담당 역할 **Astra** · 저장소 밖 판단/전달 문서.

**S1 부분 결과 APPROVED / PR431 INTEGRATION_MERGED / STEP7D 미완료 / 실제 지원 미입증 / vNext 행동 NOT_RUN / 운영 UNKNOWN / browser·cache·SW UNKNOWN.**

## 1. 결론과 다음 작업

**다음 최소 코드 작업은 ‘ready 변경·durable command ledger·current/status 조회의 비공개 PG 저장부 후보’로 한정하는 것이 적절하다.** 기존 client model과 server proposal을 다시 만들지 않는다. 실제 SQL 저장 절차와 최소 server 호출부를 작성하되, 아직 없는 trusted ingress·전체 current/fence·session bootstrap·native P를 성공 stub으로 채우지 않는다. 완성된 backend finalizer 또는 사용 가능한 online 모델로 제출하지 않는다.

기존 ready proposal을 실제 사용자 요청부터 DB 확정·응답까지 잇는 수직 Slice는 타당한 다음 목표다. 다만 **지금 확보한 소스에는 그 수직 경로의 실제 caller/세션 생성·입장/권한 writer·native 송신 구현이 없다.** 따라서 바로 외부 호출 가능한 ready API를 여는 범위는 권고하지 않는다. 그보다 작은 저장부는 먼저 구현·검토할 수 있다. 전체 S1·S2 연속 상태·S3 Adapter 완료를 이 부분 코드 작성의 선행조건으로 요구하지 않는다.

다음 실행 담당은 **Sol/Codex**다. 권고 제출 방식은 **저장소 밖 patch/bundle + 독립 임시 full checkout의 offline 검증 → Astra 부분 후보 검토**다. 정식 branch/remote/PR 변경·실제 DB/native 시험은 그 후보에 자동 포함하지 않는다. §10에 바로 전달할 실행 프롬프트를 둔다. 이 문서 자체는 구현 또는 다음 실행의 승인 기록이 아니다.

이번 판단에서 승인 Target/provider/운영/A·C·P/D0010을 바꿀 필요는 발견하지 않았다. 필요한 것은 구현 책임의 연결이다. 아래의 파일명·데이터 배치는 후보이며 정상 함수명·자료구조·최소 분할은 Sol/Codex가 정한다. 초기 STEP7D 두 원문의 복원이나 과거 정책 승인으로 기록하지 않는다.

## 2. 실제 Git·기존 증거·읽기 범위

### 2.1 고정 입력과 현재 원격

| 구분 | 확인 결과 |
|---|---|
| 실제 integration | **990ad56adde4e2f798fdd974fbe5b4d21863173e** / tree **07db48045ee6b095bf306229eda0be12d43c4879** |
| PR431 | [closed / merged=true](https://github.com/limbit95/limbit95.github.io/pull/431), **2026-10-22 15:07:21 KST** 병합 |
| merge 부모 | e987d38829334bd6435a5a74b1fbf9f3851cbaa0 + 승인 기록 head **5ef7762ba28daac7c11be12741ec2420e85e3885** |
| PR API의 base | e987d388… / feature/game-platform-vnext-integration. 병합 당시 base와 현재 branch ref990ad56…를 구분 |
| 별도 main M | **0e4089f345c1f0a33c86c96a1f07a9dab484cc2e** / 고정 tree **d4f9b568f705a17cca3274f0862d46f5b56b3b76** |
| 이후 이동 | 이번 읽기 전용 ref 조회에서 integration/main 모두 고정 SHA와 일치. 자동 포함한 후속 변경0 |
| 실제 읽은 local 사본 | step7d-s1-submission의 HEAD **5ef7762…**, tree **07db4804…**, tracked clean. 실제 merge와 같은 tree/다른 revision이며 checkout/ref를 바꾸지 않음 |

CP0112·CURRENT·rebuild README의 INTEGRATION_NOT_MERGED/integration384는 승인 기록 당시 상태다. 지금은 **integration385/main382**다. 과거 checkpoint를 소급 수정하지 않았고 현재 문서도 이번에는 변경하지 않았다. 다음 정식 변경 허용 시 CURRENT/README의 현재 진입만 최소 정합화하면 된다. 병합 기록 전용 PR은 필요 없다.

### 2.2 증거 인정 범위

| 증거 | 이번 인정 범위 |
|---|---|
| 승인 S1 source / F1~3·F1-R1 | 기존 해소·보존 판단 재사용. 새로운 재시험·재구현 없음 |
| 기존 443/443·publication39·model/server25 | 해당 기록 revision의 offline/unit 결과. actual DB/native/모델·게임 행동 PASS 아님 |
| local receipt5ef7762… | LOCAL_CHECKOUT_PUBLICATION/files385. 실제 merge990ad56…의 새 receipt로 재사용하지 않음 |
| CI runs39731233551 / 39731233566 / 39731233581 | 이번 API 조회에서도 completed/success/attempt1, head5ef7762… |
| CI actual checkout dd46e3edda9310c6faa152ff6c3c5e1d0bba7d0b | 보존 로그의 합성 merge. 5ef7762·990ad56과 tree07db4804는 같지만 revision은 다름 |
| merge990ad56 workflow 조회 | head_sha로 조회한 실행0. 이 merge에서 새 CI/build/check가 성공했다고 쓰지 않음 |
| evidence12404842553 | site-publication-evidence CI manifest. actual Pages public artifact가 아님 |
| actual public upload/remote artifact 검사/deploy | 기존 실행의 SKIPPED 유지. 이번 실행·재시도·배포 없음 |

post-pr431-next-handoff 전체, s1-approved-handoff 및 s1-final-review 전체를 읽었다. AGENTS → 실행계획1.6의 적용·진행 규칙 → rebuild README → CURRENT → CP0112 → PR/Git을 복원했다. 승인 S0 계약 전체, entry-plan, server-boundary-next-plan §4.1/4.2, 보존 restart 판단의 S1/owner 관련 범위, STEP6 Target §2.1/6.1·I2/I3, STEP4B design-finalization §2/3/B5와 **D0010 closeout §2/3의 현재 delta**, STEP7B §7 전체를 읽고 재사용했다. 실제 model/server·publication 연결 및 DB 계약/관리 진입만 필요한 만큼 읽었다.

초기 game-platform-vnext-step7d-plan-and-handoff-2026-10-14.md와 game-platform-vnext-step7d-astra-judgment-2026-10-15.md는 여전히 미확보다. 새 보존 경로가 없어 검색을 반복하지 않았다. 서비스 root의 현재 tracked source가 sessionControl.mjs 하나인 사실과 승인 미구현 목록으로 범위를 정했으며, 이를 운영 환경 전체에 파일/서비스가 없다는 조사 결과로 확대하지 않는다.

## 3. 원문에 따른 실제 owner/API 연결

아래 저장소 줄은 tree07db4804…의 읽기 사본 기준이다. 새로운 legacy ID/f를 만들지 않았다. S0는 `docs/game-platform-rebuild/artifacts/step-7d-coop-session-contract.md`, DF는 `step-4b-design-finalization.md`, Z1은 `step-4b-z1-decision-and-design-closeout.md`를 뜻한다.

| API/경계 | 실제 필요한 입력·처리 | owner와 근거 | 현재 상태 |
|---|---|---|---|
| trusted caller | 검증한 JWT 서명/algorithm/issuer/audience/sub/session_id/exp. browser의 subject·role·session·view는 요청값이며 서버 신뢰가 아님. 요청 subject는 검증 sub와 결속 | ingress, DF L22~37; S0 L38~39/64 | 미구현. `js/auth.js`의 initialize/subscribe와 `games/shared/accessGate.js` L6~26의 client allowed는 이 경계가 아님 |
| current predicate | primary의 새 snapshot에서 auth.users 존재/삭제/ban, auth.sessions 소유/not_after, JWT exp, profiles 승인/실제 permission, match membership/action/view, owner/incarnation/closed, 외부 current generation을 모두 검사 | 비노출 predicate/finalizer, DF L24~35 | 기존 proposal의 member 포함 검사는 이 AND predicate를 대체하지 않음 |
| readCurrent | 실제 current admission 뒤 허용한 recipient/view의 완전 상태를 일관된 cut으로 읽음. owner/stream/revision/context를 결속하고 private·다른 subject 정보는 투영에서 제외. 반환 직전 gate의 fresh P가 별도 필요 | projection + gate; S0 L70/85~98, DF L67~73 | 현재 model의 주입 reader만 있음. 저장부 조회 후보를 먼저 만들 수 있지만 authorized public API는 아님 |
| observe | 검증된 연결/구독 scope가 준비된 후 invalidation을 전달. 준비 중 invalidation 보존·listener 단절 처리·독립 quiet reconciliation 필요. event payload를 최종 state로 채택하지 않음 | transport + model의 단일 채택 owner; S0 L89~98 | 실제 연결 미구현. 다음 저장부 Slice에서는 wire listener 구현/가짜 ready를 넣지 않음 |
| submitCommand | 신뢰 subject + 원 command identity/hash + 현재 session/match/owner/view/action을 검사. 잠금 후 fresh predicate를 거쳐 같은 transaction에서 ready 상태/revision/원장을 원자 확정 | finalizer, server L20~42; Z1 L13~20 | 현재는 immutable proposal만 있음. 저장부는 그 뒤의 실제 SQL 책임 후보 |
| readCommandStatus | 현재 caller의 조회 권한을 다시 검사하고 같은 scoped ID/hash 원장을 조회. 없음은 UNKNOWN, 권한 실패는 정보 비공개. 기존 record가 있어도 fresh P 없이 외부 응답 금지 | ledger query + predicate + gate; server L45~52; S0 L52~56 | 이미 읽은 record 검사만 구현. durable 조회는 후보 범위 |
| Core commit/현재성 | await 결과를 받은 후 단일 동기 반영, 직전 현재성 검사. callback 재진입·thenable 제한 유지 | Core/model, S0 L35~42; model L42~59/174~209 | 승인된 부분 구현 보존. backend admission/DB atomicity는 별개 |

실제 DB 호출자는 승인 DF L43~48의 **전용 login·함수 EXECUTE 권한**으로 제한한다. browser anon/authenticated·service_role·PostgREST authenticator나 임의 claims GUC를 trusted caller로 바꾸지 않는다. runtime에 postgres/DDL/Auth table 직접 SELECT 또는 raw write 권한을 주지 않는다. 승인된 좁은 `postgres` 소유 SECURITY DEFINER 경계는 넓은 owner 권한을 고정 함수로 제한한다는 의미이며, 새 최소권한 owner가 이미 동작한다고 재해석하지 않는다.

## 4. 다음 최소 코드 Slice — 포함·미포함

### 4.1 권고 범위: 비공개 PG 저장부 후보

현재 가능한 실제 작업은 다음 저장 책임을 source/SQL 후보로 만드는 것이다. 단순 interface 문서·빈 server·성공을 반환하는 mock만 제출하는 것은 이 범위를 충족하지 않는다.

1. **session/match 저장 상태와 안정 anchor**, owner incarnation·revision·현재 membership/ready 상태를 저장하는 최소 구조. 게임별 상태 엔진·공통 모든 게임 schema를 만들지 않는다.
2. **명령 durable ledger와 동일 transaction mutation**: 기존 set-ready 의미만 실제 저장 절차로 구현한다. session/match/subject/contract/command ID의 유일성 및 hash 충돌 검사, revision 증가, state/ledger의 동시 commit·rollback을 표현한다. command 원장은 다른 여섯 dedup 의미를 대체하지 않는다.
3. **current projection과 same-ID status의 저장 조회**: 완전 state 한 cut, 최소 반환 필드, 상태 없음/충돌/terminal/권한 미연결 구분. 재실행·자동 새 ID 발급 금지.
4. **동일 connection/transaction 경계의 최소 server 연결**: 성공은 commit 확인 뒤만 관측하고, COMMIT 응답 유실은 UNKNOWN으로 보존한다. connection 반환·cancel/rollback 실패·late 완료의 자원 owner를 명시한다. generic ORM/repository/권한 엔진은 만들지 않는다.
5. **runtime 미개방과 미구현 명세**: 아래 실제 admission과 native P가 아직 없으므로 network listener, production bootstrap, public RPC/GRANT, support/oracle 등록을 추가하지 않는다.

SQL의 내부 저장 primitive는 **최종 사용자 인가 endpoint가 아니다.** 설치 권한/격리된 시험 owner 외 일반 runtime에서 호출할 수 없게 두고, predicate가 연결되지 않았는데 `authorized=true`, test-mode, 정적 permit, 기본 allow 함수로 실행 가능한 production 경로를 만들지 않는다. 후속 finalizer가 이 primitive를 소비할 때에는 같은 transaction의 잠금/현재 검사/즉시 저장 경로로 연결해야 한다. 외부 연결이 없는 저장부 코드의 정상 fixture 실행은 ‘스토리지 계약 후보’ 증거이며 A/실제 지원 증거가 아니다.

이는 **미구현 API가 성공하는 no-op 서버**와 다르다. 실제 저장 SQL/transaction 처리를 작성하되 외부 admission을 아직 제공하지 않는 부분 구현이다. runtime에 넘겨 줄 내부 callable 범위와 ACL이 이 분리를 지키지 못하면 그 후보를 제출 가능한 것으로 판정하지 않는다.

### 4.2 최종 PG finalizer가 지켜야 할 순서

최종 구현의 불변량이며, 전부를 다음 작은 저장부에서 완성했다고 표시하지 않는다.

| 순서 | 반드시 지킬 의미 |
|---|---|
| caller/envelope 확인 | subject/session은 trusted ingress에서만 도출. 문서 contract/wire/source/owner revision을 별개로 검증. 원 command를 정규화해 hash를 재계산하고 client가 준 hash·proposal.next를 그대로 권위로 믿지 않음 |
| 안정 잠금 확보 | subject/권한 anchor·session/match owner anchor·command 직렬화에 필요한 잠금을 정해진 순서로 획득. 처음 ledger row가 없는 경쟁에도 순서가 성립해야 함. unique constraint는 최종 방어이며 선행 SELECT만으로 중복 안전을 주장하지 않음 |
| 잠금 뒤 현재 검사 | 잠금 대기 전에 얻은 allow/snapshot은 A 근거가 아님. 필요한 잠금 뒤 새 statement snapshot의 predicate와 기한을 검사. 이후 대기/제어 반환이 생기면 재검사. transaction 시작 시각을 fresh 검사 시각으로 쓰지 않음 |
| 명령 재검증/A | 현재 WAITING/member/owner/revision·set-ready boolean 의미 및 current 권한을 검증한 하나의 명령만 같은 DB 실행 경로의 고정 저장 절차로 착수. 앱에 allow를 반환한 뒤 별도 SQL로 저장하지 않음 |
| 저장/actual C | state/revision/원장 및 실제 필요한 outbox를 같은 transaction에 기록. anchor는 C/rollback까지 유지. 함수 반환·row 작성·client ACK는 actual C 아님. 실제 commit 관측은 별도 trace에 연결 |
| 응답/P | C 또는 기존 ledger 발견을 송신 허가로 쓰지 않음. recipient/session/view/payload마다 fresh P. 알려진 만료/철회/실패 시 결과·duplicate·snapshot도 차단 |

Z1 L13~20 및 D0010을 그대로 적용한다. 같은 적법 A의 일반 I/O late C만 제한 수용한다. retry·새 transaction·새 command는 fresh A다. known expiry 뒤 새 A는 금지한다. 필요 잠금/검사가 수행되지 않은 현재 storage primitive 호출을 A로 계측하지 않는다.

**명령 hash/ordering 구분:** 현재 `sessionControl.mjs` L15~17의 hash는 contract/session/match/subject/kind/payload다. view/owner/revision은 별도 admission/ordering 입력이며 이 문서에서 기존 hash 의미를 몰래 넓히지 않는다. 동일 논리 명령의 상태 조회는 원 ID/hash를 유지하고 현재 view의 조회 권한을 새로 확인한다. 최초 제출의 expected owner/revision·scope는 finalizer 입력에 명시하고, stale 명령을 현재 상태로 다시 계산해 새 명령처럼 적용하지 않는다. 서버 DB는 supplied `next` 전체를 저장하지 않고 검증된 ready 변경만 적용한다. SQL/JS가 중복 정의하는 canonicalization이 있다면 기존 hash와 동치 계약이 필요하다.

**중복 처리:** 같은 scope/ID/같은 의미는 mutation 한번·기존 확정 record 조회로 끝나야 한다. 같은 ID/다른 hash 또는 의미는 충돌이다. ledger 부재는 미실행 확정이 아니라 UNKNOWN이다. ACK 유실 후 조회와 재시도를 분리하고, 명시 재시도도 동일 identity/hash 및 fresh A가 필요하다. 다른 subject의 ID 추측으로 record 존재/내용을 노출하지 않는다. process 메모리 Map·TTL token만으로 durable dedupe를 주장하지 않는다. 원장 보존·삭제는 기존 삭제/복구 의무와 함께 후속으로 닫고 무기한 개인정보 보존을 기본값으로 정하지 않는다.

### 4.3 lifecycle/native 중 다음 범위와 후속

| 항목 | 다음 저장부 후보에 포함 | 후속까지 미구현/차단 |
|---|---|---|
| WAITING set-ready | 실제 저장/원장·revision·충돌·rollback·조회 | 실제 사용자 submit endpoint/admission |
| terminal | 이미 terminal/closed인 실행의 ready 거절·부활 금지·최초 terminal ID/time 변경 방지, 읽는 경우 권한 있는 투영 요구 | 종료 명령·최소 종료기록/외부 outbox 전송·30일 삭제 전체 구현 |
| 최초60초·abort | 저장부가 받은 권위 closed/abort/first-failure 상태를 무시하거나 reset하지 않음. t0 미확인 재개 불가, deadline 경계에서 abort 우선이라는 precondition/부정 계약 | 실제 최초 실패 관측·외부 durable first_failure_at·scheduler/controller·process loss 복구/정각 집행. DB bool 하나로 구현 완료 금지 |
| bootstrap/join | 없는 session/match/멤버는 명시 실패. 실환경용 임의 seed 없음 | 세션 생성권자·참가 권한/정원·중복 참가·초기 owner/stream·최초 match 발급과 합법적 기존 caller 연결 |
| start/rematch | 현재 unsupported 거절 유지 | 미정 초기 start 조건 및 같은 참여맥락/ready/host start의 실제 집행. hostless 예외 추가 금지 |
| owner fencing | 현재 owner/anchor의 저장 직렬화·stale owner 거절 | gate close/drain 확인 전 takeover 금지, 실제 controller/old sender 폐쇄 |
| native P/WSS | 송신용 candidate 데이터와 permission을 분리, 외부 송신하지 않음 | Linux/OpenSSL memory BIO→nonblocking send, fresh 검사·부분 prefix/suffix·EAGAIN·FD 소유/종료의 실제 구현 |
| observe/client/Adapter | 기존 client 계약/bytes 그대로. 저장 revision은 후속 invalidation 근거로만 설계 | WSS 구독 ready·quiet 확인 wire 경로·site Adapter·H1~4 실제 연결 |

terminal 뒤 늦은 C/ACK가 LIVE를 부활시키면 안 된다. 이미 진행 중 transaction을 반드시 회수했다고 주장하지 않고, 저장/송신/실행 상태를 각각 판정한다. PG가 불능이면 controller의 외부 first_failure/abort 경로가 필요하며, 그까지 불명일 때 새60초·가짜 terminal을 발행하지 않는 DF B5를 유지한다.

## 5. 부족 입력과 최소 해결 경로

다음은 PR431의 신규 결함이나 상위 승인 재개방이 아니라 **외부 연결 전에 남은 구현 입력**이다. 상위 의미 변경 없이 구현 가능한 부분은 진행할 수 있다.

| 부족 입력 / 근거·현재 consumer | owner | 영향·최소 해결 경로 |
|---|---|---|
| 실제 trusted ingress·전용 DB caller / DF L22~48, server L20~22 | ingress/DB 권한 owner | client accessGate만으로 finalizer를 열 수 없음. 고정 검증 issuer/audience/algorithm과 credential 분리·session_user/EXECUTE 제한을 가진 실제 경로를 후속 구현. 지금 특정 운영 credential·SDK를 요구하거나 조회하지 않음 |
| 실제 session bootstrap·입장 원천 / S0 L70~76, model context와 server membership | session/product owner | 새 WAITING row를 테스트 seed로 만들 수 있어도 합법적 운영 세션 생성은 아님. 최초 생성/참가 주체·현재 권한·초기 owner/stream·중복 join을 후속 구체화. 초기 start 조건을 fake host/ready로 채우지 않음 |
| current external generation·전체 writer fence / DF L33/54~63, Z1 L19 | controller/current predicate/site writer owner | 내부 R의 pre-close/ACK/current 기록 및 권한 DML 모두에 대한 강제가 미연결. 일부분 RPC 이름만 열거해 완전성 주장 금지. 실제 연결 변경 때 보호 column/table 최종 guard와 관련 caller/기존 회귀만 검토. 현재 사이트 SQL 변경 없이는 활성화하지 않음 |
| 실제 native sender / DF L67~82 | gate/native owner | DB 확정/권한 있는 read만으로 보호 정보를 보내면 안 됨. 후속 최소 gate가 fresh recipient/view/payload·부분 송신·old sender 격리를 제공하기 전 socket 응답 경로 미개방 |
| 최초 실패·abort·terminal durable owner / DF L132~136, S0 L75~77 | controller/session/record owner | storage helper의 시간 필드만으로60초 집행을 증명할 수 없음. 후속 외부 failure 기록/abort·terminal 원장과 crash trace 필요. 전체 기록/삭제/복구 의무 유지 |
| 실제 설치 버전/정책 manifest 및 disposable 환경 / DF L35/41~50, S0 L158~165 | 환경/검증 owner | managed Auth 정책·role/ACL·PG 버전을 추정하지 않음. 실제 DB 시험 허용 시 비밀 없는 버전/설정 manifest·격리 DB·실제 caller를 확인. 지금 SDK 선택이나 운영 재조사를 선행 요구하지 않음 |

**사용자에게 새 provider/운영/권한 상한 결정을 요청할 이유는 현재 없다.** 다음 결정은 §4의 저장소 밖 부분 후보 작성·offline 검증을 허용할지라는 작업 범위다. 향후 bootstrap의 새 제품 조건이 기존 승인으로 정해지지 않거나 site API 호환이 깨질 때에만 해당 원문/줄·consumer·owner·영향·최소 보완·사용자 선택 범위를 반환한다. 이를 지금 전체 S1 설계 재시작 또는 전수 source/SQL 감사로 확대하지 않는다.

## 6. 실제 경로·최소 영향표

아래 추가 경로는 **후보 위치**이며 이번에 만들지 않았다. SQL filename·언어·함수 개수는 선제 동결하지 않는다.

| 경로 | 다음 후보에서 가능한 최소 변경 | public/consumer/검사 영향 |
|---|---|---|
| `services/game-platform-vnext/sessionControl.mjs` | 기존 hash/proposal/ledger 검사 재사용. 가능하면 bytes 그대로 | 기존 모델 의미 재판단 없음. 임의 next 쓰기 권한을 부여하지 않음 |
| `services/game-platform-vnext/`의 최소 PG 저장 호출 모듈 | dedicated transaction의 begin/commit/rollback/unknown·ready/current/status SQL 호출. network listener/인증 fallback/송신 없음 | server public+0. 기존 root/HEAD/index/raw bytes 검증에 포함 |
| `supabase/game-platform-vnext/` 신규 DB 지원물 후보 | 기존 Supabase 관리 경계 안에서 새 private 상태/anchor/ledger·저장/read primitive·명시 ACL의 forward SQL 후보. 기존 site/game SQL 수정/이관 없음 | public+0. production 설치 이력으로 표시 금지. runtime EXECUTE/외부 endpoint는 admission 미연결 동안 개방하지 않음 |
| `tests/game-platform-vnext-*.test.js` | flat discovery로 transaction 호출 순서·hash/중복/미연결 거절·UNKNOWN/cleanup 등 의미 있는 offline 계약 | 실제 SQL lock/ACL/commit 원자성 증거가 아님. tests에 production 구현 숨기기 금지 |
| `tests/game-db-integration/` 및 기존 disposable harness | 향후 별도 허용 시 새 DB 부분 테스트/설치 연결. 기존11scenario runner는 전체 모델 지원 판정 때 사용 | 지금 게임 ID/지원 oracle 가짜 등록 금지. start/rematch 미구현을 N/A나 빈 PASS로 채우지 않음 |
| `services/game-platform-vnext/` 전용 의존성 manifest/lock | 실제 PG driver가 필요한 경우에만 최소 고정 dependency. 기존 Node ESM과 PG SQL 경계가 우선 후보 | root browser package/lock 변경은 기본 범위에서 제외. server package도 실제 source/output 제외 확인. 버전/driver는 구현 시 공식 근거로 확인 |
| `games/shared/vnext/models/coopSession.js`, Core2, Adapter, Registry/barrel | 이번 후보 기본 변경0 | integration385 목록·기존385 bytes·moduleMaps 보존, main382/Core main 미이식 |
| policy/builder/boundary/workflow | 기본 변경0. 기존 build/check·CLI/governance 연결 재사용 | 새 browser 경로 없음. Guard allow/skip·새 receipt engine 없음 |
| 문서 | 후보의 구현/미구현·검증·승인 원문 연결만 최소 기록 | CP0112/과거 원문 보존. 정식 Git 기록은 후보 검토·제출 허용 뒤 별도 |

**SQL 제외 근거의 한계도 구분한다.** 현재 builder L11~23/71~84의 server raw-bytes/hash alias 대상은 `services/game-platform-vnext/`이며, `supabase/` 전체를 server root와 동일하게 읽는다고 주장하지 않는다. 새 SQL 후보는 별도로 실제 tracked source path/type/size/hash와 public385/output/build closure의 비유입을 비교해 제출해야 한다. sourceRevision에 포함됐다는 사실만으로 실제 SQL worktree bytes의 제외를 증명하지 않는다. 이는 기존 Guard 결함 재판정이 아니라 새 입력 경로의 증거 범위다. 최소 추가 증거로 충분하지 않고 production checker 입력 범위 변경이 꼭 필요하다면 근거·owner·영향·최소 diff를 반환하고 자동 Guard 확대/완화는 하지 않는다.

Node/PG driver는 내부 DB 연결용일 뿐 client 송신 P 구현으로 선정하지 않는다. native gate는 별도 승인된 Linux/OpenSSL 경계를 충족할 구현으로 남긴다. driver 자동 retry/pooled connection 이동이 transaction·command identity를 흐리지 않아야 한다. 정상 언어·라이브러리 선택은 Sol/Codex가 최소 필요로 결정하되 공급자·P 정의·원자 경계를 변경하는 선택은 반환한다.

## 7. support/unsupported와 oracle·환경

| 대상 | 현재/다음 부분 후보로 가능한 주장 | 주장할 수 없는 것 |
|---|---|---|
| 병합된 model/proposal/publication | 승인된 부분 소스·기존 offline 계약·checkout fail-closed 연결 | 실제 reader/admission/online 지원 |
| 새 PG 저장부 후보 | source/SQL 작성·미개방 callable 경계·offline 계약 결과 | 실제 DB 설치·SQL 원자성/ACL PASS, actual A/C/P |
| authorized ready 수직 경로 | 다음 목표 및 필요한 입력 명세 | bootstrap/current writer/native gate 없는 상태의 서비스 지원 |
| start/rematch/terminal/60초 전체·S2·S3 | 명시 미구현/후속, 기존 거절 유지 | 낮은 빈도 모델만으로 첫2D Probe 전체 지원·행동 PASS |
| public | 현재 integration385/main382. 새 후보는385 bytes 보존·server/SQL public0을 증명해야 함 | 과거 M artifact로 새 server 공개 제외 또는 배포 인증 |

### 7.1 다음 코드 후보에서의 offline 검사

현재는 **아래 새 시험 모두 미실행**이다. 다음 허용된 후보 checkout에서만 수행한다.

- 같은 scoped ID/hash 동시 제출·다른 hash 충돌·다른 subject/session/match·stale owner/revision·terminal/closed 거절. fixture DB 응답으로 증명되는 것은 호출/분기 계약뿐이다.
- 모든 잠금 완료 후 current-check 호출·대기/재진입 뒤 낡은 allow 거절이라는 orchestration 계약. 미연결 권한 함수/transport가 성공으로 fallback하지 않는 부정 사례.
- commit 응답 유실 UNKNOWN·상태 조회만 수행·자동 새 ID/무조건 replay 없음. rollback/cleanup 실패·connection 폐기·반복 정리·late 완료·T01~03의 관련 경계.
- 현재 full-state/read/status의 scope/정합 반환·동일 revision 다른 내용·타인 private 비노출을 fixture로 확인하되 actual DB/security 지원과 구별.
- 관련 `npm run test:game-platform`, 기존 boundary/Guard/governance, 후보 actual HEAD의 build/check:publication, public385 records/bytes·server/SQL 제외·기존 consumer 영향. 기존443개 및 F1~3/F1-R1은 회귀로 재사용하며 전수 재감사를 추가하지 않음.

### 7.2 실제 DB/native oracle — 별도 허용 전 NOT_RUN

| 검증 | 필요한 환경/trace | 결과 해석 |
|---|---|---|
| DB 저장 경합/ledger | 격리 disposable DB·실제 후보 SQL·동시 connection·실제 role/ACL. 동일 ID/hash 한번, 다른 hash 충돌, stale revision·owner handover·rollback·commit 전후 crash | 실제 DB 없는 mock은 대체 불가. query 반환을 actual C 시각으로 쓰지 않음 |
| current predicate/admission | approved/pending/outsider/expired/revoked 등 실제 caller; 설치 Auth 정책/버전·private ACL·외부 current와 writer fence. source R·snapshot/lock/A·transaction/command/hash/owner/recipient/view | 안전11의 해당 부분과 full obligations 구분. R/시계오차/trace 부족 INCONCLUSIVE |
| A/C 시간 | lock wait·기한 전후·일반 I/O late C·새 retry·실행 정지 구분. 실제 commit을 확인하는 DB 증거/관측 구간과 오차 | 적법 동일 transaction late C는 D0010 수용 사례. 새 A 위반 FAIL, after-check 정지 예외는 근거 없으면 적용 금지 |
| native P | 승인 OS/OpenSSL/memory BIO·실제 single gate/worker 분리·수락 byte prefix trace, EAGAIN/suffix 폐쇄·old FD 종료·fresh predicate/deadline | Node write/queue/ACK와 다름. fixture나 loopback만으로 운영 경계·성능 전체를 증명하지 않음 |
| session/terminal/60초 | 실제 bootstrap/caller·first_failure durable 경로·scheduler/controller·PG/외부 저장 장애·process loss·원장과 최초 시각 | retry/restart 기한 초기화/terminal 부활 금지. 저장 전 중단 의도를 terminal commit 성공으로 쓰지 않음 |
| 전체 모델/게임 | 안전11 전체·두 client·actual loaded bytes·H1~4·S2/Adapter/실장치·품질/운영 | 전체 지원/oracle 등록 전 별도. 이번 계획·후속 offline 후보 PASS로 대체하지 않음 |

기존 disposable runner가 HTTP RPC 기반이라는 사실은 private direct-PG/native 경로를 이미 검증한다는 뜻이 아니다. 해당 부분을 실제 시험할 때만 기존 환경을 재사용하는 최소 진입을 추가한다. 테스트 이름11개·skip을 PASS로 채우지 않는다. 기존 online DB 요구는 유지한다.

## 8. 근거의 기술 범위와 새 상위 변경 여부

이번은 SDK 구현/설치가 아니다. Supabase 스킬·저장소 DB 계약을 읽고 공식 문서의 PG snapshot/lock 및 역할/권한 설명만 최소 확인했다. Supabase changelog의 markdown 주소는 도구 content-type 제한으로 읽지 못했고 HTML 공식 changelog로 대체했다. 실제 설치 버전·계정 설정·현재 운영 객체는 조회하지 않았다. 최신 문서가 실제 설치 버전과 같다고 쓰지 않으며 SDK/driver version을 여기서 동결하지 않는다.

- [PostgreSQL transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html): Read Committed의 statement snapshot 특성은 잠금 이후 fresh 검사 설계의 근거다. 단순 격리수준 선택이 외부 철회5초나 전체 A/C 보장을 제공하지 않는다.
- [PostgreSQL explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html): row lock과 transaction 수명은 owner/command 직렬화의 구현 수단이다. 다른 원천·native sender·wall-clock expiry를 같은 lock으로 자동 보호하지 않는다.
- [Supabase Postgres roles](https://supabase.com/docs/guides/database/postgres/roles): GRANT/REVOKE 및 role 경계는 실제 ACL 검토의 근거다. 승인 DF의 predicate owner/caller 결정을 일반 role 설명으로 대체하지 않는다.
- [Supabase changelog](https://supabase.com/changelog): 구현 시 선택한 정확한 버전의 변경만 적용 대상이다. 읽은 변경 목록을 이 프로젝트의 운영 장애/환경 변경 근거로 쓰지 않았다.

현재 권고는 **기존 승인 의미 안의 구현 순서 선택**이다. 원문/consumer가 충돌하는 새로운 상위 정책 변경은 요청하지 않는다. 향후 필요해질 수 있는 site writer guard/권한·bootstrap 영향은 §5에 구체 근거를 남겼고, 이번에는 해당 코드/SQL을 건드리지 않는다. 일반 구현 선택마다 별도 Astra 승인이나 반복 조사를 요구하지 않는다.

## 9. 사용자 허용 범위·보존·이번 수행 사실

사용자가 다음으로 허용할 수 있는 범위는 **§4.1의 저장소 밖 PG 저장부 후보 및 독립 임시 checkout의 offline 검증**이다. 이 후보 검토를 통과한 뒤 정식 integration-base PR 제출을 별도로 지시할 수 있다. 지금부터 외부 ready API를 실행하거나 production SQL을 설치하는 허용이 아니다. 새 상위 의미가 꼭 필요할 때만 해당 조각을 반환한다.

승인 Target·STEP7B §7 **전체**를 조건/예외/강도까지 유지한다. 기존 Auth/게임/API/SQL/Registry 단일 metadata/shared barrel/game-local 네 문서 무이관, 원본/과거 승인/checkpoint/원ID·줄·f, baseline/유효 override/manual gate·기능/디자인 기록 책임은 그대로다. Core main 미이식, current A/C/P/D0010·안전11·H1~4/단일 채택·복구/hostless·미승인 재대결 예외 금지, D0006~10·STEP5B producer-consumer/결과정정/여섯 dedup·공개/activation/NEW·Profile recipe, B01~12/R01~13·원3232/305부모/16행58분할·L/H/I/49 비승격·DEV271/DEV251 각각 유지한다.

H1 BGM 내부 late Audio/DOM은 본체 controller, H2 등록/old disposer는 site Registry, H3 dialog/handler late 완료는 해당 실제 owner의 최소 보완/동등 격리·기존 회귀가 필요하다. 이번 저장부가 이들을 선택하지 않는다고 의무를 삭제하지 않으며 wrapper 지원 선언을 하지 않는다. 미선택 H4를 fake 연결하거나 전체 storage 후보의 선행 blocker로 올리지 않는다.

빈 oracle/runtime·online 미지원·기존 online DB 요구·미구현 조합 차단 유지. integration의 server 검사는 **같은 현재 checkout/revision/source/policy/output 증거가 없으면 차단**하는 병합된 경로다. 예전 무조건 존재 차단으로 되돌려 설명하지 않고, 허용 flag/Guard 우회로 열었다고도 쓰지 않는다.

fixed M/run39191903797/attempt1/public artifact12160182245의 별도 P1 판단과 browser 선행조건 분리 결정은 미래 revision/server에 상속되지 않는다. browser actual bytes·옛 cache/SW UNKNOWN, 새 게임 loaded bytes, 미래 server actual 공개 제외·직전 artifact 재검사/deployment, 옛 정상 root artifact 부족/완전 원복 미입증·M 재생성과 보관 ZIP 복원 차이, 삭제/탈퇴/backup/복구/비용/운영의 전체 미완료 의무 유지.

이번 수행은 지정 원문/최소 코드 읽기, 현재 GitHub ref/PR/CI 읽기 전용 조회, 관련 공식 기술 문서의 최소 확인, 이 판단 문서 작성뿐이다. **source/Guard/policy/설정/Git/PR/배포 변경·병합·새 server/model/Adapter 구현·새 test/build/check·HTTP/browser/DB/native/audio/두 client/게임/성능/운영 시험·dispatch/rerun/upload/deploy·지원/oracle 등록을 하지 않았다.** 별도 전수 source/SQL 감사나 외부 운영 재조사도 하지 않았다.

## 10. Sol/Codex 실행 프롬프트 — 사용자가 다음 후보 작성을 지시할 때

```text
Game Platform vNext STEP7D S1의 비공개 PG 저장부 후보를 준비해줘. 담당 Sol/Codex.
game-platform-vnext-step7d-s1-backend-slice-astra-judgment-2026-10-22.md 전체와
post-pr431-next-handoff, 승인 S0/CP0112 및 S1 승인/보존 범위를 먼저 읽어줘.
DF §2/3, D0010 closeout §2/3, server-boundary-next-plan §4.2의 현재 의미를 재사용해줘.

고정 integration990ad56adde4e2f798fdd974fbe5b4d21863173e /
tree07db48045ee6b095bf306229eda0be12d43c4879와 별도 main M을 구분해줘.
현재 remote/PR431 실제 병합·이후 변경부터 확인하고 자동 포함하지 마.
CP0112 미병합 표시는 당시 이력이다. 현재 integration385/main382·Core main 미이식을 유지해줘.

이번은 저장소 밖 patch/bundle과 독립 임시 full checkout의 offline 검증만 허용한다.
원본 checkout/branch/integration/main/remote는 변경하지 말고 commit/push·PR을 만들지 마.
후보 checkout 결속에 필요한 local commit만 허용하며 실제 base/HEAD/tree를 남겨줘.

보고서 §4.1의 ready 저장·durable command ledger·current/status 조회에 필요한 실제 SQL과
최소 server transaction 연결을 후보로 작성해줘. 기존 sessionControl hash/proposal·client model과
F1~3/F1-R1·publication 검사 연결은 재구현하지 마.
실제 session bootstrap·trusted caller/current predicate·external generation/writer fence·native P가
없는 경로를 no-op/fake success/allow flag로 채우지 마. 내부 저장 primitive와 외부 admission을
구분하고 production runtime 호출/GRANT·network listener·public RPC는 개방하지 마.

실제 state/revision/command ledger의 동일 transaction, scoped ID/hash unique·충돌,
owner/anchor·stale revision·terminal/closed 거절, commit 응답 유실 UNKNOWN·동일-ID 조회,
rollback/connection cleanup/late 완료를 구현된 부분과 미구현으로 나눠줘.
현재 proposal.next 전체를 무검증 저장하지 말고 검증된 set-ready 변경만 처리해줘.
최종 A는 잠금 뒤 fresh predicate를 통과한 같은 finalizer의 저장 착수이며
internal storage 호출/BEGIN/fixture allow가 아니다. actual C/응답 ACK/native P를 구분해줘.
start/rematch·실제 입장·최초60초/abort/terminal 전체·Adapter/native sender를 확장하지 마.

새 DB 지원물은 기존 supabase 관리 경계의 새 vNext 영역에 후보로 두되 기존 site/game SQL은
수정/이관하지 마. 실제 DB 설치 이력으로 기록하지 말고 일반 runtime에서 내부 primitive를
호출할 수 없는 ACL 경계를 명시해줘. 함수명/자료구조/최소 분할은 정상 선택으로 진행해줘.
관련 Supabase skill/정식 DB 계약과 선택 dependency의 공식 근거만 필요한 만큼 읽어줘.
실제 DB/운영 조회·설정·migration 실행은 하지 마. 새 driver가 필요하면 server 전용 최소
고정 dependency로 분리하고 root browser dependency/기존 public bytes를 보존해줘.

의미 있는 offline 계약과 관련 npm run test:game-platform·기존 Guard/governance·
후보 actual HEAD의 build/check:publication을 수행해줘. DB stub/fixture는 production admission,
SQL 실제 atomicity/ACL/actual C/native P 증거가 아니며 실제 DB/native 검증은 NOT_RUN이다.
기존385 records/bytes/moduleMaps와 server public0·source/output/closure를 확인해줘.
새 supabase SQL은 builder의 services raw-byte 범위와 구분하여 실제 path/type/size/hash와
public/output 비유입 근거를 따로 남겨줘. 기존 검사로 부족해 source/Guard/policy/workflow 변경이
꼭 필요하면 이유/원문·owner/consumer/영향/최소 diff를 먼저 반환하고 자동 변경하지 마.
이전 receipt5ef7762/합성merge dd46e3e를 새 candidate 또는 merge990ad56의 receipt로 쓰지 마.

원본 밖에 patch/bundle·candidate head/tree·diff·local publication·구현/미구현·검증/미실행·
부족 입력과 Astra 검토 인수인계를 남겨줘. 검토 뒤 정식 integration-base 코드 PR 제출은 별도다.
지원/oracle 등록·기존 consumer/API/Registry metadata/barrel·Auth/게임/SQL 이관은 하지 마.
승인 Target/STEP7B §7 전체/current A/C/P/D0010/안전11/H1~4/단일 채택·복구/hostless·
미승인 재대결 예외 금지·원본/과거 승인/원ID·줄·f·모든 후속 의무를 유지해줘.
fixed M의 별도 P1과 미래 revision·browser/cache/SW UNKNOWN을 구분해줘.
실제 DB/native/browser/audio/두 client/게임/성능/운영 시험·dispatch/rerun/upload/deploy·
설정/정식 Git/PR/병합/Guard 우회·전수 source/SQL 감사·외부 운영 재조사는 하지 마.
후보 구현 작성/정식 반영 없음/실제 지원 미입증·STEP7D 미완료·vNext 행동 NOT_RUN·운영 UNKNOWN에서 멈춰줘.
```

**이번 정지 상태: S1 잔여 backend의 다음 부분 후보 범위 판단 완료 / 구현 미수행 / STEP7D 미완료 / 실제 지원 미입증 / vNext 행동 NOT_RUN / 운영 UNKNOWN / browser·cache·SW UNKNOWN.**
