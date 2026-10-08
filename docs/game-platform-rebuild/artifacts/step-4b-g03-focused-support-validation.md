# STEP4B — G03 집중 지원 근거 검증 (CP0063)

- 고정 입력 CP0062 `89a0a013a1e6324b205a37abee1d450a1ce78179`; 입력 tree `79e21c1a5eed34ed73bd344b3ae03c9758c47970`. 시작 PR412 HEAD 일치, 추가 변경 0. 조회일 2026-10-06 KST.
- AGENTS → 실행 계획 개정 1.3 → 기록 README → CURRENT → 최신 checkpoint/DECISIONS → PR 순으로 확인. CP0062 판단/근거/보완을 읽고, CP0059/61의 필요한 경로·권한·SDK 기록만 참조했다.
- 신규 [집중 근거](step-4b-g03-focused-support-evidence.md)는 Q1~Q3, F63-01~12, M63-01~05, 미전송 문의 초안과 Astra 판정 범위만 담는다. 공개 Auth 소스는 고정 commit `99090eb6597db8b1bb3a510193526d46b74c4a7d`의 정적 정의이며 운영 버전 확인이 아니다. 공식 문서, 정적 정의, 과거 운영 관측, 미확인, 실행 증거를 구분했다.
- getUser의 session 부재 검사 정의를 확보했으나 모든 만료 조건/managed 설치 버전/외부 C·P fencing 보증으로 확대하지 않았다. 검색 미확보와 명시적 비지원을 구분했다. 실제 로드 SDK는 UNKNOWN이다.
- 이번 운영 metadata 조회 0, 실사용자 데이터 조회 0, 공급자 문의 전송 0. 동일 fingerprint 재조회, 비용·운영·단말·백업 명세 재작성 없음.
- 변경 범위는 신규 근거/검증/checkpoint 3개와 CURRENT/작업 분담 2개, 총 5경로. 과거 기록·DECISIONS·정식 산출물·코드/SQL·AGENTS/실행 계획 보존. 로컬 입력 blob 대조: 범위 밖 177파일 동일, 변경 5경로 일치. 내부 링크 139개·표 14개·CURRENT 22상태 검사 오류 0. Governance의 repository state/document policy/이번 diff/누적 PR diff 검사 오류 0. 이는 정적 검사이며 CLI 및 행동 시험은 NOT_RUN이다.
- 원격 제출 뒤 5파일 exact 내용, 범위 밖 tree blob 보존, PR HEAD/base/body와 상태를 대조한다. 제출 SHA는 자기 commit 본문에 선기입하지 않고 PR 설명/최종 보고에서 확인한다.
- 권한 경합·성능·재연결·복원·삭제 등 행동 시험 **NOT_RUN**. 문서/정적 Governance/자동 Site static checks는 행동 시험 통과가 아니다. G03 OPEN/BLOCKING, G01/G02/G04/G05 PARTIAL/OPEN, G06 두 Probe 적용 판단만 SCOPED_DESIGN_RESOLVED. STEP4B IN_PROGRESS / 전체 완료·구현 HOLD.
- 핵심 채택은 Astra 판단으로 남겼다. 정식 반영·구현·실제 시험·권한 변경·backup job/dump/복원·STEP5A·병합·main 반영 없이 원격 제출/내용 확인 뒤 정지한다.
