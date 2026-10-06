# STEP4B — G03 집중 지원 근거 (CP0063)

입력 CP0062 `89a0a013a1e6324b205a37abee1d450a1ce78179`, 조회 2026-10-06 KST. 시작 PR412 HEAD 일치/추가변경0. [CP0062 판단](step-4b-operations-design-judgment.md)의 A안·저빈도 DB 우선 기준을 유지한다. 이번은 Sol 근거 확보이며 구조·제품·알고리즘 채택은 Astra 후속 판단이다. 비용·운영·단말·백업 명세는 재작성하지 않는다.

## Q1~Q3 결론과 근거

| 질문 | 결론 | 이번 확보/종료 지점 |
|---|---|---|
| Q1 managed Auth 철회 | **명시적 지원 제약 확인** | JWT 즉시 무효화 제약과 API별 확인 범위 확인. 공개 `/user` 소스의 session 부재 거절 경로 확보. 운영 exact Auth/SDK 및 전체 만료 의미·공동 fence는 미확인 |
| Q2 R와 최종 C/P 연결 | **지원 근거 미확보 — 필요한 답변/자료 특정** | DB lock과 socket write는 각각 범위가 제한됨. 내부 Auth R·외부 effect/egress를 묶는 문서화된 지원 계약을 확보하지 못함. 공급자가 모든 방식의 지원 불가를 명시한 것으로 해석하지 않음 |
| Q3 판정 필수 미확인 | **지원 근거 미확보 — 필요한 답변/자료 특정** | 아래 M63-01~05로 공식 답변·운영자료·버전·실행 증거를 구체화. 구현 가능성 확보 또는 G03 해소라는 의미가 아님 |

표의 분류는 공식 지원 사실 / 저장소 정적 정의 / 운영 관측 / 미확인 / 구현·시험으로 증명할 항목이다. 공급자 공개 소스는 **저장소 정적 정의(공급자)**로 표시하며 managed 운영 적용이나 지원 계약을 대신하지 않는다.

| ID/경로 | 분류·확인 내용 | 효력/권한 경계와 한계 | 근거 |
|---|---|---|---|
| F63-01 default/global/local/others | 공식 지원 사실. JS 기본 global은 전체 session,local은 현재 session,others는 현재 제외. others는 SIGNED_OUT event를 발생시키지 않는 설명 | access JWT는 만료 전 즉시 철회할 수 없다는 명시적 제약. scope 대상 철회와 browser 로컬 정리/event는 별도 | [JS signOut](https://supabase.com/docs/reference/javascript/auth-signout), 기존 S62-01 |
| F63-02 저장소 logout | 저장소 정적 정의. index.html:98·accessTracker:28/35는CDN@2,js/auth.js:454~466 signOut은 scope없음 | 실제 받은supabase-js/auth-js bytes·버전·서버응답은 UNKNOWN. current CDN을과거browser버전으로대체하지않음 | [고정 index](https://github.com/limbit95/limbit95.github.io/blob/89a0a013a1e6324b205a37abee1d450a1ce78179/index.html),[accessTracker](https://github.com/limbit95/limbit95.github.io/blob/89a0a013a1e6324b205a37abee1d450a1ce78179/js/accessTracker.js),[auth](https://github.com/limbit95/limbit95.github.io/blob/89a0a013a1e6324b205a37abee1d450a1ce78179/js/auth.js) |
| F63-03 직접 Auth API | 저장소 정적 정의(공급자). 고정소스 api.go의/logout은requireAuthentication,logout.go는scope별DB transaction 후204. sessions.go는전체/현session/현session제외 DELETE 정의 | 해당소스의DB변경 지점과HTTP응답 구별. 직접API가사이트wrapper를거친다는증거없음. 실제managed버전/동시refresh·새session생성과scopecut미확인 | 아래 U63 공급자소스 |
| F63-04 console/계정 삭제 | 공식 지원 사실. console 또는auth.users 직접삭제 안내,삭제해도JWT가만료까지유효하다는제약. deleteUser는server/service_role,soft-delete는hash로사용자식별가능한설명 | console 실제implementation·hard/soft선택·삭제와session R순서는UNKNOWN. soft-delete를탈퇴식별연결제거충족안으로자동채택금지. 어떤경로든C/Pfence별도 | [User management](https://supabase.com/docs/guides/auth/managing-user-data#deleting-users),[deleteUser](https://supabase.com/docs/reference/javascript/auth-admin-deleteuser) |
| F63-05 JWT/session 만료 | 공식 지원 사실(기존 S62-02). session_id와auth.sessions 연계,session timeout은Pro이상/refresh집행·row정리지연 | Free에유료timeout가정금지. row존재와exp/not_after·현재가입/role·최종effect인가별도 | [Sessions](https://supabase.com/docs/guides/auth/sessions),[기존근거](step-4b-operations-design-evidence.md) |
| F63-06 getUser(jwt) | 공식 지원 사실. user JWT로Auth서버에요청하여최신user record를반환. 일반user조회에admin delete권한을채택할이유없음 | identity/user조회설명만으로모든session만료판정·외부finalC/P공동인가보증안됨. 응답후R경합은별도 | [getUser](https://supabase.com/docs/reference/javascript/auth-getuser),[Choosing an auth method](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs#choosing-an-auth-method) |
| F63-07 getClaims/getSession | 공식 지원 사실. getClaims는JWT검증·JWKS cache 또는대칭키의서버검증,claims는token내용. getSession은로컬저장값/embeddeduser 재검증없음 | JWT인증·claims freshness·현재session인가를혼합금지. getClaims가refresh하는경우도finalegressfence아님. 서비스키로사용자JWT를대체하지않음 | [getClaims](https://supabase.com/docs/reference/javascript/auth-getclaims), 위Choosing an auth method |
| F63-08 auth schema 직접read | 공식 지원 사실: Auth schema는auto-generated API에노출되지않음. 운영 관측(과거CP0059): auth.sessions/users SELECT는anon/authenticated/service_role false,connector postgres true | service_role Auth admin API와DBtableSELECT권한은다름. 미래adapter가postgres권한을채택한것아님. 지원되는최소권한predicate/내부lock계약은미확인 | User management Accessing user data, [CP0059 O06](step-4b-support-readonly-evidence.md) |
| F63-09 Auth hook | 공식 지원 사실. 문서의지원hook목록은BeforeUserCreated/CustomAccessToken/SendSMS/SendEmail/MFA·Password검증. access token hook은발급시점 | 목록에서logout/delete/expiry→외부fence hook계약을확보하지못함. 목록에없음을공급자의모든연계방식비지원선언으로바꾸지않음 | [Auth hooks](https://supabase.com/docs/guides/auth/auth-hooks) available hooks |
| F63-10 DB locking | 공식 지원 사실. row lock은transaction수명,advisory는참여writer가준수해야함 | SQLstore의지원수단은있으나잠금소실후외부effect/socket을막는지원계약은아님. 직접SQL/모든 Auth writer참여는미확인 | [PG17 Explicit locking](https://www.postgresql.org/docs/17/explicit-locking.html) |
| F63-11 socket/queue | 공식 지원 사실(예시runtime). Node socket.write true는kernelbuffer로flush,false는user memoryqueue. callback도비동기 | callback/true/DBcommit을실제egress나recipient수신과동일시금지. Node채택/현재서버설치증거아님. SDK/TLS/proxy/OS/in-flight는제품별추가경계필요 | [Node net socket.write](https://nodejs.org/api/net.html#socketwritedata-encoding-callback),조회page v26.10.0 |
| F63-12 사이트 R/old owner | 운영 관측(과거CP0059/61). 선택status/role/가입/permission함수·ACL/trigger자료와12fingerprint일치기록존재 | actor전체의존성·직접SQL/정책/권한writer전수아님. vNext oldowner/C/Padapter미구현. 저장deny와송신0은독립실행증거필요 | [CP0059 경로표](step-4b-support-readonly-evidence.md),[CP0061 fingerprint](step-4b-operational-fingerprint-refresh.json),[CP0062 J62-01](step-4b-operations-design-judgment.md) |

### U63 — getUser 지원 해석을 좁히는 공급자 공개 소스

2026-10-06 GitHub `supabase/auth`에서middleware.go의최근변경commit으로선택한고정ref **`99090eb6597db8b1bb3a510193526d46b74c4a7d`**(commit시각2026-08-28T11:06:17Z)를읽었다. 최신릴리스태그/운영Auth버전이라는뜻이아니다. 코드실행·공급자지원약속·운영적용관측이아닌정적자료다.

| 소스/위치 | 읽힌 정의 | 결론의 상한 |
|---|---|---|
| [api.go](https://github.com/supabase/auth/blob/99090eb6597db8b1bb3a510193526d46b74c4a7d/internal/api/api.go)275~283, [auth.go](https://github.com/supabase/auth/blob/99090eb6597db8b1bb3a510193526d46b74c4a7d/internal/api/auth.go)20~43/118~165 | /user는requireAuthentication→JWTparse→maybeLoadUserOrSession. 사용자 부재 시 거절,nonempty/nonnil session_id는FindSessionByID(...,false),없으면session_not_found. banneduser거절 | 이소스에서는/user가session부재를보지않는다고할수없음. 반대로현재 managed 설치 버전 일치·모든 만료 설정 판정·외부C/P직렬화로확대불가. 빈session_id분기도별도 |
| [sessions.go](https://github.com/supabase/auth/blob/99090eb6597db8b1bb3a510193526d46b74c4a7d/internal/models/sessions.go)274~300 | forUpdate=true분기는FOR UPDATE SKIP LOCKED;위/user의false분기는그잠금요청없음 | 읽기성공을외부apply/send완료까지보유하는permit로해석불가 |
| [logout.go](https://github.com/supabase/auth/blob/99090eb6597db8b1bb3a510193526d46b74c4a7d/internal/api/logout.go)21~74, sessions.go358~370 | transaction내scope별session DELETE,성공뒤204 | DB삭제가외부senderfence의ack를기다린다는지원근거아님. 실제managed DB commit/HTTP효력관측은T03에필요 |

이번 자료의 재현 기준은 위 고정 commit/path다. 소스가변해도당시기록은보존한다. docs의getUser설명과토큰유효성제약은적용층이다르므로,user/session부재검사후인증실패와오래된JWT의다른서비스유효성을구분해야한다.

## 부족 증거·확보 방법·담당

이번 운영 metadata 재조회는 0이다. 기존연결권한이있어도같은fingerprint/ACL은새fence가능성을증명하지않아반복하지않았다. 아래자료가확보되지않았음을접근권한부재또는기술전반불가능으로바꾸지않는다.

| ID/핵심 미확인 | 필요한 종류·확보 방법 | 담당/닫힘 조건 |
|---|---|---|
| M63-01 실제session확인범위 | 공식답변+exactAuth/SDK버전: getUser(jwt)가scope별철회·userdelete·exp/not_after/timeout중무엇을거절하는지. nonempty session_id조건·오류/장애시의미. managed지원최소권한API/DBpredicate | Sol질문초안→공급자답변/버전자료. 수령전UNKNOWN,현재Auth소스설치를주장하지않음 |
| M63-02 모든R와finalC/P공동 경계 | 공식계약: 내부logout/directAPI/console/delete/expirywriter와참여할lock/hook/fence지원여부·Free/upgrade안정성. DBdisconnect뒤lateapply/send반례를배제하는mechanism | Astra구조판단핵심. 문서/답변없으면현재managed조합채택HOLD,동일검색반복으로대체금지 |
| M63-03 실제SQL/caller·writer통제 | 운영정의/권한자료: privilegedrole membership·RLSbypass/owner·profiles/admin_permissions/join_requests/customfunctions/triggers·직접 SQL/배포작업주체. 지정adapter최소권한 후보과호출경로 | Sol필요자료특정완료. 향후제한metadata조회/운영자비밀없는절차자료,새 권한부여없음. 모든 writer아니면coverage공백명시 |
| M63-04 finaleffect/egress와owner | 고정 runtime/transport·관측점: appenqueue/dequeue→SDK/TLS/proxy→OSsocket→egress→recipient·취소 가능 경계·incarnation/owner fence | 서버/네트워크담당,별도허용단계T02/T05/T08. oldstoredeny와oldC/P0독립입증. 선택제품미확정이면시험oracleHOLD |
| M63-05 경합·실제효력 | 구현·시험: AuthRscope/expiry와C/P·snapshot/duplicate새 P경합·DBlock소실·pause/partition·oldownerresume·모든Rordering·trace누락 | T01~05/T08/T10담당. R후불허C/P0,누락INCONCLUSIVE/HOLD. 이번NOT_RUN |

## 공급자 지원 문의 초안 — 미전송

Free/서울 managed Auth의다음항목을공식지원/비지원/미문서화로구분해주십시오. 비밀키·사용자데이터를첨부하지않습니다.

1. 현재managed Auth버전을식별할지원방법과,userJWT로getUser를호출할때검사하는session철회/만료조건은무엇입니까? global/local/others·직접API·console hard/soft delete·JWT expiry각각의효력경계,session_id없는token및일시조회장애의의미를알려주십시오. 앱DB에Auth table광범위SELECT권한없이현재session을검증할최소권한지원방식은무엇입니까?
2. 모든위R와외부gameeffect/egress를같은순서로집행할지원mechanism이있습니까? allow→DBlock소실→R→oldprocessresume→lateapply/send를배제해야합니다. auth.sessions잠금/customtrigger또는Authhook사용이managed내부writer와함께지원되는지,만료와새 session생성까지포함하는지,Free/버전변경제약을명시해주십시오. JWTTTL/event통지는최종fence의동의어로답변하지말아주십시오.
3. 그런계약이없다면명시적비지원인지,문서화되지않았는지구분해주십시오. logout/userdelete응답이외부sender취소를기다리는보장이없다면그한계도확인부탁드립니다.

답변수용표에는제품/버전·지원범위·actualR와finalC/P지점·실패/partition/expiry조건·권한·문서URL/답변일·명시적비지원/미답변을남긴다. 실제문의전송·답변대기·지원상품구매는이번범위밖이다.

## Astra가 다음에 결론 내려야 할 항목

| 판단 입력 | 이번 근거 | 다음 Astra 결론 범위 |
|---|---|---|
| 현재후보를지지 | 서버user조회API와공급자session부재검사정의,DBtransaction/rowlock수단은존재 | 해당수단으로묶을수있는DB내C의범위와current인가predicate. 외부C/P지원완료로확대금지 |
| 현재후보와충돌 | JWT즉시철회제약,조회후R경합·잠금소실반례,write→kernelqueue별도 | CP0062가배제한사전allow外部apply/send,TTL/event/cache만의구조를다시채택하지않음 |
| 채택을막는미확인 | M63-01/02의managed계약·M63-03모든 writer·M63-04최종egress | 현재후보유지불가/HOLD또는목표를유지한구체적 구조대안. 지원질문이핵심이면답변필요성을분명히하되자료준비를무한반복하지않음 |
| 실행으로증명 | M63-05/T01~05/T08/T10 | 구조결정가능조건과후속시험의무구분. 문서만으로게이트해소없음 |

**수집 종료:** Q1~Q3의 확인 수준과 M63-01~05를 제출하고, 외부 답변을 기다리며 같은 자료 준비를 반복하지 않는다. 다음 작업은 Astra의 구조 판정이다. 핵심 알고리즘 선택을 사용자에게 전가하지 않는다. 총접속 100명·판 8명·세금 포함 월 추가비 30,000원·반응 p95 250ms·정상망 회복 후 재연결 각 5초·모바일 필수 기능과 기존 보존·복구·삭제 요구를 유지한다. 권한 불명 시 보호 입력·정보 제공 즉시 차단 → 해당 판 일시정지 → 최초 장애부터 60초 내 복구 실패 시 중단이며, 60초는 인가 유예가 아니다.

G03 OPEN/BLOCKING,G01/G02/G04/G05 PARTIAL/OPEN,G06두Probe적용판단만SCOPED_DESIGN_RESOLVED. STEP4B IN_PROGRESS/전체완료·구현HOLD. 이번행동시험NOT_RUN,정식반영·구현·권한변경·backupjob/dump/복원·STEP5A·병합·main없음. 원격제출/일치확인뒤정지.
