# STEP4B — 지원 근거·명세 검증 기록

2026-10-05. CP0058 `882bc485d1b45cf40b9eb4dbc18a724de01440dc` 고정. 확인 순서는 AGENTS→실행 계획1.3→기록README→CURRENT→최신checkpoint/DECISIONS→PR412. 시작 PR HEAD 일치, 추가 변경 없음. 기존 branch/base·OPEN/Draft/미병합 유지.

## 확인 수준

- 저장소 baseline: 로컬158파일 및 별도 정적source153파일 Git blob 대조 일치. 당시153파일 의미 감사는 재실행하지 않음.
- 실제 운영 읽기: 공개 project ref 일치, Free·서울·PG17.6 확인. list migrations155건·선택 SELECT metadata10개,12함수 정의/ACL·RLS/정책·trigger·FK·auth.schema/role read권한. 쿼리와 안전한 결과는 [snapshot](step-4b-operational-metadata-snapshot.json). 서로 다른 요청이라 atomic snapshot 아님.
- 외부 공식 설명: Supabase search_docs 우선, 공식 pricing/changelog 및 PG17/AWS 원문 보충. 날짜2026-10-05. 설치버전·가격가정·미확인을 분리.
- [근거](step-4b-support-readonly-evidence.md), [T01~14](step-4b-verification-specification.md), [B01~07/비용](step-4b-recovery-deletion-cost-specification.md)는 명세 준비. 행동·부하·dump·restore·삭제 시험 모두 NOT_RUN.

## 정적 검증 범위

새6경로(snapshot·근거·시험·복원비용·이검증·CP0059), 수정2경로(CURRENT/분담). 총8경로만 변경. 정식6문서·AGENTS·계획·DECISIONS·기존checkpoint/감사·코드/SQL 보존. 현재22단계/4B IN_PROGRESS·5A/5B/5C/6 NOT_STARTED와 gate HOLD를 확인한다. 상대 링크·Markdown 표·JSON·운영 함수 definition MD5·비용 산식을 검사한다. 저장소 기존 governance pure functions로 상태/문서정책/이번8경로/누적PR63경로를 검사한다. 정적 검사 결과는 gate 실행 증거가 아니다.

검증 결과와 원격 exact read-back의 실제 SHA는 제출 PR본문에 기록한다. Git commit 자신의 SHA를 자기 blob에 쓰는 순환 참조를 만들지 않는다. 새 tree가 입력대비8경로뿐인지와 각파일 content/blob SHA를 원격에서 확인한다. PR head·base·Draft/미병합도 재확인한다.

## 정적 검사 결과

PASS: 이번8경로·누적PR63경로, 상대링크148개·표17개 구조, unchanged local156파일, 기존governance 입력22개/정식6문서 보존. JSON의 SELECT10개와12개 함수 정의 MD5 모두 일치. 무료 제한/환율·세금·부하·backup/gate 산식 검산 PASS. governance state/policy/이번변경/누적변경 error 배열 모두 비어 있음. 이 결과는 문서·정적검산에 한정하며 CLI/행동/실복구 시험 NOT_RUN.

## 유지·제한

G03 OPEN/BLOCKING, G01/G02/G04/G05 PARTIAL/OPEN, G06 두 Probe 적용 판단만 SCOPED_DESIGN_RESOLVED. STEP4B IN_PROGRESS/전체완료·구현 HOLD. 100/8·p95 250ms·reconnect5s·세금포함월추가3만원·30일/탈퇴/7일/RPO24h/발견후24h목표 모두 유지. 대응시간·사용량·기존무료소비 UNKNOWN. 운영 metadata 조회로 성능·복구 지원 완료 선언하지 않는다.

다음 Astra는 명세 경계/지원 공백·삭제/복구점 방식·현재권한 원천·비용 조건을 판단한다. 구현·실제시험은 별도 허용 단계 작업이다. 이번 제출 뒤 정지. 정식산출물 반영·구현·job/dump/restore·STEP5A·병합·main 없음. 역할명은 업무 성격이며 별도 모델/독립 감사 실행 인증이 아니다.
