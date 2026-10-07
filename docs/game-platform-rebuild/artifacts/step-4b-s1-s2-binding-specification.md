# STEP4B — S1·S2 실행 경계 바인딩 명세 (CP0070)

입력 CP0069 `a4bd815b3b0c4c93893a82fa659cabdb4f93f0aa`, tree `0f3055eb96e153c988ff4e6b8c911496ed43546c`. 2026-10-07 KST. 시작 PR412 HEAD 일치/추가변경0, 기존 branch/OPEN Draft/미병합/base integration 유지. [CP0069](../checkpoints/CP-0069-step-4b-g03-practical-design-review.md)·[추천 구조](step-4b-g03-practical-design-review.md)·[D0006/D0007](../DECISIONS.md)를고정 입력으로 사용한다.

## 제출 결론

**S1은 JWT/회원 상태/운영 권한을 실제 수단에 연결할 수 있으나, session 검증의 최소권한 배치와 모든 writer의 gate fence 연결은 조건부다. S2는 DB 저장 fencing과 송신 대기열 제어를 명세할 수 있지만, 현재 확인한 PG17/Node/Linux API에서 최종 C/P의 절대5초 상한을 집행하는 primitive 바인딩은 확보하지 못했다.**

따라서 일반적인 “primary 조회 + 짧은 permit + timer + socket.write” 조합을 CP0069의 전체 충족 후보로 제출하지 않는다. 이 구체 조합의 마지막 검사 뒤 정지 반례는 남는다. 다른 모든 구조가 불가능하거나 공급자가 명시적으로 비지원이라고 결론 내린 것은 아니다. 이번 바인딩 작업은 여기서 종료하며 같은 자료 수집/문의 cycle을 재개하지 않는다. 최종 구조 채택/배제는 Astra 책임이다.

표에서 **공식 지원 사실 / 저장소 정적 정의 / 운영 관측 / 명세 제안 / 미확인 / 구현·시험으로 증명할 항목**을 구분한다. 구체 수단 연결 가능은 기능의 연결 가능성이며 이미 설치/권한 적용/시험 통과했다는 뜻이 아니다. 제안 인터페이스는 새로 구현할 계약명이고 공급자 API가 아니다.

## S1 — 현재 권한 predicate와 실제 경로

| ID/필요 판정 | 실제 수단·확인 수준/버전 근거 | 최소권한·호출 주체 | freshness/실패·연결 판정 | 실행 의무/관측 |
|---|---|---|---|---|
| S1-01 JWT identity/서명/iss/aud/exp | 공식 사실 F01/F02: getClaims(jwt) 또는 검증 라이브러리. 저장소는 CDN supabase-js@2, exact SDK/키 유형 UNKNOWN | vNext ingress가 사용자 JWT를 검증. 공개 검증키 사용 가능 조건 확인; algorithm/issuer/audience는 신뢰 설정에서 고정. service key를 사용자 identity로 대체 금지 | **조건부 연결 가능**: 서명 검증 후 expected project issuer/audience·sub/session_id·현재 exp를 직접 정책 확인. library의 모든 기본 검사 가정 금지. 오류/키 확인 불가/누락 deny. user_metadata·오래된 app_metadata로 현재 권한 결정 금지 | 고정 SDK/library/build/hash·키 유형·시계 오차 manifest, 위조/다른 project/audience/expiry T03/T10 |
| S1-02 현재 session/logout 대상 | 공식 F03: JWT session_id와 auth.sessions.id 연계, signout 대상 row 삭제. CP0059 운영 관측: id/user_id/not_after/refreshed_at columns | **제안** 서버 전용 primary DB predicate: session.id=검증된 sid AND user_id=검증된 sub. 브라우저/anon/authenticated에 Auth table SELECT 부여하지 않음 | **조건부 연결 가능**: logout 부재 판정에는 직접 primary read 경로 존재. session row 존재만으로 전체 allow 아님. row없음 deny, 조회 실패 즉시 deny/pause. 제한 역할의 실제 GRANT/RLS 통과 경로는 미확보 | scope별 synthetic R과 predicate snapshot trace T03. 내부 Auth 버전 전체 일치 주장 없음 |
| S1-03 현재 user/console·계정 삭제 | 공식 F04 getUser(jwt)는 Auth network user 조회. 기존 F63-04 deleteUser/user management와 CP0059 users/profiles cascade 관측 계승 | userJWT getUser를 identity 보조로 사용 가능. 직접 predicate는 사용자 존재·실제 사용중인 삭제/금지 상태만 최소 read; 민감 Auth column 반출 금지 | **조건부 연결 가능**: user 부재/금지면 deny. soft-delete의 실제 컬럼/반환 의미·managed 버전·설정은 미확인. getUser 성공을 finalC/P permit로 쓰지 않음 | hard/soft/console/direct API 각각 user/session/프로필 효과와 R oracle T03/T10. 실사용자 조회 없음 |
| S1-04 known JWT/session 만료·refresh | 공식 F03: session timebox/inactivity/single-session 기능은 Pro+, 만료 row 정리 지연 가능. 운영 not_after 존재는 설정 증거 아님 | ingress/validator가 exp를 매 finalization에 적용. 활성 정책이 있으면 검증된 not_after 및 설정별 조건 추가 | **지원 근거 미확보**: 실제 활성 만료 설정과 전체 predicate 미확인. Free에 Pro 기능 가정 금지. refreshed_at만으로 inactivity 정책을 새로 만들지 않음. known expiry deadline을 넘는 permit 금지 | 설정/정확한 의미의 비밀없는 manifest와 만료/refresh 경합 T03. 완료 응답 시각 기준 연장 금지 |
| S1-05 승인·가입 | 운영 관측 CP0059: profiles.status='approved', private.is_approved_member(); admin_approve_join_request/admin_review_join_request. 정적 js/api/admin.js 호출도 fixed SHA에서 확인 | 사용자JWT/RPC context에서는 auth.uid() helper 활용 가능. 서버 SQL 전용 역할은 검증된 sub를 bound argument로 읽는 별도 predicate 필요 | **구체 수단 연결 가능(기존 상태 의미)**: approved profile 존재 필수, 부재 deny. 가입 request는 승인 처리 경로이며 pending 요청만으로 참가 허용하지 않음. 현 helper는 session 미검사 | 승인/정지/가입 거절/삭제와 T01/T10. 서버의 임의 SET request.jwt.claims만으로 caller 검증 대체 금지 |
| S1-06 운영 역할·permission | 운영 관측: private.is_system_admin()는 approved system_admin; private.has_admin_permission(p)는 그 분기 또는 approved admin+admin_permissions. public.is_admin은 다른 legacy 의미 | 필요 운영 기능별 permission 한정. backend predicate는 현재 profile/permission을 검증된 sub에 대해 읽음. helper ACL authenticated이고 미래 DB 역할에 자동 이용권 없음 | **구체 수단 연결 가능(기존 권한 의미)**. public/private is_admin 혼용 금지. JWT role=authenticated는 운영 권한 아님. private.has_admin_permission('permissions')는 system_admin 분기로 통과, 이름만 보고 위임 가능 권한 생성 금지 | role 감소/permission 삭제·재삽입·조회 오류 T01/T10. 필요한 운영자 열람 범위는 기존 계약 유지 |
| S1-07 match 참가/recipient view | CP0069 설계뿐, 운영 vNext membership/view/owner 객체 없음 | vNext 전용 DB predicate, match/session/recipient scope. Data API 우회 접근을 RLS/GRANT와 별도 검증 | **조건부 연결 가능**: DB 조회/조건부 write 수단은 있으나 물리 객체 미구현. 참가/필요 운영자 + view generation + payload scope 명세 필요. 최초 무권한은0 | T05/T10; state revision/view 교체/타인 종료기록/오류정보 검증. 기존 game 테이블을 새 authority로 자동 채택 금지 |
| S1-08 default/global/local/others·직접 API | 공식 F05 scope 설명. 정적 js/auth.js signOut scope없음, CP0063 공개 Auth commit의 DELETE 경로는 당시 소스 | validator는 대상 sid를 읽어 경로 공통 적용. app wrapper/event를 유일 철회 원천으로 쓰지 않음 | **조건부 연결 가능**: global 전체/local 현재/others 현재 제외. actual R과 새 로그인 scope 경합·exact SDK/managed 동작은 미확인. others event 없어도 차단 필요 | 대상/비대상 session과 logout commit/관측구간 oracle T03. CDN 현재응답을 과거 bytes로 대체 금지 |
| S1-09 사이트 함수/trigger/직접 SQL | CP0059 선택12개/ACL/trigger/RLS와 아래 writer 연결표 | 기존 권한관리 caller 보호 유지, vNext fence controller만 폐쇄 확인을 제출. 일반 SQL도 fence 경로 또는 사전 폐쇄 유지보수 | **조건부 연결 가능**: 아래 사전 fence 계약 신규 연결 필요. 현재 함수의 advisory key/프로필 trigger만으로 P fence 미제공 | 모든 발견 writer와 부재/재삽입/cascade/직접 SQL T01/T02/T10. 전수 writer 적용 완료 주장 없음 |

### 최소권한 배치 명세 — 적용 없음

권장 명세는 vNext ingress/validator/finalizer/gate를 분리한다. validator는 필요한 current predicate만, finalizer는 vNext command/owner/state 변경만, gate는 인가 결과와 공개 가능한 payload만 소비한다. userJWT와 내부 gate identity는 서로 대체하지 않는다.

Auth 직접 read의 **권한 구현 두 방식**은 (a) 필요한 column에만 SELECT 가능한 전용 role + 실제 Auth RLS 허용 경계, (b) 비노출 schema의 제한 predicate 함수에만 EXECUTE를 주는 방식이다. 둘 다 현재 미적용/최종 미선택이다. (b)가 SECURITY DEFINER를 필요로 한다면 non-superuser 소유자 최소 read권한·안전 search_path·완전 수식 이름·PUBLIC EXECUTE 제거·trusted caller·target sid/sub 일치 검사·row/secret 비반환이 조건이다. 단순 definer 생성이나 service_role 사용만으로 Auth table RLS를 해결했다고 하지 않는다. CP0059는 anon/authenticated/service_role의 해당 SELECT=false이며 connector postgres만 가능했다. 그 권한 승계는 불허다.

auth.uid() 기반 기존 helper를 직접 SQL role이 그대로 부르면 null context로 의미가 달라질 수 있다. 검증된 subject 전달과 SQL caller 신뢰는 별도다. caller가 임의 sub로 원장 조회할 수 있는 public RPC는 만들지 않는다. 시스템 운영자용 bootstrap 권한을 game adapter에 주지 않는다.

**S1 원천 결합 제안:** primary의 짧은 단일 predicate statement에서 session/user/status/permission/참가/view가 가능한 한 같은 snapshot인지 확인한다. getUser와 DB predicate를 별도 요청으로 섞으면 원자 snapshot이 아니며 각 시작시각 중 보수적인 기준을 유지한다. cache/replica/오래된 transaction snapshot은 fresh 검증이 아니다. 삭제/금지 조건이 미확인이면 positive permit 발급 불가다.

### 사이트 writer에 사전 fence를 연결하는 위치

| 실제 경로/확인 수준 | 현재 동작과 부족 | 연결 명세 제안·필수 조건 |
|---|---|---|
| admin_set_member_status / setMemberStatus | CP0059 운영: 회원 권한 검사, advisory_xact_lock(73624721), profiles FOR UPDATE/status 변경 | 기존 의미/마지막 관리자 보호 유지. 실제 status 변경 전에 해당 subject의 vNext pending fence가 닫혔음을 검증하고 동일 transaction에서 권한 revision 갱신 |
| admin_set_member_role / setMemberRole | 운영: 권한 검사·같은 advisory key·프로필 lock·역할 감소 때 permission DELETE | role과 permission이 같은 subject fence로 보호돼야 함. advisory key를 외부 sender ACK로 해석하지 않음 |
| system_admin_set_permissions / setAdministratorPermissions | 운영: approved admin 확인 후 DELETE/INSERT. 선택 정의에는 위 global advisory lock 없음 | 빈 permission set/재삽입도 stable subject anchor로 보호. row 존재 lock만으로 부재→새 row 우회 방지 불가 |
| admin_approve_join_request/admin_review_join_request | 운영: request FOR UPDATE, profiles/request 변경. 정적 admin 호출 확인 | 승인/거절 모두 현재 권한 revision과 연결. 승인 자체가 과거 session/view 재개 허가는 아님 |
| profiles_protect_privileged_columns | 운영: auth.uid()!=null인 caller의 privileged column 보호; set_config flag 사용 | 기존 flag는 gate 폐쇄 증거가 아니다. 새로운 fence 검사를 secure DB 상태/실제 caller에 결합. 일반 client가 임의 GUC/nonce를 써서 우회할 수 없어야 함 |
| 직접 table UPDATE/DELETE/INSERT·bootstrap·배포 SQL | CP0059 authenticated 일부 UPDATE, service_role/postgres table full권한, bootstrap 별도ACL; 전체 writer 목록 미완료 | 일반 내부 writer에 DB-side 강제 guard 또는 vNext 폐쇄 유지보수 적용 필요. 기존 admin RPC만 감싸면 우회가 남음. superuser의 고의 장치 제거와 정상 운영 SQL을 구분 |
| Auth users 삭제→profiles/join_requests/permissions cascade | 운영 FK cascade 존재; 실제 Auth 삭제 actor/soft 경로 미확인 | 외부 Auth 경로에는 외부R5초 기준 적용. 내부 SQL guard가 Auth cascade를 무조건 pre-fence 요구로 거절하면 기존 Auth 삭제를 깨뜨릴 수 있음. 안전한 origin/actor 분류·cascade 경계 연결은 **미확인**, 임의 flag로 구분 금지 |

제안 순서: controller가 subject별 안정 anchor에 pending fence/operation ID/incarnation을 durable하게 등록 → DB command gate가 신규 C를 거절 → sender gate가 신규 P를 닫고 finalizer/취소 가능 queue를 정리 → 동일 incarnation의 durable ACK 확보 → writer transaction이 현재 권한과 fence를 확인하여 변경 commit R → 현재 predicate 재검증 후에만 새 permit. ACK/commit 실패는 닫힘 유지, retry는 같은 operation ID로 중복 방지. 폐쇄 ACK 전 이미 인계된 정보는 D0007의 회수 범위 밖이다.

위 anchor/fence/ACK는 **미구현 vNext 계약**이다. 기존 함수에 운영 적용됐다는 뜻이 아니다. trigger만으로 외부 송신을 원자 제어하지 않는다. gate restart가 ACK를 무효화하거나 failover sender가 자동 재개하면 이 계약은 깨진다. 내부 변경과 Auth cascade를 안전하게 구분할 방법 및 기존 caller 영향은 S1 필수 부족으로 남긴다. stable anchor를 개인정보의 무기한 tombstone 승인으로 만들지 않는다.

## S2 — 실제 집행 수단과 끝나지 않는 틈

| ID/집행 위치 | 구체 수단·분류/최소권한 | 연결 판정과 한계 | 관측·실행 의무 |
|---|---|---|---|
| S2-01 DB 권위 mutation/중복 | 공식 PG transaction/row lock/조건부 UPDATE/unique constraint. **제안** vNext command ID+hash·match revision·owner epoch/incarnation을 같은 transaction에서 확인/변경 | **조건부 연결 가능**: DB authority/중복 원장은 연결 가능, 물리 객체 미구현. SQL 완료는 실제 commit C가 아님. 외부 worker는 제안만 제출 | T01/T04/T08/T09: commit 순서, 동일 command 1회, 응답 유실 후 원장 조회. xid/sequence 할당을 commit 순서로 쓰지 않음 |
| S2-02 오래된 owner 저장 | 동일 owner anchor lock을 command와 교체가 공유, epoch/incarnation 조건부 write. 직접 raw table write 권한 제거가 조건 | **조건부 연결 가능**: old transaction이 먼저 lock을 보유하면 교체가 뒤, 교체 commit 뒤 새 old write는 거절. owner 변경과 무관한 lock만으로 미충족 | T08 저장 차단 독립 trace. DB disconnect 뒤 같은 transaction 재개 불가와 새 transaction 검증 구분 |
| S2-03 freshness/time | 공식 PG clock_timestamp(), statement/transaction_timeout(F06/F07); gate의 monotonic 시간은 고정 runtime에서 binding 필요 | **조건부 연결 가능(검사/timeout 기능)**. now()는 transaction 시작값이라 현재 시간 검사 대체 불가. timeout은 absolute commit-before-expiry API가 아님 | s/query snapshot/검증완료/최종검사/deadline/오차 기록. timeout 응답만으로 rollback 완료 추정 금지 |
| S2-04 실제 C의5초 deadline | single-statement/autocommit finalizer와 DB-side 최신 predicate·최종 시간 검사 제안. worker pause는 DB 재검증으로 줄일 수 있음 | **지원 근거 미확보**: 마지막 DB 검사 뒤 commit/WAL 단계 또는 backend/host 정지에서 deadline 초과 commit을 금지하는 구체 primitive 없음. PG17 timeout 설명에서 그 절대 상한 계약 미확보 | T02의 DB backend까지 포함한 정지/commit 관측. prepared transaction은 timeout 적용 제외이므로 이 후보에서 사용 금지 |
| S2-05 Node 기반 송신 gate | 공식 net.Socket.write, backpressure/drain/destroy 등. Node 문서 v26.10.0은 참고판, 배치/버전 채택 없음 | **조건부 연결 가능(송신/queue 기능)**: recipient route·generation·private payload를 gate 하나로 모을 수 있음. false는 사용자 메모리 queue가 남을 수 있어 P 완료 근거 아님. TLS/WebSocket 내부 단계 미바인딩 | T05 gate queue/SDK/TLS/OS별 취소 가능성, fragment/handoff ID. socket.write 진입/반환/callback 중 임의 P 선택 금지 |
| S2-06 native nonblocking send 대체 | 공식 Linux send/sendmsg + MSG_DONTWAIT(F09), 성공 byte count. 별도 TLS/프레이밍 경계 필요 | **조건부 연결 가능(P 관측 후보)**: 어느 byte가 수락됐는지 계측을 좁힐 수 있음. nonblocking은 절대 실행시간/현재 인가+deadline atomic 검사 보장 아님. 암호화 없는 전송 채택 금지 | syscall entry/수락/return 구간·TLS ciphertext와 payload metadata 대응, 부분 인계 새 인가. native adapter 미구현/미선택 |
| S2-07 실제 P의5초 deadline | 마지막 current check→실제 handoff의 deadline-aware binding 필요 | **지원 근거 미확보**. 확인한 Node/Linux API에는 인가 deadline과 해당 handoff를 공동 판정하는 계약이 없음. 현재 pre-check→write 조합은 **요구와 충돌**하는 반례 존재 | T02의 검사 직후 pause→R→5초 초과→send. 단순 테스트 통과로 공백 제거 선언 금지 |
| S2-08 old worker 송신/old gate 교체 | **제안** worker는 socket 미소유, gate가 owner/recipient generation별 route 거절. gate 교체는 이전 sender 종료/격리 확인 후에만 신규 활성화 | **조건부 연결 가능(통제 모델)**, 실제 격리/종료 수단·전체 fd/queue 영향·host 복귀 차단은 미바인딩. DB fencing은 P 차단 증거 아님 | T08 old worker/old gate 각각 테스트. 프로세스 종료 요청만으로 종료 ACK 간주 금지. 격리 확인 불가면 신규 owner도 닫힘 유지 |
| S2-09 snapshot/duplicate/retry/late callback | **제안** command/result 조회와 P 인가 분리, view generation/payload hash/owner/incarnation 검사 후 gate 최종 release | **조건부 연결 가능**, S1/S2-07 미해소이면 전체 보호 지원 미완료. 늦은 success/error/null/finally 모두 gate로 회귀 | T04~06: commit 유지·새 P 거절, snapshot 변경/부분 송신/timeout 재시도. private error도 동일 대상 |
| S2-10 복원·장애 deadline | **제안** 폐쇄 시작·새 incarnation·fresh login/current 권한·독립 삭제 원천 검증. first_failure_at durable 보존 | **조건부 연결 가능(계약)**, current 원천/rollback·모든 사본·자동 deadline 집행은 기존 잔여 유지. host 정지 동안 timer 실행 보장 없음 | T07/T08/T11: 재개 시60초가 지났으면 abort 우선, 재시작으로 t0 초기화 금지. B 명세 재작성 없음 |

### deadline 산식의 실제 연결

CP0069의 **d+L+b+e≤5초**를 유지한다. s는 최초 검증 요청 시작이며 permit 완료/재시도 시각으로 이동하지 않는다. direct primary statement의 snapshot, HTTP getUser의 source freshness, DB finalizer/gate 각각의 b, 두 시계 사이 e를 별도 표기한다. client 시계로 서버 기한을 연장하지 않는다.

| 변수 | 연결 수단 | 이번 상태 |
|---|---|---|
| d | primary query snapshot 시점과 실제 R 원천 관계; HTTP 내부 cache/검사 시점은 별도 | primary read의 의미는 공식 근거 존재, 선택 adapter/전 경로의 실제 지연 상한 UNKNOWN |
| L | 시작 기준 permit deadline, min(신선도 기한,known exp/실제 활성 만료 기한). 실패 인지 시 즉시 무효화 | 계산 계약 가능, 수치/주기 미채택 |
| b_C | 마지막 DB 인가/시간검사→실제 commit | 절대 상한 또는 초과 commit 방지 primitive 미확보 |
| b_P | 마지막 gate 검사→취소 불가 transport 인계 | Node/native 송신 API는 기능 존재, absolute deadline 결합 미확보 |
| e | 서버/DB/관측 시계 오차 + cross-system timestamp 정렬의 보수적 오차 | 미계측; 0 가정 금지 |

**구체 반례 판정:** gate 마지막 검사 성공 → 그 process/host 정지 → 직접 Auth R →5초 초과 → 기존 program counter에서 send. 재개 감지 callback이나 같은 event loop timer는 그 send보다 먼저 집행된다는 근거가 없다. native nonblocking send로 바꾸어도 검사→syscall 사이 정지가 남는다. worker만 정지시키고 DB가 새로 검증하면 그 경우는 줄일 수 있으나 DB 최종검사→commit 또는 sender 최종검사→handoff 정지까지 해결된 것은 아니다.

known expiry와 인지한 권한 실패에도 새 허용 시간을 붙이지 않는다. 실패를 알면 positive permit/queue를 즉시 무효화·판 pause, t0+60초에서 abort 우선이라는 계약을 유지한다. timer가 동작하지 못한 상황을 성공으로 기록하지 않는다. 차단 기능의 미지원 경계를 명시했으며 5초를 통계적 달성 기준으로 바꾸지 않았다.

**두 수단 비교의 종료:** PG authority+Node gate는 개발 연결이 단순하지만 최종 b/P가 미확보. native send adapter는 P 계측을 좁히는 장점만 있고 b 해소 근거가 없으며 TLS/프레이밍/운영 부담이 추가된다. 둘 중 하나를 전체 요구 충족으로 채택하지 않는다. deadline-aware finalizer나 독립 fail-closed 차단을 가상의 공급자 API로 제시하지 않으며 timer/watchdog 자체의 정지·복귀와 차단 위치가 특정되지 않았으므로 이번 바인딩 미확보로 종료한다.

## 지원 근거·조회 수준

| ID/공식 원문(조회2026-10-07 KST) | 연결 사실 | 적용 한계 |
|---|---|---|
| F01 [JWT](https://supabase.com/docs/guides/auth/jwts) | signature·iss/sub/exp와 검증 수단 설명 | 현재 session/current role proof가 아님 |
| F02 [getClaims](https://supabase.com/docs/reference/javascript/auth-getclaims) | JWKS 또는 Auth server를 이용한 token 검증 | project 키 유형·실제 SDK 설치 미확인, session 철회 fence 아님 |
| F03 [Sessions](https://supabase.com/docs/guides/auth/sessions) | sid/table·logout 삭제·Pro 만료 기능/정리 지연 | 직접 predicate의 전체 의미/권한 배치/5초 SLA 아님 |
| F04 [getUser](https://supabase.com/docs/reference/javascript/auth-getuser) | user JWT로 Auth network 조회 | 운영 Auth 버전 및 모든 만료 판정/최종 C/P 보장 아님 |
| F05 [JS signOut](https://supabase.com/docs/reference/javascript/auth-signout) | default global·local·others와 JWT 잔존 | 실제 SDK bytes/소스 설치 동일성 아님 |
| F06 [PG17 time functions](https://www.postgresql.org/docs/17/functions-datetime.html) | clock_timestamp는 실행 중 현재값,now는 transaction 시작값 | commit/handoff deadline enforcement가 아님 |
| F07 [PG17 timeouts](https://www.postgresql.org/docs/17/runtime-config-client.html) | statement/transaction/lock/idle timeout의 대상/시작 조건, prepared transaction 제외 | 시간검사+실제 commit의 hard deadline 계약 미확보; 운영 timeout 값 UNKNOWN |
| F08 [Node socket.write](https://nodejs.org/api/net.html#socketwritedata-encoding-callback) | kernel buffer/user queue/async callback 구분 | TLS/WebSocket 최종 P와 maximum pause 보장 아님 |
| F09 [Linux send(2)](https://man7.org/linux/man-pages/man2/send.2.html) | nonblocking flag·byte count·delivery와의 차이 | deadline-aware 인가/handoff API 아님; 배치 OS/runtime 선택 없음 |
| F10 [PG17 locking](https://www.postgresql.org/docs/17/explicit-locking.html)·[CREATE FUNCTION](https://www.postgresql.org/docs/17/sql-createfunction.html) | transaction lock·function ACL/search_path 보안 수단 | 모든 writer 참여/외부 송신 fence 자동 제공 아님 |

skill 지침에 따라 changelog.md를 시도했으나 retrieval의 text/markdown 오류로 [HTML changelog](https://supabase.com/changelog)를 제한 확인했다. @supabase/server adapter 전환/PG minor upgrade 안내는 현재 로드 SDK/DB 변경 사실이 아니다. 새 middleware가 session 철회/transport5초를 제공한다고 추론하지 않는다.

운영 metadata 재조회0: 기존 선택 snapshot으로 연결 위치와 ACL 공백은 특정되며 반복 조회로 S2 primitive가 생기지 않는다. 실제 활성 Auth 설정/최소권한/전체 writer는 미확인으로 남긴다. 실사용자/session row·비밀 값 조회0. CP0059/61 선택 관측은 전수 writer 감사·원자 snapshot·현재 전부 불변 증거가 아니다.

고정 입력 js/api/admin.js만 추가 정적 확인하여 RPC caller 이름을 연결했다. migration 존재를 운영 적용 증거로 사용하지 않았다. 공급자 공개 Auth 소스는 CP0063 당시 고정 ref를 필요한 의미에만 참조하고 현재 managed 버전으로 대체하지 않았다.

## 관측점·실행 증명 obligation

| 경계 | 남길 증거 | 부족하면 |
|---|---|---|
| 외부 R | synthetic session별 실제 source 효과/commit 또는 충분히 좁은 권위 관측 구간; scope 대상/비대상·오차 포함 | HTTP 응답/event 시각만이면 INCONCLUSIVE. last-valid 응답을 정확한 R로 간주 금지 |
| 내부 R/C | 실제 DB 권위 transaction 순서·command hash/revision/owner/incarnation·fence operation/ACK | SQL 요청/statement 완료/xid 번호만이면 INCONCLUSIVE |
| P | recipient/session/view/payload hash별 gate 취소 가능 마지막 단계와 실제 handoff/수락 bytes 구간 | app enqueue/callback만이면 INCONCLUSIVE; packet 수신은 handoff 자체의 관측 대체 아님 |
| 5초 | r_lo/r_hi와 C/P 관측 구간·clock 오차를 보수적으로 결합, 금지 구간의 지속 시도/deny trace | 안전성 초과1건 FAIL. 애매한 구간/trace 누락/오차 UNKNOWN이면 INCONCLUSIVE |
| owner/failover | old DB 저장거절과 old gate 송신거절을 별개로 기록; 이전 sender 종료/격리 완료 증거 | DB deny만으로 P PASS 금지 |
| T01~14 | CP0069 delta 유지, S1/S2 행별 manifest와 관측 연결. fixed SDK/Auth/DB/transport/OS 및 장애 주입 위치 기록 | 이번 전부 NOT_RUN. 명세/정적 CI를 행동 시험으로 표시 금지 |

## 후보 영향·Astra의 최소 다음 판단

| 항목 | 이번 확정 수준 | Astra가 판단할 내용 |
|---|---|---|
| S1 current predicate | 기존 상태/권한 의미 연결 가능, session 최소권한·만료 정책·writer/cascade fence는 조건부/미확인 | 제시한 predicate/권한/사전 fence 명세를 승인 가능한 계약으로 좁힐지, 어떤 행이 여전히 설계 필수 부족인지 |
| S2 DB authority/owner store | transaction/CAS/idempotency 모델 연결 가능 | C를 실제 commit으로 유지하는 후보의 deadline 공백에 대한 채택/배제 판단 |
| S2 final P/old gate | Node/native 관측 후보는 있으나 deadline/격리 binding 미확보 | 현재 단순 수단 조합은 미충족으로 판단하고, 새 구체 집행 수단이 없다면 채택 HOLD/배제로 결론. 동일 Sol 조사 재개 금지 |
| 사용자 정책 | 새 선택 없음; D0006/D0007 유지 | 요구 변경이 필요하다고 판단할 때만 실제 정책 차이를 별도 설명. 기술 선택을 사용자에게 전가하지 않음 |

**다음 담당 Astra, 작업 하나는 이 바인딩 표에 대한 후보 채택/배제 판단이다.** current API의 기능 존재와 절대 상한을 분리하여 결론을 낸다. 새 구체 수단이 없는 상태에서 같은 Sol 자료 준비를 반복시키거나 미확보 행을 시험으로 넘겨 승인하지 않는다. 이번 Sol 작업은 종료되었다.

G03 OPEN/BLOCKING; G01/G02/G04/G05 PARTIAL/OPEN; G06 두 Probe 적용만 SCOPED_DESIGN_RESOLVED. STEP4B IN_PROGRESS/전체 완료·구현 HOLD. 총접속100/판8·세금포함월추가3만원·원격권위화면p95 250ms·정상망회복각재연결5초·모바일 필수·기록 열람/최초종결+30일삭제/탈퇴 연결 제거·daily외부/RPO24h/발견후24h수동복구/최근7일복구점·Free서울·기존 운영조건 유지. 미래 workload/기존 소비/실청구 UNKNOWN. 비용/단말/backup 명세 재작성 없음.

이번은 구체 명세 준비와 기록 제출만이다. DECISIONS/과거 기록/정식 산출물/루트 계획/코드 보존. 핵심 구조 재선택·정식 반영·구현·실제 시험·권한 변경·문의·job/dump/복원·STEP5A·병합·main 없이 원격 제출 확인 뒤 정지한다.
