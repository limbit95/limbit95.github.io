# STEP7B — 기존 Registry 전수 영향도

- 지위: **APPROVED_TARGET_APPLIED / FORMAL_RESULT_REVIEW_PENDING**. 2026-10-13 14:59:28 KST 사용자 요청은 승인 범위의 탐지/Guard·최소 import/정적 공개 경계 검사·기존 CI 연결·관련 tests·공통 모듈 안내·필요 기록 및 integration base 검토 PR 제출을 명시 허용했다.
- STEP7B **REVIEW_PENDING**. 사용자 정식 결과 최종 검토·완료 기록·해당 PR 병합·main·7C 이후는 별도다. 실제 게임/DB/browser/audio/두 client/성능/운영 **NOT_RUN**, 실행/운영 **UNKNOWN**·구현/실행/오픈 의무 유지.
- 착수 integration f65537f0226457857b2084fd0a2c2d21d02c0804, tree31b9b8f13a66c81f60d09f39675ac61e26673674. PR421 merge/parents/final tree/ref를 재사용 확인했고 기준 뒤 새 변경0. STEP7A3 완료/정식 승인/병합·STEP6 승인/동결·7A1/7A2 완료/병합 유지. CP0096 OPEN/미병합은 당시 이력이다.
- branch chore/game-platform-vnext-phase7b-discovery-module-guide / PR base feature/game-platform-vnext-integration. actual head/tree/PR/CI와 원격 read-back은 최종 PR/Git에서 확인한다. integration/main 직접 commit·병합 없음.
- [계획 실제 원본](game-platform-vnext-step7b-plan-and-handoff.md) 전체를 읽고 exact bytes/identity/hash를 보존했다. 승인 STEP6 [Target](step-6-target-architecture.md) §2/4/6·[D4/검증](step-6-slices-and-verification.md), 관련 전수 ID/f·STEP5A~5C/7A1~3 규칙/trace와 유효 결정이 우선한다. 과거 REVIEW_PENDING/HOLD/미병합을 현재 미승인으로 오해하지 않는다. 새 Target/상위 완화/hostless 재대결 예외/별도 사후 감사 없음.

## 1. 현재 Registry와 근거

Registry5 entry를 현재 source로 대조했다. 기존 metadata·shared/index·game-local 네 문서·게임/Auth/API/SQL는 이 작업에서 변경하지 않는다. 신규 vNext import/Platform contract/model 선택을 기존 consumer에 강제하지 않는다. 선언 모델이 없는 신규 runtime을 엄격히 거부하는 변경과 기존 legacy scope는 구별된다.

| entry / platform | 분류 | 현재 증거·영향 |
|---|---|---|
| cant-stop / shared | COMPLIANT | 기존 barrel/flat shared·Registry href·DB test/네 문서 scope 유지. vNext 선택/import 없음. 변경 Guard·기존 계약/링크 unit 확인. 게임 실행 지원/회귀 PASS 아님 |
| no-thanks / shared | COMPLIANT | 기존 import/API/SQL/Registry 및 DB/네 문서 baseline/override 유지. 신규 oracle 차단은 미선언 기존 consumer에 적용하지 않음. 기존 계약/링크 unit 확인 |
| liar / legacy | NOT_APPLICABLE | 현 Registry/legacy root·API/문서 무이관. 경계 검사는 미래server import 유입만 차단하며 장르/모델 선택 강제 없음 |
| the-game / legacy | NOT_APPLICABLE | 현 runtime/SQL/기존 BGM owner 보존. 검사/안내 변경으로 기존 presentation을 바꾸지 않음 |
| marble / legacy | NOT_APPLICABLE | 현 Registry와 runtime/SQL 보호. vNext code와 legacy 혼합 diff 제한 유지 |

이번 허용 diff에서 MIGRATION_REQUIRED0. 이는 실제 게임/DB/browser/audio/두 client/성능/운영 실행 검증이 아니며 모두 NOT_RUN·UNKNOWN과 후속 의무를 유지한다. 실제 충돌이 생기면 기존게임이관 대신 vNext격리/scope 침범만 반환한다. Registry수/ID목록을 공통규칙/공통테스트의 미래고정목록으로 만들지 않는다.
