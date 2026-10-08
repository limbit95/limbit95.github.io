# CP-0070 — STEP4B S1·S2 실행 경계 바인딩 명세

- 2026-10-07 KST. 고정 입력/parent CP0069 `a4bd815b3b0c4c93893a82fa659cabdb4f93f0aa`, tree `0f3055eb96e153c988ff4e6b8c911496ed43546c`. 시작 PR412 HEAD 일치/추가변경0. 기존 phase4b branch/OPEN Draft/미병합/base integration `3aeae1dfcce7788f88e706dcd49d283b91b67e82` 유지.
- [바인딩 명세](../artifacts/step-4b-s1-s2-binding-specification.md): S1 JWT/회원/운영 권한 연결 가능, session 최소권한/활성 만료/writer·cascade fence는 조건부·미확인. 실제 함수·caller/ACL 연결 위치와 새 인터페이스 제안 구분.
- S2 PG transaction/CAS/timeout·Node write/native nonblocking send의 기능을 연결. 최종 C/P deadline primitive는 지원 근거 미확보. 마지막 검사 뒤 pause→R→5초 초과→늦은 commit/send 반례를 단순 lease/timer/no-await로 해결했다고 하지 않음.
- d+L+b+e≤5초·검증 시작 기준·known expiry·실패 인지 즉시차단·최초60초 abort와 transport 인계 범위를 유지. 모든 대안 불가능/공급자 명시적 비지원 결론 아님.
- Sol 한 작업 종료. **다음 담당 Astra: 이 표의 후보 채택/배제 판단**. 새 구체 집행 수단 없이 같은 Sol 수집 cycle 또는 문의 재개를 기본 경로로 지정하지 않음. 구현·시험으로 부족 primitive를 대체하지 않음.
- 새 정책/제품/주기/Auth 교체 채택 없음, DECISIONS 보존. 다른 비용/품질/모바일/열람·보존·탈퇴/복구/Free서울·운영 조건 유지, 사용량 미래 UNKNOWN.
- G03 OPEN/BLOCKING; G01/G02/G04/G05 PARTIAL/OPEN; G06 두 Probe 적용만 SCOPED_DESIGN_RESOLVED. STEP4B IN_PROGRESS/전체 완료·구현 HOLD.

## 검증·제출

- [검증 기록](../artifacts/step-4b-s1-s2-binding-validation.md). 신규3/수정2 총5경로: 명세/검증/CP0070 추가·CURRENT/작업분담 갱신. 과거/정식 산출물·루트 계획·코드/SQL/DECISIONS 보존.
- 문서/범위/Governance 검사 후 expected-head/non-force 제출, 원격5파일 exact 내용/tree diff·PR HEAD/body/base/상태 확인. 실제 SHA/결과는 PR 설명과 최종 보고에 기록.
- metadata 재조회0·실사용자조회0·문의0·권한 변경0. 행동/경합/5초/성능/복구/삭제 NOT_RUN.
- 핵심 구조 재선택·정식 반영·구현·실제 시험·job/dump/복원·STEP5A·병합·main 없이 제출 확인 뒤 정지.
