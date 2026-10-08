# Game Platform vNext STEP5A 판단 근거 자료

작성일: 2026-10-08 (Asia/Seoul)  
담당: Sol / 소스 추적·기계적 대조 보조: Codex  
판단 인계 대상: Astra  
저장소: `limbit95/limbit95.github.io`  
기준 브랜치: `feature/game-platform-vnext-integration`  
고정 기준 commit: `aabb7646c0cdfd6466f2195579dce54689c7b81c`

## 1. 목적과 문서의 지위

기존 공통 기능이 실제로 무엇을 제공하고 어느 consumer에 어떻게 연결되는지, 승인된 vNext 계약과 비교할 지점이 무엇인지 정리한다. Astra가 공통 본체·Adapter·local 경계와 새 구현 필요성을 판단하는 데 사용하는 준비 자료다.

이 문서는 앞선 읽기 조사 결과를 문서화한 인계 자료이며, 정식 STEP5A 선택표나 완료 보고서가 아니다. `그대로 연결 / 얇은 Adapter / vNext 새 구현 / 당분간 local / 보류`의 최종 분류는 하지 않는다. 문서화하면서 원격·소스를 새로 조사하거나 실제 시험을 실행하지 않았다. 아래 상태와 blob은 앞선 조사 시점의 확인 결과다.

표기 기준:

- **관찰 사실**: 고정 commit의 소스·호출부 또는 Git/PR에서 확인한 내용.
- **승인 요구**: STEP1~4B 및 유효 DECISIONS에서 재사용하는 계약·정책.
- **추론**: 관찰과 승인 요구를 비교하여 제기하는 쟁점. 최종 구조 선택이 아니다.
- **미확인**: 이번 읽기로 입증하지 않았거나 실행 검증이 필요한 내용.

## 2. 상태 복원과 기준 증거

읽기 순서는 `AGENTS.md` → `game_platform_vnext_final_execution_plan.md` → `docs/game-platform-rebuild/README.md` → `CURRENT.md` → `checkpoints/CP-0078-step-4b-integration-merged.md` → PR #412·#413이었다.

| 항목 | 확인 결과 |
|---|---|
| 실행 계획 | 개정 1.5; blob `da353e2e64daef6b1b0b7267c21997bfd7cda4ed` |
| integration 원격 HEAD | 기준 SHA와 동일: `aabb7646c0cdfd6466f2195579dce54689c7b81c` |
| 추가 변경 | 앞선 조사 시작·종료 시점에 기준 HEAD 이후 변경 없음 |
| PR #412 | 실제 merged; merge commit `32429a20f76a7fde6733db384fa067fbcd7307d1` |
| PR #413 | 실제 merged; merge commit은 기준 integration HEAD |
| STEP4B | COMPLETED / 설계 결과 사용자 승인 / integration 반영 완료 |
| STEP5A | 기록 상태 NOT_STARTED 유지; 이번 자료는 제한된 판단 근거 준비 |
| 행동 시험 | NOT_RUN; 구현·실행 검증·오픈 의무 유지 |
| main | `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09`; vNext main 반영 미수행 |

PR #412 승인 head는 `3e105be42f4dbcdf0875486bd8f0e5d38bcd1d1a`, PR #413 head는 `d19f268ee56fad6ff1fd9d79ab3f27148f0224cd`였다. integration merge의 부모는 PR #412 merge와 PR #413 head이며, 현재 tree는 `a8640c851ddb59cec0eeadae937e96949d5f8de2`였다.

README의 CP0077 언급, CP0078 작성 당시 PR413 ‘병합 대기’ 등은 당시 이력으로 해석한다. 현재 상태는 실제 PR/Git 병합 증거와 함께 판독한다. 이 문서 작성에서 기록 파일을 수정하지 않았다.

관련 PR: [#412](https://github.com/limbit95/limbit95.github.io/pull/412), [#413](https://github.com/limbit95/limbit95.github.io/pull/413).

## 3. 재사용 입력과 승인 요구

다음 파일은 모두 `docs/game-platform-rebuild/` 기준 상대 경로다. 완료된 공급자 조사·운영 정책 선택을 반복하지 않는다.

| 입력 | 재사용할 내용 |
|---|---|
| `artifacts/step-1-as-is-audit.md` §4~5, `step-1-source-inventory.md` | 기존 기능 의미, consumer·테스트 위치, 코드와 정책의 분리, 기존 근거의 범위 |
| `artifacts/step-1-clause-succession-table.md` 및 `step-1-clauses-platform.md`, `step-1-clauses-site-history.md`, `step-1-clauses-design.md` | 계승·대체 관계와 게임·사이트·플랫폼 책임의 출처 |
| `artifacts/step-2-implementation-selection.md` | 승인된 구현 선택의 전제·범위; 현존 코드만으로 충족 판정하지 않는 기준 |
| `artifacts/step-3-stress-matrix.md`, `step-3-transition-scenarios.md`, `step-3-risks-and-followup.md` | 전환·재진입·역할 변경·실패·복구 비교 지점과 후속 검증 의무 |
| `artifacts/step-4a-responsibility-boundaries.md` | Core / runtime·model / capability / game-local / Site Adapter 책임 경계 |
| `artifacts/step-4a-lifetime-contract.md`, `step-4a-contract-source-trace.md` | 완료 채택·소유권·정리 계약과 기존 소스별 공백 |
| `artifacts/step-4b-runtime-sync-contract.md`, `step-4b-security-site-contract.md` | 초기·실시간 동기화, 조용한 유실 복구, 최신성, 서버 권한 집행 및 사이트 정책 |
| `artifacts/step-4b-design-finalization.md`, `step-4b-z1-decision-and-design-closeout.md` | 승인된 설계 닫힘과 CP0075/D0010 현재 적용 |
| `artifacts/step-4b-verification-specification.md`, `step-4b-risks-and-followup.md` | 실제 시험 oracle, UNKNOWN, 구현·실행·오픈 blocker |
| `DECISIONS.md` | 유효 결정과 부분 대체 관계; 과거 HOLD·검토 대기를 현재 상태로 오독하지 않음 |

### 3.1 STEP4A 비교 기준

Core는 최소 identity·discovery·실행 수명·설정·오류·cleanup 책임을 갖는다. 모든 모델에 Room·host·ready·DOM·snapshot·RPC를 강제하지 않는다. runtime/model은 session·match·view·순서·최신성을 소유하고, capability는 의미 있는 공통 기능을, game-local은 게임 도메인과 UI를, Site Adapter는 Auth·profile·routing·Invite·BGM 연결을 맡는다. 서버 권한 집행은 클라이언트 Gate·Registry로 대체하지 않는다.

비동기 결과 채택에는 다음 다섯 조건이 적용된다: 수신 owner 생존, 현재 적용 context, 정보·행위 권한, 모델 순서, await·재진입 후 실제 적용 시점까지 조건 유지. 성공 snapshot뿐 아니라 error·null·finally·leave/cleanup·effect와 후속 비동기 작업에도 적용한다.

dispose는 먼저 채택 권리를 무효화하고 정리를 수행해야 한다. 늦게 획득한 자원은 과거 owner가 정리하며, 반복 cleanup은 안전해야 하고 오래된 cleanup이 새 등록을 제거하면 안 된다. 공유 사이트 자원은 실제 공통 owner가 소유한다. 특정 lease/refcount API를 이 자료에서 선택하지 않는다.

T01 같은 room의 새 match, T02 A→B→A, T03 role/view/user 변경은 room ID 동일성이나 숫자 version만으로 전부 판별되지 않는다.

### 3.2 STEP4B 현재 적용

J03 초기/live handoff와 마지막 이벤트의 조용한 유실에는 reconciliation이 필요하다. 연결 성공 자체는 최신 LIVE 증거가 아니다. 정상 상황의 권한 있는 최신 복구는 각 5초 이내 요구와 비교하고, 실패 상태는 구분한다.

- **D0006**: 설계 완료와 실제 실행·오픈 완료를 분리한다.
- **D0007**: 범위 내 권한 철회 R 이후 보호된 새 승인·정보 전송 P에 최대 5초 경계가 적용된다. P는 제어 가능한 최종 비가역 전송 지점이며 앱 queue 삽입이 아니다.
- **D0008**: 입증된 검사 후 runtime/DB/host 장기 정지 한계만 인정한다. 일반 지연의 포괄 면책이 아니며 재개 후 fresh check, 알려진 만료·실패 시 새 허용 금지, 최초 fault의 60초 기준을 유지한다.
- **D0009 / CP0074**: 승인된 구체적 vNext 설계 범위를 유지한다. 기존 Auth·게임 대체, 구매·배포 수행으로 확대하지 않는다.
- **D0010 / CP0075**: 이전의 late actual commit C deadline/HOLD를 부분 대체한다. fresh 최종 승인·시작 A는 필요한 lock 획득 뒤 동일 finalizer transaction 내부에서 이루어져야 하며 ingress·BEGIN·enqueue는 A가 아니다. 이미 적법하게 시작한 동일 transaction의 C는 일반 storage 지연으로 늦어질 수 있으나 C는 실제 commit이다. 재시도·새 transaction·새 command는 fresh A가 필요하다. 새 P·ACK·snapshot 권한, terminal 유지, 알려진 만료 전 A 금지, C/rollback까지 owner anchor, 최초 t0+60 abort 및 retry로 시간 재설정 금지는 유지한다.

검증 명세의 과거 T01~03 문구는 CP0074 보정과 CP0075 §3의 현재 oracle을 함께 적용한다. 과거 strict C 문구나 HOLD만 떼어 현재 요구로 사용하지 않는다.

## 4. 8개 대상별 판단 근거표

### 4.1 관찰 사실: 기능·연결·현재 수명 책임

| 대상 | 실제 기능 의미·API 전제 | 공통 본체 → 연결 → 실제 consumer | 결합 조건·현재 수명과 완료 채택 사실 |
|---|---|---|---|
| Registry | 정적 게임 metadata: 표시 정보, 상대 href, platform 및 capability flag. `listRegisteredGames`, `getRegisteredGame` | `games/shared/registry.js` → shared Invite 및 Cant Stop Invite, Governance Guard·테스트. `js/pages/games.js`는 별도 GAMES 목록 | 5개 entry 중 liar/the-game/marble은 legacy, cant-stop/no-thanks는 shared. immutable 목록이며 실행·등록 수명·서버 권한 집행은 제공하지 않음. 사이트 게시 목록이 자동 통합되는 구조는 아님 |
| Access | 로그인·user.id·승인 상태를 읽어 allowed/reason/userId 제공. Auth initialize/getState/subscribe 주입 | `games/shared/accessGate.js` → `js/auth.js` 상태 → Cant Stop app / No Thanks main | subscribe는 현재 상태를 즉시 전달하고 upstream unsubscribe 반환. 자체 dispose, 요청별 fresh 권한, role/view/session 판별 없음. Auth의 TOKEN_REFRESHED 경로는 user/session 갱신·emit이며 profile 재조회와 동일하지 않음 |
| Room | 8개 함수 surface의 존재 확인 및 binding: createRoom/joinRoom/getMyActiveRoom/getLobbySnapshot/setReady/leaveRoom/startGame/subscribeInvalidation | `roomLobbyContract.js` → 두 게임 `roomLobby.js` → 각 `lobbyController.js` → app/main | Supabase RPC·public table invalidation, room ID·version·action ID에 결합. adapter는 await 후 activeRoomId를 기억하고 channel cleanup은 비동기 remove 호출. contract 자체는 순서·권한·수명 보장 없음. Cant Stop nickname·기본 4인과 No Thanks 3~7인·nickname 미전달은 서로 다른 게임 전제 |
| Snapshot | loader·invalidation·snapshot version을 연결하는 refresh coordinator. lower version 거부, equal version 허용; in-flight coalescing | `snapshotCoordinator.js` → 양쪽 controller의 trackRoom → adapter getLobbySnapshot → view/presentation | start는 invalidation 등록 후 초기 refresh이며 SUBSCRIBED readiness 보장이 아님. dispose는 stop 뒤 disposed 설정; 이미 진행 중 load의 await 후 disposed/context 재검사 없음. Cant Stop의 채택 guard와 No Thanks의 trackingGeneration guard가 다름 |
| Reconnect | online/pageshow/visible 이벤트에서 refresh를 요청하는 listener utility | `reconnectRefresh.js` → controller refresh → coordinator/RPC | start/stop listener 등록·해제는 반복 안전. session 복원·실시간 준비·누락 복구·timeout·권한 확인은 자체 제공하지 않음. stop은 진행 중 refresh 완료를 취소·무효화하지 않음 |
| Invite | registered shared+online+invite 게임의 `game_room` v1 envelope 생성·해석·resolve·same-origin 목적지 생성; token 64 hex, room ID·expiry 제한 | `gameInvite.js` → `js/invites/inviteApi.js`·registry·entry·share → Cant Stop invite/app; legacy The Game은 별도 연결 | site_invite_create/resolve/revoke RPC에 결합. 공통 body와 게임별 join 연결은 다른 역할. registry 해제는 target key 삭제여서 old disposer/new registration 관계가 쟁점. QR await·dialog destroy·entry dispatch는 자체 owner generation 보장이 없음 |
| Game Shell | DOM header/status/stage/sidebar/actions와 roster·connection 표시; pure 표시 상태 정규화 | `gameShell.js` + `gameShellState.js` + CSS → 두 게임 runtime·app/main | `js/ui.el`, DOM/CSS·게임 supplied node에 결합. root 반환이며 runtime 수명·서버 권한·Room engine은 없음. ready/host/seat 표시가 모든 모델의 필수 의미인지는 별도 판단. 게임별 보드·결과 연출은 공통 본체와 분리 |
| 사이트 BGM | Audio controller·player UI·volume 저장·catalog·autoplay fallback·track switch | `js/game-audio/*` → Cant Stop/No Thanks `bgm.js`, The Game/Liar `js/bgm.js` → 각 page lifecycle | 현행 `docs/game-bgm.md`는 site utility이며 정식 shared promotion 완료가 아님. controller는 per-instance Audio 소유, player는 DOM/subscription 소유, game wrapper는 mode·곡 선택 소유. play await 후 destroy 재검사 없음; switch는 in-flight 동안 false 반환. 게임 session queue·pagehide 정책이 서로 다름 |

### 4.2 승인 요구·추론·테스트와 미확인

아래 테스트 범위는 테스트 소스 읽기로 확인한 내용이다. 이번에 실행하지 않았으며 vNext 행동 검증 통과를 뜻하지 않는다.

| 대상 | 승인 요구와 비교할 지점 | 추론: Astra 판단 쟁점 | 기존 테스트 위치·읽기로 확인한 범위 / 미확인 |
|---|---|---|---|
| Registry | 최소 discovery와 모델별 capability; 클라이언트 metadata와 권한 집행 분리 | metadata 재사용 범위와 사이트 목록 연결 책임을 나누어야 할 가능성 | foundation tests: 5개 entry·조회·flag. 사이트 목록 자동 일치·vNext 새 모델·서버 권한은 미확인 |
| Access | 기존 Auth 보존; 실행 owner/user/role/view 전환; D0007~10 서버 집행 | Gate의 진입 UX와 runtime 채택·backend 권한 책임 경계 | foundation tests: mocked Auth 상태·unsubscribe. 철회 경계·profile freshness·진행 중 완료·실제 backend enforcement 미확인 |
| Room | 모델 자연 surface; 액션 ordering·권한·owner; room 없는 모델 허용 | 기존 surface의 공통 의미와 게임별 RPC 정책을 구분해야 함 | room adapter tests: mapping·tracking·subscription·leave·version, No Thanks nickname 부재·SQL 정적 assertions. 배포된 GRANT/RLS·실제 transaction·A/C/P 실행 미확인 |
| Snapshot | STEP4A 다섯 채택 조건·T01~03; STEP4B initial/live handoff·quiet loss·fresh recovery | version/coalescing utility와 context·권한·모델 freshness 책임을 분리할 수 있는지 | contracts tests: coalescing·lower version·unsubscribe. No Thanks controller tests: 늦은 낮은 version과 rematch 40→41 거부. equal version 의미 변경·dispose 중 완료·role/view·quiet loss·5초 복구 미확인 |
| Reconnect | 연결과 LIVE 분리; 재동기화·실패·권한·수명 | browser trigger와 실제 restore/reconcile 엔진의 책임 경계 | contracts/controller tests: 이벤트 refresh·stop·일부 game effects. 연결 수립 순서·마지막 이벤트 유실·timeout·늦은 완료 전체 미확인 |
| Invite | Site Adapter와 game join 분리; 권한 있는 resolve/join; owner가 새 등록을 보호 | 공통 envelope/route/share와 게임별 join 연결의 경계; wrapper 존재만으로 중복 아님 | shared Invite tests: envelope·capability·version·same-origin. Cant Stop tests: resolve→join token·room mismatch. site-invite e2e 소스: 로그인 return·QR·The Game 연결. 실제 권한·만료·철회·QR late completion·등록 교체 미확인 |
| Game Shell | Room·host·ready를 Core에 보편 강제하지 않음; view owner·정리 | 표시 컴포넌트 재사용과 모델별 의미·mount lifecycle 분리 | shell pure-state tests: player 정규화·표시 상태. game runtime/shell tests: static wiring·view derivation. 실제 mount·mobile DOM·owner 전환·roomless 모델 미확인 |
| 사이트 BGM | 공유 자원의 실제 owner; late completion; pause·volume·오류 격리·기존 게임 보존 | controller/player 수명과 game-local 곡·mode·결과 연출을 구분 | The Game/Cant Stop/No Thanks tests: fake Audio·volume·autoplay·pause·track/session·static wiring. 실제 browser autoplay/BFCache·destroy 중 play 완료·공유 owner 간 경쟁 미확인 |

### 4.3 consumer 차이를 일반화하지 않을 사항

- No Thanks controller에는 trackingGeneration과 현재 room 검사, coordinator callback·presence·reconnect guard 및 start 이후 재검사가 있다. 일반 command의 catch/null/finally와 모든 직접 apply 경로까지 동일한 보장으로 확대해서는 안 된다.
- Cant Stop controller는 emit에서 disposed를 검사하지만 snapshot 채택·trackRoom await·reconnect·command 완료에 같은 수준의 context guard가 있다고 볼 수 없다.
- Cant Stop `openRoomInvite`는 invite 생성 await 뒤 기존 dialog 교체·새 dialog open이 이루어진다. game-local 연결 파일을 공통 Invite engine의 중복이라고 단정하지 않는다.
- No Thanks BGM의 LOBBY/PLAYING catalog mapping은 관찰된 게임별 선택이다. 이번 범위에서 버그로 판단하거나 변경하지 않는다.
- Registry·Access·Game Shell의 표시 상태는 서버 보호 권한의 증거가 아니다.

## 5. Source trace: 재사용과 새 확인

### 5.1 기계적 대조

STEP1 기준 commit은 `132ec1576e316d0238c9ca6e07d0d3ab91950ec8`이다. inventory의 코드·테스트·workflow·SQL 57개 고유 경로는 현재 blob과 모두 동일했다. inventory 89개 행을 대조했을 때 문서 변경은 root 실행 계획과 rebuild README/CURRENT/DECISIONS에 있었다. baseline/current tree의 `.js/.mjs/.css/.html/.sql` 681개 경로도 모두 동일했다.

이는 tree/blob 동일성의 기계적 대조다. 681개 파일을 모두 새로 내용 감사했다는 뜻이 아니며, 기존 근거가 없는 항목의 기능·보안 충족까지 증명하지 않는다. SQL 배포 상태는 확인하지 않았다.

표의 표기: **R** 기존 승인 근거 재사용, **R+N** 기존 inventory 근거 재사용 + 현재 관련 본문·호출부 선택 읽기, **N** consumer 공백을 위해 추가로 읽은 연결. 모든 경로의 commit은 문서 맨 위의 고정 SHA다. 12자리 blob 표기는 SHA prefix다.

### 5.2 공통 본체·사이트 기능

| 구분 | source 경로 | blob | 줄 또는 심볼 |
|---|---|---|---|
| R+N | `games/shared/registry.js` | `afa4ba25824157534eca7ca7538b89571cfca30e` | defineGame L27; list L107; lookup L111 |
| R+N | `games/shared/accessGate.js` | `4803cd8fd141c98d97bd6357243a9f955843d6cc` | resolveApprovedMemberAccess L6; createGameAccessGate L37 |
| R+N | `games/shared/roomLobbyContract.js` | `4d037bd1b56715aae631220d1c848bc521a56ce0` | required 8 methods; createRoomLobbyAdapter |
| R+N | `games/shared/snapshotCoordinator.js` | `069f49aa23cfb2c5d591cafaed523fa358c78ba1` | version L8; runRefresh L36; refresh L72; start L94; stop L111; dispose L117 |
| R+N | `games/shared/reconnectRefresh.js` | `f96be29314ae0079c0f5db9ba9c9e8cbfb7934e4` | create L12; requestRefresh L29; start L41; stop L49 |
| R+N | `games/shared/gameInvite.js` | `4d4b667e85162b19fb4e1607bfcc094a1bd4556d` | create L57; parse L93; resolve L127; destination L144 |
| R+N | `games/shared/gameShell.js` | `298ab13998662aafa0efea35d32824f85e84e18e` | connection banner L16; roster L45; create shell L126 |
| R+N | `games/shared/gameShellState.js` | `1f068aa14348b166b13c34e50daf2c5698db2914` | connection states; player normalization |
| R+N | `js/game-audio/bgmController.js` | `4757a1de3477dbebe44f2dd49b7071eb8b03d9c2` | tryPlay L141; switchTrack L220; subscribe L264; destroy L271 |
| R+N | `js/game-audio/bgmPlayer.js` | `c7c8f07187c7450bff4ff7256b37227a3ee0e86c` | mount L27; subscription; destroy |
| R+N | `js/game-audio/bgmPreferences.js` | `902e2893c4ac` | volume storage key; clamp |
| R+N | `js/game-audio/bgmCatalog.js` | `93ee1e699349` | game track metadata |
| R+N | `js/invites/inviteApi.js` | `e1747b294e25` | create client; create/resolve/revoke RPC |
| R+N | `js/invites/inviteRegistry.js` | `0c2c84736562` | register L3; dispatch L9; has L15 |
| R+N | `js/invites/inviteEntry.js` | `f5438286f61c` | Auth return; game_room/the_game_room registration; resolve/dispatch |
| R+N | `js/invites/inviteShare.js` | `f1d370c83cbc` | buildUrl L4; QR L32; copy L42; share L46; dialog L52 |
| R+N | `js/auth.js` | `09eb6d21b2d2` | L138~162, L241~308; cached profile·subscribe·TOKEN_REFRESHED |
| R+N | `js/pages/games.js` | `81614a6496b7` | separate GAMES L53; render L91 |
| R+N | `games/shared/actionContract.js` | `93ff86e5a830` | action ID/envelope;기존 inventory의 사용 범위 재사용 |
| R+N | `games/shared/index.js` | `96041e478da5` | public re-exports |
| R+N | `games/shared/game-shell.css` | `daad52e6658b` | shared shell styles |
| R+N | `docs/game-bgm.md` | `e3767e0b366a` | site utility 정책; pause/volume·오류 격리·SFX 분리 |

### 5.3 consumer·연결·정리 추적

| 구분 | source 경로 | blob prefix | 줄 또는 심볼·확인 범위 |
|---|---|---|---|
| R+N | `games/cant-stop/roomLobby.js` | `881d0c342112` | activeRoomId; RPC; invalidation channel; leave |
| R+N | `games/no-thanks/roomLobby.js` | `b689e6c06288` | 동일 surface·maxPlayers; nickname 미전달; public invalidation |
| R+N | `games/cant-stop/lobbyController.js` | `9fdecdea73fa` | applySnapshot; trackRoom; stopTracking; commands; dispose |
| R+N | `games/no-thanks/lobbyController.js` | `942a628ff1a6` | trackingGeneration; isCurrentTracking; applySnapshot; command recovery/finally |
| R+N | `games/cant-stop/app.js` | `29eba21d4637` | invite L1746~1764; shell L1935; dispose L1992; entry L2003; access L2039; cleanup L2073; boot L2090 |
| R+N | `games/no-thanks/main.js` | `9e09b49d2365` | shell L3956; approved L4002; access L4058; boot L4094; pagehide/pageshow L4140~4148 |
| R+N | `games/cant-stop/invite.js` | `855a13f2753c` | create game_room; resolve expected game; join token; returned room check |
| N | `the-game/js/inviteIntegration.js` | `61a1d5e73c75` | legacy the_game_room; profile/name→form submit; roomcode cache; MutationObserver |
| R+N | `games/cant-stop/bgm.js` | `5f7ce828d6be` | session start; mode Promise queue; destroy controller/player |
| R+N | `games/no-thanks/bgm.js` | `1f7c850ffbb8` | session·mode mapping·queue·destroy |
| N | `the-game/js/bgm.js` | `658dad4a481e` | document events; game interaction fallback; pagehide cleanup |
| N | `liar-game/js/bgm.js` | `3c93e555b1d0` | controller/player creation; page cleanup |
| R+N | `games/cant-stop/runtime.js` | `24f680e617f2` | game snapshot → shell display state |
| R+N | `games/no-thanks/runtime.js` | `b568a1c06ed0` | game snapshot → shell display state |
| R+N | `games/cant-stop/index.html` | `ff5c9370540b` | shared shell/BGM CSS wiring |
| R+N | `games/no-thanks/index.html` | `f8cc1bab14ea` | shared shell/BGM CSS wiring |

대규모 app/main은 호출부·owner·전환·cleanup 주변을 선택해서 읽었다. 전체 줄을 재감사한 결과가 아니다.

### 5.4 테스트 증거 식별

아래는 기존 inventory와 테스트 본문에서 재사용한 식별 정보다. 테스트 실행 결과가 아니다. 정확한 테스트 경로는 `step-1-source-inventory.md`의 해당 blob 행을 통해 확인할 수 있다.

| 테스트 계열 | blob prefix | 읽기로 확인한 검증 범위 |
|---|---|---|
| shared foundation | `eed28ef5e853` | Registry, mocked Access, unsubscribe |
| shared contracts | `182dd2719bcf` | surface binding, action envelope, coalescing, 낮은 version, reconnect signal |
| shared Invite | `106bc5e0f92f` | envelope, registered capability, expected game, same-origin route |
| shared shell | `64e6251a273f` | pure 표시 상태·player 정규화 |
| Cant Stop Invite | `a5d45e048897` | resolve→token join, wrong-room rejection |
| Cant Stop room adapter | `3fbc8df4ea5e` | mapping, tracking, subscription, leave, invalid version |
| No Thanks room adapter | `6a81337d01ef` | mapping, nickname absence, public table, SQL 정적 확인 |
| Cant Stop controller | `6f24996d26ff` | room/actions/invalidation/rematch/reconnect·game effects |
| No Thanks controller | `025c9110b53b` | command 뒤 낮은 version L340, rematch 40→41 L660 포함 |
| The Game BGM | `e0a781de94d6` | fake Audio, volume, autoplay, pause, mode, interaction |
| No Thanks BGM | `c5400f0aa8c5` | mapping, session, static wiring |
| Cant Stop audio | `47cb580e9dc6` | helper unavailable, track/session, switch, page wiring |
| site-invite e2e | `3b91a71067d7` | login return, same-origin, QR, legacy The Game link |
| No Thanks shell | `ef16781d81ca` | 정적 local UI/API 연결, reconnect가 host를 변경하지 않는 경로 |
| Cant Stop runtime | `f3495259fe69` | view state, entry/CSS/UI 정적 연결 |
| No Thanks runtime | `878e7028bce5` | snapshot-derived view, private viewer, presence가 권한이 아닌 관계 |

## 6. Astra에게 넘길 핵심 질문과 미확인 항목

| 대상 | 핵심 질문 | 결론에 필요한 미확인·조건 |
|---|---|---|
| Registry | 기존 metadata를 discovery에 어디까지 쓰고 사이트 공개 목록·model capability 연결을 누가 맡는가? | vNext 대상 model의 필요 metadata, 별도 사이트 목록의 책임. 새 API를 이 단계에서 동결하지 않음 |
| Access | 기존 Auth Gate와 runtime owner/context·backend authorization의 경계는 어디인가? | user/role/view 변경 시 모든 완료 경로, profile freshness, 서버 최종 권한 확인의 구현·실행 증거 |
| Room | 8개 메서드의 의미는 대상 model에 자연스러운가? 게임별 RPC·정책을 Adapter/local 어디에 두는가? | roomless·비 host/ready 모델의 조건, 기존 게임 보존, A/C/P·owner lifetime의 구체적 적합성 |
| Snapshot | version/coalescing 공통 utility와 model/context/authorization/freshness 책임을 나눌 수 있는가? | equal version의 view/role 변경, T01~03, 초기/live handoff, quiet loss, 성공·error·null·finally 전체 경로 |
| Reconnect | browser signal trigger와 session restore/reconciliation의 책임을 어떻게 나누는가? | subscribe readiness, 마지막 이벤트 유실, timeout/failure 의미, 5초 복구, stop 뒤 완료 |
| Invite | 기존 envelope/route/share 본체를 보존하면서 새 모델의 invite 의미와 game join을 어디에 두는가? | target 등록 owner, QR/dialog 완료, expiry/revoke/server 권한. legacy 연결은 본체 중복으로 단정하지 않음 |
| Game Shell | 표시 부품의 공통성과 room/host/ready 의미·mount lifetime을 나눌 수 있는가? | roomless view, 실제 DOM/mobile, root를 만든 owner의 cleanup. 게임 UI·결과 연출은 별도 책임 |
| 사이트 BGM | site utility의 실제 owner와 game wrapper의 mode/곡 선택·비동기 채택을 어떻게 나누는가? | pending play/switch와 destroy, BFCache, 동시 owner, autoplay 실행. lease/refcount 방식은 미선택 |

## 7. 후속 판단과 작업 경계

공통 본체를 우선하는 읽기는 Invite (`games/shared/gameInvite.js` → `js/invites/`)에서 시작했고, 기존 inventory의 consumer 및 근거 공백에 필요한 부분으로 추적했다. game-local 연결 파일의 존재만으로 공통 본체 중복이라고 판단하지 않는다. BGM의 곡·mode, Shell의 게임 UI·결과 연출과 공통 수명 책임의 평가를 구분한다.

Astra의 다음 판단은 다섯 가지 최종 분류와 책임 경계다. 각 행의 관찰 사실·승인 요구·추론·미확인을 구분해야 한다. 현재 코드가 있다는 이유만으로 vNext 지원 완료를 선언하지 않고, 미구현이라는 이유만으로 기존 기능 전부를 새 구현으로 분류하지 않는다.

후속 정식 STEP5A 산출물은 공통 모듈 선택표, 중복 방지 기준, 호환·수명·검증 책임자다. 이 자료는 판단 입력이며 정식 산출물의 완성·승인을 선언하지 않는다.

STEP5A 설계·문서 확인과 후속 구현·실행 검증·오픈 의무는 별개다. 실제 시험 없이 행동 검증을 PASS로 바꾸지 않는다. STEP5B 결과·공개·미래 기능, STEP5C 장르 규칙, STEP6 Target 동결 이후는 다루지 않는다.

이번 문서화에서는 저장소 파일 변경, 브랜치·PR·checkpoint 생성, 실제 시험, 외부 재조사, 운영 변경, 구매·문의·job·dump·복원, 병합·main 반영을 수행하지 않았다.
