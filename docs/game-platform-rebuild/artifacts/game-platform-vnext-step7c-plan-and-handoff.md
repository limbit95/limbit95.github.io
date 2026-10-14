# Game Platform vNext STEP7C — 최소 Core 계획과 작업 인계

- 작성: Sol/Codex, 2026-10-14. 다음 단계 요청: 14:05:08 KST.
- 이번 산출물: STEP7C 코드 작업을 위한 최소 범위·작업 순서·검증·Sol/Astra 분담.
- 지위: **PLAN_PREPARED / IMPLEMENTATION_NOT_STARTED**. 이 계획은 구현 결과·지원 인증·사용자 최종 승인 또는 상위 계약 변경이 아니다.
- 기준: integration feature/game-platform-vnext-integration @ **e57e1fe8f34aa557259bf288f30c59e226db8f6c**.
- 기존 STEP7B는 승인·병합 완료. 실제 모델/게임 행동 NOT_RUN·운영 UNKNOWN 및 후속 의무 유지.
- 이번에는 저장소 수정·새 branch/PR·Core 구현·테스트 실행을 하지 않았다. 계획 준비부터 착수하여 먼저 검토 가능한 결과를 만든 것이다.

## 1. 상태 복원

[PR422](https://github.com/limbit95/limbit95.github.io/pull/422)의 actual merged=true와 merge e57e1fe8f34aa557259bf288f30c59e226db8f6c를 다시 확인했다. 승인 결과 head2df7d78f55f800901f915e01c273fc876b0a316a와 기록 headddcdf779cc9e65f2c78c91c33b87dd06d2e0d26c를 구분한다. 병합 결과와 기록 head 파일 차이0 및 CP0098 integration 반영은 직전 실제 확인 증거를 재사용한다.

integration의 CURRENT는 아직 마지막 반영 STEP7A3/STEP7B INTEGRATION_NOT_MERGED를 적고 있다. 이는 병합 전 기록과 현재 Git 사이의 상태 차이다. 다음 허용된 STEP7C 작업에서 **현재 요약과 새 checkpoint만** STEP7B INTEGRATION_MERGED로 정합화하고, CP0098·과거 artifact는 당시 이력으로 보존한다. 실제 PR이 병합됐으므로 이 문구만으로 다시 병합하거나 준비 조건이 미충족이라고 판단하지 않는다.

STEP7C branch 검색에서 기존 phase7c 브랜치는 발견되지 않았다. 후속 실제 작업 시작 직전 다시 확인하고 없으면 위 integration에서 feature/game-platform-vnext-phase7c-core를 만든다. STEP7B의 종료된 branch를 Core 개발에 재사용하지 않는다. main을 비교·동기화하거나 변경하지 않는다.

## 2. STEP7C의 목적

실행 계획1.5 STEP7C는 **설계에서 확인된 필수 조립·실행 수명·등록 경계만 구현하는 코드 PR**이다. 승인 STEP6 I1의 조건은 전체 완료 경로/T01~03, 부분 초기화 실패·반복 dispose·늦은 자원과 기존 API 비변경이다.

쉽게 말해 서로 다른 실행의 작업·자원이 섞이지 않고, 종료된 실행의 늦은 완료가 새 실행을 바꾸지 않게 하는 최소 토대를 만든다. 특정 게임을 완성하거나 모든 모델의 상태·복구·권한을 해결하는 단계가 아니다.

| Core가 제공할 최소 책임 | 해당 owner에 남길 책임 |
|---|---|
| 실행 구성/identity와 기존 Registry 참조 연결 | 게임 metadata·site 공개 정책은 기존 Registry/site owner |
| 실행·작업·자원의 소유 수명, 무효화와 정리 | 모델의 session/match/view 의미·ordering·단일 최종 채택/복구 |
| 모델/consumer가 현재성 근거를 공급하는 명시적 연결점 | 실제 backend 인가·A/C/P·writer/sender·owner anchor |
| 조립 중 실패·반복 종료·late resource의 정리와 실패 관측 | 실제 Invite/BGM/Shell 내부 수명 보완 및 game-local UI/effect |

Room/host/턴/DOM/tick/점수/DB를 기본값으로 강제하지 않는다. 특정 게임 이름 분기·전역 currentRoom/currentMatch·전역 bus·만능 update loop·Profile 엔진·빈 모델 stub을 만들지 않는다.

## 3. 실제 읽은 근거와 재사용

필요한 범위만 읽었다. 루트 실행 계획의 integration/STEP7C/7D, 승인 Target §2.1/6.1, Slice I1/I2/I3 및 V-L/S/M/C, AR1·LI1~3, STEP4A 수명 §5~8, STEP5A Registry/공통 G1~G5·수명 owner, 기존 Registry/export와 games README STEP7B 안내를 참조했다. STEP7B 계획·CP0098·현재 PR/Git 증거도 연결했다.

전체 원문/SQL/기존 게임 source를 재감사하지 않았다. 기존 source/ID/f/보존 증거를 재사용한다. 상위 AR/LI/MO/CA의 거대한 계승 인용을 모두 새 의미 감사한 것으로 표시하지 않는다.

주요 경로:

- game_platform_vnext_final_execution_plan.md — STEP7C/7D, 단계별 PR 및 승인 경계
- docs/game-platform-rebuild/artifacts/step-6-target-architecture.md — §2.1/6.1
- docs/game-platform-rebuild/artifacts/step-6-slices-and-verification.md — I1 및 V-L/S/M/C
- docs/game-platform-lifetime-contract.md — LI1~3
- docs/game-platform-rebuild/artifacts/step-4a-lifetime-contract.md — §5~8 전체 완료/자원/T01~03
- docs/game-platform-rebuild/artifacts/step-5a-common-module-selection.md — G1~G5/Registry
- docs/game-platform-rebuild/artifacts/step-5a-compatibility-lifetime-verification.md — owner/수명
- games/shared/registry.js, games/shared/index.js, games/README.md
- scripts/check-game-platform-governance.mjs、scripts/check-game-platform-vnext-boundaries.mjs、tests/game-platform-vnext-model-oracles.json — 실제 작업 때 변경 관련 검사만 재확인

## 4. 구현 단위와 Sol/Astra 분담

소프트웨어 owner와 담당 모델은 다르다. 사용자 선호대로 일반 준비·구현·검증은 Sol/Codex, 고난도 충돌 해석·핵심 수명 판단은 Astra로 배정한다. 지금 별도 agent를 실행한 것은 아니다.

| 순서 / 담당 | 할 일 | 완료 조건 |
|---|---|---|
| T1 Sol/Codex | 승인 요구→최소 API/소유 범위/호출 흐름/관련 검사·test 대응 작성 | Core와 model/backend의 책임을 혼동하지 않고 실행/자원/등록 소유자가 각각 명시됨 |
| T2 Astra, 실제 충돌 때만 | 재진입·await/반영 시점·등록 교체·old disposer 등 승인 범위로 해소 불가능한 문제 판단 | 원문 ID/줄/f·승인 원문·현재 consumer·예상 owner·영향·최소 보완을 제시. 새 상위 의미는 사용자에 반환 |
| T3 Sol/Codex | 최소 Core·flat 계약 테스트·실제로 실행되는 최소 사용 예·모듈 안내 구현 | 필요한 파일만 생성. fixture 조립을 실제 게임/모델 지원으로 표시하지 않음 |
| T4 Sol/Codex | 관련 unit/기존 계약·Guard·공존/허용 diff·원격 CI 확인, integration base PR 제출 | STEP7C REVIEW_PENDING, 실제 수행/미실행·새 head/base/기존 consumer 영향도 기록 |
| T5 Astra | 제출본 최종 검토 | 승인된 I1/LI 의미 일치와 구현·tests·최소 범위 판단. 전체 설계/운영 재감사 없음 |

T1의 정상 구현 선택은 구현 담당이 해결한다. 단순 API 이름·파일명 선택 때문에 Astra의 재설계 승인을 반복 요구하지 않는다. 기존 public API 변경이나 상위 권한·수명 의미 변경이 필요하면 해당 구현을 멈추고 정확한 경계만 검토한다.

## 5. 최소 구현의 수용 조건

### 식별·조립·등록

기존 Registry의 getRegisteredGame 등 단일 metadata를 참조한다. Core에 같은 ID/title/href/capability의 두 번째 catalog를 만들지 않는다. 실행 구성은 metadata와 다른 책임으로 명시한다. 중복 식별과 미지원 조합을 거부하고, 등록을 교체한 뒤 old disposer가 새 등록을 제거하지 않게 한다.

실제 게임 등록/카탈로그 활성화가 없어도 Core의 격리된 조립 계약을 시험할 수 있다. 테스트용 metadata/model fixture는 production 등록/지원으로 보지 않는다. 실제 Core가 consumer에 연결될 때 필요한 계약/scope/revision은 유지한다.

### 완료 반영과 모델 연결

성공만이 아니라 error/null/finally/cleanup/leave/effect/후속 완료를 각각 owner 범위로 다룬다. callback 입구의 disposed 검사 하나나 room/version 비교만으로 충분하다고 주장하지 않는다.

await·재진입으로 검사 이후 맥락이 바뀔 수 있으면 실제 반영 직전 재검사 또는 동등한 일관성 근거가 필요하다. Core의 로컬 수명 검사와 모델의 현재성/순서/권한 조건을 별도로 연결한다. models 배열을 채우거나 기존 runtime/online 차단을 해제하지 않는다.

현재 consumer가 authoritative·authorized 재조회임을 명시적으로 재검증한 데이터는 STEP4A §6.1의 조건으로 채택 가능하다. 모든 이전 발행 데이터를 무조건 버리는 새 규칙을 만들지 않는다. 새 수명/permission label만 붙여 옛 private 결과를 재사용하는 것도 허용하지 않는다.

### 종료·자원

반영 권리를 먼저 무효화하고 자원을 정리한다. 종료 여부와 cleanup 완료/실패를 구분한다. 부분 초기화 실패 시 실제 획득 자원만 정리하며, 한 독립 자원 실패가 나머지 정리를 막지 않는다. 의존 자원은 필요한 순서를 지킨다.

반복 dispose는 관찰상 반복 안전해야 한다. 외부 cleanup이 멱등이라고 가정하지 않는다. dispose 뒤 늦게 얻은 자원은 old owner가 해제/격리하고 새 실행에 자동 부착하지 않는다. old cleanup/finally/leave가 새 작업·새 등록·site 공유자원을 제거하지 못한다. 취소 요청의 성공을 무효화 안전성의 전제로 삼지 않는다.

## 6. 의미 있는 계약 테스트

전 Cartesian product나 임의 반복 횟수를 강제하지 않는다. 의미가 다른 실패·전환 가지마다 결정적 deferred/fault case와 관측을 배정한다.

| 묶음 | 최소 관측 |
|---|---|
| T01 같은 대상 새 실행/Match | 이전 성공·오류·null·finally·effect가 새 상태/진행 표시를 변경하지 않음 |
| T02 A→B→A | 이름/ID가 다시 같아도 이전 A의 완료·정리가 새 A에 침범하지 않음 |
| T03 role/view/user 변경 | 이전 허용 정보·오류·효과가 현재 view로 새지 않음. backend 인가 시험과 구분 |
| await/재진입 | 검사 후 전환·dispose가 일어난 경우 반영 직전 거부 |
| 부분 초기화 | 획득 자원만 cleanup; 독립 cleanup 실패 뒤 다른 cleanup도 시도; 실패를 완료로 오기하지 않음 |
| 반복 dispose/late resource | 해제 중복 방지, 정리 실패에도 채택 재활성화 없음, 늦은 획득 즉시 old owner 정리 |
| 등록 교체 | old disposer가 새 registration을 제거하지 않음; 기존 metadata 불변 |
| 조합/모델 경계 | 미지원 선택 거부, 모델 ordering·권한 의미가 없는 Core 단독 결과를 지원으로 인정하지 않음 |
| 정상 양성 | 현재 적용 가능한 완료·정상 정리·현재 명시 재검증 경로가 막히지 않음 |
| 독립 실행/공유 자원 | 한 실행 종료가 다른 실행/site 공용 본체를 파괴하지 않음 |

roomless는 run/view/resource 전환으로 대응하며 fake Room/host/ready를 추가하지 않는다. 실제 구현 API에 맞춰 테스트하고 존재하지 않는 예상 API를 먼저 규범으로 고정하지 않는다.

## 7. 예상 변경과 검증

- games/shared/vnext/core/ 아래 **실제 필요한 최소 파일**. models/capabilities/adapters/profiles 디렉터리를 선제 생성하지 않음.
- tests/game-platform-vnext-core*.test.js의 flat 발견 경로. 필요 이상의 fixture/harness 엔진 없음.
- games/README.md의 실제 exports·사용/정리·상태 및 실행 가능한 작은 사용 예. 기존 barrel 재수출 금지.
- rebuild의 STEP7C trace/검증/영향도 및 새 checkpoint/CURRENT/README. STEP7B 병합 전 요약만 정합화.
- Guard/workflow는 기존 STEP7B 검사가 실제 추가 경로를 다루므로 기본적으로 유지. 새 공백이 확인될 때만 최소 관련 수정.

관련 tests와 npm run test:game-platform, 변경 JS syntax, 실제 repository/base-head Governance, browser/server/static helper 및 기존 site→shared link를 필요한 범위에서 실행한다. 기존 CI/job를 재사용한다. 변경 밖 blob/기존 metadata/barrel/game-local 네 문서·Auth/API/SQL 불변을 확인하고 Registry 영향도는 기존 게임별로 제출한다. 기존 게임을 이관하여 충돌을 닫지 않는다.

Core의 결정적 unit 수행 결과는 정확히 표시한다. 실제 모델/게임/DB/browser/audio/두 client·지원환경·성능·운영 검증은 이 단계에서 수행한 것으로 쓰지 않는다. 향후에는 “Core unit PASS”와 “실제 행동 NOT_RUN”을 구분해 기록한다.

## 8. 전체 보존 및 후속

승인 Target/D4/I1 및 STEP7B 계획 §7 전체와 기존 승인 의미를 보존한다. STEP4A 전체 완료/T01~03, current A/C/P·known expiry/동일 적법 transaction late C 제한/actual C/fresh A/P/retry/anchor/최초60초/terminal/부분대체, D0006~10, H1~4/Registry 단일metadata/단일채택·복구/Shell-local, 결과정정/여섯중복/공개분리/Profile, B01~12/R01~13/안전11/DB-nonDB동등안전/hostless·미승인 재대결 예외 금지·DEV271/DEV251 구분 유지.

원본/ID/줄/강도/조건/예외/f0/명시f·단일owner/L/H/I 비승격·네 문서 baseline/override/manual gate와 기록 책임을 유지한다. 빈 models·미구현 미지원·vNext runtime/online 차단·기존 online DB 요구·server 제외 미확인 차단 유지. client Core로 backend 권한이나 실제 BGM/Invite 내부 수명 보완이 완료됐다고 하지 않는다.

실제 선택 모델·backend·Adapter·H1~3 보완은 STEP7D, 기존게임 공존 검증은 STEP8, 실제 Probe/지원/성능/운영/공개는 각각의 후속 단계다. 신규 외부 운영 재조사·전수 source/SQL 감사·별도 사후 감사를 추가하지 않는다. main과 병합·다음 STEP은 별도 승인이다.

## 9. 구현 작업 전달 프롬프트

다음 담당은 Sol/Codex이며 아래는 STEP7C 코드 구현·검증·PR 제출을 지시할 때 사용할 범위다. 이 문서 자체를 정식 결과 승인으로 해석하지 않는다.

> Game Platform vNext STEP7C — 최소 공통 Core를 구현해줘. 이 계획과 루트 실행 계획1.5 STEP7C, 승인 STEP6 Target §2.1/6.1·I1·LI1~3·STEP4A §5~8·STEP5A Registry/수명 owner를 실제로 읽어줘. 기준 integration은 e57e1fe8f34aa557259bf288f30c59e226db8f6c이며 PR422가 병합됐는지와 이후 변경을 구분해줘. 기존 phase7c branch가 없으면 integration에서 feature/game-platform-vnext-phase7c-core를 만들고, 필수 조립·실행 수명·등록 경계만 최소 구현해줘. 정상 작업은 T1→T3→T4로 이어가고 새 의미 충돌만 Astra 판단에 반환해줘. 전체 완료/T01~03·부분 실패/반복 dispose/late resource·미지원 조합의 의미 있는 tests와 작은 사용 예, 기존 consumer 영향도·현재 기록을 작성해줘. 코드/문서 검증·commit/push·integration base 검토 PR 제출까지 진행하고 STEP7C REVIEW_PENDING으로 멈춰줘. 기존 public API 변경·기존 게임/Auth/API/SQL/metadata/barrel/네 문서 이관·모델/backend/게임/Invite/BGM 실제 구현·운영 변경·병합·main·7D 이후는 진행하지 마. 빈 모델·미지원 차단·승인 Target과 전체 보존/후속 의무·실제 행동 NOT_RUN·운영 UNKNOWN을 유지해줘.

## 10. 이번 결과의 한계

구현 API·정리 순서·실패 집계·등록 표현은 실제 T1에서 필요한 만큼 선택할 사항이다. 이 계획은 특정 class/token/epoch/시그니처를 상위 계약으로 동결하지 않는다. STEP7C 코드를 작성하거나 실행하지 않았고 branch/PR/checkpoint를 생성하지 않았다. 제출 전 최종 승인 가능 여부도 아직 판단하지 않는다.

