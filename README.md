# 청파 같이

청년 공동체의 활동, 공지, 기도 제목, 프로필, 알림과 소통을 위한 모바일 우선 웹 애플리케이션입니다.

프론트엔드는 HTML/CSS/Vanilla JavaScript ES Modules로 구성되고 GitHub Pages에서 별도 빌드 없이 실행됩니다. 인증·데이터·권한·Storage·Realtime은 Supabase가 담당합니다.

> 이 README는 **청파 같이 본 사이트**를 설명합니다. Liar Game과 Splendor 등 게임 구현은 별도 영역으로 관리하며, 본 사이트 기반 정리 작업에서는 게임 전용 소스·문서·DB 객체를 수정하지 않습니다.

## 1. 현재 주요 기능

### 회원/권한

- 이메일 회원가입 및 로그인
- 가입 신청 후 관리자 승인
- 승인 대기/거절/정지 상태별 접근 제어
- 일반 회원 / 관리자 / 활동 카테고리 담당자 권한
- 프로필 이미지, 표시 이름, 나이 공개 범위, 소개, 관심 활동 관리

### 활동

- 활동 목록/검색/카테고리 필터
- 월간 달력
- 날짜 후보 투표
- 활동 상세
- 참여/대기 신청 및 취소
- 정원 초과 시 대기 등록
- 참여 취소 시 대기자 자동 승급
- 반복 활동 등록
- 활동 등록/수정/취소
- 참여자 프로필 조회 및 쪽지 보내기
- 새 활동 알림
- 참여 활동 시작 약 24시간 전 알림

### 공지사항

- 관리자 작성/수정/삭제
- 중요/고정 공지
- 검색 및 페이지 이동

### 기도 제목

- 승인 회원 작성/수정/삭제
- 함께 기도하기 반응
- 응원 메시지 댓글
- 댓글 작성자 프로필 조회 및 쪽지 보내기

### 쪽지/알림

- 다른 회원 프로필에서 1:1 쪽지 보내기
- 수신자 알림 생성
- Supabase Realtime을 통한 새 알림 배지 갱신
- 최근 알림 / 지난 알림 구분
- 새 활동 알림은 일정 기간 후 지난 알림으로 이동
- 쪽지 읽기

### 관리자

- 가입 신청 승인/보류/거절
- 회원 상태 관리
- 관리자 권한 관리
- 활동 카테고리 담당자 관리
- 활동 카테고리 관리

## 2. 기술 구성

```text
GitHub Pages
  └─ HTML + CSS + Vanilla JS ES Modules
           │
           ├─ Hash Router
           ├─ Persistent App Shell
           ├─ Auth state / Route Guard
           ├─ UI Components
           └─ Domain Pages
                    │
                    ▼
                Supabase
           ├─ Authentication
           ├─ PostgreSQL
           ├─ RLS / RPC
           ├─ Storage
           ├─ Realtime
           └─ pg_cron
```

npm 설치나 프론트 빌드 과정은 없습니다.

## 3. 주요 파일 구조

```text
.
├── index.html
├── README.md
├── AUDIT_REPORT.md                # 과거 감사 기록
├── assets/
├── css/
│   ├── reset.css
│   ├── variables.css
│   ├── layout.css
│   ├── components.css
│   ├── pages.css
│   ├── profile.css
│   ├── modal.css
│   ├── messaging.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── router.js
│   ├── auth.js
│   ├── api.js
│   ├── notifications.js
│   ├── ui.js
│   ├── validators.js
│   ├── constants.js
│   ├── supabaseClient.js
│   ├── components/
│   │   ├── header.js
│   │   ├── bottomNav.js
│   │   ├── activityCard.js
│   │   ├── profilePopover.js
│   │   ├── modal.js
│   │   ├── toast.js
│   │   └── loading.js
│   └── pages/
│       ├── login.js
│       ├── signup.js
│       ├── pending.js
│       ├── home.js
│       ├── activities.js
│       ├── activityDetail.js
│       ├── activityForm.js
│       ├── board.js
│       ├── postDetail.js
│       ├── postForm.js
│       ├── games.js
│       ├── mypage.js
│       └── admin.js
├── docs/
│   └── site-foundation-audit.md
└── supabase/
    ├── README.md
    ├── notification_messaging_patch.sql
    └── site/
        ├── README.md
        ├── baseline/
        ├── seed.sql
        └── migrations/
```

게임 디렉터리와 게임 전용 Supabase 파일은 별도 관리 대상이므로 위 본 사이트 구조 설명에서 상세히 다루지 않습니다.

## 4. 주요 Hash Route

| 화면 | Route | 접근 |
|---|---|---|
| 로그인 | `#/login` | 비로그인 |
| 회원가입 | `#/signup` | 비로그인 |
| 승인 대기/거절 | `#/pending` | 로그인 |
| 이용 정지 안내 | `#/suspended` | 정지 회원 |
| 홈 | `#/` | 승인 회원 |
| 게임 허브 | `#/games` | 승인 회원 |
| 활동 | `#/activities` | 승인 회원 |
| 활동 상세 | `#/activities/:id` | 승인 회원 |
| 활동 등록 | `#/activities/new` | 관리자/담당자 |
| 활동 수정 | `#/activities/:id/edit` | 관리자/담당자 |
| 공지사항 | `#/notice` | 승인 회원 |
| 공지 작성 | `#/notice/new` | 관리자 |
| 기도 제목 | `#/prayer` | 승인 회원 |
| 기도 제목 작성 | `#/prayer/new` | 승인 회원 |
| 마이페이지 | `#/mypage` | 승인 회원 |
| 프로필 수정 | `#/mypage/edit` | 승인 회원 |
| 관리자 | `#/admin` | 관리자 |

활동 보기 방식은 query로 구분합니다.

- `#/activities?view=list`
- `#/activities?view=calendar`
- `#/activities?view=polls`

과거 `#/community...` 주소는 현재 기도 제목 `#/prayer...`로 리다이렉트합니다.

## 5. 로컬 실행

ES Module 보안 정책 때문에 `index.html`을 `file://`로 직접 열지 말고 정적 서버를 사용합니다.

```bash
python3 -m http.server 8080
```

브라우저에서 `http://localhost:8080`을 엽니다.

`js/config.js`에는 실제 Supabase Project URL과 브라우저 공개용 key가 필요합니다.

```js
export const SUPABASE_URL = "https://<project-ref>.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "<publishable-key>";
```

`service_role` 또는 secret key는 브라우저 코드와 공개 GitHub 저장소에 넣지 않습니다.

## 6. Supabase 운영

현재 운영 Supabase에는 본 사이트와 게임 영역의 DB 객체가 함께 존재합니다.

청파 같이 본 사이트의 초기 스키마와 seed는 `supabase/site/baseline/` 및 `supabase/site/seed.sql`에 보존하고, 이후 운영 변경은 `supabase/site/migrations/`에 실제 Supabase migration 버전과 이름을 맞춰 기록합니다.

DB 운영/변경 원칙은 [`supabase/README.md`](./supabase/README.md)와 [`supabase/site/README.md`](./supabase/site/README.md)를 따릅니다.

핵심 원칙:

1. 운영 catalog를 먼저 확인합니다.
2. 운영 DB와 저장소가 다르면 추측으로 덮어쓰지 않습니다.
3. 본 사이트 DDL 변경은 migration 이력으로 관리합니다.
4. 변경 전후 Security/Performance Advisor와 실제 SQL 검증을 수행합니다.
5. 게임 DB 객체는 본 사이트 정리 작업에서 수정하지 않습니다.

## 7. 보안 모델

- 로그인 상태만으로 권한을 신뢰하지 않고 RLS/RPC에서 다시 검증합니다.
- 승인된 회원만 일반 서비스 데이터에 접근하도록 제한합니다.
- 게시글/댓글의 일반 수정·삭제는 본인 소유권을 검사합니다.
- 활동 관리 권한은 관리자 또는 현재 활성 카테고리 담당자를 검사합니다.
- 알림은 자신의 row만 조회/수정합니다.
- 쪽지는 발신자 또는 수신자만 조회합니다.
- 프로필 이미지는 private Storage bucket의 signed URL로 표시합니다.

## 8. UI 구조

### App Shell

승인 회원용 화면에서는 Header와 BottomNav를 라우트마다 다시 만들지 않습니다. 인증/권한 identity가 유지되는 동안 공통 Shell을 재사용하고 `#main-content`의 내용만 교체합니다.

이 구조는 Header의 Realtime 알림 상태와 이벤트 리스너를 불필요하게 다시 만들지 않도록 합니다.

### 반응형

- 모바일: 하단 고정 주요 메뉴
- 데스크톱: 상단 내비게이션
- `360px`급 작은 화면도 기본 대응
- `prefers-reduced-motion` 대응

### CSS 역할

- `variables.css`: 토큰
- `layout.css`: 전체 Shell/레이아웃
- `components.css`: 공통 컴포넌트
- `pages.css`: 페이지 전용 스타일
- `profile.css`: 프로필 UI
- `modal.css`: 모달
- `messaging.css`: 쪽지/알림
- `responsive.css`: 공통 반응형 보정

과거의 `theme.css` override 계층은 제거하고 현재 시각 결과를 각 담당 파일에 통합했습니다.

### 접근성

- 본문 바로가기
- `aria-current`, `aria-live`, dialog role 사용
- 공통 모달 Escape 닫기
- 공통 모달 Tab focus trap
- 모달 종료 후 이전 포커스 복귀

## 9. 현재 기반 정리 상태

2026-08-25 기준 전체 구조 재검토 내용은 [`docs/site-foundation-audit.md`](./docs/site-foundation-audit.md)에 기록합니다.

완료된 기반 작업:

1. 본 사이트 DB baseline/seed 복원
2. 운영 migration 이력 복원
3. 날짜투표 FK covering index 보완 및 Advisor 재검증
4. README/DB 운영 문서 최신화
5. 공통 모달 접근성/스타일 정리
6. 모바일 쪽지 액션 회귀 수정
7. CSS override 계층 제거 및 역할별 파일 정리
8. 승인 회원용 Persistent App Shell 적용

다음 구조 개선 우선순위:

1. `api.js` 도메인 단위 분리
2. `activities.js`, `admin.js` 등 대형 페이지 모듈 분리
3. 공개 프로필 조회 범위 최적화
4. 자동 smoke test/JS syntax check 도입
5. 의미 기반 디자인 토큰 명칭 정리

## 10. 개발/병합 원칙

큰 구조 변경은 `main`에 직접 작업하지 않고 별도 브랜치에서 진행합니다.

작업 후 변경 내용을 먼저 검토하고 승인된 경우에만 `main`에 반영합니다.

청파 같이 본 사이트 정리 중에는 게임 활동 관련 소스를 건드리지 않습니다.
