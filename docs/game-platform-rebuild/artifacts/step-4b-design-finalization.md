# STEP4B — S-A·S-B·S-C 구체 설계와 종료 판정

2026-10-07 KST. 고정 입력 CP0073 `e3aa3feaf945e472d73360d7f580f583b01ce648`, tree `ca40328ddefe2236d6b9ae168cf3f3c08d88d176`. 시작 PR412 HEAD 일치, 추가 변경0. AGENTS→계획1.3→기록 README→CURRENT→CP0073/D0006~08→PR 순서로 확인했다. 이번 사용자 지시는 핵심 설계 및 정식 계약/계획 반영을 허용한다. ‘Astra’는 요청한 설계 책임 구분이며 별도 모델 실행 인증이 아니다.

## 1. 결론과 선택

**STEP4B 설계 종료는 HOLD다.** 단순히 미구현이어서가 아니라 §7의 Z1 실제 commit 시간 경계가 아직 요구를 충족하지 못하기 때문이다. CP0073의 세 큰 묶음을 그대로 다음 담당에게 돌리지 않는다. 이번에는 권한 함수·writer 절차·송신 구현·외부 보관 구조·제품 조합을 아래와 같이 선택하고, 남은 공백을 실제 commit 사건 하나로 좁혔다.

| 묶음 | 이번 결정 | 상태와 한계 |
|---|---|---|
| S-A | 비노출 고정 predicate 함수, 전용 EXECUTE caller, 모든 권한 DML의 ticket/guard, Auth cascade 별도 처리 | 구체 설계 결정 완료. 활성 Auth 설정/필드 의미의 배포 manifest 확인과 역할 거절 시험 필수. 모르는 정책에서는 개방 금지 |
| S-B | DynamoDB 서울의 분리 기록·연결·현재 제어 원천, 조건부 transaction으로 replay 차단, 개인정보 full dump 미사용 | 정상 저장·PG 단독 재해·삭제 순서 설계 결정. 전체 저장 불능은 B5의 중단/미확정 처리, 무손실 보장 아님 |
| S-C | Free 서울 + Lightsail Linux IPv4 2GB 서울 + DynamoDB Standard provisioned 서울 | 설계 조합 선택. 실제 구매/배포 아님. 예산·성능은 부하/계정 조건부, §5의 비용 식과 오픈 증거 적용 |
| C/P | PG 실제 commit C, 단일 Linux/OpenSSL memory BIO→nonblocking send P | P 집행 수단 선택. D0008 정지 예외 유지. 일반 DB commit 지연에 대한 Z1은 미해결 |

새로운 사용자 정책 채택은 없다. 기술 선택은 이번 설계 권한 안에서 결정한 것이며 비용 지출·Auth 교체·기존 게임 이관 허가가 아니다. 설계 선택과 현재 운영 적용을 혼동하지 않는다. 기존 가이드3 정식 본문은 원문 이력으로 남기고, 각 정식 파일의 CP0074 적용 절이 해당 조항의 현재 기준이다.

## 2. S-A: 신원·현재 권한과 최소 호출 권한

### A1. predicate와 신뢰 경계

신뢰 ingress가 서명·algorithm allowlist·project issuer·audience·sub·session_id·exp를 검증한다. 브라우저 sub/sid 또는 user_metadata를 권한으로 쓰지 않는다. 직접 SQL은 auth.uid() 자동 설정을 가정하지 않는다. 외부 요청을 검증한 ingress만 전용 DB login을 사용하고, 비노출 `vnext_private`의 고정 함수에 검증된 sub/sid·JWT exp·match/action/view를 bound argument로 전달한다. 이름은 향후 구현 명세이며 현재 존재하는 API가 아니다.

`check_access`는 primary의 새 statement snapshot에서 다음 조건을 모두 읽는다. DB finalizer는 오래된 ingress allow를 재사용하지 않고 같은 검사를 권위 변경 transaction 안에서 실행한다.

| 조건 | 읽을 실제/제안 필드와 판정 | 실패 처리 |
|---|---|---|
| 현재 user | 실제 auth.users.id 일치, deleted_at IS NULL, banned_until이 NULL 또는 이미 지남 | 부재/삭제/금지/해석 불명 deny. soft delete의 hash를 개인정보 삭제 완료로 취급하지 않음 |
| 현재 session | 실제 auth.sessions.id=검증 sid, user_id=검증 sub, not_after가 NULL 또는 현재보다 뒤 | 부재/known expiry deny. session row 존재만으로 allow하지 않음 |
| JWT 기한 | 검증한 exp와 알려진 not_after 중 이른 기한, clock 오차/집행 여유 고려 | 만료에 추가5초 없음. 회신 시각부터 permit 수명 재시작 금지 |
| 승인/역할 | profiles.status=approved; system_admin 또는 approved admin+admin_permissions의 해당 기능 | 기존 private helper 의미 계승. public.is_admin의 legacy 의미와 혼용 금지 |
| 판/정보 | 신규 match membership·recipient/view revision·action permission·owner/incarnation·closed 상태 | 참가만으로 모든 view 허가 금지, 타인 종료 기록 거절 |
| 외부 제어 | 현재 외부 incarnation 및 vNext용 권한 generation과 일치 | 과거 restore의 승인/epoch로 복귀 금지 |

Free에서 Pro의 timebox/inactivity/single-session 기능이 활성이라고 가정하지 않는다. 배포 전 비밀 없는 설정 manifest에 실제 활성 여부를 대조한다. 다른 정책이 활성이라면 그 정책 predicate가 추가될 때까지 시작 검사를 실패시킨다. UNKNOWN을 ‘꺼짐’으로 대체하지 않는다. 이는 정해진 구성의 배포 확인이며 새로운 제품 선택 과제가 아니다. 공개 Auth 소스와 managed 설치 버전이 같다고 쓰지 않는다. getUser는 별도 Auth 확인에 이용할 수 있지만 이 AND predicate나 final C/P 보증을 대체하지 않는다.

global/default·local·others는 삭제되는 대상 sid 범위만 다르고 같은 검사를 거친다. direct API/console/계정 삭제도 event를 기다리지 않는다. JWT/session 만료·refresh 재사용에 따른 실제 session 철회는 해당 현재 상태와 기한으로 판정한다. 실제 동작/원천 R 관측은 T03이며 현재 완료 증거는 없다. floating supabase-js@2/scope 없는 signOut은 저장소 사실, exact SDK pin과 실제 default 동작 확인은 배포/시험 의무다.

### A2. 현재 권한 제약을 반영한 함수 배치

이번 두 metadata SELECT는 auth.users/sessions의 RLS=true, owner=supabase_auth_admin, postgres의 SELECT GRANT OPTION=true와 BYPASSRLS=true를 확인했다. postgres는 superuser가 아니며 Auth owner membership 및 auth schema USAGE grant option은 false다. 따라서 CP0073의 ‘새 NOLOGIN owner에 column SELECT만 부여’ 후보는 그대로 작동한다고 승인하지 않는다. Auth 테이블 policy 생성이나 BYPASSRLS role 생성 가능성을 추정하지 않는다.

**선택:** 기존 설치 관리자 `postgres` 소유의 비노출 SECURITY DEFINER predicate를 좁은 capability로 사용한다. 이는 최소권한 owner라는 뜻이 아니다. owner의 넓은 권한을 고정 함수 본문으로 제한하는 명시적 신뢰 경계다. runtime은 postgres/service_role 자격증명·role membership·Auth schema/table SELECT·DDL을 받지 않는다. connector 자격증명을 배포에 복사하지 않는다.

- 새 server login은 NOSUPERUSER/NOBYPASSRLS/NOCREATEROLE/NOINHERIT 및 CONNECT·전용 schema USAGE·정해진 함수 EXECUTE만 가진다. predicate read와 finalizer/write, fence controller 호출 권한을 분리한다.
- 함수는 search_path 빈 값, 완전 수식 객체명, 고정 SQL, 동적 SQL/사용자 지정 함수명/SQL 조각 금지. 결과는 필요한 allow/기한/revision만 반환한다. PUBLIC/anon/authenticated/service_role EXECUTE 제거와 노출 schema 제외를 명시한다.
- security definer의 current_user를 호출자로 사용하지 않는다. 전용 DB session_user allowlist와 EXECUTE ACL을 함께 검사한다. PostgREST authenticator 경유 호출은 이 직접 DB endpoint에서 거절한다. 임의 claims GUC는 신뢰 증거가 아니다.
- server credential 유출 시 허용 함수의 subject 대입 위험은 존재하므로 ingress credential과 일반 worker를 분리한다. 이를 사용자 JWT 서명 검증으로 대체했다고 하지 않는다. 함수 owner/code 변경은 오프라인 migration 권한만 가진다.

이 변경은 CP0073의 희망적 최소 owner 대신 실제 관측 권한으로 연결한 설계다. 운영 함수 설치/권한 부여는 하지 않았다. T10에서 ACL 우회·SQL injection·caller spoof·다른 사용자/판·Data API를 검증하기 전 오픈 불가다.

### A3. 모든 writer와 cascade

권한 의미를 바꾸는 `profiles` status/role/delete, `admin_permissions` insert/update/delete, 가입 승인·거절로 이어지는 상태 변경에 DB guard를 적용한다. 개별 함수 목록만을 완전성 근거로 쓰지 않고, 보호 column/table의 모든 DML을 최종 guard에서 통제한다. admin_set_member_status/role, system_admin_set_permissions, admin_approve_join_request/admin_review_join_request 및 bootstrap은 이 경로를 사용한다. 기존 마지막 관리자 보호·응답 의미는 유지한다.

1. controller가 actor/target의 안정 anchor를 정렬 순서로 닫고 operation ID·expected old/new digest·현재 incarnation을 durable하게 등록한다. C finalizer는 동일 anchor lock을 공유한다.
2. sender가 신규 P 차단·취소 가능 queue 폐기·진입 중 send 종료 또는 sender 격리를 확인한다. 종료 요청만으로 ACK하지 않는다.
3. 외부 현재 권한 원천에 proposed revision을 `PENDING/CLOSED`로 먼저 기록한다. DB writer는 현재 actor 권한·대상 값·ticket·gate generation을 재검사하고 내부 R을 commit한다.
4. DB 결과와 외부 원천을 대조해 COMMITTED로 전환한 뒤 fresh 검증으로 개방한다. 어느 중간 실패도 closed다. 두 DB의 원자 commit을 가정하지 않는다.

직접 운영 SQL도 정상 DML이면 ticket을 요구한다. Auth cascade 예외는 invoker guard에서 실제 session_user=supabase_auth_admin인 Auth connection과 원천 auth.users 부재를 함께 확인한 hard-delete 파생 경로로 한정한다. generic GUC, trigger depth 또는 parent 부재만으로 예외를 주지 않는다. admin_permissions의 profile 파생 삭제는 같은 root user와 연결한다. soft delete는 Auth user 상태로 차단하고 일반 site DML 예외로 확대하지 않는다. 실제 managed actor가 이 전제와 다르면 호환 시험 FAIL/배포 차단이며 일반 bypass를 추가하지 않는다.

operator의 직접 auth.users 삭제는 maintenance 폐쇄 확인 후에만 수행한다. trigger disable·TRUNCATE·DDL·role 변경은 runtime에 권한을 주지 않으며 maintenance global close/drain을 요구한다. 관리자 자체가 보호 장치를 고의 제거하는 상황을 일반 DML로 포장하지 않는다. 기존 게임 코드는 이관하지 않되 사이트 관리자 호출에는 vNext가 활성인 대상에 대한 preflight/ticket 연결이 필요하다. 기존 caller/응답 호환과 Auth 삭제 회귀를 통과하지 못하면 vNext 개방 금지다.

## 3. C/P·owner·운영 장애 경계

**C는 PG 실제 commit, P는 단일 gate의 native nonblocking send가 수락한 byte 범위다.** worker는 계산 제안만 제출하고 client socket을 갖지 않는다. state/revision/command hash와 owner/incarnation을 같은 PG transaction으로 확정한다. 기존 command 결과 반환·snapshot·retry·success/error/finally callback에도 새로운 P 검사를 적용한다.

송신 수단은 Linux/OpenSSL TLS memory BIO를 채택한다. 표준 TLS만 사용한다. output BIO→앱의 제한된 ciphertext queue→native send 경로를 단일화하며 SDK/TLS 자동 socket flush를 허용하지 않는다. partial send prefix만 P, EAGAIN/잔여 suffix는 다음 시도에서 재검사한다. 허가 상실 시 suffix 폐기와 연결 종료를 함께 수행한다. TLS record/sequence가 진행된 연결에 임의로 다음 app frame을 이어 붙이지 않는다. Node socket.write 호출/반환/callback을 최종 P로 삼지 않는다.

단일 active gate의 같은 host 교체는 OS의 이전 process 종료 및 FD 소유 종료를 확인한다. host partition에서 종료/격리를 확인하지 못하면 새 gate를 열지 않는다. 다른 host로 자동 takeover는 채택하지 않는다. match owner 전환도 송신 close/drain→DB owner 변경→fresh view 재개 순서다. DB epoch만으로 old gate 송신 차단을 주장하지 않는다.

검증 시작 s에 기반한 deadline을 사용하고 `d+L+b+e≤5초`를 운영 manifest로 관리한다. 숫자·tick·queue·주기는 사용자 요구로 추가하지 않는다. primary snapshot 시작 이전 cache를 신선한 조회로 쓰지 않는다. 실패 인지 즉시 permit/queue 폐쇄·pause, 최초 t0+60초 정각 abort 우선, retry/restart t0 초기화 금지다.

| 사건 | 처리와 판정 |
|---|---|
| 일반 지연/partition/이벤트 유실/lock·WAL wait | 원래 검증 범위. deadline 초과를 정지 예외로 전환하지 않음 |
| 최종 검사 전 정지 또는 재개 후 새 작업 | fresh 검사 없이 C/P 금지 |
| 최종 검사 후 증명된 runtime/DB/host 실행 정지 | D0008이 수용한 해당 in-progress C/P만 ACCEPTED_LIMITATION. 같은 queue의 다음 작업까지 예외 상속 금지 |
| known expiry/인지 실패/60초 중 실제 정지 | 같은 물리 한계, 재개 후 새 허가/기한 초기화 금지 |
| P 뒤 network 지연/재전송 | 회수 범위 밖. 새 P로 재집계하지 않음 |
| 원인·R/C/P·시계오차·trace 불명 | INCONCLUSIVE, PASS나 정지 예외 아님 |

**Z1:** PostgreSQL timeout과 마지막 clock_timestamp 검사는 일반적인 WAL/commit 지연 중 실제 commit을 deadline 이전으로 강제하는 수단이 아니다. session/user row lock은 관련 writer와 순서를 만들 수 있지만 wall-clock expiry와 모든 Auth 효과를 같은 lock으로 통제한다는 근거가 없다. CP0073 E01의 ‘일반 DB 지연 bound’는 단순 설정값이 아니라 채택에 필요한 전제다. 이번에는 이를 실행 시험으로만 넘기지 않고 설계 blocker로 바로잡는다. native gate 선택으로 DB C의 이 공백까지 해소된 것은 아니다.

## 4. S-B: 분리 외부 archive와 복원 제어

### B1. 구체 저장 배치

추천 제품은 **AWS DynamoDB Standard, 서울 단일 Region, provisioned capacity**다. S3/R2 full dump, 고객 관리 PITR/온디맨드 백업, Streams에 개인정보 사본을 추가하는 구성은 이 기록 경로에서 사용하지 않는다. 선택 이유는 작은 record와 현재 generation의 조건 검사를 동일 transaction으로 묶어 늦은 upload/replay를 막기 위해서다. S3 업로드 전 DB allow만 확인하는 이중 시스템 틈을 다시 만들지 않는다.

| 논리 데이터 | 내용·저장/삭제 계약 |
|---|---|
| Control | 현재 incarnation, writer generation, open/closed, min accepted archive generation. 개인 ID 없는 전역 제어 항목. 복구점으로 덮어쓰지 않음 |
| Subject current | 활성 회원의 vNext 권한 revision과 식별 연결. 현재 원천이며 과거 snapshot으로 복원 금지. 탈퇴 시 연결 제거, 후속 개인정보 사본 완료 전 상태를 성공으로 표시하지 않음 |
| Match record | opaque match ID, 최초 terminal/reason/revision/deadline, 필요한 최소 결과. 이름·email·JWT·IP 제외. 첫 종결+30일에 record 자체 삭제 |
| Participant link | 본인 열람을 위한 subject→match 연결 별도 항목. 탈퇴 시 해당 연결 삭제, 다른 참가자 연결은 원래 deadline 유지 |
| Recovery point | cut sequence·schema/ACL revision·검증 상태. 기록 payload를 복제하지 않는 manifest, 최근7일 보존. 삭제 대상은 복구점에서도 제거/비참조 처리 |

opaque ID/hash도 자동 익명이라고 부르지 않는다. 개인과 결합할 수 있는 index/로그/manifest 참조는 같은 삭제 inventory에 포함한다. 최소 기록은 항목400KB/transaction100개·4MB 아래의 명시적 크기 제한으로 구현하며, 초과 payload를 자동 다른 bucket에 spill하지 않는다. 이 한도는 공급자 제약이고 사용자 게임 품질 수치가 아니다.

### B2. authoritative 저장과 중복

normal terminal의 권위는 PG commit이다. PG에 terminal 원장과 외부 전송 outbox를 원자 기록하고, external record에 처음 관측한 같은 terminal ID/time/hash를 조건부 저장한다. 외부 보관 ACK 전에 ‘백업 완료’를 알리지 않는다. ACK 유실 시 강한 읽기로 동일 ID/hash를 확인한다. PG crash에는 durable terminal 유지, PG 재해에는 검증 복구점의 RPO24h를 적용한다. 늦은 retry가 종결 시각이나30일 deadline을 갱신하면 FAIL이다.

DynamoDB ClientRequestToken의 유한 중복 처리 시간에 의존하지 않고 application record 조건과 현재 writer generation을 매 transaction에서 확인한다. old generation의 Put/Delete/Update는 원천에서 거절한다. restore는 archive에 과거 데이터를 쓰는 writer 권한을 가지지 않으며 현재 원천에서 PG로만 재구성한다. 일반 worker는 archive raw write/IAM 관리 권한이 없다. controller의 명시 경로만 기록·삭제할 수 있다.

### B3. 삭제와 재생성 방지

삭제 controller는 현재 generation을 전진시키며 대상 record/link를 DELETING으로 닫는다. 과거 writer가 낸 transaction의 generation 조건은 저장소에서 평가되므로, 검사 후 process pause를 거친 늦은 요청도 거절된다. 새 generation writer는 현재 대상이 없거나 DELETING이면 recreate를 허용하지 않는다. 기존 match는 terminal ID를 재사용하지 않는다.

삭제 순서는 신규 publish/조회 차단→PG record/link/outbox 삭제→archive record/link 및 관련 manifest/index 삭제→두 원천의 확인이다. 글로벌 generation 때문에 오래된 사본이 없어졌어도 무기한 개인 tombstone을 유지할 필요가 없다. 제거 전 모든 이전 generation 요청과 권한을 폐쇄해야 한다. 새 generation에서 오래된 payload에 새 ID를 붙이는 경로는 금지한다. transaction 조건만으로 애플리케이션의 잘못된 새 요청 생성을 막았다고 주장하지 않는다.

퇴사/탈퇴와 삭제 기한은 모든 현재 사본에 동일 적용한다. VM에는 raw payload/session/token을 durable queue/log/core dump로 남기지 않는 배치를 선택한다. 유효 사본은 위 inventory에 한정하고 임시 export는 메모리 스트리밍, 실패 시 폐기한다. 새 사본 경로가 추가되면 삭제 명세에 먼저 포함한다. service 내부 물리 매체 소거를 고객 API로 관측했다고 주장하지 않는다.

DynamoDB TTL은 정각 삭제 수단이 아니므로 authoritative deletion에 사용하지 않는다. 명시 Delete/transaction과 확인을 사용하며 deadline 뒤 남은 사본은 실패다. 장애 때 접근 차단만으로 삭제 완료라고 하지 않는다. 삭제 실패·미완료 inventory·실제 완료 시각을 남기고 안전 개방을 막는다. 공급자 장애 중에도 삭제가 성공한다는 보장은 없다. 고객 접근 가능한 backup/version/stream을 만들지 않는 설정과 T11 inventory로 확인한다.

### B4. 복구점·권한 복원

12시간마다 cut을 시도하는 일정을 **설계 설정으로 선택**한다. daily 요구보다 자주 실행해 검증/재시도 여유를 확보한다. 검증2h·자동 실패 대응10h 이내라는 예산으로 `Δ12+v2+m10≤24h`를 사용하되, 이 숫자는 지원 측정값이 아니다. verified cut age를 연속 감시하고 실패 시 사람의20시간 공백만 기다리지 않고 재시도한다. 연속 실패로24h를 넘으면 RPO 미달로 기록한다.

cut은 primary의 read-only repeatable-read/exported snapshot을 기준으로 최소 terminal/link의 projection과 schema/ACL revision을 읽는다. snapshot이 연결 끊김으로 소실되면 그 cut은 폐기한다. 여러 SELECT나 DynamoDB Scan을 원자 snapshot으로 부르지 않는다. 수신 archive writer는 현재 삭제/권한 generation 검사를 통과한 항목만 받는다. 모든 chunk/hash/count/참조 검증 후 manifest를 VERIFIED로 바꾸며, concurrent 삭제가 있었으면 point를 새 generation에 맞춰 검증한다. cut/transfer/validated 세 시각은 별개다.

schema·RLS·GRANT·roles 정의는 고정 Git revision으로 재구성하고 비밀은 별도 운영 절차로 재주입한다. 이는 전체 사이트/Auth/Storage 백업이 아니다. vNext 최소 종료 기록과 살아 있는 참가자 연결의 복구 범위다. Auth credential/refresh/session dump, 기존 사이트 데이터, Storage bytes를 포함했다고 쓰지 않는다. Supabase CLI 기본 dump의 관리 schema 제외 및 Storage 실제 object 미포함을 기존 B02에 연결한다.

복원은 기존 gate 폐쇄·격리→외부 Control의 조건부 새 incarnation→권한/삭제 current 확인→검증 point의 살아 있는 기록만 PG 재구성→ACL 재검증→개방 순서다. Auth backup의 session은 재사용하지 않는다. fresh login의 실제 새로운 sid와 recovery barrier 이후 생성 여부를 검증한다. subject의 승인/운영 역할은 외부 current와 운영DB의 일치로 확인한다. email/닉네임만으로 다른 계정과 재연결하지 않는다.

외부 Control/Subject current 자체가 유실·rollback 의심이면 오래된 복구점으로 그 원천을 복구하지 않는다. 전체 closed·새 bootstrap incarnation·현재 권한 재확인으로만 회복한다. 별도 원천에도 재해가 나는 경우 가용성/RTO를 보장하지 않는다. 권한 부활을 허용해 가용성을 채우지 않는다. 이중 write 실패는 pending 상태와 최소 권한의 교집합으로 닫고, 오래된 PG snapshot만으로 승격하지 않는다.

### B5. 저장 불능과 종결 시각

PG 불능 때는 controller가 외부 durable record에 first_failure_at과 중단 사실을 남긴다. 두 저장소 모두 쓰지 못해도 보호 작업은 닫는다. process까지 소실되어 t0를 모르면 재개한 판에 새60초를 부여하지 않고 즉시 중단 상태를 유지한다. 살아 있는 durable terminal의 최초시각을 복구 시각으로 변경하지 않는다.

terminal 확정은 durable 기록의 commit과 결합한다. 저장 전 중단 의도/네트워크 단절을 성공한 terminal commit으로 보고하지 않는다. 정상 crash 복구에서는 양쪽 원장을 대조해 terminal 유무를 확인하고, 확인되지 않으면 판을 재개하거나 성공 종료 기록을 조작하지 않는다. DB 재해로 이미 durable인 최근 기록을 잃는 경우는 기존 RPO24h의 손실 범위로 보고하며, 옛 active snapshot에서 새 terminal/새30일 기한을 발행해 유실 기록을 재생성하지 않는다. 불명 사본은 공개/재발행하지 않고 기존 판 생성 시각 기반의 더 이른 내부 정리 기한으로 제거한다. 이는 확인된 terminal의30일 보존기간을 바꾸는 수단이 아니다.

모든 독립 저장소와 process를 동시에 잃어도 정확한 기록을 반드시 보존한다는 무손실 의무를 새로 만들지 않는다. 외부 원천까지 유실된 재해는 현 복구 범위 밖의 실제 손실/목표 미달로 보고하고 closed 상태를 유지한다. 이를 RPO 성공으로 계산하지 않으며, 추가적인 무손실 보장이나 모든 동시 재해의24h 복구 지원을 주장하지 않는다. 실행 의무는 first_failure/terminal commit 전후 crash에서 기한 초기화·허위 기록·삭제기한 연장이 없는지 확인하는 것이다. 이 한계만으로 새 사용자 정책 결정이나 별도 설계 단계를 추가하지 않는다.

## 5. S-C: 선택 구성과 비용 조건

선택 구성은 Supabase Free 서울 + Lightsail Linux/IPv4 2GB 서울($12/month) + DynamoDB Standard 서울 provisioned다. 초기 active gate/worker/controller는 단일 VM에 별도 권한으로 배치하며, 외부 scheduler/monitor는 game process와 별도 실행 주체로 둔다. 독립 실행은 EventBridge Scheduler→Lambda의 backup/verify/monitor와 SNS 경보를 선택한다. game VM이 멈춰도 cut/retry를 수행할 호출 경로다. Lambda는 비노출 read-only export 함수와 transaction 유지가 가능한 Postgres 연결을 사용하고, 한 invocation의 제한을 넘는 cut은 미완료로 폐기한다. 서비스의 견적·계정 설정은 아래 기타비용 예산 안에서 확정해야 하며 무료라고 가정하지 않는다. 유료 리소스는 생성하지 않았다.

| 비용 경로 | 계산/조건 |
|---|---|
| DB gate | actual returned bytes×조회수 + command/result + TLS/protocol. compact batch는 최적화 후보이나 전체 인가를 payload hash 없이 묶지 않음. uncached5GB에서 기존 소비도 차감 |
| gameplay | VM↔client. 월100명·10Hz·256B downstream/64B upstream 가정이면100h에115.2GB,730h에840.96GB, overhead20% 가정이면138.24/1009.152GB. rate/시간은 예측, 목표 승인/실측 아님 |
| Realtime | vNext gameplay/private 전달에 미사용. 기존 사이트 사용은 남는다. Free200연결·100events/s·100joins/s·월2M messages 한도와 cached/uncached 별개 |
| 외부 archive | DynamoDB 조건부 transaction은 일반 쓰기보다 capacity를 더 사용한다. 일/판수·record 크기·cut 검증 읽기·삭제·복원 포함. Free25 WCU/25 RCU/25GB는 계정 잔여·적용 확인 조건 |
| 백업 반출 | cut12h이면 월60회. projection10MB 가정0.6GB,100MB면6GB로 이것만으로 uncached5GB 초과. DB 표시55MB/전체disk318MB를 export 크기로 사용 금지 |
| 복원/검증/기타 | DynamoDB/VM transfer, scheduler·독립 감시·알림·로그·DNS/인증서·수수료·추가 운영 노동의 유상 비용을 포함. 기존 무료 잔여/무상노동을 실측0으로 기입 금지 |

월 총액은 `(12 + D + X + M) × 환율 × (1+세율) + 원화 기타비`다. D는 실제 DynamoDB 비용, X는 전송/복원/초과, M은 감시·운영 비용이다. 환율1400/1500/1600, 세율10%는 민감도다. VM만18,480/19,800/21,120원, 나머지 허용 예산11,520/10,200/8,880원이다. 1600원 시나리오에서 기타 USD4와 카드수수료2% 가정이면28,723.2원으로 남는 여유1,276.8원이다. USD4는 확인된 서비스 요금이 아니라 구성 전체가 지켜야 할 설계 한도다. 서울 DynamoDB 유료 단가를 미국 예제 가격으로 대체하지 않는다.

DB gate 전체5query/s·256B 응답 예측은730h3.36384GB. 10MB×60cut을 더하면3.96384GB이며 기존 site/command/기타가 차지할 여유는1.03616GB에 불과하다. 이 조건을 벗어난 지속부하는 Free와 충돌할 수 있다. cached5GB를 합쳐10GB로 계산하지 않는다. 100명은 동접 목표이며 사용시간/초당 명령량을 정해 주지 않는다. 서버 기본료가 예산 안이라는 이유로 총비용·100명·250ms 지원 완료를 선언하지 않는다.

채택은 **조건부 설계 선택**이다. 오픈 전 실제 계정 잔여·서울 SKU 견적·meter·운영비가 위 식과 성능을 동시에 만족해야 한다. 한도 접근 시 자동 과금 확대/Pro 전환은 금지한다. 새 판 접수를 중단하는 비상 비용 보호는 목표 미달/가용성 제한으로 보고하며100명 지원 성공으로 계산하지 않는다. 정상 목표 부하 자체가 이를 발생시키면 현재 조합 불합격이며 예산/목표를 몰래 낮추지 않는다.

RTO는 discovery→alert→acknowledged→start→restored→validated→safe-open을 각각 기록한다. 평일00시 직후 발견·20시 즉시 착수 가정에는 약4시간만 남는다. 이는 상시대응 보장이 아니다. 주말‘풀’도 수면/부재/공휴일/대체 담당을 해결하지 않는다. 자동 retry/감시와 수동 복원 runbook을 채택하되 실제 착수·복원·삭제·권한 검증 시간과 예외 대응이 갖춰질 때까지 오픈 blocker다. 단순 담당 착수 시각으로 discovery를 바꾸지 않는다.

## 6. 시험 보완 — 전부 NOT_RUN

기존 CP0059 T/B 원문은 이력 보존한다. 다음 표는 현재 적용 delta이며 CP0054 E01~12 연결을 유지한다.

| 시험 | 현재 보완 / 증거 |
|---|---|
| T01~03 (E01~04) | 내부 site R은 close/ACK/DB commit 순서; 외부 Auth는 실제 R→C/P 최대5초. known expiry/인지 실패에 유예 없음. after-check 실제 정지 원인만 D0008 별도 집계. 일반 WAL wait와 backend 실행정지를 따로 주입, Z1을 통과했다고 가정 금지 |
| T04~06 (E04~06) | duplicate 원장 조회 뒤 새 P, snapshot view cut과 부분 TLS send byte 범위, 모든 늦은 callback·마지막 이벤트 유실·독립 reconciliation |
| T07~08 (E04/E08) | 최초 t0 보존/60초 정각 abort·old 저장/송신 각각 독립 증거. gate 종료 확인 전 takeover 금지. 잔여 byte와 새 작업 구분 |
| T09~10 (E07/E09) | start/terminal PG commit 전후 crash·외부 ACK 유실·최소권한/definer/직접 SQL/Auth cascade·타인기록/Data API. 양쪽 저장 불능+process loss에는 새60초·가짜terminal·새30일 기한 없이 closed/기록 미확정 유지 |
| T11/T14 (E10/E12) | archive generation 조건과 삭제 경합, 10분 이후 duplicate, 옛 point 복원, 외부 current rollback, allcopies 삭제·verified cut age·RTO·총청구 |
| T12/T13 (E11 및 E06) | 100명/판8, Win10/11 Chrome·Edge+iPhone Safari. input→원격 참여자의 권위 화면 p95≤250ms, 정상망 회복→각 fresh LIVE≤5s. 실패/누락 전수 보고, 안전성 위반 percentile 허용0 |
| B01/B02 | primary 일관 snapshot·완료/검증 분리, 최소 기록/현재 link·Git schema/ACL 범위. 전체 Auth/Storage backup으로 오인 금지 |
| B03~B05 | 30일/탈퇴·버전/임시본/로그 삭제, source transaction generation으로 stale write 차단, 7일 point의 삭제 우선 |
| B06/B07 | current 원천 불명은 closed, 새 incarnation·fresh sid·rights 교집합, discovery부터24h와12h cut/자동retry 조건 |

공식 API가 제공하는 기능·설계 추론·운영 관측·실행 증거를 분리한다. R은 원천 commit/충분히 좁은 보수 구간, C는 실제 DB commit, P는 syscall 수락 구간이다. 시계오차 포함 상한으로 판정하고 request/callback/xid 번호를 실제 순서로 대신하지 않는다. trace 누락/오차 불명은 INCONCLUSIVE, 범위 내 위반은 FAIL, 입증된 D0008 한계는 ACCEPTED_LIMITATION이며 PASS가 아니다.

공식 출처·새 metadata 관측의 범위는 [CP0074 근거](step-4b-design-finalization-evidence.md), 문서 검사는 [CP0074 검증](step-4b-design-finalization-validation.md)을 따른다.

## 7. 종료 조건과 다음 행동

| 게이트 | 설계 상태 | 설계 종료 전 잔여 | 실행/오픈 상태 |
|---|---|---|---|
| G01 | 품질 기준·선택 배치 연결 | 추가 핵심 선택 없음, G03/G04 의존 | T12/13·실측 NOT_RUN |
| G02 | 재연결/중복/view/60초/owner 규칙 결정 | 추가 핵심 선택 없음, B5의 closed/원장 대조 | T04~09 NOT_RUN |
| G03 | predicate/전체writer/최종P 수단 결정, OPEN/BLOCKING | Z1: 기본 장애 범위의 실제 DB commit 기한 | T01~10 NOT_RUN |
| G04 | 분리 archive/삭제·restore 수단 결정, PARTIAL/OPEN | 추가 핵심 선택 없음, B5 손실 범위/허위 재생성 금지 | B01~07·T11/14 NOT_RUN |
| G05 | 제품 조합과 예산 성립 조건 선택, PARTIAL/OPEN | 추가 핵심 선택 없음, 계정/부하 조건 충족 필요 | 계정 견적/부하/운영/RTO 비용 NOT_RUN/UNKNOWN |
| G06 | 두 Probe만 SCOPED_DESIGN_RESOLVED | 추가 없음 | 범용 규칙 면제/실행 승인 없음 |

**사용자 결정이 필요한 경우는 다음 실제 보장 차이 하나뿐이다. 이번에는 채택하지 않는다.**

1. Z1: 현재의 ‘실제 C 완료까지5초’를 유지하면 해당 commit deadline 집행 수단이 필요하다. 추천 변경 후보는 ‘5초 뒤 새 보호 명령의 최종 인가/착수 금지, 이미 최종 인가를 마친 PG transaction은 일반 저장 지연으로 늦게 완료될 수 있음’이다. 이는 실제 보장 완화이며 D0008과 동일 설명이 아니다. 권한 실패 인지 후 새 허가, 초기 무권한, P 상한은 그대로 금지한다. 사용자가 수용하지 않으면 현재 후보 C는 HOLD다.
이 질문은 알고리즘 선택이 아니다. D0008의 runtime 정지 위험을 일반 commit I/O까지 확대 승인받았다고 쓰지 않는다. 이번 기술 결정을 취소하거나 포괄 조사를 다시 시작할 이유도 없다. **다음 작업 하나는 Z1의 실제 보장 범위에 대한 사용자 결정**이다. 승인되면 그 범위만 계약에 반영하고 설계 종료를 판정한다. 승인 없이 STEP4B 완료/STEP5A 진입하지 않는다. 동일 Sol 조사·공급자 문의·새 포괄 감사를 기본 다음 단계로 지정하지 않는다.

100명/판8·세금포함 월추가30,000원·원격p95 250ms·각재연결5초·모바일5기능·기록열람/30일삭제/탈퇴연결제거·daily외부/RPO24h/발견후24h/최근7일복구점·Free서울·운영시간 목표는 변경하지 않았다. 소스·SQL·권한·실제 시험·job/dump/복원·STEP5A·병합·main 변경 없이 정식 문서와 기록을 제출한다.
