# STEP7C — 최소 Core 승인 대응·실제 경계

- **REVIEW_PENDING / FORMAL_RESULT_REVIEW_PENDING**. 사용자 2026-10-14 14:18:49 KST는 최소 Core 구현·관련 검증·commit/push·integration base 검토 PR 제출만 허용했다.
- 기준 integration e57e1fe8f34aa557259bf288f30c59e226db8f6c / treea0ebffe24a23819b5db1624b51f3699c467687e7. PR422 실제 병합·기록 head 동일 내용 및 착수 뒤 변경0 확인. CP0098/과거 artifact 미병합·검토대기는 당시 이력.
- [계획 전달 원본](game-platform-vnext-step7c-plan-and-handoff.md)은 Library에서135행 전체 읽고 exact15,565bytes를 보존했다. SHA256 b00962122062de6fd3dbe91893d40e83e22d2def3f9eafdf13dda2f39b68c526. 그 원문의 IMPLEMENTATION_NOT_STARTED는 계획 작성 당시 지위다.
- 승인 의미 재판단·새 Target/상위 완화/별도 사후 감사 없음. 필요한 절만 실제 읽고 기존 보존/ID·f/운영 증거를 재사용했다.

## 1. 승인 요구 → 코드/테스트 → 남는 owner

| 승인 owner/원문 | 실제 최소 구현·시험 | 남는 책임 |
|---|---|---|
| 루트 계획 STEP7C, Target §2.1/6.1, I1, AR1 | executionBindings가 기존 Registry lookup 참조 + 구성만 연결; core root2파일·flat test·실행 예. 기존 barrel/metadata 불변 | 실제 게임 등록/activation·지원은 별도 |
| STEP5A Registry/G1 및 수명 owner | register의 중복 거부/명시 교체/old disposer 사용권, 실제 Registry 원 객체 참조 테스트 | 두 번째 catalog 없음. 실행 구성은 표시·권한 metadata가 아님 |
| LI1, STEP4A §6.1, G2 | capture/commit은 로컬 수명 + 주입 모델 현재성 정책을 반영 직전 검사. reentrant policy 뒤 재검사. 모든 완료종류/T01~03·roomless 및 정상 양성 테스트 | 모델 context/ordering/인가·단일 adoption/recovery·실제 backend 권한은 model/backend |
| LI2, STEP4A §6.2, G3 | advance/dispose 선무효화, own/lease release memoization·역순/독립 실패 집계·late resource·부분 초기화 failure tests | 각 release가 캡처한 자기 자원/사용권을 실제 해제. cancel/실제 server leave/C/P 회수 아님 |
| LI3, STEP4A §5/7/8 | 비재사용 로컬 경계로 same-room new match/A→B→A/user-role-view 및 run/view 전환. 현재 명시 재검증 정상 사례 | Room/match/version 필수 의미나 전 모델 공통 UUID를 동결하지 않음 |
| 기존 모델/검사 admission | resolveModel 기본 null·모델 revision 일치·unknown 조합 거부. models:[] 및 기존 runtime/online Guard unchanged | fixture handle 형태/정책 true가 지원·oracle/환경 증거가 아님 |

직접 추가된 STEP4A/5A/6/LI 요구를 임의 legacy ID/f로 재명명하지 않는다. 기존 관련 LEGACY-DEV-272/f0(L538, LI2; C041)의 구독/listener 정리, Registry LEGACY-DEV-198~219의 기존 적용 의미는 [승인 전수 대응](step-6-clause-destinations.md)의 부모/조건/원 owner와 함께 참조한다. DEV271 전달/복구와 DEV251 payload/최종 truth는 분리하여 보존한다. 특정 ID가 Core 구현 전체를 증명한다고 쓰지 않는다.

## 2. 실제 exports와 조립 제약

[games README](../../../games/README.md#step7c-최소-core--구현검토-대기)의 실제 exports/사용 예가 단일 사용 안내다. createExecutionScope, createExecutionBindings만 새 공개 함수다. Node/DOM/서버/특정 게임 역참조·전역 bus/update loop·Profile/모델 엔진 없음. Registry metadata import는 승인된 단일 출처 연결이며 catalog 복제가 아니다.

isApplicable는 동기·부수효과 없는 model/consumer 검사, apply는 하나의 동기 반영이다. await/외부 재진입·후속 callback은 밖에서 수행하고 실제 반영 직전 다시 commit한다. Core는 임의 사용자 JavaScript를 sandbox로 통제하지 않는다. async callback을 지원한다고 표기하지 않는다. Core 초기화 value는 구성 결과이며 authoritative LIVE 상태가 아니다.

register 교체는 이전 scope를 즉시 무효화하며 previousDisposal을 호출자가 await해 관측한다. configuration lease의 수명과 각 실행 scope 수명은 다르다. run.dispose는 실행 자원만 정리하고 persistent 구성 등록은 registration.dispose가 제거한다. 자원 release가 자기 dispose 완료를 기다리는 순환 의존을 만들지 않는다. 실패를 자동 재시도하거나 정리 완료로 바꾸지 않는다.

## 3. 고정 입력 blob

아래는 base tree의 source 식별이다. 전체 source/SQL를 새로 감사했다는 선언이 아니다.

| 경로 | blob |
|---|---|
| game_platform_vnext_final_execution_plan.md | da353e2e64daef6b1b0b7267c21997bfd7cda4ed |
| docs/game-platform-architecture.md | 62b58526bd61fae491b59ed4b6c3c96681bfc9 |
| docs/game-platform-lifetime-contract.md | 04414560ac16303d42b1fe409b80c3739d073755 |
| artifacts/step-4a-lifetime-contract.md | 5e40988234caba6cb605ea4c0b386a0a5b83b9c5 |
| artifacts/step-5a-common-module-selection.md | e80d67aa5a3fa74ffcd441fa977fd4755d6d4c85 |
| artifacts/step-5a-compatibility-lifetime-verification.md | fb2fa919c12905153360209bb692a3adc626a42c |
| artifacts/step-6-target-architecture.md | 4c12e5a5ce88aa7ea71a83c7180ad34aec1c1a12 |
| artifacts/step-6-slices-and-verification.md | 000a87c4dbd249d8266c583196d3b43d31e3f83c |
| games/shared/registry.js | afa4ba25824157534eca7ca7538b89571cfca30e |
| games/shared/index.js | 96041e478da57e87f3248be1e1d539e8dbdd6939 |
| scripts/check-game-platform-governance.mjs | 3f2196b502c5ce7a296ecb1b826e4bb9214a1850 |
| scripts/check-game-platform-vnext-boundaries.mjs | 66d965f1ea938b3971a63513776f8fa1b1aa127e |
| tests/game-platform-vnext-model-oracles.json | 8e3e1dc4858a08aa46190aa53ba320d565206cf4 |

## 4. 보존·미실행·다음

[STEP7B 계획 §7 전체](game-platform-vnext-step7b-plan-and-handoff.md#7-반드시-유지할-조건)와 승인 Target/I1을 유지한다. STEP4A 모든 완료/T01~03·current A/C/P·known expiry 뒤 새 A 금지/동일 적법 transaction 일반 저장 late C 제한/actual C/fresh A·P/retry/owner anchor/최초60초/terminal/부분대체·D0006~10, H1~4/단일metadata/단일채택·복구/Shell-local, 결과정정/여섯중복/공개분리/Profile, B01~12/R01~13/안전11/DB-nonDB동등안전/hostless·미승인 재대결 예외 금지·DEV271/DEV251 구분을 보존한다.

기존 Auth/게임/API/SQL/Registry/barrel/네 문서·승인 원본/artifacts/계획/DECISIONS/과거 CP·원ID/줄/강도/부정/조건/부모/예외/f0/명시f·단일owner/L/H/I 비승격 및 baseline/override/manual gate/기능·디자인 기록 책임 유지. source/SQL 전수 재감사·외부/운영 재조사·별도 사후 감사 없음.

빈 models·미구현 미지원·vNext runtime/online 차단·기존 online DB 요구·server 제외 미확인 차단 유지. Core unit은 실제 모델/게임 지원 또는 실제 행동 PASS가 아니다. 실제 게임/DB/browser/audio/두 client/성능/운영 **NOT_RUN**, 실행/운영 **UNKNOWN**. 모델/Backend/H1~3/Probe/지원/공개제외/운영 등 전체 후속 의무는 별도다.

다음 첫 작업: **Astra의 고정 remote STEP7C 제출본 최종 검토**. REVIEW_PENDING 유지. 최종 승인·완료 기록·병합·main·STEP7D 이후·실제 구현/행동 시험은 수행하지 않는다.
