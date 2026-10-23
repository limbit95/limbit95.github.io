# Game Platform

## STEP7D S1 — 비공개 PG 저장부 부분 결과 승인 / integration·main 미병합

PR431은 integration `990ad56…`에 병합됐다(integration385/main382·Core main 미이식).
아래 PR431 미병합 표시는 승인 기록 당시 이력이다. 이번 `services/game-platform-vnext/sessionStorage.mjs`와
[private SQL/호출·미지원 경계](../supabase/game-platform-vnext/README.md)는 PR432 head92d5471…의 **부분 결과 APPROVED / integration·main 미병합**이다.
`tests/game-platform-vnext-session-storage.test.js`는 offline I/O/정적 SQL 계약이다. 실제 DB/admission/A/C/native P는 미입증.
network/runtime 호출·지원/oracle 등록 없이 STEP7D 미완료·vNext 행동 NOT_RUN·운영 UNKNOWN을 유지한다.
[제출/검증 및 미구현](../docs/game-platform-rebuild/artifacts/step-7d-s1-pg-storage-submission-validation.md)을 읽는다.
DB README의 후보/정식 반영 없음은 저장소 밖 후보 작성 당시 상태이며 실제 DB 미설치·미지원 제한은 그대로다.
[부분 결과 승인 범위](../docs/game-platform-rebuild/checkpoints/CP-0114-step-7d-s1-pg-storage-partial-result-approved.md)와 실제 지원·병합·배포를 구분한다.

## STEP7D S1 — 부분 코드 결과 승인 / integration·main 미병합

`shared/vnext/models/coopSession.js`의 `createCoopSession`은 current full-state 채택/복구·명령 identity 보유의 후보다.
Core 단일 동기 반영을 소비하며 실제 backend admission/PG commit/native P/transport·site Adapter는 미구현이다.
`services/game-platform-vnext/sessionControl.mjs`의 ready 변경은 write proposal이며 실제 mutation/인가/commit이 아니다.
[후보 범위·경계·미지원](../docs/game-platform-rebuild/artifacts/step-7d-s1-candidate.md),
`tests/game-platform-vnext-coop-session.test.js`의 offline 계약을 함께 읽는다.
실제 runtime/oracle/Registry 지원 등록 없음. H1~3 본체의 무보완 wrapper 지원을 선언하지 않는다.
STEP7D 미완료·부분 결과 승인/실제 지원 미입증·integration/main 미병합·vNext 행동 NOT_RUN·운영 UNKNOWN.

## 신규 vNext 계약과 기존 consumer 적용 경계

신규 vNext 상위 진입은 `docs/game-platform-architecture.md`, 공통 개발 규칙은 `docs/game-platform-common-rules.md`, 전체 수명은 `docs/game-platform-lifetime-contract.md`, 선택 모델은 `docs/game-platform-model-contracts.md`, 공통 기능은 `docs/game-platform-capability-contracts.md`다. 같은 topic+적용 계약/consumer scope에서 이 owner를 따른다. 기존 `docs/game-platform-development-rules.md`·`docs/game-platform-ui-rules.md`·DB 계약은 기존 consumer와 고정 원문 계승의 범위를 유지한다. 기존 게임/Auth/API/SQL/metadata/네 문서를 이관하지 않는다.

보드의 실제 하위 규칙은 `docs/game-platform-board-rules.md` BO1~4다. 신규 보드 경험에만 적용하고 공통·모델 본문은 AR의 단일 owner를 참조한다. 실시간협동·공간 경험의 실제 하위 규칙은 docs/game-platform-realtime-coop-rules.md RT1~6이며 승인된 제한 scope에만 적용한다. AR4의 실제 BO/RT 및 고정 source/승인 artifact 발견 경로를 유지한다. 문서/권위 연결은 구현·지원/오픈 완료가 아니다. UI_DESIGN baseline·최신 유효 UI_DECISIONS override·Developer Manual Design Review / Detail Polish, `기능 체크포인트 기록하자`·`디자인 체크포인트 기록하자`를 유지한다. 새로운 의미 충돌은 topic-owner/ARCHITECTURE CHANGE 절차로 반환한다.

이 디렉터리는 앞으로 추가되는 게임을 위한 공통 Game Platform 기반입니다.

신규 platform-native 게임을 구현하거나 수정할 때는 [Game Platform Development Rules](../docs/game-platform-development-rules.md)와 [Game Platform UI Design Rules](../docs/game-platform-ui-rules.md)를 **필수 실행 기준**으로 먼저 확인합니다. 사용자가 매 작업마다 플랫폼 규칙이나 UI 조사/설계를 다시 설명하지 않아도 두 문서를 기본 전제로 적용합니다.

[Game Platform Strategy](../docs/game-platform-strategy.md)는 플랫폼 구축 배경과 Legacy 정책을 이해하기 위한 참고 문서이며, 신규 게임의 현재 실행 규칙보다 우선하지 않습니다.

## 경계

- 기존 `liar-game/`, `the-game/`, `marble-game/`은 기존 경로와 런타임을 유지합니다.
- Drawing Spy는 Liar Game 내부 모드이므로 별도 루트로 이동하지 않습니다.
- 기존 게임은 새 플랫폼 기능이나 공통 레이아웃을 강제로 적용하지 않습니다.
- 새 게임은 가능한 한 `games/<game-id>/` 아래에 두고 `games/shared/`의 공통 계약을 사용합니다.
- 신규 게임은 runtime 구현 전에 `games/GAME_SPEC_TEMPLATE.md`, `games/DEVELOPMENT_TEMPLATE.md`, `games/UI_DESIGN_TEMPLATE.md`, `games/UI_DECISIONS_TEMPLATE.md`를 기준으로 `games/<game-id>/GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DESIGN.md`, `UI_DECISIONS.md`를 만들고, 기능 기준과 디자인 기준뿐 아니라 각 트랙의 진행 기록 경계까지 먼저 정리합니다.
- `GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DESIGN.md`, `UI_DECISIONS.md`만 존재하는 bootstrap 디렉터리는 미완성 게임 노출을 막기 위해 Registry 등록 전 상태로 둘 수 있습니다. runtime 파일을 추가하는 순간 Registry 규칙이 적용됩니다.
- 각 platform-native 게임은 `GAME_SPEC.md`를 현재 기능 설계 기준, `DEVELOPMENT.md`를 기능 구현·검증 진행 인수인계, `UI_DESIGN.md`를 runtime 개발 전 디자인 전수 조사·분석과 최초 Phase를 담은 baseline, `UI_DECISIONS.md`를 개발 시작 후 디자인 진행·변경 의사결정·검증과 baseline override 이력으로 관리합니다.
- `기능 체크포인트 기록하자`는 `DEVELOPMENT.md` 중심의 기능 handoff 명령이며 기능 설계 변경이 있을 때만 `GAME_SPEC.md`를 함께 정합화합니다. 디자인 문서는 이 명령 때문에 수정하지 않습니다.
- `디자인 체크포인트 기록하자`는 `UI_DECISIONS.md` 중심의 디자인 handoff 명령이며 현재까지 안정화된 확정 디자인 decision만 기록합니다. `UI_DESIGN.md` baseline과 기능 진행 문서는 이 명령 때문에 수정하지 않습니다.
- 두 명령은 한 요청에서 함께 사용할 수 있습니다. 접두어가 없는 일반적인 checkpoint 표현이나 새 채팅용 정리·문서·요약 요청은 공식 repository checkpoint 명령으로 확대 해석하지 않습니다. 유효한 현재 작업 브랜치가 있으면 그 브랜치에 commit하고, 없으면 저장소의 일반 브랜치 규칙에 따라 별도 작업 브랜치를 사용합니다.
- 두 사용자 명령과 별개로 기능 Phase 완료, 디자인 lifecycle 기록 트리거, release closeout 등 규칙 문서의 기존 자동 갱신 시점은 그대로 유지합니다.
- 게임 규칙, 턴 상태 머신, 승패 조건은 기능 문서에, 게임별 Visual Identity·레이아웃·애니메이션의 최초 baseline과 후속 변경 이력은 각각 `UI_DESIGN.md`와 `UI_DECISIONS.md`에 남겨 둡니다.
- UI Phase를 이어갈 때 초기 계획과 후속 결정이 충돌하면 최신 non-superseded `UI_DECISIONS.md`를 우선하며, 이미 반영된 사용자 디자인 수정을 과거 `UI_DESIGN.md` 안으로 회귀시키지 않습니다.
- 기능 구현이 release 후보 수준에 도달하면 디자인을 자동 완료 처리하지 않고 Developer Manual Design Review / Detail Polish로 전환합니다. 개발자가 실제 브라우저에서 플레이하며 요청한 디테일 수정은 영역이 안정화된 시점에 `UI_DECISIONS.md`에 확정 decision 단위로 남기며, 디자인 PR/브랜치 종료 또는 release closeout 전에 누락을 확인합니다.
- 최초 `UI_DESIGN.md`를 계획대로 구현한 사실 자체는 `UI_DECISIONS.md`에 중복 기록하지 않습니다. 이 문서는 baseline에서 벗어난 확정 변경과 개발자의 수동 디자인 리뷰 결과를 보존하는 데 사용합니다.
- game-local 작업에서 상위 Game Platform 규칙과 충돌하는 새 필요를 발견하면 일반 하위 변경으로 바로 구현하지 않습니다. 플랫폼 전반에 필요한 변경으로 토의·합의되면 **ARCHITECTURE CHANGE**로 승격해 Development Rules와 Governance의 상·하위 정합화 및 전체 platform-native 게임 영향도 감사를 거칩니다.
- 멀티플레이 게임은 게임 종료 후 동일 room/player context에서 재대결 준비 상태로 전환하고, 참여자 준비 완료 후 방장이 다시 시작할 수 있는 흐름을 기본 제품 요구사항으로 설계합니다. 내부 RPC/adapter 공통화는 별도 근거 없이 강제하지 않습니다.

## Released game lifecycle

출시가 끝난 platform-native 게임의 `DEVELOPMENT.md`는 `Status: RELEASED`, `Active branch: main`과 날짜가 있는 release 기록을 유지합니다.

후속 수정은 종료된 feature 브랜치를 재사용하지 않고 최신 `main`에서 새 브랜치로 시작합니다. 구현 중 발견한 플랫폼 교훈은 [Game Platform Development Rules](../docs/game-platform-development-rules.md)의 release feedback loop에 따라 SHARED / GAME-LOCAL / RELEASE-OPERATIONS로 다시 분류합니다.

특정 platform-native 게임의 구현을 다른 신규 게임의 기준 사례로 삼지 않습니다. 현재 공통 계약과 규칙 문서, 템플릿을 기준으로 시작하고 게임별 기능 기준/진행과 디자인 기준/이력은 해당 게임 디렉터리 안의 `GAME_SPEC.md`, `DEVELOPMENT.md`, `UI_DESIGN.md`, `UI_DECISIONS.md`에서 분리해 관리합니다.
## Phase 3 foundation

- `registry.js`: 게임 메타데이터와 capability Registry
- `accessGate.js`: 인증/승인회원 Access Gate
- `roomLobbyContract.js`: 방 생성/참가/준비/시작 등 Room/Lobby adapter 계약
- `snapshotCoordinator.js`: authoritative snapshot refresh, stale version 거부, invalidation coalescing
- `reconnectRefresh.js`: online/pageshow/visibility 복귀 시 snapshot refresh trigger
- `actionContract.js`: `expectedVersion` + `clientActionId`를 포함하는 versioned/idempotent action envelope
- `gameShellState.js`: 연결 상태와 플레이어 표시용 공통 view-state 계약
- `gameShell.js`: 신규 게임용 공통 화면 골격, 연결 상태, 플레이어 roster
- `game-shell.css`: 신규 게임이 명시적으로 opt-in 하는 공통 Shell 스타일
- `gameInvite.js`: site invite 인프라를 재사용하는 platform-native `game_room` 초대 계약

공통 계약은 새 게임을 위한 기준입니다. 기존 게임을 이 구조로 마이그레이션하기 위한 호환 계층으로 사용하지 않습니다.

`game-shell.css`는 전역 사이트 CSS에 자동으로 포함하지 않습니다. 신규 게임 페이지가 필요할 때 직접 로드하며, Legacy 게임과 기존 커뮤니티 화면에는 적용하지 않습니다.

서버 권한 검증과 게임 상태 판정은 계속 각 게임의 DB/RPC가 최종 권위입니다. 프런트 공통 모듈은 DB authorization을 대체하지 않습니다.

Invite 영향 분석과 Legacy 경계는 [Game Platform Invite Analysis](../docs/game-platform-invite-analysis.md)를 참고합니다.

## STEP7B 공통 모듈 연결·구현 상태 안내

신규 vNext의 규범 owner는 [AR](../docs/game-platform-architecture.md), [LI](../docs/game-platform-lifetime-contract.md), [MO](../docs/game-platform-model-contracts.md), [CA](../docs/game-platform-capability-contracts.md)다. 아래는 현재 exports와 승인된 연결 조건의 안내이며 API 상세/새 규범을 독립 소유하지 않는다. [승인 STEP5A 선택표](../docs/game-platform-rebuild/artifacts/step-5a-common-module-selection.md)·[수명/검증 owner와 H1~4](../docs/game-platform-rebuild/artifacts/step-5a-compatibility-lifetime-verification.md)의 조건이 우선한다. 기존 consumer는 그대로 보존한다.

현재 legacy shared barrel의 실제 export 출처는 [shared/index.js](shared/index.js)다. 신규 games/shared/vnext/core/의 최소 조립·수명 exports는 아래 STEP7C 안내에서 구분한다. 선택 모델/runtime 지원과 services/game-platform-vnext/ 서버 구현은 아직 없다. 기존 barrel을 신규 재수출 통로로 바꾸지 않는다. 다음 symbol이 존재한다는 사실은 vNext의 전체 수명·권한·현재성 지원 완료가 아니다.

| 역할 / 실제 export 출처 | 현재 public exports | 적용 모델·consumer와 연결/정리 책임 | 구현·보완 상태 / 검증 위치 |
|---|---|---|---|
| Registry / [registry.js](shared/registry.js) | GAME_REGISTRY, defineGame, getRegisteredGame, listRegisteredGames | 기존 단일 metadata 조회·route 식별을 참조. 실행 구성은 다른 책임이며 표시 flag가 서버 권한을 집행하지 않음 | 기존 본체 존재. 두 번째 목록 금지. [foundation](../tests/game-platform-foundation.test.js) 및 게임별 Registry tests; 신규 구성/호환 실행 미검증 |
| Access / [accessGate.js](shared/accessGate.js) | GAME_ACCESS_REASON, createGameAccessGate, resolveApprovedMemberAccess | 주입 Auth initialize/getState/subscribe의 진입 UX. 반환 unsubscribe는 소비자 실행 owner가 정리; 늦은 initialize·구독 완료 채택은 runtime/model과 LI, 최종 A/P는 backend | 기존 Gate 재사용+얇은 사이트 연결. 독자 Auth 엔진 없음. [foundation](../tests/game-platform-foundation.test.js); 실제 freshness/권한·전체 수명 NOT_RUN |
| Room surface / [roomLobbyContract.js](shared/roomLobbyContract.js) | ROOM_LOBBY_METHODS, defineRoomLobbyAdapter | 8개 surface가 자연스러운 모델만 형식/binding 재사용. game-local RPC/정책·구독/leave와 실제 세션/수명 owner는 구별. roomless에 빈 Room/ready 강제 금지 | 기존 형식 검사이며 실제 서버 집행 보장 아님. [contracts](../tests/game-platform-contracts.test.js)·게임별 room-lobby tests. 신규 모델/late leave 후속 |
| Action 형식 / [actionContract.js](shared/actionContract.js) | createClientActionId, createVersionedAction | roomId/비음수 정수 expectedVersion/clientActionId 의미가 맞는 기존 DB 모델의 봉투. 게임 규칙/인가/중복 mutation은 backend; 모든 모델에 이 모양 강제 금지 | 기존 형식 utility. [contracts](../tests/game-platform-contracts.test.js). A/C/P/공식 결과/효과 중복 보장의 대체물 아님 |
| Snapshot / [snapshotCoordinator.js](shared/snapshotCoordinator.js) | createSnapshotCoordinator, snapshotVersion | 기존 consumer 보존. 순수 version 검사/병합 알고리즘은 의미가 맞는 범위에서 재사용; 신규 최종 채택·ordering·reconciliation·전체 완료는 선택 모델 하나가 소유 | 기존 coordinator를 무보완 vNext 최종 채택자로 연결하지 않음. [contracts](../tests/game-platform-contracts.test.js); T01~03·initial/live/quiet loss·late 완료는 후속 |
| Reconnect trigger / [reconnectRefresh.js](shared/reconnectRefresh.js) | createReconnectRefreshTriggers | start/stop이 browser listener를 설치/정리. stop은 진행 중 완료 무효화가 아님. trigger를 Snapshot과 같은 모델의 복구 요청으로 얇게 연결 | 기존 trigger 존재; 새 별도 상태/복구 엔진 없음. [contracts](../tests/game-platform-contracts.test.js); fresh LIVE/5초 복구/최초60초·terminal NOT_RUN |
| Shell state / [gameShellState.js](shared/gameShellState.js) | GAME_CONNECTION_STATE, normalizeGamePlayers, resolveGameConnectionState | 순수 표시 state를 선택적으로 소비. 실제 model 상태·role/view/currentness는 모델 owner, 게임별 UI/결과 연출은 local | 기존 표시 부품. [shell](../tests/game-platform-shell.test.js). 모든 게임 DOM/Room/player roster 강제 없음 |
| Shell DOM / [gameShell.js](shared/gameShell.js) | createGameConnectionBanner, createGamePlayerRoster, createGameShell | 명시적 DOM/document 소비자의 표시 부품. mount·전환·제거는 view owner/LI, 생성된 UI가 권위 상태를 판정하지 않음. game-shell.css opt-in 유지 | 기존 본체; 공통 renderer/결과 엔진으로 승격하지 않음. [shell](../tests/game-platform-shell.test.js); 실제 DOM/모바일·mount 수명은 NOT_RUN |
| Room Invite / [gameInvite.js](shared/gameInvite.js) | GAME_ROOM_INVITE_TARGET, GAME_ROOM_INVITE_VERSION, buildGameRoomInviteDestination, createGameRoomInvite, parseGameRoomInvite, resolveGameRoomInvite | game_room v1 envelope/route·site client를 재사용. 생성→resolve→entry→dispatch→join의 동일 identity와 backend admission, 사이트 handler/dialog owner 유지 | 본체 존재+조건부 얇은 연결. H2 등록 교체/old disposer, H3 내부 QR/copy/share late 완료의 무보완 적합성은 보류. [invite](../tests/game-platform-invite.test.js)·[사이트 owner](../js/invites/inviteRegistry.js)·[share](../js/invites/inviteShare.js). H4 비room은 미래 미선택 |
| 사이트 BGM / [controller](../js/game-audio/bgmController.js), [player](../js/game-audio/bgmPlayer.js) | BGM_STATE, createBgmController; mountBgmPlayer (shared barrel export가 아님) | 기존 site utility의 실제 controller가 Audio/재생 의도/완료와 destroy를, player가 구독/DOM과 destroy를 소유. game-local은 곡/mode/연출과 자기 사용권을 연결; 공용 자원 전체 파괴 금지 | 기존 본체 재사용+내부 최소 수명 보완 방향. **H1 무보완 vNext 사용 가능 판정 보류**. [기존 API/정책 owner](../docs/game-bgm.md)·[기존 unit](../the-game/tests/bgm.test.js); 실제 browser/audio NOT_RUN. formal shared 승격/새 audio engine 없음 |

새 모델은 [MO](../docs/game-platform-model-contracts.md)의 실제 정의/ID·revision/조건과 검증 owner를 연결해야 한다. 문서 의미 계약 /1, Invite v1, legacy SQL v1.0.0, 계획1.5는 서로 다른 식별이다. Game-local 연결 파일은 본체 중복으로 단정하지 않으며 [STEP5A 중복 기준](../docs/game-platform-rebuild/artifacts/step-5a-duplication-prevention.md)을 따른다. Result/정정·여섯 중복·Publication·Profile은 CA의 승인 경계를 참조하고 없는 서비스/보상/엔진을 만들지 않는다.

탐지·모델 oracle/서버 공개 차단의 실제 검사와 제한은 [Governance STEP7B](../docs/game-platform-governance.md#step7b-탐지검증-연결과-제한)를 참조한다. 안내/검사 성공과 실제 구현·행동 검증·공개 activation은 구별한다.

<a id="step7c-최소-core--구현검토-대기"></a>

## STEP7C 최소 Core — 정식 결과 승인·미병합

규범 owner는 [AR1](../docs/game-platform-architecture.md#ar1-적용책임의존)·[LI1~3](../docs/game-platform-lifetime-contract.md)이며 승인 STEP6 I1 범위다. 이 안내는 실제 API 사용/제약을 설명하고 상위 권한·모델·수명 의미를 재정의하지 않는다. **STEP7C COMPLETED / FORMAL_RESULT_APPROVED / INTEGRATION_NOT_MERGED**. 사용자 2026-10-14 18:22:47 KST 승인 대상은 PR423 head746c4b899b6d0ec4d8e45d930f6d5b63c4ae3b3d이며 [CP0100](../docs/game-platform-rebuild/checkpoints/CP-0100-step-7c-result-approved.md)에 기록한다. 실제 모델/게임 지원 승인이 아니며 행동 NOT_RUN·운영 UNKNOWN·후속 의무 유지. 기존 games/shared/index.js에는 재수출하지 않는다.

| 실제 export / 파일 | 사용·owner·한계 |
|---|---|
| createExecutionScope / [executionScope.js](shared/vnext/core/executionScope.js) | 로컬 실행과 작업의 소유 수명. capture(context)로 작업 사용권, advance()로 맥락 경계를 갱신하고 이전 작업 무효화·정리, dispose()로 종료. context는 모델이 해석하는 불변 작업 근거이며 Room/host 필드는 강제하지 않음 |
| createExecutionBindings / [executionBindings.js](shared/vnext/core/executionBindings.js) | 기존 Registry 조회 참조 + game ID별 modelContract/initialize 구성만 보관. metadata catalog 복제 없음. register의 반환 사용권 dispose는 해당 등록만 제거하고 실행을 종료. replace는 old 실행을 즉시 무효화하며 반환 previousDisposal의 정리 결과를 반드시 관측 |

Scope의 isApplicable({context, completion})는 선택 모델/consumer가 실제 현재 context·정보/행위 권한·ordering 조건을 판단하는 **동기·부수효과 없는 검사**다. 기본값은 거부다. task.commit(completion, apply)는 모델 판단 전후 로컬 수명을 확인하며 현재일 때만 동기 apply를 호출한다. 성공/error/null/finally/cleanup/leave/effect/후속 완료 모두 같은 반영 경계를 사용한다. 반환 true는 해당 동기 반영 연결이 실행됐다는 뜻이며 backend 인가/actual C·모델 지원 인증이 아니다.

await는 commit 바깥에서 수행하고 결과 반영 직전에 다시 commit한다. apply는 하나의 동기 반영만 수행하며 내부 await·맥락을 바꾸는 재진입·비보호 후속 callback을 시작하지 않는다. 추가 외부 호출/후속 완료는 새 반영 직전 같은 검사를 거쳐야 한다. async apply는 호출 전에 거부한다. 일반 함수가 promise를 반환하는 오용은 오류로 보고하지만 이미 시작한 임의 JavaScript를 되돌릴 수 있는 sandbox는 아니다. payload를 바꾸거나 old 작업에 새 label을 붙여 재채택하지 않는다. 현재 consumer의 명시적 authoritative·authorized 재검증은 현재 capture의 정책으로 표현한다.

await scope.own(resource, release) 또는 task.own으로 **획득 직후** 반환/해제할 자기 소유권만 등록한다. release는 캡처한 자원을 해제하고 mutable 전역의 새 자원을 찾아 파괴하지 않는다. site 공유 본체 대신 자기 사용권만 반환한다. lease.release와 dispose는 해제를 한 번만 실행하고 같은 promise로 결과를 관측한다. 종료/advance는 먼저 반영권을 무효화하고 역순으로 정리하며 독립 실패를 AggregateError로 보고한다. advance는 이전 child를 생성 역순으로 하나씩 기다리며, 각 owner 내부 자원은 등록 역순이다. 서로 다른 child의 임의 획득 시점으로 의존관계를 추론하지 않는다. 의존 자원은 이 소유/등록 순서 또는 자신의 해제 callback에서 실제 의존 순서를 맞춰야 한다. 별도의 timeout/retry 엔진은 없다.

개별 release·task dispose·advance·run/scope dispose의 정리가 끝나면 해당 자원/작업/실행은 부모 소유 목록에서 제거된다. 진행 중 정리는 부모가 계속 기다린다. 성공한 과거 객체를 부모에 누적하지 않으며, 실패는 오류 근거만 보존해 이후 부모 종료에서도 보고한다. 반복 dispose와 이미 반환한 lease의 결과는 유지한다. 등록은 실행 종료 뒤에도 유지되고 registration.dispose가 제거한다. [F1/F2 보완 근거](../docs/game-platform-rebuild/artifacts/step-7c-review-fixes.md)를 따른다.

종료 후 late resource의 own은 old owner에서 즉시 release를 시작하며 실패를 생산자가 await해 관측한다. dispose promise는 등록된 자원의 정리 결과이지 아직 알 수 없는 외부 acquisition 전체가 끝났다는 뜻이 아니다. producer의 후속 own도 반드시 await한다. cleanup failure는 반영권을 되살리지 않으며 자동 재시도하지 않는다.

Bindings의 기본 resolveModel은 null로 **모든 실제 조합을 미지원** 처리한다. 호스트가 resolver를 제공할 때 실제 승인 contract/revision/scope·구현/환경/oracle·검증 admission이 연결된 모델 handle만 반환해야 한다. handle의 contract와 isApplicable 함수 형식은 조립에 필요한 최소 형태일 뿐 구현 지원 증거가 아니다. fixture resolver를 production 지원으로 쓰지 않는다. initialize({metadata, model, scope})는 자신의 자원을 획득 즉시 own하고 부분 실패를 throw한다. 실패 시 획득 자원을 정리하며 원 오류와 cleanup 오류를 구분한다. initialize의 반환 value는 구성 결과이며 LIVE/fresh 상태·공식 결과가 아니다. 선택 모델의 reconciliation/adoption은 STEP7D 책임이다.

[계약 tests](../tests/game-platform-vnext-core.test.js)와 [trace/범위](../docs/game-platform-rebuild/artifacts/step-7c-core-trace.md), [검증/영향도](../docs/game-platform-rebuild/artifacts/step-7c-validation.md)를 함께 읽는다. 빈 model oracle 설정·vNext runtime/online 미지원·기존 online DB 요구·server 제외 미확인 차단·H1~4/안전11/A/C/P/hostless·미승인 재대결 예외 금지 및 후속 의무 유지. 실제 모델/게임 행동 NOT_RUN·운영 UNKNOWN.

### 실행 가능한 작은 Core 사용 예 — fixture이며 모델/게임 지원 아님

저장소 루트에서 다음 코드를 node --input-type=module의 stdin으로 실행한다. 이 예는 계약 테스트에서도 실제 실행한다.

<!-- STEP7C_CORE_EXAMPLE -->
```js
import { createExecutionScope } from './games/shared/vnext/core/executionScope.js';
let currentContext = Object.freeze({ fixtureView: 'first' });
const scope = createExecutionScope({ isApplicable: ({ context }) => context === currentContext });
const task = scope.capture(currentContext);
let shown;
const completion = await Promise.resolve({ kind: 'success', value: 7 });
task.commit(completion, (result) => { shown = result.value; });
currentContext = Object.freeze({ fixtureView: 'second' });
await scope.advance();
const acceptedOld = task.commit(completion, () => { shown = 'stale'; });
await scope.dispose();
console.log(JSON.stringify({ shown, acceptedOld }));
```
<!-- /STEP7C_CORE_EXAMPLE -->
