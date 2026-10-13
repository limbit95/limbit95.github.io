# STEP7A2 — Registry 전수 적용 영향도

- 지위: **APPROVED_DESIGN_APPLIED / FORMAL_RESULT_REVIEW_PENDING**. 2026-10-13 10:02:27 KST 사용자 요청으로 승인 STEP5C/STEP6 범위의 실제 보드 규칙·진입/템플릿·최소 Guard/관련 tests·범위 검증과 integration base PR 제출을 명시 허용했다. 핵심 판단 재수행/별도 사후 감사 없음.
- STEP7A2 **REVIEW_PENDING**; 사용자 정식 결과 최종 검토·완료/병합/main/7A3 이후는 별도 게이트. 실제 게임/DB/browser/audio/두 client/성능/운영 행동 **NOT_RUN**, 실행/운영 **UNKNOWN**·구현/실행/오픈 후속 의무 유지.
- 기준/착수 integration `41c5b167e19a55095ea57732527a6947b48e7efe`, PR419 merge. STEP7A1 COMPLETED/FORMAL_RESULT_APPROVED/INTEGRATION_MERGED 및 STEP6 COMPLETED/DESIGN_RESULT_APPROVED/TARGET_FROZEN/INTEGRATION_MERGED 유지. CP0092의 OPEN/미병합과 이전 산출물의 REVIEW_PENDING은 당시 이력이다.
- branch `docs/game-platform-vnext-phase7a2-board-rules`, PR base `feature/game-platform-vnext-integration`. 최종 head/tree/PR 번호·원격 read-back/CI는 제출 뒤 실제 PR/Git에서 보고한다. integration/main 직접 commit·병합 없음.
- [계획 원본](game-platform-vnext-step7a2-plan-and-handoff.md)의 bytes/identity/hash·승인 STEP1~6/STEP7A1 artifacts·계획/DECISIONS/과거 checkpoint·기존 소비자 보존.

이번 분류는 보드 문서/진입/최소 Guard diff의 정책·계약 scope 영향이다. 실제 게임 회귀/production 지원 PASS가 아니다. 단일 Registry [source](https://github.com/limbit95/limbit95.github.io/blob/41c5b167e19a55095ea57732527a6947b48e7efe/games/shared/registry.js)와 game-local DEVELOPMENT의 기존 상태/원칙을 읽고 기존 영향 근거를 재사용했다. 새로운 metadata 목록을 만들지 않았다.

| 실제 Registry consumer | 기존 상태/범위 | 이번 영향 | 근거 / 남은 의무 |
|---|---|---|---|
| cant-stop | shared/platform-native; RELEASED | COMPLIANT | 기존 development/UI/DB/네 문서 scope 유지. 게임/Registry/SQL/API/shared blob 무변경, vNext 미선택 기존게임 admission 동일. RELEASED 후속 migration 필요 없음(이번 diff 범위). 실제 행동 NOT_RUN |
| no-thanks | shared/platform-native; RELEASE_CANDIDATE | COMPLIANT | 기존 release-candidate·네 문서/DB 검사·consumer scope 유지. vNext 보드 계약을 기존 파일에 강제하지 않음. 게임/SQL/shared blob 무변경. 실제 행동 NOT_RUN |
| liar | legacy | NOT_APPLICABLE | vNext BO 적용 아님, legacy 보호/코드 무변경 |
| the-game | legacy | NOT_APPLICABLE | 기존 game-local 연출/BGM/게임 scope를 새 보드 MUST로 승격하지 않음 |
| marble | legacy | NOT_APPLICABLE | legacy 보호/원경로/메타데이터 무변경 |

현재 Registry 5entry 중 platform-native/shared 2개를 빠짐없이 분류했다. MIGRATION_REQUIRED 발견 없음. 발견될 경우 기존 게임을 수정해 닫지 않고 해당 vNext 침범/owner/scope/Guard 영향만 반환한다. 게임별 UI/정책 값을 공통 rulebook에 복제하지 않았다. actual Registry와 전체 protected blobs의 불변은 문서 검증과 원격 tree 대조로 확인한다.
