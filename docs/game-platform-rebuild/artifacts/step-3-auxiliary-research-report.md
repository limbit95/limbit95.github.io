# STEP 3 — 미래 게임 Stress Test 보조 조사 보고서

**조사 기준일:** 2026-10-01  
**입력 기준:** 계획 1.3 / 기준 SHA `177533f97bddf67c95379cfa34dc58f2ccdf9e1c`  
**역할:** Work Astra 판단을 위한 외부 공식 근거 조사  
**판정 범위:** 정식 matrix 판정 없음 / Core 책임 확정 없음 / 계약 확정 없음 / 구현 지원 판정 없음

입력 자료가 요구하는 STEP 3 대상은 11개 미래 게임 사례와 6개 전환·실패 시나리오이며, 특히 Q01~Q06의 기술 특성 조사가 이번 보조 조사 범위다.

---

## 1. Q01~Q06 핵심 조사 결과

### Q01 — authority / transport / prediction / rollback / correction

외부 사례를 보면 이 개념들은 하나의 배타적인 enum으로 취급하기 어렵다.

Nakama는 같은 실시간 multiplayer 안에서도 **relayed**와 **server-authoritative**를 구분한다. Relayed에서는 Nakama 서버가 데이터를 전달하지만 내용의 정확성을 판단하지 않는 반면, authoritative에서는 서버가 gameplay data를 검증하고 상태 변화를 계산·전파한다. 따라서 적어도 이 제품 사례에서는 **“서버를 경유한다”는 transport 사실과 “서버가 최종 상태를 판단한다”는 authority가 동일 개념이 아니다.**

GGPO는 rollback networking을 위해 입력 예측과 speculative execution을 사용하고, 과거 game state를 저장·복원한 뒤 simulation frame을 다시 실행할 수 있어야 한다고 설명한다. 반면 Unreal Engine 5.8의 Character Movement는 클라이언트가 movement를 예측하고 saved move를 보관하며, 서버의 correction이 도착하면 해당 correction을 적용하고 move를 다시 재현하는 구조를 문서화한다. 즉 **prediction → rollback/replay → correction**은 서로 관련될 수 있지만 같은 의미는 아니다.

따라서 외부 근거로 확인 가능한 수준은 다음과 같다.

| 개념 | 확인된 의미 | 주의점 |
|---|---|---|
| transport / relay | 데이터를 상대에게 전달하는 경로 | 전달 서버가 반드시 gameplay authority인 것은 아님 |
| authority | 상태·입력의 유효성 또는 최종 상태를 결정하는 주체 | 서버/클라이언트/객체별 권위 모델은 제품마다 다름 |
| prediction | 최종 정보가 오기 전에 예상 입력/상태를 사용해 진행 | prediction 자체가 rollback을 필수화한다고 일반화할 수 없음 |
| rollback | 과거 state로 복원하고 simulation을 다시 실행하는 방식 | determinism·state serialization 등 추가 조건이 필요한 사례가 있음 |
| correction | authoritative 결과와 차이가 있을 때 현재 상태를 수정 | 전체 세계 rollback과 동일한 방식일 필요 없음 |

**보조 조사 결론:** STEP 2에서 authority·전달·prediction·rollback·correction을 동일 분류 수준의 단일 enum으로 만들지 않은 방향은 외부 사례와 모순되지 않는다. 다만 이것은 현재 프로젝트 계약이 해당 조합을 지원한다는 판정이 아니다.

---

### Q02 — reconnect / state reconstruction / event replay

세 가지는 분리해서 보는 근거가 강하다.

Photon Realtime 5의 `ReconnectAndRejoin`은 기존 room으로 다시 들어가기 위한 기능이며 `PlayerTTL` 같은 유지 조건을 필요로 하고, room이나 player record가 사라졌다면 재입장 자체가 실패할 수 있다. 즉 **connection recovery 자체가 gameplay state/event recovery를 보장하지 않는다.**

Photon PUN의 event cache 문서는 일반 event의 경우 **late joiner가 과거 event를 놓친다**고 명시하고, cache한 event만 joining player에게 먼저 재전송한다. 이는 event replay가 별도 메커니즘임을 보여준다.

반대로 Apple GameKit turn-based match는 Game Center가 `matchData`, participant, current participant, match status 등을 보관하고 사용자가 다시 최신 match data를 가져올 수 있게 한다. 이는 event history 전체를 재생하지 않고 **현재 durable state를 다시 읽어 gameplay를 재구성하는 패턴**의 공식 사례다.

따라서 최소한 다음 세 질문은 분리해야 한다.

| 질문 | 외부 사례에서 확인된 별도 문제 |
|---|---|
| 연결을 다시 맺을 수 있는가 | reconnect/rejoin |
| 현재 게임 상태를 다시 만들 수 있는가 | persisted/current state load |
| 끊긴 동안의 event를 모두 다시 받을 수 있는가 | event caching/replay/history |

**미확인:** 청파 같이의 현재 browser 복귀 refresh가 어느 수준까지 보장하는지는 입력 자료에 적힌 저장소 근거 이상으로 확대할 수 없다. 입력 자료 역시 현행 reconnect utility를 durable stream replay 구현으로 표시하지 말라고 제한한다.

---

### Q03 — rollback 재실행과 부수효과 중복

GGPO Developer Guide는 이 문제를 매우 직접적으로 다룬다.

GGPO에서 rollback이 발생하면 game simulation의 advance callback이 여러 차례 호출될 수 있으므로, **rollback 중 발생하는 effect와 sound는 rollback 완료 뒤까지 지연해야 한다**고 명시한다. 또한 video/audio renderer 같은 요소를 simulation game state와 분리하라고 요구한다.

따라서 다음 사실은 확인 가능하다.

| 항목 | 확인 상태 |
|---|---|
| simulation frame이 rollback 중 재실행될 수 있음 | 확인 |
| 동일 frame 재실행으로 sound/effect가 반복될 위험이 있음 | 확인 |
| presentation side effect를 simulation state와 분리하는 사례 | 확인 |
| 점수·보상·영구 progression을 언제 확정해야 하는가 | 이번 자료만으로 미확인 |
| 현행 `client_action_id` 중복 방지와 rollback side-effect 방지가 동일 책임인가 | 미확인 |

특히 **RPC retry 중복 방지 = rollback 중 결과/보상 중복 방지**라고 볼 외부 근거는 발견하지 못했다. 두 현상이 일부 idempotency 개념을 공유할 가능성은 있지만 동일 계약이라는 판단은 Astra에 남겨야 한다.

---

### Q04 — spectator / 역할 전환 / late join / private 정보

Nakama의 authoritative match runtime은 join callback에서 새 참가자에게 initial state를 보낼 수 있으며, `broadcast_message`의 수신자를 전체 참가자가 아닌 **특정 presence 집합으로 제한**할 수 있다. 따라서 역할 또는 사용자별로 다른 state를 전송하는 메커니즘 자체는 일반적인 서버 모델에서 가능하다.

Unity Netcode 역시 server가 client별 NetworkObject visibility를 판단하며, 특정 client에게 object를 숨기면 해당 client가 object를 despawn하고 이후 해당 object의 network traffic도 받지 않도록 하는 기능을 제공한다. 이는 **UI에서 숨기는 것과 애초에 network data를 제공하지 않는 것을 구분할 수 있는 공식 사례**다.

Photon의 late-join 자료는 event와 durable/current state도 구분한다. 과거 RPC/event만으로 표현한 상태는 late joiner가 받지 못할 수 있으므로, 계속 존재해야 하는 정보는 replicated/networked state 등에 별도로 남겨야 한다는 사례가 있다.

그러나 아래 문제는 외부 제품의 visibility 기능만으로 해결됐다고 볼 수 없다.

**참가자 상태에서 private response를 요청 → 관전자로 전환 → 이전 요청의 private response가 뒤늦게 도착**하는 경우다.

새로운 role 기준의 서버 전송 정책과 별개로 이미 비행 중인 response, client cache, async callback의 lifetime을 어떻게 폐기할지는 별도 문제다. 이것이 현재 플랫폼에서 어떤 generation/viewer identity로 표현되어야 하는지는 **미확인**이다.

---

### Q05 — audio / input / render / simulation / physics / network time

외부 공식 자료는 이 시간축들을 분리해 취급한다.

W3C Web Audio API 1.1의 `AudioContext.currentTime`은 audio rendering graph 자체의 time coordinate이며, 다른 system clock과 동기화되어 있지 않을 수 있다고 명시한다. `baseLatency`와 `outputLatency`도 별도 값이다. 따라서 리듬 게임에서 audio timeline을 일반 JS timer나 renderer frame과 자동으로 동일시할 근거가 없다.

W3C High Resolution Time Level 3 역시 wall clock과 monotonic clock을 구분하고, `performance.now()` 계열은 monotonic measurement를 제공하지만 서로 다른 실행 환경 전체에서 영구적인 절대 시각으로 사용할 수 있는 것은 아니라고 설명한다.

Unity는 render frame의 `Update`와 physics의 fixed update가 서로 다른 빈도로 실행될 수 있다고 문서화한다. 네트워크 쪽에서도 Network Tick은 별도의 고정 주기로 실행되고 NetworkVariable 변경은 network tick에서 수집·전송된다.

Unreal Engine Character Movement는 movement RPC에 입력 발생과 관련된 timestamp를 포함하며 서버가 timestamp discrepancy를 검증하고 server-side delta time을 산정하는 사례를 제공한다.

따라서 다음의 개념적 분리는 외부 사례와 부합한다.

`audio timeline ≠ input timestamp ≠ render frame ≠ gameplay simulation step ≠ physics step ≠ network update`

실제 게임에서 일부 빈도를 같게 설정할 수는 있으나, **항상 동일해야 한다는 일반 규칙은 확인되지 않았다.**

---

### Q06 — hostless와 비동기·장기 진행

#### hostless

Nakama server-authoritative 방식에서는 gameplay data를 서버가 검증하고 match handler가 서버에서 실행된다. 이 구조에서는 특정 **플레이어 클라이언트가 gameplay host 역할을 맡지 않아도 되는** 실행 사례를 확인할 수 있다.

반대로 Nakama relayed multiplayer 문서는 해당 모델에서 client들 중 한 명이 host 역할을 하도록 결정한다고 설명한다. 즉 `host`의 존재는 multiplayer라는 장르 자체가 아니라 선택한 실행 topology와 연관될 수 있다.

Photon Fusion Shared Mode처럼 Master Client가 있고 이 역할이 이탈 시 다른 client에게 이전되는 모델도 존재한다. 역시 모든 multiplayer가 같은 host 의미를 사용하지 않는 사례다.

다만 청파 같이의 **초기 시작 hostless**와 **재대결에서도 hostless**는 동일 문제가 아니다. 입력 규칙에서는 재대결에 대한 공통 UX와 host 조건을 별도로 보존하고 있으며, 이 정책의 변경 여부는 외부 사례로 결정할 수 없다.

#### 장기 비동기

Nakama 공식 문서는 passive turn-based gameplay가 몇 시간에서 몇 주에 걸쳐 진행될 수 있으며, input을 DB에 저장한 후 현재 sequence가 끝나면 server loop를 종료하는 실행 예를 제공한다. 완전 비동기식인 경우 group과 storage/RPC를 사용한 다른 방식도 제시한다.

Apple GameKit 역시 turn 종료 시 다음 participant와 `matchData`, timeout을 저장·전달하며 turn timeout은 최대 90일까지 지정할 수 있다.

따라서 **장기 multiplayer에 지속적인 room connection이나 지속 tick이 본질적으로 항상 필요하다는 근거는 없다.** 이것은 외부 제품 사례에 대한 기술적 관찰이며, 현재 청파 같이 계약에서 비room·비tick 모델을 지원한다는 판정은 아니다.

---

# 2. S3-C01~C11 사례 색인

| ID | 관련 7축 | 외부 자료에서 확인한 특성 | 제약·미확인 | 근거 |
|---|---|---|---|---|
| **S3-C01 턴제 카드/보드** | ①③④⑤⑦ | active/passive turn cadence가 다를 수 있고 durable match state와 next participant 저장 사례 존재 | 동시 선택→동시 해결, private hand 처리의 현재 계약 표현 여부는 미확인 | R01 R04 R05 |
| **S3-C02 실시간 2D 협동** | ①②③④⑤⑥ | relay와 server authority 모두 co-op/실시간에 사용 가능한 사례. simulation/network cadence 존재 | 2D라는 이유만으로 authority·tick 방식 결정 불가. reconnect 복구 수준 미확인 | R01 R02 R11 |
| **S3-C03 반응속도/PvP** | ①②⑤⑦ | input prediction·rollback 및 server correction 사례 존재 | rollback이 필수라는 근거 없음. 결과 최종 확정점·보상 소비 경계 미확인 | R06 R07 |
| **S3-C04 RTS** | ①②③④⑤⑥⑦ | RTS 연구에서 explore/build/combat interaction을 분리해 latency 영향 분석. authoritative fixed-tick은 가능한 구현 사례 | RTS=lockstep 또는 특정 tick 모델이라는 근거 없음 | R17 R02 |
| **S3-C05 리듬** | ①②⑤⑥⑦ | audio clock이 별도 time coordinate를 가지며 output latency도 별도. monotonic timing 수단 존재 | 실제 판정 window, network latency 보정법, pause/resume 계약 미정 | R08 R09 |
| **S3-C06 레이싱/플랫포머** | ①②③⑤⑥⑦ | render/physics 주기 분리, continuous movement prediction/correction 사례 존재 | racing과 platformer가 동일 규칙/복구 모델을 가져야 한다는 근거 없음 | R07 R10 |
| **S3-C07 3D 공간/물리** | ②⑤⑥ | physics fixed step과 render frame이 독립 가능. server-side physics session도 제품 선택지로 존재 | 3D=physics=real-time multiplayer라는 일반화 불가 | R10 R02 |
| **S3-C08 비대칭 역할** | ①④⑤⑦ | 수신자별 메시지/객체 visibility 제한 가능 | 역할 전환 순간의 stale private response·cache 폐기 방식은 미확인 | R03 R13 |
| **S3-C09 host 없는 세션** | ③④⑤ | player-host 없는 server-authoritative 실행과 client-host 기반 relay 모두 공식 사례 존재 | 프로젝트 재대결 host 정책은 외부 기술 사례와 별개 | R02 R01 |
| **S3-C10 관전자/중도 참가** | ③④⑤ | join 시 initial state 전송, per-client visibility, late join event/state 분리 사례 존재 | participant↔spectator 전환 후 이전 view response의 무효화 경계 미확인 | R03 R13 R15 R16 |
| **S3-C11 비동기·장기 진행** | ①②③④⑤⑦ | 수시간~수주 turn, persisted state, offline participant, server loop 종료 사례 존재 | 현재 플랫폼이 비room/비DB/비tick 모델을 표현하는지는 미확인 | R01 R04 R05 |

이 표는 **외부 기술 특성 색인**이며 `현재 계약 표현 가능 / 선택 모델 추가 / 미지원·보류` 판정표가 아니다. STEP 3의 정식 matrix 산출물은 Astra 판단 대상으로 남긴다.

---

# 3. S3-T01~T06 전환·실패 시나리오

| ID | 외부 참고 사실 | 여기서 말할 수 없는 것 | Astra에 남는 질문 |
|---|---|---|---|
| **T01 같은 room의 새 경기 뒤 이전 응답** | GGPO도 session object를 단일 game session에 사용하도록 구분하고 state lifetime을 명시한다. 일반적으로 session/round identity가 기술적으로 의미 있을 수 있다는 참고는 가능 | 현행 room ID 외에 반드시 generation ID가 필요하다는 판정 불가 | 동일 room 안의 경기 A/B를 구분하는 현재 identity와 invalidation 범위는 무엇인가 |
| **T02 다른 room의 callback** | Nakama authoritative match는 각각 self-contained match state로 운영되는 서버 사례가 있음 | 서버 match isolation이 client async callback 오염까지 방지한다고 볼 수 없음 | action/refresh/leave/error 각각 어느 시점에 room/lifetime 검사가 필요한가 |
| **T03 관전 전환 뒤 private 정보** | server-side targeted delivery와 per-client visibility 구현 사례가 존재 | 전환 전에 이미 전송된 response/cache가 자동 제거되는 것은 아님 | viewer/role identity와 request lifetime을 어떻게 연결할 것인가 |
| **T04 재접속 시 이벤트 유실** | reconnect/rejoin, persisted/current state load, cached-event replay가 서로 별도 기능으로 존재 | refresh 성공이 event replay 지원을 뜻하지 않음 | 필요한 복구 의미가 current-state reconstruction인지 event replay인지 둘 다인지 |
| **T05 rollback 중 결과 중복** | GGPO는 rollback 중 sound/effect 부수효과를 defer하도록 명시 | reward/achievement/result commit까지 같은 방법을 적용해야 한다는 근거 없음 | speculative result와 committed result의 경계, 외부 소비의 idempotency 책임은 어디인가 |
| **T06 출시 활성화 중복** | 이번 외부 조사에서 새로운 release/activation 모델은 도입하지 않음 | 일반 배포 제품 사례로 현행 release 의미를 덮어쓸 수 없음 | 기존 소스/기능/activation/handoff 구분과 사건 identity를 프로젝트 근거로 판단해야 함 |

T06은 요청문 지시에 따라 별도 플랫폼 공개 서비스를 설계하거나 일반 외부 release 모델을 끌어오지 않았다. 입력 자료가 이미 소스/기능/activation을 구분하고 F02 handoff 불일치를 기존 finding으로 지정하고 있으므로 그 경계를 유지한다.

---

# 4. 주장 ID별 사실 / 추론 / 미확인

| 주장 ID | 분류 | 내용 |
|---|---|---|
| **A01** | 확인 사실 | relay server가 data를 전달하더라도 gameplay state를 검증하지 않는 공식 제품 모델이 존재한다 |
| **A02** | 확인 사실 | server-authoritative 모델에서 server가 gameplay data를 검증·broadcast하는 공식 사례가 존재한다 |
| **A03** | 추론 | transport와 authority를 플랫폼 선택표에서 독립 항목으로 다룰 근거가 있다 |
| **A04** | 확인 사실 | GGPO rollback은 과거 state save/load와 simulation re-execution을 요구한다 |
| **A05** | 확인 사실 | Unreal movement correction은 saved/pending move와 server correction을 함께 사용한다 |
| **A06** | 추론 | prediction / rollback / correction을 하나의 배타 enum으로 압축하면 다른 실행 특성을 잃을 수 있다 |
| **A07** | 확인 사실 | reconnect/rejoin이 가능해도 room/player lifetime 조건 때문에 실패할 수 있다 |
| **A08** | 확인 사실 | late joiner는 cache되지 않은 과거 event를 놓칠 수 있다 |
| **A09** | 추론 | reconnect, current-state reconstruction, event replay는 별도 요구로 기록하는 것이 타당하다 |
| **A10** | 확인 사실 | rollback 중 simulation 재실행으로 sound/effect가 반복될 수 있어 GGPO는 이를 defer하도록 안내한다 |
| **A11** | 미확인 | 동일 원리가 청파 같이의 결과·보상·meta progression commit 전체에 그대로 적용되는지 |
| **A12** | 확인 사실 | 서버에서 특정 participant만 대상으로 initial/private state를 보낼 수 있는 구현 사례가 존재한다 |
| **A13** | 미확인 | 역할 전환 전에 발행된 private response를 현재 플랫폼이 어떤 lifetime key로 폐기해야 하는지 |
| **A14** | 확인 사실 | audio clock, render frame, physics fixed step, network tick이 서로 별개의 time/cadence로 존재하는 공식 사례가 있다 |
| **A15** | 추론 | 미래 게임 공통 Core에 단일 숫자 tick을 모든 시간 개념의 기준으로 강제할 외부 근거는 없다 |
| **A16** | 확인 사실 | 수시간~수주에 걸친 passive turn multiplayer와 저장 후 server loop를 종료하는 제품 사례가 존재한다 |
| **A17** | 확인 사실 | 특정 player host 없이 server가 권위를 가지는 multiplayer와 player host를 사용하는 relay 방식이 모두 존재한다 |
| **A18** | 미확인 | 청파 같이에서 초기 hostless 또는 rematch hostless가 기존 규칙 변경을 요구하는 최종 조건 |

---

# 5. 검증한 공식 출처

모든 아래 자료의 **이번 확인일은 2026-10-01**이다. 기존 STEP 2 입력에서 후보였던 자료도 이번 조사에서 필요한 원문 부분을 다시 확인했다.

| ID | 문서 / 판본 | 확인 위치 | 이번 조사에서 사용한 범위 |
|---|---|---|---|
| **R01** | Heroic Labs — Nakama Multiplayer Engine / 현재 웹 문서, 버전 미표기 — https://heroiclabs.com/docs/nakama/concepts/multiplayer/ | `Synchronous Real-time`, `Relayed`, `Authoritative`, `Turn-based > Active/Passive` | relay/authority 구분, active/passive, 장기 async |
| **R02** | Heroic Labs — Authoritative Multiplayer / 현재 웹 문서 — https://heroiclabs.com/docs/nakama/concepts/multiplayer/authoritative/ | 서두, gameplay modes, match handler | server authority, fixed-tick 사례, server-side match lifecycle |
| **R03** | Heroic Labs — Match Runtime API / 현재 Lua runtime 문서 — https://heroiclabs.com/docs/nakama/server-framework/lua-runtime/function-reference/match-runtime/ | `broadcast_message` | join initial state, subset-presence delivery |
| **R04** | Apple GameKit — `GKTurnBasedMatch` / current Developer Documentation — https://developer.apple.com/documentation/gamekit/gkturnbasedmatch | Overview, matchData, participants/current participant | durable turn-based state |
| **R05** | Apple GameKit — `endTurn(withNextParticipants:turnTimeout:match:)` — https://developer.apple.com/documentation/gamekit/gkturnbasedmatch/endturn%28withnextparticipants%3Aturntimeout%3Amatch%3Acompletionhandler%3A%29 | Parameters | participant handoff, matchData, timeout |
| **R06** | GGPO — `DeveloperGuide.md`, `master` branch — https://github.com/pond3r/ggpo/blob/master/doc/DeveloperGuide.md | Game State and Inputs, save/load, speculative execution, best practices | rollback, deterministic state, side-effect deferral |
| **R07** | Epic Games — Unreal Engine **5.8** Networked Character Movement — https://dev.epicgames.com/documentation/unreal-engine/understanding-networked-movement-in-the-character-movement-component-for-unreal-engine?lang=en-US | Client Prediction, ServerMove, Server Corrections | timestamp, saved moves, prediction/correction |
| **R08** | W3C — **Web Audio API 1.1 Working Draft, 2026-09-22** — https://www.w3.org/TR/webaudio-1.1/ | §1.1.1 `currentTime`, §1.2.2 latency | audio time coordinate, clock separation, output latency |
| **R09** | W3C — **High Resolution Time Level 3 Working Draft, 2026-09-01** — https://www.w3.org/TR/hr-time-3/ | §1, §2.1, Time Origin | monotonic/wall-clock distinction, time-origin limitations |
| **R10** | Unity Manual — Fixed updates / `current` manual — https://docs.unity3d.com/Manual/fixed-updates.html | Fixed updates | physics step과 render frame 분리 |
| **R11** | Unity Netcode for GameObjects **2.1.1** — NetworkTime and ticks — https://docs-multiplayer.unity3d.com/netcode/2.1.1/advanced-topics/networktime-ticks/ | LocalTime/ServerTime, Network Ticks | network clock/tick과 physics/render 시간 구분 |
| **R12** | Unity Multiplayer **1.8.1** — Tick and update rates — https://docs-multiplayer.unity3d.com/netcode/1.8.1/learn/ticks-and-update-rates/ | Tick rate, Update rate | simulation rate와 network update rate 구분. 구버전 자료임을 명시 |
| **R13** | Unity Netcode **2.0.0** — Object visibility — https://docs-multiplayer.unity3d.com/netcode/2.0.0/basics/object-visibility/ | CheckObjectVisibility, NetworkShow/NetworkHide | client별 network visibility 제어 |
| **R14** | Photon Realtime **5** — Analyzing Disconnects & Timeouts — https://doc.photonengine.com/realtime/v5/troubleshooting/analyzing-disconnects | ReconnectAndRejoin, PlayerTTL | reconnect와 session lifetime 조건 |
| **R15** | Photon **PUN 2** — Cached Events for Late Joiners, 2026-08-19 갱신 — https://doc.photonengine.com/pun/current/gameplay/cached-events | Cached Events, Ordered Delivery | late join event 유실/replay 사례 |
| **R16** | Photon **Fusion 2** — RPCs / Late Joiners — https://doc.photonengine.com/fusion/v2/video-tutorials/shared-mode-rpcs | Late Joiners, RPC vs Networked state | transient event와 retained/current state 차이 |
| **R17** | Mark Claypool — *The Effect of Latency on User Performance in Real-Time Strategy Games*, Computer Networks 49(1), 2005 — https://web.cs.wpi.edu/~claypool/papers/rts/ | publication metadata, abstract | RTS interaction을 explore/build/combat로 나눈 원 연구의 범위만 사용. 특정 network architecture 근거로 사용하지 않음 |

### 출처 사용 제한

R12처럼 현재 최신판이 아닌 공식 문서는 **개념적 사례**로만 사용했다.  
R17은 이번 조사에서 저자 공식 publication page와 abstract까지 확인했으며, 논문 본문에만 존재하는 세부 수치나 실험 결과를 추가 주장하지 않았다.  
특정 제품의 API나 topology는 그 제품의 사례일 뿐 청파 같이 Game Platform의 필수 구조로 일반화하지 않았다.

---

# 6. Work Astra가 판단해야 할 쟁점

1. **동일 room 내부의 경기 lifetime**을 room identity와 별도로 식별해야 하는 요구가 실제 현재 계약에 존재하는지와, 존재한다면 어느 계층의 책임인지
2. `authority / transport / prediction / rollback / correction` 중 어떤 항목이 플랫폼 선택표의 기술 특성으로만 남고 어떤 항목이 계약에 드러나야 하는지
3. reconnect에서 필요한 보장이 **현재 state 재구성**, **event replay**, **양쪽 모두**, 또는 게임별 선택인지
4. rollback·retry·재접속 후 재실행에서 **speculative result와 committed result**, presentation effect, 점수·보상·meta progression 소비 경계를 어디에 둘지
5. participant↔spectator 또는 비대칭 role 전환 시 **server 정보 제공 권한뿐 아니라 이미 발행된 request/response와 client cache의 lifetime**을 무엇으로 구분할지
6. audio/input/render/simulation/physics/network의 여러 시간축 중 플랫폼이 공통으로 알아야 하는 최소 개념이 무엇인지
7. continuous movement/physics 모델을 추가하더라도 renderer FPS·simulation step·physics step·network update를 하나의 tick으로 강제하지 않을지
8. 초기 시작만 hostless인 경우와 **rematch에서도 hostless**인 경우를 현재 제품 규칙상 어떻게 다르게 취급할지
9. passive/long-running multiplayer처럼 연결·room·tick이 지속되지 않는 실행 특성이 현재 선택표만으로 충분히 기술되는지
10. late join에서 **현재 state 전달**과 **과거 event 전달** 중 게임별로 어떤 의미가 필요한지
11. T01~T03에서 room/generation/disposed 외에 **match/round/viewer/role lifetime** 같은 별도 identity가 정말 필요한지
12. 위 쟁점 중 어느 것이 기존 Core 전제의 문제를 드러내 STEP 2 회귀 조건에 해당하는지

이 쟁점들은 외부 조사에서 답을 확정할 수 없는 항목이며, **규칙 적합성·계약 적합성·구현 증거를 독립적으로 판단해야 한다**는 STEP 2의 구분을 유지해야 한다.

---

## 최종 보조 조사 상태

**S3-C01~C11:** 전부 색인 완료  
**S3-T01~T06:** 전부 참고 사실·제약·남은 질문 정리 완료  
**Q01~Q06:** 공식 자료 재확인 완료  
**정식 지원 matrix:** 미작성  
**Core 변경 필요성:** 미판정  
**계약 변경안:** 미작성  
**저장소 구현 지원 여부:** 미판정  
**코드/규칙/실행 계획 변경:** 없음

따라서 이 문서는 **Work Astra가 STEP 3 정식 matrix를 작성하기 전 사용할 외부 보조 근거**로 전달할 수 있으며, 실행 계획이나 프로젝트 내부 evidence를 대체하지 않는다.
