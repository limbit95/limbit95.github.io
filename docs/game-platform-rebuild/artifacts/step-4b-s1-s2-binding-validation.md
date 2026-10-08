# CP0070 — S1·S2 바인딩 명세 검증

고정 입력 CP0069 `a4bd815b3b0c4c93893a82fa659cabdb4f93f0aa`, tree `0f3055eb96e153c988ff4e6b8c911496ed43546c`. 2026-10-07 KST. AGENTS→계획1.3→기록README→CURRENT→CP0069/DECISIONS→PR412 순서 확인. 시작 HEAD 일치/추가변경0. [명세](step-4b-s1-s2-binding-specification.md)·[CP0070](../checkpoints/CP-0070-step-4b-s1-s2-binding-specification.md).

| 검토 | 결과·증거 상한 |
|---|---|
| S1 실체 연결 | JWT/API·CP0059 선택 함수/ACL/RLS/trigger·fixed admin caller로 연결. auth.uid context와 서버 subject 검증 구분. session 최소권한·전체 활성 만료/삭제·writer/cascade 연결 미확인 명시 |
| 사전 fence | 실제 RPC/trigger 위치와 pending→close/ACK→commit→재검증 계약 제안. 현재 운영 적용 주장 없음. 직접 SQL·빈 permission·Auth cascade를 누락하지 않음 |
| S2 실체 연결 | PG17 transaction/CAS/clock/timeout, Node write와 Linux native send를 기능별 연결. prepared transaction timeout 제외·now 시작시각·partial queue/byte 차이 반영 |
| 핵심 공백 | C/P 최종검사 뒤 정지 반례를 current API가 제거한다는 근거 없음. d/L/b/e 상한 UNKNOWN을0으로 채우지 않음. 명시적 공급자 비지원/모든 대안 불가능으로 확대하지 않음 |
| 증거 분류 | 공식/정적/과거 운영/제안/미확인/실행 의무 구분. public Auth source/SDK@2를 managed exact version으로 바꾸지 않음 |
| 요구 유지 | 외부R5초/최초무권한0/known expiry/실패 즉시차단/최초60초와 재연결 각5초 분리. 기술 선택·새 정책을 사용자에게 전가하지 않음 |
| 시험 관측 | 실제 R/C/P 또는 보수적 구간/오차·owner 저장/송신 독립 trace 연결. 미관측 INCONCLUSIVE, 초과1건 FAIL, 시험 NOT_RUN |
| 범위 | 명세/검증/CP 신규3 + CURRENT/작업분담 수정2만. DECISIONS·과거/정식 산출물·루트 계획·코드/SQL 보존. 비용/단말/백업 재작성 없음 |

## 조회와 제출 검증

실행한 로컬 정적 검사: 허용 diff5경로, 기존196파일 내용 불변, 링크152/표24/공백/CURRENT22상태 오류0. Governance state/policy/이번diff/누적PRdiff 오류0. 전체 CLI나 행동 시험 실행을 뜻하지 않는다.

공식 추가 확인은 명세 F01~10과 changelog fallback으로 제한했다. metadata/실사용자/session 조회0·권한 변경0·문의0·행동시험0. 로컬에 없던 js/api/admin.js만 고정 입력에서 추가 정적 read, RPC caller 연결에 사용했다. 전수 source/writer 감사 아님. 운영 metadata를 다시 읽어도 S2 primitive가 생기지 않아 반복 조회하지 않았다.

제출 전 fixed tree 대비5경로 허용 diff·링크/표/공백·CURRENT22상태와 Governance state/policy/이번diff/누적PRdiff를 검사한다. 오류가 있으면 제출하지 않는다. 제출 후 원격5파일 exact read-back·보호 blob/mode/type 불변/삭제0·PR HEAD/body/base/OPEN Draft/미병합을 확인하고 실제 결과/SHA를 PR 설명·최종 보고에 남긴다. 사전 계획을 원격 완료 증거로 취급하지 않는다.

정적 검증/자동 Site CI 성공은 권한 경합·5초 deadline·성능·복구·삭제 실행 증거가 아니다. **행동 시험 NOT_RUN**, G03 OPEN/BLOCKING·다른 게이트 상태 유지. Sol 명세 준비 종료, 다음은 Astra의 바인딩 표 후보 채택/배제 판단 한 작업. 같은 수집 cycle 자동 재개 없음. 원격 제출 확인 뒤 정지.
