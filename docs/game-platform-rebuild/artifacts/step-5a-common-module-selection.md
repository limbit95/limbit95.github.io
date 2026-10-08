# STEP5A — 공통 모듈 선택표

- 상태: **APPROVED_JUDGMENT / FORMAL_RESULT_REVIEW_PENDING**. 사용자는 실제 Astra 핵심 판단과 이번 문서 반영·검증·원격 PR 제출을 명시적으로 승인했다. 정식 결과 최종 검토·STEP5A 완료·integration 병합·main 반영은 남아 있다.
- 직접 반영 입력: [실제 Astra 판단 원본](game-platform-vnext-step5a-astra-judgment.md) §1·3·4. 기준 commit `aabb7646c0cdfd6466f2195579dce54689c7b81c`. [원본 식별·source trace](step-5a-source-trace.md), [문서 검증](step-5a-validation.md).
- Sol/Codex는 승인된 판단을 다시 선택하지 않고 아래 원문 절을 그대로 반영했다. [Sol 근거](game-platform-vnext-step5a-evidence.md)는 사실 입력, [앞선 Codex안](game-platform-vnext-step5a-judgment-and-handoff.md)은 실제 Astra 판단보다 아래의 이력이다.
- 아래 원문의 ‘사용자 승인 전’, ‘이번 직접 읽기’, ‘현재 NOT_STARTED’, ‘다음 처리’는 Astra 작성 당시의 상태·행위다. 현재 승인/제출 상태는 이 헤더와 [CURRENT](../CURRENT.md), [CP0079](../checkpoints/CP-0079-step-5a-formal-submitted.md)를 따른다. 원문의 조건·미확인·제한적 보류는 그대로 유효하며 ‘그대로 연결’도 구현 지원 인증이 아니다.
- 행동 시험 **NOT_RUN**, 구현·실행·오픈 의무와 **UNKNOWN** 유지. 기존 Auth·게임 무이관, 계획1.5·STEP4A/4B·CP0075/D0010 유지. 실제 경로/API/수명 기법의 STEP6 동결이나 STEP5B 이후 착수 없음.
- G1~G5는 [선택표 §3](step-5a-common-module-selection.md#3-모든-분류에-적용하는-승인-요구), source ID는 [trace §9](step-5a-source-trace.md#9-source-trace와-추가-읽기-범위)를 참조한다.

## 1. 결론과 문서 지위

**책임 단위 재사용을 기본으로 하되, vNext에 없는 채택·복구·실행 수명 책임만 새로 보완한다. 기존 Auth와 게임은 이관하지 않는다.** Registry, Room 형식 검사, Invite의 token/envelope/route, Shell 표시 부품, 사이트 BGM 본체를 각각 의미가 맞는 범위에서 재사용한다. 파일 전체의 재사용 또는 전면 재작성 중 하나를 고르지 않는다.

Codex안의 큰 경계는 유지한다. 다음 네 부분을 명확히 수정한다.

1. **Registry:** Core의 등록·구성 책임 추가가 두 번째 사이트 metadata 목록을 만드는 근거가 되지 않는다. 같은 게임 식별과 표시 정보의 출처는 중복 소유하지 않는다.
2. **Snapshot/Reconnect:** 새로 필요한 것은 선택 모델의 단일 채택·동기화·복구 책임이다. 기존 coordinator의 기능 전부를 별도 엔진으로 다시 만드는 승인도, 기존 coordinator 밖에 두 번째 권위 상태 관리자를 붙이는 승인도 아니다.
3. **Invite:** 비room 초대는 현재 필수 consumer로 확인되지 않았다. 미래 미선택 대상으로 제한해 보류하며 STEP5A 전체 blocker로 삼지 않는다. room 초대의 얇은 연결은 가능하지만, 현재 본체 내부의 늦은 DOM 완료와 동적 handler 교체 안전성을 Adapter가 저절로 해결한다고 보지 않는다.
4. **BGM:** 최소 보완 책임은 판단할 수 있다. controller가 최신 재생 의도·종료 상태와 자기 작업의 완료를 소유해야 한다. 이 설계 선택 자체를 막연히 보류하지 않는다. 다만 **무보완 controller의 vNext 수명 적합성·사용 가능 판정은 보류**한다. 실제 browser 동작은 NOT_RUN이고 새 audio engine은 필요하지 않다.

이 문서는 STEP5A 핵심 판단 제출물이다. 정식 저장소 산출물 작성, STEP5A 완료, 사용자 승인, vNext 지원 완료를 선언하지 않는다. ‘그대로 연결’도 특정 기능의 재사용 선택이며 현재 실행 지원 보증이 아니다. 소스 읽기·논리 대입·기존 테스트 범위의 재사용을 행동 시험 PASS로 바꾸지 않는다.

## 3. 모든 분류에 적용하는 승인 요구

아래 요구를 표의 G1~G5로 참조한다. 단순 callback 입구 확인이나 room ID/version 비교만으로 충족한 것으로 보지 않는다.

- **G1 책임·공존:** 최소 Core, 선택 runtime/model, capability, Site Adapter, game-local, backend의 의미를 분리한다. 기존 Auth·게임·import/API/RPC를 보존하며 Room/host/ready/DOM/snapshot을 Core 필수로 강제하지 않는다.
- **G2 완료 채택:** 살아 있는 owner, 현재 적용 context, 현재 정보·행위 권한, 모델 순서, 실제 반영 시점까지의 조건 유지. 성공/snapshot, error, null, finally, cleanup/leave, effect 및 후속 비동기 작업 전부 대상이다. await·재진입 후에도 필요 조건이 유지돼야 한다.
- **G3 종료·자원:** 채택 권리를 먼저 무효화하고 정리한다. 늦게 얻은 자원과 finally는 과거 owner의 자원·bookkeeping만 정리한다. 이전 disposer가 새 등록·새 작업·공용 자원을 해제하지 않는다. 취소 성공을 안전성 전제로 삼지 않는다.
- **G4 동기화·복구:** 연결 성공과 현재 권한 있는 fresh LIVE를 분리한다. 초기/live handoff, 마지막 이벤트의 조용한 유실, reconciliation, 실패 상태·복구를 같은 선택 모델 책임으로 연결한다. 적용되는 각 정상망 복구 5초 요구와 최초 fault 60초·terminal 보호를 유지한다.
- **G5 서버 권한:** Registry/Gate/클라이언트 수명 검사는 서버의 권한·private view·owner fencing·A/C/P 집행을 대체하지 않는다. CP0075의 제한적 늦은 C 수용을 새 P나 retry 허용으로 넓히지 않는다.

T01 같은 Room의 새 Match, T02 A→B→A, T03 role/view/user 변경은 모든 완료 경로에 대입한다. 같은 version이나 더 큰 version도 과거 권한·수명을 되살리지 못한다. 다만 현재 consumer가 authoritative·authorized 재조회임을 명시적으로 재검증한 데이터의 채택은 STEP4A §6.1대로 가능하며 모든 이전 발행 데이터를 무조건 폐기하는 새 규칙도 만들지 않는다.

### CP0075/D0010 보존

A는 필요한 anchor/owner/command 잠금을 확보한 뒤, 같은 finalizer transaction에서 current predicate를 검사하고 허용된 한 command의 저장 처리로 들어가는 사건이다. ingress/BEGIN/enqueue는 A가 아니다. 검사와 착수 사이에 대기·제어 반환이 생기면 fresh 검사를 요구한다.

- 명시된 운영 범위에서 외부 R+5초 이후 새 A 금지, **known expiry 뒤 새 A 금지**, 실패 인지 뒤 새 허가 금지.
- 기한 내 적법한 A를 지난 **동일 transaction**의 일반 저장 지연 C만 제한적으로 수용한다. C는 실제 commit으로 계속 관측한다. 이 사례를 ‘실제 C 5초 PASS’라고 쓰지 않는다.
- 새 transaction·retry·command는 새 A가 필요하다. 결과 불명은 중복 원장을 확인하며 무조건 재실행하지 않는다.
- ACK·snapshot·duplicate 응답을 포함한 새 P는 recipient/session/view/payload의 현재 권한과 최종 취소 불가 transport 인계 기준을 따로 충족해야 한다. 앱 queue 삽입은 P가 아니다.
- A에서 확보한 owner anchor를 C/rollback까지 유지한다. owner 교체 뒤 old owner의 새 저장·송신을 허용하지 않는다.
- 최초 t0+60초 정각 abort 우선, retry/restart로 기한 초기화 금지, terminal 뒤 늦은 C/ACK로 LIVE 재개 금지를 유지한다.
- D0008의 입증된 runtime/DB/host 정지 한계와 일반 저장 지연을 섞지 않는다. 새 작업·재개 뒤 fresh 검사와 기존 D0006~09, CP0074 S-A~C/B5·구현/오픈 의무는 유지한다.

## 4. 8개 대상 책임 단위별 선택 판단표

표의 source ID는 §9에 연결된다. **관찰 사실**, **승인 요구**, **Astra 판단**, **미확인·후속 검증**을 구분한다. 조건부 재사용은 조건이 이미 구현됐다는 뜻이 아니다. 기존 consumer는 이관 대상이 아니라 보존·후속 회귀 대상이다.

### 4.1 Registry

| 책임·consumer/model | 관찰 사실 | 승인 요구 | Astra 분류·범위·이유 | 호환·수명 조건 | 미확인·후속 검증 |
|---|---|---|---|---|---|
| 기존 게임 metadata 조회 | R1: immutable 5개 entry, 표시/상대 href/platform/4개 flag 조회 | G1·G5 | **그대로 연결**. 기존 metadata의 의미와 조회를 재사용 | 기존 ID·entry·flag 의미 보존. capability 선언을 권한 또는 실행 지원 증거로 승격 금지 | 기존 foundation 근거 재사용. ID/조회/route 보존·새 consumer 호환은 후속 검증, NOT_RUN |
| 사이트 목록·Invite 식별 투영 | E·R1·I1/2: 사이트 GAMES 별도, Invite entry의 기본 Registry 의존 | G1·G2 | **얇은 Adapter**. 현재 출처를 참조해 site/Invite 형식으로 연결 | 같은 게임의 표시·route를 Core에 복제하지 않음. 생성·entry·join이 동일 identity를 해석. 게시 정책은 STEP5B로 유보 | 통합 목록 존재·현재 vNext 등록은 미확인. 생성만 인식하고 entry가 거부하는 비대칭 검증 필요 |
| vNext 최소 실행 등록·구성 | R1은 model 조합·실행 수명·계약 호환을 제공하지 않음 | G1·G3 | **vNext 새 구현**. Core에 빠진 최소 식별/발견/구성 책임만 | 기존 catalog와 다른 책임이라는 증거를 유지. 동일 ID에 두 개의 권위 metadata를 두지 않음. 필드·경로·등록 API는 STEP6 전 동결하지 않음 | 정확한 표현/API는 후속 미결정. 미지원 조합·중복 식별·실행 종료 후 등록 소유권 검증 필요 |

**판단:** 책임 분리는 타당하지만 새 Registry 파일·새 전체 목록을 지금 승인할 이유는 없다. 새 책임의 데이터는 기존 metadata 참조와 실행 구성의 차이만 가져야 한다. 사이트 공개 목록의 통합 정책을 STEP5A에서 선결정하지 않는다.

### 4.2 Access

| 책임·consumer/model | 관찰 사실 | 승인 요구 | Astra 분류·범위·이유 | 호환·수명 조건 | 미확인·후속 검증 |
|---|---|---|---|---|---|
| 승인회원 진입 UX·Auth 구독 | E/A1: Gate는 allowed/reason/userId와 주입 Auth initialize/subscribe. 기존 두 게임 소비 | G1~3 | **얇은 Adapter**로 기존 Gate 연결. 상태 변환 본체는 재사용 | Site Adapter가 기존 Auth를 연결하며 initialize/subscribe의 늦은 완료와 unsubscribe를 현재 실행 owner에 귀속. Auth 교체·독자 인증 엔진 금지 | mocked Auth 테스트는 실제 freshness 증거 아님. late initialize/error·재진입 subscribe·로그아웃/user 변경 검증 필요 |
| 실행 중 결과 채택의 권한 맥락 | Gate에는 session/match/view ordering·전체 완료 채택이 없음 | G2·G3 | **vNext 새 구현**, runtime/model의 채택 책임 일부 | 별도 Access 상태 엔진을 중복하지 않음. TOKEN_REFRESHED를 profile 최신 승인 보장으로 취급하지 않음 | T01~03 전 경로·현재 private 제거·새 view 확보 검증 |
| 최종 보호 행위·정보 송신 | 클라이언트 Gate는 backend A/P 집행을 제공하지 않음 | G5 | **vNext 새 구현**, 승인된 backend 설계의 미구현 책임 | 기존 Auth를 권한 입력으로 사용하되 실제 backend fresh 검사·owner/중복/최종 P 책임은 서버에 있음 | 실제 설정·caller·권한 철회/expiry·A/C/P·송신은 NOT_RUN. 현존 Gate/테스트로 완료 선언 금지 |

### 4.3 Room

| 책임·consumer/model | 관찰 사실 | 승인 요구 | Astra 분류·범위·이유 | 호환·수명 조건 | 미확인·후속 검증 |
|---|---|---|---|---|---|
| Room/Lobby 8개 surface 형식 검사 | E/Rm1: `defineRoomLobbyAdapter`는 함수 존재·binding 검사 | G1 | **그대로 연결**, 그 8개 의미가 자연스러운 consumer만 | 검사기를 runtime 보장으로 오인하지 않음. roomless/hostless 모델에 fake ready/start/room 금지 | 실제 모델 surface 적합성·binding 회귀. 정수 version/RPC 필수화 금지 |
| 기존 게임 adapter·정책 | Cant Stop/No Thanks의 인원·nickname·RPC·tracking 전제가 다름 | G1·G3 | **당분간 local**. 기존 consumer를 보존 | game-local이라는 이유로 서버 권한·공통 수명 의무를 면제하지 않음. 기존 코드를 vNext 템플릿으로 승격하지 않음 | 기존 mapping/leave/subscription 테스트 근거 재사용. 변경이 생기는 허용 단계에서 기존 회귀 확인 |
| vNext 참여·명령·leave | 현재 surface 검사에 owner/현재 권한/중복/전환 보장이 없음 | G2·G3·G5 | **vNext 새 구현**, 선택 세션 모델과 backend의 미충족 책임만 | transport/RPC 연결은 얇게 두고 finalizer/채택 엔진은 숨기지 않음. 서버 commit된 leave를 client 무효화로 취소했다고 말하지 않음 | T01~03, 중복·경합·late leave·late resource acquisition·실제 backend 권한 검증 |

### 4.4 Snapshot

| 책임·consumer/model | 관찰 사실 | 승인 요구 | Astra 분류·범위·이유 | 호환·수명 조건 | 미확인·후속 검증 |
|---|---|---|---|---|---|
| 순수 version 검사 | S1: `snapshotVersion`은 비음수 정수 검사 | G1·G2 | **그대로 연결**, 같은 version 의미를 선택한 모델만 | ordering 범위·현재 view는 별도 모델 판단. 모든 모델에 integer snapshot 강제 금지 | equal version의 view 변화·version reset 조건은 consumer별 검증 |
| 기존 두 게임 coordinator 경로 | S1/E: load 뒤 currentSnapshot/currentVersion 갱신, 낮은 version만 거부. await 뒤 disposed 재검사 없음 | G1~3 | 기존 consumer는 **당분간 local**로 보존. 현 coordinator를 vNext 최종 채택자로 그대로 연결하는 선택은 하지 않음 | No Thanks 일부 generation guard를 전체 command/catch/null/finally 보장으로 확대하지 않음 | 기존 F01 등 미해결 실행 위험을 고쳤다고 표시하지 않음. 이번 재현 없음 |
| vNext 최종 채택·동기화·reconciliation | S1: 구독 함수 반환만 확인, readiness/handoff/quiet loss·전체 완료 채택 없음 | G2~5 | **vNext 새 구현**, 선택 권위/동기화 모델의 단일 책임 | current state/version·freshness·복구를 최종 소유하는 주체 하나. 기존 coordinator와 새 모델이 각각 ‘현재 상태’를 판정하는 이중 구조 금지 | 성공/error/null/finally/cleanup/effect 전체 T01~03; 초기/live handoff·quiet loss·현재 권한·5초 복구·terminal 검증 |
| refresh 병합·version 비교의 재사용 | S1의 coalescing과 비교는 유용하나 전체 coordinator의 상태/수명과 결합됨 | G1~3 | **vNext 새 구현 범위 안에서 기존 알고리즘·분리 가능한 utility 재사용 우선**. 전체 파일 재작성 지시가 아님 | 새 모델 내부에서 단일 소유권을 유지하는 경우만 재사용. 소스 추출·최소 보완·기존 전체 본체 연결 중 구체 형태는 STEP6 이후 범위에서 결정 | ‘기존 코드 사용량’이 안전성 증거가 아님. 중복 fetch 억제와 마지막 refresh 요청 보존·dispose 후 정리 검증 |

**판단:** 신규 책임은 필요하지만 별도 범용 Snapshot 플랫폼이나 모든 전송 모델용 coordinator를 선제 제작하지 않는다. coalescing 구현을 참고·재사용할 수 있다는 사실과 현재 coordinator 본체가 새 수명 계약을 충족한다는 주장은 다르다.

### 4.5 Reconnect

| 책임·consumer/model | 관찰 사실 | 승인 요구 | Astra 분류·범위·이유 | 호환·수명 조건 | 미확인·후속 검증 |
|---|---|---|---|---|---|
| browser 복구 신호 | E/Rc1: online/pageshow/visible → refresh; listener start/stop | G2·G3 | **얇은 Adapter**. 기존 trigger를 현재 모델의 복구 요청에 연결 | stop은 진행 중 완료 무효화와 다름. 요청·동기 throw·늦은 rejection이 과거 owner로 현재 상태를 바꾸지 않음 | 이벤트 중복/재진입·stop 후 완료·오류·BFCache 관련 검증, NOT_RUN |
| 실제 session 복원·현재 상태 회복 | trigger에는 session restore/readiness/timeout/quiet loss 엔진 없음 | G2~5 | **vNext 새 구현**, Snapshot과 **같은 선택 모델 복구 책임** | 별도 Reconnect authoritative state·별도 retry clock·별도 fresh LIVE 판정기 금지. transport 재연결은 모델 복구의 입력 | 각 적용 정상망 복구5초·조용한 유실·권한 재확인·실패 구분·최초60초·terminal 보호 검증 |

### 4.6 Invite

| 책임·consumer/model | 관찰 사실 | 승인 요구 | Astra 분류·범위·이유 | 호환·수명 조건 | 미확인·후속 검증 |
|---|---|---|---|---|---|
| `game_room` v1 본체 | I1/E: token·metadata·expiry 형식, create/resolve/parse/same-origin route, site RPC | G1·G5 | 본체는 **그대로 연결**, room 의미 호환 consumer의 사이트 연결은 **얇은 Adapter** | token/resolve/share 새 엔진 금지. `shared+online+invite` 같은 기존 의미를 거짓 flag로 통과시키지 않음. 현재 join 권한·target 유효성은 backend 집행 | 생성→resolve→entry→join 전체, 만료·철회·잘못된 game/room·서버 admission은 NOT_RUN |
| metadata·entry·join 연결 | I1은 getGame 주입 가능, I2 entry는 기본 Registry 사용 | G1·G2·G5 | **얇은 Adapter**로 identity/route 출처를 전 구간 연결 | 생성만 새 게임을 알고 entry가 모르는 연결은 불합격. 대상 page 도착과 실제 join 승인은 별개. route 후에도 game/target/current user 재확인 | 선택 consumer의 등록·route·admission 조합은 아직 구현되지 않음. 이는 조건부 연결이지 지원 완료 아님 |
| handler 등록 수명 | I3: target key set; disposer는 현재 handler 동일성 검사 없이 key 삭제 | G2·G3 | 단일 사이트 owner의 안정 등록은 **얇은 Adapter**로 소비 가능. 교체형 consumer는 **보류: 현재 무보완 disposer 사용** | 등록 교체가 없다는 실제 소유 조건을 지키거나, 교체가 필요하면 공통 등록 본체에 최소 소유 확인을 보완. 게임마다 새 Registry·수명 상태 엔진 금지 | old disposer→new registration, 진행 중 dispatch→owner 교체 검증. 고유 token/handle 같은 기법은 미동결 |
| dialog·QR·copy/share 완료 | I4: await 뒤 내부 DOM 쓰기·오류 표시; destroy는 remove만 수행 | G2·G3 | 구성·UI 연결은 **얇은 Adapter**, **무보완 본체의 전체 완료 수명 적합성은 보류** | 새 dialog 생성 전 owner 확인만으로 내부 완료를 해결했다고 주장 금지. 각 dialog를 재사용하지 않는 소유 경계 + 내부 완료가 현재 UI/오류·후속 작업을 바꾸지 않는 최소 공통 보완 또는 동등한 격리 근거 필요 | QR 성공/실패·copy/share 성공/실패·destroy/새 dialog 경합. 이미 시작한 OS 공유·clipboard 동작의 회수를 약속하지 않음 |
| 공통 등록·표시 본체의 미충족 수명 보호 | I3/I4: 교체형 등록 소유 확인과 내부 비동기 완료 보호가 현재 본체에 없음 | G2·G3 | **vNext 새 구현 — 실제 consumer에 필요한 추가 수명 보호 부분만**. 기존 공통 본체의 최소 호환 보완으로 실현 | 별도 token/Registry/share 엔진을 만들지 않음. 기존 단일 owner 조건으로 이미 충족되는 부분은 추가 구현 불필요. Adapter는 보완된 계약을 소비 | 소비자별 보완 필요성·기존 API/동작 보존·H2/H3 경합 증거. 구체 기법/경로는 미동결 |
| 게임별 join/UI 정책 | E: Cant Stop token join과 legacy The Game form 연결은 다름 | G1·G2·G5 | **당분간 local** | 얇은 game join 연결은 중복 엔진이 아님. 결과 effect는 현재 채택 조건을 만족할 때만 | 기존 consumer 회귀, wrong-room·late join/error/leave 검증 |
| 비room 초대 | I1에 roomId/game_room 의미. 입력·계획에는 비room 초대를 지금 필수로 쓰는 구체 consumer 없음 | G1·G5 | **보류 — 미래 미선택 대상 한정** | room 없는 모델 자체는 허용. Invite 미선택과 모델 미지원은 다름. fake room·새 token 체계를 만들지 않음 | 실제 consumer가 초대를 선택할 때 target 의미·권위 admission·기존 본체 호환 근거로 재판단. STEP5A 전체 blocker 아님 |

**판단:** 현재 입력만으로 ‘얇은 연결만 작성하면 모든 Invite 수명이 완성된다’고 결론 내릴 수 없다. 그러나 token/envelope/route 본체를 새로 만들 이유도 없다. Site Adapter는 기존 Core/모델의 수명 계약을 소비하고, 등록/표시 본체 내부 공백은 그 본체의 최소 호환 보완으로 닫는다. 기존 entry의 stable page 수명과 vNext 실행별 등록을 혼동하지 않는다. 새로운 비room 대상은 지금 선제 설계하지 않는다.

### 4.7 Game Shell

| 책임·consumer/model | 관찰 사실 | 승인 요구 | Astra 분류·범위·이유 | 호환·수명 조건 | 미확인·후속 검증 |
|---|---|---|---|---|---|
| 표시 정규화·banner·roster 등 | E/Sh1: DOM/CSS 부품·pure state. Room engine/권한 집행 없음 | G1·G2 | 맞는 부품은 **그대로 연결**, model state 변환은 **얇은 Adapter** | 모델이 검증한 상태만 표시. connected≠fresh LIVE. ready/host/seat가 없는 모델은 그 의미를 만들지 않음 | 실제 DOM/mobile·접근성·모델별 표시 정확성 NOT_RUN |
| 전체 shell 조립·mount | 전체 shell은 roster/sidebar 등도 생성. 게임 노드는 consumer 공급 | G1~3 | consumer에 의미가 맞으면 **얇은 Adapter**. 보편 전체 Shell 신설·강제 채택은 하지 않음 | view owner가 mount/subscription/event 정리 책임. DOM 없는 모델은 미선택. 기존 화면 교체 없음 | mount/dispose/재진입·이전 view 완료·공용 node 훼손 여부 검증 |
| 보드·콘텐츠·결과 연출 | 기존 게임이 공급하는 고유 UI | G1·G2 | **당분간 local** | 게임별 승인 디자인 보존. 결과 의미·Sound 확장 계약을 STEP5B보다 앞당기지 않음 | 기존 디자인/연출 회귀 및 허용 결과만 effect 검증 |

**판단:** 부품별 적용으로 충분하다. Shell이 있다는 이유로 Core에 DOM·Room·host·ready를 추가하거나 roomless 게임을 가짜 로비로 감쌀 필요가 없다.

### 4.8 사이트 BGM

| 책임·consumer/model | 관찰 사실 | 승인 요구 | Astra 분류·범위·이유 | 호환·수명 조건 | 미확인·후속 검증 |
|---|---|---|---|---|---|
| volume 저장·catalog·player 표시 | E/B1: 기존 공통 저장·곡 metadata·구독 UI, site utility | G1~3 | 같은 의미는 **그대로 연결**, site/game 연결은 **얇은 Adapter** | 기존 volume·곡·autoplay 정책 보존. Site utility 재사용이 정식 shared/Core 승격을 뜻하지 않음 | fake Audio 테스트 범위 재사용. 실제 UI·storage·browser 회귀는 NOT_RUN |
| controller 재생·정지 본체 | B1: per-instance Audio와 내부 상태; `tryPlay` await 뒤 destroyed/userPaused 재검사 없이 PLAYING·userPaused=false | G2·G3 | 본체 재사용 방향 **유지**. **보류는 무보완 controller의 vNext 수명 포함 직결**에 한정 | controller 내부에서 현재 재생 의도·종료·자기 작업 귀속을 지키는 최소 호환 보완 책임을 확정. 외부 callback 차단만으로 해결 불가 | 실제 소리 재개·브라우저 promise 동작은 미확인. 소스상 상태 덮어쓰기 경로와 실제 음향 현상을 구분 |
| 미충족 완료 수명 부분 | B1: success/catch/finally 모두 내부 상태를 바꿀 수 있음; switch는 in-flight 중 false | G2·G3 | **vNext 새 구현 — 추가 수명 보호 부분만**. 기존 공통 controller의 최소 보완으로 실현하고 audio engine을 복제하지 않음 | pause/destroy 후 과거 play 성공·실패가 최신 의도·상태를 덮지 않음. 종료는 되돌릴 수 없음. old finally는 자기 작업만 정리. old cleanup은 새 소유 Audio를 pause하지 않음 | 완료 순서 역전·reentrant listener·pause→play·destroy·track switch·reject/finally 경합. API·generation/lease/refcount 기법·파일 위치 미동결 |
| 곡/mode/게임 이벤트 정책 | E: 각 wrapper가 session·queue·mode/곡을 선택 | G1·G2 | **당분간 local** | 공통 본체 호출 파일은 중복 아님. No Thanks mode mapping을 이번에 버그로 변경하지 않음. 무제한 재시도/queue를 Adapter에 숨기지 않음 | pending switch 거부 의미·최신 mode 정책·기존 게임 동작 회귀 필요 |

**BGM 최소 설계 판단:** Audio와 재생 상태의 실제 owner는 controller다. 사이트가 공유하는 자원은 그 실제 공용 owner가 파괴권을 가진다. 게임은 자신의 연결·사용권만 반환한다. controller가 실행마다 독립인지 사이트 전체 공유인지는 consumer의 실제 범위에 따라 다르며 전역 singleton을 새로 강제하지 않는다.

현재 pending play는 성공 시 `userPaused=false/PLAYING`, 실패 시 ERROR 또는 interaction 대기 상태, finally에서 in-flight 변경이 가능하다. 따라서 수명 보완은 성공 callback 하나를 가리는 범위보다 넓다. **최신 사용자 의도·종료 상태 우선, 완료의 작업 귀속, 자기 자원 한정 정리**라는 책임을 기존 본체 안에서 충족시키는 방향을 선택한다. 이는 STEP5A에서 가능한 의미·owner 결정이다. 구체 필드/API/기법·호환 패치의 구현은 후속 허용 단계다.

단순 외부 wrapper는 이미 본체 내부에서 일어난 상태 쓰기·Audio side effect를 되돌리는 안전성 근거가 아니다. 격리를 대안으로 쓰려면 상태·Audio·interaction listener·후속 작업 모두 과거 owner 안에 한정되고 최신 사용자 의도를 침범하지 않는다는 근거가 있어야 한다. 기존 소비자 API/정상 동작을 보존할 수 없다면 기존 게임을 고치는 대신 해당 vNext 연결을 보류하고 격리 경계를 재검토한다.

