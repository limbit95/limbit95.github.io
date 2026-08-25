# 청파 같이 Supabase 운영 원칙

이 문서는 **청파 같이 본 사이트**의 Supabase 변경 원칙을 정의합니다.

> 게임 영역(Liar Game, Splendor)의 테이블, RPC, Realtime, 문서와 SQL은 이 문서의 정리·리팩터링 범위에서 제외합니다. 게임 영역은 별도 변경 요청이 있을 때만 수정합니다.

## 1. 현재 상태

운영 Supabase 프로젝트에는 청파 같이 본 사이트와 게임 기능의 데이터베이스 객체가 함께 존재합니다.

청파 같이 본 사이트에서 현재 사용하는 핵심 영역은 다음과 같습니다.

- 회원/승인: `profiles`, `join_requests`, `profile_interests`
- 활동: `activity_categories`, `category_managers`, `events`, `event_series`, `event_participants`
- 날짜 투표: `date_polls`, `date_poll_options`, `date_poll_votes`
- 게시판: `posts`, `comments`
- 알림/쪽지: `notifications`, `direct_messages`

현재 저장소의 `notification_messaging_patch.sql`은 알림·쪽지 기능을 추가한 **부분 패치 기록**이며 전체 운영 스키마를 재현하는 baseline이 아닙니다.

따라서 과거 README에 있던 `schema.sql → seed.sql` 방식의 안내를 현재 운영 환경의 기준으로 사용하지 않습니다.

## 2. Source of Truth 원칙

### 현재 전환 기간

전체 baseline migration을 정식으로 확보하기 전까지는 다음 두 자료를 함께 기준으로 봅니다.

1. 실제 운영 Supabase catalog
2. GitHub에 커밋된 이후 migration/patch 기록

운영 DB와 저장소가 다를 경우 **추측해서 운영 DB를 덮어쓰지 않습니다.** 먼저 운영 catalog를 조회하고 차이를 확인합니다.

### 목표 상태

앞으로 청파 같이 본 사이트의 DDL 변경은 `supabase/migrations/`에 순서대로 남겨서 GitHub만으로 변경 이력을 추적할 수 있게 합니다.

권장 형태:

```text
supabase/
├── README.md
├── migrations/
│   ├── <timestamp>_core_baseline.sql
│   ├── <timestamp>_notification_*.sql
│   └── ...
└── notification_messaging_patch.sql   # 기존 이력 보존
```

정식 migration 파일은 Supabase CLI의 migration 생성/동기화 절차로 만들고, 임의의 타임스탬프 파일명을 손으로 만들어 운영 이력처럼 취급하지 않습니다.

## 3. DB 변경 절차

청파 같이 본 사이트 DB를 변경할 때는 아래 순서를 따릅니다.

1. 변경 대상이 게임 영역인지 확인한다.
2. 운영 schema/RLS/function/trigger 상태를 조회한다.
3. 필요한 변경 SQL을 검토한다.
4. Security/Performance Advisor를 확인한다.
5. 작업 브랜치에 migration 또는 patch를 기록한다.
6. 사용자 검토 전에는 `main`에 병합하지 않는다.
7. 운영 DB 반영이 필요한 경우 변경 내용과 영향 범위를 먼저 보고한다.
8. 반영 후 실제 SQL 조회로 결과를 검증한다.

## 4. 보안 원칙

- 공개 schema의 테이블은 RLS를 유지합니다.
- 브라우저에는 publishable/anon key만 사용하며 `service_role` 또는 secret key를 넣지 않습니다.
- 사용자 권한은 프론트 UI 숨김으로 보장하지 않고 RLS/RPC에서 다시 검증합니다.
- `SECURITY DEFINER` 함수는 목적이 명확한 경우에만 사용합니다.
- `SECURITY DEFINER` 함수의 실행 권한은 `anon`, `authenticated`, 내부 실행 중 실제 필요 범위만 허용합니다.
- 사용자 소유 row를 수정하는 정책은 `USING`과 `WITH CHECK`를 함께 검토합니다.
- 함수의 `search_path`는 가능한 한 명시적으로 고정합니다.

## 5. 현재 확인된 후속 보안 점검 항목

2026-08-25 운영 프로젝트 Advisor 기준으로 청파 같이 본 사이트에서 별도 검토할 항목은 다음과 같습니다.

- `public.set_updated_at`의 mutable `search_path`
- `public.is_admin()`의 `anon` 실행 권한 필요 여부
- `public.rls_auto_enable()`의 `anon` 실행 권한 필요 여부
- Supabase Auth의 Leaked Password Protection 비활성 상태
- 날짜 투표 영역 일부 FK 인덱스 보완 여부

`send_direct_message`, `join_event` 등 로그인 사용자가 직접 호출해야 하는 RPC의 `authenticated + SECURITY DEFINER` 경고는 경고 문구만 보고 일괄 revoke하지 않습니다. 함수 내부의 `auth.uid()`/권한 검증과 실제 사용 목적을 개별 확인합니다.

## 6. 게임 영역 보호 규칙

청파 같이 본 사이트 정리 작업에서는 아래 영역을 수정하지 않습니다.

- `liar_*` 테이블/RPC/Realtime 구조
- `splendor_*` 테이블/RPC/Realtime 구조
- `supabase/liar-game/`
- 게임 전용 SQL 및 게임 전용 문서

공통 DB 변경이 게임에 영향을 줄 가능성이 있으면 변경 전에 영향도를 별도로 확인합니다.
