# STEP4B — G03 기준 변경안 검증

2026-10-07 KST. 입력 CP0066 `d6c1cdc0bf493213173fc3344af1534b1ff38d76`, tree `f57dd3ce65155cffbf87c6cdb37c32808c1e5184`. PR HEAD 일치/추가 변경0. [제안](step-4b-g03-practical-scope-proposal.md).

- 요구 변경점 두 개: 설계/출시 검증 분리, 외부 철회 최대5초 및 transport 인계 경계 후보. 모두 PROPOSED / USER_DECISION_PENDING. “이어서 진행”을 후보 채택으로 취급하지 않음.
- 기존 즉시 차단/A안 요구는 승인 전 유효. 5초는 공급자 SLA/측정값/승인값 아님. 실패를 안 뒤 인가 유예 없음. 실제 R와 최종 transport 경계 관측 부족은 HOLD.
- 공식 Sessions/signOut 조회 2026-10-07. row/expiry와 외부 C/P fencing의 차이를 유지. 공식 source가5초 지원을 보장한다고 주장하지 않음. 신규 운영 SELECT/문의/전수 소스 조회 없음.
- 신규3/수정2 총5경로. 링크/표/공백/22상태·허용diff/Governance 입력을 제출 전 검사. 실패 시 제출하지 않음.
- 제출 후 원격5파일 exact read-back, 보호 blob/mode/type·삭제0·PR HEAD/body/base/OPEN Draft 일치를 확인하고 PR 설명에 남김. 사전 계획을 완료 증거로 사용하지 않음.
- 행동/권한 경합/성능/모바일/복구/삭제 NOT_RUN. 정적 검사 또는 자동 CI는 행동 시험 통과가 아님.
- G03 OPEN/BLOCKING, G01/02/04/05 PARTIAL/OPEN, G06 두 Probe만 SCOPED_DESIGN_RESOLVED. STEP4B IN_PROGRESS/전체 완료·구현 HOLD.
- 정식 산출물/DECISIONS/과거 기록/코드/SQL/계획/AGENTS 보존. 구현·실제 시험·권한 변경·문의·job/dump/복원·STEP5A·병합·main 없음.
