# 청파 같이 Supabase 운영 원칙

이 문서는 **청파 같이 본 사이트**의 Supabase 변경 원칙을 정의합니다.

> 게임 영역(Liar Game, Splendor)의 테이블, RPC, Realtime, 문서와 SQL은 이 문서의 정리·리팩터링 범위에서 제외합니다. 게임 영역은 별도 변경 요청이 있을 때만 수정합니다.

## 1. 현재 Source of Truth

2026-09-16 기준으로 청파 같이 본 사이트의 DB 이력을 다음 구조로 확보했습니다.

- 초기 구조: `supabase/site/baseline/00_setup.sql` ~ `12_avatar_storage.sql`
- 초기 카테고리: `supabase/site/seed.sql`
- 이후 실제 운영 migration: `supabase/site/migrations/`
- 운영 상태 검증 기준: 실제 Supabase catalog와 `supabase_migrations.schema_migrations`

상세 실행 순서와 출처는 [`site/README.md`](./site/README.md)를 참고합니다.

기존 `notification_messaging_patch.sql`은 알림·쪽지 기능을 추가할 때 사용한 통합 패치 기록으로 보존합니다. 실제 운영 migration의 개별 버전 파일은 `site/migrations/`를 기준으로 합니다.

날짜 투표는 초기 개발 이력으로만 보존하며 현재 서비스 범위에서는 제거합니다. 기존 baseline/migration 기록은 재현성을 위해 유지하고, 최종 스키마 제거는 `20260916100000_remove_date_poll_feature.sql`을 기준으로 합니다.

## 2. 청파 같이 본 사이트 범위

현재 본 사이트의 핵심 DB 영역은 다음과 같습니다.

- 회원/승인: `profiles`, `join_requests`, `profile_interests`
- 활동: `activity_categories`, `category_managers`, `events`, `event_series`, `event_participants`
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
- 본 사이트 `SECURITY DEFINER` RPC의 내부 권한 검증 유지

## 6. 게임 영역 보호 규칙

청파 같이 본 사이트 정리 작업에서는 아래 영역을 수정하지 않습니다.

- `liar_*` 테이블/RPC/Realtime 구조
- `splendor_*` 테이블/RPC/Realtime 구조
- `supabase/liar-game/`
- 게임 전용 SQL 및 게임 전용 문서

공통 DB 변경이 게임에 영향을 줄 가능성이 있으면 변경 전에 영향도를 별도로 확인합니다.

## 7. 활동 장소 검색 Edge Function 설정

활동 장소와 지도 링크의 좌표 해석은 `resolve-map-link` Edge Function에서 NAVER API HUB 지역 검색을 사용합니다.

운영 환경에는 다음 두 값을 **Supabase Edge Function Secret**으로 등록합니다.

- `NAVER_API_HUB_CLIENT_ID`
- `NAVER_API_HUB_CLIENT_SECRET`

이 값들은 서버 전용 인증 정보이므로 `js/config.js`나 다른 브라우저 소스에 넣지 않습니다. Secret을 변경하면 Edge Function을 다시 배포하지 않아도 런타임에서 새 값이 사용됩니다.

지도 렌더링은 NAVER Cloud Maps Web Dynamic Map Client ID를 계속 사용하며, 카카오 JavaScript 키는 카카오톡 활동 공유 기능에서만 사용합니다.

## 8. 공통 메일 발송 시스템

메일은 **인증 메일**과 **서비스 메일**을 구분합니다.

### 8.1 인증 메일

회원가입 이메일 OTP, 비밀번호 재설정 등 인증 수명주기에 속한 메일은 Supabase Auth가 담당합니다.

- 회원가입 인증번호: `supabase.auth.signInWithOtp()` / `verifyOtp()`
- 비밀번호 재설정: Supabase Auth recovery 흐름
- 발송 SMTP 설정: Supabase Auth의 Custom SMTP에서 Google 계정과 앱 비밀번호를 관리

서비스 메일 공통화 작업은 `Authentication > Emails > SMTP Settings`의 기존 Auth SMTP 설정을 대체하거나 수정하지 않습니다. 서비스 Edge Function에서도 인증번호를 직접 생성하거나 별도의 challenge 테이블을 만들지 않습니다.

### 8.2 서비스 메일

가입 신청 관리자 알림처럼 애플리케이션 업무에서 발생하는 메일은 다음 계층으로 분리합니다.

- 공통 진입점/수신자 조회: `supabase/functions/_shared/email.ts`
- Google SMTP 전송 계층: `supabase/functions/_shared/email-transport.ts`
- 업무별 템플릿: `supabase/functions/_shared/email-templates.ts`
- 공통 HTML 레이아웃: `supabase/functions/_shared/email-layout.ts`

업무별 Edge Function은 `sendEmail()` 또는 `sendUserEmail()`만 호출합니다. 업무 코드에서 SMTP host, Google 계정, 앱 비밀번호, Nodemailer를 직접 참조하지 않습니다. 따라서 향후 서비스 메일 종류가 늘어나도 업무 로직과 전송 공급자 세부 구현은 분리된 상태를 유지합니다.

현재 서비스 메일 transport는 **Google Gmail SMTP + Google 앱 비밀번호**로 고정합니다.

- SMTP host: `smtp.gmail.com`
- SMTP port: `465`
- TLS: implicit TLS (`secure: true`)
- SMTP client: `nodemailer@9.1.1`

Supabase hosted Edge Function은 outbound `587` 포트를 사용할 수 없으므로 서비스 메일 SMTP는 `465`를 사용합니다.

운영 Supabase 프로젝트에는 다음 값을 **Edge Function Secret**으로 한 번만 등록하고 모든 서비스 메일에서 공통 사용합니다.

- `SMTP_USERNAME`: 발송에 사용하는 Google 계정 이메일
- `SMTP_PASSWORD`: 해당 Google 계정에서 발급한 앱 비밀번호
- `SMTP_FROM`: 메일의 From 값. 예: `청파 같이 <example@gmail.com>`
- `APP_SITE_URL`: 선택값. 메일에서 사이트 링크를 생성할 때 사용하며 미설정 시 `https://limbit95.github.io/`를 사용합니다.

`SMTP_PASSWORD`에는 Google 계정의 일반 로그인 비밀번호를 사용하지 않습니다. Google 계정에 2단계 인증을 활성화한 뒤 발급한 앱 비밀번호만 사용합니다.

Supabase Auth의 Custom SMTP 설정과 Edge Function Secret은 보안상 서로 별도 저장소입니다. 같은 Google SMTP 계정과 앱 비밀번호를 사용하더라도 서비스 메일용 Edge Function Secret은 별도로 등록해야 하며, 서비스 메일 코드가 Auth SMTP 비밀번호를 조회하거나 덮어쓰지 않습니다.

### 8.3 새 서비스 메일 추가 규칙

새 프로세스에서 메일을 추가할 때는 다음 순서를 지킵니다.

1. `email-templates.ts`에 템플릿 ID와 입력 데이터 타입, 제목/본문/CTA를 추가합니다.
2. 브랜드 헤더, 본문 여백, 버튼, 푸터처럼 모든 메일에 공통인 UI는 `email-layout.ts`에서만 관리합니다.
3. 업무 템플릿은 공통 레이아웃을 호출하고 사용자/업무 데이터는 HTML escape를 거쳐 렌더링합니다.
4. 업무 Edge Function은 `email.ts`의 `sendEmail()` 또는 Auth 사용자를 대상으로 하는 `sendUserEmail()`만 호출합니다.
5. Google SMTP host/port/TLS/Nodemailer/앱 비밀번호 처리는 `email-transport.ts` 안에서만 관리합니다.
6. 호출부는 업무 이벤트별로 안정적인 `idempotencyKey`를 전달합니다. SMTP 전송에서는 이 값을 고정 `Message-ID`와 `X-Cheongpa-Idempotency-Key`에 사용하여 재시도 시 동일 메시지를 식별할 수 있게 합니다. 이는 SMTP 서버 차원의 중복 전송 방지 보장을 의미하지는 않습니다.
7. SMTP 비밀번호, 수신자 주소, SMTP 응답 원문을 운영 로그에 그대로 남기지 않습니다.
8. 새로운 메일 프로세스를 추가할 때 기존 transport를 복사하거나 별도 SMTP 클라이언트를 만들지 않습니다.

현재 첫 서비스 메일 템플릿은 `join_request_received`이며, 동일한 공통 프레임 안에서 제목·안내 문구·버튼 목적지만 업무에 맞게 교체합니다.

### 8.4 서비스 메일 운영 진단

서비스 메일 전송 결과는 업무 Edge Function 응답의 `email` 객체로 확인합니다.

- `email.sent = 1`: Gmail SMTP 서버가 수신자를 accepted 처리한 상태
- `reason = "EMAIL_NOT_CONFIGURED"`: 필수 Secret이 누락된 상태이며 `missing` 배열에서 누락된 이름 확인
- `reason = "SMTP_NOT_ACCEPTED"`: SMTP 요청은 완료됐지만 수신자가 accepted 처리되지 않은 상태
- `reason = "SMTP_<오류 코드>"`: Nodemailer/SMTP 오류 코드가 확인된 상태. 예: 인증 실패, 연결 시간 초과 등
- `reason = "SMTP_DELIVERY_FAILED"`: SMTP 오류 코드 없이 전송 예외가 발생한 상태
- `reason = "RECIPIENT_EMAIL_MISSING"`: 대상 Auth 사용자에게 사용할 이메일 주소가 없음
- `reason = "EMAIL_DELIVERY_FAILED"`: Auth 수신자 조회 중 예외 발생

가입 신청 관리자 알림처럼 필수 서비스 메일이 실패하면 Web Push 성공 여부와 관계없이 Webhook 응답을 `502`로 기록해 메일 실패가 정상 `200`으로 숨지 않도록 합니다. 가입 신청 알림은 `supabase_functions.hooks`와 `net._http_response`에서 Webhook HTTP 결과를 확인할 수 있으며, 운영 로그에는 SMTP 비밀번호, 수신자 이메일 주소, SMTP 응답 원문을 남기지 않습니다.

Secret은 Supabase Dashboard의 Edge Functions Secrets 또는 Supabase CLI의 `supabase secrets set`으로 관리하고 소스 코드나 브라우저 설정에는 저장하지 않습니다.

### 8.5 레거시 회원가입 메일 제거

초기 다단계 회원가입 구현에서 사용했던 `signup-verification` Edge Function과 `signup_email_challenges` 기반 자체 OTP 방식은 현재 Native Supabase Auth OTP 경로에서 사용하지 않습니다.

DB의 미사용 challenge 테이블 및 RPC는 `20260914024000_remove_legacy_signup_email_verification.sql`에서 제거합니다. 운영 반영 시에는 더 이상 호출되지 않는 배포본 `signup-verification` Edge Function도 함께 삭제하여 레거시 실행 경로를 남기지 않습니다.
