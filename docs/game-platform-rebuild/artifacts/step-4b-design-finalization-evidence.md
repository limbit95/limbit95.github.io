# STEP4B — CP0074 선택 근거와 한계

조회일 2026-10-07. 고정 입력 CP0073 `e3aa3feaf945e472d73360d7f580f583b01ce648`. [판단](step-4b-design-finalization.md). 아래 공식 기능 설명은 설계 조합의 가능성 근거이며 운영 설치·전체 안전성·5초·성능·복구·삭제의 실행 증거가 아니다.

## 1. 확인 수준

| 분류 | 이번 사용 근거 | 한계 |
|---|---|---|
| 저장소 정적 정의 | CP0070/73의 함수·caller·SDK 및 현재 정식 계약 | migration의 운영 적용이나 floating SDK의 실제 실행 버전 아님 |
| 운영 관측 | 아래 catalog SELECT2개 | 서로 독립, 전수 writer/원자 snapshot 아님. 실사용자/session 값 조회 없음 |
| 공식 지원 사실 | 아래 공식 문서의 API/기능/한도 | 해당 기능을 조합한 앱의 전체 계약을 공급자가 보증한 것 아님 |
| 신규 설계 | private definer·ticket/guard·native TLS gate·DynamoDB generation·선택 제품 | 아직 함수/role/리소스 미생성, 운영 적용 아님 |
| 미확인 | 실제 Auth 설정/SDK pin, 계정 잔여·서울 유료 견적·월 부하·RTO·총청구 | UNKNOWN. 없는 값을0이나 기능 지원 완료로 대체하지 않음 |
| 실행 증명 | 권한 경합/5초/expiry/60초/owner/삭제/복구/100명 시험 | 모두 NOT_RUN |

## 2. 이번 운영 metadata

기존 연결 대상에서 읽기 전용 catalog 조회2개만 수행했다. 기존 함수 fingerprint 재조회는 하지 않았다. 조회 목적은 CP0073의 새 최소 owner가 Auth schema/RLS를 실제로 통과할 수 있는지와 predicate 필드가 존재하는지였다.

- 첫 SELECT: `pg_class/pg_namespace/pg_attribute`에서 auth.users/auth.sessions의 owner/RLS/column 이름, `has_table_privilege` 및 선택 column의 SELECT WITH GRANT OPTION, current_user/session_user와 rolcreaterole 조회.
- 둘째 SELECT: postgres/supabase_auth_admin/service_role의 login/superuser/BYPASSRLS/CREATEROLE, `pg_has_role('postgres','supabase_auth_admin','MEMBER')`, auth schema USAGE WITH GRANT OPTION, 두 테이블의 `pg_policies` 조회.

| 관측 항목 | 결과 |
|---|---|
| current_user / session_user | postgres / postgres |
| users·sessions owner | supabase_auth_admin |
| 두 테이블 RLS / FORCE RLS | true / false |
| 두 테이블 postgres SELECT grant option | true |
| 확인한 session 필드 | id, user_id, created_at, not_after, refreshed_at 등 존재 |
| 확인한 user 필드 | id, created_at, deleted_at, banned_until 등 존재 |
| 위 선택 필드 column SELECT grant option | true |
| postgres | login=true, superuser=false, bypassrls=true, createrole=true |
| supabase_auth_admin | login=true, superuser=false, bypassrls=false, createrole=true |
| service_role | login=false, superuser=false, bypassrls=true, createrole=false |
| postgres의 Auth owner membership | false |
| postgres의 auth schema USAGE grant option | false |
| 대상 두 테이블 정책 조회 | 결과 null; 조회 시 정의 없음 |

이 관측으로 ‘column SELECT를 새 NOLOGIN owner에 주면 충분’하다고 승인할 수 없다. 따라서 새 Auth policy/role 생성 권한을 추정하지 않고 기존 postgres 소유의 비노출 fixed SECURITY DEFINER와 전용 EXECUTE caller를 선택했다. owner 자체를 최소권한이라 부르지 않는다. 이 결론은 설계 추론이며 운영 함수 설치 성공/미래 adapter 권한 승인 증거가 아니다.

## 3. 공식 지원과 설계 사용

| 출처 | 확인한 좁은 사실 | 이번 사용 및 남는 경계 |
|---|---|---|
| [Supabase Sessions](https://supabase.com/docs/guides/auth/sessions) | JWT session_id와 session, 로그아웃/session 정책 설명. 고급 session 제한은 요금제 조건 있음 | user/session/JWT/사이트 권한의 AND predicate. 현재 정책은 배포 manifest 확인. row 존재 하나로 전체 허가하지 않음 |
| [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [PG17 CREATE FUNCTION](https://www.postgresql.org/docs/17/sql-createfunction.html) | SECURITY DEFINER 권한·안전한 search_path·EXECUTE 관리 | 비노출 fixed 함수와 runtime 최소 capability. postgres의 실제 권한은 위 운영 관측 사용 |
| [Auth deleteUser](https://supabase.com/docs/reference/javascript/auth-admin-deleteuser), [사용자 데이터](https://supabase.com/docs/guides/auth/managing-user-data) | 사용자 삭제와 참조 데이터/서버 관리 API | hard cascade와 soft 상태 predicate 분리. managed 실제 caller와 회귀 동작은 미검증 |
| [DB 연결](https://supabase.com/docs/guides/database/connecting-to-postgres) | direct/pooler 연결 방식과 제약 | snapshot 수명 유지 가능한 접속 선택; 트랜잭션 중 session 상실 cut 폐기 |
| [PG17 timeout](https://www.postgresql.org/docs/17/runtime-config-client.html) | statement/transaction 관련 timeout 제어 | 최종 검사 뒤 실제 commit 시각의 절대 상한과 동일하지 않음. Z1 설계 추론은 일반 지연과 D0008 정지를 구분 |
| [DynamoDB transactions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transaction-apis.html), [TransactWriteItems](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html) | 조건부 다항목 transaction, 한도, client token의10분 중복 처리 | generation 조건과 data write를 같은 transaction에 넣음. 원장 ID/hash로 더 긴 retry 중복 방지. 다수 scan 원자성 주장 없음 |
| [DynamoDB 읽기](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html) | table 강한 읽기 옵션 | ACK 유실 확인 및 현재 원천 조회. 광범위 조회 전체를 같은 snapshot이라 주장하지 않음 |
| [DynamoDB TTL](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html) | 비동기 만료 삭제 | 정확한30일 삭제에 TTL 의존 금지. 명시 삭제/확인·실패 보고 |
| [DynamoDB backup](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/backuprestore_HowItWorks.html) | 고객 backup/restore 기능 | 이 구성에서는 개인정보가 남는 고객 PITR/온디맨드 사본을 추가하지 않음. 공급자 내부 물리 소거 완료 주장 없음 |
| [OpenSSL memory BIO](https://docs.openssl.org/3.5/man3/BIO_s_mem/), [SSL_set_bio](https://docs.openssl.org/3.5/man3/SSL_set_bio/), [Linux send](https://man7.org/linux/man-pages/man2/send.2.html) | 메모리 TLS I/O 및 nonblocking/부분 send의 기능 | CP0073 근거 재사용. native syscall 수락 범위=P, 자체 암호 알고리즘 없음. queue/expiry/pause/old gate는 앱 구현 책임 |

공식 자료에 없는 종합 SLA를 찾기 위한 반복 문의는 하지 않았다. 공개 소스≠managed 버전, 검색에서 계약을 못 찾음≠명시적 미지원이다. 필드 의미/활성 설정이 선택 predicate와 다르면 배포를 닫고 불일치를 보고한다. 임의로 생략해 통과시키지 않는다.

## 4. 가격·제한 및 계산 가정

| 공식 출처 | 조회된 기능/가격 | 적용 조건 |
|---|---|---|
| [Supabase 가격](https://supabase.com/pricing), [Realtime limits](https://supabase.com/docs/guides/realtime/limits) | Free DB500MB, Storage1GB, uncached5GB/cached5GB 별도, Realtime200 연결/월2M·events100/s·joins100/s | 조직/프로젝트 기존 소비 차감. 과거 Dashboard 표시값은 새 월 청구/미래 workload 아님 |
| [Lightsail 가격](https://aws.amazon.com/lightsail/pricing/) | Linux IPv4 2GB, 2vCPU,60GB SSD,3TB transfer $12/month | 구매/성능 검증 전 후보 선택. 할인/초기 promotion으로 월 예산을 맞추지 않음 |
| [Lightsail transfer FAQ](https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-faq-data-transfer-allowance.html) | 초과 transfer 지역별, 서울 out 초과 $0.13/GB 안내 | 실제 SKU 포함량·in/out 집계와 청구를 계정에서 확인 |
| [DynamoDB 가격](https://aws.amazon.com/dynamodb/pricing/) | Standard provisioned 무료25WCU/25RCU/25GB 적용 조건 | 실제 계정 잔여 UNKNOWN. 서울 유료 단가 미확정이며 미국 예제값 대입 안 함 |
| [EventBridge 가격](https://aws.amazon.com/eventbridge/pricing/), [Lambda 가격](https://aws.amazon.com/lambda/pricing/), [SNS 가격](https://aws.amazon.com/sns/pricing/) | scheduler/실행/요청·알림의 별도 과금 경로 및 무료 조건 | 무료 잔여0 또는 무한으로 가정하지 않음. runtime/요청/로그/알림/지역 견적은 오픈 전 비용 manifest |

계산 검산: `12×[1400,1500,1600]×1.1=[18480,19800,21120]`; `(12+4)×1600×1.1×1.02=28723.2`. 기타USD4·세율10%·수수료2%는 예산 시나리오이며 실제 서비스 청구값이 아니다.

예상 gameplay는 `100×10×(256+64)×3600×hours/10^9`, hours100/730에서115.2/840.96GB.20% overhead 가정 포함138.24/1009.152GB. gate `5×256×730×3600/10^9=3.36384GB`; backup10MB×60=0.6GB. 판수·실제 메시지·export size·기존 소비·미래 부하 UNKNOWN이다. 이 식은100명 성능이나 월3만원 충족 증거가 아니다.
