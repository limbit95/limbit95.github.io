# STEP4B — G03 선택 근거·확인 범위

2026-10-04 KST. 고정 저장소 입력 `ffd536e86b99c208943243c38785e96d1c4b7ad7`. 이번은 원문/공식 문서 선택 확인이며 운영 DB·SDK·부하 실행 검증이 아니다. [판단](step-4b-authorization-boundary-judgment.md)의 R/E 식별자와 연결한다.

## 저장소 확인 범위

| ID | 선택 원문 | 확인 / 한계 |
|---|---|---|
| R01 | js/auth.js:454–471 | lifecycleEpoch 변경·push cleanup await·supabase.auth.signOut·clearAuthContext. 서버 게임 권한 fence 구현 증거 아님 |
| R02 | supabase/site/baseline/01_members.sql:10–34; 07_common_triggers.sql:85–98 | profile→auth.users FK cascade, status approved helper. 현재 session 검사나 외부 owner 확인은 이 함수에 없음 |
| R03 | supabase/site/baseline/09_admin_rpc.sql:184–255 | baseline 상태 갱신과 잠금. baseline을 최신 운영 정의로 단독 사용하지 않음 |
| R04 | supabase/site/migrations/20260908090000_add_admin_permission_system.sql:470–535 | 후속 status RPC의 profile FOR UPDATE 및 status update. 외부 owner drain이 이 함수에 있다는 증거 없음. 이후 전체 migration/실DB 최종 정의 전수 확인 아님 |
| R05 | js/api/admin.js:242–247; js/pages/admin/members.js:170–187 | 상태 RPC 호출과 성공 후 정지 완료 toast. 게임 별도 pending UX를 이미 지원한다고 가정하지 않음 |
| R06 | js/pages/mypage.js·js/api/profiles.js의 탈퇴/delete/signOut/logout 검색 | account withdrawal 경로 미발견. avatar cache delete와 계정 삭제를 구별. 전체 repo/운영 콘솔 경로 부재로 전칭하지 않음 |
| R07 | supabase/site/README.md baseline 출처·migration 관리 | baseline은 이력, 실제 적용 버전 확인 필요. 과거 운영 일치 기록을 이번 운영 확인으로 전이하지 않음 |
| R08 | step-4b-followup-judgment.md §4~8; step-4b-astra-judgment.md J03~J13 | 기존 A/B와 G/H 조건, J07 직렬화 경계·in-flight 제한. 새로운 벽시계 즉시 회수 의무로 과장하지 않음 |
| R09 | step-4a-lifetime-contract.md §5~8; game-platform-db-test-contract.md:15–44; development-rules.md §10B | viewer/수명·C/P 분리·11의무·재대결 계승. 기존 코드/규칙 수정 없음 |

추가 원문7파일은 원격에서 직접 읽어 별도 scratch 증거로 비교했고 repo 코드로 추가/수정하지 않았다. 기존 자료138파일은 고정 tree blob과 일치했다. 전수 source 감사가 아니며 계정 삭제·관리 콘솔·직접 SQL·모든 후속 migration·Auth session 내부 변경 경로는 W6의 남은 조사 범위다.

## 공식 원문

| ID | URL·선택 절 | 확인 사실 / 한계 |
|---|---|---|
| E01 | [Supabase sessions](https://supabase.com/docs/guides/auth/sessions), session_id·logout 이후 JWT 사용 방지 | session_id와 auth.sessions 존재 검사의 의미 확인. row 존재만으로 시간제한 정책 전체를 증명하지 않음. managed row 잠금/외부 C/P 원자성은 문서가 보장하지 않음 |
| E02 | [Supabase signout](https://supabase.com/docs/guides/auth/signout), signout scopes | logout 범위 구별과 access token 만료 한계. 실제 설치 SDK/default/scope·우회 경로는 별도 확인 |
| E03 | [User management](https://supabase.com/docs/guides/auth/managing-user-data), Deleting users·Removing account access | 삭제와 남은 JWT 유효성 구별, Auth user 삭제의 session cascade 및 Storage 소유 삭제 실패 가능성. 사이트 탈퇴 제품 흐름이 존재한다는 증거 아님 |
| E04 | [PostgreSQL isolation](https://www.postgresql.org/docs/current/transaction-iso.html), Read Committed | plain SELECT는 시작 snapshot을 읽으며 뒤 외부 작업을 잠그지 않음. 공식 current 페이지는18; 실제 프로젝트 PG 버전 미확인 |
| E05 | [PostgreSQL locking](https://www.postgresql.org/docs/current/explicit-locking.html), row lock modes | status UPDATE/DELETE와 충돌하는 잠금 선택 필요. FOR KEY SHARE와 비키 UPDATE를 혼동하지 않음. network side effect의 transaction 포함 보증 아님 |
| E06 | [Realtime authorization](https://supabase.com/docs/guides/realtime/authorization), Updating RLS policies | channel 정책 cache/JWT 갱신·만료 의미, Postgres Changes row RLS와 구별. 즉시 외부 owner 철회 근거로 쓰지 않음 |
| E07 | [Lightsail pricing](https://aws.amazon.com/lightsail/pricing/), IPv4 Linux SKU | $12/2GB 표를 재확인. 이번 서버 용량/region/견적 검증 아님 |
| E08 | [Supabase pricing](https://supabase.com/pricing), Pro/compute | 시작$25 및 compute credit 구조를 재확인. 계정 기존 plan/증분 비용 미확인 |

공식 원문이 제공하는 구성요소와 이번 분산 경계 설계는 구별한다. E04/E05를 근거로 단순 DB 권한 조회가 원격 server 송신까지 원자적이라고 추론하지 않는다. E01/E03을 이유로 서비스 키를 browser에 노출하거나 Auth 관리 schema를 임의 수정하지 않는다.

이번 산식은 예상 사용량이 아닌 시험 envelope:100×20×2=4,000 gate/s, 100h=1,440,000,000 gate;13×20×2=520 batch/s,100h=187,200,000 batch. 갱신100/T는 단순 호출량 표현일 뿐 허용 철회 지연T의 승인 아님. 기존 가격/트래픽 민감도는 [선행 비용 문서](step-4b-followup-sources-cost.md)의 가정과 미확인을 유지한다.

## 신규 조회 파일의 고정 링크와 blob

- [supabase/site/baseline/09_admin_rpc.sql](https://github.com/limbit95/limbit95.github.io/blob/ffd536e86b99c208943243c38785e96d1c4b7ad7/supabase/site/baseline/09_admin_rpc.sql) — `d512c204304181fc482e58bd3f71a938c82cbd7c`

- [supabase/site/migrations/20260908090000_add_admin_permission_system.sql](https://github.com/limbit95/limbit95.github.io/blob/ffd536e86b99c208943243c38785e96d1c4b7ad7/supabase/site/migrations/20260908090000_add_admin_permission_system.sql) — `85bfa15f9aa260f81bd42b0efc4b66ccfb3c4b71`

- [js/api/admin.js](https://github.com/limbit95/limbit95.github.io/blob/ffd536e86b99c208943243c38785e96d1c4b7ad7/js/api/admin.js) — `b7b481d11ed6bd2bb353fdbe19dec4ba7aa74f68`

- [js/pages/admin/members.js](https://github.com/limbit95/limbit95.github.io/blob/ffd536e86b99c208943243c38785e96d1c4b7ad7/js/pages/admin/members.js) — `36f2f421e5d8cf2cfe54a36fe20056027794b963`

- [supabase/site/README.md](https://github.com/limbit95/limbit95.github.io/blob/ffd536e86b99c208943243c38785e96d1c4b7ad7/supabase/site/README.md) — `02426634228d360249c868d7ed2529ecfded8dd5`

- [js/pages/mypage.js](https://github.com/limbit95/limbit95.github.io/blob/ffd536e86b99c208943243c38785e96d1c4b7ad7/js/pages/mypage.js) — `42c47ae59aa3e9d82cfd864bfb9ad60b20cad04a`

- [js/api/profiles.js](https://github.com/limbit95/limbit95.github.io/blob/ffd536e86b99c208943243c38785e96d1c4b7ad7/js/api/profiles.js) — `044708fa0381d4ed1c06390a92edcec9875d6c35`
