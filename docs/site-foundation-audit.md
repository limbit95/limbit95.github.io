# 청파 같이 기반/구조 정리 보고서

기준일: 2026-08-25  
기준 브랜치: `main`에서 분기한 `feature/site-foundation-cleanup`

## 1. 범위

이번 정리는 청파 같이 본 사이트의 유지보수 기반과 공통 구조를 정돈하는 작업입니다.

포함:

- 홈
- 활동/참여/날짜 투표
- 공지사항
- 기도 제목/댓글
- 프로필
- 쪽지/알림
- 관리자
- 공통 UI/모달/CSS
- 공통 App Shell/라우팅 구조
- 본 사이트용 Supabase baseline/migration 이력
- 본 사이트용 정적 자동 검수

제외:

- Liar Game 구현 소스/문서/DB
- Splendor 구현 소스/문서/DB
- 기타 게임 전용 로직

게임 관련 파일과 DB 객체는 이번 작업에서 수정하지 않습니다.

## 2. 현재 구조 판정

### 잘 잡혀 있는 부분

- Hash Router로 GitHub Pages 하위 경로 배포에 대응
- 인증 상태와 승인/정지/관리자/담당자 권한을 라우팅 단계에서 구분
- 승인 회원 화면에서 Persistent App Shell을 유지하고 Main 콘텐츠만 교체
- 프론트 UI와 별도로 Supabase RLS/RPC에서 권한 재검증
- 활동 참여/대기/자동 승급을 RPC 중심으로 처리
- 알림과 쪽지를 Realtime로 연결
- 프로필 signed URL 캐시와 기본 이미지 fallback 적용
- 사용자 입력을 DOM `textContent` 기반으로 표시하여 XSS 위험을 낮춤
- 모바일 하단 내비게이션과 데스크톱 내비게이션을 분리
- CSS 역할을 공통/페이지/프로필/모달/메시징/반응형으로 분리
- GitHub Actions에서 본 사이트 JS/파일 참조/CSS 기본 구조를 자동 검수

### 다음 단계에서 구조적으로 정리할 부분

1. `api.js`, `activities.js`, `admin.js`에 역할이 계속 누적되고 있음
2. 공개 프로필 부착 시 전체 공개 회원을 내려받아 브라우저에서 매칭하는 패턴이 있어 회원 규모가 커지면 비효율 가능
3. 현재 팔레트는 안정적이지만 `forest`, `coral` 등 과거 색상명을 유지하고 있어 의미 기반 디자인 토큰 명칭 정리가 필요함

## 3. 이번 작업에서 정리한 항목

### 공통 모달

- 활동 참여 모달의 인라인 스타일을 `css/modal.css`로 분리
- `confirmDialog`와 `contentDialog`에 동일한 Escape 처리 적용
- `contentDialog`에도 Tab focus trap 적용
- 모달이 닫힐 때 이전 포커스로 복귀하는 기존 동작 유지
- 모달 기본 규칙도 `components.css`에서 `modal.css`로 이동하여 소유 파일을 일원화

### 쪽지/알림 CSS

- 모바일에서 `취소 / 쪽지 보내기` 액션이 한 줄로 유지되도록 회귀 수정
- 알림 패널/배지/알림 항목 기본 스타일을 `messaging.css`로 모아 공통 컴포넌트 CSS와 분리
- 프로필 팝오버 메뉴 표시 규칙은 `profile.css`로 이동

### CSS override 정리

기존 `theme.css`는 버튼, 카드, 폼, 모달, 알림, 페이지 UI를 뒤에서 다시 덮어쓰는 override 계층이었습니다.

현재 화면의 최종 시각 결과는 유지하면서 각 규칙을 실제 담당 파일로 통합했습니다.

- 공통 컴포넌트 → `components.css`
- 페이지 전용 → `pages.css`
- 모달 → `modal.css`
- 쪽지/알림 → `messaging.css`
- 반응형 → `responsive.css`

그 결과 `theme.css`는 제거했습니다.

또한 활동 카드에서 이미 제거된 참여 게이지의 `.participant-meter`, `.meter` 스타일과 단일 액션 구조에서 불필요해진 반응형 footer grid 규칙을 제거했습니다.

### Persistent App Shell

기존 `renderPage()`는 라우트 진입 시 로딩 화면과 실제 화면을 렌더링할 때마다 Header/Main/BottomNav 전체를 다시 생성했습니다.

현재는 승인 회원의 인증/권한 identity가 동일한 동안 Header와 BottomNav를 유지하고 `#main-content`만 교체합니다.

- 라우트가 바뀌면 기존 nav 링크의 `aria-current`만 갱신
- 관리자 여부 등 Shell 구성이 달라지는 auth identity 변경 시에만 Shell 재생성
- 로그인/회원가입/승인대기/정지 화면은 기존처럼 독립 레이아웃 유지
- Realtime 알림 헤더와 이벤트 리스너의 불필요한 재생성을 줄임

게임 허브 라우트 정의와 게임 구현 파일은 변경하지 않았습니다.

### 정적 자동 검수

`Site static checks` GitHub Actions를 추가했습니다.

- `node --check`로 본 사이트 JavaScript 문법 확인
- 상대 import 대상 파일 존재 여부 확인
- `index.html`의 로컬 CSS/JS/이미지 참조 확인
- CSS 중괄호 기본 구조 확인
- 제거된 `theme.css` 참조 재발 방지

게임 구현 소스는 검사 대상에서도 제외했습니다.

추가 직후 실제 Actions 실행 결과가 성공임을 확인했습니다.

### 문서 최신화

- README를 현재 라우트와 기능 기준으로 갱신
- 과거 `/community` 중심 설명을 현재 `/prayer` 구조에 맞게 정리
- 현재 쪽지/알림/프로필/CSS/App Shell/자동 검수 구조를 반영
- Supabase 운영 규칙과 게임 영역 제외 원칙을 문서화

### DB baseline 및 migration 확보

전달받은 현재 원본 `schema.sql`과 `seed.sql`을 실제 운영 Supabase와 대조했습니다.

- 원본 `schema.sql`의 실행 SQL 2,139개 행을 섹션별 baseline 파일로 분리한 뒤 실행문 순서를 비교했으며 누락 없이 일치함을 확인
- `seed.sql`의 10개 활동 카테고리는 운영 DB의 이름/아이콘/색상/설명/활성 여부와 모두 일치
- Supabase migration history에 기록된 본 사이트 후속 migration을 버전/이름 그대로 GitHub에 보존

현재 본 사이트 DB 이력은 다음으로 설명할 수 있습니다.

1. `supabase/site/baseline/00_setup.sql` ~ `12_avatar_storage.sql`
2. `supabase/site/seed.sql`
3. `20260825041209_expand_notifications_and_direct_messages`
4. `20260825041340_lock_down_notification_rpc_permissions`
5. `20260825041418_schedule_activity_reminder_notifications`
6. `20260825041451_index_notification_message_target`
7. `20260825090540_add_date_poll_fk_covering_indexes`

### 날짜투표 FK 인덱스 보완

Performance Advisor가 본 사이트 날짜투표 영역에서 지적한 두 foreign key에 covering index를 추가했습니다.

- `date_poll_votes(option_id, poll_id)`
- `date_polls(selected_option_id, id)`

운영 반영 후 Advisor를 다시 실행하여 해당 `unindexed_foreign_keys` 경고가 사라졌음을 확인했습니다.

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
- `join_event`, `send_direct_message` 등 본 사이트 SECURITY DEFINER RPC의 내부 권한 검증 유지
- 전체 공개 프로필 조회 후 브라우저 매칭 패턴
- 관리자 화면의 전체 회원/일정 일괄 조회
- 알림 목록 장기 누적 시 pagination/보관 정책

Advisor의 `unused_index`는 현재 데이터가 적거나 신규 인덱스가 아직 사용되지 않았다는 정보이므로, 경고만 보고 즉시 삭제하지 않습니다.

## 5. 다음 단계 후보

현재 기반 및 공통 구조 정리 이후의 우선순위는 다음과 같습니다.

1. `api.js`를 profile/activity/board/admin/notification 등 domain 단위로 분리
2. `activities.js`, `admin.js` 등 대형 페이지의 기능별 submodule 분리
3. 공개 프로필 조회를 필요한 사용자 ID 집합 기준으로 최적화
4. 의미 기반 디자인 토큰 명칭 정리
5. 쪽지 inbox/reply, 알림 preference 등 기능 확장

## 6. 반영 규칙

이 브랜치는 사용자 검토 전에는 `main`에 병합하지 않습니다.

변경 내용을 보고한 뒤 사용자가 반영을 승인하면 그때 `main` 병합을 진행합니다.
