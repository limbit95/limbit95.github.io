# 청파 같이 본 사이트 DB 이력

이 디렉터리는 **청파 같이 본 사이트**의 Supabase baseline과 이후 운영 migration을 보존합니다.

게임 영역(Liar Game, Splendor)의 소스와 DB 객체는 이 디렉터리의 관리 범위에서 제외합니다.

## 구성

```text
supabase/site/
├── README.md
├── baseline/
│   ├── 00_setup.sql
│   ├── 01_members.sql
│   ├── 02_activity_categories.sql
│   ├── 03_events.sql
│   ├── 04_posts_comments.sql
│   ├── 05_date_polls.sql
│   ├── 06_notifications.sql
│   ├── 07_common_triggers.sql
│   ├── 08_auth_profile.sql
│   ├── 09_admin_rpc.sql
│   ├── 10_participation_rpc.sql
│   ├── 11_rls.sql
│   └── 12_avatar_storage.sql
├── seed.sql
└── migrations/
    ├── 20260825041209_expand_notifications_and_direct_messages.sql
    ├── 20260825041340_lock_down_notification_rpc_permissions.sql
    ├── 20260825041418_schedule_activity_reminder_notifications.sql
    ├── 20260825041451_index_notification_message_target.sql
    ├── 20260825090540_add_date_poll_fk_covering_indexes.sql
    └── 20260825103805_add_public_member_profiles_by_ids.sql
```

## baseline 출처

`baseline/00_setup.sql`부터 `12_avatar_storage.sql`까지는 2026-08-25에 전달받은 청파 같이 원본 `schema.sql`을 번호가 매겨진 기존 섹션 기준으로 분리한 것입니다.

- SQL 객체의 의미와 정의는 바꾸지 않았습니다.
- 각 파일을 순서대로 독립 실행할 수 있도록 `begin` / `commit` 경계만 파일 단위로 구성했습니다.
- 원본과 분리본의 실행 SQL 2,139개 행을 비교하여 순서와 내용이 일치함을 확인했습니다.
- 새 프로젝트를 재구성할 경우 파일명 순서대로 실행합니다.

## seed

`seed.sql`은 전달받은 초기 활동 카테고리 seed입니다. 2026-08-25 운영 DB와 비교하여 카테고리 이름, 아이콘, 색상, 설명, 활성 상태가 모두 일치함을 확인했습니다.

baseline 실행 후 seed를 실행합니다.

## 운영 migration

운영 적용이 완료된 `migrations/` 파일은 Supabase `supabase_migrations.schema_migrations`에 실제 기록된 버전과 이름을 그대로 사용합니다. 운영 적용 전으로 표시한 migration은 예외입니다.

운영 DB에 이미 적용된 migration은 다시 실행하기 위한 파일이 아니라 **현재 운영 DB가 baseline 이후 어떻게 변경되었는지 추적하기 위한 source of truth**입니다.

현재 확인된 본 사이트 흐름은 다음과 같습니다.

1. baseline + seed
2. `20260825041209_expand_notifications_and_direct_messages`
3. `20260825041340_lock_down_notification_rpc_permissions`
4. `20260825041418_schedule_activity_reminder_notifications`
5. `20260825041451_index_notification_message_target`
6. `20260825090540_add_date_poll_fk_covering_indexes`
7. `20260825103805_add_public_member_profiles_by_ids`
8. `20260908090000_add_admin_permission_system` (운영 적용 완료)
9. `20260909062324_multistep_signup_verification` (운영 적용 완료, 회원가입 Phase 1 이력)
10. `20260909094910_native_auth_otp_signup` (운영 적용 완료, Native Auth OTP 전환 단계)
11. `20260909124500_enforce_native_auth_otp_signup` (운영 적용 전)

### 관리자 역할 및 영역 권한

`20260908090000_add_admin_permission_system`은 기존 `profiles.role`을 유지하면서
`member`(USER), `admin`(ADMIN), `system_admin`(SYSTEM_ADMIN) 3단계 역할과
`admin_permissions`의 영역별 권한을 추가합니다. 기존 승인 관리자는 서비스 중단을
막기 위해 일반 관리자 역할과 5개 운영 영역 권한을 그대로 받지만 최고 관리자로
자동 승격되지는 않습니다.

권한 migration을 운영 DB에 적용한 후, 배포 담당자는 실제 소유자 UUID를 확인한 뒤 서버 권한으로 아래 초기화를 정확히 한 번
실행해야 합니다. 부분 unique index가 최고 관리자 2명 생성을 차단합니다.

```sql
select public.bootstrap_system_admin('<verified-admin-uuid>'::uuid);
```

브라우저에서는 이 초기화 RPC를 실행할 수 없습니다. 이후 일반 관리자 지정/해제와
영역 권한 관리는 최고 관리자 UI 및 서버에서 재검증되는 RPC만 사용합니다.

### 날짜투표 FK 인덱스

`20260825090540_add_date_poll_fk_covering_indexes`는 Supabase Performance Advisor가 지적한 본 사이트 날짜투표 FK 2개의 covering index를 추가합니다. 적용 후 해당 `unindexed_foreign_keys` 경고가 사라졌음을 확인했습니다.

### 필요한 회원 프로필만 조회

`20260825103805_add_public_member_profiles_by_ids`는 승인 회원용 공개 프로필 RPC에 **UUID 배열 조회 경로**를 추가합니다.

기존 `get_public_member_profiles(p_user_id)`는 호환성을 위해 유지하며, 게시글/댓글/활동 참여자/카테고리 담당자처럼 필요한 사용자 ID 집합을 이미 알고 있는 화면에서는 `get_public_member_profiles_by_ids(uuid[])`를 사용합니다.

새 RPC의 보안 조건은 기존 공개 프로필 RPC와 동일하게 유지합니다.

- `private.is_approved_member()` 검사
- `SECURITY DEFINER`
- 고정 `search_path = ''`
- `anon` EXECUTE 없음
- `authenticated`, `service_role`만 EXECUTE 허용

운영 적용 후 실제 함수 권한도 위 상태로 확인했습니다. Security Advisor의 `authenticated_security_definer_function_executable` 항목은 승인 회원이 의도적으로 호출하는 RPC이므로, 경고만 보고 EXECUTE를 제거하지 않습니다.

## 같은 Supabase 프로젝트의 별도 객체

운영 프로젝트에는 다음처럼 청파 같이 본 사이트 baseline이나 위 migration으로 생성되지 않은 별도 객체도 존재합니다.

- `public.is_admin()`
- `public.rls_auto_enable()`
- `public.set_updated_at()`
- `public.get_admin_storage_usage(...)`
- `public.get_admin_table_usage()`

일부 함수는 `admin_users`, `site_settings`, `mission_posts` 등 현재 청파 같이의 `profiles` 기반 권한 구조와 다른 테이블을 참조합니다. 따라서 이 디렉터리에 억지로 포함하거나 이번 기반 정리에서 삭제하지 않습니다.

## 운영 원칙

- 운영 DB를 추측해서 덮어쓰지 않습니다.
- 새 DDL 변경은 실제 적용 migration과 GitHub 기록을 함께 남깁니다.
- 운영 반영 전 RLS, 함수 실행 권한, trigger 영향 범위를 확인합니다.
- 이미 적용된 migration을 운영 DB에 재실행하지 않습니다.
- Advisor의 SECURITY DEFINER 경고는 실제 호출 주체와 함수 내부 권한 검사를 확인한 뒤 판단합니다.
- `liar_*`, `splendor_*` 객체와 게임 전용 SQL은 별도 관리하며 이 디렉터리에서 수정하지 않습니다.

### 다단계 회원가입 이메일 OTP 배포

회원가입 이메일 인증은 별도 메일 API를 두지 않고 **Supabase Auth의 기본 가입 확인 이메일과 OTP 검증 기능**을 사용합니다. 운영에 이미 적용된 `20260909062324_multistep_signup_verification.sql`은 당시 custom challenge 구조를 준비했던 이력으로 그대로 보존하며, 최종 전환에서는 해당 challenge를 사용하지 않습니다.

배포 순서는 다음과 같습니다.

1. `20260909062324_multistep_signup_verification.sql` — **2026-09-09 운영 적용 완료**. `profiles.real_name`, 이용수칙 동의 컬럼과 실명 backfill은 계속 사용합니다. 이 migration에 포함된 custom challenge 테이블/RPC는 전환 완료 후 별도 cleanup 대상입니다.
2. Supabase Dashboard의 **Auth > Email Templates > Confirm signup** 템플릿을 `{{ .ConfirmationURL }}` 링크 방식 대신 `{{ .Token }}` 6자리 코드가 표시되도록 변경합니다. Email OTP Expiration은 300초를 기준으로 맞춥니다.
3. `20260909094910_native_auth_otp_signup.sql` — **2026-09-09 운영 적용 완료**. `signup_flow = 'auth_otp'` Auth 사용자는 `auth.users`만 먼저 생성하고, `profiles`/`join_requests` 생성은 이메일 인증 이후 `submit_join_request` RPC까지 미룹니다. 기존 운영 프론트의 full-metadata 가입 경로는 새 프론트 배포 전까지 계속 허용합니다.
4. 새 회원가입 프론트엔드를 배포합니다. 최초 인증번호 요청은 `supabase.auth.signUp()`, 재전송은 `supabase.auth.resend({ type: 'signup' })`, 코드 검증은 `supabase.auth.verifyOtp({ type: 'email' })`를 사용합니다.
5. 최종 `가입 신청`은 인증된 세션에서 `submit_join_request` RPC를 호출합니다. RPC는 `auth.uid()`와 `auth.users.email/email_confirmed_at`을 서버에서 확인하고 `profiles`와 `join_requests`를 한 트랜잭션으로 생성합니다.
6. 새 프론트의 OTP 가입 흐름이 정상 동작하는 것을 확인한 뒤 `20260909124500_enforce_native_auth_otp_signup.sql`을 적용합니다. 이 단계부터 Auth INSERT trigger는 이메일이 있는 Auth user 생성을 허용하되 signup metadata를 `profiles`/`join_requests` 생성에 사용하지 않습니다. 신규 커뮤니티 신청 행은 이메일 인증을 마친 사용자가 `submit_join_request`를 호출하는 경로에서만 생성됩니다.
7. 정상 가입, 잘못된/만료 OTP, 재전송, 가입 도중 이탈 후 복귀, 관리자 승인 대기 흐름을 검증한 뒤 기존 `signup_email_challenges`와 challenge RPC, 미사용 `signup-verification` Edge Function을 별도 cleanup합니다.

`submit_join_request`에는 사용자 ID나 이메일을 클라이언트 입력으로 받지 않습니다. 동일 사용자의 최종 신청은 transaction advisory lock으로 직렬화하고 이미 양쪽 신청 데이터가 존재하면 idempotent 성공으로 처리합니다. 한쪽 데이터만 존재하는 비정상 상태는 오류로 차단합니다.

선택형 푸시 알림 체크는 이번 회원가입 변경에서도 UI에만 유지하며 Auth metadata, DB 또는 Push Subscription에 저장하지 않습니다.
