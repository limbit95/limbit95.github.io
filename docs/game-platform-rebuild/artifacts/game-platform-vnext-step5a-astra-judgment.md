# Game Platform vNext STEP5A — Astra 핵심 판단 및 전달

- 작성일: 2026-10-08 (UTC / Asia·Seoul 동일 날짜)
- 실제 핵심 판단·본문 작성 모델: **Astra (`gpt-6-astra`)**. 기존 Codex안을 자동 승인한 문서가 아니다.
- 상태: **사용자 승인 전 판단 제출 / 저장소 밖 전달용 문서**
- 저장소: `limbit95/limbit95.github.io`
- integration: `feature/game-platform-vnext-integration`
- 고정 판단 SHA: `aabb7646c0cdfd6466f2195579dce54689c7b81c`
- 기록 상태 보존: **STEP4B COMPLETED / STEP5A NOT_STARTED / 행동 시험 NOT_RUN / vNext main 미반영**
- 이번 수행: 입력 두 문서 실제 읽기 → 지정 순서 상태 복원·원격 대조 → 결론에 필요한 제한적 source 확인 → 핵심 판단·전달 파일 작성.
- 이번 미수행: 저장소 파일 변경, branch/PR/checkpoint/commit 생성, 구현·실제 시험·외부 재조사·운영 변경·구매·문의·job/dump/복원·병합/main 반영·STEP5B 이후 착수. 입력 원본은 보존했다.

## 1. 결론과 문서 지위

**책임 단위 재사용을 기본으로 하되, vNext에 없는 채택·복구·실행 수명 책임만 새로 보완한다. 기존 Auth와 게임은 이관하지 않는다.** Registry, Room 형식 검사, Invite의 token/envelope/route, Shell 표시 부품, 사이트 BGM 본체를 각각 의미가 맞는 범위에서 재사용한다. 파일 전체의 재사용 또는 전면 재작성 중 하나를 고르지 않는다.

Codex안의 큰 경계는 유지한다. 다음 네 부분을 명확히 수정한다.

1. **Registry:** Core의 등록·구성 책임 추가가 두 번째 사이트 metadata 목록을 만드는 근거가 되지 않는다. 같은 게임 식별과 표시 정보의 출처는 중복 소유하지 않는다.
2. **Snapshot/Reconnect:** 새로 필요한 것은 선택 모델의 단일 채택·동기화·복구 책임이다. 기존 coordinator의 기능 전부를 별도 엔진으로 다시 만드는 승인도, 기존 coordinator 밖에 두 번째 권위 상태 관리자를 붙이는 승인도 아니다.
3. **Invite:** 비room 초대는 현재 필수 consumer로 확인되지 않았다. 미래 미선택 대상으로 제한해 보류하며 STEP5A 전체 blocker로 삼지 않는다. room 초대의 얇은 연결은 가능하지만, 현재 본체 내부의 늦은 DOM 완료와 동적 handler 교체 안전성을 Adapter가 저절로 해결한다고 보지 않는다.
4. **BGM:** 최소 보완 책임은 판단할 수 있다. controller가 최신 재생 의도·종료 상태와 자기 작업의 완료를 소유해야 한다. 이 설계 선택 자체를 막연히 보류하지 않는다. 다만 **무보완 controller의 vNext 수명 적합성·사용 가능 판정은 보류**한다. 실제 browser 동작은 NOT_RUN이고 새 audio engine은 필요하지 않다.

이 문서는 STEP5A 핵심 판단 제출물이다. 정식 저장소 산출물 작성, STEP5A 완료, 사용자 승인, vNext 지원 완료를 선언하지 않는다. ‘그대로 연결’도 특정 기능의 재사용 선택이며 현재 실행 지원 보증이 아니다. 소스 읽기·논리 대입·기존 테스트 범위의 재사용을 행동 시험 PASS로 바꾸지 않는다.

## 2. 입력과 상태 복원

### 2.1 실제로 읽은 입력

| 입력 | 식별 | 적용 |
|---|---|---|
| `game-platform-vnext-step5a-evidence.md` | `libfile_c163b692e0c4819191700916162e6642` | Sol 역할 근거·consumer/test trace 재사용. 승인 선택표가 아님 |
| `game-platform-vnext-step5a-judgment-and-handoff.md` | `libfile_cf97e82dfaf881918679e75984003a1c` | Codex 판단안·정정·§9 전달 프롬프트 전체 적용. 실제 Astra 결과나 사용자 승인으로 간주하지 않음 |

입력 정정 세 가지를 계승한다. ‘알려진 만료 전 A 금지’는 **‘알려진 만료 뒤 새 A 금지’**, Room 심볼은 `defineRoomLobbyAdapter`, The Game/Liar BGM의 N 표기는 inventory 미수록이 아니라 추가 본문 확인이다. 원본을 수정하지 않았다.

### 2.2 지정 순서로 직접 복원한 결과

실제 읽기 순서는 **AGENTS → 루트 실행 계획 → rebuild README → CURRENT → CP0078 → PR412/413 → 원격 integration ref**였다. 고정 SHA의 문서와 현재 원격 상태를 구분했다.

| 항목 | 직접 확인 결과 |
|---|---|
| AGENTS | blob `2686a3c37502bbf1f7f2a9407640e78cc026dadb`. vNext는 integration 기준이며 현 사용자 지시의 저장소 밖 판단 범위 적용 |
| 실행 계획 | 개정 **1.5**, blob `da353e2e64daef6b1b0b7267c21997bfd7cda4ed`. §5 STEP5A 범위·무이관·STEP6 전 구현 금지 확인 |
| README | blob `2e12850f8c1209bb6113d4bacbe49936e05cf057`. CP0077 안내는 당시 이력이고 CURRENT/CP0078·실제 PR과 함께 판독 |
| CURRENT | blob `012a9769c64e26d08288c44c09eff8f0fdeef3f7`. STEP4B COMPLETED, STEP5A NOT_STARTED, NOT_RUN·오픈 의무 유지 |
| CP0078 | blob `d66a7f22847491d0e3387d265c91609151a1129b`. PR412 병합 확인; PR413 대기는 기록 작성 당시 상태 |
| [PR412](https://github.com/limbit95/limbit95.github.io/pull/412) | 실제 merged=true; 승인 head `3e105be42f4dbcdf0875486bd8f0e5d38bcd1d1a`; merge `32429a20f76a7fde6733db384fa067fbcd7307d1` |
| [PR413](https://github.com/limbit95/limbit95.github.io/pull/413) | 실제 merged=true; head `d19f268ee56fad6ff1fd9d79ab3f27148f0224cd`; merge는 고정 판단 SHA |
| 현재 원격 integration HEAD | `aabb7646c0cdfd6466f2195579dce54689c7b81c` — 고정 판단 SHA와 동일. 조회 시점 추가 변경 없음 |
| main | 기존 근거·CURRENT의 `69a7fcb268df0d2eb9b4fd2f1f8e418fe4fe1a09` 및 vNext 미반영 상태를 계승. 이번에 main ref를 새로 조회·동기화하지 않았으며 현재 main HEAD를 새로 검증했다고 주장하지 않음 |

CURRENT의 ‘STEP5A 진행 승인 미수행’은 저장소 기록 상태다. 이번 사용자의 §9 실행 지시로 저장소 밖 핵심 판단은 수행했지만, 이를 정식 STEP5A 착수 기록·branch/PR 생성 허용으로 확대하지 않는다. 과거 HOLD·검토 대기는 당시 이력으로 읽고 CP0075/D0010의 부분 대체를 적용한다.

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

## 5. 중복 방지 기준

| 기준 | 적용 판단 |
|---|---|
| 동일 본체의 판정 | 입력·권위·출력·실패·수명 의미가 같은 기능을 여러 곳에서 유지하면 중복이다. 파일명이나 wrapper 개수만으로 판단하지 않음 |
| metadata 출처 | 같은 ID/표시/route의 권위 출처를 두 군데 만들지 않는다. Core 실행 구성은 catalog의 복제본이 아니라 다른 최소 책임 |
| 최종 채택자 | 한 실행/model의 권위 상태·ordering·fresh LIVE·복구 deadline 최종 소유자는 하나. Snapshot/Reconnect/Access Adapter가 각각 독립 상태기를 소유하지 않음 |
| 정상 local 연결 | game ID·nickname/인원 정책·game join·DOM·곡/mode·게임 이벤트 연결은 허용. 도메인·표현은 local 유지 |
| Adapter 상한 | 형태/환경/설정 연결 및 기존 수명 계약의 소비까지. 새 권한·ordering·reconciliation·독자 수명 엔진이 필요하면 해당 owner의 신규 책임으로 명시 |
| 공통 보완 | Invite 등록/표시와 BGM 내부 수명 공백은 원래 공통 본체의 최소 보완 또는 입증 가능한 격리로 해결. 게임마다 수정 복제본을 만들지 않음 |
| 새 책임의 필요성 | 기존 기능이 없거나 의미가 달라 연결만으로 G1~5를 충족하지 못하는 지점을 밝힌다. ‘미구현’만으로 전체 새 엔진을 정당화하지 않음 |
| 현재/신규 병존 | 기존 import/API/RPC·게임 동작은 유지하고 신규 consumer만 새 선택 모델을 소비. 같은 consumer 안의 이중 권위 상태와 이중 파괴권은 금지 |
| 승격·동결 | 실제 반복·필요 근거 없는 Profile/범용 Shell/Sound engine을 만들지 않는다. 경로·클래스·공통 필드·수명 기법 동결은 STEP6 범위 |
| 기존 영향 절차 | 향후 CURRENT/shared 계약 실제 변경에는 기존 Governance의 영향 확인을 적용. MIGRATION_REQUIRED면 기존 게임 이관 대신 vNext 격리 재검토. 이번에 별도 감사 단계를 추가하지 않음 |

## 6. 소프트웨어 owner와 호환·수명·검증 책임

작업 모델(Astra/Sol/Codex)과 아래 소프트웨어 owner는 서로 다른 개념이다. Core가 공통 수명 토대를 제공해도 game/model/backend의 의미까지 대신 판정하지 않는다.

| 소프트웨어 owner | 소유 책임 | 소유하지 않는 책임 | 호환·후속 검증 책임 |
|---|---|---|---|
| Core | 최소 identity/discovery·구성·실행 수명·공통 오류/정리 규약 | 보편 Room/DOM/host/ready, model ordering·서버 권한 | 부분 초기화·재진입·dispose 후 재활성화 방지·이전 owner 정리·기존 등록 경계 |
| runtime/model | session/match/view 의미·최종 상태 채택·ordering·초기/live·quiet loss·복구/terminal | 사이트 인증 본체·공개 catalog 정책·게임 규칙 | T01~03 모든 완료, 동기화/복구5초·최초60초, old finally/leave, 권한 맥락 변화 |
| capability | Invite 등 선택 기능의 의미·적용 조건·자기 작업/자원 수명 | 존재하지 않는 기능의 지원 표시·독자 인증·게임 도메인 | 부적합 대상 거부·기능 미선택·현재 owner의 완료/실패·의미 호환 |
| Site Adapter 및 연결한 사이트 utility owner | 기존 Auth·metadata/route·Invite handler/entry·BGM 연결. 사이트 자원의 실제 공용 owner 연결 | 새로운 token/audio/권한/복구 엔진을 Adapter 내부에 은닉 | 생성→입장 식별, 구독/등록/DOM 완료, 공용 자원 보호. Invite/BGM 공통 본체 최소 보완의 호환 책임 |
| game-local | 게임 규칙/도메인·콘텐츠·UI·game join 정책·곡/mode·얇은 설정 | 공통 본체 복제·수명/권한 우회·공용 자원 파괴 | 기존 게임·디자인·정책 보존, 채택된 결과만 연출/소리·후속 작업 실행 |
| backend | authoritative state·실제 authorization/private view·A/C/P·중복·owner fencing | client Gate에 보안 전가·late C를 새 P 허가로 해석 | 실제 transaction·lock/fresh predicate·전체 writer/최종 sender 경계·관측 oracle·기존 caller 호환 |

실행 검증 책임은 담당 구현자가 해당 owner별 증거를 제출하는 것이다. 소프트웨어 owner를 지정했다고 담당자·배포 환경·시험 수행이 이미 확보됐다고 말하지 않는다.

## 7. Codex안 유지·수정·보류와 이유

| 핵심 항목 | Astra 처리 | 이유·차이 |
|---|---|---|
| 기존 Auth/게임 무이관, 책임 단위 분류 | **유지** | 계획·STEP4A/4B와 일치. 현재 게임을 새 모델 기준으로 삼거나 고칠 필요 없음 |
| Registry metadata와 실행 구성 분리 | **유지 + 좁힘** | 새로운 최소 책임은 필요. 두 번째 catalog/새 Registry 전체 제작은 불필요한 중복이므로 명시 제외 |
| Access/Room 새 owner·권한 책임 | **유지** | 기존 형식 검사·진입 Gate만으로 현재 맥락·서버 A/P를 충족 못 함 |
| Snapshot 신규 구현 | **유지 + 범위 보정** | 선택 모델의 누락 책임을 추가한다. 전체 coordinator 재작성 의무로 확대하지 않고 utility/알고리즘 재사용 가능성을 유지. 내부 최종 채택자는 하나 |
| Reconnect trigger와 복원 분리 | **유지** | browser 신호는 복구 요청일 뿐. Snapshot과 같은 모델 owner로 합침 |
| Invite room 본체 재사용 | **유지 + 조건 강화** | 양끝 identity 일치 외에 entry/dispatch·등록·dialog 내부 완료까지 수명 소비 필요. 얇은 Adapter만으로 내부 late completion이 해결됐다고 하지 않음 |
| Invite 비room 보류 | **수정** | 구체 현재 필수 consumer가 확인되지 않음. 미래 미선택 범위로 제한하고 현재 설계 결론의 blocker에서 제외 |
| BGM controller 수명 보류 | **수정** | 최소 보완 owner·안전 의미는 지금 정할 수 있음. 설계 선택을 계속 보류할 필요는 없음. 무보완 연결의 적합성·실제 browser 지원만 보류 |
| BGM success 경합 | **보완** | catch/finally·재진입·새 play/track 의도·소유 Audio 정리까지 포함. 실제 소리 현상은 미확인으로 남김 |
| Shell 부품별 재사용·local 표현 | **유지** | 선택적 표시 부품이면 충분. 보편 Room/DOM Shell을 Core로 올리지 않음 |

### 보류 항목의 해소 기준·담당·시점

| ID·범위 | 보류하는 것 | 해소에 필요한 근거 | 담당 owner/작업 모델 | 후속 시점 |
|---|---|---|---|---|
| H1 BGM | 무보완 controller의 vNext 수명 포함 사용 가능 판정 | 최신 의도/종료/완료 귀속의 최소 공통 보완 또는 동등 격리, 기존 API·동작 보존, 경합 시험 | 사이트 BGM 본체 owner + Site Adapter; 허용 단계의 구현 담당 Sol/Codex | STEP6에서 경계/검증 계획을 구체화한 뒤 허용된 STEP7D 연결 구현·실제 browser 검증. 지금 구현 금지 |
| H2 Invite dynamic handler | old disposer/new registration 충돌 가능 상태의 그대로 사용 | 안정적 단일 사이트 등록이라는 실제 조건 또는 소유 확인이 있는 최소 공통 보완; 교체/dispatch 경합 증거 | 사이트 Invite 등록 owner + Site Adapter | consumer 연결 설계 구체화 및 허용된 STEP7D 구현. 동적 교체가 없다면 불필요한 등록 엔진 추가 안 함 |
| H3 Invite dialog | 무보완 내부 늦은 DOM/오류 완료를 vNext 수명 적합으로 인증 | 실행별 dialog 귀속, current UI를 건드리지 않는 내부 완료 보호/동등 격리, destroy/QR/copy/share 경합 검증 | 사이트 Invite 표시 본체 owner + view owner | 허용된 연결 구현/DOM 시험 시. 최소 보완 방향은 STEP5A에서 판단 가능 |
| H4 비room Invite | 의미가 다른 미선택 대상의 지원 | 실제 consumer가 기능을 선택한 근거·target/admission 의미·기존 token/route 본체 호환 검토 | capability·세션 model·backend·Site Adapter; 필요 시 Astra 경계 판단 | 해당 요구가 실제 선택될 때 관련 설계로 복귀. 현재 전체 단계를 막지 않음 |

H1~H3는 재사용 방향·owner 선택을 미루는 표가 아니라 **현재 무보완 사용을 허용하지 않는 제한**이다. 구현 전 최소 보완이 기존 소비자와 양립 불가능한 것으로 드러나면 해당 연결만 재검토한다. 이것을 실제 시험 전까지 모든 STEP5A 판단이 불가능하다는 포괄 HOLD로 확대하지 않는다.

## 8. 설계 공백·실행 의무·사용자 승인

### 8.1 구분

| 종류 | 현재 판단 | 다음 처리 |
|---|---|---|
| STEP5A 책임 선택을 막는 필수 설계 공백 | 이번 제한적 근거에서는 **추가 필수 공백을 확인하지 못했다**. 전면 지원을 증명한 뜻은 아님 | 이 문서의 owner·최소 보완 방향·조건부 재사용을 사용자 검토에 제출 |
| 구체화가 남은 사항 | vNext 등록 표현·실제 consumer별 구성·Invite entry 연결 방식·BGM/Invite 내부 수명 기법·물리 경로/API | STEP6 등 원래 허용 순서에서 구체화. 새로운 감사/재조사 단계로 만들지 않음 |
| 미래 미선택 범위 | 비room Invite·불필요한 보편 Shell·새 audio engine | 실제 요구가 생길 때만 검토. 현재 지원으로 표시하지 않음 |
| 실행 검증 의무 | 실제 backend 권한·A/C/P·동기화·복구·DOM/audio·기존 게임 회귀 | 모두 **NOT_RUN**. 구현/실행/오픈 게이트에서 증거 제출 |
| 환경·운영 전제 | STEP4B의 실제 제품/계정·설정·성능·비용·삭제/복구 등 UNKNOWN/조건부 사항 | 기존 owner·게이트를 유지. 이번에 외부 조사나 운영 작업을 재개하지 않음 |

최소 보완의 존재를 가정하고 지원 PASS로 미루지 않는다. §4와 §7은 **무엇을 어느 본체가 보완해야 하며 무보완 연결은 허용하지 않는지**를 정한다. 후속 구현에서 그 방법이 성립하지 않으면 해당 설계로 돌아간다. 시험은 이 설계를 입증할 의무이며 빠진 책임 결정을 대신하지 않는다.

### 8.2 후속 검증 묶음 — 전부 NOT_RUN

| 대상 | 기존 읽기 근거의 한계 | 필요한 후속 증거 |
|---|---|---|
| Registry | 조회/flag 테스트는 metadata 의미 범위 | ID/route 일치·중복 source 없음·미지원 표시·신규 구성과 기존 목록 호환 |
| Access | mocked Auth/구독 해제만으로 실제 권한 freshness 미입증 | 초기화 지연·user/role/view 전환·기존 Auth 유지·서버 철회/expiry/최종 P |
| Room | mapping/정적 SQL·구독/leave 테스트는 실제 DB 집행과 다름 | 중복/경합·late leave·owner anchor·실제 caller/권한·기존 게임 회귀 |
| Snapshot | coalescing/낮은 version/일부 rematch 테스트는 전체 완료 경로 아님 | T01~03 전 경로·equal version/view·handoff·quiet loss·현재 권한 복구 |
| Reconnect | 이벤트 refresh/stop은 최신 LIVE 증거 아님 | 각 정상망 복구5초·readiness·오류·late completion·최초60초·terminal |
| Invite | envelope/same-origin·token join·e2e 소스 읽기만 재사용 | 전 구간 identity/admission·expiry/revoke·old disposer·QR/copy/share 완료·기존 legacy 연결 |
| Shell | pure state/static wiring만으로 실제 view 수명 미입증 | DOM/mobile·mount/정리·표시 정확성·roomless 미선택·기존 디자인 |
| BGM | fake Audio 정상 경로와 실제 autoplay/BFCache는 다름 | pending success/reject/finally·pause/play/destroy/track 경합·공유 owner·실제 browser·기존 음량/정지/곡 정책 |

STEP4B의 100명/판8·원격 p95 250ms·각 재연결5초·모바일 요구·세금 포함 월 추가3만원·기록 열람/30일 삭제/탈퇴 unlink·외부 백업/RPO24h/발견 후24h/7일 복구점·기존 운영 조건은 변경하지 않는다. 이번 소스 판단으로 실제 계정 잔여·미래 부하·실청구 UNKNOWN이나 오픈 blocker를 닫지 않는다.

### 8.3 사용자가 검토·승인할 항목

1. §4의 책임 단위 선택과 **기존 Auth/게임 무이관·재사용 우선** 원칙.
2. Registry metadata 중복 금지와 Snapshot/Reconnect의 **단일 선택 모델 채택·복구 책임**.
3. Invite의 전 구간 identity·사이트 등록/표시 owner, H2/H3 제한, H4를 미래 미선택 범위로 두는 판단.
4. BGM 본체 재사용과 **controller 내부 최소 수명 보완 책임**, H1의 제한적 보류. 새 audio engine·Core 승격 미승인.
5. §5~8의 중복 기준·소프트웨어 owner·미확인/검증 의무와 정식 문서 반영 방향.

이 판단 결과의 승인은 저장소 수정·branch/PR 생성·STEP5A 완료·병합·구현·시험·STEP5B 이후·main/오픈 허용과 별개다. 사용자가 정식 반영을 함께 명시하는 경우에만 그 명시 범위를 다음 작업에 적용한다. CP0075/D0010의 이미 승인된 정책을 다시 선택하도록 요구하지 않는다.

## 9. Source trace와 추가 읽기 범위

모든 repository source는 고정 SHA 기준이다. 기본 URL은 `https://github.com/limbit95/limbit95.github.io/blob/aabb7646c0cdfd6466f2195579dce54689c7b81c/`이며 아래 경로를 잇는다. ID는 이 문서 내부 참조다. ‘직접’은 이번에 본문을 다시 읽은 항목, ‘재사용’은 실제로 읽은 두 입력의 source/consumer/test 근거를 사용한 항목이다. 재사용을 이번 직접 전수 감사로 표기하지 않는다.

| ID | 경로·blob | 위치·적용 | 방식 |
|---|---|---|---|
| E | `game-platform-vnext-step5a-evidence.md` §3~6 | 기존 consumer·test source·57개/681개 blob 동일성 조사 범위 | 입력 직접 읽기, 그 조사 결과 재사용; 이번 681개 전수 읽기/대조 아님 |
| R1 | `games/shared/registry.js` · `afa4ba25824157534eca7ca7538b89571cfca30e` | defineGame/GAME_REGISTRY/list/get; metadata와 실행 구성 차이 | 직접 |
| A1 | `games/shared/accessGate.js` · `4803cd8fd141c98d97bd6357243a9f955843d6cc` | resolveApprovedMemberAccess/createGameAccessGate; `js/auth.js` 연결 | 재사용 |
| Rm1 | `games/shared/roomLobbyContract.js` · `4d037bd1b56715aae631220d1c848bc521a56ce0` | defineRoomLobbyAdapter·8개 함수 검사; 두 게임 adapter/controller | 재사용 |
| S1 | `games/shared/snapshotCoordinator.js` · `069f49aa23cfb2c5d591cafaed523fa358c78ba1` | snapshotVersion/runRefresh/refresh/start/stop/dispose | 직접 |
| Rc1 | `games/shared/reconnectRefresh.js` · `f96be29314ae0079c0f5db9ba9c9e8cbfb7934e4` | requestRefresh/start/stop; 두 controller 연결 | 재사용 |
| I1 | `games/shared/gameInvite.js` · `4d4b667e85162b19fb4e1607bfcc094a1bd4556d` | requirePlatformInviteGame/create/parse/resolve/destination | 직접 |
| I2 | `js/invites/inviteEntry.js` · `f5438286f61c880fcdb428108ab9cfa9b4339941` | 두 handler 등록·boot/auth/resolve/dispatch·기본 Registry | 직접 |
| I3 | `js/invites/inviteRegistry.js` · `0c2c8473656245ac3990a8d97868647ec60485bf` | registerInviteHandler/dispatchInvite | 직접 |
| I4 | `js/invites/inviteShare.js` · `f1d370c83cbcbcabcf405b3544e3ba1129d69203` | renderInviteQr/copy/share/createInviteShareDialog/open/destroy | 직접 |
| Sh1 | `games/shared/gameShell.js` · `298ab13998662aafa0efea35d32824f85e84e18e`; `gameShellState.js` · `1f068aa14348b166b13c34e50daf2c5698db2914` | 표시 부품·createGameShell·pure state | 재사용 |
| B1 | `js/game-audio/bgmController.js` · `4757a1de3477dbebe44f2dd49b7071eb8b03d9c2` | tryPlay/pauseByUser/playByUser/switchTrack/subscribe/destroy | 직접; player/preferences/catalog/각 게임 wrapper는 E 재사용 |
| G-L | `docs/game-platform-rebuild/artifacts/step-4a-lifetime-contract.md` · `5e40988234caba6cb605ea4c0b386a0a5b83b9c5` | §5~8 전체 완료·owner·T01~03·현재 재검증 예외 | 직접 |
| G-B | `docs/game-platform-rebuild/artifacts/step-4a-responsibility-boundaries.md` · `610efc904bdaec8881535d3405fe81102bd3d5df` | Core/model/capability/Site/local 책임 | 입력 근거 재사용 |
| G-S | `docs/game-platform-rebuild/artifacts/step-4b-runtime-sync-contract.md` · `a6cfe51029e3fc3b2b546222b6a6afb0ad428f14`; `step-4b-security-site-contract.md` · `e140c90d830ff891c2abd5e40b038249eeeb8ebf` | 현재 CP0074/0075 적용·동기화/권한 | 입력 근거 재사용 |
| G-C | `docs/game-platform-rebuild/artifacts/step-4b-z1-decision-and-design-closeout.md` · `f3232f64c846bf4b17fcea2ae0bf6baed90ffc03` | §2 A/C/P·§3 oracle·설계/실행 구분 | 직접 |
| G-D | `docs/game-platform-rebuild/DECISIONS.md` · `ab4896bd01b591895d0e30946a810c41eaa74e5a` | D0006~10 유효 대체 관계 | 입력 근거 재사용 + 계획1.5/G-C 직접 대조 |

추가 읽기 이유는 Registry 중복 범위, coordinator의 실제 내부 채택 책임, Invite 생성/entry 비대칭·내부 완료, BGM pending play의 보완 owner, G-L/G-C 해석을 확정하는 데 한정했다. 공급자·가격·운영 정책 외부 조사, 기존 전체 inventory 재조사, 별도 사후 감사는 하지 않았다. 저장소 소스 조회는 변경·실행 작업이 아니다.

## 10. 다음 첫 작업 하나·담당 모델·전달 프롬프트

**지금 다음 첫 작업 하나는 사용자가 이 Astra 판단 결과와 승인 범위를 검토하는 것이다.** 승인 뒤 후속 작업 모델은 **Sol/Codex**, 작업은 **승인된 판단을 STEP5A 정식 문서로 반영**하는 것이다. 동일 핵심 판단을 다시 Astra에게 맡기는 별도 사후 감사 단계는 추가하지 않는다. 새로운 의미 충돌이 드러날 때만 해당 항목을 Astra에게 되돌린다.

아래 프롬프트는 결과 승인과 저장소 문서 반영을 함께 허용하려는 경우에만 복사해 사용한다. **이 문서가 존재하거나 판단만 승인됐다는 이유로 아래 권한이 이미 부여된 것은 아니다.** 이 프롬프트를 실제로 보내면 그 안에 명시된 문서 branch/PR 작업을 허용하지만 병합·구현·시험·다음 STEP은 허용하지 않는다.

```text
Game Platform vNext STEP5A의 Astra 핵심 판단 결과를 승인하고, 승인된 판단의 정식 문서 반영만 진행해줘.

담당 모델: Sol/Codex. Astra 핵심 판단을 다시 수행하거나 별도 사후 감사 단계를 추가하지 마.

입력 세 개를 실제로 읽어줘:
1. game-platform-vnext-step5a-evidence.md — Sol 근거, 최종 선택표 아님.
2. game-platform-vnext-step5a-judgment-and-handoff.md — 앞선 Codex안/정정, Astra 결과보다 우선하지 않음.
3. game-platform-vnext-step5a-astra-judgment.md — 실제 Astra 판단. §4 선택표, §5 중복 기준, §6 owner, §7 제한적 보류, §8 검증/승인 조건을 보존.

저장소 limbit95/limbit95.github.io, integration feature/game-platform-vnext-integration.
판단 기준 SHA aabb7646c0cdfd6466f2195579dce54689c7b81c.
AGENTS → 계획1.5 → rebuild README → CURRENT → CP0078 → PR412/413 순서로 필요한 상태를 복원하고 원격 HEAD와 대조해줘. 이미 읽고 확인된 근거는 재사용하고 새 변경·충돌만 분리해줘.

이번 명시적 허용 범위는 승인된 STEP5A 판단의 정식 문서 작성·문서 정합성 검증·기록·원격 제출이다. 유효한 미완료 STEP5A branch/PR이 있으면 이어가고, 없으면 승인된 integration에서 game-platform-vnext 계보의 별도 STEP5A 문서 branch를 만들어 integration base의 검토용 PR을 제출해도 된다. integration/main 직접 commit은 하지 마.

공통 모듈 선택표, 중복 방지 기준, 호환/수명/검증 owner와 필요한 CURRENT/README·작업 기록/checkpoint만 정식 반영해줘. 새로운 결정 기록이 필요하면 승인된 판단과 대체 관계만 기록하고 기존 결정·과거 checkpoint·세 입력 원본을 재작성하지 마. 실제 파일명/구성은 현 문서 관례를 따르며 STEP6의 구현 경로/API 동결로 확대하지 마.

특히 Registry의 두 번째 metadata 목록을 만들지 않고, Snapshot/Reconnect는 하나의 선택 모델 최종 채택·복구 책임으로 유지해줘. Invite는 전 구간 identity·사이트 handler/dialog owner를 보존하고 비room 초대는 미래 미선택 범위로 두어 전체 blocker로 올리지 마. BGM은 기존 본체 재사용과 내부 최소 수명 보완 방향을 반영하되 무보완 연결을 사용 가능으로 표시하지 마. Invite/BGM 보완을 얇은 Adapter 안의 새 엔진으로 숨기지 마.

기존 Auth·게임 무이관, STEP4A 전체 완료 경로/T01~03, CP0075/D0010의 알려진 만료 뒤 새 A 금지·동일 transaction late C 제한 수용·새 P/retry 인가·owner anchor·최초60초·terminal 보호를 유지해줘.

검증은 판단 원문과 정식 반영의 의미/조건/보류 일치, source trace·링크·표·상태·허용 diff와 원본 보존 등 문서 검증만 수행해줘. source/tests가 존재한다는 이유로 행동 PASS·지원 완료를 선언하지 마. 행동 시험 NOT_RUN·기존 구현/실행/오픈 의무와 UNKNOWN을 유지해줘. 정식 산출물 제출은 REVIEW_PENDING이며 사용자 최종 결과 검토가 남았는데 STEP5A COMPLETED로 바꾸지 마.

이번에는 runtime/게임/shared/SQL/운영 구현·실제 행동 시험·외부 재조사·운영 변경·구매·문의·job/dump/복원·병합·main 반영·STEP5B 이후 작업을 하지 마. PR 생성·제출 허용은 integration 병합 승인이 아니며 main은 별도 게이트다.

실제 변경 파일·문서 검증·미실행 항목·PR base/head·원격 보존·남은 조건·다음 첫 작업을 보고하고 멈춰줘. 기존 승인으로 해소할 수 없는 새로운 의미 충돌만 구체적으로 보고하며 임의의 새 조사/감사 단계를 만들지 마.
```

판단 제출 및 전달 문서 작성 뒤 이번 작업을 종료한다. 후속 프롬프트를 실행하지 않았다.
