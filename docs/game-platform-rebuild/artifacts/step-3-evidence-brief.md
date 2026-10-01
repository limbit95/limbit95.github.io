# STEP 3 — 근거 준비 brief (정식 stress matrix 아님)

- 계획: 개정 **1.3 / STEP 3**. 기준 integration/분기 SHA: `177533f97bddf67c95379cfa34dc58f2ccdf9e1c`.
- 작업 브랜치: `docs/game-platform-vnext-phase3-stress-preparation`. 작성: 2026-10-01T17:33:44+09:00.
- 사용자 허용 범위: Work Sol 근거 준비·문서 검증·원격 보존·Draft PR. Astra 판단/정식 matrix 판정/merge 금지.
- 단계 상태: **IN_PROGRESS**. 준비 완료와 STEP 3 완료를 구분한다.
- 입력 우선순위: 실행 계획 → 유효한 기존 규칙·STEP 1 계승 근거 → 승인된 STEP 2 초안. 외부 조사는 참고.

## 읽기 범위와 표기

`요구 입력`은 계획의 stress 범위를 구체적으로 질문하기 위한 가정이다. 특정 게임의 확정 요구·지원 약속이 아니다. `확인 사실`은 아래 고정 SHA의 문서/코드 읽기 결과다. `미확인`은 증거가 없거나 이번에 확인하지 않은 영역이며 자동으로 미지원 판정하지 않는다. 규칙 적합성·계약 적합성·구현 증거·Core 변경 필요성의 최종 판단은 Astra에 남긴다.

실제로 읽은 범위: AGENTS/루트 계획/기록 README/CURRENT/CP0017/DECISIONS, STEP 2 선택표·장르 인덱스·GAME_SPEC 근거·기존 보조 조사, STEP 1 AS-IS 및 선택 계승표 행, 아래 source 구간. SQL 전체·production DB·game UI 전체·새 장르 runtime를 전수 감사하지 않았다. 기존 STEP 1 메모리 재현은 기존 기록으로 참조하고 이번 실행 증거로 표시하지 않는다.

## 11개 사례의 요구·근거·미확인 질문

각 7축 번호는 읽을 축의 안내이며 해당 사례의 모델 선택 확정이 아니다. 모든 사례에서 미기재 축과 Invite/Presence의 해당 여부도 Astra가 확인한다.

| ID | 계획 사례 | 우선 확인 축 | 요구 입력 | 관련 근거 ID | 미확인 / Astra 질문 |
|---|---|---|---|---|---|
| S3-C01 | 턴제 카드/보드 | ①②③④⑤⑦ | 공개/개인 카드 상태, 순차 턴과 동시 선택의 차이, 종료→재대결 상태를 비교할 입력 | S3-E02, S3-E03, S3-E04, S3-E05, S3-E15 | 장기 턴·동시 해결도 같은 장르 규칙 아래 기록 가능한가; 실제 계약/구현 증거는 무엇인가 |
| S3-C02 | 실시간 2D 협동 | ①②③④⑤⑥ | 두 참가자의 동시 이동/행동, 이탈·재접속, 공유 정보 범위를 살펴볼 입력 | S3-E02, S3-E03, S3-E13, S3-E15 | 현재 invalidation/snapshot과 요구의 의미가 맞는가; 연속 입력·복구 요구의 근거가 더 필요한가 |
| S3-C03 | 반응속도/PvP | ①②④⑤⑥⑦ | 짧은 round의 입력 시점·경합, 예측 상태와 확정 결과를 분리해 볼 입력 | S3-E02, S3-E15, S3-E16 | prediction/rollback이 필요한 조건은 무엇인가; 결과 확정·권위·중복은 어디까지 확인됐는가 |
| S3-C04 | RTS | ①②④⑤⑥⑦ | 지속 세계와 명령 입력, 다수 entity·정보 공개·복구의 관계를 살펴볼 입력 | S3-E02, S3-E03, S3-E15 | 명령 빈도와 simulation을 분리할 수 있는가; lockstep 등 특정 방식을 장르명으로 단정하지 않았는가 |
| S3-C05 | 리듬 | ②③⑤⑥⑦ | 곡/구간 진행, audio 기준 시각·입력·시각 표현·일시정지/재개의 관계를 살펴볼 입력 | S3-E02, S3-E03 | clock 연결·입력 지연·판정 구간은 무엇이 미정인가; online 여부와 시간 모델을 혼동하지 않았는가 |
| S3-C06 | 레이싱/플랫포머 | ①②③⑤⑥⑦ | 레이싱의 유효 진행/완주와 플랫포머의 이동/실패/재시도를 하위 사례로 구분 | S3-E02, S3-E03 | 두 하위 사례에서 물리·권위·복구 요구가 어떻게 다른가; 공통 장르/모델로 묶어도 되는가 |
| S3-C07 | 3D 공간/물리 | ②④⑤⑥ | 3D 표현과 물리 유무, render/simulation/physics/network의 독립 여부를 살펴볼 입력 | S3-E02, S3-E03 | 3D=물리=실시간 multiplayer를 강제하지 않았는가; 외부 엔진 연결의 미확인 요구는 무엇인가 |
| S3-C08 | 비대칭 역할 | ③④⑤⑦ | 역할 A/B가 서로 다른 정보·입력 권한을 가진 경우와 역할 변경을 살펴볼 입력 | S3-E02, S3-E15, S3-E16 | viewer/역할 전환에서 기존 private 정보와 callback의 유효 범위를 어떻게 검토할 것인가 |
| S3-C09 | host 없는 세션 | ①③④⑤ | 초기 시작만 hostless / 재대결에서도 hostless / 재대결 미정을 분리할 입력 | S3-E04, S3-E05, S3-E02 | §6와 §10B의 조건을 보존했는가; 규칙 적합성·adapter 적합성·구현 증거를 별도 판단할 것인가 |
| S3-C10 | 관전자/중도 참가 | ③④⑤ | 참가자→관전자, 관전자→참가자, 진행 중 새 참가자의 초기 view 복원을 살펴볼 입력 | S3-E02, S3-E10, S3-E11, S3-E15 | 정보 제공 권한과 UI 숨김을 구분했는가; 역할 전환·초기 동기화 실제 증거는 있는가 |
| S3-C11 | 비동기·장기 진행 | ①②③④⑤⑦ | 동시 접속 없이 행동 저장·후속 참가·마감·재개·장기 상태를 살펴볼 입력 | S3-E02, S3-E03, S3-E13, S3-E15 | 브라우저 복귀 refresh와 장기 상태 복원은 어떻게 다른가; 항상 room/host/tick을 요구하는가 |

## 6개 전환·실패 시나리오의 추적 입력

아래 순서는 아직 실행하지 않은 사고 실험 입력이다. 관찰할 응답·오류·정보·부수효과와 전환 전후 맥락을 추적한다. 실제 채택/거부 규칙·API·책임 계층은 정하지 않는다.

| ID | 계획 시나리오 | 추적 순서 | 관련 근거 ID | 미확인 / Astra 질문 |
|---|---|---|---|---|
| S3-T01 | 같은 방의 새 경기 뒤 이전 응답 | 경기 A 응답 대기 → 같은 room에서 경기 B 시작 → A의 snapshot/action/error 도착 | S3-E05, S3-E06, S3-E08, S3-E10, S3-E12, S3-E16 | room ID가 같아도 경기 수명이 다름을 구분하는 근거; version/generation의 실제 범위; 채택/거부 책임 미정 |
| S3-T02 | 다른 방의 콜백 | room A refresh/action/leave 대기 → room B 진입 → A snapshot/error/leave 완료 | S3-E06, S3-E07, S3-E08, S3-E09, S3-E10, S3-E11 | room/generation/disposed 검사 경로별 범위와 action/leave 예외; 늦은 null/오류도 최신 UI에 영향 가능한지 판단 필요 |
| S3-T03 | 관전 전환 뒤 private 정보 | 참가자 view 요청 대기 → 관전자 전환 → 과거 private 응답 도착; 반대 전환도 확인 입력 | S3-E02, S3-E10, S3-E15, S3-E16 | 서버 정보 제공 권한·client cache·viewer 수명; room 검사만으로 충분하다고 가정하지 않음 |
| S3-T04 | 재접속 시 이벤트 유실 | 연결 끊김 → 상태/이벤트 진행 → 재연결 → 현재 상태 재구성 | S3-E13, S3-E14, S3-E15, S3-E16 | snapshot 재조회 경로와 이벤트 replay/stream 복구 의미의 차이; 비DB 방식의 복구 근거 미정 |
| S3-T05 | rollback 중 결과 중복 | 예측 결과/연출 발생 → rollback → 같은 입력 재실행 → 결과/보상 소비 반복 | S3-E02, S3-E16 | RPC retry 중복 방지와 rollback 재실행 부수효과는 같은 증거인가; 확정·정정·소비 경계 미정 |
| S3-T06 | 출시 활성화 중복 | 소스/기능 반영 → activation → handoff 불일치 또는 반복 요청 → 같은 공개 사건 재처리 | S3-E17, S3-E18, S3-E19, S3-E20 | 소스/기능/공개·공지 구분; 현행 release 의미와 향후 사건 식별 미정; F02 maintenance를 이번에 수행하지 않음 |

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

## 코드 읽기로 확인한 사실과 한계

| 사실 ID | 확인 사실 | 근거 | 확대하면 안 되는 주장 |
|---|---|---|---|
| S3-F01 | coordinator는 자체 load 경로의 낮은 version을 거부하고 동등 version은 거부하지 않는다 | S3-E06 | action 응답·새 경기·viewer 수명까지 공통 보호된다는 뜻 아님 |
| S3-F02 | load await 뒤 snapshot/error emit 전에 disposed를 다시 검사하는 분기가 해당 경로에 없다 | S3-E06, S3-E07 | 모든 소비자 UI가 같은 장애를 겪는다고 단정하지 않음 |
| S3-F03 | Can’t Stop ready/start action 응답은 applySnapshot으로 들어가며 applySnapshot에 낮은 version 거부 분기가 없다 | S3-E08, S3-E09 | 기존 F01의 코드 근거 확인. 신규 재현 실행이나 이번 수정 아님 |
| S3-F04 | No Thanks!는 낮은 version 방어와 trackingGeneration/room/disposed 조건을 사용한다. coordinator callback에 해당 조건이 있다 | S3-E10, S3-E11 | 모든 action 경로·same-room rematch·viewer 전환 보장으로 확대하지 않음 |
| S3-F05 | reconnect utility는 online/pageshow/visible에 refresh를 요청하고 stop에서 listener를 제거한다 | S3-E13 | durable event replay·실시간 stream 복구 구현이라는 뜻 아님 |
| S3-F06 | 기존 contract test에는 coalescing/stale/unsubscribe/browser return 사례가 있다 | S3-E14 | 존재 확인일 뿐 이번 테스트 실행 PASS나 6개 scenario 전체 증명 아님 |
| S3-F07 | 현행 DB 계약은 private 미노출·rematch 초기화·duplicate action 등의 의무를 별도 명시한다 | S3-E15, S3-E16 | viewer 전환·rollback 결과 소비의 실제 지원 검증과 동일시하지 않음 |
| S3-F08 | Registry는 4 capability metadata를 구성하며 사이트 games page에 별도 카드 목록이 있다 | S3-E18, S3-E19 | 공개 사건 dedup 서비스·권한 경계가 이미 구현됐다는 뜻 아님 |

## 선택 조항 원문 trace

아래는 STEP 1 표의 10행을 그대로 추출한 참고다. 전수 2,104개 규칙/필드 표를 대체하거나 분류·강도·조건·예외를 수정하지 않는다. parent/도입문은 기존 표와 S3-E04/05 원문에서 확인한다.

원본 표: [STEP 1 platform 조항표](step-1-clauses-platform.md). 아래 열 구조도 원본 그대로다.

| ID · source 줄 | 원문 | 강도 근거 | 성격 / 분류 | 현 책임·소비 증거 | 중복 / 충돌·불명확 | 계승 / 후속 STEP | 기존 게임 회귀 | 신규 게임 적용/미결정 |
|---|---|---|---|---|---|---|---|---|
| LEGACY-DEV-229 · L443–443 | `setReady`와 `startGame`은 현재 shared 구현에서 검증된 lifecycle이지만 **모든 미래 게임의 보편 규칙으로 간주하지 않는다.** 전원 ready가 없거나, 자동 시작하거나, host가 없거나, 다른 방식으로 세션이 시작되는 게임에 억지로 빈 메서드나 가짜 의미를 추가하지 않는다. | 표현:검증 | RULE / M-ROOM | E-ROOM | C03/R01 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-230 · L445–445 | 새 게임의 자연스러운 lifecycle이 현재 adapter와 맞지 않으면: | 서술형(수치화 안 함) | CONTEXT / I | E-DOC | 발견 없음(새 소유 위치 미정) | I / 참고/권위 승격 금지 | 변경 없음; 기존 범위 보존 | 이력/문맥; 관련 규칙과 병독 |
| LEGACY-DEV-231 · L447–447 | 1. game-local workaround로 shared 계약을 우회하지 않는다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-232 · L448–448 | 2. 현재 adapter를 그대로 강제하기 위해 의미 없는 method를 구현하지 않는다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-233 · L449–449 | 3. 실제 반복 가능한 플랫폼 책임인지 검토한 뒤 shared 계약을 가장 작은 범위로 확장하거나 분리한다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-234 · L450–450 | 4. 계약 변경 시 관련 contract test와 이 문서를 함께 갱신한다. | 서술형(수치화 안 함) | RULE / M-ROOM | E-ROOM | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-262 · L522–522 | - stale snapshot 거부 | 서술형(수치화 안 함) | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-264 · L524–524 | - 최신 accepted snapshot을 UI에 반영 | 서술형(수치화 안 함) | RULE / M-DB | E-DB | R02/F01 | K / 2/4B/5A→6/7A2 | 변경 없음; F01 위험 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-272 · L538–538 | 구독과 browser listener는 게임 화면 종료 시 정리할 수 있어야 한다. | 서술형(수치화 안 함) | RULE / M-DB | E-DB | 발견 없음(새 소유 위치 미정) | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |
| LEGACY-DEV-311 · L614–614 | 초기 게임 시작에 ready/host 개념이 없는 특수한 게임이라도 재대결에서는 사용자가 다시 플레이하겠다는 의사를 명시하고 방장이 시작 가능한 준비 화면으로 전환하는 청파 같이 공통 UX를 제공한다. 게임 규칙상 방장 자체가 성립하지 않는 구조를 도입하려면 별도 플랫폼 규칙 변경으로 다룬다. | 절:MUST | RULE / M-ROOM | E-ROOM | C03/R01 | K / 2/4B/5A→6/7A2 | 변경 없음; 기존 범위 보존 | 원래 조건 유지; 새 소유 미정 |

## Astra에 남길 판단과 후속 경계

1. 사례별 적용 장르 규칙/신규 문서 필요성, 현재 계약 표현/선택 모델 추가/미지원·보류 및 증거 수준.
2. 보드 전제 강제·새 필수 Core 전제가 드러나는지와 STEP 2 회귀 필요성.
3. hostless 초기 시작/재대결 hostless/재대결 미정의 세 조건. STEP 2 S2-R03 보존.
4. room·경기·viewer·auth 전환과 응답 version의 서로 다른 범위. API/epoch 구조는 STEP 4A/4B/6 입력.
5. rollback 결과 소비·공개 사건 중복은 STEP 5B 관련 질문이며 구현을 선결정하지 않음.
6. STEP 1 F01~F03·IMPL, STEP 2 S2-R01~04는 기존 입력으로 유지. F02/F03 기존 유지보수를 이번 범위에 편입하지 않음.

[분담](step-3-work-allocation.md) · [조사 입력](step-3-auxiliary-research-input.md) · [조사 요청문](step-3-auxiliary-research-request.md) · [검증](step-3-preparation-validation.md)
