# 청파 같이 리빌딩 마감 실행 계획

기준일: 2026-08-27
기준 브랜치: `feature/rebuild-finalization`
기준 커밋: 성능 최적화 브랜치 `863b1b1ea3610665151f479d79f2bcc9442b0cc5`에서 분기

## 목표

본격적인 기능 확장 전에 커뮤니티 본 사이트의 구조 리빌딩을 종료할 수 있는 기준선을 만든다.

이번 마감 작업은 기능 추가보다 다음을 우선한다.

- 회귀를 잡는 브라우저/DB 테스트 안전망
- 알림 시스템의 cursor pagination 완성
- 초기 로딩/API 의존성 구조 정리
- 콘텐츠 해시 기반 정적 자산 배포
- 캐시 호환용 legacy shim 제거
- RLS/RPC/Storage/인덱스 최종 감사
- 운영 오류 관측 기반

게임 전용 구현 및 DB(`liar_*`, `splendor_*`)는 이번 커뮤니티 리빌딩 마감 범위에서 수정하지 않는다.

## 실행 순서

### Phase 0. 성능 기준선 고정

- `feature/performance-lazy-routes`의 결과를 마감 브랜치 기준선으로 사용
- route/admin lazy loading 유지
- 홈 외부 말씀 요청이 초기 렌더를 막지 않도록 유지
- 알림 배지는 count 전용 조회 유지
- 초기 화면에서 `js/api.js` 및 무관한 route module이 로드되지 않는지 E2E 유지

완료 조건:
- Site static checks 성공
- Community E2E smoke 성공
- Community authenticated E2E 성공

### Phase 1. 쓰기 동작 E2E 안전망

격리된 로컬 Supabase에서 실제 UI와 RLS/RPC를 통과하는 write-path E2E를 추가한다.

우선순위:
1. 활동 참여 / 취소
2. 게시글 작성 / 수정 / 삭제
3. 댓글 작성 / 삭제
4. 프로필 수정 / 관심사 원자적 교체
5. 알림 읽음 처리
6. DM 전송 / 읽음 처리
7. 관리자 회원 승인 / 정지 / 복구

원칙:
- production DB/계정 사용 금지
- service_role 브라우저 노출 금지
- 테스트 fixture는 매 실행마다 폐기되는 로컬 Supabase에만 생성

완료 조건:
- Chromium Desktop + WebKit Mobile 모두 통과
- write-path 실패 시 trace/screenshot artifact 남김

### Phase 2. P2-4 알림 프론트 완성

이미 운영 DB에 있는 cursor pagination/retention 구조를 프론트에 다시 연결한다.

- unread count는 count 전용 쿼리 유지
- 첫 알림 페이지 cursor 조회
- `더 보기` cursor pagination
- 읽음 처리 후 count/list 동기화
- Realtime 신규 알림과 pagination 상태 결합
- 빈 상태/마지막 페이지/동시 새 알림 회귀 테스트

완료 조건:
- 모바일 WebKit 포함 E2E 통과
- 첫 화면에서 알림 전체 row 선조회 없음
- legacy `listNotifications(limit)`를 현대 화면이 사용하지 않음

### Phase 3. API 의존성/facade 정리

`js/api.js` re-export facade 의존을 단계적으로 제거한다.

- 각 화면은 필요한 `js/api/<domain>.js`를 직접 import
- 공통 UI/notification/DM 코드도 domain API 직접 import
- static linker에 facade 신규 의존 금지 guard 추가
- 초기 route graph에 불필요한 API module이 섞이지 않도록 유지

완료 조건:
- 현대 커뮤니티 코드에서 `js/api.js` import 0건
- facade는 cached legacy module 호환 목적으로만 남아 있음

### Phase 4. 콘텐츠 해시 기반 asset 배포

수동 `?v=...` 세대 관리에서 벗어난다.

목표 구조 예:
- `dist/assets/app.<content-hash>.js`
- `dist/assets/home.<content-hash>.js`
- CSS도 hash 파일명 적용
- build manifest가 `index.html` 참조를 생성

원칙:
- GitHub Pages 배포 artifact는 build 결과물 사용
- source 파일과 build 산출물 책임 분리
- 동일 내용은 동일 hash
- 새 내용은 새 URL이므로 구/신 module graph 혼합 방지

완료 조건:
- 수동 query cache generation 제거
- cold-cache Chromium/WebKit E2E 통과
- 이전 배포 asset URL과 새 배포 asset URL 혼합 시 module-link failure가 발생하지 않음

### Phase 5. Legacy compatibility 제거

콘텐츠 해시 배포가 안정화된 뒤 cached pre-P2/P2-4 브라우저 호환 shim을 제거한다.

대상:
- `listMyParticipations`
- `listComments`
- `listNotifications`
- `js/api.js` compatibility facade
- 기타 과거 generation 전용 export

완료 조건:
- repo 검색에서 legacy 사용 0건
- named export linker 통과
- Chromium/WebKit 전체 E2E 통과

### Phase 6. RLS / RPC / Storage / DB 성능 최종 감사

커뮤니티 본 사이트만 대상으로 역할 매트릭스를 다시 검증한다.

역할:
- anon
- approved member
- category manager
- admin
- suspended member

검사 범위:
- SELECT / INSERT / UPDATE / DELETE
- SECURITY DEFINER RPC의 내부 authorization check와 EXECUTE grant
- Storage avatar read/write/upsert
- notification/direct_message 접근
- 함수 `search_path`
- Advisor security/performance 경고
- 주요 쿼리 EXPLAIN 및 인덱스 검토

현재 준비 단계에서 확인한 커뮤니티 관련 항목:
- 새 community FK covering-index 누락 경고는 현재 없음
- `public.set_updated_at` mutable search_path 경고 검토 필요
- `public.is_admin()` anon EXECUTE 가능 여부 검토 필요
- admin/member용 SECURITY DEFINER RPC는 실제 내부 권한 검사를 확인한 뒤 의도된 EXECUTE만 유지
- leaked password protection은 프로젝트 Auth 설정 항목으로 별도 운영 판단 필요
- unused index는 실제 query usage/통계 기간을 확인하기 전 성급히 삭제하지 않음

완료 조건:
- community high/critical security issue 0
- 의도되지 않은 anon/authenticated privileged RPC 0
- 필요한 index 변경은 migration + advisor 재검증 완료

### Phase 7. 운영 오류 관측 기반

최소한의 frontend/runtime observability를 추가한다.

수집 후보:
- app boot failure
- route render failure
- unhandled JS error / promise rejection
- Supabase API/RPC 실패 유형
- 주요 화면 로딩 실패

원칙:
- 개인정보/메시지 본문/토큰 기록 금지
- 사용자에게 보이는 오류 UX와 운영 로그를 분리
- 로깅 자체 실패가 앱 실행을 막지 않음

완료 조건:
- 의도적 테스트 오류가 운영 관측 경로에 잡히는지 검증
- 민감 데이터가 기록되지 않는지 검증

### Phase 8. 리빌딩 종료 게이트

- 전체 static checks
- guest E2E
- authenticated read E2E
- authenticated write E2E
- admin E2E
- performance/lazy-loading guard
- RLS/security advisor 재점검
- Pages production 배포 검증
- 구조 문서 업데이트
- 완료된 임시 브랜치 정리

이 게이트를 통과하면 커뮤니티 본 사이트의 구조 리빌딩을 종료하고 이후 작업은 기능 확장 중심으로 전환한다.
