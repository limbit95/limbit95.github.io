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
    └── 20260825041451_index_notification_message_target.sql
```

## baseline 출처

`baseline/00_setup.sql`부터 `12_avatar_storage.sql`까지는 2026-08-25에 전달받은 청파 같이 원본 `schema.sql`을 번호가 매겨진 기존 섹션 기준으로 분리한 것입니다.

- SQL 객체의 의미와 정의는 바꾸지 않았습니다.
- 각 파일을 순서대로 독립 실행할 수 있도록 `begin` / `commit` 경계만 파일 단위로 구성했습니다.
- 새 프로젝트를 재구성할 경우 파일명 순서대로 실행합니다.

## seed

`seed.sql`은 전달받은 초기 활동 카테고리 seed입니다. 2026-08-25 운영 DB와 비교하여 카테고리 이름, 아이콘, 색상, 설명, 활성 상태가 모두 일치함을 확인했습니다.

baseline 실행 후 seed를 실행합니다.

## 운영 migration

`migrations/`의 4개 파일은 Supabase `supabase_migrations.schema_migrations`에 실제 기록된 버전과 이름을 그대로 사용합니다.

이 migration들은 이미 운영 프로젝트에 적용되어 있습니다. 운영 DB에 다시 실행하기 위한 파일이 아니라 **현재 운영 DB가 baseline 이후 어떻게 변경되었는지 추적하기 위한 source of truth**입니다.

현재 확인된 흐름은 다음과 같습니다.

1. baseline + seed
2. `20260825041209_expand_notifications_and_direct_messages`
3. `20260825041340_lock_down_notification_rpc_permissions`
4. `20260825041418_schedule_activity_reminder_notifications`
5. `20260825041451_index_notification_message_target`

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
- `liar_*`, `splendor_*` 객체와 게임 전용 SQL은 별도 관리하며 이 디렉터리에서 수정하지 않습니다.
