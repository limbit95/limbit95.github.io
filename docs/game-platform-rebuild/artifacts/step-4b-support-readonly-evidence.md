# STEP4B — G03 읽기 전용 지원·운영 근거

2026-10-05 KST. Sol 자료 수집, 고정 입력 CP0058 `882bc485d1b45cf40b9eb4dbc18a724de01440dc`. 핵심 선택은 CP0057 판단을 유지한다. [운영 metadata 원본](step-4b-operational-metadata-snapshot.json)·[시험 명세](step-4b-verification-specification.md)·[복원/삭제/비용 명세](step-4b-recovery-deletion-cost-specification.md).

## 1. 복원·확인 수준

AGENTS→계획1.3→기록README→CURRENT→CP0058·DECISIONS→PR412 순서로 원격 확인. HEAD는 지정 입력과 일치, OPEN/Draft/미병합. branch `docs/game-platform-vnext-phase4b-evidence-preparation`, integration `3aeae1dfcce7788f88e706dcd49d283b91b67e82` 유지. CP0057 J01~08/A01~08, CP0054 R01~10/E01~12, CP0056 U01~10, 사용자 결정 원본을 읽었다.

시작 로컬158파일·별도 정적 source153파일의 Git blob을 입력 full tree와 대조해 일치했다. source153 전체 의미 감사를 새로 했다는 뜻은 아니다. 이번 실제 읽은 호출부는 `js/auth.js`, `js/supabaseClient.js`, `js/api/admin.js`, `index.html`, 관련 baseline/admin migration이다.

이번에는 Supabase connector가 이용 가능했다. 저장소 공개 config의 project ref와 조회 대상이 일치함을 확인하고 **SELECT metadata 조회10개**만 수행했다. Auth/session/회원 행·IP·토큰·개인 식별값은 조회하지 않았다. 운영 SQL 변경·잠금 취득·Auth signout·migration 적용·dump·복원·행동 시험은 수행하지 않았다.

조회는 서로 독립된 요청이며 하나의 원자적 catalog snapshot이 아니다. env 조회시각은2026-10-05 23:08:11 KST, 다른 조회도 같은 작업 중 수행됐다. 현재 정의/ACL이 읽혔다는 사실과 모든 철회 writer·외부 C/P 안전성 증명을 구분한다. snapshot에 조회SQL·정의·MD5·ACL·FK·정책과 범위를 남겼다. MD5는 재대조용 fingerprint이며 보안 무결성 보증이 아니다.

## 2. 환경·운영 적용 관찰

| 관찰 ID | 실제 읽은 사실 | 의미/미확인 |
|---|---|---|
| O01 | org plan=free, project region=ap-northeast-2, 상태ACTIVE_HEALTHY | 사용자 환경 확인과 일치. 모든 부하에서 가용성/성능 보장 아님 |
| O02 | platform DB17.6.1.084, SQL server_version17.6 | PostgreSQL17 문서 기준 사용. Auth server/SDK/CLI 실제 버전은 별도 |
| O03 | pg_database_size=39,636,115bytes | 시점 물리 DB 관측값39.636115decimalMB. 청구되는 DB size/일일 dump bytes/월사용량과 같다고 하지 않음 |
| O04 | migration history155건, admin permission20260908090000 등 관련 이력 존재 | history 존재는 현재 body 일치 증명이 아님. 현재 함수 정의 별도 조회 |
| O05 | connector current_user=postgres | 이 connector의 조회 권한. 미래 game adapter에postgres 접근을 승인한 것 아님 |
| O06 | auth.sessions/users SELECT: anon/authenticated/service_role false, postgres true | service key면 managed Auth table을 직접읽을 수 있다는 추정 배제. 지원된 최소권한 read 경계 미선택 |
| O07 | auth.sessions schema에not_after/refreshed_at 등 존재 | 값/현재 설정은 조회하지 않음. 존재만으로 만료 정책/row freshness 보장 금지 |
| O08 | `index.html`과accessTracker가supabase-js@2 CDN 참조 | major만 지정된 floating참조. 브라우저가 실제 받은patch/build/hash UNKNOWN |

월 egress/Realtime/Storage/Edge/MAU와 org 잔여 quota는 조회 수단이 이번 callable connector에 없어 UNKNOWN이다. DB 물리 size를 월 사용량0 또는 무료 여유량으로 바꾸지 않는다. JWT exp/session timeout·Data API 노출 설정·관리 콘솔 사용자 권한도 직접 확인하지 않았다.

## 3. 현재 함수·trigger·GRANT·호출 주체

운영 정의와 저장소의 관련 함수 계열을 대조했다. 포맷·개행을 무시한 전수 body 동일성 감사는 미수행이며 운영 fingerprint 원본을 기준으로 후속 재대조한다.

| 경로 | 운영 관찰 | 저장소 호출/권한 근거 | 남은 의무 |
|---|---|---|---|
| R01 status | admin_set_member_status: member관리권한 확인, advisory_xact_lock(73624721), target profile FOR UPDATE/status UPDATE | js/api/admin.js setMemberStatus→RPC. 실행ACL authenticated/service_role/postgres, PUBLIC/anon entry 없음 | 외부C/P·Auth R과 같은 순서 아님. 운영 SQL 우회/실행자 전체 미확인 |
| R02 가입 | approve/review: join_requests FOR UPDATE 후profiles/join_requests UPDATE | api/admin approve/review RPC, ACL 위와 같음 | profile 변경 충돌·부재/재삽입·인가 최종시점 검증 필요 |
| R03 role | admin_set_member_role: advisory lock/profile FOR UPDATE, 역할 감소 때admin_permissions DELETE | setMemberRole→RPC. 실제helper는 permissions 호출을system_admin 분기로 통과시키는 정의 | 실제 actor범위/동시권한 감소/외부P 미증명 |
| R03 permission | system_admin_set_permissions: system_admin검사, 승인admin확인, permission DELETE/INSERT | setAdministratorPermissions→RPC | 빈행/재삽입 scope lock·모든writer 집행 미증명 |
| R04 logout | js/auth.js lifecycleEpoch 먼저증가, push정리await 뒤auth.signOut() 인자없음 | pending/passwordReset/app 경유. 현재공식default는global | 실제SDK patch/default/서버R·local/others 동작 시험 전. push await가서버철회 증거 아님 |
| R05 Auth 직접/만료 | auth.sessions/users ACL 및schema조회. 선택 noninternal trigger조회에서sessions customtrigger0,users 신규생성trigger1 | 직접Auth API/콘솔경로는app wrapper와별도 | Auth 내부서버writer·JWT설정·동시경합·customlock지원 미증명 |
| R06 user 삭제 | profiles.id→auth.users ON DELETE CASCADE,join_requests도cascade,admin_permissions.user_id→profiles cascade | 이전정적153파일에서탈퇴API호출미발견 | 삭제API/콘솔/SQL의실제운영경로·기록식별unlink 미확인. cascade만으로제품삭제정책완료 아님 |
| R07~09 vNext | site catalog정의가future membership/view/owner barrier를제공한다는 근거 없음 | CP0057설계만 | 외부C/P·membership/oldowner 구현·지원 증명 필요 |
| R10 운영 | bootstrap_system_admin ACLpostgres/service_role,security definer;profile/tableservice_role full권한 | SQL운영·배포·credential경로가능성 | 실제주체/작업절차/동적SQL·외부API전수 미확인 |

profiles/admin_permissions/join_requests는RLS=true/force=false. authenticated는profiles/join_requests SELECT·UPDATE,admin_permissions SELECT. service_role/postgres는table full권한관찰. profiles_protect_privileged_columns trigger는역할/상태 등변경을검사하지만auth.uid()가null인운영경로까지동일한제품사용자검사를한다고추정하지않는다. RLS/SECURITY DEFINER/ACL을함께봐야한다.

private.is_approved_member는profile approved를검사하고auth.sessions 현재성은읽지않는다. private.has_admin_permission은system_admin 또는approved admin+permission row를검사한다. public.is_admin(legacy admin_users기반)과private.is_admin(system_admin기반)의정의가각각존재하므로이름만보고동일권한의미로치환하지않는다. 신규adapter의권한source선택은Astra판단이다.

pg_proc의선택적텍스트검색은profile UPDATE/DELETE 또는admin_permissions INSERT/DELETE 계열6함수를반환했다. 단순패턴검색은완전한writer inventory가아니다. 동적SQL·unqualified명명·Auth서비스·콘솔·수동SQL을누락할수있다. users생성trigger와profile직접UPDATE policy도별도로관찰했다. 직접호출가능성과실제누가운영중인지구분한다.

## 4. 공식 지원 설명과 공백

공식Supabase search_docs를우선사용했고가격/PG/AWS는공식웹원문을추가조회했다. 조회2026-10-05. docs는현재문서이고설치된버전의보장이자동적용되지않는다.

| ID | 원문 | 지원 사실 | 미확인/시험 연결 |
|---|---|---|---|
| S01 | [Sessions](https://supabase.com/docs/guides/auth/sessions) | session_id↔auth.sessions,signout뒤session제거;시간만료row는즉시삭제아닐수있음 | 최종C/P현재성·not_after/설정·지원권한 → T03 |
| S02 | [Signout](https://supabase.com/docs/guides/auth/signout)·[JS reference](https://supabase.com/docs/reference/javascript/auth-signout) | defaultglobal/local/others,refresh철회와accessJWT잔존 구분 | 실제browserbuild/scopes·others event차이 → T03 |
| S03 | [Realtime authorization](https://supabase.com/docs/guides/realtime/authorization) | 접근정책cache,연결/새JWT시갱신 | channel접속권한을message별Pgate로간주금지 → T01/T05 |
| S04 | [PG17 locking](https://www.postgresql.org/docs/17/explicit-locking.html) | row lock충돌과transaction수명 | managedAuth lock지원/DBlock→외부send 원자성보증없음 → T02 |
| S05 | [CLI dump](https://supabase.com/docs/reference/cli/supabase-db-dump) | 기본managedschema제외,data/customroles별도. targetdefaultprivileges가복원권한을확대할수있음 | dump/restore권한명세·RLS/GRANT사후검증 → B02/B06 |
| S06 | [Backup/restore](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore) | sessionpooler사용/별도schema,data,roles절차 | managedAuth·customschema·Storage본체·연결key복원별도 → B02/B06 |
| S07 | [PG17 pg_dump](https://www.postgresql.org/docs/17/app-pgdump.html) | 일관된dump와snapshot옵션의도구지원 | 여러CLI호출/묶음이같은cut인지자동보장아님 → B01 |
| S08 | [Changelog](https://supabase.com/changelog) | PG17.6→17.11 배포및pgcrypto/customoperator등변경안내 | 운영17.6관측과구분. 복원대상/도구버전재확인,해당extension사용영향미감사 |

changelog.md는text/markdown도구오류로HTML대체. CLI검색결과의직접공식항목만사용했으며검색에포함된일반이관가이드의mutation예제를실행하지않았다. 계정/Auth삭제는공식경로가있어도이번에호출하지않았다.

공식문서·catalog SELECT권한은Auth writer와외부C/P원자성의증명이아니다. DB lock소실후oldallow/send·pause/resume·송신queue·oldowner에대한지원보장을확보하지못했다. 핵심설계재선택없이A기준/구현HOLD유지.

## 5. 미확인 자료·담당

| M | 필요한 자료 | 확인수준/담당 |
|---|---|---|
| M01 | 운영콘솔/직접SQL/배치/credential주체·동적writer·Auth내부경로 | 일부catalog관찰,전수미완료. 운영자 비밀없는경로목록→Sol |
| M02 | exactsupabase-js/auth-js/realtime-js/browserbytes·Auth버전/exp설정 | floating@2확인,exactUNKNOWN. Solmanifest·지원자료 |
| M03 | 최소권한session검증·managedrowlock의공식지원/호환계약 | SELECTconnectorpostgres가능,adapter미선택. 지원답변→Astra |
| M04 | 실제C/P위치·SDKqueue·DB락소실이후의외부fence | 런타임미구현/미증명. Astra핵심경계판단→후속구현/시험 |
| M05 | oldowner저장+송신·Auth/role rollback복원source | 운영vNext증거없음. Astra→후속T08/B07 |
| M06 | quota기간/서비스별egress·Realtime·Storage·billingmeter | monthlyUNKNOWN. 운영자Dashboard비밀없는수치→Sol |
| M07 | CLI/Docker/pg_dump版本·Authcustomschema/GRANT범위 | 공식기본범위확인,실도구미고정. Sol명세→Astra |
| M08 | 삭제사본inventory·30일/탈퇴와7일복구점양립방식 | 기술候補만. Astra핵심선택→B03~05 |
| M09 | backup/validation/retry최장시간·복원duration·scheduler독립감시 | UNKNOWN. 이후허용된B01/B06시험 |
| M10 | 운영대응요일/시간·실제기기목록 | 사용자정보필요. 아래요청자료만수집 |

사용자에게추가로필요한정보는 대응가능요일/시간, 가능하면billing기간과서비스별usage화면의비밀없는수치, 시험용PC/Android/iPhone모델·OS정보다. 미래월사용량을확정하라고요구하지않는다. 접근key·토큰·회원데이터는필요없다.

## 6. 지원 문의 초안 — 미전송

1. Free/PG17에서session_id의현재session존재·만료를서버가최소권한으로검증할지원방식과managedAuth schema안정성계약은 무엇인가?
2. auth.sessions/users에대한읽기/충돌lock과Auth global/local/others/관리삭제를직렬화할지원경계가있는가? 지원되지않는customtrigger/lock방식과upgrade주의는?
3. Auth직접writer가외부runtime/최종egress와같은revocation순서를보장할공식기능이있는가? JWTTTL/event만으로즉시차단이라고주장하지않는전제다.
4. not_after/refresh/시간만료row의의미·정리시점과현재Auth설정확인방식은?
5. Free의공식잔여usage/제한적용시간을읽기전용으로받을수있는지원endpoint는?
6. 지원CLI버전별managedAuth/Storagecustomdefinitions·data/role/privilege dump/restore범위와하나의consistentcut확보방법은?

실제지원문의는전송하지않았다. 답변이있어도제품C/P/R시험을대신하지않는다. 전체게이트상태유지,시험NOT_RUN,정식반영·구현·STEP5A·병합·main없음.
