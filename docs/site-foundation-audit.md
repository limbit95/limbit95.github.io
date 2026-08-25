# 청파 같이 1차 기반 정리 보고서

기준일: 2026-08-25  
기준 브랜치: `main`에서 분기한 `feature/site-foundation-cleanup`

## 1. 범위

이번 정리는 청파 같이 본 사이트의 유지보수 기반을 다지는 작업입니다.

포함:

- 홈
- 활동/참여/날짜 투표
- 공지사항
- 기도 제목/댓글
- 프로필
- 쪽지/알림
- 관리자
- 공통 UI/모달/CSS
- 본 사이트용 Supabase baseline/migration 이력

제외:

- Liar Game 구현 소스/문서/DB
- Splendor 구현 소스/문서/DB
- 기타 게임 전용 로직

게임 관련 파일과 DB 객체는 이번 작업에서 수정하지 않습니다.

## 2. 현재 구조 판정

### 잘 잡혀 있는 부분

- Hash Router로 GitHub Pages 하위 경로 배포에 대응
- 인증 상태와 승인/정지/관리자/담당자 권한을 라우팅 단계에서 구분
- 프론트 UI와 별도로 Supabase RLS/RPC에서 권한 재검증
- 활동 참여/대기/자동 승급을 RPC 중심으로 처리
- 알림과 쪽지를 Realtime로 연결
- 프로필 signed URL 캐시와 기본 이미지 fallback 적용
- 사용자 입력을 DOM `textContent` 기반으로 표시하여 XSS 위험을 낮춤
- 모바일 하단 내비게이션과 데스크톱 내비게이션을 분리

### 다음 단계에서 구조적으로 정리할 부분

1. `api.js`, `activities.js`, `admin.js`에 역할이 계속 누적되고 있음
2. 기본 CSS 위에 `theme.css`, `profile.css`, `messaging.css`가 추가되며 override 추적 비용이 커짐
3. SPA 라우팅 때 Header/BottomNav까지 재생성되어 향후 Realtime UI가 커질수록 상태 관리가 복잡해질 수 있음
4. 공개 프로필 부착 시 전체 공개 회원을 내려받아 브라우저에서 매칭하는 패턴이 있어 회원 규모가 커지면 비효율 가능

## 3. 이번 1차 작업에서 정리한 항목

### 공통 모달

- 활동 참여 모달의 인라인 스타일을 `css/modal.css`로 분리
- `confirmDialog`와 `contentDialog`에 동일한 Escape 처리 적용
- `contentDialog`에도 Tab focus trap 적용
- 모달이 닫힐 때 이전 포커스로 복귀하는 기존 동작 유지

### 쪽지 모바일 회귀

기존 `messaging.css`에는 639px 이하에서 쪽지 작성 하단 액션을 다시 세로로 배치하는 규칙이 남아 있었습니다.

`취소 / 쪽지 보내기` 한 줄 배치가 모바일에서도 유지되도록 수정했습니다.

### 문서 최신화

- README를 현재 라우트와 기능 기준으로 갱신
- 과거 `/community` 중심 설명을 현재 `/prayer` 구조에 맞게 정리
- 현재 쪽지/알림/프로필/CSS 구조를 반영
- Supabase 운영 규칙과 게임 영역 제외 원칙을 문서화

### DB baseline 및 migration 확보

전달받은 현재 원본 `schema.sql`과 `seed.sql`을 실제 운영 Supabase와 대조했습니다.

- 원본 `schema.sql`의 실행 SQL 2,139개 행을 섹션별 baseline 파일로 분리한 뒤 실행문 순서를 비교했으며 누락 없이 일치함을 확인
- `seed.sql`의 10개 활동 카테고리는 운영 DB의 이름/아이콘/색상/설명/활성 여부와 모두 일치
- Supabase migration history에 기록된 본 사이트 후속 migration 4개를 버전/이름 그대로 GitHub에 보존

현재 본 사이트 DB 이력은 다음으로 설명할 수 있습니다.

1. `supabase/site/baseline/00_setup.sql` ~ `12_avatar_storage.sql`
2. `supabase/site/seed.sql`
3. `20260825041209_expand_notifications_and_direct_messages`
4. `20260825041340_lock_down_notification_rpc_permissions`
5. `20260825041418_schedule_activity_reminder_notifications`
6. `20260825041451_index_notification_message_target`

## 4. 운영 Supabase 점검 결과

현재 본 사이트 핵심 테이블은 다음과 같습니다.

- `profiles`
- `join_requests`
- `profile_interests`
- `activity_categories`
- `category_managers`
- `events`
- `event_series`
- `event_participants`
- `date_polls`
- `date_poll_options`
- `date_poll_votes`
- `posts`
- `comments`
- `notifications`
- `direct_messages`

본 사이트 테이블의 RLS가 활성화되어 있음을 확인했습니다.

### 같은 프로젝트의 별도/레거시 객체

초기 Advisor 점검에서는 `public.is_admin()`, `public.rls_auto_enable()`, `public.set_updated_at()` 등이 청파 같이 보안 이슈 후보처럼 보였습니다.

함수 정의를 추가 확인한 결과 청파 같이 본 사이트는 `profiles` 기반의 `private.is_admin()`, `private.set_updated_at()`을 사용하고 있으며, 일부 `public` 함수는 `admin_users`, `site_settings`, `mission_posts` 등 다른 영역을 참조합니다.

따라서 이 함수들을 이번 청파 같이 기반 정리에서 임의로 수정하거나 삭제하지 않습니다. 같은 Supabase 프로젝트에 존재하더라도 본 사이트 source of truth와 별도로 취급합니다.

### 계속 추적할 보안/성능 항목

- Supabase Auth의 Leaked Password Protection 설정
- 날짜 투표 일부 FK covering index 필요성
- `join_event`, `send_direct_message` 등 본 사이트 SECURITY DEFINER RPC의 내부 권한 검증 유지
- 전체 공개 프로필 조회 후 브라우저 매칭 패턴
- 관리자 화면의 전체 회원/일정 일괄 조회
- 알림 목록 장기 누적 시 pagination/보관 정책

## 5. 다음 단계 후보

DB 이력 확보까지 끝난 뒤 다음 순서가 안전합니다.

1. 본 사이트 Security/Performance Advisor 항목만 다시 범위를 좁혀 검토
2. 필요한 DB 보안/인덱스 변경이 있다면 신규 migration으로 작성
3. CSS 역할 분류와 override 정리
4. `api.js`를 domain 단위로 분리
5. App Shell을 지속시키고 Main만 교체하는 SPA 구조 검토
6. 자동 smoke test/JS syntax check 도입

## 6. 반영 규칙

이 브랜치는 사용자 검토 전에는 `main`에 병합하지 않습니다.

변경 내용을 보고한 뒤 사용자가 반영을 승인하면 그때 `main` 병합을 진행합니다.
