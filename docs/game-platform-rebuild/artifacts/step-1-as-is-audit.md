# STEP 1 — AS-IS Audit

- 실행 계획: `/game_platform_vnext_final_execution_plan.md` 개정 **1.3**
- 감사 source commit: `132ec1576e316d0238c9ca6e07d0d3ab91950ec8` — 승인된 vNext integration, STEP 1 분기점
- 작업 branch: `docs/game-platform-vnext-phase1-audit`
- 성격: 현재 사실·기존 규칙·문제·미결정의 고정. 새로운 아키텍처나 계약을 승인하는 문서가 아니다.
- 결과: STEP 1 산출물 검토 대상. **Critical 0 / Major 2 / Minor 1**, 이 외 5개 실행 위험을 별도로 기록한다.
- 진행/PR/승인 상태의 현재 기준: `../CURRENT.md`와 최신 checkpoint. 이 감사의 원문 기준 SHA는 후속 기록 commit에 따라 바꾸지 않는다.

## 1. 핵심 판정

현재 플랫폼은 저장소 공통 Governance와 네 게임 문서 흐름 위에, **room + 승인회원 + game-local Supabase RPC + versioned snapshot**을 소비하는 공통 JavaScript 모듈을 둔다. shared에는 Registry, Access Gate, Room/Lobby surface, action envelope, snapshot/reconnect, DOM Shell, game_room Invite가 있다. Presence, 실제 gameplay, rematch/reset, 결과 계산과 SFX는 개별 구현에 남아 있다. BGM과 초대 발급/공유 본체는 사이트 영역이다.

이 구조의 규칙·품질 의무는 보존해야 한다. 현재 구현에 room/host/turn/score/DOM/RPC가 있다는 사실은 미래 Core의 필수 개념을 확정하지 않는다. 기존 게임은 참고와 영향도 확인 대상으로 유지한다. vNext로의 이관은 이번 계획의 작업이 아니다.

[전수 계승표](step-1-clause-succession-table.md)는 26개 문서의 3,232개 원문 관리단위를 고정했다. 그중 규칙·필수 형식·템플릿 필드 2,104개를 추적하며, 공통/보드/선택 모델/사이트 계승 검토 1,198개와 기존 소비자 안에서 보존할 game-local 906개를 구분한다. 중복 포함 원문 단위이므로 서로 다른 독립 MUST 2,104개라는 뜻이 아니다.

## 2. 기준선과 재개 대조

| 항목 | 실제 확인 |
|---|---|
| 정식 기준 main | 최초 착수 시 `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09` 확인. 반복 동기화 수행 안 함 |
| 승인 integration / STEP 분기점 | `132ec1576e316d0238c9ca6e07d0d3ab91950ec8` |
| STEP 0 | #404 `df43b4a60518ace86f6c5db4344bea81b0d0d4f7`, 후속 #406 `394ae9aada9b99d9fb049fa0a3278f50133f3290`, #407 `132ec157…` 모두 integration MERGED |
| 최초 STEP 1 원격 기록 | `467e6b8351c1236d4a9eb6fed71de534594f1e27` — CURRENT와 CP-0006만 반영 |
| 중단 후 재개 확인 | 로컬/원격 HEAD 일치, 작업 트리 clean, 감사 산출물/PR 없음, 코드 테스트 NOT_RUN을 실제 대조 |
| 재개 확인 원격 기록 | `4f7c1697648a7993d85cdc89b0188b1cb7daaddf` — CP-0007 및 CURRENT. 착수 commit의 자손이며 동일 브랜치 유지 |
| 계획 | blob `e12ef038913eb6d605709b782f1b73f18e0d1253`, 개정 1.3 그대로 |
| 금지 경계 | integration/main 직접 작업·merge 없음. STEP 2 NOT_STARTED. Architecture Decision 없음 |

기록의 과거 검증 성공을 이번 작업에서 다시 실행한 성공으로 사용하지 않았다. STEP 0 CP-0001~0005와 STEP 1 착수/재개 CP는 당시 사실로 보존한다.

## 3. 현재 authoritative document chain

| 층 | 현재 책임 | 하위 연결/예외 |
|---|---|---|
| 루트 AGENTS | 저장소 branch/최소 변경/검증/승인 + 신규 게임 진입 | vNext 전용 integration 예외는 이번 재구축에만 적용 |
| development rules (CURRENT) | platform-native 최상위 실행 규칙, 기능 진행, shared/로컬 경계, Architecture Change, 기존 소비자 영향 | UI/Governance/DB topic-owner를 참조 |
| UI Rules (CURRENT) | 조사·권리·Visual Identity·baseline/override·수동 리뷰 | 초기 UI_DESIGN과 후속 UI_DECISIONS를 혼동하지 않음 |
| DB/Test Contract (CURRENT) | 기존 online DB 모델의 11개 safety scenario 및 별도의 권한 검토 | 공통 gameplay schema/RPC가 아니라 각 게임의 테스트 어댑터 |
| Governance (CURRENT) | 문서 권위/전파·Guard·PR 검증 범위 | 코드 Guard의 실제 탐색 한계와 함께 읽음 |
| games README + 네 TEMPLATE | 새 게임 요청/조사/4문서/작은 구현/검증/출시·기록 진입 | 예시값과 필수 기록 항목은 구분 |
| 게임별 GAME_SPEC | 기능·상태·도메인·권위의 현재 기준 | 기존 게임의 규칙을 새 플랫폼 공통 API로 승격 안 함 |
| 게임별 DEVELOPMENT | 기능 진행/브랜치/검증/다음 작업 handoff | F02: No Thanks! 현재 상태의 불일치 존재 |
| UI_DESIGN + UI_DECISIONS | baseline + 최신 non-superseded override | 두 게임 모두 adoption baseline. 개발 전 조사 사례로 소급 조작 금지 |
| strategy / invite-analysis (HISTORY) | 당시 배경과 결정 보존 | 이름/구현이 등장해도 현재 신규 게임 의무가 아님 |
| game-bgm.md (CURRENT site utility) | 사이트 공통 오디오의 현재 정책 | formal `games/shared/` 계약으로 승격한 문서가 아님 |
| Supabase README / site README / DB test README | 사이트 DB 운영·기존 게임 보호·disposable 검증 | 게임 namespace와 production/fixture 권한 구분 |

규칙 권위와 실제 구현 증거는 구분한다. 코드가 문서보다 상세하다고 자동으로 새 MUST를 만들지 않으며, 문서/코드가 다르면 finding 또는 암묵적 계약 후보로 기록한다.

### 실제 읽은 문서 범위

계승표 인벤토리의 26개는 본문 전체를 읽었다. `games/`의 Markdown 14개를 빠짐없이 포함했다. 루트 실행 계획, 기록 README, CURRENT, CP-0005/0006/0007, DECISIONS도 제어 기준으로 읽었다. CP-0001~0004의 계보와 병합 사실은 STEP 0 감사 정정과 실제 PR/commit으로 대조했다.

`README.md`의 일반 사이트 기능·메일·지도·Push와 Supabase의 해당 운영 세부는 플랫폼 의무가 아닌 문맥/범위 밖으로 분리했다. 연결된 `docs/site-foundation-audit.md`와 `AUDIT_REPORT.md`는 날짜·범위 진입 절에서 과거 사이트 감사임을 확인했다. Legacy 게임 전용 전체 기획/게임play 문서를 새 플랫폼 표준으로 전수 복제하지 않는다. 공식 외부 규칙서/라이선스의 현재 유효성을 재조사하지 않았고 기존 문서의 조사 근거 링크를 보존했다.

## 4. 공통 모듈 exports·실제 호출자

아래는 기준 SHA에서 확인한 실제 API다. 이 목록은 미래 Target이나 import 경로 변경안이 아니다. 모든 shared export는 `games/shared/index.js`에서 다시 노출된다(26개 이름).

| 모듈 | 실제 exports / 반환 surface | 실제 소비자·테스트 | STEP 1 분류와 한계 |
|---|---|---|---|
| registry.js | `GAME_REGISTRY`, `defineGame`, `getRegisteredGame`, `listRegisteredGames` | Guard, gameInvite, Can’t Stop invite, foundation/game별 registry tests | 재사용 가능. 현행 metadata shape와 href/4 capability 조건에 한정 |
| accessGate.js | `GAME_ACCESS_REASON`, `resolveApprovedMemberAccess`, `createGameAccessGate`; gate `initialize/current/subscribe` | 두 entry가 `js/auth.js`의 initializeAuth/getAuthState/subscribeAuth 주입, foundation tests | 재사용 가능. 승인회원 사이트 정책 연결. 서버 인가 대체 아님 |
| roomLobbyContract.js | `ROOM_LOBBY_METHODS`, `defineRoomLobbyAdapter`; 8 required methods | 두 `roomLobby.js`, contracts test | 선택 모델에 한정. create/join/active/snapshot/ready/leave/start/invalidation 의미가 실제 맞아야 함 |
| actionContract.js | `createClientActionId`, `createVersionedAction` | 두 controller가 ID factory 실제 사용. envelope factory 직접 runtime 호출은 전역 검색에서 확인 안 됨; contracts test만 직접 호출 | 선택 versioned-action 모델에 한정. 문서의 공통 envelope 의미와 함수 사용 의무를 혼동하지 않음 |
| snapshotCoordinator.js | `snapshotVersion`, `createSnapshotCoordinator`; `start/stop/dispose/refresh/current` | 두 lobby controller, contracts test | 선택 snapshot 모델에 한정. 내부 version 거부/coalescing. F01의 action/수명 경계는 별도 |
| reconnectRefresh.js | `createReconnectRefreshTriggers`; `start/stop` | 두 controller, contracts test | 선택 브라우저 snapshot 모델에 한정. online/pageshow/visible trigger, 이벤트 replay 엔진 아님 |
| gameShellState.js | `GAME_CONNECTION_STATE`, `resolveGameConnectionState`, `normalizeGamePlayers` | gameShell 내부, 두 entry/runtimeModel 일부, shell tests | 선택 DOM/roster 모델에 한정. identity 표시용 normalization을 서버 인증 규칙으로 쓰지 않음 |
| gameShell.js | `createGameConnectionBanner`, `createGamePlayerRoster`, `createGameShell` | 두 game entry, shell tests | 선택 DOM 모델에 한정. root/stage/sidebar/actions DOM 구성. `js/ui.js` 의존 |
| game-shell.css | JS export 없음, `game-platform-*` 선택자 | 두 HTML의 명시적 stylesheet 연결 | 선택 DOM 모델에 한정. 전역 게임 CSS/Canvas renderer 아님 |
| gameInvite.js | `GAME_ROOM_INVITE_TARGET`, `GAME_ROOM_INVITE_VERSION`, `createGameRoomInvite`, `parseGameRoomInvite`, `resolveGameRoomInvite`, `buildGameRoomInviteDestination` | `js/invites/inviteEntry.js`, cant-stop/invite.js; invite tests | 재사용 가능(현재 game_room/Registry/site 조건). 발급/공유/최종 참가를 별도 책임으로 연결 |
| tests/game-db-integration/platformContract.js | `PLATFORM_GAME_DB_SCENARIOS`, `definePlatformGameDbContract`, `registerPlatformGameDbContract` | cant-stop.test.js, no-thanks.test.js | 선택 DB 모델에 한정. 11개 시나리오 모두 구현 요구, game schema를 구현하지 않음 |
| js/invites/* + site_invite SQL | `createInviteClient`, handler 등록/resolve, entry, `createInviteShareDialog`; create/resolve/revoke RPC | Can’t Stop, The Game legacy invite, invite.html | 재사용 가능. 토큰·기한·공유·진입 본체는 사이트에 하나; game adapter는 필요한 연결 |
| js/game-audio/* | catalog lookup/list, volume read/write/clamp, `createBgmController`, `mountBgmPlayer`; controller start/notifyGameStarted/switchTrack/pauseByUser/playByUser/toggleByUser/setVolume/subscribe/getState/destroy | 두 game bgm.js; The Game/Liar imports | 재사용 가능(site utility). pause/볼륨/attribution 보존. 곡 선택/연출은 소비자 책임 |
| no-thanks/presence.js | `createNoThanksPresenceAdapter`; `subscribe`→cleanup | no-thanks controller, presence tests | 현행 소비자 전용. 다중 탭 user merge/UI 상태, 서버 권한·자동 turn/host 판정 아님 |
| 두 game controller/gameplay/RPC | active-room resume, rematch/reset, leave, authority, result | 각 game UI, 각 game DB test | 현행 소비자 전용. 동일 이름의 컨트롤러 존재만으로 공통 본체 중복이라 단정 안 함 |
| 독립 시간/tick·지속 입력·Canvas/WebGL·예측/rollback | 정식 공통 export/계약 없음 | 현 shared 및 문서 범위에서 미확인 | 새 계약 검토 필요(지원 요구가 생길 경우). 이번 STEP에서 API/모델/구현 약속하지 않음 |

### Registry와 사이트 연결

Registry는 legacy 3개(`liar`, `the-game`, `marble`)와 shared 2개(`cant-stop`, `no-thanks`)를 선언한다. Drawing Spy는 Liar 안의 모드이므로 보호하는 논리적 Legacy 게임은 4개다. vNext 관점에서 기존 shared 두 게임도 무이관 보호 대상이지만 현재 Registry의 `platform` 값을 legacy로 바꾸지 않는다.

- Can’t Stop: online=true, invite=true, local=false, presence=false.
- No Thanks!: online=true, presence=true, local=false, invite=false.
- `js/pages/games.js`의 `GAMES` 배열은 Registry를 import하지 않는다. 공개 카드는 별도 사이트 목록이다. Registry 값 변경이 자동으로 노출/비노출이나 인증 차단을 수행하지 않는다.
- `gameInvite`와 사이트 invite entry는 Registry로 게임을 확인하지만 최종 join 권한은 game RPC가 다시 검증한다.
- `createVersionedAction`이 있다는 이유로 실제 두 게임이 그 factory를 호출한다고 기록하지 않는다. 두 game-local adapter/controller가 같은 필드의 intent를 연결한다.

## 5. 주요 계약과 소비 경계

### 상태/권위/수명

현행 online 요구는 서버가 intent를 승인하고 DB transaction/room lock 및 membership/role/phase/version 검증 뒤 최종 state를 반환하는 구조다. Realtime은 invalidation, 복귀는 snapshot 재조회다. client presentation은 결과를 설명하고 서버 truth를 바꾸지 않는다. player별 private state는 snapshot의 viewer별 합성 및 table 권한과 연결된다.

두 Room/Lobby adapter는 private closure의 activeRoomId를 사용해 구독 대상을 정하고, 메서드마다 game RPC로 매핑한다. resume/getMyActiveRoom, rematch와 결과는 공통 엔진이 아니라 각 게임 구현이다. No Thanks!에는 trackingGeneration/room 확인이 있으나 Can’t Stop에는 같은 방어가 없다. 서로 다른 수준의 방어가 있다는 사실을 미래 표준으로 채택하지 않는다.

### 보드게임 세부와 UX

조사 → 네 문서 bootstrap → 작은 기능 구현 → 자동 검증 → 수동 디자인 리뷰 → production 검증/activation → release closeout → 회고의 흐름을 보존한다. 기능 checkpoint와 디자인 checkpoint 및 플랫폼 rebuild checkpoint는 서로 다른 기록 체계다.

보드/카드/주사위 공간, 겹친 카드의 판독성, 구성물 이동과 최종 상태의 인과관계, hover 없이 핵심 조작, 반응형·reduced motion 등의 상세 의무가 UI/템플릿/게임별 결정에 분산돼 있다. 이것을 단순한 “UI 품질” 요약 한 줄로 대체하면 안 된다. 반대로 특정 게임의 760ms animation, 11개 column, 24장 덱, 곡 제목은 그 게임의 범위로 남긴다.

### DB/보안/검증

공통 DB scenario의 기존 ID를 그대로 보존한다: `anonymous_entry_denied`, `unapproved_entry_denied`, `approved_entry_allowed`, `non_member_snapshot_denied`, `start_authorization_enforced`, `stale_version_rejected`, `duplicate_action_safe`, `concurrent_action_single_commit`, `reconnect_snapshot_authoritative`, `rematch_lifecycle_authoritative`, `private_state_not_exposed`.

private state가 없는 게임도 마지막 시나리오를 생략하지 않고 없음을 명시적으로 검증한다. Data API privilege와 RLS는 별도 검토다. 기본 PUBLIC EXECUTE나 default privilege에 의존하지 않으며, service_role 최소 권한/브라우저 비노출, 이미 적용한 migration 불변 및 forward migration을 보존한다. fixture용 권한은 production 검증의 대체물이 아니다. 이번 감사는 실제 production Supabase에 연결하지 않았다.

## 6. Findings

### F01 — Major — snapshot 수용의 버전/수명 경계가 경로별로 다름

- source: `games/shared/snapshotCoordinator.js:36–90,114–123`, `games/cant-stop/lobbyController.js:150–220,268–322`, `games/no-thanks/lobbyController.js:114–173,228–265`.
- 규칙: development §9의 stale snapshot 거부/최신 accepted snapshot, 화면 종료 시 cleanup (`LEGACY-DEV-262`, `LEGACY-DEV-264`, `LEGACY-DEV-272`).
- 실제 문제: shared coordinator의 version 상태는 자체 load 경로만 추적한다. Can’t Stop action 응답은 이를 통하지 않고 applySnapshot으로 들어가고, applySnapshot에 현재 version 비교가 없다. shared coordinator는 load await 이후 dispose 여부를 재확인하지 않고 onSnapshot을 호출한다.
- 작은 메모리 재현 1: Can’t Stop에서 ready 요청을 대기시키고 refresh v3을 수용한 뒤 ready v2를 반환하면 화면 state version이 **3 → 2**로 내려간다.
- 작은 메모리 재현 2: shared refresh 대기 중 dispose 후 load를 완료하면 onSnapshot이 **1회 호출**된다. controller/UI 전체 dispose가 이를 다시 막는 경로도 있으므로 곧바로 모든 화면에 같은 장애가 난다고 확대하지 않는다.
- 영향: “공통 snapshot 모듈을 사용했다”는 사실만으로 command 응답·room 전환·재대결·dispose 이후 응답까지 안전하다고 판단할 수 없다. No Thanks!의 generation/낮은 version 방어를 모든 게임의 사실로 일반화하면 안 된다.
- 후속: STEP 3에서 사례를 고정하고 STEP 4B/6에서 수용·수명 책임과 검사 조건을 검토한다. 현재 두 게임의 수정·migration은 별도 승인 범위다. 이번에는 코드/테스트를 추가·수정하지 않았다.

### F02 — Major — No Thanks! 현재 handoff와 활성화 사실이 다름

- source: `games/no-thanks/DEVELOPMENT.md:8–16,158–173,286–332`, `games/no-thanks/RELEASE_CHECKLIST.md:72–88`, `games/shared/registry.js:93–104`, `js/pages/games.js:82–88`.
- 실제 문제: DEVELOPMENT는 RELEASE_CANDIDATE, 모든 capability 비활성, activation을 다음 작업으로 적지만 Registry와 사이트 카드 및 체크리스트에는 2026-09-26 사용자 승인에 따른 online/presence 활성화가 남아 있다. randomized draw-order production 확인도 DEVELOPMENT pending과 checklist 확인 완료가 다르다.
- 규칙: development §3B의 현재 기능/검증/다음 작업 handoff와 RELEASED closeout (`LEGACY-DEV-093` 및 §3B release 절). 현재 규칙은 출시 후 Active branch main/dated Release를 요구하지만 Guard는 문서가 RELEASED라고 적힌 경우에만 검사한다.
- 영향: 기존 게임 개발을 재개하는 작업자가 activation을 반복하거나 이미 켜진 기능을 미구현으로 판단할 수 있다. 전체 수동 browser gate가 완료됐다고 반대로 가정할 수도 없다.
- 후속: 이 불일치를 기존 소비자 AS-IS에 고정하고 STEP 6/7의 impact audit에서 그대로 참조한다. 기존 게임 DEVELOPMENT 정정은 별도 승인 maintenance 범위로 제안하며 vNext 무이관 계획 안에 강제 편입하지 않는다. 실제 production 상태를 새로 검증/승인한 것이 아니다.

### F03 — Minor — 현재 DB test 진입 안내의 필수 개수 불일치

- source: `tests/game-db-integration/README.md:40` (`LEGACY-DBTEST-020`) vs `docs/game-platform-db-test-contract.md:13–29`, `tests/game-db-integration/platformContract.js`.
- 실제 문제: 현재 진입 안내는 필수 **10개**, CURRENT 계약과 runner는 **11개**이며 rematch scenario가 포함돼 있다.
- 영향: README만 읽어 checklist를 만들면 rematch 검증 누락 위험이 있다. runner가 누락 scenario를 거부하므로 현재 자동 검증이 10개만 허용한다는 뜻은 아니다.
- 후속: STEP 6에서 계승 연결 확인, STEP 7A2/7B의 실제 참조 정합화 때 해당 경로를 검토한다. 과거 game DEVELOPMENT의 “당시 10개” 이력은 수정 대상으로 혼동하지 않는다. Can't Stop GAME_SPEC의 current Validation Plan 10개 표현도 같은 불일치 묶음으로 남긴다.

## 7. 실행 위험과 미결정 — finding/설계 결정과 구분

| ID | 현재 근거와 위험 | 이후 책임 |
|---|---|---|
| R01 | development §6은 host/ready 비보편성과 fake method 금지, §10B는 모든 multiplayer rematch에 host/ready 요구. UI §9도 같은 흐름. 현재 Architecture Change 절차가 있으므로 두 규칙 중 하나를 임의 삭제하면 안 됨 | STEP 2/4B/5C/6 범위 정리, 7A2 원래 보드게임 의무 보존 |
| R02 | 정수 version만으로 다른 room/같은 room의 새 경기/새 viewer/인증 전환 응답 수명을 식별한다고 가정할 수 없음. F01은 현행 실제 차이 | STEP 3/4B/6. Core API/epoch 구조는 미결정 |
| R03 | Guard는 `games/shared` 외 games 직계 폴더를 게임으로 취급하고 신규 shared 모듈은 직계 JS만 탐지. 문서는 docs 최상위 game-platform*.md, games 최상위 md 중심. 새 중첩 경로는 탐지 보장 없음 | 이미 계획 §3/STEP 6·7B의 입력. 현재 경로를 새로 만들거나 Guard 수정 안 함 |
| R04 | 공통 규칙 요약만 옮기면 상세 MUST/SHOULD·조건·adoption·디자인 override·수동 gate가 누락될 수 있음. 중복 통합도 모든 source ID 보존 필요 | 7A1에서 기존 상세 경로 유효, 7A2에서 새 책임 절 매핑과 설명 없는 완화 0 확인 |
| R05 | BGM은 site utility, Presence/rematch/result는 실제 위치가 서로 다름. game-local connector를 엔진 중복으로 오판하거나 candidate를 사용 가능 API로 표시할 위험 | STEP 5A/5B/6/7B. 공통 본체 재사용과 게임별 연결 구분 |

미확인 U01: 새 책임 위치/분할·참조 방식. U02: 비DB·비room·연속 시간/공간/입력 모델의 계약과 지원성. U03: production/manual browser 검증의 현재 실행 증거. 모두 미결정/미검증으로 명시하며 코드 동작을 새 규칙으로 승격하지 않는다.

## 8. 암묵적 계약 후보 — 구현 사실이며 새 MUST 아님

| ID | 현재 관찰 | 소비·위험 | 결정 보류 위치 |
|---|---|---|---|
| IMPL-001 | coordinator는 기본 non-negative integer version, 낮은 값 거부, 같은 값 재수용; getVersion 주입 가능 | 두 controller/계약 test. equality 수용과 식별 범위는 별개 | 3/4B/6 |
| IMPL-002 | stop은 구독/listener 정리, dispose는 새 refresh 차단. 이미 대기한 load의 snapshot/error callback 차단은 보장 안 됨 | F01 재현. 취소 의미를 문서만으로 확대하지 않음 | 3/4B/6 |
| IMPL-003 | 두 Room adapter가 activeRoomId closure를 기억하고 subscribeInvalidation에서 사용 | adapter instance의 방 추적 소유·교체 시점은 호출자에 걸쳐 있음 | 4B/5A/6 |
| IMPL-004 | action RPC 응답과 coordinator snapshot이 controller에서 합쳐짐. Can’t Stop은 무조건 apply, No Thanks!는 낮은 version 거부 | 공통 모듈만 보면 보이지 않는 state acceptance 경로 | 3/4B/6 |
| IMPL-005 | No Thanks!는 roomId/trackingGeneration/disposed로 snapshot/Presence/reconnect callback을 거름 | 다른 소비자 공통 보장 아님. same-room rematch 의미·viewer 경계까지 자동 보장한다고 확대 안 함 | 3/4B/6 |
| IMPL-006 | action envelope는 snake_case/action ID 검증, payload 얕은 freeze; ID factory는 실제 사용되나 envelope factory 직접 runtime 소비 미확인 | exported API와 실제 채택을 구분. deep immutable 의미를 임의 부여 안 함 | 4B/5A/7B |
| IMPL-007 | invite helper는 64hex token, expiry 5~43200분/default360, roomId 최대256, reserved metadata 덮어씀, 같은 origin 목적지 검사 | Can’t Stop/site entry. 문서의 보안 목적과 구체 입력 shape를 분리 | 5A/6/7B |
| IMPL-008 | Registry는 4 capability strict boolean/default false, shared가 아니면 legacy로 normalize, 목록 복사 반환 | Guard/invite/tests. future model registration 지원으로 오해 금지 | 5B/6/7B |

이미 문서에 있는 version/서버 권위 의무는 해당 LEGACY 조항이 책임진다. IMPL 항목은 그보다 세부적인 구현 사실/빈틈에만 붙인 후보 ID이며 기존 의무 수에 중복 가산하지 않는다.

## 9. 읽은 코드·검증 영역과 범위

| 영역 | 읽기 범위 |
|---|---|
| shared | `games/shared/*.js` 전체(10파일, index 포함), game-shell.css 선택자/opt-in 연결 확인 |
| 게임 연결 | 두 `roomLobby.js`, `lobbyController.js`, `bgm.js` 전체; cant-stop/invite.js, no-thanks/presence.js 전체; 두 entry의 auth/import/bootstrap/Shell/controller 연결부. 대형 UI 파일 전체를 리뷰했다고 주장하지 않음 |
| 사이트 연결 | js/invites 4파일 전체; games page의 GAMES/render 흐름; auth 승인 상태/read API와 entry 소비; audio preferences와 controller track/pause/destroy, player/export/caller 확인 |
| Guard | scripts/check-game-platform-governance.mjs 전체; check-community-modules.mjs linker/게임 stub 경계, package scripts |
| 테스트 | platformContract.js, game-platform-contracts.test.js 전체; foundation/shell/invite/governance/db-contract의 관련 API·assertion/test 목록, 각 game DB contract 등록/11 scenario 구현 연결 |
| SQL | 두 namespace 파일 목록과 관련 함수 정의 탐색; No Thanks! foundation privilege/RLS, gameplay authorization/lock/idempotency/viewer snapshot, rematch/private helper/publication; Can’t Stop invite token join/후속 profile nickname 정의 연결; site invite infrastructure. 전체 migration/production 보안 감사가 아님 |
| CI | game-platform-governance.yml, game-db-integration.yml, site-static-checks.yml trigger/검증 job, 기타 workflow의 경로 trigger 대조 |

소스 파일·줄·blob은 [source inventory](step-1-source-inventory.md)에 고정한다. 게임의 rules/presentation 전체를 새로 검증하거나 정상 동작을 인증한 것이 아니다.

## 10. 기존 게임 영향과 공존 경계

| 대상 | 이번 변경/영향 | 향후 보호 조건 |
|---|---|---|
| Liar / Drawing Spy / The Game / Marble | 코드·DB·기존 문서 수정 없음 | existing Legacy 보호, 새 공통 계약 강제 연결 금지 |
| Can’t Stop | 코드·네 문서·Registry·SQL 그대로. F01 발견만 기록 | F01 개선은 별도 승인; vNext 구현을 이유로 import/UX/게임 규칙 이관 금지 |
| No Thanks! | 코드·네 문서·checklist·Registry·SQL 그대로. F02 기록 | 현재 handoff 불일치와 잔여 manual gate를 숨기지 않음; 별도 수정 범위 |
| 사이트 invite/BGM/auth/catalog | 코드 변경 없음 | 기존 소비자 유지. 새 기능 연결이 site 정책/Legacy에 영향을 주면 별도 impact 확인 |

현행 Architecture Change 규칙의 COMPLIANT/MIGRATION_REQUIRED/NOT_APPLICABLE 감사 의무는 보존한다. 이번 STEP은 CURRENT/shared 계약을 바꾸지 않으므로 기존 게임을 새 계약으로 이관할 MIGRATION_REQUIRED 대상으로 선언하지 않는다. STEP 7의 실제 변경 시 기존 계약 유지·격리로 영향 여부를 다시 판단한다.

## 11. 검증과 STEP 1 종료 게이트

검증 결과 및 재현 절차는 [validation](step-1-validation.md)에 기록한다. 원문 강도/ID/trace, games Markdown 전수 포함, 범위 밖 변경 없음, 계획/기존 CP/DECISIONS 불변, STEP 1만 상태 변경을 확인한다. 실제 production DB·브라우저 E2E·전체 game suite는 수행하지 않는다. 문서 전용 단계이며 어떤 게임 코드나 계약도 바꾸지 않았기 때문이다.

STEP 1은 사용자에게 이 감사의 **범위·분류·누락 여부·finding 근거**를 검토받는 시점에서 멈춘다. Major finding을 핑계로 코드 수정을 끼워 넣거나 STEP 2 설계를 시작하지 않는다. PR은 integration 대상이며 승인/merge/다음 STEP 지시는 별도다. STEP 6/7이 책임질 새 문서 위치와 새 계약은 이 단계의 완료로 확정되지 않는다.
