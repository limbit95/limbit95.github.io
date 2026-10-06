# CP-0068 — STEP4B G03 두 기준 변경안 사용자 채택

- 2026-10-07 07:07 KST 사용자 “응 그러자”. 입력/시작 HEAD CP0067 `d9227be38a05c9ebe1097d397a2ac30d090a4b98`, tree `9faa6b55ed9717205f6f9877ee47d9f7eb95342b`. PR412 HEAD 일치/추가변경0. 기존 phase4b branch/OPEN Draft/미병합/base integration `3aeae1dfcce7788f88e706dcd49d283b91b67e82` 유지.
- [D-0006/D-0007](../DECISIONS.md): 설계 승인/오픈 전 실행 검증 분리, 외부 철회 실제R부터 최대5초 차단·최종 transport 인계 이후 회수 미보장을 채택. 제한된 잔여 접근 위험을 설명한 CP0067에 대한 동의이며 추정 채택이 아니다.
- 과거 [제안](../artifacts/step-4b-g03-practical-scope-proposal.md)/판단/checkpoint는 당시 이력 보존. 이전 A안의 모든 무지연/actual-egress 요구를 유지한다고 쓰지 않고 변경 범위를 결정에 명시. 즉시 권한 실패차단/판pause/최초60초abort·known expiry·DB/owner/복원 보호와 다른 목표 유지.
- 다음 첫 작업: 새 기준으로 한 번의 제한된 설계 보완/감사. 전체R/DB C/transport P·신선도/만료·old owner·복원·시험 obligation 및 설계/오픈 blocker를 정합화. 실제 transport 인계와5초 달성은 미증명. 기존 자료 조사 cycle 반복 없음.
- G03 OPEN/BLOCKING의 정책 결정만 완료. DESIGN_AMENDMENT_PENDING / EXECUTION_NOT_RUN. STEP4B IN_PROGRESS/전체 완료·구현 HOLD, G01/02/04/05 PARTIAL/OPEN, G06 두 Probe만 SCOPED_DESIGN_RESOLVED. 게이트 전체 해소 아님.

## 검증·제출 경계

- 수정3(CURRENT/DECISIONS/작업분담)+신규1(이 checkpoint), 총4경로. DECISIONS 기존 D0001~5 보존/두 결정 append. 정식 산출물/계획/AGENTS/코드/SQL/과거 기록 변경 없음.
- 링크/표/공백/22상태·고정 tree diff·Governance 입력 검사를 제출 전에 수행. 실패 시 제출하지 않음.
- 제출 후 원격4파일 exact 내용·tree 보호blob/mode/type/삭제0·PR HEAD/body/base/OPEN Draft 일치를 확인하고 PR 설명/최종 보고에 남김. 이 사전 계획을 제출 완료 증거로 취급하지 않음.
- 행동/경합/성능/모바일/복원/삭제 시험 NOT_RUN. 문의/운영 SELECT/권한 변경 없음.
- 이번은 사용자 결정 보존까지. 정식 반영·구현·실제 시험·job/dump/복원·STEP5A·병합·main 없이 제출 확인 뒤 정지.
