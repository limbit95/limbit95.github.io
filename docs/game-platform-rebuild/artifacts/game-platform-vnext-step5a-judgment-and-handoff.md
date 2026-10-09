# Game Platform vNext STEP5A — 판단안 및 Astra 인계

- 문서화 날짜: 2026-10-08 (Asia/Seoul)
- 실제 판단안 작성 주체: Codex
- 당시 요청된 역할: Astra. 역할 지정과 실제 모델 실행은 다르며, 이 문서는 Astra 실행·독립 검토 결과로 인증하지 않는다.
- 입력: `game-platform-vnext-step5a-evidence.md` (Sol 역할의 조사·Codex 보조 근거 자료)
- 저장소: `limbit95/limbit95.github.io`
- integration: `feature/game-platform-vnext-integration`
- 고정 판단 SHA: `aabb7646c0cdfd6466f2195579dce54689c7b81c`
- 상태: 사용자 승인 전 판단안 / 실제 Astra 검토 미수행 / 정식 저장소 반영 미수행

## 1. 문서의 지위와 범위

앞선 채팅의 STEP5A 판단을 파일로 정리한 인계 자료다. 새로운 소스 조사·구조 선택·구현·시험을 수행한 결과가 아니다. 이전 응답의 내용과 조건을 재구성했으며, 이번 문서화로 판단의 승인 상태를 바꾸지 않는다.

관찰 사실, 승인 요구, 판단, 미확인을 구분한다. 분류는 사용자 검토 전 권고이며, ‘그대로 연결’은 지정 기능의 코드 재사용이지 vNext 지원 완료가 아니다. 정식 STEP5A 산출물·완료 보고서가 아니다.

## 2. 앞선 판단 시점의 상태 확인

읽기 순서: AGENTS → 루트 실행 계획 → rebuild README → CURRENT → CP0078 → PR412·413.

| 항목 | 당시 직접 확인 결과 |
|---|---|
| 원격 integration | 기준 SHA와 동일, 추가 변경 없음 |
| 계획 | 개정 1.5 |
| PR412 | merged; `32429a20f76a7fde6733db384fa067fbcd7307d1` |
| PR413 | merged; 기준 integration SHA와 동일 |
| 단계 기록 | STEP4B COMPLETED, STEP5A NOT_STARTED |
| 행동 시험 | NOT_RUN |
| main | `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09`, vNext 미반영 |

이번 문서화 시점에 원격 상태를 다시 조회하지 않았다. 후속 판단자는 기준 SHA와 실제 HEAD를 다시 구분한다. 과거 병합 대기·HOLD는 당시 이력이며 CP0075/D0010과 실제 PR 증거를 함께 읽는다.

### 입력 자료 정정

1. 근거 자료 §3.2의 ‘알려진 만료 전 A 금지’는 **‘알려진 만료 뒤 새 A 금지’**로 정정해 적용한다. 만료 전에 적법한 A를 지난 동일 transaction의 늦은 C만 수용한다.
2. Room 계약의 실제 심볼은 `defineRoomLobbyAdapter`다. 근거 자료의 `createRoomLobbyAdapter` 표기는 오기다.
3. The Game/Liar BGM은 STEP1 inventory에도 있다. 근거 자료의 N은 추가 본문 확인으로 해석하며 inventory 미수록 경로를 의미하지 않는다.

원본 근거 파일은 이번에 수정하지 않았다. 정정은 후속 문서 반영 시 연결할 항목이다.

## 3. 승인 요구의 적용

- Core: 최소 식별·등록/발견·실행 수명·구성 연결·공통 계약/오류/정리. Room·host·ready·DOM·RPC·snapshot을 보편 전제로 강제하지 않는다.
- runtime/model: session·match·view 의미, ordering, authoritative/authorized 상태 채택, 동기화·복구.
- Site Adapter: 기존 Auth·사이트 metadata/route·Invite·BGM 연결. Registry·client Gate는 서버 권한 집행을 대체하지 않는다.
- 모든 완료 경로: 성공·error·null·finally·cleanup/leave·effect·후속 비동기 완료에 살아 있는 owner, 현재 context, 현재 권한, 모델 순서, 적용 시점 유지 조건을 적용한다.
- T01 같은 room의 새 match, T02 A→B→A, T03 role/view/user 변경은 숫자 version·room ID만으로 해결됐다고 보지 않는다.
- dispose는 채택 권리를 먼저 무효화한다. 늦게 얻은 자원과 정리는 이전 owner에 한정하고 새 등록·공유 자원을 파괴하지 않는다.
- CP0075/D0010: A는 lock 확보 뒤 같은 finalizer transaction의 fresh 최종 인가·착수이며 ingress/BEGIN/enqueue가 아니다. 적법하게 시작한 동일 transaction의 일반 저장 지연 C만 수용한다. 새 retry·transaction·command와 P에 예외를 전파하지 않는다. 만료 뒤 새 A 금지, owner anchor, 최초 t0+60 중단, terminal 뒤 LIVE 재개 금지를 유지한다.
- 기존 Auth·게임 무이관, 구현·실행·오픈 의무, STEP5B/5C/6 경계를 유지한다.

## 4. A — 공통 모듈 선택 판단안

| 대상·책임 단위 | 관찰 사실 | 권고 분류·범위 | 승인 요구에 따른 판단·조건 |
|---|---|---|---|
| Registry 기존 조회 | 정적 metadata·ID 조회·사이트 필드·4개 flag | 그대로 연결: 기존 게임 metadata | entry 의미 보존. 등록/flag를 권한·지원 완료로 사용하지 않음 |
| Registry 사이트·Invite 연결 | 사이트 GAMES 목록 별도, Invite는 기존 형식 요구 | 얇은 Adapter | ID·표시·route 출처를 추적하고 지원하지 않는 capability를 참으로 만들지 않음. 공개 사건은 5B |
| Registry vNext 실행 구성 | 기존 metadata에는 모델·구성·계약 호환 책임 없음 | vNext 새 구현 | Core 최소 등록·발견·구성 연결만 추가. 사이트 목록 복제·필드/경로 동결 없음 |
| Access 승인회원 진입 | allowed/reason/userId 변환·Auth 구독 | 얇은 Adapter: 기존 Gate 사용 | Site Adapter가 기존 Auth 보존, initialize·구독 완료를 현재 수명에 연결. 독자 권한 엔진 금지 |
| Access 실행 중 권한 | client Gate에는 최종 서버 인가·view 송신 집행 없음 | vNext 새 구현 | runtime 현재 context 채택과 backend A/P 집행을 각각 구현 |
| Room 8개 surface 검사 | 함수 존재 확인·binding만 제공 | 그대로 연결: 의미가 맞는 Room/Lobby 모델 | 형식 검사기로 제한. 가짜 ready/start 또는 보편 Room 강제 금지 |
| Room 기존 게임 연결 | 인원·nickname·RPC·정책이 게임별로 다름 | 당분간 local | 기존 게임 무이관. 신규 consumer에서 동일 의미의 반복이 확인될 때 재검토 |
| Room vNext 참여·명령 | 기존 adapter가 새 권위·owner·A/C/P를 제공하지 않음 | vNext 새 구현 | 선택 세션 모델·backend가 권한·중복·전환·leave 소유. RPC 이름 변환으로 해결하지 않음 |
| Snapshot 동기화·채택 | version/coalescing 중심, await 뒤 수명·handoff·quiet loss 공백 | vNext 새 구현 | 선택 모델이 채택·복구 소유. coordinator 전체 wrapping으로 이중 상태 관리자 만들지 않음 |
| Snapshot 순수 version 검사 | 비음수 정수 검사 | 그대로 연결: 같은 의미의 모델만 | 모든 모델에 정수 version 강제 금지. 알고리즘 참고와 본체 재사용 구분 |
| Reconnect 이벤트 감지 | online/pageshow/visible → refresh | 얇은 Adapter | 현재 owner 복구 요청 연결, 동기 throw와 늦은 오류 안전 처리 |
| Reconnect 실제 복원 | trigger에 최신성·복원·timeout 없음 | vNext 새 구현 | Snapshot과 하나의 선택 모델 복구 책임으로 묶음. 별도 복구 엔진 중복 금지 |
| Invite room 본체 | game_room v1·token/metadata·same-origin·사이트 RPC | 얇은 Adapter: room 의미 호환 consumer | envelope/token/share 본체 재사용. create/resolve/entry/join 전 구간 식별·대상 일치 |
| Invite 비room 대상 | 기존 API에 roomId/game_room 의미 | 보류: 의미가 호환되지 않는 대상만 | 실제 대상·서버 admission 근거 필요. 가짜 room·새 token 엔진 승인 아님 |
| Invite 게임별 join/UI | Cant Stop·legacy The Game 연결 의미 다름 | 당분간 local | 정상 연결 책임. token/resolve/share 본체를 복제할 때 중복으로 판단 |
| Shell DOM 표시 | banner·roster·상태 정규화·shell 구성 | 그대로 연결: 맞는 부품 / 얇은 Adapter: 상태 연결 | runtime 검증 상태 표시. 연결됨≠fresh LIVE. 전체 shell은 roster/sidebar 상시 생성하므로 보편 채택 안 함 |
| Shell 게임 화면·연출 | consumer가 보드·콘텐츠·결과 공급 | 당분간 local | 기존 디자인 보존. 필요 확인 전 범용 Shell 선제 제작 안 함 |
| BGM 저장·catalog·player | 공통 volume·metadata·구독 UI | 그대로 연결: 같은 의미 / 얇은 Adapter: 사이트 연결 | site utility 지위 유지. 새 Sound 엔진·Core 승격 아님 |
| BGM controller 수명 | play await 뒤 destroyed/pause 재검사 없이 내부 상태 변경 | 보류: vNext 수명 포함 연결 | 최소 호환 보완 또는 격리 근거 필요. 외부 callback 차단만으로 내부 의도 보존 확정 불가 |
| BGM 곡·mode·게임 이벤트 | game wrapper가 정책 선택 | 당분간 local | 공통 본체 호출 연결은 허용. 동일 연결 반복 확인 시만 재검토 |

### 중요한 판단의 적용 조건

**Invite:** gameInvite는 getGame 주입을 받지만 현재 entry는 기본 Registry를 사용한다. 생성에만 vNext 정보를 주입하면 입장 route에서 실패할 수 있다. 생성·해석·entry·join의 식별을 일관되게 연결해야 한다. 서버는 join 시 현재 권한과 대상 유효성을 다시 집행한다.

inviteRegistry disposer는 handler 동일성을 확인하지 않고 target key를 삭제한다. 사이트 owner가 등록 수명을 소유하고, 동적 교체가 필요하면 old disposer가 새 등록을 제거하지 않는 조건을 충족한다. dialog는 실행별 DOM에 귀속시켜 늦은 생성 결과를 현재 UI에 부착하지 않으며, QR 완료가 새 dialog를 건드리지 않게 한다.

**BGM:** tryPlay 대기 → pause/destroy → 이전 play 완료 → userPaused=false/PLAYING 기록의 코드 경로가 있다. 실제 소리 재개 여부는 미확인이지만 최신 pause 의도의 내부 덮어쓰기 가능 경로는 관찰했다. 단순 이름 변환 Adapter의 범위를 넘는다. 공용 BGM 파괴권은 실제 사이트 owner에 두고 게임은 자신의 사용권만 반환한다.

**Snapshot/Reconnect:** 채택·초기/live handoff·quiet loss reconciliation·실패 표시를 같은 선택 모델이 소유한다. 브라우저 trigger는 요청만 전달한다. No Thanks 일부 generation 방어를 모든 완료 경로의 보장으로 확대하지 않는다.

## 5. Source trace 및 미실행 검증

아래 경로는 앞선 판단에서 직접 재확인한 내용이다. commit은 상단 SHA이며 blob 표기는 prefix다. 기존 consumer·테스트 상세와 blob 동일성 대조는 Sol 근거 자료를 재사용했다. 이번 문서화에서 재조사하지 않았다.

| source | blob prefix | 줄/심볼 | 판단 영향 |
|---|---|---|---|
| games/shared/registry.js | afa4ba258241 | defineGame/GAME_REGISTRY/조회 | metadata와 실행 구성 분리 |
| games/shared/accessGate.js | 4803cd8fd141 | initialize/subscribe | Gate와 서버 집행 분리 |
| games/shared/roomLobbyContract.js | 4d037bd1b567 | defineRoomLobbyAdapter | 형식 검사 한정 |
| games/shared/snapshotCoordinator.js | 069f49aa23cf | runRefresh/refresh/dispose | 단순 wrapping 배제 |
| games/shared/reconnectRefresh.js | f96be29314ae | requestRefresh/start/stop | trigger와 복구 분리 |
| games/shared/gameInvite.js | 4d4b667e8516 | requirePlatformInviteGame/getGame | room 의미·Registry 호환 |
| js/invites/inviteEntry.js | f5438286f61c | handler/boot | 생성·입장 양끝 연결 |
| js/invites/inviteRegistry.js | 0c2c84736562 | registerInviteHandler | 등록 owner 안전 |
| js/invites/inviteShare.js | f1d370c83cbc | renderInviteQr/open/destroy | DOM 귀속·late completion |
| games/shared/gameShell.js | 298ab1399866 | L126~196 createGameShell | 보편 Shell 채택 제한 |
| js/game-audio/bgmController.js | 4757a1de3477 | L141~166 tryPlay/pauseByUser/destroy | 수명 적합성 제한적 보류 |

승인 원문 trace:

- `step-4a-responsibility-boundaries.md` blob `610efc904bdaec8881535d3405fe81102bd3d5df`, §2~4
- `step-4a-lifetime-contract.md` blob `5e40988234caba6cb605ea4c0b386a0a5b83b9c5`, §5~8
- `step-4b-runtime-sync-contract.md` blob `a6cfe51029e3fc3b2b546222b6a6afb0ad428f14`, CP0075/CP0074 현재 적용·J03
- `step-4b-security-site-contract.md` blob `e140c90d830ff891c2abd5e40b038249eeeb8ebf`, CP0075 현재 적용·J07~09
- `step-4b-z1-decision-and-design-closeout.md` blob `f3232f64c846bf4b17fcea2ae0bf6baed90ffc03`, §2~3
- `DECISIONS.md` blob `ab4896bd01b591895d0e30946a810c41eaa74e5a`, 유효 결정과 D0010 부분 대체

| 대상 | 기존 테스트 근거 재사용 | 후속 의무: 모두 NOT_RUN |
|---|---|---|
| Registry | foundation 조회·flag | entry 보존·vNext 식별/route·지원 표시 |
| Access | mocked Auth·unsubscribe | user/role/view 전환·late initialize/error·서버 A/P |
| Room | mapping/subscription/leave | 중복·경합·owner·실제 권한·기존 회귀 |
| Snapshot | coalescing·낮은 version·일부 rematch | T01~03 모든 완료·equal version/view·handoff/quiet loss |
| Reconnect | event/stop/refresh | 각 정상망 fresh 복구5초·실패·stop 뒤 완료·최초 deadline |
| Invite | envelope/same-origin/token join | create→entry→join·만료/철회/권한·등록/DOM 경합 |
| Shell | pure 상태·static wiring | 실제 DOM/mobile·mount 정리·owner·표시 정확성 |
| BGM | fake Audio/pause/volume/mode | pending play 경합·autoplay/BFCache·기존 동작 |

## 6. B — 중복 방지 기준안

| 기준 | 판단 |
|---|---|
| 의미 비교 | 입력·권위·출력·수명·실패 의미가 같은 본체의 다중 구현을 중복으로 본다. 이름만 비교하지 않는다 |
| 정상 연결 | game ID·곡·mode·DOM·game join 정책 연결은 허용한다 |
| 엔진 복제 금지 | token/resolve/share·권한·채택/복구·오디오 본체를 게임마다 복제하지 않는다 |
| Adapter 제한 | 형식/환경 연결·기존 수명 계약 소비까지. 독자 권한/ordering/복구 상태기를 숨기지 않는다 |
| 신규 책임 조건 | 승인 요구가 기존 본체에 없고 얇은 연결로 충족 불가함을 설명하며 최소 책임·owner 명시 |
| 병존 | 기존 import/API/RPC 유지. vNext 신규 consumer만 선택 모델 소비. 최종 채택자·파괴권 중복 소유 금지 |
| 공통 본체 보완 | Invite/BGM 최소 보완도 게임별 복제본으로 만들지 않는다. 호환 입증 불가 시 해당 연결 보류 |
| 기존 영향 | 향후 실제 규칙/shared 변경에는 기존 Governance 적용. MIGRATION_REQUIRED는 vNext 격리 재검토로 처리. 새 감사 단계 추가 안 함 |

## 7. C — 호환·수명·검증 책임안

| 소프트웨어 책임 | 소유 | 핵심 검증 |
|---|---|---|
| Core | 등록/발견·실행 수명·구성·공통 채택/정리 | 종료 뒤 재활성화 금지·owner cleanup·부분 초기화 |
| runtime/model | session/match/view·ordering·Snapshot/복구 | T01~03 전체 경로·handoff·quiet loss·fresh LIVE |
| capability | Invite 등 의미·적용 조건·자기 수명 | 대상 거부·현재 owner 완료/실패 |
| Site Adapter | Auth·metadata/route·Invite/BGM 연결·사이트 owner | API 호환·등록/DOM/구독·공용 자원 보호 |
| game-local | 규칙·UI·곡/mode·game join·얇은 연결 | 도메인/표현 보존·허용 결과만 effect |
| backend | 권한/private·A/C/P·중복/owner fencing·권위 | 실제 저장/전송·fresh 검사·terminal·CP0075 oracle |

작업 모델과 소프트웨어 owner는 다르다. Astra는 핵심 경계·충돌·보류 판단, Sol/Codex는 사실 보완·승인 판단 반영·기계적 검증, 후속 구현 담당은 별도 허용 단계에서 구현/시험한다.

## 8. D — 승인·미확인·인계

사용자 승인 전 핵심 권고:

1. 책임 단위로 기존 기능을 재사용하고 기존 게임은 무이관.
2. vNext 채택/동기화/복구는 선택 모델의 신규 책임이며 복구 본체는 중복하지 않음.
3. Invite 기존 본체 우선 연결, 의미가 다른 비room 대상만 보류.
4. BGM 기존 본체 재사용 방향 유지, controller 수명 적합성만 제한적 보류.

| 구분 | 항목 | 처리 |
|---|---|---|
| 분류 확정 공백 | BGM pending play와 pause/destroy 의도 보존 방식 | 최소 호환/격리 설계 근거 필요. 전체 오디오 재구현 아님 |
| 대상 연결 공백 | 비room 초대 의미·서버 admission | 해당 대상만 보류 |
| 구현 조건 | Invite 전 구간 식별·대상 유효성·owner 등록 | 정식 문서 조건 및 후속 전 구간 검증 |
| 실행 의무 | 실제 권한·성능·복구·DOM·audio·회귀 | NOT_RUN. 구조 공백을 실행 시험으로 대체 안 함 |

### 다음 작업 순서 정정

앞선 채팅 판단은 승인 후 Sol/Codex 정식 반영을 제안했다. 그러나 사용자 의도는 Sol 근거 → 실제 Astra 핵심 판단 → Sol/Codex 반영이며, 실제 Astra 실행은 아직 확인되지 않았다. 따라서 **지금 다음 작업은 Astra의 판단안 검토·확정**이다. 이것은 별도 사후 감사 단계를 추가하는 것이 아니라 원래 배정한 핵심 판단 작업을 실제 담당에게 넘기는 것이다.

Astra 판단 제출 → 사용자 결과 검토/필요 승인 → 별도 허용 범위에 따른 Sol/Codex 정식 반영으로 이어간다. 이 문서화 요청은 판단 승인이나 저장소 반영 허용이 아니다.

## 9. Astra 전달 프롬프트

Game Platform vNext STEP5A 핵심 판단을 진행해줘.

담당: Astra. 실제 모델을 Astra로 선택한 상태에서 수행한다.

첨부 입력 두 개를 먼저 실제로 읽어줘:
- `game-platform-vnext-step5a-evidence.md`: Sol 역할의 판단 근거. 승인된 선택표가 아님.
- `game-platform-vnext-step5a-judgment-and-handoff.md`: Codex 판단안과 정정·조건. 실제 Astra 검토나 사용자 승인 결과가 아님.

저장소 `limbit95/limbit95.github.io`, integration `feature/game-platform-vnext-integration`, 고정 판단 SHA `aabb7646c0cdfd6466f2195579dce54689c7b81c`.

AGENTS → game_platform_vnext_final_execution_plan.md → docs/game-platform-rebuild/README.md → CURRENT.md → checkpoints/CP-0078-step-4b-integration-merged.md → PR412/413 순서로 복원하고 실제 원격 HEAD와 대조해줘. 추가 변경은 기준 SHA와 분리해줘. 계획1.5, STEP4B COMPLETED, 기록 STEP5A NOT_STARTED, 행동 시험 NOT_RUN, main 미반영을 보존해줘. 과거 병합 대기/HOLD는 이력으로 읽고 CP0075/D0010의 유효 대체 관계를 적용해줘.

목적은 기존 공통 기능의 재사용·Adapter·local 경계를 실제 Astra 판단으로 정하는 것이다. Codex안을 정답으로 승인하지 말고 유지/수정/보류 근거를 제시해줘. 별도 감사 단계나 전체 재조사는 추가하지 말고 결론을 바꿀 근거 공백·충돌만 최소 추가 확인해줘.

Registry/Access/Room/Snapshot/Reconnect/Invite/Game Shell/사이트 BGM을 책임 단위·consumer/model별로 그대로 연결/얇은 Adapter/vNext 새 구현/당분간 local/보류로 분류해줘. 파일 전체를 억지로 한 분류에 넣지 마. Adapter 안에 새 권한·순서·복구·수명 엔진을 숨기지 말고 기존 Auth·게임은 무이관으로 보존해줘.

중점 판단:
1. Registry metadata 재사용과 vNext 최소 등록/구성 책임의 분리가 과도한 중복을 만들지 않는가.
2. Snapshot/Reconnect 신규 책임 범위가 기존 coordinator 전체 재구현을 불필요하게 확대하지 않는가. 하나의 선택 모델 복구 책임으로 충분한가.
3. Invite 생성/해석/entry/join의 식별 연결·사이트 handler owner·dialog 완료를 기존 본체와 얇은 연결로 충족할 수 있는가. 비room 보류는 실제 현재 대상에 필요한가, 미래 미선택 범위인가.
4. BGM controller pending play가 pause/destroy를 덮어쓰는 경로에 대해 최소 호환 보완/격리의 책임 수준을 정할 수 있는가. 실제 실행이 필요한 증거와 설계상 공백을 구분하고, 전체 audio engine 신설로 확대하지 마.
5. Shell은 부품별 적용으로 충분한가. room/host/ready/DOM을 Core 필수로 강제하지 마.

STEP4A의 모든 완료 경로와 T01~03, 현재 권한·owner·ordering 요구를 적용해줘. ‘알려진 만료 전 A 금지’ 오기는 ‘만료 뒤 새 A 금지’로 읽어줘. CP0075 A/C/P와 동일 transaction late C의 제한적 수용, 새 P·retry 인가, 최초60초·terminal 보호를 유지해줘.

제출물:
- 8개 대상의 책임 단위별 선택 판단표: 관찰 사실/승인 요구/Astra 판단/미확인, 분류·범위·이유·source·호환/수명 조건·후속 검증.
- 중복 방지 기준과 소프트웨어 책임자(Core/runtime·model/capability/Site Adapter/game-local/backend).
- Codex안에서 유지/수정한 핵심 항목과 이유. 보류는 범위·해소 근거·담당·후속 단계까지 명시.
- 사용자 승인 항목, 설계 결론을 막는 공백과 실행 검증 의무의 구분, 다음 첫 작업 하나·담당 모델·전달 프롬프트.

판단 결과는 별도 요청 없이 저장소 밖 전달용 Markdown 파일로 즉시 문서화하고 링크를 제공해줘. 실제 작성 모델과 승인 상태를 정확하게 기록해줘. 정식 저장소 산출물 작성·단계 완료·사용자 승인·행동 PASS로 표시하지 마.

저장소 파일 변경, branch/PR/checkpoint/commit 생성, 구현·실제 시험·외부 재조사·운영 변경·구매·문의·job/dump/복원·병합/main 반영은 금지한다. STEP5B 이후·STEP6 경로/API/클래스/수명 기법 동결을 앞당기지 마. 판단과 전달용 파일·다음 프롬프트 제출 뒤 멈춰줘.
