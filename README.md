# 청파 같이

청년 공동체의 문화생활과 야외 활동을 위한 모바일 우선 웹 애플리케이션입니다. 프론트엔드는 HTML5, CSS3, Vanilla JavaScript ES Modules만 사용하며 GitHub Pages에서 별도 빌드 없이 실행됩니다. 인증·데이터·권한은 Supabase Authentication, PostgreSQL, Storage, Row Level Security가 담당합니다.

## 1. 최종 파일 트리

```text
.
├── index.html
├── README.md
├── AUDIT_REPORT.md
├── .gitignore
├── .nojekyll
├── assets
│   └── images
│       ├── logo.svg
│       ├── default-avatar.svg
│       └── empty-activity.svg
├── css
│   ├── reset.css
│   ├── variables.css
│   ├── layout.css
│   ├── components.css
│   ├── pages.css
│   └── responsive.css
├── js
│   ├── app.js
│   ├── router.js
│   ├── auth.js
│   ├── api.js
│   ├── ui.js
│   ├── validators.js
│   ├── constants.js
│   ├── supabaseClient.js
│   ├── config.js
│   ├── config.example.js
│   ├── components
│   │   ├── header.js
│   │   ├── bottomNav.js
│   │   ├── activityCard.js
│   │   ├── modal.js
│   │   ├── toast.js
│   │   └── loading.js
│   └── pages
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
│       ├── mypage.js
│       └── admin.js
└── supabase
    ├── schema.sql
    ├── seed.sql
    ├── audit_patch.sql
    └── README.md
```

## 2. 구현 화면과 Hash Route

| 화면 | Hash Route | 접근 조건 |
|---|---|---|
| 로그인 | `#/login` | 비로그인 |
| 회원가입 | `#/signup` | 비로그인 |
| 가입 승인 대기·거절·보류 | `#/pending` | 로그인 |
| 이용 정지 안내 | `#/suspended` | 정지 회원 |
| 홈 | `#/` | 승인 회원 |
| 활동 목록·달력·날짜 투표 | `#/activities` | 승인 회원 |
| 활동 상세 | `#/activities/:id` | 승인 회원 |
| 활동 등록 | `#/activities/new` | 관리자·카테고리 담당자 |
| 활동 수정 | `#/activities/:id/edit` | 관리자·해당 카테고리 담당자 |
| 공지사항 목록·상세 | `#/notice`, `#/notice/:id` | 승인 회원 |
| 공지사항 작성·수정 | `#/notice/new`, `#/notice/:id/edit` | 관리자 |
| 자유게시판 목록·상세 | `#/community`, `#/community/:id` | 승인 회원 |
| 자유게시판 작성·수정 | `#/community/new`, `#/community/:id/edit` | 승인 회원 |
| 마이페이지·프로필 수정 | `#/mypage`, `#/mypage/edit` | 승인 회원 |
| 관리자 대시보드 | `#/admin` | 관리자 |
| 가입 신청 관리 | `#/admin/approvals` | 관리자 |
| 회원 관리 | `#/admin/members` | 관리자 |
| 활동 담당자 관리 | `#/admin/managers` | 관리자 |
| 활동 카테고리 관리 | `#/admin/categories` | 관리자 |

활동 화면의 보기 방식은 `#/activities?view=list`, `view=calendar`, `view=polls`로 구분됩니다. 실제 경로 이동은 모두 URL의 `#` 뒤에서 이루어지므로 GitHub Pages의 하위 저장소 경로에서도 새로고침 시 404가 발생하지 않습니다.

## 3. 설치 및 로컬 실행

npm 설치와 빌드 과정은 없습니다.

1. Supabase 프로젝트를 만듭니다.
2. 아래의 [Supabase 연결](#5-supabase-연결) 절차를 완료합니다.
3. `js/config.js`에 프로젝트 URL과 publishable key를 입력합니다.
4. 저장소 루트에서 정적 파일 서버를 실행합니다.

```bash
python3 -m http.server 8080
```

브라우저에서 `http://localhost:8080`을 엽니다. ES Modules의 브라우저 보안 정책 때문에 `index.html`을 `file://`로 직접 여는 방식은 지원하지 않습니다.

Supabase JavaScript Client v2는 `index.html`에서 공식 지원 CDN 방식으로 불러옵니다.

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

## 4. GitHub Pages 배포

1. 이 프로젝트의 모든 파일을 GitHub 저장소 루트에 올립니다.
2. GitHub 저장소의 **Settings → Pages**로 이동합니다.
3. **Build and deployment**에서 **Deploy from a branch**를 선택합니다.
4. 배포 브랜치와 `/ (root)` 폴더를 선택하고 저장합니다.
5. 배포 주소가 `https://사용자명.github.io/저장소명/`이라면 그 주소를 Supabase Auth Redirect URL에도 등록합니다.

모든 로컬 정적 파일은 `./css/...`, `./js/...`, `./assets/...`처럼 상대 경로를 사용합니다. 따라서 사용자 페이지 루트뿐 아니라 `https://사용자명.github.io/저장소명/` 같은 프로젝트 하위 경로에서도 정상적으로 불러옵니다.

`.nojekyll` 파일이 포함되어 있어 GitHub Pages가 정적 파일을 Jekyll 처리 대상으로 바꾸지 않습니다. Hash Routing을 사용하므로 별도의 `404.html` 라우팅 우회 파일은 필요하지 않습니다.

## 5. Supabase 연결

### 5.1 SQL 실행

새 Supabase 프로젝트에서는 **SQL Editor**에서 다음 순서로 실행합니다.

1. `supabase/schema.sql`
2. `supabase/seed.sql`

이전 버전의 두 파일을 이미 실행한 운영·테스트 프로젝트에서는 전체 스키마를
다시 실행하지 말고 백업 후 `supabase/audit_patch.sql`만 한 번 실행합니다.
패치는 기존 데이터를 유지하면서 감사에서 보완된 제약조건, 인덱스, 함수,
Trigger, RLS 정책을 갱신합니다.

스키마 재실행 조건, 초기 관리자 지정 SQL, 보안 점검 방법은 `supabase/README.md`를 따릅니다.

### 5.2 브라우저 연결값

Supabase Dashboard의 **Connect** 또는 **Project Settings → API**에서 다음 값을 확인합니다.

- Project URL
- Publishable key 또는 legacy anon key

`js/config.js`를 수정합니다.

```js
export const SUPABASE_URL = "https://프로젝트참조.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "공개용_publishable_또는_anon_key";
export const SITE_NAME = "청파 같이";
export const PRIVACY_POLICY_VERSION = "2026-01";
```

`service_role` key는 관리자 권한을 우회하므로 브라우저 코드나 GitHub 저장소에 절대 넣지 않습니다. 공개용 key가 브라우저에 노출되는 것은 정상이며 실제 데이터 권한은 `schema.sql`의 RLS와 RPC가 판정합니다.

### 5.3 Authentication URL 설정

Supabase Dashboard의 **Authentication → URL Configuration**에서 다음을 설정합니다.

- Site URL: 실제 GitHub Pages 주소
- Redirect URLs:
  - `http://localhost:8080/**`
  - `https://사용자명.github.io/저장소명/**`

이메일 가입 확인을 사용하는 경우 확인 링크가 같은 GitHub Pages 앱으로 돌아와야 합니다. 프론트엔드는 PKCE 흐름과 세션 자동 갱신을 사용합니다.

### 5.4 Storage

`schema.sql`이 비공개 `avatars` 버킷과 정책을 생성합니다.

- 허용 형식: JPEG, PNG, WEBP
- 최대 크기: 3MB
- 저장 경로: `{현재 사용자 UUID}/profile-{timestamp}.{확장자}`
- 표시는 1시간 유효한 signed URL 사용

사용자가 자신의 폴더 밖으로 업로드·수정·삭제하려 하면 Storage 정책이 거부합니다.

## 6. 주요 기능 동작

### 인증과 상태 접근

- 회원가입 시 `display_name`, `real_name`, `birth_year`, `age_visibility`, `church_group`, `request_message`, 개인정보 동의 버전을 Auth metadata로 보냅니다.
- Auth Trigger가 `profiles`와 `join_requests`를 생성합니다.
- `pending`, `rejected` 회원은 가입 상태 화면만 볼 수 있습니다.
- `suspended` 회원은 이용 정지 화면만 볼 수 있습니다.
- `approved` 회원만 활동, 게시판, 프로필 등 일반 데이터를 조회할 수 있습니다.
- UI 메뉴 숨김과 별개로 모든 요청을 RLS·RPC가 다시 검사합니다.

### 활동

- 카테고리 검색, 제목 검색, 목록·월간 달력 보기
- 일정·장소·참여 인원·대기 인원 표시
- `get_event_participation_summaries` RPC로 응답 행 제한과 무관한 정확한 참여 인원 표시
- `join_event` RPC로 참여 또는 대기 신청
- `cancel_event_participation` RPC로 참여 취소 및 대기자 자동 승급
- 단일 활동과 주·월 단위 반복 활동 등록
- 활동 수정·일정 취소 시 참여자 알림 생성
- `.ics` 캘린더 파일 다운로드
- 날짜 후보 투표, 투표 변경, 담당자 마감·취소

### 게시판

- 공지사항은 관리자만 작성·수정·삭제
- 자유게시판은 승인 회원이 작성
- 일반 회원은 본인 글과 댓글만 수정·삭제
- 게시글·댓글은 사용자 입력을 HTML로 해석하지 않고 `textContent`로 표시
- 게시글 조회 수는 `increment_post_view` RPC로 증가

### 관리자

- `admin_approve_join_request` RPC로 가입 승인
- `admin_review_join_request` RPC로 거절·보류
- `admin_set_member_status` RPC로 회원 정지·해제
- `admin_set_member_role` RPC로 관리자 역할 변경
- `admin_set_category_manager` RPC로 카테고리 담당자 지정·해제
- 활동 카테고리 등록·수정·비활성화

## 7. 기능별 테스트 방법

Supabase Auth에 아래 테스트 계정을 준비하면 권한별 흐름을 확인하기 쉽습니다.

- 승인 대기 회원
- 승인 일반 회원
- 정지 회원
- 카테고리 담당자
- 관리자

### 7.1 인증

1. 새 이메일로 회원가입하고 `profiles.status = pending`, `join_requests.status = pending`인지 확인합니다.
2. 이메일 확인 후 로그인하여 `#/pending`으로 이동하는지 확인합니다.
3. 관리자가 승인한 뒤 새로고침하면 홈으로 이동하는지 확인합니다.
4. 정지 회원으로 로그인해 `#/suspended` 외 일반 화면 접근이 차단되는지 확인합니다.
5. 로그아웃 후 보호된 Hash Route를 직접 입력해도 로그인 화면으로 이동하는지 확인합니다.

### 7.2 관리자 승인과 회원 권한

1. 일반 회원으로 `#/admin`을 직접 입력해 접근 권한 없음이 표시되는지 확인합니다.
2. 관리자로 가입 신청을 승인·보류·거절합니다.
3. 일반 회원이 브라우저에서 관리자 RPC를 직접 호출해도 RLS/RPC가 거부하는지 확인합니다.
4. 프로필 수정 요청에 `role` 또는 `status`를 임의로 포함해도 DB Trigger가 거부하는지 확인합니다.
5. 마지막 관리자 강등·정지가 거부되는지 확인합니다.

### 7.3 활동과 정원

1. 일반 회원에게 활동 등록 버튼이 표시되지 않고 `#/activities/new` 접근도 거부되는지 확인합니다.
2. 카테고리 담당자에게 지정된 카테고리만 등록 선택지로 표시되는지 확인합니다.
3. 동일 사용자가 같은 활동에 두 번 참여해도 한 행만 유지되는지 확인합니다.
4. 정원 1명 활동에 두 계정이 동시에 신청할 때 한 명은 `joined`, 다른 한 명은 `waitlisted`가 되는지 확인합니다.
5. 참여자가 취소하면 첫 대기자가 자동으로 `joined`가 되고 알림이 생성되는지 확인합니다.
6. 활동 수정·취소 확인 대화상자와 성공·실패 알림을 확인합니다.
7. 반복 활동 등록 후 `event_series` 한 행과 기간 내 `events` 여러 행이 생성되는지 확인합니다.
8. 달력 다운로드 후 `.ics` 파일의 일정·장소·한국 시간대를 확인합니다.

### 7.4 게시판과 XSS

1. 일반 회원이 공지 작성 Route에 접근하지 못하는지 확인합니다.
2. 자유게시판 글·댓글을 작성하고 본인만 수정·삭제할 수 있는지 확인합니다.
3. 다른 회원의 글·댓글 수정·삭제 요청이 RLS에서 거부되는지 확인합니다.
4. 제목·본문·댓글에 `<img src=x onerror=alert(1)>`을 입력해도 문자열로 보이고 스크립트가 실행되지 않는지 확인합니다.
5. 저장 중 제출 버튼이 비활성화되어 중복 요청이 발생하지 않는지 확인합니다.

### 7.5 프로필과 Storage

1. JPG, PNG, WEBP 파일을 업로드하고 프로필 이미지가 signed URL로 표시되는지 확인합니다.
2. 3MB 초과 파일과 허용되지 않은 형식이 프론트엔드와 Storage 양쪽에서 거부되는지 확인합니다.
3. 다른 사용자 UUID로 시작하는 경로에 업로드·수정·삭제 요청을 보내도 Storage 정책이 거부하는지 확인합니다.
4. 일반 회원에게 다른 회원의 이메일, 실명, 소속, 가입 신청 내용이 노출되지 않는지 확인합니다.

### 7.6 UI 상태와 접근성

1. 브라우저 개발자 도구에서 네트워크를 Offline으로 바꾸어 한국어 네트워크 오류와 다시 시도 상태를 확인합니다.
2. 데이터가 없는 계정에서 조회 결과 없음 상태를 확인합니다.
3. 존재하지 않는 검색어로 검색 결과 없음 상태를 확인합니다.
4. 저장 성공·실패 toast, 삭제·참여·취소 확인 dialog를 확인합니다.
5. Tab 키만 사용해 헤더, 폼, 카드 버튼, 모바일 하단 내비게이션, dialog를 이동합니다.
6. 360px 모바일 화면과 1200px 이상 데스크톱 화면에서 가로 스크롤과 하단 메뉴 가림이 없는지 확인합니다.
7. 상태가 색상뿐 아니라 아이콘과 텍스트로 함께 표시되는지 확인합니다.

## 8. 기술적 위험과 운영 확인

- Supabase Client는 CDN에 의존하므로 jsDelivr 장애나 차단 시 앱을 불러올 수 없습니다. 완전한 공급망 고정이 필요하면 검증한 v2 버전 파일을 저장소에 직접 포함하는 운영 방식을 별도로 선택할 수 있습니다.
- GitHub Pages에는 비밀 환경 변수를 숨길 서버가 없습니다. 공개 가능한 publishable/anon key만 사용하고 모든 권한을 RLS로 통제해야 합니다.
- 반복 활동과 날짜 투표의 원본·하위 행 생성은 여러 Data API 요청으로 이루어집니다. 중간 실패 시 프론트엔드는 생성된 반복 원본을 `cancelled` 처리하거나 투표 원본 삭제를 시도하지만, 강한 원자성이 필요하면 추후 동일 스키마 계약을 유지하는 트랜잭션 RPC가 필요합니다.
- 프로필 관심 분야 교체와 날짜 투표 선택지 교체도 여러 요청으로 구성됩니다. 실패 시 이전 값을 복원하려고 시도하지만 네트워크가 연속으로 끊기면 관리자가 데이터를 확인해야 할 수 있습니다.
- 제목 검색은 PostgreSQL `simple` 전문 검색과 GIN 인덱스를 사용합니다. 한국어는 공백으로 구분된 단어 검색에 적합하며 형태소 분석이나 글자 일부 자동완성은 제공하지 않습니다.
- 브라우저·운영체제 시간대가 달라도 활동과 가입 마감은 `Asia/Seoul` 기준으로 저장하도록 변환합니다. 운영자가 입력한 날짜 자체는 한국 달력 기준으로 해석됩니다.
- 비공개 프로필 이미지는 signed URL 만료 후 다시 발급해야 합니다. 앱은 세션 중 URL을 캐시하고 만료 전에 재발급합니다.
- 관리자가 회원 상태나 권한을 변경해도 이미 열린 다른 탭은 다음 API 요청 또는 새로고침 때 변경을 반영합니다. RLS는 변경 즉시 적용되므로 오래 열린 UI가 권한을 우회하지는 못합니다.

## 9. 보안 구현 원칙

- 사용자 입력을 `innerHTML`, `outerHTML`, `insertAdjacentHTML`에 넣지 않습니다.
- 게시글, 댓글, 프로필, 활동 설명은 DOM `textContent`로 렌더링합니다.
- 외부 장소 링크는 `http`와 `https`만 허용하고 새 탭에서 `noopener noreferrer`로 엽니다.
- 모든 비동기 저장 요청은 `try-catch`로 처리하고 제출 중 버튼을 비활성화합니다.
- 관리자·담당자 버튼의 화면 노출 여부는 편의를 위한 1차 제어이며 실제 권한 판정은 Supabase RLS와 SECURITY DEFINER RPC가 수행합니다.
- 브라우저에서 일반 테이블 쓰기로 우회하지 않고 참여·가입 승인·회원 권한 변경은 기존 RPC만 사용합니다.

전체 코드 감사 결과, 수정 파일, 자동·수동 검증 체크리스트는
`AUDIT_REPORT.md`에 기록되어 있습니다.
