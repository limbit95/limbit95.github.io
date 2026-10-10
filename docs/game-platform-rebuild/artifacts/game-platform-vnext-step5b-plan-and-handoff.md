# Game Platform vNext STEP5B — 작업 계획 및 인계
작성 기준: 2026-10-09. 담당: Sol/Codex. 이 문서는 계획 준비 결과이며 STEP5B 핵심 판단안이나 정식 저장소 산출물이 아니다.

## 1. 목적과 현재 상태
STEP5B는 “게임 결과를 무엇으로 확정하고 어디까지 공개·통계·표현에 연결할 것인가, 무엇을 나중으로 남길 것인가”의 경계를 정하는 단계다. 기능을 나열했다고 구현을 약속하는 단계는 아니다.

| 항목 | 복원·대조 결과 |
|---|---|
| 저장소 / integration | limbit95/limbit95.github.io / feature/game-platform-vnext-integration |
| 계획 | game_platform_vnext_final_execution_plan.md, 개정 1.5 |
| 현재 판단 입력 기준 HEAD | `3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0` |
| STEP5A | COMPLETED / DESIGN_RESULT_APPROVED / INTEGRATION_MERGED |
| 실제 병합 증거 | [PR #414](https://github.com/limbit95/limbit95.github.io/pull/414), merged=true, merge SHA가 위 HEAD와 일치 |
| STEP5A 승인 대상 / 기록 | 결과 대상 d0786b12941aac9100702ea796110c9a20f8eb0e; 결과 승인 기록 b4135811fa2e3e859cda5eefc933ebe36b43a017; 병합 승인 기록 90e89d0e4e6957c093680cfc77e054d997fcb282 |
| 기준 이후 추가 변경 | 이번 원격 대조에서 없음 |
| STEP5B | 저장소 기록 NOT_STARTED. 이번 계획 문서는 상태를 변경하지 않음 |
| 행동 검증 | NOT_RUN. UNKNOWN 및 구현·실행 검증·오픈 의무 유지 |
| main | 69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09. vNext main 반영 미수행 |

AGENTS → 실행 계획 → rebuild README → CURRENT → CP0081 → PR414/원격 ref 순서로 복원했다. 병합 전 기록의 OPEN·미병합 문구는 당시 이력이며, 기록에 명시된 복원 조건과 실제 PR414 병합 증거를 함께 적용한다. 별도 병합 후 기록 작업을 STEP5B의 선행 의무로 추가하지 않는다.

## 2. 범위와 유지할 경계
실행 계획 STEP5B의 작업은 선택적 Result/Statistics/Meta Progression, Publication/Site Integration, Presentation/Sound의 계약 경계다. 필수 결과는 **지금 필요한 최소 계약 / 추후 모델로 확장 / 구현 보류** 표다. 아래는 확인 주제이며 아직 세 분류를 선택하지 않는다.

| 대상 | 다음 근거 준비에서 확인할 범위 | Astra 판단 지점 |
|---|---|---|
| Result / Statistics / Meta Progression | match/run 종료와 참여자 outcome; 공식 결과 식별·확정·정정·중복 처리; 통계·보상 소비 연결; 실제 consumer와 선택 모델의 필요 | 결과 생산·확정과 후속 소비의 책임 분리, 지금 필요한 최소 계약, 선택적 기능의 확장·보류 경계 |
| Publication / Site Integration | merge·구현·실제 공개 활성화의 구분; 공개 사실과 목록·공지·NEW 등의 표시 연결; 기존 사이트 경로와 승인 정책 | 공개 사실의 owner와 사이트 소비 경계, 필요한 공개 이벤트 식별 수준, 선제 자동화 없이 필요한 계약 범위 |
| Presentation / Sound | 공식 결과·관람자별 표현의 구분; 기존 결과 UI·연출·audio consumer; Shell/BGM의 승인된 재사용 및 수명 보완 경계 | 공통 표시·소리 연결과 게임별 표현·곡·mode·연출의 경계, 선택 모델별 표현 계약 |
| Profile / Capability 필요성 | 실제 Probe에서 필요한 기능과 반복 증거. 파일·기능 이름만으로 공통화 필요성을 확정하지 않음 | 지금 선제 도입이 필요한지, 나중 모델로 확장할지, 구현을 보류할지 |

모든 게임에 승자·점수·XP를 강제하지 않는다. Profile은 조합 recipe이며 새 엔진이나 승격 등급으로 확대하지 않는다. STEP5A Registry의 두 번째 metadata 목록을 만들지 않는다. Snapshot/Reconnect는 선택 모델의 하나의 최종 채택·복구 책임을 유지한다.

기존 Auth·게임 무이관, STEP4A 전체 완료 경로/T01~03, STEP4B CP0075/D0010의 현재 유효한 부분 대체를 보존한다. 알려진 만료 뒤 새 A 금지, 동일 transaction의 제한적 late C 수용, 새 P/retry 인가, owner anchor, 최초 60초 및 terminal 보호를 재결정하지 않는다.

STEP5A Shell의 순수 표시 재사용과 게임별 UI·결과 연출 local 경계, BGM 기존 본체 재사용 및 내부 최소 수명 보완 방향을 입력으로 삼는다. 무보완 BGM 연결을 vNext 사용 가능으로 바꾸지 않는다. Invite/BGM 제한적 보류 H1~4는 범위 그대로 유지하고 비room 초대 등 미래 미선택 항목을 전체 STEP5B blocker로 확대하지 않는다.

STEP5C 장르 규칙, STEP6 Target·파일 배치·구체 API 동결, 구현·실제 시험·운영 변경은 범위 밖이다.

## 3. 재사용 입력과 새로 확인할 사실
아래는 입력 지정이다. 이번 계획 준비에서 이 파일들을 전부 재분석한 것은 아니다. 다음 Sol 작업은 관련 절만 읽고 승인 근거와 사실 근거를 구분한다.

| 입력 묶음 | 재사용 목적 | 새 확인의 제한 |
|---|---|---|
| STEP1 as-is §4~5 / source inventory / clause succession 및 관련 조항표 | 기존 게임·사이트·공통 기능과 결과·공개·표현 요구의 출처 | inventory와 기준 HEAD의 blob을 먼저 대조. 변하지 않은 근거를 재사용하고 consumer 연결·빈 근거만 추가 확인 |
| STEP2 implementation selection / game spec rationale | 선택 모델·Probe와 기존 게임 보존, 선택적 기능의 필요 근거 | 현재 코드 존재를 지원 완료로 해석하지 않음 |
| STEP3 stress / transition / risks | 결과 중복·정정, context 전환, 늦은 완료·오류·정리 경계와 후속 의무 | 관련 시나리오만 연결하며 stress 검증을 실제 실행하지 않음 |
| STEP4A responsibilities / lifetime / source trace | Core·runtime/model·capability·Site Adapter·game-local·backend 책임, 전체 완료 경로 | 새 책임 충돌에 필요한 좁은 호출부만 확인 |
| STEP4B runtime / security-site / closeout / verification / risks | 공식 상태·권한·동기화·사이트 정책 및 유효 결정 | 공급자 조사·운영 정책 결정을 반복하지 않음 |
| STEP5A selection / duplication / owners / source trace / validation | 승인된 본체·연결·local 경계와 제한적 보류 | 결과·공개·Sound에 관련된 연결만 보완. STEP5A 핵심 판단 재수행 금지 |
| DECISIONS와 관련 checkpoint | 유효 결정과 대체 관계 | 과거 HOLD·strict C를 현재 요구로 떼어 읽지 않음 |

새로 확보할 자료는 다음에 한정한다.
- 공식 결과·종료·outcome·정정·중복의 실제 의미, API 전제, 생산자→연결→consumer 경로.
- 사이트 공개 사실·목록·공지·표시가 어떤 owner와 경로로 연결되는지.
- 결과 UI·연출·Sound의 실제 consumer, 공통 부품과 게임별 의미, 생성·구독·전환·정리·늦은 완료 채택의 owner.
- 실제 Probe 필요와 반복 근거. 테스트 위치와 정적으로 확인 가능한 검증 범위, 실행해야 알 수 있는 부분.

경로 탐색 후보는 js/pages/games.js, games/shared/registry.js, js/game-audio/, docs/game-bgm.md 및 기존 게임의 결과·runtime·release 관련 파일이다. 결과 관련 이름의 파일이나 SQL 존재 자체는 공식 결과 계약의 증거가 아니다. source inventory에서 좁혀 필요한 consumer만 읽고 모든 SQL·게임·사이트를 포괄 감사하지 않는다.

## 4. 작업 순서와 모델 분담
| 순서 / 담당 | 목적·입력 | 확인 범위 | 산출물 / 완료 조건 | 다음 작업으로 넘길 항목 |
|---|---|---|---|---|
| 1. Sol/Codex | §3 승인 입력과 기준 HEAD로 사실·근거 준비 | 관련 절 재사용, blob 대조, consumer·책임·근거 공백의 필요한 부분 | game-platform-vnext-step5b-evidence.md. 관찰 사실 / 승인 요구 / 추론 / 미확인 분리; 고정 SHA/blob·줄 또는 심볼; 최종 분류 없음 | Astra가 선택할 질문, 결론을 막는 최소 공백, 실행 단계 검증 의무, Astra 전달 프롬프트 |
| 2. Astra | Sol 근거와 승인 원문으로 핵심 경계 판단 | 세 범위 분류, 결과 확정·정정·중복과 표현, 공개 책임, Profile/Capability 필요성 및 owner 충돌 | game-platform-vnext-step5b-astra-judgment.md. 필수 3분류 표와 이유·consumer·조건·owner·보류 근거 명시 | 사용자 승인할 핵심 선택, 승인 후 Sol 문서 반영 항목 및 전달 프롬프트 |
| 3. Sol/Codex — 사용자 판단 승인 및 정식 반영 허용 후 | 실제 Astra 판단의 승인 범위 | 의미·조건·보류·source trace·링크·표·상태·허용 diff의 문서 정합성 | 현 관례의 정식 STEP5B 문서 및 필요한 기록. 사용자 최종 결과 검토 전 REVIEW_PENDING; 실제 시험 NOT_RUN | 최종 결과 검토 항목. 완료·병합·main 및 다음 단계는 각각 해당 승인 범위에 따름 |

Astra 판단 전에 Sol이 세 분류를 확정하지 않는다. 승인 뒤 Sol이 판단을 다시 수행하거나 사후 감사 단계를 추가하지 않는다. 기존 승인으로 해소할 수 없는 새로운 의미 충돌만 구체적으로 Astra/사용자에게 넘긴다. 단계별 결과는 자동으로 문서화하고 다음 담당 모델 및 그대로 사용할 전달 프롬프트를 함께 제시한다.

## 5. 필수 산출물과 종료 조건
정식 STEP5B 결과의 중심은 다음 표다. 실제 행별 선택은 Astra가 수행한다.

| 책임 단위·consumer/model | 분류: 지금 필요한 최소 계약 / 추후 모델로 확장 / 구현 보류 | 계약 경계·owner | 승인·source 근거 | 적용 조건·제외 범위 | 미확인·후속 검증 의무 |
|---|---|---|---|---|---|
| 판단 단계에서 작성 | 판단 단계에서 선택 | 책임 주체와 담당 모델 구분 | 고정 trace | 선택 모델과 game-local 경계 | 설계 blocker와 실행 확인을 구분 |

설계·문서 완료에는 실제 모델·consumer 필요에 따른 계약 경계, 공식 결과와 통계·공개·표현의 분리, 확정·정정·중복 책임, owner·호환·수명 조건, Profile/Capability 필요 또는 유보의 근거, 구현 약속으로 확대되지 않은 3분류 표, 원문과 문서의 의미 일치 및 사용자 결과 승인이 필요하다.

이것은 결과 정정·중복 방지, 권한, 늦은 완료, 브라우저 audio, 공개 활성화 등이 실제 작동했다는 증거가 아니다. 이 항목의 구현·실행 검증·오픈 의무와 UNKNOWN은 유지한다. 테스트가 있다는 이유로 PASS·지원 완료를 선언하지 않는다.

이번 **계획 준비**의 종료 조건은 범위·입력·작업 분담·산출물·게이트 및 첫 작업 프롬프트 제출이다. 저장소 STEP5B 상태와 파일을 변경하지 않고 여기서 멈춘다.

## 6. 이번 확인의 trace
| 실제로 읽거나 대조한 자료 | 고정 blob / 증거 |
|---|---|
| AGENTS.md | 2686a3c37502bbf1f7f2a9407640e78cc026dadb |
| game_platform_vnext_final_execution_plan.md | da353e2e64daef6b1b0b7267c21997bfd7cda4ed |
| docs/game-platform-rebuild/README.md | 15ca8abc232315d776fb225cb701d67e93ef6f9e |
| docs/game-platform-rebuild/CURRENT.md | cc4fc3898052a05d983855f0c34718d10cdb3133 |
| docs/game-platform-rebuild/checkpoints/CP-0081-step-5a-integration-merge-approved.md | 644975989c9219ad6c5e405bf3b936d2f471c7ec |
| STEP5A common-module-selection §4.7~4.8 | e80d67aa5a3fa74ffcd441fa977fd4755d6d4c85 |
| STEP5A compatibility-lifetime-verification 제한적 보류 | fb2fa919c12905153360209bb692a3adc626a42c |
| PR414 및 integration/main 원격 ref | §1 SHA 대조. 현재 tree 1057개 항목, truncated=false |

## 7. 다음 작업의 고정 입력 목록
모든 링크는 이번 기준 HEAD에 고정한다. 아래 blob 목록은 tree 대조이며 내용 전부를 이번에 새로 조사했다는 뜻이 아니다.

| 입력 파일 | 기준 blob |
|---|---|
| [docs/game-platform-rebuild/artifacts/step-1-as-is-audit.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-1-as-is-audit.md) | `f7929e663f9ba5465536bfecffad0f039156781c` |
| [docs/game-platform-rebuild/artifacts/step-1-source-inventory.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-1-source-inventory.md) | `0d407aa9020ceab4785c5745e67f826bfeb4b94c` |
| [docs/game-platform-rebuild/artifacts/step-1-clause-succession-table.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-1-clause-succession-table.md) | `18c3c76589a7db8303ca210886ba981dd8518813` |
| [docs/game-platform-rebuild/artifacts/step-2-implementation-selection.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-2-implementation-selection.md) | `52d209d250ba76f351ea13db33aa6259ba641e71` |
| [docs/game-platform-rebuild/artifacts/step-2-game-spec-selection-rationale.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-2-game-spec-selection-rationale.md) | `a5e7be7989c1daeedfb515f751aade754b7f1990` |
| [docs/game-platform-rebuild/artifacts/step-3-stress-matrix.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-3-stress-matrix.md) | `0236dccd268617edf14e6158f582cda9b25b8c8b` |
| [docs/game-platform-rebuild/artifacts/step-3-transition-scenarios.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-3-transition-scenarios.md) | `036dab34e4445fb1a6059b4ca6bce0545a74ae94` |
| [docs/game-platform-rebuild/artifacts/step-3-risks-and-followup.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-3-risks-and-followup.md) | `9f291884fc0de2e4e0ff65a43f6d92002f62c9a7` |
| [docs/game-platform-rebuild/artifacts/step-4a-responsibility-boundaries.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-4a-responsibility-boundaries.md) | `610efc904bdaec8881535d3405fe81102bd3d5df` |
| [docs/game-platform-rebuild/artifacts/step-4a-lifetime-contract.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-4a-lifetime-contract.md) | `5e40988234caba6cb605ea4c0b386a0a5b83b9c5` |
| [docs/game-platform-rebuild/artifacts/step-4a-contract-source-trace.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-4a-contract-source-trace.md) | `f549969caa3bfffb914bf276e594bb61c76668e8` |
| [docs/game-platform-rebuild/artifacts/step-4b-runtime-sync-contract.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-4b-runtime-sync-contract.md) | `a6cfe51029e3fc3b2b546222b6a6afb0ad428f14` |
| [docs/game-platform-rebuild/artifacts/step-4b-security-site-contract.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-4b-security-site-contract.md) | `e140c90d830ff891c2abd5e40b038249eeeb8ebf` |
| [docs/game-platform-rebuild/artifacts/step-4b-z1-decision-and-design-closeout.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-4b-z1-decision-and-design-closeout.md) | `f3232f64c846bf4b17fcea2ae0bf6baed90ffc03` |
| [docs/game-platform-rebuild/artifacts/step-4b-verification-specification.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-4b-verification-specification.md) | `91d41480837c6ca3486b28aa1c615177d0fabcea` |
| [docs/game-platform-rebuild/artifacts/step-4b-risks-and-followup.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-4b-risks-and-followup.md) | `5555a698f178eda9e7b9cd2e1a793a69ceb83482` |
| [docs/game-platform-rebuild/artifacts/step-5a-common-module-selection.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-5a-common-module-selection.md) | `e80d67aa5a3fa74ffcd441fa977fd4755d6d4c85` |
| [docs/game-platform-rebuild/artifacts/step-5a-duplication-prevention.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-5a-duplication-prevention.md) | `f43b06d3b728258789534a4d401132d3b0461cd7` |
| [docs/game-platform-rebuild/artifacts/step-5a-compatibility-lifetime-verification.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-5a-compatibility-lifetime-verification.md) | `fb2fa919c12905153360209bb692a3adc626a42c` |
| [docs/game-platform-rebuild/artifacts/step-5a-source-trace.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-5a-source-trace.md) | `3bafb8e95a4d3a854bad2bf5c25e9d1735369428` |
| [docs/game-platform-rebuild/artifacts/step-5a-validation.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/artifacts/step-5a-validation.md) | `c31951dd04afeb82465a5c6be871bc6ac4d55230` |
| [docs/game-platform-rebuild/DECISIONS.md](https://github.com/limbit95/limbit95.github.io/blob/3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0/docs/game-platform-rebuild/DECISIONS.md) | `ab4896bd01b591895d0e30946a810c41eaa74e5a` |

## 8. 다음 첫 작업
**Sol/Codex — STEP5B 판단 근거 준비.** 이 계획의 §9 프롬프트를 사용한다. 이번 계획 제출에 이어 자동으로 조사나 Astra 판단을 시작하지 않는다.

## 9. Sol/Codex 전달 프롬프트
아래를 그대로 전달한다.

```text
Game Platform vNext STEP5B의 판단 근거 준비만 진행해줘.

담당: Sol/Codex.
입력: game-platform-vnext-step5b-plan-and-handoff.md.
저장소: limbit95/limbit95.github.io.
integration: feature/game-platform-vnext-integration.
판단 기준 HEAD: 3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0.

목적은 Astra가 Result/Statistics/Meta Progression, Publication/Site Integration,
Presentation/Sound 및 실제 Probe 필요에 따른 Profile/Capability 경계를
판단할 수 있도록 사실과 승인 근거를 준비하는 것이다.
이번에는 세 가지 최종 분류·핵심 구조 선택·정식 STEP5B 저장소 산출물 작성·구현을 하지 마.

1. 첨부 계획을 먼저 읽어줘. AGENTS → 실행 계획 개정1.5 → rebuild README
→ CURRENT → CP0081 → PR414 순서로 필요한 상태를 복원하고 실제 원격 HEAD와 대조해줘.
이미 확인된 근거는 재사용하고 변경·충돌만 기준 SHA와 분리해줘.
STEP5A COMPLETED/승인/병합 완료, STEP5B NOT_STARTED, 행동 NOT_RUN,
UNKNOWN 및 구현·실행 검증·오픈 의무, main 별도 게이트를 유지해줘.
병합 전 기록은 실제 PR414 병합 증거와 함께 당시 이력으로 읽어줘.

2. 계획 §3/§7의 STEP1~5A와 DECISIONS 관련 부분을 재사용해줘.
source inventory와 고정 blob을 먼저 대조하고 기존 trace를 활용해줘.
새 source 확인은 consumer 연결·승인 요구와 비교할 지점·결론을 바꿀 공백에 필요한 범위만 읽어줘.
공급자·운영 정책 재조사, 전체 소스 감사, 별도 감사 단계를 추가하지 마.

3. 책임 단위별로 다음을 준비해줘.
- 실제 기능 의미·API 전제·consumer/model.
- 생산자 또는 공통 본체 → 연결 → 실제 consumer 경로.
- 결과 확정·정정·중복 처리와 통계·보상 소비, 공식 결과와 관람자별 표현의 현재 사실.
- merge·구현·공개 활성화, 공개 사실과 사이트 표시·공지의 현재 연결.
- 생성·구독·전환·정리 및 error/null/finally/cleanup/leave/effect를 포함한 늦은 완료 채택 owner.
- 승인 요구, 실제 Probe 필요와 반복 증거, 기존 테스트 위치·정적 확인 범위·미실행 부분.
- source 경로·고정 SHA/blob·줄 또는 심볼.
- Astra 질문. 설계 결론을 막는 공백과 후속 구현·실행에서 확인할 항목을 구분.

4. 기존 Auth·게임 무이관과 STEP4A/4B/5A 승인 경계를 보존해줘.
모든 게임에 winner/score/XP를 강제하지 마. Profile을 새 엔진으로 확대하지 마.
Registry 두 번째 metadata 목록을 만들지 않고 Snapshot/Reconnect의 선택 모델 단일 최종 채택·복구 책임을 유지해줘.
Shell 공통 표시와 게임별 UI·결과 연출, BGM 본체 재사용·필수 내부 최소 수명 보완·게임별 곡/mode를 구분해줘.
H1~4 제한적 보류는 그대로 유지하고 미래 비room Invite를 전체 blocker로 올리지 마.
CP0075/D0010의 유효 부분 대체, 알려진 만료 뒤 새 A 금지,
동일 transaction late C 제한 수용, 새 P/retry 인가, owner anchor,
최초60초·terminal 보호를 재결정하지 마.
현재 코드나 테스트 존재만으로 vNext 지원 완료·행동 PASS를 선언하지 마.

5. 관찰 사실 / 승인 요구 / 추론 / 미확인을 구분해
game-platform-vnext-step5b-evidence.md로 자동 문서화해줘.
대상별 근거표, 재사용/새 확인 source trace, Astra 핵심 질문과 최소 미확인,
후속 실행 검증 의무를 포함해줘.
다음 담당은 Astra이며, 그 문서를 입력으로 핵심 판단을 요청하는
그대로 사용할 전달 프롬프트도 함께 제공해줘.
Astra의 세 분류는 지금 필요한 최소 계약 / 추후 모델로 확장 / 구현 보류이다.
이번 Sol 요청 안에서 Astra 판단까지 진행하지 마.

읽기와 근거 준비 및 채팅 제출용 문서 작성만 허용한다.
저장소 파일 변경·branch/PR/checkpoint·구현·실제 시험·외부 재조사·운영 변경·
구매·문의·job/dump/복원·병합·main 반영·STEP5C 이후 없이 제출하고 멈춰줘.
```

