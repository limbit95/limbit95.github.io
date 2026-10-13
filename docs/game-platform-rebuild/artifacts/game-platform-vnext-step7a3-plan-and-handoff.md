# Game Platform vNext STEP7A3 — 작업 계획과 Sol/Astra 인계

작성일: 2026-10-13 KST. 담당 Sol/Codex.
지위: **계획/인계 문서**. 사용자 “다음 단계에 대한 승인”에 따라 STEP7A3 준비를 진행한다. PR420 병합은 별도 명시 승인으로 구분되어 아직 실행하지 않았다. 이번 제출은 계획·분담·전달 프롬프트이며 실제 규칙/Guard·저장소 기록·branch/PR/checkpoint 변경·구현/시험을 시작한 결과가 아니다.

## 1. 현재 상태와 선행 조건

| 항목 | 확인 사실 / 구분 |
|---|---|
| 저장소 / integration | limbit95/limbit95.github.io / feature/game-platform-vnext-integration |
| 현재 integration SHA | 41c5b167e19a55095ea57732527a6947b48e7efe, 마지막 반영 STEP7A1 |
| STEP7A2 승인 대상 head | b1643c5b1d0ea86cd9ec5fef39a0e1ca996ce61a |
| 승인·완료 기록 포함 head | dff7feb3da1a265772d604468787efd91f54f15a |
| PR420 | OPEN / merged=false / base integration |
| STEP7A2 | COMPLETED / DESIGN_RESULT_APPROVED / FORMAL_RESULT_APPROVED / INTEGRATION_NOT_MERGED |
| STEP6 | COMPLETED / DESIGN_RESULT_APPROVED / TARGET_FROZEN / INTEGRATION_MERGED |
| STEP7A3 기록 | NOT_STARTED. 계획 준비와 실제 규칙 반영 착수 구별 |
| 행동 / 실행·운영 | NOT_RUN / UNKNOWN·구현/실행/오픈 후속 의무 유지 |
| 실제 반영 선행 | PR420 명시 병합 승인 → 실제 merge/부모/tree·integration ref 확인 → 최신 승인 integration에서 별도7A3 branch |
| 고정 입력 구분 | integration I=41c5b167…와 승인7A2 제출본 H=dff7feb… 구분. 미병합 제출본을 integration 반영으로 표시하지 않음 |

이후 실제 반영은 PR420의 실제 merge SHA를 새 기준으로 기록하고 승인 head/tree 보존을 확인한다. 아직 존재하지 않는 merge SHA를 추정하지 않는다. CP0094와 과거 산출물의 이력 상태는 실제 PR/Git과 함께 읽는다. main 별도 게이트 유지.

## 2. 목적과 적용 범위

**실시간 협동·공간형 게임에 필요한 승인 경험 규칙을 실제로 찾아 읽을 수 있는 하위 문서로 적용하는 단계**다. 새 게임·엔진을 만드는 단계가 아니다.

실행 계획1.5 STEP7A3, 승인 STEP6 Target §2/§4/§6.3, Slice D3를 따른다. 승인 경로 docs/game-platform-realtime-coop-rules.md, 필수절 RT1~6, 계약 식별 GP-GENRE-REALTIME-COOP/1. 장르와 실행 모델은 상속 계층이 아니다.

| 절 | 실제 반영할 승인 내용 | 조건/한계 |
|---|---|---|
| RT1 범위·출처 | 제한 실시간 협동·공간 경험, 승인 STEP5C/기존 출처 E01~03 | 단지2D/online이라는 이유로 적용하지 않음. 경쟁대전/전용물리/정밀리듬/3D/대규모세계 지원 선언 없음 |
| RT2 플랫폼·7축 | 공통→장르→네문서→실제 모델/Capability→검증, 실제7축/기능 상태 | 사용/비적용/미선택·미결정/미지원 구별. 장르명으로 기술 선택 확정 금지 |
| RT3 R01~13 | 지속 흐름·입력취소·공간/좌표·시간·비가시/복귀·역할/정보·시작/종료·복구·전체수명·잠정/공식결과·접근성·반응성·완료 주장 | 승인 owner/조건/미지원·후속 oracle 보존. 공통 권한/수명/복구의 독립 엔진 본문 금지 |
| RT4 네문서 | 제품/7축/취소/시간/지원, 기능진행, 초기VI/공간/조작 baseline, 유효후속결정 질문 | 파일명·책임·baseline/override/manualgate 유지, 기존 game-local 무이관 |
| RT5 검증 | 입력/공간/시간·안전11/A-C-P·수명/결과·모바일/성능·디자인·운영 검증 의무 | 문서/계약/실제두client/지원단말/운영활성화 구별, NOT_RUN/UNKNOWN 유지 |
| RT6 권위·확장 | owner 연결·둘째Probe 조건·혼합장르/신규 추가절차 | 한 의미 한owner. roomless 장르 선제필수화 금지 |

R01 행동시작/유지/중단/동시협동, R02 local intent 해제/취소와 원격 관측의 미선택, R03 viewport/camera 변화·좌표맥락, R04 render/input/simulation/physics/network/audio 시간분리, R05 비가시와 경기pause 구분, R06 표현과 전달권한 구분, R07 준비/인가/진행/terminal/detach·재대결, R08 단일모델 복구/입력준비, R09 전체완료/T01~03, R10 잠정피드백/정정·소비중복, R11 기능별조작/접근성, R12 local/권위반응 측정분리, R13 증거별완료를 모두 보존한다.

## 3. 재사용 입력과 새 확인

| 입력 | 재사용 | 해당 부분만 새 확인 |
|---|---|---|
| STEP5C realtime-coop-spatial-rules §5 | 최소6항목/R01~13·조건/owner/oracle·미선택/제한출처 | 실제 RT절 대응의 빠진 의미/참조 단절 |
| STEP5C genre-model-connections §6~8 | 둘째Probe·한owner·혼합/신규추가·보존 조건 | 실제 진입/템플릿의 경험/모델 혼동 |
| STEP6 Target/전수표/trace | RT경로/revision·원ID/f/부모/강도/조건·참조계승 | 관련 RT 목적지·공통/모델/보드 참조의 실제본문 대응. 새 목적지 선택 없음 |
| STEP6 request-traces/D3 | 실시간2D협동·roomless 요청의 코드없는추적·단계경계 | owner/장르발견·미지원 표시 연결 |
| STEP7A1/7A2 본문/대응/검증 | AR/CO/LI/MO/CA/BO/GV·기존소비자 격리 | PR420 반영 뒤 기준 delta·충돌만 |
| STEP1~3/DECISIONS·STEP4/5 승인 원문 | source blob/ID/문맥/선택축·안전/수명/운영 | 결론을바꿀 해당원문공백/충돌만. 유효 원문이 요약보다 우선 |
| Guard/tests·진입·네템플릿 | canonical owner/revision/절/scope·BO연결·online미지원 | RT 최소 심볼/테스트 연결만 |

동일blob/기존trace를 재사용한다. R01~13 설계를 다시 선택하지 않는다. 제품/cancel전달손실·시간공백·지원환경/표본·오차는 후속 구현/실행 전 구체화이며 이번 문서에서 임의 동결하지 않는다. 승인 원문으로 해결되지 않는 새 의미 충돌만 Astra/사용자에게 반환한다.

## 4. 단일 owner와 둘째 Probe

- 조사/권리/네문서/manualgate CO, 전체수명 LI, 인가/순서/복구/시간·입력 MO/선택backend, 기능/결과/공개 CA, 전파 GV를 참조한다.
- RT는 지속입력/공간/협동/중단·복귀·품질의 경험 요구와 적용 질문을 소유한다. 장르전용 Core/Auth/초대/BGM/집계·복구/수명 엔진을 재정의하지 않는다.
- BO와RT는 mode/phase/행동/역할별로 실제 적용한다. 같은상태의 권위/순서/종료충돌은 설정합집합/더엄격한쪽 선택으로 해결했다고 쓰지 않는다.
- 둘째Probe는 기반경험+local/비동기/기록형 모델조건을 기본으로 한다. 별도roomless장르/실제게임/보상·leaderboard를 선제선택하지 않는다. 새로운 경험 차이만 보완/신설절차로 넘긴다.
- 신규장르는 범위조사→적합성/차이→최소6항목→충돌검토→인덱스/네문서→허용구현/검증을 연결한다. 상위와장르마다공통절차를 독립복제하지 않는다.
- 현재 승인7A2 Guard는 BO까지 canonical owner로 인정한다. RT 반영의 필수절/revision/실체본문/참조/scope 검사는 같은 적용단위로 추가한다. 정확한diff는 T1에서 확인.
- full nestedshared/serverroot/import/배포제외/test발견/modeloracle/exports는7B, 신규vNextonline미지원/기존onlineDB검사는 유지한다.

## 5. 순서와 Sol/Astra 분담

| 작업/담당 | 목적·입력/범위 | 산출/완료 조건 | 다음 |
|---|---|---|---|
| 선행 병합 / Sol·Codex, 명시허용 뒤 | PR420 승인head·최종head·CI/base와 병합·실제parents/tree/ref 확인 | 최신 승인integration의 실제SHA, main변경없음 | T1 기준 |
| T1 / Sol·Codex | R01~13/최소6항목·관련원ID/f→RT/한owner·현재Guard/진입/consumer | 실제대응·최소diff·미지원/후속의무·정확한충돌행. 새판단없음 | 정상T3, 충돌만T2 |
| T2 / Astra, 새 의미충돌 때만 | 원문/R-ID/줄/f·owner·누락의미·현재consumer/Guard·영향 | 좁은해석/필요상위변경·사용자승인항목. 전체재판단/사후감사없음 | 승인delta만 |
| T3 / Sol·Codex | RT1~6·AR/진입/템플릿·최소Guard/관련tests 한PR | 원조건/제한/미확인·한owner/기존scope·BO/RT발견 보존 | T4 |
| T4 / Sol·Codex | 기계검사/의미대응·관련tests·실제state/base-head·Registry전수영향·원격read-back | 허용diff/원본/소비자불변·실제CI/미실행구별, REVIEW_PENDING | 사용자 최종검토 |

T1→T3→T4는 하나의 반영 작업이다. 정상 승인분에 별도evidence→Astra판단→재조사/사후감사를 추가하지 않는다. 문서/소프트웨어 owner와 작업모델을 구별한다.

## 6. 산출물·종료 조건·사용자 검토

1. 실제 RT1~6 문서와 R01~13/최소6항목·조건·미지원/후속관측 책임.
2. 승인원문절/R-ID·관련원ID/f→실제본문/공통·모델·BO/원owner 대응·source trace.
3. 실제 상위인덱스·네템플릿/필요진입·최소Guard/관련tests의 동일적용단위.
4. Registry모든platform-native영향도·문서/Guard검증·원격보존/미실행·필요현재기록.
5. 최신 승인integration base검토PR, STEP7A3 REVIEW_PENDING.

원본identity/bytes/hash·ID/f/R/부모/강도/부정/조건/예외·절/표/링크/한owner/scope/허용diff의 기계검사와 의미대응을 구별한다. 설명없는완화·참조단절0을 확인하되 카운트만으로 전체전수새규범본문/전수의미검토완료를 선언하지 않는다. 변경Guard 관련tests·실제repository/base-head Governance와원격read-back, CI실제상태를 보고한다.

사용자는 RT범위/R01~13·공통owner참조, 둘째Probe/혼합조건, 기존게임무이관, 문서/CI와실제행동미검증 구분을 검토한다. 모든코드/ID수작업대조를 요구하지 않는다. 정식결과승인/완료기록·integration병합·main·7B이후는 별도 요청이다.

## 7. 보존·미선택·실행 경계

기존 Auth/게임/API/SQL/Registry metadata/shared barrel/game-local네문서 무이관; baseline/유효override/manualgate; 승인STEP6 Target/원3232(K1198/L906/H562/I566)/305부모·16행58분할·L/H/I비승격·49/B01~12비전수표 유지.

STEP4A모든완료/late자원/T01~03; CP0075/D0010 current A/C/P·knownexpiry뒤새A금지·동일transaction lateC제한/실제C·freshP/retry·anchor·최초60초/terminal·부분대체; D0006~10성능/비용/기록/삭제/탈퇴/backup/복원/운영UNKNOWN 유지. 승인총100/판8·원격p95≤250ms·정상망각복구≤5초·모바일5기능과실제지원환경의적용범위를 임의완화하지 않고 새FPS/tick/p99/표본예산을 승인수치로추가하지 않는다.

단일Registry·단일모델최종채택/복구·Shell공통/local·BGM기존본체+내부최소수명/H1무보완연결보류·Invite identity/사이트handler/dialog H2~4; 공식결과/정정/producer-consumer/여섯중복/공개분리/Profile recipe; B01~12/R01~13·안전11/DB범위·초기hostless/재대결host불성립/미정조건 유지. 재대결예외 미승인. Room/host/DOM/winner/score/XP강제·재대결no-op/local우회·Adapter새엔진숨김·미래미선택전체blocker승격 금지.

R의취소/비가시·복귀/시간공백/roles·view/잠정·확정·전체완료를 보존한다. 공식E01~03은제한근거이며WCAG전면/브라우저지원인증이 아니다. 기존출처만재사용하며외부재조사·전체source/SQL감사·공급자/운영재결정·별도사후감사없음.

실제제품/게임/transport/renderer/tick/physics/prediction선택·runtime/모델/backend/API/SQL/H1~3구현, 실제게임/DB/browser/audio/두client/성능/운영시험·지원/오픈은 후속. 행동NOT_RUN·UNKNOWN·구현/실행/오픈의무 유지. 구매/문의/job/dump/복원·main·7B이후를 수행하지 않는다.

## 8. 고정 입력 trace

아래는 승인7A2 head dff7feb3da1a265772d604468787efd91f54f15a 기준 blob이다. 현재integration41c5b167…와 혼용하지 않는다. 승인artifact는동일이며 BO/Guard/템플릿/현재기록은7A2제출본에만반영됐다. 관련승인본문/D3/연결사실과기존trace를재사용했으며 새R설계/전수감사/실제시험없음.

| 승인 입력 / 고정head링크 | blob |
|---|---|
| [game_platform_vnext_final_execution_plan.md](https://github.com/limbit95/limbit95.github.io/blob/dff7feb3da1a265772d604468787efd91f54f15a/game_platform_vnext_final_execution_plan.md) | da353e2e64daef6b1b0b7267c21997bfd7cda4ed |
| [docs/game-platform-rebuild/artifacts/step-6-target-architecture.md](https://github.com/limbit95/limbit95.github.io/blob/dff7feb3da1a265772d604468787efd91f54f15a/docs/game-platform-rebuild/artifacts/step-6-target-architecture.md) | 4c12e5a5ce88aa7ea71a83c7180ad34aec1c1a12 |
| [docs/game-platform-rebuild/artifacts/step-6-clause-destinations.md](https://github.com/limbit95/limbit95.github.io/blob/dff7feb3da1a265772d604468787efd91f54f15a/docs/game-platform-rebuild/artifacts/step-6-clause-destinations.md) | b53d557d41b8cd09827ae98ebe68a376b4040e01 |
| [docs/game-platform-rebuild/artifacts/step-6-slices-and-verification.md](https://github.com/limbit95/limbit95.github.io/blob/dff7feb3da1a265772d604468787efd91f54f15a/docs/game-platform-rebuild/artifacts/step-6-slices-and-verification.md) | 000a87c4dbd249d8266c583196d3b43d31e3f83c |
| [docs/game-platform-rebuild/artifacts/step-5c-realtime-coop-spatial-rules.md](https://github.com/limbit95/limbit95.github.io/blob/dff7feb3da1a265772d604468787efd91f54f15a/docs/game-platform-rebuild/artifacts/step-5c-realtime-coop-spatial-rules.md) | 9c7108a2327c4ab89043b92211b165e2b0923600 |
| [docs/game-platform-rebuild/artifacts/step-5c-genre-model-connections.md](https://github.com/limbit95/limbit95.github.io/blob/dff7feb3da1a265772d604468787efd91f54f15a/docs/game-platform-rebuild/artifacts/step-5c-genre-model-connections.md) | 876b357defc488dd8890e8aa71244564568490f2 |
| [docs/game-platform-architecture.md](https://github.com/limbit95/limbit95.github.io/blob/dff7feb3da1a265772d604468787efd91f54f15a/docs/game-platform-architecture.md) | f9588ced795e83c7f135e8c00dddc615df4bab91 |
| [docs/game-platform-board-rules.md](https://github.com/limbit95/limbit95.github.io/blob/dff7feb3da1a265772d604468787efd91f54f15a/docs/game-platform-board-rules.md) | eb1437bc8fa5925ab7834542923de548610a14f9 |
| [scripts/check-game-platform-governance.mjs](https://github.com/limbit95/limbit95.github.io/blob/dff7feb3da1a265772d604468787efd91f54f15a/scripts/check-game-platform-governance.mjs) | 5eac0eddc1291edcd923aeb2655473203e258107 |
| [tests/game-platform-governance.test.js](https://github.com/limbit95/limbit95.github.io/blob/dff7feb3da1a265772d604468787efd91f54f15a/tests/game-platform-governance.test.js) | 67c74787c268e8f69d014cd89ff6d3e0feab1265 |
| [docs/game-platform-rebuild/checkpoints/CP-0094-step-7a2-result-approved.md](https://github.com/limbit95/limbit95.github.io/blob/dff7feb3da1a265772d604468787efd91f54f15a/docs/game-platform-rebuild/checkpoints/CP-0094-step-7a2-result-approved.md) | 1f8ff5291ad98c5ba1f2fd0d367a7e5f5ac09c48 |

## 9. 다음 첫 작업과 복사 가능한 전달 프롬프트

실제 반영의 다음첫작업은 **PR420 integration 병합·실제 확인**. 담당 Sol/Codex. 아래는 병합과7A3문서작업을 명시적으로 함께 허용할 때 사용할 문구다. 파일안의프롬프트자체는허용이아니다.

```text
PR #420을 integration에 병합하고 실제 반영을 확인한 뒤,
Game Platform vNext STEP7A3 — 첫 비보드 장르 규칙 반영을 진행해줘.
담당 Sol/Codex. 승인 STEP5C/STEP6 Target를 다시 판단하지 마.

game-platform-vnext-step7a3-plan-and-handoff.md 실제 원본 전체와
STEP5C realtime-coop-spatial-rules §5/R01~13·genre-model-connections §6~8,
STEP6 Target/전수ID/f/trace/D3, 승인STEP7A1/7A2 실제본문을 읽어줘.
저장소 limbit95/limbit95.github.io, integration feature/game-platform-vnext-integration.
계획 당시integration41c5b167e19a55095ea57732527a6947b48e7efe와
승인7A2 head b1643c5b1d0ea86cd9ec5fef39a0e1ca996ce61a,
최종기록 head dff7feb3da1a265772d604468787efd91f54f15a를 구별해줘.

이번 요청으로 PR420 integration 병합/확인과 승인범위7A3의실제문서·진입/템플릿·
필요최소Guard/관련tests·문서/Guard검증·integration base검토PR제출을 명시허용한다.
main·runtime/게임/모델/backend/API/SQL구현·실제게임/DB/browser/audio/두client/
성능/운영시험은 제외한다.

AGENTS→계획1.5→rebuild README→CURRENT→CP0094→PR420/Git을 복원해줘.
실제head/base/승인결과/CI를대조하고 새변경은승인입력과분리해줘.
새의미충돌없는승인최종head를integration에병합하고 실제merge parents/tree·
integration ref·승인head보존을확인해줘. 이미병합됐으면재병합하지마.
병합뒤실제SHA를7A3기준으로기록하고 STEP7A2 COMPLETED/FORMAL_RESULT_APPROVED/
INTEGRATION_MERGED·STEP6승인/동결·STEP7A1완료/병합을유지해줘.
CP0094 OPEN/미병합은당시이력으로보존해줘.

유효미완료7A3 branch/PR은이어가고없으면 최신승인integration에서
game-platform-vnext계보의별도phase7a3 branch로 integration base PR을 제출해줘.
integration/main 직접commit금지. T1준비→정상분T3→T4로이어가줘.
새충돌만 원문/R-ID/줄/f·예상owner·누락의미·현재Guard/consumer·영향으로
Astra/사용자에게반환해줘. 새Target/상위완화/hostless재대결예외를 임의선택하지마.
전면재판단·별도사후감사·조사→판단→재조사반복금지.

docs/game-platform-realtime-coop-rules.md RT1~6,
GP-GENRE-REALTIME-COOP/1과최소6항목/R01~13의실제본문을승인대로반영해줘.
범위/owner/조건/제한/미확인·후속oracle를보존하고 AR장르인덱스/필요진입·
네템플릿·RT필수절/실체본문/한owner참조/scope 최소Guard/관련tests를같이연결해줘.
BO실제발견과기존원문/승인artifact trace를보존해줘.
공통CO·전체수명LI·권한/순서/복구MO/backend·기능/결과/공개CA·전파GV를참조하고
장르전용권한/복구/수명/Core/초대/BGM/집계엔진본문을복제하지마.
둘째Probe는기반경험+실제local/async/기록조건을기본으로,
새경험차이없는roomless장르/새게임/보상·Profile를선제만들지마.
혼합/신규추가절차는단일owner로연결하고 장르명으로기술선택을동결하지마.

계획§7보존조건전체를유지해줘. 기존Auth/게임/API/SQL/Registry/shared/game-local네문서·
원본/승인STEP1~6/7A1/7A2artifacts·계획/DECISIONS/과거checkpoint보존.
관련원ID/f/R01~13→실제본문/공통·모델/BO/원owner대응을남기고
원3232/305부모·16행58분할·원강도/부정/조건/예외/f0/명시f를보존해줘.
L/H/I·49/B01~12를공통MUST/전수완료표로쓰지마.
STEP4A전체완료/T01~03,CP0075/D0010currentA/C/P·actualC/knownexpiry/lateC제한·
freshP/retry/anchor/최초60초/terminal/부분대체,D0006~10UNKNOWN,
단일Registry/단일adoption·복구/Shell-local/BGM H1/Invite H2~4,
결과정정/producer-consumer/여섯중복/공개분리/Profile recipe,
B01~12/R01~13/안전11/DB범위/hostless조건과미승인재대결예외금지를유지해줘.
전게임Room/host/DOM/winner/score/XP강제·재대결no-op/local/N/A우회·
Adapter새권한/순서/수명/token/audio엔진숨김·미래미선택전체blocker승격금지.
7B modeloracle/discovery전신규vNextonline미지원/기존onlineDB검사를제거하지마.
fullnestedshared/serverroot/import/배포제외/test발견/oracle/exports는7B로남겨줘.

기계검사(identity/bytes/hash·ID/f/R/부모/강도/조건·절/표/링크/한owner/scope/허용diff)와
의미대응을구별하고 관련Guard tests·실제repository/base-head검사·원격read-back을수행해줘.
Registry모든platform-native영향도/근거를남기고 MIGRATION_REQUIRED를기존게임이관으로닫지마.
실제CI상태만보고하고 행동NOT_RUN·UNKNOWN·구현/실행/오픈의무유지.
source/문서/CI성공을지원완료로쓰지마. 외부재조사·전수source/SQL감사·공급자/운영재결정·
별도사후감사없음.

실제PRbase/head·변경파일·원본/기존게임보존·문서/Guard검증·원격보존·미실행/후속의무를
보고하고 STEP7A3 REVIEW_PENDING으로제출뒤멈춰줘.
사용자검토문서/핵심항목을구체적으로보여주고 다음첫작업은정식결과최종검토하나.
7A3완료/최종승인·해당PR병합·main·7B이후·구현/실제행동시험·운영변경·
구매/문의/job/dump/복원은진행하지마.
```

이번 계획은 여기서 정지한다. PR420병합·실제7A3반영·저장소기록갱신·새branch/PR/checkpoint·구현/시험·main은실행하지않았다.
