# 청파 같이 실제 코드 감사 보고서

감사 기준일: 2026-07-30  
대상: GitHub Pages용 HTML/CSS/Vanilla JavaScript SPA와 Supabase SQL 전체

## 1. 최종 판정

- SQL의 14개 public 테이블과 JavaScript가 호출하는 14개 테이블명이 모두 일치합니다.
- JavaScript가 호출하는 10개 RPC의 함수명과 매개변수명이 SQL 선언과 모두 일치합니다.
- 14개 public 테이블 모두 RLS가 활성화되어 있습니다.
- 최신 `schema.sql`·`seed.sql` 전체 실행과 이전 스키마에 `audit_patch.sql` 적용을 각각 검증했습니다.
- 권한, 참여 정원, 중복, 마감, 취소, Storage 폴더 격리 시나리오가 PostgreSQL 호환 실행 환경에서 통과했습니다.
- 실제 Chromium에서 저장소 하위 경로, ES Module 로딩, Hash 새로고침, 360px 가로 넘침, 모바일 하단 메뉴 비가림을 검증했습니다.
- 실제 Supabase 프로젝트 URL과 테스트 계정은 제공되지 않았으므로 운영 프로젝트에 대한 네트워크 통합 테스트는 아래 체크리스트에 따라 별도로 수행해야 합니다.

## 2. 발견된 문제와 원인·수정

| 영역 | 발견된 문제 | 원인 | 적용한 수정 |
|---|---|---|---|
| ES Modules | `auth.js`가 브라우저에서 구문 오류로 중단됨 | `await`를 사용하는 `initializeAuth`에 `async` 누락 | 비동기 함수 선언 보정 |
| ES Modules | 관리자 담당자 화면 모듈이 괄호 오류로 중단됨 | 중첩 `el`·`actionButton` 호출의 닫는 괄호 오류 | 실제 브라우저 파싱 기준으로 수정 |
| 가입 승인 | 처리 완료된 신청을 다시 거절·보류할 수 있었음 | 관리자 RPC가 현재 신청 상태를 잠그고 검사하지 않음 | `pending`·`held`만 처리하도록 행 잠금과 상태 검사 추가 |
| 승인 우회 | 상태 변경 RPC로 pending 사용자를 approved로 만들 수 있었음 | 기존 상태 전이 검증 부족 | approved·suspended 기존 회원만 상태 RPC로 처리 |
| 관리자 보호 | 동시에 마지막 관리자 강등·정지를 요청하면 보호 검사가 경합할 수 있었음 | 관리자 수 확인 트랜잭션 사이에 공통 잠금 없음 | 두 RPC에 같은 advisory transaction lock 적용 |
| 담당자 권한 | 담당자 지정 해제 후에도 작성자 조건으로 활동·투표를 관리할 수 있었음 | UPDATE·DELETE 정책에 `created_by = auth.uid()` 우회 조건 존재 | 현재 관리자 또는 현재 활성 카테고리 담당자만 관리하도록 RLS 보정 |
| 비활성 카테고리 | 비활성 카테고리 담당자가 권한 보유자로 판정될 수 있었음 | Helper가 카테고리 활성 상태를 확인하지 않음 | `activity_categories.is_active` 검사 추가 |
| 담당자 해제 | 회원 정지 또는 카테고리 비활성화 후 담당자 지정 해제가 막힐 수 있었음 | 지정과 해제에 같은 사전 검증 적용 | 사전 검증을 `p_enabled = true`에만 적용 |
| 참여 인원 | 활동 카드 참여 수가 데이터 API의 중첩 행 제한에 따라 실제보다 작아질 수 있었음 | 전체 참여 행을 내려받아 브라우저에서 계산 | 집계 RPC와 정확한 joined·waitlisted·본인 상태 사용 |
| 참여 동시성 | 투표 마감과 마지막 투표가 동시에 처리될 여지가 있었음 | 투표 INSERT 검증에서 투표 행을 잠그지 않음 | 검증 Trigger에서 poll 행 `FOR SHARE` 잠금 |
| FK 정리 | 게시글·활동 물리 삭제 시 다형 댓글이 고아 행으로 남을 수 있었음 | `target_type + target_id`에는 일반 FK를 걸 수 없음 | 대상 삭제 후 댓글을 정리하는 SECURITY DEFINER Trigger 추가 |
| 데이터 제약 | 같은 날 종료 시간이 시작 시간보다 빠른 일정이 저장될 수 있었음 | 날짜 범위만 검사하고 시각 범위 CHECK 없음 | 단일·반복 일정의 종료 시각 CHECK 추가 |
| 인덱스 | 일부 FK와 관리자·투표 조회 경로 인덱스가 부족했음 | PK가 FK 역방향 조회를 모두 보장하지 않음 | 승인자·검토자·생성자·투표 결과·알림 등 보조 인덱스 추가 |
| 검색 인덱스 | JavaScript의 `%...%` ILIKE가 기존 전문 검색 GIN 인덱스를 사용하지 못함 | SQL 인덱스와 API 검색 연산 불일치 | 활동 제목 GIN 인덱스 추가, 활동·게시글 검색을 `textSearch(simple, plain)`으로 통일 |
| 인증 초기화 | 초기화 중복 호출 시 세션 조회와 Auth 이벤트 구독이 중복될 수 있었음 | 초기화 Promise와 구독 singleton 보호 없음 | 초기화 Promise, 구독 참조, 직렬 refresh queue 추가 |
| 로그아웃 경합 | 늦게 끝난 프로필 조회가 로그아웃 뒤 상태를 다시 채울 수 있었음 | 비동기 결과의 수명 확인 없음 | lifecycle epoch로 오래된 요청 결과 폐기 |
| 보호 데이터 잔상 | 로그아웃 또는 상태 변경 직후 이전 보호 화면이 잠시 남을 수 있었음 | 라우팅 완료 전 기존 DOM 유지 | 즉시 로딩 상태로 교체 후 접근 상태 재판정 |
| 같은 Hash 이동 | 현재 Hash와 리다이렉트 목적지가 같으면 화면 갱신이 누락될 수 있었음 | 동일 Hash에는 `hashchange`가 발생하지 않음 | 동일 목적지는 `resolveRoute()` 직접 실행 |
| 상태 화면 | 승인 회원이 `#/pending`을 직접 열 수 있었음 | signed 화면의 정확한 상태 검사 부족 | pending·rejected 외 상태는 올바른 목적지로 이동 |
| 담당자 UI | 비활성 카테고리 지정이 활동 등록 메뉴 노출에 반영될 수 있었음 | Auth context가 지정 행만 조회 | 활성 카테고리 ID와 교차 확인 |
| 참여 UI | 신청 마감 뒤 상세 화면에 취소 버튼이 남고 API 오류가 발생할 수 있었음 | 카드와 상세의 마감 판정 불일치 | 상세·카드의 마감 판정과 상태 문구 통일 |
| 중복 클릭 | 활동 참여·취소를 빠르게 반복 클릭할 수 있었음 | 액션 버튼 busy 잠금 누락 | RPC 처리 중 버튼 비활성화·aria-busy·오류 시 복원 |
| 날짜 기준 | 한국 자정 전후에 활동·관리자·마이페이지 조회 날짜가 하루 어긋날 수 있었음 | `toISOString()`의 UTC 날짜 사용 | `Asia/Seoul` 날짜 Helper로 통일 |
| Hash 접근성 | 본문 바로가기 링크가 Hash Router의 `/main-content` 경로로 해석됨 | 문서 fragment와 Hash Routing 충돌 | 버튼 방식 본문 포커스 이동으로 변경 |
| 모바일 | 긴 카드·폼·검색 요소가 360px에서 가로 넘침을 만들 수 있었음 | Grid/Flex 자식의 암시적 최소 너비 | `min-width: 0`, `minmax(0, 1fr)`, 소형 화면 규칙 추가 |
| 마이페이지 | 취소된 활동 일정이 예정·지난 목록 어디에도 나타나지 않을 수 있었음 | 예정 상태만 분리하고 나머지 분류가 불완전 | 예정 ID 집합 외 활동을 지난 활동으로 분류 |
| 기존 DB 적용 | 최신 `schema.sql`은 새 프로젝트용이라 운영 DB에 그대로 재실행하기 어려움 | CREATE 문과 정책 이름 충돌 가능 | 데이터 보존형 `audit_patch.sql` 추가 |

## 3. 수정한 파일 목록과 전체 코드

아래 링크는 코드 조각이 아니라 프로젝트에 반영된 각 파일의 전체 코드입니다.

### 기준 문서와 진입점

- [README.md](./README.md)
- [index.html](./index.html)
- [AUDIT_REPORT.md](./AUDIT_REPORT.md)

### Supabase

- [supabase/schema.sql](./supabase/schema.sql)
- [supabase/audit_patch.sql](./supabase/audit_patch.sql)
- [supabase/README.md](./supabase/README.md)

### 공통 JavaScript

- [js/api.js](./js/api.js)
- [js/app.js](./js/app.js)
- [js/auth.js](./js/auth.js)
- [js/router.js](./js/router.js)
- [js/ui.js](./js/ui.js)

### 컴포넌트와 페이지

- [js/components/activityCard.js](./js/components/activityCard.js)
- [js/pages/activities.js](./js/pages/activities.js)
- [js/pages/activityDetail.js](./js/pages/activityDetail.js)
- [js/pages/admin.js](./js/pages/admin.js)
- [js/pages/home.js](./js/pages/home.js)
- [js/pages/mypage.js](./js/pages/mypage.js)

### CSS

- [css/layout.css](./css/layout.css)
- [css/components.css](./css/components.css)
- [css/pages.css](./css/pages.css)
- [css/responsive.css](./css/responsive.css)

## 4. 실행 검증 결과

| 검사 | 결과 |
|---|---|
| 최신 schema.sql 전체 실행 | 통과 |
| seed.sql 전체 실행 | 통과 |
| 이전 schema.sql + audit_patch.sql | 통과 |
| public 테이블명 계약 | 14/14 일치 |
| JavaScript RPC 계약 | 10/10 함수명·매개변수 일치 |
| public RLS | 14/14 활성화 |
| pending·suspended 데이터 차단 | 통과 |
| 일반 회원 관리자·활동·공지 쓰기 차단 | 통과 |
| 담당자 카테고리 범위 | 통과 |
| 게시글·댓글 소유권 | 통과 |
| 중복 참여·정원·마감·취소 | 통과 |
| 참여 취소 후 재참여·대기자 승격 | 통과 |
| Storage 자기 UUID 폴더 제한 | 통과 |
| ES Module 그래프 파싱·불러오기 | 통과 |
| createClient 생성 위치 | 1곳 |
| onAuthStateChange 등록 위치 | 1곳, 초기화 guard 적용 |
| 위험한 HTML 삽입 API | 발견되지 않음 |
| 로컬 정적 파일 절대경로 | 발견되지 않음 |
| 저장소 하위 경로·Hash 새로고침 | Chromium 통과 |
| guest·pending·suspended·일반 회원 Route Guard | Chromium 통과 |
| 360px 문서 너비 | viewport 360px / document 360px |
| 모바일 하단 메뉴 콘텐츠 가림 | 통과 |

## 5. 남아 있는 제한사항

1. 실제 Supabase 프로젝트 정보와 테스트 계정이 없으므로 Auth 이메일 확인 링크,
   운영 RLS, Storage signed URL, GitHub Pages 도메인의 Redirect URL을 실제
   네트워크로 확인하지는 못했습니다.
2. 반복 활동 생성, 날짜 투표와 후보 생성, 프로필 관심 분야 교체, 투표 선택 교체는
   여러 Data API 요청입니다. 프론트엔드가 실패 보상 처리를 하지만 네트워크가
   연속으로 끊기면 부분 결과를 관리자가 확인해야 할 수 있습니다.
3. 제목 검색은 PostgreSQL `simple` 전문 검색입니다. 공백 단위 한국어 단어 검색은
   가능하지만 형태소 분석, 오타 교정, 글자 일부 자동완성은 범위에 없습니다.
4. 참가자 프로필 목록은 일반적인 Supabase 응답 행 제한의 영향을 받을 수 있습니다.
   카드·상세의 인원 수는 별도 집계 RPC를 사용하므로 정확하지만, 매우 큰 활동의
   참가자 이름 전체를 한 화면에 페이지네이션하는 기능은 현재 범위에 없습니다.
5. Supabase Client v2는 jsDelivr CDN에 의존합니다. CDN 장애 시 앱 초기화 안내가
   표시되며, 완전한 공급망 고정이 필요하면 검증한 v2 브라우저 파일을 저장소에
   포함하는 별도 운영 결정을 내려야 합니다.

## 6. Supabase 설정 체크리스트

- [ ] 새 프로젝트이면 `schema.sql` 다음 `seed.sql` 순서로 실행했다.
- [ ] 이전 스키마가 이미 있으면 백업 후 `audit_patch.sql`만 실행했다.
- [ ] `private` 스키마를 Exposed schemas에 추가하지 않았다.
- [ ] Email Authentication을 활성화했다.
- [ ] Site URL을 실제 GitHub Pages 주소로 설정했다.
- [ ] localhost와 GitHub Pages 하위 경로를 Redirect URLs에 등록했다.
- [ ] 초기 관리자 계정을 일반 가입한 뒤 `supabase/README.md`의 SQL로 한 번만 지정했다.
- [ ] `avatars` 버킷이 private, 3MB, JPEG·PNG·WEBP로 설정되었다.
- [ ] 14개 public 테이블의 RLS가 활성화되었다.
- [ ] 브라우저에는 publishable key 또는 legacy anon key만 사용했다.
- [ ] `service_role`, JWT secret, DB 비밀번호가 GitHub 기록에 없다.
- [ ] 실제 계정으로 pending·approved·suspended·manager·admin 흐름을 확인했다.
- [ ] SQL 변경 전에 백업 또는 별도 테스트 프로젝트에서 패치를 검증했다.

## 7. GitHub Pages 배포 체크리스트

- [ ] `index.html`, `css`, `js`, `assets`, `.nojekyll`을 저장소 루트에 올렸다.
- [ ] npm 설치나 빌드 결과물에 의존하지 않는다.
- [ ] `js/config.js`에 실제 Project URL과 publishable/anon key를 넣었다.
- [ ] Pages source를 배포 브랜치의 `/ (root)`로 설정했다.
- [ ] `https://사용자명.github.io/저장소명/`에서 CSS·JS·SVG가 200으로 응답한다.
- [ ] `#/activities`, `#/notice`, `#/mypage`에서 새로고침해도 404가 나지 않는다.
- [ ] 브라우저 Network 탭에서 ES Module import가 모두 성공한다.
- [ ] `file://`가 아니라 HTTPS 또는 로컬 정적 서버로 실행한다.
- [ ] 360px에서 가로 스크롤이 없고 마지막 버튼이 하단 메뉴에 가리지 않는다.
- [ ] 배포 후 Auth 이메일 확인 링크가 같은 Pages 앱으로 돌아온다.

## 8. 관리자 권한 테스트 체크리스트

- [ ] pending·held 신청만 승인·보류·거절할 수 있다.
- [ ] 이미 승인된 신청을 다시 거절하면 RPC가 거부한다.
- [ ] pending 회원을 상태 변경 RPC로 승인할 수 없다.
- [ ] 마지막 승인 관리자를 강등하거나 정지할 수 없다.
- [ ] 일반 회원에게만 관리자 역할을 부여·회수할 수 있다.
- [ ] 회원을 정지하면 열린 세션에서도 다음 DB 요청이 거부된다.
- [ ] 정지 해제 후 새로고침하면 일반 서비스에 다시 접근한다.
- [ ] 승인 회원과 활성 카테고리만 담당자로 지정할 수 있다.
- [ ] 정지 회원 또는 비활성 카테고리의 기존 담당자 지정은 해제할 수 있다.
- [ ] 모든 카테고리의 활동·반복 일정·날짜 투표를 관리할 수 있다.
- [ ] 공지사항을 작성·수정·삭제할 수 있다.
- [ ] 카테고리를 등록·수정·비활성화할 수 있다.

## 9. 일반 회원·담당자 권한 테스트 체크리스트

### 비로그인·pending·suspended

- [ ] 비로그인 상태에서 보호 Hash Route가 `#/login`으로 이동한다.
- [ ] pending·rejected 회원은 `#/pending` 외 일반 서비스 화면에 접근하지 못한다.
- [ ] suspended 회원은 `#/suspended` 외 일반 서비스 화면에 접근하지 못한다.
- [ ] 승인 회원이 `#/pending`을 직접 열면 홈으로 이동한다.
- [ ] 로그아웃 즉시 이전 보호 데이터가 화면에서 사라진다.

### 일반 승인 회원

- [ ] 자신의 프로필을 수정할 수 있지만 role·status 요청은 DB가 거부한다.
- [ ] 다른 회원의 이메일·실명·소속·가입 메시지를 조회할 수 없다.
- [ ] 일반 회원은 활동·반복 일정·날짜 투표를 등록할 수 없다.
- [ ] 일반 회원은 공지를 작성할 수 없다.
- [ ] 자유게시판 글과 댓글을 작성하고 본인 것만 수정·삭제할 수 있다.
- [ ] `<img onerror=...>` 같은 입력이 HTML로 실행되지 않고 텍스트로 보인다.
- [ ] 다른 UUID 폴더에 아바타를 업로드·수정·삭제할 수 없다.

### 카테고리 담당자

- [ ] 지정된 활성 카테고리만 활동 등록 선택지에 표시된다.
- [ ] 미지정·비활성 카테고리 INSERT·UPDATE 요청을 RLS가 거부한다.
- [ ] 담당자 지정이 해제되면 자신이 예전에 만든 활동도 더 이상 관리할 수 없다.
- [ ] 관리 가능한 카테고리의 활동 수정·일정 취소·날짜 투표 마감이 가능하다.

### 활동 참여

- [ ] 같은 활동을 연속 클릭해도 중복 참여 행이 생기지 않는다.
- [ ] 참여 취소 뒤 다시 신청할 수 있고 기존 행이 재사용된다.
- [ ] 정원 1명 활동에 두 계정이 동시에 신청하면 joined는 1명뿐이다.
- [ ] 정원이 차면 후속 신청자는 waitlisted가 된다.
- [ ] joined 회원 취소 시 가장 오래된 대기자가 joined로 승격된다.
- [ ] 신청 마감 뒤 신규 참여와 참여 취소가 거부된다.
- [ ] cancelled·completed 활동에는 참여할 수 없다.
- [ ] 카드·상세·마이페이지의 참여 인원과 본인 상태가 일치한다.
- [ ] 취소된 활동 일정은 마이페이지 지난 활동에 표시된다.
