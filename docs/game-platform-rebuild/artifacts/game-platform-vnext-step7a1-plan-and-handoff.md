# Game Platform vNext STEP7A1 — 작업 계획과 Sol/Astra 인계

작성: Sol/Codex · 2026-10-13 KST  
지위: **계획/인계 문서**. 이번 요청은 PR418 병합·실제 확인과 STEP7A1 계획 준비까지만 허용했다. 아래 실행 계획/프롬프트는 실제 규칙·Guard 변경이나 구현 착수의 증거가 아니다. STEP7A1 저장소 기록은 **NOT_STARTED**, 기존 행동 **NOT_RUN**, 실행/운영 **UNKNOWN**을 유지한다.

## 1. 현재 상태와 이번 실제 수행

| 항목 | 실제 확인 |
|---|---|
| 저장소 / integration | `limbit95/limbit95.github.io` / `feature/game-platform-vnext-integration` |
| STEP6 | **COMPLETED / DESIGN_RESULT_APPROVED / TARGET_FROZEN / INTEGRATION_MERGED** |
| PR417 | merged=true; final head `487fc8111a98d8f9966e58303b3f85cd81c8fc33`; merge `1a950b06ac895028330587dc53fae151b981123a` |
| PR418 | 사용자 이번 명시 요청으로 merged=true; final head `3e11c626be1668b2b2e6dfda191ff1737cf6646c`; merge `90f14ceb3e609267aa559980994a07eacb0160f3` |
| PR418 병합 시각 | `2026-10-12T22:56:24Z` = 2026-10-13 07:56:24 KST |
| merge 부모 | `1a950b06ac895028330587dc53fae151b981123a` + `3e11c626be1668b2b2e6dfda191ff1737cf6646c` |
| merge tree | `2c6f425009efe24f155b875baa9825b59a131d48`; PR418 승인 head tree와 동일 |
| 계획 기준 / 최신 승인 integration | **`90f14ceb3e609267aa559980994a07eacb0160f3`**. 실제 ref와 대조 |
| main | `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09` 그대로; 반영/동기화 없음 |
| 기록 복원 | AGENTS → 계획1.5 → rebuild README → CURRENT → CP0090 → 실제 PR417/418/Git |
| 이번 하지 않은 일 | 저장소 파일 수정·추가 branch/PR/checkpoint·Guard 수정/실행·runtime/게임/API/SQL 구현·실제 시험·운영·main·STEP7 실행 |

PR418에 들어 있던 CURRENT/README/CP0090의 “사후 기록 PR 검토·병합 대기”는 병합 전 이력이다. 실제 PR418 merged/merge parents·승인 tree 일치·integration ref로 현재 상태를 복원한다. 이번에는 이 문구를 재수정하기 위한 추가 기록 PR을 만들지 않았다. 본 문서와 PR418 설명에 실제 병합 증거를 보존한다.

STEP6 산출물의 REVIEW_PENDING/PROPOSED·“제안 경로”는 작성 당시 지위다. CP0089의 정식 결과 승인·Target 동결 및 실제 PR417/418 반영 증거가 현재 승인 지위를 정한다. 경로 설계가 승인됐다고 해당 규칙 파일·runtime 구현이 이미 생성됐다고 읽지 않는다. STEP7A1 계획 준비 허용은 실제 STEP7A1 반영 허용과 구분한다.

## 2. STEP7A1의 목적과 완료 경계

쉬운 말로, **STEP6에서 정한 공통 규칙을 실제로 읽고 검사할 수 있는 문서 체계에 적용하는 단계**다. 신규 vNext 작업자가 공통 절차·수명·모델·기능 계약을 찾아 읽고, 기존 게임은 기존 계약을 유지하도록 연결한다.

실행 계획1.5 STEP7A1과 승인 STEP6 Target §2/§6.3, Slice D1을 기준으로 한다. 이미 동결된 책임·경로·적용 범위·revision·단계 순서를 새로 선택하지 않는다. 같은 적용 단위의 규칙 본문·진입 링크·최소 Guard/관련 테스트를 한 STEP7A1 PR에서 정합화한다. 단계 안에서 준비→작성→검증은 순서대로 할 수 있지만 링크/Guard만 뒤의 PR에 남긴 채 새 규칙을 먼저 권위로 적용하지 않는다.

| 7A1에 반영할 책임 | 승인된 적용 내용 | 완료로 오해하지 않을 것 |
|---|---|---|
| AR / 아키텍처 | 책임·의존·적용 계약/scope·공존·장르/모델 인덱스 | 모델/장르/제품을 새로 선택하거나 모든 조합 지원 선언 없음 |
| CO / 공통 개발 규칙 | 조사·출처/권리·네 문서 시간축·bootstrap·기능/디자인 기록·검증/수동 gate·UX/종료·출시/회고 | 모든 게임에 Room/host/DOM/winner/score/XP 강제 없음 |
| LI / 공통 수명 계약 | 적용 직전 채택·모든 완료/자원/정리·T01~03·모델 맥락 연결 | 특정 수명 관리 기법/API/클래스를 새로 동결하지 않음 |
| MO / 모델 계약 | 이미 승인된7축/세션/안전11/현재 A·C·P/단일 최종 채택·복구/결과·운영 본문·인덱스·적용 조건 | 실제 미선택 모델/API/oracle/시간공백 정책은 미지원·후속 선택; 새 모델 엔진 작성 없음 |
| CA / 공통 기능 계약 | Registry/Access/Shell·Invite·BGM·결과 소비/여섯 중복·공개·Profile의 승인 책임/조건 본문 | 현재 exports·런타임 사용 가능성이나 H1~3 보완 완료를 선언하지 않음 |
| GV / 기존 Governance | topic+계약/consumer scope의 한 owner, 권위 전환·발견·버전·검증·영향도/전파 연결 | 별도 Governance 본체/새 감사 단계 추가 없음 |
| 진입·템플릿·최소 Guard | AGENTS/development§17/UI 상위 안내/games README/네 템플릿, RULEBOOK/UI literal·필수절·참조/적용 scope 검사 | 실제 gameplay/runtime 추가와 full nested module/server 탐지 확대는 별도 단계 |

MO/CA는7A1에 승인 계약 본문을 실제 작성한다. 제목/목차만 있는 빈 문서를 만들고 본문을7D까지 미루지 않는다. 구현/API 사용 가능성과 계약 본문 존재는 다르다.

## 3. 재사용할 입력과 새로 확인할 공백

유효 승인 원문·결정이 요약보다 우선한다. STEP6 전수 목적지와 기존 source trace를 주 입력으로 사용한다. 이미 끝난 구조·공급자·요금·운영 선택, 전체 source/SQL 감사, 별도 사후 감사는 반복하지 않는다.

공통 위치: `docs/game-platform-rebuild/artifacts/`.

| 입력 | 사용할 부분 | 새 확인은 필요한 경우만 |
|---|---|---|
| `step-6-target-architecture.md` | §2 AR/CO/LI/MO/CA/GV 책임·필수절, §4 DB/nonDB·hostless·보존, §6 권위/scope/revision·7A1 원자적 묶음 | 착수 후 기준 뒤 변경·실제 적용 문장/경로 충돌만 |
| `step-6-clause-destinations.md` | §3/12 전체 ID/f·원조건/강도·단일owner·적용/전환/검증. 7A1 owner에 해당하는 조각과 부모/예외·다른 owner 참조 | 실제 새 본문 대응에서 빠진 의미·불성립 목적지·부모/참조 단절만. 새 목적지를 Sol이 만들지 않음 |
| `step-6-request-traces.md` | §5 신규 보드 / 실시간2D 협동 / room·host 없는 local/async 추적 | 신규 진입/템플릿/Guard 연결이 세 경로를 과도하게 강제하거나 끊는지 |
| `step-6-slices-and-verification.md` | §7 D1/D2/D3/D4 분리·검증 종류/예산, §8 blocker와 후속 의무 | 최소 Guard와7B 전체 탐지의 실제 변경 경계 |
| `step-6-source-trace.md`, 보존된 Astra/Sol/계획 원본 | 원본절→정식절·identity/hash·고정 source trace·과거 상태 구분 | 동일 blob은 재사용. 변경 또는 승인 의미 충돌을 설명할 부분만 읽음 |
| STEP1 전수표/source inventory | 3,232 관리단위·K1198/L906/H562/I566·305부모·원문출처·강도·조건/예외 | 입력 전체를 자동 재분류/새 수집하지 않음; 실제 원문 조각 확인에 사용 |
| STEP2/3 | 7축·네 문서·전환/역할/가시성 및 승인 위험 | 새 모델/게임을 선택하지 않음 |
| STEP4A responsibility/lifetime/trace | LI 전체완료 경로·T01~03·공통/모델 책임 | 원본문 의미를 새 LI에 정확히 연결 |
| STEP4B runtime/security/design/z1/verification/risks | MO의 현재 권위·동기화·A/C/P·안전·운영 본문 | CP0075/D0010 부분 대체를 오래된 strict C/HOLD와 혼동하지 않음 |
| STEP5A selection/duplication/compatibility | CA의8대상·H1~4·기존 본체/Adapter/local·owner | 기존 API 상세는 원 owner 참조; 보완 전 사용 가능 표시 금지 |
| STEP5B contract/duplication/compatibility | CA/MO 결과정정·producer/consumer·여섯 중복·공개 분리·Profile recipe | 미래 보상/통계/공개/audio/Profile 엔진 선제 구현 없음 |
| STEP5C board/realtime/connections | 보드·RT 연결/B01~12/R01~13·DB/hostless 조건 | 실제 BO/RT 본문 작성은7A2/7A3, 현재 계승 참조는 끊지 않음 |
| `DECISIONS.md` | 유효 D0006~10·대체 범위 | 새 의미 선택 없이 원문 우선; 기존 결정 재작성 없음 |

새 소스 확인이 필요한 시작점은 기존 trace에 있는 `scripts/check-game-platform-governance.mjs`, `tests/game-platform-governance.test.js`, `games/shared/registry.js`, 관련 기존 소비자의 import/네 문서와 현재 진입 문서다. 전체 game-local/SQL을 다시 읽는 작업을 기본 단계로 추가하지 않는다. 실제 Registry의 전수 platform-native 대상 목록은 착수 때 확인해야 하며 지금 영향도 분류를 완료했다고 주장하지 않는다.

## 4. 예상 변경 경로와 후속에 남길 경로

아래는 승인 STEP6가 지정한 실행 범위다. **이번 계획에서 생성/수정한 저장소 파일은 없다.**

| 경로 묶음 | 실제 반영 허용을 받은 뒤7A1에서 할 일 |
|---|---|
| `docs/game-platform-architecture.md` | AR1~4 승인 본문·scope/revision 연결 |
| `docs/game-platform-common-rules.md` | CO1~5 승인 범용 절차·품질 본문 |
| `docs/game-platform-lifetime-contract.md` | LI1~3 STEP4A 전체 수명 본문 |
| `docs/game-platform-model-contracts.md` | MO1~6 이미 승인된 계약·인덱스/적용 조건·미지원 세부 구분 |
| `docs/game-platform-capability-contracts.md` | CA1~6 승인 공통 기능 책임·조건 본문 |
| `docs/game-platform-governance.md` | 기존 owner 유지, GV1~3 권위/검증/전파 연결의 필요한 범위 |
| `AGENTS.md`, `games/README.md` | 신규/기존 적용 경계와 상위 진입·장르 인덱스 연결 |
| `docs/game-platform-development-rules.md`, `docs/game-platform-ui-rules.md` | 상위 적용 안내·계승 참조/기존 소비자 scope. 기존 적용 본문과 고정 원문을 무차별 HISTORY로 돌리지 않음 |
| `games/GAME_SPEC_TEMPLATE.md`, `DEVELOPMENT_TEMPLATE.md`, `UI_DESIGN_TEMPLATE.md`, `UI_DECISIONS_TEMPLATE.md` | 기존 책임/파일명 유지. 적용 계약·장르·선택모델·비적용/미지원/미정 질문과 진입 연결. 기존 game-local 네 문서 무이관 |
| `scripts/check-game-platform-governance.mjs`, `tests/game-platform-governance.test.js` | 7A1 전환의 최소 current owner/scope·literal·필수절/참조 검사와 의미 있는 양/음성 테스트 |
| rebuild 필요한 기록/산출물 | 실제 조항→새 본문 대응, 기존 게임 영향도, 최소 전환 diff/검증·미실행, CURRENT/README/새checkpoint. 승인 원본/과거checkpoint는 불변 |

7A1의 정확한 수정 행/Guard 기법은 후속 반영 준비에서 기존 코드를 읽어 구체화한다. 계획만으로 최종 허용 diff/테스트 목록이 모두 확정됐다고 하지 않는다. workflow/package 변경은 필요가 실제 입증되는 최소 연결에 한정하며 새 workflow를 선제 추가하지 않는다. 신규 규칙 문서가 현재 flat policy 발견 범위에 들어가도 literal/current검사 정합화는 필요하다.

### 후속 단계의 경계

- **7A2:** 실제 BO 본문·보드 전수 조각 대응·보드 질문/참조 검사. 그전에는 기존 보드 원문/승인 artifact로 도달 가능한 계승 경로를 유지한다.
- **7A3:** 실제 RT 본문·R01~13/최소6항목·비보드 장르 질문/참조 검사. 지금 계획 경로를 존재하는 실행 규칙으로 링크하지 않는다.
- **7B:** `games/shared/vnext/**` 새 모듈 탐지, server root의 browser import/정적 배포 제외, 전체 계약/모델 oracle·테스트 발견·모듈 구현 상태/exports 안내. 7A1에 꼭 필요한 최소 Guard를7B로 미루지는 않는다.
- **7C/7D:** Core·실제 필요한 모델/Adapter와 H1~3 보완 등 runtime 구현. 이번7A1에는 runtime/API/SQL·게임/Probe 선택·지원 flag를 추가하지 않는다.
- **기존 공존/검증/오픈:** 현재 기존 게임을 이관하지 않는다. 기존 영향도 판단과 변경 관련 회귀는 필요 범위로 하고, STEP8 이후 실제 실행·지원/운영 의무는 남긴다.

온라인 모델의 동등안전11과 DB 상세 분리는 승인 범위대로 문서화하되, 새 nonDB 모델의 실제 oracle/탐지 지원이 없는데 적용 게임을 허용하거나 기존 DB 검사만 제거하지 않는다. 기존 online 범위를 유지하고 신규 미지원 조합을 명시한다. 새 권위/인가/순서 엔진을 Adapter나 Guard 설정 속에 숨기지 않는다.

## 5. 작업 순서와 Sol/Astra 분담

작업모델은 문서를 작성하는 주체이고, AR/CO/LI/MO/CA/GV·Core/model/backend 등 소프트웨어/문서 owner와 다르다. STEP7A1은 승인된 설계의 적용 단계이므로 별도의 전면 Astra 재판단이나 사후 감사 단계를 만들지 않는다.

| 순서·담당 | 목적 | 입력·확인 범위 | 산출물 | 완료 조건·다음으로 넘길 항목 |
|---|---|---|---|---|
| **T1 Sol/Codex — 승인 대응과 최소 전환 준비** | 반영할 본문/ID와 함께 바뀌어야 할 진입/검사를 좁힘 | §3 입력·기준 뒤 변경·Guard 해당 심볼/기존 consumer. 7A1 ID/f와 부모·조건·한owner·future 참조를 연결 | 조항→본문/참조 대응, 최소 변경 목록, 현재/newscope 전환표, Registry 전수 영향도 근거/공백 | 입력/owner/scope가 연결되고 실제 공백만 특정. 정상분은 T3으로 바로 넘김; 새 의미 충돌이 있는 행만 T2 |
| **T2 Astra — 실제 새 의미 충돌이 있을 때만** | 동결 설계로 해결되지 않는 적용/권위/조건 충돌 판단 | Sol이 특정한 원문ID/줄/f·누락 의미·예상owner·현재Guard/consumer 증거. 전체 구조·공급자/운영 재선택 금지 | 해당 충돌의 좁은 판단·동결 변경 필요 여부·사용자 승인 항목 | 단순 링크/표기/기계 수정을 새 선택으로 올리지 않음. 의미 변경이 필요하면 해당 변경만 사용자 게이트로 반환; 나머지는 계속. 충돌 없으면 T2 생략 |
| **T3 Sol/Codex — 승인 본문·진입·최소 Guard 적용** | 한 적용단위의 본문/링크/Guard를 정합화 | T1 대응과 기존 승인본문; T2가 필요했다면 승인된 해당 delta | AR/CO/LI/MO/CA 본문, 기존GV/진입/템플릿의 최소 연결, Guard/관련 테스트 diff, source trace | 조건·강도·예외/한owner·기존scope 보존; BO/RT 발견 경로 유지; 문서와검사가 함께 성립. T4로 넘김 |
| **T4 Sol/Codex — 범위 검증·PR 제출** | 실제 반영의 정확성과 검사 동작을 확인 | 승인 원문·ID/f/부모·테스트·실제Registry 영향도·base/head diff | 문서/Guard 검사 결과, 영향도 COMPLIANT/NOT_APPLICABLE/MIGRATION_REQUIRED와 근거, 미실행/후속의무, integration base PR | 허용diff·원본보존·기계/의미대응·실행결과를 구별해 REVIEW_PENDING 제출. 최종 검토는 사용자; 완료/병합/다음 단계 자동 진행 없음 |

T1→T3→T4는 **한 STEP7A1 작업 안의 흐름**이다. 매번 조사→판단→재조사로 돌아가지 않는다. 반영 준비 표는 실제 작업의 추적 산출물로 남기며 승인된 원문 전체를 다시 조사한 새 근거 문서를 필수화하지 않는다. Astra에 STEP 전체를 넘기거나, 변경 후 “안전 확인”이라는 별도 감사 단계를 추가하지 않는다.

기존 게임에서 MIGRATION_REQUIRED가 나오면 기존 게임을 수정해 맞추는 방식으로 닫지 않는다. 어떤 새scope/규칙/Guard가 기존 소비자를 침범했는지 좁혀 vNext 격리를 재설계해야 하며, 핵심 경계가 바뀌면 그 부분만 Astra/사용자에게 반환한다. 실제 실행 미검증은 UNKNOWN/후속 의무이며 설계 영향도 분류를 모두 보류할 사유가 아니다.

## 6. 필수 산출물·검증·종료 조건

후속 실제 반영에서 필요한 산출물:

1. 승인된 AR/CO/LI/MO/CA 본문과 기존GV/진입/템플릿·최소 Guard의 일관된 적용 묶음.
2. 7A1 관련 전수 ID/f→실제 새 owner 본문/참조 대응과 부모·조건·예외·원문출처. 적용 밖 L/H/I·BO/RT·기존topic-owner는 유지/후속 참조로 남긴다.
3. 신규/기존 계약과 topic/revision/consumer scope·CURRENT 권위 전환표. 같은scope/topic의 경쟁 최상위0, 끊긴 기존보드 발견 경로0.
4. Registry의 모든 platform-native 게임 영향도 표와 근거. legacy 보호/비적용 대상도 범위를 명시한다. 실행 회귀를 안 했으면 그 한계를 적는다.
5. 문서/Guard 검증·미실행·허용 diff·원본 보존·PR base/head·원격 read-back·남은 의무와 사용자 최종 검토 인계.

### 검증의 종류를 구분

| 검증 | 후속 실제 반영에서 확인 | 이번 계획 준비 상태 |
|---|---|---|
| 문서 기계 검사 | hash/ID/f/부모·강도/조건refs·절/표/링크·scope/revision·현재/후속경로·허용diff | 승인 입력의 관련부분/고정blob·계획내링크/구성만 확인 |
| 의미 대응 검토 | 각 실제 새 본문이 원문 의무·부정·조건/예외를 보존하고 owner 참조가 성립하는지 | 아직 새 본문이 없으므로 반영 완료 아님 |
| Guard 관련 테스트 | old/newscope 참조, 경쟁CURRENT/누락문서·bootstrap/runtime 경계·기존게임 오분류/온라인 안전 면제의 양/음성 사례 | **NOT_RUN** |
| 실제 Governance 검사 | 실제 base/head 및 repository state·관련 필수절/링크 검사 | **NOT_RUN** |
| 게임/DB/browser/audio/두client·성능/운영 | 변경 영향·후속 모델·지원/오픈 단계의 실제 증거 | **NOT_RUN / UNKNOWN**, 후속 의무 |

현재 존재하는 등록 명령은 `npm run test:game-platform` → `node --test tests/game-platform-*.test.js`다. 해당 Guard 테스트는 `tests/game-platform-governance.test.js`, CLI는 `node scripts/check-game-platform-governance.mjs --base <기준SHA> --head <실제HEAD>` 경로를 사용한다. 후속 변경에 맞는 의미 있는 최소 검사부터 수행하고 필요한 등록 검사 범위를 정한다. 이번 계획에서는 명령을 실행하지 않았다. 실제 CI 실행이 없으면 CI PASS로 보고하지 않는다. 기존CI5분/DB15분이나 과거 제안 표본을 새 승인예산으로 삼지 않는다.

STEP7A1 제출은 REVIEW_PENDING이다. 사용자의 정식 결과 최종 검토·승인/완료 기록·integration 병합·다음STEP은 구분한다. 이번 계획으로 STEP7A1 완료·현재 규칙 적용·행동 PASS를 선언하지 않는다.

## 7. 보존 조건과 멈출 지점

- 기존 Auth/게임/public API/SQL/Registry metadata 무이관. 기존 `games/shared/index.js`를 vNext 재수출 통로로 바꾸지 않는다. existingconsumer는 기존 계약/scope 유지.
- 네 문서 baseline/유효override/manualgate·두 checkpoint 명령/개발·디자인 시간축 유지. 기존 game-local 본문을 새baseline으로 재작성하지 않는다.
- STEP4A success/error/null/finally/cleanup/leave/effect/후속완료·부분초기화/반복dispose/late자원·T01~03 보존.
- CP0075/D0010 A/C/P·knownexpiry뒤새A금지·동일transaction lateC제한/실제C관측·freshP/retry·owneranchor·최초60초/terminal·부분대체 보존. 과거strictC/HOLD만떼어복제하지 않음.
- D0006~10 성능/비용/기록/삭제/탈퇴/backup/복원/운영 UNKNOWN. 구조/공급자/요금/운영 재선택 없음.
- Registry단일metadata·Snapshot/Reconnect 선택model단일최종채택/복구·Shell공통/local, BGM기존본체+내부최소수명/H1무보완직결보류·Invite전구간identity/사이트handler/dialog/H2~4.
- 결과정정은새경기집계아님·producer/consumer·여섯중복·공개분리·Profile recipe. 미래 비room/보상/정밀audio/Profile을 전체blocker로 올리지 않음.
- B01~12/R01~13·동등안전11/DB조건·초기hostless/재대결host불성립/미정 분리. hostless multiplayer 재대결 예외 미승인. Room/host/DOM/winner/score/XP 전게임강제 및 재대결no-op/local우회 금지.
- Adapter 안에 새 권한/순서/수명/token/audio 엔진 숨김 금지. 장르명으로 transport/renderer/tick/physics/prediction 선택 금지.

**실제 설계 blocker:** 승인 ID/f의 실제 목적지/의미 누락, 부모·조건/예외 손실, 경쟁CURRENT, 기존consumer 침범, 승인 범위 밖 상위 완화. 해당 조각·영향만 반환한다. 문구/링크/기계 변경으로 해결 가능한 것은 Sol이 처리한다.

**후속 의무:** 실제 모델/제품·취소/시간공백 정책·지원기기/성능·운영·H1~3구현/행동 증거. 이것들이 아직 미실행이라는 이유로7A1 모든 문서 적용을 보류하지 않는다. 실제 안전/oracle 없는 조합을 지원 가능으로 표시하지 않는다.

## 8. 고정 source trace와 이번 계획의 한계

확인 기준 SHA: `90f14ceb3e609267aa559980994a07eacb0160f3`. 아래파일은 이 SHA에서 실제 읽었고 고정 tree의 blob과 대조했다. 기존 동일source/trace는 재사용했다.

| 경로 | blob | 계획에 사용한 범위 |
|---|---|---|
| `AGENTS.md` | `2686a3c37502bbf1f7f2a9407640e78cc026dadb` | 별도branch/PR·integration/기존보존·문서/코드검증·영향도 |
| `game_platform_vnext_final_execution_plan.md` | `da353e2e64daef6b1b0b7267c21997bfd7cda4ed` | 개정1.5·STEP7A1 및7A2/3/7B 분리 |
| rebuild `README.md` | `ad4cd2103d1d86d9fd3eeeca594229dca4611e4d` | 진입/기록·과거병합대기 해석 |
| rebuild `CURRENT.md` | `75f2e29b214593be4e0d9e0bebf662fa267b2735` | STEP6완료·동결·병합/STEP7NOT_STARTED |
| `checkpoints/CP-0090-step-6-integration-merged.md` | `5a88bf4158b870e75f6bbb7020203e2b3fb4a6ce` | 실제PR417 merge/사후기록·보존·정지 |
| `artifacts/step-6-target-architecture.md` | `4c12e5a5ce88aa7ea71a83c7180ad34aec1c1a12` | §2 책임·§4 조건·§6.3 최소 원자적 연결 |
| `artifacts/step-6-slices-and-verification.md` | `000a87c4dbd249d8266c583196d3b43d31e3f83c` | D1~4/검증예산·blocker/후속 의무 |
| `artifacts/step-6-request-traces.md` | `1f0c644f7764ce5c7b84aacbf259ffaad0768aa6` | 세 요청 코드 없는 추적 |

Guard/템플릿/Registry 사실은 기존 evidence§7~10/source inventory를 재사용했다. Guard blob `2aa47527fc57a1ba0fe8a5d6c3c72eb984b8477b`, 관련 test blob `4c7d3c865cb09ab19d4831404f0c43fa77bc3b12`, package blob `917a55aa474d98cc663364c5e7dab84ff6fe5cf1`은 승인 tree와 동일하다. 적용 심볼은 `RULEBOOK_PATH`/`UI_RULEBOOK_PATH`, `readPlatformPolicyDocuments`, `validateRepositoryState`, `validatePullRequestChanges`이고 기존 source의 정확한줄/문맥을 후속 최소 변경 준비에 사용한다.

이번은 작업 계획이다. 실제 새문서의 조항/부모/한owner 대응 완결·Registry 영향도 분류·Guard diff/테스트를 수행한 결과가 아니다. 전수source/SQL감사·새핵심판단·별도사후감사·실제게임 선택을 추가하지 않았다. PR418 병합 외 저장소 변화 없음. 계획 파일의 표현과 승인 원문이 충돌하면 승인 원문·유효결정을 우선하고 그차이만 보고한다.

## 9. 다음 첫 작업과 복사 가능한 Sol/Codex 프롬프트

**다음 담당: Sol/Codex. 다음 첫 작업: STEP7A1 승인 대응·최소 전환 준비(T1).** 실제 반영을 허용받은 하나의7A1 작업 안에서 준비→본문/진입/최소Guard 적용→범위검증→검토PR로 이어간다. 새로운 Astra 전면판단을 먼저 요청할 필요는 없다. 새 의미 충돌이 실제 발생할 때만 해당 행을 Astra/사용자에게 인계한다.

아래는 **후속 실제 반영을 허용할 때 사용할 실행 요청**이다. 이번 문서에 포함됐다는 사실 자체가 실행 허용은 아니다. 현재 요청은 계획까지이므로 지금 실행하지 않는다.

```text
Game Platform vNext STEP7A1 — 통합 아키텍처와 공통 규칙 반영을 진행해줘.
담당 Sol/Codex. 승인된 STEP6 Target를 다시 판단하지 마.

game-platform-vnext-step7a1-plan-and-handoff.md 실제 원본 전체와
승인 STEP6 정식 산출물의 관련 본문·전수 ID/f·trace를 실제 읽어줘.
저장소 limbit95/limbit95.github.io,
integration feature/game-platform-vnext-integration,
계획 기준 SHA 90f14ceb3e609267aa559980994a07eacb0160f3.

이번 요청으로 승인 STEP6 범위의 STEP7A1 규칙 문서 작성·진입/템플릿/Governance 연결,
필요한 최소 Guard 코드·관련 테스트 수정과 범위 검증 실행,
integration base 검토 PR 제출을 명시적으로 허용한다.
gameplay/runtime/모델/backend/API/SQL 구현 및 실제 게임·DB/browser/audio/두client/성능/운영 시험은 포함하지 않는다.

AGENTS→계획1.5→rebuild README→CURRENT→CP0090→PR417/418/Git 순서로 복원하고
최신 integration과 기준 SHA를 대조해 추가 변경·의미 충돌만 분리해줘.
PR417 merge 1a950b06ac895028330587dc53fae151b981123a,
final head 487fc8111a98d8f9966e58303b3f85cd81c8fc33;
PR418 merge 90f14ceb3e609267aa559980994a07eacb0160f3,
final head 3e11c626be1668b2b2e6dfda191ff1737cf6646c.
STEP6 COMPLETED/DESIGN_RESULT_APPROVED/TARGET_FROZEN/INTEGRATION_MERGED 유지.
과거검토대기/OPEN/미병합은 작성이력·현재 Git과 함께 읽어줘.

유효 미완료 STEP7A1 branch/PR이 있으면 이어가고 없으면 최신 승인 integration에서
game-platform-vnext 계보의 별도 phase7a1 branch를 만들어줘. integration/main 직접commit 금지.
T1 대응·최소 전환 준비를 본문 반영의 첫 작업으로 수행하고,
새 의미 충돌이 없으면 별도 Astra 재판단/사후감사 없이 T3·T4로 이어가줘.
새 충돌이면 원문ID/줄/f·예상owner·누락의미·현재Guard/consumer·영향만 Astra/사용자에게 반환해줘.
Sol이 새 Target/상위완화/hostless재대결예외를 만들어 메우지 마.

STEP6 Target §2/§4/§6.3 및 Slice D1에 따라 AR/CO/LI 승인본문과
MO/CA의 이미 승인된 계약본문·인덱스·적용 scope를7A1에서 실제 작성해줘.
MO/CA를 빈목차로 두고7D까지 미루지 마. 미선택 모델/API/oracle는 미지원/후속으로 구분해줘.
기존 GV 유지, AGENTS/development§17/UI상위 안내/games README/네템플릿과
Guard RULEBOOK/UI literal·필수절/참조/scope 검사를 같은 적용단위로 연결해줘.
경쟁 CURRENT를 만들거나 필요한 최소 Guard를7B까지 미루지 마.
BO/RT는7A2/7A3의 후속 실제본문이며 그전 승인artifact/기존원문 발견 경로를 유지해줘.
full nestedshared/serverroot/import·배포제외/test발견·모듈 exports 안내는7B로 남겨줘.

3,232관리단위(K1198/L906/H562/I566)/305부모와16행58명시분할을 입력으로 사용하고,
7A1 관련 ID/f의 실제새본문/참조 대응·부모/강도/부정/조건/예외·원문출처를 보존해줘.
전체표를 자동재분류하지 말고 L/H/I나49/B01~12를 공통MUST/전수완료로 승격하지 마.
같은의무의 독립본문 중복 금지, 원topic-owner·기존consumer scope와 원문이력 유지.
전수 목적지채움/ID개수만으로 실제규범본문 의미검토완료를 선언하지 마.

현재 Registry의 모든 platform-native 게임 영향도를 근거와 함께
COMPLIANT/NOT_APPLICABLE/MIGRATION_REQUIRED로 정리해줘.
기존게임/Auth/API/SQL/등록metadata/shared barrel/game-local 네문서는 무이관.
MIGRATION_REQUIRED를 기존게임수정으로 닫지 말고 해당vNext침범만 반환해줘.
네문서baseline/유효override/manualgate·STEP4A전체완료/T01~03,
CP0075/D0010 현재A/C/P·knownexpiry/lateC제한·실제C·freshP/retry·anchor/60초/terminal·부분대체,
D0006~10 UNKNOWN, Registry단일metadata·단일채택/복구·Shell/local,
BGM H1/Invite H2~4, 결과정정/producer-consumer/여섯중복/공개분리/Profile recipe,
B01~12/R01~13·안전11/DB범위·초기hostless/재대결host불성립/미정조건을 보존해줘.
미지원nonDB경계에서 기존온라인안전검사만 제거해 허용하지 마.
전게임Room/host/DOM/winner/score/XP강제·재대결no-op/local우회·Adapter새엔진숨김 금지.

승인 원본/STEP6 artifacts/계획/DECISIONS/과거checkpoint는 보존해줘.
후속작업의 실제source trace·문서대응·영향도·검증/미실행 및 필요한현재기록만 남겨줘.
문서 hash/ID/f/부모·절/링크·한owner/scope·허용diff와 의미대응을 구분해 검증하고,
변경한 Guard의 의미 있는 관련 테스트와 실제 base/head Governance 검사를 수행해줘.
실제 CI미등록/미실행을 PASS로 쓰지 마. 행동 NOT_RUN·UNKNOWN·구현/실행/오픈 의무 유지.
source/SQL 전체감사·공급자/운영재결정·외부재조사·별도사후감사 추가 금지.

최종 PR의 실제 base/head·변경파일·문서/Guard검증·원본보존·원격read-back·기존게임영향·
미실행/후속의무를 보고하고 STEP7A1 REVIEW_PENDING으로 제출한 뒤 멈춰줘.
다음첫작업은 사용자 정식결과최종검토 하나로 남겨줘.
STEP7A1 완료/최종승인·병합·main·7A2이후·runtime/게임/backend/API/SQL구현·실제행동시험·
운영변경·구매/문의/job/dump/복원은 진행하지 마.
```
