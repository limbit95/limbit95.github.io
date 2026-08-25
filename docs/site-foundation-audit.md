# 청파 같이 기반/구조 정리 보고서

기준일: 2026-08-25  
기준 브랜치: `main`에서 분기한 `feature/site-foundation-cleanup`

## 1. 범위

이번 정리는 청파 같이 본 사이트의 유지보수 기반, DB 이력, 공통 UI와 프론트 구조를 정돈하는 작업입니다.

포함:

- 홈
- 활동/참여/날짜 투표
- 공지사항
- 기도 제목/댓글
- 프로필
- 쪽지/알림
- 관리자
- 공통 UI/모달/CSS/내비게이션
- Persistent App Shell/라우팅 구조
- 도메인 API/대형 페이지 모듈 구조
- 본 사이트용 Supabase baseline/migration 이력
- 본 사이트용 정적 자동 검수

제외:

- Liar Game 구현 소스/문서/DB
- Splendor 구현 소스/문서/DB
- 기타 게임 전용 로직

게임 관련 파일과 DB 객체는 이번 작업에서 수정하지 않습니다.

## 2. 현재 구조 판정

현재 본 사이트는 다음 기반 정리가 완료된 상태입니다.

- Hash Router + 승인/정지/관리자/담당자 Route Guard
- 승인 회원 화면의 Persistent App Shell
- Supabase RLS/RPC 기반 서버 권한 재검증
- 활동 참여/대기/자동 승급 RPC
- Realtime 알림/쪽지
- private Storage signed URL 기반 프로필 이미지
- 역할별 CSS 파일 구조
- 도메인별 API 모듈 구조
- 활동/관리자 대형 페이지의 하위 모듈 구조
- 필요한 사용자 ID만 조회하는 공개 프로필 RPC
- GitHub Actions 기반 구조/문법 회귀 검사

현재 남은 구조 이슈는 긴급도가 낮습니다.

1. `variables.css`의 `forest`, `coral` 등 과거 색상명은 현재 하늘색 팔레트와 의미가 맞지 않음
2. 관리자 대시보드의 전체 회원/일정 조회는 데이터 규모 증가 시 pagination/집계 RPC 검토 필요
3. 알림 데이터 장기 누적 시 pagination/보관 정책 필요
4. 정적 검사를 넘어 실제 브라우저 상호작용 smoke/e2e 테스트는 아직 없음

## 3. 완료한 프론트 기반 작업

### 공통 모달

- 활동 참여 모달 인라인 스타일을 `css/modal.css`로 분리
- `confirmDialog`, `contentDialog`의 Escape 닫기 동작 통일
- `contentDialog` Tab focus trap 추가
- 모달 종료 후 이전 포커스 복귀 유지
- 모달 기본 규칙을 `modal.css`로 일원화

### 쪽지/알림/모바일

- 모바일에서 `취소 / 쪽지 보내기`가 한 줄을 유지하도록 수정
- 알림 패널/배지/알림 항목을 `messaging.css`로 정리
- 관리자 계정도 모바일 하단에서 `내 정보` 접근 유지
- 관리자 전용 화면은 모바일 헤더에 관리 바로가기를 추가하고 데스크톱에서는 기존 관리자 메뉴 사용

### CSS 구조

과거 `theme.css`가 뒤에서 여러 파일을 다시 덮어쓰던 구조를 제거했습니다.

현재 시각 결과는 유지하면서 담당 영역으로 규칙을 이동했습니다.

- `layout.css`: Shell/레이아웃
- `navigation.css`: 내비게이션 보정
- `components.css`: 공통 컴포넌트
- `pages.css`: 페이지 전용 UI
- `activity-card.css`: 활동 카드 탐색/접근성 레이어
- `profile.css`: 프로필
- `modal.css`: 모달
- `messaging.css`: 쪽지/알림
- `responsive.css`: 공통 반응형

이미 제거된 참여 게이지 관련 dead CSS도 제거했습니다.

### Persistent App Shell

기존 `renderPage()`는 라우트마다 Header/Main/BottomNav를 다시 만들었습니다.

현재는 승인 회원의 인증/권한 identity가 동일한 동안 Header와 BottomNav를 유지하고 `#main-content`만 교체합니다.

- 라우트 이동 시 `aria-current`만 갱신
- 관리자 여부 등 Shell identity 변경 시에만 Shell 재생성
- 로그인/회원가입/승인대기/정지 화면은 standalone 유지
- Realtime 알림 헤더와 이벤트 리스너의 불필요한 재생성을 줄임

### API 모듈 분리

기존 약 600줄의 `js/api.js` 구현을 도메인별로 분리했습니다.

```text
js/api.js              # 호환용 re-export facade
js/api/
├── shared.js
├── profiles.js
├── activities.js
├── boards.js
├── admin.js
├── polls.js
└── notifications.js
```

기존 페이지들은 계속 `../api.js`에서 동일 함수명을 import할 수 있어 한 번에 호출부를 모두 바꾸지 않아도 됩니다.

### 활동 페이지 분리

기존 `activities.js`에서 다음 UI를 분리했습니다.

- `activities/listView.js`
- `activities/calendarView.js`
- `activities/pollView.js`

`activities.js`는 route/query, 필터와 화면 조립만 담당합니다.

### 관리자 페이지 분리

기존 `admin.js`에서 다음 섹션을 분리했습니다.

- `admin/dashboard.js`
- `admin/approvals.js`
- `admin/members.js`
- `admin/managers.js`
- `admin/categories.js`

`admin.js`는 관리자 공통 헤더와 섹션 선택만 담당합니다.

### 활동 카드 접근성

기존에는 `<article>` 전체에 JS click listener를 붙여 `window.location.hash`를 변경했습니다.

현재는 제목의 실제 `<a>`가 stretched-link 방식으로 카드 탐색을 담당합니다.

- 카드 빈 영역 클릭 UX 유지
- 키보드 사용자는 실제 링크에 포커스 가능
- 참여/취소/상세 버튼은 독립 상호작용 요소로 유지
- JS 강제 hash mutation 제거

## 4. 자동 검수

`Site static checks` GitHub Actions를 추가하고 이후 구조 리팩터링에 맞춰 강화했습니다.

현재 검사 범위:

- 본 사이트 JavaScript `node --check`
- 상대 import 대상 존재 확인
- `index.html`의 로컬 파일 참조 확인
- CSS 중괄호 기본 구조
- 제거된 `theme.css` 참조 재발 방지
- API 도메인 모듈/facade 구조 유지 확인
- 활동 목록/달력/투표 모듈 연결 확인
- 관리자 5개 섹션 모듈 연결 확인
- 핵심 Route 존재 확인
- 활동 카드가 JS 강제 hash 이동 방식으로 회귀하지 않는지 확인

게임 구현 소스는 본 사이트 검사에서도 제외합니다.

## 5. DB baseline / migration

전달받은 현재 원본 `schema.sql`과 `seed.sql`을 실제 운영 Supabase와 대조했습니다.

- 원본 `schema.sql` 실행 SQL 2,139개 행과 분리 baseline의 순서/내용 일치 확인
- `seed.sql`의 10개 활동 카테고리가 운영 DB와 일치
- 실제 Supabase migration history의 본 사이트 migration을 GitHub에 동일 버전/이름으로 보존

현재 본 사이트 DB 이력:

1. `supabase/site/baseline/00_setup.sql` ~ `12_avatar_storage.sql`
2. `supabase/site/seed.sql`
3. `20260825041209_expand_notifications_and_direct_messages`
4. `20260825041340_lock_down_notification_rpc_permissions`
5. `20260825041418_schedule_activity_reminder_notifications`
6. `20260825041451_index_notification_message_target`
7. `20260825090540_add_date_poll_fk_covering_indexes`
8. `20260825103805_add_public_member_profiles_by_ids`

### 날짜투표 FK 인덱스

Performance Advisor가 지적한 다음 FK에 covering index를 추가했습니다.

- `date_poll_votes(option_id, poll_id)`
- `date_polls(selected_option_id, id)`

운영 적용 후 해당 `unindexed_foreign_keys` 경고가 사라진 것을 확인했습니다.

### 공개 프로필 범위 최적화

기존 `attachPublicProfiles()`는 글/댓글 작성자가 몇 명뿐이어도 승인된 공개 프로필 전체를 조회할 수 있었습니다.

새 RPC `get_public_member_profiles_by_ids(uuid[])`를 추가해 다음 경로는 필요한 사용자 ID 집합만 조회합니다.

- 게시글 작성자
- 댓글 작성자
- 활동 참여자
- 카테고리 담당자

보안 조건:

- `private.is_approved_member()` 검사
- `SECURITY DEFINER`
- 고정 `search_path = ''`
- `anon` 실행 불가
- `authenticated`, `service_role` 실행 가능

실제 운영 함수 권한을 쿼리하여 위 조건을 확인했습니다. Security Advisor의 authenticated SECURITY DEFINER 경고는 승인 회원이 의도적으로 호출하는 RPC 특성상 예상되는 항목입니다.

## 6. 운영 Supabase 경계

본 사이트 핵심 테이블:

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

본 사이트 핵심 테이블은 RLS 활성화를 확인했습니다.

같은 Supabase 프로젝트에 존재하지만 이번 본 사이트 source of truth와 별도인 객체:

- `public.is_admin()`
- `public.rls_auto_enable()`
- `public.set_updated_at()`
- `public.get_admin_storage_usage(...)`
- `public.get_admin_table_usage()`

일부는 `admin_users`, `site_settings`, `mission_posts` 등 현재 청파 같이의 `profiles` 기반 구조와 다른 영역을 참조합니다. 이번 정리에서 임의 수정/삭제하지 않습니다.

게임 `liar_*`, `splendor_*` 객체 역시 수정하지 않습니다.

## 7. 남은 항목

기반 리팩터링은 사실상 마무리 단계입니다. 남은 것은 다음처럼 영향도가 낮거나 별도 기능 단계로 분리할 수 있는 항목입니다.

### 낮은 우선순위 기반 개선

- `--forest-*`, `--coral-*` 등을 의미 기반 디자인 토큰 이름으로 점진 전환
- 실제 브라우저 상호작용 smoke/e2e 테스트 도입 검토
- 관리자 대규모 데이터 조회 시 pagination/집계 최적화
- 알림 pagination/보관 정책
- Supabase Auth Leaked Password Protection 설정 검토

### 기능 확장 후보

- 쪽지함 / 보낸 쪽지 / 답장
- 알림 preference / 관심 활동 기반 알림
- 기도 제목의 함께 기도 수 / 응원 메시지 수 / 상태
- 관심사 기반 홈 개인화

## 8. 반영 규칙

이 브랜치는 사용자 검토 전에는 `main`에 병합하지 않습니다.

변경 내용을 보고한 뒤 사용자가 반영을 승인하면 그때 `main` 병합을 진행합니다.
