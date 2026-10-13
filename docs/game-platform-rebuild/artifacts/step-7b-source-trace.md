# STEP7B — 원본·현재 source와 범위 trace

- 지위: **APPROVED_TARGET_APPLIED / FORMAL_RESULT_REVIEW_PENDING**. 2026-10-13 14:59:28 KST 사용자 요청은 승인 범위의 탐지/Guard·최소 import/정적 공개 경계 검사·기존 CI 연결·관련 tests·공통 모듈 안내·필요 기록 및 integration base 검토 PR 제출을 명시 허용했다.
- STEP7B **REVIEW_PENDING**. 사용자 정식 결과 최종 검토·완료 기록·해당 PR 병합·main·7C 이후는 별도다. 실제 게임/DB/browser/audio/두 client/성능/운영 **NOT_RUN**, 실행/운영 **UNKNOWN**·구현/실행/오픈 의무 유지.
- 착수 integration f65537f0226457857b2084fd0a2c2d21d02c0804, tree31b9b8f13a66c81f60d09f39675ac61e26673674. PR421 merge/parents/final tree/ref를 재사용 확인했고 기준 뒤 새 변경0. STEP7A3 완료/정식 승인/병합·STEP6 승인/동결·7A1/7A2 완료/병합 유지. CP0096 OPEN/미병합은 당시 이력이다.
- branch chore/game-platform-vnext-phase7b-discovery-module-guide / PR base feature/game-platform-vnext-integration. actual head/tree/PR/CI와 원격 read-back은 최종 PR/Git에서 확인한다. integration/main 직접 commit·병합 없음.
- [계획 실제 원본](game-platform-vnext-step7b-plan-and-handoff.md) 전체를 읽고 exact bytes/identity/hash를 보존했다. 승인 STEP6 [Target](step-6-target-architecture.md) §2/4/6·[D4/검증](step-6-slices-and-verification.md), 관련 전수 ID/f·STEP5A~5C/7A1~3 규칙/trace와 유효 결정이 우선한다. 과거 REVIEW_PENDING/HOLD/미병합을 현재 미승인으로 오해하지 않는다. 새 Target/상위 완화/hostless 재대결 예외/별도 사후 감사 없음.

## 1. 입력 원본과 재사용

계획 Library identity libfile_db88166a27c0819180614afeb6d4725e / file_00000000eb948209a7c9f325612ea978 / path /청파 같이/game-platform-vnext-step7b-plan-and-handoff.md. Library full read249/249행·has_more=false, API version 미반환(추정하지 않음). exact32,318bytes / SHA256 01cc8a20685b25ec19c1b6697a5fb7a1884b544afeb939ff2ba144b015a84c77. 원본 시점의 계획/금지 문구는 이력이며 현재 허용은 이 artifact 헤더/현재기록을 따른다. 원본을 승인판단표로 재작성하지 않았다.

STEP6 전수 입력/trace와 승인 STEP1~5C·STEP7A1~3 대응·실제규칙을 재사용했다. 실제 추가읽기는 현재 Guard/CI·build/import/static 자료와 안내의 exports/정리 owner 공백, 시험 실행에 필요한 고정 test dependency bytes다. SQL 의무를 다시 판단하거나 전체source/SQL감사·legacy운영 정의 확인·외부 공급자/운영 재조사하지 않았다.

## 2. 고정 source identity

| 고정 source | blob |
|---|---|
| [AGENTS.md](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/AGENTS.md) | `16e9ab3d7c7c3f161ec685294a727e7e761e13e2` |
| [game_platform_vnext_final_execution_plan.md](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/game_platform_vnext_final_execution_plan.md) | `da353e2e64daef6b1b0b7267c21997bfd7cda4ed` |
| [docs/game-platform-rebuild/CURRENT.md](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/docs/game-platform-rebuild/CURRENT.md) | `eb6f0f787a26a4356f0f4835ff7631efc980724d` |
| [docs/game-platform-rebuild/checkpoints/CP-0096-step-7a3-result-approved.md](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/docs/game-platform-rebuild/checkpoints/CP-0096-step-7a3-result-approved.md) | `196eb71855ea5642416de97f59b0410a1b728ea4` |
| [docs/game-platform-rebuild/artifacts/step-6-target-architecture.md](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/docs/game-platform-rebuild/artifacts/step-6-target-architecture.md) | `4c12e5a5ce88aa7ea71a83c7180ad34aec1c1a12` |
| [docs/game-platform-rebuild/artifacts/step-6-slices-and-verification.md](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/docs/game-platform-rebuild/artifacts/step-6-slices-and-verification.md) | `000a87c4dbd249d8266c583196d3b43d31e3f83c` |
| [docs/game-platform-rebuild/artifacts/step-6-clause-destinations.md](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/docs/game-platform-rebuild/artifacts/step-6-clause-destinations.md) | `b53d557d41b8cd09827ae98ebe68a376b4040e01` |
| [docs/game-platform-rebuild/artifacts/step-5a-common-module-selection.md](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/docs/game-platform-rebuild/artifacts/step-5a-common-module-selection.md) | `e80d67aa5a3fa74ffcd441fa977fd4755d6d4c85` |
| [docs/game-platform-rebuild/artifacts/step-5a-compatibility-lifetime-verification.md](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/docs/game-platform-rebuild/artifacts/step-5a-compatibility-lifetime-verification.md) | `fb2fa919c12905153360209bb692a3adc626a42c` |
| [docs/game-platform-rebuild/artifacts/step-5a-duplication-prevention.md](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/docs/game-platform-rebuild/artifacts/step-5a-duplication-prevention.md) | `f43b06d3b728258789534a4d401132d3b0461cd7` |
| [docs/game-platform-rebuild/DECISIONS.md](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/docs/game-platform-rebuild/DECISIONS.md) | `ab4896bd01b591895d0e30946a810c41eaa74e5a` |
| [games/shared/index.js](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/games/shared/index.js) | `96041e478da57e87f3248be1e1d539e8dbdd6939` |
| [games/shared/registry.js](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/games/shared/registry.js) | `afa4ba25824157534eca7ca7538b89571cfca30e` |
| [games/shared/accessGate.js](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/games/shared/accessGate.js) | `4803cd8fd141c98d97bd6357243a9f955843d6cc` |
| [games/shared/roomLobbyContract.js](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/games/shared/roomLobbyContract.js) | `4d037bd1b56715aae631220d1c848bc521a56ce0` |
| [games/shared/actionContract.js](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/games/shared/actionContract.js) | `93ff86e5a83073f6cd88ee7555fb171caf467443` |
| [games/shared/snapshotCoordinator.js](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/games/shared/snapshotCoordinator.js) | `069f49aa23cfb2c5d591cafaed523fa358c78ba1` |
| [games/shared/reconnectRefresh.js](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/games/shared/reconnectRefresh.js) | `f96be29314ae0079c0f5db9ba9c9e8cbfb7934e4` |
| [games/shared/gameInvite.js](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/games/shared/gameInvite.js) | `4d4b667e85162b19fb4e1607bfcc094a1bd4556d` |
| [js/invites/inviteRegistry.js](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/js/invites/inviteRegistry.js) | `0c2c8473656245ac3990a8d97868647ec60485bf` |
| [js/invites/inviteShare.js](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/js/invites/inviteShare.js) | `f1d370c83cbcbcabcf405b3544e3ba1129d69203` |
| [js/game-audio/bgmController.js](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/js/game-audio/bgmController.js) | `4757a1de3477dbebe44f2dd49b7071eb8b03d9c2` |
| [js/game-audio/bgmPlayer.js](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/js/game-audio/bgmPlayer.js) | `c7c8f07187c7450bff4ff7256b37227a3ee0e86c` |
| [scripts/check-game-platform-governance.mjs](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/scripts/check-game-platform-governance.mjs) | `0e2081c7ca7ab3293d0b5717e45307c5c5eca98b` |
| [scripts/build-community-assets.mjs](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/scripts/build-community-assets.mjs) | `a863b954ac20a1c1d77f0b0892373cfd51901d9e` |
| [scripts/check-community-modules.mjs](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/scripts/check-community-modules.mjs) | `2aafeebc1ab74087b1b6f30fc940355513f84535` |
| [.github/workflows/game-platform-governance.yml](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/.github/workflows/game-platform-governance.yml) | `984d2c36c506c2e51ba50765fe0b5d667c06f055` |
| [.github/workflows/site-static-checks.yml](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/.github/workflows/site-static-checks.yml) | `2cb746bda0ade2f2344a2a8e21f5a48148b10bb4` |
| [.github/workflows/community-hashed-assets.yml](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/.github/workflows/community-hashed-assets.yml) | `631471e0dbff3d813a9bcdd9107d8fc89190355b` |
| [.nojekyll](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/.nojekyll) | `8b137891791fe96927ad78e64b0aad7bded08bdc` |
| [package.json](https://github.com/limbit95/limbit95.github.io/blob/f65537f0226457857b2084fd0a2c2d21d02c0804/package.json) | `917a55aa474d98cc663364c5e7dab84ff6fe5cf1` |

주요 심볼: validatePullRequestChanges/validateRepositoryState/readPlatformPolicyDocuments/gameDirectoriesAtRef, 새로운 validateModelOracleConfiguration/validateModelOracleSelection/sourceModuleEdges/validateVnextBoundaries/runVnextBoundaryCheck. 실제 수행한 checker·기존 link checker를 위해 tracked browser bytes를 materialize했고 placeholder/synthetic 실제게임 목록을 쓰지 않았다. 단위 fixture는 별도 tests 안에만 있다.

## 3. 정적 공개 경계의 관찰·미확인

F: build-community-assets는 js/app.js browser bundle/metafile을 사용하며 기존 workflow는 생성된assets를commit한다. .nojekyll은 현재 존재한다. trackedworkflow에서 승인serverroot를 명시 제외한 배포pipeline 증거는 없다. hosting 실제설정·production artifact/loaded bytes는 이번에 확인/변경하지 않았다(U).

A: server root는 browser import/site assets/static 공개에 들어가면 안 된다. J를 새로 하지 않고 해당승인 요구를 기계화했다. F: 경계 helper는 현재 제외미확인 때문에 server tracked파일/산출물 존재를차단한다. 무비밀이라고 선언/ignoreflag로해제하지 않는다. 이 차단해제는후속실제배포경계/검사확보가선행해야하며7B지원완료로숨기지 않는다.

## 4. 보호와 남은 의무

원본·계획·DECISIONS·승인 artifacts/과거 CP·기존게임/Auth/API/SQL/Registry/barrel/네문서·LI/MO/CA/BO/RT본체 보호. AR/상위Target/기술선택 변경없음. 모델설정은빈상태. 테스트/API파일존재만으로행동PASS/오픈완료를표시하지않는다. CP0075/D0010·D0006~10·T01~03·H1~4·여섯중복/공개/Profile·B01~12/R01~13/안전11/hostless조건및전체후속의무를유지한다.
