# 청파 같이 Supabase 운영 원칙

이 문서는 **청파 같이 본 사이트**의 Supabase 변경 원칙을 정의합니다.

> 게임 영역(Liar Game, Splendor)의 테이블, RPC, Realtime, 문서와 SQL은 이 문서의 정리·리팩터링 범위에서 제외합니다. 게임 영역은 별도 변경 요청이 있을 때만 수정합니다.

## 1. 현재 Source of Truth

2026-08-25 기준으로 청파 같이 본 사이트의 DB 이력을 다음 구조로 확보했습니다.

- 초기 구조: `supabase/site/baseline/00_setup.sql` ~ `12_avatar_storage.sql`
- 초기 카테고리: `supabase/site/seed.sql`
- 이후 실제 운영 migration: `supabase/site/migrations/`
- 운영 상태 검증 기준: 실제 Supabase catalog와 `supabase_migrations.schema_migrations`

상세 실행 순서와 출처는 [`site/README.md`](./site/README.md)를 참고합니다.

기존 `notification_messaging_patch.sql`은 알림·쪽지 기능을 추가할 때 사용한 통합 패치 기록으로 보존합니다. 실제 운영 migration의 개별 버전 파일은 `site/migrations/`를 기준으로 합니다.

## 2. 청파 같이 본 사이트 범위

현재 본 사이트의 핵심 DB 영역은 다음과 같습니다.

- 회원/승인: `profiles`, `join_requests`, `profile_interests`
- 활동: `activity_categories`, `category_managers`, `events`, `event_series`, `event_participants`
- 날짜 투표: `date_polls`, `date_poll_options`, `date_poll_votes`
- 게시판: `posts`, `comments`
- 알림/쪽지: `notifications`, `direct_messages`

같은 Supabase 프로젝트에 존재하더라도 `admin_users`, `site_settings`, `mission_posts` 등을 기준으로 동작하는 별도 객체는 청파 같이 본 사이트 baseline에 포함하지 않습니다.

## 3. DB 변경 절차

청파 같이 본 사이트 DB를 변경할 때는 아래 순서를 따릅니다.

1. 변경 대상이 게임 영역인지 확인한다.
2. 운영 schema/RLS/function/trigger 상태를 조회한다.
3. 필요한 변경 SQL을 검토한다.
4. Security/Performance Advisor를 확인한다.
5. 실제 적용 migration과 동일한 이력을 `supabase/site/migrations/`에 기록한다.
6. 사용자 검토 전에는 `main`에 병합하지 않는다.
7. 운영 DB 반영이 필요한 경우 변경 내용과 영향 범위를 먼저 보고한다.
8. 반영 후 실제 SQL 조회로 결과를 검증한다.

## 4. 보안 원칙

- 공개 schema의 청파 같이 테이블은 RLS를 유지합니다.
- 브라우저에는 publishable/anon key만 사용하며 `service_role` 또는 secret key를 넣지 않습니다.
- 사용자 권한은 프론트 UI 숨김으로 보장하지 않고 RLS/RPC에서 다시 검증합니다.
- `SECURITY DEFINER` 함수는 목적이 명확한 경우에만 사용합니다.
- 함수의 실행 권한은 실제 호출 주체에 필요한 최소 범위만 허용합니다.
- 사용자 소유 row를 수정하는 정책은 `USING`과 `WITH CHECK`를 함께 검토합니다.
- 함수의 `search_path`는 가능한 한 명시적으로 고정합니다.

## 5. 보안 점검 범위 정정

초기 Advisor 점검에서 다음 `public` 함수들이 경고 대상으로 보였습니다.

- `public.set_updated_at()`
- `public.is_admin()`
- `public.rls_auto_enable()`

운영 함수 정의를 추가 확인한 결과, 청파 같이 본 사이트는 `private.set_updated_at()`과 `private.is_admin()` 등 **`profiles` 기반 private 함수**를 사용합니다. 반면 위 `public` 함수 일부는 `admin_users` 등 다른 테이블을 참조하는 별도/레거시 영역입니다.

따라서 이번 청파 같이 기반 정리에서는 위 별도 함수들을 경고만 보고 수정하거나 삭제하지 않습니다. 공통 event trigger처럼 프로젝트 전체에 영향을 줄 수 있는 객체는 별도 영향 분석이 필요한 경우에만 다룹니다.

현재 본 사이트에서 계속 추적할 항목은 다음과 같습니다.

- Supabase Auth의 Leaked Password Protection 설정
- 날짜 투표 영역 일부 FK covering index 필요성
- 본 사이트 `SECURITY DEFINER` RPC의 내부 권한 검증 유지

## 6. 게임 영역 보호 규칙

청파 같이 본 사이트 정리 작업에서는 아래 영역을 수정하지 않습니다.

- `liar_*` 테이블/RPC/Realtime 구조
- `splendor_*` 테이블/RPC/Realtime 구조
- `supabase/liar-game/`
- 게임 전용 SQL 및 게임 전용 문서

공통 DB 변경이 게임에 영향을 줄 가능성이 있으면 변경 전에 영향도를 별도로 확인합니다.
