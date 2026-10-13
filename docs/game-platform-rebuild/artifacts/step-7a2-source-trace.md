# STEP7A2 — 승인/source trace·원문 보존·적용 전환

- 지위: **APPROVED_DESIGN_APPLIED / FORMAL_RESULT_REVIEW_PENDING**. 2026-10-13 10:02:27 KST 사용자 요청으로 승인 STEP5C/STEP6 범위의 실제 보드 규칙·진입/템플릿·최소 Guard/관련 tests·범위 검증과 integration base PR 제출을 명시 허용했다. 핵심 판단 재수행/별도 사후 감사 없음.
- STEP7A2 **REVIEW_PENDING**; 사용자 정식 결과 최종 검토·완료/병합/main/7A3 이후는 별도 게이트. 실제 게임/DB/browser/audio/두 client/성능/운영 행동 **NOT_RUN**, 실행/운영 **UNKNOWN**·구현/실행/오픈 후속 의무 유지.
- 기준/착수 integration `41c5b167e19a55095ea57732527a6947b48e7efe`, PR419 merge. STEP7A1 COMPLETED/FORMAL_RESULT_APPROVED/INTEGRATION_MERGED 및 STEP6 COMPLETED/DESIGN_RESULT_APPROVED/TARGET_FROZEN/INTEGRATION_MERGED 유지. CP0092의 OPEN/미병합과 이전 산출물의 REVIEW_PENDING은 당시 이력이다.
- branch `docs/game-platform-vnext-phase7a2-board-rules`, PR base `feature/game-platform-vnext-integration`. 최종 head/tree/PR 번호·원격 read-back/CI는 제출 뒤 실제 PR/Git에서 보고한다. integration/main 직접 commit·병합 없음.
- [계획 원본](game-platform-vnext-step7a2-plan-and-handoff.md)의 bytes/identity/hash·승인 STEP1~6/STEP7A1 artifacts·계획/DECISIONS/과거 checkpoint·기존 소비자 보존.

## 1. 실제 복원과 입력 identity

AGENTS→계획1.5→rebuild README→CURRENT→CP0092→실제 PR419/Git을 복원했다. 최신 integration은 기준 SHA와 동일, 추가 변경0. PR419 merged=true/merge `41c5b167e19a55095ea57732527a6947b48e7efe`, 승인 대상 head `bc4e9f6559cd12bc215d409105ccc2e921d99b46`, 최종 head `f3f8ca96b1063efe1d46bc381efa3cafd762eddc`, merge/final tree `7109d1c27c6b26aafcf72cc68120d49028481cf9` 및 실제 부모 일치 증거를 재사용했다. CP0092 OPEN/미병합은 당시 이력이다. 유효 미완료7A2 branch/PR 없음 확인 후 별도 branch를 기준 integration에서 생성했다. main `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09` 유지.

계획 Library identity `libfile_4be521fe377c81918761e14ef1a27888` / file `file_0000000040a482099f4fea75f097c5b3` / version0, 29,262bytes, SHA256 `6b0f888fb09617f17390a153f161e50e9593d5d9ec8e5ac284a12b0d99d4ebb3`를 실제 원본 전체 읽기로 확인하고 artifacts에 exact bytes 보존했다. §9 프롬프트 존재 자체를 허용으로 간주하지 않고 현재 사용자 명시 요청을 적용했다. 계획은 계획 당시 상태/금지/프롬프트를 유지한다.

승인 STEP6 Target/§12 실제 전수표·기존 source trace 및 STEP5C B01~12/조건, STEP7A1 실제 owner·현재 Guard 심볼을 재사용했다. mapping 보조 데이터는 승인 정식 표의 ID/목적지/지정범위·원fields와 대조한 후 사용했으며 승인 정식 표가 우선이다. 원문을 자동 재분류하거나 new Target로 메우지 않았다. BO3 모델 의무는 직접 BO행0이라도 정확한 참조 본문으로 적용한다. B08 요약의DEV271 오기를 STEP6 정정대로 DEV271/DEV251 두 원문 의미로 구별한다.

## 2. 승인 본문 → 실제 반영

| 승인 입력 / 책임 | 실제 적용 위치 | 원문·scope 보존 |
|---|---|---|
| STEP6 §2 BO1 / B01~02 | [BO1](../../../docs/game-platform-board-rules.md) /5 ID/f | 실제 출처/구성물·공개 보드 조건; CO1 일반권리 참조 |
| BO2 / B03 | BO2 /8 ID/f + CO4/MO3/CO2 | 예시I/허용강도/웹adaptation과 기록분할 |
| BO3 / B06~08·10 / STEP6 §4 | BO3→MO/LI/원 DB·development | 모델 독립본문 복제0; online 미지원/안전11/A-C-P/hostless 조건·재대결 유지 |
| BO4 / B05·09·11 | BO4 /13 ID/f + CO/MO/CA/GV | 실제 구성물/행동의 추가관측·없는승자/턴강제금지·manualgate/여섯중복 참조 |
| STEP6 §6.2/6.3 / D2 | AR2/AR4·진입/네템플릿/GV·최소Guard | GP-GENRE-BOARD/1와정확한owner·기존 consumer 제외; RT7A3 발견 유지 |
| 전수 source/ID/f/원조건 | [실제 대응](step-7a2-clause-correspondence.md) | 원3232/305/16행58분할/49·LHI 비승격 및 후속전체의미검토 경계 |

## 3. 최소 source 연결과 미변경 경계

| source 심볼 / 위치 | 실제 변경·검사 의미 |
|---|---|
| `VNEXT_POLICY_DOCUMENTS` / `VNEXT_BOARD_PATH` | 승인된 BO 경로·revision/BO1~4만 canonical 하위 owner로 연결. 경쟁 CURRENT의 포괄 허용 없음 |
| `validateVnextDocumentAuthority` | BO의 CO/LI/MO/CA/GV/DB reference 및 진입/네템플릿의 실제BO 참조, 상위의 실제 owner 발견·RT 승인내용 보존 |
| `referencesPolicyDocument` | 기존 상대Markdown/fullpath해석 재사용; 새참조검사 연결만 |
| `validatePlatformDocumentPolicy` | 기존공통규칙·게임별가이드/legacy/보안·checkpoint 적용 유지. canonical BO는 같은scope의 승인하위owner로 인정 |
| `validateRepositoryState` / `validatePullRequestChanges` | 기존runtime/Registry/네문서/onlineDB·vNext model-oracle 미지원 admission과base/head검사 무변경 |
| `vnextPolicyDocuments` 및8개 신규관련test | 실제BO fixture, 부재/필수절/원revision/scope/한owner·템플릿/장르발견·online안전 반례 |
| AR2/AR4·기존진입/템플릿/GV | BO 실제본문 연결·보드조건부 질문. 기존규범본문/네문서 역할 유지 |

full nestedshared/serverroot/import/배포제외/test발견/oracle/exports는7B, RT본문7A3·runtime/모델/backend/API/SQL/H1~3구현·실제행동시험은 후속이다. workflow/package/기존shared barrel·Registry·소스/SQL·원본과과거checkpoint는 변경하지 않는다. 전체source/SQL감사·외부재조사·공급자/운영재결정·Astra재판단/별도사후감사 없음.

## 4. 고정 입력 trace

| 고정 계획기준 source | blob |
|---|---|
| [game_platform_vnext_final_execution_plan.md](https://github.com/limbit95/limbit95.github.io/blob/41c5b167e19a55095ea57732527a6947b48e7efe/game_platform_vnext_final_execution_plan.md) | `da353e2e64daef6b1b0b7267c21997bfd7cda4ed` |
| [docs/game-platform-rebuild/artifacts/step-6-target-architecture.md](https://github.com/limbit95/limbit95.github.io/blob/41c5b167e19a55095ea57732527a6947b48e7efe/docs/game-platform-rebuild/artifacts/step-6-target-architecture.md) | `4c12e5a5ce88aa7ea71a83c7180ad34aec1c1a12` |
| [docs/game-platform-rebuild/artifacts/step-6-clause-destinations.md](https://github.com/limbit95/limbit95.github.io/blob/41c5b167e19a55095ea57732527a6947b48e7efe/docs/game-platform-rebuild/artifacts/step-6-clause-destinations.md) | `b53d557d41b8cd09827ae98ebe68a376b4040e01` |
| [docs/game-platform-rebuild/artifacts/step-6-source-trace.md](https://github.com/limbit95/limbit95.github.io/blob/41c5b167e19a55095ea57732527a6947b48e7efe/docs/game-platform-rebuild/artifacts/step-6-source-trace.md) | `e7ccd8a02bd78b30350cabd99879cfcef86a862a` |
| [docs/game-platform-rebuild/artifacts/step-6-slices-and-verification.md](https://github.com/limbit95/limbit95.github.io/blob/41c5b167e19a55095ea57732527a6947b48e7efe/docs/game-platform-rebuild/artifacts/step-6-slices-and-verification.md) | `000a87c4dbd249d8266c583196d3b43d31e3f83c` |
| [docs/game-platform-rebuild/artifacts/step-5c-board-rule-succession.md](https://github.com/limbit95/limbit95.github.io/blob/41c5b167e19a55095ea57732527a6947b48e7efe/docs/game-platform-rebuild/artifacts/step-5c-board-rule-succession.md) | `a788db771b8cc26d4d7896a346b00bac12cd085b` |
| [docs/game-platform-architecture.md](https://github.com/limbit95/limbit95.github.io/blob/41c5b167e19a55095ea57732527a6947b48e7efe/docs/game-platform-architecture.md) | `84751f9330327716f8d1760261d08d5b7220ecd3` |
| [scripts/check-game-platform-governance.mjs](https://github.com/limbit95/limbit95.github.io/blob/41c5b167e19a55095ea57732527a6947b48e7efe/scripts/check-game-platform-governance.mjs) | `10ad5d5fee00941f6937485f0a2192554da1dd00` |
| [tests/game-platform-governance.test.js](https://github.com/limbit95/limbit95.github.io/blob/41c5b167e19a55095ea57732527a6947b48e7efe/tests/game-platform-governance.test.js) | `482e0b326313bf27149b601bc4f1441099b48f0f` |
| [games/shared/registry.js](https://github.com/limbit95/limbit95.github.io/blob/41c5b167e19a55095ea57732527a6947b48e7efe/games/shared/registry.js) | `afa4ba25824157534eca7ca7538b89571cfca30e` |

원문 ID/f별 이전 source 절/줄·blob은 correspondence에 보존한다. 실제 변경 뒤 최종 blob/줄과 diff는 제출 PR에서 조회 가능하며 반영전 blob과 혼용하지 않는다. 승인 문서의 PROPOSED/REVIEW_PENDING은 당시 이력으로 보존한다.

STEP1 조항표의 원문 cell은 HTML entity/행바꿈 <br>/표 pipe escape를 사용할 수 있다. original_text SHA256은 이 승인된 표 표현 그대로의 hash이고 source blob은 실제 파일 bytes의 identity다. 실제 줄 대조에는 표 표현의 entity/행바꿈/pipe만 복원하며 조건·본문을 바꾸지 않았다. 두 hash의 의미를 혼용하지 않는다.
