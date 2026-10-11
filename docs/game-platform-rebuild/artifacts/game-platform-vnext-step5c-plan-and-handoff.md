# Game Platform vNext STEP5C — 작업 계획과 모델 인계

작성: 2026-10-10 KST · 담당 Sol/Codex
기준 저장소: limbit95/limbit95.github.io
integration: feature/game-platform-vnext-integration
고정 계획 기준 SHA: `2751e9241a3debbd40506fa1b2ea7e688dfe0140`

이 문서는 계획 준비 산출물이다. STEP5C 판단 결과·현행 장르 rulebook·정식 저장소 산출물·사용자 설계 승인을 대신하지 않는다. 이번 사용자 “진행하자”는 직전 안내의 STEP5C 계획 준비 착수로 적용했다. 조사·핵심 판단·정식 반영은 다음 작업 요청으로 구분한다.

## 1. 목적을 쉬운 말로

보드게임에서 축적한 좋은 개발 규칙은 잃지 않고, 움직임·동시 조작·시간·복구가 중요한 비보드게임은 그 경험에 맞는 규칙을 따로 설계한다. 두 규칙이 같은 플랫폼의 공통 계약을 참조하도록 연결한다.

장르 이름으로 실행 모델을 정하거나 장르마다 별도 Core를 만드는 작업이 아니다. STEP5C는 규칙의 내용과 논리적 책임을 설계하며, 실제 경로·권위 전환·API/schema/class/Target 동결은 STEP6, 현행 규칙의 실제 계승·신규 장르 문서 적용은 STEP7A2/7A3의 후속 작업이다.

## 2. 현재 상태와 실제 증거

AGENTS → 계획 → rebuild README → CURRENT → CP0084 → PR415 순서로 원문을 확인했다. 파일 전체를 수신하고, 계획 §3/STEP5C·6 및 기록의 현재 복원 조건을 중점 확인했다.

| 항목 | 확인 결과 |
|---|---|
| 실행 계획 | 개정1.5, blob `da353e2e64daef6b1b0b7267c21997bfd7cda4ed` |
| AGENTS | blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb` |
| STEP5B | COMPLETED / DESIGN_RESULT_APPROVED / INTEGRATION_MERGED |
| PR415 | CLOSED / merged=true / base integration |
| 실제 merge / 원격 integration HEAD | `2751e9241a3debbd40506fa1b2ea7e688dfe0140` |
| merge 시각 | 2026-10-10 11:44:49 KST |
| merge parents | `3b917fa9c0afb1bdc022566ff2ae8c2f1be311c0` / `a71097d469781dbc0c8b441dce93da6f1057506c` |
| merge tree | `9cb576eebf6014602416f77f1bbb92dd1e68aba5`。직전 병합 검증의 승인 최종 head tree 일치 근거 재사용 |
| 기준 뒤 추가 변경 | 현재 원격 HEAD와 고정 기준 일치, 추가 변경0 |
| main | `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09`, 별도 반영 없음 |
| STEP5C 저장소 기록 | NOT_STARTED 유지. 이번 계획 문서 때문에 CURRENT/checkpoint를 수정하지 않음 |
| 행동/운영 검증 | NOT_RUN · UNKNOWN · 구현/실행/오픈 의무 유지 |

CURRENT/README/CP0084의 OPEN·미병합은 병합 전 저장 이력이다. CP0084가 규정한 실제 merged/parents/tree 확인과 PR415 증거로 현재 상태를 복원한다. 과거 검토대기·HOLD·strict C만 떼어 현재 요구로 쓰지 않는다.

증거: [PR415](https://github.com/limbit95/limbit95.github.io/pull/415), [merge](https://github.com/limbit95/limbit95.github.io/commit/2751e9241a3debbd40506fa1b2ea7e688dfe0140), [계획](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/game_platform_vnext_final_execution_plan.md), [CURRENT](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/CURRENT.md), [CP0084](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/checkpoints/CP-0084-step-5b-integration-merge-approved.md).

## 3. 재사용 입력과 새 확인의 구분

아래는 다음 근거 준비에서 사용할 입력 목록이다. 이번 계획 준비에서 이 목록의 전 문서를 새로 분석했다고 주장하지 않는다.

| 입력 | 재사용할 부분 | 새 확인이 필요한 부분 |
|---|---|---|
| 계획1.5 §2~3/STEP5C·6·7A2·7A3 | 통합 플랫폼, 규칙 계승, 장르 최소6항목, 설계/동결/적용 단계 경계 | 현재 기준 원문 확인 완료. 새 정책 선택 없음 |
| STEP1 succession / clauses-platform / clauses-design / inventory | 원래 ID·강도·조건·예외·부모절·공통/보드/모델 후보, 기존 source blob | STEP5C 관련 조항의 원문·도입문·blob 대조만. STEP1 전수 감사 반복 없음 |
| STEP2 genre-rule-index | 공통/보드/새 장르 후보, 49개 선택 조항 제안, 초기 hostless/재대결 hostless/미정 구분 | 49행을 전수 계승표로 오해하지 않음. 보드 계승 묶음과 신규 장르 차이를 연결 |
| STEP2 implementation-selection / game-spec-selection-rationale | 장르와 실행 특성의 독립 축, 네 문서 기록 책임 | 첫/둘째 Probe에서 필수·선택·미선택인 축을 구분할 근거 |
| STEP3 stress-matrix / transition-scenarios / risks | S3-C02 실시간2D협동, C09 방/host 없음, C10 역할/관전·중도 참가, 필요 시 C11 장기성 | 첫 Probe의 제한된 경험에 필요한 조작·공간·시간·중단/복구·품질 공백. 둘째 Probe 선택 자체는 앞당기지 않음 |
| STEP4A responsibility / lifetime | 공통/모델/local 책임, 모든 완료 경로와 T01~03 | 장르 요구의 검증 조건 연결. 새 수명 기법 선택 없음 |
| STEP4B runtime-sync / security-site / Z1 closeout / verification | 승인 모델·권위·인가·운영 요구 및 D0010 대체 범위 | 규칙 문서에서 참조할 요구와 장르별 측정 조건. 공급자/운영 정책 재조사 없음 |
| STEP5A 선택/owner와 STEP5B 계약/중복/owner | 공통 모듈·결과·공개·표현 경계, Probe 필요/반복 기준 | 새 장르 특성이 실제로 추가 계약을 요구하는 부분만. 재사용 선택 재판단 없음 |
| DECISIONS 유효 결정 | 최신 유효 결정과 부분 대체 관계 | 과거 문구 충돌 시 해당 결정·원문 부분만 확인 |

이번 계획 준비에서 STEP2 장르 인덱스와 STEP1 계승표를 수신해 적용 범위를 확인하고, STEP3 matrix의 관련 사례를 확인했다. 그 이상 source/SQL/게임 전체 조사나 외부 조사를 진행하지 않았다.

### 입력 경로와 고정 blob

모든 경로는 위 고정 commit에서 존재함을 tree로 확인했다. 아래 blob은 내용 전체를 이번에 재분석했다는 표시가 아니다.

| 입력 파일 | 고정 blob |
|---|---|
| [step-1-clause-succession-table.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clause-succession-table.md) | `18c3c76589a7db8303ca210886ba981dd8518813` |
| [step-1-clauses-platform.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-platform.md) | `e1a6515b38db0164146ca3a51fc29aae60275c6a` |
| [step-1-clauses-design.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-clauses-design.md) | `981555ea5fab6b3899ebd03599bac7e992f51691` |
| [step-1-source-inventory.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-1-source-inventory.md) | `0d407aa9020ceab4785c5745e67f826bfeb4b94c` |
| [step-2-genre-rule-index.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-2-genre-rule-index.md) | `1c1f103adf56a160f1fba8e993cd7c38bbcf09e8` |
| [step-2-implementation-selection.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-2-implementation-selection.md) | `52d209d250ba76f351ea13db33aa6259ba641e71` |
| [step-2-game-spec-selection-rationale.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-2-game-spec-selection-rationale.md) | `a5e7be7989c1daeedfb515f751aade754b7f1990` |
| [step-3-stress-matrix.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-3-stress-matrix.md) | `0236dccd268617edf14e6158f582cda9b25b8c8b` |
| [step-3-transition-scenarios.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-3-transition-scenarios.md) | `036dab34e4445fb1a6059b4ca6bce0545a74ae94` |
| [step-3-risks-and-followup.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-3-risks-and-followup.md) | `9f291884fc0de2e4e0ff65a43f6d92002f62c9a7` |
| [step-4a-responsibility-boundaries.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-4a-responsibility-boundaries.md) | `610efc904bdaec8881535d3405fe81102bd3d5df` |
| [step-4a-lifetime-contract.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-4a-lifetime-contract.md) | `5e40988234caba6cb605ea4c0b386a0a5b83b9c5` |
| [step-4b-runtime-sync-contract.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-4b-runtime-sync-contract.md) | `a6cfe51029e3fc3b2b546222b6a6afb0ad428f14` |
| [step-4b-security-site-contract.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-4b-security-site-contract.md) | `e140c90d830ff891c2abd5e40b038249eeeb8ebf` |
| [step-4b-z1-decision-and-design-closeout.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-4b-z1-decision-and-design-closeout.md) | `f3232f64c846bf4b17fcea2ae0bf6baed90ffc03` |
| [step-4b-verification-specification.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-4b-verification-specification.md) | `91d41480837c6ca3486b28aa1c615177d0fabcea` |
| [step-5a-common-module-selection.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-5a-common-module-selection.md) | `e80d67aa5a3fa74ffcd441fa977fd4755d6d4c85` |
| [step-5a-compatibility-lifetime-verification.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-5a-compatibility-lifetime-verification.md) | `fb2fa919c12905153360209bb692a3adc626a42c` |
| [step-5b-contract-boundaries.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-5b-contract-boundaries.md) | `fb3c782d6aad08126c452099c6f67441ece20fd0` |
| [step-5b-duplication-and-extension.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-5b-duplication-and-extension.md) | `b51394438a5bcedd284892c7552576fc90213f0a` |
| [step-5b-compatibility-lifetime-verification.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/artifacts/step-5b-compatibility-lifetime-verification.md) | `6dfa14d0c3056dc12d1388e9ab7295729137cc4a` |
| [DECISIONS.md](https://github.com/limbit95/limbit95.github.io/blob/2751e9241a3debbd40506fa1b2ea7e688dfe0140/docs/game-platform-rebuild/DECISIONS.md) | `ab4896bd01b591895d0e30946a810c41eaa74e5a` |

## 4. 대상별 확인 범위

| 대상 | 근거 준비 범위 | Astra 판단 범위 | 후속으로 남길 것 |
|---|---|---|---|
| 보드게임 규칙 계승 | 기존 의무의 ID·강도·조건·예외와 공통/보드/모델/local 연결 후보 | 논리적 계승 묶음, 분할/참조 책임, 범위 긴장 해소안 | 실제 경로/조항 목적지 확정 STEP6, 현행 규칙 전환 STEP7A2 |
| 첫 비보드 Probe 규칙 | 실시간 협동/공간형 경험의 흐름·입력·공간·시간·가시성·복원·품질 근거 | 기존 보드 전제를 채택하지 않을 이유, 최소 적용 규칙과 선택 계약 | 구체 Probe/game/renderer/transport/빈도 선택·구현·실행 |
| 둘째 Probe의 규칙 필요성 | 방/host 없는 로컬 또는 비동기·기록형의 차이와 기존 규칙으로 설명 가능한 범위 | 기존 묶음+모델 조건으로 충분한지, 별도 묶음이 필요한 조건 | 실제 Probe 선택/네 문서 bootstrap·개발 |
| 공통/장르/모델 연결 | 같은 의무의 현재 owner·참조 흐름·충돌 후보 | 한 의미의 책임 문서, 중복 회피, 혼합 장르 적용/충돌 처리 | 물리 파일/Guard/권위 전환 동결·적용 |
| 신규 장르 추가 절차 | 기존 조사→네 문서→선택→검증 흐름, 자료·권리 확인 및 변경관리 | 기존 묶음 재사용/보완/신규 작성의 조건·검토 owner·게이트 | 신규 게임 요청의 실제 개별 조사 |

장르 최소6항목은 범위/출처, 플랫폼 연결, 독립 장르 요구, 개발/네 문서 보완, 검증/완료 기준, 권위/이력이다. 항목 비적용은 이유를 기록한다. 수치·장치·성능 기준은 승인 공통 요구와 장르별 추가 측정 조건을 구분하고, 근거 없이 새로운 수치 의무를 만들지 않는다.

## 5. 실행 순서와 모델 분담

| 순서/담당 | 목적 | 입력/확인 범위 | 산출물 | 완료 조건 | 다음 인계 |
|---|---|---|---|---|---|
| 1 Sol/Codex | Astra 판단에 필요한 근거 준비 | §3 입력 중 관련 절; 원문 조항/blob; 첫 Probe의 독립 요구. 외부 근거는 기존 승인 자료를 먼저 재사용하고, 결론에 필요한 장르 요구 공백에 한해 공식 1차자료를 최소 확인 | game-platform-vnext-step5c-evidence.md: 계승 근거표, 장르 요구 근거, 연결 후보, 질문/미확인 | 사실/승인 요구/추론/미확인 분리, 최소6항목 근거 또는 정확한 공백, 원래 의무 강도 보존, source trace | Astra가 결정할 경계·범위 긴장·둘째 Probe 필요성. 근거 준비 결과 문서와 Astra 전달 프롬프트 |
| 2 Astra | 장르 규칙 설계의 핵심 경계 결정 | 근거 문서+승인 원문. 결론을 바꿀 충돌/공백 부분만 추가 읽기 | game-platform-vnext-step5c-astra-judgment.md: 보드 계승 설계, 비보드 규칙 내용 초안, 공통/장르/모델 연결표, 추가 절차, 승인 항목 | 최소6항목의 책임/조건·미선택 범위 명시; 보드 복제·별도 플랫폼·공통 의무 누락 방지; 설계 blocker/실행 의무 분리 | 사용자 핵심 판단 승인; 승인 뒤 Sol/Codex 반영 프롬프트 |
| 3 사용자 → Sol/Codex | 승인된 설계만 정식 문서에 반영 | 실제 Astra 원본 및 승인 범위; 최신 integration/유효 STEP5C branch·PR | rebuild 관례의 정식 설계 문서와 원본 보존, 필요한 현재 기록, 문서 검증, integration base 검토 PR | 원문 의미/조건/보류/ID/source/link/허용diff/원격 read-back 일치; REVIEW_PENDING; 행동 NOT_RUN | 사용자 정식 결과 최종 검토 |
| 4 사용자 → Sol/Codex | 결과 승인·완료 기록, 이후 별도 병합 게이트 | 승인된 PR 최종 head | 승인/완료 기록 원격 보존; 명시적 별도 허용 때만 integration 병합 | 결과 승인과 병합/main/STEP6 허용 분리 | 사용자 다음 STEP 진행 여부 결정 |

이번에 수행한 것은 이 계획 준비뿐이다. 위1~4는 실행된 작업이 아니다. 별도 사후 감사·조사→판단→재조사 반복을 기본 단계로 추가하지 않는다. 새 의미 충돌이 있을 때만 해당 행·원문·영향을 Astra/사용자에게 전달한다.

## 6. 필수 산출물과 종료 조건

STEP5C의 필수 결과는 보드게임 규칙 계승 설계, 비보드 장르 규칙 초안, 공통/장르/모델 연결표다. 둘째 Probe의 별도 규칙 필요성 판단과 신규 장르 추가 절차를 포함한다.

설계 종료 조건:

- 원래 의무·조건·예외·부모절·ID를 추적하고 논리적 책임을 제시한다. 일부49행만으로 전수 계승 완료를 선언하지 않는다. 실제 전수 목적지 확정은 STEP6/7의 의무로 남긴다.
- 비보드 초안이 §3 최소6항목을 채우고, 독립 장르 요구와 계승한 공통 절차를 구분한다.
- 공통/장르/모델/local 의미 owner를 연결하고 혼합 장르의 충돌 처리 및 상위 변경 게이트를 명시한다.
- 코드 없는 설계/문서 검증과 구현·실행·오픈 의무를 분리한다. 초안 작성이나 기존 테스트 존재는 행동 PASS/지원 완료가 아니다.
- 사용자 핵심 판단 승인, 정식 반영, 사용자 최종 결과 검토, integration 병합, STEP6 진행을 각각 구분한다.

후속 실행 의무: 실제 다중 client 권한·정보 격리·복원·순서/최신성·전체 완료 경로, 조작·접근성·반응성·성능·수동 디자인 검토, H1/H2~4 보완·운영/오픈 조건. 이번 계획/근거 준비/설계만으로 PASS 처리하지 않는다.

## 7. 반드시 보존할 경계

- 기존 Auth/게임 무이관. 게임별 규칙·디자인 baseline·출시 이력 보존.
- 모든 게임에 Room/host/DOM/winner/score/XP를 강제하지 않는다. 현행 hostless/rematch 긴장은 초기 시작·재대결·정책 미정으로 분리하고 no-op/local 우회로 의무를 없애지 않는다.
- STEP4A success/error/null/finally/cleanup/leave/effect/후속 완료와 T01~03 유지. room ID/version만으로 수명 충족을 단정하지 않는다.
- CP0075/D0010: known expiry 뒤 새 A 금지, 적법한 동일 transaction late C 제한 수용/실제 C 관측, 새 P/retry fresh 인가, owner anchor, 최초60초, terminal 보호. D0006~10 성능/비용/기록/삭제/탈퇴/백업/복원/운영 UNKNOWN 유지.
- Registry 두 번째 metadata 목록 금지. Access/표시 metadata는 backend 인가 집행 대체물이 아니다.
- Snapshot/Reconnect는 선택 모델의 단일 최종 채택·복구 책임 유지. Shell 공통 표시와 game-local UI/결과 연출 분리.
- BGM 기존 본체 재사용+내부 최소 수명 보완, H1 무보완 연결 보류. Invite 전구간 identity·사이트 handler/dialog owner·H2~4, 비room 미래 미선택을 전체 blocker로 확대하지 않음.
- STEP5B 종료/공식 결과/참여자 outcome/viewer 표현, producer/통계·보상 consumer, 여섯 중복 의미, correction≠새 경기 집계 유지. 예측/동일 snapshot 재적용은 확정 보상·효과 재발행 근거가 아니다.
- merge/구현/activation/공개 사실/NEW·공지 소비 분리. Profile은 반복 검증 조합의 recipe, 선제 보상/공개/audio/Profile 엔진 없음. Adapter에 새 권한/순서/수명/token/audio 엔진을 숨기지 않는다.
- STEP6 Target/API/schema/file/class/물리경로 동결과 STEP7의 실제 규칙/Guard 적용을 앞당기지 않는다.

## 8. 이번 수행·검증과 다음 첫 작업

수행: 상태 원문 읽기, 실제 원격 HEAD/PR415 merged/merge parents/tree/main 조회, 관련 승인 입력의 경로/blob 확인, 계획/인계 문서 작성. 계획의 입력 목록은 고정 tree에서22경로 존재 확인. 저장소 변경·branch/PR/checkpoint 생성·실제 시험·외부 장르/공급자 조사·운영 작업은 없음.

다음 첫 작업 하나: **STEP5C 판단 근거 준비**.
담당: **Sol/Codex**. Astra의 핵심 판단과 정식 저장소 반영은 아직 수행하지 않는다.
아래 §9를 그대로 전달하면 된다. 이 문서에 프롬프트가 존재하는 것 자체는 실행 허용이 아니다.

## 9. 다음 Sol/Codex 전달 프롬프트

```text
Game Platform vNext STEP5C의 판단 근거 준비만 진행해줘.

담당: Sol/Codex.
입력: game-platform-vnext-step5c-plan-and-handoff.md를 실제 읽어줘.
저장소 limbit95/limbit95.github.io.
integration feature/game-platform-vnext-integration.
고정 기준 SHA 2751e9241a3debbd40506fa1b2ea7e688dfe0140.

목적은 Astra가 보드게임 규칙의 계승 위치와 첫 비보드 Probe의 실시간 협동/공간형
규칙을 설계할 수 있도록 사실·승인 근거를 준비하는 것이다.
이번에는 핵심 경계 판단·장르 규칙 최종 초안·정식 저장소 반영·구현을 하지 마.

1. AGENTS → 계획1.5 → rebuild README → CURRENT → CP0084 → PR415 순서로
필요 상태를 복원하고 실제 원격 HEAD와 고정 SHA를 대조해줘.
계획에서 확인된 근거는 재사용하고 변경·충돌만 분리해줘.
STEP5B COMPLETED/DESIGN_RESULT_APPROVED/INTEGRATION_MERGED,
STEP5C 기록 NOT_STARTED, 행동 NOT_RUN·UNKNOWN·구현/실행/오픈 의무,
main 별도 게이트를 유지해줘. 이번 근거 준비 때문에 저장소 상태 기록을 바꾸지 마.
CP0084/CURRENT의 과거 OPEN·미병합은 실제 PR415/Git과 함께 당시 이력으로 읽어줘.

2. 첨부 §3의 STEP1~5B와 DECISIONS 관련 부분을 재사용해줘.
STEP1 조항 ID·부모·강도·조건·예외·source inventory/blob,
STEP2 genre index/선택축/네 문서 근거,
STEP3 S3-C02/C09 및 필요한 전환·역할/가시성 사례를 먼저 연결해줘.
49개 선택 조항을 전수 계승표로 오해하지 마.
이미 승인된 STEP4A/B·STEP5A/B의 판단을 다시 수행하지 마.
source/규칙 원문은 관련 조항·결론을 바꿀 공백만 읽고 전체 source/SQL 감사를 하지 마.

3. 아래 근거를 준비해줘.
- 보드게임 규칙: 논리적 계승 후보별 원문 ID/강도/범위/예외/현재 owner,
  공통·보드·기술모델·game-local 분리 시 보존해야 할 의미와 범위 긴장.
- 첫 비보드 Probe: 실시간 협동/공간형의 플레이 흐름·입력·공간/카메라·시간·
  권위·가시성·시작/중단/복구/종료·접근성·반응성·성능·검증 요구의 근거.
  기존 보드 전제를 그대로 적용하면 생길 차이를 사실/추론으로 분리해줘.
- 둘째 Probe: 방/host 없는 로컬 또는 비동기·기록형의 기존 규칙 적용 가능 근거,
  별도 규칙 필요성을 Astra가 판단할 질문. 실제 Probe 게임을 새로 선택하지 마.
- 공통/장르/모델 문서 연결과 신규 장르 요청의 재사용/보완/신규 작성 절차에
  필요한 현재 원문·책임·충돌 근거.

계획 §3 최소6항목별로 근거 또는 정확한 공백을 표시해줘.
외부 자료는 승인된 기존 조사와 출처를 우선 재사용해줘.
독립 장르 요구에 필요한 미충족 근거만 공식 문서/1차자료로 최소 확인해도 된다.
공급자·요금·운영 정책 재조사, 전체 장르 조사, 구매/문의는 하지 마.
출처·확인일·대표 사례 적용 한계·확인 사실과 추론을 남겨줘.
장르명으로 transport/renderer/tick/모델을 확정하지 마.

4. 기존 Auth/게임 무이관, STEP4A 전체 완료/T01~03,
CP0075/D0010 A/C/P·known expiry·동일 transaction late C 제한 수용/실제 C·
fresh P/retry·owner anchor·최초60초/terminal, D0006~10·UNKNOWN,
STEP5A Registry 단일 metadata·선택모델 단일 채택/복구·Shell/local·BGM H1·Invite H2~4,
STEP5B 공식 결과/정정·여섯 중복 의미·공개 분리·Profile recipe를 보존해줘.
기존 hostless/rematch 긴장은 초기/재대결/미정으로 나누고 의무를 우회하지 마.
Adapter 안의 새 권한/순서/수명/token/audio 엔진은 허용된 것으로 가정하지 마.

5. 관찰 사실 / 승인 요구 / 추론 / 미확인을 구분해 제출해줘.
계승 근거표, 독립 장르 요구 근거표, 공통/장르/모델 연결 근거,
고정 SHA/blob·줄/심볼 source trace, Astra 핵심 질문을 정리해줘.
설계 결론을 막는 공백과 구현·실행으로 확인할 항목을 분리해줘.
실행 미검증 때문에 모든 설계 질문을 보류하지 마.

결과를 game-platform-vnext-step5c-evidence.md로 자동 문서화하고,
해당 파일을 기준으로 다음 Astra 핵심 판단에 사용할 복사 가능한 프롬프트를 제공해줘.
원본 identity/bytes를 보존하고 계획을 승인된 판단표로 바꾸지 마.
다음 담당은 Astra이며 판단 실행은 다음 요청으로 남겨줘.

문서/채팅 결과 제출 후 멈춰줘.
저장소 변경·branch/PR/checkpoint·핵심 구조 선택·실제 시험·구현·운영 변경·
구매/문의/job/dump/복원·병합/main·STEP6 이후 작업을 하지 마.
STEP5C COMPLETED·사용자 판단 승인·행동 PASS·지원 완료를 선언하지 마.
```

