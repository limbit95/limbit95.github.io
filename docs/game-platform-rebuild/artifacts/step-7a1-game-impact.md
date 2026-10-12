# STEP7A1 — Registry 전수 영향도

- 상태: STEP7A1 **REVIEW_PENDING / FORMAL_RESULT_REVIEW_PENDING**. 사용자 요청으로 승인 STEP6 문서/진입/최소Guard·관련테스트와 범위검증/PR제출만 반영했다. 최종결과승인·COMPLETED·병합·main·7A2이후는 미수행.
- 기준 `90f14ceb3e609267aa559980994a07eacb0160f3`, branch `docs/game-platform-vnext-phase7a1-common-rules`, PR base integration. STEP6 COMPLETED/DESIGN_RESULT_APPROVED/TARGET_FROZEN/INTEGRATION_MERGED. 승인 원본/STEP6 artifacts/계획/DECISIONS/과거checkpoint 보존.
- 문서/Guard검사와 실제게임/DB/browser/audio/두client/성능/운영을 구분한다. 행동 **NOT_RUN**, 운영/실행 **UNKNOWN**·구현/실행/오픈 의무 유지.

## 실제 범위·판정 의미

Registry는5개 entry이며 platform-native/shared는2개다. 아래 COMPLIANT는 **이번 권위/정책/Guard diff와의 호환·기존scope 보존**이다. gameplay/API/SQL 회귀·production지원PASS를 뜻하지 않는다. Registry/metadata/shared barrel/모든기존게임파일은변경하지 않았다. 기존GAME_SPEC에는 신규GP-COMMON/1선언이없어 기존계약/DB검사/네문서조건을유지한다.

| entry | 실제 platform/개발상태 | 분류 | 근거·이번 변경 영향 | 남은 실행 의무 |
|---|---|---|---|---|
| cant-stop | shared / RELEASED | COMPLIANT | 기존metadata/href·Auth/import/API·네문서·DBtestfile불변. 신규scope가아니므로기존rulebook/검사유지; 실제Guard에서기존해당검사통과 | 실제게임/DB/browser회귀NOT_RUN |
| no-thanks | shared / RELEASE_CANDIDATE | COMPLIANT | 동일무이관/원baseline·유효override·등록/DB검사보존. 새템플릿을기존네문서에복사하지않음; 실제Guard통과 | release이전원래의무·실제게임/DB/browser회귀NOT_RUN |
| liar | legacy | NOT_APPLICABLE | 플랫폼신규문서scope의대상아님, legacy루트/SQL/API불변 | 원래검증의무유지 |
| the-game | legacy | NOT_APPLICABLE | 동일legacy보호, BGM본체·게임트랙/초기값변경없음 | browser/audioNOT_RUN |
| marble | legacy | NOT_APPLICABLE | 동일legacy보호, 기존게임소스·Auth·API불변 | 원래실행의무유지 |

MIGRATION_REQUIRED는 이번diff에서 발견하지 않았다. 발견시 기존게임을수정해맞추는대신 vNext규칙/Guard scope침범만반환한다. 기존shared consumer의상태는실제DEVELOPMENT에서읽었으며 IN_PROGRESS/RELEASED를추측하지 않았다. 현재Registry값만보고vNext지원완료를판정하지 않는다.

## 원격/고정 source 근거

`games/shared/registry.js`, `games/shared/index.js`, `games/cant-stop/*`, `games/no-thanks/*`, 해당DBtest·Auth/SQL루트의 blob은 기준tree와동일하게보존한다. 실제 Guard는현재Registry·실제네문서·경로/href·DBtest발견을사용했다. UI baseline/유효override/manualgate·기존회원인가/서버권위/재대결의무를검사조건에서삭제하지 않았다. 원격전체tree에서허용diff밖blob불변을제출뒤확인한다.
