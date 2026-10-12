# STEP6 — Target 책임·문서 계층·적용 조건·물리 격리·계약 권위

- 현재 지위: **APPROVED_JUDGMENT / FORMAL_RESULT_REVIEW_PENDING**. 2026-10-12 23:12:53 KST의 승인 게이트 설명 뒤 사용자가 “승인할게”라고 응답했다. §9.1 여섯 묶음의 본문 조건·제한·미확인 포함 핵심 판단 승인 및 앞선 STEP6 정식 반영·문서 검증·integration base 검토 PR 제출 요청의 시작 조건 충족으로 기록한다. 승인 시각 자체가 제공되지 않은 마지막 응답의 정확한 시각은 추정하지 않는다.
- STEP6 **REVIEW_PENDING**. 정식 결과 최종 검토·Target 동결 완료 기록·integration 병합·main·STEP7은 별도 게이트다. 현재 행동 **NOT_RUN**, 운영/실행 **UNKNOWN**과 후속 의무 유지.
- 판단 기준/착수 integration `f34f4f180e14ea36847b9740dea43de2f1325e56`. STEP5C **COMPLETED / DESIGN_RESULT_APPROVED / INTEGRATION_MERGED**. 기존 게임/Auth/API/SQL 무이관.
- 원본: [Astra 판단](game-platform-vnext-step6-astra-judgment.md), [Sol 근거](game-platform-vnext-step6-evidence.md), [계획/인계](game-platform-vnext-step6-plan-and-handoff.md). 세 입력 bytes/identity/hash·원문 이력 상태는 보존한다. Sol/Codex가 새 Target·책임·경로·버전·Slice를 선택하지 않았다.
- 아래 원본 절은 제목·번호·본문·표·조건을 exact하게 전달한다. 원문의 PROPOSED/미승인/NOT_STARTED·저장소 변경 금지·다음 작업/프롬프트는 작성 당시 상태와 요청이다. **현재 허용과 상태는 이 헤더·CURRENT·CP0088·검증 문서가 우선**한다. 이력 문구를 현재 미승인으로 해석하거나, 핵심 판단 승인을 구현·동결 완료로 확대하지 않는다.
- 정식 단일 본문: [Target 책임·문서 계층·적용 조건·물리 격리·계약 권위](step-6-target-architecture.md) / [전수 참조 계승·명시 분할·조항 목적지](step-6-clause-destinations.md) / [세 요청의 코드 없는 추적](step-6-request-traces.md) / [Slice·검증 예산·설계 blocker와 후속 의무](step-6-slices-and-verification.md) / [고정 원본·승인 대응·source trace·게이트](step-6-source-trace.md). 검증/최종 검토는 [step-6-validation](step-6-validation.md), 현재 기록은 [CURRENT](../CURRENT.md)와 [CP0088](../checkpoints/CP-0088-step-6-formal-submitted.md).
- 새 topic-owner와 runtime 경로는 승인 판단의 **후속 적용 경로**다. 이번 실제 생성 파일은 rebuild artifacts와 CP0088이며 현재 rulebook/AGENTS/Guard는 전환하지 않는다. §12의 목적지는 계획된 논리 책임과 원문 참조 계승이고 새 규칙 본문 적용 완료를 뜻하지 않는다. 실제 전환 시 특정 ID/f 목적지가 성립하지 않으면 해당 조각을 blocker로 반환한다.

## 2. A — Target 책임과 문서 계층

### 2.1 핵심 선택

**J:** 한 플랫폼 안에 최소 Core, 선택 모델/Capability, Site Adapter, game-local을 둔다. 문서의 장르 계층과 코드 계층은 상속 구조가 아니다. 공통 안전/수명은 공통 계약이 소유하고, 어떤 상태가 현재이며 어떻게 복구되는지는 선택 모델 하나가 끝까지 소유한다. backend는 실제 인가·권위 집행자다. Adapter는 기존 사이트 서비스와 그 계약을 연결한다.

| 책임 | Target owner / 연결 | 적용 조건·금지 / 기존 격리 |
|---|---|---|
| 식별·조립·실행 수명 | Core. Registry의 기존 단일 metadata를 참조하고 실행 구성만 연결 | Room/host/턴/DOM/tick/점수/DB를 Core 기본값으로 강제하지 않음. 두 번째 catalog 금지 |
| 시간·세션·참여·권위·순서·복구·입력·공간·지속성 | 선택 모델. 모델 간 계약은 명시 참조 | Snapshot과 Reconnect가 각각 최종 상태를 채택하지 않음. 같은 version도 다른 match/view/run을 부활시키지 않음 |
| 권한 집행·공식 mutation/result | 승인 backend/권위 모델 + game-local 도메인 규칙 | client gate·표시 flag·relay·prediction이 권위/인가 대체 불가. 기존 Auth/API/SQL 무이관 |
| 공통 기능 본체 | 실제 의미가 필요한 Capability 또는 기존 site 본체 | Invite/BGM/결과/공개/효과의 owner와 적용 모델을 명시. 선택 가능성이 적용 제품 의무 면제는 아님 |
| 사이트 연결 | Site Adapter | 기존 Auth·profile·route·Registry projection·초대·BGM 연결. 새 인가/순서/수명/token/audio 엔진을 숨기지 않음 |
| 규칙·상태 계산·VI·실제 UI·연출 | game-local / 해당 네 문서 | Shell 공통 표시를 재사용하되 공통 renderer/결과 화면으로 덮어쓰지 않음. 기존 게임을 참고/회귀 대상으로 유지 |
| 반복 조합 | Profile은 검증된 recipe | 반복·검증 전 구체 Profile·필수 선택·상속/실행 엔진·전용 디렉터리 생성 보류 |

Core는 특정 게임·사이트·선택 모델 구현을 역참조하지 않는다. 선택 모델·Capability는 필요한 공통 계약과 명시된 상대 계약을 소비한다. 자원 최종 파괴권을 둘이 갖거나 숨은 전역 currentRoom/currentMatch로 연결하지 않는다. 게임은 site 공용 자원 전체를 파괴하지 않고 자기 사용권을 반납한다.

### 2.2 새 topic-owner 목적지

다음은 **제안 경로와 필수 절 식별자**다. 아직 해당 문서를 만들거나 CURRENT로 전환하지 않았다. flat `docs/game-platform-*.md`를 택해 기존 문서 발견 범위를 활용하되, 기존 literal 권위 검사·참조 검사는 §6대로 변경해야 한다. 절 이름/anchor는 반영자가 임의 의미를 붙이지 않도록 판단 대상으로 정한다. API/schema/class와 함수·파일 목록은 여기서 동결하지 않는다.

| 별칭 / 제안 경로 | 필수 책임 절 | 단일 본문과 기존 참조 |
|---|---|---|
| AR `docs/game-platform-architecture.md` | AR1 적용·책임·의존; AR2 계약 식별/호환; AR3 공존; AR4 장르·모델 인덱스 | 상위 진입/경계만 소유. 세부 의무는 아래 owner 링크 |
| CO `docs/game-platform-common-rules.md` | CO1 조사/출처/권리; CO2 네 문서/시간축/기록; CO3 bootstrap/단계/검증/수동 gate; CO4 공통 UX/안내/종료; CO5 출시/회고/변경 | 범용 개발·품질 본문. 보드/모델 세부는 조건부 참조 |
| LI `docs/game-platform-lifetime-contract.md` | LI1 적용 직전 채택; LI2 모든 완료/자원/정리; LI3 T01~03·모델 맥락 연결 | STEP4A 수명 본문. 선택 모델이 제공하는 현재성/순서의 의미를 재정의하지 않음 |
| MO `docs/game-platform-model-contracts.md` | MO1 선택7축/호환; MO2 세션/참여/재대결; MO3 안전11/권위/인가/A·C·P; MO4 상태·순서·복구; MO5 시간/입력/공간; MO6 결과/지속성/운영 | 승인 STEP4B 및 선택 모델 연결. DB 상세 본문은 기존 DB 계약, 새 non-DB 모델 oracle는 이 문서의 해당 모델 절 |
| CA `docs/game-platform-capability-contracts.md` | CA1 Registry/Access/Shell; CA2 Invite; CA3 BGM/표현; CA4 Result 소비/여섯 중복; CA5 Publication; CA6 확장/Profile | STEP5A/B 책임과 조건. 기존 본체의 API 상세는 기존 owner 참조. metadata와 실행 구성 분리 |
| BO `docs/game-platform-board-rules.md` | BO1 판본/출처/제품 조사; BO2 실물 공간/구성물/웹 해석; BO3 세션·권위·복구/재대결 모델 연결; BO4 피드백/검증/네 문서 추가 질문 | B01~12 보드 의미. 공통·모델 계약은 복제하지 않음. 신규 보드게임에도 적용 |
| RT `docs/game-platform-realtime-coop-rules.md` | RT1 범위/출처; RT2 플랫폼/7축; RT3 R01~13; RT4 네 문서; RT5 검증; RT6 권위/확장 | STEP5C §5 최소6항목/R01~13의 승인 의미. 장르명에서 transport/renderer/tick/physics/prediction을 정하지 않음 |
| GV 기존 `docs/game-platform-governance.md` | 기존 절 유지 + GV1 권위/적용 전환; GV2 발견/버전/검증; GV3 전파/영향도 | 새 독립 Governance를 만들지 않음. AGENTS/템플릿/Guard/기존 소비자 영향도 연결 |
| 원 topic-owner | 기존 DB 계약, `docs/game-bgm.md`, `supabase/README.md`, `supabase/site/README.md`, 테스트 README, AGENTS, site README | 기존 구현·사이트·운영 범위 본문은 제자리 유지·정확한 절 참조. K라고 모두 Core나 신규 공통 규칙으로 옮기지 않음 |

**문서상 소유와 원문 보존:** 새 owner의 계승 절은 원문 ID/줄/부모·조건을 참조하고 그 적용범위를 설명한다. 원문을 문장째 복제해야 계승이 되는 것은 아니다. 새 owner에 참조 계승한 항목은 해당 신규 범위의 설명·변경 책임을 새 owner가 갖는다. 원문은 고정 출처로 남고, 기존 소비자에게 적용되는 기존 계약은 별도 scope를 유지한다. 같은 scope·topic에 경쟁하는 두 CURRENT 본문을 두지 않는다.

### 2.3 네 문서와 템플릿

네 문서 파일명과 책임은 그대로 둔다. `GAME_SPEC.md`는 현재 제품/기능·7축/적용 계약·장르/모델·Capability·비적용 이유·미지원/미결정을 기록한다. `DEVELOPMENT.md`는 실제 기능 진행·검증·다음 행동을 소유한다. `UI_DESIGN.md`는 개발 전 조사/VI/초기 baseline, `UI_DECISIONS.md`는 이후 의미 있는 결정·대안/이유/검증·유효 override를 소유한다. 최신 non-superseded override가 같은 항목의 baseline보다 우선하며 SUPERSEDED/REVERTED를 부활시키지 않는다. 명백한 초기 조사 오류/출처 오기 정정 예외는 이유를 추적한다.

기존 네 템플릿은 각각 같은 경로와 책임을 유지한다. 공통 형식의 질문을 채우되, Room/host/보드/카드/turn/winner/score 같은 질문은 실제 적용 모델/경험에 대해 답한다. 비적용은 이유를 적으며 실제 multiplayer 재대결이나 온라인 안전성을 무의미한 N/A로 지우지 않는다. `Win condition`은 승자가 없다는 실제 제품 결정을 명시할 수 있어야 하고, 기존 multiplayer rematch 항목은 §4의 승인되지 않은 hostless 면제로 바꾸지 않는다. 신규 vNext 선언은 GAME_SPEC의 선택 근거에 추가하며 과거 game-local baseline을 재작성하지 않는다.

runtime 없는 정확히 네 문서 bootstrap의 미등록 허용과 runtime 추가 순간 Registry/플랫폼 규칙 적용을 유지한다. 기능 자동 검증은 Developer Manual Design Review / Detail Polish를 대신하지 않는다. 기능/디자인 checkpoint 명령·lifecycle 기록·release closeout은 각각 원래 책임 문서에 기록한다.

## 4. E1 충돌·적용 전환 판단

### 4.1 DB와 non-DB

**J 승인 요청 X02:** 신규 vNext 온라인의 공통 의무를 MO3의 **동등 안전11**로 소유시키고, 실제 DB/RPC 모델의 상세는 기존 DB 계약을 참조하는 적용 전환을 택한다. 기존 게임/기존 계약 범위는 그대로다. 정식 상위 문서·템플릿·Guard 전환 전에는 하위 게임이나 Adapter가 현행 모든온라인 DB 요구를 자체 면제할 수 없다.

안전11의 대응은 ①익명 보호진입 차단 ②미승인회원 차단 ③허용회원 정책진입 ④비멤버 보호상태 차단 ⑤서버/승인 권위의 start 조건 ⑥낡은 입력/순서 거부 ⑦동일 명령 중복 mutation 방지 ⑧충돌 명령의 일관된 단일 권위결과 ⑨authorized current state 복구 ⑩적용 multiplayer same-context 재대결/초기화/ready/start/reconnect ⑪private-state 비노출이다. ⑥은 tick/stream에 정수 expected_version을 의무화하지 않고 동일 안전 의미와 oracle를 명시한다. ⑩의 host 의미를 바꾸는 상위 선택은 다음 절의 별도 게이트다. private 정보가 없다는 이유로⑪을 빼지 않는다. 이 열한 가지는 Data API 권한 검사 또는 A/C/P의 전체 oracle를 대체하지 않는다.

### 4.2 hostless와 재대결

**J:** 이번 판단으로 host가 성립하지 않는 multiplayer 재대결 예외를 새로 승인하지 않는다.

| 실제 선택 | 적용 / 진행 조건 |
|---|---|
| 초기 시작만 hostless, 재대결에는 host/ready 의미 성립 | 시작 조건은 게임 정책대로 권위자가 검사. 재대결은 기존 same-context/ready/host/start 의무 유지 |
| 재대결에도 host 의미 자체 불성립 | AGENT053, DEV299~311, DB038~044, UI190~198, SPEC-T016/033 등의 해당 범위에 상위 의미 변경안·대체 사용자 의사/시작 권위/공정성/이탈/복구·기존 영향도를 제시하여 별도 명시 승인. 그 조합만 설계 blocker |
| multiplayer 재대결 정책 미정 | N/A 아님. 실제 Probe GAME_SPEC에서 구현 전 닫을 선택. 현재 플랫폼 전체 blocker로 확대하지 않음 |
| 실제 pure local solo | Room/host/ready/온라인 RPC/multiplayer 재대결 의미상 비적용 가능. run 수명·안전 종료·새 run 격리 유지 |

### 4.3 현재 A/C/P, 수명, 공통 기능의 손실 금지

A는 필요한 owner/command lock을 얻고 **동일 finalizer transaction**에서 현재 predicate를 확인한 뒤 실제 command storage를 시작하는 최종 인가·착수다. ingress/BEGIN/queue가 아니며 lock wait 뒤 낡은 allow를 쓰지 않는다. known expiry 뒤 새 A, 처음부터 무권한 A는 금지한다. 기한 내 적법 A를 지난 **같은 transaction의 일반 저장 지연 late C만** D0010 범위로 수용한다. C는 실제 commit으로 관측하며 A/ACK로 바꾸지 않는다. 새 command/transaction/retry는 fresh A다.

새 P는 recipient/session/view/payload에 대한 최종 fresh 인가와 실제 transport 인계 경계를 따른다. duplicate 응답·ACK·snapshot도 새 P다. owner anchor는 C/rollback까지, old writer와 old sender 보호는 각각 유지한다. 권한 불명/실패 인지 시 보호 입출력 차단/pause, 최초 t0+60초 deadline, retry/restart로 초기화 금지, terminal 뒤 LIVE 부활 금지를 유지한다. D0007/08의 actual C deadline 및 Z1 HOLD 중 D0010이 대체한 부분만 새 해석을 적용한다. 입증된 after-check 장시간 정지의 한계와 일반 저장 I/O late C 허용을 합치지 않는다. 시계 수치만으로 같은 transaction/인과를 증명하지 않으며 누락 trace는 INCONCLUSIVE다.

LI의 계약은 success/error/null/finally/cleanup/leave/effect/후속 비동기 완료, 부분 초기화 실패·재진입·반복 dispose·dispose 뒤 늦게 얻은 자원까지 적용한다. 반영 직전 owner/context/권한/모델 순서/반영시점이 맞아야 한다. T01 같은 Room 새 Match, T02 A→B→A, T03 role/view/user를 유지하고 roomless는 run/view/resource 전환으로 대응한다.

H1은 기존 BGM 본체의 내부 최신 의도/종료/작업귀속 최소 보완 전 무보완 직결 판정을 보류한다. wrapper만으로 내부 Audio/DOM late 완료를 보호했다고 선언하지 않는다. Invite H2 등록/old disposer·H3 늦은 handler/dialog 완료는 실제 owner 최소 보완/동등 격리와 전 구간 identity가 필요하다. target/admission·사이트 handler/dialog 권한을 보존한다. H4 비room Invite의 미래 미선택은 전체 blocker가 아니다.

공식 결과 producer의 확정/정정, 참가자 outcome, viewer 표현, 통계/보상 consumer는 서로 다른 책임이다. 정정은 새 경기 집계가 아니라 기존 기여를 대체하는 관계다. commit 미상 때문에 새 identity를 무조건 재발행하지 않는다. action retry / simulation replay / current state 재적용 / UI effect·SFX / 통계·기록·보상 / publication 여섯 중복 scope를 하나의 done/version으로 대체하지 않는다. merge·구현·activation·공개 사실·NEW/공지 소비는 별도로 기록한다. 없는 winner/score/XP나 결과를 만들지 않는다.

## 6. C — 물리 경로, 버전과 권위 전환

### 6.1 코드/시험 경로와 기존 소비자 격리

| J 선택 | F 근거 / 적용 조건 | 후속 변경과 중단 조건 |
|---|---|---|
| 신규 browser/shared 구현 root `games/shared/vnext/` | direct games에서 shared만 게임 탐지 제외. 기존 flat shared API와 물리 분리 | root 아래 core/models/capabilities/adapters는 필요한 구현이 생길 때만 생성. profiles는 선제 생성 안 함 |
| server 전용 root `services/game-platform-vnext/` | 기존 고정 tree에 services root 없음. 승인된 STEP4B gate/worker/controller·finalizer 호출·외부기록/복구의 서버 코드를 둘 제안 위치 | 7B에 이 경로의 변경/검증 발견과 browser import·site asset 유입 금지 검사를 연결한 뒤 7D 필요한 서버 구현만 추가. 폴더명은 비밀 경계가 아님. 비밀은 파일/브라우저 bundle/Git에 넣지 않고 기존 승인된 운영 주입 절차로 공급 |
| 기존 `games/shared/index.js`는 vNext 재수출 통로로 사용하지 않음 | cant-stop/app·no-thanks/main이 기존 barrel 실제 소비 | 신규 소비자는 명시한 vnext 진입/API만 import. 새 진입 파일명/공개 export 목록은 구현 Slice에서 최소 선택. 기존 import/API/정상 동작 무변경 |
| Registry 기존 단일 metadata를 참조 | 기존 Registry 반환형은 계약버전/모델을 현재 포함하지 않음 | 실행 선택은 GAME_SPEC와 신규 game-local 구성에서 단일 출처로 연결. Registry metadata 복제 금지. Registry 필드/API 변경이 필요하면 별도 계약 검토; 기존게임 설정 변경 강제 안 함 |
| unit/contract 테스트는 우선 `tests/game-platform-vnext-*.test.js` flat | 현재 `test:game-platform` glob에 포함 가능 | 테스트가 실제 선택 모델 oracle를 실행해야 함. 파일 존재는 PASS 아님. 추가 중첩/fixture discovery 필요 시 명시 연결 |
| DB 사용 게임은 기존 `tests/game-db-integration/<game-id>.test.js` | 기존 disposable runner/11scenario/harness | 기존 DB workflow 재사용. non-DB는 flat vnext contract runner에 안전11 의미별 oracle/환경을 연결; 이름만11개 등록한 mock은 production 증거 아님 |
| 문서 paths는 §2.2 flat | 현재 flat policy reader 범위 | 새 path 발견 외에 CURRENT/scope/권위/링크 검사를 수정. rebuild artifacts는 HISTORY/설계 근거이며 runtime rulebook 대체 안 함 |

중첩 JS의 node syntax 검사가 이미 재귀라는 사실은 새 shared module 문서/test 요구 탐지를 대신하지 않는다. 기존 flat shared regex를 `games/shared/vnext/**`의 실제 새 모듈까지 보호하도록 **추가 전에** 확대한다. 기존 flat 모듈 예외/index 처리의 의도를 유지하고 새 경로가 게임 디렉터리로 분류되지 않는 양/음성 사례를 둔다. site assets build가 모든 게임 entry를 bundle한다는 가정은 하지 않는다. 신규 게임 entry의 import closure·배포 파일·실제 loaded bytes는 후속에서 별도 확인한다.

**서버 배치의 구분:** `games/shared/vnext/`는 브라우저가 소비 가능한 계약/연결 코드의 영역이다. 권위 인가·PG finalizer·native 최종 송신 gate·서버 credential·운영 controller가 그 안에서 실행된다는 뜻이 아니다. `services/game-platform-vnext/`는 승인된 서버 배치용 소스 경계이며 browser/shared→server 구현 import는 금지한다. 서버와 browser는 명시 계약으로 통신하며 비밀 없는 공용 의미만 재사용한다. server 전용 코드가 site assets/import closure나 정적 배포 산출물에 들어가지 않도록 7B에서 발견/제외 검사를 준비한다. 현재 정적 배포가 새 경로를 자동 제외한다고 추정하지 않으며, 실제 배포 제외가 증명되지 않으면 해당 server 산출물의 공개 배포를 막는다. 구체 빌드/언어/entry·서비스 파일은 7D에서 승인 구조를 구현하는 최소 범위로 정한다.

선택되어 있는 Supabase Free 서울 + Lightsail Linux/IPv4 2GB 서울 + DynamoDB Standard 서울 provisioned, 같은 VM의 권한 분리 gate/worker/controller, 독립 scheduler/monitor의 승인 의미는 STEP4B 설계/현재 D0010을 그대로 참조한다. 공급자를 다시 선택하지 않는다. 비노출 predicate·최종 transaction·ticket/guard·native TLS/send·외부기록/삭제/복구의 상세 본문은 MO3/MO6에서 승인 STEP4B를 참조한다. 신규 DB 지원물/forward migration의 저장 위치는 **해당 DB 모델의 기존 관리·배포 경계 안에서** 정하되 기존 SQL을 이동/재작성하지 않는다. 실제 migration 파일명·DDL·server API를 STEP6에서 선제 생성하지 않는다.

### 6.2 계약 식별과 호환

**J:** 문서 계약은 주제별 안정 식별자와 revision을 사용한다. 첫 제안 식별자는 `GP-COMMON/1`, `GP-LIFETIME/1`, `GP-MODELS/1`, `GP-CAPABILITIES/1`, `GP-GENRE-BOARD/1`, `GP-GENRE-REALTIME-COOP/1`이다. `/1`은 사용자 승인과 정식 동결을 거쳐 적용할 첫 의미 revision 후보이며 지금 구현 지원이나 런타임 wire version이 아니다. AR2가 식별자→owner path/절→유효 승인→적용 scope를 소유한다.

GAME_SPEC는 적용 계약 ID/revision, 실제 선택 모델 계약 ID/revision, 장르 규칙, Capability·비적용/미지원, 선택 이유와 검증 링크를 기록한다. 후속 선택 모델의 구체 식별자는 해당 모델이 실제 정의될 때 부여한다. 기존 게임은 문서적 비교기준 `legacy@f34f4f1`로 지칭할 수 있지만 기존 파일/Registry에 새 필드를 강제로 넣지 않는다.

같은 public API라도 인가·수명·순서·결과/정정 의미가 바뀌면 계약 revision과 소비자 재검토 대상이다. 편집/링크 정정은 의미 변경과 구별한다. consumer가 요구한 계약과 제공 구현의 명시적 호환 증거가 있어야 하며 `latest`/정수 대소만으로 호환을 추정하지 않는다. 한 모델 선택은 다른 모델을 자동 지원하지 않는다. 구체 API·schema·class·전역 semver·wire 협상 protocol은 이번 판단에 필요하지 않아 동결하지 않는다.

Invite VERSION=1은 game_room envelope, legacy SQL v1.0.0은 국소 bundle, 실행계획1.5는 작업계획이다. 이를 전체 플랫폼 계약버전으로 재사용하지 않는다.

### 6.3 한 CURRENT와 최소 원자적 전환

권위 키는 **topic + 적용 계약/consumer scope**다. 신규 vNext의 상위 CURRENT는 AR, 공통 개발 owner는 CO, 상세는 LI/MO/CA/BO/RT, 전파/검증 owner는 GV다. 기존 development/UI/DB의 기존 계약 scope는 유지한다. 상위 전환 뒤 development/UI를 신규의 경쟁 최상위로 남기지 않고 적용 안내/원문 계승 참조로 읽게 한다. 기존 링크는 유효한 redirect/참조를 유지하며 원문 HISTORY 증거와 기존 적용 본문을 무차별 HISTORY로 바꾸지 않는다.

| 순서 / 계획 STEP | 같은 적용 전환 안에서 맞출 최소 묶음 | 이전 상태에서 안전하게 둘 수 있는 것 |
|---|---|---|
| 7A1 공통 상위 | AR/CO/LI의 승인 공통본문, MO/CA의 승인 계약 본문·모델/기능 인덱스와 적용 범위, AGENTS·development§17·UI상위 안내·games README·네템플릿의 진입, GV, Guard의 RULEBOOK/UI literal·필수절/참조 검사 및 해당 계약 테스트 | BO/RT는7A2/7A3 준비 전 승인artifact/기존원문으로 정확한유효계승경로 유지. MO/CA 안의 실제미선택 모델/API는미지원 항목으로명시; 승인된계약본문자체의작성을뒤로미루지 않음 |
| 7A2 보드 계승 | BO 본문·원문ID 목적지·AR인덱스·템플릿 보드 질문·필요 Guard/참조 검사 | 원문 전수 의미 보존과 참조 도달을 확인하기 전 기존 계승 경로 제거 금지 |
| 7A3 비보드 내용 | RT R01~13/최소6항목·인덱스·선택 모델 참조·네문서 질문/해당검사 | 실제 second Probe 별도 장르는 경험 차이가 있을 때만 추가 |
| 7B 탐지/모듈 안내 | nested shared 새module 탐지, 신규 계약 scope/버전·단일 Registry 연결·flat test 발견·online→model별oracle 연결·기존게임 분류·모듈 구현상태 안내 | runtime 파일은 아직 추가하지 않음. serverroot/browser-import·static-asset제외도같이발견. 7A1에 꼭 필요한 최소 Guard를7B까지 미루지 않음 |
| 이후 runtime 추가 전 | 7B 탐지/검사 준비·해당 모델 계약/필수 정책·허용된 구현 단계 확인 | 탐지 공백 동안 임시 runtime·빈 adapter·지원 flag 추가 금지 |

LI는7A1에서 STEP4A 전체수명 본문을 반영한다. MO는7A1에서7축·세션/안전11·현재A/C/P·단일복구·결과/운영의 **이미 승인된 계약 본문**을, CA는7A1에서 Registry/Access/Shell/Invite/BGM·결과소비/공개/Profile의 **이미 승인된 책임·조건 본문**을 정식 경로에 반영한다. 이 문서의 존재는 모델 구현/API 사용가능을 뜻하지 않는다. 7B 모듈 안내는 실제 export·구현상태·검증경로를 연결하고, 7D 실제 선택모델 구현 전 그 모델에 필요한 아직 미선택 세부 oracle/취소/시간공백 정책을 해당 MO절에 명시한다. 승인 의미 안의 구체화와 새 상위 선택을 구별하고, 후자는 설계게이트로 반환한다. 이 순서로 LI/MO/CA의 계획 경로가 영구 빈본문으로 남지 않는다.

원자성은 각 **권위/적용 전환의 최소 링크 묶음**에 관한 판단이다. 계획의7A1/7A2/7A3/7B 별도 검토 지점을 한 대형 PR로 합치지 않는다. 각 PR은 자기 전환이 적용되는 순간 링크·Guard·조건이 함께 맞아야 한다. 반영되지 않은 future path는 계획 경로로 명시한다.

