# Game Platform vNext STEP6 — 작업 계획과 인계
작성: Sol/Codex · 2026-10-11
상태: 계획 준비용 제출 문서. 승인된 Target 또는 정식 저장소 산출물이 아니다.

## 1. 목적과 현재 기준
STEP6는 지금까지 승인된 설계를 한 구조로 연결하고, 새 게임을 만들 때 어느 규칙·계약·모델을 따라야 하는지 빠짐없이 정하는 동결 게이트다. 코드를 만들기 전에 문서상으로 구현 흐름을 따라가며 충돌과 누락을 확인한다.

- 저장소: limbit95/limbit95.github.io
- integration: feature/game-platform-vnext-integration
- 고정 계획 기준: `f34f4f180e14ea36847b9740dea43de2f1325e56`
- 실행 계획: 개정 1.5. STEP5C COMPLETED / DESIGN_RESULT_APPROVED / INTEGRATION_MERGED.
- PR416 실제 병합: merge `f34f4f180e14ea36847b9740dea43de2f1325e56`, 최종 head `fe1d627f5c6fa39c1f540fcf17dfad22fdd82e18`.
- merge 부모: 이전 integration `2751e9241a3debbd40506fa1b2ea7e688dfe0140` 및 최종 head. 병합 시각 2026-10-11T12:33:50Z.
- STEP6 기록 NOT_STARTED. 계획 준비는 저장소 상태를 바꾸지 않는다.
- 행동 NOT_RUN, 기존 UNKNOWN 및 구현·실행·오픈 의무 유지. main은 별도 게이트.

CURRENT/README/CP0087의 PR416 OPEN·미병합·STEP5B 마지막 승인 표기는 병합 전 이력이다. 해당 기록의 복원 조건과 실제 PR/Git 증거를 함께 적용한다. 이를 고치기 위한 별도 사후 기록 작업을 이 계획에 추가하지 않는다.

이 문서의 작업 순서는 제안된 실행 순서다. 프롬프트가 들어 있다는 사실 자체는 해당 작업의 실행·승인·병합 허용이 아니다.

## 2. STEP6 범위와 동결 대상
실행 계획 STEP6의 직접 요구를 기준으로 한다.

| 대상 | STEP6에서 필요한 결과 | 이번 계획에서 남기는 경계 |
|---|---|---|
| STEP2~5C 정합성 | 실제 의미 충돌 해소, 승인 요구의 적용 조건 연결 | 기존 선택 재판단 없이 충돌 행만 처리 |
| Target Architecture | 논리 계층, 책임과 문서 계층, 필요한 물리 경로 | 경로 후보와 탐지 조건은 근거 준비 후 Astra 판단 |
| 조항별 목적지 | 원문 전체 ID·강도·조건·예외와 새 책임 문서·절 대응 | STEP2 49조항/STEP5C B01~12를 전수 완료로 쓰지 않음 |
| 장르·모델 연결 | 공통 → 장르 → 네 문서 bootstrap → 모델 → 검증 | 세 요청을 코드 없이 추적, 기존 게임은 참고/회귀 |
| 계약 버전·권위 전환 | 기존/신규 적용 계약 식별, CURRENT 권위와 전환 순서 | 실제 rulebook·AGENTS·Guard 전환은 STEP7의 작업 |
| Guard·빌드·import·테스트 | 새 경로 탐지, 기존 게임 오분류 방지, 필요한 수정 범위 | Guard 실행/수정과 runtime 생성은 수행하지 않음 |
| 구현 Slice·테스트 예산 | 의존 순서, 각 Slice 범위·검증·중단 조건 | 실제 구현·시험 및 지원 완료 선언과 구분 |
| 결정·보류·기존 게임 | 동결할 선택, 정확한 미선택, 기존 자산 무변경 조건 | 실행 의무만 남은 항목과 설계 blocker를 구분 |

실제 파일 배치는 Guard/build/import 확인 뒤 판단한다. `games/core`, `games/models`, `games/profiles` 등을 미리 만들지 않는다. 중첩 shared 경로를 택할 경우 탐지·테스트 범위를 해당 경로 추가 전에 확보해야 한다. 경로 자체보다 API 의미와 기존 consumer 격리가 우선이다.

## 3. 재사용 입력과 새 확인의 구분
아래 산출물 경로는 고정 integration tree에 존재한다. 본 계획은 후속 근거 준비에서 읽을 부분을 지정하며, 해당 전체 본문의 새 분석을 수행한 결과가 아니다. 유효 결정·승인 원문이 요약보다 우선한다.

공통 위치: `docs/game-platform-rebuild/artifacts/`.

| 입력 묶음 | 재사용할 파일 | STEP6에 가져올 내용 |
|---|---|---|
| 상태·절차 | AGENTS.md; game_platform_vnext_final_execution_plan.md; rebuild README.md/CURRENT.md; checkpoints/CP-0087-step-5c-integration-merge-approved.md; 실제 PR416/Git | 허용 범위·개정1.5·현재 승인/병합·후속 게이트 |
| STEP1 | step-1-as-is-audit.md; step-1-source-inventory.md; step-1-clause-succession-table.md; step-1-clauses-platform.md; step-1-clauses-design.md; step-1-clauses-games.md; step-1-clauses-site-history.md | 전체 조항 모수·ID·부모·MUST/SHOULD·범위/예외·원문/blob |
| STEP2 | step-2-genre-rule-index.md; step-2-implementation-selection.md; step-2-game-spec-selection-rationale.md | 선택축·장르 인덱스·네 문서 역할·49개 선택의 한계 |
| STEP3 | step-3-stress-matrix.md; step-3-transition-scenarios.md; step-3-risks-and-followup.md; step-3-source-trace.md | 세 요청의 전환·역할·가시성·복구 및 위험 입력 |
| STEP4A | step-4a-responsibility-boundaries.md; step-4a-lifetime-contract.md; step-4a-contract-source-trace.md | 책임·전체 완료 경로·T01~03 |
| STEP4B | step-4b-runtime-sync-contract.md; step-4b-security-site-contract.md; step-4b-design-finalization.md; step-4b-z1-decision-and-design-closeout.md; step-4b-verification-specification.md; step-4b-risks-and-followup.md | 최종 채택/복구·인가·운영 조건·검증 의무·Z1 종료/대체 관계 |
| STEP5A | step-5a-common-module-selection.md; step-5a-duplication-prevention.md; step-5a-compatibility-lifetime-verification.md; step-5a-source-trace.md | 승인된 본체/Adapter/local·owner·H1~4 |
| STEP5B | step-5b-contract-boundaries.md; step-5b-duplication-and-extension.md; step-5b-compatibility-lifetime-verification.md; step-5b-source-trace.md | 결과/정정·중복·공개·Profile·확장/보류 |
| STEP5C | step-5c-board-rule-succession.md; step-5c-realtime-coop-spatial-rules.md; step-5c-genre-model-connections.md; step-5c-source-trace.md; step-5c-validation.md | B01~12·R01~13·DB/비DB·hostless 조건·혼합/추가 절차·전수 후속 의무 |
| 유효 결정 | docs/game-platform-rebuild/DECISIONS.md, 위 산출물에서 참조한 승인 원문 | D0006~10·CP0075/D0010의 유효 범위·부분 대체 |

새로 확인할 것은 기존 trace의 동일 blob 여부, 전수 조항의 빠진 대응 입력, 현행 경로/탐지/부트스트랩의 결론 영향 사실이다. 완료된 공급자·요금·운영 조사 및 승인된 경계를 반복하지 않는다. 소스 전체·SQL 전체 감사도 추가하지 않는다.

현재 존재가 확인된 경로 중 후속 Sol 확인의 시작점:
- `scripts/check-game-platform-governance.mjs`
- `tests/game-platform-governance.test.js`
- `.github/workflows/game-platform-governance.yml`
- `docs/game-platform-governance.md`
- `package.json`, `playwright.config.js`
- `scripts/build-community-assets.mjs`, `scripts/build-liar-canonical.mjs`

이는 내용상 적용/검증 완료 목록이 아니다. 실제 Guard 조건, import/빌드 진입 및 테스트 발견 범위는 해당 부분을 읽어 구분한다. 다른 관련 경로는 기존 inventory를 통해 필요한 경우만 추가한다.

## 4. 작업 순서와 모델 분담
소프트웨어 owner와 작업 담당 모델은 다르다. Sol이 사실을 정리하고 Astra가 경계·충돌·Target 선택을 맡는다.

| 작업·담당 | 목적·입력 | 확인/판단 범위 | 산출물·완료 조건 | 다음으로 넘길 것 |
|---|---|---|---|---|
| 1. 근거 준비 / Sol·Codex | §3 승인 원문·현재 tree·Guard/빌드/import/테스트 관련 부분 | 전수 조항 입력, 세 요청의 코드 없는 추적, 경로/권위/검증 사실. 최종 목적지·경로·버전·Slice를 선택하지 않음 | game-platform-vnext-step6-evidence.md. §5 여섯 묶음마다 근거 또는 정확한 공백, 고정 trace, 사실/승인/추론/미확인 구분 | Astra가 선택할 질문·충돌 행·후속 실행 의무, 복사 가능한 판단 프롬프트 |
| 2. Target 판단안 / Astra | 근거 문서와 유효 승인 원문 | 모순 해소·계층/물리 경로·전수 목적지·버전·권위 전환·Guard 범위·Slice/예산. 필요한 공백만 추가 확인 | game-platform-vnext-step6-astra-judgment.md. 세 추적이 연결되고 모든 조항/분할 조각 목적지 또는 동결 blocker 명시. 핵심 승인 항목·조건·보류 유지 | 사용자 핵심 판단 승인 + 명시적 정식 반영 허용 요청, Sol 인계 프롬프트 |
| 3. 정식 문서 반영 / Sol·Codex | 승인 범위의 Astra 실제 원본·Sol 원본 | 승인 의미/조건 그대로 반영·문서 정합성 검사·기존 자산/원본 보존 | 별도 STEP6 문서 branch, integration base 검토 PR. REVIEW_PENDING; 원문 대응/ID/링크/hash/허용 diff/원격 read-back | 사용자 정식 결과 최종 검토. 아직 동결 완료·병합·STEP7 허용 아님 |
| 4. 동결 승인·완료 기록 / Sol·Codex | 사용자 최종 결과 승인과 기록 범위의 명시적 허용 | 승인 head와 동결 결과·잔여 의무 기록 | 승인·완료 기록 원격 보존. 설계 변경 시 해당 freeze gate 재통과 | 병합/STEP7은 각각 다음 요청. runtime 구현 선행 금지 |

3~4는 이후 허용 때 실행할 계획이다. 이번 문서로 branch/PR/기록 작성을 시작하지 않는다. 사용자 승인과 문서 검증 사이에 별도 사후 감사 단계를 추가하지 않는다.

## 5. 첫 Sol 작업의 여섯 근거 묶음
| 묶음 | 준비할 사실과 승인 근거 | Astra에게 남길 선택 |
|---|---|---|
| E1 승인 연결·충돌 | STEP2~5C 요구를 책임 단위로 연결; 현재 유효 결정/대체 관계와 충돌한 원문 행 특정 | 상위 의미를 바꿀 필요 여부·변경 승인 범위 |
| E2 전수 계승 입력 | STEP1 전체 모수/ID/부모/강도/조건/예외, 분할 조각, STEP5C 논리 계승 후보, 원문 기준 SHA/절 | 각 조항·분할 조각의 Target 책임 문서·절, 유지/세분화/보강/참조 전환 |
| E3 세 요청의 코드 없는 추적 | 신규 보드게임 / 실시간2D 온라인 협동 / 방·host없는 독립 게임: 공통절차→장르→네문서→모델→검증. 필요/비적용/공백 명시 | 조합의 성립 여부·모델 연결·지원/미지원 조건 |
| E4 물리 경로·공존 | Guard 게임/shared 탐지, 빌드/import/테스트 발견, Registry/기존 consumer 경계의 관련 사실 | 물리 경로·기존 격리·탐지 변경 범위/순서 |
| E5 버전·문서 권위 | 현행 권위/링크/네문서/bootstrap 및 Guard의 참조 전제, 새 권위와 함께 바뀌어야 할 연결 | 계약 버전 식별·권위 전환과 STEP7 원자적 반영 범위 |
| E6 Slice·검증 입력 | 승인 검증 항목/행동 NOT_RUN·UNKNOWN, 의존 순서와 실제 실행에서 필요한 환경·증거 | 최소 Slice 순서·검증 종류/예산·중단/재검토 조건 |

전수 표의 필수 열: 규칙 ID / 기준 SHA·출처 절 / 원 MUST·SHOULD와 의도 / 새 책임 문서·절 / 적용 범위 / 유지·세분화·보강·참조 전환 / 검증 증거.
근거 준비 단계의 새 책임 문서·절은 기존 승인 후보 또는 미선택으로 표시한다. 빈칸을 Sol의 새 선택으로 메우지 않는다. 부모절·조건·예외·모든 분할 조각도 추적한다.

세 요청은 실제 Probe 게임을 새로 선택하거나 실행하는 작업이 아니다. renderer/transport/tick/physics/prediction을 요청명에서 도출하지 않는다. 서로 다른 선택 모델의 미지원 조합도 드러낸다.

## 6. 보존 조건과 종료 기준
기존 Auth·게임 무이관, 기존 public API/SQL·Registry·네문서 baseline/유효 override·수동 gate를 유지한다. 기존 게임은 참고와 회귀 대상이다.

- STEP4A success/error/null/finally/cleanup/leave/effect/후속 비동기 완료와 T01 같은 room 새 match, T02 A→B→A, T03 role/view/user 변경.
- CP0075/D0010 A/C/P: known expiry 뒤 새 A 금지, 동일 transaction late C의 제한 수용·실제 C 관측, 새 P/retry fresh 인가, owner anchor, 최초60초/terminal 보호. 유효한 부분 대체 범위를 유지한다.
- D0006~10의 성능/비용/기록/삭제/탈퇴/backup/복원/운영 조건과 UNKNOWN.
- Registry 단일 metadata, Snapshot/Reconnect 선택 모델 단일 최종 채택/복구, Shell 공통 표시/local 연출.
- BGM 기존 본체+내부 최소 수명 보완, H1 무보완 연결 보류. Invite 전 구간 identity·사이트 handler/dialog owner와 H2~4.
- STEP5B 공식 결과/정정·producer/consumer·여섯 중복 의미·공개 분리·Profile recipe.
- DB 온라인 적용과 비DB 동등 안전, 초기 hostless/재대결 host 불성립/미정 조건을 각각 유지. Room/host/DOM/winner/score/XP를 모든 게임에 강제하지 않고 multiplayer 재대결 의무도 no-op/local로 우회하지 않는다.
- Adapter 안에 새 권한·순서·수명·token/audio 엔진을 숨기지 않는다. 비room·보상·정밀 audio·Profile 등 미래 미선택을 전체 blocker로 올리지 않는다.

STEP6의 최종 문서 동결 게이트는 Target Architecture/문서 계층, 전수 조항 목적지, 장르/모델 연결, 결정/보류, Slice/테스트 예산, 기존 게임 무변경 조건 및 세 코드 없는 추적이 서로 일치하는 것이다. 목적지 없는 조항·설명 없는 MUST 약화·경쟁하는 복수 CURRENT 권위는 문서 전환 blocker다. 실행 미검증 항목은 실제 시험 의무로 남기며 모든 설계 판단을 일괄 보류하지 않는다.

정식 결과 최종 승인 전 REVIEW_PENDING을 유지한다. 동결 이후 사용자 검토로 설계가 바뀌면 해당 게이트를 다시 통과한다. 문서상 성립과 행동 PASS·production 지원·오픈 가능은 서로 다르다.

## 7. 후속 단계와 검증의 경계
STEP6는 STEP7에서 반영할 권위·경로·Guard 변경 범위를 정한다. 실제 AGENTS/rulebook/CURRENT 권위 전환·장르 문서 적용·Guard 구현은 STEP7 해당 Slice의 허용 뒤다. 원자적 최소 연결/Guard가 필요한 경우 그 의존 관계를 STEP6에 명시하여 탐지 공백을 만들지 않는다.

계획/근거/판단 문서의 검증은 승인 원문 대응, 조항 모수·ID·강도·조건, 링크/source trace, 원본 identity/hash, 상태와 허용 범위다. Guard·unit·DB·browser·audio·두 client 행동 시험은 이번 작업에서 실행하지 않는다. CI가 존재하거나 테스트 소스가 있다는 이유로 PASS를 쓰지 않는다.

공급자·운영 정책 재결정, 전체 source/SQL 감사, 구매/문의/job/dump/복원 및 main/공개 활성화는 포함하지 않는다.

## 8. 이번 확인 근거와 다음 첫 작업
고정 SHA에서 확인한 상태/계획 문서 blob:

| 경로 | blob |
|---|---|
| AGENTS.md | 2686a3c37502bbf1f7f2a9407640e78cc026dadb |
| game_platform_vnext_final_execution_plan.md | da353e2e64daef6b1b0b7267c21997bfd7cda4ed |
| docs/game-platform-rebuild/README.md | 02e04363157266947c82721c76b37cf8f4989e85 |
| docs/game-platform-rebuild/CURRENT.md | f609b2a06a8d89d0b9ee10a0ec1918cb43303cd5 |
| docs/game-platform-rebuild/checkpoints/CP-0087-step-5c-integration-merge-approved.md | c5f6eb0684aacc81425084a457158fddfa207cf0 |

실제 PR416/Git 병합 증거와 동일 head/merge tree 확인을 재사용한다. 현재 계획의 직접 근거는 실행 계획 STEP6 및 STEP7A1~7B 경계, 전수 계승/Guard/경로 조건이다. 추가 입력 경로의 존재는 고정 SHA recursive tree로 확인했다. 이 계획에서는 그 소스 본문을 본격 분석하지 않았다.

다음 첫 작업 하나: **Sol/Codex의 STEP6 판단 근거 준비**.
아래 §9를 그대로 사용한다. Astra Target 판단은 그 결과 문서를 받은 다음 요청이다.

## 9. 다음 Sol/Codex 전달 프롬프트
```text
Game Platform vNext STEP6의 판단 근거 준비만 진행해줘.

담당: Sol/Codex.
입력 game-platform-vnext-step6-plan-and-handoff.md 실제 원본 전체를 읽어줘.
저장소 limbit95/limbit95.github.io.
integration feature/game-platform-vnext-integration.
고정 기준 SHA f34f4f180e14ea36847b9740dea43de2f1325e56.

목적은 Astra가 Target Architecture·문서 계층·전수 조항 목적지·물리 경로·계약 버전·
권위 전환·Guard 범위·구현 Slice/테스트 예산을 판단할 수 있도록 승인 근거와
현재 사실을 준비하는 것이다. 이번에는 최종 Target 선택·동결·정식 저장소 반영을 하지 마.

1. AGENTS → 계획1.5 → rebuild README → CURRENT → CP0087 → 실제 PR416/Git 순서로
필요 상태를 복원하고 실제 remote HEAD와 고정 SHA를 대조해줘.
PR416 merge f34f4f180e14ea36847b9740dea43de2f1325e56,
최종 head fe1d627f5c6fa39c1f540fcf17dfad22fdd82e18의 병합 증거를 재사용해줘.
STEP5C COMPLETED/DESIGN_RESULT_APPROVED/INTEGRATION_MERGED,
STEP6 기록 NOT_STARTED·행동 NOT_RUN·UNKNOWN·구현/실행/오픈 의무와 main 별도 게이트를 유지해줘.
CURRENT/CP0087의 OPEN·미병합은 병합 전 이력과 명시된 복원 조건으로 읽어줘.
새 변경은 고정 판단 입력과 분리하고 의미 충돌만 확인해줘. 이번 근거 준비로 기록을 바꾸지 마.

2. 계획 §3의 STEP1~5C·DECISIONS를 재사용해줘. 유효 승인 원문/결정이 요약보다 우선한다.
완료된 구조·공급자·요금·운영 정책 선택을 다시 하지 마.
동일 source blob과 기존 trace를 활용하고 결론을 바꿀 공백/충돌 부분만 추가 읽어줘.
전체 source/SQL 감사나 별도 사후 감사는 추가하지 마.

3. 계획 §5 E1~6을 각각 준비해줘.
- 승인 책임/적용 조건 연결과 실제 충돌 행.
- STEP1 전체 조항 모수·ID/부모/MUST·SHOULD/의도/조건/예외·분할 조각·원문 출처.
  STEP2 49개/STEP5C B01~12를 전수 완료로 오해하지 마.
  기존 승인된 논리 목적지와 미선택/공백을 표시하되 최종 새 책임 문서·절을 선택하지 마.
- 신규 보드게임, 실시간2D 온라인 협동, 방·host없는 독립 게임의 코드 없는 추적:
  공통 절차→적용 장르 규칙→네 문서 bootstrap→모델 연결→검증.
  승인 조건/필요/비적용/미지원/공백을 구분하고 실제 Probe 게임을 새로 선택하지 마.
- 실제 Guard/게임·shared 탐지/빌드/import/테스트 발견과 기존 consumer 격리 사실.
  계획 §3의 현존 경로에서 필요한 부분을 읽고 경로·고정 SHA/blob·줄/심볼을 남겨줘.
  중첩 shared 경로가 선택될 경우 탐지 확장이 선행해야 하는 조건을 준비해줘.
- 현행 계약 버전/권위/링크/bootstrap·Guard 전제 및 원자적으로 전환해야 할 연결 사실.
- 승인된 구현/실행/오픈 검증 의무·의존 순서·환경·증거 요구와 Slice/예산 판단 입력.
  Slice 순서·물리 경로·버전 체계·Target/API/schema/file/class를 최종 동결하지 마.

4. 계획 §6 보존 조건 전체를 유지해줘.
기존 Auth/게임 무이관·네 문서 baseline/유효override/수동gate,
STEP4A 전체 완료 경로/T01~03,
CP0075/D0010 A/C/P·knownexpiry 뒤 새A금지·동일transaction lateC제한/실제C관측·
새P/retry fresh인가·owneranchor·최초60초/terminal,
D0006~10 성능/비용/기록/삭제/탈퇴/backup/복원/운영 UNKNOWN을 유지해줘.
Registry 단일metadata·Snapshot/Reconnect 선택모델 단일 최종채택/복구·Shell 공통/local,
BGM 기존본체+내부최소수명/H1 무보완연결보류·Invite 전구간identity/사이트handler/dialog/H2~4,
STEP5B 공식결과/정정·producer-consumer·여섯중복·공개분리·Profile recipe,
STEP5C B01~12/R01~13·DB/非DB 동등안전·초기hostless/재대결host불성립/미정 조건을 보존해줘.
모든게임 Room/host/DOM/winner/score/XP 강제, multiplayer재대결 의무의 no-op/local우회,
Adapter 안의 새 권한/순서/수명/token/audio엔진, 미래미선택의 전체blocker 승격을 하지 마.
장르명으로 transport/renderer/tick/physics/prediction을 확정하지 마.

5. 관찰 사실 / 승인 요구 / 추론 / 미확인을 구분해 제출해줘.
E1~6 근거표, 전수 계승 입력표, 세 요청 추적표, 경로/권위/검증 source trace,
Astra 핵심 질문을 정리해줘. 실제 설계 blocker와 후속 구현·실행 의무를 분리해줘.
source/tests 존재나 문서 추적 성공을 행동 PASS·지원 완료로 표시하지 마.
실행이 필요한 의무 때문에 모든 설계 질문을 보류하지 마.

결과를 game-platform-vnext-step6-evidence.md로 자동 문서화하고,
이 파일을 실제 입력으로 사용할 다음 Astra 판단 프롬프트를 제공해줘.
계획 원본 identity/bytes를 보존하고 계획을 승인된 Target로 바꾸지 마.
다음 담당은 Astra이며 판단 실행은 다음 요청으로 남겨줘.

문서/채팅 제출 후 멈춰줘.
저장소 변경·branch/PR/checkpoint·핵심 선택/Target동결·rulebook/Guard 권위전환·
구현·실제시험·외부재조사·운영·구매/문의/job/dump/복원·병합/main·STEP7이후를 하지 마.
이번 결과로 STEP6 COMPLETED·사용자 판단 승인·행동PASS·지원완료를 선언하지 마.
```

