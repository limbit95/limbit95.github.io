# CP-0008 — STEP 1 AS-IS 감사·계승표 제출 준비

- checkpoint ID: `CP-0008-step-1-audit-ready`
- 이전 checkpoint: `CP-0007-step-1-resume` (당시 중단 상태 보존)
- 작성 시각: `2026-10-01T00:39:05+00:00`
- 계획: `/game_platform_vnext_final_execution_plan.md` 개정 1.3 / blob `e12ef038913eb6d605709b782f1b73f18e0d1253`
- root-slug: `game-platform-vnext`
- 정식 기준: `main`; STEP 0 착수/최초 integration 분기 main `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09`
- vNext 통합 기준: `feature/game-platform-vnext-integration`
- 실제 integration HEAD / STEP 1 분기 기준 / source 감사 SHA: `132ec1576e316d0238c9ca6e07d0d3ab91950ec8`
- integration 마지막 승인 STEP: STEP 0 (#404), 사후 기록 #406/#407까지 반영
- STEP branch: `docs/game-platform-vnext-phase1-audit`
- 저장 직전 STEP HEAD: `4f7c1697648a7993d85cdc89b0188b1cb7daaddf`
- 상태: STEP 1 `REVIEW_PENDING` (산출물 준비, 사용자 검토 미수행); STEP 2 `NOT_STARTED`
- STEP PR: 이 기록 작성 시 미생성. 예정 base `feature/game-platform-vnext-integration` / head `docs/game-platform-vnext-phase1-audit`
- STEP 1 감사/기록/PR 제출: 2026-10-01 사용자 요청으로 허용됨
- STEP 1 검토 완료 / integration 병합 승인 / 실제 merge: 미수행 / 없음 / 미수행
- integration → main 승인/PR/반영: 없음 / 없음 / 미수행

## 완료한 산출물

모두 `../artifacts/` 아래에 작성했다.

1. [step-1-as-is-audit.md](../artifacts/step-1-as-is-audit.md): 실제 문서 권위·공통 exports/호출자·Registry/site·기존 게임·문제/미결정.
2. [step-1-clause-succession-table.md](../artifacts/step-1-clause-succession-table.md): 안정 ID/분류/강도/현재 책임과 소비 증거/중복/충돌의 인덱스.
3. [step-1-clauses-platform.md](../artifacts/step-1-clauses-platform.md), [step-1-clauses-design.md](../artifacts/step-1-clauses-design.md), [step-1-clauses-games.md](../artifacts/step-1-clauses-games.md), [step-1-clauses-site-history.md](../artifacts/step-1-clauses-site-history.md): SHA/파일/절/줄/부모/원문을 고정한 전수 표.
4. [step-1-source-inventory.md](../artifacts/step-1-source-inventory.md): 실제 문서 26개, games Markdown 14개 전부, 코드 증거 57파일의 읽기 범위와 blob.
5. [step-1-validation.md](../artifacts/step-1-validation.md): 실제 테스트·trace·범위 검증, F01 재현과 읽기 전용 원문 대조 절차.

원문 3,232단위 중 규칙·형식·필드 2,104개(K 1,198 / L 906). 독립 MUST 개수라는 뜻이 아니다. P 897 / B 11 / M-ROOM 30 / M-DB 114 / M-DOM 11 / M-INVITE 7 / S 128 / L 906. P의 보드 전제는 R01-BOARD로 별도 표시했으며 새 Core나 Runtime Model 소유를 결정하지 않았다.

Critical 0 / Major 2 / Minor 1:

- F01 Major: Can’t Stop의 늦은 action 응답으로 version 3→2, shared coordinator의 dispose 후 callback 1회 관찰. 현재 unit PASS가 이 빈틈을 덮지 못함.
- F02 Major: No Thanks! DEVELOPMENT 비활성/pending와 Registry·사이트·release 체크리스트 활성화 기록 불일치.
- F03 Minor: DB test 진입 README/current Validation Plan의 10개 표현과 실제 11개 계약 차이.

중복 전파 10그룹/141행, 확정 문서 불일치 2건과 범위 긴장 1건, 암묵적 후보 8개, 미확인 3범주를 숨기지 않고 기록했다. F01/F02 때문에 기존 게임을 vNext migration 대상으로 삼거나 기존 소스를 고치지 않았다.

## 검증/미실행

- 원문/줄/blob/ID/부모/강도 및 games Markdown 전수 대조 PASS. 원문 불일치·본문 누락·중복 ID 0.
- `node --test tests/game-platform-governance.test.js tests/game-platform-contracts.test.js tests/game-platform-db-contract.test.js`: 45 PASS / 0 FAIL / 0 SKIP, Node v24.19.0. workflow Node 22 결과가 아님.
- `node scripts/check-game-platform-governance.mjs --base 132ec1576e316d0238c9ca6e07d0d3ab91950ec8 --head HEAD`: PASS. 최종 제출 commit에서도 범위/Guard를 대조한다.
- F01 재현 2개: OBSERVED. 재현용 소스/테스트 파일을 저장소에 추가하지 않음.
- 전체 게임 테스트/build/browser/disposable DB/production 검증 NOT_RUN: 실행 코드와 계약 변경 없는 문서 감사다. CI는 PR 제출 후 실제 상태를 확인하며 경로 제외를 PASS로 표시하지 않는다.
- 계획, 기존 게임/규칙/Registry/Guard/DB/workflow, DECISIONS, CP-0001~0007은 그대로. 새 상태는 CURRENT/새 checkpoint에만 기록한다.

## 미완료·다음 첫 행동

**원격 STEP 브랜치에 산출물을 보존하고 integration 대상 PR을 생성한다.** 이후 실제 PR 번호/base/head/open 상태와 CI 조회를 같은 브랜치의 후속 checkpoint/CURRENT에 기록한다. 사용자 검토 대기 상태로 멈추며 merge/STEP 2는 하지 않는다.

새 채팅은 CURRENT → 최신 checkpoint → AS-IS → 계승표 인덱스 → 필요한 원문 표/validation으로 복원한다. 새 책임 위치/모델/계약은 이후 STEP의 입력이며 승인된 결정이 아니다. DECISIONS는 변경하지 않는다.

## 저장 상태

이 checkpoint 작성 시 artifact는 로컬 작성 완료, 원격 보존은 아직 확인 전이다. 이 commit의 저장 전 HEAD만 적었으며 저장 후 실제 원격 SHA와 artifact blob/read-back 확인으로 닫는다. PR 번호와 자신의 commit SHA를 미리 만들지 않는다.
