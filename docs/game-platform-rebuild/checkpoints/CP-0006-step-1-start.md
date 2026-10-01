# CP-0006 — STEP 1 착수와 감사 기준선

- checkpoint ID: `CP-0006-step-1-start`
- 이전 checkpoint: `CP-0005-step-0-record-audit-correction`
- 작성 시각: `2026-10-01T07:13:03+09:00`
- 단계/상태: **STEP 1 / IN_PROGRESS**
- 계획: `/game_platform_vnext_final_execution_plan.md` 개정 1.3
- 계획 blob: `e12ef038913eb6d605709b782f1b73f18e0d1253`
- root-slug: `game-platform-vnext`
- 정식 기준 branch: `main`
- STEP 0 착수 / integration 최초 생성 main: `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09`
- 승인된 integration: `feature/game-platform-vnext-integration`
- 확인한 integration HEAD / STEP 1 분기 기준: `132ec1576e316d0238c9ca6e07d0d3ab91950ec8`
- STEP 1 branch: `docs/game-platform-vnext-phase1-audit`
- checkpoint 저장 직전 작업 HEAD: `132ec1576e316d0238c9ca6e07d0d3ab91950ec8`
- STEP PR: 미생성, 예정 base integration / head 위 STEP 1 branch
- 마지막 승인 반영 STEP: **STEP 0**, #404 `df43b4a60518ace86f6c5db4344bea81b0d0d4f7`
- 후속 기록 반영: #406 `394ae9aada9b99d9fb049fa0a3278f50133f3290`, #407 `132ec1576e316d0238c9ca6e07d0d3ab91950ec8`
- STEP 1 시작 승인: 사용자 2026-10-01 요청. 감사·계승표·기록·STEP PR 제출까지 승인됨.
- STEP 1 검토 / merge 승인 / merge: **미수행 / 없음 / 미수행**
- STEP 2: **NOT_STARTED**, 시작 승인 없음
- integration → main: **미승인 / 미수행**

## 착수 게이트 확인

AGENTS → 루트 계획 → 기록 README → CURRENT → CP-0005 → DECISIONS 순으로 읽고 실제 원격과 대조했다. main/integration HEAD는 사용자 예상과 일치했다. PR #404/#406/#407은 모두 integration으로 MERGED이며 CP-0005가 integration에 존재한다. 원격에 기존 STEP 1 branch 또는 vNext open PR은 없었다. 다른 open PR(#405/#16/#8/#1)은 별도 작업 계보다. STEP 0의 Minor 정정과 #406 승인 근거는 CP-0005에 연결되어 있다.

## 범위와 중단 조건

- 현재 authoritative 문서 체계·규칙 조항·공통 모듈 exports/호출자·Registry/Guard/검증·기존 소비자를 감사한다.
- 산출물은 `artifacts/`에 AS-IS audit와 안정 ID를 가진 조항별 계승표를 작성한다. 실제 경로는 감사 산출물 작성 시 연결한다.
- 원문 강도와 조건/예외를 보존하고, 사실/기존 규칙/암묵적 계약 후보/미결정을 분리한다.
- 현재 room/host/snapshot/RPC/DOM 등의 존재를 vNext Core 의무로 승격하지 않는다. 향후 소유 경계는 후속 STEP의 미결정으로 둔다.
- 기존 게임·규칙·코드·DB/RPC·Registry·Guard·실행 계획과 과거 checkpoint를 변경하지 않는다. Architecture Decision은 생성하지 않는다.
- 사용자 검토 전 REVIEW_PENDING에서 정지하며 integration merge·STEP 2·main 반영은 수행하지 않는다.

## 검증과 다음 행동

- 원격 refs/PR metadata 및 integration 문서 read-back: PASS
- 작업 브랜치 HEAD가 integration 기준 SHA와 동일: PASS
- 코드 테스트: NOT_RUN — 착수 기록만 작성, 코드 변경 없음
- 원격 저장: 이 checkpoint commit/push 후 실제 원격 SHA와 파일로 확인한다. 저장 전 완료로 간주하지 않는다.
- 다음 첫 행동: 문서 링크와 권위 체계를 전수 추적하고 조항 원문/소비 위치를 수집한다.
- 미완료: AS-IS 감사, 전수 계승표, findings/미확인 분리, 추적성 검증, PR 제출.
