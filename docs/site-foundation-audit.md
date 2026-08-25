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
- 본 사이트용 Supabase 운영 원칙

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

### 구조적으로 정리할 부분

1. README와 과거 감사 문서가 현재 코드/DB 구조보다 뒤처짐
2. 운영 Supabase 전체 schema를 GitHub만으로 재현할 수 없는 상태
3. `api.js`, `activities.js`, `admin.js`에 역할이 계속 누적되고 있음
4. 기본 CSS 위에 `theme.css`, `profile.css`, `messaging.css`가 추가되며 override 추적 비용이 커짐
5. 일부 모달 스타일이 JavaScript 인라인 스타일로 들어가 있어 재사용성이 떨어짐
6. SPA 라우팅 때 Header/BottomNav까지 재생성되어 향후 Realtime UI가 커질수록 상태 관리가 복잡해질 수 있음
7. 공개 프로필 부착 시 전체 공개 회원을 내려받아 브라우저에서 매칭하는 패턴이 있어 회원 규모가 커지면 비효율 가능

## 3. 이번 1차 작업에서 즉시 정리한 항목

### 공통 모달

- 활동 참여 모달의 인라인 스타일을 `css/modal.css`로 분리
- `confirmDialog`와 `contentDialog`에 동일한 Escape 처리 적용
- `contentDialog`에도 Tab focus trap 적용
- 모달이 닫힐 때 이전 포커스로 복귀하는 기존 동작 유지

### 쪽지 모바일 회귀

기존 `messaging.css`에는 639px 이하에서 쪽지 작성 하단 액션을 다시 세로로 배치하는 규칙이 남아 있었습니다.

사용자가 요청한 `취소 / 쪽지 보내기` 한 줄 배치가 모바일에서도 유지되도록 수정했습니다.

### Supabase 운영 문서

`supabase/README.md`를 새로 두고 다음 원칙을 명시했습니다.

- 현재 운영 DB와 GitHub 이력이 완전히 일치하지 않는 전환 상태임을 명시
- 운영 DB를 추측으로 덮어쓰지 않음
- 향후 본 사이트 DDL은 migration 이력으로 관리
- Advisor 확인 후 변경
- 게임 DB 객체는 사이트 기반 정리 범위에서 제외

## 4. 운영 Supabase 점검 결과

실제 운영 프로젝트의 본 사이트 테이블은 RLS가 활성화되어 있습니다.

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

### 보안 후속 검토

운영 DB는 이번 브랜치 작업에서 변경하지 않았습니다.

Advisor 기준으로 본 사이트와 관련해 이후 별도 검토할 항목:

- `set_updated_at`의 `search_path`
- `public.is_admin()`의 anonymous execute 필요 여부
- `public.rls_auto_enable()`의 anonymous execute 필요 여부
- Leaked Password Protection 활성화

`authenticated`가 호출해야 하는 `join_event`, `send_direct_message` 같은 SECURITY DEFINER RPC는 경고를 이유로 일괄 revoke하지 않고 함수별 검증이 필요합니다.

### 성능 후속 검토

현재 데이터 규모에서는 즉시 병목은 아니지만 다음 항목을 추적합니다.

- 날짜 투표 일부 FK covering index
- 전체 공개 프로필 조회 후 브라우저 매칭 패턴
- 관리자 화면의 전체 회원/일정 일괄 조회
- 알림 목록의 장기 누적 시 pagination/보관 정책

## 5. 다음 단계 후보

1차 브랜치 검토가 끝난 뒤 다음 순서가 안전합니다.

1. 본 사이트용 DB baseline/migration 정식 확보
2. Security Advisor의 본 사이트 항목만 개별 수정
3. CSS 역할 분류와 override 정리
4. `api.js`를 domain 단위로 분리
5. App Shell을 지속시키고 Main만 교체하는 SPA 구조 검토
6. 자동 smoke test/JS syntax check 도입

## 6. 반영 규칙

이 브랜치는 사용자 검토 전에는 `main`에 병합하지 않습니다.

변경 내용을 보고한 뒤 사용자가 반영을 승인하면 그때 `main` 병합을 진행합니다.
