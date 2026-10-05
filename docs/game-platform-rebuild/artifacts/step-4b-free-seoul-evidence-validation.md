# STEP4B — Free 서울 근거 준비 검증

2026-10-05 KST. 입력 CP0054 / `c51d74f06caa2e8d76b2ba206e9446e749864126`. 결정 선보존 `2e0f4dd092f6d96c9e0e7051660d4538d8f7fce4` 이후 근거 제출 단계다.

## 수행한 문서 검증

| 확인 | 결과/범위 |
|---|---|
| 입력·원격 계보 | PR412 HEAD가 고정 입력과 일치. 기존 Draft/OPEN/미병합과 integration base 유지. 선보존 commit parent/input·3경로 read-back 확인 |
| 최종 scope | 입력 대비 8경로(신규6/수정2), 선보존 대비 6경로(신규4/수정2). 누적 PR51경로 예상. 제출시 full remote tree 비교로 실제 범위를 확인 |
| 기록 구조 | 변경 문서8개 Markdown 상대 링크·표 열수·trailing whitespace/newline 확인. CURRENT 22지점·4B IN_PROGRESS·5A 이후 NOT_STARTED 유지 |
| 기존 파일 보호 | materialized 기존144파일 동일 blob. formal/governance 입력22파일은 CP0054 tree blob과 동일; 정식6문서·코드·규칙·계획·DECISIONS 불변 |
| Governance | repository state/document policy/이번 변경/누적 변경 pure functions 오류0. CLI 전체 실행 아님 |
| 산술 | 환율/세금 민감도5조합, gameplay L/H 10/100/730h, gate2부하, Realtime113recipient-accounting·Free100events/s 비교, backup3용량 산식 확인 |
| 출처 | 2026-10-05 공식 원문 선택 확인. 가격·quota·Auth/Realtime 지원 범위의 URL/가정·미확인·조회 실패를 근거 문서에 남김 |

검증 파일은 문서·산술 정합성만 확인하며 실제 지원을 증명하지 않는다. 공식 가격 선택 확인은 계정 checkout/Dashboard/잔여 quota 조회가 아니다. CP0054 사이트153파일 inventory는 과거 정적 근거 참조이며 이번 운영 writer 전수 감사는 아니다.

## 미실행·게이트 유지

실DB·SDK/Auth·외부 C/P/R 경합·두 클라이언트·partition·old owner·server crash·backup restore·모바일 실기기·100명 부하·p95/reconnect/RPO 시험은 **NOT_RUN**이다. 문서 전용 준비이고 구현/배포/시험 실행이 이번 허용 범위가 아니므로 전체 build/e2e/runtime/DB suite를 실행하지 않았다. workflow 추가/수정/수동 dispatch 없음.

| 게이트 | 현재 상태 | 남은 결정·필요한 증거 | 다음 담당 |
|---|---|---|---|
| G01 | PARTIAL/OPEN | 250ms/5초 목표·모바일 기본 채택. 측정 구간/분포·기기·인가복구 기준과 실부하 결과 필요 | Astra 인수기준 판단 → 후속 시험 |
| G02 | PARTIAL/OPEN | 즉시 차단·pause60초 후 중단 채택. reconnect owner/view/cut·SDK retry·서버 장애 중단/새 판 전이 증거 필요 | Astra 상태 전이 판단 → 후속 경합/장애 시험 |
| G03 | OPEN/BLOCKING | 공식 근거 F01~08와 U01~10. 외부 C/P·Auth writer·철회/duplicate/restore의 경계 미증명 | Astra 핵심 선택 → 실 적용 writer/trace 확인 |
| G04 | PARTIAL/OPEN | 본인/필요 운영자·30일 삭제·daily 외부/RPO24h 목표. 최소 기록·삭제 기산/탈퇴·backup 범위/보존/RTO·restore fence 미정/미증명 | Astra 정합성/남은 사용자 질문 → backup/terminal 시험 |
| G05 | PARTIAL/OPEN | Free 서울·usage UNKNOWN. 부하별 조건부 가격 비교만 확보, 실제 quota·실측·운영/backup 조합·총3만원 준수 미확정 | Astra 제품/지역/운영 조합 판단 → 실견적/부하 증거 |
| G06 | SCOPED_DESIGN_RESOLVED | 두 Probe 규칙 적용 범위만 해소. runtime/품질/보안 전체 완료 아님 | 범위 유지, 별도 구현 허용 대기 |

전체 STEP4B IN_PROGRESS, 구현 HOLD. 핵심 판단은 Astra 후속이며 이 문서는 독립 Astra 실행 인증이 아니다. 최종 commit/head·원격 전체 tree diff·read-back·workflow/check-run 조회 결과는 제출 후 PR412본문에 고정한다. 정식반영·구현·STEP5A·병합·main 없이 제출 뒤 정지.
