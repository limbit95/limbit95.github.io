# STEP4B — CP0059 시험·복원·삭제 명세 후속 보완

2026-10-06 KST. 고정 입력 `8af1029ab1aefeda1081b86e8d83faa2509a13d9`. [판단](step-4b-support-design-judgment.md)의 J60-01~08에 따른 추적 가능한 보완이다. [원본 T01~14](step-4b-verification-specification.md)·[원본 B01~07](step-4b-recovery-deletion-cost-specification.md)·[CP0054 E01~12](step-4b-preimplementation-conditions.md)는 당시 이력으로 수정하지 않는다. 충돌하는 시험 해석은 이 보완을 우선 참고하되 정식 계약 반영/시험 실행 승인으로 확대하지 않는다. **전 사례 NOT_RUN, observer 미구현이면 INCONCLUSIVE/HOLD.**

## 1. 시험 oracle 공통 보완

observer는 권위 순서 증거와 동기화 오차를 별도 기록한다. 단순 증가 trace ID를 logger에서 나중에 붙이거나 DB sequence 발급 순서를 commit 순서로 취급하지 않는다. transaction ID/벽시계/LSN 하나가 DB와 외부P 전체를 자동 직렬화하는 것도 아니다. 사건 barrier로 R commit이 끝난 후 old release를 재개하는 인과 순서를 만들고, 실제 adapter/egress 관측으로 효과를 대조해야 한다.

각 P에는 recipient/session/view generation/payload hash/owner/incarnation/command/revision과 final-release ID를 연결한다. packet은 wire 효과 증거지만 TLS ciphertext만으로 대상 payload를 증명할 수 없으므로 시험용 metadata와 대응시킨다. trace 누락·clock uncertainty·관측 밖 egress는 성공0이 아니라 판정 불가다. 모든 오류/finally/cache 경로도 계측한다. 토큰·개인정보·보호 payload 원문은 artifact에 저장하지 않는다.

안전성은 전수 위반0이다. p95는 성능에만 적용한다. finite 시험 PASS가 모든 가능한 interleaving의 수학적 보장이 아니므로 지원 계약·위험 모델·제어 가능한 writer 목록과 함께 평가한다. DB/RLS deny 로그와 UI callback 폐기만으로 정보 송신 차단을 증명하지 않는다.

| 시험/E연결 | 기존 명세의 보완 이유·추가 주입 | 합격/실패·관측·담당 |
|---|---|---|
| T01/E01,E02 | actor 권한 check 뒤 target lock wait 중 actor status/role/permission 철회; target/actor별 R01~10·빈 permission row/재삽입 포함 | 모든 의존 권한 R 이후 불허 C/P0. actor/target scope와 lock·effect ordering trace. 권한 담당; 미지원 writer면 HOLD |
| T02/E02,E04 | transaction kill·연결 단절·savepoint rollback·process pause 뒤 lock 소실 확인→R완료→old apply/send. 최종 재조회 뒤에도 동일 주입 | C/egress 실제0. 단순 timeout 감지시간 측정은 PASS 아님. 서버/네트워크 담당 |
| T03/E01,E03 | default/global/local/others 각각 직접 SDK/API/console 경로; user 삭제/refresh 경합/JWT exp 직전 check·직후 final C/P. Free 미지원 session 설정은 지원완료 사례에 넣지 않음 | scope 대상만 차단,비대상 유지. Auth R·JWT exp·row 상태 분리. 정확한 Auth/SDK버전·지원경계·trusted clock 없으면 HOLD / Auth 담당 |
| T04/E05 | C성공→ackdrop→R→동일ID/hash retry,새ID 오용·payload불일치·다른session·public오류 경로 | mutation once와 P현재인가 각각. private cached ack0;timeout재시도 새ID 자동발급 금지 / command 담당 |
| T05/E06 | 동일revision에서 view교체,생성중/cut후/appqueue/SDKqueue/finalrelease 직전 R. recipient별 fanout 중 일부만 철회 | payload·recipient별 P판정. fanout 전체일괄 이전인가 재사용불가. in-flight 미확정시 HOLD / snapshot 담당 |
| T06/E04,E06 | quiet 마지막 event유실·disconnect없이 권한갱신 유실;A→B→A·dispose·logout뒤 success/error/null/finally/effect | lifecycle/view/owner가 모두현재여야 채택;event수신 없음을허용증거로사용금지 / client 담당 |
| T07/E04 | t0+60초 직전/정각/직후,callback미실행processpause,owner교체/재시도로t0유실 | recovery 확정 <deadline만 재개,정각/이후abort우선. timer미실행으로권한연장0. t0원천/외부fence 불명 HOLD / 서버 담당 |
| T08/E08 | old/new 동시complete/abort·다른socket·중간proxy·oldqueue,복원old epoch 재사용 | durable terminal1과old storage0/old egress0 독립증명. 새owner선출로그만으론 부족 / owner 담당 |
| T09/E07 | start/terminal commit전후crash에60초abort결정→DB불가→processcrash 추가 | durable completed보존·unfinishedabort. 최초종결 증거와expire_at 불변;나중저장으로30일연장FAIL. 미저장terminal 사실모르면 UNKNOWN / 기록 담당 |
| T10/E09 | participant/비참가자·필요operator/불필요operator·service adapter·DataAPI/view/SECDEF/readerror | 현재인가와최소projection.탈퇴자는옛식별연결로조회불가;조회행0만보고privateerror누출누락금지 / 보안 담당 |
| T11/E10 | deadline 정각·scheduler outage·object version·숨은temp·withdrawal과dump/copy경합·삭제후구형exportupload | 사본inventory전수삭제/복호화불가의채택조건과restore기능둘다충족. 뒤늦게upload된사본도부활차단 / 복구·보안 담당 |
| T12/E11 | CP0059의 “사용자가 볼 수 있는” 표현을 CP0057의 다른참여자권위화면까지로구체화. 로컬prediction따로관측,100고유사용자·12×8+4 및로비/관전/허용분산방·8초과거부 | PC/모바일·조작종류별p95≤250ms,clock오차포함. 평균으로느린기기희석금지 / 성능 담당 |
| T13/E06,E11 | 정상망회복 외부probe tnet 고정,권한/서버장애는별도라벨;foreground/망전환/background·잠금복귀 | 대상각회LIVE≤5s. aborted수렴은LIVE성공아님;복구뒤에timer시작금지.모바일5기능누락0 / QA |
| T14/E12 | snapshot불일치·verified point지연·연속실패·quota기존소비·restore현재권한원천유실 | RPO24h/RTO24h목표 각각실측.안전확인못하면reopen안함,그경우목표미달정직기록 / 운영·비용 담당 |

p95는 nearest-rank 등 계산법을 manifest에 고정할 것을 추천한다. 성공 완료만 따로 분모로 만들지 않는다. 대상 정상 조작의 미완료/timeout은 우측 censoring으로 표시하고250ms 목표 판정에서는 초과로 취급한다. 95% 위치가 censoring이면 유한 p95를 꾸미지 않는다. 의도적 인가 거부/장애 주입과 정상 조작은 사전 분류하여 전수 건수를 보고한다. safety 실패 한 건은 지연 percentile과 무관하게 실패다. 1000개/60분/재연결30회는 표본 후보이지 새로운 사용자 승인 기준이 아니다. p99/tick/queue는 관측 가능하나 새 합격선은 없다.

## 2. 백업 범위·복구점 명세 판단

B01: 하나의 manifest에 tcut·DB snapshot identity·source schema/extension version·파일hash/수량·mapping참조·ttransfer·tvalidated를 넣는 방향을 추천한다. schema/data/roles의 별도 CLI 실행은 단일 cut 보장이 아니다. data와mapping은 동일 consistent snapshot에 묶고 schema 변화가 겹치지 않는 증명을 확보해야 한다. raw pg_dump/CLI flag 지원은 버전별 확인 후 정하며 이번에 명령을 실행하지 않는다. checksum/압축풀기 검증과 실제복원검증을 구분한다. 매일 복원시험을 하지 않았다면 매일 restore-verified라고 기록하지 않는다. 사용할 수 있는 복구점 판정의 최소검증항목·정기실복원주기와신뢰근거는 후속명세 HOLD다.

B02: 게임 최소terminal/start 식별·참가 mapping·immutable deadline·dedupe/owner 경계에 필요한 metadata, schema/RLS/GRANT/function/role/extension·migration manifest를 포함할 범위를 정의한다. Auth 계정과FK를 같은요구로복구하는지 별도 복구하는지 명시한다. 게임table 백업은 사이트Auth 전체재해복구를 대신하지 않는다. 반대로 사이트전체Auth dump를7일 보관하는 승인도 이 작업에 없다. 관리schema DDL/customization·data·secret/password·Storage metadata/object bytes·Edge 설정/함수는 각각 별도 inventory다. 실제회원/Auth dump는 이번에 생성하지 않는다.

최소record는 email/실명/token/privategamepayload를포함하지않는다. 내부matchID와참가 연결의분리도 재식별가능성을 자동제거하지 않는다. admin필요scope·참가mapping열람·삭제를 동일하게 적용한다. 현재 `profiles→auth.users CASCADE` 때문에 Auth row삭제만으로mapping사본·다른참조삭제까지완료라고추정하지않는다.

## 3. 7일 복구점·30일 삭제·탈퇴

추천 방향은 **정책상 남겨도 되는 최소 판 기록과 식별 연결을 분리하고, 정확한 deadline/탈퇴에 맞춰 제거할 수 있는 archive 단위를 설계**하는 것이다. 일단위cohort만30일후일괄삭제하면 실제 최초종결시각보다늦어질수있으므로정확시각경계처리가필요하다. 버전당고정삭제deadline·활성export등록·늦은upload검사·모든사본삭제확인을포함한다. 읽기차단만해놓고물리사본삭제를완료로표시하지않는다. 정확deadline에서사본삭제를증명할수없으면정책충족HOLD다.

| 방식 | 평가 | 추천·채택 조건 |
|---|---|---|
| deadline/record 단위archive+분리identity mapping | 정책 삭제를복구점metadata와분리할수있는유력후보 | 우선정밀설계. 7일각cut의참조무결성·정확기한·탈퇴즉시연결제거·version/temp/in-flight copy·용량증명전최종채택HOLD |
| 분리암호화·key erasure | 삭제대상범위와key범위일치및모든key사본제거를증명할때조건부 | 기본해결책으로즉시채택하지않음. KMS/키backup·cache·plaintexttemp·복호화권한·복원시key부활·비용까지별도증명 |
| 7일복구점재작성 | 기존복구점을삭제정책에맞춰갱신하는대안 | 대상원본삭제전검증완료와deadline을동시에맞춰야함. 실패시예외보존금지;추가egress/CPU/temp/atomicmanifest교체증명 |
| immutable full dump 무조건7일 | 만료/탈퇴뒤사본이남는구조 | 현요구와충돌,배제. 복원후삭제필터만으로해결안됨 |

B03~05: 마지막7일복구점은 그당시 모든개인정보를그대로부활시키는기능이아니라 현재삭제정책을적용한유효복구점이다. 삭제된mapping이없어도다른참가자에게허용된최소판상태를복구할수있어야한다. 삭제때문에모든복구점이사용불가면7일요구도실패다. no-server-record인두번째Probe에새기록을추가하지않는다.

삭제/권한기준원천을같은DB dump에서복원하면최신철회·탈퇴사실도사라질수있다. 단순외부log추가도DBcommit과logwrite사이의유실틈을해결하지않는다. 두write의원자성/순서·실패시deny·backup publication/restore barrier를명세해야한다. 백업에없던삭제요청도현재정책에반영되어야한다. 이 원천이없거나진위를확인할수없으면복원은닫힌상태로유지한다.

oldcommand 부활차단은현재live match namespace/start/owner 없이는 terminal/upsert를불허하는방향을유지한다. 새incarnation만으로과거snapshot의삭제사실을복구할수없으므로삭제대장역할과혼동하지않는다. suppression정보는최대유효복구점·in-flight작업·retry가전부폐기됐음을증명한뒤정리하는유한수명설계를추천한다. hash/UUID도연결가능하면식별정보로취급하고무기한보존을채택하지않는다. 정확수명은실제retry·backup inventory없이숫자를발명하지않는다.

## 4. RPO·RTO·복원 절차

B01/B07: 재해시점 d에서 사용가능한최신검증복구점의cut을c라하면 RPO age=d-c다. 주기Δ+완료/검증최대지연v+실패재시도예산m≤24h는 그가정이실제지켜질때의설계상상한이다. 임의횟수의연속실패까지24h를보장하는식은아니다. 실패로age를넘으면목표미달로기록하고다음날job까지방치하지않는다. 검증완료시각을cut으로대체하지않는다.

정확하루1회cut(24h간격)·양수v만있는경우다음backup검증직전의age는24h+v가되어목표와충돌한다. 일일baseline은유지하고추가cut/증분복구점을두거나간격에여유를두는후보를추천한다. 예:12h간격과v+m≤12h라는조건은수학상후보이며운영빈도확정/사용자채택아님. full dump하루2회면반출이2배라서비용표도함께바뀐다. 24h목표를48h로완화하지않는다.

감시는job process와독립된위치에서lastcut/verifiedage·예정작업누락·전송실패·hash불일치·삭제deadline·사본재등장·권한원천신선도를관찰해야한다. 경보만발송하고대응가능시간이없으면m상한은증명되지않는다. 임계치숫자는실측v/복구시간/대응시간이확보된뒤24h에서역산한다. scheduler/모니터비용도0가정금지다.

B06: 기존서버와egress를차단·증명 → 격리target와manifest검증 → 호환schema/data/role/ACL복원 → 현재정책의만료/탈퇴재적용 → 복원과독립된새incarnation·oldcommand/owner차단 → oldsession/자격증명효력확인 → 현재승인/운영권한확인 → 최소record/열람/삭제/egress증거 → 제한된개방. 같은dump의epoch를1증가시킨것만으로oldowner와구분된다고가정하지않는다. 기존Auth signing key를유지하면oldJWT도유효할수있다. 키교체만으로현재승인/역할도복원되는것은아니다.

현재권한을복원외신뢰원천으로확인하거나보수적으로재승인하는대안은있지만, 후자는최고관리자bootstrap의현신원/권한과사이트영향까지확인해야한다. 자동재승인/전체사이트session폐기실행은승인하지않았다. 신뢰원천없으면HOLD다.

RTO는발견→담당인지/착수→복원→삭제/현재권한검증→authorized reopen까지24h목표다. 발견까지시간은별도보고,담당출근을발견시각으로바꾸지않는다. 최악대기+복원/검증/개방시간이24h이내인지운영시간표로평가한다. 안전성확인이안되면기한을맞추려고개방하지않고목표미달을보고한다. 현재운영요일/시간UNKNOWN,24/7지원아님.

## 5. 세부 해소와 남은 증거

설계 해석상 정리된 것은 R의효력시각을알림시각으로대체금지,duplicate응답새P,정각deadline중단우선,삭제기산불변,복원개방순서다. 제품지원·알고리즘·실행시험PASS는전부별도다. primary명세/관측점/고정버전부족은INCONCLUSIVE/HOLD,위반trace확보는FAIL로구분한다. 이문서만으로G01~05어느것도해소하지않는다.
