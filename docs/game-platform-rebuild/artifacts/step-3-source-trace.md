# STEP 3 — 반영 trace와 원문 근거

- 계획: 개정1.3 / STEP3, integration `177533f97bddf67c95379cfa34dc58f2ccdf9e1c`.
- 직접 반영 입력: [Astra 판단 원문](step-3-astra-judgment.md), 입력 commit `41d78ef37f88cd7ea179c805fd9bf1141541284b`, blob `8341f47ef729403437b6778db78b252abc02da1b`.
- 상태: **정식 STEP3 제출 산출물 / 검토 대기**. 사용자 채택·현재 규칙 변경·Target 동결·구현 지원 완료가 아니다.
- 가이드4 Work Sol은 판단 내용을 새로 결정하지 않고 아래 원문 절을 그대로 반영했다. 조건·보류·미확인·후속 책임은 보존했다.
- 근거 추적: [source trace](step-3-source-trace.md). 본문 E번호는 S3-E번호의 약칭이며 X번호는 Astra의 외부 선택확인 기록이다. 이번 Sol은 외부 본문을 다시 검증했다고 주장하지 않는다.
- 사고 실험은 실행 테스트 PASS가 아니다. 모든 신규 runtime/DB/browser 실행 증거는 N/NOT_RUN이다.

## 판단 원문 → 정식 산출물

| 입력 절 | 반영 파일 | 보존 범위 |
|---|---|---|
| §1~4 | [matrix](step-3-stress-matrix.md) | 정의·제한·현재 규칙 주의점, 11사례 전7축/Capability, 독립matrix, 분류 해석의 본문 전체 |
| §5 | [시나리오](step-3-transition-scenarios.md) | T01~06의 추적·위험·판단·현상태·후속 전체 |
| §6~7 | [리스크/후속](step-3-risks-and-followup.md) | R01~07·회귀4조건·결론/재검토트리거·후속표·X01~07·미확인·Q01~06 전체 |
| §8 | [원문](step-3-astra-judgment.md), CURRENT·checkpoint·검증 | 3번 당시 종료 이력은 원문 보존. 현재 4번 제출 상태는 새 기록으로 연결 |

각 본문 절은 원문과 byte 단위 동일하다. 헤더·메타·추적 안내만 추가했다. §번호는 원문과 같은 번호를 유지해 역추적한다.

## 근거 약칭 해석

- `E04`는 `S3-E04`, `E04~16`은 `S3-E04`부터 `S3-E16`의 연속 범위다. 고정SHA/경로/줄/blob은 아래 표를 사용한다.
- `X01~07`은 리스크/후속 문서 §7의 Astra 선택확인 7행이다. Sol의 독립 웹 재검증이나 외부 제품 도입 판단이 아니다.
- `F01~03`, `IMPL001·004·005`, `U02`는 STEP1의 `F01~03`, `IMPL-001/004/005`, `U02`를 뜻한다. S3-F01~08(준비 사실) 및 이전 채팅에서의 다른 F02 의미와 혼용하지 않는다.
- `C09c` 같은 약칭은 S3-C09의 하위 사례, `T01`은 S3-T01, `R01`은 해당 문맥의 S3-R01이다. S2-R03 등 접두어가 붙은 기존리스크는 별도다.
- D/C/H/X/N은 Astra 판단 단계의 증거 유형을 그대로 반영한다. C/H를 이번 Sol 테스트 실행 결과로 바꾸지 않는다.

## source 근거 인덱스

모든 근거는 준비 시작 integration SHA에 고정한다. 요약만으로 기존 규칙 조건·강도를 대체하지 않는다. 원문은 해당 절의 도입문과 연결 규칙을 함께 읽는다.

| ID | 원문 파일 / 줄 | blob SHA | 확인한 내용 |
|---|---|---|---|
| S3-E01 | [game_platform_vnext_final_execution_plan.md L279–283](https://github.com/limbit95/limbit95.github.io/blob/177533f97bddf67c95379cfa34dc58f2ccdf9e1c/game_platform_vnext_final_execution_plan.md#L279-L283) | `e12ef038913eb6d605709b782f1b73f18e0d1253` | STEP 3의 11개 사례·6개 시나리오·matrix·회귀 게이트 |
| S3-E02 | [docs/game-platform-rebuild/artifacts/step-2-implementation-selection.md L11–58](https://github.com/limbit95/limbit95.github.io/blob/177533f97bddf67c95379cfa34dc58f2ccdf9e1c/docs/game-platform-rebuild/artifacts/step-2-implementation-selection.md#L11-L58) | `52d209d250ba76f351ea13db33aa6259ba641e71` | 7축·규칙/계약/구현 증거 분리·시간 기준 |
| S3-E03 | [docs/game-platform-rebuild/artifacts/step-2-genre-rule-index.md L15–38](https://github.com/limbit95/limbit95.github.io/blob/177533f97bddf67c95379cfa34dc58f2ccdf9e1c/docs/game-platform-rebuild/artifacts/step-2-genre-rule-index.md#L15-L38) | `1c1f103adf56a160f1fba8e993cd7c38bbcf09e8` | 장르 규칙 묶음과 교차 특성의 초안 |
| S3-E04 | [docs/game-platform-development-rules.md L418–454](https://github.com/limbit95/limbit95.github.io/blob/177533f97bddf67c95379cfa34dc58f2ccdf9e1c/docs/game-platform-development-rules.md#L418-L454) | `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c` | room/session 조건·8 surface·fake method/우회 금지 |
| S3-E05 | [docs/game-platform-development-rules.md L582–614](https://github.com/limbit95/limbit95.github.io/blob/177533f97bddf67c95379cfa34dc58f2ccdf9e1c/docs/game-platform-development-rules.md#L582-L614) | `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c` | same-room rematch·ready/host·별도 규칙 변경 조건 |
| S3-E06 | [games/shared/snapshotCoordinator.js L8–90](https://github.com/limbit95/limbit95.github.io/blob/177533f97bddf67c95379cfa34dc58f2ccdf9e1c/games/shared/snapshotCoordinator.js#L8-L90) | `069f49aa23cfb2c5d591cafaed523fa358c78ba1` | 정수 version·낮은 version 거부·await 이후 callback·error 경로 |
| S3-E07 | [games/shared/snapshotCoordinator.js L94–137](https://github.com/limbit95/limbit95.github.io/blob/177533f97bddf67c95379cfa34dc58f2ccdf9e1c/games/shared/snapshotCoordinator.js#L94-L137) | `069f49aa23cfb2c5d591cafaed523fa358c78ba1` | start/stop/dispose 및 current surface |
| S3-E08 | [games/cant-stop/lobbyController.js L149–220](https://github.com/limbit95/limbit95.github.io/blob/177533f97bddf67c95379cfa34dc58f2ccdf9e1c/games/cant-stop/lobbyController.js#L149-L220) | `9fdecdea73fa6b96680d887a6ad5ad2d9031e8d6` | applySnapshot·same-room tracking·coordinator callback |
| S3-E09 | [games/cant-stop/lobbyController.js L274–314](https://github.com/limbit95/limbit95.github.io/blob/177533f97bddf67c95379cfa34dc58f2ccdf9e1c/games/cant-stop/lobbyController.js#L274-L314) | `9fdecdea73fa6b96680d887a6ad5ad2d9031e8d6` | ready/start 응답 직접 apply·leave 응답 이후 정리 |
| S3-E10 | [games/no-thanks/lobbyController.js L103–170](https://github.com/limbit95/limbit95.github.io/blob/177533f97bddf67c95379cfa34dc58f2ccdf9e1c/games/no-thanks/lobbyController.js#L103-L170) | `942a628ff1a675754f7ab92c53d5ecbddf3e6eab` | 낮은 version 방어·trackingGeneration·room/disposed 조건 |
| S3-E11 | [games/no-thanks/lobbyController.js L228–250](https://github.com/limbit95/limbit95.github.io/blob/177533f97bddf67c95379cfa34dc58f2ccdf9e1c/games/no-thanks/lobbyController.js#L228-L250) | `942a628ff1a675754f7ab92c53d5ecbddf3e6eab` | coordinator callback과 reconnect의 tracking 검사 |
| S3-E12 | [games/no-thanks/lobbyController.js L402–465](https://github.com/limbit95/limbit95.github.io/blob/177533f97bddf67c95379cfa34dc58f2ccdf9e1c/games/no-thanks/lobbyController.js#L402-L465) | `942a628ff1a675754f7ab92c53d5ecbddf3e6eab` | 재대결 action 응답·refresh·dispose |
| S3-E13 | [games/shared/reconnectRefresh.js L12–58](https://github.com/limbit95/limbit95.github.io/blob/177533f97bddf67c95379cfa34dc58f2ccdf9e1c/games/shared/reconnectRefresh.js#L12-L58) | `f96be29314ae0079c0f5db9ba9c9e8cbfb7934e4` | online/pageshow/visible refresh·listener 정리 |
| S3-E14 | [tests/game-platform-contracts.test.js L80–195](https://github.com/limbit95/limbit95.github.io/blob/177533f97bddf67c95379cfa34dc58f2ccdf9e1c/tests/game-platform-contracts.test.js#L80-L195) | `182dd2719bcfc4872c3d990ab7b6d2149399c2c4` | coalescing·stale·unsubscribe·browser return 기존 테스트 |
| S3-E15 | [docs/game-platform-db-test-contract.md L13–29](https://github.com/limbit95/limbit95.github.io/blob/177533f97bddf67c95379cfa34dc58f2ccdf9e1c/docs/game-platform-db-test-contract.md#L13-L29) | `ff5eaf6aa5e6459e098d607119033169ac05f5f1` | 11개 현행 DB/RPC behavioral safety 요구 |
| S3-E16 | [docs/game-platform-db-test-contract.md L104–144](https://github.com/limbit95/limbit95.github.io/blob/177533f97bddf67c95379cfa34dc58f2ccdf9e1c/docs/game-platform-db-test-contract.md#L104-L144) | `ff5eaf6aa5e6459e098d607119033169ac05f5f1` | invalidation·rematch private 초기화·duplicate/concurrency |
| S3-E17 | [docs/game-platform-development-rules.md L366–416](https://github.com/limbit95/limbit95.github.io/blob/177533f97bddf67c95379cfa34dc58f2ccdf9e1c/docs/game-platform-development-rules.md#L366-L416) | `073a6d687e125a9358a6a67eaf3fc16bda4e2d0c` | 실제 capability·activation·보안 경계 분리 |
| S3-E18 | [games/shared/registry.js L1–51](https://github.com/limbit95/limbit95.github.io/blob/177533f97bddf67c95379cfa34dc58f2ccdf9e1c/games/shared/registry.js#L1-L51) | `afa4ba25824157534eca7ca7538b89571cfca30e` | 4 capability boolean·Registry metadata |
| S3-E19 | [js/pages/games.js L75–88](https://github.com/limbit95/limbit95.github.io/blob/177533f97bddf67c95379cfa34dc58f2ccdf9e1c/js/pages/games.js#L75-L88) | `81614a6496b77415f4aef7aa26181f63dbc6f948` | 사이트 게임 카드 별도 목록의 두 소비자 |
| S3-E20 | [docs/game-platform-rebuild/artifacts/step-1-as-is-audit.md L111–163](https://github.com/limbit95/limbit95.github.io/blob/177533f97bddf67c95379cfa34dc58f2ccdf9e1c/docs/game-platform-rebuild/artifacts/step-1-as-is-audit.md#L111-L163) | `f7929e663f9ba5465536bfecffad0f039156781c` | F01/F02/F03·R01/R02·IMPL 및 미결정 기존 기록 |

## 추가 원문 위치 연결

아래는 판단에 이미 사용된 문서의 도입문/관련 절을 더 정확히 찾아가기 위한 trace 추가다. 신규 기술 판단이 아니다.

| ID | 원문 파일 / 줄 | blob SHA | 연결 목적 |
|---|---|---|---|
| S3-E21 | [docs/game-platform-db-test-contract.md L5–29](https://github.com/limbit95/limbit95.github.io/blob/177533f97bddf67c95379cfa34dc58f2ccdf9e1c/docs/game-platform-db-test-contract.md#L5-L29) | `ff5eaf6aa5e6459e098d607119033169ac05f5f1` | 현재 온라인 계약 적용 도입문·11안전성; 기존E15의 본문 범위를 보완 |
| S3-E22 | [game_platform_vnext_final_execution_plan.md L39–91](https://github.com/limbit95/limbit95.github.io/blob/177533f97bddf67c95379cfa34dc58f2ccdf9e1c/game_platform_vnext_final_execution_plan.md#L39-L91) | `e12ef038913eb6d605709b782f1b73f18e0d1253` | 최소Core·선택모델·동등안전성·결과/공개·외부엔진 연결 원칙 |
| S3-E23 | [docs/game-platform-rebuild/artifacts/step-2-genre-rule-index.md L104–125](https://github.com/limbit95/limbit95.github.io/blob/177533f97bddf67c95379cfa34dc58f2ccdf9e1c/docs/game-platform-rebuild/artifacts/step-2-genre-rule-index.md#L104-L125) | `1c1f103adf56a160f1fba8e993cd7c38bbcf09e8` | hostless 세조건/S2-R03 및 미결정(줄범위는 실제 파일 검증) |
| S3-E24 | [docs/game-platform-rebuild/artifacts/step-1-as-is-audit.md L113–163](https://github.com/limbit95/limbit95.github.io/blob/177533f97bddf67c95379cfa34dc58f2ccdf9e1c/docs/game-platform-rebuild/artifacts/step-1-as-is-audit.md#L113-L163) | `f7929e663f9ba5465536bfecffad0f039156781c` | F01~03/U02/IMPL-001~008 ID와 정확한 의미 |

## 조건 보존과 감사 검토 지점

- C09의 solo / 초기만 hostless+준수rematch / 재대결host불성립 / 재대결미정 구분은 원문 그대로다.
- 비DB/stream 모델의 동등안전성 설계 가능성을 현행 DB 계약 면제로 전환하지 않았다. 적용 범위 변경 검토는 후속 게이트에 남긴다.
- X자료가 열리지 않았거나 이번 판단 근거에 쓰이지 않은 범위는 원문§7 그대로 미확인/참고로 남겼다.
- 이번 반영에서 새 구조 충돌을 임의 해소하지 않았다. S3-R01~07, 기존 S2-R01~04/U02/F01~03는 사후 감사 입력으로 유지한다.
- source index는 근거를 찾아가는 위치 표다. 모든 범위가 매 행의 결론 전체를 단독 증명하는 것이 아니며, 해석/추론은 Astra 원문의 한계를 따른다.
