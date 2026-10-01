# STEP 3 — 일반 채팅 Sol 5.6 전달용 입력 자료

- 저장소 접근 없이 읽을 수 있는 입력 묶음. 기준 SHA `177533f97bddf67c95379cfa34dc58f2ccdf9e1c` / 계획1.3.
- STEP 3 IN_PROGRESS, Work Sol 근거 준비만 수행. 정식 matrix·Core/계약/구현 지원 판정 없음.
- 계획/규칙 발췌는 입력 권위, 사례 가정은 조사 질문, 외부 링크는 재확인 후보로 구분한다.
- 함께 사용할 요청문: [step-3-auxiliary-research-request.md](step-3-auxiliary-research-request.md).

## 플랫폼 유지 원칙 요약 — 원문 대체 아님

하나의 통합 플랫폼 안에서 장르와 실행 모델을 구분한다. 기존 개발·품질·보드게임 규칙의 의미/강도/조건을 계승하며 기존 구현 게임은 무이관으로 보호한다. Core에 room/host/turn/DOM/tick/RPC/snapshot을 보편 강제하지 않는다. 실제 지원은 계약상 가능·코드 검증·운영 공개를 구분한다. STEP6 동결 전 공통 runtime 구현/물리 경로 확정 금지. 외부 조사로 현재 규칙을 완화하지 않는다.

## 실행 계획 STEP 3 원문

### STEP 3 — 미래 게임 Stress Test 1차 (코드 없음)

**작업:** 턴제 카드/보드, 실시간 2D 협동, 반응속도/PvP, RTS, 리듬, 레이싱/플랫포머, 3D 공간/물리, 비대칭 역할, host 없는 세션, 관전자/중도 참가, 비동기·장기 진행을 선택표에 대입한다. 같은 방의 새 경기 뒤 이전 응답, 다른 방의 콜백, 관전 전환 뒤 private 정보, 재접속 시 이벤트 유실, rollback 중 결과 중복, 출시 활성화 중복도 따로 추적한다.

**산출물/게이트:** 각 사례의 적용 장르 규칙·신규 문서 필요 여부와 `현재 계약으로 표현 / 선택 모델 추가 / 미지원·보류`, Core 변경 필요성, 검증 증거 수준을 표시한 matrix. 모든 사례를 구현한다고 표시하지 않는다. 보드게임 전제의 불필요한 강제나 새로운 필수 Core 전제가 드러나면 STEP 2로 돌아간다. **여기서 멈춘다.**


## 승인된 STEP 2 선택표의 원문 발췌

STEP 2 초안 결과 승인이지 최종 모델/API/지원 확정이 아니다. 아래 선택표의 설명·조건을 함께 전달한다.

## 선택표

각 축 전체를 단일 enum으로 만들지 않는다. 아래 후보는 조합을 설명할 문서상의 선택이며 확정 모델/API/지원목록이 아니다. 적용 모드·단계·역할·상태를 적고 하위 항목마다 선택한다. `해당 없음`(이유 명시), `미결정`, `후속 계약 검토 필요`를 구분한다.

| 축 | 기록 후보 | 단일·복수 기준 | 단계 변경 시 기록 |
|---|---|---|---|
| ① Gameplay flow | 순차 턴, 동시 선택/해결, 지속 진행, 혼합 | 전체 게임은 복수 가능. 단계별 행동/해결 순서 명시 | 준비→동시 입력→순차 해결 등 조건 |
| ② 시간·입력 | 이벤트/주기 기반, 마감 시각, 입력 timestamp/sampling | 역할별 복수. 입력=simulation 등치 금지 | 일시정지·재개·입력 마감·주기 변경 의미 |
| ③ 세션·지속성 | 일회 실행, 경기/라운드, 장기 진행, 메모리/저장/재개 | 수명·저장 수준은 별개. 상태별 복수 가능 | 종료·보존·초기화·복원 대상 |
| ④ 참여·가시성 | 개인/협동/경쟁, 역할/정원, 관전/중도 참가, 공개/개인/팀 정보 | 역할·정보별 복수 | 참가자→관전자 등의 정보·행동 권한 변화 |
| ⑤ 권위·동기화·복원 | 상태별 최종 결정 주체, 전달 방식, 예측/보정, 재접속/복구 | 항목별 별도 선택. 같은 상태·시점의 최종 권위 충돌을 숨기지 않음 | 권위 이전·재접속에서 필요한 조건 |
| ⑥ 공간·렌더링·입력·물리 | 비공간/격자/연속 공간, 2D/3D 표현, DOM/Canvas 등, 입력 장치, 물리 유무 | 논리 공간·표현·입력·물리 독립 선택. 복합 UI 가능 | 화면·입력 모드·simulation 변경 범위 |
| ⑦ 결과·메타 progression | 결과 없음/완료/승패/점수/순위, 확정 시점, 경기 밖 진행/보상 | 결과·장기 진행 각각 기록. 복수 가능 | 재시작/재대결에서 초기화/유지 상태 |

⑤의 `relay`는 전달 후보, `서버 권위`는 최종 결정 주체, `prediction/rollback/correction`은 상태 처리·보정 후보다. 서로 같은 분류 수준의 배타 enum으로 만들지 않는다. 최종 authority/동기화/복원 계약은 STEP 4B/6에서 검토한다. 외부 사례로 현행 서버 권한 검증을 생략하지 않는다.

## 선택과 실행 모델 연결

장르 규칙 인덱스 → 모드/단계별 7축 선택 → 필요한 실행 특성 → 기존 계약과 연결 후보/추가 요구 → 후속 모델 검토 순으로 기록한다. 예를 들어 보드·카드는 active 순차 턴과 장기 비동기 턴을 모두 설명할 수 있고, 이벤트·저장·복원 특성은 다른 장르도 공유할 수 있다. 장르마다 새로운 Core나 모델을 자동 생성하지 않는다.

현재 `defineRoomLobbyAdapter`의 8 surface(DEV-229~234 주변 §6), DB/version/snapshot 기반 경로, DOM Shell, 기존 Invite 연결은 [AS-IS 공통 API·소비자 표](step-1-as-is-audit.md)에서 확인한다. 이는 **현행 소비 경로의 증거**이며 새 조합의 지원 완료 판정이 아니다. room/host/ready/DB/DOM을 미래 Core 필수 개념으로 승격하지 않는다. 연속 시간·공간·입력 모델, 비room/비DB 모델의 계약은 STEP 1 U02 및 후속 설계로 남는다.

| 독립 상태 | 기록 값 | 의미 |
|---|---|---|
| 규칙 적합성 | 양립 / 규칙 변경 검토 필요 / 미확인 | 현재 유효 의무와의 관계 |
| 계약 적합성 | 현재 계약 표현 가능 / 추가 계약 검토 필요 / 미확인 | 계약 조항과 요구의 연결; 주장에는 경로/조건 필요 |
| 구현 증거 | 확인 경로 / 증거 없음 | 기존 호출자·검증 경로. 분류상 표현 가능과 구분 |

여러 상태를 한 PASS 또는 지원 여부로 압축하지 않는다. STEP 2에서는 요구·후보를 기록하며 STEP 3의 전수 지원 matrix나 Core 변경 필요성 판정을 실행하지 않는다.

## 시간·빈도 기록

| 항목 | 해당 시 기록할 내용 |
|---|---|
| renderer FPS | 화면 갱신 목표/제약 또는 미정 |
| gameplay simulation | 이벤트 기반 또는 주기 기반 진행 |
| physics step | 물리 사용 여부·주기·진행 기준 |
| network update | 방향별 송신/수신과 이벤트/주기 방식 |
| 입력 시간 | 발생 시각·sampling·허용 구간 |
| audio timeline | 해당 게임의 기준 시각과 연결 관계 |

renderer FPS / simulation tick / network update는 개념상 분리한다. simulation과 physics step도 항상 같다고 정의하지 않는다. 실제 빈도 값은 같을 수도 있으며 모든 게임에 숫자 주기·tick을 강제하지 않는다. event-based는 0Hz와 같다고 적지 않고 이벤트 조건을 설명한다. 리듬의 audio 시간 연결과 입력 지연 처리도 선택 이유/미결정으로 남기며 구현 계약을 확정하지 않는다.

## 별도 Capability 선택

| 후보 | 선택 | 선택 근거·의존 조건·증거 |
|---|---|---|
| Invite | 사용 / 미사용 / 미결정 | 적용 모드·초대 대상·기존 사이트/Game Platform Invite 계약·지원 경로 |
| Presence | 사용 / 미사용 / 미결정 | 표현 대상·공유 범위·수명·기존 소비 경로/미확인 |

후보의 실제 API/공통 책임은 STEP 5A/5B/6이다. game-local 연결을 공통 본체 중복으로 오인하지 않는다. 별도 선택 목록이라는 이유로 multiplayer rematch 등 기존 필수 제품 요구를 선택 사항으로 바꾸지 않는다. result/meta는 ⑦에 기록하되 구현 소유자가 Core/Capability 등 어디인지는 미결정이다.


## 장르 인덱스 원문 발췌

## 분류 원칙

장르 규칙은 조사·보존해야 할 플레이 규칙을, 구현 선택표는 실행 특성을 다룬다. 한 게임에 여러 규칙 묶음과 여러 실행 특성이 적용될 수 있다. 묶음 이름은 문서 분류용 초안이며 고정 enum이 아니다. 장르별 별도 플랫폼/Core를 만들지 않는다.

| 묶음 | 적용 조건 | 규칙 묶음의 내용 | 논리적 문서 소유자 / 신규 문서 필요성 / 미결정 |
|---|---|---|---|
| 공통 개발 절차 | 신규 게임 개발 | 조사·제품 범위·출처/해석·디자인 준비·검증·진행 기록 | 플랫폼 공통 개발 규칙. DEV-035~043 흐름 계승; 책임 절은 STEP 6/7 |
| 보드·카드 | 보드/카드/구성물과 해당 게임 규칙 사용 | 판본·구성물·공개/비공개 정보·행동/정산·공간 adaptation | 보드게임 장르 규칙; 기존 상세 의무 계승. 실제 문서 재구성은 STEP 7A2 |
| 전략·자원·명령 | 자원 배분·생산·명령·전략적 상태 변화가 핵심 | 명령 의미·자원/생산 조건·정보 공개·종료/승리 | 신규 장르 규칙 묶음 후보. RTS 이름만으로 동기화 모델을 강제하지 않음; 신규 상세 문서는 후속 작성 |
| 반응·액션 | 입력 시점/순서/반응이 게임 규칙에 영향 | 행동 성립·판정 시점·실패/회복·결과 | 신규 장르 규칙 후보. PvP/협동·권위는 별도 선택; 판정법 미정 |
| 리듬·타이밍 | 기준 시간과 입력 차이가 판정에 영향 | timeline·판정 구간·지연 보정의 의미·점수/실패 | 신규 장르 규칙 후보. 네트워크 모델과 독립; 구체 판정법 미정 |
| 레이싱 | 코스·진행·완주·순위가 핵심 | 체크포인트·유효 진행·완주·동률 | 신규 장르 규칙 후보. 물리 구현/네트워크 모델 미정 |
| 플랫포머·이동 도전 | 이동·도달·실패·재시도가 핵심 | 행동 의미·성공/실패·재시작/체크포인트 | 신규 장르 규칙 후보. 레이싱과 무조건 통합하지 않음 |
| 기타·복합 장르 | 기존 묶음만으로 충분하지 않음 | 적용 묶음·추가 조사·충돌/미결정 | 개별 GAME_SPEC에서 필요성 식별 → 신규 장르 규칙 작성 입력. 묶음/지원 범위를 자동 확정하지 않음 |

신규 묶음의 내용은 **조사할 항목**이며 새로운 MUST나 특정 구현의 채택이 아니다. 현재 기존 규칙의 적용 범위는 이번 분류로 바뀌지 않는다.

## 장르와 교차하는 특성

| 특성 | 기록 위치 | 분류 경계 |
|---|---|---|
| 협동 / PvP / 비대칭 | 참여·가시성 축 + 게임별 규칙 | 독립 장르/모델로 자동 고정하지 않음 |
| 실시간 / 장기 비동기 | flow·시간·세션/지속성 | 장르명으로 결정하지 않음 |
| 2D / 3D / 물리 | 공간·렌더링·입력/물리 | 3D=물리=실시간 multiplayer 등치 금지 |
| 관전 / 중도 참가 | 참여·가시성 | 정보와 행동 권한 분리 |
| Invite / Presence | 별도 Capability 목록 | 선택 여부와 실제 계약·지원 증거 분리 |

실행 모델 연결은 [구현 선택표](step-2-implementation-selection.md) §선택과 실행 모델 연결, 기록 형식은 [GAME_SPEC 근거](step-2-game-spec-selection-rationale.md)를 따른다.


## hostless 관련 현재 규칙 발췌

출처: docs/game-platform-development-rules.md §6·§10B. 초기 시작과 재대결을 구분한다. 해석/지원 판정은 Astra에 남긴다.

`setReady`와 `startGame`은 현재 shared 구현에서 검증된 lifecycle이지만 **모든 미래 게임의 보편 규칙으로 간주하지 않는다.** 전원 ready가 없거나, 자동 시작하거나, host가 없거나, 다른 방식으로 세션이 시작되는 게임에 억지로 빈 메서드나 가짜 의미를 추가하지 않는다.

새 게임의 자연스러운 lifecycle이 현재 adapter와 맞지 않으면:

1. game-local workaround로 shared 계약을 우회하지 않는다.
2. 현재 adapter를 그대로 강제하기 위해 의미 없는 method를 구현하지 않는다.
3. 실제 반복 가능한 플랫폼 책임인지 검토한 뒤 shared 계약을 가장 작은 범위로 확장하거나 분리한다.
4. 계약 변경 시 관련 contract test와 이 문서를 함께 갱신한다.

현재 adapter를 그대로 사용하는 게임은 해당 surface 전체를 구현해야 하며, 각 메서드 내부 구현과 실제 RPC 이름은 게임별로 달라도 된다.

MUST: 세션 생성/참가/준비/시작 등 상태 전이가 존재한다면 해당 권한과 조건은 서버가 최종 판단한다.

초기 게임 시작에 ready/host 개념이 없는 특수한 게임이라도 재대결에서는 사용자가 다시 플레이하겠다는 의사를 명시하고 방장이 시작 가능한 준비 화면으로 전환하는 청파 같이 공통 UX를 제공한다. 게임 규칙상 방장 자체가 성립하지 않는 구조를 도입하려면 별도 플랫폼 규칙 변경으로 다룬다.

STEP 2의 구분: 초기 시작만 hostless이고 재대결 의무를 충족하면 초기 hostless만으로 규칙 변경 대상으로 단정하지 않는다. 재대결에서도 host가 성립하지 않는 구조는 별도 규칙 변경 검토 대상이며, 정책 미정은 규칙 적합성 미확인이다. adapter 호환/구현 증거는 별도다.

## 11개 조사 사례 입력 — 확정 요구 아님

| ID | 사례 | 살펴볼 가정 | 미확인 질문 |
|---|---|---|---|
| S3-C01 | 턴제 카드/보드 | 공개/개인 카드 상태, 순차 턴과 동시 선택의 차이, 종료→재대결 상태를 비교할 입력 | 장기 턴·동시 해결도 같은 장르 규칙 아래 기록 가능한가; 실제 계약/구현 증거는 무엇인가 |
| S3-C02 | 실시간 2D 협동 | 두 참가자의 동시 이동/행동, 이탈·재접속, 공유 정보 범위를 살펴볼 입력 | 현재 invalidation/snapshot과 요구의 의미가 맞는가; 연속 입력·복구 요구의 근거가 더 필요한가 |
| S3-C03 | 반응속도/PvP | 짧은 round의 입력 시점·경합, 예측 상태와 확정 결과를 분리해 볼 입력 | prediction/rollback이 필요한 조건은 무엇인가; 결과 확정·권위·중복은 어디까지 확인됐는가 |
| S3-C04 | RTS | 지속 세계와 명령 입력, 다수 entity·정보 공개·복구의 관계를 살펴볼 입력 | 명령 빈도와 simulation을 분리할 수 있는가; lockstep 등 특정 방식을 장르명으로 단정하지 않았는가 |
| S3-C05 | 리듬 | 곡/구간 진행, audio 기준 시각·입력·시각 표현·일시정지/재개의 관계를 살펴볼 입력 | clock 연결·입력 지연·판정 구간은 무엇이 미정인가; online 여부와 시간 모델을 혼동하지 않았는가 |
| S3-C06 | 레이싱/플랫포머 | 레이싱의 유효 진행/완주와 플랫포머의 이동/실패/재시도를 하위 사례로 구분 | 두 하위 사례에서 물리·권위·복구 요구가 어떻게 다른가; 공통 장르/모델로 묶어도 되는가 |
| S3-C07 | 3D 공간/물리 | 3D 표현과 물리 유무, render/simulation/physics/network의 독립 여부를 살펴볼 입력 | 3D=물리=실시간 multiplayer를 강제하지 않았는가; 외부 엔진 연결의 미확인 요구는 무엇인가 |
| S3-C08 | 비대칭 역할 | 역할 A/B가 서로 다른 정보·입력 권한을 가진 경우와 역할 변경을 살펴볼 입력 | viewer/역할 전환에서 기존 private 정보와 callback의 유효 범위를 어떻게 검토할 것인가 |
| S3-C09 | host 없는 세션 | 초기 시작만 hostless / 재대결에서도 hostless / 재대결 미정을 분리할 입력 | §6와 §10B의 조건을 보존했는가; 규칙 적합성·adapter 적합성·구현 증거를 별도 판단할 것인가 |
| S3-C10 | 관전자/중도 참가 | 참가자→관전자, 관전자→참가자, 진행 중 새 참가자의 초기 view 복원을 살펴볼 입력 | 정보 제공 권한과 UI 숨김을 구분했는가; 역할 전환·초기 동기화 실제 증거는 있는가 |
| S3-C11 | 비동기·장기 진행 | 동시 접속 없이 행동 저장·후속 참가·마감·재개·장기 상태를 살펴볼 입력 | 브라우저 복귀 refresh와 장기 상태 복원은 어떻게 다른가; 항상 room/host/tick을 요구하는가 |

## 6개 별도 시나리오 입력 — 미실행 사고 실험

| ID | 시나리오 | 추적 순서 | 남은 질문 |
|---|---|---|---|
| S3-T01 | 같은 방의 새 경기 뒤 이전 응답 | 경기 A 응답 대기 → 같은 room에서 경기 B 시작 → A의 snapshot/action/error 도착 | room ID가 같아도 경기 수명이 다름을 구분하는 근거; version/generation의 실제 범위; 채택/거부 책임 미정 |
| S3-T02 | 다른 방의 콜백 | room A refresh/action/leave 대기 → room B 진입 → A snapshot/error/leave 완료 | room/generation/disposed 검사 경로별 범위와 action/leave 예외; 늦은 null/오류도 최신 UI에 영향 가능한지 판단 필요 |
| S3-T03 | 관전 전환 뒤 private 정보 | 참가자 view 요청 대기 → 관전자 전환 → 과거 private 응답 도착; 반대 전환도 확인 입력 | 서버 정보 제공 권한·client cache·viewer 수명; room 검사만으로 충분하다고 가정하지 않음 |
| S3-T04 | 재접속 시 이벤트 유실 | 연결 끊김 → 상태/이벤트 진행 → 재연결 → 현재 상태 재구성 | snapshot 재조회 경로와 이벤트 replay/stream 복구 의미의 차이; 비DB 방식의 복구 근거 미정 |
| S3-T05 | rollback 중 결과 중복 | 예측 결과/연출 발생 → rollback → 같은 입력 재실행 → 결과/보상 소비 반복 | RPC retry 중복 방지와 rollback 재실행 부수효과는 같은 증거인가; 확정·정정·소비 경계 미정 |
| S3-T06 | 출시 활성화 중복 | 소스/기능 반영 → activation → handoff 불일치 또는 반복 요청 → 같은 공개 사건 재처리 | 소스/기능/공개·공지 구분; 현행 release 의미와 향후 사건 식별 미정; F02 maintenance를 이번에 수행하지 않음 |

## 저장소에서 확인한 사실 요약과 한계

- snapshotCoordinator는 자체 load의 version 순서를 비교한다. await 뒤 disposed 재검사는 해당 emit 경로에 없다. 소비자별 방어는 다르며 모든 UI의 동일 장애를 단정하지 않는다.
- Can’t Stop action 응답 직접 적용과 No Thanks! trackingGeneration/room/disposed 방어가 다른 경로에 있다. same-room 경기/viewer 경계가 전부 보장된다고 확인하지 않았다.
- reconnect utility는 browser 복귀 시 refresh를 요청한다. durable stream replay를 구현한 것으로 표시하지 않는다.
- 현행 DB 계약의 duplicate action은 동일 client_action_id retry를 다룬다. rollback 결과/보상 소비 전체의 지원 근거로 확대하지 않는다.
- 공개 운영 규칙은 소스/기능/activation을 구분한다. STEP 1 F02 handoff 불일치는 기존 finding이고 이번에 수정하지 않는다.

상세 원문·blob·줄 근거는 [Work evidence brief](step-3-evidence-brief.md)에 있다. 일반 채팅은 위 사실을 입력 요약으로 취급하고 저장소 전수 검증을 수행했다고 표시하지 않는다.

## 추가 조사 질문

| ID | 조사할 사실 | Astra에 남길 판단 |
|---|---|---|
| Q01 | 권위/전달/예측/보정의 서로 다른 의미·대표 공식 사례 | 해당 플랫폼 조합/계약·Core 필요성 |
| Q02 | reconnect·이벤트 유실·state 재구성의 방식별 조건 | 현행 계약 표현·새 모델 요구 |
| Q03 | rollback 재실행 부수효과·결과 확정/정정·중복 소비 참고 근거 | 최소 Result/소비 경계 |
| Q04 | spectator/역할 전환·late join의 정보 제공/복원 사례 | viewer 수명·private 요구의 계약 위치 |
| Q05 | audio/input/render/simulation/physics/network clock·주기의 관계 | 시간 기준·판정/성능 계약 |
| Q06 | hostless와 장기 비동기의 요구·제품 사례 | 규칙 충돌/변경 필요·모델 지원 |

## 기존 STEP 2 외부 출처 후보 — 새로 검증한 사실 아님

아래는 기존 메모의 출처 표를 그대로 전달한다. 원 메모의 접근일 2026-10-01은 이전 조사 기록이며 이번 원문 확인을 뜻하지 않는다. 주장에 사용할 때 필요한 원문을 확인한다. 기존 전체 메모는 [STEP 2 조사](step-2-auxiliary-research-memo.md)를 함께 전달할 수 있다.

| ID | 문서 제목 / URL | 근거 위치 | 비교표에서 뒷받침하는 내용 |
|---|---|---|---|
| **S1** | **Heroic Labs, Nakama Multiplayer Engine** — [공식 문서](https://heroiclabs.com/docs/nakama/concepts/multiplayer/) | `Synchronous Real-time`; `Turn-based multiplayer > Active / Passive` | 실시간/턴제 분리, active/passive 차이, passive의 장기 지속·DB 저장 |
| **S2** | **Heroic Labs, Authoritative Multiplayer** — [공식 문서](https://heroiclabs.com/docs/nakama/concepts/multiplayer/authoritative/) | 문서 서두; `Asynchronous real-time`; `Active turn-based`; `Passive turn-based` | authority 모델과 장르의 비동일성, fixed tick, 다양한 gameplay cadence |
| **S3** | **Heroic Labs, Client Relayed Multiplayer** — [공식 문서](https://heroiclabs.com/docs/nakama/concepts/multiplayer/relayed/) | `Client Relayed Multiplayer` 본문 | simple 1v1·co-op에서도 relay 사용 가능 사례. co-op = server authority가 아님 |
| **S4** | **Apple, GKTurnBasedMatch** — [공식 API 문서](https://developer.apple.com/documentation/gamekit/gkturnbasedmatch) | `Overview`; `Ending Turns and Saving Data`; `Retrieving Match Details` | participant, current turn, game-specific match data 저장/재개 |
| **S5** | **Apple, endTurn(withNextParticipants:turnTimeout:match:completionHandler:)** — [공식 API 문서](https://developer.apple.com/documentation/gamekit/gkturnbasedmatch/endturn%28withnextparticipants%3Aturntimeout%3Amatch%3Acompletionhandler%3A%29) | Parameters: `nextParticipants`, `timeout`, `matchData` | 장기 turn handoff, timeout, 다음 participant를 위한 durable state |
| **S6** | **GGPO, Good Game, Peace Out Rollback Network SDK** — [원 개발자 저장소](https://github.com/pond3r/ggpo) | README `What's GGPO?` | rollback에서 input prediction/speculative execution을 사용해 입력 반응 지연을 숨기는 구현 사례 |
| **S7** | **Mark Claypool, The effect of latency on user performance in Real-Time Strategy games**, Computer Networks 49 (2005), pp.52–70 — [저자 공개 원 논문 PDF](https://web.cs.wpi.edu/~claypool/papers/rts/paper.pdf) | p.52 Abstract; pp.53–54 `Introduction` / `Background` | FPS와 RTS의 interaction/latency 특성 차이, RTS의 build/explore/combat 구분, unit command 중심 사례 |
| **S8** | **W3C, Web Audio API 1.1** — [공식 표준](https://www.w3.org/TR/webaudio-1.1/) | §1.1.1 `currentTime`; §1.2.2 `baseLatency`/`outputLatency`; §7.1 `Latency` | audio 자체 time coordinate, 다른 system clock과 비동기 가능성, output latency → 리듬 계열 timing 분리 근거 |
| **S9** | **Epic Games, Understanding Networked Movement in the Character Movement Component** — [공식 문서](https://dev.epicgames.com/documentation/unreal-engine/understanding-networked-movement-in-the-character-movement-component-for-unreal-engine) | `Movement Replication Summary`; `ReplicateMoveToServer` description | continuous movement의 local control/server processing/correction 사례 |
| **S10** | **Unity, Fixed updates** — [공식 문서](https://docs.unity3d.com/Manual/fixed-updates.html) / **Tick and update rates** — [공식 문서](https://docs-multiplayer.unity3d.com/netcode/2.1.1/learn/ticks-and-update-rates/) | `Fixed updates`; `Tick rate`; `Update rate` | renderer/physics cadence 분리 및 simulation tick/network update 분리 |
| **S11** | **Heroic Labs, Status** — [공식 문서](https://heroiclabs.com/docs/nakama/concepts/status/) / **Architecture Overview** — [공식 문서](https://heroiclabs.com/docs/nakama/getting-started/architecture/) / **Multiplayer Lobby** — [공식 문서](https://heroiclabs.com/docs/nakama/guides/concepts/lobby/) | `Status`; `Presence`; `invite friends to matches` | Presence와 Invite를 gameplay synchronization model과 별도 기능으로 관찰할 근거 |
